import endent from 'endent';
import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from 'eventsource-parser';

const createPrompt = (inputCode: string) => {
  if (!inputCode) return '';
  return endent`${inputCode}`;
};

export const OpenAIStream = async (
  inputCode: string,
  model: string,
  key?: string,
) => {
  const prompt = createPrompt(inputCode);

  // ⚠️ Анхных шигээ system ашиглая (гэхдээ prompt нь string байна)
  const system = { role: 'system', content: prompt };

  const apiKey = key || process.env.OPENAI_API_KEY; // ✅ server only
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages: [system],
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (!res.ok) {
    const statusText = res.statusText;
    const result = await res.text().catch(() => statusText);
    throw new Error(`OpenAI API returned an error: ${result || statusText}`);
  }
  if (!res.body) throw new Error('OpenAI response has no body');

  let isClosed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        // ✅ reconnect event ирвэл алгасна
        if (event.type !== 'event') return;

        const data = event.data;

        if (data === '[DONE]') {
          if (!isClosed) {
            isClosed = true;
            controller.close();
          }
          return;
        }

        try {
          const json = JSON.parse(data);
          const text: string = json?.choices?.[0]?.delta?.content ?? '';
          // ✅ undefined/empty үед enqueue хийхгүй
          if (text) controller.enqueue(encoder.encode(text));
        } catch (e) {
          if (!isClosed) controller.error(e);
        }
      };

      const parser = createParser(onParse);

      try {
        for await (const chunk of res.body as any) {
          if (isClosed) break;
          parser.feed(decoder.decode(chunk)); // ✅ stream:true хэрэггүй
        }
      } catch (e) {
        if (!isClosed) controller.error(e);
      }
    },
  });

  return stream;
};
