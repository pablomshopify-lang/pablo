import { NextResponse } from 'next/server';
import { guardarFicha } from '@/lib/ingreso';

/**
 * Webhook para recibir fichas desde fuera del panel (por ejemplo, otro
 * formulario). Los formularios propios del panel están en /ingreso/….
 *
 * Se protege con una clave: ?clave=… o el encabezado x-panel-clave, que debe
 * ser igual a PANEL_CLAVE_INGRESO en Vercel.
 */
export async function POST(req: Request) {
  const clave = process.env.PANEL_CLAVE_INGRESO;
  const recibida =
    req.headers.get('x-panel-clave') ??
    new URL(req.url).searchParams.get('clave');
  if (!clave || recibida !== clave) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  let ficha: Record<string, unknown>;
  try {
    ficha = JSON.parse(await req.text()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const r = await guardarFicha(ficha);
  return NextResponse.json(r, { status: r.ok ? 200 : 422 });
}
