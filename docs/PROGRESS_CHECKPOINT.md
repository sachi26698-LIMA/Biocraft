# Progress checkpoint — 2026-11-19

Resume point for the BioCraft audit/recovery/deployment task.

## State: execution stopped at the deployment boundary

Everything that can be done without production credentials is committed and merged. The remaining work is a **deployment action**, which this environment cannot perform.

### Merged and on `main`

| PR | Merge commit | What |
|---|---|---|
| #25 | `98b740a` | 8,421 verified bios (en 3,369 / hi 2,526 / hg 2,526) |
| #26 | `4e59c4b` | 62-family Hindi font ecosystem (478 files, 16.1 MB) |
| #28 | `eb10c4b` | Tool-routing fix: `palette`, `icons`, `text-toolkit` were rendering the bio generator |
| #29 | `5be6eee` | `/premium-bios` linked from footer + `/bio-library` hero; **sitemap added (134 URLs)**; deployment probe |

`main` tip: **`5be6eee`**.

### Production state — verified, not assumed

| Check | Evidence | Verdict |
|---|---|---|
| `/premium-bios` | 8,421 bios, 46 categories, counts match repo | **live** |
| `/sitemap.xml` | fetch fails | **404 — not deployed** |
| `robots.txt` has `Sitemap:` line | live text lacks it; `main` has it | **not deployed** |
| `/icon-finder` | renders bio generator | **PR #28 not deployed** |
| `/admin` | "Administrative access is not enabled", Supabase not connected | read-only, as designed |

The `robots.txt` comparison is the decisive test: the file differs between `main` and production, so **production has not rebuilt since at least `5be6eee`**.

## Next action (one step)

Deploy `main` (`5be6eee`) to the existing Vercel production project. Then run:

```bash
node scripts/verify-deployment.mjs
```

Exit 0 means the PR #28 tool fix is live. Then re-check:

- `https://biocraft-bice.vercel.app/sitemap.xml` → expect 134 `<url>` entries
- `https://biocraft-bice.vercel.app/robots.txt` → expect a `Sitemap:` line
- `/icon-finder`, `/color-palette-generator`, `/text-toolkit` → each must render its own panel, not the bio form

## Blockers and their owners

| Blocker | Owner action |
|---|---|
| No Vercel credentials/CLI here; Node egress to `vercel.app` blocked | site owner deploys |
| Vercel branch builds hit `upgradeToPro=build-rate-limit` | plan/quota |
| Browser suites (`playwright install chromium` blocked) | run on a machine with browsers |
| Admin publishing | connect Supabase to admin; schema owner reviews `admin-backend/proposals/016-catalog-drafts/apply.sql` |
| 470,679 Iconify + 32,004 colour records unpublished | licence decision + ~2.54 GB budget (`scripts/import-library.mjs --dry-run`) |

## Do not do

- Do not loosen the licence filters in `scripts/library-import-policy.json` to "get the icons published" — 22,856 CC-BY-SA, 1,574 GPL, 288 MPL, 479 CC-BY-NC and 3,247 UNDECLARED are excluded deliberately.
- Do not claim a deployment ID or production SHA without verifying it.
- Do not report browser tests as passing when `browserType.launch` fails.
