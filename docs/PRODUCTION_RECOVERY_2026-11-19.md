# Production Recovery — 2026-11-19

Branch: `arena/9180b15f-biocraft` (branched from `4e59c4b`; fast-forwarded to `origin/main` = `eb10c4b`)
Checkpoint tag: `recovery/pre-recovery-eb10c4b`
No commits deleted, no force-push, no revert. Current production site untouched.

## 1. Root cause of the production failure

| Fact | Value |
|---|---|
| `main` HEAD | `eb10c4b` (PR #28 merge) |
| Production deployment | `dpl_GSSGuD7WnRBpkVHsC6bWfXFnquVW` @ `4e59c4b` READY/PROMOTED |
| Drift | production is **2 merges behind** `main` (PRs #27, #28) |

Commit status on **both** `c5a0c41` (PR #27) and `eb10c4b` (PR #28):

```
context:     Vercel
state:       failure
description: Deployment rate limited — retry in 24 hours.
target_url:  https://vercel.com/sachi26698-6758s-projects?upgradeToPro=build-rate-limit
```

PRs #27 and #28 merged successfully but **Vercel never built them**. The rate limit
silently froze production at `4e59c4b`. Nothing in the repo was broken by those merges —
the deploys simply never happened.

## 2. The stale-content defect (independent of the deploy freeze)

Two separate bio libraries exist, with different datasets:

| Library | Route | Records | Categories | Wired to nav? |
|---|---|---|---|---|
| Legacy "Ready-Made Bios" | `/bio-library` | 506 | 15 | Yes (footer) |
| Verified library (PR #25) | `/premium-bios` | **8,421** | **46** | **No — orphan route** |

`/premium-bios` was reachable **only by typing the URL**. `grep -rn '"/premium-bios"' src/`
returned zero hits outside `ToolShell.tsx`'s own route table. That is why the 8,421-bio
claim from PR #25 appeared false in production even before the deploy freeze.

**Fix:** footer entry for the premium library, a hero cross-link from `/bio-library`, and a
reciprocal note on `/premium-bios` pointing back at the 506 curated bios. Both libraries are
now discoverable from every page.

## 3. Content reconciliation — four counts per library

All figures measured from source, not from claims.

### Verified bio library (`src/data/bios/records.json`)

| Measure | Value |
|---|---|
| Source-file records | 8,421 |
| Validated unique (distinct normalised text) | 8,421 — zero duplicates |
| Production-build (`index.json` total) | 8,421 |
| Live searchable | 8,421 (client-side index; verified interactive) |

- `en` 3,369 · `hi` 2,526 · `hg` 2,526 — matches `index.json.byLang` exactly.
- **46 categories**, every one non-empty; `sum(byCategory)` = 8,421 = record count.
  Zero declared-but-empty categories, zero count mismatches.
- `index.complete` is `false` with `shortfall.total` = 41,579 — this is an intentional
  disclosure against a 50,000 target, already surfaced in the UI. Not a defect.

### Legacy ready-made library (`src/lib/bioCollections.ts`)

| Measure | Value |
|---|---|
| Source collections | 20 |
| Bios | 506 |
| Categories | 15 |
| Designs | 17 |

### Hindi fonts (`src/data/hindi-fonts/catalogue.json`)

62 families · 354 WOFF2 · 16,456,296 bytes · 1 rejected. All 62 have `LICENSE.txt` + `source.json`.

## 4. Defects found and fixed

| Module | Root Cause | Fix Applied | Tests | Merged | Production Verified |
|---|---|---|---|---|---|
| Bio Library (8,421) nav | `/premium-bios` had no inbound links | Footer + `/bio-library` hero link + reciprocal note | E2E, review-check | pending | pending |
| `/bio-library` a11y | 5 `<select>`s had `<label>` with no `htmlFor` | `htmlFor={id}` on each Dropdown label | axe 0 violations | pending | pending |
| `/bio-library` a11y | Icon-only "more categories" chip had no accessible name | `aria-label` toggling "Show all/fewer categories" | axe 0 violations | pending | pending |
| `/bio-library` a11y | 36 copy buttons: visible text not contained in `aria-label` | Label now begins with visible text | axe 0 violations | pending | pending |
| `/bio-library` a11y | `<nav role="group">` — invalid role | Container changed to `<div role="group">` | axe 0 violations | pending | pending |
| Tests | PR #28 took tools 12→15; 3 checks hardcoded old counts | Counts and href list updated to match registry | revamp-ui 33/33, review-check 344/353 | pending | pending |

The 9 remaining `review-check` failures are **pre-existing baseline** (`/`,
`/features`, `/categories` and 3 unrelated axe hits). No PR in the repo's history ever
fixed them; they are not regressions from this work.

## 5. Test results (local, all on `main` + this branch)

| Suite | Result |
|---|---|
| `tsc --noEmit` | exit 0 |
| `npm run build` | 121 route shells |
| `tests/revamp-ui.cjs` | **33/33 PASS** |
| `review-check.cjs` | **344/353** (baseline 9) |
| `tests/ready-made-ui.cjs` | **78/78 PASS** |
| `tests/bio-library.mjs` | PASS |
| `tests/bio-ledger.mjs` | PASS |
| `tests/bio-language-gate.mjs` | PASS |
| `tests/bio-admin-dashboard.mjs` | PASS |
| `tests/tool-reachability.mjs` | PASS (14 assertions) |
| `tests/hindi-fonts-catalogue.mjs` | PASS |
| `tests/hindi-fonts-runtime.mjs` | PASS |
| `tests/local-first/content-sources.mjs` | PASS |
| `tests/local-first/pages-render.mjs` | PASS |
| `tests/admin-api-routing.mjs` | PASS |
| `tests/admin-rewrite-sim.mjs` | PASS |
| `tests/admin-bundle-secrets.mjs` | PASS |
| `tests/ecosystem-libraries.mjs` | PASS |
| `tests/text-ops.mjs` | PASS |
| Browser E2E (Playwright, 1440px + 390px) | **22/22 PASS**, 0 console errors |

E2E covered: 8,421 page renders, 6 category searches, load-more 36→108, gibberish search → 0,
`/bio-library` 506, cross-links, footer link, 10 tool routes HTTP 200 with h1s, Devanagari
rendering on Hindi bios, zero horizontal overflow at 390px.

## 6. Public-page Supabase independence

`grep -rln supabase src/ | grep -v ^src/admin` → **1 hit**, and it is
`src/tools/icons/data/simpleIcons.ts`: an icon *named* "Supabase". No runtime Supabase
import, client or query exists on any public page. Supabase remains admin-auth-only.

## 7. Remaining blockers / unverified

1. **`*.vercel.app` is unreachable from this sandbox over TLS** (`SSL_ERROR_SYSCALL`;
   Chromium `ERR_CONNECTION_CLOSED`). Live verification must use `fetch_page`, which fetches
   SSR HTML only. **Browser-level live behaviour is UNVERIFIED — not passed.**
2. The Vercel build rate limit must have expired before a new production deploy can succeed.
   Merge alone proves nothing; deployment status must be re-read afterwards.
3. The 9 baseline `review-check` failures are out of scope for recovery and remain.

## 8. Resume here

```bash
cd /home/user/Biocraft
npm ci                                   # node_modules does not persist
./node_modules/.bin/tsc --noEmit         # never use npx tsc (wrong package)
npm run build
node tests/revamp-ui.cjs                 # expect 33/33
node tests/ready-made-ui.cjs             # expect 78/78
node tests/tool-reachability.mjs         # expect 14 assertions
```

Then: push `arena/9180b15f-biocraft`, open PR, watch checks, merge, and **confirm a Vercel
production deployment of the merged SHA reaches READY + PROMOTED** before claiming success.
