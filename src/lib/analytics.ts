/**
 * Adapter de analytics. El resto de la app NO conoce el proveedor:
 * importa `track()` y nada más. Cambiar de Vercel Analytics a otro
 * proveedor es cambiar únicamente este archivo.
 */

export type AnalyticsEvent =
  | 'demo_started'
  | 'demo_sale_completed'
  | 'demo_chapter_viewed'
  | 'cta_signup_clicked'
  | 'cta_whatsapp_clicked';

export type AnalyticsProps = Record<string, string | number | boolean>;

type Sink = (event: AnalyticsEvent, props?: AnalyticsProps) => void;

let sink: Sink | null = null;

/**
 * Conecta el proveedor de analytics. Lo llama `main.tsx` al arrancar el
 * cliente; los tests lo usan con un espía, y con `null` para desconectar.
 *
 * Es un único entrypoint a propósito: separar "set" de "reset" obligaba a
 * prefijar ambos con `__` para marcarlos internos, y eso hacía parecer un
 * hack al cableado real de producción.
 */
export function configureAnalyticsSink(next: Sink | null): void {
  sink = next;
}

/**
 * Emite un evento. Nunca lanza: un proveedor caído o ausente no puede
 * romper la landing, y durante el prerender (Node, sin window) no hay sink.
 */
export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!sink) return;
  try {
    sink(event, props);
  } catch {
    // Analytics nunca rompe la página.
  }
}
