import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { signupUrl } from '@/lib/config';

const FEATURES = [
  'Stock + Caja + Clientes + Proveedores',
  'Multi-user (admins, managers, empleados)',
  'Mi Web — tienda online incluida',
  'Analíticas + Métricas',
  'Aceptás Mercado Pago en tu comercio',
  'Soporte por email y WhatsApp',
];

export function Precio() {
  return (
    <Section id="precio" tone="paper" width="reading" innerClassName="text-center">
      <EditorialMicro>Plan único</EditorialMicro>
      <DisplayHeading level={2} italicAccent={<>todo incluido.</>} className="mt-5">
        Un precio,
      </DisplayHeading>
      <p className="mt-6 text-body-lg text-ink/75 max-w-[44ch] mx-auto leading-relaxed">
        Sin tiers, sin add-ons, sin sorpresas en el resumen de la tarjeta. Lo que ves es lo que pagás.
      </p>

      <div className="mt-16 mx-auto max-w-[440px] bg-surface border-hard border-ink rounded-md shadow-offset-md p-10">
        <div className="pb-7 border-b-hard border-ink">
          <EditorialMicro>Plan Standard</EditorialMicro>
          <p className="editorial-display text-[64px] md:text-[76px] leading-none tracking-[-0.02em] mt-3">
            $14.900<span className="font-mono text-[22px] text-text-muted tracking-normal"> / mes</span>
          </p>
          <EditorialMicro className="mt-3">ARS · Renueva automáticamente</EditorialMicro>
        </div>

        <ul className="mt-7 space-y-2 text-left">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-body-md text-ink/85 leading-relaxed">
              <span className="font-mono text-teal-700 font-medium mt-0.5">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Button as="a" href={signupUrl()} variant="primary" size="lg" className="mt-9 w-full">
          Empezá 30 días gratis <span className="font-mono">→</span>
        </Button>
        <p className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted">
          Sin tarjeta · Cancelás cuando quieras
        </p>
      </div>

      <p className="mt-10 text-body-sm text-text-muted max-w-[40ch] mx-auto leading-relaxed">
        Sin contrato, sin permanencia. Cancelás desde el panel y se acabó.
      </p>
    </Section>
  );
}
