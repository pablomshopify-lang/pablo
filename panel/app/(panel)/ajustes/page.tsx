import type { Metadata } from 'next';
import {
  agregarPaso,
  borrarPaso,
  guardarPlazos,
  guardarRegalias,
} from '@/app/acciones';
import Aviso from '@/components/Aviso';
import { colorEmpresa } from '@/components/Empresa';
import type { Plantilla } from '@/lib/datos';
import { AREAS } from '@/lib/datos';
import { empresas, equipo, sesion } from '@/lib/sesion';

export const metadata: Metadata = { title: 'Plazos y procedimientos' };

export default async function Ajustes({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const { supabase, esJefe } = await sesion();
  const [lista, personas] = await Promise.all([empresas(), equipo()]);
  const [{ data: pasos }, { data: config }] = await Promise.all([
    supabase
      .from('plantillas_tareas')
      .select('*')
      .order('paso')
      .overrideTypes<Plantilla[], { merge: false }>(),
    supabase
      .from('configuracion')
      .select('valor')
      .eq('clave', 'regalias_meses')
      .maybeSingle<{ valor: string }>(),
  ]);
  const quien = (area: string) =>
    personas
      .filter((p) => p.activo && p.area === area)
      .map((p) => p.nombre)
      .join(', ') || 'nadie todavía';

  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">Manual de procedimientos</p>
          <h1>Plazos</h1>
        </div>
      </header>
      <p className="muted">
        Estos son los pasos que se crean solos cuando un artista entra a cada
        empresa. «Días» cuenta desde el día de ingreso. Los cambios valen para
        los próximos ingresos; en las tareas ya creadas se cambia la fecha a
        mano.
        {!esJefe && ' Solo Pablo o Sebastián pueden cambiarlos.'}
      </p>
      <Aviso error={error} ok={ok} />

      <section className="card">
        <h2>Regalías</h2>
        <form action={guardarRegalias} className="acciones">
          <label className="campo">
            Liquidar regalías cada (meses), salvo que el contrato diga otra cosa
            <input
              type="number"
              name="regalias_meses"
              min={1}
              max={24}
              defaultValue={config?.valor ?? '3'}
              disabled={!esJefe}
              style={{ maxWidth: '8rem' }}
            />
          </label>
          {esJefe && <button className="suave">Guardar</button>}
        </form>
      </section>

      {lista.map((e) => {
        const deEmpresa = (pasos ?? []).filter((p) => p.empresa_id === e.id);
        return (
          <section
            key={e.id}
            id={e.id}
            className="card"
            style={colorEmpresa(e)}
          >
            <h2>{e.nombre}</h2>
            <form action={guardarPlazos} className="form">
              <input type="hidden" name="empresa_id" value={e.id} />
              <div className="tabla-caja">
                <table className="tabla">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Tarea</th>
                      <th>Área (quién)</th>
                      <th>Días</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deEmpresa.map((p) => (
                      <tr key={p.id}>
                        <td className="muted">
                          {p.paso}
                          <input type="hidden" name="id" value={p.id} />
                        </td>
                        <td style={{ minWidth: '18rem' }}>
                          <input
                            name={`tarea_${p.id}`}
                            defaultValue={p.tarea}
                            disabled={!esJefe}
                            aria-label="Tarea"
                          />
                        </td>
                        <td>
                          <select
                            name={`area_${p.id}`}
                            defaultValue={p.area}
                            disabled={!esJefe}
                            aria-label="Área"
                          >
                            {AREAS.map((a) => (
                              <option key={a}>{a}</option>
                            ))}
                          </select>
                          <small className="muted">{quien(p.area)}</small>
                        </td>
                        <td>
                          <input
                            type="number"
                            min={0}
                            name={`dias_${p.id}`}
                            defaultValue={p.dias}
                            disabled={!esJefe}
                            style={{ width: '5rem' }}
                            aria-label="Días"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {esJefe && (
                <div>
                  <button className="suave">Guardar {e.nombre}</button>
                </div>
              )}
            </form>
            {esJefe && (
              <details>
                <summary>Agregar o quitar pasos ▾</summary>
                <div className="form">
                  <form action={agregarPaso} className="grid">
                    <input type="hidden" name="empresa_id" value={e.id} />
                    <input
                      name="tarea"
                      placeholder="Nuevo paso"
                      required
                      aria-label="Nuevo paso"
                    />
                    <select name="area" aria-label="Área">
                      {AREAS.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      name="dias"
                      min={0}
                      defaultValue={7}
                      aria-label="Días"
                    />
                    <button className="suave chico">Agregar paso</button>
                  </form>
                  <div className="acciones">
                    {deEmpresa.map((p) => (
                      <form key={p.id} action={borrarPaso}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="peligro chico" title={p.tarea}>
                          Quitar paso {p.paso}
                        </button>
                      </form>
                    ))}
                  </div>
                </div>
              </details>
            )}
          </section>
        );
      })}
    </main>
  );
}
