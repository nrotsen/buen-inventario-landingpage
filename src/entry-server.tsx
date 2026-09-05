import App from './App';

/**
 * Árbol que se prerenderiza en build time. Sin `StrictMode`: duplica el
 * render y no aporta nada fuera del navegador.
 *
 * Es un módulo aparte de `main.tsx` a propósito: `main.tsx` importa
 * `./index.css` y toca `document`, dos cosas que no existen en Node.
 */
export function AppShell() {
  return <App />;
}
