# BioCraft — All-in-One Social Media Toolkit

BioCraft is a free, all-in-one social media toolkit that runs entirely in your
browser. Nine generators across six platform workspaces in one unified,
light-glass interface — no page reloads, no accounts, no uploads.

**Platforms:** Instagram · Facebook · Threads · TikTok · X (Twitter) · LinkedIn

**Generators:**

- **Bio Generator** — five unique bios per run in English or Hindi (LinkedIn:
  English), within each platform's real limit — Instagram 150 · Facebook 101 ·
  Threads 150 · TikTok 80 · X 160 · LinkedIn 2,600.
- **Stylish Name Generator** (`/stylish-name-generator`) — your display name in
  24 Unicode text styles, one-tap copy plus copy-all.
- **Fancy Font Generator** (`/fancy-font-generator`) — any text (up to 2,200
  characters) in 24 Unicode fonts.
- **Username Generator** (`/username-generator`) — twelve unique handles per
  run; four vibes (aesthetic / professional / short / playful), lengths
  clamped to 6–30, Instagram rule-valid and deduplicated. Devanagari input is
  transliterated approximately.
- **Emoji & Symbol Generator** (`/emoji-symbol-generator`) — a curated library
  of 324 Unicode symbols and emoji across 12 categories, English and Hindi
  search, one-tap copy plus copy-all.
- **Hashtag Generator** (`/hashtag-generator`) — relevant, deduplicated
  hashtags for 12 niches in English or Hindi, broad/medium/focused mixes of
  10, 20 or 30, optionally blended with variants of your own keywords. No
  reach guarantees, ever.
- **Caption Generator** (`/caption-generator`) — exactly five unique captions
  per run across 12 topics, 7 tones, English/Hindi, optional emoji and CTA.
- **LinkedIn Headline Generator** (`/linkedin-headline-generator`) — five
  rule-based headlines (Role · Value · Proof), ≤ 220 characters.
- **LinkedIn Summary Generator** (`/linkedin-summary-generator`) — five
  structured About-section drafts, ≤ 2,600 characters, built only from your
  inputs — no invented facts.

Everything runs client-side; the text you type never leaves your browser.
Rule-based generation only — no AI services, no paid APIs.

## Routes

`/` plus one discovery hub and 9 tool routes and 12 info pages — 23 static
shells total:

- Hub: `/categories` — pastel category cards with live tool counts, favourites
  (localStorage), recently used tools, and the full nine-tool grid.
- Tools: `/bio-generator` `/stylish-name-generator` `/fancy-font-generator`
  `/username-generator` `/emoji-symbol-generator` `/hashtag-generator`
  `/caption-generator` `/linkedin-headline-generator` `/linkedin-summary-generator`
- Pages: `/features` `/use-cases` `/pricing` `/blog` `/resources` `/about`
  `/help` `/contact` `/login` `/privacy` `/terms` `/cookie`

**Platform pills** at the top of the workspace switch the whole experience:
tools, headings, character limits and accent colour follow the platform,
while the BioCraft identity stays constant. LinkedIn is English-only today;
its bio/About limit is 2,600 and its dedicated tools enforce 220-character
headlines. Tabs that are not available on a platform simply are not shown;
tool routes unavailable on the current platform render the platform's first
tool (the URL is left unchanged).

## Design

Premium light-glassmorphism system: base `#FCF9FC` with soft pastel radial
glows (lavender, cyan, pink, mint) and white-glass cards
(`rgba(255,255,255,0.76)`, `backdrop-filter: blur(18px)`) with thin translucent
purple borders (`rgba(139,75,192,0.18)`) and ambient shadows. Pastel palette:
lavender `#E9DDFB`, soft purple `#CDB5F5`, pink `#FFDCEB`, rose `#F5A9CB`,
mint `#D9F5E9`, cyan `#D9F0FA`, peach `#FFE7DB`. Text `#241B35` with secondary
`#71677D`; the primary action accent is `#8B4BC0` (white on it passes AA),
hover `#7A3CA8`, and the signature CTA is a purple→rose gradient. Errors
`#B42318`, success `#0E7A4D`. Background-blur glass panels, soft 3D-style icon
tiles, delicate hover elevation, `prefers-reduced-motion` honored, system
fonts, visible purple focus rings — no dark surfaces anywhere.

