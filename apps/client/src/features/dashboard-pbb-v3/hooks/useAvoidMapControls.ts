'use client';

import { useEffect, useState } from 'react';

const GAP = 14;
const FALLBACK_RIGHT = 90;
const FALLBACK_LEFT = 10;
const FALLBACK_BOTTOM = 20;
/** How long to keep re-measuring every frame after something toggles (e.g. the basemap
 *  swatches or the sidebar expanding) — must cover that widget's own transition, staggered
 *  delay included (basemap: .14s delay + .32s width ≈ .46s; sidebar: .28s), so the chart
 *  panel's edge tracks its actual current width live instead of jumping straight from the
 *  old value to the new one. */
const TRACK_MS = 550;

/** Measures how much of the map's left/right edges are actually covered right now — the
 *  sidebar (which overlays the map rather than resizing it, see #sidebar) on the left, and
 *  the filter icon strip + MapLibre's bottom-right controls (incl. the basemap swatch widget
 *  specifically, since its own width changes when expanded) on the right — so a floating
 *  panel can clear both instead of guessing fixed pixel margins that only happen to work on
 *  one screen and one sidebar/basemap-picker state. `bottom` is a small fixed gap, not
 *  measured: every one of the right-side controls lives in that same narrow column, so once
 *  `right` clears it sideways no stack height on the right can ever overlap the panel
 *  vertically. */
export function useAvoidMapControls(containerSelector: string) {
  const [offsets, setOffsets] = useState({ left: FALLBACK_LEFT, right: FALLBACK_RIGHT });

  useEffect(() => {
    const containerEl = document.querySelector(containerSelector) as HTMLElement | null;
    const sidebarEl = document.getElementById('sidebar');
    if (!containerEl) return;

    function measure() {
      const containerRect = containerEl!.getBoundingClientRect();

      let left = FALLBACK_LEFT;
      if (sidebarEl) {
        const r = sidebarEl.getBoundingClientRect();
        if (r.width > 0) left = Math.max(FALLBACK_LEFT, Math.round(r.right - containerRect.left + GAP));
      }

      let right = FALLBACK_RIGHT;
      const rightCandidates = [
        document.querySelector('.maplibregl-ctrl-bottom-right'),
        document.querySelector('.bm-ctrl'),
        document.getElementById('panel-float'),
      ] as (HTMLElement | null)[];
      for (const el of rightCandidates) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.width > 0) right = Math.max(right, Math.round(containerRect.right - r.left + GAP));
      }

      setOffsets((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
    }

    let rafId: number | null = null;
    function trackForAWhile() {
      const start = performance.now();
      const tick = (now: number) => {
        measure();
        if (now - start < TRACK_MS) rafId = requestAnimationFrame(tick);
      };
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    }

    trackForAWhile();
    const resizeObserver = new ResizeObserver(trackForAWhile);
    resizeObserver.observe(containerEl);
    if (sidebarEl) resizeObserver.observe(sidebarEl);
    // Class/style toggles (basemap swatches, sidebar collapse) only flip a class — the actual
    // width animates via CSS, so a single re-measure on the mutation would just capture the
    // pre-transition value; trackForAWhile() keeps sampling through the whole transition.
    const mutationObserver = new MutationObserver(trackForAWhile);
    mutationObserver.observe(containerEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    if (sidebarEl) mutationObserver.observe(sidebarEl, { attributes: true, attributeFilter: ['class', 'style'] });
    window.addEventListener('resize', trackForAWhile);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', trackForAWhile);
    };
  }, [containerSelector]);

  return { bottom: FALLBACK_BOTTOM, left: offsets.left, right: offsets.right };
}
