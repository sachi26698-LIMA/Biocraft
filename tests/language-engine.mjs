/**
 * Multilingual engine tests.
 *
 * The point of these assertions is honesty, not accuracy: a detector that always
 * guesses something is worse than one that admits when it cannot tell, because a
 * wrong label then gets filtered on and silently hides content.
 */
import assert from 'node:assert/strict';

import { readFileSync, rmSync } from 'node:fs';
import esbuild from 'esbuild';
import { join } from 'node:path';
// The module is TypeScript; compile it exactly as the browser build would, so the
// test exercises the shipped code rather than a hand-transcribed copy.
const BUNDLE = join(process.cwd(), '.lang-test-tmp.mjs');
await esbuild.build({
  entryPoints: ['src/lib/language.ts'],
  bundle: true, platform: 'node', format: 'esm', outfile: BUNDLE, logLevel: 'silent',
});
const {
  detectLanguage, LANGUAGES, languageByCode, isRtl, CLIENT_SETTABLE_STATUSES,
  isDisplayableTranslation, statusLabel, translationAvailability,
} = await import(BUNDLE);
rmSync(BUNDLE, { force: true });

let pass = 0;
const ok = (n) => { pass++; console.log(`  PASS  ${n}`); };

console.log('\n1. registry is complete and self-consistent');
{
  assert.ok(LANGUAGES.length >= 22, 'at least the 22 registered languages');
  const codes = LANGUAGES.map((l) => l.code);
  assert.equal(new Set(codes).size, codes.length, 'codes are unique');
  for (const required of ['en', 'hi', 'hg', 'es', 'fr', 'de', 'pt', 'ar', 'bn', 'ur', 'ja', 'ko']) {
    assert.ok(codes.includes(required), `${required} must be registered`);
  }
  assert.ok(codes.includes('zh-Hans'), 'Chinese is registered');
  ok(`${LANGUAGES.length} languages, all required ones present`);

  assert.equal(isRtl('ar'), true);
  assert.equal(isRtl('ur'), true);
  assert.equal(isRtl('en'), false);
  assert.equal(isRtl('hi'), false);
  assert.equal(languageByCode('nope'), null);
  ok('RTL direction is correct for Arabic and Urdu only');
}

console.log('\n2. script-based detection');
{
  const hi = detectLanguage('मेरा नाम सचिन है और मैं डिज़ाइनर हूँ');
  assert.equal(hi.language, 'hi');
  assert.ok(hi.confidence > 0.7);
  assert.match(hi.reason, /Deva/);

  const bn = detectLanguage('আমার নাম সচিন');
  assert.equal(bn.language, 'bn');

  const gu = detectLanguage('મારું નામ સચિન છે');
  assert.equal(gu.language, 'gu');

  const ta = detectLanguage('என் பெயர் சச்சின்');
  assert.equal(ta.language, 'ta');

  const ru = detectLanguage('Меня зовут Сачин, я дизайнер');
  assert.equal(ru.language, 'ru');

  const ko = detectLanguage('안녕하세요 제 이름은 사친입니다');
  assert.equal(ko.language, 'ko');

  const ja = detectLanguage('こんにちは、私の名前はサチンです');
  assert.equal(ja.language, 'ja');

  const th = detectLanguage('สวัสดีครับ ผมชื่อซาชิน');
  assert.equal(th.language, 'th');

  ok('Hindi, Bengali, Gujarati, Tamil, Russian, Korean, Japanese, Thai');
}
{
  // Arabic script is shared; Urdu-specific letters must decide.
  const ar = detectLanguage('مرحبا اسمي ساشين وأنا مصمم');
  assert.equal(ar.language, 'ar');
  const ur = detectLanguage('میرا نام سچن ہے اور میں ڈیزائنر ہوں');
  assert.equal(ur.language, 'ur');
  ok('Arabic vs Urdu distinguished by script-specific letters');
}
{
  // Han without kana is Chinese; the variant is not guessed.
  const zh = detectLanguage('你好我的名字是萨钦');
  assert.equal(zh.language, 'zh-Hans');
  assert.ok(zh.confidence < 0.7, 'confidence stays modest because the variant is not inferred');
  ok('Chinese detected without overclaiming the variant');
}

