'use client';

import { Navbar } from '@/components/Navbar';
import { useTheme } from '@/lib/useTheme';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-8 bg-slate-900 light:bg-slate-50 border border-white/10 light:border-gray-200 shadow-lg sm:rounded-xl">
      <div className="max-w-xl">{children}</div>
    </div>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-white light:text-gray-900">Appearance</h2>
        <p className="mt-1 text-sm text-slate-400 light:text-gray-600">Pilih tampilan yang kamu suka untuk seluruh halaman GeoBI.</p>
      </header>

      <div className="mt-6 flex gap-4">
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex-1 rounded-lg border p-4 text-left transition-colors ${
            theme === 'dark'
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-white/10 light:border-gray-200 hover:bg-white/5 light:hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white light:text-gray-900">Dark</span>
            {theme === 'dark' && <span className="text-cyan-400 text-xs">● Aktif</span>}
          </div>
          <div className="mt-3 h-14 rounded-md bg-slate-950 border border-white/10 flex items-center gap-1.5 px-2">
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span className="h-1.5 flex-1 rounded bg-slate-700" />
          </div>
          <p className="mt-2 text-xs text-slate-400 light:text-gray-500">Latar gelap, teks putih.</p>
        </button>

        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex-1 rounded-lg border p-4 text-left transition-colors ${
            theme === 'light'
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-white/10 light:border-gray-200 hover:bg-white/5 light:hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white light:text-gray-900">Light</span>
            {theme === 'light' && <span className="text-cyan-400 text-xs">● Aktif</span>}
          </div>
          <div className="mt-3 h-14 rounded-md bg-gray-100 border border-gray-300 flex items-center gap-1.5 px-2">
            <span className="w-2 h-2 rounded-full bg-gray-400" />
            <span className="h-1.5 flex-1 rounded bg-gray-300" />
          </div>
          <p className="mt-2 text-xs text-slate-400 light:text-gray-500">Latar abu muda/putih, teks hitam.</p>
        </button>
      </div>
    </section>
  );
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-black light:bg-slate-100 pt-16">
      <Navbar />
      <header className="bg-slate-900 light:bg-slate-50 border-b border-white/10 light:border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl text-cyan-400 leading-tight">Settings</h2>
        </div>
      </header>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Card><AppearanceSection /></Card>
        </div>
      </div>
    </div>
  );
}
