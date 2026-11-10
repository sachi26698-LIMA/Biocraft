import { useEffect, useState } from 'react';
import { handleAnchorClick, usePath } from '../lib/router';
import {
  CloseIcon,
  MenuIcon,
  SearchIcon,
  HeartIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  HomeIcon,
  GridIcon,
  LayersIcon,
  ZapIcon,
  InfoIcon,
  HelpIcon,
} from './icons';
import Logo from './Logo';
import SearchOverlay from './SearchOverlay';
import type { CSSProperties, JSX } from 'react';

/** QuickKit-style per-destination hue for the 3D mobile-menu tiles. */
const MENU_ICONS: Array<{
  label: string;
  href: string;
  Icon: (props: { size?: number }) => JSX.Element;
  from: string; to: string; deep: string; soft: string; line: string; glow: string;
}> = [
  { label: 'Home', href: '/', Icon: HomeIcon, from: '#F4EBFF', to: '#DCC7FA', deep: '#6D28A8', soft: 'rgba(139, 75, 192, 0.12)', line: 'rgba(139, 75, 192, 0.38)', glow: 'rgba(139, 75, 192, 0.42)' },
  { label: 'All Tools', href: '/resources', Icon: GridIcon, from: '#E0EDFF', to: '#BDD8F7', deep: '#0A4A8F', soft: 'rgba(10, 102, 194, 0.12)', line: 'rgba(10, 102, 194, 0.38)', glow: 'rgba(10, 102, 194, 0.4)' },
  { label: 'Categories', href: '/categories', Icon: LayersIcon, from: '#FFEBDD', to: '#FFD0B4', deep: '#9A4A0E', soft: 'rgba(222, 107, 43, 0.12)', line: 'rgba(222, 107, 43, 0.38)', glow: 'rgba(222, 107, 43, 0.4)' },
  { label: 'Features', href: '/features', Icon: ZapIcon, from: '#E2FBEC', to: '#BDEEDA', deep: '#0E6B4E', soft: 'rgba(31, 157, 107, 0.12)', line: 'rgba(31, 157, 107, 0.38)', glow: 'rgba(31, 157, 107, 0.4)' },
  { label: 'About', href: '/about', Icon: InfoIcon, from: '#FDF4C0', to: '#F6E18B', deep: '#7A5200', soft: 'rgba(169, 138, 7, 0.14)', line: 'rgba(169, 138, 7, 0.4)', glow: 'rgba(190, 158, 24, 0.45)' },
  { label: 'Help', href: '/help', Icon: HelpIcon, from: '#D9F6F0', to: '#B4E8DE', deep: '#0E5257', soft: 'rgba(18, 137, 124, 0.13)', line: 'rgba(18, 137, 124, 0.38)', glow: 'rgba(18, 137, 124, 0.4)' },
  { label: 'Favourite Tools', href: '/categories#favourites', Icon: HeartIcon, from: '#FFE9F3', to: '#FFC9DE', deep: '#B03060', soft: 'rgba(214, 83, 143, 0.12)', line: 'rgba(214, 83, 143, 0.38)', glow: 'rgba(214, 83, 143, 0.4)' },
];

/**
 * Floating light-glass navbar: logo · centered section links · search,
 * favourites and the Explore Tools CTA. On mobile: compact logo, search
 * icon and a hamburger that opens a glass sheet with the same destinations.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const path = usePath();

  // Open the search overlay when the stage's search bar (or any widget) asks.
  useEffect(() => {
    const onOpenSearch = () => setSearchOpen(true);
    window.addEventListener('biocraft:open-search', onOpenSearch);
    return () => window.removeEventListener('biocraft:open-search', onOpenSearch);
  }, []);

  // Close the mobile menu on every navigation and on Escape.
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [path]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#tool-panel">
        Skip to the tools
      </a>
      <div className="container site-header-inner">
        <a className="logo-link" href="/" aria-label="BioCraft — All-in-One Social Media Toolkit home" onClick={handleAnchorClick}>
          <Logo size={36} />
        </a>

        <nav className="site-nav" aria-label="BioCraft sections">
          <ul className="site-nav-list">
            {MENU_ICONS.slice(0, 6).map((item) => (
              <li key={item.href}>
                <a className="site-nav-link" href={item.href} onClick={handleAnchorClick}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header-actions">
          <button
            type="button"
            className="icon-action"
            aria-label="Search tools"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon size={20} />
          </button>
          <a className="icon-action" href="/categories#favourites" aria-label="Your favourite tools" onClick={handleAnchorClick}>
            <HeartIcon size={20} />
          </a>
          <a className="btn btn-primary btn-explore" href="/resources" onClick={handleAnchorClick}>
            Explore Tools <ArrowRightIcon size={16} />
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
          <p className="mobile-nav-eyebrow">Menu — quick jump</p>
          <ul>
            {MENU_ICONS.map((item, index) => {
              const active = item.href === path;
              return (
                <li key={item.href} style={{ '--mi-delay': `${index * 55}ms` } as CSSProperties}>
                  <a
                    className={`mobile-nav-link${active ? ' is-active' : ''}`}
                    href={item.href}
                    onClick={handleAnchorClick}
                    aria-current={active ? 'page' : undefined}
                    style={{
                      '--mi-from': item.from,
                      '--mi-to': item.to,
                      '--mi-deep': item.deep,
                      '--mi-soft': item.soft,
                      '--mi-line': item.line,
                      '--mi-glow': item.glow,
                      '--shine-delay': `${0.4 + index * 0.28}s`,
                    } as CSSProperties}
                  >
                    <span className="mobile-nav-icon icon3d" aria-hidden="true">
                      <item.Icon size={20} />
                    </span>
                    <span className="mobile-nav-label">{item.label}</span>
                    <ChevronRightIcon size={16} />
                  </a>
                </li>
              );
            })}
            <li className="mobile-nav-cta" style={{ '--mi-delay': `${MENU_ICONS.length * 55 + 40}ms` } as CSSProperties}>
              <a className="btn btn-primary btn-large" href="/resources" onClick={handleAnchorClick}>
                Explore Tools <ArrowRightIcon size={17} />
              </a>
            </li>
          </ul>
        </nav>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
