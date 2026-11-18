/**
 * BioCraft — provider-independent AI layer (server side).
 *
 * SECURITY: this module is server-only. It reads provider keys from the process
 * environment and must never be imported into anything that reaches the browser.
 * `src/` must not import it — asserted in tests/ai-engine.mjs.
 *
 * Design rules, in order of importance:
 *
 *  1. **No key, no call.** With no provider configured, `generate()` returns
 *     `available:false` with a plain reason. It never fabricates text and never
 *     pretends a model answered.
 *
 *  2. **Providers are adapters, not branches.** Each adapter declares how to build
 *     a request and how to read a reply. Adding a provider is one object, so the
 *     rest of the system does not change.
 *
 *  3. **A failure is a failure.** A timeout, a 429 or a malformed reply marks that
 *     provider as failed. Fallback only happens when *another* provider is
 *     configured, and the response says which provider actually answered. If
 *     none answers, the caller is told — it is not handed invented copy.
 *
 *  4. **Deterministic helpers are not AI.** Duplicate detection, quality scoring
 *     and keyword extraction are computed locally and labelled as such. They
 *     work with no provider and are never described as model output.
 *
 *  5. **Prompts are assembled from structured context**, so the same request
 *     produces comparable output regardless of provider.
 */

const DEFAULT_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 20000);
const MAX_PROMPT_CHARS = 4000;

/* --------------------------------------------------------------- provider adapters */

/**
 * Each adapter: id, label, requires (env var), build(request) -> fetch args,
 * parse(json) -> text, and optional listModels().
 */
const ADAPTERS = {
  openai: {
    label: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    modelEnv: 'OPENAI_MODEL',
    defaultModel: 'gpt-4o-mini',
    build({ apiKey, model, prompt, system, maxTokens, temperature }) {
      return {
        url: 'https://api.openai.com/v1/chat/completions',
        init: {
          method: 'POST',
          headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: prompt },
            ],
            max_tokens: maxTokens,
            temperature,
          }),
        },
      };
    },
    parse(json) {
      const text = json?.choices?.[0]?.message?.content;
      if (typeof text !== 'string' || !text.trim()) throw new Error('empty completion');
      return text.trim();
    },
  },

  anthropic: {
    label: 'Anthropic',
    envKey: 'ANTHROPIC_API_KEY',
    modelEnv: 'ANTHROPIC_MODEL',
    defaultModel: 'claude-3-5-haiku-latest',
    build({ apiKey, model, prompt, system, maxTokens, temperature }) {
      return {
        url: 'https://api.anthropic.com/v1/messages',
        init: {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model,
            system,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: maxTokens,
            temperature,
          }),
        },
      };
    },
    parse(json) {
      const parts = json?.content?.filter?.((c) => c?.type === 'text').map((c) => c.text) ?? [];
      const text = parts.join('').trim();
      if (!text) throw new Error('empty completion');
      return text;
    },
  },

  google: {
    label: 'Google Gemini',
    envKey: 'GEMINI_API_KEY',
    modelEnv: 'GEMINI_MODEL',
    defaultModel: 'gemini-2.0-flash',
    build({ apiKey, model, prompt, system, maxTokens, temperature }) {
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        init: {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: maxTokens, temperature },
          }),
        },
      };
    },
    parse(json) {
      const text = json?.candidates?.[0]?.content?.parts?.map((p) => p?.text ?? '').join('').trim();
      if (!text) throw new Error('empty completion');
      return text;
    },
  },
};

/** Which providers are configured right now. Names only — never key values. */
export function configuredProviders(env = process.env) {
  return Object.entries(ADAPTERS)
    .filter(([, a]) => typeof env[a.envKey] === 'string' && env[a.envKey].trim().length > 0)
    .map(([id, a]) => ({ id, label: a.label, model: env[a.modelEnv] || a.defaultModel }));
}

/* --------------------------------------------------------------- prompt assembly */

const TONE_HINTS = {
  professional: 'polished, concise, no slang, no exclamation marks',
  casual: 'relaxed and friendly, short sentences',
  funny: 'light humour without insults',
  inspirational: 'uplifting, concrete, not saccharine',
  bold: 'confident and direct',
  minimal: 'as few words as possible, no filler',
  romantic: 'warm and affectionate, tasteful',
};

const PLATFORM_HINTS = {
  instagram: 'Instagram bio: 150 characters maximum, line breaks allowed',
  tiktok: 'TikTok bio: 80 characters maximum',
  youtube: 'YouTube description: can be longer and descriptive',
  linkedin: 'LinkedIn headline: 220 characters maximum, professional register',
  x: 'X bio: 160 characters maximum',
  facebook: 'Facebook intro: 101 characters maximum',
  pinterest: 'Pinterest bio: 500 characters maximum',
  threads: 'Threads bio: 80 characters maximum',
};

/**
 * Build a provider-neutral prompt from structured context.
 * Every field is optional; omitted fields are simply absent from the prompt rather
 * than replaced with invented context.
 */
