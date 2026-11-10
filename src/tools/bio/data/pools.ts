import type { Language, Mode } from '../../../types';

/**
 * BioCraft composes bios from proven line templates. Each pool holds single
 * lines; the generator picks one identity line, one or two detail lines,
 * optionally a location line and a call-to-action, then deduplicates and
 * length-checks the result.
 *
 * Placeholders: {name} {role} {niche} {city} {e} (an emoji).
 */

export interface LinePools {
  identity: string[];
  detail: string[];
  detailGeneric: string[];
  location: string[];
  cta: string[];
}

interface LangPools {
  identityPersonal: string[];
  identityPersonalEmoji: string[];
  identityCategory: string[];
  identityCategoryEmoji: string[];
  detail: string[];
  detailEmoji: string[];
  detailGeneric: string[];
  location: string[];
  locationEmoji: string[];
  cta: string[];
  ctaEmoji: string[];
}

const EN: LangPools = {
  identityPersonal: [
    '{name}',
    '{name} | {role}',
    '{name} · {role}',
    'Hi, I am {name}',
    'Hey, {name} here',
    '{role}',
  ],
  identityPersonalEmoji: [
    '{name} | {role} {e}',
    'Hi, I am {name} {e}',
    'Hey! {name} here {e}',
    '{role} {e}',
    '{name} · {role} {e}',
  ],
  identityCategory: [
    '{role}',
    '{role} | {niche}',
    '{role} · {niche}',
    'Notes on {niche}',
    'Sharing {niche}',
  ],
  identityCategoryEmoji: [
    '{role} {e}',
    '{role} | {niche} {e}',
    '{role} · {niche} {e}',
    'Notes on {niche} {e}',
    'Building with {niche} {e}',
  ],
  detail: [
    'Passionate about {niche}',
    'All things {niche}',
    'Sharing {niche}',
    '{niche} enthusiast',
    'Creating around {niche}',
    'Talks {niche}',
    'Deep dives into {niche}',
  ],
  detailEmoji: [
    'All things {niche} {e}',
    'Creating around {niche} {e}',
    '{niche} enthusiast {e}',
    'Passionate about {niche} {e}',
    'Here for all things {niche} {e}',
  ],
  detailGeneric: [
    'Sharing what I love',
    'Welcome to my page',
    'Documenting my journey',
    'Making room for the everyday',
  ],
  location: ['Based in {city}', 'From {city}', '{city} based'],
  locationEmoji: ['📍 {city}', '📍 Based in {city}'],
  cta: [
    'DMs open',
    'DM for collaborations',
    'Link in bio',
    'New posts every week',
    'Follow along for more',
  ],
  ctaEmoji: [
    '📩 DMs open',
    '📩 DM for collabs',
    '👇 Link in bio',
    '✨ New posts every week',
    '🔗 Link below',
    'Follow along for more {e}',
  ],
};

const HI: LangPools = {
  identityPersonal: [
    '{name}',
    '{name} | {role}',
    '{name} · {role}',
    'नमस्ते, मैं {name}',
    'हाय, मैं {name} हूँ',
    '{role}',
  ],
  identityPersonalEmoji: [
    '{name} | {role} {e}',
    'नमस्ते, मैं {name} हूँ {e}',
    'हाय! मैं {name} {e}',
    '{role} {e}',
    '{name} · {role} {e}',
  ],
  identityCategory: [
    '{role}',
    '{role} | {niche}',
    '{role} · {niche}',
    '{niche} वाला पेज',
    '{niche} की बातें',
  ],
  identityCategoryEmoji: [
    '{role} {e}',
    '{role} | {niche} {e}',
    '{role} · {niche} {e}',
    '{niche} की बातें {e}',
    '{niche} वाला पेज {e}',
  ],
  detail: [
    '{niche} पर कंटेंट',
    '{niche} वाली बातें',
    '{niche} की दुनिया',
    'रोज़ाना {niche}',
    '{niche} से जुड़ी बातें',
    '{niche} की हर चीज़',
  ],
  detailEmoji: [
    '{niche} पर कंटेंट {e}',
    '{niche} वाली बातें {e}',
    '{niche} की दुनिया {e}',
    'रोज़ाना {niche} {e}',
    '{niche} पर नियमित पोस्ट {e}',
  ],
  detailGeneric: [
    'जो पसंद है वही यहाँ',
    'मेरे पेज पर आपका स्वागत है',
    'अपनी रोज़मर्रा की ज़िंदगी',
  ],
  location: ['{city} से', '{city} में बेस्ड', 'बेस्ड इन {city}'],
  locationEmoji: ['📍 {city}', '📍 {city} से'],
  cta: [
    'DM खुले हैं',
    'कोलैब के लिए DM करें',
    'लिंक इन बायो',
    'नए पोस्ट हर हफ़्ते',
    'ज़्यादा अपडेट्स के लिए फ़ॉलो करें',
  ],
  ctaEmoji: [
    '📩 DM खुले हैं',
    '📩 कोलैब के लिए DM करें',
    '👇 लिंक इन बायो',
    '✨ नए पोस्ट हर हफ़्ते',
    '🔗 लिंक नीचे',
    'ज़्यादा अपडेट्स के लिए फ़ॉलो करें {e}',
  ],
};

const SOURCE: Record<Language, LangPools> = { en: EN, hi: HI };

function merge(plain: string[], emoji: string[], emojis: boolean): string[] {
  return emojis ? [...plain, ...emoji] : plain;
}

/** Returns the active pool set. Emoji variants are only included when enabled. */
export function getPools(language: Language, emojis: boolean, mode: Mode): LinePools {
  const source = SOURCE[language];

  const identity =
    mode === 'personal'
      ? merge(source.identityPersonal, source.identityPersonalEmoji, emojis)
      : merge(source.identityCategory, source.identityCategoryEmoji, emojis);

  return {
    identity,
    detail: merge(source.detail, source.detailEmoji, emojis),
    detailGeneric: source.detailGeneric,
    location: merge(source.location, source.locationEmoji, emojis),
    cta: merge(source.cta, source.ctaEmoji, emojis),
  };
}

/** Emoji used to fill the {e} placeholder for personal bios. */
export const PERSONAL_EMOJIS = ['✨', '👋', '💫', '🌟'];
export const PERSONAL_EMOJIS_HI = ['✨', '👋', '💫', '🙏'];
export const FALLBACK_EMOJIS = ['✨', '👋'];
