# BioCraft — Historical Recovery Audit

**Date:** 2026-11-19 · **Branch:** `arena/267512a0-biocraft` · **Base:** `98b740a` (main)
**Method:** production verified over HTTP (`fetch_page`) *and* repo verified from source. Where the two disagree, both states are recorded.

> **Correction to the brief.** The 8,421 bios are **not missing from production**. They are live at
> `/premium-bios`, and every number on that page matches the repo exactly (en 3,369 / hi 2,526 /
> hg 2,526, 46 categories). The real fault is **discoverability**: nothing on the site links to that
> route. Homepage, header, footer and search all send visitors to the older 506-bio registry instead.
> The "2,139" figure is not a discrepancy — it is the library total recorded at batch 022
> (`BATCH_LEDGER.md` line 35). It is a cumulative snapshot, not a separate body of work.

---

## Phase 1 — Inventory, four independent states

Legend: **Req** = requested/planned · **Repo** = implemented in repository · **Build** = in production build · **Live** = verified working on the live site.

| Module | Req | Repo | Build | Live |
|---|---|---|---|---|
| Bio library (verified, batched) | yes | **8,421** records, 46 cats | yes | **PASS** — `/premium-bios`, counts match repo exactly |
| — discoverable from site nav | yes | **no** | n/a | **FAIL** — zero inbound links |
| Curated collections registry | yes | **506** / 20 collections | yes | **PASS** — `/bio-collections` |
| Bio collection filter/design/language | yes | 17 designs, 3 langs | yes | **PASS** |
| Captions generator | yes | 371 templates | yes | not verified per-template |
| Hashtags generator | yes | 1,256 pools | yes | not verified per-pool |
| Unicode symbols | yes | **629** in 24 categories | yes | **PASS** — "629 of 629 symbols" on live |
| Emoji dataset | yes | **1,914** in `src/data/emoji.ts` | **not indexed** | **FAIL** — absent from search, no browse route |
| Colour names dataset | yes | **32,004** in `src/data/colors.ts` | partial | not verifiable as a library |
| Brand icons (Simple Icons) | yes | **3,472** (4.6 MB) | yes | title says 3,472 — see tool bug below |
| Font catalogue (Latin/global) | yes | **1,908** | paged | **PASS** — `/font-library`, "Load more" works |
| Hindi font ecosystem (local) | yes | **62 families / 478 files / 16.1 MB** on **`origin/arena/9b9059c8`** | **no — unmerged** | **FAIL** — not deployed |
| Colour palette tool | yes | yes | **built, unroutable** | **FAIL** — rendered bio form |
| Icon finder tool | yes | yes | **built, unroutable** | **FAIL** — rendered bio form |
| Text toolkit (22 ops) | yes | yes | **built, unroutable** | **FAIL** — rendered bio form |
| Global search | yes | index of **2,795** | yes | **PASS but incomplete** |
| — search covers 8,421 bios | yes | **no — 506 only** | no | **FAIL** |
| — search covers emoji | yes | **no — 0 of 1,914** | no | **FAIL** |
| — search covers fonts | yes | **33 of 1,908** | no | **FAIL** |
| Admin content workflow | yes | code exists | preview-only | **FAIL** — read-only, DB not connected |
| Admin publishing | yes | **no** persistent path | no | **FAIL** |

---

## Phase 2 — Reconciliation: defects found

### D1. Three tools were live as titles only (FIXED in `cdb3337`)
`/icon-finder`, `/color-palette-generator`, `/text-toolkit` returned 200 with correct `<title>` and then rendered **the Instagram bio generator**. Verified live on all three.

**Cause:** `ToolWorkspace` renders the platform's *first* tool when the route's tool is absent from that platform's `tools` list, keeping the URL unchanged. The three newest tools were added to the registry, given paths, shells and titles — and added to **zero** platform lists, so all 8 platforms fell back to `bio`.

**Fix:** added to all 8 platform lists. **Guard:** `tests/tool-reachability.mjs`, 11 assertions, no browser needed; reverting the fix reproduces the production symptom exactly (24 wrong resolutions).

### D2. `/premium-bios` is orphaned
8,421 bios, correct counts, live — and unreachable by clicking. `grep` for `premium-bios` finds only its own page and `ToolShell`. Homepage's "View all" points at `/bio-library` (506).

### D3. Global search indexes 2,795 of what the site actually holds
`bio 506 · symbol 629 · hashtag 1,256 · caption 371 · font 33`. Missing: the entire 8,421 bio library, 1,881 of 1,914 emoji, 1,875 of 1,908 fonts, all 3,472 icons, all 32,004 colour names.

### D4. Hindi font ecosystem never merged
`origin/arena/9b9059c8-biocraft`: 4 commits, 540 files, +128,836 lines, 62 Devanagari families self-hosted with cache headers and 3 test suites. Sits unmerged 4 days older than main. Production's font library instead pulls Google Fonts.

### D5. Admin cannot publish
Live `/admin` states: "Administrative access is not enabled for this deployment", "Supabase Admin DB — Not connected", Supabase **"Not connected"** (live evidence), Bios **506**. Phase 5 is therefore not a wiring task — the database was never connected to the deployed admin.

### D6. Dataset-to-UI gaps
Emoji (1,914) and colour names (32,004) exist as datasets with no browse route and no search entries.

---

## Phase 3–4 — What I did and did not do

**Done:** D1 fixed, tested, built, committed, pushed (`cdb3337`). `tsc` clean; `npm run build` produces 55 shells; the built `index` bundle now carries all three keys in all 8 platform arrays; 9 test suites pass.

**Not done, deliberately:** linking `/premium-bios` into nav, extending the search index to 8,421 bios, merging the Hindi font branch, and wiring admin publishing. Each is a behaviour-changing decision on a live production site that I could not verify end-to-end here — see limits. Guessing at four of them in one unreviewed push would be the opposite of the brief's "do not claim success from commits alone".

---

## Phase 6 — Deployment

**Not deployed.** No Vercel deploy was possible from this sandbox, and no deploy was made.
**Production deployment ID / commit: not verifiable from here** — no `.vercel` metadata, and the GitHub deployments API returns nothing (Vercel does not publish deploy SHAs there). I will not state a commit I could not confirm.

---

## Limits on this audit (stated so the report is not over-read)

- **Browsers cannot be installed** (`npx playwright install chromium` → download failure), so the 40+ Playwright suites, including the 12-tool workflow test, **could not run**. My tool fix is verified at unit, typecheck, build-artifact and bundle level — **not** driven in a browser.
- **`external` API reach to `vercel.app` is blocked; `fetch_page` works** and was used for every live claim above. Consequently I **could not test copy, download, pagination clicks or mobile layout** live — those need real interaction.
- Public pages are client-rendered, so `fetch_page` returns the runtime DOM for routed pages. Evidence quality is good but is not a substitute for a driven browser.
- No mutation was attempted against the live admin (correctly read-only).

---

## What I recommend next, in order

1. **Link `/premium-bios`** from header, footer, homepage and search results; point "View all" at it. Smallest change with the largest real effect — it makes 8,421 verified records reachable.
2. **Extend the search index** to the 8,421 bios (the index is already id-array based and documented as designed for 50,000).
3. **Decide on `/bio-library` vs `/premium-bios`** — two libraries with different content and no link between them is the root confusion.
4. **Merge the Hindi font branch** behind review; 16.1 MB of new static assets deserves its own PR.
5. **Connect Supabase to the admin** before any Phase 5 work; publishing cannot be built on an unconnected DB.
6. Give me a browser-capable environment if you want the tool routes verified by clicking rather than by bundle inspection.
