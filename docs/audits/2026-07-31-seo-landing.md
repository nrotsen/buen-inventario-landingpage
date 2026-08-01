# SEO Audit — Landing bueninventario.com

**Fecha:** 2026-07-31
**Scope:** `buen-inventario-landingpage/` (Vite + React SPA en prod en Vercel, dominio `www.bueninventario.com`)
**Auditor:** Claude (skill `bi-audit`)
**Overall assessment:** El SEO técnico está **por encima del promedio pero muy lejos del "world-class"**. La base está bien pensada (meta tags, OG, 3 JSON-LD, canonical, jerarquía H1/H2 correcta, fonts self-hosted preloadeadas, links con `rel=noopener`), pero hay **cuatro problemas graves que están sabotando el trabajo hecho**: (1) el favicon y apple-touch-icon son de otra marca — no matchean el logo nuevo, (2) el `og-image.png` es cuadrado 500×500 cuando el meta declara 1200×630 → previews rotos en todas las redes, (3) el sitio es SPA con `<div id="root">` vacío que se hidrata en JS → bots sociales y AI crawlers ven una landing en blanco, (4) `/privacidad` y `/terminos` son placeholders sin contenido, sin OG, sin canonical, orfelinatos a ojos de Google. Fix del 1 al 4 mueve la aguja de "meh" a "sólido"; el resto son 12 optimizaciones que llevan a "world-class".

---

## Grounding highlights (fecha: 2026-07-31)

Investigación completa: fuentes primarias Google Search Central, web.dev, MDN, Schema.org, más blogs de industria 2026 (Evil Martians, Anagram, Presenc.ai, DigitalApplied, Krumzi).

