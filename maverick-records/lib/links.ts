/** Enlaces y datos de contacto. Cámbialos aquí y se actualizan en todo el sitio. */
export const LINKS = {
  // Correo provisorio: cámbialo cuando exista uno de Maverick Record.
  email: 'contact@maverickrecords.cl',
  instagram: 'https://www.instagram.com/maverickrecords_/',
  instagramHandle: '@maverickrecords_',
  mvckMusic: 'https://mvckmusic.com',
  mvckPublishing: 'https://www.mvckpublishing.com',
  maverickLive: 'https://maverick-live1.vercel.app',
} as const;

/** Abre el correo con el asunto ya escrito, para que enviar música sea un clic. */
export const DEMO_MAILTO = `mailto:${LINKS.email}?subject=${encodeURIComponent(
  'Música para Maverick Record',
)}`;
