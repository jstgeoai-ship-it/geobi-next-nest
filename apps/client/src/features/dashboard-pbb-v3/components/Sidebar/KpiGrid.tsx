'use client';

import type { PbbAggregateRow } from '@geobi/shared';
import { angka } from '../../lib/format';
import { CheckCircleIcon, ClockAlertIcon, ReceiptZeroIcon, BanIcon, ArrowUpIcon, ArrowDownIcon, MoreVerticalIcon } from './icons';

const TILES = [
  { key: 'sudah_bayar' as const, label: 'Sudah Bayar', Icon: CheckCircleIcon, fg: 'var(--status-green-strong)', bg: 'var(--status-green-bg)', border: 'var(--status-green-border)' },
  { key: 'belum_bayar' as const, label: 'Belum Bayar', Icon: ClockAlertIcon, fg: 'var(--status-red-strong)', bg: 'var(--status-red-bg)', border: 'var(--status-red-border)' },
  { key: 'pbb_nol' as const, label: 'PBB 0 Rupiah', Icon: ReceiptZeroIcon, fg: 'var(--status-amber-strong)', bg: 'var(--status-amber-bg)', border: 'var(--status-amber-border)' },
  { key: 'dibatalkan' as const, label: 'Dibatalkan', Icon: BanIcon, fg: 'var(--status-blue-strong)', bg: 'var(--status-blue-bg)', border: 'var(--status-blue-border)' },
];

export function KpiGrid({
  stats,
  /** Persentase perubahan vs tahun lalu, per tile key (mis. { sudah_bayar: 8.2, belum_bayar: -3.1 }).
   *  Belum ada di PbbAggregateRow sekarang — endpoint /pbb/stats perlu ditambah field
   *  perbandingan-tahun-lalu dulu di backend baru ini bisa keisi beneran. Selama prop ini
   *  gak dikirim, badge trend-nya cuma gak dirender (bukan angka ngarang). */
  trend,
}: {
  stats?: PbbAggregateRow;
  trend?: Partial<Record<'sudah_bayar' | 'belum_bayar' | 'pbb_nol' | 'dibatalkan', number>>;
}) {
  const total = stats?.total ?? 0;

  return (
    <div id="tour-ringkasan" className="sidebar-section" style={{ paddingTop: 10 }}>
      <div className="sidebar-label" style={{ marginBottom: 8 }}>Ringkasan Data</div>
      <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 108px)', gap: 10, justifyContent: 'center' }}>
        {TILES.map((t) => {
          const value = stats?.[t.key];
          const pctOfTotal = total > 0 && typeof value === 'number' ? Math.round((value / total) * 1000) / 10 : null;
          const delta = trend?.[t.key];
          return (
            <div
              key={t.key}
              className="stat-tile kpi-tile"
              style={{ '--tile-fg': t.fg, '--tile-bg': t.bg, '--tile-border': t.border } as React.CSSProperties}
            >
              <div className="kpi-tile-head">
                <span className="icon-tile-icon" style={{ width: 26, height: 26 }}><t.Icon size={14} /></span>
                <span className="kpi-tile-label">{t.label}</span>
                <button type="button" className="tile-menu-btn" aria-label="Opsi lainnya">
                  <MoreVerticalIcon />
                </button>
              </div>
              <div className="kpi-tile-value">{angka(value)}</div>
              <div className="kpi-tile-foot">
                {pctOfTotal !== null && <span className="kpi-tile-subtext">{pctOfTotal}% dari total SPPT</span>}
                {typeof delta === 'number' && (
                  <span className={`kpi-tile-delta ${delta >= 0 ? 'kpi-tile-delta-up' : 'kpi-tile-delta-down'}`}>
                    {delta >= 0 ? <ArrowUpIcon size={9} /> : <ArrowDownIcon size={9} />}
                    {Math.abs(delta)}% vs tahun lalu
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
