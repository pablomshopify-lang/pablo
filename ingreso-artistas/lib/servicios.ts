/**
 * Servicios del Holding MVCK y su procedimiento interno.
 *
 * Todo el sistema sale de esta lista: las casillas del formulario, las
 * preguntas extra de cada servicio, la lista de tareas que se crea en
 * Google Sheets y la página /procedimientos. Para cambiar un paso,
 * agregar una pregunta o sumar un servicio nuevo, se edita solo aquí.
 *
 * `dias` = cuántos días después del ingreso vence esa tarea.
 * `area` = departamento que se hace cargo (ver EQUIPO más abajo).
 */

/** Organigrama: quién responde por cada departamento. */
export const EQUIPO = {
  Dirección: 'Sebastián Biggio (CEO)',
  Creativo: 'Fran',
  'Ventas y Marketing': 'Pablo Moreno',
  Prensa: 'Kim Mujica',
  'Relaciones Públicas': 'Javiera Moreno',
} as const;

export type Area = keyof typeof EQUIPO;

/** Coordina todo el proceso y es el responsable si nadie más lo es. */
export const PROJECT_MANAGER = 'Pablo Moreno';

export type Pregunta = {
  id: string;
  label: string;
  tipo?: 'texto' | 'si-no' | 'opciones';
  opciones?: string[];
  ayuda?: string;
};

export type Tarea = {
  tarea: string;
  area: Area;
  dias: number;
};

export type Servicio = {
  id: string;
  nombre: string;
  resumen: string;
  color: string;
  preguntas: Pregunta[];
  /** Lo que el artista ve en la pantalla final: qué viene ahora. */
  queSigue: string;
  tareas: Tarea[];
};

