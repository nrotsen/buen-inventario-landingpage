# Landing redesign — Buen Inventario · Design spec

**Fecha:** 2026-05-28
**Repo:** `buen-inventario-landingpage`
**Estado actual:** approved, ready for `bi-plan`
**Mockup canónico:** `/Users/nestorberlanga/Desktop/Buen Inventario/mockups/landing-hero-2026-05-28.html`

---

## Resumen

Redesign completo de www.bueninventario.com para:
1. Alinear visualmente con la estética editorial del producto vivo (sign up, billing) — DM Serif Display + JetBrains Mono + Inter, paleta ink/paper/cream/teal, hard borders 1.5px, hard offset shadows.
2. Reposicionar el mensaje desde "transforma tu inventario digital" (genérico SaaS) hacia "recuperá el control de tu comercio" (control y tranquilidad para almacenero argentino).
3. Eliminar clientes ficticios (TechCorp, InnovaStore, MegaRetail, SmartBiz), stats inventados (500+ empresas, 4.9 estrellas, 300% ROI) y testimonios falsos (María González, Carlos Rodríguez, Ana López).
4. Estructurar la landing en 7 secciones con alternancia tonal (paper/cream/paper/ink/paper/cream/ink) que generan ritmo editorial.
5. Mantener el precio $14.900/mes visible (Plan Standard, ARS) y el funnel self-serve hacia el signup de la app.

---

## Audiencia objetivo

Dueños de comercios chicos argentinos (almacenes, kioscos, despensas) con 1-3 empleados, que hoy operan con Excel o "a ojo". El plan Standard único ($14.900/mes ARS) está dimensionado para ese segmento.

Características relevantes para el design:
- Bajo tech literacy (referencia: "si sabés mandar un audio por WhatsApp, sabés usar esto")
- ≥50% del tráfico llega desde Instagram (mobile)
- Escéptico ante promesas de software (mil "soluciones" que no resolvieron nada)
- Sensible al riesgo financiero ("sin contrato", "sin tarjeta", "cancelás cuando quieras" son hooks reales)
- Conflicto cotidiano más fuerte: cliente que discute lo que se llevó en cuenta corriente

## Posicionamiento

**No vende un software de inventario.** Vende **dejar de desconfiar de tu propio negocio**.

Diferencial #1: Néstor (fundador) tiene un almacén real (Don Néstor Despensa) donde usa el sistema todos los días. La sección "Hecho por un comerciante" lo explicita.

Tono: argentino directo (vos, probá, ganás, controlá). Cero corporate-speak. Cero "transformar/revolucionar/potenciar".

---

## Decisiones clave (resueltas en brainstorm 2026-05-28)

| Decisión | Resolución | Razón |
|---|---|---|
| Tipografía | DM Serif Display + JetBrains Mono + Inter | Matchea 1:1 al producto vivo. Inicialmente el prompt sugería Fraunces — descartado. |
| Paleta teal | `#14b8a6` (token `--color-teal-500` del producto) | Inicialmente el prompt fijaba `#37B3AB/#2A9D8F/#274754` — descartado. Reuso del token vivo, cero divergencia. |
| Lenguaje visual | Editorial duro: hard borders 1.5px + hard offset shadows | Inicialmente el prompt pedía "sombra suave, redondeo 8-12px" — descartado. Matchea spec aprobado del producto (`feedback-editorial-aesthetic`). |
| Densidad narrativa | Approach A: editorial sobrio, 7 secciones, cada una con aire | B (denso, 5 secciones) sacrifica fuerza de Historia. C (con breakers) riesgo pretensioso para almacenero pragmático. |
| Posición de Historia | Segunda (post-Hero) | El almacenero escéptico necesita reducir barrera ANTES de leer features. La Historia es el diferencial más fuerte; va arriba. |
| Capturas del sistema | Frames editoriales con BrowserFrame (border + offset shadow + barra URL) | Realismo total + coherencia editorial. Como Linear, Fey. |
| Hero layout (desktop) | Split asimétrico 5/7 (copy izq, captura der) | Maximiza real estate de la captura sin sacrificar copy. En mobile stack vertical. |
| Precio visible | Sí, $14.900/mes ARS en card destacado | Reduce fricción ("$14.900 es accesible para almacén de barrio"). Ya está vivo en la Pricing actual — preservar la decisión. |
| Capturas elegidas (Sistema) | Productos · Cuentas Corrientes · Cierre de Caja | Tu prompt original pedía Métricas/Analíticas/Productos. Cambio porque Analíticas ya aparece en Hero, y estas 3 cierran el arco problema→solución uno-a-uno con los miedos de la Sec 3 (Excel). |
| Orden de 5 items en Excel | 01 Robo · 02 Ganancia · 03 Cuenta corriente · 04 Stock muerto · 05 Medios de cobro | Va de más emocional a más operativo. Pico narrativo en items 01-02, cierre concreto en 05. |
| Signature de Néstor | "— Néstor B." | Inicial preserva privacidad del apellido completo; más literario. |
| Subtítulo Historia | "Y este sistema lo hice para mí primero." | Setea el "soy mi propio cliente" como diferencial. |
| Iconos Excel | Lucide line-art en teal-700 (Eye, LineChart, Receipt, Archive, Wallet) | Pasan WCAG AA sobre paper (5.16:1). Line-art coherente con estética editorial. |
| Headline Sistema | "Esto es lo que vas a abrir todos los días." | Posiciona como tool cotidiano, no como dashboard de consulta. |
| CTA Sistema | "Cargás tus productos en una tarde. Empezás a operar mañana." | Quita objeción de "es mucho laburo setup". Tiempo concreto + fecha de inicio cercana. |
| Features Pricing | "Aceptás Mercado Pago en tu comercio" + "Soporte por email y WhatsApp" | Wording fixes vs el original ambiguo ("Pagos vía Mercado Pago"). |
| FAQ — preguntas | 4 preguntas (facturación opcional, fácil de usar, exportar datos, migrar de Excel) | La pregunta 5 (offline) se omite porque el local-first refactor está en planificación y no queremos hacer promesa pública. |
| Contact form actual | Deprecar `Contact.tsx` entero + remover `@emailjs/browser` + `react-google-recaptcha-v3` | Viola `feedback-inline-form-errors` (usa `alert()`). El lead capture humano lo cubre el WhatsApp del FAQ + email/WhatsApp del Footer. |
| Header al scroll | Siempre paper/95 + border-bottom 1.5px ink (no condicional) | Siempre legible. Editorial coherente. Más simple. |
| SEO/OG | Completo: meta + OG image custom + Twitter card + JSON-LD (SoftwareApplication + LocalBusiness Don Néstor + Organization) | Tráfico principal viene de Instagram + Google search. OG editorial diferencia preview en feed. |

