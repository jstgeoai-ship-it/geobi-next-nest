'use client';

import { useEffect } from 'react';
import type { Map as MaplibreMap } from 'maplibre-gl';
import { useFiltersStore } from '../store/filters.store';
import { buildParcelFilterExpression } from './useDashboardMap';

/** Re-applies map setFilter/layer-visibility whenever filter state changes (stats refetch is handled separately by useDashboardStats via TanStack Query). */
export function useParcelFilterSync(mapRef: React.RefObject<MaplibreMap | null>, mapLoaded: boolean) {
  const state = useFiltersStore();

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const combined = buildParcelFilterExpression(state);
    ['tanah-fill', 'tanah-line', 'tanah-hover'].forEach((id) => {
      if (map.getLayer(id)) map.setFilter(id, combined as any);
    });

    const setVis = (ids: string[], on: boolean) =>
      ids.forEach((id) => { if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none'); });
    setVis(['tanah-line'], state.showLine);
    setVis(['kec-fill', 'kec-line-casing', 'kec-line'], state.showKecamatan);
    setVis(['kel-fill', 'kel-line-casing', 'kel-line', 'kel-label'], state.showKelurahan);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapLoaded,
    state.kelurahan, state.rw, state.rt, state.tahun,
    state.periodeAwal, state.periodeAkhir, state.periodeMode,
    state.kategoriPbb, state.kategoriNjop, state.kategoriNjopBumi, state.kategoriNjopBangunan,
    state.status, state.showLine, state.showKelurahan, state.showKecamatan,
  ]);
}
