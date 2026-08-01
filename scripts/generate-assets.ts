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
