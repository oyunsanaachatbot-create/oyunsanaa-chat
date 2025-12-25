'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace(`/login?next=${encodeURIComponent('/chat')}`);
      } else {
        // энд чинь жинхэнэ Chat UI/route байвал тийш нь оруул
        // Хэрвээ одоо чиний чат өөр route дээр байвал (ж: /chat-ui) тэр рүү солиорой.
        // router.replace('/chat-ui');
      }
    });
  }, [router]);

  // session шалгаж байх хооронд
  return <div style={{ padding: 24 }}>Checking session…</div>;
}
