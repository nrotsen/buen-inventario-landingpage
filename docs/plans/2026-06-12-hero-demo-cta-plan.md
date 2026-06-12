# Hero "Solicitar demo" CTA — Implementation Plan

> **Para agentic workers:** Usar bi-execute para implementar este plan task-by-task. Los steps usan checkbox syntax (`- [ ]`) para tracking.

**Goal:** Reemplazar el botón secundario `Ver cómo funciona` del Hero por `Solicitar demo`, que abre WhatsApp con un mensaje pre-poblado de intent de demo. Cero JS, reutiliza el helper `whatsappLink()` existente.

**Architecture:** Single feature change scoped a 2 archivos. La nueva constante `DEMO_REQUEST_MESSAGE` vive en `src/lib/contact.ts` (mismo módulo que `WHATSAPP_NUMBER` y `whatsappLink`). El Hero la consume vía el helper. `Button` component ya soporta `target`/`rel`/`aria-label` vía spread — no necesita modificación.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind con editorial tokens. `wa.me` Click-to-Chat URL spec.

**Design spec:** `docs/plans/2026-06-12-hero-demo-cta-design.md`

## Standards aplicables

El repo `buen-inventario-landingpage` no tiene `docs/reference/STANDARDS.md` ni `.claude/rules/*.md`. La governance viene del design system implícito:

- **Editorial tokens**: usar variables Tailwind ya definidas (`ink`, `paper`, `teal-*`, `text-muted`, `font-mono`, `border-hard`, etc.). Cero hex literales, cero arbitrary values fuera del system establecido.
- **Button component**: variants disponibles = `primary`, `ghost`, `inverted`, `ghost-on-dark`. Sizes = `md`, `lg`.
- **Contact helpers**: cada link a WhatsApp/email/redes pasa por `src/lib/contact.ts`. Cero `wa.me/...` inline.
- **File structure**: secciones en `src/components/sections/`, UI primitives en `src/components/ui/`, utilities en `src/lib/`.

## Operational Rules (REQUIRED)

- NEVER commitear `.env` ni archivos con credenciales.
- Frontend webs: mobile-first (>70% del tráfico). Verificar responsive en mobile viewport.
- External links: `target="_blank"` + `rel="noopener noreferrer"` (security).
- A11y: links que abren apps externas necesitan `aria-label` declarando el canal.
- Cero `wa.me/...` hardcodeado fuera de `src/lib/contact.ts`.

---

## Task 1: `DEMO_REQUEST_MESSAGE` constante en `src/lib/contact.ts`

**Files:**
- Modify: `src/lib/contact.ts:1-37`

**Constraints:**
- Toda constante de copy de WhatsApp vive en `contact.ts` junto al número y al helper. Cero strings de mensajes inline en componentes.
- TypeScript: export como `const` para inmutabilidad + type narrowing.
- Naming: SCREAMING_SNAKE_CASE para constantes top-level (matchea `WHATSAPP_NUMBER`, `EMAIL`, etc.).

**Multi-tenant impact:**
- N/A — landing pública, sin tenants.

- [ ] **Step 1:** Abrir `src/lib/contact.ts`. Verificar que el header del file empieza con `const WHATSAPP_NUMBER = '5491122775850';` (línea 1) y que `whatsappLink()` está exportada (línea 7).

- [ ] **Step 2:** Agregar la nueva constante exportada **inmediatamente después** del bloque de helpers (después de `tiktokLink()`, antes del bloque `export const CONTACT = {...}` que arranca alrededor de la línea 33). El bloque queda así:

  ```ts
  /**
   * Mensaje canónico para el botón "Solicitar demo" del Hero. Vive acá (no
   * inline en el componente) porque el copy de mensajes pre-poblados es
   * single-source-of-truth — si mañana se agrega el CTA en otra sección,
   * referenciar esta constante en vez de duplicar.
   */
  export const DEMO_REQUEST_MESSAGE =
    'Hola Néstor, quiero agendar una demo de Buen Inventario. Me contás cómo es?';
  ```

