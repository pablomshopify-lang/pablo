'use client';

import { useActionState } from 'react';
import { entrar } from '@/app/acciones';

export default function Login({ volver }: { volver: string }) {
  const [error, accion, enviando] = useActionState(entrar, null);
  return (
    <form action={accion} className="form">
      <input type="hidden" name="volver" value={volver} />
      <label className="campo">
        Correo
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className="campo">
        Clave
        <input
          name="clave"
          type="password"
          autoComplete="current-password"
          required
        />
      </label>
      {error && <p className="aviso error">{error}</p>}
      <button className="marca-btn" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  );
}
