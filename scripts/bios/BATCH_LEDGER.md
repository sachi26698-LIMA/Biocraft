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
| 005 | `batch-005.mjs` | 36 | 46 | 33 | 115 | 1 → fixed | 569 | Depth pass: attitude, love, shayari (2- and 4-line), quotes, sad, aesthetic, life |
| 006 | `batch-006.mjs` | 50 | 50 | 50 | 150 | 3 → fixed | 719 | Thin-category pass: the 25 categories still at 4–6 records |
| 007 | `batch-007.mjs` | 44 | 35 | 35 | 114 | 3 → fixed | 833 | Next band: royal, motivational, alone, friendship, professional, creator, student + middle sweep |
| 008 | `batch-008.mjs` | 38 | 29 | 29 | 96 | 1 → fixed | 929 | The seven 7-record categories: family, minimal, fitness, travel, gaming, photography, music |
| 009 | `batch-009.mjs` | 49 | 28 | 30 | 107 | 0 | 1036 | Whole 9–14 band lifted; first zero-rejection batch since 004. Library passes 1,000 |
| 010 | `batch-010.mjs` | 52 | 12 | 11 | 75 | 2 → fixed | 1111 | English-weighted to correct split drift; 2 self-duplicates caught |
| 011 | `batch-011.mjs` | 10 | 10 | 39 | 59 | 2 → fixed | 1170 | Hinglish-weighted to close the last split gap |
| 012 | `batch-012.mjs` | 31 | 23 | 21 | 75 | 1 → fixed | 1245 | Thinnest categories at a proportional 40/30/30 mix |
| 013 | `batch-013.mjs` | 42 | 28 | 27 | 97 | 2 → fixed | 1342 | The 16–18 band: cinema, savage, instagram, nature, photography, pets, startup, cricket, cars, wedding, monsoon, funny |
| 014 | `batch-014.mjs` | 34 | 30 | 29 | 93 | 0 | 1435 | Depth phase begins: the seven highest-demand categories |
| 015 | `batch-015.mjs` | 33 | 26 | 24 | 83 | 0 | 1518 | Depth continued + thin-category top-ups |
| 016 | `batch-016.mjs` | 30 | 23 | 21 | 74 | 1 → fixed | 1592 | Depth on attitude, love, sad, shayari, life, quotes, motivational |
| 017 | `batch-017.mjs` | 44 | 35 | 30 | 109 | 0 | 1701 | Depth continued; zero rejections |
| 018 | `batch-018.mjs` | 39 | 33 | 29 | 101 | 0 | 1802 | Leaders + mid-field top-ups (food, tech, photography) |
| 019 | `batch-019.mjs` | 15 | 14 | 34 | 63 | 0 | 1865 | Hinglish-weighted rebalance; zero rejections |
| 020 | `batch-020.mjs` | 39 | 30 | 26 | 95 | 1 → fixed | 1960 | Proportional mix, depth in the leaders |

**Verified so far: 1,960 / 50,000 (3.9%)**
Remaining: 48,040 (EN 19,220 · HI 14,400 · HG 14,420)
Split check: EN 3.90% · HI 4.00% · HG 3.87% of their targets.

*** Audited against the data, not against memory (important) ***

Rows 006, 007, 010, 012, 013 and 016 were originally written from my own arithmetic
rather than copied from the builder output, and five of them were wrong. The worst
was row 012: recorded as 102 records (41/31/30) when the batch actually accepted
75 (31/23/21) — an overstatement of 27.

**The data was never affected.** Every batch was accepted only after the builder
reported `rejected: 0`, and `records.json` holds exactly 1,592 unique verified
records that pass all six dedup layers, the language gate and the stray-script
scan. What was wrong was the *accounting*: the ledger's columns summed to 1,623
against 1,592 real records, and two totals I reported in chat were therefore
incorrect — batch 006 was reported as 716 (actual 719) and batch 012 as 1,272
(actual 1,245).

This is precisely the failure mode the brief forbids — claiming a count that was
not verified — so it is recorded here rather than quietly fixed. Two changes
prevent a repeat:

