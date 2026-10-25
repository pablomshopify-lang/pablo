import type { Metadata, Viewport } from 'next';
import { Inter, Unbounded } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Unbounded es una letra ancha y gratuita, muy parecida a Akira Expanded
// (la tipografía del manual). Si consigues la licencia de Akira, se cambia aquí.
const display = Unbounded({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mvck Music · Distribución musical',
  description:
    'Distribución musical boutique: conectamos tu música con el mundo con atención personal. Distribución digital, publishing, marketing, derechos digitales y regalías para artistas y sellos independientes.',
  openGraph: {
    title: 'Mvck Music · Distribución musical',
    description: 'Tu música, en todo el mundo.',
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
    <html lang="es" className={`${inter.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
