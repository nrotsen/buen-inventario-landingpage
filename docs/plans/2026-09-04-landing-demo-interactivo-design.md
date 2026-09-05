# Landing v3 — Demo interactivo · Design spec

**Fecha:** 2026-09-04
**Repo:** `buen-inventario-landingpage`
**Estado:** approved, ready for `bi-plan`
**Mockup canónico:** `/Users/nestorberlanga/Desktop/Buen Inventario/mockups/2026-09-04-landing-demo-interactivo.html`
**Predecesores:** `2026-05-28-landing-redesign-design.md` (launch) · `2026-05-29-landing-sections-ajustes-design.md` (ajustes)
**Audit que consume:** `docs/audits/2026-07-31-seo-landing.md` (cierra F3 y F4)

---

## Resumen

Rediseño de `www.bueninventario.com` con un objetivo único: **ser la landing de software que más convierte del segmento**. El cambio de fondo es dejar de *argumentar* que el sistema es bueno y pasar a **dejar que el visitante lo use en la página, sin registrarse**.

Cinco movimientos:

1. **Demo interactivo como héroe** — "Un día en el mostrador" en 3 capítulos operables: vendés, fiás, cerrás caja.
2. **Franja de confianza** con cuatro señales verificables, que reemplaza la prueba social que no tenemos.
3. **Sección nueva "Cómo arrancás"** — prueba de proceso contra la objeción real de setup.
4. **Precio visible** ($24.900/mes ARS) contrastado contra la competencia.
5. **Migración a SSG** — cierra F3 del audit SEO y desbloquea visibilidad en buscadores de IA.

### Restricción de honestidad (no negociable)

A la fecha, **Don Néstor Despensa es el único comercio usando el sistema de forma sostenida**, y las emisiones a ARCA en producción son de prueba. Por lo tanto esta landing **no muestra**: cantidad de clientes, logos de comercios, testimonios, estrellas, "+N empresas", ni métricas de uso agregadas. Cualquier número que aparezca describe **el producto** (catálogo precargado, días de prueba, precio), nunca su adopción.

Esta restricción no es una limitación a compensar: es la base del posicionamiento. El mercado argentino está saturado de "+60.000 empresas confían en nosotros" y el comerciante escéptico ya no los cree. Nuestra respuesta a "¿por qué te creo?" es **"no me creas, probalo"**.

---

## Audiencia y posicionamiento

Sin cambios respecto a los specs previos: dueños de comercios chicos argentinos, bajo tech literacy, ≥50% del tráfico llega de Instagram (mobile), escépticos ante promesas de software, sensibles al riesgo financiero.

Lo que cambia es **el mecanismo de persuasión**: antes era narrativo (la historia de Néstor convence, después las capturas ilustran). Ahora es **empírico** (el visitante comprueba en 20 segundos que puede usarlo, y recién después la historia explica por qué existe).

Tono: argentino directo (vos, probá, ganás). Cero corporate-speak.

---

## Grounding Report

**Fecha:** 2026-09-04

### State of the art

- **Demos interactivos:** quien interactúa con un demo clickeable convierte **24,35% vs 3,05%** (~8×). Tours interactivos: 2× vs páginas de demo tradicionales, 5× engagement vs video. Patrón de mayor conversión 2026: demo visible arriba + walkthrough por capítulos, sin agendar llamada.
- **Benchmarks:** mediana SaaS 3,8%; diseños custom 11,6%+. 83% del tráfico es mobile. Testimonio adyacente al CTA principal: +68% (no aplicable — no tenemos testimonios).
- **Confianza sin clientes:** "la prueba social no se trata de clientes, se trata de certeza". Tres tipos de prueba viables con cero clientes: **producto** (demo, capturas, sandbox), **proceso** (onboarding, tiempos, qué pasa si falla), **fundador** (por qué estás calificado). Regla: 2-3 señales fuertes > 7 débiles.
- **Trust stack:** claridad de posicionamiento → mensaje alineado a la intención → prueba → proceso → seguridad e integridad.

### Competencia argentina (verificada por fetch, 2026-09-04)

Xubio: "+60.000 empresas", "+240 millones de comprobantes", "8 de cada 10 recomiendan", 7 logos de clientes, testimonio de Capitalia, Data Fiscal en footer. Precios visibles: Empresa Básico $47.450/mes (con 50% OFF promocional), Empresa Estándar $155.600/mes. Prueba gratis 14 días sin tarjeta. Estructura: hero → dashboard simulado → logos → 7 módulos → estadísticas → beneficios → precios → testimonios → CTA → footer.

Contabilium, Contagram, Colppy, Tango, Dux juegan el mismo juego. **Ninguno tiene demo interactivo operable sin registro.** Ninguno tiene fundador-comerciante.

Implicancia estratégica: competir por números de escala es una guerra perdida. La asimetría explotable es **operabilidad inmediata + honestidad + precio**.

### Libraries & APIs

