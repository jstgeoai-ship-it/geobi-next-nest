'use client';

import { useFiltersStore } from '../../../store/filters.store';

export function LayerPanel() {
  const showLine = useFiltersStore((s) => s.showLine);
  const showKelurahan = useFiltersStore((s) => s.showKelurahan);
  const showKecamatan = useFiltersStore((s) => s.showKecamatan);
  const setShowLine = useFiltersStore((s) => s.setShowLine);
  const setShowKelurahan = useFiltersStore((s) => s.setShowKelurahan);
  const setShowKecamatan = useFiltersStore((s) => s.setShowKecamatan);

  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '.09em', marginBottom: 8 }}>
        Batas Wilayah
      </div>
      <div className="layer-toggle">
        <label><input type="checkbox" checked={showLine} onChange={(e) => setShowLine(e.target.checked)} /> Batas Bidang</label>
      </div>
      <div className="layer-toggle">
        <label><input type="checkbox" checked={showKelurahan} onChange={(e) => setShowKelurahan(e.target.checked)} /> Batas Kelurahan</label>
      </div>
      <div className="layer-toggle">
        <label><input type="checkbox" checked={showKecamatan} onChange={(e) => setShowKecamatan(e.target.checked)} /> Batas Kecamatan</label>
      </div>
    </div>
  );
}
