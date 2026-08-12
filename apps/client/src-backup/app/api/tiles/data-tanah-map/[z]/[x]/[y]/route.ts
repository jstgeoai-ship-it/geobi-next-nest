import { NextResponse } from 'next/server';
import { NEST_API_URL } from '@/lib/cookies';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ z: string; x: string; y: string }> },
) {
  const { z, x, y } = await params;
  const tahun = new URL(request.url).searchParams.get('tahun');
  const qs = tahun ? `?tahun=${encodeURIComponent(tahun)}` : '';

  const nestRes = await fetch(`${NEST_API_URL}/tiles/data-tanah-map/${z}/${x}/${y}${qs}`, {
    cache: 'no-store',
  });

  if (nestRes.status === 204 || !nestRes.ok) {
    return new NextResponse(null, { status: nestRes.status });
  }

  const buf = await nestRes.arrayBuffer();
  return new NextResponse(buf, {
    status: 200,
    headers: { 'Content-Type': 'application/x-protobuf', 'Cache-Control': 'no-store' },
  });
}
