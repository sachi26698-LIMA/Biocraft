import { lazy, Suspense, useEffect, useRef, type ReactNode } from 'react';
import { handleAnchorClick, navigate, usePath } from '../lib/router';
import ToolWorkspace from './ToolWorkspace';
import Breadcrumbs from './Breadcrumbs';
import { TOOLS, toolForPath } from '../tools/registry';
import { useRecentlyUsed } from '../lib/toolbox';
import { infoPageForPath } from '../pages/info';
import { collectionForPath } from '../lib/bioCollections';
import {
  BioEditorSkeleton,
  CategoriesSkeleton,
  CollectionDetailSkeleton,
  CollectionsIndexSkeleton,
  FeaturesSkeleton,
  HomeSkeleton,
  InfoSkeleton,
} from './skeleton/toolSkeletons';

const HomePage = lazy(() => import('../pages/HomePage'));
const InfoPage = lazy(() => import('../pages/InfoPage'));
const FeaturesPage = lazy(() => import('../pages/FeaturesPage'));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage'));
const BioCollectionsPage = lazy(() => import('../pages/BioCollectionsPage'));
const BioCollectionPage = lazy(() => import('../pages/BioCollectionPage'));
const BioEditorPage = lazy(() => import('../pages/BioEditorPage'));

const TOOL_PATHS = new Set(TOOLS.map((tool) => tool.path));
const COLLECTIONS_INDEX = '/bio-collections';
const BIO_EDITOR = '/bio-editor';
const HOME = '/';
// This import is removed from production builds; the route is not linked publicly.
const diagnosticsEnabled = typeof __BIOCRAFT_PREVIEW_DIAGNOSTICS__ !== 'undefined' && __BIOCRAFT_PREVIEW_DIAGNOSTICS__;
const DiagnosticsPage = diagnosticsEnabled ? lazy(() => import('../pages/PreviewDiagnosticsPage')) : null;

// Resolve in-page links only after lazy route content is mounted.
function ReadyPage({ path, children }: { path: string; children: ReactNode }) {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) document.getElementById(hash)?.scrollIntoView?.({ block: 'start' });
  }, [path]);
  return children;
}
function DeferredPage({
  path,
  skeleton,
  children,
}: {
  path: string;
  /** Route-specific composition that mirrors this page's real layout. */
  skeleton: ReactNode;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={skeleton}>
      <ReadyPage path={path}>{children}</ReadyPage>
    </Suspense>
  );
}

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
  const prevPath = useRef<string | null>(null);
  const isHome = path === HOME;
  const isCategories = path === '/categories';
  const isCollectionsIndex = path === COLLECTIONS_INDEX;
  const isBioEditor = path === BIO_EDITOR;
  const isFeatures = path === '/features';
  const isDiagnostics = diagnosticsEnabled && path === '/preview-diagnostics';
  const collection = collectionForPath(path);
  const tool = toolForPath(path);
  const isToolRoute = TOOL_PATHS.has(path);
  const infoPage = infoPageForPath(path);
  const { record } = useRecentlyUsed();

  useEffect(() => {
    if (!isHome && !isToolRoute && !infoPage && !isCategories && !isCollectionsIndex && !isBioEditor && !isFeatures && !isDiagnostics && !collection) {
      navigate(HOME, { replace: true });
    }
  }, [isHome, isToolRoute, infoPage, isCategories, isCollectionsIndex, isBioEditor, isFeatures, isDiagnostics, collection]);

  // Load only the small common-math font on routes whose content needs it.
  useEffect(() => {
    const hasCommonMath = collection?.bios.some((bio) => /[\u{1d400}-\u{1d433}\u{1d5d4}-\u{1d607}\u{1d670}-\u{1d6a3}]/u.test(bio.text));
    if ((hasCommonMath || path === '/stylish-name-generator' || path === '/fancy-font-generator') && document.fonts?.load) {
      void document.fonts.load('400 1em "Noto Sans Math"', '𝐀').catch(() => {});
    }
  }, [path, collection]);

  useEffect(() => {
    if (isToolRoute) record(tool.key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, isToolRoute]);

  // Restore focus after client-side route changes, but never steal it on load.
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
    if (isDiagnostics) {
      document.title = 'Preview Diagnostics — BioCraft';
    } else if (isHome) {
      document.title = 'BioCraft — All-in-One Social Media Toolkit';
    } else if (isToolRoute) {
      document.title = tool.title;
    } else if (infoPage) {
      document.title = infoPage.title;
    } else if (isCategories) {
      document.title = 'Categories — BioCraft Social Media Toolkit';
    } else if (isCollectionsIndex) {
      document.title = 'Ready-Made Bio Collections — BioCraft Social Media Toolkit';
    } else if (isFeatures) {
      document.title = 'Features — BioCraft Social Media Toolkit';
    } else if (isBioEditor) {
      document.title = 'Bio Editor — Style & Copy Your Instagram Bio | BioCraft';
    } else if (collection) {
      document.title = collection.seoTitle;
    }
  }, [isHome, isToolRoute, infoPage, isCategories, isCollectionsIndex, isBioEditor, isFeatures, isDiagnostics, collection, tool]);

  if (isDiagnostics && DiagnosticsPage) return <Suspense fallback={<div role="status">Loading diagnostics…</div>}><DiagnosticsPage /></Suspense>;
  if (isHome) return <DeferredPage path={path} skeleton={<HomeSkeleton />}><HomePage /></DeferredPage>;
  if (isCategories) return <DeferredPage path={path} skeleton={<CategoriesSkeleton />}><CategoriesPage /></DeferredPage>;
  if (isCollectionsIndex) return <DeferredPage path={path} skeleton={<CollectionsIndexSkeleton />}><BioCollectionsPage /></DeferredPage>;
  if (isBioEditor) return <DeferredPage path={path} skeleton={<BioEditorSkeleton />}><BioEditorPage /></DeferredPage>;
  if (collection) return <DeferredPage path={path} skeleton={<CollectionDetailSkeleton />}><BioCollectionPage slug={collection.slug} /></DeferredPage>;
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
  if (isFeatures) return <DeferredPage path={path} skeleton={<FeaturesSkeleton />}><FeaturesPage /></DeferredPage>;
  if (infoPage) return <DeferredPage path={path} skeleton={<InfoSkeleton />}><InfoPage path={path} /></DeferredPage>;
  return <DeferredPage path={path} skeleton={<HomeSkeleton />}><HomePage /></DeferredPage>;
}
