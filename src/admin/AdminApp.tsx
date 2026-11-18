/**
 * BioCraft Master Admin v2.0 — Apple-inspired bright light-only console shell.
 *
 * Strict Light Theme Only: Zero dark mode toggle, zero dark theme CSS,
 * pure white / soft lavender-white surfaces, frosted glass topbar & sidebar,
 * Cmd+K Spotlight search, notification bell & profile menus, collapsible sidebar
 * organized into Overview / Content / People / Insights / System across all 13
 * modules, mobile drawer with focus trap, and mobile bottom navigation bar.
 *
 * Dual-mode architecture preserved cleanly:
 * - When /api/admin/v1/health answers → live Supabase-backed modules.
 * - When /api/admin/v1/health is unreachable → honest read-only Preview mode.
 */
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { handleAnchorClick, navigate as routerNavigate, usePath } from '../lib/router';
import { currentSession, logoutSession, probeBackend, type AdminSession, type BackendStatus } from './backend';
import { AdminContext, type BioDraftPreset } from './context';
import { Icon, type IconName } from './icons';
import type { NotificationRow } from './live/types';
import { formatDate, mutate, request } from './live/useLive';
import Login from './Login';
import { BioEditorModal } from './ui/BioEditorModal';
import { CommandPalette } from './ui/CommandPalette';
import { Badge, PageHead, SkeletonStats } from './ui/Primitives';
import { ToastProvider, useToast } from './ui/Toast';
import './admin.css';

// Lazy-loaded Live modules for fast route switching & minimal bundle on first paint
const LiveOverview = lazy(() => import('./live/Overview'));
const LiveBiosLibrary = lazy(() => import('./live/Library'));
const LiveCategories = lazy(() => import('./live/Catalog').then(m => ({ default: m.Categories })));
const LiveCollections = lazy(() => import('./live/Catalog').then(m => ({ default: m.LiveCollections })));
const LivePlatforms = lazy(() => import('./live/Catalog').then(m => ({ default: m.Platforms })));
const LiveGenerators = lazy(() => import('./live/Catalog').then(m => ({ default: m.Generators })));
const LiveSeoPages = lazy(() => import('./live/Catalog').then(m => ({ default: m.SeoPages })));
const LiveContent = lazy(() => import('./live/Content'));
const LiveUsers = lazy(() => import('./live/Users'));
const LiveAnalytics = lazy(() => import('./live/Analytics'));
const LiveAuditLogs = lazy(() => import('./live/AuditLogs'));
const LiveSecurity = lazy(() => import('./live/Security'));
const LiveSettings = lazy(() => import('./live/Settings'));
const LiveBackup = lazy(() => import('./live/Backup'));

// Lazy-loaded Preview modules (read-only bundled data)
const PreviewOverview = lazy(() => import('./preview/PreviewOverview'));
const PreviewBioLibrary = lazy(() => import('./preview/PreviewCatalog').then(m => ({ default: m.PreviewBioLibrary })));
const PreviewCategories = lazy(() => import('./preview/PreviewCatalog').then(m => ({ default: m.PreviewCategories })));
const PreviewCollections = lazy(() => import('./preview/PreviewCatalog').then(m => ({ default: m.PreviewCollections })));
const PreviewPlatforms = lazy(() => import('./preview/PreviewCatalog').then(m => ({ default: m.PreviewPlatforms })));
const PreviewGenerators = lazy(() => import('./preview/PreviewCatalog').then(m => ({ default: m.PreviewGenerators })));
const PreviewRestricted = lazy(() => import('./preview/PreviewRestricted'));

type NavKey =
  | 'overview'
  | 'bios'
  | 'categories'
  | 'collections'
  | 'platforms'
  | 'generators'
  | 'content'
  | 'users'
  | 'analytics'
  | 'audit-logs'
  | 'security'
  | 'settings'
  | 'backup';

type NavSection = 'OVERVIEW' | 'CONTENT' | 'PEOPLE' | 'INSIGHTS' | 'SYSTEM';

