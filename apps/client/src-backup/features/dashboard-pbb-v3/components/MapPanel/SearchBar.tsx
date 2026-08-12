'use client';

import { useEffect, useRef, useState } from 'react';
import type { SearchMode, SearchResult } from '@geobi/shared';
import { usePbbSearch } from '../../hooks/useSearch';
import { fetchExternalGeocoder } from '../../lib/external-geocoder';

const SEARCH_LABEL: Record<SearchMode, string> = { nama: 'Nama wajib pajak', idop: 'ID objek pajak', alamat: 'Alamat' };
const PLACEHOLDER: Record<SearchMode, string> = {
  alamat: 'Cari alamat…',
  nama: 'Cari nama wajib pajak…',
  idop: 'Cari ID objek pajak, mis. 02442…',
};

interface Item {
  title: string;
  detail: string;
  lng: number;
  lat: number;
  row?: SearchResult;
  badge?: 'Data PBB' | 'Tempat umum';
}

function toPbbItems(mode: SearchMode, rows: SearchResult[]): Item[] {
  return rows.map((d) => ({
    title: mode === 'idop' ? d.idobjekpaj || '—' : mode === 'nama' ? d.nama_wajib_pajak || '—' : d.alamat || '—',
    detail:
      mode === 'idop'
        ? [d.nama_wajib_pajak, d.alamat].filter(Boolean).join(' — ')
        : mode === 'nama'
          ? d.alamat || ''
          : [d.nama_wajib_pajak, d.idobjekpaj].filter(Boolean).join(' — '),
    lng: d.lng,
    lat: d.lat,
    row: d,
    badge: mode === 'alamat' ? 'Data PBB' : undefined,
  }));
}

export function SearchBar({ onSelect }: { onSelect: (lng: number, lat: number, row?: SearchResult) => void }) {
  const [mode, setMode] = useState<SearchMode>('alamat');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [externalItems, setExternalItems] = useState<Item[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const { results, loading, error, search, clear } = usePbbSearch();
  const rootRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const geoSeqRef = useRef(0);

  // Mode "alamat": PBB data always ranks first (openable popup); geocoder results
  // ("tempat umum") fill in when the tax database itself has no coverage there.
  const items: Item[] = mode === 'alamat' ? [...toPbbItems(mode, results), ...externalItems].slice(0, 10) : toPbbItems(mode, results);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  function runSearch(q: string, m: SearchMode) {
    search(q, m);
    setOpen(true);
    setActive(0);
    if (m === 'alamat') {
      const seq = ++geoSeqRef.current;
      setExternalLoading(true);
      fetchExternalGeocoder(q)
        .then((geo) => {
          if (seq !== geoSeqRef.current) return;
          setExternalItems(geo.map((g) => ({ title: g.title, detail: g.detail, lng: g.lng, lat: g.lat, badge: g.badge })));
        })
        .catch(() => { if (seq === geoSeqRef.current) setExternalItems([]); })
        .finally(() => { if (seq === geoSeqRef.current) setExternalLoading(false); });
    } else {
      geoSeqRef.current++;
      setExternalItems([]);
    }
  }

  function handleInput(v: string) {
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (v.trim().length < 2) { clear(); setExternalItems([]); setOpen(false); return; }
    debounceRef.current = setTimeout(() => runSearch(v, mode), 450);
  }

  function handleModeChange(m: SearchMode) {
    setMode(m);
    clear();
    setExternalItems([]);
    if (query.trim().length >= 2) runSearch(query, m);
    else setOpen(false);
  }

  function selectItem(i: number) {
    const item = items[i];
    if (!item) return;
    onSelect(item.lng, item.lat, item.row);
    setQuery(item.title);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (items.length) setActive((a) => (a + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (items.length) setActive((a) => (a - 1 + items.length) % items.length); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (items.length && active >= 0) selectItem(active);
      else runSearch(query, mode);
    } else if (e.key === 'Escape') setOpen(false);
  }

  function handleSearchClick() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (items.length) selectItem(active >= 0 ? active : 0);
    else runSearch(query, mode);
  }

  const isLoading = loading || (mode === 'alamat' && externalLoading && items.length === 0);

  return (
    <div id="search-float" ref={rootRef}>
      <div style={{ position: 'relative' }}>
        <div id="search-bar">
          <select id="search-mode" title="Pilih kategori pencarian" value={mode} onChange={(e) => handleModeChange(e.target.value as SearchMode)}>
            <option value="alamat">Alamat</option>
            <option value="nama">Nama WP</option>
            <option value="idop">ID Objek</option>
          </select>
          <input
            id="search-input"
            type="text"
            placeholder={PLACEHOLDER[mode]}
            autoComplete="off"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (items.length) setOpen(true); }}
          />
          <button id="search-btn" type="button" onClick={handleSearchClick} disabled={loading}>
            Cari
          </button>
        </div>
        {open && (
          <div id="search-results" style={{ display: 'block' }}>
            {isLoading ? (
              <div className="sr-empty">Mencari…</div>
            ) : error ? (
              <div className="sr-empty">{error}</div>
            ) : items.length === 0 ? (
              <>
                <div className="sr-empty">{SEARCH_LABEL[mode]} tidak ditemukan</div>
                {mode === 'alamat' && (
                  <div className="sr-empty" style={{ paddingTop: 0 }}>Data bidang PBB mencakup Kel. Pondok Pinang, Kec. Kebayoran Lama</div>
                )}
              </>
            ) : (
              items.map((item, i) => (
                <div
                  key={`${item.title}-${i}`}
                  className={`sr-item${i === active ? ' sr-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => selectItem(i)}
                >
                  <div className="sr-name">
                    {item.badge && <span className={`sr-badge${item.row ? '' : ' sr-badge-luar'}`}>{item.badge}</span>}
                    {item.title}
                  </div>
                  {item.detail && <div className="sr-detail">{item.detail}</div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
