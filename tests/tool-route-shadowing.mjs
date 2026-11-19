/**
 * Every tool route must render its OWN tool.
 *
 * Why this exists: `ToolWorkspace` renders `toolForPath(path)`, but then does
 *
 *     const isAvailable = config.tools.includes(activeTool.key);
 *     const effectiveKey = isAvailable ? activeTool.key : config.tools[0];
 *
 * If a platform's `tools` array omits a tool key, the route does not 404 — it
 * silently renders that platform's first tool (the bio generator) under the
 * correct <title>. Production shipped exactly that bug: /color-palette-generator,
 * /icon-finder and /text-toolkit all rendered the Instagram bio form, because
 * those three keys were missing from every platform's tool list. Nothing failed;
 * the pages just showed the wrong tool.
 *
 * A unit test on the registry cannot catch this — PR #28 "fixed" it by adding
 * the keys to PLATFORMS, and the old expectation of exactly 8 tabs is what
 * rotted. So this test asserts the invariant that actually matters: for every
 * tool route, under every platform, the intersection is non-empty and resolves
 * to the route's own tool.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

let passed = 0;
let failed = 0;
function check(name, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

const registrySrc = readFileSync(resolve(root, 'src/tools/registry.ts'), 'utf8');
const platformsSrc = readFileSync(resolve(root, 'src/tools/platforms.ts'), 'utf8');

// ---- tool keys + paths straight out of the registry -------------------
const toolEntries = [...registrySrc.matchAll(/key:\s*'([^']+)',\s*\n\s*path:\s*'([^']+)'/g)].map(
  (m) => ({ key: m[1], path: m[2] }),
);
check('registry exposes tool keys and paths', toolEntries.length >= 15, `found ${toolEntries.length}`);

// ---- every platform's tools array -------------------------------------
const platformBlocks = [...platformsSrc.matchAll(/tools:\s*\[([^\]]*)\]/g)].map((m) =>
  [...m[1].matchAll(/'([^']+)'/g)].map((t) => t[1]),
);
check('platforms declare tool arrays', platformBlocks.length >= 8, `found ${platformBlocks.length}`);

const toolKeys = new Set(toolEntries.map((t) => t.key));

// A platform may only reference tools that exist. A typo here would silently
// fall back too, so catch the typo at the source.
const unknownRefs = new Set();
for (const tools of platformBlocks) {
  for (const key of tools) if (!toolKeys.has(key)) unknownRefs.add(key);
}
check(
  'no platform references an unknown tool key',
  unknownRefs.size === 0,
  [...unknownRefs].join(', '),
);

// THE invariant. A tool route is opened against whatever platform the visitor
// has selected, but the platform they land on by default is PLATFORMS[0]
// (Instagram). So the route must render its own tool on the default platform —
// that is precisely what broke: palette/icons/text-toolkit were absent from
// Instagram's list and rendered the bio form instead.
//
// Other platforms are allowed to omit a specialist tool (the LinkedIn tools
// genuinely do not belong on Instagram); visiting one explicitly falls back by
// design. Only the default landing platform must never shadow.
// toolkit.tsx can pin a route to a platform via DEFAULT_BY_PATH, so a cold visit
// lands on a platform where the tool is actually available (the LinkedIn and
// WhatsApp/Snapchat tools rely on this). Resolve the effective landing platform
// per route before judging whether it is shadowed.
const toolkitSrc = readFileSync(resolve(root, 'src/lib/toolkit.tsx'), 'utf8');
const defaultByPath = new Map(
  [...toolkitSrc.matchAll(/\['([^']+)',\s*'([^']+)'\]/g)].map((m) => [m[1], m[2]]),
);
const platformIds = [...platformsSrc.matchAll(/^\s*id:\s*'([^']+)'/gm)].map((m) => m[1]);
check('platform ids are parseable', platformIds.length === platformBlocks.length,
  `${platformIds.length} ids vs ${platformBlocks.length} tool arrays`);

const shadowed = [];
for (const { key, path } of toolEntries) {
  const pinned = defaultByPath.get(path) ?? platformIds[0];
  const idx = platformIds.indexOf(pinned);
  const tools = platformBlocks[idx >= 0 ? idx : 0];
  if (!tools.includes(key)) shadowed.push(`${path} -> ${tools[0]} (lands on ${pinned})`);
}
check(
  'no tool route is shadowed on the platform it lands on',
  shadowed.length === 0,
  shadowed.length ? `${shadowed.length} fallbacks: ${shadowed.join(', ')}` : '',
);

// Every tool must be reachable somewhere, or the route only ever 404s into a
// fallback and the tool is dead on arrival.
const unreachable = toolEntries
  .filter(({ key }) => !platformBlocks.some((tools) => tools.includes(key)))
  .map((t) => t.key);
check('every tool is available on at least one platform', unreachable.length === 0, unreachable.join(', '));

// Guards the specific historical regression so a revert is loud.
for (const key of ['palette', 'icons', 'text-toolkit']) {
  check(
    `platform-neutral tool "${key}" is available on all platforms`,
    platformBlocks.every((tools) => tools.includes(key)),
  );
}

// Every tool route must have a build shell, or the URL 404s before React runs.
const shells = readFileSync(resolve(root, 'scripts/build-shells.mjs'), 'utf8');
const missingShells = toolEntries.filter(({ path }) => !shells.includes(`'${path}'`)).map((t) => t.path);
check(
  'every tool route has a prerendered shell',
  missingShells.length === 0,
  missingShells.join(', '),
);

console.log(`\n${failed === 0 ? 'PASS' : 'FAIL'}  ${passed}/${passed + failed} tool-route assertion(s)`);
process.exit(failed === 0 ? 0 : 1);
