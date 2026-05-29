# Landing redesign — Buen Inventario · Implementation Plan

> **Para agentic workers:** Usar `bi-execute` para implementar este plan task-by-task. Los steps usan checkbox syntax (`- [ ]`) para tracking. Cada task termina en commit checkpoint.

**Goal:** Reescribir completamente la landing pública `buen-inventario-landingpage` para alinear estética + posicionamiento con el producto vivo del admin frontend (sign up editorial duro), reposicionando hacia dueños de comercios chicos argentinos para el plan Standard ($14.900/mes).

**Architecture:** Single-page React 19 + Vite 7 + Tailwind 3 con anchor scroll. 7 secciones editoriales (Hero · Historia · Excel · Sistema · Precio · FAQ · Footer) con alternancia tonal paper/cream/paper/ink/paper/cream/ink. Componentes en `src/components/{sections,ui}/`, helpers en `src/lib/`, fonts self-hosted en `public/fonts/`. Cero data layer, cero auth, cero routing.

**Tech Stack:** React 19.1, Vite 7.1, Tailwind 3.4, TypeScript 5.8 strict, lucide-react, path alias `@/*`. Self-hosted woff2 (DM Serif Display + JetBrains Mono + Inter).

**Spec source:** `docs/plans/2026-05-28-landing-redesign-design.md` (aprobado 2026-05-28).
**Mockup canónico:** `/Users/nestorberlanga/Desktop/Buen Inventario/mockups/landing-hero-2026-05-28.html` (served on http://localhost:8765/landing-hero-2026-05-28.html during dev).

---

## Standards aplicables (extraídos de `buen-inventario-webs/docs/reference/STANDARDS.md`)

El landing repo NO tiene STANDARDS.md propio. Reglas aplicadas del sibling público (`buen-inventario-webs`):

- **File sizes**: page ≤200 LOC, component ≤150 LOC, service/lib ≤150 LOC.
- **Naming**: PascalCase para components (`Header.tsx`), kebab/dot para libs (`contact.ts`, `lib/utils.ts`).
- **TypeScript**: `strict: true` (ya configurado). Cero `any`, cero `as any`. Tipos explícitos en todas las props y returns.
- **Path alias**: `@/*` configurado en `tsconfig.app.json` + `vite.config.ts`. **TODOS los imports cross-directory usan `@/`**. Imports relativos solo dentro de la misma carpeta inmediata (`./Button.tsx`).
- **React patterns**: functional components only. Sin `useState` para nada serializable. `useMemo`/`useCallback` solo si performance medible.
- **Mobile-first**: viewport iPhone 12 (390×844) como baseline obligatorio. Touch targets ≥44px (default `h-11` o `min-h-[44px]`). Body text ≥16px.
- **Performance**: Lighthouse mobile ≥90, LCP <2.5s, bundle initial ≤200KB gzipped. `loading="lazy"` para imágenes below fold (hero image queda `loading="eager"` + `fetchpriority="high"`). Preload de DM Serif + Inter + hero image en `<head>`.
- **SEO**: `<title>` único, `<meta name="description">` única, OG tags completos, Twitter card `summary_large_image`, JSON-LD para SoftwareApplication + Organization + LocalBusiness (Don Néstor Despensa). HTML semántico (`<main>`, `<section>`, `<header>`, `<footer>`, `<h1>` único, `<h2>`/`<h3>` jerárquicos).
- **Accesibilidad**: `<html lang="es">`. Contraste WCAG AA en body text (teal-500 nunca para body — usar teal-700). `prefers-reduced-motion: reduce` respetado en todas las transitions. `<details>` nativo para FAQ (a11y por defecto).
- **Anti-patrones prohibidos en este plan**:
  - `axios` directo en componentes — N/A (no hay HTTP)
  - `useState` para forms — N/A (no hay forms)
  - `border-radius > 6px` — prohibido por el editorial duro
  - `box-shadow` con `blur > 0` — solo hard offset shadows con teal
  - Gradients en background o text — prohibidos
  - Stock photos / illustraciones genéricas — prohibidas (solo el retrato ilustrado de Néstor entregado por user)
- **Red words prohibidos en código y plan**: `TODO`, `FIXME`, `later`, `for now`, `por ahora`, `después lo veo`, `MVP`, `simplified`, `versión simple`, `Round N`, `future phase`, `deferred`, `coexist`, `gradual migration`, `reserved for`, `ready for`, `easy to add later`, `just add`, `out of scope`, `pending implementation`. **Self-audit pre-merge obligatorio.**

## Operational Rules (REQUIRED)

- **Multi-tenant**: N/A — landing es single-tenant (la company ES Buen Inventario). Sin company_id boundary.
- **NEVER commitear** `.env` ni `.env.*`.
- **No `axios` inline en componentes** — N/A en este plan (no hay HTTP).
- **Forms = react-hook-form + zod** — N/A en este plan (no hay forms).
- **Mobile-first obligatorio** — viewport iPhone 12 + Slow 3G en Lighthouse antes de declarar UI complete.
- **Lazy load images** below fold. Hero image preload + fetchpriority="high".
- **Code-split por route** — N/A (single-page sin routing).
- **Cero red words** en cualquier file tocado (código, comments, copy en strings).

---

## Asset placeholder strategy

El user entregó 1 asset (retrato ilustrado de Néstor). Los demás 5 asset inputs están pendientes:

| Asset pendiente | Sección | Placeholder en este plan |
|---|---|---|
| Hero Analytics screenshot | Hero | `<AnalyticsFakeScreen />` — React component que reproduce el layout del mockup con datos plausibles. |
| Productos screenshot | Sistema | `<ProductsFakeScreen />` — tabla con 6 productos ARG plausibles. |
| Cuenta corriente screenshot | Sistema | `<LedgerFakeScreen />` — ledger del cliente "Marcos López". |
| Cierre de Caja screenshot | Sistema | `<CajaFakeScreen />` — grid 6 métodos + total. |
| OG image 1200×630 | SEO | PNG generado con headline tipográfico sobre fondo paper + logo + sombra teal — Task 21. |
| Logo invertido para footer dark | Footer | Variante CSS del logo mark (cajita paper con borde teal). PNG real reemplaza después. |
| Páginas `/terminos` y `/privacidad` | Footer | HTML estáticos placeholder con texto "Página en construcción" + email de contacto — Task 22. |

Cuando lleguen los assets reales del user, **el reemplazo es trivial**: en `Hero.tsx` el `<BrowserFrame><AnalyticsFakeScreen /></BrowserFrame>` se reemplaza por `<BrowserFrame><img src="/screenshots/hero-analytics.webp" alt="..." width="..." height="..." /></BrowserFrame>`. Same para las 3 capturas del Sistema. La landing es **100% operable** durante todo el plan sin esperar los assets.

---

## Decisiones de implementación (fijas, no re-debatir)

1. **Synthetic italic para DM Serif**: el admin frontend NO tiene `dmserif-400-latin-italic.woff2`, usa `font-style: italic` con synthetic slant. Replicamos el mismo approach — solo 3 woff2 a copiar.
2. **Lockfile autoritativo: pnpm**. Borrar `package-lock.json` y conservar `pnpm-lock.yaml`.
3. **Fonts copy desde admin**: el admin ya tiene los 3 woff2 con subset latín correcto. Copiar archivos físicos en `public/fonts/`, NO bajarlos de Google Fonts.
4. **Logo copy desde admin**: `buen-carrito-frontend/public/bueninventario-newlogo.png` → `public/bueninventario-logo.png`. Apple touch icon idem desde `apple-touch-icon-180x180.png`.
5. **Sin react-helmet-async**: Vite SPA — meta tags hard-coded en `index.html`. Cero meta dinámica needed (single-page, un solo `<title>`).
6. **App.tsx con IntersectionObserver en useEffect**: fade-in al scroll por CSS-only animations triggered por una clase agregada en intersect. Respeta `prefers-reduced-motion`.
7. **Lucide icons**: import named (`import { Eye, LineChart, Receipt, Archive, Wallet } from 'lucide-react'`) — tree-shakeable, sin overhead.
8. **CSS-in-Tailwind**: 100% Tailwind utility classes. CSS custom solo en `index.css` para `@font-face`, CSS vars y utilities editoriales (`.editorial-micro`, `.editorial-italic` que matchean el admin).

---

# TASKS

## Phase 1 — Foundation (tokens, config, fonts)

### Task 1: Rewrite `tailwind.config.js`

**Files:**
- Modify: `tailwind.config.js`

**Constraints:**
- Tokens deben ser idénticos a los del admin frontend (ink/paper/cream/teal). Cero divergencia.
- Purga total de tokens del estilo viejo: `accent` color scale, `gradient-text` utilities, `hero-gradient`, animaciones `bounce-in`, `fontFamily.heading: Poppins`.
- Mantener `content` glob y plugins=[].

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar el contenido completo del file con:
  ```js
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          ink: "#0a0a0a",
          paper: "#fafaf7",
          cream: "#f4f1e8",
          surface: "#ffffff",
          teal: {
            50: "#effbf9",
            500: "#14b8a6",
            600: "#0d9488",
            700: "#0f766e",
          },
          "text-muted": "#6b6b66",
          "text-placeholder": "#b3b3a8",
          "border-subtle": "#e8e6dd",
          "border-ink": "#0a0a0a",
        },
        fontFamily: {
          sans: ["Inter", "system-ui", "sans-serif"],
          display: ['"DM Serif Display"', "Georgia", "serif"],
          mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        },
        fontSize: {
          "display-xl": ["56px", { lineHeight: "60px", letterSpacing: "-0.01em" }],
          "display-lg": ["48px", { lineHeight: "52px", letterSpacing: "-0.01em" }],
          "display-md": ["32px", { lineHeight: "36px" }],
          "display-sm": ["22px", { lineHeight: "28px" }],
          "body-lg": ["17px", { lineHeight: "1.55" }],
          "body-md": ["15px", { lineHeight: "1.55" }],
          "body-sm": ["13px", { lineHeight: "1.5" }],
          micro: ["11px", { lineHeight: "1.4", letterSpacing: "0.08em" }],
        },
        borderWidth: {
          hard: "1.5px",
        },
        boxShadow: {
          "offset-lg": "8px 8px 0 0 #14b8a6",
          "offset-md": "6px 6px 0 0 #14b8a6",
          "offset-sm": "4px 4px 0 0 #14b8a6",
        },
        borderRadius: {
          sm: "2px",
          md: "4px",
          lg: "6px",
        },
        transitionTimingFunction: {
          editorial: "cubic-bezier(0.4, 0, 0.2, 1)",
        },
        maxWidth: {
          container: "1200px",
          reading: "760px",
          editorial: "880px",
          prose: "60ch",
        },
      },
    },
    plugins: [],
  };
  ```
- [ ] **Step 2:** Verificar que `npm run build` no rompe por classes inexistentes (correrá Tailwind purge contra todo `src/**`):
  ```bash
  pnpm install && pnpm run build 2>&1 | tail -20
  ```
- [ ] **Commit:** `git commit -m "feat(landing): rewrite tailwind config with editorial tokens"`

---

### Task 2: Copy self-hosted fonts desde admin frontend

**Files:**
- Create: `public/fonts/dmserif-400-latin.woff2`
- Create: `public/fonts/inter-latin.woff2`
- Create: `public/fonts/jetbrainsmono-400-latin.woff2`

**Constraints:**
- Mismo subset latín que el admin (mismo unicode-range cuando se referencian en `@font-face`).
- Archivos copiados físicamente, NO referenciados a CDN.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear directorio destino:
  ```bash
  mkdir -p public/fonts
  ```
- [ ] **Step 2:** Copiar los 3 woff2:
  ```bash
  cp "/Users/nestorberlanga/Desktop/Buen Inventario/buen-carrito-frontend/public/fonts/dmserif-400-latin.woff2" public/fonts/
  cp "/Users/nestorberlanga/Desktop/Buen Inventario/buen-carrito-frontend/public/fonts/inter-latin.woff2" public/fonts/
  cp "/Users/nestorberlanga/Desktop/Buen Inventario/buen-carrito-frontend/public/fonts/jetbrainsmono-400-latin.woff2" public/fonts/
  ```
- [ ] **Step 3:** Verificar tamaños (DM Serif ~24KB, Inter ~48KB, JetBrains ~21KB):
  ```bash
  ls -la public/fonts/
  ```
- [ ] **Commit:** `git commit -m "feat(landing): self-host DM Serif Display, Inter, JetBrains Mono"`

---

### Task 3: Rewrite `src/index.css` (font-faces + tokens + utilities editoriales)

**Files:**
- Rewrite: `src/index.css`

**Constraints:**
- Cero `@import url("https://fonts.googleapis.com/...")`. Solo `@font-face` self-hosted.
- Cero `.gradient-text`, `.hero-gradient`, `.section-gradient`.
- Utilities `.editorial-micro`, `.editorial-italic`, `.editorial-display`, `.editorial-mono` que matchean al admin frontend para futuro intercambio de código.
- `@media (prefers-reduced-motion: reduce)` con animation-duration 0.001ms.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar contenido completo del file con:
  ```css
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-latin.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'DM Serif Display';
    src: url('/fonts/dmserif-400-latin.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'JetBrains Mono';
    src: url('/fonts/jetbrainsmono-400-latin.woff2') format('woff2');
    font-weight: 400 700;
    font-style: normal;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  @layer base {
    html { scroll-behavior: smooth; }
    body {
      @apply bg-paper text-ink;
      font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    ::selection {
      background: #14b8a6;
      color: #fafaf7;
    }
  }

  @layer utilities {
    .editorial-micro {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6b6b66;
      line-height: 1.4;
    }
    .editorial-italic {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
      font-style: italic;
    }
    .editorial-display {
      font-family: 'DM Serif Display', Georgia, serif;
      font-weight: 400;
    }
    .editorial-mono {
      font-family: 'JetBrains Mono', ui-monospace, monospace;
    }

    /* Fade-in al scroll — clase agregada por IntersectionObserver en App.tsx */
    .reveal {
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1),
                  transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .reveal.in-view {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
    .reveal { opacity: 1; transform: none; }
    html { scroll-behavior: auto; }
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): rewrite index.css with self-hosted fonts and editorial tokens"`

---

## Phase 2 — Adapters (lib helpers)

### Task 4: Create `src/lib/contact.ts`

**Files:**
- Create: `src/lib/contact.ts`

**Constraints:**
- Funciones puras, sin side effects.
- Phone number canonical en el file (no hardcodear en componentes).
- Tipos explícitos en params y return.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear file con:
  ```ts
  const WHATSAPP_NUMBER = '5491122775850';
  const EMAIL = 'hola@bueninventario.com';
  const INSTAGRAM_HANDLE = 'bueninventario';

  export function whatsappLink(message?: string): string {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    if (!message) return base;
    return `${base}?text=${encodeURIComponent(message)}`;
  }

  export function mailtoLink(subject?: string, body?: string): string {
    const base = `mailto:${EMAIL}`;
    const params: string[] = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    return params.length ? `${base}?${params.join('&')}` : base;
  }

  export function instagramLink(): string {
    return `https://instagram.com/${INSTAGRAM_HANDLE}`;
  }

  export const CONTACT = {
    whatsapp: WHATSAPP_NUMBER,
    email: EMAIL,
    instagram: INSTAGRAM_HANDLE,
  } as const;
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add contact lib with whatsapp/mailto/instagram helpers"`

