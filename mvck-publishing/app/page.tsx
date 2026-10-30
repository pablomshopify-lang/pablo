import type { ReactNode } from 'react';
import { Isotype, Logo } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Partners } from '@/components/Partners';
import { Reveal } from '@/components/Reveal';
import { LINKS } from '@/lib/links';

type Royalty = {
  title: string;
  text: string;
  icon: ReactNode;
  wide: boolean;
  /** Entidades con las que se cobra este tipo de regalía. */
  via?: string;
};

const ROYALTIES: Royalty[] = [
  {
    title: 'Comunicación pública',
    text: 'Cada vez que tu canción suena en radio, TV, conciertos, tiendas o streaming, se genera una regalía por ejecución pública.',
    icon: <RadioIcon />,
    wide: true,
    via: 'ASCAP',
  },
  {
    title: 'Derechos mecánicos',
    text: 'Se pagan cuando tu canción se reproduce en plataformas de streaming, se descarga o se fabrica en formato físico.',
    icon: <WaveIcon />,
    wide: false,
    via: 'The MLC · Harry Fox Agency · Music Reports',
  },
  {
    title: 'Derechos del máster',
    text: 'La grabación también cobra: radio digital, satélite y webcasting pagan por el uso de tu máster.',
    icon: <DiscIcon />,
    wide: false,
    via: 'SoundExchange',
  },
  {
    title: 'Sincronización',
    text: 'Presentamos tus canciones para cine, series, publicidad y videojuegos, y negociamos cada licencia.',
    icon: <FilmIcon />,
    wide: true,
  },
  {
    title: 'Registro de obras',
    text: 'Registramos cada canción con sus autores y porcentajes, para que ninguna regalía quede sin dueño.',
    icon: <PenIcon />,
    wide: true,
  },
  {
    title: 'Reportes claros',
    text: 'Sabes qué cobramos, dónde y por qué, con reportes simples y pagos transparentes.',
    icon: <ReportIcon />,
    wide: false,
  },
];

const STEPS = [
  {
    title: 'Cuéntanos de tu catálogo',
    text: 'Escríbenos con tus canciones, sus autores y dónde se han publicado.',
  },
  {
    title: 'Registramos tus obras',
    text: 'Las inscribimos en las entidades de recaudación de Estados Unidos y el mundo.',
  },
  {
    title: 'Cobra tus regalías',
    text: 'Recaudamos lo que tus canciones generan y te lo pagamos con reportes claros.',
  },
] as const;

const PILLARS = [
  {
    title: 'Atención personal',
    text: 'Un equipo que conoce tus canciones y responde tus dudas directamente.',
  },
  {
    title: 'Nada sin cobrar',
    text: 'Revisamos cada registro para recuperar las regalías que hoy se pierden.',
  },
  {
    title: 'Parte de Maverick Music Entertainment LLC',
    text: 'Trabajamos junto a Mvck Music, la distribuidora del grupo.',
  },
] as const;

