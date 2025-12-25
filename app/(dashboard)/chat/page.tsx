// app/(dashboard)/chat/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import ChatShell from '@/components/ChatShell';

export default function ChatPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace('/login?next=/chat');
        return;
      }
      setChecking(false);
    };
    run();
  }, [router]);

  if (checking) return <div style={{ padding: 24 }}>Checking session...</div>;
  return <ChatShell />;
}
