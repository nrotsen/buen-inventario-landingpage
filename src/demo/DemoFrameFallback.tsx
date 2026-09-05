/**
 * Placeholder mientras baja el chunk del demo. Reserva la MISMA altura
 * que el widget montado — si cambia la altura del demo, cambiar acá también,
 * o el CLS deja de ser 0.
 *
 * Las alturas están MEDIDAS con Playwright sobre el widget real dentro del
 * layout del Hero, barriendo el viewport de 320px a 800px de a 1px. El demo
 * cambia de alto en siete escalones y cada uno tiene su banda:
 *
 *   ancho    alto    qué cambia
 *   320px    666px   el nombre del producto entra en tres líneas
 *   326px    644px   pasa a dos líneas
 *   364px    630px   la barra de hints entra en dos líneas
 *   395px    616px   el ticket vacío deja de envolver
 *   520px    731px   entran los 9 productos (tres filas en vez de dos)
 *   566px    709px   la barra de hints entra en una línea
 *   768px    529px   el ticket pasa de apilado abajo a columna lateral
 *
 * Un único valor fijo no alcanza: entre el mobile apilado y el desktop hay
 * más de 200px de diferencia, y reservar de más desplaza igual que reservar
 * de menos.
 */
export function DemoFrameFallback() {
  return (
    <div
      className="min-h-[666px] animate-pulse border-hard border-ink bg-cream min-[326px]:min-h-[644px] min-[364px]:min-h-[630px] min-[395px]:min-h-[616px] min-[520px]:min-h-[731px] min-[566px]:min-h-[709px] md:min-h-[529px]"
      aria-hidden="true"
    >
      <div className="h-[37.5px] border-b-hard border-ink bg-paper" />
    </div>
  );
}
