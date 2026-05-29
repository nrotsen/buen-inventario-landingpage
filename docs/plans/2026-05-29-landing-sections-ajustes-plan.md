# Landing — Ajustes y secciones nuevas · Implementation Plan

> **Para agentic workers:** Usar `bi-execute` para implementar este plan task-by-task. Los steps usan checkbox syntax (`- [ ]`) para tracking. Cada task termina en commit checkpoint y deja la landing en estado deployable.

**Goal:** Implementar los 6 ajustes/rewrites post-launch aprobados en el design del 2026-05-29: rename nav `Excel`→`Diagnóstico`, rewrite de Historia (founder tipográfica sin foto), nueva sección comparativa Excel vs BI, rewrite de Precio (sin número), rewrite de FAQ (5 Q&As nuevas + ícono ChevronRight), y extensión del footer (Facebook + TikTok).

**Architecture:** Single-page React 19 + Vite 7 + Tailwind 3, sin routing, sin data layer, sin auth. La landing v1 está en producción desde 2026-05-28. Este plan reescribe 3 secciones, suma 1 sección nueva, ajusta 4 archivos shell, y limpia 1 asset huérfano. Cero deps nuevas, cero rebuilds de primitives. Cada task deja la landing en estado consistente y commiteable.

**Tech Stack:** React 19.1, Vite 7.1, Tailwind 3.4, TypeScript 5.8 strict, lucide-react, path alias `@/*` (configurado en `tsconfig.app.json` + `vite.config.ts`). Lockfile `pnpm-lock.yaml` autoritativo.

**Spec source:** `docs/plans/2026-05-29-landing-sections-ajustes-design.md` (aprobado 2026-05-29, commit `25d3ce9`).
**Mockups aprobados:**
- `/Users/nestorberlanga/Desktop/Buen Inventario/mockups/landing-historia-2026-05-29.html`
- `/Users/nestorberlanga/Desktop/Buen Inventario/mockups/landing-comparativa-excel-2026-05-29.html`

---

## Standards aplicables (extraídos de `buen-inventario-webs/docs/reference/STANDARDS.md` + memoria de proyecto)

El repo `buen-inventario-landingpage` NO tiene STANDARDS.md propio ni `.claude/rules/`. Aplicamos las reglas del sibling público (`buen-inventario-webs`) y las decisiones canónicas del plan v1 (`2026-05-28-landing-redesign-plan.md`):

- **File sizes**: page ≤200 LOC, component ≤150 LOC, lib ≤150 LOC. (Histórico actual del repo: todos los `sections/*` están entre 60–110 LOC; mantener ese rango.)
- **Naming**: PascalCase para components (`Historia.tsx`, `Diagnostico.tsx`, `ExcelComparison.tsx`), kebab/dot para libs (`contact.ts`).
- **TypeScript**: `strict: true` (configurado). Cero `any`, cero `as any`. Types explícitos en props y returns.
- **Path alias**: `@/*` configurado. **Todos los imports cross-directory usan `@/`**. Imports relativos solo dentro de la misma carpeta inmediata (no aplica en este plan).
- **React patterns**: functional components only. Sin `useState` para nada serializable (no aplica acá — todo es estático). `useMemo`/`useCallback` solo si performance medible.
- **Mobile-first**: viewport iPhone 12 (390×844) como baseline obligatorio. Touch targets ≥44px (botones existentes usan `h-11`/`h-[52px]` — sin cambios). Body text ≥16px (heredamos `text-body-md`/`text-body-lg` tokens).
- **Performance**: Lighthouse mobile ≥90. Cero deps nuevas. Cleanup de `public/nestor-portrait.png` (~200 KB) ahorra bundle weight. Cero JS adicional (FAQ sigue usando `<details>` nativo).
- **SEO**: `<title>`/meta/OG/JSON-LD ya configurados en `index.html` (sin cambios — no tocamos pages SEO-críticas). Confirmamos en Task 11 que `nestor-portrait.png` no tiene preload tag en `index.html` (verificado con grep — solo dmserif + inter están preloaded).
- **Accesibilidad**: contraste WCAG AA validado en design (paleta real del repo pasa AA Normal). `<details>`/`<summary>` nativos en FAQ (a11y por defecto). `prefers-reduced-motion: reduce` ya respetado en `index.css`.
- **Anti-patrones prohibidos en este plan**:
  - `axios` directo en componentes — N/A (no hay HTTP)
  - `useState` para forms — N/A (no hay forms)
  - `border-radius > 6px` — prohibido por el editorial duro
  - `box-shadow` con `blur > 0` — solo hard offset shadows con teal
  - Gradients en background o text — prohibidos
  - Stock photos / illustraciones genéricas — prohibidos
  - Emojis decorativos (incluye ✓/✗ en la comparativa) — prohibidos
- **Red words prohibidos en código y plan**: `TODO`, `FIXME`, `later`, `for now`, `por ahora`, `después lo veo`, `MVP`, `simplified`, `versión simple`, `Round N`, `future phase`, `deferred`, `coexist`, `gradual migration`, `reserved for`, `ready for`, `easy to add later`, `just add`, `out of scope`, `pending implementation`. **Self-audit pre-merge obligatorio (Task 12).**

## Operational Rules (REQUIRED)

- **Multi-tenant**: N/A — landing es single-tenant (la company ES Buen Inventario). Sin company_id boundary.
- **NEVER commitear** `.env` ni `.env.*`.
- **Lockfile autoritativo**: `pnpm-lock.yaml`. Usar `pnpm dev / build / lint` en todos los pasos de verificación.
- **Verificación visual obligatoria**: iPhone 12 (390×844) baseline + desktop (≥768px) antes de declarar UI complete por task.
- **Commit por task**: cada task termina con `git commit` con mensaje conventional (`feat(landing)`, `refactor(landing)`, `chore(landing)`).
- **No `--no-verify` ni `--amend`** — si un hook falla, fix root cause y nuevo commit.

---

## Decisiones de implementación (fijas, no re-debatir)

Las 3 decisiones aprobadas en Challenge Report del 2026-05-29:

