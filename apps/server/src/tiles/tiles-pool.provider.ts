import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const TILES_PG_POOL = Symbol('TILES_PG_POOL');

/** Heavy MVT-generation queries behave badly over Supabase's transaction pooler (used by
 *  DB_PORT for the rest of the app) — the same query that takes ~3.5s on the session
 *  pooler took 60s+ here. So tile serving gets its own small pool pinned to port 5432. */
export const tilesPgPoolProvider: Provider = {
  provide: TILES_PG_POOL,
  useFactory: (config: ConfigService) => {
    return new Pool({
      host: config.get<string>('DB_HOST'),
      port: 5432,
      database: config.get<string>('DB_DATABASE'),
      user: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      max: 6,
    });
  },
  inject: [ConfigService],
};
