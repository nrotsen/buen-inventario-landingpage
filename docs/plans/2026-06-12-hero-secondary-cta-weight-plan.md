# Hero secondary CTA weight — Implementation Plan

> **Para agentic workers:** Usar bi-execute para implementar este plan task-by-task. Los steps usan checkbox syntax (`- [ ]`) para tracking.

**Goal:** Subir el peso visual del CTA secundario "Solicitar demo" (Hero) y "Escribime por WhatsApp" (Precio) sin invertir la jerarquía dual-CTA, vía nueva variant `ghost-accent` que combina outline ink + offset shadow teal + aplaste en hover.

**Architecture:** Extensión additiva del componente `Button`. Nueva variant `ghost-accent` en `src/components/ui/Button.tsx`. Nuevo token `shadow-offset-xs` en `tailwind.config.js` (sum de la familia existente `offset-sm/md/lg`). Los consumers (Hero, Precio) cambian un solo prop (`variant="ghost"` → `variant="ghost-accent"`).

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind 3.4+ (extend boxShadow + utility-first className).

**Design spec:** `docs/plans/2026-06-12-hero-secondary-cta-weight-design.md` (commit `fdb4401`).
**Mockup visual:** `mockups/hero-secondary-cta-variants.html` (V1 = recomendada = implementada).

---

## Standards aplicables

El repo `buen-inventario-landingpage` no tiene `docs/reference/STANDARDS.md` ni `.claude/rules/*.md`. La governance viene del design system implícito:

- **Editorial tokens**: cero hex literales en código de componentes. Todo color/spacing/shadow pasa por `tailwind.config.js`. Si necesitás un valor nuevo, agregalo al config y referencialo por nombre.
- **Button component**: variants disponibles hoy = `primary`, `ghost`, `inverted`, `ghost-on-dark`. Sizes = `md`, `lg`. La variant nueva (`ghost-accent`) es additiva — la `ghost` original queda intacta.
- **Shadow family**: `shadow-offset-{sm,md,lg}` ya existen y se usan en `BrowserFrame`, `PhotoFrame`, `MobileMenu`. La nueva `shadow-offset-xs` completa la familia hacia abajo.
- **File structure**: tokens en `tailwind.config.js`, UI primitives en `src/components/ui/`, secciones en `src/components/sections/`.

## Operational Rules (REQUIRED)

- NEVER commitear `.env` ni archivos con credenciales.
- Frontend webs: mobile-first (>70% del tráfico). Verificar responsive en mobile viewport.
- A11y: focus-visible ring no debe ser pisado por la box-shadow custom. Confirmado en spec (capas separadas `--tw-shadow` vs `--tw-ring-shadow`).
- Reduced-motion: aplicar `motion-reduce:transition-none` a cualquier variant con transitions de `transform`/`box-shadow`.
- Tailwind tokens: cero hex inline en código de componentes; todo va por el config.

---

## Pre-implementación check (correr ANTES de Task 1)

- [ ] **Confirmar que solo Hero y Precio usan `variant="ghost"`:**

  ```bash
  cd buen-inventario-landingpage && grep -rn 'variant="ghost"' src/components/
  ```

  Output esperado (exacto):
  ```
  src/components/sections/Hero.tsx:31:              variant="ghost"
  src/components/sections/Precio.tsx:35:          variant="ghost"
  ```

  Si aparecen MÁS matches: detener el plan. Decidir caso por caso si esos otros usos merecen el weight editorial (probablemente no — quedan como `ghost` lite). El plan solo migra Hero y Precio. Si el grep muestra menos matches o líneas distintas, el repo divergió del spec — re-leer Hero.tsx y Precio.tsx antes de seguir.

- [ ] **Confirmar que `shadow-offset-xs` NO existe todavía:**

  ```bash
  cd buen-inventario-landingpage && grep -n "offset-xs" tailwind.config.js src/ -r
  ```

  Output esperado: cero matches. Si aparece, abortar — el token ya existe y la Task 1 sería duplicación.

