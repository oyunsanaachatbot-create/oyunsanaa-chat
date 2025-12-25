import OpenAI from "openai";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  timeout: 60_000,
  maxRetries: 2,
});

function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

async function fileToDataURL(file: File): Promise<string> {
  const ab = await file.arrayBuffer();
  const b64 = Buffer.from(ab).toString("base64");
  return `data:${file.type};base64,${b64}`;
}

export async function GET() {
  return new Response("OK. Use POST.", { status: 200 });
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = supabaseServer();

    // ✅ login хийсэн user-г server дээр танина
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const user_id = authData.user.id;

    const contentType = req.headers.get("content-type") || "";
    let model = "gpt-4o";
    let inputCode = "";
    let imageDataUrl: string | null = null;
    let chat_id = "";

    // ✅ multipart (image) or json (text)
    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      model = String(form.get("model") || "gpt-4o");
      inputCode = String(form.get("inputCode") || "");
      chat_id = String(form.get("chat_id") || "");

      const img = form.get("image");
      if (img && typeof img !== "string") {
        imageDataUrl = await fileToDataURL(img as File);
      }
    } else {
      const body = await req.json().catch(() => ({} as any));
      model = body?.model || "gpt-4o";
      inputCode = body?.inputCode || "";
      chat_id = body?.chat_id || "";
    }

    if (!chat_id) {
      return new Response(JSON.stringify({ error: "Missing chat_id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ chat эзэмшигч мөн эсэх (давхар хамгаалалт)
    const { data: chatRow } = await supabase
      .from("chats")
      .select("id")
      .eq("id", chat_id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (!chatRow) {
      return new Response(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ system prompt (oyunsanaa)
    const system =
      'Чи Oyunsanaa нэртэй Монгол хэлтэй дулаан сэтгэлийн туслагч. "Би 2023 он хүртэл" гэх мэт зүйл хэлэхгүй. Хэрэглэгчийн асуултанд шууд төвлөрч, ойлгомжтой, эелдэг хариул.';

    // ✅ system message нэг л удаа оруулна
    const { data: sysExists } = await supabase
      .from("messages")
      .select("id")
      .eq("chat_id", chat_id)
      .eq("user_id", user_id)
      .eq("role", "system")
      .limit(1);

    if (!sysExists || sysExists.length === 0) {
      await supabase.from("messages").insert({
        chat_id,
        user_id,
        role: "system",
        content: system,
      });
    }

    // ✅ user message хадгална
    const userText = (inputCode || "").trim();
    // (хоосон байхыг зөвшөөрөхгүй)
    const safeUserText = userText.length ? userText : " ";

    await supabase.from("messages").insert({
      chat_id,
      user_id,
      role: "user",
      content: safeUserText,
    });

    // ✅ хамгийн сүүлийн N message-г авч model-д өгнө (oyunsanaa “санана”)
    const N = 30;
    const { data: recent } = await supabase
      .from("messages")
      .select("role, content")
      .eq("chat_id", chat_id)
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(N);

    const history = (recent ?? [])
      .reverse()
      .map((m) => ({ role: m.role as any, content: m.content }));

    // ✅ vision дэмжихгүй model орж ирвэл хамгаална
    if (!model || typeof model !== "string") model = "gpt-4o";
    if (imageDataUrl && model.startsWith("gpt-3.5")) model = "gpt-4o";

    // ✅ user content (зурагтай үед)
    const userContent: any[] = [];
    if (safeUserText.trim()) userContent.push({ type: "text", text: safeUserText });
    if (imageDataUrl) userContent.push({ type: "image_url", image_url: { url: imageDataUrl } });

    // model руу явуулахдаа: history + (image байвал) хамгийн сүүлийн user message-г rich content-оор overwrite хийе
    // => image ашиглах үед зөвхөн хамгийн сүүлийн user message дээр image_url орно.
    const messagesForModel =
      imageDataUrl
        ? [
            ...history.filter((m) => m.role !== "user").slice(0, -1), // хамгаалалттай
            ...history.filter((m) => m.role === "system"),
            ...history.filter((m) => m.role === "assistant"),
            // хамгийн сүүлийн user-г rich content болгож өгнө
            { role: "user", content: userContent },
          ]
        : history;

    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: messagesForModel as any,
    });

    // ✅ stream-ийг буцаахын зэрэгцээ бүх reply-г цуглуулаад DB-д хадгална
    let fullReply = "";

    const rs = new ReadableStream<Uint8Array>({
      async start(controller) {
        const enc = new TextEncoder();
        try {
          for await (const chunk of stream as any) {
            const delta = chunk?.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              fullReply += delta;
              controller.enqueue(enc.encode(delta));
            }
          }
        } catch (e) {
          controller.enqueue(enc.encode("\n[stream error]\n"));
        } finally {
          // ✅ assistant reply хадгална (stream дууссаны дараа)
          const replyToSave = (fullReply || "").trim() || "[empty]";
          await supabase.from("messages").insert({
            chat_id,
            user_id,
            role: "assistant",
            content: replyToSave,
          });

          controller.close();
        }
      },
    });

    return new Response(rs, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "route_error",
        message: err?.message || "unknown",
        name: err?.name,
        cause: err?.cause?.message || err?.cause,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
