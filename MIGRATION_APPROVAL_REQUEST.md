# Shared-database change — approval required

**Status: PREPARED, NOT APPLIED.** Nothing in this file has been run against the
shared Supabase project `jvpadtzfsuekixrquzjv`. It is waiting for your explicit
approval, as you required for any shared-database change.

---

## 1. Why this is needed — what is actually true right now

Read directly from the live database this session:

| Fact | Value |
|---|---|
| Applied migrations | `0001`–`0005` only |
| `public.global_content` | **does not exist** |
| Library content in production | **6,752 rows** in 11 base tables |
| Database size | 19 MB |

So migrations `0006`, `0007` and `0008` — the entire content-intelligence layer,
the keyset read API and the provenance/dedupe layer built in this batch — are
**not live**. The 572,907 licensed records the importers can produce cannot be
stored until `0006` + `0008` exist.

Current live row counts (unchanged, will be preserved):

```
bios 506 · captions 3888 · hashtags 1155 · symbols 629 · emoji_collections 438
fonts 33 · categories 33 · seo_pages 48 · generators 12 · platforms 8 · app_limits 2
```

---

## 2. What the migrations do — and what they do NOT do

Applied in this order: `0006` → `0007` → `0008`.

**They create** (all `create table if not exists`):
`data_sources`, `content_licenses`, `content_tags`, `content_collections`,
`languages`, `icon_library`, `color_palettes`, `design_templates`,
`design_presets`, `emoji_library`, `global_content`, `data_sync_jobs`,
`data_sync_logs`, `content_analytics`, `admin_content_reviews`,
`content_versions`, `content_translations`, `user_saved_content`,
`user_favorites` and related indexes/triggers.

**They alter existing tables only by ADDING columns** (`add column if not exists`):

```
bios     + source_id, license_code, quality_score, content_hash
captions + source_id, license_code, content_hash
hashtags + source_id, license_code
symbols  + source_id, license_code, codepoints, block
fonts    + source_id, license_code, category, subsets, weights, styles, variable, family
```

**They do NOT contain** a single `drop table`, `drop column`, `delete`, or
`truncate`. Verified by grep over the migration files.

**New columns are nullable**, so every one of the 6,752 existing rows stays valid
and readable exactly as it is today. No existing row is rewritten.

**No Row-Level Security is weakened.** The migrations only *add* policies to the
tables they create, and re-issue `grant select` to `anon`/`authenticated` while
`revoke`-ing writes. `bios`, `captions`, `hashtags`, `symbols`, `fonts`,
`emoji_collections` keep their existing policies untouched.

---

## 3. Exact SQL

The exact SQL is the three files, unmodified:

```
supabase/migrations/0006_global_content_intelligence.sql
supabase/migrations/0007_library_read_api.sql
supabase/migrations/0008_library_provenance_and_search.sql
```

They are already verified together on a **disposable** PostgreSQL:

- `tests/global-content-intelligence.mjs` — schema + triggers + importer
- `tests/library-provenance.mjs` — 30/30 checks (idempotent replay, fingerprint
  uniqueness, `search_library`, anon read-only)
- `tests/library-import-scale.mjs` — 24/24 checks (20,000-row bulk write,
  idempotent re-run, zero duplicates, full keyset walk)

Their checksums are in section 7 so you can confirm what will run.

---

## 4. असर — आसान हिंदी में

- **पुराना डेटा पूरी तरह सुरक्षित रहेगा।** आपके अभी के 6,752 रिकॉर्ड (506 bio,
  3,888 caption, 1,155 hashtag वगैरह) जैसे हैं वैसे ही रहेंगे। कोई डेटा मिटेगा नहीं,
  कोई पंक्ति बदलेगी नहीं।
- **सिर्फ़ नया जुड़ेगा।** कुछ नई टेबलें बनेंगी और पुरानी टेबलों में कुछ खाली
  कॉलम जुड़ेंगे। खाली कॉलम का मतलब है कि पुराना डेटा अभी भी वैसे ही चलेगा।
- **सुरक्षा कमज़ोर नहीं होगी।** सार्वजनिक (guest) उपयोगकर्ता सिर्फ़ पढ़ सकेंगे,
  लिख नहीं सकेंगे। पुरानी सुरक्षा नीतियाँ हटाई नहीं जा रही हैं।
