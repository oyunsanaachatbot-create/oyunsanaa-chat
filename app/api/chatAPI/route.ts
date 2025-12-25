import OpenAI from "openai";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

// OpenAI client
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
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

function toTextStreamWithCapture(
  stream: AsyncIterable<any>,
  onDone: (fullText: string) => Promise<void>
) {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      let full = "";

      try {
        for await (const chunk of stream) {
          const delta = chunk?.choices?.[0]?.delta?.content ?? "";
          if (delta) {
            full += delta;
            controller.enqueue(enc.encode(delta));
          }
        }
      } catch (e) {
        controller.enqueue(enc.encode("\n[stream error]\n"));
      } finally {
        try {
          await onDone((full || "").trim());
        } catch {
          // ignore save errors to not break stream response
        }
        controller.close();
      }
    },
  });
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

    // ✅ Logged-in user
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const user_id = authData.user.id;

    // Parse request (multipart or json)
    const contentType = req.headers.get("content-type") || "";
    let model = "gpt-4o";
    let inputCode = "";
    let imageDataUrl: string | null = null;
    let chat_id = "";

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

    // ✅ Ensure chat belongs to this user
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

    // System prompt (Oyunsanaa)
    const system =
      'Чи Oyunsanaa нэртэй Монгол хэлтэй дулаан сэтгэлийн туслагч. "Би 2023 он хүртэл" гэх мэт зүйл хэлэхгүй. Хэрэглэгчийн асуултанд шууд төвлөрч, ойлгомжтой, эелдэг хариул.';

    // ✅ Insert system message once per chat
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

    // Save user message (text only) to DB
    const userText = (inputCode || "").trim();
    const safeUserText = userText.length ? userText : " ";

    await supabase.from("messages").insert({
      chat_id,
      user_id,
      role: "user",
      content: safeUserText,
    });

    // Load last N messages for memory
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
      .map((m) => ({ role: m.role as any, content: m.content as any }));

    // Vision guard
    if (!model || typeof model !== "string") model = "gpt-4o";
    if (imageDataUrl && model.startsWith("gpt-3.5")) model = "gpt-4o";

    // If image provided, we send rich user content (text + image_url) as the final user msg.
    // DB still stores text-only user message (above).
    let messagesForModel: any[] = history;

    if (imageDataUrl) {
      const userContent: any[] = [];
      if (safeUserText.trim()) userContent.push({ type: "text", text: safeUserText });
      userContent.push({ type: "image_url", image_url: { url: imageDataUrl } });

      // Replace the last user message with rich content (simple approach):
      messagesForModel = history.slice(0, -1).concat([{ role: "user", content: userContent }]);
    }

    // OpenAI streaming
    const stream = await openai.chat.completions.create({
      model,
      stream: true,
      messages: messagesForModel,
    });

    // Stream back to UI + capture full reply to save
    const rs = toTextStreamWithCapture(stream, async (fullText) => {
      const replyToSave = fullText || "[empty]";
      await supabase.from("messages").insert({
        chat_id,
        user_id,
        role: "assistant",
        content: replyToSave,
      });
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