- [ ] **Confirmar branch limpia:**

  ```bash
  cd buen-inventario-landingpage && git status --short
  ```

  Output esperado: vacío, o solo files no relacionados al plan. Si hay cambios pendientes en `tailwind.config.js`, `Button.tsx`, `Hero.tsx` o `Precio.tsx`, stashear/commitear/discardearlos antes de empezar.

---

## Task 1: Token `shadow-offset-xs` en `tailwind.config.js`

**Files:**
- Modify: `tailwind.config.js:40-44`

**Constraints:**
- Mantener el color teal (`#14b8a6`) idéntico al resto de la familia `offset-*` — la firma editorial es un único color.
- Naming: kebab-case `offset-xs` consistente con `offset-sm/md/lg`.
- Cero cambios a otras keys del config (`colors`, `fontFamily`, `fontSize`, `borderWidth`, `borderRadius`, `transitionTimingFunction`, `maxWidth`).

**Multi-tenant impact:** N/A — landing pública.

- [ ] **Step 1:** Abrir `tailwind.config.js`. Verificar que el bloque `boxShadow` está en líneas 40-44 con el formato:

  ```js
  boxShadow: {
    "offset-lg": "8px 8px 0 0 #14b8a6",
    "offset-md": "6px 6px 0 0 #14b8a6",
    "offset-sm": "4px 4px 0 0 #14b8a6",
  },
  ```

- [ ] **Step 2:** Reemplazar el bloque por:

  ```js
  boxShadow: {
    "offset-lg": "8px 8px 0 0 #14b8a6",
    "offset-md": "6px 6px 0 0 #14b8a6",
    "offset-sm": "4px 4px 0 0 #14b8a6",
    "offset-xs": "2px 2px 0 0 #14b8a6",
  },
  ```

  (Se suma la última línea `"offset-xs": ...`. Las otras tres quedan idénticas.)

- [ ] **Step 3:** Verificar que el config sigue siendo JS válido y Vite arranca:

  ```bash
  cd buen-inventario-landingpage && npx tsc --noEmit && echo "tsc OK"
  ```

  Output esperado: `tsc OK` (tsc no parsea el config, pero confirma que el build chain de TS no se rompió por side effect).

- [ ] **Step 4:** Red-words self-audit:

  ```bash
  grep -nE "TODO|FIXME|por ahora|para más tarde|MVP|simplified|out of scope|for now|deferred" tailwind.config.js || echo "clean"
  ```

  Output esperado: `clean`.

- [ ] **Commit:**

  ```bash
  cd buen-inventario-landingpage && git add tailwind.config.js && \
    git commit -m "feat(landing): add shadow-offset-xs (2px 2px) token

  Completa la familia shadow-offset-{sm,md,lg} hacia abajo. Necesario para
  el hover state de la nueva variant Button 'ghost-accent' (aplaste del
  shadow al pasar mouse). Mismo color teal del resto de la familia.

  Refs: docs/plans/2026-06-12-hero-secondary-cta-weight-design.md"
  ```

---

## Task 2: Variant `ghost-accent` en `Button.tsx`

**Files:**
- Modify: `src/components/ui/Button.tsx:4,7-8,10-15`

**Constraints:**
- La variant `ghost` original queda intacta — la nueva es additiva, no reemplazo. Otros consumers que usen `ghost` legítimamente (si aparecen en el futuro) no rompen.
- Reuso de tokens existentes: `shadow-offset-sm` (idle) y `shadow-offset-xs` (hover/active, agregado en Task 1). Cero hex inline.
- Translate idle: `-0.5` en cada eje (Tailwind 0.5 = 2px) — match exacto del mockup.
- Hover: el botón se aplasta (`translate(0,0)`) + shadow se reduce a `xs` + fill ink (consistente con el hover del ghost actual).
- Active mirror del hover para feedback en mobile tap.
- `motion-reduce:transition-none` para accesibilidad.
- `baseClasses`: reemplazar `transition-colors` por transition-property explícita que incluye `transform` y `box-shadow`. Las otras variants (`primary`, `ghost`, `inverted`, `ghost-on-dark`) no usan transform ni shadow en hover, así que la extensión es no-op para ellas.

