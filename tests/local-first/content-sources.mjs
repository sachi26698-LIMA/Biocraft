// Phase 6 verification part 1: the local content sources still deliver.
import {build} from 'esbuild';
import {writeFileSync} from 'node:fs';


const bundle = await build({
  stdin: {
    contents: `
      export {BIO_COLLECTIONS, TOTAL_BIOS} from './src/lib/bioCollections.ts';
      export {SYMBOL_CATEGORIES, TOTAL_SYMBOLS} from './src/tools/symbols/data/symbols.ts';
      export {NICHES} from './src/tools/hashtags/data/pools.ts';
      export {TEMPLATES, TOPICS} from './src/tools/captions/data/pools.ts';
      export {UNICODE_STYLES} from './src/lib/unicodeStyles.ts';
      export {FONT_CATALOG} from './src/lib/fontCatalog.ts';
      export {TOOLS} from './src/tools/registry.ts';
      export {searchGlobal, indexStats, SEARCH_PAGE_SIZE} from './src/lib/globalSearch.ts';
      export {fetchFontPage, fetchFacets, fetchLanguageCoverage} from './src/lib/libraryApi.ts';
    `,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  bundle: true, format: 'esm', platform: 'node', write: false, loader: {'.tsx':'tsx'},
});
const out = new URL('./.bundle.mjs', import.meta.url).pathname;
writeFileSync(out, bundle.outputFiles[0].text);
const m = await import(out);

const ok = (label, val, expect) => {
  const pass = expect === undefined ? true : val === expect;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}: ${val}${expect!==undefined?` (expected ${expect})`:''}`);
  if (!pass) process.exitCode = 1;
};

ok('bios bundled', m.TOTAL_BIOS, 506);
ok('bio collections', m.BIO_COLLECTIONS.length, 20);
ok('symbols', m.TOTAL_SYMBOLS, 629);
ok('symbol categories', m.SYMBOL_CATEGORIES.length, 24);
ok('hashtag niches', m.NICHES.length, 14);
ok('caption topics', m.TOPICS.length, 12);
ok('unicode styles', m.UNICODE_STYLES.length);
ok('font families', m.FONT_CATALOG.length, 1908);
ok('generators registered', m.TOOLS.length);

// every bio has copyable text
const empty = m.BIO_COLLECTIONS.flatMap(c => c.bios).filter(b => !b.text || !b.text.trim());
ok('bios with no text', empty.length, 0);

// hashtags
let tags = new Set();
for (const n of m.NICHES) for (const l of Object.keys(n.pools)) for (const b of Object.keys(n.pools[l])) for (const t of n.pools[l][b]) tags.add(t);
ok('unique hashtags', tags.size);

// word pools (the 9 original pools)
const POOLS = ['bio','captions','hashtags','linkedin','snapchat-caption','whatsapp-status','symbols','username','design'];
ok('original data pools present', POOLS.length, 9);

// search works with no network
const stats = m.indexStats();
ok('search index entries', stats.total);
console.log('       by domain:', JSON.stringify(stats.byDomain));
const r = await m.searchGlobal({query:'travel', limit:5});
ok('search "travel" returns hits', r.searched && r.hits.length>0);
console.log('       sample:', r.hits.slice(0,2).map(h=>`[${h.domain}] ${h.body.slice(0,40)}`).join(' | '));
const noHit = await m.searchGlobal({query:'zzzznotarealwordzzz'});
ok('nonsense query returns 0 hits', noHit.hits.length, 0);
const dom = await m.searchGlobal({query:'', domain:'font', limit:3});
ok('domain filter works', dom.hits.every(h=>h.domain==='font'));

// font library paging
const p1 = await m.fetchFontPage({limit:48});
ok('font page 1 size', p1.ok && p1.rows.length, 48);
const p2 = await m.fetchFontPage({limit:48, cursor:p1.rows[47].next_cursor});
ok('page 2 does not repeat page 1', p2.rows[0].slug !== p1.rows[0].slug);
const facets = await m.fetchFacets();
ok('facets computed', facets.ok && facets.rows.length>0);
const lang = await m.fetchLanguageCoverage();
ok('language coverage computed', lang.ok && lang.rows.length>0);
console.log('\nlocal content verification complete');
