'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchJson(url: string): Promise<string[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

export function useKelurahanOptions() {
  return useQuery({
    queryKey: ['pbb', 'wilayah', 'kelurahan'],
    queryFn: () => fetchJson('/api/pbb/wilayah/kelurahan'),
    staleTime: Infinity,
  });
}

export function useRwOptions(kelurahan: string) {
  return useQuery({
    queryKey: ['pbb', 'wilayah', 'rw', kelurahan],
    queryFn: () => fetchJson(`/api/pbb/wilayah/rw?kelurahan=${encodeURIComponent(kelurahan)}`),
    enabled: !!kelurahan,
  });
}

export function useRtOptions(kelurahan: string, rw: string) {
  return useQuery({
    queryKey: ['pbb', 'wilayah', 'rt', kelurahan, rw],
    queryFn: () =>
      fetchJson(
        `/api/pbb/wilayah/rt?kelurahan=${encodeURIComponent(kelurahan)}&rw=${encodeURIComponent(rw)}`,
      ),
    enabled: !!kelurahan && !!rw,
  });
}

export function useTahunList() {
  return useQuery({
    queryKey: ['pbb', 'tahun'],
    queryFn: async () => {
      const res = await fetch('/api/pbb/tahun');
      if (!res.ok) return { tahunTerbaru: null, daftarTahun: [] as (string | number)[] };
      return res.json() as Promise<{ tahunTerbaru: string | number | null; daftarTahun: (string | number)[] }>;
    },
    staleTime: Infinity,
  });
}
