/**
 * Unicode styled-alphabet engine shared by the Stylish Name and Fancy Font
 * tools. Rule-based: pure mapping, no randomness, no network, no font files.
 *
 * Honesty notes baked into the API:
 *  - Unicode styled alphabets only exist for Latin (and digits).
 *    Devanagari passes through unchanged — there are no "decorative
 *    Devanagari" code blocks. hasDevanagari() lets the UI say so.
 *  - A handful of code points required manual overrides (classic exceptions
 *    of the Mathematical Alphanumeric Symbols block); they are listed here.
 *  - Rendering depends on the viewer's system fonts; unsupported glyphs fall
 *    back to boxes on very old systems. This is inherent to Unicode text
 *    styling and is noted in the UI.
 */

export const DEVANAGARI = /[\u0900-\u097F]/;

export function hasDevanagari(text: string): boolean {
  return DEVANAGARI.test(text);
}

type CharMap = Readonly<Record<string, string>>;

const range = (start: number): Map<string, string> => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const map = new Map<string, string>();
  for (let i = 0; i < upper.length; i += 1) {
    map.set(upper[i], String.fromCodePoint(start + i));
  }
  return map;
};

const buildMap = (
  upperStart: number | null,
  lowerStart: number | null,
  digitStart: number | null,
  exceptions: CharMap = {},
): CharMap => {
  const map: Record<string, string> = {};
  if (upperStart !== null) for (const [k, v] of range(upperStart)) map[k] = v;
  if (lowerStart !== null) {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < lower.length; i += 1) {
      map[lower[i]] = String.fromCodePoint(lowerStart + i);
    }
  }
  if (digitStart !== null) {
    const digits = '0123456789';
    for (let i = 0; i < digits.length; i += 1) {
      map[digits[i]] = String.fromCodePoint(digitStart + i);
    }
  }
  return { ...map, ...exceptions };
};

const applyMap = (map: CharMap) => (text: string): string =>
  Array.from(text)
    .map((char) => map[char] ?? char)
    .join('');

/* ---------- script-family exception tables (block oddities) ---------- */

const SCRIPT_UPPER: CharMap = {
  B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
};
const SCRIPT_LOWER: CharMap = { e: 'ℯ', g: 'ℊ', o: 'ℴ' };
const FRAKTUR_UPPER: CharMap = {
  C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ',
};
const DOUBLE_UPPER: CharMap = {
  C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ',
};

/* ---------- explicit tables that are not simple ranges ---------- */

const SMALL_CAPS_LOWER = 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ'.split('');
const SMALL_CAPS: CharMap = Object.fromEntries(
  'abcdefghijklmnopqrstuvwxyz'.split('').map((c, i) => [c, SMALL_CAPS_LOWER[i]]),
);

const CIRCLED: CharMap = (() => {
  const map: Record<string, string> = {};
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < upper.length; i += 1) {
    map[upper[i]] = String.fromCodePoint(0x24b6 + i);
    map[lower[i]] = String.fromCodePoint(0x24d0 + i);
  }
  for (let d = 1; d <= 9; d += 1) map[String(d)] = String.fromCodePoint(0x2460 + d - 1);
  map['0'] = '⓪';
  return map;
})();

const SQUARED_UPPER: CharMap = (() => {
  const map: Record<string, string> = {};
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < upper.length; i += 1) {
    map[upper[i]] = String.fromCodePoint(0x1f130 + i);
    map[lower[i]] = String.fromCodePoint(0x1f130 + i);
  }
  return map;
})();

const UPSIDE_DOWN_BASE: Record<string, string> = {
  '!': '¡', "'": ',', '(': ')', ')': '(', '<': '>', '>': '<',
  '[': ']', ']': '[', '{': '}', '}': '{', '&': '⅋', '?': '¿',
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ',
  i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd',
  q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x',
  y: 'ʎ', z: 'z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
  '5': 'ϛ', '6': '9', '7': 'L', '8': '8', '9': '6',
};
const UPSIDE_DOWN: CharMap = Object.fromEntries(
  Object.entries(UPSIDE_DOWN_BASE).flatMap(([char, flipped]) => [
    [char, flipped],
    [char.toUpperCase(), flipped],
  ]),
);
const upsideDown = (text: string): string =>
  Array.from(text.toLowerCase())
    .map((char) => UPSIDE_DOWN[char] ?? char)
    .reverse()
    .join('');


const PARENTHESIZED: CharMap = (() => {
  const map: Record<string, string> = {};
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 26; i += 1) {
    map[upper[i]] = String.fromCodePoint(0x1f110 + i);
    map[lower[i]] = String.fromCodePoint(0x249c + i);
  }
  for (let d = 1; d <= 9; d += 1) map[String(d)] = String.fromCodePoint(0x2474 + d - 1);
  map['0'] = '⒆';
  return map;
})();

