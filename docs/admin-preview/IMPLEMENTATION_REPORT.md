# BioCraft Admin Preview — local audit and implementation report

## Verdict and scope

**Hosted verification blocked; performance and security approval withheld.** This is an unauthenticated, read-only preview of *bundled public data*, not an operational Master Admin Panel. No admin API, sessions, live user data, privileged actions, analytics, database reads or edits are connected. Noindex or a hidden URL is not access control. Do not connect privileged data until security is implemented and independently tested.

Vercel previously reported deployment `dpl_EFHpUspfmGRew2uZFaxrVAoN71mP` READY, commit `1223f8b2fb91178354c678a847b158e82badb9fa`: [deployment /admin](https://biocraft-a1rg1pkln-sachi26698-6758s-projects.vercel.app/admin). The branch alias is [here](https://biocraft-git-arena-5e351ec3-biocraft-sachi26698-6758s-projects.vercel.app/admin). A READY build does not demonstrate that a browser can reach the deployment. From this sandbox curl failed TLS (`SSL_ERROR_SYSCALL`) and headless Chromium for Android emulation, tablet and desktop received `net::ERR_CONNECTION_CLOSED` **before any HTTP response**. No hosted screenshot, route, header, asset, database interaction, Android device or field performance check is claimed. Outbound restrictions in this execution environment may be relevant; the actual cause is not established. The report below covers the updated *local branch build*, not that older hosted commit. Deployment of the updated branch must be checked separately.

## Changes made in this audit

- A branch-and-Preview-only independent admin document/entry prevents the admin route from loading public app/CSS. Public `src/App.tsx` was restored to its pre-admin version. Vercel rewrites keep the noindex document on admin deep links; local preview now routes unknown admin paths to the same document instead of the public SPA. Hosted rewrite/header behavior remains unverified.
- Categories now show both actual generator categories and collections with independent search. Existing bios, platforms and tools remain sourced directly from public bundled registries.
- Sticky header, mobile focus containment, Escape/focus return and menu close on desktop resize were added. All actions that require a backend remain unavailable, not faked.

## Local test results

| Area | Result and limit |
|---|---|
| Catalog | **PASS**, every displayed row compared to its source: 506 bios (301 English, 75 Hindi, 130 Hinglish), 20 collections, 12 generator categories, 8 platforms, 12 tools. This is bundled data, not verification of live Supabase rows. Platform limits are app configuration, not independently verified platform policy. |
| Navigation | **PASS**, all 10 sidebar links and current-page state on emulated Android, tablet and desktop; unknown admin path and back link; overview links and all 12 public tool links on desktop. |
| Controls | **PASS**, bio search including no results, all 3 language filters, next/previous pagination, independent collection/category search, platform/tool search, dark/light switch. Theme is in-memory, not persistent. No edit/publish controls exist. |
| Layout and keyboard | **PASS**, sticky header after scrolling in all three viewports; mobile initial focus, Tab wrap, Escape/focus return and resize close. Overview document widths 390/390, 820/820 and 1440/1440; wide tables use their own horizontal scroll regions. Not a full usability or screen-reader audit. |
| Accessibility | **PASS selected automated rules only**, axe WCAG 2/2.1 A/AA on all 10 routes in light/dark at 390×844, 820×1100, 1440×900. Automated checks do not replace human or assistive-technology testing. |
| Local browser/network | **PASS** tested actions: no page/console errors, failed requests, HTTP errors, or admin/Supabase requests in the interaction audit. This does not test a configured hosted guest database or real security. |
| Public regression | **PASS limited comparison**, 48 selected public routes compared against previous admin commit `1223f8b`: equal document titles, descriptions, main H1/H2s and header/footer presence; no page/failed-request errors. This is not proof of pixel equality, SEO or every public interaction. Existing public regression harness also passed 287/287. |
| Local builds/regressions | **PASS** TypeScript, Preview build, Production-mode build, collection, diagnostics, generation, performance, admin blueprint and draft suites. Production-mode output contained no admin shell/entry or identifiable admin asset strings; no Production deployment was made. Blueprint and mock/PGlite results are not real Supabase security validation. |

Genuine *local* headless Chromium screenshots: [desktop](desktop.png), [tablet](tablet.png), [mobile](mobile.png). These are viewport emulations, not photographs or hosted screenshots. `tests/admin-interaction-audit.cjs` uses Playwright's Pixel 5 profile for Android-like mobile emulation; it is still desktop Chromium, not Android Chrome on a physical device.

## Controlled local performance sample — not field metrics

One sequential baseline/current run on local Vite preview, fresh Chromium contexts, 4× CPU throttle, same `/admin/bios` scripted search/filter/pagination/theme interactions, no network throttling. The baseline is `1223f8b`; the current version includes the fixes. Playwright tracing and screenshot capture can perturb paint and timing. Resource transfer below sums browser resource entries (not HTML). LCP is the last observed entry, and the shift sum is only the observed no-recent-input entries, not a complete web-vitals CLS calculation. The Event Timing measurements are discrete scripted events and **not INP or p75**. Single runs vary; no speed guarantee or target pass is implied.

| Viewport | Resource transfer baseline → current | LCP ms baseline → current | Observed shift sum baseline → current | Longest observed task ms baseline → current |
|---|---:|---:|---:|---:|
| Android emulated | 142,244 → 99,413 bytes | 612 → 496 | 0.00033 → 0.00033 | 244 → 233 |
| Tablet | 142,244 → 99,413 bytes | 288 → 440 | 0.01860 → 0.01860 | 224 → 201 |
| Desktop | 142,244 → 99,413 bytes | 324 → 492 | 0.00069 → 0.00069 | 241 → 211 |

Current scripted keydown durations were 88/64/128 ms and two click durations 96/48, 96/64 and 160/88 ms respectively; these are not representative of all interactions or device users. Long tasks well over 50 ms remain. The original physical Android badge interaction (INP 594.6 ms) remains unresolved without the original trace; previous local reproduction did not establish a fix. A prior scripted public collection search observed CLS 0.467. No p75 INP, real-device LCP/CLS, or compliant latency is established.

Raw resource/event/observer entries are in [baseline results](evidence/baseline-results.json) and [current results](evidence/current-results.json). Playwright trace zips and paired screenshots are retained outside Git under `/home/user/admin-audit-evidence/{baseline,current}`; they are local Playwright interaction traces, **not Chrome DevTools CPU profiles**. Reproduce with `AUDIT_BASE`, `AUDIT_DIR` and `BROWSER_EXECUTABLE_PATH` set, then `npm run test:admin-performance` (use a different output directory per build).

## Remaining work and approval gate

1. From an authorized network/browser, open the exact new Preview deployment and record HTTP status, protection, noindex headers, assets, console/network, direct routes and interactions on physical Android, tablet and desktop. Capture actual hosted screenshots. Do not weaken protection to make tests pass.
2. Obtain the original Android performance trace; profile long tasks and repeat traces on real hardware and realistic networks; use appropriate real-user distributions before judging p75. Address public collection layout shift and repeat full regression without deleting functionality.
3. Before privileged work, agree on an isolated test strategy using the existing project and explicitly approve any shared-project changes. Inventory current schema, migrations and guest RLS; security review the incomplete SQL and rollback proposals in `docs/master-admin-blueprint/`. No new project, schema, policies, administrator, account, publication or grant is authorized by this UI audit.
4. Only after approval, implement and independently test server-verified sessions/MFA, least-privilege RBAC and audit, negative/guest RLS cases and recovery before connecting administrative APIs. Then build actual user management; bio CRUD, review/publish/rollback; categories/platform/tool/settings; SEO; real analytics and operations in small auditable increments with provenance and privacy controls. Existing review SQL and local PGlite fixtures are incomplete and must not be applied as a finished system.

No shared Supabase mutations, security policy changes, privileged accounts or Production deployment were performed during this audit. A prior unauthorized shared pagination migration is separately disclosed in the project history and is not undone here. `npm audit` previously reported moderate/high dev-tool advisories; no forced major upgrade was applied.

## Reproduce local functional checks

Build with `VERCEL_ENV=preview VERCEL_GIT_COMMIT_REF=arena/5e351ec3-biocraft npm run build`; serve `npm run preview -- --host 0.0.0.0 --port 4178 --strictPort` with the same environment. Set `BROWSER_EXECUTABLE_PATH` and run `npm run test:admin-browser`, `test:admin-interactions` and `test:admin-catalog`; optionally set `CAPTURE_DIR`. `test:admin-public-regression` additionally needs the baseline built and served at port 4181 (or `BASELINE_URL`). Do not target real services without permission.
