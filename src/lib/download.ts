/** Download user-generated text locally as a plain UTF-8 text file. */
export function downloadText(text: string, filename = 'biocraft-results.txt'): boolean {
  if (!text.trim() || typeof document === 'undefined' || typeof URL.createObjectURL !== 'function') return false;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  return true;
}
