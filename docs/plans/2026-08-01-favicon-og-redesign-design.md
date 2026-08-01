# Favicon set + OG image redesign — Design Spec

**Fecha:** 2026-08-01
**Repo:** `buen-inventario-landingpage`
**Origen:** F1 + F2 del audit `docs/audits/2026-07-31-seo-landing.md`
**Status:** Design aprobado, listo para `bi-plan`

---

## Contexto

El favicon actual (`public/favicon.svg`, Sep 2025) es un ícono abstracto turquesa que predates el editorial redesign — no matchea el logo canónico (cajas apiladas + flecha ascendente). El `apple-touch-icon.png` es todavía peor: es una marca completamente distinta (una carretilla con caja) que no coincide ni con el favicon viejo ni con el logo actual. El `og-image.png` es un PNG 500×500 cuadrado byte-idéntico al logo mientras el `<meta>` declara 1200×630 — resultado: previews rotos en WhatsApp / Slack / Facebook / X / LinkedIn.

Este spec resuelve F1 (favicon set completo 2026) y F2 (OG image dedicada) derivándolos del logo canónico oficial, con pipeline reproducible y decoupled.

---

## Decisiones tomadas (con user)

| Decisión | Elección |
|---|---|
| Estrategia icon | **Variante 1** — logo real completo escalado a cada tamaño (sin monogramas ni simplificaciones) |
| Vectorización | **Auto-trace con potrace** — SVG resultante 4.4KB, ya generado y aprobado en `mockups/logo-vectorized.svg` |
| Background apple-touch + PWA | **Opción D** — gradient teal `linear-gradient(135deg, #38B5AF 0%, #1F857F 100%)`, logo blanco/paper centrado |
| Layout OG image | **Variante 4** — split: mitad texto editorial + mitad UI mock del "cierre de caja" |
| Pipeline de generación | **Script en repo** con Playwright + sharp + svgo |

**Mockups de referencia (source of truth visual):**
- `mockups/2026-08-01-favicon-explorations.html` — icon strategy
- `mockups/2026-08-01-apple-touch-explorations.html` — apple-touch + PWA bg
- `mockups/2026-08-01-og-image-explorations.html` — OG layout V4
- `mockups/logo-vectorized.svg` — SVG source vectorizado

---

## Assets finales a producir

Todos en `public/`. Reemplazan el estado actual.

| Archivo | Tamaño / Dims | Formato | Contenido | Uso |
|---|---|---|---|---|
| `favicon.ico` | 16/32/48 multi-res | ICO | Logo teal `#38B5AF` sobre transparente | Fallback legacy Chrome/Edge/crawlers |
| `favicon.svg` | scalable | SVG | Logo vectorizado teal `#38B5AF` sobre transparente, viewBox `0 0 290.757 312`, ~4.4KB post-svgo | Chrome/Firefox/Safari modernos, HiDPI |
| `apple-touch-icon.png` | 180×180 | PNG opaco | Background gradient teal 135deg `#38B5AF → #1F857F`, logo white/paper centrado (padding ~15%) | iOS "Add to Home Screen" |
| `icon-192.png` | 192×192 | PNG opaco | Idem apple-touch (mismo background + logo) | PWA Android Chrome install prompt |
| `icon-512.png` | 512×512 | PNG opaco | Idem, alta resolución | PWA splash + high-density displays |
| `icon-maskable-512.png` | 512×512 | PNG opaco | Background teal full-bleed, logo centrado a **60% del canvas** (safe zone 40%) | Android launchers que aplican shape mask (circle/squircle/teardrop) |
| `og-image.png` | 1200×630 | PNG optimizado ≤200KB | Render Playwright del template V4 (paper background + brand mark + display heading + mock del cierre de caja) | OG/Twitter/WhatsApp/Slack/Discord/LinkedIn share previews |

**Assets a REMOVER del repo:**
- `public/favicon.svg` (viejo, será overwritten) — no acción, se reemplaza
- `public/bueninventario-logo.png` — **se queda** (es el source original, sigue linkeado desde `Header.tsx`, `Footer.tsx`, JSON-LD `Organization.logo`)
- `public/og-image.png` (mal cropeado) — será overwritten

---

## Arquitectura del script de generación

**Ubicación:** `scripts/generate-assets.ts` (TypeScript node script, corre con `tsx` o compilado)

**Comando:** `pnpm run generate:assets`

**Dependencies (todas dev-only):**
- `playwright` — HTML → PNG rendering para OG
- `sharp` — PNG resize, composite, gradient generation, optimization
- `svgo` — SVG minification
- `to-ico` — multi-resolution ICO packing

