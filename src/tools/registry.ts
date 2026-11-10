import type { ComponentType } from 'react';
import BioTool from './bio/BioTool';
import StylishNameTool from './stylish/StylishNameTool';
import FancyFontTool from './fonts/FancyFontTool';
import UsernameGenerator from './username/UsernameGenerator';
import SymbolGenerator from './symbols/SymbolGenerator';
import HashtagGenerator from './hashtags/HashtagGenerator';
import CaptionGenerator from './captions/CaptionGenerator';
import HeadlineGenerator from './linkedin/HeadlineGenerator';
import SummaryGenerator from './linkedin/SummaryGenerator';

export type ToolKey =
  | 'bio'
  | 'stylish-name'
  | 'fancy-fonts'
  | 'username'
  | 'symbols'
  | 'hashtags'
  | 'captions'
  | 'linkedin-headline'
  | 'linkedin-summary';

/** Homepage route — renders the Bio tool view inside the full homepage. */
export const HOME_PATH = '/';

export interface ToolMeta {
  key: ToolKey;
  /** Canonical URL path for the tool route. */
  path: string;
  /** Short label used in the tool tabs. */
  tabLabel: string;
  /** Heading shown above the panel (fallback; platforms may override). */
  heading: string;
  subheading: string;
  /** document.title and the static shell's <title>. */
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  Component: ComponentType;
}

