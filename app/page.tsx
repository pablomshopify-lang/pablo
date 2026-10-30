import { CONTACT_EMAIL, ContactForm } from '@/components/ContactForm';
import { Logo, PlayMark } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Reveal } from '@/components/Reveal';

const FEATURES = [
  {
    title: 'Producción integral',
    text: 'De la idea al montaje: planificación, proveedores y ejecución con un solo equipo.',
    wide: true,
  },
  {
    title: 'Shows y conciertos',
    text: 'Escenario, sonido y luces para que el público lo viva al máximo.',
    wide: false,
  },
  {
    title: 'Eventos de marca',
    text: 'Lanzamientos, convenciones y celebraciones que hablan por tu empresa.',
    wide: false,
  },
  {
    title: 'Experiencias a medida',
    text: 'Si lo imaginas, lo diseñamos. Formatos únicos para momentos que no se repiten.',
    wide: true,
  },
] as const;

// Las otras webs de Maverick Music Entertainment LLC (sin incluir esta).
const HOLDING = [
  {
    name: 'Mvck Music',
    href: 'https://mvckmusic.com',
  },
  {
    name: 'Mvck Publishing',
    href: 'https://www.mvckpublishing.com',
  },
  {
    name: 'Maverick Record',
    href: 'https://maverick-records-l47p.vercel.app',
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
              <span className="live-dot" aria-hidden="true" />
              Productora de eventos
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="display">
              Mucho más que eventos.
              <br />
              <span className="gradient-text">Experiencias únicas.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              En Maverick Live creamos experiencias únicas. Cuéntanos tu idea y
              la hacemos realidad.
            </p>
          </Reveal>
          <Reveal delay={240} className="hero-actions">
            <a href="#contacto" className="button">
              Contáctanos
            </a>
            <a href="#que-hacemos" className="button button-ghost">
              Qué hacemos
            </a>
          </Reveal>
          <Reveal delay={320} className="hero-mark-wrap">
            <PlayMark className="hero-mark" gradientId="mark-hero" />
          </Reveal>
        </section>

        <section
          id="que-hacemos"
          className="section statement"
          aria-labelledby="statement-title"
        >
          <Reveal>
            <h2 id="statement-title" className="headline">
              Cada detalle, <span className="gradient-text">en vivo.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Producimos eventos que se sienten, se recuerdan y se comparten. De
              la primera idea al último aplauso, nos encargamos de todo.
            </p>
          </Reveal>
        </section>

        <section className="section bento-section" aria-label="Qué hacemos">
          <ul className="bento">
            {FEATURES.map((feature, i) => (
              <li key={feature.title} className={feature.wide ? 'wide' : ''}>
                <Reveal className="tile" delay={i * 80}>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
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
          <Reveal>
            <h2 id="cta-title" className="headline">
              Hablemos de tu evento.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Escríbenos y te respondemos a la brevedad. También puedes
              escribirnos directo a{' '}
              <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={200} className="contact-wrap">
            <ContactForm />
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <Logo className="footer-logo" gradientId="logo-footer" />
          <ul className="footer-links" aria-label="Enlaces">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
            {HOLDING.map((brand) => (
              <li key={brand.name}>
                <a href={brand.href}>{brand.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <p>
          © {year} Maverick Music Entertainment LLC. Todos los derechos
          reservados.
        </p>
      </footer>
    </>
  );
}
