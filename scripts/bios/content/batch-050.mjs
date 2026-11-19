/**
 * BioCraft original bios — batch 050.
 * Allocation from scripts/bios/balance.mjs: 41 EN / 34 HI / 35 HG.
 * Deliberately new subject matter: asking directions, hospital waiting rooms,
 * parents ageing, moving house, learning to drive late, being wrong out loud.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_050 = [
  /* ------------------------------------------------------------ Attitude */
  e('I ask for directions. It is cheaper than being lost with dignity.', 'Attitude', 'Humility', 'Wry', ['attitude', 'directions']),
  e('I can be wrong out loud. It took me years to learn that trick.', 'Attitude', 'Humility', 'Honest', ['attitude', 'wrong']),
  e('I arrive early because I refuse to spend energy apologising.', 'Attitude', 'Discipline', 'Practical', ['attitude', 'punctual']),
  e('My consistency is a form of respect for people who rely on me.', 'Attitude', 'Reliability', 'Firm', ['attitude', 'reliability']),
  h('मैं रास्ता पूछ लेता हूँ। इज़्ज़त बचाकर भटकने से सस्ता है।', 'Attitude', 'विनम्रता', 'सहज', ['रास्ता', 'भटकने']),
  h('मैं सबके सामने ग़लत हो सकता हूँ। यह सीखने में साल लगे।', 'Attitude', 'विनम्रता', 'स्पष्ट', ['ग़लत', 'सीखने']),
  h('मैं जल्दी पहुँचता हूँ क्योंकि माफ़ी में ऊर्जा ख़र्च नहीं करनी।', 'Attitude', 'अनुशासन', 'व्यावहारिक', ['जल्दी', 'माफ़ी']),
  h('मुझे आख़िरी शब्द नहीं चाहिए, चुपचाप आख़िरी हँसी चाहिए।', 'Attitude', 'संयम', 'सहज', ['शब्द', 'हँसी']),
  g('Main raasta pooch leta hoon. Izzat bachakar bhatakne se sasta hai.', 'Attitude', 'Humility', 'Wry', ['raasta', 'bhatakne']),
  g('Main sabke saamne galat ho sakta hoon. Yeh seekhne mein saal lage.', 'Attitude', 'Humility', 'Honest', ['galat', 'seekhne']),
  g('Main jaldi pahunchta hoon kyunki maafi mein energy kharch nahi karni.', 'Attitude', 'Discipline', 'Practical', ['jaldi', 'maafi']),

  /* ------------------------------------------------------------- Love */
  e('We fight about the dishes because the real fight is always about attention.', 'Love and romance', 'Real love', 'Sharp', ['love', 'chores']),
  e('I liked you before I knew your family. I liked you more after.', 'Love and romance', 'Family', 'Warm', ['love', 'family']),
  e('I want to be the person who shares the load, not the list.', 'Love and romance', 'Partnership', 'Wise', ['love', 'chores']),
  e('You are the only person I can be silent with and not panic.', 'Love and romance', 'Comfort', 'Tender', ['love', 'silence']),
  h('हम बर्तनों पर झगड़ते हैं क्योंकि असली झगड़ा ध्यान का होता है।', 'Love and romance', 'सच्चा प्यार', 'तीखा', ['बर्तनों', 'ध्यान']),
  h('मैंने तुम्हें परिवार से पहले पसंद किया, बाद में और ज़्यादा।', 'Love and romance', 'परिवार', 'कोमल', ['पसंद', 'परिवार']),
  h('दूरी ने सिखाया कि वॉइस नोट भी पूरा कमरा हो सकता है।', 'Love and romance', 'दूरी', 'कोमल', ['दूरी', 'कमरा']),
  h('मैं सूची नहीं, बोझ बाँटने वाला इंसान बनना चाहता हूँ।', 'Love and romance', 'साझेदारी', 'गंभीर', ['सूची', 'बोझ']),
  g('Hum bartanon par jhagadte hain kyunki asli jhagda dhyan ka hota hai.', 'Love and romance', 'Real love', 'Sharp', ['bartanon', 'dhyan']),
  g('Maine tumhe parivaar se pehle pasand kiya, baad mein aur zyada.', 'Love and romance', 'Family', 'Warm', ['pasand', 'parivaar']),
  g('Doori ne sikhaya ki voice note bhi poora kamra ho sakta hai.', 'Love and romance', 'Distance', 'Tender', ['doori', 'kamra']),

  /* ------------------------------------------------------- Sad depth */
  e('Hospital waiting rooms teach you what you actually fear.', 'Sad and heartbreak', 'Fear', 'Heavy', ['sad', 'hospital']),
  e('My father carries bags now that I used to carry for him.', 'Sad and heartbreak', 'Ageing', 'Aching', ['sad', 'parents']),
  e('Emptying a childhood house is a slower grief than any funeral.', 'Sad and heartbreak', 'Home', 'Heavy', ['sad', 'house']),
  h('अस्पताल के इंतज़ार में पता चलता है कि असली डर किसका है।', 'Sad and heartbreak', 'डर', 'भारी', ['अस्पताल', 'डर']),
  h('अब पापा वो बैग उठाते हैं जो मैं उठाता था।', 'Sad and heartbreak', 'उम्र', 'भावुक', ['पापा', 'बैग']),
  h('बचपन का घर खाली करना किसी अंतिम संस्कार से भी धीमा ग़म है।', 'Sad and heartbreak', 'घर', 'भारी', ['घर', 'ग़म']),
  h('जो शहर छोड़ा, वहाँ की दुकानों में अब भी मेरा पुराना नंबर है।', 'Sad and heartbreak', 'जगह', 'शांत', ['शहर', 'नंबर']),
  g('Hospital ke intezaar mein pata chalta hai ki asli dar kiska hai.', 'Sad and heartbreak', 'Fear', 'Heavy', ['hospital', 'dar']),
  g('Ab papa woh bag uthate hain jo main uthata tha.', 'Sad and heartbreak', 'Ageing', 'Aching', ['papa', 'bag']),
  g('Bachpan ka ghar khaali karna kisi antim sanskar se bhi dheema gham hai.', 'Sad and heartbreak', 'Home', 'Heavy', ['ghar', 'gham']),

  /* --------------------------------------------------------- Shayari */
  h('तेरे नाम की\nचिट्ठी\nअब भी अनपढ़ी है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['चिट्ठी', 'नाम']),
  h('बारिश रुकी,\nऔर मैं\nतेरे इंतज़ार में रुका।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['बारिश', 'इंतज़ार']),
  g('Tere naam ki chitthi ab bhi anpadhi hai.', 'Shayari', 'Two line', 'Aching', ['chitthi', 'naam']),
  g('Baarish ruki, aur main tere intezaar mein ruka.', 'Shayari', 'Two line', 'Romantic', ['baarish', 'intezaar']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A promise to a child must cost you something or it teaches nothing.', 'Quotes and thoughts', 'Parenting', 'Wise', ['quotes', 'promise']),
  e('Learning late is still learning. Ask anyone who started at fifty.', 'Quotes and thoughts', 'Learning', 'Warm', ['quotes', 'learning']),
  h('दोस्तों को पैसा सोचकर दो, और दिल से भूल जाओ।', 'Quotes and thoughts', 'दोस्ती', 'गंभीर', ['पैसा', 'दोस्तों']),
  h('बच्चे से किया वादा तुम्हें कुछ महँगा पड़े, तभी सीख मिलती है।', 'Quotes and thoughts', 'परवरिश', 'गंभीर', ['वादा', 'बच्चे']),
  h('सेहत ही वो पूँजी है जिसके एवज़ में क़र्ज़ नहीं मिलता।', 'Quotes and thoughts', 'सेहत', 'तीखा', ['सेहत', 'क़र्ज़']),
  h('पचास की उम्र में शुरू करने वाले से पूछो, देर से सीखना भी सीखना है।', 'Quotes and thoughts', 'सीखना', 'कोमल', ['उम्र', 'सीखना']),
  g('Doston ko paisa sochkar do, aur dil se bhool jao.', 'Quotes and thoughts', 'Friendship', 'Wise', ['paisa', 'doston']),
  g('Bachche se kiya waada tumhe kuch mehnga pade, tabhi seekh milti hai.', 'Quotes and thoughts', 'Parenting', 'Wise', ['waada', 'bachche']),
  g('Sehat hi woh poonji hai jiske ewaz mein karz nahi milta.', 'Quotes and thoughts', 'Health', 'Sharp', ['sehat', 'karz']),

  /* ------------------------------------------------- Life and reality */
  e('I learned to drive at thirty-four and cried in a parking lot.', 'Life and reality', 'Late start', 'Honest', ['life', 'driving']),
  e('Nobody warns you how much of adulthood is forms.', 'Life and reality', 'Adulting', 'Wry', ['life', 'paperwork']),
  e('Take the photograph of your parents. Do it this visit.', 'Life and reality', 'Family', 'Warm', ['life', 'parents']),
  h('मैंने चौंतीस की उम्र में गाड़ी चलानी सीखी और पार्किंग में रोया।', 'Life and reality', 'देर से शुरुआत', 'स्पष्ट', ['गाड़ी', 'पार्किंग']),
  h('रात में दरवाज़े की दस्तक सबसे तेज़ डर है।', 'Life and reality', 'हकीकत', 'तीखा', ['दस्तक', 'डर']),
  h('घर बदलना सबसे तेज़ तरीक़ा है यह जानने का कि असल में क्या है तुम्हारा।', 'Life and reality', 'घर बदलना', 'सहज', ['घर', 'तरीक़ा']),
  h('मम्मी-पापा की तस्वीर खींच लो। इसी बार खींचो।', 'Life and reality', 'परिवार', 'कोमल', ['तस्वीर', 'बार']),
  g('Maine chauntees ki umar mein gaadi chalana seekhi aur parking mein roya.', 'Life and reality', 'Late start', 'Honest', ['gaadi', 'parking']),
  g('Koi nahi batata ki badi umar ka zyadatar hissa form bharna hai.', 'Life and reality', 'Adulting', 'Wry', ['form', 'hissa']),
  g('Raat mein darwaze ki dastak sabse tez dar hai.', 'Life and reality', 'Reality', 'Sharp', ['dastak', 'dar']),
  g('Ghar badalna sabse tez tareeqa hai yeh jaanne ka ki asal mein kya hai tumhara.', 'Life and reality', 'Moving', 'Wry', ['ghar', 'tareeqa']),

  /* ------------------------------------------------------ Motivational */
  e('Being bad at something in public is a skill worth acquiring.', 'Motivational', 'Courage', 'Direct', ['motivation', 'beginner']),
  e('The first attempt is for information, not for applause.', 'Motivational', 'Craft', 'Wise', ['motivation', 'attempt']),
  h('सबके सामने किसी चीज़ में कमज़ोर होना भी एक हुनर है।', 'Motivational', 'साहस', 'स्पष्ट', ['कमज़ोर', 'हुनर']),
  h('किसी भी उम्र में नई चीज़ शुरू करो और खुशी से औसत रहो।', 'Motivational', 'इजाज़त', 'कोमल', ['उम्र', 'शुरू']),
  h('पहली कोशिश जानकारी के लिए है, तालियों के लिए नहीं।', 'Motivational', 'कला', 'गंभीर', ['कोशिश', 'तालियों']),
  g('Sabke saamne kisi cheez mein kamzor hona bhi ek hunar hai.', 'Motivational', 'Courage', 'Direct', ['kamzor', 'hunar']),
  g('Kisi bhi umar mein nayi cheez shuru karo aur khushi se ausat raho.', 'Motivational', 'Permission', 'Warm', ['umar', 'ausat']),
  g('Pehli koshish jaankari ke liye hai, taaliyon ke liye nahi.', 'Motivational', 'Craft', 'Wise', ['koshish', 'taaliyon']),

  /* -------------------------------------------------------- Aesthetic */
  e('A balcony in monsoon is the best room in the house.', 'Aesthetic', 'Monsoon', 'Warm', ['aesthetic', 'balcony']),
  e('Repair the wooden chair. It will outlive three new ones.', 'Aesthetic', 'Repair', 'Practical', ['aesthetic', 'repair']),
  h('मानसून में बालकनी घर का सबसे अच्छा कमरा है।', 'Aesthetic', 'मानसून', 'कोमल', ['बालकनी', 'कमरा']),
  h('लकड़ी की कुर्सी ठीक करवाओ, वो तीन नई से ज़्यादा चलेगी।', 'Aesthetic', 'मरम्मत', 'व्यावहारिक', ['कुर्सी', 'मरम्मत']),
  h('एक कुर्सी ज़िंदगी भर रखो, बाकी बदलती रहें।', 'Aesthetic', 'चीज़ें', 'शांत', ['कुर्सी', 'बदलती']),
  g('Monsoon mein balcony ghar ka sabse accha kamra hai.', 'Aesthetic', 'Monsoon', 'Warm', ['balcony', 'kamra']),
  g('Lakdi ki kursi theek karwao, woh teen nayi se zyada chalegi.', 'Aesthetic', 'Repair', 'Practical', ['kursi', 'theek']),

  /* ---------------------------------------------- Wider category band */
  e('Sit on the floor for ten minutes and your hips will forgive you.', 'Yoga and wellness', 'Movement', 'Practical', ['yoga', 'floor']),
  e('Exam fear is mostly an unopened book.', 'Student life', 'Exams', 'Sharp', ['student', 'fear']),
  e('Say the bad news early. It is the only way to keep trust.', 'Professional and business', 'Honesty', 'Direct', ['professional', 'badnews']),
  e('A dropped catch teaches more than a century.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'catching']),
  e('Learn the clutch slowly or learn the clutch loudly.', 'Cars and bikes', 'Driving', 'Wry', ['cars', 'clutch']),
  e('Read your own code six months later and you will meet a stranger.', 'Technology and coding', 'Craft', 'Wry', ['tech', 'readability']),
  e('Measure twice and write the units down.', 'Science and curiosity', 'Method', 'Practical', ['science', 'units']),
  e('Your first pricing page is a hypothesis, not a decision.', 'Startup and hustle', 'Pricing', 'Wise', ['startup', 'pricing']),
  e('A home with a place for everything needs no tidying.', 'Home and interiors', 'Storage', 'Practical', ['home', 'storage']),
  e('Keep one ugly useful thing and stop apologising for it.', 'Minimal', 'Living', 'Wry', ['minimal', 'useful']),
  e('I will disagree with you in the room, not behind you.', 'Savage and bold', 'Integrity', 'Firm', ['savage', 'integrity']),
  e('Grief has no schedule, and that is not a failure of yours.', 'Deep and emotional', 'Grief', 'Warm', ['deep', 'grief']),
  e('A profile that shows your ordinary days will outlast a trend.', 'Instagram profiles', 'Approach', 'Wise', ['instagram', 'ordinary']),
  e('I would rather be a steady person than an exciting one.', 'Personality and identity', 'Identity', 'Composed', ['personality', 'steady']),
  e('I will not shrink to make somebody comfortable in their smallness.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'worth']),
  e('Ageing parents need your time more than your opinions.', 'Family', 'Ageing', 'Warm', ['family', 'ageing']),
  e('A friend in a hospital corridor is worth ten in a party.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'hospital']),
  e('Learning to eat alone in a restaurant is a small liberation.', 'Alone and loneliness', 'Solitude', 'Warm', ['alone', 'restaurant']),
  e('One honest sentence of prayer beats an hour of borrowed words.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'prayer']),
  e('Monsoon makes strangers share a shop doorway and talk.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'rain']),
  e('Ask a local where to eat and the trip changes.', 'Travel and adventure', 'Locals', 'Warm', ['travel', 'locals']),
  e('Photograph your city before it changes. It always changes.', 'Photography', 'Cities', 'Wise', ['photography', 'city']),
  h('दस मिनट ज़मीन पर बैठो, कूल्हे माफ़ कर देंगे।', 'Yoga and wellness', 'गति', 'व्यावहारिक', ['ज़मीन', 'कूल्हे']),
  h('बुरी ख़बर जल्दी बताओ, भरोसा बचाने का यही एक तरीक़ा है।', 'Professional and business', 'ईमानदारी', 'स्पष्ट', ['ख़बर', 'भरोसा']),
  h('छूटा कैच सेंचुरी से ज़्यादा सिखाता है।', 'Cricket and sports', 'क्रिकेट', 'गंभीर', ['कैच', 'सेंचुरी']),
  h('बुज़ुर्ग माँ-बाप को तुम्हारी राय से ज़्यादा तुम्हारा वक़्त चाहिए।', 'Family', 'उम्र', 'कोमल', ['वक़्त', 'राय']),
  h('मानसून अजनबियों को एक दुकान के दरवाज़े पर बात करा देता है।', 'Monsoon and seasons', 'बारिश', 'कोमल', ['मानसून', 'दुकान']),
  h('स्थानीय से पूछो कहाँ खाना है, यात्रा बदल जाती है।', 'Travel and adventure', 'स्थानीय', 'कोमल', ['यात्रा', 'स्थानीय']),
  h('अपने शहर की तस्वीरें बदलने से पहले खींच लो, वो बदलता ही है।', 'Photography', 'शहर', 'गंभीर', ['शहर', 'तस्वीरें']),
  g('Das minute zameen par baitho, koole maaf kar denge.', 'Yoga and wellness', 'Movement', 'Practical', ['zameen', 'koole']),
  g('Buri khabar jaldi batao, bharosa bachane ka yahi ek tareeqa hai.', 'Professional and business', 'Honesty', 'Direct', ['khabar', 'bharosa']),
  g('Chhoota catch century se zyada sikhaata hai.', 'Cricket and sports', 'Cricket', 'Wise', ['catch', 'century']),
  g('Buzurg maa-baap ko tumhari raay se zyada tumhara waqt chahiye.', 'Family', 'Ageing', 'Warm', ['waqt', 'raay']),
  g('Monsoon ajnabiyon ko ek dukaan ke darwaze par baat kara deta hai.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'dukaan']),
  g('Sthaniya se poocho kahan khaana hai, yatra badal jaati hai.', 'Travel and adventure', 'Locals', 'Warm', ['yatra', 'sthaniya']),
  g('Apne shehar ki tasveerein badalne se pehle kheench lo, woh badalta hi hai.', 'Photography', 'Cities', 'Wise', ['shehar', 'tasveerein']),

  /* ---------------------------------- Hinglish top-up to balance.mjs figure */
  g('Dost ko paisa sochkar do, aur phir dhang se bhool jao.', 'Friendship', 'Generosity', 'Wise', ['dost', 'paisa']),
  g('Raat ko darwaze ki dastak par dil pehle sunta hai, kaan baad mein.', 'Life and reality', 'Reality', 'Sharp', ['raat', 'dastak']),
  g('Ghar badalne par pata chalta hai ki kitna kachra sambhal rakha tha.', 'Life and reality', 'Moving', 'Wry', ['ghar', 'kachra']),
  g('Pachpan ka ghar khaali karte waqt har kone se ek kahani nikalti hai.', 'Family', 'Home', 'Aching', ['ghar', 'kahani']),
  g('Bachche se kiya waada pura karo, warna woh jhooth seekh jaata hai.', 'Parenting', 'Promise', 'Warm', ['waada', 'bachche']),
  g('Maa-baap ki tasveer isi baar kheench lo, agla mauka pata nahi.', 'Family', 'Ageing', 'Aching', ['tasveer', 'mauka']),
  g('Kapde dhang ke pehno, taaki baat suni jaye.', 'Fashion and beauty', 'Style', 'Practical', ['kapde', 'baat']),
  g('Har cheez ke liye jagah banao, phir ghar saaf rakhna aasaan hai.', 'Home and interiors', 'Storage', 'Practical', ['jagah', 'ghar']),
];
