import type { Metadata } from 'next';
import Link from 'next/link';
import { ChipEmpresa } from '@/components/Empresa';
import type { Artista, ArtistaEmpresa, Tarea } from '@/lib/datos';
import { ESTADOS_ARTISTA, hoy } from '@/lib/datos';
import { empresas, sesion } from '@/lib/sesion';

export const metadata: Metadata = { title: 'Artistas' };

type Fila = Pick<
  Artista,
  | 'id'
  | 'nombre_artistico'
  | 'nombre_legal'
  | 'email'
  | 'genero'
  | 'estado'
  | 'pais'
> & {
  artista_empresas: Pick<ArtistaEmpresa, 'empresa_id' | 'estado'>[];
  tareas: Pick<Tarea, 'estado' | 'vence'>[];
};

export default async function Artistas({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; empresa?: string; estado?: string }>;
}) {
  const { q = '', empresa = '', estado = '' } = await searchParams;
  const { supabase } = await sesion();
  const lista = await empresas();

  let consulta = supabase
    .from('artistas')
    .select(
      'id, nombre_artistico, nombre_legal, email, genero, estado, pais, artista_empresas(empresa_id, estado), tareas(estado, vence)',
    )
    .order('nombre_artistico');
  if (estado) consulta = consulta.eq('estado', estado);
  const busca = q.replace(/[%,()]/g, ' ').trim();
  if (busca) {
    consulta = consulta.or(
      `nombre_artistico.ilike.%${busca}%,nombre_legal.ilike.%${busca}%,email.ilike.%${busca}%`,
    );
  }
  const { data } = await consulta.overrideTypes<Fila[], { merge: false }>();
  const filas = (data ?? []).filter(
    (a) => !empresa || a.artista_empresas.some((v) => v.empresa_id === empresa),
  );
  const h = hoy();

  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">Una sola base para todo el Holding</p>
          <h1>Artistas</h1>
        </div>
        <Link href="/artistas/nuevo" className="btn marca-btn">
          + Nuevo artista
        </Link>
      </header>

      <form className="filtros">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o correo…"
        />
        <select name="empresa" defaultValue={empresa}>
          <option value="">Todas las empresas</option>
          {lista.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <select name="estado" defaultValue={estado}>
          <option value="">Todos los estados</option>
          {ESTADOS_ARTISTA.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <button className="suave">Filtrar</button>
      </form>

      <section className="card">
        <p className="muted">
          <small>
            {filas.length} {filas.length === 1 ? 'artista' : 'artistas'}
          </small>
        </p>
        {filas.length ? (
          <div className="tabla-caja">
            <table className="tabla">
              <thead>
                <tr>
                  <th>Artista</th>
                  <th>Empresas</th>
                  <th>Estado</th>
                  <th>Tareas</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((a) => {
                  const pendientes = a.tareas.filter(
                    (t) => t.estado !== 'Hecha',
                  );
                  const vencidas = pendientes.filter(
                    (t) => t.vence && t.vence < h,
                  );
                  return (
                    <tr key={a.id}>
                      <td>
                        <Link href={`/artistas/${a.id}`}>
                          <strong>{a.nombre_artistico}</strong>
                        </Link>
                        <br />
                        <small className="muted">
                          {[a.genero, a.pais].filter(Boolean).join(' · ') ||
                            a.email}
                        </small>
                      </td>
                      <td>
                        <div className="chips">
                          {a.artista_empresas.map((v) => (
                            <ChipEmpresa
                              key={v.empresa_id}
                              empresa={lista.find((e) => e.id === v.empresa_id)}
                            />
                          ))}
                        </div>
                      </td>
                      <td>{a.estado}</td>
                      <td>
                        {pendientes.length ? (
                          <>
                            {pendientes.length} pendientes
                            {vencidas.length > 0 && (
                              <>
                                {' · '}
                                <span className="vencida">
                                  {vencidas.length} vencidas
                                </span>
                              </>
                            )}
                          </>
                        ) : (
                          <span className="ok">Al día</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="vacio">
            No hay artistas con esos filtros. Los que se inscriben en el
            formulario de ingreso aparecen aquí solos.
          </p>
        )}
      </section>
    </main>
  );
}
