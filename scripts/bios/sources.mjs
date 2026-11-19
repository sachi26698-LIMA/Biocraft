/**
 * BioCraft — provenance register for the bio library.
 *
 * Every accepted record points at one of these. A source that is not listed
 * here cannot produce records: makeRecord() throws on an unknown id, so no
 * record can exist without a stated licence and reference.
 *
 * This file is the honest answer to "where did this content come from".
 * Adding a dataset here is a deliberate act with a licensing decision attached.
 */

export const SOURCES = [
  {
    id: 'biocraft-original',
    name: 'BioCraft original',
    license: 'ORIGINAL',
    attribution: 'None required — written for BioCraft.',
    reference: 'scripts/bios/content/*.mjs in this repository',
  },
];

export const SOURCE_MAP = new Map(SOURCES.map((source) => [source.id, source]));
