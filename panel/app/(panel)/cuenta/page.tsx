import type { Metadata } from 'next';
import CambiarClave from '@/components/CambiarClave';
import { ROLES } from '@/lib/datos';
import { sesion } from '@/lib/sesion';

export const metadata: Metadata = { title: 'Mi cuenta' };

export default async function Cuenta() {
  const { perfil } = await sesion();
  return (
    <main className="wrap" style={{ maxWidth: '40rem' }}>
      <header className="cabeza">
        <div>
          <p className="eyebrow">
            {perfil.area} · {ROLES[perfil.rol]}
          </p>
          <h1>{perfil.nombre}</h1>
        </div>
      </header>
      <section className="card">
        <h2>Cambiar mi clave</h2>
        <p className="muted">{perfil.email}</p>
        <CambiarClave />
      </section>
    </main>
  );
}
