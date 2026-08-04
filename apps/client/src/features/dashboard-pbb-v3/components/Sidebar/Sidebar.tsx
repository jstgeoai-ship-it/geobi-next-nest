'use client';

import type { PbbAggregateRow } from '@geobi/shared';
import { GaugeCard } from './GaugeCard';
import { KpiGrid } from './KpiGrid';
import { DistributionTable } from './DistributionTable';
import { DonutChart } from './DonutChart';
import { rupiahM } from '../../lib/format';

// Helper function to format currency (singkat, format "Rp X,XX M" — supaya gak pernah wrap ganjil pas di-zoom)
const formatCurrency = rupiahM;

// Helper function to format number
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

// Time Series Content Component
function TimeSeriesContent({ stats, tahunAktif }: { stats?: PbbAggregateRow; tahunAktif: string }) {
  if (!stats) {
    return <div className="text-center py-8 text-slate-400">Memuat data...</div>;
  }

  // Calculate derived values
  const totalSppt = stats.sudah_bayar + stats.belum_bayar + stats.pbb_nol + stats.dibatalkan + stats.lainnya;
  const lainnyaPersentase = totalSppt > 0 ? (stats.lainnya / totalSppt) * 100 : 0;

  return (
    <div className="space-y-4 px-3">
      {/* Tahun Pajak */}
      <div className="text-center text-sm font-medium text-slate-400 bg-slate-900/30 rounded-xl px-3 py-2">
        Tahun Pajak 2017-2026
      </div>

      {/* Akumulasi Realisasi Pembayaran PBB-P2 — judul polos, sejajar posisi sama seperti di GaugeCard tab Pembayaran */}
      <div className="sidebar-label text-center">Akumulasi Realisasi Pembayaran PBB-P2</div>

      {/* Gauge Chart dan Line Chart bersebelahan (2 kolom), sesuai posisi di desain */}
      <div className="grid grid-cols-2 gap-3 items-stretch">
        {/* Gauge Chart (versi compact, tanpa badge/kartu duplikat) */}
        <div className="bg-gradient-to-r from-blue-900/30 via-blue-900/10 to-transparent rounded-xl p-3 flex flex-col justify-center border border-blue-500/30">
          <div className="text-xs text-blue-300 mb-1 text-center">Capaian Realisasi</div>
          <GaugeCard stats={stats} tahunAktif={tahunAktif} variant="compact" />
        </div>

        {/* Line Chart Placeholder */}
        <div className="bg-gradient-to-r from-indigo-900/30 via-indigo-900/10 to-transparent rounded-xl p-3 flex flex-col justify-center border border-indigo-500/30">
          <div className="text-xs text-indigo-300 mb-1 text-center">Tren Realisasi Tahunan</div>
          <div className="h-[104px] flex items-center justify-center">
            <span className="text-slate-500 text-[11px] text-center">Line Chart Placeholder</span>
          </div>
        </div>
      </div>
      <div className="text-xs text-indigo-300 text-center -mt-2">
        Tahun Pajak: 2017 - 2026
      </div>
      <div className="text-xs text-slate-400 text-center">
        * Grafik garis akan menampilkan tren tahunan saat data tersedia
      </div>

      {/* DARI AKUMULASI PBB YANG HARUS DIBAYAR */}
      <div className="text-xs text-slate-400 font-medium bg-slate-900/20 rounded-xl px-3 py-2">
        DARI AKUMULASI PBB YANG HARUS DIBAYAR
      </div>

      {/* Realisasi, Target, dan Belum Realisasi (side by side) */}
      <div className="grid grid-cols-3 gap-3">
        {/* Realisasi */}
        <div className="bg-gradient-to-r from-green-900/30 via-green-900/10 to-transparent rounded-xl p-3 text-center border border-green-500/30">
          <div className="text-[10px] tracking-wide text-green-300">REALISASI</div>
          <div className="text-[13px] font-bold text-green-400 leading-tight mt-1 break-words">{formatCurrency(stats.realisasi_rp)}</div>
        </div>

        {/* Target */}
        <div className="bg-gradient-to-r from-blue-900/30 via-blue-900/10 to-transparent rounded-xl p-3 text-center border border-blue-500/30">
          <div className="text-[10px] tracking-wide text-blue-300">TARGET</div>
          <div className="text-[13px] font-bold text-blue-400 leading-tight mt-1 break-words">{formatCurrency(stats.target_rp)}</div>
        </div>

        {/* Belum Realisasi */}
        <div className="bg-gradient-to-r from-yellow-900/30 via-yellow-900/10 to-transparent rounded-xl p-3 text-center border border-yellow-500/30">
          <div className="text-[10px] tracking-wide text-yellow-300">BELUM REA</div>
          <div className="text-[13px] font-bold text-yellow-400 leading-tight mt-1 break-words">{formatCurrency(stats.belum_rp)}</div>
        </div>
      </div>

      {/* Total SPPT */}
      <div className="bg-gradient-to-r from-purple-900/30 via-purple-900/10 to-transparent rounded-xl p-4 mt-3 text-center border border-purple-500/30">
        <div className="text-[10px] tracking-wide text-purple-300 mb-1">TOTAL SPPT</div>
        <div className="text-2xl font-bold text-purple-400">{formatNumber(totalSppt)}</div>
        <div className="text-[10px] tracking-wide text-purple-300 mt-1">Objek</div>
      </div>

      {/* RINGKASAN DATA — pakai komponen KpiGrid yang sama dgn tab Pembayaran, biar posisi (4 kartu sejajar) konsisten sesuai desain */}
      <div className="-mx-0">
        <KpiGrid stats={stats} />
      </div>
      {stats.lainnya > 0 && (
        <div className="text-[11px] text-indigo-300 text-center -mt-2">
          SPPT Lainnya: {formatNumber(stats.lainnya)} ({lainnyaPersentase.toFixed(1)}%)
        </div>
      )}

      {/* DISTRIBUSI STATUS PEMBAYARAN */}
      <div className="mt-4">
        <div className="text-xs text-slate-400 font-medium bg-slate-900/20 rounded-xl px-3 py-2 mb-2">
          DISTRIBUSI STATUS PEMBAYARAN
        </div>

        {/* Donut Chart */}
        <div className="mb-3">
          <div className="min-h-[200px]">
            <DonutChart stats={stats} />
          </div>
        </div>

        {/* Tabel Keterangan Donut Chart */}
        <DistributionTable stats={stats} />
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
                <DonutChart stats={stats} />
                <DistributionTable stats={stats} />
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
            <TimeSeriesContent stats={stats} tahunAktif={tahunAktif} />
          )}
        </>
      )}
    </aside>
  );
}
