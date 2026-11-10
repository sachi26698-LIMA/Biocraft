interface IconProps {
  size?: number;
}

export function CheckIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M4.5 12.5l5 5L19.5 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ClipboardIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <rect x="8" y="4" width="8" height="3" rx="1" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 5H6.5A1.5 1.5 0 0 0 5 6.5v13A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 17.5 5H16" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function RefreshIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M20 11.5A8 8 0 1 0 18.9 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 5.5v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Brand mark + platform glyphs (simplified stroke marks) ---------- */

export function LogoMark({ size = 36 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bc-logo-outer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C4B0F2" />
          <stop offset="1" stopColor="#8B4BC0" />
        </linearGradient>
        <linearGradient id="bc-logo-mid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F7B3CF" />
          <stop offset="1" stopColor="#D6538F" />
        </linearGradient>
        <linearGradient id="bc-logo-inner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9FD8EF" />
          <stop offset="1" stopColor="#3FA7C7" />
        </linearGradient>
      </defs>
      <path d="M6 25.6 24 12l18 13.6-18 13.6L6 25.6Z" fill="url(#bc-logo-outer)" />
      <path d="M24 19.4l10.8 8.2L24 35.8 13.2 27.6 24 19.4Z" fill="url(#bc-logo-mid)" opacity="0.95" />
      <circle cx="24" cy="27.6" r="3.4" fill="url(#bc-logo-inner)" />
    </svg>
  );
}

export function FacebookIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.5 21v-6.1h2.05l.31-2.38h-2.36V10.4c0-.69.19-1.16 1.19-1.16h1.27V7.15C16 7.05 15.11 7 14.07 7
        11.78 7 10.1 8.4 10.1 11v1.52H8v2.38h2.1V21h3.4Z" fill="currentColor" />
    </svg>
  );
}

export function InstagramIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.85" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.25" fill="currentColor" />
    </svg>
  );
}

export function ThreadsIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12.4 3.6c4.7 0 8 2.8 8.2 7.2.18 4.2-2.35 7.15-6.35 7.15-2.9 0-4.6-1.35-4.6-3.6 0-2.1 1.55-3.4 3.95-3.4.62 0 1.22.1 1.78.28
        .18-2.25-1.32-4.6-4.9-4.6-3.62 0-6.05 2.4-6.05 6.4 0 4.28 3.2 6.7 7.45 6.7"
        fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TikTokIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14.2 4v10.6a4.05 4.05 0 1 1-4.05-4.05" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M14.2 5.2c.5 2.7 2.45 4.35 5 4.75" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function XIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.2 5.2h3.8l5.3 7.05L18.6 5.2h2.2l-6.7 8.7 6.2 5h-3.8l-4.9-6.35-5.1 6.35H6.3l6.6-8.6-6.7-5.5Z"
        fill="currentColor" />
    </svg>
  );
}

export function LinkedInIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 9.2h3.2v10.6H4.5zM6.1 4.6a2.02 2.02 0 1 1 0 4.05 2.02 2.02 0 0 1 0-4.05Z" fill="currentColor" />
      <path d="M10.5 19.8v-6.6c0-1.95 1.2-3.1 2.95-3.1 1.95 0 2.95 1.25 2.95 3.6v6.1h-3.15v-3.3c0-.95-.4-1.55-1.35-1.55-1.05 0-1.4.7-1.4 1.7v3.15h-.95Z" fill="currentColor" />
    </svg>
  );
}

export function MenuIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 12h15M13.5 6.5 19.5 12l-6 5.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function SparkIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.5 14.6 9l6.9.3-5.3 4.4 1.8 6.6L12 16.9 6 20.3l1.8-6.6-5.3-4.4 6.9-.3L12 2.5Z"
        fill="currentColor" />
    </svg>
  );
}

/* ---------- Homepage redesign icons (stroke marks, 24px grid) ---------- */

export function ShieldCheckIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 2.5 20 7v6c0 5-3.4 9.4-8 10.5C7.4 22.4 4 18 4 13V7l8-4.5Z" />
      <path d="m9 12 2.1 2.1L15.5 10" />
    </svg>
  );
}

