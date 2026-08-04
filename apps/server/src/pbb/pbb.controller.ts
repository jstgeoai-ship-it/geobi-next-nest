import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatsFilter } from '@geobi/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PbbSearchService } from './pbb-search.service';
import { PbbStatsService } from './pbb-stats.service';
import { PbbWilayahService } from './pbb-wilayah.service';
import { toArray } from './query-array.util';

@UseGuards(JwtAuthGuard)
@Controller('pbb')
export class PbbController {
  constructor(
    private readonly stats: PbbStatsService,
    private readonly wilayah: PbbWilayahService,
    private readonly search: PbbSearchService,
  ) {}

  /** Tax-year list + latest year — feeds the frontend's date-filter default/greying, since that
   *  used to be computed server-side in Laravel's dashboard()/dashboardV1()/dashboardV3(). */
  @Get('tahun')
  async tahun() {
    const [tahunTerbaru, daftarTahun] = await Promise.all([
      this.stats.tahunTerbaru(),
      this.stats.daftarTahun(),
    ]);
    return { tahunTerbaru, daftarTahun };
  }

  @Get('stats')
  async dashboardStats(@Query() query: Record<string, unknown>) {
    return this.stats.aggregate(this.buildFilterFromQuery(query));
  }

  /** Sudah/Belum Bayar breakdown per RT/RW — feeds the map's floating bar chart panel.
   *  Independent of the main Filter Waktu; takes its own tahunAwal/tahunAkhir range. */
  @Get('stats/wilayah')
  async statsWilayah(@Query() query: Record<string, unknown>) {
    const groupBy = query.groupBy === 'rw' ? 'rw' : 'rt';
    return this.stats.aggregateByWilayah(
      groupBy,
      query.tahunAwal as string | undefined,
      query.tahunAkhir as string | undefined,
    );
  }

  private buildFilterFromQuery(query: Record<string, unknown>): StatsFilter {
    return {
      kelurahan: query.kelurahan as string | undefined,
      rw: query.rw as string | undefined,
      rt: query.rt as string | undefined,
      tahun: query.tahun as string | undefined,
      kategori: toArray(query.kategori),
      kategori_njop: toArray(query.kategori_njop),
      kategori_njop_bumi: toArray(query.kategori_njop_bumi),
      kategori_njop_bangunan: toArray(query.kategori_njop_bangunan),
      status: toArray(query.status),
      periode_awal: query.periode_awal as string | undefined,
      periode_akhir: query.periode_akhir as string | undefined,
      periode_mode: query.periode_mode === 'longgar' ? 'longgar' : 'ketat',
    };
  }

  @Get('wilayah/kelurahan')
  kelurahanOptions() {
    return this.wilayah.kelurahanOptions();
  }

  @Get('wilayah/rw')
  rwOptions(@Query('kelurahan') kelurahan?: string) {
    return this.wilayah.rwOptions(kelurahan);
  }

  @Get('wilayah/rt')
  rtOptions(@Query('kelurahan') kelurahan?: string, @Query('rw') rw?: string) {
    return this.wilayah.rtOptions(kelurahan, rw);
  }

  /** Bounding box for one RT/RW — feeds the bar chart's click-to-zoom-on-map. */
  @Get('wilayah/bounds')
  wilayahBounds(@Query('groupBy') groupBy: string, @Query('value') value: string) {
    return this.wilayah.bounds(groupBy === 'rw' ? 'rw' : 'rt', value);
  }

  @Get('search')
  searchParcels(@Query('q') q = '', @Query('mode') mode?: string) {
    return this.search.search(q, mode);
  }
}
