import { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatArs } from '@/lib/pricing';
import { CIERRE_DATE, CIERRE_ROWS, CIERRE_PROFIT, CIERRE_UNITS, cierreTotal } from '../data';
import { HintBar } from '../parts/HintBar';

/** Color del swatch por método. Tokens, nunca hex sueltos en el JSX. */
const SWATCH: Record<string, string> = {
  'Efectivo':      'bg-teal-500',
  'Transferencia': 'bg-ink',
  'Débito':        'bg-teal-700',
  'Crédito':       'bg-text-placeholder',
  'Mercado Pago':  'bg-cream',
  'Fiado':         'border-dashed border-teal-700 bg-transparent',
};

export function ChapterCerrar() {
  const [cerrada, setCerrada] = useState(false);
  const total = cierreTotal();

  return (
    <div>
      <HintBar>🌙 <b className="font-semibold">Son las 21:00.</b> Así se cierra el día.</HintBar>

      <div className="px-4 py-5">
        <p className="editorial-micro">Caja del {CIERRE_DATE}</p>

        <div className="mt-3.5">
          {CIERRE_ROWS.map((row) => (
            <div key={row.method} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-3 text-body-md">
              <span className={cn('flex items-center gap-2.5', row.isCredit && 'text-teal-700')}>
                <span className={cn('size-2.5 shrink-0 rounded-[1px] border border-ink', SWATCH[row.method])} aria-hidden="true" />
                {row.isCredit ? 'Fiado (no entró plata)' : row.method}
              </span>
              <span className={cn('text-right font-mono font-medium', row.isCredit && 'text-teal-700')}>
                {formatArs(row.amount)}
              </span>
            </div>
          ))}

          <div className="mt-1.5 grid grid-cols-[1fr_auto] items-baseline gap-3 border-t-hard border-ink pt-3.5">
            <span>
              <strong className="font-semibold">Entró hoy</strong>
              <span className="block text-body-sm text-text-muted">Sin contar el fiado</span>
            </span>
            <span className="editorial-display text-right text-[27px]">{formatArs(total)}</span>
          </div>
        </div>

        {!cerrada ? (
          <button
            type="button"
            onClick={() => setCerrada(true)}
            className="mt-5 h-11 w-full rounded-sm border-hard border-ink bg-ink text-body-md font-medium text-paper shadow-offset-sm transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Cerrar caja
          </button>
        ) : (
          <div className="mt-5 border-t-hard border-ink pt-4" aria-live="polite">
            <p className="flex items-center gap-2.5 editorial-display text-[23px]">
              <span className="grid size-7 shrink-0 place-items-center rounded-full border-hard border-ink bg-teal-500 text-[15px] text-ink" aria-hidden="true">✓</span>
              Caja cerrada
            </p>
            <dl className="mt-3.5">
              {[
                { k: 'Ganancia real del día', v: formatArs(CIERRE_PROFIT) },
                { k: 'Productos vendidos', v: `${CIERRE_UNITS} unidades` },
                { k: 'Resumen enviado por mail', v: 'nestorb@…' },
              ].map((r) => (
                <div key={r.k} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-2.5 last:border-b-0">
                  <dt className="text-[13.5px] text-ink/80">{r.k}</dt>
                  <dd className="text-right font-mono text-[13.5px] font-medium">{r.v}</dd>
                </div>
              ))}
            </dl>
            <p className="editorial-italic mt-4 text-[18px] leading-snug text-teal-700">
              Lo que antes te llevaba una hora con la calculadora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