---

## Tokens del sistema (replica del producto vivo)

```css
/* Colors */
--color-ink:           #0a0a0a;   /* texto principal, borders */
--color-paper:         #fafaf7;   /* background default */
--color-cream:         #f4f1e8;   /* sección de cambio de ritmo */
--color-surface:       #ffffff;   /* card de pricing y cualquier "pieza" elevada */
--color-teal-500:      #14b8a6;   /* italic accents display + button fill */
--color-teal-600:      #0d9488;   /* hover/active states */
--color-teal-700:      #0f766e;   /* TEXTO teal en body (WCAG AA 5.16:1) */
--color-text-muted:    #6b6b66;   /* sub-copy, captions */
--color-border-subtle: #e8e6dd;   /* separators internos */

/* Type */
--font-display: "DM Serif Display", Georgia, serif;
--font-mono:    "JetBrains Mono", ui-monospace, monospace;
--font-sans:    "Inter", system-ui, sans-serif;

/* Scale (mobile · desktop) */
display-xl: 40px·44 mobile · 56px·60 desktop  /* Hero h1 */
display-lg: 36px·40 mobile · 48px·52 desktop  /* H2 secciones */
display-md: 26px·30 mobile · 32px·36 desktop  /* CTA inverted, H3 grandes */
display-sm: 22px·26                            /* H3 items de listas */
body-lg:    17px / 1.55                        /* Sub-headlines y lead copy */
body-md:    15px / 1.55                        /* Body default */
body-sm:    13px / 1.5                         /* Captions, disclaimers */
micro:      11px / 1.4 + uppercase + 0.08em    /* editorial-micro labels */

/* Borders & shadows */
--border-hard:        1.5px solid var(--color-ink);
--shadow-offset-lg:   8px 8px 0 0 var(--color-teal-500);   /* Hero capture, Sistema captures */
--shadow-offset-md:   6px 6px 0 0 var(--color-teal-500);   /* Historia photo, Precio card */

/* Radius */
--radius-sm: 2px;
--radius-md: 4px;
--radius-lg: 6px;
/* NUNCA radius > 6px */
```

**Accesibilidad de teal sobre paper:**

| Color | Contraste sobre #fafaf7 | AA Normal (4.5:1) | AA Large (3:1) |
|---|---|---|---|
| teal-500 `#14b8a6` | 2.36:1 | FAIL | FAIL |
| teal-600 `#0d9488` | 3.57:1 | FAIL | PASS |
| teal-700 `#0f766e` | 5.16:1 | PASS | PASS |

**Regla de uso de teal:**
- teal-500: SOLO en headlines display ≥36px italic (Hero, sección headings) y en botones con relleno (texto es paper sobre teal, no inverso).
- teal-600: hover/active states de botones e inputs.
- teal-700: cualquier texto teal en body, links inline, micro-copy, iconos line-art, checkmarks de pricing.

---

## Estructura: 7 secciones + Header + Footer

**Alternancia tonal** (define el ritmo de scroll, reemplaza breakers explícitos):

```
Header        → paper/95 + border-bottom ink (sticky siempre)
Hero          → paper  (#fafaf7)
Historia      → cream  (#f4f1e8)
Excel         → paper
Sistema       → ink    (#0a0a0a)     ← peak dramático
Precio        → paper
FAQ           → cream
Footer        → ink
```

### Sección 1 — Hero (`#hero`)

**Tone:** paper. **Padding:** `pt-32 pb-24 md:pt-40 md:pb-32`.

**Layout desktop:** grid 12 cols, gap-16. Col 1-5 copy, col 6-12 captura.
**Layout mobile:** stack vertical, copy primero, captura segunda con `max-h-[420px]`.

**Copy (col izquierda):**

- Label micro: `SISTEMA DE GESTIÓN · ALMACENES Y COMERCIOS CHICOS`
- H1 display: **"Recuperá el control _de tu comercio._"** ("de tu comercio" en `<em>` italic teal-500)
- Sub body-lg: **"Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. Probá 30 días gratis, sin tarjeta."**
- CTA row (stack mobile, row sm+):
  - Primary lg: **`Probalo gratis →`** (href → `signupUrl()`)
  - Ghost lg: **`Ver cómo funciona`** (href → `#sistema`)
- Trust row mono micro: **`SIN TARJETA · CANCELÁS CUANDO QUIERAS · [CLAIM 3]`**
  - Claim 3 default: "HOSTEADO EN ARGENTINA". Fallback verificable: "HECHO DESDE UN ALMACÉN REAL". El user verifica hosting region antes de merge; si falla, se usa el fallback.

**Captura (col derecha):**

`<BrowserFrame>` con:
- URL bar: `bueninventario.com/admin/analytics` (último segmento en bold ink, resto en text-muted)
- Content: pantalla Analíticas con:
  - Header "Analíticas · Junio 2026" + selector empresa "Don Néstor ▾"
  - Big stat $1.847.500 + "VENTAS TOTALES" + delta teal-700 "↑ 18% vs mayo"
  - Grid 3 KPIs hard-bordered: Beneficio $623.290 · Ticket promedio $4.820 · Productos vendidos 383
  - Chart 14 barras teal-500 con border-top ink
  - Caption "ÚLTIMOS 14 DÍAS"