**Multi-tenant impact:** N/A — UI primitive sin data layer.

- [ ] **Step 1:** Abrir `src/components/ui/Button.tsx`. Confirmar que la línea 4 dice:

  ```ts
  type Variant = 'primary' | 'ghost' | 'inverted' | 'ghost-on-dark';
  ```

  Si dice algo distinto, abortar — el componente divergió del spec.

- [ ] **Step 2:** Reemplazar la línea 4 por:

  ```ts
  type Variant = 'primary' | 'ghost' | 'ghost-accent' | 'inverted' | 'ghost-on-dark';
  ```

  (Se suma `'ghost-accent'` entre `'ghost'` y `'inverted'`. El orden en el union es para legibilidad — agrupa las dos variantes ghost.)

- [ ] **Step 3:** Reemplazar el bloque `baseClasses` (líneas 7-8):

  ```ts
  const baseClasses =
    'inline-flex items-center justify-center gap-2 border-hard rounded-md font-medium transition-colors duration-200 ease-editorial whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50';
  ```

  Por:

  ```ts
  const baseClasses =
    'inline-flex items-center justify-center gap-2 border-hard rounded-md font-medium transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-editorial whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50';
  ```

  (Único cambio: `transition-colors` → `transition-[color,background-color,border-color,transform,box-shadow]`. Resto idéntico.)

- [ ] **Step 4:** Reemplazar el record `variantClasses` (líneas 10-15):

  ```ts
  const variantClasses: Record<Variant, string> = {
    primary: 'bg-ink text-paper border-ink hover:bg-teal-500 hover:border-teal-500',
    ghost: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
    inverted: 'bg-paper text-ink border-paper hover:bg-teal-500 hover:border-teal-500 hover:text-paper',
    'ghost-on-dark': 'bg-transparent text-paper border-paper/40 hover:bg-paper/10 hover:border-paper',
  };
  ```

  Por:

  ```ts
  const variantClasses: Record<Variant, string> = {
    primary: 'bg-ink text-paper border-ink hover:bg-teal-500 hover:border-teal-500',
    ghost: 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
    'ghost-accent':
      'bg-transparent text-ink border-ink shadow-offset-sm -translate-x-0.5 -translate-y-0.5 ' +
      'hover:bg-ink hover:text-paper hover:translate-x-0 hover:translate-y-0 hover:shadow-offset-xs ' +
      'active:bg-ink active:text-paper active:translate-x-0 active:translate-y-0 active:shadow-offset-xs ' +
      'motion-reduce:transition-none',
    inverted: 'bg-paper text-ink border-paper hover:bg-teal-500 hover:border-teal-500 hover:text-paper',
    'ghost-on-dark': 'bg-transparent text-paper border-paper/40 hover:bg-paper/10 hover:border-paper',
  };
  ```

  (Se suma `'ghost-accent'` entre `ghost` e `inverted`. Las otras 4 entries quedan idénticas.)

- [ ] **Step 5:** TypeScript check:

  ```bash
  cd buen-inventario-landingpage && npx tsc --noEmit
  ```

  Cero errors esperado. (El union `Variant` es discriminated, así que TS valida que `variantClasses` cubra exactamente todas las keys — si te falta `ghost-accent` en el record, falla compile.)

- [ ] **Step 6:** Lint:

  ```bash
  cd buen-inventario-landingpage && npm run lint -- src/components/ui/Button.tsx
  ```

  Cero warnings esperado.

- [ ] **Step 7:** Red-words self-audit:

  ```bash
  grep -nE "TODO|FIXME|por ahora|para más tarde|MVP|simplified|out of scope|for now|deferred" src/components/ui/Button.tsx || echo "clean"
  ```

  Output esperado: `clean`.

