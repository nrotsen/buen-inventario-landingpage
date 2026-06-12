# Hero "Solicitar demo" CTA — Design Spec

**Fecha:** 2026-06-12
**Repo:** `buen-inventario-landingpage`
**Status:** Approved — pasa a `bi-plan`

---

## Problema

El hero de la landing tiene 2 CTAs: `Probalo gratis` (primary, signup self-serve) y `Ver cómo funciona` (ghost, anchor a `#sistema`). Falta un path explícito para el visitante que prefiere **hablar antes de probar** — escenario común en comercios chicos argentinos que prefieren contacto humano por WhatsApp antes de crear cuenta.

Hoy el contacto por WhatsApp existe pero está en secciones inferiores (Precio + Faq). Un visitante con intent alto de demo tiene que scrollear hasta el final para encontrarlo.

---

## Goal

Permitir que el visitante del hero arranque una conversación de WhatsApp con el owner del producto en un click, con mensaje pre-poblado claro de intent de demo. Cero fricción, cero formulario.

---

## Architecture

Reemplazo del segundo botón del hero (`Ver cómo funciona`) por un nuevo `Solicitar demo` que abre WhatsApp con mensaje pre-cargado. Reutiliza el helper `whatsappLink()` existente en `src/lib/contact.ts` (número canónico `5491122775850`, encoding correcto via `encodeURIComponent`). Cero JS adicional — es un `<a>` con `target="_blank"`.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind + editorial tokens (`ink`, `paper`, `teal-*`, `text-muted`, `font-mono`)
- `<Button>` component existente con variant `ghost`
- `whatsappLink(message?)` helper de `src/lib/contact.ts`

---

## Decisions tomadas

### D1 — Placement: Hero, reemplaza `Ver cómo funciona`

El user eligió hero directamente. Razón: el visitante con intent de demo está en los primeros 5 segundos de la visita, no esperando scrollear. El anchor `#sistema` (de "Ver cómo funciona") es low-conversion comparado con un canal de contacto directo. El visitante curioso que quiere explorar sin contactar sigue teniendo el header sticky para navegar y el scroll natural — la pérdida del anchor no rompe la exploración.

### D2 — Copy del botón: `Solicitar demo`

Match con el lenguaje SaaS B2B argentino estándar. Alternativas evaluadas: `Pedir demo` (menos formal), `Quiero una demo` (más larga), `Ver demo` (ambiguo — sugiere video). `Solicitar demo` queda en 14 caracteres, encaja en el `<Button size="lg">` sin overflow en mobile.

### D3 — Mensaje pre-poblado: explícito sobre la conversación

```
Hola Néstor, quiero agendar una demo de Buen Inventario. Me contás cómo es?
```

Más rico que los otros mensajes del codebase (`quiero saber el precio` / `tengo una pregunta`) porque la demo implica conversación bidireccional, no solo respuesta. La pregunta abierta (`Me contás cómo es?`) invita a Néstor a iniciar el handoff de inmediato sin un round-trip extra.

Vive como constante exportada `DEMO_REQUEST_MESSAGE` en `lib/contact.ts` para reuso futuro (eg. si se agrega un botón demo también en Precio o Sistema).

### D4 — Target + rel: nueva tab + seguridad

`target="_blank"` para no perder al visitante si tiene que cargar WhatsApp Web. `rel="noopener noreferrer"` por security (evita que el target manipule `window.opener` de la landing).

### D5 — A11y: `aria-label` explícito

`aria-label="Solicitar demo por WhatsApp"` porque el texto visible no menciona WhatsApp y screen readers necesitan saber que el click sale de la página al canal externo. Pattern alineado con WCAG 2.2 para enlaces que abren apps externas.

### D6 — Variant: `ghost`, NO `primary`

Mantiene la jerarquía existente: `Probalo gratis` (signup self-serve gratis = path preferido por el negocio) sigue siendo primary, `Solicitar demo` es secundario. Si se invierte la jerarquía, se quitan leads de signup que convierten más alto que demo handoff.

---

## Files que cambian

