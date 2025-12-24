export const runtime = 'nodejs';

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
        model: model || 'gpt-4o-mini',
        input: [
          { role: 'user', content: [{ type: 'input_text', text: inputCode }] },
        ],
        stream: true,
      }),
    });

    if (!upstream.ok) {
      const t = await upstream.text().catch(() => upstream.statusText);
      return new Response(t, { status: upstream.status });
    }

    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (e: any) {
    return new Response(e?.message || 'Error', { status: 500 });
  }
}
