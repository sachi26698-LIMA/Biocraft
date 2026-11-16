import { useEffect, useMemo, useRef, useState } from 'react';
import { BIO_COLLECTIONS } from '../../lib/bioCollections';
import { CATEGORIES } from '../../tools/bio/data/categories';
import { PLATFORMS } from '../../tools/platforms';
import { TOOLS } from '../../tools/registry';
import { Icon, type IconName } from '../icons';
import { useAdminContext } from '../context';

interface CommandEntry {
  id: string;
  group: 'Modules' | 'Quick Actions' | 'Collections' | 'Platforms' | 'Generators' | 'Categories';
  title: string;
  subtitle: string;
  icon: IconName;
  action: () => void;
}

const MODULE_LINKS: { path: string; title: string; subtitle: string; icon: IconName }[] = [
  { path: '/admin', title: 'Overview', subtitle: 'Dashboard KPIs, charts & system status', icon: 'home' },
  { path: '/admin/bios', title: 'Bios Library', subtitle: 'Browse, filter & inspect all bios', icon: 'bios' },
  { path: '/admin/categories', title: 'Categories', subtitle: 'Content categories & labels', icon: 'categories' },
  { path: '/admin/collections', title: 'Collections', subtitle: 'Ready-made curated bio collections', icon: 'collections' },
  { path: '/admin/platforms', title: 'Platforms', subtitle: 'Platform character limits & workspaces', icon: 'platforms' },
  { path: '/admin/generators', title: 'Generators', subtitle: 'Rule-based toolkit registry', icon: 'generators' },
  { path: '/admin/content', title: 'Content & SEO', subtitle: 'Draft review workflow, publishing & SEO pages', icon: 'content' },
  { path: '/admin/users', title: 'Users & Staff', subtitle: 'Access control, roles & recovery', icon: 'users' },
  { path: '/admin/analytics', title: 'Analytics', subtitle: 'Content distribution & metrics export', icon: 'analytics' },
  { path: '/admin/audit-logs', title: 'Audit Logs', subtitle: 'Tamper-evident append-only audit trail', icon: 'audit' },
  { path: '/admin/security', title: 'Security & Roles', subtitle: 'AAL2 sessions & RBAC permission matrix', icon: 'security' },
  { path: '/admin/settings', title: 'Settings', subtitle: 'Versioned system configuration & cleanup', icon: 'settings' },
  { path: '/admin/backup', title: 'Backup & Recovery', subtitle: 'Snapshot history & data health checks', icon: 'backup' },
  { path: '/admin/login', title: 'Admin Sign-In', subtitle: 'Password + TOTP authentication', icon: 'lock' },
];

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { navigate, openBioModal } = useAdminContext();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo<CommandEntry[]>(() => {
    const go = (path: string) => () => {
      onClose();
      navigate(path);
    };
    return [
      {
        id: 'act-new-bio',
        group: 'Quick Actions',
        title: 'Add New Bio Draft',
        subtitle: 'Open the rich bio editor with live platform limits',
        icon: 'plus',
        action: () => {
          onClose();
          openBioModal();
        },
      },
      {
        id: 'act-public',
        group: 'Quick Actions',
        title: 'Open Public BioCraft Site',
        subtitle: 'Return to the live public toolkit at /',
        icon: 'external',
        action: () => {
          onClose();
          window.location.assign('/');
        },
      },
      ...MODULE_LINKS.map(m => ({
        id: `mod-${m.path}`,
        group: 'Modules' as const,
        title: m.title,
        subtitle: m.subtitle,
        icon: m.icon,
        action: go(m.path),
      })),
      ...PLATFORMS.map(p => ({
        id: `plat-${p.id}`,
        group: 'Platforms' as const,
        title: p.name,
        subtitle: `Bio limit ${p.bioLimit.toLocaleString()} chars · ${p.tools.length} tools`,
        icon: 'platforms' as const,
        action: go('/admin/platforms'),
      })),
      ...BIO_COLLECTIONS.map(c => ({
        id: `col-${c.slug}`,
        group: 'Collections' as const,
        title: c.name,
        subtitle: `/${c.slug} · ${c.bios.length} bios (${c.languages})`,
        icon: 'collections' as const,
        action: go('/admin/collections'),
      })),
      ...TOOLS.map(t => ({
        id: `tool-${t.key}`,
        group: 'Generators' as const,
        title: t.heading,
        subtitle: t.path,
        icon: 'generators' as const,
        action: go('/admin/generators'),
      })),
      ...CATEGORIES.slice(0, 12).map(cat => ({
        id: `cat-${cat.id}`,
        group: 'Categories' as const,
        title: cat.en.label,
        subtitle: `${cat.hi.label} · ${cat.hg.label}`,
        icon: 'tag' as const,
        action: go('/admin/categories'),
      })),
    ];
  }, [navigate, onClose, openBioModal]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 14);
    return entries
      .filter(e => `${e.title} ${e.subtitle} ${e.group}`.toLowerCase().includes(q))
      .slice(0, 18);
  }, [entries, query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.setTimeout(() => inputRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="ad-modal-backdrop ad-cmd-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ad-cmd" role="dialog" aria-modal="true" aria-label="Global command search">
        <div className="ad-cmd-input-row">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            placeholder="Search modules, bios, collections, platforms, tools…"
            aria-label="Global search"
            onChange={e => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive(i => Math.min(results.length - 1, i + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive(i => Math.max(0, i - 1));
              } else if (e.key === 'Enter' && results[active]) {
                e.preventDefault();
                results[active].action();
              }
            }}
          />
          <kbd className="ad-kbd">ESC</kbd>
        </div>

        <div className="ad-cmd-list" role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <div className="ad-cmd-empty">No modules, collections or tools match “{query}”.</div>
          ) : (
            results.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={idx === active}
                className={`ad-cmd-item ${idx === active ? 'is-active' : ''}`}
                onMouseEnter={() => setActive(idx)}
                onClick={item.action}
              >
                <span className="ad-cmd-item-icon">
                  <Icon name={item.icon} size={16} />
                </span>
                <span className="ad-cmd-item-copy">
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </span>
                <span className="ad-cmd-group">{item.group}</span>
              </button>
            ))
          )}
        </div>

        <div className="ad-cmd-foot">
          <span><kbd className="ad-kbd">↑↓</kbd> Navigate</span>
          <span><kbd className="ad-kbd">↵</kbd> Open</span>
          <span><kbd className="ad-kbd">⌘K</kbd> Toggle</span>
        </div>
      </div>
    </div>
  );
}
