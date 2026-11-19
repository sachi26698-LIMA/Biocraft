#!/usr/bin/env node
// Supply private settings via the process environment or node --env-file with
// a mode-0600 file OUTSIDE the checkout. No production values are copied here.
import {localConfig,localServer} from '../admin-backend/server/local-http.mjs';
const env=localConfig(process.env);
const {server,shutdown}=localServer(env);
server.listen(4190,'0.0.0.0',()=>console.log('BioCraft Admin API listening on port 4190. Liveness: /api/status/live; readiness: /api/admin/v1/health'));
for(const signal of ['SIGTERM','SIGINT']) process.once(signal,()=>shutdown().then(()=>process.exit(0),()=>process.exit(1)));
