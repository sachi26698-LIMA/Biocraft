/**
 * Preview Overview — Apple-inspired light bento dashboard rendered when the
 * Admin API is unavailable. Displays ONLY real bundled public catalog counts
 * (BIO_COLLECTIONS, CATEGORIES, PLATFORMS, TOOLS) and honestly labels
 * unconfigured backend & telemetry items.
 */
import { useMemo, useState } from 'react';
import { BIO_COLLECTIONS, TOTAL_BIOS } from '../../lib/bioCollections';
import { handleAnchorClick } from '../../lib/router';
import { CATEGORIES } from '../../tools/bio/data/categories';
import { PLATFORMS } from '../../tools/platforms';
import { TOOLS } from '../../tools/registry';
import { adminBackend } from '../backend';
import { useAdminContext } from '../context';
import { Icon } from '../icons';
import { downloadCsv } from '../live/useLive';
import { AreaChart, DonutChart, HorizontalBars } from '../ui/Charts';
import { Badge, PageHead, Panel, StatCard } from '../ui/Primitives';
import { useToast } from '../ui/Toast';

const LANG: Record<string, string> = { en: 'English', hi: 'Hindi', hg: 'Hinglish' };
type ChartTab = 'collections' | 'languages' | 'platforms' | 'categories';

const allBios = BIO_COLLECTIONS.flatMap(collection =>
  collection.bios.map((bio, index) => ({
    ...bio,
    collection: collection.name,
    slug: collection.slug,
    id: `${collection.slug}-${index}`,
  })),
);

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function PreviewOverview() {
  const { navigate } = useAdminContext();
  const toast = useToast();
  const [chartTab, setChartTab] = useState<ChartTab>('collections');
  const [scope, setScope] = useState<'all' | 'en' | 'hi' | 'hg'>('all');

  const langCounts = useMemo(
    () =>
      (['en', 'hi', 'hg'] as const).map(lang => ({
        lang,
        label: LANG[lang],
        count: allBios.filter(b => b.lang === lang).length,
      })),
    [],
  );

  const scopedBiosCount = useMemo(
    () => (scope === 'all' ? TOTAL_BIOS : allBios.filter(b => b.lang === scope).length),
    [scope],
  );

  const largestCollection = useMemo(() => {
    return [...BIO_COLLECTIONS].sort((a, b) => b.bios.length - a.bios.length)[0];
  }, []);

  const topCollections = useMemo(
    () =>
      [...BIO_COLLECTIONS]
        .sort((a, b) => b.bios.length - a.bios.length)
        .slice(0, 8)
        .map(c => ({
          label: c.name.replace(/ Bio.*| Captions.*/i, '').slice(0, 12),
          value: c.bios.length,
          detail: `${c.name}: ${c.bios.length} bios`,
        })),
    [],
  );

  const platformSeries = useMemo(
    () =>
      PLATFORMS.map(p => ({
        label: p.shortName,
        value: p.tools.length,
        detail: `${p.name}: ${p.tools.length} tools · ${p.bioLimit.toLocaleString()} chars`,
      })),
    [],
  );

  const chartSeries = useMemo(() => {
    if (chartTab === 'collections') return topCollections;
    if (chartTab === 'platforms') return platformSeries;
    if (chartTab === 'languages') {
      return langCounts.map(l => ({ label: l.label, value: l.count, detail: `${l.label}: ${l.count} bios` }));
    }
    return CATEGORIES.slice(0, 8).map(c => ({
      label: c.en.label.slice(0, 10),
      value: c.en.roles.length + c.en.niches.length,
      detail: `${c.en.label}: ${c.en.roles.length} roles · ${c.en.niches.length} topics`,
    }));
  }, [chartTab, topCollections, platformSeries, langCounts]);

  const exportBundledCatalog = () => {
    const n = downloadCsv(
      'biocraft-bundled-bios.csv',
      allBios.map(b => ({
        id: b.id,
        collection: b.collection,
        language: LANG[b.lang] ?? b.lang,
        style: b.style ? 'Styled' : 'Plain',
        text: b.text,
      })),
      ['id', 'collection', 'language', 'style', 'text'],
    );
    toast.push(`Exported ${n} bundled bios`, { description: 'Read-only export from this build.', tone: 'success' });
  };

  const englishShare = TOTAL_BIOS > 0 ? Math.round(((langCounts[0]?.count ?? 0) / TOTAL_BIOS) * 100) : 0;

  return (
    <div className="ad-overview">
      <PageHead
        eyebrow="YOUR WORKSPACE"
        title={`${getGreeting()}, Admin`}
        description="A clear view of what’s in BioCraft, and what’s still needed to manage it live."
        actions={
          <div className="ad-segmented" role="group" aria-label="Language scope">
            {([
              ['all', 'All Languages'],
              ['en', 'English'],
              ['hi', 'Hindi'],
              ['hg', 'Hinglish'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                className={scope === key ? 'is-active' : ''}
                onClick={() => setScope(key)}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      {/* Honest preview mode notice */}
      <div className="ad-notice" role="status">
        <span className="ad-notice-icon">
          <Icon name="lock" size={17} />
        </span>
        <div>
          <strong>Preview workspace · public data only</strong>
          <p>{adminBackend.reason} No changes can be made here.</p>
        </div>
        <Badge tone="amber">Setup required</Badge>
      </div>

      {/* 6 KPI Stat Cards matching Apple reference */}
      <div className="ad-stats-grid ad-stats-grid--6">
        <StatCard
          icon="bios"
          label="Bios"
          value={scopedBiosCount.toLocaleString()}
          caption={scope === 'all' ? 'Bundled catalog' : `${LANG[scope]} entries`}
          trend={scope === 'all' ? `${BIO_COLLECTIONS.length} sets` : `${Math.round((scopedBiosCount / TOTAL_BIOS) * 100)}%`}
          trendTone="purple"
          tint="lavender"
          onClick={() => navigate('/admin/bios')}
        />
        <StatCard
          icon="collections"
          label="Collections"
          value={BIO_COLLECTIONS.length}
          caption="Available routes"
          trend="Public"
          trendTone="blue"
          tint="sky"
          onClick={() => navigate('/admin/collections')}
        />
        <StatCard
          icon="categories"
          label="Categories"
          value={CATEGORIES.length}
          caption="Generator niches"
          trend="3 langs"
          trendTone="neutral"
          tint="amber"
          onClick={() => navigate('/admin/categories')}
        />
        <StatCard
          icon="generators"
          label="Generators"
          value={TOOLS.length}
          caption="Registered tools"
          trend="Rule-based"
          trendTone="green"
          tint="violet"
          onClick={() => navigate('/admin/generators')}
        />
        <StatCard
          icon="platforms"
          label="Platforms"
          value={PLATFORMS.length}
          caption="App configurations"
          trend="Active"
          trendTone="green"
          tint="cyan"
          onClick={() => navigate('/admin/platforms')}
        />
        <StatCard
          icon="eye"
          label="Views"
          value="—"
          caption="No telemetry source"
          trend="Not tracked"
          trendTone="neutral"
          tint="mint"
          onClick={() => navigate('/admin/analytics')}
        />
      </div>

      {/* Main Bento Grid: Content Performance Chart + Right Rail */}
      <div className="ad-bento-main">
        <Panel
          title="Content Performance"
          icon="analytics"
          description="Real bundled inventory distribution across BioCraft collections, languages, and platforms"
          aside={
            <div className="ad-chart-tabs" role="tablist" aria-label="Chart dimension">
              {([
                ['collections', 'Collections'],
                ['languages', 'Languages'],
                ['platforms', 'Platforms'],
                ['categories', 'Categories'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={chartTab === key}
                  className={chartTab === key ? 'is-active' : ''}
                  onClick={() => setChartTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          }
          className="ad-chart-panel"
        >
          <div className="ad-chart-header-meta">
            <div>
              <span className="ad-chart-label">Bundled entries</span>
              <strong className="ad-chart-big">{TOTAL_BIOS.toLocaleString()}</strong>
            </div>
            <Badge tone="purple">Bundled data · read-only</Badge>
          </div>
          <AreaChart
            data={chartSeries}
            accent={chartTab === 'platforms' ? '#0ea5e9' : chartTab === 'languages' ? '#10b981' : '#7c4dff'}
            ariaLabel={`Bundled ${chartTab} distribution chart`}
          />
          <div className="ad-chart-footer">
            <span>
              <i aria-hidden="true" /> Counts reflect the app bundle, not the live database.
            </span>
            <a href="/admin/bios" onClick={handleAnchorClick} className="ad-text-link">
              Explore library <Icon name="arrow" size={14} />
            </a>
          </div>
        </Panel>

        <div className="ad-bento-rail">
          {/* Quick Actions */}
          <Panel title="Quick Actions" icon="sparkles" className="ad-rail-panel">
            <div className="ad-quick-actions">
              <button type="button" className="ad-btn ad-btn--primary ad-btn--block" onClick={() => navigate('/admin/bios')}>
                <Icon name="bios" size={15} /> Explore Bio Library
              </button>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--block" onClick={() => navigate('/admin/collections')}>
                <Icon name="collections" size={15} /> Browse Collections
              </button>
              <button type="button" className="ad-btn ad-btn--secondary ad-btn--block" onClick={() => navigate('/admin/content')}>
                <Icon name="content" size={15} /> Inspect SEO Inventory
              </button>
              <button type="button" className="ad-btn ad-btn--ghost ad-btn--block" onClick={() => navigate('/admin/login')}>
                <Icon name="lock" size={15} /> Admin Sign-In
              </button>
            </div>
          </Panel>

          {/* BioCraft Master Admin Status Card */}
          <section className="ad-status-hero ad-status-hero--preview" aria-label="Workspace connection status">
            <div className="ad-status-hero-orb" aria-hidden="true">
              <Icon name="layers" size={22} />
            </div>
            <div className="ad-status-hero-copy">
              <strong>BioCraft Master Admin</strong>
              <span className="ad-status-pill-inline is-amber">
                <i aria-hidden="true" /> Preview Mode · Read-Only
              </span>
              <p>Connect the Admin API environment variables on Preview to unlock live Supabase controls.</p>
            </div>
          </section>

          {/* Key Insights */}
          <Panel title="Key Insights" icon="pulse" className="ad-rail-panel">
            <ul className="ad-insights-list">
              <li>
                <span className="ad-insight-dot ad-dot--purple" aria-hidden="true" />
                <span>
                  <strong>{englishShare}% English</strong> across {TOTAL_BIOS.toLocaleString()} bundled bios (plus Hindi &amp; Hinglish).
                </span>
              </li>
              {largestCollection && (
                <li>
                  <span className="ad-insight-dot ad-dot--sky" aria-hidden="true" />
                  <span>
                    <strong>{largestCollection.name}</strong> leads with {largestCollection.bios.length} curated bios.
                  </span>
                </li>
              )}
              <li>
                <span className="ad-insight-dot ad-dot--amber" aria-hidden="true" />
                <span>
                  <strong>{PLATFORMS.length} platforms</strong> configured from 80 chars (TikTok) up to 2,600 chars (LinkedIn).
                </span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      {/* Bottom 3-Column Bento */}
      <div className="ad-bento-bottom">
        {/* Platforms in BioCraft */}
        <Panel
          title="Platforms in BioCraft"
          icon="platforms"
          description="Current bundled platform configurations"
          aside={
            <a className="ad-text-link" href="/admin/platforms" onClick={handleAnchorClick}>
              View all <Icon name="arrow" size={14} />
            </a>
          }
        >
          <div className="ad-platform-strip" tabIndex={0} role="region" aria-label="Platforms in BioCraft">
            {PLATFORMS.map(p => (
              <button
                type="button"
                className="ad-platform-tile"
                key={p.id}
                onClick={() => navigate('/admin/platforms')}
              >
                <span style={{ background: p.tileFrom, color: p.deep }}>{p.shortName.slice(0, 1)}</span>
                <strong>{p.shortName}</strong>
                <small>{p.bioLimit.toLocaleString()} ch</small>
              </button>
            ))}
          </div>
        </Panel>

        {/* Content Overview Donut */}
        <Panel title="Content Overview" icon="layers" description="Language breakdown across bundled bios">
          <DonutChart
            ariaLabel="Bundled bios by language"
            centerValue={TOTAL_BIOS.toLocaleString()}
            centerLabel="Bundled Bios"
            slices={[
              { label: 'English', value: langCounts[0]?.count ?? 0, color: '#7c4dff' },
              { label: 'Hindi', value: langCounts[1]?.count ?? 0, color: '#0ea5e9' },
              { label: 'Hinglish', value: langCounts[2]?.count ?? 0, color: '#f59e0b' },
            ]}
          />
          <div style={{ marginTop: 12 }}>
            <HorizontalBars
              ariaLabel="Bundled bios per language"
              items={[
                { label: 'English', value: langCounts[0]?.count ?? 0, color: '#7c4dff' },
                { label: 'Hindi', value: langCounts[1]?.count ?? 0, color: '#0ea5e9' },
                { label: 'Hinglish', value: langCounts[2]?.count ?? 0, color: '#f59e0b' },
              ]}
            />
          </div>
        </Panel>

        {/* System Status */}
        <Panel title="System Status" icon="shieldCheck" description="Your path to a live admin console">
          <ul className="ad-health-list">
            <li>
              <span className="ad-health-ico ad-tint--mint"><Icon name="checkCircle" size={15} /></span>
              <span>Public app inventory</span>
              <Badge tone="green">Available</Badge>
            </li>
            <li>
              <span className="ad-health-ico ad-tint--amber"><Icon name="database" size={15} /></span>
              <span>Supabase Admin DB</span>
              <Badge tone="amber">Not connected</Badge>
            </li>
            <li>
              <span className="ad-health-ico ad-tint--amber"><Icon name="server" size={15} /></span>
              <span>API Services</span>
              <Badge tone="amber">Pending</Badge>
            </li>
            <li>
              <span className="ad-health-ico ad-tint--amber"><Icon name="lock" size={15} /></span>
              <span>Auth &amp; Security (TOTP)</span>
              <Badge>Standby</Badge>
            </li>
            <li>
              <span className="ad-health-ico ad-tint--sky"><Icon name="audit" size={15} /></span>
              <span>Security Isolation</span>
              <Badge tone="green">Fail-closed</Badge>
            </li>
          </ul>
          <p className="ad-status-foot">Security comes first. No privileged data or actions are connected.</p>
        </Panel>
      </div>

      {/* Smart Tools Dock */}
      <Panel title="Smart Tools" icon="sparkles" description="Preview-safe utilities built into this workspace">
        <div className="ad-smart-tools">
          <button type="button" className="ad-smart-tool" onClick={() => navigate('/admin/bios')}>
            <span className="ad-smart-tool-icon ad-tint--lavender"><Icon name="edit" size={19} /></span>
            <strong>Draft Scratchpad</strong>
            <small>Browser-only form practice</small>
          </button>
          <button type="button" className="ad-smart-tool" onClick={() => navigate('/admin/content')}>
            <span className="ad-smart-tool-icon ad-tint--sky"><Icon name="search" size={19} /></span>
            <strong>SEO Inventory</strong>
            <small>{TOOLS.length} bundled tool tags</small>
          </button>
          <button type="button" className="ad-smart-tool" onClick={exportBundledCatalog}>
            <span className="ad-smart-tool-icon ad-tint--mint"><Icon name="download" size={19} /></span>
            <strong>Export Catalog</strong>
            <small>Download bundled CSV</small>
          </button>
          <button type="button" className="ad-smart-tool" onClick={() => navigate('/admin/security')}>
            <span className="ad-smart-tool-icon ad-tint--amber"><Icon name="shieldCheck" size={19} /></span>
            <strong>Security Blueprint</strong>
            <small>8-role RBAC proposal</small>
          </button>
        </div>
      </Panel>
    </div>
  );
}
