import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '../icons';

export type ToastTone = 'success' | 'info' | 'warning' | 'error';

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
}

interface ToastContextValue {
  push: (title: string, options?: { description?: string; tone?: ToastTone; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue>({ push: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const TONE_ICON: Record<ToastTone, IconName> = {
  success: 'checkCircle',
  info: 'info',
  warning: 'alert',
  error: 'alert',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const dismiss = useCallback((id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const push = useCallback(
    (title: string, options?: { description?: string; tone?: ToastTone; duration?: number }) => {
      const id = ++seq.current;
      const tone = options?.tone ?? 'info';
      const duration = options?.duration ?? 4200;
      setItems(prev => [...prev.slice(-3), { id, title, description: options?.description, tone }]);
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="ad-toast-stack" role="region" aria-label="Notifications" aria-live="polite">
        {items.map(item => (
          <div key={item.id} className={`ad-toast ad-toast--${item.tone}`} role="status">
            <span className={`ad-toast-icon ad-toast-icon--${item.tone}`}>
              <Icon name={TONE_ICON[item.tone]} size={16} />
            </span>
            <div className="ad-toast-body">
              <strong>{item.title}</strong>
              {item.description && <p>{item.description}</p>}
            </div>
            <button
              type="button"
              className="ad-toast-close"
              aria-label="Dismiss notification"
              onClick={() => dismiss(item.id)}
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
