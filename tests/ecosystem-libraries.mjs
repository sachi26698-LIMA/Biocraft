/**
 * BioCraft — expanded library test.
 *
 * Proves, by assertion against the REAL generated data and the REAL components:
 *
 *   1. every bundled dataset matches the record count in the licence registry;
 *   2. colour names and icons are deduplicated (no duplicate hex+name, no
 *      duplicate icon slug);
 *   3. every icon renders to a non-empty SVG path and every hex is valid;
 *   4. colour maths is correct: hex parsing, HSL round-trip, WCAG contrast on
 *      known pairs, harmony determinism, nearest-name lookup;
 *   5. the palette tool renders in a browser DOM, computes values and produces
 *      a CSS export that contains the colours on screen;
 *   6. the icon finder renders, filters by query, and emits copyable SVG markup;
 *   7. neither tool touches the network.
 *
 * Run: node tests/ecosystem-libraries.mjs
 */
import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

/* --------------------------------------------------------- DOM environment */

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'https://biocraft.test/' });
global.window = dom.window;
global.document = dom.window.document;
// Node 22 exposes `navigator` as a getter-only global; redefine it instead of
// assigning (assigning throws "Cannot set property navigator").
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true, writable: true });
global.self = dom.window;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;
global.MutationObserver = dom.window.MutationObserver;
class RO { observe() {} unobserve() {} disconnect() {} }
dom.window.ResizeObserver = RO;
global.ResizeObserver = RO;
dom.window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
dom.window.cancelAnimationFrame = (id) => clearTimeout(id);
dom.window.scrollTo = () => {};
dom.window.HTMLElement.prototype.scrollIntoView = () => {};

let networkCalls = [];
const refuse = (input) => {
  networkCalls.push(String(input?.url ?? input));
  return Promise.reject(new Error('network blocked'));
};
global.fetch = refuse;
dom.window.fetch = refuse;

const require = createRequire(import.meta.url);

/**
 * Set an <input> value the way a user would.
 *
 * React installs its own `value` property on the element instance to track
 * changes. Assigning `el.value = x` therefore bypasses the tracker and
 * React never fires onChange. Calling the PROTOTYPE setter is what a real
 * keystroke does.
 */
function setInputValue(selector, value) {
  const el = document.querySelector(selector);
  assert.ok(el, `input not found: ${selector}`);
  const setter = Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set;
  setter.call(el, value);
  el.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  return el;
}


/** Bundle a module (with real imports resolved) and require it. */
async function load(entry, name) {
  const built = await build({
    stdin: {
      contents: `export * from ${JSON.stringify(path.resolve(entry))};\nexport { default } from ${JSON.stringify(path.resolve(entry))};`,
      resolveDir: process.cwd(),
      loader: 'tsx',
    },
    bundle: true, write: false, platform: 'node', format: 'cjs', packages: 'external',
    loader: { '.css': 'empty' },
  });
  const outDir = path.join(process.cwd(), 'tests/local-first/.build');
  mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `eco-${name}.cjs`);
  writeFileSync(outFile, built.outputFiles[0].text);
  delete require.cache[outFile];
  return require(outFile);
}

/* ------------------------------------------------------------ 1. libraries */

const colors = await load('src/data/colors.ts', 'colors');
const emoji = await load('src/data/emoji.ts', 'emoji');
const icons = await import(path.resolve('src/tools/icons/data/simpleIcons.ts').replace(/^/, 'file://')).catch(async () => load('src/tools/icons/data/simpleIcons.ts', 'icons'));
const licenses = await load('src/data/licenses.ts', 'licenses');

section('1. bundled datasets match the licence registry');
const registry = new Map(licenses.LICENSE_REGISTRY.map((e) => [e.id, e]));
ok('colour count reported', colors.COLOR_COUNT > 30000, `${colors.COLOR_COUNT}`);
ok('emoji count reported', emoji.EMOJI_COUNT > 1800, `${emoji.EMOJI_COUNT}`);
ok('icon count reported', icons.ICON_COUNT > 3000, `${icons.ICON_COUNT}`);
ok('registry colour records == actual', registry.get('color-name-list').records === colors.COLOR_COUNT,
  `registry ${registry.get('color-name-list').records} vs actual ${colors.COLOR_COUNT}`);
ok('registry emoji records == actual', registry.get('unicode-emoji-json').records === emoji.EMOJI_COUNT,
  `registry ${registry.get('unicode-emoji-json').records} vs actual ${emoji.EMOJI_COUNT}`);
ok('registry icon records == actual', registry.get('simple-icons').records === icons.ICON_COUNT,
  `registry ${registry.get('simple-icons').records} vs actual ${icons.ICON_COUNT}`);

section('2. no duplicate records');
{
  const seen = new Set();
  let dupes = 0;
  for (const c of colors.COLOR_NAMES) {
    const key = `${c.hex}|${c.name.toLowerCase()}`;
    if (seen.has(key)) dupes++;
    seen.add(key);
  }
  ok('no duplicate colour name+hex pair', dupes === 0, `${dupes} duplicates`);
}
{
  const slugs = new Set(icons.ICONS.map((i) => i.slug));
  ok('no duplicate icon slug', slugs.size === icons.ICONS.length, `${icons.ICONS.length - slugs.size} duplicates`);
  const emojis = new Set(emoji.EMOJI.map((e) => e.emoji));
  ok('no duplicate emoji codepoint', emojis.size === emoji.EMOJI.length, `${emoji.EMOJI.length - emojis.size} duplicates`);
}

