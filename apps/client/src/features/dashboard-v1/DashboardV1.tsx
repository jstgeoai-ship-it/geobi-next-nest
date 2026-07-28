'use client';

import { useRef, useState } from 'react';
import '../dashboard-pbb/lib/chart-setup';
import './dashboard-v1.css';
import { Navbar } from '@/components/Navbar';
import { SidebarV1 } from './components/SidebarV1';
import { GeocoderSearchBar } from '../dashboard-pbb/components/MapPanel/GeocoderSearchBar';
import { useV1Map } from './hooks/useV1Map';
import { useV1Stats } from './hooks/useV1Stats';

export function DashboardV1() {
  const { data: stats, error } = useV1Stats();
  const [activeStatus, setActiveStatus] = useState('');
  const [showFill, setShowFill] = useState(true);
  const [showLine, setShowLine] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const statChipRef = useRef<HTMLDivElement>(null);

  const { flyTo, setStatusFilter, setLayerVisible } = useV1Map(containerRef, tooltipRef, statChipRef);

  function handleStatusChange(key: string) {
    setActiveStatus(key);
    setStatusFilter(key);
  }

  function handleToggleFill(v: boolean) {
    setShowFill(v);
    setLayerVisible('tanah-fill', v);
  }

  function handleToggleLine(v: boolean) {
    setShowLine(v);
    setLayerVisible('tanah-line', v);
  }

  return (
    <div className="dashboard-v1-root">
      <Navbar />
      <div id="workspace">
        <SidebarV1
          stats={stats}
          error={error ? String(error) : null}
          activeStatus={activeStatus}
          onStatusChange={handleStatusChange}
          showFill={showFill}
          showLine={showLine}
          onToggleFill={handleToggleFill}
          onToggleLine={handleToggleLine}
        />

        <div id="main">
          <div id="map" ref={containerRef} />
          <GeocoderSearchBar onSelect={flyTo} />
          <div id="stat-chip" ref={statChipRef}>Memuat…</div>
          <div id="hover-tooltip" ref={tooltipRef}>
            <div className="tt-row"><span className="tt-key">ID Objek Pajak</span><span className="tt-val" id="tt-id">—</span></div>
            <div className="tt-row"><span className="tt-key">Luas Tanah</span><span className="tt-val" id="tt-lt">—</span></div>
            <div className="tt-row"><span className="tt-key">Luas Bangunan</span><span className="tt-val" id="tt-lb">—</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
