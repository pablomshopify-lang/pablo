import { Logo, PlayMark } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Reveal } from '@/components/Reveal';
import { SubscribeForm } from '@/components/SubscribeForm';

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
              En Maverick Live creamos experiencias únicas. Déjanos tu correo y
              entérate primero de lo que viene.
            </p>
          </Reveal>
          <Reveal delay={240} className="hero-form">
            <SubscribeForm />
            <p className="fineprint">
              Sin spam. Solo novedades y próximos eventos de Maverick Live.
            </p>
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
          id="suscribete"
          className="section cta"
          aria-labelledby="cta-title"
        >
          <Reveal>
            <h2 id="cta-title" className="headline">
              Vive lo que viene.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Déjanos tu correo y te contamos antes que nadie sobre nuestros
              próximos eventos.
            </p>
          </Reveal>
          <Reveal delay={200} className="hero-form">
            <SubscribeForm />
          </Reveal>
        </section>
      </main>

      <footer className="footer">
        <Logo className="footer-logo" gradientId="logo-footer" />
        <p>© {year} Maverick Live. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
