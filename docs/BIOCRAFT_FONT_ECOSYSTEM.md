# BioCraft — Hindi / Devanagari font ecosystem

_Status ledger, last updated 2026-11-19. This is the resumable record of what is
imported, what is verified, what ships publicly, and the exact commands to
reproduce each step._

## Outcome at a glance

| Measure                                                          | Count                                                          |
| ---------------------------------------------------------------- | -------------------------------------------------------------- |
| Devanagari families discovered (Fontsource `devanagari` subset)  | **63**                                                         |
| Families imported (binaries on disk)                             | **63**                                                         |
| Families verified by HarfBuzz shaping                            | **62**                                                        |
| Families rejected by the gate                                    | **1** — Bakbak One (no Devanagari digits U+0966–096F)          |
| WOFF2 files in the catalogue                                     | **354** (Devanagari + Latin companion subsets)                 |
| Variable families                                                | **13**                                                         |
| Licences represented                                             | OFL-1.1 (all imported families)                                |
| Public families in the catalogue                                 | **62** (the rejected family is kept only in the import report) |
| Conjunct probes forming a single glyph                           | **764 of 930** (62 families × 15 probes each)                  |
| Bytes of WOFF2 shipped                                           | **15.7 MB**                                                    |

Imported and verified are deliberately reported separately: importing a file is
not evidence that it can shape Hindi. The rejected family keeps its report and
hashes but its binaries are removed from `public/fonts`, so that folder holds
exactly the 62 published families.

The required sample is checked by shaping, not by family name:

> नमस्ते भारत मेरा नाम सचिन है। ज़िंदगी खूबसूरत है। प्रेम, विश्वास और उम्मीद। कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। श्रृंगार, शायरी और एहसास।

Conjuncts probed per family (15 each): क्ष त्र ज्ञ श्र क्र प्र स्त्र द्ध ट्ट ञ्ज ण्ड म्भ क्क ग्र न्द्र.
Every rejection keeps its failure reason in
`src/data/hindi-fonts/import-report.json`; nothing is fabricated.

## Phase ledger

| Phase | Scope                                                   | State | Evidence                                                                                                              |
| ----- | ------------------------------------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------- |
| 1     | Discover / import genuine Devanagari fonts              | Done  | `scripts/fonts/sources.json`, `scripts/fonts/import-devanagari.mjs`, `src/data/hindi-fonts/import-manifest.json`        |
| 2     | Glyph, matra, conjunct, nukta, punctuation verification | Done  | `scripts/fonts/verify_fonts.py` (HarfBuzz 15.0 + fontTools 4.68), `src/data/hindi-fonts/verification.json`              |
| 3     | Local-first catalogue: paging, search, hashes, licences | Done  | `src/lib/hindiFonts/{catalogue,search,types}.ts`, `src/data/hindi-fonts/{catalogue,licenses,import-report}.json`        |
| 4     | Premium light font library + specimen pages             | Done  | `src/pages/HindiFontsPage.tsx`, `HindiFontSpecimenPage.tsx`, `src/components/hindi/*`, `src/hindi-fonts.css`            |
| 5     | Studio and poster tools using the chosen family         | Done  | `src/pages/HindiFontStudioPage.tsx`, `HindiPosterStudioPage.tsx`, `components/hindi/{Studio,PosterStudio,FontPicker}`   |
| 6     | Admin Hindi Font Library console                        | Done  | `src/admin/live/HindiFonts.tsx`, `src/lib/hindiFonts/{inspect,validation,import-queue,overrides}.ts`                    |
| 7     | Performance and delivery                                | Done  | WOFF2 only, `font-display: swap`, IntersectionObserver cards, per-weight fetches, 12-family pages, immutable header       |
| 8     | Licence / attribution metadata                          | Done  | `src/data/hindi-fonts/licenses.json`, per-family `LICENSE.txt` + `source.json`, `/hindi-font-licenses`                   |
| 9     | Automated, rendering and browser tests                  | Done  | `tests/hindi-fonts-{catalogue,runtime,rendering}.mjs`, `tests/e2e/hindi-fonts.spec.ts`, `tests/local-first/pages-render` |

## Routes

