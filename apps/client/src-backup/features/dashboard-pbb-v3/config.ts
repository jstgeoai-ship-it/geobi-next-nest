/** Dashboard PBB-P2 Vol. 3 — this feature tree is independent from dashboard-pbb (v2);
 * the two used to share one component tree behind a variant flag, but were split into
 * separate copies so each can be edited without affecting the other. */
export const CONFIG = {
  showGauge: true,
  /** Matched to v2: no ScaleControl. */
  showScaleControl: false,
  /** v3 now has the DARK/OSM/SAT basemap switcher too (added on request). */
  showBasemapSwitcher: true,
  /** "N parsel tampil" viewport counter removed on request. */
  showStatChip: false,
  /** Matched to v2: seeds tahun = tahunTerbaru() by default, so the aggregate is scoped to
   * the latest tax year instead of summing every year (this is what made v3's total parcel
   * count 32490 vs v2's ~10830). */
  defaultTahunFilter: true,
  /** v3 now searches Alamat / Nama WP / ID Objek Pajak against our own DB, same as v2
   * (added on request — previously plain external Nominatim geocoding only). */
  searchMode: 'pbb' as const,
  /** Matched to v2: segmented Tampilkan Bidang buttons + banner (not plain radio rows). */
  waktuPanelVariant: 'segmented' as const,
  /** Matched to v2: guided tour overlay enabled. */
  showTour: true,
  title: 'Dashboard PBB-P2 Vol. 3 (GEO BI)',
};
