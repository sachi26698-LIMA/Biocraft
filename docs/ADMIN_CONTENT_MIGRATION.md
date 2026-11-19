# Admin content after the public decoupling

Status: **decision required.** This document is the honest scoping of the one part
of the request that could not be completed in the same change as the public
restoration, and it explains why.

## What is already true after this change

- Every public page renders from bundled content with **zero database calls** and
  **zero database configuration** (verified — 7 pages, 0 network requests).
- Supabase Auth is retained for Admin sign-in only, server-side.
- The Admin UI still makes no browser-side database query; it talks to
  `/api/admin/v1/*` only.
- The Admin API, its 15 migrations and 20 `bc_admin_v1` tables are **untouched**.

## The dependency that remains

The Admin API is a content-management system, not an auth wrapper. Its data lives
in `bc_admin_v1`, with foreign keys into `public` content tables and an audit log
that records every write. If the Admin UI can no longer reach that database, the
following capabilities stop working:

| Admin capability | Depends on | Breaks without the DB |
|---|---|---|
| Create / edit / delete a bio | `public.bios` + `bc_admin_v1` draft tables | yes |
| Publish / unpublish, reorder | workflow state machine | yes |
| Review / approval queue | `bc_admin_v1` workflow + audit | yes |
| Audit trail (who changed what) | append-only audit tables | yes |
| Module read/write commands | 010 command set | yes |
| Session + MFA enrolment | session store + grant tables | yes |

This is not incidental coupling; it is the admin system's reason to exist. Making
it local-first is a **data-model migration**, not a code edit.

## Why "just edit the files at runtime" is not an option

On Vercel the deployment filesystem is read-only and per-deployment. A write to
`src/lib/bioCollections.ts` at runtime would either fail or be discarded on the
next deploy. Accepting edits into a writable path would create a second, invisible
source of truth that silently diverges from Git — which is exactly the class of
bug this project has already been burned by. So the workflow must end in a commit,
or it must not claim persistence.

## Three viable options

### Option A — Git-based publishing (recommended)

Admin edits produce a **pull request** against `bioCollections.ts` (or a JSON
content file); merging it is the publish step.

- **How:** Admin UI posts an intent to a server route holding a fine-grained
  GitHub token; the route opens a PR with the regenerated content file. Vercel
  builds the preview; a human approves and merges.
- **Pros:** one source of truth; full history and rollback via Git; previews
  before publish; no new database; no runtime writability assumption.
- **Cons:** publish is not instant (minutes, plus a human gate); the Admin UI must
  be honestly relabelled "propose change → PR" rather than "save".
- **Effort:** moderate. Needs a server route, a token with `contents:write` and
  `pull_requests:write` on this repo, and a validation step that regenerates and
  diffs the content file.
- **Risk:** low. Nothing can reach production without a merge.

### Option B — Keep the admin database, stop calling it "public"

Public pages read the bundle; the Admin continues to manage rows in Supabase, and
the bundle is regenerated from those rows at build time (an export step in CI).

- **Pros:** admin keeps every capability it has today; no data migration.
- **Cons:** this is a hybrid, which the final architecture decision explicitly
  rules out ("do not redesign it into a hybrid database system"). It also keeps
  the 20-table schema alive indefinitely.
- **Verdict:** listed for completeness; **rejected** by the stated decision.

### Option C — Retire admin content editing, keep admin auth + read-only oversight

Admin keeps login, review visibility and audit, but becomes read-only; content
changes go through Git directly by an authorised maintainer.

- **Pros:** smallest change; no new infrastructure; cannot corrupt content.
- **Cons:** loses in-UI editing, which is the main admin feature.
- **Effort:** low (hide/disable write controls, keep the rest).
- **Risk:** low.

## Recommendation

**A**, with **C** as an interim state. Ship C immediately if editing must be
"fixed" this week, then implement A for a real publishing workflow. A is the only
option that satisfies all of: no second database, no fake persistence, preserved
version history, and a validation gate.

## What must NOT be done

- Do not add a second application database.
- Do not write to the deployment filesystem and report success.
- Do not leave write buttons that silently fail.
- Do not delete the `bc_admin_v1` schema or its data; the migration above is
  reversible only while the data exists.

## Rollback

The public decoupling in this change is revertible by `git revert` of the single
commit. The Admin database is untouched, so there is nothing to restore. If
Option A is adopted later, its rollback is "close the PR workflow and revert the
server route"; no data is migrated in either direction.
