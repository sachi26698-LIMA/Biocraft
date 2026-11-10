/**
 * LinkedIn professional bio pools (English). Professional tone, zero invented
 * facts — placeholders cover role/niche/city only. Used by the LinkedIn
 * workspace's "Professional Bio" tool. Emoji are supported but professional
 * defaults are off.
 */
import type { LinePools } from './pools';

const EN: LinePools = {
  identity: [
    '{role} focused on {niche}',
    '{role} · {niche}',
    'I help teams with {niche}',
    '{role} | {niche}',
    'Building in {niche} as a {role}',
    '{role} — {niche}',
    'Specialist in {niche}',
    '{role} with a focus on {niche}',
    'Passionate about {niche} | {role}',
    '{role} · {niche} professional',
  ],
  detail: [
    'Documenting what I learn as I build',
    'Bias for clarity and follow-through',
    'Turning strategy into shipped work',
    'Structured thinker, calm hands',
    'Evidence over opinion, always',
    'Writing, systems and good questions',
    'Closing the gap between plan and delivery',
  ],
  detailGeneric: [
    'Documenting what I learn as I build',
    'Bias for clarity and follow-through',
    'Turning strategy into shipped work',
    'Structured thinker, calm hands',
    'Evidence over opinion, always',
    'Writing, systems and good questions',
    'Closing the gap between plan and delivery',
    'Cross-functional by default',
  ],
  location: ['Based in {city}', '{city}-based', 'Working from {city}'],
  cta: [
    'Open to conversations about the work',
    'Always happy to compare notes',
    'Open to the right problems',
    'Reach out — I read everything',
    'Building in public, one lesson at a time',
  ],
};

const EN_EMOJI: LinePools = {
  identity: EN.identity.map((line) => `${line} {e}`),
  detail: EN.detail.map((line) => `${line} {e}`),
  detailGeneric: EN.detailGeneric.map((line) => `${line} {e}`),
  location: EN.location,
  cta: EN.cta.map((line) => `${line} {e}`),
};

export const LINKEDIN_EMOJIS = ['🤝', '📈', '🧠', '🔧'];

export const getLinkedInPools = (emojis: boolean): LinePools =>
  emojis
    ? {
        identity: [...EN.identity, ...EN_EMOJI.identity],
        detail: [...EN.detail, ...EN_EMOJI.detail],
        detailGeneric: [...EN.detailGeneric, ...EN_EMOJI.detailGeneric],
        location: EN.location,
        cta: [...EN.cta, ...EN_EMOJI.cta],
      }
    : EN;
