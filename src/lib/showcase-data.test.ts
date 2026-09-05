import { describe, it, expect } from 'vitest';
import {
  PRODUCTS, productById,
  SALE_TICKET_LINES, SALE_TICKET_TOTAL, SALE_TICKET_UNITS, saleLineAmount,
  CIERRE_ROWS, cierreTotal,
  LEDGER_NEW_SALE,
} from './showcase-data';

describe('catálogo de vitrina', () => {
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
});

describe('la venta del demo', () => {
  it('todas sus líneas apuntan a un producto del catálogo', () => {
    for (const line of SALE_TICKET_LINES) {
      expect(() => productById(line.productId)).not.toThrow();
      expect(line.qty).toBeGreaterThan(0);
    }
  });

  /**
   * El bug que este test existe para atrapar: que el total del ticket vuelva
   * a ser una constante escrita a mano. Si alguien cambia el precio de la
   * Coca y el total no lo sigue, el mock de "Vender" muestra renglones que
   * no suman lo que dice el total — en la pantalla que está ahí justamente
   * para demostrar que las cuentas cierran.
   *
   * La suma se recalcula acá desde el catálogo en vez de importar
   * SALE_TICKET_TOTAL, para que el test verifique el cableado y no se limite
   * a repetirlo.
   */
  it('el asiento en la cuenta corriente suma exactamente las líneas del ticket', () => {
    const suma = SALE_TICKET_LINES.reduce(
      (acc, line) => acc + productById(line.productId).price * line.qty,
      0,
    );

    expect(SALE_TICKET_TOTAL).toBe(suma);
    expect(LEDGER_NEW_SALE.amount).toBe(suma);
  });

  it('el detalle del asiento cuenta las mismas unidades que el ticket', () => {
    const unidades = SALE_TICKET_LINES.reduce((acc, line) => acc + line.qty, 0);

    expect(SALE_TICKET_UNITS).toBe(unidades);
    expect(LEDGER_NEW_SALE.detail).toContain(`${unidades} productos`);
  });

  it('cada línea cobra el precio del catálogo por su cantidad', () => {
    for (const line of SALE_TICKET_LINES) {
      expect(saleLineAmount(line)).toBe(productById(line.productId).price * line.qty);
    }
  });
});

describe('cierre de caja', () => {
  it('el total del cierre excluye el fiado', () => {
    expect(cierreTotal()).toBe(389640);
    const fiado = CIERRE_ROWS.find((r) => r.isCredit);
    expect(fiado?.amount).toBe(12640);
  });
});
