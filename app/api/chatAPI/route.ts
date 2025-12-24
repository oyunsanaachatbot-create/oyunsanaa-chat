import { OpenAIStream } from '@/utils/chatStream';
import type { ChatBody } from '@/types/types';

export const runtime = 'nodejs';

async function fileToDataURL(file: File): Promise<string> {
  const ab = await file.arrayBuffer();
  const b64 = Buffer.from(ab).toString('base64');
  return `data:${file.type};base64,${b64}`;
}

export async function GET() {
  return new Response('OK. Use POST.', { status: 200 });
}

export async function POST(req: Request): Promise<Response> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return new Response('Missing OPENAI_API_KEY', { status: 400 });

    const contentType = req.headers.get('content-type') || '';
    let inputCode = '';
    let model: string = 'gpt-4o';
    let imageDataUrl: string | null = null;

    // ✅ multipart (image) or json (text)
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      model = String(form.get('model') || 'gpt-4o');
      inputCode = String(form.get('inputCode') || '');
      const img = form.get('image');
      if (img && typeof img !== 'string') {
        imageDataUrl = await fileToDataURL(img as File);
      }
    } else {
      const body = (await req.json()) as ChatBody;
      inputCode = body?.inputCode || '';
      model = body?.model || 'gpt-4o';
    }

    // ⚠️ Танай OpenAIStream одоогоор зөвхөн (text, model, apiKey) авдаг.
    // Image ирсэн үед бид text-д тэмдэг тавиад явуулна (fallback).
    // Хэрвээ чи OpenAIStream-аа image дэмждэг болгох бол дараа нь тэр файлыг 1 удаа засна.
    const finalText =
      imageDataUrl
        ? `${inputCode?.trim() || ''}\n\n[Image attached: ${imageDataUrl.slice(0, 30)}...]`
        : (inputCode || '');

    const stream = await OpenAIStream(finalText, model, apiKey);

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
