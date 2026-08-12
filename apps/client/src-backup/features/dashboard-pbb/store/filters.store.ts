import { create } from 'zustand';

export const KATEGORI_PBB_OPTIONS = ['tinggi', 'sedang', 'rendah', 'tidak_kena_pajak'] as const;
export const KATEGORI_NJOP_OPTIONS = ['Tinggi', 'Sedang', 'Rendah', 'Tidak Kena Pajak'] as const;
export const STATUS_OPTIONS = ['sudah', 'belum', 'nol', 'batal'] as const;

export type PanelId =
  | 'panelWaktu'
  | 'panelKategori'
  | 'panelWilayah'
  | 'panelNjop'
  | 'panelStatus'
  | 'panelNjopBumi'
  | 'panelLayer'
  | 'panelNjopBangunan'
  | null;

interface FiltersState {
  kelurahan: string;
  rw: string;
  rt: string;
  tahun: string;
  periodeAwal: string;
  periodeAkhir: string;
  periodeMode: 'ketat' | 'longgar';
  kategoriPbb: string[];
  kategoriNjop: string[];
  kategoriNjopBumi: string[];
  kategoriNjopBangunan: string[];
  status: string[];
  showLine: boolean;
  showKelurahan: boolean;
  showKecamatan: boolean;
  openPanel: PanelId;

  setKelurahan: (v: string) => void;
  setRw: (v: string) => void;
  setRt: (v: string) => void;
  setTahun: (v: string) => void;
  setPeriodeAwal: (v: string) => void;
  setPeriodeAkhir: (v: string) => void;
  setPeriodeMode: (v: 'ketat' | 'longgar') => void;
  toggleKategoriPbb: (v: string) => void;
  setAllKategoriPbb: (checked: boolean) => void;
  toggleKategoriNjop: (v: string) => void;
  setAllKategoriNjop: (checked: boolean) => void;
  toggleKategoriNjopBumi: (v: string) => void;
  setAllKategoriNjopBumi: (checked: boolean) => void;
  toggleKategoriNjopBangunan: (v: string) => void;
  setAllKategoriNjopBangunan: (checked: boolean) => void;
  toggleStatus: (v: string) => void;
  setAllStatus: (checked: boolean) => void;
  setShowLine: (v: boolean) => void;
  setShowKelurahan: (v: boolean) => void;
  setShowKecamatan: (v: boolean) => void;
  togglePanel: (id: PanelId) => void;
  closeAllPanels: () => void;
}

function toggleValue(arr: string[], v: string): string[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export const useFiltersStore = create<FiltersState>((set, get) => ({
  kelurahan: '',
  rw: '',
  rt: '',
  tahun: '',
  periodeAwal: '',
  periodeAkhir: '',
  periodeMode: 'ketat',
  kategoriPbb: [...KATEGORI_PBB_OPTIONS],
  kategoriNjop: [...KATEGORI_NJOP_OPTIONS],
  kategoriNjopBumi: [...KATEGORI_NJOP_OPTIONS],
  kategoriNjopBangunan: [...KATEGORI_NJOP_OPTIONS],
  status: [...STATUS_OPTIONS],
  showLine: true,
  showKelurahan: true,
  showKecamatan: true,
  openPanel: null,

  setKelurahan: (v) => set({ kelurahan: v, rw: '', rt: '' }),
  setRw: (v) => set({ rw: v, rt: '' }),
  setRt: (v) => set({ rt: v }),
  setTahun: (v) => set({ tahun: v }),
  setPeriodeAwal: (v) => set({ periodeAwal: v }),
  setPeriodeAkhir: (v) => set({ periodeAkhir: v }),
  setPeriodeMode: (v) => set({ periodeMode: v }),

  toggleKategoriPbb: (v) => set({ kategoriPbb: toggleValue(get().kategoriPbb, v) }),
  setAllKategoriPbb: (checked) => set({ kategoriPbb: checked ? [...KATEGORI_PBB_OPTIONS] : [] }),

  toggleKategoriNjop: (v) => set({ kategoriNjop: toggleValue(get().kategoriNjop, v) }),
  setAllKategoriNjop: (checked) => set({ kategoriNjop: checked ? [...KATEGORI_NJOP_OPTIONS] : [] }),

  toggleKategoriNjopBumi: (v) => set({ kategoriNjopBumi: toggleValue(get().kategoriNjopBumi, v) }),
  setAllKategoriNjopBumi: (checked) => set({ kategoriNjopBumi: checked ? [...KATEGORI_NJOP_OPTIONS] : [] }),

  toggleKategoriNjopBangunan: (v) => set({ kategoriNjopBangunan: toggleValue(get().kategoriNjopBangunan, v) }),
  setAllKategoriNjopBangunan: (checked) => set({ kategoriNjopBangunan: checked ? [...KATEGORI_NJOP_OPTIONS] : [] }),

  toggleStatus: (v) => set({ status: toggleValue(get().status, v) }),
  setAllStatus: (checked) => set({ status: checked ? [...STATUS_OPTIONS] : [] }),

  setShowLine: (v) => set({ showLine: v }),
  setShowKelurahan: (v) => set({ showKelurahan: v }),
  setShowKecamatan: (v) => set({ showKecamatan: v }),

  togglePanel: (id) => set((s) => ({ openPanel: s.openPanel === id ? null : id })),
  closeAllPanels: () => set({ openPanel: null }),
}));
