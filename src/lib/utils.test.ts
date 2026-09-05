import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn — anchos de borde custom del design system', () => {
  // Regresión: tailwind-merge clasificaba `border-hard` como color y lo
  // descartaba frente a `border-ink`, dejando los bordes en 0px. Estuvo
  // vivo en producción (Button, BrowserFrame) sin que nadie lo notara.
  it('conserva border-hard junto a border-ink', () => {
    const out = cn('border-hard border-ink');
    expect(out).toContain('border-hard');
    expect(out).toContain('border-ink');
  });

  it('conserva las variantes por lado', () => {
    for (const side of ['border-t-hard', 'border-b-hard', 'border-l-hard', 'border-r-hard', 'border-y-hard', 'border-x-hard']) {
      const out = cn(`${side} border-ink`);
      expect(out, `${side} debería sobrevivir`).toContain(side);
    }
  });

  it('sigue resolviendo conflictos reales de color', () => {
    expect(cn('border-ink border-teal-700')).toBe('border-teal-700');
  });

  it('sigue resolviendo conflictos reales de ancho', () => {
    expect(cn('border-hard border-2')).toBe('border-2');
    expect(cn('border-2 border-hard')).toBe('border-hard');
  });
});
