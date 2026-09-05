import { cn } from '@/lib/utils';
import { formatArs } from '@/lib/pricing';
import type { ShowcaseProduct } from '@/lib/showcase-data';

interface ProductTileProps {
  product: ShowcaseProduct;
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
        'min-h-[56px] rounded-sm border-hard border-ink bg-surface px-2 py-2 text-left min-[520px]:min-h-[64px] min-[520px]:px-2.5 min-[520px]:py-2.5',
        'transition-transform duration-100 hover:-translate-y-px hover:bg-teal-50 active:translate-y-0 active:scale-[0.98]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
        nudge && 'animate-demo-nudge',
        className,
      )}
    >
      <span className="block text-[11.5px] font-medium leading-tight min-[520px]:text-[12.5px]">{product.name}</span>
      <span className="mt-1 block font-mono text-[12px] min-[520px]:mt-1.5 min-[520px]:text-[13px]">{formatArs(product.price)}</span>
      <span className="mt-0.5 block font-mono text-[9.5px] text-text-muted min-[520px]:text-[10px]">stock {product.stock}</span>
    </button>
  );
}
