'use client';

import { useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function TryPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Сайн уу! Энэ бол guest туршилтын чат. (хадгалахгүй)' },
  ]);
  const [text, setText] = useState('');

  async function send() {
    const content = text.trim();
    if (!content) return;
    setText('');

    const next = [...messages, { role: 'user', content }];
    setMessages(next);

    // Түр туршилт: энд чи өөрийнхөө /api/chat (стрийм) байгаа бол түүн рүү холбоно.
    // Хэрвээ /api/chat нь заавал auth шаарддаг бол тусдаа /api/try хийх хэрэгтэй (дараагийн алхам).
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: next }),
    });

    if (!res.ok) {
      setMessages([...next, { role: 'assistant', content: 'Алдаа гарлаа. Дараа дахин оролдоорой.' }]);
      return;
    }

    const data = await res.json().catch(() => null);
    const reply = data?.reply || 'OK (guest).';
    setMessages([...next, { role: 'assistant', content: reply }]);
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800 }}>Guest Chat (Try)</h1>
      <p style={{ opacity: 0.7, marginTop: 6 }}>Эндхийн яриа хадгалагдахгүй.</p>

      <div style={{ marginTop: 16, border: '1px solid #ddd', borderRadius: 12, padding: 12, minHeight: 260 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '10px 0' }}>
            <b>{m.role === 'user' ? 'You' : 'OS'}</b>: {m.content}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Асуултаа бич…"
          style={{ flex: 1, padding: 12, borderRadius: 10 }}
        />
        <button onClick={send} style={{ padding: '12px 18px', borderRadius: 10 }}>
          Илгээх
        </button>
      </div>
    </div>
  );
}
