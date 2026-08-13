'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@/lib/useAuthUser';
import { useTheme } from '@/lib/useTheme';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();
  const { theme } = useTheme();
  const [pembayaranOpen, setPembayaranOpen] = useState(false);
  const [penilaianOpen, setPenilaianOpen] = useState(false);
  const [pendataanOpen, setPendataanOpen] = useState(false);
  const [kepatuhanOpen, setKepatuhanOpen] = useState(false);
  const [piutangOpen, setPiutangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (prefix: string) => pathname === prefix || (prefix !== '/' && pathname?.startsWith(prefix));

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    router.push('/login');
  }

  const linkHref = (href: string) => (user ? href : '/login');
  // Kelas dasar untuk setiap trigger menu top-level (link biasa & dropdown button)

  const navItemClass = (active: boolean, hoverOpen = false) =>
  `flex items-center gap-1 px-2 rounded-lg text-[11px] font-medium transition-colors ${
    active ? 'text-orange-400 font-semibold' : 'text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] hover:bg-white/5 light:hover:bg-gray-900/5'
  } ${hoverOpen ? 'bg-white/5 light:bg-gray-900/5' : ''}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 light:bg-slate-100 backdrop-blur-md light:backdrop-blur-none light:shadow-sm">
      <div className="px-8 flex h-16 items-center justify-between">
        {/* Left side: Logo — pinned, never shrinks. Swaps to a dark-text variant in light
            mode since the "bapenda"/"jakarta" wordmark is baked white into the SVG. */}
        <div className="shrink-0">
          <Link href="/" className="flex items-center shrink-0">
            <Image src={theme === 'light' ? '/logo-bapenda2-light.svg' : '/logo-bapenda2.svg'} alt="Logo Bapenda" height={36} width={140} style={{ height: 36, width: 'auto' }} />
          </Link>
        </div>

        {/* Center: Menu items */}
        <div className="hidden md:flex items-center gap-4">
          {/* Home */}
          <Link href="/" className={navItemClass(isActive('/'), false)}>
           Home
          </Link>

          {/* GeoBI Pembayaran — its own dropdown links live under /katalog, not /pembayaran */}
          <div className="relative" onMouseEnter={() => setPembayaranOpen(true)} onMouseLeave={() => setPembayaranOpen(false)}>
            <button
              type="button"
              className={navItemClass(isActive('/katalog'), pembayaranOpen)}
            >
              GeoBI Pembayaran
              <svg className={`w-3 h-3 opacity-60 transition-transform duration-200 ${pembayaranOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {pembayaranOpen && (
              <div className="absolute left-0 top-full pt-2 z-50" style={{ minWidth: 260 }}>
                <div className="bg-slate-900 light:bg-slate-50 border border-white/10 light:border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                  <Link href={linkHref('/katalog/pbb-p2')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Peta Tematik Pembayaran PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Visualisasi distribusi pembayaran PBB-P2 per wilayah.</p>
                    </div>
                  </Link>

                  <div className="h-px bg-white/5 light:bg-gray-900/10 mx-4" />
                  <Link href={linkHref('/katalog/dashboard-pbb/v3')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.273 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Intelligence Dashboard Pembayaran PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Dashboard analitik untuk monitoring pembayaran PBB-P2.</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* GeoBI Penilaian */}
          <div className="relative" onMouseEnter={() => setPenilaianOpen(true)} onMouseLeave={() => setPenilaianOpen(false)}>
            <button
              type="button"
              className={navItemClass(isActive('/penilaian'), penilaianOpen)}
            >
              GeoBI Penilaian
              <svg className={`w-3 h-3 opacity-60 transition-transform duration-200 ${penilaianOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {penilaianOpen && (
              <div className="absolute left-0 top-full pt-2 z-50" style={{ minWidth: 260 }}>
                <div className="bg-slate-900 light:bg-slate-50 border border-white/10 light:border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                  <Link href={linkHref('/penilaian/peta-tematik')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Peta Tematik Penilaian PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Visualisasi hasil penilaian PBB-P2 per wilayah.</p>
                    </div>
                  </Link>

                  <div className="h-px bg-white/5 light:bg-gray-900/10 mx-4" />
                  <Link href={linkHref('/penilaian/intelligence-dashboard')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.273 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Intelligence Dashboard Penilaian PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Dashboard analitik untuk monitoring penilaian PBB-P2.</p>
                    </div>
                  </Link>

                  <div className="h-px bg-white/5 light:bg-gray-900/10 mx-4" />
                  <Link href={linkHref('/penilaian/3d-monitoring-njop')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Peta Tematik 3D Monitoring Penyesuaian NJOP Bumi</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Visualisasi 3D untuk monitoring penyesuaian NJOP bumi.</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* GeoBI Pendataan */}
          <div className="relative" onMouseEnter={() => setPendataanOpen(true)} onMouseLeave={() => setPendataanOpen(false)}>
            <button
              type="button"
              className={navItemClass(isActive('/pendataan'), pendataanOpen)}
            >
              GeoBI Pendataan
              <svg className={`w-3 h-3 opacity-60 transition-transform duration-200 ${pendataanOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {pendataanOpen && (
              <div className="absolute left-0 top-full pt-2 z-50" style={{ minWidth: 260 }}>
                <div className="bg-slate-900 light:bg-slate-50 border border-white/10 light:border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                  <Link href={linkHref('/pendataan/peta-tematik')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Peta Tematik Pendataan PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Visualisasi data pendataan PBB-P2 per wilayah.</p>
                    </div>
                  </Link>

                  <div className="h-px bg-white/5 light:bg-gray-900/10 mx-4" />
                  <Link href={linkHref('/pendataan/intelligence-dashboard')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.273 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Intelligence Dashboard Pendataan PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Dashboard analitik untuk monitoring pendataan PBB-P2.</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* GeoBI Kepatuhan */}
          <div className="relative" onMouseEnter={() => setKepatuhanOpen(true)} onMouseLeave={() => setKepatuhanOpen(false)}>
            <button
              type="button"
              className={navItemClass(isActive('/kepatuhan'), kepatuhanOpen)}
            >
              GeoBI Kepatuhan
              <svg className={`w-3 h-3 opacity-60 transition-transform duration-200 ${kepatuhanOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {kepatuhanOpen && (
              <div className="absolute left-0 top-full pt-2 z-50" style={{ minWidth: 260 }}>
                <div className="bg-slate-900 light:bg-slate-50 border border-white/10 light:border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                  <Link href={linkHref('/kepatuhan/peta-tematik')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Peta Tematik Kepatuhan PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Visualisasi tingkat kepatuhan pembayaran PBB-P2 per wilayah.</p>
                    </div>
                  </Link>

                  <div className="h-px bg-white/5 light:bg-gray-900/10 mx-4" />
                  <Link href={linkHref('/kepatuhan/intelligence-dashboard')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.273 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Intelligence Dashboard Kepatuhan PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Dashboard analitik untuk monitoring kepatuhan PBB-P2.</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* GeoBI Piutang */}
          <div className="relative" onMouseEnter={() => setPiutangOpen(true)} onMouseLeave={() => setPiutangOpen(false)}>
            <button
              type="button"
              className={navItemClass(isActive('/piutang'), piutangOpen)}
            >
              GeoBI Piutang
              <svg className={`w-3 h-3 opacity-60 transition-transform duration-200 ${piutangOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {piutangOpen && (
              <div className="absolute left-0 top-full pt-2 z-50" style={{ minWidth: 260 }}>
                <div className="bg-slate-900 light:bg-slate-50 border border-white/10 light:border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                  <Link href={linkHref('/piutang/peta-tematik')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Peta Tematik Piutang PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Visualisasi piutang PBB-P2 per wilayah.</p>
                    </div>
                  </Link>

                  <div className="h-px bg-white/5 light:bg-gray-900/10 mx-4" />
                  <Link href={linkHref('/piutang/intelligence-dashboard')} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                      <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.273 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-semibold text-[var(--pub-text)] light:text-[var(--pub-text)] group-hover:text-orange-400 transition-colors">Intelligence Dashboard Piutang PBB-P2</p>
                        {!user && (
                          <svg className="w-3.5 h-3.5 text-[var(--pub-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-[11px] leading-snug text-[var(--pub-muted-2)] light:text-[var(--pub-muted-2)] mt-0.5">Dashboard analitik untuk monitoring piutang PBB-P2.</p>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Tentang GeoBI */}
          <Link href="/tentang" className={navItemClass(isActive('/tentang'), false)}>
            Tentang GeoBI
          </Link>
        </div>

        {/* Right side: User info and login/logout — pinned, never shrinks */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              {/* Toggle tema — logic persis useTheme() yang sama dipakai di settings/tampilan,
                  cuma dibungkus jadi 1 tombol matahari/bulan di sini. */}
              <button
                type="button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                title={theme === 'light' ? 'Ganti ke mode gelap' : 'Ganti ke mode terang'}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[var(--pub-text)]/70 light:text-[var(--pub-muted-3)] hover:bg-white/5 light:hover:bg-gray-900/5 hover:text-[var(--pub-text)] transition-colors"
              >
                {theme === 'light' ? (
                  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4.5" />
                    <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                  </svg>
                ) : (
                  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
                  </svg>
                )}
              </button>

              {/* Notifikasi — badge & isinya statis/placeholder, belum ada endpoint notifikasi
                  di server, tinggal disambungin nanti kalau udah ada. */}
              <button
                type="button"
                title="Notifikasi"
                className="relative w-7 h-7 flex items-center justify-center rounded-full text-[var(--pub-text)]/70 light:text-[var(--pub-muted-3)] hover:bg-white/5 light:hover:bg-gray-900/5 hover:text-[var(--pub-text)] transition-colors"
              >
                <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6Z" />
                  <path d="M10 20a2 2 0 0 0 4 0" />
                </svg>
                <span className="absolute top-0 right-0 min-w-[13px] h-[13px] px-0.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center leading-none">2</span>
              </button>

              <div className="relative" onMouseEnter={() => setAccountOpen(true)} onMouseLeave={() => setAccountOpen(false)}>
                <button type="button" className="flex items-center gap-1.5 pl-1 pr-1 py-0.5 rounded-full hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors">
                  {/* Avatar inisial — belum ada URL foto profil di /api/auth/me, jadi fallback
                      inisial nama. Ganti <div> ini jadi <img src={user.avatarUrl}/> nanti kalau
                      field itu udah ada di response user. */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:flex flex-col items-start leading-tight">
                    <span className="text-[11px] font-medium text-[var(--pub-text)] whitespace-nowrap">{user.name}</span>
                    <span className="text-[9px] text-[var(--pub-muted-2)] light:text-[var(--pub-muted-3)]">Administrator</span>
                  </span>
                  <svg className={`w-2.5 h-2.5 opacity-60 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {accountOpen && (
                  <div className="absolute right-0 top-full pt-2 z-50" style={{ minWidth: 170 }}>
                    <div className="bg-slate-900 light:bg-slate-50 border border-white/10 light:border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                      <Link href="/profile" className="block px-4 py-2.5 text-xs text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:bg-white/5 light:hover:bg-gray-900/5 hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] transition-colors">
                        Profile
                      </Link>
                      <Link href="/settings" className="block px-4 py-2.5 text-xs text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:bg-white/5 light:hover:bg-gray-900/5 hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] transition-colors">
                        Settings
                      </Link>
                      <div className="h-px bg-white/5 light:bg-gray-900/10 mx-2" />
                      <button type="button" onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-400/10 transition-colors">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/register" className="text-xs px-3 py-2 rounded-lg border border-white/20 light:border-gray-300 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:bg-white/5 light:hover:bg-gray-900/5 transition-colors whitespace-nowrap">
                Daftar
              </Link>
              <Link href="/login" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap">
                Masuk
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
<button
  className="md:hidden text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] p-2"
  onClick={() => setMobileOpen((v) => !v)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-6 h-6"
  >
    {mobileOpen ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    )}
  </svg>
</button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 light:border-gray-200 bg-black/60 light:bg-slate-100/95 backdrop-blur-md px-6 py-4 flex flex-col gap-2 text-sm">
          <Link href="/" className={`py-2 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] ${pathname === '/' ? 'text-orange-400 font-semibold' : ''}`}>Home</Link>
          <Link href="/katalog" className={`py-2 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] ${isActive('/katalog') ? 'text-orange-400 font-semibold' : ''}`}>GeoBI Pembayaran</Link>
          <Link href="/penilaian" className={`py-2 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] ${isActive('/penilaian') ? 'text-orange-400 font-semibold' : ''}`}>GeoBI Penilaian</Link>
          <Link href="/pendataan" className={`py-2 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] ${isActive('/pendataan') ? 'text-orange-400 font-semibold' : ''}`}>GeoBI Pendataan</Link>
          <Link href="/kepatuhan" className={`py-2 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] ${isActive('/kepatuhan') ? 'text-orange-400 font-semibold' : ''}`}>GeoBI Kepatuhan</Link>
          <Link href="/piutang" className={`py-2 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] ${isActive('/piutang') ? 'text-orange-400 font-semibold' : ''}`}>GeoBI Piutang</Link>
          <Link href="/tentang" className={`py-2 text-[var(--pub-text)]/80 light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] ${isActive('/tentang') ? 'text-orange-400 font-semibold' : ''}`}>Tentang GeoBI</Link>
          <div className="border-t border-white/10 light:border-gray-200 pt-3 mt-1">
            {user ? (
              <>
                <Link href="/profile" className="block text-[var(--pub-muted-2)] light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] mb-2">{user.name}</Link>
                <Link href="/settings" className="block text-[var(--pub-muted-2)] light:text-[var(--pub-muted-3)] hover:text-[var(--pub-text)] light:hover:text-[var(--pub-text)] mb-2">Settings</Link>
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