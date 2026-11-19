import { useEffect, useMemo, useRef, useState } from 'react';
import { Panel } from './common';

/**
 * Admin — Premium Bio Library quality dashboard.
 *
 * Everything on this screen runs in the Admin's own browser against the bundled
 * library and any file the operator selects. Nothing is uploaded, nothing is
 * written to the database, and no import job is created — the same deliberate
 * limitation as ImportPreflight, for the same reason: the public site reads
 * bundled content, so an "import" that pretended to mutate it would be a lie.
 *
 * The export button produces the exact JSON shape that
 * scripts/bios/content/*.mjs consumes, plus a rejection report, so an editor can
 * round-trip content: export → edit → validate → commit.
 */

type Lang = 'en' | 'hi' | 'hg';

/** Packed record layout from scripts/build-bio-library.mjs. */
type Record_ = [string, string, Lang, string, string, string, string[], string, number, string[], string, string, string];

interface LibraryIndex {
  total: number;
  byLang: Record<Lang, number>;
  byCategory: Record<string, number>;
  byScript: Record<string, number>;
  categories: string[];
  complete: boolean;
  shortfall: { en: number; hi: number; hg: number; total: number };
}

/** Kept identical to scripts/bios/schema.mjs so the dashboard cannot drift. */
const DEVANAGARI = /[\u0900-\u097F]/;
const MIN_LEN = 12;
const MAX_LEN = 160;

function stripDecorative(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u200b-\u200d\ufeff]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
/**
 * SHA-256 via Web Crypto, which is available in every browser the Admin console
 * supports. It is async, so duplicate detection is computed in an effect rather
 * than during render — that keeps the render pure and lets the panel show a
 * "checking" state instead of blocking first paint.
 *
 * If crypto.subtle is unavailable (a non-secure context), we fall back to a
 * transparent non-cryptographic key and SAY SO in the UI, rather than silently
 * presenting a weaker hash as if it were SHA-256.
 */
