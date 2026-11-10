import { handleAnchorClick } from '../lib/router';
import { CheckIcon, ShieldCheckIcon } from './icons';
import Logo from './Logo';

const ALL_TOOLS: Array<{ label: string; href: string }> = [
  { label: 'Bio Generator', href: '/bio-generator' },
  { label: 'Stylish Name Generator', href: '/stylish-name-generator' },
  { label: 'Fancy Font Generator', href: '/fancy-font-generator' },
  { label: 'Design Studio', href: '/design-studio' },
  { label: 'Username Generator', href: '/username-generator' },
  { label: 'Emoji & Symbol Generator', href: '/emoji-symbol-generator' },
  { label: 'Hashtag Generator', href: '/hashtag-generator' },
  { label: 'Caption Generator', href: '/caption-generator' },
  { label: 'LinkedIn Headline Generator', href: '/linkedin-headline-generator' },
  { label: 'LinkedIn Summary Generator', href: '/linkedin-summary-generator' },
  { label: 'WhatsApp Status Generator', href: '/whatsapp-status-generator' },
  { label: 'Snapchat Caption Generator', href: '/snapchat-caption-generator' },
  { label: 'Bio Editor', href: '/bio-editor' },
];

const CATEGORY_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Ready-Made Bios', href: '/bio-collections' },
  { label: 'Bio Editor', href: '/bio-editor' },
  { label: 'Bio Generators', href: '/categories#cat-bio' },
  { label: 'Stylish Names & Fonts', href: '/categories#cat-names-fonts' },
  { label: 'Usernames', href: '/categories#cat-usernames' },
  { label: 'Hashtags & Captions', href: '/categories#cat-hashtags-captions' },
  { label: 'Emoji & Symbols', href: '/categories#cat-emoji-symbols' },
  { label: 'Social Media Tools', href: '/categories#cat-linkedin' },
];

const POPULAR_TOOLS: Array<{ label: string; href: string }> = [
  { label: 'Instagram Bio Generator', href: '/bio-generator?platform=instagram' },
  { label: 'Stylish Name Generator', href: '/stylish-name-generator' },
  { label: 'Username Generator', href: '/username-generator' },
  { label: 'Hashtag Generator', href: '/hashtag-generator' },
  { label: 'Caption Generator', href: '/caption-generator' },
];

const COMPANY_LINKS: Array<{ label: string; href: string }> = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Help Center', href: '/help' },
];

const LEGAL_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Cookie Policy', href: '/cookie' },
];

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <nav className="footer-col" aria-label={heading}>
      <h2 className="footer-heading">{heading}</h2>
      <ul className="footer-list">
        {links.map((item) => (
          <li key={item.href}>
            <a className="footer-link" href={item.href} onClick={handleAnchorClick}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Light-glass footer: brand block on the left, five link columns on the right.
 * Every link points at a real route — no placeholders, no external profiles.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-trust">
          <ShieldCheckIcon size={22} aria-hidden="true" />
          <span className="footer-trust-text">
            <strong>Your work stays yours.</strong>
            Most tools run entirely on your device — no uploads, no sign-up, no tracking analytics.
          </span>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <a className="logo-link" href="/" aria-label="BioCraft home" onClick={handleAnchorClick}>
              <Logo size={40} />
            </a>
            <p className="footer-tagline">
              All-in-One Social Media Toolkit for Bios, Usernames, Captions, Hashtags, Fonts,
              Emojis and more.
            </p>
            <p className="footer-badge">
              <CheckIcon size={16} aria-hidden="true" />
              Free &amp; Easy to Use
            </p>
          </div>

          <FooterColumn heading="All Tools" links={ALL_TOOLS} />
          <FooterColumn heading="Categories" links={CATEGORY_LINKS} />
          <FooterColumn heading="Popular Tools" links={POPULAR_TOOLS} />
          <FooterColumn heading="Company" links={COMPANY_LINKS} />
          <FooterColumn heading="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">© {year} BioCraft. All rights reserved.</p>
          <p className="footer-note">
            Free forever — no sign-up, no ads, no tracking. Not affiliated with Instagram, Meta,
            TikTok, X Corp or Microsoft. · Built with ♥ for a simpler social presence.
          </p>
        </div>
      </div>
    </footer>
  );
}
