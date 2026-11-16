import {
  FALLBACK_EMOJIS,
  getPools,
  PERSONAL_EMOJIS,
  PERSONAL_EMOJIS_HI,
  PERSONAL_EMOJIS_HG,
  type LinePools,
} from '../data/pools';
import { getLinkedInPools, LINKEDIN_EMOJIS } from '../data/linkedin-pools';
import { getCategory } from '../data/categories';
import type { Language, PersonalFormValues } from '../../../types';
import { BIO_LIMIT, bioLength, tidy, tidyMultiline } from '../../../lib/text';

/** Default number of bios per run; callers may request 5, 10 or 20. */
export const BIO_COUNT = 5;

interface ComposeContext {
  name?: string;
  /** Static role (personal mode). */
  role: string;
  /** Static niche; ignored when nicheOptions is set (category mode). */
  niche: string;
  /** When set, a role is picked at random per candidate (category mode). */
  roleOptions?: string[];
  /** When set, a niche is picked at random per candidate (category mode). */
  nicheOptions?: string[];
  hasNiche: boolean;
  city?: string;
  emojis: string[];
  pools: LinePools;
}

const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

/** Fills {name} {role} {niche} {city} {e} placeholders. */
function fill(template: string, ctx: ComposeContext): string {
  const emoji = ctx.emojis.length > 0 ? pick(ctx.emojis) : FALLBACK_EMOJIS[0];
  const role = ctx.roleOptions ? pick(ctx.roleOptions) : ctx.role;
  const niche = ctx.nicheOptions ? pick(ctx.nicheOptions) : ctx.niche;

  return template
    .replaceAll('{name}', ctx.name ?? '')
    .replaceAll('{role}', role)
    .replaceAll('{niche}', niche)
    .replaceAll('{city}', ctx.city ?? '')
    .replaceAll('{e}', emoji);
}

/** Cleans one line and returns it, or null when nothing remains. */
function cleanLine(raw: string): string | null {
  const line = raw
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([|·—])/g, ' $1')
    .replace(/([|·—])\s+/g, '$1 ')
    .replace(/\s+$/g, '')
    .trim();
  // Drop lines that end up as a dangling separator or a single character.
  if (!line || /^[|·—-]$/.test(line)) return null;
  return line;
}

/** Joins lines, dropping empties and near-duplicates (case-insensitive). */
function assemble(lines: string[]): string {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const raw of lines) {
    const line = cleanLine(raw);
    if (!line) continue;
    const key = line.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }

  return tidyMultiline(out.join('\n'));
}

/** One random composition. May exceed limits — the caller filters. */
function buildCandidate(ctx: ComposeContext, limit: number): string {
  // TikTok's 80-character limit: identity-only compositions are the
  // reliable way to stay short, everything else almost always overflows.
  if (limit <= 80) {
    return assemble([fill(pick(ctx.pools.identity), ctx)]);
  }

  const lines: string[] = [pick(ctx.pools.identity)];

  const detailPool = ctx.hasNiche ? ctx.pools.detail : ctx.pools.detailGeneric;

  if (detailPool.length > 0 && Math.random() < 0.9) {
    lines.push(pick(detailPool));
  }

  if (ctx.city && Math.random() < 0.7) {
    lines.push(pick(ctx.pools.location));
  }

  if (Math.random() < 0.82) {
    lines.push(pick(ctx.pools.cta));
  }

  // For very short bios, add a second detail line ~45% of the time.
  if (lines.length < 3 && ctx.hasNiche && Math.random() < 0.45) {
    lines.splice(1, 0, pick(detailPool));
  }

  return assemble(lines.map((line) => fill(line, ctx)));
}

const isUsable = (bio: string, limit: number): boolean =>
  bio.length > 0 && !bio.includes('{') && bioLength(bio) <= limit;

/**
 * Composes `count` unique bios. Random sampling gets there almost always;
 * a deterministic enumeration is the backstop for the toughest constraint
 * sets (e.g. no-emoji Hindi with a long name).
 */
