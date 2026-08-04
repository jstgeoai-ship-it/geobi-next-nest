import { Injectable } from '@nestjs/common';
import { WilayahBoundsRow } from '@geobi/shared';
import { QueryService } from '../database/query.util';

const T_ATRIBUT = 'data_tanah_atribut';
const MV_MAP = 'data_tanah_map';

/** Port of PetaPbbController::kelurahanOptions()/rwOptions()/rtOptions(). */
@Injectable()
export class PbbWilayahService {
  constructor(private readonly db: QueryService) {}

  async kelurahanOptions(): Promise<string[]> {
    const rows = await this.db.query<{ kelurahan: string }>(
      `SELECT DISTINCT kelurahan FROM ${T_ATRIBUT} WHERE kelurahan IS NOT NULL ORDER BY kelurahan`,
    );
    return rows.map((r) => r.kelurahan);
  }

  async rwOptions(kelurahan?: string): Promise<string[]> {
    const params: unknown[] = [];
    let where = 'WHERE rw IS NOT NULL';
    if (kelurahan) {
      params.push(kelurahan);
      where += ` AND kelurahan = $${params.length}`;
    }
    const rows = await this.db.query<{ rw: string }>(
      `SELECT DISTINCT rw FROM ${T_ATRIBUT} ${where} ORDER BY rw`,
      params,
    );
    return rows.map((r) => r.rw);
  }

  async rtOptions(kelurahan?: string, rw?: string): Promise<string[]> {
    const params: unknown[] = [];
    let where = 'WHERE rt IS NOT NULL';
    if (kelurahan) {
      params.push(kelurahan);
      where += ` AND kelurahan = $${params.length}`;
    }
    if (rw) {
      params.push(rw);
      where += ` AND rw = $${params.length}`;
    }
    const rows = await this.db.query<{ rt: string }>(
      `SELECT DISTINCT rt FROM ${T_ATRIBUT} ${where} ORDER BY rt`,
      params,
    );
    return rows.map((r) => r.rt);
  }

  /** Bounding box of one RT/RW's parcels — feeds the bar chart's click-to-zoom. Reads
   *  `data_tanah_map` (the atribut+geom materialized view) since `data_tanah_atribut` alone
   *  has no geometry column. */
  async bounds(groupBy: 'rt' | 'rw', value: string): Promise<WilayahBoundsRow | null> {
    const column = groupBy === 'rw' ? 'rw' : 'rt';
    const row = await this.db.one<{ min_lng: number; min_lat: number; max_lng: number; max_lat: number }>(
      `SELECT
         ST_XMin(ST_Extent(geom)) AS min_lng, ST_YMin(ST_Extent(geom)) AS min_lat,
         ST_XMax(ST_Extent(geom)) AS max_lng, ST_YMax(ST_Extent(geom)) AS max_lat
       FROM ${MV_MAP}
       WHERE ${column} = $1 AND geom IS NOT NULL`,
      [value],
    );
    if (!row || row.min_lng == null) return null;
    return { minLng: row.min_lng, minLat: row.min_lat, maxLng: row.max_lng, maxLat: row.max_lat };
  }
}
