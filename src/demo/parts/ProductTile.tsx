import { cn } from '@/lib/utils';
import { formatArs } from '@/lib/pricing';
import type { DemoProduct } from '../data';

interface ProductTileProps {
  product: DemoProduct;
  onAdd: (id: string) => void;
  /** Pulsa hasta el primer tap, para que se entienda que es tocable. */
  nudge?: boolean;
  className?: string;
}

export function ProductTile({ product, onAdd, nudge = false, className }: ProductTileProps) {
  return (
    <button
      type="button"
      onClick={() => onAdd(product.id)}
      aria-label={`Agregar ${product.name}, ${formatArs(product.price)}`}
      className={cn(
        'min-h-[64px] rounded-sm border-hard border-ink bg-surface px-2.5 py-2.5 text-left',
        'transition-transform duration-100 hover:-translate-y-px hover:bg-teal-50 active:translate-y-0 active:scale-[0.98]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        nudge && 'animate-demo-nudge',
        className,
      )}
    >
      <span className="block text-[12.5px] font-medium leading-tight">{product.name}</span>
      <span className="mt-1.5 block font-mono text-[13px]">{formatArs(product.price)}</span>
      <span className="mt-0.5 block font-mono text-[10px] text-text-muted">stock {product.stock}</span>
    </button>
  );
}
