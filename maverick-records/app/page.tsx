import type { ReactNode } from 'react';
import { IsotypeOutline, Logo } from '@/components/Logo';
import { Marquee } from '@/components/Marquee';
import { Nav } from '@/components/Nav';
import { Pillars } from '@/components/Pillars';
import type { Pillar } from '@/components/Pillars';
import { Reveal } from '@/components/Reveal';
import { Spotlight } from '@/components/Spotlight';
import { DEMO_MAILTO, LINKS } from '@/lib/links';

/** Los tres textos del sello (Instagram), con su idea principal y puntos clave. */
const PILLARS: Pillar[] = [
  {
    id: 'quienes-somos',
    label: '¿Quiénes somos?',
    title: 'Independientes y disidentes.',
    text: (
      <>
        Somos un sello 100% <strong>independiente</strong> y{' '}
        <strong>disidente</strong> que valora la libertad creativa.
      </>
    ),
    points: ['100% independiente', 'Sin moldes', 'Libertad creativa'],
  },
  {
    id: 'que-hacemos',
    label: '¿Qué hacemos?',
    title: 'Potenciamos tu marca.',
    text: (
      <>
        Potenciamos las <strong>marcas</strong> de nuestros artistas para
        producir, distribuir y promocionar su música.
      </>
    ),
    points: ['Producir', 'Distribuir', 'Promocionar'],
  },
  {
    id: 'compromiso',
    label: 'Compromiso Maverick',
    title: 'Crecer sin perder tu libertad.',
    text: (
      <>
        Nuestra misión es apoyar el crecimiento de nuestros artistas bajo el
        apoyo de un equipo profesional respetando siempre su{' '}
        <strong>libertad</strong>.
      </>
    ),
    points: ['Crecimiento real', 'Equipo profesional', 'Tu libertad, siempre'],
  },
];

const SERVICES = [
  {
    title: 'Producir',
    text: 'Acompañamos cada lanzamiento desde el estudio: sonido, dirección y una identidad propia.',
    icon: <StudioIcon />,
    wide: true,
  },
  {
    title: 'Distribuir',
    text: 'Tu música en Spotify, Apple Music, YouTube y todas las plataformas del mundo.',
    icon: <GlobeIcon />,
    wide: false,
  },
  {
    title: 'Promocionar',
    text: 'Campañas, redes y prensa para que tu música llegue a quien tiene que escucharla.',
    icon: <MegaphoneIcon />,
    wide: false,
  },
  {
    title: 'Marca de artista',
    text: 'Construimos tu marca contigo: imagen, discurso y una historia que se reconozca.',
    icon: <SparkIcon />,
    wide: true,
  },
] as const;

const STEPS = [
  {
    title: 'Envíanos tu música',
    text: 'Un correo con tus canciones y quién eres. Sin formularios eternos.',
  },
  {
    title: 'La escuchamos',
    text: 'Nuestro equipo escucha cada propuesta con atención.',
  },
  {
    title: 'Armamos tu plan',
    text: 'Si hay match, definimos juntos producción, lanzamiento y promoción.',
  },
  {
    title: 'Lanzamos',
    text: 'Tu música sale al mundo con un equipo detrás, y tú sigues al mando.',
  },
] as const;

const FAMILY = [
  { name: 'Mvck Music', role: 'Distribución digital', href: LINKS.mvckMusic },
  {
    name: 'Mvck Publishing',
    role: 'Editorial musical',
    href: LINKS.mvckPublishing,
  },
  {
    name: 'Maverick Live',
    role: 'Producción de eventos',
    href: LINKS.maverickLive,
  },
] as const;

