# Favicon set + OG image redesign · Implementation Plan

> **Para agentic workers:** Usar `bi-execute` para implementar este plan task-by-task. Los steps usan checkbox syntax (`- [ ]`) para tracking. Cada task termina en commit checkpoint.

**Goal:** Reemplazar el favicon obsoleto + apple-touch-icon incorrecto + og-image mal-dimensionado por un set completo 2026 derivado del logo oficial, generado por un script reproducible en el repo (Playwright + sharp + svgo + to-ico).

**Architecture:** Todo el build pipeline vive en `scripts/` — cero acoplamiento con `src/`. El script lee un SVG source + templates HTML standalone, produce 7 assets estáticos que Vercel sirve desde `public/`. `index.html` + `manifest.webmanifest` se actualizan a spec 2026 (link tags con múltiples icons + manifest con `id`/`scope`/`lang`/`categories`/maskable). El runtime del sitio no cambia — solo lo que sirve el navegador antes del bundle React.

**Tech Stack:** TypeScript 5.8 strict (dev tooling), Node 20+, Playwright 1.50, sharp 0.34, svgo 3.3, to-ico 1.1, tsx 4.x.

**Spec source:** `docs/plans/2026-08-01-favicon-og-redesign-design.md` (aprobado 2026-08-01).
**Audit source:** `docs/audits/2026-07-31-seo-landing.md` (F1 + F2).
**Mockups (visual source of truth):**
- `mockups/2026-08-01-favicon-explorations.html` — icon strategy (Variante 1 aprobada)
- `mockups/2026-08-01-apple-touch-explorations.html` — apple-touch bg (Opción D gradient teal aprobada)
- `mockups/2026-08-01-og-image-explorations.html` — OG layout (V4 split + fake UI aprobado)
- `mockups/logo-vectorized.svg` — SVG source vectorizado con potrace

---

## Standards aplicables

**El landing repo no tiene STANDARDS.md propio.** Aplicamos las reglas del `landing-redesign-plan.md` previo (source: `buen-inventario-webs/docs/reference/STANDARDS.md`), filtrando por lo que aplica a build tooling:

- **TypeScript**: `strict: true` en todo el pipeline. Cero `any`, cero `as any`. Return types explícitos en toda función exportada.
- **File sizes**: helper ≤100 LOC, orchestrator ≤80 LOC, templates HTML sin límite (son data).
- **Naming**: kebab-case para helpers (`build-app-icons.ts`), camelCase para exports (`buildAppIcons()`).
- **No red words** en código, comments, ni docs generados: `TODO`, `FIXME`, `later`, `for now`, `por ahora`, `MVP`, `simplified`, `future`, `deferred`. Self-audit pre-merge obligatorio.
- **Performance budget**: OG image final ≤ 200KB. Favicons SVG ≤ 6KB post-svgo. Cada PNG ≤ 50KB (excepto icon-512 y og-image, que pueden estar más grandes).
- **SEO impact**: `<link rel="icon">` tags con múltiples entradas para que Chrome/Safari/Firefox seleccionen el correcto. `<meta og:image>` sigue apuntando al mismo path (`/og-image.png`) con dims 1200×630 verificadas contra el asset real.

## Operational Rules (REQUIRED)

- **Multi-tenant**: N/A — landing single-tenant.
- **NEVER commitear** `.env` ni `.env.*` (no aplica — este plan no maneja secrets).
- **Adapter boundary**: cada external dep (playwright, sharp, svgo, to-ico) accedida SOLO desde `scripts/lib/*` — nunca imports directos desde `scripts/generate-assets.ts`. El orchestrator solo llama helpers.
- **Assets in git**: los outputs del pipeline (`public/*.png`, `public/*.svg`, `public/*.ico`) SÍ se commitean (Vercel los sirve estáticos, no corre `pnpm generate:assets` en build).
- **No red words** en cualquier file tocado.

---

## File structure map

### Nuevos archivos (crear)

| Path | Rol | Est. LOC |
|---|---|---|
| `scripts/sources/logo.svg` | Single source of truth del logo vectorizado (copiado desde `mockups/logo-vectorized.svg`) | ~10 (SVG) |
| `scripts/templates/og-image.html` | Template V4 standalone del OG (paper bg + brand mark + display + fake UI del cierre de caja) | ~180 (HTML/CSS) |
| `scripts/lib/paths.ts` | Constants: rutas a source, templates, outputs, dims | ~30 |
| `scripts/lib/optimize-svg.ts` | Helper: lee SVG source, corre svgo, escribe `public/favicon.svg` | ~35 |
| `scripts/lib/build-favicon-ico.ts` | Helper: SVG → PNGs 16/32/48 → ICO multi-res via to-ico | ~45 |
| `scripts/lib/build-app-icons.ts` | Helper: SVG + gradient teal bg → apple-touch (180), icon-192, icon-512, icon-maskable-512 | ~90 |
| `scripts/lib/build-og-image.ts` | Helper: Playwright headless → screenshot 1200×630 del template HTML → PNG optimizado | ~55 |
| `scripts/generate-assets.ts` | Orchestrator: llama los 5 helpers en orden, prints summary con dims/sizes | ~70 |

