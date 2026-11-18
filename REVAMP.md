# BioCraft frontend revamp — implementation report

Branch: `arena/decd8f08-biocraft` (preview only — no production-impacting change was made).

## 1. Route & feature inventory (audited, all preserved)

| Area | Routes | State |
| --- | --- | --- |
| Home / toolkit | `/` | kept, toolkit-first shell |
| 12 tools | `/bio-generator`, `/stylish-name-generator`, `/fancy-font-generator`, `/design-studio`, `/username-generator`, `/emoji-symbol-generator`, `/hashtag-generator`, `/caption-generator`, `/linkedin-headline-generator`, `/linkedin-summary-generator`, `/whatsapp-status-generator`, `/snapchat-caption-generator` | kept, each with its own skeleton + disclosure layout |
| Discovery | `/categories`, `/resources`, `/features`, `/bio-collections` | kept |
| Collections | 30+ `/<collection-slug>` shells | kept, plus honest live-sync state |
| Editor | `/bio-editor` | kept, advanced styling moved into a labelled accordion |
| Info | `/about`, `/privacy`, `/terms`, `/cookie`, `/pricing`, `/help`, `/blog`, `/use-cases`, `/contact`, `/login` | kept |
| Diagnostics | `/preview-diagnostics` (preview builds only) | kept |

## 2. What changed

### Skeleton system (new)
- `src/components/skeleton/Skeleton.tsx` — 12 primitives (`SkeletonBlock`, `Line`, `Avatar`, `Input`,
  `Textarea`, `Button`, `Chip`, `Card`, `ChipRow`, `CellGrid`, `Rows`) plus the accessible
  `SkeletonRegion` wrapper (`role="status"`, one spoken label, all blocks `aria-hidden`).
- `src/components/skeleton/toolSkeletons.tsx` — 23 compositions:
  - 12 tool skeletons (bio, stylish name, fancy fonts, design studio, username, symbols, hashtags,
    captions, LinkedIn headline, LinkedIn summary, WhatsApp status, Snapchat caption),
  - generating states (`BioGeneratingSkeleton`, `MoodGeneratingSkeleton`),
  - page skeletons (`HomeSkeleton`, `CategoriesSkeleton`, `CollectionsIndexSkeleton`,
    `CollectionDetailSkeleton`, `BioEditorSkeleton`, `FeaturesSkeleton`, `InfoSkeleton`,
    `WorkspaceSkeleton`, `AdminSkeleton`),
  - `TOOL_SKELETONS` registry — no generic fallback exists.
- Wired to genuine loading only:
  - `ToolWorkspace` Suspense (lazy tool chunk per tool),
  - `ToolShell` `DeferredPage` (lazy page chunk, skeleton chosen per route),
  - `BioTool` async generation (first run only; regenerating keeps old results, no flicker),
  - `BioCollectionPage` live Supabase fetch (`aria-busy` + honest "Checking the live library…"),
  - `PlatformStage` laptop-screen mock chunk.
- 0 timers, 0 artificial delays. Reduced motion disables the pulse. Geometry is reserved so the
  swap is CLS-free.

### Disclosure & controls (new)
- `src/components/ui/Accordion.tsx` — button + `aria-expanded`/`aria-controls`, labelled `region`
  panel, Escape collapses, content unmounted while closed, h2 by default (no heading skips).
- `src/components/ui/Dropdown.tsx` — `aria-haspopup="menu"`, arrow/Home/End/Escape/type-ahead,
  outside-click close, focus return, viewport-safe width.
- `src/components/ui/AdvancedOptions.tsx` — replaces the old `display:none` advanced groups.
  Basic mode keeps the section *visible and collapsed* with an honest note + one-tap switch.
