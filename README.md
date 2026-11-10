# BioCraft — All-in-One Social Media Toolkit

BioCraft is a free, all-in-one social media toolkit that runs entirely in your
browser. Twelve generators across eight platform workspaces in one unified,
light-glass interface — no page reloads, no accounts, no uploads.

**Platforms:** Instagram · Facebook · Threads · TikTok · X (Twitter) · LinkedIn
· WhatsApp · Snapchat

**Generators:**

- **Bio Generator** — five unique bios per run in English, Hindi or Hinglish (LinkedIn:
  English), within each platform's real limit — Instagram 150 · Facebook 101 ·
  Threads 150 · TikTok 80 · X 160 · LinkedIn 2,600.
- **Stylish Name Generator** (`/stylish-name-generator`) — your display name in
  33 Unicode text styles, one-tap copy plus copy-all, with optional name frames.
- **Fancy Font Generator** (`/fancy-font-generator`) — any text (up to 2,200
  characters) in 33 Unicode fonts.
- **Design Studio** (`/design-studio`) — type any sentence and get ready-made
  designs: 33 Unicode fonts × 20 decorative emoji frames × 18 designer card
  styles. Live preview with exactly what you’ll copy, plus a gallery of
  hand-curated font × frame × card mixes (Remix rotates pages), one-tap copy.
- **Username Generator** (`/username-generator`) — twelve unique handles per
  run; four vibes (aesthetic / professional / short / playful), lengths
  clamped to 6–30, Instagram rule-valid and deduplicated. Devanagari input is
  transliterated approximately.
- **Emoji & Symbol Generator** (`/emoji-symbol-generator`) — a curated library
  of 531 Unicode symbols and emoji across 24 categories, English and Hindi
  search, favourites, recently-used and curated multi-glyph combos,
  one-tap copy plus copy-all.
