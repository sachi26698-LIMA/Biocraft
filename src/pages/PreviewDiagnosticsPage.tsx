/* Temporary, branch-scoped Preview diagnostics. No writes or credentials are displayed. */
import { useEffect, useState } from 'react';
import { BIO_COLLECTIONS } from '../lib/bioCollections';
import { fetchCollectionBios, searchBios } from '../lib/biosRemote';
import { supabase } from '../lib/supabase';
import { PLATFORMS } from '../tools/platforms';
import './preview-diagnostics.css';

type Status = 'PASS' | 'FAIL' | 'NOT TESTED';
type TestId = 'connection' | 'collections' | 'platforms' | 'search' | 'category' | 'pagination' | 'guest';
type Result = { status: Status; detail: string };
type Summary = { statusCode: number; elapsed: number; returned: number; total: number; en: number; hi: number; hg: number };
const labels: Record<TestId, string> = {
  connection: 'Supabase connection', collections: 'Bio collections', platforms: 'Platform data',
  search: 'Search RPC', category: 'Category filter RPC', pagination: 'Pagination RPC', guest: 'Guest read access',
};
const ids: TestId[] = ['connection', 'collections', 'platforms', 'search', 'category', 'pagination', 'guest'];
const manualChecks = [
  { id: 'ui-search', title: 'Collection search and filters', detail: 'Search and use the filter chips; check that the results match.', href: '/instagram-bio-for-boys' },
  { id: 'ui-language', title: 'English, Hindi and Hinglish content', detail: 'Check readable examples in all three languages.', href: '/hinglish-bio' },
  { id: 'ui-copy', title: 'Copy', detail: 'Copy a bio and paste it into a safe text field to compare it.', href: '/instagram-bio-for-boys' },
  { id: 'ui-regenerate', title: 'Regenerate', detail: 'Use a bio card’s regenerate control and check the replacement.', href: '/instagram-bio-for-boys' },
  { id: 'ui-shuffle', title: 'Profile shuffle', detail: 'Use the profile preview shuffle and check the displayed bio changes.', href: '/instagram-bio-for-boys' },
  { id: 'ui-viewport', title: 'Mobile, tablet and desktop', detail: 'Check layout and controls at all three sizes; leave untested if you have only checked one.', href: '/' },
] as const;
const initialResults = (): Record<TestId, Result> => Object.fromEntries(ids.map((id) => [id, { status: 'NOT TESTED', detail: 'Run a test to see its result.' }])) as Record<TestId, Result>;
const passed = (detail: string): Result => ({ status: 'PASS', detail });
const failed = (detail: string): Result => ({ status: 'FAIL', detail });
const untested = (detail: string): Result => ({ status: 'NOT TESTED', detail });

async function withTimeout<T>(operation: PromiseLike<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      Promise.resolve(operation),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('timeout')), 20000); }),
    ]);
  } finally { if (timer) clearTimeout(timer); }
}

async function checkConnection(): Promise<{ result: Result; summary: Summary | null }> {
  if (!supabase) return { result: untested('Supabase is not configured in this build.'), summary: null };
  const start = performance.now();
  const response = await withTimeout(supabase.from('bios').select('id,language', { count: 'exact' }).eq('is_active', true).limit(100));
  const elapsed = Math.round(performance.now() - start);
  if (response.error || !response.data || response.count === null || response.data.length === 0) {
    return { result: failed(`Bio query failed or returned no active records (HTTP ${response.status || 'unavailable'}).`), summary: null };
  }
  const counts = await Promise.all(['en', 'hi', 'hg'].map((lang) => withTimeout(
    supabase!.from('bios').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('language', lang),
  )));
  if (counts.some((r) => r.error || r.count === null)) {
    return { result: failed('Bio query succeeded, but one or more language counts could not be read.'), summary: null };
  }
  return {
    result: passed('Active bio query and language counts succeeded from this browser.'),
    summary: { statusCode: response.status, elapsed, returned: response.data.length, total: response.count, en: counts[0].count!, hi: counts[1].count!, hg: counts[2].count! },
  };
}

