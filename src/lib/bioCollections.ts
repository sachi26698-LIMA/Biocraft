/**
 * Ready-Made Bio Collection System — data registry.
 *
 * Every bio here is original BioCraft content written for this registry.
 * Nothing is copied from external sites; brand names and trademarks do not
 * appear inside bio texts. Unicode-styled entries are produced with the same
 * rule-based engine as the Stylish Name / Fancy Font tools (applyStyle), so
 * what you see is exactly what the clipboard receives.
 *
 * Counts shown in the UI are always computed from this registry — never
 * hard-coded.
 */
import { applyStyle } from './unicodeStyles';

export type BioLang = 'en' | 'hi' | 'hg';

export interface BioEntry {
  /** Exact text copied to the clipboard (already Unicode-styled if styled). */
  text: string;
  /** Plain-text twin used for search when `text` is in styled Unicode. */
  plain?: string;
  lang: BioLang;
  /** Unicode style tag for the filter chip; omitted for normal text. */
  style?: string;
}

export interface BioFaq {
  q: string;
  a: string;
}

export interface BioCollection {
  /** Flat route slug, e.g. /instagram-bio-for-boys */
  slug: string;
  /** Full collection name used in headings and meta. */
  name: string;
  /** Emoji glyph used as the category icon (original artwork, system emoji). */
  icon: string;
  /** One-line description for index cards and related links. */
  description: string;
  seoTitle: string;
  seoDescription: string;
  /** Human month/year the collection was last reviewed. */
  updated: string;
  /** Shown as the language badge on collection pages. */
  languages: 'English' | 'Hindi' | 'English + Hindi' | 'English + Hinglish' | 'Hindi + Hinglish' | 'English + Hindi + Hinglish';
  audience: 'Boys' | 'Girls' | 'Everyone' | 'Facebook';
  lede: string;
  /** Original introductory paragraphs (2), rendered above the bio list. */
  intro: string[];
  bios: BioEntry[];
  faqs: BioFaq[];
  /** Slugs of related collections. */
  related: string[];
  /** Renders the Instagram-style sample profile preview when set. */
  preview?: 'boys' | 'girls';
}

const en = (text: string): BioEntry => ({ text, lang: 'en' });
const hi = (text: string): BioEntry => ({ text, lang: 'hi' });
const hg = (text: string): BioEntry => ({ text, lang: 'hg' });
const styled = (text: string, style: string, lang: BioLang = 'en'): BioEntry => ({
  text: applyStyle(text, style),
  plain: text,
  lang,
  style,
});