1. **Rename de archivo Excel.tsx → Diagnostico.tsx** — coherente con el cambio de id de sección + label de nav. El export pasa de `Excel` a `Diagnostico`. Usar `git mv` para preservar history. Se actualiza el import en `App.tsx` en la misma task.
2. **scroll-mt global en Section.tsx** — agregar `scroll-mt-20 md:scroll-mt-24` al wrapper `<section>` de `Section.tsx` preventivamente. Beneficia las 7 secciones de una sola vez, previene overlap del sticky header (h-16 mobile / h-[76px] desktop) en cualquier nav click.
3. **Lockfile pnpm** — `pnpm dev / build / lint` para toda verificación. `npm` queda banned para este repo (consistencia con plan v1).

Decisiones complementarias que surgen de la lectura final del repo (Task 11):

4. **`nestor-portrait.png` NO tiene preload en `index.html`** — verificado con grep. La task de cleanup solo borra el `.png`, no toca `index.html`.
5. **`text-teal-500` para `italicAccent` queda como está** — `DisplayHeading.tsx` ya lo aplica por default y commit `5d7f96b` validó a11y de los micro-labels teal. El italic accent es elemento decorativo grande (display heading ≥36px desktop) que califica como AA Large (3:1) — pasa.
6. **`Button as="a"` con `target="_blank"` requiere `rel="noopener noreferrer"`** — ya es el pattern del repo (Footer.tsx, Faq.tsx). Lo replicamos en el CTA de WhatsApp del nuevo Precio y en los 2 nuevos rows del Footer.

---

## File Structure Map

| File | Acción | LOC objetivo | Owner del cambio |
|---|---|---|---|
| `src/lib/contact.ts` | EDIT (sumar 2 helpers) | actual 28 → ~40 LOC | Task 1 |
| `src/components/ui/Section.tsx` | EDIT (scroll-mt) | actual 47 → 47 LOC | Task 2 |
| `src/components/sections/Historia.tsx` | REWRITE | actual 46 → ~50 LOC | Task 3 |
| `src/components/sections/Diagnostico.tsx` | RENAME desde `Excel.tsx` + EDIT id/nombre export | actual 88 → 88 LOC | Task 4 |
| `src/App.tsx` | EDIT (import rename + wire ExcelComparison) | actual 53 → ~55 LOC | Tasks 4 y 5 |
| `src/components/sections/ExcelComparison.tsx` | **NEW** | 0 → ~140 LOC | Task 5 |
| `src/components/sections/Sistema.tsx` | EDIT (CTA secundario) | actual 99 → 99 LOC | Task 6 |
| `src/components/sections/Precio.tsx` | REWRITE | actual 58 → ~50 LOC | Task 7 |
| `src/components/sections/Faq.tsx` | REWRITE | actual 66 → ~70 LOC | Task 8 |
| `src/index.css` | EDIT (faq-icon rotation 45deg → 90deg) | actual 93 → 93 LOC | Task 8 |
| `src/components/Header.tsx` | EDIT (NAV array) | actual 64 → 64 LOC | Task 9 |
| `src/components/Footer.tsx` | EDIT (sumar Facebook + TikTok rows) | actual 89 → ~99 LOC | Task 10 |
| `public/nestor-portrait.png` | DELETE | ~200 KB → 0 KB | Task 11 |

**Total: 11 EDITs + 1 NEW + 1 DELETE.**

### Boundaries explícitos

- **`lib/contact.ts`**: único entry point para URLs externas (WhatsApp, email, Instagram, **Facebook**, **TikTok**). Funciones puras, sin side-effects. Componentes nunca hard-codean URLs externas.
- **`ui/Section.tsx`**: wrapper de section con tone/width/scroll-mt. Único responsable del padding/spacing externo de cualquier sección.
- **`sections/*.tsx`**: cada sección es self-contained. Importa solo de `@/components/ui/*` y `@/lib/*`. Cero imports cross-section.
- **`App.tsx`**: composición de secciones + IntersectionObserver para fade-in al scroll. Sin lógica de negocio.

### Multi-tenant impact: N/A

Landing pública estática, sin company boundary.

---

# TASKS

## Phase 1 — Foundation (cero impacto visual, dependencies cero)

### Task 1: `lib/contact.ts` — sumar `facebookLink()` + `tiktokLink()` helpers

**Files:**
- Modify: `src/lib/contact.ts:1-28`

**Constraints:**
- Funciones puras: in → string URL. Cero side-effects.
- Constantes top-level en SCREAMING_SNAKE_CASE consistente con `WHATSAPP_NUMBER`/`EMAIL`/`INSTAGRAM_HANDLE`.
- TikTok queda con URL `https://www.tiktok.com` hasta que exista la cuenta `@bueninventario`. Cuando exista, el swap es de 1 línea en este file — el `Footer.tsx` no se toca.
- Exportar el constante `CONTACT` actualizado con `facebook` y `tiktok` keys para coherencia del adapter.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar el contenido completo del archivo:
  ```ts
  const WHATSAPP_NUMBER = '5491122775850';
  const EMAIL = 'hola@bueninventario.com';
  const INSTAGRAM_HANDLE = 'bueninventario';
  const FACEBOOK_HANDLE = 'bueninventario';
  const TIKTOK_URL = 'https://www.tiktok.com';

  export function whatsappLink(message?: string): string {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    if (!message) return base;
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  export function mailtoLink(subject?: string, body?: string): string {
    const base = `mailto:${EMAIL}`;
    const params: string[] = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    return params.length ? `${base}?${params.join('&')}` : base;
  }

  export function instagramLink(): string {
    return `https://instagram.com/${INSTAGRAM_HANDLE}`;
  }

  export function facebookLink(): string {
    return `https://facebook.com/${FACEBOOK_HANDLE}`;
  }

  export function tiktokLink(): string {
    return TIKTOK_URL;
  }

  export const CONTACT = {
    whatsapp: WHATSAPP_NUMBER,
    email: EMAIL,
    instagram: INSTAGRAM_HANDLE,
    facebook: FACEBOOK_HANDLE,
    tiktok: TIKTOK_URL,
  } as const;
  ```
- [ ] **Step 2:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add facebookLink and tiktokLink helpers in lib/contact"`

---

### Task 2: `ui/Section.tsx` — scroll-margin global para anchors

**Files:**
- Modify: `src/components/ui/Section.tsx:36-44`

