import Image from 'next/image';

type Partner = {
  name: string;
  /** Qué cobra esta entidad. */
  role: string;
  /** Logo oficial en /public/partners, con su tamaño original. */
  logo: { src: string; width: number; height: number };
};

const PARTNERS: Partner[] = [
  {
    name: 'ASCAP',
    role: 'Comunicación pública',
    logo: { src: '/partners/ascap.svg', width: 295, height: 106 },
  },
  {
    name: 'The MLC',
    role: 'Derechos mecánicos',
    logo: { src: '/partners/the-mlc.svg', width: 152, height: 58 },
  },
  {
    name: 'Harry Fox Agency',
    role: 'Derechos mecánicos',
    logo: { src: '/partners/harry-fox-agency.png', width: 300, height: 191 },
  },
  {
    name: 'Music Reports',
    role: 'Derechos mecánicos',
    logo: { src: '/partners/music-reports.png', width: 604, height: 240 },
  },
  {
    name: 'SoundExchange',
    role: 'Derechos del máster',
    logo: { src: '/partners/soundexchange.png', width: 267, height: 203 },
  },
];

/** Fila de entidades de recaudación con las que trabaja la editorial. */
export function Partners() {
  return (
    <ul className="partner-list">
      {PARTNERS.map((partner) => (
        <li key={partner.name} className="partner">
          <Image
            className="partner-logo"
            src={partner.logo.src}
            alt={partner.name}
            width={partner.logo.width}
            height={partner.logo.height}
            unoptimized
          />
          <span className="partner-role">{partner.role}</span>
        </li>
      ))}
    </ul>
  );
}
