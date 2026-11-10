/**
 * Curated hashtag pools for the Hashtag Generator.
 *
 * 12 niches x English/Hindi x three reach buckets:
 *   broad   — high-volume, high competition
 *   medium  — topical, established communities
 *   focused — specific, lower competition
 *
 * Hindi pools use Devanagari tags (Instagram indexes Devanagari hashtags) plus
 * widely used romanised tags. No volume numbers are claimed anywhere — volume
 * changes constantly and this file makes no reach predictions.
 */

export type Bucket = 'broad' | 'medium' | 'focused';
export type Language = 'en' | 'hi';

export interface NicheDefinition {
  id: string;
  labelEn: string;
  labelHi: string;
  pools: Record<Language, Record<Bucket, string[]>>;
}

export const NICHES: NicheDefinition[] = [
  {
    id: 'photography',
    labelEn: 'Photography',
    labelHi: 'फोटोग्राफी',
    pools: {
      en: {
        broad: ['#photography', '#photooftheday', '#photographyoftheday', '#picoftheday', '#portrait', '#streetphotography', '#naturephotography', '#landscapephotography', '#photographer', '#photo', '#portraitpage', '#moodygrams', '#photographyeveryday', '#lifestylephotography'],
        medium: ['#portraitphotography', '#portraitphotographer', '#travelphotographer', '#streetphoto', '#portraiture', '#photographersofinstagram', '#photographyislife', '#natgeo', '#portraitcollective', '#35mmcommunity', '#portraitgallery', '#filmphotography'],
        focused: ['#50mmlens', '#naturalight', '#ishootfilm', '#makeportraits', '#35mmfilm', '#portraitmood', '#primelens', '#shootingfilm', '#filmcommunity', '#filmisnotdead', '#shootfilmmag'],
      },
      hi: {
        broad: ['#फोटोग्राफी', '#फोटो', '#तस्वीर', '#शटर', '#छायांकन', '#फोटोग्राफीइंडिया', '#कैमरा', '#फोटोग्राफीलव', '#क्लिक', '#फोटोज'],
        medium: ['#पोर्ट्रेट', '#ट्रैवलफोटोग्राफी', '#स्ट्रिटफोटोग्राफी', '#फोटोग्राफीऑफदीडे', '#नैचुरललाइट', '#फोटोऑफदीडे', '#शादीफोटोग्राफी', '#प्रोडक्टफोटोग्राफी', '#कॉन्सेप्टफोटोग्राफी', '#फैशनफोटोग्राफर'],
        focused: ['#फिल्मफोटोग्राफी', '#35एमएम', '#प्राइमलेंस', '#पोट्रेटफोटोग्राफी', '#ब्लैकएंडव्हाइटफोटो', '#मोनोक्रोम', '#50एमएम', '#नेचुरललाइटफोटोग्राफी', '#फिल्मफोटोग्राफर', '#फोटोग्राफीवर्कशॉप'],
      },
    },
  },
  {
    id: 'food',
    labelEn: 'Food',
    labelHi: 'खाना',
    pools: {
      en: {
        broad: ['#food', '#foodie', '#foodporn', '#instafood', '#yummy', '#delicious', '#foodphotography', '#foodlover', '#foodiesofinstagram', '#khana', '#deliciousfood', '#nomnom', '#foodielife', '#kitchenmagic'],
        medium: ['#instafoodie', '#foodstagram', '#homemadefood', '#foodblogger', '#foodgasm', '#foodstyling', '#foodieheaven', '#foodiegram', '#foodpics', '#foodaddict', '#buzzfeast', '#nomnomsies'],
        focused: ['#streetfoodindia', '#indiansweets', '#swaad', '#homecooking', '#indianfoodblog', '#indiansnacks', '#regionalfood', '#desi', '#gujaratifood', '#southindianfood', '#bengalifood'],
      },
      hi: {
        broad: ['#खाना', '#खानेशौकीन', '#फूड', '#स्वाद', '#देसीखाना', '#भारतीयभोजन', '#भोजन', '#खानाखाना', '#फूडली', '#स्नैक्स'],
        medium: ['#स्ट्रीटफूड', '#घरकाखाना', '#भारतीयरेसिपी', '#इंडियनफूड', '#खानाप्यारा', '#खानेकादीवाना', '#बिरयानी', '#टिक्का', '#मीठा', '#पंजाबीफूड'],
        focused: ['#स्ट्रीटफूडइंडिया', '#इंडियनस्ट्रीटफूड', '#घरपकवान', '#मिठाई', '#स्वादयात्रा', '#देसीफूड', '#सैंडविच', '#चाट', '#दाल', '#नाश्ता'],
      },
    },
  },
  {
    id: 'fashion',
    labelEn: 'Fashion',
    labelHi: 'फैशन',
    pools: {
      en: {
        broad: ['#fashion', '#style', '#ootd', '#instafashion', '#fashionblogger', '#fashionista', '#outfit', '#styleinspo', '#fashionlover', '#ootdinspiration', '#fashiondiaries', '#ootdshare', '#whatiworetoday', '#stylegoals'],
        medium: ['#streetstyle', '#fashionstyle', '#whatiwore', '#currentlywearing', '#styleblogger', '#fashiongram', '#instastyle', '#outfitoftheday', '#vintagefashion', '#minimalistfashion', '#fashionforall', '#indianfashionblogger'],
        focused: ['#sustainablefashion', '#slowfashion', '#indianfashion', '#handloom', '#sareelove', '#ethnicwear', '#indianstyle', '#indiandesigner', '#chanderi', '#blockprint', '#bandhej', '#kalamkari'],
      },
      hi: {
        broad: ['#फैशन', '#स्टाइल', '#फैशनिस्टा', '#आउटफिट', '#ओटीडी', '#इंडियनफैशन', '#वस्त्र', '#वेस्टर्नवेयर', '#कुर्ती', '#भारतीयफैशन'],
        medium: ['#एथनिक', '#साड़ी', '#इंडियनस्टाइल', '#देसीफैशन', '#फैशनब्लॉगर', '#आउटफिटऑफदीडे', '#लहंगा', '#कुर्तीसेट', '#एथनिकलुक', '#हैंडलूम'],
        focused: ['#कढ़ाई', '#हथकरघा', '#साड़ीलव', '#एथनिकवियर', '#इंडियनफैशनब्लॉग', '#स्लोफैशन', '#पोचमपल्ली', '#बनारस', '#बनारसीसाड़ी', '#चिकनकारी'],
      },
    },
  },
  {
    id: 'travel',
    labelEn: 'Travel',
    labelHi: 'यात्रा',
    pools: {
      en: {
        broad: ['#travel', '#wanderlust', '#travelphotography', '#travelgram', '#instatravel', '#traveltheworld', '#travelblogger', '#tourism', '#exploretheworld', '#traveling', '#travellife', '#wheretonext', '#wanderer', '#tourtheplanet'],
        medium: ['#traveller', '#travelholic', '#traveldiaries', '#traveladdict', '#traveljunkie', '#exploremore', '#travelculture', '#travelling', '#solotravel', '#backpacking', '#passportready', '#travelwithme'],
        focused: ['#indiatravel', '#incredibleindia', '#travelinindia', '#offbeattravel', '#indiatourism', '#wanderindia', '#traveltoindia', '#roadtripindia', '#kashmir', '#meghalaya', '#sikkim'],
      },
      hi: {
        broad: ['#यात्रा', '#भ्रमण', '#पर्यटन', '#घूमनेकीआदत', '#यात्राडायरीज', '#सफ़र', '#टूरिज़्म', '#यात्राप्रेमी', '#पर्यटनस्थल', '#ट्रेकिंग'],
        medium: ['#ट्रेवलइंडिया', '#भारतीयपर्यटन', '#घूमनाहैतो', '#सफ़रनामा', '#मैंघूमनेनिकला', '#घूमनेकाशौक', '#मनाली', '#गोवा', '#राजस्थान', '#केरल'],
        focused: ['#भारतभ्रमण', '#भारतयात्रा', '#ऑफबीटइंडिया', '#ट्रेकइंडिया', '#रोडट्रिपइंडिया', '#भारतपर्यटन', '#लेहलद्दाख', '#स्पीतिवैली', '#महाबलीपुरम', '#काशी'],
      },
    },
  },
  {
    id: 'fitness',
    labelEn: 'Fitness',
    labelHi: 'फिटनेस',
    pools: {
      en: {
        broad: ['#fitness', '#gym', '#workout', '#fit', '#fitnessmotivation', '#training', '#gymlife', '#exercise', '#fitfam', '#fitlife', '#gains', '#fitspo', '#healthyliving'],
        medium: ['#fitnessjourney', '#workoutmotivation', '#bodybuilding', '#strengthtraining', '#fitnesslifestyle', '#gymmotivation', '#traininghard', '#fitnessfreak', '#workoutroutine', '#strongeryou', '#gymtime', '#sweat'],
        focused: ['#homeworkout', '#calisthenics', '#fitindia', '#yogaeverywhere', '#indianfitness', '#functionaltraining', '#homefitness', '#fitindiamovement', '#powerlifting', '#barbellclub', '#yogajourney'],
      },
      hi: {
        broad: ['#फिटनेस', '#जिम', '#वर्कआउट', '#सेहत', '#फिट', '#वर्कआउटमोटिवेशन', '#कसरत', '#हेल्दीलाइफ', '#स्ट्रेंथ', '#फिटलाइफ'],
        medium: ['#फिटनेसजर्नी', '#जिमलाइफ', '#व्यायाम', '#फिटनेसमोटिवेशन', '#बॉडीबिल्डिंग', '#वेटलिफ्टिंग', '#रनिंग', '#कार्डियो', '#मांसपेशी', '#फिटनेसइंडिया'],
        focused: ['#होमवर्कआउट', '#योग', '#फिटइंडिया', '#होमजिम', '#स्ट्रेंथट्रेनिंग', '#भारतीयफिटनेस', '#क्रॉसफिट', '#योगअभ्यास', '#फैटलॉस', '#फिटलाइफइंडिया'],
      },
    },
  },
  {
    id: 'beauty',
    labelEn: 'Beauty',
    labelHi: 'ब्यूटी',
    pools: {
      en: {
        broad: ['#beauty', '#makeup', '#skincare', '#beautyblogger', '#makeuptutorial', '#mua', '#instamakeup', '#glowup', '#selfcare', '#beautycare', '#beautytips', '#skincaretips', '#makeuptips'],
        medium: ['#makeupoftheday', '#skinregimen', '#skincareroutine', '#beautyaddict', '#makeupaddict', '#beautygram', '#makeuplover', '#beautyroutine', '#makeuptransformation', '#nomakeup', '#lipswatch', '#eyemakeup'],
        focused: ['#indianbeauty', '#indianmakeup', '#desibeauty', '#indianbridal', '#indianmakeupartist', '#naturalmakeuplook', '#indianbeautyblog', '#everydaymakeup', '#khadiproducts', '#ayurvedicskincare', '#sandalwood'],
      },
      hi: {
        broad: ['#ब्यूटी', '#मेकअप', '#स्किनकेयर', '#सुंदरता', '#ब्यूटीब्लॉगर', '#ग्लोअप', '#ग्लो', '#मेकअपआर्टिस्ट', '#स्किनकेयरटिप्स', '#स्किन'],
        medium: ['#मेकअपट्यूटोरियल', '#स्किनकेयररूटीन', '#ब्यूटीटिप्स', '#इंडियनमेकअप', '#ग्लोइंगस्किन', '#ब्यूटीकेयर', '#लिपस्टिक', '#आईमेकअप', '#बेसमेकअप', '#फाउंडेशन'],
        focused: ['#ब्राइडलमेकअप', '#इंडियनब्यूटी', '#देसीब्यूटी', '#इंडियनस्किनकेयर', '#हिंदीब्यूटी', '#नेचुरलमेकअप', '#आयुर्वेदिकस्किनकेयर', '#नेचुरलस्किन', '#आयुर्वेद', '#हर्बलब्यूटी'],
      },
    },
  },
  {
    id: 'tech',
    labelEn: 'Tech & Coding',
    labelHi: 'टेक और कोडिंग',
    pools: {
      en: {
        broad: ['#tech', '#technology', '#coding', '#programmer', '#developer', '#programming', '#software', '#innovation', '#codinglife', '#techcommunity', '#techlife', '#codejourney', '#programminglife', '#softwareengineer'],
        medium: ['#webdevelopment', '#javascript', '#python', '#codersofinstagram', '#codeeveryday', '#developerlife', '#techie', '#fullstackdeveloper', '#learntocode', '#codingbootcamp', '#datascience'],
        focused: ['#reactjs', '#typescript', '#buildinpublic', '#frontenddeveloper', '#indiatech', '#indiehacker', '#codeforeveryone', '#startuptech', '#reactnative', '#nextjs', '#tailwindcss', '#graphql'],
      },
      hi: {
        broad: ['#टेक्नोलॉजी', '#कोडिंग', '#डेवलपर', '#प्रोग्रामिंग', '#तकनीक', '#टेक', '#कंप्यूटर', '#सॉफ्टवेयर', '#ऐप', '#गेमिंग'],
        medium: ['#जावास्क्रिप्ट', '#पायथन', '#वेबडेवलपमेंट', '#कोडर्स', '#डेवलपरलाइफ', '#कोडिंगइंडिया', '#वेबडिजाइन', '#ऐपडेवलपमेंट', '#डेटासाइंस', '#एआई'],
        focused: ['#इंडियनडेवलपर', '#हिंदीटेक्नोलॉजी', '#टेकइंडिया', '#फ्रंटेंड', '#बिल्डइनपब्लिक', '#रिएक्टजेएस', '#नेक्स्टजेएस', '#टाइपस्क्रिप्ट', '#नोडजेएस', '#देवऑप्स'],
      },
    },
  },
  {
    id: 'music',
    labelEn: 'Music',
    labelHi: 'संगीत',
    pools: {
      en: {
        broad: ['#music', '#musician', '#singer', '#song', '#musicproducer', '#musiclover', '#newmusic', '#indiansinger', '#instamusic', '#musictherapy', '#musicislife', '#playlist', '#musiclovers', '#goodmusic'],
        medium: ['#musiclife', '#originalmusic', '#indipop', '#musicproduction', '#singing', '#independentmusic', '#musicianlife', '#songwriter', '#acoustic', '#randbmusic', '#indiemusic'],
        focused: ['#indiemusicindia', '#hindimusic', '#livemusicindia', '#originalsong', '#classicalmusicindia', '#hindustaniclassical', '#livemusic', '#carnaticmusic', '#qawwali', '#sufi'],
      },
      hi: {
        broad: ['#संगीत', '#गाना', '#गायक', '#हिन्दीगीत', '#बॉलीवुड', '#म्यूजिक', '#धुन', '#गीत', '#म्यूजिकवीडियो', '#बॉलीवुडगाना'],
        medium: ['#हिंदीगाना', '#इंडीपॉप', '#संगीतकार', '#सिंगरलाइफ', '#गानाप्रैक्टिस', '#लोफाई', '#हिपहोप', '#रैप', '#गायन', '#म्यूजिकलाइफ'],
        focused: ['#हिंदुस्तानीसंगीत', '#लाइवसंगीत', '#इंडीम्यूज़िक', '#हिंदीरॉक', '#क्लासिकलसंगीत', '#सुर', '#हिंदीरैप', '#फ्यूजनसंगीत', '#लॉफाईहिंदी', '#मधुर'],
      },
    },
  },
  {
    id: 'art',
    labelEn: 'Art & Illustration',
    labelHi: 'कला',
    pools: {
      en: {
        broad: ['#art', '#artist', '#illustration', '#drawing', '#artwork', '#painting', '#sketch', '#instart', '#artoftheday', '#artistsoninstagram', '#drawdaily', '#artstagram', '#doodle', '#illustrationart'],
        medium: ['#watercolor', '#sketchbook', '#digitalart', '#drawingoftheday', '#artcommunity', '#paintingoftheday', '#artistlife', '#illustratorsofinstagram', '#traditionalart', '#mixedmedia', '#pencilsketch', '#portraitartists'],
        focused: ['#indianart', '#mandalaart', '#artindia', '#folkartindia', '#indianillustration', '#modernindianart', '#artbharat', '#madhubaniart', '#tanjorepainting', '#pattachitra', '#kala'],
      },
      hi: {
        broad: ['#कला', '#कलाकार', '#पेंटिंग', '#ड్రాइंग', '#आर्ट', '#आर्टवर्क', '#चित्रकला', '#कैनवास', '#पेनसीलस्केच', '#कलाप्रेमी'],
        medium: ['#वॉटरकलर', '#डिजिटलआर्ट', '#स्केचबुक', '#चित्रकारी', '#चित्रांकन', '#ऑयलपेंटिंग', '#एक्रिलिकपेंटिंग', '#चरकोल', '#पास्टल', '#आर्टकम्युनिटी'],
        focused: ['#भारतीयकला', '#लोककला', '#मंडला', '#इंडियनइलस्ट्रेशन', '#वारली', '#हिंदीआर्ट', '#मिनिएचरपेंटिंग', '#तंजोरपेंटिंग', '#कलमकारी', '#पित्तौरा'],
      },
    },
  },
  {
    id: 'books',
    labelEn: 'Books & Reading',
    labelHi: 'किताबें',
    pools: {
      en: {
        broad: ['#books', '#bookstagram', '#reading', '#booklover', '#reader', '#booksofinstagram', '#bookworm', '#currentlyreading', '#bibliophile', '#readinglist', '#readingtime', '#booklife', '#whatireading', '#chapters'],
        medium: ['#bookstagramindia', '#bookaholic', '#readingcommunity', '#bookreview', '#booknerd', '#bookish', '#bookishthings', '#amreading', '#bookstack', '#bookhoarder', '#wordsmatter'],
        focused: ['#indianauthors', '#indianliterature', '#hindinovel', '#bookstagrambharat', '#indianbookstagram', '#sammanbooks', '#pustak', '#sahitya', '#tamilbooks', '#bengalibooks', '#marathibooks', '#malayalambooks'],
      },
      hi: {
        broad: ['#किताबें', '#पठन', '#रीडिंग', '#बुक', '#साहित्य', '#पढ़नेकीआदत', '#उपन्यास', '#कविता', '#कहानी', '#ऑडियोबुक'],
        medium: ['#किताबप्रेमी', '#पढ़ना', '#साहित्यिक', '#बुक्स', '#किताबोंकीदुनिया', '#पढ़तेरहिए', '#हिंदीलेखक', '#कहानीकार', '#कवितापाठ', '#पुस्तकचक्र'],
        focused: ['#हिंदीसाहित्य', '#हिन्दीउपन्यास', '#भारतीयसाहित्य', '#पुस्तकमेला', '#बुकक्लब', '#साहित्यप्रेमी', '#छायावाद', '#प्रेमचंद', '#उपन्याससमीक्षा', '#हिंदीपुस्तक'],
      },
    },
  },
  {
    id: 'business',
    labelEn: 'Business',
    labelHi: 'बिज़नेस',
    pools: {
      en: {
        broad: ['#business', '#entrepreneur', '#entrepreneurship', '#startup', '#smallbusiness', '#businessowner', '#success', '#hustle', '#motivation', '#businessgrowth', '#startupmindset', '#bizowner', '#ceo'],
        medium: ['#startups', '#entrepreneurlife', '#smallbusinessowner', '#businessstrategy', '#founder', '#businessmindset', '#startuplife', '#entrepreneurtips', '#businesstips', '#marketingtips', '#digitalmarketing'],
        focused: ['#startupindia', '#indiastartups', '#madeinindia', '#smallbusinessindia', '#indianentrepreneurs', '#vocalforlocal', '#indalbusiness', '#gharkebusiness', '#digitalindia', '#d2c', '#kirana'],
      },
      hi: {
        broad: ['#बिज़नेस', '#स्टार्टअप', '#उद्यमी', '#व्यवसाय', '#सफलता', '#बिजनेस', '#व्यापार', '#दुकान', '#पैसा', '#खुदकाबिजनेस'],
        medium: ['#स्टार्टअपइंडिया', '#लघुउद्योग', '#बिज़नेसटिप्स', '#उद्यमिता', '#बिजनेसग्रोथ', '#ईकामर्स', '#मार्केटिंग', '#दुकानदार', '#कस्टमर', '#बिज़नेसस्ट्रैटेजी'],
        focused: ['#भारतीयस्टार्टअप', '#वोकलफॉरलोकल', '#छोटेबिजनेस', '#भारतीयउद्यमी', '#स्टार्टअपभारत', '#स्वदेशी', '#ईकामर्सइंडिया', '#डिजिटलमार्केटिंग', '#स्टार्टअपफाउंडर', '#एमएसएमई'],
      },
    },
  },
  {
    id: 'comedy',
    labelEn: 'Comedy & Memes',
    labelHi: 'कॉमेडी और मीम्स',
    pools: {
      en: {
        broad: ['#comedy', '#memes', '#meme', '#funny', '#memeoftheday', '#lol', '#memeindia', '#humor', '#funnyvideos', '#instamemes', '#relatable', '#laughs', '#comedyreels'],
        medium: ['#funnymemes', '#memesdaily', '#memesoftheday', '#memepage', '#memehumor', '#indianmemes', '#memelover', '#hilarious', '#standupcomedy', '#desimemes', '#dankmemes'],
        focused: ['#hindicomedy', '#hinglishmemes', '#desihumour', '#memebharat', '#openmicindia', '#micnight', '#poetryslams', '#देसीमीम'],
      },
      hi: {
        broad: ['#कॉमेडी', '#मीम्स', '#मज़ाकिया', '#हंसाना', '#हास्य', '#मजेदार', '#मजाक', '#व्यंग्य', '#चुटकुला', '#ठहाका'],
        medium: ['#मीमइंडिया', '#हंसी', '#हिंदीकॉमेडी', '#मीम्सऑफदीडे', '#मीमपेज', '#कमालमीम', '#स्टैंडअप', '#स्टैंडअपकॉमेडी', '#व्यंग्यकार', '#स्टैंडअपनाइट'],
        focused: ['#देसीमीम्स', '#हिंग्लिशमीम्स', '#वायरलमीम्स', '#हिंदीमीम्स', '#कॉमेडीस्केच', '#मीमभारत', '#देसीव्यंग्य', '#इंटरनेटमीम', '#राजनीतिव्यंग्य', '#व्हाट्सएपफॉरवर्ड'],
      },
    },
  },
];

