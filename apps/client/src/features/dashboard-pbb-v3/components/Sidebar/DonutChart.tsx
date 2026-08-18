'use client';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { PbbAggregateRow } from '@geobi/shared';
import { rupiahM } from '../../lib/format';
import { useTheme } from '@/lib/useTheme';

export function DonutChart({ stats }: { stats?: PbbAggregateRow }) {
  const { theme } = useTheme();
  const sudah = stats?.sudah_bayar ?? 0;
  const belum = stats?.belum_bayar ?? 0;
  const nol = stats?.pbb_nol ?? 0;
  const batal = stats?.dibatalkan ?? 0;
  const realisasiRp = Number(stats?.realisasi_rp ?? 0);
  const belumRp = Number(stats?.belum_rp ?? 0);
  const batalRp = Number(stats?.batal_rp ?? 0);

  const segmentGap = theme === 'light' ? '#f2f4f7' : '#0a0f1e';

  const data = useMemo(
    () => ({
      labels: ['Sudah Bayar', 'Belum Bayar', 'PBB 0 Rupiah', 'Di Batalkan'],
      datasets: [
        {
          data: [sudah, belum, nol, batal],
          backgroundColor: ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6'],
          borderColor: segmentGap,
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    }),
    [sudah, belum, nol, batal, segmentGap],
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
              const rp = [realisasiRp, belumRp, 0, batalRp][ctx.dataIndex] ?? 0;
              return rupiahM(rp);
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 800 },
      maintainAspectRatio: false,
    }),
    [realisasiRp, belumRp, batalRp],
  );

  return (
    <div className="chart-box" style={{ padding: 10, position: 'relative' }}>
      <div style={{ height: 180 }}>
        <Doughnut data={data} options={options as any} />
      </div>
    </div>
  );
}