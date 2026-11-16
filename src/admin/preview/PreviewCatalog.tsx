/**
 * Preview Catalog modules — Bundled read-only views for Bios Library,
 * Categories, Collections, Platforms, and Generators.
 * Preserves all accessible region labels, sort/filter controls, and the
 * lazy-loaded browser-only DraftScratch exercise.
 */
import { Component, lazy, Suspense, useMemo, useState, type ReactNode } from 'react';
import { BIO_COLLECTIONS, TOTAL_BIOS } from '../../lib/bioCollections';
import { CATEGORIES } from '../../tools/bio/data/categories';
import { PLATFORMS } from '../../tools/platforms';
import { TOOLS } from '../../tools/registry';
import { Icon } from '../icons';
import { downloadCsv } from '../live/useLive';
import { Badge, PageHead, Panel, SearchField, SelectField, StatCard, Toolbar } from '../ui/Primitives';
import { useToast } from '../ui/Toast';

const DraftScratch = lazy(() => import('../DraftScratch'));

const LANG: Record<string, string> = { en: 'English', hi: 'Hindi', hg: 'Hinglish' };
const bioRows = BIO_COLLECTIONS.flatMap(collection =>
  collection.bios.map((bio, index) => ({
    ...bio,
    collection: collection.name,
    slug: collection.slug,
    id: `${collection.slug}-${index}`,
  })),
);

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="ad-panel" role="alert">
        <h2>This preview section could not load</h2>
        <p>Nothing was saved or sent. Refresh to retry.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}

