import { NextResponse } from 'next/server';
import { fetchNest } from '@/lib/fetchNest';

export async function PATCH(request: Request) {
  const body = await request.text();
  const res = await fetchNest('/users/me', { method: 'PATCH', body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(request: Request) {
  const body = await request.text();
  const res = await fetchNest('/users/me', { method: 'DELETE', body });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
