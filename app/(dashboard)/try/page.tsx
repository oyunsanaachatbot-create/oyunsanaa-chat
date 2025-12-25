'use client';

import { useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };
const FREE_QUESTIONS = 3;

export default function TryPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [showGate, setShowGate] = useState(false);

  const userCount = messages.filter(m => m.role === 'user').length;
  const canAsk = userCount < FREE_QUESTIONS;

  const send = async () => {
    if (!text.trim()) return;

    if (!canAsk) {
      setShowGate(true);
      return;
    }

    const u: Msg = { role: 'user', content: text.trim() };
    setMessages(m => [...m, u]);
    setText('');

    // TODO: API холбоно
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', content: 'OK (Guest туршилт).' }]);
    }, 200);
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 20px)' }}>
      <div style={{ fontWeight: 800, marginBottom: 8 }}>Guest Chat (туршилт)</div>
      <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 12 }}>
        Үлдсэн туршилт: {Math.max(0, FREE_QUESTIONS - userCount)}
      </div>

      <div style={{ flex: 1, overflow: 'auto', border: '1px solid #ddd', borderRadius: 12, padding: 12 }}>
        {messages.length === 0 ? (
          <div style={{ opacity: 0.7 }}>
            Энд 3 асуулт үнэгүй туршиж болно. Дараа нь “Бүртгүүлэх” шаардлагатай болно.
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, opacity: 0.6 }}>{m.role}</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={canAsk ? 'Энд бичнэ…' : 'Үргэлжлүүлэхийн тулд бүртгүүлнэ…'}
          style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid #ddd' }}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        />
        <button onClick={send}>Send</button>
      </div>

      {showGate && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 12, border: '1px solid #ddd' }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Үргэлжлүүлэхийн тулд бүртгүүлээрэй</div>
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 10 }}>
            Та 3 асуулт туршлаа. Одоо бүртгэл үүсгээд үргэлжлүүлнэ.
          </div>
          <button onClick={() => (window.location.href = '/login')}>Нэвтрэх / Бүртгүүлэх</button>
        </div>
      )}
    </div>
  );
}
