import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/cookies';
import { postNest } from '@/lib/nestFetch';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  const { ok, status, data } = await postNest('/auth/refresh', { refreshToken });

  if (!ok) {
    cookieStore.delete(ACCESS_COOKIE);
    cookieStore.delete(REFRESH_COOKIE);
    return NextResponse.json(data, { status });
  }

  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set(ACCESS_COOKIE, data.accessToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });
  cookieStore.set(REFRESH_COOKIE, data.refreshToken, { httpOnly: true, sameSite: 'lax', secure, path: '/' });

  return NextResponse.json({ user: data.user });
}