1. `tests/bio-ledger.mjs` re-derives each batch's EN/HI/HG counts by replaying the
   content files through `BioDeduplicator.consider()` and fails if any ledger row
   disagrees with the data, or if the columns do not sum to `records.json`.
2. Rows are now copied from `scripts/bios/verify-batches.mjs` output, never
   computed by hand.
Categories populated: **46 / 46**

## Next batch

Batch 021 — split is level (3.90 / 4.00 / 3.87). Continue at 40/30/30 with depth
in the leaders and a mid-field top-up pass.

**Phase change recorded.** Batches 001–013 were a breadth phase: the job was to
get all 46 categories populated and roughly even, which is now done. From 014
onward every batch is depth in the categories people actually browse. This
matters for the remaining-work estimate: depth batches are the same size but
they improve the product, whereas breadth batches mostly improved coverage.

**Throughput and honesty.** Seventeen batches have produced 1,701 records, an
average of exactly 100 per batch. At this editorial standard — every line
original, every line read back, every rejection reviewed — a batch is worth
60–150 records. Reaching 50,000 therefore needs on the order of 350 further
batches at the same size. That number is stated plainly rather than softened: the
pipeline, UI, dashboard and validation are finished, the remaining work is
writing, and writing does not accelerate by loosening checks. The batch size was
reviewed with the project owner at batch 017 and deliberately kept at ~100.

**Balance note.** The target is not simply 50,000 records, it is 20/15/15. A
library that reaches 50,000 with the wrong language split has failed the brief
even though the total looks right, so every batch from here reports the split as
a percentage of each target rather than just a raw count. Batch 010 moved English
from 2.05% to 2.31% of its target and the three are now close enough that a few
Hinglish-heavy batches will level them.

**Scale honestly assessed.** Eight batches have produced 929 records in this
voice. Reaching 50,000 at this editorial standard needs roughly 400 more
batches of this size; there is no shortcut that survives the duplicate engine,
the language gate and the 160-character limit. The ledger is append-only so the
work is resumable at any point, but the completion claim will not be made early.

**Marker-list discipline (new, from batch 007).** The Hinglish marker list was
extended twice in batches 005 and 007, each time because a genuinely Hinglish
line was falsely refused. Every extension risks letting plain English through as
Hinglish, which would silently inflate the HG count. `tests/bio-language-gate.mjs`
now pins the list from both sides: 8 plain-English sentences must still fail as
Hinglish, 7 real Hinglish sentences must still pass, and all stored records are
re-validated against the gate. Run it before any marker edit. Keep the shayari two-line/four-line split going: it
is the only place where the Hindi library can outrun a literal reading of the
target without inventing content.

Note on the shayari four-line rows: they contain literal `\n` line breaks, which
the fingerprint strips before comparison. This is intentional — line breaks are
typography, not content, so a four-line verse cannot be smuggled in as "new"
content by re-wrapping it.

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

- Batch 005: `"Achhi aadatein pehle mahine bewakoofi lagti hain."` was refused
  as "reads as English". This one was a genuine **validator gap**, not a bad
  sentence: the line is real Hinglish, but the marker list only held
  high-salience slang, so ordinary grammar words (`aadatein`, `mahine`, `pehle`,
  `bewakoofi`, `rahti`) did not count. The marker list was extended with those
  everyday words and the line was then accepted unchanged — the *sentence* was
  not edited to satisfy the gate. Worth being precise about the difference:
  batches 003 and 004 were wrong content, batch 005 was incomplete vocabulary.

- Batch 006: three rejections, and two of them were **my own sloppiness, caught
  by the engine**. `"I do not audition for people who already decided."` and
  `"Professional overthinker. Amateur everything else."` were word-for-word
  repeats of batch 004 lines. Both were deleted and replaced with genuinely new
  sentences — not reworded, since rewording a repeat is exactly the
  "lightly modified bio" the brief forbids. The third was `"Puraani bike, naye
  raaste..."`, refused as English because `puraani` is not in the marker list;
  the sentence was rewritten to lead with `Bike` so the Roman-Hindi is
  unmistakable, rather than the marker list being patched for one word.

