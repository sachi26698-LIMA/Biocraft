import { useEffect, useRef, useState, type FormEvent } from 'react';
import { handleAnchorClick } from '../lib/router';
import { ADMIN_BASE, probeReady } from './backend';

const RESET = `${ADMIN_BASE}/auth/password-reset`;
type Stage = 'checking' | 'disabled' | 'request' | 'exchange' | 'verify' | 'done';

export default function PasswordReset() {
  const token = useRef('');
  const csrf = useRef('');
  const [stage, setStage] = useState<Stage>('checking');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    // The email link puts the one-time hash in a fragment, which is not sent
    // to Vercel or in the Referer. Remove it before any credential submission.
    if (location.hash) {
      const fragment = new URLSearchParams(location.hash.slice(1));
      const hash = fragment.get('token_hash');
      if (fragment.getAll('token_hash').length === 1 && hash && /^[A-Za-z0-9_-]{32,512}$/.test(hash)) token.current = hash;
      history.replaceState(history.state, '', '/admin/recovery');
    }
    fetch(`${RESET}/status`, { cache: 'no-store', signal: controller.signal })
      .then(probeReady)
      .then(ok => { if (!controller.signal.aborted) setStage(ok ? token.current ? 'exchange' : 'request' : 'disabled'); })
      .catch(() => { if (!controller.signal.aborted) setStage('disabled'); });
    return () => controller.abort();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || !['request', 'exchange', 'verify'].includes(stage)) return;
    if (stage === 'verify' && (password.length < 12 || new TextEncoder().encode(password).length > 72 || !/^\d{6}$/.test(code))) {
      setMessage('Enter a six-digit code and a password of at least 12 characters and at most 72 bytes.');
      return;
    }
    setBusy(true);
    setMessage('');
    const step = stage === 'verify' ? 'complete' : stage;
    const body = step === 'request' ? { email } : step === 'exchange' ? { tokenHash: token.current } : { csrf: csrf.current, password, code };
    try {
      const response = await fetch(`${RESET}/${step}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin', body: JSON.stringify(body), cache: 'no-store',
      });
      const data = await response.json().catch(() => null);
      if (step === 'request' && response.status === 202 && data?.ok === true) {
        setEmail('');
        setMessage('If this account can recover by email, a link will be sent. You will also need your current authenticator.');
      } else if (step === 'exchange' && response.ok && data?.mfa_required === true && typeof data.csrf === 'string') {
        token.current = '';
        csrf.current = data.csrf;
        setStage('verify');
      } else if (step === 'complete' && response.ok && data?.ok === true) {
        setStage('done');
      } else {
        if (step !== 'request') setStage('request');
        setMessage(response.status === 429 ? 'Too many attempts. Wait before requesting a new link.' : 'Recovery did not complete. Request a fresh link or contact the BioCraft operator.');
      }
    } catch {
      if (step !== 'request') setStage('request');
      setMessage('Recovery service could not be reached. Request a fresh link before trying again.');
    } finally {
      if (step === 'exchange') token.current = '';
      if (step === 'complete') {
        csrf.current = '';
        setPassword('');
        setCode('');
      }
      setBusy(false);
    }
  }

  return <section className="ad-auth" aria-labelledby="password-reset-title">
    <h2 id="password-reset-title">Reset Admin password</h2>
    {stage === 'checking' && <p role="status">Checking recovery availability…</p>}
    {stage === 'disabled' && <p>Password reset is not enabled on this deployment. Contact the BioCraft operator.</p>}
    {stage === 'done' && <p role="status">Password changed and Admin sessions revoked. Sign in again with your new password and authenticator.</p>}
    {['request', 'exchange', 'verify'].includes(stage) && <form className="ad-auth-form" onSubmit={submit}>
      {stage === 'request' && <label>Admin email<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} /></label>}
      {stage === 'exchange' && <p>Continue only if you requested this link and have your current authenticator.</p>}
      {stage === 'verify' && <>
        <label>Authenticator code<input required inputMode="numeric" type="text" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value)} /></label>
        <label>New password<input required type="password" autoComplete="new-password" minLength={12} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} /></label>
      </>}
      <button className="ad-btn ad-btn--primary" disabled={busy} type="submit">{busy ? 'Please wait…' : stage === 'request' ? 'Send recovery link' : stage === 'exchange' ? 'Continue recovery' : 'Change password'}</button>
    </form>}
    {message && <p role="status">{message}</p>}
    <p><a href="/admin/login" onClick={handleAnchorClick}>Back to Admin sign-in</a></p>
  </section>;
}
