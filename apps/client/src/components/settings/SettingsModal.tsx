'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SETTINGS_NAV } from './nav-config';
import { SETTINGS_ICON_MAP } from './icons';
import { ProfileInformationForm, UpdatePasswordForm, DeleteUserForm } from '@/app/(protected)/profile/page';
import PengaturanUmumPage from '@/app/(protected)/settings/page';
import TampilanPage from '@/app/(protected)/settings/tampilan/page';
import NotifikasiPage from '@/app/(protected)/settings/notifikasi/page';
import KeamananPage from '@/app/(protected)/settings/keamanan/page';
import ManajemenPenggunaPage from '@/app/(protected)/settings/manajemen-pengguna/page';
import IntegrasiPage from '@/app/(protected)/settings/integrasi/page';
import DataSinkronisasiPage from '@/app/(protected)/settings/data-sinkronisasi/page';
import RiwayatAktivitasPage from '@/app/(protected)/settings/riwayat-aktivitas/page';

type TabKey = 'profile' | '/settings' | '/settings/tampilan' | '/settings/notifikasi' | '/settings/keamanan' | '/settings/manajemen-pengguna' | '/settings/integrasi' | '/settings/data-sinkronisasi' | '/settings/riwayat-aktivitas';

const CONTENT: Record<TabKey, { title: string; render: () => React.ReactNode }> = {
  profile: {
    title: 'Profile',
    render: () => (
      <div className="space-y-6">
        <ProfileInformationForm />
        <div className="h-px bg-white/5 light:bg-gray-900/10" />
        <UpdatePasswordForm />
        <div className="h-px bg-white/5 light:bg-gray-900/10" />
        <DeleteUserForm />
      </div>
    ),
  },
  '/settings': { title: 'Pengaturan Umum', render: () => <PengaturanUmumPage /> },
  '/settings/tampilan': { title: 'Tampilan', render: () => <TampilanPage /> },
  '/settings/notifikasi': { title: 'Notifikasi', render: () => <NotifikasiPage /> },
  '/settings/keamanan': { title: 'Keamanan', render: () => <KeamananPage /> },
  '/settings/manajemen-pengguna': { title: 'Manajemen Pengguna', render: () => <ManajemenPenggunaPage /> },
  '/settings/integrasi': { title: 'Integrasi', render: () => <IntegrasiPage /> },
  '/settings/data-sinkronisasi': { title: 'Data & Sinkronisasi', render: () => <DataSinkronisasiPage /> },
  '/settings/riwayat-aktivitas': { title: 'Riwayat Aktivitas', render: () => <RiwayatAktivitasPage /> },
};

export function SettingsModal({ open, initialTab, onClose }: { open: boolean; initialTab: TabKey; onClose: () => void }) {
  const [tab, setTab] = useState<TabKey>(initialTab);
  const icons = SETTINGS_ICON_MAP();

  useEffect(() => { if (open) setTab(initialTab); }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop — blur halaman di belakangnya, klik buat nutup */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[85vh] max-h-[720px] bg-slate-900 light:bg-white border border-white/10 light:border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Sidebar kiri — tab lokal (state), bukan navigasi/Link */}
        <div className="w-52 shrink-0 border-r border-white/5 light:border-gray-100 bg-slate-950/40 light:bg-slate-50 p-3 overflow-y-auto">
          <button
            type="button"
            onClick={() => setTab('profile')}
            className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] mb-3 transition-colors ${
              tab === 'profile' ? 'bg-cyan-400/10 text-cyan-400 font-medium' : 'text-[var(--pub-muted)] hover:bg-white/5 light:hover:bg-gray-100'
            }`}
          >
            Profile
          </button>

          {SETTINGS_NAV.map((group) => (
            <div key={group.group} className="mb-3">
              <p className="px-3 mb-1 text-[9px] font-semibold tracking-wider text-[var(--pub-muted-3)] uppercase">{group.group}</p>
              {group.items.map((item) => {
                const Icon = icons[item.icon];
                const key = item.href as TabKey;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => setTab(key)}
                    className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] transition-colors ${
                      tab === key ? 'bg-cyan-400/10 text-cyan-400 font-medium' : 'text-[var(--pub-muted)] hover:bg-white/5 light:hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={14} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Konten kanan */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 light:border-gray-100 shrink-0">
            <h2 className="text-[13px] font-semibold text-[var(--pub-text)]">{CONTENT[tab].title}</h2>
            <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--pub-muted-2)] hover:bg-white/5 light:hover:bg-gray-100 hover:text-[var(--pub-text)] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 text-[13px]">
            {CONTENT[tab].render()}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}