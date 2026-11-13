# BioCraft Master Admin — next-stage Preview report

## Executive status

This is **not a complete live administrative system**. The owner reports personally opening hosted `/admin` on Android for commit `a228666`; this is owner-reported visual evidence, not a screenshot supplied to or independently validated by this audit. The changes below are locally built and tested after that commit. The hosted deployment for the new commit must be checked separately. Sandbox attempts against the earlier deployment did not receive an HTTP response. Real-device performance, live backend behavior and actual access enforcement remain unverified.

No shared Supabase migration, RLS change, administrator account or privilege grant, content publication, `main` modification or Production deployment was performed in this stage. Earlier unauthorized shared pagination migration is disclosed in the preceding report and is not altered here.

## Implemented locally in Preview

| Module | Actual capability | Explicit limitation |
|---|---|---|
| Overview | Bundled counts and links. | No live metrics or health. |
| Users | Clear unavailable state and disabled invite/export controls. | No user directory, status, role or account operations. |
| Bio library | Search, language/collection filters, source/text/collection sorting, ten-row client pagination and detailed bundled record view. Browser-only scratchpad supports create/edit/discard, selecting multiple scratch items, and local draft/review *markers*. | Scratch data exists only in memory, disappears on page leave/refresh/close, never touches public or database content, and review markers are not a submitted review. No real CRUD, bulk management or publishing. |
| Categories & collections | Independent search, sorting and detailed source data including labels, roles/topics, collection SEO fields. | Read-only bundled data; no create/edit/publish. |
| Platforms | Search, sort and details for all eight independent app configurations. | No live configuration changes; displayed limits are not independently verified platform policies. |
| Generators | Search, platform filter, sorting and tool details; links to real public tools. | No preset/language management backend. |
| Content & SEO | Searchable/sortable bundled tool SEO metadata and details. | Partial inventory of tools only, not all live pages; edit disabled. |
| Analytics | Unavailable state and disabled export controls. | No charts, usage data or exports without an approved real source. |
| Security | Proposed-role table and explicit unavailable audit view. | Role display is not enforcement; no sessions, MFA, membership or audit source connected. |
| Settings | Unavailable state and disabled controls. | No settings, backup or restore service. |

Category/collection/platform/tool/SEO inventories are small bundled sets rendered in full; they are **not paginated**. Loading fallback and an error boundary apply to the lazily loaded local scratchpad only; other modules have synchronous bundled data or explicitly unavailable backend states, not real async loaders. No empty list is presented as an actual empty database. Accessible focus trap, Escape, responsive sidebar, background scroll lock, resize cleanup and reduced-motion behavior remain Preview-only.

The draft scratchpad is intentionally lazy-loaded; the test confirms its chunk is not downloaded on initial bio-library load. Bio search normalizes a cached index rather than recomputing every string on each query, and sidebar navigation uses a shared path subscription. These changes do not establish a target performance improvement.

## Local test results

- `test:admin-phase`: PASS on Pixel 5 profile emulation, tablet 820×1100 and desktop 1440×900. Tested scratch create/edit/cancel, local review marker/filter, multiselect/discard and refresh data loss; bio/collection/category/platform/tool/SEO sorting, filters and details; disabled privileged controls; no browser page/console errors, unexpected failed/4xx requests or admin/Supabase requests. Tested document overflow across all ten routes at those sizes and seven routes at 320px. Mobile backdrop closes menu and restores scroll.
- `test:admin-browser`: PASS all ten routes in both themes at 390, 820 and 1440; selected axe WCAG 2/2.1 A/AA rules, search, language filter, pagination and theme. Additional `test:admin-phase` passed the same selected axe rules with the scratch form open in both themes. This is not a complete accessibility, manual screen reader or physical device test.
- `test:admin-interactions`: PASS 10 sidebar links at all three sizes, 12 public tool links on desktop, sticky header, mobile focus trap, Escape, focus return and resize. `test:admin-catalog`: PASS source/display comparison of 506 bios, 20 collections, 12 categories, eight platforms and 12 tools. `test:admin-lazy-error`: PASS when the optional chunk is intentionally aborted and the error fallback appears. That injected failure is not an unexplained asset failure.
- `test:admin-public-regression`: PASS limited comparison of 48 public routes to local `a228666` (title, description, main headings, header/footer, page errors and failed requests). It does not prove every interaction, appearance or SEO is identical. The public React app was not changed this stage.
- Typecheck; local Preview and Production-mode builds; blueprint, draft, collection, diagnostics, generation, performance and review tests all PASS, review 287/287. Production-mode build contains no admin document or identified admin assets. PGlite/mock tests do not prove actual Supabase authorization.

