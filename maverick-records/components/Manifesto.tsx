'use client';

import { useEffect, useRef, useState } from 'react';
import { IsotypeOutline } from '@/components/Logo';

export type Segment = { text: string; strong?: boolean };

export type ManifestoItem = {
  id: string;
  title: string;
  segments: Segment[];
};

type Word = { text: string; strong: boolean };

function toWords(segments: Segment[]): Word[] {
  return segments.flatMap((segment) =>
    segment.text
      .split(' ')
      .filter(Boolean)
      .map((text) => ({ text, strong: Boolean(segment.strong) })),
  );
}

/**
 * Los tres textos del sello en una sola sección fija: al hacer scroll cada
 * frase se ilumina palabra por palabra y luego da paso a la siguiente.
 */
export function Manifesto({ items }: { items: ManifestoItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const count = items.length;
  const position = progress * count;
  const active = Math.min(count - 1, Math.floor(position));

  return (
    <section
      ref={ref}
      className="manifesto"
      style={{ height: `${count * 110 + 40}svh` }}
      aria-label="Manifiesto"
    >
      {/* Anclas para el menú: una por cada frase */}
      {items.map((item, i) => (
        <span
          key={item.id}
          id={item.id}
          className="manifesto-anchor"
          style={{ top: `${(i / count) * 100}%` }}
        />
      ))}

      <div className="manifesto-sticky">
        <IsotypeOutline className="manifesto-outline" />

        <ol className="manifesto-dots" aria-hidden="true">
          {items.map((item, i) => (
            <li key={item.id} data-active={i === active ? '' : undefined} />
          ))}
        </ol>

        {items.map((item, i) => {
          const words = toWords(item.segments);
          // Las palabras terminan de encenderse al 75% del tramo de cada frase.
          const local = Math.min(1, Math.max(0, (position - i) / 0.75));
          return (
            <article
              key={item.id}
              className="manifesto-item"
              data-state={
                i === active ? 'active' : i < active ? 'past' : 'next'
              }
              aria-hidden={i !== active}
            >
              <h2 className="headline">{item.title}</h2>
              <span className="manifesto-number">{i + 1}.</span>
              <p className="statement">
                {words.map((word, k) => {
                  const lit = Math.min(
                    1,
                    Math.max(0, local * words.length - k),
                  );
                  const Tag = word.strong ? 'strong' : 'span';
                  return (
                    <Tag
                      key={k}
                      className="word"
                      style={{ opacity: 0.18 + lit * 0.82 }}
                    >
                      {word.text}{' '}
                    </Tag>
                  );
                })}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
