/**
 * Icon set for the Hindi Font Ecosystem.
 *
 * The recovered implementation imported 33 glyphs from `lucide-react`. BioCraft
 * ships no icon package — every other surface draws its own inline SVG — so this
 * module reproduces exactly those 33 glyphs as stroke paths with the same
 * 24×24 / 2px-round geometry. Keeping them local means no new dependency, no
 * bundle-size surprise, and one file to audit.
 *
 * Each export accepts `size`, optional `fill` (favourite hearts), `className` and
 * `aria-hidden` behaviour identical to the original: decorative by default.
 */
import type { CSSProperties, ReactNode } from 'react';

export type IconProps = {
  size?: number;
  fill?: string;
  /** Accepted for API parity with the original icon library. */
  color?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
};

function Svg({
  size = 16,
  fill = 'none',
  color,
  className,
  style,
  title,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={color ? { color, ...style } : style}
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/** A filled variant is needed for the heart; keep stroke off so it reads solid. */
function Solid({ size = 16, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12.5l5 5L19.5 6.5" />
  </Svg>
);

export const X = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);

export const XCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </Svg>
);

export const CheckCircle2 = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.8 2.8L16 9.5" />
  </Svg>
);

export const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M20 20l-4.35-4.35" />
  </Svg>
);

export const Download = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 4v11M7.5 11l4.5 4.5L16.5 11" />
    <path d="M4.5 19.5h15" />
  </Svg>
);

export const Copy = (p: IconProps) => (
  <Svg {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M15 6.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5" />
  </Svg>
);

export const ExternalLink = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6" />
    <path d="M20 4l-8.5 8.5" />
    <path d="M19 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-12A1.5 1.5 0 0 1 4 18.5v-12A1.5 1.5 0 0 1 5.5 5H10" />
  </Svg>
);

export const Heart = ({ fill, size = 16, color, ...rest }: IconProps) =>
  fill && fill !== 'none' ? (
    <Solid size={size}>
      <path d="M12 20.3s-7.6-4.6-7.6-9.6A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.6 3.1c0 5-7.6 9.6-7.6 9.6z" />
    </Solid>
  ) : (
    <Svg size={size} color={color} {...rest}>
      <path d="M12 20.3s-7.6-4.6-7.6-9.6A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.6 3.1c0 5-7.6 9.6-7.6 9.6z" />
    </Svg>
  );

export const GitCompareArrows = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 4v12M6 20l-3-3M6 20l3-3" />
    <path d="M18 20V8M18 4l-3 3M18 4l3 3" />
  </Svg>
);

export const ShieldCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

export const Sparkles = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
    <path d="M18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
  </Svg>
);

export const RotateCcw = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 11a8 8 0 1 1 2.4 5.7" />
    <path d="M4 5.5v6h6" />
  </Svg>
);

export const RefreshCw = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 11.5A8 8 0 1 0 18.9 16" />
    <path d="M20 5.5v6h-6" />
    <path d="M4 12.5A8 8 0 0 0 5.1 8" />
    <path d="M4 18.5v-6h6" />
  </Svg>
);

export const Loader2 = ({ size = 16, className, style }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className={className}
    style={style}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
  </svg>
);

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 9.5l6 6 6-6" />
  </Svg>
);

export const BookOpen = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 6.5C10.5 5.2 8.4 4.6 5 4.6v13c3.4 0 5.5.6 7 1.9 1.5-1.3 3.6-1.9 7-1.9v-13c-3.4 0-5.5.6-7 1.9z" />
    <path d="M12 6.5v13" />
  </Svg>
);

export const FileCheck2 = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3z" />
    <path d="M13.5 3v5.5H19" />
    <path d="M9 14l1.8 1.8L15 11.5" />
  </Svg>
);

export const FileJson = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3z" />
    <path d="M13.5 3v5.5H19" />
    <path d="M10 12.5c-.8 0-1 .5-1 1.2s-.3 1.3-1 1.3c.7 0 1 .6 1 1.3s.2 1.2 1 1.2" />
    <path d="M14 12.5c.8 0 1 .5 1 1.2s.3 1.3 1 1.3c-.7 0-1 .6-1 1.3s-.2 1.2-1 1.2" />
  </Svg>
);

export const FileUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5L13.5 3z" />
    <path d="M13.5 3v5.5H19" />
    <path d="M12 18v-6M9.5 14.5L12 12l2.5 2.5" />
  </Svg>
);

export const Archive = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="4" width="17" height="4" rx="1" />
    <path d="M5 8v10.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V8" />
    <path d="M10 12h4" />
  </Svg>
);

export const Trash2 = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16" />
    <path d="M9 7V5.2A1.2 1.2 0 0 1 10.2 4h3.6A1.2 1.2 0 0 1 15 5.2V7" />
    <path d="M6 7l.9 12.1A1.5 1.5 0 0 0 8.4 20.5h7.2a1.5 1.5 0 0 0 1.5-1.4L18 7" />
    <path d="M10.5 11v6M13.5 11v6" />
  </Svg>
);

export const Pencil = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3z" />
    <path d="M14.5 6.5L17.5 9.5" />
  </Svg>
);

export const PenLine = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 4.5l6.5 6.5" />
    <path d="M4 20l1-4.5L16 4.5 19.5 8 8.5 19 4 20z" />
  </Svg>
);

export const Quote = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 6.5C6.5 7.5 5 9.7 5 12.3V18h5.5v-5.5H8c0-1.6.6-2.8 2-3.5L9 6.5z" />
    <path d="M19 6.5c-2.5 1-4 3.2-4 5.8V18h5.5v-5.5H18c0-1.6.6-2.8 2-3.5L19 6.5z" />
  </Svg>
);

export const AtSign = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M16 8v5a2.5 2.5 0 0 0 5 0v-1a9 9 0 1 0-3.5 7.2" />
  </Svg>
);

export const User = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
  </Svg>
);

export const Layers = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" />
    <path d="M4 12.5l8 4.5 8-4.5" />
    <path d="M4 16.8l8 4.5 8-4.5" />
  </Svg>
);

export const Type = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 6h14" />
    <path d="M12 6v13" />
    <path d="M9 19h6" />
  </Svg>
);

export const Flame = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3s5 4.2 5 8.6A5 5 0 0 1 7 12c0-1.6.7-3 1.7-4.2.4 1.4 1.3 2.2 2.3 2.2 1.4 0 2-1.4 1.5-3.1-.3-1.1-.9-2.3-.5-3.9z" />
  </Svg>
);

export const Film = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M8 4.5v15M16 4.5v15M3.5 9.5h4.5M3.5 14.5h4.5M16 9.5h4.5M16 14.5h4.5" />
  </Svg>
);
