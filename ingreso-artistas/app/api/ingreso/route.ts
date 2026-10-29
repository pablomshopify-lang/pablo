import { NextResponse } from 'next/server';
import { DATOS, REDES } from '@/lib/campos';
import { EQUIPO, empresaPorId } from '@/lib/empresas';
import type { Empresa } from '@/lib/empresas';

// Formulario de respaldo mientras no esté conectada la hoja de Google.
const FORMSPREE = 'https://formspree.io/f/xyekqdeo';

type Cuerpo = {
  datos?: Record<string, string>;
  redes?: Record<string, string>;
  empresa?: string;
  intereses?: string[];
  respuestas?: Record<string, string>;
  comentarios?: string;
  _gotcha?: string;
};

const limpiar = (v: unknown) =>
  (typeof v === 'string' ? v : '').trim().slice(0, 2000);

const fecha = (d: Date) => d.toISOString().slice(0, 10);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Cuerpo | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  // Campo oculto anti-robots: si viene lleno, fingimos éxito y no guardamos.
  if (body._gotcha) return NextResponse.json({ ok: true, id: 'OK' });

  const datos = Object.fromEntries(
    DATOS.map((c) => [c.id, limpiar(body.datos?.[c.id])]),
  );
  const redes = Object.fromEntries(
    REDES.map((c) => [c.id, limpiar(body.redes?.[c.id])]),
  );
  const empresa = empresaPorId(limpiar(body.empresa));
  const intereses = (Array.isArray(body.intereses) ? body.intereses : [])
    .map((i) => empresaPorId(limpiar(i)))
    .filter((e): e is Empresa => e !== undefined && e !== empresa);

  const faltan = DATOS.filter((c) => c.requerido && !datos[c.id]).map(
    (c) => c.label,
  );
  if (faltan.length || !empresa) {
    return NextResponse.json({ ok: false, faltan }, { status: 422 });
  }

  const hoy = new Date();
  const id = `ART-${fecha(hoy).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const respuestas: Record<string, string> = {};
  for (const p of empresa.preguntas) {
    const v = limpiar(body.respuestas?.[p.id]);
    if (v) respuestas[p.label] = v;
  }

  // Procedimiento interno de la empresa por la que entró el artista, más
  // una tarea de derivación por cada otra empresa que le interese.
  const vence = (dias: number) =>
    fecha(new Date(hoy.getTime() + dias * 86_400_000));
  const tareas = [
    ...empresa.tareas.map((t) => ({ ...t })),
    ...intereses.map((e) => ({
      tarea: `Derivar la ficha a ${e.nombre} (le interesa)`,
      area: 'Ventas y Marketing' as const,
      dias: 3,
    })),
  ].map((t, i) => ({
    paso: i + 1,
    tarea: t.tarea,
    area: t.area,
    responsable: EQUIPO[t.area],
    vence: vence(t.dias),
  }));

  const ficha = {
    id,
    fecha: hoy.toISOString(),
    ...datos,
    empresa: empresa.nombre,
    intereses: intereses.map((e) => e.nombre).join(', '),
    redes,
    respuestas,
    comentarios: limpiar(body.comentarios),
    tareas,
  };

  const hoja = process.env.GOOGLE_SCRIPT_URL;
  try {
    const res = hoja
      ? await fetch(hoja, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(ficha),
        })
      : await fetch(FORMSPREE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            _subject: `Nuevo artista: ${datos.nombre_artistico} · ${empresa.nombre}`,
            email: datos.email,
            ...ficha,
            redes: JSON.stringify(redes, null, 2),
            respuestas: JSON.stringify(respuestas, null, 2),
            tareas: tareas
              .map(
                (t) =>
                  `${t.paso}. ${t.tarea} (${t.responsable}, vence ${t.vence})`,
              )
              .join('\n'),
          }),
        });
    if (!res.ok) throw new Error(String(res.status));
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id });
}