### Files a modificar

| Path | Cambio | Scope |
|---|---|---|
| `index.html` | Reemplazar líneas 8-10 (favicon links) con set 2026 | 4 líneas |
| `public/manifest.webmanifest` | Full rewrite: agregar `id`, `scope`, `lang`, `dir`, `categories`, icons array con 192 + maskable | Full file |
| `package.json` | Agregar `generate:assets` script + devDeps (playwright, sharp, svgo, to-ico, tsx) | 5 líneas |

### Files a reemplazar (overwritten por script)

| Path | Estado actual | Post-script |
|---|---|---|
| `public/favicon.svg` | 3.1KB, ícono viejo Sep 2025 | ~2-3KB, logo oficial vectorizado teal |
| `public/apple-touch-icon.png` | 8KB, marca distinta (carretilla) | ~15-25KB, logo blanco sobre gradient teal |
| `public/og-image.png` | 108KB, 500×500 cuadrado mal-dimensionado | ≤200KB, 1200×630, V4 split |

### Files a crear (nuevos assets)

| Path | Dims/Formato |
|---|---|
| `public/favicon.ico` | Multi-res 16/32/48 |
| `public/icon-192.png` | 192×192 PNG opaco |
| `public/icon-512.png` | 512×512 PNG opaco |
| `public/icon-maskable-512.png` | 512×512 PNG opaco, logo al 60% central |

### Files a NO tocar (out-of-scope)

- `public/bueninventario-logo.png` — sigue linkeado desde `Header.tsx`, `Footer.tsx`, JSON-LD Organization.logo. Refactor a SVG inline es F15 del audit, otro sprint.
- `src/**` — cero cambios.

---

## Tasks

