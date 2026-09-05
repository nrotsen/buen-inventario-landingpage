import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * `tailwind-merge` no conoce los anchos de borde custom del design system.
 * Sin esto, clasifica `border-hard` como un color (igual que `border-ink`),
 * los toma como conflicto y se queda con el último — el ancho de 1.5px
 * desaparece en silencio del DOM.
 *
 * El bug estuvo vivo en producción desde el rediseño de mayo 2026: Button
 * y BrowserFrame perdían su borde duro cada vez que pasaban por `cn()`.
 * El CSS existía, la clase se caía. Ver `utils.test.ts`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w':   ['border-hard'],
      'border-w-x': ['border-x-hard'],
      'border-w-y': ['border-y-hard'],
      'border-w-t': ['border-t-hard'],
      'border-w-r': ['border-r-hard'],
      'border-w-b': ['border-b-hard'],
      'border-w-l': ['border-l-hard'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
