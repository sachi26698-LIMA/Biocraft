import type { ReactNode } from 'react';
import { handleAnchorClick } from '../lib/router';

export interface InfoSection {
  heading: string;
  body: ReactNode;
}

export interface InfoPageMeta {
  path: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  heading: string;
  lede: string;
  sections: InfoSection[];
  /** Optional cross-links rendered at the foot of the page. */
  crossLinks?: Array<{ label: string; href: string }>;
}

/**
 * Registry of the static information pages. Every route is a real route with
 * a matching server-rendered shell (scripts/build-shells.mjs); every claim
 * below is accurate about what BioCraft actually does.
 */
export const INFO_PAGES: InfoPageMeta[] = [
  {
    path: '/features',
    title: 'Features — BioCraft Social Media Toolkit',
    description:
      'Everything BioCraft does: twelve generators, eight platform workspaces, English + Hindi + Hinglish output, private browser-side processing, zero sign-up.',
    ogTitle: 'BioCraft Features',
    ogDescription: 'Twelve generators, eight platforms, EN · Hindi · Hinglish, free and private.',
    heading: 'Features',
    lede: 'Twelve generators across eight platform workspaces — everything listed here works today, in your browser, for free.',
    sections: [
      {
        heading: 'The generators',
        body: (
          <ul>
            <li><strong>Bio Generator</strong> — five unique bios per run. English, Hindi or Hinglish, personal or by category, with your platform’s real character limit (Instagram 150, Facebook 101, Threads 150, TikTok 80, X 160, LinkedIn 2,600, WhatsApp 139, Snapchat ≈150).</li>
            <li><strong>Stylish Name Generator</strong> — your display name in 33 Unicode text styles with one-tap copy — plus optional crown, gaming and attitude frames; honest about Devanagari.</li>
            <li><strong>Fancy Font Generator</strong> — any text in 33 fancy Unicode fonts, with copy-all.</li>
            <li><strong>Design Studio</strong> — type any sentence, get ready-made designs: 33 Unicode fonts × 20 emoji frames × 18 designer card styles. Live preview plus a gallery of curated mixes, one-tap copy.</li>
            <li><strong>Username Generator</strong> — twelve unique, rule-valid handles per run, four vibes, three lengths, EN/हिन्दी labels. Availability is never claimed — Instagram decides.</li>
            <li><strong>Emoji &amp; Symbol Generator</strong> — 531 curated, deduplicated Unicode glyphs across 24 categories, with English and Hindi search, favourites and recents.</li>
            <li><strong>Hashtag Generator</strong> — 10/20/30 deduplicated hashtags for 14 niches, English, Hindi or Hinglish, broad + medium + focused mix. Never promises reach.</li>
            <li><strong>Caption Generator</strong> — exactly five unique captions for 12 topics in eight tones, English, Hindi or Hinglish, emoji on/off, optional CTA.</li>
            <li><strong>LinkedIn Headline Generator</strong> — five professional headlines ≤ 220 characters (Role · Value · Proof).</li>
            <li><strong>LinkedIn Summary Generator</strong> — five structured About-section drafts ≤ 2,600 characters, built only from your inputs.</li>
            <li><strong>WhatsApp Status Generator</strong> — five statuses per run in English, Hindi or Hinglish, nine hand-written vibes, About-limit 139.</li>
            <li><strong>Snapchat Caption Generator</strong> — five captions per run in English, Hindi or Hinglish.</li>
            <li><strong>Bio Editor</strong> (<a onClick={handleAnchorClick} href="/bio-editor">/bio-editor</a>) — hand-build your bio: platform counters, 33 Unicode fonts, dividers, emoji quick-insert, 18 designer card previews, copy the exact text.</li>
          </ul>
        ),
      },
      {
        heading: 'Eight platform workspaces',
        body: (
          <p>
            Instagram, Facebook, Threads, TikTok, X, LinkedIn, WhatsApp and Snapchat each get a purpose-built workspace:
            the tools that make sense for it, its real character limits, and its accent colour —
            while the BioCraft identity stays constant. Switch platforms from the pills row above
            any tool.
          </p>
        ),
      },
      {
        heading: 'Private by design',
        body: (
          <p>
            BioCraft has no backend. Every generator is rule-based code shipped to your browser:
            nothing you type is uploaded, stored or logged, there are no accounts and no analytics.
            The only network traffic is your browser fetching the static site itself.
          </p>
        ),
      },
      {
        heading: 'Honest limits',
        body: (
          <ul>
            <li>Unicode “fonts” are styled code points — they can look different across devices and break in some apps.</li>
            <li>Devanagari has no styled Unicode alphabets; Hindi passes through unchanged and the tools say so.</li>
            <li>Hashtags cannot guarantee reach; captions cannot guarantee engagement. We never pretend otherwise.</li>
          </ul>
        ),
      },
    ],
  },

  {
    path: '/use-cases',
    title: 'Use Cases — BioCraft Social Media Toolkit',
    description:
      'Who BioCraft is for: creators, freelancers, small businesses, students and Hindi-first writers — with the exact tools for each job.',
    ogTitle: 'BioCraft Use Cases',
    ogDescription: 'Real scenarios: creators, freelancers, small businesses, students.',
    heading: 'Use Cases',
    lede: 'Concrete, everyday jobs BioCraft does well — and the tools to do them with.',
    sections: [
      {
        heading: 'Creators & streamers',
        body: (
          <p>
            Building a presence on Instagram and TikTok? Generate a bio that fits both platforms’
            limits, a display name that stands out in 33 styles, 12 handle ideas, and hashtags for
            your niche — then keep the same voice going into captions. Hindi creators get the same
            tools in Devanagari where Unicode allows it.
          </p>
        ),
      },
      {
        heading: 'Freelancers & solopreneurs',
        body: (
          <p>
            Freelancer Profile? Use the LinkedIn workspace: a headline that says what you do, an
            About section with structure, and a professional bio for Instagram or X. No invented
            metrics, no corporate fluff — your role, your focus, your words.
          </p>
        ),
      },
      {
        heading: 'Small businesses',
        body: (
          <p>
            Restaurants, boutiques, studios and kirana stores need a tight intro line, a consistent
            handle across platforms, and captions that don’t sound like a press release. The Bio
            Generator’s category mode produces ready-to-edit drafts for 12 categories, including
            food, fashion, beauty and business.
          </p>
        ),
      },
      {
        heading: 'Students & job seekers',
        body: (
          <p>
            Replace “passionate learner” clichés with a clear headline and a structured summary.
            The LinkedIn tools give you five honest drafts to react to — edit one into your own
            voice in minutes.
          </p>
        ),
      },
      {
        heading: 'Hindi-first writers & regional creators',
        body: (
          <p>
            Bios, captions and hashtags generate natively in Hindi (Devanagari) — not translations
            bolted on. Search the symbol library with Hindi queries like दिल, आग or तारा and get
            exactly what you asked for.
          </p>
        ),
      },
    ],
  },

  {
    path: '/pricing',
    title: 'Pricing — BioCraft Social Media Toolkit',
    description:
      'BioCraft is free. Every tool, every platform, every run — $0, forever. No tiers, no trials, no sign-up, no limits.',
    ogTitle: 'BioCraft Pricing',
    ogDescription: 'Free forever. Every tool, every platform. $0, no sign-up.',
    heading: 'Pricing',
    lede: 'One plan: everything. Free, forever, no strings.',
    sections: [
      {
        heading: 'BioCraft — Free · $0',
        body: (
          <ul>
            <li>All twelve generators, all eight platform workspaces, unlimited runs</li>
            <li>English, Hindi and Hinglish output where supported</li>
            <li>No account, no email, no credit card, no trial that expires</li>
            <li>No ads, no analytics, no upsells, no “Pro” tier hiding behind this page</li>
            <li>Your text never leaves your browser — there is nothing to buy with your data</li>
          </ul>
        ),
      },
      {
        heading: 'Why it’s free',
        body: (
          <p>
            BioCraft is a static website with the generators built in. There are no AI APIs, no
            servers computing your bios and no usage meters to pay for — the cost is, effectively,
            hosting static files. Keeping it free is the business model: there isn’t one, and that
            is the point.
          </p>
        ),
      },
      {
        heading: 'Honest answers',
        body: (
          <>
            <p><strong>Will this become paid?</strong> No paid plan exists, is in development or is planned. If that ever changes, this page will say so first — loudly.</p>
            <p><strong>Is anything rate-limited?</strong> No. Your browser does the work, so you can’t exhaust a quota.</p>
            <p><strong>Do you sell my data?</strong> We never receive your data. There is nothing to sell.</p>
          </>
        ),
      },
    ],
  },

  {
    path: '/blog',
    title: 'Blog — BioCraft Social Media Toolkit',
    description:
      'Three short, honest guides: writing an Instagram bio that fits 150 characters, hashtags without the hype, and what stylish Unicode text can and cannot do.',
    ogTitle: 'BioCraft Blog',
    ogDescription: 'Honest, practical guides for better social profiles.',
    heading: 'Blog',
    lede: 'Short, practical guides written by us — no growth-hack theatre, no recycled listicles.',
    sections: [
      {
        heading: 'How to write an Instagram bio that fits 150 characters',
        body: (
          <>
            <p>Instagram gives you 150 characters — about two short lines. The bios that earn their keep do three things in order: <strong>say what you do</strong> (one concrete phrase, not “dreamer”), <strong>name who it’s for or what makes you different</strong>, and <strong>give one action</strong> (“new work every Tuesday”, “book via DM”).</p>
            <p>What to drop: job-title soup (“Founder | CEO | Speaker | Mentor”), decorative emoji walls, and anything you wouldn’t say out loud. A useful test: read it aloud to a friend who’s never met you. If they can’t repeat what you do, rewrite.</p>
            <p>Our Bio Generator builds drafts in exactly this shape — English, Hindi or Hinglish, five at a time, within the limit. Treat them as clay, not scripture: keep the skeleton, swap in your own words, and you’ll end up with a bio that sounds like you on a well-written day.</p>
          </>
        ),
      },
      {
        heading: 'Hashtags that work — without the hype',
        body: (
          <>
            <p>Hashtags don’t summon reach. What they do is <em>categorise</em> your post so Instagram can file it correctly — useful for niche discovery, follow-hashtag feeds and search, not virality. Anyone selling a “hashtag reach guarantee” is selling weather forecasts.</p>
            <p>A sane mix: mostly <strong>broad</strong> tags for topic-level discovery (#photography), a good chunk of <strong>medium</strong> tags for community (#streetphotographyindia), and a few <strong>focused</strong> tags where you can genuinely rank (#ahmedabadphotographer). Twenty well-chosen tags beat thirty generic ones.</p>
            <p>Our Hashtag Generator builds exactly that mix for 14 niches in English, Hindi or Hinglish, deduplicated, with your own keywords blended in. Rotate sets between posts; track what brings profile visits, not likes.</p>
          </>
        ),
      },
      {
        heading: 'What stylish Unicode text can and cannot do',
        body: (
          <>
            <p>“Fancy fonts” for Instagram aren’t font files — they’re look-alike Unicode code points from the Mathematical Alphanumeric Symbols block (𝐛𝐨𝐥𝐝, 𝓈𝒸𝓇𝒾𝓅𝓉, 𝔣𝔯𝔞𝔨𝔱𝔲𝔯). Anyone can copy them; no app needs to install anything.</p>
            <p>The catches: (1) Some apps filter or down-rank these characters — they can trip link-preview and spam heuristics in extreme cases. (2) Screen readers may read them letter-by-letter (“mathematical bold small h…”), which is why we keep them out of body copy and encourage them in display contexts like display names. (3) <strong>Devanagari has no styled equivalents.</strong> Hindi text passes through unchanged, and any tool claiming “stylish Hindi fonts” is faking it with images.</p>
            <p>BioCraft ships 33 honest Unicode styles with one-tap copy and tells you plainly when the input passes through. That’s the entire trick — no magic, no fonts to install.</p>
          </>
        ),
      },
    ],
    crossLinks: [
      { label: 'Bio Generator', href: '/bio-generator' },
      { label: 'Hashtag Generator', href: '/hashtag-generator' },
      { label: 'Stylish Name Generator', href: '/stylish-name-generator' },
    ],
  },

  {
    path: '/resources',
    title: 'Resources — BioCraft Social Media Toolkit',
    description:
      'Every BioCraft tool and guide in one place — bio, fonts, Design Studio, usernames, symbols, hashtags, captions, LinkedIn generators and our three blog guides.',
    ogTitle: 'BioCraft Resources',
    ogDescription: 'Every BioCraft tool and guide, one page.',
    heading: 'Resources',
    lede: 'Every tool and every guide on this site, in one index. No newsletter, no gated PDFs.',
    sections: [
      {
        heading: 'All tools',
        body: (
          <ul>
            <li><a onClick={handleAnchorClick} href="/bio-generator">Bio Generator</a> — bios for all eight platforms, EN/हिन्दी/Hinglish</li>
            <li><a onClick={handleAnchorClick} href="/stylish-name-generator">Stylish Name Generator</a> — 33 Unicode styles + name frames</li>
            <li><a onClick={handleAnchorClick} href="/fancy-font-generator">Fancy Font Generator</a> — 33 fonts, copy all</li>
            <li><a onClick={handleAnchorClick} href="/design-studio">Design Studio</a> — any sentence → ready-made font + emoji + card designs</li>
            <li><a onClick={handleAnchorClick} href="/username-generator">Username Generator</a> — 12 handles, four vibes</li>
            <li><a onClick={handleAnchorClick} href="/emoji-symbol-generator">Emoji &amp; Symbol Generator</a> — 531 searchable glyphs</li>
            <li><a onClick={handleAnchorClick} href="/hashtag-generator">Hashtag Generator</a> — 14 niches, EN/हिन्दी/Hinglish, copy all</li>
            <li><a onClick={handleAnchorClick} href="/caption-generator">Caption Generator</a> — 5 captions, 7 tones, EN/हिन्दी/Hinglish</li>
            <li><a onClick={handleAnchorClick} href="/linkedin-headline-generator">LinkedIn Headline Generator</a> — 5 headlines ≤ 220 chars</li>
            <li><a onClick={handleAnchorClick} href="/linkedin-summary-generator">LinkedIn Summary Generator</a> — 5 About drafts ≤ 2,600 chars</li>
            <li><a onClick={handleAnchorClick} href="/whatsapp-status-generator">WhatsApp Status Generator</a> — statuses in EN/हिन्दी/Hinglish</li>
            <li><a onClick={handleAnchorClick} href="/snapchat-caption-generator">Snapchat Caption Generator</a> — captions in EN/हिन्दी/Hinglish</li>
            <li><a onClick={handleAnchorClick} href="/bio-editor">Bio Editor</a> — hand-build your bio with designer previews</li>
          </ul>
        ),
      },
      {
        heading: 'Guides',
        body: (
          <ul>
            <li><a onClick={handleAnchorClick} href="/blog">How to write an Instagram bio that fits 150 characters</a></li>
            <li><a onClick={handleAnchorClick} href="/blog">Hashtags that work — without the hype</a></li>
            <li><a onClick={handleAnchorClick} href="/blog">What stylish Unicode text can and cannot do</a></li>
          </ul>
        ),
      },
      {
        heading: 'How BioCraft works',
        body: (
          <p>
            BioCraft is a static site. Every generator is rule-based code that runs entirely in your
            browser — once the page has loaded, the tools keep working even if your connection
            drops. Nothing you type is uploaded, stored or seen by anyone, including us.
          </p>
        ),
      },
      {
        heading: 'Need help?',
        body: (
          <p>
            <a onClick={handleAnchorClick} href="/help">Visit the Help Center</a> for answers to copy problems, Devanagari
            limits, per-platform character counts and more — or see <a onClick={handleAnchorClick} href="/contact">Contact Us</a>{' '}
            for what to include in a bug report.
          </p>
        ),
      },
    ],
  },

  {
    path: '/about',
    title: 'About BioCraft — Social Media Toolkit',
    description:
      'What BioCraft is, why it exists and how it works: a free, private, rule-based toolkit for social profiles — EN · Hindi · Hinglish, no sign-up, no AI APIs.',
    ogTitle: 'About BioCraft',
    ogDescription: 'A free, private, rule-based social toolkit. EN · Hindi · Hinglish, no sign-up.',
    heading: 'About BioCraft',
    lede: 'BioCraft is a small, opinionated toolkit for one specific itch: making social profiles without handing your data to a “growth” app.',
    sections: [
      {
        heading: 'What BioCraft is',
        body: (
          <p>
            BioCraft is a collection of generators for social media profiles and captions: bios,
            usernames, display names, fancy text, symbols, hashtags, captions and LinkedIn
            headlines and summaries — for Instagram, Facebook, Threads, TikTok, X and LinkedIn.
            Everything runs locally in your browser. It is free because it is static code, not
            because a VC said so.
          </p>
        ),
      },
      {
        heading: 'Principles',
        body: (
          <ul>
            <li><strong>Free, honestly.</strong> No tiers, no trials, no fake scarcity.</li>
            <li><strong>Private, structurally.</strong> No accounts, no uploads, no analytics, no cookies. There is no server to leak.</li>
            <li><strong>Rule-based, not AI-washed.</strong> The generators are deterministic templates and curated pools — you can read how they work, and they never pretend otherwise.</li>
            <li><strong>Honest about limits.</strong> Unicode fonts break in some apps; Devanagari has no styled glyphs; hashtags don’t guarantee reach. We say these out loud.</li>
            <li><strong>English, हिन्दी and Hinglish.</strong> Not an afterthought translation — first-class output where the writing supports it.</li>
          </ul>
        ),
      },
      {
        heading: 'Who it’s for',
        body: (
          <p>
            Creators, freelancers, small businesses, students, and anyone writing bios in English
            or Hindi who would rather not install another app, create another account or feed
            another model their text.
          </p>
        ),
      },
      {
        heading: 'Not affiliated',
        body: (
          <p>
            BioCraft is an independent project and is not affiliated with, endorsed by or connected
            to Instagram, Facebook, Threads, TikTok, X Corp or Microsoft (LinkedIn). Those names and
            marks belong to their respective owners. Generated text is yours to use.
          </p>
        ),
      },
    ],
  },

  {
    path: '/help',
    title: 'Help Center — BioCraft Social Media Toolkit',
    description:
      'Answers to common BioCraft questions: copy problems, character limits, Devanagari, username availability, privacy and reporting bugs.',
    ogTitle: 'BioCraft Help Center',
    ogDescription: 'Copy issues, limits, Devanagari, privacy — quick honest answers.',
    heading: 'Help Center',
    lede: 'Quick, honest answers to the questions we actually hear. Still stuck? See Contact Us.',
    sections: [
      {
        heading: 'Copying isn’t working',
        body: (
          <p>
            Clipboard access requires a secure context and a user tap. Use the copy buttons
            (they’re the whole point of the tool), and if a copy ever fails, the button says
            “Try again” and the status message explains — just long-press/select the text and copy
            manually as a fallback.
          </p>
        ),
      },
      {
        heading: 'My Hindi text stays unchanged in “fancy fonts”',
        body: (
          <p>
            By design. Unicode styled alphabets exist only for Latin letters and digits — there is
            no “bold Devanagari” code block. Hindi passes through unchanged in every Unicode style,
            and the tool tells you so instead of faking it.
          </p>
        ),
      },
      {
        heading: 'Character limits by platform',
        body: (
          <ul>
            <li>Instagram bio: 150 · Facebook intro: 101 · Threads bio: 150</li>
            <li>TikTok bio: 80 (tight on purpose — we use identity-only templates there)</li>
            <li>X bio: 160</li>
            <li>LinkedIn headline: 220 · LinkedIn About: 2,600</li>
            <li>WhatsApp About: 139 · Snapchat bio: ≈150 (Snapchat does not publish it — BioCraft treats it as a reference, not a guarantee)</li>
            <li>Instagram captions: 2,200 (BioCraft keeps all generated captions far below it)</li>
          </ul>
        ),
      },
      {
        heading: 'Why can’t BioCraft check if my username is available?',
        body: (
          <p>
            Checking availability means querying Instagram at scale — there is no free, authorized
            public API for it, and scraping breaks the moment Instagram changes markup. Handles
            follow Instagram’s character rules, but availability is decided by Instagram, not by us.
          </p>
        ),
      },
      {
        heading: 'Is my text uploaded anywhere?',
        body: (
          <p>
            No. Every generator runs locally. There is no backend, no analytics, no form to fill.
            You can verify this yourself: open DevTools → Network, use the tools, and watch — the
            only requests are for the site’s own files.
          </p>
        ),
      },
      {
        heading: 'Reporting a bug',
        body: (
          <p>
            Reload, reproduce once, then note: the tool, the exact input, what happened, and any
            red text in the browser console (F12 → Console). Send that through the channel you
            found BioCraft on, or via <a onClick={handleAnchorClick} href="/contact">Contact Us</a> — it’s genuinely the fastest
            fix.
          </p>
        ),
      },
    ],
  },

  {
    path: '/contact',
    title: 'Contact Us — BioCraft Social Media Toolkit',
    description:
      'How to reach BioCraft: honest bug-reporting guidance and what to expect — we run no support desk and see none of your data.',
    ogTitle: 'Contact BioCraft',
    ogDescription: 'Honest bug-reporting and support expectations for BioCraft.',
    heading: 'Contact Us',
    lede: 'The honest version: BioCraft is a free static site without a support desk — but you are not stuck.',
    sections: [
      {
        heading: 'Before you write in',
        body: (
          <p>
            Because BioCraft runs entirely in your browser, we cannot see your inputs, your device
            or your clipboard — so we can’t “look into your account” (there is neither an account
            nor a server to inspect). Most reports are resolved in minutes by the{' '}
            <a onClick={handleAnchorClick} href="/help">Help Center</a>: copy failures, Devanagari notes, limits and refresh
            quirks are all covered there.
          </p>
        ),
      },
      {
        heading: 'What a great bug report looks like',
        body: (
          <ol>
            <li>Which tool and platform workspace (e.g. Hashtags · Instagram)</li>
            <li>Exactly what you typed (synthetic example data is fine)</li>
            <li>What you expected vs. what happened</li>
            <li>Browser and device, plus any red errors from DevTools → Console</li>
          </ol>
        ),
      },
      {
        heading: 'Where to send it',
        body: (
          <p>
            BioCraft is built and maintained by a small independent project. The fastest path today
            is the channel you discovered BioCraft through — if you arrived via a shared link,
            replying there reaches the team; if you found it on your own, the Help Center covers
            every known failure mode, and fixes ship as site updates without any action from you.
          </p>
        ),
      },
      {
        heading: 'What we will never do',
        body: (
          <p>
            We will never ask for your Instagram or other platform passwords, and you should never
            share them with anyone. BioCraft works without them by design.
          </p>
        ),
      },
    ],
  },

  {
    path: '/login',
    title: 'Login — BioCraft Social Media Toolkit',
    description:
      'There is no login at BioCraft — no accounts, no passwords, no sign-up. Everything runs free and private in your browser, by design.',
    ogTitle: 'BioCraft — No Login Needed',
    ogDescription: 'No accounts, no passwords. Everything free and private, in your browser.',
    heading: 'No Account Needed — On Purpose',
    lede: 'You clicked Login and landed here: BioCraft has no login, because there is nothing to log in to. Every tool works instantly and free, right in your browser.',
    sections: [
      {
        heading: 'Why BioCraft has no accounts',
        body: (
          <ul>
            <li><strong>Nothing to protect.</strong> Accounts exist to guard your saved data — BioCraft saves nothing. Your text lives in the page, in memory, and nowhere else.</li>
            <li><strong>Nothing to breach.</strong> No database of emails, no password hashes, no profiles — so leaking them is impossible.</li>
            <li><strong>Nothing to forget.</strong> No passwords to reset, no sessions to expire, no “continue with…” screens.</li>
            <li><strong>Nothing between you and the tools.</strong> Free forever, no trial countdowns, no “upgrade to unlock”.</li>
          </ul>
        ),
      },
      {
        heading: 'What this means for your privacy',
        body: (
          <p>
            Every BioCraft generator runs entirely in your browser: the name you type, the bio you
            generate, the hashtags you copy — none of it is transmitted, stored, logged or analysed.
            There are no cookies, no web storage and no analytics. Close the tab and the page
            forgets everything. Read the{' '}
            <a href="/privacy" onClick={handleAnchorClick}>privacy policy</a> or the{' '}
            <a href="/cookie" onClick={handleAnchorClick}>cookie policy</a> for the full detail —
            both are short, because there is almost nothing to disclose.
          </p>
        ),
      },
      {
        heading: 'So how do you use BioCraft?',
        body: (
          <p>
            Exactly like this: open a tool and make something. Try the{' '}
            <a href="/bio-generator" onClick={handleAnchorClick}>Bio Generator</a>, the{' '}
            <a href="/username-generator" onClick={handleAnchorClick}>Username Generator</a> or{' '}
            <a href="/caption-generator" onClick={handleAnchorClick}>Caption Generator</a> — or see{' '}
            <a href="/resources" onClick={handleAnchorClick}>everything in one place</a>. No unlock
            codes, no email required, ever.
          </p>
        ),
      },
    ],
    crossLinks: [
      { label: 'All tools', href: '/resources' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Help center', href: '/help' },
    ],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — BioCraft Social Media Toolkit',
    description:
      'BioCraft collects nothing: no accounts, no cookies, no analytics, no uploads. All processing happens locally in your browser.',
    ogTitle: 'BioCraft Privacy Policy',
    ogDescription: 'No accounts, no cookies, no analytics, no uploads — nothing leaves your browser.',
    heading: 'Privacy Policy',
    lede: 'Short version: we can’t leak what we never receive. Here is the long version.',
    sections: [
      {
        heading: 'What we collect',
        body: (
          <p>
            Nothing. BioCraft has no sign-up, no forms that transmit data, no analytics, no
            advertising, no error-reporting beacon and no cookies. There is no server-side account
            database — the site is static files plus client-side code.
          </p>
        ),
      },
      {
        heading: 'What stays on your device',
        body: (
          <p>
            Everything you type — names, bios, keywords — is processed in your browser’s memory and
            is discarded when you close the tab. BioCraft uses no localStorage, sessionStorage or
            IndexedDB. Your clipboard is only written to, and only when you tap a copy button.
          </p>
        ),
      },
      {
        heading: 'Hosting note',
        body: (
          <p>
            BioCraft is served as static files by a web host. Like any web server, that host may
            keep standard access logs (IP address, file requested, time). Those logs belong to the
            host, not to us, and contain no information about what you typed into the tools.
          </p>
        ),
      },
      {
        heading: 'Children',
        body: (
          <p>
            BioCraft is not directed at children under 13 and knowingly collects no data from
            anyone, including children.
          </p>
        ),
      },
      {
        heading: 'Changes to this policy',
        body: (
          <p>
            If the data posture of this site ever changes (for example, if an optional account is
            introduced), this page — and only this page — will be updated first, with a dated
            notice. Last updated: November 2026.
          </p>
        ),
      },
    ],
  },

  {
    path: '/terms',
    title: 'Terms of Service — BioCraft Social Media Toolkit',
    description:
      'Terms for using BioCraft: free use as-is, no warranties, your generated text is yours, trademarks belong to their owners.',
    ogTitle: 'BioCraft Terms of Service',
    ogDescription: 'Free to use, as-is, no warranties. Your text is yours.',
    heading: 'Terms of Service',
    lede: 'Fair, plain-language terms for a free tool. Not legal advice — we are not lawyers.',
    sections: [
      {
        heading: 'Use of the service',
        body: (
          <p>
            BioCraft is free to use for personal and commercial purposes. Use it lawfully: not to
            impersonate others, infringe trademarks, spam, deceive, or generate content that breaks
            the rules of the platforms you post to. You are responsible for what you publish.
          </p>
        ),
      },
      {
        heading: 'Your content and your drafts',
        body: (
          <p>
            Drafts generated by BioCraft — bios, captions, handles, headlines — are yours to use,
            edit and publish, with no attribution required and no royalties owed. BioCraft claims
            no rights over output you create with it.
          </p>
        ),
      },
      {
        heading: 'No warranties',
        body: (
          <p>
            BioCraft is provided “as is”, without warranty of any kind. We don’t guarantee that
            generated text is accurate, unique, platform-compliant, or that handles will be
            available. Unicode rendering varies by device and app — test before you publish.
          </p>
        ),
      },
      {
        heading: 'Trademarks',
        body: (
          <p>
            Instagram, Facebook, Threads, TikTok, X and LinkedIn are trademarks of their respective
            owners (Meta Platforms, ByteDance, X Corp, Microsoft). BioCraft is an independent tool
            and is not affiliated with, sponsored or endorsed by any of them.
          </p>
        ),
      },
      {
        heading: 'Limitation of liability',
        body: (
          <p>
            To the maximum extent permitted by law, BioCraft’s operators are not liable for any
            damages arising from use of the site or its outputs — including lost accounts, rejected
            handles or posts that underperform. The tools are free; use them with the same judgement
            you’d apply to any draft.
          </p>
        ),
      },
    ],
  },

  {
    path: '/cookie',
    title: 'Cookie Policy — BioCraft Social Media Toolkit',
    description:
      'BioCraft sets no cookies and uses no web storage — everything runs in memory in your browser. Verify it yourself in DevTools.',
    ogTitle: 'BioCraft Cookie Policy',
    ogDescription: 'No cookies, no storage. Here is how to verify.',
    heading: 'Cookie Policy',
    lede: 'Zero cookies. Zero storage. Nothing to consent to — but here is the proof and the details.',
    sections: [
      {
        heading: 'What we set',
        body: (
          <p>
            Nothing. BioCraft does not create cookies, localStorage, sessionStorage or IndexedDB
            entries. Your preferences (platform, language toggles, emoji switch) live in memory
            only and reset when you close the tab — that is the entire data lifecycle.
          </p>
        ),
      },
      {
        heading: 'Third parties',
        body: (
          <p>
            The site loads no third-party scripts, fonts, pixels or embeds. There is no analytics
            tag, no social widget, no ad network and no CDN-fetched web font — typography is your
            system’s own.
          </p>
        ),
      },
      {
        heading: 'Verify it yourself',
        body: (
          <ol>
            <li>Open DevTools (F12) → Application → Cookies → this site: expect the list to be empty.</li>
            <li>Application → Local Storage / Session Storage: also empty.</li>
            <li>Network tab while using any tool: requests only for the site’s own pages and assets.</li>
          </ol>
        ),
      },
      {
        heading: 'If this ever changes',
        body: (
          <p>
            If a future version introduces optional storage (for example, a saved platform
            preference), it will be disclosed here first, will remain optional, and will never
            include the text you write into the tools. Last updated: November 2026.
          </p>
        ),
      },
    ],
  },
];

export const INFO_PATHS = new Set(INFO_PAGES.map((page) => page.path));

export const infoPageForPath = (path: string): InfoPageMeta | undefined =>
  INFO_PAGES.find((page) => page.path === path);
