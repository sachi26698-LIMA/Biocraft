/**
 * Curated Unicode symbol & emoji library for the Emoji & Symbol Generator.
 *
 * ~300 entries across 12 categories. Every entry carries short lowercase
 * search keywords (matched together with the category label), so search is
 * genuinely useful: "heart", "check", "arrow", "star", "fire".
 *
 * Entries are deduplicated by exact glyph at build time (enforced by the
 * test harness). Emoji-presentation code points carry U+FE0F where needed.
 */

export interface SymbolEntry {
  glyph: string;
  keywords: string;
}

export interface SymbolCategory {
  id: string;
  label: string;
  /** Hindi search aliases for the category (e.g. "दिल प्रेम"). */
  hiLabel: string;
  symbols: SymbolEntry[];
}

const s = (glyph: string, keywords: string): SymbolEntry => ({ glyph, keywords });

export const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    id: 'hearts',
    label: 'Hearts & Love',
    hiLabel: 'दिल प्रेम',
    symbols: [
      s('❤️', 'heart love red'), s('🧡', 'orange heart love'), s('💛', 'yellow heart love'),
      s('💚', 'green heart love'), s('💙', 'blue heart love'), s('💜', 'purple heart love'),
      s('🖤', 'black heart love'), s('🤍', 'white heart love'), s('🤎', 'brown heart love'),
      s('💔', 'broken heart sad'), s('❣️', 'heart exclamation love'), s('💕', 'two hearts love'),
      s('💞', 'revolving hearts love'), s('💓', 'beating heart love pulse'), s('💗', 'growing heart love'),
      s('💖', 'sparkling heart love'), s('💘', 'cupid heart arrow love'), s('💝', 'gift heart love'),
      s('💟', 'heart decoration'), s('♡', 'heart outline love'), s('♥', 'heart suit card'),
      s('❥', 'floral heart love'), s('❣', 'heart exclaim punctuation'), s('💌', 'love letter mail'),
      s('💋', 'kiss lips'), s('🩷', 'pink heart love'),
    ],
  },
  {
    id: 'stars',
    label: 'Stars & Sparkles',
    hiLabel: 'सितारे चमक',
    symbols: [
      s('✨', 'sparkles shine glitter'), s('⭐', 'star yellow favourite'), s('🌟', 'glowing star shine'),
      s('💫', 'dizzy star sparkle'), s('★', 'star filled black'), s('☆', 'star outline empty'),
      s('✦', 'four point star sparkle'), s('✧', 'four point star outline'), s('✴', 'eight pointed star'),
      s('✳', 'eight spoked asterisk star'), s('❇', 'sparkle star'), s('❈', 'heavy sparkle star'),
      s('✶', 'six pointed star'), s('❉', 'balloon spoked asterisk star'), s('✸', 'heavy eight pointed star'),
      s('✹', 'twelve pointed black star'), s('✺', 'sixteen pointed asterisk star'), s('❋', 'heavy teardrop asterisk star'),
      s('٭', 'arabic star symbol'), s('✱', 'heavy asterisk star'), s('✲', 'open centre asterisk star'),
      s('✪', 'circled star'), s('✫', 'open centre star'), s('✬', 'black centre star'),
      s('✭', 'outlined star'), s('✰', 'shadowed star'), s('✩', 'outlined star small'),
      s('✷', 'pinwheel star'),
    ],
  },
  {
    id: 'faces',
    label: 'Smileys & Faces',
    hiLabel: 'चेहरे मुस्कान',
    symbols: [
      s('😀', 'grinning smile happy'), s('😄', 'grinning eyes smile happy'), s('😁', 'beaming smile happy'),
      s('😂', 'laughing tears joy'), s('🤣', 'rolling laughing floor'), s('😊', 'smiling eyes happy'),
      s('😇', 'angel innocent smile'), s('🙂', 'slightly smiling face'), s('😉', 'wink smile'),
      s('😍', 'heart eyes love'), s('🥰', 'smiling hearts love'), s('😘', 'kiss face'),
      s('😋', 'yummy delicious tongue'), s('😛', 'tongue out face'), s('😜', 'winking tongue silly'),
      s('🤪', 'zany silly crazy'), s('🤑', 'money mouth rich'),
      s('😎', 'cool sunglasses smile'), s('🤩', 'star struck amazed'), s('🥳', 'party celebrate birthday'),
      s('😏', 'smirk smug'), s('😒', 'unamused annoyed'), s('🙄', 'eye roll exasperated'),
      s('😴', 'sleeping bored'), s('🤔', 'thinking pondering'), s('🤗', 'hugging care'),
      s('🤫', 'shush quiet secret'), s('🤭', 'giggle hand mouth'), s('😱', 'screaming shocked fear'),
      s('😢', 'crying tear sad'), s('😭', 'loudly crying tears'), s('🥺', 'pleading puppy eyes'),
      s('😤', 'huff triumph steam'), s('😡', 'angry mad rage'), s('🤯', 'mind blown exploding'),
      s('🫠', 'melting face hot'), s('🫡', 'saluting respect'),
      s('🥲', 'smiling through tears'),
    ],
  },
  {
    id: 'hands',
    label: 'Hands & Gestures',
    hiLabel: 'हाथ इशारे',
    symbols: [
      s('👍', 'thumbs up like yes'), s('👎', 'thumbs down dislike no'), s('👏', 'clapping hands applause'),
      s('🙌', 'raising hands celebrate'), s('🙏', 'folded hands thanks please namaste'), s('💪', 'muscle flex strong'),
      s('🤝', 'handshake deal agreement'), s('✌️', 'victory peace two'), s('🤞', 'fingers crossed luck'),
      s('🤟', 'love you gesture'), s('🤘', 'rock on horns'), s('🫶', 'heart hands love support'),
      s('👌', 'okay hand perfect'), s('🤏', 'pinching small little'), s('✋', 'raised hand stop'),
      s('🖐️', 'hand splayed five'), s('👋', 'waving hand hello bye'), s('🫰', 'finger heart money'),
      s('🤙', 'call me shaka'), s('👊', 'fist bump punch'),
    ],
  },
  {
    id: 'nature',
    label: 'Nature & Weather',
    hiLabel: 'प्रकृति मौसम',
    symbols: [
      s('☀️', 'sun sunny bright'), s('🔥', 'fire flame hot trending'), s('⚡', 'lightning bolt flash energy'),
      s('🌤', 'sun behind cloud'), s('⛅', 'partly cloudy'),
      s('☁️', 'cloud cloudy'), s('🌧️', 'rain rainy'), s('⛈️', 'thunderstorm lightning rain'),
      s('🌩️', 'lightning thunder'), s('☂️', 'umbrella rain'), s('❄️', 'snowflake snow cold winter'),
      s('☃️', 'snowman winter'), s('🌈', 'rainbow colourful'), s('🌊', 'wave ocean sea'),
      s('🌸', 'cherry blossom flower spring'), s('💮', 'white flower blossom'), s('🌺', 'hibiscus flower'),
      s('🌻', 'sunflower flower'), s('🌹', 'rose flower love red'), s('🥀', 'wilted flower sad'),
      s('🌷', 'tulip flower'), s('🌼', 'blossom flower daisy'), s('💐', 'bouquet flowers gift'),
      s('🍀', 'four leaf clover luck lucky'), s('☘️', 'shamrock clover'), s('🌿', 'herb leaf green'),
      s('🍃', 'leaf flutter leaves'), s('🌱', 'seedling sprout grow'), s('🍁', 'maple leaf autumn'),
      s('🌾', 'sheaf rice wheat grain'), s('🌵', 'cactus desert'), s('🌴', 'palm tree tropical'),
      s('🌙', 'crescent moon night'), s('🌕', 'full moon'), s('🌛', 'first quarter moon face'),
      s('🌝', 'full moon face'), s('🌞', 'sun face'), s('🌑', 'new moon dark'),
    ],
  },
  {
    id: 'food',
    label: 'Food & Drink',
    hiLabel: 'खाना पेय भोजन',
    symbols: [
      s('☕', 'coffee tea hot drink'), s('🍵', 'tea green cup'), s('🧋', 'bubble tea boba'),
      s('🍷', 'wine glass drink'), s('🍸', 'cocktail martini drink'), s('🍹', 'tropical drink cocktail'),
      s('🍺', 'beer mug drink'), s('🍻', 'clinking beers cheers'), s('🥂', 'clinking glasses cheers'),
      s('🍾', 'champagne bottle celebrate'), s('🍴', 'fork knife dining'), s('🍽️', 'plate fork knife dinner'),
      s('🍕', 'pizza italian'), s('🍔', 'burger hamburger'), s('🍟', 'fries chips'),
      s('🌮', 'taco mexican'), s('🍜', 'noodles ramen bowl'), s('🍝', 'spaghetti pasta'),
      s('🍛', 'curry rice indian'), s('🍣', 'sushi japanese'), s('🍩', 'donut dessert sweet'),
      s('🎂', 'birthday cake celebrate'), s('🍰', 'cake slice dessert'), s('🍦', 'soft ice cream dessert'),
      s('🍓', 'strawberry fruit berry'), s('🥭', 'mango fruit'), s('🍋', 'lemon citrus fruit'),
      s('🥑', 'avocado'),
    ],
  },
  {
    id: 'arrows',
    label: 'Arrows & Direction',
    hiLabel: 'तीर दिशा',
    symbols: [
      s('←', 'left arrow'), s('→', 'right arrow'), s('↑', 'up arrow'), s('↓', 'down arrow'),
      s('↔', 'left right arrow'), s('↕', 'up down arrow'), s('↖', 'up left arrow diagonal'),
      s('↗', 'up right arrow diagonal'), s('↘', 'down right arrow diagonal'), s('↙', 'down left arrow diagonal'),
      s('⇐', 'double left arrow'), s('⇒', 'double right arrow'), s('⇑', 'double up arrow'),
      s('⇓', 'double down arrow'), s('⇄', 'left right arrows exchange'), s('⇅', 'up down arrows'),
      s('➔', 'arrow pointing right'), s('➜', 'arrow right bold'), s('➝', 'arrow trending right'),
      s('➞', 'arrow bulleted right'), s('➡', 'black right arrow'), s('⬅', 'black left arrow'),
      s('↩', 'arrow curving back reply'), s('↪', 'arrow curving forward share'), s('➤', 'arrow pointer triangle'),
      s('⇢', 'rightwards wave dashed arrow'),
    ],
  },
  {
    id: 'shapes',
    label: 'Shapes & Geometric',
    hiLabel: 'आकार शक्ल',
    symbols: [
      s('●', 'circle filled black'), s('○', 'circle outline white'), s('◉', 'fisheye circled dot'),
      s('◎', 'bullseye circle'), s('◍', 'circle dotted'), s('◌', 'dotted circle'),
      s('◆', 'diamond filled'), s('◇', 'diamond outline'), s('◈', 'diamond with dot'),
      s('▣', 'square with inner square'), s('▪', 'small black square'), s('▫', 'small white square'),
      s('■', 'black square'), s('□', 'white square outline'), s('▢', 'white square with rounded corners'),
      s('◼', 'black medium square'), s('◻', 'white medium square'), s('⬛', 'black large square'),
      s('⬜', 'white large square'), s('▲', 'black up triangle'), s('△', 'white up triangle'),
      s('▷', 'white right triangle'), s('▶', 'black right triangle play'), s('◀', 'black left triangle'),
      s('◁', 'white left triangle'), s('▾', 'black down small triangle'), s('▸', 'black right small triangle'),
      s('◗', 'right half black circle'),
    ],
  },
  {
    id: 'checks',
    label: 'Checkmarks & Signs',
    hiLabel: 'सही निशान सही गलत',
    symbols: [
      s('✓', 'check tick done'), s('✔', 'heavy check tick done'), s('✅', 'green check tick button'),
      s('✕', 'x cross multiply'),
      s('✖', 'heavy x cross multiply'), s('✗', 'ballot x cross'), s('✘', 'heavy ballot x cross'),
      s('❌', 'cross mark red no'), s('❎', 'cross mark button no'), s('☐', 'ballot box empty'),
      s('☑', 'ballot box check'), s('☒', 'ballot box x'), s('❗', 'exclamation red alert'),
      s('❕', 'white exclamation'), s('❓', 'question mark red'), s('❔', 'white question mark'),
      s('⚠️', 'warning caution'), s('ℹ️', 'information info'), s('💯', 'hundred points perfect'),
      s('🔔', 'bell notification'), s('🚫', 'prohibited no entry'), s('⛔', 'no entry stop sign'),
    ],
  },
  {
    id: 'music',
    label: 'Music & Media',
    hiLabel: 'संगीत मीडिया गाना',
    symbols: [
      s('♩', 'quarter note music'), s('♪', 'eighth note music'), s('♫', 'beamed eighth notes music'),
      s('♬', 'beamed sixteenth notes music'), s('♭', 'flat music sign'), s('♮', 'natural music sign'),
      s('♯', 'sharp music sign'), s('🎼', 'musical score'), s('🎵', 'musical note'),
      s('🎶', 'musical notes'), s('🎧', 'headphones listen'), s('🎙️', 'studio microphone'),
      s('🎤', 'microphone sing'), s('🎷', 'saxophone jazz'), s('🎸', 'guitar rock'),
      s('🎹', 'keyboard piano'), s('🥁', 'drum beat'), s('🎺', 'trumpet brass'),
      s('🪕', 'banjo folk'), s('🎬', 'clapperboard film movie'),
    ],
  },
  {
    id: 'zodiac',
    label: 'Zodiac & Astrology',
    hiLabel: 'राशि ज्योतिष',
    symbols: [
      s('♈', 'aries zodiac fire march'), s('♉', 'taurus zodiac earth april'), s('♊', 'gemini zodiac air may'),
      s('♋', 'cancer zodiac water june'), s('♌', 'leo zodiac fire july'), s('♍', 'virgo zodiac earth august'),
      s('♎', 'libra zodiac air september'), s('♏', 'scorpio zodiac water october'), s('♐', 'sagittarius zodiac fire november'),
      s('♑', 'capricorn zodiac earth december'), s('♒', 'aquarius zodiac air january'), s('♓', 'pisces zodiac water february'),
      s('⛎', 'ophiuchus zodiac'), s('☿', 'mercury planet'), s('♀', 'venus planet'),
      s('♁', 'earth planet'), s('♂', 'mars planet'), s('♃', 'jupiter planet'),
      s('♄', 'saturn planet'), s('♅', 'uranus planet'),
    ],
  },
  {
    id: 'decorative',
    label: 'Decorative & Text',
    hiLabel: 'सजावट',
    symbols: [
      s('꧁', 'left ornate bracket decorative'), s('꧂', 'right ornate bracket decorative'),
      s('༺', 'left ornamental bracket'), s('༻', 'right ornamental bracket'),
      s('ღ', 'georgian heart ornament'), s('♛', 'black chess queen crown'), s('♚', 'black chess king crown'),
      s('♕', 'white chess queen crown'), s('♔', 'white chess king crown'), s('۝', 'ornate muslim sign ornament'),
      s('๏', 'thai ornate circle ornament'), s('¤', 'currency generic sign'), s('§', 'section sign'),
      s('¶', 'pilcrow paragraph sign'), s('†', 'dagger cross'), s('‡', 'double dagger cross'),
      s('©', 'copyright'), s('®', 'registered trademark'), s('™', 'trademark'), s('°', 'degree sign'),
      s('±', 'plus minus'), s('№', 'numero sign number'), s('•', 'bullet point dot'),
      s('◦', 'white bullet point'), s('‣', 'triangular bullet'), s('‹', 'single left angle quote'),
      s('›', 'single right angle quote'), s('«', 'left guillemet quote'), s('»', 'right guillemet quote'),
      s('※', 'reference mark komejirushi'),
    ],
  },
];

