// src/lib/chat/sendChat.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SendChatArgs = {
  chat_id: string;
  inputCode: string;
  model?: string;
  onToken?: (delta: string) => void;
};

export async function sendChat({ chat_id, inputCode, model = "gpt-4o", onToken }: SendChatArgs) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) throw new Error("No session token (not logged in)");

  const res = await fetch("/api/chatAPI", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ энэ л 401-ийг шийднэ
    },
    body: JSON.stringify({ chat_id, inputCode, model }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${txt}`);
  }

  // stream уншина
  const reader = res.body?.getReader();
  if (!reader) return "";

  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    full += chunk;
    onToken?.(chunk);
  }

  return full;
}
