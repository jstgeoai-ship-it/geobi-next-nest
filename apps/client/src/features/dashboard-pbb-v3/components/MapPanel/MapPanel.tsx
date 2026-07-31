'use client';

import { useRef } from 'react';
import type { SearchResult } from '@geobi/shared';
import { useDashboardMap } from '../../hooks/useDashboardMap';
import { useParcelFilterSync } from '../../hooks/useParcelFilterSync';
import { SearchBar } from './SearchBar';
import { GeocoderSearchBar } from './GeocoderSearchBar';
import { FilterGrid } from './FilterGrid';
import { WilayahRealisasiPanel } from './WilayahRealisasiPanel';

interface Props {
  showScaleControl: boolean;
  showBasemapSwitcher: boolean;
  showStatChip: boolean;
  showTour: boolean;
  searchMode: 'pbb' | 'geocoder';
  waktuPanelVariant: 'segmented' | 'plain';
  onTourOpen: () => void;
}

export function MapPanel({ showScaleControl, showBasemapSwitcher, showStatChip, showTour, searchMode, waktuPanelVariant, onTourOpen }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const statChipRef = useRef<HTMLDivElement>(null);

  const { mapRef, mapLoaded, flyToResult } = useDashboardMap(containerRef, tooltipRef, statChipRef, {
    showScaleControl, showBasemapSwitcher, showStatChip, showTour, onTourOpen,
  });
  useParcelFilterSync(mapRef, mapLoaded);

  function handleSelect(lng: number, lat: number, row?: SearchResult) {
    flyToResult(lng, lat, row as unknown as Record<string, unknown> | undefined);
  }

  return (
    <div id="main">
      <div id="map" ref={containerRef} />
      {searchMode === 'pbb' ? (
        <SearchBar onSelect={handleSelect} />
      ) : (
        <GeocoderSearchBar onSelect={(lng, lat) => flyToResult(lng, lat)} />
      )}
      <FilterGrid waktuPanelVariant={waktuPanelVariant} />
      <WilayahRealisasiPanel />

      {showStatChip && <div id="stat-chip" ref={statChipRef}>Memuat…</div>}

      <div id="hover-tooltip" ref={tooltipRef}>
        <div className="tt-row"><span className="tt-key">ID Objek Pajak</span><span className="tt-val" id="tt-id">—</span></div>
        <div className="tt-row"><span className="tt-key">Luas Tanah</span><span className="tt-val" id="tt-lt">—</span></div>
        <div className="tt-row"><span className="tt-key">Luas Bangunan</span><span className="tt-val" id="tt-lb">—</span></div>
      </div>
    </div>
  );
}