## Homepage

Hero-led, tool-first hybrid: a two-column hero (badge “All-in-One Social
Toolkit”, brand-promise headline, Explore All Tools / Generate Your Bio CTAs,
Free-to-use · No sign-up · Private & secure trust row) beside an **interactive
glass preview** that regenerates live bios for the platform you tap. Below:
Explore by Category (six pastel cards with live registry tool counts) →
Choose Your Social Platform (six cards, “Open Generator” deep-links
`?platform=<id>#workspace`) → the unified workspace (all nine tools, one
page) → Explore Powerful Tools (nine cards with localStorage favourites) →
conditional “Your favourite tools” → Why Choose BioCraft (six) → How It Works
(5-step timeline) → Popular Categories (12 niche chips deep-linking
`?tab=category&category=<id>`) → accessible 7-question FAQ accordion → a soft
lavender-pink Final CTA card (“Explore Tools” → `/resources`) → footer
(Brand + trust row · All Tools · Categories · Popular Tools · Company ·
Legal). The floating glass navbar carries Home · All Tools · Categories ·
Features · About · Help on the left, Search / Favourites / “Explore Tools” CTA
on the right, and a compact searchable overlay (Escape closes) plus a
hamburger sheet on mobile.

## Tech stack

React 18 · TypeScript · Vite · plain CSS (no Tailwind, no CSS framework).
No runtime dependencies beyond React and React DOM. No external fonts,
no external images, no trackers, no analytics, no cookies, no storage.

## Getting started

```bash
npm install
npm run dev        # dev server on 0.0.0.0:5173
```

Production build:

```bash
npm run build      # type-check + bundle + 22 static route shells
npm run preview    # serve the production build on 0.0.0.0:4173
```

Other scripts:

```bash
npm run typecheck  # tsc --noEmit
```

`npm run build` ends with `scripts/build-shells.mjs`, which emits one static HTML
shell per route with unique `<title>`, meta description and Open Graph/Twitter
tags — every route is crawlable on its own URL from any static host, with no
rewrite rules and no duplicate content. Canonical links, `og:url` and
`sitemap.xml` are deliberately absent until the production domain is known.

## Project structure

```
.
├── index.html                  # Toolkit-wide SEO meta, WebApplication JSON-LD
├── public/
│   ├── favicon.svg             # Lavender/rose gradient "B" mark on #FCF9FC
│   └── robots.txt
├── scripts/
│   └── build-shells.mjs        # Post-build: one static shell per route (23)
├── src/
│   ├── main.tsx                # React entry, mounts <App />
│   ├── App.tsx                 # Composition: skip link / header / main / footer
│   ├── index.css               # Design system (light glassmorphism)
│   ├── lib/
│   │   ├── router.ts           # Zero-dependency history router (useSyncExternalStore)
│   │   ├── toolkit.tsx         # Platform context; ?platform= query sync
│   │   ├── toolbox.ts          # Favourites + recently used (localStorage)
│   │   ├── toast.ts            # Tiny toast bus (auto-dismiss)
│   │   ├── categoryMeta.ts     # Six category definitions (counts from registry)
│   │   ├── unicodeStyles.ts    # Rule-based 24-style Unicode transform engine
│   │   ├── transliterate.ts    # Rule-based approximate Devanagari → Latin
│   │   ├── text.ts             # Code-point length, limits, tidy helpers
│   │   ├── validation.ts       # Form validation + accessible error helpers
│   │   └── clipboard.ts        # Clipboard API + legacy execCommand fallback
│   ├── components/
│   │   ├── Header.tsx          # Floating white-glass navbar; search overlay; mobile sheet
│   │   ├── Footer.tsx          # Footer: tool/page links, honest badges
│   │   ├── PlatformPills.tsx   # Six platform pills with accent glows
│   │   ├── ToolTabs.tsx        # Registry-driven tool tabs (real anchors)
│   │   ├── ToolWorkspace.tsx   # Unified workspace: pills → tabs → panel
│   │   ├── ToolShell.tsx       # Route dispatcher; breadcrumbs; per-route <title>
│   │   ├── StyleGallery.tsx    # Stylish/font rows + Copy-all
│   │   ├── CopyButton.tsx      # Shared copy button with feedback
│   │   └── …                   # icons, CharCounter, SegmentedControl, Logo, …
│   ├── pages/
│   │   ├── HomePage.tsx        # Tool-first homepage (workspace + platform cards + FAQ)
│   │   ├── info.tsx            # 11 info pages (honest, original content)
│   │   └── InfoPage.tsx        # Info page renderer
│   └── tools/
│       ├── platforms.ts        # Per-platform config (limits, headings, tools)
│       ├── registry.ts         # Tool metadata: id, path, titles, headings
│       ├── bio/  stylish/  fonts/  username/  symbols/  hashtags/  captions/
│       └── linkedin/           # Headline + Summary generators (+ curated pools)
├── vite.config.ts              # React plugin; dev/preview on 0.0.0.0
└── package.json
```

