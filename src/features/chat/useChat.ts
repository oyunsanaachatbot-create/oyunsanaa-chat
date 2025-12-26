'use client';

import { useCallback, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export type Role = 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: Role;
  content: string;
  created_at?: string;
};

type RecentChat = { id: string; title: string; created_at: string };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

async function requireSession() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('NOT_LOGGED_IN');

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error('NO_USER');

  return { token, user };
}

export function useChat() {
  const didInitRef = useRef(false);

  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const [recentOpen, setRecentOpen] = useState(false);
  const [recent, setRecent] = useState<RecentChat[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);

  const createNewChat = useCallback(async () => {
    const { user } = await requireSession();
    const { data: newChat, error } = await supabase
      .from('chats')
      .insert({ user_id: user.id, title: 'New chat' })
      .select('id')
      .single();

    if (error || !newChat?.id) throw error || new Error('CHAT_CREATE_FAILED');

    setChatId(newChat.id);
    setMessages([]); // ✅ fresh screen
    return newChat.id as string;
  }, []);

  const loadRecent = useCallback(async () => {
    setRecentLoading(true);
    try {
      const { user } = await requireSession();
      const { data, error } = await supabase
        .from('chats')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setRecent(
        (data || []).map((c: any) => ({
          id: c.id,
          title: c.title || 'Chat',
          created_at: c.created_at,
        })),
      );
    } finally {
      setRecentLoading(false);
    }
  }, []);

  const openChat = useCallback(async (cid: string) => {
    setChatId(cid);

    const { data, error } = await supabase
      .from('messages')
      .select('id, role, content, created_at')
      .eq('chat_id', cid)
      .order('created_at', { ascending: true })
      .limit(300);

    if (error) throw error;

    const mapped: ChatMessage[] = (data || [])
      .filter((r: any) => r.role === 'user' || r.role === 'assistant')
      .map((r: any) => ({
        id: r.id,
        role: r.role,
        content: r.content || '',
        created_at: r.created_at,
      }));

    setMessages(mapped);
  }, []);

  // ✅ init: ороход "шинэ chat" + history жагсаалтыг бэлэн болгоно
  const init = useCallback(async () => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    await createNewChat();
    await loadRecent();
  }, [createNewChat, loadRecent]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!chatId) return;

    const { token } = await requireSession();

    const userMsgId = crypto.randomUUID();
    const asstMsgId = crypto.randomUUID();

    // UI optimistic
    setMessages((p) => [
      ...p,
      { id: userMsgId, role: 'user', content: trimmed },
      { id: asstMsgId, role: 'assistant', content: '' },
    ]);

    setLoading(true);
    try {
      const res = await fetch('/api/chatAPI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatId,
          inputCode: trimmed,
          model: 'gpt-4o',
        }),
      });

      if (!res.ok || !res.body) {
        const t = await res.text().catch(() => '');
        setMessages((p) =>
          p.map((m) => (m.id === asstMsgId ? { ...m, content: `API error: ${t || res.status}` } : m)),
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((p) => p.map((m) => (m.id === asstMsgId ? { ...m, content: acc } : m)));
      }

      // ✅ Persist to Supabase (client-side)
      // Хэрэв RLS зөв бол энд 2 мөр нэмэгдэнэ.
      await supabase.from('messages').insert([
        { id: userMsgId, chat_id: chatId, role: 'user', content: trimmed },
        { id: asstMsgId, chat_id: chatId, role: 'assistant', content: acc },
      ]);

      // title-г анхны user message-ээр нэг удаа тохируулъя (сайхан history)
      await supabase
        .from('chats')
        .update({ title: trimmed.slice(0, 40) })
        .eq('id', chatId);
      // recent refresh
      loadRecent();
    } finally {
      setLoading(false);
    }
  }, [chatId, loadRecent]);

  return {
    chatId,
    messages,
    loading,

    recentOpen,
    setRecentOpen,
    recent,
    recentLoading,

    init,
    createNewChat,
    loadRecent,
    openChat,
    sendMessage,
    setMessages,
  };
}
