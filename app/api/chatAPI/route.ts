import { OpenAIStream } from '@/utils/chatStream'; // чи OpenAIStream байрлуулсан path-аа тааруул
import type { ChatBody } from '@/types/types';

export const runtime = 'nodejs';

export async function GET() {
  return new Response('OK. Use POST.', { status: 200 });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { inputCode, model } = (await req.json()) as ChatBody;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 400 });

    const stream = await OpenAIStream(inputCode, model, apiKey);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err: any) {
    return new Response(err?.message || 'Error', { status: 500 });
  }
}
