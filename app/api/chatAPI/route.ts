import { ChatBody } from '@/types/types';
import { OpenAIStream } from '@/utils/chatStream';

export const runtime = 'nodejs';

export async function GET() {
  // Browser-оос шууд ороход 405 биш, тайлбартай 200 буцаана
  return new Response('OK. Use POST /api/chat', { status: 200 });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { inputCode, model } = (await req.json()) as ChatBody;

    const apiKeyFinal = process.env.OPENAI_API_KEY;
    if (!apiKeyFinal) return new Response('Missing OPENAI_API_KEY', { status: 400 });

    const stream = await OpenAIStream(inputCode, model, apiKeyFinal);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (e) {
    console.error(e);
    return new Response('Error', { status: 500 });
  }
}
