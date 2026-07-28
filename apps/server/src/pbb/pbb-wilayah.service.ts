import { Injectable } from '@nestjs/common';
import { QueryService } from '../database/query.util';

const T_ATRIBUT = 'data_tanah_atribut';

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
}