**Inputs (source of truth):**
- `mockups/logo-vectorized.svg` — SVG source del logo (movido a `scripts/sources/logo.svg` como asset del build pipeline)
- `scripts/templates/og-image.html` — template HTML del OG V4, standalone, self-contained (fuentes vía `@import` de Google Fonts, o inlined si querés builds offline)
- `scripts/templates/app-icon.html` — template opcional del app icon con gradient background (alternativa: generar el gradient programáticamente con sharp)

**Pipeline steps:**

1. **Optimize SVG source** — leer `scripts/sources/logo.svg`, correr svgo con preset default + `removeViewBox: false`, output → `public/favicon.svg`
2. **Rasterize base PNG** — desde el SVG optimizado generar una versión PNG 1024×1024 alpha-transparente (buffer, no disk) para uso interno
3. **Generate `favicon.ico`** — desde el PNG 1024, downsample a 16/32/48, empaquetar en ICO multi-res con `to-ico`, write `public/favicon.ico`
4. **Generate app icons con gradient background:**
   - Crear canvas 512×512 con gradient teal 135deg via sharp `composite` sobre SVG-based gradient (o linear gradient generado con sharp raw pixel manipulation)
   - Compositar el logo blanco (SVG con fill overriden a `#F7F4EC`, rasterizado) centrado con padding
   - Output apple-touch (180×180 downsampled), icon-192, icon-512
5. **Generate maskable icon** — mismo pipeline pero logo escalado al 60% del canvas (safe zone 40%), full-bleed teal background, output `icon-maskable-512.png`
6. **Generate OG image** — launch Playwright chromium headless con viewport 1200×630, load `scripts/templates/og-image.html` desde disk vía `file://`, `page.screenshot({ omitBackground: false, type: 'png', quality: 100 })`, optimize con sharp (pngquant-style quantization if size >200KB), write `public/og-image.png`
7. **Print summary** — sizes de cada asset generado, ✓ / ✗ status, tiempo total

**Error handling:**
- Si falta alguna dep: mensaje claro sugiriendo `pnpm install`
- Si el SVG source no existe: error con path esperado
- Si Playwright browsers no están instalados: hint a `pnpm playwright install chromium`
- Cada step envuelto en try/catch con context, exit non-zero si falla algo crítico

**Idempotencia:** el script sobrescribe outputs siempre. No hace check de "already exists". Rápido (~5s total), diseñado para correr en cada iteración.

---

## Cambios adicionales en el repo

### 1. `index.html` — actualizar `<link>` tags

