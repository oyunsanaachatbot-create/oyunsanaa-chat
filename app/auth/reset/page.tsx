'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Flex, Heading, Input, Stack, Text, useToast } from '@chakra-ui/react';
import { supabase } from '@/lib/supabase/browser';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const onUpdate = async () => {
    if (password.length < 6) {
      toast({ status: 'warning', title: 'Нууц үг хамгийн багадаа 6 тэмдэгт' });
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ status: 'success', title: 'Нууц үг шинэчлэгдлээ' });
      router.replace('/chat');
    } catch (e: any) {
      toast({ status: 'error', title: 'Алдаа', description: e?.message || String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Flex minH="100dvh" align="center" justify="center" px="16px">
      <Box w="full" maxW="420px">
        <Stack spacing={4}>
          <Heading fontSize="2xl">Нууц үг шинэчлэх</Heading>
          <Text opacity={0.8}>Шинэ нууц үгээ оруулаад хадгал.</Text>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Шинэ нууц үг"
          />
          <Button isLoading={busy} onClick={onUpdate}>
            Хадгалах
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
}
