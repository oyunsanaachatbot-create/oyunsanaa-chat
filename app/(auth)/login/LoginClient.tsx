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
  useToast,
} from '@chakra-ui/react';
import { supabase } from '@/lib/supabase/browser';

const BRAND = '#1F6FB2';

type Mode = 'login' | 'reset';

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const toast = useToast();

  const next = useMemo(() => sp.get('next') || '/chat', [sp]);

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const goNewUser = () => {
    window.location.href = 'https://oyunsanaa.com';
  };

  const onEmailLogin = async () => {
    if (!email || !password) {
      toast({ status: 'warning', title: 'Email болон нууц үгээ оруулна уу' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // remember me-г cookie/session дээр шууд удирдахгүй (supabase client default хадгална)
      router.replace(next);
    } catch (e: any) {
      toast({ status: 'error', title: 'Нэвтрэхэд алдаа гарлаа', description: e?.message });
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      // redirect болно
    } catch (e: any) {
      toast({ status: 'error', title: 'Google-ээр нэвтрэхэд алдаа', description: e?.message });
      setLoading(false);
    }
  };

  const onReset = async () => {
    if (!email) {
      toast({ status: 'warning', title: 'Email-ээ оруулна уу' });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;

      toast({
        status: 'success',
        title: 'Reset email явууллаа',
        description: 'Inbox/Spam шалгаарай.',
      });
      setMode('login');
    } catch (e: any) {
      toast({ status: 'error', title: 'Reset хийхэд алдаа', description: e?.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50" px={4}>
      <Box
        w="full"
        maxW="520px"
        bg="white"
        borderRadius="20px"
        boxShadow="0 10px 30px rgba(0,0,0,0.08)"
        p={{ base: 6, md: 10 }}
      >
        <Stack spacing={6}>
          <Stack spacing={2} textAlign="center">
            <Heading size="lg" color="gray.800">
              OS — CHAT
            </Heading>
            <Text color="gray.500">
              Шинэ хэрэглэгч бол товч дарна уу, харин гишүүд шууд нэвтэрч орно.
            </Text>
          </Stack>

          <Button
            onClick={goNewUser}
            bg={BRAND}
            color="white"
            _hover={{ opacity: 0.9 }}
            size="lg"
            borderRadius="14px"
          >
            Шинэ хэрэглэгч
          </Button>

          <Divider />

          {mode === 'login' ? (
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>И-мэйл</FormLabel>
                <Input
                  placeholder="name@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Нууц үг</FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </FormControl>

              <Flex align="center" justify="space-between">
                <Checkbox isChecked={remember} onChange={(e) => setRemember(e.target.checked)}>
                  Remember me
                </Checkbox>

                <Button
                  variant="link"
                  color={BRAND}
                  onClick={() => setMode('reset')}
                  fontWeight="600"
                >
                  Нууц үг мартсан уу?
                </Button>
              </Flex>

              <Button
                onClick={onEmailLogin}
                isLoading={loading}
                bg={BRAND}
                color="white"
                _hover={{ opacity: 0.9 }}
                size="lg"
                borderRadius="14px"
              >
                НЭВТРЭХ
              </Button>

              <Flex align="center" gap={3}>
                <Divider />
                <Text color="gray.400" fontSize="sm">
                  эсвэл
                </Text>
                <Divider />
              </Flex>

              <Button onClick={onGoogle} isLoading={loading} variant="outline" size="lg">
                Google-ээр нэвтрэх
              </Button>
            </Stack>
          ) : (
            <Stack spacing={4}>
              <Text color="gray.600">
                Email-ээ оруулаад “Reset линк авах” дар. Email очно.
              </Text>

              <FormControl>
                <FormLabel>И-мэйл</FormLabel>
                <Input
                  placeholder="name@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </FormControl>

              <Button
                onClick={onReset}
                isLoading={loading}
                bg={BRAND}
                color="white"
                _hover={{ opacity: 0.9 }}
                size="lg"
                borderRadius="14px"
              >
                Reset линк авах
              </Button>

              <Button variant="link" onClick={() => setMode('login')} color={BRAND}>
                ← Буцах
              </Button>
            </Stack>
          )}

          <Text fontSize="sm" color="gray.400" textAlign="center">
            Нэвтэрсний дараа автоматаар <b>{next}</b> руу орно.
          </Text>

          {/* Хэрвээ чи “Sign up” энэ апп дээр хэрэггүй гэвэл эндээс бүр авч хаяж болно */}
          <Text fontSize="sm" color="gray.400" textAlign="center">
            Бүртгэл/төлбөр: oyunsanaa.com дээр.
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
}