const PART1: BioCollection[] = [
  {
    slug: 'instagram-bio-for-boys',
    name: 'Instagram Bio for Boys',
    icon: 'boys',
    description: 'Confidence-first bios for boys and men — attitude, hustle, dreams and discipline.',
    seoTitle: 'Instagram Bio for Boys — Ready-Made Mens Bios | BioCraft',
    seoDescription:
      'Original, emoji-rich Instagram bios for boys — confidence, hustle, discipline and dreams. Copy any bio in one tap, in English, Hindi and Hinglish. Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Boys',
    lede: 'A hundred ways to say “this is me” in 150 characters — pick one, tweak it, make it yours.',
    intro: [
      'A good boys bio does one job: it tells a stranger who you are before they decide to follow. The best ones skip the noise — no fake followers, no copied captions — and land on a mix of honesty, humor and ambition. This collection is built around that mix: bios about discipline and hustle, bios with a dry sense of humor, and bios that are simply calm and confident.',
      'Every line below is original BioCraft content. Some entries use stylish Unicode type for emphasis — those render as real text you can copy anywhere; they are not images. Tap Copy on any card to grab the exact text, emojis and line breaks included. Devanagari lines are written for Hindi-first readers and copy as-is.',
    ],
    preview: 'boys',
    bios: [
      en('🇮🇳 Living the Indian dream\n💼 Hustle now, shine later\n📸 Chasing light and stories\n✍️ 2 lines about everything\n⬇️ Latest chapter below'),
      en('Just another coder with big dreams 💻\nLearning in public, failing in public\nBuilding things I would want to use\n🕉️ Blessed and building'),
      en('Born to stand out\nNot to blend in\n⭐ King of my own world\n📅 Living every day like it is a chapter'),
      styled('King of My Own World', 'sans-bold'),
      styled('Hustle in silence, let success be loud', 'bold'),
      en('🌅 Morning walker, night thinker\n📚 Always learning\n🏍️ Bike rides > traffic\n🎯 Goals loaded'),
      en('Simple guy with compound ambitions\n• Earphone in, world out\n• Coffee first, chaos later\n• One day at a time'),
      en('Fueled by chai ☕ and deadlines\nWarning: sarcasm ahead\nCurrently: working on version 2.0 of myself'),
      en('Occasionally unstoppable\nGenerally optimistic\nAlways under construction 🚧'),
      en('From a small town, thinking big 🌾\nEngineer by training\nStoryteller by heart'),
      en('🔇 Not a morning person\n🔊 Very much a music person\n🎧 Currently on loop: everything I find'),
      hi('🇮🇳 मेरे सपनों की उड़ान\n💼 मेहनत जारी है, मंज़िल दूर नहीं\n📖 रोज़ एक नया सबक\n🚩 गर्व है इस मिट्टी पर'),
      hi('छोटे शहर से बड़े सपने\n💻 कोडिंग से दोस्ती\n☀️ सुबह की सैर, रात का सोच'),
      hi('सिर्फ़ एक इंसान, अपने हिसाब से\n🎯 लक्ष्य पक्का\n☕ चाय पहले, काम बाद में'),
      en('Discipline > motivation\nEvery single day 📅\n— builder of boring systems'),
      en('The grind is real\nSo is the rest day\nBalance, basically ⚖️'),
      en('Chasing the perfect sunset 🌇\nand decent Wi-Fi\n— both take patience'),
      en('✨ Professional overthinker\n🏍️ Weekend rider\n📷 Always the guy with the camera'),
      en('Name says nothing\nVibe says everything\n🔥 Approach with respect'),
      en('Growing slowly, growing surely 🌱\nEvery chapter teaches something\nCurrent page: keep going'),
      en('📍 Based in India\n🧭 Direction: forward\n💬 DMs open for good ideas'),
      styled('Less talk, more build', 'monospace'),
      en('🕶️ Shades on, stress off\n🎨 Designer of messy drafts\n🇮🇳 Proudly desi'),
      en('Somewhere between who I was\nand who I am becoming\n— enjoy the ride 🎢'),
      hg('Apni kahani khud likhte hain 😎'),
      hg('Discipline se hi duniya jeetni hai 💪'),
      hg('Simple sa hoon, matlab deep hoon 🌊'),
      hg('Small sapne nahi, bade goals 🎯'),
      hg('Hustle on repeat 🔁'),
      hg('Desi swag, royal attitude 👑'),
    ],
    faqs: [
      { q: 'What should a boys Instagram bio include?', a: 'Three things: who you are (one honest line), what you do or care about, and one human touch — humor, a hobby or a value. Skip copied captions and fake-stat counts; clarity beats clutter well inside the 150-character limit.' },
      { q: 'Can I use these bios on Facebook or Snapchat too?', a: 'Yes. Copy any card and paste it anywhere that accepts plain text — Instagram, Facebook, Snapchat, WhatsApp status or a YouTube About section. Line breaks and emojis survive the paste.' },
      { q: 'Will these stylish Unicode bios look the same everywhere?', a: 'Not guaranteed — styled Unicode alphabets depend on the viewer’s device fonts. They work in most modern phones for Latin letters; Devanagari has no styled Unicode alphabets, so Hindi lines copy as normal text.' },
      { q: 'How do I edit a bio after pasting it?', a: 'Tap Copy, paste into a notes app, and change a word or two so it sounds like you. A bio that mentions your real craft, city or hobby always outperforms a generic quote.' },
    ],
    related: ['stylish-instagram-bio', 'attitude-bio', 'cool-bio', 'vip-bio'],
  },

  {
    slug: 'instagram-bio-for-girls',
    name: 'Instagram Bio for Girls',
    icon: 'girls',
    description: 'Warm, witty and unapologetically original bios for girls and women.',
    seoTitle: 'Instagram Bio for Girls — Ready-Made Girls Bios | BioCraft',
    seoDescription:
      'Fresh Instagram bios for girls — confident, funny, soft, bold and desi. One-tap copy, in English, Hindi and Hinglish. Private, no sign-up.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Girls',
    lede: 'Bios with main-character energy — warm, sharp, soft or savage, exactly your vibe.',
    intro: [
      'A great girls bio is a small, honest mirror. Maybe you are the funny friend, the quiet designer, the dance-crew lead or the girl who replies three days later with excellent energy. The lines in this collection are written to hold all of that without performing for anyone — because a bio should sound like you at your most unguarded, not like a template.',
      'Every entry is original BioCraft writing, yours to copy and reuse. Use one as-is, stitch two together, or treat a line as a starting point. A few entries use Unicode display type for flair — they copy as real text. Hindi entries are written for natural bilingual bios, mixing Devanagari with everyday English the way people actually speak.',
    ],
    preview: 'girls',
    bios: [
      en('🌸 Main character, background chill\n📚 Books before boys\n☕ Coffee is a personality\n✨ Collecting moments, not things'),
      en('🌻 Soft heart, sharp mind\n🎨 Sketching life in color\n📍 Wherever the sunsets are\n💬 Usually here for a reel or a reason'),
      en('Dancing through deadlines 💃\nLaughing through chaos\nDressed for the life I am building'),
      styled('A Little Extra, Always', 'script'),
      styled('Powered by chai and chaos', 'bold-italic'),
      en('✨ Golden hour enthusiast\n🌼 Wildflower energy\n📸 Photos or it did not happen'),
      en('Certified overthinker, part-time poet\n🎭 Theatre kid at heart\n🕯️ Making ordinary days aesthetic'),
      en('🌷 Flowers, filter coffee and Sufi tracks\n🎧 Sunset playlists\n✍️ Quiet on the outside, novel on the inside'),
      en('Boss-lady loading… 💼\nFeeding stray cats, fighting for fair deadlines\n🌻 Sunflower soul'),
      en('Too glam to give a damn\nJust kidding — I care, selectively 😌'),
      hi('🌸 मैं अपनी कहानी ख़ुद लिखती हूँ\n☕ चाय और किताबों की दुनिया\n🎶 मेरे प्लेलिस्ट में सबकुछ'),
      hi('दिल्ली की धूप, मुंबई की बारिश\n🎨 रंगों से दोस्ती\n✨ कुछ ख़्वाब बाक़ी हैं'),
      hi('मुस्कुराहट फ्री की दवा 💊\n💃 डांस मेरे अंदर है\n🌟 अपनी शर्तों पर'),
      en('5’2” of chaos and chai\n🎭 Drama on stage, peace in life\n💅 Well-moisturized opinions'),
      en('🥀 Too soft for this world\n🔪 Too sharp to ignore\n— keep both'),
      en('Fluent in Sarcasm and Hindi\nSpeaking English since birth\n— probably fluent in both by osmosis'),
      en('📖 Currently reading: something unputdownable\n🎶 Currently looping: everything\n📍 Probably at a café planning the next thing'),
      en('Baking buns and breaking norms 🥐\nEqual parts rebel and homemaker\n— depends on the day'),
      en('🌙 Midnight thoughts, morning chai\n🖊️ Ink on my fingers\n💫 Dreaming in Devanagari'),
      en('Professional sunset chaser 🌇\nAmateur human\nAlways a work in progress'),
      en('🪷 Peaceful on bad days\n🔥 Fierce on worse ones\n💛 Loyal always'),
      styled('Soft, Savage & Stylish', 'bold-script'),
      en('Birthday: whenever cake appears 🎂\nHobbies: everything, half-seriously\nStatus: unbothered and thriving'),
      en('In a situationship with my camera roll 📷\nIn a committed relationship with my playlists 🎧'),
      hg('Girl with dreams and a plan ✨'),
      hg('Cute hoon, drama bhi hoon 🌸'),
      hg('Soft heart, strong mind 💪'),
      hg('My vibe is my brand 🎀'),
      hg('Thodi si queen, thodi si crazy 👑'),
      hg('Dream big, sparkle bigger ✨'),
    ],
    faqs: [
      { q: 'How do I write a unique Instagram bio for girls?', a: 'Start with one true sentence (your craft, city or mood), add a second line with personality — humor, music, books, food — and a third with light humor. Specificity beats generality; “sunset chaser with a chai habit” beats “living my best life”.' },
      { q: 'Can I copy a bio exactly as shown?', a: 'Yes — tap Copy and the emojis, line breaks and spacing are preserved. Unicode-styled entries copy as styled Unicode characters, exactly as displayed.' },
      { q: 'Do styled Unicode fonts work on all phones?', a: 'Mostly, but not universally — they depend on the viewer’s font support for Latin letters. If a friend sees boxes, share the plain-text version from the same card instead.' },
      { q: 'Should my bio match my username?', a: 'Not required, but coherence helps: if your handle is artsy, lean visual; if it is funny, lean witty. Your bio and highlights should tell one story in three seconds.' },
    ],
    related: ['stylish-instagram-bio', 'love-bio', 'royal-bio', 'sad-bio'],
  },

  {
    slug: 'stylish-instagram-bio',
    name: 'Stylish Instagram Bio',
    icon: 'spark',
    description: 'Typographic flair — Unicode styled lines, minimal words, maximum presence.',
    seoTitle: 'Stylish Instagram Bio — Fancy Unicode Bios | BioCraft',
    seoDescription:
      'Stylish Instagram bios with elegant Unicode type — bold, script, mono and fullwidth lines. One-tap copy, English and Hinglish, Private.',
    updated: 'November 2026',
    languages: 'English + Hinglish',
    audience: 'Everyone',
    lede: 'When the font does the talking — styled Unicode lines, zero fluff.',
    intro: [
      'Sometimes you do not need twenty words — you need four perfect ones in the right typeface. This collection pairs expressive Unicode alphabets with tight, confident copy. Every styled entry below is generated with the same rule-based engine as BioCraft’s Fancy Font tool, so the characters are genuine Unicode text — selectable, searchable and copyable, never images.',
      'A note on honesty: Unicode styled alphabets exist only for Latin letters and digits. Hindi cannot be “bolded” this way, and styled Latin can degrade to boxes on very old devices. When in doubt, share the plain version — every card here copies cleanly either way.',
    ],
    bios: [
      styled('Living the Dream', 'script'),
      styled('Unapologetically Me', 'bold-script'),
      styled('Quiet · Loud · Unbothered', 'monospace'),
      styled('Less Perfection More Authenticity', 'italic'),
      styled('MAIN CHARACTER ENERGY', 'sans-bold'),
      styled('Chasing light, living right', 'bold'),
      styled('Dream in Devanagari, Ship in English', 'sans-italic'),
      styled('Current Mood: Magnificent', 'double-struck'),
      styled('Not Everyone Gets Me', 'fraktur'),
      en('✨ 𝐋𝐢𝐯𝐢𝐧𝐠 𝐰𝐢𝐭𝐡 𝐟𝐥𝐚𝐢𝐫\n🌙 𝐖𝐢𝐭𝐡 𝐚 𝐩𝐮𝐫𝐩𝐨𝐬𝐞\n🎧 𝐖𝐢𝐭𝐡 𝐚 𝐬𝐚𝐮𝐧𝐝𝐭𝐫𝐚𝐜𝐤'),
      en('✦ 𝓢𝓲𝓶𝓹𝓵𝓮 𝓷𝓸𝓾𝓷, 𝓭𝓪𝓻𝓲𝓷𝓰 𝓿𝓮𝓻𝓫\n✦ 𝓒𝓵𝓾𝓮𝓯𝓾𝓵 𝓪𝓷𝓭 𝓬𝓪𝓵𝓶\n✦ 𝓐 𝓯𝓾𝓵𝓵 𝓼𝓽𝓸𝓻𝔂, 𝓯𝓸𝓾𝓻 𝓵𝓲𝓷𝓮𝓼'),
      en('〔 𝚂𝚝𝚢𝚕𝚎 𝚒𝚜 𝚊 𝚕𝚊𝚗𝚐𝚞𝚊𝚐𝚎 〕\n𝚂𝚙𝚛𝚎𝚊𝚔𝚒𝚗𝚐 𝚒𝚝 𝚏𝚕𝚞𝚎𝚗𝚝𝚕𝚢'),
      en('✧ 𝘚𝘰𝘧𝘵 𝘭𝘪𝘨𝘩𝘵, 𝘴𝘵𝘢𝘳𝘬 𝘴𝘪𝘭𝘩𝘰𝘶𝘦𝘵𝘵𝘦𝘴\n✧ 𝘚𝘺𝘭𝘭𝘰𝘺𝘶𝘦𝘵𝘵𝘦 𝘰𝘧 𝘢 𝘴𝘰𝘯𝘨'),
      en('◆ 𝔇𝔢𝔱𝔢𝔯𝔪𝔦𝔫𝔢𝔡. 𝔒𝔱𝔬𝔫𝔦𝔪𝔦𝔰𝔱𝔦𝔠. 𝔇𝔞𝔯𝔩𝔦𝔫𝔤.\n◆ 𝔚𝔬𝔢𝔯𝔨𝔦𝔫𝔤 𝔭𝔯𝔢𝔤𝔯𝔢𝔰𝔰'),
      en('〔 𝕋𝕙𝕖 𝕓𝕖𝕤𝕥 𝕥𝕙𝕖𝕞𝕖𝕤 𝕒𝕣𝕖 𝕨𝕠𝕣𝕟 𝕟𝕖𝕨 〕'),
      en('✧ ᴘʟᴀɴ ɪɴ sɪʟᴇɴᴄᴇ, ʙʟᴏᴏᴍ ɪɴ ᴘᴜʙʟɪᴄ\n✧ ɴᴏ ᴡᴇɴᴅᴇʀ, ᴊᴜsᴛ ᴡᴏɴᴅᴇʀ'),
      en('✦ Maximalist heart, minimalist feed\n✦ Everything in its golden hour'),
      en('∥ 𝚂𝚌𝚛𝚒𝚙𝚝 𝚊𝚗𝚍 𝚜𝚒𝚕𝚎𝚗𝚌𝚎 ∥\n𝚂𝚙𝚎𝚊𝚔𝚒𝚗𝚐 𝚜𝚝𝚢𝚕𝚎𝚜 𝚘𝚗𝚕𝚢'),
      en('〔 ＢＯＬＤ ＭＯＶＥＳ ＯＮＬＹ 〕\nquiet execution, loud results'),
      styled('Elegance is an attitude', 'small-caps'),
      styled('CREATED NOT COPIED', 'negative-squared'),
      styled('𝐀𝐞𝐬𝐭𝐡𝐞𝐭𝐢𝐜 𝐨𝐧𝐥𝐲', 'bold'),
      en('✧ 𝕱𝖆𝖓𝖈𝖞 𝖋𝖔𝖓𝖙, 𝖘𝖎𝖒𝖕𝖑𝖊 𝖑𝖎𝖋𝖊\n✧ 𝕴𝖉𝖊𝖆𝖑 𝖌𝖆𝖓𝖊𝖘'),
      styled('Class with a capital C', 'circled'),
      hg('Style is my signature ✨'),
      hg('Fancy vibes only 💫'),
      hg('Swag mera trademark 🕶️'),
      hg('Standing out is my hobby 🎨'),
      hg('Classy with a twist ✨'),
      hg('Swag se life jeeta hoon 🕶️'),
    ],
    faqs: [
      { q: 'Will Unicode stylish text break on some phones?', a: 'On very old systems styled Latin characters can show as empty boxes. iOS and Android from the last decade render the ranges used here correctly, but test on a spare device if your audience is older.' },
      { q: 'Can I search or hashtag styled text?', a: 'Styled Unicode code points are different characters from plain letters, so in-app search treats them separately. For discoverability, keep your name and handle in plain text and use styled lines only in the bio body.' },
      { q: 'Is styled text accessible to screen readers?', a: 'Not reliably — most screen readers announce mathematical alphanumeric symbols one character at a time or skip them. If accessibility matters to your audience, prefer plain text with good wording.' },
      { q: 'How are these different from image fonts?', a: 'They are real characters, not pictures. You can select, copy, paste and edit them anywhere — including this page’s Copy button, which preserves them exactly.' },
    ],
    related: ['instagram-bio-for-boys', 'instagram-bio-for-girls', 'vip-bio', 'english-bio'],
  },

  {
    slug: 'attitude-bio',
    name: 'Attitude Bio',
    icon: 'zap',
    description: 'Sharp, confident, unbothered — attitude with substance, never cruelty.',
    seoTitle: 'Attitude Bio — Confident Instagram Attitude Bios | BioCraft',
    seoDescription:
      'Attitude-packed bios: bold, confident and witty without being mean. Copy-ready for Instagram and more, one tap, Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Confidence in 150 characters — sharp, self-respecting and never cruel.',
    intro: [
      'Attitude bios get a bad reputation because the worst ones confuse noise with presence. Real attitude is quiet certainty: you know your worth, you mind your business, and your captions carry both humor and spine. The lines here are written in that spirit — bold, clever and self-respecting, with zero punch-downs, slurs or fake toughness.',
      'Copy any line as-is, or blend one attitude line with one real detail from your life. That combination is what stops a profile from feeling like a copied quote page and makes it unmistakably yours.',
    ],
    bios: [
      en('👑 Attitude is the minimum price\n💼 Mindset is the real portfolio\n🔇 I whisper, results shout'),
      en('Born to stand out, not to fit in\n🔥 Fire walks with me\n🧠 Brain does the heavy lifting'),
      en('Not here for applause\nHere for the process\n— and the occasional mic drop 🎤'),
      en('My respect is earned\nMy standards are non-negotiable\nEverything else is negotiable'),
      en('Low tolerance, high standards 😤\nSelective hearing, legendary memory'),
      styled('Do Not Disturb My Peace', 'sans-bold'),
      styled('Too Rare For Ordinary', 'bold'),
      en('😎 Silence is my loudest answer\n📊 Results are my favorite argument'),
      en('I don’t chase, I attract\n— and I walk away first anyway'),
      en('Queen energy in economy class\n— still lands first 👑'),
      en('Built different, working different\n💤 Sleep when the graph turns green'),
      hi('👑 मेरी कीमत मेहनत से तय होती है\n🔥 जो जलता है वही चमकता है\n😌 अपनी शांति पहले'),
      hi('मुझसे टकराना मना है — और ज़रूरी भी नहीं\n😤 मेरा स्तर ऊँचा है\n🎯 लक्ष्य साफ़ है'),
      hi('सादगी अपना अंदाज़\nआत्मविश्वास मेरी पहचान'),
      en('5\'0\' of presence, 6\'2\' of attitude\n— measurement is optional'),
      en('Flirting with failure, married to discipline\n— no in-laws either'),
      en('📌 Don’t compare my chapter 1\nwith your chapter 20\n— you started earlier, I started louder'),
      en('Certified unbothered 😌\nLicensed to overthink 🧠\nBoth valid'),
      en('Hard work in private\nSoft launch of the personality\n— big reveal soon'),
      en('☕ My standards are brewed strong\n🍰 My vibe is sliceable\n🙂 My patience is… conditional'),
      en('Single. Focused. Dangerously capable.\n— that’s the whole vibe'),
      styled('Silent · Deadly · Stylish', 'monospace'),
      en('🚩 Red flag: extremely self-respecting\n🟢 Green flag: exactly that'),
      hg('Attitude apna, rules apne 🖤'),
      hg('Main nahi badalta, crowd adjust karta hai 😶'),
      hg('Silent mode mein royal feel 🤫'),
      hg('Unbothered and unbroken 🖤'),
      hg('Attitude free nahi milta 😎'),
      hg('Na reason do, na excuse 😤'),
    ],
    faqs: [
      { q: 'What makes a good attitude bio (and a bad one)?', a: 'Good: confident humor, self-respect, a specific flex. Bad: insults aimed at groups, slurs, threats or copied “दबंग” captions. This collection keeps the edge and drops the punch-downs.' },
      { q: 'Are attitude bios okay for girls too?', a: 'Absolutely — attitude is not gendered. Shortlist lines with queen/boss energy blended with one personal detail; they read confident, not aggressive.' },
      { q: 'Can I mix attitude with Hindi?', a: 'Yes — the Devanagari lines here are written for bilingual mixing. “हुनर दिखाओ, शोर नहीं” pairs naturally with an English handle or English CTA line.' },
      { q: 'How long should an attitude bio be?', a: 'Two to four short lines. The attitude does the work; extra sentences dilute it. Paste into the Notes app first to see how it folds on a 360px screen.' },
    ],
    related: ['vip-bio', 'cool-bio', 'instagram-bio-for-boys', 'instagram-bio-for-girls'],
  },

  {
    slug: 'vip-bio',
    name: 'VIP Bio',
    icon: 'gem',
    description: 'Premium, polished lines with quiet luxury — status with substance.',
    seoTitle: 'VIP Bio — Premium Instagram VIP Bios | BioCraft',
    seoDescription:
      'VIP-style bios: polished, premium and understated. Elegant Unicode and classy copy-ready lines, English and Hinglish. Private, one-tap copy.',
    updated: 'November 2026',
    languages: 'English + Hinglish',
    audience: 'Everyone',
    lede: 'Quiet luxury, loud results — VIP energy without the neon.',
    intro: [
      'VIP bios work when they whisper. Forced “billionaire” energy and fake Lamborghinis fool nobody; understated confidence and impeccable taste are the real signals. This collection is built on restraint: short declarative lines, elegant Unicode type, and vocabulary of craft, discipline and discernment.',
      'Use these lines to anchor a premium personal brand — founders, consultants, artists and collectors all benefit from a bio that sounds curated rather than crowded. One styled line plus one concrete proof (your craft, your city, your medium) outperforms ten adjectives every time.',
    ],
    bios: [
      en('💎 Rare find, fairly valued\n🏛️ Built slowly, built well\n🔇 Luxury is privacy'),
      styled('First Class Mindset', 'bold-script'),
      styled('Refined · Rare · Reserved', 'double-struck'),
      en('🎩 Impeccable taste, modest means\n— working on the second part'),
      en('Curating excellence since day one\n🍷 Wine optional, standards mandatory'),
      en('✨ Not rich in shout\nRich in discipline\nValuable in silence'),
      en('👑 A room of one’s own, a table of one’s own\n— reserved seating only'),
      en('💼 Boardroom by day\n🎞 Gallery by night\n— same attention to detail'),
      en('🕯️ Details most people skip\n🔍 Craft most people cannot copy'),
      styled('The Quiet Luxury', 'script'),
      en('🪙 Old money patience, new world hustle\n— inheriting nothing but standards'),
      en('🗝️ Access is earned\n🗝️ Excellence is practiced\n🗝️ Silence is golden'),
      en('🥂 Cheers to the few, not the many\n— quality over quantity in people too'),
      en('📓 Principles over parking\n📈 Compound everything\n🤝 Handshake deals, handshake quality'),
      en('🏛️ Private collection, public passion\n— art over algorithms'),
      en('🎩 Dressed for the boardroom\nwalked out of the ordinary'),
      styled('Exclusive By Nature', 'bold'),
      en('✦ Member of the effort-above-average club\n✦ Dues paid in full, daily'),
      en('🍷 Appreciates fine things\n🌾 Built on boring basics\n⚖️ Both matter'),
      en('🚪 Members only — invite is earned with work\n— see you at the top, quietly'),
      hg('VIP treatment, always 💎'),
      hg('Limited edition hoon main 💎'),
      hg('Eligible bachelor/bachelorette energy 😎'),
      hg('Rich in attitude, loaded with dreams 💎'),
      hg('Elite company only ✨'),
      hg('VVIP vibes — no entry without class 🥂'),
    ],
    faqs: [
      { q: 'Do VIP bios require luxury lifestyle content?', a: 'No — they require taste. A designer who posts their process with a VIP-style line reads more premium than random Lamborghinis. Match the line to genuine details: your medium, city, craft or code.' },
      { q: 'Will Unicode double-struck type render everywhere?', a: 'Double-struck Latin (like the “rare” styling) renders on modern iOS, Android and desktop browsers. Very old devices may fall back to boxes — test your audience if in doubt.' },
      { q: 'How do I keep a VIP bio from sounding arrogant?', a: 'Anchor status in work: “founder shipping weekly”, “collector of first editions”. Earned specificity reads premium; adjectives alone read loud.' },
      { q: 'Can I use these for LinkedIn too?', a: 'The copy works, but LinkedIn’s tone rewards restraint — pick the plainest style variant or set the line as-is in sentence case and it reads executive, not flashy.' },
    ],
    related: ['royal-bio', 'attitude-bio', 'stylish-instagram-bio', 'english-bio'],
  },

  {
    slug: 'love-bio',
    name: 'Love Bio',
    icon: 'heart',
    description: 'Tender lines for couples, hearts and the hopelessly romantic.',
    seoTitle: 'Love Bio — Romantic Instagram Love Bios | BioCraft',
    seoDescription:
      'Sweet, romantic and anniversary-ready love bios — English, Hindi and Hinglish, emoji-rich, one-tap copy. Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'From first-text butterflies to fiftieth anniversaries — tender, original lines.',
    intro: [
      'Love bios are small vows you write in public. The best ones are specific to one person or one feeling — the way they laugh at the ending of every joke, the chai they make too sweet, the song that is “theirs”. Generic love captions fade fast; a precise line is what gets screenshotted and saved.',
      'Use these for couple profiles, photographer-of-love pages, anniversary posts or a quiet tribute in your own bio. Hindi lines are written for bilingual romance — the way “तुम्हारी हँसी” sits naturally beside an English handle.',
    ],
    bios: [
      en('❤️ My favorite place is next to you\n🌙 Every love story is beautiful\n— ours is my favorite'),
      en('👩‍❤️‍👨 Him + me = the whole plot twist\n🍿 Lifetime subscription to each other'),
      en('In love and unbothered about it\n💫 Some stories write themselves\n— ours does, daily'),
      en('She is my sunshine on clumsy days\nHe is my rain check that never expires 🌧️'),
      en('Home is a person, not a place\n🏡 And I live there 🏡'),
      en('✈️ Miles apart, still the same team\n💌 Waiting for the next reunion like it is a holiday'),
      styled('My Person My Home My Everything', 'script'),
      styled('Soulmates Since Always', 'bold-script'),
      hi('❤️ तुम्हारी हँसी मेरी प्लेलिस्ट\n🌙 तुम्हारी परछाई मेरा घर\n✨ तुम और मैं — बस यही काफी है'),
      hi('मेरी हर कहानी में तुम हो\n💞 तुम्हारी यादों का खाता खाली नहीं होता\n🌸 प्यार सिर्फ़ एक एहसास नहीं, मेरी आदत है'),
      hi('तेरे बिना अधूरी हूँ\nतेरे साथ पूरी 🌙✨'),
      en('5 years down, every chapter better\n💍 Still choosing each other on bad Mondays'),
      en('Bookmarked the good days\nHighlighted the hard ones\n— both made us us 📖'),
      en('Partner in crime since 2021\nCo-conspirators in chai, chaos and cinema 🎬'),
      en('Love looks like Sunday mornings with you\nand the exact same tired silence at 2am 🛏️'),
      en('I love you in lowercase, in caps and in cursive\n— always legible 💌'),
      en('Counting heartbeats, not days\n💕 34,000 days to go and counting'),
      en('🌍 Traveled X countries, found one home\n— it has your laugh in it'),
      en('Anniversary gift: this bio\n— priceless, hand-written 💝'),
      en('She stole my fries and my heart\n— I filed no complaints 🍟'),
      hg('Pyaar mein poora pagal hoon 💗'),
      hg('Dil diya hai, wapas nahi lunga 💘'),
      hg('Ishq mein dil deep se dooba 🌊'),
      hg('You are my sunshine, baby ☀️'),
      hg('Tum ho toh sab kuch achha lagta hai 💕'),
      hg('Dil se dil ka sauda 💞'),
    ],
    faqs: [
      { q: 'What should a couple bio include?', a: 'One shared detail only the two of you know, one date or milestone if you like marking time, and one line about the feeling. Specificity is the whole trick.' },
      { q: 'Is it okay to use a love bio on a personal (non-couple) profile?', a: 'Yes — many people use these for a partner mention, a tribute account, or even a self-love pledge. “My favorite place is my own peace” works too.' },
      { q: 'How do I make a love bio in Hindi + English?', a: 'Write the emotional core in Devanagari and the framing in English — “तुम्हारी हँसी, daily playlist ❤️”. It is natural for bilingual audiences and renders perfectly.' },
      { q: 'Can I use these lines in anniversary cards or captions too?', a: 'Absolutely — the lines work as captions, comments, status updates, WhatsApp abouts and even embroidery text. They are plain text; context is yours to choose.' },
    ],
    related: ['royal-bio', 'sad-bio', 'stylish-instagram-bio', 'instagram-bio-for-girls'],
  },

  {
    slug: 'sad-bio',
    name: 'Sad Bio',
    icon: 'sad',
    description: 'Honest, melancholic lines — depth without damage, healing without cliché.',
    seoTitle: 'Sad Bio — Emotional Sad Instagram Bios | BioCraft',
    seoDescription:
      'Poetic, emotional sad bios about healing, heartbreak and growing quietly. One-tap copy, EN · Hindi · Hinglish. Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'For the chapters written in grey — depth, honesty and slow healing.',
    intro: [
      'Sad bios are not cries for attention; they are small lighthouses for people standing in the same storm. The lines in this collection speak to heartbreak, loneliness, quiet grief and the long art of healing — without glorifying self-destruction or romanticizing pain as an identity.',
      'If you are going through a genuinely difficult time, please also talk to someone you trust or a mental-health professional — a bio line is a flag, not a treatment. BioCraft is a toolkit, not a therapist, and we would never pretend otherwise.',
    ],
    bios: [
      en('🌧️ Learning to smile without forcing it\n🌙 Healing in silence\n📖 Each page more honest'),
      en('Some wounds are invisible\n— they still count, they still heal 🩹'),
      en('I was drowning, now I’m learning to swim\n— slowly, noisily, honestly 🏊'),
      en('Missing who I was before I lost myself\n— but grateful for who I’m becoming'),
      en('Sadness is a season, not an address\n🍂 Visiting often, not moving in'),
      styled('Alone But Not Broken', 'italic'),
      styled('Surviving Software Updates And Heartbreak', 'monospace'),
      hi('🌧️ ग़म इतना नहीं कि टूट जाएँ\nइतनी ताक़त है कि मुस्कुरा सकें\n✨ धीरे-धीरे सही, पर ठीक हो जाएँगे'),
      hi('अकेला हूँ, पर टूटा नहीं\n🩹 हर घाव एक सबक\n🌙 अंधेरी रात ढलती है'),
      hi('खामोशी मेरी सबसे अच्छी दोस्त\nदिल में तूफ़ान, चेहरे पर सुकून'),
      en('🥀 I watered the wrong things for too long\n🌱 Now I finally know which garden is mine'),
      en('Healing looks like 2 steps forward, 1 cry backward\n— progress counts double on quiet days'),
      en('Every scar is a map\n— I just stopped apologizing for the terrain 🗺️'),
      en('🎧 Listening to sad songs that understand me\n📵 Muting the noise that doesn’t'),
      en('I lost myself in their eyes\nI found myself in the mirror\n— the second story is better 🪞'),
      en('Not broken, just buffering\n⏳ The stream resumes soon'),
      en('💧 Crying is still breathing\n🌊 Let the tide come, let it go'),
      en('Writing the last page of a sad chapter\n— keeping the lessons, burning the draft'),
      en('The art of letting go, currently in progress…\n🖌️ Brushstrokes of acceptance'),
      en('Status: emotionally on airplane mode\n✈️ But the landing is scheduled 🛬'),
      hg('Ek alag tarah ka adhoora hoon 🌧️'),
      hg('Smile mein dard chhupa le 😔'),
      hg('Khamoshi bhi bolti hai 🥀'),
      hg('Andhere mein bhi roshni dhoon 🕯️'),
      hg('Deep feelings, quiet heart 🖤'),
      hg('Sadness bhi ek teacher hai 🌧️'),
    ],
    faqs: [
      { q: 'Is it healthy to post a sad bio?', a: 'Naming feelings publicly can reduce isolation, but if you feel at risk, talk to a trusted person or a helpline in your country right away. A bio is a signpost — professional support is the road itself.' },
      { q: 'Will a sad bio affect my profile’s reach?', a: 'Reach is driven by watch-time, shares and relevance, not bio mood. Emotional honesty often earns deeper connection; performative bleakness gets scrolled past. Be honest, not theatrical.' },
      { q: 'Can I use these lines as captions?', a: 'Yes — every line here works as a caption or comment. Pair with a photo that matches the feeling; mismatch reads as inauthentic.' },
      { q: 'Do you have uplifting alternatives?', a: 'Yes — see the Simple Bio and Cool Bio collections for calmer, brighter lines, and Shree Ram Bio for devotional serenity. Healing lines age well; despair lines date fast.' },
    ],
    related: ['love-bio', 'royal-bio', 'simple-bio', 'shree-ram-bio'],
  },

  {
    slug: 'royal-bio',
    name: 'Royal Bio',
    icon: 'crown',
    description: 'Regal, dignified lines for kings, queens and everyone with royal posture.',
    seoTitle: 'Royal Bio — Kings & Queens Instagram Bios | BioCraft',
    seoDescription:
      'Royal-style bios for him and her — regal, classy and confident. Copy-ready in one tap, EN · Hindi · Hinglish. Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Posture of royalty, schedule of a worker — crowns optional, standards not.',
    intro: [
      'Royal bios are about bearing, not birthright. A royal line says: I carry myself like heirloom, I choose my circle, and I find disrespect unfashionable. These lines work for couples, personal brands and anyone who wants dignity in their caption — no crown emoji required (though it is encouraged).',
      'Pair a regal line with one grounded detail — your craft, your chai, your commute. The contrast between “majesty” and “mostly I reply to texts late” is exactly what makes these endearing instead of pompous.',
    ],
    bios: [
      en('👑 Crowned by my own standards\n🏛️ This household runs on discipline\n✨ Royalty doesn’t hurry'),
      en('King of my own schedule\nQueen of my own calendar\n— both empires run on chai'),
      en('🏰 Royalty in the way I walk\n💼 Work ethic in how I build\n🍷 Class in how I leave rooms'),
      styled('The Royal Treatment', 'bold-script'),
      styled('Grace Under Pressure', 'script'),
      en('⚜️ Old-world manners, new-world hustle\n— the perfect pairing'),
      en('🦁 Kings don’t explain lions\n— results speak the dialect'),
      en('👸 A queen is just a girl who refused to settle\n— crowns are optional, boundaries aren’t'),
      hi('👑 शाही अंदाज़, मेहनती दिल\n🏛️ जो मान करते हैं वही आगे बढ़ते हैं\n✨ शराफ़त मेरा मुकुट है'),
      hi('राजा बनो अपने काम के\nरानी बनो अपने फ़ैसलों की\n— ताज पहले से पहना है, बस नहीं दिखता'),
      en('🗡️ Elegance with edges\n🍷 Polite with purpose\n🕶️ Regal and reachable'),
      en('📜 Written like history\n👑 Lived like royalty\n🌾 Rooted like soil'),
      en('The throne is a mindset\n— everyone can sit, standards decide who does'),
      en('🥂 Cheers to the royal bloodline of hard work\n— inheritance by discipline'),
      en('🏰 Palace in the process, not the postcode\n— my standards live in the permanent address'),
      en('👑 Monarch of mostly calm days\n— revolution happens quietly'),
      en('🎖️ Decorated by effort, not pedigree\n— the medal is the memory of the work'),
      styled('Elegance Is Not A Luxury', 'small-caps'),
      en('🏹 Raised with values, ruled by respect\n— long live the household'),
      en('✨ Royalty checks the small print\n👑 and the bank balance of character'),
      hg('Shahi swag, desi dil ✨'),
      hg('Rule karne ka janm hua 👑'),
      hg('Classy like royalty, humble like nature 🌿'),
      hg('Crown needs no permission 👑'),
      hg('Royalty in every vein ⚜️'),
      hg('King/Queen vibes always 👑'),
    ],
    faqs: [
      { q: 'Are royal bios for boys or girls?', a: 'Both — each gender has its register here (king lines and queen lines), and the unisex lines work for anyone. Couples often pick matching king/queen bios.' },
      { q: 'Will royal bios feel fake if I’m ordinary?', a: 'They read as playful confidence when posted with ordinary selfies — that contrast is charming. The mistake is pairing them with borrowed-luxury props; authenticity is the real crown.' },
      { q: 'Can I combine royal and attitude?', a: 'Yes — “Regal and reachable” or “Grace under pressure” blend both. Keep one royal image max per card so the mix stays tasteful.' },
      { q: 'Do Hindi royal bios work for Instagram?', a: 'Yes — Devanagari renders perfectly in Instagram bios. “शाही अंदाज़, मेहनती दिल” is exactly the bilingual register that works in India.' },
    ],
    related: ['vip-bio', 'attitude-bio', 'love-bio', 'instagram-bio-for-girls'],
  },

  {
    slug: 'simple-bio',
    name: 'Simple Bio',
    icon: 'leaf',
    description: 'Short, honest one-liners for people who like it clean.',
    seoTitle: 'Simple Bio — Short Simple Instagram Bios | BioCraft',
    seoDescription:
      'Minimal, short and honest Instagram bios — one or two lines, zero clutter. One-tap copy, Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Less is the whole aesthetic — two clean lines beat ten loud ones.',
    intro: [
      'Simple bios are not lazy — they are confident subtraction. One clear line about who you are, one small truth about your rhythm. That is enough for the reader to remember you, and it keeps your profile breathing on 360-pixel screens, which is where most of Instagram actually happens.',
      'Every line here is deliberately under ~60 characters so it never wraps awkwardly. Tap Copy, paste, and go — no editing required unless you want to add your own detail.',
    ],
    bios: [
      en('Just here, living simply 🌿'),
      en('Less drama, more clarity.'),
      en('Learning out loud 📚'),
      en('Work hard. Be kind. Repeat.'),
      en('Quietly becoming 🤍'),
      en('Chai, chaos, creativity ☕'),
      en('Doing my best, daily.'),
      en('Still figuring it out 🌱'),
      en('Honest work, honest words.'),
      en('Here for the good mood 🙂'),
      hi('सादगी मेरी शान 🌿'),
      hi('मेहनत जारी है 💫'),
      hi('खामोशी में खूबसूरती 🌙'),
      hi('चाय, किताबें, शांति ☕📖'),
      hi('अपनी रफ़्तार, अपने ढंग 🚶‍♀️'),
      en('Small steps, every day 👣'),
      en('Here for the plot 🎬'),
      en('Making today lighter 🌤️'),
      styled('Simple · Honest · Enough', 'monospace'),
      en('Growing at my own pace 🌱'),
      hg('Simple sa hoon, honest hoon 🌿'),
      hg('Kam bolta hoon, kaam zyada karta hoon 🤫'),
      hg('Grey sky, quiet mind ☁️'),
      hg('Simple life, big dreams 🌙'),
      hg('Minimal effort, maximum peace 🧘'),
      hg('Bas jeeta hoon, enjoy karta hoon 🙂'),
    ],
    faqs: [
      { q: 'Why are short bios effective?', a: 'They survive every screen size, read instantly while scrolling, and leave room for one detail only you would know. Complexity rarely fits in 150 characters anyway.' },
      { q: 'Can a one-line bio rank in search?', a: 'Your name and handle do the discoverability work; the bio supports the human click. Pair a simple bio with a keyword in your name field for the best balance.' },
      { q: 'How do I make a simple bio in Hindi?', a: 'Use a two-beat structure: noun + feeling, like “सादगी, शांति, संतुलन”. Short Devanagari lines render cleanly and feel personal to Hindi-first followers.' },
      { q: 'Is a simple bio boring for a creator?', a: 'Often the opposite — creators who post densely benefit from one clean line; it signals calm authority. If your content is loud, let the bio be the quiet frame.' },
    ],
    related: ['english-bio', 'cool-bio', 'student-bio', 'hindi-bio'],
  },

  {
    slug: 'cool-bio',
    name: 'Cool Bio',
    icon: 'cool',
    description: 'Relaxed, witty, effortlessly cool — zero try-hard energy.',
    seoTitle: 'Cool Bio — Cool & Funny Instagram Bios | BioCraft',
    seoDescription:
      'Cool, funny and effortless bios for Instagram and beyond — witty one-liners and chill lines. One-tap copy, Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Effortlessly chill — humor you don’t have to announce.',
    intro: [
      'Cool is not costume — it is temperature. Cool bios lower the noise: one dry joke, one honest hobby, one shrug at the right moment. The reader should smile, not squint. Everything below passes the “would a friend roll their eyes at this?” test.',
      'Mix a cool line with a utility detail if you are a creator (“I make reels about chai”) — contrast between chill copy and serious craft is the most attractive kind of cool.',
    ],
    bios: [
      en('😎 Too cool for Mondays\n☕ Chai > everything'),
      en('Professional procrastinator, amateur perfectionist'),
      en('🎶 Playing it by ear and by playlist'),
      en('🛏️ Sleeping is my cardio'),
      en('Certified sunset connoisseur 🌇'),
      en('🍕 99% harmless, 1% chaotic good'),
      en('🔥 Living proof that chai can power a human'),
      en('🥔 Here for the memes, staying for the people'),
      en('🚲 Cycling, camera, chai — in that order'),
      hi('😎 कूल हूँ, पर शरारत कम\n☕ कॉफ़ी से ज़्यादा चाय\n🎵 और हाँ, म्यूज़िक अनिवार्य'),
      hi('आलस का लेवल: मास्टर 😴\nशरारत का स्तर: प्रोफेशनल\nरेस्पॉन्स टाइम: 2–3 दिन'),
      en('🎲 Fluent in nap, fluent in chai, learning fluent in adulting'),
      en('🧢 Cap low, standards high'),
      en('🛹 Breaking rules and chai cups, tastefully'),
      en('🫥 Low battery, high aura'),
      en('🧃 Juice diet: 70% chai, 30% chaos'),
      en('🎧 Headphones on = do not disturb my universe'),
      styled('Cool Calm Collected', 'sans'),
      en('🚶‍♂️ Walking away from drama since forever'),
      hg('Cool vibes only 🕶️'),
      hg('Chilled like a frozen mojito 🧊'),
      hg('No tension, only swag 😎'),
      hg('Laid-back king 👑'),
      hg('Mood chill, goals set ✌️'),
      hg('Easy going, hard winning 🏁'),
    ],
    faqs: [
      { q: 'How do I write a funny bio without being annoying?', a: 'One joke maximum, aimed at yourself or the universe — never at a group. “Professional procrastinator” lands; mocking identities or professions does not.' },
      { q: 'Can cool bios help engagement?', a: 'They lower the barrier to a comment or DM (“haha true”), which starts conversations. Engagement comes from conversation, and humor is a doorway — but relevance still matters most.' },
      { q: 'Which emojis keep a bio cool vs cringe?', a: 'Food, weather, music and objects work; skull and fire in moderation. Avoid spamming 🔥 or 💯 repeatedly — one well-placed emoji beats six.' },
      { q: 'Should Hindi-speaking creators use English cool bios?', a: 'Either works — bilingual bios like “आलस मास्टर, chai lover” often perform best in India because they match how people actually speak.' },
    ],
    related: ['attitude-bio', 'simple-bio', 'instagram-bio-for-boys', 'instagram-bio-for-girls'],
  },

  {
    slug: 'hindi-bio',
    name: 'Hindi Bio',
    icon: 'globe',
    description: 'Original Devanagari bios — shayari-tinged lines and everyday wit in Hindi.',
    seoTitle: 'Hindi Bio — Best Instagram Bios in Hindi | BioCraft',
    seoDescription:
      'Original Instagram bios in Hindi (Devanagari) and Hinglish — emotional, funny and reflective. One-tap copy with correct rendering. Private.',
    updated: 'November 2026',
    languages: 'Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'दिल की बात, देवनागरी में — असली हिन्दी बायोज़।',
    intro: [
      'हिंदी बायो वे भरोसे के लफ़्ज़ हैं — एक ऐसी भाषा में लिखे जो आपके फ़ॉलोअर्स सच में सोचते-समझते हैं। इस कलेक्शन में शायराने अंदाज़, रोज़मर्रा की मसल्स और हल्की-फुल्की शरारत — सब कुछ मौलिक लिखा गया है, कॉपी-पेस्ट नहीं।',
      'ध्यान रखें: Unicode के “स्टाइलिश फ़ॉन्ट” सिर्फ़ Latin अक्षरों के लिए मौजूद हैं; देवनागरी हमेशा सामान्य रूप में कॉपी होगी — और वही सही भी है, क्योंकि आपकी हिंदी शब्दावली अपनी सबसे अच्छी शक्ल में ही दिखती है।',
    ],
    bios: [
      hi('🇮🇳 दिल से हिन्दुस्तानी\n☕ चाय और शायरी के शौक़ीन\n📖 ज़िंदगी एक किताब है, पढ़ते जाओ'),
      hi('✨ सपनों की उड़ान\n💼 मेहनत से मान\n🌸 मुस्कुराहट मुफ़्त की दवा'),
      hi('जो बीत गई वो यादों की रानी\nजो आनी है वो ख़ुदा की मेहमान 🌧️'),
      hi('ख्वाबों में उलझे शहर के लोग\nऔर मैं अपने सफ़र में अकेले 🚶‍♂️'),
      hi('मौन में ताकत, कर्म में विश्वास\n🙏 श्रृष्टि का हिस्सा हूँ'),
      hi('दिल से भोला, दिमाग से तेज़\n🎯 लक्ष्य एक, रास्ता सही'),
      hi('लिखने से मन हल्का होता है\nइसलिए यहाँ ख़्वाब उतारता हूँ 🖊️'),
      hi('☕ सुबह की चाय, शाम की सैर\n🎵 कानों में संगीत, आँखों में मंज़िल'),
      hi('प्यार से जीना सीखो\nबाकी सब तमाशा है 🎭'),
      hi('सरलता में सुंदरता\nनज़ाकत में नरमी 🌸'),
      hi('मैं वो नहीं जो दिखता हूँ\nमैं वो हूँ जो महसूस होता हूँ 🌙'),
      hi('हर धड़कन में उम्मीद\nहर ख़्वाब में मंज़िल 🎯'),
      hi('खुश रहने की कला सीखो\nबाक़ी दुनिया अपने आप सँवर जाएगी ☀️'),
      hi('किताबों से दोस्ती, लोगों से नरमी\n🌧️ बारिश की तरह बहता हूँ'),
      hi('अपने पैरों पर खड़ा हूँ\nछत किसी और की, उड़ान अपनी 🦅'),
      hi('मेरी चुप्पी भी समझदारी है\nमेरा बोलना भी ज़रूरत 🔇'),
      hi('संतोषम् परमं सुखम्\nपरंतु महत्वाकांक्षा भी ज़रूरी ✨'),
      hi('आँखों में मंज़िल का नक्शा\nहोंठों पर मुस्कान का राज 🗺️'),
      hi('थोड़ा सा पागल, बहुत सारा सपनों वाला\n— बिल्कुल अपने ढंग का किरदार 🎭'),
      hi('गिरना मजबूरी नहीं, उठना आदत है 💪'),
      hi('मोहब्बत ज़िंदगी है, ज़िंदगी मोहब्बत ❤️'),
      hi('मीठे बोल, तीखे विचार\nचाय की तरह गर्म और दिल से ☕'),
      hg('Apni sharton pe zindagi jeeta hoon 🖤'),
      hg('Dil bada, soch chhoti ✨'),
      hg('Mehnat mera mantra hai 🔥'),
      hg('Sapno ki udaan hai meri ✨'),
      hg('Thoda pagal hoon, par asli hoon 😌'),
      hg('Apna khud ka raja hoon main 👑'),
    ],
    faqs: [
      { q: 'क्या हिंदी बायो Instagram पर सही दिखती है?', a: 'हाँ — Instagram Devanagari को पूरी तरह सपोर्ट करता है। कोई “फ़ॉन्ट बदलने” की ज़रूरत नहीं; बस सही शब्द चुनें और Copy कर लें।' },
      { q: 'हिंदी में बायो कैसे लिखें जो क्लिक हो?', a: 'एक दिलचस्प इमेज + एक सचाई + एक इंसानी स्पर्श। जैसे “चाय और किताबों की दुनिया” — छोटा, सुयोजित और याद रहने वाला।' },
      { q: 'क्या हिंग्लिश बायो चलेगी?', a: 'बिलकुल — “Planning big dreams, executing small steps” जैसी हिंग्लिश बायो भारत में सबसे ज़्यादा मेल खाती है। पूरी तरह शुद्ध हिंदी ज़रूरी नहीं।' },
      { q: 'स्टाइलिश यूनिकोड में हिंदी क्यों नहीं आती?', a: 'Unicode के गणितीय अल्फ़ान्यूमेरिक ब्लॉक सिर्फ़ Latin के लिए हैं। देवनागरी के लिए कोई स्टाइलिश कोड-पॉइंट नहीं — यह सीमा है, कमी नहीं।' },
    ],
    related: ['english-bio', 'shree-ram-bio', 'love-bio', 'sad-bio'],
  },

  {
    slug: 'english-bio',
    name: 'English Bio',
    icon: 'type',
    description: 'Clean, fluent English bios for professionals, creators and minimalists.',
    seoTitle: 'English Bio — Professional Instagram English Bios | BioCraft',
    seoDescription:
      'Polished English and Hinglish Instagram bios — crisp, modern and professional. One-tap copy, Private, for creators and businesses.',
    updated: 'November 2026',
    languages: 'English + Hinglish',
    audience: 'Everyone',
    lede: 'Crisp English for profiles that mean business — or just mean it well.',
    intro: [
      'English bios are the global default — which means they are also the easiest to make forgettable. The lines here avoid stock phrases (“living my best life”) and reach for specificity: your craft, your working style, your corner of the internet. Every one is written for an international audience that can skim in seconds.',
      'Good for creators, freelancers, small businesses, students and anyone building an English-first personal brand. Copy any line, drop in your own niche or city, and you have a bio that reads written-for-you, not generated-for-everyone.',
    ],
    bios: [
      en('✍️ Writing about craft, code and coffee\n📍 India, working worldwide\n📬 Open to collaborations'),
      en('Designing calm in a noisy feed\n🎨 Brand & product design\n☕ Fueled by flat whites'),
      en('Engineer by day, photographer by golden hour 🌇'),
      en('Sharing what I’m learning, one post at a time\n— learning in public since forever'),
      en('SaaS builder, weekend trekker\n🏔️ Shipping features and chasing summits'),
      en('Word person in a picture world\n📖 Stories, strategy and strong opinions'),
      en('Growth marketer who reads the fine print\nand the comments section'),
      en('Helping small businesses look inevitable online\n✨ Brand systems & websites'),
      en('Data by daylight, novels by moonlight\n📊 Plot twists in both'),
      en('Product thinker, chai snob\n🚀 Currently building the thing I wish existed'),
      en('Not your average feed\nJust a very average genius in the making 🧠'),
      en('Clean design, honest copy, working code\n— the triple threat'),
      en('Documenting the build: zero to one\n📦 Launch logs, weekly'),
      en('Curious human, careful builder\n🛠️ Tools don’t matter; outcomes do'),
      en('Turning ideas into interfaces\nand deadlines into done things ✅'),
      en('Editorial eye, engineering brain\n🖋️ Thinking in grids and gutters'),
      styled('Clarity Is My Aesthetic', 'bold'),
      styled('Thoughtful · Thorough · Occasionally Funny', 'sans-italic'),
      en('📍 Ahmedabad, India\n🌐 English-first, ambition-international'),
      en('Replies within 24h to good pitches\n— and to excellent chai recommendations'),
      hg('English mein theek nahi, par dreams bade hain 🌍'),
      hg('English nahi aati, soch international hai 🌎'),
      hg('Words English ke, feelings mitti ki 🧡'),
      hg('Fluent in dreams, learning English 📚'),
      hg('English mazaak, Hindi dil 😄'),
      hg('Simple English, complex dreams 💭'),
    ],
    faqs: [
      { q: 'Should an English bio be formal or casual?', a: 'Match your audience: B2B → precise and warm; consumer/creator → conversational. Both should avoid jargon soup — clarity is the professional signal.' },
      { q: 'How do I localize an English bio for India?', a: 'Swap in your city, a desi touch (chai, monsoon, cricket) and one Hindi word if it feels natural. Full Indian-English code-mixing is acceptable and often loved.' },
      { q: 'What length works for LinkedIn vs Instagram?', a: 'Instagram rewards 2–4 punchy lines; LinkedIn allows a fuller sentence or two plus a CTA. Rewrite, don’t copy-paste blindly.' },
      { q: 'How do I avoid a “generic AI bio” feel?', a: 'Name real nouns — your stack, your city, your niche. One specific detail makes the whole bio feel hand-written because it is.' },
    ],
    related: ['simple-bio', 'creator-bio', 'student-bio', 'stylish-instagram-bio'],
  },

  {
    slug: 'shree-ram-bio',
    name: 'Shree Ram Bio',
    icon: 'lotus',
    description: 'Respectful devotional bios honoring Shri Ram — serene and sincere.',
    seoTitle: 'Shree Ram Bio — Jai Shree Ram Instagram Bios | BioCraft',
    seoDescription:
      'Reverent Shree Ram bios in Hindi, Hinglish and English — devotional, peaceful and respectful lines. One-tap copy. Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'जय श्री राम — शराफ़त और श्रद्धा में डूबे लफ़्ज़।',
    intro: [
      'Shree Ram has stood for ideal conduct — मर्यादा, करुणा and कर्तव्य — long before the internet. A devotional bio should reflect that dignity: gratitude, service and humility, never hostility aimed at anyone. The lines in this collection are written with care, and they deliberately avoid aggressive sloganeering.',
      'Use these for personal profiles, seva (service) accounts, temple communities or anyone who wants quiet devotion in their daily digital space. Hindi entries are in simple Devanagari so every reader can share them easily.',
    ],
    bios: [
      hi('🕉️ जय श्री राम 🚩\nमर्यादा पुरुषोत्तम की शरण\nसेवा ही पूजा'),
      hi('जय श्री राम 🚩\nसत्य की राह पर चलना ही धर्म है'),
      hi('श्री रामाय नमः\n🙏 एक छोटा सा इंसान,\nबड़ी सी श्रद्धा'),
      hi('मर्यादा, करुणा, कर्तव्य\n— इन्हीं तीन पर चलती है मेरी दुनिया\n🚩 जय श्री राम'),
      hi('🚩 राम से बड़ा कोई नहीं\nराम सा कोई नहीं'),
      hi('सीता माँ की कृपा\nरघुवर की रच्छा\nजय श्री राम 🌸'),
      hi('जहाँ श्री राम वहाँ शांति\nजहाँ शांति वहाँ राम 🙏'),
      hi('हनुमान के भक्त, राम के सेवक\n🚩 बजरंग बली की कृपा सदा'),
      en('🕉️ Jai Shree Ram 🚩\nDharma first, ego last'),
      en('Where Ram is, there is peace.\n🙏 Ram Ram.'),
      en('🚩 Devoted to मर्यादा, guided by करुणा'),
      en('Service is my worship,\nsattva is my language.\n🚩 Jai Shree Ram'),
      hi('रामहिं रामभजत सदा\nजगत का कल्याण हो\n🚩 जय श्री राम'),
      hi('🌼 प्रभु श्री राम के चरणों में लौ\nसच्चाई ही मेरी पहचान'),
      en('A small life lived in His name —\n🚩 Jai Shree Ram'),
      hi('राम का नाम ही मेरा आधार\n🚩 हर हर बल, जय जय राम'),
      hg('Ram bhakt hoon main 🙏'),
      hg('Shri Ram ka naam, jeevan ka rang 🚩'),
      hg('Ram naam hi sab kuch 🕉️'),
      hg('Bhakti se badhkar kuch nahi 🙏'),
      hg('Ram ke naam pe jeevan 🪔'),
      hg('Jay Shri Ram — jeevan safal 🌸'),
    ],
    faqs: [
      { q: 'Are these bios suitable for any account?', a: 'Yes — they fit personal profiles, seva/temple community accounts and devotee pages. They are intentionally calm and reverent, not aggressive slogans of any kind.' },
      { q: 'Can I use these lines in temple announcements?', a: 'Please do — these lines are plain text and work for posters, WhatsApp groups, and community boards. Keep the lettering clear and the tone respectful.' },
      { q: 'Do you have bios for other faiths?', a: 'We keep devotional collections neutral and respectful. For now this collection focuses on Shri Ram; more inclusive devotional sets are on the roadmap and we will never fabricate scripture.' },
      { q: 'Is this affiliated with any religious organization?', a: 'No — BioCraft is an independent toolkit. These are original meditative lines inspired by public devotional culture, not scripture quotations or organizational endorsements.' },
    ],
    related: ['hindi-bio', 'sad-bio', 'love-bio', 'royal-bio'],
  },

  {
    slug: 'facebook-bio',
    name: 'Facebook Bio',
    icon: 'facebook',
    description: 'Warm, trustworthy bios for personal profiles, pages and small businesses.',
    seoTitle: 'Facebook Bio — Best Facebook Bios & About Lines | BioCraft',
    seoDescription:
      'Facebook-ready bios for personal profiles, creators and small businesses. Trustworthy, warm and clear. One-tap copy.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Facebook',
    lede: 'For the platform your family actually reads — warm, clear, trustworthy.',
    intro: [
      'Facebook is where context travels between generations — your cousin in Pune, your aunt in Surat, a customer who found your page through a shared post. A Facebook bio should be warmer and more complete than an Instagram one: a sentence of who you are, what you do, and how to reach you, written so anyone from 14 to 74 can skim it.',
      'These lines are tuned for personal profiles, small business pages, community groups and local-service businesses. Copy one, replace the bracketed bits, and your About section is genuinely better than 90% of pages.',
    ],
    bios: [
      en('Building useful things from [your city] 🇮🇳\nFamily first, deadlines second, chai always ☕'),
      en('Small business, big heart\n📦 [Your shop] — we deliver happiness, carefully packed'),
      en('Sharing what works: tips, tools and honest reviews\n📍 Based in India'),
      en('Dad of two, owner of one chai kettle, survivor of 400 meetings'),
      en('Runs [your brand/page] — quality you can taste\n📞 DM for orders & queries'),
      en('Educator | Storyteller | Part-time photographer\n📬 Ping for anything meaningful'),
      hi('👨‍👩‍👧‍👦 परिवार पहला, काम दूसरा\n☕ चाय हमेशा\n📍 इंडिया से ❤️'),
      hi('छोटा सा कारोबार, बड़ा सा दिल\n📦 ऑर्डर के लिए मैसेज करें'),
      hi('सिखाऊंगा वही जो मैंने खुद सीखा\n📚 ज्ञान बाँटने में कोई फीस नहीं'),
      en('Grows vegetables, answers emails, repeats 🥦'),
      en('Serving [your area] with honest work since [year]\n🤝 Word of mouth is our marketing'),
      en('“Do what you love, love what you do”\n— and post about it here'),
      en('Local business, honest prices, warm service\n📞 Call/WhatsApp: [your number]'),
      en('Mom, baker, accidental entrepreneur 🎂\n— flour on my hands, orders in my inbox'),
      en('I document food, family and festivals\n📷 Follow the ride'),
      en('Here for [your niche — e.g. cricket analysis]\nFeel free to argue, respectfully 🏏'),
      en('Business: [your business] | DM for quotes\n🏠 Serving the neighbourhood daily'),
      hi('ईमानदारी से काम, खुशी से सेवा\n🙏 [आपका नाम / पेज]'),
      hg('Facebook pe household hoon main 👨‍👩‍👧'),
      hg('Family, friends, Facebook 👨‍👩‍👧‍👦'),
      hg('Desi connection, Facebook pe 🌐'),
      hg('Newsfeed scroll karta hoon full speed 😄'),
      hg('Profile strong, heart pure ❤️'),
      hg('Desi roots, Facebook vibes 🌳'),
    ],
    faqs: [
      { q: 'How long can a Facebook bio be?', a: 'The About section is generous — up to roughly 101 characters for the short bio and more for the long one. Keep the short line under 100 characters for clean display on mobile.' },
      { q: 'Should a business bio include contact details?', a: 'Yes — a phone/WhatsApp or DM instruction converts directly to orders. “DM for orders” is the single highest-ROI line on a small-business page.' },
      { q: 'Are Hindi bios okay on Facebook?', a: 'Absolutely — Facebook’s India audience is deeply bilingual. Hindi headlines with an English call-to-action perform very well for local services.' },
      { q: 'Can I reuse Instagram bios on Facebook?', a: 'Yes, but loosen them: Facebook invites a warmer, fuller tone. Add one family/community/local detail Instagram bios often skip.' },
    ],
    related: ['english-bio', 'hindi-bio', 'creator-bio', 'simple-bio'],
  },

  {
    slug: 'creator-bio',
    name: 'Creator Bio',
    icon: 'rocket',
    description: 'For YouTubers, streamers and content creators building an audience.',
    seoTitle: 'Creator Bio — Instagram Bios for Content Creators | BioCraft',
    seoDescription:
      'Creator bios for YouTubers, streamers and influencers — crisp, discoverable and real. One-tap copy. Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Your bio is your channel trailer in 150 characters.',
    intro: [
      'Creator bios do double duty: they convince a stranger to follow AND they hint at what the algorithm should recommend you for. The strongest ones name the niche in plain words (“personal finance for salaried Indians”), promise a format (“weekly deep-dives”) and keep one line of pure personality.',
      'Drop in your real niche and cadence where you see brackets. A creator bio with your actual topic in it will always beat the cleverest generic line.',
    ],
    bios: [
      en('🎬 Weekly videos on [your niche]\n📌 New upload every Sunday\n🔔 Bell icon is your compass'),
      en('Making [your topic] simple, one video at a time\n🎙️ Podcast + YouTube'),
      en('Day in the life of a [your job]\n📷 Cameras, chaos and chai\n👇 Latest video below'),
      en('Explainers, essays and the occasional rant\n🧠 [Your niche] without the fluff'),
      en('Streaming [game/niche] and disappointing viewers daily (affectionately) 🎮'),
      en('Indian creator talking money, markets and mistakes\n📈 Not SEBI-registered, just experienced'),
      en('Food before filter, stories before scripts\n🍲 Recipes & restaurant diaries'),
      hi('🎬 [आपका टॉपिक] पर हर हफ़्ते नया वीडियो\n📌 रविवार को ज़रूर देखें\n👇 लिंक नीचे'),
      hi('सीखते हुए सिखाता हूँ\n📚 [आपका विषय] आसान भाषा में'),
      en('On the internet since [year]\nStill figuring it out, publicly'),
      en('Editor of life — cuts the boring, keeps the plot\n✂️ Uploads every [day]'),
      en('📌 Pinning the good stuff\n🎬 [Your channel] on YouTube\n📧 Collabs: DM “COLLAB”'),
      en('Small creator, sweating the pixels\n🎨 Every frame hand-checked'),
      en('Vlogs about learning [skill] in public\n🚀 Failure included, free of charge'),
      en('Turning 10-year-old advice into 2026 experiments\n🔬 Videos Sundays'),
      en('Your friendly neighbourhood [niche] nerd\n📚 Deep-dives, lightly salted'),
      styled('Creating Every Week No Excuses', 'sans-bold'),
      en('🎥 Camera found the kid who loved explaining things'),
      hg('Content is my craft 🎬'),
      hg('Create karta hoon, camera se 🎥'),
      hg('Edit nahi, create karta hoon ✂️'),
      hg('Banaata hoon sab dekhte hain 👀'),
      hg('Content queen/king 👑'),
      hg('Camera se pyaar, shauk se swag 🎞️'),
    ],
    faqs: [
      { q: 'What should a creator bio say in 150 characters?', a: 'Niche + format + cadence + one human line. Example: “Personal finance for salaried India 🇮🇳 | Sunday deep-dives | Chai enthusiast”. That is an entire channel in two lines.' },
      { q: 'Should I put links in the bio itself?', a: 'Instagram bios allow one clickable link — the rest of the lines are plain text. Use a link-in-bio tool or your newest upload; keep pasted URLs short and clean.' },
      { q: 'Do emojis help creators?', a: 'One or two category emojis act as visual anchors (🎬 for video, 💰 for finance). More than three reads as spam.' },
      { q: 'How often should I refresh my creator bio?', a: 'Whenever your format, cadence or niche changes — usually every quarter. Outdated “new video every Friday” lines erode trust fast.' },
    ],
    related: ['photographer-bio', 'english-bio', 'stylish-instagram-bio', 'instagram-bio-for-boys'],
  },

  {
    slug: 'photographer-bio',
    name: 'Photographer Bio',
    icon: 'camera',
    description: 'Bios for wedding, portrait, street and travel photographers.',
    seoTitle: 'Photographer Bio — Instagram Bios for Photographers | BioCraft',
    seoDescription:
      'Photographer bios for weddings, portraits, street and travel — with booking cues. One-tap copy, Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Say it with light, shadow and one perfect line.',
    intro: [
      'Photographer bios are portfolios in miniature. A client deciding between five wedding photographers is reading your bio while skimming your grid — they want to know your eye, your location and how to book, in under four seconds. Everything else is decoration.',
      'Include your city and specialty where you see brackets — local search lives there. The lines below cover styles from moody documentary to pastel editorial.',
    ],
    bios: [
      en('📷 Wedding & portrait photographer | [Your city]\n🕊️ Honest frames, not posed\n✉️ Book: [email]'),
      en('Chasing golden hour like it owes me money 🌇\n🎞️ Film & digital'),
      en('Street photographer documenting the city honestly 🏙️\n📍 India'),
      en('Light first, everything else second\n✨ Weddings that feel like you'),
      en('📸 Stories in 1/250th of a second\n🇮🇳 Based in [city]'),
      en('Portraits with permission, landscapes with patience\n🏔️ Travel diary'),
      en('Frame every chapter of your day\n— from chaos to cake 🎂'),
      hi('📷 तस्वीरों में कहानियाँ\n📍 [आपका शहर]\n✉️ बुकिंग के लिए मैसेज करें'),
      hi('रोशनी का पीछा, यादों का ख़ज़्चा\n🌇 गोल्डन आवर का दीवाना'),
      en('Photographer of vows, vendors and victory laps 💍'),
      en('Editorial eye, documentary heart\n— magazines, weddings & brands'),
      en('I shoot the in-between moments\nthe ones posed photos can’t keep 🤍'),
      en('🌍 Travel photographer, currently in [place]\n📩 Commissions open'),
      en('Candid > curated\n— unless it’s a wedding, then both'),
      en('🎞️ 35mm soul, digital discipline\n📸 Weddings | Couples | Products'),
      en('Making ordinary streets legendary\none frame at a time'),
      en('Your memories deserve better than a burst of 40 frames\n— intentional clicks only'),
      styled('Every Frame Tells A Story', 'italic'),
      hg('Frames mein story hai meri 📷'),
      hg('Lens se dekhta hoon duniya 📸'),
      hg('Camera mera third eye 🧿'),
      hg('Click karna mera superpower ⚡'),
      hg('Photos bolte hain bina awaaz ke 🖼️'),
      hg('Shutter speed se fast life 🏎️'),
    ],
    faqs: [
      { q: 'What earns a booking from a bio alone?', a: 'City + specialty + contact path. “Wedding photographer | Pune | bookings: email” tells a prospect everything in five seconds — fancy taglines rarely convert better.' },
      { q: 'Should I list gear in my bio?', a: 'Rarely. Clients buy outcomes, not camera bodies. Gear belongs in captions or a behind-the-scenes highlight, not your 150 characters.' },
      { q: 'How should drone photographers write theirs?', a: 'Lead with the licence and the niche — “Licensed drone pilot | aerial weddings & landscapes | [city]”. Safety-first signals win serious clients.' },
      { q: 'Is a Hindi bio okay for photographers?', a: 'For local/destination weddings in India, a bilingual line (“तस्वीरों में कहानियाँ — [city]”) often outperforms English-only because families share the page.' },
    ],
    related: ['creator-bio', 'english-bio', 'simple-bio', 'stylish-instagram-bio'],
  },

  {
    slug: 'student-bio',
    name: 'Student Bio',
    icon: 'cap',
    description: 'Campus-life bios — studies, side projects, sports and self-discovery.',
    seoTitle: 'Student Bio — Instagram Bios for Students & College | BioCraft',
    seoDescription:
      'Student bios for school and college — ambitious, funny and real. Eng · Hindi · Hinglish, one-tap copy. Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Campus energy in 150 characters — deadlines, doodles and dreams.',
    intro: [
      'Student bios are allowed to be unpolished — that is their charm. The best ones mix one ambition (exams, essays, esports, entrepreneurship) with one hobby and one honest joke about the suffering of deadlines. Future-you-reading-this-essay-on-Google will appreciate the specificity.',
      'These lines suit school, college, coaching and first-job stages. Swap in your stream or sport and it becomes unmistakably yours.',
    ],
    bios: [
      en('🎓 B.Tech [branch] | [College]\n📚 Powered by chai & past-paper panic\n⚽ Football when not panicking'),
      en('Studying hard, scrolling harder 📱'),
      en('JEE aspirant | Dream: [your dream college]\n📖 Everything for tomorrow starts today'),
      en('NEET warrior in training\n🩻 Future doctor, current sufferer'),
      en('College kid with a camera and a calculator 🧮'),
      en('Class of [year] | Future [profession]\n🚀 Building side projects instead of excuses'),
      en('DCA student | part-time coder, full-time dreamer 💻'),
      hi('🎓 [क्लास/कॉलेज] का छात्र\n📚 मेहनत जारी, मंज़िल दूर नहीं\n☕ चाय + तैयारी'),
      hi('पढ़ाई चल रही है…\n(mostly scrolling 😅)'),
      en('🏹 Archery by day, achiever by night'),
      en('Debate, doodle, deadline — my daily diet 🍽️'),
      en('First-year problems: paying canteen bills & pretending to know the timetable'),
      en('Chess, code and chai — the college trilogy ♟️'),
      en('Notes maker, meme connoisseur, assignment procrastinator — all three full-time'),
      en('📚 Currently surviving: [subject]\n🫠 Barely — send rescue (and notes)'),
      en('Future founder, current broke student 💸\n— the bridge is called scholarship'),
      styled('Study now, flex later', 'sans-bold'),
      en('India’s hardest exam: asking for WiFi password during exams 📶'),
      hg('Student hoon, par dreaming big 🎓'),
      hg('Padhai ke saath sapne bhi 📚'),
      hg('Exam ke baad gamer mode ON 🎮'),
      hg('Notes aur neend ka fight 😴'),
      hg('Student life = chaos + chai ☕'),
      hg('Career mein kuch banna hai 💼'),
    ],
    faqs: [
      { q: 'Should a student bio mention exams?', a: 'Yes if you are preparing for JEE/NEET/UPSC/CAT — specificity attracts study-buddies and mentors. Otherwise name your stream, club or project instead.' },
      { q: 'How do I make a student bio for a resume?', a: 'Keep one professional line separately: “CS undergrad @ [college] | open to internships”. Bio ≠ resume; this one is your personality.' },
      { q: 'Can I change these bios seasonally?', a: 'Please do — exam season gets the “barely surviving” lines; vacation gets travel ones. A living bio beats a fossilized one.' },
      { q: 'Are these safe for younger audiences?', a: 'All lines here are written to be school-safe — no alcohol, no dating-app culture, nothing inappropriate.' },
    ],
    related: ['simple-bio', 'cool-bio', 'english-bio', 'hindi-bio'],
  }
];

