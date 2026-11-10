import type { CSSProperties } from 'react';
import { useToolkit } from '../lib/toolkit';
import { platformById } from '../tools/platforms';
import { TOOLS, toolForPath, type ToolKey } from '../tools/registry';
import { TOOL_THEMES } from '../lib/toolThemes';
import PlatformPills from './PlatformPills';
import ToolTabs from './ToolTabs';

/**
 * The unified toolkit workspace:
 *   header → platform selector → tool tabs → active tool panel.
 *
 * Platform state steers the whole experience — bio limits, headings,
 * available tools and the accent colour. The panel itself swaps without
 * reloads; only the tool body remounts.
 */
export default function ToolWorkspace({
  path,
  headingLevel,
}: {
  /** Current route path — determines which tool is shown. */
  path: string;
  /** "h1" on standalone tool routes, "h2" on the homepage. */
  headingLevel: 'h1' | 'h2';
}) {
  const { platform } = useToolkit();
  const config = platformById(platform);
  const activeTool = toolForPath(path);

  // If the active route's tool isn't available on this platform, fall back to
  // the platform's first tool for rendering purposes (URL unchanged).
  const isAvailable = config.tools.includes(activeTool.key);
  const effectiveKey: ToolKey = isAvailable ? activeTool.key : config.tools[0];
  const effectiveTool = isAvailable
    ? activeTool
    : (TOOLS.find((entry) => entry.key === effectiveKey) ?? TOOLS[0]);

  const Panel = effectiveTool.Component;

  const bio = effectiveKey === 'bio';
  const heading = bio ? config.bioHeading : effectiveTool.heading;
  const subheading = bio ? config.bioSubheading : effectiveTool.subheading;

  const Heading = headingLevel;
  const theme = TOOL_THEMES[effectiveKey];

  return (
    <section
      className="toolkit-workspace"
      id="workspace"
      aria-label="Social media toolkit workspace"
      data-platform={config.id}
      style={
        {
          '--platform-accent': config.accent,
          '--platform-on-accent': config.onAccent,
          '--platform-glow': config.accentSoft,
          '--platform-hover': config.accentHover,
          '--platform-deep': config.deep,
          '--platform-soft': config.accentSoft,
          '--platform-line': config.line,
          '--platform-tile-from': config.tileFrom,
          '--platform-tile-to': config.tileTo,
          '--tool-accent': theme.accent,
          '--tool-accent-hover': theme.accentHover,
          '--tool-deep': theme.deep,
          '--tool-soft': theme.soft,
          '--tool-line': theme.line,
          '--tool-glow': theme.glow,
          '--tool-tile-from': theme.tileFrom,
          '--tool-tile-to': theme.tileTo,
        } as CSSProperties
      }
    >
      <div className="container">
        <PlatformPills />

        <div
          className="workspace-card"
          role="region"
          aria-label={`${config.name} workspace`}
        >
          <ToolTabs activeKey={effectiveKey} keys={config.tools} captionsLabel={config.captionsLabel} />

          <div className="workspace-panel" id="tool-panel" tabIndex={-1} role="region" aria-labelledby="tool-heading">
            <header className="workspace-panel-head">
              <Heading id="tool-heading" className="workspace-heading">
                {heading}
              </Heading>
              <p className="workspace-subheading">{subheading}</p>
              {config.englishOnlyNote && bio && <p className="tool-note" role="note">{config.englishOnlyNote}</p>}
            </header>
            <Panel />
          </div>
        </div>
      </div>
    </section>
  );
}
