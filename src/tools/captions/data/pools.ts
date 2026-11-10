/**
 * Caption Generator data: 12 topics x 5 tones x 2 languages.
 *
 * Templates carry a single {topic} slot. The engine samples five distinct
 * templates per run, so captions are unique by construction. All captions
 * sit far below Instagram's 2,200-character caption limit.
 */

import type { Language } from '../../../types';

export type TopicId =
  | 'photography'
  | 'food'
  | 'fashion'
  | 'travel'
  | 'fitness'
  | 'beauty'
  | 'tech'
  | 'music'
  | 'art'
  | 'books'
  | 'business'
  | 'comedy';

export interface Topic {
  id: TopicId;
  labelEn: string;
  labelHi: string;
  /** Hinglish labels keep the UI consistent with the Hinglish option. */
  labelHg: string;
  wordEn: string;
  wordHi: string;
  wordHg: string;
}

export const TOPICS: Topic[] = [
  { id: 'photography', labelEn: 'Photography', labelHi: 'फोटोग्राफी', wordEn: 'photography', wordHi: 'फोटोग्राफी' , labelHg: 'Photography', wordHg: 'photography' },
  { id: 'food', labelEn: 'Food', labelHi: 'खाना', wordEn: 'food', wordHi: 'खाना' , labelHg: 'Food', wordHg: 'food' },
  { id: 'fashion', labelEn: 'Fashion', labelHi: 'फैशन', wordEn: 'fashion', wordHi: 'फैशन' , labelHg: 'Fashion', wordHg: 'fashion' },
  { id: 'travel', labelEn: 'Travel', labelHi: 'यात्रा', wordEn: 'travel', wordHi: 'यात्रा' , labelHg: 'Travel', wordHg: 'travel' },
  { id: 'fitness', labelEn: 'Fitness', labelHi: 'फिटनेस', wordEn: 'fitness', wordHi: 'फिटनेस' , labelHg: 'Fitness', wordHg: 'fitness' },
  { id: 'beauty', labelEn: 'Beauty', labelHi: 'ब्यूटी', wordEn: 'beauty', wordHi: 'ब्यूटी' , labelHg: 'Beauty', wordHg: 'beauty' },
  { id: 'tech', labelEn: 'Tech & Coding', labelHi: 'टेक', wordEn: 'tech', wordHi: 'तकनीक' , labelHg: 'Tech & Coding', wordHg: 'tech' },
  { id: 'music', labelEn: 'Music', labelHi: 'संगीत', wordEn: 'music', wordHi: 'संगीत' , labelHg: 'Music', wordHg: 'music' },
  { id: 'art', labelEn: 'Art', labelHi: 'कला', wordEn: 'art', wordHi: 'कला' , labelHg: 'Art', wordHg: 'art' },
  { id: 'books', labelEn: 'Books', labelHi: 'किताब', wordEn: 'books', wordHi: 'किताब' , labelHg: 'Books', wordHg: 'books' },
  { id: 'business', labelEn: 'Business', labelHi: 'बिज़नेस', wordEn: 'business', wordHi: 'बिज़नेस' , labelHg: 'Business', wordHg: 'business' },
  { id: 'comedy', labelEn: 'Comedy & Memes', labelHi: 'कॉमेडी', wordEn: 'comedy', wordHi: 'कॉमेडी' , labelHg: 'Comedy & Memes', wordHg: 'comedy' },
];

export type CaptionTone =
  | 'witty'
  | 'aesthetic'
  | 'bold'
  | 'inspirational'
  | 'casual'
  | 'professional'
  | 'minimal'
  | 'luxe';

export const TONES: Array<{ id: CaptionTone; label: string }> = [
  { id: 'casual', label: 'Casual' },
  { id: 'professional', label: 'Professional' },
  { id: 'witty', label: 'Funny' },
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'aesthetic', label: 'Aesthetic' },
  { id: 'bold', label: 'Bold' },
  { id: 'luxe', label: 'Quiet Luxury' },
];

