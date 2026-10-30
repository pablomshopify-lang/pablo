'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { BrandLogo } from '@/components/BrandLogo';
import { ArrowIcon } from '@/components/Icons';
import { IsotypeOutline } from '@/components/logos/Maverick';
import type { Brand } from '@/lib/brands';

export type Step = {
  /** Lo que pasa con la música en este paso ("Se graba"). */
  verb: string;
  brand: Brand;
};

/** Tiempo que se muestra cada paso antes de pasar solo al siguiente. */
const AUTOPLAY_MS = 6000;

/**
 * El recorrido de un artista por las cinco marcas, como pestañas que avanzan
 * solas con una barra de progreso. Se detienen al pasar el mouse y dejan de
 * avanzar cuando la persona elige una. Con movimiento reducido no avanzan.
 */
export function Cycle({ steps }: { steps: readonly Step[] }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Solo avanza cuando la sección está en pantalla.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!auto || paused || !inView || reduce.matches) return;
    const timer = window.setTimeout(
      () => setActive((i) => (i + 1) % steps.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, auto, paused, inView, steps.length]);

  const select = (index: number, focus = false) => {
    setAuto(false);
    setActive(index);
    if (focus) tabsRef.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = steps.length - 1;
    const next: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const target = next[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target, true);
  };

  const running = auto && !paused && inView;
  const current = steps[active];

  return (
    <div
      ref={rootRef}
      className="cycle"
      style={
        {
          '--brand': current?.brand.accent,
          '--progress': active / (steps.length - 1),
        } as CSSProperties
      }
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="cycle-tabs"
        role="tablist"
        aria-label="El ciclo del artista"
        onKeyDown={onKeyDown}
      >
        <span className="cycle-rail" aria-hidden="true" />
        {steps.map((step, i) => {
          const selected = i === active;
          return (
            <button
              key={step.brand.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              id={`tab-${step.brand.id}`}
              type="button"
              role="tab"
              className="cycle-tab"
              aria-selected={selected}
              aria-controls={`panel-${step.brand.id}`}
              tabIndex={selected ? 0 : -1}
              data-past={i < active ? '' : undefined}
              style={{ '--dot': step.brand.accent } as CSSProperties}
              onClick={() => select(i)}
            >
              <span className="cycle-dot" aria-hidden="true">
                {selected && (
                  <span
                    key={`${active}-${running}`}
                    className="cycle-ring"
                    data-running={running ? '' : undefined}
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                )}
              </span>
              <span className="cycle-tab-number">0{i + 1}</span>
              <span className="cycle-tab-label">{step.verb}</span>
            </button>
          );
        })}
      </div>

      <div className="cycle-stage">
        <span className="cycle-glow" aria-hidden="true" />
        <IsotypeOutline className="cycle-outline" />
        {steps.map((step, i) => (
          <div
            key={step.brand.id}
            id={`panel-${step.brand.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${step.brand.id}`}
            className="cycle-panel"
            hidden={i !== active}
          >
            <p className="cycle-kicker">
              Paso 0{i + 1} · {step.brand.category}
            </p>
            <h3 className="cycle-title">{step.verb}.</h3>
            <div className="cycle-brand">
              <span className="brand-logo" data-logo={step.brand.id}>
                <BrandLogo id={step.brand.id} scope="cycle" />
              </span>
            </div>
            <p className="cycle-text">{step.brand.description}</p>
            {step.brand.url ? (
              <a
                className="link-arrow"
                href={step.brand.url}
                target="_blank"
                rel="noreferrer"
              >
                Visitar {step.brand.name}
                <ArrowIcon />
              </a>
            ) : (
              <span className="soon">Sitio web próximamente</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
