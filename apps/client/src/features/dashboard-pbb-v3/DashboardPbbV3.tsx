'use client';

import { useEffect, useState } from 'react';
import './lib/chart-setup';
import './dashboard.css';
import { Navbar } from '@/components/Navbar';
import { CONFIG as config } from './config';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MapPanel } from './components/MapPanel/MapPanel';
import { TourOverlay } from './components/TourOverlay';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useTahunList } from './hooks/useWilayahOptions';
import { useTour } from './hooks/useTour';
import { useFiltersStore } from './store/filters.store';

export function DashboardPbbV3() {
  const { data: stats, error } = useDashboardStats();
  const { data: tahunData } = useTahunList();
  const tahun = useFiltersStore((s) => s.tahun);
  const setTahun = useFiltersStore((s) => s.setTahun);
  const tour = useTour();
  // Always starts open on a fresh page load — collapse state is transient UI, not persisted.
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Matched to v2: seeds tahun = tahunTerbaru() by default (config.defaultTahunFilter).
  useEffect(() => {
    if (tahun || !tahunData) return;
    if (config.defaultTahunFilter && tahunData.tahunTerbaru != null) {
      setTahun(String(tahunData.tahunTerbaru));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tahunData, config.defaultTahunFilter]);

  return (
    <div className="dashboard-root">
      <Navbar />
      <div id="workspace">
        <Sidebar
          showGauge={config.showGauge}
          stats={stats}
          tahunAktif={tahun}
          error={error ? String(error) : null}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((c) => !c)}
        />
        <MapPanel
          showScaleControl={config.showScaleControl}
          showBasemapSwitcher={config.showBasemapSwitcher}
          showStatChip={config.showStatChip}
          showTour={config.showTour}
          searchMode={config.searchMode}
          waktuPanelVariant={config.waktuPanelVariant}
          onTourOpen={tour.open}
        />
      </div>
      {config.showTour && <TourOverlay tour={tour} />}
    </div>
  );
}
