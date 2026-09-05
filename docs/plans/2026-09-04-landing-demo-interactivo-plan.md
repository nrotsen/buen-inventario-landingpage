# Landing v3 — Demo interactivo · Implementation Plan

> **Para agentic workers:** Usar `bi-execute` para implementar este plan task-by-task. Los steps usan checkbox syntax (`- [ ]`) para tracking.

**Goal:** Reescribir la landing pública para que el visitante pueda **usar el sistema en la página sin registrarse**, y publicar el resultado como HTML estático prerenderizado, medible y honesto.

**Architecture:** SPA React 19 + Vite 7 + Tailwind 3 que pasa a prerenderizarse en build time con `prerenderToNodeStream` de `react-dom/static`. El demo interactivo vive en un módulo `src/demo/` autocontenido, cargado con `lazy()` + `Suspense` para no bloquear el LCP. Sin backend, sin base de datos, sin auth: todo el estado del demo es memoria del navegador.

**Tech Stack:** React 19.1 · Vite 7.1 · TypeScript 5.8 strict · Tailwind 3.4 · lucide-react · Vitest + happy-dom + RTL (nuevo) · Playwright (ya presente, para assets) · @vercel/analytics + @vercel/speed-insights (nuevo)

**Spec:** `docs/plans/2026-09-04-landing-demo-interactivo-design.md`
**Mockup canónico:** `~/Desktop/Buen Inventario/mockups/2026-09-04-landing-demo-interactivo.html`

---

## Standards aplicables

> ⚠️ Este repo **no tiene** `docs/reference/STANDARDS.md`. Las reglas de abajo se extraen de `buen-carrito-frontend` (arquitectura React/TS) y `buen-inventario-webs` (público, mobile-first, SEO), filtradas a lo que aplica a este stack. La **Task 25** las persiste como el STANDARDS propio del repo.

**Arquitectura y capas**
- `lib/` = funciones puras, sin React. `components/ui/` = primitives reusables sin lógica de negocio. `components/sections/` = una sección de la landing cada uno.
- **Ninguna sección importa de otra sección.** Si dos secciones comparten algo, va a `components/ui/` o `lib/`.
- Imports cross-directory con alias `@/`. Relativos solo dentro del mismo directorio.

**Tamaños (SRP)**
- Component contenedor ≤ 200 líneas · Component hoja ≤ 150 líneas · Hook ≤ 60 líneas (data O actions O UI state, nunca mezclados).
- Si excede → refactor, no excepción.

**TypeScript**
- `strict: true`. **Prohibido `any` y `as any`.** Prohibido `@ts-ignore` / `@ts-expect-error` sin comentario que justifique.
- Props tipadas con `interface`, no `type`. Siempre `className?: string` como escape hatch.

**Naming**
- Components PascalCase (`PhoneFrame.tsx`) · hooks/lib/services camelCase (`useSale.ts`, `pricing.ts`) · hooks con prefijo `use` · types PascalCase.

**Orden de imports:** React → libs externas → internos `@/` → relativos del mismo dir.

**Design language (editorial, ya vivo en este repo)**
- **Nunca hex literals.** Todo color por token de `tailwind.config.js`: `ink` `paper` `cream` `surface` `teal-50/500/600/700` `text-muted` `border-subtle`.
- Borders duros `border-hard` (1.5px) + `shadow-offset-*`. Radios chicos (`rounded-sm` 2px / `rounded-md` 4px), nunca redondeos grandes.
- Tipografía: `font-display` (DM Serif) para títulos · `font-sans` (Inter) para body · `font-mono` (JetBrains) para micro/números. Utilidades `.editorial-display`, `.editorial-italic`, `.editorial-micro` ya definidas en `index.css`.
- **Nunca `font-bold` (700)** salvo edge case justificado.

**Mobile-first (>70% del tráfico llega de Instagram)**
- Estilos default = mobile, breakpoints aditivos.
- **Touch targets ≥ 44×44px.** Texto body ≥ 15px.
- Verificación obligatoria en viewport iPhone 12 con throttling Slow 3G.

**Performance**
- LCP < 2,0s en 4G simulado · CLS = 0 · INP < 200ms p75.
- Iconos de `lucide-react` **importados de a uno** (`import { Eye } from 'lucide-react'`), nunca el barrel completo.
- El bundle del demo ≤ 25KB gzip y **no** en el chunk inicial.

**SEO**
- H1 único, jerarquía h2/h3 correcta, HTML semántico (`main`/`section`/`article`).
- Toda imagen con `alt`. JSON-LD válido.

## Operational Rules (REQUIRED)

- **Multi-tenant: N/A.** Esta app no tiene company, ni auth, ni datos de usuario. No hay barrera de tenant que preservar. Ninguna task de este plan toca data layer.
- **NUNCA commitear `.env` ni `.env.*`.**
- **El demo no hace requests de red.** Ni fetch, ni XHR, ni WebSocket, ni localStorage. Si una task introduce I/O dentro de `src/demo/`, está mal planteada.
- **Cero datos personales.** Los nombres del demo (Marcos López) son ficticios y deben seguir siéndolo.
- Después de cada task: `pnpm run lint` y `pnpm run build` deben pasar.

---

## Decisiones de implementación tomadas en el challenge gate

| # | Hallazgo | Resolución |
|---|---|---|
| 1 | `vite-react-ssg` declara `vite ^6.4.0 \|\| ^7.3.0 \|\| ^8.0.0` (repo en `^7.1.2`) y exige `react-router-dom ^6.14.1` para una landing sin rutas | Descartado. Se usa `prerenderToNodeStream` de `react-dom/static` (React 19 nativo). Cero deps nuevas |
| 2 | El spec decía que `ExcelComparison` se renderiza dentro de `Diagnostico` — sección importando sección | Se reestructura como módulo `sections/diagnostico/` con `Diagnostico.tsx` + `ExcelTable.tsx`. Composición interna |
| 3 | El repo no tiene ninguna dependencia de testing y el demo introduce cálculo de margen, descuento de stock y máquina de estados | Task 1 monta Vitest + happy-dom + RTL. `useSale` se escribe **TDD-first** |
| 4 | `App.tsx:29` observa `section.reveal-on-scroll`, clase que **no existe en ningún archivo del repo**. El observer y el CSS `.reveal` son código muerto desde el launch | Se borran. Con prerender, `opacity: 0` por default dejaría la página en blanco si el JS falla — exactamente lo que el prerender viene a evitar |
| 5 | `PhotoFrame.tsx` no se importa en ningún lado | Se borra |
| 6 | El repo no tiene `STANDARDS.md` — único de los cinco | Task 25 lo escribe |

---

## File structure

### Crear

```
src/lib/analytics.ts                          # adapter track() — el resto no conoce el proveedor
src/lib/analytics.test.ts
src/lib/pricing.ts                            # PLAN_PRICE_ARS, TRIAL_DAYS, formatArs — fuente única
src/lib/pricing.test.ts
src/lib/facts.ts                              # CATALOG_ITEMS, RUBRO_COUNT — datos verificables

src/demo/DemoWidget.tsx                       # shell: tabs + a11y + aria-live
src/demo/DemoFrameFallback.tsx                # fallback de Suspense, medidas idénticas (CLS = 0)
src/demo/data.ts                              # PRODUCTS, LEDGER, CIERRE, formatArs re-export
src/demo/data.test.ts
src/demo/useSale.ts                           # carrito, totales, margen, máquina de estados
src/demo/useSale.test.ts                      # TDD-first
src/demo/chapters/ChapterVender.tsx
src/demo/chapters/ChapterFiar.tsx
src/demo/chapters/ChapterCerrar.tsx
src/demo/parts/ProductTile.tsx
src/demo/parts/Ticket.tsx
src/demo/parts/MethodPicker.tsx
src/demo/parts/SaleReveal.tsx
src/demo/parts/HintBar.tsx
src/demo/DemoWidget.test.tsx                  # integración RTL

src/components/ui/PhoneFrame.tsx              # acepta children (extensible a screenshots reales)
src/components/ui/phone-screens/PhoneVender.tsx
src/components/ui/phone-screens/PhoneFiado.tsx
src/components/ui/phone-screens/PhoneCierre.tsx

src/components/sections/TrustStrip.tsx        # NUEVA
src/components/sections/ComoArrancas.tsx      # NUEVA
src/components/sections/diagnostico/Diagnostico.tsx
src/components/sections/diagnostico/ExcelTable.tsx

src/entry-server.tsx                          # entry SSR
scripts/prerender.ts                          # prerenderToNodeStream → dist/index.html
scripts/lib/build-jsonld.ts                   # JSON-LD desde pricing.ts

vitest.config.ts
src/test/setup.ts
docs/reference/STANDARDS.md
```

### Reescribir (no parchear)

```
src/components/sections/Hero.tsx              # copy nuevo + demo lazy
src/components/sections/Sistema.tsx           # 6 capacidades + PhoneFrames
src/components/sections/Precio.tsx            # precio visible desde pricing.ts
src/components/sections/Faq.tsx               # +1 pregunta, fix multisucursal
src/App.tsx                                   # nuevo orden + borrar observer muerto
src/main.tsx                                  # createRoot → hydrateRoot
```

### Modificar puntualmente

```
src/components/sections/Historia.tsx          # quitar bloque final "También lo usan"
src/components/Header.tsx                     # nav nuevo
src/index.css                                 # borrar .reveal (código muerto)
index.html                                    # quitar JSON-LD hardcodeado (lo inyecta el prerender)
package.json                                  # scripts + devDeps
public/terminos.html · public/privacidad.html # contenido legal real
public/sitemap.xml                            # sumar legales con lastmod
```

### Borrar

```
src/components/sections/ExcelComparison.tsx   # → sections/diagnostico/ExcelTable.tsx
src/components/ui/PhotoFrame.tsx              # sin uso
```

---

## Orden de ejecución

| Fase | Tasks | Por qué en este orden |
|---|---|---|
| **0 — Fundaciones** | 1-4 | Testing y adapters antes que cualquier feature code. Regla BI: adapters primero |
| **1 — Demo** | 5-11 | El corazón. Lógica pura y testeada antes que UI |
| **2 — Secciones** | 12-20 | UI que consume lo anterior |
| **3 — Build y publicación** | 21-25 | Prerender, legales, assets, verificaciones bloqueantes |

---

# FASE 0 — Fundaciones

### Task 1: Infraestructura de testing

El repo no tiene ninguna dependencia de testing. Sin esto, el cálculo de margen del demo se publica sin verificar.

**Files:**
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (devDependencies + scripts)
- Modify: `tsconfig.app.json` (types de vitest)

**Constraints:**
- TypeScript strict. Sin `any`.
- `happy-dom` (no jsdom): más rápido y es lo que usa `buen-carrito-frontend`.

**Multi-tenant impact:** N/A — no toca data.

- [ ] **Step 1: Instalar dependencias de testing**
  ```bash
  pnpm add -D vitest happy-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event
  ```

- [ ] **Step 2: Crear `vitest.config.ts`**
  ```ts
  import { defineConfig } from 'vitest/config';
  import react from '@vitejs/plugin-react';
  import { fileURLToPath } from 'node:url';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  });
  ```

- [ ] **Step 3: Crear `src/test/setup.ts`**
  ```ts
  import '@testing-library/jest-dom/vitest';
  import { cleanup } from '@testing-library/react';
  import { afterEach } from 'vitest';

  afterEach(() => {
    cleanup();
  });
  ```

- [ ] **Step 4: Agregar scripts a `package.json`**
  ```json
  "test": "vitest run",
  "test:watch": "vitest",
  "typecheck": "tsc -b --force"
  ```
  Nota: `typecheck` se agrega porque el repo hoy solo typechequea dentro de `build`. Tenerlo separado permite verificar sin buildear.

- [ ] **Step 5: Agregar `"vitest/globals"` a `types` en `tsconfig.app.json`**
  ```jsonc
  {
    "compilerOptions": {
      // ...lo existente...
      "types": ["vitest/globals"]
    }
  }
  ```

- [ ] **Step 6: Verificar que corre en vacío**
  ```bash
  pnpm run test
  ```
  Debe terminar sin error (0 tests todavía es un resultado válido).

- [ ] **Commit:** `git commit -m "test(landing): montar Vitest + happy-dom + RTL"`

---

### Task 2: Adapter de analytics

Regla BI: adapters primero. Ningún componente puede importar el proveedor de analytics directo.

**Files:**
- Create: `src/lib/analytics.ts`
- Create: `src/lib/analytics.test.ts`

**Constraints:**
- `lib/` = funciones puras sin React.
- Sin `any`. Los nombres de evento son una union type cerrada, no `string`.
- Debe funcionar durante el prerender (Node, sin `window`) sin explotar.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Escribir el test primero — `src/lib/analytics.test.ts`**
  ```ts
  import { describe, it, expect, vi, beforeEach } from 'vitest';
  import { track, configureAnalyticsSink } from './analytics';

  describe('analytics', () => {
    beforeEach(() => configureAnalyticsSink(null));

    it('envía el evento al sink con sus props', () => {
      const sink = vi.fn();
      configureAnalyticsSink(sink);
      track('demo_started', { chapter: 'vender' });
      expect(sink).toHaveBeenCalledWith('demo_started', { chapter: 'vender' });
    });

    it('no explota si no hay sink configurado', () => {
      expect(() => track('cta_signup_clicked', { section: 'hero' })).not.toThrow();
    });

    it('nunca propaga un error del sink', () => {
      configureAnalyticsSink(() => { throw new Error('proveedor caído'); });
      expect(() => track('demo_started')).not.toThrow();
    });
  });
  ```

