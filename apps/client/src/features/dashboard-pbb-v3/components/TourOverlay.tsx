'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { TOUR_STEPS } from '../lib/tour-steps';
import type { useTour } from '../hooks/useTour';

/**
 * Port of the #tour-hole / #tour-box guided-tour overlay in dashboard.blade.php (v2 only).
 * Rendered via a portal straight to <body> — these are viewport-fixed overlay elements,
 * not part of the dashboard's layout, so they must never sit inside the flex tree that
 * lays out the sidebar/map (nesting them there caused a real layout shift bug during
 * development: toggling their visibility perturbed sibling flex sizing).
 */
export function TourOverlay({ tour }: { tour: ReturnType<typeof useTour> }) {
  const holeRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  function position() {
    const hole = holeRef.current;
    const box = boxRef.current;
    if (!hole || !box) return;
    const step = TOUR_STEPS[tour.idx];
    const node = step.el ? document.querySelector<HTMLElement>(step.el) : null;

    if (!node) {
      hole.style.display = 'none';
      box.style.left = Math.round((window.innerWidth - box.offsetWidth) / 2) + 'px';
      box.style.top = Math.round((window.innerHeight - box.offsetHeight) / 2) + 'px';
      return;
    }

    if (node.closest('#sidebar')) node.scrollIntoView({ block: 'center' });

    const pad = 6;
    const r = node.getBoundingClientRect();
    hole.style.display = 'block';
    hole.style.top = r.top - pad + 'px';
    hole.style.left = r.left - pad + 'px';
    hole.style.width = r.width + pad * 2 + 'px';
    hole.style.height = r.height + pad * 2 + 'px';

    const bw = box.offsetWidth;
    const bh = box.offsetHeight;
    const gap = 14;
    const tepi = 8;
    let left: number;
    if (r.right + gap + bw <= window.innerWidth - tepi) left = r.right + gap;
    else if (r.left - gap - bw >= tepi) left = r.left - gap - bw;
    else left = Math.min(Math.max(tepi, r.left), window.innerWidth - bw - tepi);

    let top = r.top + r.height / 2 - bh / 2;
    top = Math.min(Math.max(tepi, top), window.innerHeight - bh - tepi);

    box.style.left = Math.round(left) + 'px';
    box.style.top = Math.round(top) + 'px';
  }

  useEffect(() => {
    if (!tour.active) {
      if (holeRef.current) holeRef.current.style.display = 'none';
      return;
    }
    requestAnimationFrame(position);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.active, tour.idx]);

  useEffect(() => {
    if (!tour.active) return;
    const onResize = () => position();
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tour.close();
      if (e.key === 'ArrowRight') tour.next();
      if (e.key === 'ArrowLeft') tour.prev();
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.active, tour.idx]);

  if (!mounted) return null;

  const step = TOUR_STEPS[tour.idx];
  const dots = '●'.repeat(tour.idx + 1) + '○'.repeat(tour.total - tour.idx - 1);

  return createPortal(
    <>
      <div id="tour-hole" ref={holeRef} />
      <div
        id="tour-box"
        ref={boxRef}
        style={{ display: tour.active ? 'block' : 'none' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button id="tour-close" type="button" title="Tutup panduan" onClick={tour.close}>✕</button>
        <div className="t-step">{`Langkah ${tour.idx + 1} dari ${tour.total}`}</div>
        <div className="t-title">{step.title}</div>
        <div className="t-desc" dangerouslySetInnerHTML={{ __html: step.desc }} />
        <div className="t-foot">
          <span className="t-dots">{dots}</span>
          <span className="t-btns">
            <button id="tour-prev" type="button" onClick={tour.prev} disabled={tour.idx === 0}>← Kembali</button>
            <button id="tour-next" type="button" className="t-primary" onClick={tour.next}>
              {tour.idx === tour.total - 1 ? 'Selesai' : 'Lanjut →'}
            </button>
          </span>
        </div>
      </div>
    </>,
    document.body,
  );
}