/** Every collection, in display order. */


/* ========== 18 visual design styles (§3) ========== */

export type BioDesignKey =
  | 'royal'
  | 'attitude'
  | 'minimal'
  | 'aesthetic'
  | 'emoji-rich'
  | 'unicode'
  | 'vip'
  | 'love'
  | 'cute'
  | 'funny'
  | 'professional'
  | 'dark'
  | 'creative'
  | 'devotional'
  | 'vaporwave'
  | 'botanical'
  | 'cafe'
  | 'midnight';

export const BIO_DESIGNS: ReadonlyArray<{ key: BioDesignKey; label: string }> = [
  { key: 'royal', label: 'Royal' },
  { key: 'attitude', label: 'Attitude' },
  { key: 'minimal', label: 'Minimal' },
  { key: 'aesthetic', label: 'Aesthetic' },
  { key: 'emoji-rich', label: 'Emoji-Rich' },
  { key: 'unicode', label: 'Terminal Mono' },
  { key: 'vip', label: 'VIP' },
  { key: 'love', label: 'Love' },
  { key: 'cute', label: 'Cute' },
  { key: 'funny', label: 'Funny' },
  { key: 'professional', label: 'Professional' },
  { key: 'dark', label: 'Dark' },
  { key: 'creative', label: 'Creative' },
  { key: 'devotional', label: 'Devotional' },
  { key: 'vaporwave', label: 'Vaporwave' },
  { key: 'botanical', label: 'Botanical' },
  { key: 'cafe', label: 'Café & Chai' },
  { key: 'midnight', label: 'Midnight' },
];

