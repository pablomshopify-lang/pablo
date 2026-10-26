'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';
import { DEMO_MAILTO } from '@/lib/links';

const SECTIONS = [
  { href: '#quienes-somos', label: 'Quiénes somos' },
  { href: '#que-hacemos', label: 'Qué hacemos' },
  { href: '#compromiso', label: 'Compromiso' },
  { href: '#servicios', label: 'Servicios' },
] as const;

/**
 * Barra superior translúcida. Se esconde al bajar y vuelve al subir, para dejar
 * espacio al contenido. En celular abre un menú a pantalla completa.
 */
export function Nav() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      // Pequeño margen para no parpadear con movimientos mínimos.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className="nav"
      data-hidden={hidden && !open ? '' : undefined}
      data-scrolled={scrolled || open ? '' : undefined}
      data-open={open ? '' : undefined}
    >
      <nav className="nav-inner" aria-label="Principal">
        <Link
          href="/"
          className="nav-logo"
          aria-label="Maverick Records, inicio"
          onClick={close}
        >
          <Logo className="logo" />
          <span className="nav-label">Records</span>
        </Link>
        <ul className="nav-links">
          {SECTIONS.map((section) => (
            <li key={section.href} className="hide-sm">
              <a href={section.href}>{section.label}</a>
            </li>
          ))}
          <li className="hide-sm">
            <a href={DEMO_MAILTO} className="button button-small">
              Envía tu música
            </a>
          </li>
          <li className="show-sm">
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
            </button>
          </li>
        </ul>
      </nav>

      <div id="menu" className="menu" hidden={!open}>
        <ul>
          {SECTIONS.map((section, i) => (
            <li
              key={section.href}
              style={{ animationDelay: `${60 + i * 50}ms` }}
            >
              <a href={section.href} onClick={close}>
                {section.label}
              </a>
            </li>
          ))}
        </ul>
        <a href={DEMO_MAILTO} className="button menu-cta" onClick={close}>
          Envía tu música
        </a>
      </div>
    </header>
  );
}
