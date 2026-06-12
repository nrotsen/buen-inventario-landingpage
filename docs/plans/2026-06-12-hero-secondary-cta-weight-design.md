# Hero secondary CTA — weight editorial via offset shadow

**Fecha:** 2026-06-12
**Repo:** `buen-inventario-landingpage`
**Status:** Approved — pasa a `bi-plan`
**Antecedente:** `2026-06-12-hero-demo-cta-design.md` (decisión D6: mantener variant secundaria, no invertir jerarquía).

---

## Problema

El CTA "Solicitar demo" del Hero (y el "Escribime por WhatsApp" de la sección Precio) usan `variant="ghost"` — transparente + outline ink + texto ink. Visualmente pierden contra el primary "Probalo gratis" (filled ink) y se leen como link, no como acción importante.

El sentimiento del owner del producto: "es un CTA importante, se ve poco". La intención del spec previo (D6) sigue válida — el secundario NO debe convertirse en primary —, pero la implementación actual del ghost no carga suficiente peso para señalar que es una acción de primer nivel.

---

## Goal

Subir el peso visual del secundario sin invertir la jerarquía dual-CTA. El primary (`Probalo gratis`) sigue siendo el path preferido del negocio (self-serve signup); el secundario gana presencia para que un visitante con intent de "hablar antes de probar" lo registre como acción real en la primera lectura del hero.

Resolver con tokens y firma visual que el repo ya tiene — sin importar lenguaje nuevo, sin sobrescribir la variant `ghost` existente, sin tocar copy ni helpers.

---

## Decision summary

| # | Decisión | Elegida |
|---|---|---|
| D1 | Variante visual | Ghost + `shadow-offset-sm` teal (idle) + aplaste en hover |
| D2 | Scope | Hero + Precio (coherencia sistema) |
| D3 | Estrategia de variant | Nueva variant `ghost-accent` en `Button.tsx` (no inline, no prop boolean) |
| D4 | Shadow del hover | Token nuevo `shadow-offset-xs` (`2px 2px 0 0 #14b8a6`) |
| D5 | Motion accessibility | `motion-reduce:transition-none` en la variant |
| D6 | Variant `ghost` original | Intacta. La nueva es additiva, no reemplazo. |

---

## Architecture

**Tipo de cambio:** extensión del componente `Button` con una variant nueva. Cero JS adicional, cero asset, cero dep.

**Estados del botón `ghost-accent`:**

| Estado | Background | Texto | Border | Shadow | Transform |
|---|---|---|---|---|---|
| idle | transparent | ink | 1.5px ink | `4px 4px 0 teal-500` | `-2px, -2px` |
| hover | ink | paper | 1.5px ink | `2px 2px 0 teal-500` | `0, 0` |
| active (mobile tap) | ink | paper | 1.5px ink | `2px 2px 0 teal-500` | `0, 0` |
| focus-visible | (heredado idle) | (heredado idle) | (heredado idle) | (heredado idle) | + ring teal-500 con offset paper |
| disabled | (heredado idle) | (heredado idle) | (heredado idle) | (heredado idle) + opacity 0.5 | (heredado idle) |

Lectura del comportamiento: el botón "descansa" sobre una shadow teal en idle (la firma editorial del sistema, igual a `BrowserFrame`/`PhotoFrame`/`MobileMenu`). En hover/tap se "aplasta" hacia abajo-derecha y se rellena ink — feedback brutalista clásico, consistente con el comportamiento de `ghost` actual (que rellena ink) más el aplaste de shadow.

---

## Tech Stack

- Tailwind 3.4+ (ya en el repo) — extend `boxShadow` + utility-first className.
- React 18 + TypeScript — discriminated union de `Variant`.
- Cero lib nueva.

---

## Files que cambian

