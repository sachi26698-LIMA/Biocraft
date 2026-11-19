import { useEffect } from 'react';
import { HindiCrossLinks, HindiPage } from '../components/hindi/shell';
import BioCraftStudio from '../components/hindi/Studio';
import { catalogue, featuredFonts } from '../lib/hindiFonts/catalogue';

/**
 * /hindi-font-studio — Hindi preview plus bio, shayari, quote, caption, username
 * and stylish-text generators, all rendered by the chosen Devanagari file.
 */
export default function HindiFontStudioPage() {
  useEffect(() => {
    document.title = 'Hindi Preview, Bio & Shayari Studio | BioCraft';
  }, []);

  return (
    <HindiPage wide>
      <BioCraftStudio initialFonts={featuredFonts(8)} sampleText={catalogue.sampleText} />
      <HindiCrossLinks />
    </HindiPage>
  );
}
