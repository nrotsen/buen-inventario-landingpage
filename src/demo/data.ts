/**
 * Lo que usa SOLO el demo interactivo. El almacén ficticio que el demo
 * comparte con los mocks de `components/ui/phone-screens/` vive en
 * `@/lib/showcase-data` — acá queda únicamente lo que nadie fuera de
 * `src/demo/` importa, así viaja en el chunk lazy y no en el bundle
 * inicial (§8 de STANDARDS).
 *
 * Regla: si un archivo de afuera de `src/demo/` necesita algo de este
 * archivo, no se importa desde acá — se mueve a `@/lib/showcase-data`.
 * `src/demo/` tiene que poder borrarse entero sin romper el resto.
 */

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

export const CLIENT_SINCE = '03/2024';
export const CLIENT_MOVE_COUNT = 47;

// ---------- Capítulo 03: cierre de caja ----------

export const CIERRE_DATE = 'martes 4 de septiembre';
export const CIERRE_PROFIT = 104190;
export const CIERRE_UNITS = 213;
