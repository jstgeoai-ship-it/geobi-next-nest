'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { SettingsSidebar } from '@/components/settings/SettingsSidebar';
import { findActiveNavItem } from '@/components/settings/nav-config';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = findActiveNavItem(pathname);

  return (
    <div className="min-h-screen bg-black light:bg-slate-100 pt-16">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <SettingsSidebar />
        <div className="flex-1 min-w-0">
          <header className="mb-6">
            <h1 className="text-xl font-semibold text-[var(--pub-text)]">{active?.label ?? 'Settings'}</h1>
            <p className="mt-1 text-sm text-[var(--pub-muted-2)]">{active?.desc}</p>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}