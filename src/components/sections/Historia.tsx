import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { PhotoFrame } from '@/components/ui/PhotoFrame';

export function Historia() {
  return (
    <Section id="historia" tone="cream">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
        <div className="md:col-span-5">
          <PhotoFrame>
            <img
              src="/nestor-portrait.png"
              alt="Néstor, fundador de Buen Inventario, ilustrado."
              className="w-[112%] h-auto block -mb-[4%]"
              style={{ filter: 'contrast(1.02) saturate(0.95)' }}
              loading="lazy"
              width="1024"
              height="1024"
            />
          </PhotoFrame>
          <p className="mt-3 editorial-micro">
            Don Néstor Despensa · Almacén de barrio · Argentina
          </p>
        </div>
        <div className="md:col-span-7 max-w-[620px]">
          <EditorialMicro>Por qué existe Buen Inventario</EditorialMicro>
          <DisplayHeading level={2} className="mt-5 max-w-[14ch]">
            Yo también tengo un almacén.
          </DisplayHeading>
          <p className="editorial-italic text-[24px] leading-snug text-teal-700 mt-3.5">
            Y este sistema lo hice para mí primero.
          </p>
          <p className="mt-7 text-body-lg text-ink/85 max-w-[55ch] leading-relaxed">
            Soy Néstor. Tengo Don Néstor Despensa, un almacén de barrio con un empleado. Durante años trabajé "a ojo" — no sabía qué se vendía más, cuánto me robaban, ni cuánto ganaba de verdad.
          </p>
          <p className="mt-5 text-body-lg text-ink/85 max-w-[55ch] leading-relaxed">
            Buen Inventario lo armé para resolver eso en mi propio negocio. Hoy lo uso todos los días, y lo comparto con otros comerciantes que también quieran dejar de adivinar.
          </p>
          <p className="mt-10 editorial-italic text-[22px] text-ink">— Néstor B.</p>
          <p className="mt-1.5 editorial-micro">Fundador · Buen Inventario</p>
        </div>
      </div>
    </Section>
  );
}
