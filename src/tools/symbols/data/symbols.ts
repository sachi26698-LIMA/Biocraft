/**
 * Curated Unicode symbol & emoji library for the Emoji & Symbol Generator.
 *
 * Every entry carries short lowercase keywords (matched together with the
 * category label), so search is genuinely useful: "heart", "check",
 * "arrow", "star", "fire".
 *
 * Styled-alphabet rows (A–Z) are produced from the same engine as the font
 * tools, so they never drift out of sync with the actual output. Entries are
 * deduplicated by exact glyph at build time (enforced by the test harness).
 * Emoji-presentation code points carry U+FE0F where needed.
 */

import { applyStyle } from '../../../lib/unicodeStyles';

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const abc = 'abcdefghijklmnopqrstuvwxyz';
const row = (source: string, styleId: string, keywords: string): SymbolEntry => ({
  glyph: applyStyle(source, styleId),
  keywords,
});

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
      s('🫀', 'anatomical heart organ'),
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
      s('🌠', 'shooting star comet night sky'), s('⋆', 'star small tiny'),
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
      s('😈', 'smiling imp evil devil'), s('😠', 'angry face mad'), s('🥴', 'woozy face dizzy tipsy'),
      s('😵', 'dizzy face knocked out'), s('🤧', 'sneezing face sick'), s('🥵', 'hot face sweating'),
      s('🥶', 'cold face freezing'), s('🤠', 'cowboy face hat'), s('🧐', 'monocle face fancy'),
      s('🤓', 'nerd face glasses'), s('🫣', 'face peeking fingers shy'), s('🤨', 'raised eyebrow sceptical'),
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
      s('🖖', 'vulcan salute hand'), s('👆', 'point up finger'), s('👇', 'point down finger'),
      s('👈', 'point left finger'), s('👉', 'point right finger'), s('☝️', 'index up hand'),
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
      s('🌋', 'volcano mountain eruption'), s('🗻', 'mount fuji snow'), s('⛰️', 'mountain rock'),
      s('🏜️', 'desert sand cactus'), s('🌪️', 'tornado whirlwind storm'), s('💨', 'dash air wind fast'),
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
      s('🍉', 'watermelon fruit'), s('🍇', 'grapes fruit wine'), s('🍑', 'peach fruit'),
      s('🍒', 'cherries fruit'), s('🍍', 'pineapple fruit'), s('🥝', 'kiwi fruit'),
      s('🍅', 'tomato red'), s('🌽', 'corn maize'), s('🥞', 'pancakes breakfast'),
      s('🍳', 'egg frying pan breakfast'),
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
      s('⤴', 'arrow curve up right'), s('⤵', 'arrow curve down right'), s('⬆', 'arrow up heavy'),
      s('⬇', 'arrow down heavy'), s('➲', 'circled arrow right'), s('⤳', 'arrow wave right'),
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
      s('▼', 'triangle down filled'), s('▽', 'triangle down outline'), s('▴', 'triangle up small filled'),
      s('►', 'triangle right pointer play'), s('◄', 'triangle left pointer'), s('⬢', 'hexagon filled'),
      s('⬡', 'hexagon outline'), s('⬟', 'pentagon filled'), s('⬥', 'diamond small filled'),
      s('⬦', 'diamond small outline'),
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
      s('🗹', 'ballot box check heavy'), s('🗸', 'check light mark'),
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
      s('🎻', 'violin strings music'), s('🪗', 'accordion music'), s('🎚️', 'slider control level'),
      s('🎛️', 'control knobs panel'),
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
      s('⁂', 'asterism stars divider'), s('⁑', 'two asterisks operator'), s('⁎', 'low asterisk'),
      s('⁋', 'reversed pilcrow paragraph'),
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

