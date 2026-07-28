'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { Chart } from 'chart.js';
import type { PbbAggregateRow } from '@geobi/shared';
import { needlePlugin } from '../../lib/gauge-plugin';
import { rupiahM, angka } from '../../lib/format';

export function GaugeCard({ stats, tahunAktif }: { stats?: PbbAggregateRow; tahunAktif: string }) {
  const total = stats?.total ?? 0;
  const realisasiRp = Number(stats?.realisasi_rp ?? 0);
  const targetRp = Number(stats?.target_rp ?? 0);
  const belumRp = Number(stats?.belum_rp ?? 0);
  const frac = targetRp > 0 ? realisasiRp / targetRp : 0;
  const pctReal = Math.round(frac * 1000) / 10;

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

  const data = useMemo(
    () => ({
      datasets: [
        {
          data: [realisasiRp, Math.max(targetRp - realisasiRp, 0)],
          backgroundColor: ['#3b82f6', 'rgba(148,163,184,.16)'],
          borderWidth: 0,
          borderRadius: 4,
        },
      ],
    }),
    [realisasiRp, targetRp],
  );

  const options = useMemo(
    () => ({
      rotation: -90,
      circumference: 180,
      cutout: '68%',
      aspectRatio: 2.35,
      layout: { padding: { top: 2, bottom: 0, left: 8, right: 8 } },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      animation: { duration: 600 },
    }),
    [],
  );

  return (
    <div id="tour-gauge" className="sidebar-section" style={{ padding: '16px 16px 8px', borderBottom: 'none' }}>
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <span style={{ display: 'inline-block', background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(59,130,246,.35)', borderRadius: 6, padding: '6px 16px', fontSize: 13, fontWeight: 700, color: '#93c5fd', letterSpacing: '.02em' }}>
          {tahunAktif ? `Tahun Pajak ${tahunAktif}` : 'Semua Tahun Pajak'}
        </span>
      </div>
      <div className="sidebar-label" style={{ textAlign: 'center', marginBottom: 6 }}>Capaian Realisasi Pembayaran PBB-P2</div>
      <div className="chart-box" style={{ padding: '12px 12px 10px', marginBottom: 0 }}>
        <div>
          <Doughnut ref={chartRef} data={data} options={options as any} plugins={[needlePlugin]} height={104} />
          <div style={{ textAlign: 'center', marginTop: 5, pointerEvents: 'none' }}>
            <div style={{ fontSize: 25, fontWeight: 800, color: '#e2e8f0', lineHeight: 1, letterSpacing: '-0.5px' }}>{pctReal}%</div>
            <div style={{ fontSize: 9, color: '#ffffff', letterSpacing: '.09em', textTransform: 'uppercase', marginTop: 4 }}>dari PBB harus dibayar</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <div style={{ background: 'rgba(34,197,94,.12)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 8, padding: '9px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#86efac', textTransform: 'uppercase', letterSpacing: '.06em' }}>Realisasi</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#22c55e', marginTop: 3, whiteSpace: 'nowrap' }}>{rupiahM(realisasiRp)}</div>
          </div>
          <div style={{ background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.3)', borderRadius: 8, padding: '9px 6px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '.06em' }}>Harus Dibayar</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#3b82f6', marginTop: 3, whiteSpace: 'nowrap' }}>{rupiahM(targetRp)}</div>
          </div>
        </div>

        <div style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.40)', borderRadius: 8, padding: '7px 8px', marginTop: 8, textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: '#fcd34d' }}>
            Belum Realisasi : <span style={{ fontWeight: 700, color: '#fcd34d' }}>{rupiahM(belumRp)}</span>
          </span>
        </div>

        <div style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 9, marginTop: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22d3ee', lineHeight: 1.1 }}>{angka(total)}</div>
          <div style={{ fontSize: 10, color: '#ffffff', marginTop: 2, letterSpacing: '.03em' }}>Total Objek PBB-P2</div>
        </div>
      </div>
    </div>
  );
}
