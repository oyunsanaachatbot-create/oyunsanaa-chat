'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2';

type Lang = 'mn' | 'en' | 'ru' | 'ja' | 'ko';
type Key =
  | 'title'
  | 'haveAccount'
  | 'name'
  | 'email'
  | 'password'
  | 'signUp'
  | 'google'
  | 'backLogin'
  | 'nextLabel'
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
    nextLabel: 'Next:',
    error: 'Алдаа гарлаа',
  },
  en: {
    title: 'OS — Sign up',
    haveAccount: 'Already have an account?',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    signUp: 'Sign up',
    google: 'Continue with Google',
    backLogin: 'Back to login',
    nextLabel: 'Next:',
    error: 'Something went wrong',
  },
  ru: {
    title: 'OS — Регистрация',
    haveAccount: 'Уже есть аккаунт?',
    name: 'Имя',
    email: 'Email',
    password: 'Пароль',
    signUp: 'Зарегистрироваться',
    google: 'Продолжить с Google',
    backLogin: 'Назад к входу',
    nextLabel: 'Далее:',
    error: 'Произошла ошибка',
  },
  ja: {
    title: 'OS — 登録',
    haveAccount: 'アカウントをお持ちですか？',
    name: '名前',
    email: 'メール',
    password: 'パスワード',
    signUp: '登録',
    google: 'Googleで続行',
    backLogin: 'ログインへ戻る',
    nextLabel: '次へ:',
    error: 'エラーが発生しました',
  },
  ko: {
    title: 'OS — 회원가입',
    haveAccount: '이미 계정이 있나요?',
    name: '이름',
    email: '이메일',
    password: '비밀번호',
    signUp: '회원가입',
    google: 'Google로 계속',
    backLogin: '로그인으로 돌아가기',
    nextLabel: 'Next:',
    error: '오류가 발생했습니다',
  },
};

export default function RegisterClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [lang] = useState<Lang>('mn');

  const next = useMemo(() => sp.get('next') || '/chat', [sp]);
  const t = (k: Key) => I18N[lang][k];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const goNext = () => router.replace(next);

  const goLogin = () => {
    router.replace(`/login?next=${encodeURIComponent(next)}`);
  };

  const signUpWithPassword = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
          },
        },
      });
      if (error) throw error;

      // Зарим тохиргоонд email confirmation байж болно.
      // Хэрэв session шууд үүсвэл next рүү орно.
      if (data.session) {
        goNext();
        return;
      }

      // session байхгүй бол (email confirm асаалттай) login руу буцаана.
      router.replace(`/login?next=${encodeURIComponent(next)}`);
    } catch (e: any) {
      setErr(e?.message || t('error'));
    } finally {
      setBusy(false);
    }
  };

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

        <label style={{ display: 'block', opacity: 0.9, marginBottom: 6 }}>{t('name')}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Oyunsanaa"
          style={inputStyle}
          autoComplete="name"
        />

        <label style={{ display: 'block', opacity: 0.9, margin: '12px 0 6px' }}>{t('email')}</label>
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
          autoComplete="new-password"
        />

        {err && (
          <div style={{ marginTop: 10, color: '#ffb4b4', fontSize: 13 }}>
            {t('error')}: {err}
          </div>
        )}

        <button
          onClick={signUpWithPassword}
          disabled={busy || !name || !email || !password}
          style={{ ...btnStyle, marginTop: 14, background: BRAND }}
        >
          {busy ? '...' : t('signUp')}
        </button>

        <button onClick={signUpWithGoogle} disabled={busy} style={{ ...btnStyle, marginTop: 10, background: 'transparent' }}>
          {t('google')}
        </button>

        <div style={{ marginTop: 12, fontSize: 13, opacity: 0.9, display: 'flex', justifyContent: 'space-between' }}>
          <span>{t('haveAccount')}</span>
          <button onClick={goLogin} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 700 }}>
            {t('backLogin')}
          </button>
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
