import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Maverick Live · Productora de eventos',
  description:
    'Mucho más que eventos. En Maverick Live creamos experiencias únicas. Escríbenos y hagamos realidad tu próximo evento.',
  openGraph: {
    title: 'Maverick Live · Productora de eventos',
    description: 'Mucho más que eventos. Creamos experiencias únicas.',
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
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
