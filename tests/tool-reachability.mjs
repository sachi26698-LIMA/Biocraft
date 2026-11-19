/**
 * Every registered tool must be reachable from every platform.
 *
 * Why this exists: `ToolWorkspace` renders the platform's FIRST tool whenever the
 * current route's tool is not in that platform's `tools` list, and it keeps the
 * URL unchanged. That fallback is reasonable for a tool that genuinely belongs
 * to one platform (the Snapchat caption tool on Instagram), but it is silent —
 * so three platform-neutral tools (colour palette, icon finder, text toolkit)
 * shipped in the registry without being added to a single platform list. Their
 * routes returned HTTP 200, set the correct <title>, and then rendered the bio
 * generator. Production showed exactly that at /icon-finder,
 * /color-palette-generator and /text-toolkit.
 *
 * This test fails the build instead of letting a tool exist in the registry and
 * be unreachable in the UI. It needs no browser and no bundler, so it runs in
 * every environment including this one.
 */
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

let pass = 0, fail = 0;
const ok = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  PASS  ${name}`); }
  else { fail++; console.log(`  FAIL  ${name}${extra ? ' — ' + extra : ''}`); }
};
const section = (t) => console.log(`\n${t}`);

const platformsSrc = readFileSync('src/tools/platforms.ts', 'utf8');
const registrySrc = readFileSync('src/tools/registry.ts', 'utf8');

/** Platform id -> tools it lists. */
const platforms = [...platformsSrc.matchAll(/id: '([a-z]+)'[\s\S]*?tools: \[([^\]]*)\]/g)]
  .map((m) => ({
    id: m[1],
    tools: [...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1]),
  }));

/** Tool key -> route path, in registry order. */
const tools = [...registrySrc.matchAll(/key: '([^']+)'[\s\S]*?path: '([^']+)'/g)]
  .map((m) => ({ key: m[1], path: m[2] }));

section('1. the registries parse');
{
  // Counts are NOT hardcoded to 8 and 15. A literal here would fail the day a
  // tool is legitimately added — and "a new tool was added" is precisely the
  // event that caused the bug this file guards. Instead: assert the parse is
  // non-empty, and cross-check it against a second, independent signal (the
  // ToolKey union in registry.ts) so a silently broken regex cannot pass.
  const unionKeys = [...registrySrc.matchAll(/^\s*\| '([a-z-]+)'/gm)].map((m) => m[1]);
  ok('found at least one platform', platforms.length > 0, `got ${platforms.length}`);
  ok('found at least one tool', tools.length > 0, `got ${tools.length}`);
  ok('the ToolKey union parses too (independent of the key: entries)', unionKeys.length > 0,
    `got ${unionKeys.length}`);
  ok('registry keys and the ToolKey union agree',
    unionKeys.length === tools.length && unionKeys.every((k) => tools.some((t) => t.key === k)),
    `union ${unionKeys.length} vs entries ${tools.length}`);
  ok('every platform lists at least one tool', platforms.every((p) => p.tools.length > 0));
}

section('1b. no platform lists a tool that does not exist');
{
  // A dangling key would also fall back silently to `bio`, with no route of its
  // own — the same symptom, a different cause.
  const known = new Set(tools.map((t) => t.key));
  const dangling = [];
  for (const p of platforms) for (const k of p.tools) if (!known.has(k)) dangling.push(`${p.id}:${k}`);
  ok('every listed tool key exists in the registry', dangling.length === 0, dangling.join(', '));
}

section('2. no registered tool is unreachable');
{
  const listed = new Set(platforms.flatMap((p) => p.tools));
  const unreachable = tools.filter((t) => !listed.has(t.key));
  ok(
    'every tool appears in at least one platform',
    unreachable.length === 0,
    unreachable.map((t) => `${t.key} (${t.path})`).join(', '),
  );
}

section('3. platform-neutral tools reach every platform');
{
  // These produce output that has nothing to do with a social platform, so the
  // fallback is never a correct answer for them: a visitor on any platform who
  // opens the route must get the actual tool.
  const NEUTRAL = ['palette', 'icons', 'text-toolkit'];
  for (const key of NEUTRAL) {
    const missing = platforms.filter((p) => !p.tools.includes(key)).map((p) => p.id);
    ok(`${key} is available on all 8 platforms`, missing.length === 0, `missing on: ${missing.join(', ')}`);
  }
}

section('4. platform-specific tools stay scoped');
{
  // The honest counter-case: a tool bound to one platform must NOT be sprayed
  // across all platforms. If this starts failing, the fix above was over-applied.
  const BY_PLATFORM = {
    'snapchat-caption': 'snapchat',
    'whatsapp-status': 'whatsapp',
    'linkedin-summary': 'linkedin',
  };
  for (const [key, platformId] of Object.entries(BY_PLATFORM)) {
    const owners = platforms.filter((p) => p.tools.includes(key)).map((p) => p.id);
    ok(`${key} appears only on ${platformId}`, owners.length === 1 && owners[0] === platformId,
      `appears on: ${owners.join(', ') || 'nothing'}`);
  }
}

section('5. the fallback can no longer fire for a neutral tool');
{
  // Mirror ToolWorkspace's actual logic: effective = listed ? route : first.
  // For each neutral tool, on each platform, assert the effective tool is
  // the route's own tool rather than the platform default.
  const NEUTRAL = ['palette', 'icons', 'text-toolkit'];
  let wrong = [];
  for (const p of platforms) {
    for (const key of NEUTRAL) {
      const effective = p.tools.includes(key) ? key : p.tools[0];
      if (effective !== key) wrong.push(`${p.id}:${key} -> ${effective}`);
    }
  }
  ok('ToolWorkspace resolves neutral routes to themselves on every platform', wrong.length === 0, wrong.join(', '));
}

console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} ${pass} assertions — every registered tool is reachable`);
process.exit(fail === 0 ? 0 : 1);
