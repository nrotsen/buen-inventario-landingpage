/**
 * Datos del demo interactivo. Almacén ficticio, precios plausibles.
 * Los CÁLCULOS son reales (margen, descuento de stock): lo único
 * simulado son los datos de partida.
 */

export interface DemoProduct {
  id: string;
  name: string;
  /** Precio de venta en ARS. */
  price: number;
  /** Costo en ARS. NUNCA se muestra en la UI — solo alimenta el margen. */
  cost: number;
  /** Stock inicial. El reveal muestra este valor menos lo vendido. */
  stock: number;
}

export const PRODUCTS: DemoProduct[] = [
  { id: 'coca',      name: 'Coca-Cola 1.5L', price: 2400, cost: 1750, stock: 24 },
  { id: 'pan',       name: 'Pan lactal',     price: 1850, cost: 1290, stock: 12 },
  { id: 'leche',     name: 'Leche 1L',       price: 1320, cost:  980, stock: 30 },
  { id: 'yerba',     name: 'Yerba 1kg',      price: 4900, cost: 3620, stock: 18 },
  { id: 'fideos',    name: 'Fideos 500g',    price:  980, cost:  690, stock: 40 },
  { id: 'aceite',    name: 'Aceite 900ml',   price: 3600, cost: 2680, stock: 15 },
  { id: 'arroz',     name: 'Arroz 1kg',      price: 1750, cost: 1240, stock: 22 },
  { id: 'azucar',    name: 'Azúcar 1kg',     price: 1480, cost: 1050, stock: 26 },
  { id: 'galletitas',name: 'Galletitas',     price: 1620, cost: 1150, stock: 33 },
];

export const PAYMENT_METHODS = [
  'Efectivo',
  'Transferencia',
  'Débito',
  'Crédito',
  'Mercado Pago',
  'Fiado',
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Vendedor y hora que muestra el reveal — fijos, para que el relato cierre. */
export const SELLER_NAME = 'Néstor';
export const SALE_TIME = '18:42';

// ---------- Capítulo 02: cuenta corriente ----------

export interface LedgerMove {
  id: string;
  date: string;
  label: string;
  detail: string;
  /** Positivo = se llevó mercadería. Negativo = pagó. */
  amount: number;
}

export const CLIENT_NAME = 'Marcos López';
export const CLIENT_SINCE = '03/2024';
export const CLIENT_MOVE_COUNT = 47;
export const LEDGER_OPENING_BALANCE = 18420;

export const LEDGER_MOVES: LedgerMove[] = [
  { id: 'm1', date: '28/08', label: 'Pago a cuenta', detail: 'Efectivo',                             amount: -10000 },
  { id: 'm2', date: '26/08', label: 'Venta #1841',   detail: 'Yerba 1kg · Aceite 900ml · Fideos ×2', amount:  10460 },
  { id: 'm3', date: '21/08', label: 'Venta #1798',   detail: 'Leche ×6 · Pan lactal ×2',             amount:  11620 },
  { id: 'm4', date: '14/08', label: 'Venta #1732',   detail: 'Coca 1.5L ×3 · Arroz 1kg',             amount:   8950 },
];

/**
 * Venta que el capítulo 02 anota en la cuenta.
 * Coincide con el ticket del PhoneFrame "Vender": Coca ×2 + Pan ×1 + Yerba ×1.
 */
export const LEDGER_NEW_SALE = {
  id: 'm-new',
  date: 'Hoy',
  label: 'Venta #1863',
  detail: 'Registrada recién · 4 productos',
  amount: 11550,
} satisfies LedgerMove;

// ---------- Capítulo 03: cierre de caja ----------

export interface CierreRow {
  method: string;
  amount: number;
  /** El fiado se lista aparte: no entró plata. */
  isCredit?: boolean;
}

export const CIERRE_DATE = 'martes 4 de septiembre';

export const CIERRE_ROWS: CierreRow[] = [
  { method: 'Efectivo',      amount: 148300 },
  { method: 'Transferencia', amount:  96750 },
  { method: 'Débito',        amount:  61200 },
  { method: 'Crédito',       amount:  44980 },
  { method: 'Mercado Pago',  amount:  38410 },
  { method: 'Fiado',         amount:  12640, isCredit: true },
];

export const CIERRE_PROFIT = 104190;
export const CIERRE_UNITS = 213;

/** Suma de lo cobrado. Excluye el fiado: no entró plata. */
export function cierreTotal(rows: CierreRow[] = CIERRE_ROWS): number {
  return rows.filter((r) => !r.isCredit).reduce((acc, r) => acc + r.amount, 0);
}
