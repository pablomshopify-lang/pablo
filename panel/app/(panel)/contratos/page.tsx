import type { Metadata } from 'next';
import Aviso from '@/components/Aviso';
import FilaContrato from '@/components/FilaContrato';
import type { ContratoConArtista } from '@/components/FilaContrato';
import { ESTADOS_CONTRATO } from '@/lib/datos';
import { empresas, equipo, sesion } from '@/lib/sesion';

export const metadata: Metadata = { title: 'Contratos' };

export default async function Contratos({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; empresa?: string; error?: string }>;
}) {
  const { estado = '', empresa = '', error } = await searchParams;
  const { supabase, esCeo, esJefe } = await sesion();
  const [lista, personas] = await Promise.all([empresas(), equipo()]);

  let consulta = supabase
    .from('contratos')
    .select('*, artistas(nombre_artistico, regalias_meses)')
    .order('creado_en', { ascending: false });
  if (estado) consulta = consulta.eq('estado', estado);
  if (empresa) consulta = consulta.eq('empresa_id', empresa);
  const { data } = await consulta.overrideTypes<
    ContratoConArtista[],
    { merge: false }
  >();
  const contratos = data ?? [];
  const porFirmar = contratos.filter((c) => c.estado === 'Enviado al artista');
  const resto = estado
    ? contratos
    : contratos.filter((c) => c.estado !== 'Enviado al artista');

  const fila = (c: ContratoConArtista) => (
    <FilaContrato
      key={c.id}
      contrato={c}
      empresas={lista}
      equipo={personas}
      esCeo={esCeo}
      esJefe={esJefe}
      volver="/contratos"
      regaliasArtista={c.artistas?.regalias_meses ?? 3}
      conArtista
    />
  );

  return (
    <main className="wrap">
      <header className="cabeza">
        <div>
          <p className="eyebrow">Solo el CEO marca un contrato como firmado</p>
          <h1>Contratos</h1>
        </div>
      </header>
      <Aviso error={error} />

      <form className="filtros">
        <select name="estado" defaultValue={estado} aria-label="Estado">
          <option value="">Todos los estados</option>
          {ESTADOS_CONTRATO.map((e) => (
            <option key={e}>{e}</option>
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

      {!estado && porFirmar.length > 0 && (
        <section className="card">
          <h2>{esCeo ? 'Esperan tu firma' : 'Esperan la firma del CEO'}</h2>
          <ul className="lista">{porFirmar.map(fila)}</ul>
        </section>
      )}

      <section className="card">
        <h2>{estado || 'Todos'}</h2>
        {resto.length ? (
          <ul className="lista">{resto.map(fila)}</ul>
        ) : (
          <p className="vacio">
            No hay contratos aquí. Se crean desde la ficha de cada artista.
          </p>
        )}
      </section>
    </main>
  );
}
