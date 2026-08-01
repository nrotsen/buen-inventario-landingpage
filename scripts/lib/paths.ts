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
