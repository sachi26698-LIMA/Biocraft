import { useRef, useState } from 'react';
import { validateBio, ValidationError } from '../../../admin-backend/domain/bio.mjs';
import { PLATFORM_RULES } from '../../../admin-backend/domain/platform-rules.mjs';
import { Panel } from './common';

export const MAX_IMPORT_BYTES = 256 * 1024;

export function checkBioImport(text: string) {
  const input: unknown = JSON.parse(text);
  if (!Array.isArray(input) || !input.length || input.length > 200) throw new Error('Expected an array of 1–200 bio objects.');
  const errors: string[] = [];
  let valid = 0;
  for (const [index, item] of input.entries()) {
    try {
      validateBio(item, PLATFORM_RULES);
      valid++;
    } catch (error) {
      const field = error instanceof ValidationError && ['bio', 'content', 'language', 'platform', 'flags'].includes(error.field) ? error.field : 'record';
      errors.push(`Row ${index + 1}: invalid ${field}.`);
    }
  }
  return { valid, errors };
}

export default function ImportPreflight() {
  const [result, setResult] = useState<ReturnType<typeof checkBioImport> | null>(null);
  const [message, setMessage] = useState('');
  const generation = useRef(0);

  async function check(file?: File) {
    const attempt = ++generation.current;
    setResult(null);
    setMessage('');
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) { setMessage('File exceeds 256 KiB.'); return; }
    try {
      const checked = checkBioImport(await file.text());
      if (generation.current === attempt) setResult(checked);
    } catch {
      if (generation.current === attempt) setMessage('Choose a valid JSON array containing 1–200 bios.');
    }
  }

  return <Panel title="Local validation only" description="No upload, import job, data modification or publication is performed.">
    <label>Bio JSON file <input type="file" accept=".json,application/json" onChange={event => void check(event.target.files?.[0])} /></label>
    <p>Each object needs content, language (en, hi or hg), platform, active and featured. Maximum 200 rows and 256 KiB.</p>
    {message && <p role="status">{message}</p>}
    {result && <>
      <p role="status">{result.valid} valid; {result.errors.length} invalid. No records were written.</p>
      <ul>{result.errors.slice(0, 20).map(error => <li key={error}>{error}</li>)}</ul>
      {result.errors.length > 20 && <p>Showing the first 20 validation errors.</p>}
    </>}
  </Panel>;
}
