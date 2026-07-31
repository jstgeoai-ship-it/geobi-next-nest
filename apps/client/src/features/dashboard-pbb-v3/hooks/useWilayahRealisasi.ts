'use client';

import { useQuery } from '@tanstack/react-query';
import type { WilayahRealisasiRow } from '@geobi/shared';
import {
  useFiltersStore,
  KATEGORI_PBB_OPTIONS,
  KATEGORI_NJOP_OPTIONS,
  STATUS_OPTIONS,
} from '../store/filters.store';
import { buildStatsQuery } from '../lib/build-stats-query';

async function fetchWilayahRealisasi(query: string): Promise<WilayahRealisasiRow[]> {
  const res = await fetch(`/api/pbb/stats/wilayah?${query}`);
  if (!res.ok) throw new Error('Failed to fetch wilayah realisasi');
  return res.json();
}

/** Deliberately only reacts to the Waktu (tahun/periode) filter — the RT/RW breakdown loses
 *  its point if pre-scoped to one kelurahan/status/kategori, since the whole idea is to
 *  compare realisasi across every region for the selected period. */
export function useWilayahRealisasi(groupBy: 'rt' | 'rw') {
  const tahun = useFiltersStore((s) => s.tahun);
  const periodeAwal = useFiltersStore((s) => s.periodeAwal);
  const periodeAkhir = useFiltersStore((s) => s.periodeAkhir);
  const periodeMode = useFiltersStore((s) => s.periodeMode);

  const query = buildStatsQuery({
    kelurahan: '', rw: '', rt: '', tahun, periodeAwal, periodeAkhir, periodeMode,
    kategoriPbb: [...KATEGORI_PBB_OPTIONS],
    kategoriNjop: [...KATEGORI_NJOP_OPTIONS],
    kategoriNjopBumi: [...KATEGORI_NJOP_OPTIONS],
    kategoriNjopBangunan: [...KATEGORI_NJOP_OPTIONS],
    status: [...STATUS_OPTIONS],
  });
  const fullQuery = query ? `${query}&groupBy=${groupBy}` : `groupBy=${groupBy}`;

  return useQuery({
    queryKey: ['pbb', 'stats', 'wilayah', groupBy, query],
    queryFn: () => fetchWilayahRealisasi(fullQuery),
    placeholderData: (prev) => prev,
  });
}
