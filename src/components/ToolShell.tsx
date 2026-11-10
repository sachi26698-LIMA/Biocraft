import { useEffect, useRef } from 'react';
import { handleAnchorClick, navigate, usePath } from '../lib/router';
import ToolWorkspace from './ToolWorkspace';
import Breadcrumbs from './Breadcrumbs';
import { TOOLS, toolForPath } from '../tools/registry';
import { useRecentlyUsed } from '../lib/toolbox';
import HomePage from '../pages/HomePage';
import InfoPage from '../pages/InfoPage';
import CategoriesPage from '../pages/CategoriesPage';
import { infoPageForPath } from '../pages/info';

const TOOL_PATHS = new Set(TOOLS.map((tool) => tool.path));
const HOME = '/';

/**
 * Route dispatcher.
 *
 *  /                     → homepage (hero + workspace, Instagram/Bio preselected)
 *  /bio-generator        → same toolkit page, Bio preselected (alias kept for SEO)
 *  /<tool>               → slim tool page (breadcrumb + workspace), same toolkit
 *  /categories           → discovery hub: categories, favourites, recently used
 *  /<info page>          → static content page (features, pricing, …)
 *  anything else         → replaced with "/"
 *
 * The workspace never reloads; only the panel body swaps.
 */
export default function ToolShell() {
  const path = usePath();
  // Mount vs. in-app navigation: track the previous path instead of a
  // first-render ref, so focus is never stolen on a fresh page load — even
  // under StrictMode's double-effect in development.
  const prevPath = useRef<string | null>(null);

  const isHome = path === HOME;
  const isCategories = path === '/categories';
  const tool = toolForPath(path);
  const isToolRoute = TOOL_PATHS.has(path);
  const infoPage = infoPageForPath(path);
  const { record } = useRecentlyUsed();

  // Unknown paths fall back to the homepage.
  useEffect(() => {
    if (!isHome && !isToolRoute && !infoPage && !isCategories) {
      navigate(HOME, { replace: true });
    }
  }, [isHome, isToolRoute, infoPage, isCategories]);

  // Remember tool visits (localStorage only) for the "Recently used" rail.
  useEffect(() => {
    if (isToolRoute) record(tool.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, isToolRoute]);

  // After in-app navigation the workspace remounts (route swap), which would
  // drop focus to <body>. Return focus to the panel so keyboard and
  // screen-reader users land where the action is. Not on initial page load.
  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = path;
      return;
    }
    if (prevPath.current !== path) {
      prevPath.current = path;
      document.getElementById('tool-panel')?.focus({ preventScroll: true });
    }
  }, [path]);

  useEffect(() => {
    if (isHome) {
      document.title = 'BioCraft — All-in-One Social Media Toolkit';
    } else if (isToolRoute) {
      document.title = tool.title;
    } else if (infoPage) {
      document.title = infoPage.title;
    } else if (isCategories) {
      document.title = 'Categories — BioCraft Social Media Toolkit';
    }
  }, [isHome, isToolRoute, infoPage, isCategories, tool]);

  if (isHome) return <HomePage />;
  if (isCategories) return <CategoriesPage />;
  if (isToolRoute) {
    return (
      <section className="tool-page">
        <div className="container tool-page-crumbs">
          <Breadcrumbs trail={[{ label: 'Home', href: '/' }, { label: 'All Tools', href: '/resources' }, { label: tool.heading }]} />
        </div>
        <ToolWorkspace path={path} headingLevel="h1" />
        <div className="container tool-foot">
          <ol className="tool-howto" aria-label="How to use this tool">
            <li><span className="tool-howto-step">1</span><span className="tool-howto-text"><strong>Add your details</strong> — a name, niche or a few words about you.</span></li>
            <li><span className="tool-howto-step">2</span><span className="tool-howto-text"><strong>Tune it</strong> — pick a language, tone and emoji style.</span></li>
            <li><span className="tool-howto-step">3</span><span className="tool-howto-text"><strong>Generate &amp; copy</strong> — five unique results, one tap to clipboard.</span></li>
          </ol>
          <nav className="tool-related" aria-label="Related tools">
            <span className="tool-related-label">Related tools</span>
            <span className="tool-related-links">
              {TOOLS.filter((entry) => entry.key !== tool.key).slice(0, 4).map((entry) => (
                <a key={entry.key} className="chip" href={entry.path} onClick={handleAnchorClick}>{entry.heading}</a>
              ))}
            </span>
          </nav>
        </div>
      </section>
    );
  }
  if (infoPage) return <InfoPage path={path} />;
  return <HomePage />; // transient state while the replace-navigation lands
}
