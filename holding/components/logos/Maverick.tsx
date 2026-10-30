import type { SVGProps } from 'react';

/** Logotipo "MAVERICK", tomado de "Logotipo Maverick RGB.pdf". Usa el color del texto. */
export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="45.9 261.1 475 44.7"
      fill="currentColor"
      role="img"
      aria-label="Maverick"
      {...props}
    >
      <path d="M 45.96 262.19 L 66.69 262.19 L 83.25 283.42 L 99.84 262.19 L 120.54 262.19 L 120.54 304.66 L 103.98 304.66 L 103.98 282.00 L 87.39 304.66 L 79.11 304.66 L 62.52 282.00 L 62.52 304.66 L 45.96 304.66 Z M 45.96 262.19" />
      <path d="M 214.12 291.73 L 227.08 262.25 L 245.72 262.25 L 223.95 304.72 L 204.26 304.72 L 182.53 262.25 L 201.17 262.25 Z M 214.12 291.73" />
      <path d="M 250.22 262.25 L 299.92 262.25 L 299.92 273.12 L 266.78 273.12 L 266.78 278.56 L 299.92 278.56 L 299.92 288.39 L 266.78 288.39 L 266.78 293.82 L 299.92 293.82 L 299.92 304.72 L 250.22 304.72 Z M 250.22 262.25" />
      <path d="M 328.51 274.64 L 328.51 281.87 L 348.70 281.87 C 349.71 281.87 350.56 281.53 351.26 280.83 C 351.98 280.10 352.33 279.25 352.33 278.27 C 352.33 276.25 350.72 274.64 348.70 274.64 Z M 352.87 262.22 C 361.62 262.13 369.05 269.49 368.92 278.27 C 368.92 281.46 368.07 284.37 366.36 286.96 C 364.68 289.52 362.44 291.48 359.66 292.78 L 368.92 304.69 L 351.29 304.69 L 343.29 294.33 L 328.51 294.33 L 328.51 304.69 L 311.95 304.69 L 311.95 262.22 Z M 352.87 262.22" />
      <path d="M 393.83 304.66 L 377.27 304.66 L 377.27 262.19 L 393.83 262.19 Z M 393.83 304.66" />
      <path d="M 459.85 287.06 C 458.80 301.40 446.23 305.70 430.94 305.70 C 415.01 305.67 401.87 301.06 401.93 284.97 L 401.93 281.87 C 401.87 265.82 415.01 261.21 430.94 261.15 C 446.23 261.18 458.80 265.48 459.85 279.79 L 442.88 279.79 C 441.33 275.62 436.62 274.64 430.94 274.64 C 424.17 274.73 418.42 275.94 418.52 282.92 L 418.52 283.96 C 418.42 290.88 424.17 292.14 430.94 292.24 C 436.62 292.24 441.36 291.23 442.88 287.06 Z M 459.85 287.06" />
      <path d="M 167.50 262.25 L 147.82 262.25 L 125.03 304.72 L 143.68 304.72 L 147.03 297.45 L 151.83 287.09 L 157.67 274.55 L 163.49 287.09 L 168.29 297.45 L 171.64 304.72 L 190.28 304.72 Z M 167.50 262.25" />
      <path d="M 504.33 262.19 L 504.33 276.69 L 504.30 276.69 L 504.30 290.16 L 504.33 290.16 L 504.33 304.66 L 520.88 304.66 L 520.88 262.19 Z M 504.33 262.19" />
      <path d="M 481.82 262.19 L 459.77 262.19 L 481.80 283.42 L 459.77 304.66 L 481.82 304.66 L 493.15 294.00 L 504.40 283.42 Z M 481.82 262.19" />
    </svg>
  );
}

/** Isotipo (flecha + barra) del mismo PDF. */
export function Isotype(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="130.6 183 289 200.8"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M 341.24 183.06 L 341.24 251.61 L 341.12 251.61 L 341.12 315.24 L 341.24 315.24 L 341.24 383.79 L 419.50 383.79 L 419.50 183.06 Z M 341.24 183.06" />
      <path d="M 234.85 183.06 L 130.65 183.06 L 234.75 283.42 L 130.65 383.79 L 234.85 383.79 L 288.42 333.42 L 341.57 283.42 Z M 234.85 183.06" />
    </svg>
  );
}

type OutlineProps = SVGProps<SVGSVGElement> & {
  /**
   * Prepara el trazo para dibujarse con una animación. El grosor pasa a
   * medirse en unidades del dibujo, porque la animación necesita escalar.
   */
  draw?: boolean;
};

/** El isotipo solo con contorno, como en las piezas de Instagram del sello. */
export function IsotypeOutline({
  strokeWidth = 1.5,
  draw = false,
  ...props
}: OutlineProps) {
  const pathProps = draw
    ? { pathLength: 1 }
    : { vectorEffect: 'non-scaling-stroke' as const };

  return (
    <svg
      viewBox="126 178 298 210"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M 341.24 183.06 L 341.24 251.61 L 341.12 251.61 L 341.12 315.24 L 341.24 315.24 L 341.24 383.79 L 419.50 383.79 L 419.50 183.06 Z M 341.24 183.06"
        {...pathProps}
      />
      <path
        d="M 234.85 183.06 L 130.65 183.06 L 234.75 283.42 L 130.65 383.79 L 234.85 383.79 L 288.42 333.42 L 341.57 283.42 Z M 234.85 183.06"
        {...pathProps}
      />
    </svg>
  );
}
