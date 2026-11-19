# BioCraft — implementation tracker (current state)

Last updated: this session. Production commit **`0a7a7eb`** (PR #22), merged to
`main` via PRs #17–#22.

## PRIORITY 1 — Admin API 503: FIXED AND VERIFIED IN PRODUCTION

Production now answers:

```
GET /api/admin/v1/health?diagnose=1
{"ok":true,"diagnostics":{"database":"reachable","provider":"reachable","limited_role":"ok"}}

GET /api/admin/v1/health
{"ok":true}
```

The 503 had **three independent causes, stacked**. Each one hid the next, which
is why earlier sessions kept guessing.

| # | Cause | Evidence | Fix |
|---|---|---|---|
| 1 | The serverless handler **discarded the stage**, so every failure rendered as a byte-identical bare 503 | `handler.mjs` threw away `app.configuration.reason` in both branches | propagates `stage` + `x-admin-stage` |
| 2 | **TLS certificate untrusted** — Supabase's pooler chain ends at `Supabase Root 2021 CA`, a private root absent from Node's trust store | stage `database certificate untrusted` | bundle that root; verification stays strict |
| 3 | **Wrong pooler host AND unscoped username** — tenant not found | SQLSTATE `XX000` from `pool.connect()` | `aws-1-ap-southeast-2` + `bc_admin_executor.<ref>` |

**The password was never the problem.** Cause 1 is why nobody could find causes 2
and 3: an earlier reading of "no stage in the body" concluded the configuration
was complete and pointed every later investigation at the database login.

The certificate is trusted, not bypassed: `ca` replaces the default store for that
socket, `rejectUnauthorized:true` is untouched, and pg still checks the hostname.
Scope is narrow — pooler hosts get the Supabase root, the direct host keeps the
system store. `tests/admin-db-tls.mjs` pins the CA fingerprint
(`80:70:25:AD…CA:FA`) and fails if `rejectUnauthorized:false` appears anywhere.

The host fix had to be found empirically: Supabase publishes no API for the
pooler fleet, so both hosts were probed with a *deliberately wrong* password —
no real credential involved. `aws-0` and `aws-1` answered differently for the
project-scoped login, and `aws-1` is the fleet for a project created 2026-11-12.

### Authenticated endpoints behave correctly

`/overview` and `/fonts` answer `{"error":{"code":"UNAUTHENTICATED"}}` to an
anonymous caller — the RBAC gateway refusing them, which is correct. A
authenticated read/write pass requires the admin user to sign in with TOTP; that
is not something this session can do on the operator's behalf.

## PRIORITY 2 — Deployment

GitHub writes were blocked on `arena/d5b1fd2c-biocraft` because its PR had been
merged. The supported path taken was exactly as the platform instructed: start a
new branch (`arena/4f9c3fc6-biocraft`, branched from `23987b7`) and open new PRs.
Nothing was force-pushed and branch protection was not touched.

| PR | Commit | What |
|---|---|---|
| #17 | `52ca87b` | stage propagation + repo/schema alignment |
| #18 | `a3dc7c5` | name the exact transport failure |
| #19 | `725837d` | classify pg's codeless pool timeout |
| #20 | `998c109` | **verify the pooler against Supabase's root CA** |
| #21 | `0bfef5f` | redeploy with the corrected `ADMIN_DB_USER` |
| #22 | `0a7a7eb` | redeploy with the `aws-1` pooler host |

Repository was also brought back in line with the schema already applied by the
previous session (which could not push): 015's eight bodies now pin
`search_path=pg_catalog`, its eight readers are granted to `bc_admin_executor`
(52 signatures), 015 gained the rollback it never had, and the inventory test's
parameter parser no longer reads `p_limit integer default 50` as type `50`.

## PRIORITY 3 — Content libraries

Measured live, no estimates:

| library | rows | state |
|---|---|---|
| bios | 506 | populated |
| hashtags | 1,155 | populated |
| symbols | 7,897 | populated |
| fonts | 1,941 | populated |
| emoji_library | 1,914 | populated |
| emoji_collections | 438 | populated |
| **icon_library** | **0** | empty |
| **color_palettes** | **0** | empty |
| **design_templates** | **0** | empty |

**Why `emoji_library` is not empty.** It holds 1,914 rows. The earlier "0" was a
stale read. `emoji_collections` (438) is a different, curated table — the two are
not duplicates of one another.

**The three empty libraries are not a bug.** They are unloaded, and the licensed
importer reports exactly what is ready:

```
{"source":"iconify-json","collections":262,"rows":537448,
 "skipped_licences":{"CC-BY-SA-4.0":23578,"MPL-2.0":288,
 "GPL-2.0-only":207,"GPL-2.0-or-later":702,"CC-BY-NC-SA-4.0":1902,
 "CC-BY-SA-3.0":79,"GPL-3.0":55,"GPL-3.0-or-later":591,"CC-BY-NC-4.0":479}}
{"source":"simple-icons","rows":3455}
{"source":"color-name-list","rows":32004}
```

**572,907 licensed records** are validated and ready, with 27,881 non-commercial
or copyleft records correctly excluded. Nothing is invented — every row derives
from a field in the upstream package.

Loading them needs one command with a database credential, which is explicitly out
of scope for this session:

```
DATABASE_URL='postgresql://...' node scripts/import-library.mjs --source=all
```

There is no server-side path: the importer reads npm packages with Node's `fs`,
and the Supabase connector cannot execute a local script.

## Public site — verified

* `/` — full homepage, 506 bios in 20 collections, FAQ, working generators
* `/library-search` — **now renders real database rows** (emoji + fonts). It
  previously said "not connected"; production was missing the browser Supabase
  variables, which are now set.
* `/fancy-font-generator` — 33 Unicode styles, published-font samples
* `/admin/login` — TOTP sign-in gate renders

## Verified test results

* `npx tsc --noEmit` — clean
* `npx vite build` + `scripts/build-shells.mjs` — 51 route shells
* 53 suites pass; the rest are harness-gated in this sandbox (Playwright browsers
  not installed, disposable PG socket, `AUDIT_BASE`, `TEST_DATABASE_URL`)
* `node tests/run-admin-postgres.mjs` — **5/5 PASS** on disposable PostgreSQL
  18.6, including the full rollback cycle (20 tables / 57 functions)
* New: `tests/admin-db-tls.mjs`, `tests/admin-db-classification.mjs`

## Still open

1. **Authenticated admin read/write pass.** Health is green and the gateway is
   proven, but a real signed-in GET/POST needs the operator to complete TOTP. API
   tokens exist but have no defined scope, so none was minted.
2. **Load the 572,907 licensed records** — needs `DATABASE_URL`, out of scope.
3. **The 40k bios / 40k captions / 30k hashtags / 20k templates / 20k
   category-specific targets have no identified licensed corpus.** Reachable
   volume is icons, colours and fonts. That shortfall stands and should not be
   reported as met.
