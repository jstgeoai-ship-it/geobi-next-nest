import { NextResponse } from 'next/server';
import { postNest } from '@/lib/nestFetch';

export async function POST(request: Request) {
  const body = await request.json();
  const { status, data } = await postNest('/auth/reset-password', body);
  return NextResponse.json(data, { status });
}
