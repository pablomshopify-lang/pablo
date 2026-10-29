import 'server-only';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { Empresa, Perfil } from './datos';
import { supabaseServidor } from './supabase/server';

/** Usuario que está usando el panel. Si no entró o está inactivo, al login. */
export const sesion = cache(async () => {
  const supabase = await supabaseServidor();
  const { data } = await supabase.auth.getClaims();
  const id = data?.claims.sub;
  if (!id) redirect('/login');

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('id, nombre, email, area, rol, activo')
    .eq('id', id)
    .maybeSingle<Perfil>();
  if (!perfil?.activo) redirect('/login?error=inactivo');

  return {
    supabase,
    perfil,
    esJefe: perfil.rol === 'admin' || perfil.rol === 'ceo',
    esCeo: perfil.rol === 'ceo',
  };
});

export const empresas = cache(async () => {
  const { supabase } = await sesion();
  const { data } = await supabase
    .from('empresas')
    .select('id, nombre, color, orden')
    .order('orden')
    .overrideTypes<Empresa[], { merge: false }>();
  return data ?? [];
});

export const equipo = cache(async () => {
  const { supabase } = await sesion();
  const { data } = await supabase
    .from('perfiles')
    .select('id, nombre, email, area, rol, activo')
    .order('nombre')
    .overrideTypes<Perfil[], { merge: false }>();
  return data ?? [];
});
