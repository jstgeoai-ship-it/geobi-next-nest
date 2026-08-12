'use client';

import { useState } from 'react';
import { SettingsCard, Badge, SelectInput } from '@/components/settings/ui';

const LOG = [
  { waktu: '06 Mei 2026 10:15 WIB', modul: 'Pembayaran', status: 'Berhasil', jumlah: '125.430', durasi: '00:01:54', ket: 'Sinkronisasi selesai' },
  { waktu: '06 Mei 2026 10:15 WIB', modul: 'Pendataan', status: 'Berhasil', jumlah: '98.721', durasi: '00:01:12', ket: 'Sinkronisasi selesai' },
  { waktu: '06 Mei 2026 09:45 WIB', modul: 'Penilaian', status: 'Gagal', jumlah: '-', durasi: '00:00:45', ket: 'Timeout koneksi' },
];

export default function DataSinkronisasiPage() {
  const [frekuensi, setFrekuensi] = useState('Setiap 30 menit');
  const [waktuMulai, setWaktuMulai] = useState('00:00');
  const [waktuSelesai, setWaktuSelesai] = useState('23:59');
  const [syncing, setSyncing] = useState(false);

  function syncSekarang() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SettingsCard title="Status Sinkronisasi">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-[var(--pub-muted-2)]">Status</span>
            <Badge tone="green">Berhasil</Badge>
          </div>
          <p className="text-xs text-[var(--pub-muted-2)]">Terakhir Sync</p>
          <p className="text-sm text-[var(--pub-text)] mb-2">06 Mei 2026 10:15 WIB</p>
          <p className="text-xs text-[var(--pub-muted-2)]">Data Terakhir</p>
          <p className="text-sm text-[var(--pub-text)] mb-4">PBB 2026</p>
          <button
            type="button"
            onClick={syncSekarang}
            disabled={syncing}
            className="rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 transition-colors"
          >
            {syncing ? 'Menyinkronkan…' : 'Sync Sekarang'}
          </button>
        </SettingsCard>

        <SettingsCard title="Jadwal Sinkronisasi">
          <div className="space-y-3">
            <div>
              <span className="block text-xs font-medium text-[var(--pub-muted-2)] mb-1.5">Frekuensi</span>
              <SelectInput value={frekuensi} onChange={(e) => setFrekuensi(e.target.value)}>
                {['Setiap 15 menit', 'Setiap 30 menit', 'Setiap jam', 'Harian'].map((v) => <option key={v}>{v}</option>)}
              </SelectInput>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="block text-xs font-medium text-[var(--pub-muted-2)] mb-1.5">Waktu Mulai</span>
                <input type="time" value={waktuMulai} onChange={(e) => setWaktuMulai(e.target.value)} className="w-full rounded-lg border border-white/10 light:border-gray-300 bg-slate-950 light:bg-white text-[var(--pub-text)] text-sm px-3 py-2 outline-none" />
              </div>
              <div>
                <span className="block text-xs font-medium text-[var(--pub-muted-2)] mb-1.5">Waktu Selesai</span>
                <input type="time" value={waktuSelesai} onChange={(e) => setWaktuSelesai(e.target.value)} className="w-full rounded-lg border border-white/10 light:border-gray-300 bg-slate-950 light:bg-white text-[var(--pub-text)] text-sm px-3 py-2 outline-none" />
              </div>
            </div>
            <p className="text-xs text-[var(--pub-muted-3)]">Sinkronisasi akan berjalan sesuai jadwal yang ditentukan.</p>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard title="Log Sinkronisasi">
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--pub-muted-2)] border-b border-white/10 light:border-gray-200">
                <th className="px-5 py-2 font-medium">Waktu</th>
                <th className="px-5 py-2 font-medium">Modul</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Jumlah Data</th>
                <th className="px-5 py-2 font-medium">Durasi</th>
                <th className="px-5 py-2 font-medium">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 light:divide-gray-100">
              {LOG.map((l, i) => (
                <tr key={i}>
                  <td className="px-5 py-2.5 text-[var(--pub-muted-2)] whitespace-nowrap">{l.waktu}</td>
                  <td className="px-5 py-2.5 text-[var(--pub-text)]">{l.modul}</td>
                  <td className="px-5 py-2.5"><Badge tone={l.status === 'Berhasil' ? 'green' : 'red'}>{l.status}</Badge></td>
                  <td className="px-5 py-2.5 text-[var(--pub-text)]">{l.jumlah}</td>
                  <td className="px-5 py-2.5 text-[var(--pub-muted-2)]">{l.durasi}</td>
                  <td className="px-5 py-2.5 text-[var(--pub-muted-2)]">{l.ket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}