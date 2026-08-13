import Image from 'next/image';
import { DarkModeToggle } from '@/components/DarkModeToggle';

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-slate-950 text-[var(--pub-text)] dark:text-[var(--pub-text)] transition-colors duration-300">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-map.png" alt="" fill className="object-cover" priority />
        </div>
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/70 transition-colors duration-300" />

        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="text-center max-w-5xl px-6">
            <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5">
              <span className="text-cyan-400 text-xs md:text-sm">● BAPENDA DKI Jakarta • Platform Geospasial</span>
            </div>

            <div className="mt-8">
              <Image src="/logo-bapenda.png" alt="Logo Bapenda" width={200} height={128} className="h-32 w-auto mx-auto" />
            </div>

            <h1 className="mt-8 text-3xl md:text-4xl font-bold leading-tight text-[var(--pub-text)] dark:text-[var(--pub-text)] transition-colors duration-300">
              SmartMap Geospatial Business Intelligence
              <br />
              <span className="text-cyan-400">Jakarta SmartTax</span>
            </h1>

            <p className="mt-6 text-lg md:text-2xl text-[var(--pub-muted-2)] dark:text-[var(--pub-muted)] transition-colors duration-300">
              Akses data geospasial perpajakan daerah Provinsi DKI Jakarta
            </p>
          </div>
        </div>
      </section>

      <DarkModeToggle />
    </div>
  );
}
