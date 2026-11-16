# Tools upgrade — progress, evidence and blockers

_written 2026-11-16 for the Phase 5 pass. Every claim below names the command that
produces it. Where something was not verified, it says so and says why._

Runtime commit: **`3be2450`** — deployed and READY, identical to local `HEAD` and to
`origin/arena/5e351ec3-biocraft`. Two later commits add only tests and this
document; no runtime source changed after `3be2450`.

---

## 1. What was fixed in this pass

### 1.1 The LinkedIn tools were unreachable (real, user-visible)

`/linkedin-headline-generator` and `/linkedin-summary-generator` rendered an
**Instagram bio form**. The page `<title>` and the `<h1>` disagreed with each
other, and the actual LinkedIn tool never mounted.

Cause: both tools exist only on the LinkedIn platform. `src/lib/toolkit.tsx`
seeds the initial platform from the route via `DEFAULT_BY_PATH`, which listed the
WhatsApp and Snapchat routes but not these two. A cold visit therefore kept the
Instagram default; `ToolWorkspace` saw that the tool was not in
`config.tools` for Instagram and fell back to `config.tools[0]` — the Bio tool —
while the heading stayed on the LinkedIn title.

Fix: both routes added to `DEFAULT_BY_PATH`. An explicit `?platform=` still wins,
so a shared link behaves as before.

Evidence: `test:tools-browser` asserts the `<h1>` per route; `test:admin-public-regression`
pins the corrected heading. Removing the fix fails both.

### 1.2 Scrolled-to content hid under the sticky header (real, all tools)

The header is sticky, 62px tall at a 0.65rem offset. Only `.toolkit-workspace`
had a `scroll-margin`. Anything else scrolled into view — a result card reached
from the keyboard, a hash target, an in-page jump — settled flush to the viewport
top with its first line underneath the header.

Measured, not estimated: a card scrolled to `block:'start'` was **72px behind the
header** before, and clears it by 16px after a single `scroll-padding-top` on
`html`. Fixing it globally rather than per component means a new component cannot
forget it.

Evidence: `test:tools-browser` asserts clearance on all twelve routes; removing
the rule fails all twelve.

### 1.3 Three Design Studio `<select>` controls rendered 19px tall (real)

The shared form rule was `.field input, .field textarea, .select`. A bare
`<select>` nested inside `.field` matched none of the three selectors, so it fell
back to the browser default: 19px high, below the 24px touch-target minimum and
visually inconsistent with the inputs beside it.

Fix: the rule now matches `.field select` too, with hover and focus states
widened to match. All three now measure 46px.

### 1.4 Emoji fonts named explicitly

Generated bios and captions contain emoji by design. The sans stack relied on
implicit fallback, which only works if the renderer has a colour emoji font at a
level it will actually reach. `Apple Color Emoji`, `Segoe UI Emoji`,
`Noto Color Emoji` and `Android Emoji` are now named. Costs nothing when absent.

---

## 2. Complete tool inventory

Twelve tools, all exercised end-to-end in a real browser by `test:tools-browser`.

| # | Tool | Route | Produces output by | Copy controls |
|---|---|---|---|---|
| 1 | Bio Generator | `/bio-generator` | button | per-bio + regenerate |
| 2 | Stylish Name | `/stylish-name-generator` | live (as you type) | per-style + all |
| 3 | Fancy Fonts | `/fancy-font-generator` | live | per-style + all |
| 4 | Design Studio | `/design-studio` | live | sentence + mixes + all |
| 5 | Username | `/username-generator` | button (name required) | per-handle + all |
| 6 | Symbols | `/emoji-symbol-generator` | live / browse | per-glyph + combos |
| 7 | Hashtags | `/hashtag-generator` | button | per-tag + all |
| 8 | Captions | `/caption-generator` | button | per-caption + all |
| 9 | LinkedIn Headline | `/linkedin-headline-generator` | button (role required) | per-item + all |
| 10 | LinkedIn Summary | `/linkedin-summary-generator` | button (role required) | per-item + all |
| 11 | WhatsApp Status | `/whatsapp-status-generator` | button | per-option + all |
| 12 | Snapchat Caption | `/snapchat-caption-generator` | button | per-option + all |

