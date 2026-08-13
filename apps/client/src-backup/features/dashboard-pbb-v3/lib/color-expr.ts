import type { ExpressionSpecification } from 'maplibre-gl';

/** Parcel fill/line color by status_pem — port of dashboard.blade.php's COLOR_EXPR. */
export const COLOR_EXPR: ExpressionSpecification = [
  'match',
  ['coalesce', ['get', 'status_pem'], ''],
  'SUDAH BAYAR', '#22c55e',
  'BELUM BAYAR / BELUM LUNAS', '#ef4444',
  'PBB BAYAR 0 RUPIAH', '#f59e0b',
  'DI BATALKAN', '#3b82f6',
  '#475569',
];
