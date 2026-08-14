'use client';

import type { PbbAggregateRow } from '@geobi/shared';
import { angka } from '../../lib/format';

const TILES = [
  { key: 'sudah_bayar' as const, label: 'Sudah Bayar', Icon: CheckCircleIcon, fg: 'var(--status-blue-strong)', bg: 'var(--status-blue-bg)', border: 'var(--status-blue-border)' },
  { key: 'belum_bayar' as const, label: 'Belum Bayar', Icon: ClockAlertIcon, fg: 'var(--status-amber-strong)', bg: 'var(--status-amber-bg)', border: 'var(--status-amber-border)' },
  { key: 'pbb_nol' as const, label: 'PBB 0 Rupiah', Icon: ReceiptZeroIcon, fg: '#94a3b8', bg: 'rgba(148,163,184,.14)', border: 'rgba(148,163,184,.38)' },
  { key: 'dibatalkan' as const, label: 'Dibatalkan', Icon: BanIcon, fg: 'var(--status-purple-strong)', bg: 'var(--status-purple-bg)', border: 'var(--status-purple-border)' },
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
            <div style={{ fontSize: 9, color: '#ffffff' }}>persil</div>
            <div style={{ fontSize: 10, color: '#ffffff', textAlign: 'center', minHeight: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1.25 }}>
              {t.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
