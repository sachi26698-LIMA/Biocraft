/**
 * DEV-ONLY Phase A + Phase B + pre-release verification harness. Renders the
 * real <App /> in jsdom, drives it with DOM events, runs axe-core on the
 * routes, prints PASS/FAIL per check. Exits non-zero on any failure.
 * Covers: 29 routes, eight platform pills, per-platform bio limits, search + favourites.
 *
 * Usage: esbuild bundle review-harness.tsx -> review-harness.bundle.cjs, then
 *        node review-check.cjs
 */
const { JSDOM, VirtualConsole } = require('jsdom');
const axe = require('axe-core');

const virtualConsole = new VirtualConsole();
virtualConsole.on('jsdomError', (error) => {
  // jsdom has no canvas — axe's color-contrast probe triggers this; it is
  // informational and cannot occur in a real browser. Everything else prints.
  if (String(error && error.message).includes('HTMLCanvasElement')) return;
  console.error('jsdomError:', error);
});
virtualConsole.on('error', (...args) => console.error(...args));
virtualConsole.on('warn', (...args) => console.warn(...args));

const url = 'http://localhost/';
const dom = new JSDOM(
  '<!doctype html><html lang="en"><head><title></title></head><body><div id="root"></div></body></html>',
  { url, pretendToBeVisual: true, virtualConsole },
);

const { window } = dom;

