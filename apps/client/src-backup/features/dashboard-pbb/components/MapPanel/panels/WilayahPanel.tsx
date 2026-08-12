'use client';

import { useKelurahanOptions, useRtOptions, useRwOptions } from '../../../hooks/useWilayahOptions';
import { useFiltersStore } from '../../../store/filters.store';

export function WilayahPanel() {
  const kelurahan = useFiltersStore((s) => s.kelurahan);
  const rw = useFiltersStore((s) => s.rw);
  const rt = useFiltersStore((s) => s.rt);
  const setKelurahan = useFiltersStore((s) => s.setKelurahan);
  const setRw = useFiltersStore((s) => s.setRw);
  const setRt = useFiltersStore((s) => s.setRt);

  const { data: kelurahanOptions = [] } = useKelurahanOptions();
  const { data: rwOptions = [] } = useRwOptions(kelurahan);
  const { data: rtOptions = [] } = useRtOptions(kelurahan, rw);

  return (
    <div>
      <div className="wilayah-field">
        <label className="wilayah-field-label" htmlFor="filterKelurahan">Kelurahan</label>
        <select id="filterKelurahan" className="wilayah-select" value={kelurahan} onChange={(e) => setKelurahan(e.target.value)}>
          <option value="">Semua Kelurahan</option>
          {kelurahanOptions.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="wilayah-field">
        <label className="wilayah-field-label" htmlFor="filterRW">RW</label>
        <select id="filterRW" className="wilayah-select" value={rw} disabled={!kelurahan} onChange={(e) => setRw(e.target.value)}>
          <option value="">Semua RW</option>
          {rwOptions.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="wilayah-field">
        <label className="wilayah-field-label" htmlFor="filterRT">RT</label>
        <select id="filterRT" className="wilayah-select" value={rt} disabled={!rw} onChange={(e) => setRt(e.target.value)}>
          <option value="">Semua RT</option>
          {rtOptions.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    </div>
  );
}