- Batch 007: three more vocabulary-gap refusals (`padhai`, `neend adhoori`,
  `samjhaya`, `shukraguzaar`, `maangna`). All three sentences were correct
  Hinglish, so the marker list was extended and the records were accepted
  **verbatim** — nothing was rewritten to dodge the gate. This is now the
  dominant rejection class, which is the right outcome: the gate is finding
  vocabulary it cannot see rather than content that is wrong.

- Batch 008: one more vocabulary gap (`saade`, `raay`, `pakki`, `yehi`,
  `saleeka`). Marker list extended a third time; sentence accepted verbatim;
  `test:bio-language-gate` re-run and still green in both directions.

- Batch 009: zero rejections — the first clean batch since 004. This is expected
  rather than lucky: the marker list now covers the vocabulary this voice
  actually uses, so fewer correct lines are refused. The gate was re-run against
  its plain-English probes after the third extension and still rejects them, so
  the zero is not the result of a loosened gate.

- Batch 010: two **exact duplicates of earlier batches** again
  (`"I would rather be underestimated than explained."` and `"Manners cost
  nothing and separate everything."`). Both replaced with genuinely new lines.
  This is the second time the engine has caught my own repeats, and it confirms
  the earlier finding: past a few hundred records, exact-match detection is doing
  real editorial work that memory cannot.

- Batch 011: one vocabulary gap (`aasaan`, `mushkil`, `likhna`, `samajhna`) —
  markers extended, sentence kept — and one exact duplicate of an earlier line
  (`"Rest is part of the work, not a break from it."`), replaced with new content.

**Author-error class worth recording.** Batch 011 also contained three errors the
validators did *not* catch, which I found by reading the file back: a Bengali
glyph (`আরাম`) inside a Hindi subcategory, an autocorrect slip that turned a line
into `"...purani galtiyan blouse nahi."`, and a broken verb (`ghar nahi chuntiyan`).
All three were fixed before the batch was accepted. The lesson is that the
language gate checks *script and vocabulary*, not *sense*: a Devanagari string
with one Bengali word still passes a script test. Read every line back before
committing a batch — automated checks are necessary, not sufficient.

- Batch 012: one vocabulary gap (`khaali`, `bhare`, `vichaar`, `kaafi`) —
  markers extended, sentence kept.

- Batch 013: two vocabulary gaps (`mizaaj`, `asli`, `haal`, `chhoti`, `lamba`,
  `sacchi`). Markers extended, both sentences kept verbatim.

- Batch 014: zero rejections.

- Batch 015: zero validator rejections, but one **corrupted tag** the validators
  do not cover: an Arabic character had slipped into a Devanagari tag
  (`मुस्कुरاना` instead of `मुस्कुराना`). The bio text was clean, so the language
  gate passed it, but the tag renders in the UI's filter chips. Fixed, and
  `test:bio-language-gate` now scans **text, category, subcategory, tone and
  tags** for 16 stray scripts instead of the bio text alone.

- Batch 016: one Hinglish line refused twice in a row while I tried to fix it.
  The first attempt kept a marginal inflection (`rakhin`) that the marker list
  does not cover; the second kept `sambhaali`, also uncovered. Rather than adding
  two rare words to the list, the sentence was rewritten in core vocabulary
  (`Tasveerein maine hi rakhi hain, aaj tak ghar mein.`). This is the right call:
  the marker list should describe how Hinglish is normally written, not be grown
  to accommodate one awkward sentence. Extending it for rare inflections would
  erode the gate's precision over time.

**Pattern worth noting:** the engine has now caught 19 rejections across 16
batches
— 3 Hinglish edges (003, 004, 006), 2 exact duplicates of earlier batches (006),
1 vocabulary gap (005), 1 over-length line (002). The duplicate catches are the
most useful signal in the whole ledger: at 716 records a human cannot hold the
corpus in their head, so the exact-match layer is doing real editorial work. Every one was a sentence that *felt* Hinglish but was structurally
English with one borrowed word. Fixing the sentence rather than the gate is
what keeps the language claim honest — and it is the reason the counts can be
trusted.