const DESIGN_KEYS: BioDesignKey[] = BIO_DESIGNS.map((d) => d.key);

/** FNV-1a hash — stable across sessions, no Math.random. */
function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Deterministic design assignment: same collection + index always yields the
 * same look, so a page of cards shows a deliberate, balanced mix rather than
 * random repaints. Collections with a house style seed an affinity list.
 */
const COLLECTION_AFFINITY: Partial<Record<string, BioDesignKey[]>> = {
  'instagram-bio-for-boys': ['attitude', 'dark', 'professional', 'minimal', 'creative'],
  'instagram-bio-for-girls': ['cute', 'aesthetic', 'love', 'emoji-rich', 'creative'],
  'attitude-bio': ['attitude', 'dark', 'unicode', 'midnight'],
  'royal-bio': ['royal', 'vip', 'devotional'],
  'vip-bio': ['vip', 'royal', 'unicode'],
  'love-bio': ['love', 'aesthetic', 'emoji-rich', 'cute'],
  'sad-bio': ['minimal', 'dark', 'aesthetic', 'unicode'],
  'stylish-instagram-bio': ['unicode', 'creative', 'emoji-rich', 'aesthetic'],
  'simple-bio': ['minimal', 'professional', 'aesthetic'],
  'cool-bio': ['creative', 'unicode', 'attitude', 'emoji-rich'],
  'hindi-bio': ['devotional', 'minimal', 'creative', 'aesthetic'],
  'english-bio': ['professional', 'minimal', 'creative'],
  'shree-ram-bio': ['devotional', 'royal'],
  'facebook-bio': ['professional', 'minimal', 'creative'],
  'creator-bio': ['creative', 'emoji-rich', 'unicode', 'vaporwave'],
  'photographer-bio': ['minimal', 'aesthetic', 'professional', 'botanical'],
  'student-bio': ['minimal', 'professional', 'vaporwave', 'cute'],
  'cute-bio': ['cute', 'love', 'emoji-rich', 'aesthetic'],
  'hinglish-bio': ['creative', 'attitude', 'emoji-rich', 'cafe'],
  'gamer-bio': ['dark', 'attitude', 'vaporwave', 'midnight'],
};