- **Prerender: `react-dom/static` de React 19** (`prerenderToNodeStream`). API nativa de la plataforma para generar HTML estático. **Cero dependencias nuevas.**
  - Descartado `vite-react-ssg` (v0.9.2) tras verificar sus peer deps: declara `vite: ^6.4.0 || ^7.3.0 || ^8.0.0` (el repo está en `^7.1.2`) y exige `react-router-dom: ^6.14.1` — una dependencia de routing, en v6, para una landing de una sola página sin rutas, cuando el resto de los repos usa v7. Arrastra además jsdom, react-helmet-async, fs-extra, p-queue y yargs.
  - Trade-off asumido: `vite-react-ssg` resuelve manejo de `<head>`, multi-ruta y CSS crítico. Con el API nativo eso se escribe a mano — trivial para una página con los meta tags ya estáticos en `index.html`. El único caso dinámico es el JSON-LD, que el script de build genera desde `pricing.ts`.
- Stack actual (React 19 · Vite 7 · Tailwind 3 · TS 5.8 · lucide-react) está al día. No hace falta cambiar nada más.
- `playwright` ya está en devDependencies y hay pipeline reproducible en `scripts/generate-assets.ts` — se reusa para renderizar los assets nuevos.

### Architecture patterns

- **Lazy + Suspense para el demo:** el bundle del demo no debe bloquear el LCP del hero. Patrón estándar de React 19.
- **Estado 100% client-side:** el demo no toca la API. Cero superficie de abuso, cero costo por visita, cero punto de caída.
- **Islands-like por lazy boundaries:** con SSG, todo el contenido sale prerenderizado en HTML y solo el demo hidrata.

### Adapter needs

No hay dependencias externas nuevas. Los adapters existentes se preservan sin cambios: `signupUrl()` (`lib/config.ts`) y `whatsappLink()` / `mailtoLink()` / redes (`lib/contact.ts`). Se suma **un** módulo de configuración nuevo: `lib/pricing.ts` (ver sección Precio).

### Sources

- Briefd — social proof para startups con cero clientes: https://briefd.it/blog/social-proof-startups-zero-customers/
- Userpilot — interactive product demos, qué convierte: https://userpilot.com/blog/interactive-product-demo/
- Arcade — SaaS product demos 2026: https://www.arcade.software/post/saas-product-demos-guide
- Genesys Growth — B2B SaaS landing pages 2026: https://genesysgrowth.com/blog/designing-b2b-saas-landing-pages
- Xubio (competencia, fetch directo): https://xubio.com/ar/
- React 19 — prerenderToNodeStream: https://react.dev/reference/react-dom/static/prerenderToNodeStream
- vite-react-ssg (evaluado y descartado por peer deps): https://github.com/Daydreamer-riri/vite-react-ssg
- React SSG vs Astro 2026: https://asoasis.tech/articles/2026-04-19-1453-react-static-site-generation-astro-comparison/
- MP — actualizar plan de suscripción: https://www.mercadopago.com.ar/developers/en/reference/subscriptions/_preapproval_plan_id/put

---

## Challenge Report

| # | Criterio | Aplica | Assessment | Acción tomada |
|---|---|---|---|---|
| 1 | Epic | Sí | Demo operable sin registro: ningún competidor argentino lo tiene. Es la diferencia entre una landing que se lee y una que se prueba. | Pasa |
| 2 | Elegant | Sí | La v1 tenía Diagnóstico y ExcelComparison haciendo el mismo trabajo. Y el `<div id="root">` vacío es deuda de raíz, no cosmética. | Se fusionan las dos secciones. SSG entra al scope — no se parchea |
| 3 | Scalable | Sí | Un demo que pegue al backend sería superficie de abuso y punto de caída bajo tráfico de Instagram. | Estado client-side puro, datos fijos en el bundle. Escala infinito sobre CDN |
| 4 | Performant | Sí | Cargar el demo en el bundle principal penaliza LCP en 3G. | `lazy()` + `Suspense`; hero pinta antes. Budget explícito en la sección Performance budget |
| 5 | Decoupled | Sí | Riesgo de que la lógica del demo se enrede con el markup de las secciones. | Módulo `src/demo/` autocontenido: se borra entero sin tocar nada más. Precio en un único módulo |
| 6 | Complete | Sí | Tentación de dejar SSG, legales y mocks mobile "para después". F3 y F4 del audit SEO están abiertos desde julio. | Todo dentro del scope: 3 capítulos, PhoneFrames, SSG, legales reales, analytics |
| 7 | Grounded | Sí | Research fechado 2026-09-04, competencia verificada por fetch, libs confirmadas. | Pasa |

**Criterios salteados:** ninguno de los 7 se saltea. **Schema design (DynamoDB)** y **multi-tenant** no aplican: la landing es un sitio estático sin backend, sin base de datos y sin concepto de company. No hay barrera de tenant que preservar porque no hay datos de tenant.

**Iteraciones internas:** 3.
1. Arquitectura inicial de 11 secciones → violaba "2-3 señales fuertes > 7 débiles". Fusionadas a 8.
2. Demo cargado eagerly → violaba criterio 4. Movido a lazy boundary.
3. Demo consultando `/api/demo` para datos realistas → violaba criterios 3 y 5. Datos congelados en el bundle.

---

## 1. Arquitectura de la página

Ocho secciones. Alternancia tonal preservada del sistema editorial.

