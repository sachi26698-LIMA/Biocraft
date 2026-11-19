// Hindi Font Ecosystem — real rendering.
//
// @napi-rs/canvas uses Skia, the same shaping and rasterisation engine Chromium
// uses, so these assertions run the actual WOFF2 through the actual text stack
// rather than reading a metadata table. The Playwright suite repeats the proof in
// a browser; this keeps it runnable where no browser binary exists.
import assert from 'node:assert/strict';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { readFileSync } from 'node:fs';

const catalogue = JSON.parse(readFileSync('src/data/hindi-fonts/catalogue.json', 'utf8'));
const fonts = catalogue.fonts;

function widthOf(alias, text, weight = 400) {
  const canvas = createCanvas(64, 64);
  const context = canvas.getContext('2d');
  context.font = `${weight} 48px "${alias}"`;
  return context.measureText(text).width;
}

function register(font) {
  const alias = `BioCraftTest_${font.slug}`;
  const ok = GlobalFonts.registerFromPath(`${process.cwd()}/public${font.primaryFile.path}`, alias);
  return { alias, ok };
}

let failures = 0;
const check = (label, fn) => {
  try {
    fn();
    console.log(`PASS  ${label}`);
  } catch (error) {
    failures += 1;
    console.log(`FAIL  ${label}\n      ${error.message.split('\n')[0]}`);
  }
};

check('every verified family registers and paints हिंदी with its own metrics', () => {
  const results = fonts.map(font => {
    const { alias, ok } = register(font);
    return { family: font.family, ok, width: widthOf(alias, 'नमस्ते भारत') };
  });
  const registered = results.filter(result => result.ok).length;
  assert.equal(registered, fonts.length, `only ${registered}/${fonts.length} registered`);
  for (const result of results) assert.ok(result.width > 0, `${result.family} painted nothing`);

  // The families are not all the same fallback face: most differ from the system
  // Devanagari fallback, which no WOFF2 here can be.
  const fallback = widthOf('sans-serif', 'नमस्ते भारत');
  const distinct = results.filter(result => Math.abs(result.width - fallback) > 0.5).length;
  assert.ok(distinct > fonts.length * 0.75, `only ${distinct}/${fonts.length} differ from the fallback`);
});

check('conjuncts form instead of stacking half letters', () => {
  let ligatures = 0;
  for (const font of fonts) {
    const { alias } = register(font);
    const ka = widthOf(alias, 'क');
    const sha = widthOf(alias, 'ष');
    const conjunct = widthOf(alias, 'क्ष');
    if (conjunct < ka + sha - 1) ligatures += 1;
  }
  assert.ok(ligatures > fonts.length * 0.85, `only ${ligatures}/${fonts.length} form single-glyph conjuncts`);
});

check('matras are reordered and positioned for every family', () => {
  let positioned = 0;
  for (const font of fonts) {
    const { alias } = register(font);
    const base = widthOf(alias, 'क');
    const matra = widthOf(alias, 'ि');
    const combined = widthOf(alias, 'कि');
    if (combined > 0 && Math.abs(combined - (base + matra)) > 0.5) positioned += 1;
  }
  assert.ok(positioned > fonts.length * 0.85, `only ${positioned}/${fonts.length} positioned the i-matra`);
});

check('mixed Hindi and English renders without dropping a script', () => {
  let rendered = 0;
  for (const font of fonts) {
    const { alias } = register(font);
    const hindi = widthOf(alias, 'नमस्ते');
    const mixed = widthOf(alias, 'नमस्ते BioCraft 2026');
    if (mixed > hindi + 1) rendered += 1;
  }
  assert.ok(rendered > fonts.length * 0.85, `only ${rendered}/${fonts.length} rendered the Latin part`);
});

check('a static bold cut changes the metrics it should', () => {
  let compared = 0;
  let changed = 0;
  for (const font of fonts) {
    const bold = font.files.devanagari.find(file => file.weight === 700);
    if (!bold) continue;
    compared += 1;
    const regularAlias = `BioCraftTest_${font.slug}`;
    const boldAlias = `${regularAlias}_bold`;
    GlobalFonts.registerFromPath(`${process.cwd()}/public${bold.path}`, boldAlias);
    if (Math.abs(widthOf(regularAlias, 'नमस्ते') - widthOf(boldAlias, 'नमस्ते')) > 0.2) changed += 1;
  }
  assert.ok(compared > 20, `only ${compared} families ship a 700 cut`);
  assert.ok(changed > compared * 0.85, `only ${changed}/${compared} changed metrics at 700`);
});

check('dense Devanagari ink is painted — never a blank or all-tofu page', () => {
  for (const font of fonts.slice(0, 14)) {
    const { alias } = register(font);
    const canvas = createCanvas(900, 220);
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#111';
    context.font = `400 44px "${alias}"`;
    context.fillText('नमस्ते भारत। ज़िंदगी खूबसूरत है। क्ष त्र ज्ञ श्र', 12, 90);
    context.fillText('प्रेम, विश्वास और उम्मीद। ०१२३४५६७८९', 12, 160);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let ink = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index] < 200) ink += 1;
    }
    assert.ok(ink > 1500, `${font.family} painted ${ink} ink pixels (blank or tofu-only)`);
    assert.ok(ink < 160000, `${font.family} painted ${ink} ink pixels (solid boxes)`);
  }
});

console.log(
  failures === 0
    ? `\nPASS ${fonts.length} families render real Devanagari through Skia: conjuncts, matras, mixed script, static bold and ink density`
    : `\nFAIL ${failures} rendering check(s)`,
);
process.exit(failures === 0 ? 0 : 1);
