'use client';

import { useEffect } from 'react';
import { useTheme } from '@/lib/useTheme';

/** Was previously its own standalone toggle with a separate localStorage key ('theme') and a
 *  separate <html> class ('dark') from the rest of the app — meaning a choice made here never
 *  carried over to the Settings page or to the dashboards' theme-linked basemap switching, and
 *  vice versa. Now backed by the shared useTheme() hook (key 'geobi-theme', class 'light') so
 *  dark/light mode is one single source of truth everywhere. The 'dark' class toggle below is
 *  kept only so this page's existing `dark:` Tailwind classes keep rendering the same as before. */
export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme !== 'light';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  function toggle() {
    setTheme(dark ? 'light' : 'dark');
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggle}
        aria-label="Toggle dark mode"
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-white text-[var(--pub-muted-3)] hover:bg-slate-100 dark:bg-slate-800 dark:text-amber-400 dark:hover:bg-slate-700 transition-colors duration-300"
      >
        {dark ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.36 6.36l-1.06-1.06M6.7 6.7L5.64 5.64m12.72 0l-1.06 1.06M6.7 17.3l-1.06 1.06M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>
    </div>
  );
}
