import endent from 'endent';
import { createParser, type ParsedEvent, type ReconnectInterval } from 'eventsource-parser';

const createPrompt = (input: string) => endent`${input}`;

export async function OpenAIStream(
  inputCode: string,
  model: string,
  key?: string,
) {
  const apiKey = key || process.env.OPENAI_API_KEY; // ✅ server only
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
  if (!inputCode?.trim()) throw new Error('Missing inputCode');

  const user = { role: 'user', content: createPrompt(inputCode) };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [user],
      temperature: 0.2,
      stream: true,
    }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => res.statusText);
    throw new Error(`OpenAI error (${res.status}): ${t}`);
  }
  if (!res.body) throw new Error('OpenAI response has no body');

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
        if (event.type !== 'event') return;

        const data = event.data;
        if (data === '[DONE]') {
          controller.close();
          return;
        }

        try {
          const json = JSON.parse(data);
          const text: string = json?.choices?.[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        } catch (e) {
          controller.error(e);
        }
      });

      try {
        for await (const chunk of res.body as any) {
          // ✅ хамгийн чухал нь энэ: stream=true
          parser.feed(decoder.decode(chunk, { stream: true }));
        }
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return stream;
}
