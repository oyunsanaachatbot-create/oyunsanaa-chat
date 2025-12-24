import OpenAI from 'openai';

export const runtime = 'nodejs';

// ✅ Vercel дээр "Connection error" багасгах тохируулга
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  timeout: 60_000,  // 60s
  maxRetries: 2,
});

function toTextStream(stream: AsyncIterable<any>) {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        for await (const chunk of stream) {
          const delta = chunk?.choices?.[0]?.delta?.content ?? '';
          if (delta) controller.enqueue(enc.encode(delta));
        }
      } catch (e) {
        controller.enqueue(enc.encode('\n[stream error]\n'));
      } finally {
        controller.close();
      }
    },
  });
}

async function fileToDataURL(file: File): Promise<string> {
  const ab = await file.arrayBuffer();
  const b64 = Buffer.from(ab).toString('base64');
  return `data:${file.type};base64,${b64}`;
}

export async function GET() {
  return new Response('OK. Use POST.', { status: 200 });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Missing OPENAI_API_KEY' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let model = 'gpt-4o';
    let inputCode = '';
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
      const body = await req.json().catch(() => ({} as any));
      model = body?.model || 'gpt-4o';
      inputCode = body?.inputCode || '';
    }

    // ✅ vision дэмжихгүй model орж ирвэл хамгаалж gpt-4o болгож өгнө
    if (!model || typeof model !== 'string') model = 'gpt-4o';
    if (imageDataUrl && model.startsWith('gpt-3.5')) {
      model = 'gpt-4o';
    }

    const system =
      'Чи Oyunsanaa нэртэй Монгол хэлтэй дулаан сэтгэлийн туслагч. "Би 2023 он хүртэл" гэх мэт зүйл хэлэхгүй. Хэрэглэгчийн асуултанд шууд төвлөрч, ойлгомжтой, эелдэг хариул.';

    // ✅ Зурагтай үед: text + image_url
    const userContent: any[] = [];
    const txt = (inputCode || '').trim();
    if (txt) userContent.push({ type: 'text', text: txt });
    if (imageDataUrl) userContent.push({ type: 'image_url', image_url: { url: imageDataUrl } });

    // (хоосон байхыг зөвшөөрөхгүй)
    if (userContent.length === 0) {
      userContent.push({ type: 'text', text: ' ' });
    }

    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userContent },
      ],
    });

    return new Response(toTextStream(stream), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err: any) {
    // ✅ Connection error яг юунаас болсныг харахын тулд JSON болгож буцаана
    return new Response(
      JSON.stringify({
        error: 'route_error',
        message: err?.message || 'unknown',
        name: err?.name,
        cause: err?.cause?.message || err?.cause,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
