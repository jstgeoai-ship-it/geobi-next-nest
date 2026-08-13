'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { Chart } from 'chart.js';
import type { PbbAggregateRow } from '@geobi/shared';
import { needlePlugin } from '../../lib/gauge-plugin';
import { rupiahM, angka } from '../../lib/format';
import { useTheme } from '@/lib/useTheme';
import { WalletIcon, DocumentIcon, HourglassIcon, BuildingIcon, MoreVerticalIcon } from './icons';

export function GaugeCard({
  stats,
  tahunAktif,
  variant = 'full',
}: {
  stats?: PbbAggregateRow;
  tahunAktif: string;
  /** 'full' = badge + gauge + kartu + total (dipakai di tab Pembayaran). 'compact' = gauge saja (dipakai berdampingan dgn line chart di tab Time Series). */
  variant?: 'full' | 'compact';
}) {
  const { theme } = useTheme();
  const total = stats?.total ?? 0;
  const realisasiRp = Number(stats?.realisasi_rp ?? 0);
  const targetRp = Number(stats?.target_rp ?? 0);
  const belumRp = Number(stats?.belum_rp ?? 0);
  const frac = targetRp > 0 ? realisasiRp / targetRp : 0;
  const pctReal = Math.round(frac * 1000) / 10;
  const pctSisa = Math.max(0, Math.round((1 - frac) * 1000) / 10);

  const chartRef = useRef<Chart<'doughnut'> | null>(null);

  // Port of gaugeChart.$frac = frac; gaugeChart.update() in dashboard.blade.php — Chart.js
  // needs this set imperatively on the instance, since needlePlugin reads it directly and
  // it isn't part of `data`/`options` so react-chartjs-2 wouldn't otherwise redraw for it.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    (chart as Chart<'doughnut'> & { $frac?: number }).$frac = frac;
    chart.update();
  }, [frac]);

  // Chart.js render ke <canvas>, gak bisa baca CSS var — track "sisa" gauge perlu kontras
  // beda per tema: abu gelap-transparan di dark ketiban abu terlalu tipis kalau dipakai
  // apa adanya di light, jadi dibedain manual biar tetep kebaca di kedua tema.
  const trackColor = theme === 'light' ? 'rgba(100,116,139,.20)' : 'rgba(148,163,184,.16)';

  const data = useMemo(
    () => ({
      datasets: [
        {
          // Scriptable backgroundColor: Chart.js gives us the canvas context here, which lets
          // us paint the "realisasi" arc as an actual blue→cyan gradient (matches the mockup)
          // instead of one flat color. Falls back to a flat color on the very first layout
          // pass, before the chart has real pixel dimensions to build a gradient from.
          backgroundColor: (ctx: { chart: Chart; dataIndex: number }) => {
            if (ctx.dataIndex !== 0) return trackColor;
            const { ctx: c, chartArea } = ctx.chart;
            if (!chartArea) return '#3b82f6';
            const gradient = c.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
            gradient.addColorStop(0, '#1d4ed8');
            gradient.addColorStop(1, '#22d3ee');
            return gradient;
          },
          data: [realisasiRp, Math.max(targetRp - realisasiRp, 0)],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    }),
    [realisasiRp, targetRp, trackColor],
  );

  const options = useMemo(
    () => ({
      rotation: -90,
      circumference: 180,
      cutout: '65%',
      aspectRatio: 2,
      layout: { padding: { top: 2, bottom: 0, left: 8, right: 8 } },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 600 },
    }),
    [],
  );

  if (variant === 'compact') {
    // Gauge polos saja: chart + persentase, tanpa badge/kartu/total — dipakai berdampingan dengan line chart.
    return (
      <div style={{ textAlign: 'center' }}>
        <Doughnut ref={chartRef} data={data} options={options as any} plugins={[needlePlugin]} height={104} />
        <div style={{ marginTop: 5, pointerEvents: 'none' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1, letterSpacing: '-0.5px' }}>{pctReal}%</div>
          <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 3 }}>dari target</div>
        </div>
      </div>
    );
  }

  return (
    <div id="tour-gauge" className="sidebar-section" style={{ padding: '10px 16px 6px', borderBottom: 'none' }}>
      <div className="sidebar-label" style={{ marginBottom: 4, fontSize: 11 }}>Capaian Realisasi Pembayaran PBB-P2</div>

      <div className="chart-box" style={{ padding: '12px', marginBottom: 8 }}>
        {/* Gauge kiri, kartu icon kanan — dua kolom, bukan ditumpuk vertikal seperti sebelumnya. */}
        <div className="gauge-split">
          <div className="gauge-split-chart">
            <Doughnut ref={chartRef} data={data} options={options as any} plugins={[needlePlugin]} height={150} />
            <div style={{ textAlign: 'center', marginTop: -6, pointerEvents: 'none' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1, letterSpacing: '-0.5px' }}>{pctReal}%</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 4 }}>dari PBB<br />harus dibayar</div>
            </div>
          </div>

          <div className="gauge-split-cards">
            <div className="stat-tile icon-tile" style={{ '--tile-fg': 'var(--status-green-strong)', '--tile-bg': 'var(--status-green-bg)', '--tile-border': 'var(--status-green-border)' } as React.CSSProperties}>
              <span className="icon-tile-icon"><WalletIcon /></span>
              <div>
                <div className="icon-tile-label">Realisasi</div>
                <div className="icon-tile-value icon-tile-value--rp">{rupiahM(realisasiRp)}</div>
              </div>
            </div>
            <div className="stat-tile icon-tile" style={{ '--tile-fg': 'var(--status-blue-strong)', '--tile-bg': 'var(--status-blue-bg)', '--tile-border': 'var(--status-blue-border)' } as React.CSSProperties}>
              <span className="icon-tile-icon"><DocumentIcon /></span>
              <div>
                <div className="icon-tile-label">Harus Dibayar</div>
                <div className="icon-tile-value icon-tile-value--rp">{rupiahM(targetRp)}</div>
              </div>
            </div>
            <div className="stat-tile icon-tile" style={{ '--tile-fg': 'var(--status-amber-strong)', '--tile-bg': 'var(--status-amber-bg)', '--tile-border': 'var(--status-amber-border)' } as React.CSSProperties}>
              <span className="icon-tile-icon"><HourglassIcon /></span>
              <div>
                <div className="icon-tile-label">Belum Realisasi</div>
                <div className="icon-tile-value icon-tile-value--rp">{rupiahM(belumRp)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="sisa-progress">
          <div className="sisa-progress-head">
            <span className="sisa-progress-label">Sisa Pembayaran</span>
            <span className="sisa-progress-pct">{pctReal}%</span>
          </div>
          <div className="sisa-progress-amount">{rupiahM(belumRp)}</div>
          <div className="sisa-progress-track">
            <div className="sisa-progress-fill" style={{ width: `${Math.min(100, pctReal)}%` }} />
          </div>
        </div>
      </div>

      <div className="stat-tile icon-tile total-tile">
        <span className="icon-tile-icon total-tile-icon"><BuildingIcon size={18} /></span>
        <div style={{ flex: 1 }}>
          <div className="icon-tile-label" style={{ color: 'var(--text-muted)' }}>Total Objek PBB-P2</div>
          <div className="icon-tile-value" style={{ fontSize: 16, color: 'var(--text-strong)' }}>{angka(total)}</div>
        </div>
        <span className="total-tile-year">
          <span style={{ fontSize: 8, display: 'block', opacity: .8 }}>Tahun Pajak</span>
          {tahunAktif || 'Semua'}
        </span>
        <button type="button" className="tile-menu-btn" aria-label="Opsi lainnya">
          <MoreVerticalIcon />
        </button>
      </div>
    </div>
  );
}
