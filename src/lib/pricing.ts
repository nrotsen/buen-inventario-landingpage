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

/*
 * NO hay constantes de competencia acá, a propósito.
 *
 * El spec original planeaba una línea "los sistemas más conocidos arrancan
 * arriba de $47.000". Al verificar xubio.com/ar el 2026-09-05 resultó FALSA:
 * tienen un plan Emprendedor Estándar a $23.100 promocional y hasta tiers
 * gratuitos. El $47.450 es solo su plan Empresa Básico, y encima promocional
 * (lista $123.100), y todos sus precios son + IVA.
 *
 * Una comparación honesta necesitaría aclarar tier, promoción e IVA — más
 * letra chica de la que la sección puede cargar, en una página cuyo argumento
 * central es justamente no tener letra chica. Y afirmar algo sobre "los
 * sistemas más conocidos" en plural exigiría verificar varios: Contabilium
 * estaba caído (HTTP 522) al momento de chequear.
 *
 * Si alguna vez se reintroduce, que sea con el tier equivalente nombrado,
 * la fecha de verificación y el tratamiento de IVA explícito.
 */

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
