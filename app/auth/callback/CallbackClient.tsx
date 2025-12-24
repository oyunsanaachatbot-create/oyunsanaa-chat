'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const next = sp.get('next') || '/chat';
      const code = sp.get('code');

      if (code) await supabase.auth.exchangeCodeForSession(code);

      router.replace(next);
    };
    run();
  }, [router, sp]);

  return null;
}
