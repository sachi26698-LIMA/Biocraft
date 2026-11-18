/**
 * BioCraft — configurable product limits.
 *
 * The platform is infinite by default: no feature imposes a fixed catalog cap
 * that grows stale and has to be edited by hand. The few numbers that remain are
 * deliberate, and every one of them is either
 *
 *   (a) a storage/abuse ceiling that exists on any real service, or
 *   (b) a per-request ceiling that exists so one visitor cannot force the server
 *       to materialise an unbounded result set,
 *
 * and all of them are overridable from configuration, so raising them never
 * requires a code change.
 *
 * Nothing here fabricates content or reports an "unlimited" number that is not
 * real. A limit that is enforced is disclosed; a limit that is not enforced is
 * not invented.
 *
 * How to raise a limit without touching code:
 *   - Per-request generation counts are read live from
 *     VITE_GENERATION_MAX_PER_REQUEST (see generationLimits below).
 *   - Server pagination ceilings are read live from MAX_PAGE_SIZE in the
 *     deployment environment (admin-backend) and from the `app_limits` table for
 *     the public API (see supabase/migrations).
 */

/** Read a positive integer from the build-time env, falling back when unset. */
function envInt(raw: string | undefined, fallback: number): number {
  if (!raw) return fallback;
  const parsed = Number(raw.trim());
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const metaEnv: ImportMetaEnv | undefined =
  typeof import.meta !== 'undefined' ? import.meta.env : undefined;

/**
 * How many items one generation run may return.
 *
 * The previous build offered a fixed 5/10/20 segmented control, which is exactly
 * the kind of arbitrary catalog cap this policy removes: a user who wanted 50
 * bios had no way to ask for them, and the ceiling could only be raised by
 * editing a constant and rebuilding.
 *
 * This is a *per-request* ceiling, not a product cap. It bounds a single
 * browser-side generation so the UI stays responsive; it does not bound how
 * much a user may generate over any number of runs, and it does not bound how
 * much content the library can hold.
 */
export const GENERATION_MAX_PER_REQUEST = envInt(metaEnv?.VITE_GENERATION_MAX_PER_REQUEST, 100);

/** The preset steps offered in the UI. A starting point, not a ceiling:
 *  callers may pass any value up to GENERATION_MAX_PER_REQUEST. */
export const GENERATION_PRESETS = [5, 10, 20, 50] as const;

/** Smallest useful run. Below this the generator cannot show variety. */
export const GENERATION_MIN_PER_REQUEST = 1;

/**
 * Clamp a requested generation count to what one run may return.
 * Deliberately permissive: it only refuses values that are not usable integers
 * or that exceed the disclosed per-request ceiling.
 */
export function clampGenerationCount(requested: number, fallback = 5): number {
  if (!Number.isFinite(requested)) return fallback;
  const whole = Math.floor(requested);
  if (whole < GENERATION_MIN_PER_REQUEST) return fallback;
  return Math.min(whole, GENERATION_MAX_PER_REQUEST);
}

/**
 * Public content paging. Growth is served by paging, not by raising a cap:
 * a collection with 500,000 rows is read in pages of this size, and the reader
 * keeps walking pages until it has them all (see lib/biosRemote.ts, which uses a
 * keyset cursor rather than an offset so deep pages stay fast).
 */
export const CONTENT_PAGE_SIZE = envInt(metaEnv?.VITE_CONTENT_PAGE_SIZE, 500);

/**
 * Server-side search page size. The *default* is a sensible screenful; the
 * ceiling is what the database is allowed to return in one call, and it exists
 * so a single request cannot stream the whole library. Clients that need more
 * call again with a higher offset — the library itself is unbounded.
 */
export const SEARCH_DEFAULT_PAGE_SIZE = envInt(metaEnv?.VITE_SEARCH_PAGE_SIZE, 24);
export const SEARCH_MAX_PAGE_SIZE = envInt(metaEnv?.VITE_SEARCH_MAX_PAGE_SIZE, 1000);
