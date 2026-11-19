/**
 * BioCraft — bio library schema and deduplication engine.
 *
 * This module is the gate every record must pass before it is counted. It is
 * shared by the build script that assembles `src/data/bios/*` and by the tests,
 * so the number the UI reports and the number the tests verify come from the
 * same code path.
 *
 * Design rules that matter:
 *
 *  - A record is only "verified" if it came from a source we can name, with a
 *    licence we can state. Nothing is marked verified by default.
 *  - Deduplication runs in layers from cheap to expensive (exact → normalized →
 *    punctuation-insensitive → token-set → near-duplicate). A record must pass
 *    ALL of them, and the layer that rejected it is recorded, so the rejection
 *    report is auditable rather than a single opaque "duplicates removed" number.
 *  - Language is validated by script, not by declaration. A record claiming
 *    Hindi but written in Latin script is rejected, and vice versa.
 *
 * Nothing here generates content. It only accepts or rejects it.
 */
import { createHash } from 'node:crypto';





/* ------------------------------------------------------------- normalising */

/**
 * Unicode-normalise and case-fold. NFKC folds compatibility forms (so fullwidth
 * and styled Latin collapse onto plain Latin), which is exactly what we want
 * for detecting "𝐁𝐨𝐥𝐝" as a duplicate of "Bold".
 */
export function normalizeUnicode(input) {
  return input.normalize('NFKC').toLowerCase();
}

/** Strip everything that carries no meaning for duplicate detection. */
export function normalizePunctuation(input) {
  return normalizeUnicode(input)
    // NFKC above already folds styled Latin, but fullwidth punctuation and the
    // many dash/quote variants still need collapsing.
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/[\u2010-\u2015\u2212]/g, '-')
    .replace(/[\u2018\u2019\u201b]/g, "'")
    .replace(/[\u201c\u201d\u201f]/g, '"')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Aggregate emoji + whitespace away so "🔥🔥" cannot make a bio "unique". */