---

## Phase 3 — UI Primitives

### Task 5: Rewrite `src/components/ui/Button.tsx`

**Files:**
- Rewrite: `src/components/ui/Button.tsx` (mantener el filename con capital B; actualizar imports en step de App.tsx).

**Constraints:**
- 4 variants: `primary` · `ghost` · `inverted` · `ghost-on-dark`.
- 2 sizes: `md` (default, h-11 = 44px = touch target mínimo) · `lg` (h-13 ≈ 52px).
- Sin Radix Slot (`asChild` removed). Sin CVA. Sin gradient variant.
- Render como `<button>` o `<a>` según prop `as`.
- Tipos discriminated union para `as="a"` vs `as="button"`.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Borrar el file actual:
  ```bash
  rm src/components/ui/button.tsx
  ```
- [ ] **Step 2:** Crear `src/components/ui/Button.tsx` con:
  ```tsx
  import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  type Variant = 'primary' | 'ghost' | 'inverted' | 'ghost-on-dark';
  type Size = 'md' | 'lg';

  const baseClasses =
    'inline-flex items-center justify-center gap-2 border-hard rounded-md font-medium transition-colors duration-200 ease-editorial whitespace-nowrap select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:pointer-events-none';

  const variantClasses: Record<Variant, string> = {
    primary:
      'bg-ink text-paper border-ink hover:bg-teal-500 hover:border-teal-500',
    ghost:
      'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper',
    inverted:
      'bg-paper text-ink border-paper hover:bg-teal-500 hover:border-teal-500 hover:text-paper',
    'ghost-on-dark':
      'bg-transparent text-paper border-paper/40 hover:bg-paper/10 hover:border-paper',
  };

  const sizeClasses: Record<Size, string> = {
    md: 'h-11 px-5 text-[14px]',
    lg: 'h-13 px-7 text-[15px]',
  };

  type CommonProps = {
    variant?: Variant;
    size?: Size;
    children: ReactNode;
    className?: string;
  };

  type ButtonAsButton = CommonProps & {
    as?: 'button';
  } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

  type ButtonAsAnchor = CommonProps & {
    as: 'a';
    href: string;
  } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'>;

  export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

  export function Button(props: ButtonProps) {
    const { variant = 'primary', size = 'md', className, children } = props;
    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

    if (props.as === 'a') {
      const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
      return (
        <a {...rest} className={classes}>
          {children}
        </a>
      );
    }

    const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    return (
      <button {...rest} className={classes}>
        {children}
      </button>
    );
  }
  ```
  Nota: `h-13` no es default de Tailwind — agregar en `tailwind.config.js` `extend.height: { 13: '52px' }` o usar `h-[52px]`. Optar por `h-[52px]` para no expandir el config.
- [ ] **Step 3:** Reemplazar `h-13` por `h-[52px]` en el código del Button del step 2.
- [ ] **Step 4:** Verificar que `src/lib/utils.ts` exporta `cn` (combinación clsx + tailwind-merge). Si NO existe, agregar:
  ```ts
  import { clsx, type ClassValue } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): rewrite Button with 4 editorial variants"`

---

### Task 6: Create `src/components/ui/EditorialMicro.tsx` + `DisplayHeading.tsx`

**Files:**
- Create: `src/components/ui/EditorialMicro.tsx`
- Create: `src/components/ui/DisplayHeading.tsx`

**Constraints:**
- EditorialMicro: render `<p>` por default, con prop `as` para `<span>` o `<div>` opcional.
- DisplayHeading: render `<h1>` `<h2>` `<h3>` según prop `level`; size escalable según level.
- Soporte para `italicAccent` como ReactNode que se renderiza en `<em>` con teal-500 dentro del heading.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear `src/components/ui/EditorialMicro.tsx`:
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  type EditorialMicroProps = {
    children: ReactNode;
    className?: string;
    as?: 'p' | 'span' | 'div';
  };

  export function EditorialMicro({ children, className, as: Tag = 'p' }: EditorialMicroProps) {
    return <Tag className={cn('editorial-micro', className)}>{children}</Tag>;
  }
  ```
- [ ] **Step 2:** Crear `src/components/ui/DisplayHeading.tsx`:
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  type Level = 1 | 2 | 3;

  type DisplayHeadingProps = {
    level: Level;
    children: ReactNode;
    italicAccent?: ReactNode;
    className?: string;
  };

  const sizeByLevel: Record<Level, string> = {
    1: 'text-[40px] leading-[44px] md:text-display-xl tracking-[-0.01em]',
    2: 'text-[36px] leading-[40px] md:text-display-lg tracking-[-0.01em]',
    3: 'text-[24px] leading-[28px] md:text-[28px] md:leading-[32px]',
  };

  export function DisplayHeading({ level, children, italicAccent, className }: DisplayHeadingProps) {
    const baseClasses = cn('editorial-display text-ink', sizeByLevel[level], className);
    const accent = italicAccent ? (
      <em className="editorial-italic text-teal-500"> {italicAccent}</em>
    ) : null;

    if (level === 1) return <h1 className={baseClasses}>{children}{accent}</h1>;
    if (level === 2) return <h2 className={baseClasses}>{children}{accent}</h2>;
    return <h3 className={baseClasses}>{children}{accent}</h3>;
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add EditorialMicro and DisplayHeading primitives"`