- [ ] **Step 3:** Verificar que no se rompió ninguna export existente:

  ```bash
  cd buen-inventario-landingpage && npx tsc --noEmit
  ```

  Output esperado: cero errors.

- [ ] **Step 4:** Red-words self-audit del file:

  ```bash
  grep -nE "TODO|FIXME|por ahora|para más tarde|MVP|simplified|out of scope|for now|deferred" src/lib/contact.ts || echo "clean"
  ```

  Output esperado: `clean`.

---

## Task 2: Hero swap `Ver cómo funciona` → `Solicitar demo`

**Files:**
- Modify: `src/components/sections/Hero.tsx:7,21-28`

**Constraints:**
- Reutilizar `<Button as="a">` existente con variant `ghost` (mantiene la jerarquía: primary=`Probalo gratis`, secondary=demo).
- `target="_blank"` + `rel="noopener noreferrer"` mandatorios para link externo.
- `aria-label` explícito mencionando WhatsApp porque el texto visible no lo declara.
- Cero cambios al copy del headline, microcopy, o screenshot del Hero.
- `whatsappLink()` consumido vía import, NO inline `wa.me/...`.

**Multi-tenant impact:**
- N/A — landing pública, sin tenants.

- [ ] **Step 1:** Agregar el import de `whatsappLink` y `DEMO_REQUEST_MESSAGE` desde el contact lib. Reemplazar la línea de imports existente (línea 7):

  ```tsx
  import { signupUrl } from '@/lib/config';
  ```

  Por:

  ```tsx
  import { signupUrl } from '@/lib/config';
  import { whatsappLink, DEMO_REQUEST_MESSAGE } from '@/lib/contact';
  ```

- [ ] **Step 2:** Reemplazar el bloque del segundo botón. Buscar (líneas 25-27):

  ```tsx
  <Button as="a" href="#sistema" variant="ghost" size="lg">
    Ver cómo funciona
  </Button>
  ```

  Reemplazar por:

  ```tsx
  <Button
    as="a"
    href={whatsappLink(DEMO_REQUEST_MESSAGE)}
    target="_blank"
    rel="noopener noreferrer"
    variant="ghost"
    size="lg"
    aria-label="Solicitar demo por WhatsApp"
  >
    Solicitar demo
  </Button>
  ```

- [ ] **Step 3:** NO tocar nada más del Hero. Confirmar que el resto del componente queda intacto:
  - `EditorialMicro` con el rubro (línea 14)
  - `DisplayHeading` "Recuperá el control de tu comercio." (líneas 15-17)
  - `<p>` del paragraph principal (líneas 18-20)
  - El primer `<Button>` "Probalo gratis" (líneas 22-24)
  - El microcopy de abajo "Sin tarjeta · Cancelás cuando quieras..." (líneas 29-31)
  - El `<BrowserFrame>` con el `AnalyticsFakeScreen` (líneas 33-37)

- [ ] **Step 4:** Compilar:

  ```bash
  cd buen-inventario-landingpage && npx tsc --noEmit
  ```

  Cero errors esperado.

- [ ] **Step 5:** Lint:

  ```bash
  cd buen-inventario-landingpage && npm run lint -- src/components/sections/Hero.tsx
  ```

  Cero warnings esperado.

- [ ] **Step 6:** Red-words self-audit en el file modificado:

  ```bash
  grep -nE "TODO|FIXME|por ahora|para más tarde|MVP|simplified|out of scope|for now|deferred" src/components/sections/Hero.tsx || echo "clean"
  ```

  Output esperado: `clean`.

