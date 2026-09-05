import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { formatArs } from '@/lib/pricing';
import { SELLER_NAME, SALE_TIME, type PaymentMethod } from '../data';
import type { SaleLine } from '../useSale';

interface SaleRevealProps {
  total: number;
  margin: number;
  units: number;
  method: PaymentMethod;
  firstLine: SaleLine;
  onAgain: () => void;
  className?: string;
}

interface RevealRow {
  key: string;
  label: string;
  value: ReactNode;
}

/**
 * El momento de mayor valor de toda la landing: lo que el sistema
 * registró solo. Las filas mapean 1:1 contra los ítems del Diagnóstico.
 */
export function SaleReveal({ total, margin, units, method, firstLine, onAgain, className }: SaleRevealProps) {
  const rows: RevealRow[] = [
    { key: 'margin', label: 'Ganancia real de esta venta', value: <strong className="font-bold text-teal-700">{formatArs(margin)}</strong> },
    {
      key: 'stock',
      label: `Stock de ${firstLine.product.name}`,
      value: (
        <>
          <em className="mr-1.5 not-italic text-text-muted line-through">{firstLine.product.stock}</em>
          {firstLine.stockAfter} unidades
        </>
      ),
    },
    { key: 'method', label: 'Método de cobro', value: method },
    { key: 'seller', label: 'Quién vendió y a qué hora', value: `${SELLER_NAME} · ${SALE_TIME}` },
    { key: 'units', label: 'Unidades que salieron', value: units },
  ];

  return (
    <div className={cn('px-4 py-5', className)} aria-live="polite">
      <p className="flex items-center gap-2.5 editorial-display text-[23px]">
        <span className="grid size-7 shrink-0 place-items-center rounded-full border-hard border-ink bg-teal-500 text-[15px] text-ink" aria-hidden="true">
          ✓
        </span>
        Venta registrada · {formatArs(total)}
      </p>

      <p className="editorial-micro mt-5 border-t-hard border-ink pt-3.5">
        Lo que el sistema anotó solo — sin que hicieras nada
      </p>

      <dl className="mt-3">
        {rows.map((r) => (
          <div key={r.key} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-2.5 last:border-b-0">
            <dt className="text-[13.5px] text-ink/80">{r.label}</dt>
            <dd className="text-right font-mono text-[13.5px] font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>

      <p className="editorial-italic mt-4 text-[18px] leading-snug text-teal-700">
        Eso es lo que tu Excel nunca te dijo. Y vos no hiciste nada: solo vendiste.
      </p>

      <button
        type="button"
        onClick={onAgain}
        className="mt-4 min-h-[44px] font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted underline underline-offset-[3px] transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
      >
        ↺ Hacer otra venta
      </button>
    </div>
  );
}
