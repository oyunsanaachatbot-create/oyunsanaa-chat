'use client';

import React, { useMemo, useState } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2';

// ---- i18n (MN/EN/RU/JA/KR) ----
type Lang = 'mn' | 'en' | 'ru' | 'ja' | 'ko';
type Key =
  | 'title'
  | 'subtitle'
  | 'newUser'
  | 'emailOrPhone'
  | 'password'
  | 'remember'
  | 'forgot'
  | 'signIn'
  | 'or'
  | 'google'
  | 'resetTitle'
  | 'resetDesc'
  | 'sendReset'
  | 'back'
  | 'invalidEmail'
  | 'loginOk'
  | 'loginFail'
  | 'resetSent'
  | 'resetFail';

const I18N: Record<Lang, Record<Key, string>> = {
  mn: {
    title: 'OS — CHAT',
    subtitle: 'Шинэ хэрэглэгч бол товч дарна уу, харин гишүүд шууд нэвтэрч орно.',
    newUser: 'Шинэ хэрэглэгч',
    emailOrPhone: 'И-мэйл',
    password: 'Нууц үг',
    remember: 'Remember me',
    forgot: 'Нууц үг мартсан уу?',
    signIn: 'НЭВТРЭХ',
    or: 'эсвэл',
    google: 'Google-ээр нэвтрэх',
    resetTitle: 'Нууц үг сэргээх',
    resetDesc: 'И-мэйлээ оруулаарай. Сэргээх холбоос очно.',
    sendReset: 'Сэргээх холбоос илгээх',
    back: 'Буцах',
    invalidEmail: 'И-мэйлээ зөв оруулна уу.',
    loginOk: 'Амжилттай нэвтэрлээ',
    loginFail: 'Нэвтрэхэд алдаа гарлаа',
    resetSent: 'Сэргээх холбоос илгээлээ',
    resetFail: 'Сэргээх холбоос илгээж чадсангүй',
  },
  en: {
    title: 'OS — CHAT',
    subtitle: 'New users click the button. Members can sign in directly.',
    newUser: 'New user',
    emailOrPhone: 'Email',
    password: 'Password',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    signIn: 'SIGN IN',
    or: 'or',
    google: 'Continue with Google',
    resetTitle: 'Reset password',
    resetDesc: 'Enter your email to receive a reset link.',
    sendReset: 'Send reset link',
    back: 'Back',
    invalidEmail: 'Please enter a valid email.',
    loginOk: 'Signed in',
    loginFail: 'Sign in failed',
    resetSent: 'Reset link sent',
    resetFail: 'Failed to send reset link',
  },
  ru: {
    title: 'OS — CHAT',
    subtitle: 'Новый пользователь — нажмите кнопку. Участники входят напрямую.',
    newUser: 'Новый пользователь',
    emailOrPhone: 'Почта',
    password: 'Пароль',
    remember: 'Запомнить меня',
    forgot: 'Забыли пароль?',
    signIn: 'ВОЙТИ',
    or: 'или',
    google: 'Войти через Google',
    resetTitle: 'Сброс пароля',
    resetDesc: 'Введите почту — пришлём ссылку для сброса.',
    sendReset: 'Отправить ссылку',
    back: 'Назад',
    invalidEmail: 'Введите корректный email.',
    loginOk: 'Вход выполнен',
    loginFail: 'Ошибка входа',
    resetSent: 'Ссылка отправлена',
    resetFail: 'Не удалось отправить ссылку',
  },
  ja: {
    title: 'OS — CHAT',
    subtitle: '新規ユーザーはボタンを押してください。既存ユーザーは直接ログインできます。',
    newUser: '新規ユーザー',
    emailOrPhone: 'メール',
    password: 'パスワード',
    remember: 'ログイン状態を保持',
    forgot: 'パスワードを忘れた？',
    signIn: 'ログイン',
    or: 'または',
    google: 'Googleで続行',
    resetTitle: 'パスワード再設定',
    resetDesc: 'メールを入力すると再設定リンクを送ります。',
    sendReset: 'リンクを送信',
    back: '戻る',
    invalidEmail: '正しいメールを入力してください。',
    loginOk: 'ログインしました',
    loginFail: 'ログインに失敗しました',
    resetSent: 'リンクを送信しました',
    resetFail: 'リンク送信に失敗しました',
  },
  ko: {
    title: 'OS — CHAT',
    subtitle: '신규 사용자는 버튼을 누르세요. 기존 회원은 바로 로그인하세요.',
    newUser: '신규 사용자',
    emailOrPhone: '이메일',
    password: '비밀번호',
    remember: '로그인 유지',
    forgot: '비밀번호를 잊으셨나요?',
    signIn: '로그인',
    or: '또는',
    google: 'Google로 계속',
    resetTitle: '비밀번호 재설정',
    resetDesc: '이메일을 입력하면 재설정 링크를 보내드립니다.',
    sendReset: '링크 보내기',
    back: '뒤로',
    invalidEmail: '올바른 이메일을 입력하세요.',
    loginOk: '로그인 완료',
    loginFail: '로그인 실패',
    resetSent: '링크를 보냈습니다',
    resetFail: '링크 전송 실패',
  },
};

