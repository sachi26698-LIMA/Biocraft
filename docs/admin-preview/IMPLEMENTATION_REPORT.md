# BioCraft Admin Preview — implementation and security report

## Status and scope

This is a branch-gated **public-data workspace preview**, not a complete or authenticated Master Admin Panel. It does not communicate with an admin API, Supabase Auth, or the database. No administrator, server-side privilege, account, telemetry source, content publication or deployed admin backend exists. Guest website remains separate. Static build gating and noindex are not authorization; nothing sensitive is placed behind them.

The `/admin` shell and its ten routes are compiled only for Vercel Preview for `arena/5e351ec3-biocraft`; production-mode local build contains neither the admin chunk nor static admin shells. `vercel.json` defines targeted admin rewrites and `X-Robots-Tag`, but hosted behavior is unverified until a Vercel deployment is ready and reachable. Local Vite preview resolves noindex shells for known deep links. A separate typed interface (`src/admin/backend.ts`) is fail-closed and has no configured endpoint or client; it is a future integration contract, not authentication.

## Functional now

- Separate responsive shell, navigation and direct links for overview, users, bios, collections, platforms, generators, content, analytics, security and settings; mobile navigation closes on Escape and navigation, light/dark toggle (in-memory only), no public shell wrapping.
- Overview counts and language distribution are computed from bundled public app registries. They are labeled as **bundled**, not live database metrics. No visitor or usage statistics are fabricated.
- Bio library searches bundled text/plain twins and collection names, filters English/Hindi/Hinglish and paginates ten rows at a time. It does not expose inactive live data or mutate records. Collections, eight independent platform configurations and twelve actual tools have functioning searches and read-only views. Platform limits are application settings, not verified current external platform policy.
- Users, content/SEO, analytics, security and settings routes clearly disclose missing backend. No fake login, chart, edit, export, backup or publish controls are presented.
- Desktop, tablet and mobile screenshots in this directory are genuine local headless Chromium captures, not hosted or physical-device evidence.

## Not implemented / release blockers

A complete panel requires an explicitly authorized **isolated backend**, secure server-verified sessions and MFA, server-side RBAC, provisioning and recovery, audit/error logging and protected access, actual live user and bio CRUD, search and filters at scale, bulk import/export, duplicate detection, drafts/review/publish/rollback, category/platform/tool/settings editing and public consumers, SEO build/deployment, real data analytics and privacy policy, health, backup, cache and monitoring integrations. These controls are **not functional or connected**. The typed interface does not enforce authorization. Production roles and data are unchanged. Approval of UI architecture does not authorize a Supabase project, backend changes or administrator privileges.

`docs/master-admin-blueprint/MIGRATION_MANIFEST.md` records the two review-only SQL drafts and explicitly lists missing migrations. They are not complete, are not final, and must not be applied to the shared database. The app does not use them.

## Evidence

- Local headless Chromium: direct navigation through all ten `/admin` routes at 1440×900, 820×1100 and 390×844; clean shell, correct noindex metadata for tested routes, no browser page errors, no admin/Supabase requests in this unconfigured local build. Search, language filtering, next page, platform/tool/collection search, dark toggle, mobile navigation and returning to public homepage passed. No overall document horizontal overflow in those three overview views. The tests use desktop Chromium viewport emulation, not physical devices.
- axe-core checks for nine non-overview routes in light and dark modes across three viewports passed the selected WCAG 2 A/AA and 2.1 A/AA automated rules; overview was separately checked in light/dark at 1440 and 390. Automated axe is not a full accessibility audit or screen-reader validation.
- `npm run test:admin-blueprint` and `test:admin-draft` pass local PGlite/mock fixtures only. `test:collections`, `test:diagnostics`, `test:generation`, `test:performance`, `test:review` (287/287) and Preview/Production-mode local builds passed. The review harness emitted existing `import.meta` and React `act` warnings; initial run exposed an undefined build constant in the test harness, which was fixed and retested.
- Local 4× CPU-throttled Chromium navigation of `/admin/bios` recorded initial long tasks of up to 266 ms, 224 ms and 237 ms at 390, 820 and 1440 widths respectively. Approximate automation-based search elapsed 181–218 ms in these single runs; it is not INP or field data. Long tasks remain and performance targets are **not** verified. No physical Android, real-user p75 INP/LCP/CLS or hosted browser test was performed.
- `npm audit` reported one moderate and one high issue after dependency installation; no forced major upgrade was applied. No independent security audit was performed.

## Security and operations

No admin client or service role credential is used. The workspace is intentionally unauthenticated because it only displays data already bundled in the public site; anyone able to reach the Preview can see it. **Do not connect privileged endpoints or data until server-side authentication/authorization and isolation are implemented and tested.** Existing guest RLS and database permissions were not modified. Browser checks cannot establish real JWT, MFA, server authorization, audit integrity, PostgREST or Supabase connectivity. Hosted Preview protection, noindex headers/rewrites, isolated backend and network behavior remain unverified.

Reproduce browser tests after building with `VERCEL_ENV=preview VERCEL_GIT_COMMIT_REF=arena/5e351ec3-biocraft npm run build`, starting `npm run preview -- --host 0.0.0.0 --port 4178 --strictPort`, then setting `BROWSER_EXECUTABLE_PATH` to an installed Chromium binary and running `npm run test:admin-browser`. Set `CAPTURE_DIR` only when screenshot capture is desired. `ADMIN_BASE_URL` changes the target; do not point this test at a live service without permission.