| # | Sección | Tono | Estado | Trabajo |
|---|---|---|---|---|
| 1 | Hero + Demo | paper | **Reescrita** | Copy nuevo + demo interactivo |
| 2 | Franja de confianza | cream | **Nueva** | 4 señales verificables |
| 3 | Diagnóstico | paper | **Fusionada** | Absorbe ExcelComparison |
| 4 | Historia | cream | Conservada | Solo ajuste de transición |
| 5 | El sistema (profundidad + mobile) | ink | **Reescrita** | 6 capacidades + PhoneFrames |
| 6 | Cómo arrancás | paper | **Nueva** | 4 pasos con tiempos |
| 7 | Precio | cream | **Reescrita** | Precio visible + comparación |
| 8 | FAQ | paper | Ampliada | +1 pregunta de seguridad |

Header y Footer se conservan; el nav cambia para reflejar las secciones nuevas.

### Por qué este orden

El visitante de Instagram llega frío y con baja paciencia. La secuencia responde sus objeciones en el orden en que aparecen:

1. *"¿Esto qué es?"* → lo usa (Hero + Demo)
2. *"¿Y por qué te creo?"* → señales verificables (Franja)
3. *"¿Por qué cambiaría mi Excel?"* → Diagnóstico
4. *"¿Quién está atrás?"* → Historia
5. *"¿Aguanta mi negocio?"* → El sistema
6. *"¿Cuánto laburo es arrancar?"* → Cómo arrancás
7. *"¿Cuánto sale?"* → Precio
8. *"Me quedó una duda"* → FAQ

---

## 2. Sección 1 — Hero + Demo

### Copy

- **Eyebrow:** `Sistema de gestión · Comercios · Argentina`
- **H1:** `No te pido que me creas.` / *`Probalo acá.`* (segunda línea en itálica teal)
- **Lede:** `Este de al lado es el sistema, no un video. Hacé una venta, fiale a un cliente, cerrá la caja. Sin registrarte, sin dar un mail, ahora mismo.`
- **CTA primario:** `Empezar 30 días gratis →` → `signupUrl()`
- **CTA secundario:** `Ver el demo ↓` → ancla al demo (en mobile, donde el demo queda debajo)
- **Micro:** `Sin tarjeta · Cancelás cuando quieras` / `Hecho en un almacén real, usado todos los días`

En mobile la lede dice "Esto de abajo es el sistema" — el copy es responsive porque la posición del demo cambia.

### Layout

- **Desktop (≥1000px):** grid `minmax(0,420px) minmax(0,1fr)`, copy izquierda, demo derecha. El demo domina el ancho.
- **Tablet/mobile:** stack vertical. Copy compacto arriba, demo inmediatamente debajo, **visible sin scroll en un viewport de 640px de alto**. El H1 baja a 40px y la lede se recorta a una línea para garantizarlo.

El demo se envuelve en el `BrowserFrame` existente (borde 1.5px + offset shadow teal + barra de URL) con URL `bueninventario.com/demo` y un indicador `En vivo` con punto pulsante.

---

## 3. El demo — "Un día en el mostrador"

La pieza central. Vive en `src/demo/`, completamente autocontenida.

### Principios

1. **Operable, no reproducible.** El visitante controla el ritmo. Nada se auto-reproduce.
2. **Cero backend.** Todo el estado en memoria del navegador. Sin fetch, sin storage, sin analytics dentro del widget más allá de los eventos de la sección Medición.
3. **Honesto.** Rotulado `Demo · datos de ejemplo`. Los datos son de un almacén ficticio pero los cálculos son reales (el margen se calcula de verdad, el stock se descuenta de verdad).
4. **Reversible.** Siempre se puede volver a empezar sin recargar la página.
5. **Sin callejones.** Ningún estado deja al usuario sin acción siguiente.

### Capítulos

Tabs con `role="tablist"`. Estilo: activo en fondo ink con número teal.

`01 Vendés` · `02 Fiás` · `03 Cerrás`

Cambiar de capítulo **no resetea** el estado de los otros. El visitante puede volver.

#### Capítulo 01 — Vendés

Máquina de estados de tres vistas:

**`pos`** → grilla de 9 productos + ticket lateral.

Productos (nombre, precio, costo, stock inicial):

| Producto | Precio | Costo | Stock |
|---|---|---|---|
| Coca-Cola 1.5L | 2.400 | 1.750 | 24 |
| Pan lactal | 1.850 | 1.290 | 12 |
| Leche 1L | 1.320 | 980 | 30 |
| Yerba 1kg | 4.900 | 3.620 | 18 |
| Fideos 500g | 980 | 690 | 40 |
| Aceite 900ml | 3.600 | 2.680 | 15 |
| Arroz 1kg | 1.750 | 1.240 | 22 |
| Azúcar 1kg | 1.480 | 1.050 | 26 |
| Galletitas | 1.620 | 1.150 | 33 |

Los costos no se muestran nunca en la grilla — solo alimentan el cálculo de ganancia del reveal. Esa es la gracia: el sistema sabe algo que la pantalla no exhibe.

Guía: el primer tile pulsa (`nudge`) hasta el primer tap. La barra de hint dice `👆 Tocá dos o tres productos — como si estuvieras atendiendo.` Tras el primer tap cambia a `Seguí cargando, o tocá "Cobrar" cuando termines.`

El botón `Cobrar` está deshabilitado con el ticket vacío.

**`methods`** → seis métodos: Efectivo, Transferencia, Débito, Crédito, Mercado Pago, y `Fiado ⟶` (visualmente distinto: borde punteado teal). Copy: `Cada método queda registrado por separado. Al cierre del día sabés exactamente cuánto entró por cada uno.`

