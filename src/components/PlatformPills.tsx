import type { CSSProperties, JSX } from 'react';
import { useToolkit } from '../lib/toolkit';
import { PLATFORMS, type PlatformId } from '../tools/platforms';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  ThreadsIcon,
  TikTokIcon,
  XIcon,
} from './icons';

const PLATFORM_ICONS: Record<PlatformId, (props: { size?: number }) => JSX.Element> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  threads: ThreadsIcon,
  tiktok: TikTokIcon,
  x: XIcon,
  linkedin: LinkedInIcon,
};

/**
 * The six-platform selector. Tappable pills with platform accent glows;
 * scrolls horizontally on small screens. Selection drives the whole
 * workspace via the toolkit context.
 */
export default function PlatformPills({ compact = false }: { compact?: boolean }) {
  const { platform, setPlatform } = useToolkit();

  return (
    <div
      className={`platform-pills${compact ? ' platform-pills-compact' : ''}`}
      role="group"
      aria-label="Choose a platform"
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