| Archivo | Tipo | Cambio |
|---|---|---|
| `src/lib/contact.ts` | MOD | Agregar `export const DEMO_REQUEST_MESSAGE` |
| `src/components/sections/Hero.tsx` | MOD | Reemplazar el segundo `<Button>` (Ver cómo funciona → Solicitar demo) + import del helper y constante |
| `src/components/ui/Button.tsx` | VERIFY (posible MOD) | Confirmar que cuando `as="a"`, los props `target` y `rel` se pasan al `<a>`. Si NO los pasa, agregarlo |

**Files que NO cambian:** ninguna otra sección, ningún estilo global, ningún test.

---

## Data Flow

```
[Visitante click "Solicitar demo"]
  ↓
<a href={whatsappLink(DEMO_REQUEST_MESSAGE)} target="_blank" rel="noopener noreferrer">
  ↓
Browser abre wa.me/5491122775850?text=Hola%20N%C3%A9stor%2C%20quiero%20agendar%20una%20demo...
  ↓
Mobile: WhatsApp app se abre con el mensaje listo para enviar
Desktop: api.whatsapp.com → "Continue to chat" → WhatsApp Web/desktop
```

Cero state, cero red, cero handler de JS.

---

## Adapter Boundaries

- `whatsappLink()` ya es el adapter canónico de WhatsApp en este repo. Toda mención al número, formato `wa.me`, y encoding pasa por ahí.
- `DEMO_REQUEST_MESSAGE` queda en `lib/contact.ts` para mantener single source of truth de copy de mensajes pre-poblados, junto al número y email.
- El componente Hero NO conoce el formato del link ni el número — solo pasa el mensaje al helper.

---

## Multi-tenant impact

N/A — landing pública, sin tenants. El número de WhatsApp es global del producto, no per-company.

---

## Loading / Empty / Error states

N/A — es un link estático. No hay carga, no hay estado.

**Caso edge documentado:** si el visitante no tiene WhatsApp instalado en desktop, va a caer en `api.whatsapp.com` con la opción de WhatsApp Web (login con QR). Es el comportamiento default y aceptable — el visitante sabe que es un canal WhatsApp porque el `aria-label` lo declara.

---

## Mobile + a11y

- Botón `size="lg"` → touch target ≥48px alto (Apple HIG ≥44px ✓).
- Mobile viewport: el hero tiene `flex flex-col sm:flex-row gap-3`, los dos botones quedan stacked vertical en mobile. El "Solicitar demo" no overflowea (14 chars + padding).
- A11y: `aria-label="Solicitar demo por WhatsApp"` declara el canal externo. Focus visible heredado del Button (Radix + Tailwind ring tokens).

---

## Out of scope (NO entran en este spec)

- Sticky floating WhatsApp icon (descartado por el user — eligió Hero exclusivamente). Si en algún momento se quiere, es spec aparte.
- Tracking analytics del click (eg. GA event `click_demo_cta`). No hay analytics en la landing hoy; si se agrega, va por separado.
- Botón demo en otras secciones (Precio, Sistema). El user pidió hero only.
- Variantes A/B de copy. Sin infra de experimentation hoy.
- Reemplazar el resto de los `whatsappLink(...)` que usan strings inline (`Faq.tsx`, `Precio.tsx`) por constantes exportadas. Es deuda menor, fuera de alcance del feature pedido.

---

## Self-review

- [x] Cero red words (grep clean — verificado abajo).
- [x] Cero ambigüedad: cada decisión tiene reasoning explícito.
- [x] Internal consistency: las decisiones D1-D6 no se contradicen.
- [x] Scope focused → 2 archivos MOD + 1 VERIFY, single implementation plan.
- [x] Decoupling: el feature es eliminable revirtiendo 2 files sin tocar nada más. `DEMO_REQUEST_MESSAGE` queda en `contact.ts` aunque borres el hero edit (no es deuda — es lib utility).
- [x] Completeness: target/rel/aria-label/mobile/edge case desktop sin WhatsApp todos cubiertos.

---

## Próximos pasos

1. User revisa este spec y avisa si quiere cambios.
2. `bi-plan` con este doc como input → implementation plan con tasks ordenadas.
3. `bi-execute` con el plan → review en dos fases.