- `src/components/ui/States.tsx` — shared `EmptyState`, `ErrorState` (retry), `SuccessNote`.
- Applied per tool: Bio (language/style + count), Captions (language, emoji, CTA, frame),
  Hashtags (language, count, keywords), Username (vibe, length), LinkedIn headline/summary
  (focus, years), Design Studio (styling selects, ready-made mixes always visible),
  WhatsApp/Snapchat mood board (language, emoji, count), Symbol studio (combos + categories always
  visible), Bio Editor (styling & dividers), plus a real sort dropdown on `/categories`.

### Mobile-first layout (`src/revamp.css`, new layer after `index.css` + `upgrade.css`)
- Platform selector: 4-column grid at 320–899px, 8-column from 900px, `min-width: 0` pills,
  ≥44px targets, accessible names, arrow-key navigation. No clipped cards, no page scroll.
- Chip rows, tool tabs, BioCraft quick-jump nav now wrap instead of clipping.
- Global overflow guards (`overflow-x: clip`, `min-width: 0` grids), `overflow-wrap` on text.
- Responsive type scale for workspace/section/info/feature headings.
- 16px inputs on phones (stops iOS zoom) + `scroll-margin` so the sticky header/keyboard never
  covers a focused field.
- Mobile menu sheet capped to the viewport, scrolls internally, safe-area aware, focuses the first
  destination on open and returns focus to the toggle.
- Results action rows wrap; primary buttons go full-width on phones.
- Coarse-pointer rule enforces 44px targets for chips, tabs, segmented controls, copy buttons.

## 3. Performance (production build, gzip)

| Asset | Before | After | Delta |
| --- | --- | --- | --- |
| Entry JS | 102.4 kB | 106.7 kB | +4.3 kB (+4.2%) |
| CSS | 23.2 kB | 26.0 kB | +2.8 kB (+12%) |
| Total JS (all chunks) | 279.4 kB | 282.9 kB | +3.5 kB (+1.3%) |
| Chunks emitted | 35 | 37 | +2 (shared UI primitives stay split) |

Tool and page code stays lazily split (12 tool chunks, page chunks), so the added UI code is paid
once and skeletons arrive with the existing route chunks. No new network requests, images or fonts.

## 4. Tests

- `npm run typecheck` — pass
- `npm run build` (tsc + vite + 48 route shells) — pass
- `npm run test:regression` — 331/331 checks (includes axe on every route, keyboard nav, copy,
  download, validation, mode persistence)
- `npm run test:revamp` (new) — 33/33 checks (skeleton aria/geometry/registry, accordion contract,
  dropdown keyboard contract, AdvancedOptions disclosure)
- `npm run test:collections`, `test:generation`, `test:performance` — pass
- `npm run test:responsive` — all breakpoint cascade expectations pass, now including revamp rules
  (platform grid 4-up/8-up, wrapping chip/tab rows, 52px disclosure targets)
- `dist` served locally: every audited route returns 200 with its own pre-rendered title/metadata

## 5. Blockers / environment notes

1. **Playwright browser suite could not run**: no Chromium in the sandbox and
   `npx playwright install` cannot reach the download host. Coverage was replaced with the jsdom
   suites above + the static responsive audit.
2. **Vercel preview is READY but behind deployment protection (SSO)** — opening the URL while
   signed in to Vercel works; the anonymous check returns Vercel's login page, so the deployed
   build could not be verified anonymously.
3. **Live Supabase collection fetch on this preview**: the deployment build exposed
   `VITE_SUPABASE_PUBLISHABLE_KEY` but not `VITE_SUPABASE_URL` (that variable is branch-scoped to a
   different branch in the Vercel project). The page detects the missing config and falls back to
   the bundled collection with a visible, honest notice — no backend, RLS or data change was made.
4. Dark mode remains optional (light is default); no branding, route, tool or feature was removed.

---

# Phase 2 — Ready-Made Bios experience + navigation & IA upgrade

Commit: `1ae77b5` · branch `arena/decd8f08-biocraft` · preview only (production untouched).

