'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', texto: 'Inicio' },
  { href: '/artistas', texto: 'Artistas' },
  { href: '/tareas', texto: 'Tareas' },
  { href: '/contratos', texto: 'Contratos' },
  { href: '/formularios', texto: 'Formularios' },
  { href: '/ajustes', texto: 'Plazos' },
  { href: '/equipo', texto: 'Equipo' },
];

export default function Menu() {
  const ruta = usePathname();
  return (
    <nav className="menu" aria-label="Secciones">
      {LINKS.map((l) => {
        const actual = l.href === '/' ? ruta === '/' : ruta.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={actual ? 'page' : undefined}
          >
            {l.texto}
          </Link>
        );
      })}
    </nav>
  );
}
