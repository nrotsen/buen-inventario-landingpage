import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';

export function Historia() {
  return (
    <Section id="historia" tone="cream" width="reading" className="py-32 md:py-48">
      <div className="max-w-[640px] mx-auto text-center">
        <EditorialMicro>Por qué existe Buen Inventario</EditorialMicro>

        <DisplayHeading
          level={2}
          className="mt-7 text-[44px] md:text-[64px] leading-[1.04] tracking-[-0.015em]"
        >
          Yo también tengo un almacén.
        </DisplayHeading>

        <p className="editorial-italic text-[28px] md:text-[36px] leading-snug text-teal-700 mt-4 md:mt-5">
          Y este sistema lo hice para mí primero.
        </p>

        <div className="mt-14 md:mt-[72px] text-left md:text-center space-y-5 md:space-y-6">
          <p className="text-body-lg md:text-[19px] text-ink/85 leading-relaxed max-w-[56ch] mx-auto">
            Soy Néstor. Tengo Don Néstor Despensa, un almacén de barrio con un empleado. Durante años trabajé "a ojo" — no sabía qué se vendía más, cuánto me robaban, ni cuánto ganaba de verdad.
          </p>
          <p className="text-body-lg md:text-[19px] text-ink/85 leading-relaxed max-w-[56ch] mx-auto">
            Buen Inventario lo armé para resolver eso en mi propio negocio. Hoy lo uso todos los días, y lo comparto con otros comerciantes que también quieran dejar de adivinar.
          </p>
        </div>

        <div className="mx-auto mt-16 md:mt-[88px] w-20 h-px bg-teal-700/60" aria-hidden="true" />
        <p className="mt-6 editorial-micro">
          Don Néstor Despensa · Almacén de barrio · Argentina
        </p>

        <div className="mx-auto mt-20 md:mt-[100px] w-[60px] h-px bg-teal-700/60" aria-hidden="true" />
        <p className="mt-6 editorial-micro">También lo usan</p>
        <p className="mt-3 text-body-sm text-text-muted leading-relaxed max-w-[48ch] mx-auto">
          Kioscos · Despensas · Ferreterías · Papeleras · Químicas · Regalerías · Comercios multisucursal
        </p>
      </div>
    </Section>
  );
}
