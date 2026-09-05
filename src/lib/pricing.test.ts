import { describe, it, expect } from 'vitest';
import { PLAN_PRICE_ARS, TRIAL_DAYS, formatArs } from './pricing';

describe('pricing', () => {
  it('formatea en pesos argentinos sin decimales', () => {
    expect(formatArs(24900)).toBe('$24.900');
    expect(formatArs(1480)).toBe('$1.480');
    expect(formatArs(389640)).toBe('$389.640');
  });

  it('formatea el cero', () => {
    expect(formatArs(0)).toBe('$0');
  });

  // El capítulo 02 del demo (cuenta corriente) muestra pagos a cuenta en
  // negativo. Si alguien "simplifica" formatArs, esto lo tiene que atajar.
  it('formatea negativos con el signo antes del símbolo', () => {
    expect(formatArs(-5000)).toBe('-$5.000');
    expect(formatArs(-10000)).toBe('-$10.000');
  });

  it('redondea decimales al peso', () => {
    expect(formatArs(-1234.56)).toBe('-$1.235');
    expect(formatArs(1234.4)).toBe('$1.234');
  });

  it('expone el precio y el trial como constantes', () => {
    expect(PLAN_PRICE_ARS).toBe(24900);
    expect(TRIAL_DAYS).toBe(30);
  });
});
