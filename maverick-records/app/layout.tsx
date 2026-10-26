import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

// Outfit es geométrica y redonda, como la letra de las piezas de Instagram del sello.
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maverick Records · Sello independiente',
  description:
    'Sello 100% independiente y disidente que valora la libertad creativa. Potenciamos las marcas de nuestros artistas para producir, distribuir y promocionar su música.',
  openGraph: {
    title: 'Maverick Records · Sello independiente',
    description: 'Independientes. Disidentes. Libres.',
    type: 'website',
    locale: 'es_CL',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