export function buildPrompt(ctx = {}) {
  const lines = [];
  const kind = ctx.kind || 'bio';
  lines.push(`Write ${kind === 'caption' ? 'social media captions' : kind === 'hashtag' ? 'hashtags' : 'social media bios'}.`);

  if (ctx.platform && PLATFORM_HINTS[ctx.platform]) lines.push(`Platform constraint: ${PLATFORM_HINTS[ctx.platform]}.`);
  if (ctx.tone && TONE_HINTS[ctx.tone]) lines.push(`Tone: ${TONE_HINTS[ctx.tone]}.`);
  if (ctx.language) lines.push(`Write in ${ctx.language}. Do not translate into English.`);
  if (ctx.category) lines.push(`Niche: ${ctx.category}.`);
  if (Array.isArray(ctx.keywords) && ctx.keywords.length) {
    lines.push(`Incorporate these keywords naturally: ${ctx.keywords.slice(0, 12).join(', ')}.`);
  }
  if (ctx.audience) lines.push(`Audience: ${ctx.audience}.`);

  const count = Number.isSafeInteger(ctx.count) && ctx.count > 0 ? ctx.count : 5;
  lines.push(`Return exactly ${count} options, one per line, no numbering, no commentary.`);
  lines.push('Do not use quotation marks around the options.');

  const prompt = lines.join('\n');
  // Bound the prompt so a caller cannot send an unbounded document.
  return prompt.length > MAX_PROMPT_CHARS ? prompt.slice(0, MAX_PROMPT_CHARS) : prompt;
}

const SYSTEM_PROMPT =
  'You are a social media copywriter for BioCraft. You return only the requested options, ' +
  'one per line, with no preamble, numbering or quotation marks. You never invent facts about ' +
  'the person or brand, and you respect the platform character limit.';

/* --------------------------------------------------------------- generation */

