export const runtime = 'nodejs';

function extractTextFromResponsesSSELine(line: string): string {
  // line: "data: {...}" эсвэл "event: ..."
  if (!line.startsWith('data:')) return '';
  const payload = line.slice(5).trim();
  if (!payload || payload === '[DONE]') return '';

  try {
    const json = JSON.parse(payload);

    // Responses API event-үүдээс текст гаргах (олон төрөл байдаг)
    // хамгийн нийтлэг нь response.output_text.delta / response.output_text.done
    const type = json.type;

    if (type === 'response.output_text.delta') {
      return json.delta ?? '';
    }
    if (type === 'response.output_text.done') {
      return json.text ?? '';
    }

    // Зарим үед item/content дотор гарч ирж болно:
    // (аюулгүй fallback)
    const out = json.response?.output;
    if (Array.isArray(out)) {
      let acc = '';
      for (const item of out) {
        const content = item?.content;
        if (Array.isArray(content)) {
          for (const c of content) {
            if (c?.type === 'output_text' && typeof c?.text === 'string') acc += c.text;
          }
        }
      }
      return acc;
    }

    return '';
  } catch {
    return '';
  }
}

export async function POST(req: Request) {
  try {
    const { inputCode, model } = (await req.json()) as {
      inputCode: string;
      model?: string;
    };

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 400 });
    if (!inputCode?.trim()) return new Response('Missing inputCode', { status: 400 });

    const upstream = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'gpt-4o',
        input: [
          { role: 'user', content: [{ type: 'input_text', text: inputCode }] },
        ],
        stream: true,
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const t = await upstream.text().catch(() => upstream.statusText);
      return new Response(t, { status: upstream.status || 500 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const reader = upstream.body!.getReader();
        let buffer = '';

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // SSE нь мөр мөрөөр ирдэг
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const raw of lines) {
              const line = raw.trimEnd();
              const text = extractTextFromResponsesSSELine(line);
              if (text) controller.enqueue(encoder.encode(text));
            }
          }
        } catch (e) {
          controller.error(e);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (e: any) {
    return new Response(e?.message || 'Error', { status: 500 });
  }
}
