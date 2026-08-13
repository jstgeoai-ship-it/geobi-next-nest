'use client';

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
}

export function Sidebar({ showGauge, stats, tahunAktif, error }: Props) {
  return (
    <aside id="sidebar">
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
    </aside>
  );
}
