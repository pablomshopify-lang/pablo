import type { Metadata } from 'next';
import Link from 'next/link';
import FilaTarea from '@/components/FilaTarea';
import type { TareaConArtista } from '@/components/FilaTarea';
import { AREAS, hoy } from '@/lib/datos';
import { empresas, equipo, sesion } from '@/lib/sesion';

export const metadata: Metadata = { title: 'Tareas' };

const VISTAS = {
  mias: 'Mis tareas',
  pendientes: 'Todas las pendientes',
  vencidas: 'Vencidas',
  hechas: 'Hechas',
} as const;

export default async function Tareas({
  searchParams,
}: {
  searchParams: Promise<{ ver?: string; area?: string; empresa?: string }>;
}) {
  const sp = await searchParams;
  const ver = (sp.ver ?? 'mias') in VISTAS ? (sp.ver ?? 'mias') : 'mias';
  const { area = '', empresa = '' } = sp;
  const { supabase, perfil, esJefe } = await sesion();
  const [lista, personas] = await Promise.all([empresas(), equipo()]);

  let consulta = supabase
    .from('tareas')
    .select('*, artistas(nombre_artistico)')
    .limit(500);
  if (ver === 'hechas') {
    consulta = consulta
      .eq('estado', 'Hecha')
      .order('hecha_en', { ascending: false });
  } else {
    consulta = consulta
      .neq('estado', 'Hecha')
      .order('vence', { nullsFirst: false });
  }
  if (ver === 'vencidas') consulta = consulta.lt('vence', hoy());
  if (ver === 'mias') {
    consulta = consulta.or(
      `responsable_id.eq.${perfil.id},and(responsable_id.is.null,area.eq."${perfil.area}")`,
    );
  }
  if (area) consulta = consulta.eq('area', area);
  if (empresa) consulta = consulta.eq('empresa_id', empresa);
  const { data } = await consulta.overrideTypes<
    TareaConArtista[],
    { merge: false }
  >();
  const tareas = data ?? [];

  const link = (v: string) => {
    const q = new URLSearchParams({ ver: v });
    if (area) q.set('area', area);
    if (empresa) q.set('empresa', empresa);
    return `/tareas?${q.toString()}`;
  };

  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">Procedimientos de las 4 empresas</p>
          <h1>Tareas</h1>
        </div>
      </header>

      <nav className="filtros" aria-label="Vistas">
        {Object.entries(VISTAS).map(([v, texto]) => (
          <Link
            key={v}
            href={link(v)}
            className={`btn chico ${v === ver ? '' : 'suave'}`}
            aria-current={v === ver ? 'page' : undefined}
          >
            {texto}
          </Link>
        ))}
      </nav>

      <form className="filtros">
        <input type="hidden" name="ver" value={ver} />
        <select name="area" defaultValue={area} aria-label="Área">
          <option value="">Todas las áreas</option>
          {AREAS.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <select name="empresa" defaultValue={empresa} aria-label="Empresa">
          <option value="">Todas las empresas</option>
          {lista.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
        <button className="suave">Filtrar</button>
      </form>

      <section className="card">
        <p className="muted">
          <small>
            {tareas.length} {tareas.length === 1 ? 'tarea' : 'tareas'}
            {ver === 'mias' && ` · ${perfil.area} y las asignadas a ti`}
          </small>
        </p>
        {tareas.length ? (
          <ul className="lista">
            {tareas.map((t) => (
              <FilaTarea
                key={t.id}
                tarea={t}
                equipo={personas}
                empresas={lista}
                puedeBorrar={esJefe}
              />
            ))}
          </ul>
        ) : (
          <p className="vacio">No hay tareas en esta vista.</p>
        )}
      </section>
    </main>
  );
}
