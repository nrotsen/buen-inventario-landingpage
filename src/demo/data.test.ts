import { describe, it, expect } from 'vitest';
import { PAYMENT_METHODS, CIERRE_PROFIT, CIERRE_UNITS } from './data';

/**
 * Los datos que el demo comparte con los mocks de pantalla se prueban en
 * `src/lib/showcase-data.test.ts`. Acá quedan las invariantes de lo que solo
 * el demo usa.
 */
describe('datos propios del demo', () => {
  it('ofrece "Fiado" como método de pago', () => {
    // ChapterVender ramifica al capítulo 02 con este valor exacto: si se
    // renombra el método, el salto de capítulo deja de dispararse.
    expect(PAYMENT_METHODS).toContain('Fiado');
  });

  it('los métodos de pago no se repiten', () => {
    expect(new Set(PAYMENT_METHODS).size).toBe(PAYMENT_METHODS.length);
  });

  it('el cierre reporta ganancia y unidades positivas', () => {
    expect(CIERRE_PROFIT).toBeGreaterThan(0);
    expect(CIERRE_UNITS).toBeGreaterThan(0);
  });
});
