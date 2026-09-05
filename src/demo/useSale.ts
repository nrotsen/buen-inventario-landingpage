import { useCallback, useMemo, useState } from 'react';
import { PRODUCTS, type DemoProduct, type PaymentMethod } from './data';

export type SaleView = 'pos' | 'methods' | 'done';

export interface SaleLine {
  product: DemoProduct;
  qty: number;
  /** Stock que queda después de esta venta. Es lo que muestra el reveal. */
  stockAfter: number;
}

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

/**
 * Estado del capítulo 01 del demo. Sin I/O, sin efectos:
 * todo vive en memoria y se pierde al recargar, que es lo correcto
 * para un demo anónimo.
 */
export function useSale() {
  const [view, setView] = useState<SaleView>('pos');
  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [method, setMethod] = useState<PaymentMethod | null>(null);

  const lines = useMemo<SaleLine[]>(
    () =>
      Object.entries(qtyById).map(([id, qty]) => {
        // `add` es el único escritor de `qtyById` y valida contra este mismo
        // Map antes de insertar, así que toda clave presente existe acá.
        const product = byId.get(id)!;
        return { product, qty, stockAfter: product.stock - qty };
      }),
    [qtyById],
  );

  const total = useMemo(() => lines.reduce((a, l) => a + l.product.price * l.qty, 0), [lines]);
  const units = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines]);
  const margin = useMemo(
    () => lines.reduce((a, l) => a + (l.product.price - l.product.cost) * l.qty, 0),
    [lines],
  );

  const add = useCallback((id: string) => {
    if (!byId.has(id)) return;
    setQtyById((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const goToMethods = useCallback(() => {
    if (lines.length === 0) return;
    setView('methods');
  }, [lines.length]);

  const pay = useCallback((m: PaymentMethod) => {
    setMethod(m);
    setView('done');
  }, []);

  const reset = useCallback(() => {
    setQtyById({});
    setMethod(null);
    setView('pos');
  }, []);

  return {
    view, lines, total, units, margin, method,
    isEmpty: lines.length === 0,
    firstLine: lines[0] ?? null,
    add, goToMethods, pay, reset,
  };
}
