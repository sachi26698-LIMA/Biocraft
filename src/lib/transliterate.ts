/**
 * Rule-based, approximate Devanagari → Latin transliteration.
 *
 * Used so Hindi input in the Username tool degrades gracefully into
 * Instagram-usable Latin handles instead of disappearing. This is NOT a
 * linguistic engine — conjunct clusters, word-final schwa deletion and
 * nukta loanphone consonants are handled; otherwise output follows short
 * romanisation. Deterministic. All Devanagari code points are BMP, but the
 * walker is code-point safe regardless.
 */

const VIRAMA = 0x094d; // ्
const ANUSVARA = 0x0902; // ं
const CHANDRABINDU = 0x0901; // ँ
const VISARGA = 0x0903; // ः
const NUKTA = 0x093c; // ़

const NUKTATED: Readonly<Record<number, string>> = {
  0x0915: 'q', // क़
  0x0916: 'kh', // ख़
  0x0917: 'g', // ग़
  0x091c: 'z', // ज़
  0x0921: 'r', // ड़
  0x0922: 'rh', // ढ़
  0x092b: 'f', // फ़
};

const CONSONANTS: Readonly<Record<number, string>> = {
  0x0915: 'k', 0x0916: 'kh', 0x0917: 'g', 0x0918: 'gh', 0x0919: 'n',
  0x091a: 'ch', 0x091b: 'chh', 0x091c: 'j', 0x091d: 'jh', 0x091e: 'n',
  0x091f: 't', 0x0920: 'th', 0x0921: 'd', 0x0922: 'dh', 0x0923: 'n',
  0x0924: 't', 0x0925: 'th', 0x0926: 'd', 0x0927: 'dh', 0x0928: 'n',
  0x092a: 'p', 0x092b: 'ph', 0x092c: 'b', 0x092d: 'bh', 0x092e: 'm',
  0x092f: 'y', 0x0930: 'r', 0x0932: 'l', 0x0933: 'l',
  0x0935: 'v', 0x0936: 'sh', 0x0937: 'sh', 0x0938: 's', 0x0939: 'h',
};

const INDEPENDENT_VOWELS: Readonly<Record<number, string>> = {
  0x0905: 'a', 0x0906: 'aa', 0x0907: 'i', 0x0908: 'ee',
  0x0909: 'u', 0x090a: 'oo', 0x090b: 'ri', 0x0960: 'ri',
  0x090f: 'e', 0x0910: 'ai', 0x0913: 'o', 0x0914: 'au',
  0x0950: 'om',
};

const MATRAS: Readonly<Record<number, string>> = {
  0x093e: 'a', // long aa, shortened to keep handles compact
  0x093f: 'i', 0x0940: 'ee', 0x0941: 'u', 0x0942: 'oo',
  0x0943: 'ri', 0x0947: 'e', 0x0948: 'ai', 0x094b: 'o', 0x094c: 'au',
};

const isDevanagari = (cp: number): boolean => cp >= 0x0900 && cp <= 0x097f;
const isConsonant = (cp: number): boolean => cp in CONSONANTS;
const isMatra = (cp: number): boolean => cp in MATRAS;

const DEVANAGARI_RE = /[ऀ-ॿ]/;

/** True when the text contains Devanagari. */
export function hasDevanagari(text: string): boolean {
  return DEVANAGARI_RE.test(text);
}

/**
 * Transliterate a mixed-script string. Non-Devanagari characters pass
 * through unchanged; Devanagari is romanised. A word-final inherent
 * vowel is dropped (रोहित → rohit). Output is lowercased.
 */
export function transliterate(text: string): string {
  const chars = Array.from(text.normalize('NFC'));
  const cpAt = (i: number): number =>
    i < chars.length ? (chars[i].codePointAt(0) as number) : -1;

  let out = '';
  let i = 0;

  /** Reads one consonant token, honoring a following nukta. */
  const readConsonant = (): string => {
    const base = cpAt(i);
    let roman = CONSONANTS[base];
    i += 1;
    if (cpAt(i) === NUKTA && base in NUKTATED) {
      roman = NUKTATED[base];
      i += 1;
    }
    return roman;
  };

  while (i < chars.length) {
    const cp = cpAt(i);

    if (!isDevanagari(cp)) {
      out += chars[i];
      i += 1;
      continue;
    }

    if (isConsonant(cp)) {
      // Conjunct cluster: consonant (virama consonant)*
      let cluster = '';
      for (;;) {
        cluster += readConsonant();
        if (cpAt(i) === VIRAMA) {
          const next = cpAt(i + 1);
          if (isConsonant(next) || next in NUKTATED) {
            i += 1; // consume virama, continue cluster
            continue;
          }
          i += 1; // trailing virama — consume and stop
        }
        break;
      }

      const matra = isMatra(cpAt(i)) ? MATRAS[cpAt(i)] : undefined;
      if (matra !== undefined) {
        out += cluster + matra;
        i += 1;
        continue;
      }
      // Word-final schwa deletion: drop the inherent vowel at a word boundary.
      const next = cpAt(i);
      const boundary = next === -1 || !/[\p{L}\p{N}\p{M}]/u.test(chars[i]);
      out += boundary ? cluster : `${cluster}a`;
      continue;
    }

    if (cp in INDEPENDENT_VOWELS) {
      out += INDEPENDENT_VOWELS[cp];
      i += 1;
      if (cpAt(i) === ANUSVARA || cpAt(i) === CHANDRABINDU) {
        out += 'n';
        i += 1;
      }
      continue;
    }

    if (cp === ANUSVARA || cp === CHANDRABINDU) {
      out += 'n';
      i += 1;
      continue;
    }

    if (cp === VISARGA) {
      out += 'h';
      i += 1;
      continue;
    }

    if (isMatra(cp)) {
      // Orphaned matra (input mixed mid-word) — emit its sound anyway.
      out += MATRAS[cp];
      i += 1;
      continue;
    }

    if (cp === 0x093c) {
      i += 1; // stray nukta — skip
      continue;
    }

    // Unknown Devanagari mark/sign — skip rather than emit garbage.
    i += 1;
  }

  return out.toLowerCase();
}