**Workflows verified per tool:** render (one `<h1>`, panel mounted) · generate or
live-update · copy (clipboard content read back and compared) · copy again (state
machine is not one-shot) · regenerate changes the output.

**Download — public tools: not implemented.** No public tool offers a download
(`grep -rn "createObjectURL\|download=" src/tools/` → nothing). If a download is a
required deliverable for the public tools, it is new feature work, not something
that can be verified as existing.

**Download — Admin console: implemented, and exercised.** `downloadCsv()` in
`src/admin/live/useLive.ts` serialises rows the user is already authorised to read
(no extra permission, no extra round-trip) and is wired to buttons in Analytics,
Content and Library. Verified by `test:admin-browser`: clicking the control
produces a download event with the expected filename and non-empty CSV body.

**Reset: no dedicated control.** No public tool has a Reset/Clear/Start-over
button. Clearing a field returns the tool to its empty state, which the browser
suite covers through the regenerate path. Stated rather than silently omitted.

---

## 3. Test results

Run with `BIOCRAFT_TEST_PG_SOCKET`, `BIOCRAFT_TEST_PG_BIN`, `BASELINE_URL`,
`AUDIT_BASE`, `AUDIT_DIR` and `VERCEL_ENV=preview` set, on a freshly built `dist`.

| Suite set | Result |
|---|---|
| All `test:*` suites | **47 / 47 pass** |
| `test:tools-browser` (new) | **pass** — 12 tools × render/generate/copy/regenerate/mobile |
| `test:admin-csv-export` (new) | **pass** — real download event, 53-byte CSV, correct filename, anchor cleaned up |
| `test:build-admin-entry` (new) | **pass** — build fails loudly if the Preview admin entry is missing |
| Admin browser suites | **10 / 10 pass** |
| `test:admin-public-regression` | **48 / 48 public routes** match baseline |
| `tsc --noEmit` | **pass** |
| Production build | **pass** — 60 route shells |
| `npm audit` | 2 advisories, both dev-only (§5) |

Two suites are one-shot by design and must be told so: `test:admin-postgres`
refuses a cluster it has already consumed (`Error: Cluster is not blank`), and the
real-cluster suites exit with an explicit message when their env vars are unset.
Neither is a flake; both were given a pristine cluster and passed.

### What the browser suites prove, and what they do not

They render the real built app over HTTP with trusted input. They do **not** talk
to a live database: the Admin login and recovery suites intercept `/api/admin/v1/*`
with `page.route`. See §4.

---

## 4. Blockers

### 4.1 Hosted Preview verification — blocked, with cause

```
https://biocraft-git-arena-5e351ec3-biocraft-sachi26698-6758s-projects.vercel.app/admin
  -> 302 to https://vercel.com/login?next=/sso-api?url=...
  -> page title: "Protected Deployment – Vercel"
```

Every path behaves the same, including `/api/admin/v1/health`. The project has
`ssoProtection: {deploymentType: "all_except_custom_domains"}`, set at the account
level. I did not attempt to bypass it, disable it, or fabricate a result. There is
no authenticated browser session available to me.

**What is verified instead:** deployment `dpl_7n3X6zAbdxRdaxfoLDCpJr1mNNWE` reached
`READY` at exactly the local commit, with the branch alias assigned and the
expected build output (60 route shells, admin chunk emitted).

**Manual step for you:** open the Preview URL while signed in to Vercel.

### 4.2 Real Supabase login / TOTP / recovery — blocked, with cause

This sandbox cannot reach Supabase at all. From inside the browser:

```js
await fetch('https://jvpadtzfsuekixrquzjv.supabase.co/auth/v1/health')
// TypeError: Failed to fetch
```

So no password grant, no TOTP challenge, no recovery exchange can be performed
here, regardless of credentials. I did not ask for credentials and would not use
them to bypass this.

**What is verified:** `test:admin-auth-sdk-http` runs the **real** Supabase JS SDK
and asserts the exact HTTP contract the app depends on — `POST /token?grant_type=password`,
`GET /user`, `PUT /user`, `POST /recover`, `POST /verify`,
`POST /factors/{id}/challenge`, `POST /factors/{id}/verify`, `POST /logout` — with
only the transport intercepted. Combined with `test:admin-postgres` against a real
PostgreSQL 18.6 (AAL2 enforcement, step-up freshness, single-use recovery, factor
reset), the server half is exercised. The unverified segment is the network hop
between the hosted console and the live Auth service.

