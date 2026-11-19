/**
 * BioCraft — data licence registry. GENERATED, DO NOT EDIT.
 * 
 * Generated from each package's own declared licence and record count, so the
 * public disclosure and the shipped data cannot disagree.
 * 
 * Regenerate: node scripts/build-ecosystem-data.mjs
 * 
 * Allow-list is identical to scripts/import-library.mjs PERMISSIVE.
 */
export type LicenseEntry = {
  id: string; name: string; package: string; license: string; url: string;
  /** Records actually imported from this source. */
  records: number; file: string;
};

/** Every external dataset bundled with BioCraft, with its licence. */
export const LICENSE_REGISTRY: readonly LicenseEntry[] = [
  { id: "color-name-list", name: "Named colours", package: "color-name-list@14.86.0", license: "MIT", url: "https://github.com/meodai/color-names", records: 32004, file: "src/data/colors.ts" },
  { id: "unicode-emoji-json", name: "Emoji library", package: "unicode-emoji-json@0.9.0", license: "MIT", url: "https://github.com/mroth/emoji-data-json", records: 1914, file: "src/data/emoji.ts" },
  { id: "simple-icons", name: "Brand icons", package: "simple-icons@16.38.0", license: "CC0-1.0", url: "https://github.com/simple-icons/simple-icons", records: 3472, file: "src/tools/icons/data/simpleIcons.ts" },
  { id: "google-font-metadata", name: "Font families", package: "google-font-metadata@6.0.8", license: "MIT", url: "https://github.com/googlefonts/google-font-metadata", records: 1908, file: "src/lib/fontCatalog.ts" },
];

/**
 * Deliberately excluded from the product. Recorded here so the exclusion is
 * auditable: share-alike, non-commercial and copyleft licences change the
 * obligations of the whole application, so they are never bundled.
 */
export const EXCLUDED_LICENSES = ['CC-BY-SA-4.0', 'CC-BY-NC-4.0', 'GPL-3.0', 'AGPL-3.0', 'MPL-2.0'] as const;

/**
 * Record counts keyed by library, for copy that needs a number but not the
 * payload. Importing this costs a few hundred bytes; importing src/data/colors
 * would pull in 960 KB. Pages that only print a count must use this.
 */
export const LIBRARY_COUNTS = {
  colours: 32004,
  emoji: 1914,
  icons: 3472,
  fonts: 1908,
} as const;

/** Only these licences may be bundled. Used by tests/library-provenance checks. */
export const ALLOWED_LICENSES = ["Apache-2.0","BSD-3-Clause","CC-BY-3.0","CC-BY-4.0","CC0-1.0","ISC","MIT","OFL-1.1","Unlicense"] as const;
