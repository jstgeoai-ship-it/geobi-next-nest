import { NextResponse } from 'next/server';
import { postNest } from '@/lib/nestFetch';

export async function POST(request: Request) {
  const body = await request.json();
  const { status, data } = await postNest('/auth/forgot-password', body);
  return NextResponse.json(data, { status });
}
