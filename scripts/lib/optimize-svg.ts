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
