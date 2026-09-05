import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HintBarProps {
  children: ReactNode;
  className?: string;
}

/**
 * Barra de guía del demo. Le dice al visitante qué hacer sin obligarlo.
 *
 * Es un bloque con contenido inline, NO un flex: con `flex items-center` el
 * texto en negrita y el resto de la frase se convierten en dos ítems flex
 * separados, y en mobile quedan con baselines distintas — la frase se parte
 * visualmente en dos columnas. Como párrafo normal fluye como una sola frase.
 */
export function HintBar({ children, className }: HintBarProps) {
  return (
    <p
      className={cn(
        'border-b border-border-subtle bg-teal-50 px-4 py-2.5 text-body-sm leading-snug text-teal-700',
        className,
      )}
    >
      {children}
    </p>
  );
}
