import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

// Archivo ensanchada para los títulos: recuerda al logotipo MAVERICK.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const description =
  'Holding de música y entretenimiento: sello, distribución, editorial, conciertos y ticketing bajo un mismo techo.';

export const metadata: Metadata = {
  title: 'Maverick Music Entertainment · Del talento al escenario',
  description,
  openGraph: {
    title: 'Maverick Music Entertainment',
    description,
    type: 'website',
    locale: 'es_CL',
  },
};

export const viewport: Viewport = {
  themeColor: '#07070a',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
