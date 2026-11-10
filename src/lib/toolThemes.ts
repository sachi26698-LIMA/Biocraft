import type { ToolKey } from '../tools/registry';

export interface ToolTheme {
  /** Pastel gradient stops for the 3D icon tile (light, glassy). */
  tileFrom: string;
  tileTo: string;
  /** Mid accent — glows, gradients, hover states (white-text-safe pairs avoided here). */
  accent: string;
  /** Hover / pressed mid accent. */
  accentHover: string;
  /** Deep tone — icons on pastel, active pill & CTA end stop (WCAG AA on white). */
  deep: string;
  /** Soft tint for fills (rgba string). */
  soft: string;
  /** Soft border for tinted surfaces (rgba string). */
  line: string;
  /** Colored ambient glow (rgba string). */
  glow: string;
}

/**
 * QuickKit-style per-tool colour identity — every tool owns a distinct hue.
 * Pastel tile + deep icon/active tone, all inside the light glass palette.
 * The workspace re-themes off these vars the moment a tool tab is clicked.
 */
export const TOOL_THEMES: Record<ToolKey, ToolTheme> = {
  bio: {
    tileFrom: '#F4EBFF', tileTo: '#DCC7FA',
    accent: '#8B4BC0', accentHover: '#7A3CA8', deep: '#6D28A8',
    soft: 'rgba(139, 75, 192, 0.12)', line: 'rgba(139, 75, 192, 0.38)', glow: 'rgba(139, 75, 192, 0.42)',
  },
  'stylish-name': {
    tileFrom: '#FFE9F3', tileTo: '#FFC9DE',
    accent: '#D6538F', accentHover: '#BC3F78', deep: '#B03060',
    soft: 'rgba(214, 83, 143, 0.12)', line: 'rgba(214, 83, 143, 0.38)', glow: 'rgba(214, 83, 143, 0.4)',
  },
  'fancy-fonts': {
    tileFrom: '#FFEBDD', tileTo: '#FFD0B4',
    accent: '#DE6B2B', accentHover: '#C2511D', deep: '#9A4A0E',
    soft: 'rgba(222, 107, 43, 0.12)', line: 'rgba(222, 107, 43, 0.38)', glow: 'rgba(222, 107, 43, 0.4)',
  },
  'design-studio': {
    tileFrom: '#ECEFFF', tileTo: '#CBD2FF',
    accent: '#4F46E5', accentHover: '#4338CA', deep: '#3730A3',
    soft: 'rgba(79, 70, 229, 0.12)', line: 'rgba(79, 70, 229, 0.38)', glow: 'rgba(79, 70, 229, 0.4)',
  },
  username: {
    tileFrom: '#E3F5FE', tileTo: '#BBE2F7',
    accent: '#2E86C1', accentHover: '#226A9C', deep: '#0A4A77',
    soft: 'rgba(46, 134, 193, 0.12)', line: 'rgba(46, 134, 193, 0.38)', glow: 'rgba(46, 134, 193, 0.4)',
  },
  symbols: {
    tileFrom: '#FDE0EC', tileTo: '#F6BAD6',
    accent: '#C9467E', accentHover: '#A93663', deep: '#8F2C4F',
    soft: 'rgba(201, 70, 126, 0.12)', line: 'rgba(201, 70, 126, 0.38)', glow: 'rgba(201, 70, 126, 0.4)',
  },
  hashtags: {
    tileFrom: '#E2FBEC', tileTo: '#BDEEDA',
    accent: '#1F9D6B', accentHover: '#177A51', deep: '#0E6B4E',
    soft: 'rgba(31, 157, 107, 0.12)', line: 'rgba(31, 157, 107, 0.38)', glow: 'rgba(31, 157, 107, 0.4)',
  },
  captions: {
    tileFrom: '#FDF4C0', tileTo: '#F6E18B',
    accent: '#A98A07', accentHover: '#8A6F05', deep: '#7A5200',
    soft: 'rgba(169, 138, 7, 0.14)', line: 'rgba(169, 138, 7, 0.4)', glow: 'rgba(190, 158, 24, 0.45)',
  },
  'linkedin-headline': {
    tileFrom: '#E0EDFF', tileTo: '#BDD8F7',
    accent: '#0A66C2', accentHover: '#084E95', deep: '#0A4A8F',
    soft: 'rgba(10, 102, 194, 0.12)', line: 'rgba(10, 102, 194, 0.38)', glow: 'rgba(10, 102, 194, 0.4)',
  },
  'whatsapp-status': {
    tileFrom: '#D9F7E8', tileTo: '#A9EDCB',
    accent: '#128C7E', accentHover: '#0E6B60', deep: '#075E54',
    soft: 'rgba(18, 140, 126, 0.13)', line: 'rgba(18, 140, 126, 0.4)', glow: 'rgba(37, 211, 102, 0.45)',
  },
  'snapchat-caption': {
    tileFrom: '#FFFDE6', tileTo: '#FBF3A6',
    accent: '#C9A900', accentHover: '#A88900', deep: '#5F5200',
    soft: 'rgba(252, 224, 22, 0.22)', line: 'rgba(216, 180, 0, 0.45)', glow: 'rgba(252, 224, 22, 0.5)',
  },
  'linkedin-summary': {
    tileFrom: '#D9F6F0', tileTo: '#B4E8DE',
    accent: '#12897C', accentHover: '#0C6A60', deep: '#0E5257',
    soft: 'rgba(18, 137, 124, 0.13)', line: 'rgba(18, 137, 124, 0.38)', glow: 'rgba(18, 137, 124, 0.4)',
  },
};
