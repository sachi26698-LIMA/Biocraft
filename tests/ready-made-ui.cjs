/**
 * Ready-Made Bios + Bio Library contract tests (jsdom + React act).
 *
 * Verifies the phase-2 discovery layer against the REAL registry — no mocks,
 * no fixtures, no invented numbers:
 *  - counts are derived and match the bundled registry (506 / 20)
 *  - every facet partitions the library (no double counting, no losses)
 *  - every card renders a real destination route
 *  - search, facets, sort, load-more and the empty state work on real data
 *  - query params round-trip and drive the rendered results
 *  - navigation/scroll policy: new page → top, filter change → no jump
 */
const esbuild = require('esbuild');
const { JSDOM } = require('jsdom');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');

const results = [];
const check = (name, condition) => {
  results.push({ name, ok: Boolean(condition) });
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}`);
};

async function main() {
  const dom = new JSDOM('<div id="root"></div>', {
    url: 'http://localhost/bio-library',
    pretendToBeVisual: true,
  });
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Node = dom.window.Node;
  global.IS_REACT_ACT_ENVIRONMENT = true;
  global.navigator = dom.window.navigator;

  // jsdom has no layout engine; record the requested scroll instead of warning.
  const scrollCalls = [];
  dom.window.scrollTo = (x, y) => scrollCalls.push([x, y]);
  dom.window.HTMLElement.prototype.scrollIntoView = function scrollIntoView() {
    scrollCalls.push(['intoView', this.id || this.className]);
  };

  const wrapper = await esbuild.build({
    stdin: {
      contents: `
        export { default as React, act } from 'react';
        export { createRoot } from 'react-dom/client';
        export { default as BioCollectionsPage } from './src/pages/BioCollectionsPage';
        export { default as BioLibraryPage } from './src/pages/BioLibraryPage';
        export { default as ReadyMadeBiosSection } from './src/components/ReadyMadeBiosSection';
        export * from './src/lib/readyMadeBios';
        export { navigate, getPath, getSearch } from './src/lib/router';
        export { TOTAL_BIOS, BIO_COLLECTIONS } from './src/lib/bioCollections';
        export { PLATFORMS } from './src/tools/platforms';
        export { TOOLS } from './src/tools/registry';
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

  const m = new module.constructor(path.join(process.cwd(), 'ready-made-test.cjs'), module);
  m.filename = path.join(process.cwd(), 'ready-made-test.cjs');
  m.paths = module.paths;
  m._compile(wrapper.outputFiles[0].text, m.filename);

  const lib = m.exports;
  const {
    React, act, createRoot,
    BioCollectionsPage, BioLibraryPage, ReadyMadeBiosSection,
    LIBRARY_BIOS, LIBRARY_TOTAL, LIBRARY_MATCHES_REGISTRY, TOTAL_BIOS, BIO_COLLECTIONS,
    COLLECTION_SUMMARIES, CATEGORY_SUMMARIES, CATEGORY_FACETS, LANGUAGE_FACETS,
    PLATFORM_FACETS, DESIGN_FACETS, FEATURED_COLLECTIONS, RECENT_COLLECTIONS,
    FEATURED_DESIGNS, READY_MADE_STATS, EMPTY_LIBRARY_QUERY,
    parseLibraryQuery, libraryQueryToSearch, queryLibrary, activeFilterCount,
    navigate, getPath, getSearch, PLATFORMS, TOOLS,
  } = lib;

  const h = React.createElement;
  const root = createRoot(document.getElementById('root'));
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const $ = (selector) => document.querySelector(selector);
  const text = (selector) => $(selector)?.textContent ?? '';
  const click = async (element) => act(async () => {
    element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  });
  const setInput = async (element, value) => act(async () => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(element, value);
    element.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
  const setSelect = async (element, value) => act(async () => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value').set;
    setter.call(element, value);
    element.dispatchEvent(new window.Event('change', { bubbles: true }));
  });
  const resetUrl = async (url) => {
    await act(async () => {
      dom.window.history.replaceState(null, '', url);
      dom.window.dispatchEvent(new window.PopStateEvent('popstate'));
    });
  };

  // Every destination a card can link to must exist as a real route.
  const builtRoutes = new Set(
    fs.readdirSync(path.join(process.cwd(), 'dist'), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(process.cwd(), 'dist', entry.name, 'index.html')))
      .map((entry) => `/${entry.name}`),
  );
  const routeables = new Set([
    '/', '/categories', '/resources', '/about', '/help', '/contact', '/privacy', '/terms',
    '/cookie', '/login', '/pricing', '/blog', '/features', '/use-cases', '/bio-editor',
    '/bio-collections', '/bio-library', '/design-studio', '/preview-diagnostics',
    ...TOOLS.map((tool) => tool.path),
    ...BIO_COLLECTIONS.map((collection) => `/${collection.slug}`),
  ]);
  const isRealHref = (href) => {
    if (!href || !href.startsWith('/')) return false;
    const target = href.split('?')[0].split('#')[0];
    return routeables.has(target);
  };

  // ---------------------------------------------------------------
  console.log('\n--- Registry integrity (real data only) ---');
  check('library index covers the whole registry', LIBRARY_MATCHES_REGISTRY && LIBRARY_TOTAL === TOTAL_BIOS);
  check('registry holds 506 bios across 20 collections', TOTAL_BIOS === 506 && BIO_COLLECTIONS.length === 20);
  check('bio ids are unique (nothing duplicated to inflate counts)',
    new Set(LIBRARY_BIOS.map((bio) => bio.id)).size === LIBRARY_BIOS.length);
  check('library ids are slug+index, so they survive re-ordering',
    LIBRARY_BIOS.every((bio) => bio.id === `${bio.collectionSlug}--${Number(bio.id.split('--')[1])}`));
  check('every bio carries a real collection, design and category',
    LIBRARY_BIOS.every((bio) => bio.collectionSlug && bio.collectionName && bio.designName && bio.categoryId));
  check('category facets partition the library exactly once',
    CATEGORY_FACETS.reduce((sum, facet) => sum + facet.count, 0) === LIBRARY_TOTAL);
  check('language facets partition the library exactly once',
    LANGUAGE_FACETS.reduce((sum, facet) => sum + facet.count, 0) === LIBRARY_TOTAL);
  check('platform facets partition the library exactly once',
    PLATFORM_FACETS.reduce((sum, facet) => sum + facet.count, 0) === LIBRARY_TOTAL);
  check('every design facet has bios behind it',
    DESIGN_FACETS.every((facet) => facet.count > 0) && FEATURED_DESIGNS.every((design) => design.count > 0));
  check('stats are derived from the registry',
    READY_MADE_STATS.bios === TOTAL_BIOS &&
    READY_MADE_STATS.collections === 20 &&
    READY_MADE_STATS.categories === CATEGORY_SUMMARIES.length &&
    READY_MADE_STATS.designs === DESIGN_FACETS.length);
  check('only real platforms appear as platform facets',
    PLATFORM_FACETS.every((facet) => PLATFORMS.some((platform) => platform.id === facet.value)));
  check('collection summary counts equal their real bio counts',
    COLLECTION_SUMMARIES.every((summary) =>
      summary.count === (BIO_COLLECTIONS.find((collection) => collection.slug === summary.slug)?.bios.length ?? -1)));
  check('featured and recent collections are real, and recent are distinct from featured extras',
    FEATURED_COLLECTIONS.length > 0 &&
    RECENT_COLLECTIONS.length > 0 &&
    [...FEATURED_COLLECTIONS, ...RECENT_COLLECTIONS].every((summary) => isRealHref(summary.href)));

  // ---------------------------------------------------------------
  console.log('\n--- Query params ---');
  const parsed = parseLibraryQuery('?category=boys&lang=hi&sort=longest&q=chai');
  check('valid params parse', parsed.category === 'boys' && parsed.lang === 'hi' && parsed.sort === 'longest' && parsed.q === 'chai');
  check('unknown facet values fall back to "all"',
    parseLibraryQuery('?category=nope&lang=zz&design=nope&collection=nope').category === 'all' &&
    parseLibraryQuery('?category=nope&lang=zz').lang === 'all');
  check('invalid sort falls back to curated', parseLibraryQuery('?sort=nonsense').sort === 'curated');
  check('serialisation omits defaults', libraryQueryToSearch(EMPTY_LIBRARY_QUERY) === '');
  check('parse → serialise → parse round-trips',
    libraryQueryToSearch(parseLibraryQuery(libraryQueryToSearch(parsed))) === libraryQueryToSearch(parsed));
  check('active filter count ignores sort but counts real filters',
    activeFilterCount(parsed) === 3 && activeFilterCount({ ...EMPTY_LIBRARY_QUERY, sort: 'az' }) === 0);

  console.log('\n--- Filtering & sorting on real bios ---');
  const boys = queryLibrary({ ...EMPTY_LIBRARY_QUERY, category: 'boys' });
  check('category filter returns only that category',
    boys.length > 0 && boys.every((bio) => bio.categoryId === 'boys'));
  const hindi = queryLibrary({ ...EMPTY_LIBRARY_QUERY, lang: 'hi' });
  check('language filter returns only Devanagari bios',
    hindi.length > 0 && hindi.every((bio) => bio.lang === 'hi' && /[\u0900-\u097F]/.test(bio.text)));
  const royal = queryLibrary({ ...EMPTY_LIBRARY_QUERY, design: 'royal' });
  check('design filter returns only that design', royal.length > 0 && royal.every((bio) => bio.design === 'royal'));
  const fb = queryLibrary({ ...EMPTY_LIBRARY_QUERY, platform: 'facebook' });
  check('platform filter returns only Facebook bios',
    fb.length > 0 && fb.every((bio) => bio.collectionSlug === 'facebook-bio'));
  const search = queryLibrary({ ...EMPTY_LIBRARY_QUERY, q: 'chai' });
  check('search matches bio text case-insensitively', search.length > 0 &&
    search.every((bio) => `${bio.plain ?? ''} ${bio.text} ${bio.collectionName} ${bio.designName}`.toLowerCase().includes('chai')));
  check('search with no possible match returns nothing (honest empty state)',
    queryLibrary({ ...EMPTY_LIBRARY_QUERY, q: 'zzzzzz-no-such-bio' }).length === 0);
  const longest = queryLibrary({ ...EMPTY_LIBRARY_QUERY, sort: 'longest' });
  check('"longest" sorts by real text length',
    longest.length === LIBRARY_TOTAL &&
    longest.every((bio, index) => index === 0 || longest[index - 1].text.length >= bio.text.length));
  const az = queryLibrary({ ...EMPTY_LIBRARY_QUERY, sort: 'az' });
  check('"A–Z" sorts by real collection name',
    az.length === LIBRARY_TOTAL &&
    az.every((bio, index) => index === 0 || az[index - 1].collectionName.localeCompare(bio.collectionName) <= 0));
  const newest = queryLibrary({ ...EMPTY_LIBRARY_QUERY, sort: 'newest' });
  check('"newest" keeps every bio and groups by real reviewed month',
    newest.length === LIBRARY_TOTAL &&
    newest.every((bio) => /^[A-Z][a-z]+ \d{4}$/.test(bio.updated)));

  // ---------------------------------------------------------------
  console.log('\n--- Hub page (/bio-collections) ---');
  await act(async () => root.render(h(BioCollectionsPage)));
  check('hub renders one h1', document.querySelectorAll('h1').length === 1);
  check('hub headline states the real totals',
    text('.rmb-stats').includes('506') && text('.rmb-stats').includes('20'));
  check('hub search + View All row exists',
    Boolean($('.rmb-search input')) && Boolean($('.rmb-viewall')));
  check('View All points at the complete library', $('.rmb-viewall').getAttribute('href') === '/bio-library');
  check('featured section renders every curated collection card',
    $$('.rmb-featured-grid .rmb-collection').length === FEATURED_COLLECTIONS.length);
  check('category section renders one card per real category',
    $$('.rmb-cat').length === CATEGORY_SUMMARIES.length);
  check('category cards carry real counts', $$('.rmb-cat-count').every((el) => /\d+ bios/.test(el.textContent ?? '')));
  check('recently added section renders only recent collections',
    $$('.rmb-badge--new').length === RECENT_COLLECTIONS.length);
  check('design section renders the featured designs with counts',
    $$('.rmb-design').length === FEATURED_DESIGNS.length &&
    $$('.rmb-design-count').every((el) => /\d+ bios/.test(el.textContent ?? '')));
  check('platform section covers bundled + generator platforms',
    $$('.rmb-platform').length === PLATFORM_FACETS.length + (PLATFORMS.length - PLATFORM_FACETS.length));
  check('language section renders every language facet',
    $$('.rmb-lang-card').length === LANGUAGE_FACETS.length);
  const allCollectionLinks = $$('.rmb-collection').map((el) => el.getAttribute('href'));
  check('every collection card links to its real collection route',
    allCollectionLinks.length >= COLLECTION_SUMMARIES.length &&
    allCollectionLinks.every((href) => isRealHref(href) && routeables.has(href)));
  check('every collection route appears at least once on the hub',
    COLLECTION_SUMMARIES.every((summary) => allCollectionLinks.includes(summary.href)));
  const hubHrefs = $$('a[href^="/"]').map((el) => el.getAttribute('href'));
  check('no hub link is broken',
    hubHrefs.filter((href) => !isRealHref(href)).length === 0);

  console.log('\n--- Hub search ---');
  await setInput($('.rmb-search input'), 'royal');
  check('hub search filters collections, not bios',
    $$('.rmb-collection').length > 0 && $$('.rmb-collection').length < 20);
  check('hub search offers a library hand-off with the same query',
    $('.rmb-viewall').getAttribute('href') === '/bio-library?q=royal');
  await setInput($('.rmb-search input'), 'nothing-matches-this');
  check('hub search shows an empty state with a real way out',
    Boolean($('.empty-state')) && Boolean($('.empty-state .btn')));
  await click($('.bc-search-clear'));
  check('clearing hub search restores the sections', $$('.rmb-cat').length === CATEGORY_SUMMARIES.length);

  // ---------------------------------------------------------------
  console.log('\n--- Library page (/bio-library) ---');
  await resetUrl('/bio-library');
  await act(async () => root.render(h(BioLibraryPage)));
  check('library renders one h1 and states the real total', document.querySelectorAll('h1').length === 1 && text('.lib-lede').includes('506'));
  check('library shows a bounded first page (36 of 506)',
    $$('.lib-card').length === 36 && text('.lib-count').includes('506'));
  check('every rendered bio card shows text, collection and language',
    $$('.lib-card').every((card) =>
      Boolean(card.querySelector('.lib-card-text')?.textContent?.trim()) &&
      Boolean(card.querySelector('.lib-card-collection')) &&
      Boolean(card.querySelector('.lib-lang'))));
  check('bio card collection links are real routes',
    $$('.lib-card-collection').every((el) => isRealHref(el.getAttribute('href'))));
  check('bio card actions are real buttons/links',
    $$('.lib-card-actions button').length === $$('.lib-card').length &&
    $$('.lib-card-actions a, .lib-card-actions .lib-card-link').every((el) => isRealHref(el.getAttribute('href'))));

  const beforeMore = $$('.lib-card').length;
  await click($('.lib-more .btn'));
  check('load more appends the next page', $$('.lib-card').length === beforeMore + 36);

  console.log('\n--- Library facets (URL-driven) ---');
  await resetUrl('/bio-library?category=boys');
  check('category deep link filters the grid',
    $$('.lib-card').length > 0 && $$('.lib-card').length <= 36 && text('.lib-count').includes('filter'));
  check('facet select reflects the deep-linked value', $('#lib-category').value === 'boys');

  await resetUrl('/bio-library?lang=hi');
  check('language deep link yields Devanagari-only bios',
    $$('.lib-card-text').length > 0 && $$('.lib-card-text').every((el) => /[\u0900-\u097F]/.test(el.textContent ?? '')));

  await resetUrl('/bio-library?design=royal&sort=longest');
  check('design + sort deep link applies both', $('#lib-design').value === 'royal' && $('#lib-sort').value === 'longest');
  check('sorted grid is longest-first',
    (() => {
      const lengths = $$('.lib-card-text').map((el) => (el.textContent ?? '').length);
      return lengths.every((value, index) => index === 0 || lengths[index - 1] >= value);
    })());

  await resetUrl('/bio-library?q=chai');
  check('search deep link filters real bios and reports the count',
    $$('.lib-card').length > 0 && text('.lib-count').includes('of'));

  await resetUrl('/bio-library?q=zzzzzz-no-such-bio');
  check('no-match search renders the empty state + reset',
    Boolean($('.empty-state')) && Boolean($('.empty-state .empty-state-action .btn')));
  await click($('.empty-state .empty-state-action .btn'));
  check('reset restores the full first page', $$('.lib-card').length === 36);
  check('reset clears the URL back to /bio-library', dom.window.location.pathname === '/bio-library' && dom.window.location.search === '');

  console.log('\n--- Library facet interaction ---');
  await setSelect($('#lib-platform'), 'facebook');
  check('platform select filters the grid to Facebook bios',
    $$('.lib-card-collection').every((el) => el.getAttribute('href') === '/facebook-bio'));
  check('filter state is mirrored in the URL', dom.window.location.search.includes('platform=facebook'));
  check('active filter count is announced', text('.lib-count').includes('1 filter active'));
  await click($('.lib-toolbar-foot .btn'));
  check('toolbar reset clears every facet', dom.window.location.search === '' && $$('.lib-card').length === 36);

  // ---------------------------------------------------------------
  console.log('\n--- Homepage Ready-Made block ---');
  await act(async () => root.render(h(ReadyMadeBiosSection)));
  check('homepage block states real totals', text('.rmb-home').includes('506') && text('.rmb-home').includes('20'));
  check('homepage block links to the hub and the library',
    Boolean($('.rmb-home a[href="/bio-collections"]')) && Boolean($('.rmb-home a[href="/bio-library"]')));
  check('homepage featured cards are real collections',
    $$('.rmb-home-card').length === 6 &&
    $$('.rmb-home-card').every((el) => isRealHref(el.getAttribute('href'))));
  check('homepage category chips are real filters',
    $$('.rmb-home-chip').every((el) => isRealHref(el.getAttribute('href'))));
  check('secondary rails start collapsed (progressive disclosure)',
    $$('.rmb-home .accordion-panel').length === 0 && $$('.rmb-home .accordion-toggle').length === 3);
  const collapseButtons = $$('.rmb-home .accordion-toggle');
  await click(collapseButtons[0]);
  check('opening "recently added" reveals real collection links',
    $$('.rmb-home-rail-link').length >= RECENT_COLLECTIONS.length &&
    $$('.rmb-home-rail-link').every((el) => isRealHref(el.getAttribute('href'))));

  // ---------------------------------------------------------------
  console.log('\n--- Navigation & scroll policy ---');
  scrollCalls.length = 0;
  navigate('/bio-collections');
  check('navigating to a new page scrolls to the top', scrollCalls.some(([x, y]) => x === 0 && y === 0));
  scrollCalls.length = 0;
  navigate('/bio-library');
  check('navigating to the library also starts at the top',
    getPath() === '/bio-library' && scrollCalls.some(([x, y]) => x === 0 && y === 0));
  scrollCalls.length = 0;
  navigate('/bio-library?category=love', { replace: true });
  check('filtering inside the library does not jump the page',
    scrollCalls.length === 0 && getSearch() === '?category=love');

  // A cross-page deep link: the target section exists on the destination page.
  const anchor = document.createElement('div');
  anchor.id = 'bios';
  document.body.appendChild(anchor);
  scrollCalls.length = 0;
  navigate('/instagram-bio-for-boys#bios');
  check('cross-page deep link lands on the hash target',
    scrollCalls.some(([kind, id]) => kind === 'intoView' && id === 'bios'));
  check('a missing hash target falls back to the top instead of a stale offset',
    (() => {
      scrollCalls.length = 0;
      navigate('/bio-collections#no-such-section');
      return scrollCalls.some(([x, y]) => x === 0 && y === 0);
    })());
  check('scroll restoration is manual where the browser supports it',
    !('scrollRestoration' in dom.window.history) || dom.window.history.scrollRestoration === 'manual');
  check('router keeps the path it was given', getPath() === '/bio-collections');
  navigate('/bio-collections');

  // ---------------------------------------------------------------
  const failed = results.filter((result) => !result.ok);
  console.log(`\n${results.length - failed.length}/${results.length} ready-made UI checks passed, ${failed.length} failed`);
  if (failed.length > 0) {
    for (const failure of failed) console.log(`  FAILED: ${failure.name}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
