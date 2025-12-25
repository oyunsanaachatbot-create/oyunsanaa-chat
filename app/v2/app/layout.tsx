'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function V2AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;

    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;

      if (!data.user) {
        router.replace('/login?next=/v2/app/chat');
        return;
      }
      setReady(true);
    };

    check();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      check();
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [router]);

  if (!ready) return null; // эсвэл loading UI

  return <>{children}</>;
}