const TEMPLATES: Record<CaptionTone, Record<Language, string[]>> = {
  witty: {
    en: [
      'When {topic} is the personality trait, not the hobby.',
      'Currently accepting compliments on my {topic} game.',
      'My {topic} era — do not disturb.',
      'Professional {topic} enthusiast, amateur everything else.',
      'Warning: may reference {topic} excessively.',
      'Powered by chai and my {topic} obsession.',
      'Fluent in sarcasm and {topic}.',
      'New phone who dis — jk, I’m busy with {topic}.',
      'POV: you opened the app just for {topic} updates.',
      'Main character energy, sponsored by {topic}.',
      'Currently unavailable — out here {topic}-ing.',
      'Very demure, very mindful, very {topic}.',
      'My camera roll and my personality, all {topic}.',
      'Plot twist: {topic} is the main plot.',
    ],
    hi: [
      'जब {topic} शौक नहीं, पहचान बन जाए।',
      '{topic} की वजह से जवाब देना बंद कर चुका हूँ।',
      'मेरा {topic} वाला मूड चल रहा है।',
      '{topic} — मेरी समस्या भी, मेरा समाधान भी।',
      'सारा क्रेडिट मेरे {topic} वाले जुनून को।',
      'चाय की चुस्कियों और {topic} के भरोसे।',
      '{topic} समझने वालों से ही दोस्ती।',
      'थोड़ा सा {topic}, बहुत सारे प्यार के साथ।',
      'POV: सिर्फ {topic} के लिए app खोला है।',
      'मेरी main character energy, प्रायोजित है {topic} से।',
      'अभी busy हूँ, {topic} चल रहा है।',
      'बहुत शालीन, बहुत mindful — {topic} का समय।',
      'Camera roll और personality — सब {topic}।',
      'Plot twist: {topic} ही plot है।',
    ],
    hg: [
      'Jab {topic} hobby nahi, personality trait ban jaye.',
      'Apne {topic} game ke compliments accept kar rahi hoon.',
      'Mera {topic} era chal raha hai — disturb mat karna.',
      'Professional {topic} enthusiast, amateur baaki sab mein.',
      'Warning: {topic} ka zyada reference aa sakta hai.',
      'Chai aur apne {topic} obsession se powered.',
      'Sarcasm aur {topic} dono mein fluent hoon.',
      'New phone who dis — actually busy hoon {topic} mein.',
      'POV: app sirf {topic} ke liye khola hai.',
      'Main character energy, sponsored by {topic}.',
      'Currently unavailable — {topic} chal raha hai.',
      'Very demure, very mindful — {topic}.',
      'Camera roll aur personality — sab {topic}.',
      'Plot twist: {topic} hi plot hai.',
    ],
  },
  aesthetic: {
    en: [
      '{topic}, captured softly.',
      'Quiet moments of {topic}.',
      'Chasing light and {topic}.',
      'A little {topic}, every single day.',
      'Romanticising {topic}, quietly.',
      'This is what {topic} feels like.',
      'Savouring slow {topic} days.',
      'Postcards from my {topic} life.',
      'In my soft {topic} era.',
      'Quiet luxury, louder {topic}.',
      'Golden hour was made for {topic}.',
      'Slow mornings and {topic}.',
      'Soft moments, {topic} edition.',
      'Romanticising ordinary {topic} days.',
    ],
    hi: [
      '{topic} के धीमे, मुलायम पल।',
      '{topic} की वो खामोश सुकून।',
      '{topic} में खोया हुआ एक पल।',
      'रोज़ाना थोड़ा सा {topic}।',
      '{topic} को अपनाना ही एक कला है।',
      'ये कैफ़ियत है {topic} की।',
      '{topic} के वो भारी लेकिन सुकून वाले दिन।',
      'मेरी {topic} ज़िंदगी के छोटे-छोटे पते।',
      'मेरा {topic} का soft era चल रहा है।',
      'शामें {topic} की, साथ में चाय।',
      'Golden hour, {topic} का सबसे अच्छा दोस्त।',
      'शांत सुबहें और {topic}।',
      'साधारण दिनों को खास बनाती {topic}।',
      'Soft moments — {topic} edition।',
    ],
    hg: [
      '{topic}, softly captured.',
      '{topic} ke quiet moments.',
      'Light aur {topic} ke peeche bhaag rahi hoon.',
      'Har din thoda sa {topic}.',
      '{topic} ko romanticize kar rahi hoon, quietly.',
      'Aisa hi lagta hai {topic}.',
      'Slow {topic} days, savored.',
      'Meri {topic} zindagi ke postcards.',
      'Apna soft {topic} era chal raha hai.',
      'Golden hour was made for {topic}.',
      'Slow mornings and {topic}.',
      'Quiet vibes, {topic} edition.',
      'Romanticising {topic} on a Tuesday.',
      'Soft moments, {topic} edition.',
    ],
  },
  bold: {
    en: [
      '{topic} first. Everything else later.',
      'If you know, you know. {topic}.',
      'Betting on my {topic} journey, loudly.',
      'No permission needed — just {topic}.',
      'Leveled up my {topic} game.',
      'Make room for {topic}.',
      '{topic} is the plan.',
      'Zero apologies for my {topic} obsession.',
      'Entering my {topic} era — unapologetically.',
      'Built different, powered by {topic}.',
      'Main character, and {topic} is my arc.',
      'No permission needed for {topic}.',
      'Limitless {topic} energy.',
      'Silent moves, loud {topic} results.',
    ],
    hi: [
      '{topic} पहले। बाकी सब बाद में।',
      'जिनको पता है, उन्हें पता है। {topic}।',
      'बिना किसी इजाज़त के — बस {topic}।',
      'अपने {topic} खेल में एक स्तर ऊपर।',
      '{topic} के लिए जगह बनाओ।',
      '{topic} ही प्लान है।',
      'अपने {topic} के लिए कभी माफ़ नहीं माँगूँगा।',
      'अपना रास्ता {topic} से होकर जाने दो।',
      'मेरा {topic} वाला era शुरू — बिना इजाज़त।',
      'Built different — {topic} से चलता हूँ।',
      'मैं main character हूँ, {topic} मेरा arc है।',
      'इजाज़त ज़रूरी नहीं — {topic} ही काफ़ी है।',
      '{topic} में कोई शर्त नहीं।',
      'Limitless {topic} energy।',
    ],
    hg: [
      '{topic} first. Baaki sab baad mein.',
      'Jo samajhte hain, woh samajhte hain. {topic}.',
      'Apne {topic} journey pe loud bet.',
      'Koi permission nahi chahiye — bas {topic}.',
      'Apna {topic} game level up kar liya.',
      '{topic} ke liye jagah banao.',
      '{topic} is the plan. Full stop.',
      'Apne {topic} obsession ki maafin nahi mangungi.',
      'Entering my {topic} era — unapologetically.',
      'Built different, powered by {topic}.',
      'Main character, and {topic} is my arc.',
      'No permission needed — {topic} only.',
      'Limitless {topic} energy.',
      'Silent moves, loud {topic} results.',
    ],
  },
  inspirational: {
    en: [
      'Small steps in {topic} every day add up to big changes.',
      'The best time to start {topic} was yesterday. The next best time is now.',
      'Growth in {topic} is quiet, steady and yours.',
      'Every expert in {topic} started exactly where you are.',
      'Let your {topic} journey be the teacher.',
      'Consistency in {topic} beats intensity.',
      'Show up for your {topic} goals today — kindly, steadily.',
      'Your {topic} story is still being written — make it yours.',
      'The glow-up is ongoing — {topic} taught me that.',
      'Small steps, big {topic} dreams.',
      'Some chapters of {topic} deserve applause.',
      'Trust the {topic} timing.',
      'Growth looks good on you — like {topic} does.',
      'The story isn’t over — {topic} is the plot twist.',
    ],
    hi: [
      '{topic} में छोटे कदम ही बड़े बदलाव लाते हैं।',
      '{topic} शुरू करने का सबसे अच्छा समय था कल। दूसरा सबसे अच्छा है आज।',
      '{topic} में तरक्की चुपचाप और अपनी रफ़्तार से होती है।',
      'हर माहिर {topic} में ठीक वहीं से शुरू हुआ जहाँ तुम हो।',
      'अपने {topic} सफर को अपना शिक्षक बनने दो।',
      '{topic} में लगातार रहना, तीव्रता से बेहतर है।',
      'आज अपने {topic} लक्ष्यों के लिए हाज़िर रहो — प्यार और स्थिरता के साथ।',
      'तुम्हारी {topic} कहानी अभी लिखी जा रही है — इसे अपनी बनाओ।',
      'Glow-up जारी है — {topic} ने सिखाया।',
      'छोटे कदम, बड़े {topic} सपने।',
      '{topic} के कुछ पन्ने सलाम के हक़दार हैं।',
      'भरोसा रखो — {topic} की घड़ी सही है।',
      '{topic} जैसा बनना ही growth है।',
      'कहानी अधूरी है — {topic} ही असली twist है।',
    ],
    hg: [
      '{topic} mein chhote steps hi bade changes banate hain.',
      '{topic} shuru karne ka best time tha kal. Doosra best time hai abhi.',
      '{topic} mein growth quiet, steady aur apni hoti hai.',
      'Har {topic} expert theek wahan se shuru hua jahan tum ho.',
      'Apne {topic} journey ko apna teacher banne do.',
      '{topic} mein consistency, intensity se better hai.',
      'Aaj apne {topic} goals ke liye show up karo — kindly, steadily.',
      'Tumhari {topic} story abhi likhi ja rahi hai — apni banao.',
      'The glow-up is ongoing — {topic} ne sikhaya.',
      'Small steps, big {topic} dreams.',
      'Some chapters deserve applause — {topic} included.',
      'Trust the {topic} timing.',
      'Growth looks good on you — {topic} edition.',
      'The story is not over — {topic} is the plot twist.',
    ],
  },
  professional: {
    en: [
      '{topic}, handled with the same discipline I bring to every brief.',
      'Behind every strong {topic} result: process, feedback, iteration.',
      'Where {topic} meets intentional design.',
      'A closer look at how we approach {topic}.',
      'What {topic} actually demands — and what it gives back.',
      'Field notes from working in {topic}.',
      '{topic}, done deliberately.',
      'Case study in progress: {topic}.',
      'Where craft meets {topic} — every single day.',
      'Excellence in {topic}, delivered quietly.',
      'Documenting what great {topic} looks like.',
      'Process over noise — the {topic} edition.',
      'Every great {topic} story starts with showing up.',
      'Precision, patience and {topic}.',
    ],
    hi: [
      '{topic} — वही अनुशासन, जो मैं हर काम में लाता हूँ।',
      'हर बेहतरीन {topic} के पीछे: प्रक्रिया, फ़ीडबैक, सुधार।',
      'जहाँ {topic} सोच-समझकर होता है।',
      '{topic} को हम कैसे करते हैं — एक नज़दीक नज़र।',
      '{topic} से क्या माँगा जाता है — और क्या मिलता है।',
      '{topic} में काम करते हुए नोट्स।',
      '{topic} — जानबूझकर किया गया।',
      '{topic} — एक चलता हुआ केस स्टडी।',
      'जहाँ craft मिलता है {topic} से — हर दिन।',
      '{topic} में excellence, चुपचाप deliver।',
      'प्रक्रिया पर फोकस — {topic} edition।',
      'हर महान {topic} की शुरुआत showing up से होती है।',
      'Precision, patience और {topic}।',
      'जो {topic} करता है, वो याद रहता है।',
    ],
    hg: [
      '{topic} — wahi discipline jo main har brief mein laati hoon.',
      'Har strong {topic} result ke peeche: process, feedback, iteration.',
      'Jahan {topic} milta hai intentional design se.',
      'Hum {topic} ko kaise approach karte hain — ek close look.',
      '{topic} actually kya demand karta hai — aur kya wapas deta hai.',
      '{topic} mein kaam karte hue field notes.',
      '{topic}, done deliberately.',
      'Case study in progress: {topic}.',
      'Where craft meets {topic} — every single day.',
      'Excellence in {topic}, delivered quietly.',
      'Documenting what great {topic} looks like.',
      'Process over noise — the {topic} edition.',
      'Every great {topic} story starts with showing up.',
      'Precision, patience and {topic}.',
    ],
  },
  minimal: {
    en: [
      '{topic} — nothing else.',
      'Just {topic}.',
      'a quiet {topic} moment.',
      'Slow {topic}.',
      '{topic}, always.',
      'Less noise, more {topic}.',
      '{topic}, simply.',
      'One word: {topic}.',
      'just {topic}, literally.',
      'less {topic}, more living.',
      'quiet {topic}.',
      'ordinary {topic}, made special.',
      'just {topic}.',
      '{topic} — that’s it.',
    ],
    hi: [
      '{topic}, बस।',
      'शांत {topic}, बिना हल्ला।',
      'बस थोड़ा {topic}।',
      'धीमा {topic}।',
      'हमेशा {topic}।',
      'शोर कम, {topic} ज़्यादा।',
      '{topic}, सरलता से।',
      'एक शब्द: {topic}।',
      '{topic}।',
      'कम {topic}, ज़्यादा ज़िंदगी।',
      'बस {topic}।',
      'साधारण {topic}, खास लम्हा।',
      '{topic} — बस इतना ही।',
      'चुपचाप {topic}।',
    ],
    hg: [
      '{topic}, quietly.',
      'Bas {topic}.',
      '{topic}.',
      'Slow {topic}.',
      '{topic}, always.',
      'Noise kam, {topic} zyada.',
      '{topic}, simply.',
      'Ek word: {topic}.',
      '{topic}, with less noise.',
      'less {topic}, more living.',
      '{topic} — literally nothing else.',
      'simple {topic}.',
      'just {topic}.',
      'that’s it — {topic}.',
    ],
  },
  casual: {
    en: [
      'just vibes and {topic} honestly',
      'me: I’ll post one thing per week also me: {topic} every day',
      'living my {topic} life one day at a time',
      'today’s forecast: 100% chance of {topic}',
      'caught up in {topic} again',
      'random {topic} dump ✨',
      'sending {topic} energy your way',
      'dedicating this one to my {topic} era',
      'Just {topic}-ing around. No plans.',
      'Honestly? Just vibing with {topic}.',
      'Weekend forecast: 90% {topic}, 10% chaos.',
      'Low effort, high {topic}.',
      'Currently {topic}-ing, brb.',
      'Just me, myself and {topic}.',
    ],
    hi: [
      'बस {topic} और सुकून…',
      'मैं: हर हफ्ते एक पोस्ट, असली मैं: रोज़ाना {topic}',
      'अपनी {topic} वाली ज़िंदगी',
      'आज का मौसम: 100% {topic} की संभावना',
      'फिर से {topic} में डूब गया',
      'आज का {topic} पोस्ट ✨',
      'आप सबके लिए ढेर सारा {topic}!',
      'यह पोस्ट {topic} वाले दौर को समर्पित',
      'बस {topic} कर रहा हूँ — plan clear।',
      'Honestly? {topic} ही काफी है।',
      'Weekend forecast: 90% {topic}, 10% chaos।',
      'कम effort, ज़्यादा {topic}।',
      'अभी {topic} में डूबा हूँ, brb।',
      'सिर्फ मैं और {topic}।',
    ],
    hg: [
      'bas vibes aur {topic}, honestly',
      'me: hafta mein ek post, actual me: roz {topic}',
      'apni {topic} life, ek din at a time',
      'aaj ka forecast: 100% {topic} chance hai',
      'phir se {topic} mein caught up',
      'random {topic} dump ✨',
      'tumhe {topic} energy bhej rahi hoon',
      'ye ek shoutout mere {topic} era ko',
      'Bas {topic} kar raha hoon — no plans.',
      'Honestly? Just vibing with {topic}.',
      'Weekend forecast: 90% {topic}, 10% chaos.',
      'Low effort, high {topic}.',
      'brb — {topic} and chill.',
      'Just me aur {topic}.',
    ],
  },
  luxe: {
    en: [
      'Quiet luxury, loud {topic} taste.',
      'Old money energy, new {topic} obsession.',
      'Understated. Intentional. {topic}.',
      'The {topic} equivalent of a private jet.',
      'Discretion is the new {topic} flex.',
      'Timeless over trendy — {topic} included.',
      'Effortlessly {topic}.',
      'Subtle flex: {topic} done right.',
      'Quality you can feel, {topic} included.',
      'Less logos, more {topic}.',
      'The art of doing {topic} quietly.',
      'Expensive taste, homegrown {topic}.',
    ],
    hi: [
      'चुपचाप {topic} — शोर की कोई ज़रूरत नहीं।',
      'कम शब्दों में: {topic} ही काफ़ी है।',
      'तेहज़ीब के साथ {topic}।',
      'जो दिखता नहीं, वो महसूस होता है — {topic}।',
      'Perfect {topic} कभी दिखावा नहीं करता।',
      'क्लास अपनी जगह, {topic} अपनी जगह।',
      'कम बोलिए, {topic} बोलेगी।',
      'सदाबहार {topic} — बिना हल्ला-गुल्ला।',
      'क्वालिटी खुद बोलती है — {topic} में।',
      'एटीट्यूड की ज़रूरत नहीं, {topic} काफी है।',
    ],
    hg: [
      'Quiet luxury vibes — {topic} ka asli swag.',
      'Kam bolna, {topic} ka kaam bolta hai.',
      'Subtle flex: {topic}.',
      'Timeless {topic}, trend nahin.',
      'Classy se bhi aage — {topic}.',
      'Less logos, more {topic}.',
      'Effortless {topic} energy.',
      'Not loud, just {topic}.',
    ],
  },
};

