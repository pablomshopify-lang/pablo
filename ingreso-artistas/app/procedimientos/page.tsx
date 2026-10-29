import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { EQUIPO, PROJECT_MANAGER, SERVICIOS } from '@/lib/servicios';

export const metadata: Metadata = {
  title: 'Procedimientos internos · Holding MVCK',
};

// Página interna (no está enlazada desde el formulario): muestra al equipo
// los pasos de cada servicio, quién los hace y en cuántos días.
export default function Procedimientos() {
  return (
    <main className="wrap">
      <header className="hero">
        <p className="eyebrow">Uso interno</p>
        <h1>Procedimientos</h1>
        <p className="muted">
          Cuando un artista se inscribe, estas tareas se crean solas en la hoja
          «Tareas». Coordina: {PROJECT_MANAGER} (project manager).
        </p>
      </header>

      <section className="card">
        <h2>Equipo</h2>
        <dl className="resumen">
          {Object.entries(EQUIPO).map(([area, persona]) => (
            <div key={area}>
              <dt>{area}</dt>
              <dd>{persona}</dd>
            </div>
          ))}
        </dl>
      </section>

      {SERVICIOS.map((s) => (
        <section
          key={s.id}
          className="card proc"
          style={{ '--c': s.color } as CSSProperties}
        >
          <h2>{s.nombre}</h2>
          <p className="muted">{s.resumen}</p>
          <ol>
            {s.tareas.map((t) => (
              <li key={t.tarea}>
                <span>{t.tarea}</span>
                <small>
                  {EQUIPO[t.area]} · día {t.dias}
                </small>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </main>
  );
}
