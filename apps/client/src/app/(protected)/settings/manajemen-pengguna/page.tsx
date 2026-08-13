'use client';

import { useState } from 'react';
import { SettingsCard, Badge, TextInput, SelectInput } from '@/components/settings/ui';

interface Pengguna {
  nama: string;
  email: string;
  peran: 'Administrator' | 'Operator' | 'Viewer';
  status: 'Aktif' | 'Nonaktif';
  terakhirAktif: string;
}

const PENGGUNA: Pengguna[] = [
  { nama: 'aviena', email: 'aviena.lavi@bapenda.jakarta.go.id', peran: 'Administrator', status: 'Aktif', terakhirAktif: 'Sekarang' },
  { nama: 'ricki.fadli', email: 'ricki.fadli@bapenda.jakarta.go.id', peran: 'Operator', status: 'Aktif', terakhirAktif: '5 menit lalu' },
  { nama: 'sarah.novita', email: 'sarah.novita@bapenda.jakarta.go.id', peran: 'Operator', status: 'Aktif', terakhirAktif: '1 jam lalu' },
  { nama: 'joko.prasetyo', email: 'joko.prasetyo@bapenda.jakarta.go.id', peran: 'Operator', status: 'Aktif', terakhirAktif: '2 jam lalu' },
  { nama: 'maria.uli', email: 'maria.uli@bapenda.jakarta.go.id', peran: 'Viewer', status: 'Aktif', terakhirAktif: '1 hari lalu' },
];

const STAT = [
  { label: 'Total Pengguna', value: PENGGUNA.length, hint: 'Pengguna aktif' },
  { label: 'Administrator', value: PENGGUNA.filter((p) => p.peran === 'Administrator').length, hint: 'Akses penuh' },
  { label: 'Operator', value: PENGGUNA.filter((p) => p.peran === 'Operator').length, hint: 'Akses terbatas' },
  { label: 'Viewer', value: PENGGUNA.filter((p) => p.peran === 'Viewer').length, hint: 'Hanya melihat' },
];

function peranTone(p: Pengguna['peran']) {
  return p === 'Administrator' ? 'red' : p === 'Operator' ? 'blue' : 'gray';
}

export default function ManajemenPenggunaPage() {
  const [q, setQ] = useState('');
  const [peranFilter, setPeranFilter] = useState('Semua Peran');
  const [statusFilter, setStatusFilter] = useState('Semua Status');

  const filtered = PENGGUNA.filter((p) => {
    const matchQ = !q || p.nama.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase());
    const matchPeran = peranFilter === 'Semua Peran' || p.peran === peranFilter;
    const matchStatus = statusFilter === 'Semua Status' || p.status === statusFilter;
    return matchQ && matchPeran && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button type="button" className="rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-medium px-4 py-2 transition-colors">
          + Tambah Pengguna
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT.map((s) => (
          <SettingsCard key={s.label}>
            <p className="text-xs text-[var(--pub-muted-2)]">{s.label}</p>
            <p className="text-2xl font-semibold text-[var(--pub-text)] mt-1">{s.value}</p>
            <p className="text-xs text-[var(--pub-muted-3)] mt-0.5">{s.hint}</p>
          </SettingsCard>
        ))}
      </div>

      <SettingsCard>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <TextInput placeholder="Cari nama, email, atau username..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1" />
          <SelectInput value={peranFilter} onChange={(e) => setPeranFilter(e.target.value)} className="sm:w-40">
            {['Semua Peran', 'Administrator', 'Operator', 'Viewer'].map((v) => <option key={v}>{v}</option>)}
          </SelectInput>
          <SelectInput value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-40">
            {['Semua Status', 'Aktif', 'Nonaktif'].map((v) => <option key={v}>{v}</option>)}
          </SelectInput>
        </div>

        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[var(--pub-muted-2)] border-b border-white/10 light:border-gray-200">
                <th className="px-5 py-2 font-medium">Pengguna</th>
                <th className="px-5 py-2 font-medium">Email</th>
                <th className="px-5 py-2 font-medium">Peran</th>
                <th className="px-5 py-2 font-medium">Status</th>
                <th className="px-5 py-2 font-medium">Terakhir Aktif</th>
                <th className="px-5 py-2 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 light:divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.email}>
                  <td className="px-5 py-2.5 text-[var(--pub-text)]">{p.nama}</td>
                  <td className="px-5 py-2.5 text-[var(--pub-muted-2)]">{p.email}</td>
                  <td className="px-5 py-2.5"><Badge tone={peranTone(p.peran)}>{p.peran}</Badge></td>
                  <td className="px-5 py-2.5"><Badge tone="green">{p.status}</Badge></td>
                  <td className="px-5 py-2.5 text-[var(--pub-muted-2)]">{p.terakhirAktif}</td>
                  <td className="px-5 py-2.5 text-right text-[var(--pub-muted-2)]">⋮</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-6 text-center text-[var(--pub-muted-2)]">Tidak ada pengguna yang cocok.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SettingsCard>
    </div>
  );
}