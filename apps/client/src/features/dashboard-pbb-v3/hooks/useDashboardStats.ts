'use client';

import { useQuery } from '@tanstack/react-query';
import type { PbbAggregateRow } from '@geobi/shared';
import { useFiltersStore } from '../store/filters.store';
import { buildStatsQuery } from '../lib/build-stats-query';

async function fetchStats(query: string): Promise<PbbAggregateRow> {
  const res = await fetch(`/api/pbb/stats?${query}`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export function useDashboardStats() {
  // Select primitives individually (not a fresh object literal) — Zustand/useSyncExternalStore
  // needs a stable snapshot reference; an inline object selector re-allocates every render and
  // triggers "Maximum update depth exceeded" / getSnapshot-should-be-cached infinite loops.
  const kelurahan = useFiltersStore((s) => s.kelurahan);
  const rw = useFiltersStore((s) => s.rw);
  const rt = useFiltersStore((s) => s.rt);
  const tahun = useFiltersStore((s) => s.tahun);
  const periodeAwal = useFiltersStore((s) => s.periodeAwal);
  const periodeAkhir = useFiltersStore((s) => s.periodeAkhir);
  const periodeMode = useFiltersStore((s) => s.periodeMode);
  const kategoriPbb = useFiltersStore((s) => s.kategoriPbb);
  const kategoriNjop = useFiltersStore((s) => s.kategoriNjop);
  const kategoriNjopBumi = useFiltersStore((s) => s.kategoriNjopBumi);
  const kategoriNjopBangunan = useFiltersStore((s) => s.kategoriNjopBangunan);
  const status = useFiltersStore((s) => s.status);

  const query = buildStatsQuery({
    kelurahan, rw, rt, tahun, periodeAwal, periodeAkhir, periodeMode,
    kategoriPbb, kategoriNjop, kategoriNjopBumi, kategoriNjopBangunan, status,
  });

  return useQuery({
    queryKey: ['pbb', 'stats', query],
    queryFn: () => fetchStats(query),
    placeholderData: (prev) => prev,
  });
}
