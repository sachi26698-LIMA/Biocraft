import type { CSSProperties, JSX } from 'react';
import { handleAnchorClick } from '../lib/router';
import { ArrowUpRightIcon } from './icons';
import FavouriteButton from './FavouriteButton';
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
import { TOOLS, type ToolKey } from '../tools/registry';
import { TOOL_THEMES } from '../lib/toolThemes';

const TOOL_BY_KEY = new Map(TOOLS.map((tool) => [tool.key, tool]));

const TOOL_ICONS: Record<ToolKey, (props: { size?: number }) => JSX.Element> = {
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
 * QuickKit-style tool card: 3D pastel icon tile + tag pill + favourite star up top,
 * title, description, "Open tool" link with a round arrow button bottom-right.
 */
export default function ToolTile({ toolKey }: { toolKey: ToolKey }) {
  const tool = TOOL_BY_KEY.get(toolKey);
  if (!tool) return null;
  const Icon = TOOL_ICONS[tool.key];
  const theme = TOOL_THEMES[tool.key];
  const iconVars = {
    '--tool-tile-from': theme.tileFrom,
    '--tool-tile-to': theme.tileTo,
    '--tool-deep': theme.deep,
    '--tool-accent': theme.accent,
    '--tool-soft': theme.soft,
    '--tool-line': theme.line,
    '--tool-glow': theme.glow,
  } as CSSProperties;
  return (
    <li className="tile" style={iconVars}>
      <div className="tile-top">
        <span className="tile-icon icon3d" aria-hidden="true">
          <Icon size={26} />
        </span>
        <span className="tile-tag">{tool.tabLabel}</span>
        <div className="tile-fav">
          <FavouriteButton toolKey={tool.key} toolName={tool.heading} />
        </div>
      </div>
      <a className="tile-link" href={tool.path} onClick={handleAnchorClick}>
        <span className="tile-title">{tool.heading}</span>
        <span className="tile-desc">{tool.description}</span>
        <span className="tile-foot">
          <span className="tile-open">Open tool</span>
          <span className="tile-arrow">
            <ArrowUpRightIcon size={18} />
          </span>
        </span>
      </a>
    </li>
  );
}
