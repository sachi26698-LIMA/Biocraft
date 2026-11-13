/**
 * Catalog — the three registries the API can actually read live: platforms,
 * categories (which double as the public collections) and generators.
 *
 * One module serves all three because the server exposes them with the same
 * contract: a bounded page of rows, a cursor, and the `content.read` permission.
 * Splitting it in three would triplicate the same loading and denial handling
 * and let the three screens drift apart.
 *
 * Everything shown here is read-only by design. The package has no command that
 * creates or edits a platform, category or generator, so the screen says so
 * rather than offering a button that would fail after the click.
 */
import { useMemo, useState } from 'react';
import { Badge, Panel } from '../parts';
import { formatDate, formatNumber, usePaged } from './useLive';
import { CursorPager, EmptyState, SearchField, StateNotice, Toolbar } from './ui';
import type { CategoryRow, GeneratorRow, PlatformRow, SeoPageRow } from './types';

type Catalog = 'platforms' | 'categories' | 'generators';

const COPY: Record<Catalog, { title: string; description: string; noun: string }> = {
  platforms: {
    title: 'Platforms',
    description: 'Every platform row in the database, including disabled ones.',
    noun: 'platforms',
  },
  categories: {
    title: 'Categories & collections',
    description: 'Categories group bios and double as the public collections, so inactive rows are shown too.',
    noun: 'categories',
  },
  generators: {
    title: 'Generators',
    description: 'The generator registry: what each tool is, its type and its character limit.',
    noun: 'generators',
  },
};

/** Row text used by the search box, so one filter works for all three tables. */
function haystack(row: PlatformRow | CategoryRow | GeneratorRow): string {
  const description = 'description' in row ? row.description : null;
  return [row.name, row.slug, description, 'platform_slug' in row ? row.platform_slug : null, 'generator_type' in row ? row.generator_type : null]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export default function Catalog({ which }: { which: Catalog }) {
  const copy = COPY[which];
  const [query, setQuery] = useState('');
  const list = usePaged<PlatformRow | CategoryRow | GeneratorRow>(`/${which}?limit=50`, last => last?.id ?? null);

  const all = list.data ?? [];
  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return all;
    return all.filter(row => haystack(row).includes(needle));
  }, [all, query]);

  const active = all.filter(row => row.is_active).length;
  const disabled = all.length - active;

  return (
    <>
      <Panel
        title={copy.title}
        description={copy.description}
        aside={<Badge tone="purple">Live · read-only</Badge>}
      >
        <StateNotice state={list.state} error={list.error} reload={list.reload} />

        {list.state === 'ready' && (
          <>
            <p className="ad-muted-copy">
              {formatNumber(all.length)} {copy.noun} loaded
              {all.length > 0 && ` · ${formatNumber(active)} active, ${formatNumber(disabled)} disabled`}
              {query.trim() && ` · ${formatNumber(rows.length)} match “${query.trim()}”`}
            </p>

            <Toolbar>
              <SearchField value={query} onChange={setQuery} placeholder={`Search ${copy.noun}`} label={`Search ${copy.noun}`} />
            </Toolbar>

            {rows.length === 0 ? (
              <EmptyState
                title={query.trim() ? 'Nothing matches that search' : `No ${copy.noun} in the database`}
                text={
                  query.trim()
                    ? `None of the ${copy.noun} loaded so far contain “${query.trim()}”. Clear the search to see them all.`
                    : 'The table returned no rows. That is a real empty result, not a permission problem.'
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
                        <td>
                          <code>{row.slug}</code>
                        </td>
                        {which === 'categories' && <td>{'platform_slug' in row && row.platform_slug ? row.platform_slug : '—'}</td>}
                        {which === 'generators' && <td>{'generator_type' in row ? row.generator_type : '—'}</td>}
                        {which === 'generators' && (
                          <td>{'character_limit' in row && row.character_limit != null ? `${formatNumber(row.character_limit)} chars` : '—'}</td>
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

            <CursorPager
              count={all.length}
              hasNext={list.hasMore}
              loading={false}
              onNext={list.loadMore}
              onReset={list.reload}
            />
          </>
        )}
      </Panel>

      <Panel
        title="Not editable here"
        description="What this screen deliberately does not offer, and why."
        aside={<Badge>Read-only</Badge>}
      >
        <p className="ad-muted-copy">
          The Admin package has no command that creates, renames or disables a {which === 'generators' ? 'generator' : which === 'categories' ? 'category' : 'platform'}. Adding
          one is a schema change, not a button, so this screen reads the registry and stops there. Editing
          a bio — including moving it between categories — happens in the bio library, which is audited and
          requires an independent review before anything becomes public.
        </p>
      </Panel>
    </>
  );
}

/** Platforms, categories and generators each get a thin wrapper so the router
 * stays explicit and each entry keeps its own identity in the bundle. */
export function Platforms() {
  return <Catalog which="platforms" />;
}

export function Categories() {
  return <Catalog which="categories" />;
}

export function Generators() {
  return <Catalog which="generators" />;
}

/** SEO pages are read-only in the same way, but have their own columns. */
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
    <Panel title="SEO pages" description="Page metadata exactly as the database holds it." aside={<Badge tone="purple">Live · read-only</Badge>}>
      <StateNotice state={list.state} error={list.error} reload={list.reload} />
      {list.state === 'ready' && (
        <>
          <Toolbar>
            <SearchField value={query} onChange={setQuery} placeholder="Search page slug or title" label="Search SEO pages" />
          </Toolbar>
          {rows.length === 0 ? (
            <EmptyState
              title={query.trim() ? 'Nothing matches that search' : 'No SEO pages in the database'}
              text={query.trim() ? 'Try a different slug or title.' : 'The table returned no rows.'}
            />
          ) : (
            <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Scrollable SEO pages table">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Title</th>
                    <th>Robots</th>
                    <th>Updated</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.id}>
                      <td>
                        <code>{row.page_slug}</code>
                      </td>
                      <td>
                        {row.title ?? '—'}
                        {row.meta_description && <small className="ad-cell-sub">{row.meta_description}</small>}
                      </td>
                      <td>{row.robots ?? '—'}</td>
                      <td>{formatDate(row.updated_at)}</td>
                      <td>
                        <Badge tone={row.is_active ? 'green' : 'amber'}>{row.is_active ? 'Active' : 'Inactive'}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <CursorPager count={pages.length} hasNext={list.hasMore} loading={false} onNext={list.loadMore} onReset={list.reload} />
        </>
      )}
      <p className="ad-muted-copy">Editing SEO metadata is not exposed yet: the package stores drafts for bios only.</p>
    </Panel>
  );
}