async function fingerprint(text: string): Promise<string> {
  const normalized = stripDecorative(text);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
    return Array.from(new Uint8Array(bytes)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Visible fallback — flagged in the UI as non-cryptographic.
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalized.length; i++) {
    hash ^= normalized.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv:${hash.toString(16).padStart(8, '0')}`;
}

const HAS_SUBTLE = typeof crypto !== 'undefined' && Boolean(crypto.subtle);

/** Validate one candidate record against the same rules the build enforces. */
function checkRecord(
  text: string,
  lang: string,
  categories: Set<string>,
  category: string,
): string | null {
  const trimmed = text.trim();
  if (!trimmed) return 'empty';
  if (trimmed.length < MIN_LEN) return `too short (${trimmed.length} < ${MIN_LEN})`;
  if (trimmed.length > MAX_LEN) return `too long (${trimmed.length} > ${MAX_LEN})`;
  if (!categories.has(category)) return `unknown category "${category}"`;

  const devanagari = (trimmed.match(/[\u0900-\u097F]/g) ?? []).length;
  const letters = (trimmed.match(/[\p{L}]/gu) ?? []).length;
  if (lang === 'hi') {
    if (!DEVANAGARI.test(trimmed)) return 'declared Hindi but no Devanagari';
    if (devanagari / letters < 0.7) return 'declared Hindi but mostly Latin';
  } else {
    if (devanagari / letters > 0.2) return 'contains Devanagari but declared Latin script';
    if (!/[A-Za-z]/.test(trimmed)) return 'no Latin letters';
  }
  return null;
}

export default function BioLibraryDashboard({
  records,
  index,
}: {
  records: readonly Record_[];
  index: LibraryIndex;
}) {
  const [report, setReport] = useState<string>('');
  const [upload, setUpload] = useState<{ accepted: number; rejected: Array<{ row: number; reason: string }> } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => new Set(index.categories), [index.categories]);

  /** Duplicate scan across the whole bundled library, by fingerprint. */
  const [duplicates, setDuplicates] = useState<Array<{ fingerprint: string; ids: string[] }>>([]);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setScanning(true);
    (async () => {
      const seen = new Map<string, string[]>();
      for (const record of records) {
        const key = await fingerprint(record[1]);
        const bucket = seen.get(key);
        if (bucket) bucket.push(record[0]);
        else seen.set(key, [record[0]]);
      }
      if (cancelled) return;
      setDuplicates([...seen.entries()].filter(([, ids]) => ids.length > 1).map(([fp, ids]) => ({ fingerprint: fp, ids })));
      setScanning(false);
    })();
    return () => { cancelled = true; };
  }, [records]);

  /** Records whose declared language disagrees with their script. */
  const languageIssues = useMemo(
    () => records.filter((r) => checkRecord(r[1], r[2], categories, r[3]) !== null),
    [records, categories],
  );

  const categoryRows = useMemo(
    () => Object.entries(index.byCategory).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    [index.byCategory],
  );

  const exportLibrary = () => {
    // The export is the content-module shape plus the audit fields, so it can be
    // reviewed and re-imported without translation.
    const payload = {
      generatedFrom: 'biocraft premium bio library',
      count: records.length,
      complete: index.complete,
      shortfall: index.shortfall,
      records: records.map((r) => ({
        id: r[0], text: r[1], lang: r[2], category: r[3], subcategory: r[4],
        tone: r[5], tags: r[6], script: r[7], chars: r[8], platforms: r[9],
        created: r[10], sourceId: r[11], fingerprint: r[12],
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `biocraft-bios-${records.length}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setReport(`Exported ${records.length.toLocaleString()} records.`);
  };

  const exportReport = () => {
    const payload = {
      generated: new Date().toISOString(),
      total: index.total,
      byLang: index.byLang,
      byCategory: index.byCategory,
      byScript: index.byScript,
      complete: index.complete,
      shortfall: index.shortfall,
      duplicates: duplicates.length,
      languageIssues: languageIssues.map((r) => ({ id: r[0], lang: r[2], text: r[1].slice(0, 60) })),
      categoriesPopulated: Object.keys(index.byCategory).length,
      categoriesDeclared: index.categories.length,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'biocraft-bio-validation-report.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setReport('Validation report exported.');
  };

  const validateFile = async (file?: File) => {
    setUpload(null);
    setReport('');
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setReport('File exceeds 5 MB.'); return; }
    try {
      const parsed = JSON.parse(await file.text());
      const list = Array.isArray(parsed) ? parsed : parsed?.records;
      if (!Array.isArray(list)) { setReport('Expected a JSON array or an object with a records array.'); return; }

      const rejected: Array<{ row: number; reason: string }> = [];
      const seen = new Set<string>();
      let accepted = 0;

      for (const [i, item] of list.entries()) {
        const text = typeof item === 'string' ? item : item?.text;
        const lang = typeof item === 'string' ? 'en' : item?.lang;
        const category = typeof item === 'string' ? 'Attitude' : item?.category;
        if (typeof text !== 'string') { rejected.push({ row: i + 1, reason: 'no text field' }); continue; }
        const problem = checkRecord(text, lang, categories, category);
        if (problem) { rejected.push({ row: i + 1, reason: problem }); continue; }
        const fp = await fingerprint(text);
        if (seen.has(fp)) { rejected.push({ row: i + 1, reason: 'duplicate within file' }); continue; }
        seen.add(fp);
        accepted++;
      }
      setUpload({ accepted, rejected });
    } catch {
      setReport('That file is not valid JSON.');
    }
  };

  return (
    <>
      <Panel
        title="Library status"
        description="Counts are read from the bundled library. Nothing here is estimated."
      >
        <dl className="ad-stat-grid">
          <div><dt>Total verified</dt><dd>{index.total.toLocaleString()}</dd></div>
          <div><dt>Target</dt><dd>50,000</dd></div>
          <div><dt>Remaining</dt><dd>{index.shortfall.total.toLocaleString()}</dd></div>
          <div><dt>Categories</dt><dd>{Object.keys(index.byCategory).length} / {index.categories.length}</dd></div>
          <div><dt>English</dt><dd>{index.byLang.en.toLocaleString()}</dd></div>
          <div><dt>Hindi</dt><dd>{index.byLang.hi.toLocaleString()}</dd></div>
          <div><dt>Hinglish</dt><dd>{index.byLang.hg.toLocaleString()}</dd></div>
        </dl>
        {!index.complete && (
          <p className="ad-note" role="note">
            The library is incomplete: {index.shortfall.total.toLocaleString()} records are still to be
            written. This banner disappears only when the count reaches 50,000 with every record passing validation.
          </p>
        )}
        {report && <p className="ad-note" role="status">{report}</p>}
      </Panel>

      <Panel
        title="Duplicate report"
        description="SHA-256 of each bio's punctuation- and emoji-normalised text. Any group larger than one is a duplicate."
      >
        {!HAS_SUBTLE && (
          <p className="ad-note" role="alert">
            Web Crypto is unavailable in this context, so duplicate detection is using a
            non-cryptographic fallback hash. Open the Admin over HTTPS for the real SHA-256 check.
          </p>
        )}
        {scanning ? (
          <p className="ad-note" role="status">Scanning {index.total.toLocaleString()} records…</p>
        ) : duplicates.length === 0 ? (
          <p className="ad-note">No duplicate fingerprints in {index.total.toLocaleString()} records.</p>
        ) : (
          <ul className="ad-list">
            {duplicates.map((group) => (
              <li key={group.fingerprint}>
                <strong>{group.ids.length} records share a fingerprint</strong> — {group.ids.join(', ')}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel
        title="Language validation"
        description="Re-checks every record against the same script rules the build script enforces."
      >
        {languageIssues.length === 0 ? (
          <p className="ad-note">All {index.total.toLocaleString()} records match their declared language and script.</p>
        ) : (
          <ul className="ad-list">
            {languageIssues.slice(0, 50).map((r) => (
              <li key={r[0]}>
                <strong>{r[0]}</strong> ({r[2]}): {checkRecord(r[1], r[2], categories, r[3])} — {r[1].slice(0, 50)}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel
        title="Records by category"
        description="Populated categories only. Declared-but-empty categories will appear once content lands."
      >
        <div className="ad-table-wrap" role="region" aria-label="Records by category" tabIndex={0}>
          <table className="ad-table">
            <thead><tr><th scope="col">Category</th><th scope="col">Records</th><th scope="col">Share</th></tr></thead>
            <tbody>
              {categoryRows.map((row) => (
                <tr key={row.name}>
                  <th scope="row">{row.name}</th>
                  <td>{row.count}</td>
                  <td>{((row.count / index.total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Export"
        description="Downloads are generated in your browser. No upload, no import job, no database write."
      >
        <div className="ad-actions">
          <button type="button" className="ad-btn" onClick={exportLibrary}>
            Export library JSON ({index.total.toLocaleString()})
          </button>
          <button type="button" className="ad-btn ad-btn--ghost" onClick={exportReport}>
            Export validation report
          </button>
        </div>
      </Panel>

      <Panel
        title="Validate a file"
        description="Checks a JSON file against the library rules without importing it. Duplicates within the file are reported, not merged."
      >
        <label className="ad-field">
          Bio JSON file
          <input
            ref={fileInput}
            type="file"
            accept=".json,application/json"
            onChange={(event) => void validateFile(event.target.files?.[0])}
          />
        </label>
        {upload && (
          <div role="status" className="ad-note">
            <p><strong>{upload.accepted.toLocaleString()}</strong> records would pass.</p>
            {upload.rejected.length > 0 && (
              <ul className="ad-list">
                {upload.rejected.slice(0, 40).map((row) => (
                  <li key={row.row}>Row {row.row}: {row.reason}</li>
                ))}
              </ul>
            )}
            {upload.rejected.length > 40 && <p>…and {upload.rejected.length - 40} more.</p>}
          </div>
        )}
      </Panel>
    </>
  );
}
