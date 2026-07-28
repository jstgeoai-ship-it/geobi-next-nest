'use client';

import { useCallback, useState } from 'react';
import { TOUR_STEPS } from '../lib/tour-steps';
import { useFiltersStore } from '../store/filters.store';

export function useTour() {
  const [active, setActive] = useState(false);
  const [idx, setIdx] = useState(0);
  const togglePanel = useFiltersStore((s) => s.togglePanel);
  const closeAllPanels = useFiltersStore((s) => s.closeAllPanels);

  const goto = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(i, TOUR_STEPS.length - 1));
      setIdx(clamped);
      closeAllPanels();
      const step = TOUR_STEPS[clamped];
      if (step.panel) togglePanel(step.panel);
    },
    [closeAllPanels, togglePanel],
  );

  const open = useCallback(() => {
    setActive(true);
    goto(0);
  }, [goto]);

  const close = useCallback(() => {
    setActive(false);
    closeAllPanels();
  }, [closeAllPanels]);

  const next = useCallback(() => {
    if (idx === TOUR_STEPS.length - 1) close();
    else goto(idx + 1);
  }, [idx, goto, close]);

  const prev = useCallback(() => goto(idx - 1), [idx, goto]);

  return { active, idx, step: TOUR_STEPS[idx], total: TOUR_STEPS.length, open, close, next, prev, goto };
}
