import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LINKS } from '@/lib/links';

export function Nav() {
  return (
    <header className="nav">
      <nav className="nav-inner" aria-label="Principal">
        <Link href="/" className="nav-logo" aria-label="Mvck Music, inicio">
          <Logo className="logo" />
          <span className="logo-tag">Music</span>
        </Link>
        <ul className="nav-links">
          <li className="hide-sm">
            <a href="#servicios">Servicios</a>
          </li>
          <li className="hide-sm">
            <a href="#como-funciona">Cómo funciona</a>
          </li>
          <li className="hide-sm">
            <a href="#nosotros">Nosotros</a>
          </li>
          <li>
            <a href={LINKS.platform} className="button button-small">
              Ingresar
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
