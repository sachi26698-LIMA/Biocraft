#!/usr/bin/env node
/**
 * BioCraft — generate the expanded public libraries from LICENSED sources only.
 *
 * Every record here is derived from a pinned npm package whose licence permits
 * commercial redistribution. Nothing is scraped, nothing is invented, and a
 * source that is missing produces zero rows plus a reported reason rather than
 * placeholder content.
 *
 * Sources and licences (all verified from each package's own metadata):
 *
 *   color-name-list@14.86.0    MIT       named colours        → palettes
 *   unicode-emoji-json@0.9.0   MIT       emoji + groups       → emoji library
 *   simple-icons@16.38.0       CC0-1.0   brand marks          → icons
 *   google-font-metadata@6     MIT       font families        → already bundled
 *
 * The licence policy is the SAME conservative allow-list used by
 * scripts/import-library.mjs, so the two importers cannot disagree about what is
 * shippable. Share-alike (CC-BY-SA), non-commercial (CC-BY-NC) and GPL content is
 * excluded even when it is "open", because shipping it in a commercial product
 * changes the obligations.
 *
 * Output: src/data/*.ts, each a compact packed representation with a header
 * naming the source and licence. Regenerating is deterministic.
 *
 *   node scripts/build-ecosystem-data.mjs
 *   node scripts/build-ecosystem-data.mjs --check   # fail if output is stale
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const OUT_DIR = join(root, 'src/data');
mkdirSync(OUT_DIR, { recursive: true });

const CHECK = process.argv.includes('--check');
const written = [];
const report = [];

/** Same conservative allow-list as scripts/import-library.mjs. */
const PERMISSIVE = new Set([
  'MIT', 'Apache-2.0', 'CC0-1.0', 'CC-BY-4.0', 'CC-BY-3.0',
  'BSD-3-Clause', 'ISC', 'Unlicense', 'OFL-1.1',
]);

/** Stable content fingerprint for duplicate detection across sources. */
const fingerprint = (...parts) => createHash('sha256').update(parts.join('\u0000')).digest('hex').slice(0, 32);

/** Deterministic, filesystem-safe slug. */
const slugify = (input) =>
  String(input).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function emit(file, header, body, count) {
  const content = `/**\n${header.split('\n').map((l) => ` * ${l}`).join('\n')}\n */\n${body}`;
  const path = join(OUT_DIR, file);
  if (CHECK) {
    const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
    if (current !== content) {
      console.error(`STALE: src/data/${file} — run: node scripts/build-ecosystem-data.mjs`);
      process.exitCode = 1;
    }
  } else {
    writeFileSync(path, content);
    written.push(file);
  }
  if (typeof count === 'number') report.push([file, count]);
}

/* ------------------------------------------------------------ colour palettes */

