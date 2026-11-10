import { useState, type CSSProperties } from 'react';
import PlatformStage from '../components/PlatformStage';
import ToolWorkspace from '../components/ToolWorkspace';
import ToolTile from '../components/ToolTile';
import { handleAnchorClick } from '../lib/router';
import { TOOLS } from '../tools/registry';
import { useFavourites } from '../lib/toolbox';
import {
  ArrowRightIcon,
  PlusIcon,
} from '../components/icons';

const STEPS = [
  { title: 'Choose your platform', desc: 'Instagram, Facebook, Threads, TikTok, X or LinkedIn — each with its real limits.' },
  { title: 'Pick a tool', desc: 'Bio, stylish name, fancy fonts, username, symbols, hashtags or captions.' },
  { title: 'Add your details', desc: 'A few words about you — or just pick a niche and let BioCraft fill in the rest.' },
  { title: 'Generate & fine-tune', desc: 'Five unique results per run. Regenerate until one feels exactly right.' },
  { title: 'Copy & post', desc: 'One tap copies to your clipboard — paste it anywhere, done.' },
];

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

const FAQ = [
  { q: 'Is BioCraft really free forever?', a: 'Yes. Every generator, every platform, every run — $0, forever. No tiers, no trials, no credits, no sign-up. It is a static, browser-based app with no paid backend to recoup costs from.', href: '/pricing', hrefLabel: 'See the pricing page' },
  { q: 'Do I need an account or login?', a: 'No. There is no sign-up, no password and no profile — and there never will be. That is deliberate: nothing to maintain, nothing to breach, nothing to lose.', href: '/login', hrefLabel: 'Why there’s no login' },
  { q: 'Does BioCraft upload or store my text?', a: 'No. Every BioCraft tool processes your input locally in your browser. There are no cookies, no web storage, no analytics and no uploads — you can verify it yourself in DevTools.', href: '/privacy', hrefLabel: 'Read the privacy policy' },
  { q: 'Which platforms are supported, and what are the limits?', a: 'BioCraft ships platform workspaces for Instagram (150 chars), Facebook (101-char intro), Threads (150), TikTok (80), X (160) and LinkedIn (2,600 About / 220 headlines). Each workspace enforces its own real limit.', href: '/features', hrefLabel: 'See all features' },
  { q: 'Are the generated bios unique?', a: 'Each run combines your inputs with template pools and random sampling, so two runs are never identical. But no tool can guarantee global uniqueness across the internet — tweak the result to make it yours.', href: '/blog', hrefLabel: 'Read the bio guide' },
  { q: 'Does BioCraft work in Hindi?', a: 'Yes — bios, captions, hashtags and most tools are bilingual (English / हिन्दी). The LinkedIn headline and summary tools are English-only for now, and Devanagari has no Unicode “fancy fonts” (BioCraft passes it through unchanged).', href: '/help', hrefLabel: 'Hindi & Devanagari FAQ' },
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

/* [x%, y%, size, tone, opacity, delay, deskOnly?] — staggered sparkle constellation, top half only.
   deskOnly stars sit on the laptop screen at ≤719px, so they are hidden there. */
const HOME_STARS: Array<[number, number, number, string, number, number, boolean?]> = [
  [5, 6, 15, '#B388E8', 0.8, 0], [16, 4, 11, '#E38ABE', 0.7, 0.9, true], [27, 9, 18, '#8F5FE0', 0.65, 1.7, true],
  [74, 5, 12, '#E38ABE', 0.75, 0.4, true], [84, 9, 16, '#B388E8', 0.8, 1.2, true], [95, 4, 11, '#C9A6F2', 0.7, 2.1],
  [10, 15, 12, '#C9A6F2', 0.65, 1.4, true], [23, 16, 16, '#B388E8', 0.75, 0.2, true], [35, 12, 10, '#E38ABE', 0.8, 2.4, true],
  [65, 14, 14, '#8F5FE0', 0.6, 0.7, true], [78, 17, 11, '#C9A6F2', 0.75, 1.9, true], [90, 12, 15, '#B388E8', 0.7, 0.1],
  [4, 23, 14, '#E38ABE', 0.6, 2.8], [19, 25, 11, '#B388E8', 0.7, 1.1], [33, 22, 16, '#C9A6F2', 0.6, 0.5],
  [70, 24, 12, '#B388E8', 0.65, 2.2], [86, 23, 13, '#8F5FE0', 0.6, 1.5],
  [12, 33, 16, '#8F5FE0', 0.55, 0.3], [29, 35, 10, '#E38ABE', 0.7, 1.8], [60, 32, 11, '#C9A6F2', 0.6, 0.8, true],
  [77, 33, 16, '#B388E8', 0.6, 2.6], [93, 34, 12, '#E38ABE', 0.65, 1.3],
  [7, 37, 13, '#C9A6F2', 0.6, 1.6], [24, 38, 16, '#B388E8', 0.55, 0.6], [47, 37, 12, '#E38ABE', 0.6, 2.0],
  [67, 38, 15, '#8F5FE0', 0.55, 1.0], [87, 37, 11, '#B388E8', 0.6, 2.9],
];

export default function HomePage() {
  const { favs } = useFavourites();
  const favToolKeys = [...favs];

  return (
    <div className="home-shell">
      <div className="home-starfield" aria-hidden="true">
        {HOME_STARS.map(([x, y, size, tone, opacity, delay, deskOnly], index) => (
          <svg
            key={index}
            className={`home-star${deskOnly ? ' home-star--desk' : ''}`}
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

      {/* ============ How It Works — five steps ============ */}
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">How It Works</p>
            <h2 id="how-title" className="section-title">From Zero to Posted in Five Steps</h2>
          </div>
          <ol className="how-steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="how-step">
                <span className="how-step-index" aria-hidden="true">{index + 1}</span>
                <span className="how-step-body">
                  <span className="how-step-title">{step.title}</span>
                  <span className="how-step-desc">{step.desc}</span>
                </span>
              </li>
            ))}
          </ol>
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

      {/* ============ Final CTA ============ */}
      <section className="section" aria-labelledby="final-cta-title">
        <div className="container">
          <div className="final-cta">
            <p className="eyebrow">Ready When You Are</p>
            <h2 id="final-cta-title" className="section-title">Your Next Bio Is One Click Away</h2>
            <p className="section-sub">Free, private and instant — no account required.</p>
            <a className="btn btn-primary btn-lg" href="/resources" onClick={handleAnchorClick}>
              Explore Tools <ArrowRightIcon size={19} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
