'use client';

import { useEffect, useRef, useState } from 'react';

interface GeoItem {
  title: string;
  detail: string;
  lng: number;
  lat: number;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const JKT_VIEWBOX = '106.68,-6.38,107.00,-6.10';

/** Port of v1/v3's plain Nominatim-only search bar (no PBB-database search, no mode selector). */
export function GeocoderSearchBar({ onSelect }: { onSelect: (lng: number, lat: number) => void }) {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<GeoItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  async function doSearch() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setErrored(false);
    setOpen(false);
    try {
      const url = `${NOMINATIM_URL}?format=json&limit=5&countrycodes=id&viewbox=${JKT_VIEWBOX}&bounded=0&q=${encodeURIComponent(q)}`;
      const data = await fetch(url, { headers: { 'Accept-Language': 'id' } }).then((r) => r.json());
      const parsed: GeoItem[] = (Array.isArray(data) ? data : []).map((item: any) => {
        const parts = String(item.display_name).split(',');
        return {
          title: parts[0].trim(),
          detail: parts.slice(1, 4).join(',').trim(),
          lng: parseFloat(item.lon),
          lat: parseFloat(item.lat),
        };
      });
      setItems(parsed);
      setOpen(true);
    } catch {
      setErrored(true);
      setItems([]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  function selectItem(item: GeoItem) {
    onSelect(item.lng, item.lat);
    setQuery(item.title);
    setOpen(false);
  }

  return (
    <div id="search-float" ref={rootRef}>
      <div style={{ position: 'relative' }}>
        <div id="search-bar">
          <input
            id="search-input"
            type="text"
            placeholder=""
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }}
          />
          <button id="search-btn" type="button" onClick={doSearch} disabled={loading}>
            {loading ? '…' : 'Cari'}
          </button>
        </div>
        {open && (
          <div id="search-results" style={{ display: 'block' }}>
            {errored ? (
              <div className="sr-empty">Gagal menghubungi layanan pencarian</div>
            ) : items.length === 0 ? (
              <div className="sr-empty">Alamat tidak ditemukan</div>
            ) : (
              items.map((item, i) => (
                <div key={i} className="sr-item" onClick={() => selectItem(item)}>
                  <div className="sr-name">{item.title}</div>
                  <div className="sr-detail">{item.detail}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
