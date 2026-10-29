import Link from 'next/link';
import type { CSSProperties } from 'react';
import { EMPRESAS } from '@/lib/empresas';

// Página interna: los links de ingreso de cada empresa para compartir con
// los artistas. El artista nunca ve esta lista, entra directo por su empresa.
export default function Home() {
  return (
    <main className="wrap">
      <header className="hero">
        <p className="eyebrow">Holding MVCK · Uso interno</p>
        <h1>Ingreso de artistas</h1>
        <p className="muted">
          Cada empresa tiene su propio formulario. Comparte con el artista el
          link de la empresa con la que va a trabajar.
        </p>
      </header>
      <ul className="empresas">
        {EMPRESAS.map((e) => (
          <li key={e.id} style={{ '--c': e.color } as CSSProperties}>
            <Link href={`/${e.id}`} className="card">
              <strong>{e.nombre}</strong>
              <span className="muted">{e.resumen}</span>
              <code>/{e.id}</code>
            </Link>
          </li>
        ))}
      </ul>
      <p className="muted centro">
        <Link href="/procedimientos">Ver procedimientos internos →</Link>
      </p>
    </main>
  );
}
