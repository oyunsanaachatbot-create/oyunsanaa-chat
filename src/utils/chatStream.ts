import endent from 'endent';
import { createParser, type ParsedEvent, type ReconnectInterval } from 'eventsource-parser';

const createPrompt = (inputCode: string) => endent`${inputCode}`;

export const OpenAIStream = async (
  inputCode: string,
  model: string,
  key?: string, // ✅ server env key энд ирнэ
) => {
  if (!inputCode?.trim()) {
    throw new Error('Missing inputCode');
  }

  const apiKey = key || process.env.OPENAI_API_KEY; // ✅ зөвхөн server env
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  // ✅ User-ийн бичсэн зүйл USER role-оор явна
  const userMessage = { role: 'user', content: createPrompt(inputCode) };

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [userMessage],
      temperature: 0.2,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`OpenAI API error (${res.status}): ${errText}`);
  }

  if (!res.body) {
    throw new Error('OpenAI response has no body');
  }

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

          // ✅ delta.content байхгүй үед '' гэж үзнэ
          const text: string = json?.choices?.[0]?.delta?.content ?? '';
          if (text) controller.enqueue(encoder.encode(text));
        } catch (e) {
          controller.error(e);
        }
      });

      try {
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      } catch (e) {
        controller.error(e);
      }
    },
  });

  return stream;
};