- **इसके बाद ही 5.7 लाख लाइसेंस-सत्यापित आइकॉन, रंग और ब्रांड लाइब्रेरी में
  डाले जा सकेंगे** — अभी वो टेबल ही मौजूद नहीं हैं।
- **अगर कुछ गड़बड़ हुई** तो नीचे दिए rollback से पहले जैसी स्थिति आ जाएगी।

---

## 5. Rollback — exact steps

Run top to bottom. Each step is independently safe; stop as soon as the state you
want is reached. **No step above deletes an existing row of your content.**

```sql
-- Step 1 — remove the 0008 read surface and provenance layer.
drop function if exists public.search_library(text,text,text,text,text,text,uuid,integer);

do $$ declare t text; begin
  foreach t in array array['icon_library','color_palettes','design_templates','design_presets',
                           'fonts','symbols','emoji_collections','emoji_library'] loop
    if to_regclass('public.'||t) is not null then
      execute format('drop index if exists %I', t||'_fingerprint_uidx');
      execute format('drop index if exists %I', t||'_label_trgm_idx');
      execute format('drop index if exists %I', t||'_slug_trgm_idx');
      execute format('alter table public.%I drop constraint if exists %I', t, t||'_verification_status_chk');
      execute format('alter table public.%I drop column if exists fingerprint', t);
      execute format('alter table public.%I drop column if exists attribution', t);
      execute format('alter table public.%I drop column if exists language', t);
      execute format('alter table public.%I drop column if exists verified_at', t);
      execute format('alter table public.%I drop column if exists verification_status', t);
    end if;
  end loop;
end $$;

-- Step 2 — remove the 0007 read API.
drop function if exists public.library_facets();
drop function if exists public.library_page(text,text,text,uuid,integer);
drop function if exists public.font_page(text,text,text,integer);
drop function if exists public.language_coverage();

-- Step 3 — remove the columns 0006 added to your EXISTING tables.
--         These are the only changes 0006 made to pre-existing content tables.
alter table public.bios     drop column if exists source_id, drop column if exists license_code,
                            drop column if exists quality_score, drop column if exists content_hash;
alter table public.captions drop column if exists source_id, drop column if exists license_code,
                            drop column if exists content_hash;
alter table public.hashtags drop column if exists source_id, drop column if exists license_code;
alter table public.symbols  drop column if exists source_id, drop column if exists license_code,
                            drop column if exists codepoints, drop column if exists block;
alter table public.fonts    drop column if exists source_id, drop column if exists license_code,
                            drop column if exists category, drop column if exists subsets,
                            drop column if exists weights, drop column if exists styles,
                            drop column if exists variable, drop column if exists family;

-- Step 4 — drop the tables 0006 created (only these; your 11 original tables are untouched).
drop table if exists public.global_content, public.data_sync_logs, public.data_sync_jobs,
                     public.content_analytics, public.admin_content_reviews,
                     public.content_versions, public.content_translations,
                     public.user_saved_content, public.user_favorites,
                     public.icon_library, public.color_palettes, public.design_templates,
                     public.design_presets, public.emoji_library,
                     public.content_tags, public.content_collections,
                     public.data_sources, public.content_licenses, public.languages cascade;
```

**Important:** if content has already been imported into the new tables, rollback
Step 4 would delete imported records (not your original 6,752). Take a Supabase
backup first if you want to be able to restore an import.

---

## 6. What happens after approval

1. Apply `0006` → `0007` → `0008` through the Supabase connector's migration tool,
   which rolls back automatically on failure.
2. Re-count every table and diff against the "before" numbers in section 1 to prove
   nothing was lost.
3. Run `scripts/import-library.mjs` against the project to load the licensed
   records, in batches, with real insert/duplicate counts.
4. Re-verify the public read API through the anon key.

---

## 7. Checksums of the exact SQL to be applied

Run `sha256sum` on the three files in the repository to confirm they match what is
applied:

```
f907f9367e471d4f5a2ba9478206c35a8558a3e3cab22f4f5e1ea73d140e9146  0006_global_content_intelligence.sql
4447c638792cc50563a55b12b782502a5f4ac7f27753ae44ac84429615407eea  0007_library_read_api.sql
2eda8843db73d034a5c5db66cdd315ba153fa06980ef027cdeb447ccad14fdd3  0008_library_provenance_and_search.sql
```
