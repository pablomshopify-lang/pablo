import type { Metadata } from 'next';
import Login from '@/components/Login';

export const metadata: Metadata = { title: 'Entrar' };

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ volver?: string; error?: string }>;
}) {
  const { volver = '/', error } = await searchParams;
  return (
    <main className="login">
      <section className="card">
        <div>
          <p className="eyebrow">Maverick Music Entertainment</p>
          <h1>Panel central</h1>
        </div>
        <p className="muted">
          Artistas, contratos y tareas de Mvck Music, MVCK Publishing, Maverick
          Records y Maverick Live.
        </p>
        {error === 'inactivo' && (
          <p className="aviso error">
            Tu usuario todavía no está activo. Pídele a Pablo que te dé acceso
            desde «Equipo».
          </p>
        )}
        <Login volver={volver} />
        <p className="muted">
          <small>¿Olvidaste tu clave? Pídele a Pablo una clave nueva.</small>
        </p>
      </section>
    </main>
  );
}
