'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  AREAS,
  ESTADOS_ARTISTA,
  ESTADOS_CONTRATO,
  ESTADOS_EN_EMPRESA,
  ESTADOS_TAREA,
  ROLES,
  TIPO_CONTRATO,
} from '@/lib/datos';
import { sesion } from '@/lib/sesion';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { supabaseServidor } from '@/lib/supabase/server';

const texto = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === 'string' ? v.trim().slice(0, 4000) : '';
};
const opcional = (f: FormData, k: string) => texto(f, k) || null;
const numero = (f: FormData, k: string) => {
  const v = Number(texto(f, k));
  return texto(f, k) && Number.isFinite(v) ? v : null;
};
const deLista = <T extends string>(lista: readonly T[], v: string) =>
  (lista as readonly string[]).includes(v) ? (v as T) : null;

/** Vuelve a la página con un mensaje de error arriba. */
const fallar = (ruta: string, mensaje: string): never =>
  redirect(
    `${ruta}${ruta.includes('?') ? '&' : '?'}error=${encodeURIComponent(mensaje)}`,
  );

const listo = (...rutas: string[]) => {
  for (const r of rutas) revalidatePath(r);
};

// ---------- Entrar y salir ----------

export async function entrar(_: string | null, f: FormData) {
  const supabase = await supabaseServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: texto(f, 'email'),
    password: texto(f, 'clave'),
  });
  if (error) return 'Correo o clave incorrectos.';
  const volver = texto(f, 'volver');
  redirect(volver.startsWith('/') && !volver.startsWith('//') ? volver : '/');
}

