'use client';

import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import type { PbbAggregateRow } from '@geobi/shared';

const CHIPS = [
  { key: '', label: 'Semua' },
  { key: 'sudah', label: 'Sudah Bayar' },
  { key: 'belum', label: 'Belum Bayar' },
  { key: 'nol', label: '0 Rupiah' },
];

interface Props {
  stats?: PbbAggregateRow;
  error?: string | null;
  activeStatus: string;
  onStatusChange: (key: string) => void;
  showFill: boolean;
  showLine: boolean;
  onToggleFill: (v: boolean) => void;
  onToggleLine: (v: boolean) => void;
}

export function SidebarV1({ stats, error, activeStatus, onStatusChange, showFill, showLine, onToggleFill, onToggleLine }: Props) {
  const total = stats?.total ?? 0;
  const sudah = stats?.sudah_bayar ?? 0;
  const belum = stats?.belum_bayar ?? 0;
  const nol = stats?.pbb_nol ?? 0;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);
  const pctSudah = pct(sudah);
  const pctBelum = pct(belum);
  const pctNol = pct(nol);

  const donutData = useMemo(
    () => ({
      labels: ['Sudah Bayar', 'Belum Bayar', 'PBB 0 Rupiah'],
      datasets: [{ data: [sudah, belum, nol], backgroundColor: ['#22c55e', '#ef4444', '#f59e0b'], borderColor: '#0a0f1e', borderWidth: 3, hoverOffset: 6 }],
    }),
    [sudah, belum, nol],
  );
  const donutOptions = useMemo(
    () => ({
      cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          callbacks: {
            label: (ctx: any) => {
              const n = ctx.parsed || 0;
              const p = total > 0 ? Math.round((n / total) * 1000) / 10 : 0;
              return `${ctx.label}: ${n.toLocaleString('id-ID')} persil (${p}%)`;
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 800 },
    }),
    [total],
  );

  return (
    <aside id="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Ringkasan Data</div>
        <div className="stat-card" style={{ background: 'rgba(34,211,238,.08)', border: '1px solid rgba(34,211,238,.22)', marginBottom: 8 }}>
          <div className="val" style={{ color: '#22d3ee' }}>{total.toLocaleString('id-ID')}</div>
          <div className="lbl">Total Parsel Terdaftar</div>
        </div>
        <div className="stat-grid" style={{ marginBottom: 8 }}>
          <div className="stat-card" style={{ background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.22)' }}>
            <div className="val" style={{ color: '#22c55e' }}>{sudah.toLocaleString('id-ID')}</div>
            <div className="lbl">Sudah Bayar</div>
            <div className="pct" style={{ color: '#22c55e' }}>{pctSudah}%</div>
          </div>
          <div className="stat-card" style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.22)' }}>
            <div className="val" style={{ color: '#ef4444' }}>{belum.toLocaleString('id-ID')}</div>
            <div className="lbl">Belum Bayar</div>
            <div className="pct" style={{ color: '#ef4444' }}>{pctBelum}%</div>
          </div>
        </div>
        <div className="stat-card" style={{ background: 'rgba(245,158,11,.08)', border: '1px solid rgba(245,158,11,.22)' }}>
          <div className="val" style={{ color: '#f59e0b' }}>{nol.toLocaleString('id-ID')}</div>
          <div className="lbl">PBB Bayar 0 Rupiah</div>
          <div className="pct" style={{ color: '#f59e0b' }}>{pctNol}%</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Distribusi Status</div>
        <div className="chart-box" style={{ padding: 10, marginBottom: 10 }}>
          <Doughnut data={donutData} options={donutOptions as any} height={170} />
        </div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#22c55e' }} />Sudah Bayar ({pctSudah}%)</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#ef4444' }} />Belum Bayar ({pctBelum}%)</div>
        <div className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }} />PBB 0 Rupiah ({pctNol}%)</div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Tingkat Kepatuhan</div>
        {[
          { label: 'Sudah Bayar', pct: pctSudah, color: '#22c55e' },
          { label: 'Belum Bayar', pct: pctBelum, color: '#ef4444' },
          { label: 'PBB 0 Rupiah', pct: pctNol, color: '#f59e0b' },
        ].map((m) => (
          <div className="meter-row" key={m.label}>
            <div className="meter-head">
              <span className="m-lbl">{m.label}</span>
              <span className="m-pct" style={{ color: m.color }}>{m.pct}%</span>
            </div>
            <div className="meter-track"><div className="meter-bar" style={{ width: `${m.pct}%`, background: m.color }} /></div>
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Filter Peta</div>
        <div className="chip-wrap">
          {CHIPS.map((c) => (
            <button key={c.key} type="button" className={`chip${activeStatus === c.key ? ' active' : ''}`} onClick={() => onStatusChange(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Layer</div>
        <div className="layer-toggle">
          <label><input type="checkbox" checked={showFill} onChange={(e) => onToggleFill(e.target.checked)} /> Parsel fill</label>
        </div>
        <div className="layer-toggle">
          <label><input type="checkbox" checked={showLine} onChange={(e) => onToggleLine(e.target.checked)} /> Outline</label>
        </div>
      </div>

      {error && (
        <div className="sidebar-section">
          <div style={{ fontSize: 11, color: '#f87171', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 8, padding: 10, lineHeight: 1.5 }}>
            ⚠ {error}
          </div>
        </div>
      )}
    </aside>
  );
}