### Task 1: Setup dependencies + tsconfig node include

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.node.json`

**Constraints:**
- TypeScript strict, sin `any`.
- Dev deps only — nada del pipeline debe ejecutarse en runtime del bundle React.
- Node target ES2023 (ya configurado en `tsconfig.node.json`).

**Multi-tenant impact:** N/A.

- [ ] **Step 1.1:** Instalar dev dependencies con pnpm:
  ```bash
  cd "/Users/nestorberlanga/Desktop/Buen Inventario/buen-inventario-landingpage"
  pnpm add -D playwright@^1.50.0 sharp@^0.34.0 svgo@^3.3.0 to-ico@^1.1.5 tsx@^4.19.0
  ```
- [ ] **Step 1.2:** Instalar el browser chromium para Playwright:
  ```bash
  pnpm exec playwright install chromium
  ```
- [ ] **Step 1.3:** Agregar el script en `package.json` — reemplazar el bloque `"scripts"`:
  ```json
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "generate:assets": "tsx scripts/generate-assets.ts"
  }
  ```
- [ ] **Step 1.4:** Agregar `scripts/**/*.ts` al `include` de `tsconfig.node.json` para que el lint no lo ignore. Reemplazar la línea `"include": ["vite.config.ts"]` por:
  ```json
  "include": ["vite.config.ts", "scripts/**/*.ts"]
  ```
- [ ] **Step 1.5:** Verificar que `pnpm exec tsc -p tsconfig.node.json --noEmit` corre sin errores (verá `vite.config.ts` sólo por ahora — scripts todavía no existen, no debe fallar).
- [ ] **Commit:** `git add package.json pnpm-lock.yaml tsconfig.node.json && git commit -m "chore(landing): add asset generation pipeline devDeps"`

---

### Task 2: SVG source + optimize helper

**Files:**
- Create: `scripts/sources/logo.svg`
- Create: `scripts/lib/paths.ts`
- Create: `scripts/lib/optimize-svg.ts`

**Constraints:**
- `paths.ts` ≤ 30 LOC — solo constants, sin lógica.
- `optimize-svg.ts` ≤ 40 LOC — single responsibility.
- Return types explícitos en cada función.

**Multi-tenant impact:** N/A.

- [ ] **Step 2.1:** Copiar el SVG vectorizado como source of truth:
  ```bash
  cp "mockups/logo-vectorized.svg" "scripts/sources/logo.svg"
  ```
- [ ] **Step 2.2:** Crear `scripts/lib/paths.ts` con las constantes de paths y dims:
  ```ts
  import path from "node:path";
  import { fileURLToPath } from "node:url";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const ROOT = path.resolve(__dirname, "..", "..");

  export const PATHS = {
    root: ROOT,
    sourceSvg: path.join(ROOT, "scripts", "sources", "logo.svg"),
    ogTemplate: path.join(ROOT, "scripts", "templates", "og-image.html"),
    publicDir: path.join(ROOT, "public"),
    outFaviconSvg: path.join(ROOT, "public", "favicon.svg"),
    outFaviconIco: path.join(ROOT, "public", "favicon.ico"),
    outAppleTouch: path.join(ROOT, "public", "apple-touch-icon.png"),
    outIcon192: path.join(ROOT, "public", "icon-192.png"),
    outIcon512: path.join(ROOT, "public", "icon-512.png"),
    outIconMaskable: path.join(ROOT, "public", "icon-maskable-512.png"),
    outOgImage: path.join(ROOT, "public", "og-image.png"),
  } as const;

  export const TEAL = "#38B5AF";
  export const TEAL_DEEP = "#1F857F";
  export const PAPER = "#F7F4EC";
  ```
- [ ] **Step 2.3:** Crear `scripts/lib/optimize-svg.ts`:
  ```ts
  import { readFileSync, writeFileSync } from "node:fs";
  import { optimize } from "svgo";
  import { PATHS } from "./paths.ts";

  export function optimizeSvg(): { bytes: number } {
    const raw = readFileSync(PATHS.sourceSvg, "utf8");
    const result = optimize(raw, {
      multipass: true,
      plugins: [
        {
          name: "preset-default",
          params: { overrides: { removeViewBox: false } },
        },
        { name: "removeDimensions" },
      ],
    });
    writeFileSync(PATHS.outFaviconSvg, result.data, "utf8");
    return { bytes: Buffer.byteLength(result.data, "utf8") };
  }
  ```
- [ ] **Step 2.4:** Verificar que `pnpm exec tsc -p tsconfig.node.json --noEmit` sigue sin errores.
- [ ] **Commit:** `git add scripts/sources scripts/lib && git commit -m "feat(landing/assets): add SVG source and optimize helper"`

---

### Task 3: Favicon ICO builder

**Files:**
- Create: `scripts/lib/build-favicon-ico.ts`

**Constraints:**
- ≤ 50 LOC.
- ICO multi-res 16/32/48 (los tres que Chrome/Edge/crawlers legacy esperan).
- Sharp rasteriza el SVG en memoria (no toca disk excepto para el output final).

**Multi-tenant impact:** N/A.

- [ ] **Step 3.1:** Crear `scripts/lib/build-favicon-ico.ts`:
  ```ts
  import { readFileSync, writeFileSync } from "node:fs";
  import sharp from "sharp";
  import toIco from "to-ico";
  import { PATHS } from "./paths.ts";

  const ICO_SIZES = [16, 32, 48] as const;

  export async function buildFaviconIco(): Promise<{ bytes: number }> {
    const svgBuffer = readFileSync(PATHS.sourceSvg);

    const pngBuffers = await Promise.all(
      ICO_SIZES.map((size) =>
        sharp(svgBuffer, { density: 384 })
          .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .png()
          .toBuffer(),
      ),
    );

    const icoBuffer = await toIco(pngBuffers);
    writeFileSync(PATHS.outFaviconIco, icoBuffer);
    return { bytes: icoBuffer.byteLength };
  }
  ```
- [ ] **Step 3.2:** Verificar tsc sin errores.
- [ ] **Commit:** `git add scripts/lib/build-favicon-ico.ts && git commit -m "feat(landing/assets): add favicon.ico multi-res builder"`

---

### Task 4: App icons builder (apple-touch + PWA + maskable) con gradient background

**Files:**
- Create: `scripts/lib/build-app-icons.ts`

**Constraints:**
- ≤ 100 LOC.
- Gradient teal 135° `#38B5AF → #1F857F` (aprobado por user, matchea el mockup `2026-08-01-apple-touch-explorations.html` opción D).
- Logo blanco compuesto centrado. Padding regular = 15% (apple-touch, icon-192, icon-512). Maskable = safe zone 40%, logo ocupa 60% central.
- Sharp maneja todo el compositing en memoria.

**Multi-tenant impact:** N/A.

