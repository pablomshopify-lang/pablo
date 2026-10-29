import { Formulario } from '@/components/Formulario';

export default function Home() {
  return (
    <main className="wrap">
      <header className="hero">
        <p className="eyebrow">Holding MVCK</p>
        <h1>Ingreso de artistas</h1>
        <p className="muted">
          Completa tus datos, tus redes y elige qué necesitas. Toma unos 5
          minutos y nuestro equipo te contactará.
        </p>
      </header>
      <Formulario />
    </main>
  );
}