### Genuine local screenshots

New screenshots are from local headless Chromium, not the hosted deployment: [Android emulated draft UI](android-emulated-scratch.png), [tablet draft UI](tablet-scratch.png), [desktop draft UI](desktop-scratch.png), plus [mobile overview](overview/mobile.png), [tablet overview](overview/tablet.png) and [desktop overview](overview/desktop.png). The dummy text is generated solely by the test, not real account data. The owner says they viewed the previous hosted build on a real Android device; the owner's screenshots were not provided to this audit.

## Synthetic local performance — not field INP

One sequential sample, `a228666` versus the new local build, same fresh Chromium contexts, 4× CPU throttle, no network throttle, `/admin/bios` with scripted search/filter/pagination/theme. Playwright tracing/screenshot capture can perturb timing. Transfer is the sum of resource entries and excludes HTML. LCP is last recorded entry; shift is the sum of observed no-recent-input shifts, not the complete CLS algorithm. Events are individual Event Timing durations, **not INP/p75**. Single runs are noisy.

| Viewport | Resource bytes before → after | LCP ms before → after | Observed shift sum before → after | Longest task ms before → after |
|---|---:|---:|---:|---:|
| Android emulated | 99,413 → 102,769 | 448 → 424 | 0.00033 → 0.00014 | 209 → 234 |
| Tablet | 99,413 → 102,769 | 432 → 476 | 0.01860 → 0 | 201 → 229 |
| Desktop | 99,413 → 102,769 | 496 → 460 | 0.00069 → 0.00060 | 234 → 210 |

New scripted keydown durations were 96/72/88 ms and two click durations 104/56, 96/64 and 120/80 ms respectively. Long tasks remain above 50 ms; resource bytes increased with functionality and no consistent LCP improvement is demonstrated. INP, real-world p75, physical Android and database request performance have not been measured. The original Android badge INP issue and prior public search shift remain unresolved. Raw [baseline](baseline-results.json) / [current](current-results.json) observer entries are included. Playwright traces are retained outside Git at `/home/user/admin-phase-measure/{baseline,current}`; they are interaction traces, not Chrome DevTools CPU profiles. Original trace and physical-device measurements are needed.

## Exact remaining blockers and next steps

1. Confirm the new deployment's exact commit/URL and open it from an authorized device/network; collect hosted console/network status and actual screenshots. The owner has only reported visual access for `a228666`.
2. Establish actual authentication, MFA, server-side RBAC, current membership checks, session management, protected audit, safe role provisioning and direct-RPC denial before exposing privileged information. The [security design](SECURITY_DESIGN.md) and `docs/master-admin-blueprint/` are proposals, not implementations.
3. Agree an isolated test strategy and obtain explicit approval for any shared-project mutation. Use existing project branching only if supported and approved; no new project or subscription change is authorized. Preserve guest RLS; incomplete SQL review drafts are not deployment-ready.
4. Build real user management; durable bio drafts/revision/review/CRUD, bulk jobs and publication; category/collection, platform and generator administration; full page/SEO management; genuine analytics, reports/export; audit/session UI and provider-backed settings/backup. Add real list loading, errors, cursor pagination and authorization tests with each service. No UI control should claim success until the backend confirms it.
5. Investigate long tasks using real Chrome performance profiles and actual Android hardware, test all modules and tools on realistic networks, and measure real-user p75 with approved telemetry before asserting performance thresholds. Re-run public/guest regression and obtain owner approval before any Production release.

## Reproduction

Build `VERCEL_ENV=preview VERCEL_GIT_COMMIT_REF=arena/5e351ec3-biocraft npm run build`; run `npm run preview -- --host 0.0.0.0 --port 4178 --strictPort` with the same environment. Set `BROWSER_EXECUTABLE_PATH` for Chromium and run `npm run test:admin-phase`, `test:admin-browser`, `test:admin-catalog`, `test:admin-interactions` and `test:admin-lazy-error`. `CAPTURE_DIR` controls screenshots. The public comparison requires an `a228666` baseline server via `BASELINE_URL`. For traces, set `AUDIT_BASE` and distinct `AUDIT_DIR` values and run `npm run test:admin-performance` sequentially for each build. Do not run these tests against a privileged or real service without permission.
