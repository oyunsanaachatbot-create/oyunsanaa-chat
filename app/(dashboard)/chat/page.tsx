'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.error('getSession error', error);

        if (!mounted) return;
        setAuthed(!!data.session);
      } catch (e) {
        console.error('session check failed', e);
        if (!mounted) return;
        setAuthed(false);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ padding: 24 }}>Checking session...</div>;
  }

  if (!authed) {
    router.replace('/login?next=/chat');
    return <div style={{ padding: 24 }}>Redirecting to login...</div>;
  }

  // ✅ эндээс доош чинь жинхэнэ Chat UI чинь render-лэнэ
  return (
    <div style={{ padding: 24 }}>
      <h1>Chat UI</h1>
      {/* TODO: энд чинь жинхэнэ чат компонент чинь байх ёстой */}
    </div>
  );
}
