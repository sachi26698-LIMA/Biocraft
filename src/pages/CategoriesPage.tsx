import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolTile from '../components/ToolTile';
import CategoryCards, { categoryIcon } from '../components/CategoryCards';
import { HeartIcon, GridIcon } from '../components/icons';
import { TOOLS, type ToolKey } from '../tools/registry';
import { CATEGORY_META } from '../lib/categoryMeta';
import { useFavourites, useRecentlyUsed } from '../lib/toolbox';
import Dropdown from '../components/ui/Dropdown';

type SortMode = 'default' | 'az' | 'recent';

const SORT_LABELS: Record<SortMode, string> = {
  default: 'Default order',
  az: 'A–Z',
  recent: 'Recently used',
};

const TOOL_BY_KEY = new Map(TOOLS.map((tool) => [tool.key, tool]));

export default function CategoriesPage() {
  const { favs } = useFavourites();
  const { recent } = useRecentlyUsed();
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortMode>('default');

  const favTools = [...favs].map((key) => TOOL_BY_KEY.get(key as ToolKey)).filter((t): t is (typeof TOOLS)[number] => Boolean(t));
  const recentTools = recent.map((key) => TOOL_BY_KEY.get(key as ToolKey)).filter((t): t is (typeof TOOLS)[number] => Boolean(t));
  const activeFilter = CATEGORY_META.find((category) => category.id === filter);
  const filteredTools = activeFilter ? TOOLS.filter((tool) => activeFilter.tools.includes(tool.key)) : TOOLS;
  /** Sort is a real, local control: default registry order, A–Z, or recency. */
  const shownTools = (() => {
    if (sort === 'az') return [...filteredTools].sort((a, b) => a.heading.localeCompare(b.heading));
    if (sort === 'recent') {
      const rank = new Map(recent.map((key, index) => [key, index]));
      return [...filteredTools].sort((a, b) => (rank.get(a.key) ?? 99) - (rank.get(b.key) ?? 99));
    }
    return filteredTools;
  })();

  return (
    <section className="page categories-page">
      <div className="container narrow">
        <Breadcrumbs
          trail={[
            { label: 'Home', href: '/' },
            { label: 'All Tools', href: '/resources' },
            { label: 'Categories' },
          ]}
        />

        <header className="hub-header">
          <span className="hub-header-icon" aria-hidden="true">
            <GridIcon size={30} />
          </span>
          <span className="hub-header-body">
            <h1>Categories</h1>
            <p>
              Every BioCraft tool, grouped by what you’re trying to ship — counts are real, straight
              from the registry, and favourites live only in your browser.
            </p>
          </span>
          <span className="hub-header-count" aria-label={`${TOOLS.length} tools across ${CATEGORY_META.length} categories`}>
            {TOOLS.length} tools · {CATEGORY_META.length} categories
          </span>
        </header>

        <CategoryCards />
      </div>

      <div className="container narrow">
        <section className="categories-section" aria-labelledby="favourites-heading" id="favourites">
          <div className="categories-section-head">
            <h2 id="favourites-heading">
              <HeartIcon size={20} aria-hidden="true" /> Your Favourite Tools
            </h2>
            <p>Tap the star on any tool to pin it here. Stored locally — nothing leaves your device.</p>
          </div>
          {favTools.length > 0 ? (
            <ul className="tile-grid">
              {favTools.map((tool) => (
                <ToolTile key={tool.key} toolKey={tool.key} />
              ))}
            </ul>
          ) : (
            <div className="empty-state" role="status">
              <p className="empty-state-title">No favourites yet</p>
              <p className="empty-state-text">Star any tool below — it will appear here for quick access.</p>
            </div>
          )}
        </section>

        {recentTools.length > 0 && (
          <section className="categories-section" aria-labelledby="recent-heading">
            <div className="categories-section-head">
              <h2 id="recent-heading">Recently used</h2>
              <p>The last {recentTools.length} tools you opened on this device.</p>
            </div>
            <ul className="tile-grid">
              {recentTools.map((tool) => (
                <ToolTile key={tool.key} toolKey={tool.key} />
              ))}
            </ul>
          </section>
        )}

        <section className="categories-section" aria-labelledby="all-tools-heading">
          <div className="categories-section-head">
            <h2 id="all-tools-heading">All Tools</h2>
            <p>The complete BioCraft toolkit — every tool below runs privately in your browser.</p>
          </div>
          <div className="hub-filter">
            <label className="hub-filter-label" htmlFor="hub-filter-select">Category</label>
            <select
              id="hub-filter-select"
              className="select hub-filter-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All tools ({TOOLS.length})</option>
              {CATEGORY_META.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.tools.length})
                </option>
              ))}
            </select>
            <Dropdown
              label={`Sort: ${SORT_LABELS[sort]}`}
              className="hub-sort"
              items={[
                { id: 'default', label: 'Default order', onSelect: () => setSort('default') },
                { id: 'az', label: 'A–Z', onSelect: () => setSort('az') },
                { id: 'recent', label: 'Recently used first', onSelect: () => setSort('recent') },
              ]}
            />
            <p className="hub-showing" role="status">
              Showing {shownTools.length} of {TOOLS.length} tools
            </p>
          </div>
          <ul className="tile-grid tile-grid--twelve">
            {shownTools.map((tool) => (
              <ToolTile key={tool.key} toolKey={tool.key} />
            ))}
          </ul>
        </section>

        <nav className="explore-others" aria-label="Explore other categories">
          <p className="explore-others-label">Explore other categories</p>
          <ul>
            {CATEGORY_META.map((category) => (
              <li key={category.id}>
                <a className="chip category-chip" href={`#cat-${category.id}`}>
                  <span className="category-chip-icon" aria-hidden="true">{categoryIcon(category.id, { size: 16 })}</span>
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