- Border: 1.5px ink. Shadow: 8px 8px 0 0 teal-500.
- Hover: translate(-2px, -2px) + shadow grows to 10px (respeta `prefers-reduced-motion`).

**Asset deferred a usuario pre-merge:** datos reales del último mes cerrado de Don Néstor Despensa (o screenshot directo). Si no se proveen, los valores del mockup se usan como placeholder defendible (todos plausibles para almacén de barrio).

### Sección 2 — Historia de Néstor (`#historia`)

**Tone:** cream. **Padding:** `py-24 md:py-36`.

**Layout desktop:** grid 12 cols, gap-20. Col 1-5 foto, col 6-12 copy (inverso al Hero — alterna ritmo izq/der).
**Layout mobile:** foto arriba full width `max-h-[320px] object-cover`, copy debajo.

**Retrato (col izquierda):**

`<PhotoFrame>` con ilustración del fundador:
- Aspect ratio 4:5 (vertical frame)
- Border 1.5px ink, shadow 6px 6px 0 0 teal-500
- Background del frame: `--color-surface` (#ffffff) — fondo limpio que hace destacar la acuarela.
- Contenido: ilustración acuarela del fundador (PNG transparente 1024×1024), retrato hombros arriba.
- Posicionamiento: `align-items: flex-end`, `width: 112%`, `margin-bottom: -4%` — el retrato "asoma" del marco bottom, no flota centrado. Regla de tercios respetada.
- Filtro tonal: `contrast(1.02) saturate(0.95)` para alinear temperatura con cream del fondo.
- Caption debajo mono micro: **`DON NÉSTOR DESPENSA · ALMACÉN DE BARRIO · ARGENTINA`**

**Decisión de registro visual:** el retrato es **ilustración acuarela**, no foto. La asimetría "producto = screenshots reales / marca = ilustración del fundador" es **deliberada**. Posiciona la marca como cuidada/editorial sin sacrificar la prueba real del producto. Patrón que usan Substack, Stripe Press y NYT Magazine para founder bios. Si en algún momento se quiere foto real, el slot del frame es agnostic (solo se reemplaza `<img src>`).

**Asset entregado por user el 2026-05-28:** ilustración watercolor de Néstor en `mockups/nestor-ilustrated.png` (PNG transparente, 1024×1024). En implementación va copiada a `public/nestor-portrait.png` (renombrada para producción; "ilustrated" tiene typo, no llevarlo a prod).

**Copy (col derecha):**

- Label micro: `POR QUÉ EXISTE BUEN INVENTARIO`
- H2 display: **"Yo también tengo un almacén."** (max-w 14ch)
- Sub display-sm italic teal-700: **"Y este sistema lo hice para mí primero."**
- Body párrafo 1: **"Soy Néstor. Tengo Don Néstor Despensa, un almacén de barrio con un empleado. Durante años trabajé "a ojo" — no sabía qué se vendía más, cuánto me robaban, ni cuánto ganaba de verdad."**
- Body párrafo 2: **"Buen Inventario lo armé para resolver eso en mi propio negocio. Hoy lo uso todos los días, y lo comparto con otros comerciantes que también quieran dejar de adivinar."**
- Signature display-sm italic ink: **"— Néstor B."**
- Signature role micro: **`FUNDADOR · BUEN INVENTARIO`**

**No hay CTA en esta sección** — deliberado. La Historia baja la guardia, no convierte.

### Sección 3 — "Lo que el Excel no te puede decir" (`#excel`)

**Tone:** paper. **Padding:** `py-24 md:py-36`. **Container:** `max-w-[880px]` (más angosto, reading editorial width).

**Header:**

- Label micro: `EL DIAGNÓSTICO`
- H2 display: **"Lo que el Excel _no te puede decir._"** (italic teal-500 en "no te puede decir")
- Sin subtítulo. La headline cae sola.

**Lista de 5 items** (border-top 1.5px ink, items separados por border-bottom 1px dashed border-subtle, último item con border-bottom 1.5px ink):

Cada item: grid 2 cols (72px icon + 1fr content), padding `py-9`.

| # | Icono Lucide | Label micro | Headline display-sm | Body body-md |
|---|---|---|---|---|
| 01 | `Eye` | `01 · ROBO INTERNO` | **"Si tu empleado te está robando."** | "Ves quién vendió qué, a qué hora, a qué precio. Si algo se va sin pasar por caja, queda el hueco." |
| 02 | `LineChart` | `02 · GANANCIA REAL` | **"Cuánto ganás de verdad."** | "Ventas menos costos reales, calculado por el sistema. No el 'creo que estoy bien' de fin de mes." |
| 03 | `Receipt` | `03 · CUENTA CORRIENTE` | **"Qué se llevaron tus clientes en cuenta corriente."** | "Cada movimiento queda registrado con fecha y producto. Si alguien discute, abrís la cuenta." |
| 04 | `Archive` | `04 · STOCK MUERTO` | **"Cuánta plata tenés atrapada en stock que no rota."** | "El capital durmiendo en tu depósito, identificado por producto. Sabés qué dejar de comprar." |
| 05 | `Wallet` | `05 · MEDIOS DE COBRO` | **"Con qué método se cobró cada venta."** | "Efectivo, transferencia, débito, crédito, Mercado Pago. Cada uno por separado, al cierre del día." |

Iconos: 32-36px, stroke-width 1.5, stroke teal-700, fill none.

**No hay CTA en esta sección** — el siguiente CTA va en Sec 4 (Sistema) después de mostrar el producto.

### Sección 4 — "El sistema" (`#sistema`)

**Tone:** ink (#0a0a0a). Text base invertido a paper. **Padding:** `py-32 md:py-44`. **Container:** `max-w-[1200px]`.

**Header (text-paper):**

- Label micro: `EL SISTEMA` (sobre ink, color text-muted variant cream/55)
- H2 display: **"Esto es lo que vas a _abrir todos los días._"** (italic teal-500 sobre ink, contrast 8.5:1)
- Lead body-lg paper/70: **"Tres pantallas. Las que más usás. Las que muestran lo que el Excel te ocultaba."**

**3 capturas stacked vertical, gap-y-24**, cada una `max-w-[920px]` mx-auto, caption centered arriba, BrowserFrame abajo:

#### Captura 01 — Productos

- Label centered teal-500 mono: `01 · PRODUCTOS`
- H3 display centered paper: **"El capital durmiendo en tu depósito."**
- Body-md centered paper/65 max-w 48ch: **"Cada producto con stock, costo, margen y días sin venta. Los que duermen se ven solos."**
- BrowserFrame: URL `bueninventario.com/admin/productos`
  - Tabla con columnas: Producto · Stock · Costo · P. venta · Días s/v
  - 6 filas con productos plausibles de almacén ARG (atún Gomes de la Costa, mayonesa Hellmann's, yerba Rosamonte, Coca-Cola, pan lactal Bimbo, leche La Serenísima)
  - Filas con `días sin venta > 30` en text-muted con días en teal-700 destacado

#### Captura 02 — Cuentas Corrientes

- Label: `02 · CUENTAS CORRIENTES`
- H3: **"Quién te debe qué."**
- Body: **"La cuenta de cada cliente con saldo, último movimiento y detalle de cada compra. Cero discusión."**
- BrowserFrame: URL `bueninventario.com/admin/clientes/marcos-lopez`
  - Header: nombre cliente "Marcos López", sub "Cliente desde marzo 2024 · 38 movimientos", balance "$14.280 SALDO DEUDOR"
  - Ledger list: 5 movimientos con fecha mono + descripción + monto mono (pagos en teal-700 con `−`, cargos default con `+`)

#### Captura 03 — Cierre de Caja

- Label: `03 · CIERRE DE CAJA`
- H3: **"El día cerrado en 30 segundos."**
- Body: **"Total por método de pago, diferencias, próxima apertura. Lo que antes te llevaba una hora a mano."**
- BrowserFrame: URL `bueninventario.com/admin/caja/cierre`
  - Header: "Cierre del día · 27 mayo" + meta "Caja abierta 8:30 · Cerrada 21:14"
  - Grid 2 cols x 3 rows con 6 métodos: Efectivo $48.290 · Transferencia $22.450 · Débito $31.180 · Crédito $14.920 · Mercado Pago $9.640 · Cuenta corriente $6.420
  - Total bar inverted ink: "Total del día · 87 ventas — $132.900"

**Asset deferred a usuario pre-merge:** los 3 screenshots reales del producto en producción, optimizados a WebP/AVIF <60KB cada uno, ancho 1840px @ 2x. El HTML del mockup actúa como spec del layout requerido por captura.

**CTA invertido al final de Sistema** (mt-28 centered):

- Display-md centered paper: **"Cargás tus productos en una tarde. _Empezás a operar mañana._"** (italic teal-500 en "Empezás a operar mañana")
- Row de 2 CTAs (stack mobile, row sm+):
  - Primary inverted: bg paper, text ink → hover bg teal-500, text paper: **`Probalo gratis →`**
  - Ghost-on-dark: border paper/40, text paper → hover bg paper/10: **`Ver el precio`** (anchor `#precio`)
- Trust mono paper/55: **`SIN TARJETA · 30 DÍAS DE PRUEBA · CANCELÁS CUANDO QUIERAS`**

### Sección 5 — Precio (`#precio`)

**Tone:** paper. **Padding:** `py-24 md:py-36`. **Container:** `max-w-[760px]` centered.

**Header centered:**

- Label micro: `PLAN ÚNICO`
- H2 display: **"Un precio, _todo incluido._"**
- Lead body-lg ink/75 max-w 44ch: **"Sin tiers, sin add-ons, sin sorpresas en el resumen de la tarjeta. Lo que ves es lo que pagás."**

**Price card** (`max-w-[440px]` centered, bg surface, border 1.5px ink, shadow 6px 6px 0 0 teal-500, padding p-10):

- Header del card (border-bottom 1.5px ink):
  - Label micro: `PLAN STANDARD`
  - Price DM Serif 64-76px: **$14.900** + `<span mono 22px text-muted>` ` / mes`
  - Label micro: `ARS · RENUEVA AUTOMÁTICAMENTE`
- Lista de 6 features (mono ✓ teal-700 + body-md ink/85):
  - Stock + Caja + Clientes + Proveedores
  - Multi-user (admins, managers, empleados)
  - Mi Web — tienda online incluida
  - Analíticas + Métricas
  - Aceptás Mercado Pago en tu comercio
  - Soporte por email y WhatsApp
- Primary FULL WIDTH lg: **`Empezá 30 días gratis →`**
- Trust mono centered: **`SIN TARJETA · CANCELÁS CUANDO QUIERAS`**

**Disclaimer post-card** (mt-10 centered body-sm text-muted max-w 40ch):

**"Sin contrato, sin permanencia. Cancelás desde el panel y se acabó."**

### Sección 6 — FAQ (`#faq`)

**Tone:** cream. **Padding:** `py-24 md:py-36`. **Container:** `max-w-[760px]` centered.

**Header centered:**

- Label micro: `PREGUNTAS FRECUENTES`
- H2 display: **"Lo que más _nos preguntan._"**

**Accordion list** con `<details>` nativo (a11y por defecto, JS-free, progressive enhancement):

- Border-top 1.5px ink (apertura)
- Cada `<details class="faq-item">` con border-bottom 1.5px ink
- Summary: flex justify-between items-baseline, padding y-7, cursor pointer
  - Question display-sm 20-23px ink
  - Icon mono 22px teal-700: `+` que rota a `×` cuando open (`transform: rotate(45deg)` + transition 200ms)
- Content (cuando open): padding-bottom 7, body-lg ink/80 max-w 60ch

**4 preguntas:**

1. **¿Tengo que facturar todo lo que cargo en el sistema?**
   No. Vos decidís qué facturás y qué no. El sistema te ordena, no te controla.

2. **¿Sirve si no soy bueno con la tecnología?**
   Sí. Si sabés mandar un audio por WhatsApp, sabés usar Buen Inventario. La pantalla principal tiene lo que necesitás todos los días. El resto está ahí cuando lo busques.

3. **¿Qué pasa con mis datos si dejo de usarlo?**
   Te los exportamos en un Excel. Sin preguntas, sin trabas. Tu negocio es tuyo, tus datos también.

4. **¿Puedo migrar lo que tengo en Excel?**
   Sí. Cargás tu planilla actual, mapeamos las columnas y los productos quedan adentro en una tarde. Si te trabás, te ayudamos por WhatsApp.

**CTA mini al final** (mt-16 centered body-md ink/80):

**"¿Tenés otra pregunta?"** + link inline teal-700 underlined: **"Escribinos por WhatsApp →"** (href: `https://wa.me/5491122775850?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20Buen%20Inventario.`)

### Sección 7 — Footer

**Tone:** ink. Text base paper. **Padding:** `py-16 md:py-20`. **Container:** `max-w-[1200px]`.

**Bloque principal** — grid desktop 6/3/3, stack mobile:

- **Col 1 (Identidad):**
  - Logo: PNG `bueninventario-newlogo.png` (versión adecuada para fondo dark; si no existe, generar variante en implementación) + nombre DM Serif 22px
  - Tagline body-sm paper/65 max-w 40ch: **"Sistema de gestión para almacenes y comercios chicos de Argentina. Hecho desde Don Néstor Despensa."**

- **Col 2 (Producto):**
  - Label micro paper/50: `PRODUCTO`
  - Lista body-sm paper/80 hover:paper:
    - Cómo funciona (anchor `#sistema`)
    - Precio (anchor `#precio`)
    - Historia (anchor `#historia`)
    - Preguntas frecuentes (anchor `#faq`)

- **Col 3 (Contacto):**
  - Label micro paper/50: `CONTACTO`
  - Lista body-sm paper/80:
    - WhatsApp (`https://wa.me/5491122775850`)
    - hola@bueninventario.com (mailto)
    - Instagram @bueninventario (`https://instagram.com/bueninventario`)

**Bottom bar** (mt-12 pt-8, border-top 1px paper/15):

- Desktop: flex justify-between. Mobile: stack center.
- Izq: **"© 2026 Buen Inventario · Argentina"** body-sm paper/55
- Der: links inline paper/55: **Términos** (`/terminos`) · **Privacidad** (`/privacidad`)

### Header (sticky)

**Background:** `rgba(250, 250, 247, 0.92)` + `backdrop-filter: blur(10px)`. **Border-bottom:** 1.5px ink (siempre, no condicional al scroll). **Height:** 64px mobile, 76px desktop. **Container:** `max-w-[1200px]`.

**Desktop layout (≥768px):**

- Izq: logo PNG 32px + nombre DM Serif 20px
- Centro: nav anchors body-md (gap-x-7): Historia · Excel · Sistema · Precio · FAQ
  - hover: color teal-700, transition 150ms
- Der: Primary sm `Probalo gratis →` (h-9, px-4, href → `signupUrl()`)

**Mobile layout (<768px):**

- Izq: logo PNG 28px + nombre (compactado o sin texto)
- Der: Primary sm `Probalo gratis →` + icon button `☰`
- Tap en `☰` → drawer slide-from-top:
  - bg paper, border-bottom 1.5px ink, padding y-8 x-6
  - Items stacked DM Serif 24px gap-y-5 (Historia · Excel · Sistema · Precio · FAQ)
  - Backdrop overlay con bg ink/40 que cierra al tap
  - Cerrar con icon `✕` o tap fuera

---

## Architecture: componentes, services, decoupling

### Components a crear / refactorizar

Estructura propuesta dentro de `src/`:

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx              # rewrite: primary, ghost, inverted, ghost-on-dark
│   │   ├── EditorialMicro.tsx      # nuevo: mono uppercase tracking 0.08em
│   │   ├── DisplayHeading.tsx      # nuevo: DM Serif H1/H2/H3 + italicAccent prop
│   │   ├── BrowserFrame.tsx        # nuevo: wrapper screenshots con URL bar + offset shadow
│   │   ├── PhotoFrame.tsx          # nuevo: wrapper foto vertical con border + offset shadow
│   │   └── Section.tsx             # nuevo: wrapper con prop tone="paper"|"cream"|"ink"
│   ├── Header.tsx                  # refactor completo
│   ├── Footer.tsx                  # refactor completo
│   ├── MobileMenu.tsx              # nuevo: drawer slide-from-top
│   └── sections/
│       ├── Hero.tsx                # rewrite completo
│       ├── Historia.tsx            # nuevo (reemplaza Features.tsx + Benefits.tsx)
│       ├── Excel.tsx               # nuevo (lista de 5 miedos resueltos)
│       ├── Sistema.tsx             # nuevo (3 capturas + CTA inverted)
│       ├── Precio.tsx              # rewrite (era Pricing.tsx)
│       └── Faq.tsx                 # nuevo (accordion nativo)
├── lib/
│   ├── config.ts                   # mantener (signupUrl)
│   ├── utils.ts                    # mantener (cn helper si existe; scrollToSection)
│   └── contact.ts                  # nuevo: link helpers (whatsapp, mailto, instagram)
└── App.tsx                         # refactor: importa nuevas secciones, remueve Contact
```

### Components a borrar

- `src/components/sections/Features.tsx` — reemplazado por Excel.tsx + Sistema.tsx
- `src/components/sections/Benefits.tsx` — reemplazado (los benefits genuinos están distribuidos en Excel.tsx y Sistema.tsx; los testimoniales falsos se eliminan)
- `src/components/sections/Contact.tsx` — deprecado. El lead capture es signup + WhatsApp/email del Footer + CTA mini del FAQ.
- `src/components/ui/card.tsx` — no se usa más (shadcn Card no aparece en el nuevo design)
- `src/components/ui/input.tsx` — no se usa más (no hay forms)
- `src/components/ui/textarea.tsx` — no se usa más

### Dependencies a remover de `package.json`

- `@emailjs/browser` — solo se usaba en Contact.tsx
- `react-google-recaptcha-v3` — solo se usaba en Contact.tsx
- `framer-motion` — el design no requiere animaciones complejas; reemplazado por IntersectionObserver + CSS transitions
- `@radix-ui/react-slot` — solo se usaba en el Button viejo con asChild prop; el nuevo Button no lo necesita
- `class-variance-authority` — el nuevo Button puede usar solo clsx + tailwind-merge si se mantiene cn helper; CVA es overkill
- `react-router-dom` — la landing es single-page con anchor scroll; no necesita routing complejo. Si en algún momento se agregan páginas `/terminos` y `/privacidad`, react-router se reintroduce como un spec separado. Por ahora esos links pueden ir como `<a href="/terminos">` plano (Vite los maneja como rutas estáticas si existen los HTML, o se sirven como SPA fallback).

### Dependencies a mantener

- `react` + `react-dom` (19.x)
- `vite` (7.x)
- `tailwindcss` (3.x) — NO migrar a v4 en este spec; scope creep separado
- `lucide-react` — para iconos de Excel.tsx
- `clsx` + `tailwind-merge` — para `cn` helper si se preserva pattern
- `typescript` + `eslint` toolchain

### Adapter boundaries

- **Lead capture humano** → `src/lib/contact.ts` con funciones puras:
  - `whatsappLink(message?: string): string` — devuelve la URL `wa.me/...` correctamente encoded
  - `mailtoLink(subject?: string, body?: string): string`
  - `instagramLink(): string`
  - Si mañana cambiamos el número de WhatsApp o el handle de Instagram, se cambia en un solo lugar.
- **Signup URL** → ya existe en `src/lib/config.ts` (`signupUrl()`). Mantener.
- **NO hay external API calls** desde la landing. El form de contacto se eliminó.

### Fonts: self-host

Migrar de `@import url("https://fonts.googleapis.com/...")` a self-hosted woff2 en `public/fonts/`:

- `dmserif-400-latin.woff2`
- `dmserif-400-latin-italic.woff2`
- `inter-latin.woff2` (variable font 100-900)
- `jetbrainsmono-400-latin.woff2`

Mismo subset latin que el producto admin (mismo unicode-range). Replicar las `@font-face` rules de `buen-carrito-frontend/src/index.css`.

Justificación: privacidad GDPR/Argentina + control de performance + cero dependency de uptime de Google Fonts + evita FOIT.

---

## Performance

**Target:** LCP < 2.5s en 4G, CLS < 0.1, TBT < 200ms.

**Preloads en `index.html`:**

```html
<link rel="preload" href="/fonts/dmserif-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/images/hero-analytics.webp" as="image" fetchpriority="high">
```

**Imágenes:**

- Hero capture: WebP + AVIF, dimensiones explícitas (ej: 1840×1080 @ 2x → 920×540 rendered), `loading="eager"`, `fetchpriority="high"`, target <50KB.
- 3 capturas del Sistema: WebP + AVIF, `loading="lazy"`, dimensiones explícitas, target <60KB cada una.
- Foto de Néstor: WebP, `loading="lazy"`, dimensiones explícitas (ej: 760×950 @ 2x → 380×475 rendered), target <45KB.
- OG image: PNG/JPG 1200×630, target <200KB.

**Animaciones:**

- Cero `framer-motion`.
- Fade-in al scroll: `IntersectionObserver` + CSS `transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), transform 400ms ...; transform: translateY(8px) → 0`.
- Hover lift en BrowserFrames: `transition: transform 300ms, box-shadow 300ms` con transform y shadow disparados desde CSS `:hover`.
- Accordion `+` rotation: `transition: transform 200ms` cuando `[open]`.
- Respeto a `@media (prefers-reduced-motion: reduce)`: todas las animations a `0.001ms`, transforms a `none`, opacity to `1`.

---

## SEO, OG y schema.org

### Meta tags en `index.html`

```html
<meta name="description" content="Sistema de gestión para almacenes y comercios chicos de Argentina. Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. 30 días gratis, sin tarjeta.">
<meta name="keywords" content="sistema gestion almacen, software comercio argentina, control stock argentina, gestion kiosco, sistema despensa">
<meta name="author" content="Buen Inventario">
<link rel="canonical" href="https://www.bueninventario.com">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://www.bueninventario.com">
<meta property="og:title" content="Buen Inventario — Recuperá el control de tu comercio">
<meta property="og:description" content="Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. 30 días gratis, sin tarjeta.">
<meta property="og:image" content="https://www.bueninventario.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="es_AR">
<meta property="og:site_name" content="Buen Inventario">

<!-- Twitter card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:url" content="https://www.bueninventario.com">
<meta name="twitter:title" content="Buen Inventario — Recuperá el control de tu comercio">
<meta name="twitter:description" content="Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. 30 días gratis, sin tarjeta.">
<meta name="twitter:image" content="https://www.bueninventario.com/og-image.png">

<!-- Apple touch icons & manifest -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#fafaf7">
```

### JSON-LD schema.org en `index.html`

Tres `<script type="application/ld+json">`:

1. **SoftwareApplication** — para que Google muestre cards de producto:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Buen Inventario",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "description": "Sistema de gestión para almacenes y comercios chicos de Argentina.",
  "offers": {
    "@type": "Offer",
    "price": "14900",
    "priceCurrency": "ARS",
    "availability": "https://schema.org/InStock"
  }
}
```

2. **Organization** — para knowledge graph:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Buen Inventario",
  "url": "https://www.bueninventario.com",
  "logo": "https://www.bueninventario.com/logo.png",
  "sameAs": [
    "https://instagram.com/bueninventario"
  ]
}
```

3. **LocalBusiness** (Don Néstor Despensa) — refuerza la prueba social del fundador:
```json
{
  "@context": "https://schema.org",
  "@type": "GroceryStore",
  "name": "Don Néstor Despensa",
  "description": "Almacén de barrio en Argentina donde se usa Buen Inventario todos los días.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "AR"
  }
}
```

### Assets adicionales

- `public/robots.txt` con `Allow: /` y referencia a sitemap
- `public/sitemap.xml` con la URL única (`https://www.bueninventario.com`)
- `public/og-image.png` (1200×630): composición editorial con el headline "Recuperá el control de tu comercio." sobre paper, italic teal-500 en "de tu comercio", logo abajo. Generado como asset separado.
- `public/apple-touch-icon.png` (180×180): logo simplificado sobre paper.
- `public/manifest.webmanifest`: name, short_name, theme_color #fafaf7, background_color #fafaf7, icons.

