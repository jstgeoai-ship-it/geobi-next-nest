'use client';

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useWilayahRealisasi } from '../../hooks/useWilayahRealisasi';
import { useAvoidMapControls } from '../../hooks/useAvoidMapControls';

type GroupBy = 'rt' | 'rw';

const TAB_COLOR: Record<GroupBy, string> = { rw: '#f59e0b', rt: '#22c55e' };
const BAR_WIDTH_PX = 34;

export function WilayahRealisasiPanel() {
  const [tab, setTab] = useState<GroupBy>('rw');
  const [minimized, setMinimized] = useState(false);
  const { data, isLoading } = useWilayahRealisasi(tab);
  const rows = data ?? [];
  const { bottom, left, right } = useAvoidMapControls('#main');

  const chartData = {
    labels: rows.map((r) => r.label),
    datasets: [
      {
        label: 'Realisasi',
        data: rows.map((r) => r.pct),
        backgroundColor: TAB_COLOR[tab],
        borderRadius: 4,
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx: { parsed: { y: number } }) => `Realisasi: ${ctx.parsed.y}%` } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
      y: {
        min: 0, max: 100,
        ticks: { color: '#94a3b8', font: { size: 9 }, callback: (v: string | number) => `${v}%`, stepSize: 25 },
        grid: { color: 'rgba(255,255,255,.06)' },
      },
    },
  };

  return (
    <div className="wilayah-chart-panel" style={{ bottom, left, right }}>
      <div className="wilayah-chart-header">
        <div className="wilayah-chart-tabs">
          <button type="button" className={`wilayah-chart-tab${tab === 'rt' ? ' active' : ''}`} onClick={() => setTab('rt')}>
            RT
          </button>
          <button type="button" className={`wilayah-chart-tab${tab === 'rw' ? ' active' : ''}`} onClick={() => setTab('rw')}>
            RW
          </button>
        </div>
        <button
          type="button"
          className="wilayah-chart-toggle"
          onClick={() => setMinimized((m) => !m)}
          title={minimized ? 'Maximize' : 'Minimize'}
          aria-label={minimized ? 'Maximize chart' : 'Minimize chart'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            {minimized ? <polyline points="6 9 12 15 18 9" /> : <line x1="6" y1="12" x2="18" y2="12" />}
          </svg>
        </button>
      </div>

      {!minimized && (
        <div className="wilayah-chart-scroll">
          <div style={{ minWidth: Math.max(rows.length * BAR_WIDTH_PX, 300), height: 150 }}>
            {isLoading ? (
              <div className="wilayah-chart-loading">Memuat…</div>
            ) : (
              <Bar data={chartData} options={options as never} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
