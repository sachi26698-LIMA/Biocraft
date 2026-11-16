import { downloadText } from '../lib/download';

export default function DownloadButton({ text, filename, label = 'Download .txt' }: { text: string; filename: string; label?: string }) {
  return (
    <button type="button" className="btn btn-secondary btn-small" disabled={!text.trim()} onClick={() => downloadText(text, filename)}>
      {label}
    </button>
  );
}
