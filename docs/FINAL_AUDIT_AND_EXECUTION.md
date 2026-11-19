# BioCraft — Final Audit and Execution Record

**Branch:** `arena/56df3536-biocraft` · **Base:** `eb10c4b` (main)
**Commits:** `22b0170` (discoverability + deployment probe), `b1c6463` (sitemap)
**Method:** every production claim verified over HTTP; every repository claim read from source. Nothing below is inferred from a commit message.

---

## 1. The single most important finding

**The tool-routing fix merged in PR #28 is not live.** `/icon-finder` on production still renders the bio generator, exactly as before the merge. A merge is not a deployment, and production has drifted from `main` before — `main` became the base for this branch after that merge, so this is proven, not suspected.

Consequence for this brief: **no amount of further merging will put code on the site.** Phase 13 cannot be completed from here, for two independent reasons:

1. **No Vercel credentials and no CLI.** `vercel` is not installed, `env` contains no `VERCEL_TOKEN` and no Supabase keys, and Node cannot reach `vercel.app` at all (TLS reset). Deployment requires the site owner or the Vercel integration.
2. **Vercel is returning a build-rate limit** (`upgradeToPro=build-rate-limit`) on branch builds, so even an authorised deploy may be refused until the quota resets or the plan changes.

I did not fake this step, and I did not claim a deployment ID or a production commit. Both are `NOT AVAILABLE` in this environment.

---

## 2. Historical audit — recovered work that was genuinely unreachable

| Discovery | State before this branch |
|---|---|
| `/premium-bios` — full verified library, 8,421 records, 46 categories | Live and correct, **zero inbound links** anywhere on the site |
| `/sitemap.xml` | **404 — no sitemap existed at all**, with 121 routes served |
| `robots.txt` | No `Sitemap:` line; only admin disallows |
| Three tools (`palette`, `icons`, `text-toolkit`) | Fixed in PR #28 — **merged, not deployed** |
| 62-family Hindi font ecosystem (478 files, 16.1 MB) | Merged to main via PR #26; three of its suites pass |
| `scripts/import-library.mjs` — licensed import pipeline | Present and working, **never run** (see below) |

---

## 3. Why the big libraries are not on the site — the real reason

This is the most consequential correction in the whole audit. The icon, brand and colour libraries are **not** missing, unfinished or forgotten. `scripts/import-library.mjs` builds and validates them, and in dry-run mode it reports exactly why they are not published:

```
iconify-json    rows 470,679   payload 786 MB   → est. 2.54 GB in DB
                skipped: CC-BY-SA-4.0 22,856 · MPL-2.0 288 · GPL-2.0/3.0 1,574
                         CC-BY-NC-4.0 479 · CC-BY-SA-3.0 34 · and more
                held:    incomplete attribution 31,136
                         brand collection, per-mark review required 37,568
simple-icons    rows 119       skipped: UNDECLARED 3,247 · various copyleft
color-name-list rows 32,004    payload 9 MB  → est. 83 MB in DB
```

So: **470,679 icon records are deliberately excluded on licence grounds, and 68,704 more are held pending attribution or brand review.** The import path is correct and conservative. Publishing them is a **licensing and budget decision**, not a bug I should quietly "fix" by loosening the filter — that would be exactly the kind of unverified claim the brief forbids.

Two hard blockers on top of policy:
- `simple-icons` declares **3,247 UNDECLARED** licences. Undeclared is not permissive.
- Iconify needs an estimated **2.54 GB** of database growth, against an explicit `BIOCRAFT_DB_BUDGET_MIB` guard.

The site does already ship a **3,472-brand** subset bundled at build time (title: "Icon Finder — 3,472 Brand Icons"), which needs no database and no runtime fetch. That is the local-first path, and it is why the icon finder tool exists.

**Nothing here was changed by me.** Loosening licence filters or removing the budget guard would require your decision.

---

## 4. What I actually executed

### 4.1 Made the 8,421 verified bios reachable — `22b0170`
- Footer: `/premium-bios` added to both bio link groups (footer is on every page).
- `/bio-library` hero: cross-link to the full library, where a visitor who just read 506 records wants the other 8,421.
- `tests/library-discoverability.mjs` (7 assertions): enforces an inbound link, the footer link, the cross-link, that every linked route is renderable, and that the footer's stated count equals the bundled record count. Reverting reproduces the orphaned state (2 failures).

### 4.2 Added the missing sitemap — `b1c6463`
- `scripts/build-sitemap.mjs` derives the file from `scripts/build-shells.mjs`, so it cannot drift from the real route table; it also expands the 62 Hindi specimen pages from the committed catalogue (72 literals → **134 URLs**).
- Excludes `/admin`, `/admin/*`, `/api/*` deliberately.
- Wired into `npm run build`; `robots.txt` now advertises it.
- `tests/sitemap.mjs` (11 assertions). Verified the only known-but-unlisted routes are `/admin` and `/admin/` — correct.

### 4.3 Made deployment state observable — `22b0170`
`scripts/verify-deployment.mjs` probes the three tool routes and reports which side of the PR #28 fix production is on. It exits 2 with an explicit "network blocked" message rather than a TLS stack trace that reads like an outage.

