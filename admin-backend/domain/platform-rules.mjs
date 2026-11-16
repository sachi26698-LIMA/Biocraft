// Server-side platform bio limits, mirroring src/tools/platforms.ts.
//
// These are trusted server configuration, never request input. They are kept in
// one place so the browser bundle and the Admin gateway cannot drift silently;
// tests/platform-rules-sync.cjs fails if the two lists diverge.
export const PLATFORM_BIO_LIMITS = Object.freeze({
  instagram: 150,
  facebook: 101,
  threads: 150,
  tiktok: 80,
  x: 160,
  linkedin: 2600,
  whatsapp: 139,
  snapchat: 150,
});

export const PLATFORM_RULES = Object.freeze(
  Object.fromEntries(Object.entries(PLATFORM_BIO_LIMITS).map(([id, max]) => [id, Object.freeze({ count: 'unicode_code_points', max })])),
);