## How routing works

`src/lib/router.ts` is a zero-dependency history-API router. The bio tool also
honors `?tab=category` and `?category=<id>` deep links (used by the homepage
category chips). Tool and page
links are plain anchors intercepted for same-origin navigation: URLs change
without reloading, `document.title` follows the route, unknown paths fall back
to `/`, and back/forward navigation works. The active platform travels in the
query string (`?platform=linkedin`) and survives navigation in-memory. In
production every route also exists as a static HTML shell (see above), so
direct visits and crawlers get correct meta.

## Curated data & honesty notes

- **Symbols** — 324 entries across 12 categories; keywords are English. Glyphs
  are deduplicated exactly.
- **Hashtags** — curated tags (EN/HI) across 12 niches in three reach buckets.
  Volume changes constantly; no reach or virality is ever promised.
- **Devanagari** — Unicode styled alphabets do not exist for Devanagari, so
  the stylish/fancy-font tools pass Devanagari through unchanged (combining-mark
  styles append their marks per grapheme cluster and say so). The username tool
  transliterates approximately (प्रिया → priya). Hindi hashtags ship as
  Devanagari tags; Hindi captions and bios are native text.
- **Transliteration** — deterministic and approximate (cluster handling,
  word-final schwa deletion, nukta loanphone consonants). It is a convenience,
  not a linguistic engine.
- **LinkedIn pools** — headlines and summaries are assembled from curated
  professional phrasing you trigger; BioCraft never invents facts about you.

## Verification

The dev-only harness (`review-check.cjs` + `review-harness.tsx`, not part of the
shipped app) renders the real `<App />` in jsdom and drives it with DOM
events: 266 checks covering all 23 routes, titles, axe-core on key routes,
per-platform bio limits (150/101/150/80/160/2,600), platform fallback,
Hindi/Devanagari round-trips, copy-to-clipboard byte-exactness, the hero live
preview driving the shared platform state, the search overlay, localStorage
favourites, toast feedback and the /categories hub. The production build is
`tsc --noEmit` clean and the harness exits `0`.

A second dev-only script, `responsive-audit.cjs`, evaluates the stylesheet's
min/max-width media queries against the nine supported breakpoints
(320/360/375/390/430/768/1024/1280/1440) and asserts the cascade resolves
the expected tracks and visibility rules for every layout-critical selector —
an honest check of the responsive system in environments without a browser.

```bash
npx esbuild review-harness.tsx --bundle --platform=node --format=cjs \
  --outfile=review-harness.bundle.cjs --jsx=automatic
node review-check.cjs
node responsive-audit.cjs
```

## Deployment

`npm run build` emits a static `dist/` folder (including per-route shells) that
can be hosted on any static host. Before going live, add a `<link rel="canonical">`,
`og:url` and a `sitemap.xml` pointing at your production domain — they are
intentionally absent now because no owned domain exists yet.
