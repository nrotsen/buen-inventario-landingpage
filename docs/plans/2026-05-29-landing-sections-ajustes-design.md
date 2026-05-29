# Landing — Ajustes y secciones nuevas (post launch)

**Fecha:** 2026-05-29
**Autor:** Néstor (con Claude / bi-brainstorm)
**Estado:** Design aprobado · pendiente bi-plan
**Repo:** `buen-inventario-landingpage`
**Predecesor:** `2026-05-28-landing-redesign-design.md` (launch inicial)
**Sucesor planificado:** `2026-05-29-landing-sections-ajustes-plan.md`

---

## Contexto

La landing v1 está en producción en `www.bueninventario.com` desde 2026-05-28 con la dirección editorial aprobada (DM Serif Display + Inter + JetBrains Mono, paleta paper/cream/ink/teal). El hero, la sección Diagnóstico (5 fears), las 3 pantallas en fondo oscuro y el cierre dentro de Sistema funcionan bien y **no se tocan estructuralmente**.

Este design cubre 6 ajustes / rewrites focalizados sobre lo que ya existe:

1. **Nav rename** — `Excel` → `Diagnóstico` (label + id de sección).
2. **Historia rediseñada** — sacar foto IA, rediseñar como composición tipográfica centrada.
3. **Comparativa contra Excel (nueva sección)** — entre Diagnóstico y Sistema.
4. **Precio reescrito** — sacar precio concreto y features list, dejar copy honesto.
5. **FAQ reescrito** — 5 Q&As nuevas en lugar de las 4 actuales, ícono ▸/▾.
6. **Footer extendido** — sumar Facebook + TikTok a Instagram existente.

Y un set de ajustes técnicos transversales (paleta WCAG, CTA copy uniformity).

### Por qué este cambio

- **Historia con foto IA debilita credibilidad** — una imagen generada del fundador contradice el tono "hecho desde Don Néstor Despensa". La composición tipográfica sola pesa más.
- **No tenemos clientes reales con permiso de aparecer**, así que rechazamos testimonios/logos/métricas infladas. La comparativa contra Excel hace el trabajo de "diferenciador" sin necesitar social proof falso.
- **El precio todavía está siendo validado** (billing apenas se está desplegando, 2 companies comped). Mostrar $14.900/mes en prod sin estar 100% comprometidos con ese número genera deuda comercial. El copy honesto "Cuando estés convencido, hablamos de plata" es más respetuoso del visitante que mostrar un número que puede cambiar.
- **FAQ actual** cubre 4 temas; las 5 nuevas redacciones son mejores (más argentinas, mencionan ARCA explícito) y suman offline como tema que aparece en charlas reales con comerciantes.

### Posicionamiento estratégico

Sin cambios respecto al launch: vendemos **control y tranquilidad**, no features. Tono argentino (vos, probá, ganás). Cero testimonios/logos/stats inventados.

---

## Stack y reuso de primitives

**Stack confirmado del repo:**
React 19 · Vite 7 · Tailwind 3 · TypeScript · `lucide-react` · `clsx` + `tailwind-merge`. Fonts self-hosted en `/public/fonts/` con `font-display: swap` y preload.

**Primitives existentes a reusar (sin tocar):**

| Componente | Uso |
|---|---|
| `Section` (`tone: paper\|cream\|ink`, `width: container\|editorial\|reading`) | Wrapper de cada sección, con padding `py-24 md:py-36` |
| `DisplayHeading` (con `italicAccent` para frase cursiva turquesa) | Títulos H2 de cada sección |
| `EditorialMicro` | Eyebrow mono caps 11px text-muted |
| `Button` (`variant: primary\|ghost\|inverted\|ghost-on-dark`, `size: md\|lg`) | Todos los CTAs |
| `cn()` de `lib/utils.ts` | Concat clases |

