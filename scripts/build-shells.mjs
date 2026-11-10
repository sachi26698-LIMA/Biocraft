/**
 * Post-build step: emits one static HTML shell per tool route.
 *
 * Each shell is a copy of dist/index.html with per-route <title>, meta
 * description and Open Graph/Twitter tags injected, so every tool is
 * crawlable with its own URL on any static host — no rewrite rules,
 * no duplicate content, no invented domains (canonical/og:url stay absent
 * until the production domain is known).
 *
 * The shells share the exact same hashed JS/CSS assets as the root page.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const dist = join(root, 'dist');

/** Per-route overrides. Keep in sync with src/tools/registry.ts and src/pages/info.tsx. */
const ROUTES = [
  {
    path: '/',
    title: 'BioCraft — All-in-One Social Media Toolkit',
    description:
      'Free social media toolkit: Instagram, Facebook, Threads, TikTok, X and LinkedIn — bios, usernames, captions, hashtags, stylish text, symbols and a 324-glyph library. EN & हिन्दी, no sign-up, fully private.',
    ogTitle: 'BioCraft — All-in-One Social Media Toolkit',
    ogDescription:
      'Free social media toolkit for Instagram, Facebook, Threads, TikTok, X and LinkedIn. EN & हिन्दी, no sign-up, fully private.',
    runAsTemplate: true,
  },
  {
    path: '/bio-generator',
    title: 'Bio Generator — BioCraft Social Media Toolkit',
    description:
      'Generate five unique bios in English or Hindi — Instagram, Facebook, Threads, TikTok, X and LinkedIn limits respected. Free, private, no sign-up.',
    ogTitle: 'Bio Generator — BioCraft',
    ogDescription: 'Five unique bios per platform, EN & Hindi, no sign-up, private.',
  },
  {
    path: '/stylish-name-generator',
    title: 'Stylish Name Generator — BioCraft Social Media Toolkit',
    description:
      'Turn your display name into 24 stylish Unicode text variants — bold, script, fraktur, double-struck and more. One-tap copy, free, private, no sign-up.',
    ogTitle: 'Stylish Name Generator — BioCraft',
    ogDescription: '24 stylish Unicode variants of your name, one-tap copy, free and private.',
  },
  {
    path: '/fancy-font-generator',
    title: 'Fancy Font Generator — BioCraft Social Media Toolkit',
    description:
      'Convert any text into 24 fancy Unicode fonts — bold, italic, script, monospace, fullwidth and more. Copy in one tap, free, private, no sign-up.',
    ogTitle: 'Fancy Font Generator — BioCraft',
    ogDescription: 'Any text in 24 fancy Unicode fonts, one-tap copy, free and private.',
  },
  {
    path: '/username-generator',
    title: 'Username Generator — BioCraft Social Media Toolkit',
    description:
      'Twelve unique handle ideas from your name — vibes, length control, dots, underscores, keyword blends. Devanagari transliterated. Free, private, no sign-up.',
    ogTitle: 'Username Generator — BioCraft',
    ogDescription: '12 unique username ideas from your name — free and private.',
  },
  {
    path: '/emoji-symbol-generator',
    title: 'Emoji & Symbol Generator — BioCraft Social Media Toolkit',
    description:
      'Search and copy 300+ curated Unicode symbols and emoji — hearts, stars, arrows, shapes and more. One-tap copy, free and private.',
    ogTitle: 'Emoji & Symbol Generator — BioCraft',
    ogDescription: '300+ curated Unicode symbols and emoji, searchable, one-tap copy, free and private.',
  },
  {
    path: '/hashtag-generator',
    title: 'Hashtag Generator — BioCraft Social Media Toolkit',
    description:
      'Generate relevant, deduplicated hashtags for 12 niches in English or Hindi — broad, medium and focused mix. Free, private, no reach promises.',
    ogTitle: 'Hashtag Generator — BioCraft',
    ogDescription: 'Relevant deduplicated hashtags for 12 niches, EN & Hindi — free and private.',
  },
  {
    path: '/caption-generator',
    title: 'Caption Generator — BioCraft Social Media Toolkit',
    description:
      'Five unique captions for 12 topics in seven tones — casual, professional, funny, inspirational, minimal and more — EN or Hindi. One-tap copy.',
    ogTitle: 'Caption Generator — BioCraft',
    ogDescription: 'Five unique captions per run — 12 topics, EN & Hindi, one-tap copy.',
  },
  {
    path: '/linkedin-headline-generator',
    title: 'LinkedIn Headline Generator — BioCraft Social Media Toolkit',
    description:
      'Five rule-based LinkedIn headline options — Role | Value | Proof patterns, ≤220 characters, no clichés generator, free, private, no sign-up.',
    ogTitle: 'LinkedIn Headline Generator — BioCraft',
    ogDescription: 'Five professional LinkedIn headlines, ≤220 characters, free and private.',
  },
  {
    path: '/linkedin-summary-generator',
    title: 'LinkedIn Summary Generator — BioCraft Social Media Toolkit',
    description:
      'Five structured LinkedIn About-section drafts — role, focus and strengths, no invented facts, rule-based, free, private, ≤2,600 characters.',
    ogTitle: 'LinkedIn Summary Generator — BioCraft',
    ogDescription: 'Five professional LinkedIn About drafts, rule-based, free and private.',
  },
  {
    path: '/features',
    title: 'Features — BioCraft Social Media Toolkit',
    description:
      'Everything BioCraft does: nine generators, six platform workspaces, Hindi + English output, private browser-side processing, zero sign-up.',
    ogTitle: 'BioCraft Features',
    ogDescription: 'Nine generators, six platforms, EN & Hindi, free and private.',
  },
  {
    path: '/use-cases',
    title: 'Use Cases — BioCraft Social Media Toolkit',
    description:
      'Who BioCraft is for: creators, freelancers, small businesses, students and Hindi-first writers — with the exact tools for each job.',
    ogTitle: 'BioCraft Use Cases',
    ogDescription: 'Real scenarios: creators, freelancers, small businesses, students.',
  },
  {
    path: '/pricing',
    title: 'Pricing — BioCraft Social Media Toolkit',
    description:
      'BioCraft is free. Every tool, every platform, every run — $0, forever. No tiers, no trials, no sign-up, no limits.',
    ogTitle: 'BioCraft Pricing',
    ogDescription: 'Free forever. Every tool, every platform. $0, no sign-up.',
  },
  {
    path: '/blog',
    title: 'Blog — BioCraft Social Media Toolkit',
    description:
      'Three short, honest guides: writing an Instagram bio that fits 150 characters, hashtags without the hype, and what stylish Unicode text can and cannot do.',
    ogTitle: 'BioCraft Blog',
    ogDescription: 'Honest, practical guides for better social profiles.',
  },
  {
    path: '/categories',
    title: 'Categories — BioCraft Social Media Toolkit',
    description:
      'Every BioCraft category in one place — bio generators, stylish names, fonts, usernames, hashtags, captions, emoji, symbols and LinkedIn tools. Free, private, no sign-up.',
    ogTitle: 'BioCraft Categories',
    ogDescription: 'Browse the BioCraft toolkit by category — bios, names, fonts, hashtags, captions and more.',
  },
  {
    path: '/resources',
    title: 'Resources — BioCraft Social Media Toolkit',
    description:
      'Every BioCraft tool and guide in one place — bio, fonts, usernames, symbols, hashtags, captions, LinkedIn generators and our three blog guides.',
    ogTitle: 'BioCraft Resources',
    ogDescription: 'Every BioCraft tool and guide, one page.',
  },
  {
    path: '/about',
    title: 'About BioCraft — Social Media Toolkit',
    description:
      'What BioCraft is, why it exists and how it works: a free, private, rule-based toolkit for social profiles — EN & Hindi, no sign-up, no AI APIs.',
    ogTitle: 'About BioCraft',
    ogDescription: 'A free, private, rule-based social toolkit. EN & Hindi, no sign-up.',
  },
  {
    path: '/help',
    title: 'Help Center — BioCraft Social Media Toolkit',
    description:
      'Answers to common BioCraft questions: copy problems, character limits, Devanagari, username availability, privacy and reporting bugs.',
    ogTitle: 'BioCraft Help Center',
    ogDescription: 'Copy issues, limits, Devanagari, privacy — quick honest answers.',
  },
  {
    path: '/contact',
    title: 'Contact Us — BioCraft Social Media Toolkit',
    description:
      'How to reach BioCraft: honest bug-reporting guidance and what to expect — we run no support desk and see none of your data.',
    ogTitle: 'Contact BioCraft',
    ogDescription: 'Honest bug-reporting and support expectations for BioCraft.',
  },
  {
    path: '/login',
    title: 'Login — BioCraft Social Media Toolkit',
    description:
      'There is no login at BioCraft — no accounts, no passwords, no sign-up. Everything runs free and private in your browser, by design.',
    ogTitle: 'BioCraft — No Login Needed',
    ogDescription: 'No accounts, no passwords. Everything free and private, in your browser.',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — BioCraft Social Media Toolkit',
    description:
      'BioCraft collects nothing: no accounts, no cookies, no analytics, no uploads. All processing happens locally in your browser.',
    ogTitle: 'BioCraft Privacy Policy',
    ogDescription: 'No accounts, no cookies, no analytics, no uploads — nothing leaves your browser.',
  },
  {
    path: '/terms',
    title: 'Terms of Service — BioCraft Social Media Toolkit',
    description:
      'Terms for using BioCraft: free use as-is, no warranties, your generated text is yours, trademarks belong to their owners.',
    ogTitle: 'BioCraft Terms of Service',
    ogDescription: 'Free to use, as-is, no warranties. Your text is yours.',
  },
  {
    path: '/cookie',
    title: 'Cookie Policy — BioCraft Social Media Toolkit',
    description:
      'BioCraft sets no cookies and uses no web storage — everything runs in memory in your browser. Verify it yourself in DevTools.',
    ogTitle: 'BioCraft Cookie Policy',
    ogDescription: 'No cookies, no storage. Here is how to verify.',
  },
];

