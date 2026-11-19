#!/usr/bin/env node
/**
 * Deployment record — what is actually on the live site, checked over HTTP.
 *
 * This exists because a merged commit is not a deployment. Production has been
 * behind main before, and the only way to know which commit is live is to look
 * for something that exists in exactly one of them.
 *
 * The marker is the tool-reachability fix merged in PR #28: /icon-finder renders
 * the icon finder instead of the bio generator once that fix is deployed.
 *
 * Usage: node scripts/verify-deployment.mjs [baseUrl]
 * Exit: 0 if the marker was found, 1 otherwise. Never claims more than it saw.
 */
const BASE = process.argv[2] || process.env.BIOCRAFT_BASE_URL || 'https://biocraft-bice.vercel.app';

/** Routes whose rendered content distinguishes the fix from its absence. */
const PROBES = [
  { path: '/icon-finder', label: 'Icon Finder', absent: 'Icon Finder — 3,472' },
  { path: '/color-palette-generator', label: 'Colour Palette', absent: 'Colour Palette Generator' },
  { path: '/text-toolkit', label: 'Text Toolkit', absent: 'Text Toolkit' },
];

async function get(path) {
  const res = await fetch(BASE + path, { headers: { 'user-agent': 'biocraft-deploy-check' } });
  return { status: res.status, body: await res.text() };
}

/** The app is client-rendered, so match on either SSR output or the JS bundle. */
async function bundleHas(marker) {
  const { body } = await get('/');
  const scripts = [...body.matchAll(/src="([^"]+\.js)"/g)].map((m) => m[1]);
  for (const src of scripts.slice(0, 6)) {
    const url = src.startsWith('http') ? src : BASE + src;
    try {
      const r = await fetch(url);
      if ((await r.text()).includes(marker)) return src;
    } catch { /* keep looking */ }
  }
  return null;
}

// Fail with a clear verdict when this sandbox blocks outbound HTTPS, instead of
// throwing a TLS stack trace that looks like a site outage.
try {
  await get('/');
} catch (err) {
  console.error(`\n  NETWORK BLOCKED: cannot reach ${BASE} from this environment (${err.code || err.message}).`);
  console.error('  This script needs outbound HTTPS. Run it where the network allows, e.g. GitHub Actions or locally.\n');
  process.exit(2);
}

const results = [];
for (const probe of PROBES) {
  const { status, body } = await get(probe.path);
  // A tool that is correctly wired renders its own heading and no bio form.
  const rendersBioForm = /Generate 5 bios/.test(body) && !/icons?\b/i.test(body.slice(0, 4000));
  results.push({ ...probe, status, rendersBioForm, decisive: status === 200 && !rendersBioForm });
}

console.log(`\nDeployment check — ${BASE}\n`);
for (const r of results) {
  console.log(`  ${r.status}  ${r.path.padEnd(28)} ${r.decisive ? 'own tool renders' : 'FALLS BACK TO BIO GENERATOR'}`);
}

const fixed = results.filter((r) => r.decisive).length;
console.log(`\n  tools wired correctly on production: ${fixed}/${results.length}`);

// Ask the JS bundle directly for the marker, so the verdict does not rest on
// whether a client-rendered page happened to serialise its own text.
const marker = await bundleHas('text-toolkit');
console.log(`  marker "text-toolkit" in served bundle: ${marker ? 'present (' + marker + ')' : 'ABSENT'}`);

const deployed = fixed === results.length || Boolean(marker);
console.log(`\n${deployed
  ? 'RESULT: the PR #28 tool-routing fix IS deployed to production.'
  : 'RESULT: production still runs code from BEFORE the tool-routing fix.'}`);
console.log(deployed
  ? ''
  : '        The fix is merged to main but not live. A deployment step is required.\n');
process.exit(deployed ? 0 : 1);
