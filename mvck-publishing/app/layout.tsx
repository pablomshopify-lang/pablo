import type { Metadata, Viewport } from 'next';
import { Inter, Lora, Unbounded } from 'next/font/google';
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

// Lora cursiva recuerda la palabra "publishing" del logotipo.
const serif = Lora({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mvck Publishing · Editorial musical',
  description:
    'Editorial musical boutique: registramos tus canciones y cobramos tus regalías de comunicación pública, derechos mecánicos y del máster en todo el mundo.',
  openGraph: {
    title: 'Mvck Publishing · Editorial musical',
    description: 'Tus canciones generan dinero. Nosotros lo cobramos.',
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
    <html
      lang="es"
      className={`${inter.variable} ${display.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
