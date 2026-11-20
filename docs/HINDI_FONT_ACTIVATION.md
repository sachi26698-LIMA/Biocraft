# Hindi font activation — verified production record

Date: 2026-11-20. Answers one question: are the Hindi fonts active on the live site?

## They were already deployed — and effectively inactive

Checked production before changing anything. `/hindi-fonts` was already live at
`biocraft-bice.vercel.app`: 62 families, correct Hindi title, 12 shown with "Load more",
filters, per-card HarfBuzz verdicts.

The gap was discovery, not deployment:

| Surface | Before |
|---|---|
| `/resources` — target of the header's primary **All Tools** button | 13 English tools, **no Hindi entry** |
| Global search index | bios, symbols, hashtags, captions, Unicode styles — **no Hindi fonts** |
| Inbound links | 3 footer rows only |
| Sitemap | already correct (PR #29) |

## What was changed (PR #33, commit `5c1ec90`)

1. **Search indexes all 62 families** — new `hindi-font` domain in `globalSearch.ts`,
   deliberately separate from `font` (which is Unicode look-alike styling of Latin text
   and links to the fancy font generator — a different thing pointing elsewhere).
   Indexed by name, category, tags, scripts, language support and licence.
   Index 2,795 → **2,857**. Hits link to `/hindi-fonts/<slug>`.
2. **`/resources` gains a Hindi (Devanagari) fonts section** linking the library,
   Preview & Bio Studio, Poster Studio and licences.

## Verification

`tests/hindi-fonts-discovery.mjs` — 18 assertions. Regression-proven: fails 5 with
`info.tsx` reverted to HEAD. `tsc` clean, build 121 shells + 134-URL sitemap, 13 suites pass.

## Deployment

| Field | Value |
|---|---|
| Merge commit | `b7bc1d7e96f412774d208b9f586b1cd0d4f7b8e2` |
| PR | #33 |
| Vercel deployment ID | `dpl_FWWeXHbEa9LEvNNbS2Ft3aRRPr3b` |
| State | **READY**, `readySubstate: PROMOTED` |
| Aliased | `biocraft-bice.vercel.app` |
| Built commit | `b7bc1d7` (matches) |

## Verified live on production, after the deploy

| Check | Evidence |
|---|---|
| **New build reached prod** | `robots.txt` now contains `Sitemap:` — absent before. Decisive, not inferential. |
| **Hindi under All Tools** | `/resources` renders the "Hindi (Devanagari) fonts" section with 4 links |
| `/hindi-fonts` | 62 families, filters, "Showing 12 of 62 … verified with HarfBuzz" |
| `/hindi-fonts/akshar` | glyph test sheet, 100% Devanagari coverage, 11/15 conjuncts, sha256, WOFF2 links |
| `/sitemap.xml` | **200**, 134 URLs incl. all 62 specimens |
| `/icon-finder` | **3,472 brand icons** — was showing the bio form (PR #28 bug now actually live) |
| `/color-palette-generator` | **32,004 colour names** — was showing the bio form |
| `/text-toolkit` | real text toolkit — was showing the bio form |

The last three are a side effect worth noting: deploying this also shipped PR #28's tool
fix, which had been merged but never deployed.

## Not verified

Browser interaction (copy buttons, font loading in a real viewport, studio exports).
`playwright install chromium` is blocked in this environment, so every check above is
HTTP/source level. No claim is made that clicking through works.
