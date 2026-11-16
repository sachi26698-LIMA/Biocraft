/**
 * Live Catalog Modules — Categories, Collections, Platforms, Generators, and SEO Pages.
 * Each registry gets its own refined Apple-inspired layout, KPI cards, filtering,
 * visualizations, and honest read-only explanation.
 */
import { useMemo, useState } from 'react';
import { Icon, type IconName } from '../icons';
import { HorizontalBars } from '../ui/Charts';
import { useToast } from '../ui/Toast';
import { Badge, CursorPager, EmptyState, PageHead, Panel, SearchField, SelectField, StatCard, StateNotice, Toolbar } from './common';
import type { CategoryRow, CollectionRow, GeneratorRow, PlatformRow, SeoPageRow } from './types';
import { downloadCsv, formatDate, formatNumber, usePaged } from './useLive';

type RegistryKind = 'platforms' | 'categories' | 'generators';

const META: Record<RegistryKind, { eyebrow: string; title: string; description: string; noun: string; icon: IconName }> = {
  platforms: {
    eyebrow: 'ECOSYSTEM',
    title: 'Platforms',
    description: 'Every platform configuration stored in the database, including disabled entries.',
    noun: 'platforms',
    icon: 'platforms',
  },
  categories: {
    eyebrow: 'TAXONOMY',
    title: 'Categories',
    description: 'Database categories organizing bios across platforms, including inactive rows.',
    noun: 'categories',
    icon: 'categories',
  },
  generators: {
    eyebrow: 'TOOLKIT',
    title: 'Generators',
    description: 'Registered rule-based generators with their types, limits, and active status.',
    noun: 'generators',
    icon: 'generators',
  },
};