console.log('\n3. Latin-script detection, including Hinglish');
{
  const hg = detectLanguage('mera naam sachin hai aur main designer hoon yaar');
  assert.equal(hg.language, 'hg', 'Hinglish must be recognised, not labelled English');
  ok('Hinglish recognised by its markers');

  const es = detectLanguage('Hola, mi nombre es Sachin y soy diseñador para los clientes');
  assert.equal(es.language, 'es');
  const fr = detectLanguage('Bonjour, je suis designer pour les clients avec vous');
  assert.equal(fr.language, 'fr');
  const de = detectLanguage('Hallo, ich bin Designer und das ist nicht immer einfach');
  assert.equal(de.language, 'de');
  ok('Spanish, French, German recognised from real marker words');

  const pt = detectLanguage('Olá, meu nome é Sachin e sou designer');
  assert.equal(pt.language, 'pt');
  ok('Portuguese recognised from diacritics');
}
{
  // Unmarked Latin text: answer, but admit the evidence is weak.
  const en = detectLanguage('Creative designer building calm digital products');
  assert.equal(en.language, 'en');
  assert.ok(en.confidence <= 0.5, 'unmarked Latin text must not be high confidence');
  assert.match(en.reason, /ambiguous/);
  ok('English returned with low confidence and a stated reason');
}

console.log('\n4. indeterminate input is admitted, not guessed');
{
  for (const [label, text] of [
    ['pure emoji', '✨💫🌸'],
    ['too short', 'hi'],
    ['empty', ''],
    ['null', null],
  ]) {
    const r = detectLanguage(text);
    assert.equal(r.language, null, `${label} must not be labelled`);
    assert.equal(r.indeterminate, true);
    assert.ok(r.reason.length > 0, 'a reason must be given');
  }
  ok('emoji-only, very short, empty and null input all return null with a reason');

  // URLs and handles must not count as evidence.
  const mentions = detectLanguage('@sachin_26698 https://example.com');
  assert.equal(mentions.indeterminate, true);
  ok('mentions and URLs are stripped before detection');
}
{
  // Determinism: same input, same answer, every time.
  const text = 'Hola, mi nombre es Sachin y soy diseñador';
  const first = JSON.stringify(detectLanguage(text));
  for (let i = 0; i < 5; i++) assert.equal(JSON.stringify(detectLanguage(text)), first);
  ok('detection is deterministic');
}

console.log('\n5. translation status cannot be self-promoted');
{
  assert.ok(!CLIENT_SETTABLE_STATUSES.includes('verified'), 'client may never set verified');
  assert.ok(!CLIENT_SETTABLE_STATUSES.includes('reviewed'), 'client may never set reviewed');
  assert.deepEqual(CLIENT_SETTABLE_STATUSES, ['rejected']);
  ok('only rejection is client-settable; verification is a reviewer action');

  assert.equal(isDisplayableTranslation('verified'), true);
  assert.equal(isDisplayableTranslation('machine'), true);
  assert.equal(isDisplayableTranslation('rejected'), false);
  ok('rejected translations are never displayed as complete');

  assert.match(statusLabel('machine'), /not reviewed/);
  assert.doesNotMatch(statusLabel('machine'), /^Verified/);
  ok('machine drafts are labelled as unreviewed');
}

console.log('\n6. availability is honest about missing translations');
{
  const none = translationAvailability('en', 'hi', []);
  assert.equal(none.available, false);
  assert.match(none.reason, /no hi translation/);

  const rejected = translationAvailability('en', 'hi', [
    { targetLanguage: 'hi', content: 'x', status: 'rejected', provider: 'ai' },
  ]);
  assert.equal(rejected.available, false);
  assert.match(rejected.reason, /rejected/);

  const machine = translationAvailability('en', 'hi', [
    { targetLanguage: 'hi', content: 'x', status: 'machine', provider: 'ai' },
  ]);
  assert.equal(machine.available, true);
  assert.match(machine.reason, /not reviewed/);

  const same = translationAvailability('en', 'en', []);
  assert.equal(same.available, true);
  ok('missing, rejected, machine and same-language cases all reported correctly');
}

console.log('\n7. the module is browser-safe: no Node imports');
{
  const src = readFileSync('src/lib/language.ts', 'utf8');
  assert.ok(!/from ['"]node:/.test(src), 'must not import node builtins');
  assert.ok(!/require\(/.test(src), 'must not use require');
  assert.ok(!/process\.env/.test(src), 'must not read secrets or env');
  ok('no node builtins, no require, no process.env');
}

console.log(`\nALL PASS — ${pass} checks passed`);
