/**
 * Shared category definitions for the discovery surfaces (homepage "Explore by
 * Category" and the /categories hub). Tool counts are computed live from the
 * registry so they can never drift out of sync with reality.
 */
import type { ToolKey } from '../tools/registry';

export interface CategoryMeta {
  id: string;
  name: string;
  description: string;
  tools: ToolKey[];
  href: string;
  pastel: 'lav' | 'pink' | 'cyan' | 'mint' | 'peach' | 'rose';
}

export const CATEGORY_META: readonly CategoryMeta[] = [
  {
    id: 'bio',
    name: 'Bio Generators',
    description: 'Five unique bios per platform, EN · Hindi · Hinglish, within each platform’s character limit.',
    tools: ['bio'],
    href: '/bio-generator',
    pastel: 'lav',
  },
  {
    id: 'names-fonts',
    name: 'Stylish Names & Fonts',
    description: 'Display names in 33 Unicode styles, styled fonts for any text — plus emoji frames and ready-made font × emoji × card-design mixes.',
    tools: ['stylish-name', 'fancy-fonts', 'design-studio'],
    href: '/stylish-name-generator',
    pastel: 'pink',
  },
  {
    id: 'usernames',
    name: 'Usernames',
    description: 'Twelve unique handle ideas from your name — vibes, length control, keyword blends.',
    tools: ['username'],
    href: '/username-generator',
    pastel: 'cyan',
  },
  {
    id: 'hashtags-captions',
    name: 'Hashtags & Captions',
    description: 'Niche-targeted hashtag sets and ready-to-post captions with engagement hooks.',
    tools: ['hashtags', 'captions'],
    href: '/hashtag-generator',
    pastel: 'mint',
  },
  {
    id: 'emoji-symbols',
    name: 'Emoji & Symbols',
    description: 'Curated emoji and decorative Unicode symbols, copy-ready for bios and comments.',
    tools: ['symbols'],
    href: '/emoji-symbol-generator',
    pastel: 'peach',
  },
  {
    id: 'linkedin',
    name: 'Social Media Tools',
    description: 'LinkedIn headline and About-section generators that sound like you, minus the buzzwords.',
    tools: ['linkedin-headline', 'linkedin-summary'],
    href: '/linkedin-headline-generator',
    pastel: 'rose',
  },
];
