'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

// ✅ чиний жинхэнэ CHAT UI
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

      // ✅ зөв: /login (route group URL дээр гардаггүй)
      if (!user) {
        router.replace('/login?next=/chat');
        return;
      }

      setChecking(false);
    };

    run();
    return () => {
      alive = false;
    };
  }, [router]);

  if (checking) return <div style={{ padding: 24 }}>Checking session...</div>;
  return <Chat />;
}
