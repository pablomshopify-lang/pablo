import Link from 'next/link';
import { borrarTarea, editarTarea, estadoTarea } from '@/app/acciones';
import type { Empresa, Perfil, Tarea } from '@/lib/datos';
import { AREAS } from '@/lib/datos';
import { ChipEmpresa } from './Empresa';
import Vence from './Vence';

export type TareaConArtista = Tarea & {
  artistas: { nombre_artistico: string } | null;
};

/** Quién hace la tarea: la persona asignada o quien lleva esa área. */
export const responsable = (t: Tarea, equipo: Perfil[]) => {
  const asignada = equipo.find((p) => p.id === t.responsable_id);
  if (asignada) return asignada.nombre;
  const delArea = equipo.filter((p) => p.activo && p.area === t.area);
  return delArea.length
    ? delArea.map((p) => p.nombre.split(' ')[0]).join(', ')
    : t.area;
};

export default function FilaTarea({
  tarea,
  equipo,
  empresas,
  conArtista = true,
  puedeBorrar = false,
}: {
  tarea: TareaConArtista | Tarea;
  equipo: Perfil[];
  empresas: Empresa[];
  conArtista?: boolean;
  puedeBorrar?: boolean;
}) {
  const hecha = tarea.estado === 'Hecha';
  const artista = 'artistas' in tarea ? tarea.artistas : null;
  return (
    <li className={hecha ? 'hecha' : undefined}>
      <form action={estadoTarea}>
        <input type="hidden" name="id" value={tarea.id} />
        <input type="hidden" name="artista_id" value={tarea.artista_id} />
        <input
          type="hidden"
          name="estado"
          value={hecha ? 'Pendiente' : 'Hecha'}
        />
        <button
          className="palomita"
          aria-label={hecha ? 'Marcar como pendiente' : 'Marcar como hecha'}
          title={hecha ? 'Marcar como pendiente' : 'Marcar como hecha'}
        >
          ✓
        </button>
      </form>
      <div className="crece">
        <span className="titulo">{tarea.titulo}</span>
        <small className="muted">
          {conArtista && artista && (
            <>
              <Link href={`/artistas/${tarea.artista_id}`}>
                {artista.nombre_artistico}
              </Link>
              {' · '}
            </>
          )}
          {responsable(tarea, equipo)}
          {tarea.estado === 'En curso' && ' · En curso'}
        </small>
        {!hecha && (
          <details>
            <summary>Cambiar fecha o responsable</summary>
            <div className="acciones">
              <form action={editarTarea} className="acciones">
                <input type="hidden" name="id" value={tarea.id} />
                <input
                  type="hidden"
                  name="artista_id"
                  value={tarea.artista_id}
                />
                <input
                  type="date"
                  name="vence"
                  defaultValue={tarea.vence ?? ''}
                  className="mini"
                  aria-label="Vence"
                />
                <select
                  name="area"
                  defaultValue={tarea.area}
                  className="mini"
                  aria-label="Área"
                >
                  {AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <select
                  name="responsable_id"
                  defaultValue={tarea.responsable_id ?? ''}
                  className="mini"
                  aria-label="Responsable"
                >
                  <option value="">Quien lleve el área</option>
                  {equipo
                    .filter((p) => p.activo)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                </select>
                <button className="suave chico">Guardar</button>
              </form>
              <form action={estadoTarea}>
                <input type="hidden" name="id" value={tarea.id} />
                <input
                  type="hidden"
                  name="artista_id"
                  value={tarea.artista_id}
                />
                <input
                  type="hidden"
                  name="estado"
                  value={tarea.estado === 'En curso' ? 'Pendiente' : 'En curso'}
                />
                <button className="suave chico">
                  {tarea.estado === 'En curso'
                    ? 'Quitar «en curso»'
                    : 'Marcar en curso'}
                </button>
              </form>
              {puedeBorrar && (
                <form action={borrarTarea}>
                  <input type="hidden" name="id" value={tarea.id} />
                  <input
                    type="hidden"
                    name="artista_id"
                    value={tarea.artista_id}
                  />
                  <button className="peligro chico">Borrar</button>
                </form>
              )}
            </div>
          </details>
        )}
      </div>
      <div className="lado">
        {conArtista && (
          <ChipEmpresa
            empresa={empresas.find((e) => e.id === tarea.empresa_id)}
          />
        )}
        <small>
          <Vence fecha={tarea.vence} hecha={hecha} />
        </small>
      </div>
    </li>
  );
}
