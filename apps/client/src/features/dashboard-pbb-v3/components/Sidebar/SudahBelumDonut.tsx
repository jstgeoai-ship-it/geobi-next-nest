'use client';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { PbbAggregateRow } from '@geobi/shared';
import { useTheme } from '@/lib/useTheme';

/** Donut "Sudah Bayar" vs "Belum Bayar" — dipakai khusus buat slot "Capaian Realisasi" di tab
 *  Time Series (gantiin GaugeCard variant="compact"). Sengaja komponen terpisah, bukan edit
 *  DonutChart.tsx yang udah ada (itu donut 4-kategori buat section "Distribusi Status
 *  Pembayaran" di bawahnya) atau GaugeCard.tsx (masih dipakai apa adanya di tab Pembayaran). */
export function SudahBelumDonut({ stats }: { stats?: PbbAggregateRow }) {
  const { theme } = useTheme();
  const sudah = stats?.sudah_bayar ?? 0;
  const belum = stats?.belum_bayar ?? 0;
  const total = sudah + belum;
  const pctSudah = total > 0 ? Math.round((sudah / total) * 1000) / 10 : 0;

  // Sama seperti DonutChart.tsx: warna celah antar slice perlu senada background sidebar
  // aktif, chart.js render ke <canvas> jadi gak bisa baca var(--bg-surface) langsung.
  const segmentGap = theme === 'light' ? '#f2f4f7' : '#0a0f1e';

  const data = useMemo(
    () => ({
      labels: ['Sudah Bayar', 'Belum Bayar'],
      datasets: [
        {
          data: [sudah, belum],
          backgroundColor: ['#22c55e', '#ef4444'],
          borderColor: segmentGap,
          borderWidth: 3,
          hoverOffset: 4,
        },
      ],
    }),
    [sudah, belum, segmentGap],
  );

  const options = useMemo(
    () => ({
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 8,
          titleFont: { size: 9 },
          bodyFont: { size: 9 },
          callbacks: {
            label: (ctx: any) => {
              const n = ctx.dataIndex === 0 ? sudah : belum;
              const pct = total > 0 ? Math.round((n / total) * 1000) / 10 : 0;
              return `${ctx.label}: ${n.toLocaleString('id-ID')} (${pct}%)`;
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 700 },
      maintainAspectRatio: false,
    }),
    [sudah, belum, total],
  );

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <div style={{ height: 104, position: 'relative' }}>
        <Doughnut data={data} options={options as any} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1, letterSpacing: '-0.5px' }}>{pctSudah}%</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 5 }}>
        <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>sudah bayar</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 6 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 8.5, color: 'var(--text-muted)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 2, background: '#22c55e', display: 'inline-block' }} /> Sudah Bayar
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 8.5, color: 'var(--text-muted)' }}>
          <span style={{ width: 7, height: 7, borderRadius: 2, background: '#ef4444', display: 'inline-block' }} /> Belum Bayar
        </span>
      </div>
    </div>
  );
}