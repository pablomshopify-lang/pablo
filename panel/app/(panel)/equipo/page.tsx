import type { Metadata } from 'next';
import { crearMiembro, editarMiembro, eliminarMiembro } from '@/app/acciones';
import Aviso from '@/components/Aviso';
import BotonConfirmar from '@/components/BotonConfirmar';
import { AREAS, ROLES } from '@/lib/datos';
import { equipo, sesion } from '@/lib/sesion';

export const metadata: Metadata = { title: 'Equipo' };

export default async function Equipo({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ok?: string }>;
}) {
  const { error, ok } = await searchParams;
  const { esJefe, perfil } = await sesion();
  const personas = await equipo();

  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">Cada persona entra con su usuario</p>
          <h1>Equipo</h1>
        </div>
      </header>
      <Aviso error={error} ok={ok} />

      <section className="card">
        <ul className="lista">
          {personas.map((p) => (
            <li key={p.id} style={{ display: 'grid', gap: '0.5rem' }}>
              <div className="empresa-cabeza">
                <div className="crece">
                  <strong>
                    {p.nombre}
                    {p.id === perfil.id && ' (tú)'}
                  </strong>
                  <small className="muted">
                    {p.area} · {ROLES[p.rol]} · {p.email}
                  </small>
                </div>
                <span className={`chip ${p.activo ? 'ok' : 'vencida'}`}>
                  {p.activo ? 'Activo' : 'Sin acceso'}
                </span>
              </div>
              {esJefe && (
                <details>
                  <summary>Editar ▾</summary>
                  <form action={editarMiembro} className="form">
                    <input type="hidden" name="id" value={p.id} />
                    <div className="grid">
                      <label className="campo">
                        Nombre
                        <input name="nombre" defaultValue={p.nombre} required />
                      </label>
                      <label className="campo">
                        Área
                        <select name="area" defaultValue={p.area}>
                          {AREAS.map((a) => (
                            <option key={a}>{a}</option>
                          ))}
                        </select>
                      </label>
                      <label className="campo">
                        Rol
                        <select
                          name="rol"
                          defaultValue={p.rol}
                          disabled={p.id === perfil.id}
                        >
                          {Object.entries(ROLES).map(([v, t]) => (
                            <option key={v} value={v}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="campo">
                        Acceso
                        <select
                          name="activo"
                          defaultValue={p.activo ? 'si' : 'no'}
                        >
                          <option value="si">Puede entrar</option>
                          <option value="no">Sin acceso</option>
                        </select>
                      </label>
                      <label className="campo">
                        Clave nueva (opcional)
                        <input
                          name="clave"
                          type="text"
                          minLength={8}
                          autoComplete="off"
                          placeholder="Solo si la olvidó"
                        />
                      </label>
                    </div>
                    <div>
                      <button className="suave chico">Guardar</button>
                    </div>
                  </form>
                  {p.id !== perfil.id && (
                    <form
                      action={eliminarMiembro}
                      style={{ marginTop: '0.75rem' }}
                    >
                      <input type="hidden" name="id" value={p.id} />
                      <BotonConfirmar
                        className="peligro chico"
                        pregunta={`¿Eliminar a ${p.nombre}? Ya no podrá entrar al panel. Sus tareas y notas se mantienen.`}
                      >
                        Eliminar usuario
                      </BotonConfirmar>
                    </form>
                  )}
                </details>
              )}
            </li>
          ))}
        </ul>
      </section>

      {esJefe && (
        <section className="card">
          <h2>Sumar a una persona</h2>
          <p className="muted">
            Crea su usuario con una clave temporal y mándasela por WhatsApp.
            Después la puede cambiar en «Mi cuenta».
          </p>
          <form action={crearMiembro} className="form">
            <div className="grid">
              <label className="campo">
                Nombre
                <input name="nombre" required placeholder="Kim Mujica" />
              </label>
              <label className="campo">
                Correo
                <input name="email" type="email" required />
              </label>
              <label className="campo">
                Área
                <select name="area" defaultValue="Prensa">
                  {AREAS.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="campo">
                Rol
                <select name="rol" defaultValue="equipo">
                  {Object.entries(ROLES).map(([v, t]) => (
                    <option key={v} value={v}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="campo">
                Clave temporal
                <input
                  name="clave"
                  type="text"
                  minLength={8}
                  required
                  autoComplete="off"
                />
              </label>
            </div>
            <div>
              <button className="marca-btn">Crear usuario</button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
