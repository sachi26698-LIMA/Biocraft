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
| 003 | `batch-003.mjs` | 47 | 34 | 32 | 113 | 1 → fixed | 312 | Life, friendship, motivation, aesthetic, professional, creator, student, fitness, travel, gaming, photography, music |

| 004 | `batch-004.mjs` | 70 | 48 | 24 | 142 | 1 → fixed | 454 | **All 46 categories now populated** |

**Verified so far: 454 / 50,000 (0.9%)**
Remaining: 49,546 (EN 19,806 · HI 14,852 · HG 14,888)
Categories populated: **46 / 46**

## Next batch

Batch 005 — depth pass. All categories exist but are thin (2-20 records each).
Target the highest-demand categories first: attitude, love, sad, shayari (two-
and four-line), quotes, aesthetic, professional, creator, funny.

## Rejection log

Rejections are preserved per run in `src/data/bios/report.json` under
`rejected`, keyed by layer. A batch is only committed when its rejection count
is zero or every rejection has been reviewed and either fixed or consciously
left in the report as a documented exclusion.

- Batch 002: one Hinglish four-line shayari at 162 chars exceeded the 160-char
  ceiling. Rejected by the `too-long` layer; the line was tightened editorially
  to 140 chars and re-accepted rather than the limit being raised.
- Batch 003: `"Aim average, bakwaas top class."` was refused as "reads as
  English" — correctly, since 5 tokens with 1 Hindi word is mostly English. The
  line was rewritten to `"Aim average hai, par bakwaas top class."` rather than
  weakening the validator. This is the intended behaviour: the gate catches
  under-Hinglish text that a human might let slide.
- Batch 004: `"Gully cricket ka Sachin, ground pe aam insaan."` refused the same
  way; rewritten to `"...Sachin tha, ground pe aam insaan hoon."` so the
  sentence carries real Roman-Hindi grammar.

**Pattern worth noting:** the Hinglish gate has now caught 3 records across 4
batches. Every one was a sentence that *felt* Hinglish but was structurally
English with one borrowed word. Fixing the sentence rather than the gate is
what keeps the language claim honest — and it is the reason the counts can be
trusted.
