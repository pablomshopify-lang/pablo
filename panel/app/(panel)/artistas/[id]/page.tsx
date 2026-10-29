import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  agregarNota,
  borrarArtista,
  crearTarea,
  editarArtista,
  estadoEnEmpresa,
  sumarEmpresa,
} from '@/app/acciones';
import Aviso from '@/components/Aviso';
import CamposArtista from '@/components/CamposArtista';
import { colorEmpresa } from '@/components/Empresa';
import FilaContrato from '@/components/FilaContrato';
import FilaTarea from '@/components/FilaTarea';
import FormContrato from '@/components/FormContrato';
import type {
  Artista,
  CampoTexto,
  ArtistaEmpresa,
  Contrato,
  Nota,
  Tarea,
} from '@/lib/datos';
import { AREAS, ESTADOS_ARTISTA, ESTADOS_EN_EMPRESA, REDES } from '@/lib/datos';
import { empresas, equipo, sesion } from '@/lib/sesion';

type Ficha = Artista & {
  artista_empresas: ArtistaEmpresa[];
  tareas: Tarea[];
  contratos: Contrato[];
  notas: Nota[];
};

const cargar = async (id: string) => {
  const { supabase } = await sesion();
  const { data } = await supabase
    .from('artistas')
    .select('*, artista_empresas(*), tareas(*), contratos(*), notas(*)')
    .eq('id', id)
    .maybeSingle<Ficha>();
  return data;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const a = await cargar((await params).id);
  return { title: a?.nombre_artistico ?? 'Artista' };
}

const DATOS: { id: CampoTexto; label: string }[] = [
  { id: 'nombre_legal', label: 'Nombre legal' },
  { id: 'documento', label: 'Documento' },
  { id: 'email', label: 'Correo' },
  { id: 'telefono', label: 'Teléfono' },
  { id: 'pais', label: 'País' },
  { id: 'ciudad', label: 'Ciudad' },
  { id: 'tipo', label: 'Tipo' },
  { id: 'genero', label: 'Género' },
  { id: 'nacimiento', label: 'Nacimiento' },
  { id: 'manager', label: 'Manager' },
];

const enlace = (v: string) =>
  /^https?:\/\//.test(v) ? (
    <a href={v} target="_blank" rel="noreferrer">
      {v.replace(/^https?:\/\/(www\.)?/, '').slice(0, 40)}
    </a>
  ) : (
    v
  );

