'use client';

import { STATUS_OPTIONS } from '../../../store/filters.store';

const LABELS: Record<string, { label: string; color: string }> = {
  sudah: { label: 'Sudah Bayar', color: '#22c55e' },
  belum: { label: 'Belum Bayar / Belum Lunas', color: '#ef4444' },
  nol: { label: 'PBB Bayar 0 Rupiah', color: '#f59e0b' },
  batal: { label: 'Di Batalkan', color: '#3b82f6' },
};

interface Props {
  selected: string[];
  onToggle: (v: string) => void;
  onSetAll: (checked: boolean) => void;
}

export function StatusPanel({ selected, onToggle, onSetAll }: Props) {
  const allChecked = selected.length === STATUS_OPTIONS.length;
  const someChecked = selected.length > 0 && selected.length < STATUS_OPTIONS.length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <input
          type="checkbox"
          checked={allChecked}
          ref={(el) => { if (el) el.indeterminate = someChecked; }}
          onChange={(e) => onSetAll(e.target.checked)}
          title="Pilih / lepas semua status"
        />
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '.09em' }}>Status Pembayaran</span>
      </div>
      {STATUS_OPTIONS.map((v) => (
        <label key={v} className="status-toggle">
          <input type="checkbox" checked={selected.includes(v)} onChange={() => onToggle(v)} />
          <span className="status-dot" style={{ background: LABELS[v].color }} /> {LABELS[v].label}
        </label>
      ))}
    </div>
  );
}
