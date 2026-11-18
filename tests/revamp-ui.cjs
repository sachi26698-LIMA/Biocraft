/**
 * Revamp UI contract tests (jsdom + React act).
 *
 * Covers the new shared systems:
 *  - skeleton primitives + per-tool compositions (aria-hidden blocks, one
 *    status region, real geometry, no timers)
 *  - accessible accordion (aria-expanded/controls, mount/unmount, Escape)
 *  - accessible dropdown menu (arrow keys, Home/End, Escape, selection)
 *  - AdvancedOptions progressive disclosure (Basic notice → switch → controls)
 */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const path = require('node:path');

const results = [];
const check = (name, condition) => {
  results.push({ name, ok: Boolean(condition) });
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}`);
};

async function main() {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/', pretendToBeVisual: true });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.IS_REACT_ACT_ENVIRONMENT = true;

  const wrapper = await esbuild.build({
    stdin: {
      contents: `
        export { default as React, act } from 'react';
        export { createRoot } from 'react-dom/client';
        export { ToolModeProvider, useToolMode } from './src/lib/toolMode';
        export { default as Accordion } from './src/components/ui/Accordion';
        export { default as Dropdown } from './src/components/ui/Dropdown';
        export { default as AdvancedOptions } from './src/components/ui/AdvancedOptions';
        export * from './src/components/skeleton/toolSkeletons';
        export * from './src/components/skeleton/Skeleton';
      `,
      resolveDir: process.cwd(),
      loader: 'tsx',
    },
    bundle: true,
    write: false,
    platform: 'node',
    format: 'cjs',
    packages: 'external',
  });

  const m = new module.constructor(path.join(process.cwd(), 'revamp-ui-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'revamp-ui-test.cjs');
  m.paths = module.paths;
  m._compile(wrapper.outputFiles[0].text, m.filename);

  const {
    React, act, createRoot, ToolModeProvider, Accordion, Dropdown, AdvancedOptions,
    TOOL_SKELETONS, BioSkeleton, CaptionSkeleton,
  } = m.exports;

  const h = React.createElement;
  const root = createRoot(document.getElementById('root'));
  const click = async (element) => act(async () => {
    element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  const keyDown = async (element, key) => act(async () => {
    element.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  });

  // ---------------- skeletons ----------------
  console.log('\n--- Skeleton system ---');
  check('every registry tool key has its own skeleton', Object.keys(TOOL_SKELETONS).length === 12);
  check('no two tools share a skeleton component', new Set(Object.values(TOOL_SKELETONS)).size === 12);

  await act(async () => root.render(h(BioSkeleton)));
  const region = document.querySelector('[role="status"]');
  check('skeleton exposes exactly one status region', document.querySelectorAll('[role="status"]').length === 1);
  check('status region names the surface', /bio/i.test(region?.textContent ?? ''));
  const blocks = document.querySelectorAll('.skel');
  check('bio skeleton composes real blocks', blocks.length > 8);
  check('all skeleton blocks are aria-hidden', Array.from(blocks).every((el) => el.getAttribute('aria-hidden') === 'true'));
  const firstBlock = blocks[0];
  check('skeleton blocks reserve geometry', firstBlock.getBoundingClientRect !== undefined && (firstBlock.style.height !== '' || firstBlock.style.width !== ''));
  check('no status region leaks block text', (region?.textContent ?? '').trim().split('\n')[0].length < 80);

  await act(async () => root.render(h(CaptionSkeleton)));
  const captionRegion = document.querySelector('[role="status"]');
  check('caption skeleton has its own label', /caption/i.test(captionRegion?.textContent ?? ''));
  check('caption skeleton renders card placeholders', document.querySelectorAll('.skel-card').length >= 3);

  // ---------------- accordion ----------------
  console.log('\n--- Accordion ---');
  await act(async () =>
    root.render(
      h(Accordion, { title: 'More options', description: 'Extra settings' }, h('button', { type: 'button' }, 'Inner control')),
    ),
  );
  const toggle = document.querySelector('.accordion-toggle');
  check('accordion toggle is a button with aria-expanded=false', toggle.tagName === 'BUTTON' && toggle.getAttribute('aria-expanded') === 'false');
  check('accordion toggle controls a panel id', Boolean(toggle.getAttribute('aria-controls')));
  check('accordion content is not in the DOM while collapsed', !document.querySelector('.accordion-panel'));
  await click(toggle);
  check('expanding sets aria-expanded=true', toggle.getAttribute('aria-expanded') === 'true');
  const panel = document.querySelector('.accordion-panel');
  check('expanded panel is a labelled region', panel?.getAttribute('role') === 'region' && panel.getAttribute('aria-labelledby') === toggle.id);
  check('expanded panel shows its controls', document.querySelector('.accordion-panel button')?.textContent === 'Inner control');
  await keyDown(toggle, 'Escape');
  check('Escape collapses the accordion', toggle.getAttribute('aria-expanded') === 'false' && !document.querySelector('.accordion-panel'));
  await click(toggle);
  await click(toggle);
  check('clicking again collapses it', toggle.getAttribute('aria-expanded') === 'false');
  check('accordion heading is h2 by default (no heading-level skips)', document.querySelector('.accordion-head')?.tagName === 'H2');

  // ---------------- dropdown ----------------
  console.log('\n--- Dropdown menu ---');
  const selected = [];
  await act(async () =>
    root.render(
      h(Dropdown, {
        label: 'More actions',
        items: [
          { id: 'copy', label: 'Copy all', onSelect: () => selected.push('copy') },
          { id: 'download', label: 'Download', onSelect: () => selected.push('download') },
          { id: 'reset', label: 'Reset', onSelect: () => selected.push('reset') },
        ],
      }),
    ),
  );
  const ddButton = document.querySelector('.dropdown-toggle');
  check('dropdown trigger declares a menu popup', ddButton.getAttribute('aria-haspopup') === 'menu' && ddButton.getAttribute('aria-expanded') === 'false');
  await keyDown(ddButton, 'Enter');
  const menu = document.querySelector('[role="menu"]');
  check('Enter opens the menu', Boolean(menu));
  check('menu items have role=menuitem', document.querySelectorAll('[role="menuitem"]').length === 3);
  await keyDown(document.querySelector('[role="menu"]'), 'ArrowDown');
  check('ArrowDown moves focus to the second item', document.activeElement?.textContent === 'Download');
  await keyDown(document.querySelector('[role="menu"]'), 'End');
  check('End jumps to the last item', document.activeElement?.textContent === 'Reset');
  await keyDown(document.querySelector('[role="menu"]'), 'Home');
  check('Home jumps to the first item', document.activeElement?.textContent === 'Copy all');
  await click(document.activeElement);
  check('activating an item runs its action', selected.join(',') === 'copy');
  check('menu closes after selection', !document.querySelector('[role="menu"]'));
  await click(ddButton);
  await keyDown(document.querySelector('[role="menu"]'), 'Escape');
  check('Escape closes the menu and returns focus', !document.querySelector('[role="menu"]') && document.activeElement === ddButton);

  // ---------------- AdvancedOptions ----------------
  console.log('\n--- Advanced options (progressive disclosure) ---');
  dom.window.localStorage.setItem('biocraft:tool-mode', 'basic');
  await act(async () =>
    root.render(
      h(ToolModeProvider, null,
        h(AdvancedOptions, { title: 'Language & style' }, h('button', { type: 'button' }, 'Hindi'))),
    ),
  );
  const advToggle = document.querySelector('.accordion-toggle');
  check('advanced options start collapsed but discoverable', advToggle.getAttribute('aria-expanded') === 'false');
  await click(advToggle);
  check('basic mode shows an honest notice instead of hidden controls', Boolean(document.querySelector('.advanced-options-note')));
  check('basic mode does not silently render advanced controls', !document.querySelector('.advanced-options-body'));
  const switchMode = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Switch to Advanced'));
  check('basic mode offers a one-tap switch to Advanced', Boolean(switchMode));
  await click(switchMode);
  check('switching reveals the real controls in place', document.querySelector('.advanced-options-body button')?.textContent === 'Hindi');

  await act(async () => root.unmount());

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} revamp UI checks passed, ${failed} failed`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