const template = readFileSync(join(dist, 'index.html'), 'utf8');

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const replaceOrThrow = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`build-shells: could not patch ${label} — index.html template changed?`);
  }
  return html.replace(pattern, replacement);
};

for (const route of ROUTES) {
  if (route.runAsTemplate) continue;
  let html = template;
  html = replaceOrThrow(
    html,
    /<title>[^<]*<\/title>/,
    () => `<title>${escapeAttr(route.title)}</title>`,
    `${route.path} <title>`,
  );
  html = replaceOrThrow(
    html,
    /(<meta\s+name="description"\s+content=")[^"]*(")/,
    (_, open, close) => `${open}${escapeAttr(route.description)}${close}`,
    `${route.path} meta description`,
  );
  html = replaceOrThrow(
    html,
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    (_, open, close) => `${open}${escapeAttr(route.ogTitle)}${close}`,
    `${route.path} og:title`,
  );
  html = replaceOrThrow(
    html,
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/s,
    (_, open, close) => `${open}${escapeAttr(route.ogDescription)}${close}`,
    `${route.path} og:description`,
  );
  html = replaceOrThrow(
    html,
    /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
    (_, open, close) => `${open}${escapeAttr(route.ogTitle)}${close}`,
    `${route.path} twitter:title`,
  );
  html = replaceOrThrow(
    html,
    /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
    (_, open, close) => `${open}${escapeAttr(route.ogDescription)}${close}`,
    `${route.path} twitter:description`,
  );

  const outDir = join(dist, route.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf8');
  console.log(`shell written: dist${route.path}/index.html`);
}

console.log(`build-shells: ${ROUTES.length} route shell(s) generated`);
