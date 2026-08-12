import { cookies } from 'next/headers';
import { ACCESS_COOKIE, NEST_API_URL, REFRESH_COOKIE } from './cookies';

/**
 * Server-side helper used by every Route Handler under /api/* to call Nest.
 * Reads the httpOnly access-token cookie and forwards it as a Bearer header
 * — the browser never sees or sends the raw JWT. On a 401 (expired access
 * token) it transparently refreshes once via the refresh cookie and retries.
 */
export async function fetchNest(path: string, init: RequestInit = {}): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  const doFetch = (token?: string) =>
    fetch(`${NEST_API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

  let res = await doFetch(accessToken);

  if (res.status === 401 && accessToken) {
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      const refreshRes = await fetch(`${NEST_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      });

      if (refreshRes.ok) {
        const data = (await refreshRes.json()) as { accessToken: string; refreshToken: string };
        cookieStore.set(ACCESS_COOKIE, data.accessToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
        cookieStore.set(REFRESH_COOKIE, data.refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
        res = await doFetch(data.accessToken);
      }
    }
  }

  return res;
}
