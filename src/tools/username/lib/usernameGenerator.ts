/**
 * Rule-based Instagram username generator.
 *
 * Inputs are tidied, transliterated (Devanagari → Latin) and reduced to the
 * Instagram handle alphabet [a-z0-9._]. Candidates are produced by a fixed set
 * of "styles" (classic, dotted, underscored, role prefixes, suffixes, keyword
 * blends, digits, initials), sampled round-robin and deduplicated, so the
 * result is always exactly 12 unique, rule-valid handles — or fewer only when
 * the input is fundamentally unusable (rejected by validateUsernameInput).
 */

import { transliterate, hasDevanagari } from '../../../lib/transliterate';
import { tidy } from '../../../lib/text';

export const USERNAME_TARGET = 12;
export const HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9._]{0,28}[a-z0-9])?$/;

const FIELD_PATTERN = /^[\p{L}\p{N}\p{M}][\p{L}\p{N}\p{M} .,'&-]*$/u;
const MAX_LEN = 40;
const MIN_NAME = 2;

export interface UsernameFormValues {
  name: string;
  keyword: string;
}

export type UsernameVibe = 'aesthetic' | 'professional' | 'short' | 'playful';

export interface UsernameOptions {
  /** Handle style emphasis (defaults to 'aesthetic'). */
  vibe?: UsernameVibe;
  /** Hard cap for generated handles (Instagram's own limit is 30). */
  maxLength?: number;
}

export interface UsernameFormErrors {
  name?: string;
  keyword?: string;
}

const validateField = (label: string, raw: string, required: boolean): string | undefined => {
  const value = tidy(raw);
  if (!value) return required ? `${label} is required.` : undefined;
  if (Array.from(value).length > MAX_LEN) return `${label} must be ${MAX_LEN} characters or fewer.`;
  if (!FIELD_PATTERN.test(value)) {
    return `${label} can only contain letters, numbers, spaces and . , ' & -`;
  }
  return undefined;
};

export function validateUsernameForm(values: UsernameFormValues): UsernameFormErrors {
  const errors: UsernameFormErrors = {};
  const nameError = validateField('Name', values.name, true);
  if (nameError) errors.name = nameError;
  const keywordError = validateField('Keyword or niche', values.keyword, false);
  if (keywordError) errors.keyword = keywordError;
  // After transliteration there must be something usable for a handle.
  if (!nameError) {
    const usable = transliterate(tidy(values.name)).replace(/[^a-z0-9]/g, '');
    if (usable.length < MIN_NAME) {
      errors.name = 'Name needs at least 2 letters or digits for a handle.';
    }
  }
  return errors;
}

/** What the user typed, as Latin tokens suitable for handles. */
export interface PreparedTokens {
  /** All word tokens of the name, joined, lowercase (e.g. "priyasharma"). */
  base: string;
  /** First word token (e.g. "priya"). */
  first: string;
  /** Trailing word tokens joined (e.g. "sharma"); may be empty. */
  last: string;
  /** Keyword token(s) joined, may be empty. */
  keyword: string;
  /** True when the original input contained Devanagari (UI note). */
  transliterated: boolean;
}

const cleanToken = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/^\.+|\.+$/g, '');

export function prepareTokens(values: UsernameFormValues): PreparedTokens {
  const rawName = tidy(values.name);
  const rawKeyword = tidy(values.keyword);
  const transliterated = hasDevanagari(rawName) || hasDevanagari(rawKeyword);

  const nameParts = transliterate(rawName)
    .toLowerCase()
    .split(/\s+/)
    .map(cleanToken)
    .filter(Boolean);
  const keywordParts = transliterate(rawKeyword)
    .toLowerCase()
    .split(/[\s,]+/)
    .map(cleanToken)
    .filter(Boolean);

  const first = nameParts[0] ?? '';
  const last = nameParts.slice(1).join('');
  const base = nameParts.join('');

  return {
    base,
    first,
    last,
    keyword: keywordParts.join(''),
    transliterated,
  };
}

/** Strip characters that may slip in, enforce Instagram handle rules. */
const sanitize = (handle: string, maxLength = 30): string => {
  let clean = handle
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace(/_{2,}/g, '_')
    .replace(/^[._]+/, '')
    .replace(/[._]+$/, '');
  if (clean.length > maxLength) clean = clean.slice(0, maxLength).replace(/[._]+$/, '');
  return clean;
};

const valid = (handle: string): boolean => HANDLE_PATTERN.test(handle);

export interface UsernameSuggestion {
  username: string;
  style: string;
}

const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = <T>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/** Builds labelled candidate handles in rough order of desirability. */
const VIBE_CONFIG: Record<UsernameVibe, { prefixes: string[]; suffixes: string[]; digits: boolean; repeat: boolean }> = {
  aesthetic: { prefixes: ['the', 'its', 'iam', 'real', 'im'], suffixes: ['official', 'real', 'hq', 'ig', 'gram', 'vibes'], digits: true, repeat: true },
  professional: { prefixes: ['the', 'official', 'its'], suffixes: ['official', 'hq', 'studio', 'co'], digits: false, repeat: false },
  short: { prefixes: ['the', 'its'], suffixes: ['hq', 'ig'], digits: false, repeat: true },
  playful: { prefixes: ['its', 'iam', 'real', 'im', 'the'], suffixes: ['vibes', 'ig', 'gram', 'hq', 'real'], digits: true, repeat: true },
};

