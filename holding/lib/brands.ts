/**
 * Las cinco marcas del holding. Textos tomados de la presentación corporativa.
 * Para cambiar un enlace, un texto o un color, edítalo aquí y se actualiza en
 * todo el sitio (tarjetas, ciclo del artista, contacto y pie de página).
 */
export type BrandId = 'records' | 'music' | 'publishing' | 'live' | 'ticket';

export type Brand = {
  id: BrandId;
  name: string;
  /** Actividad, como en la presentación ("01 · Sello"). */
  category: string;
  /** Frase corta de la tarjeta. */
  tagline: string;
  description: string;
  /** Color de la marca. */
  accent: string;
  /** Sitio web. Sin enlace, la tarjeta dice "Próximamente". */
  url?: string;
  email?: string;
};

export const BRANDS: readonly Brand[] = [
  {
    id: 'records',
    name: 'Maverick Record',
    category: 'Sello',
    tagline: 'Descubre y desarrolla talento.',
    description:
      'Sello dedicado a identificar y desarrollar talento musical, ofreciendo a los artistas un ecosistema creativo y profesional para lanzar proyectos con calidad y alcance global.',
    accent: '#e10082',
    url: 'https://www.maverickrecord.com',
    email: 'contact@maverickrecords.cl',
  },
  {
    id: 'music',
    name: 'Mvck Music',
    category: 'Distribución',
    tagline: 'Lleva la música a todas las plataformas.',
    description:
      'Distribución de música digital con un servicio integral que combina tecnología, marketing y publicidad para maximizar el alcance y los ingresos de artistas y sellos.',
    accent: '#00afd8',
    url: 'https://mvckmusic.com',
    email: 'contact@mvckmusic.com',
  },
  {
    id: 'publishing',
    name: 'MVCK Publishing',
    category: 'Editorial',
    tagline: 'Protege y cobra los derechos de autor.',
    description:
      'Administramos y protegemos los derechos de autor de los artistas, con una gestión eficiente que maximiza sus regalías en todas las plataformas y mercados.',
    accent: '#f49d00',
    url: 'https://www.mvckpublishing.com',
    email: 'contact@mvckpublishing.com',
  },
  {
    id: 'live',
    name: 'Maverick Live',
    category: 'Conciertos',
    tagline: 'Produce shows, giras y festivales.',
    description:
      'Diseñamos y producimos eventos en vivo que conectan a los artistas con su audiencia: booking, conciertos, giras, festivales y tour management.',
    accent: '#e50041',
    url: 'https://maverick-live1.vercel.app',
    email: 'contact@mavericklive.cl',
  },
  {
    id: 'ticket',
    name: 'Mavs Ticket',
    category: 'Ticketing',
    tagline: 'Vende las entradas de cada evento.',
    description:
      'Plataforma eficiente y accesible para comprar y gestionar boletos: una experiencia fácil y confiable para el público, y un canal rentable para los eventos.',
    accent: '#eb7a00',
  },
];

/** Datos del holding. */
export const HOLDING = {
  legalName: 'Maverick Music Entertainment LLC',
  // Correo de la firma de Sebastián. Cámbialo si el holding tiene uno general.
  email: 'sebastian@mvck-entertainment.com',
} as const;

/** Abre el correo con el asunto ya escrito. */
export function mailto(email: string, subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
