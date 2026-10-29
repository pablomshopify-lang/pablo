import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Falta conectar Supabase' };

// Se muestra solo mientras no estén las claves de Supabase en Vercel.
export default function Configurar() {
  return (
    <main className="login">
      <section className="card">
        <h1>Falta un paso</h1>
        <p className="muted">
          El panel está publicado, pero todavía no está conectado a su base de
          datos.
        </p>
        <ol className="pasos-guia">
          <li>
            En Vercel abre este proyecto → <strong>Settings</strong> →{' '}
            <strong>Environment Variables</strong>.
          </li>
          <li>
            Agrega <code>NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> y{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> (están en Supabase → Project
            Settings → API).
          </li>
          <li>
            Pulsa <strong>Redeploy</strong>.
          </li>
        </ol>
        <p className="muted">
          <small>La guía completa está en el README del panel.</small>
        </p>
      </section>
    </main>
  );
}
