import type { Chart, Plugin } from 'chart.js';

type GaugeChart = Chart<'doughnut'> & { $frac?: number };

/** Draws the needle on the Realisasi-vs-Target gauge — port of needlePlugin in dashboard.blade.php. */
export const needlePlugin: Plugin<'doughnut'> = {
  id: 'needle',
  afterDatasetDraw(chart) {
    const c = chart as GaugeChart;
    const frac = c.$frac ?? 0;
    const meta = chart.getDatasetMeta(0);
    if (!meta.data.length) return;

    const arc = meta.data[0] as unknown as { x: number; y: number; innerRadius: number; outerRadius: number };
    const cx = arc.x;
    const cy = arc.y;

    const rTip = arc.innerRadius + (arc.outerRadius - arc.innerRadius) * 0.55;
    const rTail = 5;
    const ang = Math.PI + Math.min(Math.max(frac, 0), 1) * Math.PI;
    const ctx = chart.ctx;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(rTail, -2.2);
    ctx.lineTo(rTip, 0);
    ctx.lineTo(rTail, 2.2);
    ctx.closePath();
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#e2e8f0';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
  },
};
