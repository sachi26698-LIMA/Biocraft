/**
 * Admin sign-in flow — Apple-inspired light security card.
 * Posts credentials to the same-origin Admin server only; the server exchanges
 * them with Supabase Auth and returns an HttpOnly cookie. Passwords and TOTP
 * codes are never stored, logged or put in a URL, and the form refuses to
 * submit when the backend probe reports `unavailable`.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ADMIN_BASE, probeBackend, type BackendStatus } from './backend';
import { Icon } from './icons';
import { Badge } from './ui/Primitives';

type Stage = 'checking' | 'signin' | 'enrol' | 'mfa' | 'recover' | 'recovered' | 'done' | 'blocked';

export default function Login({ onAuthenticated }: { onAuthenticated?: () => void }) {
  const [status, setStatus] = useState<BackendStatus>('unavailable');
  const [stage, setStage] = useState<Stage>('checking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [otpauthUri, setOtpauthUri] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const csrf = useRef<string>('');
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    probeBackend(controller.signal)
      .then(result => {
        if (!mounted.current) return;
        setStatus(result);
        if (result === 'unavailable') {
          setStage('blocked');
          return;
        }
        if (result === 'ready') {
          setStage('done');
          onAuthenticated?.();
          return;
        }
        setStage('signin');
      })
      .catch(() => {
        if (mounted.current) {
          setStatus('unavailable');
          setStage('blocked');
        }
      });
    return () => {
      mounted.current = false;
      controller.abort();
    };
  }, [onAuthenticated]);

  const post = useCallback(async (path: string, body: Record<string, string>) => {
    const response = await fetch(`${ADMIN_BASE}/auth/${path}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json().catch(() => null);
    return { ok: response.ok, status: response.status, data };
  }, []);

  async function submitCredentials(event: FormEvent) {
    event.preventDefault();
    if (stage !== 'signin' || busy) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await post('login', { email: email.trim(), password });
      if (!mounted.current) return;
      if (!result.ok || typeof result.data?.csrf !== 'string') {
        setMessage(messageFor(result.status, result.data?.error?.code));
        return;
      }
      csrf.current = result.data.csrf;
      setPassword('');
      if (result.data?.enrolment === true) {
        setStage('enrol');
        void beginEnrolment(result.data.csrf);
        return;
      }
      if (result.data?.recovery === true) {
        setStage('recover');
        return;
      }
      setStage('mfa');
    } catch {
      if (mounted.current) setMessage('The Admin service could not be reached. Try again later.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  async function beginEnrolment(token: string) {
    setBusy(true);
    try {
      const result = await post('enroll', { csrf: token });
      if (!mounted.current) return;
      if (!result.ok || typeof result.data?.csrf !== 'string' || typeof result.data?.otpauth_uri !== 'string') {
        setMessage(messageFor(result.status, result.data?.error?.code));
        return;
      }
      csrf.current = result.data.csrf;
      setOtpauthUri(result.data.otpauth_uri);
    } catch {
      if (mounted.current) setMessage('Enrolment could not be started. Try again later.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  async function submitEnrolment(event: FormEvent) {
    event.preventDefault();
    if (stage !== 'enrol' || busy || !/^\d{6,8}$/.test(code) || !otpauthUri) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await post('enroll-confirm', { code, csrf: csrf.current });
      if (!mounted.current) return;
      if (!result.ok) {
        setMessage(messageFor(result.status, result.data?.error?.code));
        setCode('');
        return;
      }
      setCode('');
      csrf.current = '';
      setOtpauthUri('');
      setStage('done');
      onAuthenticated?.();
    } catch {
      if (mounted.current) setMessage('Enrolment could not be completed. Try again later.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  async function submitRecovery(event: FormEvent) {
    event.preventDefault();
    if (stage !== 'recover' || busy || !/^[0-9a-z]{4}-?[0-9a-z]{4}-?[0-9a-z]{4}$/i.test(recoveryCode.trim())) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await post('recovery/complete', { code: recoveryCode.trim(), csrf: csrf.current });
      if (!mounted.current) return;
      setRecoveryCode('');
      csrf.current = '';
      if (!result.ok) {
        setMessage(messageFor(result.status, result.data?.error?.code));
        return;
      }
      setStage('recovered');
    } catch {
      if (mounted.current) setMessage('Recovery could not be completed. Try again later.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  async function submitCode(event: FormEvent) {
    event.preventDefault();
    if (stage !== 'mfa' || busy || !/^\d{6,8}$/.test(code)) return;
    setBusy(true);
    setMessage('');
    try {
      const result = await post('mfa', { code, csrf: csrf.current });
      if (!mounted.current) return;
      if (!result.ok) {
        setMessage(messageFor(result.status, result.data?.error?.code));
        setCode('');
        return;
      }
      setCode('');
      csrf.current = '';
      setStage('done');
      onAuthenticated?.();
    } catch {
      if (mounted.current) setMessage('Verification could not be completed. Try again later.');
    } finally {
      if (mounted.current) setBusy(false);
    }
  }

  const badge = (
    <div className="ad-auth-head">
      <span className="ad-auth-orb" aria-hidden="true">
        <Icon name="shieldCheck" size={22} />
      </span>
      <Badge tone={stage === 'done' ? 'green' : stage === 'blocked' ? 'amber' : 'purple'}>
        {stage === 'done' ? 'AAL2 Active' : stage === 'blocked' ? 'Not configured' : 'TOTP Protected'}
      </Badge>
    </div>
  );

  if (stage === 'blocked') {
    return (
      <section className="ad-auth" aria-labelledby="admin-auth-title">
        {badge}
        <h2 id="admin-auth-title">Sign-in is not available</h2>
        <p>
          This deployment does not have an enabled Admin backend, so no credentials can be accepted. Nothing typed here
          is transmitted or stored.
        </p>
        <p className="ad-auth-note">Backend status: {status === 'unavailable' ? 'not configured' : 'unexpected response'}.</p>
      </section>
    );
  }

  if (stage === 'done') {
    return (
      <section className="ad-auth" aria-live="polite">
        {badge}
        <h2>Signed in</h2>
        <p>Your Admin session is active and bound to this browser via an HttpOnly, SameSite=Strict cookie.</p>
      </section>
    );
  }

  if (stage === 'checking') {
    return (
      <section className="ad-auth" aria-live="polite">
        {badge}
        <p role="status">Checking Admin service…</p>
      </section>
    );
  }

  if (stage === 'recover') {
    return (
      <section className="ad-auth" aria-labelledby="admin-auth-title">
        {badge}
        <h2 id="admin-auth-title">Authenticator recovery</h2>
        <p>
          This account has an authenticator that is no longer available. A Super Admin must authorise recovery before a
          code can be used, and the code works once.
        </p>
        <form onSubmit={submitRecovery} noValidate>
          <label htmlFor="admin-recovery-code">Recovery code</label>
          <input
            id="admin-recovery-code"
            name="recovery-code"
            autoComplete="off"
            spellCheck={false}
            maxLength={14}
            required
            value={recoveryCode}
            onChange={e => setRecoveryCode(e.target.value.replace(/[^0-9a-z-]/gi, '').slice(0, 14))}
            disabled={busy}
            autoFocus
          />
          <button
            type="submit"
            className="ad-btn ad-btn--primary ad-btn--block"
            disabled={busy || !/^[0-9a-z]{4}-?[0-9a-z]{4}-?[0-9a-z]{4}$/i.test(recoveryCode.trim())}
          >
            {busy ? 'Submitting…' : 'Submit recovery code'}
          </button>
        </form>
        <p className="ad-auth-note">
          No code, or an expired one? Ask a Super Admin to issue a new recovery code. Sign-in stays closed until then.
        </p>
        {message && (
          <p className="ad-auth-error" role="alert">
            {message}
          </p>
        )}
      </section>
    );
  }

  if (stage === 'recovered') {
    return (
      <section className="ad-auth" aria-live="polite">
        {badge}
        <h2>Recovery authorised</h2>
        <p>
          Your recovery was recorded. An operator must now remove the lost authenticator from the account; after that,
          sign in again to enrol a new one.
        </p>
        <p className="ad-auth-note">No session was created by this step, and your password has not changed.</p>
      </section>
    );
  }

  if (stage === 'enrol') {
    return (
      <section className="ad-auth" aria-labelledby="admin-auth-title">
        {badge}
        <h2 id="admin-auth-title">Set up your authenticator</h2>
        {otpauthUri ? (
          <>
            <p>Add this account to your authenticator app, then enter the 6-digit code it shows.</p>
            <p className="ad-auth-uri">
              <span>Setup key</span>
              <code>{setupKey(otpauthUri)}</code>
            </p>
            <form onSubmit={submitEnrolment} noValidate>
              <label htmlFor="admin-code">6–8 digit code</label>
              <input
                id="admin-code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6,8}"
                required
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                disabled={busy}
                autoFocus
              />
              <button type="submit" className="ad-btn ad-btn--primary ad-btn--block" disabled={busy || !/^\d{6,8}$/.test(code)}>
                {busy ? 'Confirming…' : 'Confirm and sign in'}
              </button>
            </form>
          </>
        ) : (
          <p role="status">{busy ? 'Preparing enrolment…' : 'Enrolment is unavailable for this account.'}</p>
        )}
        {message && (
          <p className="ad-auth-error" role="alert">
            {message}
          </p>
        )}
        <p className="ad-auth-note">
          This is a one-time setup step. The key is shown only on this screen and is not stored in your browser.
        </p>
      </section>
    );
  }

  return (
    <section className="ad-auth" aria-labelledby="admin-auth-title">
      {badge}
      <h2 id="admin-auth-title">{stage === 'mfa' ? 'Enter your authenticator code' : 'Admin sign-in'}</h2>
      {stage === 'signin' ? (
        <form onSubmit={submitCredentials} noValidate>
          <label htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="admin@biocraft.app"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={busy}
          />
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••••"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={busy}
          />
          <button
            type="submit"
            className="ad-btn ad-btn--primary ad-btn--block"
            disabled={busy || !email.includes('@') || password.length < 1}
          >
            {busy ? 'Signing in…' : 'Continue'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitCode} noValidate>
          <label htmlFor="admin-code">6–8 digit code</label>
          <input
            id="admin-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6,8}"
            placeholder="000000"
            required
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
            disabled={busy}
            autoFocus
          />
          <button type="submit" className="ad-btn ad-btn--primary ad-btn--block" disabled={busy || !/^\d{6,8}$/.test(code)}>
            {busy ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      )}
      {message && (
        <p className="ad-auth-error" role="alert">
          {message}
        </p>
      )}
      <p className="ad-auth-note">
        Password sign-in with authenticator-app verification is required. Sessions last at most one hour.
      </p>
    </section>
  );
}

function setupKey(uri: string): string {
  try {
    return new URL(uri).searchParams.get('secret') ?? '—';
  } catch {
    return '—';
  }
}

function messageFor(status: number, code?: string): string {
  if (status === 429 || code === 'RATE_LIMITED') return 'Too many attempts. Wait a few minutes before trying again.';
  if (status === 401 || code === 'UNAUTHENTICATED') return 'Those credentials were not accepted.';
  if (status === 403) return 'This account is not permitted to use the Admin workspace.';
  if (status === 503) return 'The Admin service is temporarily unavailable.';
  return 'The request could not be completed.';
}
