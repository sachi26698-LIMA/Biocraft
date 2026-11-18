/**
 * Static responsive-layout audit (no browser required).
 *
 * Loads src/index.css, src/upgrade.css and src/revamp.css, evaluates the min/max-width media conditions against the
 * requested phone/tablet breakpoints and resolves the cascade for a matrix of layout-critical
 * selectors. It answers "what would compute at W px?" for grid tracks, visibility
 * and sizing — the parts of layout that come from CSS, without pixel rendering.
 *
 * Run: node responsive-audit.cjs
 */
const fs = require('fs');
const path = require('path');

const css = ['index.css', 'upgrade.css', 'revamp.css']
  .map((file) => fs.readFileSync(path.join(__dirname, 'src', file), 'utf8'))
  .join('\n')
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

const WIDTHS = [320, 360, 375, 390, 412, 430, 768, 820, 1024, 1280, 1440];
const CASES = [
  ['.pastel-grid', 'grid-template-columns'],
  ['.tile-grid', 'grid-template-columns'],
  ['.footer-grid', 'grid-template-columns'],
  ['.footer-brand', 'grid-column'],
  ['.rmb-collection-grid', 'grid-template-columns'],
  ['.rmb-cat-grid', 'grid-template-columns'],
  ['.lib-grid', 'grid-template-columns'],
  ['.lib-facets', 'grid-template-columns'],
  ['.home-platform-row', 'grid-template-columns'],
  ['.home-tools-grid', 'grid-template-columns'],
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
  ['.result-editable', 'width'],
  ['.symbol-button', 'min-height'],
  ['.symbol-grid', 'grid-template-columns'],
  ['.symbol-fav', 'width'],
  ['.field input', 'min-height'],
  ['.btn', 'min-height'],
  ['.results-actions', 'flex-wrap'],
  ['.theme-toggle-label', 'display'],
  ['.workspace-reset', 'margin-top'],
  ['.tool-mode-toggle', 'display'],
  ["[data-tool-mode='basic'] .tool-advanced", 'display'],
  ['.workspace-tool-actions', 'flex-wrap'],
  // Revamp layer
  ['.platform-pills', 'grid-template-columns'],
  ['.platform-pill', 'min-width'],
  ['.tool-tabs-list', 'flex-wrap'],
  ['.chip-row', 'flex-wrap'],
  ['.accordion-toggle', 'min-height'],
  ['.mobile-nav', 'max-height'],
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
  ['.footer-grid', 'grid-template-columns', { 320: 'repeat(2, minmax(0, 1fr))', 430: 'repeat(2, minmax(0, 1fr))', 768: 'repeat(3, minmax(0, 1fr))', 1440: 'minmax(0, 1.2fr) repeat(6, minmax(0, 1fr))' }],
  ['.footer-brand', 'grid-column', { 320: '1 / -1', 768: null, 1440: null }],
  ['.rmb-collection-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 640: 'repeat(2, minmax(0, 1fr))', 1080: 'repeat(3, minmax(0, 1fr))' }],
  ['.rmb-cat-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 375: 'repeat(2, minmax(0, 1fr))', 768: 'repeat(3, minmax(0, 1fr))', 1440: 'repeat(5, minmax(0, 1fr))' }],
  ['.lib-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 640: 'repeat(2, minmax(0, 1fr))', 1440: 'repeat(3, minmax(0, 1fr))' }],
  ['.lib-facets', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 430: 'repeat(2, minmax(0, 1fr))', 1440: 'repeat(6, minmax(0, 1fr))' }],
  ['.home-platform-row', 'grid-template-columns', { 320: 'repeat(2, minmax(0, 1fr))', 640: 'repeat(4, minmax(0, 1fr))', 1440: 'repeat(8, minmax(0, 1fr))' }],
  ['.home-tools-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 640: 'repeat(2, minmax(0, 1fr))', 1440: 'repeat(3, minmax(0, 1fr))' }],
  ['.form-grid', 'grid-template-columns', { 320: 'minmax(0, 1fr)', 768: 'minmax(0, 1fr) minmax(0, 1fr)' }],
  ['.category-grid', 'grid-template-columns', { 320: 'repeat(2, minmax(0, 1fr))', 768: 'repeat(3, minmax(0, 1fr))' }],
  ['.generate-button', 'width', { 320: '100%', 640: '100%', 768: null, 1440: null }],
  ['.site-header-actions .btn-explore', 'display', { 320: 'none', 390: 'none', 640: 'none', 768: null, 1440: null }],
  ['.site-nav', 'display', { 320: 'none', 768: 'none', 1024: 'block', 1440: 'block' }],
  ['.menu-toggle', 'display', { 320: 'inline-flex', 1024: 'none', 1440: 'none' }],
  ['.container', 'padding-inline', { 320: '1.1rem', 768: '2rem' }],
  ['.result-editable', 'width', { 320: '100%', 375: '100%', 412: '100%', 768: '100%', 1440: '100%' }],
  ['.symbol-button', 'min-height', { 360: '62px', 390: '62px', 412: '62px', 430: '62px', 768: '54px' }],
  ['.symbol-grid', 'grid-template-columns', { 360: 'repeat(auto-fill, minmax(64px, 1fr))', 390: 'repeat(auto-fill, minmax(64px, 1fr))', 412: 'repeat(auto-fill, minmax(64px, 1fr))', 430: 'repeat(auto-fill, minmax(64px, 1fr))', 768: 'repeat(auto-fill, minmax(56px, 1fr))' }],
  ['.symbol-fav', 'width', { 360: '36px', 390: '36px', 412: '36px', 430: '36px', 768: '24px' }],
  ['.field input', 'min-height', { 360: '46px', 390: '46px', 412: '46px', 430: '46px' }],
  ['.btn', 'min-height', { 360: '44px', 390: '44px', 412: '44px', 430: '44px' }],
  ['.results-actions', 'flex-wrap', { 360: 'wrap', 390: 'wrap', 412: 'wrap', 430: 'wrap' }],
  ['.theme-toggle-label', 'display', { 320: 'none', 430: 'none', 768: null }],
  ['.workspace-reset', 'margin-top', { 320: '0.6rem', 768: '0.6rem' }],
  ['.tool-mode-toggle', 'display', { 320: 'inline-flex', 390: 'inline-flex', 820: 'inline-flex', 1440: 'inline-flex' }],
  ["[data-tool-mode='basic'] .tool-advanced", 'display', { 320: 'none !important', 820: 'none !important', 1440: 'none !important' }],
  ['.workspace-tool-actions', 'flex-wrap', { 320: 'wrap', 820: 'wrap', 1440: 'wrap' }],
  // Platform selector must never need page-level scrolling: 4-up grid on
  // phones, 8-up from 900px, and no fixed min-width that can overflow.
  ['.platform-pills', 'grid-template-columns', {
    320: 'repeat(4, minmax(0, 1fr))',
    430: 'repeat(4, minmax(0, 1fr))',
    768: 'repeat(4, minmax(0, 1fr))',
    1024: 'repeat(8, minmax(0, 1fr))',
    1440: 'repeat(8, minmax(0, 1fr))',
  }],
  ['.platform-pill', 'min-width', { 320: '0', 768: '0', 1440: '0' }],
  // Chip and tab rows wrap instead of clipping important controls.
  ['.tool-tabs-list', 'flex-wrap', { 320: 'wrap', 390: 'wrap', 1024: 'wrap' }],
  ['.chip-row', 'flex-wrap', { 320: 'wrap', 430: 'wrap', 1024: 'wrap' }],
  // Disclosure controls keep a 52px touch target at every width.
  ['.accordion-toggle', 'min-height', { 320: '52px', 768: '52px', 1440: '52px' }],
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
