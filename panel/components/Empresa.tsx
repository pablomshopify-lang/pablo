import type { CSSProperties } from 'react';
import type { Empresa } from '@/lib/datos';

export const colorEmpresa = (e?: Empresa) =>
  ({ '--c': e?.color ?? 'var(--brand)' }) as CSSProperties;

export function ChipEmpresa({ empresa }: { empresa?: Empresa }) {
  if (!empresa) return <span className="chip">Holding</span>;
  return (
    <span className="chip" style={colorEmpresa(empresa)}>
      <i />
      {empresa.nombre}
    </span>
  );
}
