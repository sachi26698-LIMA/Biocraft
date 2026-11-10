import {
  FALLBACK_EMOJIS,
  getPools,
  PERSONAL_EMOJIS,
  PERSONAL_EMOJIS_HI,
  type LinePools,
} from '../data/pools';
import { getLinkedInPools, LINKEDIN_EMOJIS } from '../data/linkedin-pools';
import { getCategory } from '../data/categories';
import type { Language, PersonalFormValues } from '../../../types';
import { BIO_LIMIT, bioLength, tidy, tidyMultiline } from '../../../lib/text';

/** Exactly this many bios are produced on every run. */
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
 * Composes exactly BIO_COUNT unique bios. Random sampling gets there almost
 * always; a deterministic enumeration guarantees we still return five even
 * with the toughest constraints (e.g. no-emoji Hindi with a long name).
 */
function composeBios(ctx: ComposeContext, limit: number = BIO_LIMIT): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  let attempts = 0;
  while (results.length < BIO_COUNT && attempts < 800) {
    attempts += 1;
    const candidate = buildCandidate(ctx, limit);
    if (isUsable(candidate, limit) && !seen.has(candidate)) {
      seen.add(candidate);
      results.push(candidate);
    }
  }

  if (results.length < BIO_COUNT && limit <= 80) {
    outerShort: for (const identity of ctx.pools.identity) {
      if (results.length >= BIO_COUNT) break outerShort;
      const candidate = assemble([fill(identity, ctx)]);
      if (isUsable(candidate, limit) && !seen.has(candidate)) {
        seen.add(candidate);
        results.push(candidate);
      }
    }
  }

  if (results.length < BIO_COUNT) {
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
            if (results.length >= BIO_COUNT) break outer;
            const rawLines = [identity, detail];
            if (location) rawLines.push(location);
            if (cta) rawLines.push(cta);
            const candidate = assemble(rawLines.map((line) => fill(line, ctx)));
            if (isUsable(candidate, limit) && !seen.has(candidate)) {
              seen.add(candidate);
              results.push(candidate);
            }
          }
        }
      }
    }
  }

  return results.slice(0, BIO_COUNT);
}

export interface BioOptions {
  /** Platform bio limit (defaults to Instagram's 150). */
  limit?: number;
  /** 'linkedin' uses the professional English pool with the LinkedIn About limit. */
  poolSet?: 'linkedin';
}

/** Generates five unique personalized bios from the user's details. */
export function generatePersonalBios(
  values: PersonalFormValues,
  language: Language,
  emojis: boolean,
  options: BioOptions = {},
): string[] {
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
          : PERSONAL_EMOJIS
        : [],
    pools: linkedIn ? getLinkedInPools(emojis) : getPools(language, emojis, 'personal'),
  };

  return composeBios(ctx, limit);
}

/** Generates five unique bios for a category (no personal details needed). */
export function generateCategoryBios(
  categoryId: string,
  language: Language,
  emojis: boolean,
  options: BioOptions = {},
): string[] {
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

  return composeBios(ctx, limit);
}
