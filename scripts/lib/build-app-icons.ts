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
  return source.replace(new RegExp(`fill="${TEAL}"`, "gi"), `fill="${PAPER}"`);
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