**Cambios 2024-2026 que aplican acá:**
- `FAQPage` rich result **deprecated** (7-mayo-2026). El markup no rompe nada; solo no aparece más en SERP.
- Sitelinks Search Box **retirado** (nov-2024). `WebSite.potentialAction` sigue sirviendo como entity signal para AI/GEO.
- INP reemplazó FID como Core Web Vital (2024). Threshold `≤ 200ms p75`. 43% de sitios fallan.
- `meta name="keywords"`: **ignorado por Google desde 2009**, spam signal en Bing.
- `sitemap.xml`: `priority` y `changefreq` **ignorados por Google**. `lastmod` sí se usa si es verificablemente accurate.
- **AI crawlers** (2026 consensus): "block training, allow search" — dejar entrar `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `OAI-SearchBot`; bloquear `GPTBot`, `CCBot`, `anthropic-ai`, `Bytespider`. Traffic AI-attributed convierte 4.4× mejor que organic.
- **Favicon minimal set 2026** (Evil Martians / Icojoy): `favicon.ico` (32×32) + `icon.svg` + `apple-touch-icon.png` (180×180, opaco, sin transparencia) + PWA icons 192+512 (uno maskable). `mask-icon` Safari deprecated, `browserconfig.xml` obsoleto.
- **OG image**: 1200×630 PNG/JPG < 1MB. Contenido crítico en safe zone 1080×600 central.
- **SPA React sin SSG en 2026 = suicidio para AI search**: Googlebot renderiza JS pero GPTBot / ClaudeBot / PerplexityBot / bots sociales NO. Meta tags en HTML estático los ven; contenido de body inyectado por JS NO.

---

## Evaluación contra los 7 criterios BI

| # | Criterio | Score | Assessment | Gap |
|---|----------|-------|------------|-----|
| 1 | Epic | **NEEDS WORK** | Base sólida (meta + OG + JSON-LD) pero favicon con la marca vieja + OG image roto + contenido invisible a AI crawlers matan la impresión. Un senior SEO no lo aprobaría hoy. | Fix favicon set, OG image size, migrar a SSG. |
| 2 | Elegant | **PASS** con reservas | HTML source es limpio, semántico, ordenado. Los 3 JSON-LD legibles. Único "code smell": el `GroceryStore` Don Néstor como entidad separada es raro conceptualmente (¿por qué es una entity del sitio?). | Reformatear Don Néstor como `Review` de `SoftwareApplication` o quitarlo. |
| 3 | Scalable | **NEEDS WORK** | Sitemap tiene 1 URL. `robots.txt` es genérico. Estructura no anticipa crecimiento a `/blog`, `/features/[rubro]`, `/casos`. hreflang ausente si algún día se target LatAm. | Generalizar sitemap gen, agregar hreflang es-AR+x-default, estructurar URL taxonomy futura. |
| 4 | Performant | **PASS** con follow-ups | Fonts self-hosted + preloadeadas + `font-display` (asumido swap). Vite bundle standard. Pero: no hay auditoría INP real, `og-image.png` 108KB (misma copia que logo, mal cropeada), y logo se sirve como PNG 108KB en lugar de SVG inline en header. | Auditar INP en real users (Speed Insights), servir logo header como SVG inline, generar OG image dedicada 1200×630 optimizada. |
| 5 | Decoupled | **PASS** | index.html es el único source of truth de meta. Sitemap/robots/manifest son archivos independientes. Sin acoplamientos ni magic. | Ninguno crítico. |
| 6 | Complete | **NEEDS WORK GRAVE** | `/privacidad` y `/terminos` son placeholders vacíos, sin contenido legal real, sin OG, sin canonical, sin JSON-LD, sin lastmod en sitemap. Rotos a nivel presentación pero también a nivel legal (ARCA/MP requieren términos publicados). | Escribir contenido real, agregar meta tags + canonical + OG, listar en sitemap. |
| 7 | Grounded | **NEEDS WORK** | `<meta name="keywords">` (ignorado desde 2009), `sitemap.priority` + `changefreq` (ignorados por Google), sin `lastmod`, favicon set 2019-era (SVG + apple-touch-icon únicos, sin `.ico` fallback), no diferencia AI crawlers, sin `theme-color` con media queries dark. | Modernizar a spec 2026. |

**Overall:** 4/7 NEEDS WORK. El sitio pasaría un audit básico de agency pero no un audit riguroso de senior SEO. Los fix son mayormente low-effort (asset swaps + config edits); solo la migración a SSG es medium-effort.

---

> **Update 2026-08-01:** F1 (favicon set) + F2 (OG image) **resueltos**. Ver `docs/plans/2026-08-01-favicon-og-redesign-plan.md` y branch `feat/favicon-og-redesign`. Pipeline reproducible en `scripts/generate-assets.ts` — corre con `pnpm run generate:assets`. Task 12 (Vercel deploy + external validators) pendiente.

## Findings priorizados por severidad

### P0 — Rompen presencia visible o son user-flagged

**~~F1. Favicon obsoleto — no matchea el logo nuevo~~** (resuelto 2026-08-01)
- **Qué ES:** `public/favicon.svg` (Sep 2025, 3.1KB) es un ícono abstracto turquesa multi-path que **predates el editorial redesign** (todos los otros assets son May 28 2026). No coincide con el logo canónico (cajas apiladas con flecha subiendo).
- **Peor:** `public/apple-touch-icon.png` es OTRA marca distinta (una carretilla con caja) — no es el logo actual **ni** el favicon actual. Es lo que aparece en iOS home screen cuando alguien guarda la landing.
- **Qué DEBERÍA SER:** Set completo de favicons derivados del logo nuevo (cajas + flecha):
  - `favicon.ico` (32×32 fallback legacy)
  - `favicon.svg` (icon-only, sin wordmark, scalable, ~1-3KB, teal `#38B5AF` sobre transparente)
  - `apple-touch-icon.png` (180×180, opaco con background `#fafaf7` o teal, sin transparencia — iOS aplica rounded corners y clip transparency mal)
  - `icon-192.png` + `icon-512.png` (para manifest PWA, uno con `purpose: "maskable"` con safe zone 40%)
