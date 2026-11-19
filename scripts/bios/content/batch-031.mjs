/**
 * BioCraft original bios — batch 031.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_031 = [
  /* -------------------------------------------------------------- Attitude */
  e('I am not looking for a second opinion on a decision I already made.', 'Attitude', 'Confidence', 'Composed', ['attitude', 'confidence']),
  e('The exit is always available. I just rarely need it.', 'Attitude', 'Boundaries', 'Cool', ['attitude', 'boundaries']),
  e('I have a gentle face and a very firm schedule.', 'Attitude', 'Bearing', 'Witty', ['attitude', 'boundaries']),
  e('You do not get to borrow my calm and then blame me for it.', 'Attitude', 'Restraint', 'Sharp', ['attitude', 'calm']),
  e('I do not argue with the weather. I also do not argue with you.', 'Attitude', 'Restraint', 'Wry', ['attitude', 'restraint']),
  e('I keep my own counsel and I keep it well.', 'Attitude', 'Independence', 'Composed', ['attitude', 'independence']),
  h('मैं अपने फ़ैसले पर दूसरी राय नहीं ढूंढता।', 'Attitude', 'आत्मविश्वास', 'शांत', ['फ़ैसला', 'राय']),
  h('निकलने का रास्ता हमेशा खुला है, मुझे उसकी ज़रूरत कम पड़ती है।', 'Attitude', 'सीमाएं', 'शांत', ['रास्ता', 'ज़रूरत']),
  h('चेहरा नरम, समय-सारणी पक्की।', 'Attitude', 'सलीका', 'सहज', ['चेहरा', 'समय']),
  h('मैं अपनी शांति उधार नहीं देता।', 'Attitude', 'संयम', 'दृढ़', ['शांति', 'उधार']),
  g('Main apne faisle par doosri raay nahi dhoondhta.', 'Attitude', 'Confidence', 'Composed', ['faisle', 'raay']),
  g('Nikalne ka raasta hamesha khula hai, mujhe uski zaroorat kam padti hai.', 'Attitude', 'Boundaries', 'Cool', ['raasta', 'zaroorat']),
  g('Chehra naram hai, par meri hadd pakki hai.', 'Attitude', 'Bearing', 'Witty', ['chehra', 'hadd']),

  /* ------------------------------------------------------ Love and romance */
  e('You are the person I want to be bored with for forty years.', 'Love and romance', 'Commitment', 'Warm', ['love', 'future']),
  e('I love the way you take your time with things.', 'Love and romance', 'Admiration', 'Tender', ['love', 'admiration']),
  e('We argue well and we recover quickly. That is a skill.', 'Love and romance', 'Respect', 'Wise', ['love', 'conflict']),
  e('I would rather be honest and awkward than smooth and false.', 'Love and romance', 'Honesty', 'Direct', ['love', 'honesty']),
  e('You are the reason my worst days have a soft landing.', 'Love and romance', 'Comfort', 'Tender', ['love', 'comfort']),
  e('Every good thing in my week has your fingerprints on it.', 'Love and romance', 'Devotion', 'Sweet', ['love', 'gratitude']),
  h('तुम वो हो जिसके साथ चालीस साल बोर होना भी अच्छा लगेगा।', 'Love and romance', 'निभाना', 'कोमल', ['साल', 'बोर']),
  h('मुझे तुम्हारा चीज़ें संभालकर करना पसंद है।', 'Love and romance', 'प्रशंसा', 'कोमल', ['प्रशंसा', 'सँभालना']),
  h('हम अच्छा झगड़ते हैं और जल्दी सँभल जाते हैं, यह भी हुनर है।', 'Love and romance', 'आदर', 'गंभीर', ['झगड़ना', 'हुनर']),
  h('मेरे सबसे बुरे दिनों की नरम ज़मीन तुम हो।', 'Love and romance', 'सुकून', 'कोमल', ['बुरे', 'ज़मीन']),
  g('Tum woh ho jiske saath chalees saal bore hona bhi accha lage.', 'Love and romance', 'Commitment', 'Warm', ['chalees', 'bore']),
  g('Hum accha jhagadte hain aur jaldi sambhal jaate hain.', 'Love and romance', 'Respect', 'Wise', ['jhagadte', 'sambhal']),
  g('Mere sabse bure dinon ki naram zameen tum ho.', 'Love and romance', 'Comfort', 'Tender', ['bure', 'zameen']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I keep your side of the shelf empty. I know I should not.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'longing']),
  e('The city is full of places we used to be.', 'Sad and heartbreak', 'Absence', 'Heavy', ['sad', 'city']),
  e('I do not want you back. I want the quiet to stop.', 'Sad and heartbreak', 'Numbness', 'Raw', ['sad', 'numbness']),
  e('I have a good life and one permanent bruise.', 'Sad and heartbreak', 'Honesty', 'Honest', ['sad', 'honesty']),
  e('Time did not heal it. It just made room around it.', 'Sad and heartbreak', 'Recovery', 'Wise', ['sad', 'time']),
  h('तुम्हारा हिस्सा अलमारी में खाली रखा है, जानता हूँ यह ठीक नहीं।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['अलमारी', 'खाली']),
  h('शहर उन जगहों से भरा है जहाँ कभी हम हुआ करते थे।', 'Sad and heartbreak', 'गैरहाज़िरी', 'गंभीर', ['शहर', 'जगहें']),
  h('तुम वापस नहीं चाहिए, बस चुप्पी रुक जाए।', 'Sad and heartbreak', 'खालीपन', 'भावुक', ['वापस', 'चुप्पी']),
  h('मेरी ज़िंदगी अच्छी है, बस एक पुराना निशान भी है।', 'Sad and heartbreak', 'ईमानदारी', 'स्पष्ट', ['ज़िंदगी', 'निशान']),
  g('Tumhara hissa almari mein khaali rakha hai, jaanta hoon yeh theek nahi.', 'Sad and heartbreak', 'Longing', 'Aching', ['almari', 'theek']),
  g('Shehar un jagaon se bhara hai jahan kabhi hum hua karte the.', 'Sad and heartbreak', 'Absence', 'Heavy', ['shehar', 'jagaon']),
  g('Tum wapas nahi chahiye, bas chuppi ruk jaye.', 'Sad and heartbreak', 'Numbness', 'Raw', ['wapas', 'chuppi']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरे बिना भी\nमौसम बदलते हैं,\nबस मज़ा नहीं आता।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['मौसम', 'मज़ा']),
  h('मैं तेरी याद में\nजो लिखता था,\nवो अब किसी और के काम आ रहा है।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['याद', 'लिखना']),
  h('रात कट गई,\nसुबह हो गई,\nपर तेरा ख़त नहीं आया।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['रात', 'ख़त']),
  h('मुझे तेरी आदत थी,\nतेरी कमी नहीं,\nयह बहुत देर से समझा।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['आदत', 'कमी']),
  g('Tere bina bhi mausam badalte hain, bas maza nahi aata.', 'Shayari', 'Two line', 'Aching', ['mausam', 'maza']),
  g('Raat kat gayi, subah ho gayi, par tera khat nahi aaya.', 'Shayari', 'Two line', 'Aching', ['raat', 'khat']),
  g('Mujhe teri aadat thi, teri kami nahi, yeh bahut der se samjha.', 'Shayari', 'Two line', 'Deep', ['aadat', 'kami']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('Good taste is mostly knowing what to leave out.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'taste']),
  e('If you cannot explain it simply you do not understand it yet.', 'Quotes and thoughts', 'Clarity', 'Wise', ['quotes', 'clarity']),
  e('The best boundaries are the ones you set before you are angry.', 'Quotes and thoughts', 'Boundaries', 'Wise', ['quotes', 'boundaries']),
  e('You can respect someone and still not take their advice.', 'Quotes and thoughts', 'Discernment', 'Wise', ['quotes', 'respect']),
  e('Nobody remembers your slides. They remember how you made them feel.', 'Quotes and thoughts', 'Presence', 'Wise', ['quotes', 'presence']),
  h('अच्छा स्वाद ज़्यादातर यह जानने में है कि क्या छोड़ना है।', 'Quotes and thoughts', 'काम', 'गंभीर', ['स्वाद', 'छोड़ना']),
  h('अगर सरल नहीं समझा सकते, तो अभी समझा नहीं है।', 'Quotes and thoughts', 'स्पष्टता', 'गंभीर', ['सरल', 'समझना']),
  h('सबसे अच्छी सीमाएँ वो हैं जो गुस्से से पहले तय कर ली जाएँ।', 'Quotes and thoughts', 'सीमाएं', 'गंभीर', ['सीमाएँ', 'गुस्सा']),
  g('Accha swaad zyadatar yeh jaanne mein hai ki kya chhodna hai.', 'Quotes and thoughts', 'Craft', 'Wise', ['swaad', 'chhodna']),
  g('Agar saral nahi samjha sakte, toh abhi samjha nahi hai.', 'Quotes and thoughts', 'Clarity', 'Wise', ['saral', 'samjha']),
  g('Sabse acchi seemayein woh hain jo gusse se pehle tay kar li jayein.', 'Quotes and thoughts', 'Boundaries', 'Wise', ['seemayein', 'gusse']),

  /* ------------------------------------------------------ Life and reality */
  e('You are not a project. You are allowed to just live some weeks.', 'Life and reality', 'Acceptance', 'Warm', ['life', 'acceptance']),
  e('Most people are doing better than they look and worse than they claim.', 'Life and reality', 'People', 'Wry', ['life', 'people']),
  e('A good week is a decision, not a discovery.', 'Life and reality', 'Agency', 'Practical', ['life', 'agency']),
  e('The older you get the more you value a boring friend.', 'Life and reality', 'People', 'Warm', ['life', 'friendship']),
  h('तुम कोई प्रोजेक्ट नहीं हो, कुछ हफ़्ते सिर्फ़ जीने की इजाज़त है।', 'Life and reality', 'स्वीकृति', 'कोमल', ['प्रोजेक्ट', 'हफ़्ते']),
  h('ज़्यादातर लोग दिखने से बेहतर और कहने से खराब कर रहे हैं।', 'Life and reality', 'लोग', 'सहज', ['लोग', 'कहना']),
  h('बढ़ती उम्र में साधारण दोस्त की क़ीमत समझ आती है।', 'Life and reality', 'लोग', 'कोमल', ['उम्र', 'दोस्त']),
  g('Tum koi project nahi ho, kuch hafte sirf jeene ki ijazat hai.', 'Life and reality', 'Acceptance', 'Warm', ['project', 'hafte']),
  g('Zyadatar log dikhne se behtar aur kehne se kharab kar rahe hain.', 'Life and reality', 'People', 'Wry', ['log', 'kehne']),
  g('Badhti umar mein saadharan dost ki keemat samajh aati hai.', 'Life and reality', 'People', 'Warm', ['umar', 'dost']),

  /* --------------------------------------------------- Motivational depth */
  e('Do it badly, do it again, and stop calling it passion.', 'Motivational', 'Practice', 'Direct', ['motivation', 'practice']),
  e('The habit is the goal. The result is a by-product.', 'Motivational', 'Habit', 'Wise', ['motivation', 'habit']),
  e('You will not find a better teacher than a finished draft.', 'Motivational', 'Craft', 'Wise', ['motivation', 'craft']),
  h('बुरी तरह करो, फिर दोबारा करो, और उसे जुनून मत कहो।', 'Motivational', 'अभ्यास', 'स्पष्ट', ['अभ्यास', 'जुनून']),
  h('आदत ही लक्ष्य है, नतीजा सिर्फ़ उपज है।', 'Motivational', 'आदत', 'गंभीर', ['आदत', 'नतीजा']),
  g('Buri tarah karo, phir dobara karo, aur use junoon mat kaho.', 'Motivational', 'Practice', 'Direct', ['buri', 'junoon']),
  g('Aadat hi lakshya hai, nateeja sirf upaj hai.', 'Motivational', 'Habit', 'Wise', ['aadat', 'nateeja']),

  /* ------------------------------------------ Aesthetic / minimal / poetry */
  e('One plant, one lamp, one good chair.', 'Minimal', 'Home', 'Minimal', ['minimal', 'home']),
  e('A quiet room is a luxury you can actually build.', 'Aesthetic', 'Interiors', 'Calm', ['aesthetic', 'quiet']),
  e('Write the poem you are afraid to read out.', 'Poetry', 'Process', 'Honest', ['poetry', 'honest']),
  h('एक पौधा, एक लैंप, एक अच्छी कुर्सी।', 'Minimal', 'घर', 'संक्षिप्त', ['पौधा', 'कुर्सी']),
  h('शांत कमरा वो लक्ज़री है जो सच में बनाई जा सकती है।', 'Aesthetic', 'घर', 'शांत', ['कमरा', 'लक्ज़री']),
  g('Ek paudha, ek lamp aur ek acchi kursi — bas itna hi kaafi hai.', 'Minimal', 'Home', 'Minimal', ['paudha', 'kursi']),
  g('Shaant kamra woh luxury hai jo sach mein banai ja sakti hai.', 'Aesthetic', 'Interiors', 'Calm', ['kamra', 'luxury']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('A good edit is where most of the writing actually happens.', 'Poetry', 'Craft', 'Wise', ['poetry', 'editing']),
  e('My bookshelf is a record of every phase I survived.', 'Books and reading', 'Reader life', 'Warm', ['books', 'identity']),
  e('Cooking for one is not sad. It is practice for two.', 'Food and cooking', 'Cooking', 'Warm', ['food', 'practice']),
  e('The gym taught me to be comfortable being bad at things.', 'Fitness', 'Gym', 'Honest', ['fitness', 'learning']),
  e('I photograph the walk to work more than the work.', 'Photography', 'Street', 'Warm', ['photography', 'everyday']),
  e('Every playlist has one song I skip and never remove.', 'Music and art', 'Listening', 'Wry', ['music', 'nostalgia']),
  e('A cat will teach you consent faster than any book.', 'Pets and animals', 'Cats', 'Wry', ['pets', 'boundaries']),
  e('First rains are free entertainment for the whole street.', 'Monsoon and seasons', 'Monsoon', 'Warm', ['monsoon', 'street']),
  h('अच्छा संपादन ही असली लेखन है।', 'Poetry', 'रचना', 'गंभीर', ['संपादन', 'लेखन']),
  h('मेरी अलमारी के किताबें हर उस दौर का रिकॉर्ड हैं जो मैं झेल गया।', 'Books and reading', 'पढ़ना', 'कोमल', ['किताबें', 'दौर']),
  h('अकेले खाना बनाना उदासी नहीं, दो लोगों की तैयारी है।', 'Food and cooking', 'रसोई', 'कोमल', ['खाना', 'तैयारी']),
  h('जिम ने मुझे बुरा होने में सहज होना सिखाया।', 'Fitness', 'जिम', 'स्पष्ट', ['जिम', 'सहज']),
  g('Accha sampaadan hi asli lekhan hai.', 'Poetry', 'Craft', 'Wise', ['sampaadan', 'lekhan']),
  g('Akele khana banana udaasi nahi, do logon ki taiyaari hai.', 'Food and cooking', 'Cooking', 'Warm', ['khana', 'taiyaari']),
  g('Gym ne mujhe bura hone mein sahaj hona sikhaya.', 'Fitness', 'Gym', 'Honest', ['gym', 'sahaj']),
  g('Pehli baarish poori gali ke liye muft tamasha hai.', 'Monsoon and seasons', 'Monsoon', 'Warm', ['baarish', 'gali']),
];