async function runCheck(id: TestId): Promise<Result> {
  if (!supabase) return untested('Supabase is not configured in this build.');
  switch (id) {
    case 'collections': {
      const results = await Promise.all(BIO_COLLECTIONS.map(async (collection) => {
        try {
          const result = await withTimeout(fetchCollectionBios(collection.slug));
          return result.source === 'supabase' && result.bios.length > 0;
        } catch { return false; }
      }));
      const count = results.filter(Boolean).length;
      return count === results.length
        ? passed(`${count} of ${results.length} collection queries returned remote bios. This does not test their UI.`)
        : failed(`${count} of ${results.length} collection queries returned remote bios. Check connectivity and seeded collections.`);
    }
    case 'platforms': {
      const result = await withTimeout(supabase.from('platforms').select('slug').eq('is_active', true));
      if (result.error || !result.data) return failed(`Platform data query failed (HTTP ${result.status || 'unavailable'}).`);
      const found = new Set(result.data.map((row) => row.slug));
      const missing = PLATFORMS.filter((platform) => !found.has(platform.id));
      return missing.length === 0
        ? passed('All eight platform records returned. Workspace interaction still requires the manual checks below.')
        : failed(`${missing.length} of eight platform records were not returned.`);
    }
    case 'search': {
      const rows = await withTimeout(searchBios({ query: 'dream', limit: 5 }));
      return rows && rows.length > 0 ? passed(`Search RPC returned ${rows.length} results for the sample query. The collection UI search is separate.`) : failed('Search RPC returned no results for the sample query.');
    }
    case 'category': {
      const rows = await withTimeout(searchBios({ categorySlug: 'boys', limit: 5 }));
      return rows && rows.length > 0 && rows.every((row) => row.category_slug === 'boys')
        ? passed(`Category filter RPC returned ${rows.length} matching rows. The collection UI filter is separate.`)
        : failed('Category filter RPC returned no rows or a mismatched category.');
    }
    case 'pagination': {
      const [first, second] = await Promise.all([
        withTimeout(searchBios({ limit: 5, offset: 0 })), withTimeout(searchBios({ limit: 5, offset: 5 })),
      ]);
      const uniqueIds = new Set([...(first ?? []), ...(second ?? [])].map((row) => row.id));
      return first?.length === 5 && second?.length === 5 && uniqueIds.size === 10
        ? passed('Two five-row RPC pages returned distinct IDs. There is no collection pagination UI to test.')
        : failed('Two RPC pages did not return five distinct rows each.');
    }
    case 'guest': {
      const session = await withTimeout(supabase.auth.getSession());
      if (session.error || session.data.session) return untested('Could not establish an anonymous client session.');
      const result = await withTimeout(supabase.from('bios').select('id').eq('is_active', true).limit(1));
      return !result.error && Boolean(result.data?.length)
        ? passed('The existing client has no signed-in session and can read an active bio. This does not prove inactive-row filtering or write denial.')
        : failed(`Anonymous active-bio read failed or returned no rows (HTTP ${result.status || 'unavailable'}).`);
    }
    case 'connection': return untested('Run the connection test.');
  }
}

