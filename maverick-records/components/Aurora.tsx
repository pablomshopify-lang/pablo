/**
 * Manchas de luz de colores que flotan despacio detrás del contenido, con el
 * degradado de la marca (celeste, violeta y magenta).
 */
export function Aurora({ className = '' }: { className?: string }) {
  return (
    <div className={`aurora ${className}`} aria-hidden="true">
      <span className="aurora-blob aurora-cyan" />
      <span className="aurora-blob aurora-violet" />
      <span className="aurora-blob aurora-magenta" />
    </div>
  );
}