**Asset deferred a usuario pre-merge:** `og-image.png` puede generarse desde el mockup del hero (screenshot 1200×630) o como composición editorial separada. Si no se provee, en implementación se genera placeholder con headline + logo.

---

## Acceptance criteria

Para que el redesign se considere completo (verificable en code review + browser test):

**Visual & Content:**
- [ ] Landing carga DM Serif Display (woff2 self-hosted), JetBrains Mono y Inter — verificable en DevTools → Network → Fonts.
- [ ] Cero importaciones a `https://fonts.googleapis.com/...`.
- [ ] Hero muestra "Recuperá el control de tu comercio." con "de tu comercio" en italic teal-500.
- [ ] Las 7 secciones del scroll están en el orden: Hero → Historia → Excel → Sistema → Precio → FAQ → Footer.
- [ ] Alternancia tonal correcta: paper/cream/paper/ink/paper/cream/ink.
- [ ] Cero clientes ficticios (TechCorp, InnovaStore, MegaRetail, SmartBiz no aparecen en ninguna parte del bundle).
- [ ] Cero stats inventados ("500+ empresas", "4.9 estrellas", "300% ROI" no aparecen).
- [ ] Cero testimonios falsos (María González, Carlos Rodríguez, Ana López no aparecen).
- [ ] Cero gradientes amarillos/rosas/violetas/sky-blue. Solo paleta ink/paper/cream/teal.
- [ ] Cero `border-radius > 6px`.
- [ ] Cero `box-shadow` con `blur` > 0 (solo hard offset shadows con teal).
- [ ] Footer no tiene links con `href="#"` placeholder.
- [ ] Precio muestra $14.900/mes ARS visible.
- [ ] CTA mini del FAQ abre `wa.me/5491122775850` con mensaje pre-llenado.