Preview deployments (commit `1ae77b5`, then `b047b59`):
<https://biocraft-c52emid5q-sachi26698-6758s-projects.vercel.app> ·
<https://biocraft-kahisvwyi-sachi26698-6758s-projects.vercel.app> (`dpl_3SYDJ9bTP92RzY6wdXfmPZ3RYWCw`, newest).
The branch alias <https://biocraft-git-arena-decd8f08-biocraft-sachi26698-6758s-projects.vercel.app>
always points at the latest build of this branch — use it, not a per-deployment URL.
Local equivalent: `npm run preview` (verified on port 4180 — `/`, `/bio-collections/`, `/bio-library/`,
`/bio-library/?category=boys`, `/bio-editor/`, `/instagram-bio-for-boys/`, `/categories/`, `/resources/`
all return their own 200 shell; unknown paths fall back to the SPA and redirect home).

## P2.1 What shipped

| Surface | Route | What it is now |
| --- | --- | --- |
| Ready-Made Bios hub | `/bio-collections` (URL preserved) | Premium discovery: header with derived totals, search, View All, featured collections, 15 popular categories, recently added, popular designs, platform cards, language cards, every collection, generator CTA |
| Bio Library (new) | `/bio-library` | Complete library: search + category/platform/language/design/collection facets + 4 sorts + load-more (36/page) + empty state + reset, all mirrored in the URL |
| Homepage | `/` | Re-ordered: hero → generator → quick platform pick → popular tools → featured Ready-Made Bios (with collapsible recent/designs/languages) → favourites → niche chips → FAQ |
| Search overlay | global | Now indexes tools, platforms, the library, all 20 collections and all 15 categories, capped at 12 results + “Search all 506 bios for …” |
| Footer | global | New **Ready-Made Bios** column (hub, library, editor, design studio); existing columns untouched |
| Mobile menu | global | Featured Ready-Made Bios band with direct hub + library links (menu destinations unchanged) |

Supporting library: `src/lib/readyMadeBios.ts` — a derived discovery layer over the real registry
(facets, a flat 506-row index, querying/sorting, stats). Nothing is hard-coded: the numbers on every
surface are computed at module load from `bioCollections.ts`.

## P2.2 Real data (verified programmatically, not typed by hand)

| Metric | Value | Source |
| --- | --- | --- |
| Bios | **506** | `TOTAL_BIOS` = sum of collection bios, and `LIBRARY_TOTAL` (guard `LIBRARY_MATCHES_REGISTRY`) |
| Collections | **20** | registry; 20–30 bios each |
| Categories | **15** | one category per collection → category counts sum to exactly 506 |
| Languages | **3** | English 301 · Hinglish 130 · हिन्दी 75 |
| Platforms | **2** with bundled content | Instagram 482 · Facebook 24 (other platforms link to the live generator with their real limits) |
| Designs | **17** in use (18 defined) | design facets with ≥1 bio |
| Updated | `November 2026` | real registry metadata, drives the “newest” sort |

## P2.3 Navigation, routing & scroll

- **Routes** 49 built shells (was 48): `/bio-library` added to `scripts/build-shells.mjs`
  (title/description/OG) and to the router; `tests/e2e/phase4.mobile.spec.ts` updated to 49.
- **Direct, route-based links only** — no homepage-anchor detours. Collection cards → `/<slug>`;
  category/design/language/platform cards → `/bio-library?<facet>=…`; View All → `/bio-library`;
  Apply (design) → `/bio-editor?design=…`; generators → `/bio-generator?platform=<id>#workspace`.
- **Scroll policy** (`src/lib/router.ts`), one rule per navigation type:
  new page → `#hash` target if present, else top; same page + new hash → that section;
  same page + query/filter change → scroll untouched (no jumping while filtering);
  Back/Forward → same as a new page. `history.scrollRestoration = 'manual'`, so the browser never
  restores a stale offset; `ToolShell`'s `ReadyPage` re-lands on the hash after the lazy chunk mounts
  and falls back to the top if the target does not exist.
- **In-app 404s** still fall back to `/` via the existing guard, which now also recognises `/bio-library`.