export function designForBio(collectionSlug: string, index: number): BioDesignKey {
  const affinity = COLLECTION_AFFINITY[collectionSlug];
  const hash = hashString(`${collectionSlug}#${index}`);
  if (affinity && affinity.length > 0) {
    return affinity[hash % affinity.length];
  }
  return DESIGN_KEYS[hash % DESIGN_KEYS.length];
}

export function designLabel(key: BioDesignKey): string {
  return BIO_DESIGNS.find((d) => d.key === key)?.label ?? key;
}


const PART2: BioCollection[] = [
  {
    slug: 'cute-bio',
    name: 'Cute Bio',
    icon: 'cute',
    description: 'Soft hearts, sparkles and warm chaos — bios for the sweet ones.',
    seoTitle: 'Cute Bio — Sweet Instagram Bios for Her & Him | BioCraft',
    seoDescription:
      'Original cute Instagram bios — soft hearts, sparkles and playful warmth. Copy any bio in one tap, English, Hindi and Hinglish, Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Sweetness, served in 150 characters — for the soft hearts and the loud sparkles.',
    intro: [
      'Cute bios are not about being small — they are about being warm. The best ones pair one tender image with one honest detail about who you are, so the reader smiles before they even reach your posts.',
      'Every line below is original BioCraft writing — no copied templates, no filler. Tap Copy on the one that feels like you and make it yours.',
    ],
    bios: [
      en('Soft life, soft heart 🌸'),
      en('Certified angel with a devil-may-care smile 😇'),
      en('Sprinkles of chaos, clouds of joy 🌈'),
      en('Small steps, loud sparkles ✨'),
      en('Kindness looks good on me 💕'),
      en('Sunshine with a side of sass ☀️'),
      en('Sugar, spice and everything nice 🍬'),
      en('Too sweet to handle? Probably 🍰'),
      en('Measured in hugs and daydreams 🧸'),
      en('Collecting small joys daily 🌼'),
      hi('क्यूटनेस की कोई लिमिट नहीं 🌸'),
      hi('नन्हा सा दिल, बड़े सपने 🐣'),
      hi('मुस्कान मेरी पहचान है 😊'),
      hi('प्यारा हूँ, पर कमज़ोर नहीं 💪'),
      hg('Cuteness overload, handle carefully 🧸'),
      hg('Soft life, big dreams 🌸'),
      hg('Full certified cutie — no refunds 😇'),
      hg('Thodi si cute, thodi si queen 👑'),
      hg('Baby steps, big sparkle ✨'),
      styled('cute mode: always on', 'cursive'),
    ],
    faqs: [
      { q: 'Which cute bio should I use?', a: 'Pick the one that makes you smile first — that is usually the closest to your real energy. Add your own keyword (a food, a hobby, a city) to make it yours.' },
      { q: 'Are these bios yours to use?', a: 'Yes — copy any line and use it on any platform, no sign-up required.' },
      { q: 'Can I use a cute bio on WhatsApp or Snapchat?', a: 'Absolutely. Every bio here is a short Unicode string — paste it into WhatsApp About, Snapchat or Instagram equally well.' },
    ],
    related: ['love-bio', 'instagram-bio-for-girls', 'hinglish-bio'],
    preview: 'girls',
  },
  {
    slug: 'hinglish-bio',
    name: 'Hinglish Bio',
    icon: 'globe',
    description: 'Real desi energy in Latin script — chai, hustle, heart and a little attitude.',
    seoTitle: 'Hinglish Bio — Desi Instagram Bios in Hinglish | BioCraft',
    seoDescription:
      'Original Hinglish Instagram bios — chai, hustle, heart and attitude, written the way India actually texts. One-tap copy, Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Hindi at heart, English in the hands — the way India actually talks.',
    intro: [
      'Hinglish is not broken English — it is a living, complete register of its own: half Hindi cadence, half English vocabulary, 100 percent desi. These bios are written that way on purpose, not translated from anything.',
      'Devanagari lovers: flip the bio generator to Hindi for native script. Everyone else: copy these as they are — they are built for Latin keyboards.',
    ],
    bios: [
      hg('Apni zindagi apne rules pe jeeta hoon 😎'),
      hg('Chai ho ya dreams — dono strong ☕'),
      hg('Small town boy, big city dreams 🌟'),
      hg('Kaam se kaam, baaki sab camera 📸'),
      hg('Dil se desi, sapno se international 🌍'),
      hg('Hustle hard, rest harder 🛌'),
      hg('Paisa nahi, peace chahiye 🕊️'),
      hg('Shayari se zyada, real life better 😌'),
      hg('Zindagi badalti hai — main nahi 😏'),
      hg('Seedha saadha, thodi si attitude 🖤'),
      hg('Thoda funny, thoda filmy 🎬'),
      hg('Mehnat karo — haar nahi, winner banega 🏆'),
      hg('Sunday ho ya Monday, chai zaroori hai ☕'),
      hg('Apni race khud run karo 🏃'),
      hg('Desi roots, global dreams 🌐'),
      en('Built Hinglish, born desi ✨'),
      en('Half Hindi, half English, full heart 🇮🇳'),
      hi('अपनी शर्तों पर ज़िंदगी जीता हूँ 🖤'),
      hi('मेहनत से कोई शॉर्टकट नहीं 🔥'),
      styled('desi at heart', 'bold-script'),
    ],
    faqs: [
      { q: 'What is a Hinglish bio?', a: 'A bio written in Latin script that mixes Hindi vocabulary and cadence with English words — the way most Indians actually text and speak.' },
      { q: 'Should I use Hindi or Hinglish?', a: 'Use Devanagari via the Hindi language switch if your audience reads Hindi script; Hinglish is friendlier for Latin-keyboard crowds and mixed audiences.' },
      { q: 'Will Hinglish bios work everywhere?', a: 'Yes — they are plain Latin-script Unicode. They render identically on Instagram, WhatsApp, Snapchat, Threads, TikTok and X.' },
    ],
    related: ['hindi-bio', 'attitude-bio', 'english-bio'],
  },
  {
    slug: 'gamer-bio',
    name: 'Gamer Bio',
    icon: 'gamer',
    description: 'For the grinders, the clutch players and the 2 AM queue warriors.',
    seoTitle: 'Gamer Bio — Gaming Instagram Bios That Hit Different | BioCraft',
    seoDescription:
      'Original gamer Instagram bios — grind, clutch, squad and endless queue. Copy any bio in one tap, English, Hindi and Hinglish, Private.',
    updated: 'November 2026',
    languages: 'English + Hindi + Hinglish',
    audience: 'Everyone',
    lede: 'Ranked or casual — bring the grind to your profile.',
    intro: [
      'A good gamer bio tells your squad two things in one glance: your main energy and your sense of humour. These lines are written by people who actually know what a clutch means, not by a content farm.',
      'Mix one line here with your favourite game or role for maximum effect — “Mid main · GG is not in my vocabulary” hits harder than any generic caption.',
    ],
    bios: [
      en('Respawning daily 🎮'),
      en('Up late, queue deep, eyes locked in 🕹️'),
      en('Casual on weekdays, sweat on weekends 👾'),
      en('GG is not in my vocabulary 🏆'),
      en('Aim for the headshot, land every time 🎯'),
      en('Lag is my only enemy ⚡'),
      en('Screenshots or it didn’t happen 📸'),
      en('Main-ing my way through life 🐉'),
      en('Copied that, rotating point B 🛡️'),
      hi('गेमर हूँ, घर में नहीं खेलता 🎮'),
      hi('स्किल से जीतता हूँ, भाग्य से नहीं 🏆'),
      hg('Stream nahi karta, bas grind karta hoon 🎯'),
      hg('Rank: always climbing 🕹️'),
      hg('Squad pe full trust, aim pe full focus 👾'),
      hg('Clutch ya kuch nahi 😤'),
      hg('Headshots are a personality 🎯'),
      hg('3 AM boss fights only 🌙'),
      hg('Gamer by heart, student by trade 📚'),
      hg('One tap at a time ⚡'),
      styled('press start to win', 'monospace'),
    ],
    faqs: [
      { q: 'Which gamer bio should I pick?', a: 'Choose the one that matches your main — grinder, clutch player or casual. Your squad will recognise the energy instantly.' },
      { q: 'Can I put my rank or main in the bio?', a: 'Yes — that is the single best edit you can make to any line here. “Support mains only · clutch or nothing” is a personality.' },
      { q: 'Are gaming bios different from attitude bios?', a: 'They overlap on swagger, but gamer bios speak fluent squad — queue, clutch, aim, GG. If that is your language, this is your collection.' },
    ],
    related: ['attitude-bio', 'cool-bio', 'creator-bio'],
    preview: 'boys',
  },
];

