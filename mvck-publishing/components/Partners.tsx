import Image from 'next/image';

type Partner = {
  name: string;
  /** Qué cobra esta entidad. */
  role: string;
  /**
   * Logo oficial en /public/partners (por ejemplo '/partners/ascap.svg').
   * Mientras no esté, se muestra el nombre escrito.
   */
  logo?: string;
};

const PARTNERS: Partner[] = [
  { name: 'ASCAP', role: 'Comunicación pública' },
  { name: 'The MLC', role: 'Derechos mecánicos' },
  { name: 'Harry Fox Agency', role: 'Derechos mecánicos' },
  { name: 'Music Reports', role: 'Derechos mecánicos' },
  { name: 'SoundExchange', role: 'Derechos del máster' },
];

/** Fila de entidades de recaudación con las que trabaja la editorial. */
export function Partners() {
  return (
    <ul className="partner-list">
      {PARTNERS.map((partner) => (
        <li key={partner.name} className="partner">
          {partner.logo ? (
            <Image
              className="partner-logo"
              src={partner.logo}
              alt={partner.name}
              width={160}
              height={48}
            />
          ) : (
            <span className="partner-name">{partner.name}</span>
          )}
          <span className="partner-role">{partner.role}</span>
        </li>
      ))}
    </ul>
  );
}
