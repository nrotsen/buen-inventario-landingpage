import type { ReactNode } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { BrowserFrame } from '@/components/ui/BrowserFrame';
import { ProductsFakeScreen } from '@/components/ui/fake-screens/ProductsFakeScreen';
import { LedgerFakeScreen } from '@/components/ui/fake-screens/LedgerFakeScreen';
import { CajaFakeScreen } from '@/components/ui/fake-screens/CajaFakeScreen';
import { signupUrl } from '@/lib/config';

type Capture = {
  num: string;
  label: string;
  headline: string;
  body: string;
  url: string;
  screen: ReactNode;
};

const CAPTURES: Capture[] = [
  {
    num: '01',
    label: 'Productos',
    headline: 'El capital durmiendo en tu depósito.',
    body: 'Cada producto con stock, costo, margen y días sin venta. Los que duermen se ven solos.',
    url: 'bueninventario.com/admin/productos',
    screen: <ProductsFakeScreen />,
  },
  {
    num: '02',
    label: 'Cuentas corrientes',
    headline: 'Quién te debe qué.',
    body: 'La cuenta de cada cliente con saldo, último movimiento y detalle de cada compra. Cero discusión.',
    url: 'bueninventario.com/admin/clientes/marcos-lopez',
    screen: <LedgerFakeScreen />,
  },
  {
    num: '03',
    label: 'Cierre de caja',
    headline: 'El día cerrado en 30 segundos.',
    body: 'Total por método de pago, diferencias, próxima apertura. Lo que antes te llevaba una hora a mano.',
    url: 'bueninventario.com/admin/caja/cierre',
    screen: <CajaFakeScreen />,
  },
];

export function Sistema() {
  return (
    <Section id="sistema" tone="ink" className="py-28 md:py-44">
      <div className="max-w-[760px]">
        <EditorialMicro className="!text-paper/55">El sistema</EditorialMicro>
        <DisplayHeading level={2} italicAccent={<>abrir todos los días.</>} className="mt-5 !text-paper">
          Esto es lo que vas a
        </DisplayHeading>
        <p className="mt-6 text-body-lg text-paper/70 max-w-[55ch] leading-relaxed">
          Tres pantallas. Las que más usás. Las que muestran lo que el Excel te ocultaba.
        </p>
      </div>

      <div className="mt-20 flex flex-col gap-24">
        {CAPTURES.map((c) => (
          <div key={c.num} className="text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-teal-500">
              {c.num} · {c.label}
            </p>
            <h3 className="editorial-display text-[26px] md:text-[34px] leading-tight mt-2.5 text-paper">
              {c.headline}
            </h3>
            <p className="mt-3 text-body-md text-paper/65 max-w-[48ch] mx-auto leading-relaxed">
              {c.body}
            </p>
            <div className="mt-9 max-w-[920px] mx-auto">
              <BrowserFrame url={c.url}>{c.screen}</BrowserFrame>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 max-w-[640px] mx-auto text-center">
        <p className="editorial-display text-[24px] md:text-[32px] leading-snug text-paper">
          Cargás tus productos en una tarde.{' '}
          <em className="editorial-italic text-teal-500">Empezás a operar mañana.</em>
        </p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
          <Button as="a" href={signupUrl()} variant="inverted" size="lg" className="sm:min-w-[200px]">
            Probalo gratis <span className="font-mono">→</span>
          </Button>
          <Button as="a" href="#precio" variant="ghost-on-dark" size="lg" className="sm:min-w-[200px]">
            Ver el precio
          </Button>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.06em] text-paper/55">
          Sin tarjeta · 30 días de prueba · Cancelás cuando quieras
        </p>
      </div>
    </Section>
  );
}
