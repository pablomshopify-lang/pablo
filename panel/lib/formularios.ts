/**
 * Formularios de ingreso de artistas: uno por empresa, en /ingreso/<id>
 * (ej: /ingreso/mvck-music). Son públicos: el artista no necesita usuario.
 *
 * Aquí se cambian las preguntas y los textos que ve el artista. Las tareas
 * que se crean al inscribirse se cambian en el panel, en «Plazos».
 */

import { TIPOS_ARTISTA } from './datos';

export type Campo = {
  id: string;
  label: string;
  tipo?: 'text' | 'email' | 'tel' | 'url' | 'date' | 'textarea' | 'select';
  opciones?: string[];
  requerido?: boolean;
  placeholder?: string;
};

export const DATOS: Campo[] = [
  { id: 'nombre_artistico', label: 'Nombre artístico', requerido: true },
  { id: 'nombre_legal', label: 'Nombre legal completo', requerido: true },
  { id: 'documento', label: 'RUT / documento de identidad' },
  { id: 'nacimiento', label: 'Fecha de nacimiento', tipo: 'date' },
  { id: 'email', label: 'Correo', tipo: 'email', requerido: true },
  {
    id: 'telefono',
    label: 'Teléfono / WhatsApp',
    tipo: 'tel',
    requerido: true,
    placeholder: '+56 9 …',
  },
  { id: 'pais', label: 'País', requerido: true },
  { id: 'ciudad', label: 'Ciudad' },
  {
    id: 'tipo',
    label: 'Eres…',
    tipo: 'select',
    requerido: true,
    opciones: TIPOS_ARTISTA,
  },
  {
    id: 'genero',
    label: 'Género musical',
    requerido: true,
    placeholder: 'Urbano, pop, electrónica…',
  },
  { id: 'manager', label: 'Manager (nombre y contacto, si tienes)' },
  { id: 'bio', label: 'Cuéntanos de ti en pocas líneas', tipo: 'textarea' },
];

export const REDES_FORM: Campo[] = [
  { id: 'instagram', label: 'Instagram', placeholder: '@usuario' },
  { id: 'tiktok', label: 'TikTok', placeholder: '@usuario' },
  {
    id: 'spotify',
    label: 'Spotify (link de artista)',
    tipo: 'url',
    placeholder: 'https://open.spotify.com/artist/…',
  },
  { id: 'youtube', label: 'YouTube', tipo: 'url' },
  { id: 'apple_music', label: 'Apple Music', tipo: 'url' },
  { id: 'soundcloud', label: 'SoundCloud', tipo: 'url' },
  { id: 'x', label: 'X / Twitter', placeholder: '@usuario' },
  { id: 'facebook', label: 'Facebook', tipo: 'url' },
  { id: 'web', label: 'Página web', tipo: 'url' },
  { id: 'oyentes', label: 'Oyentes mensuales en Spotify (aprox.)' },
  {
    id: 'material',
    label: 'Link a tu material (fotos, EPK, música)',
    tipo: 'url',
    placeholder: 'Drive, Dropbox…',
  },
];

export type Pregunta = {
  id: string;
  label: string;
  tipo?: 'texto' | 'si-no' | 'opciones';
  opciones?: string[];
  ayuda?: string;
};

export type Formulario = {
  id: string;
  nombre: string;
  resumen: string;
  color: string;
  /** Color del texto sobre el color de la empresa (botones). */
  sobreColor: string;
  preguntas: Pregunta[];
  /** Lo que el artista ve en la pantalla final: qué viene ahora. */
  queSigue: string;
};

export const FORMULARIOS: Formulario[] = [
  {
    id: 'mvck-music',
    nombre: 'Mvck Music',
    resumen:
      'Distribución digital: tu música en Spotify, Apple Music, YouTube, TikTok y más.',
    color: '#00afd8',
    sobreColor: '#000',
    preguntas: [
      {
        id: 'distribuidora_actual',
        label: '¿Hoy distribuyes con alguien? ¿Con quién?',
        ayuda: 'Ej: DistroKid, ONErpm, ninguna…',
      },
      {
        id: 'proximo_lanzamiento',
        label: '¿Cuándo es tu próximo lanzamiento?',
      },
      {
        id: 'canciones',
        label: '¿Cuántas canciones quieres lanzar?',
        tipo: 'opciones',
        opciones: [
          '1 single',
          '2 a 5 (EP)',
          '6 o más (álbum)',
          'Catálogo ya publicado',
        ],
      },
    ],
    queSigue:
      'Te enviaremos el contrato de distribución y te pediremos los masters, la portada y los datos de cada canción.',
  },
  {
    id: 'mvck-publishing',
    nombre: 'MVCK Publishing',
    resumen:
      'Editorial musical: registramos tus canciones y cobramos tus regalías de autor en el mundo.',
    color: '#f49d00',
    sobreColor: '#000',
    preguntas: [
      {
        id: 'sociedad',
        label: '¿Estás inscrito en una sociedad de autores?',
        tipo: 'opciones',
        opciones: ['SCD (Chile)', 'Otra sociedad', 'No', 'No sé'],
      },
      { id: 'ipi', label: 'Tu número IPI / CAE (si lo sabes)' },
      { id: 'obras', label: '¿Cuántas canciones has escrito o coescrito?' },
    ],
    queSigue:
      'Te enviaremos el contrato editorial y una planilla para registrar tus canciones y los porcentajes de cada autor.',
  },
  {
    id: 'maverick-records',
    nombre: 'Maverick Records',
    resumen:
      'Sello discográfico: grabación, producción, lanzamiento y desarrollo de carrera.',
    color: '#ffffff',
    sobreColor: '#000',
    preguntas: [
      {
        id: 'demos',
        label: 'Link a tus demos o canciones nuevas',
        ayuda: 'Drive, Dropbox, SoundCloud privado…',
      },
      {
        id: 'busca',
        label: '¿Qué buscas de un sello?',
        ayuda: 'Producción, financiamiento, marketing, desarrollo…',
      },
      {
        id: 'contrato_vigente',
        label: '¿Tienes contrato vigente con otro sello?',
        tipo: 'si-no',
      },
    ],
    queSigue:
      'Nuestro equipo de A&R escuchará tu música. Si hay match, te contactamos para una reunión.',
  },
  {
    id: 'maverick-live',
    nombre: 'Maverick Live',
    resumen: 'Shows en vivo: booking, producción de eventos y giras.',
    color: '#e50041',
    sobreColor: '#fff',
    preguntas: [
      {
        id: 'formato',
        label: '¿Qué formato de show tienes?',
        tipo: 'opciones',
        opciones: [
          'Solista con pista',
          'Con banda',
          'DJ set',
          'Varios formatos',
        ],
      },
      { id: 'shows', label: '¿Cuántos shows hiciste el último año?' },
      { id: 'rider', label: '¿Tienes rider técnico?', tipo: 'si-no' },
    ],
    queSigue:
      'Te pediremos tu rider técnico y tu kit de prensa para empezar a ofrecer tu show.',
  },
];

export const formularioPorId = (id: string) =>
  FORMULARIOS.find((f) => f.id === id);
