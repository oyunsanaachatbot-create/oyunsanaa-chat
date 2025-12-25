'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2';

type Lang = 'mn';
type Key =
  | 'title'
  | 'haveAccount'
  | 'name'
  | 'email'
  | 'password'
  | 'signUp'
  | 'google'
  | 'backLogin'
  | 'error';

const I18N: Record<Lang, Record<Key, string>> = {
  mn: {
    title: 'OS — Бүртгэл',
    haveAccount: 'Бүртгэлтэй юу?',
    name: 'Нэр',
    email: 'И-мэйл',
    password: 'Нууц үг',
    signUp: 'Бүртгүүлэх',
    google: 'Google-ээр бүртгүүлэх',
    backLogin: 'Нэвтрэх рүү буцах',
    error: 'Алдаа гарлаа',
  },
};

export default function RegisterClient() {
  const router = useRouter();
  const lang: Lang = 'mn';
  const t = (k: Key) => I18N[lang][k];

  const next = '/chat';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const goNext = () => router.replace(next);

  // ✅ EMAIL + PASSWORD БҮРТГЭЛ
  const signUpWithPassword = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // 🔥 Sidebar / Header эндээс уншина
          },
        },
      });
      if (error) throw error;

      // Email confirmation OFF байвал шууд chat руу
      goNext();
    } catch (e: any) {
      setErr(e?.message || t('error'));
    } finally {
      setBusy(false);
    }
  };

  // ✅ GOOGLE БҮРТГЭЛ
  const signUpWithGoogle = async () => {
    setBusy(true);
    setErr(null);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      setErr(e?.message || t('error'));
      setBusy(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: 16 }}>
          {t('title')}
        </h1>

        <label>{t('name')}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <label>{t('email')}</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          autoComplete="email"
        />

        <label>{t('password')}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
          autoComplete="new-password"
        />

        {err && (
          <div style={{ color: '#ffb4b4', fontSize: 13 }}>
            {err}
          </div>
        )}

        <button
          onClick={signUpWithPassword}
          disabled={busy || !name || !email || !password}
          style={{ ...btnStyle, background: BRAND }}
        >
          {busy ? '...' : t('signUp')}
        </button>

        <button
          onClick={signUpWithGoogle}
          disabled={busy}
          style={{ ...btnStyle, marginTop: 10 }}
        >
          {t('google')}
        </button>

        <div style={{ marginTop: 12, fontSize: 13, textAlign: 'center' }}>
          {t('haveAccount')}{' '}
          <a href="/login?next=/chat" style={{ color: BRAND }}>
            {t('backLogin')}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- styles ---------- */

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  background: '#0b1a2a',
};

const cardStyle: React.CSSProperties = {
  width: 'min(480px, 92vw)',
  padding: 24,
  borderRadius: 18,
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: 'white',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginBottom: 12,
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(0,0,0,0.18)',
  color: 'white',
  outline: 'none',
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'transparent',
  color: 'white',
  fontWeight: 700,
  cursor: 'pointer',
};
