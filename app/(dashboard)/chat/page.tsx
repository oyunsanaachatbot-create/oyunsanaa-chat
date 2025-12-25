'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

// ✅ ЧИНИЙ ЖИНХЭНЭ CHAT UI
import Chat from '@/components/Chat';

export default function ChatPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!alive) return;

      // ❌ НЭВТЭРЧ ОРООГҮЙ → LOGIN
      if (!user) {
        router.replace('/(auth)/login?next=/chat');
        return;
      }

      // ✅ НЭВТЭРСЭН → CHAT UI
      setChecking(false);
    };

    run();
    return () => {
      alive = false;
    };
  }, [router]);

  if (checking) {
    return <div style={{ padding: 24 }}>Checking session...</div>;
  }

  // 🚀 ЭНДЭЭС ЦААШ ЖИНХЭНЭ CHAT
  return <Chat />;
}
