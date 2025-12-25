'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2'; // чиний brand

type Lang = 'mn' | 'en' | 'ru' | 'ja' | 'ko';
type Key =
  | 'title'
  | 'newUser'
  | 'email'
  | 'password'
  | 'signIn'
  | 'google'
  | 'forgot'
  | 'backHome'
  | 'nextLabel'
  | 'error';

const I18N: Record<Lang, Record<Key, string>> = {
  mn: {
    title: 'OS — CHAT',
    newUser: 'Шинэ хэрэглэгч',
    email: 'И-мэйл',
    password: 'Нууц үг',
    signIn: 'Нэвтрэх',
    google: 'Google-ээр нэвтрэх',
    forgot: 'Нууц үг мартсан уу?',
    backHome: 'oyunsanaa.com руу буцах',
    nextLabel: 'Next:',
    error: 'Алдаа гарлаа',
  },
  en: {
    title: 'OS — CHAT',
    newUser: 'New user',
    email: 'Email',
    password: 'Password',
    signIn: 'Sign in',
    google: 'Continue with Google',
    forgot: 'Forgot password?',
    backHome: 'Back to oyunsanaa.com',
    nextLabel: 'Next:',
    error: 'Something went wrong',
  },
  ru: {
    title: 'OS — CHAT',
    newUser: 'Новый пользователь',
    email: 'Email',
    password: 'Пароль',
    signIn: 'Войти',
    google: 'Войти через Google',
    forgot: 'Забыли пароль?',
    backHome: 'Назад на oyunsanaa.com',
    nextLabel: 'Далее:',
    error: 'Произошла ошибка',
  },
  ja: {
    title: 'OS — CHAT',
    newUser: '新規ユーザー',
    email: 'メール',
    password: 'パスワード',
    signIn: 'ログイン',
    google: 'Googleで続行',
    forgot: 'パスワードを忘れた？',
    backHome: 'oyunsanaa.com に戻る',
    nextLabel: '次へ:',
    error: 'エラーが発生しました',
  },
  ko: {
    title: 'OS — CHAT',
    newUser: '신규 사용자',
    email: '이메일',
    password: '비밀번호',
    signIn: '로그인',
    google: 'Google로 계속',
    forgot: '비밀번호를 잊으셨나요?',
    backHome: 'oyunsanaa.com으로 돌아가기',
    nextLabel: 'Next:',
    error: '오류가 발생했습니다',
  },
};

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();

  // хэл сонголт (одоо mn default)
  const [lang] = useState<Lang>('mn');

  const next = useMemo(() => sp.get('next') || '/chat', [sp]);
  const t = (k: Key) => I18N[lang][k];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const goNext = () => router.replace(next);

  const signInWithPassword = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      goNext();
    } catch (e: any) {
      setErr(e?.message || t('error'));
    } finally {
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setErr(null);
    try {
      const origin = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Supabase Redirect URL дээр чинь энэ домэйн байх ёстой
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      // OAuth үед redirect хийгдэнэ
    } catch (e: any) {
      setErr(e?.message || t('error'));
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0b1a2a' }}>
      <div
        style={{
          width: 'min(520px, 92vw)',
          borderRadius: 18,
          padding: 22,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.10)',
          color: 'white',
        }}
      >
        <h1 style={{ textAlign: 'center', margin: '4px 0 14px' }}>{t('title')}</h1>

        {/* ✅ Шинэ хэрэглэгч товч: oyunsanaa.com */}
        <a
          href="https://oyunsanaa.com"
          style={{
            display: 'block',
            textAlign: 'center',
            padding: '12px 14px',
            borderRadius: 12,
            background: 'rgba(31,111,178,0.28)',
            border: `1px solid rgba(31,111,178,0.55)`,
            color: 'white',
            textDecoration: 'none',
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {t('newUser')}
        </a>

        <label style={{ display: 'block', opacity: 0.9, marginBottom: 6 }}>{t('email')}</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@mail.com"
          style={inputStyle}
          autoComplete="email"
        />

        <label style={{ display: 'block', opacity: 0.9, margin: '12px 0 6px' }}>{t('password')}</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={inputStyle}
          type="password"
          autoComplete="current-password"
        />

        {err && (
          <div style={{ marginTop: 10, color: '#ffb4b4', fontSize: 13 }}>
            {t('error')}: {err}
          </div>
        )}

        <button
          onClick={signInWithPassword}
          disabled={busy || !email || !password}
          style={{ ...btnStyle, marginTop: 14, background: BRAND }}
        >
          {busy ? '...' : t('signIn')}
        </button>

        <button onClick={signInWithGoogle} disabled={busy} style={{ ...btnStyle, marginTop: 10, background: 'transparent' }}>
          {t('google')}
        </button>

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: 0.9 }}>
          <a href="/reset" style={{ color: 'white' }}>{t('forgot')}</a>
          <a href="https://oyunsanaa.com" style={{ color: 'white' }}>{t('backHome')}</a>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
          {t('nextLabel')} {next}
        </div>
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
