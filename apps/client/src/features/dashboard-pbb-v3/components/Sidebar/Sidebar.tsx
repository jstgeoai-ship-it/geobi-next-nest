'use client';

import { useState } from 'react';
import type { PbbAggregateRow } from '@geobi/shared';
import { GaugeCard } from './GaugeCard';
import { KpiGrid } from './KpiGrid';
import { DistributionTable } from './DistributionTable';
import { DonutChart } from './DonutChart';

interface Props {
  showGauge: boolean;
  stats?: PbbAggregateRow;
  tahunAktif: string;
  error?: string | null;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

type SidebarTab = 'pembayaran' | 'timeseries';

export function Sidebar({ showGauge, stats, tahunAktif, error, collapsed, onToggleCollapsed }: Props) {
  const [tab, setTab] = useState<SidebarTab>('pembayaran');

  return (
    <aside id="sidebar" className={collapsed ? 'collapsed' : ''}>
      {collapsed ? (
        <div className="sidebar-collapsed-strip">
          <button type="button" className="sidebar-collapsed-btn" onClick={onToggleCollapsed} title="Buka sidebar" aria-label="Buka sidebar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
          <button
            type="button"
            className={`sidebar-collapsed-btn${tab === 'pembayaran' ? ' active' : ''}`}
            onClick={() => { setTab('pembayaran'); onToggleCollapsed(); }}
            title="Pembayaran"
            aria-label="Buka tab Pembayaran"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
            </svg>
          </button>
          <button
            type="button"
            className={`sidebar-collapsed-btn${tab === 'timeseries' ? ' active' : ''}`}
            onClick={() => { setTab('timeseries'); onToggleCollapsed(); }}
            title="Time Series"
            aria-label="Buka tab Time Series"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 17 9 11 13 15 21 7" />
              <polyline points="14 7 21 7 21 14" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <div className="sidebar-tabs-row">
            <div className="sidebar-tabs">
              <button type="button" className={`sidebar-tab-btn${tab === 'pembayaran' ? ' active' : ''}`} onClick={() => setTab('pembayaran')}>
                Pembayaran
              </button>
              <button type="button" className={`sidebar-tab-btn${tab === 'timeseries' ? ' active' : ''}`} onClick={() => setTab('timeseries')}>
                Time Series
              </button>
            </div>
            <button type="button" className="sidebar-close-btn" onClick={onToggleCollapsed} title="Tutup sidebar" aria-label="Tutup sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <line x1="9" y1="4" x2="9" y2="20" />
              </svg>
              Tutup
            </button>
          </div>

          {tab === 'pembayaran' && (
            <>
              {showGauge && <GaugeCard stats={stats} tahunAktif={tahunAktif} />}
              <KpiGrid stats={stats} />
              <div id="tour-distribusi" className="sidebar-section">
                <div className="sidebar-label">Distribusi Status Pembayaran</div>
                <DistributionTable stats={stats} />
                <DonutChart stats={stats} />
              </div>
              {error && (
                <div className="sidebar-section">
                  <div style={{ fontSize: 11, color: '#f87171', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, padding: 10, lineHeight: 1.5 }}>
                    ⚠ {error}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'timeseries' && (
            <div className="sidebar-section">
              <div style={{ fontSize: 11.5, color: '#94a3b8', textAlign: 'center', padding: '40px 10px' }}>
                Time Series — segera hadir
              </div>
            </div>
          )}
        </>
      )}
    </aside>
  );
}
