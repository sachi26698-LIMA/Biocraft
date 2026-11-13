/**
 * Response shapes the live modules read.
 *
 * Kept in one file so the console has a single description of what the server
 * promises. Every field here is something the server returns today — nothing is
 * aspirational, and nothing is inferred from a bundled fixture.
 */

export type Metric = { metric: string; value: number };

export type StaffRow = {
  user_id: string;
  enabled: boolean;
  version: number | string;
  roles: string[] | null;
};

export type DraftRow = {
  draft_id: string;
  resource_key: string;
  state: 'draft' | 'in_review' | 'approved' | 'rejected' | 'published';
  row_version: number | string;
  created_at: string;
  author_id?: string;
  payload: { content: string; language: 'en' | 'hi' | 'hg'; platform: string; active: boolean; featured: boolean };
};

export type BioRow = {
  id: string;
  title: string | null;
  language: string;
  platform_slug: string | null;
  category_name: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_trending: boolean;
  character_count: number;
  source_slug: string | null;
  created_at: string;
  updated_at: string;
};

/** The three registry tables read by Catalog.tsx. Each mirrors one row-returning
 * function on the server; `is_active` is present on all three, which is what lets
 * one badge component serve them. */
export type PlatformRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number | null;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  platform_slug: string | null;
  is_active: boolean;
  sort_order: number | null;
};

export type GeneratorRow = {
  id: string;
  name: string;
  slug: string;
  generator_type: string | null;
  character_limit: number | null;
  is_active: boolean;
  platform_slug: string | null;
};

export type SeoPageRow = {
  id: string;
  page_slug: string;
  title: string | null;
  meta_description: string | null;
  robots: string | null;
  is_active: boolean;
  updated_at: string;
};

export type NotificationRow = {
  id: string;
  category: string;
  message: string;
  created_at: string;
  read_at: string | null;
  unread: boolean;
};

export type PublicationRow = {
  id: number | string;
  bio_id: string;
  draft_id: string;
  version_id: string;
  action: 'created' | 'updated' | 'archived' | 'restored';
  actor_id: string;
  published_at: string;
  payload: DraftRow['payload'];
};

export type JobRow = {
  id: string;
  draft_id: string;
  resource_key: string;
  target_environment: string;
  state: string;
  scheduled_at: string;
  created_at: string;
  completed_at: string | null;
};

export type BackupRow = {
  id: string;
  environment: string;
  provider_reference: string;
  state: string;
  requested_at: string;
  verified_at: string | null;
};

export type AuditRow = {
  id: number | string;
  actor_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  occurred_at: string;
  details: Record<string, unknown> | null;
};

export type SessionRow = {
  id: string;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
};

export type SettingRow = { key: string; value: unknown; version: number | string; updated_at: string };

export type RoleRow = { id: string; description: string; permissions: string[] | null };

/** Human labels for draft state, used everywhere so the console never shows a
 * raw enum value to a person. */
export const STATE_LABEL: Record<string, string> = {
  draft: 'Draft',
  in_review: 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
  published: 'Published',
};

export const LANGUAGE_LABEL: Record<string, string> = { en: 'English', hi: 'Hindi', hg: 'Hinglish' };
