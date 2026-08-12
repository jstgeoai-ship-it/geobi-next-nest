'use client';

import { useEffect, useRef, useState } from 'react';

const BULAN_PANJANG = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const BULAN_PENDEK = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const DP_TAHUN_SEBELUM = 5;
const DP_TAHUN_SESUDAH = 6;

const pad2 = (n: number) => String(n).padStart(2, '0');
const dpISO = (y: number, m: number, d: number) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const dpHariIni = () => {
  const n = new Date();
  return dpISO(n.getFullYear(), n.getMonth(), n.getDate());
};
const dpTampil = (iso: string) => {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};

interface Props {
  value: string;
  onChange: (iso: string) => void;
  min?: string;
  max?: string;
  /** Explanatory text shown at the bottom of the popover when the calendar is locked (min/max set). */
  ket?: string;
  label: string;
  idPrefix: string;
}

/**
 * Hand-rolled calendar — ported from bikinDatePicker() in dashboard.blade.php.
 * Built because native <input type="date"> can only HIDE out-of-range years via
 * min/max, not show them greyed-out-but-visible the way "Periode Awal" needs
 * (locked to the active Tahun Pajak, but still showing neighboring years exist).
 */
export function LockedDatePicker({ value, onChange, min, max, ket, label, idPrefix }: Props) {
  const [open, setOpen] = useState(false);
  const [langkah, setLangkah] = useState<'hari' | 'tahun' | 'bulan'>('hari');
  const [lihat, setLihat] = useState(() => {
    const now = new Date();
    return { y: now.getFullYear(), m: now.getMonth() };
  });
  const rootRef = useRef<HTMLDivElement>(null);
  const yearsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick, true);
    return () => document.removeEventListener('click', onDocClick, true);
  }, []);

  const boleh = (iso: string) => (!min || iso >= min) && (!max || iso <= max);
  const singgung = (a: string, b: string) => !((max && a > max) || (min && b < min));
  const tahunBoleh = (y: number) => singgung(`${y}-01-01`, `${y}-12-31`);
  const bulanBoleh = (y: number, m: number) => {
    const lastDay = new Date(y, m + 1, 0).getDate();
    return singgung(dpISO(y, m, 1), dpISO(y, m, lastDay));
  };

  function buka() {
    setLangkah('hari');
    const acuan = value || min || '';
    if (acuan) setLihat({ y: +acuan.slice(0, 4), m: +acuan.slice(5, 7) - 1 });
    setOpen(true);
  }

  function setNilai(iso: string) {
    onChange(iso);
  }

  useEffect(() => {
    if (open && langkah !== 'hari' && yearsRef.current) {
      const active = yearsRef.current.querySelector<HTMLElement>('.dp-sel');
      if (active) yearsRef.current.scrollTop = active.offsetTop - (yearsRef.current.clientHeight - active.offsetHeight) / 2;
    }
  }, [open, langkah, lihat.y]);

  const kini = dpHariIni();
  const hariIniDisabled = !boleh(kini);

  const days: { iso: string; d: number; luar: boolean; disabled: boolean }[] = [];
  const awalKolom = new Date(lihat.y, lihat.m, 1).getDay();
  const jmlHari = new Date(lihat.y, lihat.m + 1, 0).getDate();
  const jmlSebelum = new Date(lihat.y, lihat.m, 0).getDate();
  for (let i = awalKolom; i > 0; i--) days.push({ iso: '', d: jmlSebelum - i + 1, luar: true, disabled: true });
  for (let d = 1; d <= jmlHari; d++) {
    const iso = dpISO(lihat.y, lihat.m, d);
    days.push({ iso, d, luar: false, disabled: !boleh(iso) });
  }

  const years: number[] = [];
  for (let y = lihat.y - DP_TAHUN_SEBELUM; y <= lihat.y + DP_TAHUN_SESUDAH; y++) years.push(y);

  return (
    <div className="wilayah-field" ref={rootRef}>
      <label className="wilayah-field-label">{label}</label>
      <button id={`${idPrefix}Trigger`} type="button" className="wilayah-select dp-trigger" aria-haspopup="dialog" aria-expanded={open} onClick={() => (open ? setOpen(false) : buka())}>
        <span className={value ? '' : 'dp-kosong'}>{value ? dpTampil(value) : 'dd/mm/yyyy'}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div className="dp-pop" role="dialog" aria-label={`Pilih ${label.toLowerCase()}`} onClick={(e) => e.stopPropagation()}>
          <div className="dp-head">
            <button
              type="button"
              className="dp-nav"
              aria-label="Bulan sebelumnya"
              onClick={() => {
                if (langkah === 'hari') {
                  let { y, m } = lihat;
                  m -= 1;
                  if (m < 0) { m = 11; y--; }
                  setLihat({ y, m });
                } else {
                  setLihat((s) => ({ ...s, y: s.y - 1 }));
                }
              }}
            >
              ‹
            </button>
            <button type="button" className="dp-title" aria-pressed={langkah !== 'hari'} onClick={() => setLangkah(langkah === 'hari' ? 'tahun' : 'hari')}>
              {langkah === 'hari' ? `${BULAN_PANJANG[lihat.m]} ${lihat.y}` : langkah === 'tahun' ? 'Pilih Tahun' : `Pilih Bulan ${lihat.y}`}
            </button>
            <button
              type="button"
              className="dp-nav"
              aria-label="Bulan berikutnya"
              onClick={() => {
                if (langkah === 'hari') {
                  let { y, m } = lihat;
                  m += 1;
                  if (m > 11) { m = 0; y++; }
                  setLihat({ y, m });
                } else {
                  setLihat((s) => ({ ...s, y: s.y + 1 }));
                }
              }}
            >
              ›
            </button>
          </div>

          {langkah === 'hari' ? (
            <div id={`${idPrefix}Hari`}>
              <div className="dp-dow"><span>Min</span><span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span></div>
              <div className="dp-grid">
                {days.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`dp-day${d.luar ? ' dp-luar' : ''}${d.iso === value ? ' dp-sel' : ''}`}
                    disabled={d.disabled}
                    onClick={() => d.iso && setNilai(d.iso)}
                  >
                    {d.d}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div id={`${idPrefix}YM`}>
              {langkah === 'tahun' && (
                <div className="dp-years" ref={yearsRef}>
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      className={`dp-year${y === lihat.y ? ' dp-sel' : ''}`}
                      disabled={!tahunBoleh(y)}
                      onClick={() => { setLihat((s) => ({ ...s, y })); setLangkah('bulan'); }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
              {langkah === 'bulan' && (
                <div className="dp-months">
                  {BULAN_PENDEK.map((nm, i) => (
                    <button
                      key={nm}
                      type="button"
                      className={`dp-month${i === lihat.m ? ' dp-sel' : ''}`}
                      disabled={!bulanBoleh(lihat.y, i)}
                      onClick={() => { setLihat((s) => ({ ...s, m: i })); setLangkah('hari'); }}
                    >
                      {nm}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="dp-aksi">
            <button type="button" className="dp-aksi-btn" disabled={!value} onClick={() => setNilai('')}>Clear</button>
            <button
              type="button"
              className="dp-aksi-btn dp-aksi-utama"
              disabled={hariIniDisabled}
              title={hariIniDisabled ? `${dpTampil(kini)} di luar tahun pajak yang dipilih` : `Pilih ${dpTampil(kini)}`}
              onClick={() => !hariIniDisabled && setNilai(kini)}
            >
              Today
            </button>
          </div>
          {ket && <div className="dp-kunci">{ket}</div>}
        </div>
      )}
    </div>
  );
}