const NEGATIVE_CIRCLED: CharMap = (() => {
  const map: Record<string, string> = {};
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 26; i += 1) {
    map[upper[i]] = String.fromCodePoint(0x1f150 + i);
    map[lower[i]] = String.fromCodePoint(0x1f150 + i); // no lowercase glyph — mirror uppercase (same as Squared)
  }
  return map;
})();

const NEGATIVE_SQUARED: CharMap = (() => {
  const map: Record<string, string> = {};
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 26; i += 1) {
    map[upper[i]] = String.fromCodePoint(0x1f170 + i);
    map[lower[i]] = String.fromCodePoint(0x1f170 + i); // no lowercase glyph — mirror uppercase
  }
  return map;
})();

const SUBSCRIPT: CharMap = (() => {
  const map: Record<string, string> = {
    a: 'ₐ', e: 'ₑ', o: 'ₒ', x: 'ₓ', h: 'ₕ', k: 'ₖ', l: 'ₗ', m: 'ₘ',
    n: 'ₙ', p: 'ₚ', s: 'ₛ', t: 'ₜ', i: 'ᵢ', r: 'ᵣ', u: 'ᵤ', v: 'ᵥ', j: 'ⱼ',
  };
  for (let d = 0; d <= 9; d += 1) map[String(d)] = String.fromCodePoint(0x2080 + d);
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (const ch of upper) map[ch] = map[ch.toLowerCase()] ?? ch; // mirror available lowercase glyphs
  return map;
})();


const SUPERSCRIPT: CharMap = (() => {
  const map: Record<string, string> = {
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', 'n': 'ⁿ',
  };
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const glyphs: Record<string, string> = {
    A: 'ᴬ', B: 'ᴮ', C: 'ᶜ', D: 'ᴰ', E: 'ᴱ', F: 'ᶠ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ',
    J: 'ᴶ', K: 'ᴷ', L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', Q: 'Q', R: 'ᴿ',
    S: 'ˢ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ', X: 'ˣ', Y: 'ʸ', Z: 'ᶻ',
  };
  for (const ch of upper) map[ch] = glyphs[ch];
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const lowerGlyphs: Record<string, string> = {
    a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
    j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', q: '𐞥', r: 'ʳ',
    s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  };
  for (const ch of lower) map[ch] = lowerGlyphs[ch];
  const digitMap: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  };
  return { ...map, ...digitMap };
})();

const HAIR_SPACE = '\u200A';

