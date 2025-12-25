'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2';

type Lang = 'mn' | 'en' | 'ru' | 'ja' | 'ko';
type Key =
  | 'title'
  | 'name'
  | 'email'
  | 'password'
  | 'signUp'
  | 'google'
  | 'haveAccount'
  | 'signIn'
  | 'backHome'
  | 'nextLabel'
  | 'error';

const I18N: Record<Lang, Record<Key, string>> = {
  mn: {
    title: 'OS — Бүртгэл',
    name: 'Нэр',
    email: 'И-мэйл',
    password: 'Нууц үг',
    signUp: 'Бүртгүүлэх',
    google: 'Google-ээр бүртгүүлэх',
    haveAccount: 'Бүртгэлтэй юу?',
    signIn: 'Нэвтрэх',
    backHome: 'oyunsanaa.com руу буцах',
    nextLabel: 'Next:',
    error: 'Алдаа гарлаа',
  },
  en: {
    title: 'OS — Sign up',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    signUp: 'Create account',
    google: 'Continue with Google',
    haveAccount: 'Already have an account?',
    signIn: 'Sign in',
    backHome: 'Back to oyunsanaa.com',
    nextLabel: 'Next:',
    error: 'Something went wrong',
  },
  ru: {
    title: 'OS — Регистрация',
    name: 'Имя',
    email: 'Email',
    password: 'Пароль',
    signUp: 'Зарегистрироваться',
    google: 'Продолжить через Google',
    haveAccount: 'Уже есть аккаунт?',
    signIn: 'Войти',
    backHome: 'Назад на oyunsanaa.com',
    nextLabel: 'Далее:',
    error: 'Произошла ошибка',
  },
  ja: {
    title: 'OS — 登録',
    name: '名前',
    email: 'メール',
    password: 'パスワード',
    signUp: '登録する',
    google: 'Googleで続行',
    haveAccount: 'すでにアカウントがありますか？',
    signIn: 'ログイン',
    backHome: 'oyunsanaa.com に戻る',
    nextLabel: '次へ:',
    error: 'エラーが発生しました',
  },
  ko: {
    title: 'OS — 회원가입',
    name: '이름',
    email: '이메일',
    password: '비밀번호',
    signUp: '가입하기',
    google: 'Google로 계속',
    haveAccount: '이미 계정이 있나요?',
    signIn: '로그인',
    backHome: 'oyunsanaa.com으로 돌아가기',
    nextLabel: 'Next:',
    error: '오류가 발생했습니다',
  },
};

export default function RegisterClient() {
  const router = useRouter();
  const sp = useSearchParams();

  const [lang] = useState<Lang>('mn');
  const t = (k: Key) => I18N[lang][k];

  const next = useMemo(() => sp.get('next') || '/chat', [sp]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const goNext = () => router.replace(next);

  const signUp = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // ✅ энэ нь дараа "Hey, {name}" дээр гарна
          },
        },
      });
      if (error) throw error;

      // Хэрвээ email confirm асаалттай бол энд “шаардлагатай баталгаажуул” гэдэг message хийж болно.
      // Одоо бол шууд next руу явуулъя:
      goNext();
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
          onClick={signUp}
          disabled={busy || !name || !email || !password}
          style={{ ...btnStyle, marginTop: 14, background: BRAND }}
        >
          {busy ? '...' : t('signUp')}
        </button>

        <button onClick={signUpWithGoogle} disabled={busy} style={{ ...btnStyle, marginTop: 10, background: 'transparent' }}>
          {t('google')}
        </button>

        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 13, opacity: 0.9 }}>
          <a href={`/login?next=${encodeURIComponent(next)}`} style={{ color: 'white' }}>
            {t('haveAccount')} {t('signIn')}
          </a>
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
