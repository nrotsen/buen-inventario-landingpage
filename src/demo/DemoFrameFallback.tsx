/**
 * Placeholder mientras baja el chunk del demo. Reserva la MISMA altura
 * que el widget montado — si cambia la altura del demo, cambiar acá también,
 * o el CLS deja de ser 0.
 *
 * Las alturas están MEDIDAS con el widget real dentro del layout del Hero
 * (columna `minmax(0,1fr)` al lado de una de 420px), una por cada régimen de
 * layout del demo: el ticket apilado abajo hasta `md`, la grilla de productos
 * de 2 a 3 columnas en 520px, y el ticket como columna lateral desde 768px.
 * Un único valor fijo no alcanza: entre el mobile apilado y el desktop hay
 * casi 400px de diferencia.
 */
export function DemoFrameFallback() {
  return (
    <div
      className="min-h-[928px] animate-pulse border-hard border-ink bg-cream min-[414px]:min-h-[904px] min-[520px]:min-h-[728px] sm:min-h-[704px] md:min-h-[531px]"
      aria-hidden="true"
    >
      <div className="h-[37.5px] border-b-hard border-ink bg-paper" />
    </div>
  );
}
