import { useCallback, useEffect, useRef, useState } from 'react';
import { copyText } from '../lib/clipboard';

export type CopyState = 'idle' | 'copied' | 'failed';

/**
 * Copy-to-clipboard with per-button feedback state. The state automatically
 * returns to "idle" after `timeout` ms and is cleared on unmount.
 */
export function useCopyToClipboard(timeout = 2000) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      const succeeded = await copyText(text);
      setState(succeeded ? 'copied' : 'failed');
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => setState('idle'), timeout);
    },
    [timeout],
  );

  return { state, copy };
}
