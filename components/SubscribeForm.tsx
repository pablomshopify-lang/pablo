'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'ok'; message: string }
  | { kind: 'error'; message: string };

type FormspreeResponse = { errors?: { message: string }[] };

type SubscribeFormProps = { className?: string };

export function SubscribeForm({ className }: SubscribeFormProps) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!EMAIL_RE.test(email.trim())) {
      setStatus({
        kind: 'error',
        message: 'Escribe un correo válido, por ejemplo nombre@dominio.com.',
      });
      return;
    }

    // Sin ID configurado, el formulario funciona en modo demostración.
    if (!FORMSPREE_ID) {
      setStatus({
        kind: 'ok',
        message: '¡Listo! (Modo demostración: falta NEXT_PUBLIC_FORMSPREE_ID.)',
      });
      setEmail('');
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
        message: '¡Gracias! Te escribiremos con lo próximo de Maverick Live.',
      });
      setEmail('');
    } catch (err) {
      const detail =
        err instanceof Error && err.message ? ` (${err.message})` : '';
      setStatus({
        kind: 'error',
        message: `No pudimos registrar tu correo. Inténtalo de nuevo.${detail}`,
      });
    }
  }

  const sending = status.kind === 'sending';
  const message =
    status.kind === 'ok' || status.kind === 'error' ? status.message : '';

  return (
    <div className={className}>
      <form
        className="subscribe"
        onSubmit={(e) => void handleSubmit(e)}
        noValidate
      >
        <label className="sr-only" htmlFor={`${id}-email`}>
          Correo electrónico
        </label>
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          inputMode="email"
          placeholder="tu@correo.com"
          autoComplete="email"
          required
          value={email}
          aria-invalid={status.kind === 'error'}
          aria-describedby={`${id}-status`}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          value="Nueva suscripción · Maverick Live"
        />
        <button className="button" type="submit" disabled={sending}>
          {sending ? 'Enviando…' : 'Avísame'}
        </button>
      </form>
      <p
        id={`${id}-status`}
        className="subscribe-status"
        data-kind={status.kind}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </div>
  );
}
