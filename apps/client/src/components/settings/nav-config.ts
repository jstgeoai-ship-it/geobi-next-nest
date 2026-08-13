export type SettingsIconKey = 'gear' | 'monitor' | 'bell' | 'shield' | 'users' | 'plug' | 'database' | 'history';

export interface SettingsNavItem {
  href: string;
  label: string;
  desc: string;
  icon: SettingsIconKey;
}

export interface SettingsNavGroup {
  group: string;
  items: SettingsNavItem[];
}

export const SETTINGS_NAV: SettingsNavGroup[] = [
  {
    group: 'PENGATURAN',
    items: [
      { href: '/settings', label: 'Pengaturan Umum', desc: 'Kelola preferensi dasar aplikasi GeoBI.', icon: 'gear' },
      { href: '/settings/tampilan', label: 'Tampilan', desc: 'Sesuaikan tampilan aplikasi sesuai preferensi Anda.', icon: 'monitor' },
      { href: '/settings/notifikasi', label: 'Notifikasi', desc: 'Atur preferensi notifikasi yang ingin Anda terima.', icon: 'bell' },
    ],
  },
  {
    group: 'KEAMANAN',
    items: [
      { href: '/settings/keamanan', label: 'Keamanan', desc: 'Kelola keamanan akun dan akses aplikasi.', icon: 'shield' },
      { href: '/settings/manajemen-pengguna', label: 'Manajemen Pengguna', desc: 'Kelola pengguna dan hak akses aplikasi.', icon: 'users' },
    ],
  },
  {
    group: 'SISTEM',
    items: [
      { href: '/settings/integrasi', label: 'Integrasi', desc: 'Kelola integrasi dengan sistem eksternal.', icon: 'plug' },
      { href: '/settings/data-sinkronisasi', label: 'Data & Sinkronisasi', desc: 'Kelola sinkronisasi dan pembaruan data.', icon: 'database' },
      { href: '/settings/riwayat-aktivitas', label: 'Riwayat Aktivitas', desc: 'Lihat aktivitas terbaru pada akun Anda.', icon: 'history' },
    ],
  },
];

/** Cari nav-item yang cocok sama pathname aktif. /settings/tampilan/apapun tetap match 'Tampilan'. */
export function findActiveNavItem(pathname: string): SettingsNavItem | undefined {
  const all = SETTINGS_NAV.flatMap((g) => g.items);
  return (
    all.find((item) => item.href === pathname) ??
    all.find((item) => item.href !== '/settings' && pathname.startsWith(item.href))
  );
}