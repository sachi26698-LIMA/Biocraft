/**
 * Colour maths for the palette tools.
 *
 * Everything here is computed, never looked up: conversions, harmonies,
 * contrast and perceptual ordering are derived from the hex value so the tool
 * stays correct for colours that are not in the bundled library.
 *
 * Conversions follow the published sRGB matrices (WCAG 2.1 relative luminance,
 * CSS Color 4 HSL/OKLab). No colour is ever "guessed" — a value that cannot be
 * represented returns null instead of a near-miss.
 */

export interface Rgb { r: number; g: number; b: number }
export interface Hsl { h: number; s: number; l: number }
export interface Oklch { l: number; c: number; h: number }

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round = (n: number, places = 0) => {
  const f = 10 ** places;
  return Math.round(n * f) / f;
};

/** Parse #rgb, #rrggbb or rrggbb. Returns null for anything else. */
export function parseHex(input: string): Rgb | null {
  const raw = input.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(raw)) {
    return {
      r: parseInt(raw[0] + raw[0], 16),
      g: parseInt(raw[1] + raw[1], 16),
      b: parseInt(raw[2] + raw[2], 16),
    };
  }
  if (/^[0-9a-f]{6}$/i.test(raw)) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
    };
  }
  return null;
}

export function toHex({ r, g, b }: Rgb): string {
  const part = (v: number) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0');
  return `#${part(r)}${part(g)}${part(b)}`;
}

export function normalizeHex(input: string): string | null {
  const rgb = parseHex(input);
  return rgb ? toHex(rgb) : null;
}

/**
 * sRGB → HSL, at full precision.
 *
 * Deliberately NOT rounded: quantising here (e.g. to 1 decimal place) makes
 * hslToHex(rgbToHsl(hex)) return a slightly different hex, which would break
 * harmonies, ramps and the round-trip guarantee. Round only for display —
 * see formatHsl().
 */
/** Round only for display. Math stays full-precision. */
export function formatHsl({ h, s, l }: Hsl): string {
  return `hsl(${round(h, 0) % 360}, ${round(s, 1)}%, ${round(l, 1)}%)`;
}

