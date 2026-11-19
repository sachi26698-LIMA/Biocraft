import type { ComponentType } from 'react';
import {
  SkeletonAvatar,
  SkeletonBlock,
  SkeletonButton,
  SkeletonCard,
  SkeletonCellGrid,
  SkeletonChip,
  SkeletonChipRow,
  SkeletonInput,
  SkeletonLine,
  SkeletonRegion,
  SkeletonRows,
  SkeletonTextarea,
} from './Skeleton';
import type { ToolKey } from '../../tools/registry';

/**
 * Context-specific skeleton compositions — one per tool, one per page.
 *
 * Each composition mirrors the real layout it stands in for (same stacking
 * order, same approximate heights), so swapping skeleton → content does not
 * shift the page. These render ONLY while genuine loading is in flight:
 *  - route/tool lazy chunks (`Suspense` fallbacks in ToolShell/ToolWorkspace)
 *  - genuine async generation (BioTool / MoodBoardTool `generating` state)
 *  - genuine remote fetches (BioCollectionPage Supabase fetch)
 * There are deliberately no timers or fake delays anywhere.
 */

/* ------------------------------------------------------------------ */
/* Shared fragments                                                    */
/* ------------------------------------------------------------------ */

/** Tool panel header: heading line + subheading line + actions row. */
function PanelHeadSkeleton() {
  return (
    <div className="skel-panel-head">
      <SkeletonLine width="46%" height={26} />
      <SkeletonLine width="78%" height={16} />
      <div className="skel-actions-row">
        <SkeletonChip width={120} />
        <SkeletonChip width={104} />
      </div>
    </div>
  );
}

/** Form column: two inputs + segmented row + primary button. */
function FormColumnSkeleton({ inputs = 2 }: { inputs?: number }) {
  return (
    <div className="skel-form-col">
      {Array.from({ length: inputs }, (_, i) => (
        <div key={i} className="skel-field">
          <SkeletonLine width="32%" height={12} />
          <SkeletonInput />
        </div>
      ))}
      <SkeletonChipRow count={3} />
      <SkeletonButton />
    </div>
  );
}

