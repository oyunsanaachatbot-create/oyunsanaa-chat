'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import Chat from '@/components/Chat';

export default function ChatPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  // ✅ /guest дээр бол login шаардахгүй
  const isGuest = pathname === '/guest';

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!alive) return;

      // ✅ зөвхөн /chat дээр л login шаардана
      if (!user && !isGuest) {
        router.replace('/login?next=/chat'); // ⚠️ /(auth) битгий хэрэглэ
        return;
      }

      setChecking(false);
    };

    run();
    return () => {
      alive = false;
    };
  }, [router, isGuest]);

  if (checking) return <div style={{ padding: 24 }}>Checking session...</div>;

  return <Chat />;
}
