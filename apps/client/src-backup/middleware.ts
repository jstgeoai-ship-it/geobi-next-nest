import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/cookies';

export const config = {
  matcher: ['/katalog/dashboard-pbb/:path*', '/katalog/pbb-p2/:path*', '/profile/:path*'],
};

export async function middleware(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  if (access) return NextResponse.next();

  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    // Attempt a silent refresh server-side (edge middleware can still call Nest directly).
    try {
      const nestUrl = process.env.NEST_API_URL ?? 'http://localhost:3001';
      const res = await fetch(`${nestUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (res.ok) {
        const data = (await res.json()) as { accessToken: string; refreshToken: string };
        const response = NextResponse.next();
        const secure = process.env.NODE_ENV === 'production';
        response.cookies.set(ACCESS_COOKIE, data.accessToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });
        response.cookies.set(REFRESH_COOKIE, data.refreshToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });
        return response;
      }
    } catch {
      // fall through to redirect
    }
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}