function* composeBiosSteps(ctx: ComposeContext, limit: number = BIO_LIMIT, count: number = BIO_COUNT, exclude: readonly string[] = []): Generator<void, string[]> {
  let work = 0;
  const seen = new Set<string>();
  const excluded = new Set(exclude.map((bio) => bio.toLowerCase()));
  const results: string[] = [];
  const accept = (candidate: string) => isUsable(candidate, limit) && !seen.has(candidate) && !excluded.has(candidate.toLowerCase());

  let attempts = 0;
  while (results.length < count && attempts < 1200) {
    attempts += 1;
    if (++work % 8 === 0) yield;
    const candidate = buildCandidate(ctx, limit);
    if (accept(candidate)) {
      seen.add(candidate);
      results.push(candidate);
    }
  }

  if (results.length < count && limit <= 80) {
    outerShort: for (const identity of ctx.pools.identity) {
      if (results.length >= count) break outerShort;
      if (++work % 8 === 0) yield;
      const candidate = assemble([fill(identity, ctx)]);
      if (accept(candidate)) {
        seen.add(candidate);
        results.push(candidate);
      }
    }
  }

  if (results.length < count) {
    const detailPool = (
      ctx.hasNiche ? ctx.pools.detail : [...ctx.pools.detailGeneric, ...ctx.pools.detail]
    ).filter(Boolean);
    const locationChoices: (string | null)[] = ctx.city
      ? [null, ...ctx.pools.location]
      : [null];

    outer: for (const identity of ctx.pools.identity) {
      for (const detail of detailPool) {
        for (const location of locationChoices) {
          for (const cta of ctx.pools.cta) {
            if (results.length >= count) break outer;
            if (++work % 8 === 0) yield;
            const rawLines = [identity, detail];
            if (location) rawLines.push(location);
            if (cta) rawLines.push(cta);
            const candidate = assemble(rawLines.map((line) => fill(line, ctx)));
            if (accept(candidate)) {
              seen.add(candidate);
              results.push(candidate);
            }
          }
        }
      }
    }
  }

  return results.slice(0, count);
}

export interface BioOptions {
  /** Platform bio limit (defaults to Instagram's 150). */
  limit?: number;
  /** How many bios to compose (5, 10 or 20). Defaults to BIO_COUNT. */
  count?: number;
  /** 'linkedin' uses the professional English pool with the LinkedIn About limit. */
  poolSet?: 'linkedin';
  /** Exclude existing results when requesting a fresh variation. */
  exclude?: readonly string[];
}

function finishSteps(steps: Generator<void, string[]>): string[] {
  let step = steps.next();
  while (!step.done) step = steps.next();
  return step.value;
}

/** Generate synchronously where explicitly requested (normally in a worker). */
export function generatePersonalBios(values: PersonalFormValues, language: Language, emojis: boolean, options: BioOptions = {}): string[] {
  return finishSteps(generatePersonalBiosSteps(values, language, emojis, options));
}

/** Incremental composition for worker-unavailable environments. */
export function* generatePersonalBiosSteps(
  values: PersonalFormValues,
  language: Language,
  emojis: boolean,
  options: BioOptions = {},
): Generator<void, string[]> {
  const limit = options.limit ?? BIO_LIMIT;
  const name = tidy(values.name);
  const role = tidy(values.role);
  const niche = tidy(values.niche);
  const city = tidy(values.city);
  const hasNiche = niche.length > 0;

  const linkedIn = options.poolSet === 'linkedin';
  const ctx: ComposeContext = {
    name,
    role,
    niche,
    hasNiche,
    city: city || undefined,
    emojis: linkedIn
      ? (emojis ? LINKEDIN_EMOJIS : [])
      : emojis
        ? language === 'hi'
          ? PERSONAL_EMOJIS_HI
          : language === 'hg'
            ? PERSONAL_EMOJIS_HG
            : PERSONAL_EMOJIS
        : [],
    pools: linkedIn ? getLinkedInPools(emojis) : getPools(language, emojis, 'personal'),
  };

  return yield* composeBiosSteps(ctx, limit, options.count, options.exclude);
}

/** Generates unique bios for a category (no personal details needed). */
export function generateCategoryBios(categoryId: string, language: Language, emojis: boolean, options: BioOptions = {}): string[] {
  return finishSteps(generateCategoryBiosSteps(categoryId, language, emojis, options));
}

export function* generateCategoryBiosSteps(
  categoryId: string,
  language: Language,
  emojis: boolean,
  options: BioOptions = {},
): Generator<void, string[]> {
  const limit = options.limit ?? BIO_LIMIT;
  const category = getCategory(categoryId);
  const content = language === 'hi' ? category.hi : category.en;

  const ctx: ComposeContext = {
    role: content.roles[0],
    niche: content.niches[0],
    roleOptions: content.roles,
    nicheOptions: content.niches,
    hasNiche: true,
    emojis: emojis ? category.emojis : [],
    pools: getPools(language, emojis, 'category'),
  };

  return yield* composeBiosSteps(ctx, limit, options.count, options.exclude);
}

/**
 * Produces a single fresh bio for the given settings, avoiding anything in
 * `exclude` (case-insensitive). Used for per-result regenerate. Returns null
 * when the pool cannot yield a fresh, usable line — callers keep the old one.
 */
export function generateSingleBio(
  mode: 'personal' | 'category',
  args: { values?: PersonalFormValues; categoryId?: string },
  language: Language,
  emojis: boolean,
  options: BioOptions,
  exclude: readonly string[],
): string | null {
  const singleOptions = { ...options, count: 1, exclude };
  const pool = mode === 'personal'
    ? generatePersonalBios(args.values as PersonalFormValues, language, emojis, singleOptions)
    : generateCategoryBios(args.categoryId ?? '', language, emojis, singleOptions);
  return pool[0] ?? null;
}
