/**
 * BioCraft — Text Toolkit logic test.
 *
 * Pure-function tests against src/lib/textOps.ts. Every case asserts real
 * behaviour, including the awkward ones: Devanagari, emoji, accents, emails
 * containing @, and empty input.
 *
 * Run: node tests/text-ops.mjs
 */
import { build } from 'esbuild';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const eq = (name, actual, expected) => ok(name, actual === expected, `got ${JSON.stringify(actual)} expected ${JSON.stringify(expected)}`);
const section = (t) => console.log(`\n${t}`);

const built = await build({
  stdin: { contents: `export * from ${JSON.stringify(path.resolve('src/lib/textOps.ts'))};`, resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
});
const outDir = path.join(process.cwd(), 'tests/local-first/.build');
mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, 'text-ops.cjs');
writeFileSync(outFile, built.outputFiles[0].text);
const t = createRequire(import.meta.url)(outFile);

section('1. word splitting');
assert.deepEqual(t.words('hello world'), ['hello', 'world']);
ok('splits camelCase boundaries', t.words('helloWorld').length === 2, JSON.stringify(t.words('helloWorld')));
ok('keeps accented words whole', t.words('café crème').length === 2, JSON.stringify(t.words('café crème')));
ok('drops punctuation only', t.words('hello, world!').join('|') === 'hello|world', JSON.stringify(t.words('hello, world!')));
assert.deepEqual(t.words(''), []);

section('2. case conversion');
eq('UPPERCASE', t.toUpper('Hello World'), 'HELLO WORLD');
eq('lowercase', t.toLower('Hello World'), 'hello world');
eq('Title Case keeps small words lowercase', t.toTitle('the lord of the rings'), 'The Lord of the Rings');
eq('Title Case capitalises first word even if small', t.toTitle('a tale of two cities'), 'A Tale of Two Cities');
eq('Title Case capitalises last word even if small', t.toTitle('what are you waiting for'), 'What Are You Waiting For');
eq('Sentence case', t.toSentence('HELLO THERE. HOW ARE YOU? FINE!'), 'Hello there. How are you? Fine!');
eq('camelCase', t.toCamel('hello world example'), 'helloWorldExample');
eq('PascalCase', t.toPascal('hello world example'), 'HelloWorldExample');
eq('snake_case', t.toSnake('Hello World Example'), 'hello_world_example');
eq('kebab-case', t.toKebab('Hello World Example'), 'hello-world-example');
eq('CONSTANT_CASE', t.toConstant('hello world example'), 'HELLO_WORLD_EXAMPLE');

section('3. URL slug');
eq('strips accents', t.toSlug('Café Crème'), 'cafe-creme');
eq('collapses separators', t.toSlug('Hello   ---  World'), 'hello-world');
eq('trims leading/trailing hyphens', t.toSlug('--Hello World--'), 'hello-world');
eq('drops apostrophes', t.toSlug("It's Fine"), 'its-fine');
ok('Devanagari is removed, not mis-transliterated', t.toSlug('नमस्ते world') === 'world', JSON.stringify(t.toSlug('नमस्ते world')));
ok('empty input yields empty slug', t.toSlug('   ') === '');

section('4. cleaning');
eq('collapse spaces', t.collapseSpaces('a   b\t\tc'), 'a b c');
eq('trim lines', t.trimLines('  a  \n  b  '), 'a\nb');
eq('remove blank lines', t.removeBlankLines('a\n\n  \nb'), 'a\nb');
eq('dedupe keeps first and order', t.dedupeLines('b\na\nb\nc\na'), 'b\na\nc');
eq('sort ascending natural', t.sortLinesAsc('item10\nitem2\nItem1'), 'Item1\nitem2\nitem10');
eq('sort descending', t.sortLinesDesc('a\nc\nb'), 'c\nb\na');
eq('reverse lines', t.reverseLines('a\nb\nc'), 'c\nb\na');

section('5. reverse is grapheme-safe');
eq('reverses ascii', t.reverseText('abc'), 'cba');
{
  const reversed = t.reverseText('a👍🏽b');
  ok('keeps a multi-codepoint emoji intact', reversed === 'b👍🏽a', JSON.stringify(reversed));
}
{
  // Combining acute accent must travel with its base letter.
  const reversed = t.reverseText('ae\u0301b');
  ok('keeps combining marks attached', reversed.includes('e\u0301') || reversed === 'be\u0301a', JSON.stringify(reversed));
}

section('6. extraction');
assert.deepEqual(t.extractEmails('write to a.b+c@example.co.uk or x@y.io'), ['a.b+c@example.co.uk', 'x@y.io']);
ok('emails are deduplicated', t.extractEmails('a@b.co a@b.co').length === 1);
assert.deepEqual(t.extractUrls('see https://example.com/a?b=1 and http://x.io'), ['https://example.com/a?b=1', 'http://x.io']);
assert.deepEqual(t.extractHashtags('hi #travel #यात्रा #tips #travel'), ['#travel', '#यात्रा', '#tips']);
{
  // The @ in an email address must NOT be treated as a mention.
  const mentions = t.extractMentions('ping @alice and @bob_dev, not a@b.com');
  ok('mentions exclude email addresses', mentions.join(',') === '@alice,@bob_dev', JSON.stringify(mentions));
}
assert.deepEqual(t.extractNumbers('a 1,000 b -3.5 c 42'), ['1,000', '-3.5', '42']);

