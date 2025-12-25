'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    // ✅ Supabase recovery линкээр орж ирэхэд URL дээр token-ууд ирдэг.
    // Supabase JS нь үүнийг уншаад session үүсгэх ёстой. Бид "session байгаа эсэх"-ийг шалгана.
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setMsg('Auth session missing. Password reset link-ээ дахин нээж үзээрэй.');
      }
      setChecking(false);
    };
    run();
  }, []);

  const onUpdate = async () => {
    setMsg(null);

    if (!password || password.length < 6) {
      setMsg('Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой.');
      return;
    }
    if (password !== password2) {
      setMsg('Нууц үг таарахгүй байна.');
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setMsg('✅ Нууц үг амжилттай шинэчлэгдлээ. Login руу шилжүүлж байна...');
      setTimeout(() => router.replace('/login?next=/chat'), 900);
    } catch (e: any) {
      setMsg(e?.message || 'Алдаа гарлаа');
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Update password</h2>
        <div>Checking session...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1a2a' }}>
      <div style={{ width: 'min(520px, 92vw)', borderRadius: 18, padding: 22, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'white' }}>
        <h1 style={{ textAlign: 'center', margin: '4px 0 14px' }}>Шинэ нууц үг</h1>

        <label style={{ display: 'block', opacity: 0.9, marginBottom: 6 }}>New password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="••••••••"
          style={inputStyle}
          autoComplete="new-password"
        />

        <label style={{ display: 'block', opacity: 0.9, margin: '12px 0 6px' }}>Repeat password</label>
        <input
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          type="password"
          placeholder="••••••••"
          style={inputStyle}
          autoComplete="new-password"
        />

        {msg && <div style={{ marginTop: 10, color: '#ffb4b4', fontSize: 13 }}>{msg}</div>}

        <button onClick={onUpdate} disabled={busy} style={{ ...btnStyle, marginTop: 14, background: '#1F6FB2' }}>
          {busy ? '...' : 'Нууц үг шинэчлэх'}
        </button>

        <a href="/login?next=/chat" style={{ display: 'block', marginTop: 10, color: 'white', opacity: 0.85, fontSize: 13, textAlign: 'center' }}>
          Login руу буцах
        </a>
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