**Constraints:**
- Mantener API existente (`tone`, `width`, `id`, `className`, `innerClassName`).
- Sumar `scroll-mt-20 md:scroll-mt-24` al wrapper `<section>`. Razón documentada en el design doc § Decisiones de raíz #2.
- Valor del scroll-mt: 20 (80px) en mobile → cubre header h-16 (64px) + 16px de aire visual. md:24 (96px) → cubre header md:h-[76px] + 20px de aire visual.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Modificar el `<section>` wrapper en `Section.tsx`. Reemplazar el className:
  ```tsx
  // ANTES (línea 39):
  className={cn('py-24 md:py-36 px-6 md:px-10', toneClasses[tone], className)}

  // DESPUÉS:
  className={cn(
    'scroll-mt-20 md:scroll-mt-24 py-24 md:py-36 px-6 md:px-10',
    toneClasses[tone],
    className
  )}
  ```
- [ ] **Step 2:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 3:** Verificación manual en dev server. Levantar dev y clickear cada anchor del header — confirmar que el título de la sección target queda visible bajo el sticky header (no oculto):
  ```bash
  pnpm dev
  # abrir http://localhost:5173 y clickear Historia / Excel (todavía Excel) / Sistema / Precio / FAQ
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add scroll-margin to Section wrapper for sticky header offset"`

---

## Phase 2 — Sección rewrites (cada commit deja la landing en estado consistente)

### Task 3: `sections/Historia.tsx` — REWRITE founder section tipográfica (sin foto)

**Files:**
- Rewrite: `src/components/sections/Historia.tsx:1-46`

**Constraints:**
- Cero foto, cero ilustración, cero grid 2-columnas. Composición tipográfica pura.
- Borrar imports de `PhotoFrame` y referencia a `/nestor-portrait.png`. La eliminación del archivo PNG se hace en Task 11.
- Borrar firma "— Néstor B." + "Fundador · Buen Inventario" (redundante con location final).
- 1 columna centrada, `max-w-[640px]` interno (más apretado que el `width="reading"` default).
- Padding vertical aumentado: `py-32 md:py-48` (override del `py-24 md:py-36` default de `Section`).
- DM Serif 44px mobile / 64px desktop con leading 1.04, tracking -0.015em.
- Cursiva turquesa "Y este sistema lo hice para mí primero": 28px mobile / 36px desktop, `text-teal-700` (no teal-500, porque acá es texto explicativo en bloque, no italicAccent de un heading).
- Body: `text-body-lg` Inter, align left en mobile, center en desktop. Max-width interno `max-w-[56ch]` mx-auto.
- Divider fino teal: 80×1px, `bg-teal-700/60`, separador entre body y location.
- Tone: `cream` (mantener — ritmo visual del sitio).

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar el contenido completo del archivo:
  ```tsx
  import { Section } from '@/components/ui/Section';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';

  export function Historia() {
    return (
      <Section id="historia" tone="cream" width="reading" className="py-32 md:py-48">
        <div className="max-w-[640px] mx-auto text-center">
          <EditorialMicro>Por qué existe Buen Inventario</EditorialMicro>

          <DisplayHeading
            level={2}
            className="mt-7 text-[44px] md:text-[64px] leading-[1.04] tracking-[-0.015em]"
          >
            Yo también tengo un almacén.
          </DisplayHeading>

          <p className="editorial-italic text-[28px] md:text-[36px] leading-snug text-teal-700 mt-4 md:mt-5">
            Y este sistema lo hice para mí primero.
          </p>

          <div className="mt-14 md:mt-[72px] text-left md:text-center space-y-5 md:space-y-6">
            <p className="text-body-lg md:text-[19px] text-ink/85 leading-relaxed max-w-[56ch] mx-auto">
              Soy Néstor. Tengo Don Néstor Despensa, un almacén de barrio con un empleado. Durante años trabajé "a ojo" — no sabía qué se vendía más, cuánto me robaban, ni cuánto ganaba de verdad.
            </p>
            <p className="text-body-lg md:text-[19px] text-ink/85 leading-relaxed max-w-[56ch] mx-auto">
              Buen Inventario lo armé para resolver eso en mi propio negocio. Hoy lo uso todos los días, y lo comparto con otros comerciantes que también quieran dejar de adivinar.
            </p>
          </div>

          <div className="mx-auto mt-16 md:mt-[88px] w-20 h-px bg-teal-700/60" aria-hidden="true" />
          <p className="mt-6 editorial-micro">
            Don Néstor Despensa · Almacén de barrio · Argentina
          </p>
        </div>
      </Section>
    );
  }
  ```
- [ ] **Step 2:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 3:** Verificación visual en dev server:
  - `pnpm dev` y abrir http://localhost:5173/#historia
  - Mobile (iPhone 12 DevTools): título ~44px, 2 párrafos legibles left-aligned, divider visible, location en mono caps.
  - Desktop (≥768px): título ~64px, párrafos centered, divider centered.
  - Confirmar: sin foto, sin "— Néstor B.", sin firma "Fundador · Buen Inventario". El layout existente con grid de 2 columnas debe haber desaparecido completamente.
- [ ] **Commit:** `git commit -m "refactor(landing): rewrite Historia as centered typographic founder section without portrait"`

---

### Task 4: Rename `Excel.tsx` → `Diagnostico.tsx` + update id + update App import

**Files:**
- Rename via git: `src/components/sections/Excel.tsx` → `src/components/sections/Diagnostico.tsx`
- Modify (post-rename): `src/components/sections/Diagnostico.tsx:53-55` (id + export name)
- Modify: `src/App.tsx:6` (import) + `src/App.tsx:43` (uso)

**Constraints:**
- `git mv` preserva history del file (importante: el componente tiene autoría reciente).
- Cambiar el nombre del export de `Excel` a `Diagnostico`.
- Cambiar el `id` de la `<Section>` de `"excel"` a `"diagnostico"`.
- Mantener el resto del componente intacto (estructura de los 5 fears, eyebrow "El diagnóstico" ya existente, etc.).
- `App.tsx` se actualiza en la misma task para no dejar build broken.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Rename del archivo preservando git history:
  ```bash
  git mv src/components/sections/Excel.tsx src/components/sections/Diagnostico.tsx
  ```
- [ ] **Step 2:** Editar `src/components/sections/Diagnostico.tsx` — cambiar id de section + nombre de export:
  ```tsx
  // ANTES (línea 53):
  export function Excel() {
    return (
      <Section id="excel" tone="paper" width="editorial">

  // DESPUÉS:
  export function Diagnostico() {
    return (
      <Section id="diagnostico" tone="paper" width="editorial">
  ```
  Resto del archivo queda igual (los 5 fears: Robo interno, Ganancia real, Cuenta corriente, Stock muerto, Medios de cobro).
