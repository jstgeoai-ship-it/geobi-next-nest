import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/components/QueryProvider';
import { THEME_INIT_SCRIPT } from '@/lib/useTheme';
import './globals.css';

const fontBody = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SmartMap Geospatial Business Intelligence',
  description: 'Dashboard PBB-P2 Vol. 2 (GEO BI)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={fontBody.variable}>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}