Elegir `Fiado` **salta al capítulo 02** y resetea el capítulo 01 — es el puente narrativo entre capítulos.

**`done`** → el reveal. Es el momento de mayor valor de toda la landing.

```
✓ Venta registrada · $X

LO QUE EL SISTEMA ANOTÓ SOLO — SIN QUE HICIERAS NADA
Ganancia real de esta venta      $N        (teal, bold)
Stock de <primer producto>       24 → 23   (tachado el viejo)
Método de cobro                  Efectivo
Quién vendió y a qué hora        Néstor · 18:42
Unidades que salieron            N

"Eso es lo que tu Excel nunca te dijo. Y vos no hiciste nada: solo vendiste."

↺ Hacer otra venta
```

Las cinco filas del reveal mapean 1:1 contra los ítems del Diagnóstico (ganancia real, stock, medios de cobro, robo interno). Eso convierte al Diagnóstico en la explicación de algo que el visitante **ya vio pasar**, en vez de una lista de miedos abstractos.

#### Capítulo 02 — Fiás

Cuenta corriente de `Marcos López` — saldo $18.420, 47 movimientos, cliente desde 03/2024. Cuatro movimientos históricos visibles (un pago a cuenta en teal negativo, tres ventas).

Acción: `Anotar la venta de hoy en la cuenta de Marcos` → inserta un movimiento nuevo arriba con highlight teal y animación de entrada, el saldo pasa a $29.970, y aparece el remate: *"Si mañana discute lo que se llevó, abrís la cuenta y se termina la discusión."* El botón desaparece (acción consumida).

#### Capítulo 03 — Cerrás

Cierre de caja del día con seis filas por método (cada una con swatch de color) más el fiado marcado aparte como `Fiado (no entró plata)` en teal — distinción conceptual clave que ningún Excel hace.

Total: `Entró hoy $389.640` con subtítulo `Sin contar el fiado`.

Acción `Cerrar caja` → `✓ Caja cerrada` + tres datos: ganancia real del día $104.190, 213 unidades vendidas, resumen enviado por mail. Remate: *"Lo que antes te llevaba una hora con la calculadora."*

### Estructura de archivos

```
src/demo/
  DemoWidget.tsx        # shell: tabs, estado de capítulo, Suspense boundary interno
  data.ts               # PRODUCTS, LEDGER_MOVES, CIERRE_ROWS, formateo ARS
  useSale.ts            # hook: carrito, totales, margen, transición de vistas
  chapters/
    ChapterVender.tsx   # pos → methods → done
    ChapterFiar.tsx
    ChapterCerrar.tsx
  parts/
    ProductTile.tsx
    Ticket.tsx
    MethodPicker.tsx
    SaleReveal.tsx
    HintBar.tsx
```

**Contrato de decoupling:** `src/demo/` no importa nada de `src/components/sections/`. La comunicación con el resto de la página es una sola prop opcional (`onSignupIntent`) para que el CTA del demo pueda disparar el mismo destino que el CTA del hero. Borrar la carpeta `demo/` y su import en `Hero.tsx` deja la landing funcionando.

### Comportamiento mobile

- Grilla de productos: 2 columnas <520px, 3 arriba.
- Ticket: pasa de columna lateral a bloque debajo, con `border-top` en vez de `border-left`.
- Área táctil mínima de los tiles: 44×44px.
- El demo completo debe caber en 560px de alto en mobile sin scroll interno; el scroll de productos es de la página, no del widget.

### Accesibilidad

- Tabs con `role="tablist"` / `role="tab"` / `aria-selected`, navegables con flechas.
- Cambios de estado anunciados en un `aria-live="polite"` (el reveal y el "caja cerrada").
- Los tiles son `<button>` reales con label accesible `Agregar <producto>, <precio>`.
- Foco visible en todo elemento interactivo, contraste AA verificado.
- Con `prefers-reduced-motion: reduce`: sin pulso del tile, sin animaciones de entrada; los cambios de estado siguen siendo instantáneos y legibles.
- El demo es **enteramente operable por teclado**.

---

## 4. Sección 2 — Franja de confianza

Banda a ancho completo entre bordes hard 1.5px, fondo cream, cuatro celdas separadas por líneas punteadas. En mobile apila.

| Señal | Copy grande | Copy chico | Tipo de prueba |
|---|---|---|---|
| Garantía | `30 días` | gratis, sin tarjeta. Cancelás cuando quieras. | Seguridad |
| Ingeniería | `~29.800` | productos de tu rubro ya cargados. No arrancás de cero. | Producto |
| Datos | `Tus datos son tuyos` | Los exportás a Excel cuando quieras. Si te vas, te los llevás. | Integridad |
| Fundador | *`Un almacén de verdad`* | Hecho en Don Néstor Despensa. Usado todos los días. | Fundador |

**Verificación obligatoria del número de catálogo:** el `~29.800` sale de la memoria del proyecto (catálogo prod ~29.841 al 2026-08-20). Antes de publicar hay que contar los ítems reales en producción y ajustar la constante. El plan de implementación incluye esa tarea con su comando de verificación. El número vive en `lib/facts.ts` (ver sección Precio → fuente única de verdad) para que corregirlo sea una línea. Si el conteo real difiere en más de 5%, se ajusta el copy — no se publica un número no verificado.

