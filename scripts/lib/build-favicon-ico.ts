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
