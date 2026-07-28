import { Module } from '@nestjs/common';
import { PbbController } from './pbb.controller';
import { PbbSearchService } from './pbb-search.service';
import { PbbStatsService } from './pbb-stats.service';
import { PbbWilayahService } from './pbb-wilayah.service';

@Module({
  controllers: [PbbController],
  providers: [PbbStatsService, PbbWilayahService, PbbSearchService],
})
export class PbbModule {}