## P2.4 Mobile-first layout

Every new grid is mobile-first and audited by computed CSS across 320/360/375/390/412/430/600/768/1024/1280/1440:

| Grid | 320 | 640 | 1080+ |
| --- | --- | --- | --- |
| Collection cards | 1 column | 2 | 3 |
| Category selectors | 1 column (<340) | 2 | 3 → 5 at 1080 |
| Library bio cards | 1 column | 2 | 3 |
| Library facets | 1 | 2 (≥420) | 3 → 6 at 1200 |
| Platform quick-pick | 2 | 4 | 8 |
| Homepage tool grid | 1 | 2 | 3 |

No horizontal scrolling: every card uses `min-width: 0`, `overflow-wrap: anywhere`, wrapping action
rows, and platform CTAs hide below 420 px instead of overflowing. All controls are ≥34 px tall
(44 px for primary buttons and nav), and headings use `clamp()` so they never dwarf a phone.

## P2.5 Skeletons (real dimensions, no fake delays)

- `CollectionsIndexSkeleton` rewritten to mirror the new hub: hero lines + 4 stat blocks, search row,
  featured two-up cards, chip row, collection grid.
- `BioLibrarySkeleton` (new): hero lines + 3 stats, search, 6 facet blocks, 6 bio cards in the real
  1/2/3-column rhythm.
- Both are only `Suspense` fallbacks for the real lazy chunks; no timers anywhere.

## P2.6 Tests

| Suite | Result |
| --- | --- |
| `tsc --noEmit` | clean |
| `npm run build` | OK — 49 route shells |
| `npm run test:review` | **347/347** (incl. 14 new Ready-Made route checks, 0 axe violations on `/bio-collections` and `/bio-library`) |
| `npm run test:ready-made` (new) | **78/78** |
| `npm run test:revamp` | 33/33 |
| `npm run test:responsive` | all cascade expectations hold (incl. 6 new grids) |
| `npm run test:generation` | 3/3 |
| `npm run test:collections` | 4/4 |
| `npm run test:performance` | 3/3 |

`tests/ready-made-ui.cjs` is jsdom + React and runs against the real registry: registry integrity
(506 unique ids, facets partition exactly), query-param parsing/serialisation, every filter and sort
on real bios, hub rendering and every one of its destinations, hub search, library paging/load-more,
deep links (`?category=`, `?lang=`, `?design=`, `?q=`), the empty state + both reset paths, the
homepage block and its collapsed-by-default rails, and the scroll/navigation policy.

**Link audit:** `scripts`-level crawl of `src/` for internal `href`s resolved 36 distinct targets — all
real routes. The only non-route strings are template literals (`/${slug}`), admin routes (flag-gated,
out of public scope) and static assets in `public/`. The hub/library destinations are additionally
asserted per card in both new suites.

## P2.7 Performance (production build, gzip)

| Asset | Phase 1 | Phase 2 | Δ |
| --- | --- | --- | --- |
| CSS | 26.0 kB | 29.4 kB | +3.4 kB (all new UI) |
| Entry JS | 106.7 kB | 110.1 kB | +3.4 kB |
| Total JS | 282.9 kB | 286.7 kB | +3.8 kB |
| Library route chunk | — | 2.5 kB | lazy, only on `/bio-library` |
| Hub route chunk | — | 3.1 kB | lazy, only on `/bio-collections` |

The 506-bio index is built once at module load (~1 ms) and re-used by search/facets, so typing in the
library never re-flattens the registry; results are paginated at 36 cards and `useDeferredValue`
keeps typing responsive. Header/footer intentionally do **not** import the data layer, so the new
surfaces cost nothing on tool pages.

## P2.8 Homepage trim (follow-up, commit `4d676f6`)

Per review feedback the two added homepage bands were removed again:

- **Quick platform picker** (8 platform pills) — removed. Platform selection stays where it belongs:
  the 3D platform stage at the top and the platform pills inside the generator workspace.
