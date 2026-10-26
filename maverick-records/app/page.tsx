import type { ReactNode } from 'react';
import { IsotypeOutline, Logo } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Reveal } from '@/components/Reveal';
import { LINKS } from '@/lib/links';

/** Los tres textos del sello, tal como aparecen en su Instagram. */
const MANIFESTO = [
  {
    id: 'quienes-somos',
    title: '¿Quiénes somos?',
    text: (
      <>
        Somos un sello 100% <strong>independiente</strong> y{' '}
        <strong>disidente</strong> que valora la libertad creativa.
      </>
    ),
  },
  {
    id: 'que-hacemos',
    title: '¿Qué hacemos?',
    text: (
      <>
        Potenciamos las <strong>marcas</strong> de nuestros artistas para
        producir, distribuir y promocionar su música.
      </>
    ),
  },
  {
    id: 'compromiso',
    title: 'Compromiso Maverick',
    text: (
      <>
        Nuestra misión es apoyar el crecimiento de nuestros artistas bajo el
        apoyo de un equipo profesional respetando siempre su{' '}
        <strong>libertad</strong>.
      </>
    ),
  },
] as const;

const SERVICES = [
  {
    title: 'Producir',
    text: 'Acompañamos cada lanzamiento desde el estudio: sonido, dirección y una identidad propia.',
    icon: <StudioIcon />,
  },
  {
    title: 'Distribuir',
    text: 'Llevamos tu música a Spotify, Apple Music, YouTube y todas las plataformas del mundo.',
    icon: <GlobeIcon />,
  },
  {
    title: 'Promocionar',
    text: 'Campañas, redes y prensa para que tu música llegue a quien tiene que escucharla.',
    icon: <MegaphoneIcon />,
  },
  {
    title: 'Marca de artista',
    text: 'Construimos tu marca contigo: imagen, discurso y una historia que se reconozca.',
    icon: <SparkIcon />,
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

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Nav />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="shadows" aria-hidden="true" />
          <IsotypeOutline className="hero-outline" />
          <Reveal>
            <p className="eyebrow">Sello discográfico independiente</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="display">
              Independientes.
              <br />
              Disidentes.
              <br />
              <span className="bright">Libres.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Un sello que valora la <strong>libertad creativa</strong> y
              potencia la marca de cada uno de sus artistas.
            </p>
          </Reveal>
          <Reveal delay={240} className="actions">
            <a href={`mailto:${LINKS.email}`} className="button">
              Envía tu música
            </a>
            <a href="#quienes-somos" className="button button-ghost">
              Conócenos
            </a>
          </Reveal>
        </section>

        {MANIFESTO.map((item, i) => (
          <section
            key={item.id}
            id={item.id}
            className="section manifesto"
            aria-labelledby={`${item.id}-title`}
          >
            <IsotypeOutline className="manifesto-outline" />
            <Reveal>
              <h2 id={`${item.id}-title`} className="headline">
                {item.title}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <span className="manifesto-number">{i + 1}.</span>
            </Reveal>
            <Reveal delay={180}>
              <p className="statement">{item.text}</p>
            </Reveal>
          </section>
        ))}

        <section className="section services" aria-labelledby="servicios-title">
          <Reveal>
            <p className="eyebrow">Para nuestros artistas</p>
          </Reveal>
          <Reveal delay={80}>
            <h2 id="servicios-title" className="headline">
              Todo lo que tu música necesita
            </h2>
          </Reveal>
          <ul className="grid">
            {SERVICES.map((service, i) => (
              <li key={service.title}>
                <Reveal className="tile" delay={i * 80}>
                  <span className="tile-icon">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
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
                    <span className="family-name">{brand.name}</span>
                    <span className="family-role">{brand.role}</span>
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="contacto"
          className="section cta"
          aria-labelledby="cta-title"
        >
          <div className="shadows" aria-hidden="true" />
          <Reveal>
            <h2 id="cta-title" className="headline">
              ¿Haces música
              <br />
              <span className="bright">a tu manera?</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Envíanos tu música y cuéntanos quién eres. Escuchamos todo.
            </p>
          </Reveal>
          <Reveal delay={200} className="actions">
            <a href={`mailto:${LINKS.email}`} className="button">
              Escríbenos
            </a>
            <a href={LINKS.instagram} className="button button-ghost">
              {LINKS.instagramHandle}
            </a>
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo className="footer-logo" />
            <p>Records · Parte del Holding MVCK</p>
          </div>
          <ul className="footer-links" aria-label="Enlaces">
            <li>
              <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            </li>
            {FAMILY.map((brand) => (
              <li key={brand.name}>
                <a href={brand.href}>{brand.name}</a>
              </li>
            ))}
          </ul>
          <ul className="social" aria-label="Redes sociales">
            <li>
              <a href={LINKS.instagram} aria-label="Instagram">
                <InstagramIcon />
              </a>
            </li>
          </ul>
        </div>
        <p className="footer-legal">
          © {year} Maverick Music Entertainment LLC. Todos los derechos
          reservados.
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
    <Icon>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </Icon>
  );
}
