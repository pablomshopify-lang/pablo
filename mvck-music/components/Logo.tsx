type LogoProps = { className?: string };

// Trazos vectoriales tomados del Manual de Maverick (página 2.1).
const WORDMARK =
  'M 235.00 429.92 L 264.67 429.92 L 288.37 460.32 L 312.11 429.92 L 341.73 429.92 L 341.73 490.71 L 318.03 490.71 L 318.03 458.28 L 294.29 490.71 L 282.44 490.71 L 258.70 458.28 L 258.70 490.71 L 235.00 490.71 Z M 235.00 429.92 M 394.86 472.12 L 413.40 429.92 L 440.08 429.92 L 408.92 490.71 L 380.75 490.71 L 349.64 429.92 L 376.32 429.92 Z M 394.86 472.12 M 524.50 465.26 C 523.07 484.84 505.91 490.71 485.03 490.71 C 463.29 490.66 445.35 484.37 445.43 462.41 L 445.43 458.18 C 445.35 436.27 463.29 429.97 485.03 429.89 C 505.91 429.93 523.07 435.80 524.50 455.33 L 501.33 455.33 C 499.22 449.64 492.79 448.30 485.03 448.30 C 475.80 448.43 467.95 450.07 468.08 459.60 L 468.08 461.03 C 467.95 470.48 475.80 472.20 485.03 472.33 C 492.79 472.33 499.26 470.95 501.33 465.26 Z M 524.50 465.26 M 559.44 429.89 L 527.80 429.89 L 559.41 460.37 L 527.80 490.84 L 559.44 490.84 L 575.70 475.55 L 591.84 460.37 Z M 559.44 429.89 M 591.74 429.43 L 591.74 450.41 L 591.71 450.41 L 591.71 469.87 L 591.74 469.87 L 591.74 490.84 L 615.68 490.84 L 615.68 429.43 Z M 591.74 429.43';
const ISOTYPE =
  'M 390.23 599.05 L 355.56 599.05 L 390.20 632.45 L 355.56 665.85 L 390.23 665.85 L 408.06 649.08 L 425.75 632.45 Z M 390.23 599.05 M 425.63 598.55 L 425.63 621.53 L 425.60 621.53 L 425.60 642.87 L 425.63 642.87 L 425.63 665.85 L 451.87 665.85 L 451.87 598.55 Z M 425.63 598.55';

/** Logotipo MVCK. Toma el color del texto (currentColor). */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="235 429.4 380.7 61.5"
      role="img"
      aria-label="MVCK Music"
    >
      <path fill="currentColor" d={WORDMARK} />
    </svg>
  );
}

/** Isotipo de la marca (la "K" partida), para íconos y elementos pequeños. */
export function Isotype({ className }: LogoProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="355.5 598.5 96.4 67.4"
      aria-hidden="true"
    >
      <path fill="currentColor" d={ISOTYPE} />
    </svg>
  );
}