- [ ] **Step 8:** Smoke visual del button isolado (opcional pero recomendado):
  1. `npm run dev`.
  2. Abrir `http://localhost:5173/` (Vite default).
  3. Confirmar que la pantalla NO está rota (todos los Button existentes siguen renderizando con sus variants actuales — primary en CTA principales, ghost en secundarios todavía sin migrar).
  4. Detener el dev server con Ctrl+C antes de continuar.

- [ ] **Commit:**

  ```bash
  cd buen-inventario-landingpage && git add src/components/ui/Button.tsx && \
    git commit -m "feat(landing): add Button variant 'ghost-accent'

  Ghost + shadow-offset-sm + micro-translate idle. Hover: aplaste a
  shadow-offset-xs + fill ink (consistente con ghost hover). Active mirror
  del hover para feedback mobile. motion-reduce:transition-none para a11y.
  Extiende baseClasses transition-property para incluir transform y
  box-shadow (no-op para las otras variants).

  La variant 'ghost' original queda intacta — la nueva es additiva.

  Refs: docs/plans/2026-06-12-hero-secondary-cta-weight-design.md"
  ```

---

## Task 3: Migrar Hero + Precio a `ghost-accent`

**Files:**
- Modify: `src/components/sections/Hero.tsx:31`
- Modify: `src/components/sections/Precio.tsx:35`

**Constraints:**
- Cero cambio fuera del prop `variant`. Copy, href, target, rel, aria-label, size, className — todo intacto.
- Migración atómica de las 2 secciones en un solo commit (coherencia visual: si solo migrás una, el secundario de Precio queda "menos importante" que el del Hero sin razón sistemática).

**Multi-tenant impact:** N/A — landing pública.

- [ ] **Step 1:** Abrir `src/components/sections/Hero.tsx`. Confirmar que la línea 31 dice:

  ```tsx
              variant="ghost"
  ```

  (16 espacios de indent + `variant="ghost"`). Si dice algo distinto, abortar — el repo divergió del spec.

- [ ] **Step 2:** Reemplazar esa línea por:

  ```tsx
              variant="ghost-accent"
  ```

  Mismo indent, solo cambia el valor.

- [ ] **Step 3:** Abrir `src/components/sections/Precio.tsx`. Confirmar que la línea 35 dice:

  ```tsx
          variant="ghost"
  ```

  (10 espacios de indent + `variant="ghost"`).

- [ ] **Step 4:** Reemplazar esa línea por:

  ```tsx
          variant="ghost-accent"
  ```

- [ ] **Step 5:** Confirmar que no quedan más `variant="ghost"` en `sections/` (solo deberían quedar en otros lugares si los hay, pero NO en Hero ni Precio):

  ```bash
  cd buen-inventario-landingpage && grep -rn 'variant="ghost"' src/components/sections/
  ```

  Output esperado: vacío. (Si aparecen otras secciones con `ghost`, NO migrarlas — están fuera del scope del spec.)

- [ ] **Step 6:** TypeScript check:

  ```bash
  cd buen-inventario-landingpage && npx tsc --noEmit
  ```

  Cero errors esperado.

- [ ] **Step 7:** Build production:

  ```bash
  cd buen-inventario-landingpage && npm run build
  ```

  Build exitoso esperado. Tailwind debe generar las clases nuevas (`shadow-offset-xs`, `-translate-x-0.5`, etc.) en el CSS final. Verificar grep en el dist:

  ```bash
  grep -o "shadow-offset-xs\|ghost-accent" dist/assets/*.css | sort -u
  ```

  Output esperado: al menos `shadow-offset-xs` (la class real generada por Tailwind). `ghost-accent` NO debería aparecer (no es una class, es un valor del prop variant).

- [ ] **Step 8:** Lint:

  ```bash
  cd buen-inventario-landingpage && npm run lint -- src/components/sections/Hero.tsx src/components/sections/Precio.tsx
  ```

  Cero warnings esperado.

- [ ] **Step 9:** Red-words self-audit en los 2 files:

  ```bash
  grep -nE "TODO|FIXME|por ahora|para más tarde|MVP|simplified|out of scope|for now|deferred" src/components/sections/Hero.tsx src/components/sections/Precio.tsx || echo "clean"
  ```

  Output esperado: `clean`.

