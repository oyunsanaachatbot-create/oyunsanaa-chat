import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

function isAlwaysPublic(pathname: string) {
  return (
    pathname === '/login' ||
    pathname.startsWith('/auth') || // /auth/callback, /auth/update-password
    pathname.startsWith('/_next') ||
    pathname === '/favicon.ico'
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // always-public pages
  if (isAlwaysPublic(pathname)) return NextResponse.next();

  // ✅ guest зөвхөн invite-тэй үед нээлттэй
  if (pathname === '/guest') {
    const invite = req.nextUrl.searchParams.get('invite');
    if (invite && invite.length > 5) return NextResponse.next();

    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  // session байхгүй бол login руу
  if (!data.user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
