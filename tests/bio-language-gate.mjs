/**
 * Language-gate regression test.
 *
 * Why this exists: the Hinglish marker list gets extended whenever a genuinely
 * Hinglish line is falsely rejected. Every extension is a small risk — add too
 * many common words and ordinary English starts passing as Hinglish, which
 * would inflate the HG count with sentences that are not Hinglish at all.
 *
 * So the marker list is pinned from both sides: real Hinglish must pass, and
 * plain English must still fail. Run this before any marker-list edit lands.
 */
import {
  validateLanguage, detectScript, BioDeduplicator, MAX_BIO_LENGTH, MIN_BIO_LENGTH,
} from '../scripts/bios/schema.mjs';
import { readFileSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

/* ---------------------------------------------------------------- */
section('1. plain English must never pass as Hinglish');
{
  const english = [
    'I build teams that do not need me in the room.',
    'Your opinion was not on the agenda, next item please.',
    'Kind by default and finished with all the nonsense.',
    'The friend who notices when you have gone very quiet.',
    'Confidence is nothing more than the receipt of practice.',
    'She sells outcomes and avoids building decks entirely.',
    'Small work done daily outruns every version of big talk.',
    'I am fine, I have simply stopped saying it hopefully.',
  ];
  for (const text of english) {
    const result = validateLanguage(text, 'hg');
    ok(`rejects as HG: "${text.slice(0, 42)}…"`, !result.ok);
  }
}

/* ---------------------------------------------------------------- */
section('2. genuine Hinglish must pass');
{
  const hinglish = [
    'Kaam chhota ho, par roz ho.',
    'Team aisi banao jo tumhare bina bhi chale.',
    'Padhai poori, neend adhoori.',
    'Shukraguzaar raho, par maangna mat chhodo.',
    'Achhi aadatein pehle mahine bewakoofi lagti hain.',
    'Pyaar woh nahi jo dikhe, pyaar woh jo nibhe.',
    'Bike puraani hai, raaste naye hain, aur koi jaldi nahi.',
  ];
  for (const text of hinglish) {
    const result = validateLanguage(text, 'hg');
    ok(`accepts as HG: "${text.slice(0, 42)}…"`, result.ok, result.reason);
  }
}

/* ---------------------------------------------------------------- */
section('3. Hindi requires Devanagari; Latin cannot masquerade');
{
  ok('rejects Latin text declared Hindi',
    !validateLanguage('This is plain English written in Latin letters.', 'hi').ok);
  ok('accepts real Devanagari Hindi',
    validateLanguage('मेहनत का फल मीठा होता है, बस वक़्त लगता है।', 'hi').ok);
  ok('rejects Devanagari text declared English',
    !validateLanguage('मेहनत का फल मीठा होता है।', 'en').ok);
  ok('rejects Devanagari text declared Hinglish',
    !validateLanguage('मेहनत का फल मीठा होता है।', 'hg').ok);
  // Batch 075 shipped a mixed line: 'aur woh mahina bhar chal सीं.' The old
  // threshold only rejected Devanagari above 20% of letters, so one stray word
  // in a Latin line passed. Any Devanagari at all is now wrong.
  ok('rejects one stray Devanagari word inside a Hinglish line',
    !validateLanguage('Aur woh mahina bhar chal सीं.', 'hg').ok);
  ok('rejects one stray Devanagari word inside an English line',
    !validateLanguage('The drum stayed empty for eleven days, सीं.', 'en').ok);
  ok('still accepts pure Latin Hinglish',
    validateLanguage('Dhang se kaam karo, sab dekh rahe hain.', 'hg').ok);
}

/* ---------------------------------------------------------------- */
section('4. script detection agrees with the declared language');
{
  const records = JSON.parse(readFileSync('src/data/bios/records.json', 'utf8'));
  const wrong = records.filter((r) => {
    const script = detectScript(r[1]);
    if (r[2] === 'hi') return script !== 'Devanagari';
    if (r[2] === 'en' || r[2] === 'hg') return script === 'Devanagari';
    return true;
  });
  ok(`all ${records.length} records match their declared script`, wrong.length === 0,
    wrong.slice(0, 3).map((r) => r[0]).join(', '));
}

/* ---------------------------------------------------------------- */
section('5. no stray non-Devanagari Indic scripts');
{
  // Batch 011 shipped a Bengali glyph (আরাম) inside a Hindi line. validateLanguage
  // only asks "is there Devanagari and is it dominant", so one Bengali word
  // passed a script test. This scan is the missing check.
  const STRAY = {
    Bengali: /[\u0980-\u09FF]/,
    Gurmukhi: /[\u0A00-\u0A7F]/,
    Gujarati: /[\u0A80-\u0AFF]/,
    Oriya: /[\u0B00-\u0B7F]/,
    Tamil: /[\u0B80-\u0BFF]/,
    Telugu: /[\u0C00-\u0C7F]/,
    Kannada: /[\u0C80-\u0CFF]/,
    Malayalam: /[\u0D00-\u0D7F]/,
    Sinhala: /[\u0D80-\u0DFF]/,
    Thai: /[\u0E00-\u0E7F]/,
    Arabic: /[\u0600-\u06FF]/,
    Cyrillic: /[\u0400-\u04FF]/,
    Greek: /[\u0370-\u03FF]/,
    Hangul: /[\uAC00-\uD7AF]/,
    Hiragana: /[\u3040-\u309F]/,
    Katakana: /[\u30A0-\u30FF]/,
  };
  // Scan every user-visible field, not just the bio text: batch 015 shipped an
  // Arabic character inside a Devanagari *tag*, which renders in the filter
  // chips even though the bio itself was clean.
  const records = JSON.parse(readFileSync('src/data/bios/records.json', 'utf8'));
  const offenders = [];
  for (const record of records) {
    const fields = [
      ['text', record[1]], ['category', record[3]], ['subcategory', record[4]], ['tone', record[5]],
    ];
    for (const tag of record[6] ?? []) fields.push(['tag', tag]);
    for (const [fieldName, value] of fields) {
      if (typeof value !== 'string') continue;
      for (const [name, pattern] of Object.entries(STRAY)) {
        if (pattern.test(value)) offenders.push(`${record[0]}/${fieldName} (${name}): ${value}`);
      }
    }
  }
  ok(`no stray scripts in ${records.length} records (text, category, subcategory, tone, tags)`,
    offenders.length === 0, offenders.slice(0, 4).join(' | '));

  // And the scan must actually be able to fail.
  ok('the stray-script scan detects Bengali', STRAY.Bengali.test('आरাম'));
}

/* ---------------------------------------------------------------- */
section("5b. the gate itself rejects foreign Indic scripts");
{
  // The scan above is a backstop over stored records. validateLanguage must
  // also refuse the line at the door, otherwise a stray glyph is only caught
  // after the record has already been accepted and counted.
  const gurmukhi = validateLanguage('क़र्ज़ चुका दिया, पर वो बात ਨਹੀਂ।', 'hi');
  ok('rejects Gurmukhi inside a Hindi line', gurmukhi.ok === false, gurmukhi.reason);
  ok('names the offending script', /Gurmukhi/.test(gurmukhi.reason ?? ''), gurmukhi.reason);

  const bengali = validateLanguage('आरাম বলো না।', 'hi');
  ok('rejects Bengali inside a Hindi line', bengali.ok === false, bengali.reason);

  const tamil = validateLanguage('நன்றி is a word I like.', 'en');
  ok('rejects Tamil inside an English line', tamil.ok === false, tamil.reason);

  // And the check must not touch legitimate Devanagari, which sits far below
  // these ranges but is easy to break with an off-by-one in the block bounds.
  ok('accepts ordinary Hindi', validateLanguage('मैं अपना काम ढंग से करता हूँ।', 'hi').ok);
  ok('accepts ordinary Hinglish', validateLanguage('Dhang se kaam karo, sab dekh rahe hain.', 'hg').ok);
}

/* ---------------------------------------------------------------- */
section('6. length ceiling is enforced, not raised');
{
  // Length lives in BioDeduplicator.consider(), not validateLanguage() — that
  // separation is deliberate (one checker for language, one for the record), so
  // the test exercises the component that actually owns the rule.
  const dedupe = new BioDeduplicator();
  const tooLong = 'Steady hands, steady work, steady results, and a sentence that simply keeps going well past the point where a bio should have stopped being useful to anyone reading it.';
  ok('record text is past the ceiling', tooLong.length > MAX_BIO_LENGTH, `${tooLong.length} chars`);
  ok('rejects a bio past the ceiling', !dedupe.consider(tooLong, 'en', 'Attitude'));
  ok('records it as too-long', dedupe.rejections.some((r) => r.layer === 'too-long'));

  const dedupe2 = new BioDeduplicator();
  ok('rejects a bio below the floor', !dedupe2.consider('Too short', 'en', 'Attitude'));
  ok('records it as too-short', dedupe2.rejections.some((r) => r.layer === 'too-short'));

  const dedupe3 = new BioDeduplicator();
  ok('accepts a normal bio', dedupe3.consider('Steady hands, steady work, steady results.', 'en', 'Attitude'));

  ok('ceiling is still 160', MAX_BIO_LENGTH === 160);
  ok('floor is still 12', MIN_BIO_LENGTH === 12);
}

/* ---------------------------------------------------------------- */
section('7. every stored record independently re-validates');
{
  const records = JSON.parse(readFileSync('src/data/bios/records.json', 'utf8'));
  const bad = records.filter((r) => !validateLanguage(r[1], r[2]).ok);
  ok(`all ${records.length} stored records pass the language gate`, bad.length === 0,
    bad.slice(0, 3).map((r) => `${r[0]}:${r[2]}`).join(', '));
}

console.log(`\n${fail === 0 ? `PASS ${pass} assertions — the language gate holds from both sides` : `FAIL ${fail} of ${pass + fail}`}`);
process.exit(fail === 0 ? 0 : 1);