/** Fullwidth look with hair spaces between Latin graphemes only. */
const aesthetic = (text: string): string => {
  const fullwidthMap = buildMap(0xff21, 0xff41, 0xff10);
  const clusters = graphemes(text);
  const parts: string[] = [];
  for (let i = 0; i < clusters.length; i += 1) {
    const cluster = clusters[i];
    const isLatin = /^[A-Za-z0-9.,!?'’\-–&@#%]/.test(cluster);
    const mapped = fullwidthMap[cluster] ?? cluster;
    parts.push(mapped);
    const next = clusters[i + 1];
    const nextLatin = next !== undefined && /^[A-Za-z0-9]/.test(next);
    if (isLatin && nextLatin) parts.push(HAIR_SPACE);
  }
  return parts.join('');
};

const COMBINING_OVERLINE = '\u0305';
const COMBINING_LOW_LINE_DECOR = '\u0332';
const COMBINING_STRIKE = '\u0336';
const COMBINING_DOUBLE_LOW_LINE = '\u0333';
const COMBINING_TILDE_OVERLAY = '\u0334';
const COMBINING_LONG_SOLIDUS = '\u0338';
/**
 * Appends a combining mark to every grapheme cluster — not every code point —
 * so Indic vowel signs and ZWJ conjuncts stay attached to their base glyph
 * instead of being split apart. Falls back to code points where Intl.Segmenter
 * is unavailable.
 */
type SegmenterConstructor = new (
  locales?: string | string[],
  options?: { granularity: 'grapheme' },
) => { segment: (text: string) => Iterable<{ segment: string }> };

const SegmenterClass: SegmenterConstructor | undefined = (
  Intl as unknown as { Segmenter?: SegmenterConstructor }
).Segmenter;

const graphemes: (text: string) => string[] = SegmenterClass
  ? (text) => Array.from(new SegmenterClass('en', { granularity: 'grapheme' }).segment(text), (part) => part.segment)
  : (text) => Array.from(text);

const withCombining = (mark: string) => (text: string): string =>
  graphemes(text)
    .map((cluster) => cluster + mark)
    .join('');

export interface UnicodeStyle {
  id: string;
  label: string;
  transform: (text: string) => string;
}

export const UNICODE_STYLES: readonly UnicodeStyle[] = [
  { id: 'bold', label: 'Bold', transform: applyMap(buildMap(0x1d400, 0x1d41a, 0x1d7ce)) },
  { id: 'italic', label: 'Italic', transform: applyMap(buildMap(0x1d434, 0x1d44e, null, { h: 'ℎ' })) },
  { id: 'bold-italic', label: 'Bold Italic', transform: applyMap(buildMap(0x1d468, 0x1d482, null)) },
  { id: 'script', label: 'Script', transform: applyMap(buildMap(0x1d49c, 0x1d4b6, null, { ...SCRIPT_UPPER, ...SCRIPT_LOWER })) },
  { id: 'bold-script', label: 'Bold Script', transform: applyMap(buildMap(0x1d4d0, 0x1d4ea, null)) },
  { id: 'fraktur', label: 'Fraktur', transform: applyMap(buildMap(0x1d504, 0x1d51e, null, FRAKTUR_UPPER)) },
  { id: 'bold-fraktur', label: 'Bold Fraktur', transform: applyMap(buildMap(0x1d56c, 0x1d586, null)) },
  { id: 'double-struck', label: 'Double Struck', transform: applyMap(buildMap(0x1d538, 0x1d552, 0x1d7d8, DOUBLE_UPPER)) },
  { id: 'sans', label: 'Sans Serif', transform: applyMap(buildMap(0x1d5a0, 0x1d5ba, 0x1d7e2)) },
  { id: 'sans-bold', label: 'Sans Bold', transform: applyMap(buildMap(0x1d5d4, 0x1d5ee, 0x1d7ec)) },
  { id: 'sans-italic', label: 'Sans Italic', transform: applyMap(buildMap(0x1d608, 0x1d622, null)) },
  { id: 'sans-bold-italic', label: 'Sans Bold Italic', transform: applyMap(buildMap(0x1d63c, 0x1d656, null)) },
  { id: 'monospace', label: 'Monospace', transform: applyMap(buildMap(0x1d670, 0x1d68a, 0x1d7f6)) },
  { id: 'fullwidth', label: 'Fullwidth', transform: applyMap(buildMap(0xff21, 0xff41, 0xff10)) },
  { id: 'small-caps', label: 'Small Caps', transform: applyMap(SMALL_CAPS) },
  { id: 'circled', label: 'Circled', transform: applyMap(CIRCLED) },
  { id: 'squared', label: 'Squared', transform: applyMap(SQUARED_UPPER) },
  { id: 'parenthesized', label: 'Parenthesized', transform: applyMap(PARENTHESIZED) },
  { id: 'negative-circled', label: 'Negative Circled', transform: applyMap(NEGATIVE_CIRCLED) },
  { id: 'negative-squared', label: 'Negative Squared', transform: applyMap(NEGATIVE_SQUARED) },
  { id: 'subscript', label: 'Subscript', transform: applyMap(SUBSCRIPT) },
  { id: 'underline', label: 'Underline', transform: withCombining(COMBINING_LOW_LINE_DECOR) },
  { id: 'strikethrough', label: 'Strikethrough', transform: withCombining(COMBINING_STRIKE) },
  { id: 'upside-down', label: 'Upside Down', transform: upsideDown },
  { id: 'cursive', label: 'Cursive', transform: applyMap(buildMap(0x1d49c, 0x1d4b6, null, { ...SCRIPT_UPPER, ...SCRIPT_LOWER })) },
  { id: 'bubble', label: 'Bubble', transform: applyMap(NEGATIVE_CIRCLED) },
  { id: 'superscript', label: 'Superscript', transform: applyMap(SUPERSCRIPT) },
  { id: 'aesthetic', label: 'Aesthetic', transform: aesthetic },
  { id: 'decorative', label: 'Decorative', transform: withCombining(COMBINING_OVERLINE + COMBINING_LOW_LINE_DECOR) },
  { id: 'overline', label: 'Overline', transform: withCombining(COMBINING_OVERLINE) },
  { id: 'double-underline', label: 'Double Underline', transform: withCombining(COMBINING_DOUBLE_LOW_LINE) },
  { id: 'tilde-strike', label: 'Tilde Strike', transform: withCombining(COMBINING_TILDE_OVERLAY) },
  { id: 'slash-through', label: 'Slash Through', transform: withCombining(COMBINING_LONG_SOLIDUS) },
];

/** Applies one style by id; unknown ids return the input unchanged. */
export function applyStyle(text: string, styleId: string): string {
  const style = UNICODE_STYLES.find((entry) => entry.id === styleId);
  return style ? style.transform(text) : text;
}
