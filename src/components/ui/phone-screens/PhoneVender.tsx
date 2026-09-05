import { formatArs } from '@/lib/pricing';
import { SALE_TICKET_LINES, SALE_TICKET_TOTAL, saleLineAmount } from '@/lib/showcase-data';

/**
 * Pantalla "Vender": el ticket congelado en el momento del cobro.
 *
 * Las líneas y el total salen de `SALE_TICKET_LINES` — la misma venta que el
 * capítulo 02 del demo anota en la cuenta corriente. El total es la suma
 * derivada de esas líneas, no una constante aparte: es la única forma de que
 * el ticket no muestre renglones que no suman lo que dice abajo.
 */
export function PhoneVender() {
  return (
    <>
      <div className="flex items-center justify-between border-b-hard border-ink bg-cream px-3 py-2.5">
        <span className="editorial-display text-[15px]">Vender</span>
        <span className="font-mono text-[9px] text-text-muted">CAJA ABIERTA</span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div>
          {SALE_TICKET_LINES.map((line) => (
            <div
              key={line.productId}
              className="grid grid-cols-[1fr_auto] items-baseline gap-2 border-b border-dashed border-border-subtle py-2 text-[11.5px]"
            >
              <span>
                {line.displayName} ×{line.qty}
              </span>
              <span className="font-mono font-medium">{formatArs(saleLineAmount(line))}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-sm border-hard border-ink bg-surface px-2.5 py-2.5">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.09em] text-text-muted">Total</p>
          <p className="editorial-display text-[23px]">{formatArs(SALE_TICKET_TOTAL)}</p>
        </div>

        <div className="mt-auto grid h-[38px] place-items-center border-hard border-ink bg-ink text-[12.5px] text-paper shadow-offset-xs">
          Cobrar
        </div>
      </div>
    </>
  );
}
