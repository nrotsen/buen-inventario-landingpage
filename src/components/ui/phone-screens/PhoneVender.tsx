import { formatArs } from '@/lib/pricing';
import { PRODUCTS, LEDGER_NEW_SALE } from '@/demo/data';

interface VenderRow {
  productId: string;
  qty: number;
  /** Nombre a mostrar en el ticket — puede ser más específico que el del catálogo. */
  displayName: string;
}

/**
 * El ticket que el capítulo 01 del demo arma: Coca ×2 + Pan ×1 + Yerba ×1.
 * Los productId apuntan a PRODUCTS — el precio de cada línea sale de ahí,
 * nunca se escribe a mano.
 */
const ROWS: VenderRow[] = [
  { productId: 'coca', qty: 2, displayName: 'Coca-Cola 1.5L' },
  { productId: 'pan', qty: 1, displayName: 'Pan lactal' },
  { productId: 'yerba', qty: 1, displayName: 'Yerba Playadito 1kg' },
];

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

/**
 * Pantalla "Vender": el ticket congelado en el momento del cobro. El
 * total sale de LEDGER_NEW_SALE.amount — es exactamente la venta que el
 * capítulo 02 anota en la cuenta corriente, así no hay contradicción
 * para quien compare las dos pantallas.
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
          {ROWS.map((row) => {
            const product = byId.get(row.productId);
            if (!product) return null;
            return (
              <div
                key={row.productId}
                className="grid grid-cols-[1fr_auto] items-baseline gap-2 border-b border-dashed border-border-subtle py-2 text-[11.5px]"
              >
                <span>
                  {row.displayName} ×{row.qty}
                </span>
                <span className="font-mono font-medium">{formatArs(product.price * row.qty)}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 rounded-sm border-hard border-ink bg-surface px-2.5 py-2.5">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.09em] text-text-muted">Total</p>
          <p className="editorial-display text-[23px]">{formatArs(LEDGER_NEW_SALE.amount)}</p>
        </div>

        <div className="mt-auto grid h-[38px] place-items-center border-hard border-ink bg-ink text-[12.5px] text-paper shadow-offset-xs">
          Cobrar
        </div>
      </div>
    </>
  );
}