| Route                        | What it is                                                                 |
| ---------------------------- | -------------------------------------------------------------------------- |
| `/hindi-fonts`               | Catalogue of the 62 verified families; search, facets, paging, favourites, compare |
| `/hindi-fonts/<slug>`        | Specimen sheet, glyph grid, weights, licence, licensed WOFF2 download       |
| `/hindi-font-studio`         | Bio / shayari / quote / caption / username / stylish-text generator in the chosen family |
| `/hindi-poster-studio`       | Real 1080-px canvas poster (4:5, 1:1, 9:16) painted with the chosen WOFF2    |
| `/hindi-font-licenses`       | Licence index: every family, attribution, upstream version, withheld family |
| `/admin/hindi-fonts`         | Admin console (7 tabs), public navigation deliberately excludes it          |

`/font-library` (the existing 1,908-family Google Fonts library),
`/design-studio` and `/admin/fonts` are untouched; the Hindi routes cross-link to
them and to the fancy font generator. An unknown specimen slug renders the
shared 404 page (`HindiNotFound`), never a blank route.

## Where things live

### Pipeline

```bash
npm run fonts:import   # download from the pinned Fontsource manifest
npm run fonts:verify   # HarfBuzz shaping gate -> verification.json
npm run fonts:build    # catalogue.json + licenses.json + import-report.json
npm run fonts:all      # all three, in order
```

`fonts:verify` needs the Python toolchain:

```bash
python3 -m venv /tmp/fontenv
/tmp/fontenv/bin/pip install -r scripts/fonts/requirements.txt
PATH=/tmp/fontenv/bin:$PATH npm run fonts:verify
```

- Sources: `scripts/fonts/sources.json` — provider, distributor, weights, subsets,
  hashes, Unicode ranges; all OFL-1.1 at import time.
- Curation: `scripts/fonts/curation.json` — categories, tags, descriptions derived
  from each family's published upstream `DESCRIPTION`, never from its name.
- Binaries: `public/fonts/hindi/<slug>/{devanagari[-<weight>].woff2,latin[-<weight>].woff2,LICENSE.txt,source.json}`
  (18 MB on disk, committed; 354 WOFF2 files).
- Generated data: `src/data/hindi-fonts/{catalogue,verification,licenses,import-manifest,import-report}.json`.

### Runtime (local-first)

There is **no font API**. The SPA imports the committed catalogue directly:

- `src/lib/hindiFonts/catalogue.ts` — `listFonts()` with cursor paging (stale and
  foreign cursors are rejected with `FontCursorError`), `getFont()`, facets,
  nearest-weight selection, `detectDuplicates()`.
- `src/lib/hindiFonts/search.ts` — Hindi intent words (`पोस्टर` → Poster,
  `किताब` → Book) expand to English tags; Latin queries match family names.
- `src/lib/hindiFonts/loader.ts` — registers `/fonts/hindi/<slug>/devanagari[-<w>].woff2`
  as `BioCraft Hindi <slug>` with `unicode-range: U+0900-097F` and
  `display: swap`. The Latin companion is registered with `U+0000-00FF` and is
  only fetched once Latin characters actually appear in the text. One face per
  weight. A failed load is retried on demand instead of caching the error.
- `src/lib/hindiFonts/preferences.ts` / `usage.ts` — favourites, recents, selected
  family, preview text and anonymous per-device usage tallies in `localStorage`.
  No slug-binary caching, no visitor identifier, no request.
- No network call is made by any public Hindi route; `tests/local-first/pages-render.mjs`
  asserts exactly that for all six.

### Admin

- UI: `/admin/hindi-fonts`, module key `hindi-fonts` in
  `shared/admin-extra-modules.json`, seven tabs — Overview, Catalogue,
  Validation, Imports, Usage, Licences, Export.
- `src/lib/hindiFonts/inspect.ts` runs **fontkit in the browser**: real Devanagari
  coverage, conjunct `.notdef` and single-glyph probes, matra and nukta shaping,
  numerals, Latin, variable axes and a SHA-256 of the bytes. It is a **pre-check**;
  publication still requires `scripts/fonts/verify_fonts.py`.
- `src/lib/hindiFonts/validation.ts` lazily imports the 1.9 MB HarfBuzz report.
- `src/lib/hindiFonts/import-queue.ts` and `overrides.ts` are device-local: staged
  files, review notes and approve/reject decisions live in `localStorage` and can be
  exported as JSON. **There is no upload endpoint and no database write** — the
  public site reads bundled content, so an "import" that pretended to mutate it
  would be a lie. Promoting a family is export → run the Python gate → commit.
- Supabase is used for administrator sign-in only. No font data, no catalogue row
  and no review decision is stored there.

