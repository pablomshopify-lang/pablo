import { Logo, PlayMark } from '@/components/Logo';
import { Nav } from '@/components/Nav';
import { Reveal } from '@/components/Reveal';
import { SubscribeForm } from '@/components/SubscribeForm';

const FEATURES = [
  {
    title: 'En vivo',
    text: 'Lo que pasa, cuando pasa. Sin esperas y sin perderte nada.',
    wide: true,
  },
  {
    title: 'Contenido original',
    text: 'Historias y formatos creados para esta nueva etapa.',
    wide: false,
  },
  {
    title: 'Comunidad',
    text: 'Un lugar para encontrarte con quienes viven lo mismo que tú.',
    wide: false,
  },
  {
    title: 'En todas tus pantallas',
    text: 'En el teléfono, el computador o la tele. Empieza en uno y sigue en otro.',
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
              Muy pronto
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h1 id="hero-title" className="display">
              Maverick Live.
              <br />
              <span className="gradient-text">Una nueva etapa.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="lede">
              Estamos preparando algo completamente nuevo. Déjanos tu correo y
              serás de los primeros en verlo.
            </p>
          </Reveal>
          <Reveal delay={240} className="hero-form">
            <SubscribeForm />
            <p className="fineprint">
              Sin spam. Solo te escribiremos para avisarte del lanzamiento.
            </p>
          </Reveal>
          <Reveal delay={320} className="hero-mark-wrap">
            <PlayMark className="hero-mark" gradientId="mark-hero" />
          </Reveal>
        </section>

        <section
          id="experiencia"
          className="section statement"
          aria-labelledby="statement-title"
        >
          <Reveal>
            <h2 id="statement-title" className="headline">
              Hecho para vivirse <span className="gradient-text">en vivo.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Una experiencia más simple, más rápida y más cercana. Todo lo que
              te gusta de Maverick Live, pensado otra vez desde cero.
            </p>
          </Reveal>
        </section>

        <section className="section bento-section" aria-label="Lo que viene">
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
              Sé de los primeros.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede">
              Te mandamos un solo correo, el día que abramos las puertas.
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
