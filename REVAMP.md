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
