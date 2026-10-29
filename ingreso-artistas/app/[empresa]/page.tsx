import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import { Formulario } from '@/components/Formulario';
import { EMPRESAS, empresaPorId } from '@/lib/empresas';

type Props = { params: Promise<{ empresa: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return EMPRESAS.map((e) => ({ empresa: e.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const empresa = empresaPorId((await params).empresa);
  return { title: `Ingreso de artistas · ${empresa?.nombre ?? ''}` };
}

// Formulario de ingreso propio de cada empresa: /mvck-music, /maverick-live…
export default async function IngresoEmpresa({ params }: Props) {
  const empresa = empresaPorId((await params).empresa);
  if (!empresa) notFound();

  return (
    <main
      className="wrap"
      style={
        { '--c': empresa.color, '--on-c': empresa.sobreColor } as CSSProperties
      }
    >
      <header className="hero">
        <p className="eyebrow">Holding MVCK · {empresa.nombre}</p>
        <h1>Ingreso de artistas</h1>
        <p className="muted">{empresa.resumen}</p>
      </header>
      <Formulario empresaId={empresa.id} />
    </main>
  );
}
