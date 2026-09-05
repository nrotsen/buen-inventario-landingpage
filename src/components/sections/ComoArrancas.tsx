import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';

interface Step {
  when: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  { when: 'Hoy',                title: 'Te abrís la cuenta y elegís tu rubro',        body: 'Dos minutos. Sin tarjeta. En cuanto elegís el rubro, tu catálogo aparece cargado — casi 30.000 productos con código de barras esperando.' },
  { when: 'Esta tarde',         title: 'Subís tus archivos Excel y se cargan solos',  body: 'Productos, clientes y proveedores. Si tenés precios propios, los importás. Si no tenés nada en Excel, escaneás y cargás sobre el catálogo que ya está.' },
  { when: 'Mañana',             title: 'Empezás a vender con el sistema',             body: 'Abrís caja, vendés, cerrás. Desde el primer día ya sabés cuánto entró por cada método y cuánto ganaste de verdad.' },
  { when: 'La primera semana',  title: 'Si te trabás, me escribís a mí',              body: 'No hay mesa de ayuda ni ticket. Me escribís por WhatsApp y te contesto yo. La migración de tu Excel te la hago yo personalmente, sin costo.' },
];

export function ComoArrancas() {
  return (
    <Section id="arrancar" tone="paper" width="editorial">
      <EditorialMicro>Cómo arrancás</EditorialMicro>
      <DisplayHeading level={2} italicAccent={<>a estar operando.</>} className="mt-5">
        De decir que sí
      </DisplayHeading>
      <p className="mt-6 max-w-[56ch] text-body-lg leading-relaxed text-ink/75">
        La objeción real no es el precio: es "no tengo tiempo para cargar todo". Esto es lo que pasa de verdad.
      </p>

      <div className="mt-14 border-t-hard border-ink">
        {STEPS.map((step, i) => {
          const isLast = i === STEPS.length - 1;
          return (
            <div
              key={step.when}
              className={`grid grid-cols-[64px_1fr] gap-4 py-6 md:grid-cols-[120px_1fr] md:gap-8 ${
                isLast ? 'border-b-hard border-ink' : 'border-b border-dashed border-border-subtle'
              }`}
            >
              <span className="pt-1 font-mono text-[11px] uppercase tracking-[0.09em] text-teal-700">
                {step.when}
              </span>
              <div>
                <h3 className="editorial-display text-[24px] leading-snug">{step.title}</h3>
                <p className="mt-1.5 max-w-[60ch] text-body-md text-ink/78">{step.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
