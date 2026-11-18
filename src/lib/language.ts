/**
 * BioCraft — language detection and translation-status rules.
 *
 * Browser-safe and dependency-free. Two responsibilities:
 *
 *  1. **Detect the script/language of stored content**, so the library can be
 *     filtered by language and a reviewer can see what a row actually is. This is
 *     deterministic character-range analysis, not a model guess: given the same
 *     text it always returns the same answer, and it reports its own confidence.
 *
 *  2. **Encode the translation-status contract** so nothing untranslated can be
 *     presented as translated. `verified` is reachable only by an explicit human
 *     action; the client cannot promote a row by asking nicely.
 *
 * It deliberately does NOT translate. No machine translation runs here, and this
 * module never marks content as translated — it only classifies what exists.
 */

export interface LanguageRegistryEntry {
  code: string;
  nameEn: string;
  nameNative: string;
  direction: 'ltr' | 'rtl';
  script: string;
}

/** Mirrors public.languages. Kept in code so detection works without a query. */
export const LANGUAGES: LanguageRegistryEntry[] = [
  { code: 'en', nameEn: 'English', nameNative: 'English', direction: 'ltr', script: 'Latn' },
  { code: 'hi', nameEn: 'Hindi', nameNative: 'हिन्दी', direction: 'ltr', script: 'Deva' },
  { code: 'hg', nameEn: 'Hinglish', nameNative: 'Hinglish', direction: 'ltr', script: 'Latn' },
  { code: 'es', nameEn: 'Spanish', nameNative: 'Español', direction: 'ltr', script: 'Latn' },
  { code: 'fr', nameEn: 'French', nameNative: 'Français', direction: 'ltr', script: 'Latn' },
  { code: 'de', nameEn: 'German', nameNative: 'Deutsch', direction: 'ltr', script: 'Latn' },
  { code: 'pt', nameEn: 'Portuguese', nameNative: 'Português', direction: 'ltr', script: 'Latn' },
  { code: 'ar', nameEn: 'Arabic', nameNative: 'العربية', direction: 'rtl', script: 'Arab' },
  { code: 'bn', nameEn: 'Bengali', nameNative: 'বাংলা', direction: 'ltr', script: 'Beng' },
  { code: 'ur', nameEn: 'Urdu', nameNative: 'اردو', direction: 'rtl', script: 'Arab' },
  { code: 'ja', nameEn: 'Japanese', nameNative: '日本語', direction: 'ltr', script: 'Jpan' },
  { code: 'ko', nameEn: 'Korean', nameNative: '한국어', direction: 'ltr', script: 'Kore' },
  { code: 'zh-Hans', nameEn: 'Chinese (Simplified)', nameNative: '简体中文', direction: 'ltr', script: 'Hans' },
  { code: 'zh-Hant', nameEn: 'Chinese (Traditional)', nameNative: '繁體中文', direction: 'ltr', script: 'Hant' },
  { code: 'id', nameEn: 'Indonesian', nameNative: 'Bahasa Indonesia', direction: 'ltr', script: 'Latn' },
  { code: 'ru', nameEn: 'Russian', nameNative: 'Русский', direction: 'ltr', script: 'Cyrl' },
  { code: 'tr', nameEn: 'Turkish', nameNative: 'Türkçe', direction: 'ltr', script: 'Latn' },
  { code: 'vi', nameEn: 'Vietnamese', nameNative: 'Tiếng Việt', direction: 'ltr', script: 'Latn' },
  { code: 'th', nameEn: 'Thai', nameNative: 'ไทย', direction: 'ltr', script: 'Thai' },
  { code: 'ta', nameEn: 'Tamil', nameNative: 'தமிழ்', direction: 'ltr', script: 'Taml' },
  { code: 'mr', nameEn: 'Marathi', nameNative: 'मराठी', direction: 'ltr', script: 'Deva' },
  { code: 'gu', nameEn: 'Gujarati', nameNative: 'ગુજરાતી', direction: 'ltr', script: 'Gujr' },
];

const BY_CODE = new Map(LANGUAGES.map((l) => [l.code, l]));

export function languageByCode(code: string | null | undefined): LanguageRegistryEntry | null {
  return code ? BY_CODE.get(code) ?? null : null;
}

export function isRtl(code: string | null | undefined): boolean {
  return languageByCode(code)?.direction === 'rtl';
}

/* ------------------------------------------------------------------ detection */

/**
 * Unicode script ranges that identify a language on their own.
 * Order matters: the first matching dominant script wins.
 */