- [ ] **Step 3:** Editar `src/App.tsx` línea 6 (import) y línea 43 (uso):
  ```tsx
  // ANTES línea 6:
  import { Excel } from '@/components/sections/Excel';

  // DESPUÉS línea 6:
  import { Diagnostico } from '@/components/sections/Diagnostico';

  // ANTES línea 43:
  <Excel />

  // DESPUÉS línea 43:
  <Diagnostico />
  ```
- [ ] **Step 4:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 5:** Verificación visual: la sección Diagnóstico se sigue renderizando idéntica visualmente, pero el id es ahora `#diagnostico`. Probar `http://localhost:5173/#diagnostico` — scroll y posicionamiento correctos (heredan el `scroll-mt` de Task 2).
- [ ] **Commit:** `git commit -m "refactor(landing): rename Excel section to Diagnostico (id + filename + export)"`

---

### Task 5: NEW `sections/ExcelComparison.tsx` + wire en `App.tsx`

**Files:**
- Create: `src/components/sections/ExcelComparison.tsx`
- Modify: `src/App.tsx` (sumar import + render entre `<Diagnostico />` y `<Sistema />`)

**Constraints:**
- ≤150 LOC (target ~140 LOC).
- Tabla nativa `<table>` en desktop (≥md), cards apiladas en mobile (<md). Mismo componente, dos layouts con `hidden md:table` y `md:hidden`.
- Diferenciación de columna BI:
  - Header de columna: `text-teal-700 font-medium` (vs `text-text-muted font-normal` en Característica/Excel).
  - Celda BI: `bg-teal-50/40` + `border-l-2 border-teal-700/40` + `text-ink font-medium` + bullet `•` text-teal-700 bold.
  - Celda Excel: `text-text-muted font-normal` (jerarquía).
  - Nombre de feature (col 1 desktop / heading mobile): `editorial-display` (DM Serif).
- **Cero `✓`/`✗`, cero emojis decorativos** (red word del repo).
- Tone: `paper`. Width: `editorial` (880px max).
- Items: 6 rows cerrados según design § "Comparativa contra Excel".
- HTML semántico: `<table>` con `<thead>`/`<tbody>` real en desktop, `<article>` por feature en mobile.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear `src/components/sections/ExcelComparison.tsx`:
  ```tsx
  import { Section } from '@/components/ui/Section';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';

  type Row = {
    feature: string;
    excel: string;
    bi: string;
  };

  const ROWS: Row[] = [
    {
      feature: 'Stock actualizado al instante',
      excel: 'Manual, casi nunca se hace',
      bi: 'Sí, con cada venta',
    },
    {
      feature: 'Saber qué clientes te deben y cuánto',
      excel: 'Cuaderno aparte, otro Excel',
      bi: 'Integrado, por cliente',
    },
    {
      feature: 'Cierre de caja con totales por método',
      excel: 'A mano, calculadora, rezar',
      bi: 'Automático en 30 segundos',
    },
    {
      feature: 'Detectar productos que no rotan',
      excel: 'Difícil de cruzar',
      bi: 'Te lo muestra solo',
    },
    {
      feature: 'Acceso desde cualquier dispositivo',
      excel: 'No, archivo en una sola PC',
      bi: 'Sí, desde el celular',
    },
    {
      feature: 'Histórico que no se pierde',
      excel: 'Riesgo alto (archivos, USB)',
      bi: 'Siempre accesible, online',
    },
  ];

  export function ExcelComparison() {
    return (
      <Section id="comparativa" tone="paper" width="editorial">
        <div className="max-w-[720px]">
          <EditorialMicro>La diferencia</EditorialMicro>
          <DisplayHeading
            level={2}
            italicAccent={<>no alcanza</>}
            className="mt-5 max-w-[18ch]"
          >
            ¿Por qué
          </DisplayHeading>
          <p className="mt-6 text-body-lg text-ink/75 max-w-[56ch] leading-relaxed">
            Lo mismo que ya hacés a mano, hecho una sola vez y bien — sin discusión, sin recalcular, sin perderte cosas en el camino.
          </p>
        </div>

        {/* DESKTOP TABLE (≥md) */}
        <table className="hidden md:table mt-16 w-full border-collapse border-t-hard border-b-hard border-ink">
          <thead>
            <tr>
              <th className="text-left py-5 pr-6 w-[38%] editorial-micro font-normal border-b border-border-subtle">
                Característica
              </th>
              <th className="text-left py-5 pr-6 w-[31%] editorial-micro font-normal border-b border-border-subtle">
                Excel / Cuaderno
              </th>
              <th className="text-left py-5 pl-6 pr-6 w-[31%] editorial-micro font-medium !text-teal-700 border-b border-border-subtle">
                Buen Inventario
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const isLast = i === ROWS.length - 1;
              const borderClass = isLast ? '' : 'border-b border-dashed border-border-subtle';
              return (
                <tr key={row.feature}>
                  <td className={`py-5 pr-6 editorial-display text-[18px] leading-snug align-top ${borderClass}`}>
                    {row.feature}
                  </td>
                  <td className={`py-5 pr-6 text-body-md text-text-muted align-top ${borderClass}`}>
                    {row.excel}
                  </td>
                  <td className={`py-5 pl-6 pr-6 text-body-md text-ink font-medium align-top bg-teal-50/40 border-l-2 border-teal-700/40 ${borderClass}`}>
                    <span className="text-teal-700 font-bold mr-1">•</span>
                    {row.bi}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* MOBILE CARDS (<md) */}
        <div className="md:hidden mt-12 border-t-hard border-ink">
          {ROWS.map((row, i) => {
            const isLast = i === ROWS.length - 1;
            const outerBorder = isLast ? 'border-b-hard border-ink' : 'border-b border-dashed border-border-subtle';
            return (
              <article key={row.feature} className={`py-7 ${outerBorder}`}>
                <h3 className="editorial-display text-[20px] leading-snug text-ink mb-4">
                  {row.feature}
                </h3>
                <div className="grid grid-cols-[88px_1fr] gap-3 py-3 items-baseline">
                  <span className="editorial-micro !text-[10px]">Excel</span>
                  <span className="text-body-sm text-text-muted leading-relaxed">{row.excel}</span>
                </div>
                <div className="grid grid-cols-[88px_1fr] gap-3 py-3 -mx-3 pl-3 pr-3 border-l-2 border-teal-700/40 bg-teal-50/40 items-baseline border-t border-dashed border-border-subtle">
                  <span className="editorial-micro !text-[10px] !text-teal-700">B. Inventario</span>
                  <span className="text-body-sm text-ink font-medium leading-relaxed">
                    <span className="text-teal-700 font-bold mr-1">•</span>
                    {row.bi}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </Section>
    );
  }
  ```
