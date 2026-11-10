/**
 * Minimal toast bus — no dependencies. The <Toaster /> component renders the
 * current message in a polite live region; auto-dismisses after ~2.4s.
 */
import { useEffect, useState } from 'react';

export interface ToastMessage {
  id: number;
  text: string;
}

let counter = 0;
const listeners = new Set<(toast: ToastMessage) => void>();

export function toast(text: string) {
  counter += 1;
  const message = { id: counter, text };
  for (const listener of listeners) listener(message);
}

export function useToast(): ToastMessage | null {
  const [current, setCurrent] = useState<ToastMessage | null>(null);
  useEffect(() => {
    const listener = (message: ToastMessage) => setCurrent(message);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  useEffect(() => {
    if (!current) return undefined;
    const timer = window.setTimeout(() => setCurrent(null), 2400);
    return () => window.clearTimeout(timer);
  }, [current]);
  return current;
}
