/** Campos del formulario. Para pedir un dato nuevo, se agrega aquí. */

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
    opciones: ['Solista', 'Banda / grupo', 'DJ', 'Productor/a', 'Compositor/a'],
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

export const REDES: Campo[] = [
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