/** Results column: header row + N result cards. */
function ResultsColumnSkeleton({ cards = 5 }: { cards?: number }) {
  return (
    <div className="skel-results-col">
      <div className="skel-results-head">
        <SkeletonLine width="38%" height={18} />
        <SkeletonChip width={96} />
      </div>
      {Array.from({ length: cards }, (_, i) => (
        <SkeletonCard key={i} lines={2} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Per-tool skeletons (Suspense fallbacks + generating states)         */
/* ------------------------------------------------------------------ */

export function BioSkeleton() {
  return (
    <SkeletonRegion label="Loading bio generator">
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <FormColumnSkeleton inputs={2} />
        <ResultsColumnSkeleton cards={5} />
      </div>
    </SkeletonRegion>
  );
}

export function CaptionSkeleton() {
  return (
    <SkeletonRegion label="Loading caption generator">
      <PanelHeadSkeleton />
      <div className="skel-form-col">
        <div className="skel-field">
          <SkeletonLine width="22%" height={12} />
          <SkeletonChipRow count={6} />
        </div>
        <div className="skel-field">
          <SkeletonLine width="18%" height={12} />
          <SkeletonChipRow count={5} />
        </div>
        <SkeletonChipRow count={3} />
        <SkeletonButton />
      </div>
      <ResultsColumnSkeleton cards={5} />
    </SkeletonRegion>
  );
}

export function UsernameSkeleton() {
  return (
    <SkeletonRegion label="Loading username generator">
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <FormColumnSkeleton inputs={2} />
        <div className="skel-results-col">
          <div className="skel-results-head">
            <SkeletonLine width="38%" height={18} />
            <SkeletonChip width={96} />
          </div>
          <div className="skel-username-grid">
            {Array.from({ length: 12 }, (_, i) => (
              <SkeletonCard key={i} lines={1} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function HashtagSkeleton() {
  return (
    <SkeletonRegion label="Loading hashtag generator">
      <PanelHeadSkeleton />
      <div className="skel-form-col">
        <div className="skel-field">
          <SkeletonLine width="22%" height={12} />
          <SkeletonChipRow count={6} />
        </div>
        <SkeletonChipRow count={3} />
        <SkeletonInput />
        <SkeletonButton />
      </div>
      <div className="skel-results-col">
        <div className="skel-results-head">
          <SkeletonLine width="38%" height={18} />
          <SkeletonChip width={96} />
        </div>
        <SkeletonTextarea />
        <SkeletonChipRow count={8} />
        <SkeletonChipRow count={6} />
      </div>
    </SkeletonRegion>
  );
}

export function SymbolSkeleton() {
  return (
    <SkeletonRegion label="Loading emoji and symbol library">
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <div className="skel-form-col">
          <div className="skel-field">
            <SkeletonLine width="32%" height={12} />
            <SkeletonInput />
          </div>
          <SkeletonChipRow count={8} />
          <SkeletonChipRow count={8} />
        </div>
        <SkeletonCellGrid count={48} />
      </div>
    </SkeletonRegion>
  );
}

/** Shared by Fancy Fonts + Stylish Name (identical layout, different copy). */
function FontSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label}>
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <div className="skel-form-col">
          <div className="skel-field">
            <SkeletonLine width="32%" height={12} />
            <SkeletonTextarea />
          </div>
          <SkeletonChipRow count={4} />
        </div>
        <div className="skel-results-col">
          <div className="skel-results-head">
            <SkeletonLine width="38%" height={18} />
            <SkeletonChip width={96} />
          </div>
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCard key={i} lines={1} />
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function FancyFontSkeleton() {
  return <FontSkeleton label="Loading fancy font generator" />;
}

export function StylishNameSkeleton() {
  return <FontSkeleton label="Loading stylish name generator" />;
}

export function DesignStudioSkeleton() {
  return (
    <SkeletonRegion label="Loading design studio">
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <div className="skel-form-col">
          <div className="skel-field">
            <SkeletonLine width="32%" height={12} />
            <SkeletonTextarea />
          </div>
          <SkeletonInput />
          <SkeletonInput />
          <SkeletonButton />
        </div>
        <div className="skel-results-col">
          <SkeletonCard lines={3} />
          <div className="skel-mix-grid">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonCard key={i} lines={2} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonRegion>
  );
}

export function LinkedInHeadlineSkeleton() {
  return (
    <SkeletonRegion label="Loading LinkedIn headline generator">
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <FormColumnSkeleton inputs={3} />
        <ResultsColumnSkeleton cards={5} />
      </div>
    </SkeletonRegion>
  );
}

export function LinkedInSummarySkeleton() {
  return (
    <SkeletonRegion label="Loading LinkedIn summary generator">
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <FormColumnSkeleton inputs={2} />
        <div className="skel-results-col">
          <div className="skel-results-head">
            <SkeletonLine width="38%" height={18} />
            <SkeletonChip width={96} />
          </div>
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} lines={4} />
          ))}
        </div>
      </div>
    </SkeletonRegion>
  );
}

/** Shared by WhatsApp Status + Snapchat Captions (MoodBoard layout). */
function MoodBoardSkeleton({ label }: { label: string }) {
  return (
    <SkeletonRegion label={label}>
      <PanelHeadSkeleton />
      <div className="skel-two-col">
        <div className="skel-form-col">
          <div className="skel-field">
            <SkeletonLine width="28%" height={12} />
            <SkeletonChipRow count={6} />
          </div>
          <SkeletonChipRow count={3} />
          <SkeletonButton />
        </div>
        <ResultsColumnSkeleton cards={5} />
      </div>
    </SkeletonRegion>
  );
}

export function WhatsappStatusSkeleton() {
  return <MoodBoardSkeleton label="Loading WhatsApp status generator" />;
}

export function SnapchatCaptionSkeleton() {
  return <MoodBoardSkeleton label="Loading Snapchat caption generator" />;
}

/** Palette tool: a swatch grid mirrors the real output shape. */
export function PaletteSkeleton() {
  return (
    <SkeletonRegion label="Loading colour palette generator">
      <PanelHeadSkeleton />
      <div className="skel-field">
        <SkeletonLine width="22%" height={12} />
        <SkeletonLine width="100%" height={40} />
      </div>
      <div className="skel-swatch-grid">
        {Array.from({ length: 12 }, (_, i) => <span key={i} className="skel-swatch" />)}
      </div>
    </SkeletonRegion>
  );
}

/** Icon finder: a dense square grid mirrors the real output shape. */
export function IconSkeleton() {
  return (
    <SkeletonRegion label="Loading brand icon library">
      <PanelHeadSkeleton />
      <div className="skel-field">
        <SkeletonLine width="26%" height={12} />
        <SkeletonLine width="100%" height={40} />
      </div>
      <div className="skel-icon-grid">
        {Array.from({ length: 30 }, (_, i) => <span key={i} className="skel-icon-cell" />)}
      </div>
    </SkeletonRegion>
  );
}

/** Registry: tool key → its own skeleton. No generic fallback exists. */
export const TOOL_SKELETONS: Record<ToolKey, ComponentType> = {
  bio: BioSkeleton,
  'stylish-name': StylishNameSkeleton,
  'fancy-fonts': FancyFontSkeleton,
  'design-studio': DesignStudioSkeleton,
  username: UsernameSkeleton,
  symbols: SymbolSkeleton,
  hashtags: HashtagSkeleton,
  captions: CaptionSkeleton,
  'linkedin-headline': LinkedInHeadlineSkeleton,
  'linkedin-summary': LinkedInSummarySkeleton,
  'whatsapp-status': WhatsappStatusSkeleton,
  'snapchat-caption': SnapchatCaptionSkeleton,
  palette: PaletteSkeleton,
  icons: IconSkeleton,
};

/* ------------------------------------------------------------------ */
/* Generating-state skeletons (shown only while a real job runs)       */
/* ------------------------------------------------------------------ */

/** Bio results while `generating && !hasGenerated`. */
export function BioGeneratingSkeleton() {
  return (
    <SkeletonRegion label="Generating bios">
      <ResultsColumnSkeleton cards={5} />
    </SkeletonRegion>
  );
}

/** MoodBoard results while a generation job runs. */
export function MoodGeneratingSkeleton() {
  return (
    <SkeletonRegion label="Generating options">
      <ResultsColumnSkeleton cards={5} />
    </SkeletonRegion>
  );
}

/* ------------------------------------------------------------------ */
/* Page skeletons (route-level Suspense fallbacks)                     */
/* ------------------------------------------------------------------ */

export function HomeSkeleton() {
  return (
    <SkeletonRegion label="Loading BioCraft home">
      <div className="skel-hero">
        <SkeletonLine width="52%" height={30} />
        <SkeletonLine width="70%" height={16} />
        <SkeletonBlock className="skel-hero-stage" height={220} />
      </div>
      <div className="skel-workspace">
        <SkeletonChipRow count={8} />
        <PanelHeadSkeleton />
        <FormColumnSkeleton inputs={2} />
        <ResultsColumnSkeleton cards={3} />
      </div>
      <div className="skel-tile-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function CategoriesSkeleton() {
  return (
    <SkeletonRegion label="Loading categories">
      <div className="skel-hub-head">
        <SkeletonAvatar size={64} />
        <div className="skel-hub-body">
          <SkeletonLine width="40%" height={26} />
          <SkeletonLine width="85%" height={14} />
        </div>
        <SkeletonChip width={130} />
      </div>
      <div className="skel-tile-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
      <SkeletonChipRow count={6} />
    </SkeletonRegion>
  );
}

export function CollectionsIndexSkeleton() {
  return (
    <SkeletonRegion label="Loading bio collections">
      {/* Hub header: eyebrow + h1 + lede + stat block */}
      <div className="skel-hub-head skel-hub-head--hero">
        <div className="skel-hub-body">
          <SkeletonLine width="22%" height={12} />
          <SkeletonLine width="72%" height={30} />
          <SkeletonLine width="88%" height={14} />
          <SkeletonLine width="64%" height={14} />
        </div>
        <div className="skel-stat-row">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonBlock key={i} className="skel-stat" height={62} />
          ))}
        </div>
      </div>
      {/* Search + View all */}
      <div className="skel-search-row">
        <SkeletonInput />
        <SkeletonButton width={180} />
      </div>
      {/* Featured collection cards (two-up) */}
      <SkeletonLine width="34%" height={20} />
      <div className="skel-featured-grid">
        {Array.from({ length: 2 }, (_, i) => (
          <SkeletonCard key={i} lines={3} />
        ))}
      </div>
      {/* Category chips */}
      <SkeletonChipRow count={10} />
      {/* Collection cards */}
      <div className="skel-tile-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function BioLibrarySkeleton() {
  return (
    <SkeletonRegion label="Loading the bio library">
      <div className="skel-hub-head skel-hub-head--hero">
        <div className="skel-hub-body">
          <SkeletonLine width="26%" height={12} />
          <SkeletonLine width="38%" height={30} />
          <SkeletonLine width="86%" height={14} />
        </div>
        <div className="skel-stat-row">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonBlock key={i} className="skel-stat" height={54} />
          ))}
        </div>
      </div>
      <SkeletonInput />
      <div className="skel-facet-row">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonBlock key={i} className="skel-facet" height={62} />
        ))}
      </div>
      <SkeletonLine width="30%" height={14} />
      <div className="skel-lib-grid">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonCard key={i} lines={3} />
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function CollectionDetailSkeleton() {
  return (
    <SkeletonRegion label="Loading bio collection">
      <div className="skel-detail-head">
        <SkeletonAvatar size={78} />
        <div className="skel-hub-body">
          <SkeletonLine width="60%" height={26} />
          <SkeletonLine width="80%" height={14} />
          <SkeletonChipRow count={3} />
        </div>
      </div>
      <SkeletonInput />
      <SkeletonChipRow count={5} />
      <div className="skel-bio-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} lines={3} />
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function BioEditorSkeleton() {
  return (
    <SkeletonRegion label="Loading bio editor">
      <div className="skel-hub-head">
        <SkeletonAvatar size={64} />
        <div className="skel-hub-body">
          <SkeletonLine width="40%" height={26} />
          <SkeletonLine width="85%" height={14} />
        </div>
      </div>
      <div className="skel-two-col">
        <div className="skel-form-col">
          <SkeletonTextarea />
          <SkeletonChipRow count={6} />
          <SkeletonInput />
          <SkeletonButton />
        </div>
        <SkeletonCard lines={4} />
      </div>
    </SkeletonRegion>
  );
}

export function FeaturesSkeleton() {
  return (
    <SkeletonRegion label="Loading features">
      <div className="skel-hero">
        <SkeletonLine width="60%" height={30} />
        <SkeletonLine width="80%" height={16} />
        <SkeletonChipRow count={4} />
      </div>
      <div className="skel-tile-grid">
        {Array.from({ length: 9 }, (_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
    </SkeletonRegion>
  );
}

/**
 * Library routes (search + font browser) load their first page from the database.
 * A card grid matches the shape of the content that replaces it, so the route does
 * not shift when the page arrives.
 */
export function LibrarySkeleton() {
  return (
    <SkeletonRegion label="Loading library">
      <SkeletonLine width="42%" height={30} />
      <SkeletonLine width="72%" height={16} />
      <div className="skel-card-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="skel-card">
            <SkeletonLine width="70%" height={18} />
            <SkeletonLine width="100%" height={14} />
            <SkeletonLine width="88%" height={14} />
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}

export function InfoSkeleton() {
  return (
    <SkeletonRegion label="Loading page">
      <SkeletonLine width="55%" height={30} />
      <SkeletonLine width="85%" height={16} />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="skel-form-col">
          <SkeletonLine width="38%" height={20} />
          <SkeletonLine width="100%" height={14} />
          <SkeletonLine width="92%" height={14} />
          <SkeletonLine width="64%" height={14} />
        </div>
      ))}
    </SkeletonRegion>
  );
}

export function WorkspaceSkeleton() {
  return (
    <SkeletonRegion label="Loading toolkit workspace">
      <SkeletonChipRow count={8} />
      <PanelHeadSkeleton />
      <FormColumnSkeleton inputs={2} />
      <ResultsColumnSkeleton cards={3} />
    </SkeletonRegion>
  );
}

export function AdminSkeleton() {
  return (
    <SkeletonRegion label="Loading admin module">
      <div className="skel-admin-stats">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
      <SkeletonRows count={5} />
    </SkeletonRegion>
  );
}