- [ ] **Step 2:** Wire en `src/App.tsx`. Sumar import:
  ```tsx
  // En el bloque de imports (después de Diagnostico, antes de Sistema):
  import { ExcelComparison } from '@/components/sections/ExcelComparison';
  ```
  Y sumar el render entre `<Diagnostico />` y `<Sistema />`:
  ```tsx
  // ANTES:
  <Diagnostico />
  <Sistema />

  // DESPUÉS:
  <Diagnostico />
  <ExcelComparison />
  <Sistema />
  ```
- [ ] **Step 3:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 4:** Verificación visual:
  - `pnpm dev`
  - Desktop (≥768px): tabla 3 columnas, columna BI con bg sutil + border-left teal + bullet • text-teal-700. Headers en eyebrow caps, columna BI eyebrow en teal-700 medium.
  - Mobile (iPhone 12 DevTools): tabla desktop oculta, 6 cards apiladas. Cada card: nombre feature DM Serif, row Excel gris medio, row BI con bg + border-left + bullet.
  - **NO debe haber checkmarks ✓ ni cruces ✗ visibles. Cero emojis.**
- [ ] **Commit:** `git commit -m "feat(landing): add ExcelComparison section with desktop table + mobile cards"`

---

### Task 6: `sections/Sistema.tsx` — CTA secundario del cierre

**Files:**
- Modify: `src/components/sections/Sistema.tsx:89-91`

**Constraints:**
- Cambio mecánico de 2 atributos: `href` y children del segundo Button del cierre.
- Mantener el primer Button ("Probalo gratis →") intacto.
- Mantener resto del archivo intacto (las 3 capturas, eyebrow, displayHeading, etc.).

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Modificar el bloque del CTA secundario en `Sistema.tsx`:
  ```tsx
  // ANTES (líneas 89-91):
  <Button as="a" href="#precio" variant="ghost-on-dark" size="lg" className="sm:min-w-[200px]">
    Ver el precio
  </Button>

  // DESPUÉS:
  <Button as="a" href="#faq" variant="ghost-on-dark" size="lg" className="sm:min-w-[200px]">
    Ver las dudas comunes
  </Button>
  ```
- [ ] **Step 2:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 3:** Verificación visual: scroll al cierre de Sistema (post 3 capturas), confirmar botón ghost dice "Ver las dudas comunes" y al clickear lleva a `#faq` con scroll-mt correcto.
- [ ] **Commit:** `git commit -m "refactor(landing): point Sistema closing secondary CTA to FAQ"`

---

### Task 7: `sections/Precio.tsx` — REWRITE minimalista (sin número)

**Files:**
- Rewrite: `src/components/sections/Precio.tsx:1-58`

**Constraints:**
- Sacar la card con `$14.900/mes` + lista de 6 features. Reset total.
- Sin import de `FEATURES` ni de `Plan único` eyebrow.
- 2 CTAs: primario "Probalo gratis →" (signupUrl()) y ghost "Escribime por WhatsApp" (whatsappLink con mensaje pre-llenado).
- Tone: `paper`, Width: `reading`, innerClassName: `text-center`.
- Heading: "Cuando estés convencido,\nhablamos" + italicAccent `de plata.`.
- Copy honesto cerrado en el design.
- Micro caps al pie: "Sin tarjeta · Sin compromiso · Sin letra chica".

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar el contenido completo del archivo:
  ```tsx
  import { Section } from '@/components/ui/Section';
  import { Button } from '@/components/ui/Button';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { signupUrl } from '@/lib/config';
  import { whatsappLink } from '@/lib/contact';

  export function Precio() {
    return (
      <Section id="precio" tone="paper" width="reading" innerClassName="text-center">
        <EditorialMicro>El precio</EditorialMicro>
        <DisplayHeading
          level={2}
          italicAccent={<>de plata.</>}
          className="mt-5 max-w-[18ch] mx-auto"
        >
          Cuando estés convencido,
          <br />
          hablamos
        </DisplayHeading>

        <p className="mt-8 text-body-lg text-ink/75 max-w-[52ch] mx-auto leading-relaxed">
          Tenés 30 días para probar todo. Sin tarjeta, sin compromiso, sin letra chica. Si te sirve, te paso el precio. Si no te sirve, no te debo nada y se acabó.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
          <Button as="a" href={signupUrl()} variant="primary" size="lg" className="sm:min-w-[200px]">
            Probalo gratis <span className="font-mono">→</span>
          </Button>
          <Button
            as="a"
            href={whatsappLink('Hola Néstor, quiero saber el precio de Buen Inventario.')}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="lg"
            className="sm:min-w-[200px]"
          >
            Escribime por WhatsApp
          </Button>
        </div>

        <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted">
          Sin tarjeta · Sin compromiso · Sin letra chica
        </p>
      </Section>
    );
  }
  ```
- [ ] **Step 2:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 3:** Verificación visual:
  - Mobile (iPhone 12): título serif grande con "de plata" en cursiva turquesa. Párrafo body legible centered. 2 CTAs apilados full-width.
  - Desktop: 2 CTAs lado a lado centered.
  - **No debe quedar rastro de la card con $14.900 ni de la lista de 6 features. Tampoco el FEATURES array.**
- [ ] **Commit:** `git commit -m "refactor(landing): rewrite Precio as honest minimal section without price card"`

---

### Task 8: `sections/Faq.tsx` REWRITE + `index.css` icon rotation

**Files:**
- Rewrite: `src/components/sections/Faq.tsx:1-66`
- Modify: `src/index.css:81-82` (faq-toggle[open] rotation)