/* ========== Expansion set: 10 studio categories (~15 entries each) ========== */
SYMBOL_CATEGORIES.push(
  {
    id: 'royal',
    label: 'Royal & Kings',
    hiLabel: 'शाही राजघराने',
    symbols: [
      s('👑', 'crown royal king queen raja'),  
      s('♜', 'rook castle palace fort'), s('♝', 'bishop chess royal'), s('♞', 'knight chess royal'),
      s('⚜️', 'fleur de lis royal emblem'), s('🔱', 'trident trishul strength royal'), 
        
      s('🏰', 'castle palace fort'), s('👸', 'princess queen girl royal'), s('🤴', 'prince king boy royal'),
      s('🤵', 'tuxedo gentleman royal suit'),
      s('👰', 'bride royal wedding'),
      s('🎩', 'top hat gentleman classy'),
      s('🪷', 'lotus sacred royal india'),
      s('🪭', 'folding fan royal elegance'),
    ],
  },
  {
    id: 'attitude',
    label: 'Attitude & Savage',
    hiLabel: 'एटीट्यूड',
    symbols: [
        s('🦚', 'peacock swagger attitude'),
       s('🦁', 'lion king attitude boss'), s('🐆', 'leopard fierce attitude'),
      s('💅', 'nail polish sass attitude'), s('🃏', 'joker wild card attitude'), s('💢', 'anger symbol rage attitude'),
       s('🦅', 'eagle free sharp attitude'), s('🗯️', 'speech bubble shout attitude'),
        
      s('🧊', 'ice cold calm savage'),
      s('🐍', 'snake sly savage'),
      s('🫵', 'you point attitude callout'),
      s('🦂', 'scorpion sting savage'),
      s('🦇', 'bat night dark attitude'),
    ],
  },
  {
    id: 'birthday-festive',
    label: 'Birthday & Party',
    hiLabel: 'जन्मदिन पार्टी',
    symbols: [
       s('🎈', 'balloon party birthday'), s('🎉', 'party popper confetti celebrate'),
        s('🕯️', 'candle light birthday'),
      s('🧁', 'cupcake dessert sweet birthday'), s('🎁', 'gift present birthday'), s('🎊', 'confetti ball celebrate'),
      s('🪅', 'pinata party celebrate'),  
      s('🪔', 'diya lamp festival'), s('🍬', 'candy mithai sweet'), 
      s('🍪', 'cookie snack sweet party'),
      s('🍫', 'chocolate sweet party'),
      s('🥤', 'drink cup party'),
      s('🎆', 'fireworks celebration party'),
      s('🎇', 'sparkler fireworks party'),
      s('🪩', 'mirror ball disco party'),
      s('🧨', 'firecracker explode celebrate'), s('🎏', 'carp streamer festival'), s('🎖️', 'medal honour service'),
    ],
  },
  {
    id: 'religious',
    label: 'Faith & Peace',
    hiLabel: 'आस्था शांति',
    symbols: [
      s('🕉️', 'om aum hindu spiritual'), s('ॐ', 'om aum devanagari spiritual'), 
        s('✝️', 'cross christian faith'),
      s('☪️', 'star crescent islam'), s('☸️', 'wheel dhamma buddhism'), s('☬', 'khanda sikh faith'),
      s('✡️', 'star of david judaism'), s('☯️', 'yin yang balance tao'), s('🕊️', 'dove peace spirit'),
      s('📿', 'prayer beads mala faith'), s('🛕', 'hindu temple mandir'), s('🛐', 'place of worship'),
      s('🕎', 'menorah hanukkah jewish'), s('⛩️', 'shinto shrine japan'),
    ],
  },
  {
    id: 'friendship',
    label: 'Friendship & Squad',
    hiLabel: 'दोस्ती दोस्त',
    symbols: [
       s('🫂', 'hug people friendship'), s('👯', 'twins friends squad'),
        s('🤜', 'fist bump bro friends'),
      s('🤛', 'fist bump left friends'), s('👫', 'man woman holding hands friends'),

      s('👬', 'two men friends duo'),
      s('👭', 'two women friends duo'),
      s('🍿', 'popcorn movie night friends'),
      s('🎳', 'bowling friends game night'),
      s('🌃', 'night city friends out'),
      s('🧺', 'picnic blanket friends day'),
      s('🍱', 'bento meal friends together'),
      s('💑', 'couple with heart love'), s('💏', 'kiss couple love'),
    ],
  },
  {
    id: 'cute',
    label: 'Cute & Kawaii',
    hiLabel: 'क्यूट',
    symbols: [
      s('🧸', 'teddy bear cute soft'), s('🎀', 'ribbon bow cute girl'), s('🐣', 'hatching chick cute baby'),
       s('🐥', 'baby chick cute yellow'), 
      s('🍮', 'pudding dessert cute sweet'),  s('🐌', 'snail cute slow'),
        s('🩵', 'light blue heart cute'),
      s('🐾', 'paw prints cute animal'),  s('🫧', 'bubbles cute clean'),
      s('🐨', 'koala cute animal huggable'),
      s('🐼', 'panda cute animal'),
      s('🐰', 'bunny rabbit cute'),
      s('🐻', 'bear cute animal brown'),
      s('🐶', 'dog puppy cute pet'),
      s('🐱', 'cat kitty cute pet'),
      s('🦄', 'unicorn magic cute'),
      s('🐹', 'hamster cute face'), s('🦊', 'fox face cute'), s('🐯', 'tiger face'),
      s('😺', 'cat smiling face'), s('😻', 'cat heart eyes love'), s('🐭', 'mouse face cute'),
      s('🐸', 'frog face'),
    ],
  },
  {
    id: 'sad',
    label: 'Sad & Melancholy',
    hiLabel: 'उदासी',
    symbols: [
      s('💧', 'drop tear sad water'),  
       s('😞', 'sad face disappointed'), s('😿', 'crying cat sad'),
      s('🍂', 'fallen leaves autumn sad'), s('☔', 'umbrella rain sad'), s('🌫️', 'fog mist sad mood'),
      s('😔', 'pensive sad thoughtful'),  s('🫥', 'dotted line face absent sad'),
      s('💤', 'sleep boredom tired'),  
      s('🌁', 'foggy bridge city sad moody'),
      s('🌬️', 'wind gust melancholy'),
      s('🫤', 'face diagonal mouth meh sad'),
      s('😶‍🌫️', 'face in clouds absent sad'),
      s('😓', 'face cold sweat tired'), s('🩶', 'grey heart love'),
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming & Esports',
    hiLabel: 'गेमिंग',
    symbols: [
      s('🎮', 'game controller gaming'), s('🕹️', 'joystick arcade gaming'), s('👾', 'alien invader retro game'),
      s('🎯', 'target bullseye aim gaming'), s('🏆', 'trophy win esports'), s('⚔️', 'crossed swords battle game'),
      s('🛡️', 'shield defence game'), s('🎲', 'dice roll game'), s('🧩', 'puzzle piece game'),
      s('♟️', 'chess pawn strategy'), s('🐉', 'dragon fantasy game'), 
        s('💻', 'laptop pc gaming setup'),
      s('🎰', 'slot machine casino lucky'), s('🥇', 'gold medal first winner'), s('🥈', 'silver medal second'),
      s('🥉', 'bronze medal third'), s('🥊', 'boxing glove fight'), s('🏁', 'checkered flag race finish'),
    ],
  },
  {
    id: 'travel',
    label: 'Travel & Wanderlust',
    hiLabel: 'यात्रा सफ़र',
    symbols: [
      s('✈️', 'airplane flight travel'), s('🌍', 'globe europe travel world'), s('🗺️', 'map wanderlust travel'),
      s('🏔️', 'mountains adventure travel'), s('🏕️', 'camping tent travel'), s('🚂', 'train journey travel'),
       s('🗼', 'tower paris travel'), s('🗽', 'statue of liberty new york'),
      s('🎡', 'ferris wheel amusement travel'), s('🏝️', 'desert island beach travel'), s('🧳', 'luggage suitcase travel'),
      s('🌅', 'sunrise beach travel dawn'), s('🛶', 'canoe boat travel'), s('🧭', 'compass direction travel'),
      s('🚗', 'car automobile drive'), s('🚌', 'bus transport travel'), s('🚲', 'bicycle bike cycle'),
      s('🛴', 'kick scooter ride'), s('🛵', 'motor scooter ride'), s('🏖️', 'beach umbrella sand'),
      s('🚠', 'cable car mountain'),
    ],
  },
  {
    id: 'fashion',
    label: 'Fashion & Style',
    hiLabel: 'फैशन स्टाइल',
    symbols: [
      s('👗', 'dress fashion girl'),  s('👜', 'handbag purse fashion'),
      s('💄', 'lipstick makeup fashion'), s('🕶️', 'sunglasses shades fashion'), s('👠', 'heel shoes fashion'),
      s('👒', 'hat straw fashion summer'), s('💍', 'ring diamond fashion'), 
      s('🧥', 'coat jacket fashion winter'), s('🕳️', 'black hole fashion edge'), 
        s('👘', 'kimono fashion traditional'),
      s('🧣', 'scarf winter fashion'),
      s('🧤', 'gloves fashion winter'),
      s('🛍️', 'shopping bags fashion sale'),
      s('🪞', 'mirror vanity fashion'),
      s('🌂', 'umbrella rain fashion style'),
      s('👢', 'boots shoes winter'), s('👡', 'sandals shoes summer'), s('🩴', 'flip flops beach'),
      s('👛', 'purse wallet fashion'), s('👔', 'shirt tie business'), s('🧢', 'cap hat sport'),
    ],
  },
);

/* ========== Expansion set 2: styled alphabets + currency ========== */
SYMBOL_CATEGORIES.push(
  {
    id: 'alphabet',
    label: 'Styled Alphabets A–Z',
    hiLabel: 'वर्णमाला अक्षर',
    symbols: [
      row(ABC, 'bold', 'alphabet bold capital A to Z serif math'),
      row(abc, 'bold', 'alphabet bold lowercase a to z serif math'),
      row(ABC, 'italic', 'alphabet italic capital A to Z serif math'),
      row(abc, 'italic', 'alphabet italic lowercase a to z serif math'),
      row(ABC, 'bold-italic', 'alphabet bold italic capital A to Z serif'),
      row(abc, 'bold-italic', 'alphabet bold italic lowercase a to z serif'),
      row(ABC, 'script', 'alphabet script capital A to Z cursive elegant'),
      row(abc, 'script', 'alphabet script lowercase a to z cursive elegant'),
      row(ABC, 'bold-script', 'alphabet bold script capital A to Z cursive popular'),
      row(abc, 'bold-script', 'alphabet bold script lowercase a to z cursive popular'),
      row(ABC, 'fraktur', 'alphabet fraktur capital A to Z gothic blackletter old english'),
      row(abc, 'fraktur', 'alphabet fraktur lowercase a to z gothic blackletter'),
      row(ABC, 'bold-fraktur', 'alphabet bold fraktur capital A to Z gothic heavy'),
      row(abc, 'bold-fraktur', 'alphabet bold fraktur lowercase a to z gothic heavy'),
      row(ABC, 'double-struck', 'alphabet double struck capital A to Z math'),
      row(abc, 'double-struck', 'alphabet double struck lowercase a to z math'),
      row(ABC, 'sans', 'alphabet sans serif capital A to Z clean modern'),
      row(abc, 'sans', 'alphabet sans serif lowercase a to z clean modern'),
      row(ABC, 'sans-bold', 'alphabet sans bold capital A to Z clean'),
      row(abc, 'sans-bold', 'alphabet sans bold lowercase a to z clean'),
      row(ABC, 'sans-italic', 'alphabet sans italic capital A to Z clean'),
      row(abc, 'sans-italic', 'alphabet sans italic lowercase a to z clean'),
      row(ABC, 'sans-bold-italic', 'alphabet sans bold italic capital A to Z clean'),
      row(abc, 'sans-bold-italic', 'alphabet sans bold italic lowercase a to z clean'),
      row(ABC, 'monospace', 'alphabet monospace capital A to Z code typewriter'),
      row(abc, 'monospace', 'alphabet monospace lowercase a to z code typewriter'),
      row(ABC, 'fullwidth', 'alphabet fullwidth capital A to Z vaporwave wide'),
      row(abc, 'fullwidth', 'alphabet fullwidth lowercase a to z vaporwave wide'),
      row(abc, 'small-caps', 'alphabet small caps a to z elegant caps'),
      row(ABC, 'superscript', 'alphabet superscript capital A to Z raised'),
      row(abc, 'superscript', 'alphabet superscript lowercase a to z raised'),
      row(abc, 'subscript', 'alphabet subscript lowercase a to z lowered'),
      row(ABC, 'circled', 'alphabet circled capital A to Z hollow ring'),
      row(abc, 'circled', 'alphabet circled lowercase a to z hollow ring'),
      row(ABC, 'squared', 'alphabet squared capital A to Z box outline'),
      row(ABC, 'parenthesized', 'alphabet parenthesized capital A to Z bracket'),
      row(abc, 'parenthesized', 'alphabet parenthesized lowercase a to z bracket'),
      row(ABC, 'negative-circled', 'alphabet negative circled capital A to Z filled bubble'),
      row(ABC, 'negative-squared', 'alphabet negative squared capital A to Z filled box'),
      row(ABC, 'aesthetic', 'alphabet aesthetic spaced capital A to Z hair space'),
      row('0123456789', 'bold', 'digits numbers 0 to 9 bold'),
      row('0123456789', 'monospace', 'digits numbers 0 to 9 monospace code'),
      row('0123456789', 'double-struck', 'digits numbers 0 to 9 double struck math'),
      row('0123456789', 'fullwidth', 'digits numbers 0 to 9 fullwidth vaporwave'),
      row('0123456789', 'circled', 'digits numbers 0 to 9 circled'),
      row('0123456789', 'superscript', 'digits numbers 0 to 9 superscript raised'),
      row('0123456789', 'subscript', 'digits numbers 0 to 9 subscript lowered'),
    ],
  },
  {
    id: 'money',
    label: 'Money & Currency',
    hiLabel: 'पैसे रुपया',
    symbols: [
      s('₹', 'rupee india currency inr paisa'), s('$', 'dollar currency usd money'), s('€', 'euro currency eur money europe'),
      s('£', 'pound sterling currency gbp uk money'), s('¥', 'yen yuan currency jpy cny money'), s('₩', 'won currency krw money'),
      s('₽', 'ruble currency rub money'), s('₿', 'bitcoin crypto currency btc digital'), s('¢', 'cent currency money'),
      s('₺', 'turkish lira currency try money'), s('₫', 'dong currency vnd money'), s('₦', 'naira currency ngn nigeria money'),
      s('₱', 'peso currency php money'), s('₪', 'shekel currency ils money'), s('₴', 'hryvnia currency uah money'),
      s('﷼', 'riyal currency irr sar money'), s('₡', 'colon currency crc money'), s('₵', 'cedi currency ghs ghana money'),
      s('💰', 'money bag cash rich'), s('💸', 'money wings flying cash'), s('🪙', 'coin money change'),
      s('💳', 'credit card payment money'), s('🏦', 'bank money finance'), s('📈', 'chart up stocks growth money'),
    ],
  },
);

/** Curated ready-made combinations — tap to copy the whole thing. */
export const SYMBOL_COMBOS: readonly { label: string; text: string }[] = [
  { label: 'Royal sparkle', text: '꧁༺👑༻꧂' },
  { label: 'Sparkle divider', text: '✧･ﾟ: *✧･ﾟ:*' },
  { label: 'Heart flourish', text: '♡〜꒱˚♡' },
  { label: 'Crown divider', text: '༺♡༻ ༺👑༻ ༺♡༻' },
  { label: 'Fire trail', text: '༒☬༒' },
  { label: 'Flower border', text: '༄༂࿐ 🌸 ༄༂࿐' },
  { label: 'Attitude skull', text: '꧁༒𝗩𝗜𝗣༒꧂' },
  { label: 'Moon stars', text: '☾⋆⁺˚⁎' },
  { label: 'Cute hands', text: '♡꒦ ˳.˳ ꒦♡' },
  { label: 'Rupee swag', text: '꧁༺💸༻꧂' },
  { label: 'Zen balance', text: '☯︎·˚₊‧' },
  { label: 'Party line', text: '༄༂🎊 🎉 🎊༄༂' },
];

export const TOTAL_SYMBOLS = SYMBOL_CATEGORIES.reduce((sum, cat) => sum + cat.symbols.length, 0);
