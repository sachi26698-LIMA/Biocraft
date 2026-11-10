import { useToast } from '../lib/toast';

/** Fixed bottom-center toast; polite live region. */
export default function Toaster() {
  const current = useToast();
  if (!current) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      {current.text}
    </div>
  );
}
