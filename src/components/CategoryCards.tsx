import type { CSSProperties, JSX } from 'react';
import { handleAnchorClick } from '../lib/router';
import {
  ChevronRightIcon,
  ArrowUpRightIcon,
  SparkIcon,
  TypeIcon,
  AtIcon,
  HashIcon,
  SmileIcon,
  LinkedInIcon,
} from './icons';
import { CATEGORY_META } from '../lib/categoryMeta';
import { TOOL_THEMES, type ToolTheme } from '../lib/toolThemes';

const CATEGORY_ICONS: Record<string, (props: { size?: number }) => JSX.Element> = {
  bio: SparkIcon,
  'names-fonts': TypeIcon,
  usernames: AtIcon,
  'hashtags-captions': HashIcon,
  'emoji-symbols': SmileIcon,
  linkedin: LinkedInIcon,
};

/** Each category owns its QuickKit-style hue (paired with its anchor tool). */
const CATEGORY_THEMES: Record<string, ToolTheme> = {
  bio: TOOL_THEMES.bio,
  'names-fonts': TOOL_THEMES['stylish-name'],
  usernames: TOOL_THEMES.username,
  'hashtags-captions': TOOL_THEMES.captions,
  'emoji-symbols': TOOL_THEMES.symbols,
  linkedin: TOOL_THEMES['linkedin-headline'],
};

export const categoryIcon = (id: string, props: { size?: number }) => {
  const Icon = CATEGORY_ICONS[id] ?? SparkIcon;
  return <Icon {...props} />;
};

/**
 * Pastel category cards with real tool counts (computed from the registry).
 * Used by the /categories hub.
 */
export default function CategoryCards() {
  return (
    <ul className="pastel-grid">
      {CATEGORY_META.map((category) => {
        const theme = CATEGORY_THEMES[category.id] ?? TOOL_THEMES.bio;
        return (
        <li key={category.id}>
          <a
            id={`cat-${category.id}`}
            className={`category-card category-card--${category.pastel}`}
            href={category.href}
            onClick={handleAnchorClick}
            style={{
              '--tool-tile-from': theme.tileFrom,
              '--tool-tile-to': theme.tileTo,
              '--tool-deep': theme.deep,
              '--tool-accent': theme.accent,
              '--tool-glow': theme.glow,
            } as CSSProperties}
          >
            <span className="category-arrow" aria-hidden="true"><ArrowUpRightIcon size={18} /></span>
            <span className="category-icon icon3d" aria-hidden="true">{categoryIcon(category.id, { size: 26 })}</span>
            <span className="category-body">
              <span className="category-name">{category.name}</span>
              <span className="category-desc">{category.description}</span>
              <span className="category-meta">
                {category.tools.length} {category.tools.length === 1 ? 'tool' : 'tools'}
                <ChevronRightIcon size={15} aria-hidden="true" />
              </span>
            </span>
          </a>
        </li>
        );
      })}
    </ul>
  );
}
