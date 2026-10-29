import Link from 'next/link';
import { firmarContrato } from '@/app/acciones';
import type { Contrato, Empresa, Perfil } from '@/lib/datos';
import { fechaCorta, proximaLiquidacion } from '@/lib/datos';
import { ChipEmpresa } from './Empresa';
import FormContrato from './FormContrato';
import Vence from './Vence';

export type ContratoConArtista = Contrato & {
  artistas: { nombre_artistico: string; regalias_meses: number } | null;
};

const CLASE: Record<string, string> = {
  Firmado: 'ok',
  'Enviado al artista': 'pronto',
  Vencido: 'vencida',
};

export default function FilaContrato({
  contrato: c,
  empresas,
  equipo,
  esCeo,
  esJefe,
  volver,
  regaliasArtista,
  conArtista = false,
}: {
  contrato: Contrato | ContratoConArtista;
  empresas: Empresa[];
  equipo: Perfil[];
  esCeo: boolean;
  esJefe: boolean;
  volver: string;
  regaliasArtista: number;
  conArtista?: boolean;
}) {
  const artista = 'artistas' in c ? c.artistas : null;
  const meses = c.regalias_meses ?? regaliasArtista;
  const liquidacion =
    c.estado === 'Firmado' && c.inicio
      ? proximaLiquidacion(c.inicio, meses)
      : null;
  const firmo = equipo.find((p) => p.id === c.firmado_por);
  return (
    <li style={{ display: 'grid', gap: '0.5rem' }}>
      <div className="empresa-cabeza">
        <div className="crece">
          <strong>
            {conArtista && artista && (
              <>
                <Link href={`/artistas/${c.artista_id}#contratos`}>
                  {artista.nombre_artistico}
                </Link>
                {' · '}
              </>
            )}
            {c.tipo}
          </strong>
          <small className="muted">
            <span className={CLASE[c.estado]}>{c.estado}</span>
            {c.firmado_en &&
              ` por ${firmo?.nombre ?? 'el CEO'} el ${fechaCorta(c.firmado_en)}`}
            {c.inicio && ` · desde ${fechaCorta(c.inicio)}`}
            {c.fin && (
              <>
                {' · hasta '}
                <Vence fecha={c.fin} hecha={c.estado !== 'Firmado'} />
              </>
            )}
            {c.porcentaje_artista != null &&
              ` · ${c.porcentaje_artista}% artista`}
            {` · regalías cada ${meses} meses`}
            {liquidacion && ` · próxima liquidación ${fechaCorta(liquidacion)}`}
          </small>
        </div>
        <div className="acciones">
          <ChipEmpresa empresa={empresas.find((e) => e.id === c.empresa_id)} />
          {c.documento_url && (
            <a
              href={c.documento_url}
              target="_blank"
              rel="noreferrer"
              className="btn suave chico"
            >
              Ver documento
            </a>
          )}
          {esCeo && c.estado !== 'Firmado' && (
            <form action={firmarContrato}>
              <input type="hidden" name="id" value={c.id} />
              <input type="hidden" name="artista_id" value={c.artista_id} />
              <button className="marca-btn chico">Marcar firmado</button>
            </form>
          )}
        </div>
      </div>
      <details>
        <summary>Editar contrato ▾</summary>
        <FormContrato
          artistaId={c.artista_id}
          empresas={empresas}
          contrato={c}
          esCeo={esCeo}
          esJefe={esJefe}
          volver={volver}
        />
      </details>
    </li>
  );
}
