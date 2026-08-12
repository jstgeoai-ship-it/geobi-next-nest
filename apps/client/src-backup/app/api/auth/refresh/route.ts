import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, NEST_API_URL, REFRESH_COOKIE } from '@/lib/cookies';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const nestRes = await fetch(`${NEST_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
  });

  const data = await nestRes.json();
  if (!nestRes.ok) {
    cookieStore.delete(ACCESS_COOKIE);
    cookieStore.delete(REFRESH_COOKIE);
    return NextResponse.json(data, { status: nestRes.status });
  }

  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set(ACCESS_COOKIE, data.accessToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });
  cookieStore.set(REFRESH_COOKIE, data.refreshToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });

  return NextResponse.json({ user: data.user });
}
