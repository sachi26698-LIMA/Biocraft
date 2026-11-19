import { useEffect } from 'react';
import { HindiCrossLinks, HindiPage } from '../components/hindi/shell';
import FontLibrary from '../components/hindi/FontLibrary';
import { catalogue, fontFacets, listFonts } from '../lib/hindiFonts/catalogue';

/**
 * /hindi-fonts — the verified Devanagari library.
 *
 * Every value on this page comes from the committed catalogue in the bundle, so
 * it renders identically offline, with Supabase unreachable, and on a static
 * host. The initial page is computed synchronously rather than waited for.
 */
export default function HindiFontsPage() {
  useEffect(() => {
    document.title = 'हिंदी फ़ॉन्ट लाइब्रेरी — 62 Verified Devanagari Fonts | BioCraft';
  }, []);

  const facets = fontFacets();
  const page = listFonts({ limit: 12 });
  const initial = {
    ...page,
    facets: { categories: facets.categories, tags: facets.tags, total: facets.total },
    catalogue: {
      generatedAt: catalogue.generatedAt,
      sampleText: catalogue.sampleText,
      stats: catalogue.stats,
    },
  };

  return (
    <HindiPage wide>
      <header style={{ padding: '42px 0 4px' }}>
        <span className="bc-kicker">The library</span>
        <h1
          style={{
            fontSize: 'clamp(34px, 4.6vw, 52px)',
            letterSpacing: '-0.04em',
            margin: '16px 0 8px',
            fontWeight: 600,
          }}
        >
          हिंदी फ़ॉन्ट लाइब्रेरी
        </h1>
        <p className="bc-lede" style={{ marginTop: 0 }}>
          {facets.total} verified Devanagari families. Search in English or Hindi, set your
          own preview text, and only the fonts on screen are downloaded.
        </p>
      </header>
      <FontLibrary initial={initial} sampleText={catalogue.sampleText} />
      <HindiCrossLinks />
    </HindiPage>
  );
}
