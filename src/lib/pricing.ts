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
 * `24900` → `"$24.900"`. Sin espacio después del signo, como se escribe en Argentina.
 *
 * `Intl.NumberFormat` con `style: 'currency'` en es-AR inserta un separador
 * entre el símbolo `$` y el número que, según la versión de ICU/Node, puede
 * ser un espacio normal (U+0020), un NBSP (U+00A0) o un narrow NBSP (U+202F).
 * Un `.replace(/\s/g, '')` ingenuo es frágil frente a esas variantes en
 * runtimes/ICU distintos. Por eso acá se usa `formatToParts`: se reconstruye
 * el string descartando solo las partes "literal" que son puro espacio en
 * blanco (sin importar qué variante de espacio sea, porque `String.prototype
 * .trim()` las cubre a todas) y conservando el resto de los literales (como
 * el punto separador de miles).
 */
export function formatArs(value: number): string {
  return formatter
    .formatToParts(value)
    .filter((part) => part.type !== 'literal' || part.value.trim() !== '')
    .map((part) => part.value)
    .join('');
}
