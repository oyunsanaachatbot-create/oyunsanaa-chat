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
    title: 'OS — Register',
    haveAccount: 'Already have an account?',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    signUp: 'Create account',
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
    backLogin: 'Назад ко входу',
    nextLabel: 'Далее:',
    error: 'Произошла ошибка',
  },
  ja: {
    title: 'OS — 登録',
    haveAccount: 'アカウントをお持ちですか？',
    name: '名前',
    email: 'メール',
    password: 'パスワード',
    signUp: '登録する',
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
    signUp: '가입하기',
    google: 'Google로 계속',
    backLogin: '로그인으로',
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

  const signUpWithPassword = async () => {
    setBusy(true);
    setErr(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // ✅ энэ нь Sidebar/Header дээр чинь name болж орж ирнэ
          },
        },
      });
      if (error) throw error;

      // Email confirmation OFF бол шууд нэвтэрч next рүү орно
      // ON бол хэрэглэгч mail дээрээ баталгаажуулж байж нэвтэрнэ (тэр үед login руу явуулж болно)
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
  // Google-р орж буцах үед нэрээ алдахгүй тулд түр хадгална
  if (name) {
    // энд логик чинь байвал байг
  }
} catch (e) {
  console.error(e);
}
