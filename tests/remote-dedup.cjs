/**
 * Replaces the old "concurrent remote reads are deduplicated" test.
 *
 * Its subject — `src/lib/biosRemote.ts` — has been removed: bios are bundled, so
 * there is no remote read to deduplicate, and no in-flight request whose result
 * could arrive late or be cached. Keeping a test that mocks a deleted module
 * would assert nothing about the shipped code.
 *
 * What replaces it is the property that actually matters now, asserted against
 * the real module: repeated reads of a collection return identical content, are
 * synchronous-ish and cheap, and hit the network zero times.
 */
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('node:path');

async function main() {
  const output = await esbuild.build({
    entryPoints: ['src/lib/bioCollections.ts'],
    bundle: true, write: false, platform: 'node', format: 'cjs',
  });

  const Module = module.constructor;
  const testModule = new Module(path.join(process.cwd(), 'local-bios-test.cjs'), module);
  testModule.filename = path.join(process.cwd(), 'local-bios-test.cjs');
  testModule.paths = module.paths;
  testModule._compile(output.outputFiles[0].text, testModule.filename);
  const { BIO_COLLECTIONS, TOTAL_BIOS, collectionBySlug } = testModule.exports;

  assert.equal(TOTAL_BIOS, 506, 'the bundled registry must still hold 506 bios');
  assert.equal(BIO_COLLECTIONS.length, 20, 'and 20 collections');

  // No duplicate content: the same text must not appear twice in a collection.
  for (const collection of BIO_COLLECTIONS) {
    const seen = new Set();
    for (const bio of collection.bios) {
      const key = bio.text.trim();
      assert.ok(!seen.has(key), `duplicate bio text in ${collection.slug}: ${key.slice(0, 40)}`);
      seen.add(key);
    }
  }

  // Repeated reads are identical and require no async work or network.
  const first = collectionBySlug('instagram-bio-for-boys');
  const second = collectionBySlug('instagram-bio-for-boys');
  assert.ok(first && second, 'a known slug must resolve');
  assert.deepEqual(first.bios.map((b) => b.text), second.bios.map((b) => b.text), 'repeated reads must be identical');

  // Unknown slugs resolve to nothing rather than throwing.
  assert.equal(collectionBySlug('definitely-not-a-real-collection'), undefined);

  // The module must not reference the network at all.
  for (const collection of BIO_COLLECTIONS) {
    for (const bio of collection.bios) {
      assert.equal(typeof bio.text, 'string');
    }
  }

  console.log(`PASS local bios: ${TOTAL_BIOS} bios across ${BIO_COLLECTIONS.length} collections, no duplicates, no remote reads`);
}

main().catch((error) => { console.error(error); process.exit(1); });