**Constraints:**
- Mantener mecánica `<details>`/`<summary>` nativa (a11y gold standard).
- 5 Q&As nuevas cerradas en el design (reemplazan totalmente las 4 actuales).
- Eyebrow: "Dudas comunes" (antes "Preguntas frecuentes").
- Heading: "Lo que me preguntan" + italicAccent `siempre.` (antes "Lo que más" + `nos preguntan.`).
- Icono cambia de char `+` (rotate 45deg → ×) a `ChevronRight` de lucide-react (rotate 90deg → ChevronDown shape).
- Animación 200ms cubic-bezier(0.4, 0, 0.2, 1) — mantener la timing function existente.
- CSS update: `.faq-toggle[open] .faq-icon` rota a `90deg` en lugar de `45deg`.
- WhatsApp link al pie mantiene la misma URL + mensaje genérico de pregunta.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar el contenido completo de `src/components/sections/Faq.tsx`:
  ```tsx
  import { ChevronRight } from 'lucide-react';
  import { Section } from '@/components/ui/Section';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { whatsappLink } from '@/lib/contact';

  type Qa = { q: string; a: string };

  const QAS: Qa[] = [
    {
      q: '¿Tengo que facturar TODO lo que cargo en el sistema?',
      a: 'No. Vos decidís qué facturás y qué no. El sistema te ordena el negocio — no te controla, no te denuncia, no se conecta con ARCA salvo que vos lo actives.',
    },
    {
      q: '¿Sirve si no soy bueno con la tecnología?',
      a: 'Si sabés usar WhatsApp, sabés usar Buen Inventario. Es lo mismo: ves un número, tocás, listo. La complejidad está adentro, la pantalla es simple.',
    },
    {
      q: '¿Puedo migrar lo que tengo en Excel?',
      a: 'Sí. Si querés, te ayudo yo personalmente con la migración en la primera semana. Cero costo extra. Cero dolor.',
    },
    {
      q: '¿Qué pasa con mis datos si dejo de usarlo?',
      a: 'Te los exportás cuando quieras, en CSV o Excel. Son tuyos, no míos. Si te vas, te los llevás.',
    },
    {
      q: '¿Funciona si se cae internet?',
      a: 'Sigue funcionando en el navegador con los últimos datos cargados. Cuando vuelve internet, sincroniza solo.',
    },
  ];

  export function Faq() {
    return (
      <Section id="faq" tone="cream" width="reading">
        <div className="text-center">
          <EditorialMicro>Dudas comunes</EditorialMicro>
          <DisplayHeading level={2} italicAccent={<>siempre.</>} className="mt-5">
            Lo que me preguntan
          </DisplayHeading>
        </div>

        <div className="mt-14 border-t-hard border-ink">
          {QAS.map((qa) => (
            <details key={qa.q} className="faq-toggle border-b-hard border-ink group">
              <summary className="flex justify-between items-baseline py-7 cursor-pointer gap-4">
                <span className="editorial-display text-[20px] md:text-[23px] leading-snug text-ink">
                  {qa.q}
                </span>
                <ChevronRight
                  className="faq-icon w-5 h-5 text-teal-700 shrink-0 mt-1"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <p className="pb-7 text-body-lg text-ink/80 max-w-[60ch] leading-relaxed">
                {qa.a}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-16 text-center text-body-md text-ink/80">
          ¿Tenés otra pregunta?{' '}
          <a
            href={whatsappLink('Hola Néstor, tengo una pregunta sobre Buen Inventario.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 underline underline-offset-[3px] hover:text-ink transition-colors"
          >
            Escribime por WhatsApp →
          </a>
        </p>
      </Section>
    );
  }
  ```
- [ ] **Step 2:** Actualizar `src/index.css` líneas 81-82. Reemplazar la rotation del ícono abierto:
  ```css
  /* ANTES línea 82: */
  .faq-toggle[open] .faq-icon { transform: rotate(45deg); }

  /* DESPUÉS: */
  .faq-toggle[open] .faq-icon { transform: rotate(90deg); }
  ```
  (La línea 81 `transition: transform 200ms cubic-bezier(...)` queda igual.)
- [ ] **Step 3:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 4:** Verificación visual + a11y:
  - `pnpm dev`, scroll a `#faq`.
  - Confirmar eyebrow "Dudas comunes" + título "Lo que me preguntan *siempre.*".
  - 5 preguntas visibles (cerradas por default). Icono ▸ (ChevronRight) text-teal-700.
  - Click en una pregunta: rota 90deg suavemente (200ms) y muestra respuesta. Click de nuevo: cierra.
  - Teclado: Tab para enfocar summary, Enter/Espacio para toggle (heredado de `<details>` nativo).
  - Smartphone DevTools: tap target del summary tiene height ≥44px (la padding `py-7` da 56px+).
- [ ] **Commit:** `git commit -m "refactor(landing): rewrite FAQ with 5 new Q&As and ChevronRight rotation icon"`

---

## Phase 3 — Shell updates

### Task 9: `Header.tsx` — nav rename Excel → Diagnóstico

**Files:**
- Modify: `src/components/Header.tsx:7-13`

**Constraints:**
- Cambio mecánico en el array `NAV`: 1 entry de label + href.
- Mantener resto del header intacto (logo, sticky behavior, mobile menu trigger, CTA "Probalo gratis").
- `MobileMenu.tsx` recibe el mismo array `NAV` por props — no se toca, hereda el cambio automáticamente.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Modificar el array `NAV` en `Header.tsx`:
  ```tsx
  // ANTES (líneas 7-13):
  const NAV = [
    { label: 'Historia', href: '#historia' },
    { label: 'Excel',    href: '#excel'    },
    { label: 'Sistema',  href: '#sistema'  },
    { label: 'Precio',   href: '#precio'   },
    { label: 'FAQ',      href: '#faq'      },
  ];

  // DESPUÉS:
  const NAV = [
    { label: 'Historia',    href: '#historia'    },
    { label: 'Diagnóstico', href: '#diagnostico' },
    { label: 'Sistema',     href: '#sistema'     },
    { label: 'Precio',      href: '#precio'      },
    { label: 'FAQ',         href: '#faq'         },
  ];
  ```
- [ ] **Step 2:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 3:** Verificación visual + funcional:
  - Desktop: nav muestra "Historia · Diagnóstico · Sistema · Precio · FAQ".
  - Mobile: abrir hamburger menu, mismos 5 items con DM Serif 24px.
  - Click en "Diagnóstico" (desktop y mobile): scroll suave hasta la sección Diagnóstico, con el sticky header sin tapar el eyebrow "El diagnóstico" (gracias al scroll-mt de Task 2).
