'use client';

import { useEffect, useRef, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import './pbb-p2.css';
import { usePbbP2Map } from './hooks/usePbbP2Map';
import { SearchBar } from './components/SearchBar';
import { useTheme } from '@/lib/useTheme';

export function PetaPbbP2() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const statChipRef = useRef<HTMLDivElement>(null);

  const { flyToResult, setBasemap, setLayerVisible } = usePbbP2Map(mapContainerRef, tooltipRef, statChipRef);
  const { theme } = useTheme();

  const [panelOpen, setPanelOpen] = useState(true);
  const [basemap, setBasemapState] = useState<'dark' | 'osm' | 'satellite' | 'positron'>('dark');

  // Keep the picker's active highlight in sync with the automatic dark/light -> basemap switch
  // that usePbbP2Map applies whenever the theme changes (light -> OSM, dark -> Dark).
  useEffect(() => {
    setBasemapState(theme === 'light' ? 'osm' : 'dark');
  }, [theme]);
  const [showBidang, setShowBidang] = useState(true);
  const [showKecamatan, setShowKecamatan] = useState(true);
  const [showKelurahan, setShowKelurahan] = useState(true);

  function changeBasemap(key: 'dark' | 'osm' | 'satellite' | 'positron') {
    setBasemapState(key);
    setBasemap(key);
  }

  return (
    <div className="pbbp2-root">
      <Navbar />
      <div id="map" ref={mapContainerRef} />

      <button id="panel-toggle" type="button" onClick={() => setPanelOpen((v) => !v)}>
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
        </svg>
        <span>{panelOpen ? 'Tutup' : 'Layer'}</span>
      </button>

      <aside id="panel" className={panelOpen ? '' : 'hidden'}>
        <div className="panel-head">
          <h2>Peta PBB-P2</h2>
          <p>Data Tanah · BAPENDA DKI Jakarta</p>
        </div>
        <div className="panel-body">
          <p className="sec-label">Status Pembayaran</p>
          <div className="leg-item"><span className="leg-swatch" style={{ background: 'transparent', border: '2px solid #22c55e' }} />Sudah Bayar</div>
          <div className="leg-item"><span className="leg-swatch" style={{ background: 'transparent', border: '2px solid #ef4444' }} />Belum Bayar / Belum Lunas</div>
          <div className="leg-item"><span className="leg-swatch" style={{ background: 'transparent', border: '2px solid #f59e0b' }} />PBB Bayar 0 Rupiah</div>
          <div className="leg-item"><span className="leg-swatch" style={{ background: 'transparent', border: '2px solid #475569' }} />Lainnya / N/A</div>

          <hr className="divider" />

          <p className="sec-label">Daftar Layer</p>
          <label className="toggle-row" style={{ marginBottom: 8 }}>
            <input type="checkbox" checked={showBidang} onChange={(e) => { setShowBidang(e.target.checked); setLayerVisible(['tanah-fill', 'tanah-line', 'tanah-hover'], e.target.checked); }} />
            <span className="leg-swatch" style={{ background: 'linear-gradient(135deg,#22c55e,#ef4444)', borderRadius: 2 }} />
            Layer Bidang PBB-P2
          </label>
          <label className="toggle-row" style={{ marginBottom: 8 }}>
            <input type="checkbox" checked={showKecamatan} onChange={(e) => { setShowKecamatan(e.target.checked); setLayerVisible(['kec-fill', 'kec-line-casing', 'kec-line'], e.target.checked); }} />
            <span className="leg-swatch" style={{ background: 'transparent', border: '3px solid #fbbf24', borderRadius: 2 }} />
            Layer Batas Kecamatan
          </label>
          <label className="toggle-row" style={{ marginBottom: 8 }}>
            <input type="checkbox" checked={showKelurahan} onChange={(e) => { setShowKelurahan(e.target.checked); setLayerVisible(['kel-fill', 'kel-line-casing', 'kel-line', 'kel-label'], e.target.checked); }} />
            <span className="leg-swatch" style={{ background: 'transparent', border: '2px dashed #ffffff', borderRadius: 2 }} />
            Layer Batas Kelurahan
          </label>

          <hr className="divider" />

          <p className="sec-label">Basemap</p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" className={`bm-btn${basemap === 'dark' ? ' active' : ''}`} onClick={() => changeBasemap('dark')}>Dark</button>
            <button type="button" className={`bm-btn${basemap === 'osm' ? ' active' : ''}`} onClick={() => changeBasemap('osm')}>OSM</button>
            <button type="button" className={`bm-btn${basemap === 'satellite' ? ' active' : ''}`} onClick={() => changeBasemap('satellite')}>Satelit</button>
            <button type="button" className={`bm-btn${basemap === 'positron' ? ' active' : ''}`} onClick={() => changeBasemap('positron')}>Positron</button>
          </div>
        </div>
      </aside>

      <SearchBar onSelect={(lng, lat, row) => flyToResult(lng, lat, row as unknown as Record<string, unknown> | undefined)} />

      <div id="hover-tooltip" ref={tooltipRef}>
        <div className="tt-row"><span className="tt-key">ID Objek Pajak</span><span className="tt-val" id="tt-id">—</span></div>
        <div className="tt-row"><span className="tt-key">Luas Tanah</span><span className="tt-val" id="tt-lt">—</span></div>
        <div className="tt-row"><span className="tt-key">Luas Bangunan</span><span className="tt-val" id="tt-lb">—</span></div>
      </div>

      <div id="stat" ref={statChipRef}>Memuat…</div>
    </div>
  );
}
