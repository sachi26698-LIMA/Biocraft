import type { Language } from '../../types';

export interface MoodBoardCategory {
  /** Category id — also the key into pools. */
  id: string;
  /** Tab label per language (Latin for EN/Hinglish UI, Devanagari for HI). */
  label: string;
  labelHi: string;
  labelHg: string;
}

export type MoodBoardPools<C extends string> = Record<C, Record<Language, string[]>>;

export interface ComposerResult {
  lines: string[];
  /** True when the pool could not fill `count` uniques and the result is shorter. */
  exhausted: boolean;
}

const EMOJI_RE = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{2B00}-\u{2BFF}]/gu;

/** Strips emoji pictographs (used for the "no emojis" mode). */
export function stripEmoji(text: string): string {
  return text.replace(EMOJI_RE, '').replace(/[ \t]{2,}/g, ' ').replace(/ +([,.;!?])/g, '$1').trim();
}

/** Deterministic-ish shuffle (Fisher–Yates over a copy). */
export function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Picks `count` unique lines for a category + language. When `noEmoji` is set,
 * emoji are stripped from the chosen lines (lines that were emoji-only are
 * dropped from the pool first).
 */
export function composeMoodBoard<C extends string>(
  pools: MoodBoardPools<C>,
  category: C,
  language: Language,
  count: number,
  noEmoji: boolean,
): ComposerResult {
  const raw = pools[category][language] ?? [];
  const pool = noEmoji
    ? raw.map(stripEmoji).filter((line) => line.length >= 2)
    : [...raw];
  const picks = shuffled(pool).slice(0, count);
  return { lines: picks, exhausted: picks.length < count };
}

/**
 * A single fresh line, avoiding anything in `exclude` (case-insensitive).
 * Returns null when the pool is exhausted — caller keeps the previous line.
 */
export function freshLine<C extends string>(
  pools: MoodBoardPools<C>,
  category: C,
  language: Language,
  noEmoji: boolean,
  exclude: readonly string[],
): string | null {
  const raw = pools[category][language] ?? [];
  const pool = noEmoji
    ? raw.map(stripEmoji).filter((line) => line.length >= 2)
    : [...raw];
  const excluded = new Set(exclude.map((item) => item.toLowerCase()));
  const fresh = shuffled(pool).find((line) => !excluded.has(line.toLowerCase()));
  return fresh ?? null;
}