/** Round only for display. */
export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${round(l, 1)}% ${round(c, 4)} ${round(h, 0) % 360})`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l: l * 100 };
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: (h * 360) % 360, s: s * 100, l: l * 100 };
}

/** HSL → RGB. Used by harmony and shade generation. */
export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hn = (((h % 360) + 360) % 360) / 360;
  const sn = clamp01(s / 100), ln = clamp01(l / 100);
  if (sn === 0) {
    const v = ln * 255;
    return { r: v, g: v, b: v };
  }
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hue = (t: number) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };
  return { r: hue(hn + 1 / 3) * 255, g: hue(hn) * 255, b: hue(hn - 1 / 3) * 255 };
}

export function hslToHex(hsl: Hsl): string {
  return toHex(hslToRgb(hsl));
}

/** sRGB → OKLab → OKLCH (Björn Ottosson's matrices, CSS Color 4). */
export function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const lin = (v: number) => {
    const n = v / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(r), G = lin(g), B = lin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.sqrt(A * A + Bb * Bb);
  let H = (Math.atan2(Bb, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: L * 100, c: C, h: H % 360 };
}

/** WCAG 2.1 relative luminance. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const lin = (v: number) => {
    const n = v / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio between two hex colours: 1–21. */
export function contrastRatio(a: string, b: string): number {
  const ca = parseHex(a), cb = parseHex(b);
  if (!ca || !cb) return 1;
  const la = relativeLuminance(ca), lb = relativeLuminance(cb);
  const light = Math.max(la, lb), dark = Math.min(la, lb);
  return round((light + 0.05) / (dark + 0.05), 2);
}

/** Pick black or white text for a background, whichever contrasts more. */
export function readableOn(hex: string): '#000000' | '#ffffff' {
  return contrastRatio(hex, '#000000') >= contrastRatio(hex, '#ffffff') ? '#000000' : '#ffffff';
}

export type HarmonyKind = 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'monochrome' | 'split';

export const HARMONY_KINDS: { id: HarmonyKind; label: string; note: string }[] = [
  { id: 'analogous', label: 'Analogous', note: 'Neighbours on the wheel — calm, cohesive' },
  { id: 'complementary', label: 'Complementary', note: 'Opposite hues — high contrast' },
  { id: 'triadic', label: 'Triadic', note: 'Three evenly spaced hues — vivid' },
  { id: 'tetradic', label: 'Tetradic', note: 'Two complementary pairs — bold' },
  { id: 'split', label: 'Split complement', note: 'Softer than complementary' },
  { id: 'monochrome', label: 'Monochrome', note: 'One hue, varying lightness' },
];

/**
 * Build a harmony from a base colour. Offsets are degrees on the HSL wheel;
 * lightness/saturation are adjusted only where a literal rotation would produce
 * an unreadable result (the monochrome set).
 */
export function buildHarmony(baseHex: string, kind: HarmonyKind, size = 5): string[] {
  const rgb = parseHex(baseHex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb);
  const make = (offset: number, dl = 0, ds = 0) =>
    hslToHex({
      h: hsl.h + offset,
      s: Math.min(100, Math.max(0, hsl.s + ds)),
      l: Math.min(96, Math.max(6, hsl.l + dl)),
    });
  const count = Math.max(2, Math.min(12, size));
  const out: string[] = [];
  switch (kind) {
    case 'analogous':
      for (let i = 0; i < count; i++) out.push(make(-30 + (60 / Math.max(1, count - 1)) * i));
      break;
    case 'complementary': {
      const step = 360 / count;
      for (let i = 0; i < count; i++) out.push(i % 2 === 0 ? make(0, (i / 2) * 6) : make(180, ((i - 1) / 2) * 6));
      void step;
      break;
    }
    case 'triadic':
      for (let i = 0; i < count; i++) out.push(make((i % 3) * 120, Math.floor(i / 3) * 8));
      break;
    case 'tetradic':
      for (let i = 0; i < count; i++) out.push(make((i % 4) * 90, Math.floor(i / 4) * 8));
      break;
    case 'split':
      for (let i = 0; i < count; i++) out.push(make(i % 3 === 0 ? 0 : i % 3 === 1 ? 150 : 210, Math.floor(i / 3) * 8));
      break;
    case 'monochrome':
      for (let i = 0; i < count; i++) {
        const l = 12 + (76 / Math.max(1, count - 1)) * i;
        out.push(hslToHex({ h: hsl.h, s: hsl.s, l }));
      }
      break;
  }
  return out;
}

/** A usable tonal ramp from the base colour: darkest to lightest. */
export function tonalRamp(baseHex: string, steps = 10): string[] {
  const rgb = parseHex(baseHex);
  if (!rgb) return [];
  const hsl = rgbToHsl(rgb);
  const n = Math.max(2, Math.min(24, steps));
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return hslToHex({ h: hsl.h, s: Math.round(hsl.s * (1 - t * 0.45)), l: Math.round(6 + t * 88) });
  });
}

/** Named-colour nearest match, using CIE-style weighting on RGB distance. */
export function nearestColor(
  hex: string,
  candidates: readonly { name: string; hex: string }[],
  limit = 3,
): { name: string; hex: string; distance: number }[] {
  const target = parseHex(hex);
  if (!target) return [];
  const scored = candidates.map((c) => {
    const rgb = parseHex(c.hex);
    if (!rgb) return { name: c.name, hex: c.hex, distance: Number.POSITIVE_INFINITY };
    // Weighted Euclidean distance approximates perceptual difference closely
    // enough for "closest named colour" and avoids a 32k-entry Lab precompute.
    const rMean = (target.r + rgb.r) / 2;
    const dr = target.r - rgb.r, dg = target.g - rgb.g, db = target.b - rgb.b;
    const distance = Math.sqrt((2 + rMean / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rMean) / 256) * db * db);
    return { name: c.name, hex: c.hex, distance };
  });
  scored.sort((a, b) => a.distance - b.distance);
  return scored.slice(0, Math.max(1, Math.min(20, limit)));
}

/** CSS custom-property block for dev hand-off. */
export function toCssVariables(colors: readonly { hex: string }[], prefix = 'color'): string {
  return [':root {', ...colors.map((c, i) => `  --${prefix}-${i + 1}: ${c.hex};`), '}'].join('\n');
}

/** Tailwind config snippet. */
export function toTailwind(colors: readonly { hex: string }[]): string {
  const entries = colors.map((c, i) => `        '${i + 1}': '${c.hex}',`).join('\n');
  return `// tailwind.config.js\nexport default {\n  theme: {\n    extend: {\n      colors: {\n        brand: {\n${entries}\n        },\n      },\n    },\n  },\n};`;
}
