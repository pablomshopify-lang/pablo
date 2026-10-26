'use client';

import { useRef } from 'react';
import type { PointerEvent, ReactNode } from 'react';

type SpotlightProps = {
  children: ReactNode;
  className?: string;
  /** Selector de los hijos que reciben la luz (por ejemplo cada tarjeta). */
  targets?: string;
};

/**
 * Guarda la posición del mouse en las variables CSS --x e --y, para que una luz
 * suave siga el cursor. Sin mouse (celulares) simplemente no hace nada.
 */
export function Spotlight({ children, className, targets }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const root = ref.current;
    if (!root) return;
    const elements = targets
      ? Array.from(root.querySelectorAll<HTMLElement>(targets))
      : [root];
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--x', `${event.clientX - rect.left}px`);
      el.style.setProperty('--y', `${event.clientY - rect.top}px`);
    }
  };

  return (
    <div ref={ref} className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