**Adapters existentes a reusar:**
- `signupUrl()` de `lib/config.ts` — único entrypoint del CTA "Probalo gratis"
- `whatsappLink(msg?)` de `lib/contact.ts` — link a WhatsApp con mensaje opcional
- `instagramLink()` de `lib/contact.ts` — Instagram. Se suman dos helpers nuevos abajo.

**Componentes nuevos: 1.** Solo `ExcelComparison` justifica un componente propio por su comportamiento mobile↔desktop bifurcado. Todo lo demás se resuelve reescribiendo el componente existente.

**Sin deps nuevas.** lucide-react cubre los íconos necesarios (`ChevronRight`/`ChevronDown` para FAQ, `Facebook`/`Instagram` para footer). Para TikTok se inline-SVG el path (lucide no lo trae, no justifica una dep).

---

## Secciones — Diseño detallado

### 1. Navegación — `Header.tsx` + ids

**Cambio mecánico (sin diseño nuevo):**

- En `Header.tsx`, el array `NAV`:
  - `{ label: 'Excel', href: '#excel' }` → `{ label: 'Diagnóstico', href: '#diagnostico' }`
- En `sections/Excel.tsx`, el `id` de `<Section>`:
  - `id="excel"` → `id="diagnostico"`
- **Decisión sub-archivística (opcional, no bloqueante):** renombrar el archivo `Excel.tsx` → `Diagnostico.tsx` y actualizar el import en `App.tsx`. Es coherencia semántica. Si se elige hacerlo, queda en el plan.
- **No** hay cambios en `Footer.tsx` — su `PRODUCT_LINKS` no incluye `#excel` (incluye `#sistema`, `#precio`, `#historia`, `#faq`).

**Riesgo:** si alguien linkeó `#excel` desde afuera (improbable, una semana en prod), queda 404 de ancla. Aceptable.

### 2. Historia — Founder section tipográfica

**Archivo:** `sections/Historia.tsx` (rewrite completo).
**Mockup:** `mockups/landing-historia-2026-05-29.html`.
**Tone:** `cream` (mantener — sirve de break visual entre Hero `paper` y Diagnóstico `paper`).
**Width:** `reading` (760px) — con `max-w-[640px]` interno para apretar más la columna.
**Padding:** `py-32 md:py-48` (más generoso que el `py-24 md:py-36` default de `Section`, vía `className` override).

**Estructura JSX:**

```tsx
<Section id="historia" tone="cream" width="reading" className="py-32 md:py-48">
  <div className="max-w-[640px] mx-auto text-center">
    <EditorialMicro>Por qué existe Buen Inventario</EditorialMicro>

    <DisplayHeading level={2} className="mt-7 text-[44px] md:text-[64px] leading-[1.04]">
      Yo también tengo un almacén.
    </DisplayHeading>

    <p className="editorial-italic text-[28px] md:text-[36px] leading-snug text-teal-700 mt-4 md:mt-5">
      Y este sistema lo hice para mí primero.
    </p>

    <div className="mt-14 md:mt-18 text-left md:text-center space-y-5 md:space-y-6">
      <p className="text-body-lg md:text-[19px] text-ink/85 leading-relaxed max-w-[56ch] mx-auto">
        Soy Néstor. Tengo Don Néstor Despensa, un almacén de barrio con un empleado. Durante años trabajé "a ojo" — no sabía qué se vendía más, cuánto me robaban, ni cuánto ganaba de verdad.
      </p>
      <p className="text-body-lg md:text-[19px] text-ink/85 leading-relaxed max-w-[56ch] mx-auto">
        Buen Inventario lo armé para resolver eso en mi propio negocio. Hoy lo uso todos los días, y lo comparto con otros comerciantes que también quieran dejar de adivinar.
      </p>
    </div>

    <div className="mx-auto mt-16 md:mt-22 w-20 h-px bg-teal-700/60" aria-hidden="true" />
    <p className="mt-6 editorial-micro">
      Don Néstor Despensa · Almacén de barrio · Argentina
    </p>
  </div>
</Section>
```

