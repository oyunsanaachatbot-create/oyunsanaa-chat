import { ChatBody } from '@/types/types';
import { OpenAIStream } from '@/utils/chatStream';

export const runtime = 'nodejs'; // ✅ edge биш, хамгийн найдвартай

export async function POST(req: Request): Promise<Response> {
  try {
    const { inputCode, model, apiKey } = (await req.json()) as ChatBody;

    const apiKeyFinal = apiKey || process.env.OPENAI_API_KEY; // ✅ public биш
    if (!apiKeyFinal) {
      return new Response('Missing OPENAI_API_KEY', { status: 400 });
    }

    const stream = await OpenAIStream(inputCode, model, apiKeyFinal);

    return new Response(stream, {
      headers: {
        // stream-ийг зөв дамжуулахад хэрэгтэй байж болно
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
}