/** Hindi search aliases for individual glyphs (added to English keywords at search time). */
const HINDI_ALIASES: Readonly<Record<string, string>> = {
  // Hearts & Love
  '❤️': 'दिल लाल दिल प्रेम', '🧡': 'नारंगी दिल प्रेम', '💛': 'पीला दिल प्रेम',
  '💚': 'हरा दिल प्रेम', '💙': 'नीला दिल प्रेम', '💜': 'बैंगनी दिल प्रेम',
  '🖤': 'काला दिल', '🤍': 'सफेद दिल', '🤎': 'भूरा दिल', '💔': 'टूटा दिल दुख',
  '❣️': 'दिल चिल्लाओ प्रेम', '💕': 'दो दिल प्यार', '💞': 'घूमते दिल प्यार',
  '💓': 'धड़कता दिल प्यार', '💗': 'बढ़ता दिल प्यार', '💖': 'चमकीला दिल प्यार',
  '💘': 'तीर दिल प्रेम कामदेव', '💝': 'दिल तोहफा प्यार', '💟': 'दिल सजावट',
  '♡': 'दिल खाका', '♥': 'दिल ताश', '❥': 'दिल फूल', '❣': 'दिल विस्मय',
  '💌': 'प्रेम पत्र चिट्ठी', '💋': 'किस होंठ', '🩷': 'गुलाबी दिल प्रेम',
  // Stars
  '✨': 'चमक स्पार्कल्स', '⭐': 'तारा सितारा', '🌟': 'चमकता सितारा',
  '💫': 'तारा चक्कर', '★': 'तारा काला', '☆': 'तारा खाका',
  '✦': 'तारा चमक', '✧': 'तारा खाका', '✶': 'सितारा', '✳': 'तारा',
  '✴': 'तारा', '❇': 'चमक', '❈': 'चमक भारी', '✷': 'तारा', '❉': 'तारा',
  '✹': 'तारा', '✺': 'तारा', '❋': 'तारा', '٭': 'तारा', '✱': 'तारा',
  '✲': 'तारा', '✪': 'तारा गोला', '✫': 'तारा', '✬': 'तारा', '✭': 'तारा',
  '✩': 'तारा', '✰': 'तारा',
  // Smileys
  '😀': 'खुश मुस्कान', '😄': 'खुश हंसी', '😁': 'खुश मुस्कान', '😂': 'हंसी रोना',
  '🤣': 'हंसी', '😊': 'खुश मुस्कान', '😇': 'फरिश्ता', '🙂': 'मुस्कान',
  '😉': 'पलक झपकी', '😍': 'दिल आंखें प्यार', '🥰': 'दिल मुस्कान', '😘': 'किस',
  '😋': 'स्वादिष्ट', '😛': 'जीभ', '😜': 'जीभ पलक', '🤪': 'पागल',
  '🤑': 'पैसा धन', '😎': 'कूल धूप चश्मा', '🤩': 'सितारा आंखें', '🥳': 'पार्टी',
  '😏': 'मुस्कुराहट', '😒': 'बोर अकेला', '🙄': 'आंख घुमाना', '😴': 'नींद सो जाना',
  '🤔': 'सोचना', '🤗': 'गले लगाना', '🤫': 'चुप चुप्पी', '🤭': 'हंसना हाथ',
  '😱': 'चिल्लाना डर', '😢': 'रोना दुख', '😭': 'रोना', '🥺': 'आंखें',
  '😤': 'गुस्से की सांस', '😡': 'गुस्सा नाराज', '🤯': 'दिमाग चकराना',
  '🫠': 'पिघलना', '🫡': 'सलाम', '🥲': 'आंसू मुस्कान',
  // Hands
  '👍': 'अंगूठा ऊपर', '👎': 'अंगूठा नीचे', '👏': 'ताली बजाना',
  '🙌': 'हाथ ऊपर जश्न', '🙏': 'नमस्ते हाथ जोड़े धन्यवाद', '💪': 'ताकत बाजु भुजा',
  '🤝': 'हाथ मिलाना सौदा', '✌️': 'शांति जीत', '🤞': 'उंगलियां गुड लक',
  '🤟': 'लव यू हाथ', '🤘': 'रॉक', '🫶': 'दिल हाथ', '👌': 'ठीक है',
  '🤏': 'छोटा', '✋': 'रुको हाथ ऊपर', '🖐️': 'हाथ पांच', '👋': 'हाथ हिलाना नमस्ते',
  '🫰': 'कैश', '🤙': 'कॉल करो', '👊': 'मुट्ठी',
  // Nature & Weather
  '☀️': 'सूरज', '🔥': 'आग अग्नि गर्म', '⚡': 'बिजली चकाचौंध',
  '🌤': 'सूरज बादल', '⛅': 'बादल आंशिक', '☁️': 'बादल मेघ', '🌧️': 'बारिश',
  '⛈️': 'आंधी बारिश', '🌩️': 'बिजली आंधी', '☂️': 'छाता', '❄️': 'बर्फ',
  '☃️': 'बर्फ का आदमी', '🌈': 'इंद्रधनुष', '🌊': 'लहरे समुद्र',
  '🌸': 'फूल बसंत', '💮': 'फूल सफेद', '🌺': 'फूल गुड़हल', '🌻': 'सूरजमुखी',
  '🌹': 'गुलाब', '🥀': 'मुरझाया फूल', '🌷': 'फूल ट्यूलिप', '🌼': 'फूल',
  '💐': 'गुलदस्ता फूल', '🍀': 'तिपतिया घास भाग्य', '☘️': 'तिपतिया घास',
  '🌿': 'पत्ती जड़ी बूटी', '🍃': 'पत्ती', '🌱': 'पौधा अंकुर', '🍁': 'पत्ती शरद',
  '🌾': 'फसल', '🌵': 'कैक्टस', '🌴': 'ताड़ पेड़', '🌙': 'चांद रात',
  '🌕': 'पूर्ण चांद', '🌑': 'अमावस्या चांद', '🌛': 'चांद', '🌝': 'चांद', '🌞': 'सूरज',
  // Food
  '☕': 'कॉफी चाय', '🍵': 'चाय', '🧋': 'बबल टी', '🍷': 'शराब अंगूर',
  '🍸': 'कॉकटेल', '🍹': 'जूस पेय', '🍺': 'बियर', '🍻': 'बियर चियर्स',
  '🥂': 'गिलास चियर्स', '🍾': 'शैंपेन जश्न', '🍴': 'कांटा छुरी', '🍽️': 'थाली खाना',
  '🍕': 'पिज्जा', '🍔': 'बर्गर', '🍟': 'फ्राइज', '🌮': 'टैको',
  '🍜': 'नूडल्स', '🍝': 'पास्ता', '🍛': 'करी चावल', '🍣': 'सुशी',
  '🍩': 'डोनट', '🎂': 'केक जन्मदिन', '🍰': 'केक', '🍦': 'आइसक्रीम',
  '🍓': 'स्ट्रॉबेरी', '🥭': 'आम', '🍋': 'नींबू', '🥑': 'एवोकाडो',
  // Arrows
  '←': 'तीर बायां', '→': 'तीर दायां', '↑': 'तीर ऊपर', '↓': 'तीर नीचे',
  '↔': 'तीर दोनों', '↕': 'तीर ऊपर नीचे', '↖': 'तीर तिरछा', '↗': 'तीर तिरछा',
  '↘': 'तीर तिरछा', '↙': 'तीर तिरछा', '⇐': 'तीर बायां', '⇒': 'तीर दायां',
  '⇑': 'तीर ऊपर', '⇓': 'तीर नीचे', '⇄': 'तीर अदला बदली', '⇅': 'तीर',
  '➔': 'तीर', '➜': 'तीर', '➝': 'तीर', '➞': 'तीर', '➡': 'तीर दायां',
  '⬅': 'तीर बायां', '↩': 'तीर वापस जवाब', '↪': 'तीर आगे शेयर',
  '➤': 'तीर', '⇢': 'तीर',
  // Shapes
  '●': 'वृत्त गोल', '○': 'वृत्त खाका', '◆': 'हीरा', '◇': 'हीरा खाका',
  '◈': 'हीरा', '■': 'वर्ग', '□': 'वर्ग खाका', '▲': 'त्रिभुज', '△': 'त्रिभुज खाका',
  '▶': 'त्रिभुज चलाओ', '◀': 'त्रिभुज', '◼': 'वर्ग', '⬛': 'वर्ग काला',
  // Checks & Signs
  '✓': 'सही का निशान सही', '✔': 'सही का निशान', '✅': 'सही टिक',
  '✕': 'गलत क्रॉस', '✖': 'गलत क्रॉस', '✗': 'गलत निशान', '✘': 'गलत निशान',
  '❌': 'गलत क्रॉस', '❎': 'गलत क्रॉस का बटन', '☐': 'खाली बॉक्स',
  '☑': 'सही का बॉक्स', '☒': 'गलत का बॉक्स', '❗': 'विस्मय सावधान',
  '❕': 'विस्मय', '❓': 'सवाल प्रश्न', '❔': 'सवाल', '⚠️': 'चेतावनी सावधान',
  'ℹ️': 'जानकारी', '💯': 'सौ पूर्ण', '🔔': 'घंटी सूचना',
  '🚫': 'मना निषेध', '⛔': 'रुको निषेध',
  // Music & Media
  '♩': 'संगीत नोट', '♪': 'संगीत नोट', '♫': 'संगीत नोट', '♬': 'संगीत नोट',
  '🎼': 'संगीत नोट्स', '🎵': 'संगीत नोट', '🎶': 'संगीत नोट्स', '🎧': 'हेडफोन',
  '🎤': 'माइक माइक्रोफोन', '🎙️': 'माइक', '🎷': 'सैक्सोफोन',
  '🎸': 'गिटार', '🎹': 'पियानो कीबोर्ड', '🥁': 'ड्रम', '🎺': 'तुरही',
  '🪕': 'बैंजो', '🎬': 'फिल्म क्लैपर',
  // Zodiac
  '♈': 'मेष राशि', '♉': 'वृष राशि', '♊': 'मिथुन राशि', '♋': 'कर्क राशि',
  '♌': 'सिंह राशि', '♍': 'कन्या राशि', '♎': 'तुला राशि', '♏': 'वृश्चिक राशि',
  '♐': 'धनु राशि', '♑': 'मकर राशि', '♒': 'कुंभ राशि', '♓': 'मीन राशि',
  '⛎': 'राशि',
  // Decorative
  '꧁': 'सज्जा बायां पक्षी', '꧂': 'सज्जा दायां', '♛': 'मुकुट रानी',
  '♚': 'मुकुट राजा', 'ღ': 'दिल जॉर्जिया', '※': 'सज्जा निशान',
};

