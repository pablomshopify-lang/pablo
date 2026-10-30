import { Isotype } from '@/components/logos/Maverick';

const WORDS = [
  'Sello',
  'Distribución',
  'Editorial',
  'Conciertos',
  'Ticketing',
] as const;

/** Cinta con las cinco actividades del holding. Se detiene con movimiento reducido. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="marquee-row" aria-hidden={hidden || undefined}>
      {WORDS.map((word, i) => (
        <li key={word} className={i % 2 ? 'outline' : undefined}>
          {word}
          <Isotype className="marquee-mark" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
