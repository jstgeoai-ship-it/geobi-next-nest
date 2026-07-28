import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from './pool.provider';

/**
 * Thin parameterized-query helper — deliberately not a query builder/ORM.
 * Mirrors Laravel's `DB::select($sql, $bindings)` almost 1:1 ($1,$2... in
 * place of `?`), so each repository method here stays a close, auditable
 * transliteration of the matching PetaPbbController method.
 */
@Injectable()
export class QueryService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async query<T = any>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  async one<T = any>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }
}
