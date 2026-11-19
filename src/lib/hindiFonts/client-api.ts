import type { FontFacet, FontListPage, FontRecord, FontSort } from './types';
import { fontsBySlug, fontFacets, listFonts } from './catalogue';

/**
 * Public font queries — local, not a network client.
 *
 * The original module fetched `/api/fonts` from a Next.js route handler. In
 * BioCraft the catalogue ships with the bundle, so these helpers answer from the
 * committed JSON in the same process. The signatures stay promise-shaped so the
 * components read identically and the call sites stay testable, but no request
 * is made: a public page must keep working with the network and database down.
 */

export type FontListResponse = FontListPage & {
  facets?: { categories: FontFacet[]; tags: FontFacet[]; total: number };
  catalogue?: {
    generatedAt: string;
    sampleText: string;
    stats: {
      discovered: number;
      verified: number;
      rejected: number;
      families: number;
      files: number;
      variableFamilies: number;
    };
  };
};

export type FontListParams = {
  q?: string;
  category?: string;
  tag?: string;
  sort?: FontSort;
  cursor?: string | null;
  limit?: number;
};

function aborted(signal?: AbortSignal): boolean {
  return Boolean(signal?.aborted);
}

/** Resolves asynchronously to keep the loading states the UI already renders. */
export async function fetchFontPage(
  params: FontListParams,
  signal?: AbortSignal,
): Promise<FontListResponse> {
  if (aborted(signal)) throw new DOMException('Aborted', 'AbortError');
  return listFonts(params);
}

export async function fetchFontsBySlug(
  slugs: string[],
  signal?: AbortSignal,
): Promise<FontRecord[]> {
  if (aborted(signal)) throw new DOMException('Aborted', 'AbortError');
  return fontsBySlug(slugs);
}

export async function fetchFontFacets(
  signal?: AbortSignal,
): Promise<{ categories: FontFacet[]; tags: FontFacet[]; total: number }> {
  if (aborted(signal)) throw new DOMException('Aborted', 'AbortError');
  const facets = fontFacets();
  return { categories: facets.categories, tags: facets.tags, total: facets.total };
}
