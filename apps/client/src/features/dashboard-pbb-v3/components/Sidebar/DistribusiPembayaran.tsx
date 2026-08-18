'use client';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { PbbAggregateRow } from '@geobi/shared';
import { rupiahM, pctOf } from '../../lib/format';
import { useTheme } from '@/lib/useTheme';

/** Kombinasi DonutChart.tsx + DistributionTable.tsx jadi 1 card (donut kiri, list kanan) —
 *  dua komponen lama itu sengaja gak disentuh/dihapus (siapa tau masih dipakai di tempat lain
 *  di luar Sidebar.tsx), cukup gak dipanggil lagi dari sini. */
const ROWS = [
  { key: 'sudah_bayar' as const, rpKey: 'realisasi_rp' as const, label: 'Sudah Bayar', color: '#22c55e' },
  { key: 'belum_bayar' as const, rpKey: 'belum_rp' as const, label: 'Belum Bayar', color: '#ef4444' },
  { key: 'pbb_nol' as const, rpKey: null, label: 'PBB 0 Rupiah', color: '#f59e0b' },
  { key: 'dibatalkan' as const, rpKey: null, label: 'Dibatalkan', color: '#3b82f6' },
];

export function DistribusiPembayaran({ stats }: { stats?: PbbAggregateRow }) {
  const { theme } = useTheme();
  const total = stats?.total ?? 0;
  const segmentGap = theme === 'light' ? '#ffffff' : '#0a0f1e';
  const values = ROWS.map((r) => Number(stats?.[r.key] ?? 0));

  const data = useMemo(
    () => ({
      labels: ROWS.map((r) => r.label),
      datasets: [
        {
          data: values,
          backgroundColor: ROWS.map((r) => r.color),
          borderColor: segmentGap,
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    }),
    [values, segmentGap],
  );

  const options = useMemo(
    () => ({
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (ctx: any) => {
               const row = ROWS[ctx.dataIndex];
              return row.rpKey ? rupiahM(stats?.[row.rpKey] ?? 0) : 'Rp 0';
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 800 },
      maintainAspectRatio: false,
    }),
    [values, total],
  );

  return (
    <div className="chart-box distribusi-card">
      <div className="distribusi-donut">
        <Doughnut data={data} options={options as any} />
      </div>
      <div className="distribusi-legend">
        {ROWS.map((r, i) => {
          const count = values[i];
          const pct = pctOf(count, total);
          const rp = r.rpKey ? rupiahM(stats?.[r.rpKey] ?? 0) : 'Rp 0';
          return (
            <div key={r.key} className="distribusi-row">
              <span className="distribusi-dot" style={{ background: r.color }} />
              <span className="distribusi-label">{r.label}</span>
              <span className="distribusi-rp">{rp}</span>
              <span className="distribusi-pct" style={{ color: r.color }}>{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
