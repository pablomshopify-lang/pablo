'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { DATOS, REDES } from '@/lib/campos';
import type { Campo } from '@/lib/campos';
import { EMPRESAS } from '@/lib/empresas';
import type { Pregunta } from '@/lib/empresas';

type Estado = 'editando' | 'enviando' | 'listo' | 'error';

export function Formulario({ empresaId }: { empresaId: string }) {
  const empresa = EMPRESAS.find((e) => e.id === empresaId) ?? EMPRESAS[0]!;
  const otras = EMPRESAS.filter((e) => e.id !== empresa.id);
  const PASOS = ['Tus datos', 'Tus redes', empresa.nombre, 'Enviar'];

  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState<Record<string, string>>({});
  const [redes, setRedes] = useState<Record<string, string>>({});
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [intereses, setIntereses] = useState<string[]>([]);
  const [comentarios, setComentarios] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [aviso, setAviso] = useState('');
  const [estado, setEstado] = useState<Estado>('editando');
  const [id, setId] = useState('');

  function validar(): string {
    if (paso === 0) {
      const falta = DATOS.find((c) => c.requerido && !datos[c.id]?.trim());
      if (falta) return `Falta: ${falta.label}`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email ?? ''))
        return 'Revisa tu correo';
    }
    if (paso === 3 && !acepta) return 'Debes aceptar el uso de tus datos';
    return '';
  }

  function siguiente() {
    const error = validar();
    setAviso(error);
    if (!error) {
      setPaso((p) => p + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (paso < PASOS.length - 1) return siguiente();
    const error = validar();
    setAviso(error);
    if (error) return;

    setEstado('enviando');
    const gotcha = new FormData(e.currentTarget).get('_gotcha');
    try {
      const res = await fetch('/api/ingreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empresa: empresa.id,
          datos,
          redes,
          respuestas,
          intereses,
          comentarios,
          _gotcha: gotcha,
        }),
      });
      const json = (await res.json()) as { ok: boolean; id?: string };
      if (!json.ok) throw new Error();
      setId(json.id ?? '');
      setEstado('listo');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setEstado('error');
    }
  }

  if (estado === 'listo') {
    return (
      <section className="card listo" aria-live="polite">
        <p className="eyebrow">Solicitud recibida</p>
        <h2>¡Gracias, {datos.nombre_artistico}!</h2>
        <p className="muted">
          Tu número de ingreso es <strong>{id}</strong>. Te escribiremos a{' '}
          {datos.email}.
        </p>
        <h3>Qué sigue</h3>
        <ul className="sigue">
          <li>
            <strong>{empresa.nombre}</strong>
            <span>{empresa.queSigue}</span>
          </li>
          {intereses.length > 0 && (
            <li>
              <strong>También te interesa</strong>
              <span>
                {otras
                  .filter((o) => intereses.includes(o.id))
                  .map((o) => o.nombre)
                  .join(', ')}
                : le pasaremos tu ficha a ese equipo.
              </span>
            </li>
          )}
        </ul>
      </section>
    );
  }

  return (
    <form className="card" onSubmit={(e) => void enviar(e)} noValidate>
      <ol className="pasos" aria-label="Pasos">
        {PASOS.map((nombre, i) => (
          <li
            key={nombre}
            className={i === paso ? 'actual' : i < paso ? 'hecho' : ''}
          >
            <span>{i + 1}</span>
            {nombre}
          </li>
        ))}
      </ol>

      {/* Campo oculto anti-robots */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="oculto"
        aria-hidden
      />

      {paso === 0 && (
        <fieldset>
          <legend>Cuéntanos quién eres</legend>
          <div className="grid">
            {DATOS.map((c) => (
              <Entrada
                key={c.id}
                campo={c}
                valor={datos[c.id] ?? ''}
                onChange={(v) => setDatos({ ...datos, [c.id]: v })}
              />
            ))}
          </div>
        </fieldset>
      )}

      {paso === 1 && (
        <fieldset>
          <legend>¿Dónde te encontramos?</legend>
          <p className="muted">Llena las que tengas. Ninguna es obligatoria.</p>
          <div className="grid">
            {REDES.map((c) => (
              <Entrada
                key={c.id}
                campo={c}
                valor={redes[c.id] ?? ''}
                onChange={(v) => setRedes({ ...redes, [c.id]: v })}
              />
            ))}
          </div>
        </fieldset>
      )}

      {paso === 2 && (
        <fieldset>
          <legend>Tu proyecto con {empresa.nombre}</legend>
          <div className="grid">
            {empresa.preguntas.map((p) => (
              <PreguntaExtra
                key={p.id}
                pregunta={p}
                valor={respuestas[p.id] ?? ''}
                onChange={(v) => setRespuestas({ ...respuestas, [p.id]: v })}
              />
            ))}
          </div>
          <div className="intereses">
            <p className="muted">
              ¿Te interesa también otra empresa del Holding? (opcional)
            </p>
            {otras.map((o) => (
              <label key={o.id} className="check">
                <input
                  type="checkbox"
                  checked={intereses.includes(o.id)}
                  onChange={(e) =>
                    setIntereses(
                      e.target.checked
                        ? [...intereses, o.id]
                        : intereses.filter((x) => x !== o.id),
                    )
                  }
                />
                <span>
                  <strong>{o.nombre}</strong> · {o.resumen}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {paso === 3 && (
        <fieldset>
          <legend>Revisa y envía</legend>
          <dl className="resumen">
            <dt>Artista</dt>
            <dd>
              {datos.nombre_artistico} · {datos.tipo} · {datos.genero}
            </dd>
            <dt>Contacto</dt>
            <dd>
              {datos.email} · {datos.telefono}
            </dd>
            <dt>Redes</dt>
            <dd>
              {REDES.filter((c) => redes[c.id])
                .map((c) => c.label)
                .join(', ') || 'Ninguna'}
            </dd>
            <dt>Empresa</dt>
            <dd>{empresa.nombre}</dd>
          </dl>
          <label className="campo">
            <span>¿Algo más que debamos saber?</span>
            <textarea
              rows={4}
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
            />
            <span>
              Acepto que {empresa.nombre} y el Holding MVCK usen estos datos
              para evaluar y gestionar mi ingreso.
            </span>
          </label>
        </fieldset>
      )}

      {aviso && (
        <p className="aviso" role="alert">
          {aviso}
        </p>
      )}
      {estado === 'error' && (
        <p className="aviso" role="alert">
          No pudimos enviar tu solicitud. Inténtalo de nuevo en un momento.
        </p>
      )}

      <div className="acciones">
        {paso > 0 && (
          <button
            type="button"
            className="button button-ghost"
            onClick={() => {
              setAviso('');
              setPaso(paso - 1);
            }}
          >
            Atrás
          </button>
        )}
        <button
          type="submit"
          className="button"
          disabled={estado === 'enviando'}
        >
          {paso < PASOS.length - 1
            ? 'Continuar'
            : estado === 'enviando'
              ? 'Enviando…'
              : 'Enviar'}
        </button>
      </div>
    </form>
  );
}

function Entrada({
  campo,
  valor,
  onChange,
}: {
  campo: Campo;
  valor: string;
  onChange: (v: string) => void;
}) {
  const comun = {
    id: campo.id,
    value: valor,
    required: campo.requerido,
    placeholder: campo.placeholder,
  };
  return (
    <label
      className={`campo${campo.tipo === 'textarea' ? ' ancho' : ''}`}
      htmlFor={campo.id}
    >
      <span>
        {campo.label}
        {campo.requerido && <em aria-hidden> *</em>}
      </span>
      {campo.tipo === 'textarea' ? (
        <textarea
          rows={4}
          {...comun}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : campo.tipo === 'select' ? (
        <select {...comun} onChange={(e) => onChange(e.target.value)}>
          <option value="">Elige…</option>
          {campo.opciones?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type={campo.tipo ?? 'text'}
          {...comun}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function PreguntaExtra({
  pregunta,
  valor,
  onChange,
}: {
  pregunta: Pregunta;
  valor: string;
  onChange: (v: string) => void;
}) {
  const opciones = pregunta.tipo === 'si-no' ? ['Sí', 'No'] : pregunta.opciones;
  return (
    <label className="campo ancho">
      <span>{pregunta.label}</span>
      {opciones ? (
        <select value={valor} onChange={(e) => onChange(e.target.value)}>
          <option value="">Elige…</option>
          {opciones.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          value={valor}
          placeholder={pregunta.ayuda}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}
