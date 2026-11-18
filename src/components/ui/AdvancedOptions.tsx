import type { ReactNode } from 'react';
import Accordion from './Accordion';
import { useToolMode } from '../../lib/toolMode';

/**
 * Progressive-disclosure wrapper for advanced tool settings.
 *
 * Replaces the old `display:none` hiding (`[data-tool-mode='basic']
 * .tool-advanced`): the section is now always *visible* as a collapsed
 * accordion, so every feature is discoverable. In Basic mode, expanding
 * shows an honest notice + one-tap switch to Advanced (generation logic
 * still uses Basic defaults until then — no silent surprises). In Advanced
 * mode the real controls render.
 *
 * Usage:
 *   <AdvancedOptions>
 *     <SegmentedControl ... />
 *     ...advanced controls...
 *   </AdvancedOptions>
 */
export default function AdvancedOptions({
  title = 'Advanced options',
  description = 'Language, tone and extra settings',
  defaultOpen = false,
  children,
}: {
  title?: string;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const { mode, setMode } = useToolMode();

  return (
    <Accordion title={title} description={description} defaultOpen={defaultOpen} className="advanced-options">
      {mode === 'basic' ? (
        <div className="advanced-options-basic">
          <p className="advanced-options-note">
            Basic mode uses quick defaults. Switch to Advanced to customise these
            settings — your inputs stay exactly as they are.
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => setMode('advanced')}
          >
            Switch to Advanced mode
          </button>
        </div>
      ) : (
        <div className="advanced-options-body">{children}</div>
      )}
    </Accordion>
  );
}