| Archivo | Tipo | Cambio |
|---|---|---|
| `tailwind.config.js` | MOD | Sumar `"offset-xs": "2px 2px 0 0 #14b8a6"` al record `theme.extend.boxShadow` |
| `src/components/ui/Button.tsx` | MOD | (a) `Variant` suma `'ghost-accent'`; (b) `variantClasses` suma entry; (c) `baseClasses` cambia `transition-colors` por transition-property explícita |
| `src/components/sections/Hero.tsx` | MOD | Línea 31: `variant="ghost"` → `variant="ghost-accent"` |
| `src/components/sections/Precio.tsx` | MOD | Línea 35: `variant="ghost"` → `variant="ghost-accent"` |

**Files que NO cambian:** ningún otro componente, ningún otro estilo, ningún test, ningún helper, ninguna constante.

---

## Spec del variant `ghost-accent`

```ts
type Variant = 'primary' | 'ghost' | 'ghost-accent' | 'inverted' | 'ghost-on-dark';

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

**Cambio al `baseClasses` (transition-property explícita):**

```ts
const baseClasses =
  'inline-flex items-center justify-center gap-2 border-hard rounded-md font-medium ' +
  'transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-editorial ' +
  'whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper ' +
  'disabled:pointer-events-none disabled:opacity-50';
```

Sustituye `transition-colors` por una lista explícita. Verificación: ninguna otra variant (`primary`, `ghost`, `inverted`, `ghost-on-dark`) usa `transform` o `box-shadow` en hover, así que la extensión es no-op para ellas. Cero side-effect.

**Cambio en `tailwind.config.js`:**

```js
boxShadow: {
  "offset-lg": "8px 8px 0 0 #14b8a6",
  "offset-md": "6px 6px 0 0 #14b8a6",
  "offset-sm": "4px 4px 0 0 #14b8a6",
  "offset-xs": "2px 2px 0 0 #14b8a6",
},
```

**Cambios en consumers:**

- `Hero.tsx:31`: `variant="ghost"` → `variant="ghost-accent"`
- `Precio.tsx:35`: `variant="ghost"` → `variant="ghost-accent"`

Cero otro cambio (copy, helpers, aria-label, target/rel — todo intacto).

---

## Data Flow

N/A — cambio puramente visual sobre componente local. Sin red, sin state, sin handlers.

---

## Adapter Boundaries

N/A — sin external deps nuevas. El componente `Button` sigue siendo el único adapter del lenguaje de botones del sistema. La nueva variant es una extensión interna, no un punto de integración con nada externo.

---

## Schema impact

N/A — landing pública, sin DynamoDB.

---

## Multi-tenant impact

N/A — landing pública, sin tenants.

---

## Loading / Empty / Error states

N/A — link estático. El comportamiento de WhatsApp open/fallback (instalado vs Web vs sin app) sigue siendo el mismo cubierto en el spec previo `2026-06-12-hero-demo-cta-design.md`.

---

## Mobile + a11y

- Touch target: `h-[52px]` (size=lg) → 52px alto, cumple Apple HIG ≥44px y WCAG 2.5.5.
- Stacking mobile: `flex flex-col sm:flex-row gap-3` — botones stacked vertical. Shadow del secundario va abajo-derecha (4px 4px) y el gap entre botones (12px) es 3× el offset → cero overlap visual con primary.
- Tap feedback: `active:` pseudo-class mirror del `hover:` → feedback editorial visible en mobile sin requerir hover.
- Focus ring: `focus-visible:ring-2 ring-teal-500 ring-offset-2 ring-offset-paper` heredado del baseClasses. La box-shadow custom (offset editorial) y el ring de Tailwind son shadow layers separadas (`--tw-shadow` vs `--tw-ring-shadow`) — coexisten sin pisarse.
- Contrast (WCAG AA): idle (texto ink #0a0a0a sobre paper #fafaf7) = 19.8:1 ✓. Hover (paper sobre ink) = 19.8:1 ✓. Shadow es decoration (no transporta info) — no requiere contrast ratio.
- Reduced motion: `motion-reduce:transition-none` desactiva la transición de transform/shadow para usuarios con `prefers-reduced-motion: reduce`. Los estados finales se mantienen, solo no se animan.

---

## Verificación pre-implementación

```bash
# 1. Confirmar que solo Hero y Precio usan variant="ghost"
grep -rn 'variant="ghost"' src/components/
# Esperado: 2 matches (Hero.tsx, Precio.tsx)

