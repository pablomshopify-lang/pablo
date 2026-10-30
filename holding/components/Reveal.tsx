'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso en milisegundos, para que los elementos entren uno tras otro. */
  delay?: number;
};

/** Hace aparecer su contenido suavemente la primera vez que entra en pantalla. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.visible = '';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal=""
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
