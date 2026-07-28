/** Dashboard PBB-P2 Vol. 2 — this feature tree is independent from dashboard-pbb-v3;
 * the two used to share one component tree behind a variant flag, but were split into
 * separate copies so each can be edited without affecting the other. */
export const CONFIG = {
  showGauge: true,
  showScaleControl: false,
  /** v2 has the DARK/OSM/SAT basemap switcher. */
  showBasemapSwitcher: true,
  showStatChip: false,
  /** v2's dashboard() seeds tahun=tahunTerbaru(). */
  defaultTahunFilter: true,
  /** v2 has Alamat/Nama WP/ID Objek search against our own DB. */
  searchMode: 'pbb' as const,
  /** v2's "Tampilkan Bidang" periode toggle uses segmented buttons + banner. */
  waktuPanelVariant: 'segmented' as const,
  /** Only v2 has the guided "?" tour overlay. */
  showTour: true,
  title: 'Dashboard PBB-P2 Vol. 2 (GEO BI)',
};
