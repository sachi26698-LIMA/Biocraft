# BioCraft ↔ Supabase — Setup & Operations

Guest-first, database-only phase. No authentication is introduced; every tool
works for anonymous visitors exactly as before. The site keeps the bundled
registry as a fallback — Supabase enhances, never replaces, the shipped app.

## What exists in this repo

| Path | Purpose |
| --- | --- |
| `supabase/migrations/0001_initial_schema.sql` | All 10 tables (`platforms`, `categories`, `bios`, `generators`, `fonts`, `symbols`, `emoji_collections`, `hashtags`, `captions`, `seo_pages`), indexes, `search_bios()` full-text/filter/pagination function, `updated_at` triggers |
| `supabase/migrations/0002_rls_policies.sql` | RLS enabled on every table; anon/authenticated roles get read-only access to `is_active` rows; writes are revoked explicitly |
| `supabase/migrations/0003_reconcile_live_to_repo.sql` | Reconciles the initially drifted live schema to the reviewed schema; safe to apply after 0001 and 0002 |
| `scripts/seed-supabase.mjs` | Idempotent seed generator — reads the checked-in registry (`src/`), emits deterministic SQL to `supabase/seed/` |
| `supabase/seed/*.sql` | Generated seeds (committed; regenerate with `node scripts/seed-supabase.mjs`) |
| `scripts/seed-data-entry.tsx` | Data entry bundled by the seeder (exact registry the app ships) |
| `src/lib/supabase.ts` | Optional client; `isSupabaseConfigured` flag; publishable key only |
| `src/lib/biosRemote.ts` | Remote data access: collection fetch, `search_bios` RPC wrapper, featured/trending helpers |
| `src/vite-env.d.ts` | Minimal typing for `VITE_SUPABASE_*` |
| `.env.example` | Template — copy to `.env`; never commit real values |

Seed record counts (see `supabase/seed/00_COUNTS.md`): platforms 8,
categories 33 (22 content + 11 collection/niche extras), bios 506,
generators 12, fonts 33, symbols 629, emoji_collections 438,
hashtags 1,155, captions 3,888, seo_pages 48.

## One-time setup (owner)

1. **Restore the project if paused** (Supabase dashboard → Quick_kit project →
   "Restore project"). The site uses the bundled registry while unavailable.
2. **Use a publishable key**: Project Settings → API Keys → Publishable keys.
3. **Apply the schema for a new database**: dashboard → SQL Editor → run, in order:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_reconcile_live_to_repo.sql`
   - then each file in `supabase/seed/` in numeric order
   (or `psql "$SUPABASE_DB_URL" -f <file>` per file). The existing project
   `jvpadtzfsuekixrquzjv` has already had these migrations and seeds applied;
   do not reapply the initial migration to an existing schema.
4. **Verify counts** in SQL Editor:
   ```sql
   select 'platforms' t, count(*) from public.platforms
   union all select 'categories', count(*) from public.categories
   union all select 'bios', count(*) from public.bios
   union all select 'symbols', count(*) from public.symbols
   union all select 'hashtags', count(*) from public.hashtags
   union all select 'captions', count(*) from public.captions;
   ```
   Expected: 8 / 33 / 506 / 629 / 1155 / 3888.
5. **Local dev**: `cp .env.example .env`, fill both values, `npm run dev`.
6. **Production (Vercel)**: Project → Settings → Environment Variables → add
   `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production and
   Preview, then redeploy. `VITE_*` variables are inlined at build time.

## How the frontend uses it

- `/instagram-bio-for-boys` and every collection route render the bundled
  registry first (identical first paint, works offline and on every static
  host). When `VITE_SUPABASE_*` is set, the page swaps in live rows from
  `public.bios` (`source_slug = <collection slug>`), shows a small
  "built-in collection" notice with a Retry button if the fetch fails, and
  never shows an error screen or fabricated content.
- `search_bios()` (SQL function) implements keyword + platform + category +
  language + style + featured/trending filters with pagination, and is
  callable from `src/lib/biosRemote.ts` (`searchBios`, `fetchFeaturedBios`,
  `fetchTrendingBios`) — wired for future surfaces (e.g. a collections search),
  already unit-exercisable once the DB is live.
- SEO metadata stays build-time (static shells). `seo_pages` mirrors the same
  data for the future admin/edge phase; canonical stays empty until the
  production domain is known.

## Security model

- RLS on every table; anon reads `is_active` rows only.
- No INSERT/UPDATE/DELETE policies exist for anon/authenticated roles, and
  those privileges are explicitly revoked. Writes will go through a future
  admin environment using the service role (never in this repo, never in
  client code, never in Vercel client env).
- The publishable key is public by design; RLS is the enforcement layer.
- No user data is collected; there is no auth to misconfigure.

## Admin readiness (not built in this phase)

All content tables carry `is_active`, `is_featured`, `is_trending`,
`sort_order`, `created_at`/`updated_at`, so a future admin dashboard can add,
edit, deactivate, feature and trend content by writing with the service role
from a server-side environment. Nothing in the client can write.

## Known limitations

- Live database counts, anonymous reads, inactive-row filtering and anonymous
  insert rejection were verified through SQL. Browser/REST connectivity and
  deployment integration still need verification in an environment that can
  reach the project's API.
- Symbols/hashtags/captions generators still read the bundled pools at
  runtime (they are also seeded into the DB for the admin phase). Swapping
  those hot paths is a deliberate follow-up, not part of this phase.
