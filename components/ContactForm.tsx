'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';

// Formulario de Formspree que reenvía cada mensaje al correo oficial
// (contact@mavericklive.cl, configurado en Formspree). Se puede cambiar con la
// variable NEXT_PUBLIC_FORMSPREE_ID sin tocar el código.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'xyekqdeo';
export const CONTACT_EMAIL = 'contact@mavericklive.cl';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'ok'; message: string }
  | { kind: 'error'; message: string };

type FormspreeResponse = { errors?: { message: string }[] };

const text = (form: HTMLFormElement, name: string) => {
  const field = form.elements.namedItem(name);
  return field instanceof HTMLInputElement ||
    field instanceof HTMLTextAreaElement
    ? field.value.trim()
    : '';
};

export function ContactForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!text(form, 'nombre') || !text(form, 'mensaje')) {
      setStatus({
        kind: 'error',
        message: 'Escribe tu nombre y cuéntanos qué necesitas.',
      });
      return;
    }
    if (!EMAIL_RE.test(text(form, 'email'))) {
      setStatus({
        kind: 'error',
        message: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
      });
      return;
    }

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as FormspreeResponse;
        throw new Error(data.errors?.map((e) => e.message).join(', ') ?? '');
      }
      setStatus({
        kind: 'ok',
        message: '¡Gracias! Recibimos tu mensaje y te responderemos pronto.',
      });
      form.reset();
    } catch (err) {
      const detail =
        err instanceof Error && err.message ? ` (${err.message})` : '';
      setStatus({
        kind: 'error',
        message: `No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a ${CONTACT_EMAIL}.${detail}`,
      });
    }
  }

  const sending = status.kind === 'sending';
  const message =
    status.kind === 'ok' || status.kind === 'error' ? status.message : '';

  return (
    <form
      className="contact-form"
      onSubmit={(e) => void handleSubmit(e)}
      noValidate
    >
      <div className="field">
        <label htmlFor={`${id}-nombre`}>Nombre</label>
        <input id={`${id}-nombre`} name="nombre" autoComplete="name" required />
      </div>
      <div className="field">
        <label htmlFor={`${id}-email`}>Correo</label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="field">
        <label htmlFor={`${id}-telefono`}>Teléfono (opcional)</label>
        <input
          id={`${id}-telefono`}
          type="tel"
          name="telefono"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>
      <div className="field">
        <label htmlFor={`${id}-empresa`}>Empresa (opcional)</label>
        <input
          id={`${id}-empresa`}
          name="empresa"
          autoComplete="organization"
        />
      </div>
      <div className="field field-wide">
        <label htmlFor={`${id}-mensaje`}>¿Qué evento tienes en mente?</label>
        <textarea
          id={`${id}-mensaje`}
          name="mensaje"
          rows={5}
          placeholder="Tipo de evento, fecha, lugar y cantidad de personas."
          required
        />
      </div>
      <input
        className="honeypot"
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <input
        type="hidden"
        name="_subject"
        value="Nuevo mensaje de contacto · Maverick Live"
      />
      <div className="field-wide contact-actions">
        <button className="button" type="submit" disabled={sending}>
          {sending ? 'Enviando…' : 'Enviar mensaje'}
        </button>
        <p
          className="contact-status"
          data-kind={status.kind}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </div>
    </form>
  );
}
