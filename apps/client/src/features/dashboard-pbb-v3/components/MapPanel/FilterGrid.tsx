'use client';

import { useEffect, useRef } from 'react';
import {
  KATEGORI_NJOP_OPTIONS,
  KATEGORI_PBB_OPTIONS,
  type PanelId,
  useFiltersStore,
} from '../../store/filters.store';
import { CategoryPanel } from './panels/CategoryPanel';
import { StatusPanel } from './panels/StatusPanel';
import { WilayahPanel } from './panels/WilayahPanel';
import { WaktuPanel } from './panels/WaktuPanel';
import { LayerPanel } from './panels/LayerPanel';
import type { SidebarTab } from '../Sidebar/Sidebar';

/** Tab Time Series only ever needs to scope by when/where — the rest (status, kategori,
 *  NJOP) is Pembayaran-specific filtering logic. */
const TIMESERIES_PANEL_IDS: PanelId[] = ['panelWaktu', 'panelWilayah', 'panelLayer'];

const KATEGORI_PBB_LABELS: Record<string, { label: string; hint: string }> = {
  tinggi: { label: 'Tinggi', hint: '> Rp 15.485.100' },
  sedang: { label: 'Sedang', hint: 'Rp 7.005.100 – 15.485.600' },
  rendah: { label: 'Rendah', hint: '< Rp 7.005.000' },
  tidak_kena_pajak: { label: 'Tidak Kena Pajak', hint: 'Rp 0' },
};

function njopOptions(hints: [string, string, string, string]) {
  return KATEGORI_NJOP_OPTIONS.map((v, i) => ({ value: v, label: v, hint: hints[i] }));
}

