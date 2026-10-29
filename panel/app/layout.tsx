import type { Metadata, Viewport } from 'next';
import { Inter, Unbounded } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Unbounded: letra ancha gratuita, parecida a Akira Expanded (la del manual).
const display = Unbounded({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Panel · Maverick Music Entertainment',
    template: '%s · Maverick Music Entertainment',
  },
  description:
    'Panel interno de Maverick Music Entertainment: artistas, contratos y tareas.',
  robots: { index: false, follow: false },
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
