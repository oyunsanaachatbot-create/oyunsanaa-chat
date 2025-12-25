'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2';

export default function ResetPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSend = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const origin = window.location.origin;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // ✅ Supabase Redirect URLs дээр чинь байгаа:
        redirectTo: `${origin}/auth/update-password`,
      });
      if (error) throw error;

      setMsg('Reset email явууллаа. Inbox/Spam шалгаарай ✅');
    } catch (e: any) {
      setErr(e?.message || 'Алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1a2a', color: 'white' }}>
      <div style={{ width: 'min(520px, 92vw)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)' }}>
        <h2 style={{ margin: 0, marginBottom: 14 }}>Нууц үг сэргээх</h2>

        <label style={{ display: 'block', opacity: 0.9, marginBottom: 6 }}>И-мэйл</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@mail.com"
          style={inputStyle}
          autoComplete="email"
        />

        {err && <div style={{ marginTop: 10, color: '#ffb4b4', fontSize: 13 }}>{err}</div>}
        {msg && <div style={{ marginTop: 10, color: '#b7ffcf', fontSize: 13 }}>{msg}</div>}

        <button
          onClick={onSend}
          disabled={busy || !email}
          style={{ ...btnStyle, marginTop: 14, background: BRAND }}
        >
          {busy ? '...' : 'Email явуулах'}
        </button>

        <button
          onClick={() => router.push('/login')}
          style={{ ...btnStyle, marginTop: 10, background: 'transparent' }}
        >
          Login руу буцах
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(0,0,0,0.18)',
  color: 'white',
  outline: 'none',
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  color: 'white',
  fontWeight: 700,
  cursor: 'pointer',
};
