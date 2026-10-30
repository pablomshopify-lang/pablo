import { Isotype } from '@/components/Logo';

const WORDS = [
  'Independiente',
  'Disidente',
  'Libertad creativa',
  'Maverick Record',
] as const;

/** Cinta de palabras que se desliza sin fin. Se detiene con movimiento reducido. */
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