- [ ] **Step 10: Manual QA (desktop):**
  1. `npm run dev`.
  2. Abrir `http://localhost:5173/`.
  3. **Hero — idle**: el botón "Solicitar demo" tiene outline ink + shadow teal abajo-derecha (offset 4px) + el botón está levantado 2px arriba-izquierda. Comparado contra V0 del mockup `mockups/hero-secondary-cta-variants.html`: debe verse igual.
  4. **Hero — hover**: pasar mouse → el botón se aplasta (translate vuelve a 0), shadow se reduce a 2px, background pasa a ink, texto a paper. Transición suave (~200ms).
  5. **Hero — focus**: Tab desde el primary → el botón secundario recibe focus ring teal con offset paper (no se pisa con la shadow editorial).
  6. **Hero — click**: abre nueva tab a `wa.me/...?text=...`. Flow correcto.
  7. Scroll a la sección **Precio** → el botón "Escribime por WhatsApp" tiene el mismo tratamiento (mismo idle, mismo hover, mismo focus).
  8. Verificar visualmente que **el primary "Probalo gratis" sigue dominando la atención** (es filled ink, el secundario es outline + shadow). Jerarquía dual-CTA preservada.

- [ ] **Step 11: Manual QA (mobile):**
  1. En DevTools → Toggle device → iPhone 12 (390x844 o equivalente).
  2. Hero: los 2 botones quedan stacked vertical (`flex-col sm:flex-row`). El secundario tiene shadow abajo-derecha visible, NO overlapea con el primary (el gap de 12px > offset de 4px). Touch target ≥48px (size lg = 52px).
  3. Tap sobre el secundario → feedback visual (active state: aplaste + fill ink). Después abre WhatsApp.
  4. Sección Precio: mismo comportamiento.

- [ ] **Step 12: Reduced-motion QA:**
  1. macOS: System Settings → Accessibility → Display → Reduce motion ON.
  2. Refresh `http://localhost:5173/`.
  3. Hover sobre el secundario del Hero: el estado final es el mismo (aplaste + fill ink), pero la transición es instantánea (no animada).
  4. Revertir el setting cuando termines.

- [ ] **Step 13: Lighthouse a11y check:**
  1. DevTools → Lighthouse → Accessibility category → Mobile.
  2. Run analysis sobre `http://localhost:5173/`.
  3. Score esperado: 100 (o ≥ al baseline previo). Si baja por el cambio, leer los issues — la única causa esperable sería contraste de la shadow, que no aplica (decoration, no contenido). Cualquier otra regression: investigar antes de commitear.

- [ ] **Commit:**

  ```bash
  cd buen-inventario-landingpage && git add src/components/sections/Hero.tsx src/components/sections/Precio.tsx && \
    git commit -m "feat(landing): use ghost-accent variant for Hero + Precio secondary CTAs

  Migra 'Solicitar demo' (Hero) y 'Escribime por WhatsApp' (Precio) de
  variant='ghost' a variant='ghost-accent'. Suben weight visual del CTA
  secundario via offset shadow teal + aplaste hover, sin invertir
  jerarquía con el primary 'Probalo gratis'.

  Cero cambios al copy, href, target, rel ni aria-label.

  Refs: docs/plans/2026-06-12-hero-secondary-cta-weight-design.md"
  ```

---

## Post-implementación final check

Después del commit de Task 3, correr el closeout:

- [ ] **Build fresh limpio:**

  ```bash
  cd buen-inventario-landingpage && rm -rf dist && npm run build
  ```

  Build exitoso, sin warnings que no existieran antes.

- [ ] **Red-words scan del scope completo:**

  ```bash
  grep -nE "TODO|FIXME|por ahora|para más tarde|MVP|simplified|out of scope|for now|deferred" \
    tailwind.config.js \
    src/components/ui/Button.tsx \
    src/components/sections/Hero.tsx \
    src/components/sections/Precio.tsx \
    || echo "clean"
  ```

  Output esperado: `clean`.

