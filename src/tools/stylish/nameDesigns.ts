/**
 * Curated decorative wraps for the Stylish Name tool — the popular
 * "designed name" looks people actually paste into display names and
 * usernames. Pure wrap functions over the styled text; no network, no fonts.
 */
export interface NameDesign {
  id: string;
  label: string;
  /** Wraps the already-styled name. Identity for the "none" option. */
  wrap: (text: string) => string;
}

export const NAME_DESIGNS: readonly NameDesign[] = [
  { id: 'none', label: 'No design', wrap: (text) => text },
  { id: 'crown', label: 'Crown 👑', wrap: (text) => `👑 ${text} 👑` },
  { id: 'gaming', label: 'Gaming ꧁༺ ༻꧂', wrap: (text) => `꧁༺ ${text} ༻꧂` },
  { id: 'royal', label: 'Royal ♛', wrap: (text) => `♛ ${text} ♛` },
  { id: 'vip', label: 'VIP ░▒▓', wrap: (text) => `░▒▓ ${text} ▓▒░` },
  { id: 'attitude', label: 'Attitude ☬', wrap: (text) => `☬ ${text} ☬` },
  { id: 'fire', label: 'Fire 🔥', wrap: (text) => `🔥 ${text} 🔥` },
  { id: 'bolt', label: 'Bolt ⚡', wrap: (text) => `⚡ ${text} ⚡` },
  { id: 'stars', label: 'Stars ★', wrap: (text) => `★ ${text} ★` },
  { id: 'sparkle', label: 'Sparkle ✦', wrap: (text) => `✦ ${text} ✦` },
  { id: 'hearts', label: 'Hearts ♡', wrap: (text) => `♡ ${text} ♡` },
  { id: 'brackets', label: 'Quotes 『』', wrap: (text) => `『 ${text} 』` },
  { id: 'slash', label: 'Slash ╱ ╲', wrap: (text) => `╱ ${text} ╲` },
];

export function applyNameDesign(text: string, designId: string): string {
  return (NAME_DESIGNS.find((design) => design.id === designId) ?? NAME_DESIGNS[0]).wrap(text);
}
