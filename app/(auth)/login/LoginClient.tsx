'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

// Chakra-г чи одоо page.tsx дээрээ ашиглаж байгаа бол импорт-уудаа энд авчирна
// import { Box, Button, Input, Text, ... } from '@chakra-ui/react';

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();

  // хаашаа буцаах вэ? (default: /chat)
  const nextPath = useMemo(() => sp.get('next') || '/chat', [sp]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // аль хэдийн нэвтэрсэн бол next руу нь шууд явуул
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace(nextPath);
    });
  }, [router, nextPath]);

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) router.replace(nextPath);
    else alert(error.message);
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}` },
    });
    if (error) alert(error.message);
  }

  async function sendResetEmail() {
    if (!email) return alert('Имэйлээ бичнэ үү');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) alert(error.message);
    else alert('Нууц үг сэргээх имэйл явууллаа');
  }

  // ⚠️ Эндээс доош чи өөрийн гоё Login UI-гаа (Chakra) яг хэвээр нь байрлуулна.
  return (
    <div style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>OS — CHAT</h1>

      <div style={{ marginTop: 16 }}>
        <label>Имэйл</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@mail.com"
          style={{ width: '100%', padding: 12, borderRadius: 10, marginTop: 6 }}
        />
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Нууц үг</label>
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{ width: '100%', padding: 12, borderRadius: 10, marginTop: 6 }}
        />
      </div>

      <button onClick={signInWithEmail} style={{ width: '100%', padding: 12, borderRadius: 12, marginTop: 16 }}>
        Нэвтрэх
      </button>

      <button onClick={signInWithGoogle} style={{ width: '100%', padding: 12, borderRadius: 12, marginTop: 10 }}>
        Google-ээр нэвтрэх
      </button>

      <button onClick={sendResetEmail} style={{ width: '100%', padding: 12, borderRadius: 12, marginTop: 10 }}>
        Нууц үг мартсан уу?
      </button>

      <div style={{ marginTop: 10, opacity: 0.7 }}>
        Next: <code>{nextPath}</code>
      </div>
    </div>
  );
}
