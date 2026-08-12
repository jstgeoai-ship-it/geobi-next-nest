'use client';

import type { PbbAggregateRow } from '@geobi/shared';
import { GaugeCard } from './GaugeCard';
import { SudahBelumDonut } from './SudahBelumDonut';
import { KpiGrid } from './KpiGrid';
import { DistributionTable } from './DistributionTable';
import { DonutChart } from './DonutChart';
import { DistribusiPembayaran } from './DistribusiPembayaran';
import { rupiahM } from '../../lib/format';
import { WalletIcon, DocumentIcon, HourglassIcon, LayersIcon, TrendUpIcon, CityIllustration } from './icons';

// Helper function to format currency (singkat, format "Rp X,XX M" — supaya gak pernah wrap ganjil pas di-zoom)
const formatCurrency = rupiahM;

// Helper function to format number
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Time Series Content Component
function TimeSeriesContent({ stats, tahunAktif }: { stats?: PbbAggregateRow; tahunAktif: string }) {
  if (!stats) {
    return <div className="text-center py-8 text-[var(--pub-muted-2)]">Memuat data...</div>;
  }

  // Calculate derived values
  const totalSppt = stats.sudah_bayar + stats.belum_bayar + stats.pbb_nol + stats.dibatalkan + stats.lainnya;
  const lainnyaPersentase = totalSppt > 0 ? (stats.lainnya / totalSppt) * 100 : 0;
  const targetRp = Number(stats.target_rp ?? 0);
  const realisasiRp = Number(stats.realisasi_rp ?? 0);
  const pctReal = targetRp > 0 ? Math.round((realisasiRp / targetRp) * 1000) / 10 : 0;

  return (
    <div className="px-3" style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 14 }}>
      {/* Tahun Pajak */}
      <span style={{ alignSelf: 'center', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-inset)', border: '1px solid var(--status-blue-border)', borderRadius: 8, padding: '5px 14px', fontSize: 11, fontWeight: 700, color: 'var(--status-blue-fg)' }}>
        Tahun Pajak 2017–2026
      </span>

      <div className="sidebar-label" style={{ textAlign: 'center', marginBottom: 0 }}>Akumulasi Realisasi Pembayaran PBB-P2</div>

      {/* Gauge Chart dan Line Chart bersebelahan (2 kolom) */}
      <div style={{ display: 'grid', gridTemplateColumns: '40% 60%', gap: 8 }}>
        <div className="chart-box" style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', marginBottom: 2 }}>Capaian Realisasi</div>
          <SudahBelumDonut stats={stats} />
        </div>

        {/* Line Chart Placeholder */}
        <div className="chart-box" style={{ margin: 0, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-secondary)' }}>Tren Realisasi Tahunan</span>
            <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-16)', color: 'var(--accent)' }}>
              <TrendUpIcon size={10} />
            </span>
          </div>
          <div style={{ height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 10, color: 'var(--text-faint)' }}>Line Chart Placeholder</span>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 10, textAlign: 'center', marginTop: -4, color: 'var(--text-secondary)' }}>
        Tahun Pajak: 2017 - 2026
      </div>
      <div style={{ fontSize: 9, textAlign: 'center', marginTop: -6, color: 'var(--text-faint)' }}>
        * Grafik garis akan menampilkan tren tahunan saat data tersedia
      </div>

      <div className="sidebar-label" style={{ background: 'var(--bg-inset-soft)', borderRadius: 10, padding: '8px 12px', marginBottom: 0 }}>
        Dari Akumulasi PBB yang Harus Dibayar
      </div>

      {/* Realisasi, Target, dan Belum Realisasi (side by side) — kartu minimalis: putih + garis
          aksen kiri, biar gak "ramai" kebanyakan warna kayak versi .icon-tile sebelumnya. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        <div className="stat-card-accent" style={{ '--tile-fg': 'var(--status-green-strong)' } as React.CSSProperties}>
          <div className="stat-card-accent-head"><WalletIcon size={12} /><span className="stat-card-accent-label">Realisasi</span></div>
          <div className="stat-card-accent-value">{formatCurrency(stats.realisasi_rp)}</div>
          <div className="stat-card-accent-sub">{pctReal}% dari target</div>
        </div>

        <div className="stat-card-accent" style={{ '--tile-fg': 'var(--status-blue-strong)' } as React.CSSProperties}>
          <div className="stat-card-accent-head"><DocumentIcon size={12} /><span className="stat-card-accent-label">Target</span></div>
          <div className="stat-card-accent-value">{formatCurrency(stats.target_rp)}</div>
          <div className="stat-card-accent-sub">Total yang harus dibayar</div>
        </div>

        <div className="stat-card-accent" style={{ '--tile-fg': 'var(--status-amber-strong)' } as React.CSSProperties}>
          <div className="stat-card-accent-head"><HourglassIcon size={12} /><span className="stat-card-accent-label">Belum Realisasi</span></div>
          <div className="stat-card-accent-value">{formatCurrency(stats.belum_rp)}</div>
          <div className="stat-card-accent-sub">Sisa pembayaran</div>
        </div>
      </div>

      {/* Total SPPT — kartu ungu penuh, ada siluet gedung dekoratif di kanan kayak di mockup */}
      <div
        className="stat-tile"
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: 14, padding: '16px 12px',
          textAlign: 'center', background: 'var(--status-purple-bg)', border: '1px solid var(--status-purple-border)',
        }}
      >
        <CityIllustration className="total-sppt-city" />
        <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: '50%', background: 'var(--status-purple-border)', color: 'var(--status-purple-strong)', marginBottom: 6 }}>
          <LayersIcon size={17} />
        </span>
        <div style={{ position: 'relative', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--status-purple-fg)' }}>Total SPPT</div>
        <div style={{ position: 'relative', fontSize: 24, fontWeight: 800, color: 'var(--status-purple-strong)', marginTop: 2 }}>{formatNumber(totalSppt)}</div>
        <div style={{ position: 'relative', fontSize: 9, color: 'var(--status-purple-fg)', marginTop: 1 }}>Objek</div>
      </div>

      {/* RINGKASAN DATA — pakai komponen KpiGrid yang sama dgn tab Pembayaran, biar posisi (4 kartu sejajar) konsisten sesuai desain */}
      <KpiGrid stats={stats} />
      {stats.lainnya > 0 && (
        <div style={{ fontSize: 10, textAlign: 'center', marginTop: -4, color: 'var(--text-secondary)' }}>
          SPPT Lainnya: {formatNumber(stats.lainnya)} ({lainnyaPersentase.toFixed(1)}%)
        </div>
      )}

      {/* DISTRIBUSI STATUS PEMBAYARAN */}
      <div style={{ marginTop: 6 }}>
        <div className="sidebar-label" style={{ background: 'var(--bg-inset-soft)', borderRadius: 10, padding: '8px 12px' }}>
          Distribusi Status Pembayaran
        </div>

        <div style={{ marginTop: 10 }}>
          <DistribusiPembayaran stats={stats} />
        </div>
      </div>
    </div>
  );
}

