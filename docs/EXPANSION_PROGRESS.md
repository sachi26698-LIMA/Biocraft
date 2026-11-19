# BioCraft — Ecosystem Expansion Progress

Living status report. Updated at the end of every completed stage, so the running
state of the work is always visible instead of living in a chat log.

Branch: `arena/d71d06a9-biocraft` (from `main` @ `e4b8cd1`).

---

## Stage 1 — Audit · COMPLETE

`docs/ECOSYSTEM_AUDIT.md`. Real inventory before any change: 11 pages, 51 route
shells, 12 working tools, 17 Admin live modules, bundled content counts, and 12
identified gaps (no colour palettes, no icons, no quotes/poetry, no business
studio, no dev text utilities, no tool taxonomy, no favourites/history/bulk
export, no language registry/RTL, flat search).

## Stage 2 — Licensed data architecture · COMPLETE

`docs/STAGE_2_LICENSED_DATA.md`.

| Library | Licence | Real records |
|---|---|---|
| Named colours (`color-name-list`) | MIT | 32,004 |
| Emoji (`unicode-emoji-json`) | MIT | 1,914 |
| Brand icons (`simple-icons`) | CC0-1.0 | 3,472 |

**37,390 real, deduplicated, licence-checked records.** Generated deterministically
by `scripts/build-ecosystem-data.mjs`; `npm run test:ecosystem-data` fails the
build if the checked-in data drifts from what the generator produces.

Licence policy: the same conservative allow-list as `scripts/import-library.mjs`.
CC-BY-SA, CC-BY-NC, GPL, AGPL and MPL are excluded and the exclusion is recorded
in `src/data/licenses.ts` — auditable, not a promise.

Two new tools shipped: **Colour Palette Generator** (32,004-name search, 6 harmony
types, HEX/RGB/HSL/OKLCH, WCAG contrast, tonal ramps, nearest names, CSS/Tailwind
export) and **Icon Finder** (3,472 icons, search, copy SVG, download `.svg`,
monochrome `currentColor` mode).

Bundle discipline after production build: app shell **108 KB gzip** (unchanged);
icon chunk 1.96 MB gzip and palette chunk 321 KB gzip load only when opened.

Bug fixed: `rgbToHsl` quantised to 1 decimal place, so `hex → HSL → hex` returned a
different colour for 205 of 500 sampled values. Math is now full precision; display
rounding moved to `formatHsl`/`formatOklch`.

## Stage 3 — Text utilities · COMPLETE

New **`/text-toolkit`** route.

- Live stats: characters, characters without spaces, words, unique words,
  sentences, paragraphs, lines, reading time (200 wpm), longest word.
- 10 case formats: UPPERCASE, lowercase, Title Case (with small-word rules),
  Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE,
  URL slug.
- 8 cleaning operations: collapse spaces, trim lines, remove blank lines,
  deduplicate lines, natural A→Z / Z→A sort, reverse lines, grapheme-safe reverse.
- 5 extractors: emails, links, hashtags, @mentions, numbers.
- Chained editing with an unlimited undo stack, copy and download.

Bug fixed: hashtag/@mention extraction used `\p{L}` only, which excludes combining
marks — `#यात्रा` was truncated to `#य`. Extraction and word splitting are now
mark-aware (`\p{M}`) and ZWJ/ZWNJ aware.

---

## Running totals

| Metric | Before this work | Now |
|---|---|---|
| Public tools | 12 | **15** |
| Route shells | 51 | **54** |
| Bundled licensed records (new) | 0 | **37,390** |
| Automated test assertions (new) | 0 | **113** |
| App shell size (gzip) | 108 KB | **108 KB** |

## Verification at the end of Stage 3

| Command | Result |
|---|---|
| `npm run typecheck` | pass |
| `npm run build` | pass — 54 route shells |
| `npm run test:ecosystem` | 59 assertions |
| `npm run test:text-ops` | 54 assertions |
| `npm run test:ecosystem-data` | data reproducible |
| `npm run test:local-first` | 7 pages, 0 network calls |
| `npm run test:collections` | 506 bios / 20 collections |
| `npm run test:generation` | pass |
| `npm run test:performance` | pass |
| `npm run test:public-content-status` | pass |
| `npm run test:library` | 24 checks |

## Still open (later stages)

- Quotes / poetry / wishes libraries — needs verified sources; no fabricated
  quotations. Not started: shipping an unattributed quote library would break the
  attribution rule, so this needs a properly licensed corpus first.
- Business / slogan / marketing studios: rule-based generation, no fake AI.
- Tool taxonomy beyond a flat 15-entry list; category metadata currently has 6
  categories and needs to cover new tools.
- Language registry with real RTL support (`en|hi|hg` only today).
- Cross-tool favourites / history / bulk export.
- Search facets (tag, platform, tone) — global search is still a flat index.
- Admin catalog wiring for the new libraries.
- Production deployment and post-deploy verification.
