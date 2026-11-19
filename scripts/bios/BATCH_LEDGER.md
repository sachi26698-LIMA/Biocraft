# Bio Library — Batch Ledger

Running, append-only record of every accepted batch. This file is the resumable
state: if a session ends, the next one reads the last row and continues from the
next batch number.

**Target:** 50,000 — English 20,000 · Hindi 15,000 · Hinglish 15,000
**Rule:** a row is written only after `node scripts/build-bio-library.mjs`
reports the batch accepted. Counts are cumulative verified totals, never
"planned" numbers.

| Batch | File | EN | HI | HG | Total | Rejected | Cumulative | Notes |
|---|---|---|---|---|---|---|---|---|
| 001 | `batch-001.mjs` | 39 | 26 | 25 | 90 | 0 | 90 | Foundation: 12 categories, engine probe |
| 002 | `batch-002.mjs` | 38 | 40 | 31 | 109 | 1 → fixed | 199 | Priority cats: attitude, royal, love, sad, alone, shayari, quotes |

**Verified so far: 199 / 50,000 (0.4%)**
Remaining: 49,801 (EN 19,923 · HI 14,934 · HG 14,944)

## Next batch

Batch 003 — continue priority categories with life, friendship, motivational,
aesthetic, professional and creator, then push into unstarted categories.

## Rejection log

Rejections are preserved per run in `src/data/bios/report.json` under
`rejected`, keyed by layer. A batch is only committed when its rejection count
is zero or every rejection has been reviewed and either fixed or consciously
left in the report as a documented exclusion.

- Batch 002: one Hinglish four-line shayari at 162 chars exceeded the 160-char
  ceiling. Rejected by the `too-long` layer; the line was tightened editorially
  to 140 chars and re-accepted rather than the limit being raised.