export const BIO_COLLECTIONS: readonly BioCollection[] = [...PART1, ...PART2];
const bySlug = new Map(BIO_COLLECTIONS.map((collection) => [collection.slug, collection]));

export function collectionForPath(path: string): BioCollection | undefined {
  const slug = path.startsWith('/') ? path.slice(1) : path;
  return bySlug.get(slug);
}

export function collectionBySlug(slug: string): BioCollection | undefined {
  return bySlug.get(slug);
}

export const TOTAL_BIOS = BIO_COLLECTIONS.reduce((sum, c) => sum + c.bios.length, 0);

/** The 10 quick-jump chips shown on the collections home and collection pages. */
export const COLLECTION_NAV: Array<{ label: string; slug: string }> = [
  { label: 'Boys', slug: 'instagram-bio-for-boys' },
  { label: 'Girls', slug: 'instagram-bio-for-girls' },
  { label: 'Attitude', slug: 'attitude-bio' },
  { label: 'Love', slug: 'love-bio' },
  { label: 'Stylish', slug: 'stylish-instagram-bio' },
  { label: 'VIP', slug: 'vip-bio' },
  { label: 'Hindi', slug: 'hindi-bio' },
  { label: 'English', slug: 'english-bio' },
  { label: 'Religious', slug: 'shree-ram-bio' },
  { label: 'Facebook', slug: 'facebook-bio' },
];

/** Curated rails for the collections index (real counts computed elsewhere). */
export const POPULAR_COLLECTIONS = [
  'instagram-bio-for-boys',
  'instagram-bio-for-girls',
  'attitude-bio',
  'love-bio',
  'stylish-instagram-bio',
  'vip-bio',
] as const;

export const RECENTLY_ADDED_COLLECTIONS = [
  'gamer-bio',
  'cute-bio',
  'hinglish-bio',
  'photographer-bio',
] as const;
