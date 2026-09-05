/**
 * Datos verificables sobre el producto que la landing afirma en público.
 * Separado de `pricing.ts` porque cambian por razones distintas.
 *
 * REGLA: ningún número de este archivo puede describir ADOPCIÓN
 * (cantidad de clientes, comercios usando el sistema, ventas procesadas).
 * Solo describen el PRODUCTO.
 */

/**
 * Ítems en el catálogo maestro por rubro, en producción.
 * VERIFICAR CONTRA PRODUCCIÓN ANTES DE PUBLICAR.
 * Último conteo conocido: ~29.841 al 2026-08-20.
 */
export const CATALOG_ITEMS = 29800;

/** Rubros con catálogo poblado en producción. Verificar junto con CATALOG_ITEMS. */
export const RUBROS_POBLADOS = 6;

/** `29800` → `"~29.800"`. El tilde comunica que es aproximado y no promete precisión falsa. */
export function formatApprox(value: number): string {
  return `~${new Intl.NumberFormat('es-AR').format(value)}`;
}
