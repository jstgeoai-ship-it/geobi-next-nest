import { NextResponse } from 'next/server';
import { fetchNest } from '@/lib/fetchNest';

export async function GET() {
  const res = await fetchNest('/auth/me');
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