export const TOOLS: ToolMeta[] = [
  {
    key: 'bio',
    path: '/bio-generator',
    tabLabel: 'Bio',
    heading: 'Bio Generator',
    subheading:
      'Five unique bios in English or Hindi — each within your platform’s character limit. Free and private, right in your browser.',
    title: 'Bio Generator — BioCraft Social Media Toolkit',
    description:
      'Generate five unique bios in English or Hindi — Instagram, Facebook, Threads, TikTok, X and LinkedIn limits respected. Free, private, no sign-up.',
    ogTitle: 'Bio Generator — BioCraft',
    ogDescription: 'Five unique bios per platform, EN & Hindi, no sign-up, private.',
    Component: BioTool,
  },
  {
    key: 'stylish-name',
    path: '/stylish-name-generator',
    tabLabel: 'Stylish Name',
    heading: 'Stylish Name Generator',
    subheading:
      'Your display name in 24 Unicode text styles — copy any variant in one tap. Free and private, right in your browser.',
    title: 'Stylish Name Generator — BioCraft Social Media Toolkit',
    description:
      'Turn your display name into 24 stylish Unicode text variants — bold, script, fraktur, double-struck and more. One-tap copy, free, private, no sign-up.',
    ogTitle: 'Stylish Name Generator — BioCraft',
    ogDescription: '24 stylish Unicode variants of your name, one-tap copy, free and private.',
    Component: StylishNameTool,
  },
  {
    key: 'fancy-fonts',
    path: '/fancy-font-generator',
    tabLabel: 'Fancy Fonts',
    heading: 'Fancy Font Generator',
    subheading:
      'Paste any text and copy it in 24 styled Unicode fonts — perfect for bios, captions and comments.',
    title: 'Fancy Font Generator — BioCraft Social Media Toolkit',
    description:
      'Convert any text into 24 fancy Unicode fonts — bold, italic, script, monospace, fullwidth and more. Copy in one tap, free, private, no sign-up.',
    ogTitle: 'Fancy Font Generator — BioCraft',
    ogDescription: 'Any text in 24 fancy Unicode fonts, one-tap copy, free and private.',
    Component: FancyFontTool,
  },
  {
    key: 'username',
    path: '/username-generator',
    tabLabel: 'Username',
    heading: 'Username Generator',
    subheading:
      'Twelve unique handle ideas from your name — with dots, underscores, keywords, vibes and more. Free and private.',
    title: 'Username Generator — BioCraft Social Media Toolkit',
    description:
      'Twelve unique handle ideas from your name — vibes, length control, dots, underscores, keyword blends. Devanagari transliterated. Free, private, no sign-up.',
    ogTitle: 'Username Generator — BioCraft',
    ogDescription: '12 unique username ideas from your name — free and private.',
    Component: UsernameGenerator,
  },
  {
    key: 'symbols',
    path: '/emoji-symbol-generator',
    tabLabel: 'Symbols',
    heading: 'Emoji & Symbol Generator',
    subheading:
      'A curated library of 300+ Unicode symbols and emoji — search, browse, tap to copy. Free and private.',
    title: 'Emoji & Symbol Generator — BioCraft Social Media Toolkit',
    description:
      'Search and copy 300+ curated Unicode symbols and emoji — hearts, stars, arrows, shapes and more. One-tap copy, free and private.',
    ogTitle: 'Emoji & Symbol Generator — BioCraft',
    ogDescription: '300+ curated Unicode symbols and emoji, searchable, one-tap copy, free and private.',
    Component: SymbolGenerator,
  },
  {
    key: 'hashtags',
    path: '/hashtag-generator',
    tabLabel: 'Hashtags',
    heading: 'Hashtag Generator',
    subheading:
      'Relevant, deduplicated hashtags for 12 niches — broad, medium and focused mix. English or Hindi.',
    title: 'Hashtag Generator — BioCraft Social Media Toolkit',
    description:
      'Generate relevant, deduplicated hashtags for 12 niches in English or Hindi — broad, medium and focused mix. Free, private, no reach promises.',
    ogTitle: 'Hashtag Generator — BioCraft',
    ogDescription: 'Relevant deduplicated hashtags for 12 niches, EN & Hindi — free and private.',
    Component: HashtagGenerator,
  },
  {
    key: 'captions',
    path: '/caption-generator',
    tabLabel: 'Captions',
    heading: 'Caption Generator',
    subheading:
      'Five unique captions for any topic and tone — English or Hindi, with counters and one-tap copy.',
    title: 'Caption Generator — BioCraft Social Media Toolkit',
    description:
      'Five unique captions for 12 topics in seven tones — casual, professional, funny, inspirational, minimal and more — EN or Hindi. One-tap copy.',
    ogTitle: 'Caption Generator — BioCraft',
    ogDescription: 'Five unique captions per run — 12 topics, EN & Hindi, one-tap copy.',
    Component: CaptionGenerator,
  },
  {
    key: 'linkedin-headline',
    path: '/linkedin-headline-generator',
    tabLabel: 'Headline',
    heading: 'Professional Headline Generator',
    subheading:
      'Five sharp LinkedIn headlines — role, value and proof in 220 characters or less. Free and private.',
    title: 'LinkedIn Headline Generator — BioCraft Social Media Toolkit',
    description:
      'Five rule-based LinkedIn headline options — Role | Value | Proof patterns, ≤220 characters, no clichés generator, free, private, no sign-up.',
    ogTitle: 'LinkedIn Headline Generator — BioCraft',
    ogDescription: 'Five professional LinkedIn headlines, ≤220 characters, free and private.',
    Component: HeadlineGenerator,
  },
  {
    key: 'linkedin-summary',
    path: '/linkedin-summary-generator',
    tabLabel: 'Summary',
    heading: 'Professional Summary Generator',
    subheading:
      'Five structured LinkedIn About-section drafts — clear, specific and honest. ≤2,600 characters.',
    title: 'LinkedIn Summary Generator — BioCraft Social Media Toolkit',
    description:
      'Five structured LinkedIn About-section drafts — role, focus and strengths, no invented facts, rule-based, free, private, ≤2,600 characters.',
    ogTitle: 'LinkedIn Summary Generator — BioCraft',
    ogDescription: 'Five professional LinkedIn About drafts, rule-based, free and private.',
    Component: SummaryGenerator,
  },
];

export const DEFAULT_TOOL = TOOLS[0];
const byPath = new Map(TOOLS.map((tool) => [tool.path, tool]));
byPath.set('/', TOOLS[0]);

export function toolForPath(path: string): ToolMeta {
  return byPath.get(path) ?? DEFAULT_TOOL;
}