# 2. Confirmar que shadow-offset-{sm,md,lg} se siguen usando en otros lados
grep -rn "shadow-offset" src/
# Esperado: matches en BrowserFrame, PhotoFrame, MobileMenu (sin afectar)
```

Si el grep 1 retorna más matches, decisión caso por caso (probablemente quedan como `ghost` lite — no todo secundario merece weight editorial).

## Verificación post-implementación

1. `npm run dev` → `/` → Hero idle/hover/focus/active (mouse) + DevTools mobile 375px (tap).
2. Misma verificación en sección `Precio`.
3. `npm run build` → tsc passing.
4. Grep red words en los 4 files modificados:
   ```bash
   grep -rn -E "TODO|FIXME|por ahora|para más tarde|después lo veo|just add|out of scope" \
     tailwind.config.js src/components/ui/Button.tsx \
     src/components/sections/Hero.tsx src/components/sections/Precio.tsx
   ```
   Cero matches.

---

## Out of scope (deliberado)

- Otros componentes que usen `variant="ghost"` (si aparecen en el grep 1). Cada caso requiere decisión propia — no todo secundario merece weight editorial.
- Analytics tracking del click. La landing no tiene infra de analytics; spec aparte si se agrega.
- Cambios al copy del Hero o de Precio. Intactos.
- Cambios al helper `whatsappLink` o constante `DEMO_REQUEST_MESSAGE`. Intactos.
- Variant nueva para Nav/Footer si quisieran weight similar. No piden hoy.
- A/B test del cambio. Sin infra de experimentation.

---

## Decoupling check

- La variant `ghost` original sigue existiendo, sin tocar. Cualquier consumidor actual que la use legítimamente como "secundario lite" no rompe.
- La variant `ghost-accent` es additiva — borrar el feature = revertir 4 files. Cero deuda residual.
- El token `shadow-offset-xs` es additivo a `boxShadow.extend`. Si en el futuro hay que retirar el feature: borrar la entry + variant + reemplazar `ghost-accent` por `ghost` en Hero/Precio.
- El componente `Button` sigue siendo el adapter único del lenguaje de botones — cero acoplamiento entre Hero/Precio y los internals del sistema visual.

---

## Self-review

- [x] Cero red words (`TODO|FIXME|por ahora|MVP|simplified|for later|out of scope` en sentido de deuda — el bloque "Out of scope" enumera decisiones deliberadas, no deuda).
- [x] Internal consistency: D1–D6 no se contradicen. Estados idle/hover/active/focus/disabled coherentes.
- [x] Scope focused → 4 files, single implementation plan.
- [x] Ambigüedad: cada decisión tiene reasoning explícito (mockup HTML disponible en `mockups/hero-secondary-cta-variants.html` para referencia visual).
- [x] Completeness: motion-reduce, focus ring coexistence, mobile tap, contrast, stacking sin overlap — todos cubiertos.
- [x] Decoupling: variant additiva, variant original intacta, token additivo, helpers/constantes intactos.
- [x] Schema/multi-tenant: N/A (landing pública).
- [x] Grounded: stack al día, patrón consistente con repo (offset shadows en frames + menu), Tailwind 3.4+ class composition estándar.

---

## Próximos pasos

1. User revisa este spec y avisa si quiere cambios.
2. `bi-plan` con este doc como input → implementation plan con tasks ordenadas (probablemente: token → variant → consumers → verificación).
3. `bi-execute` con el plan → two-stage review.
