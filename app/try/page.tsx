'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TryPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [items, setItems] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Сайн уу! 1–2 асуулт асуугаад үзээрэй 🙂' },
  ]);

  const userCount = useMemo(() => items.filter((x) => x.role === 'user').length, [items]);
  const limitReached = userCount >= 2;

  const ask = () => {
    const text = q.trim();
    if (!text) return;
    setItems((prev) => [...prev, { role: 'user', text }, { role: 'assistant', text: 'Туршилтын горим ✅ Бүртгүүлбэл бүрэн chat нээгдэнэ.' }]);
    setQ('');
  };

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: 24 }}>
      <h1 style={{ margin: 0 }}>Туршилтын чат</h1>
      <p style={{ opacity: 0.7, marginTop: 8 }}>Login шаардлагагүй. 2 асуулт асуугаад бүртгүүлэх санал гарна.</p>

      <div style={{ marginTop: 14, padding: 14, border: '1px solid rgba(0,0,0,0.12)', borderRadius: 12 }}>
        {items.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role === 'user' ? 'Та' : 'OS'}</b>: {m.text}
          </div>
        ))}
      </div>

      {!limitReached ? (
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Асуултаа бич..."
            style={{ flex: 1, padding: 12, borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)' }}
            onKeyDown={(e) => (e.key === 'Enter' ? ask() : null)}
          />
          <button onClick={ask} style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)' }}>
            Илгээх
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 14, padding: 14, borderRadius: 12, border: '1px dashed rgba(0,0,0,0.25)' }}>
          2 асуулт дууслаа ✅ Одоо бүртгүүлээд бүрэн chat руу оръё.
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button
              onClick={() => router.push('/login?next=/chat')}
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)' }}
            >
              Бүртгүүлэх / Нэвтрэх
            </button>
            <button
              onClick={() => router.push('/chat')}
              style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.15)' }}
            >
              Chat руу (login шаардлагатай)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
