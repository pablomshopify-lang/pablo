import { fechaCorta, hoy, sumarDias } from '@/lib/datos';

/** Fecha de vencimiento en rojo si ya pasó y en naranjo si es esta semana. */
export default function Vence({
  fecha,
  hecha = false,
}: {
  fecha: string | null;
  hecha?: boolean;
}) {
  if (!fecha) return <span className="muted">Sin fecha</span>;
  const h = hoy();
  const clase = hecha
    ? 'muted'
    : fecha < h
      ? 'vencida'
      : fecha <= sumarDias(h, 7)
        ? 'pronto'
        : 'muted';
  const texto = fecha === h ? 'Hoy' : fechaCorta(fecha);
  return (
    <span className={clase}>
      {!hecha && fecha < h ? `Venció ${texto}` : texto}
    </span>
  );
}
