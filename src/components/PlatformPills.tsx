import type { CSSProperties, JSX } from 'react';
import { useToolkit } from '../lib/toolkit';
import { PLATFORMS, type PlatformId } from '../tools/platforms';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  SnapchatIcon,
  ThreadsIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
} from './icons';

const PLATFORM_ICONS: Record<PlatformId, (props: { size?: number }) => JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  threads: ThreadsIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
  snapchat: SnapchatIcon,
};

/**
 * The eight-platform selector. Selection drives the whole workspace via the
 * toolkit context.
 *
 * Layout: a 4-column grid on phones (all eight visible, nothing clipped) and
 * eight across from 900px (see revamp.css). Keyboard: arrow keys, Home and End
 * move focus between pills; each pill is a 44px+ touch target with an
 * aria-pressed state and an explicit accessible name.
 */
export default function PlatformPills({ compact = false }: { compact?: boolean }) {
  const { platform, setPlatform } = useToolkit();

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const pills = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('.platform-pill'));
    const current = pills.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    event.preventDefault();
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
    let next = forward ? current + 1 : current - 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = pills.length - 1;
    if (next < 0) next = pills.length - 1;
    if (next >= pills.length) next = 0;
    pills[next]?.focus();
  };

  return (
    <div
      className={`platform-pills${compact ? ' platform-pills-compact' : ''}`}
      role="group"
      aria-label="Choose a platform"
      onKeyDown={onKeyDown}
    >
      {PLATFORMS.map((item, index) => {
        const Icon = PLATFORM_ICONS[item.id];
        const active = item.id === platform;
        return (
          <button
            key={item.id}
            type="button"
            className={`platform-pill${active ? ' is-active' : ''}`}
            aria-pressed={active}
            aria-label={`${item.name}${active ? ' — selected' : ''}`}
            onClick={() => setPlatform(item.id)}
            style={{
              '--platform-accent': item.accent,
              '--platform-hover': item.accentHover,
              '--platform-deep': item.deep,
              '--platform-glow': item.accentSoft,
              '--platform-line': item.line,
              '--platform-tile-from': item.tileFrom,
              '--platform-tile-to': item.tileTo,
              '--shine-delay': `${0.4 + index * 0.35}s`,
            } as CSSProperties}
          >
            <span className="platform-pill-icon icon3d">
              <Icon size={compact ? 20 : 26} />
            </span>
            <span className="platform-pill-label">{item.shortName}</span>
          </button>
        );
      })}
    </div>
  );
}