function haystack(row: PlatformRow | CategoryRow | GeneratorRow): string {
  const description = 'description' in row ? row.description : null;
  return [
    row.name,
    row.slug,
    description,
    'platform_slug' in row ? row.platform_slug : null,
    'generator_type' in row ? row.generator_type : null,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export default function Catalog({ which }: { which: RegistryKind }) {
  const copy = META[which];
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const list = usePaged<PlatformRow | CategoryRow | GeneratorRow>(`/${which}?limit=50`, last => last?.id ?? null);

  const all = list.data ?? [];
  const activeCount = all.filter(r => r.is_active).length;
  const disabledCount = all.length - activeCount;

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return all.filter(row => {
      if (statusFilter === 'active' && !row.is_active) return false;
      if (statusFilter === 'disabled' && row.is_active) return false;
      if (needle && !haystack(row).includes(needle)) return false;
      return true;
    });
  }, [all, query, statusFilter]);

  return (
    <>
      <PageHead
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={
          all.length > 0 && (
            <button
              type="button"
              className="ad-btn ad-btn--secondary"
              onClick={() => {
                const n = downloadCsv(`${which}.csv`, rows as unknown as Record<string, unknown>[], ['id', 'name', 'slug', 'is_active']);
                toast.push(`Exported ${n} ${copy.noun}`, { tone: 'success' });
              }}
            >
              <Icon name="download" size={14} /> Export CSV
            </button>
          )
        }
      />

      {list.state === 'ready' && (
        <div className="ad-stats-grid ad-stats-grid--3">
          <StatCard icon={copy.icon} label={`Loaded ${copy.noun}`} value={formatNumber(all.length)} caption="From live registry" tint="lavender" />
          <StatCard icon="checkCircle" label="Active" value={formatNumber(activeCount)} caption="Visible & enabled" tint="mint" />
          <StatCard icon="lock" label="Disabled" value={formatNumber(disabledCount)} caption="Inactive in database" tint="amber" />
        </div>
      )}

      <Panel
        title={copy.title}
        icon={copy.icon}
        description={copy.description}
        aside={<Badge tone="purple">Live · read-only</Badge>}
      >
        <StateNotice state={list.state} error={list.error} reload={list.reload} />

        {list.state === 'ready' && (
          <>
            <Toolbar>
              <SearchField value={query} onChange={setQuery} placeholder={`Search ${copy.noun}…`} label={`Search ${copy.noun}`} />
              <SelectField value={statusFilter} onChange={v => setStatusFilter(v as 'all' | 'active' | 'disabled')} label="Filter by status">
                <option value="all">All statuses</option>
                <option value="active">Active only</option>
                <option value="disabled">Disabled only</option>
              </SelectField>
            </Toolbar>

            {rows.length === 0 ? (
              <EmptyState
                icon={copy.icon}
                title={query.trim() || statusFilter !== 'all' ? 'Nothing matches these filters' : `No ${copy.noun} in the database`}
                text={
                  query.trim() || statusFilter !== 'all'
                    ? 'Clear or adjust the filters to see all loaded entries.'
                    : 'The table returned no rows. This is an honest empty result, not a permission denial.'
                }
              />
            ) : (
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label={`Scrollable ${copy.noun} table`}>
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      {which === 'categories' && <th>Platform</th>}
                      {which === 'generators' && <th>Type</th>}
                      {which === 'generators' && <th>Limit</th>}
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.id}>
                        <td>
                          <strong>{row.name}</strong>
                          {'description' in row && row.description && <small className="ad-cell-sub">{row.description}</small>}
                        </td>
                        <td><code className="ad-mono">{row.slug}</code></td>
                        {which === 'categories' && <td>{'platform_slug' in row && row.platform_slug ? row.platform_slug : '—'}</td>}
                        {which === 'generators' && <td>{'generator_type' in row && row.generator_type ? <Badge tone="blue">{row.generator_type}</Badge> : '—'}</td>}
                        {which === 'generators' && (
                          <td className="ad-num">
                            {'character_limit' in row && row.character_limit != null ? `${formatNumber(row.character_limit)} chars` : '—'}
                          </td>
                        )}
                        <td>
                          <Badge tone={row.is_active ? 'green' : 'amber'}>{row.is_active ? 'Active' : 'Disabled'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <CursorPager count={all.length} hasNext={list.hasMore} loading={false} onNext={list.loadMore} onReset={list.reload} />
          </>
        )}
      </Panel>

      <Panel title="Not editable here" icon="info" description="Schema-managed registry boundary" aside={<Badge>Read-only</Badge>}>
        <p className="ad-muted-copy">
          The Admin package intentionally exposes no command that creates, renames or disables a{' '}
          {which === 'generators' ? 'generator' : which === 'categories' ? 'category' : 'platform'}. Registry changes are
          reviewed migrations; bio edits happen through the audited draft and review workflow.
        </p>
      </Panel>
    </>
  );
}

export function Platforms() {
  return <Catalog which="platforms" />;
}

export function Categories() {
  return <Catalog which="categories" />;
}

export function Generators() {
  return <Catalog which="generators" />;
}

/** Dedicated Collections module reading /api/admin/v1/collections live. */
export function LiveCollections() {
  const toast = useToast();
  const list = usePaged<CollectionRow>('/collections?limit=50', last => last?.source_slug ?? null);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'slug' | 'count'>('count');

  const all = list.data ?? [];
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle ? all.filter(r => r.source_slug.toLowerCase().includes(needle)) : [...all];
    if (sort === 'count') {
      filtered.sort((a, b) => (Number(b.active_bios) + Number(b.archived_bios)) - (Number(a.active_bios) + Number(a.archived_bios)));
    } else {
      filtered.sort((a, b) => a.source_slug.localeCompare(b.source_slug));
    }
    return filtered;
  }, [all, query, sort]);

  const totals = useMemo(() => {
    const active = all.reduce((sum, r) => sum + Number(r.active_bios), 0);
    const archived = all.reduce((sum, r) => sum + Number(r.archived_bios), 0);
    return { active, archived, total: active + archived };
  }, [all]);

  return (
    <>
      <PageHead
        eyebrow="CONTENT COLLECTIONS"
        title="Collections"
        description="Live bio collections derived from bios.source_slug with active and archived counts."
        actions={
          all.length > 0 && (
            <button
              type="button"
              className="ad-btn ad-btn--secondary"
              onClick={() => {
                const n = downloadCsv('collections.csv', rows as unknown as Record<string, unknown>[], ['source_slug', 'active_bios', 'archived_bios']);
                toast.push(`Exported ${n} collections`, { tone: 'success' });
              }}
            >
              <Icon name="download" size={14} /> Export CSV
            </button>
          )
        }
      />

      {list.state === 'ready' && (
        <div className="ad-stats-grid ad-stats-grid--3">
          <StatCard icon="collections" label="Collections" value={formatNumber(all.length)} caption="Distinct source slugs" tint="sky" />
          <StatCard icon="eye" label="Active bios" value={formatNumber(totals.active)} caption="Publicly visible" tint="mint" />
          <StatCard icon="lock" label="Archived bios" value={formatNumber(totals.archived)} caption="Hidden from guests" tint="amber" />
        </div>
      )}

      {list.state === 'ready' && rows.length > 0 && (
        <Panel title="Top collections by volume" icon="analytics" description="Active + archived bios per collection">
          <HorizontalBars
            ariaLabel="Bios per collection"
            suffix=" bios"
            items={rows.slice(0, 6).map((c, idx) => ({
              label: c.source_slug,
              value: Number(c.active_bios) + Number(c.archived_bios),
              color: ['#7c4dff', '#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#6366f1'][idx % 6],
            }))}
          />
        </Panel>
      )}

      <Panel title="Collection registry" icon="collections" description="Grouped directly from public.bios" aside={<Badge tone="purple">Live · read-only</Badge>}>
        <StateNotice state={list.state} error={list.error} reload={list.reload} />
        {list.state === 'ready' && (
          <>
            <Toolbar>
              <SearchField value={query} onChange={setQuery} placeholder="Search collection slug…" label="Search collections" />
              <SelectField value={sort} onChange={v => setSort(v as 'slug' | 'count')} label="Sort collections">
                <option value="count">Most bios first</option>
                <option value="slug">Slug A–Z</option>
              </SelectField>
            </Toolbar>

            {rows.length === 0 ? (
              <EmptyState icon="collections" title="No collections match" text="Try another search query or clear the filter." />
            ) : (
              <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Scrollable collections table">
                <table className="ad-table">
                  <thead>
                    <tr>
                      <th>Collection slug</th>
                      <th>Public route</th>
                      <th>Active bios</th>
                      <th>Archived</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => {
                      const active = Number(row.active_bios);
                      const archived = Number(row.archived_bios);
                      return (
                        <tr key={row.source_slug}>
                          <td><strong>{row.source_slug}</strong></td>
                          <td><a className="ad-inline-link" href={`/${row.source_slug}`}>/{row.source_slug} ↗</a></td>
                          <td><Badge tone="green">{formatNumber(active)}</Badge></td>
                          <td><Badge tone={archived > 0 ? 'amber' : 'neutral'}>{formatNumber(archived)}</Badge></td>
                          <td className="ad-num"><strong>{formatNumber(active + archived)}</strong></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            <CursorPager count={all.length} hasNext={list.hasMore} loading={false} onNext={list.loadMore} onReset={list.reload} />
          </>
        )}
      </Panel>
    </>
  );
}

/** Live SEO Pages panel (used inside Content & SEO and Categories). */
export function SeoPages() {
  const list = usePaged<SeoPageRow>('/seo-pages?limit=50', last => last?.id ?? null);
  const [query, setQuery] = useState('');
  const pages = list.data ?? [];
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return pages;
    return pages.filter(row => `${row.page_slug} ${row.title ?? ''} ${row.meta_description ?? ''}`.toLowerCase().includes(needle));
  }, [pages, query]);

  return (
    <Panel title="SEO pages" icon="search" description="Page metadata exactly as stored in public.seo_pages." aside={<Badge tone="purple">Live · read-only</Badge>}>
      <StateNotice state={list.state} error={list.error} reload={list.reload} />
      {list.state === 'ready' && (
        <>
          <Toolbar>
            <SearchField value={query} onChange={setQuery} placeholder="Search page slug or title…" label="Search SEO pages" />
          </Toolbar>
          {rows.length === 0 ? (
            <EmptyState
              icon="search"
              title={query.trim() ? 'Nothing matches that search' : 'No SEO pages in the database'}
              text={query.trim() ? 'Try a different slug or title.' : 'The table returned no rows.'}
            />
          ) : (
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Scrollable SEO pages table">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Title &amp; Meta Description</th>
                    <th>Robots</th>
                    <th>Updated</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td><code className="ad-mono">{row.page_slug}</code></td>
                      <td>
                        <strong>{row.title ?? '—'}</strong>
                        {row.meta_description && <small className="ad-cell-sub">{row.meta_description}</small>}
                      </td>
                      <td><code className="ad-mono">{row.robots ?? '—'}</code></td>
                      <td className="ad-nowrap">{formatDate(row.updated_at)}</td>
                      <td><Badge tone={row.is_active ? 'green' : 'amber'}>{row.is_active ? 'Active' : 'Inactive'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <CursorPager count={pages.length} hasNext={list.hasMore} loading={false} onNext={list.loadMore} onReset={list.reload} />
        </>
      )}
      <p className="ad-muted-copy">Editing SEO metadata is not exposed yet: the package stores reviewed drafts for bios only.</p>
    </Panel>
  );
}
