import type { Metadata } from 'next';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { FORMULARIOS } from '@/lib/formularios';

export const metadata: Metadata = { title: 'Formularios' };

// Los links que se mandan a los artistas. Cada inscripción llega sola a
// «Artistas», con las tareas de esa empresa.
export default function Formularios() {
  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">Ingreso de artistas</p>
          <h1>Formularios</h1>
        </div>
      </header>
      <p className="muted">
        Manda al artista el link de la empresa con la que va a trabajar. No
        necesita usuario. Cuando lo envía, aparece en «Artistas» con sus tareas
        ya creadas.
      </p>
      <ul className="ing-links">
        {FORMULARIOS.map((f) => (
          <li
            key={f.id}
            className="card"
            style={{ '--c': f.color } as CSSProperties}
          >
            <strong>{f.nombre}</strong>
            <span className="muted">{f.resumen}</span>
            <Link href={`/ingreso/${f.id}`} target="_blank">
              /ingreso/{f.id} ↗
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