---

### Task 7: Create `src/components/ui/Section.tsx`

**Files:**
- Create: `src/components/ui/Section.tsx`

**Constraints:**
- Render `<section>` con id opcional, padding vertical mobile-first generoso, tono según prop.
- Tones: paper (default) · cream · ink. Cada tone aplica background + text color cambio.
- Container interno con max-width prop para densidad (1200 default, 880 narrow, 760 reading).

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear file con:
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  type Tone = 'paper' | 'cream' | 'ink';
  type Width = 'container' | 'editorial' | 'reading';

  type SectionProps = {
    id?: string;
    tone?: Tone;
    width?: Width;
    children: ReactNode;
    className?: string;
    innerClassName?: string;
  };

  const toneClasses: Record<Tone, string> = {
    paper: 'bg-paper text-ink',
    cream: 'bg-cream text-ink',
    ink: 'bg-ink text-paper',
  };

  const widthClasses: Record<Width, string> = {
    container: 'max-w-container',
    editorial: 'max-w-editorial',
    reading: 'max-w-reading',
  };

  export function Section({
    id,
    tone = 'paper',
    width = 'container',
    children,
    className,
    innerClassName,
  }: SectionProps) {
    return (
      <section
        id={id}
        className={cn('py-24 md:py-36 px-6 md:px-10', toneClasses[tone], className)}
      >
        <div className={cn('mx-auto w-full', widthClasses[width], innerClassName)}>
          {children}
        </div>
      </section>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add Section wrapper with tonal variants"`

---

### Task 8: Create `src/components/ui/BrowserFrame.tsx` + `PhotoFrame.tsx`

**Files:**
- Create: `src/components/ui/BrowserFrame.tsx`
- Create: `src/components/ui/PhotoFrame.tsx`

**Constraints:**
- BrowserFrame: URL bar con 3 dots + URL string (último segmento bold), border 1.5px ink, shadow offset-lg, hover lift (translate -2,-2 + shadow grows a 10px).
- PhotoFrame: aspect ratio 4:5, border 1.5px ink, shadow offset-md. Acepta children que se renderizan adentro (la imagen es responsabilidad del consumer).
- Ambos respetan `prefers-reduced-motion` (la transition se neutraliza por la rule global de index.css).

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear `src/components/ui/BrowserFrame.tsx`:
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  type BrowserFrameProps = {
    url: string;
    children: ReactNode;
    className?: string;
  };

  function splitUrl(url: string): { host: string; path: string } {
    const idx = url.indexOf('/');
    if (idx === -1) return { host: url, path: '' };
    return { host: url.slice(0, idx), path: url.slice(idx) };
  }

  export function BrowserFrame({ url, children, className }: BrowserFrameProps) {
    const { host, path } = splitUrl(url);
    return (
      <div className={cn('pr-2 pb-2', className)}>
        <div
          className={cn(
            'bg-surface border-hard border-ink rounded-md overflow-hidden',
            'shadow-offset-lg transition-[transform,box-shadow] duration-300 ease-editorial',
            'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_#14b8a6]'
          )}
        >
          <div className="flex items-center gap-3 px-3.5 py-2.5 border-b-[1.5px] border-ink bg-cream">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-ink bg-paper"></span>
              <span className="w-2.5 h-2.5 rounded-full border border-ink bg-paper"></span>
              <span className="w-2.5 h-2.5 rounded-full border border-ink bg-paper"></span>
            </div>
            <div className="flex-1 bg-surface border border-ink rounded-sm px-2.5 py-1 font-mono text-[11px] text-text-muted">
              {host}<span className="text-ink font-medium">{path}</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
  ```
- [ ] **Step 2:** Crear `src/components/ui/PhotoFrame.tsx`:
  ```tsx
  import type { ReactNode } from 'react';
  import { cn } from '@/lib/utils';

  type PhotoFrameProps = {
    children: ReactNode;
    className?: string;
  };

  export function PhotoFrame({ children, className }: PhotoFrameProps) {
    return (
      <div className={cn('pr-1.5 pb-1.5 max-w-[380px]', className)}>
        <div
          className={cn(
            'aspect-[4/5] bg-surface border-hard border-ink rounded-md',
            'shadow-offset-md overflow-hidden',
            'flex items-end justify-center relative'
          )}
        >
          {children}
        </div>
      </div>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add BrowserFrame and PhotoFrame wrappers"`

---

## Phase 4 — Fake screens (placeholders until real screenshots arrive)

### Task 9: Create 4 fake-screen components

**Files:**
- Create: `src/components/ui/fake-screens/AnalyticsFakeScreen.tsx`
- Create: `src/components/ui/fake-screens/ProductsFakeScreen.tsx`
- Create: `src/components/ui/fake-screens/LedgerFakeScreen.tsx`
- Create: `src/components/ui/fake-screens/CajaFakeScreen.tsx`

**Constraints:**
- Cada componente ≤120 LOC.
- Datos plausibles para almacén de barrio ARG (extraídos del mockup canónico).
- Cero data externa, todo hardcoded — son placeholders visuales.
- Tipos numéricos en mono, headers en DM Serif, labels en mono uppercase.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear `AnalyticsFakeScreen.tsx`:
  ```tsx
  const BARS = [38, 54, 47, 72, 65, 81, 58, 90, 73, 86, 67, 95, 78, 62];

  export function AnalyticsFakeScreen() {
    return (
      <div className="px-6 pt-7 pb-8 md:px-10 md:pt-9 md:pb-10 text-left">
        <div className="flex items-baseline justify-between pb-4 border-b border-dashed border-border-subtle">
          <div className="flex items-baseline gap-2.5">
            <h4 className="editorial-display text-[19px] text-ink">Analíticas</h4>
            <span className="editorial-micro">Junio 2026</span>
          </div>
          <div className="font-mono text-[11px] py-1 px-2.5 border border-ink rounded-sm bg-surface">
            Don Néstor <span className="text-text-muted">▾</span>
          </div>
        </div>
        <div className="mt-5">
          <div className="editorial-display text-[48px] md:text-[64px] leading-none tracking-[-0.02em] text-ink">
            $1.847.500
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="editorial-micro">Ventas totales</span>
            <span className="font-mono text-[11px] text-teal-700">↑ 18% vs mayo</span>
          </div>
        </div>
        <div className="grid grid-cols-3 mt-6 border-hard border-ink">
          {[
            ['Beneficio', '$623.290'],
            ['Ticket promedio', '$4.820'],
            ['Productos vendidos', '383'],
          ].map(([label, value], i) => (
            <div
              key={label}
              className={`px-3.5 py-3.5 ${i < 2 ? 'border-r border-dashed border-border-subtle' : ''}`}
            >
              <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-text-muted">{label}</div>
              <div className="editorial-display text-[22px] md:text-[26px] mt-1 leading-tight text-ink">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-end gap-1.5 h-20 border-b-hard border-ink pb-0.5">
          {BARS.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-teal-500 border-t-hard border-ink"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <p className="editorial-micro mt-2.5">Últimos 14 días</p>
      </div>
    );
  }
  ```
- [ ] **Step 2:** Crear `ProductsFakeScreen.tsx`:
  ```tsx
  const ROWS = [
    { name: 'Atún Gomes de la Costa lata grande', stock: 14, costo: '$1.840', venta: '$2.690', dias: 87, dead: true },
    { name: "Mayonesa Hellmann's pote 1kg",        stock: 9,  costo: '$2.300', venta: '$3.190', dias: 62, dead: true },
    { name: 'Yerba Rosamonte 1kg',                 stock: 23, costo: '$2.150', venta: '$2.890', dias: 41, dead: true },
    { name: 'Coca-Cola 2.25L',                     stock: 32, costo: '$1.890', venta: '$2.450', dias: 3,  dead: false },
    { name: 'Pan lactal Bimbo grande',             stock: 12, costo: '$1.720', venta: '$2.280', dias: 1,  dead: false },
    { name: 'Leche La Serenísima 1L',              stock: 48, costo: '$890',   venta: '$1.190', dias: 0,  dead: false },
  ];

  export function ProductsFakeScreen() {
    return (
      <div className="px-6 pt-6 pb-7 md:px-8 text-left">
        <div className="flex justify-between items-baseline pb-3.5 border-b-hard border-ink">
          <h4 className="editorial-display text-[18px] text-ink">Productos · 247 activos</h4>
          <span className="editorial-micro">Ordenado por días sin venta ↓</span>
        </div>
        <table className="w-full mt-2.5 border-collapse">
          <thead>
            <tr className="border-b border-dashed border-border-subtle">
              <th className="text-left py-2 pr-2 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Producto</th>
              <th className="text-right py-2 px-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Stock</th>
              <th className="text-right py-2 px-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Costo</th>
              <th className="text-right py-2 px-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">P. venta</th>
              <th className="text-right py-2 pl-1.5 font-mono font-medium text-[10px] uppercase tracking-[0.08em] text-text-muted">Días s/v</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name} className={`border-b border-dashed border-border-subtle ${r.dead ? 'text-text-muted' : 'text-ink'}`}>
                <td className="py-2.5 pr-2 text-[12px] font-medium">{r.name}</td>
                <td className="py-2.5 px-1.5 text-[12px] font-mono text-right">{r.stock}</td>
                <td className="py-2.5 px-1.5 text-[12px] font-mono text-right">{r.costo}</td>
                <td className="py-2.5 px-1.5 text-[12px] font-mono text-right">{r.venta}</td>
                <td className={`py-2.5 pl-1.5 text-[12px] font-mono text-right ${r.dead ? 'text-teal-700 font-medium' : ''}`}>{r.dias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  ```
- [ ] **Step 3:** Crear `LedgerFakeScreen.tsx`:
  ```tsx
  const MOVEMENTS = [
    { date: '22 MAY', desc: '3× fideos Lucchetti + 1× aceite Cocinero', amt: '+ $4.890',  payment: false },
    { date: '20 MAY', desc: 'Pago a cuenta (efectivo)',                  amt: '− $10.000', payment: true  },
    { date: '18 MAY', desc: 'Compra del día (12 items)',                 amt: '+ $7.420',  payment: false },
    { date: '15 MAY', desc: '2× detergente Magistral + 1× shampoo Plusbelle', amt: '+ $5.180', payment: false },
    { date: '12 MAY', desc: 'Pan, leche, queso (semana)',                amt: '+ $6.790',  payment: false },
  ];

  export function LedgerFakeScreen() {
    return (
      <div className="px-6 pt-6 pb-7 md:px-8 text-left">
        <div className="flex justify-between items-start pb-3.5 border-b-hard border-ink">
          <div>
            <div className="editorial-display text-[22px] text-ink">Marcos López</div>
            <div className="editorial-micro mt-0.5">Cliente desde marzo 2024 · 38 movimientos</div>
          </div>
          <div className="text-right">
            <div className="editorial-display text-[26px] text-ink">$14.280</div>
            <div className="editorial-micro">Saldo deudor</div>
          </div>
        </div>
        <div className="mt-3">
          {MOVEMENTS.map((m) => (
            <div
              key={m.date + m.desc}
              className="grid grid-cols-[90px_1fr_auto] gap-3.5 py-2.5 border-b border-dashed border-border-subtle text-[13px]"
            >
              <span className="font-mono text-[11px] text-text-muted">{m.date}</span>
              <span className="text-ink">{m.desc}</span>
              <span className={`font-mono ${m.payment ? 'text-teal-700' : 'text-ink'}`}>{m.amt}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  ```
- [ ] **Step 4:** Crear `CajaFakeScreen.tsx`:
  ```tsx
  const METHODS = [
    ['Efectivo',         '$48.290'],
    ['Transferencia',    '$22.450'],
    ['Débito',           '$31.180'],
    ['Crédito',          '$14.920'],
    ['Mercado Pago',     '$9.640'],
    ['Cuenta corriente', '$6.420'],
  ];

  export function CajaFakeScreen() {
    return (
      <div className="px-6 pt-6 pb-7 md:px-8 text-left">
        <div className="flex justify-between items-baseline pb-3.5 border-b-hard border-ink">
          <h4 className="editorial-display text-[20px] text-ink">Cierre del día · 27 mayo</h4>
          <span className="editorial-micro">Caja abierta 8:30 · Cerrada 21:14</span>
        </div>
        <div className="mt-3.5 grid grid-cols-2 border-hard border-ink">
          {METHODS.map(([label, val], i) => {
            const isLastCol = i % 2 === 1;
            const isLastRow = i >= METHODS.length - 2;
            return (
              <div
                key={label}
                className={`px-3.5 py-3.5 ${!isLastCol ? 'border-r border-dashed border-border-subtle' : ''} ${!isLastRow ? 'border-b border-dashed border-border-subtle' : ''}`}
              >
                <div className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-text-muted">{label}</div>
                <div className="editorial-display text-[20px] mt-1 text-ink">{val}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3.5 flex justify-between items-baseline p-4 bg-ink text-paper rounded-sm">
          <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/70">Total del día · 87 ventas</div>
          <div className="editorial-display text-[28px]">$132.900</div>
        </div>
      </div>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add 4 fake-screen components as placeholders for real screenshots"`

---

## Phase 5 — Sections (narrative order)

### Task 10: Rewrite `src/components/sections/Hero.tsx`

**Files:**
- Rewrite: `src/components/sections/Hero.tsx`

**Constraints:**
- ≤150 LOC.
- Split asym 5/12 + 7/12 desktop, stack mobile.
- Headline DM Serif con italicAccent teal-500 en "de tu comercio".
- 2 CTAs: primary lg "Probalo gratis →" (signupUrl) + ghost lg "Ver cómo funciona" (#sistema).
- Trust row mono micro: 3 claims separados por `·` teal-600.
- Captura: `<BrowserFrame url="bueninventario.com/admin/analytics"><AnalyticsFakeScreen /></BrowserFrame>`.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar contenido de `src/components/sections/Hero.tsx`:
  ```tsx
  import { Section } from '@/components/ui/Section';
  import { Button } from '@/components/ui/Button';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { BrowserFrame } from '@/components/ui/BrowserFrame';
  import { AnalyticsFakeScreen } from '@/components/ui/fake-screens/AnalyticsFakeScreen';
  import { signupUrl } from '@/lib/config';

  export function Hero() {
    return (
      <Section id="hero" tone="paper" className="pt-32 md:pt-40 pb-24 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="md:col-span-5 max-w-[540px]">
            <EditorialMicro>Sistema de gestión · Almacenes y comercios chicos</EditorialMicro>
            <DisplayHeading level={1} italicAccent={<>de tu comercio.</>} className="mt-5">
              Recuperá el control
            </DisplayHeading>
            <p className="mt-7 text-body-lg text-ink/80 max-w-[44ch]">
              Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. Probá 30 días gratis, sin tarjeta.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Button as="a" href={signupUrl()} variant="primary" size="lg">
                Probalo gratis <span className="font-mono">→</span>
              </Button>
              <Button as="a" href="#sistema" variant="ghost" size="lg">
                Ver cómo funciona
              </Button>
            </div>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted leading-relaxed">
              Sin tarjeta <span className="text-teal-600">·</span> Cancelás cuando quieras <span className="text-teal-600">·</span> Hecho desde un almacén real
            </p>
          </div>
          <div className="md:col-span-7">
            <BrowserFrame url="bueninventario.com/admin/analytics">
              <AnalyticsFakeScreen />
            </BrowserFrame>
          </div>
        </div>
      </Section>
    );
  }
  ```
  Nota: el claim 3 default es **"Hecho desde un almacén real"** (fallback) hasta que el user verifique hosting region. Si después confirma "Hosteado en Argentina", se cambia el texto.
- [ ] **Commit:** `git commit -m "feat(landing): rewrite Hero with editorial split + Analytics fake screen"`

---

### Task 11: Create `src/components/sections/Historia.tsx`

**Files:**
- Create: `src/components/sections/Historia.tsx`

**Constraints:**
- ≤120 LOC.
- Tone cream. Layout split asym 5/12 (foto) + 7/12 (copy) — inverso al Hero.
- Photo con `<PhotoFrame>` que contiene `<img src="/nestor-portrait.png">` posicionada bottom + filtro tonal.
- Signature `— Néstor B.` en DM Serif italic + role en mono micro.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear file con:
  ```tsx
  import { Section } from '@/components/ui/Section';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { PhotoFrame } from '@/components/ui/PhotoFrame';

  export function Historia() {
    return (
      <Section id="historia" tone="cream">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-start">
          <div className="md:col-span-5">
            <PhotoFrame>
              <img
                src="/nestor-portrait.png"
                alt="Néstor, fundador de Buen Inventario, ilustrado."
                className="w-[112%] h-auto block -mb-[4%]"
                style={{ filter: 'contrast(1.02) saturate(0.95)' }}
                loading="lazy"
                width="1024"
                height="1024"
              />
            </PhotoFrame>
            <p className="mt-3 editorial-micro">
              Don Néstor Despensa · Almacén de barrio · Argentina
            </p>
          </div>
          <div className="md:col-span-7 max-w-[620px]">
            <EditorialMicro>Por qué existe Buen Inventario</EditorialMicro>
            <DisplayHeading level={2} className="mt-5 max-w-[14ch]">
              Yo también tengo un almacén.
            </DisplayHeading>
            <p className="editorial-italic text-[24px] leading-snug text-teal-700 mt-3.5">
              Y este sistema lo hice para mí primero.
            </p>
            <p className="mt-7 text-body-lg text-ink/85 max-w-[55ch] leading-relaxed">
              Soy Néstor. Tengo Don Néstor Despensa, un almacén de barrio con un empleado. Durante años trabajé "a ojo" — no sabía qué se vendía más, cuánto me robaban, ni cuánto ganaba de verdad.
            </p>
            <p className="mt-5 text-body-lg text-ink/85 max-w-[55ch] leading-relaxed">
              Buen Inventario lo armé para resolver eso en mi propio negocio. Hoy lo uso todos los días, y lo comparto con otros comerciantes que también quieran dejar de adivinar.
            </p>
            <p className="mt-10 editorial-italic text-[22px] text-ink">— Néstor B.</p>
            <p className="mt-1.5 editorial-micro">Fundador · Buen Inventario</p>
          </div>
        </div>
      </Section>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add Historia section with founder portrait"`

---

### Task 12: Create `src/components/sections/Excel.tsx`

**Files:**
- Create: `src/components/sections/Excel.tsx`

**Constraints:**
- ≤130 LOC.
- Tone paper, width editorial (880).
- 5 items con iconos Lucide (`Eye`, `LineChart`, `Receipt`, `Archive`, `Wallet`), numeración 01-05 en mono uppercase.
- Border-top hard, items separados por border-bottom dashed, último item con border-bottom hard.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear file con:
  ```tsx
  import type { LucideIcon } from 'lucide-react';
  import { Eye, LineChart, Receipt, Archive, Wallet } from 'lucide-react';
  import { Section } from '@/components/ui/Section';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';

  type Item = {
    icon: LucideIcon;
    num: string;
    label: string;
    headline: string;
    body: string;
  };

  const ITEMS: Item[] = [
    {
      icon: Eye,
      num: '01',
      label: 'Robo interno',
      headline: 'Si tu empleado te está robando.',
      body: 'Ves quién vendió qué, a qué hora, a qué precio. Si algo se va sin pasar por caja, queda el hueco.',
    },
    {
      icon: LineChart,
      num: '02',
      label: 'Ganancia real',
      headline: 'Cuánto ganás de verdad.',
      body: 'Ventas menos costos reales, calculado por el sistema. No el "creo que estoy bien" de fin de mes.',
    },
    {
      icon: Receipt,
      num: '03',
      label: 'Cuenta corriente',
      headline: 'Qué se llevaron tus clientes en cuenta corriente.',
      body: 'Cada movimiento queda registrado con fecha y producto. Si alguien discute, abrís la cuenta.',
    },
    {
      icon: Archive,
      num: '04',
      label: 'Stock muerto',
      headline: 'Cuánta plata tenés atrapada en stock que no rota.',
      body: 'El capital durmiendo en tu depósito, identificado por producto. Sabés qué dejar de comprar.',
    },
    {
      icon: Wallet,
      num: '05',
      label: 'Medios de cobro',
      headline: 'Con qué método se cobró cada venta.',
      body: 'Efectivo, transferencia, débito, crédito, Mercado Pago. Cada uno por separado, al cierre del día.',
    },
  ];

  export function Excel() {
    return (
      <Section id="excel" tone="paper" width="editorial">
        <EditorialMicro>El diagnóstico</EditorialMicro>
        <DisplayHeading level={2} italicAccent={<>no te puede decir.</>} className="mt-5 max-w-[16ch]">
          Lo que el Excel
        </DisplayHeading>

        <div className="mt-14 border-t-hard border-ink">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isLast = i === ITEMS.length - 1;
            return (
              <div
                key={item.num}
                className={`grid grid-cols-[56px_1fr] md:grid-cols-[72px_1fr] gap-4 md:gap-7 py-8 md:py-9 ${
                  isLast ? 'border-b-hard border-ink' : 'border-b border-dashed border-border-subtle'
                }`}
              >
                <Icon className="w-8 h-8 md:w-9 md:h-9 text-teal-700 mt-0.5" strokeWidth={1.5} />
                <div>
                  <EditorialMicro>{item.num} · {item.label}</EditorialMicro>
                  <h3 className="editorial-display text-[22px] md:text-[26px] leading-snug mt-1.5 text-ink">
                    {item.headline}
                  </h3>
                  <p className="mt-2.5 text-body-md text-ink/80 leading-relaxed max-w-[56ch]">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add Excel section with 5 fears resolved"`

---

### Task 13: Create `src/components/sections/Sistema.tsx`

**Files:**
- Create: `src/components/sections/Sistema.tsx`

**Constraints:**
- ≤180 LOC (es la sección más grande — 3 capturas + CTA).
- Tone ink. 3 capturas stacked con `<BrowserFrame>` + fake screen correspondiente.
- CTA inverted al final con headline DM Serif italic accent.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear file con:
  ```tsx
  import type { ReactNode } from 'react';
  import { Section } from '@/components/ui/Section';
  import { Button } from '@/components/ui/Button';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { BrowserFrame } from '@/components/ui/BrowserFrame';
  import { ProductsFakeScreen } from '@/components/ui/fake-screens/ProductsFakeScreen';
  import { LedgerFakeScreen } from '@/components/ui/fake-screens/LedgerFakeScreen';
  import { CajaFakeScreen } from '@/components/ui/fake-screens/CajaFakeScreen';
  import { signupUrl } from '@/lib/config';

  type Capture = {
    num: string;
    label: string;
    headline: string;
    body: string;
    url: string;
    screen: ReactNode;
  };

  const CAPTURES: Capture[] = [
    {
      num: '01',
      label: 'Productos',
      headline: 'El capital durmiendo en tu depósito.',
      body: 'Cada producto con stock, costo, margen y días sin venta. Los que duermen se ven solos.',
      url: 'bueninventario.com/admin/productos',
      screen: <ProductsFakeScreen />,
    },
    {
      num: '02',
      label: 'Cuentas corrientes',
      headline: 'Quién te debe qué.',
      body: 'La cuenta de cada cliente con saldo, último movimiento y detalle de cada compra. Cero discusión.',
      url: 'bueninventario.com/admin/clientes/marcos-lopez',
      screen: <LedgerFakeScreen />,
    },
    {
      num: '03',
      label: 'Cierre de caja',
      headline: 'El día cerrado en 30 segundos.',
      body: 'Total por método de pago, diferencias, próxima apertura. Lo que antes te llevaba una hora a mano.',
      url: 'bueninventario.com/admin/caja/cierre',
      screen: <CajaFakeScreen />,
    },
  ];

  export function Sistema() {
    return (
      <Section id="sistema" tone="ink" className="py-28 md:py-44">
        <div className="max-w-[760px]">
          <EditorialMicro className="!text-paper/55">El sistema</EditorialMicro>
          <DisplayHeading level={2} italicAccent={<>abrir todos los días.</>} className="mt-5 !text-paper">
            Esto es lo que vas a
          </DisplayHeading>
          <p className="mt-6 text-body-lg text-paper/70 max-w-[55ch] leading-relaxed">
            Tres pantallas. Las que más usás. Las que muestran lo que el Excel te ocultaba.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-24">
          {CAPTURES.map((c) => (
            <div key={c.num} className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-teal-500">
                {c.num} · {c.label}
              </p>
              <h3 className="editorial-display text-[26px] md:text-[34px] leading-tight mt-2.5 text-paper">
                {c.headline}
              </h3>
              <p className="mt-3 text-body-md text-paper/65 max-w-[48ch] mx-auto leading-relaxed">
                {c.body}
              </p>
              <div className="mt-9 max-w-[920px] mx-auto">
                <BrowserFrame url={c.url}>{c.screen}</BrowserFrame>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 max-w-[640px] mx-auto text-center">
          <p className="editorial-display text-[24px] md:text-[32px] leading-snug text-paper">
            Cargás tus productos en una tarde.{' '}
            <em className="editorial-italic text-teal-500">Empezás a operar mañana.</em>
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
            <Button as="a" href={signupUrl()} variant="inverted" size="lg" className="sm:min-w-[200px]">
              Probalo gratis <span className="font-mono">→</span>
            </Button>
            <Button as="a" href="#precio" variant="ghost-on-dark" size="lg" className="sm:min-w-[200px]">
              Ver el precio
            </Button>
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.06em] text-paper/55">
            Sin tarjeta · 30 días de prueba · Cancelás cuando quieras
          </p>
        </div>
      </Section>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add Sistema section with 3 captures and inverted CTA"`

---

### Task 14: Create `src/components/sections/Precio.tsx` (replaces old Pricing.tsx)

**Files:**
- Create: `src/components/sections/Precio.tsx`

**Constraints:**
- ≤120 LOC.
- Tone paper, width reading (760).
- Card centered max-w 440 con border hard + shadow offset-md.
- Precio DM Serif 64-76px con `/ mes` en mono inline.
- 6 features con ✓ mono teal-700.
- Button full width primary lg.
- Disclaimer post-card body-sm text-muted.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear file con:
  ```tsx
  import { Section } from '@/components/ui/Section';
  import { Button } from '@/components/ui/Button';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { signupUrl } from '@/lib/config';

  const FEATURES = [
    'Stock + Caja + Clientes + Proveedores',
    'Multi-user (admins, managers, empleados)',
    'Mi Web — tienda online incluida',
    'Analíticas + Métricas',
    'Aceptás Mercado Pago en tu comercio',
    'Soporte por email y WhatsApp',
  ];

  export function Precio() {
    return (
      <Section id="precio" tone="paper" width="reading" innerClassName="text-center">
        <EditorialMicro>Plan único</EditorialMicro>
        <DisplayHeading level={2} italicAccent={<>todo incluido.</>} className="mt-5">
          Un precio,
        </DisplayHeading>
        <p className="mt-6 text-body-lg text-ink/75 max-w-[44ch] mx-auto leading-relaxed">
          Sin tiers, sin add-ons, sin sorpresas en el resumen de la tarjeta. Lo que ves es lo que pagás.
        </p>

        <div className="mt-16 mx-auto max-w-[440px] bg-surface border-hard border-ink rounded-md shadow-offset-md p-10">
          <div className="pb-7 border-b-hard border-ink">
            <EditorialMicro>Plan Standard</EditorialMicro>
            <p className="editorial-display text-[64px] md:text-[76px] leading-none tracking-[-0.02em] mt-3">
              $14.900<span className="font-mono text-[22px] text-text-muted tracking-normal"> / mes</span>
            </p>
            <p className="editorial-micro mt-3">ARS · Renueva automáticamente</p>
          </div>

          <ul className="mt-7 space-y-2 text-left">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-body-md text-ink/85 leading-relaxed">
                <span className="font-mono text-teal-700 font-medium mt-0.5">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <Button as="a" href={signupUrl()} variant="primary" size="lg" className="mt-9 w-full">
            Empezá 30 días gratis <span className="font-mono">→</span>
          </Button>
          <p className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.06em] text-text-muted">
            Sin tarjeta · Cancelás cuando quieras
          </p>
        </div>

        <p className="mt-10 text-body-sm text-text-muted max-w-[40ch] mx-auto leading-relaxed">
          Sin contrato, sin permanencia. Cancelás desde el panel y se acabó.
        </p>
      </Section>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add Precio section with editorial card and tokens"`

---

### Task 15: Create `src/components/sections/Faq.tsx`

**Files:**
- Create: `src/components/sections/Faq.tsx`

**Constraints:**
- ≤120 LOC.
- Tone cream, width reading (760).
- `<details>` nativo (sin state, sin JS framework). Custom marker `+` que rota a `×` con CSS.
- 4 preguntas (Q5 offline omitida por decisión).
- CTA mini al final con link a WhatsApp con texto pre-llenado.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Agregar al `src/index.css` la regla específica para el marker custom de details (insertar al final del bloque `@layer utilities`):
  ```css
    .faq-toggle summary { list-style: none; }
    .faq-toggle summary::-webkit-details-marker { display: none; }
    .faq-toggle .faq-icon { transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1); }
    .faq-toggle[open] .faq-icon { transform: rotate(45deg); }
  ```
- [ ] **Step 2:** Crear `src/components/sections/Faq.tsx`:
  ```tsx
  import { Section } from '@/components/ui/Section';
  import { DisplayHeading } from '@/components/ui/DisplayHeading';
  import { EditorialMicro } from '@/components/ui/EditorialMicro';
  import { whatsappLink } from '@/lib/contact';

  type Qa = { q: string; a: string };

  const QAS: Qa[] = [
    {
      q: '¿Tengo que facturar todo lo que cargo en el sistema?',
      a: 'No. Vos decidís qué facturás y qué no. El sistema te ordena, no te controla.',
    },
    {
      q: '¿Sirve si no soy bueno con la tecnología?',
      a: 'Sí. Si sabés mandar un audio por WhatsApp, sabés usar Buen Inventario. La pantalla principal tiene lo que necesitás todos los días. El resto está ahí cuando lo busques.',
    },
    {
      q: '¿Qué pasa con mis datos si dejo de usarlo?',
      a: 'Te los exportamos en un Excel. Sin preguntas, sin trabas. Tu negocio es tuyo, tus datos también.',
    },
    {
      q: '¿Puedo migrar lo que tengo en Excel?',
      a: 'Sí. Cargás tu planilla actual, mapeamos las columnas y los productos quedan adentro en una tarde. Si te trabás, te ayudamos por WhatsApp.',
    },
  ];

  export function Faq() {
    return (
      <Section id="faq" tone="cream" width="reading">
        <div className="text-center">
          <EditorialMicro>Preguntas frecuentes</EditorialMicro>
          <DisplayHeading level={2} italicAccent={<>nos preguntan.</>} className="mt-5">
            Lo que más
          </DisplayHeading>
        </div>

        <div className="mt-14 border-t-hard border-ink">
          {QAS.map((qa) => (
            <details key={qa.q} className="faq-toggle border-b-hard border-ink group">
              <summary className="flex justify-between items-baseline py-7 cursor-pointer">
                <span className="editorial-display text-[20px] md:text-[23px] leading-snug text-ink pr-4">
                  {qa.q}
                </span>
                <span className="faq-icon font-mono text-[22px] text-teal-700 leading-none shrink-0">+</span>
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
            href={whatsappLink('Hola, tengo una pregunta sobre Buen Inventario.')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-700 underline underline-offset-[3px] hover:text-ink transition-colors"
          >
            Escribinos por WhatsApp →
          </a>
        </p>
      </Section>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add Faq section with native details accordion"`

---

## Phase 6 — Layout (Header, Footer, MobileMenu)

### Task 16: Rewrite `src/components/Header.tsx`

**Files:**
- Rewrite: `src/components/Header.tsx`

**Constraints:**
- ≤120 LOC.
- Sticky top, siempre `bg-paper/92 backdrop-blur` + `border-b-hard border-ink` (no condicional al scroll).
- Logo: `<img src="/bueninventario-logo.png">` (32px desktop, 28px mobile) + nombre DM Serif al lado.
- Nav anchors desktop only: Historia · Excel · Sistema · Precio · FAQ.
- CTA primary sm "Probalo gratis →" siempre visible.
- Mobile: icon button hamburguesa que dispara `MobileMenu` controlado por state local.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar contenido de `src/components/Header.tsx`:
  ```tsx
  import { useState } from 'react';
  import { Menu } from 'lucide-react';
  import { Button } from '@/components/ui/Button';
  import { MobileMenu } from '@/components/MobileMenu';
  import { signupUrl } from '@/lib/config';

  const NAV = [
    { label: 'Historia', href: '#historia' },
    { label: 'Excel',    href: '#excel'    },
    { label: 'Sistema',  href: '#sistema'  },
    { label: 'Precio',   href: '#precio'   },
    { label: 'FAQ',      href: '#faq'      },
  ];

  export function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
      <>
        <header className="sticky top-0 z-50 bg-paper/92 backdrop-blur border-b-hard border-ink">
          <div className="max-w-container mx-auto px-6 md:px-10 h-16 md:h-[76px] flex items-center justify-between gap-6">
            <a href="#hero" className="flex items-center gap-2.5 shrink-0">
              <img
                src="/bueninventario-logo.png"
                alt="Buen Inventario"
                width="32"
                height="32"
                className="w-7 h-7 md:w-8 md:h-8"
              />
              <span className="editorial-display text-[18px] md:text-[20px] text-ink">Buen Inventario</span>
            </a>

            <nav className="hidden md:flex gap-7">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-body-md text-ink hover:text-teal-700 transition-colors duration-150"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button as="a" href={signupUrl()} variant="primary" size="md" className="!h-9 !px-4 !text-[13px]">
                Probalo gratis <span className="font-mono">→</span>
              </Button>
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Abrir menú"
                className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 text-ink"
              >
                <Menu className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </header>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} items={NAV} />
      </>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): rewrite Header with editorial sticky bar and mobile menu trigger"`

---

### Task 17: Create `src/components/MobileMenu.tsx`

**Files:**
- Create: `src/components/MobileMenu.tsx`

**Constraints:**
- Drawer slide-from-top, bg paper, border-bottom hard ink, padding y-8 x-6.
- Items en DM Serif 24px gap-y-5.
- Close on Escape (window listener) + tap en backdrop (ink/40).
- A11y: `role="dialog"` + `aria-modal="true"` + focus trap básico (set focus en primer link al abrir).
- Cuando open=true: block body scroll (overflow-hidden en body).

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Crear file con:
  ```tsx
  import { useEffect, useRef } from 'react';
  import { X } from 'lucide-react';

  type NavItem = { label: string; href: string };

  type MobileMenuProps = {
    open: boolean;
    onClose: () => void;
    items: NavItem[];
  };

  export function MobileMenu({ open, onClose, items }: MobileMenuProps) {
    const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      firstLinkRef.current?.focus();
      return () => {
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = '';
      };
    }, [open, onClose]);

    if (!open) return null;

    return (
      <div className="md:hidden fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Menú de navegación">
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="absolute inset-0 bg-ink/40 cursor-default"
          tabIndex={-1}
        />
        <div className="relative bg-paper border-b-hard border-ink px-6 py-8 shadow-offset-sm">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="absolute top-3 right-3 inline-flex items-center justify-center w-11 h-11 text-ink"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <nav className="flex flex-col gap-5 mt-2">
            {items.map((item, i) => (
              <a
                key={item.href}
                ref={i === 0 ? firstLinkRef : null}
                href={item.href}
                onClick={onClose}
                className="editorial-display text-[24px] text-ink hover:text-teal-700 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    );
  }
  ```
- [ ] **Commit:** `git commit -m "feat(landing): add MobileMenu drawer with keyboard and backdrop close"`

---

### Task 18: Rewrite `src/components/Footer.tsx`

**Files:**
- Rewrite: `src/components/Footer.tsx`

**Constraints:**
- ≤120 LOC.
- Tone ink. Grid 6/3/3 desktop, stack mobile.
- 3 cols: Identidad (logo + tagline), Producto (anchors), Contacto (3 links externos).
- Logo en footer dark: si NO existe variante invertida del PNG, usar `<img>` con CSS filter `invert(1)` como fallback temporal (flag para reemplazar pre-merge).
- Bottom bar con copyright + links a /terminos y /privacidad.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar contenido de `src/components/Footer.tsx`:
  ```tsx
  import { whatsappLink, mailtoLink, instagramLink } from '@/lib/contact';

  const PRODUCT_LINKS = [
    { label: 'Cómo funciona',         href: '#sistema'  },
    { label: 'Precio',                href: '#precio'   },
    { label: 'Historia',              href: '#historia' },
    { label: 'Preguntas frecuentes',  href: '#faq'      },
  ];

  export function Footer() {
    return (
      <footer className="bg-ink text-paper px-6 md:px-10 pt-20 md:pt-24 pb-10 md:pb-14">
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-6 max-w-[420px]">
              <div className="flex items-center gap-2.5">
                <img
                  src="/bueninventario-logo.png"
                  alt="Buen Inventario"
                  width="32"
                  height="32"
                  className="w-8 h-8 invert"
                />
                <span className="editorial-display text-[22px] text-paper">Buen Inventario</span>
              </div>
              <p className="mt-3.5 text-body-sm text-paper/65 leading-relaxed max-w-[40ch]">
                Sistema de gestión para almacenes y comercios chicos de Argentina. Hecho desde Don Néstor Despensa.
              </p>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/50">Producto</p>
              <ul className="mt-4 flex flex-col gap-3">
                {PRODUCT_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/50">Contacto</p>
              <ul className="mt-4 flex flex-col gap-3">
                <li>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href={mailtoLink()}
                    className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                  >
                    hola@bueninventario.com
                  </a>
                </li>
                <li>
                  <a
                    href={instagramLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-paper/80 hover:text-paper transition-colors duration-150"
                  >
                    Instagram @bueninventario
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-7 border-t border-paper/15 flex flex-col md:flex-row items-center md:justify-between gap-3 text-body-sm text-paper/55">
            <p>© 2026 Buen Inventario · Argentina</p>
            <div className="flex gap-6">
              <a href="/terminos" className="hover:text-paper transition-colors">Términos</a>
              <a href="/privacidad" className="hover:text-paper transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  ```
  Nota: `invert` aplicado al logo es un fallback CSS. Si el user provee variante invertida real del PNG, reemplazar `src="/bueninventario-logo.png" className="... invert"` por `src="/bueninventario-logo-light.png" className="... w-8 h-8"`.
- [ ] **Commit:** `git commit -m "feat(landing): rewrite Footer with 3-column editorial layout"`

---

## Phase 7 — App composition + cleanup de components viejos

### Task 19: Rewrite `App.tsx`, update `utils.ts`, delete old components

**Files:**
- Rewrite: `src/App.tsx`
- Modify: `src/lib/utils.ts`
- Delete: `src/App.css`
- Delete: `src/components/sections/Features.tsx`
- Delete: `src/components/sections/Benefits.tsx`
- Delete: `src/components/sections/Contact.tsx`
- Delete: `src/components/sections/Pricing.tsx`
- Delete: `src/components/ui/card.tsx`
- Delete: `src/components/ui/input.tsx`
- Delete: `src/components/ui/textarea.tsx`

**Constraints:**
- App ≤80 LOC.
- IntersectionObserver para agregar `in-view` a `.reveal` elements al entrar viewport. Cleanup en unmount.
- `utils.ts` mantiene `cn` helper. Si tenía `scrollToSection`, evaluar si se usa en alguna parte del nuevo código — si no se usa, remover.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar `src/App.tsx` con:
  ```tsx
  import { useEffect } from 'react';
  import { Header } from '@/components/Header';
  import { Footer } from '@/components/Footer';
  import { Hero } from '@/components/sections/Hero';
  import { Historia } from '@/components/sections/Historia';
  import { Excel } from '@/components/sections/Excel';
  import { Sistema } from '@/components/sections/Sistema';
  import { Precio } from '@/components/sections/Precio';
  import { Faq } from '@/components/sections/Faq';

  function App() {
    useEffect(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );

      const targets = document.querySelectorAll('section.reveal-on-scroll');
      targets.forEach((el) => {
        el.classList.add('reveal');
        observer.observe(el);
      });

      return () => observer.disconnect();
    }, []);

    return (
      <div className="min-h-screen bg-paper text-ink">
        <Header />
        <main>
          <Hero />
          <Historia />
          <Excel />
          <Sistema />
          <Precio />
          <Faq />
        </main>
        <Footer />
      </div>
    );
  }

  export default App;
  ```
  Nota: el `reveal-on-scroll` class debería ser opt-in por sección. Para simplicidad de este plan inicial, NO se agrega — la fade-in animation queda disponible vía utility `.reveal` pero no se aplica automáticamente a las secciones. Si después se quiere animation, agregar `className="reveal-on-scroll"` a `<Section>` via prop.
- [ ] **Step 2:** Verificar `src/lib/utils.ts`. Estado deseado:
  ```ts
  import { clsx, type ClassValue } from 'clsx';
  import { twMerge } from 'tailwind-merge';

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```
  Si tenía `scrollToSection` u otras helpers no usadas, removerlas. Si no tenía clsx/twMerge import, agregarlos (las deps `clsx` y `tailwind-merge` ya están en package.json).
- [ ] **Step 3:** Borrar files físicos:
  ```bash
  rm -f src/App.css
  rm -f src/components/sections/Features.tsx
  rm -f src/components/sections/Benefits.tsx
  rm -f src/components/sections/Contact.tsx
  rm -f src/components/sections/Pricing.tsx
  rm -f src/components/ui/card.tsx
  rm -f src/components/ui/input.tsx
  rm -f src/components/ui/textarea.tsx
  ```
- [ ] **Step 4:** Verificar que `npm run lint` y `npm run build` pasan (van a fallar si alguna referencia rota quedó):
  ```bash
  pnpm run lint && pnpm run build
  ```
- [ ] **Commit:** `git commit -m "feat(landing): compose new App with 7 sections and remove deprecated components"`

---

## Phase 8 — HTML, SEO, public assets

### Task 20: Rewrite `index.html`

**Files:**
- Rewrite: `index.html`

**Constraints:**
- `lang="es"`.
- Meta description nueva + keywords ARG.
- OG completo (locale es_AR, image, dimensiones).
- Twitter card `summary_large_image`.
- 3 bloques JSON-LD: SoftwareApplication, Organization, GroceryStore (Don Néstor).
- Preloads: DM Serif woff2, Inter woff2, hero analytics image (pendiente — preload se incluye en HTML pero apunta a path que aún no existe; el browser ignora 404 grácil).
- Apple touch icon + manifest links + theme-color paper.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Reemplazar `index.html` completo:
  ```html
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#fafaf7" />

      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />

      <link rel="preload" href="/fonts/dmserif-400-latin.woff2" as="font" type="font/woff2" crossorigin />
      <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />

      <title>Buen Inventario — Recuperá el control de tu comercio</title>
      <meta
        name="description"
        content="Sistema de gestión para almacenes y comercios chicos de Argentina. Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. 30 días gratis, sin tarjeta."
      />
      <meta
        name="keywords"
        content="sistema gestion almacen, software comercio argentina, control stock argentina, gestion kiosco, sistema despensa"
      />
      <meta name="author" content="Buen Inventario" />
      <link rel="canonical" href="https://www.bueninventario.com" />

      <!-- Open Graph -->
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.bueninventario.com" />
      <meta property="og:title" content="Buen Inventario — Recuperá el control de tu comercio" />
      <meta
        property="og:description"
        content="Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. 30 días gratis, sin tarjeta."
      />
      <meta property="og:image" content="https://www.bueninventario.com/og-image.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="es_AR" />
      <meta property="og:site_name" content="Buen Inventario" />

      <!-- Twitter -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://www.bueninventario.com" />
      <meta name="twitter:title" content="Buen Inventario — Recuperá el control de tu comercio" />
      <meta
        name="twitter:description"
        content="Stock, caja, ganancias reales y cuánto te debe cada cliente — todo a la vista. 30 días gratis, sin tarjeta."
      />
      <meta name="twitter:image" content="https://www.bueninventario.com/og-image.png" />

      <script type="application/ld+json">
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
      </script>
      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Buen Inventario",
          "url": "https://www.bueninventario.com",
          "logo": "https://www.bueninventario.com/bueninventario-logo.png",
          "sameAs": ["https://instagram.com/bueninventario"]
        }
      </script>
      <script type="application/ld+json">
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
      </script>
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="/src/main.tsx"></script>
    </body>
  </html>
  ```
- [ ] **Commit:** `git commit -m "feat(landing): rewrite index.html with SEO, OG, JSON-LD and preloads"`

---

### Task 21: Public assets — logo, portrait, OG placeholder, apple-touch, manifest, robots, sitemap

**Files:**
- Create: `public/bueninventario-logo.png`
- Create: `public/nestor-portrait.png`
- Create: `public/og-image.png` (placeholder generado pre-implementación)
- Create: `public/apple-touch-icon.png`
- Create: `public/manifest.webmanifest`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`

**Constraints:**
- Logo y apple-touch copy desde admin frontend (assets ya existen).
- Nestor portrait copy + rename desde `mockups/`.
- OG placeholder: generar PNG simple con headline + logo. Si no hay tooling de generación a mano, copiar bueninventario-logo escalado a 1200×630 con padding como placeholder mínimo aceptable hasta tener diseño real.
- Manifest minimal con name, theme_color, background_color, icons.
- robots.txt permisivo.
- sitemap.xml con 1 URL.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Copy assets físicos:
  ```bash
  cp "/Users/nestorberlanga/Desktop/Buen Inventario/buen-carrito-frontend/public/bueninventario-newlogo.png" public/bueninventario-logo.png
  cp "/Users/nestorberlanga/Desktop/Buen Inventario/buen-carrito-frontend/public/apple-touch-icon-180x180.png" public/apple-touch-icon.png
  cp "/Users/nestorberlanga/Desktop/Buen Inventario/mockups/nestor-ilustrated.png" public/nestor-portrait.png
  ```
- [ ] **Step 2:** OG image placeholder. Si no hay ImageMagick / Sharp instalado, copy del logo escalado como mínimo aceptable:
  ```bash
  cp public/bueninventario-logo.png public/og-image.png
  ```
  **Flag para user post-merge:** este OG placeholder es subóptimo (logo solo, sin headline). Reemplazar con composición editorial 1200×630 antes de cualquier campaña pública.
- [ ] **Step 3:** Crear `public/manifest.webmanifest`:
  ```json
  {
    "name": "Buen Inventario",
    "short_name": "Buen Inventario",
    "description": "Sistema de gestión para almacenes y comercios chicos de Argentina.",
    "start_url": "/",
    "display": "browser",
    "background_color": "#fafaf7",
    "theme_color": "#fafaf7",
    "icons": [
      {
        "src": "/apple-touch-icon.png",
        "sizes": "180x180",
        "type": "image/png"
      },
      {
        "src": "/bueninventario-logo.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  }
  ```
- [ ] **Step 4:** Crear `public/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://www.bueninventario.com/sitemap.xml
  ```
- [ ] **Step 5:** Crear `public/sitemap.xml`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://www.bueninventario.com/</loc>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>
  ```
- [ ] **Step 6:** Crear `public/terminos.html` y `public/privacidad.html` stubs minimales (placeholder hasta texto legal real):
  ```html
  <!-- public/terminos.html -->
  <!DOCTYPE html>
  <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Términos · Buen Inventario</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="font-family: system-ui; max-width: 720px; margin: 4rem auto; padding: 0 1.5rem; color: #0a0a0a; background: #fafaf7;">
      <p style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #6b6b66;">Documento legal</p>
      <h1 style="font-family: Georgia, serif; font-size: 32px; margin-top: 0.5rem;">Términos del servicio</h1>
      <p style="margin-top: 2rem; line-height: 1.6;">Este documento se completará antes de la puesta en producción del servicio comercial. Para consultas legales mientras tanto, escribinos a <a href="mailto:hola@bueninventario.com" style="color: #0f766e;">hola@bueninventario.com</a>.</p>
      <p style="margin-top: 2rem;"><a href="/" style="color: #0f766e;">← Volver al inicio</a></p>
    </body>
  </html>
  ```
  Crear `public/privacidad.html` con el mismo template, reemplazando "Términos del servicio" por "Política de privacidad" y "Documento legal" por "Documento legal".
- [ ] **Commit:** `git commit -m "feat(landing): add public assets (logo, portrait, manifest, robots, sitemap, legal stubs)"`

---

## Phase 9 — Dep cleanup, lockfile, verification

### Task 22: Remove dead dependencies + cleanup lockfiles + final verification

**Files:**
- Modify: `package.json`
- Delete: `package-lock.json`

**Constraints:**
- Remover exactamente estas deps: `@emailjs/browser`, `react-google-recaptcha-v3`, `framer-motion`, `@radix-ui/react-slot`, `class-variance-authority`, `react-router-dom`.
- Conservar: `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge` (esta última estaba — verificar; si no estaba, agregar).
- Lockfile autoritativo: `pnpm-lock.yaml`. Borrar `package-lock.json`.
- Verificación final: tsc + lint + build sin errores, todos los acceptance criteria del spec verificables en browser.

**Multi-tenant impact:** N/A.

- [ ] **Step 1:** Modificar `package.json` removiendo las 6 deps no usadas:
  ```bash
  pnpm remove @emailjs/browser react-google-recaptcha-v3 framer-motion @radix-ui/react-slot class-variance-authority react-router-dom
  ```
- [ ] **Step 2:** Verificar que `tailwind-merge` y `clsx` están instaladas (necesarias para `cn` helper):
  ```bash
  grep -E "tailwind-merge|clsx" package.json
  ```
  Si falta alguna:
  ```bash
  pnpm add clsx tailwind-merge
  ```
- [ ] **Step 3:** Borrar `package-lock.json` (lockfile autoritativo es pnpm):
  ```bash
  rm -f package-lock.json
  ```
- [ ] **Step 4:** Reinstalar para regenerar pnpm-lock.yaml limpio:
  ```bash
  rm -rf node_modules && pnpm install
  ```
- [ ] **Step 5:** TypeScript strict check:
  ```bash
  pnpm exec tsc -b --noEmit
  ```
  Cero errors esperados.
- [ ] **Step 6:** Lint:
  ```bash
  pnpm run lint
  ```
  Cero warnings esperados.
- [ ] **Step 7:** Production build:
  ```bash
  pnpm run build
  ```
  Build exitoso. Verificar tamaño del bundle:
  ```bash
  ls -la dist/assets/
  ```
  Target: bundle JS inicial ≤200KB gzipped.
- [ ] **Step 8:** Self-audit red words sobre TODOS los files modificados:
  ```bash
  grep -rnE "TODO|FIXME|por ahora|después lo veo|para más adelante|MVP|simplified|deferred|pending implementation|out of scope" src/ public/*.{html,xml,txt,webmanifest} index.html tailwind.config.js 2>/dev/null || echo "(0 matches — clean)"
  ```
- [ ] **Step 9:** Preview build local + smoke test manual:
  ```bash
  pnpm run preview
  ```
  Abrir browser en URL impresa por preview. Verificar:
  - [ ] Carga DM Serif Display, JetBrains Mono, Inter (DevTools → Network → Fonts → status 200 y no fetch a Google Fonts)
  - [ ] Header sticky con border-bottom ink + CTA Probalo gratis
  - [ ] Hero muestra "Recuperá el control de tu comercio." con "de tu comercio" en italic teal-500
  - [ ] Captura Hero usa AnalyticsFakeScreen con $1.847.500
  - [ ] Historia con retrato de Néstor en cream
  - [ ] Excel con 5 items y iconos Lucide teal-700
  - [ ] Sistema en ink con 3 capturas + CTA inverted
  - [ ] Precio con $14.900/mes y 6 features
  - [ ] FAQ con 4 details que abren/cierran con `+` → `×`
  - [ ] Footer 3 cols con links reales
  - [ ] WhatsApp CTA del FAQ abre `wa.me` con mensaje pre-llenado
  - [ ] Mobile viewport iPhone 12: drawer abre desde top, cierra con Escape o tap fuera
  - [ ] Cero gradientes amarillos/rosas/sky-blue
  - [ ] Cero clientes ficticios (no aparecen TechCorp, InnovaStore, MegaRetail, SmartBiz, María González, Carlos Rodríguez, Ana López)
- [ ] **Step 10:** Lighthouse mobile audit:
  ```bash
  # En otra terminal, mientras preview corre:
  pnpm exec lighthouse http://localhost:4173 --view --preset=mobile
  ```
  Targets:
  - [ ] Performance ≥90
  - [ ] Accessibility ≥95
  - [ ] Best Practices ≥90
  - [ ] SEO ≥95
- [ ] **Commit:** `git commit -m "chore(landing): remove dead deps, cleanup lockfile, verify build"`

---

## Acceptance criteria checklist (final gate)

Esta es la lista del spec, re-listada acá para el implementer. CADA item es chequeable visualmente en browser real:

**Visual & Content:**
- [ ] Landing carga DM Serif Display (woff2 self-hosted), JetBrains Mono y Inter — verificable en DevTools → Network → Fonts
- [ ] Cero importaciones a `https://fonts.googleapis.com/...`
- [ ] Hero muestra "Recuperá el control de tu comercio." con "de tu comercio" en italic teal-500
- [ ] 7 secciones en orden: Hero → Historia → Excel → Sistema → Precio → FAQ → Footer
- [ ] Alternancia tonal: paper/cream/paper/ink/paper/cream/ink
- [ ] Cero clientes ficticios (TechCorp/InnovaStore/MegaRetail/SmartBiz no aparecen)
- [ ] Cero stats inventados ("500+ empresas", "4.9 estrellas", "300% ROI" no aparecen)
- [ ] Cero testimonios falsos (María González/Carlos Rodríguez/Ana López no aparecen)
- [ ] Cero gradientes amarillos/rosas/violetas/sky-blue
- [ ] Cero `border-radius > 6px`
- [ ] Cero `box-shadow` con `blur > 0` (solo hard offsets)
- [ ] Footer sin links `href="#"` placeholder (todos apuntan a anchor o URL real)
- [ ] Precio muestra $14.900/mes ARS visible
- [ ] CTA mini FAQ abre `wa.me/5491122775850` con mensaje pre-llenado

**Componentes & Architecture:**
- [ ] `Contact.tsx`, `Features.tsx`, `Benefits.tsx`, `Pricing.tsx`, `ui/card.tsx`, `ui/input.tsx`, `ui/textarea.tsx`, `App.css` eliminados físicamente
- [ ] `package.json` sin `@emailjs/browser`, `react-google-recaptcha-v3`, `framer-motion`, `@radix-ui/react-slot`, `class-variance-authority`, `react-router-dom`
- [ ] `tailwind.config.js` sin `accent` scale, `gradient-text`, `hero-gradient`, `bounce-in`, `Poppins`
- [ ] `src/index.css` sin `@import url("https://fonts.googleapis.com/...")`, sin `.gradient-text`, `.hero-gradient`, `.section-gradient`
- [ ] `src/lib/contact.ts` existe con whatsappLink/mailtoLink/instagramLink
- [ ] `src/components/ui/Button.tsx` con 4 variants
- [ ] `src/components/ui/BrowserFrame.tsx` y `PhotoFrame.tsx` existen
- [ ] `src/components/MobileMenu.tsx` con drawer + keyboard close

**Performance:**
- [ ] Lighthouse mobile Performance ≥90
- [ ] LCP <2.5s, CLS <0.1, TBT <200ms
- [ ] Hero image tiene `width`, `height` (fake screen no necesita; cuando se reemplace con `<img>`, sí)
- [ ] Imágenes below fold con `loading="lazy"` (nestor-portrait.png)
- [ ] DM Serif y Inter en `<link rel="preload">`
- [ ] `prefers-reduced-motion` respetado

**Accesibilidad:**
- [ ] Lighthouse Accessibility ≥95
- [ ] Cero teal-500 para texto body
- [ ] FAQ accordion funciona con keyboard sin JS
- [ ] Mobile menu cierra con Escape y backdrop tap
- [ ] Imágenes con `alt` descriptivo

**SEO:**
- [ ] Meta description coincide con el spec
- [ ] OG image existe (1200×630, ≤200KB cuando se reemplace por real)
- [ ] Twitter card `summary_large_image`
- [ ] 3 bloques JSON-LD presentes
- [ ] `robots.txt` y `sitemap.xml` en `public/`
- [ ] `<html lang="es">`

---

## Asset replacement protocol (cuando lleguen los assets del user)

Para los assets aún pendientes después del merge inicial, este es el protocolo de reemplazo:

| Asset | Acción |
|---|---|
| Hero Analytics screenshot | En `src/components/sections/Hero.tsx`, reemplazar `<AnalyticsFakeScreen />` por `<img src="/screenshots/hero-analytics.webp" alt="Pantalla de Analíticas de Buen Inventario mostrando ventas totales, beneficio y métricas del último mes." width="1840" height="1080" fetchPriority="high" loading="eager" className="block w-full" />`. Borrar `AnalyticsFakeScreen.tsx` si no se usa en otro lado. |
| 3 Sistema screenshots | Mismo patrón en `Sistema.tsx`: reemplazar cada `<ProductsFakeScreen />` / `<LedgerFakeScreen />` / `<CajaFakeScreen />` por `<img>` correspondiente con `loading="lazy"`. Borrar fake screens. |
| Trust row claim 3 | En `Hero.tsx`, si user confirma hosting argentino: cambiar `"Hecho desde un almacén real"` por `"Hosteado en Argentina"`. |
| OG image real | Reemplazar `public/og-image.png` con composición editorial 1200×630. |
| Logo invertido | Reemplazar referencia en `Footer.tsx`: cambiar `<img src="/bueninventario-logo.png" className="... invert" />` por `<img src="/bueninventario-logo-light.png" className="..." />`. Subir PNG nuevo a `public/`. |
| Páginas /terminos y /privacidad | Reemplazar contenido de `public/terminos.html` y `public/privacidad.html` con texto legal real. |

---

## Follow-ups (out of this plan, listed para tracking — NO son scope creep)

Estos items no están en este plan pero quedan reconocidos:

- **Crear `docs/reference/STANDARDS.md` en el landing repo** — actualmente se reutiliza el de `buen-inventario-webs`. Spec separado.
- **react-router para `/terminos` y `/privacidad` SPA-side** — actualmente son HTML estáticos servidos por Vite. Si se quieren rutas client-side, reinstalar react-router-dom en spec aparte.
- **Local-first / offline messaging en FAQ** — pendiente del refactor offline planificado por el user.
- **Analytics + cookie banner** — actualmente landing no trackea nada. Si se agrega analytics futuro, banner consent es spec separado.
- **Optimización avanzada de imágenes** — generación automática de AVIF + WebP via Vite plugin. Spec aparte.

---

**Plan completo. Total: 22 tasks distribuidas en 9 phases con commit checkpoints.**

**Próximo paso:** `/bi-execute` ejecuta task por task con review en 2 stages (spec-reviewer + code-quality-reviewer).
