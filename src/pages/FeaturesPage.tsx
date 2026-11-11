import { handleAnchorClick } from '../lib/router';
import {
  ArrowRightIcon,
  AtIcon,
  GridIcon,
  HashIcon,
  InfoIcon,
  LayersIcon,
  LockIcon,
  PhoneIcon,
  QuoteIcon,
  RocketIcon,
  ShareIcon,
  ShieldCheckIcon,
  SmileIcon,
  SparkIcon,
  TypeIcon,
  WandIcon,
  ZapIcon,
} from '../components/icons';
import type { ComponentType } from 'react';

type IconComponent = ComponentType<{ size?: number }>;

interface FeatureTool {
  icon: IconComponent;
  tint: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  blurb: string;
  href: string;
}

/** The whole toolbox, one card per route. Counts are facts, not marketing. */
const FEATURE_TOOLS: FeatureTool[] = [
  { icon: ZapIcon, tint: 1, name: 'Bio Generator', blurb: 'Five unique bios that fit the platform’s character limit. English, Hindi or Hinglish.', href: '/bio-generator' },
  { icon: WandIcon, tint: 2, name: 'Stylish Name Generator', blurb: 'Your display name in 33 Unicode styles — plus crown, gaming and attitude frames.', href: '/stylish-name-generator' },
  { icon: TypeIcon, tint: 3, name: 'Fancy Font Generator', blurb: 'Any text in 33 styled Unicode fonts — with live demo previews, one-tap copy-all.', href: '/fancy-font-generator' },
  { icon: LayersIcon, tint: 4, name: 'Design Studio', blurb: 'One sentence, ready-made designs: Unicode font × emoji frame × card style, live preview.', href: '/design-studio' },
  { icon: AtIcon, tint: 5, name: 'Username Generator', blurb: 'Twelve unique handle ideas, four vibes, three lengths — availability never claimed.', href: '/username-generator' },
  { icon: SmileIcon, tint: 6, name: 'Emoji & Symbol Generator', blurb: '629 curated Unicode glyphs in 24 categories — search, favourite, recents, copy.', href: '/emoji-symbol-generator' },
  { icon: HashIcon, tint: 1, name: 'Hashtag Generator', blurb: '10 / 20 / 30 deduplicated hashtags for 14 niches — broad, medium and focused.', href: '/hashtag-generator' },
  { icon: QuoteIcon, tint: 2, name: 'Caption Generator', blurb: 'Exactly five captions for 12 topics in eight tones, EN / हिन्दी / Hinglish.', href: '/caption-generator' },
  { icon: RocketIcon, tint: 3, name: 'LinkedIn Headline Generator', blurb: 'Five professional headlines of at most 220 characters — role, value, proof.', href: '/linkedin-headline-generator' },
  { icon: GridIcon, tint: 4, name: 'LinkedIn Summary Generator', blurb: 'Five structured About-section drafts ≤ 2,600 characters, built only from your inputs.', href: '/linkedin-summary-generator' },
  { icon: PhoneIcon, tint: 5, name: 'WhatsApp Status Generator', blurb: 'Five statuses per run, nine vibes, sized for the 139-character About limit.', href: '/whatsapp-status-generator' },
  { icon: ShareIcon, tint: 6, name: 'Snapchat Caption Generator', blurb: 'Five captions per run in English, Hindi or Hinglish.', href: '/snapchat-caption-generator' },
  { icon: SparkIcon, tint: 1, name: 'Bio Editor', blurb: 'Hand-build your bio — platform counters, Unicode fonts, dividers, designer card previews.', href: '/bio-editor' },
];

const PLATFORMS = ['Instagram', 'Facebook', 'Threads', 'TikTok', 'X', 'LinkedIn', 'WhatsApp', 'Snapchat'];

