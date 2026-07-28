'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@/lib/useAuthUser';

const MENU_ITEMS = [
  {
    href: '/katalog/dashboard-pbb/v1',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    color: 'orange',
    title: 'Dashboard PBB-P2 Vol. 1',
    badge: 'GEO BI',
    desc: 'Ringkasan status pembayaran, tingkat kepatuhan, dan peta sebaran parsel.',
  },
  {
    href: '/katalog/dashboard-pbb',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    color: 'orange',
    title: 'Dashboard PBB-P2 Vol. 2',
    badge: 'GEO BI',
    desc: 'Analitik interaktif, chart distribusi, dan peta sebaran pajak.',
  },
  {
    href: '/katalog/dashboard-pbb/v3',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    color: 'orange',
    title: 'Dashboard PBB-P2 Vol. 3',
    badge: 'GEO BI',
    desc: 'Analitik interaktif, chart distribusi, dan peta sebaran pajak.',
  },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();
  const [katalogOpen, setKatalogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (prefix: string) => pathname === prefix || (prefix !== '/' && pathname?.startsWith(prefix));

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    router.push('/login');
  }

  const linkHref = (href: string) => (user ? href : '/login');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo-bapenda2.svg" alt="Logo Bapenda" height={36} width={140} style={{ height: 36, width: 'auto' }} />
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link href="/" className={`px-4 py-2 rounded-lg transition-colors ${isActive('/') && pathname === '/' ? 'text-orange-400 font-semibold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>
              Beranda
            </Link>

            <div className="relative" onMouseEnter={() => setKatalogOpen(true)} onMouseLeave={() => setKatalogOpen(false)}>
              <button
                type="button"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-colors ${isActive('/katalog') ? 'text-orange-400 font-semibold' : 'text-white/80 hover:text-white hover:bg-white/5'} ${katalogOpen ? 'bg-white/5' : ''}`}
              >
                Katalog
                <svg className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${katalogOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {katalogOpen && (
                <div className="absolute left-0 top-full pt-2 z-50" style={{ minWidth: 290 }}>
                  <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    {MENU_ITEMS.map((item, i) => (
                      <div key={item.href}>
                        <Link href={linkHref(item.href)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                          <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-[13px] font-semibold text-white group-hover:text-orange-400 transition-colors">{item.title}</p>
                              <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/25 px-1.5 py-0.5 rounded-full font-semibold">{item.badge}</span>
                              {!user && (
                                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                              )}
                            </div>
                            <p className="text-[11px] leading-snug text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                        </Link>
                        {i < MENU_ITEMS.length - 1 && <div className="h-px bg-white/5 mx-4" />}
                      </div>
                    ))}

                    <div className="h-px bg-white/5 mx-4" />
                    <Link href={linkHref('/katalog/pbb-p2')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold text-white group-hover:text-cyan-400 transition-colors">Katalog PBB-P2</p>
                          {!user && (
                            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-[11px] leading-snug text-slate-400 mt-0.5">Data geospasial PBB-P2 per wilayah kecamatan DKI Jakarta.</p>
                      </div>
                    </Link>

                    <div className="h-px bg-white/5 mx-4" />
                    <div className="flex items-center gap-3 px-4 py-2.5 opacity-35 cursor-not-allowed select-none">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold text-white">Katalog Pajak Daerah</p>
                          <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-full">Segera</span>
                        </div>
                        <p className="text-[11px] leading-snug text-slate-500 mt-0.5">Dashboard geospasial PBJT perhotelan, makanan, hiburan, parkir, reklame, dan air tanah.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/tentang" className={`px-4 py-2 rounded-lg transition-colors ${isActive('/tentang') ? 'text-orange-400 font-semibold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>
              Tentang
            </Link>
            <Link href="/struktur" className={`px-4 py-2 rounded-lg transition-colors ${isActive('/struktur') ? 'text-orange-400 font-semibold' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>
              Struktur
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-400">{user.name}</span>
                <button onClick={handleLogout} className="text-sm px-4 py-2 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="text-sm px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:bg-white/5 transition-colors">
                  Daftar
                </Link>
                <Link href="/login" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
                  Masuk
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-white/80 p-2" onClick={() => setMobileOpen((v) => !v)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/60 backdrop-blur-md px-6 py-4 flex flex-col gap-2 text-sm">
          <Link href="/" className={`py-2 text-white/80 hover:text-white ${pathname === '/' ? 'text-orange-400 font-semibold' : ''}`}>Beranda</Link>
          <Link href="/katalog" className={`py-2 text-white/80 hover:text-white ${isActive('/katalog') ? 'text-orange-400 font-semibold' : ''}`}>Katalog</Link>
          <Link href="/tentang" className={`py-2 text-white/80 hover:text-white ${isActive('/tentang') ? 'text-orange-400 font-semibold' : ''}`}>Tentang</Link>
          <Link href="/struktur" className={`py-2 text-white/80 hover:text-white ${isActive('/struktur') ? 'text-orange-400 font-semibold' : ''}`}>Struktur</Link>
          <div className="border-t border-white/10 pt-3 mt-1">
            {user ? (
              <>
                <span className="block text-slate-400 mb-2">{user.name}</span>
                <button onClick={handleLogout} className="text-red-400">Logout</button>
              </>
            ) : (
              <Link href="/login" className="text-orange-400 font-semibold">Masuk</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