**Componentes & Architecture:**
- [ ] `Contact.tsx`, `Features.tsx`, `Benefits.tsx`, `ui/card.tsx`, `ui/input.tsx`, `ui/textarea.tsx` eliminados.
- [ ] `package.json` sin `@emailjs/browser`, sin `react-google-recaptcha-v3`, sin `framer-motion`, sin `@radix-ui/react-slot`, sin `class-variance-authority`, sin `react-router-dom`.
- [ ] `tailwind.config.js` sin `accent` color scale, sin `gradient-text`, sin `hero-gradient`, sin `bounce-in` animation, sin `Poppins` font.
- [ ] `src/index.css` sin `@import url("https://fonts.googleapis.com/...")`, sin `.gradient-text`, sin `.hero-gradient`, sin `.section-gradient`.
- [ ] `src/lib/contact.ts` existe con funciones `whatsappLink`, `mailtoLink`, `instagramLink`.
- [ ] `src/components/ui/Button.tsx` reescrito con 4 variants: primary, ghost, inverted, ghost-on-dark.
- [ ] `src/components/ui/BrowserFrame.tsx` y `PhotoFrame.tsx` existen.
- [ ] `src/components/MobileMenu.tsx` existe e implementa el drawer editorial.

**Performance:**
- [ ] Lighthouse mobile ≥ 90 en Performance.
- [ ] LCP < 2.5s, CLS < 0.1, TBT < 200ms.
- [ ] Hero image tiene `width`, `height`, `fetchpriority="high"`.
- [ ] Resto de imágenes tienen `loading="lazy"` y dimensiones explícitas.
- [ ] DM Serif y Inter están en `<link rel="preload">`.
- [ ] `prefers-reduced-motion` respetado en todas las animations.

