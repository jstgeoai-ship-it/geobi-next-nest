'use client';

import type { PbbAggregateRow } from '@geobi/shared';
import { angka } from '../../lib/format';

const TILES = [
  { key: 'sudah_bayar' as const, label: 'Sudah Bayar', color: '#22c55e', bg: 'rgba(34,197,94,.08)', border: 'rgba(34,197,94,.22)' },
  { key: 'belum_bayar' as const, label: 'Belum Bayar', color: '#ef4444', bg: 'rgba(239,68,68,.08)', border: 'rgba(239,68,68,.22)' },
  { key: 'pbb_nol' as const, label: 'PBB 0 Rupiah', color: '#f59e0b', bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.22)' },
  { key: 'dibatalkan' as const, label: 'Dibatalkan', color: '#3b82f6', bg: 'rgba(59,130,246,.08)', border: 'rgba(59,130,246,.22)' },
];

export function KpiGrid({ stats }: { stats?: PbbAggregateRow }) {
  return (
    <div id="tour-ringkasan" className="sidebar-section" style={{ paddingTop: 10 }}>
      <div className="sidebar-label" style={{ marginBottom: 8 }}>Ringkasan Data</div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
        {TILES.map((t) => (
          <div key={t.key} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 10, padding: '12px 4px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: t.color }}>{angka(stats?.[t.key])}</span>
            </div>
            <div style={{ fontSize: 9, color: '#ffffff' }}>SPPT</div>
            <div style={{ fontSize: 10, color: '#ffffff', textAlign: 'center', minHeight: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1.25 }}>
              {t.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
