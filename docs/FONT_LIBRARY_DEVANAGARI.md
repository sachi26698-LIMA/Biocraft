# /font-library Devanagari fix — production record

Date: 2026-11-20. Answers: "Hindi ke multiple font add kiye the, wo nahi aa raha."

## Where the user was looking

`/font-library` — the 1,908-family Google Fonts catalogue. It has **always contained
all 62 Devanagari families**. They were never missing from the data.

## Why they could not be found

Two independent causes, both verified by running the real data layer:

| Query | Before | After |
|---|---|---|
| `search "hindi"` | **1** | **62** |
| `search "devanagari"` | **7** | **62** |
| `search "हिंदी"` | 0 | **62** |
| `search "देवनागरी"` | 0 | **62** |
| chip `Devanagari` | *did not exist* | **62** |
| `category=serif` (unchanged) | 200 | 200 |
| `search "Mukta"` (unchanged) | 4 | 4 |

1. **Search matched the family name only.** Seven families happen to contain
   "Devanagari" in their name. The other 55 were unreachable by search.
2. **The only filters were style chips** — sans-serif, serif, display, handwriting,
   monospace. Those answer *"what does it look like"*. Every Devanagari family is an
   ordinary sans-serif, serif or display face, so those chips **scatter the 62 across
   the whole catalogue** and none of them gathers them. There was no way to ask
   *"which of these can set Hindi?"*.

## The fix (PR #34, commit `898e92f`)

- `libraryApi.ts`: search matches script `subsets` as well as the name.
- Explicit `SCRIPT_ALIASES` map — hindi / हिंदी / हिन्दी / देवनागरी → devanagari.
  Hand-written, not guessed transliteration.
- New `DEVANAGARI_CATEGORY` filter, rendered as a dashed, visually distinct
  `हिन्दी · Devanagari` chip in `FontLibraryPage.tsx`.
- Selecting it explains the distinction and links to `/hindi-fonts`, the
  self-hosted 62-family library (different set: own WOFF2 files, specimen pages).

## Verification

`tests/font-library-devanagari.mjs` — **13 assertions**, executing the real data
layer through tsx rather than pattern-matching source. Regression-proven: fails 3
assertions with `libraryApi.ts` reverted to HEAD.

Note: the first version of this test **silently skipped** its data-layer section on
a tsx top-level-await error and still printed PASS. Fixed to count a data-layer
failure as a failure — a green run that skips its main assertions is worse than red.

`tsc` clean · build 121 shells + 134-URL sitemap · **14 suites pass**.

## Deployment

| Field | Value |
|---|---|
| PR | #34 (merged) |
| Merge commit | `54af0093a17a7921b95f45ce9778961db3675519` |
| Vercel deployment | `dpl_BRoPJFm48SFBcyCpBAM7Lmaa1UhA` |
| State | **READY**, `readySubstate: PROMOTED` |
| Alias | `biocraft-bice.vercel.app` |
| Built commit | `54af009` (matches) |

## Verified live

| Check | Evidence |
|---|---|
| Deploy reached production | `robots.txt` carries the `Sitemap:` line from this build line |
| Chip rendered on production | `/font-library` filter bar shows `All · Sans serif · Serif · Display · Handwriting · Monospace · हिन्दी · Devanagari` |
| Chip in the served bundle | `FontLibraryPage-*.js` contains `हिन्दी · Devanagari` and `devanagari` |
| Devanagari families still listed | Akshar, Alkatra show `devanagari` in their subset line |

## Not verified

**The chip click itself.** The filter is client-side React state; the page does not
read a `?category=` query param, so `fetch_page` cannot simulate the click and
`?category=devanagari` correctly leaves the list unfiltered. Playwright cannot
install in this environment. The 62-result behaviour is proven at the data layer
and the wiring is proven by the served bundle, but nobody has clicked it in a real
browser. Worth one manual click to confirm end to end.