function pickLang(): Lang {
  if (typeof navigator === 'undefined') return 'mn';
  const l = navigator.language.toLowerCase();
  if (l.startsWith('ru')) return 'ru';
  if (l.startsWith('ja')) return 'ja';
  if (l.startsWith('ko')) return 'ko';
  if (l.startsWith('en')) return 'en';
  return 'mn';
}

function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export default function LoginPage() {
  const router = useRouter();
  const qp = useSearchParams();
  const toast = useToast();

  const lang = useMemo(pickLang, []);
  const t = (k: Key) => I18N[lang][k];

  const cardBg = useColorModeValue('rgba(255,255,255,0.10)', 'rgba(255,255,255,0.08)');
  const border = useColorModeValue('rgba(255,255,255,0.18)', 'rgba(255,255,255,0.14)');
  const fieldBg = useColorModeValue('rgba(255,255,255,0.10)', 'rgba(255,255,255,0.08)');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  // "forgot password" inline mode
  const [mode, setMode] = useState<'login' | 'reset'>('login');

  const redirectTo = qp.get('redirectTo') || '/chat';

  const onEmailLogin = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({ status: 'success', title: t('loginOk') });
      router.push(redirectTo);
    } catch (e: any) {
      toast({ status: 'error', title: t('loginFail'), description: e?.message || String(e) });
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    try {
      // remember=false үед session-г localStorage дээр хадгалахгүй болгох гэж оролдож болно,
      // гэхдээ Supabase client default нь localStorage ашигладаг.
      // "Remember me" нь UI-level тохиргоо (дараа нь cookies/ssr болгож болно).
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${getBaseUrl()}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      toast({ status: 'error', title: t('loginFail'), description: e?.message || String(e) });
      setBusy(false);
    }
  };

  const onReset = async () => {
    if (!email.includes('@')) {
      toast({ status: 'warning', title: t('invalidEmail') });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getBaseUrl()}/auth/reset`,
      });
      if (error) throw error;
      toast({ status: 'success', title: t('resetSent') });
      setMode('login');
    } catch (e: any) {
      toast({ status: 'error', title: t('resetFail'), description: e?.message || String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Flex
      minH="100dvh"
      align="center"
      justify="center"
      px="16px"
      color="white"
      style={{
        background:
          'radial-gradient(900px 520px at 20% 15%, rgba(62,111,150,.28), transparent 60%),' +
          'radial-gradient(900px 520px at 85% 25%, rgba(62,111,150,.18), transparent 62%),' +
          'linear-gradient(135deg, #2a4663 0%, #335b7a 100%)',
      }}
    >
      <Box
        w="full"
        maxW="560px"
        borderRadius="24px"
        border={`1px solid ${border}`}
        bg={cardBg}
        backdropFilter="blur(18px)"
        boxShadow="0 18px 60px rgba(0,0,0,.35)"
        p={{ base: 5, md: 8 }}
      >
        <Stack spacing={5}>
          <Stack spacing={2} textAlign="center">
            <Heading fontWeight="600" letterSpacing="0.5px" fontSize={{ base: '28px', md: '34px' }}>
              {t('title')}
            </Heading>
            <Text opacity={0.85} fontSize="sm">
              {t('subtitle')}
            </Text>
          </Stack>

          {/* New user -> oyunsanaa.com */}
          <Button
            as={Link}
            href="https://oyunsanaa.com"
            isExternal
            w="full"
            h="54px"
            borderRadius="14px"
            bg={BRAND}
            _hover={{ bg: '#1A5F98' }}
            color="white"
            fontWeight="700"
          >
            {t('newUser')}
          </Button>

          <Divider opacity={0.2} />

          <Stack spacing={3}>
            <FormControl>
              <FormLabel opacity={0.85}>{t('emailOrPhone')}</FormLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@mail.com"
                bg={fieldBg}
                border="1px solid rgba(255,255,255,0.18)"
                _placeholder={{ color: 'rgba(255,255,255,0.45)' }}
                h="52px"
                borderRadius="14px"
              />
            </FormControl>

            {mode === 'login' && (
              <FormControl>
                <FormLabel opacity={0.85}>{t('password')}</FormLabel>
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  bg={fieldBg}
                  border="1px solid rgba(255,255,255,0.18)"
                  _placeholder={{ color: 'rgba(255,255,255,0.45)' }}
                  h="52px"
                  borderRadius="14px"
                />
              </FormControl>
            )}

            <Flex align="center" justify="space-between" pt={1}>
              <Checkbox
                isChecked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                colorScheme="blue"
              >
                <Text fontSize="sm" opacity={0.9}>
                  {t('remember')}
                </Text>
              </Checkbox>

              {mode === 'login' ? (
                <Button
                  variant="link"
                  color="white"
                  opacity={0.85}
                  _hover={{ opacity: 1 }}
                  onClick={() => setMode('reset')}
                >
                  {t('forgot')}
                </Button>
              ) : (
                <Button
                  variant="link"
                  color="white"
                  opacity={0.85}
                  _hover={{ opacity: 1 }}
                  onClick={() => setMode('login')}
                >
                  {t('back')}
                </Button>
              )}
            </Flex>

            {mode === 'login' ? (
              <Button
                w="full"
                h="54px"
                borderRadius="14px"
                bg="rgba(255,255,255,0.10)"
                border="1px solid rgba(255,255,255,0.18)"
                _hover={{ bg: 'rgba(255,255,255,0.16)' }}
                onClick={onEmailLogin}
                isLoading={busy}
              >
                <Text fontWeight="800" letterSpacing="1px">
                  {t('signIn')}
                </Text>
              </Button>
            ) : (
              <Box
                borderRadius="14px"
                border="1px solid rgba(255,255,255,0.18)"
                bg="rgba(255,255,255,0.06)"
                p={4}
              >
                <Text fontWeight="700" mb={1}>
                  {t('resetTitle')}
                </Text>
                <Text fontSize="sm" opacity={0.85} mb={3}>
                  {t('resetDesc')}
                </Text>
                <Button
                  w="full"
                  h="48px"
                  borderRadius="12px"
                  bg={BRAND}
                  _hover={{ bg: '#1A5F98' }}
                  onClick={onReset}
                  isLoading={busy}
                >
                  {t('sendReset')}
                </Button>
              </Box>
            )}

            <Flex align="center" gap={3} pt={2}>
              <Divider opacity={0.2} />
              <Text fontSize="xs" opacity={0.7}>
                {t('or')}
              </Text>
              <Divider opacity={0.2} />
            </Flex>

            <Button
              w="full"
              h="52px"
              borderRadius="14px"
              bg="rgba(255,255,255,0.10)"
              border="1px solid rgba(255,255,255,0.18)"
              _hover={{ bg: 'rgba(255,255,255,0.16)' }}
              onClick={onGoogle}
              isLoading={busy}
            >
              {t('google')}
            </Button>

            <Text fontSize="xs" opacity={0.65} textAlign="center" pt={1}>
              <Link as={NextLink} href="/chat" color={BRAND} fontWeight="700">
                /chat
              </Link>
              {` `}→ (нэвтэрсний дараа очих хуудас)
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  );
}
