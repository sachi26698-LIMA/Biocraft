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
      'Free social media toolkit: Instagram, Facebook, Threads, TikTok, X, LinkedIn, WhatsApp and Snapchat — bios, usernames, captions, hashtags, stylish text, symbols and ready-made bio collections. EN, हिंदी & Hinglish — no sign-up, fully private.',
    ogTitle: 'BioCraft — All-in-One Social Media Toolkit',
    ogDescription:
      'Free social media toolkit for Instagram, Facebook, Threads, TikTok, X, LinkedIn, WhatsApp and Snapchat. EN, हिंदी & Hinglish — no sign-up, fully private.',
    runAsTemplate: true,
  },
  {
    path: '/bio-generator',
    title: 'Bio Generator — BioCraft Social Media Toolkit',
    description:
      'Generate unique bios in English, Hindi or Hinglish — Instagram, Facebook, Threads, TikTok, X, LinkedIn, WhatsApp and Snapchat limits respected. Free, private, no sign-up.',
    ogTitle: 'Bio Generator — BioCraft',
    ogDescription: 'Five unique bios per platform, EN · Hindi · Hinglish, no sign-up, private.',
  },
  {
    path: '/stylish-name-generator',
    title: 'Stylish Name Generator — BioCraft Social Media Toolkit',
    description:
      'Turn your display name into 33 stylish Unicode text variants — bold, script, fraktur, double-struck and more, with optional name frames. One-tap copy, free, private, no sign-up.',
    ogTitle: 'Stylish Name Generator — BioCraft',
    ogDescription: '33 stylish Unicode variants of your name, one-tap copy, free and private.',
  },
  {
    path: '/fancy-font-generator',
    title: 'Fancy Font Generator — BioCraft Social Media Toolkit',
    description:
      'Convert any text into 33 fancy Unicode fonts — bold, italic, script, monospace, fullwidth and more. Copy in one tap, free, private, no sign-up.',
    ogTitle: 'Fancy Font Generator — BioCraft',
    ogDescription: 'Any text in 33 fancy Unicode fonts, one-tap copy, free and private.',
  },
  {
    path: '/design-studio',
    title: 'Design Studio — BioCraft Social Media Toolkit',
    description:
      'Type any sentence and get ready-made designs: 33 Unicode fonts × decorative emoji frames × 18 designer card styles. Mix yours live, or copy a curated mix. Free, private, one-tap copy.',
    ogTitle: 'Design Studio — BioCraft',
    ogDescription: 'Any sentence → ready-made font + emoji + card designs. Live preview, one-tap copy.',
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
      'Search and copy 629 curated Unicode symbols and emoji — hearts, stars, arrows, royal, faith and more. One-tap copy, free and private.',
    ogTitle: 'Emoji & Symbol Generator — BioCraft',
    ogDescription: '629 curated Unicode symbols and emoji, searchable with favourites, free and private.',
  },
  {
    path: '/hashtag-generator',
    title: 'Hashtag Generator — BioCraft Social Media Toolkit',
    description:
      'Generate relevant, deduplicated hashtags for 14 niches in English, Hindi or Hinglish — broad, medium and focused mix. Free, private, no reach promises.',
    ogTitle: 'Hashtag Generator — BioCraft',
    ogDescription: 'Relevant deduplicated hashtags for 14 niches, EN · Hindi · Hinglish — free and private.',
  },
  {
    path: '/caption-generator',
    title: 'Caption Generator — BioCraft Social Media Toolkit',
    description:
      'Five unique captions for 12 topics in eight tones — casual, professional, funny, inspirational, quiet luxury and more — English, Hindi or Hinglish. Optional Unicode frames, one-tap copy.',
    ogTitle: 'Caption Generator — BioCraft',
    ogDescription: 'Five unique captions per run — 12 topics, eight tones, EN · Hindi · Hinglish, one-tap copy.',
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
    path: '/whatsapp-status-generator',
    title: 'WhatsApp Status Generator — BioCraft Social Media Toolkit',
    description:
      'Free WhatsApp status generator — 9 hand-written categories (good morning, attitude, love, birthday, festival, funny, motivational and more) in English, Hindi and Hinglish. Rule-based, private, no sign-up.',
    ogTitle: 'WhatsApp Status Generator — BioCraft',
    ogDescription: 'Status lines for every mood — EN, हिंदी & Hinglish, one-tap copy, free.',
  },
  {
    path: '/snapchat-caption-generator',
    title: 'Snapchat Caption Generator — BioCraft Social Media Toolkit',
    description:
      'Free Snapchat caption generator — streaks, stories, attitude, cute, funny and love captions in English, Hindi and Hinglish. Rule-based, private, no sign-up.',
    ogTitle: 'Snapchat Caption Generator — BioCraft',
    ogDescription: 'Streak, story & vibe captions — EN, हिंदी & Hinglish, one-tap copy.',
  },
  {
    path: '/features',
    title: 'Features — BioCraft Social Media Toolkit',
    description:
      'Everything BioCraft does: twelve generators, eight platform workspaces, English + Hindi + Hinglish output, private browser-side processing, zero sign-up.',
    ogTitle: 'BioCraft Features',
    ogDescription: 'Twelve generators, eight platforms, EN · Hindi · Hinglish, free and private.',
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
    path: '/bio-collections',
    title: 'Ready-Made Bio Collections — BioCraft Social Media Toolkit',
    description:
      '20 ready-made bio collections — 506 original bios in English, Hindi and Hinglish for Instagram and more. Copy any bio in one tap. Free and private.',
    ogTitle: 'Ready-Made Bio Collections — BioCraft',
    ogDescription: '506 original bios across 20 collections — EN, हिंदी and Hinglish. Copy in one tap, free and private.',
  },
  {
    path: '/instagram-bio-for-boys',
    title: 'Instagram Bio for Boys — Ready-Made Mens Bios | BioCraft',
    description:
      'Original, emoji-rich Instagram bios for boys — confidence, hustle, discipline and dreams. Copy any bio in one tap, in English, Hindi and Hinglish. Free and private.',
    ogTitle: 'Instagram Bio for Boys — BioCraft',
    ogDescription: 'Original, emoji-rich Instagram bios for boys — confidence, hustle, discipline and dreams.',
  },
  {
    path: '/instagram-bio-for-girls',
    title: 'Instagram Bio for Girls — Ready-Made Girls Bios | BioCraft',
    description:
      'Fresh Instagram bios for girls — confident, funny, soft, bold and desi. One-tap copy, in English, Hindi and Hinglish. Free, private, no sign-up.',
    ogTitle: 'Instagram Bio for Girls — BioCraft',
    ogDescription: 'Fresh Instagram bios for girls — confident, funny, soft, bold and desi.',
  },
  {
    path: '/stylish-instagram-bio',
    title: 'Stylish Instagram Bio — Fancy Unicode Bios | BioCraft',
    description:
      'Stylish Instagram bios with elegant Unicode type — bold, script, mono and fullwidth lines. One-tap copy, English and Hinglish, free and private.',
    ogTitle: 'Stylish Instagram Bio — BioCraft',
    ogDescription: 'Stylish Instagram bios with elegant Unicode type — bold, script, mono and fullwidth lines.',
  },
  {
    path: '/attitude-bio',
    title: 'Attitude Bio — Confident Instagram Attitude Bios | BioCraft',
    description:
      'Attitude-packed bios: bold, confident and witty without being mean. Copy-ready for Instagram and more, one tap, free and private.',
    ogTitle: 'Attitude Bio — BioCraft',
    ogDescription: 'Attitude-packed bios: bold, confident and witty without being mean.',
  },
  {
    path: '/vip-bio',
    title: 'VIP Bio — Premium Instagram VIP Bios | BioCraft',
    description:
      'VIP-style bios: polished, premium and understated. Elegant Unicode and classy copy-ready lines, English and Hinglish. Free, private, one-tap copy.',
    ogTitle: 'VIP Bio — BioCraft',
    ogDescription: 'VIP-style bios: polished, premium and understated.',
  },
  {
    path: '/love-bio',
    title: 'Love Bio — Romantic Instagram Love Bios | BioCraft',
    description:
      'Sweet, romantic and anniversary-ready love bios — English, Hindi and Hinglish, emoji-rich, one-tap copy. Free and private.',
    ogTitle: 'Love Bio — BioCraft',
    ogDescription: 'Sweet, romantic and anniversary-ready love bios — English, Hindi and Hinglish, emoji-rich, one-tap copy.',
  },
  {
    path: '/sad-bio',
    title: 'Sad Bio — Emotional Sad Instagram Bios | BioCraft',
    description:
      'Poetic, emotional sad bios about healing, heartbreak and growing quietly. One-tap copy, EN · Hindi · Hinglish. Free and private.',
    ogTitle: 'Sad Bio — BioCraft',
    ogDescription: 'Poetic, emotional sad bios about healing, heartbreak and growing quietly.',
  },
  {
    path: '/royal-bio',
    title: 'Royal Bio — Kings & Queens Instagram Bios | BioCraft',
    description:
      'Royal-style bios for him and her — regal, classy and confident. Copy-ready in one tap, EN · Hindi · Hinglish. Free and private.',
    ogTitle: 'Royal Bio — BioCraft',
    ogDescription: 'Royal-style bios for him and her — regal, classy and confident.',
  },
  {
    path: '/simple-bio',
    title: 'Simple Bio — Short Simple Instagram Bios | BioCraft',
    description:
      'Minimal, short and honest Instagram bios — one or two lines, zero clutter. One-tap copy, free and private.',
    ogTitle: 'Simple Bio — BioCraft',
    ogDescription: 'Minimal, short and honest Instagram bios — one or two lines, zero clutter.',
  },
  {
    path: '/cool-bio',
    title: 'Cool Bio — Cool & Funny Instagram Bios | BioCraft',
    description:
      'Cool, funny and effortless bios for Instagram and beyond — witty one-liners and chill lines. One-tap copy, free and private.',
    ogTitle: 'Cool Bio — BioCraft',
    ogDescription: 'Cool, funny and effortless bios for Instagram and beyond — witty one-liners and chill lines.',
  },
  {
    path: '/hindi-bio',
    title: 'Hindi Bio — Best Instagram Bios in Hindi | BioCraft',
    description:
      'Original Instagram bios in Hindi (Devanagari) with Hinglish lines — emotional, funny and reflective. One-tap copy, free and private.',
    ogTitle: 'Hindi Bio — BioCraft',
    ogDescription: 'Original Instagram bios in Hindi (Devanagari) — emotional, funny and reflective.',
  },
  {
    path: '/english-bio',
    title: 'English Bio — Professional Instagram English Bios | BioCraft',
    description:
      'Polished English and Hinglish Instagram bios — crisp, modern and professional. One-tap copy, free and private, for creators and businesses.',
    ogTitle: 'English Bio — BioCraft',
    ogDescription: 'Polished English Instagram bios — crisp, modern and professional.',
  },
  {
    path: '/shree-ram-bio',
    title: 'Shree Ram Bio — Jai Shree Ram Instagram Bios | BioCraft',
    description:
      'Reverent Shree Ram bios in Hindi, Hinglish and English — devotional, peaceful and respectful lines. One-tap copy. Free and private.',
    ogTitle: 'Shree Ram Bio — BioCraft',
    ogDescription: 'Reverent Shree Ram bios in Hindi and English — devotional, peaceful and respectful lines.',
  },
  {
    path: '/facebook-bio',
    title: 'Facebook Bio — Best Facebook Bios & About Lines | BioCraft',
    description:
      'Facebook-ready bios for personal profiles, creators and small businesses. Trustworthy, warm and clear. One-tap copy, free.',
    ogTitle: 'Facebook Bio — BioCraft',
    ogDescription: 'Facebook-ready bios for personal profiles, creators and small businesses.',
  },
  {
    path: '/creator-bio',
    title: 'Creator Bio — Instagram Bios for Content Creators | BioCraft',
    description:
      'Creator bios for YouTubers, streamers and influencers — crisp, discoverable and real. One-tap copy. Free and private.',
    ogTitle: 'Creator Bio — BioCraft',
    ogDescription: 'Creator bios for YouTubers, streamers and influencers — crisp, discoverable and real.',
  },
  {
    path: '/photographer-bio',
    title: 'Photographer Bio — Instagram Bios for Photographers | BioCraft',
    description:
      'Photographer bios for weddings, portraits, street and travel — with booking cues. One-tap copy, free and private.',
    ogTitle: 'Photographer Bio — BioCraft',
    ogDescription: 'Photographer bios for weddings, portraits, street and travel — with booking cues.',
  },
  {
    path: '/student-bio',
    title: 'Student Bio — Instagram Bios for Students & College | BioCraft',
    description:
      'Student bios for school and college — ambitious, funny and real. Eng · Hindi · Hinglish, one-tap copy. Free and private.',
    ogTitle: 'Student Bio — BioCraft',
    ogDescription: 'Student bios for school and college — ambitious, funny and real.',
  },
  {
    path: '/cute-bio',
    title: 'Cute Bio — Sweet Instagram Bios for Her & Him | BioCraft',
    description:
      'Original cute Instagram bios — soft hearts, sparkles and playful warmth. One-tap copy, English, Hindi and Hinglish. Free and private.',
    ogTitle: 'Cute Bio — BioCraft',
    ogDescription: 'Original cute Instagram bios — soft hearts, sparkles and playful warmth.',
  },
  {
    path: '/hinglish-bio',
    title: 'Hinglish Bio — Desi Instagram Bios in Hinglish | BioCraft',
    description:
      'Original Hinglish Instagram bios — chai, hustle, heart and attitude, written the way India actually texts. One-tap copy, free and private.',
    ogTitle: 'Hinglish Bio — BioCraft',
    ogDescription: 'Original Hinglish Instagram bios — written the way India actually texts.',
  },
  {
    path: '/gamer-bio',
    title: 'Gamer Bio — Gaming Instagram Bios That Hit Different | BioCraft',
    description:
      'Original gamer Instagram bios — grind, clutch, squad and endless queue. One-tap copy, English, Hindi and Hinglish. Free and private.',
    ogTitle: 'Gamer Bio — BioCraft',
    ogDescription: 'Original gamer Instagram bios — grind, clutch, squad and endless queue.',
  },
  {
    path: '/bio-editor',
    title: 'Bio Editor — Style & Copy Your Instagram Bio | BioCraft',
    description:
      'Build your bio by hand: platform character limits, Unicode fonts, dividers, emoji and 18 designer card styles with live preview. Free, private, one-tap copy.',
    ogTitle: 'Bio Editor — BioCraft',
    ogDescription: 'Hand-build your bio: Unicode fonts, dividers, emoji and designer card previews.',
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
      'What BioCraft is, why it exists and how it works: a free, private, rule-based toolkit for social profiles — EN · Hindi · Hinglish, no sign-up, no AI APIs.',
    ogTitle: 'About BioCraft',
    ogDescription: 'A free, private, rule-based social toolkit. EN · Hindi · Hinglish, no sign-up.',
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

// Direct links to the temporary diagnostic exist only in this branch's Preview build.
if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_GIT_COMMIT_REF === 'arena/5e351ec3-biocraft') {
  ROUTES.push({
    path: '/preview-diagnostics',
    title: 'Preview Diagnostics — BioCraft',
    description: 'Temporary Preview-only diagnostics.',
    ogTitle: 'Preview Diagnostics — BioCraft',
    ogDescription: 'Temporary Preview-only diagnostics.',
    noindex: true,
  });
  // Noindex static shells for the branch-only, public-data admin preview.
  for (const section of ['', '/users', '/bios', '/categories', '/platforms', '/generators', '/content', '/analytics', '/security', '/settings']) {
    ROUTES.push({ path: `/admin${section}`, title: 'Admin Preview — BioCraft',
      description: 'BioCraft admin workspace preview.', ogTitle: 'Admin Preview — BioCraft',
      ogDescription: 'BioCraft admin workspace preview.', noindex: true });
  }
}

