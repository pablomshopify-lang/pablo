// Variables de entorno de Supabase. Se aceptan los nombres antiguos (anon /
// service_role) y los nuevos (publishable / secret).

const leer = (...nombres: string[]) => {
  for (const n of nombres) {
    const v = process.env[n];
    if (v) return v;
  }
  throw new Error(`Falta la variable de entorno ${nombres[0]}`);
};

export const supabaseUrl = () =>
  leer('NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');

export const supabaseClave = () =>
  leer(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_ANON_KEY',
  );

export const supabaseClaveSecreta = () =>
  leer('SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_SECRET_KEY');

export const supabaseConfigurado = () =>
  Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL) &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.SUPABASE_ANON_KEY),
  );