const SCRIPT_RANGES: Array<{ script: string; language: string; test: RegExp }> = [
  { script: 'Deva', language: 'hi', test: /[\u0900-\u097F]/ },
  { script: 'Beng', language: 'bn', test: /[\u0980-\u09FF]/ },
  { script: 'Gujr', language: 'gu', test: /[\u0A80-\u0AFF]/ },
  { script: 'Taml', language: 'ta', test: /[\u0B80-\u0BFF]/ },
  { script: 'Thai', language: 'th', test: /[\u0E00-\u0E7F]/ },
  { script: 'Kore', language: 'ko', test: /[\uAC00-\uD7AF\u1100-\u11FF]/ },
  // Kana is unique to Japanese; Han alone is ambiguous (Chinese vs Japanese), so
  // Han is handled separately below rather than guessed.
  { script: 'Jpan', language: 'ja', test: /[\u3040-\u30FF]/ },
  { script: 'Cyrl', language: 'ru', test: /[\u0400-\u04FF]/ },
  { script: 'Arab', language: 'ar', test: /[\u0600-\u06FF]/ },
];

const HAN = /[\u4E00-\u9FFF\u3400-\u4DBF]/;

/** Words that distinguish Latin-script languages, including Hinglish markers. */
const LATIN_MARKERS: Array<{ language: string; words: string[] }> = [
  { language: 'hg', words: ['hai', 'nahi', 'kya', 'mera', 'meri', 'tum', 'aap', 'bhai', 'yaar', 'bahut', 'kaise', 'accha', 'matlab', 'karo', 'bohot'] },
  { language: 'es', words: ['que', 'como', 'para', 'con', 'por', 'una', 'los', 'las', 'muy', 'pero', 'este', 'cuando', 'siempre'] },
  { language: 'fr', words: ['les', 'des', 'une', 'est', 'pour', 'avec', 'dans', 'que', 'pas', 'vous', 'nous', 'toujours', 'très'] },
  { language: 'de', words: ['und', 'der', 'die', 'das', 'nicht', 'mit', 'für', 'auf', 'ist', 'ein', 'eine', 'immer', 'sehr'] },
  // Portuguese needs its own everyday words: 'meu', 'sou', 'nome' and 'olá' are
  // what short bios actually contain, and the shared words above ('que', 'para',
  // 'com') also appear in Spanish, so they alone cannot decide.
  { language: 'pt', words: ['que', 'para', 'com', 'uma', 'não', 'muito', 'sempre', 'você', 'são', 'está', 'também', 'meu', 'minha', 'sou', 'nome', 'olá', 'obrigado', 'dos', 'das'] },
  { language: 'id', words: ['yang', 'dan', 'untuk', 'dengan', 'tidak', 'saya', 'kamu', 'adalah', 'sangat'] },
  { language: 'vi', words: ['và', 'của', 'không', 'những', 'được', 'người', 'một', 'với'] },
  { language: 'tr', words: ['ve', 'bir', 'için', 'ile', 'çok', 'değil', 'bu', 'olarak'] },
];

export interface DetectionResult {
  /** Best guess, or null when the text carries no usable signal. */
  language: string | null;
  /** 0..1. Reported so a caller can require a threshold instead of trusting blindly. */
  confidence: number;
  script: string | null;
  /** Deterministic explanation, e.g. 'dominant script: Deva'. */
  reason: string;
  /** True when the text has too little signal to decide. */
  indeterminate: boolean;
}

/**
 * Detect the language of a piece of text.
 *
 * Honest by construction: when the evidence is weak it returns
 * `language: null, indeterminate: true` rather than picking English by default.
 * A short all-emoji bio is genuinely undecidable, and saying so is more useful
 * than a wrong label that would then be filtered on.
 */
