import endent from 'endent';
import { createParser, type ParsedEvent } from 'eventsource-parser';

const createPrompt = (input: string) => endent`${input}`;

export async function OpenAIStream(
  inputCode: string,
  model: string,
  key?: string,
) {
  const apiKey = key || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
  if (!inputCode?.trim()) throw new Error('Missing inputCode');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: createPrompt(inputCode) }],
      temperature: 0.2,
      stream: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI error ${res.status}`);
  }
  if (!res.body) {
    throw new Error('OpenAI response has no body');
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let isClosed = false;

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const parser = createParser((event: ParsedEvent) => {
        if (event.type !== 'event') return;

        if (event.data === '[DONE]') {
          if (!isClosed) {
            isClosed = true;
            controller.close();
          }
          return;
        }

        try {
          const json = JSON.parse(event.data);
          const delta = json?.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta.length > 0) {
            controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          if (!isClosed) controller.error(err);
        }
      });

      try {
        for await (const chunk of res.body) {
          if (isClosed) break;
          // ❗ хамгийн чухал засвар: stream:false
          parser.feed(decoder.decode(chunk));
        }
      } catch (err) {
        if (!isClosed) controller.error(err);
      }
    },
  });
}