- [ ] **Step 2: Implementar `src/lib/analytics.ts`**
  ```ts
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
   * Conecta el proveedor. Lo llama `main.tsx` al arrancar el cliente; los
   * tests lo usan con un espía, y con `null` para desconectar.
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
  ```

- [ ] **Step 3: Remover `passWithNoTests: true` de `vitest.config.ts`**

  La Task 1 lo agregó porque Vitest 5 sale con exit 1 cuando no encuentra tests, y el repo no tenía ninguno. **Este es el primer test real, así que el flag ya no hace falta — y dejarlo es peligroso:** si mañana alguien rompe el glob de `include` o mueve los tests de directorio, `pnpm run test` termina en verde con cero tests corridos. Es la misma familia de bug que el `npx tsc --noEmit` que el STANDARDS de `buen-carrito-frontend` documenta como no-op silencioso.

  Borrar la línea `passWithNoTests: true,` y su comentario del bloque `test`.

- [ ] **Step 4: Verificar**
  ```bash
  pnpm run test
  ```
  Los 3 tests pasan — y ahora pasan **porque existen**, no porque un flag lo permita. Confirmar además que un glob roto falla: cambiar temporalmente `include` a `src/**/*.noexiste.ts`, correr `pnpm run test`, verificar que sale con exit 1, y revertir.

- [ ] **Commit:** `git commit -m "feat(landing): adapter de analytics con sink inyectable"`

---

### Task 3: Fuente única del precio y de los datos verificables

**Files:**
- Create: `src/lib/pricing.ts`
- Create: `src/lib/pricing.test.ts`
- Create: `src/lib/facts.ts`

**Constraints:**
- `lib/` puro, sin React.
- `PLAN_PRICE_ARS` es **la única** aparición del número en todo el repo. Card de precio, JSON-LD y OG image lo consumen de acá.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Test primero — `src/lib/pricing.test.ts`**
  ```ts
  import { describe, it, expect } from 'vitest';
  import { PLAN_PRICE_ARS, TRIAL_DAYS, formatArs } from './pricing';

  describe('pricing', () => {
    it('formatea en pesos argentinos sin decimales', () => {
      expect(formatArs(24900)).toBe('$24.900');
      expect(formatArs(1480)).toBe('$1.480');
      expect(formatArs(389640)).toBe('$389.640');
    });

    it('formatea el cero', () => {
      expect(formatArs(0)).toBe('$0');
    });

    it('expone el precio y el trial como constantes', () => {
      expect(PLAN_PRICE_ARS).toBe(24900);
      expect(TRIAL_DAYS).toBe(30);
    });
  });
  ```

- [ ] **Step 2: Implementar `src/lib/pricing.ts`**
  ```ts
  /**
   * Precio público del plan único. FUENTE ÚNICA para toda la landing:
   * card de precio, JSON-LD y OG image lo leen de acá.
   *
   * ⚠️ Este número debe coincidir con el `transaction_amount` del
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

  /** `24900` → `"$24.900"`. Sin espacio después del signo, como se escribe en Argentina. */
  export function formatArs(value: number): string {
    return formatter.format(value).replace(/\s/g, '');
  }
  ```

- [ ] **Step 3: Implementar `src/lib/facts.ts`**
  ```ts
  /**
   * Datos verificables sobre el producto que la landing afirma en público.
   * Separado de `pricing.ts` porque cambian por razones distintas.
   *
   * ⚠️ REGLA: ningún número de este archivo puede describir ADOPCIÓN
   * (cantidad de clientes, comercios usando el sistema, ventas procesadas).
   * Solo describen el PRODUCTO. Ver la restricción de honestidad del spec.
   */

  /**
   * Ítems en el catálogo maestro por rubro, en producción.
   * ⚠️ VERIFICAR CONTRA PRODUCCIÓN ANTES DE PUBLICAR — ver Task 24.
   * Último conteo conocido: ~29.841 al 2026-08-20.
   */
  export const CATALOG_ITEMS = 29800;

  /** Rubros con catálogo poblado en producción. Verificar junto con CATALOG_ITEMS. */
  export const RUBROS_POBLADOS = 6;

  /** `29800` → `"~29.800"`. El tilde comunica que es aproximado y no promete precisión falsa. */
  export function formatApprox(value: number): string {
    return `~${new Intl.NumberFormat('es-AR').format(value)}`;
  }
  ```

- [ ] **Step 4: Verificar**
  ```bash
  pnpm vitest run src/lib/pricing.test.ts
  ```

- [ ] **Commit:** `git commit -m "feat(landing): fuente única de precio y datos verificables"`

---

### Task 4: Borrar código muerto

`App.tsx:29` observa `section.reveal-on-scroll`, clase que no existe en ningún archivo del repo. El observer y el CSS `.reveal` nunca hicieron nada. Con prerender, dejar `opacity: 0` por default sería peor que inútil: si el JS falla, el visitante ve una página en blanco — la falla exacta que el prerender viene a evitar.

**Files:**
- Modify: `src/App.tsx` (borrar el `useEffect` completo del observer)
- Modify: `src/index.css` (borrar `.reveal` y `.reveal.in-view`)
- Delete: `src/components/ui/PhotoFrame.tsx`

**Constraints:**
- No dejar imports huérfanos (`useEffect` deja de usarse en `App.tsx`).
- **No borrar** la regla `@media (prefers-reduced-motion: reduce)` completa — solo la línea `.reveal { ... }` de adentro. El resto sigue protegiendo las animaciones del demo.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Confirmar que la clase efectivamente no existe**
  ```bash
  grep -rn "reveal-on-scroll" src/ index.html
  ```
  Debe devolver **únicamente** la línea de `App.tsx`. Si aparece en otro lado, parar y reevaluar.

- [ ] **Step 2: Confirmar que `PhotoFrame` no se usa**
  ```bash
  grep -rn "PhotoFrame" src/ --include="*.tsx" | grep -v "ui/PhotoFrame.tsx"
  ```
  Debe devolver vacío.

- [ ] **Step 3: Borrar el observer de `App.tsx`** — sacar el `useEffect` entero y el import de `useEffect`. El componente queda como una función que solo devuelve JSX.

- [ ] **Step 4: Borrar de `src/index.css`** el bloque `.reveal` / `.reveal.in-view` dentro de `@layer utilities`, y la línea `.reveal { opacity: 1; transform: none; }` dentro del bloque `prefers-reduced-motion`.

- [ ] **Step 5: Borrar el archivo**
  ```bash
  rm src/components/ui/PhotoFrame.tsx
  ```

- [ ] **Step 6: Verificar**
  ```bash
  pnpm run typecheck && pnpm run lint && pnpm run build
  ```

- [ ] **Commit:** `git commit -m "chore(landing): borrar scroll-reveal muerto y PhotoFrame sin uso"`

---

# FASE 1 — El demo

### Task 5: Datos del demo

**Files:**
- Create: `src/demo/data.ts`
- Create: `src/demo/data.test.ts`

**Constraints:**
- Módulo puro, sin React, sin I/O.
- Los costos **nunca se muestran en la UI** — solo alimentan el cálculo de margen. Esa es la gracia del reveal: el sistema sabe algo que la pantalla no exhibe.
- Nombres de persona ficticios. Cero datos reales.

**Multi-tenant impact:** N/A — datos estáticos en el bundle, sin backend.

- [ ] **Step 1: Crear `src/demo/data.ts`**
  ```ts
  /**
   * Datos del demo interactivo. Almacén ficticio, precios plausibles.
   * Los CÁLCULOS son reales (margen, descuento de stock): lo único
   * simulado son los datos de partida.
   */

  export interface DemoProduct {
    id: string;
    name: string;
    /** Precio de venta en ARS. */
    price: number;
    /** Costo en ARS. NUNCA se muestra en la UI — solo alimenta el margen. */
    cost: number;
    /** Stock inicial. El reveal muestra este valor menos lo vendido. */
    stock: number;
  }

  export const PRODUCTS: DemoProduct[] = [
    { id: 'coca',      name: 'Coca-Cola 1.5L', price: 2400, cost: 1750, stock: 24 },
    { id: 'pan',       name: 'Pan lactal',     price: 1850, cost: 1290, stock: 12 },
    { id: 'leche',     name: 'Leche 1L',       price: 1320, cost:  980, stock: 30 },
    { id: 'yerba',     name: 'Yerba 1kg',      price: 4900, cost: 3620, stock: 18 },
    { id: 'fideos',    name: 'Fideos 500g',    price:  980, cost:  690, stock: 40 },
    { id: 'aceite',    name: 'Aceite 900ml',   price: 3600, cost: 2680, stock: 15 },
    { id: 'arroz',     name: 'Arroz 1kg',      price: 1750, cost: 1240, stock: 22 },
    { id: 'azucar',    name: 'Azúcar 1kg',     price: 1480, cost: 1050, stock: 26 },
    { id: 'galletitas',name: 'Galletitas',     price: 1620, cost: 1150, stock: 33 },
  ];

  export const PAYMENT_METHODS = [
    'Efectivo',
    'Transferencia',
    'Débito',
    'Crédito',
    'Mercado Pago',
    'Fiado',
  ] as const;

  export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

  /** Vendedor y hora que muestra el reveal — fijos, para que el relato cierre. */
  export const SELLER_NAME = 'Néstor';
  export const SALE_TIME = '18:42';

  // ---------- Capítulo 02: cuenta corriente ----------

  export interface LedgerMove {
    id: string;
    date: string;
    label: string;
    detail: string;
    /** Positivo = se llevó mercadería. Negativo = pagó. */
    amount: number;
  }

  export const CLIENT_NAME = 'Marcos López';
  export const CLIENT_SINCE = '03/2024';
  export const CLIENT_MOVE_COUNT = 47;
  export const LEDGER_OPENING_BALANCE = 18420;

  export const LEDGER_MOVES: LedgerMove[] = [
    { id: 'm1', date: '28/08', label: 'Pago a cuenta', detail: 'Efectivo',                             amount: -10000 },
    { id: 'm2', date: '26/08', label: 'Venta #1841',   detail: 'Yerba 1kg · Aceite 900ml · Fideos ×2', amount:  10460 },
    { id: 'm3', date: '21/08', label: 'Venta #1798',   detail: 'Leche ×6 · Pan lactal ×2',             amount:  11620 },
    { id: 'm4', date: '14/08', label: 'Venta #1732',   detail: 'Coca 1.5L ×3 · Arroz 1kg',             amount:   8950 },
  ];

  /**
   * Venta que el capítulo 02 anota en la cuenta.
   * Coincide con el ticket del PhoneFrame "Vender": Coca ×2 + Pan ×1 + Yerba ×1.
   */
  export const LEDGER_NEW_SALE = {
    id: 'm-new',
    date: 'Hoy',
    label: 'Venta #1863',
    detail: 'Registrada recién · 4 productos',
    amount: 11550,
  } satisfies LedgerMove;

  // ---------- Capítulo 03: cierre de caja ----------

  export interface CierreRow {
    method: string;
    amount: number;
    /** El fiado se lista aparte: no entró plata. */
    isCredit?: boolean;
  }

  export const CIERRE_DATE = 'martes 4 de septiembre';

  export const CIERRE_ROWS: CierreRow[] = [
    { method: 'Efectivo',      amount: 148300 },
    { method: 'Transferencia', amount:  96750 },
    { method: 'Débito',        amount:  61200 },
    { method: 'Crédito',       amount:  44980 },
    { method: 'Mercado Pago',  amount:  38410 },
    { method: 'Fiado',         amount:  12640, isCredit: true },
  ];

  export const CIERRE_PROFIT = 104190;
  export const CIERRE_UNITS = 213;

  /** Suma de lo cobrado. Excluye el fiado: no entró plata. */
  export function cierreTotal(rows: CierreRow[] = CIERRE_ROWS): number {
    return rows.filter((r) => !r.isCredit).reduce((acc, r) => acc + r.amount, 0);
  }
  ```

- [ ] **Step 2: Crear `src/demo/data.test.ts`**
  ```ts
  import { describe, it, expect } from 'vitest';
  import { PRODUCTS, CIERRE_ROWS, cierreTotal, LEDGER_OPENING_BALANCE, LEDGER_NEW_SALE } from './data';

  describe('datos del demo', () => {
    it('todo producto vende por encima de su costo', () => {
      for (const p of PRODUCTS) {
        expect(p.price).toBeGreaterThan(p.cost);
      }
    });

    it('todo producto tiene stock suficiente para el demo', () => {
      for (const p of PRODUCTS) {
        expect(p.stock).toBeGreaterThan(0);
      }
    });

    it('los ids de producto son únicos', () => {
      const ids = PRODUCTS.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('el total del cierre excluye el fiado', () => {
      expect(cierreTotal()).toBe(389640);
      const fiado = CIERRE_ROWS.find((r) => r.isCredit);
      expect(fiado?.amount).toBe(12640);
    });

    it('el saldo del cliente tras anotar la venta es coherente', () => {
      expect(LEDGER_OPENING_BALANCE + LEDGER_NEW_SALE.amount).toBe(29970);
    });
  });
  ```