const BUTTONS: { id: PanelId; btnId: string; label: string; icon: string }[] = [
  { id: 'panelWaktu', btnId: 'btnPanelWaktu', label: 'Filter Waktu', icon: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>' },
  { id: 'panelWilayah', btnId: 'btnPanelWilayah', label: 'Filter Wilayah', icon: '<path d="M12 21s-7-5.686-7-11a7 7 0 1 1 14 0c0 5.314-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>' },
  { id: 'panelStatus', btnId: 'btnPanelStatus', label: 'Status Pembayaran', icon: '<path d="M20 6L9 17l-5-5"/>' },
  { id: 'panelKategori', btnId: 'btnPanelKategori', label: 'Kategori PBB', icon: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>' },
  { id: 'panelNjop', btnId: 'btnPanelNjop', label: 'Kategori NJOP Total', icon: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5h5M9.5 12h5M12 9v6"/>' },
  { id: 'panelNjopBumi', btnId: 'btnPanelNjopBumi', label: 'Kategori NJOP Bumi', icon: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>' },
  { id: 'panelNjopBangunan', btnId: 'btnPanelNjopBangunan', label: 'Kategori NJOP Bangunan', icon: '<path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h2M9 13h2M9 17h2M13 9h2M13 13h2M13 17h2"/>' },
  { id: 'panelLayer', btnId: 'btnPanelLayer', label: 'Layer Peta', icon: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },
];

export function FilterGrid({ waktuPanelVariant, sidebarTab }: { waktuPanelVariant: 'segmented' | 'plain'; sidebarTab: SidebarTab }) {
  const openPanel = useFiltersStore((s) => s.openPanel);
  const togglePanel = useFiltersStore((s) => s.togglePanel);
  const closeAllPanels = useFiltersStore((s) => s.closeAllPanels);
  const rootRef = useRef<HTMLDivElement>(null);
  // All buttons stay mounted (never filtered out of the DOM) so hiding/showing them for the
  // active tab can transition smoothly via CSS — removing them outright would make the strip
  // snap to its new size instantly instead of animating.
  const isVisibleForTab = (id: PanelId) => sidebarTab !== 'timeseries' || TIMESERIES_PANEL_IDS.includes(id);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAllPanels();
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [closeAllPanels]);

  const kategoriPbb = useFiltersStore((s) => s.kategoriPbb);
  const toggleKategoriPbb = useFiltersStore((s) => s.toggleKategoriPbb);
  const setAllKategoriPbb = useFiltersStore((s) => s.setAllKategoriPbb);

  const kategoriNjop = useFiltersStore((s) => s.kategoriNjop);
  const toggleKategoriNjop = useFiltersStore((s) => s.toggleKategoriNjop);
  const setAllKategoriNjop = useFiltersStore((s) => s.setAllKategoriNjop);

  const kategoriNjopBumi = useFiltersStore((s) => s.kategoriNjopBumi);
  const toggleKategoriNjopBumi = useFiltersStore((s) => s.toggleKategoriNjopBumi);
  const setAllKategoriNjopBumi = useFiltersStore((s) => s.setAllKategoriNjopBumi);

  const kategoriNjopBangunan = useFiltersStore((s) => s.kategoriNjopBangunan);
  const toggleKategoriNjopBangunan = useFiltersStore((s) => s.toggleKategoriNjopBangunan);
  const setAllKategoriNjopBangunan = useFiltersStore((s) => s.setAllKategoriNjopBangunan);

  const status = useFiltersStore((s) => s.status);
  const toggleStatus = useFiltersStore((s) => s.toggleStatus);
  const setAllStatus = useFiltersStore((s) => s.setAllStatus);

  function renderPanelContent(id: PanelId) {
    switch (id) {
      case 'panelWilayah':
        return <WilayahPanel />;
      case 'panelWaktu':
        return <WaktuPanel variant={waktuPanelVariant} />;
      case 'panelKategori':
        return (
          <CategoryPanel
            title="Kategori PBB yang Harus Bayar"
            options={KATEGORI_PBB_OPTIONS.map((v) => ({ value: v, ...KATEGORI_PBB_LABELS[v] }))}
            selected={kategoriPbb}
            onToggle={toggleKategoriPbb}
            onSetAll={setAllKategoriPbb}
          />
        );
      case 'panelNjop':
        return <CategoryPanel title="Kategori NJOP Total" options={njopOptions(['> Rp 7,70 M', 'Rp 3,52 M – 7,69 M', '< Rp 3,52 M', 'Rp 0'])} selected={kategoriNjop} onToggle={toggleKategoriNjop} onSetAll={setAllKategoriNjop} />;
      case 'panelStatus':
        return <StatusPanel selected={status} onToggle={toggleStatus} onSetAll={setAllStatus} />;
      case 'panelNjopBumi':
        return <CategoryPanel title="Kategori NJOP Bumi" options={njopOptions(['> Rp 6,15 M', 'Rp 2,75 M – 6,14 M', '< Rp 2,75 M', 'Rp 0'])} selected={kategoriNjopBumi} onToggle={toggleKategoriNjopBumi} onSetAll={setAllKategoriNjopBumi} />;
      case 'panelLayer':
        return <LayerPanel />;
      case 'panelNjopBangunan':
        return <CategoryPanel title="Kategori NJOP Bangunan" options={njopOptions(['> Rp 1,48 M', 'Rp 0,6 M – 1,48 M', '< Rp 0,6 M', 'Rp 0'])} selected={kategoriNjopBangunan} onToggle={toggleKategoriNjopBangunan} onSetAll={setAllKategoriNjopBangunan} />;
      default:
        return null;
    }
  }

  return (
    <div id="panel-float" ref={rootRef}>
      <div className="panel-grid">
        {BUTTONS.map((b) => (
          <div key={b.id} className={`panel-btn-wrap${isVisibleForTab(b.id) ? '' : ' panel-btn-hidden'}`}>
            <button
              id={b.btnId}
              className={`panel-icon-btn${openPanel === b.id ? ' active' : ''}`}
              type="button"
              data-label={b.label}
              aria-label={b.label}
              tabIndex={isVisibleForTab(b.id) ? 0 : -1}
              onClick={() => togglePanel(b.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: b.icon }} />
            </button>
            {openPanel === b.id && <div className="float-panel-dropdown">{renderPanelContent(b.id)}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