- [ ] **Git log review:**

  ```bash
  cd buen-inventario-landingpage && git log --oneline -5
  ```

  Output esperado: 3 commits nuevos en orden (`token → variant → consumers`).

- [ ] **Smoke final en `npm run preview` (no solo dev):**

  ```bash
  cd buen-inventario-landingpage && npm run preview
  ```

  Abrir el URL que tira Vite preview, repetir la QA visual del paso Task 3 Step 10 sobre el build de producción. La shadow + aplaste hover + jerarquía deben verse iguales que en dev.

---

## Spec coverage check

| Requerimiento del design spec | Task |
|---|---|
| D1 Variante visual = ghost + shadow-offset-sm + aplaste hover | T2 Step 4 |
| D2 Scope = Hero + Precio | T3 Step 2 + Step 4 |
| D3 Variant nueva `ghost-accent` en Button.tsx (no inline, no prop) | T2 Step 2 + Step 4 |
| D4 Shadow del hover = token `shadow-offset-xs` (2px 2px) | T1 Step 2 + T2 Step 4 |
| D5 `motion-reduce:transition-none` en la variant | T2 Step 4 |
| D6 Variant `ghost` original intacta | T2 Step 4 (queda en el record sin tocar) + Step 5 lint clean |
| Idle: `bg-transparent text-ink border-ink shadow-offset-sm -translate-x-0.5 -translate-y-0.5` | T2 Step 4 |
| Hover: `bg-ink text-paper translate-x-0 translate-y-0 shadow-offset-xs` | T2 Step 4 |
| Active (mobile tap) mirror del hover | T2 Step 4 |
| Focus ring coexiste con offset shadow | T3 Step 10 (verificación visual) |
| Mobile stacking sin overlap shadow vs primary | T3 Step 11 |
| Reduced-motion behavior | T3 Step 12 |
| transition-property explícita en baseClasses | T2 Step 3 |
| Token `shadow-offset-xs` en tailwind.config.js | T1 Step 2 |
| Verificación pre (grep variant="ghost") | Pre-implementación check |
| Verificación post (build + lighthouse + red-words) | Post-implementación final check + T3 Step 7, Step 13 |

**Excepciones:** ninguna — el spec entero cubierto.

---

## Self-review del plan

- [x] **Spec coverage**: tabla arriba mapea cada decisión D1-D6 + cada item de "Mobile + a11y" + cada item de "Verificación" a un step específico.
- [x] **Placeholder scan**: cero "TBD", "implement later", "por ahora", "después", "add appropriate validation" en prosa del plan. Cada step tiene comando o código exacto.
- [x] **Type consistency**: `ghost-accent` referenciado idéntico en T2 (definición) y T3 (uso). `shadow-offset-xs` referenciado idéntico en T1 (definición) y T2 (uso). Cero typos cruzados.
- [x] **Red words scan**: prosa del plan revisada. Los únicos hits del grep son patterns literales dentro de los comandos `grep -nE ...` de los Steps de self-audit — intencionales, no deuda.
- [x] **Zero patches**: Button.tsx tiene 70 LOC bien organizadas, no es patch sobre código frágil. tailwind.config.js es config additiva. Hero y Precio: cambio de un prop, no patch.
- [x] **Multi-tenant**: N/A documentado por task. Landing pública.
- [x] **Order check**: tokens → variant → consumers respeta dependencias (variant usa shadow-offset-xs definido en T1; consumers usan ghost-accent definido en T2). Cero forward references.
- [x] **Atomic commits**: cada task termina en commit independiente — rollback granular si después aparece un problema visual.

---

## Próximos pasos

1. User revisa el plan y avisa si quiere cambios.
2. Como el plan tiene 3 tasks, ejecución **inline en esta sesión** es más eficiente que despachar `bi-execute` (overkill para <5 tasks). Pero `bi-execute` está disponible si querés review formal por task.
3. Post-merge: refresh de la landing en prod, smoke desde mobile y desktop reales sobre el deploy de Vercel/host actual.