- [ ] **Step 3: Verificar**
  ```bash
  pnpm vitest run src/demo/data.test.ts
  ```
  Los 5 tests pasan. El de "vende por encima del costo" protege contra un margen negativo publicado por error.

- [ ] **Commit:** `git commit -m "feat(landing/demo): datos del demo con invariantes testeadas"`

---

### Task 6: Hook `useSale` — TDD-first

Toda la lógica del capítulo 01. **Se escribe el test antes que la implementación.**

**Files:**
- Create: `src/demo/useSale.test.ts`
- Create: `src/demo/useSale.ts`

**Constraints:**
- Hook ≤ 60 líneas (SRP). Solo estado de la venta — nada de UI, nada de analytics dentro del hook.
- Sin `any`.
- **Sin I/O.** Ni fetch, ni localStorage, ni timers.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Escribir `src/demo/useSale.test.ts` PRIMERO**
  ```ts
  import { describe, it, expect } from 'vitest';
  import { renderHook, act } from '@testing-library/react';
  import { useSale } from './useSale';
  import { PRODUCTS } from './data';

  const coca = PRODUCTS.find((p) => p.id === 'coca')!;   // 2400 / 1750 / stock 24
  const pan  = PRODUCTS.find((p) => p.id === 'pan')!;    // 1850 / 1290 / stock 12

  describe('useSale', () => {
    it('arranca vacío, en la vista del punto de venta', () => {
      const { result } = renderHook(() => useSale());
      expect(result.current.view).toBe('pos');
      expect(result.current.lines).toHaveLength(0);
      expect(result.current.total).toBe(0);
      expect(result.current.isEmpty).toBe(true);
    });

    it('suma un producto y calcula el total', () => {
      const { result } = renderHook(() => useSale());
      act(() => result.current.add('coca'));
      expect(result.current.total).toBe(2400);
      expect(result.current.units).toBe(1);
      expect(result.current.isEmpty).toBe(false);
    });

    it('agrupa el mismo producto en una línea con cantidad', () => {
      const { result } = renderHook(() => useSale());
      act(() => { result.current.add('coca'); });
      act(() => { result.current.add('coca'); });
      expect(result.current.lines).toHaveLength(1);
      expect(result.current.lines[0].qty).toBe(2);
      expect(result.current.total).toBe(4800);
    });

    it('calcula la ganancia real como (precio - costo) por cantidad', () => {
      const { result } = renderHook(() => useSale());
      act(() => { result.current.add('coca'); });
      act(() => { result.current.add('coca'); });
      act(() => { result.current.add('pan'); });
      // coca: (2400-1750)*2 = 1300 · pan: (1850-1290)*1 = 560
      expect(result.current.margin).toBe(1860);
      expect(result.current.total).toBe(2400 * 2 + 1850);
    });

    it('el stock resultante del primer producto descuenta lo vendido', () => {
      const { result } = renderHook(() => useSale());
      act(() => { result.current.add('coca'); });
      act(() => { result.current.add('coca'); });
      expect(result.current.firstLine?.product.stock).toBe(coca.stock);
      expect(result.current.firstLine?.stockAfter).toBe(coca.stock - 2);
    });

    it('ignora un id de producto inexistente sin romper', () => {
      const { result } = renderHook(() => useSale());
      act(() => result.current.add('no-existe'));
      expect(result.current.lines).toHaveLength(0);
    });

    it('no deja pasar a métodos de pago con el carrito vacío', () => {
      const { result } = renderHook(() => useSale());
      act(() => result.current.goToMethods());
      expect(result.current.view).toBe('pos');
    });

    it('pasa a métodos de pago con el carrito cargado', () => {
      const { result } = renderHook(() => useSale());
      act(() => result.current.add('pan'));
      act(() => result.current.goToMethods());
      expect(result.current.view).toBe('methods');
    });

    it('cobrar guarda el método y pasa al reveal', () => {
      const { result } = renderHook(() => useSale());
      act(() => result.current.add('pan'));
      act(() => result.current.goToMethods());
      act(() => result.current.pay('Efectivo'));
      expect(result.current.view).toBe('done');
      expect(result.current.method).toBe('Efectivo');
      expect(result.current.total).toBe(pan.price);
    });

    it('reset vuelve al estado inicial', () => {
      const { result } = renderHook(() => useSale());
      act(() => result.current.add('coca'));
      act(() => result.current.goToMethods());
      act(() => result.current.pay('Débito'));
      act(() => result.current.reset());
      expect(result.current.view).toBe('pos');
      expect(result.current.lines).toHaveLength(0);
      expect(result.current.total).toBe(0);
      expect(result.current.method).toBeNull();
    });
  });
  ```

- [ ] **Step 2: Correr los tests y verificar que FALLAN**
  ```bash
  pnpm vitest run src/demo/useSale.test.ts
  ```
  Deben fallar por módulo inexistente. Si pasan, algo está mal.

- [ ] **Step 3: Implementar `src/demo/useSale.ts`**
  ```ts
  import { useCallback, useMemo, useState } from 'react';
  import { PRODUCTS, type DemoProduct, type PaymentMethod } from './data';

  export type SaleView = 'pos' | 'methods' | 'done';

  export interface SaleLine {
    product: DemoProduct;
    qty: number;
    /** Stock que queda después de esta venta. Es lo que muestra el reveal. */
    stockAfter: number;
  }

  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

  /**
   * Estado del capítulo 01 del demo. Sin I/O, sin efectos:
   * todo vive en memoria y se pierde al recargar, que es lo correcto
   * para un demo anónimo.
   */
  export function useSale() {
    const [view, setView] = useState<SaleView>('pos');
    const [qtyById, setQtyById] = useState<Record<string, number>>({});
    const [method, setMethod] = useState<PaymentMethod | null>(null);

    const lines = useMemo<SaleLine[]>(
      () =>
        Object.entries(qtyById).map(([id, qty]) => {
          const product = byId.get(id)!;
          return { product, qty, stockAfter: product.stock - qty };
        }),
      [qtyById],
    );

    const total = useMemo(() => lines.reduce((a, l) => a + l.product.price * l.qty, 0), [lines]);
    const units = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines]);
    const margin = useMemo(
      () => lines.reduce((a, l) => a + (l.product.price - l.product.cost) * l.qty, 0),
      [lines],
    );

    const add = useCallback((id: string) => {
      if (!byId.has(id)) return;
      setQtyById((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    }, []);

    const goToMethods = useCallback(() => {
      if (lines.length === 0) return;
      setView('methods');
    }, [lines.length]);

    const pay = useCallback((m: PaymentMethod) => {
      setMethod(m);
      setView('done');
    }, []);

    const reset = useCallback(() => {
      setQtyById({});
      setMethod(null);
      setView('pos');
    }, []);

    return {
      view, lines, total, units, margin, method,
      isEmpty: lines.length === 0,
      firstLine: lines[0] ?? null,
      add, goToMethods, pay, reset,
    };
  }
  ```
  Nota sobre `goToMethods`: el guard va **fuera** de cualquier updater. Los updaters de `useState` deben ser puros — React los invoca dos veces en StrictMode, así que llamar a `setView` adentro dispararía la transición dos veces. Dependiendo de `lines.length` la closure queda siempre fresca.

- [ ] **Step 4: Correr los tests y verificar que PASAN**
  ```bash
  pnpm vitest run src/demo/useSale.test.ts
  ```
  Los 10 tests en verde.

- [ ] **Commit:** `git commit -m "feat(landing/demo): hook useSale con margen y stock testeados"`

---

### Task 7: Primitivos del punto de venta

**Files:**
- Create: `src/demo/parts/HintBar.tsx`
- Create: `src/demo/parts/ProductTile.tsx`
- Create: `src/demo/parts/Ticket.tsx`

