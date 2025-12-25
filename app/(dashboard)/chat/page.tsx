'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function ChatPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const run = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!alive) return;

      if (!session) {
        router.replace('/login?next=/chat');
        return;
      }

      // user email
      const { data: userData } = await supabase.auth.getUser();
      if (!alive) return;
      setEmail(userData?.user?.email ?? null);

      setChecking(false);
    };

    run();
    return () => {
      alive = false;
    };
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (checking) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Chat UI</h2>
        <div>Checking session...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>Chat</div>
          <div style={{ opacity: 0.7, fontSize: 13 }}>{email ?? 'unknown user'}</div>
        </div>

        <button
          onClick={logout}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid rgba(0,0,0,0.15)',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: 16, padding: 14, border: '1px dashed rgba(0,0,0,0.25)', borderRadius: 12 }}>
        Одоо бол хоосон биш харагдана ✅
        <br />
        Дараагийн алхам: энд чинь жинхэнэ Chat UI-г чинь холбоно.
      </div>
    </div>
  );
}
