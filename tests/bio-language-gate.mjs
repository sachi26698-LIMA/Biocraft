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
section('5. length ceiling is enforced, not raised');
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
section('6. every stored record independently re-validates');
{
  const records = JSON.parse(readFileSync('src/data/bios/records.json', 'utf8'));
  const bad = records.filter((r) => !validateLanguage(r[1], r[2]).ok);
  ok(`all ${records.length} stored records pass the language gate`, bad.length === 0,
    bad.slice(0, 3).map((r) => `${r[0]}:${r[2]}`).join(', '));
}

console.log(`\n${fail === 0 ? `PASS ${pass} assertions — the language gate holds from both sides` : `FAIL ${fail} of ${pass + fail}`}`);
process.exit(fail === 0 ? 0 : 1);