**Constraints:**
- Componentes hoja ≤ 150 líneas. Presentacionales puros: reciben props, no tienen estado propio.
- `interface` para props, `className?: string` como escape hatch.
- **Nunca hex literals** — solo tokens (`border-ink`, `bg-teal-50`, `text-text-muted`).
- **Touch target ≥ 44px** en `ProductTile` (`min-h-[64px]` cubre de sobra) y en el botón de cobrar (`h-11` mínimo).
- Tiles son `<button type="button">` reales con `aria-label` descriptivo.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: `src/demo/parts/HintBar.tsx`**
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  interface HintBarProps {
    children: ReactNode;
    className?: string;
  }

  /** Barra de guía del demo. Le dice al visitante qué hacer sin obligarlo. */
  export function HintBar({ children, className }: HintBarProps) {
    return (
      <p
        className={cn(
          'flex items-center gap-2 border-b border-border-subtle bg-teal-50 px-4 py-2.5 text-body-sm text-teal-700',
          className,
        )}
      >
        {children}
      </p>
    );
  }
  ```

- [ ] **Step 2: `src/demo/parts/ProductTile.tsx`**
  ```tsx
  import { cn } from '@/lib/utils';
  import { formatArs } from '@/lib/pricing';
  import type { DemoProduct } from '../data';

  interface ProductTileProps {
    product: DemoProduct;
    onAdd: (id: string) => void;
    /** Pulsa hasta el primer tap, para que se entienda que es tocable. */
    nudge?: boolean;
    className?: string;
  }

  export function ProductTile({ product, onAdd, nudge = false, className }: ProductTileProps) {
    return (
      <button
        type="button"
        onClick={() => onAdd(product.id)}
        aria-label={`Agregar ${product.name}, ${formatArs(product.price)}`}
        className={cn(
          'min-h-[64px] rounded-sm border-hard border-ink bg-surface px-2.5 py-2.5 text-left',
          'transition-transform duration-100 hover:-translate-y-px hover:bg-teal-50 active:translate-y-0 active:scale-[0.98]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
          nudge && 'animate-demo-nudge',
          className,
        )}
      >
        <span className="block text-[12.5px] font-medium leading-tight">{product.name}</span>
        <span className="mt-1.5 block font-mono text-[13px]">{formatArs(product.price)}</span>
        <span className="mt-0.5 block font-mono text-[10px] text-text-muted">stock {product.stock}</span>
      </button>
    );
  }
  ```

- [ ] **Step 3: Agregar la animación `demo-nudge` a `tailwind.config.js`** dentro de `theme.extend`
  ```js
  keyframes: {
    'demo-nudge': {
      '0%, 100%': { boxShadow: '3px 3px 0 0 #14b8a6' },
      '50%':      { boxShadow: '3px 3px 0 0 rgba(20,184,166,0.25)' },
    },
  },
  animation: {
    'demo-nudge': 'demo-nudge 1.6s ease-in-out infinite',
  },
  ```
  El bloque global de `prefers-reduced-motion` en `index.css` ya neutraliza toda `animation-duration`, así que el pulso se apaga solo para quien lo pidió.

- [ ] **Step 4: `src/demo/parts/Ticket.tsx`**
  ```tsx
  import { cn } from '@/lib/utils';
  import { formatArs } from '@/lib/pricing';
  import type { SaleLine } from '../useSale';

  interface TicketProps {
    lines: SaleLine[];
    total: number;
    onPay: () => void;
    className?: string;
  }

  export function Ticket({ lines, total, onPay, className }: TicketProps) {
    const isEmpty = lines.length === 0;

    return (
      <div className={cn('flex flex-col border-t-hard border-ink bg-cream p-3.5 md:border-l-hard md:border-t-0', className)}>
        <h4 className="editorial-micro border-b border-dashed border-border-subtle pb-2">Venta en curso</h4>

        <div className="flex min-h-[110px] flex-1 flex-col gap-1.5 py-2">
          {isEmpty ? (
            <p className="pt-5 text-center text-body-sm italic leading-relaxed text-text-placeholder">
              Todavía no cargaste nada.
              <br />
              Tocá un producto
            </p>
          ) : (
            lines.map((l) => (
              <div key={l.product.id} className="grid grid-cols-[22px_1fr_auto] items-baseline gap-2 text-[12.5px]">
                <span className="font-mono font-bold text-teal-700">{l.qty}×</span>
                <span>{l.product.name}</span>
                <span className="font-mono">{formatArs(l.product.price * l.qty)}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-baseline justify-between border-t-hard border-ink pt-2.5">
          <span className="editorial-micro">Total</span>
          <span className="editorial-display text-[29px]">{formatArs(total)}</span>
        </div>

        <button
          type="button"
          onClick={onPay}
          disabled={isEmpty}
          className={cn(
            'mt-2.5 h-11 w-full rounded-sm border-hard border-ink bg-ink text-body-md font-medium text-paper shadow-offset-sm',
            'transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
            'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0',
          )}
        >
          Cobrar
        </button>
      </div>
    );
  }
  ```

- [ ] **Step 5: Verificar** — `pnpm run typecheck && pnpm run lint`

- [ ] **Commit:** `git commit -m "feat(landing/demo): primitivos del punto de venta"`

---

### Task 8: Selector de cobro y reveal

**Files:**
- Create: `src/demo/parts/MethodPicker.tsx`
- Create: `src/demo/parts/SaleReveal.tsx`

**Constraints:**
- Mismos límites y reglas de la Task 7.
- El reveal se anuncia en `aria-live="polite"`: quien usa lector de pantalla tiene que enterarse de que la venta se registró.
- El botón de "Fiado" se distingue visualmente (borde punteado teal) porque cambia de capítulo, no completa la venta.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: `src/demo/parts/MethodPicker.tsx`**
  ```tsx
  import { cn } from '@/lib/utils';
  import { PAYMENT_METHODS, type PaymentMethod } from '../data';

  interface MethodPickerProps {
    onPick: (method: PaymentMethod) => void;
    className?: string;
  }

  export function MethodPicker({ onPick, className }: MethodPickerProps) {
    return (
      <div className={cn('px-4 py-5', className)}>
        <h4 className="editorial-display text-[20px]">¿Cómo te paga?</h4>
        <p className="mb-4 mt-0.5 text-body-sm text-text-muted">
          Cada método queda registrado por separado. Al cierre del día sabés exactamente cuánto entró por cada uno.
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {PAYMENT_METHODS.map((m) => {
            const isCredit = m === 'Fiado';
            return (
              <button
                key={m}
                type="button"
                onClick={() => onPick(m)}
                className={cn(
                  'min-h-[44px] rounded-sm border-hard bg-surface px-2.5 py-3 text-body-sm font-medium transition-colors',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700',
                  isCredit
                    ? 'border-dashed border-teal-700 text-teal-700 hover:bg-teal-700 hover:text-paper'
                    : 'border-ink hover:bg-ink hover:text-paper',
                )}
              >
                {isCredit ? 'Fiado ⟶' : m}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: `src/demo/parts/SaleReveal.tsx`**
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';
  import { formatArs } from '@/lib/pricing';
  import { SELLER_NAME, SALE_TIME, type PaymentMethod } from '../data';
  import type { SaleLine } from '../useSale';

  interface SaleRevealProps {
    total: number;
    margin: number;
    units: number;
    method: PaymentMethod;
    firstLine: SaleLine;
    onAgain: () => void;
    className?: string;
  }

  interface RevealRow {
    key: string;
    label: string;
    value: ReactNode;
  }

  /**
   * El momento de mayor valor de toda la landing: lo que el sistema
   * registró solo. Las filas mapean 1:1 contra los ítems del Diagnóstico.
   */
  export function SaleReveal({ total, margin, units, method, firstLine, onAgain, className }: SaleRevealProps) {
    const rows: RevealRow[] = [
      { key: 'margin', label: 'Ganancia real de esta venta', value: <strong className="font-bold text-teal-700">{formatArs(margin)}</strong> },
      {
        key: 'stock',
        label: `Stock de ${firstLine.product.name}`,
        value: (
          <>
            <em className="mr-1.5 not-italic text-text-muted line-through">{firstLine.product.stock}</em>
            {firstLine.stockAfter} unidades
          </>
        ),
      },
      { key: 'method', label: 'Método de cobro', value: method },
      { key: 'seller', label: 'Quién vendió y a qué hora', value: `${SELLER_NAME} · ${SALE_TIME}` },
      { key: 'units', label: 'Unidades que salieron', value: units },
    ];

    return (
      <div className={cn('px-4 py-5', className)} aria-live="polite">
        <p className="flex items-center gap-2.5 editorial-display text-[23px]">
          <span className="grid size-7 shrink-0 place-items-center rounded-full border-hard border-ink bg-teal-500 text-[15px] text-ink" aria-hidden="true">
            ✓
          </span>
          Venta registrada · {formatArs(total)}
        </p>

        <p className="editorial-micro mt-5 border-t-hard border-ink pt-3.5">
          Lo que el sistema anotó solo — sin que hicieras nada
        </p>

        <dl className="mt-3">
          {rows.map((r) => (
            <div key={r.key} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-2.5 last:border-b-0">
              <dt className="text-[13.5px] text-ink/80">{r.label}</dt>
              <dd className="text-right font-mono text-[13.5px] font-medium">{r.value}</dd>
            </div>
          ))}
        </dl>

        <p className="editorial-italic mt-4 text-[18px] leading-snug text-teal-700">
          Eso es lo que tu Excel nunca te dijo. Y vos no hiciste nada: solo vendiste.
        </p>

        <button
          type="button"
          onClick={onAgain}
          className="mt-4 min-h-[44px] font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted underline underline-offset-[3px] transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          ↺ Hacer otra venta
        </button>
      </div>
    );
  }
  ```

- [ ] **Step 3: Verificar** — `pnpm run typecheck && pnpm run lint`

- [ ] **Commit:** `git commit -m "feat(landing/demo): selector de cobro y reveal de la venta"`

---

### Task 9: Capítulo 01 — Vendés

**Files:**
- Create: `src/demo/chapters/ChapterVender.tsx`

**Constraints:**
- Contenedor ≤ 200 líneas. Compone los primitivos, no reimplementa lógica: todo el estado sale de `useSale`.
- Emite `demo_started` en el primer producto agregado y `demo_sale_completed` al llegar al reveal — **vía `track()` del adapter**, nunca importando el proveedor.
- Elegir "Fiado" no completa la venta: llama `onGoToFiar` y resetea.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Crear `src/demo/chapters/ChapterVender.tsx`**
  ```tsx
  import { useRef } from 'react';
  import { track } from '@/lib/analytics';
  import { PRODUCTS, type PaymentMethod } from '../data';
  import { useSale } from '../useSale';
  import { HintBar } from '../parts/HintBar';
  import { ProductTile } from '../parts/ProductTile';
  import { Ticket } from '../parts/Ticket';
  import { MethodPicker } from '../parts/MethodPicker';
  import { SaleReveal } from '../parts/SaleReveal';

  interface ChapterVenderProps {
    /** Elegir "Fiado" salta al capítulo 02. */
    onGoToFiar: () => void;
  }

  const HINTS = {
    empty: <>👆 <b className="font-semibold">Tocá dos o tres productos</b> — como si estuvieras atendiendo.</>,
    loaded: <>👆 Seguí cargando, o <b className="font-semibold">tocá "Cobrar"</b> cuando termines.</>,
    methods: <>💳 <b className="font-semibold">Elegí cómo te paga.</b> Probá "Fiado" para ver qué pasa.</>,
    done: <>✅ <b className="font-semibold">Listo.</b> Mirá lo que el sistema anotó solo.</>,
  } as const;

  export function ChapterVender({ onGoToFiar }: ChapterVenderProps) {
    const sale = useSale();
    const startedRef = useRef(false);

    function handleAdd(id: string) {
      if (!startedRef.current) {
        startedRef.current = true;
        track('demo_started');
      }
      sale.add(id);
    }

    function handlePick(method: PaymentMethod) {
      if (method === 'Fiado') {
        sale.reset();
        startedRef.current = false;
        onGoToFiar();
        return;
      }
      track('demo_sale_completed', { method, total: sale.total });
      sale.pay(method);
    }

    function handleAgain() {
      sale.reset();
      startedRef.current = false;
    }

    const hint =
      sale.view === 'done' ? HINTS.done
      : sale.view === 'methods' ? HINTS.methods
      : sale.isEmpty ? HINTS.empty
      : HINTS.loaded;

    return (
      <div>
        <HintBar>{hint}</HintBar>

        {sale.view === 'pos' && (
          <div className="grid min-h-[380px] grid-cols-1 md:grid-cols-[1fr_300px]">
            <div className="grid grid-cols-2 content-start gap-2.5 p-3.5 min-[520px]:grid-cols-3">
              {PRODUCTS.map((p, i) => (
                <ProductTile
                  key={p.id}
                  product={p}
                  onAdd={handleAdd}
                  nudge={i === 0 && sale.isEmpty}
                />
              ))}
            </div>
            <Ticket lines={sale.lines} total={sale.total} onPay={sale.goToMethods} />
          </div>
        )}

        {sale.view === 'methods' && <MethodPicker onPick={handlePick} />}

        {sale.view === 'done' && sale.method && sale.firstLine && (
          <SaleReveal
            total={sale.total}
            margin={sale.margin}
            units={sale.units}
            method={sale.method}
            firstLine={sale.firstLine}
            onAgain={handleAgain}
          />
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Verificar** — `pnpm run typecheck && pnpm run lint`

- [ ] **Commit:** `git commit -m "feat(landing/demo): capítulo 01 — vendés"`

---

### Task 10: Capítulos 02 y 03 — Fiás y Cerrás

**Files:**
- Create: `src/demo/chapters/ChapterFiar.tsx`
- Create: `src/demo/chapters/ChapterCerrar.tsx`

**Constraints:**
- Contenedores ≤ 200 líneas. Estado local mínimo (un booleano de "acción consumida" en cada uno).
- El movimiento nuevo y el cierre confirmado van dentro de `aria-live="polite"`.
- El fiado se muestra visualmente separado en el cierre: **no entró plata**. Esa distinción es el punto de la sección.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: `src/demo/chapters/ChapterFiar.tsx`**
  ```tsx
  import { useState } from 'react';
  import { cn } from '@/lib/utils';
  import { formatArs } from '@/lib/pricing';
  import {
    CLIENT_NAME, CLIENT_SINCE, CLIENT_MOVE_COUNT,
    LEDGER_OPENING_BALANCE, LEDGER_MOVES, LEDGER_NEW_SALE, type LedgerMove,
  } from '../data';
  import { HintBar } from '../parts/HintBar';

  function MoveRow({ move, highlight = false }: { move: LedgerMove; highlight?: boolean }) {
    const isPayment = move.amount < 0;
    return (
      <div className={cn(
        'grid grid-cols-[74px_1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-2.5 text-body-sm',
        highlight && '-mx-4 bg-teal-50 px-4',
      )}>
        <span className="font-mono text-[11px] text-text-muted">{move.date}</span>
        <span>
          {move.label}
          <span className="mt-0.5 block text-[11.5px] text-text-muted">{move.detail}</span>
        </span>
        <span className={cn('whitespace-nowrap text-right font-mono font-medium', isPayment && 'text-teal-700')}>
          {isPayment ? '−' : '+'} {formatArs(Math.abs(move.amount))}
        </span>
      </div>
    );
  }

  export function ChapterFiar() {
    const [anotada, setAnotada] = useState(false);
    const balance = LEDGER_OPENING_BALANCE + (anotada ? LEDGER_NEW_SALE.amount : 0);

    return (
      <div>
        <HintBar>🧾 <b className="font-semibold">Marcos se lo lleva anotado.</b> Esto es lo que queda registrado.</HintBar>

        <div className="px-4 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-hard border-ink pb-3.5">
            <div>
              <p className="editorial-micro">Cuenta corriente</p>
              <p className="editorial-display text-[24px]">{CLIENT_NAME}</p>
              <p className="mt-1 font-mono text-[11px] text-text-muted">
                Cliente desde {CLIENT_SINCE} · {CLIENT_MOVE_COUNT} movimientos
              </p>
            </div>
            <div className="text-right" aria-live="polite">
              <p className="editorial-micro">Saldo actual</p>
              <p className="editorial-display text-[27px] text-teal-700">{formatArs(balance)}</p>
            </div>
          </div>

          <div className="mt-1.5">
            {anotada && <MoveRow move={LEDGER_NEW_SALE} highlight />}
            {LEDGER_MOVES.map((m) => <MoveRow key={m.id} move={m} />)}
          </div>

          {!anotada ? (
            <button
              type="button"
              onClick={() => setAnotada(true)}
              className="mt-5 h-11 w-full rounded-sm border-hard border-ink bg-ink text-body-md font-medium text-paper shadow-offset-sm transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Anotar la venta de hoy en la cuenta de Marcos
            </button>
          ) : (
            <p className="editorial-italic mt-5 text-[18px] leading-snug text-teal-700">
              Si mañana discute lo que se llevó, abrís la cuenta y se termina la discusión.
            </p>
          )}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: `src/demo/chapters/ChapterCerrar.tsx`**
  ```tsx
  import { useState } from 'react';
  import { cn } from '@/lib/utils';
  import { formatArs } from '@/lib/pricing';
  import { CIERRE_DATE, CIERRE_ROWS, CIERRE_PROFIT, CIERRE_UNITS, cierreTotal } from '../data';
  import { HintBar } from '../parts/HintBar';

  /** Color del swatch por método. Tokens, nunca hex sueltos en el JSX. */
  const SWATCH: Record<string, string> = {
    'Efectivo':      'bg-teal-500',
    'Transferencia': 'bg-ink',
    'Débito':        'bg-teal-700',
    'Crédito':       'bg-text-placeholder',
    'Mercado Pago':  'bg-cream',
    'Fiado':         'border-dashed border-teal-700 bg-transparent',
  };

  export function ChapterCerrar() {
    const [cerrada, setCerrada] = useState(false);
    const total = cierreTotal();

    return (
      <div>
        <HintBar>🌙 <b className="font-semibold">Son las 21:00.</b> Así se cierra el día.</HintBar>

        <div className="px-4 py-5">
          <p className="editorial-micro">Caja del {CIERRE_DATE}</p>

          <div className="mt-3.5">
            {CIERRE_ROWS.map((row) => (
              <div key={row.method} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-3 text-body-md">
                <span className={cn('flex items-center gap-2.5', row.isCredit && 'text-teal-700')}>
                  <span className={cn('size-2.5 shrink-0 rounded-[1px] border border-ink', SWATCH[row.method])} aria-hidden="true" />
                  {row.isCredit ? 'Fiado (no entró plata)' : row.method}
                </span>
                <span className={cn('text-right font-mono font-medium', row.isCredit && 'text-teal-700')}>
                  {formatArs(row.amount)}
                </span>
              </div>
            ))}

            <div className="mt-1.5 grid grid-cols-[1fr_auto] items-baseline gap-3 border-t-hard border-ink pt-3.5">
              <span>
                <strong className="font-semibold">Entró hoy</strong>
                <span className="block text-body-sm text-text-muted">Sin contar el fiado</span>
              </span>
              <span className="editorial-display text-right text-[27px]">{formatArs(total)}</span>
            </div>
          </div>

          {!cerrada ? (
            <button
              type="button"
              onClick={() => setCerrada(true)}
              className="mt-5 h-11 w-full rounded-sm border-hard border-ink bg-ink text-body-md font-medium text-paper shadow-offset-sm transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Cerrar caja
            </button>
          ) : (
            <div className="mt-5 border-t-hard border-ink pt-4" aria-live="polite">
              <p className="flex items-center gap-2.5 editorial-display text-[23px]">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border-hard border-ink bg-teal-500 text-[15px] text-ink" aria-hidden="true">✓</span>
                Caja cerrada
              </p>
              <dl className="mt-3.5">
                {[
                  { k: 'Ganancia real del día', v: formatArs(CIERRE_PROFIT) },
                  { k: 'Productos vendidos', v: `${CIERRE_UNITS} unidades` },
                  { k: 'Resumen enviado por mail', v: 'nestorb@…' },
                ].map((r) => (
                  <div key={r.k} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-dashed border-border-subtle py-2.5 last:border-b-0">
                    <dt className="text-[13.5px] text-ink/80">{r.k}</dt>
                    <dd className="text-right font-mono text-[13.5px] font-medium">{r.v}</dd>
                  </div>
                ))}
              </dl>
              <p className="editorial-italic mt-4 text-[18px] leading-snug text-teal-700">
                Lo que antes te llevaba una hora con la calculadora.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 3: Verificar** — `pnpm run typecheck && pnpm run lint`

- [ ] **Commit:** `git commit -m "feat(landing/demo): capítulos 02 y 03 — fiás y cerrás"`

---

### Task 11: Shell del demo, fallback y test de integración

**Files:**
- Create: `src/demo/DemoWidget.tsx`
- Create: `src/demo/DemoFrameFallback.tsx`
- Create: `src/demo/DemoWidget.test.tsx`

**Constraints:**
- Tabs con `role="tablist"` / `role="tab"` / `aria-selected` / `aria-controls`, **navegables con flechas** (← →).
- Cambiar de capítulo **no resetea** los otros: los tres se montan y se ocultan con `hidden`, no se desmontan.
- El fallback debe tener **exactamente la misma altura** que el demo montado, o el CLS deja de ser 0.
- `DemoWidget` es el **único** export público del módulo `src/demo/`. Nada fuera de la carpeta importa sus internos.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: `src/demo/DemoFrameFallback.tsx`**
  ```tsx
  /**
   * Placeholder mientras baja el chunk del demo. Reserva la MISMA altura
   * que el widget montado — si cambia la altura del demo, cambiar acá también,
   * o el CLS deja de ser 0.
   */
  export function DemoFrameFallback() {
    return (
      <div className="min-h-[480px] animate-pulse border-hard border-ink bg-cream" aria-hidden="true">
        <div className="h-[42px] border-b-hard border-ink bg-paper" />
      </div>
    );
  }
  ```

- [ ] **Step 2: `src/demo/DemoWidget.tsx`**
  ```tsx
  import { useCallback, useRef, useState } from 'react';
  import { cn } from '@/lib/utils';
  import { track } from '@/lib/analytics';
  import { ChapterVender } from './chapters/ChapterVender';
  import { ChapterFiar } from './chapters/ChapterFiar';
  import { ChapterCerrar } from './chapters/ChapterCerrar';

  const CHAPTERS = [
    { id: 1, num: '01', title: 'Vendés' },
    { id: 2, num: '02', title: 'Fiás' },
    { id: 3, num: '03', title: 'Cerrás' },
  ] as const;

  export function DemoWidget() {
    const [active, setActive] = useState(1);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const go = useCallback((id: number) => {
      setActive(id);
      track('demo_chapter_viewed', { chapter: id });
    }, []);

    function onKeyDown(e: React.KeyboardEvent) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      const next = ((active - 1 + delta + CHAPTERS.length) % CHAPTERS.length) + 1;
      go(next);
      tabRefs.current[next - 1]?.focus();
    }

    return (
      <div className="overflow-hidden rounded-[3px] border-hard border-ink bg-surface shadow-offset-lg">
        <div className="flex items-center gap-2.5 border-b-hard border-ink bg-cream px-3.5 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2].map((i) => <span key={i} className="block size-2.5 rounded-full border border-ink" />)}
          </span>
          <span className="flex-1 truncate text-center font-mono text-[11px] text-text-muted">
            bueninventario.com/demo
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-teal-700">
            <span className="size-1.5 animate-pulse rounded-full bg-teal-500" aria-hidden="true" />
            En vivo
          </span>
        </div>

        <div role="tablist" aria-label="Capítulos del demo" onKeyDown={onKeyDown} className="flex border-b-hard border-ink bg-paper">
          {CHAPTERS.map((c, i) => {
            const selected = active === c.id;
            return (
              <button
                key={c.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`demo-tab-${c.id}`}
                aria-selected={selected}
                aria-controls={`demo-panel-${c.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => go(c.id)}
                className={cn(
                  'min-h-[48px] flex-1 border-r border-border-subtle px-2 py-3 text-center transition-colors last:border-r-0',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700',
                  selected ? 'bg-ink' : 'hover:bg-teal-50',
                )}
              >
                <span className={cn('block font-mono text-[10px] tracking-[0.1em]', selected ? 'text-teal-500' : 'text-text-muted')}>
                  {c.num}
                </span>
                <span className={cn('mt-0.5 block text-body-sm font-medium', selected && 'text-paper')}>
                  {c.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Los tres se mantienen montados: cambiar de capítulo no pierde el estado de los otros. */}
        <div role="tabpanel" id="demo-panel-1" aria-labelledby="demo-tab-1" hidden={active !== 1}>
          <ChapterVender onGoToFiar={() => go(2)} />
        </div>
        <div role="tabpanel" id="demo-panel-2" aria-labelledby="demo-tab-2" hidden={active !== 2}>
          <ChapterFiar />
        </div>
        <div role="tabpanel" id="demo-panel-3" aria-labelledby="demo-tab-3" hidden={active !== 3}>
          <ChapterCerrar />
        </div>
      </div>
    );
  }
  ```
  Nota: `hidden` en el div es suficiente — la regla `[hidden]{display:none}` del user-agent lo oculta y lo saca del árbol de accesibilidad, sin desmontar el árbol de React.

- [ ] **Step 3: `src/demo/DemoWidget.test.tsx`**
  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen, within } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import { DemoWidget } from './DemoWidget';

  describe('DemoWidget', () => {
    it('arranca en el capítulo 01 con el ticket vacío', () => {
      render(<DemoWidget />);
      expect(screen.getByRole('tab', { name: /Vendés/ })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText(/Todavía no cargaste nada/)).toBeInTheDocument();
    });

    it('completa una venta y muestra la ganancia real correcta', async () => {
      const user = userEvent.setup();
      render(<DemoWidget />);

      // Coca ×2 → margen (2400-1750)*2 = 1300 · total 4800
      const coca = screen.getByRole('button', { name: /Agregar Coca-Cola 1\.5L/ });
      await user.click(coca);
      await user.click(coca);

      await user.click(screen.getByRole('button', { name: 'Cobrar' }));
      await user.click(screen.getByRole('button', { name: 'Efectivo' }));

      expect(screen.getByText(/Venta registrada · \$4\.800/)).toBeInTheDocument();
      expect(screen.getByText('$1.300')).toBeInTheDocument();
      // Stock 24 → 22
      expect(screen.getByText(/22 unidades/)).toBeInTheDocument();
    });

    it('no deja cobrar con el carrito vacío', () => {
      render(<DemoWidget />);
      expect(screen.getByRole('button', { name: 'Cobrar' })).toBeDisabled();
    });

    it('elegir Fiado salta al capítulo 02', async () => {
      const user = userEvent.setup();
      render(<DemoWidget />);
      await user.click(screen.getByRole('button', { name: /Agregar Pan lactal/ }));
      await user.click(screen.getByRole('button', { name: 'Cobrar' }));
      await user.click(screen.getByRole('button', { name: /Fiado/ }));
      expect(screen.getByRole('tab', { name: /Fiás/ })).toHaveAttribute('aria-selected', 'true');
    });

    it('anotar en la cuenta actualiza el saldo', async () => {
      const user = userEvent.setup();
      render(<DemoWidget />);
      await user.click(screen.getByRole('tab', { name: /Fiás/ }));
      const panel = screen.getByRole('tabpanel', { name: /Fiás/ });
      await user.click(within(panel).getByRole('button', { name: /Anotar la venta de hoy/ }));
      expect(within(panel).getByText('$29.970')).toBeInTheDocument();
    });

    it('cerrar caja muestra la ganancia del día', async () => {
      const user = userEvent.setup();
      render(<DemoWidget />);
      await user.click(screen.getByRole('tab', { name: /Cerrás/ }));
      const panel = screen.getByRole('tabpanel', { name: /Cerrás/ });
      expect(within(panel).getByText('$389.640')).toBeInTheDocument();
      await user.click(within(panel).getByRole('button', { name: 'Cerrar caja' }));
      expect(within(panel).getByText('Caja cerrada')).toBeInTheDocument();
      expect(within(panel).getByText('$104.190')).toBeInTheDocument();
    });

    it('las flechas navegan entre capítulos', async () => {
      const user = userEvent.setup();
      render(<DemoWidget />);
      await user.click(screen.getByRole('tab', { name: /Vendés/ }));
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: /Fiás/ })).toHaveAttribute('aria-selected', 'true');
    });
  });
  ```

- [ ] **Step 4: Verificar**
  ```bash
  pnpm vitest run src/demo/DemoWidget.test.tsx
  ```
  Los 7 tests pasan. El de la ganancia es el que protege el número que la landing publica como su momento de valor.

- [ ] **Commit:** `git commit -m "feat(landing/demo): shell con tabs accesibles y test de integración"`

---

# FASE 2 — Secciones

### Task 12: PhoneFrame y pantallas mobile

Reemplaza la idea de assets generados con IA: texto nítido, datos coherentes con el demo, cero peso de imagen.

**Files:**
- Create: `src/components/ui/PhoneFrame.tsx`
- Create: `src/components/ui/phone-screens/PhoneVender.tsx`
- Create: `src/components/ui/phone-screens/PhoneFiado.tsx`
- Create: `src/components/ui/phone-screens/PhoneCierre.tsx`

**Constraints:**
- `PhoneFrame` acepta `children` (igual que `BrowserFrame`): pasarle un `<img>` con un screenshot real **no debe cambiar el layout**. Ese es el punto de extensión.
- Componentes hoja ≤ 150 líneas, presentacionales puros.
- Los datos deben coincidir con `demo/data.ts` — importar de ahí, no duplicar números.
- El marco es decorativo: `aria-hidden` en el notch, y el contenido sigue siendo texto real leíble.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: `src/components/ui/PhoneFrame.tsx`**
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  interface PhoneFrameProps {
    children: ReactNode;
    /** Rótulo mono sobre la descripción. */
    label?: string;
    /** Una línea explicando qué muestra la pantalla. */
    caption?: string;
    className?: string;
  }

  /**
   * Marco de teléfono para mostrar pantallas mobile. `children` es la
   * pantalla: hoy componentes React, mañana un <img> con un screenshot
   * real de la app — el layout no cambia.
   */
  export function PhoneFrame({ children, label, caption, className }: PhoneFrameProps) {
    return (
      <div className={cn('w-[240px] shrink-0', className)}>
        <div className="rounded-[26px] border-hard border-paper bg-ink p-2.5 shadow-offset-md">
          <div className="flex h-[430px] flex-col overflow-hidden rounded-[19px] bg-paper text-ink">
            <div className="grid h-5 place-items-center" aria-hidden="true">
              <span className="block h-1 w-[52px] rounded-[3px] bg-ink/20" />
            </div>
            {children}
          </div>
        </div>
        {(label || caption) && (
          <div className="mt-3.5 text-center">
            {label && <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-teal-500">{label}</p>}
            {caption && <p className="mx-auto mt-1.5 max-w-[220px] text-body-sm text-paper/60">{caption}</p>}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Crear las tres pantallas** en `src/components/ui/phone-screens/`.

  Las tres comparten esta estructura: una barra superior (`border-b-hard border-ink bg-cream`, título en `editorial-display text-[15px]` a la izquierda y estado en `font-mono text-[9px] text-text-muted` a la derecha), un cuerpo `flex-1 p-3` y un botón falso al pie (`mt-auto h-[38px] border-hard border-ink bg-ink text-paper shadow-offset-xs grid place-items-center text-[12.5px]`). El botón es `<div>`, **no `<button>`**: es una ilustración, no un control — un botón real sería una promesa de interacción que no existe.

  | Componente | Barra | Cuerpo | Botón |
  |---|---|---|---|
  | `PhoneVender` | `Vender` / `CAJA ABIERTA` | 3 filas (Coca-Cola 1.5L ×2 · $4.800 / Pan lactal ×1 · $1.850 / Yerba Playadito 1kg ×1 · $4.900) + KPI `Total` `$11.550` | `Cobrar` |
  | `PhoneFiado` | `Marcos López` / `CTA. CTE.` | KPI `Saldo` `$29.970` con `debe` en teal + 3 movimientos (Venta #1863 Hoy · 4 productos +$11.550 / Pago a cuenta 28/08 Efectivo −$10.000 / Venta #1841 26/08 · 4 productos +$10.460) | `Registrar un pago` |
  | `PhoneCierre` | `Cierre` / `MAR 04/09` | KPI `Entró hoy` `$389.640` + 5 filas por método (Efectivo $148.300 / Transferencia $96.750 / Débito $61.200 / Crédito $44.980 / Mercado Pago $38.410) | `Cerrar caja` |

  Todos los importes se renderizan con `formatArs()` sobre las constantes de `@/demo/data` (`LEDGER_NEW_SALE.amount`, `CIERRE_ROWS`, `cierreTotal()`), **nunca escritos a mano**. El total de `PhoneVender` (`$11.550`) debe salir de `LEDGER_NEW_SALE.amount`, que es exactamente la venta que el capítulo 02 anota — así el visitante que compare no encuentra contradicción.

  Estilos de las filas: `grid grid-cols-[1fr_auto] items-baseline gap-2 border-b border-dashed border-border-subtle py-2 text-[11.5px]`, con el importe en `font-mono font-medium` y el subtítulo en `block text-[9.5px] text-text-muted`.
  KPI: `border-hard border-ink rounded-sm bg-surface px-2.5 py-2.5`, label en `font-mono text-[8.5px] uppercase tracking-[0.09em] text-text-muted`, valor en `editorial-display text-[23px]`.

- [ ] **Step 3: Verificar** — `pnpm run typecheck && pnpm run lint`

- [ ] **Commit:** `git commit -m "feat(landing): PhoneFrame y pantallas mobile en código"`

---

### Task 13: Hero — rewrite con demo lazy

**Files:**
- Rewrite: `src/components/sections/Hero.tsx`

**Constraints:**
- **El demo se importa con `lazy()` y se envuelve en `<Suspense>`** con `DemoFrameFallback`. No puede estar en el chunk inicial.
- H1 único en toda la página.
- El CTA emite `cta_signup_clicked` con `section: 'hero'` vía `track()`.
- Mobile: el demo tiene que quedar visible sin scroll en un viewport de 640px de alto. El H1 baja a 40px y la lede se acorta.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Reescribir `src/components/sections/Hero.tsx`**
  ```tsx
  import { lazy, Suspense } from 'react';
  import { Section } from '@/components/ui/Section';
  import { Button } from '@/components/ui/Button';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { DemoFrameFallback } from '@/demo/DemoFrameFallback';
  import { signupUrl } from '@/lib/config';
  import { track } from '@/lib/analytics';
  import { TRIAL_DAYS } from '@/lib/pricing';

  const DemoWidget = lazy(() =>
    import('@/demo/DemoWidget').then((m) => ({ default: m.DemoWidget })),
  );

  export function Hero() {
    return (
      <Section id="hero" tone="paper" className="pb-20 pt-24 md:pb-28 md:pt-28">
        <div className="grid grid-cols-1 items-start gap-11 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14">
          <div>
            <EditorialMicro>Sistema de gestión · Comercios · Argentina</EditorialMicro>

            <h1 className="editorial-display mt-5 text-[40px] leading-[1.04] tracking-[-0.015em] md:text-[58px]">
              No te pido que me creas.
              <br />
              <em className="editorial-italic text-teal-500">Probalo acá.</em>
            </h1>

            <p className="mt-6 max-w-[44ch] text-body-lg text-ink/80">
              Esto <span className="hidden lg:inline">de al lado</span>
              <span className="lg:hidden">de abajo</span> <strong className="font-semibold">es el sistema</strong>, no un video.
              Hacé una venta, fiale a un cliente, cerrá la caja. Sin registrarte, sin dar un mail, ahora mismo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                as="a"
                href={signupUrl()}
                variant="primary"
                size="lg"
                onClick={() => track('cta_signup_clicked', { section: 'hero' })}
              >
                Empezar {TRIAL_DAYS} días gratis <span className="font-mono">→</span>
              </Button>
              <Button as="a" href="#demo" variant="ghost-accent" size="lg" className="lg:hidden">
                Ver el demo ↓
              </Button>
            </div>

            <p className="mt-7 font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-text-muted">
              Sin tarjeta <span className="text-teal-600">·</span> Cancelás cuando quieras
              <br />
              Hecho en un almacén real, usado todos los días
            </p>
          </div>

          <div id="demo" className="scroll-mt-24">
            <Suspense fallback={<DemoFrameFallback />}>
              <DemoWidget />
            </Suspense>
          </div>
        </div>
      </Section>
    );
  }
  ```

- [ ] **Step 2: Verificar que `Button` soporta `onClick` en la variante `as="a"`**
  ```bash
  sed -n '1,60p' src/components/ui/Button.tsx
  ```
  Si el tipo de props no incluye `onClick`, extenderlo con `React.ComponentPropsWithoutRef<'a'>` — **no** castear con `as any`.

- [ ] **Step 3: Verificar el split del chunk**
  ```bash
  pnpm run build
  ```
  En el output de Vite debe aparecer un chunk separado para el demo. Si el demo quedó en el chunk principal, el `lazy()` no está funcionando.

- [ ] **Commit:** `git commit -m "feat(landing): hero con demo interactivo cargado lazy"`

---

### Task 14: Franja de confianza

**Files:**
- Create: `src/components/sections/TrustStrip.tsx`

**Constraints:**
- **Prohibido** cualquier señal de adopción (cantidad de clientes, comercios, ventas). Ver la restricción de honestidad del spec.
- El conteo de catálogo sale de `facts.ts`, nunca escrito a mano.
- No usa `Section` (es una banda a ancho completo entre bordes duros, no una sección con padding vertical grande).

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Crear `src/components/sections/TrustStrip.tsx`**
  ```tsx
  import type { ReactNode } from 'react';
  import { CATALOG_ITEMS, formatApprox } from '@/lib/facts';
  import { TRIAL_DAYS } from '@/lib/pricing';

  interface Signal {
    key: string;
    big: ReactNode;
    small: string;
  }

  /**
   * Cuatro señales VERIFICABLES. Ninguna habla de adopción: describen
   * la garantía, el producto, la integridad de los datos y el origen.
   */
  const SIGNALS: Signal[] = [
    { key: 'trial',    big: <>{TRIAL_DAYS} días</>,                                    small: 'gratis, sin tarjeta. Cancelás cuando quieras.' },
    { key: 'catalog',  big: <>{formatApprox(CATALOG_ITEMS)}</>,                        small: 'productos de tu rubro ya cargados. No arrancás de cero.' },
    { key: 'data',     big: <>Tus datos<br />son tuyos</>,                             small: 'Los exportás a Excel cuando quieras. Si te vas, te los llevás.' },
    { key: 'founder',  big: <em className="editorial-italic text-teal-700">Un almacén<br />de verdad</em>, small: 'Hecho en Don Néstor Despensa. Usado todos los días.' },
  ];

  export function TrustStrip() {
    return (
      <div className="border-y-hard border-ink bg-cream px-6 md:px-10">
        <div className="mx-auto grid max-w-container grid-cols-1 md:grid-cols-4">
          {SIGNALS.map((s) => (
            <div
              key={s.key}
              className="border-b border-dashed border-border-subtle px-5 py-6 last:border-b-0 md:border-b-0 md:border-r md:px-6 md:py-7 md:last:border-r-0"
            >
              <p className="editorial-display text-[26px] leading-tight">{s.big}</p>
              <p className="mt-1.5 text-body-sm leading-relaxed text-text-muted">{s.small}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  ```

- [ ] **Step 2: Verificar** — `pnpm run typecheck && pnpm run lint`

- [ ] **Commit:** `git commit -m "feat(landing): franja de confianza con señales verificables"`

---

### Task 15: Diagnóstico — reestructurar como módulo

El spec pedía renderizar `ExcelComparison` dentro de `Diagnostico`, lo que sería una sección importando otra sección. Se resuelve como módulo con composición interna.

**Files:**
- Create: `src/components/sections/diagnostico/Diagnostico.tsx`
- Create: `src/components/sections/diagnostico/ExcelTable.tsx`
- Delete: `src/components/sections/Diagnostico.tsx`
- Delete: `src/components/sections/ExcelComparison.tsx`

**Constraints:**
- `ExcelTable` deja de ser una `<Section>`: pasa a ser un componente que se renderiza **dentro** de `Diagnostico`. Pierde su `EditorialMicro` y su `DisplayHeading` propios.
- Se conservan **verbatim** los 5 ítems del diagnóstico y las 6 filas de la comparativa, incluida la variante de cards mobile.
- Iconos de `lucide-react` importados de a uno.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Crear `diagnostico/ExcelTable.tsx`** — copiar el contenido de `ExcelComparison.tsx` conservando el array `ROWS` y **ambas** variantes (tabla ≥md y cards <md) tal cual. Quitar el wrapper `<Section>`, el `EditorialMicro` y el `DisplayHeading`; el componente arranca directo en la tabla. Exportar como `export function ExcelTable()`.

- [ ] **Step 2: Crear `diagnostico/Diagnostico.tsx`** — copiar `Diagnostico.tsx` conservando el array `ITEMS` verbatim, con estos cambios:
  - Lede nueva debajo del `DisplayHeading`:
    ```tsx
    <p className="mt-6 max-w-[56ch] text-body-lg leading-relaxed text-ink/75">
      Recién lo viste funcionando. Esto es lo que el sistema te contesta y tu planilla no.
    </p>
    ```
  - Al cierre, después del listado de los 5 ítems:
    ```tsx
    <div className="mt-20">
      <EditorialMicro>Punto por punto</EditorialMicro>
      <div className="mt-8">
        <ExcelTable />
      </div>
    </div>
    ```

- [ ] **Step 3: Borrar los archivos viejos**
  ```bash
  rm src/components/sections/Diagnostico.tsx src/components/sections/ExcelComparison.tsx
  ```

- [ ] **Step 4: Verificar que no quedan referencias**
  ```bash
  grep -rn "ExcelComparison" src/ && echo "QUEDAN REFERENCIAS — arreglar" || echo "limpio"
  ```

- [ ] **Commit:** `git commit -m "refactor(landing): fusionar comparativa Excel dentro de Diagnóstico"`

---

### Task 16: Sistema — rewrite con capacidades y mobile

**Files:**
- Rewrite: `src/components/sections/Sistema.tsx`

**Constraints:**
- Contenedor ≤ 200 líneas. Si excede, extraer el sub-bloque de teléfonos a `sections/sistema/PhoneRow.tsx`.
- Las 6 capacidades corresponden a features **vivas en producción**. Ninguna promesa a futuro.
- Los `BrowserFrame` con `ProductsFakeScreen` / `LedgerFakeScreen` / `CajaFakeScreen` **se eliminan de esta sección**: el demo del hero ya cumple esa función y repetirlo diluye. Los componentes `fake-screens/` quedan en el repo sin uso — **verificar y borrar si ninguna otra sección los usa**.
- Fila de teléfonos con scroll horizontal + snap en mobile: `flex gap-6 overflow-x-auto snap-x snap-mandatory` y cada `PhoneFrame` con `snap-center`.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Reescribir el encabezado de la sección** con tono `ink`:
  - Eyebrow: `Lo que hay debajo`
  - H2: `Recién usaste la caja.` + italicAccent `Abajo hay bastante más.`
  - Lede: `No es una app de inventario. Es el sistema completo de un comercio — y está construido para bancar el tuyo cuando crezca.`

- [ ] **Step 2: Definir el array de capacidades** — copy exacto del spec:
  ```tsx
  interface Capability { tag: string; title: string; body: string }

  const CAPABILITIES: Capability[] = [
    { tag: 'Catálogo',     title: 'Tu rubro ya viene cargado',                    body: 'Casi 30.000 productos con código de barras, marca y presentación, listos para usar. Kiosco, ferretería, carnicería, verdulería, pescadería, indumentaria. Escaneás y aparece.' },
    { tag: 'Facturación',  title: 'ARCA, cuando vos quieras',                     body: 'Facturación electrónica integrada, homologada. Vos decidís venta por venta si facturás o no. El sistema no te controla ni te denuncia.' },
    { tag: 'Sucursales',   title: 'Más de un local',                              body: 'Stock, caja y precios por sucursal, con la vista consolidada arriba. Si abrís el segundo, no empezás un sistema nuevo.' },
    { tag: 'Tienda web',   title: 'Tu comercio online, sin programar',            body: 'Tienda propia conectada al mismo stock. Los pedidos web entran a la misma caja. Elegís el diseño y sale publicada.' },
    { tag: 'Migración',    title: 'Subís tus archivos Excel y se cargan solos',   body: 'Importación masiva de productos, clientes y proveedores. No hay que tipear nada de nuevo.' },
    { tag: 'Rotación',     title: 'Qué se vende y qué duerme',                    body: 'Días sin venta por producto, margen real y capital inmovilizado. Sabés qué dejar de comprar antes de comprarlo.' },
  ];
  ```
  Grid: `grid grid-cols-1 border-t-hard border-paper md:grid-cols-2`, cada celda con `border-b border-dashed border-paper/20 py-6`, tag en `font-mono text-[10px] uppercase tracking-[0.1em] text-teal-500`, título en `editorial-display text-[22px] text-paper`, body en `text-[14.5px] leading-relaxed text-paper/65`.

- [ ] **Step 3: Sub-bloque de teléfonos** al cierre de la sección:
  - Eyebrow `En el mostrador` (en teal-500)
  - H2 `Y todo esto,` + italicAccent `desde el celular.`
  - Lede: `No hay que instalar nada ni comprar una computadora. Se abre en el navegador del teléfono que ya tenés.`
  - Los tres `PhoneFrame` con sus `label` y `caption`:
    - `Vender` / `Atendés con una mano mientras cobrás con la otra.`
    - `Fiado` / `La cuenta de cada cliente, en el bolsillo.`
    - `Cierre de caja` / `El día cerrado antes de bajar la persiana.`

- [ ] **Step 4: Verificar si los fake-screens quedaron huérfanos**
  ```bash
  grep -rn "FakeScreen" src/ --include="*.tsx" | grep -v "ui/fake-screens/"
  ```
  Si no aparece ningún uso, borrar `src/components/ui/fake-screens/` completo y `BrowserFrame` si tampoco se usa. Código muerto no se conserva "por las dudas".

- [ ] **Step 5: Verificar** — `pnpm run typecheck && pnpm run lint && pnpm run build`

- [ ] **Commit:** `git commit -m "feat(landing): sección Sistema con capacidades y mocks mobile"`

---

### Task 17: Cómo arrancás

**Files:**
- Create: `src/components/sections/ComoArrancas.tsx`

**Constraints:**
- Componente ≤ 150 líneas. Copy verbatim del spec.
- Ancho `editorial`.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Crear el componente** con `Section` `tone="paper"` `width="editorial"`, eyebrow `Cómo arrancás`, H2 `De decir que sí` + italicAccent `a estar operando.`, lede `La objeción real no es el precio: es "no tengo tiempo para cargar todo". Esto es lo que pasa de verdad.`, y este array:
  ```tsx
  interface Step { when: string; title: string; body: string }

  const STEPS: Step[] = [
    { when: 'Hoy',                title: 'Te abrís la cuenta y elegís tu rubro',        body: 'Dos minutos. Sin tarjeta. En cuanto elegís el rubro, tu catálogo aparece cargado — casi 30.000 productos con código de barras esperando.' },
    { when: 'Esta tarde',         title: 'Subís tus archivos Excel y se cargan solos',  body: 'Productos, clientes y proveedores. Si tenés precios propios, los importás. Si no tenés nada en Excel, escaneás y cargás sobre el catálogo que ya está.' },
    { when: 'Mañana',             title: 'Empezás a vender con el sistema',             body: 'Abrís caja, vendés, cerrás. Desde el primer día ya sabés cuánto entró por cada método y cuánto ganaste de verdad.' },
    { when: 'La primera semana',  title: 'Si te trabás, me escribís a mí',              body: 'No hay mesa de ayuda ni ticket. Me escribís por WhatsApp y te contesto yo. La migración de tu Excel te la hago yo personalmente, sin costo.' },
  ];
  ```
  Layout: `border-t-hard border-ink` en el contenedor; cada paso `grid grid-cols-[64px_1fr] gap-4 border-b border-dashed border-border-subtle py-6 md:grid-cols-[120px_1fr] md:gap-8`, el último con `border-b-hard border-ink`. `when` en `font-mono text-[11px] uppercase tracking-[0.09em] text-teal-700 pt-1`, título en `editorial-display text-[24px] leading-snug`, body en `mt-1.5 max-w-[60ch] text-body-md text-ink/78`.

- [ ] **Commit:** `git commit -m "feat(landing): sección Cómo arrancás"`

---

### Task 18: Precio — rewrite con precio visible

**Files:**
- Rewrite: `src/components/sections/Precio.tsx`

**Constraints:**
- El número sale **exclusivamente** de `PLAN_PRICE_ARS`. Si aparece `24900` o `$24.900` escrito a mano en el JSX, está mal.
- El CTA emite `cta_signup_clicked` con `section: 'precio'`.
- La línea de comparación usa `COMPETITOR_FLOOR_ARS` y `COMPETITOR_TRIAL_DAYS`, sin nombrar al competidor.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Reescribir** con `Section` `tone="cream"` `width="reading"` centrada:
  - Eyebrow `El precio`, H2 `Un plan. Todo incluido.` + italicAccent `Sin letra chica.`
  - Card: `mx-auto mt-11 max-w-[520px] rounded-[3px] border-hard border-ink bg-surface p-8 text-center shadow-offset-lg`
  - Eyebrow interno `Plan único · ARS`
  - Precio: `<p className="editorial-display mt-2.5 text-[62px] leading-none">{formatArs(PLAN_PRICE_ARS)}<span className="font-mono text-[19px] text-text-muted"> / mes</span></p>`
  - Debajo: `Después de {TRIAL_DAYS} días gratis. Sin tarjeta para probar.`
  - Features (check teal `✓` en `font-mono font-bold text-teal-700`):
    ```
    Ventas, stock, caja y cuentas corrientes
    Catálogo de tu rubro precargado
    Facturación ARCA cuando vos quieras
    Tienda web propia conectada al stock
    Multi-sucursal y usuarios ilimitados
    Soporte por WhatsApp — te contesto yo
    ```
  - CTA ancho completo `Empezar {TRIAL_DAYS} días gratis →` + micro `Sin tarjeta · Cancelás cuando quieras`
  - Comparación debajo de la card:
    ```tsx
    <p className="mx-auto mt-6 max-w-[46ch] text-body-sm leading-relaxed text-text-muted">
      Para comparar: los sistemas de gestión más conocidos del país arrancan arriba de{' '}
      {formatArs(COMPETITOR_FLOOR_ARS)} por mes y te dan {COMPETITOR_TRIAL_DAYS} días de prueba.
    </p>
    ```

- [ ] **Step 2: Verificar que el número no está duplicado**
  ```bash
  grep -rn "24900\|24\.900" src/ | grep -v "lib/pricing"
  ```
  Debe devolver vacío.

- [ ] **Commit:** `git commit -m "feat(landing): precio visible desde fuente única"`

---

### Task 19: FAQ, Historia y navegación

**Files:**
- Rewrite: `src/components/sections/Faq.tsx`
- Modify: `src/components/sections/Historia.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/components/Footer.tsx`

**Constraints:**
- Los links de WhatsApp emiten `cta_whatsapp_clicked` con su `section`.
- El nav del header y los links del footer deben apuntar a secciones que existan tras el rediseño.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: FAQ — corregir la pregunta 6.** Hoy dice `También funciona para multisucursal (feature en desarrollo)`. Multi-sucursal está **en producción** (etapa 3A). Reemplazar por `También funciona si tenés más de un local.`

- [ ] **Step 2: FAQ — agregar la séptima pregunta** al final del array:
  ```ts
  {
    q: '¿Dónde están mis datos y qué pasa si se rompe algo?',
    a: 'Tus datos no están en la computadora del local: están en la nube, en servidores de Amazon. Si se te rompe la PC, se te moja o te la roban, tus datos siguen ahí — entrás desde otro equipo y seguís trabajando. Y los exportás a Excel cuando quieras.',
  },
  ```
  ⚠️ **Esta respuesta NO promete backups a propósito.** Ver Task 24: si PITR está verificado como activo en producción, recién ahí se puede sumar la frase sobre copias de seguridad.

- [ ] **Step 3: Historia — quitar el bloque final** `También lo usan · Kioscos · Despensas · Ferreterías…` junto con su separador y su `EditorialMicro`. Roza la insinuación de adopción que la restricción de honestidad prohíbe, y la cobertura por rubro ya se comunica en Sistema como capacidad verificable.

- [ ] **Step 4: Header — nav nuevo**
  ```ts
  const NAV = [
    { label: 'Probalo',    href: '#demo'        },
    { label: 'Diagnóstico', href: '#diagnostico' },
    { label: 'El sistema',  href: '#sistema'     },
    { label: 'Cómo arrancás', href: '#arrancar'  },
    { label: 'Precio',      href: '#precio'      },
  ];
  ```

- [ ] **Step 5: Footer — actualizar `PRODUCT_LINKS`** para que apunten a las secciones vivas (`#demo`, `#sistema`, `#arrancar`, `#precio`, `#faq`). Verificar que ningún link quede apuntando a un id que ya no existe.

- [ ] **Step 6: Verificar los anclajes**
  ```bash
  grep -rn 'href="#' src/components/Header.tsx src/components/Footer.tsx src/components/MobileMenu.tsx
  grep -rn 'id="' src/components/sections/
  ```
  Todo `href="#x"` debe tener su `id="x"`.

- [ ] **Commit:** `git commit -m "feat(landing): FAQ ampliada, historia ajustada y navegación nueva"`

---

### Task 20: Wiring de la página

**Files:**
- Rewrite: `src/App.tsx`

**Constraints:**
- El observer muerto ya se borró en la Task 4. `App` queda como composición pura.
- Orden exacto del spec.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Reescribir `src/App.tsx`**
  ```tsx
  import { Header } from '@/components/Header';
  import { Footer } from '@/components/Footer';
  import { Hero } from '@/components/sections/Hero';
  import { TrustStrip } from '@/components/sections/TrustStrip';
  import { Diagnostico } from '@/components/sections/diagnostico/Diagnostico';
  import { Historia } from '@/components/sections/Historia';
  import { Sistema } from '@/components/sections/Sistema';
  import { ComoArrancas } from '@/components/sections/ComoArrancas';
  import { Precio } from '@/components/sections/Precio';
  import { Faq } from '@/components/sections/Faq';

  export default function App() {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />
        <main>
          <Hero />
          <TrustStrip />
          <Diagnostico />
          <Historia />
          <Sistema />
          <ComoArrancas />
          <Precio />
          <Faq />
        </main>
        <Footer />
      </div>
    );
  }
  ```

- [ ] **Step 2: Verificar en el navegador** — `pnpm run dev`
  - Las 8 secciones renderizan en orden.
  - El demo funciona: cargar productos, cobrar, fiar, cerrar caja.
  - Viewport iPhone 12: el demo se ve sin scroll, ninguna sección desborda horizontalmente.
  - Navegación por teclado completa en el demo.

- [ ] **Commit:** `git commit -m "feat(landing): componer la página con el orden nuevo"`

---

# FASE 3 — Build y publicación

### Task 21: Prerender con `react-dom/static`

Cierra **F3 del audit SEO 2026-07-31**. Hoy el HTML servido es `<div id="root"></div>`: ClaudeBot, GPTBot y PerplexityBot no ejecutan JS y ven una página vacía.

**Files:**
- Create: `src/entry-server.tsx`
- Create: `scripts/prerender.ts`
- Create: `scripts/lib/build-jsonld.ts`
- Rewrite: `src/main.tsx`
- Modify: `index.html` (quitar los 3 JSON-LD hardcodeados)
- Modify: `package.json` (scripts de build)

**Constraints:**
- **Cero dependencias nuevas.** `prerenderToNodeStream` viene en `react-dom/static` de React 19.
- El JSON-LD se genera desde `pricing.ts`. Después de esta task, `24900` no puede aparecer en `index.html`.
- Ningún acceso a `window` / `document` en tiempo de render — solo dentro de `useEffect`.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Auditar accesos a `window` / `document` fuera de efectos**
  ```bash
  grep -rn "window\.\|document\." src/ --include="*.tsx" --include="*.ts" | grep -v "useEffect" | grep -v "\.test\."
  ```
  Todo hit debe estar dentro de un `useEffect` o un handler de evento. Si hay uno en el cuerpo de un componente, moverlo antes de seguir.

- [ ] **Step 2: Crear `src/entry-server.tsx`**
  ```tsx
  import App from './App';

  /** Árbol que se prerenderiza. Sin StrictMode: duplica el render y no aporta nada en build. */
  export function AppShell() {
    return <App />;
  }
  ```

- [ ] **Step 3: Crear `scripts/lib/build-jsonld.ts`**
  ```ts
  import { PLAN_PRICE_ARS } from '../../src/lib/pricing.ts';

  const SITE = 'https://www.bueninventario.com';

  /**
   * JSON-LD del sitio. Vive acá y no en index.html para que el precio
   * salga de la misma constante que la card de precio — una sola verdad.
   */
  export function buildJsonLd(): string {
    const blocks = [
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Buen Inventario',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: SITE,
        description:
          'Sistema de gestión para comercios de Argentina: ventas, stock, caja, cuentas corrientes y facturación electrónica.',
        offers: {
          '@type': 'Offer',
          price: String(PLAN_PRICE_ARS),
          priceCurrency: 'ARS',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Buen Inventario',
        url: SITE,
        logo: `${SITE}/icon-512.png`,
        areaServed: 'AR',
      },
    ];

    return blocks
      .map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
      .join('\n    ');
  }
  ```
  Nota: se dejan **dos** bloques, no tres. El `GroceryStore` de Don Néstor como entidad separada del sitio es conceptualmente raro (lo marcó el audit SEO, criterio 2) — se elimina.

- [ ] **Step 4: Crear `scripts/prerender.ts`**
  ```ts
  import { readFile, writeFile } from 'node:fs/promises';
  import { resolve } from 'node:path';
  import { prerenderToNodeStream } from 'react-dom/static';
  import { createElement } from 'react';
  import { AppShell } from '../dist-ssr/entry-server.js';
  import { buildJsonLd } from './lib/build-jsonld.ts';

  const DIST_HTML = resolve(import.meta.dirname, '../dist/index.html');
  const ROOT_MARKER = '<div id="root"></div>';

  async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
  }

  async function main(): Promise<void> {
    const started = Date.now();

    const { prelude } = await prerenderToNodeStream(createElement(AppShell));
    const appHtml = await streamToString(prelude);

    let html = await readFile(DIST_HTML, 'utf8');

    if (!html.includes(ROOT_MARKER)) {
      throw new Error(
        `[prerender] No se encontró "${ROOT_MARKER}" en dist/index.html. ` +
          'Si cambió el marcador, actualizar ROOT_MARKER.',
      );
    }

    html = html.replace(ROOT_MARKER, `<div id="root">${appHtml}</div>`);
    html = html.replace('</head>', `  ${buildJsonLd()}\n  </head>`);

    await writeFile(DIST_HTML, html, 'utf8');

    const kb = (Buffer.byteLength(appHtml, 'utf8') / 1024).toFixed(1);
    console.log(`[prerender] ${kb} KB de HTML inyectados en ${((Date.now() - started) / 1000).toFixed(2)}s`);
  }

  main().catch((err) => {
    console.error('[prerender] falló:', err);
    process.exit(1);
  });
  ```
  El `throw` si falta el marcador es deliberado: **el build debe romper**, no publicar en silencio una landing sin prerenderizar. Ese fue exactamente el modo de falla de F3.

- [ ] **Step 5: Reescribir `src/main.tsx`** — `createRoot` → `hydrateRoot`, y cablear el sink de analytics
  ```tsx
  import { StrictMode } from 'react';
  import { hydrateRoot } from 'react-dom/client';
  import { inject, track as vercelTrack } from '@vercel/analytics';
  import { injectSpeedInsights } from '@vercel/speed-insights';
  import './index.css';
  import App from './App.tsx';
  import { configureAnalyticsSink } from '@/lib/analytics';

  inject();
  injectSpeedInsights();
  configureAnalyticsSink((event, props) => vercelTrack(event, props));

  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <App />
    </StrictMode>,
  );
  ```
  Las dependencias de Vercel se instalan en la Task 22; si se ejecuta esta task antes, dejar el `configureAnalyticsSink` comentado y descomentarlo ahí.

- [ ] **Step 6: Quitar los 3 bloques JSON-LD de `index.html`** (líneas ~52, ~68, ~78). Los inyecta el prerender. Verificar que no queda ningún `application/ld+json` en el archivo fuente.

- [ ] **Step 7: Actualizar los scripts de `package.json`**
  ```json
  "build": "tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && tsx scripts/prerender.ts",
  "build:client": "vite build"
  ```
  Agregar `dist-ssr` a `.gitignore`.

- [ ] **Step 8: Verificar que el HTML servido tiene contenido real**
  ```bash
  pnpm run build
  grep -c "Probalo acá" dist/index.html          # ≥ 1
  grep -c "Tu rubro ya viene cargado" dist/index.html  # ≥ 1
  grep -o '"price":"24900"' dist/index.html      # el JSON-LD trae el precio de pricing.ts
  ```
  Si alguno da 0, el prerender no corrió.

- [ ] **Step 9: Verificar la hidratación en el navegador**
  ```bash
  pnpm run preview
  ```
  Abrir la consola: **no debe haber warnings de hydration mismatch**. El demo tiene que quedar interactivo.

  ⚠️ **Caso a vigilar:** `prerenderToNodeStream` espera a que resuelvan los boundaries de Suspense, así que el HTML estático probablemente contenga el demo ya renderizado (no el fallback). Eso es bueno — CLS 0 y contenido visible sin JS. En el cliente, React mantiene el HTML del servidor hasta que baja el chunk del demo, así que no debería haber mismatch. **Si aparecen warnings**, agregar `<link rel="modulepreload">` al chunk del demo en `index.html` para que baje en paralelo. No silenciar el warning con `suppressHydrationWarning`.

- [ ] **Commit:** `git commit -m "feat(landing): prerender con react-dom/static — cierra F3 del audit SEO"`

---

### Task 22: Medición

Hoy la landing no mide nada. Sin esto, el objetivo del rediseño ("que convierta más") es inverificable.

**Files:**
- Modify: `package.json` (deps)
- Modify: `src/main.tsx` (activar el sink)
- Modify: `src/components/sections/Faq.tsx`, `Precio.tsx`, `Sistema.tsx`, `Footer.tsx` (eventos de WhatsApp)

**Constraints:**
- Ningún componente importa `@vercel/analytics` — solo `main.tsx`. Todo lo demás usa `track()` del adapter.
- Sin cookies, sin banner de consentimiento.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Instalar**
  ```bash
  pnpm add @vercel/analytics @vercel/speed-insights
  ```

- [ ] **Step 2: Activar el sink en `main.tsx`** (descomentar lo de la Task 21, Step 5).

- [ ] **Step 3: Instrumentar los CTAs restantes** — cada `<a>` a WhatsApp llama `track('cta_whatsapp_clicked', { section })` con `section` igual a `'precio'`, `'faq'` o `'footer'`. Cada CTA de signup que no sea el del hero llama `track('cta_signup_clicked', { section })` con `'sistema'` o `'precio'`.

- [ ] **Step 4: Verificar los 5 eventos**
  ```bash
  grep -rn "track(" src/ --include="*.tsx" | grep -v "\.test\."
  ```
  Deben aparecer los cinco: `demo_started`, `demo_sale_completed`, `demo_chapter_viewed`, `cta_signup_clicked`, `cta_whatsapp_clicked`.

- [ ] **Step 5: Verificar en el navegador** con `pnpm run preview` y la pestaña Network: al tocar un producto del demo debe salir un beacon de analytics.

- [ ] **Commit:** `git commit -m "feat(landing): medición de conversión vía adapter"`

---

### Task 23: Legales reales

Cierra **F4 del audit SEO**. `public/privacidad.html` y `public/terminos.html` dicen "se completará antes de la puesta en producción" desde mayo. Es un hueco legal: ARCA y Mercado Pago requieren términos y política publicados para uso comercial.

**Files:**
- Rewrite: `public/privacidad.html`
- Rewrite: `public/terminos.html`
- Modify: `public/sitemap.xml`

**Constraints:**
- Cada página con `<title>`, `<meta description>`, `<link rel="canonical">` y OG propios.
- Estilo consistente con la landing (fuentes self-hosted, tokens editoriales).
- **El texto queda marcado para revisión del titular antes del deploy.** No se publica texto legal sin que Néstor lo lea.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Escribir `public/privacidad.html`** cubriendo: qué datos se recolectan (cuenta, datos del comercio, datos operativos cargados por el usuario), para qué se usan, dónde se almacenan (AWS), retención, derechos del titular bajo **Ley 25.326** de Protección de Datos Personales, cómo ejercerlos, uso de cookies (solo analytics sin cookies), y contacto (`nestorb@bueninventario.com`). Jurisdicción: Argentina.

- [ ] **Step 2: Escribir `public/terminos.html`** cubriendo: descripción del servicio, cuenta y responsabilidad del usuario, período de prueba de 30 días sin tarjeta, precio y facturación vía Mercado Pago, cancelación (sin penalidad, efectiva al fin del período pago), propiedad de los datos del usuario y exportación, disponibilidad del servicio sin SLA contractual, limitación de responsabilidad, y ley aplicable argentina.

- [ ] **Step 3: Actualizar `public/sitemap.xml`** — tres URLs con `<lastmod>` real, **sin** `priority` ni `changefreq` (Google los ignora)
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://www.bueninventario.com/</loc><lastmod>2026-09-04</lastmod></url>
    <url><loc>https://www.bueninventario.com/privacidad</loc><lastmod>2026-09-04</lastmod></url>
    <url><loc>https://www.bueninventario.com/terminos</loc><lastmod>2026-09-04</lastmod></url>
  </urlset>
  ```

- [ ] **Step 4: 🚩 BLOQUEANTE — pedir revisión del titular.** No mergear sin que Néstor lea ambos textos.

- [ ] **Commit:** `git commit -m "feat(landing): términos y privacidad reales — cierra F4 del audit SEO"`

---

### Task 24: 🚩 Verificaciones bloqueantes

Estas verificaciones existen porque la landing hace afirmaciones públicas. Ninguna se puede saltear.

**Files:**
- Modify: `src/lib/facts.ts` (si el conteo real difiere)
- Modify: `src/components/sections/Faq.tsx` (si PITR está activo)

**Constraints:**
- **Ningún número se publica sin verificar contra producción.**

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Contar los ítems reales del catálogo en producción**
  Consultar la tabla del catálogo maestro por rubro en DynamoDB producción y obtener el conteo total. Comparar con `CATALOG_ITEMS = 29800` en `src/lib/facts.ts`.
  - Si la diferencia es **≤ 5%**: dejar el valor redondeado como está.
  - Si es **> 5%**: actualizar la constante al valor real redondeado hacia abajo al centenar.
  - Actualizar también el copy de Sistema y Cómo arrancás si el orden de magnitud cambió (hoy dicen "casi 30.000").

- [ ] **Step 2: Verificar Point-in-Time Recovery en las tablas de producción**
  ```bash
  aws dynamodb describe-continuous-backups --table-name <tabla> \
    --query 'ContinuousBackupsDescription.PointInTimeRecoveryDescription.PointInTimeRecoveryStatus'
  ```
  - Si **ENABLED** en todas las tablas de datos de usuario: sumar a la respuesta del FAQ la frase `Hay copia de seguridad automática.`
  - Si **DISABLED**: **no** agregar la frase. Habilitarlo es un cambio de infra que va por su propio camino; la landing no promete lo que no está activo.

- [ ] **Step 3: Re-verificar el precio de la competencia** — abrir `xubio.com/ar` y confirmar que el plan más barato sigue arriba de `COMPETITOR_FLOOR_ARS`. Si bajó, ajustar la constante o quitar la línea de comparación. Publicar una comparación desactualizada es tan malo como inventarla.

- [ ] **Step 4: 🚩 Confirmar el estado del precio en Mercado Pago** — la landing publica `$24.900`. Verificar si el `preapproval_plan` ya está sincronizado. Si sigue en `$14.900`, **decisión explícita** de Néstor: sincronizar antes de publicar, o aceptar la ventana de inconsistencia a sabiendas.

- [ ] **Commit:** `git commit -m "chore(landing): verificar contra producción los datos publicados"`

---

### Task 25: OG image y STANDARDS del repo

**Files:**
- Modify: `scripts/templates/` (template de la OG image)
- Create: `docs/reference/STANDARDS.md`

**Constraints:**
- La OG image toma el precio de `pricing.ts`, no hardcodeado.
- 1200×630, < 200KB, contenido crítico en la safe zone central 1080×600.

**Multi-tenant impact:** N/A.

- [ ] **Step 1: Actualizar el template de la OG image** con el copy nuevo del hero (`No te pido que me creas. Probalo acá.`) y el precio desde `PLAN_PRICE_ARS`.

- [ ] **Step 2: Regenerar**
  ```bash
  pnpm run generate:assets
  ls -la public/og-image.png   # < 200KB
  ```
  Los favicons y app icons **no se tocan** — se resolvieron el 2026-08-01.

- [ ] **Step 3: Crear `docs/reference/STANDARDS.md`** — es el único de los cinco repos sin standards propios. Documentar lo que efectivamente rige acá: stack real (React 19 · Vite 7 · Tailwind 3 · TS strict), estructura de directorios, el sistema de diseño editorial con sus tokens, los límites de tamaño de componentes, las reglas de mobile-first y touch targets, el performance budget, el pipeline de prerender y de assets, **y la restricción de honestidad** (prohibido publicar señales de adopción). Esta última es la regla más importante del repo y hoy no está escrita en ningún lado del código.

- [ ] **Step 4: Verificación final completa**
  ```bash
  pnpm run typecheck && pnpm run lint && pnpm run test && pnpm run build
  ```

- [ ] **Commit:** `git commit -m "feat(landing): OG image nueva y STANDARDS del repo"`

---

## Checklist final de aceptación

Antes de mergear, verificar **todo** el checklist de la sección 17 del design spec. Los puntos que más se olvidan:

- [ ] `curl -s https://<preview>/ | grep "Probalo acá"` devuelve resultado — el HTML servido tiene contenido, no `<div id="root">` vacío
- [ ] No hay ninguna señal de adopción (clientes, logos, testimonios, estrellas) en toda la página
- [ ] `grep -rn "24900" src/ | grep -v pricing` devuelve vacío
- [ ] El conteo del catálogo fue verificado contra producción
- [ ] El FAQ no promete backups salvo que PITR esté verificado como activo
- [ ] El demo no hace ninguna request de red
- [ ] Los 7 tests de `DemoWidget` y los 10 de `useSale` pasan
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95
- [ ] CLS = 0 · LCP < 2,0s en 4G simulado
- [ ] Viewport iPhone 12: demo visible sin scroll, sin desborde horizontal
- [ ] Términos y privacidad revisados por Néstor
