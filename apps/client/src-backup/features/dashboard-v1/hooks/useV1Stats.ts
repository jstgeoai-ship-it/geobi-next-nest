'use client';

import { useQuery } from '@tanstack/react-query';
import type { PbbAggregateRow } from '@geobi/shared';

/**
 * Port of dashboardV1()'s aggregate([]) call — a single unfiltered snapshot fetched
 * once at load. Unlike v2/v3, the v1 sidebar numbers do NOT react to the status chip;
 * only the map's visual filter and viewport counter (#stat-chip) do.
 */
export function useV1Stats() {
  return useQuery({
    queryKey: ['pbb', 'stats', 'v1-unfiltered'],
    queryFn: async (): Promise<PbbAggregateRow> => {
      const res = await fetch('/api/pbb/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    staleTime: Infinity,
  });
}
