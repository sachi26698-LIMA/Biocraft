/**
 * Copies text to the clipboard. Prefers the async Clipboard API and falls
 * back to a hidden textarea + execCommand for older or non-secure contexts.
 * Resolves to true on success, false otherwise — callers must handle both.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path (permissions, non-secure origin, etc.)
  }

  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.setAttribute('aria-hidden', 'true');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '0';
  textarea.style.opacity = '0';
  try {
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    // execCommand may not exist at all (older WebViews, jsdom).
    if (typeof document.execCommand !== 'function') return false;
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    // Always clean up — an orphan textarea leaks into the DOM otherwise.
    if (textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }
}
