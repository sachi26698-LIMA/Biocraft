/**
 * Text operations for the Text Toolkit.
 *
 * Every function is pure and deterministic: same input, same output, no network,
 * no locale surprises. Case conversions are ASCII-aware (they never silently
 * mangle Devanagari, emoji or accented text) and the word/sentence counters are
 * documented rather than magic.
 */

/* ------------------------------------------------------------------- case */

/** Split into words on any run of non-alphanumerics, preserving accents. */
export function words(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^\p{L}\p{N}\p{M}]+/u)
    .filter(Boolean);
}

export function toUpper(input: string): string {
  return input.toUpperCase();
}

export function toLower(input: string): string {
  return input.toLowerCase();
}

/**
 * Title Case: capitalise the first letter of each word.
 * Small words (a, an, the, of, in, on, at, to, for, and, or, but, with) stay
 * lowercase unless they are the first or last word — the usual publishing rule.
 */
const SMALL_WORDS = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'for', 'and', 'or', 'but', 'with', 'as', 'by', 'from']);

export function toTitle(input: string): string {
  const parts = input.split(/(\s+)/);
  const wordIndexes = parts.map((p, i) => (/^\S+$/.test(p) ? i : -1)).filter((i) => i >= 0);
  return parts
    .map((part, i) => {
      if (!/^\S+$/.test(part)) return part;
      const position = wordIndexes.indexOf(i);
      const isEdge = position === 0 || position === wordIndexes.length - 1;
      const lower = part.toLowerCase();
      if (!isEdge && SMALL_WORDS.has(lower)) return lower;
      return lower.replace(/^\p{L}/u, (c) => c.toUpperCase());
    })
    .join('');
}

/** Sentence case: lowercase everything, then capitalise after . ! ? and at the start. */
export function toSentence(input: string): string {
  const lowered = input.toLowerCase();
  return lowered.replace(/(^\s*\p{L})|([.!?]\s+\p{L})/gu, (match) => match.toUpperCase());
}

const capitalise = (word: string) => word.replace(/^\p{L}/u, (c) => c.toUpperCase());

export function toCamel(input: string): string {
  const parts = words(input).map((w) => w.toLowerCase());
  return parts.map((w, i) => (i === 0 ? w : capitalise(w))).join('');
}

export function toPascal(input: string): string {
  return words(input).map((w) => capitalise(w.toLowerCase())).join('');
}

export function toSnake(input: string): string {
  return words(input).map((w) => w.toLowerCase()).join('_');
}

export function toKebab(input: string): string {
  return words(input).map((w) => w.toLowerCase()).join('-');
}

export function toConstant(input: string): string {
  return words(input).map((w) => w.toUpperCase()).join('_');
}

/**
 * URL slug. Accents are decomposed and stripped so "Café Crème" becomes
 * "cafe-creme"; scripts with no ASCII equivalent (Devanagari, CJK) are removed
 * rather than transliterated, because a wrong transliteration in a URL is worse
 * than a short one. Callers that need an empty-slug fallback should check.
 */
export function toSlug(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\p{ASCII}]/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ----------------------------------------------------------------- clean */

export function collapseSpaces(input: string): string {
  return input.replace(/[ \t\u00a0]+/g, ' ').replace(/ *\n */g, '\n');
}

export function trimLines(input: string): string {
  return input.split('\n').map((line) => line.trim()).join('\n');
}

export function removeBlankLines(input: string): string {
  return input.split('\n').filter((line) => line.trim().length > 0).join('\n');
}

/** Remove duplicate lines, keeping the first occurrence and original order. */
export function dedupeLines(input: string): string {
  const seen = new Set<string>();
  return input
    .split('\n')
    .filter((line) => {
      const key = line.trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join('\n');
}

export function sortLinesAsc(input: string): string {
  return input.split('\n').map((l) => l.trim()).filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })).join('\n');
}

export function sortLinesDesc(input: string): string {
  return input.split('\n').map((l) => l.trim()).filter(Boolean)
    .sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base', numeric: true })).join('\n');
}

export function reverseLines(input: string): string {
  return input.split('\n').reverse().join('\n');
}

/** Reverse by grapheme cluster so emoji and combining marks stay intact. */
export function reverseText(input: string): string {
  const segmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new (Intl as unknown as { Segmenter: new (l?: string, o?: { granularity: string }) => { segment: (s: string) => Iterable<{ segment: string }> } }).Segmenter(undefined, { granularity: 'grapheme' })
    : null;
  if (segmenter) {
    return [...segmenter.segment(input)].map((s) => s.segment).reverse().join('');
  }
  return [...input].reverse().join('');
}

/* --------------------------------------------------------------- extract */

const unique = (list: string[]) => [...new Set(list)];

export function extractEmails(input: string): string[] {
  return unique(input.match(/[\w.+-]+@[\w-]+\.[\w.-]{2,}/g) ?? []);
}

