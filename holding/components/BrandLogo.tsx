import Image from 'next/image';
import { LiveLogo } from '@/components/logos/Live';
import { Logo as MaverickLogo } from '@/components/logos/Maverick';
import { MusicLogo } from '@/components/logos/Music';
import { PublishingLogo } from '@/components/logos/Publishing';
import type { BrandId } from '@/lib/brands';

type BrandLogoProps = {
  id: BrandId;
  className?: string;
  /** Prefijo único para los degradados SVG, si el logo aparece varias veces. */
  scope: string;
};

/**
 * Logotipo oficial de cada marca, en blanco. El acento de color sale de la
 * variable --brand de la tarjeta que lo contiene.
 */
export function BrandLogo({ id, className, scope }: BrandLogoProps) {
  switch (id) {
    case 'records':
      return (
        <MaverickLogo className={className} aria-label="Maverick Record" />
      );
    case 'music':
      return <MusicLogo className={className} />;
    case 'publishing':
      return <PublishingLogo className={className} />;
    case 'live':
      return <LiveLogo className={className} gradientId={`${scope}-live`} />;
    case 'ticket':
      // Solo existe en imagen (tomada de la presentación original).
      return (
        <Image
          src="/brands/mavs-ticket.png"
          width={900}
          height={197}
          alt="Mavs Ticket"
          className={className}
          sizes="200px"
        />
      );
  }
}