- [ ] **Step 7:** Manual QA (browser):
  1. `npm run dev`.
  2. Abrir `http://localhost:5173/` (o el puerto que use Vite).
  3. En el Hero, el segundo botón ahora dice **"Solicitar demo"** y NO `Ver cómo funciona`.
  4. Hover sobre el botón — el cursor es pointer, el `aria-label` aparece en el tooltip de accesibilidad (verificable con DevTools → Accessibility tree → el `<a>` tiene `aria-label="Solicitar demo por WhatsApp"`).
  5. Click → abre nueva tab. URL contiene `https://wa.me/5491122775850?text=Hola%20N%C3%A9stor%2C%20quiero%20agendar%20una%20demo%20de%20Buen%20Inventario.%20Me%20cont%C3%A1s%20c%C3%B3mo%20es%3F`.
  6. En mobile (Chrome DevTools → iPhone 12 viewport): los 2 botones del Hero quedan stacked vertical (clase `flex-col sm:flex-row`), ambos con touch target ≥48px (size=`lg` da `h-[52px]`). El "Solicitar demo" no overflowea.
  7. Visualmente: `Probalo gratis` mantiene el variant primary (negro sobre paper) y `Solicitar demo` el variant ghost (transparente con border ink) — jerarquía respetada.

- [ ] **Commit:**

  ```bash
  cd buen-inventario-landingpage && git add src/lib/contact.ts src/components/sections/Hero.tsx && \
    git commit -m "feat(landing): replace Hero secondary CTA with Solicitar demo (WhatsApp)

  Reemplaza el botón 'Ver cómo funciona' (anchor a #sistema) por
  'Solicitar demo' que abre WhatsApp con mensaje pre-poblado. Reutiliza
  whatsappLink() existente y agrega DEMO_REQUEST_MESSAGE como constante
  en lib/contact.ts (single-source-of-truth para reuso futuro). Cero JS,
  target=_blank + rel + aria-label para a11y/security.

  Refs: docs/plans/2026-06-12-hero-demo-cta-design.md"
  ```

---

## Spec coverage check

| Requerimiento del design spec | Task |
|---|---|
| D1 Placement: Hero, reemplaza "Ver cómo funciona" | T2 Step 2 |
| D2 Copy "Solicitar demo" | T2 Step 2 (texto del Button) |
| D3 Mensaje pre-poblado canónico via `DEMO_REQUEST_MESSAGE` | T1 Step 2 + T2 Step 1-2 |
| D4 `target="_blank"` + `rel="noopener noreferrer"` | T2 Step 2 |
| D5 `aria-label="Solicitar demo por WhatsApp"` | T2 Step 2 |
| D6 Variant `ghost` (jerarquía secundaria) | T2 Step 2 |
| Reutilizar `whatsappLink()` adapter | T2 Step 1 (import) + Step 2 (consumo) |
| Cero cambios al headline/microcopy/screenshot del Hero | T2 Step 3 (verificación explícita) |
| Manual QA mobile + a11y + click flow | T2 Step 7 |

**Excepciones**: ninguna — el spec entero cubierto.

---

## Self-review

- [x] **Spec coverage**: cada decisión D1-D6 mapeada a un step específico (tabla arriba).
- [x] **Placeholder scan**: cero red words en prosa del plan; cada step tiene código exacto (los únicos hits del grep son literal patterns dentro de bash audit commands).
- [x] **Type consistency**: `DEMO_REQUEST_MESSAGE` (T1) referenciada idéntica en T2 import + uso.
- [x] **Red words scan**: grep clean en prosa del plan (los únicos hits son patterns dentro de bash audit commands, intencionales).
- [x] **Zero patches**: las modificaciones son cambios coherentes (no spot fixes sobre código frágil). El Hero tiene 41 LOC bien estructuradas; el cambio reemplaza un Button completo, no parchea uno.
- [x] **Multi-tenant**: N/A documentado por task. Landing pública sin tenants.

---

## Próximos pasos

1. User revisa el plan y avisa si quiere cambios.
2. Como es un plan de 2 tasks, conviene **inline execution** (la skill bi-execute es overkill para <5 tasks).
3. Post-merge: refresh de la landing en prod, smoke del click flow desde mobile y desktop reales.
