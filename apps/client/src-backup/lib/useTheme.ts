'use client';

import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
export const THEME_STORAGE_KEY = 'geobi-theme';

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
}

/** Persists to localStorage; the actual class-on-<html> flip for first paint happens in the
 *  beforeInteractive inline script in layout.tsx (see THEME_INIT_SCRIPT) so there's no flash
 *  of the wrong theme before React hydrates — this hook just keeps state in sync afterward. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }

  return { theme, setTheme };
}

/** Inline script text run via next/script strategy="beforeInteractive" — reads the stored
 *  theme and flips the <html> class before first paint/hydration. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;