export default function PreviewDiagnosticsPage() {
  const [results, setResults] = useState(initialResults);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState<Record<string, Status>>({});

  // Limit the mobile header adjustment to this temporary page and undo it on navigation.
  useEffect(() => {
    document.documentElement.classList.add('preview-diagnostics-active');
    return () => document.documentElement.classList.remove('preview-diagnostics-active');
  }, []);

  const run = async (checks: TestId[]) => {
    if (busy) return;
    setBusy(true);
    if (checks.includes('connection')) setSummary(null);
    setResults((old) => {
      const next = { ...old };
      checks.forEach((id) => { next[id] = untested('Test in progress…'); });
      return next;
    });
    try {
      for (const id of checks) {
        try {
          let result: Result;
          if (id === 'connection') {
            const connection = await checkConnection();
            result = connection.result;
            setSummary(connection.summary);
          } else result = await runCheck(id);
          setResults((old) => ({ ...old, [id]: result }));
        } catch {
          // Never render or log the raw exception, request, URL, headers, or key.
          setResults((old) => ({ ...old, [id]: failed('Request failed or timed out. Check your connection and try again.') }));
        }
      }
    } finally { setBusy(false); }
  };

  return (
    <section className="preview-diag" aria-labelledby="diag-title">
      <div className="preview-diag-inner">
        <p className="preview-diag-eyebrow">TEMPORARY · PREVIEW ONLY</p>
        <h1 id="diag-title">BioCraft Diagnostics</h1>
        <p>Tests run in this browser against the configured Supabase client. No database writes are performed. Results are not saved or sent to BioCraft.</p>
        <div className="preview-diag-actions">
          <button type="button" onClick={() => void run(['connection', 'guest'])} disabled={busy}>Test Supabase Connection</button>
          <button type="button" onClick={() => void run(ids)} disabled={busy}>Run All Tests</button>
          <button type="button" onClick={() => { setManual({}); void run(ids); }} disabled={busy}>Refresh Tests</button>
        </div>
        <p aria-live="polite">{busy ? 'Testing… please keep this page open.' : 'Ready. Automated tests are read-only.'}</p>
        <section className="preview-diag-card" aria-label="Connection details">
          <h2>Connection details</h2>
          <p>Connection status: <strong>{results.connection.status}</strong></p>
          <p>HTTP / query: {summary ? `HTTP ${summary.statusCode} · success` : results.connection.status === 'FAIL' ? 'Failed or unavailable' : 'Not tested'}</p>
          <p>Response time: {summary ? `${summary.elapsed} ms (bio query)` : '—'}</p>
          <p>Records returned: {summary ? `${summary.returned} in this response; ${summary.total} active in total` : '—'}</p>
          <p>English: {summary?.en ?? '—'} · Hindi: {summary?.hi ?? '—'} · Hinglish: {summary?.hg ?? '—'}</p>
          <p>RLS active-read permission: <strong>{results.guest.status}</strong> (guest read only; inactive filtering and write denial are not tested here).</p>
        </section>
        <h2>Automated browser checks</h2>
        <p>PASS means only the specific check described; it does not certify every route or interaction.</p>
        <div className="preview-diag-list">
          {ids.map((id) => <article className="preview-diag-card" key={id}>
            <div className="preview-diag-row"><h3>{labels[id]}</h3><strong className={`preview-diag-status status-${results[id].status.replace(' ', '-').toLowerCase()}`}>{results[id].status}</strong></div>
            <p>{results[id].detail}</p>
            <button type="button" onClick={() => void run([id])} disabled={busy}>Refresh Test</button>
          </article>)}
        </div>
        <h2>Manual workspace checks</h2>
        <p>Open each workspace, try its generator, copy and regenerate controls, then return here and mark your observation. These are your reports, not automated results. State resets on reload.</p>
        <div className="preview-diag-list">
          {PLATFORMS.map((platform) => <article className="preview-diag-card" key={platform.id}>
            <div className="preview-diag-row"><h3>{platform.name}</h3><strong className={`preview-diag-status status-${(manual[platform.id] ?? 'NOT TESTED').replace(' ', '-').toLowerCase()}`}>{manual[platform.id] ?? 'NOT TESTED'}</strong></div>
            <div className="preview-diag-actions"><a href={`/?platform=${platform.id}#workspace`} target="_blank" rel="noopener noreferrer">Open workspace</a>
              <button type="button" aria-label={`Mark ${platform.name} workspace pass`} onClick={() => setManual((old) => ({ ...old, [platform.id]: 'PASS' }))}>Mark pass</button>
              <button type="button" aria-label={`Mark ${platform.name} workspace fail`} onClick={() => setManual((old) => ({ ...old, [platform.id]: 'FAIL' }))}>Mark fail</button></div>
          </article>)}
        </div>
        <h2>Manual interaction checks</h2>
        <p>Mark these only after checking them yourself. The status is not an automated result.</p>
        <div className="preview-diag-list">
          {manualChecks.map((check) => <article className="preview-diag-card" key={check.id}>
            <div className="preview-diag-row"><h3>{check.title}</h3><strong className={`preview-diag-status status-${(manual[check.id] ?? 'NOT TESTED').replace(' ', '-').toLowerCase()}`}>{manual[check.id] ?? 'NOT TESTED'}</strong></div>
            <p>{check.detail}</p>
            <div className="preview-diag-actions"><a href={check.href} target="_blank" rel="noopener noreferrer">Open page</a>
              <button type="button" aria-label={`Mark ${check.title} pass`} onClick={() => setManual((old) => ({ ...old, [check.id]: 'PASS' }))}>Mark pass</button>
              <button type="button" aria-label={`Mark ${check.title} fail`} onClick={() => setManual((old) => ({ ...old, [check.id]: 'FAIL' }))}>Mark fail</button></div>
          </article>)}
        </div>
        <section className="preview-diag-card">
          <h2>Not automatically tested</h2>
          <p><strong>NOT TESTED:</strong> Browser console, inactive-row isolation and write rejection. Test interactions manually. Never share screenshots of browser request headers.</p>
          <p>Vercel Preview protection may require a Vercel login; that is separate from BioCraft guest access.</p>
        </section>
      </div>
    </section>
  );
}