- **Popular tools band** (6 tool cards + “All 12 tools”) — removed. Every tool remains reachable from
  the header (Explore Tools → `/resources`), `/categories`, the footer's All Tools column and search.

Homepage order is now: hero / platform stage → generator → **Featured Ready-Made Bios** →
Favourites (only when pinned) → niche chips → FAQ → footer. Their dead CSS and the matching
`responsive-audit` expectations were deleted too (no orphan rules, no stale tests).

## P2.9 Mobile menu polish (follow-up, commit `d06b616`)

- Removed the “Menu — quick jump” eyebrow (and its dot marker CSS).
- Replaced the bespoke **Ready-Made Bios feature band** with a normal menu row: same 44 px 3D tile,
  label, chevron, hover and active treatment as every other destination. It sits right after Home and
  shows active on `/bio-collections` and `/bio-library`. One row, one link — the library is one tap
  from the hub.
- The sheet is now eight uniform rows (`Home · Ready-Made Bios · All Tools · Categories · Features ·
  About · Help · Favourite Tools`) plus the Explore Tools CTA; the cap was raised to `76vh` so it
  still fits without clipping, and the band/eyebrow CSS was deleted rather than left orphaned.

## P3. Homepage design pass (commit `a301d2c`)

The homepage was carrying everything that had ever been requested. It is now four purposeful
sections, each earning its height:

### Kept
| Section | Why it stays |
| --- | --- |
| ~~Hero~~ (**removed again in P3.2**) | A visible `h1`, one sentence, two actions and three proof points lived here for one commit. The product owner rejected it on sight, so the laptop stage leads the page again. |
| **Platform stage** | The laptop is the brand and the live screen re-themes with the selected platform. |
| **Generator workspace** | The primary action — platform pills, tool tabs, form, results. |
| **Ready-Made Bios** | Six featured collections + the real category chips (with counts) + a route to the hub. |
| **Favourites** | Only renders when the visitor has pinned a tool; per-device, honest. |
| **FAQ** | Seven answers that also serve as internal links; now two columns from 980 px. |

### Removed
| Removed | Reason |
| --- | --- |
| 3 secondary rails inside the Ready-Made block (recently added, designs, languages/platforms) | Duplicated `/bio-collections` one click away; made the homepage long without adding a choice. |
| 12-chip “Jump Straight Into a Niche” wall | A second chip taxonomy next to the bio categories; the generator already has its own category picker and `?tab=category=` deep links still work. |
| “Quick platform pick” + “Popular tools” (earlier turn) | Duplicated the workspace pills and the header/footer tool listings. |

Cleanup: dead CSS for the removed blocks (`.chip-cloud`, `.section-sub-link`, `.rmb-home-secondary`,
`.rmb-home-rail*`, `.rmb-home-design*`, `.rmb-home-facets*`), and the responsive-audit expectations
that referenced them. Homepage CSS/JS is slightly smaller than before the pass
(CSS 29.4 → 29.0 kB gzip, total JS 286.7 → 285.2 kB gzip, homepage chunk 6.3 → 5.4 kB).

## P3.2 Hero removal — the stage leads again (this commit)

The hero introduced in `a301d2c` was rejected as soon as it was on screen: a homepage that opens with a
laptop should open with the laptop. The block was deleted rather than restyled.

- **Deleted from `src/pages/HomePage.tsx`**: `section.home-hero` and everything in it — the eyebrow
  (“Free forever · no sign-up · nothing uploaded”), the visible `h1`, the positioning paragraph, both
  `btn-large` actions (“Write my bio”, “Browse 506 ready-made bios”) and the proof-points row
  (“12 tools · 506 copy-ready bios · Runs in your browser”). The `READY_MADE_STATS` import went with
  them; `TOOLS` and `handleAnchorClick` stay because favourites and the FAQ still use them.
