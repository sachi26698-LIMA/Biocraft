import type { ComponentType } from 'react';
import BioTool from './bio/BioTool';
import StylishNameTool from './stylish/StylishNameTool';
import FancyFontTool from './fonts/FancyFontTool';
import DesignStudioTool from './design/DesignStudioTool';
import UsernameGenerator from './username/UsernameGenerator';
import SymbolGenerator from './symbols/SymbolGenerator';
import HashtagGenerator from './hashtags/HashtagGenerator';
import CaptionGenerator from './captions/CaptionGenerator';
import HeadlineGenerator from './linkedin/HeadlineGenerator';
import SummaryGenerator from './linkedin/SummaryGenerator';
import WhatsappStatusTool from './whatsapp-status/WhatsappStatusTool';
import SnapchatCaptionTool from './snapchat-caption/SnapchatCaptionTool';

export type ToolKey =
  | 'bio'
  | 'whatsapp-status'
  | 'snapchat-caption'
  | 'stylish-name'
  | 'fancy-fonts'
  | 'design-studio'
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
      'Five unique bios in English, Hindi or Hinglish — each within your platform’s character limit. — right in your browser.',
    title: 'Bio Generator — BioCraft Social Media Toolkit',
    description:
      'Generate five unique bios in English, Hindi or Hinglish — Instagram, Facebook, Threads, TikTok, X, LinkedIn, WhatsApp and Snapchat limits respected. Private, no sign-up.',
    ogTitle: 'Bio Generator — BioCraft',
    ogDescription: 'Five unique bios per platform, EN · Hindi · Hinglish, no sign-up, private.',
    Component: BioTool,
  },
  {
    key: 'stylish-name',
    path: '/stylish-name-generator',
    tabLabel: 'Stylish Name',
    heading: 'Stylish Name Generator',
    subheading:
      'Your display name in 33 Unicode text styles — with optional crown, gaming and attitude frames. Copy any variant in one tap. Private.',
    title: 'Stylish Name Generator — BioCraft Social Media Toolkit',
    description:
      'Turn your display name into 33 stylish Unicode text variants — bold, script, fraktur, double-struck and more, with optional name frames. One-tap copy, Private, no sign-up.',
    ogTitle: 'Stylish Name Generator — BioCraft',
    ogDescription: '33 stylish Unicode variants of your name, one-tap copy, Private.',
    Component: StylishNameTool,
  },
  {
    key: 'fancy-fonts',
    path: '/fancy-font-generator',
    tabLabel: 'Fancy Fonts',
    heading: 'Fancy Font Generator',
    subheading:
      'Paste any text and copy it in 33 styled Unicode fonts — perfect for bios, captions and comments.',
    title: 'Fancy Font Generator — BioCraft Social Media Toolkit',
    description:
      'Convert any text into 33 fancy Unicode fonts — bold, italic, script, monospace, fullwidth and more. Copy in one tap, Private, no sign-up.',
    ogTitle: 'Fancy Font Generator — BioCraft',
    ogDescription: 'Any text in 33 fancy Unicode fonts, one-tap copy, Private.',
    Component: FancyFontTool,
  },
  {
    key: 'design-studio',
    path: '/design-studio',
    tabLabel: 'Design Studio',
    heading: 'Design Studio',
    subheading:
      'Type any sentence — get it in Unicode fonts, emoji frames and ready-made card designs, with a live preview and one-tap copy.',
    title: 'Design Studio — BioCraft Social Media Toolkit',
    description:
      'Design Studio — type any sentence and get ready-made designs: 33 Unicode fonts × decorative emoji frames × 18 designer card styles. Mix yours in a live preview, or copy a curated mix.',
    ogTitle: 'Design Studio — BioCraft',
    ogDescription: 'Any sentence → ready-made font + emoji + card designs. Live preview, one-tap copy.',
    Component: DesignStudioTool,
  },
  {
    key: 'username',
    path: '/username-generator',
    tabLabel: 'Username',
    heading: 'Username Generator',
    subheading:
      'Twelve unique handle ideas from your name — with dots, underscores, keywords, vibes and more. Private.',
    title: 'Username Generator — BioCraft Social Media Toolkit',
    description:
      'Twelve unique handle ideas from your name — vibes, length control, dots, underscores, keyword blends. Devanagari transliterated. Private, no sign-up.',
    ogTitle: 'Username Generator — BioCraft',
    ogDescription: '12 unique username ideas from your name.',
    Component: UsernameGenerator,
  },
  {
    key: 'symbols',
    path: '/emoji-symbol-generator',
    tabLabel: 'Symbols',
    heading: 'Emoji & Symbol Generator',
    subheading:
      'A curated library of 531+ Unicode symbols and emoji — search, favourite ★, recents, one-tap copy. Private.',
    title: 'Emoji & Symbol Generator — BioCraft Social Media Toolkit',
    description:
      'Search and copy 531+ curated Unicode symbols and emoji — hearts, stars, arrows, royal, faith and more. One-tap copy, Private.',
    ogTitle: 'Emoji & Symbol Generator — BioCraft',
    ogDescription: '531+ curated Unicode symbols and emoji, searchable with favourites, Private.',
    Component: SymbolGenerator,
  },
  {
    key: 'hashtags',
    path: '/hashtag-generator',
    tabLabel: 'Hashtags',
    heading: 'Hashtag Generator',
    subheading:
      'Relevant, deduplicated hashtags for 14 niches — broad, medium and focused mix. English, Hindi or Hinglish.',
    title: 'Hashtag Generator — BioCraft Social Media Toolkit',
    description:
      'Generate relevant, deduplicated hashtags for 14 niches in English, Hindi or Hinglish — broad, medium and focused mix. Private, no reach promises.',
    ogTitle: 'Hashtag Generator — BioCraft',
    ogDescription: 'Relevant deduplicated hashtags for 14 niches, EN · Hindi · Hinglish.',
    Component: HashtagGenerator,
  },
  {
    key: 'captions',
    path: '/caption-generator',
    tabLabel: 'Captions',
    heading: 'Caption Generator',
    subheading:
      'Five unique captions for any topic and tone — English, Hindi or Hinglish, with counters and one-tap copy.',
    title: 'Caption Generator — BioCraft Social Media Toolkit',
    description:
      'Five unique captions for 12 topics in eight tones — casual, professional, funny, inspirational, quiet luxury and more — English, Hindi or Hinglish. Optional Unicode frames, one-tap copy.',
    ogTitle: 'Caption Generator — BioCraft',
    ogDescription: 'Five unique captions per run — 12 topics, eight tones, EN · Hindi · Hinglish, one-tap copy.',
    Component: CaptionGenerator,
  },
  {
    key: 'linkedin-headline',
    path: '/linkedin-headline-generator',
    tabLabel: 'Headline',
    heading: 'Professional Headline Generator',
    subheading:
      'Five sharp LinkedIn headlines — role, value and proof in 220 characters or less. Private.',
    title: 'LinkedIn Headline Generator — BioCraft Social Media Toolkit',
    description:
      'Five rule-based LinkedIn headline options — Role | Value | Proof patterns, ≤220 characters, no clichés generator, Private, no sign-up.',
    ogTitle: 'LinkedIn Headline Generator — BioCraft',
    ogDescription: 'Five professional LinkedIn headlines, ≤220 characters, Private.',
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
      'Five structured LinkedIn About-section drafts — role, focus and strengths, no invented facts, rule-based, Private, ≤2,600 characters.',
    ogTitle: 'LinkedIn Summary Generator — BioCraft',
    ogDescription: 'Five professional LinkedIn About drafts, rule-based, Private.',
    Component: SummaryGenerator,
  },
  {
    key: 'whatsapp-status',
    path: '/whatsapp-status-generator',
    tabLabel: 'Status',
    heading: 'WhatsApp Status Generator',
    subheading:
      'Ready-to-post WhatsApp status lines — good morning, attitude, love, festival and more, in English, Hindi or Hinglish.',
    title: 'WhatsApp Status Generator — BioCraft Social Media Toolkit',
    description:
      'WhatsApp status generator — 9 hand-written categories (good morning, attitude, love, birthday, festival, funny, motivational and more) in English, Hindi and Hinglish. Rule-based, private, no sign-up.',
    ogTitle: 'WhatsApp Status Generator — BioCraft',
    ogDescription: 'Status lines for every mood — EN, Hindi & Hinglish, one-tap copy.',
    Component: WhatsappStatusTool,
  },
  {
    key: 'snapchat-caption',
    path: '/snapchat-caption-generator',
    tabLabel: 'Snapchat Captions',
    heading: 'Snapchat Caption Generator',
    subheading:
      'Caption ideas for streaks, stories and every vibe — in English, Hindi or Hinglish.',
    title: 'Snapchat Caption Generator — BioCraft Social Media Toolkit',
    description:
      'Snapchat caption generator — streaks, stories, attitude, cute, funny and love captions in English, Hindi and Hinglish. Rule-based, private, no sign-up.',
    ogTitle: 'Snapchat Caption Generator — BioCraft',
    ogDescription: 'Streak, story & vibe captions — EN, Hindi & Hinglish, one-tap copy.',
    Component: SnapchatCaptionTool,
  },
];

export const DEFAULT_TOOL = TOOLS[0];
const byPath = new Map(TOOLS.map((tool) => [tool.path, tool]));
byPath.set('/', TOOLS[0]);

export function toolForPath(path: string): ToolMeta {
  return byPath.get(path) ?? DEFAULT_TOOL;
}
