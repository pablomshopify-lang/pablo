import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  supabaseClave,
  supabaseConfigurado,
  supabaseUrl,
} from '@/lib/supabase/config';

// Renueva la sesión en cada visita y manda al login a quien no entró.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Login, configuración y los formularios de ingreso de artistas.
  const publica =
    pathname === '/login' ||
    pathname === '/configurar' ||
    pathname.startsWith('/ingreso/');
  if (!supabaseConfigurado()) {
    return publica
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/configurar', request.url));
  }

  let respuesta = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl(), supabaseClave(), {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        for (const { name, value } of lista) request.cookies.set(name, value);
        respuesta = NextResponse.next({ request });
        for (const { name, value, options } of lista) {
          respuesta.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims && !publica) {
    const url = new URL('/login', request.url);
    if (pathname !== '/') url.searchParams.set('volver', pathname);
    return NextResponse.redirect(url);
  }
  return respuesta;
}

export const config = {
  // Todo menos archivos estáticos y el webhook del formulario de ingreso.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon|manifest.webmanifest|api/ingreso).*)',
  ],
};
