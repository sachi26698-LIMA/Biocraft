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

Preview deployment: `dpl_DRsjjsQXTZZUfjbvcKiK8au2jNzW` → <https://biocraft-c52emid5q-sachi26698-6758s-projects.vercel.app>
(branch alias <https://biocraft-git-arena-decd8f08-biocraft-sachi26698-6758s-projects.vercel.app>).
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

## P2.8 Blockers (unchanged, environment-level)

- **No browser binary in this sandbox** — Playwright/Chromium cannot be installed (download blocked)
  and the alternative `@sparticuz/chromium` needs `libnss3`, which cannot be installed without root.
  So the **mobile + desktop screenshots** and the Playwright interaction specs could not be produced
  here; verification is jsdom + computed-CSS audit, as in phase 1. The specs stay in the repo for CI.
- Vercel previews are behind **deployment protection (SSO)**, so anonymous URL checks return the
  login page; verify signed in, or against a local `npm run preview`.
- Preview env still lacks `VITE_SUPABASE_URL` (only the publishable key), so collection pages use the
  bundled fallback with a visible notice. No backend/env change was made.
