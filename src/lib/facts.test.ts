import { describe, it, expect } from 'vitest';
import { CATALOG_ITEMS, RUBROS_POBLADOS, formatApprox } from './facts';

describe('facts', () => {
  it('formatea con separador de miles y marca de aproximación', () => {
    expect(formatApprox(29800)).toBe('~29.800');
    expect(formatApprox(1000)).toBe('~1.000');
  });

  it('no agrega separador por debajo del millar', () => {
    expect(formatApprox(6)).toBe('~6');
  });

  // Guard de la restricción de honestidad: estos números describen el
  // PRODUCTO, no su adopción. Si alguien mete acá una cantidad de clientes,
  // el orden de magnitud lo delata.
  it('expone datos del catálogo, no de adopción', () => {
    expect(CATALOG_ITEMS).toBeGreaterThan(1000);
    expect(RUBROS_POBLADOS).toBeGreaterThan(0);
  });
});
