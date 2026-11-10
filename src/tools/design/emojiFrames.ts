import type { BioDesignKey } from '../../lib/bioCollections';

/**
 * Decorative emoji/Unicode frames — a left and right ornament applied around a
 * styled sentence. Frames never touch the base text; they are pure, copyable
 * Unicode wrappers.
 */
export interface EmojiFrame {
  id: string;
  label: string;
  before: string;
  after: string;
}

export const EMOJI_FRAMES: readonly EmojiFrame[] = [
  { id: 'none', label: 'No frame', before: '', after: '' },
  { id: 'sparkle', label: 'Sparkles', before: '✦ ', after: ' ✦' },
  { id: 'starlight', label: 'Starlight', before: '✧ ', after: ' ✧' },
  { id: 'stardust', label: 'Star Dust', before: '⋆⋅⋆⋅⋆ ', after: ' ⋆⋅⋆⋅⋆' },
  { id: 'crown', label: 'Crown', before: '👑 ', after: ' 👑' },
  { id: 'royal', label: 'Royal Brackets', before: '꧁༺ ', after: ' ༻꧂' },
  { id: 'hearts', label: 'Hearts', before: '♡ ', after: ' ♡' },
  { id: 'red-hearts', label: 'Red Hearts', before: '❤️ ', after: ' ❤️' },
  { id: 'fire', label: 'Fire', before: '🔥 ', after: ' 🔥' },
  { id: 'flower', label: 'Chrysanthemum', before: '❀ ', after: ' ❀' },
  { id: 'music', label: 'Music Notes', before: '♪ ', after: ' ♪' },
  { id: 'arrows', label: 'Decorative Arrows', before: '➳ ', after: ' ➳' },
  { id: 'diamond', label: 'Diamonds', before: '─◆─ ', after: ' ─◆─' },
  { id: 'heavy-line', label: 'Heavy Line', before: '━━ ', after: ' ━━' },
  { id: 'light-line', label: 'Light Line', before: '─── ', after: ' ───' },
  { id: 'moon', label: 'Moons', before: '☾ ', after: ' ☽' },
  { id: 'sun', label: 'Suns', before: '☀ ', after: ' ☀' },
  { id: 'brackets-jp', label: '୨୧ Brackets', before: '୨୧ ', after: ' ୨୧' },
  { id: 'gem', label: 'Gems', before: '❖ ', after: ' ❖' },
  { id: 'wave', label: 'Wave', before: '~ ✿ ~ ', after: ' ~ ✿ ~' },
];

export const frameById = (id: string): EmojiFrame =>
  EMOJI_FRAMES.find((frame) => frame.id === id) ?? EMOJI_FRAMES[0];

/**
 * Hand-curated mix recipes — font style + emoji frame + card design, picked to
 * look intentional together. The gallery rotates through these (no random junk).
 */
export interface MixCombo {
  style: string;
  frame: string;
  design: BioDesignKey;
  /** Short human name for the combo. */
  name: string;
}

export const MIX_COMBOS: readonly MixCombo[] = [
  { style: 'bold-script', frame: 'crown', design: 'royal', name: 'Royal Crown' },
  { style: 'fraktur', frame: 'heavy-line', design: 'dark', name: 'Midnight Fraktur' },
  { style: 'cursive', frame: 'sparkle', design: 'aesthetic', name: 'Soft Sparkle Script' },
  { style: 'double-struck', frame: 'arrows', design: 'creative', name: 'Arcade Echo' },
  { style: 'monospace', frame: 'light-line', design: 'professional', name: 'Mono Brief' },
  { style: 'bold', frame: 'fire', design: 'attitude', name: 'Main Character Fire' },
  { style: 'italic', frame: 'hearts', design: 'love', name: 'Tender Italic' },
  { style: 'script', frame: 'flower', design: 'cute', name: 'Garden Script' },
  { style: 'sans-bold', frame: 'diamond', design: 'vip', name: 'Velvet VIP' },
  { style: 'bold-fraktur', frame: 'moon', design: 'devotional', name: 'Quiet Devotion' },
  { style: 'fullwidth', frame: 'gem', design: 'minimal', name: 'Fullwidth Minimal' },
  { style: 'aesthetic', frame: 'starlight', design: 'aesthetic', name: 'Lo-fi Starlight' },
  { style: 'small-caps', frame: 'royal', design: 'royal', name: 'Heritage Caps' },
  { style: 'bold-italic', frame: 'music', design: 'funny', name: 'Encore Bold Italic' },
  { style: 'bubble', frame: 'hearts', design: 'cute', name: 'Bubble Heart' },
  { style: 'decorative', frame: 'wave', design: 'creative', name: 'Wave Pop' },
  { style: 'negative-squared', frame: 'heavy-line', design: 'dark', name: 'Inverse Block' },
  { style: 'superscript', frame: 'stardust', design: 'vip', name: 'Stardust VIP' },
];

export const MIXES_PER_PAGE = 12;
