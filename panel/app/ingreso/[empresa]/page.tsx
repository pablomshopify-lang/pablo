import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import FormularioIngreso from '@/components/FormularioIngreso';
import { FORMULARIOS, formularioPorId } from '@/lib/formularios';

type Props = { params: Promise<{ empresa: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return FORMULARIOS.map((f) => ({ empresa: f.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = formularioPorId((await params).empresa);
  return { title: `Ingreso de artistas · ${f?.nombre ?? ''}` };
}

// Formulario público de cada empresa: /ingreso/mvck-music, /ingreso/maverick-live…
// Lo que envía el artista entra directo a «Artistas», con sus tareas.
export default async function IngresoEmpresa({ params }: Props) {
  const f = formularioPorId((await params).empresa);
  if (!f) notFound();

  return (
    <main
      className="wrap ingreso"
      style={{ '--c': f.color, '--on-c': f.sobreColor } as CSSProperties}
    >
      <header className="ing-hero">
        <p className="eyebrow">Maverick Music Entertainment · {f.nombre}</p>
        <h1>Ingreso de artistas</h1>
        <p className="muted">{f.resumen}</p>
      </header>
      <FormularioIngreso empresaId={f.id} />
    </main>
  );
}
