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
          aria-label="Maverick Records, inicio"
        >
          <Logo className="logo" />
          <span className="nav-label">Records</span>
        </Link>
        <ul className="nav-links">
          <li className="hide-sm">
            <a href="#quienes-somos">Quiénes somos</a>
          </li>
          <li className="hide-sm">
            <a href="#que-hacemos">Qué hacemos</a>
          </li>
          <li className="hide-sm">
            <a href="#compromiso">Compromiso</a>
          </li>
          <li>
            <a href={`mailto:${LINKS.email}`} className="button button-small">
              Envía tu música
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
