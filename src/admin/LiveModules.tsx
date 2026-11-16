/**
 * Central export for all 13 live Admin modules backed by /api/admin/v1/*.
 * Every module reads live PostgreSQL/Supabase data through the authenticated
 * session cookie and surfaces real permissions, validation, and errors honestly.
 */
export { default as LiveOverview } from './live/Overview';
export { default as LiveBiosLibrary } from './live/Library';
export {
  Platforms as LivePlatforms,
  Categories as LiveCategories,
  LiveCollections,
  Generators as LiveGenerators,
  SeoPages,
} from './live/Catalog';
export { default as LiveContent } from './live/Content';
export { default as LiveUsers } from './live/Users';
export { default as LiveAnalytics } from './live/Analytics';
export { default as LiveAuditLogs } from './live/AuditLogs';
export { default as LiveSecurity } from './live/Security';
export { default as LiveSettings } from './live/Settings';
export { default as LiveBackup } from './live/Backup';