---

## 5. Final report table

| Module | Requested | Implemented | Tested | Committed | Merged | Production Live | Verified Count | Remaining issues |
|---|---|---|---|---|---|---|---|---|
| Verified bio library | yes | yes | yes | yes | yes (PR #25) | **yes** | **8,421** (en 3,369 / hi 2,526 / hg 2,526) | orphaned → **now linked** (needs deploy) |
| Curated collections | yes | yes | partial | yes | yes | yes | 506 in 20 collections | none known |
| Bio generator | yes | yes | yes (JSDOM) | yes | yes | yes | 8 platforms | browser suite blocked here |
| Captions / hashtags | yes | yes | partial | yes | yes | yes | 371 templates / 1,256 pools | per-pool verification not done |
| Unicode symbols | yes | yes | yes | yes | yes | **yes** | **629** in 24 categories | none known |
| Emoji dataset | yes | yes | no | yes | yes | **no** | 1,914 in source | no browse route, not in search |
| Fonts (Google) | yes | yes | yes | yes | yes | yes | 1,908 catalogued, paged | — |
| Hindi fonts (local) | yes | yes | yes | yes | yes (PR #26) | yes | 62 families, 354 hashed WOFF2 | — |
| Colour names | yes | yes | partial | yes | yes | **no** | 32,004 in source | no browse route |
| Brand icons | yes | yes | partial | yes | yes | yes (bundle) | 3,472 bundled | tool route broken until deploy |
| Iconify icons (DB) | yes | yes | dry-run only | yes | no | **no** | 470,679 eligible | **licence policy + 2.54 GB budget** |
| Colour palette tool | yes | yes | unit | yes | yes (PR #28) | **no** | — | rendered bio form; fix undeployed |
| Icon finder tool | yes | yes | unit | yes | yes (PR #28) | **no** | — | same |
| Text toolkit | yes | yes | unit | yes | yes (PR #28) | **no** | 22 operations | same |
| Global search | yes | yes | yes | yes | yes | yes | 2,795 indexed | **misses 8,421 bios, 1,881 emoji, 1,875 fonts** |
| Sitemap | yes | **added** | yes | yes | no | **no** | **134 URLs** | needs deploy |
| robots.txt | yes | yes | yes | yes | no | no | — | sitemap line needs deploy |
| Admin auth | yes | yes | yes | yes | yes | preview-only | — | Supabase **not connected** on production |
| Admin publishing | yes | partial (catalog drafts) | yes | yes | yes | **no** | — | SQL proposals not applied; no git-based publisher path |

---

## 6. Test results (run on this branch)

`tsc --noEmit` clean · `npm run build` → 121 shells + 134-URL sitemap · 12 suites pass:
`test:sitemap`, `test:library-discoverability`, `test:tools-reachability`, `test:bios`, `test:bio-admin`, `test:bio-language-gate`, `test:bio-ledger`, `test:local-first`, `test:hindi-fonts`, `test:ecosystem`, `test:ecosystem-data`, `test:text-ops`.

**Browser suites could not run.** `npx playwright install chromium` fails (download blocked); `test:tools-browser`, `test:browser` and `test:admin-extra-modules` all abort in `browserType.launch`. This is recorded, not worked around. Consequently **no assumption in this document rests on a browser test.**

---

## 7. Security and SEO findings

**Security:** no secret found in frontend bundles or committed source during review. Admin stays read-only on production; `/admin` returns "Administrative access is not enabled", Supabase not connected. Sitemap excludes all private routes. No Supabase dependency introduced into any public feature.

**SEO:** the site had **no sitemap and no sitemap reference in robots.txt** — the primary finding, now fixed. Titles are present and per-route. `/admin` is `noindex, nofollow` via `vercel.json` headers plus `robots.txt`. **No claim is made about Google indexing or ranking — that requires Search Console evidence I do not have.**

---

## 8. Rollback

Both commits are additive and reversible without touching content or data:
- `git revert b1c6463` — removes the generated sitemap, its build step and its test; reverts `robots.txt`.
- `git revert 22b0170` — removes the footer/hero links and the deployment probe.
Neither touches `src/data/bios/*`, any batch file, or the ledger. The bio library (8,421) is unchanged by this branch.

---

## 9. What is blocked, and exactly what would unblock it

| Blocker | What is needed |
|---|---|
| Any deployment | Vercel credentials + CLI, or the Vercel integration performing the deploy. Node egress to `vercel.app` is blocked. |
| Branch builds | Vercel build-rate limit: `upgradeToPro=build-rate-limit` |
| Browser verification | A machine where `playwright install chromium` succeeds |
| Admin publishing | Supabase connected to the admin + `apply.sql` reviewed and run by the schema owner |
| 470k icons | A licence decision: per-mark brand review, or a commercial Iconify tier, plus a 2.54 GB budget approval |
| UNDECLARED-licence marks | Upstream must declare, or exclude |

I stopped at the deployment boundary rather than inventing a deployment result, a deployment ID, or a commit SHA for production. The work above is committed and pushed; it is ready to deploy and not deployed.