const buildCandidates = (
  tokens: PreparedTokens,
  vibe: UsernameVibe,
  maxLength: number,
): Array<{ username: string; style: string }> => {
  const { base, first, last, keyword } = tokens;
  const cfg = VIBE_CONFIG[vibe];
  const candidates: Array<{ username: string; style: string }> = [];
  const push = (username: string, style: string) => {
    const clean = sanitize(username, maxLength);
    if (clean && valid(clean)) candidates.push({ username: clean, style });
  };

  const lastInitial = last ? last[0] : '';
  const firstInitial = first ? first[0] : '';

  // --- Classic ----------------------------------------------------------
  push(base, 'Classic');
  if (last) push(`${first}${lastInitial}`, 'Classic');
  if (first !== base) push(base.slice(0, 24), 'Classic');

  // --- Dots & underscores -------------------------------------------------
  if (last) {
    push(`${first}_${last}`, 'Underscore');
    push(`${first}.${last}`, 'Dot');
    push(`${firstInitial}_${last}`, 'Underscore');
  }
  if (first) {
    push(`${first}_${randInt(10, 99)}`, 'Underscore');
    push(`_${base}`, 'Underscore');
    push(`${base}_`, 'Underscore');
  }

  // --- Prefixes ------------------------------------------------------------
  const prefixes = cfg.prefixes;
  for (const prefix of shuffle(prefixes)) {
    push(`${prefix}${first}`, 'Prefix');
    if (last) push(`${prefix}${first}${lastInitial}`, 'Prefix');
    push(`${prefix}_${first}`, 'Prefix');
  }

  // --- Suffixes --------------------------------------------------------------
  const suffixes = cfg.suffixes;
  for (const suffix of shuffle(suffixes)) {
    push(`${first}${suffix}`, 'Suffix');
    push(`${first}_${suffix}`, 'Suffix');
    if (last) push(`${base}_${suffix}`, 'Suffix');
  }

  // --- Keyword blends ---------------------------------------------------------
  if (keyword) {
    push(`${keyword}${base}`, 'Keyword blend');
    push(`${base}${keyword}`, 'Keyword blend');
    push(`${base}_${keyword}`, 'Keyword blend');
    push(`${keyword}_${base}`, 'Keyword blend');
    push(`${first}.${keyword}`, 'Keyword blend');
    push(`${keyword}.${first}`, 'Keyword blend');
    push(`${first}_${keyword}`, 'Keyword blend');
    push(`${keyword}lover`, 'Keyword blend');
    push(`${keyword}daily`, 'Keyword blend');
    push(`${base}${keyword.slice(0, 8)}`, 'Keyword blend');
  }

  // --- Initials -----------------------------------------------------------------
  if (first && last) {
    push(`${firstInitial}${last}`, 'Initials');
    push(`${firstInitial}.${last}`, 'Initials');
    push(`${firstInitial}${lastInitial}${randInt(10, 99)}`, 'Initials');
    if (keyword) push(`${firstInitial}${lastInitial}_${keyword}`, 'Initials');
  }

  // --- Digits --------------------------------------------------------------------
  for (let i = 0; cfg.digits && i < 40; i += 1) {
    const width = i < 24 ? 2 : 3;
    push(`${base}${randInt(0, 10 ** width - 1)}`, 'With numbers');
    if (last) push(`${first}${lastInitial}${randInt(10, 99)}`, 'With numbers');
  }

  // --- Repeats / spaced spellings -------------------------------------------------
  if (cfg.repeat) push(`${first}${first}`, 'Repeat');
  push(`${base}x`, 'Suffix');

  return candidates;
};

/**
 * Generates exactly `USERNAME_TARGET` unique handles for the given input.
 * Deterministic candidate order with random digit sampling and shuffled
 * prefixes/suffixes — every run re-rolls digits and order.
 */
export function generateUsernames(
  values: UsernameFormValues,
  options: UsernameOptions = {},
): UsernameSuggestion[] {
  const vibe = options.vibe ?? 'aesthetic';
  const maxLength = Math.min(30, Math.max(6, options.maxLength ?? 30));
  const tokens = prepareTokens(values);
  const candidates = buildCandidates(tokens, vibe, maxLength);

  const seen = new Set<string>();
  const picked: UsernameSuggestion[] = [];

  // True round-robin across styles so the grid mixes styles evenly.
  const byStyle = new Map<string, UsernameSuggestion[]>();
  for (const candidate of candidates) {
    const list = byStyle.get(candidate.style) ?? [];
    list.push(candidate);
    byStyle.set(candidate.style, list);
  }
  const styleQueues = shuffle([...byStyle.values()]);
  for (const queue of styleQueues) shuffle(queue);

  for (let round = 0; picked.length < USERNAME_TARGET; round += 1) {
    let addedAny = false;
    for (const queue of styleQueues) {
      if (picked.length >= USERNAME_TARGET) break;
      const candidate = queue[round];
      if (!candidate) continue;
      if (candidate.username.length > maxLength) continue;
      const key = candidate.username.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push(candidate);
      addedAny = true;
    }
    if (!addedAny) break;
  }

  // Guaranteed fill: deterministic digit backstop.
  let n = 10;
  while (picked.length < USERNAME_TARGET) {
    const candidate = sanitize(`${tokens.base}${n}`, maxLength);
    const key = candidate.toLowerCase();
    if (valid(candidate) && !seen.has(key)) {
      seen.add(key);
      picked.push({ username: candidate, style: 'With numbers' });
    }
    n += 1;
    if (n > 9999) break; // unreachable for sane inputs
  }

  return picked;
}