- **Accessibility unchanged**: `<h1 className="sr-only">BioCraft — All-in-One Social Media Toolkit</h1>`
  replaces it, so the page still has exactly one `h1`, in document order before the first `h2`, it is
  just invisible again. Axe: 0 violations on `/`.
- **Deleted from `src/revamp.css`**: the whole `.home-hero*` set (`.home-hero`, `-inner`, `-eyebrow`,
  `-title`, `-sub`, `-actions` + its 560 px media query, `-facts`, `-facts > span[aria-hidden]`).
  Section 15 is now “Homepage rhythm” and keeps only the `.home-shell > .section` / `.rmb-home`
  spacing and the two-column FAQ grid, plus one new rule:
  `.home-shell > .platform-stage { padding-top: clamp(0.85rem, 2.4vw, 1.5rem) }` — the gap under the
  floating header pill, so the lid never touches it and no blank band replaces the text.
- **Unchanged**: the laptop (same photoreal chassis, live platform screen, clock, parallax), the
  starfield background, platform pills, generator workspace, Ready-Made Bios, favourites, FAQ, footer.
- **Tests**: `review-check.cjs` drops “hero leads with a real headline…”, “hero actions point at…”
  and the `homepage hero` marker; it adds “no hero copy sits above the laptop stage” and “the stage is
  the first section in the homepage shell”, and the order check is now six landmarks
  (header → stage → workspace → Ready-Made Bios → FAQ → footer). 352/352.

Size: CSS 29.0 → 28.1 kB gzip, total JS 285.2 → 278.4 kB, `HomePage` chunk 5.4 → 5.1 kB.

## P3.4 Merge, review and deployment

- Branch rebased onto `main` (`3f66eb7` → merge commit `6089028`) so the PR is mergeable. Main had
  replaced the fixed 5/10/20 presets with the configurable `CountControl`; the three conflicting files
  keep both sides — the revamp's `AdvancedOptions`, skeletons and `EmptyState`, with main's
  `CountControl` mounted inside the advanced panel.
- Build fix `7f944f1`: main's `vite.config.ts` guard demanded both public Supabase variables, but the
  Vercel **Preview** scope defines only the publishable key, so every Preview build died at
  “failed to load config”. The guard now validates the key against the public `SUPABASE_URL` constant
  when the URL is unset — the same rule the runtime client already applied. A wrong URL, a foreign
  anon key, a service key and a `postgres://` string still abort the build.
- Pull request: **#14** → https://github.com/sachi26698-LIMA/Biocraft/pull/14 (mergeable)
- Latest Preview (READY, sha `7f944f1`): `dpl_47z1fMELXV1dV83ryJRzKa3eXz6r` →
  https://biocraft-git-arena-decd8f08-biocraft-sachi26698-6758s-projects.vercel.app
- `Workers Builds: biocraft` (Cloudflare) fails on this PR exactly as it does on merged PRs #12/#13 —
  pre-existing, unrelated to this branch. Production was never redeployed by this work.

## P3.3 Blockers (environment-level)

- **No browser binary in this sandbox** — Playwright/Chromium cannot be installed (download blocked)
  and the alternative `@sparticuz/chromium` needs `libnss3`, which cannot be installed without root.
  So the **mobile + desktop screenshots** and the Playwright interaction specs could not be produced
  here; verification is jsdom + computed-CSS audit, as in phase 1. The specs stay in the repo for CI.
- Vercel previews are behind **deployment protection (SSO)**, so anonymous URL checks return the
  login page; verify signed in, or against a local `npm run preview`.
- Preview env lacks `VITE_SUPABASE_URL` (only the publishable key), so collection pages use the
  bundled fallback with a visible notice. No backend/env change was made. Main's new `vite.config.ts`
  guard required *both* variables and therefore failed every Preview build at config load; the config
  now validates the key against the public `SUPABASE_URL` constant when the URL is unset (a wrong URL
  or a non-publishable key still aborts the build), which is exactly what the runtime client already
  did. Preview builds succeed again without touching any Vercel environment variable.