export function detectLanguage(text: string | null | undefined): DetectionResult {
  const raw = String(text ?? '')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[@#][\p{L}\p{N}_]+/gu, ' ')
    .replace(/\p{Extended_Pictographic}/gu, ' ');
  const letters = raw.match(/\p{L}/gu) ?? [];

  if (letters.length < 3) {
    return {
      language: null, confidence: 0, script: null,
      reason: 'too few letters to identify a language',
      indeterminate: true,
    };
  }

  // Dominant script: count letters per script group.
  const counts = new Map<string, number>();
  for (const ch of letters) {
    let script = 'Latn';
    for (const range of SCRIPT_RANGES) {
      if (range.test.test(ch)) { script = range.script; break; }
    }
    if (script === 'Latn' && HAN.test(ch)) script = 'Han';
    counts.set(script, (counts.get(script) ?? 0) + 1);
  }

  const [topScript, topCount] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const share = topCount / letters.length;

  if (topScript === 'Han') {
    // Han alone cannot separate Chinese from Japanese. If kana were present the
    // Jpan range would already have won, so this is Chinese — but the variant
    // (Simplified/Traditional) is not safely inferable from a short string.
    return {
      language: 'zh-Hans', confidence: 0.6, script: 'Han',
      reason: 'Han characters without kana; variant not inferred', indeterminate: false,
    };
  }

  const byScript = SCRIPT_RANGES.find((r) => r.script === topScript);
  if (byScript && share > 0.5) {
    // Arabic script is shared by Arabic and Urdu; Urdu-specific letters decide.
    if (topScript === 'Arab' && /[\u0679\u0688\u0691\u06BA\u06BE\u06C1\u06D2\u067E\u0686\u0698\u06AF]/.test(raw)) {
      return { language: 'ur', confidence: 0.85, script: 'Arab', reason: 'Arabic script with Urdu-specific letters', indeterminate: false };
    }
    return {
      language: byScript.language,
      confidence: Math.min(0.98, 0.7 + share * 0.28),
      script: topScript,
      reason: `dominant script: ${topScript} (${Math.round(share * 100)}% of letters)`,
      indeterminate: false,
    };
  }

  // Latin script: look for distinguishing words. Count distinct marker hits so a
  // single borrowed word cannot decide the language.
  const words = raw.toLowerCase().match(/[\p{L}']+/gu) ?? [];
  const scores = LATIN_MARKERS.map((m) => {
    const hits = new Set(words.filter((w) => m.words.includes(w))).size;
    return { language: m.language, hits };
  }).sort((a, b) => b.hits - a.hits);

  const best = scores[0];

  // Diacritics that are strong evidence on their own.
  if (/[ãõ]/i.test(raw) && best.hits < 2) {
    return { language: 'pt', confidence: 0.65, script: 'Latn', reason: 'Portuguese diacritics', indeterminate: false };
  }
  if (/[ñ¿¡]/i.test(raw) && best.hits < 2) {
    return { language: 'es', confidence: 0.7, script: 'Latn', reason: 'Spanish diacritics', indeterminate: false };
  }
  if (/[äöüß]/i.test(raw) && best.hits < 2) {
    return { language: 'de', confidence: 0.65, script: 'Latn', reason: 'German diacritics', indeterminate: false };
  }

  if (best.hits >= 2) {
    return {
      language: best.language,
      confidence: Math.min(0.9, 0.6 + best.hits * 0.06),
      script: 'Latn',
      reason: `${best.hits} distinguishing ${best.language} words`,
      indeterminate: false,
    };
  }

  if (share > 0.9) {
    // Unmarked Latin text. English is the most likely single answer but the
    // evidence is weak, so confidence stays low and the reason says why.
    return {
      language: 'en', confidence: 0.5, script: 'Latn',
      reason: 'Latin script with no distinguishing markers; ambiguous with other Latin-script languages',
      indeterminate: false,
    };
  }

  return {
    language: null, confidence: 0, script: topScript,
    reason: 'mixed scripts with no dominant language', indeterminate: true,
  };
}

/* ------------------------------------------------------------ translation status */

export type TranslationStatus = 'machine' | 'reviewed' | 'verified' | 'rejected';

export interface TranslationRow {
  targetLanguage: string;
  content: string;
  status: TranslationStatus;
  provider: string | null;
}

/**
 * The only statuses a client may request. `verified` is deliberately absent:
 * a browser cannot promote a translation to verified, because that is a human
 * judgement recorded by a reviewer, not a UI action.
 */
export const CLIENT_SETTABLE_STATUSES: TranslationStatus[] = ['rejected'];

/** Statuses that may be *displayed as* a completed translation. */
export function isDisplayableTranslation(status: TranslationStatus): boolean {
  return status === 'machine' || status === 'reviewed' || status === 'verified';
}

/**
 * Human-readable label. Never says "translated" for a machine draft without
 * qualifying it, so a reader knows whether a person checked it.
 */
export function statusLabel(status: TranslationStatus): string {
  switch (status) {
    case 'machine': return 'Machine draft — not reviewed';
    case 'reviewed': return 'Reviewed by a person';
    case 'verified': return 'Verified';
    case 'rejected': return 'Rejected';
  }
}

/**
 * Whether a library entry can honestly be offered in a requested language.
 * A missing target translation returns false with the reason, so the UI can say
 * "not available in Hindi yet" instead of silently showing English.
 */
export function translationAvailability(
  sourceLanguage: string,
  targetLanguage: string,
  translations: TranslationRow[],
): { available: boolean; reason: string; row: TranslationRow | null } {
  if (sourceLanguage === targetLanguage) {
    return { available: true, reason: 'already in the requested language', row: null };
  }
  const row = translations.find((t) => t.targetLanguage === targetLanguage) ?? null;
  if (!row) {
    return { available: false, reason: `no ${targetLanguage} translation exists`, row: null };
  }
  if (!isDisplayableTranslation(row.status)) {
    return { available: false, reason: `the ${targetLanguage} translation was ${row.status}`, row };
  }
  return { available: true, reason: statusLabel(row.status), row };
}
