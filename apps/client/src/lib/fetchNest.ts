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

  // If Nest is down/unreachable, fetch() throws — an uncaught throw here would bubble up
  // through every route that calls fetchNest() (stats, tiles, /auth/me, ...) as Next's
  // generic "Internal server error", indistinguishable from a real backend bug. Wrapping it
  // lets us return a proper 502 with a message pointing at the actual cause instead.
  let res: Response;
  try {
    res = await doFetch(accessToken);
  } catch (err) {
    console.error(`[fetchNest] could not reach Nest API at ${NEST_API_URL}${path}`, err);
    return Response.json(
      { message: `Tidak bisa terhubung ke server API (${NEST_API_URL}). Pastikan "apps/server" (Nest) sedang berjalan.` },
      { status: 502 },
    );
  }

  if (res.status === 401 && accessToken) {
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      try {
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
      } catch (err) {
        // Nest was reachable a moment ago (we got the 401) but dropped between requests —
        // fall through and return the original 401 rather than throwing.
        console.error(`[fetchNest] refresh call to Nest API failed`, err);
      }
    }
  }

  return res;
}
