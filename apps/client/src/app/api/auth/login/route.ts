import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/cookies';
import { postNest } from '@/lib/nestFetch';

export async function POST(request: Request) {
  const body = await request.json();
  const { ok, status, data } = await postNest('/auth/login', body);

  if (!ok) {
    return NextResponse.json(data, { status });
  }

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set(ACCESS_COOKIE, data.accessToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });
  cookieStore.set(REFRESH_COOKIE, data.refreshToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });

  return NextResponse.json({ user: data.user });
}