export function stripDecorative(input) {
  return normalizePunctuation(input)
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Sorted unique word set — order-insensitive comparison key. */
export function tokenKey(input) {
  const tokens = stripDecorative(input).split(' ').filter(Boolean);
  return [...new Set(tokens)].sort().join(' ');
}

/** sha256 of the strongest normal form. */
export function fingerprint(text) {
  return createHash('sha256').update(stripDecorative(text), 'utf8').digest('hex');
}

/* ---------------------------------------------------------- language gate */

const DEVANAGARI = /[\u0900-\u097F]/;
const LATIN = /[A-Za-z]/;

/**
 * Validate that the text is actually in the language it claims.
 *
 * Hindi must be overwhelmingly Devanagari. Hinglish must be Latin-script with
 * genuine Roman-Hindi vocabulary — not merely English. We check for the
 * presence of common Roman-Hindi function words, which is what distinguishes
 * "Apni kahani khud likhte hain" from an English sentence.
 */
const HINGLISH_MARKERS = [
  // function words / particles
  'hai', 'hain', 'hoon', 'hu', 'hun', 'nahi', 'nahin', 'na', 'ka', 'ki', 'ke',
  'ko', 'se', 'mein', 'mai', 'aur', 'par', 'tha', 'thi', 'the', 'kar', 'karo',
  'karta', 'karti', 'raha', 'rahi', 'rahe', 'apni', 'apna', 'apne', 'mera',
  'meri', 'mere', 'tera', 'teri', 'tere', 'hum', 'tum', 'aap', 'yeh', 'ye',
  'woh', 'wo', 'kya', 'kyun', 'kyu', 'kaise', 'kaisa', 'bahut', 'bohot',
  'sab', 'kuch', 'kuchh', 'abhi', 'phir', 'fir', 'bhi', 'toh', 'to', 'jo',
  'jab', 'tab', 'kabhi', 'hamesha', 'bas', 'itna', 'itni', 'zyada', 'kam',
  'bada', 'badi', 'chhota', 'naya', 'nayi', 'wala', 'wali', 'wale', 'liye',
  'sath', 'saath', 'baat', 'baatein', 'log', 'logo',
  // everyday nouns that are Hindi even when transliterated
  'zindagi', 'zindgi', 'dil', 'duniya', 'sapne', 'sapna', 'khud', 'khushi',
  'pyaar', 'pyar', 'yaar', 'yaaron', 'yaadein', 'yaad', 'subah', 'shaam',
  'raat', 'din', 'ghar', 'chai', 'kavita', 'kavitaen', 'sukoon', 'shabd',
  'dheemi', 'dheema', 'thandi', 'thanda', 'adhuri', 'adhura', 'mehnat',
  'izzat', 'tameez', 'safaai', 'galti', 'seekh', 'sabak', 'dost', 'dosti',
  'maa', 'papa', 'bhai', 'behen', 'khana', 'paisa', 'kaam', 'sar', 'aankh',
  'aankhon', 'hans', 'hansi', 'rona', 'rota', 'muskurana', 'jeena', 'marna',
  // everyday slang that is unambiguously Roman Hindi
  'bakwaas', 'bakwas', 'faltu', 'bekaar', 'mast', 'mazaa', 'maja', 'yaar',
  'bhai', 'bindaas', 'jhakaas', 'zabardast', 'shandar', 'badhiya', 'achha',
  'acha', 'theek', 'thik', 'matlab', 'zaroori', 'zarurat', 'zaroorat', 'himmat',
  'kirdaar', 'rivaz', 'riwaz', 'hisaab', 'sach', 'jhooth', 'jhoot',
  // everyday words that recur in this library's editorial voice
  'aadatein', 'aadat', 'mahine', 'mahina', 'pehle', 'pehla', 'bewakoofi',
  'bewakoof', 'lagti', 'lagta', 'lagte', 'raha', 'rahi', 'gayi', 'gaya',
  'gaye', 'nikla', 'nikli', 'sasti', 'sasta', 'wapas', 'wahi', 'wajah',
  // second vocabulary sweep (batch 007): everyday student / family Hindi
  'padhai', 'padhta', 'padhti', 'neend', 'poori', 'pura', 'adhoori', 'adhoora',
  'samjhaya', 'samajh', 'chauthi', 'doosri', 'pehli', 'mat', 'chhodo', 'chhoda',
  'shukraguzaar', 'shukriya', 'maangna', 'maanga', 'dena', 'diya', 'liya',
  'hoga', 'hogi', 'hota', 'hoti', 'hote', 'rahega', 'rahegi', 'chalega',
];

export function detectScript(text) {
  const devanagari = (text.match(/[\u0900-\u097F]/g) ?? []).length;
  const latin = (text.match(/[A-Za-z]/g) ?? []).length;
  return devanagari > latin ? 'Devanagari' : 'Latin';
}


export function validateLanguage(text, lang) {
  const devanagari = (text.match(/[\u0900-\u097F]/g) ?? []).length;
  const letters = (text.match(/[\p{L}]/gu) ?? []).length;
  if (letters < 3) return { ok: false, reason: 'too few letters' };

  if (lang === 'hi') {
    if (!DEVANAGARI.test(text)) return { ok: false, reason: 'declared Hindi but no Devanagari' };
    // Allow a short Latin brand/emoji tail, but the body must be Devanagari.
    if (devanagari / letters < 0.7) return { ok: false, reason: 'mostly Latin despite Hindi declaration' };
    return { ok: true };
  }

  if (devanagari / letters > 0.2) return { ok: false, reason: 'contains Devanagari but declared Latin script' };
  if (!LATIN.test(text)) return { ok: false, reason: 'no Latin letters' };

  if (lang === 'hg') {
    const tokens = stripDecorative(text).split(' ');
    const markers = tokens.filter((token) => HINGLISH_MARKERS.includes(token)).length;
    // A single marker is enough for a very short bio; longer text needs two,
    // otherwise an English sentence with the word "to" would pass as Hinglish.
    const needed = tokens.length <= 4 ? 1 : 2;
    if (markers < needed) return { ok: false, reason: 'no Roman-Hindi vocabulary; reads as English' };
    return { ok: true };
  }

  // English: must not be dominated by Roman-Hindi function words.
  const tokens = stripDecorative(text).split(' ');
  const markers = tokens.filter((token) => HINGLISH_MARKERS.includes(token)).length;
  if (tokens.length > 0 && markers / tokens.length > 0.45) {
    return { ok: false, reason: 'reads as Hinglish, not English' };
  }
  return { ok: true };
}

/* ------------------------------------------------------------- similarity */

/**
 * Jaccard similarity over token sets.
 *
 * Catches "word-swapped copies" and reordered phrasing that exact matching
 * misses. Threshold is deliberately conservative (0.8) so genuinely different
 * short bios are not collapsed: two 8-word bios sharing 6 words are similar but
 * can be legitimately distinct.
 */
export function tokenSetsSimilar(a, b) {
  const setA = new Set(stripDecorative(a).split(' ').filter(Boolean));
  const setB = new Set(stripDecorative(b).split(' ').filter(Boolean));
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const token of setA) if (setB.has(token)) intersection++;
  return intersection / (setA.size + setB.size - intersection);
}

/**
 * Character-trigram Jaccard — a cheap near-duplicate detector that is far more
 * sensitive than token overlap for short strings with shared stems.
 */
export function trigramSimilarity(a, b) {
  const grams = (text) => {
    const padded = ` ${stripDecorative(text)} `;
    const out = new Set();
    for (let i = 0; i < padded.length - 2; i++) out.add(padded.slice(i, i + 3));
    return out;
  };
  const setA = grams(a);
  const setB = grams(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const gram of setA) if (setB.has(gram)) intersection++;
  return intersection / (setA.size + setB.size - intersection);
}

