import {
  KATEGORI_NJOP_OPTIONS,
  KATEGORI_PBB_OPTIONS,
  STATUS_OPTIONS,
} from '../store/filters.store';

export interface StatsFilterState {
  kelurahan: string;
  rw: string;
  rt: string;
  tahun: string;
  periodeAwal: string;
  periodeAkhir: string;
  periodeMode: 'ketat' | 'longgar';
  kategoriPbb: string[];
  kategoriNjop: string[];
  kategoriNjopBumi: string[];
  kategoriNjopBangunan: string[];
  status: string[];
}

const STATUS_VALUE_MAP: Record<string, string> = {
  sudah: 'SUDAH BAYAR',
  belum: 'BELUM BAYAR / BELUM LUNAS',
  nol: 'PBB BAYAR 0 RUPIAH',
  batal: 'DI BATALKAN',
};

/** Sentinel sent when a category panel has zero boxes checked, so the backend's IN (...)
 * clause matches nothing instead of the filter being silently skipped (see appendCategory). */
const NONE_SENTINEL = '__none__';

/**
 * Builds the query string for GET /pbb/stats (and mirrors what the map's
 * setFilter expressions represent) — port of refreshStats()'s param-building
 * half in dashboard.blade.php, with one deliberate deviation: the original only
 * sends a category filter when 0 < checked < all, silently treating "0 checked"
 * the same as "all checked" (no filter at all) — a pre-existing Laravel quirk
 * where the map (which zeroes via an empty-array `in` expression) and the stats
 * sidebar (which received no filter param) disagreed. Here "0 checked" sends the
 * NONE_SENTINEL so the sidebar/gauge also correctly drop to zero, matching the map.
 */
export function buildStatsQuery(f: StatsFilterState): string {
  const p = new URLSearchParams();

  if (f.kelurahan) p.set('kelurahan', f.kelurahan);
  if (f.rw) p.set('rw', f.rw);
  if (f.rt) p.set('rt', f.rt);
  if (f.tahun) p.set('tahun', f.tahun);
  if (f.periodeAwal) p.set('periode_awal', f.periodeAwal);
  if (f.periodeAkhir) p.set('periode_akhir', f.periodeAkhir);
  if (f.periodeAwal || f.periodeAkhir) p.set('periode_mode', f.periodeMode);

  const appendCategory = (key: string, values: string[], optionCount: number, map?: (v: string) => string) => {
    if (values.length === 0) { p.append(key, NONE_SENTINEL); return; }
    if (values.length >= optionCount) return; // all checked == no filter
    values.forEach((v) => p.append(key, map ? map(v) : v));
  };

  appendCategory('kategori', f.kategoriPbb, KATEGORI_PBB_OPTIONS.length);
  appendCategory('kategori_njop', f.kategoriNjop, KATEGORI_NJOP_OPTIONS.length);
  appendCategory('kategori_njop_bumi', f.kategoriNjopBumi, KATEGORI_NJOP_OPTIONS.length);
  appendCategory('kategori_njop_bangunan', f.kategoriNjopBangunan, KATEGORI_NJOP_OPTIONS.length);
  appendCategory('status', f.status, STATUS_OPTIONS.length, (v) => STATUS_VALUE_MAP[v]);

  return p.toString();
}
