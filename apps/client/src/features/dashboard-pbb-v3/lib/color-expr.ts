import type { ExpressionSpecification } from 'maplibre-gl';

/** Parcel fill/line color by status_pem — port of dashboard.blade.php's COLOR_EXPR. */
export const COLOR_EXPR: ExpressionSpecification = [
  'match',
  ['coalesce', ['get', 'status_pem'], ''],
  'SUDAH BAYAR', '#3b82f6',
  'BELUM BAYAR / BELUM LUNAS', '#f59e0b',
  'PBB BAYAR 0 RUPIAH', '#94a3b8',
  'DI BATALKAN', '#8b5cf6',
  '#475569',
];