export function extractUrls(input: string): string[] {
  return unique(input.match(/https?:\/\/[^\s<>"')\]]+/g) ?? []);
}

/**
 * Hashtags in any script.
 *
 * \p{L} alone is not enough: Devanagari (and most Indic, Arabic and Thai
 * scripts) build words from combining MARKS, which are \p{M}, not \p{L}.
 * A class of letters+numbers alone truncates "\u092f\u093e\u0924\u094d\u0930\u093e" to
 * "\u092f". Including \p{M} keeps the cluster whole.
 */
export function extractHashtags(input: string): string[] {
  return unique(input.match(/#[\p{L}\p{N}\p{M}_\u200c\u200d]+/gu) ?? []);
}

export function extractMentions(input: string): string[] {
  // Avoid matching the @ inside an email address, and keep combining marks so
  // non-Latin handles stay intact (same reasoning as extractHashtags).
  return unique(
    (input.match(/(^|[^\w@])@[\p{L}\p{N}\p{M}_.\u200c\u200d]+/gu) ?? [])
      .map((m) => m.replace(/^[^\w@]/, '')),
  );
}

export function extractNumbers(input: string): string[] {
  return unique(input.match(/-?\d[\d,]*\.?\d*/g) ?? []);
}

/* ----------------------------------------------------------------- stats */

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  uniqueWords: number;
  longestWord: string;
  /** Minutes at 200 words per minute, rounded up. 0 for empty text. */
  readingMinutes: number;
}

export function analyse(input: string): TextStats {
  const trimmed = input.trim();
  const wordList = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
  const sentences = trimmed ? (trimmed.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) ?? []).filter((s) => s.trim()).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const uniqueWords = new Set(wordList.map((w) => w.toLowerCase().replace(/[^\p{L}\p{N}'-]/gu, '')).filter(Boolean)).size;
  const longestWord = wordList.reduce((longest, w) => (w.length > longest.length ? w : longest), '');
  return {
    characters: input.length,
    charactersNoSpaces: input.replace(/\s/g, '').length,
    words: wordList.length,
    sentences,
    paragraphs,
    lines: input === '' ? 0 : input.split('\n').length,
    uniqueWords,
    longestWord,
    readingMinutes: wordList.length === 0 ? 0 : Math.max(1, Math.ceil(wordList.length / 200)),
  };
}

/* ------------------------------------------------------------ operations */

export type OperationId =
  | 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'slug'
  | 'collapse' | 'trim' | 'blank' | 'dedupe' | 'sortAsc' | 'sortDesc' | 'reverseLines' | 'reverseText'
  | 'emails' | 'urls' | 'hashtags' | 'mentions' | 'numbers';

export interface OperationMeta {
  id: OperationId;
  label: string;
  group: 'Case' | 'Clean' | 'Extract';
  /** One-line explanation shown next to the button. */
  hint: string;
  /** True when the output is a list, so the UI can show a count. */
  list?: boolean;
  apply: (input: string) => string;
}

export const OPERATIONS: readonly OperationMeta[] = [
  { id: 'upper', label: 'UPPERCASE', group: 'Case', hint: 'every letter capitalised', apply: toUpper },
  { id: 'lower', label: 'lowercase', group: 'Case', hint: 'every letter lowercased', apply: toLower },
  { id: 'title', label: 'Title Case', group: 'Case', hint: 'capitalise each word, keep small words lowercase', apply: toTitle },
  { id: 'sentence', label: 'Sentence case', group: 'Case', hint: 'capitalise after each full stop', apply: toSentence },
  { id: 'camel', label: 'camelCase', group: 'Case', hint: 'for variable names', apply: toCamel },
  { id: 'pascal', label: 'PascalCase', group: 'Case', hint: 'for class and component names', apply: toPascal },
  { id: 'snake', label: 'snake_case', group: 'Case', hint: 'underscores between words', apply: toSnake },
  { id: 'kebab', label: 'kebab-case', group: 'Case', hint: 'hyphens between words', apply: toKebab },
  { id: 'constant', label: 'CONSTANT_CASE', group: 'Case', hint: 'for constants and env keys', apply: toConstant },
  { id: 'slug', label: 'URL slug', group: 'Case', hint: 'ascii, hyphenated, URL-safe', apply: toSlug },

  { id: 'collapse', label: 'Collapse spaces', group: 'Clean', hint: 'turn repeated spaces and tabs into one', apply: collapseSpaces },
  { id: 'trim', label: 'Trim lines', group: 'Clean', hint: 'strip leading and trailing spaces per line', apply: trimLines },
  { id: 'blank', label: 'Remove blank lines', group: 'Clean', hint: 'drop empty and whitespace-only lines', apply: removeBlankLines },
  { id: 'dedupe', label: 'Deduplicate lines', group: 'Clean', hint: 'keep the first of each repeated line', apply: dedupeLines },
  { id: 'sortAsc', label: 'Sort A→Z', group: 'Clean', hint: 'natural, case-insensitive order', apply: sortLinesAsc },
  { id: 'sortDesc', label: 'Sort Z→A', group: 'Clean', hint: 'reverse natural order', apply: sortLinesDesc },
  { id: 'reverseLines', label: 'Reverse lines', group: 'Clean', hint: 'last line first', apply: reverseLines },
  { id: 'reverseText', label: 'Reverse text', group: 'Clean', hint: 'emoji-safe character reversal', apply: reverseText },

  { id: 'emails', label: 'Extract emails', group: 'Extract', hint: 'unique addresses, one per line', list: true, apply: (i) => extractEmails(i).join('\n') },
  { id: 'urls', label: 'Extract links', group: 'Extract', hint: 'http and https URLs', list: true, apply: (i) => extractUrls(i).join('\n') },
  { id: 'hashtags', label: 'Extract hashtags', group: 'Extract', hint: '#tags with any script', list: true, apply: (i) => extractHashtags(i).join('\n') },
  { id: 'mentions', label: 'Extract @mentions', group: 'Extract', hint: '@handles, emails excluded', list: true, apply: (i) => extractMentions(i).join('\n') },
  { id: 'numbers', label: 'Extract numbers', group: 'Extract', hint: 'integers and decimals', list: true, apply: (i) => extractNumbers(i).join('\n') },
];
