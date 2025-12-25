'use client';

import { useMemo, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { RequireSignupModal } from '@/components/chat/RequireSignupModal';

type Msg = { role: 'user' | 'assistant'; content: string };
const FREE_QUESTIONS = 3;

export default function TryPage() {
  const supabase = useMemo(() => supabaseBrowser(), []);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const userQuestions = messages.filter(m => m.role === 'user').length;
  const canAsk = userQuestions < FREE_QUESTIONS;

  const send = async () => {
    if (!text.trim() || sending) return;

    if (!canAsk) {
      setShowSignup(true);
      return;
    }

    setSending(true);
    const u: Msg = { role:'user', content:text.trim() };
    setMessages(m => [...m, u]);
    setText('');

    // TODO: энд /api/chat-тай холбох
    setTimeout(() => {
      setMessages(m => [...m, { role:'assistant', content:'OK (Guest горим). Үргэлжлүүлэх үү?' }]);
      setSending(false);
    }, 250);
  };

  const goLogin = () => {
    window.location.href = '/login';
  };

  return (
    <div style={{ padding:16, display:'flex', flexDirection:'column', height:'100vh' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontWeight:800 }}>Guest Chat</div>
          <div style={{ fontSize:12, opacity:.7 }}>
            Туршилт: {Math.max(0, FREE_QUESTIONS - userQuestions)} асуулт үлдсэн
          </div>
        </div>
        <button onClick={goLogin}>Нэвтрэх</button>
      </div>

      <div style={{ flex:1, overflow:'auto', marginTop:12, border:'1px solid #ddd', borderRadius:12, padding:12 }}>
        {messages.length === 0 ? (
          <div style={{ opacity:.65 }}>
            Энд 3 асуулт үнэгүй туршиж болно. Дараа нь бүртгүүлээд үргэлжлүүлнэ.
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ fontSize:12, opacity:.6 }}>{m.role}</div>
              <div style={{ whiteSpace:'pre-wrap' }}>{m.content}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display:'flex', gap:8, marginTop:12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={canAsk ? 'Энд бичнэ…' : 'Үргэлжлүүлэхийн тулд бүртгүүлнэ…'}
          style={{ flex:1, padding:12, borderRadius:12, border:'1px solid #ddd' }}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        />
        <button onClick={send} disabled={sending}>Send</button>
      </div>

      <RequireSignupModal open={showSignup} onClose={() => setShowSignup(false)} />
    </div>
  );
}
