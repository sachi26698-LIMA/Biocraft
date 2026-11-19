# Local-first public architecture

**Final architecture:** the public site is a static React SPA that renders
entirely from bundled content. Supabase is retained **only as the Admin
authentication provider**. There is no application database in the public read
path, and no second application database was added.

| | |
|---|---|
| Production commit | `e4b8cd1` (merge of PR #24) |
| Deployment | `dpl_82KphQSCtRFkEEHFxm3ZysGGhiZS` — READY / PROMOTED |
| URL | https://biocraft-bice.vercel.app |
| Previous production | `f435b75` (available as a rollback candidate) |

## Verified production responses

```
GET /api/status/content      → {"ok":true,"source":"bundled","database_required":false}
GET /instagram-bio-for-boys  → "Showing 30 of 30 bios"  (no "Checking the live library…")
GET /library-search          → 1,416+ local entries     (was: "not connected", 48+)
GET /font-library            → 1,908 local families     (48 per page)
GET /api/admin/v1/session    → {"error":{"code":"UNAUTHENTICATED"}}   ← correct denial
GET /api/admin/v1/health?diagnose=1
                             → {"ok":true,"diagnostics":{"database":"reachable",
                                "provider":"reachable","limited_role":"ok"}}
```

## Public content source, by module

| Module | Source | Count |
|---|---|---|
| Bios | `src/lib/bioCollections.ts` | 506 across **20** collections |
| Captions | `src/tools/captions/data/pools.ts` | 371 templates, 12 topics, 8 tones |
| Hashtags | `src/tools/hashtags/data/pools.ts` | 1,099 unique tags, 14 niches |
| Symbols / emoji | `src/tools/symbols/data/symbols.ts` | 629 in 24 categories, +12 combos |
| Fonts (typography) | `src/lib/fontCatalog.ts` (generated) | 1,908 families |
| Unicode styles | `src/lib/unicodeStyles.ts` | 33 |
| Categories | `src/tools/bio/data/categories.ts` | 13,376 B registry |
| Generators | `src/tools/registry.ts` | 12 tools |
| Generator pools | 9 original `data/pools.ts` files | all present |
| Design / frames | `src/tools/design/emojiFrames.ts` | 20 frames × 33 fonts |
| SEO pages | `src/pages/info.tsx`, `scripts/build-shells.mjs` | 51 route shells |
| Search index | built at load from the above | 2,795 entries |

> **Correction to the task brief:** it states "original collections: 30". The
> registry contains **20** collections holding 506 bios. The 30 figure comes from
> `grep -c "slug: '"`, which also matches 10 design/language navigation entries
> that are not collections. Verified at runtime: `BIO_COLLECTIONS.length === 20`,
> unique slugs = 20. The live site confirms it: "Showing 30 of 30 bios" is one
> collection's count, not the number of collections.

## Supabase dependencies removed

| Removed | Previously did |
|---|---|
| `src/lib/supabase.ts` | browser Supabase client |
| `src/lib/biosRemote.ts` | `bios` reads, keyset paging, `search_bios` RPC |
| `src/lib/publishedCatalog.ts` + `components/PublishedCatalog.tsx` | three content shelves |
| `src/pages/PreviewDiagnosticsPage.tsx` | measured database pagination |
| `api/status/content.mjs` probe | removed the REST probe |
| 229,533-byte `supabase-js` chunk | **absent from `dist`** |

## Supabase dependencies remaining

**Auth only, and only server-side:**

- `/api/admin/v1/auth/*` — password + TOTP sign-in, enrolment, recovery, logout
- Session, MFA and permission checks are re-evaluated server-side per request
- The browser never holds a provider token and never receives a service-role key

The Admin **content** database (`bc_admin_v1`, 20 tables, 57 functions) is
untouched and still used by the Admin API. Converting it is scoped separately in
`docs/ADMIN_CONTENT_MIGRATION.md` — see "Remaining limitations".

## Why the public site cannot silently regress

1. **No client to call.** `@supabase/supabase-js` is not imported anywhere in
   `src/`. A page cannot query a table without adding a dependency back.
2. **Bundle check.** The build is asserted to contain no database host, project
   ref or `rest/v1` path — with and without `VITE_SUPABASE_*` set.
3. **Render check.** 7 public pages are mounted from real source in jsdom with
   `fetch` replaced by a counter that fails the test on any call.
4. **Empty state removed.** `BioCollectionPage` no longer has an "authoritative
   empty live result" branch, so the `07be22a` dead end cannot recur.

## Test results

| Suite | Result |
|---|---|
| `tsc --noEmit` | clean |
| `npm run build` | clean, 51 route shells, SEO files byte-identical |
| `test:local-first` | 28 assertions pass |
| `test:collections` | 4 pass (rewritten for local-first) |
| `test:generation` | 3 pass |
| `test:performance` | 3 pass |
| `test:public-content-status` | pass |
| 8 admin suites | pass |
| `run-admin-postgres` | 5/5 |

## Rollback

```bash
git revert -m 1 e4b8cd1     # restores database reads for public pages
git push origin main        # Vercel redeploys f435b75-equivalent behaviour
```

No data migration occurred, so nothing must be restored. The old deployment
`f435b75` remains a Vercel rollback candidate.

## Remaining limitations

- **Admin content editing is still database-backed.** Deliberate: converting it is
  a data-model migration, and Vercel's filesystem is read-only, so a runtime file
  write would be fake persistence. Options and a recommendation are in
  `docs/ADMIN_CONTENT_MIGRATION.md`.
- **Vercel preview deployments are auth-protected**, so previews could not be
  verified anonymously; production was verified directly instead.
- **Playwright's browser download is blocked** in this environment, so browser
  suites (`test:admin-lazy-error`, etc.) could not run. Their logic was not
  changed; verification used jsdom instead.
- **Fonts: 1,908 bundled vs 1,941 in the database.** The 33 extra rows are
  database-side additions (e.g. an `aesthetic` entry with no metadata). No public
  page previously displayed them, and `scripts/build-font-catalog.mjs --check`
  keeps the bundled list reproducible.
