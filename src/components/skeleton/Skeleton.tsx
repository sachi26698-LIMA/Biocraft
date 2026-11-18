import type { CSSProperties, ReactNode } from 'react';

/**
 * Skeleton primitives — the building blocks for every context-specific
 * loading composition in `toolSkeletons.tsx`.
 *
 * Design rules (enforced here, not by convention):
 *  - Every block is `aria-hidden` — screen readers hear the wrapper's
 *    `role="status"` label, never a stream of empty divs.
 *  - Motion is a subtle opacity pulse (no sliding shimmer sweep), disabled
 *    entirely under `prefers-reduced-motion` via CSS.
 *  - Blocks reserve real geometry (fixed heights / aspect ratios) so the
 *    real content swaps in without layout shift (CLS ≈ 0).
 *  - Colours come from the design tokens (`--skel-*`), so dark mode and
 *    platform re-theming work without extra props.
 */

type SkelProps = {
  className?: string;
  style?: CSSProperties;
  /** Width override, e.g. '60%' or 120. */
  width?: CSSProperties['width'];
  /** Height override in px. */
  height?: number;
  children?: ReactNode;
};

function baseStyle({ width, height, style }: SkelProps): CSSProperties {
  const out: CSSProperties = { ...style };
  if (width !== undefined) out.width = width;
  if (height !== undefined) out.height = height;
  return out;
}

/** Generic rounded block — the atom every skeleton is composed from. */
export function SkeletonBlock({ className = '', ...props }: SkelProps) {
  return (
    <span
      aria-hidden="true"
      className={`skel skel-block ${className}`}
      style={baseStyle(props)}
    >
      {props.children}
    </span>
  );
}

/** Single text line. `width` defaults to 100%; pass '40%' for short lines. */
export function SkeletonLine({ width = '100%', height = 14, ...props }: SkelProps) {
  return <SkeletonBlock className="skel-line" width={width} height={height} {...props} />;
}

/** Circular avatar / icon placeholder. */
export function SkeletonAvatar({ size = 44, ...props }: SkelProps & { size?: number }) {
  return <SkeletonBlock className="skel-avatar" width={size} height={size} {...props} />;
}

/** Input-field placeholder matching `.field input` height (46px). */
export function SkeletonInput({ ...props }: SkelProps) {
  return <SkeletonBlock className="skel-input" height={46} {...props} />;
}

/** Textarea placeholder matching `.field textarea` (96px). */
export function SkeletonTextarea({ ...props }: SkelProps) {
  return <SkeletonBlock className="skel-textarea" height={96} {...props} />;
}

/** Primary-button placeholder (52px, full width on mobile). */
export function SkeletonButton({ width, ...props }: SkelProps) {
  return <SkeletonBlock className="skel-button" width={width} height={52} {...props} />;
}

/** Small pill / chip placeholder. */
export function SkeletonChip({ width = 88, ...props }: SkelProps) {
  return <SkeletonBlock className="skel-chip" width={width} height={38} {...props} />;
}

/** Card placeholder — padding + stacked lines, matching `.bio-card` rhythm. */
export function SkeletonCard({ lines = 2, ...props }: SkelProps & { lines?: number }) {
  return (
    <SkeletonBlock className={`skel-card ${props.className ?? ''}`} style={props.style}>
      {Array.from({ length: lines }, (_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? '55%' : '100%'} height={14} />
      ))}
    </SkeletonBlock>
  );
}

/** Row of chips (platform pills, category filters, tool tabs). */
export function SkeletonChipRow({ count = 4, ...props }: SkelProps & { count?: number }) {
  return (
    <span aria-hidden="true" className={`skel-chip-row ${props.className ?? ''}`} style={props.style}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonChip key={i} />
      ))}
    </span>
  );
}

/** Grid of square cells (symbol library). */
export function SkeletonCellGrid({ count = 24, ...props }: SkelProps & { count?: number }) {
  return (
    <span aria-hidden="true" className={`skel-cell-grid ${props.className ?? ''}`} style={props.style}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonBlock key={i} className="skel-cell" />
      ))}
    </span>
  );
}

/** Table rows (admin lists, collection grids). */
export function SkeletonRows({ count = 4, ...props }: SkelProps & { count?: number }) {
  return (
    <span aria-hidden="true" className={`skel-rows ${props.className ?? ''}`} style={props.style}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="skel-row">
          <SkeletonLine width="34%" />
          <SkeletonLine width="18%" />
          <SkeletonLine width="16%" />
          <SkeletonLine width="14%" />
        </span>
      ))}
    </span>
  );
}

/**
 * Accessible loading wrapper. Renders `role="status"` with a human label so
 * assistive tech announces "Loading …" once, while all visual blocks stay
 * hidden. `label` should name the specific surface, e.g. "Loading bio
 * generator" — never a generic "Loading…".
 */
export function SkeletonRegion({
  label,
  className = '',
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`skel-region ${className}`} role="status" aria-live="polite" aria-label={label}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}