---

## 5. Sección 3 — Diagnóstico (fusionada)

Se conserva íntegra la sección actual de 5 ítems (robo interno, ganancia real, cuenta corriente, stock muerto, medios de cobro) con sus iconos Lucide en teal-700.

**Cambios:**

1. **Lede nueva** que engancha con el demo: `Recién lo viste funcionando. Esto es lo que el sistema te contesta y tu planilla no.`
2. **Absorbe `ExcelComparison`** como cierre de la sección, no como sección propia. La tabla de 6 filas y su variante de cards mobile se conservan tal cual (el componente `ExcelComparison.tsx` sigue existiendo como componente, deja de ser una `<Section>` y pasa a renderizarse dentro de `Diagnostico`). Se elimina su `EditorialMicro` y `DisplayHeading` propios; queda un separador con un `EditorialMicro` que dice `Punto por punto`.

Razón de la fusión: eran dos secciones argumentando lo mismo, con dos títulos que competían. Fusionadas, el arco es "acá están los 5 agujeros → acá está la comparación punto por punto".

Se elimina la entrada `Diagnóstico` duplicada del nav (queda una sola).

---

## 6. Sección 4 — Historia

Se conserva **sin cambios estructurales**. Es la prueba de fundador y funciona.

Único ajuste: se elimina el bloque final `También lo usan · Kioscos · Despensas · Ferreterías…`, porque después del demo y con la sección "El sistema" ampliada, esa lista quedó redundante y además roza la insinuación de adopción que la restricción de honestidad prohíbe. La cobertura por rubro se comunica ahora en "El sistema" como **capacidad de catálogo**, que es verificable.

---

## 7. Sección 5 — El sistema (profundidad + mobile)

Fondo ink. Reemplaza la sección actual de 3 capturas.

**Copy:** eyebrow `Lo que hay debajo` · H2 `Recién usaste la caja.` / *`Abajo hay bastante más.`* · lede `No es una app de inventario. Es el sistema completo de un comercio — y está construido para bancar el tuyo cuando crezca.`

### Seis capacidades

Grid 2 columnas en desktop, 1 en mobile, separadas por punteados.

| Tag | Título | Copy |
|---|---|---|
| Catálogo | Tu rubro ya viene cargado | Casi 30.000 productos con código de barras, marca y presentación, listos para usar. Kiosco, ferretería, carnicería, verdulería, pescadería, indumentaria. Escaneás y aparece. |
| Facturación | ARCA, cuando vos quieras | Facturación electrónica integrada, homologada. Vos decidís venta por venta si facturás o no. El sistema no te controla ni te denuncia. |
| Sucursales | Más de un local | Stock, caja y precios por sucursal, con la vista consolidada arriba. Si abrís el segundo, no empezás un sistema nuevo. |
| Tienda web | Tu comercio online, sin programar | Tienda propia conectada al mismo stock. Los pedidos web entran a la misma caja. Elegís el diseño y sale publicada. |
| Migración | Subís tus archivos Excel y se cargan solos | Importación masiva de productos, clientes y proveedores. No hay que tipear nada de nuevo. |
| Rotación | Qué se vende y qué duerme | Días sin venta por producto, margen real y capital inmovilizado. Sabés qué dejar de comprar antes de comprarlo. |

Las seis corresponden a features **vivas en producción** (catálogo por rubro, ARCA stages 1-4D, multi-sucursal etapa 3A, storefront templates, onboarding hub + bulk import, product rotation). Ninguna es una promesa a futuro. El copy de migración usa la redacción aprobada ("subís tus archivos Excel y se cargan solos").

### Mocks mobile

Sub-bloque cerrando la sección: eyebrow `En el mostrador` · H2 `Y todo esto, desde el celular.` · lede `No hay que instalar nada ni comprar una computadora. Se abre en el navegador del teléfono que ya tenés.`

Tres `PhoneFrame` en fila (scroll horizontal en mobile con snap):

| Pantalla | Contenido | Caption |
|---|---|---|
| Vender | Ticket de 3 líneas, KPI Total $11.550, botón Cobrar | Atendés con una mano mientras cobrás con la otra. |
| Fiado | Saldo $29.970 debe, 3 movimientos, botón Registrar un pago | La cuenta de cada cliente, en el bolsillo. |
| Cierre de caja | KPI Entró hoy $389.640, 5 filas por método, botón Cerrar caja | El día cerrado antes de bajar la persiana. |

Los datos son **consistentes con el demo** (mismo Marcos López, mismos totales del cierre). Un visitante atento que compare no encuentra contradicción.

### Decisión: los mocks son código, no imágenes

**`PhoneFrame` es un componente React nuevo** en `src/components/ui/PhoneFrame.tsx`, con las pantallas como componentes en `src/components/ui/phone-screens/`. No se usan imágenes generadas por IA.

Razones: (a) la IA generativa deforma texto y números de UI — precisamente donde necesitamos credibilidad; (b) texto nítido a cualquier densidad de pantalla sin servir 3 PNG retina; (c) los datos quedan acoplados a la fuente única con el demo; (d) se actualizan solos si cambia el sistema de diseño.

`PhoneFrame` acepta `children`, igual que `BrowserFrame`. Si en el futuro se quieren screenshots reales de la app, se le pasa un `<img>` como children — **el layout no cambia**. Ese es el punto de extensión.