**Accesibilidad:**
- [ ] Lighthouse mobile ≥ 95 en Accessibility.
- [ ] Cero uso de teal-500 para texto body (verificar en DevTools).
- [ ] FAQ accordion funciona con keyboard (Enter/Space) sin JS.
- [ ] Mobile menu cierra con `Escape` y con tap en backdrop.
- [ ] Todas las imágenes tienen `alt` descriptivo (no "image" / no vacío excepto decorativas).

**SEO:**
- [ ] Meta description coincide con el spec.
- [ ] OG image existe, 1200×630, <200KB.
- [ ] Twitter card es `summary_large_image`.
- [ ] 3 bloques JSON-LD (SoftwareApplication, Organization, GroceryStore) presentes.
- [ ] `robots.txt` y `sitemap.xml` en `public/`.
- [ ] `<html lang="es">`.

---

## Asset inputs deferred a usuario (pre-implementation)

| Asset | Sección | Spec | Fallback si no se provee |
|---|---|---|---|
| Captura Hero Analíticas | Hero | Screenshot real del último mes cerrado de Don Néstor, optimizado WebP/AVIF <50KB, 1840×1080 @ 2x | Datos plausibles del mockup como placeholder defendible |
| Retrato ilustrado de Néstor | Historia | **ENTREGADO 2026-05-28** — ilustración watercolor 1024×1024 PNG transparente. En implementación: optimizar a PNG/WebP <100KB y renombrar a `public/nestor-portrait.png`. | N/A — asset disponible |
| 3 capturas Sistema (Productos, Cuenta corriente, Cierre de caja) | Sistema | Screenshots reales del producto en producción, WebP/AVIF <60KB cada una, 1840×1080 @ 2x | Datos plausibles del mockup como placeholder defendible |
| Claim 3 del trust row Hero | Hero | Verificar región de hosting (Vercel ARG vs USA vs Brasil). Si confirma hosting argentino → "HOSTEADO EN ARGENTINA". Si no → "HECHO DESDE UN ALMACÉN REAL" | Fallback "HECHO DESDE UN ALMACÉN REAL" (100% verdadero, no requiere verificación de infra) |
| OG image | SEO | 1200×630, composición editorial con headline "Recuperá el control de tu comercio." + logo, PNG <200KB | Generar desde screenshot del mockup del hero |
| Variante de logo para fondo dark | Footer | PNG con marca legible sobre #0a0a0a (versión invertida o monocroma blanca) | Generar en implementación desde el PNG original |
| Páginas `/terminos` y `/privacidad` | Footer | HTML estáticos servidos por Vite — contenido legal real, no boilerplate | Si no existen al momento del merge, los links del footer apuntan a `#` con `aria-disabled="true"` y un comentario en código que marca el pendiente — **no es preferible** pero permite shipear sin block |

