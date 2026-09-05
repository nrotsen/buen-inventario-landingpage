import { cn } from '@/lib/utils';
import { PAYMENT_METHODS, type PaymentMethod } from '../data';

interface MethodPickerProps {
  onPick: (method: PaymentMethod) => void;
  className?: string;
}

export function MethodPicker({ onPick, className }: MethodPickerProps) {
  return (
    <div className={cn('px-4 py-5', className)}>
      <p className="editorial-display text-[20px]">¿Cómo te paga?</p>
      <p className="mb-4 mt-0.5 text-body-sm text-text-muted">
        Cada método queda registrado por separado. Al cierre del día sabés exactamente cuánto entró por cada uno.
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {PAYMENT_METHODS.map((m) => {
          const isCredit = m === 'Fiado';
          return (
            <button
              key={m}
              type="button"
              onClick={() => onPick(m)}
              className={cn(
                'min-h-[44px] rounded-sm border-hard bg-surface px-2.5 py-3 text-body-sm font-medium transition-colors',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
                isCredit
                  ? 'border-dashed border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-paper'
                  : 'border-ink hover:bg-ink hover:text-paper',
              )}
            >
              {isCredit ? 'Fiado ⟶' : m}
            </button>
          );
        })}
      </div>
    </div>
  );
}
