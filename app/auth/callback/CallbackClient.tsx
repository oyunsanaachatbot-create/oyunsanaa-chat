'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const run = async () => {
      const code = sp.get('code');
      const next = sp.get('next') || '/chat';

      // code байхгүй бол зүгээр login руу
      if (!code) {
        router.replace('/auth/login');
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        router.replace('/auth/login?error=oauth');
        return;
      }

      router.replace(next);
    };

    run();
  }, [sp, router]);

  return <div style={{ padding: 24 }}>Signing you in…</div>;
}
