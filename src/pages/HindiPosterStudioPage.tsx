import { useEffect, useMemo } from 'react';
import { HindiCrossLinks, HindiPage } from '../components/hindi/shell';
import PosterStudio from '../components/hindi/PosterStudio';
import { featuredFonts, getFont } from '../lib/hindiFonts/catalogue';
import { getSearch } from '../lib/router';

/**
 * /hindi-poster-studio — paint Hindi text onto a 1080 px poster with a real WOFF2
 * file and download the PNG. Query parameters `?font=<slug>&text=<copy>` let the
 * studio hand a line straight to the canvas.
 */
export default function HindiPosterStudioPage() {
  useEffect(() => {
    document.title = 'Hindi Poster & Typography Studio | BioCraft';
  }, []);

  const { fonts, selected, text } = useMemo(() => {
    const params = new URLSearchParams(getSearch());
    const fontSlug = params.get('font');
    return {
      fonts: featuredFonts(8),
      selected: fontSlug ? getFont(fontSlug) : null,
      text: (params.get('text') ?? '').slice(0, 220),
    };
  }, []);

  return (
    <HindiPage wide>
      <header style={{ padding: '42px 0 0' }}>
        <span className="bc-kicker">Poster &amp; social design</span>
        <h1
          style={{
            fontSize: 'clamp(32px, 4.4vw, 50px)',
            letterSpacing: '-0.04em',
            margin: '16px 0 8px',
            fontWeight: 600,
          }}
        >
          हिंदी पोस्टर स्टूडियो
        </h1>
        <p className="bc-lede" style={{ marginTop: 0 }}>
          A quote, a shayari, or your own line — painted onto a poster by the Devanagari
          font you choose. Export at 1080 px wide for Instagram.
        </p>
      </header>
      <PosterStudio initialFonts={fonts} initialFont={selected} initialText={text} />
      <HindiCrossLinks />
    </HindiPage>
  );
}
