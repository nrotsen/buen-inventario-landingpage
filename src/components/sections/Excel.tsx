import type { LucideIcon } from 'lucide-react';
import { Eye, LineChart, Receipt, Archive, Wallet } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';

type Item = {
  icon: LucideIcon;
  num: string;
  label: string;
  headline: string;
  body: string;
};

const ITEMS: Item[] = [
  {
    icon: Eye,
    num: '01',
    label: 'Robo interno',
    headline: 'Si tu empleado te está robando.',
    body: 'Ves quién vendió qué, a qué hora, a qué precio. Si algo se va sin pasar por caja, queda el hueco.',
  },
  {
    icon: LineChart,
    num: '02',
    label: 'Ganancia real',
    headline: 'Cuánto ganás de verdad.',
    body: 'Ventas menos costos reales, calculado por el sistema. No el "creo que estoy bien" de fin de mes.',
  },
  {
    icon: Receipt,
    num: '03',
    label: 'Cuenta corriente',
    headline: 'Qué se llevaron tus clientes en cuenta corriente.',
    body: 'Cada movimiento queda registrado con fecha y producto. Si alguien discute, abrís la cuenta.',
  },
  {
    icon: Archive,
    num: '04',
    label: 'Stock muerto',
    headline: 'Cuánta plata tenés atrapada en stock que no rota.',
    body: 'El capital durmiendo en tu depósito, identificado por producto. Sabés qué dejar de comprar.',
  },
  {
    icon: Wallet,
    num: '05',
    label: 'Medios de cobro',
    headline: 'Con qué método se cobró cada venta.',
    body: 'Efectivo, transferencia, débito, crédito, Mercado Pago. Cada uno por separado, al cierre del día.',
  },
];

export function Excel() {
  return (
    <Section id="excel" tone="paper" width="editorial">
      <EditorialMicro>El diagnóstico</EditorialMicro>
      <DisplayHeading level={2} italicAccent={<>no te puede decir.</>} className="mt-5 max-w-[16ch]">
        Lo que el Excel
      </DisplayHeading>

      <div className="mt-14 border-t-hard border-ink">
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          const isLast = i === ITEMS.length - 1;
          return (
            <div
              key={item.num}
              className={`grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr] gap-4 md:gap-7 py-8 md:py-9 ${
                isLast ? 'border-b-hard border-ink' : 'border-b border-dashed border-border-subtle'
              }`}
            >
              <Icon className="w-8 h-8 md:w-9 md:h-9 text-teal-700 mt-0.5" strokeWidth={1.5} />
              <div>
                <EditorialMicro>{item.num} · {item.label}</EditorialMicro>
                <h3 className="editorial-display text-[22px] md:text-[26px] leading-snug mt-1.5 text-ink">
                  {item.headline}
                </h3>
                <p className="mt-2.5 text-body-md text-ink/80 leading-relaxed max-w-[56ch]">
                  {item.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
