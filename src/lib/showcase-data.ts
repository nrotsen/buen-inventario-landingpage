/**
 * Datos de vitrina: el almacén ficticio que muestran **las dos** capas que
 * enseñan el producto — los mocks de pantalla (`components/ui/phone-screens/`)
 * y el demo interactivo (`src/demo/`).
 *
 * Vive en `lib/` y no en `demo/` por dos razones:
 *
 * 1. `components/ui/` es la capa de primitives: no puede depender de
 *    `demo/`, el módulo más volátil del repo. Si depende, `demo/` deja de
 *    ser una hoja borrable y las capas quedan invertidas.
 * 2. Fuente única. El ticket del mock y el ledger del demo son la misma
 *    venta: si cada uno tuviera su copia de los precios, se desincronizan
 *    en silencio y el número de una pantalla contradice al de la otra.
 *
 * **Acá va solo lo que comparten las dos capas.** Lo que usa únicamente el
 * demo (métodos de pago, vendedor, totales del cierre) queda en
 * `src/demo/data.ts` y así viaja en el chunk lazy, no en el bundle inicial.
 *
 * Los precios son plausibles y los CÁLCULOS son reales (margen, descuento
 * de stock, totales): lo único simulado son los datos de partida.
 */

export interface ShowcaseProduct {
  id: string;
  name: string;
  /** Precio de venta en ARS. */
  price: number;
  /** Costo en ARS. NUNCA se muestra en la UI — solo alimenta el margen. */
  cost: number;
  /** Stock inicial. El reveal muestra este valor menos lo vendido. */
  stock: number;
}

export const PRODUCTS = [
  { id: 'coca',      name: 'Coca-Cola 1.5L', price: 2400, cost: 1750, stock: 24 },
  { id: 'pan',       name: 'Pan lactal',     price: 1850, cost: 1290, stock: 12 },
  { id: 'leche',     name: 'Leche 1L',       price: 1320, cost:  980, stock: 30 },
  { id: 'yerba',     name: 'Yerba 1kg',      price: 4900, cost: 3620, stock: 18 },
  { id: 'fideos',    name: 'Fideos 500g',    price:  980, cost:  690, stock: 40 },
  { id: 'aceite',    name: 'Aceite 900ml',   price: 3600, cost: 2680, stock: 15 },
  { id: 'arroz',     name: 'Arroz 1kg',      price: 1750, cost: 1240, stock: 22 },
  { id: 'azucar',    name: 'Azúcar 1kg',     price: 1480, cost: 1050, stock: 26 },
  { id: 'galletitas',name: 'Galletitas',     price: 1620, cost: 1150, stock: 33 },
] as const satisfies readonly ShowcaseProduct[];

/** Los ids que existen de verdad. Referenciar uno que no está no compila. */
export type ProductId = (typeof PRODUCTS)[number]['id'];

const BY_ID = new Map<string, ShowcaseProduct>(PRODUCTS.map((p) => [p.id, p] as const));

/** Lookup tolerante: para ids que vienen de un handler, no del código. */
export function findProduct(id: string): ShowcaseProduct | undefined {
  return BY_ID.get(id);
}

export function productById(id: ProductId): ShowcaseProduct {
  const product = BY_ID.get(id);
  // Inalcanzable: `ProductId` se deriva de PRODUCTS, así que el typecheck ya
  // rechaza cualquier id que no esté en el Map. El throw está para que, si
  // alguien afloja el tipo, el build muera acá en vez de imprimir un total
  // que no suma.
  if (!product) throw new Error(`[showcase-data] producto desconocido: ${id}`);
  return product;
}

// ---------- La venta del demo (ticket + asiento en la cuenta) ----------

export interface SaleTicketLine {
  productId: ProductId;
  qty: number;
  /** Nombre a mostrar en el ticket — puede ser más específico que el del catálogo. */
  displayName: string;
}

/**
 * La venta que el capítulo 01 arma y el capítulo 02 anota en la cuenta de
 * Marcos, y que el mock "Vender" muestra congelada. Es UNA sola venta
 * descrita en un solo lugar: nadie escribe su total ni su cantidad de
 * productos a mano, se derivan de estas líneas más abajo.
 */
export const SALE_TICKET_LINES: SaleTicketLine[] = [
  { productId: 'coca',  qty: 2, displayName: 'Coca-Cola 1.5L' },
  { productId: 'pan',   qty: 1, displayName: 'Pan lactal' },
  { productId: 'yerba', qty: 1, displayName: 'Yerba Playadito 1kg' },
];

/** Lo que suma una línea del ticket. El precio sale del catálogo, siempre. */
export function saleLineAmount(line: SaleTicketLine): number {
  return productById(line.productId).price * line.qty;
}

export const SALE_TICKET_TOTAL = SALE_TICKET_LINES.reduce(
  (acc, line) => acc + saleLineAmount(line),
  0,
);

export const SALE_TICKET_UNITS = SALE_TICKET_LINES.reduce((acc, line) => acc + line.qty, 0);

// ---------- Cuenta corriente ----------

export interface LedgerMove {
  id: string;
  date: string;
  label: string;
  detail: string;
  /** Positivo = se llevó mercadería. Negativo = pagó. */
  amount: number;
}

export const CLIENT_NAME = 'Marcos López';
export const LEDGER_OPENING_BALANCE = 18420;

export const LEDGER_MOVES: LedgerMove[] = [
  { id: 'm1', date: '28/08', label: 'Pago a cuenta', detail: 'Efectivo',                             amount: -10000 },
  { id: 'm2', date: '26/08', label: 'Venta #1841',   detail: 'Yerba 1kg · Aceite 900ml · Fideos ×2', amount:  10460 },
  { id: 'm3', date: '21/08', label: 'Venta #1798',   detail: 'Leche ×6 · Pan lactal ×2',             amount:  11620 },
  { id: 'm4', date: '14/08', label: 'Venta #1732',   detail: 'Coca 1.5L ×3 · Arroz 1kg',             amount:   8950 },
];

/**
 * El asiento de la venta del ticket en la cuenta de Marcos. Monto y cantidad
 * salen de `SALE_TICKET_LINES` — cambiar el precio de la Coca mueve el total
 * de las dos pantallas a la vez, que es la única forma de que no se
 * contradigan.
 */
export const LEDGER_NEW_SALE = {
  id: 'm-new',
  date: 'Hoy',
  label: 'Venta #1863',
  detail: `Registrada recién · ${SALE_TICKET_UNITS} productos`,
  amount: SALE_TICKET_TOTAL,
} satisfies LedgerMove;

// ---------- Cierre de caja ----------

export interface CierreRow {
  method: string;
  amount: number;
  /** El fiado se lista aparte: no entró plata. */
  isCredit?: boolean;
}

export const CIERRE_ROWS: CierreRow[] = [
  { method: 'Efectivo',      amount: 148300 },
  { method: 'Transferencia', amount:  96750 },
  { method: 'Débito',        amount:  61200 },
  { method: 'Crédito',       amount:  44980 },
  { method: 'Mercado Pago',  amount:  38410 },
  { method: 'Fiado',         amount:  12640, isCredit: true },
];

/** Suma de lo cobrado. Excluye el fiado: no entró plata. */
export function cierreTotal(rows: CierreRow[] = CIERRE_ROWS): number {
  return rows.filter((r) => !r.isCredit).reduce((acc, r) => acc + r.amount, 0);
}
