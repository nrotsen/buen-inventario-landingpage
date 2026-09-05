import { describe, it, expect } from 'vitest';
import { PRODUCTS, CIERRE_ROWS, cierreTotal, LEDGER_OPENING_BALANCE, LEDGER_NEW_SALE } from './data';

describe('datos del demo', () => {
  it('todo producto vende por encima de su costo', () => {
    for (const p of PRODUCTS) {
      expect(p.price).toBeGreaterThan(p.cost);
    }
  });

  it('todo producto tiene stock suficiente para el demo', () => {
    for (const p of PRODUCTS) {
      expect(p.stock).toBeGreaterThan(0);
    }
  });

  it('los ids de producto son únicos', () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('el total del cierre excluye el fiado', () => {
    expect(cierreTotal()).toBe(389640);
    const fiado = CIERRE_ROWS.find((r) => r.isCredit);
    expect(fiado?.amount).toBe(12640);
  });

  it('el saldo del cliente tras anotar la venta es coherente', () => {
    expect(LEDGER_OPENING_BALANCE + LEDGER_NEW_SALE.amount).toBe(29970);
  });
});
