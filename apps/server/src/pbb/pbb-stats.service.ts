import { Injectable } from '@nestjs/common';
import { PbbAggregateRow, StatsFilter, STATUS_PEM, WilayahRealisasiRow } from '@geobi/shared';
import { QueryService } from '../database/query.util';
import { buildWhereClause } from './filters.builder';

const T_ATRIBUT = 'data_tanah_atribut';
const WILAYAH_GROUP_COLUMNS = { rt: 'rt', rw: 'rw' } as const;

/** Port of PetaPbbController::aggregate()/tahunTerbaru()/daftarTahun(). */
@Injectable()
export class PbbStatsService {
  constructor(private readonly db: QueryService) {}

  async aggregate(filter: StatsFilter): Promise<PbbAggregateRow> {
    const { sql: whereSql, params } = buildWhereClause(filter);

    const sql = `
      SELECT
        COUNT(*)::int AS total,
        SUM(CASE WHEN status_pem = '${STATUS_PEM.SUDAH_BAYAR}' THEN 1 ELSE 0 END)::int AS sudah_bayar,
        SUM(CASE WHEN status_pem = '${STATUS_PEM.BELUM_BAYAR}' THEN 1 ELSE 0 END)::int AS belum_bayar,
        SUM(CASE WHEN status_pem = '${STATUS_PEM.PBB_NOL}' THEN 1 ELSE 0 END)::int AS pbb_nol,
        SUM(CASE WHEN status_pem = '${STATUS_PEM.DIBATALKAN}' THEN 1 ELSE 0 END)::int AS dibatalkan,
        SUM(CASE WHEN status_pem NOT IN ('${STATUS_PEM.SUDAH_BAYAR}','${STATUS_PEM.BELUM_BAYAR}','${STATUS_PEM.PBB_NOL}','${STATUS_PEM.DIBATALKAN}') THEN 1 ELSE 0 END)::int AS lainnya,
        SUM(CASE WHEN kategori_pbb = 'Tinggi' THEN 1 ELSE 0 END)::int AS pbb_tinggi,
        SUM(CASE WHEN kategori_pbb = 'Sedang' THEN 1 ELSE 0 END)::int AS pbb_sedang,
        SUM(CASE WHEN kategori_pbb = 'Rendah' THEN 1 ELSE 0 END)::int AS pbb_rendah,
        SUM(CASE WHEN kategori_pbb = 'Tidak Kena Pajak' THEN 1 ELSE 0 END)::int AS pbb_tidak_kena_pajak,
        COALESCE(SUM(pbb_telah_bayar), 0) AS realisasi_rp,
        COALESCE(SUM(pbb_belum_bayar), 0) AS belum_rp,
        COALESCE(SUM(pbb_telah_bayar), 0) + COALESCE(SUM(pbb_belum_bayar), 0) AS target_rp,
        COALESCE(SUM(CASE WHEN status_pem = '${STATUS_PEM.DIBATALKAN}' THEN COALESCE(pbb_telah_bayar,0)+COALESCE(pbb_belum_bayar,0) ELSE 0 END), 0) AS batal_rp,
        0 AS nol_rp
      FROM ${T_ATRIBUT}
      ${whereSql}
    `;

    const row = await this.db.one<PbbAggregateRow>(sql, params);
    return (
      row ?? {
        total: 0,
        sudah_bayar: 0,
        belum_bayar: 0,
        pbb_nol: 0,
        dibatalkan: 0,
        lainnya: 0,
        pbb_tinggi: 0,
        pbb_sedang: 0,
        pbb_rendah: 0,
        pbb_tidak_kena_pajak: 0,
        realisasi_rp: 0,
        belum_rp: 0,
        target_rp: 0,
        batal_rp: 0,
        nol_rp: 0,
      }
    );
  }

  async tahunTerbaru(): Promise<string | number | null> {
    const row = await this.db.one<{ max: string | number | null }>(
      `SELECT MAX(tahun_pajak) FROM ${T_ATRIBUT}`,
    );
    return row?.max ?? null;
  }

  async daftarTahun(): Promise<(string | number)[]> {
    const rows = await this.db.query<{ tahun_pajak: string | number }>(
      `SELECT DISTINCT tahun_pajak FROM ${T_ATRIBUT} WHERE tahun_pajak IS NOT NULL ORDER BY tahun_pajak DESC`,
    );
    return rows.map((r) => r.tahun_pajak);
  }

  /** Sudah/Belum Bayar rupiah + SPPT-count breakdown per RT or RW — feeds the map's floating
   *  stacked bar chart panel. Deliberately independent from the main Filter Waktu (single
   *  tahun + periode pembayaran, see StatsFilter) — this panel has its own Tahun Pajak
   *  Awal/Akhir range, unrelated to the tab Pembayaran filter. groupBy must come from
   *  WILAYAH_GROUP_COLUMNS, never straight from the request. */
  async aggregateByWilayah(
    groupBy: 'rt' | 'rw',
    tahunAwal?: string | number,
    tahunAkhir?: string | number,
  ): Promise<WilayahRealisasiRow[]> {
    const column = WILAYAH_GROUP_COLUMNS[groupBy];
    const clauses = [`${column} IS NOT NULL`, `${column} <> ''`];
    const params: unknown[] = [];
    if (tahunAwal) { params.push(tahunAwal); clauses.push(`tahun_pajak >= $${params.length}`); }
    if (tahunAkhir) { params.push(tahunAkhir); clauses.push(`tahun_pajak <= $${params.length}`); }

    const sql = `
      SELECT
        ${column} AS label,
        COALESCE(SUM(pbb_telah_bayar), 0) AS sudah_bayar_rp,
        COALESCE(SUM(pbb_belum_bayar), 0) AS belum_bayar_rp,
        SUM(CASE WHEN status_pem = '${STATUS_PEM.SUDAH_BAYAR}' THEN 1 ELSE 0 END)::int AS sudah_bayar_count,
        SUM(CASE WHEN status_pem = '${STATUS_PEM.BELUM_BAYAR}' THEN 1 ELSE 0 END)::int AS belum_bayar_count
      FROM ${T_ATRIBUT}
      WHERE ${clauses.join(' AND ')}
      GROUP BY ${column}
      ORDER BY ${column}
    `;

    const rows = await this.db.query<{
      label: string; sudah_bayar_rp: string; belum_bayar_rp: string;
      sudah_bayar_count: number; belum_bayar_count: number;
    }>(sql, params);
    return rows.map((r) => ({
      label: r.label,
      sudahBayarRp: Number(r.sudah_bayar_rp),
      belumBayarRp: Number(r.belum_bayar_rp),
      sudahBayarCount: r.sudah_bayar_count,
      belumBayarCount: r.belum_bayar_count,
    }));
  }
}
