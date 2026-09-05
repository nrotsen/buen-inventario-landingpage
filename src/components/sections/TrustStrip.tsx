import type { ReactNode } from 'react';
import { CATALOG_ITEMS, formatApprox } from '@/lib/facts';
import { TRIAL_DAYS } from '@/lib/pricing';

interface Signal {
  key: string;
  big: ReactNode;
  small: string;
}

/**
 * Cuatro señales VERIFICABLES. Ninguna habla de adopción: describen
 * la garantía, el producto, la integridad de los datos y el origen.
 */
const SIGNALS: Signal[] = [
  { key: 'trial',    big: <>{TRIAL_DAYS} días</>,                                    small: 'gratis, sin tarjeta. Cancelás cuando quieras.' },
  { key: 'catalog',  big: <>{formatApprox(CATALOG_ITEMS)}</>,                        small: 'productos de tu rubro ya cargados. No arrancás de cero.' },
  { key: 'data',     big: <>Tus datos<br />son tuyos</>,                             small: 'Los exportás a Excel cuando quieras. Si te vas, te los llevás.' },
  { key: 'founder',  big: <em className="editorial-italic text-teal-700">Un almacén<br />de verdad</em>, small: 'Hecho en Don Néstor Despensa. Usado todos los días.' },
];

export function TrustStrip() {
  return (
    <div className="border-y-hard border-ink bg-cream px-6 md:px-10">
      <div className="mx-auto grid max-w-container grid-cols-1 md:grid-cols-4">
        {SIGNALS.map((s) => (
          <div
            key={s.key}
            className="border-b border-dashed border-border-subtle px-5 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-7 md:last:border-r-0"
          >
            <p className="editorial-display text-[26px] leading-tight">{s.big}</p>
            <p className="mt-1.5 text-body-sm leading-relaxed text-text-muted">{s.small}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