export default function FeaturesPage() {
  return (
    <article className="features-page">
      {/* ---------- Hero ---------- */}
      <div className="container">
        <header className="features-hero">
          <p className="features-eyebrow">Everything inside BioCraft</p>
          <h1 id="page-title" className="features-title">
            One toolkit. Twelve generators.<br />
            <span className="features-title-accent">$0 forever.</span>
          </h1>
          <p className="features-lede">
            Bios, names, fonts, usernames, hashtags, captions, symbols and LinkedIn copy —
            written for all eight platforms, in English, Hindi or Hinglish, right in your
            browser. Everything below works today; nothing is paywalled.
          </p>
          <div className="features-cta-row">
            <a className="btn btn-primary btn-lg" href="#toolbox">Explore the toolbox</a>
            <a className="btn btn-secondary btn-lg" href="/pricing" onClick={handleAnchorClick}>Why it’s free</a>
          </div>
          <dl className="features-stats" aria-label="BioCraft at a glance">
            <div className="stat"><dt className="stat-label">Tools</dt><dd className="stat-value">13</dd></div>
            <div className="stat"><dt className="stat-label">Platform workspaces</dt><dd className="stat-value">8</dd></div>
            <div className="stat"><dt className="stat-label">Languages</dt><dd className="stat-value">EN · <span lang="hi">हिन्दी</span></dd></div>
            <div className="stat"><dt className="stat-label">Cost</dt><dd className="stat-value">$0</dd></div>
          </dl>
        </header>
      </div>

      {/* ---------- Toolbox grid ---------- */}
      <div className="container features-section" id="toolbox">
        <div className="features-section-head">
          <h2 className="features-h2">The toolbox</h2>
          <p className="features-sub">Every generator, one tap away. No account, no limits on runs.</p>
        </div>
        <ul className="features-grid">
          {FEATURE_TOOLS.map((tool) => (
            <li key={tool.href}>
              <a className="feature-card" href={tool.href} onClick={handleAnchorClick}>
                <span className={`feature-card-icon feature-tint-${tool.tint}`} aria-hidden="true">
                  <tool.icon size={22} />
                </span>
                <span className="feature-card-name">{tool.name}</span>
                <span className="feature-card-blurb">{tool.blurb}</span>
                <span className="feature-card-cta">Open tool <ArrowRightIcon size={16} /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ---------- Principles trio ---------- */}
      <div className="container features-section">
        <div className="features-trio">
          <section className="features-panel" aria-labelledby="features-platforms">
            <div className="features-panel-head">
              <span className="feature-card-icon feature-tint-3" aria-hidden="true"><ShareIcon size={22} /></span>
              <h2 id="features-platforms">Eight platform workspaces</h2>
            </div>
            <p>
              Instagram, Facebook, Threads, TikTok, X, LinkedIn, WhatsApp and Snapchat each get a
              purpose-built workspace — the tools that make sense for it, its real character limits
              and its accent colour, with the BioCraft identity constant. Switch platforms from the
              pills row above any tool.
            </p>
            <ul className="chip-row features-platform-chips" aria-label="Supported platforms">
              {PLATFORMS.map((platform) => <li key={platform} className="chip">{platform}</li>)}
            </ul>
          </section>

          <section className="features-panel" aria-labelledby="features-privacy">
            <div className="features-panel-head">
              <span className="feature-card-icon feature-tint-1" aria-hidden="true"><ShieldCheckIcon size={22} /></span>
              <h2 id="features-privacy">Private by design</h2>
            </div>
            <p>
              BioCraft has no backend. Every generator is rule-based code shipped to your browser:
              nothing you type is uploaded, stored or logged — no accounts, no analytics, no email
              gates. The only network traffic is your browser fetching the static site itself.
            </p>
            <p className="features-panel-note"><LockIcon size={16} /> Your drafts never leave this device.</p>
          </section>

          <section className="features-panel" aria-labelledby="features-limits">
            <div className="features-panel-head">
              <span className="feature-card-icon feature-tint-2" aria-hidden="true"><InfoIcon size={22} /></span>
              <h2 id="features-limits">Honest limits</h2>
            </div>
            <ul className="features-limits">
              <li>Unicode “fonts” are styled code points — look differs across devices; some very old apps show boxes.</li>
              <li>Devanagari has no styled Unicode alphabets — Hindi passes through unchanged, and the tools say so.</li>
              <li>Hashtags can’t guarantee reach; captions can’t guarantee engagement. We never pretend otherwise.</li>
            </ul>
          </section>
        </div>
      </div>

      {/* ---------- Final CTA ---------- */}
      <div className="container features-section features-final">
        <div className="features-final-inner">
          <SparkIcon size={22} />
          <h2 className="features-h2">Ready when you are.</h2>
          <p className="features-sub">Pick a tool and publish. That’s the whole flow.</p>
          <div className="features-cta-row">
            <a className="btn btn-primary btn-lg" href="/bio-generator" onClick={handleAnchorClick}>Open the Bio Generator</a>
            <a className="btn btn-secondary btn-lg" href="/resources" onClick={handleAnchorClick}>See everything BioCraft has</a>
          </div>
        </div>
      </div>
    </article>
  );
}