- [ ] **Commit:** `git commit -m "refactor(landing): rename Excel to Diagnóstico in header nav"`

---

### Task 10: `Footer.tsx` — sumar Facebook + TikTok rows

**Files:**
- Modify: `src/components/Footer.tsx:1` (import) + `src/components/Footer.tsx:65-74` (instagram row + nuevos rows)

**Constraints:**
- Sumar 2 `<li>` rows en la columna Contacto, después del row de Instagram.
- TikTok label: "TikTok (próximamente)" — coherente con el placeholder URL del adapter. Cuando exista la cuenta, el label cambia a "TikTok @bueninventario" (esa edición vive en `Footer.tsx`, el URL ya está abstraído en `lib/contact.ts`).
- Mantener formato textual (no íconos circulares). Coherente con tono editorial.
- `target="_blank"` + `rel="noopener noreferrer"` obligatorios para links externos.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Actualizar import en línea 1 de `Footer.tsx`:
  ```tsx
  // ANTES:
  import { whatsappLink, mailtoLink, instagramLink } from '@/lib/contact';

  // DESPUÉS:
  import { whatsappLink, mailtoLink, instagramLink, facebookLink, tiktokLink } from '@/lib/contact';
  ```
- [ ] **Step 2:** Sumar los 2 nuevos `<li>` después del row de Instagram (línea 74). El bloque actual termina con `</li>` cerrando Instagram. Sumar antes del `</ul>` (~línea 75):
  ```tsx
  <li>
    <a
      href={facebookLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
    >
      Facebook /bueninventario
    </a>
  </li>
  <li>
    <a
      href={tiktokLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
    >
      TikTok (próximamente)
    </a>
  </li>
  ```
- [ ] **Step 3:** Verificar typecheck + lint:
  ```bash
  pnpm exec tsc -b --noEmit && pnpm lint
  ```
- [ ] **Step 4:** Verificación visual: footer columna Contacto ahora muestra 5 rows: WhatsApp, hola@bueninventario.com, Instagram @bueninventario, Facebook /bueninventario, TikTok (próximamente). Espaciado vertical preserva el ritmo (gap-3 entre rows).
- [ ] **Commit:** `git commit -m "feat(landing): add Facebook and TikTok placeholder to footer contact column"`

---

## Phase 4 — Cleanup + verification

### Task 11: Cleanup `public/nestor-portrait.png`

**Files:**
- Delete: `public/nestor-portrait.png`

**Constraints:**
- Verificar antes de borrar que no quedan referencias en el código (Historia ya no lo usa, pero hay que confirmar grep clean).
- Confirmar que `index.html` no tiene `<link rel="preload" href="/nestor-portrait.png">` (ya verificado en Task 11 setup: solo dmserif + inter están preloaded).
- Usar `git rm` para preservar la operación de delete en git history.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Grep verification — confirmar que no hay referencias al asset:
  ```bash
  grep -rn "nestor-portrait" src/ index.html public/ || echo "OK no matches"
  ```
  El output esperado: `OK no matches` (o solo el path del file mismo si pifiás el grep). **Si aparece cualquier match en `src/` o `index.html`, STOP — investigar antes de borrar.**
- [ ] **Step 2:** Borrar el asset via git:
  ```bash
  git rm public/nestor-portrait.png
  ```
- [ ] **Step 3:** Verificar build no roto:
  ```bash
  pnpm build
  ```
  El build debe completar sin errores. El bundle final pesa ~200 KB menos.
- [ ] **Commit:** `git commit -m "chore(landing): remove unused nestor-portrait asset after Historia rewrite"`

---

### Task 12: Final verification — full build + responsive smoke + red word audit

**Files:**
- Audit only (no edits).

**Constraints:**
- Verificación end-to-end de los 11 EDITs + 1 NEW + 1 DELETE.
- Confirmar zero red words en código tocado.
- Confirmar Lighthouse mobile no degradado (≥90).

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Full lint + typecheck + build:
  ```bash
  pnpm lint && pnpm exec tsc -b --noEmit && pnpm build
  ```
  Los 3 comandos deben pasar sin errores ni warnings. Si `pnpm lint` arroja warnings → fix root cause antes de continuar (config tiene `--max-warnings 0`? verificar `package.json`; si no, treat warnings como fail manualmente).
- [ ] **Step 2:** Red word audit en el set de archivos tocados:
  ```bash
  grep -rnE "TODO|FIXME|por ahora|después lo veo|later|for now|MVP|simplified|out of scope|pending implementation" \
    src/lib/contact.ts \
    src/components/ui/Section.tsx \
    src/components/sections/Historia.tsx \
    src/components/sections/Diagnostico.tsx \
    src/components/sections/ExcelComparison.tsx \
    src/components/sections/Sistema.tsx \
    src/components/sections/Precio.tsx \
    src/components/sections/Faq.tsx \
    src/components/Header.tsx \
    src/components/Footer.tsx \
    src/App.tsx \
    src/index.css \
    || echo "OK zero red words"
  ```
  Output esperado: 1 match aceptable en `src/components/sections/Faq.tsx` con la línea `'¿Tengo que facturar TODO lo que cargo en el sistema?'` — ese "TODO" es palabra española en mayúsculas para énfasis ("absolutamente todo"), copy user-facing legítimo, **no es red word**. Cualquier OTRA match → fix root cause antes de continuar. (La palabra "próximamente" en TikTok label tampoco es red word; la regex no la matchea.)
