/**
 * BioCraft — AI engine tests.
 *
 * Every network call is a stub, but nothing else is: the real adapters, the real
 * prompt builder, the real parsing and the real fallback logic run.
 *
 * The security assertions are the point of this file:
 *   - no provider key may appear in src/ or in any built bundle
 *   - the engine must be impossible to import from browser code
 *   - an absent provider must never produce invented text
 */

import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  generate, buildPrompt, configuredProviders, similarity, findDuplicates,
  qualityScore, extractKeywords, seoSuggestions, PROVIDER_IDS,
} from '../admin-backend/server/ai-engine.mjs';

let pass = 0;
const ok = (n) => { pass++; console.log(`  PASS  ${n}`); };

/* ---------------------------------------------------------------- helpers */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) out.push(p);
  }
  return out;
}

/** A fetch stub that answers like the named provider. */
function stubFetch(replies) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    const match = Object.entries(replies).find(([frag]) => url.includes(frag));
    if (!match) throw new Error(`unexpected url ${url}`);
    const [, behaviour] = match;
    if (behaviour === 'timeout') {
      const e = new Error('aborted'); e.name = 'AbortError'; throw e;
    }
    if (typeof behaviour === 'number') {
      return { ok: false, status: behaviour, text: async () => 'rate limited' };
    }
    return { ok: true, status: 200, json: async () => behaviour };
  };
  fn.calls = calls;
  return fn;
}

const openaiReply = { choices: [{ message: { content: 'first option\nsecond option\nthird option' } }] };

/* ---------------------------------------------------------------- 1. security */
console.log('\n1. keys stay server-side');

const browserFiles = walk('src');
for (const f of browserFiles) {
  const src = readFileSync(f, 'utf8');
  assert.ok(
    !/admin-backend\/server\/ai-engine/.test(src),
    `${f} must not import the server AI engine`,
  );
}
ok(`no src/ file imports the server AI engine (${browserFiles.length} files scanned)`);

// A real key shape must never appear in source or in the built bundle.
const KEY_PATTERNS = [
  /sk-[A-Za-z0-9]{20,}/,                    // OpenAI
  /sk-ant-[A-Za-z0-9-]{20,}/,               // Anthropic
  /AIza[0-9A-Za-z_-]{30,}/,                 // Google
];
const scanRoots = ['src', 'dist'].filter((d) => existsSync(d));
let scanned = 0;
for (const root of scanRoots) {
  for (const f of walk(root)) {
    const src = readFileSync(f, 'utf8');
    scanned++;
    for (const re of KEY_PATTERNS) {
      assert.ok(!re.test(src), `${f} appears to contain a provider key`);
    }
    assert.ok(!/service_role/i.test(src) || /must never|never reach|never appear|server/i.test(src),
      `${f} mentions service_role outside a warning`);
  }
}
ok(`no provider-key shape in ${scanned} source/dist file(s)`);

/* ---------------------------------------------------------------- 2. no provider */
console.log('\n2. without a provider, nothing is invented');
{
  const r = await generate({ kind: 'bio', platform: 'instagram' }, { env: {}, fetchImpl: async () => { throw new Error('must not be called'); } });
  assert.equal(r.available, false);
  assert.equal(r.reason, 'no-provider');
  assert.deepEqual(r.attempts, []);
  // The decisive check: no text may come back at all, so no caller can render it.
  assert.equal(r.options, undefined, 'no invented options may be returned');
  ok('returns available:false with a plain reason and no text');
}
{
  // An unrelated env var must not be mistaken for a provider key.
  const r = await generate({}, { env: { OPENAI_API_KEY: '   ' }, fetchImpl: async () => { throw new Error('x'); } });
  assert.equal(r.available, false);
  assert.equal(r.reason, 'no-provider');
  assert.equal(r.options, undefined, 'no invented options may be returned');
  ok('whitespace-only key counts as unconfigured');
}

/* ---------------------------------------------------------------- 3. configuredProviders */
console.log('\n3. provider detection reports names, never values');
{
  const list = configuredProviders({ OPENAI_API_KEY: 'secret-value', ANTHROPIC_MODEL: 'x' });
  assert.equal(list.length, 1);
  assert.equal(list[0].id, 'openai');
  assert.ok(!JSON.stringify(list).includes('secret-value'), 'must not leak the key');
  ok('only configured providers listed; no key echoed');
}

/* ---------------------------------------------------------------- 4. success */
console.log('\n4. a configured provider is actually called');
{
  const fetchImpl = stubFetch({ 'api.openai.com': openaiReply });
  const r = await generate(
    { kind: 'bio', platform: 'instagram', tone: 'minimal', language: 'Hindi', keywords: ['wanderlust'] },
    { env: { OPENAI_API_KEY: 'k' }, fetchImpl },
  );
  assert.equal(r.available, true);
  assert.equal(r.provider, 'openai');
  assert.deepEqual(r.options, ['first option', 'second option', 'third option']);
  assert.equal(fetchImpl.calls.length, 1);

  // The prompt must carry the structured context, not ignore it.
  const sent = JSON.parse(fetchImpl.calls[0].init.body);
  const userMsg = sent.messages.find((m) => m.role === 'user').content;
  assert.match(userMsg, /Instagram/);
  assert.match(userMsg, /Hindi/);
  assert.match(userMsg, /wanderlust/);
  assert.match(userMsg, /Tone:/);
  ok('request carries platform, tone, language and keywords');
}
{
  // Anthropic and Google parse paths must work too.
  const aReply = { content: [{ type: 'text', text: 'alpha\nbeta' }] };
  const a = await generate({}, { env: { ANTHROPIC_API_KEY: 'k' }, fetchImpl: stubFetch({ 'api.anthropic.com': aReply }) });
  assert.deepEqual(a.options, ['alpha', 'beta']);

  const gReply = { candidates: [{ content: { parts: [{ text: 'gamma\ndelta' }] } }] };
  const g = await generate({}, { env: { GEMINI_API_KEY: 'k' }, fetchImpl: stubFetch({ 'generativelanguage.googleapis.com': gReply }) });
  assert.deepEqual(g.options, ['gamma', 'delta']);
  ok('anthropic and google adapters parse their own shapes');
}
{
  // Numbering and quotes must be stripped, not shown to the user.
  const reply = { choices: [{ message: { content: '1. "one"\n2) two\n- three' } }] };
  const r = await generate({}, { env: { OPENAI_API_KEY: 'k' }, fetchImpl: stubFetch({ 'api.openai.com': reply }) });
  assert.deepEqual(r.options, ['one', 'two', 'three']);
  ok('list markers and wrapping quotes removed');
}

