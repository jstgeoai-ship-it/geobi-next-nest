export const rupiah = (v: unknown) => 'Rp ' + Number(v || 0).toLocaleString('id-ID');

export const rupiahM = (v: unknown) =>
  'Rp ' + (Number(v || 0) / 1e9).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' M';

export const pctOf = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : 0);

export const angka = (v: unknown) => Number(v || 0).toLocaleString('id-ID');
