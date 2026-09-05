# Buen Inventario Landing — Standards

Documento canónico de arquitectura, diseño, performance y code rules de la
landing pública. Hasta 2026-09-05 este repo no tenía standards propios —
usaba reglas prestadas de `buen-carrito-frontend` y `buen-inventario-webs`
filtradas a mano en cada plan. Este documento las persiste acá.

**Última actualización:** 2026-09-05

---

## 0. La regla más importante: restricción de honestidad

**No negociable.** A la fecha, Don Néstor Despensa es el único comercio
usando el sistema de forma sostenida, y las emisiones a ARCA en producción
son de prueba. Por lo tanto esta landing **no muestra**:

- Cantidad de clientes ("+N empresas", "+N comercios")
- Logos de comercios
- Testimonios
- Estrellas / ratings
- Métricas de uso agregadas ("N ventas procesadas", "N productos cargados
  por usuarios")

**Cualquier número que aparezca en la landing describe el producto — nunca
su adopción.** `PLAN_PRICE_ARS`, `TRIAL_DAYS`, el conteo del catálogo
precargado: sí. Un contador de clientes, aunque sea real: no, hasta que deje
de ser una muestra de uno.

Antes de mergear cualquier cambio a esta landing, correr:

```bash
grep -rniE "clientes usan|\+[0-9]+ (empresas|comercios|negocios)|testimonio|reseña|★" src/ public/*.html
```

Debe devolver vacío. Si un cambio necesita "prueba social", la respuesta
correcta es más señales de **producto** (el demo interactivo, capturas
reales), **proceso** (qué pasa si algo falla, tiempos de onboarding) o
**fundador** — nunca una cifra de adopción que no es real o que describe una
muestra de uno.

---

## 1. Stack

- **Framework:** React 19.1 + Vite 7.1
- **Lenguaje:** TypeScript ~5.8, `strict: true`
- **Styling:** Tailwind CSS 3.4 (sin plugins)
- **Testing:** Vitest 5 + happy-dom + React Testing Library
- **Icons:** lucide-react (imports nombrados, nunca el barrel completo)
- **Utilidades de clases:** `clsx` + `tailwind-merge` detrás de `cn()`
- **Analytics:** `@vercel/analytics` + `@vercel/speed-insights`, **solo**
  detrás del adapter (ver §9)

**Lo que este repo NO tiene, a propósito:** router (una sola página, nav por
anchor `#id`), backend, base de datos, auth, Zustand, TanStack Query,
Radix UI, ni ningún form library. El demo interactivo (`src/demo/`) es
estado 100% en memoria del navegador — no hace ninguna request de red.

Si un cambio futuro necesita cualquiera de estas piezas, es una decisión de
arquitectura nueva, no una adición incremental — pasa por `bi-brainstorm`.

---

## 2. Estructura de directorios

```
src/
├── main.tsx                        # entry del cliente: hydrateRoot + sink de analytics
├── entry-server.tsx                # árbol que prerenderiza scripts/prerender.ts (sin StrictMode)
├── App.tsx                         # composición de secciones, sin lógica
├── index.css                       # @font-face, tokens base, utilidades .editorial-*
├── components/
│   ├── Header.tsx, Footer.tsx, MobileMenu.tsx    # chrome de la página
│   ├── ui/                         # primitives reusables, sin lógica de negocio
│   │   ├── Button.tsx, Section.tsx, DisplayHeading.tsx, EditorialMicro.tsx, PhoneFrame.tsx
│   │   └── phone-screens/          # mocks de pantallas del producto real (datos de ejemplo)
│   └── sections/                   # una sección de la landing por archivo
│       ├── Hero.tsx, TrustStrip.tsx, Historia.tsx, Sistema.tsx, ComoArrancas.tsx, Precio.tsx, Faq.tsx
│       ├── diagnostico/            # sub-bloque propio de Diagnostico
│       └── sistema/                # sub-bloque propio de Sistema (PhoneRow)
├── demo/                           # el demo interactivo, módulo autocontenido
│   ├── DemoWidget.tsx              # orquestador, cargado con lazy() + Suspense
│   ├── DemoFrameFallback.tsx       # fallback del Suspense, mismas medidas que el widget (CLS 0)
│   ├── useSale.ts                  # hook de estado de la venta (data, no UI)
│   ├── data.ts                     # catálogo y contenido fijo del demo
│   ├── chapters/                   # Vender, Fiar, Cerrar caja
│   └── parts/                      # ProductTile, Ticket, MethodPicker, HintBar, SaleReveal
├── lib/                            # funciones puras, sin React ni JSX
│   ├── analytics.ts                # adapter de analytics — único punto que lo demás importa
│   ├── pricing.ts                  # PLAN_PRICE_ARS, TRIAL_DAYS, formatArs — fuente única del precio
│   ├── config.ts, contact.ts       # URLs de signup, WhatsApp, mail, redes
│   └── utils.ts                    # cn()
└── test/setup.ts                   # setup global de Vitest (jest-dom + cleanup)

scripts/
├── prerender.ts                    # prerenderToNodeStream → inyecta en dist/index.html
├── generate-assets.ts              # orquesta favicon/app icons/OG image
├── lib/
│   ├── build-jsonld.ts             # JSON-LD desde pricing.ts
│   ├── build-og-image.ts           # renderiza scripts/templates/og-image.html con Playwright
│   ├── build-favicon-ico.ts, build-app-icons.ts, optimize-svg.ts, paths.ts
└── templates/og-image.html         # template de la OG image, precio inyectado en build time
```

**Capas y responsabilidades:**

| Capa | Hace | No hace |
|------|------|---------|
| `lib/` | Funciones puras, formateo, constantes | JSX, side effects, `window`/`document` |
| `components/ui/` | Primitives visuales reusables | Lógica de negocio, conocer una sección específica |
| `components/sections/` | Una sección de la landing | Importar de otra sección |
| `demo/` | El sistema real simulado en memoria | Requests de red, dependencias del resto de la landing |
| `scripts/` | Build-time only (Node, corre con `tsx`) | Nada que dependa de `window` — no hay DOM real, solo lo que Playwright monta |

**Regla dura:** ninguna sección importa de otra sección. Si dos secciones
necesitan lo mismo, ese algo va a `components/ui/` o `lib/`.

**Imports:** alias `@/` para todo lo cross-directory (`@/lib/pricing`,
`@/components/ui/Button`). Relativos (`./`) solo dentro del mismo
directorio. Orden: React → librerías externas → internos `@/` →
relativos.

**Naming:** componentes en PascalCase (`PhoneFrame.tsx`); hooks, lib y
scripts en camelCase con prefijo `use` para hooks (`useSale.ts`); types en
PascalCase.

---

## 3. TypeScript

- `strict: true` en `tsconfig.app.json`, sin excepciones por archivo.
- **Prohibido `any` y `as any`.**
- Prohibido `@ts-ignore` / `@ts-expect-error` sin un comentario en la misma
  línea que justifique por qué hace falta.
- Props de componentes con `interface`, no `type`. Siempre exponer
  `className?: string` como escape hatch cuando el componente compone
  clases con `cn()`.
- `verbatimModuleSyntax` está activo: importar tipos con `import type` donde
  el linter/compilador lo pida.

Verificación: `pnpm run typecheck` (`tsc -b --force`).

---

## 4. Tamaños de componente (SRP)

| Tipo | Límite |
|------|--------|
| Component contenedor (sección, orquestador) | ≤ 200 líneas |
| Component hoja (presentacional puro) | ≤ 150 líneas |
| Hook | ≤ 60 líneas — **data O actions O UI state, nunca mezclados** |

Si un archivo excede el límite, se refactoriza extrayendo un sub-bloque
(ver `sections/sistema/PhoneRow.tsx`, extraído de `Sistema.tsx` por esta
regla). El límite no es una sugerencia — no se justifica "por esta vez".

---

## 5. Sistema de diseño editorial

Todo color, tipografía y sombra sale de tokens de `tailwind.config.js` —
**nunca hex literals en un componente.** Si un color no existe como token
todavía, se agrega al config antes de usarse inline.

**Paleta (`tailwind.config.js`):**

| Token | Uso |
|-------|-----|
| `ink` | texto principal, fondos oscuros (`tone="ink"`) |
| `paper` | fondo default de la página |
| `cream` | fondo alterno de sección (`tone="cream"`) |
| `surface` | fondo de cards sobre `paper`/`cream` |
| `teal-50/500/600/700` | acento — CTAs, links, énfasis editorial |
| `text-muted`, `text-placeholder` | texto secundario |
| `border-subtle`, `border-ink` | bordes |

**Tipografía** — tres familias, cada una con un rol fijo, self-hosted vía
`@font-face` en `index.css` (nunca Google Fonts CDN en el cliente):

- `font-display` (DM Serif Display) — títulos. Clase utilitaria
  `.editorial-display`; variante itálica con `.editorial-italic`.
- `font-sans` (Inter) — body copy. Es el `font-family` default de `body`.
- `font-mono` (JetBrains Mono) — micro-copy, precios, labels uppercase.
  Clase `.editorial-micro` (11px, tracking 0.08em, uppercase).
- **Nunca `font-bold` (700)** salvo un caso puntual justificado en comentario
  — el peso editorial del sistema es 400/500, no 700.

**Bordes y sombras:**

- `border-hard` (1.5px, definido en `borderWidth.hard`) en vez de `border`
  default — es el borde "duro" del lenguaje editorial.
- `shadow-offset-{xs,sm,md,lg}` — sombra sólida desplazada en teal, no blur.
- Radios chicos: `rounded-sm` (2px) / `rounded-md` (4px). Nunca redondeos
  grandes — rompe el lenguaje editorial "papel + tinta".

**`Section` (`components/ui/Section.tsx`)** centraliza `tone`
(`paper`/`cream`/`ink`) y `width` (`container`/`reading`/`editorial`) — una
sección nueva usa este primitivo en vez de reimplementar el wrapper.

---

## 6. La trampa de `tailwind-merge` con anchos custom

`tailwind-merge` sin configurar **no reconoce** los anchos de borde custom
del design system (`border-hard`, `border-t-hard`, etc.). Los clasifica
como si fueran parte del grupo de **color** de borde — el mismo grupo que
`border-ink` — y al resolver el "conflicto" entre ambos se queda con el
último, descartando el ancho en silencio. El CSS de `border-hard` existe,
la clase simplemente nunca llega al DOM.

Este bug estuvo vivo en producción desde el rediseño de mayo 2026: `Button`
y `BrowserFrame` perdían su borde duro cada vez que `cn()` combinaba
`border-hard` con un color de borde.

**El fix ya está aplicado** en `src/lib/utils.ts`: `cn()` usa
`extendTailwindMerge` con los grupos `border-w`, `border-w-x`, `border-w-y`,
`border-w-t`, `border-w-r`, `border-w-b`, `border-w-l` extendidos para
incluir `*-hard`. **No revertir esto ni volver a un `twMerge` sin
configurar** — es la única razón por la que `border-hard` y un color de
borde pueden convivir en la misma llamada a `cn()`. Regresión cubierta en
`src/lib/utils.test.ts`.

Si se agrega un nuevo ancho custom al `tailwind.config.js` (`borderWidth`),
extender `classGroups` en `utils.ts` en el mismo cambio — si no,
`tailwind-merge` lo va a tratar como color de nuevo.

---

## 7. Mobile-first y touch targets

Más del 70% del tráfico llega desde Instagram, casi todo mobile.

- Estilos default = mobile. Breakpoints (`md:`, `xl:`, breakpoints custom
  tipo `min-[368px]:`) son aditivos, nunca la base.
- **Touch targets ≥ 44×44px** en todo elemento interactivo — botones,
  tiles del demo, íconos clickeables del header/menú.
- Texto body ≥ 15px (`text-body-md` o mayor).
- Verificación obligatoria con Playwright en viewport iPhone 12 (390×844) y
  en los anchos angostos reales de la base (320/360/375px), con throttling
  Slow 3G donde aplique. Un componente nuevo que toque el layout se mide en
  esos viewports antes de darse por terminado — no alcanza con "se ve bien"
  en desktop.

---

## 8. Performance budget

| Métrica | Budget | Cómo se sostiene |
|---------|--------|-------------------|
| LCP | < 2,0s en 4G simulado | Prerender (SSG) + fuentes self-hosted preloadeadas + demo en `lazy()` |
| CLS | 0 | `DemoFrameFallback` con las medidas exactas del demo montado |
| INP | < 200ms p75 | Sin librerías de estado pesadas, estado del demo en memoria |
| JS del demo | < 25KB gzip | Sin dependencias nuevas; iconos de `lucide-react` importados de a uno |
| Lighthouse mobile | Performance ≥ 90 · Accessibility ≥ 95 | Verificar sobre `pnpm run build && pnpm run preview` |

`lazy()` + `<Suspense>` es la única razón por la que el chunk del demo no
entra al bundle inicial — cualquier import estático de
`@/demo/DemoWidget` desde otro archivo lo devuelve al chunk principal y
rompe el budget.

---

## 9. Analytics — el adapter es la única frontera

`src/lib/analytics.ts` expone `track()` y `configureAnalyticsSink()`.
**Ningún componente ni sección importa `@vercel/analytics` directo** — solo
`src/main.tsx`, que llama `inject()`, `injectSpeedInsights()` y
`configureAnalyticsSink((event, props) => vercelTrack(event, props))` una
sola vez al arrancar el cliente.

```bash
grep -rn "@vercel/analytics" src/   # debe devolver solo src/main.tsx
```

`track()` nunca lanza — un proveedor caído o ausente (incluido el
prerender en Node, sin `window`) no puede romper la página. Eventos
actuales: `demo_started`, `demo_sale_completed`, `demo_chapter_viewed`
(emitidos desde `src/demo/`), `cta_signup_clicked` y `cta_whatsapp_clicked`
(con `section` en las props, emitidos desde cada CTA de signup/WhatsApp de
la landing).

Sin cookies, sin banner de consentimiento — Vercel Analytics es
cookie-less.

Cambiar de proveedor de analytics es cambiar `main.tsx` y nada más.

---

## 10. Pipeline de prerender

El build genera HTML estático real, no un `<div id="root"></div>` vacío:

```
tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && tsx scripts/prerender.ts
```

- `src/entry-server.tsx` exporta el árbol a renderizar (sin `StrictMode` —
  duplicaría el render sin aportar nada en build).
- `scripts/prerender.ts` usa `prerenderToNodeStream` de `react-dom/static`
  (React 19, sin dependencias nuevas) para renderizar ese árbol a string e
  inyectarlo en `dist/index.html`, junto con el JSON-LD de
  `scripts/lib/build-jsonld.ts`.
- El JSON-LD y la OG image comparten fuente de precio con la card de
  Precio: todos leen `PLAN_PRICE_ARS` de `src/lib/pricing.ts`. Un cambio de
  precio se hace en un solo lugar.
- `prerenderToNodeStream` espera los boundaries de `<Suspense>`, así que el
  HTML estático normalmente contiene el demo ya renderizado, no el
  fallback — `DemoFrameFallback` es la red de seguridad si el prerender
  falla, no lo que ve un usuario real.
- **Regla de oro:** cero accesos a `window` / `document` fuera de un
  `useEffect` o un handler de evento — el árbol completo se renderiza en
  Node, donde no existen. Verificar con:
  ```bash
  grep -rn "window\.\|document\." src/ --include="*.tsx" --include="*.ts" | grep -v "useEffect" | grep -v "\.test\."
  ```

Verificación post-build:

```bash
pnpm run build
grep -o "Probalo acá" dist/index.html | wc -l   # ≥ 1 — hay contenido real, no un shell vacío
```

Y en el navegador (`pnpm run preview`): sin warnings de hydration mismatch
en consola.

---

## 11. Pipeline de assets

`pnpm run generate:assets` (`tsx scripts/generate-assets.ts`) orquesta,
en orden: optimizar el SVG fuente del logo, generar `favicon.ico`, generar
los app icons (apple-touch, PWA, maskable), y renderizar la OG image.

**OG image (`scripts/lib/build-og-image.ts` + `scripts/templates/og-image.html`):**

- El template es HTML/CSS servido a Playwright (Chromium headless), no
  React — corre en build time vía `tsx`, no en el bundle de cliente.
- Placeholders reemplazados en build time: `__LOGO_DATA_URI__` (SVG del
  logo embebido) y el copy de precio/prueba, derivados de
  `PLAN_PRICE_ARS` / `TRIAL_DAYS` de `src/lib/pricing.ts` — **nunca
  hardcodeados en el template**, misma razón que el JSON-LD.
- Salida: `public/og-image.png`, **1200×630px, < 200KB**, contenido crítico
  dentro de la safe zone central de 1080×600 (algunos clientes de preview
  recortan los bordes).

Verificación:

```bash
pnpm run generate:assets
ls -la public/og-image.png   # < 200KB
```

**Favicons y app icons no se tocan sin razón explícita** — se resolvieron
el 2026-08-01 y están estables.

---

## 12. Tests

Vitest 5 + happy-dom + React Testing Library. `vitest.config.ts` deriva de
`vite.config.ts` con `mergeConfig` — el alias `@` y los plugins no se
redeclaran.

**`globals: false` a propósito.** Cada test importa `describe`/`it`/`expect`
explícitamente desde `'vitest'`:

```ts
import { describe, it, expect } from 'vitest';
```

Habilitar `globals: true` obligaría a sumar `"vitest/globals"` a los
`types` de `tsconfig.app.json`, que incluye **todo** `src` — un `expect()`
escrito por error dentro de un componente de producción compilaría limpio
y explotaría como `ReferenceError` recién en el browser. No revertir esto.

`src/test/setup.ts` importa `@testing-library/jest-dom/vitest` y corre
`cleanup()` en `afterEach` — no hace falta repetirlo por archivo.

Los tests viven junto al código que prueban (`useSale.ts` /
`useSale.test.ts`, no un directorio `__tests__/` aparte).

Verificación: `pnpm run test` (`vitest run`).

---

## 13. Verificación completa (pre-commit / pre-merge)

```bash
pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run build
```

Además, antes de mergear un cambio visible en producción:

- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95.
- Viewport iPhone 12 y anchos angostos (320–375px): sin scroll horizontal,
  demo usable sin desbordes.
- El demo no hace ninguna request de red — es 100% estado en memoria.
- `grep` de la restricción de honestidad (§0) vacío.