### 4.3 Download / reset workflows — not built

Stated in §2. No tool implements a download. If this is required, it is new
feature work, not a defect I can "verify".

---

## 5. Dependency audit

```
$ npm audit
{ "info": 0, "low": 0, "moderate": 1, "high": 1, "critical": 0, "total": 2 }

esbuild  moderate  dev-server request handling + response disclosure
vite     high      optimized-deps .map path traversal; launch-editor UNC (Windows)
```

Both are `devDependencies`. Confirmed not reachable in the shipped product:

- neither appears in `dist/` (`grep -rl "launchEditor" dist/` → nothing)
- no serverless function imports them (`api/admin/handler.mjs` does not)
- `scripts/seed-supabase.mjs` imports `esbuild`, but it is an offline script, not
  part of the deployment

The fix is a **major** bump (vite 5.4 → 8.x, `isSemVerMajor: true`). That is a
breaking change to the build toolchain and would need its own verification cycle;
it is deliberately **not** bundled into a bug-fix pass. Tracked, not fixed.

---

## 6. Performance

`test:admin-performance` against the local production build, `/admin/bios`, 4×
CPU throttle.

| Device | DCL | LCP | CLS | INP | Long tasks |
|---|---|---|---|---|---|
| Android emulated | 89 ms | 296 ms | 0.0001 | 48 ms | 0 |
| Tablet | 93 ms | 328 ms | 0.0008 | 56 ms | 0 |
| Desktop | 85 ms | 316 ms | 0.0006 | 64 ms | 0 |

All three inside the "good" band for every Core Web Vital (LCP < 2500 ms,
CLS < 0.1, INP < 200 ms), with no long task over 50 ms.

---

## 7. Android mobile screenshots

`docs/evidence/android/` — Pixel 5 profile (393×727 css, DPR 2.75), ten screens.

Captured with Roboto and Noto Color Emoji injected, because **this image has no
emoji font and no Roboto at all**. Without them the captures showed tofu boxes and
doubled digit widths, which are artifacts of the capture environment, not the app
— with the real device fonts present both resolve. This is called out because a
screenshot that misrepresents the device is worse than no screenshot.

| File | Screen |
|---|---|
| `01-home.png` | homepage top |
| `02-bio-form.png` | bio form, empty |
| `03-bio-generated.png` | five generated bios |
| `04-design-studio.png` | design studio with a sentence |
| `05-stylish-name.png` | styled name variants |
| `06-linkedin-headline.png` | LinkedIn tool (previously showed the bio form) |
| `07-symbols.png` | symbol grid |
| `08-hashtags.png` | generated hashtags |
| `09-collections.png` | bio collections |
| `10-bio-editor.png` | bio editor |

The platform strip and tool tabs are **horizontal scrollers, not clipped**: 750px
and 1239px of content in a 358px and 329px box, and scrolling to the end brings
the last item fully into view (measured).

---

## 8. Production readiness

| Area | State |
|---|---|
| Public tools | **Ready** — 12/12 verified end-to-end in a browser |
| Public SEO pages | **Ready** — 48/48 match baseline |
| Accessibility | **Ready** — 0 WCAG 2.1 AA violations; 0 controls under 24×24 |
| Performance | **Ready** — all Core Web Vitals good on three device profiles |
| Security surface | **Ready** — audit clean in shipped code; no secret in `dist/` |
| Admin console (rendered) | **Ready** — 10/10 browser suites |
| Admin console (hosted, live DB) | **Not verified** — §4.1, §4.2 |
| Dependency advisories | **Accepted** — dev-only, major-version fix deferred |

**Not 100% complete.** Two items are blocked on network access I do not have, not
on missing work: hosted Preview verification and live Supabase authentication.
Both are one manual sign-in away from being closed by you, and neither is a defect
I have found in the code.

Production was not touched: `biocraft-bice.vercel.app` is unchanged, no Production
deployment was created, no shared database migration was applied, and no public
content, SEO page, guest permission or production row was modified in this pass.
