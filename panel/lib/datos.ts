/**
 * Listas fijas del panel. Deben coincidir con los «check» de
 * supabase/schema.sql: si agregas un valor aquí, agrégalo también allá.
 */

export const AREAS = [
  'Dirección',
  'Creativo',
  'Ventas y Marketing',
  'Prensa',
  'Relaciones Públicas',
] as const;
export type Area = (typeof AREAS)[number];

export const ROLES = {
  admin: 'Admin (project manager)',
  ceo: 'CEO (firma contratos)',
  equipo: 'Equipo',
} as const;
export type Rol = keyof typeof ROLES;

export const ESTADOS_ARTISTA = [
  'Nuevo',
  'En proceso',
  'Activo',
  'Pausado',
  'Descartado',
] as const;

export const ESTADOS_EN_EMPRESA = [
  'En proceso',
  'Activo',
  'Pausado',
  'Terminado',
] as const;

export const ESTADOS_TAREA = ['Pendiente', 'En curso', 'Hecha'] as const;

export const ESTADOS_CONTRATO = [
  'Borrador',
  'Enviado al artista',
  'Firmado',
  'Vencido',
  'Terminado',
] as const;

/** Tipo de contrato sugerido para cada empresa. */
export const TIPO_CONTRATO: Record<string, string> = {
  'mvck-music': 'Distribución',
  'mvck-publishing': 'Editorial',
  'maverick-records': 'Discográfico',
  'maverick-live': 'Booking / representación',
};

export type Empresa = {
  id: string;
  nombre: string;
  color: string;
  orden: number;
};

export type Perfil = {
  id: string;
  nombre: string;
  email: string;
  area: Area;
  rol: Rol;
  activo: boolean;
};

export type Artista = {
  id: string;
  codigo: string | null;
  nombre_artistico: string;
  nombre_legal: string | null;
  documento: string | null;
  nacimiento: string | null;
  email: string | null;
  telefono: string | null;
  pais: string | null;
  ciudad: string | null;
  tipo: string | null;
  genero: string | null;
  manager: string | null;
  bio: string | null;
  redes: Record<string, string>;
  comentarios: string | null;
  estado: (typeof ESTADOS_ARTISTA)[number];
  regalias_meses: number;
  origen: string;
  creado_en: string;
};

export type ArtistaEmpresa = {
  artista_id: string;
  empresa_id: string;
  estado: (typeof ESTADOS_EN_EMPRESA)[number];
  respuestas: Record<string, string>;
  desde: string;
};

export type Tarea = {
  id: string;
  artista_id: string;
  empresa_id: string | null;
  paso: number | null;
  titulo: string;
  area: Area;
  responsable_id: string | null;
  vence: string | null;
  estado: (typeof ESTADOS_TAREA)[number];
  hecha_en: string | null;
};

export type Contrato = {
  id: string;
  artista_id: string;
  empresa_id: string;
  tipo: string;
  estado: (typeof ESTADOS_CONTRATO)[number];
  inicio: string | null;
  fin: string | null;
  regalias_meses: number | null;
  porcentaje_artista: number | null;
  documento_url: string | null;
  notas: string | null;
  firmado_por: string | null;
  firmado_en: string | null;
};

export type Plantilla = {
  id: number;
  empresa_id: string;
  paso: number;
  tarea: string;
  area: Area;
  dias: number;
};

export type Nota = {
  id: string;
  artista_id: string;
  autor_id: string | null;
  texto: string;
  creado_en: string;
};

/** Fecha de hoy en Chile, como AAAA-MM-DD. */
export const hoy = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Santiago' });

export const sumarDias = (fecha: string, dias: number) => {
  const d = new Date(`${fecha}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
};

/** «12 nov», o «12 nov 2027» si no es este año. */
export const fechaCorta = (fecha: string | null) => {
  if (!fecha) return '—';
  const f = fecha.slice(0, 10);
  return new Date(`${f}T12:00:00Z`).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: f.slice(0, 4) === hoy().slice(0, 4) ? undefined : 'numeric',
    timeZone: 'UTC',
  });
};

/**
 * Próxima liquidación de regalías: desde el inicio del contrato, cada
 * `meses` meses, la primera fecha que todavía no pasó.
 */
export const proximaLiquidacion = (inicio: string, meses: number) => {
  const d = new Date(`${inicio}T12:00:00Z`);
  const limite = hoy();
  for (let i = 0; i < 400; i++) {
    d.setUTCMonth(d.getUTCMonth() + meses);
    const f = d.toISOString().slice(0, 10);
    if (f >= limite) return f;
  }
  return null;
};

/** Redes y links del artista (las mismas que pide el formulario de ingreso). */
export const REDES: { id: string; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'spotify', label: 'Spotify' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'apple_music', label: 'Apple Music' },
  { id: 'soundcloud', label: 'SoundCloud' },
  { id: 'x', label: 'X / Twitter' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'web', label: 'Página web' },
  { id: 'oyentes', label: 'Oyentes mensuales' },
  { id: 'material', label: 'Material (fotos, EPK)' },
];

export const TIPOS_ARTISTA = [
  'Solista',
  'Banda / grupo',
  'DJ',
  'Productor/a',
  'Compositor/a',
];

/** Campos de la ficha que son texto (para formularios y listas de datos). */
export type CampoTexto = {
  [K in keyof Artista]-?: Artista[K] extends string | null ? K : never;
}[keyof Artista];
