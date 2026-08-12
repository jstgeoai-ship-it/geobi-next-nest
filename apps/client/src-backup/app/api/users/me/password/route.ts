import { NextResponse } from 'next/server';
import { fetchNest } from '@/lib/fetchNest';

export async function PUT(request: Request) {
  const body = await request.text();
  const res = await fetchNest('/users/me/password', { method: 'PUT', body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
