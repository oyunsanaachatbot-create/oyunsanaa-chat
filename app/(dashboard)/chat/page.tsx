'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

// ✅ чиний жинхэнэ CHAT UI
import Chat from '@/components/Chat';

export default function ChatPage(props: { guest?: boolean }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  const isGuest = !!props.guest;

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!alive) return;

      // ✅ Guest биш үед л login шаардана
      if (!user && !isGuest) {
        // ⚠️ /(auth) гэдэг нь URL биш — route group тул 404 болно
        router.replace('/login?next=/chat');
        return;
      }

      // ✅ user байгаа эсвэл guest mode бол chat UI харуул
      setChecking(false);
    };

    run();
    return () => {
      alive = false;
    };
  }, [router, isGuest]);

  if (checking) {
    return <div style={{ padding: 24 }}>Checking session...</div>;
  }

  return <Chat />;
}
