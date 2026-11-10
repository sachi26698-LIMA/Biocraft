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
  wordEn: string;
  wordHi: string;
}

export const TOPICS: Topic[] = [
  { id: 'photography', labelEn: 'Photography', labelHi: 'फोटोग्राफी', wordEn: 'photography', wordHi: 'फोटोग्राफी' },
  { id: 'food', labelEn: 'Food', labelHi: 'खाना', wordEn: 'food', wordHi: 'खाना' },
  { id: 'fashion', labelEn: 'Fashion', labelHi: 'फैशन', wordEn: 'fashion', wordHi: 'फैशन' },
  { id: 'travel', labelEn: 'Travel', labelHi: 'यात्रा', wordEn: 'travel', wordHi: 'यात्रा' },
  { id: 'fitness', labelEn: 'Fitness', labelHi: 'फिटनेस', wordEn: 'fitness', wordHi: 'फिटनेस' },
  { id: 'beauty', labelEn: 'Beauty', labelHi: 'ब्यूटी', wordEn: 'beauty', wordHi: 'ब्यूटी' },
  { id: 'tech', labelEn: 'Tech & Coding', labelHi: 'टेक', wordEn: 'tech', wordHi: 'तकनीक' },
  { id: 'music', labelEn: 'Music', labelHi: 'संगीत', wordEn: 'music', wordHi: 'संगीत' },
  { id: 'art', labelEn: 'Art', labelHi: 'कला', wordEn: 'art', wordHi: 'कला' },
  { id: 'books', labelEn: 'Books', labelHi: 'किताब', wordEn: 'books', wordHi: 'किताब' },
  { id: 'business', labelEn: 'Business', labelHi: 'बिज़नेस', wordEn: 'business', wordHi: 'बिज़नेस' },
  { id: 'comedy', labelEn: 'Comedy & Memes', labelHi: 'कॉमेडी', wordEn: 'comedy', wordHi: 'कॉमेडी' },
];

export type CaptionTone =
  | 'witty'
  | 'aesthetic'
  | 'bold'
  | 'inspirational'
  | 'casual'
  | 'professional'
  | 'minimal';

export const TONES: Array<{ id: CaptionTone; label: string }> = [
  { id: 'casual', label: 'Casual' },
  { id: 'professional', label: 'Professional' },
  { id: 'witty', label: 'Funny' },
  { id: 'inspirational', label: 'Inspirational' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'aesthetic', label: 'Aesthetic' },
  { id: 'bold', label: 'Bold' },
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
    ],
  },
  minimal: {
    en: [
      '{topic}, quietly.',
      'Just {topic}.',
      '{topic}.',
      'Slow {topic}.',
      '{topic}, always.',
      'Less noise, more {topic}.',
      '{topic}, simply.',
      'One word: {topic}.',
    ],
    hi: [
      '{topic}, बस।',
      'चुपचाप {topic}।',
      '{topic}।',
      'धीमा {topic}।',
      'हमेशा {topic}।',
      'शोर कम, {topic} ज़्यादा।',
      '{topic}, सरलता से।',
      'एक शब्द: {topic}।',
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
  const word = language === 'hi' ? topic.wordHi : topic.wordEn;
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
