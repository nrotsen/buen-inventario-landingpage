import { PLAN_PRICE_ARS } from "../../src/lib/pricing.ts";

const SITE = "https://www.bueninventario.com";

/**
 * JSON-LD del sitio. Vive acá y no en `index.html` para que el precio salga
 * de la misma constante que la card de precio — una sola verdad.
 *
 * Son dos bloques, no tres: el `GroceryStore` de Don Néstor que había en
 * `index.html` declaraba un comercio distinto del sitio como si fuera una
 * entidad del dominio, y confunde a los crawlers sobre qué es esta página.
 */
export function buildJsonLd(): string {
  const blocks = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Buen Inventario",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE,
      description:
        "Sistema de gestión para comercios de Argentina: ventas, stock, caja, cuentas corrientes y facturación electrónica.",
      offers: {
        "@type": "Offer",
        price: String(PLAN_PRICE_ARS),
        priceCurrency: "ARS",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Buen Inventario",
      url: SITE,
      logo: `${SITE}/icon-512.png`,
      areaServed: "AR",
    },
  ];

  return blocks
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join("\n    ");
}