export const TOTAL_SYMBOLS = SYMBOL_CATEGORIES.reduce((sum, cat) => sum + cat.symbols.length, 0);

/** Lowercase search across glyph, keywords and category label. */
export function searchSymbols(
  query: string,
  activeCategory: string,
): Array<{ glyph: string; keywords: string; categoryId: string; categoryLabel: string }> {
  const q = query.trim().toLowerCase();
  const matches =
    activeCategory === 'all'
      ? SYMBOL_CATEGORIES
      : SYMBOL_CATEGORIES.filter((cat) => cat.id === activeCategory);

  const results: Array<{ glyph: string; keywords: string; categoryId: string; categoryLabel: string }> = [];
  for (const category of matches) {
    for (const symbol of category.symbols) {
      if (!q) {
        results.push({ glyph: symbol.glyph, keywords: symbol.keywords, categoryId: category.id, categoryLabel: category.label });
        continue;
      }
      const hindi = HINDI_ALIASES[symbol.glyph] ?? '';
      const haystack = `${symbol.glyph} ${symbol.keywords} ${category.label} ${category.hiLabel} ${hindi}`.toLowerCase();
      if (q.split(/\s+/).every((term) => haystack.includes(term))) {
        results.push({ glyph: symbol.glyph, keywords: symbol.keywords, categoryId: category.id, categoryLabel: category.label });
      }
    }
  }
  return results;
}
