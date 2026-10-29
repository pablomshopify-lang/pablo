import type { MetadataRoute } from 'next';

// Permite instalar el panel en el celular («Agregar a pantalla de inicio»):
// se abre como una app, sin la barra del navegador.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Maverick Music Entertainment · Panel',
    short_name: 'Panel MME',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    lang: 'es',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
