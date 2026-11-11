/**
 * Platform configuration — the eight platform experiences offered by BioCraft.
 *
 * Per the light-glass design system:
 *  - The UI runs on the light palette (#FCF9FC background, white-glass cards).
 *  - Each platform owns its own brand-hugging hue (user-approved QuickKit-style
 *    re-theme, 2026-11-09): pill, glow and the whole generate area re-colour
 *    to it when the platform is clicked. Deep tones pass WCAG AA with white.
 *  - Bio character limits follow each platform's real constraint:
 *    Instagram 150 · Facebook 101 (intro) · Threads 150 · TikTok 80 · X 160 ·
 *    LinkedIn 2600 (About section; the Headline tool enforces 220) ·
 *    WhatsApp 139 (About) · Snapchat ~150 (bio surface).
 */
import type { ToolKey } from './registry';

export type PlatformId = 'instagram' | 'facebook' | 'threads' | 'tiktok' | 'x' | 'linkedin' | 'whatsapp' | 'snapchat';

export interface PlatformConfig {
  id: PlatformId;
  /** Full name used in headings, buttons and copy. */
  name: string;
  /** Short label for the platform pill. */
  shortName: string;
  /** Accent colour for the workspace (buttons, active pill, glow). */
  accent: string;
  /** Text colour on the accent (must pass WCAG AA — checked in the audit). */
  onAccent: string;
  /** Hover/pressed mid tone (slightly stronger/lighter than accent). */
  accentHover: string;
  /** Deep tone — active pill + top border + white text (WCAG AA verified). */
  deep: string;
  /** Soft accent for borders/glows (rgba string). */
  accentSoft: string;
  /** Soft tint border (rgba string). */
  line: string;
  /** Pastel tile gradient stops for the 3D pill icon. */
  tileFrom: string;
  tileTo: string;
  /** Bio limit for this platform (Instagram's 150 remains the default). */
  bioLimit: number;
  /** What the Bio tool is called inside this workspace. */
  bioHeading: string;
  bioSubheading: string;
  /** What captions are called inside this workspace (e.g. "Post Captions" on X). */
  captionsLabel: string;
  /** Tools exposed in this workspace, in tab order. */
  tools: ToolKey[];
  /** Language support note for the tool UI when a platform is EN-only. */
  englishOnlyNote?: string;
}

