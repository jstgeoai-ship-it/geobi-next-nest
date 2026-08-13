import { NextResponse } from 'next/server';
import { NEST_API_URL } from '@/lib/cookies';

export async function POST(request: Request) {
  const body = await request.json();
  const nestRes = await fetch(`${NEST_API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const data = await nestRes.json();
  return NextResponse.json(data, { status: nestRes.status });
}
