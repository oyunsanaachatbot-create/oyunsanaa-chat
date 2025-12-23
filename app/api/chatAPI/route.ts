export const runtime = 'nodejs';

type ReqBody = {
  inputCode: string;
  model?: string;
};

export async function GET() {
  return new Response('OK. Use POST /api/chatAPI', { status: 200 });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { inputCode, model } = (await req.json()) as ReqBody;

    if (!inputCode || typeof inputCode !== 'string') {
      return new Response('Missing inputCode', { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response('Missing OPENAI_API_KEY', { status: 400 });
    }

    // ✅ Танай OpenAIStream helper-ийг хэвээр ашиглая
    const { OpenAIStream } = await import('@/utils/chatStream');

    const stream = await OpenAIStream(inputCode, model || 'gpt-4o', apiKey);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
