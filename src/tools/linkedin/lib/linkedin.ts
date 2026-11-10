/**
 * Rule-based LinkedIn generators — headline (≤220) and About/summary (≤2600).
 * Deterministic template + pool enumeration with random sampling; no network,
 * no invented employers, no fake metrics. Both guarantee five unique outputs.
 */
import {
  CTA_LINES,
  HEADLINE_AUDIENCES,
  HEADLINE_CRAFTS,
  HEADLINE_VALUES,
  OUTCOME_PHRASES,
  SUMMARY_INTERESTS,
  SUMMARY_OPEN_TO,
  SUMMARY_STRENGTHS,
} from '../data/pools';
import { bioLength, tidy } from '../../../lib/text';

export const HEADLINE_LIMIT = 220;
export const SUMMARY_LIMIT = 2600;

const pick = <T,>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];
const sampleN = <T,>(items: readonly T[], n: number): T[] => {
  const copy = [...items];
  const out: T[] = [];
  while (copy.length && out.length < n) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
};

/** English letters, numbers and common punctuation only — LinkedIn-safe. */
const SAFE_INPUT = /^[\p{L}\p{N}\p{M} .,'&()/+|-]*$/u;
export const isSafeLinkedinInput = (value: string): boolean => SAFE_INPUT.test(value);

export interface HeadlineInput {
  role: string;
  focus: string;
  years: string;
}

export interface SummaryInput {
  role: string;
  focus: string;
}

const cap = (value: string) => value.replace(/\s+/g, ' ').trim();

/** ------------------------- Headlines ------------------------- */

const headlinePatterns = (role: string, focus: string, years: string): string[] => {
  const crafts = HEADLINE_CRAFTS.map((craftSet: readonly string[]) => craftSet.join(' · '));
  const trimmedYears = years && /^\d{1,2}$/.test(years.trim()) ? `${years.trim()}+ yrs` : null;
  const withFocus = focus.length > 0;
  const patterns: string[] = [
    `${role} · ${pick(HEADLINE_VALUES)}`,
    withFocus ? `${role} · ${focus}` : `${role} · Crafting ${focus || 'good work'}`,
    withFocus ? `${role} in ${focus} · ${pick(HEADLINE_VALUES)}` : `${role} · ${pick(HEADLINE_VALUES)}`,
    `${role} | ${pick(crafts)}`,
    `${role} — ${pick(HEADLINE_VALUES)}`,
    `${pick(OUTCOME_PHRASES)} | ${role}`,
    `${role} | Helping ${pick(HEADLINE_AUDIENCES)}`,
    withFocus
      ? `${role} building ${focus} · ${pick(HEADLINE_VALUES)}`
      : `${role} · ${pick(HEADLINE_VALUES)}`,
  ];
  if (trimmedYears) {
    patterns.push(`${role} (${trimmedYears}) · ${pick(HEADLINE_VALUES)}`);
    patterns.push(withFocus ? `${role} (${trimmedYears}) · ${focus}` : `${role} (${trimmedYears})`);
  }
  return patterns;
};

export function generateHeadlines(raw: HeadlineInput): string[] {
  const role = cap(tidy(raw.role));
  const focus = cap(tidy(raw.focus));
  const years = raw.years.trim();
  if (!role) return [];

  const seen = new Set<string>();
  const results: string[] = [];
  let attempts = 0;

  while (results.length < 5 && attempts < 400) {
    attempts += 1;
    for (const candidate of headlinePatterns(role, focus, years)) {
      const line = candidate.replace(/\s+/g, ' ').trim();
      if (seen.has(line) || bioLength(line) > HEADLINE_LIMIT) continue;
      seen.add(line);
      results.push(line);
      if (results.length >= 5) break;
    }
  }

  // Deterministic enumeration guarantees five unique drafts.
  const fallbackValues = HEADLINE_VALUES.flatMap((value) => [
    `${role} · ${value}`,
    `${role} — ${value}`,
    `${role} | ${value}`,
  ]);
  for (const candidate of fallbackValues) {
    if (results.length >= 5) break;
    const line = candidate.replace(/\s+/g, ' ').trim();
    if (seen.has(line) || bioLength(line) > HEADLINE_LIMIT) continue;
    seen.add(line);
    results.push(line);
  }
  return results.slice(0, 5);
}

/** ------------------------- About / summary ------------------------- */

const summaryPatterns = (role: string, focus: string): string[] => {
  const f = focus || 'the work I do';
  const triple = () => sampleN(SUMMARY_STRENGTHS, 3);
  const i = () => pick(SUMMARY_INTERESTS);
  const o = () => pick(SUMMARY_OPEN_TO);
  const c = () => pick(CTA_LINES);

  return [
    `I'm a ${role} focused on ${f}. I care about ${triple().join(', ')}. ${o()}. ${c()}`,
    `Over the years I've learned that ${f} rewards patience and clear thinking. As a ${role}, I bring ${triple().slice(0, 2).join(' and ')} and a bias for shipping honest work. ${o()}.`,
    `${role} working in ${f}. What clients and colleagues get from me: ${triple().join(', ')} — and plain words instead of jargon.\n\n${o()}. ${c()}`,
    `What I'm about\n\nRole: ${role}\nFocus: ${f}\nWhat I care about: ${i()}\n\nI work with a bias for ${sampleN(SUMMARY_STRENGTHS, 2).join(' and ')}. ${c()}`,
    `A ${role} drawn to ${i()}. My approach: understand the problem properly, say what I think plainly, and finish what I start. Currently: ${f}.\n\n${o()}. ${c()}`,
    `I'm a ${role}. My working theory: ${f} gets better when the thinking is clear and the communication is plain. Strengths: ${triple().join(', ')}. ${o()}.`,
  ];
};

export function generateSummaries(raw: SummaryInput): string[] {
  const role = cap(tidy(raw.role));
  const focus = cap(tidy(raw.focus));
  if (!role) return [];

  const seen = new Set<string>();
  const results: string[] = [];
  let attempts = 0;

  while (results.length < 5 && attempts < 80) {
    attempts += 1;
    for (const candidate of summaryPatterns(role, focus)) {
      const line = candidate.trim();
      if (seen.has(line) || bioLength(line) > SUMMARY_LIMIT) continue;
      seen.add(line);
      results.push(line);
      if (results.length >= 5) break;
    }
  }

  const fallbacks = [
    `I'm a ${role} focused on ${focus || 'meaningful work'}. ${CTA_LINES[0]}`,
    `${role} · ${focus || 'Doing clear work with good people'}. ${CTA_LINES[1]}`,
    `A ${role} drawn to ${SUMMARY_INTERESTS[0]}. ${CTA_LINES[2]}`,
    `I'm a ${role}. I care about ${SUMMARY_STRENGTHS[0]} and ${SUMMARY_STRENGTHS[1]}. ${CTA_LINES[3]}`,
    `${role}. ${focus ? `Working in ${focus}. ` : ''}${CTA_LINES[0]}`,
  ];
  for (const candidate of fallbacks) {
    if (results.length >= 5) break;
    if (seen.has(candidate) || bioLength(candidate) > SUMMARY_LIMIT) continue;
    seen.add(candidate);
    results.push(candidate);
  }
  return results.slice(0, 5);
}
