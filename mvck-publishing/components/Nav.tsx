import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LINKS } from '@/lib/links';

export function Nav() {
  return (
    <header className="nav">
      <nav className="nav-inner" aria-label="Principal">
        <Link
          href="/"
          className="nav-logo"
          aria-label="Mvck Publishing, inicio"
        >
          <Logo className="logo" />
        </Link>
        <ul className="nav-links">
          <li className="hide-sm">
            <a href="#regalias">Regalías</a>
          </li>
          <li className="hide-sm">
            <a href="#como-funciona">Cómo funciona</a>
          </li>
          <li className="hide-sm">
            <a href="#preguntas">Preguntas</a>
          </li>
          <li>
            <a href={`mailto:${LINKS.email}`} className="button button-small">
              Contáctanos
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
