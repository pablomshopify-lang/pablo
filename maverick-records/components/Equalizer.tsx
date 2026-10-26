const BARS = 56;

/** Colores del degradado de la marca, de izquierda a derecha. */
const STOPS: readonly [number, number, number][] = [
  [0, 173, 216],
  [46, 47, 130],
  [100, 37, 128],
  [225, 0, 130],
];

function colorAt(t: number) {
  const scaled = t * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(scaled));
  const k = scaled - i;
  const a = STOPS[i] ?? STOPS[0]!;
  const b = STOPS[i + 1] ?? a;
  const mix = (n: 0 | 1 | 2) => Math.round(a[n] + (b[n] - a[n]) * k);
  return `rgb(${mix(0)} ${mix(1)} ${mix(2)})`;
}

/**
 * Ecualizador animado: barras que suben y bajan como el sonido, pintadas con
 * el degradado de la marca. Los valores son fijos para que la página se vea
 * igual en el servidor y en el navegador.
 */
export function Equalizer({ className = '' }: { className?: string }) {
  return (
    <div className={`eq ${className}`} aria-hidden="true">
      {Array.from({ length: BARS }, (_, i) => {
        const t = i / (BARS - 1);
        // Más alto al centro, con variación "musical" entre barras vecinas.
        const envelope = Math.sin(Math.PI * t);
        const wobble = (Math.sin(i * 1.7) + Math.sin(i * 0.63)) / 4 + 0.5;
        const height = 0.2 + envelope * 0.55 + wobble * 0.25;
        return (
          <span
            key={i}
            style={{
              background: colorAt(t),
              height: `${Math.round(height * 100)}%`,
              animationDuration: `${900 + ((i * 137) % 700)}ms`,
              animationDelay: `${-((i * 211) % 1200)}ms`,
            }}
          />
        );
      })}
    </div>
  );
}