const FAQ = [
  {
    q: '¿Qué es una editorial musical?',
    a: 'Es quien administra los derechos de autor de tus canciones (la letra y la música). Registra tus obras, licencia su uso y cobra las regalías que generan en todo el mundo.',
  },
  {
    q: '¿Mi distribuidora no cobra eso?',
    a: 'No. La distribuidora cobra por la grabación en las plataformas. Las regalías de autor (comunicación pública y derechos mecánicos) se cobran aparte, y muchas veces quedan sin reclamar.',
  },
  {
    q: '¿Qué diferencia hay entre derechos mecánicos y del máster?',
    a: 'Los mecánicos son de la canción como obra: se pagan cuando se reproduce o copia. Los del máster son de la grabación: por ejemplo, lo que paga la radio digital a través de SoundExchange.',
  },
  {
    q: '¿Con quiénes cobran?',
    a: 'Con ASCAP para comunicación pública; con The MLC, Harry Fox Agency y Music Reports para derechos mecánicos; y con SoundExchange para los derechos del máster en radio digital.',
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
              Editorial musical boutique
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="display">
              Tus canciones generan dinero.
              <br />
              <em className="accent">Nosotros lo cobramos.</em>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Registramos tus obras y recaudamos tus regalías de comunicación
              pública, derechos mecánicos y del máster, en todo el mundo.
            </p>
          </Reveal>
          <Reveal delay={240} className="actions">
            <a href={`mailto:${LINKS.email}`} className="button">
              Registra tus canciones
            </a>
            <a href="#regalias" className="button button-ghost">
              ¿Qué regalías cobramos?
            </a>
          </Reveal>
          <Reveal delay={320} className="hero-visual">
            <Isotype className="hero-mark" />
          </Reveal>
        </section>

        <section className="section partners" aria-labelledby="socios-title">
          <Reveal>
            <h2 id="socios-title" className="partners-title">
              Recaudamos con las principales entidades de derechos
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Partners />
          </Reveal>
        </section>

        <section
          className="section statement"
          aria-labelledby="editorial-title"
        >
          <Reveal>
            <p className="eyebrow">Por qué una editorial</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="editorial-title" className="headline">
              Tú escribes la canción.{' '}
              <em className="accent">Nosotros cuidamos cada regalía.</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Cada reproducción, transmisión y venta de tu música genera
              derechos de autor. Sin una editorial, gran parte de ese dinero
              nunca llega a ti.
            </p>
          </Reveal>
        </section>

        <section
          id="regalias"
          className="section services"
          aria-labelledby="regalias-title"
        >
          <Reveal>
            <h2 id="regalias-title" className="headline">
              Todas tus regalías, en un solo lugar
            </h2>
          </Reveal>
          <ul className="bento">
            {ROYALTIES.map((royalty, i) => (
              <li key={royalty.title} className={royalty.wide ? 'wide' : ''}>
                <Reveal className="tile" delay={i * 80}>
                  <span className="tile-icon">{royalty.icon}</span>
                  <h3>{royalty.title}</h3>
                  <p>{royalty.text}</p>
                  {royalty.via && <p className="tile-via">{royalty.via}</p>}
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
              Una editorial <em className="accent">boutique.</em>
            </h2>
            <p className="lede">
              No eres un número más en un catálogo. Cada autor recibe atención
              personal y un seguimiento cuidadoso de sus canciones.
            </p>
            <ul className="pillars">
              {PILLARS.map((pillar) => (
                <li key={pillar.title}>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <section
          id="preguntas"
          className="section faq"
          aria-labelledby="preguntas-title"
        >
          <Reveal>
            <h2 id="preguntas-title" className="headline">
              Preguntas frecuentes
            </h2>
          </Reveal>
          <div className="faq-list">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details className="faq-item">
                  <summary>
                    {item.q}
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          id="contacto"
          className="section cta"
          aria-labelledby="cta-title"
        >
          <Reveal>
            <h2 id="cta-title" className="headline">
              ¿Tus canciones ya
              <br />
              <em className="accent">están cobrando?</em>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Revisamos tu catálogo y te contamos qué regalías te faltan.
            </p>
          </Reveal>
          <Reveal delay={200} className="actions">
            <a href={`mailto:${LINKS.email}`} className="button">
              Escríbenos
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <p>Parte de Maverick Music Entertainment LLC</p>
          </div>
          <ul className="footer-links" aria-label="Enlaces">
            <li>
              <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            </li>
            <li>
              <a href={LINKS.mvckMusic}>Mvck Music</a>
            </li>
            <li>
              <a href={LINKS.maverickLive}>Maverick Live</a>
            </li>
            <li>
              <a href={LINKS.maverickRecord}>Maverick Record</a>
            </li>
          </ul>
          <ul className="social" aria-label="Redes sociales">
            <li>
              <a href={LINKS.instagram} aria-label="Instagram">
                <InstagramIcon />
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
          © {year} Maverick Music Entertainment LLC. Todos los derechos
          reservados. Las marcas de las entidades mencionadas pertenecen a sus
          respectivos dueños.
        </p>
      </footer>
    </>
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

function RadioIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="2" />
      <path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7M5.6 18.4a9 9 0 0 1 0-12.8M18.4 5.6a9 9 0 0 1 0 12.8" />
    </Icon>
  );
}

function WaveIcon() {
  return (
    <Icon>
      <path d="M3 12h2M7 8v8M11 5v14M15 9v6M19 11v2M21 12h0" />
    </Icon>
  );
}

function DiscIcon() {
  return (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
    </Icon>
  );
}

function FilmIcon() {
  return (
    <Icon>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4" />
    </Icon>
  );
}

function PenIcon() {
  return (
    <Icon>
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </Icon>
  );
}

function ReportIcon() {
  return (
    <Icon>
      <path d="M6 3h9l4 4v14H6V3Z" />
      <path d="M14 3v5h5M9 17v-3M12 17v-5M15 17v-2" />
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

function XIcon() {
  return (
    <Icon>
      <path d="M4 4l16 16M20 4 4 20" />
    </Icon>
  );
}
