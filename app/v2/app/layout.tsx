import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {}
        },
      },
    },
  );
}

export default async function V2AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect('/login?next=/v2/app/chat');

  return <>{children}</>;
}