export function LockIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function GiftIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5.5 12.5v7a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-7" />
      <path d="M12 8.5V21" />
      <path d="M12 8.3S10.6 3.5 7.8 4a2.4 2.4 0 0 0 .4 4.3" />
      <path d="M12 8.3s1.4-4.8 4.2-4.3a2.4 2.4 0 0 1-.4 4.3" />
    </svg>
  );
}

export function ZapIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M13 2 4.5 13.5H11L9.5 22 18 10.5h-6.5L13 2Z" />
    </svg>
  );
}

export function TypeIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 6V4h14v2" />
      <path d="M12 4v16" />
      <path d="M9 20h6" />
    </svg>
  );
}

export function AtIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M16.2 12v1.8a2.3 2.3 0 0 0 4.3 1.1A7.5 7.5 0 1 0 17.5 19" />
    </svg>
  );
}

export function SmileIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 14.2s1.1 1.3 3 1.3 3-1.3 3-1.3" />
      <path d="M9.3 9.5h.01M14.7 9.5h.01" strokeWidth="2.4" />
    </svg>
  );
}

export function HashIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M9.5 3.5 7.5 20.5M16.5 3.5l-2 17" />
      <path d="M4.5 9h16M3.5 15h16" />
    </svg>
  );
}

export function QuoteIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M5.2 10.4c0-3 2-5.3 5-5.7v2.6c-1.6.4-2.4 1.6-2.6 3.1h2.6v5.6H5.2v-5.6Zm8.6 0c0-3 2-5.3 5-5.7v2.6c-1.6.4-2.4 1.6-2.6 3.1H19v5.6h-5.2v-5.6Z" />
    </svg>
  );
}

export function GridIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
    </svg>
  );
}

export function LayersIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m12 2.5 9.5 5.2L12 12.9 2.5 7.7 12 2.5Z" />
      <path d="m2.5 12.4 9.5 5.2 9.5-5.2" />
      <path d="m2.5 17 9.5 5.2 9.5-5.2" />
    </svg>
  );
}

export function RocketIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M12 15.5c4.5-3 6.5-8.5 6.5-11.5-3 0-8.5 2-11.5 6.5" />
      <path d="M12 15.5 8 16l.5 2.5" />
      <path d="M7 11 4.5 13M13 17l-2 2.5" />
      <circle cx="13.5" cy="10.5" r="1.6" />
    </svg>
  );
}

export function PhoneIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export function PlusIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function GlobeIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
    </svg>
  );
}

export function WandIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m4 20 9.5-9.5" />
      <path d="M14 3l.9 2.1L17 6l-2.1.9L14 9l-.9-2.1L11 6l2.1-.9L14 3Z" />
      <path d="M20 9l.6 1.4L22 11l-1.4.6L20 13l-.6-1.4L18 11l1.4-.6L20 9Z" />
      <path d="M17 15l.5 1.2L18.7 16.7l-1.2.5L17 18.4l-.5-1.2-1.2-.5 1.2-.5L17 15Z" />
    </svg>
  );
}

export function StarIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 3.6l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9L12 3.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
export function ChevronRightIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function HeartIcon({ size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M12 20s-7.2-4.6-9.3-9.4C1.6 7.4 4 4.6 7.1 4.6c1.9 0 3.6 1 4.9 2.6 1.3-1.6 3-2.6 4.9-2.6 3.1 0 5.5 2.8 4.4 6-2.1 4.8-9.3 9.4-9.3 9.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
export function ArrowLeftIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function ArrowUpRightIcon({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M4 11.2 12 4l8 7.2" />
      <path d="M6.5 9.8V20h11V9.8" />
      <path d="M10.5 20v-4.8h3V20" />
    </svg>
  );
}

export function InfoIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <path d="M12 7.6h.01" strokeWidth="2.5" />
    </svg>
  );
}

export function HelpIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.2a2.7 2.7 0 0 1 5.3.8c0 1.8-2.7 2.2-2.7 3.6" />
      <path d="M12 16.8h.01" strokeWidth="2.5" />
    </svg>
  );
}