// Optional canonical/og:url generation. Omits them entirely unless the
// production domain is known and passed in — placeholder domains must not ship.
const SITE_URL = (process.env.SITE_URL ?? '').trim().replace(/\/+$/, '');
const canonicalFor = (path) => (SITE_URL ? `  <link rel="canonical" href="${SITE_URL}${path === '/' ? '/' : path}" />\n` : '');

const template = readFileSync(join(dist, 'index.html'), 'utf8');

// Only the small 11 KB common-styles face is hinted, and only where bundled
// content or the font galleries use it. Other math glyphs remain on demand.
const COMMON_MATH_PATHS = new Set([
  '/instagram-bio-for-boys', '/stylish-instagram-bio', '/attitude-bio', '/vip-bio',
  '/sad-bio', '/simple-bio', '/english-bio', '/creator-bio', '/student-bio', '/gamer-bio',
  '/stylish-name-generator', '/fancy-font-generator',
]);
const COMMON_MATH_HREF = '/fonts/noto-math/noto-sans-math-common-400.woff2';
const commonMathPreload = `  <link rel="preload" as="font" type="font/woff2" href="${COMMON_MATH_HREF}" fetchpriority="low" crossorigin />\n`;


const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const replaceOrThrow = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) {
    throw new Error(`build-shells: could not patch ${label} — index.html template changed?`);
  }
  return html.replace(pattern, replacement);
};

