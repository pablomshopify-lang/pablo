import { NextResponse } from 'next/server';
import { REDES, hoy, sumarDias } from '@/lib/datos';
import type { Artista } from '@/lib/datos';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Recibe cada inscripción del formulario de ingreso de artistas
 * (carpeta ingreso-artistas). Si el artista ya existe (mismo correo), se usa
 * su misma ficha y solo se suma la empresa nueva: así hay una sola base para
 * todo el Holding. Al sumarlo a la empresa, la base crea sus tareas.
 *
 * Se protege con una clave: ?clave=… o el encabezado x-panel-clave, que debe
 * ser igual a PANEL_CLAVE_INGRESO en Vercel.
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

export async function POST(req: Request) {
  const clave = process.env.PANEL_CLAVE_INGRESO;
  const recibida =
    req.headers.get('x-panel-clave') ??
    new URL(req.url).searchParams.get('clave');
  if (!clave || recibida !== clave) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let ficha: Record<string, unknown>;
  try {
    ficha = JSON.parse(await req.text()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

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
    return NextResponse.json(
      { ok: false, error: 'faltan datos' },
      { status: 422 },
    );
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
      return NextResponse.json({ ok: false }, { status: 500 });
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

  return NextResponse.json({ ok: true, id: artistaId });
}