async function callProvider({ id, adapter, env, prompt, maxTokens, temperature, fetchImpl, timeoutMs }) {
  const apiKey = env[adapter.envKey];
  const model = env[adapter.modelEnv] || adapter.defaultModel;
  const { url, init } = adapter.build({
    apiKey, model, prompt, system: SYSTEM_PROMPT, maxTokens, temperature,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res;
  try {
    res = await fetchImpl(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    // Read a bounded slice of the error body for the operator; never echo a key.
    let detail = '';
    try { detail = (await res.text()).slice(0, 200); } catch { /* ignore */ }
    const err = new Error(`${adapter.label} returned HTTP ${res.status}${detail ? `: ${detail}` : ''}`);
    err.code = res.status === 429 ? 'RATE_LIMITED' : 'PROVIDER_ERROR';
    throw err;
  }

  const json = await res.json();
  return { text: adapter.parse(json), provider: id, model };
}

/**
 * Generate options from the first provider that answers.
 *
 * Returns a discriminated result so callers cannot accidentally treat a failure as
 * success:
 *   { available:true,  provider, model, options:[...], attempts:[...] }
 *   { available:false, reason, message, attempts:[...] }
 */
export async function generate(ctx = {}, options = {}) {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxTokens = options.maxTokens ?? 400;
  const temperature = options.temperature ?? 0.8;

  const configured = configuredProviders(env);
  if (configured.length === 0) {
    return {
      available: false,
      reason: 'no-provider',
      message: 'No AI provider is configured on the server, so no model was called.',
      attempts: [],
    };
  }

  if (typeof fetchImpl !== 'function') {
    return { available: false, reason: 'no-fetch', message: 'This runtime has no fetch implementation.', attempts: [] };
  }

  const prompt = buildPrompt(ctx);
  const attempts = [];

  // Order: explicit preference first, then whatever else is configured.
  const order = options.prefer && ADAPTERS[options.prefer]
    ? [options.prefer, ...configured.map((c) => c.id).filter((id) => id !== options.prefer)]
    : configured.map((c) => c.id);

  for (const id of order) {
    const adapter = ADAPTERS[id];
    if (!adapter || !env[adapter.envKey]) {
      attempts.push({ provider: id, ok: false, error: 'not configured' });
      continue;
    }
    try {
      const out = await callProvider({ id, adapter, env, prompt, maxTokens, temperature, fetchImpl, timeoutMs });
      const opts = out.text
        .split('\n')
        .map((l) => l.replace(/^\s*(?:\d+[.)]\s*|[-*]\s*)/, '').trim())
        .map((l) => l.replace(/^["'“”](.*)["'“”]$/, '$1').trim())
        .filter(Boolean);

      if (!opts.length) throw new Error('provider returned no usable options');

      attempts.push({ provider: id, ok: true });
      return { available: true, provider: out.provider, model: out.model, options: opts, attempts, prompt };
    } catch (e) {
      const reason = e.name === 'AbortError' ? `timed out after ${timeoutMs}ms` : e.message;
      attempts.push({ provider: id, ok: false, error: reason });
    }
  }

  return {
    available: false,
    reason: 'all-providers-failed',
    message: 'Every configured AI provider failed. The rule-based generators still work.',
    attempts,
  };
}

/* --------------------------------------------------------------- deterministic helpers */
/* These are computed locally. They are NOT model output and are labelled as such. */

/** Normalised text used for comparison, so punctuation/case do not hide duplicates. */
function normalise(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function shingles(text, size = 3) {
  const words = normalise(text).split(' ').filter(Boolean);
  if (words.length < size) return new Set(words.length ? [words.join(' ')] : []);
  const out = new Set();
  for (let i = 0; i <= words.length - size; i++) out.add(words.slice(i, i + size).join(' '));
  return out;
}

/** Jaccard similarity over word trigrams, 0..1. */
export function similarity(a, b) {
  const A = shingles(a), B = shingles(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/**
 * Flag near-duplicates. Deterministic and explainable: each pair carries the score
 * and the reason, so a reviewer can disagree with it.
 */
export function findDuplicates(items, { threshold = 0.82 } = {}) {
  const pairs = [];
  const list = items.filter((x) => typeof x === 'string' && x.trim());
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const score = similarity(list[i], list[j]);
      if (score >= threshold) {
        pairs.push({ a: i, b: j, score: Number(score.toFixed(3)), reason: 'near-identical word sequence' });
      }
    }
  }
  return pairs.sort((p, q) => q.score - p.score);
}

/**
 * Local quality score, 0..100, from measurable properties only.
 * Deliberately labelled 'heuristic' wherever it surfaces: it is not a model rating.
 */
export function qualityScore(text, { maxChars = null } = {}) {
  const t = String(text ?? '').trim();
  if (!t) return { score: 0, heuristic: true, factors: { empty: true } };

  const length = [...t].length;
  const words = t.split(/\s+/).filter(Boolean);
  const uniqueRatio = words.length ? new Set(words.map((w) => w.toLowerCase())).size / words.length : 0;

  let score = 60;
  const factors = {};

  // Length: reward a readable range, penalise both extremes.
  if (length >= 20 && length <= 150) { score += 12; factors.length = 'good'; }
  else if (length < 20) { score -= 14; factors.length = 'short'; }
  else { score -= 6; factors.length = 'long'; }

  // Repetition.
  if (uniqueRatio > 0.7) { score += 8; factors.variety = 'good'; }
  else if (uniqueRatio < 0.5) { score -= 10; factors.variety = 'repetitive'; }

  // Engagement signals, capped so they cannot be gamed by stuffing emoji.
  if (/\p{Extended_Pictographic}/u.test(t)) { score += 4; factors.emoji = true; }
  if (/[!?]/.test(t)) { score += 3; factors.punctuation = true; }
  if (/\d/.test(t)) { score += 2; factors.numbers = true; }

  // Over-length relative to the platform ceiling is a real defect.
  if (Number.isSafeInteger(maxChars) && maxChars > 0) {
    if (length > maxChars) { score -= 30; factors.overLimit = length - maxChars; }
    else if (length > maxChars * 0.9) { score -= 4; factors.nearLimit = true; }
  }

  // All-caps shouting and excessive punctuation.
  if (t === t.toUpperCase() && /[A-Z]{8,}/.test(t)) { score -= 12; factors.shouting = true; }
  if (/([!?.])\1{2,}/.test(t)) { score -= 8; factors.excessivePunctuation = true; }

  return { score: Math.max(0, Math.min(100, Math.round(score))), heuristic: true, factors };
}

/** Extract candidate keywords by frequency, excluding a small stop list. */
const STOP = new Set('a an the and or for to of in on with my your our is are be this that i we you it at as by from'.split(' '));
export function extractKeywords(text, limit = 10) {
  const freq = new Map();
  for (const w of normalise(text).split(' ')) {
    if (!w || w.length < 3 || STOP.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, Math.max(1, limit))
    .map(([word, count]) => ({ word, count }));
}

/**
 * SEO suggestions from the text itself. Advisory, never presented as ranking fact.
 */
export function seoSuggestions(text, { keyword = null, maxChars = null } = {}) {
  const out = [];
  const t = String(text ?? '').trim();
  const length = [...t].length;
  if (!t) return [{ severity: 'high', message: 'There is no text to optimise.' }];

  if (Number.isSafeInteger(maxChars) && length > maxChars) {
    out.push({ severity: 'high', message: `Over the platform limit by ${length - maxChars} characters.` });
  }
  if (keyword) {
    const present = normalise(t).includes(normalise(keyword));
    out.push(present
      ? { severity: 'info', message: `The focus keyword “${keyword}” appears in the text.` }
      : { severity: 'medium', message: `The focus keyword “${keyword}” does not appear in the text.` });
  }
  const kw = extractKeywords(t, 3).map((k) => k.word);
  if (kw.length) out.push({ severity: 'info', message: `Recurring words: ${kw.join(', ')}.` });
  if (length < 20) out.push({ severity: 'medium', message: 'Very short — there is little for a reader to act on.' });
  if (/([!?.])\1{2,}/.test(t)) out.push({ severity: 'low', message: 'Repeated punctuation looks like spam.' });
  return out;
}

export const PROVIDER_IDS = Object.keys(ADAPTERS);
