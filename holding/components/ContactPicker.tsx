'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { MailIcon } from '@/components/Icons';
import { mailto } from '@/lib/brands';

export type Contact = {
  id: string;
  label: string;
  /** Para qué escribir a este correo. */
  topic: string;
  email: string;
  accent: string;
};

/**
 * Elige con quién hablar (el holding o una de las marcas) y muestra su correo,
 * con un botón para escribir y otro para copiarlo.
 */
export function ContactPicker({ contacts }: { contacts: readonly Contact[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = contacts[active];
  if (!current) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin permiso para copiar: el correo sigue visible para seleccionarlo.
    }
  };

  return (
    <div
      className="picker"
      style={{ '--brand': current.accent } as CSSProperties}
    >
      <div className="picker-chips" role="radiogroup" aria-label="Con quién">
        {contacts.map((contact, i) => (
          <button
            key={contact.id}
            type="button"
            role="radio"
            aria-checked={i === active}
            className="chip"
            style={{ '--dot': contact.accent } as CSSProperties}
            onClick={() => {
              setActive(i);
              setCopied(false);
            }}
          >
            <span className="chip-dot" aria-hidden="true" />
            {contact.label}
          </button>
        ))}
      </div>

      <div className="picker-card" key={current.id}>
        <p className="picker-topic">{current.topic}</p>
        <p className="picker-email">{current.email}</p>
        <div className="picker-actions">
          <a
            className="button"
            href={mailto(
              current.email,
              `Contacto desde la web · ${current.label}`,
            )}
          >
            <MailIcon />
            Escribir correo
          </a>
          <button
            type="button"
            className="button button-ghost"
            onClick={() => void copy()}
          >
            <span aria-live="polite">
              {copied ? 'Copiado' : 'Copiar correo'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