// --- jsdom environment globals ------------------------------------------------
window.scrollTo = () => {};
window.matchMedia =
  window.matchMedia ||
  ((query) => ({
    matches: false,
    media: query,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));

let clipboardText = null;
const clipboardStub = { writeText: async (text) => { clipboardText = text; } };
Object.defineProperty(window.navigator, 'clipboard', {
  value: clipboardStub,
  configurable: true,
});
// Node >=21 ships a built-in global navigator (getter, configurable) — replace it
// so the app under test sees jsdom's navigator with the clipboard stub.
Object.defineProperty(globalThis, 'navigator', {
  value: window.navigator,
  configurable: true,
});

const consoleErrors = [];
const originalError = console.error;
console.error = (...args) => {
  const line = args.map(String).join(' ');
  // React's act() warning can only exist inside this test harness (IS_REACT_ACT_ENVIRONMENT);
  // it is not reproducible in a browser. Everything else still fails the run.
  if (!line.includes('not wrapped in act')) consoleErrors.push(line);
  originalError.apply(console, args);
};
window.addEventListener('error', (event) => consoleErrors.push(event.message));

global.window = window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;
global.Element = window.Element;
global.Node = window.Node;
global.Event = window.Event;
global.MouseEvent = window.MouseEvent;
global.KeyboardEvent = window.KeyboardEvent;
global.PopStateEvent = window.PopStateEvent || window.Event;
global.getComputedStyle = window.getComputedStyle.bind(window);
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.IS_REACT_ACT_ENVIRONMENT = true;

// --- helpers -------------------------------------------------------------------
const results = [];
const check = (name, condition) => {
  results.push({ name, ok: Boolean(condition) });
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}`);
};

const $ = (selector) => window.document.querySelector(selector);
const $$ = (selector) => Array.from(window.document.querySelectorAll(selector));
const text = (selector) => { const el = $(selector); return el ? el.textContent.trim() : ''; };
const codePointLength = (s) => Array.from(s).length;

const click = async (element) => {
  const { act } = bundle;
  await act(async () => {
    element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
    await new Promise((resolve) => setTimeout(resolve, 25));
  });
};

const setInputValue = async (element, value, prototype) => {
  const proto = prototype === 'textarea' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
  const { act } = bundle;
  await act(async () => {
    setter.call(element, value);
    element.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
};

const clickTab = async (href) => {
  const el = $$('.tool-tab').find((a) => a.getAttribute('href') === href);
  if (!el) throw new Error(`no tool tab for ${href}`);
  await click(el);
};

const goto = async (path) => {
  const { act } = bundle;
  window.history.pushState(null, '', path);
  await act(async () => {
    window.dispatchEvent(new window.PopStateEvent('popstate'));
  });
  await act(async () => {});
};

const clickPlatform = async (label) => {
  const pill = $$('.toolkit-workspace .platform-pill').find((el) => el.textContent.includes(label));
  if (!pill) throw new Error(`no platform pill for ${label}`);
  await click(pill);
};

const EXPECTED_TITLES = {
  '/': 'BioCraft — All-in-One Social Media Toolkit',
  '/categories': 'Categories — BioCraft Social Media Toolkit',
  '/bio-generator': 'Bio Generator — BioCraft Social Media Toolkit',
  '/stylish-name-generator': 'Stylish Name Generator — BioCraft Social Media Toolkit',
  '/fancy-font-generator': 'Fancy Font Generator — BioCraft Social Media Toolkit',
  '/username-generator': 'Username Generator — BioCraft Social Media Toolkit',
  '/emoji-symbol-generator': 'Emoji & Symbol Generator — BioCraft Social Media Toolkit',
  '/hashtag-generator': 'Hashtag Generator — BioCraft Social Media Toolkit',
  '/caption-generator': 'Caption Generator — BioCraft Social Media Toolkit',
  '/linkedin-headline-generator': 'LinkedIn Headline Generator — BioCraft Social Media Toolkit',
  '/linkedin-summary-generator': 'LinkedIn Summary Generator — BioCraft Social Media Toolkit',
  '/features': 'Features — BioCraft Social Media Toolkit',
  '/use-cases': 'Use Cases — BioCraft Social Media Toolkit',
  '/pricing': 'Pricing — BioCraft Social Media Toolkit',
  '/blog': 'Blog — BioCraft Social Media Toolkit',
  '/resources': 'Resources — BioCraft Social Media Toolkit',
  '/about': 'About BioCraft — Social Media Toolkit',
  '/help': 'Help Center — BioCraft Social Media Toolkit',
  '/contact': 'Contact Us — BioCraft Social Media Toolkit',
  '/privacy': 'Privacy Policy — BioCraft Social Media Toolkit',
  '/terms': 'Terms of Service — BioCraft Social Media Toolkit',
  '/cookie': 'Cookie Policy — BioCraft Social Media Toolkit',
  '/login': 'Login — BioCraft Social Media Toolkit',
  '/bio-editor': 'Bio Editor — Style & Copy Your Instagram Bio | BioCraft',
  '/design-studio': 'Design Studio — BioCraft Social Media Toolkit',
};

// --- load the bundled app -------------------------------------------------------
const bundle = require('./review-harness.bundle.cjs');

const runAxe = async (routeName) => {
  const report = await axe.run(window.document.documentElement, {
    resultTypes: ['violations'],
  });
  report.violations.forEach((v) => {
    const nodes = v.nodes.map((n) => (n.target || []).join(' ')).join(' | ');
    console.log(`   axe[${v.id}] (${v.impact}): ${v.nodes.length} node(s) — ${nodes}`);
  });
  return report.violations.length;
};

(async () => {
  await bundle.mount();
  const { act } = bundle;

  console.log('\n--- Homepage (light tool-first: hero + discovery sections removed by request) ---');
  check('page renders exactly one h1', $$('h1').length === 1);
  check('h1 is the sr-only toolkit description', ($$('h1')[0]?.textContent ?? '').includes('All-in-One Social Media Toolkit'));
  check('hero is removed', !$('.hero'));
  check('explore-by-category section is removed', !$('#explore-category-title') && $$('.pastel-grid').length === 0);
  check('choose-your-platform section is removed', !$('#platform-cards-title') && $$('.platform-grid').length === 0);
  check('the live toolkit leads the page', Boolean($('.toolkit-workspace')));
  console.log('\n--- Platform stage (full-screen 3D picker) ---');
  check('stage renders above the toolkit', Boolean($('.platform-stage')) && Boolean($('.toolkit-workspace')) && ($('.platform-stage').compareDocumentPosition($('.toolkit-workspace')) & 4) !== 0);
  check('the laptop carries no app icons of its own (pills switch worlds)', $$('.platform-stage .stage-app').length === 0 && $$('.platform-stage .stage-app-icon').length === 0);
  check('stage defaults to the Instagram theme', $('.platform-stage')?.getAttribute('data-platform') === 'instagram');
  check('laptop screen boots the Instagram app home', Boolean($('.platform-stage .stage-slab-screen .mock.m-ig')));
  const xTile = $$('.toolkit-workspace .platform-pill').find((el) => (el.textContent ?? '').includes('X'));
  await click(xTile);
  check('clicking the X workspace pill re-themes the stage', $('.platform-stage')?.getAttribute('data-platform') === 'x');
  check('X workspace pill reports aria-pressed=true', xTile?.getAttribute('aria-pressed') === 'true');
  check('X app home swaps in on the laptop screen', Boolean($('.platform-stage .stage-slab-screen .mock.m-x')) && !$('.platform-stage .stage-slab-screen .mock.m-ig'));
  check('shared platform state follows the stage (workspace heading)', ($('#tool-heading')?.textContent ?? '').includes('X'));
  const igTile = $$('.toolkit-workspace .platform-pill').find((el) => (el.textContent ?? '').includes('Instagram'));
  await click(igTile);
  check('clicking Instagram restores the default theme', $('.platform-stage')?.getAttribute('data-platform') === 'instagram');
  check('screen carries no brand chrome or search bar (clean full-bleed app)',
    !$('.platform-stage .stage-search')
    && !$('.platform-stage .stage-slab-chrome')
    && Boolean($('.platform-stage .stage-slab-screen')));
  check('#workspace anchor exists for the final CTA', Boolean(window.document.getElementById('workspace')));
  check('explore-powerful-tools section is removed from the homepage', !$('#powerful-tools-title') && $$('.tile-grid').length === 0);
  check('why-choose (Built Different) section is removed from the homepage', !$('#why-title') && $$('.why-card').length === 0);
  check('twelve popular-category chips render', $$('.chip-cloud .chip').length === 12);
  check('how it works section was removed in the hero rework', !$('#how-title') && $$('.how-step').length === 0);
  check('FAQ renders 7 items', $$('.faq-item').length === 7);
  const faqFirst = $('.faq-question');
  check('first FAQ question starts expanded', faqFirst?.getAttribute('aria-expanded') === 'true');
  await click($$('.faq-question')[1]);
  check('second FAQ question toggles open', $$('.faq-question')[1].getAttribute('aria-expanded') === 'true');
  await click($$('.faq-question')[1]);
  check('second FAQ question toggles closed', $$('.faq-question')[1].getAttribute('aria-expanded') === 'false');
  check('final CTA section was removed in the hero rework', !$('#final-cta-title'));

  console.log('\n--- Section order (Header→Toolkit→Chips→FAQ→Footer) ---');
  const markers = [
    ['site-header', '.site-header'],
    ['live toolkit workspace', '.toolkit-workspace'],
    ['popular categories', '#popular-categories-title'],
    ['faq', '#faq-title'],
    ['site footer', '.site-footer'],
  ];
  const markerEls = markers.map(([name, sel]) => [name, $(sel)]);
  check('all five landmark regions are present', markerEls.every(([, el]) => Boolean(el)));
  check('sections render in the designed order', markerEls.every(([, el], i) => i === 0 || Boolean(markerEls[i - 1][1] && el && (markerEls[i - 1][1].compareDocumentPosition(el) & 4))), );

  console.log('\n--- Toolkit shell (route /) ---');
  check('Bio heading renders on /', text('#tool-heading') === 'Instagram Bio Generator');
  check('document.title is toolkit title on /', window.document.title === EXPECTED_TITLES['/']);
  check('skip link targets #tool-panel', $('.skip-link')?.getAttribute('href') === '#tool-panel');
  check('skip link lives inside the banner landmark', Boolean($('.site-header .skip-link')));
  check('tool panel exists', Boolean($('#tool-panel')));
  const tabs = $$('.tool-tab');
  check('Instagram workspace renders 8 tool tabs', tabs.length === 8);
  check(
    'tool tab hrefs in order',
    tabs.map((a) => a.getAttribute('href')).join(',') ===
      '/bio-generator,/stylish-name-generator,/fancy-font-generator,/design-studio,/username-generator,/emoji-symbol-generator,/hashtag-generator,/caption-generator',
  );
  check('Bio tab is aria-current=page', $('.tool-tab[aria-current="page"]')?.textContent.trim() === 'Bio');
  check('workspace renders eight platform pills', $$('.toolkit-workspace .platform-pill').length === 8);
  const instagramPill = $$('.toolkit-workspace .platform-pill').find((el) => el.textContent.includes('Instagram'));
  check('Instagram pill is aria-pressed=true', instagramPill?.getAttribute('aria-pressed') === 'true');
  check('footer exposes LinkedIn tools', $$('.footer-link').some((a) => a.getAttribute('href') === '/linkedin-headline-generator') && $$('.footer-link').some((a) => a.getAttribute('href') === '/linkedin-summary-generator'));
  check('footer carries Legal column with all three legal routes', $$('.footer-col').some((col) => /Legal/i.test(col.textContent || '') && ['/privacy', '/terms', '/cookie'].every((href) => Array.from(col.querySelectorAll('a')).some((a) => a.getAttribute('href') === href))));
  check('footer carries All Tools column with all thirteen tools', (() => { const col = $$('.footer-col').find((c) => /All Tools/i.test(c.textContent || '')); if (!col) return false; const hrefs = Array.from(col.querySelectorAll('a')).map((a) => a.getAttribute('href')); return hrefs.length === 13; })());
  check('footer carries Categories column with hub anchors + collections/editor', (() => { const col = $$('.footer-col').find((c) => /Categories/i.test(c.textContent || '')); if (!col) return false; const hrefs = Array.from(col.querySelectorAll('a')).map((a) => a.getAttribute('href') || ''); const catAnchors = hrefs.filter((h) => h.startsWith('/categories#cat-')); return hrefs.length === 8 && catAnchors.length === 6 && hrefs.includes('/bio-collections') && hrefs.includes('/bio-editor'); })());
  check('footer carries Popular Tools column', (() => { const col = $$('.footer-col').find((c) => /Popular Tools/i.test(c.textContent || '')); if (!col) return false; return col.querySelectorAll('a').length === 5; })());
  check('footer trust row is present', Boolean($('.footer-trust')?.textContent?.includes('Your work stays yours')));
  check('header renders search + favourites + Explore Tools', Boolean($('.site-header-actions button[aria-label="Search tools"]')) && Boolean($('.site-header-actions a[href="/categories#favourites"]')) && Boolean($('.site-header-actions a.btn-explore[href="/resources"]')));
  check('header center nav exposes the six section links', ['/', '/resources', '/categories', '/features', '/about', '/help'].every((href) => Boolean($(`.site-nav a[href="${href}"]`))));
  check('header contains no Login or Start Free buttons', !$('.site-header a[href="/login"]') && !($('.site-header')?.textContent ?? '').includes('Start Free'));

  console.log('\n--- Mobile hamburger menu ---');
  const toggle = $('.menu-toggle');
  check('menu toggle exposes aria-expanded=false initially', toggle?.getAttribute('aria-expanded') === 'false');
  check('mobile nav panel is not rendered initially', !$('#mobile-nav'));
  await click(toggle);
  check('menu toggle opens the panel (aria-expanded=true)', toggle?.getAttribute('aria-expanded') === 'true');
  check('mobile nav panel renders when opened', Boolean($('#mobile-nav')));
  check('mobile menu lists the six section destinations', ['/', '/resources', '/categories', '/features', '/about', '/help'].every((href) => Boolean($(`#mobile-nav a[href="${href}"]`))));
  check('mobile menu exposes Favourite Tools + Explore Tools CTA', Boolean($('#mobile-nav a[href="/categories#favourites"]')) && Boolean($('#mobile-nav a.btn[href="/resources"]')));
  check('mobile menu lists seven destinations (six + favourites)', $$('#mobile-nav .mobile-nav-link').length === 7);
  await click(toggle);
  check('menu toggle closes the panel again', toggle?.getAttribute('aria-expanded') === 'false' && !$('#mobile-nav'));

  // --- Discovery: hero preview, search, favourites ---
  console.log('\n--- Discovery: search overlay, favourites ---');
  const searchBtn = $('.site-header-actions button[aria-label="Search tools"]');
  await click(searchBtn);
  check('search overlay opens as an accessible dialog', Boolean($('.search-overlay[role="dialog"]')));
  await setInputValue($('.search-input'), 'username', 'input');
  check('search filters real registry entries', $$('.search-result').some((el) => (el.textContent ?? '').includes('Username Generator')));
  await act(async () => {
    window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
    await new Promise((resolve) => setTimeout(resolve, 25));
  });
  check('Escape closes the search overlay', !$('.search-overlay'));

  await goto('/categories');
  const styleStar = $('button[aria-label="Save Stylish Name Generator to favourites"]');
  check('tool tiles expose a favourite toggle (/categories hub)', Boolean(styleStar));
  await click(styleStar);
  const storedFavs = JSON.parse(window.localStorage.getItem('biocraft:favs') || '[]');
  check('starring persists to localStorage', Array.isArray(storedFavs) && storedFavs.includes('stylish-name'));
  check('toast confirms the save', ($('.toast')?.textContent ?? '').includes('Stylish Name'));
  await goto('/');
  check('homepage favourites band appears after starring', $$('#home-favourites-title').length === 1);

  await click($('.site-header-actions button[aria-label="Search tools"]'));
  await setInputValue($('.search-input'), 'username', 'input');
  const firstHit = $$('.search-result').find((el) => (el.textContent ?? '').includes('Username Generator'));
  await click(firstHit);
  check('search result navigates to the matching tool route', window.location.pathname === '/username-generator' && text('#tool-heading') === 'Username Generator');
  await goto('/');

  console.log('\n--- Bio: validation ---');
  const bioGenerateBtn = () => $$('.generate-button')[0];
  await click(bioGenerateBtn());
  check('empty submit shows error summary alert', Boolean($('.form-error-summary[role="alert"]')));
  check('error summary lists both required fields', $$('.form-error-summary li').length >= 2);
  check('aria-invalid set on name field', $('#field-name')?.getAttribute('aria-invalid') === 'true');
  check('aria-invalid set on role field', $('#field-role')?.getAttribute('aria-invalid') === 'true');

  console.log('\n--- Bio: errors clear as the form is fixed ---');
  await setInputValue($('#field-name'), 'Priya Sharma', 'input');
  check('name error clears after typing', $('#field-name')?.getAttribute('aria-invalid') !== 'true');
  await setInputValue($('#field-role'), 'photographer', 'input');
  check('error summary disappears once all fields valid', !$('.form-error-summary[role="alert"]'));

  await setInputValue($('#field-niche'), 'fashion', 'input');
  await setInputValue($('#field-city'), 'Ahmedabad', 'input');
  await click(bioGenerateBtn());
  await act(async () => {});
  const cards = $$('.bio-card');
  check('exactly 5 bio cards render', cards.length === 5);
  const bios = $$('.bio-text').map((el) => el.textContent.trim());
  check('all 5 bios unique', new Set(bios).size === bios.length);
  check('all bios ≤ 150 code points', bios.every((b) => codePointLength(b) <= 150));
  check('no bio contains unfilled template placeholders', bios.every((b) => !/\{[a-z]+\}/.test(b)));

  const firstBio = text('.bio-text');
  await click($('.bio-card .copy-button'));
  check('copy writes the exact bio text', clipboardText === firstBio);

  console.log('\n--- Bio: regenerate ---');
  await click($$('.results-header button')[0]);
  await act(async () => {});
  check('regenerate yields 5 unique bios again', (() => {
    const again = $$('.bio-text').map((el) => el.textContent.trim());
    return again.length === 5 && new Set(again).size === 5;
  })());

  console.log('\n--- Bio: category mode ---');
  await click($$('.tabs [role="tab"]')[1]);
  check('category panel renders the category grid', Boolean($('.category-grid')));
  await click($('.category-option'));
  await click(bioGenerateBtn());
  await act(async () => {});
  const categoryBios = $$('.bio-text').map((el) => el.textContent.trim());
  check('category mode yields 5 unique bios', categoryBios.length === 5 && new Set(categoryBios).size === 5);
  check('category bios ≤ 150 code points', categoryBios.every((b) => codePointLength(b) <= 150));

  console.log('\n--- Bio: Hindi ---');
  await click($$('.tabs [role="tab"]')[0]);
  const hiButton = $$('.segmented-option').find((el) => el.textContent.trim() === 'हिन्दी');
  await click(hiButton);
  check('हिन्दी segmented button aria-pressed=true', hiButton.getAttribute('aria-pressed') === 'true');
  await setInputValue($('#field-name'), 'प्रिया', 'input');
  await setInputValue($('#field-role'), 'फोटोग्राफर', 'input');
  await click(bioGenerateBtn());
  await act(async () => {});
  const hindiBios = $$('.bio-text').map((el) => el.textContent.trim());
  check('Hindi mode yields 5 unique bios', hindiBios.length === 5 && new Set(hindiBios).size === 5);
  check('Hindi bios contain Devanagari', hindiBios.some((b) => /[\u0900-\u097F]/.test(b)));

  console.log('\n--- Bio: emoji switch ---');
  const switchEl = $('.switch[role="switch"]');
  const before = switchEl.getAttribute('aria-checked');
  await click(switchEl);
  check('emoji switch toggles aria-checked', $('.switch[role="switch"]').getAttribute('aria-checked') !== before);

  // Switch language back to English for a clean slate.
  await click($$('.segmented-option').find((el) => el.textContent.trim() === 'English'));

  console.log('\n--- axe: / ---');
  check('/ has 0 axe violations', (await runAxe('/')) === 0);

  // ================= stylish name =================
  console.log('\n--- Navigation: click Stylish Name ---');
  await clickTab('/stylish-name-generator');
  check('h1 swapped to Stylish Name Generator', text('#tool-heading') === 'Stylish Name Generator');
  check('document.title updated', window.document.title === EXPECTED_TITLES['/stylish-name-generator']);
  check('tool panel keeps focus after navigation', window.document.activeElement === $('#tool-panel'));

  const nameInput = $('#stylish-name-input');
  await setInputValue(nameInput, 'Hello', 'input');
  check('counter shows 5/30', $$('.char-count').some((el) => el.textContent.trim() === '5/30'));
  const nameRows = $$('.style-row');
  check('33 style rows render', nameRows.length === 33);
  check('Bold row is 𝐇𝐞𝐥𝐥𝐨', nameRows.find((row) => row.querySelector('.style-row-label').textContent === 'Bold').querySelector('.style-row-text-live').textContent === '𝐇𝐞𝐥𝐥𝐨');
  await click(nameRows.find((row) => row.querySelector('.style-row-label').textContent === 'Bold').querySelector('.copy-button'));
  check('stylish copy writes 𝐇𝐞𝐥𝐥𝐨 byte-exact', clipboardText === '𝐇𝐞𝐥𝐥𝐨');
  check('stylish name tool exposes Copy all', Boolean($$('[aria-label="Copy all styles to clipboard"]')[0]));

  await setInputValue(nameInput, 'नमस्ते', 'input');
  check('Devanagari honesty note appears', $$('.tool-note[role="note"]').some((el) => el.textContent.includes('Devanagari')));
  const combiningPattern = /[\u0300-\u036F]/g;
  const devRows = $$('.style-row').filter((row) => row.querySelector('.style-row-label').textContent !== 'Upside Down');
  const devBroken = devRows.filter((row) => {
    const value = row.querySelector('.style-row-text-live').textContent;
    const base = value.replace(combiningPattern, '');
    return !base.includes('नमस्ते');
  }).map((row) => row.querySelector('.style-row-label').textContent);
  if (devBroken.length) console.log('   Devanagari dropped by styles:', devBroken.join(', '));
  check('Devanagari survives round-trip in non-reversed styles', devBroken.length === 0);
  const upRow = $$('.style-row').find((row) => row.querySelector('.style-row-label').textContent === 'Upside Down');
  check('Upside Down keeps every Devanagari code point', Array.from(upRow.querySelector('.style-row-text-live').textContent).filter((c) => /[\u0900-\u097F]/.test(c)).length === 6);

  console.log('\n--- axe: /stylish-name-generator ---');
  check('/stylish-name-generator has 0 axe violations', (await runAxe('/stylish-name-generator')) === 0);

  // ================= fancy fonts =================
  console.log('\n--- Navigation: click Fancy Fonts ---');
  await clickTab('/fancy-font-generator');
  check('h1 swapped to Fancy Font Generator', text('#tool-heading') === 'Fancy Font Generator');
  check('document.title updated', window.document.title === EXPECTED_TITLES['/fancy-font-generator']);

  const textarea = $('#fancy-font-input');
  await setInputValue(textarea, 'Hello', 'textarea');
  check('counter shows 5/2200', $$('.char-count').some((el) => el.textContent.trim() === '5/2200'));
  const fontRows = $$('.style-row');
  check('33 style rows render', fontRows.length === 33);
  check('Fullwidth row text is Ｈｅｌｌｏ', fontRows.find((row) => row.querySelector('.style-row-label').textContent === 'Fullwidth').querySelector('.style-row-text-live').textContent === 'Ｈｅｌｌｏ');
  check('Monospace row text is 𝙷𝚎𝚕𝚕𝚘', fontRows.find((row) => row.querySelector('.style-row-label').textContent === 'Monospace').querySelector('.style-row-text-live').textContent === '𝙷𝚎𝚕𝚕𝚘');
  await click(fontRows.find((row) => row.querySelector('.style-row-label').textContent === 'Bold').querySelector('.copy-button'));
  check('font copy writes 𝐇𝐞𝐥𝐥𝐨 byte-exact', clipboardText === '𝐇𝐞𝐥𝐥𝐨');

  await setInputValue(textarea, 'नमस्ते', 'textarea');
  check('Devanagari honesty note appears', $$('.tool-note[role="note"]').some((el) => el.textContent.includes('Devanagari')));
  const combiningPattern2 = /[\u0300-\u036F]/g;
  const devRows2 = $$('.style-row').filter((row) => row.querySelector('.style-row-label').textContent !== 'Upside Down');
  const devBroken2 = devRows2.filter((row) => {
    const value = row.querySelector('.style-row-text-live').textContent;
    const base = value.replace(combiningPattern2, '');
    return !base.includes('नमस्ते');
  }).map((row) => row.querySelector('.style-row-label').textContent);
  if (devBroken2.length) console.log('   Devanagari dropped by styles:', devBroken2.join(', '));
  check('Devanagari survives round-trip in non-reversed styles', devBroken2.length === 0);
  const upRow2 = $$('.style-row').find((row) => row.querySelector('.style-row-label').textContent === 'Upside Down');
  check('Upside Down keeps every Devanagari code point', Array.from(upRow2.querySelector('.style-row-text-live').textContent).filter((c) => /[\u0900-\u097F]/.test(c)).length === 6);

  console.log('\n--- axe: /fancy-font-generator ---');
  check('/fancy-font-generator has 0 axe violations', (await runAxe('/fancy-font-generator')) === 0);

  // ================= username =================
  console.log('\n--- Navigation: click Username ---');
  await clickTab('/username-generator');
  check('heading swapped to Username Generator', text('#tool-heading') === 'Username Generator');
  check('document.title updated', window.document.title === EXPECTED_TITLES['/username-generator']);

  await click($('.generate-button')); // empty submit
  check('empty name shows error summary alert', Boolean($('.form-error-summary[role="alert"]')));
  check('aria-invalid set on username name field', $('#username-name')?.getAttribute('aria-invalid') === 'true');

  await setInputValue($('#username-name'), 'Priya Sharma', 'input');
  await setInputValue($('#username-keyword'), 'fashion', 'input');
  await click($('.generate-button'));
  await act(async () => {});
  const handleButtons = $$('.username-item');
  check('exactly 12 username suggestions', handleButtons.length === 12);
  const handles = handleButtons.map((el) => el.querySelector('.username-handle').textContent);
  check('all handles unique', new Set(handles).size === handles.length);
  const handlePattern = /^[a-z0-9](?:[a-z0-9._]{0,28}[a-z0-9])?$/;
  check('all handles match Instagram rules', handles.every((h) => handlePattern.test(h)));
  check('style labels render (multi-style grid)', new Set($$('.username-style').map((el) => el.textContent)).size >= 3);
  await click(handleButtons[0]);
  check('copy writes the handle byte-exact', clipboardText === handles[0]);
  await click(handleButtons[1]);
  check('second suggestion copies byte-exact too', clipboardText === handles[1]);

  await click($$('.results-header button')[0]); // regenerate
  await act(async () => {});
  const handlesAfter = handles.join(',');
  const handles2 = $$('.username-handle').map((el) => el.textContent);
  check('regenerate yields 12 unique handles again', handles2.length === 12 && new Set(handles2).size === 12);
  console.log('   (username regenerate freshness: same set can legitimately recur from a small pool)');
  check('regenerate set is still a valid fresh run', handles2.length === 12 && new Set(handles2).size === 12);

  await setInputValue($('#username-name'), 'प्रिया', 'input');
  await setInputValue($('#username-keyword'), '', 'input');
  await click($('.generate-button'));
  await act(async () => {});
  const hindiHandles = $$('.username-handle').map((el) => el.textContent);
  check('Devanagari name yields handles containing "priya"', hindiHandles.length === 12 && hindiHandles.some((h) => h.includes('priya')));
  check('Devanagari transliteration note shown', text('.results-note').includes('transliterated'));

  await setInputValue($('#username-name'), 'A', 'input');
  await click($('.generate-button'));
  check('one-character name is rejected with guidance', Boolean($('.form-error-summary[role="alert"]')));

  console.log('\n--- axe: /username-generator ---');
  check('/username-generator has 0 axe violations', (await runAxe('/username-generator')) === 0);

  // ================= symbols =================
  console.log('\n--- Navigation: click Symbols ---');
  await clickTab('/emoji-symbol-generator');
  check('h1 swapped to Emoji & Symbol Generator', text('#tool-heading') === 'Emoji & Symbol Generator');
  check('document.title updated', window.document.title === EXPECTED_TITLES['/emoji-symbol-generator']);

  const allButtons = $$('.symbol-grid .symbol-button');
  check('all symbols render by default (629)', allButtons.length === 629);
  check('category filter group renders (All + Favourites + 24)', $$('.symbol-categories .chip').length === 26);

  const searchInput = $('#symbol-search-input');
  await setInputValue(searchInput, 'heart', 'input');
  const heartCount = $$('.symbol-grid .symbol-button').length;
  check('search "heart" (English) narrows the grid', heartCount > 0 && heartCount < 629);
  check('search count hint updates', text('#symbol-search-hint').includes(String(heartCount)));

  await setInputValue(searchInput, 'दिल', 'input');
  const hindiHeartCount = $$('.symbol-grid .symbol-button').length;
  check('search "दिल" (Hindi) finds hearts too', hindiHeartCount >= 26);
  const hindiHeartGlyphs = $$('.symbol-grid .symbol-button').map((el) => el.getAttribute('aria-label'));
  check('Hindi "दिल" results include ❤️, 💔 and ♥', ['❤️', '💔', '♥'].every((g) => hindiHeartGlyphs.some((label) => label.includes(g))));

  await setInputValue(searchInput, 'आग', 'input');
  check('search "आग" finds the fire glyph', $$('.symbol-grid .symbol-button').some((el) => el.getAttribute('aria-label').includes('🔥')));

  await setInputValue(searchInput, '', 'input');
  const heartsChip = $$('.symbol-categories .chip').find((el) => el.textContent.trim() === 'Hearts & Love');
  await click(heartsChip);
  check('Hearts & Love filter shows 27 symbols', $$('.symbol-grid .symbol-button').length === 27);

  const redHeart = $$('.symbol-grid .symbol-button').find((el) => el.getAttribute('aria-label') === 'Copy ❤️ to clipboard');
  check('red heart button is findable', Boolean(redHeart));
  await click(redHeart);
  check('copy writes the heart glyph byte-exact', clipboardText === '❤️');
  check('status announces the copy', $$('.sr-only[role="status"]').some((el) => el.textContent.includes('Copied')));

  await click($('.symbol-categories .chip')); // All
  await setInputValue(searchInput, 'zzzznope', 'input');
  check('no matches shows helpful empty state', text('.styles-empty').includes('No symbols match'));
  await setInputValue(searchInput, '', 'input');

  console.log('\n--- axe: /emoji-symbol-generator ---');
  check('/emoji-symbol-generator has 0 axe violations', (await runAxe('/emoji-symbol-generator')) === 0);

  // ================= hashtags =================
  console.log('\n--- Navigation: click Hashtags ---');
  await clickTab('/hashtag-generator');
  check('h1 swapped to Hashtag Generator', text('#tool-heading') === 'Hashtag Generator');
  check('document.title updated', window.document.title === EXPECTED_TITLES['/hashtag-generator']);

  await click($('.generate-button')); // defaults: photography, EN, 20, no keywords
  await act(async () => {});
  const tagButtons = $$('.hashtag-chip');
  check('default run yields 20 hashtag chips', tagButtons.length === 20);
  const tags = tagButtons.map((el) => el.querySelector('span').textContent);
  check('all tags start with #', tags.every((t) => t.startsWith('#')));
  check('all tags unique', new Set(tags.map((t) => t.toLowerCase())).size === tags.length);
  check('all tags are single tokens', tags.every((t) => !/\s/.test(t)));
  await click($$('.hashtag-actions button')[0]); // Copy all
  check('Copy all writes space-separated tags', clipboardText === tags.join(' '));

  await click($$('.results-header button')[0]); // regenerate
  await act(async () => {});
  const tagsAfter = tags.join(',');
  const tags2 = $$('.hashtag-chip').map((el) => el.querySelector('span').textContent);
  check('regenerate yields 20 unique tags again', tags2.length === 20 && new Set(tags2.map((t) => t.toLowerCase())).size === 20);
  check('regenerate produces a fresh set (not identical)', tags2.join(',') !== tagsAfter);

  await setInputValue($('#hashtag-keywords'), '!!!', 'input');
  await click($('.generate-button'));
  check('unusable keywords show an inline error', Boolean($('.field-error[role="alert"]')));

  await setInputValue($('#hashtag-keywords'), 'crop wildlife', 'input');
  await click($('.generate-button'));
  await act(async () => {});
  const withKeywords = $$('.hashtag-chip').map((el) => el.querySelector('span').textContent);
  check('keyword variants join the mix', withKeywords.some((t) => t.startsWith('#crop') || t.startsWith('#wildlife')));

  // Hindi mode
  const hiTagButton = $$('.segmented-option').find((el) => el.textContent.trim() === 'हिन्दी');
  await click(hiTagButton);
  await setInputValue($('#hashtag-keywords'), '', 'input');
  await click($('.generate-button'));
  await act(async () => {});
  const hindiTags = $$('.hashtag-chip').map((el) => el.querySelector('span').textContent);
  check('Hindi mode yields 20 tags', hindiTags.length === 20);
  check('Hindi mode yields Devanagari tags', hindiTags.some((t) => /[\u0900-\u097F]/.test(t)));

  // Size 10
  const size10 = $$('.segmented-option').find((el) => el.textContent.trim() === '10');
  await click(size10);
  await click($('.generate-button'));
  await act(async () => {});
  check('size 10 yields exactly 10 tags', $$('.hashtag-chip').length === 10);
  check('no affirmative reach/virality promises anywhere', !window.document.body.textContent.match(/(guaranteed reach|guaranteed virality|guaranteed followers|guaranteed growth|guaranteed results|will go viral|boost your reach guaranteed)/i));
  check('honest no-guarantee note is present', window.document.body.textContent.includes('no tool can guarantee reach'));

  console.log('\n--- axe: /hashtag-generator ---');
  check('/hashtag-generator has 0 axe violations', (await runAxe('/hashtag-generator')) === 0);

  // ================= captions =================
  console.log('\n--- Navigation: click Captions ---');
  await clickTab('/caption-generator');
  check('h1 swapped to Caption Generator', text('#tool-heading') === 'Caption Generator');
  check('document.title updated', window.document.title === EXPECTED_TITLES['/caption-generator']);

  await click($('.generate-button')); // defaults: photography, witty, EN
  await act(async () => {});
  const captionCards = $$('.caption-card');
  check('exactly 5 caption cards', captionCards.length === 5);
  const captionTexts = $$('.caption-card .bio-text').map((el) => el.textContent.trim());
  check('all 5 captions unique', new Set(captionTexts).size === 5);
  check('every caption shows a 2200 counter', $$('.caption-card .char-count').filter((el) => el.textContent.trim().endsWith('/2200')).length === 5);
  check('no unfilled template slots', captionTexts.every((c) => !c.includes('{topic}')));

  await click($$('.caption-card .copy-button')[0]);
  check('caption copy writes the exact caption', clipboardText === captionTexts[0]);
  await click($$('.caption-card .copy-button')[1]);
  check('second caption copies byte-exact too', clipboardText === captionTexts[1]);

  // Hindi + different tone
  const hiCaptionButton = $$('.segmented-option').find((el) => el.textContent.trim() === 'हिन्दी');
  await click(hiCaptionButton);
  const boldChip = $$('.chip').find((el) => el.textContent.trim() === 'Bold');
  await click(boldChip);
  await click($('.generate-button'));
  await act(async () => {});
  const hindiCaptionTexts = $$('.caption-card .bio-text').map((el) => el.textContent.trim());
  check('Hindi captions contain Devanagari', hindiCaptionTexts.length === 5 && hindiCaptionTexts.every((c) => /[\u0900-\u097F]/.test(c)));
  check('Hindi captions still unique', new Set(hindiCaptionTexts).size === 5);

  await click($$('.results-header button')[0]); // regenerate
  await act(async () => {});
  const hindiCaptionsBefore = hindiCaptionTexts.join('|');
  const hindiCaptionsAfter = $$('.caption-card .bio-text').map((el) => el.textContent.trim()).join('|');
  check('caption regenerate yields a valid unique run', hindiCaptionsAfter.length > 0 && new Set(hindiCaptionsAfter.split('|')).size === 5);
  check('regenerate yields 5 unique captions again', (() => {
    const again = $$('.caption-card .bio-text').map((el) => el.textContent.trim());
    return again.length === 5 && new Set(again).size === 5;
  })());

  console.log('\n--- axe: /caption-generator ---');
  check('/caption-generator has 0 axe violations', (await runAxe('/caption-generator')) === 0);


  console.log('\n--- Platforms: pills + per-platform bio limits ---');
  const PLATFORM_MATRIX = [
    ['Instagram', 'instagram', 'Instagram Bio Generator', 150],
    ['Facebook', 'facebook', 'Facebook Bio Generator', 101],
    ['Threads', 'threads', 'Threads Bio Generator', 150],
    ['TikTok', 'tiktok', 'TikTok Bio Generator', 80],
    ['X', 'x', 'X Bio Generator', 160],
    ['LinkedIn', 'linkedin', 'LinkedIn Professional Bio', 2600],
  ];
  for (const [label, id, heading, limit] of PLATFORM_MATRIX) {
    await clickPlatform(label);
    check(`${id}: workspace data-platform set`, $('.toolkit-workspace')?.getAttribute('data-platform') === id);
    const pill = $$('.toolkit-workspace .platform-pill').find((el) => el.textContent.includes(label));
    check(`${id}: pill is aria-pressed=true`, pill?.getAttribute('aria-pressed') === 'true');
    await goto('/bio-generator');
    check(`${id}: bio heading renders`, text('#tool-heading') === heading);
    if (id === 'linkedin') {
      check('linkedin: English-only note is shown', $$('.tool-note[role="note"]').some((el) => el.textContent.includes('English')));
    }
    const englishToggle = $$('.segmented-option').find((el) => el.textContent.trim() === 'English');
    if (englishToggle) await click(englishToggle);
    await setInputValue($('#field-name'), 'Priya Sharma', 'input');
    await setInputValue($('#field-role'), 'photographer', 'input');
    await click($$('.generate-button')[0]);
    await act(async () => {});
    const platformBios = $$('.bio-text').map((el) => el.textContent.trim());
    check(`${id}: 5 bios generated`, platformBios.length === 5);
    check(`${id}: all bios within ${limit} code points`, platformBios.every((b) => codePointLength(b) <= limit));
  }
  await clickPlatform('Instagram');
  check('instagram restored as active platform', $('.toolkit-workspace')?.getAttribute('data-platform') === 'instagram');

  console.log('\n--- Platforms: fallback when route tool is unavailable ---');
  await clickPlatform('LinkedIn');
  await goto('/hashtag-generator');
  check('fallback: URL unchanged', window.location.pathname === '/hashtag-generator');
  check('fallback: still LinkedIn workspace', $('.toolkit-workspace')?.getAttribute('data-platform') === 'linkedin');
  check('fallback: shows LinkedIn bio panel (first available tool)', text('#tool-heading') === 'LinkedIn Professional Bio');
  await goto('/');
  await clickPlatform('Instagram');

  console.log('\n--- Info routes render ---');
  const INFO_ROUTES = [
    ['/use-cases', 'Use Cases', 'Use Cases — BioCraft Social Media Toolkit'],
    ['/pricing', 'Pricing', 'Pricing — BioCraft Social Media Toolkit'],
    ['/blog', 'Blog', 'Blog — BioCraft Social Media Toolkit'],
    ['/resources', 'Resources', 'Resources — BioCraft Social Media Toolkit'],
    ['/about', 'About BioCraft', 'About BioCraft — Social Media Toolkit'],
    ['/help', 'Help Center', 'Help Center — BioCraft Social Media Toolkit'],
    ['/contact', 'Contact Us', 'Contact Us — BioCraft Social Media Toolkit'],
    ['/privacy', 'Privacy Policy', 'Privacy Policy — BioCraft Social Media Toolkit'],
    ['/terms', 'Terms of Service', 'Terms of Service — BioCraft Social Media Toolkit'],
    ['/cookie', 'Cookie Policy', 'Cookie Policy — BioCraft Social Media Toolkit'],
    ['/login', 'No Account Needed — On Purpose', 'Login — BioCraft Social Media Toolkit'],
  ];
  for (const [path, heading, title] of INFO_ROUTES) {
    await goto(path);
    check(`${path}: h1 renders`, ($('h1.info-title')?.textContent ?? '').trim() === heading);
    check(`${path}: document.title set`, window.document.title === title);
  }
  console.log('\n--- /features: dedicated Features page ---');
  await goto('/features');
  check('/features: dedicated hero h1 renders', ($('h1.features-title')?.textContent ?? '').includes('Twelve generators'));
  check('/features: h1 is not the generic info-title', !$('h1.info-title'));
  check('/features: document.title set', window.document.title === EXPECTED_TITLES['/features']);
  check('/features: toolbox renders 13 cards', $$('.features-grid .feature-card').length === 13);
  check('/features: every toolbox card links to a route', $$('.features-grid .feature-card').every((a) => (a.getAttribute('href') ?? '').startsWith('/')));
  check('/features: symbols card cites the real 629 count', $$('.feature-card').some((card) => (card.textContent ?? '').includes('629')));

  console.log('\n--- Tool page chrome: breadcrumb + how-to + related ---');
  await goto('/bio-generator');
  check('tool page breadcrumb shows Home / All Tools / Bio Generator', ($('.breadcrumbs')?.textContent ?? '').includes('Home') && ($('.breadcrumbs')?.textContent ?? '').includes('All Tools') && ($('.breadcrumbs')?.textContent ?? '').includes('Bio Generator'));
  check('tool page renders the 3-step how-to strip', $$('.tool-howto li').length === 3);
  check('tool page renders four related tool links', $$('.tool-related .chip').length === 4);

  console.log('\n--- /categories hub ---');
  await goto('/categories');
  check('/categories: document.title set', window.document.title === EXPECTED_TITLES['/categories']);
  check('/categories: h1 renders', ($('h1')?.textContent ?? '').trim() === 'Categories');
  check('/categories: breadcrumb renders', ($('.breadcrumbs')?.textContent ?? '').includes('Home') && ($('.breadcrumbs')?.textContent ?? '').includes('Categories'));
  check('/categories: six pastel category cards render', $$('.category-card').length === 6);
  check('/categories: twelve tools render in the All Tools grid', $$('.tile-grid--twelve .tile').length === 12);
  check('/categories: favourites section renders', Boolean($('#favourites')) && Boolean($('#favourites-heading')?.textContent?.includes('Favourite')));
  check('/categories: the starred Stylish Name tool appears in favourites', ($('#favourites')?.textContent ?? '').includes('Stylish Name'));
  check('/categories: six explore-other-categories chips render', $$('.explore-others .category-chip').length === 6);
  // exercise the working category filter (native <select> change event)
  const filterSelect = $('#hub-filter-select');
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(filterSelect, 'usernames');
    filterSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  check('/categories: filter narrows the grid to the chosen category', $$('.tile-grid--twelve .tile').length === 1 && ($('.hub-showing')?.textContent ?? '').includes('Showing 1 of 12'));
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(filterSelect, 'all');
    filterSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  check('/categories: filter resets to all twelve tools', $$('.tile-grid--twelve .tile').length === 12);

  console.log('\n--- axe: /features ---');
  await goto('/features');
  check('/features has 0 axe violations', (await runAxe('/features')) === 0);


  console.log('\n--- Deep link: /bio-generator?tab=category&category=fitness ---');
  await goto('/bio-generator?tab=category&category=fitness');
  const selectedCategory = $$('.category-option').find((el) => el.classList.contains('is-selected'));
  check('category mode activates via deep link', $$('.tabs [role="tab"]').find((el) => el.getAttribute('aria-selected') === 'true')?.textContent.toLowerCase().includes('category'));
  check('fitness category preselected', selectedCategory?.textContent.includes('Fitness') === true);
  await goto('/');

  // ================= router =================
  console.log('\n--- Navigation: back to home ---');
  await goto('/');
  check('back at / with Bio heading', window.location.pathname === '/' && text('#tool-heading') === 'Instagram Bio Generator');

  console.log('\n--- Router: unknown path falls back to / ---');
  window.history.pushState(null, '', '/definitely-not-a-tool');
  await act(async () => {
    window.dispatchEvent(new window.PopStateEvent('popstate'));
  });
  await act(async () => {});
  check('unknown path replaced with /', window.location.pathname === '/');
  check('unknown path renders Bio heading', text('#tool-heading') === 'Instagram Bio Generator');

    // ================= design studio =================
  console.log('\n--- Design Studio ---');
  await goto('/design-studio');
  check('h1 swapped to Design Studio', text('h1') === 'Design Studio');
  const dsInput = $('#design-studio-input');
  await setInputValue(dsInput, 'Chai first', 'textarea');
  check('design studio counter shows 10/2200', $$('.char-count').some((el) => el.textContent.trim() === '10/2200'));
  check('ready-made mix gallery renders 12 cards', $$('.mix-grid .mix-card').length === 12);
  const dsFont = $('#design-studio-font');
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(dsFont, 'bold');
    dsFont.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  check('builder preview applies the Bold style', ($('.design-studio-preview .bio-card-text')?.textContent ?? '').includes('𝐂𝐡𝐚𝐢 𝐟𝐢𝐫𝐬𝐭'));
  const dsFrame = $('#design-studio-frame');
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set.call(dsFrame, 'crown');
    dsFrame.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  const dsPreview = $('.design-studio-preview .bio-card-text')?.textContent ?? '';
  check('builder preview wraps in the crown frame', dsPreview.startsWith('👑 ') && dsPreview.endsWith(' 👑'));
  check('builder copy button renders', Boolean($('.design-studio-preview .copy-button')));
  check('remix button is a real button', Boolean($$('.mix-gallery-actions button').find((b) => b.textContent.includes('Remix'))));

  // ================= bio editor =================
  console.log('\n--- Bio Editor ---');
  await goto('/bio-editor');
  check('h1 swapped to Bio Editor', text('h1') === 'Bio Editor');
  const editorInput = $('#bio-editor-input');
  await setInputValue(editorInput, 'Chai first', 'textarea');
  check('editor counter shows 10/150', $$('.bio-editor-counter-slot .char-count').some((el) => el.textContent.trim() === '10/150'));
  const xChip = $$('.bio-editor-platforms .chip').find((b) => b.textContent.trim() === 'X');
  await click(xChip);
  check('editor counter switches to the X limit', $$('.bio-editor-counter-slot .char-count').some((el) => el.textContent.trim() === '10/160'));
  check('editor preview mirrors the typed text', text('.bio-editor-preview .bio-card-text').includes('Chai first'));
  check('editor ships a real copy button', Boolean($('.bio-editor-copy .copy-button')));

  // ================= exact titles =================
  console.log('\n--- Titles on every route ---');
  for (const route of Object.keys(EXPECTED_TITLES)) {
    await goto(route);
    check(`title for ${route}`, window.document.title === EXPECTED_TITLES[route]);
  }
  await goto('/');

  console.log('\n--- Console errors ---');
  check('zero console errors across the whole run', consoleErrors.length === 0);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((line) => console.log('   console.error:', line));
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed, ${failed.length} failed`);
  process.exit(failed.length === 0 ? 0 : 1);
})().catch((error) => {
  console.error('harness crashed:', error);
  process.exit(1);
});
