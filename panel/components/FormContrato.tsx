import { borrarContrato, crearContrato, editarContrato } from '@/app/acciones';
import type { Contrato, Empresa } from '@/lib/datos';
import { ESTADOS_CONTRATO, TIPO_CONTRATO } from '@/lib/datos';

/** Formulario para crear o editar un contrato. */
export default function FormContrato({
  artistaId,
  empresas,
  contrato,
  esCeo,
  esJefe,
  volver,
  empresaInicial,
}: {
  artistaId: string;
  empresas: Empresa[];
  contrato?: Contrato;
  esCeo: boolean;
  esJefe: boolean;
  volver: string;
  empresaInicial?: string;
}) {
  const empresa = contrato?.empresa_id ?? empresaInicial ?? empresas[0]?.id;
  // Solo el CEO ve «Firmado» como opción (la base de datos también lo exige).
  const estados = ESTADOS_CONTRATO.filter(
    (e) => e !== 'Firmado' || esCeo || contrato?.estado === 'Firmado',
  );
  return (
    <div className="form">
      <form action={contrato ? editarContrato : crearContrato} className="form">
        {contrato && <input type="hidden" name="id" value={contrato.id} />}
        <input type="hidden" name="artista_id" value={artistaId} />
        <input type="hidden" name="volver" value={volver} />
        <div className="grid">
          <label className="campo">
            Empresa
            <select name="empresa_id" defaultValue={empresa}>
              {empresas.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="campo">
            Tipo
            <input
              name="tipo"
              defaultValue={
                contrato?.tipo ?? TIPO_CONTRATO[empresa ?? ''] ?? ''
              }
              placeholder="Distribución, editorial…"
            />
          </label>
          <label className="campo">
            Estado
            <select name="estado" defaultValue={contrato?.estado ?? 'Borrador'}>
              {estados.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </label>
          <label className="campo">
            Inicio
            <input
              type="date"
              name="inicio"
              defaultValue={contrato?.inicio ?? ''}
            />
          </label>
          <label className="campo">
            Término
            <input type="date" name="fin" defaultValue={contrato?.fin ?? ''} />
          </label>
          <label className="campo">
            Regalías cada (meses)
            <input
              type="number"
              name="regalias_meses"
              min={1}
              max={24}
              defaultValue={contrato?.regalias_meses ?? ''}
              placeholder="La del artista"
            />
          </label>
          <label className="campo">
            % para el artista
            <input
              type="number"
              name="porcentaje_artista"
              min={0}
              max={100}
              step="0.01"
              defaultValue={contrato?.porcentaje_artista ?? ''}
            />
          </label>
          <label className="campo">
            Link al documento (Drive)
            <input
              type="url"
              name="documento_url"
              defaultValue={contrato?.documento_url ?? ''}
              placeholder="https://drive.google.com/…"
            />
          </label>
          <label className="campo ancho">
            Notas
            <textarea name="notas" defaultValue={contrato?.notas ?? ''} />
          </label>
        </div>
        <div className="acciones">
          <button className={contrato ? 'suave' : 'marca-btn'}>
            {contrato ? 'Guardar contrato' : 'Crear contrato'}
          </button>
        </div>
      </form>
      {contrato && esJefe && (
        <form action={borrarContrato}>
          <input type="hidden" name="id" value={contrato.id} />
          <input type="hidden" name="artista_id" value={artistaId} />
          <button className="peligro chico">Borrar contrato</button>
        </form>
      )}
    </div>
  );
}