const HERO_LINES = ['Independientes.', 'Disidentes.', 'Libres.'] as const;

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <Nav />

      <main>
        <Spotlight className="hero">
          <section className="hero-inner" aria-labelledby="hero-title">
            <div className="shadows" aria-hidden="true" />
            <div className="hero-light" aria-hidden="true" />
            <IsotypeOutline className="hero-outline" draw strokeWidth={0.5} />

            <p className="eyebrow intro" style={{ animationDelay: '0ms' }}>
              <span className="pulse" aria-hidden="true" />
              Sello discográfico independiente
            </p>
            <h1 id="hero-title" className="display">
              {HERO_LINES.map((line, i) => (
                <span
                  key={line}
                  className={`intro hero-line${i === HERO_LINES.length - 1 ? ' bright' : ''}`}
                  style={{ animationDelay: `${120 + i * 120}ms` }}
                >
                  {line}
                </span>
              ))}
            </h1>
            <p className="lede intro" style={{ animationDelay: '520ms' }}>
              Un sello que valora la <strong>libertad creativa</strong> y
              potencia la marca de cada uno de sus artistas.
            </p>
            <div className="actions intro" style={{ animationDelay: '620ms' }}>
              <a href={DEMO_MAILTO} className="button">
                Envía tu música
                <ArrowIcon />
              </a>
              <a href="#nosotros" className="button button-ghost">
                Conócenos
              </a>
            </div>

            <a href="#nosotros" className="scroll-hint" aria-label="Bajar">
              <span />
            </a>
          </section>
        </Spotlight>

        <Marquee />

        <section
          id="nosotros"
          className="section about"
          aria-labelledby="nosotros-title"
        >
          <Reveal>
            <p className="eyebrow">El sello</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="nosotros-title" className="headline">
              Libertad creativa,{' '}
              <span className="bright">con un equipo detrás.</span>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <Pillars pillars={PILLARS} />
          </Reveal>
        </section>

        <section
          id="servicios"
          className="section services"
          aria-labelledby="servicios-title"
        >
          <Reveal>
            <p className="eyebrow">Para nuestros artistas</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="servicios-title" className="headline">
              Todo lo que tu música <span className="bright">necesita.</span>
            </h2>
          </Reveal>
          <Spotlight className="bento-wrap" targets=".tile">
            <ul className="bento">
              {SERVICES.map((service, i) => (
                <li key={service.title} className={service.wide ? 'wide' : ''}>
                  <Reveal className="tile" delay={i * 80}>
                    <div className="tile-top">
                      <span className="tile-icon">{service.icon}</span>
                      <span className="tile-index">0{i + 1}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Spotlight>
        </section>

        <section
          id="proceso"
          className="section process"
          aria-labelledby="proceso-title"
        >
          <Reveal>
            <p className="eyebrow">Cómo trabajamos</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="proceso-title" className="headline">
              De tu demo <span className="bright">al mundo.</span>
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

        <section className="section family" aria-labelledby="holding-title">
          <Reveal>
            <h2 id="holding-title" className="family-title">
              Parte del Holding MVCK
            </h2>
          </Reveal>
          <ul className="family-list">
            {FAMILY.map((brand, i) => (
              <li key={brand.name}>
                <Reveal delay={i * 80}>
                  <a href={brand.href} className="family-card">
                    <span>
                      <span className="family-name">{brand.name}</span>
                      <span className="family-role">{brand.role}</span>
                    </span>
                    <span className="family-arrow" aria-hidden="true">
                      <ArrowUpRightIcon />
                    </span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <Spotlight className="cta-wrap">
          <section
            id="contacto"
            className="section cta"
            aria-labelledby="cta-title"
          >
            <div className="shadows" aria-hidden="true" />
            <div className="hero-light" aria-hidden="true" />
            <Reveal>
              <h2 id="cta-title" className="headline cta-title">
                ¿Haces música
                <br />
                <span className="shine">a tu manera?</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="lede">
                Envíanos tu música y cuéntanos quién eres. Escuchamos todo.
              </p>
            </Reveal>
            <Reveal delay={200} className="actions">
              <a href={DEMO_MAILTO} className="button button-large">
                Envía tu música
                <ArrowIcon />
              </a>
              <a href={LINKS.instagram} className="button button-ghost">
                <InstagramIcon />
                {LINKS.instagramHandle}
              </a>
            </Reveal>
          </section>
        </Spotlight>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <p className="footer-tagline">
            Independientes. Disidentes. <span className="bright">Libres.</span>
          </p>
          <ul className="footer-links" aria-label="Enlaces">
            <li>
              <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            </li>
            <li>
              <a href={LINKS.instagram}>Instagram</a>
            </li>
            {FAMILY.map((brand) => (
              <li key={brand.name}>
                <a href={brand.href}>{brand.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <Logo className="footer-logo" aria-hidden="true" />
        <p className="footer-legal">
          © {year} Maverick Music Entertainment LLC. Todos los derechos
          reservados.
        </p>
      </footer>
    </>
  );
}

function Icon({ children, size = 24 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
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

function ArrowIcon() {
  return (
    <span className="button-arrow">
      <Icon size={18}>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </Icon>
    </span>
  );
}

function ArrowUpRightIcon() {
  return (
    <Icon size={20}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Icon>
  );
}

function StudioIcon() {
  return (
    <Icon>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8" />
    </Icon>
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

function MegaphoneIcon() {
  return (
    <Icon>
      <path d="M3 10v4a1 1 0 0 0 1 1h3l6 4V5L7 9H4a1 1 0 0 0-1 1ZM17 9a4 4 0 0 1 0 6M20 6a8 8 0 0 1 0 12" />
    </Icon>
  );
}

function SparkIcon() {
  return (
    <Icon>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z" />
    </Icon>
  );
}

function InstagramIcon() {
  return (
    <Icon size={18}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </Icon>
  );
}
