import { useEffect } from 'react';
import { HindiCrossLinks, HindiNotFound, HindiPage } from '../components/hindi/shell';
import FontSpecimenClient from '../components/hindi/FontSpecimen';
import { catalogue, getFont } from '../lib/hindiFonts/catalogue';

/**
 * /hindi-fonts/:slug — one family, its real glyph sheet, licence and downloads.
 *
 * The slug is read from the router path (BioCraft uses a History-API router, not
 * file-based routes). An unknown slug renders the shared 404 body, so a stale or
 * mistyped link never produces a blank page.
 */
export default function HindiFontSpecimenPage({ slug }: { slug: string }) {
  const font = getFont(slug);

  useEffect(() => {
    document.title = font
      ? `${font.family} — Hindi Devanagari Font | BioCraft`
      : 'Hindi font not found | BioCraft';
  }, [font]);

  if (!font) return <HindiNotFound />;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: font.family,
    description: font.description,
    inLanguage: ['hi', 'en'],
    license: font.license.url,
    version: font.source.version,
    creator: { '@type': 'Organization', name: font.license.attribution },
    isFamilyFriendly: true,
  };

  return (
    <HindiPage wide>
      <script
        type="application/ld+json"
        // Static, generated from the committed catalogue; no visitor input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="bc-specimen-hero">
        <FontSpecimenClient font={font} sampleText={catalogue.sampleText} />
      </div>
      <HindiCrossLinks />
    </HindiPage>
  );
}