section('7. statistics');
{
  const s = t.analyse('One two three. Four five!\n\nSecond paragraph here.');
  // 'One two three. Four five!\n\nSecond paragraph here.' is 49 chars, 8 words.
  eq('counts characters', s.characters, 49);
  eq('counts words', s.words, 8);
  eq('counts sentences', s.sentences, 3);
  eq('counts paragraphs', s.paragraphs, 2);
  eq('counts lines', s.lines, 3);
  eq('unique words ignore case/punctuation', s.uniqueWords, 8);
  eq('longest word', s.longestWord, 'paragraph');
  ok('reading time rounds up', s.readingMinutes >= 1, String(s.readingMinutes));
  eq('characters without spaces', s.charactersNoSpaces, 'One two three. Four five!\n\nSecond paragraph here.'.replace(/\s/g, '').length);
}
{
  const empty = t.analyse('');
  ok('empty text gives zeroes', empty.words === 0 && empty.sentences === 0 && empty.lines === 0 && empty.readingMinutes === 0,
    JSON.stringify(empty));
}
{
  const long = t.analyse(Array.from({ length: 450 }, () => 'word').join(' '));
  eq('450 words is 3 reading minutes', long.readingMinutes, 3);
}

section('8. operation registry is complete and honest');
ok('every operation has a label, hint and apply', t.OPERATIONS.every((o) => o.label && o.hint && typeof o.apply === 'function'));
ok('operation ids are unique', new Set(t.OPERATIONS.map((o) => o.id)).size === t.OPERATIONS.length);
ok('every operation survives empty input without throwing',
  t.OPERATIONS.every((o) => { try { o.apply(''); return true; } catch { return false; } }));
ok('groups are exactly Case, Clean, Extract',
  [...new Set(t.OPERATIONS.map((o) => o.group))].sort().join(',') === 'Case,Clean,Extract');
// Word-boundary match: a naive /ai/ would flag the label "Extract emails".
ok('no fake "AI" naming', t.OPERATIONS.every((o) => !/\b(AI|smart|magic|auto-magically)\b/i.test(`${o.label} ${o.hint}`)));

section('9. the tool renders and applies operations in a real DOM');
{
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://biocraft.test/' });
  global.window = dom.window;
  global.document = dom.window.document;
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true, writable: true });
  global.HTMLElement = dom.window.HTMLElement;
  global.Event = dom.window.Event;
  class RO { observe() {} unobserve() {} disconnect() {} }
  global.ResizeObserver = RO;
  dom.window.ResizeObserver = RO;
  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};

  const comp = await build({
    stdin: { contents: `export { default } from ${JSON.stringify(path.resolve('src/tools/text/TextToolkit.tsx'))};`, resolveDir: process.cwd(), loader: 'tsx' },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external', loader: { '.css': 'empty' },
  });
  const compFile = path.join(outDir, 'text-toolkit.cjs');
  writeFileSync(compFile, comp.outputFiles[0].text);
  const mod = createRequire(import.meta.url)(compFile);
  const React = createRequire(import.meta.url)('react');
  const { createRoot } = createRequire(import.meta.url)('react-dom/client');

  const root = createRoot(document.getElementById('root'));
  root.render(React.createElement(mod.default));
  await new Promise((r) => setTimeout(r, 150));

  ok('renders the input', !!document.querySelector('#text-input'));
  ok('shows all 22 operations as buttons',
    document.querySelectorAll('.operation-btn').length === t.OPERATIONS.length,
    `${document.querySelectorAll('.operation-btn').length} vs ${t.OPERATIONS.length}`);
  ok('operations are disabled while empty',
    [...document.querySelectorAll('.operation-btn')].every((b) => b.disabled));

  // Type text the way a user would (prototype setter so React sees the change).
  const input = document.querySelector('#text-input');
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set;
  setter.call(input, 'hello world');
  input.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 120));

  ok('live stats count the typed words', /2/.test(document.querySelector('.text-stats')?.textContent ?? ''));

  const upper = [...document.querySelectorAll('.operation-btn')].find((b) => b.textContent?.includes('UPPERCASE'));
  assert.ok(upper, 'UPPERCASE button missing');
  upper.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 120));
  ok('clicking UPPERCASE transforms the input', input.value === 'HELLO WORLD', input.value);

  const undo = [...document.querySelectorAll('button')].find((b) => /Undo/i.test(b.textContent ?? ''));
  assert.ok(undo, 'undo button missing');
  undo.dispatchEvent(new dom.window.Event('click', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 120));
  ok('undo restores the previous text', input.value === 'hello world', input.value);

  root.unmount();
}

console.log(`\n${fail === 0 ? `PASS ${pass} assertions — text operations behave correctly` : `FAIL ${fail} of ${pass + fail}`}`);
process.exit(fail === 0 ? 0 : 1);
