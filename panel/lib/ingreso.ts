import 'server-only';
import { REDES, hoy, sumarDias } from '@/lib/datos';
import type { Artista } from '@/lib/datos';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Guarda una inscripción (del formulario /ingreso/… o del webhook
 * /api/ingreso). Si el artista ya existe (mismo correo), se usa su misma
 * ficha y solo se suma la empresa nueva: así hay una sola base para todas las
 * empresas. Al sumarlo a la empresa, la base crea sus tareas.
 */

const CAMPOS = [
  'nombre_artistico',
  'nombre_legal',
  'documento',
  'nacimiento',
  'telefono',
  'pais',
  'ciudad',
  'tipo',
  'genero',
  'manager',
  'bio',
] as const;

const limpiar = (v: unknown) =>
  (typeof v === 'string' ? v : '').trim().slice(0, 4000);

export type Resultado = { ok: true; id: string } | { ok: false; error: string };

export async function guardarFicha(
  ficha: Record<string, unknown>,
): Promise<Resultado> {
  const db = supabaseAdmin();
  const { data: empresas } = await db
    .from('empresas')
    .select('id, nombre')
    .overrideTypes<{ id: string; nombre: string }[], { merge: false }>();
  const buscar = (v: string) =>
    empresas?.find(
      (e) => e.id === v || e.nombre.toLowerCase() === v.toLowerCase(),
    );
  const empresa = buscar(limpiar(ficha.empresa));
  const nombre = limpiar(ficha.nombre_artistico);
  if (!empresa || !nombre) {
    return { ok: false, error: 'faltan datos' };
  }

  const datos: Partial<Artista> = {};
  for (const c of CAMPOS) {
    const v = limpiar(ficha[c]);
    if (v) datos[c] = v;
  }
  const redesFicha = (ficha.redes ?? {}) as Record<string, unknown>;
  const redes = Object.fromEntries(
    REDES.map((r) => [r.id, limpiar(redesFicha[r.id])]).filter(([, v]) => v),
  ) as Record<string, string>;
  const email = limpiar(ficha.email).toLowerCase();

  // ¿Ya existe? (mismo correo) → completar lo que falte, sin pisar lo editado.
  const { data: existente } = email
    ? await db
        .from('artistas')
        .select('*')
        .eq('email', email)
        .maybeSingle<Artista>()
    : { data: null };

  let artistaId: string;
  if (existente) {
    artistaId = existente.id;
    const faltantes = Object.fromEntries(
      Object.entries(datos).filter(([k]) => !existente[k as keyof Artista]),
    );
    await db
      .from('artistas')
      .update({ ...faltantes, redes: { ...redes, ...existente.redes } })
      .eq('id', artistaId);
  } else {
    const { data: config } = await db
      .from('configuracion')
      .select('valor')
      .eq('clave', 'regalias_meses')
      .maybeSingle<{ valor: string }>();
    const { data: nuevo, error } = await db
      .from('artistas')
      .insert({
        ...datos,
        nombre_artistico: nombre,
        email: email || null,
        redes,
        codigo: limpiar(ficha.id) || null,
        comentarios: limpiar(ficha.comentarios) || null,
        origen: 'Formulario de ingreso',
        regalias_meses: Number(config?.valor) || 3,
      })
      .select('id')
      .single<{ id: string }>();
    if (error || !nuevo) {
      return { ok: false, error: 'no se pudo guardar' };
    }
    artistaId = nuevo.id;
  }

  const respuestas = (ficha.respuestas ?? {}) as Record<string, string>;
  const { data: vinculo } = await db
    .from('artista_empresas')
    .select('empresa_id')
    .eq('artista_id', artistaId)
    .eq('empresa_id', empresa.id)
    .maybeSingle();
  if (vinculo) {
    await db
      .from('artista_empresas')
      .update({ respuestas })
      .eq('artista_id', artistaId)
      .eq('empresa_id', empresa.id);
  } else {
    await db
      .from('artista_empresas')
      .insert({ artista_id: artistaId, empresa_id: empresa.id, respuestas });
  }

  // Otras empresas que le interesan: una tarea para derivar la ficha.
  const intereses = limpiar(ficha.intereses)
    .split(',')
    .map((s) => buscar(s.trim()))
    .filter((e) => e && e.id !== empresa.id);
  if (intereses.length) {
    await db.from('tareas').insert(
      intereses.map((e) => ({
        artista_id: artistaId,
        empresa_id: empresa.id,
        titulo: `Derivar la ficha a ${e?.nombre} (le interesa)`,
        area: 'Ventas y Marketing',
        vence: sumarDias(hoy(), 3),
      })),
    );
  }

  await db.from('notas').insert({
    artista_id: artistaId,
    autor_id: null,
    texto: [
      `Se inscribió por el formulario de ${empresa.nombre}${existente ? ' (ya estaba en la base)' : ''}.`,
      limpiar(ficha.comentarios) &&
        `Comentarios: ${limpiar(ficha.comentarios)}`,
    ]
      .filter(Boolean)
      .join('\n'),
  });

  return { ok: true, id: artistaId };
}
