import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import type { Pool } from 'pg';
import { TILES_PG_POOL } from './tiles-pool.provider';

const CACHE_TTL_MS = 5 * 60 * 1000;
const tileCache = new Map<string, { buf: Buffer | null; expires: number }>();

/** Serves data_tanah_map as MVT tiles filtered by tahun_pajak server-side, bypassing
 *  Martin — whose function-source discovery is unreliable against Supabase's pooler.
 *  Unfiltered (no ?tahun=) mirrors Martin's own /data_tanah_map/{z}/{x}/{y} behavior.
 *  The underlying data barely changes at dev-time, so a short in-memory cache avoids
 *  re-running the same multi-second cross-region query for every re-pan over the same tile. */
@Controller('tiles')
export class TilesController {
  constructor(@Inject(TILES_PG_POOL) private readonly pool: Pool) {}

  @Get('data-tanah-map/:z/:x/:y')
  async dataTanahMapTile(
    @Param('z') z: string,
    @Param('x') x: string,
    @Param('y') y: string,
    @Query('tahun') tahun: string | undefined,
    @Res() res: Response,
  ) {
    const key = `${z}/${x}/${y}/${tahun ?? ''}`;
    const cached = tileCache.get(key);
    let tile: Buffer | null;
    if (cached && cached.expires > Date.now()) {
      tile = cached.buf;
    } else {
      const result = await this.pool.query<{ tile: Buffer | null }>(
        'SELECT data_tanah_map_tiles($1, $2, $3, $4) AS tile',
        [Number(z), Number(x), Number(y), tahun ? Number(tahun) : null],
      );
      tile = result.rows[0]?.tile ?? null;
      tileCache.set(key, { buf: tile, expires: Date.now() + CACHE_TTL_MS });
    }

    res.set('Cache-Control', 'no-store');
    if (!tile || tile.length === 0) {
      res.status(204).end();
      return;
    }
    res.set('Content-Type', 'application/x-protobuf');
    res.status(200).send(tile);
  }
}
