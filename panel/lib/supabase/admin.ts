import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseClaveSecreta, supabaseUrl } from './config';

/**
 * Cliente con la clave secreta: salta los permisos. Solo se usa en el
 * servidor para crear usuarios del equipo y para recibir el formulario de
 * ingreso de artistas.
 */
export const supabaseAdmin = () =>
  createClient(supabaseUrl(), supabaseClaveSecreta(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
