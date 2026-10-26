'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { IsotypeOutline } from '@/components/Logo';

export type Pillar = {
  id: string;
  /** Pregunta corta que se ve en la pestaña. */
  label: string;
  /** Idea principal, en pocas palabras. */
  title: string;
  /** Texto oficial del sello. */
  text: ReactNode;
  points: readonly string[];
};

/** Tiempo que se muestra cada pestaña antes de pasar sola a la siguiente. */
const AUTOPLAY_MS = 7000;

/**
 * Los tres textos del sello como pestañas. Avanzan solas con una barra de
 * progreso, se detienen al pasar el mouse y dejan de avanzar en cuanto la
 * persona elige una. Con movimiento reducido no avanzan solas.
 */
export function Pillars({ pillars }: { pillars: readonly Pillar[] }) {
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
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!auto || paused || !inView || reduce.matches) return;
    const timer = window.setTimeout(
      () => setActive((i) => (i + 1) % pillars.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(timer);
  }, [active, auto, paused, inView, pillars.length]);

  const select = (index: number, focus = false) => {
    setAuto(false);
    setActive(index);
    if (focus) tabsRef.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = pillars.length - 1;
    const next: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowDown: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      ArrowUp: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const target = next[event.key];
    if (target === undefined) return;
    event.preventDefault();
    select(target, true);
  };

  const running = auto && !paused && inView;

  return (
    <div
      ref={rootRef}
      className="pillars"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="pillar-tabs"
        role="tablist"
        aria-label="Quiénes somos"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
      >
        {pillars.map((pillar, i) => {
          const selected = i === active;
          return (
            <button
              key={pillar.id}
              ref={(el) => {
                tabsRef.current[i] = el;
              }}
              id={`tab-${pillar.id}`}
              type="button"
              role="tab"
              className="pillar-tab"
              aria-selected={selected}
              aria-controls={`panel-${pillar.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
            >
              <span className="pillar-tab-number">0{i + 1}</span>
              <span className="pillar-tab-label">{pillar.label}</span>
              <span className="pillar-tab-bar" aria-hidden="true">
                {selected && (
                  <span
                    key={`${active}-${running}`}
                    className="pillar-tab-fill"
                    data-running={running ? '' : undefined}
                    data-done={auto ? undefined : ''}
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pillar-stage">
        <IsotypeOutline className="pillar-outline" />
        {pillars.map((pillar, i) => (
          <div
            key={pillar.id}
            id={`panel-${pillar.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${pillar.id}`}
            className="pillar-panel"
            hidden={i !== active}
          >
            <p className="pillar-kicker">{pillar.label}</p>
            <h3 className="pillar-title">{pillar.title}</h3>
            <p className="pillar-text">{pillar.text}</p>
            <ul className="pillar-points">
              {pillar.points.map((point, k) => (
                <li key={point} style={{ animationDelay: `${180 + k * 70}ms` }}>
                  <CheckIcon />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 5 5 9-10" />
    </svg>
  );
}
