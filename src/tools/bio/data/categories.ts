import type { Language } from '../../../types';

export interface CategoryContent {
  /** Button/card label, fully translated. */
  label: string;
  /** Role/identity variants used inside generated bios. */
  roles: string[];
  /** Niche topics used inside generated bios. */
  niches: string[];
}

export interface Category {
  id: string;
  /** Emoji used inside generated bios when the emoji option is on. */
  emojis: string[];
  en: CategoryContent;
  hi: CategoryContent;
  /** Hinglish (Latin-script Hindi). */
  hg: CategoryContent;
}

export const CATEGORIES: Category[] = [
  {
    id: 'creator',
    emojis: ['🎬', '✨', '📱'],
    en: {
      label: 'Content Creator',
      roles: ['Content Creator', 'Digital Creator', 'Creator', 'Video Creator'],
      niches: ['Lifestyle', 'Daily vlogs', 'Reels', 'YouTube', 'Storytelling', 'Everyday life'],
    },
    hi: {
      label: 'कंटेंट क्रिएटर',
      roles: ['कंटेंट क्रिएटर', 'डिजिटल क्रिएटर', 'क्रिएटर', 'वीडियो क्रिएटर'],
      niches: ['लाइफस्टाइल', 'डेली व्लॉग्स', 'रील्स', 'कहानी', 'रोज़मर्रा की ज़िंदगी', 'क्रिएटिविटी'],
    },
    hg: {
      label: 'Content Creator',
      roles: ['Content Creator', 'Digital Creator', 'Creator', 'Video Creator'],
      niches: ['Lifestyle', 'Daily vlogging', 'Reels', 'YouTube', 'Storytelling', 'Everyday life'],
    },
  },
  {
    id: 'photographer',
    emojis: ['📷', '🎞️', '🌅'],
    en: {
      label: 'Photographer',
      roles: ['Photographer', 'Photo Artist', 'Visual Storyteller', 'Portrait Photographer'],
      niches: ['Portraits', 'Street photography', 'Travel photography', 'Weddings', 'Landscapes', 'Candid captures'],
    },
    hi: {
      label: 'फोटोग्राफर',
      roles: ['फोटोग्राफर', 'विज़ुअल स्टोरीटेलर', 'पोट्रेट फोटोग्राफर', 'फोटो आर्टिस्ट'],
      niches: ['पोट्रेट', 'स्ट्रीट फोटोग्राफी', 'ट्रैवल फोटोग्राफी', 'शादी की फोटोग्राफी', 'लैंडस्केप', 'कैंडिड फ़्रेम्स'],
    },
    hg: {
      label: 'Photographer',
      roles: ['Photographer', 'Photo Artist', 'Visual Storyteller', 'Portrait Photographer'],
      niches: ['Portraits', 'Street photography', 'Travel photography', 'Weddings', 'Landscapes', 'Candid clicks'],
    },
  },
  {
    id: 'travel',
    emojis: ['✈️', '🏔️', '🌍'],
    en: {
      label: 'Travel Blogger',
      roles: ['Travel Blogger', 'Wanderer', 'Travel Storyteller', 'Explorer'],
      niches: ['Solo travel', 'Budget travel', 'Mountains', 'Hidden gems', 'Travel guides', 'Offbeat destinations'],
    },
    hi: {
      label: 'ट्रैवल ब्लॉगर',
      roles: ['ट्रैवल ब्लॉगर', 'घुमक्कड़', 'ट्रैवल स्टोरीटेलर', 'एक्सप्लोरर'],
      niches: ['सोलो ट्रैवल', 'बजट ट्रैवल', 'पहाड़', 'छुपी हुई जगहें', 'ट्रैवल गाइड', 'ऑफ़बीट जगहें'],
    },
    hg: {
      label: 'Travel Blogger',
      roles: ['Travel Blogger', 'Wanderer', 'Travel Storyteller', 'Explorer'],
      niches: ['Solo travel', 'Budget travel', 'Mountains', 'Hidden gems', 'Travel guides', 'Offbeat destinations'],
    },
  },
  {
    id: 'fitness',
    emojis: ['💪', '🏋️', '🔥'],
    en: {
      label: 'Fitness Coach',
      roles: ['Fitness Coach', 'Certified Trainer', 'Strength Coach', 'Wellness Coach'],
      niches: ['Strength training', 'Weight loss', 'Muscle building', 'Home workouts', 'Nutrition', 'Yoga and flexibility'],
    },
    hi: {
      label: 'फ़िटनेस कोच',
      roles: ['फ़िटनेस कोच', 'सर्टिफ़ाइड ट्रेनर', 'स्ट्रेंग्थ कोच', 'वेलनेस कोच'],
      niches: ['स्ट्रेंग्थ ट्रेनिंग', 'वज़न कम करना', 'मसल बनाना', 'होम वर्कआउट', 'न्यूट्रिशन', 'योग'],
    },
    hg: {
      label: 'Fitness Coach',
      roles: ['Fitness Coach', 'Trainer', 'Strength Coach', 'Wellness Coach'],
      niches: ['Workout routines', 'Healthy recipes', 'Strength training', 'Home workouts', 'Yoga', 'Fitness motivation'],
    },
  },
  {
    id: 'food',
    emojis: ['🍲', '🍜', '🍰'],
    en: {
      label: 'Food Blogger',
      roles: ['Food Blogger', 'Foodie', 'Home Chef', 'Food Reviewer'],
      niches: ['Street food', 'Home cooking', 'Restaurant reviews', 'Indian cuisine', 'Desserts', 'Easy recipes'],
    },
    hi: {
      label: 'फ़ूड ब्लॉगर',
      roles: ['फ़ूड ब्लॉगर', 'फूडी', 'होम शेफ़', 'खाने के शौक़ीन'],
      niches: ['स्ट्रीट फ़ूड', 'घर का खाना', 'रेस्तरां रिव्यू', 'देसी स्वाद', 'मिठाइयाँ', 'आसान रेसिपी'],
    },
    hg: {
      label: 'Food Blogger',
      roles: ['Food Blogger', 'Home Chef', 'Foodie', 'Recipe Creator'],
      niches: ['Home recipes', 'Street food', 'South Indian food', 'Desserts', 'Healthy eating', 'Regional cuisine'],
    },
  },
  {
    id: 'fashion',
    emojis: ['👗', '🕶️', '✨'],
    en: {
      label: 'Fashion Creator',
      roles: ['Fashion Creator', 'Style Blogger', 'Stylist', 'Fashion Enthusiast'],
      niches: ['Ethnic wear', 'Street style', 'Thrift fashion', 'Festive looks', 'Wardrobe basics', 'Styling tips'],
    },
    hi: {
      label: 'फ़ैशन क्रिएटर',
      roles: ['फ़ैशन क्रिएटर', 'स्टाइल ब्लॉगर', 'स्टाइलिस्ट', 'फ़ैशन एन्थूज़िएस्ट'],
      niches: ['एथनिक वियर', 'स्ट्रीट स्टाइल', 'थ्रिफ्ट फ़ैशन', 'फ़ेस्टिव लुक्स', 'वॉर्डरोब बेसिक्स', 'स्टाइलिंग टिप्स'],
    },
    hg: {
      label: 'Fashion Blogger',
      roles: ['Fashion Blogger', 'Style Creator', 'OOTD Lover', 'Ethnic Fashion'],
      niches: ['Everyday style', 'Ethnic wear', 'Street style', 'Sustainable fashion', 'Budget fashion', 'Styling tips'],
    },
  },
  {
    id: 'music',
    emojis: ['🎵', '🎤', '🎶'],
    en: {
      label: 'Musician',
      roles: ['Musician', 'Singer-Songwriter', 'Cover Artist', 'Music Producer'],
      niches: ['Bollywood covers', 'Indie music', 'Unplugged sessions', 'Lyrics', 'New releases', 'Live performances'],
    },
    hi: {
      label: 'संगीतकार',
      roles: ['म्यूज़िशियन', 'सिंगर-सॉन्गराइटर', 'कवर आर्टिस्ट', 'म्यूज़िक प्रोड्यूसर'],
      niches: ['बॉलीवुड कवर्स', 'इंडी म्यूज़िक', 'अनप्लग्ड सेशन्स', 'नए गाने', 'लाइव परफॉर्मेंस', 'गीत और संगीत'],
    },
    hg: {
      label: 'Musician',
      roles: ['Musician', 'Singer', 'Guitarist', 'Music Producer'],
      niches: ['Original songs', 'Cover songs', 'Hindustani classical', 'Sufi', 'Indie music', 'Instrumental'],
    },
  },
  {
    id: 'developer',
    emojis: ['💻', '⚙️', '🚀'],
    en: {
      label: 'Developer',
      roles: ['Software Developer', 'Web Developer', 'Full-Stack Developer', 'Open Source Developer'],
      niches: ['JavaScript', 'React', 'Web development', 'Python', 'Side projects', 'Coding tips'],
    },
    hi: {
      label: 'डेवलपर',
      roles: ['सॉफ्टवेयर डेवलपर', 'वेब डेवलपर', 'फुल-स्टैक डेवलपर', 'ओपन सोर्स डेवलपर'],
      niches: ['जावास्क्रिप्ट', 'रिएक्ट', 'वेब डेवलपमेंट', 'पायथन', 'साइड प्रोजेक्ट्स', 'कोडिंग टिप्स'],
    },
    hg: {
      label: 'Software Developer',
      roles: ['Software Developer', 'Full-Stack Developer', 'Frontend Engineer', 'Indie Hacker'],
      niches: ['JavaScript', 'React', 'Python', 'Web development', 'Open source', 'Side projects'],
    },
  },
  {
    id: 'artist',
    emojis: ['🎨', '🖌️', '✏️'],
    en: {
      label: 'Artist',
      roles: ['Artist', 'Illustrator', 'Digital Artist', 'Painter'],
      niches: ['Digital illustration', 'Sketching', 'Watercolours', 'Character design', 'Commissions', 'Portraits'],
    },
    hi: {
      label: 'कलाकार',
      roles: ['आर्टिस्ट', 'इलस्ट्रेटर', 'डिजिटल आर्टिस्ट', 'पेंटर'],
      niches: ['डिजिटल इलस्ट्रेशन', 'स्केचिंग', 'वॉटरकलर', 'कैरेक्टर डिज़ाइन', 'कमीशन वर्क', 'पोट्रेट'],
    },
    hg: {
      label: 'Artist',
      roles: ['Artist', 'Illustrator', 'Sketch Artist', 'Digital Artist'],
      niches: ['Sketching', 'Digital illustration', 'Traditional art', 'Portrait sketches', 'Procreate', 'Art process'],
    },
  },
  {
    id: 'writer',
    emojis: ['✍️', '📖', '🪶'],
    en: {
      label: 'Writer',
      roles: ['Writer', 'Author', 'Poet', 'Storyteller'],
      niches: ['Poetry', 'Short stories', 'Bookstagram', 'Essays', 'Creative writing', 'Hindi kavita'],
    },
    hi: {
      label: 'लेखक',
      roles: ['राइटर', 'लेखक', 'कवि', 'कहानीकार'],
      niches: ['कविताएँ', 'लघु कथाएँ', 'बुकस्टैग्राम', 'निबंध', 'रचनात्मक लेखन', 'ग़ज़लें'],
    },
    hg: {
      label: 'Writer',
      roles: ['Writer', 'Poet', 'Blogger', 'Storyteller'],
      niches: ['Poetry', 'Short fiction', 'Personal essays', 'Hindi poetry', 'Storytelling', 'Creative writing'],
    },
  },
  {
    id: 'beauty',
    emojis: ['💄', '🧴', '✨'],
    en: {
      label: 'Beauty Creator',
      roles: ['Beauty Creator', 'Makeup Artist', 'Skincare Enthusiast', 'Hair Care Creator'],
      niches: ['Makeup tutorials', 'Skincare routines', 'Festive makeup', 'Budget beauty', 'Bridal makeup', 'Hair care'],
    },
    hi: {
      label: 'ब्यूटी क्रिएटर',
      roles: ['ब्यूटी क्रिएटर', 'मेकअप आर्टिस्ट', 'स्किनकेयर एन्थूज़िएस्ट', 'हेयर केयर क्रिएटर'],
      niches: ['मेकअप ट्यूटोरियल', 'स्किनकेयर रूटीन', 'फ़ेस्टिव मेकअप', 'बजट ब्यूटी', 'ब्राइडल मेकअप', 'हेयर केयर'],
    },
    hg: {
      label: 'Beauty Creator',
      roles: ['Beauty Creator', 'Makeup Artist', 'Skincare Enthusiast', 'Beauty Reviewer'],
      niches: ['Makeup tutorials', 'Skincare routines', 'Budget beauty', 'GRWM', 'Indian makeup', 'Honest reviews'],
    },
  },
  {
    id: 'business',
    emojis: ['🚀', '📈', '🤝'],
    en: {
      label: 'Entrepreneur',
      roles: ['Founder', 'Entrepreneur', 'Small Business Owner', 'Startup Founder'],
      niches: ['D2C brand', 'Small business', 'Startup life', 'Business tips', 'Made in India', 'Entrepreneurship'],
    },
    hi: {
      label: 'उद्यमी',
      roles: ['फ़ाउंडर', 'एंटरप्रेन्योर', 'स्मॉल बिज़नेस ओनर', 'स्टार्टअप फ़ाउंडर'],
      niches: ['डी2सी ब्रांड', 'स्टार्टअप लाइफ', 'बिज़नेस टिप्स', 'मेड इन इंडिया', 'एंटरप्रेन्योरशिप', 'स्मॉल बिज़नेस'],
    },
    hg: {
      label: 'Small Business',
      roles: ['Founder', 'Small Business Owner', 'Entrepreneur', 'D2C Brand'],
      niches: ['Small business', 'D2C brand', 'Startup journey', 'Marketing', 'Customer stories', 'Business tips'],
    },
  },
];

const FALLBACK_CATEGORY = CATEGORIES[0];

/** Always returns a category; unknown ids fall back to the first one. */
export function getCategory(id: string): Category {
  return CATEGORIES.find((category) => category.id === id) ?? FALLBACK_CATEGORY;
}

export function categoryContent(id: string, language: Language): CategoryContent {
  const category = getCategory(id);
  if (language === 'hi') return category.hi;
  if (language === 'hg') return category.hg;
  return category.en;
}