export async function salir() {
  const supabase = await supabaseServidor();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function cambiarClave(_: string | null, f: FormData) {
  const { supabase } = await sesion();
  const clave = texto(f, 'clave');
  if (clave.length < 8) return 'La clave debe tener al menos 8 caracteres.';
  if (clave !== texto(f, 'repetir')) return 'Las dos claves no coinciden.';
  const { error } = await supabase.auth.updateUser({ password: clave });
  return error ? 'No se pudo cambiar la clave.' : 'ok';
}

// ---------- Artistas ----------

const camposArtista = (f: FormData) => ({
  nombre_artistico: texto(f, 'nombre_artistico'),
  nombre_legal: opcional(f, 'nombre_legal'),
  documento: opcional(f, 'documento'),
  nacimiento: opcional(f, 'nacimiento'),
  email: opcional(f, 'email')?.toLowerCase() ?? null,
  telefono: opcional(f, 'telefono'),
  pais: opcional(f, 'pais'),
  ciudad: opcional(f, 'ciudad'),
  tipo: opcional(f, 'tipo'),
  genero: opcional(f, 'genero'),
  manager: opcional(f, 'manager'),
  bio: opcional(f, 'bio'),
  redes: Object.fromEntries(
    [...f.keys()]
      .filter((k) => k.startsWith('red_') && texto(f, k))
      .map((k) => [k.slice(4), texto(f, k)]),
  ),
});

export async function crearArtista(f: FormData) {
  const { supabase } = await sesion();
  const datos = camposArtista(f);
  if (!datos.nombre_artistico)
    fallar('/artistas/nuevo', 'Falta el nombre artístico.');
  const empresas = f.getAll('empresas').map(String);
  if (!empresas.length)
    fallar('/artistas/nuevo', 'Elige al menos una empresa.');

  const { data, error } = await supabase
    .from('artistas')
    .insert({
      ...datos,
      estado: 'En proceso',
      regalias_meses:
        numero(f, 'regalias_meses') ?? (await regaliasPorDefecto()),
    })
    .select('id')
    .single<{ id: string }>();
  if (error || !data) {
    fallar(
      '/artistas/nuevo',
      error?.code === '23505'
        ? 'Ya existe un artista con ese correo. Búscalo en la lista y súmalo a la empresa.'
        : 'No se pudo guardar el artista.',
    );
    return;
  }

  // Al sumarlo a cada empresa, la base crea sola las tareas del procedimiento.
  await supabase
    .from('artista_empresas')
    .insert(
      empresas.map((empresa_id) => ({ artista_id: data.id, empresa_id })),
    );
  listo('/', '/artistas', '/tareas');
  redirect(`/artistas/${data.id}`);
}

export async function editarArtista(f: FormData) {
  const { supabase } = await sesion();
  const id = texto(f, 'id');
  const ruta = `/artistas/${id}`;
  const datos = camposArtista(f);
  if (!datos.nombre_artistico) fallar(ruta, 'Falta el nombre artístico.');
  const { error } = await supabase
    .from('artistas')
    .update({
      ...datos,
      estado: deLista(ESTADOS_ARTISTA, texto(f, 'estado')) ?? 'En proceso',
      regalias_meses: numero(f, 'regalias_meses') ?? 3,
      comentarios: opcional(f, 'comentarios'),
    })
    .eq('id', id);
  if (error) fallar(ruta, 'No se pudieron guardar los cambios.');
  listo('/artistas', ruta);
  redirect(ruta);
}

export async function borrarArtista(f: FormData) {
  const { supabase, esJefe } = await sesion();
  const id = texto(f, 'id');
  if (!esJefe)
    fallar(`/artistas/${id}`, 'Solo admin o CEO pueden borrar artistas.');
  await supabase.from('artistas').delete().eq('id', id);
  listo('/', '/artistas', '/tareas', '/contratos');
  redirect('/artistas');
}

export async function sumarEmpresa(f: FormData) {
  const { supabase } = await sesion();
  const artista_id = texto(f, 'artista_id');
  const { error } = await supabase
    .from('artista_empresas')
    .insert({ artista_id, empresa_id: texto(f, 'empresa_id') });
  if (error) fallar(`/artistas/${artista_id}`, 'Ya trabaja con esa empresa.');
  listo('/', '/tareas', `/artistas/${artista_id}`);
}

export async function estadoEnEmpresa(f: FormData) {
  const { supabase } = await sesion();
  const artista_id = texto(f, 'artista_id');
  const estado = deLista(ESTADOS_EN_EMPRESA, texto(f, 'estado'));
  if (!estado) return;
  await supabase
    .from('artista_empresas')
    .update({ estado })
    .eq('artista_id', artista_id)
    .eq('empresa_id', texto(f, 'empresa_id'));
  listo('/artistas', `/artistas/${artista_id}`);
}

export async function agregarNota(f: FormData) {
  const { supabase } = await sesion();
  const artista_id = texto(f, 'artista_id');
  const nota = texto(f, 'texto');
  if (nota) await supabase.from('notas').insert({ artista_id, texto: nota });
  listo(`/artistas/${artista_id}`);
}

// ---------- Tareas ----------

export async function estadoTarea(f: FormData) {
  const { supabase } = await sesion();
  const estado = deLista(ESTADOS_TAREA, texto(f, 'estado'));
  if (!estado) return;
  await supabase.from('tareas').update({ estado }).eq('id', texto(f, 'id'));
  listo('/', '/tareas', `/artistas/${texto(f, 'artista_id')}`);
}

export async function editarTarea(f: FormData) {
  const { supabase } = await sesion();
  await supabase
    .from('tareas')
    .update({
      vence: opcional(f, 'vence'),
      responsable_id: opcional(f, 'responsable_id'),
      area: deLista(AREAS, texto(f, 'area')) ?? 'Ventas y Marketing',
    })
    .eq('id', texto(f, 'id'));
  listo('/', '/tareas', `/artistas/${texto(f, 'artista_id')}`);
}

export async function crearTarea(f: FormData) {
  const { supabase } = await sesion();
  const artista_id = texto(f, 'artista_id');
  const titulo = texto(f, 'titulo');
  if (!titulo) return;
  await supabase.from('tareas').insert({
    artista_id,
    titulo,
    empresa_id: opcional(f, 'empresa_id'),
    area: deLista(AREAS, texto(f, 'area')) ?? 'Ventas y Marketing',
    vence: opcional(f, 'vence'),
  });
  listo('/', '/tareas', `/artistas/${artista_id}`);
}

export async function borrarTarea(f: FormData) {
  const { supabase, esJefe } = await sesion();
  if (!esJefe) return;
  await supabase.from('tareas').delete().eq('id', texto(f, 'id'));
  listo('/', '/tareas', `/artistas/${texto(f, 'artista_id')}`);
}

// ---------- Contratos ----------

const camposContrato = (f: FormData) => ({
  tipo: texto(f, 'tipo') || TIPO_CONTRATO[texto(f, 'empresa_id')] || 'Contrato',
  estado: deLista(ESTADOS_CONTRATO, texto(f, 'estado')) ?? 'Borrador',
  inicio: opcional(f, 'inicio'),
  fin: opcional(f, 'fin'),
  regalias_meses: numero(f, 'regalias_meses'),
  porcentaje_artista: numero(f, 'porcentaje_artista'),
  documento_url: opcional(f, 'documento_url'),
  notas: opcional(f, 'notas'),
});

const errorContrato = (mensaje: string) =>
  mensaje.includes('CEO')
    ? 'Solo el CEO puede marcar un contrato como firmado.'
    : 'No se pudo guardar el contrato.';

export async function crearContrato(f: FormData) {
  const { supabase } = await sesion();
  const artista_id = texto(f, 'artista_id');
  const ruta = `/artistas/${artista_id}`;
  const { error } = await supabase.from('contratos').insert({
    artista_id,
    empresa_id: texto(f, 'empresa_id'),
    ...camposContrato(f),
  });
  if (error) fallar(ruta, errorContrato(error.message));
  listo('/', '/contratos', ruta);
  redirect(`${ruta}#contratos`);
}

export async function editarContrato(f: FormData) {
  const { supabase } = await sesion();
  const volver = texto(f, 'volver') || '/contratos';
  const { error } = await supabase
    .from('contratos')
    .update({ empresa_id: texto(f, 'empresa_id'), ...camposContrato(f) })
    .eq('id', texto(f, 'id'));
  if (error) fallar(volver, errorContrato(error.message));
  listo('/', '/contratos', `/artistas/${texto(f, 'artista_id')}`);
  redirect(volver);
}

export async function firmarContrato(f: FormData) {
  const { supabase, esCeo } = await sesion();
  if (!esCeo) fallar('/contratos', 'Solo el CEO puede firmar contratos.');
  const { error } = await supabase
    .from('contratos')
    .update({ estado: 'Firmado' })
    .eq('id', texto(f, 'id'));
  if (error) fallar('/contratos', errorContrato(error.message));
  listo('/', '/contratos', `/artistas/${texto(f, 'artista_id')}`);
}

export async function borrarContrato(f: FormData) {
  const { supabase, esJefe } = await sesion();
  if (!esJefe) return;
  await supabase.from('contratos').delete().eq('id', texto(f, 'id'));
  listo('/', '/contratos', `/artistas/${texto(f, 'artista_id')}`);
}

// ---------- Ajustes: plazos y regalías ----------

async function regaliasPorDefecto() {
  const { supabase } = await sesion();
  const { data } = await supabase
    .from('configuracion')
    .select('valor')
    .eq('clave', 'regalias_meses')
    .maybeSingle<{ valor: string }>();
  return Number(data?.valor) || 3;
}

export async function guardarPlazos(f: FormData) {
  const { supabase, esJefe } = await sesion();
  if (!esJefe)
    fallar('/ajustes', 'Solo admin o CEO pueden cambiar los plazos.');
  const ids = f.getAll('id').map(String);
  for (const id of ids) {
    await supabase
      .from('plantillas_tareas')
      .update({
        tarea: texto(f, `tarea_${id}`),
        area: deLista(AREAS, texto(f, `area_${id}`)) ?? 'Ventas y Marketing',
        dias: Math.max(0, numero(f, `dias_${id}`) ?? 0),
      })
      .eq('id', Number(id));
  }
  listo('/ajustes');
  redirect(`/ajustes?ok=1#${texto(f, 'empresa_id')}`);
}

export async function agregarPaso(f: FormData) {
  const { supabase, esJefe } = await sesion();
  if (!esJefe) return;
  const empresa_id = texto(f, 'empresa_id');
  const tarea = texto(f, 'tarea');
  if (!tarea) return;
  const { data } = await supabase
    .from('plantillas_tareas')
    .select('paso')
    .eq('empresa_id', empresa_id)
    .order('paso', { ascending: false })
    .limit(1)
    .maybeSingle<{ paso: number }>();
  await supabase.from('plantillas_tareas').insert({
    empresa_id,
    paso: (data?.paso ?? 0) + 1,
    tarea,
    area: deLista(AREAS, texto(f, 'area')) ?? 'Ventas y Marketing',
    dias: Math.max(0, numero(f, 'dias') ?? 7),
  });
  listo('/ajustes');
}

export async function borrarPaso(f: FormData) {
  const { supabase, esJefe } = await sesion();
  if (!esJefe) return;
  await supabase
    .from('plantillas_tareas')
    .delete()
    .eq('id', Number(texto(f, 'id')));
  listo('/ajustes');
}

export async function guardarRegalias(f: FormData) {
  const { supabase, esJefe } = await sesion();
  const meses = numero(f, 'regalias_meses');
  if (!esJefe || !meses || meses < 1 || meses > 24) {
    fallar('/ajustes', 'Elige entre 1 y 24 meses.');
  }
  await supabase
    .from('configuracion')
    .update({ valor: String(meses) })
    .eq('clave', 'regalias_meses');
  listo('/ajustes');
  redirect('/ajustes?ok=1');
}

// ---------- Equipo: usuarios del panel ----------

export async function crearMiembro(f: FormData) {
  const { esJefe } = await sesion();
  if (!esJefe) fallar('/equipo', 'Solo admin o CEO pueden sumar personas.');
  const email = texto(f, 'email').toLowerCase();
  const clave = texto(f, 'clave');
  const nombre = texto(f, 'nombre');
  if (!email || !nombre) fallar('/equipo', 'Faltan el nombre o el correo.');
  if (clave.length < 8)
    fallar('/equipo', 'La clave temporal debe tener al menos 8 caracteres.');

  const admin = supabaseAdmin();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: clave,
    email_confirm: true,
    user_metadata: { nombre },
  });
  if (error || !data.user) {
    fallar(
      '/equipo',
      error?.message.includes('already')
        ? 'Ese correo ya tiene usuario.'
        : 'No se pudo crear el usuario.',
    );
    return;
  }
  await admin
    .from('perfiles')
    .update({
      nombre,
      area: deLista(AREAS, texto(f, 'area')) ?? 'Ventas y Marketing',
      rol: deLista(Object.keys(ROLES), texto(f, 'rol')) ?? 'equipo',
      activo: true,
    })
    .eq('id', data.user.id);
  listo('/equipo');
  redirect('/equipo?ok=1');
}

