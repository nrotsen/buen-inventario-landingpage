import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { signupUrl } from '@/lib/config';
import { whatsappLink } from '@/lib/contact';

export function Precio() {
  return (
    <Section id="precio" tone="paper" width="reading" innerClassName="text-center">
      <EditorialMicro>El precio</EditorialMicro>
      <DisplayHeading
        level={2}
        italicAccent={<>de plata.</>}
        className="mt-5 max-w-[18ch] mx-auto"
      >
        Cuando estés convencido,
        <br />
        hablamos
      </DisplayHeading>

      <p className="mt-8 text-body-lg text-ink/75 max-w-[52ch] mx-auto leading-relaxed">
        Tenés 30 días para probar todo. Sin tarjeta, sin compromiso, sin letra chica. Si te sirve, te paso el precio. Si no te sirve, no te debo nada y se acabó.
      </p>

      <div className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
        <Button as="a" href={signupUrl()} variant="primary" size="lg" className="sm:min-w-[200px]">
          Probalo gratis <span className="font-mono">→</span>
        </Button>
        <Button
          as="a"
          href={whatsappLink('Hola Néstor, quiero saber el precio de Buen Inventario.')}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="lg"
          className="sm:min-w-[200px]"
        >
          Escribime por WhatsApp
        </Button>
      </div>

      <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted">
        Sin tarjeta · Sin compromiso · Sin letra chica
      </p>
    </Section>
  );
}
