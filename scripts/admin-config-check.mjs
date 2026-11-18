// Validates the exact server configuration loader without logging values,
// fingerprints, or database errors. No live DB/Auth requests are made.
// Usage: node --env-file=.env.admin-check scripts/admin-config-check.mjs
import {createAdminApp} from '../admin-backend/server/app.mjs';
const app=createAdminApp();
try {
  if(!app.configuration.enabled) {
    console.error(`Admin is disabled: ${app.configuration.reason}.`);
    process.exitCode=1;
  } else {
    console.log('Admin configuration passed validation. Verify runtime database connectivity with /api/admin/v1/health.');
  }
} finally { await app.shutdown(); }
