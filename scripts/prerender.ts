import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { prerenderToNodeStream } from "react-dom/static";
import { createElement } from "react";
import type { ComponentType } from "react";
import { buildJsonLd } from "./lib/build-jsonld.ts";

const DIST_HTML = resolve(import.meta.dirname, "../dist/index.html");
const ROOT_MARKER = '<div id="root"></div>';
const HEAD_MARKER = "</head>";

/**
 * Centinela del demo: un fragmento que solo existe DENTRO del boundary de
 * `<Suspense>` del demo (la barra de capítulos de `DemoWidget`).
 *
 * Tiene que estar adentro del boundary. Si un componente del demo tira, React
 * emite el `DemoFrameFallback` en su lugar y sigue como si nada — el `<h1>`
 * del Hero, que está afuera del boundary, se renderiza igual. Verificar
 * contra el `<h1>` (o contra cualquier cosa de afuera) da verde con un demo
 * que nunca se renderizó.
 *
 * Es un atributo de accesibilidad y no una frase de copy a propósito:
 * `role="tablist"` no se cambia en una pasada de redacción, un título sí.
 */
const DEMO_SENTINEL = 'role="tablist"';

interface EntryServerModule {
  AppShell: ComponentType;
}

/**
 * Carga el bundle SSR que `vite build --ssr` deja en `dist-ssr/`.
 *
 * El specifier se calcula en vez de escribirse literal porque `dist-ssr/`
 * está gitignoreado y lo produce el mismo `pnpm run build` unos segundos
 * antes de que corra este script — pero `tsc -b` corre antes que los dos, y
 * un import estático a un archivo que todavía no existe no chequea nunca.
 * El contrato que este script necesita del bundle es una sola export, así
 * que se declara acá y se verifica en runtime: si `entry-server.tsx` deja de
 * exportar `AppShell`, el build rompe con un mensaje legible en vez de
 * pasarle `undefined` a `createElement`.
 */
async function loadAppShell(): Promise<ComponentType> {
  const bundleUrl = new URL("../dist-ssr/entry-server.js", import.meta.url).href;
  const bundle = (await import(bundleUrl)) as Partial<EntryServerModule>;

  if (typeof bundle.AppShell !== "function") {
    throw new Error(
      "[prerender] dist-ssr/entry-server.js no exporta AppShell. " +
        "Revisar src/entry-server.tsx y el paso `vite build --ssr` del build.",
    );
  }

  return bundle.AppShell;
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function main(): Promise<void> {
  const started = Date.now();

  const AppShell = await loadAppShell();

  // `prerenderToNodeStream` NO rechaza cuando un componente tira: React
  // recupera en el boundary de Suspense más cercano, escribe el fallback y
  // resuelve normal. Sin este `onError` el build salía 0 con un `dist/` que
  // servía el esqueleto en `animate-pulse` en lugar del demo.
  let renderError: unknown = null;
  const { prelude } = await prerenderToNodeStream(createElement(AppShell), {
    onError(error) {
      if (renderError === null) renderError = error;
    },
  });
  const appHtml = await streamToString(prelude);

  // Después de consumir el stream: los errores de un boundary aparecen
  // mientras React sigue renderizando, no antes de devolver el prelude.
  if (renderError !== null) {
    throw new Error(
      "[prerender] React tiró durante el render estático — el HTML quedaría con " +
        "el fallback de Suspense en vez del contenido. Ver el error de abajo.",
      { cause: renderError },
    );
  }

  if (!appHtml.includes(DEMO_SENTINEL)) {
    throw new Error(
      `[prerender] El HTML renderizado no contiene el centinela del demo (${DEMO_SENTINEL}): ` +
        "quedó el fallback de Suspense en vez del demo, o el demo cambió de estructura. " +
        "Si cambió a propósito, actualizar DEMO_SENTINEL y el grep del §10 de STANDARDS.",
    );
  }

  let html = await readFile(DIST_HTML, "utf8");

  if (!html.includes(ROOT_MARKER)) {
    throw new Error(
      `[prerender] No se encontró "${ROOT_MARKER}" en dist/index.html. ` +
        "Si cambió el marcador, actualizar ROOT_MARKER.",
    );
  }

  if (!html.includes(HEAD_MARKER)) {
    throw new Error(
      `[prerender] No se encontró "${HEAD_MARKER}" en dist/index.html: el JSON-LD ` +
        "no tiene dónde entrar.",
    );
  }

  // Los reemplazos van con función y no con string. En un string de reemplazo,
  // las secuencias que empiezan con signo peso son patrones de sustitución
  // (el match, lo que va antes, lo que va después), y el HTML que inyectamos
  // está lleno de signos peso: los precios en pesos del demo y los scripts
  // $RC/$RB que React emite para los boundaries de Suspense. Una función de
  // reemplazo recibe el texto literal, sin interpretar nada.
  html = html.replace(ROOT_MARKER, () => `<div id="root">${appHtml}</div>`);
  html = html.replace(HEAD_MARKER, () => `  ${buildJsonLd()}\n  ${HEAD_MARKER}`);

  await writeFile(DIST_HTML, html, "utf8");

  const kb = (Buffer.byteLength(appHtml, "utf8") / 1024).toFixed(1);
  console.log(
    `[prerender] ${kb} KB de HTML inyectados en ${((Date.now() - started) / 1000).toFixed(2)}s`,
  );
}

main().catch((err) => {
  console.error("[prerender] falló:", err);
  process.exit(1);
});