Se elimina `PhotoFrame.tsx` si queda sin uso tras el rediseño (verificar en implementación).

---

## 8. Sección 6 — Cómo arrancás

Sección nueva. Prueba de proceso. Fondo paper.

**Copy:** eyebrow `Cómo arrancás` · H2 `De decir que sí` / *`a estar operando.`* · lede `La objeción real no es el precio: es "no tengo tiempo para cargar todo". Esto es lo que pasa de verdad.`

Cuatro pasos en grid `[cuándo] [contenido]`, separados por punteados, con bordes hard arriba y abajo.

| Cuándo | Título | Copy |
|---|---|---|
| Hoy | Te abrís la cuenta y elegís tu rubro | Dos minutos. Sin tarjeta. En cuanto elegís el rubro, tu catálogo aparece cargado — casi 30.000 productos con código de barras esperando. |
| Esta tarde | Subís tus archivos Excel y se cargan solos | Productos, clientes y proveedores. Si tenés precios propios, los importás. Si no tenés nada en Excel, escaneás y cargás sobre el catálogo que ya está. |
| Mañana | Empezás a vender con el sistema | Abrís caja, vendés, cerrás. Desde el primer día ya sabés cuánto entró por cada método y cuánto ganaste de verdad. |
| La primera semana | Si te trabás, me escribís a mí | No hay mesa de ayuda ni ticket. Me escribís por WhatsApp y te contesto yo. La migración de tu Excel te la hago yo personalmente, sin costo. |

El cuarto paso convierte la escala chica en ventaja competitiva — es la única respuesta honesta y a la vez fuerte a "son nuevos y son pocos". Coincide con la promesa de migración asistida que ya está en el FAQ vigente.

---

## 9. Sección 7 — Precio

Fondo cream, centrada.

**Copy:** eyebrow `El precio` · H2 `Un plan. Todo incluido.` / *`Sin letra chica.`*

Card con borde hard + offset shadow teal:

- Eyebrow `Plan único · ARS`
- **`$24.900`** en DM Serif 62px + `/ mes` en mono 19px
- `Después de 30 días gratis. Sin tarjeta para probar.`
- Seis features con check teal: ventas/stock/caja/cuentas corrientes · catálogo del rubro precargado · facturación ARCA cuando quieras · tienda web conectada al stock · multi-sucursal y usuarios ilimitados · soporte por WhatsApp, te contesto yo
- CTA `Empezar 30 días gratis →` a ancho completo
- Micro: `Sin tarjeta · Cancelás cuando quieras`

**Línea de comparación** debajo de la card: `Para comparar: los sistemas de gestión más conocidos del país arrancan arriba de $47.000 por mes y te dan 14 días de prueba.`

Deliberadamente sin nombrar a Xubio: el dato es verificable (verificado 2026-09-04), la comparación es honesta, y no se convierte en un ataque nominal que invite respuesta.

### Fuente única de verdad del precio

Módulo nuevo `src/lib/pricing.ts`:

```ts
/**
 * Precio público del plan único. FUENTE ÚNICA para toda la landing:
 * card de precio, JSON-LD SoftwareApplication y OG image.
 *
 * OJO: este número debe coincidir con el transaction_amount del
 * preapproval_plan de Mercado Pago (MP_PREAPPROVAL_PLAN_ID en el backend).
 * Cambiar acá NO cambia lo que se cobra. Ver docs del cambio de precio.
 */
export const PLAN_PRICE_ARS = 24900;
export const TRIAL_DAYS = 30;
export const COMPETITOR_FLOOR_ARS = 47000;
export const COMPETITOR_TRIAL_DAYS = 14;

export function formatArs(n: number): string { /* Intl es-AR, sin decimales */ }
```

Y `src/lib/facts.ts` para los datos verificables de la franja de confianza (conteo de catálogo, cantidad de rubros). Separados de `pricing.ts` porque cambian por razones distintas.

**El precio también aparece en el JSON-LD** (`SoftwareApplication.offers.price`), que hoy declara `"price": "14900"` en `index.html`. Con SSG el JSON-LD se genera desde `PLAN_PRICE_ARS`, eliminando la duplicación.

### ⚠️ Dependencia externa a este spec

Publicar $24.900 mientras Mercado Pago cobra $14.900 genera una inconsistencia entre lo publicado y lo cobrado. **Actualizar el precio en MP no es parte de este spec** — es un cambio de billing en producción con dos operaciones distintas (`PUT /preapproval_plan/{id}` para nuevos suscriptores, `PUT /preapproval/{id}` por cada suscriptor existente) y una decisión comercial de si grandfatherear a los actuales.

Adicionalmente, `PLAN_AMOUNT = 14900` en `buen-carrito-backend/src/controllers/adminBilling.controller.ts:199` va a reportar MRR incorrecto. Ese cálculo además debería sumar los `planAmount` reales de cada suscripción en vez de multiplicar por una constante, porque con precios mezclados da mal en las dos direcciones.

**Ambos ítems requieren su propio spec y plan.** La landing no debe publicarse hasta que el precio de MP esté sincronizado, o hasta que se decida explícitamente aceptar la ventana de inconsistencia.

---

## 10. Sección 8 — FAQ

Se conservan las 6 preguntas actuales. Se agrega una séptima, que cubre la pata de "seguridad e integridad" del trust stack:

