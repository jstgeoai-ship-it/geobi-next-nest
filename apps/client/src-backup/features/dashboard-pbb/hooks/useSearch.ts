'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { SearchMode, SearchResult } from '@geobi/shared';

export function usePbbSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const seqRef = useRef(0);

  const search = useCallback(async (q: string, mode: SearchMode) => {
    if (q.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }
    const seq = ++seqRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/pbb/search?q=${encodeURIComponent(q)}&mode=${mode}`);
      const data = await res.json();
      if (seq !== seqRef.current) return;
      if (!res.ok || data.error) {
        setError('Gagal menghubungi layanan pencarian');
        setResults([]);
      } else {
        setResults(data);
      }
    } catch {
      if (seq !== seqRef.current) return;
      setError('Gagal menghubungi layanan pencarian');
      setResults([]);
    } finally {
      if (seq === seqRef.current) setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    seqRef.current++;
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  return { results, loading, error, search, clear };
}

/** Debounced (450ms, matching the original) input->search wiring. */
export function useDebouncedSearch(mode: SearchMode, q: string, searchFn: (q: string, mode: SearchMode) => void) {
  useEffect(() => {
    if (q.trim().length < 2) return;
    const t = setTimeout(() => searchFn(q, mode), 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, mode]);
}
