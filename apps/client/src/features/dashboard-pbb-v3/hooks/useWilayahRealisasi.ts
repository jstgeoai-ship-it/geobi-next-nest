'use client';

import { useQuery } from '@tanstack/react-query';
import type { WilayahRealisasiRow } from '@geobi/shared';

async function fetchWilayahRealisasi(query: string): Promise<WilayahRealisasiRow[]> {
  const res = await fetch(`/api/pbb/stats/wilayah?${query}`);
  if (!res.ok) throw new Error('Failed to fetch wilayah realisasi');
  return res.json();
}

/** Deliberately independent from the main Filter Waktu (which scopes tab Pembayaran to a
 *  single Tahun Pajak + Periode Pembayaran) — this chart has its own Tahun Pajak Awal/Akhir
 *  range, passed in directly by the panel rather than read from the shared filters store. */
export function useWilayahRealisasi(groupBy: 'rt' | 'rw', tahunAwal: string, tahunAkhir: string) {
  const params = new URLSearchParams({ groupBy });
  if (tahunAwal) params.set('tahunAwal', tahunAwal);
  if (tahunAkhir) params.set('tahunAkhir', tahunAkhir);
  const query = params.toString();

  return useQuery({
    queryKey: ['pbb', 'stats', 'wilayah', groupBy, tahunAwal, tahunAkhir],
    queryFn: () => fetchWilayahRealisasi(query),
    placeholderData: (prev) => prev,
  });
}
