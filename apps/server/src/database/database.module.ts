import { Global, Module } from '@nestjs/common';
import { pgPoolProvider } from './pool.provider';
import { QueryService } from './query.util';

@Global()
@Module({
  providers: [pgPoolProvider, QueryService],
  exports: [QueryService],
})
export class DatabaseModule {}
