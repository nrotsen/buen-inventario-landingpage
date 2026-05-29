import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { BrowserFrame } from '@/components/ui/BrowserFrame';
import { AnalyticsFakeScreen } from '@/components/ui/fake-screens/AnalyticsFakeScreen';
import { signupUrl } from '@/lib/config';

export function Hero() {
  return (
    <Section id="hero" tone="paper" className="pt-32 md:pt-40 pb-24 md:pb-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        <div className="md:col-span-5 max-w-[540px]">
          <EditorialMicro>Sistema de gestión · Almacenes y comercios chicos</EditorialMicro>
          <DisplayHeading level={1} italicAccent={<>de tu comercio.</>} className="mt-5">
            Recuperá el control
          </DisplayHeading>
          <p className="mt-7 text-body-lg text-ink/80 max-w-[44ch]">
            Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. Probá 30 días gratis, sin tarjeta.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button as="a" href={signupUrl()} variant="primary" size="lg">
              Probalo gratis <span className="font-mono">→</span>
            </Button>
            <Button as="a" href="#sistema" variant="ghost" size="lg">
              Ver cómo funciona
            </Button>
          </div>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted leading-relaxed">
            Sin tarjeta <span className="text-teal-600">·</span> Cancelás cuando quieras <span className="text-teal-600">·</span> Hecho desde un almacén real
          </p>
        </div>
        <div className="md:col-span-7">
          <BrowserFrame url="bueninventario.com/admin/analytics">
            <AnalyticsFakeScreen />
          </BrowserFrame>
        </div>
      </div>
    </Section>
  );
}
