'use client';

import { useActionState } from 'react';
import { cambiarClave } from '@/app/acciones';

export default function CambiarClave() {
  const [estado, accion, enviando] = useActionState(cambiarClave, null);
  return (
    <form action={accion} className="form">
      <div className="grid">
        <label className="campo">
          Clave nueva
          <input
            name="clave"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </label>
        <label className="campo">
          Repite la clave
          <input
            name="repetir"
            type="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </label>
      </div>
      {estado === 'ok' && <p className="aviso bien">Clave cambiada.</p>}
      {estado && estado !== 'ok' && <p className="aviso error">{estado}</p>}
      <div>
        <button className="suave" disabled={enviando}>
          Cambiar clave
        </button>
      </div>
    </form>
  );
}
