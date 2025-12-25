'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const go = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (session) {
        router.replace('/chat');
      } else {
        router.replace('/login?next=/chat');
      }
    };
    go();
  }, [router]);

  return null;
}
