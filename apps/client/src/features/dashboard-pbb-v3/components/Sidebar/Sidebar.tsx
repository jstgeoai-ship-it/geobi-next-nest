'use client';

import { useState } from 'react';
import type { PbbAggregateRow } from '@geobi/shared';
import { GaugeCard } from './GaugeCard';
import { KpiGrid } from './KpiGrid';
import { DistributionTable } from './DistributionTable';
import { DonutChart } from './DonutChart';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

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
  const sudahBayarPersentase = totalSppt > 0 ? (stats.sudah_bayar / totalSppt) * 100 : 0;
  const belumBayarPersentase = totalSppt > 0 ? (stats.belum_bayar / totalSppt) * 100 : 0;
  const pbbNolPersentase = totalSppt > 0 ? (stats.pbb_nol / totalSppt) * 100 : 0;
  const dibatalkanPersentase = totalSppt > 0 ? (stats.dibatalkan / totalSppt) * 100 : 0;
  const lainnyaPersentase = totalSppt > 0 ? (stats.lainnya / totalSppt) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Tahun Pajak */}
      <div className="text-center text-sm font-medium text-slate-400 bg-slate-900/30 rounded-xl px-3 py-2">
        Tahun Pajak 2017-2026
      </div>

      {/* Akumulasi Realisasi Pembayaran PBB-P2 */}
      <div className="bg-gradient-to-r from-emerald-900/30 via-emerald-900/10 to-transparent rounded-xl p-4">
        <div className="text-xs text-emerald-300 mb-2">Akumulasi Realisasi Pembayaran PBB-P2</div>
        <div className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.realisasi_rp)}</div>
      </div>

      {/* Gauge Chart and Line Chart (side by side) */}
      <div className="grid gap-4">
        {/* Gauge Chart */}
        <div className="bg-gradient-to-r from-blue-900/30 via-blue-900/10 to-transparent rounded-xl p-4">
          <div className="text-xs text-blue-300 mb-2">Capaian Realisasi 2017-2026</div>
          <div className="min-h-[200px]">
            <GaugeCard
              stats={stats}
              tahunAktif={tahunAktif}
            />
          </div>
        </div>

        {/* Line Chart Placeholder */}
        <div className="bg-gradient-to-r from-indigo-900/30 via-indigo-900/10 to-transparent rounded-xl p-4">
          <div className="text-xs text-indigo-300 mb-2">Tren Realisasi Tahunan 2017-2026</div>
          <div className="min-h-[200px] flex items-center justify-center">
            <div className="bg-slate-800 rounded-xl p-4">
              <span className="text-slate-500">Line Chart Placeholder</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-indigo-300 text-center text-xs">
            Tahun Pajak: 2017 - 2026
          </div>
          <div className="mt-1 text-xs text-slate-400 text-center">
            * Grafik garis akan menampilkan tren tahunan saat data tersedia
          </div>
        </div>
      </div>

      {/* DARI AKUMULASI PBB YANG HARUS DIBAYAR */}
      <div className="text-xs text-slate-400 font-medium bg-slate-900/20 rounded-xl px-3 py-2">
        DARI AKUMULASI PBB YANG HARUS DIBAYAR
      </div>

      {/* Realisasi, Target, dan Belum Realisasi (side by side) */}
      <div className="grid grid-cols-3 gap-3">
        {/* Realisasi */}
        <div className="bg-gradient-to-r from-green-900/30 via-green-900/10 to-transparent rounded-xl p-3 text-center">
          <div className="text-xs text-green-300">REALISASI</div>
          <div className="font-semibold text-green-400">{formatCurrency(stats.realisasi_rp)}</div>
        </div>

        {/* Target */}
        <div className="bg-gradient-to-r from-blue-900/30 via-blue-900/10 to-transparent rounded-xl p-3 text-center">
          <div className="text-xs text-blue-300">TARGET</div>
          <div className="font-semibold text-blue-400">{formatCurrency(stats.target_rp)}</div>
        </div>

        {/* Belum Realisasi */}
        <div className="bg-gradient-to-r from-yellow-900/30 via-yellow-900/10 to-transparent rounded-xl p-3 text-center">
          <div className="text-xs text-yellow-300">BELUM REA</div>
          <div className="font-semibold text-yellow-400">{formatCurrency(stats.belum_rp)}</div>
        </div>
      </div>

      {/* Total SPPT */}
      <div className="bg-gradient-to-r from-purple-900/30 via-purple-900/10 to-transparent rounded-xl p-4 mt-3">
        <div className="text-xs text-purple-300 mb-2">TOTAL SPPT</div>
        <div className="text-lg font-semibold text-purple-400">{formatNumber(totalSppt)}</div>
        <div className="text-xs text-purple-300 mt-1">Unit</div>
      </div>

      {/* RINGKASAN DATA */}
      <div className="text-xs text-slate-400 font-medium bg-slate-900/20 rounded-xl px-3 py-2 mt-4">
        RINGKASAN DATA
      </div>

      {/* SPPT yang sudah bayar, dll */}
      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="bg-gradient-to-r from-teal-900/30 via-teal-900/10 to-transparent rounded-xl p-3">
          <div className="text-xs text-teal-300">SPPT Sudah Bayar</div>
          <div className="font-semibold text-teal-400">{formatNumber(stats.sudah_bayar)} ({sudahBayarPersentase.toFixed(1)}%)</div>
        </div>
        <div className="bg-gradient-to-r from-red-900/30 via-red-900/10 to-transparent rounded-xl p-3">
          <div className="text-xs text-red-300">SPPT Belum Bayar</div>
          <div className="font-semibold text-red-400">{formatNumber(stats.belum_bayar)} ({belumBayarPersentase.toFixed(1)}%)</div>
        </div>
        <div className="bg-gradient-to-r from-amber-900/30 via-amber-900/10 to-transparent rounded-xl p-3">
          <div className="text-xs text-amber-300">SPPT PBB Nol</div>
          <div className="font-semibold text-amber-400">{formatNumber(stats.pbb_nol)} ({pbbNolPersentase.toFixed(1)}%)</div>
        </div>
        <div className="bg-gradient-to-r from-slate-900/30 via-slate-900/10 to-transparent rounded-xl p-3">
          <div className="text-xs text-slate-300">SPPT Dibatalkan</div>
          <div className="font-semibold text-slate-400">{formatNumber(stats.dibatalkan)} ({dibatalkanPersentase.toFixed(1)}%)</div>
        </div>
        <div className="bg-gradient-to-r from-indigo-900/30 via-indigo-900/10 to-transparent rounded-xl p-3">
          <div className="text-xs text-indigo-300">SPPT Lainnya</div>
          <div className="font-semibold text-indigo-400">{formatNumber(stats.lainnya)} ({lainnyaPersentase.toFixed(1)}%)</div>
        </div>
      </div>

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
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-green-300">Sudah Bayar ({sudahBayarPersentase.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span className="text-red-300">Belum Bayar ({belumBayarPersentase.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span className="text-amber-300">PBB Nol ({pbbNolPersentase.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
            <span className="text-slate-300">Dibatalkan ({dibatalkanPersentase.toFixed(1)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
            <span className="text-indigo-300">Lainnya ({lainnyaPersentase.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
            <TimeSeriesContent stats={stats} tahunAktif={tahunAktif} />
          )}
        </>
      )}
    </aside>
  );
}
