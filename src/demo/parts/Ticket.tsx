import { cn } from '@/lib/utils';
import { formatArs } from '@/lib/pricing';
import type { SaleLine } from '../useSale';

interface TicketProps {
  lines: SaleLine[];
  total: number;
  onPay: () => void;
  className?: string;
}

export function Ticket({ lines, total, onPay, className }: TicketProps) {
  const isEmpty = lines.length === 0;

  return (
    <div className={cn('flex flex-col border-t-hard border-ink bg-cream p-3.5 md:border-l-hard md:border-t-0', className)}>
      <p className="editorial-micro border-b border-dashed border-border-subtle pb-2">Venta en curso</p>

      <div className="flex min-h-[110px] flex-1 flex-col gap-1.5 py-2">
        {isEmpty ? (
          <p className="pt-5 text-center text-body-sm italic leading-relaxed text-text-placeholder">
            Todavía no cargaste nada.
            <br />
            Tocá un producto
          </p>
        ) : (
          lines.map((l) => (
            <div key={l.product.id} className="grid grid-cols-[22px_1fr_auto] items-baseline gap-2 text-[12.5px]">
              <span className="font-mono font-bold text-teal-700">{l.qty}×</span>
              <span>{l.product.name}</span>
              <span className="font-mono">{formatArs(l.product.price * l.qty)}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-baseline justify-between border-t-hard border-ink pt-2.5">
        <span className="editorial-micro">Total</span>
        <span className="editorial-display text-[29px]">{formatArs(total)}</span>
      </div>

      <button
        type="button"
        onClick={onPay}
        disabled={isEmpty}
        className={cn(
          'mt-2.5 h-11 w-full rounded-sm border-hard border-ink bg-ink text-body-md font-medium text-paper shadow-offset-sm',
          'transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0',
        )}
      >
        Cobrar
      </button>
    </div>
  );
}
