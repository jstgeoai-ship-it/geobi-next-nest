'use client';

import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';
export const THEME_STORAGE_KEY = 'geobi-theme';

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('light', theme === 'light');
}

/** Module-level store shared by every useTheme() call in the app. Previously each component
 *  had its own useState, so changing the theme on the Settings page (or DarkModeToggle) only
 *  ever updated that component's local copy — the <html> class flipped instantly (CSS reacted
 *  fine), but every other component's `theme` value never changed, so effects that depend on
 *  `theme` (like the dashboard map's basemap-switch effect) never re-ran. This tiny pub/sub
 *  keeps one source of truth and notifies every mounted useTheme() instance on change. */
let currentTheme: Theme = 'dark';
const listeners = new Set<(t: Theme) => void>();

function setGlobalTheme(next: Theme) {
  currentTheme = next;
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
  listeners.forEach((l) => l(next));
}

/** Persists to localStorage; the actual class-on-<html> flip for first paint happens in the
 *  beforeInteractive inline script in layout.tsx (see THEME_INIT_SCRIPT) so there's no flash
 *  of the wrong theme before React hydrates — this hook just keeps state in sync afterward. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const initial: Theme = stored === 'light' ? 'light' : 'dark';
    currentTheme = initial;
    setThemeState(initial);
    applyTheme(initial);

    listeners.add(setThemeState);
    return () => {
      listeners.delete(setThemeState);
    };
  }, []);

  function setTheme(next: Theme) {
    setGlobalTheme(next);
  }

  return { theme, setTheme };
}

/** Inline script text run via next/script strategy="beforeInteractive" — reads the stored
 *  theme and flips the <html> class before first paint/hydration. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light')document.documentElement.classList.add('light');}catch(e){}})();`;
