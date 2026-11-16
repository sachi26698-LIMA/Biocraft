// Pure content validation. Not authentication, authorization, a persistence API,
// or a publication adapter. Call only with trusted, versioned platform rules.
const ALLOWED = new Set(['content', 'language', 'platform', 'active', 'featured']);
const LANGUAGES = new Set(['en', 'hi', 'hg']);
export class ValidationError extends Error {
  constructor(field, code) { super(`${field}: ${code}`); this.name = 'ValidationError'; this.field = field; this.code = code; }
}
/** Validate and normalize a plain-text bio. Counting rules must be supplied by
 * the server from reviewed platform configuration; an unknown rule fails closed. */
export function validateBio(input, rules) {
  if (input === null || typeof input !== 'object' || Array.isArray(input) || Object.getPrototypeOf(input) !== Object.prototype)
    throw new ValidationError('bio', 'invalid_object');
  for (const key of Object.keys(input)) if (!ALLOWED.has(key)) throw new ValidationError(key, 'unknown_field');
  if (typeof input.content !== 'string') throw new ValidationError('content', 'required');
  const content = input.content.normalize('NFC');
  if (!content.trim()) throw new ValidationError('content', 'required');
  // Reject control characters except newline, carriage return and tab.
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(content)) throw new ValidationError('content', 'control_character');
  if (new TextEncoder().encode(content).length > 12000) throw new ValidationError('content', 'too_many_bytes');
  if (typeof input.language !== 'string' || !LANGUAGES.has(input.language)) throw new ValidationError('language', 'unsupported');
  if (typeof input.platform !== 'string' || !/^[a-z][a-z0-9_-]{0,49}$/.test(input.platform)) throw new ValidationError('platform', 'invalid');
  if (!rules || !Object.hasOwn(rules, input.platform)) throw new ValidationError('platform', 'unsupported');
  const rule = rules[input.platform];
  if (!rule || !Number.isSafeInteger(rule.max) || rule.max < 1 || rule.max > 12000 || !['unicode_code_points', 'utf16_code_units'].includes(rule.count))
    throw new ValidationError('platform', 'invalid_rule');
  const count = rule.count === 'unicode_code_points' ? Array.from(content).length : content.length;
  if (count > rule.max) throw new ValidationError('content', 'platform_limit');
  if (typeof input.active !== 'boolean' || typeof input.featured !== 'boolean') throw new ValidationError('flags', 'invalid');
  return Object.freeze({ content, language: input.language, platform: input.platform, active: input.active, featured: input.featured, count });
}
/** Comparison hint only; never use normalized matches for automatic deletion. */
export function duplicateKey(content) {
  if (typeof content !== 'string') throw new ValidationError('content', 'required');
  return content.normalize('NFC').trim().replace(/\s+/gu, ' ').toLowerCase();
}