export default async function FichaArtista({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const [a, { esJefe, esCeo }, lista, personas] = await Promise.all([
    cargar(id),
    sesion(),
    empresas(),
    equipo(),
  ]);
  if (!a) notFound();

  const porPaso = (x: Tarea, y: Tarea) =>
    (x.paso ?? 999) - (y.paso ?? 999) ||
    (x.vence ?? '').localeCompare(y.vence ?? '');
  const vinculos = lista
    .map((e) => ({
      e,
      v: a.artista_empresas.find((v) => v.empresa_id === e.id),
    }))
    .filter((x) => x.v);
  const faltan = lista.filter(
    (e) => !a.artista_empresas.some((v) => v.empresa_id === e.id),
  );
  const sueltas = a.tareas.filter((t) => !t.empresa_id).sort(porPaso);
  const ruta = `/artistas/${a.id}`;
  const redes = REDES.filter((r) => a.redes?.[r.id]);
  const autor = (n: Nota) =>
    personas.find((p) => p.id === n.autor_id)?.nombre ?? 'Sistema';

  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">
            {a.codigo ?? 'Artista'} · {a.origen}
          </p>
          <h1>{a.nombre_artistico}</h1>
        </div>
        <span className="chip">{a.estado}</span>
      </header>
      <Aviso error={error} />

      <div className="dos">
        <div style={{ display: 'grid', gap: '1.5rem', minWidth: 0 }}>
          <section className="card">
            <h2>Empresas y tareas</h2>
            {vinculos.map(({ e, v }) => {
              const tareas = a.tareas
                .filter((t) => t.empresa_id === e.id)
                .sort(porPaso);
              const hechas = tareas.filter((t) => t.estado === 'Hecha').length;
              const respuestas = Object.entries(v?.respuestas ?? {});
              return (
                <div key={e.id} className="empresa" style={colorEmpresa(e)}>
                  <div className="empresa-cabeza">
                    <strong>{e.nombre}</strong>
                    <form action={estadoEnEmpresa} className="acciones">
                      <input type="hidden" name="artista_id" value={a.id} />
                      <input type="hidden" name="empresa_id" value={e.id} />
                      <select
                        name="estado"
                        defaultValue={v?.estado}
                        className="mini"
                        aria-label={`Estado en ${e.nombre}`}
                      >
                        {ESTADOS_EN_EMPRESA.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <button className="suave chico">Cambiar</button>
                    </form>
                  </div>
                  <small className="muted">
                    {hechas} de {tareas.length} tareas hechas · desde {v?.desde}
                  </small>
                  <div className="barra-progreso" aria-hidden>
                    <span
                      style={{
                        width: `${tareas.length ? (hechas / tareas.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  {respuestas.length > 0 && (
                    <details>
                      <summary>Respuestas del formulario ▾</summary>
                      <dl className="datos">
                        {respuestas.map(([p, r]) => (
                          <div key={p}>
                            <dt>{p}</dt>
                            <dd>{r}</dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  )}
                  <ul className="lista">
                    {tareas.map((t) => (
                      <FilaTarea
                        key={t.id}
                        tarea={t}
                        equipo={personas}
                        empresas={lista}
                        conArtista={false}
                        puedeBorrar={esJefe}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}

            {sueltas.length > 0 && (
              <div className="empresa">
                <strong>Otras tareas</strong>
                <ul className="lista">
                  {sueltas.map((t) => (
                    <FilaTarea
                      key={t.id}
                      tarea={t}
                      equipo={personas}
                      empresas={lista}
                      conArtista={false}
                      puedeBorrar={esJefe}
                    />
                  ))}
                </ul>
              </div>
            )}

            <div className="columnas">
              {faltan.length > 0 && (
                <form action={sumarEmpresa} className="form">
                  <input type="hidden" name="artista_id" value={a.id} />
                  <label className="campo">
                    Sumar a otra empresa (crea sus tareas)
                    <select name="empresa_id">
                      {faltan.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div>
                    <button className="suave chico">Sumar</button>
                  </div>
                </form>
              )}
              <details>
                <summary>+ Agregar una tarea suelta</summary>
                <form action={crearTarea} className="form">
                  <input type="hidden" name="artista_id" value={a.id} />
                  <input
                    name="titulo"
                    placeholder="¿Qué hay que hacer?"
                    required
                  />
                  <div className="grid">
                    <select name="empresa_id" aria-label="Empresa">
                      <option value="">Holding (general)</option>
                      {vinculos.map(({ e }) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre}
                        </option>
                      ))}
                    </select>
                    <select name="area" aria-label="Área">
                      {AREAS.map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                    <input type="date" name="vence" aria-label="Vence" />
                  </div>
                  <div>
                    <button className="suave chico">Agregar tarea</button>
                  </div>
                </form>
              </details>
            </div>
          </section>

          <section className="card" id="contratos">
            <h2>Contratos</h2>
            {a.contratos.length ? (
              <ul className="lista">
                {a.contratos.map((c) => (
                  <FilaContrato
                    key={c.id}
                    contrato={c}
                    empresas={lista}
                    equipo={personas}
                    esCeo={esCeo}
                    esJefe={esJefe}
                    volver={`${ruta}#contratos`}
                    regaliasArtista={a.regalias_meses}
                  />
                ))}
              </ul>
            ) : (
              <p className="vacio">Todavía no tiene contratos.</p>
            )}
            <details>
              <summary>+ Nuevo contrato</summary>
              <FormContrato
                artistaId={a.id}
                empresas={lista}
                esCeo={esCeo}
                esJefe={esJefe}
                volver={`${ruta}#contratos`}
                empresaInicial={vinculos[0]?.e.id}
              />
            </details>
          </section>
        </div>

        <div style={{ display: 'grid', gap: '1.5rem', minWidth: 0 }}>
          <section className="card">
            <h2>Datos</h2>
            <dl className="datos">
              {DATOS.filter((d) => a[d.id]).map((d) => (
                <div key={d.id}>
                  <dt>{d.label}</dt>
                  <dd>{a[d.id]}</dd>
                </div>
              ))}
              <div>
                <dt>Regalías</dt>
                <dd>Cada {a.regalias_meses} meses</dd>
              </div>
            </dl>
            {redes.length > 0 && (
              <dl className="datos">
                {redes.map((r) => (
                  <div key={r.id}>
                    <dt>{r.label}</dt>
                    <dd>{enlace(a.redes[r.id] ?? '')}</dd>
                  </div>
                ))}
              </dl>
            )}
            {a.bio && <p className="muted">{a.bio}</p>}
            {a.comentarios && (
              <p className="muted">
                <small>Comentarios: {a.comentarios}</small>
              </p>
            )}
            <details>
              <summary>Editar ficha ▾</summary>
              <form action={editarArtista} className="form">
                <input type="hidden" name="id" value={a.id} />
                <label className="campo">
                  Estado general
                  <select name="estado" defaultValue={a.estado}>
                    {ESTADOS_ARTISTA.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <CamposArtista artista={a} />
                <label className="campo">
                  Comentarios
                  <textarea
                    name="comentarios"
                    defaultValue={a.comentarios ?? ''}
                  />
                </label>
                <div>
                  <button className="suave">Guardar ficha</button>
                </div>
              </form>
              {esJefe && (
                <form action={borrarArtista} style={{ marginTop: '1rem' }}>
                  <input type="hidden" name="id" value={a.id} />
                  <button className="peligro chico">
                    Borrar artista y todo su historial
                  </button>
                </form>
              )}
            </details>
          </section>

          <section className="card">
            <h2>Notas</h2>
            <form action={agregarNota} className="form">
              <input type="hidden" name="artista_id" value={a.id} />
              <textarea
                name="texto"
                placeholder="Llamada, acuerdo, idea…"
                required
              />
              <div>
                <button className="suave chico">Guardar nota</button>
              </div>
            </form>
            <ul className="lista">
              {a.notas
                .sort((x, y) => y.creado_en.localeCompare(x.creado_en))
                .map((n) => (
                  <li key={n.id}>
                    <div className="crece">
                      <span style={{ whiteSpace: 'pre-wrap' }}>{n.texto}</span>
                      <small className="muted">
                        {autor(n)} ·{' '}
                        {new Date(n.creado_en).toLocaleString('es-CL')}
                      </small>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
