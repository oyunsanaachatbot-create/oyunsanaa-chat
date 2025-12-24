'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const next = searchParams.get('next') || '/chat';
      const code = searchParams.get('code');

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      router.replace(next);
    };

    run();
  }, [router, searchParams]);

  return null;
}
