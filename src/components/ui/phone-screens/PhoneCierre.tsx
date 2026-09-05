import { formatArs } from '@/lib/pricing';
import { CIERRE_ROWS, cierreTotal } from '@/lib/showcase-data';

/** El fiado se lista aparte del cierre: no entró plata. */
const ROWS = CIERRE_ROWS.filter((row) => !row.isCredit);

/**
 * Pantalla "Cierre de caja": lo que entró en el día por método de pago.
 * El total sale de cierreTotal() — nunca se suma a mano, y excluye el
 * fiado por la misma razón que la función lo excluye.
 */
export function PhoneCierre() {
  return (
    <>
      <div className="flex items-center justify-between border-b-hard border-ink bg-cream px-3 py-2.5">
        <span className="editorial-display text-[15px]">Cierre</span>
        <span className="font-mono text-[9px] text-text-muted">MAR 04/09</span>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="rounded-sm border-hard border-ink bg-surface px-2.5 py-2.5">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.09em] text-text-muted">Entró hoy</p>
          <p className="editorial-display text-[23px]">{formatArs(cierreTotal())}</p>
        </div>

        <div className="mt-3">
          {ROWS.map((row) => (
            <div
              key={row.method}
              className="grid grid-cols-[1fr_auto] items-baseline gap-2 border-b border-dashed border-border-subtle py-2 text-[11.5px]"
            >
              <span>{row.method}</span>
              <span className="font-mono font-medium">{formatArs(row.amount)}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto grid h-[38px] place-items-center border-hard border-ink bg-ink text-[12.5px] text-paper shadow-offset-xs">
          Cerrar caja
        </div>
      </div>
    </>
  );
}