function Pagination({ page, pages, total, setPage }: { page: number; pages: number; total: number; setPage: (n: number) => void }) {
  return (
    <div className="ad-pagination">
      <span>{total === 0 ? 'No results' : `Page ${page} of ${pages} · ${total} results`}</span>
      <div className="ad-action-row">
        <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" disabled={page >= pages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}

export function PreviewBioLibrary() {
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('all');
  const [collection, setCollection] = useState('all');
  const [sort, setSort] = useState('source');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState<string | null>(null);
  const [scratch, setScratch] = useState(false);

  const searchable = useMemo(
    () => bioRows.map(bio => ({ bio, search: `${bio.text} ${bio.plain ?? ''} ${bio.collection}`.toLocaleLowerCase() })),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    const rows = searchable
      .filter(
        ({ bio: b, search }) =>
          (language === 'all' || b.lang === language) &&
          (collection === 'all' || b.slug === collection) &&
          (!q || search.includes(q)),
      )
      .map(row => row.bio);
    if (sort === 'text') rows.sort((a, b) => a.text.localeCompare(b.text));
    if (sort === 'collection') rows.sort((a, b) => a.collection.localeCompare(b.collection));
    return rows;
  }, [query, language, collection, sort, searchable]);

  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const current = Math.min(page, pages);
  const selected = bioRows.find(b => b.id === detail);

  return (
    <>
      <PageHead
        eyebrow="CONTENT LIBRARY"
        title="Bio library"
        description="Explore the bios bundled with this build. Live database records and editing are not connected."
        actions={
          <div className="ad-action-row">
            <button
              type="button"
              className="ad-btn ad-btn--secondary"
              onClick={() => {
                const n = downloadCsv(
                  'biocraft-preview-bios.csv',
                  filtered.map(b => ({ id: b.id, collection: b.collection, lang: LANG[b.lang] ?? b.lang, text: b.text })),
                  ['id', 'collection', 'lang', 'text'],
                );
                toast.push(`Exported ${n} bios`, { tone: 'success' });
              }}
            >
              <Icon name="download" size={14} /> Export CSV
            </button>
            <button
              type="button"
              className="ad-btn ad-btn--primary"
              aria-expanded={scratch}
              onClick={() => setScratch(v => !v)}
            >
              <Icon name="edit" size={14} />
              {scratch ? 'Close browser-only scratchpad (discard items)' : 'Open browser-only draft scratchpad'}
            </button>
          </div>
        }
      />

      <div className="ad-stats-grid ad-stats-grid--4">
        <StatCard icon="bios" label="Bundled Bios" value={TOTAL_BIOS.toLocaleString()} caption="In built-in collections" tint="lavender" />
        <StatCard icon="collections" label="Collections" value={BIO_COLLECTIONS.length} caption="Curated groups" tint="sky" />
        <StatCard icon="search" label="Matching" value={filtered.length.toLocaleString()} caption="Current filter" tint="mint" />
        <StatCard icon="lock" label="Editing" value="Read-only" caption="Backend required" tint="amber" />
      </div>

      <Panel title="Built-in bios" icon="bios" description="Search across collections and languages" aside={<Badge tone="purple">Read-only · bundled</Badge>}>
        <Toolbar>
          <SearchField
            value={query}
            onChange={v => { setQuery(v); setPage(1); }}
            placeholder="Search bios or collections"
            label="Search bios or collections"
          />
          <SelectField value={language} onChange={v => { setLanguage(v); setPage(1); }} label="Filter by language">
            <option value="all">All languages</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="hg">Hinglish</option>
          </SelectField>
          <SelectField value={collection} onChange={v => { setCollection(v); setPage(1); }} label="Filter by collection">
            <option value="all">All collections</option>
            {BIO_COLLECTIONS.map(c => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </SelectField>
          <SelectField value={sort} onChange={v => { setSort(v); setPage(1); }} label="Sort bios">
            <option value="source">Bundled order</option>
            <option value="text">Bio text A–Z</option>
            <option value="collection">Collection A–Z</option>
          </SelectField>
        </Toolbar>

        <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Bio</th>
                <th>Collection</th>
                <th>Language</th>
                <th>Style</th>
                <th className="ad-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice((current - 1) * 10, current * 10).map(b => (
                <tr key={b.id}>
                  <td className="ad-bio-text">{b.text}</td>
                  <td>{b.collection}</td>
                  <td><Badge>{LANG[b.lang]}</Badge></td>
                  <td>{b.style ? 'Styled' : 'Plain'}</td>
                  <td className="ad-right">
                    <button
                      type="button"
                      className="ad-btn ad-btn--ghost ad-btn--sm"
                      onClick={() => setDetail(b.id)}
                      aria-label={`View details for ${b.id}`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="ad-empty-table">No bios match your filters. Try another search or collection.</div>}
        </div>

        <Pagination page={current} pages={pages} total={filtered.length} setPage={setPage} />

        {selected && (
          <section className="ad-detail" aria-label="Bundled bio details">
            <div className="ad-panel-head">
              <div>
                <h3>Bundled bio details</h3>
                <p>Read-only source item · not a live database record</p>
              </div>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setDetail(null)}>
                Close details
              </button>
            </div>
            <dl className="ad-detail-grid">
              <dt>Collection</dt><dd>{selected.collection}</dd>
              <dt>Language</dt><dd>{LANG[selected.lang]}</dd>
              <dt>Style</dt><dd>{selected.style ? 'Styled' : 'Plain'}</dd>
              <dt>Text</dt><dd className="ad-bio-text">{selected.text}</dd>
              {selected.plain && (
                <>
                  <dt>Plain text</dt><dd className="ad-bio-text">{selected.plain}</dd>
                </>
              )}
            </dl>
          </section>
        )}
      </Panel>

      <p className="ad-footnote">
        <Icon name="lock" size={14} /> Editing published bios requires an approved admin backend.
      </p>

      {scratch && (
        <PreviewErrorBoundary>
          <Suspense
            fallback={
              <div className="ad-panel ad-skeleton" role="status">
                <span>Loading browser-only draft form…</span>
                <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
              </div>
            }
          >
            <DraftScratch />
          </Suspense>
        </PreviewErrorBoundary>
      )}
    </>
  );
}

export function PreviewCategories() {
  const [q, setQ] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [collectionSort, setCollectionSort] = useState('source');
  const [categorySort, setCategorySort] = useState('source');
  const [categoryDetail, setCategoryDetail] = useState<string | null>(null);
  const [collectionDetail, setCollectionDetail] = useState<string | null>(null);

  const rows = useMemo(() => {
    const r = BIO_COLLECTIONS.filter(c => `${c.name} ${c.slug} ${c.languages}`.toLowerCase().includes(q.trim().toLowerCase()));
    if (collectionSort === 'name') r.sort((a, b) => a.name.localeCompare(b.name));
    if (collectionSort === 'count') r.sort((a, b) => b.bios.length - a.bios.length);
    return r;
  }, [q, collectionSort]);

  const categories = useMemo(() => {
    const r = CATEGORIES.filter(c => `${c.id} ${c.en.label} ${c.hi.label} ${c.hg.label}`.toLocaleLowerCase().includes(categoryQuery.trim().toLocaleLowerCase()));
    if (categorySort === 'name') r.sort((a, b) => a.en.label.localeCompare(b.en.label));
    return r;
  }, [categoryQuery, categorySort]);

  const selectedCategory = CATEGORIES.find(c => c.id === categoryDetail);
  const selectedCollection = BIO_COLLECTIONS.find(c => c.slug === collectionDetail);

  return (
    <>
      <PageHead
        eyebrow="CONTENT LIBRARY"
        title="Categories"
        description="Explore bundled bio-generator categories and ready-made bio collections."
      />

      <div className="ad-stats-grid ad-stats-grid--3">
        <StatCard icon="categories" label="Generator Categories" value={CATEGORIES.length} caption="EN · HI · HG labels" tint="amber" />
        <StatCard icon="collections" label="Curated Collections" value={BIO_COLLECTIONS.length} caption="Public showcase routes" tint="sky" />
        <StatCard icon="bios" label="Total Bundled Bios" value={TOTAL_BIOS.toLocaleString()} caption="Across all collections" tint="lavender" />
      </div>

      <Panel title="Generator categories" icon="categories" description="Labels used in the bio generator · not the live database" aside={<Badge tone="purple">{CATEGORIES.length} categories</Badge>}>
        <Toolbar>
          <SearchField value={categoryQuery} onChange={setCategoryQuery} placeholder="Search generator categories" label="Search generator categories" />
          <SelectField value={categorySort} onChange={setCategorySort} label="Sort generator categories">
            <option value="source">Bundled order</option>
            <option value="name">English label A–Z</option>
          </SelectField>
        </Toolbar>

        <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Scrollable generator categories table">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>English</th>
                <th>Hindi</th>
                <th>Hinglish</th>
                <th className="ad-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(c => (
                <tr key={c.id}>
                  <td><code className="ad-mono">{c.id}</code></td>
                  <td><strong>{c.en.label}</strong></td>
                  <td>{c.hi.label}</td>
                  <td>{c.hg.label}</td>
                  <td className="ad-right">
                    <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" aria-label={`View category ${c.id}`} onClick={() => setCategoryDetail(c.id)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && <div className="ad-empty-table">No categories match your search.</div>}
        </div>

        {selectedCategory && (
          <section className="ad-detail" aria-label="Category details">
            <div className="ad-panel-head">
              <div>
                <h3>{selectedCategory.en.label}</h3>
                <p>Multilingual generator taxonomy</p>
              </div>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setCategoryDetail(null)}>
                Close category details
              </button>
            </div>
            <dl className="ad-detail-grid">
              <dt>Emoji</dt><dd>{selectedCategory.emojis.join(' ')}</dd>
              {(['en', 'hi', 'hg'] as const).map(lang => (
                <div key={lang} className="ad-detail-language">
                  <dt>{LANG[lang]}</dt>
                  <dd>
                    Roles: {selectedCategory[lang].roles.join(', ')}
                    <br />
                    Topics: {selectedCategory[lang].niches.join(', ')}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </Panel>

      <Panel title="Collection registry" icon="collections" description="Bundled routes and content counts" aside={<Badge tone="purple">Read-only · bundled</Badge>}>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search collections" label="Search collections" />
          <SelectField value={collectionSort} onChange={setCollectionSort} label="Sort collections">
            <option value="source">Bundled order</option>
            <option value="name">Name A–Z</option>
            <option value="count">Most bios first</option>
          </SelectField>
        </Toolbar>

        <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Scrollable collections table">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Collection</th>
                <th>Route</th>
                <th>Languages</th>
                <th>Bios</th>
                <th className="ad-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(c => (
                <tr key={c.slug}>
                  <td><strong>{c.name}</strong></td>
                  <td><code className="ad-mono">/{c.slug}</code></td>
                  <td>{c.languages}</td>
                  <td>{c.bios.length}</td>
                  <td className="ad-right">
                    <button type="button" className="ad-btn ad-btn--ghost ad-btn--sm" aria-label={`View collection ${c.name}`} onClick={() => setCollectionDetail(c.slug)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="ad-empty-table">No collections match your search.</div>}
        </div>

        {selectedCollection && (
          <section className="ad-detail" aria-label="Collection details">
            <div className="ad-panel-head">
              <div>
                <h3>{selectedCollection.name}</h3>
                <p>Bundled showcase route metadata</p>
              </div>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setCollectionDetail(null)}>
                Close collection details
              </button>
            </div>
            <dl className="ad-detail-grid">
              <dt>Route</dt><dd>/{selectedCollection.slug}</dd>
              <dt>Description</dt><dd>{selectedCollection.description}</dd>
              <dt>Languages</dt><dd>{selectedCollection.languages}</dd>
              <dt>Reviewed</dt><dd>{selectedCollection.updated}</dd>
              <dt>SEO title</dt><dd>{selectedCollection.seoTitle}</dd>
              <dt>SEO description</dt><dd>{selectedCollection.seoDescription}</dd>
            </dl>
          </section>
        )}
      </Panel>

      <p className="ad-footnote">
        <Icon name="lock" size={14} /> Category and collection management require an approved backend.
      </p>
    </>
  );
}

export function PreviewCollections() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'source' | 'name' | 'count'>('count');
  const [detail, setDetail] = useState<string | null>(null);

  const rows = useMemo(() => {
    const r = BIO_COLLECTIONS.filter(c => `${c.name} ${c.slug} ${c.languages}`.toLowerCase().includes(q.trim().toLowerCase()));
    if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'count') r.sort((a, b) => b.bios.length - a.bios.length);
    return r;
  }, [q, sort]);

  const selected = BIO_COLLECTIONS.find(c => c.slug === detail);

  return (
    <>
      <PageHead
        eyebrow="CURATED SETS"
        title="Collections"
        description="Dedicated view of BioCraft’s curated bio collections, routes, language coverage, and SEO titles."
      />

      <div className="ad-stats-grid ad-stats-grid--3">
        <StatCard icon="collections" label="Collections" value={BIO_COLLECTIONS.length} caption="Public landing routes" tint="sky" />
        <StatCard icon="bios" label="Bundled Bios" value={TOTAL_BIOS.toLocaleString()} caption="Across all collections" tint="lavender" />
        <StatCard icon="sparkles" label="Avg. Size" value={Math.round(TOTAL_BIOS / BIO_COLLECTIONS.length)} caption="Bios per collection" tint="mint" />
      </div>

      <Panel title="All bio collections" icon="collections" description="Bundled showcase routes and SEO summaries" aside={<Badge tone="purple">{rows.length} collections</Badge>}>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search collections…" label="Search collections" />
          <SelectField value={sort} onChange={v => setSort(v as 'source' | 'name' | 'count')} label="Sort collections">
            <option value="count">Most bios first</option>
            <option value="name">Name A–Z</option>
            <option value="source">Bundled order</option>
          </SelectField>
        </Toolbar>

        <div className="ad-collection-grid">
          {rows.map(c => (
            <article className="ad-collection-card" key={c.slug}>
              <div className="ad-collection-card-top">
                <span className="ad-collection-icon ad-tint--sky">
                  <Icon name="collections" size={18} />
                </span>
                <Badge tone="purple">{c.bios.length} bios</Badge>
              </div>
              <h3>{c.name}</h3>
              <p>{c.description}</p>
              <div className="ad-collection-card-meta">
                <code className="ad-mono">/{c.slug}</code>
                <span>{c.languages}</span>
              </div>
              <div className="ad-action-row" style={{ marginTop: 12 }}>
                <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setDetail(c.slug)}>
                  Inspect metadata
                </button>
                <a className="ad-btn ad-btn--ghost ad-btn--sm" href={`/${c.slug}`}>
                  Open page <Icon name="external" size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {selected && (
          <section className="ad-detail" aria-label="Collection metadata details">
            <div className="ad-panel-head">
              <div>
                <h3>{selected.name}</h3>
                <p>/{selected.slug}</p>
              </div>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setDetail(null)}>
                Close
              </button>
            </div>
            <dl className="ad-detail-grid">
              <dt>Languages</dt><dd>{selected.languages}</dd>
              <dt>Reviewed</dt><dd>{selected.updated}</dd>
              <dt>SEO Title</dt><dd>{selected.seoTitle}</dd>
              <dt>SEO Description</dt><dd>{selected.seoDescription}</dd>
            </dl>
          </section>
        )}
      </Panel>
    </>
  );
}

export function PreviewPlatforms() {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('source');
  const [detail, setDetail] = useState<string | null>(null);

  const rows = useMemo(() => {
    const r = PLATFORMS.filter(p => p.name.toLowerCase().includes(q.trim().toLowerCase()));
    if (sort === 'name') r.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'limit') r.sort((a, b) => b.bioLimit - a.bioLimit);
    return r;
  }, [q, sort]);

  const selected = PLATFORMS.find(p => p.id === detail);

  return (
    <>
      <PageHead
        eyebrow="YOUR ECOSYSTEM"
        title="Platforms"
        description="The current platform configurations, directly from the BioCraft app."
      />

      <Panel
        title="Supported platforms"
        icon="platforms"
        description="Limits shown are app configuration, not independently verified platform policies."
        aside={<Badge tone="purple">{PLATFORMS.length} platforms</Badge>}
      >
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search platforms" label="Search platforms" />
          <SelectField value={sort} onChange={setSort} label="Sort platforms">
            <option value="source">Bundled order</option>
            <option value="name">Name A–Z</option>
            <option value="limit">Bio limit descending</option>
          </SelectField>
        </Toolbar>

        <div className="ad-platform-cards">
          {rows.map(p => (
            <article className="ad-platform-card" key={p.id}>
              <div className="ad-platform-card-head">
                <span className="ad-platform-mark" style={{ background: p.tileFrom, color: p.deep }}>
                  {p.shortName.slice(0, 1)}
                </span>
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.tools.length} available tools</p>
                </div>
                <Badge>Bundled</Badge>
              </div>
              <div className="ad-platform-info">
                <div>
                  <small>Bio limit</small>
                  <strong>
                    {p.id === 'snapchat' ? '≈' : ''}
                    {p.bioLimit.toLocaleString()} characters
                  </strong>
                </div>
                <div>
                  <small>Workspace</small>
                  <strong>{p.bioHeading}</strong>
                </div>
              </div>
              {p.englishOnlyNote && <p className="ad-platform-note">{p.englishOnlyNote}</p>}
              <button
                type="button"
                className="ad-btn ad-btn--secondary ad-btn--sm"
                onClick={() => setDetail(p.id)}
                aria-label={`View configuration for ${p.name}`}
              >
                View configuration
              </button>
            </article>
          ))}
        </div>

        {rows.length === 0 && <div className="ad-empty-table">No platforms match your search.</div>}

        {selected && (
          <section className="ad-detail" aria-label="Platform configuration details">
            <div className="ad-panel-head">
              <div>
                <h3>{selected.name} · bundled configuration</h3>
                <p>App character limits and enabled tools</p>
              </div>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setDetail(null)}>
                Close configuration
              </button>
            </div>
            <dl className="ad-detail-grid">
              <dt>Bio limit</dt>
              <dd>
                {selected.id === 'snapchat' ? 'Approximately ' : ''}
                {selected.bioLimit.toLocaleString()} characters
              </dd>
              <dt>Bio workspace</dt><dd>{selected.bioHeading}</dd>
              <dt>Caption label</dt><dd>{selected.captionsLabel}</dd>
              <dt>Available tools</dt>
              <dd>{TOOLS.filter(t => selected.tools.includes(t.key)).map(t => t.heading).join(', ')}</dd>
            </dl>
          </section>
        )}
      </Panel>

      <p className="ad-footnote">
        <Icon name="lock" size={14} /> Settings are bundled in the public app and cannot be edited here.
      </p>
    </>
  );
}

export function PreviewGenerators() {
  const [q, setQ] = useState('');
  const [platform, setPlatform] = useState('all');
  const [sort, setSort] = useState('source');
  const [detail, setDetail] = useState<string | null>(null);

  const rows = useMemo(() => {
    const p = PLATFORMS.find(x => x.id === platform);
    const r = TOOLS.filter(
      t => `${t.heading} ${t.path} ${t.tabLabel}`.toLowerCase().includes(q.trim().toLowerCase()) && (!p || p.tools.includes(t.key)),
    );
    if (sort === 'name') r.sort((a, b) => a.heading.localeCompare(b.heading));
    return r;
  }, [q, platform, sort]);

  const selected = TOOLS.find(t => t.key === detail);

  return (
    <>
      <PageHead
        eyebrow="TOOLKIT"
        title="Generators"
        description="Explore the real tools registered in BioCraft and where they are available."
      />

      <Panel title="Tool registry" icon="generators" description="Rule-based tools, as configured in this build" aside={<Badge tone="purple">{TOOLS.length} tools</Badge>}>
        <Toolbar>
          <SearchField value={q} onChange={setQ} placeholder="Search tools" label="Search tools" />
          <SelectField value={platform} onChange={setPlatform} label="Filter tools by platform">
            <option value="all">All platforms</option>
            {PLATFORMS.map(p => (
              <option value={p.id} key={p.id}>{p.name}</option>
            ))}
          </SelectField>
          <SelectField value={sort} onChange={setSort} label="Sort tools">
            <option value="source">Bundled order</option>
            <option value="name">Name A–Z</option>
          </SelectField>
        </Toolbar>

        <div className="ad-table-wrap" tabIndex={0} role="region" aria-label="Scrollable data table">
          <table className="ad-table">
            <thead>
              <tr>
                <th>Tool</th>
                <th>Public route</th>
                <th>Platforms</th>
                <th className="ad-right">Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(t => (
                <tr key={t.key}>
                  <td>
                    <strong>{t.heading}</strong>
                    <small className="ad-cell-sub">{t.tabLabel}</small>
                  </td>
                  <td>
                    <a className="ad-text-link" href={t.path}>
                      {t.path} ↗
                    </a>
                  </td>
                  <td>{PLATFORMS.filter(p => p.tools.includes(t.key)).map(p => p.shortName).join(', ')}</td>
                  <td className="ad-right">
                    <button
                      type="button"
                      className="ad-btn ad-btn--ghost ad-btn--sm"
                      onClick={() => setDetail(t.key)}
                      aria-label={`View ${t.heading} details`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="ad-empty-table">No tools match your search or platform.</div>}
        </div>

        {selected && (
          <section className="ad-detail" aria-label="Generator details">
            <div className="ad-panel-head">
              <div>
                <h3>{selected.heading}</h3>
                <p>{selected.path}</p>
              </div>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--sm" onClick={() => setDetail(null)}>
                Close tool details
              </button>
            </div>
            <dl className="ad-detail-grid">
              <dt>Public path</dt><dd>{selected.path}</dd>
              <dt>Description</dt><dd>{selected.subheading}</dd>
              <dt>Platforms</dt>
              <dd>{PLATFORMS.filter(p => p.tools.includes(selected.key)).map(p => p.name).join(', ')}</dd>
            </dl>
          </section>
        )}
      </Panel>

      <p className="ad-footnote">
        <Icon name="lock" size={14} /> Presets and language configuration are not connected.
      </p>
    </>
  );
}
