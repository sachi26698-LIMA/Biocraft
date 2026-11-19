#!/usr/bin/env node
/**
 * BioCraft — generate the bundled font catalogue from `google-font-metadata`.
 *
 * The public font library used to read this table from the database. It now
 * ships with the application, so the page needs no backend.
 *
 * Why this source and not an export of `public.fonts`: both are derived from the
 * same MIT-licensed package, but generating from the package keeps the pipeline
 * reproducible and avoids a hand-copied database dump drifting from its origin.
 * The row shape deliberately mirrors `adaptFonts()` in scripts/import-data.mjs so
 * the local file and the (retained, admin-owned) database agree by construction.
 *
 *   node scripts/build-font-catalog.mjs [--check]
 *
 * `--check` regenerates into memory and fails if the checked-in file is stale,
 * so CI can detect an edit that was made to the output instead of the source.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const OUT = join(root, 'src/lib/fontCatalog.ts');

/** Same derivation as adaptFonts() so the two sources cannot disagree. */
function rowsFrom(apiDirect) {
  return apiDirect
    .map((font) => {
      const variants = font.variants || [];
      const weights = [...new Set(variants
        .map((v) => (v.match(/^(\d{3})/)?.[1] ?? (v === 'regular' || v === 'italic' ? '400' : null)))
        .filter(Boolean))];
      const styles = [...new Set(variants.map((v) => (v.includes('italic') ? 'italic' : 'normal')))];
      return {
        slug: font.family.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        family: font.family,
        category: font.category || null,
        subsets: font.subsets || [],
        weights,
        styles,
        variable: variants.some((v) => v.includes('variable') || /\[/.test(v)),
      };
    })
    .filter((row) => row.slug)
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function render(rows) {
  // A compact, line-per-family representation: readable in a diff, cheap to
  // parse, and small enough (≈160 KB) to ship without a separate fetch.
  const lines = rows.map((r) => JSON.stringify([r.slug, r.family, r.category, r.weights, r.subsets, r.variable]));
  return `/**
 * BioCraft — bundled font catalogue. GENERATED FILE, DO NOT EDIT.
 *
 * Regenerate with:  node scripts/build-font-catalog.mjs
 * Source:           google-font-metadata (MIT)
 *
 * ${rows.length} families, each as [slug, family, category, weights, subsets, variable].
 * This replaces the database read in the public font library so the page works
 * with no backend at all.
 */
export type FontRecord = {
  slug: string;
  family: string;
  category: string | null;
  weights: readonly string[];
  subsets: readonly string[];
  variable: boolean;
};

type Packed = [string, string, string | null, string[], string[], boolean];

const PACKED: Packed[] = [
${lines.map((l) => `  ${l},`).join('\n')}
];

export const FONT_CATALOG: readonly FontRecord[] = PACKED.map(([slug, family, category, weights, subsets, variable]) => ({
  slug, family, category, weights, subsets, variable,
}));

export const FONT_CATALOG_SIZE = FONT_CATALOG.length;
`;
}

const mod = await import('google-font-metadata');
const apiDirect = mod.APIDirect ?? mod.default?.APIDirect;
if (!Array.isArray(apiDirect)) {
  console.error('google-font-metadata: APIDirect export shape changed; refusing to write an empty catalogue.');
  process.exit(1);
}

const rows = rowsFrom(apiDirect);
if (rows.length < 1000) {
  console.error(`Refusing to write: only ${rows.length} families derived, expected the full catalogue.`);
  process.exit(1);
}

const output = render(rows);

if (process.argv.includes('--check')) {
  const current = existsSync(OUT) ? readFileSync(OUT, 'utf8') : '';
  if (current !== output) {
    console.error('src/lib/fontCatalog.ts is stale. Run: node scripts/build-font-catalog.mjs');
    process.exit(1);
  }
  console.log(`font catalog up to date: ${rows.length} families`);
  process.exit(0);
}

writeFileSync(OUT, output);
console.log(`wrote ${OUT}: ${rows.length} families, ${output.length} bytes`);