for (const route of ROUTES) {
  if (route.runAsTemplate) {
    // The hero exists only on the homepage. Discover the same responsive image
    // before React executes without downloading it on every other route.
    // Some static hosts serve index.html as a fallback for clean URLs. Guard
    // the hint by pathname so that those non-home routes do not fetch the hero.
    const heroPreload = `  <script>if(location.pathname === '/'){const l=document.createElement('link');l.rel='preload';l.as='image';l.href='/laptop-hero-871.webp';l.imageSrcset='/laptop-hero-871.webp 871w, /laptop-hero.webp 1742w';l.imageSizes='(min-width: 1100px) 780px, (min-width: 600px) 560px, 330px';l.fetchPriority='high';document.head.appendChild(l)}</script>\n`;
    // A clean-URL fallback also needs the small route-specific font hint.
    const fontPreload = `  <script>if(${JSON.stringify([...COMMON_MATH_PATHS])}.includes(location.pathname.replace(/\\/$/,''))){const l=document.createElement('link');l.rel='preload';l.as='font';l.type='font/woff2';l.fetchPriority='low';l.href='${COMMON_MATH_HREF}';l.crossOrigin='anonymous';document.head.appendChild(l)}</script>\n`;
    const html = template.replace('<head>', () => `<head>\n${heroPreload}${fontPreload}`).replace('</head>', () => `${canonicalFor(route.path)}  </head>`);
    writeFileSync(join(dist, 'index.html'), html, 'utf8');
    console.log('homepage hero preload injected into: dist/index.html');
    continue;
  }
  let html = COMMON_MATH_PATHS.has(route.path) ? template.replace('<head>', () => `<head>\n${commonMathPreload}`) : template;
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

  if (route.noindex) {
    html = html.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>');
  } else if (SITE_URL) {
    html = html.replace('</head>', () => `${canonicalFor(route.path)}  </head>`);
  }

  const outDir = join(dist, route.path);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html, 'utf8');
  console.log(`shell written: dist${route.path}/index.html`);
}

console.log(`build-shells: ${ROUTES.length} route shell(s) generated`);
