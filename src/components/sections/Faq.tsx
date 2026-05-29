import { ChevronRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';
import { whatsappLink } from '@/lib/contact';

type Qa = { q: string; a: string };

const QAS: Qa[] = [
  {
    q: '¿Tengo que facturar TODO lo que cargo en el sistema?',
    a: 'No. Vos decidís qué facturás y qué no. El sistema te ordena el negocio — no te controla, no te denuncia, no se conecta con ARCA salvo que vos lo actives.',
  },
  {
    q: '¿Sirve si no soy bueno con la tecnología?',
    a: 'Si sabés usar WhatsApp, sabés usar Buen Inventario. Es lo mismo: ves un número, tocás, listo. La complejidad está adentro, la pantalla es simple.',
  },
  {
    q: '¿Puedo migrar lo que tengo en Excel?',
    a: 'Sí. Si querés, te ayudo yo personalmente con la migración en la primera semana. Cero costo extra. Cero dolor.',
  },
  {
    q: '¿Qué pasa con mis datos si dejo de usarlo?',
    a: 'Te los exportás cuando quieras, en CSV o Excel. Son tuyos, no míos. Si te vas, te los llevás.',
  },
  {
    q: '¿Funciona si se cae internet?',
    a: 'Sigue funcionando en el navegador con los últimos datos cargados. Cuando vuelve internet, sincroniza solo.',
  },
  {
    q: '¿Sirve solo para almacenes y kioscos?',
    a: 'No. Lo armé para mi almacén pero hoy lo usan también ferreterías, papeleras, químicas, regalerías y cualquier comercio chico que venda productos por unidad. También funciona para multisucursal (feature en desarrollo). Si tu negocio maneja stock, ventas y cuentas, te sirve.',
  },
];

export function Faq() {
  return (
    <Section id="faq" tone="cream" width="reading">
      <div className="text-center">
        <EditorialMicro>Dudas comunes</EditorialMicro>
        <DisplayHeading level={2} italicAccent={<>siempre.</>} className="mt-5">
          Lo que me preguntan
        </DisplayHeading>
      </div>

      <div className="mt-14 border-t-hard border-ink">
        {QAS.map((qa) => (
          <details key={qa.q} className="faq-toggle border-b-hard border-ink group">
            <summary className="flex justify-between items-baseline py-7 cursor-pointer gap-4">
              <span className="editorial-display text-[20px] md:text-[23px] leading-snug text-ink">
                {qa.q}
              </span>
              <ChevronRight
                className="faq-icon w-5 h-5 text-teal-700 shrink-0 mt-1"
                strokeWidth={1.75}
                aria-hidden="true"
              />
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
          href={whatsappLink('Hola Néstor, tengo una pregunta sobre Buen Inventario.')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-700 underline underline-offset-[3px] hover:text-ink transition-colors"
        >
          Escribime por WhatsApp →
        </a>
      </p>
    </Section>
  );
}
