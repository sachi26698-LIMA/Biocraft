export const STYLE_COLLECTIONS = [
  { id: 'all', label: 'All styles', ids: null },
  { id: 'classic', label: 'Classic', ids: ['bold', 'italic', 'bold-italic', 'sans', 'sans-bold', 'sans-italic', 'sans-bold-italic', 'monospace', 'fullwidth'] },
  { id: 'script', label: 'Script & calligraphy', ids: ['script', 'bold-script', 'cursive', 'fraktur', 'bold-fraktur', 'double-struck'] },
  { id: 'enclosed', label: 'Bubbles & boxes', ids: ['circled', 'squared', 'parenthesized', 'negative-circled', 'negative-squared', 'bubble'] },
  { id: 'decorative', label: 'Decorative', ids: ['small-caps', 'subscript', 'superscript', 'aesthetic', 'decorative', 'underline', 'double-underline', 'overline', 'strikethrough', 'tilde-strike', 'slash-through', 'upside-down'] },
] as const;