export const SERVICIOS: Servicio[] = [
  {
    id: 'mvck-music',
    nombre: 'Mvck Music',
    resumen:
      'Distribución digital: tu música en Spotify, Apple Music, YouTube, TikTok y más.',
    color: '#00afd8',
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
    tareas: [
      {
        tarea: 'Revisar la solicitud y aprobar al artista',
        area: 'Dirección',
        dias: 2,
      },
      {
        tarea: 'Enviar contrato de distribución y recibirlo firmado',
        area: 'Dirección',
        dias: 5,
      },
      {
        tarea: 'Recibir masters (WAV 24-bit), portada 3000×3000 y metadatos',
        area: 'Ventas y Marketing',
        dias: 7,
      },
      {
        tarea: 'Asignar códigos ISRC y UPC',
        area: 'Ventas y Marketing',
        dias: 8,
      },
      {
        tarea:
          'Revisar metadatos y créditos según las guías de las plataformas',
        area: 'Ventas y Marketing',
        dias: 9,
      },
      {
        tarea: 'Subir el lanzamiento (mínimo 3 semanas antes de la fecha)',
        area: 'Ventas y Marketing',
        dias: 10,
      },
      {
        tarea:
          'Pedir perfil verificado en Spotify for Artists y Apple Music for Artists',
        area: 'Ventas y Marketing',
        dias: 12,
      },
      {
        tarea: 'Enviar pitch editorial a Spotify (mínimo 7 días antes)',
        area: 'Ventas y Marketing',
        dias: 14,
      },
      {
        tarea: 'Nota de prensa del lanzamiento a medios',
        area: 'Prensa',
        dias: 14,
      },
      {
        tarea:
          'Confirmar que salió en todas las plataformas y mandar los links al artista',
        area: 'Ventas y Marketing',
        dias: 30,
      },
      {
        tarea: 'Configurar reportes y pago de regalías',
        area: 'Dirección',
        dias: 35,
      },
    ],
  },
  {
    id: 'mvck-publishing',
    nombre: 'MVCK Publishing',
    resumen:
      'Editorial musical: registramos tus canciones y cobramos tus regalías de autor en el mundo.',
    color: '#f49d00',
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
    tareas: [
      {
        tarea: 'Revisar la solicitud y el catálogo del autor',
        area: 'Ventas y Marketing',
        dias: 2,
      },
      {
        tarea: 'Enviar contrato editorial y recibirlo firmado',
        area: 'Dirección',
        dias: 7,
      },
      {
        tarea: 'Recibir split sheets firmados (porcentajes por canción)',
        area: 'Ventas y Marketing',
        dias: 10,
      },
      {
        tarea: 'Reunir datos de cada autor: nombre legal, IPI/CAE y sociedad',
        area: 'Ventas y Marketing',
        dias: 10,
      },
      {
        tarea: 'Registrar las obras en SCD o la sociedad que corresponda',
        area: 'Ventas y Marketing',
        dias: 15,
      },
      {
        tarea: 'Registrar en The MLC (EE.UU.) y subeditores internacionales',
        area: 'Ventas y Marketing',
        dias: 20,
      },
      {
        tarea: 'Registrar en YouTube Content ID',
        area: 'Ventas y Marketing',
        dias: 20,
      },
      {
        tarea: 'Vincular los ISRC de las grabaciones con los ISWC de las obras',
        area: 'Ventas y Marketing',
        dias: 25,
      },
      {
        tarea: 'Configurar la liquidación de regalías',
        area: 'Dirección',
        dias: 30,
      },
    ],
  },
  {
    id: 'maverick-records',
    nombre: 'Maverick Records',
    resumen:
      'Sello discográfico: grabación, producción, lanzamiento y desarrollo de carrera.',
    color: '#ffffff',
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
    tareas: [
      {
        tarea: 'Escuchar demos y hacer evaluación A&R',
        area: 'Dirección',
        dias: 7,
      },
      {
        tarea: 'Reunión con el artista (y su manager)',
        area: 'Dirección',
        dias: 14,
      },
      {
        tarea: 'Preparar propuesta de contrato y negociar',
        area: 'Dirección',
        dias: 21,
      },
      { tarea: 'Firmar contrato discográfico', area: 'Dirección', dias: 30 },
      {
        tarea: 'Armar plan de lanzamiento: singles, fechas y presupuesto',
        area: 'Dirección',
        dias: 35,
      },
      {
        tarea: 'Producción, grabación, mezcla y master',
        area: 'Creativo',
        dias: 60,
      },
      {
        tarea: 'Arte y contenido: portada, fotos y video',
        area: 'Creativo',
        dias: 60,
      },
      {
        tarea: 'Plan de marketing y redes',
        area: 'Ventas y Marketing',
        dias: 65,
      },
      {
        tarea: 'Comunicado de prensa del fichaje y del lanzamiento',
        area: 'Prensa',
        dias: 65,
      },
      {
        tarea: 'Gestión de medios: entrevistas, radios y playlists',
        area: 'Prensa',
        dias: 75,
      },
      {
        tarea: 'Presentar al artista a la industria y buscar alianzas',
        area: 'Relaciones Públicas',
        dias: 75,
      },
      {
        tarea: 'Pasar el lanzamiento a distribución (Mvck Music)',
        area: 'Ventas y Marketing',
        dias: 70,
      },
    ],
  },
  {
    id: 'maverick-live',
    nombre: 'Maverick Live',
    resumen: 'Shows en vivo: booking, producción de eventos y giras.',
    color: '#e50041',
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
    tareas: [
      {
        tarea: 'Recibir rider técnico y de camarín',
        area: 'Creativo',
        dias: 5,
      },
      {
        tarea: 'Definir formato del show: duración, banda o DJ',
        area: 'Ventas y Marketing',
        dias: 7,
      },
      {
        tarea: 'Ficha de booking: fee, disponibilidad y ciudades',
        area: 'Ventas y Marketing',
        dias: 10,
      },
      {
        tarea: 'Firmar contrato de booking / representación',
        area: 'Dirección',
        dias: 14,
      },
      { tarea: 'Actualizar kit de prensa (EPK)', area: 'Creativo', dias: 14 },
      {
        tarea: 'Ofrecer el show a productoras, festivales y venues',
        area: 'Relaciones Públicas',
        dias: 21,
      },
      {
        tarea: 'Difundir los shows confirmados en medios',
        area: 'Prensa',
        dias: 28,
      },
      {
        tarea: 'Coordinar logística: viajes, hospedaje y transporte',
        area: 'Ventas y Marketing',
        dias: 30,
      },
      {
        tarea: 'Liquidación después de cada evento',
        area: 'Dirección',
        dias: 45,
      },
    ],
  },
];

export const servicioPorId = (id: string) => SERVICIOS.find((s) => s.id === id);