- **Hashtag Generator** (`/hashtag-generator`) — relevant, deduplicated
  hashtags for 14 niches in English, Hindi or Hinglish, broad/medium/focused mixes of
  5 (Instagram's current feed cap), 10, 20 or 30, optionally blended with variants of your own keywords. No
  reach guarantees, ever.
- **Caption Generator** (`/caption-generator`) — exactly five unique captions
  per run across 12 topics, 8 tones (including the new Quiet Luxury tone), English/Hindi/Hinglish, optional emoji and CTA, plus optional Unicode caption frames.
- **LinkedIn Headline Generator** (`/linkedin-headline-generator`) — five
  rule-based headlines (Role · Value · Proof), ≤ 220 characters.
- **LinkedIn Summary Generator** (`/linkedin-summary-generator`) — five
  structured About-section drafts, ≤ 2,600 characters, built only from your
  inputs — no invented facts.
- **WhatsApp Status Generator** (`/whatsapp-status-generator`) — five statuses
  per run in English, Hindi and Hinglish.
- **Snapchat Caption Generator** (`/snapchat-caption-generator`) — five
  captions per run in English, Hindi and Hinglish.

Plus **Bio Editor** (`/bio-editor`) — a hand-rolled bio workbench: per-platform
character counters, 33 Unicode fonts, decorative dividers, emoji quick-insert
(including your symbol favourites and recents), 18 designer card styles with a
live preview, and exactly the styled text copied to your clipboard.

Everything runs client-side; the text you type never leaves your browser.
Rule-based generation only — no AI services, no paid APIs.

## Routes

`/` plus one discovery hub, 12 tool routes, the hand-rolled
`/bio-editor`, 12 info pages and the ready-made bio collection system
(index + 20 collections) — 48 static shells total:

- Hub: `/categories` — pastel category cards with live tool counts, favourites
  (localStorage), recently used tools, and the full twelve-tool grid.
- Bio collections: `/bio-collections` — browse all 20 collections with search,
  quick-jump category chips, popular and recently-added rails. Each collection
  is a flat route (e.g. `/instagram-bio-for-boys`, `/attitude-bio`,
  `/shree-ram-bio`) rendering original, copy-ready bios from
  `src/lib/bioCollections.ts` (506 entries), with per-page search + filters,
  Copy-all, related collections, FAQs, and Instagram-style sample profile
  previews on the Boys and Girls pages.
- Tools: `/bio-generator` `/stylish-name-generator` `/fancy-font-generator`
  `/design-studio` `/username-generator` `/emoji-symbol-generator` `/hashtag-generator`
  `/caption-generator` `/linkedin-headline-generator` `/linkedin-summary-generator`
  `/whatsapp-status-generator` `/snapchat-caption-generator`
- Workbench: `/bio-editor` — build a bio by hand (platform limits, Unicode
  fonts, dividers, emoji, designer card previews, live counter).
- Design Studio: `/design-studio` — any sentence → ready-made designs (29
  Unicode fonts × emoji frames × 18 card designs); live preview, curated mix
  gallery with Remix, one-tap copy.
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
Explore Social Media Tools (eight platform cards, “Open Generator” deep-links
`?platform=<id>#workspace`) → the unified workspace (all twelve tools, one
page) → Explore Powerful Tools (twelve cards with localStorage favourites) →
conditional “Your favourite tools” → Why Choose BioCraft (six) → How It Works
(5-step timeline) → Explore Ready-Made Bios (8 category cards; popular,
recently-added and Recently Added Designs rails; CTA to `/bio-collections`) → Popular Categories (12 niche
chips deep-linking `?tab=category&category=<id>`) → accessible 7-question FAQ accordion → a soft
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
npm run build      # type-check + bundle + 48 static route shells
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
│   └── build-shells.mjs        # Post-build: one static shell per route (48);
│                               #   canonical/og:url only when SITE_URL is set
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
│   │   ├── unicodeStyles.ts    # Rule-based 29-style Unicode transform engine
│   │   ├── transliterate.ts    # Rule-based approximate Devanagari → Latin
│   │   ├── text.ts             # Code-point length, limits, tidy helpers
│   │   ├── validation.ts       # Form validation + accessible error helpers
│   │   ├── bioCollections.ts   # Ready-made bio registry (20 collections, 506 original bios)
│   │   └── clipboard.ts        # Clipboard API + legacy execCommand fallback
│   ├── components/
│   │   ├── Header.tsx          # Floating white-glass navbar; search overlay; mobile sheet
│   │   ├── Footer.tsx          # Footer: tool/page links, honest badges
│   │   ├── PlatformPills.tsx   # Eight platform pills with accent glows
│   │   ├── ToolTabs.tsx        # Registry-driven tool tabs (real anchors)
│   │   ├── ToolWorkspace.tsx   # Unified workspace: pills → tabs → panel
│   │   ├── ToolShell.tsx       # Route dispatcher; breadcrumbs; per-route <title>
│   │   ├── StyleGallery.tsx    # Stylish/font rows + Copy-all
│   │   ├── CopyButton.tsx      # Shared copy button with feedback
│   │   ├── BioCollectionCard.tsx  # One ready-made bio: copy/share/tags
│   │   ├── CollectionIcon.tsx     # SVG glyph for each collection
│   │   ├── ProfilePreview.tsx     # Instagram-style sample profile (Boys/Girls)
│   │   └── …                   # icons, CharCounter, SegmentedControl, Logo, …
│   ├── pages/
│   │   ├── HomePage.tsx        # Tool-first homepage (workspace + platform cards + FAQ)
│   │   ├── BioCollectionsPage.tsx # /bio-collections hub (search, chips, rails)
│   │   ├── BioCollectionPage.tsx  # One collection: grid, filters, FAQs, preview
│   │   ├── BioEditorPage.tsx   # /bio-editor — hand-rolled bio workbench
│   │   ├── info.tsx            # Info pages (honest, original content)
│   │   └── InfoPage.tsx        # Info page renderer
│   └── tools/
│       ├── platforms.ts        # Per-platform config (limits, headings, tools)
│       ├── registry.ts         # Tool metadata: id, path, titles, headings
│       ├── bio/  stylish/  fonts/  design/  username/  symbols/  hashtags/  captions/
│       ├── whatsapp-status/  snapchat-caption/
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

- **Symbols** — 531 entries across 24 categories; keywords are English. Glyphs
  are deduplicated exactly. Favourites, recently-used and 12 curated combos are
  stored in localStorage only.
- **Hashtags** — curated tags (EN/HI) across 14 niches in three reach buckets.
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
- **Ready-made bios** — every entry in `bioCollections.ts` is original
  BioCraft content, never copied from external sites, in English, Hindi and
  Hinglish. Counts shown in the UI
  (collection totals, "N bios") are computed from the registry at runtime.
  The Instagram-style Boys/Girls previews are original abstract SVG
  illustrations with clearly-labelled sample numbers — not real people, not
  real accounts, and captions state BioCraft is not affiliated with Instagram.
  Unicode-styled bios are produced by the same rule-based `applyStyle` engine
  as the font tools, so copy is byte-exact and Devanagari passes through
  unchanged (styled Latin alphabets do not exist for Devanagari).

## Verification

The dev-only harness (`review-check.cjs` + `review-harness.tsx`, not part of the
shipped app) renders the real `<App />` in jsdom and drives it with DOM
events: 283 checks covering all tool routes, /bio-editor, /design-studio and the homepage, titles, axe-core on key routes,
per-platform bio limits (150/101/150/80/160/2,600/139/150), platform fallback,
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
can be hosted on any static host. Canonical link tags are emitted into every
shell (root included) when — and only when — you pass the production domain:

```bash
SITE_URL=https://your-domain.example npm run build
```

Without `SITE_URL` (the default) canonical/og:url stay absent by design,
because no owned domain exists yet — placeholder domains must not ship.
A `sitemap.xml` still needs to be added with the production domain.
