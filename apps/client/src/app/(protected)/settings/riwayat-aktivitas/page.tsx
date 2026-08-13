'use client';

import { useState } from 'react';
import { SettingsCard, SelectInput } from '@/components/settings/ui';

const AKTIVITAS = [
  { waktu: '06 Mei 2026 10:32 WIB', pengguna: 'aviena', aktivitas: 'Login ke sistem', modul: 'Auth', ip: '103.213.45.67' },
];

export default function RiwayatAktivitasPage() {
  const [filter, setFilter] = useState('Semua Aktivitas');
  const [page, setPage] = useState(1);

  const filtered = filter === 'Semua Aktivitas' ? AKTIVITAS : AKTIVITAS.filter((a) => a.modul === filter);

  return (
    <SettingsCard>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input type="date" defaultValue="2026-05-01" className="rounded-lg border border-white/10 light:border-gray-300 bg-slate-950 light:bg-white text-[var(--pub-text)] text-sm px-3 py-2 outline-none" />
        <span className="self-center text-[var(--pub-muted-2)] text-sm hidden sm:inline">s/d</span>
        <input type="date" defaultValue="2026-05-06" className="rounded-lg border border-white/10 light:border-gray-300 bg-slate-950 light:bg-white text-[var(--pub-text)] text-sm px-3 py-2 outline-none" />
        <SelectInput value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-44">
          {['Semua Aktivitas', 'Auth', 'Pembayaran', 'Data & Sync', 'Laporan', 'Peta'].map((v) => <option key={v}>{v}</option>)}
        </SelectInput>
        <button type="button" className="ml-auto rounded-lg border border-white/10 light:border-gray-300 hover:bg-white/5 light:hover:bg-gray-50 text-[var(--pub-text)] text-sm font-medium px-4 py-2 transition-colors whitespace-nowrap">
          Export
        </button>
      </div>

      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--pub-muted-2)] border-b border-white/10 light:border-gray-200">
              <th className="px-5 py-2 font-medium">Waktu</th>
              <th className="px-5 py-2 font-medium">Pengguna</th>
              <th className="px-5 py-2 font-medium">Aktivitas</th>
              <th className="px-5 py-2 font-medium">Modul</th>
              <th className="px-5 py-2 font-medium">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 light:divide-gray-100">
            {filtered.map((a, i) => (
              <tr key={i}>
                <td className="px-5 py-2.5 text-[var(--pub-muted-2)] whitespace-nowrap">{a.waktu}</td>
                <td className="px-5 py-2.5 text-[var(--pub-text)]">{a.pengguna}</td>
                <td className="px-5 py-2.5 text-[var(--pub-text)]">{a.aktivitas}</td>
                <td className="px-5 py-2.5 text-[var(--pub-muted-2)]">{a.modul}</td>
                <td className="px-5 py-2.5 text-[var(--pub-muted-2)]">{a.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-[var(--pub-muted-2)]">
        <span>Menampilkan 1-{filtered.length} dari {filtered.length} data</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 rounded hover:bg-white/5 light:hover:bg-gray-100">‹</button>
          <span className="px-2 py-1 rounded bg-cyan-400/10 text-cyan-400 font-medium">{page}</span>
          <button onClick={() => setPage((p) => p + 1)} className="px-2 py-1 rounded hover:bg-white/5 light:hover:bg-gray-100">›</button>
        </div>
      </div>
    </SettingsCard>
  );
}