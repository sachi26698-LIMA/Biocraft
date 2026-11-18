# BioCraft — Global Infinite Data Ecosystem

Persistent implementation tracker. This file is the checkpoint: it records what is
actually verified, what is not, and where work resumes. A tick means a command was
run and passed. No tick is given for anything merely written.

Branch: `arena/d5b1fd2c-biocraft` (branched from `main` @ `382d4db`)

---

## Batch 1 — Foundation: schema + real data ingestion ✅ VERIFIED

### Schema — `supabase/migrations/0006_global_content_intelligence.sql`

Additive only. No table dropped, no column removed, no policy weakened, no existing
row altered. Re-running it is idempotent.

| Requirement | Delivered as | Status |
|---|---|---|
| `content_sources` | `data_sources` (+`content_licenses`) | ✅ |
| `app_limits` | reused the live table | ✅ |
| `global_content` | unified index, trigger-maintained | ✅ |
| `languages` registry | `languages`, 22 rows seeded | ✅ |
| `content_tags`, `content_collections` | created, nested via `parent_id` | ✅ |
| `content_translations`, `content_versions` | created, service-role only | ✅ |
| `data_sync_jobs`, `data_sync_logs` | created, idempotent-job unique index | ✅ |
| `content_analytics`, `admin_content_reviews` | created | ✅ |
| `user_saved_content`, `user_favorites` | created, own-rows RLS | ✅ |
| `font_library` | **extended live `fonts`** (1,908 real rows land here) | ✅ |
| `icon_library`, `color_palettes`, `design_templates`, `design_presets` | created | ✅ |
| `emoji_library`, `hashtag_library`, `caption_library`, `bio_library` | extensions of the live `emoji_collections`/`hashtags`/`captions`/`bios` rather than empty duplicates | ✅ |

Deliberate deviation, stated openly: the four "…_library" tables that already
exist with real rows were **extended, not recreated**. Creating empty duplicates
would have split the library and lost the existing 6,750 rows from every new
search surface.

### Real data ingested — 11,597 rows, no invented content

| Source | Package | Licence | Rows |
|---|---|---|---|
| Unicode Emoji | `unicode-emoji-json@0.9.0` | MIT | 1,914 |
| Unicode Symbols | `@unicode/unicode-15.1.0@2.1.0` | MIT | 7,775 |
| Google Fonts | `google-font-metadata@6.0.8` | MIT | 1,908 |

Verified properties:
- ✅ importer is idempotent — second run inserted 0, updated 0
- ✅ `--dry-run` is the default and writes nothing
- ✅ a source stays `never_synced` until an import actually succeeds
- ✅ duplicates inside the source are dropped and counted
- ✅ attribution and licence recorded per row

### Pagination at scale — measured, not claimed

On a disposable Postgres (never production):

| Scenario | Result |
|---|---|
| 200,035 indexed rows, full keyset sweep | 401 pages, **0 duplicates**, every row once |
| Deep `OFFSET 150000` page | 19 ms |
| `search_global` at 200k | 524 ms, 50 results |
| Page latency at 200k | ~120–240 ms/page (200/page ≈ 60 ms) |

### Bugs found and fixed during this batch

1. **Index triggers crashed** — `coalesce(r.name, …)` on a `record` raises
   `record "r" has no field "name"` for tables lacking that column. Rewritten via
   `to_jsonb(new)`.
2. **Pagination degenerated into batches** — `page_content` ordered by the index
   row's `created_at`, so a whole import batch shared one timestamp. Now orders by
   the content's own `source_created_at`.
3. **Cursor precision bug** — a `Date` round-trip drops microseconds, so
   `(created_at,id) > cursor` re-returned the cursor row forever. Cursor is now
   full-precision text. *Mutation-tested: reintroducing the truncation produces
   49,500 duplicates and an infinite loop, and the test fails.*
4. **Function defeated its own index** — `coalesce(cursor,'-infinity')` as the
   bound made Postgres sort the whole domain per page (210 ms/page). Split into
   two branches with a literal bound.
5. **`create table if not exists` skips new columns** — `source_created_at` needed
   an explicit `alter table ... add column`, or existing databases never got it.

### Tests

- `npm run test:global-content` — **39 assertions, all passing**
  (`tests/global-content-intelligence.mjs`, in-process PGlite, real migrations,
  real npm data, no production data)
- mutation-tested: the pagination guard fails when the bug is reintroduced
- `tsc --noEmit` clean; `npm run test:infinite` (prior guard) still passing
- migrations `0001`, `0002`, `0004`, `0005` byte-identical to before

---

## Batch 2 — Unified global search UI ✅ VERIFIED

`/library-search` — one search across bios, captions, hashtags, symbols, fonts,
emoji. Backed by `search_global()` over the trigger-maintained index.

| Behaviour | Verified how |
|---|---|
| Renders stored rows, real count | `tests/library-search-ui.cjs` (DOM) |
| Debounce collapses keystrokes | DOM test asserts < 3 calls for 3 keystrokes |
| Stale response can't overwrite newer | DOM test with a held promise |
| `hasMore` from a +1 probe, no COUNT | asserted p_limit bounds |
| Domain filter is server-side | asserts `p_domain` reaches the RPC |
| Honest when backend absent | mutation-tested both paths |
| Deep links `?q=` | router `useSearch`, build + route 200 |

- ✅ `npm run test:library-search` — **7/7**
- ✅ mutation-tested: faking rows on "not configured" fails; hiding a `42883`
  outage fails
- ✅ `tsc --noEmit` clean; `npm run build` clean; 49 route shells
- ✅ `/library-search` and `/library-search?q=travel` both serve 200 on preview
- ✅ header overlay gains one additive "Search all content libraries" entry; no
  existing overlay behaviour changed

## Not yet done

- [ ] Design assets: generators for gradients/palettes/icons beyond the tables
- [ ] Translation workflow surface (tables + status semantics exist; no UI)
- [ ] Admin master control: library management, source health, sync controls, reviews
- [ ] Background/scheduled sync (tables exist; **no scheduler verified yet** — must
      not be described as working until it is)
- [ ] AI layer: provider abstraction, quality scoring, bulk generation
- [ ] Mobile/browser regression on the new surfaces
- [ ] Anything applied to the live database — **deliberately deferred**, needs the
      approval + Hindi impact note

## Honest status of the headline claims

- Records ingested: **11,597 verified**, not 200,000. The 200,000+ target is proven
  as an *architecture* capability (pagination, indexing, search measured at
  200,035 rows), not as acquired content. Real catalogues of that size require real
  licensed sources, which are listed in the registry as available, not invented.
- No trend data is claimed. No source is marked `ready` unless an import ran.
- Nothing in this batch has been deployed or applied to production.
