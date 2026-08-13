'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SETTINGS_NAV } from './nav-config';
import { SETTINGS_ICON_MAP, LifeBuoyIcon } from './icons';

export function SettingsSidebar() {
  const pathname = usePathname();
  const icons = SETTINGS_ICON_MAP();

  return (
    <aside className="w-56 shrink-0 space-y-6">
      {SETTINGS_NAV.map((group) => (
        <div key={group.group}>
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-[var(--pub-muted-3)] uppercase">{group.group}</p>
          <nav className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = icons[item.icon];
              const active = item.href === pathname || (item.href !== '/settings' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? 'bg-cyan-400/10 text-cyan-400 font-medium'
                      : 'text-[var(--pub-muted)] hover:bg-white/5 light:hover:bg-gray-100 hover:text-[var(--pub-text)]'
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      <div className="rounded-xl border border-white/10 light:border-gray-200 bg-slate-900 light:bg-white p-4">
        <div className="flex items-center gap-2 text-cyan-400 mb-1">
          <LifeBuoyIcon size={16} />
          <p className="text-sm font-semibold text-[var(--pub-text)]">Butuh bantuan?</p>
        </div>
        <p className="text-xs text-[var(--pub-muted-2)] mb-2">Hubungi tim support kami</p>
        <a href="mailto:support@bapenda.jakarta.go.id" className="text-xs font-medium text-cyan-400 hover:underline">
          Hubungi Support →
        </a>
      </div>
    </aside>
  );
}