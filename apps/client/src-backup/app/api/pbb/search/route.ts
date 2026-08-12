import { NextResponse } from 'next/server';
import { fetchNest } from '@/lib/fetchNest';

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  const res = await fetchNest(`/pbb/search${search}`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
