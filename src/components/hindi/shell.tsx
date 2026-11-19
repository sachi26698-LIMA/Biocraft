import type { ReactNode } from 'react';
import { handleAnchorClick, usePath } from '../../lib/router';
import { ArrowRight } from './icons';

/**
 * Navigation + page frame for the Hindi Font Ecosystem.
 *
 * The recovered pages lived under a Next.js `/biocraft` layout with its own
 * wordmark bar. BioCraft already has one site header, so this is a scoped
 * sub-navigation inside the page body rather than a second global header: it
 * keeps the site identity intact and still tells a visitor these six routes are
 * one product.
 *
 * Only the five public routes are listed. `/admin/hindi-fonts` is deliberately
 * absent from public navigation — it is reachable only inside the Admin console.
 */

export const HINDI_LINKS = [
  { href: '/hindi-fonts', label: 'Font Library' },
  { href: '/hindi-font-studio', label: 'Preview & Bio Studio' },
  { href: '/hindi-poster-studio', label: 'Poster Studio' },
  { href: '/hindi-font-licenses', label: 'Licensing' },
] as const;

export function HindiNav() {
  const path = usePath();
  return (
    <nav className="bc-nav" aria-label="Hindi font tools">
      <div className="bc-nav-inner">
        <a href="/hindi-fonts" className="bc-wordmark" onClick={handleAnchorClick}>
          <span className="bc-mark" aria-hidden="true">
            क
          </span>
          <span>
            BioCraft Hindi
            <small>Verified Devanagari typography</small>
          </span>
        </a>
        <div className="bc-nav-links">
          {HINDI_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleAnchorClick}
              aria-current={path === link.href ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

/** Standard page frame: scoped palette, sub-navigation, then the page body. */
export function HindiPage({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="bc">
      <HindiNav />
      <main className={`bc-shell${wide ? ' bc-shell-wide' : ''}`}>{children}</main>
    </div>
  );
}

/** Cross-link back to BioCraft's existing font and design tools. */
export function HindiCrossLinks() {
  return (
    <section className="bc-section" aria-label="More from BioCraft">
      <div className="bc-card bc-feature" style={{ padding: 24 }}>
        <div
          style={{
            display: 'flex',
            gap: 18,
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ maxWidth: '62ch' }}>
            <h3 style={{ fontSize: 18 }}>Looking for something else?</h3>
            <p>
              These Hindi tools sit beside BioCraft&apos;s existing{' '}
              <a href="/font-library" onClick={handleAnchorClick}>
                Google Fonts library
              </a>{' '}
              (1,908 families with samples), the{' '}
              <a href="/fancy-font-generator" onClick={handleAnchorClick}>
                fancy font generator
              </a>{' '}
              for styled Latin text, and the{' '}
              <a href="/design-studio" onClick={handleAnchorClick}>
                design studio
              </a>
              .
            </p>
          </div>
          <a className="bc-button secondary" href="/font-library" onClick={handleAnchorClick}>
            Browse all Google Fonts <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

/** Shared 404 body so an unknown slug renders a real page, not a blank route. */
export function HindiNotFound() {
  return (
    <HindiPage>
      <header style={{ padding: '56px 0 8px' }}>
        <span className="bc-kicker">Not found</span>
        <h1 style={{ margin: '14px 0 10px', fontSize: 'clamp(30px, 4vw, 44px)' }}>
          यह फ़ॉन्ट नहीं मिला
        </h1>
        <p className="bc-lede" style={{ marginTop: 0 }}>
          That family is not in the verified catalogue. It may have been withheld by
          the shaping gate, or the link may be mistyped.
        </p>
        <div className="bc-hero-actions">
          <a className="bc-button" href="/hindi-fonts" onClick={handleAnchorClick}>
            Back to the Hindi font library
          </a>
          <a
            className="bc-button secondary"
            href="/hindi-font-licenses"
            onClick={handleAnchorClick}
          >
            See the licence index
          </a>
        </div>
      </header>
      <HindiCrossLinks />
    </HindiPage>
  );
}
