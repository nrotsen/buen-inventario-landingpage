/**
 * Precio público del plan único. FUENTE ÚNICA para toda la landing:
 * card de precio, JSON-LD y OG image lo leen de acá.
 *
 * Este número debe coincidir con el `transaction_amount` del
 * preapproval_plan de Mercado Pago (`MP_PREAPPROVAL_PLAN_ID` en el
 * backend). Cambiarlo acá NO cambia lo que se le cobra a nadie.
 * Al 2026-09-04 MP todavía cobra $14.900 — sincronizar antes de publicar.
 */
export const PLAN_PRICE_ARS = 24900;
export const TRIAL_DAYS = 30;

/**
 * Piso de la competencia, verificado en xubio.com/ar el 2026-09-04
 * (Empresa Básico $47.450/mes con 50% OFF promocional, 14 días de prueba).
 * Se usa en la línea de comparación de la sección Precio.
 * Re-verificar antes de cada publicación: los competidores ajustan seguido.
 */
export const COMPETITOR_FLOOR_ARS = 47000;
export const COMPETITOR_TRIAL_DAYS = 14;

const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * `24900` → `"$24.900"`. Sin espacio entre el signo y el número, como se
 * escribe en Argentina — `Intl` en es-AR produce `"$ 24.900"`.
 *
 * Se filtra por `type === 'literal'` en vez de por clase de caracteres:
 * un `.replace(/\s/g, '')` daría hoy el mismo resultado (verificado: `\s`
 * en JS sí matchea NBSP y narrow NBSP), pero borraría cualquier espacio
 * del string, incluido uno que en otro locale fuera significativo.
 * Filtrar por rol semántico es más preciso que filtrar por caracter.
 *
 * Negativos: `-5000` → `"-$5.000"` (el signo va antes del símbolo).
 */
export function formatArs(value: number): string {
  return formatter
    .formatToParts(value)
    .filter((part) => part.type !== 'literal' || part.value.trim() !== '')
    .map((part) => part.value)
    .join('');
}
