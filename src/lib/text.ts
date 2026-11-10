/** Instagram's bio length limit. */
export const BIO_LIMIT = 150;
/** Stylish Name Generator target (Instagram display-name limit). */
export const DISPLAY_NAME_LIMIT = 30;
/** Instagram caption / bio-ish max used by Fancy Fonts. */
export const CAPTION_LIMIT = 2200;

/**
 * Counts characters the way a person would — code points. Astral emoji count
 * as one character, which matches how Instagram clients display length.
 */
export function bioLength(text: string): number {
  return Array.from(text).length;
}

/** Trims and collapses internal runs of whitespace. */
export function tidy(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/** Collapses blank lines and trims the ends. */
export function tidyMultiline(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/\s{2,}/g, ' ').trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}
