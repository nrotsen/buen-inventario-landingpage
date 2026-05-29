import { Section } from '@/components/ui/Section';
import { DisplayHeading } from '@/components/ui/DisplayHeading';
import { EditorialMicro } from '@/components/ui/EditorialMicro';

type Row = {
  feature: string;
  excel: string;
  bi: string;
};

const ROWS: Row[] = [
  {
    feature: 'Stock actualizado al instante',
    excel: 'Manual, casi nunca se hace',
    bi: 'Sí, con cada venta',
  },
  {
    feature: 'Saber qué clientes te deben y cuánto',
    excel: 'Cuaderno aparte, otro Excel',
    bi: 'Integrado, por cliente',
  },
  {
    feature: 'Cierre de caja con totales por método',
    excel: 'A mano, calculadora, rezar',
    bi: 'Automático en 30 segundos',
  },
  {
    feature: 'Detectar productos que no rotan',
    excel: 'Difícil de cruzar',
    bi: 'Te lo muestra solo',
  },
  {
    feature: 'Acceso desde cualquier dispositivo',
    excel: 'No, archivo en una sola PC',
    bi: 'Sí, desde el celular',
  },
  {
    feature: 'Histórico que no se pierde',
    excel: 'Riesgo alto (archivos, USB)',
    bi: 'Siempre accesible, online',
  },
];

export function ExcelComparison() {
  return (
    <Section id="comparativa" tone="paper" width="editorial">
      <div className="max-w-[720px]">
        <EditorialMicro>La diferencia</EditorialMicro>
        <DisplayHeading level={2} className="mt-5 max-w-[20ch]">
          ¿Por qué <em className="editorial-italic text-teal-500">no alcanza</em> con Excel?
        </DisplayHeading>
        <p className="mt-6 text-body-lg text-ink/75 max-w-[56ch] leading-relaxed">
          Lo mismo que ya hacés a mano, hecho una sola vez y bien — sin discusión, sin recalcular, sin perderte cosas en el camino.
        </p>
      </div>

      {/* DESKTOP TABLE (≥md) */}
      <table className="hidden md:table mt-16 w-full border-collapse border-t-hard border-b-hard border-ink">
        <thead>
          <tr>
            <th className="text-left py-5 pr-6 w-[38%] editorial-micro font-normal border-b border-border-subtle">
              Característica
            </th>
            <th className="text-left py-5 pr-6 w-[31%] editorial-micro font-normal border-b border-border-subtle">
              Excel / Cuaderno
            </th>
            <th className="text-left py-5 pl-6 pr-6 w-[31%] editorial-micro font-medium !text-teal-700 border-b border-border-subtle">
              Buen Inventario
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => {
            const isLast = i === ROWS.length - 1;
            const borderClass = isLast ? '' : 'border-b border-dashed border-border-subtle';
            return (
              <tr key={row.feature}>
                <td className={`py-5 pr-6 editorial-display text-[18px] leading-snug align-top ${borderClass}`}>
                  {row.feature}
                </td>
                <td className={`py-5 pr-6 text-body-md text-text-muted align-top ${borderClass}`}>
                  {row.excel}
                </td>
                <td className={`py-5 pl-6 pr-6 text-body-md text-ink font-medium align-top bg-teal-50/40 border-l-2 border-teal-700/40 ${borderClass}`}>
                  <span className="text-teal-700 font-bold mr-1">•</span>
                  {row.bi}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MOBILE CARDS (<md) */}
      <div className="md:hidden mt-12 border-t-hard border-ink">
        {ROWS.map((row, i) => {
          const isLast = i === ROWS.length - 1;
          const outerBorder = isLast ? 'border-b-hard border-ink' : 'border-b border-dashed border-border-subtle';
          return (
            <article key={row.feature} className={`py-7 ${outerBorder}`}>
              <h3 className="editorial-display text-[20px] leading-snug text-ink mb-4">
                {row.feature}
              </h3>
              <div className="grid grid-cols-[88px_1fr] gap-3 py-3 items-baseline">
                <span className="editorial-micro !text-[10px]">Excel</span>
                <span className="text-body-sm text-text-muted leading-relaxed">{row.excel}</span>
              </div>
              <div className="grid grid-cols-[88px_1fr] gap-3 py-3 -mx-3 pl-3 pr-3 border-l-2 border-teal-700/40 bg-teal-50/40 items-baseline border-t border-dashed border-border-subtle">
                <span className="editorial-micro !text-[10px] !text-teal-700">B. Inventario</span>
                <span className="text-body-sm text-ink font-medium leading-relaxed">
                  <span className="text-teal-700 font-bold mr-1">•</span>
                  {row.bi}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