export async function editarMiembro(f: FormData) {
  const { esJefe, perfil } = await sesion();
  if (!esJefe) fallar('/equipo', 'Solo admin o CEO pueden editar el equipo.');
  const id = texto(f, 'id');
  const activo = texto(f, 'activo') === 'si';
  if (id === perfil.id && !activo)
    fallar('/equipo', 'No puedes desactivarte a ti mismo.');

  const admin = supabaseAdmin();
  await admin
    .from('perfiles')
    .update({
      nombre: texto(f, 'nombre'),
      area: deLista(AREAS, texto(f, 'area')) ?? 'Ventas y Marketing',
      rol:
        id === perfil.id
          ? perfil.rol
          : (deLista(Object.keys(ROLES), texto(f, 'rol')) ?? 'equipo'),
      activo,
    })
    .eq('id', id);

  const clave = texto(f, 'clave');
  if (clave && clave.length < 8)
    fallar('/equipo', 'La clave nueva debe tener al menos 8 caracteres.');
  // Desactivar también cierra la puerta en Supabase (no puede volver a entrar).
  await admin.auth.admin.updateUserById(id, {
    ...(clave ? { password: clave } : {}),
    ban_duration: activo ? 'none' : '876000h',
  });
  listo('/equipo');
  redirect('/equipo?ok=1');
}

export async function eliminarMiembro(f: FormData) {
  const { esJefe, perfil } = await sesion();
  if (!esJefe) fallar('/equipo', 'Solo admin o CEO pueden eliminar usuarios.');
  const id = texto(f, 'id');
  if (id === perfil.id) fallar('/equipo', 'No puedes eliminarte a ti mismo.');

  // Borra el usuario de Supabase; su perfil se borra solo. Sus tareas, notas
  // y contratos quedan, sin autor.
  const { error } = await supabaseAdmin().auth.admin.deleteUser(id);
  if (error) fallar('/equipo', 'No se pudo eliminar el usuario.');
  listo('/equipo');
  redirect('/equipo?ok=1');
}
