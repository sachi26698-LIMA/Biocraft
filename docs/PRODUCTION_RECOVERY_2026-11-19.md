# Production Recovery — 2026-11-19

Branch: `arena/9180b15f-biocraft` @ `b6f3b8f`
Merged to `main` as: **PR #30 → `baf3016`**, **PR #31 → `4efdb77`**
Tree of `b6f3b8f` == tree of `4efdb77` == tree of `origin/main` (`d66a3fd`)
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

## 6b. THE REAL LIVE BUG (found and root-caused)

Production at `4e59c4b` renders **the Instagram bio form** at three routes, with the
correct `<title>`:

| Route | `<title>` | Body actually served |
|---|---|---|
| `/color-palette-generator` | Colour Palette Generator | Instagram bio form |
| `/icon-finder` | Icon Finder | Instagram bio form |
| `/text-toolkit` | Text Toolkit | Instagram bio form |

**Root cause** — `ToolWorkspace.tsx`:

```ts
const isAvailable = config.tools.includes(activeTool.key);
const effectiveKey = isAvailable ? activeTool.key : config.tools[0];
```

Those three keys were absent from every platform's `tools` array, so each route fell
back to `config.tools[0]` (bio). No error, no 404, correct title — invisible to review.

**Reproduced locally** by checking out `4e59c4b` and loading each route in Chromium:
all three return `h1="Instagram Bio Generator"` + the bio form. `/username-generator`
correctly returns Username Generator, so only these three were affected.

**Fixed by PR #28** (added the three keys to all 8 platforms) — which was merged but
never deployed. `main` at `4efdb77` is verified correct locally for all routes.

**New regression test:** `tests/tool-route-shadowing.mjs` (10 assertions). Proven
discriminating: it **fails 5/10 against `4e59c4b`**, naming exactly those three routes,
and passes 10/10 against `4efdb77`.

## 7. Remaining blockers / unverified

1. **BLOCKER — Vercel plan quota. Production cannot be deployed today.**
   The project is on the **Hobby plan** (`"plan": "hobby"`). Every deployment attempt is
   rejected at the API level:
   `402 Payment Required … more than 100, code: "api-deployments-free-per-day"`.
   This affects `main` only; the git integration issues a Vercel commit status of
   `Deployment rate limited — retry in 24 hours` on **every** merged commit
   (`eb10c4b`, `baf3016`, `5be6eee`, `4efdb77`). PR branch *previews* still build
   (PR #31's preview `dpl_3aDkFEU9E4DsFU8qVHiPKAfFWhRc` reached READY/STAGED), but a
   Production-target deployment and a promote-from-preview both fail with the same 402.
   No `VERCEL_TOKEN` is available in this sandbox and no `vercel` CLI is installed, so
   the promote endpoint cannot be reached outside the connector.
   **Resolution requires one of:** waiting for the daily quota reset (≤24h from
   2026-11-19T19:19Z), upgrading the account, or promoting the existing preview by hand.
   Nothing in the repository blocks this — `main` is ready to deploy.
   **Production deploy + live acceptance is therefore UNVERIFIED, not passed.**
2. **`*.vercel.app` is unreachable from this sandbox over TLS** (`SSL_ERROR_SYSCALL`;
   Chromium `ERR_CONNECTION_CLOSED`). Live verification must use `fetch_page`, which fetches
   SSR HTML only. **Browser-level live behaviour is UNVERIFIED — not passed.**
3. The 9 baseline `review-check` failures are out of scope for recovery and remain.
4. The PR #31 preview is auth-protected (`Protected Deployment – Vercel`), so even the
   preview HTML could not be fetched for SSR-level confirmation. **Live browser
   verification of the fixed build is unverified.**

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
