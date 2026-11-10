import { useState, type CSSProperties } from 'react';
import PlatformStage from '../components/PlatformStage';
import ToolWorkspace from '../components/ToolWorkspace';
import ToolTile from '../components/ToolTile';
import { handleAnchorClick } from '../lib/router';
import { TOOLS } from '../tools/registry';
import { useFavourites } from '../lib/toolbox';
import { BIO_COLLECTIONS, BIO_DESIGNS, COLLECTION_NAV, RECENTLY_ADDED_COLLECTIONS, TOTAL_BIOS } from '../lib/bioCollections';
import CollectionIcon from '../components/CollectionIcon';
import {
  ArrowRightIcon,
  PlusIcon,
} from '../components/icons';

const POPULAR_CHIPS: Array<{ id: string; label: string }> = [
  { id: 'creator', label: 'Creator' },
  { id: 'photographer', label: 'Photographer' },
  { id: 'travel', label: 'Travel' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'food', label: 'Food' },
  { id: 'fashion', label: 'Fashion' },
  { id: 'music', label: 'Music' },
  { id: 'developer', label: 'Developer' },
  { id: 'artist', label: 'Artist' },
  { id: 'writer', label: 'Writer' },
  { id: 'beauty', label: 'Beauty' },
  { id: 'business', label: 'Business' },
];

/** The six designer-card styles showcased in the "Recently Added Designs" rail. */
const RECENT_DESIGN_KEYS = ['royal', 'dark', 'creative', 'devotional', 'vip', 'aesthetic'] as const;

const FAQ = [
  { q: 'Does BioCraft really cost nothing?', a: 'Yes. Every generator, every platform, every run — $0, forever. No tiers, no trials, no credits, no sign-up. It is a static, browser-based app with no paid backend to recoup costs from.', href: '/pricing', hrefLabel: 'See the pricing page' },
  { q: 'Do I need an account or login?', a: 'No. There is no sign-up, no password and no profile — and there never will be. That is deliberate: nothing to maintain, nothing to breach, nothing to lose.', href: '/login', hrefLabel: 'Why there’s no login' },
  { q: 'Does BioCraft upload or store my text?', a: 'No. Every BioCraft tool processes your input locally in your browser. There are no cookies, no web storage, no analytics and no uploads — you can verify it yourself in DevTools.', href: '/privacy', hrefLabel: 'Read the privacy policy' },
  { q: 'Which platforms are supported, and what are the limits?', a: 'BioCraft ships platform workspaces for Instagram (150 chars), Facebook (101-char intro), Threads (150), TikTok (80), X (160), LinkedIn (2,600 About / 220 headlines), WhatsApp (139 About) and Snapchat (≈150 bio). Each workspace enforces its own real limit.', href: '/features', hrefLabel: 'See all features' },
  { q: 'Are the generated bios unique?', a: 'Each run combines your inputs with template pools and random sampling, so two runs are never identical. But no tool can guarantee global uniqueness across the internet — tweak the result to make it yours.', href: '/blog', hrefLabel: 'Read the bio guide' },
  { q: 'Does BioCraft work in Hindi?', a: 'Yes — bios, captions, hashtags, statuses and most tools work in English, हिन्दी and Hinglish. The LinkedIn headline and summary tools are English-only for now, and Devanagari has no Unicode “fancy fonts” (BioCraft passes it through unchanged).', href: '/help', hrefLabel: 'Hindi & Devanagari FAQ' },
  { q: 'Why can’t BioCraft check if my username is available?', a: 'Instagram decides availability and does not expose it publicly — any tool claiming a live check is guessing. BioCraft gives you rule-valid, unique candidates instead, and the platform itself makes the final call.', href: '/help', hrefLabel: 'Username availability explained' },
];

