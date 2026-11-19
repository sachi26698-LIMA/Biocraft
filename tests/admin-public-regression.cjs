// Public rendering/SEO comparison. Set BASELINE_DIST to a separately built
// baseline to serve both builds on ephemeral loopback ports for this test only.
// Alternatively pass BASELINE_URL and ADMIN_BASE_URL for existing test servers.
const {chromium} = require('playwright-core');
const esbuild = require('esbuild');
const assert = require('node:assert/strict');
const path = require('node:path');
const {access} = require('node:fs/promises');

async function routes() {
  const code = await esbuild.build({stdin:{contents:"export {TOOLS} from './src/tools/registry';export {BIO_COLLECTIONS} from './src/lib/bioCollections';export {INFO_PAGES} from './src/pages/info';",resolveDir:process.cwd(),loader:'tsx'},bundle:true,platform:'node',format:'cjs',write:false,packages:'external',loader:{'.css':'empty'}});
  const Module=module.constructor, m=new Module(path.join(process.cwd(),'public-audit.cjs'),module);
  m.filename=path.join(process.cwd(),'public-audit.cjs');m.paths=module.paths;m._compile(code.outputFiles[0].text,m.filename);
  const {TOOLS,BIO_COLLECTIONS,INFO_PAGES}=m.exports;
  return new Set(['/','/categories','/collections','/bio-collections','/bio-library','/bio-editor','/features','/design-studio','/font-library','/library-search',...TOOLS.map(t=>t.path),...BIO_COLLECTIONS.map(c=>'/'+c.slug),...INFO_PAGES.map(x=>x.path)]);
}
async function snapshot(page,base,route) {
  assert.equal((await page.goto(base+route,{waitUntil:'networkidle'})).status(),200,base+route);
  return page.evaluate(()=>({
    title:document.title,description:document.querySelector('meta[name=description]')?.content,
    h1:[...document.querySelectorAll('main h1')].map(x=>x.textContent.trim()),
    h2:[...document.querySelectorAll('main h2')].map(x=>x.textContent.trim()),
    header:!!document.querySelector('header'),footer:!!document.querySelector('footer'),admin:!!document.querySelector('.ad-app'),
  }));
}
async function main() {
  const servers=[];let browser;
  async function serve(dir) {
    await access(path.join(dir,'index.html'));
    const {preview}=await import('vite');
    const server=await preview({root:process.cwd(),configFile:false,logLevel:'error',build:{outDir:path.resolve(dir)},preview:{host:'127.0.0.1',port:0,strictPort:true,cors:false}});
    servers.push(server);return 'http://127.0.0.1:'+server.httpServer.address().port;
  }
  try {
    const baseline=process.env.BASELINE_DIST?await serve(process.env.BASELINE_DIST):(process.env.BASELINE_URL||'http://127.0.0.1:4181');
    const current=process.env.BASELINE_DIST?await serve('dist'):(process.env.ADMIN_BASE_URL||'http://127.0.0.1:4178');
    browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage']});
    const page=await browser.newPage({viewport:{width:1440,height:900}}),fail=[];
    page.on('pageerror',e=>fail.push(e.message));page.on('requestfailed',r=>fail.push(`${new URL(r.url()).pathname}:${r.failure()?.errorText}`));
    // Very old baselines defaulted LinkedIn-only tools to the Instagram Bio tool.
    const linkedIn={'/linkedin-headline-generator':'Professional Headline Generator','/linkedin-summary-generator':'Professional Summary Generator'};
    const paths=await routes();
    for(const route of paths) {
      const before=await snapshot(page,baseline,route),after=await snapshot(page,current,route);
      if(linkedIn[route]) {
        assert.deepEqual(after.h1,[linkedIn[route]],route+' h1');
        if(before.h1.includes('Instagram Bio Generator')) {before.h1=after.h1;before.h2=after.h2;}
      }
      assert.deepEqual(after,before,route);assert.equal(after.admin,false,route);
    }
    assert.deepEqual(fail,[]);console.log(`PASS ${paths.size} public routes: matched baseline title, description, main headings and header/footer; no page/failed-request errors`);
  } finally {
    try { await browser?.close(); } finally { await Promise.all(servers.map(server=>new Promise(resolve=>server.httpServer.close(resolve)))); }
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
