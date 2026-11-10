/**
 * Optional caption frames — Unicode-safe decorative wrappers people paste
 * around captions on Instagram. Applied on top of the generated text at
 * render/copy time; the underlying pools stay untouched.
 */
export interface CaptionFrame {
  id: string;
  label: string;
  before: string;
  after: string;
}

export const CAPTION_FRAMES: readonly CaptionFrame[] = [
  { id: 'none', label: 'No frame', before: '', after: '' },
  { id: 'sparkle', label: '✦ Sparkle', before: '✦ ', after: ' ✦' },
  { id: 'star', label: '★ Star', before: '★ ', after: ' ★' },
  { id: 'heart', label: '♡ Heart', before: '♡ ', after: ' ♡' },
  { id: 'crown', label: '♛ Crown', before: '♛ ', after: ' ♛' },
  { id: 'diamond', label: '◆ Diamond', before: '◆ ', after: ' ◆' },
  { id: 'quotes', label: '“ ” Quotes', before: '“', after: '”' },
  { id: 'brackets', label: '『 』 Brackets', before: '『 ', after: ' 』' },
  { id: 'bolts', label: '⚡ Bolts', before: '⚡ ', after: ' ⚡' },
  { id: 'waves', label: '〜 Waves', before: '〜 ', after: ' 〜' },
  { id: 'slashes', label: '⧸ ⧹ Slash', before: '⧸ ', after: ' ⧹' },
];

export function applyCaptionFrame(text: string, frameId: string): string {
  const frame = CAPTION_FRAMES.find((entry) => entry.id === frameId) ?? CAPTION_FRAMES[0];
  return frame.before + text + frame.after;
}
