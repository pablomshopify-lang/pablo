import type { ReactNode } from 'react';
import { Isotype, Logo } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Reveal } from '@/components/Reveal';
import { LINKS } from '@/lib/links';

type Service = {
  title: string;
  text: string;
  icon: ReactNode;
  wide: boolean;
  href?: string;
};

const SERVICES: Service[] = [
  {
    title: 'Distribución digital',
    text: 'Llevamos tu música a oyentes de todo el mundo, en las plataformas donde la gente escucha.',
    icon: <GlobeIcon />,
    wide: true,
  },
  {
    title: 'Publishing',
    text: 'Adquirimos, protegemos y promocionamos tus derechos de autor, y recaudamos tus regalías.',
    icon: <ShieldIcon />,
    wide: false,
    href: LINKS.publishing,
  },
  {
    title: 'Marketing',
    text: 'Estrategias de marketing digital para que tu audiencia crezca lanzamiento a lanzamiento.',
    icon: <ChartIcon />,
    wide: false,
  },
  {
    title: 'Gestión de canales',
    text: 'Administramos tus canales y tiendas digitales para que tú solo te preocupes de crear.',
    icon: <ChannelsIcon />,
    wide: true,
  },
];

const STEPS = [
  {
    title: 'Sube tu música',
    text: 'Ingresa a la plataforma y carga tu lanzamiento con su portada y datos.',
  },
  {
    title: 'La llevamos al mundo',
    text: 'Distribuimos tu música y cuidamos tus derechos en cada territorio.',
  },
  {
    title: 'Crece y cobra',
    text: 'Te ayudamos a sumar oyentes y recaudamos tus regalías.',
  },
] as const;

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Nav />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-glow" aria-hidden="true" />
          <Reveal>
            <p className="eyebrow">
              <span className="dot" aria-hidden="true" />
              Distribución musical
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="display">
              Tu música,
              <br />
              <span className="gradient-text">en todo el mundo.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Descubre la plataforma que conecta tu música con el mundo.
            </p>
          </Reveal>
          <Reveal delay={240} className="actions">
            <a href={LINKS.platform} className="button">
              Ingresa a la plataforma
            </a>
            <a href="#servicios" className="button button-ghost">
              Conoce nuestros servicios
            </a>
          </Reveal>
          <Reveal delay={320} className="hero-visual">
            <Equalizer />
            <Isotype className="hero-mark" />
          </Reveal>
        </section>

        <section className="section statement" aria-labelledby="impulsa-title">
          <Reveal>
            <p className="eyebrow">Impulsa tu carrera</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="impulsa-title" className="headline">
              Tú creas la música.{' '}
              <span className="gradient-text">Nosotros la hacemos sonar.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Distribuimos la música de nuestros artistas en todo el mundo y nos
              encargamos de sus derechos de autor, regalías y marketing.
            </p>
          </Reveal>
        </section>

        <section
          id="servicios"
          className="section services"
          aria-labelledby="servicios-title"
        >
          <Reveal>
            <h2 id="servicios-title" className="headline">
              Nuestros servicios
            </h2>
          </Reveal>
          <ul className="bento">
            {SERVICES.map((service, i) => (
              <li key={service.title} className={service.wide ? 'wide' : ''}>
                <Reveal className="tile" delay={i * 80}>
                  <span className="tile-icon">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  {service.href && (
                    <a className="tile-link" href={service.href}>
                      Visitar Mvck Publishing <span aria-hidden="true">→</span>
                    </a>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="como-funciona"
          className="section"
          aria-labelledby="como-title"
        >
          <Reveal>
            <h2 id="como-title" className="headline">
              Simple, de principio a fin.
            </h2>
          </Reveal>
          <ol className="steps">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <Reveal className="step" delay={i * 100}>
                  <span className="step-number">0{i + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="nosotros"
          className="section about"
          aria-labelledby="nosotros-title"
        >
          <Reveal className="about-card">
            <p className="eyebrow">Acerca de nosotros</p>
            <h2 id="nosotros-title" className="headline">
              100% <span className="gradient-text">independientes.</span>
            </h2>
            <p className="lede">
              Somos una plataforma de distribución digital independiente, que
              respeta cada acuerdo legal. Asesoramos a artistas independientes
              con un equipo de profesionales de la comunicación musical.
            </p>
          </Reveal>
        </section>

        <section
          id="contacto"
          className="section cta"
          aria-labelledby="cta-title"
        >
          <Reveal>
            <h2 id="cta-title" className="headline">
              ¿Quieres comenzar
              <br />
              tu proyecto?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">Cuéntanos de tu música. ¡Hablemos ahora!</p>
          </Reveal>
          <Reveal delay={200} className="actions">
            <a href={`mailto:${LINKS.email}`} className="button">
              Escríbenos
            </a>
            <a href={LINKS.platform} className="button button-ghost">
              Ingresa a la plataforma
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <p>Parte del Holding MVCK</p>
          </div>
          <ul className="footer-links" aria-label="Enlaces">
            <li>
              <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            </li>
            <li>
              <a href={LINKS.publishing}>Mvck Publishing</a>
            </li>
            <li>
              <a href={LINKS.maverickLive}>Maverick Live</a>
            </li>
          </ul>
          <ul className="social" aria-label="Redes sociales">
            <li>
              <a href={LINKS.instagram} aria-label="Instagram">
                <InstagramIcon />
              </a>
            </li>
            <li>
              <a href={LINKS.facebook} aria-label="Facebook">
                <FacebookIcon />
              </a>
            </li>
            <li>
              <a href={LINKS.x} aria-label="X">
                <XIcon />
              </a>
            </li>
          </ul>
        </div>
        <p className="footer-legal">
          © {year} Mvck Music. Todos los derechos reservados.
        </p>
      </footer>
    </>
  );
}

/** Barras que "suenan": decoración animada del hero. */
function Equalizer() {
  return (
    <div className="equalizer" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <span key={i} style={{ animationDelay: `${(i * 137) % 900}ms` }} />
      ))}
    </div>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GlobeIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </Icon>
  );
}

function ShieldIcon() {
  return (
    <Icon>
      <path d="M12 3 5 6v5c0 4.5 3 8.5 7 10 4-1.5 7-5.5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </Icon>
  );
}

function ChartIcon() {
  return (
    <Icon>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Icon>
  );
}

function ChannelsIcon() {
  return (
    <Icon>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="m10 8 4 2-4 2V8ZM8 20h8" />
    </Icon>
  );
}

function InstagramIcon() {
  return (
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </Icon>
  );
}

function FacebookIcon() {
  return (
    <Icon>
      <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15V3Z" />
    </Icon>
  );
}

function XIcon() {
  return (
    <Icon>
      <path d="M4 4l16 16M20 4 4 20" />
    </Icon>
  );
}
