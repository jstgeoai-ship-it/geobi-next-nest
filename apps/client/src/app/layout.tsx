import type { Metadata } from 'next';
import Script from 'next/script';
import { QueryProvider } from '@/components/QueryProvider';
import { THEME_INIT_SCRIPT } from '@/lib/useTheme';
import './globals.css';

export const metadata: Metadata = {
  title: 'GeoBI',
  description: 'Dashboard PBB-P2 Vol. 2 (GEO BI)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