interface NavItem {
  key: NavKey;
  label: string;
  shortLabel: string;
  path: string;
  icon: IconName;
  section: NavSection;
  keywords: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { key: 'overview', label: 'Overview', shortLabel: 'Home', path: '/admin', icon: 'overview', section: 'OVERVIEW', keywords: 'dashboard home kpi summary status' },
  { key: 'bios', label: 'Bios Library', shortLabel: 'Bios', path: '/admin/bios', icon: 'bios', section: 'CONTENT', keywords: 'bio text library copy catalog search' },
  { key: 'categories', label: 'Categories', shortLabel: 'Categories', path: '/admin/categories', icon: 'categories', section: 'CONTENT', keywords: 'niche taxonomy labels generator' },
  { key: 'collections', label: 'Collections', shortLabel: 'Collections', path: '/admin/collections', icon: 'collections', section: 'CONTENT', keywords: 'curated sets groups showcase slugs' },
  { key: 'platforms', label: 'Platforms', shortLabel: 'Platforms', path: '/admin/platforms', icon: 'platforms', section: 'CONTENT', keywords: 'instagram tiktok linkedin x twitter whatsapp snapchat facebook threads' },
  { key: 'generators', label: 'Generators', shortLabel: 'Tools', path: '/admin/generators', icon: 'generators', section: 'CONTENT', keywords: 'tools bio generator caption hashtag username' },
  { key: 'content', label: 'Content & SEO', shortLabel: 'Content', path: '/admin/content', icon: 'content', section: 'CONTENT', keywords: 'drafts review publish seo pages metadata workflow' },
  { key: 'users', label: 'Users & Staff', shortLabel: 'Users', path: '/admin/users', icon: 'users', section: 'PEOPLE', keywords: 'staff team accounts roles recovery totp' },
  { key: 'analytics', label: 'Analytics', shortLabel: 'Analytics', path: '/admin/analytics', icon: 'analytics', section: 'INSIGHTS', keywords: 'metrics stats counts export csv json charts' },
  { key: 'audit-logs', label: 'Audit Logs', shortLabel: 'Audit', path: '/admin/audit-logs', icon: 'audit', section: 'INSIGHTS', keywords: 'history events ledger tamper evident logs' },
  { key: 'security', label: 'Security & Roles', shortLabel: 'Security', path: '/admin/security', icon: 'security', section: 'INSIGHTS', keywords: 'rbac permissions mfa aal2 sessions revoke' },
  { key: 'settings', label: 'Settings', shortLabel: 'Settings', path: '/admin/settings', icon: 'settings', section: 'SYSTEM', keywords: 'configuration flags maintenance cleanup' },
  { key: 'backup', label: 'Backup & Recovery', shortLabel: 'Backup', path: '/admin/backup', icon: 'backup', section: 'SYSTEM', keywords: 'snapshot restore health recovery database' },
];

const NAV_GROUPS: readonly { section: NavSection; label: string }[] = [
  { section: 'OVERVIEW', label: 'OVERVIEW' },
  { section: 'CONTENT', label: 'CONTENT' },
  { section: 'PEOPLE', label: 'PEOPLE' },
  { section: 'INSIGHTS', label: 'INSIGHTS' },
  { section: 'SYSTEM', label: 'SYSTEM' },
];

function RouteFallback() {
  return (
    <div className="ad-route-loading" role="status" aria-label="Loading module">
      <SkeletonStats count={4} />
      <div className="ad-panel ad-skeleton">
        <span>Loading workspace module…</span>
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </div>
    </div>
  );
}

