'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/useTheme';
import { SettingsCard, ToggleRow } from '@/components/settings/ui';

/* ── Mode Tampilan: logic asli, gak diubah ───────────────────────────────
   Dipindah apa adanya dari app/(protected)/settings/page.tsx versi lama
   (dulu bernama AppearanceSection). Cuma dipakai theme/setTheme dari
   useTheme() yang sama, gak ada logic baru. */
function ModeTampilanSection() {
  const { theme, setTheme } = useTheme();

  const options = [
    { key: 'light' as const, label: 'Terang' },
    { key: 'dark' as const, label: 'Gelap' },
  ];

  return (
    <div>
      <p className="text-xs font-medium text-[var(--pub-muted-2)] mb-2">Mode Tampilan</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setTheme(opt.key)}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
              theme === opt.key
                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                : 'border-white/10 light:border-gray-200 text-[var(--pub-muted)] hover:bg-white/5 light:hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Sisanya (kepadatan, warna, radius border, dst) — murni visual/mockup,
   local state doang, gak ngubah tampilan asli apa pun. Desain aslinya
   punya kontrol-kontrol ini tapi belum ada backend/context buat nyimpen
   & nerapinnya ke seluruh app. */
const ACCENT_COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f97316', '#ef4444', '#a855f7'];

export default function TampilanPage() {
  const [kepadatan, setKepadatan] = useState<'rapat' | 'normal' | 'longgar'>('normal');
  const [ukuranFont, setUkuranFont] = useState('Sedang');
  const [skalaPeta, setSkalaPeta] = useState('10 (Kota)');
  const [radiusBorder, setRadiusBorder] = useState('Sedang (8px)');
  const [warnaUtama, setWarnaUtama] = useState(ACCENT_COLORS[0]);
  const [tampilkanGrid, setTampilkanGrid] = useState(true);

  const [legendPeta, setLegendPeta] = useState(true);
  const [kontrolNavigasi, setKontrolNavigasi] = useState(true);
  const [miniMap, setMiniMap] = useState(false);
  const [koordinatPointer, setKoordinatPointer] = useState(true);
  const [panelFilter, setPanelFilter] = useState(true);

  return (
    <div className="space-y-5">
      <SettingsCard title="Tema">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModeTampilanSection />
        </div>
      </SettingsCard>
    </div>
  );
}