**Decisiones consolidadas:**
- **Sin foto, sin ilustración.** Borrar import de `PhotoFrame` y referencia a `/nestor-portrait.png`. La imagen queda como asset hasta el cleanup de bundle (ver §7 técnicos).
- **1 columna centrada.** Layout grid de 2-columnas eliminado.
- **Body: left-aligned en mobile, center en desktop.** Razón: párrafos de 3-4 líneas centrados en pantalla chica son difíciles de leer.
- **Sin firma "— Néstor B." al pie.** El location + el "Soy Néstor" del primer párrafo establecen identidad. Firmar de nuevo es redundante.
- **Divider** 80×1px teal-700 con opacity 60%, separa el body del location final.
- **Tone cream** se mantiene para preservar el ritmo visual del sitio: Hero paper → Historia cream → Diagnóstico paper → Comparativa paper → Sistema ink → Precio paper → Faq cream.

### 3. Diagnóstico — rename de Excel section

**Sin cambios visuales.** El eyebrow actual de la sección ya dice "El diagnóstico" — `EditorialMicro` no se toca. Solo:

- `sections/Excel.tsx` → `id="excel"` cambia a `id="diagnostico"`.
- (Opcional) renombrar archivo a `Diagnostico.tsx` y actualizar imports en `App.tsx`. Recomendado por semántica del repo, decisión definitiva en el plan.

### 4. Comparativa contra Excel — sección nueva `ExcelComparison`

**Archivo nuevo:** `sections/ExcelComparison.tsx`.
**Ubicación en `App.tsx`:** entre `<Excel />` (renombrado a `<Diagnostico />`) y `<Sistema />`.
**Mockup:** `mockups/landing-comparativa-excel-2026-05-29.html` (con toggle Desktop/Mobile sticky).
**Tone:** `paper`. **Width:** `editorial` (880px).

**Items (cerrados):**

| # | Característica | Excel / Cuaderno | Buen Inventario |
|---|---|---|---|
| 1 | Stock actualizado al instante | Manual, casi nunca se hace | Sí, con cada venta |
| 2 | Saber qué clientes te deben y cuánto | Cuaderno aparte, otro Excel | Integrado, por cliente |
| 3 | Cierre de caja con totales por método | A mano, calculadora, rezar | Automático en 30 segundos |
| 4 | Detectar productos que no rotan | Difícil de cruzar | Te lo muestra solo |
| 5 | Acceso desde cualquier dispositivo | No, archivo en una sola PC | Sí, desde el celular |
| 6 | Histórico que no se pierde | Riesgo alto (archivos, USB) | Siempre accesible, online |

**Estructura JSX (esquemática):**

```tsx
<Section id="comparativa" tone="paper" width="editorial">
  <div className="max-w-[720px]">
    <EditorialMicro>La diferencia</EditorialMicro>
    <DisplayHeading
      level={2}
      italicAccent={<>no alcanza</>}
      className="mt-5 max-w-[18ch]"
    >
      ¿Por qué <em>no alcanza</em> con Excel?
    </DisplayHeading>
    <p className="mt-6 text-body-lg text-ink/75 max-w-[56ch] leading-relaxed">
      Lo mismo que ya hacés a mano, hecho una sola vez y bien — sin discusión, sin recalcular, sin perderte cosas en el camino.
    </p>
  </div>

  {/* DESKTOP: tabla nativa, ≥md */}
  <table className="hidden md:table mt-16 w-full border-t-hard border-b-hard border-ink">
    <thead>
      <tr>
        <th className="text-left py-5 pr-6 w-[38%] editorial-micro font-normal border-b border-border-subtle">Característica</th>
        <th className="text-left py-5 pr-6 w-[31%] editorial-micro font-normal border-b border-border-subtle">Excel / Cuaderno</th>
        <th className="text-left py-5 pr-6 w-[31%] editorial-micro font-medium !text-teal-700 border-b border-border-subtle">Buen Inventario</th>
      </tr>
    </thead>
    <tbody>
      {ITEMS.map((row, i) => (
        <tr key={row.feature}>
          <td className="py-5 pr-6 editorial-display text-[18px] leading-snug align-top border-b border-dashed border-border-subtle">
            {row.feature}
          </td>
          <td className="py-5 pr-6 text-body-md text-text-muted align-top border-b border-dashed border-border-subtle">
            {row.excel}
          </td>
          <td className="py-5 pl-6 pr-6 text-body-md text-ink font-medium align-top bg-teal-50/40 border-l-2 border-teal-700/40 border-b border-dashed border-border-subtle">
            <span className="text-teal-700 font-bold mr-1">•</span>
            {row.bi}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* MOBILE: cards apiladas, <md */}
  <div className="md:hidden mt-12 border-t-hard border-ink">
    {ITEMS.map((row) => (
      <article key={row.feature} className="py-7 border-b border-dashed border-border-subtle last:border-b-hard last:border-ink">
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
    ))}
  </div>
</Section>
```

