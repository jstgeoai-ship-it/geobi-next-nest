/**
 * The 4 payment-status strings as stored verbatim in `status_pem` (Postgres).
 * Single source of truth — must match `data_tanah_atribut.status_pem` exactly,
 * byte for byte, since queries filter with `whereIn`/`IN (...)` against these.
 */
export const STATUS_PEM = {
  SUDAH_BAYAR: 'SUDAH BAYAR',
  BELUM_BAYAR: 'BELUM BAYAR / BELUM LUNAS',
  PBB_NOL: 'PBB BAYAR 0 RUPIAH',
  DIBATALKAN: 'DI BATALKAN',
} as const;

export type StatusPem = (typeof STATUS_PEM)[keyof typeof STATUS_PEM];

/**
 * kategori_pbb slugs used by the frontend filter UI, mapped to the
 * capitalized strings actually stored in `kategori_pbb`.
 */
export const KATEGORI_PBB_MAP: Record<string, string> = {
  tinggi: 'Tinggi',
  sedang: 'Sedang',
  rendah: 'Rendah',
  tidak_kena_pajak: 'Tidak Kena Pajak',
};
