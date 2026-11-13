// Start an entirely new disposable PostgreSQL cluster on a private Unix socket.
// Requires PostgreSQL binaries in BIOCRAFT_TEST_PG_BIN; no network listener.
// The cluster directory is retained under /tmp for inspection, never a hosted DB.
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {spawn,spawnSync} from 'node:child_process';import {once} from 'node:events';
const bin=process.env.BIOCRAFT_TEST_PG_BIN;if(!bin||!path.isAbsolute(bin)||!fs.existsSync(path.join(bin,'initdb'))||!fs.existsSync(path.join(bin,'postgres')))throw Error('Set BIOCRAFT_TEST_PG_BIN to a local PostgreSQL binary directory');
if(fs.realpathSync(os.tmpdir())!=='/tmp')throw Error('Test runner requires /tmp');
const root=fs.mkdtempSync('/tmp/biocraft-pg-'),data=path.join(root,'data'),sock=path.join(root,'socket');fs.mkdirSync(sock,{mode:0o700});
const setup=spawnSync(path.join(bin,'initdb'),['-D',data,'--auth=trust','--no-locale','--encoding=UTF8'],{encoding:'utf8',env:process.env});
if(setup.status!==0)throw Error(`initdb failed: ${setup.stderr}`);
fs.writeFileSync(path.join(data,'BIOCRAFT_TEST_ONLY'),'Local disposable Biocraft test cluster only\n');
const server=spawn(path.join(bin,'postgres'),['-D',data,'-k',sock,'-c','listen_addresses='],{env:process.env,stdio:['ignore','ignore','pipe']});
let logs='';let readyResolve,readyReject;const ready=new Promise((resolve,reject)=>{readyResolve=resolve;readyReject=reject});
server.stderr.on('data',chunk=>{logs+=chunk.toString();if(logs.includes('database system is ready to accept connections'))readyResolve();});
server.once('error',readyReject);server.once('exit',(code)=>readyReject(Error(`PostgreSQL exited ${code}: ${logs}`)));
const timer=setTimeout(()=>readyReject(Error(`PostgreSQL startup timeout: ${logs}`)),15000);
try{await ready;clearTimeout(timer);const result=spawnSync(process.execPath,['tests/admin-postgres-integration.mjs'],{cwd:process.cwd(),env:{...process.env,BIOCRAFT_TEST_PG_SOCKET:sock},stdio:'inherit'});if(result.status!==0)process.exitCode=result.status??1;
 const app=spawnSync(process.execPath,['tests/admin-app-local.mjs'],{cwd:process.cwd(),env:{...process.env,BIOCRAFT_TEST_PG_SOCKET:sock},stdio:'inherit'});if(app.status!==0)process.exitCode=app.status??1;
 const httpTest=spawnSync(process.execPath,['tests/admin-http-smoke.mjs'],{cwd:process.cwd(),env:{...process.env,BIOCRAFT_TEST_PG_SOCKET:sock},stdio:'inherit'});if(httpTest.status!==0)process.exitCode=httpTest.status??1;}
finally{clearTimeout(timer);server.kill('SIGTERM');if(server.exitCode===null)await once(server,'exit');console.log(`Disposable PostgreSQL cluster stopped; synthetic files retained at ${root}`)}
