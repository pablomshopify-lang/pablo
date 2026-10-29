import Link from 'next/link';
import type { ReactNode } from 'react';
import { salir } from '@/app/acciones';
import Menu from '@/components/Menu';
import { ROLES } from '@/lib/datos';
import { sesion } from '@/lib/sesion';

export default async function LayoutPanel({
  children,
}: {
  children: ReactNode;
}) {
  const { perfil } = await sesion();
  return (
    <>
      <header className="barra">
        <div className="barra-in">
          <Link href="/" className="marca">
            MAVERICK MUSIC ENTERTAINMENT
          </Link>
          <Menu />
          <div className="yo">
            <Link href="/cuenta" title={ROLES[perfil.rol]}>
              {perfil.nombre}
            </Link>
            <form action={salir}>
              <button className="suave chico">Salir</button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
