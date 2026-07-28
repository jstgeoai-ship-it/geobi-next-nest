import { Injectable } from '@nestjs/common';
import { SearchMode, SearchResult } from '@geobi/shared';
import { QueryService } from '../database/query.util';
import { escapeLikeChars, normAlamat } from './alamat-normalizer';
import { normAlamatSql } from './alamat-normalizer.sql';

const MV_MAP = 'data_tanah_map';

const SELECT_COLS = `
  idobjekpaj, nama_wajib_pajak, alamat, status_pem, tahun_pajak,
  pbb_yang_dibayar, pbb_terutang,
  njop_total, njop_bumi, njop_bangunan,
  luas_tanah, luas_bangu, luas_geometri AS shape_area,
  jenis_bumi, jpb, rt, rw, kelurahan, kecamatan, kota,
  ST_X(ST_PointOnSurface(geom)) AS lng,
  ST_Y(ST_PointOnSurface(geom)) AS lat
`;

/** Port of PetaPbbController::search()/searchAlamat(). Source = data_tanah_map, same MV Martin tiles from. */
@Injectable()
export class PbbSearchService {
  constructor(private readonly db: QueryService) {}

  async search(rawQuery: string, rawMode: string | undefined): Promise<SearchResult[]> {
    const q = rawQuery.trim();
    const mode: SearchMode = rawMode === 'nama' || rawMode === 'idop' ? rawMode : 'alamat';

    if (q.length < 2) return [];

    if (mode === 'alamat') return this.searchAlamat(q);

    const col = mode === 'nama' ? 'nama_wajib_pajak' : 'idobjekpaj';

    // ID objek pajak selalu 5 digit ber-nol-depan (00001..11500).
    const exact = mode === 'idop' && /^\d+$/.test(q) && q.length < 5 ? q.padStart(5, '0') : q;
    const like = escapeLikeChars(q);

    const sql = `
      WITH bidang AS (
        SELECT DISTINCT ON (idobjekpaj) ${SELECT_COLS}
        FROM public.${MV_MAP}
        WHERE geom IS NOT NULL
          AND (${col} ILIKE $1 ESCAPE '\\' OR ${col} = $2)
        ORDER BY idobjekpaj, tahun_pajak DESC NULLS LAST
      )
      SELECT * FROM bidang
      ORDER BY
        CASE
          WHEN lower(${col}) = lower($3) THEN 0
          WHEN lower(${col}) LIKE lower($4) || '%' THEN 1
          ELSE 2
        END,
        length(${col}),
        ${col}
      LIMIT 10
    `;

    return this.db.query<SearchResult>(sql, [`%${like}%`, exact, exact, like]);
  }

  private async searchAlamat(q: string): Promise<SearchResult[]> {
    const norm = normAlamat(q);
    const tokens = norm.split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return [];

    const expr = normAlamatSql('alamat');
    const params: unknown[] = [];
    const whereParts: string[] = [];

    for (const t of tokens) {
      params.push(`% ${escapeLikeChars(t)}%`);
      whereParts.push(`${expr} LIKE $${params.length} ESCAPE '\\'`);
    }
    const whereSql = whereParts.join(' AND ');

    params.push(norm);
    const exactIdx = params.length;
    params.push(`% ${escapeLikeChars(norm)}%`);
    const phraseIdx = params.length;

    const sql = `
      WITH bidang AS (
        SELECT DISTINCT ON (idobjekpaj) ${SELECT_COLS}, ${expr} AS _norm
        FROM public.${MV_MAP}
        WHERE geom IS NOT NULL AND ${whereSql}
        ORDER BY idobjekpaj, tahun_pajak DESC NULLS LAST
      )
      SELECT * FROM bidang
      ORDER BY
        CASE
          WHEN btrim(_norm) = $${exactIdx} THEN 0
          WHEN _norm LIKE $${phraseIdx} THEN 1
          ELSE 2
        END,
        length(alamat),
        alamat
      LIMIT 10
    `;

    return this.db.query<SearchResult>(sql, params);
  }
}
