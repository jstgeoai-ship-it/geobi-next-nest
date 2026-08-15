'use client';

import { useState } from 'react';
import { SettingsCard, Badge } from '@/components/settings/ui';

const SESI = [
  { device: 'Chrome · Windows', loc: 'Jakarta, Indonesia', status: 'active', label: 'Aktif' },
  { device: 'Android · Chrome Mobile', loc: 'Jakarta, Indonesia', status: 'idle', label: '2 jam lalu' },
  { device: 'Safari · iPhone', loc: 'Jakarta, Indonesia', status: 'idle', label: '1 hari lalu' },
];

export default function KeamananPage() {
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <SettingsCard title="Password">
        <p className="text-sm text-[var(--pub-text)]">Password terakhir diubah</p>
        <p className="text-xs text-[var(--pub-muted-2)] mt-1 mb-4">6 Mei 2026 10:32 WIB</p>
        <button type="button" className="rounded-lg border border-white/10 light:border-gray-300 hover:bg-white/5 light:hover:bg-gray-50 text-[var(--pub-text)] text-sm font-medium px-4 py-2 transition-colors">
          Ubah Password
        </button>
      </SettingsCard>

      <SettingsCard title="Sesi Aktif">
        <p className="text-xs text-[var(--pub-muted-2)] mb-3">Kelola perangkat yang saat ini masuk ke akun Anda.</p>
        <div className="space-y-3">
          {SESI.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <div>
                <p className="text-[var(--pub-text)]">{s.device}</p>
                <p className="text-xs text-[var(--pub-muted-2)]">{s.loc}</p>
              </div>
              {s.status === 'active' ? <Badge tone="green">Aktif</Badge> : <button className="text-xs text-red-400 hover:underline">Keluar</button>}
            </div>
          ))}
        </div>
        <button type="button" className="mt-4 text-xs font-medium text-cyan-400 hover:underline">Lihat Semua Sesi (3) →</button>
      </SettingsCard>
    </div>
  );
}