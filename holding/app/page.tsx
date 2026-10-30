import type { CSSProperties } from 'react';
import { Aurora } from '@/components/Aurora';
import { BrandLogo } from '@/components/BrandLogo';
import { ContactPicker } from '@/components/ContactPicker';
import type { Contact } from '@/components/ContactPicker';
import { Cycle } from '@/components/Cycle';
import type { Step } from '@/components/Cycle';
import { ArrowIcon } from '@/components/Icons';
import { Marquee } from '@/components/Marquee';
import { Nav } from '@/components/Nav';
import { Reveal } from '@/components/Reveal';
import { Spotlight } from '@/components/Spotlight';
import { IsotypeOutline, Logo } from '@/components/logos/Maverick';
import { BRANDS, HOLDING } from '@/lib/brands';
import type { BrandId } from '@/lib/brands';

/** Lo que pasa con la música en cada marca, como en la presentación. */
const VERBS: Record<BrandId, string> = {
  records: 'Se graba',
  music: 'Se distribuye',
  publishing: 'Se protege',
  live: 'Se toca en vivo',
  ticket: 'Se venden las entradas',
};

const STEPS: readonly Step[] = BRANDS.map((brand) => ({
  verb: VERBS[brand.id],
  brand,
}));

const STATS = [
  { value: '5', label: 'Marcas propias' },
  { value: '360°', label: 'Gestión de la carrera artística' },
  { value: '1', label: 'Mismo equipo y ecosistema' },
] as const;

/** Por qué trabajar con el holding. Todo sale de la presentación corporativa. */
const REASONS = [
  {
    mark: '360°',
    title: 'Contrato 360°',
    text: 'Gestionamos todas las áreas profesionales de una carrera artística: producción musical, distribución, marketing, promoción, imagen y booking.',
  },
  {
    mark: 'Global',
    title: 'Respaldo global',
    text: 'Alianzas y registros con The MLC, The Harry Fox Agency, ASCAP, SoundExchange y Music Reports para cobrar derechos en cada territorio.',
  },
  {
    mark: 'Sinergia',
    title: 'Del sello al escenario',
    text: 'Maverick Live produce las giras, conciertos y presentaciones de los artistas del sello, asegurando la calidad de cada show.',
  },
  {
    mark: 'Flexible',
    title: 'Sin costos iniciales',
    text: 'Distribución sin pagos por adelantado y modelos transparentes, adaptados a cada cliente y orientados al crecimiento mutuo.',
  },
] as const;

type Member = {
  name: string;
  role: string;
  /** Letras del círculo, si no sirven las iniciales del nombre. */
  mark?: string;
};

const TEAM: readonly Member[] = [
  { name: 'Sebastián Biggio', role: 'CEO' },
  { name: 'Pablo Moreno', role: 'COO' },
  { name: 'Francisca Casas', role: 'Head of Creative' },
  {
    name: 'Flowza.co',
    role: 'Agencia partner: Growth, Marketing & Ventas',
    mark: 'FZ',
  },
  { name: 'Kim Mujica', role: 'Head of Communications' },
  { name: 'Javiera Moreno', role: 'Head of PR' },
];