**P:** `¿Dónde están mis datos y qué pasa si se rompe algo?`
**R:** `Tus datos no están en la computadora del local: están en la nube, en servidores de Amazon. Si se te rompe la PC, se te moja o te la roban, tus datos siguen ahí — entrás desde otro equipo y seguís trabajando. Y los exportás a Excel cuando quieras.`

⚠️ **Verificación obligatoria antes de publicar:** esta respuesta afirma que los datos viven en AWS, lo cual es cierto (DynamoDB). **No afirma "copia de seguridad automática"** a propósito: hay que confirmar que Point-in-Time Recovery esté habilitado en las tablas de producción antes de prometer backups. Si PITR está activo, se puede agregar la frase; si no está activo, hay que activarlo antes de decirlo. El plan incluye esa verificación como tarea bloqueante.

Se corrige además la pregunta 6, que hoy dice `También funciona para multisucursal (feature en desarrollo)` — multi-sucursal ya está en producción (etapa 3A). Debe decir `También funciona si tenés más de un local.`

---

## 11. Migración a SSG

Cierra **F3 del audit SEO 2026-07-31**, abierto desde julio.

**Qué:** prerenderizar la landing a HTML estático en build time con `prerenderToNodeStream` de `react-dom/static` (React 19), manteniendo hidratación para el demo. Sin dependencias nuevas.

**Por qué entra en este scope y no después:**
- Los crawlers de IA (ClaudeBot, GPTBot, PerplexityBot, OAI-SearchBot) no ejecutan JS y hoy ven `<div id="root"></div>`. El tráfico atribuido a IA convierte 4,4× mejor que el orgánico.
- La landing v3 tiene **más** contenido de texto valioso que la v2 (capacidades, pasos, FAQ ampliada). Publicarla sin SSG desperdicia todo ese contenido.
- Mejora LCP en conexiones malas: el contenido pinta antes de hidratar.

**Cómo:**
- `src/entry-server.tsx` exporta `<App/>`; se compila con `vite build --ssr`.
- `scripts/prerender.ts` importa el bundle SSR, corre `prerenderToNodeStream`, y sustituye el `<div id="root"></div>` de `dist/index.html` por el HTML generado. Genera además el JSON-LD desde `pricing.ts` y lo inyecta.
- `src/main.tsx` pasa de `createRoot` a `hydrateRoot`.
- `/terminos` y `/privacidad` siguen siendo HTML estático en `public/` — no pasan por React.
- El `DemoWidget` se importa con `lazy()` y se envuelve en `<Suspense>` con un fallback que es **el frame vacío con las medidas exactas** del demo — cero layout shift (CLS = 0). Durante el prerender el fallback es lo que se serializa, así que el HTML estático contiene el frame, no el demo.
- Auditar cualquier acceso a `window`/`document` en tiempo de render. El `IntersectionObserver` de `App.tsx` ya está dentro de `useEffect`, así que es prerender-safe; verificar el resto.

---

## 12. Legales

Cierra **F4 del audit SEO**. `public/privacidad.html` y `public/terminos.html` son placeholders de 14 líneas que dicen "se completará antes de la puesta en producción" — llevan así desde mayo. Es un hueco legal real: ARCA y Mercado Pago requieren términos y política publicados para uso comercial.

Se escribe contenido real para ambos: política de datos, cookies, retención, ley 25.326 (AR), contacto, jurisdicción; y ToS con cláusulas de servicio, cancelación, disponibilidad, y condiciones de cobro vía Mercado Pago. Cada uno con `<title>`, `description`, canonical y OG propios, y listados en `sitemap.xml` con `lastmod`.

El contenido lo redacta la implementación sobre estructura estándar y **queda marcado para revisión del titular antes del deploy** — no se publica texto legal sin que Néstor lo lea.

---

## 13. Performance budget

| Métrica | Objetivo | Cómo |
|---|---|---|
| LCP | < 2,0s en 4G simulado | SSG + fuentes self-hosted preloadeadas (ya está) + demo lazy |
| CLS | 0 | Fallback del Suspense con las medidas exactas del demo |
| INP | < 200ms p75 | Interacciones del demo son mutaciones de estado local; sin trabajo pesado en el handler |
| JS del demo | < 25KB gzip | Sin librerías nuevas; iconos de `lucide-react` importados de a uno |
| Peso total inicial | Sin regresión vs. la v2 actual | Medido antes/después en el plan |

Sin librerías nuevas de runtime. `vite-react-ssg` es build-time.

---

## 14. Medición

Hoy la landing **no mide nada**. Sin medición no se puede decir si convierte más — el objetivo del rediseño sería inverificable.

Se agrega Vercel Analytics + Speed Insights (ya está desplegada en Vercel; sin cookies, sin banner de consentimiento, sin impacto en el budget).

Eventos mínimos:

| Evento | Cuándo | Para qué |
|---|---|---|
| `demo_started` | primer tap en un producto | ¿cuántos visitantes prueban el demo? |
| `demo_sale_completed` | llega al reveal | ¿cuántos llegan al momento de valor? |
| `demo_chapter_viewed` | cambio de capítulo (con cuál) | ¿qué capítulos importan? |
| `cta_signup_clicked` | click en CTA de signup (con sección de origen) | ¿qué sección convierte? |
| `cta_whatsapp_clicked` | click en WhatsApp (con sección) | canal alternativo |