export type SidebarTab = 'pembayaran' | 'timeseries';

interface Props {
  showGauge: boolean;
  stats?: PbbAggregateRow;
  tahunAktif: string;
  error?: string | null;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  tab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function Sidebar({ showGauge, stats, tahunAktif, error, collapsed, onToggleCollapsed, tab, onTabChange: setTab }: Props) {
  return (
    <aside id="sidebar" className={collapsed ? 'collapsed' : ''}>
      {collapsed ? (
        <div className="sidebar-collapsed-strip">
          <button
            type="button"
            className={`sidebar-collapsed-btn${tab === 'pembayaran' ? ' active' : ''}`}
            onClick={() => { setTab('pembayaran'); onToggleCollapsed(); }}
            title="Pembayaran"
            aria-label="Buka tab Pembayaran"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="9" y1="4" x2="9" y2="20" />
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
                  <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" />
                </svg>
                Pembayaran
              </button>
              <button type="button" className={`sidebar-tab-btn${tab === 'timeseries' ? ' active' : ''}`} onClick={() => setTab('timeseries')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 17 9 11 13 15 21 7" />
                  <polyline points="14 7 21 7 21 14" />
                </svg>
                Time Series
              </button>
            </div>
            <button type="button" className="sidebar-close-btn" onClick={onToggleCollapsed} title="Tutup sidebar" aria-label="Tutup sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="6" width="13" height="13" rx="2.5" />
                <path d="M8 6V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1" />
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
                <DistribusiPembayaran stats={stats} />
              </div>
              {error && (
                <div className="sidebar-section">
                  <div style={{ fontSize: 11, color: 'var(--status-red-fg)', background: 'var(--status-red-bg)', border: '1px solid var(--status-red-border)', borderRadius: 8, padding: 10, lineHeight: 1.5 }}>
                    ⚠ {error}
                  </div>
                </div>
              )}
            </>
          )}

          {tab === 'timeseries' && (
            <TimeSeriesContent stats={stats} tahunAktif={tahunAktif} />
          )}
        </>
      )}
    </aside>
  );
}
