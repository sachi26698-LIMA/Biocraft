/**
 * BioCraft original bios — batch 008.
 * The seven categories still at 7 records, plus the low teens.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_008 = [
  /* --------------------------------------------------------------- Family */
  e('Product of a loud family and a quiet kitchen.', 'Family', 'Home', 'Warm', ['family', 'home']),
  e('My mother is my first and harshest editor.', 'Family', 'Parents', 'Honest', ['family', 'mother']),
  e('We fight at dinner and defend each other outside.', 'Family', 'Loyalty', 'Warm', ['family', 'loyalty']),
  e('Call your parents. That is the whole bio.', 'Family', 'Parents', 'Direct', ['family', 'advice']),
  e('Four siblings, one bathroom, lifelong negotiation skills.', 'Family', 'Siblings', 'Funny', ['family', 'siblings']),
  h('मेरा परिवार शोर भी करता है और साथ भी खड़ा रहता है।', 'Family', 'परिवार', 'कोमल', ['परिवार', 'साथ']),
  h('माँ की डाँट में भी प्यार होता है।', 'Family', 'माँ', 'कोमल', ['माँ', 'प्यार']),
  h('घर वही जहाँ खाना अपने हाथ का लगता है।', 'Family', 'घर', 'सहज', ['घर', 'खाना']),
  g('Mera parivaar shor bhi karta hai aur saath bhi khada rehta hai.', 'Family', 'Home', 'Warm', ['parivaar', 'saath']),
  g('Maa ki daant mein bhi pyaar hota hai, samajh lo.', 'Family', 'Parents', 'Tender', ['maa', 'pyaar']),
  g('Ghar wahi jahan khaana apne haath ka lagta hai.', 'Family', 'Home', 'Warm', ['ghar', 'khaana']),

  /* ---------------------------------------------------------------- Minimal */
  e('Less stuff, more room to think.', 'Minimal', 'Simplicity', 'Minimal', ['minimal', 'clarity']),
  e('One notebook, one pen, no system.', 'Minimal', 'Tools', 'Terse', ['minimal', 'tools']),
  e('Deleted the app. Kept the friends.', 'Minimal', 'Digital', 'Wry', ['minimal', 'digital']),
  h('सामान कम, सोच के लिए जगह ज़्यादा।', 'Minimal', 'सादगी', 'संक्षिप्त', ['सामान', 'जगह']),
  h('एक डायरी, एक कलम, बाकी सब शोर।', 'Minimal', 'सादगी', 'संक्षिप्त', ['डायरी', 'कलम']),
  g('Saamaan kam, soch ke liye jagah zyada.', 'Minimal', 'Simplicity', 'Minimal', ['saamaan', 'jagah']),
  g('Ek diary, ek kalam, baaki sab shor hai.', 'Minimal', 'Tools', 'Terse', ['diary', 'kalam']),

  /* ---------------------------------------------------------------- Fitness */
  e('Lifts heavy, complains lightly.', 'Fitness', 'Gym', 'Playful', ['fitness', 'gym']),
  e('Started for the mirror. Stayed for the mood.', 'Fitness', 'Motivation', 'Honest', ['fitness', 'mood']),
  e('Rest days are training days for the mind.', 'Fitness', 'Recovery', 'Wise', ['fitness', 'recovery']),
  h('वज़न उठाता हूँ, शिकायत हल्की रखता हूँ।', 'Fitness', 'जिम', 'मज़ाकिया', ['वज़न', 'जिम']),
  h('शुरुआत आईने के लिए की, अब मन के लिए करता हूँ।', 'Fitness', 'प्रेरणा', 'सहज', ['शुरुआत', 'मन']),
  g('Vazan uthta hoon, shikayat halki rakhta hoon.', 'Fitness', 'Gym', 'Funny', ['vazan', 'shikayat']),
  g('Shuruaat aaine ke liye ki, ab mann ke liye karta hoon.', 'Fitness', 'Motivation', 'Honest', ['shuruaat', 'mann']),

  /* ---------------------------------------------------- Travel and adventure */
  e('Collecting bus routes instead of souvenirs.', 'Travel and adventure', 'Backpacking', 'Free', ['travel', 'routes']),
  e('I plan the trip and then ignore the plan.', 'Travel and adventure', 'Travel style', 'Playful', ['travel', 'plans']),
  e('Window seat, no headphones, full attention.', 'Travel and adventure', 'Trains', 'Calm', ['travel', 'trains']),
  h('यादें जमा करता हूँ, चीज़ें नहीं।', 'Travel and adventure', 'सफ़र', 'आज़ाद', ['यादें', 'सफ़र']),
  h('योजना बनाता हूँ, फिर उसे भूल जाता हूँ।', 'Travel and adventure', 'सफ़र', 'मज़ाकिया', ['योजना', 'सफ़र']),
  g('Yaadein jama karta hoon, cheezein nahi.', 'Travel and adventure', 'Backpacking', 'Free', ['yaadein', 'cheezein']),
  g('Yojana banata hoon, phir use bhool jaata hoon.', 'Travel and adventure', 'Travel style', 'Funny', ['yojana', 'bhool']),

  /* ------------------------------------------------------- Gaming profiles */
  e('Plays for the story, stays for the side quests.', 'Gaming profiles', 'Single player', 'Calm', ['gaming', 'story']),
  e('Bad at aiming, excellent at logistics.', 'Gaming profiles', 'Team play', 'Funny', ['gaming', 'team']),
  e('One more round. A phrase with no expiry.', 'Gaming profiles', 'Sessions', 'Wry', ['gaming', 'nights']),
  h('कहानी के लिए खेलता हूँ, साइड क्वेस्ट में फँस जाता हूँ।', 'Gaming profiles', 'सिंगल प्लेयर', 'सहज', ['खेल', 'कहानी']),
  h('निशाना कमज़ोर, रणनीति तेज़।', 'Gaming profiles', 'टीम', 'मज़ाकिया', ['निशाना', 'रणनीति']),
  g('Kahani ke liye khelta hoon, side quest mein phans jaata hoon.', 'Gaming profiles', 'Single player', 'Calm', ['kahani', 'quest']),
  g('Nishana kamzor, ranniti tez. Bas itna hi.', 'Gaming profiles', 'Team play', 'Funny', ['nishana', 'ranniti']),

  /* ------------------------------------------------------------ Photography */
  e('Photographs the light, not the people.', 'Photography', 'Street', 'Observant', ['photography', 'light']),
  e('Forty frames of a wall. One was worth it.', 'Photography', 'Process', 'Honest', ['photography', 'process']),
  e('Phone camera, proper eye.', 'Photography', 'Gear', 'Terse', ['photography', 'phone']),
  h('रोशनी की तस्वीरें खींचता हूँ, चेहरों की नहीं।', 'Photography', 'स्ट्रीट', 'सहज', ['रोशनी', 'तस्वीर']),
  h('एक दीवार की चालीस तस्वीरें, एक काम की।', 'Photography', 'प्रक्रिया', 'सहज', ['दीवार', 'तस्वीर']),
  g('Roshni ki tasveerein kheenchta hoon, chehron ki nahi.', 'Photography', 'Street', 'Observant', ['roshni', 'tasveerein']),
  g('Ek deewar ki chalees tasveerein, ek kaam ki.', 'Photography', 'Process', 'Honest', ['deewar', 'tasveerein']),

  /* ------------------------------------------------------------ Music and art */
  e('Plays three chords with total conviction.', 'Music and art', 'Music', 'Playful', ['music', 'chords']),
  e('Draws badly and often. That is the practice.', 'Music and art', 'Art', 'Honest', ['art', 'practice']),
  e('Headphones on, world politely muted.', 'Music and art', 'Listening', 'Calm', ['music', 'headphones']),
  h('तीन सुर, पर पूरे भरोसे के साथ।', 'Music and art', 'संगीत', 'मज़ाकिया', ['सुर', 'संगीत']),
  h('बुरा बनाता हूँ, पर रुकता नहीं।', 'Music and art', 'कला', 'सहज', ['कला', 'अभ्यास']),
  g('Teen sur, par poore bharose ke saath.', 'Music and art', 'Music', 'Playful', ['sur', 'bharosa']),
  g('Bura banata hoon, par rukta nahi. Yahi abhyaas hai.', 'Music and art', 'Art', 'Honest', ['banata', 'abhyaas']),

  /* --------------------------------------------------- Stylish (deepening) */
  e('Neutral colours, strong opinions.', 'Stylish', 'Palette', 'Cool', ['style', 'colours']),
  e('Comfortable shoes tell you everything about a person.', 'Stylish', 'Observation', 'Wry', ['style', 'shoes']),
  e('Dresses like he has somewhere better to be.', 'Stylish', 'Bearing', 'Confident', ['style', 'bearing']),
  h('रंग सादे, राय पक्की।', 'Stylish', 'सलीका', 'संक्षिप्त', ['रंग', 'राय']),
  h('जूते देखकर आदमी समझ आ जाता है।', 'Stylish', 'सलीका', 'मज़ाकिया', ['जूते', 'सलीका']),
  g('Rang saade, raay pakki. Yehi saleeka hai.', 'Stylish', 'Poise', 'Cool', ['rang', 'raay']),
  g('Joote dekh ke aadmi samajh aa jaata hai.', 'Stylish', 'Observation', 'Witty', ['joote', 'aadmi']),

  /* ------------------------------------- Wedding and celebration (deepening) */
  e('First to arrive, first to the buffet.', 'Wedding and celebration', 'Guest life', 'Funny', ['wedding', 'buffet']),
  e('Cries at every wedding. Fictional ones too.', 'Wedding and celebration', 'Emotional', 'Warm', ['wedding', 'emotion']),
  h('सबसे पहले पहुँचता हूँ, खाने की लाइन में भी।', 'Wedding and celebration', 'मेहमान', 'मज़ाकिया', ['शादी', 'खाना']),
  h('हर शादी में आँखें भर आती हैं, फ़िल्मों में भी।', 'Wedding and celebration', 'भावुक', 'कोमल', ['शादी', 'आँखें']),
  g('Sabse pehle pahunchta hoon, khaane ki line mein bhi.', 'Wedding and celebration', 'Guest life', 'Funny', ['shaadi', 'khaana']),
  g('Har shaadi mein aankhein bhar aati hain, filmon mein bhi.', 'Wedding and celebration', 'Emotional', 'Warm', ['shaadi', 'aankhein']),

  /* ------------------------------------------- Monsoon and seasons (deepening) */
  e('Best season, worst umbrella management.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['monsoon', 'umbrella']),
  e('Winter person pretending to enjoy summer.', 'Monsoon and seasons', 'Winter', 'Funny', ['winter', 'seasons']),
  h('बारिश पसंद है, छाता संभालना नहीं आता।', 'Monsoon and seasons', 'बारिश', 'मज़ाकिया', ['बारिश', 'छाता']),
  h('सर्दी मेरा मौसम है, गर्मी से दोस्ती नहीं।', 'Monsoon and seasons', 'सर्दी', 'सहज', ['सर्दी', 'मौसम']),
  g('Baarish pasand hai, chhata sambhalna nahi aata.', 'Monsoon and seasons', 'Monsoon', 'Funny', ['baarish', 'chhata']),
  g('Sardi mera mausam hai, garmi se dosti nahi.', 'Monsoon and seasons', 'Winter', 'Honest', ['sardi', 'garmi']),

  /* --------------------------------------------- Spirituality and peace (deepening) */
  e('Prays briefly. Listens longer.', 'Spirituality and peace', 'Practice', 'Serene', ['faith', 'listening']),
  e('Peace is a practice, not a personality.', 'Spirituality and peace', 'Understanding', 'Wise', ['peace', 'practice']),
  h('कम बोलता हूँ, ज़्यादा सुनता हूँ।', 'Spirituality and peace', 'साधना', 'शांत', ['बोलना', 'सुनना']),
  h('शांति स्वभाव नहीं, अभ्यास है।', 'Spirituality and peace', 'समझ', 'गंभीर', ['शांति', 'अभ्यास']),
  g('Kam bolta hoon, zyada sunta hoon. Sukoon milta hai.', 'Spirituality and peace', 'Practice', 'Serene', ['bolta', 'sunta']),
  g('Shaanti swabhav nahi, abhyaas hai.', 'Spirituality and peace', 'Understanding', 'Wise', ['shaanti', 'abhyaas']),

  /* -------------------------------------------------- Self-respect (deepening) */
  e('I keep my promises, including the ones to myself.', 'Self-respect', 'Integrity', 'Steady', ['integrity', 'promises']),
  e('Not available for disrespect, even politely packaged.', 'Self-respect', 'Boundaries', 'Firm', ['respect', 'boundaries']),
  h('अपने से किए वादे भी निभाता हूँ।', 'Self-respect', 'ईमानदारी', 'दृढ़', ['वादे', 'ईमानदारी']),
  h('बेइज़्ज़ती प्यार में लिपटी हो तो भी नहीं चाहिए।', 'Self-respect', 'सीमाएं', 'स्पष्ट', ['बेइज़्ज़ती', 'सीमा']),
  g('Apne se kiye wade bhi nibhata hoon.', 'Self-respect', 'Integrity', 'Steady', ['wade', 'nibhata']),
  g('Beizzati pyaar mein lipi ho toh bhi nahi chahiye.', 'Self-respect', 'Boundaries', 'Firm', ['beizzati', 'pyaar']),

  /* ------------------------------------ Personality and identity (deepening) */
  e('Inconsistent, but at least it is my inconsistency.', 'Personality and identity', 'Selfhood', 'Wry', ['identity', 'honest']),
  e('Learned to like the person I pretend to be less.', 'Personality and identity', 'Growth', 'Honest', ['growth', 'identity']),
  h('मैं एक जैसा नहीं रहता, पर अपना ही रहता हूँ।', 'Personality and identity', 'स्वभाव', 'सहज', ['स्वभाव', 'अपना']),
  h('नकली वाला खुद से कम पसंद आने लगा।', 'Personality and identity', 'विकास', 'गंभीर', ['नकली', 'विकास']),
  g('Main ek jaisa nahi rehta, par apna hi rehta hoon.', 'Personality and identity', 'Selfhood', 'Honest', ['ek', 'apna']),
  g('Naqli wala khud se kam pasand aane laga.', 'Personality and identity', 'Growth', 'Reflective', ['naqli', 'pasand']),

  /* ------------------------------------------- Books and reading (deepening) */
  e('Reader of margins, not just pages.', 'Books and reading', 'Reader life', 'Wry', ['books', 'notes']),
  e('Library card still the most rebellious thing I own.', 'Books and reading', 'Reader life', 'Playful', ['books', 'library']),
  h('हाशिये पर लिखना पढ़ने का हिस्सा है।', 'Books and reading', 'पढ़ने की आदत', 'सहज', ['हाशिये', 'पढ़ना']),
  h('किताबें मेरी सबसे पुरानी दोस्त हैं।', 'Books and reading', 'पढ़ना', 'कोमल', ['किताबें', 'दोस्त']),
  g('Hashiyon pe likhna padhne ka hissa hai.', 'Books and reading', 'Reader life', 'Wry', ['hashiyon', 'padhna']),
  g('Kitaabein meri sabse puraani dost hain.', 'Books and reading', 'Reading', 'Warm', ['kitaabein', 'dost']),
];
