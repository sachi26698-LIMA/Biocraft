import { useId, useState } from 'react';

export interface AreaPoint {
  label: string;
  value: number;
  sublabel?: string;
}

/** Smooth Apple-inspired SVG spline area chart with interactive hover/focus tooltip. */
export function AreaChart({
  data,
  unit = '',
  ariaLabel,
  accent = '#7c4dff',
  height = 225,
}: {
  data: AreaPoint[];
  unit?: string;
  ariaLabel: string;
  accent?: string;
  height?: number;
}) {
  const gradId = useId().replace(/:/g, '');
  const [activeIndex, setActiveIndex] = useState<number>(() => Math.max(0, Math.floor(data.length * 0.65)));

  if (data.length === 0) {
    return <div className="ad-chart-empty">No chart points available.</div>;
  }

  const W = 640;
  const H = height;
  const padL = 44;
  const padR = 20;
  const padT = 26;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const maxVal = Math.max(...data.map(d => d.value), 1);
  const niceMax = niceCeiling(maxVal);
  const ticks = 4;

  const coords = data.map((pt, i) => {
    const x = data.length === 1 ? padL + plotW / 2 : padL + (i / (data.length - 1)) * plotW;
    const y = padT + plotH - (pt.value / niceMax) * plotH;
    return { x, y, ...pt };
  });

  const linePath = smoothSpline(coords);
  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`;

  const safeActive = Math.min(activeIndex, coords.length - 1);
  const focusPt = coords[safeActive];
  const tipAlignRight = focusPt.x > W * 0.68;
  const tipX = tipAlignRight ? focusPt.x - 152 : focusPt.x + 12;
  const tipY = Math.max(8, Math.min(focusPt.y - 44, H - padB - 58));

  // Show at most 7 x-axis labels so they never collide.
  const step = Math.max(1, Math.ceil(coords.length / 7));

  return (
    <div className="ad-area-chart-wrap" role="img" aria-label={ariaLabel}>
      <svg viewBox={`0 0 ${W} ${H}`} className="ad-area-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`area-${gradId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="65%" stopColor="#a78bfa" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={`stroke-${gradId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="55%" stopColor={accent} />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
          <filter id={`shadow-${gradId}`} x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#5b528c" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Horizontal gridlines + Y ticks */}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const val = Math.round((niceMax / ticks) * (ticks - i));
          const y = padT + (plotH / ticks) * i;
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#ebeef7" strokeWidth="1" strokeDasharray={i === ticks ? undefined : '3 4'} />
              <text x={padL - 10} y={y + 4} textAnchor="end" className="ad-svg-tick">
                {formatShort(val)}
              </text>
            </g>
          );
        })}

        {/* Area & Spline */}
        <path d={areaPath} fill={`url(#area-${gradId})`} />
        <path d={linePath} fill="none" stroke={`url(#stroke-${gradId})`} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Vertical indicator hairline */}
        <line
          x1={focusPt.x}
          y1={focusPt.y}
          x2={focusPt.x}
          y2={padT + plotH}
          stroke={accent}
          strokeOpacity="0.45"
          strokeWidth="1.25"
          strokeDasharray="3 3"
        />

        {/* Active glow dot */}
        <circle cx={focusPt.x} cy={focusPt.y} r="9" fill={accent} fillOpacity="0.18" />
        <circle cx={focusPt.x} cy={focusPt.y} r="4.8" fill="#ffffff" stroke={accent} strokeWidth="2.6" />

        {/* Floating Apple glass tooltip */}
        <g transform={`translate(${tipX.toFixed(1)}, ${tipY.toFixed(1)})`} filter={`url(#shadow-${gradId})`}>
          <rect width="140" height="50" rx="12" fill="rgba(255,255,255,0.96)" stroke="#e5e8f5" strokeWidth="1" />
          <text x="12" y="20" className="ad-svg-tip-title">
            {truncate(focusPt.sublabel ?? focusPt.label, 18)}
          </text>
          <circle cx="16" cy="35" r="3.5" fill={accent} />
          <text x="25" y="39" className="ad-svg-tip-val">
            {focusPt.value.toLocaleString()}
            {unit ? ` ${unit}` : ''}
          </text>
        </g>

        {/* X-axis labels */}
        {coords.map((pt, i) =>
          i % step === 0 || i === coords.length - 1 ? (
            <text key={pt.label + i} x={pt.x} y={H - 10} textAnchor="middle" className="ad-svg-tick">
              {truncate(pt.label, 10)}
            </text>
          ) : null,
        )}

        {/* Interactive hit targets */}
        {coords.map((pt, i) => {
          const slice = data.length > 1 ? plotW / (data.length - 1) : plotW;
          return (
            <rect
              key={`hit-${i}`}
              x={Math.max(padL, pt.x - slice / 2)}
              y={padT}
              width={slice}
              height={plotH}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => setActiveIndex(i)}
            />
          );
        })}
      </svg>

      {/* Keyboard accessible point strip */}
      <div className="ad-sr">
        {data.map(pt => `${pt.label}: ${pt.value}${unit ? ` ${unit}` : ''}`).join(', ')}
      </div>
    </div>
  );
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

/** Interactive SVG Donut Chart matching the attached Apple visual reference. */
export function DonutChart({
  slices,
  centerValue,
  centerLabel,
  ariaLabel,
}: {
  slices: DonutSlice[];
  centerValue: string | number;
  centerLabel: string;
  ariaLabel: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = slices.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  const radius = 56;
  const stroke = 18;
  const circumference = 2 * Math.PI * radius;

  let accumulated = 0;
  const segments = slices.map((slice, idx) => {
    const pct = total > 0 ? Math.max(0, slice.value) / total : 0;
    const length = pct * circumference;
    const offset = -accumulated;
    accumulated += length;
    return { ...slice, pct, length, offset, idx };
  });

  const activeSlice = hovered !== null ? segments[hovered] : null;

  return (
    <div className="ad-donut-wrap">
      <div className="ad-donut-ring" role="img" aria-label={ariaLabel}>
        <svg viewBox="0 0 152 152" width="152" height="152">
          <circle cx="76" cy="76" r={radius} fill="none" stroke="#f0f2fa" strokeWidth={stroke} />
          {segments.map(seg => (
            <circle
              key={seg.label}
              cx="76"
              cy="76"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={hovered === seg.idx ? stroke + 3 : stroke}
              strokeDasharray={`${Math.max(0, seg.length - 1.5)} ${circumference}`}
              strokeDashoffset={seg.offset}
              transform="rotate(-90 76 76)"
              style={{ transition: 'stroke-width 0.18s ease, opacity 0.18s ease', cursor: 'pointer', opacity: hovered !== null && hovered !== seg.idx ? 0.55 : 1 }}
              onMouseEnter={() => setHovered(seg.idx)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
        </svg>
        <div className="ad-donut-center">
          <strong>{activeSlice ? activeSlice.value.toLocaleString() : centerValue}</strong>
          <span>{activeSlice ? activeSlice.label : centerLabel}</span>
        </div>
      </div>

      <ul className="ad-donut-legend">
        {segments.map(seg => {
          const pctLabel = total > 0 ? `${Math.round(seg.pct * 100)}%` : '0%';
          return (
            <li
              key={seg.label}
              className={hovered === seg.idx ? 'is-focused' : ''}
              onMouseEnter={() => setHovered(seg.idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="ad-donut-dot" style={{ background: seg.color }} />
              <span className="ad-donut-name">{seg.label}</span>
              <strong>{pctLabel}</strong>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Crisp horizontal rounded pastel bars for distributions & limits. */
export function HorizontalBars({
  items,
  ariaLabel,
  suffix = '',
}: {
  items: { label: string; value: number; color: string; hint?: string }[];
  ariaLabel: string;
  suffix?: string;
}) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <div className="ad-hbars" role="list" aria-label={ariaLabel}>
      {items.map(item => (
        <div className="ad-hbar-row" role="listitem" key={item.label}>
          <div className="ad-hbar-head">
            <span>{item.label}</span>
            <strong>
              {item.value.toLocaleString()}
              {suffix}
            </strong>
          </div>
          <div className="ad-hbar-track">
            <span
              className="ad-hbar-fill"
              style={{
                width: `${Math.max(4, Math.round((item.value / max) * 100))}%`,
                background: item.color,
              }}
            />
          </div>
          {item.hint && <small className="ad-hbar-hint">{item.hint}</small>}
        </div>
      ))}
    </div>
  );
}

function smoothSpline(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

function niceCeiling(v: number): number {
  if (v <= 10) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const norm = v / pow;
  const step = norm <= 1.2 ? 1.2 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return Math.ceil(step * pow);
}

function formatShort(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}K`;
  return String(v);
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
