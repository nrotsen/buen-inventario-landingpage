import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
import sharp from "sharp";
import { PATHS } from "./paths.ts";
import { PLAN_PRICE_ARS, TRIAL_DAYS, formatArs } from "../../src/lib/pricing.ts";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

export async function buildOgImage(): Promise<{ bytes: number }> {
  const svgSource = readFileSync(PATHS.sourceSvg, "utf8");
  const templateRaw = readFileSync(PATHS.ogTemplate, "utf8");
  const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(svgSource, "utf8").toString("base64")}`;
  const html = templateRaw
    .replace("__LOGO_DATA_URI__", logoDataUri)
    // El precio sale de `pricing.ts` — misma fuente que la card de Precio y
    // el JSON-LD, para que la OG image nunca quede desincronizada.
    .replace("__PRICE_LABEL__", `${formatArs(PLAN_PRICE_ARS)}/mes`)
    .replace("__TRIAL_LABEL__", `${TRIAL_DAYS} días gratis`);

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      viewport: { width: OG_WIDTH, height: OG_HEIGHT },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate("document.fonts.ready");
    const raw = await page.screenshot({ type: "png", omitBackground: false, clip: { x: 0, y: 0, width: OG_WIDTH, height: OG_HEIGHT } });
    await context.close();

    const optimized = await sharp(raw)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: "contain" })
      .png({ compressionLevel: 9 })
      .toBuffer();

    writeFileSync(PATHS.outOgImage, optimized);
    return { bytes: optimized.byteLength };
  } finally {
    await browser.close();
  }
}
