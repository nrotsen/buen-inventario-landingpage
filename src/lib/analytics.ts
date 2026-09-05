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

/** Lo llama `main.tsx` en el arranque del cliente. */
export function __setSink(next: Sink): void {
  sink = next;
}

/** Solo para tests. */
export function __resetSink(): void {
  sink = null;
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
