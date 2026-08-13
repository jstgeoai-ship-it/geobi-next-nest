'use client';

/** Small inline SVG icon set for the redesigned KPI/gauge cards. Deliberately not pulling in
 *  an icon library (lucide-react etc.) — these six are all we need, and it keeps this a
 *  drop-in patch that doesn't require `pnpm install` for a new dependency. Stroke-based,
 *  1.75px, currentColor — matches the mockup's line-icon style and inherits whatever color
 *  is set on the wrapping element. */

type IconProps = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function WalletIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4" />
      <path d="M17 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
      <path d="M14 13h6v3h-6a1.5 1.5 0 0 1 0-3Z" />
    </svg>
  );
}

export function DocumentIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 15.5h6M9 8.5h2" />
    </svg>
  );
}

export function HourglassIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 3h12M6 21h12" />
      <path d="M7 3c0 4 3.2 5.5 5 6.7V10c1.8-1.2 5-2.7 5-6.7" />
      <path d="M7 21c0-4 3.2-5.5 5-6.7v-.6c1.8 1.2 5 2.7 5 6.7" />
    </svg>
  );
}

export function BuildingIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 21V6a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v15" />
      <path d="M13 21V10a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v11" />
      <path d="M7 8.5h1M7 12h1M7 15.5h1M17 13h1M17 16.5h1" />
      <path d="M4 21h16" />
    </svg>
  );
}

export function CheckCircleIcon({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.3 2.3L15.5 10" />
    </svg>
  );
}

export function ClockAlertIcon({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function ReceiptZeroIcon({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  );
}

export function BanIcon({ size = 15, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m5.6 5.6 12.8 12.8" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 10, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ArrowDownIcon({ size = 10, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  );
}

export function MoreVerticalIcon({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size)} className={className} fill="currentColor" stroke="none">
      <circle cx="12" cy="5" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="12" cy="19" r="1.6" />
    </svg>
  );
}

export function DownloadIcon({ size = 13, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 4v11M7.5 11 12 15.5 16.5 11" />
      <path d="M5 19h14" />
    </svg>
  );
}

export function LayersIcon({ size = 18, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16.5 9 5 9-5" />
    </svg>
  );
}

export function TrendUpIcon({ size = 12, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  );
}

/** Baris siluet gedung dekoratif buat background kartu "Total SPPT/Objek" — murni hiasan,
 *  ngikutin currentColor jadi otomatis pas sama tema kartu yang makenya (opacity diatur lewat
 *  className/CSS wrapper, bukan di sini). */
export function CityIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 70" className={className} preserveAspectRatio="xMaxYMax slice" fill="currentColor">
      <rect x="6" y="30" width="20" height="40" rx="1.5" />
      <rect x="30" y="14" width="24" height="56" rx="1.5" />
      <rect x="58" y="38" width="18" height="32" rx="1.5" />
      <rect x="80" y="4" width="26" height="66" rx="1.5" />
      <rect x="110" y="24" width="20" height="46" rx="1.5" />
      <rect x="134" y="42" width="22" height="28" rx="1.5" />
      <rect x="160" y="18" width="24" height="52" rx="1.5" />
    </svg>
  );
}
