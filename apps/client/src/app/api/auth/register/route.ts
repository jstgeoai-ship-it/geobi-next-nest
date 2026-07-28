import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, NEST_API_URL, REFRESH_COOKIE } from '@/lib/cookies';

export async function POST(request: Request) {
  const body = await request.json();

  const nestRes = await fetch(`${NEST_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  const data = await nestRes.json();
  if (!nestRes.ok) {
    return NextResponse.json(data, { status: nestRes.status });
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set(ACCESS_COOKIE, data.accessToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });
  cookieStore.set(REFRESH_COOKIE, data.refreshToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });

  return NextResponse.json({ user: data.user });
}