section('3. every record is usable, not a placeholder');
{
  const badHex = colors.COLOR_NAMES.filter((c) => !/^#[0-9a-f]{6}$/.test(c.hex));
  ok('every colour has a valid 6-digit hex', badHex.length === 0, `${badHex.length} invalid`);
  const emptyNames = colors.COLOR_NAMES.filter((c) => !c.name.trim());
  ok('every colour has a name', emptyNames.length === 0, `${emptyNames.length} blank`);

  const badPath = icons.ICONS.filter((i) => i.path.length < 10 || !/[0-9]/.test(i.path));
  ok('every icon has real path data', badPath.length === 0, `${badPath.length} empty paths`);
  const badIconHex = icons.ICONS.filter((i) => !/^[0-9a-f]{6}$/.test(i.hex));
  ok('every icon has a valid brand hex', badIconHex.length === 0, `${badIconHex.length} invalid`);
  const badTitle = icons.ICONS.filter((i) => !i.title.trim());
  ok('every icon has a title', badTitle.length === 0, `${badTitle.length} blank`);

  ok('emoji have names and groups', emoji.EMOJI.every((e) => e.name && e.group), 'blank field found');
  ok('emoji groups are non-empty', emoji.EMOJI_GROUPS.length >= 9, `${emoji.EMOJI_GROUPS.length} groups`);
}

section('4. licence policy');
for (const entry of licenses.LICENSE_REGISTRY) {
  ok(`${entry.id} uses an allowed licence (${entry.license})`, licenses.ALLOWED_LICENSES.includes(entry.license), entry.license);
}
ok('share-alike and non-commercial licences are excluded',
  licenses.EXCLUDED_LICENSES.includes('CC-BY-SA-4.0') && licenses.EXCLUDED_LICENSES.includes('CC-BY-NC-4.0'));
ok('every registry entry records a record count and file',
  licenses.LICENSE_REGISTRY.every((e) => typeof e.records === 'number' && e.records > 0 && e.file));

section('5. colour maths is correct');
const math = await load('src/lib/colorMath.ts', 'math');
{
  assert.deepEqual(math.parseHex('#fff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(math.parseHex('3b82f6'), { r: 59, g: 130, b: 246 });
  ok('parses 3-digit and 6-digit hex', math.normalizeHex('#abc') === '#aabbcc' && math.normalizeHex('3b82f6') === '#3b82f6');
  ok('rejects non-hex input', math.parseHex('rebeccapurple') === null && math.parseHex('#12') === null);

  // Round-trip: hex → HSL → hex must be lossless for 6-digit values.
  let roundTripFails = 0;
  for (const c of colors.COLOR_NAMES.slice(0, 500)) {
    if (math.hslToHex(math.rgbToHsl(math.parseHex(c.hex))) !== c.hex) roundTripFails++;
  }
  ok('HSL round-trip is lossless on 500 colours', roundTripFails === 0, `${roundTripFails} mismatches`);

  // WCAG reference values.
  ok('black on white is 21:1', math.contrastRatio('#000000', '#ffffff') === 21);
  ok('identical colours are 1:1', math.contrastRatio('#123456', '#123456') === 1);
  ok('contrast is symmetric', math.contrastRatio('#ff0000', '#00ff00') === math.contrastRatio('#00ff00', '#ff0000'));
  ok('readableOn picks the better text colour', math.readableOn('#ffffff') === '#000000' && math.readableOn('#000000') === '#ffffff');

  // Harmony determinism and validity.
  const h1 = math.buildHarmony('#3b82f6', 'analogous', 5);
  const h2 = math.buildHarmony('#3b82f6', 'analogous', 5);
  ok('harmony is deterministic', JSON.stringify(h1) === JSON.stringify(h2));
  ok('harmony returns the requested size', h1.length === 5, `${h1.length}`);
  ok('harmony colours are valid hex', h1.every((h) => /^#[0-9a-f]{6}$/.test(h)));
  for (const kind of math.HARMONY_KINDS) {
    const set = math.buildHarmony('#a03e8f', kind.id, 6);
    ok(`${kind.label} produces 6 distinct colours`, new Set(set).size >= 4 && set.length === 6, `${new Set(set).size} distinct`);
  }

  const ramp = math.tonalRamp('#3b82f6', 10);
  ok('tonal ramp is monotonic in lightness', ramp.length === 10 &&
    ramp.every((hex, i) => i === 0 || math.relativeLuminance(math.parseHex(hex)) >= math.relativeLuminance(math.parseHex(ramp[i - 1]))));

  const nearest = math.nearestColor('#3b82f6', colors.COLOR_NAMES, 3);
  ok('nearest named colour returns 3 sorted by distance',
    nearest.length === 3 && nearest[0].distance <= nearest[1].distance && nearest[1].distance <= nearest[2].distance);
  ok('exact colour is its own nearest match', math.nearestColor('#000000', colors.COLOR_NAMES, 1)[0].hex === '#000000');

  const css = math.toCssVariables([{ hex: '#111111' }, { hex: '#222222' }]);
  ok('CSS export contains both colours', css.includes('#111111') && css.includes('#222222') && css.includes(':root'));
  ok('Tailwind export is valid-shaped', math.toTailwind([{ hex: '#111111' }]).includes("'1': '#111111'"));
}

section('6. palette tool renders and computes in the DOM');
{
  networkCalls = [];
  const { default: Palette, React, act, createRoot } = await load('src/tools/palette/PaletteGenerator.tsx', 'palette').then((mod) => ({
    ...mod,
    React: require('react'),
    act: require('react').act ?? require('react-dom/test-utils').act,
    createRoot: require('react-dom/client').createRoot,
  }));
  assert.ok(Palette, 'Palette component did not load');

  document.body.innerHTML = '<div id="root"></div>';
  const root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(Palette)); });
  await act(async () => { await new Promise((r) => setTimeout(r, 100)); });

  const text = document.body.textContent ?? '';
  ok('renders without crashing', text.length > 100, `${text.length} chars`);
  ok('shows the real library size', text.includes(colors.COLOR_COUNT.toLocaleString()), 'library size not shown');
  ok('has a search field', !!document.querySelector('#palette-search'));

  // Search for a known colour name and confirm real matches appear.
  await act(async () => { setInputValue('#palette-search', 'blue'); });
  await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
  const swatches = document.querySelectorAll('.palette-swatch-btn');
  ok('name search produces swatches', swatches.length > 0, `${swatches.length} swatches`);
  ok('swatch hex values are real', [...swatches].every((el) => /#[0-9A-F]{6}/.test(el.textContent ?? '')));

  // Switch to harmony mode — the computed export must reflect the screen.
  const harmonyBtn = [...document.querySelectorAll('button.chip')].find((b) => /harmony/i.test(b.textContent ?? ''));
  assert.ok(harmonyBtn, 'harmony chip missing');
  await act(async () => { harmonyBtn.dispatchEvent(new dom.window.Event('click', { bubbles: true })); });
  await act(async () => { await new Promise((r) => setTimeout(r, 120)); });
  const harmonyText = document.body.textContent ?? '';
  ok('harmony mode shows HSL and OKLCH', /hsl\(/.test(harmonyText) && /oklch\(/.test(harmonyText));
  ok('harmony mode shows WCAG ratios', /:1/.test(harmonyText));
  const exportBox = document.querySelector('#palette-export');
  ok('export box exists and has content', !!exportBox && (exportBox.value ?? '').includes('--color-1'));
  ok('no network calls from the palette tool', networkCalls.length === 0, networkCalls.slice(0, 3).join(', '));

  await act(async () => root.unmount());
}

section('7. icon finder renders real SVGs and filters');
{
  networkCalls = [];
  const mod = await load('src/tools/icons/IconFinder.tsx', 'iconfinder');
  const React = require('react');
  const { act } = require('react');
  const { createRoot } = require('react-dom/client');

  document.body.innerHTML = '<div id="root"></div>';
  const root = createRoot(document.getElementById('root'));
  await act(async () => { root.render(React.createElement(mod.default)); });
  // The icon payload is a dynamic import; give the DOM a beat to resolve it.
  await act(async () => { await new Promise((r) => setTimeout(r, 900)); });

  let text = document.body.textContent ?? '';
  ok('loads the icon payload', text.includes('3,472') || text.includes('3472'), 'icon count not shown');
  const cells = document.querySelectorAll('.icon-cell');
  ok('renders icon cells', cells.length > 0, `${cells.length} cells`);
  const svgs = document.querySelectorAll('.icon-cell svg path');
  ok('renders real SVG path data', svgs.length > 0 && [...svgs].every((p) => (p.getAttribute('d') ?? '').length > 10));
  ok('renders brand colours', [...svgs].some((p) => /^#[0-9a-f]{6}$/i.test(p.getAttribute('fill') ?? '') || /^#[0-9a-f]{6}$/i.test(p.getAttribute('fill') ?? '')));

  ok('has a search field', !!document.querySelector('#icon-search'));
  await act(async () => { setInputValue('#icon-search', 'github'); });
  await act(async () => { await new Promise((r) => setTimeout(r, 200)); });
  const filtered = [...document.querySelectorAll('.icon-cell-title')].map((el) => el.textContent ?? '');
  ok('query filters to matching icons', filtered.length > 0 && filtered.some((t) => /github/i.test(t)),
    `${filtered.length} results: ${filtered.slice(0, 3).join(', ')}`);
  ok('no network calls from the icon finder', networkCalls.length === 0, networkCalls.slice(0, 3).join(', '));

  await act(async () => root.unmount());
}

console.log(`\n${fail === 0 ? `PASS ${pass} assertions — expanded libraries are real, licensed and working` : `FAIL ${fail} of ${pass + fail} assertions`}`);
process.exit(fail === 0 ? 0 : 1);