## Verification evidence

### Shaping and binaries

- HarfBuzz 15.0 gates every file. `verification.json` stores coverage, sample
  `.notdef` counts, conjunct/matra/nukta/numeral results and SHA-256 per file.
- Every one of the 62 published families reports **100% Devanagari coverage**;
  764 of 930 conjunct probes collapse to a single glyph.
- fontkit spot checks on Noto Sans Devanagari: क्ष/त्र/ज्ञ/श्र/क्र/प्र → one glyph;
  स्त्र → two; नमस्ते → five glyphs; ज़िंदगी → six; १२३०९ and ।॥ present.
- Skia (`@napi-rs/canvas`) renders all 62 families: registered, painted, conjuncts
  formed, `कि` reordered, mixed Hindi + English drawn, ink density non-zero.

### Automated tests

```bash
npx tsc --noEmit                  # clean
npm run build                     # tsc + vite build + 121 route shells
npm run test:hindi-fonts          # catalogue (20 checks) + runtime (10 checks)
npm run test:hindi-fonts-rendering# 62 families through Skia (6 checks)
npm run test:local-first          # 13 public pages, no database, no network
```

`tests/hindi-fonts-catalogue.mjs` re-hashes all 354 files, checks every licence
file exists and matches the index, re-reads the HarfBuzz evidence, and exercises
cursor paging, Hindi + English search, facet counts, determinism,
nearest-weight selection and duplicate detection.

### Browser tests

```bash
npm run build && npm run preview -- --port 4173   # terminal 1
npm run test:hindi-fonts-browser                   # 13 Chromium tests
```

`tests/e2e/hindi-fonts.spec.ts` covers, against the built site:

1. real WOFF2 requests and `data-font-loaded` only after the face resolves,
2. the visitor's own mixed Hindi/English preview text,
3. Hindi search, pagination and favourites with **zero** `/api/` calls,
4. comparison of two families with the same text,
5. the specimen glyph sheet and a licensed WOFF2 download,
6. the unknown-slug 404 page,
7. the licence index naming every family and the withheld one,
8. family switching measured as a real text-width change,
9. generated bios, shayari, quotes, captions, usernames and styles,
10. a downloaded 1080 × 1350 poster PNG,
11. no horizontal overflow at 390 px,
12. every Hindi route fitting the viewport,
13. the existing Google Fonts library and design studio still working and cross-linked.

Result in this workspace: **13/13 passed** on headless Chromium 153 at 390 × 844.

`tests/admin-extra-modules-browser.cjs` additionally walks all 22 Admin modules at
390/820/1440 px, including `/admin/hindi-fonts`.

### Environment caveat

This container ships no Playwright browser and cannot download one. Two escape
hatches exist and are both optional:

```bash
npm run chromium:prepare           # extracts a Chromium to /tmp/chromium
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/tmp/chromium \
LD_LIBRARY_PATH=/tmp/quickkit-chromium/lib npx playwright test tests/e2e/hindi-fonts.spec.ts
```

`playwright.config.ts` honours `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` and disables
video recording when it is set (a custom executable arrives without Playwright's
ffmpeg). CI should run `npx playwright install chromium` and need neither.

The container also has no emoji font, so emoji accents in generated bios appear as
tofu in screenshots. Real devices render them; the text itself is correct.

## Open / next steps

1. **Publish staged imports into the committed catalogue.** Staging and review work
   today, but promoting a family still means exporting the decision, running the
   Python gate and committing the binaries/metadata. Automating that hand-off is the
   next pipeline improvement.
2. **CI browser job.** Add a workflow that installs Playwright Chromium and runs
   `npm run test:hindi-fonts-browser`.
3. **Emoji fallback.** Optionally bundle a small emoji subset for canvas posters where
   the OS has none.
4. **More sources.** The same verifier can ingest other OFL Devanagari families
   (e.g. Shobhika) by adding entries to `scripts/fonts/sources.json`. GPL families
   such as Yashomudra are excluded on purpose.

## Guardrails

- A family is never called Hindi because of its name; only the shaping gate decides.
- Rejected families keep their report; no catalogue record is invented.
- Existing BioCraft tools, content and Admin auth are untouched.
- Restricted/GPL files are not redistributed.
- Public font data stays in the repository bundle; Supabase is auth only.
- Font previews always use the actual WOFF2 file, never a `font-family` label over a
  system fallback.
