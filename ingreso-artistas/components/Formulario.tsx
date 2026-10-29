'use client';

import { useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { DATOS, REDES } from '@/lib/campos';
import type { Campo } from '@/lib/campos';
import { SERVICIOS } from '@/lib/servicios';
import type { Pregunta } from '@/lib/servicios';

const PASOS = ['Tus datos', 'Tus redes', 'Servicios', 'Enviar'] as const;

type Estado = 'editando' | 'enviando' | 'listo' | 'error';

export function Formulario() {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState<Record<string, string>>({});
  const [redes, setRedes] = useState<Record<string, string>>({});
  const [servicios, setServicios] = useState<string[]>([]);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [comentarios, setComentarios] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [aviso, setAviso] = useState('');
  const [estado, setEstado] = useState<Estado>('editando');
  const [id, setId] = useState('');

  const elegidos = SERVICIOS.filter((s) => servicios.includes(s.id));

  function validar(): string {
    if (paso === 0) {
      const falta = DATOS.find((c) => c.requerido && !datos[c.id]?.trim());
      if (falta) return `Falta: ${falta.label}`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email ?? ''))
        return 'Revisa tu correo';
    }
    if (paso === 2 && servicios.length === 0)
      return 'Elige al menos un servicio';
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
          datos,
          redes,
          servicios,
          respuestas,
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
          {elegidos.map((s) => (
            <li key={s.id} style={{ '--c': s.color } as CSSProperties}>
              <strong>{s.nombre}</strong>
              <span>{s.queSigue}</span>
            </li>
          ))}
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
          <legend>¿Qué necesitas del Holding?</legend>
          <p className="muted">Puedes elegir más de uno.</p>
          <div className="servicios">
            {SERVICIOS.map((s) => {
              const activo = servicios.includes(s.id);
              return (
                <div
                  key={s.id}
                  className={`servicio${activo ? ' activo' : ''}`}
                  style={{ '--c': s.color } as CSSProperties}
                >
                  <label className="servicio-cabeza">
                    <input
                      type="checkbox"
                      checked={activo}
                      onChange={() =>
                        setServicios(
                          activo
                            ? servicios.filter((x) => x !== s.id)
                            : [...servicios, s.id],
                        )
                      }
                    />
                    <span>
                      <strong>{s.nombre}</strong>
                      <small>{s.resumen}</small>
                    </span>
                  </label>
                  {activo && (
                    <div className="grid preguntas">
                      {s.preguntas.map((p) => {
                        const clave = `${s.id}.${p.id}`;
                        return (
                          <PreguntaExtra
                            key={clave}
                            pregunta={p}
                            valor={respuestas[clave] ?? ''}
                            onChange={(v) =>
                              setRespuestas({ ...respuestas, [clave]: v })
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
            <dt>Servicios</dt>
            <dd>{elegidos.map((s) => s.nombre).join(', ')}</dd>
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
              Acepto que el Holding MVCK use estos datos para evaluar y
              gestionar mi solicitud.
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
              : 'Enviar solicitud'}
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
