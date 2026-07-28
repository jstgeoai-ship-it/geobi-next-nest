export type SearchMode = 'alamat' | 'nama' | 'idop';

export interface SearchQuery {
  q: string;
  mode?: SearchMode;
}

/** One row from data_tanah_map, as returned by search()/searchAlamat(). */
export interface SearchResult {
  idobjekpaj: string;
  nama_wajib_pajak: string | null;
  alamat: string | null;
  status_pem: string | null;
  tahun_pajak: string | number | null;
  pbb_yang_dibayar: number | null;
  pbb_terutang: number | null;
  njop_total: number | null;
  njop_bumi: number | null;
  njop_bangunan: number | null;
  luas_tanah: number | null;
  luas_bangu: number | null;
  shape_area: number | null;
  jenis_bumi: string | null;
  jpb: string | null;
  rt: string | null;
  rw: string | null;
  kelurahan: string | null;
  kecamatan: string | null;
  kota: string | null;
  /** guaranteed-inside-polygon point via ST_PointOnSurface, for map flyTo */
  lng: number;
  lat: number;
}
