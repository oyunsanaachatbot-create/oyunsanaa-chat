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
      model = Strin
