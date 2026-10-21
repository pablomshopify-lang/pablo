import Link from 'next/link';
import { Logo } from '@/components/Logo';

export function Nav() {
  return (
    <header className="nav">
      <nav className="nav-inner" aria-label="Principal">
        <Link href="/" className="nav-logo">
          <Logo className="logo" gradientId="logo-nav" />
        </Link>
        <ul className="nav-links">
          <li>
            <a href="#experiencia">Experiencia</a>
          </li>
          <li>
            <a href="#suscribete" className="button button-small">
              Avísame
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
