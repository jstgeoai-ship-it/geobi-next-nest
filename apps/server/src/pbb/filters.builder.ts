import { KATEGORI_PBB_MAP, StatsFilter } from '@geobi/shared';

export interface WhereClause {
  sql: string;
  params: unknown[];
}

/**
 * Parameterized port of PetaPbbController::applyFilters(). Operates against
 * `data_tanah_atribut` (no joins) — same table Laravel's aggregate() queries.
 */
export function buildWhereClause(f: StatsFilter): WhereClause {
  const clauses: string[] = [];
  const params: unknown[] = [];

  const pushEq = (column: string, value: unknown) => {
    if (value === undefined || value === null || value === '') return;
    params.push(value);
    clauses.push(`${column} = $${params.length}`);
  };

  const pushIn = (column: string, values: string[] | undefined) => {
    if (!values || values.length === 0) return;
    const placeholders = values.map((v) => {
      params.push(v);
      return `$${params.length}`;
    });
    clauses.push(`${column} IN (${placeholders.join(', ')})`);
  };

  pushEq('kelurahan', f.kelurahan);
  pushEq('rw', f.rw);
  pushEq('rt', f.rt);
  pushEq('tahun_pajak', f.tahun);

  if (f.kategori && f.kategori.length > 0) {
    const mapped = f.kategori.map((v) => KATEGORI_PBB_MAP[v] ?? v);
    pushIn('kategori_pbb', mapped);
  }
  pushIn('kategori_njop_total', f.kategori_njop);
  pushIn('kategori_njop_bumi', f.kategori_njop_bumi);
  pushIn('kategori_njop_bangunan', f.kategori_njop_bangunan);
  pushIn('status_pem', f.status);

  // Filter Periode Pembayaran — parcels that are BELUM BAYAR / PBB 0 have no
  // tgl_bayar (NULL). 'ketat' = only rows paid within the range. 'longgar' =
  // rows with no payment date still pass through.
  const awal = f.periode_awal;
  const akhir = f.periode_akhir;
  if (awal || akhir) {
    const mode = f.periode_mode === 'longgar' ? 'longgar' : 'ketat';
    const rentang: string[] = ['tgl_bayar IS NOT NULL'];
    if (awal) {
      params.push(awal);
      rentang.push(`tgl_bayar >= $${params.length}`);
    }
    if (akhir) {
      params.push(akhir);
      rentang.push(`tgl_bayar <= $${params.length}`);
    }
    const rentangSql = rentang.join(' AND ');
    clauses.push(mode === 'longgar' ? `(tgl_bayar IS NULL OR (${rentangSql}))` : `(${rentangSql})`);
  }

  return {
    sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    params,
  };
}