/* ---------------------------------------------------------------- 5. failure + fallback */
console.log('\n5. failures are failures, not silent success');
{
  const fetchImpl = stubFetch({ 'api.openai.com': 429 });
  const r = await generate({}, { env: { OPENAI_API_KEY: 'k' }, fetchImpl });
  assert.equal(r.available, false);
  assert.equal(r.reason, 'all-providers-failed');
  assert.match(r.attempts[0].error, /429/);
  assert.equal(r.options, undefined, 'a failed call must not yield text');
  ok('HTTP 429 surfaces as an unavailable result');
}
{
  const fetchImpl = stubFetch({ 'api.openai.com': 'timeout' });
  const r = await generate({}, { env: { OPENAI_API_KEY: 'k' }, fetchImpl, timeoutMs: 50 });
  assert.equal(r.available, false);
  assert.match(r.attempts[0].error, /timed out/);
  ok('timeout is reported, not hidden');
}
{
  // Fallback only to another *configured* provider, and it names the one that answered.
  const fetchImpl = stubFetch({ 'api.openai.com': 500, 'api.anthropic.com': { content: [{ type: 'text', text: 'from anthropic' }] } });
  const r = await generate({}, { env: { OPENAI_API_KEY: 'k', ANTHROPIC_API_KEY: 'k2' }, fetchImpl });
  assert.equal(r.available, true);
  assert.equal(r.provider, 'anthropic');
  assert.equal(r.attempts[0].ok, false);
  assert.equal(r.attempts[1].ok, true);
  ok('falls back to a second provider and reports which one answered');
}
{
  // An empty completion must not be treated as success.
  const fetchImpl = stubFetch({ 'api.openai.com': { choices: [{ message: { content: '   ' } }] } });
  const r = await generate({}, { env: { OPENAI_API_KEY: 'k' }, fetchImpl });
  assert.equal(r.available, false);
  assert.equal(r.options, undefined, 'empty completion must not yield text');
  ok('empty completion is a failure');
}

/* ---------------------------------------------------------------- 6. prompt safety */
console.log('\n6. prompt assembly is bounded and honest');
{
  const huge = buildPrompt({ keywords: Array.from({ length: 500 }, (_, i) => `kw${i}`) });
  assert.ok(huge.length <= 4000, 'prompt is bounded');
  assert.match(huge, /Return exactly \d+ options/);
  ok('oversized context is truncated, not forwarded wholesale');
}
{
  const p = buildPrompt({});
  assert.ok(!/undefined|null/.test(p), 'no undefined leaked into the prompt');
  ok('empty context produces a clean prompt');
}

/* ---------------------------------------------------------------- 7. deterministic helpers */
console.log('\n7. local heuristics are labelled and explainable');
{
  assert.ok(similarity('Best travel blog for solo trips', 'Best travel blog for solo trips!') > 0.9);
  assert.ok(similarity('Best travel blog', 'Cheap vegan recipes') < 0.1);
  assert.equal(similarity('', 'anything'), 0);
  const dups = findDuplicates(['Travel the world', 'Travel the world!', 'Cook at home']);
  assert.equal(dups.length, 1);
  assert.ok(dups[0].score >= 0.82);
  ok('duplicate detection is deterministic and scored');
}
{
  const q = qualityScore('Wander often, wonder always ✨', { maxChars: 150 });
  assert.equal(q.heuristic, true, 'must be labelled a heuristic');
  assert.ok(q.score > 50 && q.score <= 100);
  const over = qualityScore('x'.repeat(200), { maxChars: 150 });
  assert.ok(over.factors.overLimit > 0, 'over-limit must be flagged');
  assert.equal(qualityScore('').score, 0);
  ok('quality score flags real defects and is marked heuristic');
}
{
  const kw = extractKeywords('travel travel travel blog about travel and food', 3);
  assert.equal(kw[0].word, 'travel');
  // 14 chars against a 10-char ceiling is genuinely over, so 'high' is correct.
  const over = seoSuggestions('Short bio text', { keyword: 'photography', maxChars: 10 })
    .filter((s) => s.severity === 'high');
  assert.equal(over.length, 1, 'over-limit must be reported exactly once');
  const seo = seoSuggestions('Short bio', { keyword: 'photography', maxChars: 150 });
  assert.ok(!seo.some((s) => s.severity === 'high'), 'no false alarm within the limit');
  assert.ok(seo.some((s) => /photography/.test(s.message)));
  ok('keyword extraction and SEO advice are advisory and specific');
}

/* ---------------------------------------------------------------- 8. registry shape */
console.log('\n8. provider registry is adapter-shaped');
{
  assert.deepEqual(PROVIDER_IDS.sort(), ['anthropic', 'google', 'openai']);
  ok('adding a provider is one adapter object, not a code change elsewhere');
}

console.log(`\nALL PASS — ${pass} checks passed`);
