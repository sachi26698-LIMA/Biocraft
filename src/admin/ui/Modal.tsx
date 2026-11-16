import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Icon } from '../icons';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  children: ReactNode;
}

export function Modal({ open, onClose, title, subtitle, size = 'md', footer, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const first = focusables()[0];
    first?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'Tab') {
        const list = focusables();
        if (list.length === 0) return;
        const head = list[0];
        const tail = list[list.length - 1];
        if (event.shiftKey && document.activeElement === head) {
          event.preventDefault();
          tail.focus();
        } else if (!event.shiftKey && document.activeElement === tail) {
          event.preventDefault();
          head.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      prevActive?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ad-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={dialogRef}
        className={`ad-modal ad-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="ad-modal-head">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="ad-icon-btn" aria-label="Close dialog" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <div className="ad-modal-body">{children}</div>
        {footer && <div className="ad-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  consequence?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger' | 'warning';
  busy?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  consequence,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  busy = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className="ad-btn ad-btn--secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`ad-btn ${tone === 'danger' ? 'ad-btn--danger' : tone === 'warning' ? 'ad-btn--amber' : 'ad-btn--primary'}`}
            onClick={() => void onConfirm()}
            disabled={busy}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      <div className="ad-confirm-body">
        <span className={`ad-confirm-badge ad-confirm-badge--${tone}`}>
          <Icon name={tone === 'danger' ? 'alert' : tone === 'warning' ? 'shieldCheck' : 'checkCircle'} size={20} />
        </span>
        <div>
          <p className="ad-confirm-desc">{description}</p>
          {consequence && <p className="ad-confirm-consequence">{consequence}</p>}
        </div>
      </div>
    </Modal>
  );
}
