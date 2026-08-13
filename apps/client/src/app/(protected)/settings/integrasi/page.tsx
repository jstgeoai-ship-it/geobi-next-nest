'use client';

import { useState } from 'react';
import { SettingsCard, Badge } from '@/components/settings/ui';

interface Integrasi {
  key: string;
  nama: string;
  deskripsi: string;
  status: 'Terhubung' | 'Tidak Terhubung';
  url?: string;
  terakhirSync?: string;
  frekuensi?: string;
}

const INTEGRASI: Integrasi[] = [
  { key: 'siap', nama: 'SIAP Bapenda', deskripsi: 'Sistem Informasi Administrasi Perpajakan', status: 'Tidak Terhubung', url: 'https://siap.bapenda.jakarta.go.id/api', terakhirSync: '06 Mei 2026 10:15 WIB', frekuensi: 'Setiap 30 menit' },
  { key: 'sso', nama: 'SSO Bapenda', deskripsi: 'Single Sign-On', status: 'Tidak Terhubung' },
];

export default function IntegrasiPage() {
  const [active, setActive] = useState(INTEGRASI[0].key);
  const selected = INTEGRASI.find((i) => i.key === active)!;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5">
      <SettingsCard title="Sistem Terhubung">
        <div className="space-y-2">
          {INTEGRASI.map((i) => (
            <button
              key={i.key}
              type="button"
              onClick={() => setActive(i.key)}
              className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                active === i.key ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/10 light:border-gray-200 hover:bg-white/5 light:hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--pub-text)]">{i.nama}</span>
                <Badge tone={i.status === 'Terhubung' ? 'green' : 'red'}>{i.status}</Badge>
              </div>
              <p className="text-xs text-[var(--pub-muted-2)] mt-0.5">{i.deskripsi}</p>
            </button>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Detail Integrasi">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-white/5 light:border-gray-100 pb-2">
            <dt className="text-[var(--pub-muted-2)]">Sistem</dt>
            <dd className="text-[var(--pub-text)] font-medium">{selected.nama}</dd>
          </div>
          <div className="flex justify-between border-b border-white/5 light:border-gray-100 pb-2">
            <dt className="text-[var(--pub-muted-2)]">Status</dt>
            <dd><Badge tone={selected.status === 'Terhubung' ? 'green' : 'red'}>{selected.status}</Badge></dd>
          </div>
          {selected.url && (
            <div className="flex justify-between border-b border-white/5 light:border-gray-100 pb-2 gap-4">
              <dt className="text-[var(--pub-muted-2)] shrink-0">URL Endpoint</dt>
              <dd className="text-[var(--pub-text)] text-right break-all">{selected.url}</dd>
            </div>
          )}
          {selected.terakhirSync && (
            <div className="flex justify-between border-b border-white/5 light:border-gray-100 pb-2">
              <dt className="text-[var(--pub-muted-2)]">Terakhir Sync</dt>
              <dd className="text-[var(--pub-text)]">{selected.terakhirSync}</dd>
            </div>
          )}
          {selected.frekuensi && (
            <div className="flex justify-between pb-2">
              <dt className="text-[var(--pub-muted-2)]">Frekuensi Sync</dt>
              <dd className="text-[var(--pub-text)]">{selected.frekuensi}</dd>
            </div>
          )}
        </dl>
        <button type="button" className="mt-4 w-full rounded-lg border border-white/10 light:border-gray-300 hover:bg-white/5 light:hover:bg-gray-50 text-[var(--pub-text)] text-sm font-medium px-4 py-2 transition-colors">
          Kelola Integrasi
        </button>
      </SettingsCard>
    </div>
  );
}