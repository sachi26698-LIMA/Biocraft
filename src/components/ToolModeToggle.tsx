import { useToolMode } from '../lib/toolMode';

export default function ToolModeToggle() {
  const { mode, setMode } = useToolMode();
  return (
    <div className="tool-mode-toggle" role="group" aria-label="Tool mode">
      <button type="button" aria-pressed={mode === 'basic'} onClick={() => setMode('basic')}>Basic</button>
      <button type="button" aria-pressed={mode === 'advanced'} onClick={() => setMode('advanced')}>Advanced</button>
    </div>
  );
}