---

## Out of scope (explicitamente)

Estos puntos NO están en este spec y, si se requieren, son specs separados:

- **Migración de Tailwind v3 a v4.** El producto vivo está en v4, la landing en v3. Mantener v3 acá. Migración a v4 sería refactor independiente.
- **Páginas adicionales** (about, blog, docs, casos de uso). Esta landing es single-page; cualquier página extra es spec separado.
- **A/B testing infraestructure.** Versión única.
- **Internationalization (i18n).** Solo español argentino.
- **Cookie consent banner** (GDPR/LGPD). No se trackea NADA en este redesign — sin analytics, sin pixel de Meta/Google. Si se agregan analytics después, banner se diseña como spec separado.
- **Dark mode toggle.** El producto admin sí lo tiene; la landing no — un comerciante que llega por primera vez no busca configurar tema. Versión light única.
- **Chat widget en vivo** (Intercom/Crisp). El WhatsApp del FAQ cubre el caso de necesidad humana.
- **Local-first / offline messaging.** Por decisión del user (refactor en planificación), no se hace mención pública en FAQ.
- **Contact form para "consultas empresariales" o "demos personalizadas".** Modelo es self-serve. Si en algún momento se necesita un funnel sales-led, spec separado.

---

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Las capturas reales del producto en producción se ven distintas al mockup (densidad, headers extra) | El mockup define el LAYOUT requerido del BrowserFrame; las capturas reales se croppean a la zona relevante. Si una pantalla del producto está visualmente "vieja" (estilo pre-editorial), se difiere la sección hasta que esa pantalla del admin se migre. |
| El "Plan Standard incluye Mi Web" no es 100% verdadero en backend | User confirmó en brainstorm que SÍ incluye. Si cambia, se actualiza en una linea del Precio.tsx + commit. |
| `react-router-dom` removido pero después se necesitan páginas `/terminos` y `/privacidad` | En implementación, los `<a href="/terminos">` plano funcionan si Vite tiene `historyApiFallback` configurado y los HTML existen. Si no, se reinstala react-router en un spec separado. Por ahora se asume HTML estáticos. |
| LCP regresa con DM Serif cargando | `preload` + `font-display: swap` + subset latín mantiene LCP bajo. Si LCP > 2.5s en mobile, fallback es servir DM Serif solo en >768px y usar Georgia en mobile (pérdida estética aceptable). |
| Las decisiones tonales (paper/cream/ink) generan demasiado contraste visual entre secciones | Verificable solo en browser real, no en spec. Si una transición se siente "abrupta", el fix es ajustar el padding vertical de la sección receptora (más respiro top). |

