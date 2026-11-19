# Stage 2 — Licensed Data Architecture

Status: **complete for this stage.** Generated from pinned npm packages only; nothing
scraped, nothing invented.

## What was built

A deterministic generator, `scripts/build-ecosystem-data.mjs`, turns the licensed
packages already in `package.json` into bundled TypeScript data. Re-running it
reproduces byte-identical files (`--check` verifies that in CI), so the data can
never silently drift from its source.

| Library | Source | Licence | Records | Output |
|---|---|---|---|---|
| Named colours | `color-name-list@14.86.0` | MIT | **32,004** | `src/data/colors.ts` (960 KB) |
| Emoji | `unicode-emoji-json@0.9.0` | MIT | **1,914** | `src/data/emoji.ts` (66 KB) |
| Brand icons | `simple-icons@16.38.0` | CC0-1.0 | **3,472** | `src/tools/icons/data/simpleIcons.ts` (4.6 MB) |
| Font families | `google-font-metadata@6.0.8` | MIT | 1,908 | already bundled (`src/lib/fontCatalog.ts`) |

**Real imported records this stage: 37,390** (32,004 + 1,914 + 3,472), every one
deduplicated on generation and licence-checked.

### Licence policy

The generator reuses the conservative allow-list from `scripts/import-library.mjs`
(MIT, Apache-2.0, CC0-1.0, CC-BY-4.0/3.0, BSD-3-Clause, ISC, Unlicense, OFL-1.1).
CC-BY-SA, CC-BY-NC, GPL, AGPL and MPL are explicitly **excluded** — shipping them
would change the obligations of the whole application. The exclusions are recorded
in `src/data/licenses.ts` so the decision is auditable rather than a promise.

`src/data/licenses.ts` is the machine-readable provenance register: package,
version, licence, upstream URL, real record count and output file. The test suite
asserts every registry count equals the actual array length, so a licence entry
cannot disagree with the data it describes.

### Code-splitting discipline

The 4.6 MB icon payload is imported *inside* the icon tool's lazy chunk. Measured
after a production build:

- app shell: **338 KB raw / 108 KB gzip** (unchanged by this work)
- icon chunk: 4,634 KB raw / 1,961 KB gzip, loaded only when the Icon Finder opens
- palette chunk: 855 KB raw / 321 KB gzip, loaded only when the palette tool opens
- Features page chunk: 8 KB — it prints library sizes via `LIBRARY_COUNTS` rather
  than importing the data modules

## Two working tools added

### Colour Palette Generator — `/color-palette-generator`

- Search 32,004 named colours by name, exact hex or hex prefix.
- Six harmony types (analogous, complementary, triadic, tetradic, split-complement,
  monochrome), 2–12 colours, deterministic output.
- Live HEX / RGB / HSL / OKLCH values, WCAG contrast against black and white, and
  which text colour is readable on the swatch.
- Ten-step tonal ramp with per-step contrast tooltips.
- Nearest named colours via weighted RGB distance.
- Export as CSS custom properties, Tailwind config or a plain hex list — copy or
  download, and the export always matches what is on screen.
- Empty, error (invalid hex) and success states; full keyboard access.

All maths lives in `src/lib/colorMath.ts` and is unit-tested: HSL round-trip is
lossless over 500 sampled colours, `#000`/`#fff` contrast is exactly 21:1,
contrast is symmetric, and every harmony type returns valid, distinct hex values.

### Icon Finder — `/icon-finder`

- 3,472 CC0 brand marks with real SVG path data rendered inline (no fetch, no CDN).
- Search by title, slug or alias; "show more" paging in batches of 240.
- Click an icon to copy its complete `<svg>` markup; download individual `.svg` files.
- Monochrome mode recolours every icon to `currentColor` *and* copies
  `currentColor`, so the pasted markup inherits the surrounding text colour.
- Explicit loading skeleton, load-failure state and empty-search state.

## Verification

`node tests/ecosystem-libraries.mjs` — **59 assertions, all passing**. It checks the
real generated data and mounts both components in a real DOM:

1. every library's length equals its licence-registry record count;
2. no duplicate colour name+hex pair, icon slug or emoji codepoint;
3. every colour has a valid 6-digit hex and non-blank name; every icon has real
   path data (not an empty placeholder) and a valid brand hex;
4. every registry entry uses an allow-listed licence and records its file/count;
5. colour maths correctness (round-trip, WCAG reference values, harmony
   determinism, monotonic ramp, nearest-match ordering, export shapes);
6. the palette tool renders, searches real data, shows HSL/OKLCH/contrast and
   produces an export containing the on-screen colours;
7. the icon finder loads its payload, renders real SVG paths in brand colours,
   filters by query — with **zero network calls** in either tool.

Regression suites re-run and green after these changes: `test:local-first` (7 pages,
0 network), `test:collections` (506 bios / 20 collections), `test:performance`,
`test:library` (24 checks), plus `tsc --noEmit` and a production build
(53 route shells, up from 51).

## Bugs found and fixed by the tests

- **HSL quantisation loss.** `rgbToHsl` rounded to one decimal, so
  `hslToHex(rgbToHsl(hex))` returned a *different* hex for 205 of 500 sampled
  colours — corrupting harmonies and ramps. Math is now full-precision; display
  strings are rounded by separate `formatHsl`/`formatOklch` helpers.
- **Stale hardcoded counts.** The Features page claimed "Twelve generators" and the
  Categories header "12 tools · 6 categories". Both now derive from `TOOLS` and
  `CATEGORY_META`, so they cannot go stale again.

## Deliberately not done

- **`@iconify/json` (673 MB, 200k+ icons) is not bundled.** It is MIT per set but
  carries per-collection SPDX licences, so it needs per-set filtering before it
  could ship, and no subset has been selected yet. Reported as available, not
  imported. Fabricating a count for it would violate the project's honesty rule.
- **SVG path data for icons is full-fidelity, not optimised.** Optimising would
  require a path-minification dependency; the 1.96 MB gzip cost is contained to
  the icon chunk and does not affect any other route.

## What remains (next stages)

- Stage 3: quotes / poetry / wishes content libraries.
- Stage 4: business, slogan and marketing studios.
- Stage 5: developer text utilities; tool taxonomy beyond 14 flat entries.
- Stage 6: language registry with real RTL support.
- Stage 7: favourites/history/bulk export across the toolkit.
- Stage 8: search facets (tag, platform, tone) — currently global search is a flat
  index.