export const PLATFORMS: readonly PlatformConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    shortName: 'Instagram',
    accent: '#D62976',
    onAccent: '#FFFFFF',
    accentSoft: 'rgba(214, 41, 118, 0.30)',
    accentHover: '#B51F61',
    deep: '#A91F59',
    line: 'rgba(214, 41, 118, 0.42)',
    tileFrom: '#FFE3EF',
    tileTo: '#F7BFD7',
    bioLimit: 150,
    bioHeading: 'Instagram Bio Generator',
    bioSubheading:
      'Five unique bios in English, Hindi or Hinglish — each within Instagram’s 150-character limit — right in your browser.',
    captionsLabel: 'Caption Generator',
    tools: ['bio', 'stylish-name', 'fancy-fonts', 'design-studio', 'username', 'symbols', 'hashtags', 'captions'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    shortName: 'Facebook',
    accent: '#1568D6',
    onAccent: '#FFFFFF',
    accentSoft: 'rgba(24, 119, 242, 0.28)',
    accentHover: '#0F63D8',
    deep: '#0F5CC2',
    line: 'rgba(24, 119, 242, 0.42)',
    tileFrom: '#E1EDFF',
    tileTo: '#BCD6FB',
    bioLimit: 101,
    bioHeading: 'Facebook Bio Generator',
    bioSubheading:
      'Five unique intro lines for your Facebook profile — each within the 101-character intro limit. English, Hindi or Hinglish. Private.',
    captionsLabel: 'Caption Generator',
    tools: ['bio', 'stylish-name', 'fancy-fonts', 'design-studio', 'username', 'symbols', 'hashtags', 'captions'],
  },
  {
    id: 'threads',
    name: 'Threads',
    shortName: 'Threads',
    accent: '#3F4750',
    onAccent: '#FFFFFF',
    accentSoft: 'rgba(63, 71, 80, 0.26)',
    accentHover: '#2E343C',
    deep: '#23272E',
    line: 'rgba(63, 71, 80, 0.42)',
    tileFrom: '#ECEEF0',
    tileTo: '#CFD4DB',
    bioLimit: 150,
    bioHeading: 'Threads Bio Generator',
    bioSubheading:
      'Five unique bios for Threads — each within the 150-character limit. English, Hindi or Hinglish — right in your browser.',
    captionsLabel: 'Caption Generator',
    tools: ['bio', 'username', 'fancy-fonts', 'design-studio', 'symbols', 'hashtags', 'captions'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    shortName: 'TikTok',
    accent: '#E01E47',
    onAccent: '#FFFFFF',
    accentSoft: 'rgba(224, 30, 71, 0.28)',
    accentHover: '#C41840',
    deep: '#B8123A',
    line: 'rgba(224, 30, 71, 0.42)',
    tileFrom: '#FFE1E7',
    tileTo: '#FFBFCE',
    bioLimit: 80,
    bioHeading: 'TikTok Bio Generator',
    bioSubheading:
      'Five unique bios for TikTok — each within the tight 80-character limit. English, Hindi or Hinglish. Private.',
    captionsLabel: 'Caption Generator',
    tools: ['bio', 'username', 'fancy-fonts', 'design-studio', 'hashtags', 'captions', 'symbols'],
  },
  {
    id: 'x',
    name: 'X (Twitter)',
    shortName: 'X',
    accent: '#151A21',
    onAccent: '#FFFFFF',
    accentSoft: 'rgba(15, 20, 25, 0.22)',
    accentHover: '#232B36',
    deep: '#0F1419',
    line: 'rgba(15, 20, 25, 0.4)',
    tileFrom: '#E9ECEF',
    tileTo: '#CCD2DA',
    bioLimit: 160,
    bioHeading: 'X Bio Generator',
    bioSubheading:
      'Five unique bios for X — each within the 160-character limit. English, Hindi or Hinglish — right in your browser.',
    captionsLabel: 'Post Captions',
    tools: ['bio', 'username', 'fancy-fonts', 'design-studio', 'hashtags', 'captions', 'symbols'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    shortName: 'LinkedIn',
    accent: '#0A66C2',
    onAccent: '#FFFFFF',
    accentSoft: 'rgba(10, 102, 194, 0.28)',
    accentHover: '#084E95',
    deep: '#084A8F',
    line: 'rgba(10, 102, 194, 0.42)',
    tileFrom: '#E0EDFF',
    tileTo: '#B9D6F5',
    bioLimit: 2600,
    bioHeading: 'LinkedIn Professional Bio',
    bioSubheading:
      'Five professional bio drafts for your LinkedIn About section — English — right in your browser.',
    captionsLabel: 'Professional Captions',
    tools: ['bio', 'linkedin-headline', 'linkedin-summary', 'stylish-name', 'username', 'captions', 'design-studio'],
    englishOnlyNote: 'LinkedIn tools currently produce English output.',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    shortName: 'WhatsApp',
    accent: '#075E54',
    onAccent: '#FFFFFF',
    accentSoft: 'rgba(7, 94, 84, 0.28)',
    accentHover: '#0B6E60',
    deep: '#054C43',
    line: 'rgba(7, 94, 84, 0.42)',
    tileFrom: '#D9F7E8',
    tileTo: '#A9EDCB',
    bioLimit: 139,
    bioHeading: 'WhatsApp About Generator',
    bioSubheading:
      'Five unique lines for your WhatsApp About — each within the 139-character limit. English, Hindi or Hinglish. Private.',
    captionsLabel: 'Status Captions',
    tools: ['bio', 'whatsapp-status', 'stylish-name', 'fancy-fonts', 'design-studio', 'captions', 'symbols'],
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    shortName: 'Snapchat',
    accent: '#FCE016',
    onAccent: '#111410',
    accentSoft: 'rgba(252, 224, 22, 0.45)',
    accentHover: '#E8CE10',
    deep: '#D8B400',
    line: 'rgba(216, 180, 0, 0.5)',
    tileFrom: '#FFFDE6',
    tileTo: '#FBF3A6',
    bioLimit: 150,
    bioHeading: 'Snapchat Bio Generator',
    bioSubheading:
      'Five unique lines for your Snapchat bio — each within roughly 150 characters. English, Hindi or Hinglish. Private.',
    captionsLabel: 'Story Captions',
    tools: ['bio', 'snapchat-caption', 'username', 'fancy-fonts', 'design-studio', 'symbols'],
  },
];

export const DEFAULT_PLATFORM: PlatformConfig = PLATFORMS[0];

export const platformById = (id: string | null | undefined): PlatformConfig =>
  PLATFORMS.find((platform) => platform.id === id) ?? DEFAULT_PLATFORM;