/* ------------------------------------------------------------ the pipeline */


export const MIN_BIO_LENGTH = 12;
export const MAX_BIO_LENGTH = 160;

/**
 * The deduplicator. Feed it records; it returns the accepted ones and a full
 * rejection report. Layers run cheap-first, and each layer keeps its own index
 * so a record can be told exactly why it was refused.
 */
export class BioDeduplicator {
  byNormalized = new Map();   // normalised → accepted text
  byPunctuation = new Map();
  byTokenSet = new Map();
  byFingerprint = new Map();
  acceptedTexts = [];
  /** Buckets for the near-duplicate scan, keyed by first token. */
  byFirstToken = new Map();

  accepted = 0;
  rejections = [];

  reject(text, lang, category, layer, reason) {
    this.rejections.push({ text, lang, category, layer, reason });
    return false;
  }

  /**
   * @returns true when the record is accepted. Accepted text is retained for
   *          near-duplicate comparison, so call this in a stable order.
   */
  consider(text, lang, category) {
    const trimmed = text.trim();

    if (!trimmed) return this.reject(text, lang, category, 'empty', 'blank');
    if (trimmed.length < MIN_BIO_LENGTH) {
      return this.reject(text, lang, category, 'too-short', `${trimmed.length} chars < ${MIN_BIO_LENGTH}`);
    }
    if (trimmed.length > MAX_BIO_LENGTH) {
      return this.reject(text, lang, category, 'too-long', `${trimmed.length} chars > ${MAX_BIO_LENGTH}`);
    }

    const language = validateLanguage(trimmed, lang);
    if (!language.ok) return this.reject(text, lang, category, 'language', language.reason ?? 'invalid');

    const fp = fingerprint(trimmed);
    if (this.byFingerprint.has(fp)) {
      return this.reject(text, lang, category, 'exact', 'identical text');
    }

    const normalized = normalizeUnicode(trimmed).replace(/\s+/g, ' ').trim();
    if (this.byNormalized.has(normalized)) {
      return this.reject(text, lang, category, 'normalized', 'differs only in case or spacing');
    }

    const punctuation = normalizePunctuation(trimmed);
    if (this.byPunctuation.has(punctuation)) {
      return this.reject(text, lang, category, 'punctuation', 'differs only in punctuation or decoration');
    }

    const tokens = tokenKey(trimmed);
    if (this.byTokenSet.has(tokens)) {
      return this.reject(text, lang, category, 'token-set', 'same words in a different order');
    }

    // Near-duplicate scan against candidates sharing a first token.
    const firstToken = stripDecorative(trimmed).split(' ')[0] ?? '';
    const candidateIndexes = this.byFirstToken.get(firstToken) ?? [];
    for (const index of candidateIndexes) {
      const other = this.acceptedTexts[index];
      if (trigramSimilarity(trimmed, other) >= 0.78) {
        return this.reject(text, lang, category, 'near-duplicate', '≥78% character-trigram overlap');
      }
    }

    // Accept.
    const acceptedIndex = this.acceptedTexts.length;
    this.acceptedTexts.push(trimmed);
    this.byFingerprint.set(fp, trimmed);
    this.byNormalized.set(normalized, trimmed);
    this.byPunctuation.set(punctuation, trimmed);
    this.byTokenSet.set(tokens, trimmed);
    const bucket = this.byFirstToken.get(firstToken) ?? [];
    bucket.push(acceptedIndex);
    this.byFirstToken.set(firstToken, bucket);
    this.accepted++;
    return true;
  }

  summary() {
    const counts = {
      empty: 0, 'too-short': 0, 'too-long': 0, language: 0, category: 0,
      exact: 0, normalized: 0, punctuation: 0, 'token-set': 0, 'near-duplicate': 0,
    };
    for (const rejection of this.rejections) counts[rejection.layer]++;
    return counts;
  }
}

/* ------------------------------------------------------------ record build */

const PLATFORM_LIMITS = [
  ['Instagram', 150],
  ['Facebook', 101],
  ['Threads', 150],
  ['TikTok', 80],
  ['X', 160],
  ['LinkedIn', 220],
  ['WhatsApp', 139],
  ['Snapchat', 80],
];

export function platformsFor(length) {
  return PLATFORM_LIMITS.filter(([, limit]) => length <= limit).map(([name]) => name);
}

export function makeRecord(input, index, sources, created) {
  const text = input.text.trim();
  const source = sources.get(input.sourceId);
  if (!source) throw new Error(`unknown source: ${input.sourceId}`);
  return {
    ...input,
    text,
    id: `bio-${String(index + 1).padStart(5, '0')}`,
    script: detectScript(text),
    chars: text.length,
    length: text.length,
    platforms: platformsFor(text.length),
    created,
    // Verified only when the source is named and licensed. There is no other
    // path to true in this codebase.
    verified: Boolean(source.license && source.name),
    fingerprint: fingerprint(text),
  };
}
