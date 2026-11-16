import type { ReactNode } from 'react';

export type IconName =
  | 'overview'
  | 'home'
  | 'bios'
  | 'categories'
  | 'collections'
  | 'platforms'
  | 'generators'
  | 'content'
  | 'users'
  | 'analytics'
  | 'audit'
  | 'security'
  | 'settings'
  | 'backup'
  | 'search'
  | 'bell'
  | 'menu'
  | 'sidebar'
  | 'arrow'
  | 'chevronRight'
  | 'chevronLeft'
  | 'chevronDown'
  | 'user'
  | 'server'
  | 'sparkles'
  | 'plus'
  | 'close'
  | 'lock'
  | 'check'
  | 'checkCircle'
  | 'layers'
  | 'bolt'
  | 'tag'
  | 'eye'
  | 'pulse'
  | 'database'
  | 'code'
  | 'refresh'
  | 'upload'
  | 'download'
  | 'transfer'
  | 'shieldCheck'
  | 'external'
  | 'calendar'
  | 'sparkle'
  | 'play'
  | 'copy'
  | 'edit'
  | 'trash'
  | 'filter'
  | 'logout'
  | 'key'
  | 'alert'
  | 'info'
  | 'grid'
  | 'list'
  | 'more'
  | 'trendUp'
  | 'fileText'
  | 'clock';

const PATHS: Record<IconName, ReactNode> = {
  overview: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  ),
  bios: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m3.5 12 8.5 4.5 8.5-4.5" />
      <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
    </>
  ),
  categories: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.8" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.8" />
    </>
  ),
  collections: (
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v8A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10Z" />
      <path d="M8.5 13h7" />
    </>
  ),
  platforms: (
    <>
      <rect x="3" y="4" width="18" height="12.5" rx="2.5" />
      <path d="M8.5 20h7M12 16.5V20" />
    </>
  ),
  generators: (
    <>
      <path d="m12 3 1.7 5.1L19 9.8l-5.3 1.7L12 16.6l-1.7-5.1L5 9.8l5.3-1.7L12 3Z" />
      <path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
    </>
  ),
  content: (
    <>
      <path d="M6 3.5h8.5L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8.5h5M8.5 12.5h7M8.5 16h5" />
    </>
  ),
  users: (
    <>
      <circle cx="9.5" cy="8" r="3.2" />
      <path d="M3.5 19.5v-.8a5.8 5.8 0 0 1 12 0v.8" />
      <circle cx="17" cy="8.5" r="2.3" />
      <path d="M17.5 13.8a4.2 4.2 0 0 1 3.5 4.2v1.5" />
    </>
  ),
  analytics: (
    <>
      <path d="M4.5 20V12M10 20V5M15.5 20v-8.5M21 20H3" />
    </>
  ),
  audit: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  security: (
    <>
      <path d="M12 3 4.5 6v5.2c0 4.8 3.2 8.2 7.5 9.8 4.3-1.6 7.5-5 7.5-9.8V6L12 3Z" />
      <path d="m9.2 12.2 2 2 3.8-4.2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>
  ),
  backup: (
    <>
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
      <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </>
  ),
  bell: (
    <>
      <path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9Z" />
      <path d="M10.3 19.5a2 2 0 0 0 3.4 0" />
    </>
  ),
  menu: <path d="M4 6.5h16M4 12h16M4 17.5h16" />,
  sidebar: (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="3" />
      <path d="M9.5 4v16" />
    </>
  ),
  arrow: <path d="M5 12h14m-5.5-5.5L19 12l-5.5 5.5" />,
  chevronRight: <path d="m9.5 6.5 5.5 5.5-5.5 5.5" />,
  chevronLeft: <path d="m14.5 6.5-5.5 5.5 5.5 5.5" />,
  chevronDown: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20v-1a7 7 0 0 1 14 0v1" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="6.5" rx="2" />
      <rect x="3" y="13.5" width="18" height="6.5" rx="2" />
      <circle cx="7" cy="7.25" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="7" cy="16.75" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7Z" />
      <path d="m19 15 .7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5" />
    </>
  ),
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  checkCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.8 12.2 2.2 2.2 4.5-4.7" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 13.5h6.5L10.5 21.5 19.5 10.5H13V2.5Z" />,
  tag: (
    <>
      <path d="M12.6 3.5H6a2.5 2.5 0 0 0-2.5 2.5v6.6a2 2 0 0 0 .59 1.41l6.4 6.4a2 2 0 0 0 2.83 0l5.09-5.09a2 2 0 0 0 0-2.83l-6.4-6.4a2 2 0 0 0-1.41-.59Z" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  pulse: <path d="M3 12h4l2.5-6.5 4 13L16 12h5" />,
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13" />
      <path d="M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
    </>
  ),
  code: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />,
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.5-4.5L3.5 9" />
      <path d="M3.5 4.5V9H8" />
      <path d="M4 13a8 8 0 0 0 14.5 4.5L20.5 15" />
      <path d="M20.5 19.5V15H16" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V6m0 0-4 4m4-4 4 4" />
      <path d="M4.5 16.5v2A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 2-2v-2" />
    </>
  ),
  download: (
    <>
      <path d="M12 5v10m0 0-4-4m4 4 4-4" />
      <path d="M4.5 16.5v2A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 2-2v-2" />
    </>
  ),
  transfer: (
    <>
      <path d="M7 8h12m0 0-3.5-3.5M19 8l-3.5 3.5" />
      <path d="M17 16H5m0 0 3.5-3.5M5 16l3.5 3.5" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3 4.5 6v5.2c0 4.8 3.2 8.2 7.5 9.8 4.3-1.6 7.5-5 7.5-9.8V6L12 3Z" />
      <path d="m9.2 12.2 2 2 3.8-4.2" />
    </>
  ),
  external: (
    <>
      <path d="M14 5h5v5M19 5l-8.5 8.5" />
      <path d="M18.5 14v4.5a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1H10" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3.5V6.5M16 3.5V6.5M3.5 10h17" />
    </>
  ),
  sparkle: <path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />,
  play: <polygon points="7.5,5.5 18.5,12 7.5,18.5" fill="none" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h8.5" />
      <path d="M16.5 4.2a2.1 2.1 0 0 1 3 3L8.2 18.5 4 19.5l1-4.2L16.5 4.2Z" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V4.5h5V7M7 7l1 13h8l1-13" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  logout: (
    <>
      <path d="M15 16.5 19.5 12 15 7.5M19.5 12H9.5" />
      <path d="M10.5 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h4.5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="14" r="4" />
      <path d="m11 11 8.5-8.5M16.5 5.5l2.5 2.5M14 8l2 2" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.8 2.8 19.5a1 1 0 0 0 .87 1.5h16.66a1 1 0 0 0 .87-1.5L12 3.8Z" />
      <path d="M12 10v4.5M12 17.5h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 8h.01" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  list: <path d="M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01" />,
  more: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 10.8 3 3 3-3" />
    </>
  ),
  trendUp: (
    <>
      <path d="m4 16 5.5-5.5 3.5 3.5L20 7" />
      <path d="M14.5 7H20v5.5" />
    </>
  ),
  fileText: (
    <>
      <path d="M6 3.5h8.5L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8.5h5M8.5 13h7M8.5 16.5h4.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </>
  ),
};

export function Icon({ name, size = 18, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
