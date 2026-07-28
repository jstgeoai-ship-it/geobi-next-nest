import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const PG_POOL = Symbol('PG_POOL');

export const pgPoolProvider: Provider = {
  provide: PG_POOL,
  useFactory: (config: ConfigService) => {
    return new Pool({
      host: config.get<string>('DB_HOST'),
      port: config.get<number>('DB_PORT'),
      database: config.get<string>('DB_DATABASE'),
      user: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
    });
  },
  inject: [ConfigService],
};
