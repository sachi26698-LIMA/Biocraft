import type { CSSProperties, JSX } from 'react';
import { handleAnchorClick } from '../lib/router';
import { TOOLS, type ToolKey } from '../tools/registry';
import { TOOL_THEMES } from '../lib/toolThemes';
import {
  SparkIcon,
  TypeIcon,
  WandIcon,
  AtIcon,
  SmileIcon,
  HashIcon,
  QuoteIcon,
  LayersIcon,
  GridIcon,
  WhatsAppIcon,
  SnapchatIcon,
  GemIcon,
} from './icons';

const TAB_ICONS: Record<ToolKey, (props: { size?: number }) => JSX.Element> = {
  bio: SparkIcon,
  'stylish-name': TypeIcon,
  'fancy-fonts': WandIcon,
  'design-studio': GemIcon,
  username: AtIcon,
  symbols: SmileIcon,
  hashtags: HashIcon,
  captions: QuoteIcon,
  'linkedin-headline': LayersIcon,
  'linkedin-summary': GridIcon,
  'whatsapp-status': WhatsAppIcon,
  'snapchat-caption': SnapchatIcon,
};

/**
 * Horizontal tool navigation for the active platform. Each tab carries its own
 * QuickKit-style 3D colour identity — glossy pastel tile, deep glyph — and the
 * active tab fills with its own deep tone. Plain anchors routed through the
 * history router — real URLs, crawlable, no reloads.
 */
export default function ToolTabs({ activeKey, keys, captionsLabel }: {
  /** Currently active tool. */
  activeKey: ToolKey;
  /** Tool keys exposed by the active platform, in display order. */
  keys: ToolKey[];
  /** Platform-specific label for the captions tool (e.g. "Post Captions"). */
  captionsLabel: string;
}) {
  return (
    <nav className="tool-tabs" aria-label="Toolkit tools">
      <ul className="tool-tabs-list">
        {keys.map((key, index) => {
          const tool = TOOLS.find((entry) => entry.key === key);
          if (!tool) return null;
          const label = key === 'captions' ? captionsLabel : tool.tabLabel;
          const active = key === activeKey;
          const theme = TOOL_THEMES[key];
          const Icon = TAB_ICONS[key];
          return (
            <li key={key}>
              <a
                className={`tool-tab${active ? ' is-active' : ''}`}
                href={tool.path}
                aria-current={active ? 'page' : undefined}
                onClick={handleAnchorClick}
                style={{
                  '--tool-tile-from': theme.tileFrom,
                  '--tool-tile-to': theme.tileTo,
                  '--tool-deep': theme.deep,
                  '--tool-accent': theme.accent,
                  '--tool-accent-hover': theme.accentHover,
                  '--tool-soft': theme.soft,
                  '--tool-line': theme.line,
                  '--tool-glow': theme.glow,
                  '--shine-delay': `${0.5 + index * 0.45}s`,
                } as CSSProperties}
              >
                <span className="tool-tab-icon icon3d" aria-hidden="true">
                  <Icon size={17} />
                </span>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
