# BioCraft — Global Infinite Data Ecosystem

**PR #16 merge validation:** Integrated main’s bundled public content, 001–015 grant catalogue and pooler diagnostics with the real local Admin listener and resumable importer. The 7-page local-first render suite made zero network calls; TypeScript/build, the 160-file bundle scan and the native PostgreSQL/Chromium Admin suite passed. A separate build of main at `e4b8cd1` matched the integrated build on all 52 public routes for metadata, headings and layout landmarks, with no page or failed-request errors. No database or deployment settings changed. See [Admin progress](docs/MASTER_ADMIN_PROGRESS.md).

**Historical Production checkpoint:** [observed migrations, counts and earlier Admin status](docs/PRODUCTION_SYNC.md).

**Active local batch** (`arena/21fb7968-biocraft`, 2026-11-18 UTC): frontend :5173 and real Admin HTTP listener :4190 started. Same-origin liveness 200; readiness 503 without private configuration. Origin, peer signing, body limits and cookie forwarding verified locally. No Production changes. See [Admin progress](docs/MASTER_ADMIN_PROGRESS.md).

**Catalogue/API batch:** Templates reads `design_templates`, Designs reads `design_presets`; Symbols, Emoji and Languages use active-only guest projections gated by a live Admin `content.read` check. No new SQL grant. Chromium: 20 dedicated screens at 390/820/1440px (intercepted API). PGlite API integration and 48 signed-out route denials passed. The first disposable 200,000-icon run exposed four distinct source IDs colliding with hyphenated slugs; the importer now preserves Iconify’s canonical `prefix:name`. Job resume uses a pinned input digest and committed counters; wrong-input resume is refused. No live bulk job started.

**Private draft and browser batch (local only):** proposal `016-catalog-drafts` adds an owner-scoped, versioned metadata workspace in 11 domains. The native PostgreSQL 18.6 suite exercised the two limited-role commands, SEO/content separation, concurrent stale-version rejection, fresh MFA, atomic audit and refusal to roll back a nonempty store. Chromium used HTTPS Vite → actual Node listener → limited PostgreSQL; only upstream GoTrue/PostgREST were simulated. Password + TOTP yielded a Secure/Strict/HttpOnly cookie; editor module reads returned 200, staff/analytics/settings/audit 403. Template create/edit/archive reached v3 with three audit entries; missing CSRF was denied; logout returned the browser to 401. **Not hosted Auth, shared CRUD or catalogue publishing.** No 016 grant, flag or shared migration applied.

**Import scale and licence batch (disposable DB only):** `scripts/library-import-policy.json` admits explicit SPDX values; Simple Icons uses **per-mark** licences, not package CC0. Known brand sets in Iconify and incomplete attribution are held. Full local preflight: **470,679** icons + **119** brand marks + **32,004** colours = **502,802 candidates**, estimated **2,621,075,850 additional bytes** (~2.44 GiB). These supersede the earlier 572,907-candidate preflight, not the quota hold. PostgreSQL 18.6: 200,000 insertions in 64.925 s, repeat 0 inserts/updates + 200,000 skips in 9.589 s; 200,000 unique fingerprints and zero missing source/licence/attribution. As `anon`, 200 pages × 1,000 returned the whole slice once. Database size 387,236,367 bytes locally, then removed. Interrupted colour job: 10/40 committed, wrong manifest rejected; resumed at batch size 7, finished at 40 inserts, zero skips, two attempts. No shared bulk job, quota change or claim of brand-use permission.

**Release regression batch:** TS/guarded build passed (87 route shells), matrix 0/35 Admin shells off/on per scope, 163 built files scanned with secret canaries. Chromium verified the running unavailable state at 390/820/1440 px and 35 Admin routes on nav + reload. 57 signed-out API routes denied; 52 public routes compared with the pushed `3340e94` build; public tool interactions and mobile layout passed for all 12 tools. Published-package provenance/scale checks passed (30 + 29); the real CLI defaults to no writes even with a DSN and rejects misspelled or conflicting options. [See Admin validation](docs/MASTER_ADMIN_PROGRESS.md) for synthetic vs real test boundaries. Shared read-only check: four completed jobs, zero active, zero icons/palettes, 016 absent. Existing public Supabase catalogue works; real Admin login remains unverified due to `XX000` on the independently confirmed pooler. No shared import, grants, Vercel env update, push or deployment in this batch.

The following historical implementation tracker records what was verified on the branch below. A tick means a command was
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

## Batch 3 — Phases 3, 4, 5, 6, 7 (partially complete, verified parts listed)

| Phase | Delivered | Verified by | Status |
|---|---|---|---|
| 5 Sync | `scripts/sync.mjs` scheduler, retries, recovery, logs | `test:sync` 6/6 | ✅ |
| 4 Read API | migration 0007: 4 read-only functions, SQL-clamped paging | manual + `test:font-library` | ✅ |
| 4 Font UI | `/font-library`, 1,908 families, keyset paging | `test:font-library` 7/7 | ✅ |
| 7 AI | 3 provider adapters, honest fallback, local heuristics | `test:ai` 18/18 | ✅ |
| 3 Admin reads | migration 015: 8 admin read functions + 8 routes | `test:admin-content-library` 16/16, `test:admin-api-integration` | ✅ |
| 6 Languages | detection + translation-status contract | `test:language` 17/17 | ✅ |

### Migration status

| File | Applied to disposable DB | Applied to shared Supabase |
|---|---|---|
| `supabase/migrations/0006` | ✅ tested, idempotent | ❌ **needs approval** |
| `supabase/migrations/0007` | ✅ tested, idempotent | ❌ **needs approval** |
| `admin-backend/migrations/015` | ✅ tested, idempotent | ❌ **needs approval** |

Nothing has been applied to the shared project. The public site therefore still
runs on the bundled registry, and `/library-search` and `/font-library` honestly
report "not deployed" until 0006/0007 are applied.

### What is genuinely blocked, and why

1. **Live synchronisation.** The scheduler is proven end-to-end, but against a
   disposable database. Against the shared project it needs 0006 applied — a
   shared-DB change requiring approval. Until then no source anywhere is
   `ready`, and I will not describe sync as live.
2. **Admin Panel modules rendering data.** The 8 new routes are implemented and
   tested, but the console needs the deployed Admin server (a separate service
   with its own credentials). Production `/api/admin/v1/health` still returns
   503. The API layer and SQL are done; the deployment is the blocker.
3. **AI generation for real users.** The engine is complete and tested. It
   returns `available:false` until a provider key is set server-side, because
   inventing a key is not an option and asking you to paste one into chat is not
   allowed.

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
