import { useMemo, useState } from 'react';
import { CheckIcon, ClipboardIcon, RefreshIcon } from '../../components/icons';
import DownloadButton from '../../components/DownloadButton';
import { copyText } from '../../lib/clipboard';
import { OPERATIONS, analyse, type OperationId } from '../../lib/textOps';

/**
 * Text Toolkit — countable, case, cleaning and extraction utilities.
 *
 * Chained, not one-shot: each action rewrites the working text, so a user can
 * de-duplicate, then trim, then slugify without pasting between steps. An
 * unlimited undo stack and a reset make that safe.
 *
 * Everything is computed locally on every keystroke; the live stats panel is the
 * same function the results panel uses, so the numbers can never disagree.
 */

const SAMPLE = `  Social media captions need short, clear sentences.  They also need
punctuation!

Duplicate lines should be removed.  Duplicate lines should be removed.
Contact hello@example.com or visit https://example.com/about #content #tips`;

const GROUP_ORDER = ['Case', 'Clean', 'Extract'] as const;

export default function TextToolkit() {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('');

  const stats = useMemo(() => analyse(text), [text]);
  const isEmpty = text.trim().length === 0;

  const applyOperation = (id: OperationId) => {
    const op = OPERATIONS.find((o) => o.id === id);
    if (!op) return;
    if (isEmpty) {
      setStatus('Add some text first.');
      return;
    }
    const next = op.apply(text);
    setHistory((prev) => [...prev, text]);
    setText(next);
    setStatus(
      next.trim().length === 0
        ? `${op.label} found nothing to output.`
        : `Applied ${op.label}.`,
    );
  };

  const undo = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      setText(prev[prev.length - 1]);
      setStatus('Undone.');
      return prev.slice(0, -1);
    });
  };

  const reset = () => {
    setHistory((prev) => [...prev, text]);
    setText('');
    setStatus('Cleared. Undo restores it.');
  };

  const copy = async () => {
    const ok = await copyText(text);
    setCopied(ok);
    setStatus(ok ? 'Copied to clipboard.' : 'Copying failed — select the text and copy it manually.');
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="tool-card">
      <div className="field">
        <label htmlFor="text-input">Your text</label>
        <textarea
          id="text-input"
          className="result-editable text-input"
          rows={7}
          placeholder="Paste or type anything — captions, a list of links, a block of copy…"
          value={text}
          onChange={(event) => setText(event.target.value)}
          spellCheck={false}
        />
        <p className="field-hint">
          {isEmpty ? (
            <>
              Nothing uploaded, nothing stored.{' '}
              <button type="button" className="link-button" onClick={() => { setHistory((p) => [...p, text]); setText(SAMPLE); }}>
                Load a sample
              </button>
            </>
          ) : (
            `${stats.characters.toLocaleString()} characters · ${stats.words.toLocaleString()} words · ${stats.sentences.toLocaleString()} sentences`
          )}
        </p>
      </div>

      <section aria-label="Text statistics">
        <h2 className="results-title">Live stats</h2>
        <dl className="text-stats">
          <div><dt>Characters</dt><dd>{stats.characters.toLocaleString()}</dd></div>
          <div><dt>Without spaces</dt><dd>{stats.charactersNoSpaces.toLocaleString()}</dd></div>
          <div><dt>Words</dt><dd>{stats.words.toLocaleString()}</dd></div>
          <div><dt>Unique words</dt><dd>{stats.uniqueWords.toLocaleString()}</dd></div>
          <div><dt>Sentences</dt><dd>{stats.sentences.toLocaleString()}</dd></div>
          <div><dt>Paragraphs</dt><dd>{stats.paragraphs.toLocaleString()}</dd></div>
          <div><dt>Lines</dt><dd>{stats.lines.toLocaleString()}</dd></div>
          <div><dt>Reading time</dt><dd>{stats.readingMinutes === 0 ? '—' : `${stats.readingMinutes} min`}</dd></div>
        </dl>
        <p className="field-hint">
          Reading time assumes 200 words per minute. Longest word:{' '}
          {stats.longestWord ? <code>{stats.longestWord}</code> : '—'}.
        </p>
      </section>

      {GROUP_ORDER.map((group) => (
        <fieldset className="plain-fieldset" key={group}>
          <legend className="option-label">{group}</legend>
          <div className="operation-row" role="group" aria-label={`${group} operations`}>
            {OPERATIONS.filter((op) => op.group === group).map((op) => (
              <button
                key={op.id}
                type="button"
                className="operation-btn"
                onClick={() => applyOperation(op.id)}
                disabled={isEmpty}
                title={op.hint}
              >
                <span className="operation-label">{op.label}</span>
                <span className="operation-hint">{op.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>
      ))}

      <div className="results-actions">
        <button type="button" className="btn btn-secondary btn-small" onClick={undo} disabled={history.length === 0}>
          <RefreshIcon size={16} /> Undo{history.length > 0 ? ` (${history.length})` : ''}
        </button>
        <button type="button" className="btn btn-secondary btn-small" onClick={reset} disabled={isEmpty}>
          Clear
        </button>
        <button type="button" className="btn btn-secondary btn-small" onClick={() => void copy()} disabled={isEmpty}>
          {copied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
          {copied ? 'Copied' : 'Copy result'}
        </button>
        <DownloadButton text={text} filename="biocraft-text.txt" />
      </div>

      <p className="tool-note">
        Every conversion runs in this tab. Your text is never sent anywhere, and nothing
        is saved between visits. Case changes are ASCII-aware: Devanagari, emoji and
        accented letters pass through unchanged rather than being mangled.
      </p>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
