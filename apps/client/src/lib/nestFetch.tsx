import { NEST_API_URL } from './cookies';

/**
 * Shared by the unauthenticated /api/auth/* route handlers (login, register,
 * forgot-password, reset-password, refresh — the ones that don't go through
 * fetchNest.ts because they run before there's an access-token cookie to attach).
 *
 * Centralizes the same failure handling fetchNest.ts has: if Nest is down/unreachable,
 * fetch() itself throws, and an uncaught throw inside a Route Handler makes Next.js
 * fall back to its generic "Internal server error" response — which looked identical
 * to a real backend error even though the request never got anywhere near Nest,
 * the database, or the person's credentials.
 */
export async function postNest(
  path: string,
  body: unknown,
): Promise<{ ok: boolean; status: number; data: any }> {
  let res: Response;
  try {
    res = await fetch(`${NEST_API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
  } catch (err) {
    console.error(`[postNest] could not reach Nest API at ${NEST_API_URL}${path}`, err);
    return {
      ok: false,
      status: 502,
      data: { message: `Tidak bisa terhubung ke server API (${NEST_API_URL}). Pastikan "apps/server" (Nest) sedang berjalan.` },
    };
  }

  try {
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch {
    return {
      ok: false,
      status: 502,
      data: { message: `Server API membalas dengan format tak terduga (status ${res.status}). Cek terminal "apps/server" untuk error aslinya.` },
    };
  }
}
