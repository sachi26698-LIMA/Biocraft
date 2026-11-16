import { useEffect, useState, type FormEvent } from 'react';
import { PLATFORMS } from '../../tools/platforms';
import { useAdminContext, type BioDraftPreset } from '../context';
import { Icon } from '../icons';
import { mutate } from '../live/useLive';
import { Modal } from './Modal';
import { Badge, Field } from './Primitives';
import { useToast } from './Toast';

const QUICK_SYMBOLS = ['✨', '⚡', '👑', '🌿', '💫', '🎯', '🖤', '🔥', '•', '|', '—', '✦'];

export function BioEditorModal({
  open,
  preset,
  onClose,
}: {
  open: boolean;
  preset?: BioDraftPreset | null;
  onClose: () => void;
}) {
  const { live, bumpRefresh } = useAdminContext();
  const toast = useToast();

  const [resourceKey, setResourceKey] = useState('attitude-bio');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi' | 'hg'>('en');
  const [platform, setPlatform] = useState('instagram');
  const [active, setActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(preset?.draftId);

  useEffect(() => {
    if (!open) return;
    setResourceKey(preset?.key ?? 'attitude-bio');
    setContent(preset?.content ?? '');
    setLanguage(preset?.language ?? 'en');
    setPlatform(preset?.platform ?? 'instagram');
    setActive(preset?.active ?? true);
    setFeatured(preset?.featured ?? false);
    setError(null);
  }, [open, preset]);

  const selectedPlatform = PLATFORMS.find(p => p.id === platform) ?? PLATFORMS[0];
  const charLimit = selectedPlatform.bioLimit;
  const charCount = Array.from(content).length;
  const pct = Math.min(100, Math.round((charCount / charLimit) * 100));
  const overLimit = charCount > charLimit;
  const slugValid = /^[a-z0-9][a-z0-9_-]{0,99}$/.test(resourceKey.trim());

  function appendToken(sym: string) {
    setContent(prev => `${prev}${prev && !prev.endsWith(' ') && !prev.endsWith('\n') ? ' ' : ''}${sym}`);
  }

  async function handleCopy() {
    if (!content.trim()) return;
    try {
      await navigator.clipboard.writeText(content.trim());
      toast.push('Bio copied to clipboard', { tone: 'success' });
    } catch {
      toast.push('Clipboard access unavailable', { tone: 'warning' });
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!content.trim()) {
      setError('Enter bio content before saving.');
      return;
    }
    if (overLimit) {
      setError(`Exceeds ${selectedPlatform.name} limit of ${charLimit.toLocaleString()} characters.`);
      return;
    }
    if (!isEditing && !slugValid) {
      setError('Collection key must start with a lowercase letter or digit (a-z, 0-9, -, _).');
      return;
    }

    if (!live) {
      await handleCopy();
      toast.push('Preview mode — bio not sent to database', {
        description: 'Connect an authenticated Admin session to save reviewed drafts.',
        tone: 'info',
      });
      return;
    }

    setBusy(true);
    try {
      const bioPayload = {
        content: content.trim(),
        language,
        platform,
        active,
        featured,
      };
      if (isEditing && preset?.draftId && preset.expectedVersion) {
        await mutate(`/bio-drafts/${preset.draftId}`, {
          expectedVersion: preset.expectedVersion,
          bio: bioPayload,
        }, 'PUT');
        toast.push('Draft updated', { description: `Saved changes to ${resourceKey}.`, tone: 'success' });
      } else {
        await mutate('/bio-drafts', {
          key: resourceKey.trim(),
          bio: bioPayload,
        }, 'POST');
        toast.push('Draft created', {
          description: 'Submit it for independent review from Content & SEO.',
          tone: 'success',
        });
      }
      bumpRefresh();
      onClose();
    } catch (cause) {
      const code = (cause as { code?: string } | null)?.code;
      setError(
        code === 'FORBIDDEN'
          ? 'Your account does not have permission to create or edit drafts.'
          : code === 'CONFLICT'
            ? 'This draft changed while you were editing. Reload and try again.'
            : code === 'INVALID'
              ? 'Server validation rejected this bio. Check the collection key and character limit.'
              : 'Draft could not be saved. Nothing was written.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onClose}
      title={isEditing ? 'Edit Bio Draft' : 'Rich Bio Editor'}
      subtitle={
        live
          ? 'Drafts are saved privately and require independent review before publishing.'
          : 'Preview studio — compose & validate against real platform limits. Database writes require sign-in.'
      }
      size="lg"
      footer={
        <>
          <button type="button" className="ad-btn ad-btn--ghost" onClick={handleCopy} disabled={!content.trim()}>
            <Icon name="copy" size={14} /> Copy text
          </button>
          <button type="button" className="ad-btn ad-btn--secondary" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button
            type="submit"
            form="ad-rich-bio-form"
            className="ad-btn ad-btn--primary"
            disabled={busy || overLimit || !content.trim()}
          >
            {busy ? 'Saving…' : live ? (isEditing ? 'Save draft changes' : 'Save as private draft') : 'Copy & Preview'}
          </button>
        </>
      }
    >
      <form id="ad-rich-bio-form" onSubmit={handleSubmit} className="ad-bio-editor">
        <div className="ad-bio-editor-grid">
          <div className="ad-bio-editor-controls">
            {!isEditing && (
              <Field label="Collection / Resource Key" hint="Lowercase slug matching public collections (e.g. attitude-bio, vip-bio).">
                <input
                  type="text"
                  value={resourceKey}
                  onChange={e => setResourceKey(e.target.value.toLowerCase())}
                  placeholder="attitude-bio"
                  spellCheck={false}
                />
              </Field>
            )}

            <div className="ad-form-grid">
              <Field label="Platform">
                <select value={platform} onChange={e => setPlatform(e.target.value)}>
                  {PLATFORMS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.bioLimit.toLocaleString()} chars)
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Language">
                <select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'hi' | 'hg')}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="hg">Hinglish</option>
                </select>
              </Field>
            </div>

            <Field label="Bio Content">
              <textarea
                rows={5}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write a crisp, high-converting social bio…"
              />
            </Field>

            <div className="ad-char-meter">
              <div className="ad-char-meter-head">
                <span>{selectedPlatform.name} limit</span>
                <strong className={overLimit ? 'is-over' : ''}>
                  {charCount.toLocaleString()} / {charLimit.toLocaleString()}
                </strong>
              </div>
              <div className="ad-char-track">
                <span
                  className={`ad-char-fill ${overLimit ? 'is-over' : pct > 85 ? 'is-warn' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            <div className="ad-symbol-strip" aria-label="Quick decorative symbols">
              <span>Quick insert:</span>
              {QUICK_SYMBOLS.map(sym => (
                <button key={sym} type="button" className="ad-sym-chip" onClick={() => appendToken(sym)}>
                  {sym}
                </button>
              ))}
            </div>

            <div className="ad-toggle-row">
              <label className="ad-switch">
                <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} />
                <span>Visible to guests when published</span>
              </label>
              <label className="ad-switch">
                <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
                <span>Mark as featured</span>
              </label>
            </div>

            {error && (
              <div className="ad-inline-alert ad-inline-alert--error" role="alert">
                <Icon name="alert" size={16} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <aside className="ad-bio-preview-card" aria-label="Live profile preview">
            <div className="ad-bio-preview-top">
              <Badge tone="purple">{selectedPlatform.shortName} Preview</Badge>
              <Badge tone={live ? 'green' : 'amber'}>{live ? 'Live Draft' : 'Preview'}</Badge>
            </div>
            <div className="ad-bio-phone-mock">
              <div className="ad-bio-phone-head">
                <span className="ad-bio-phone-avatar" style={{ background: selectedPlatform.tileFrom, color: selectedPlatform.deep }}>
                  {selectedPlatform.shortName.slice(0, 1)}
                </span>
                <div>
                  <strong>@biocraft.creator</strong>
                  <small>{selectedPlatform.bioHeading}</small>
                </div>
              </div>
              <p className="ad-bio-phone-text">
                {content.trim() || 'Your formatted bio appears here in real time as you type…'}
              </p>
              <div className="ad-bio-phone-meta">
                <span>{language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Hinglish'}</span>
                <span>{featured ? '★ Featured' : 'Standard'}</span>
              </div>
            </div>
          </aside>
        </div>
      </form>
    </Modal>
  );
}
