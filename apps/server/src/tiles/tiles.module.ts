import { Module } from '@nestjs/common';
import { TilesController } from './tiles.controller';
import { tilesPgPoolProvider } from './tiles-pool.provider';

@Module({
  controllers: [TilesController],
  providers: [tilesPgPoolProvider],
})
export class TilesModule {}