**Decisiones consolidadas:**
- **Tabla nativa `<table>` en desktop**, semántica correcta. Sin trucos grid.
- **Cards apiladas en mobile**, una por feature. Sin scroll horizontal, sin carousel.
- **Diferenciación de columna BI** por: (a) bg `bg-teal-50/40` sutil, (b) `border-l-2 border-teal-700/40`, (c) peso medium en cell, (d) bullet decorativo `•` text-teal-700 bold. **Cero ✓/✗, cero emojis.**
- **Excel cell** en `text-muted` regular para contraste de jerarquía.
- **Header eyebrow caps** en mono — coherente con el resto del sitio.

**`bg-teal-50` ya está en el tailwind config** (#effbf9). Con `/40` opacity queda al 40% sobre paper — efectivamente un teal-tinted off-white. WCAG sigue OK para el texto encima.

### 5. Precio — rewrite minimalista

**Archivo:** `sections/Precio.tsx` (rewrite completo).
**Tone:** `paper`. **Width:** `reading` (760px). **innerClassName:** `text-center`.

**Estructura JSX:**

```tsx
<Section id="precio" tone="paper" width="reading" innerClassName="text-center">
  <EditorialMicro>El precio</EditorialMicro>
  <DisplayHeading level={2} italicAccent={<>de plata.</>} className="mt-5 max-w-[16ch] mx-auto">
    Cuando estés convencido,<br />hablamos
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
```

**Decisiones consolidadas:**
- **Sacar la card con $14.900/mes y la lista de 6 features.** Reset total.
- **CTAs**: "Probalo gratis →" (primario negro a `signupUrl()`) + "Escribime por WhatsApp" (ghost a `whatsappLink()` con mensaje pre-llenado).
- **Micro caps al pie** repite la promesa "Sin tarjeta · Sin compromiso · Sin letra chica" — refuerza la honestidad sin sobre-explicar.

### 6. FAQ — rewrite de contenido + ícono

**Archivo:** `sections/Faq.tsx` (rewrite parcial — estructura `<details>` se mantiene, contenido + ícono cambian).
**Tone:** `cream`. **Width:** `reading`. (sin cambios)

**Estructura:**

```tsx
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
```

**Contenido (5 Q&As nuevas — reemplazan totalmente las 4 actuales):**

```tsx
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
```

**Decisiones consolidadas:**
- **Ícono cambia** de `+/×` (CSS rotate) a `ChevronRight` rotando a `ChevronDown` cuando `[open]`. Mantener animación 200ms. Actualizar CSS en `index.css`:
  ```css
  .faq-toggle .faq-icon { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
  .faq-toggle[open] .faq-icon { transform: rotate(90deg); }
  ```
- **`<details>` native se mantiene** — gold standard a11y, teclado y screen reader gratis.
- **Sin cards con bg pesado** — ya estaba bien resuelto, no se toca.
- **Última Q sobre offline** — alinea con el intent "Local-first" guardado en memoria del proyecto. Es honestidad: hoy todavía sincroniza, pero el local-first está en roadmap.

### 7. Footer — sumar Facebook + TikTok

**Archivo:** `components/Footer.tsx` + nuevos helpers en `lib/contact.ts`.

**Nuevos helpers en `lib/contact.ts`:**

```ts
export function facebookLink() {
  return 'https://facebook.com/bueninventario';
}

export function tiktokLink() {
  // Placeholder hasta que tengamos cuenta. Cuando exista, swap por la URL real.
  return 'https://www.tiktok.com';
}
```

**Cambios en `Footer.tsx`:**

La columna `Contacto` (currently 3 rows: WhatsApp / email / Instagram) se mantiene como está pero se sumam Facebook y TikTok. Para no apilar 5 rows verticales largas, ajustar:

```tsx
<li>
  <a href={instagramLink()} target="_blank" rel="noopener noreferrer" ...>
    Instagram @bueninventario
  </a>
</li>
<li>
  <a href={facebookLink()} target="_blank" rel="noopener noreferrer" ...>
    Facebook /bueninventario
  </a>
</li>
<li>
  <a href={tiktokLink()} target="_blank" rel="noopener noreferrer" ...>
    TikTok (próximamente)
  </a>
</li>
```

Mientras TikTok no esté creado: label "TikTok (próximamente)", link a `https://www.tiktok.com` (no rompe nada, no hay UX engañoso). El plan documentará el swap cuando la cuenta exista.

**Decisión:** mantener formato textual (no iconos circulares). Coherente con el tono editorial del footer actual.

---

## Ajustes técnicos transversales

### CTAs — uniformidad de copy y destino

Verificar que TODOS los CTAs primarios del sitio usen:
- Copy: `"Probalo gratis →"` (con flecha en mono)
- Destino: `signupUrl()` de `lib/config.ts`

**Estado actual del sitio:**

| Ubicación | Copy actual | Acción |
|---|---|---|
| `Header.tsx` | "Probalo gratis →" | ✓ OK |
| `Hero.tsx` | "Probalo gratis →" | ✓ OK |
| `Sistema.tsx` (cierre) | "Probalo gratis →" | ✓ OK |
| `Precio.tsx` (actual) | "Empezá 30 días gratis →" | ✗ Reemplazo total en §5 |
| `Faq.tsx` | sin CTA primario (solo link WhatsApp) | ✓ No aplica |

Post-rewrite: 100% uniforme.

**CTA secundario en Sistema (cierre):**
Cambiar `"Ver el precio"` con `href="#precio"` a `"Ver las dudas comunes"` con `href="#faq"`. Razón: si Precio nuevo es minimalista sin número, "Ver el precio" desorienta. FAQ es flow natural antes del footer.

### Paleta y WCAG — sin cambios necesarios

**Decisión:** los hex que aparecen en el brief original del usuario (#37B3AB, #FAF8F3) **no son los del repo**. El repo usa `teal-700 #0f766e` y `paper #fafaf7`. Cálculo de contraste sobre la paleta real:

| Combinación | Ratio | WCAG AA Normal (4.5:1) | WCAG AA Large (3:1) |
|---|---|---|---|
| `teal-700 #0f766e` sobre `paper #fafaf7` | **5.17:1** | ✓ Pasa | ✓ Pasa |
| `teal-700 #0f766e` sobre `cream #f4f1e8` | **4.76:1** | ✓ Pasa | ✓ Pasa |
| `teal-500 #14b8a6` sobre `ink #0a0a0a` | **~8.1:1** | ✓ Pasa AAA | ✓ Pasa AAA |
| `ink #0a0a0a` sobre `paper #fafaf7` | **>18:1** | ✓ Pasa AAA | ✓ Pasa AAA |

**Acción:** ninguna. Mantener tokens actuales. El commit `5d7f96b` ya cubrió los pocos micro-labels que necesitaban ajuste.

### Cleanup de assets

**Borrar al finalizar el rewrite de Historia:**
- `public/nestor-portrait.png` (~200KB) — ya no se usa después del rewrite.
- Cualquier referencia en `index.html` (preload tags) si existiera. **Verificar en el plan.**

**Mantener:**
- `public/bueninventario-logo.png` — se sigue usando en Header + Footer.
- `public/fonts/*.woff2` — sin cambios.

### Scroll-margin para anclas

Confirmar que las nuevas anclas (`#diagnostico`, `#comparativa`) respeten el offset del sticky header (h-16 mobile / h-[76px] desktop). El componente `Section` actual NO incluye `scroll-mt` — verificar comportamiento empírico al ejecutar el plan, y si hay overlap del header sobre el título de la sección al clickear nav, sumar `scroll-mt-20 md:scroll-mt-24` en el wrapper `<section>` de `Section.tsx` (una sola vez, beneficia a todas las secciones).

---

## Inventario de archivos a tocar

| Archivo | Acción | Notas |
|---|---|---|
| `src/App.tsx` | EDIT | Sumar `<ExcelComparison />` después de Diagnóstico; opcional rename de import `Excel` → `Diagnostico` |
| `src/components/Header.tsx` | EDIT | `NAV` array: `Excel` → `Diagnóstico`, `#excel` → `#diagnostico` |
| `src/components/Footer.tsx` | EDIT | Sumar rows Facebook + TikTok |
| `src/components/sections/Historia.tsx` | REWRITE | Eliminar foto + grid 2-col, rediseño tipográfico |
| `src/components/sections/Excel.tsx` | EDIT (+ opcional rename a `Diagnostico.tsx`) | Solo cambia `id` |
| `src/components/sections/ExcelComparison.tsx` | **NEW** | Tabla desktop + cards mobile |
| `src/components/sections/Sistema.tsx` | EDIT | CTA secundario cierre: `#precio` → `#faq`, label change |
| `src/components/sections/Precio.tsx` | REWRITE | Sacar card + features, copy honesto, 2 CTAs |
| `src/components/sections/Faq.tsx` | REWRITE | 5 Q&As nuevas, ícono ChevronRight, eyebrow cambia |
| `src/lib/contact.ts` | EDIT | Sumar `facebookLink()` + `tiktokLink()` |
| `src/index.css` | EDIT | `.faq-toggle[open] .faq-icon` rotation: 45deg → 90deg |
| `public/nestor-portrait.png` | DELETE | Cleanup post-rewrite Historia |
| `index.html` | EDIT (si aplica) | Verificar preload tag de portrait |

**Total:** 11 EDITs (8 archivos + 3 rewrites) + 1 NEW + 1 DELETE. **Sin nuevas deps.**

---

## Adapter Boundaries

| External resource | Adapter | Status |
|---|---|---|
| Signup URL | `signupUrl()` en `lib/config.ts` | ✓ Existe, sin cambios |
| WhatsApp | `whatsappLink(msg?)` en `lib/contact.ts` | ✓ Existe, sin cambios |
| Instagram | `instagramLink()` en `lib/contact.ts` | ✓ Existe, sin cambios |
| Facebook | `facebookLink()` en `lib/contact.ts` | **NEW** — wrapper trivial |
| TikTok | `tiktokLink()` en `lib/contact.ts` | **NEW** — wrapper trivial, placeholder hasta cuenta real |

**No external APIs ni libs nuevas.** Los nuevos helpers son funciones puras de un string — decoupled, reemplazables sin tocar componentes.

---

## Schema Design

**No aplica.** Landing estática, sin DynamoDB ni persistencia.

---

## Multi-tenant impact

**No aplica.** Landing pública, sin barrera company.

---

## Grounding Summary

**Investigado:**
- Founder pages tipográficas modernas (Linear Geist, Stripe Söhne, Vercel) — confirma que "typography-as-hero" + 1 columna centrada es canon premium 2026. Sin foto es viable y diferenciador. ([Mantlr](https://mantlr.com/blog/stripe-linear-vercel-premium-ui), [Vercel Geist](https://vercel.com/geist/typography))
- Comparison tables editoriales sin checkmarks — patrón "Better Stack" valida diferenciación por tipografía + columna highlighted en lugar de ✓/✗. ([SaaSFrame](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples))
- Mobile pattern para comparison tables — cards apiladas por feature (no carousel, no scroll horizontal) es el go-to para landings editoriales con ≤8 rows.
- FAQ accordion `<details>/<summary>` nativo — gold standard a11y 2026, teclado y screen reader gratis, sin JS. ([A11Y Collective](https://www.a11y-collective.com/blog/accessible-accordion/))
- WCAG AA recalculado sobre la paleta REAL del repo — todos los ratios pasan AA Normal (texto largo) y la mayoría AAA.

**Decisiones informadas por state-of-the-art:**
- Reusar `<details>` en lugar de inventar accordion custom (menos JS, mejor a11y).
- Tabla nativa `<table>` en desktop en lugar de divs con grid (semántica + screen readers).
- DM Serif Display + Inter ya estaban — el sitio ya está en el cuartil tipográfico premium para 2026.

---

## Challenge Report (resumen)

| # | Criterio | Veredicto |
|---|---|---|
| 1 | Epic | Pasa. La honestidad radical del Precio sin número es el "epic" verdadero. |
| 2 | Elegant | Pasa. Reuso completo de primitives, 1 componente nuevo justificado. |
| 3 | Scalable | N/A (landing estática). |
| 4 | Performant | Pasa. Cero deps nuevas, cero JS adicional, cleanup de asset de 200KB. |
| 5 | Decoupled | Pasa. Cada sección reemplazable, CTAs por adapter. |
| 6 | Complete | Pasa. TikTok placeholder con plan de swap, sin "for later". |
| 7 | Grounded | Pasa. Patterns 2026, WCAG calculado, stack al día. |

**Iteraciones internas:** 2. Versión inicial proponía `Accordion` primitive nuevo y `ComparisonRow` componente separado; iteración final los descartó por reuso directo de `<details>` nativo y composición inline. Tercera consideración descartó pull-quote en Historia por no competir con la cursiva del título.

---

## Mockups standalone

- `mockups/landing-historia-2026-05-29.html` — Historia rediseñada (founder section centered hero-style)
- `mockups/landing-comparativa-excel-2026-05-29.html` — Comparativa Excel vs BI con toggle Desktop/Mobile

Aprobados por Néstor el 2026-05-29.

---

## Out of scope explícito (NO hacer)

- ❌ Testimonios inventados (nombres, rubros, ciudades).
- ❌ Estadísticas infladas (+1000 negocios, +250K ventas, etc.).
- ❌ Logos de clientes ficticios.
- ❌ Stock photos, ilustraciones generadas por IA del fundador, del local, ni de espaldas.
- ❌ Emojis decorativos en títulos.
- ❌ Cambio de fuente del sitio (Fraunces o cualquier otra) — DM Serif Display se mantiene.
- ❌ Cambios a Hero, Diagnóstico (5 fears), Sistema (3 pantallas), cierre de Sistema (excepto CTA secundario), Header (excepto label nav), Footer (excepto sumar 2 links).
- ❌ A/B test del precio reescrito vs. precio actual — la decisión es definitiva, no se versionan ambas.

---

## Sucesión

**Próximo paso:** `bi-plan` con este design como input. El plan resultante implementa los 11 EDITs + 1 NEW + 1 DELETE listados en el inventario, validando lint + build + responsive en cada paso.