function FaqItem({ q, a, href, hrefLabel, defaultOpen = false }: { q: string; a: string; href: string; hrefLabel: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = q.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  return (
    <div className="faq-item">
      <button
        type="button"
        className="faq-question"
        aria-expanded={open}
        aria-controls={`faq-${id}`}
        id={`faq-button-${id}`}
        onClick={() => setOpen((current) => !current)}
      >
        {q}
        <PlusIcon size={22} />
      </button>
      <div className="faq-panel" id={`faq-${id}`} role="region" aria-labelledby={`faq-button-${id}`} hidden={!open}>
        <p style={{ margin: 0 }}>
          {a}{' '}
          <a href={href} onClick={handleAnchorClick}>{hrefLabel} →</a>
        </p>
      </div>
    </div>
  );
}

const SPARKLE_PATH = 'M12 0c.95 5.5 3.55 8.35 9.05 9.3-5.5.95-8.35 3.55-9.05 9.3-.95-5.5-3.55-8.35-9.05-9.3 5.5-.95 8.35-3.55 9.05-9.3Z';

/* [x%, y%, size, tone, opacity, delay, hide] — staggered sparkle constellation.
   hide: '' = all viewports | 'm' = hidden <600px | 't' = 600–1099px | 'd' = ≥1100px | 'desk' = desktop only.
   Positions are tuned so no star ever sits on the laptop screen or the platform pills. */
type StarHide = '' | 'm' | 't' | 'd' | 'desk';
const HOME_STARS: Array<[number, number, number, string, number, number, StarHide?]> = [
  [5, 4, 15, '#B388E8', 0.8, 0], [95, 4, 11, '#C9A6F2', 0.7, 2.1],
  [3, 9, 12, '#E38ABE', 0.7, 0.9], [97, 9, 13, '#B388E8', 0.75, 1.2],
  [11, 14, 10, '#C9A6F2', 0.65, 1.4], [89, 14, 14, '#8F5FE0', 0.6, 0.7],
  [6, 19, 16, '#B388E8', 0.75, 0.2, 'm'], [94, 19, 11, '#E38ABE', 0.7, 1.9, 'm'],
  [2, 24, 13, '#C9A6F2', 0.6, 2.8], [98, 24, 10, '#B388E8', 0.65, 1.5],
  [12, 30, 11, '#E38ABE', 0.7, 1.1], [88, 30, 12, '#8F5FE0', 0.6, 2.2],
  [5, 37, 14, '#8F5FE0', 0.55, 0.3, 't'], [22, 40, 16, '#B388E8', 0.55, 0.6, 't'], [38, 37, 11, '#E38ABE', 0.6, 2.0, 't'],
  [55, 42, 12, '#C9A6F2', 0.6, 1.0, 'd'], [71, 38, 15, '#B388E8', 0.6, 2.6, 't'], [88, 44, 11, '#E38ABE', 0.65, 1.3, 'd'],
  [12, 46, 13, '#C9A6F2', 0.6, 1.6, 'd'], [30, 44, 10, '#B388E8', 0.55, 0.8, 'd'], [48, 49, 12, '#E38ABE', 0.6, 1.7],
  [66, 45, 15, '#8F5FE0', 0.55, 2.4, 'd'], [94, 39, 12, '#B388E8', 0.6, 0.4, 't'], [82, 48, 11, '#C9A6F2', 0.55, 2.9],
  [24, 7, 18, '#8F5FE0', 0.65, 1.0, 'desk'], [76, 7, 12, '#E38ABE', 0.75, 0.5, 'desk'], [19, 17, 15, '#C9A6F2', 0.6, 2.2, 'desk'],
  [81, 17, 10, '#B388E8', 0.7, 0.3, 'desk'], [26, 26, 10, '#E38ABE', 0.7, 1.8, 'desk'], [74, 26, 14, '#8F5FE0', 0.6, 1.4, 'desk'],
];

export default function HomePage() {
  const { favs } = useFavourites();
  const favToolKeys = [...favs];

  return (
    <div className="home-shell">
      <div className="home-starfield" aria-hidden="true">
        {HOME_STARS.map(([x, y, size, tone, opacity, delay, hide], index) => (
          <svg
            key={index}
            className={`home-star${hide ? ` home-star--hide-${hide}` : ''}`}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            style={{ '--star-x': `${x}%`, '--star-y': `${y}%`, '--star-size': `${size}px`, '--star-tone': tone, '--star-opacity': opacity, '--star-delay': `${delay}s` } as CSSProperties}
          >
            <path d={SPARKLE_PATH} />
          </svg>
        ))}
      </div>
      {/* ============ Platform stage — full-screen 3D picker, re-themes everything ============ */}
      <h1 className="sr-only">BioCraft — All-in-One Social Media Toolkit</h1>
      <PlatformStage />

      {/* ============ Tool workspace — follows the stage (tool-first) ============ */}
      <ToolWorkspace path="/" headingLevel="h2" />

      {/* ============ Your Favourite Tools — only when you have some ============ */}
      {favToolKeys.length > 0 && (
        <section className="section" aria-labelledby="home-favourites-title">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Pinned by You</p>
              <h2 id="home-favourites-title" className="section-title">Your Favourite Tools</h2>
              <p className="section-sub">Saved on this device only — nothing leaves your browser.</p>
            </div>
            <ul className="tile-grid">
              {favToolKeys.map((key) => (
                <ToolTile key={key} toolKey={key as (typeof TOOLS)[number]['key']} />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ============ Explore Ready-Made Bios ============ */}
      <section className="section" aria-labelledby="bio-collections-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Ready-Made Bios</p>
            <h2 id="bio-collections-title" className="section-title">Explore Ready-Made Bios</h2>
            <p className="section-sub">{TOTAL_BIOS} original, copy-ready bios across {BIO_COLLECTIONS.length} collections — English, Hindi and Hinglish, plus styled Unicode. One tap to copy, zero editing required.</p>
          </div>
          <ul className="bc-home-grid">
            {BIO_COLLECTIONS.filter((collection) => ['instagram-bio-for-boys', 'instagram-bio-for-girls', 'stylish-instagram-bio', 'attitude-bio', 'love-bio', 'vip-bio', 'hindi-bio', 'english-bio'].includes(collection.slug)).map((collection) => (
              <li key={collection.slug}>
                <a className="bc-home-card" href={`/${collection.slug}`} onClick={handleAnchorClick}>
                  <span className="bc-home-icon" aria-hidden="true"><CollectionIcon name={collection.icon} size={22} /></span>
                  <span className="bc-home-name">{collection.name}</span>
                  <span className="bc-home-desc">{collection.description}</span>
                  <span className="bc-home-link">Explore <ArrowRightIcon size={15} aria-hidden="true" /></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="bc-home-rails">
            <div className="bc-home-rail">
              <h3>Popular collections</h3>
              <ul className="bc-chip-row">
                {COLLECTION_NAV.slice(0, 6).map((item) => {
                  const target = BIO_COLLECTIONS.find((collection) => collection.slug === item.slug);
                  return (
                    <li key={item.slug}>
                      <a className="chip bc-chip" href={`/${item.slug}`} onClick={handleAnchorClick}>
                        <CollectionIcon name={target?.icon ?? 'spark'} size={16} /> {target?.name ?? item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bc-home-rail">
              <h3>Recently added</h3>
              <ul className="bc-chip-row">
                {RECENTLY_ADDED_COLLECTIONS.map((slug) => {
                  const target = BIO_COLLECTIONS.find((collection) => collection.slug === slug);
                  return target ? (
                    <li key={slug}>
                      <a className="chip bc-chip" href={`/${slug}`} onClick={handleAnchorClick}>
                        <CollectionIcon name={target.icon} size={16} /> {target.name}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
            <div className="bc-home-rail">
              <h3>Recently Added Designs</h3>
              <ul className="bc-chip-row">
                {RECENT_DESIGN_KEYS.map((key) => {
                  const target = BIO_DESIGNS.find((item) => item.key === key);
                  return target ? (
                    <li key={key}>
                      <a className="chip bc-chip" href={`/bio-editor?design=${key}`} onClick={handleAnchorClick}>
                        {target.label}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
            </div>
          </div>
          <div className="bc-home-cta">
            <a className="btn btn-primary" href="/bio-collections" onClick={handleAnchorClick}>
              See all {BIO_COLLECTIONS.length} collections <ArrowRightIcon size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* ============ Popular Categories — twelve niches ============ */}
      <section className="section section-alt" aria-labelledby="popular-categories-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Popular Categories</p>
            <h2 id="popular-categories-title" className="section-title">Jump Straight Into a Niche</h2>
            <p className="section-sub">Bio recipes tuned for the niche — tap one and start generating.</p>
          </div>
          <ul className="chip-cloud">
            {POPULAR_CHIPS.map(({ id, label }) => (
              <li key={id}>
                <a className="chip" href={`/bio-generator?tab=category&category=${id}#workspace`} onClick={handleAnchorClick}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section" aria-labelledby="faq-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">FAQ</p>
            <h2 id="faq-title" className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub">Straight answers — or the page that has them.</p>
          </div>
          <div className="faq-list">
            {FAQ.map((item, index) => (
              <FaqItem key={item.q} q={item.q} a={item.a} href={item.href} hrefLabel={item.hrefLabel} defaultOpen={index === 0} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
