/** Filter shape accepted by GET /pbb/stats — mirrors PetaPbbController::applyFilters()'s $f array. */
export interface StatsFilter {
  kelurahan?: string;
  rw?: string;
  rt?: string;
  tahun?: string | number;
  /** slugs: tinggi|sedang|rendah|tidak_kena_pajak — mapped server-side via KATEGORI_PBB_MAP */
  kategori?: string[];
  kategori_njop?: string[];
  kategori_njop_bumi?: string[];
  kategori_njop_bangunan?: string[];
  /** raw status_pem strings, see STATUS_PEM */
  status?: string[];
  periode_awal?: string;
  periode_akhir?: string;
  periode_mode?: 'ketat' | 'longgar';
}

/** Row shape returned by PetaPbbController::aggregate() — one aggregate query, 16 columns. */
export interface PbbAggregateRow {
  total: number;
  sudah_bayar: number;
  belum_bayar: number;
  pbb_nol: number;
  dibatalkan: number;
  lainnya: number;
  pbb_tinggi: number;
  pbb_sedang: number;
  pbb_rendah: number;
  pbb_tidak_kena_pajak: number;
  realisasi_rp: number;
  belum_rp: number;
  target_rp: number;
  batal_rp: number;
  nol_rp: number;
}

/** One bar of the RT/RW realisasi breakdown chart — GET /pbb/stats/wilayah. */
export interface WilayahRealisasiRow {
  label: string;
  realisasi_rp: number;
  target_rp: number;
  pct: number;
}
