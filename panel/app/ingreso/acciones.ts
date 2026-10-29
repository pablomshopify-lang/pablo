'use server';

import { DATOS, REDES_FORM, formularioPorId } from '@/lib/formularios';
import { guardarFicha } from '@/lib/ingreso';

export type Envio = {
  empresa: string;
  datos: Record<string, string>;
  redes: Record<string, string>;
  respuestas: Record<string, string>;
  intereses: string[];
  comentarios: string;
  gotcha: string;
};

const limpiar = (v: unknown) =>
  (typeof v === 'string' ? v : '').trim().slice(0, 2000);

/** Lo que envía el artista desde /ingreso/<empresa>: entra directo al panel. */
export async function inscribir(
  e: Envio,
): Promise<{ ok: boolean; codigo?: string }> {
  // Campo oculto anti-robots: si viene lleno, fingimos éxito y no guardamos.
  if (e.gotcha) return { ok: true, codigo: 'OK' };

  const form = formularioPorId(limpiar(e.empresa));
  if (!form) return { ok: false };
  const datos = Object.fromEntries(
    DATOS.map((c) => [c.id, limpiar(e.datos?.[c.id])]),
  );
  if (DATOS.some((c) => c.requerido && !datos[c.id])) return { ok: false };

  // Las respuestas se guardan con la pregunta completa, para leerlas en la ficha.
  const respuestas: Record<string, string> = {};
  for (const p of form.preguntas) {
    const v = limpiar(e.respuestas?.[p.id]);
    if (v) respuestas[p.label] = v;
  }
  const intereses = (Array.isArray(e.intereses) ? e.intereses : [])
    .map((i) => formularioPorId(limpiar(i)))
    .filter((f) => f && f.id !== form.id)
    .map((f) => f?.nombre)
    .join(', ');

  const hoy = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  const codigo = `ART-${hoy}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const r = await guardarFicha({
    ...datos,
    id: codigo,
    empresa: form.id,
    redes: Object.fromEntries(
      REDES_FORM.map((c) => [c.id, limpiar(e.redes?.[c.id])]),
    ),
    respuestas,
    intereses,
    comentarios: limpiar(e.comentarios),
  });
  return r.ok ? { ok: true, codigo } : { ok: false };
}