const shuffle = <T>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export type CaptionCta = 'none' | 'follow' | 'link' | 'save' | 'share' | 'tag';

const CTA_LINES: Record<Language, Record<Exclude<CaptionCta, 'none'>, string>> = {
  en: {
    follow: 'Follow for more.',
    link: 'Link in bio.',
    save: 'Save this for later.',
    share: 'Share with someone who gets it.',
    tag: 'Tag a friend who needs this.',
  },
  hi: {
    follow: 'और भी के लिए फ़ॉलो करें।',
    link: 'लिंक बायो में है।',
    save: 'बाद के लिए सेव करें।',
    share: 'किसी ऐसे को शेयर करें जिसे समझ आए।',
    tag: 'किसी दोस्त को टैग करें।',
  },
  hg: {
    follow: 'Aur ke liye follow karo.',
    link: 'Link bio mein hai.',
    save: 'Baad ke liye save karke rakho.',
    share: 'Kisi samajhne wale ko share karo.',
    tag: 'Kisi dost ko tag karo jo ye samajhe.',
  },
};

export interface CaptionOptions {
  /** When false, emoji are stripped from the generated captions. */
  emoji?: boolean;
  /** Optional call-to-action appended as a final line. */
  cta?: CaptionCta;
}

const stripEmoji = (text: string): string =>
  text
    .replace(/[\u200D\uFE0F\u2600-\u27BF\u2B00-\u2BFF\u{1F000}-\u{1FAFF}]/gu, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

/** Exactly five unique captions for the chosen topic, tone and language. */
export function generateCaptions(
  topicId: TopicId,
  tone: CaptionTone,
  language: Language,
  options: CaptionOptions = {},
): string[] {
  const topic = TOPICS.find((item) => item.id === topicId) ?? TOPICS[0];
  const word = language === 'hi' ? topic.wordHi : language === 'hg' ? topic.wordHg : topic.wordEn;
  const templates = TEMPLATES[tone][language];
  const emojiOn = options.emoji ?? true;
  const cta = options.cta ?? 'none';

  return shuffle(templates)
    .slice(0, 5)
    .map((template) => {
      let caption = template.replaceAll('{topic}', word);
      if (!emojiOn) caption = stripEmoji(caption);
      caption = caption.trim();
      if (cta !== 'none') caption = `${caption}\n${CTA_LINES[language][cta]}`;
      return caption;
    });
}
