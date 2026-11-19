#!/usr/bin/env node
// One-time LOCAL keys, not production keys. This file never contains an account
// password and is never read by Vite. Refuse to overwrite an existing config.
import {randomBytes} from 'node:crypto';
import {homedir} from 'node:os';
import {dirname,join} from 'node:path';
import {mkdirSync,writeFileSync} from 'node:fs';
const file=join(homedir(),'.config','biocraft','admin-local.env');
mkdirSync(dirname(file),{recursive:true,mode:0o700});
const settings=[
  '# Local Admin API only. Complete privately; restart the API after editing.',
  '# Set ADMIN_ORIGIN to the exact HTTPS frontend origin outside Arena.',
  'ADMIN_BACKEND_ENABLED=true','ADMIN_SHARED_WRITES_ENABLED=false','ADMIN_PASSWORD_RESET_ENABLED=false',
  'ADMIN_CATALOG_DRAFTS_ENABLED=false','ADMIN_EDITORIAL_DIRECTORY_ENABLED=false',
  '# Supply the current primary Session pooler host from Dashboard Connect.',
  'ADMIN_DB_HOST=','ADMIN_DB_PORT=5432',
  'ADMIN_DB_USER=bc_admin_executor.jvpadtzfsuekixrquzjv','ADMIN_DB_PASSWORD=',
  'ADMIN_ALLOWED_EMAILS=','VITE_SUPABASE_PUBLISHABLE_KEY=',
  ...['ADMIN_COOKIE_KEY_HEX','ADMIN_FLOW_KEY_HEX','ADMIN_HASH_KEY_HEX','ADMIN_INGRESS_SECRET_HEX'].map(k=>k+'='+randomBytes(32).toString('hex')),
];
try {writeFileSync(file,settings.join('\n')+'\n',{flag:'wx',mode:0o600});console.log('Created ~/.config/biocraft/admin-local.env (private). No database or Auth connection was attempted.');}
catch(error) {if(error.code!=='EEXIST')throw error; console.log('Keeping existing local configuration unchanged.');}
