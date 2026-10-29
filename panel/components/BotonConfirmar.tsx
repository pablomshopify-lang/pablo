'use client';

import type { ReactNode } from 'react';

/** Botón que pide confirmación antes de enviar su formulario. */
export default function BotonConfirmar({
  pregunta,
  className,
  children,
}: {
  pregunta: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      className={className}
      onClick={(e) => {
        if (!window.confirm(pregunta)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