const CONTACTS: readonly Contact[] = [
  {
    id: 'holding',
    label: 'Holding',
    topic: 'Negocios, alianzas e inversión',
    email: HOLDING.email,
    accent: '#7b3fe4',
  },
  ...BRANDS.flatMap((brand) =>
    brand.email
      ? [
          {
            id: brand.id,
            label: brand.name,
            topic: brand.tagline,
            email: brand.email,
            accent: brand.accent,
          },
        ]
      : [],
  ),
];

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <>
      <Nav />

      <main>
        {/* Portada */}
        <section className="hero" aria-labelledby="hero-title">
          <Aurora />
          <div className="hero-mark" aria-hidden="true">
            <span className="hero-mark-fill" />
            <IsotypeOutline className="hero-mark-line" draw strokeWidth={1.2} />
          </div>
          <div className="container hero-inner">
            <p className="eyebrow intro" style={{ animationDelay: '80ms' }}>
              <span className="eyebrow-dot" aria-hidden="true" />
              Holding de música y entretenimiento
            </p>
            <h1
              id="hero-title"
              className="display intro"
              style={{ animationDelay: '160ms' }}
            >
              Del talento
              <br />
              <span className="gradient-text">al escenario.</span>
            </h1>
            <p className="lead intro" style={{ animationDelay: '260ms' }}>
              Sello, distribución, editorial, conciertos y ticketing bajo un
              mismo techo. Cinco marcas que acompañan al artista en todo su
              camino.
            </p>
            <div className="actions intro" style={{ animationDelay: '360ms' }}>
              <a href="#marcas" className="button">
                Conoce las marcas
              </a>
              <a href="#contacto" className="button button-ghost">
                Hablemos
              </a>
            </div>
          </div>
          <ul
            className="container hero-brands intro"
            style={{ animationDelay: '520ms' }}
            aria-label="Nuestras marcas"
          >
            {BRANDS.map((brand) => (
              <li
                key={brand.id}
                style={{ '--brand': brand.accent } as CSSProperties}
              >
                <a href={`#marca-${brand.id}`}>
                  <span className="hero-brand-dot" aria-hidden="true" />
                  {brand.name}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <Marquee />

        {/* Resumen */}
        <section className="section" aria-labelledby="about-title">
          <div className="container about">
            <Reveal>
              <p className="eyebrow">Maverick Music Entertainment</p>
              <h2 id="about-title" className="title">
                Un holding para toda la{' '}
                <span className="gradient-text">industria musical.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="about-text">
                Nos dedicamos a la gestión integral de música y entretenimiento.
                Nuestra misión es ofrecer soluciones completas: distribución
                digital, gestión de derechos de autor, promoción, organización
                de conciertos y venta de boletos. Cada marca cubre una de las
                cinco principales actividades comerciales del sector, lo que nos
                posiciona como uno de los holdings más completos de la música y
                el entretenimiento en Latinoamérica.
              </p>
            </Reveal>
          </div>
          <div className="container">
            <dl className="stats">
              {STATS.map((stat, i) => (
                <Reveal key={stat.label} className="stat" delay={i * 90}>
                  <dt className="stat-value gradient-text">{stat.value}</dt>
                  <dd className="stat-label">{stat.label}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* Marcas */}
        <section id="marcas" className="section" aria-labelledby="brands-title">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Nuestras marcas</p>
              <h2 id="brands-title" className="title">
                Cinco marcas.{' '}
                <span className="muted">Un mismo ecosistema.</span>
              </h2>
            </Reveal>
            <Spotlight className="bento" targets=".brand-card">
              {BRANDS.map((brand, i) => (
                <Reveal
                  key={brand.id}
                  className={`bento-cell bento-${brand.id}`}
                  delay={(i % 3) * 80}
                >
                  <article
                    id={`marca-${brand.id}`}
                    className="brand-card"
                    data-brand={brand.id}
                    style={{ '--brand': brand.accent } as CSSProperties}
                  >
                    <p className="brand-category">
                      0{i + 1} · {brand.category}
                    </p>
                    <span className="brand-logo" data-logo={brand.id}>
                      <BrandLogo id={brand.id} scope="card" />
                    </span>
                    <h3 className="brand-tagline">{brand.tagline}</h3>
                    <p className="brand-text">{brand.description}</p>
                    {brand.url ? (
                      <a
                        className="link-arrow brand-link"
                        href={brand.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Visitar el sitio de ${brand.name}`}
                      >
                        Visitar sitio
                        <ArrowIcon />
                      </a>
                    ) : (
                      <span className="soon">Sitio web próximamente</span>
                    )}
                  </article>
                </Reveal>
              ))}
            </Spotlight>
          </div>
        </section>

        {/* Ciclo del artista */}
        <section
          id="ecosistema"
          className="section section-tint"
          aria-labelledby="cycle-title"
        >
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Ecosistema</p>
              <h2 id="cycle-title" className="title">
                El ciclo completo <span className="muted">de un artista.</span>
              </h2>
              <p className="section-lead">
                Se graba, se distribuye, se protege, se toca en vivo y se venden
                las entradas. Cada paso tiene una marca del holding.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <Cycle steps={STEPS} />
            </Reveal>
          </div>
        </section>

        {/* Por qué */}
        <section className="section" aria-labelledby="why-title">
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Por qué Maverick</p>
              <h2 id="why-title" className="title">
                Todo lo que tu música necesita,{' '}
                <span className="muted">en un solo lugar.</span>
              </h2>
            </Reveal>
            <Spotlight className="reasons" targets=".reason">
              {REASONS.map((reason, i) => (
                <Reveal key={reason.title} delay={(i % 2) * 90}>
                  <article className="reason">
                    <p className="reason-mark gradient-text" aria-hidden="true">
                      {reason.mark}
                    </p>
                    <h3 className="reason-title">{reason.title}</h3>
                    <p className="reason-text">{reason.text}</p>
                  </article>
                </Reveal>
              ))}
            </Spotlight>
          </div>
        </section>

        {/* Equipo */}
        <section
          id="equipo"
          className="section section-tint"
          aria-labelledby="team-title"
        >
          <div className="container">
            <Reveal className="section-head">
              <p className="eyebrow">Equipo</p>
              <h2 id="team-title" className="title">
                Las personas <span className="muted">detrás de cada show.</span>
              </h2>
            </Reveal>
            <div className="team">
              {TEAM.map((person, i) => (
                <Reveal key={person.name} delay={i * 70}>
                  <div className="person">
                    <span
                      className="avatar"
                      aria-hidden="true"
                      style={{ '--i': i } as CSSProperties}
                    >
                      {person.mark ?? initials(person.name)}
                    </span>
                    <span className="person-name">{person.name}</span>
                    <span className="person-role">{person.role}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section
          id="contacto"
          className="section contact"
          aria-labelledby="contact-title"
        >
          <Aurora className="aurora-soft" />
          <div className="container contact-inner">
            <Reveal>
              <p className="eyebrow">Contacto</p>
              <h2 id="contact-title" className="title">
                Hagamos que tu música{' '}
                <span className="gradient-text">llegue lejos.</span>
              </h2>
              <p className="section-lead">
                Elige con quién quieres hablar y escríbenos directo. Te
                respondemos desde la marca que mejor conoce lo que necesitas.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <ContactPicker contacts={CONTACTS} />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <p className="footer-title">Maverick Music Entertainment</p>
              <p className="footer-note">Del talento al escenario.</p>
            </div>
            <ul className="footer-links" aria-label="Marcas del holding">
              {BRANDS.map((brand) => (
                <li
                  key={brand.id}
                  style={{ '--brand': brand.accent } as CSSProperties}
                >
                  {brand.url ? (
                    <a href={brand.url} target="_blank" rel="noreferrer">
                      {brand.name}
                    </a>
                  ) : (
                    <span>{brand.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <Logo className="footer-wordmark" aria-hidden="true" />
          <p className="footer-legal">
            © {year} {HOLDING.legalName}. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
}
