'use client';

import { useState } from 'react';
import { SettingsCard, ToggleRow } from '@/components/settings/ui';

export default function NotifikasiPage() {
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);

  const [pembayaran, setPembayaran] = useState(true);
  const [syncSelesai, setSyncSelesai] = useState(true);
  const [syncGagal, setSyncGagal] = useState(true);
  const [perubahanData, setPerubahanData] = useState(false);
  const [peringatanSistem, setPeringatanSistem] = useState(true);
  const [infoPengumuman, setInfoPengumuman] = useState(true);

  const [waktuTenang, setWaktuTenang] = useState(true);
  const [mulai, setMulai] = useState('22:00');
  const [sampai, setSampai] = useState('07:00');

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SettingsCard title="Kanal Notifikasi">
          <div className="divide-y divide-white/5 light:divide-gray-100">
            <ToggleRow label="Email" hint="Terima notifikasi melalui email" checked={email} onChange={setEmail} />
            <ToggleRow label="Push Notification" hint="Terima notifikasi di browser" checked={push} onChange={setPush} />
          </div>
        </SettingsCard>

        <SettingsCard title="Jenis Notifikasi">
          <div className="divide-y divide-white/5 light:divide-gray-100">
            <ToggleRow label="Sinkronisasi data selesai" checked={syncSelesai} onChange={setSyncSelesai} />
            <ToggleRow label="Sinkronisasi data gagal" checked={syncGagal} onChange={setSyncGagal} />
            <ToggleRow label="Perubahan data" checked={perubahanData} onChange={setPerubahanData} />
            <ToggleRow label="Peringatan sistem" checked={peringatanSistem} onChange={setPeringatanSistem} />
            <ToggleRow label="Informasi & pengumuman" checked={infoPengumuman} onChange={setInfoPengumuman} />
          </div>
        </SettingsCard>
      </div>

      <SettingsCard title="Waktu Tenang (Do Not Disturb)">
        <ToggleRow label="Waktu Tenang (Do Not Disturb)" hint="Notifikasi tidak akan ditampilkan pada rentang waktu berikut" checked={waktuTenang} onChange={setWaktuTenang} />
        {waktuTenang && (
          <div className="grid grid-cols-2 gap-4 mt-3 max-w-sm">
            <div>
              <span className="block text-xs font-medium text-[var(--pub-muted-2)] mb-1.5">Mulai</span>
              <input type="time" value={mulai} onChange={(e) => setMulai(e.target.value)} className="w-full rounded-lg border border-white/10 light:border-gray-300 bg-slate-950 light:bg-white text-[var(--pub-text)] text-sm px-3 py-2 outline-none" />
            </div>
            <div>
              <span className="block text-xs font-medium text-[var(--pub-muted-2)] mb-1.5">Sampai</span>
              <input type="time" value={sampai} onChange={(e) => setSampai(e.target.value)} className="w-full rounded-lg border border-white/10 light:border-gray-300 bg-slate-950 light:bg-white text-[var(--pub-text)] text-sm px-3 py-2 outline-none" />
            </div>
          </div>
        )}
      </SettingsCard>
    </div>
  );
}