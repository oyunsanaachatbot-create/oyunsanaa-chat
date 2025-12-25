'use client';

import React, { useMemo, useState } from 'react';

type Msg = { role: 'assistant' | 'user'; content: string };

export default function DemoChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Сайн уу! Энэ бол туршилтын чат. Асуултаа бичээрэй 🙂' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const canSend = useMemo(() => input.trim().length > 0 && !busy, [input, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;

    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setBusy(true);

    // ✅ Demo: шууд “OS” хариу үзүүлнэ (API/Supabase ашиглахгүй)
    const reply = `OS: "${text}" гэж ойлголоо ✅ (Demo mode)`;
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      setBusy(false);
    }, 350);
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: 20 }}>
      <h2 style={{ margin: 0 }}>Туршилтын чат</h2>
      <div style={{ opacity: 0.7, marginTop: 6 }}>Supabase ашиглахгүй demo хувилбар.</div>

      <div
        style={{
          marginTop: 14,
          border: '1px solid rgba(0,0,0,0.12)',
          borderRadius: 12,
          padding: 12,
          minHeight: 360,
          background: 'white',
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '80%',
                padding: '10px 12px',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.10)',
                background: m.role === 'user' ? 'rgba(31,111,178,0.10)' : 'rgba(0,0,0,0.04)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Асуултаа бич..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') send();
          }}
          style={{
            flex: 1,
            padding: '12px 12px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.18)',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={!canSend}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,0.18)',
            background: canSend ? '#1F6FB2' : 'rgba(0,0,0,0.08)',
            color: canSend ? 'white' : 'rgba(0,0,0,0.35)',
            fontWeight: 700,
            cursor: canSend ? 'pointer' : 'not-allowed',
            minWidth: 120,
          }}
        >
          {busy ? '...' : 'Илгээх'}
        </button>
      </div>
    </div>
  );
}
