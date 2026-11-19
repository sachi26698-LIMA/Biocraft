// Validates the exact server configuration loader without logging values,
// fingerprints, or database errors. No network access unless --connect is explicitly passed.
// Usage with private local settings: npm run admin:check:local [-- --connect]
import {createAdminApp} from '../admin-backend/server/app.mjs';
import {localConfig} from '../admin-backend/server/local-http.mjs';
import {databaseReady} from '../admin-backend/server/db-readiness.mjs';
const flags=process.argv.slice(2);
if(flags.some(f=>!['--local','--connect'].includes(f)))throw Error('Use --local and/or --connect');
const local=flags.includes('--local');
const app=createAdminApp(local?{env:localConfig(process.env),localDevelopment:true}:{});
try {
  if(!app.configuration.enabled) {
    console.error(`Admin is disabled: ${app.configuration.reason}.`);
    process.exitCode=1;
  } else if(flags.includes('--connect')) {
    const report=await app.diagnose();
    console.log(JSON.stringify(report)); // only the shared readiness module's fixed categories
    if(!databaseReady(report)||report.provider!=='reachable') process.exitCode=1;
  } else {
    console.log('Admin configuration passed validation. Verify runtime database connectivity with /api/admin/v1/health.');
  }
} finally { await app.shutdown(); }