- [ ] **Step 4.1:** Crear `scripts/lib/build-app-icons.ts`:
  ```ts
  import { readFileSync, writeFileSync } from "node:fs";
  import sharp from "sharp";
  import { PAPER, PATHS, TEAL, TEAL_DEEP } from "./paths.ts";

  type IconSpec = {
    size: number;
    outPath: string;
    logoScale: number;
  };

  const SPECS: readonly IconSpec[] = [
    { size: 180, outPath: PATHS.outAppleTouch, logoScale: 0.70 },
    { size: 192, outPath: PATHS.outIcon192, logoScale: 0.70 },
    { size: 512, outPath: PATHS.outIcon512, logoScale: 0.70 },
    { size: 512, outPath: PATHS.outIconMaskable, logoScale: 0.60 },
  ];

  function gradientSvg(size: number): Buffer {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${TEAL}"/>
          <stop offset="100%" stop-color="${TEAL_DEEP}"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#g)"/>
    </svg>`;
    return Buffer.from(svg, "utf8");
  }

  function paperLogoSvg(source: string): string {
    return source.replace(/fill="#38B5AF"/gi, `fill="${PAPER}"`);
  }

  export async function buildAppIcons(): Promise<{ files: { path: string; bytes: number }[] }> {
    const svgSource = readFileSync(PATHS.sourceSvg, "utf8");
    const paperLogo = paperLogoSvg(svgSource);

    const results: { path: string; bytes: number }[] = [];

    for (const spec of SPECS) {
      const bg = await sharp(gradientSvg(spec.size)).png().toBuffer();
      const logoSize = Math.round(spec.size * spec.logoScale);
      const logo = await sharp(Buffer.from(paperLogo, "utf8"), { density: 384 })
        .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

      const composed = await sharp(bg)
        .composite([{ input: logo, gravity: "center" }])
        .png({ compressionLevel: 9 })
        .toBuffer();

      writeFileSync(spec.outPath, composed);
      results.push({ path: spec.outPath, bytes: composed.byteLength });
    }

    return { files: results };
  }
  ```
- [ ] **Step 4.2:** Verificar tsc sin errores.
- [ ] **Commit:** `git add scripts/lib/build-app-icons.ts && git commit -m "feat(landing/assets): add app icons builder with gradient teal bg"`

---

### Task 5: OG image HTML template

**Files:**
- Create: `scripts/templates/og-image.html`

**Constraints:**
- Standalone: fuentes vía Google Fonts `@import` (Playwright tiene network). Sin dependencias con `src/` ni `public/fonts/`.
- Layout V4 exacto del mockup aprobado `mockups/2026-08-01-og-image-explorations.html`.
- Body dims exactos 1200×630 sin scroll. Contenido crítico dentro de safe zone 1080×600 central.
- No red words en copy.

**Multi-tenant impact:** N/A.

- [ ] **Step 5.1:** Crear `scripts/templates/og-image.html`:
  ```html
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: 1200px; height: 630px; overflow: hidden; background: #F7F4EC; color: #0E1116; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
      .canvas { width: 1200px; height: 630px; display: flex; }
      .left { flex: 1; padding: 60px; display: flex; flex-direction: column; justify-content: space-between; }
      .brand-mark { display: flex; align-items: center; gap: 20px; }
      .brand-mark .logo { width: 68px; height: 68px; }
      .brand-mark .brand-text { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: 36px; letter-spacing: -0.01em; }
      .display { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: 72px; line-height: 1.05; letter-spacing: -0.02em; }
      .italic { font-style: italic; color: #1F857F; }
      .sub { font-family: 'Inter', sans-serif; font-size: 20px; color: #4A4A45; line-height: 1.5; max-width: 480px; margin-top: 20px; }
      .foot { font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #6B6B66; letter-spacing: 0.04em; }
      .right { flex: 0 0 520px; background: linear-gradient(135deg, #EFEBDD 0%, #F7F4EC 100%); padding: 60px 0 60px 40px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
      .fake-ui { width: 500px; height: 480px; background: #FFFFFF; border-radius: 6px 0 0 6px; box-shadow: -20px 20px 40px rgba(14,17,22,0.15); padding: 28px 32px; font-family: 'Inter', sans-serif; }
      .ui-title { font-family: 'DM Serif Display', serif; font-size: 26px; margin: 0 0 6px; }
      .ui-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #6B6B66; margin-bottom: 24px; }
      .metric { display: flex; justify-content: space-between; align-items: baseline; padding: 14px 0; border-bottom: 1px solid rgba(14,17,22,0.08); }
      .metric:last-child { border: none; }
      .m-lbl { font-size: 14px; color: #6B6B66; }
      .m-val { font-family: 'DM Serif Display', serif; font-size: 26px; color: #0E1116; }
      .m-val.pos { color: #1F857F; }
      .m-val.neg { color: #C64545; }
    </style>
  </head>
  <body>
    <div class="canvas">
      <div class="left">
        <div class="brand-mark">
          <img class="logo" src="__LOGO_DATA_URI__" alt="">
          <div class="brand-text">Buen Inventario</div>
        </div>
        <div>
          <div class="display">Recuperá el control <span class="italic">de tu comercio.</span></div>
          <div class="sub">Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista.</div>
        </div>
        <div class="foot">bueninventario.com · 30 días gratis</div>
      </div>
      <div class="right">
        <div class="fake-ui">
          <div class="ui-title">Cierre de caja</div>
          <div class="ui-sub">Hoy · lunes 04 · 20:34</div>
          <div class="metric"><span class="m-lbl">Ventas</span><span class="m-val">$ 284.500</span></div>
          <div class="metric"><span class="m-lbl">Efectivo</span><span class="m-val">$ 142.300</span></div>
          <div class="metric"><span class="m-lbl">Transferencia</span><span class="m-val">$ 87.200</span></div>
          <div class="metric"><span class="m-lbl">Fiado</span><span class="m-val neg">$ 55.000</span></div>
          <div class="metric"><span class="m-lbl">Ganancia bruta</span><span class="m-val pos">$ 84.750</span></div>
        </div>
      </div>
    </div>
  </body>
  </html>
  ```
- [ ] **Step 5.2:** Verificar el HTML abriendo `scripts/templates/og-image.html` en el browser — el `__LOGO_DATA_URI__` va a mostrar un icon roto, es esperado (el helper reemplaza ese token en runtime con el SVG data-URI). El resto del layout debe verse correcto a viewport 1200×630.
- [ ] **Commit:** `git add scripts/templates/og-image.html && git commit -m "feat(landing/assets): add OG image V4 template"`

---

### Task 6: OG image builder con Playwright

**Files:**
- Create: `scripts/lib/build-og-image.ts`

**Constraints:**
- ≤ 60 LOC.
- Playwright chromium headless, viewport 1200×630, `deviceScaleFactor: 2` para producir imagen crisp (después downscale a 1200×630 real dims).
- Wait for fonts loaded (`document.fonts.ready`) antes del screenshot.
- Optimizar PNG con sharp `png({ compressionLevel: 9, palette: true })`.
- Target: ≤ 200KB final size.

**Multi-tenant impact:** N/A.

- [ ] **Step 6.1:** Crear `scripts/lib/build-og-image.ts`:
  ```ts
  import { readFileSync, writeFileSync } from "node:fs";
  import { chromium } from "playwright";
  import sharp from "sharp";
  import { PATHS } from "./paths.ts";

  const OG_WIDTH = 1200;
  const OG_HEIGHT = 630;

  export async function buildOgImage(): Promise<{ bytes: number }> {
    const svgSource = readFileSync(PATHS.sourceSvg, "utf8");
    const templateRaw = readFileSync(PATHS.ogTemplate, "utf8");
    const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(svgSource, "utf8").toString("base64")}`;
    const html = templateRaw.replace("__LOGO_DATA_URI__", logoDataUri);

    const browser = await chromium.launch();
    try {
      const context = await browser.newContext({
        viewport: { width: OG_WIDTH, height: OG_HEIGHT },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.setContent(html, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const raw = await page.screenshot({ type: "png", omitBackground: false, clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT } });
      await context.close();

      const optimized = await sharp(raw)
        .resize(OG_WIDTH, OG_HEIGHT, { fit: "contain" })
        .png({ compressionLevel: 9, palette: true, quality: 90 })
        .toBuffer();

      writeFileSync(PATHS.outOgImage, optimized);
      return { bytes: optimized.byteLength };
    } finally {
      await browser.close();
    }
  }
  ```
- [ ] **Step 6.2:** Verificar tsc sin errores.
- [ ] **Commit:** `git add scripts/lib/build-og-image.ts && git commit -m "feat(landing/assets): add OG image Playwright builder"`

---

### Task 7: Orchestrator + primera corrida

**Files:**
- Create: `scripts/generate-assets.ts`

**Constraints:**
- ≤ 80 LOC.
- Orchestrator solo llama helpers, sin lógica de generación.
- Print summary tabular al final: cada asset con path relativo, dims, bytes, status.
- Exit code 1 si algún step falla, con context.

**Multi-tenant impact:** N/A.

- [ ] **Step 7.1:** Crear `scripts/generate-assets.ts`:
  ```ts
  import { relative } from "node:path";
  import { PATHS } from "./lib/paths.ts";
  import { optimizeSvg } from "./lib/optimize-svg.ts";
  import { buildFaviconIco } from "./lib/build-favicon-ico.ts";
  import { buildAppIcons } from "./lib/build-app-icons.ts";
  import { buildOgImage } from "./lib/build-og-image.ts";

  type Row = { asset: string; bytes: number };

  function formatKb(bytes: number): string {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  function rel(abs: string): string {
    return relative(PATHS.root, abs);
  }

  async function main(): Promise<void> {
    const started = Date.now();
    const rows: Row[] = [];

    console.log("[assets] optimizing SVG source...");
    const svg = optimizeSvg();
    rows.push({ asset: rel(PATHS.outFaviconSvg), bytes: svg.bytes });

    console.log("[assets] building favicon.ico...");
    const ico = await buildFaviconIco();
    rows.push({ asset: rel(PATHS.outFaviconIco), bytes: ico.bytes });

    console.log("[assets] building app icons (apple-touch + PWA + maskable)...");
    const apps = await buildAppIcons();
    for (const f of apps.files) rows.push({ asset: rel(f.path), bytes: f.bytes });

    console.log("[assets] building OG image via Playwright...");
    const og = await buildOgImage();
    rows.push({ asset: rel(PATHS.outOgImage), bytes: og.bytes });

    console.log("\n[assets] summary:");
    for (const r of rows) {
      console.log(`  ${r.asset.padEnd(40)} ${formatKb(r.bytes).padStart(10)}`);
    }
    console.log(`\n[assets] done in ${((Date.now() - started) / 1000).toFixed(2)}s`);
  }

  main().catch((err) => {
    console.error("[assets] failed:", err);
    process.exit(1);
  });
  ```
- [ ] **Step 7.2:** Correr la primera generación:
  ```bash
  pnpm run generate:assets
  ```
- [ ] **Step 7.3:** Verificar que existen los 7 assets en `public/`:
  ```bash
  ls -la public/favicon.ico public/favicon.svg public/apple-touch-icon.png public/icon-192.png public/icon-512.png public/icon-maskable-512.png public/og-image.png
  ```
  Esperado: 7 archivos existen. `favicon.svg` ≤ 6KB. `og-image.png` ≤ 200KB. `icon-maskable-512.png` con logo visible al 60% central.
- [ ] **Step 7.4:** Abrir cada PNG en Preview.app y verificar visualmente que matchean los mockups aprobados. Si algo se ve mal, ajustar el helper correspondiente (no el output — el output se regenera desde source).
- [ ] **Commit:** `git add scripts/generate-assets.ts public/favicon.ico public/favicon.svg public/apple-touch-icon.png public/icon-192.png public/icon-512.png public/icon-maskable-512.png public/og-image.png && git commit -m "feat(landing/assets): generate favicon set + OG image from vectorized logo"`

---

### Task 8: Actualizar index.html con nuevos favicon links

**Files:**
- Modify: `index.html:8-10`

**Constraints:**
- SEO: `<link rel="icon">` con `sizes="32x32"` para el ICO ayuda a Chrome elegirlo antes que el SVG cuando el browser necesita un raster chico.
- El SVG link va SIN `sizes` (es scalable).
- `apple-touch-icon` sin `sizes` explícito (el default 180×180 es el spec 2026).

**Multi-tenant impact:** N/A.

- [ ] **Step 8.1:** En `index.html`, reemplazar las líneas 8-10 (actuales):
  ```html
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  ```
  Por:
  ```html
  <link rel="icon" href="/favicon.ico" sizes="32x32" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.webmanifest" />
  ```
- [ ] **Step 8.2:** Correr `pnpm run build` para asegurar que el index.html sigue procesándose sin errores (Vite copia los assets de `public/` a `dist/` sin transformarlos).
- [ ] **Step 8.3:** Verificar `dist/index.html` tiene los 4 link tags nuevos.
- [ ] **Commit:** `git add index.html && git commit -m "feat(landing/seo): update favicon link tags to 2026 set"`

---

### Task 9: Actualizar manifest.webmanifest a spec 2026

**Files:**
- Modify: `public/manifest.webmanifest` (full replace)

**Constraints:**
- Campos required 2026: `id`, `scope`, `lang`, `dir`, `categories`.
- Icons array con 192 + 512 + maskable (Chrome Lighthouse installable manifest requirements).
- `display: "browser"` (landing es marketing, no forzar app UX — decidido en spec).
- Colors matchean `theme-color` del index.html.

**Multi-tenant impact:** N/A.

- [ ] **Step 9.1:** Reemplazar el contenido completo de `public/manifest.webmanifest`:
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
- [ ] **Step 9.2:** Validar el JSON:
  ```bash
  cat public/manifest.webmanifest | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8')); console.log('valid json')"
  ```
- [ ] **Step 9.3:** Correr `pnpm run build` — Vite debe copiar el manifest a `dist/` sin transformarlo.
- [ ] **Commit:** `git add public/manifest.webmanifest && git commit -m "feat(landing/pwa): update manifest to 2026 spec with maskable icon"`

---

### Task 10: Local testing — dev server + DevTools verify

**Files:** none (test-only task)

**Constraints:**
- Chrome DevTools debe reconocer todos los icons.
- Ningún warning de "no favicon" o "manifest incomplete" en consola.

**Multi-tenant impact:** N/A.

- [ ] **Step 10.1:** Correr el dev server:
  ```bash
  pnpm run dev
  ```
- [ ] **Step 10.2:** Abrir `http://localhost:5173` en Chrome. Verificar:
  - Favicon visible en el tab del browser.
  - Sin warnings en Console tab de DevTools.
- [ ] **Step 10.3:** DevTools → Application → Manifest. Verificar:
  - `name`, `short_name`, `description`, `id`, `scope`, `start_url`, `display`, `lang`, `dir`, `categories`, colors visibles.
  - Icons list muestra los 4 (180 apple-touch, 192, 512, 512 maskable).
  - Sin warnings.
- [ ] **Step 10.4:** DevTools → Application → Icons. Verificar cada icon se carga sin 404.
- [ ] **Step 10.5:** DevTools → Network → filtrar `favicon`. Chrome debe cargar `favicon.ico` **o** `favicon.svg` (el que prefiera). Ambos deben responder 200.
- [ ] **Step 10.6:** Test cross-browser rápido — abrir `http://localhost:5173` en Safari y Firefox, verificar favicon visible en tab.
- [ ] **Step 10.7:** Screenshot de DevTools Manifest tab + save en `mockups/2026-08-01-devtools-manifest-verify.png` para referencia (opcional).
- [ ] **Commit:** No commit — task es solo de verificación. Si algo falla, volver al step correspondiente y arreglar (no dejar warnings acumulados).

---

### Task 11: Verify OG image + build final

**Files:** none (verification only)

**Constraints:**
- `og-image.png` debe ser exactamente 1200×630.
- Dims declaradas en `index.html:36-37` (`og:image:width=1200`, `og:image:height=630`) matchean el asset real.

**Multi-tenant impact:** N/A.

- [ ] **Step 11.1:** Verificar dimensiones del OG image:
  ```bash
  file public/og-image.png
  ```
  Output esperado incluye `1200 x 630`.
- [ ] **Step 11.2:** Verificar tamaño ≤ 200KB:
  ```bash
  ls -la public/og-image.png
  ```
  Si > 200KB: ajustar `build-og-image.ts` con `palette: true` más agresivo o cambiar `quality: 85`. Re-run `pnpm run generate:assets` y re-check.
- [ ] **Step 11.3:** Verificar visualmente el OG abriendo el PNG en Preview.app. Debe mostrar: brand mark izquierda arriba, headline hero centro-izquierda, subhead abajo, footer con URL, y a la derecha el fake UI del cierre de caja con datos ARG plausibles y colores paper/ink/teal.
- [ ] **Step 11.4:** Correr `pnpm run build` final. Verificar `dist/` contiene los 7 assets + index.html + manifest actualizados.
- [ ] **Step 11.5:** Correr `pnpm run preview` y abrir `http://localhost:4173`. Repetir DevTools Manifest verify de Task 10. Todo debe seguir OK con el bundle production.

---

### Task 12: Deploy Vercel + external validators

**Files:** none (deploy + external verification)

**Constraints:**
- Vercel Preview URL usada para validators externos que requieren URL pública.
- No mergear a main hasta que los 4 validators pasen.

**Multi-tenant impact:** N/A.

- [ ] **Step 12.1:** Push branch a Vercel preview:
  ```bash
  git push origin <branch-name>
  ```
- [ ] **Step 12.2:** Esperar Vercel preview deploy. Copiar la Preview URL (ej. `https://buen-inventario-landingpage-xxxx.vercel.app`).
- [ ] **Step 12.3:** Validar OG con https://www.opengraph.xyz/ — pegar Preview URL. Verificar que preview muestra el V4 correctamente (paper + brand + display + fake UI).
- [ ] **Step 12.4:** Validar con LinkedIn Post Inspector https://www.linkedin.com/post-inspector/. Debe cargar el OG con dims 1200×630 sin warnings.
- [ ] **Step 12.5:** Validar con X Card Validator https://cards-dev.twitter.com/validator. Card `summary_large_image` debe renderizar el OG.
- [ ] **Step 12.6:** Validar con https://realfavicongenerator.net/favicon_checker con la Preview URL. Verificar que detecta el set completo (ICO + SVG + apple-touch + PWA icons + manifest). Todos los checks deben pasar.
- [ ] **Step 12.7:** WhatsApp Web / desktop → mandar Preview URL a un chat de prueba propio. Verificar el preview link muestra el OG nuevo, no el viejo cuadrado.
- [ ] **Step 12.8:** iOS Safari real (o simulator) → cargar Preview URL → tocar Share → "Add to Home Screen". Verificar el ícono en home screen matchea el mockup aprobado (gradient teal + logo blanco centrado).
- [ ] **Step 12.9:** Si algún validator falla, diagnosticar (chequear Console del validator, headers de respuesta, dims del PNG), arreglar en el pipeline o config, re-generate + re-deploy.
- [ ] **Step 12.10:** Con los 4 validators verdes, mergear a main y verificar el deploy production sirve los assets nuevos.
- [ ] **Commit:** No hay code changes en esta task. Si algo se arregla, se commitea en la task de origen.

---

### Task 13: Post-deploy cleanup + doc update

**Files:**
- Modify: `docs/audits/2026-07-31-seo-landing.md`

**Constraints:**
- Marcar F1 + F2 como resueltos en el audit.
- No red words.

**Multi-tenant impact:** N/A.

- [ ] **Step 13.1:** En `docs/audits/2026-07-31-seo-landing.md`, agregar arriba de la sección `## Findings priorizados por severidad` una línea:
  ```markdown
  > **Update 2026-08-01:** F1 (favicon set) + F2 (OG image) resueltos. Ver `docs/plans/2026-08-01-favicon-og-redesign-plan.md`.
  ```
- [ ] **Step 13.2:** En la lista de findings, marcar F1 y F2 como `~~resueltos~~` (strikethrough con la fecha):
  ```markdown
  ~~F1. Favicon obsoleto — no matchea el logo nuevo~~ (resuelto 2026-08-01)
  ~~F2. OG image cuadrado 500×500 en lugar de 1200×630~~ (resuelto 2026-08-01)
  ```
- [ ] **Step 13.3:** Verificar que no hay red words en el audit update.
- [ ] **Commit:** `git add docs/audits/2026-07-31-seo-landing.md && git commit -m "docs(landing/audit): mark F1+F2 as resolved"`

---

## Self-review checklist

- [x] **Spec coverage:** cada requirement del spec tiene task(s):
  - Favicon set completo (F1) → Tasks 3, 4, 8
  - Vectorización SVG → Task 2
  - Apple-touch gradient teal → Task 4
  - PWA icons + maskable → Task 4
  - OG image 1200×630 V4 (F2) → Tasks 5, 6, 11
  - Pipeline script → Task 7
  - Update manifest.webmanifest → Task 9
  - Update index.html links → Task 8
  - Testing + validators → Tasks 10, 11, 12
  - Audit doc update → Task 13
- [x] **Placeholder scan:** cero "TBD", "TODO", "later", "por ahora", "MVP", "simplified", "future". Verificado.
- [x] **Type consistency:** `PATHS`, `TEAL`, `TEAL_DEEP`, `PAPER` definidos una sola vez en `paths.ts`, importados en cada helper. Signatures de helpers coherentes (`Promise<{ bytes: number }>` o `Promise<{ files: {...}[] }>`).
- [x] **Red words scan:** cero red words en tasks, code blocks, ni doc actualizada.
- [x] **Schema durability:** N/A (no DB).
- [x] **Zero patches:** Tasks 8-9 son edits chicos pero de archivos bien estructurados (index.html + manifest.webmanifest). No hay patches sobre código frágil.
- [x] **Multi-tenant:** N/A (single-tenant).
- [x] **Adapters boundary:** cada external dep (playwright, sharp, svgo, to-ico) accedida SOLO desde `scripts/lib/*.ts`. Orchestrator solo llama helpers.
- [x] **File sizes:** cada helper ≤ 100 LOC target. Orchestrator ≤ 80 LOC. Verificable post-implementation.
