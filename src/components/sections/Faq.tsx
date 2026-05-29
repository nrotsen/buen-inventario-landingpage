import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { whatsappLink } from '@/lib/contact';

type Qa = { q: string; a: string };

const QAS: Qa[] = [
  {
    q: '¿Tengo que facturar todo lo que cargo en el sistema?',
    a: 'No. Vos decidís qué facturás y qué no. El sistema te ordena, no te controla.',
  },
  {
    q: '¿Sirve si no soy bueno con la tecnología?',
    a: 'Sí. Si sabés mandar un audio por WhatsApp, sabés usar Buen Inventario. La pantalla principal tiene lo que necesitás todos los días. El resto está ahí cuando lo busques.',
  },
  {
    q: '¿Qué pasa con mis datos si dejo de usarlo?',
    a: 'Te los exportamos en un Excel. Sin preguntas, sin trabas. Tu negocio es tuyo, tus datos también.',
  },
  {
    q: '¿Puedo migrar lo que tengo en Excel?',
    a: 'Sí. Cargás tu planilla actual, mapeamos las columnas y los productos quedan adentro en una tarde. Si te trabás, te ayudamos por WhatsApp.',
  },
];

export function Faq() {
  return (
    <Section id="faq" tone="cream" width="reading">
      <div className="text-center">
        <EditorialMicro>Preguntas frecuentes</EditorialMicro>
        <DisplayHeading level={2} italicAccent={<>nos preguntan.</>} className="mt-5">
          Lo que más
        </DisplayHeading>
      </div>

      <div className="mt-14 border-t-hard border-ink">
        {QAS.map((qa) => (
          <details key={qa.q} className="faq-toggle border-b-hard border-ink group">
            <summary className="flex justify-between items-baseline py-7 cursor-pointer">
              <span className="editorial-display text-[20px] md:text-[23px] leading-snug text-ink pr-4">
                {qa.q}
              </span>
              <span className="faq-icon font-mono text-[22px] text-teal-700 leading-none shrink-0">+</span>
            </summary>
            <p className="pb-7 text-body-lg text-ink/80 max-w-[60ch] leading-relaxed">
              {qa.a}
            </p>
          </details>
        ))}
      </div>

      <p className="mt-16 text-center text-body-md text-ink/80">
        ¿Tenés otra pregunta?{' '}
        <a
          href={whatsappLink('Hola, tengo una pregunta sobre Buen Inventario.')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-700 underline underline-offset-[3px] hover:text-ink transition-colors"
        >
          Escribinos por WhatsApp →
        </a>
      </p>
    </Section>
  );
}
