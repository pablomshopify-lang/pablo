import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseClave, supabaseUrl } from './config';

/** Cliente con la sesión del usuario: respeta los permisos de cada rol. */
export async function supabaseServidor() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl(), supabaseClave(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (lista) => {
        try {
          for (const { name, value, options } of lista) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // En una página (no en una acción) no se pueden escribir cookies;
          // proxy.ts ya renueva la sesión en cada visita.
        }
      },
    },
  });
}