function AdminShell() {
  const path = usePath();
  const toast = useToast();

  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [bioPreset, setBioPreset] = useState<BioDraftPreset | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [notifLoaded, setNotifLoaded] = useState(false);

  const [backend, setBackend] = useState<BackendStatus>('unavailable');
  const [probed, setProbed] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const probedOnce = useRef(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const loadSession = useCallback(async () => {
    try {
      const data = await currentSession();
      setSession(data);
    } catch {
      setSession(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    const result = await probeBackend();
    setBackend(result);
    setProbed(true);
    if (result === 'ready') {
      await loadSession();
    } else {
      setSession(null);
    }
  }, [loadSession]);

  // Single-shot mount probe (avoids React StrictMode double fetch)
  useEffect(() => {
    if (probedOnce.current) return;
    probedOnce.current = true;
    const controller = new AbortController();
    probeBackend(controller.signal)
      .then(result => {
        if (controller.signal.aborted) return;
        setBackend(result);
        setProbed(true);
        if (result === 'ready') void loadSession();
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setBackend('unavailable');
          setProbed(true);
        }
      });
    return () => controller.abort();
  }, [loadSession]);

  const live = backend === 'ready' || backend === 'unauthenticated';

  // Fetch notifications when bell opens in live ready state
  useEffect(() => {
    if (!notifOpen || backend !== 'ready' || notifLoaded) return;
    request<{ items: NotificationRow[] }>('/notifications?limit=12')
      .then(res => {
        setNotifications(res.items ?? []);
        setNotifLoaded(true);
      })
      .catch(() => setNotifLoaded(true));
  }, [notifOpen, backend, notifLoaded]);

  // Document title & strict light color-scheme
  useEffect(() => {
    document.title = 'Admin — BioCraft';
    document.documentElement.style.colorScheme = 'light';
    return () => {
      document.title = 'BioCraft — All-in-One Social Media Toolkit';
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
    setProfileOpen(false);
  }, [path]);

  // Global Cmd+K / Ctrl+K Spotlight shortcut + outside click for popovers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(open => !open);
        setNotifOpen(false);
        setProfileOpen(false);
      }
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  // Mobile drawer focus trap & scroll lock
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const links = () => Array.from(sidebarRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []);
    links()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
      }
      if (event.key === 'Tab') {
        const focusable = links();
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (first && last && event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (first && last && !event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      if (window.innerWidth <= 900) menuButton.current?.focus();
    };
  }, [menuOpen]);

  const navigate = useCallback((to: string) => {
    routerNavigate(to);
  }, []);

  const bumpRefresh = useCallback(() => {
    setRefreshTick(t => t + 1);
  }, []);

  const openBioModal = useCallback(
    (preset?: BioDraftPreset) => {
      if (backend === 'ready' || !live) {
        setBioPreset(preset ?? null);
        setBioModalOpen(true);
      } else {
        toast.push('Sign in to create bio drafts', { description: 'Authenticate with your TOTP factor first.', tone: 'info' });
        navigate('/admin/login');
      }
    },
    [backend, live, navigate, toast],
  );

  const handleSignOut = async () => {
    setProfileOpen(false);
    try {
      await logoutSession();
      toast.push('Signed out cleanly', { tone: 'info' });
    } catch {
      toast.push('Could not confirm sign-out. Retry before leaving this device.', { tone: 'error' });
      return;
    }
    setSession(null);
    setBackend('unauthenticated');
    navigate('/admin/login');
  };

  const markNotificationsRead = async () => {
    const unreadIds = notifications.filter(n => n.unread).map(n => n.id);
    if (unreadIds.length === 0) return;
    try {
      await mutate('/notifications/read', {});
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      toast.push('Notifications marked as read', { tone: 'success' });
    } catch {
      toast.push('Could not mark notifications read', { tone: 'error' });
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const activeNav = NAV_ITEMS.find(n => n.path === path);

  let content: ReactNode;
  if (!activeNav && path === '/admin/login') {
    content = (
      <>
        <PageHead
          eyebrow="ADMIN ACCESS"
          title="Sign in"
          description="Server-side password and authenticator verification is required to use the Admin workspace."
        />
        <Login onAuthenticated={refreshSession} />
      </>
    );
  } else if (!activeNav) {
    content = (
      <>
        <PageHead eyebrow="NOT FOUND" title="Page not found" description="This workspace page doesn’t exist." />
        <a className="ad-btn ad-btn--primary" href="/admin" onClick={handleAnchorClick}>
          Back to overview <Icon name="arrow" size={15} />
        </a>
      </>
    );
  } else if (live) {
    switch (activeNav.key) {
      case 'overview':
        content = <LiveOverview key={refreshTick} />;
        break;
      case 'bios':
        content = <LiveBiosLibrary key={refreshTick} />;
        break;
      case 'categories':
        content = (
          <>
            <LiveCategories />
            <LiveSeoPages />
          </>
        );
        break;
      case 'collections':
        content = <LiveCollections />;
        break;
      case 'platforms':
        content = <LivePlatforms />;
        break;
      case 'generators':
        content = <LiveGenerators />;
        break;
      case 'content':
        content = <LiveContent key={refreshTick} />;
        break;
      case 'users':
        content = <LiveUsers />;
        break;
      case 'analytics':
        content = <LiveAnalytics />;
        break;
      case 'audit-logs':
        content = <LiveAuditLogs />;
        break;
      case 'security':
        content = <LiveSecurity />;
        break;
      case 'settings':
        content = <LiveSettings />;
        break;
      case 'backup':
        content = <LiveBackup />;
        break;
    }
  } else {
    switch (activeNav.key) {
      case 'overview':
        content = <PreviewOverview />;
        break;
      case 'bios':
        content = <PreviewBioLibrary />;
        break;
      case 'categories':
        content = <PreviewCategories />;
        break;
      case 'collections':
        content = <PreviewCollections />;
        break;
      case 'platforms':
        content = <PreviewPlatforms />;
        break;
      case 'generators':
        content = <PreviewGenerators />;
        break;
      default:
        content = <PreviewRestricted key={activeNav.key} moduleKey={activeNav.key} />;
        break;
    }
  }

  return (
    <AdminContext.Provider
      value={{
        backend,
        probed,
        live,
        session,
        refreshTick,
        bumpRefresh,
        openBioModal,
        openCommandPalette: () => setCommandOpen(true),
        navigate,
      }}
    >
      <div className={`ad-app ${collapsed ? 'is-collapsed' : ''}`}>
        <a className="ad-skip" href="#admin-main">
          Skip to content
        </a>

        {menuOpen && (
          <button
            type="button"
            className="ad-overlay"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Frosted Collapsible Apple Sidebar */}
        <aside
          ref={sidebarRef}
          className={`ad-sidebar ${menuOpen ? 'ad-sidebar-open' : ''}`}
          aria-label="Admin navigation"
        >
          <div className="ad-sidebar-top">
            <a
              className="ad-brand"
              href="/admin"
              onClick={e => {
                handleAnchorClick(e);
                setMenuOpen(false);
              }}
            >
              <span className="ad-brand-mark" aria-hidden="true">
                <Icon name="layers" size={20} />
              </span>
              <span className="ad-brand-text">
                <strong>BioCraft</strong>
                <small>MASTER ADMIN</small>
              </span>
            </a>

            <button
              type="button"
              className="ad-collapse-btn"
              onClick={() => setCollapsed(v => !v)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} size={15} />
            </button>
          </div>

          <div className="ad-sidebar-scroll">
            {NAV_GROUPS.map(group => {
              const items = NAV_ITEMS.filter(item => item.section === group.section);
              return (
                <div className="ad-nav-group" key={group.section}>
                  <div className="ad-sidebar-label">{group.label}</div>
                  <nav aria-label={group.label}>
                    {items.map(item => {
                      const active = path === item.path;
                      return (
                        <a
                          key={item.key}
                          className={`ad-nav-link ${active ? 'is-active' : ''}`}
                          href={item.path}
                          title={collapsed ? item.label : undefined}
                          aria-current={active ? 'page' : undefined}
                          onClick={event => {
                            handleAnchorClick(event);
                            setMenuOpen(false);
                          }}
                        >
                          <span className="ad-nav-icon" aria-hidden="true">
                            <Icon name={item.icon} size={17} />
                          </span>
                          <span className="ad-nav-text">{item.label}</span>
                          {item.key === 'security' && <span className="ad-nav-dot" aria-hidden="true" />}
                        </a>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>

          <div className="ad-sidebar-bottom">
            <div className="ad-sidebar-card">
              <div className="ad-sidebar-card-head">
                <span className="ad-mini-lock" aria-hidden="true">
                  <Icon name={live ? 'shieldCheck' : 'lock'} size={15} />
                </span>
                <div>
                  <strong>BioCraft Admin v2.0</strong>
                  <small>{!probed ? 'Checking…' : live ? 'Live Console' : 'Preview Mode'}</small>
                </div>
              </div>
              <div className="ad-sidebar-card-links">
                <a
                  href="/admin/security"
                  onClick={e => {
                    handleAnchorClick(e);
                    setMenuOpen(false);
                  }}
                >
                  View security
                </a>
                <a
                  href="/admin/login"
                  onClick={e => {
                    handleAnchorClick(e);
                    setMenuOpen(false);
                  }}
                >
                  Admin sign-in
                </a>
              </div>
            </div>
            <a className="ad-back" href="/">
              <span>← Back to BioCraft</span>
              <Icon name="external" size={14} />
            </a>
          </div>
        </aside>

        {/* Main Workspace Surface */}
        <div className="ad-content">
          {/* Floating Frosted Translucent Top Bar */}
          <header className="ad-topbar">
            <div className="ad-topbar-left">
              <button
                ref={menuButton}
                className="ad-mobile-menu"
                type="button"
                aria-label="Open navigation"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <Icon name="menu" size={20} />
              </button>

              <nav className="ad-breadcrumb" aria-label="Breadcrumb">
                <span className="ad-crumb-root">Workspace</span>
                <span className="ad-crumb-sep" aria-hidden="true">/</span>
                <strong>{activeNav?.label ?? (path === '/admin/login' ? 'Sign in' : 'Not found')}</strong>
              </nav>
            </div>

            <div className="ad-topbar-center">
              <button
                type="button"
                className="ad-cmd-trigger"
                onClick={() => setCommandOpen(true)}
                title="Search BioCraft Admin (⌘K)"
              >
                <Icon name="search" size={15} />
                <span>Search BioCraft Admin…</span>
                <kbd aria-hidden="true">Ctrl K</kbd>
              </button>
            </div>

            <div className="ad-top-actions">
              <span className={`ad-preview-pill ${live ? 'is-live' : ''}`}>
                <i aria-hidden="true" /> {live ? 'Live data' : 'Preview mode'}
              </span>

              {/* Notification Bell Menu */}
              <div className="ad-popover-wrap" ref={notifRef}>
                <button
                  type="button"
                  className="ad-icon-btn"
                  aria-label="Notifications"
                  aria-expanded={notifOpen}
                  onClick={() => {
                    setNotifOpen(v => !v);
                    setProfileOpen(false);
                  }}
                >
                  <Icon name="bell" size={17} />
                  {unreadCount > 0 && <span className="ad-notif-badge">{unreadCount}</span>}
                </button>
                {notifOpen && (
                  <div className="ad-popover" role="dialog" aria-label="Notifications panel">
                    <div className="ad-popover-head">
                      <strong>Notifications</strong>
                      {unreadCount > 0 && (
                        <button type="button" className="ad-text-link" onClick={() => void markNotificationsRead()}>
                          Mark all read
                        </button>
                      )}
                    </div>
                    {backend !== 'ready' ? (
                      <p className="ad-popover-empty">
                        {live
                          ? 'Sign in with your authenticator to read inbox notifications.'
                          : 'Notifications require a live Admin backend connection.'}
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="ad-popover-empty">You’re all caught up. No new alerts.</p>
                    ) : (
                      <ul className="ad-popover-list">
                        {notifications.map(n => (
                          <li key={n.id} className={n.unread ? 'is-unread' : ''}>
                            <div>
                              <strong>{n.category}</strong>
                              <p>{n.message}</p>
                              <small>{formatDate(n.created_at)}</small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="ad-popover-wrap" ref={profileRef}>
                <button
                  type="button"
                  className="ad-avatar"
                  aria-label="Account menu"
                  aria-expanded={profileOpen}
                  onClick={() => {
                    setProfileOpen(v => !v);
                    setNotifOpen(false);
                  }}
                >
                  <Icon name={backend === 'ready' ? 'user' : 'lock'} size={16} />
                </button>
                {profileOpen && (
                  <div className="ad-popover ad-popover--sm" role="dialog" aria-label="Account menu">
                    <div className="ad-popover-head">
                      <div>
                        <strong>{backend === 'ready' ? 'Signed-in Admin' : 'Guest Preview'}</strong>
                        <small className="ad-cell-sub">
                          {session?.roles?.length
                            ? session.roles.map(r => r.replace(/_/g, ' ')).join(' · ')
                            : live
                              ? 'Not authenticated'
                              : 'Public data only'}
                        </small>
                      </div>
                      <Badge tone={backend === 'ready' ? 'green' : 'amber'}>
                        {backend === 'ready' ? 'AAL2' : 'Locked'}
                      </Badge>
                    </div>
                    <div className="ad-popover-actions">
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/admin/security'); }}>
                        <Icon name="security" size={15} /> Security &amp; Sessions
                      </button>
                      <button type="button" onClick={() => { setProfileOpen(false); navigate('/admin/settings'); }}>
                        <Icon name="settings" size={15} /> System Settings
                      </button>
                      {backend === 'ready' ? (
                        <button type="button" className="is-danger" onClick={() => void handleSignOut()}>
                          <Icon name="logout" size={15} /> Sign out
                        </button>
                      ) : (
                        <button type="button" onClick={() => { setProfileOpen(false); navigate('/admin/login'); }}>
                          <Icon name="lock" size={15} /> Admin Sign-In
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Route Viewport */}
          <main id="admin-main" className="ad-main">
            <Suspense fallback={<RouteFallback />}>{content}</Suspense>
            <footer className="ad-footer">
              <span>{live ? 'BioCraft Master Admin v2.0' : 'BioCraft Admin Preview'}</span>
              <span>{live ? 'Server-verified AAL2 session · Every action audited' : 'Public catalog only · No admin session'}</span>
            </footer>
          </main>
        </div>

        {/* Mobile Bottom Tab Bar with center + FAB matching visual reference */}
        <nav className="ad-mobile-bar" aria-label="Quick mobile navigation">
          <a
            href="/admin"
            className={path === '/admin' ? 'is-active' : ''}
            onClick={handleAnchorClick}
          >
            <Icon name="overview" size={19} />
            <span>Home</span>
          </a>
          <a
            href="/admin/bios"
            className={path === '/admin/bios' ? 'is-active' : ''}
            onClick={handleAnchorClick}
          >
            <Icon name="bios" size={19} />
            <span>Bios</span>
          </a>
          <button
            type="button"
            className="ad-mobile-fab"
            aria-label="Create new bio"
            onClick={() => openBioModal()}
          >
            <Icon name="plus" size={22} />
          </button>
          <a
            href="/admin/content"
            className={path === '/admin/content' ? 'is-active' : ''}
            onClick={handleAnchorClick}
          >
            <Icon name="content" size={19} />
            <span>Content</span>
          </a>
          <button
            type="button"
            className={menuOpen ? 'is-active' : ''}
            onClick={() => setMenuOpen(true)}
            aria-label="More modules"
          >
            <Icon name="menu" size={19} />
            <span>More</span>
          </button>
        </nav>

        {/* Global Spotlight Search (Cmd/Ctrl + K) */}
        <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

        {/* Global Rich Bio Composer Modal */}
        <BioEditorModal
          open={bioModalOpen}
          preset={bioPreset}
          onClose={() => {
            setBioModalOpen(false);
            setBioPreset(null);
          }}
        />
      </div>
    </AdminContext.Provider>
  );
}

export default function AdminApp() {
  return (
    <ToastProvider>
      <AdminShell />
    </ToastProvider>
  );
}