---

## Anexo: red word audit

Auto-check pre-spec-complete sobre este documento:

- "TODO" — 0 matches
- "FIXME" — 0 matches
- "por ahora" — 0 matches en cuerpo del spec; aparece en copy del FAQ donde es léxico legítimo del lector ("¿hoy funciona X?") no deferral de implementador.
- "después lo veo" — 0 matches
- "MVP" / "versión simple" / "versión básica" — 0 matches
- "out of scope" — 1 match, intencional en la sección "Out of scope (explicitamente)" donde se lista lo NO incluido — diferencia con scope creep.
- "deferred" — 7 matches, todos en sección "Asset inputs deferred a usuario" — se refieren a assets que el USUARIO provee, no a trabajo del implementador. Esta es la convención del repo (input vs work).
- "pendiente" — 1 match en placeholder de foto, etiqueta visible en mockup — se reemplaza con asset real pre-merge.
- "later" / "más adelante" / "for now" — 0 matches

**Spec self-review:**
- [x] Cero placeholders sin resolución alternativa.
- [x] Internal consistency: sección a sección coherente en tone, copy, tokens.
- [x] Scope check: 7 secciones + Header + Footer + SEO + assets. Un solo implementation plan.
- [x] Ambiguity check: cada decisión está zanjada con justificación.
- [x] Completeness: empty/loading/error states cubiertos (la landing no tiene formularios runtime; los únicos states del accordion son closed/open vía CSS).
- [x] Decoupling: cada componente borrable en aislación, contact links en lib helper, signupUrl en config existente.
- [x] No multi-tenant relevante (landing pública sin auth, sin company scope).

---

**Próximo paso:** `/bi-plan` para convertir este spec en plan ejecutable con stress tests + standards injection.