- [ ] **Step 3:** Responsive smoke test en `pnpm preview` (prod build, no dev):
  ```bash
  pnpm build && pnpm preview
  # abrir http://localhost:4173 en Chrome DevTools con Device Mode
  ```
  Validar en iPhone 12 (390×844):
  - **Historia**: composición tipográfica centrada, sin foto, divider visible, location en mono caps.
  - **Diagnóstico**: 5 items con íconos sin cambios, eyebrow "El diagnóstico", id `#diagnostico`.
  - **Comparativa nueva**: 6 cards apiladas con header DM Serif + row Excel gris + row BI con bg + border-left + bullet •. SIN scroll horizontal, SIN checkmarks ✓/✗.
  - **Sistema**: 3 capturas sin cambios, CTA secundario del cierre dice "Ver las dudas comunes" → `#faq`.
  - **Precio**: SIN $14.900 visible. Título "Cuando estés convencido, hablamos *de plata.*", 2 CTAs apilados (Probalo gratis + Escribime WhatsApp).
  - **FAQ**: eyebrow "Dudas comunes", título "Lo que me preguntan *siempre.*", 5 preguntas con icono ChevronRight teal-700, animación de open/close 200ms suave.
  - **Footer**: columna Contacto muestra WhatsApp / email / Instagram / Facebook / TikTok (próximamente).
  - **Header nav**: "Historia · Diagnóstico · Sistema · Precio · FAQ". Click en cada anchor: scroll suave con título de sección visible bajo el sticky header (no oculto).

  Validar en desktop (≥768px):
  - **Comparativa**: tabla nativa 3 columnas. Headers eyebrow caps, columna BI en teal-700 medium. Cells: Característica en DM Serif, Excel en gris medio regular, BI con bg teal-50/40 + border-left teal + bullet.
  - **Historia**: título 64px DM Serif, párrafos centered, ancho ~640px.
  - **Precio**: 2 CTAs side-by-side centered.

- [ ] **Step 4:** Lighthouse audit en mobile (opcional pero recomendado):
  ```bash
  npx lighthouse http://localhost:4173 --view --preset=mobile --quiet
  ```
  Targets: Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥95. **Si Performance < 90, investigar root cause** (probable culprit: el cleanup de portrait debería ayudar, no perjudicar).

- [ ] **Step 5:** Final commit checkpoint (vacío — todos los cambios ya commiteados):
  ```bash
  git log --oneline -15
  ```
  Confirmar que los últimos 11 commits son los de este plan (T1 hasta T11). T12 no genera commit propio porque es auditoría.

  Si todo OK, anunciar al usuario: "Plan ejecutado completo, 12 tasks, 11 commits. Landing actualizada con las 6 secciones del design 2026-05-29."

---

## Self-Audit Checklist (correr antes de marcar plan complete)

- [ ] Spec coverage: cada uno de los 6 ajustes del design tiene al menos una task → ✓
  - Nav rename → Task 9
  - Historia rewrite → Task 3
  - ExcelComparison nueva → Task 5
  - Precio rewrite → Task 7
  - FAQ rewrite + icon → Task 8
  - Footer Facebook + TikTok → Tasks 1 + 10
- [ ] Ajustes técnicos cubiertos:
  - Sistema CTA secundario → Task 6
  - contact.ts helpers → Task 1
  - index.css icon rotation → Task 8
  - Cleanup asset → Task 11
  - scroll-mt global → Task 2 (decisión de raíz preventiva)
- [ ] Placeholder scan: cero "TBD", "TODO", "implementar después", "por ahora", "later" en este plan → ✓
- [ ] Type consistency: nombres consistentes (`Diagnostico` componente y file, `ExcelComparison` componente y file, `facebookLink`/`tiktokLink` con misma capitalización en lib + footer import) → ✓
- [ ] Red words scan: ninguna red word en el plan ni instrucciones para introducirlas en el código → ✓ (audit explícito en Task 12 Step 2)
- [ ] Schema durability: N/A (sin DynamoDB)
- [ ] Zero patches: las 3 secciones que requieren cambio estructural (Historia, Precio, Faq) son REWRITE completos, no patches → ✓
- [ ] Multi-tenant: N/A documentado en cada task → ✓
- [ ] Adapter-first: Task 1 (contact helpers) es la primera del plan, antes que Task 10 (Footer que los consume) → ✓
- [ ] Bite-sized: cada task estimada 2-5 min de ejecución activa + verificación. Task 5 (NEW ExcelComparison) es la más larga (~10 min por LOC + dual layout) — justificada por scope contenido → ✓
- [ ] Commit-friendly: cada task termina en commit, landing queda en estado consistente entre commits → ✓

---

## Verification final (ejecutar al cerrar plan)

```bash
cd /Users/nestorberlanga/Desktop/Buen\ Inventario/buen-inventario-landingpage

# 1. Lint + typecheck
pnpm lint && pnpm exec tsc -b --noEmit

# 2. Prod build
pnpm build

# 3. Smoke en preview (chequeo visual humano)
pnpm preview

# 4. Red word audit
grep -rnE "TODO|FIXME|por ahora|después lo veo|later|for now|MVP|simplified|out of scope|pending implementation" src/ || echo "OK zero red words"

# 5. Git history check
git log --oneline -15
```

Todo verde → plan complete. Listo para deploy a Vercel.

---

## Out of scope explícito (NO hacer durante ejecución)

- ❌ Cambio de fuente del sitio (Fraunces u otra). DM Serif Display se mantiene.
- ❌ A/B test del precio reescrito vs precio actual.
- ❌ Modificar Hero, Sistema 3 pantallas, cierre de Sistema (excepto CTA secundario).
- ❌ Modificar el bloque "5 fears" de Diagnóstico (solo cambia el id de la `<Section>` y el nombre del export).
- ❌ Sumar testimonios, logos, stats inventados.
- ❌ Sumar íconos pagos o stock photos.
- ❌ Sumar emojis decorativos (incluye ✓/✗ en la comparativa).
- ❌ Refactorizar primitives (`Section`, `Button`, `DisplayHeading`, `EditorialMicro`) más allá del scroll-mt de Task 2.
- ❌ Tocar `BrowserFrame` ni `fake-screens/*` (los usa Sistema, sin cambios).
- ❌ Modificar `index.html` (preload tags están OK, no hay portrait preload).
- ❌ Sumar deps nuevas (ya tenemos lucide-react para ChevronRight).
- ❌ Cambiar tokens Tailwind (colores, fuentes, max-widths). La paleta REAL del repo ya pasa WCAG AA.

---

## Handoff a bi-execute

Plan listo para ejecución task-by-task con `bi-execute`. Las 12 tasks son secuenciales con dependencias mínimas:
- Tasks 1 + 2 (foundation) → 3 (Historia) → 4 (rename Excel→Diagnostico) → 5 (ExcelComparison wire) → 6 (Sistema CTA) → 7 (Precio) → 8 (Faq + CSS) → 9 (Header nav) → 10 (Footer) → 11 (cleanup) → 12 (audit).

Ningún task tiene paralelismo (todas tocan files de un mismo bundle React). Ejecutar en orden estricto.
