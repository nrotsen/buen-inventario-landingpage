import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { signupUrl } from '@/lib/config';
import { track } from '@/lib/analytics';
import { PLAN_PRICE_ARS, TRIAL_DAYS, COMPETITOR_FLOOR_ARS, COMPETITOR_TRIAL_DAYS, formatArs } from '@/lib/pricing';

const FEATURES = [
  'Ventas, stock, caja y cuentas corrientes',
  'Catálogo de tu rubro precargado',
  'Facturación ARCA cuando vos quieras',
  'Tienda web propia conectada al stock',
  'Multi-sucursal y usuarios ilimitados',
  'Soporte por WhatsApp — te contesto yo',
];

export function Precio() {
  return (
    <Section id="precio" tone="cream" width="reading" innerClassName="text-center">
      <EditorialMicro>El precio</EditorialMicro>
      <DisplayHeading level={2} italicAccent={<>Sin letra chica.</>} className="mt-5">
        Un plan. Todo incluido.
      </DisplayHeading>

      <div className="mx-auto mt-11 max-w-[520px] rounded-[3px] border-hard border-ink bg-surface p-8 text-center shadow-offset-lg">
        <EditorialMicro>Plan único · ARS</EditorialMicro>

        <p className="editorial-display mt-2.5 text-[62px] leading-none">
          {formatArs(PLAN_PRICE_ARS)}
          <span className="font-mono text-[19px] text-text-muted"> / mes</span>
        </p>

        <p className="mt-3 text-body-sm text-text-muted">
          Después de {TRIAL_DAYS} días gratis. Sin tarjeta para probar.
        </p>

        <ul className="mt-7 flex flex-col gap-2.5 text-left">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-body-sm text-ink/85">
              <span className="font-mono font-bold text-teal-700" aria-hidden="true">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          as="a"
          href={signupUrl()}
          variant="primary"
          size="lg"
          className="mt-8 w-full"
          onClick={() => track('cta_signup_clicked', { section: 'precio' })}
        >
          Empezar {TRIAL_DAYS} días gratis <span className="font-mono">→</span>
        </Button>

        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted">
          Sin tarjeta · Cancelás cuando quieras
        </p>
      </div>

      <p className="mx-auto mt-6 max-w-[46ch] text-body-sm leading-relaxed text-text-muted">
        Para comparar: los sistemas de gestión más conocidos del país arrancan arriba de{' '}
        {formatArs(COMPETITOR_FLOOR_ARS)} por mes y te dan {COMPETITOR_TRIAL_DAYS} días de prueba.
      </p>
    </Section>
  );
}