Con esto se puede responder la pregunta que motiva todo el rediseño: **¿los que usan el demo convierten más que los que no?** El grounding predice ~8×; hay que verificarlo con datos propios.

Los eventos se emiten a través de un adapter `src/lib/analytics.ts` con la interfaz `track(event, props?)`. El demo **no importa Vercel Analytics directamente** — importa el adapter. Cambiar de proveedor es cambiar un archivo.

---

## 15. Assets a regenerar

Reusando `scripts/generate-assets.ts` (Playwright, ya existe):

- **OG image 1200×630** — se rehace con el copy nuevo del hero ("No te pido que me creas. Probalo acá.") y el precio desde `pricing.ts`.
- Favicons y app icons: **sin cambios**, se resolvieron el 2026-08-01.

---

## 15-bis. Testing

El repo **no tiene hoy ninguna dependencia de testing**. El demo introduce lógica real —cálculo de margen, descuento de stock, máquina de estados de tres vistas— que no puede quedar sin cobertura: un error de signo en el margen se publica sin que nadie lo note.

Se agrega infraestructura mínima alineada con el resto de los repos: **Vitest + happy-dom + React Testing Library**.

Cobertura obligatoria:
- `demo/data.ts` — formateo ARS.
- `demo/useSale.ts` — agregar al carrito, totales, cálculo de margen, descuento de stock, transiciones de vista, reset. **Escrito TDD-first.**
- `lib/pricing.ts` — formateo del precio.
- `DemoWidget` — test de integración: cargar productos, cobrar, llegar al reveal, verificar que el margen mostrado es el correcto; navegación por tabs; que "Fiado" salta al capítulo 02.

No se exige cobertura de los componentes puramente presentacionales (secciones, PhoneFrame): son markup sin lógica y el mockup ya validó su forma.

## 16. Resumen de decoupling

| Módulo | Se puede borrar en aislación | Cómo |
|---|---|---|
| `src/demo/` | Sí | Borrar carpeta + el import en `Hero.tsx`. La landing queda funcionando con el hero sin demo |
| `PhoneFrame` + `phone-screens/` | Sí | Componentes de presentación puros, sin dependencias hacia afuera |
| `lib/pricing.ts` | No debe borrarse | Es la fuente única; el punto es que el precio esté en un solo lugar |
| `lib/analytics.ts` | Sí (a no-op) | Interfaz `track()`; el demo y los CTAs no conocen el proveedor |
| `ExcelComparison` | Sí | Pasa a renderizarse dentro de `Diagnostico`; sigue siendo componente independiente |

Ninguna sección importa de otra sección. Todas consumen los mismos primitivos (`Section`, `DisplayHeading`, `EditorialMicro`, `Button`, `BrowserFrame`, `PhoneFrame`) y los mismos adapters (`signupUrl`, `whatsappLink`, `pricing`, `facts`, `analytics`).

---

## 17. Checklist de aceptación

**Demo**
- [ ] Los 3 capítulos son operables con mouse, touch y teclado
- [ ] La ganancia del reveal es el cálculo real de (precio − costo) × cantidad de lo que el visitante cargó
- [ ] El stock mostrado en el reveal coincide con el del tile y descuenta la cantidad correcta
- [ ] Elegir "Fiado" lleva al capítulo 02 y resetea el 01
- [ ] "Hacer otra venta" restaura el estado inicial sin recargar
- [ ] Cambiar de capítulo no pierde el estado de los otros
- [ ] Con `prefers-reduced-motion` no hay pulso ni animaciones, y el demo sigue siendo usable
- [ ] Ningún estado deja al usuario sin acción siguiente
- [ ] El demo no hace ninguna request de red

**Honestidad**
- [ ] No hay cantidad de clientes, logos, testimonios, estrellas ni métricas de adopción en toda la página
- [ ] El conteo de catálogo fue verificado contra producción y `facts.ts` refleja el número real
- [ ] Las 6 capacidades corresponden a features vivas en producción
- [ ] El demo está rotulado como datos de ejemplo
- [ ] El FAQ ya no dice que multi-sucursal está "en desarrollo"
- [ ] La respuesta del FAQ sobre datos no promete backups salvo que PITR esté verificado como activo en producción

**Precio**
- [ ] `$24.900` aparece únicamente vía `PLAN_PRICE_ARS`
- [ ] El JSON-LD toma el precio de la misma constante
- [ ] La landing no se publica hasta que MP esté sincronizado, o hasta decisión explícita en contrario

**Técnico**
- [ ] `curl` del HTML servido muestra el contenido de las secciones (no `<div id="root">` vacío)
- [ ] CLS = 0 al cargar el demo
- [ ] LCP < 2,0s en 4G simulado
- [ ] Los 5 eventos de analytics se emiten
- [ ] `/terminos` y `/privacidad` tienen contenido real, meta tags y están en el sitemap
- [ ] OG image regenerada con el copy nuevo
- [ ] Contraste AA en toda la página, incluido el demo

**Mobile**
- [ ] El demo es visible sin scroll en un viewport de 640px de alto
- [ ] Áreas táctiles ≥ 44×44px en el demo
- [ ] Los 3 PhoneFrames tienen scroll horizontal con snap
- [ ] Ninguna sección tiene scroll horizontal del body