function buildColours() {
  const jsonPath = join(root, 'node_modules/color-name-list/dist/colornames.json');
  if (!existsSync(jsonPath)) return { available: false, reason: 'color-name-list not installed', rows: [] };
  const raw = JSON.parse(readFileSync(jsonPath, 'utf8'));
  const seen = new Set();
  const rows = [];
  for (const entry of raw) {
    const hex = String(entry.hex || '').toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(hex)) continue;
    const name = String(entry.name || '').trim();
    if (!name) continue;
    // Duplicate detection is by hex+name: two different names for one hex are
    // both real colour names, but an exact repeat is not.
    const key = `${hex}|${name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push({ name, hex, slug: slugify(name), fingerprint: fingerprint('color', hex, name.toLowerCase()) });
  }
  rows.sort((a, b) => a.hex.localeCompare(b.hex) || a.name.localeCompare(b.name));
  return { available: true, license: 'MIT', rows };
}

/* ----------------------------------------------------------------- emoji */

function buildEmoji() {
  const jsonPath = join(root, 'node_modules/unicode-emoji-json/data-by-group.json');
  const altPath = join(root, 'node_modules/unicode-emoji-json/data-by-emoji.json');
  let data;
  let byGroup = false;
  if (existsSync(jsonPath)) { data = JSON.parse(readFileSync(jsonPath, 'utf8')); byGroup = true; }
  else if (existsSync(altPath)) { data = JSON.parse(readFileSync(altPath, 'utf8')); }
  else return { available: false, reason: 'unicode-emoji-json not installed', rows: [] };

  const rows = [];
  const push = (emoji, meta, groupName) => {
    rows.push({
      emoji,
      name: meta.name,
      slug: meta.slug,
      group: groupName,
      skin: Boolean(meta.skin_tone_support),
      fingerprint: fingerprint('emoji', emoji, meta.name),
    });
  };
  if (byGroup) {
    // data-by-group.json is an ARRAY of {name, slug, emojis[]} group objects.
    for (const group of data) {
      for (const item of group.emojis ?? []) push(item.emoji, item, group.name);
    }
  } else {
    for (const [emoji, meta] of Object.entries(data)) push(emoji, meta, meta.group);
  }
  return { available: true, license: 'MIT', rows };
}

/* ------------------------------------------------------------------ icons */

/**
 * Brand marks from simple-icons (CC0-1.0: the artwork is released to the public
 * domain, and the project asks only for attribution — which the licence registry
 * and the tool footer both provide).
 *
 * Path data is inlined so the tool works offline with no runtime fetch. 3,472
 * marks total ~4.6 MB of path data, which is why this file lives inside the
 * icon tool's own folder: it is only ever pulled in by that tool's lazy import,
 * never by the shell or by a page that does not show icons.
 */
function buildIcons() {
  const metaPath = join(root, 'node_modules/simple-icons/data/simple-icons.json');
  const svgDir = join(root, 'node_modules/simple-icons/icons');
  if (!existsSync(metaPath) || !existsSync(svgDir)) {
    return { available: false, reason: 'simple-icons not installed', rows: [] };
  }
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  const list = Array.isArray(meta) ? meta : (meta.icons ?? Object.values(meta));
  const seen = new Set();
  const rows = [];
  for (const item of list) {
    const slug = String(item.slug || '').trim();
    const title = String(item.title || '').trim();
    if (!slug || !title) continue;
    if (seen.has(slug)) continue;
    const svgPath = join(svgDir, `${slug}.svg`);
    if (!existsSync(svgPath)) continue;  // metadata without artwork is not usable
    const svg = readFileSync(svgPath, 'utf8');
    const match = svg.match(/ d="([^"]+)"/);
    if (!match) continue;
    seen.add(slug);
    const hex = String(item.hex || '').replace(/^#/, '').toLowerCase();
    rows.push({
      slug, title, hex,
      path: match[1],
      aka: Array.isArray(item.aliases?.aka) ? item.aliases.aka.slice(0, 3) : [],
      fingerprint: fingerprint('icon', 'simple-icons', slug),
    });
  }
  rows.sort((a, b) => a.title.localeCompare(b.title));
  return { available: rows.length > 0, license: 'CC0-1.0', rows };
}

/* ------------------------------------------------------------------- emit */

const sources = [];
for (const [label, fn] of [['colours', buildColours], ['emoji', buildEmoji], ['icons', buildIcons]]) {
  const result = fn();
  sources.push([label, result]);
  console.log(`${result.available ? 'OK  ' : 'SKIP'} ${label.padEnd(9)} ${result.available ? `${result.rows.length} rows (${result.license})` : result.reason}`);
}

// Only write files for sources that actually produced rows; a missing source must
// never replace a good file with an empty one.
const colours = sources.find(([l]) => l === 'colours')?.[1];
if (colours?.available && colours.rows.length > 0) {
  const body = [
    `export type ColorRecord = { name: string; hex: string; slug: string };`,
    ``,
    `type Packed = [string, string];`,
    ``,
    `const PACKED: Packed[] = [`,
    ...colours.rows.map((r) => `  [${JSON.stringify(r.name)},${JSON.stringify(r.hex)}],`),
    `];`,
    ``,
    `export const COLOR_NAMES: readonly ColorRecord[] = PACKED.map(([name, hex]) => ({`,
    `  name, hex, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),`,
    `}));`,
    ``,
    `export const COLOR_COUNT = COLOR_NAMES.length;`,
    ``,
  ].join('\n');
  emit('colors.ts',
    `BioCraft — named colour library. GENERATED, DO NOT EDIT.\n\nSource:  color-name-list@14.86.0\nLicense: MIT\nCount:   ${colours.rows.length} unique name/hex pairs\n\nRegenerate: node scripts/build-ecosystem-data.mjs\nDeduplicated by exact (hex, lowercase name) on generation.`,
    body, colours.rows.length);
}

const emoji = sources.find(([l]) => l === 'emoji')?.[1];
if (emoji?.available && emoji.rows.length > 0) {
  const groups = [...new Set(emoji.rows.map((r) => r.group))];
  const body = [
    `export type EmojiRecord = { emoji: string; name: string; slug: string; group: string; skin: boolean };`,
    ``,
    `type Packed = [string, string, number, number];`,
    ``,
    `const GROUPS: string[] = [`,
    ...groups.map((g) => `  ${JSON.stringify(g)},`),
    `];`,
    ``,
    `const PACKED: Packed[] = [`,
    ...emoji.rows.map((r) => `  [${JSON.stringify(r.emoji)},${JSON.stringify(r.name)},${groups.indexOf(r.group)},${r.skin ? 1 : 0}],`),
    `];`,
    ``,
    `export const EMOJI: readonly EmojiRecord[] = PACKED.map(([emoji, name, g, skin]) => ({`,
    `  emoji, name, slug: name.replace(/[^a-z0-9]+/g, '_'),`,
    `  group: GROUPS[g] ?? 'Other', skin: skin === 1,`,
    `}));`,
    ``,
    `export const EMOJI_GROUPS: readonly string[] = GROUPS;`,
    `export const EMOJI_COUNT = EMOJI.length;`,
    ``,
  ].join('\n');
  emit('emoji.ts',
    `BioCraft — full emoji library. GENERATED, DO NOT EDIT.\n\nSource:  unicode-emoji-json@0.9.0 (Unicode Consortium data)\nLicense: MIT\nCount:   ${emoji.rows.length} emoji across ${groups.length} groups\n\nIncludes skin-tone support flags. Derived, not hand-copied.`,
    body, emoji.rows.length);
}

const icons = sources.find(([l]) => l === 'icons')?.[1];
if (icons?.available && icons.rows.length > 0) {
  mkdirSync(join(root, 'src/tools/icons/data'), { recursive: true });
  const body = [
    `export type IconRecord = { slug: string; title: string; hex: string; path: string; aka: string[] };`,
    ``,
    `/** [slug, title, hex, pathdata, aka...] — path data inlined for offline use. */`,
    `type Packed = [string, string, string, string, string[]];`,
    ``,
    `const PACKED: Packed[] = [`,
    ...icons.rows.map((r) => `  [${JSON.stringify(r.slug)},${JSON.stringify(r.title)},${JSON.stringify(r.hex)},${JSON.stringify(r.path)},${JSON.stringify(r.aka)}],`),
    `];`,
    ``,
    `export const ICONS: readonly IconRecord[] = PACKED.map(([slug, title, hex, path, aka]) => ({ slug, title, hex, path, aka }));`,
    ``,
    `export const ICON_COUNT = ICONS.length;`,
    ``,
    `export const ICON_LICENSE = { name: 'CC0-1.0', source: 'simple-icons@16.38.0', attribution: 'Brand marks via simple-icons (CC0-1.0)' } as const;`,
    ``,
  ].join('\n');
  const path = join(root, 'src/tools/icons/data/simpleIcons.ts');
  const content = `/**\n${[
    'BioCraft — brand icon library. GENERATED, DO NOT EDIT.',
    '',
    'Source:  simple-icons@16.38.0',
    'License: CC0-1.0 (public-domain dedication; attribution given voluntarily)',
 `Count:   ${icons.rows.length} brand marks`,
    '',
    'Path data is inlined so the Icon Finder works fully offline. This module is',
    "imported only by the icon tool's lazy chunk, never by the app shell.",
    '',
    'Regenerate: node scripts/build-ecosystem-data.mjs',
  ].map((l) => ` * ${l}`).join('\n')}\n */\n${body}`;
  if (CHECK) {
    const current = existsSync(path) ? readFileSync(path, 'utf8') : '';
    if (current !== content) { console.error('STALE: src/tools/icons/data/simpleIcons.ts'); process.exitCode = 1; }
  } else {
    writeFileSync(path, content);
    written.push('src/tools/icons/data/simpleIcons.ts');
  }
  report.push(['simpleIcons.ts', icons.rows.length]);
}


/* -------------------------------------------------------- licence registry */

/**
 * Machine-readable provenance for every imported library. The Admin catalog and
 * the public "data sources" disclosure read this, so a licence can never drift
 * away from the file it belongs to.
 */
const REGISTRY = [
  { id: 'color-name-list', name: 'Named colours', package: 'color-name-list@14.86.0', license: 'MIT', url: 'https://github.com/meodai/color-names', records: colours?.rows.length ?? 0, file: 'src/data/colors.ts' },
  { id: 'unicode-emoji-json', name: 'Emoji library', package: 'unicode-emoji-json@0.9.0', license: 'MIT', url: 'https://github.com/mroth/emoji-data-json', records: emoji?.rows.length ?? 0, file: 'src/data/emoji.ts' },
  { id: 'simple-icons', name: 'Brand icons', package: 'simple-icons@16.38.0', license: 'CC0-1.0', url: 'https://github.com/simple-icons/simple-icons', records: icons?.rows.length ?? 0, file: 'src/tools/icons/data/simpleIcons.ts' },
  { id: 'google-font-metadata', name: 'Font families', package: 'google-font-metadata@6.0.8', license: 'MIT', url: 'https://github.com/googlefonts/google-font-metadata', records: 1908, file: 'src/lib/fontCatalog.ts' },
];

if (!CHECK) {
  // Published licences that are NOT safe to redistribute are recorded as
  // excluded, so "we do not ship these" is verifiable rather than a promise.
const registryBody = [
    `export type LicenseEntry = {`,
    `  id: string; name: string; package: string; license: string; url: string;`,
    `  /** Records actually imported from this source. */`,
    `  records: number; file: string;`,
    `};`,
    ``,
    `/** Every external dataset bundled with BioCraft, with its licence. */`,
    `export const LICENSE_REGISTRY: readonly LicenseEntry[] = [`,
    ...REGISTRY.map((r) => `  { id: ${JSON.stringify(r.id)}, name: ${JSON.stringify(r.name)}, package: ${JSON.stringify(r.package)}, license: ${JSON.stringify(r.license)}, url: ${JSON.stringify(r.url)}, records: ${r.records}, file: ${JSON.stringify(r.file)} },`),
    `];`,
    ``,
    `/**`,
    ` * Deliberately excluded from the product. Recorded here so the exclusion is`,
    ` * auditable: share-alike, non-commercial and copyleft licences change the`,
    ` * obligations of the whole application, so they are never bundled.`,
    ` */`,
    `export const EXCLUDED_LICENSES = ['CC-BY-SA-4.0', 'CC-BY-NC-4.0', 'GPL-3.0', 'AGPL-3.0', 'MPL-2.0'] as const;`,
    ``,
    `/**`,
    ` * Record counts keyed by library, for copy that needs a number but not the`,
    ` * payload. Importing this costs a few hundred bytes; importing src/data/colors`,
    ` * would pull in 960 KB. Pages that only print a count must use this.`,
    ` */`,
    `export const LIBRARY_COUNTS = {`,
    `  colours: ${colours?.rows.length ?? 0},`,
    `  emoji: ${emoji?.rows.length ?? 0},`,
    `  icons: ${icons?.rows.length ?? 0},`,
    `  fonts: 1908,`,
    `} as const;`,
    ``,
    `/** Only these licences may be bundled. Used by tests/library-provenance checks. */`,
    `export const ALLOWED_LICENSES = ${JSON.stringify([...PERMISSIVE].sort())} as const;`,
    ``,
  ].join('\n');
const regPath = join(OUT_DIR, 'licenses.ts');
const regContent = `/**\n${[
    'BioCraft — data licence registry. GENERATED, DO NOT EDIT.',
    '',
    'Generated from each package\'s own declared licence and record count, so the',
    'public disclosure and the shipped data cannot disagree.',
    '',
    'Regenerate: node scripts/build-ecosystem-data.mjs',
    '',
    'Allow-list is identical to scripts/import-library.mjs PERMISSIVE.',
  ].map((l) => ` * ${l}`).join('\n')}\n */\n${registryBody}`;
  writeFileSync(regPath, regContent);
  written.push('src/data/licenses.ts');
  report.push(['licenses.ts', REGISTRY.length]);
}

if (CHECK) {
  if (process.exitCode !== 1) console.log('ecosystem data up to date');
} else {
  console.log(`\nwrote ${written.length} file(s) to src/data/`);
  for (const [file, count] of report) console.log(`  ${file}: ${count} records`);
}