Reemplazar líneas 8-10 con set 2026:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
```

Nota: no hace falta declarar tamaños para SVG (es scalable). Chrome auto-selecciona ICO vs SVG según capability.

### 2. `public/manifest.webmanifest` — actualizar icons array

Reemplazar con:

```json
{
  "name": "Buen Inventario",
  "short_name": "Buen Inventario",
  "description": "Sistema de gestión para almacenes y comercios chicos de Argentina.",
  "id": "/",
  "scope": "/",
  "start_url": "/",
  "display": "browser",
  "lang": "es-AR",
  "dir": "ltr",
  "categories": ["business", "productivity", "finance"],
  "background_color": "#F7F4EC",
  "theme_color": "#F7F4EC",
  "icons": [
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" },
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Cambios vs actual: agregado `id`, `scope`, `lang`, `dir`, `categories`, y icons array con 192 + maskable. `screenshots` se puede agregar en un follow-up si querés rich install prompt.

### 3. `package.json` — nuevo script

```json
"scripts": {
  ...existentes,
  "generate:assets": "tsx scripts/generate-assets.ts"
}
```

Nuevas devDependencies:
- `playwright` (última versión estable ~1.50 al día de hoy)
- `sharp` (~0.34)
- `svgo` (~3.3)
- `to-ico` (~1.1)
- `tsx` (si no está ya para correr TS scripts sin build)

### 4. `.gitignore` — chequear

Asegurar que los assets generados **NO** están en gitignore (queremos commitear los outputs para que Vercel los sirva sin correr el pipeline en build). El script se corre localmente antes de commit; los PNGs/ICO/SVG/OG viajan en el repo.

---

## Adapter Boundaries

- **Playwright** es dev-tool build-time — nunca importado en `src/`, nunca en runtime del sitio. Aislado en `scripts/`.
- **sharp / svgo / to-ico** — idem, build-time only.
- **HTML templates** en `scripts/templates/` — standalone, no dependen de `src/` ni de componentes React. Si el diseño de la landing cambia, los templates son independientes.
- **SVG source** en `scripts/sources/logo.svg` — single source of truth para todos los favicons. Si el logo cambia, cambia solo ahí.

Si mañana cambiamos a un pipeline distinto (ej. edge functions on-demand OG), reemplazamos el script sin tocar nada del sitio.

---

## Schema Design

N/A — no hay DB involucrada. Assets estáticos servidos por Vercel edge CDN.

---

## Multi-tenant Impact

N/A — landing pública, no hay company isolation. Los assets son globales.

---

## Testing Plan

**Local dev:**
1. Correr `pnpm run generate:assets` — verificar 7 archivos generados en `public/`
2. Correr `pnpm dev`, abrir la landing local, chequear:
   - Favicon visible en el tab del browser (Chrome + Firefox + Safari)
   - DevTools → Application → Manifest muestra los icons correctamente
   - DevTools → Application → Icons muestra apple-touch e icon-192/512
3. Simular install PWA: Chrome → Add to Home Screen (Android emulator o real device)
4. Simular share: usar https://www.opengraph.xyz/ o LinkedIn Post Inspector con URL local via ngrok si necesario

**Post-deploy (Vercel preview URL):**
1. Test OG con https://opengraph.xyz/, https://www.linkedin.com/post-inspector/, https://cards-dev.twitter.com/validator, WhatsApp Web (paste link)
2. Chequear con https://realfavicongenerator.net/favicon_checker que el set esté bien
3. iOS Safari real → "Add to Home Screen" → verificar apple-touch se ve como diseñamos
4. Google Rich Results Test → confirmar que el favicon no rompe structured data

**Acceptance:**
- Los 7 archivos existen en `public/` post-generate
- Chrome DevTools sin warnings de "no favicon"
- OG preview correcto en al menos 3 plataformas (WhatsApp + LinkedIn + X)
- `pnpm run generate:assets` corre en <10s de forma repetida sin errores

---

## Grounding Summary

Este design se apoya en el grounding report 2026 del audit (`docs/audits/2026-07-31-seo-landing.md`), sección "Grounding highlights":

- **Favicon set mínimo 2026** (Evil Martians / Icojoy): `ico + svg + apple-touch + PWA 192/512 + maskable`. `mask-icon` Safari deprecated, `browserconfig.xml` obsoleto — no incluidos.
- **PWA maskable safe zone 40%** (MDN Web App Manifest): logo dentro del 60% central para sobrevivir shape crops de Android.
- **OG image 1200×630** (Krumzi 2026): safe zone 1080×600 central, PNG <1MB, ratio 1.91:1 aceptado por FB/X/LinkedIn/Discord/Slack/WhatsApp/iMessage/Signal.
- **Playwright HTML→PNG** para OG dinámicos: patrón adoptado por Vercel OG, GitHub, Linear, Stripe — permite regenerar con datos actualizados sin diseño manual.
- **Manifest 2026 fields** (Chrome Lighthouse installable manifest): `id`, `scope`, `lang`, `dir`, `categories`, icon `purpose: "maskable"` — todos incluidos.

---

## Out of scope (para follow-up separados)

- Migración del `<img src="/bueninventario-logo.png">` de `Header.tsx` + `Footer.tsx` a `<img src="/favicon.svg">` inline SVG component (F15 del audit — logo servido como SVG en LCP path). Requiere refactor de componentes.
- Screenshots del PWA manifest (`screenshots` array para rich install prompt Chrome/Android). Requiere capturas reales de la app en distintos form-factors.
- OG per-page (`/precios`, `/features`, `/blog/*`) — cuando existan esas páginas, extender el template para aceptar props via query params y generar per-page.
- Dark mode favicon vía `<link rel="icon" href="..." media="(prefers-color-scheme: dark)">` — no probado en 2026 (soporte spotty), skip por ahora.

---

## Self-review checklist

- [x] Placeholder scan — sin "TBD" / "TODO" / "por ahora" que oculten decisiones no tomadas
- [x] Internal consistency — apple-touch, PWA icons, maskable, manifest icons array: todos matchean el mismo background gradient teal 135deg
- [x] Scope check — un solo implementation plan (generate + wire in HTML + manifest)
- [x] Ambiguity check — cada asset tiene dims, formato, contenido, uso definidos
- [x] Completeness — nada "for later" dentro del scope. Out-of-scope listado explícito abajo
- [x] Decoupling — script + templates + SVG source aislados en `scripts/`, sin acoplamiento con `src/`
- [x] Grounded — decisions apoyadas en grounding report 2026 citado arriba
- [x] Los 4 mockups HTML son source visual de verdad, revisables y regenerables