export const HASHTAG_NICHES = NICHES;

const findNiche = (id: string): NicheDefinition =>
  NICHES.find((niche) => niche.id === id) ?? NICHES[0];

/** Chars allowed in a hashtag token (Unicode letters, digits). */
const TOKEN_PATTERN = /^[\p{L}\p{N}\p{M}][\p{L}\p{N}\p{M}]{1,59}$/u;

/** Splits a free-form keyword field into hashtag-safe tokens. */
export function keywordTokens(raw: string): string[] {
  return raw
    .split(/[\s,;]+/)
    .map((token) => token.replace(/^#+/, '').replace(/[^\p{L}\p{N}\p{M}]/gu, ''))
    .filter((token) => TOKEN_PATTERN.test(token));
}

/** Rule-based variants for a single keyword token. */
export function keywordVariants(token: string): string[] {
  const base = token.toLowerCase();
  return [
    `#${base}`,
    `#${base}life`,
    `#${base}daily`,
    `#${base}lover`,
    `#${base}vibes`,
    `#${base}india`,
  ];
}

const shuffle = <T>(items: T[]): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export type HashtagSize = 10 | 20 | 30;

/** broad/medium/focused mix per result size. */
const SIZE_MIX: Record<HashtagSize, [number, number, number]> = {
  10: [3, 3, 4],
  20: [6, 7, 7],
  30: [9, 10, 11],
};

export interface HashtagResult {
  tags: string[];
  /** Tags derived from the user's own keywords (shown first). */
  fromKeywords: number;
}

/**
 * Builds a deduplicated hashtag set: keyword variants first (most relevant),
 * then shuffled pool fills per size bucket. Every run re-samples, so
 * regenerate produces a genuinely different set.
 */
export function generateHashtags(
  nicheId: string,
  language: Language,
  size: HashtagSize,
  rawKeywords: string,
): HashtagResult {
  const niche = findNiche(nicheId);
  const [needBroad, needMedium, needFocused] = SIZE_MIX[size];

  const seen = new Set<string>();
  const tags: string[] = [];
  const push = (tag: string) => {
    const key = tag.toLowerCase();
    if (seen.has(key) || tags.length >= size) return false;
    seen.add(key);
    tags.push(tag);
    return true;
  };

  // 1) User keywords first — most relevant by definition.
  for (const token of keywordTokens(rawKeywords)) {
    for (const variant of keywordVariants(token)) push(variant);
  }
  const fromKeywords = tags.length;

  // 2) Pool fills per bucket.
  const takeFrom = (bucket: Bucket, count: number) => {
    const pool = shuffle(niche.pools[language][bucket]);
    let taken = 0;
    for (const tag of pool) {
      if (taken >= count || tags.length >= size) break;
      if (push(tag)) taken += 1;
    }
  };
  takeFrom('broad', needBroad);
  takeFrom('medium', needMedium);
  takeFrom('focused', needFocused);

  // 3) Backstop: top up from other buckets if any ran dry after dedupe.
  for (const bucket of ['focused', 'medium', 'broad'] as Bucket[]) {
    for (const tag of shuffle(niche.pools[language][bucket])) {
      if (tags.length >= size) break;
      push(tag);
    }
    if (tags.length >= size) break;
  }

  return { tags, fromKeywords };
}
