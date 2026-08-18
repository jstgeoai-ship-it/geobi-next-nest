'use client';

import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import type { WilayahBoundsRow } from '@geobi/shared';
import { useWilayahRealisasi } from '../../hooks/useWilayahRealisasi';
import { useTahunList } from '../../hooks/useWilayahOptions';
import { useAvoidMapControls } from '../../hooks/useAvoidMapControls';
import { useFiltersStore } from '../../store/filters.store';
import { rupiah, angka, pctOf } from '../../lib/format';
import { DownloadIcon } from '../Sidebar/icons';

type GroupBy = 'rt' | 'rw';

const SUDAH_COLOR = '#22c55e';
const BELUM_COLOR = '#f59e0b';
const BAR_WIDTH_PX = 34;
const MIN_CHART_HEIGHT = 150;

function rupiahCompact(v: number): string {
  if (v >= 1e9) return `Rp ${(v / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  if (v >= 1e6) return `Rp ${(v / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 0 })} Jt`;
  return rupiah(v);
}

interface Props {
  onZoomToWilayah: (bounds: [[number, number], [number, number]]) => void;
}

export function WilayahRealisasiPanel({ onZoomToWilayah }: Props) {
  const [tab, setTab] = useState<GroupBy>('rw');
  const [minimized, setMinimized] = useState(false);
  const [chartHeight, setChartHeight] = useState(MIN_CHART_HEIGHT);

  // This chart's own Tahun Pajak range — deliberately separate from the main Filter Waktu
  // (which scopes tab Pembayaran to one tahun + periode pembayaran). Seeded to the latest
  // year (a single-year range) once it loads, same "don't silently sum every year" reasoning
  // as config.defaultTahunFilter — widening the range is an explicit user choice.
  const { data: tahunData } = useTahunList();
  const daftarTahun = tahunData?.daftarTahun ?? [];
  const [tahunAwal, setTahunAwal] = useState('');
  const [tahunAkhir, setTahunAkhir] = useState('');
  useEffect(() => {
    if (tahunData?.tahunTerbaru != null && !tahunAwal && !tahunAkhir) {
      setTahunAwal(String(tahunData.tahunTerbaru));
      setTahunAkhir(String(tahunData.tahunTerbaru));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tahunData?.tahunTerbaru]);

  const { data, isLoading } = useWilayahRealisasi(tab, tahunAwal, tahunAkhir);
  const rows = data ?? [];
  const { bottom, left, right } = useAvoidMapControls('#main');
  const setRw = useFiltersStore((s) => s.setRw);
  const setRt = useFiltersStore((s) => s.setRt);

  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  function handleResizeStart(e: React.PointerEvent) {
    e.preventDefault();
    dragRef.current = { startY: e.clientY, startHeight: chartHeight };

    function onMove(ev: PointerEvent) {
      if (!dragRef.current) return;
      // Dragging the handle UP shrinks clientY, so growth = startY - currentY.
      const delta = dragRef.current.startY - ev.clientY;
      setChartHeight(Math.max(MIN_CHART_HEIGHT, dragRef.current.startHeight + delta));
    }
    function onUp() {
      dragRef.current = null;
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  // Ekspor data chart yang lagi ditampilkan (per RT/RW, tahun terpilih) ke CSV — murni
  // client-side dari `rows` yang udah di-fetch, gak perlu endpoint backend baru.
  function handleDownloadCsv() {
    const header = ['Wilayah', 'Sudah Bayar (Rp)', 'Sudah Bayar (SPPT)', 'Belum Bayar (Rp)', 'Belum Bayar (SPPT)'];
    const csvRows = rows.map((r) => [r.label, r.sudahBayarRp, r.sudahBayarCount, r.belumBayarRp, r.belumBayarCount]);
    const csv = [header, ...csvRows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realisasi-pembayaran-${tab}-${tahunAwal}-${tahunAkhir}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const chartData = {
    labels: rows.map((r) => r.label),
    datasets: [
      {
        label: 'Sudah Bayar',
        data: rows.map((r) => r.sudahBayarRp),
        backgroundColor: SUDAH_COLOR,
        stack: 'total',
        borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 4, bottomRight: 4 },
        maxBarThickness: 24,
      },
      {
        label: 'Belum Bayar',
        data: rows.map((r) => r.belumBayarRp),
        backgroundColor: BELUM_COLOR,
        stack: 'total',
        borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
        maxBarThickness: 24,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_evt: unknown, elements: { index: number }[]) => {
      const row = rows[elements[0]?.index];
      if (!row) return;
      if (tab === 'rw') setRw(row.label); else setRt(row.label);
      fetch(`/api/pbb/wilayah/bounds?groupBy=${tab}&value=${encodeURIComponent(row.label)}`)
        .then((r) => r.json())
        .then((b: WilayahBoundsRow | null) => {
          if (b) onZoomToWilayah([[b.minLng, b.minLat], [b.maxLng, b.maxLat]]);
        })
        .catch(() => {});
    },
    onHover: (evt: { native: { target: { style: { cursor: string } } } }, elements: unknown[]) => {
      const target = evt.native?.target;
      if (target) target.style.cursor = elements.length ? 'pointer' : 'default';
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { datasetIndex: number; dataIndex: number; dataset: { label?: string } }) => {
            const row = rows[ctx.dataIndex];
            if (!row) return '';
            const isSudah = ctx.datasetIndex === 0;
            const rp = isSudah ? row.sudahBayarRp : row.belumBayarRp;
            const count = isSudah ? row.sudahBayarCount : row.belumBayarCount;
            const totalRp = row.sudahBayarRp + row.belumBayarRp;
            const totalCount = row.sudahBayarCount + row.belumBayarCount;
            return [
              `${ctx.dataset.label}: ${rupiahCompact(rp)} (${pctOf(rp, totalRp)}%)`,
              `SPPT: ${angka(count)} (${pctOf(count, totalCount)}%)`,
            ];
          },
        },
      },
    },
    scales: {
      x: { stacked: true, ticks: { color: '#94a3b8', font: { size: 9 } }, grid: { display: false } },
      y: {
        stacked: true, min: 0,
        ticks: { color: '#94a3b8', font: { size: 9 }, callback: (v: string | number) => rupiahCompact(Number(v)) },
        grid: { color: 'rgba(255,255,255,.06)' },
      },
    },
  };

  return (
    <div className="wilayah-chart-panel" style={{ bottom, left, right }}>

      <div className="wilayah-chart-card">
        <div className="wilayah-chart-toprow">
          <div className="wilayah-chart-tab-inline">
            <button type="button" className={`wilayah-chart-tab${tab === 'rt' ? ' active' : ''}`} onClick={() => setTab('rt')}>
              RT
            </button>
            <button type="button" className={`wilayah-chart-tab${tab === 'rw' ? ' active' : ''}`} onClick={() => setTab('rw')}>
              RW
            </button>
          </div>

          {!minimized && (
            <div className="wilayah-chart-yearrange">
              <span className="wilayah-chart-yearrange-label">Tahun Pajak</span>
              <select value={tahunAwal} onChange={(e) => setTahunAwal(e.target.value)}>
                {daftarTahun.map((th) => <option key={th} value={th}>{th}</option>)}
              </select>
              <span className="wilayah-chart-yearrange-sep">s/d</span>
              <select value={tahunAkhir} onChange={(e) => setTahunAkhir(e.target.value)}>
                {daftarTahun.map((th) => <option key={th} value={th}>{th}</option>)}
              </select>
            </div>
          )}

          <div className="wilayah-chart-toolbar">
            <button type="button" className="wilayah-chart-download-btn" onClick={handleDownloadCsv} title="Unduh data sebagai CSV">
              <DownloadIcon />
              Unduh
            </button>
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
        </div>
        {!minimized && (
          <div
            className="wilayah-chart-resize-handle"
            onPointerDown={handleResizeStart}
            title="Tarik ke atas untuk memperbesar"
          >
            <span />
          </div>
        )}
      

        {!minimized && (
          <div className="wilayah-chart-legend-vertical">
            <span className="wilayah-chart-legend-item"><span className="wilayah-chart-swatch" style={{ background: SUDAH_COLOR }} />Sudah Bayar</span>
            <span className="wilayah-chart-legend-item"><span className="wilayah-chart-swatch" style={{ background: BELUM_COLOR }} />Belum Bayar</span>
          </div>
        )}

        {!minimized && (
          <div className="wilayah-chart-scroll">
            <div style={{ minWidth: Math.max(rows.length * BAR_WIDTH_PX, 300), height: chartHeight }}>
              {isLoading ? (
                <div className="wilayah-chart-loading">Memuat…</div>
              ) : (
                <Bar data={chartData} options={options as never} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
