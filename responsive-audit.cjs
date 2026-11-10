/**
 * Static responsive-layout audit (no browser required).
 *
 * Loads src/index.css, evaluates the min/max-width media conditions against the
 * nine brief breakpoints and resolves the cascade for a matrix of layout-critical
 * selectors. It answers "what would compute at W px?" for grid tracks, visibility
 * and sizing — the parts of layout that come from CSS, without pixel rendering.
 *
 * Run: node responsive-audit.cjs
 */
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '');

function walkRules(block, cond, out) {
  let sel = '';
  let j = 0;
  while (j < block.length) {
    const ch = block[j];
    if (ch === '{') {
      const prelude = sel.trim(); sel = '';
      let depth = 1, k = j + 1;
      while (k < block.length && depth) {
        if (block[k] === '{') depth++;
        else if (block[k] === '}') depth--;
        k++;
      }
      const inner = block.slice(j + 1, k - 1);
      if (/^@media/.test(prelude)) walkRules(inner, prelude, out);
      else if (!/^@/.test(prelude)) out.push({ selector: prelude, body: inner, cond });
      j = k;
    } else { sel += ch; j++; }
  }
}

const rules = [];
walkRules(css, null, rules);

const px = (m) => Number(m.replace(/px$/, ''));
function mediaApplies(cond, width) {
  if (!cond) return true;
  const mins = [...cond.matchAll(/\(min-width:\s*([\d.]+px)\)/g)].map((m) => px(m[1]));
  const maxs = [...cond.matchAll(/\(max-width:\s*([\d.]+px)\)/g)].map((m) => px(m[1]));
  return mins.every((v) => width >= v) && maxs.every((v) => width <= v);
}

function declarations(body) {
  const out = {};
  for (const chunk of body.split(';')) {
    const idx = chunk.indexOf(':');
    if (idx === -1) continue;
    const prop = chunk.slice(0, idx).trim().toLowerCase();
    const value = chunk.slice(idx + 1).trim();
    if (prop) out[prop] = value;
  }
  return out;
}

function resolve(selector, prop, width) {
  let winner = null;
  for (const rule of rules) {
    const parts = rule.selector.split(',').map((s) => s.trim());
    if (!parts.includes(selector)) continue;
    if (!mediaApplies(rule.cond, width)) continue;
    const decl = declarations(rule.body);
    if (prop in decl) winner = decl[prop];
  }
  return winner;
}

const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1280, 1440];
const CASES = [
  ['.pastel-grid', 'grid-template-columns'],
  ['.tile-grid', 'grid-template-columns'],
  ['.footer-grid', 'grid-template-columns'],
  ['.footer-brand', 'grid-column'],
  ['.form-grid', 'grid-template-columns'],
  ['.username-grid', 'grid-template-columns'],
  ['.category-grid', 'grid-template-columns'],
  ['.style-gallery', 'grid-template-columns'],
  ['.style-row', 'grid-template-columns'],
  ['.styles-layout', 'grid-template-columns'],
  ['.generate-button', 'width'],
  ['.site-header-actions .btn-explore', 'display'],
  ['.site-nav', 'display'],
  ['.menu-toggle', 'display'],
  ['.container', 'padding-inline'],
];

let failures = 0;
const rows = [];
for (const [sel, prop] of CASES) {
  const cells = WIDTHS.map((w) => resolve(sel, prop, w) ?? '—');
  rows.push({ sel: `${sel} · ${prop}`, cells });
}
const colW = 14;
console.log('resolved values at each breakpoint (— = unset / stylesheet default)\n');
console.log('selector · property'.padEnd(44) + WIDTHS.map((w) => String(w).padStart(colW)).join(''));
for (const row of rows) {
  console.log(row.sel.padEnd(44) + row.cells.map((c) => String(c).slice(0, colW - 1).padStart(colW)).join(''));
}

const EXPECT = [
  ['.pastel-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 375: 'minmax(0, 1fr)', 600: 'repeat(2, minmax(0, 1fr))', 768: 'repeat(2, minmax(0, 1fr))', 1024: 'repeat(3, minmax(0, 1fr))' }],
  ['.tile-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 640: 'repeat(2, minmax(0, 1fr))', 1024: 'repeat(3, minmax(0, 1fr))', 1440: 'repeat(3, minmax(0, 1fr))' }],
  ['.footer-grid', 'grid-template-columns', { 320: 'repeat(2, minmax(0, 1fr))', 430: 'repeat(2, minmax(0, 1fr))', 768: 'repeat(3, minmax(0, 1fr))', 1440: 'minmax(0, 1.3fr) repeat(5, minmax(0, 1fr))' }],
  ['.footer-brand', 'grid-column', { 320: '1 / -1', 768: null, 1440: null }],
  ['.form-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 768: 'minmax(0, 1fr) minmax(0, 1fr)' }],
  ['.category-grid', 'grid-template-columns', { 320: 'repeat(2, minmax(0, 1fr))', 768: 'repeat(3, minmax(0, 1fr))' }],
  ['.generate-button', 'width', { 320: '100%', 640: '100%', 768: null, 1440: null }],
  ['.site-header-actions .btn-explore', 'display', { 320: 'none', 390: 'none', 640: 'none', 768: null, 1440: null }],
  ['.site-nav', 'display', { 320: 'none', 768: 'none', 1024: 'block', 1440: 'block' }],
  ['.menu-toggle', 'display', { 320: 'inline-flex', 1024: 'none', 1440: 'none' }],
  ['.container', 'padding-inline', { 320: '1.1rem', 768: '2rem' }],
];

console.log('\nexpectations\n');
for (const [sel, prop, expectations] of EXPECT) {
  for (const [wStr, expected] of Object.entries(expectations)) {
    const w = Number(wStr);
    const actual = resolve(sel, prop, w);
    const ok = (actual ?? null) === expected || (expected === null && actual == null);
    if (!ok) {
      failures++;
      console.log(`FAIL ${sel} · ${prop} @ ${w}px — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }
}
console.log(failures === 0 ? '\nall responsive cascade expectations hold' : `\n${failures} expectation(s) FAILED`);
process.exit(failures === 0 ? 0 : 1);
