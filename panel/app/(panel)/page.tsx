import Link from 'next/link';
import { colorEmpresa } from '@/components/Empresa';
import FilaTarea from '@/components/FilaTarea';
import type { TareaConArtista } from '@/components/FilaTarea';
import Vence from '@/components/Vence';
import type { ArtistaEmpresa, Contrato } from '@/lib/datos';
import { hoy, sumarDias } from '@/lib/datos';
import { empresas, equipo, sesion } from '@/lib/sesion';

type ContratoConArtista = Contrato & {
  artistas: { nombre_artistico: string } | null;
};

export default async function Inicio() {
  const { supabase, perfil, esCeo } = await sesion();
  const [lista, personas] = await Promise.all([empresas(), equipo()]);
  const h = hoy();

  // Mis tareas: las de mi área o las que me asignaron.
  const [mias, vencidas, vinculos, porFirmar, porVencer, nuevos] =
    await Promise.all([
      supabase
        .from('tareas')
        .select('*, artistas(nombre_artistico)')
        .neq('estado', 'Hecha')
        .or(
          `responsable_id.eq.${perfil.id},and(responsable_id.is.null,area.eq."${perfil.area}")`,
        )
        .order('vence', { nullsFirst: false })
        .limit(12)
        .overrideTypes<TareaConArtista[], { merge: false }>(),
      supabase
        .from('tareas')
        .select('id', { count: 'exact', head: true })
        .neq('estado', 'Hecha')
        .lt('vence', h),
      supabase
        .from('artista_empresas')
        .select('empresa_id, estado')
        .in('estado', ['En proceso', 'Activo'])
        .overrideTypes<
          Pick<ArtistaEmpresa, 'empresa_id' | 'estado'>[],
          { merge: false }
        >(),
      supabase
        .from('contratos')
        .select('*, artistas(nombre_artistico)')
        .eq('estado', 'Enviado al artista')
        .order('creado_en')
        .overrideTypes<ContratoConArtista[], { merge: false }>(),
      supabase
        .from('contratos')
        .select('*, artistas(nombre_artistico)')
        .eq('estado', 'Firmado')
        .gte('fin', h)
        .lte('fin', sumarDias(h, 60))
        .order('fin')
        .overrideTypes<ContratoConArtista[], { merge: false }>(),
      supabase
        .from('artistas')
        .select('id, nombre_artistico, creado_en, origen')
        .order('creado_en', { ascending: false })
        .limit(5)
        .overrideTypes<
          {
            id: string;
            nombre_artistico: string;
            creado_en: string;
            origen: string;
          }[],
          { merge: false }
        >(),
    ]);

  const contratos = [...(porFirmar.data ?? []), ...(porVencer.data ?? [])];

  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">Hola, {perfil.nombre.split(' ')[0]}</p>
          <h1>Inicio</h1>
        </div>
        <Link href="/artistas/nuevo" className="btn marca-btn">
          + Nuevo artista
        </Link>
      </header>

      <section className="cifras" aria-label="Artistas por empresa">
        {lista.map((e) => (
          <Link
            key={e.id}
            href={`/artistas?empresa=${e.id}`}
            className="cifra"
            style={colorEmpresa(e)}
          >
            <strong>
              {
                (vinculos.data ?? []).filter((v) => v.empresa_id === e.id)
                  .length
              }
            </strong>
            <span>artistas en {e.nombre}</span>
          </Link>
        ))}
        <Link href="/tareas?ver=vencidas" className="cifra">
          <strong className={vencidas.count ? 'vencida' : 'ok'}>
            {vencidas.count ?? 0}
          </strong>
          <span>tareas vencidas en el Holding</span>
        </Link>
      </section>

      <div className="dos">
        <section className="card">
          <div className="card-cabeza">
            <h2>Mis tareas · {perfil.area}</h2>
            <Link href="/tareas?ver=mias" className="muted">
              <small>Ver todas</small>
            </Link>
          </div>
          {mias.data?.length ? (
            <ul className="lista">
              {mias.data.map((t) => (
                <FilaTarea
                  key={t.id}
                  tarea={t}
                  equipo={personas}
                  empresas={lista}
                />
              ))}
            </ul>
          ) : (
            <p className="vacio">No tienes tareas pendientes. 🎉</p>
          )}
        </section>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <section className="card">
            <h2>{esCeo ? 'Contratos para tu firma' : 'Contratos'}</h2>
            {contratos.length ? (
              <ul className="lista">
                {contratos.map((c) => (
                  <li key={c.id}>
                    <div className="crece">
                      <Link href={`/artistas/${c.artista_id}#contratos`}>
                        {c.artistas?.nombre_artistico} · {c.tipo}
                      </Link>
                      <small className="muted">
                        {c.estado === 'Firmado' ? (
                          <>
                            Termina <Vence fecha={c.fin} />
                          </>
                        ) : (
                          'Esperando firma del CEO'
                        )}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="vacio">
                Nada por firmar ni contratos por terminar en 60 días.
              </p>
            )}
          </section>

          <section className="card">
            <h2>Últimos artistas</h2>
            {nuevos.data?.length ? (
              <ul className="lista">
                {nuevos.data.map((a) => (
                  <li key={a.id}>
                    <div className="crece">
                      <Link href={`/artistas/${a.id}`}>
                        {a.nombre_artistico}
                      </Link>
                      <small className="muted">
                        {a.origen} ·{' '}
                        {new Date(a.creado_en).toLocaleDateString('es-CL')}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="vacio">Todavía no hay artistas.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