- **Files afectados:** `public/favicon.svg`, `public/apple-touch-icon.png`, `public/manifest.webmanifest`, `index.html:8-10`
- **Effort:** S (asset generation via https://realfavicongenerator.net desde el PNG logo, o script con `sharp` + `svgo`)

**~~F2. OG image cuadrado 500×500 en lugar de 1200×630~~** (resuelto 2026-08-01 — ahora 1200×630, 140.8KB, layout V4 editorial + fake UI cierre de caja)
- **Qué ES:** `public/og-image.png` es un PNG **500×500 cuadrado** (byte-idéntico a `bueninventario-logo.png`, mismo md5). `index.html:36-37` declara `og:image:width=1200` y `og:image:height=630`. **La declaración miente**: WhatsApp/Facebook/LinkedIn/X/Discord/Slack detectan el tamaño real y aplican fallback (preview chico, crop feo, o no preview en algunos casos).
- **Qué DEBERÍA SER:** Imagen dedicada 1200×630 PNG (< 1MB idealmente < 200KB), con:
  - Wordmark "Buen Inventario" + tagline "Recuperá el control de tu comercio"
  - Contenido crítico en safe zone 1080×600 central (evita crops en Slack/Discord)
  - Editorial aesthetic aprobada (DM Serif + JetBrains Mono + `#F7F4EC` fondo + `#0E1116` texto + accent teal `#38B5AF`)
  - Screenshot chico del dashboard o del cierre de caja como visual anchor
- **Files afectados:** `public/og-image.png` (reemplazar), opcional `index.html:35-49` (chequear que sigue correct)
- **Effort:** S (diseño en Figma o generar con playwright/HTML→PNG desde un template)

**F3. SPA con `<div id="root">` vacío — invisible a AI crawlers y bots sociales**
- **Qué ES:** El `dist/index.html` servido tiene meta tags + JSON-LD estáticos (bien) pero body es literalmente `<div id="root"></div>` (index.html:91). Todo H1/H2/H3/contenido inyectado por React en runtime. Googlebot renderiza JS (funciona), pero:
  - **AI crawlers no ejecutan JS**: `GPTBot`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`, `ChatGPT-User` reciben `<div id="root"></div>` vacío → **no pueden citar Buen Inventario** en respuestas de Claude/ChatGPT/Perplexity.
  - **Bots sociales tampoco**: WhatsApp/Slack/Discord scrapean solo HTML estático → OG funciona pero cualquier meta que dependa de JS no.
  - **First Contentful Paint peor** para users con conexión mala (blank screen hasta hidratar).
- **Qué DEBERÍA SER:** Prerender build-time con Vite SSG. Opciones 2026:
  - `vite-plugin-ssg` (`@wroud/vite-plugin-ssg`) — simple, output HTML estático con contenido pre-renderizado + hidration.
  - Migrar a Astro (más disruptivo, mejor para landing puramente marketing).
  - `react-snap` post-build (más viejo, hack pero funciona).
- **Files afectados:** `vite.config.ts`, `package.json`, todo `src/` (leve refactor para SSG-friendly)
- **Effort:** M (1-2 días con plugin, testing, fix de cualquier código que asume `window`)
- **ROI:** ALTO — desbloquea LLM visibility (Claude/ChatGPT/Perplexity crecen 40% YoY como traffic source) + fix real perf.

**F4. `/privacidad` y `/terminos` son placeholders sin contenido**
- **Qué ES:** `public/privacidad.html` (14 líneas) y `public/terminos.html` (14 líneas) son ambos "Este documento se completará antes de la puesta en producción". Sin canonical, sin OG, sin JSON-LD (`PrivacyPolicy` / `TermsOfService`), sin lastmod en sitemap (no están listados). Google los va a indexar como thin content = penalty leve al dominio.
- **Adicional:** ARCA + Mercado Pago requieren TOS + Privacy publicados y accesibles para uso comercial. Actualmente hay una **hole legal** también.
- **Qué DEBERÍA SER:** Contenido legal real (política de datos, uso de cookies, retención, ley 25.326 AR, contacto DPO, jurisdicción, ToS con cláusulas de servicio, refund, uptime, MP fees). Cada uno con meta tags propios (title, description, canonical, OG), listados en sitemap con `<lastmod>`.
- **Files afectados:** `public/privacidad.html`, `public/terminos.html`, `public/sitemap.xml`
- **Effort:** L (contenido legal real requiere revisión) — o S si empezás con template Iubenda/Termly y adaptás.

### P1 — Alto impacto SEO, low effort

**F5. `<meta name="keywords">` obsoleto (spam signal)**
- **Qué ES:** `index.html:20-23` tiene keywords stuffed. Google lo ignora desde 2009, Bing puede leerlo como spam signal.
- **Qué DEBERÍA SER:** Removerlo por completo.
- **Effort:** S (delete 4 líneas)

**F6. `sitemap.xml` con `priority`/`changefreq` (ignorados) y sin `<lastmod>` (sí usado)**
- **Qué ES:**
  ```xml
  <url>
    <loc>https://www.bueninventario.com/</loc>
    <changefreq>monthly</changefreq>  <!-- ignorado -->
    <priority>1.0</priority>          <!-- ignorado -->
  </url>
  ```
- **Qué DEBERÍA SER:**
  ```xml
  <url>
    <loc>https://www.bueninventario.com/</loc>
    <lastmod>2026-07-31</lastmod>
  </url>
  <url>
    <loc>https://www.bueninventario.com/privacidad</loc>
    <lastmod>2026-07-31</lastmod>
  </url>
  <url>
    <loc>https://www.bueninventario.com/terminos</loc>
    <lastmod>2026-07-31</lastmod>
  </url>
  ```
- **Effort:** S (idealmente lastmod se genera desde git file mtime en build)

**F7. `robots.txt` genérico — no diferencia AI crawlers**
- **Qué ES:** `User-agent: * / Allow: /` + sitemap. Deja entrar TODO (incluyendo scrapers de training) y no aprovecha "allow AI search bots".
- **Qué DEBERÍA SER:**
  ```
  User-agent: *
  Allow: /

  # Block AI training scrapers (no impact on Google Search)
  User-agent: GPTBot
  Disallow: /
  User-agent: CCBot
  Disallow: /
  User-agent: anthropic-ai
  Disallow: /
  User-agent: Bytespider
  Disallow: /

  # Allow AI search bots explicitly (drive referral traffic)
  # ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended: default allow

  Sitemap: https://www.bueninventario.com/sitemap.xml
  ```
- **Decisión de negocio:** ¿querés que Claude/ChatGPT/Perplexity citen BI en respuestas? (recomendación: sí)
- **Effort:** S

**F8. hreflang missing**
- **Qué ES:** No hay `<link rel="alternate" hreflang="...">`.
- **Qué DEBERÍA SER:**
  ```html
  <link rel="alternate" hreflang="es-AR" href="https://www.bueninventario.com/" />
  <link rel="alternate" hreflang="x-default" href="https://www.bueninventario.com/" />
  ```
- **Effort:** S (2 líneas)

**F9. Canonical inconsistente (sin trailing slash)**
- **Qué ES:** `<link rel="canonical" href="https://www.bueninventario.com" />` (sin `/`) pero `og:url` sí termina en `""` (idem sin `/`). El sitemap lista `https://www.bueninventario.com/` (con `/`). Google normaliza pero mejor consistencia.
- **Qué DEBERÍA SER:** Todos con trailing slash: `https://www.bueninventario.com/`.
- **Effort:** S (2 edits en index.html)

**F10. JSON-LD `Organization.sameAs` incompleto**
- **Qué ES:** Solo lista Instagram. Footer.tsx tiene links a WhatsApp, Facebook, TikTok, Instagram + mailto. `sameAs` es señal de entity graph fuerte.
- **Qué DEBERÍA SER:**
  ```json
  "sameAs": [
    "https://instagram.com/bueninventario",
    "https://facebook.com/bueninventario",
    "https://tiktok.com/@bueninventario",
    "https://wa.me/..."
  ]
  ```
  + agregar `contactPoint` con teléfono/email + `address.addressCountry: "AR"`.
- **Effort:** S

### P2 — Medium impact, medium effort

**F11. Structured data incompleta**
- Falta `WebSite` schema (entity signal para AI/GEO):
  ```json
  { "@type": "WebSite", "url": "https://www.bueninventario.com/", "name": "Buen Inventario", "inLanguage": "es-AR" }
  ```
- Falta `FAQPage` (rich result deprecated pero AI agents lo consumen — Faq.tsx tiene 6 preguntas listas para markup).
- `GroceryStore Don Néstor` schema es semánticamente raro (Google puede pensar que el sitio ES una despensa). Alternativas: (a) removerlo, (b) convertirlo en `Review`/`Testimonial` dentro de `SoftwareApplication`, (c) moverlo a una page dedicada `/casos/don-nestor` con su propio schema.
- `SoftwareApplication` sin `url`, sin `image`, sin `screenshot`, sin `author`.
- **Effort:** M (rediseño de los 3 JSON-LD + validación en Rich Results Test)

**F12. PWA manifest incompleto para spec 2026**
- **Qué ES:** manifest.webmanifest tiene `name`, `short_name`, `description`, `start_url`, `display: "browser"`, colors, 2 icons (180+512).
- **Falta:** `id`, `scope`, `lang: "es-AR"`, `dir: "ltr"`, `categories: ["business", "productivity"]`, `screenshots` (requerido para rich install prompt Chrome/Android), icon 192×192, icon con `purpose: "maskable"`.
- **Effort:** S (edit + generar screenshots + icons 192)

**F13. FAQ semantic weak (no H3 tags)**
- **Qué ES:** Faq.tsx renderiza preguntas dentro de `<summary>` sin heading tag. Accesibilidad OK, SEO/AI menos fuerte.
- **Qué DEBERÍA SER:** `<details><summary><h3>¿Pregunta?</h3></summary>...` o al menos wrappear la summary con `<h3>` fuera. Compatible con FAQPage JSON-LD (F11).
- **Effort:** S (edit componente)

**F14. `theme-color` sin dark mode media queries**
- **Qué ES:** `<meta name="theme-color" content="#fafaf7" />` (solo light).
- **Qué DEBERÍA SER:**
  ```html
  <meta name="theme-color" content="#fafaf7" media="(prefers-color-scheme: light)" />
  <meta name="theme-color" content="#0E1116" media="(prefers-color-scheme: dark)" />
  <meta name="color-scheme" content="light dark" />
  ```
- **Effort:** S

**F15. Logo servido como PNG 108KB en lugar de SVG inline**
- **Qué ES:** Header.tsx:23-25 y Footer.tsx:17-19 usan `<img src="/bueninventario-logo.png">` (108KB PNG). En LCP path.
- **Qué DEBERÍA SER:** SVG inline como React component (`<Logo />`), ~1-3KB, escalable, mejor perf, mejor accessibility control.
- **Effort:** M (crear componente Logo SVG desde el PNG source — requerir vectorizar o rehacer en Figma).

### P3 — Nice to have

- **F16.** No `preconnect` a dominios externos (analytics, WhatsApp business, etc.). Solo aplica si se agregan.
- **F17.** `llms.txt` — bajo ROI hoy para landing chica sin docs largos. Skip; revisar en 6 meses cuando haya /blog o /docs.
- **F18.** `<meta name="referrer">` explicit + `<meta name="format-detection" content="telephone=no">` (evita autoconversión iOS de números tipo CUIT).
- **F19.** Image sitemap (útil si /precios o /features tienen screenshots).
- **F20.** Auditar INP real con Vercel Speed Insights o `web-vitals` lib.

---

## Standards Compliance (docs/reference/STANDARDS.md — webs)

Los standards del repo (según memory) para webs incluyen: mobile-first verificable, SEO meta tags, performance budget, checkout flow integrity.

- ✅ **Mobile-first**: viewport correcto, responsive components.
- ⚠️ **SEO meta tags**: base OK, gaps documentados arriba (F5, F8, F9, F10).
- ⚠️ **Performance budget**: fonts optimizados, pero logo PNG y og-image 108KB inflados; INP no medido.
- N/A **Checkout flow**: no aplica a landing pública.

---

## Priority order — qué fixear primero

**Sprint 1 (esta semana, quick wins):**
1. F1 — Favicon set nuevo desde el logo real (user-flagged)
2. F2 — OG image dedicada 1200×630
3. F5 — Remove `<meta name="keywords">`
4. F6 — Sitemap con lastmod + /privacidad + /terminos
5. F7 — robots.txt con AI crawlers
6. F8 — hreflang
7. F9 — Canonical trailing slash
8. F10 — sameAs + contactPoint + addressCountry
9. F14 — theme-color dark

Total: 1 día de trabajo. Cambia baseline de "5/10" a "7.5/10".

**Sprint 2 (próximas 2 semanas, impacto grande):**
10. F3 — Migrar a SSG (`vite-plugin-ssg` o Astro). Desbloquea LLM visibility.
11. F4 — Escribir Privacy Policy + ToS reales.
12. F11 — Structured data completa (WebSite + FAQPage + rework GroceryStore).
13. F12 — PWA manifest 2026.

Total: 3-5 días. Cambia baseline a "9/10".

**Backlog (mes 2+):**
14. F13 — FAQ h3 tags
15. F15 — Logo SVG inline
16. F20 — INP audit + optimización
17. F16-F19 — Nice-to-haves

---

## Next actions ofrecidas al user

- Brainstormear el nuevo favicon set + OG image design (→ `bi-brainstorm`)
- Crear un plan de implementación para Sprint 1 completo (→ `bi-plan`)
- Solo fix del favicon (user-flagged) como primer commit y después seguir con el resto
- Mantener el audit como referencia y priorizar después
