'use client';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { PbbAggregateRow } from '@geobi/shared';
import { rupiahM } from '../../lib/format';

export function DonutChart({ stats }: { stats?: PbbAggregateRow }) {
  const sudah = stats?.sudah_bayar ?? 0;
  const belum = stats?.belum_bayar ?? 0;
  const nol = stats?.pbb_nol ?? 0;
  const batal = stats?.dibatalkan ?? 0;
  const total = stats?.total ?? 0;
  const realisasiRp = Number(stats?.realisasi_rp ?? 0);
  const belumRp = Number(stats?.belum_rp ?? 0);
  const batalRp = Number(stats?.batal_rp ?? 0);

  const data = useMemo(
    () => ({
      labels: ['Sudah Bayar', 'Belum Bayar', 'PBB 0 Rupiah', 'Di Batalkan'],
      datasets: [
        {
          data: [sudah, belum, nol, batal],
          backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'],
          borderColor: '#0a0f1e',
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    }),
    [sudah, belum, nol, batal],
  );

  const options = useMemo(
    () => ({
      cutout: '65%',
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          callbacks: {
            title: (items: any[]) => {
              if (!items.length) return '';
              const i = items[0].dataIndex;
              const n = [sudah, belum, nol, batal][i] || 0;
              const pct = total > 0 ? Math.round((n / total) * 1000) / 10 : 0;
              return `${items[0].label} (${pct}%)`;
            },
            label: (ctx: any) => {
              const info = [
                { rpLabel: 'Jumlah dibayar', rp: realisasiRp },
                { rpLabel: 'Jumlah belum dibayar', rp: belumRp },
                { rpLabel: 'Jumlah dibayar', rp: 0 },
                { rpLabel: 'Jumlah dibatalkan', rp: batalRp },
              ][ctx.dataIndex] || { rpLabel: 'Jumlah dibayar', rp: 0 };
              return `${info.rpLabel}: ${rupiahM(info.rp)}`;
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 800 },
      maintainAspectRatio: false,
    }),
    [sudah, belum, nol, batal, total, realisasiRp, belumRp, batalRp],
  );

  return (
    <div className="chart-box" style={{ padding: 10, position: 'relative' }}>
      <div style={{ height: 180 }}>
        <Doughnut data={data} options={options as any} />
      </div>
    </div>
  );
}
