'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { findActiveNavItem } from '@/components/settings/nav-config';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const active = findActiveNavItem(pathname);

  // Kenapa lewat Portal: kalau modal ini cuma di-render di tempat dia dipanggil (nested di
  // dalam tree halaman dashboard), position:fixed-nya bisa "rusak" — ke-containing sama
  // elemen leluhur mana pun yang punya transform/filter/backdrop-filter (dashboard ini
  // banyak, misal animasi panel/tooltip), jadi dia ngukur ukuran/posisi relatif ke elemen
  // itu, bukan ke viewport beneran. Portal nge-mount modal ini langsung sebagai child
  // document.body, di luar jangkauan CSS containment leluhur manapun.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function close() {
    if (window.history.length > 1) router.back();
    else router.push('/');
  }

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 light:bg-white rounded-2xl shadow-2xl border border-white/10 light:border-gray-200 flex overflow-hidden" style={{ height: 'min(85vh, 720px)' }}>
        <button
          type="button"
          onClick={close}
          aria-label="Tutup pengaturan"
          title="Tutup"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full text-[var(--pub-muted-2)] hover:bg-white/10 light:hover:bg-gray-100 hover:text-[var(--pub-text)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="w-56 shrink-0 border-r border-white/10 light:border-gray-200 overflow-y-auto p-4">
          <p className="px-2 mb-3 text-sm font-semibold text-[var(--pub-text)]">Settings</p>
          <SettingsSidebar />
        </div>

        <div className="flex-1 min-w-0 overflow-y-auto p-8">
          <header className="mb-6 pr-8">
            <h1 className="text-xl font-semibold text-[var(--pub-text)]">{active?.label ?? 'Settings'}</h1>
            <p className="mt-1 text-sm text-[var(--pub-muted-2)]">{active?.desc}</p>
          </header>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}