/**
 * BioCraft original bios — batch 051.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 33 HI / 32 HG.
 * New subject matter: queueing, interviews, shifting cities, siblings,
 * the first salary, repairing a friendship, being new in a neighbourhood.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_051 = [
  /* ------------------------------------------------------------ Attitude */
  e('I do not audition in interviews. I visit them.', 'Attitude', 'Confidence', 'Composed', ['attitude', 'interview']),
  e('I have been the new person enough times to be kind to one.', 'Attitude', 'Empathy', 'Warm', ['attitude', 'empathy']),
  e('I would rather be told no honestly than maybe politely.', 'Attitude', 'Directness', 'Firm', ['attitude', 'directness']),
  e('I can wait in a queue without becoming a worse person.', 'Attitude', 'Patience', 'Dry', ['attitude', 'queue']),
  h('मैं इंटरव्यू में परीक्षा नहीं देता, मुलाक़ात करता हूँ।', 'Attitude', 'आत्मविश्वास', 'शांत', ['इंटरव्यू', 'मुलाक़ात']),
  h('मैं इतनी बार नया इंसान रहा हूँ कि नए पर तरस आता है।', 'Attitude', 'सहानुभूति', 'कोमल', ['नया', 'तरस']),
  h('साफ़ मना शालीन "शायद" से बेहतर है।', 'Attitude', 'स्पष्टता', 'दृढ़', ['मना', 'शायद']),
  h('मैं क़तार में खड़ा होकर बुरा इंसान नहीं बन जाता।', 'Attitude', 'सब्र', 'सहज', ['क़तार', 'इंसान']),
  g('Main interview mein pariksha nahi deta, mulaqaat karta hoon.', 'Attitude', 'Confidence', 'Composed', ['interview', 'mulaqaat']),
  g('Main itni baar naya insaan raha hoon ki naye par taras aata hai.', 'Attitude', 'Empathy', 'Warm', ['naya', 'taras']),
  g('Saaf mana shaaleen "shayad" se behtar hai.', 'Attitude', 'Directness', 'Firm', ['mana', 'shayad']),

  /* ------------------------------------------------------------- Love */
  e('We met when neither of us was looking and that is why it worked.', 'Love and romance', 'Beginnings', 'Warm', ['love', 'beginnings']),
  e('I want a marriage where nobody is keeping a tally.', 'Love and romance', 'Partnership', 'Wise', ['love', 'tally']),
  e('You are the first person I want to annoy for forty years.', 'Love and romance', 'Playful', 'Sweet', ['love', 'playful']),
  e('Love is mostly logistics and I am happy to do the logistics.', 'Love and romance', 'Real love', 'Wry', ['love', 'logistics']),
  h('हम तब मिले जब दोनों कुछ ढूँढ नहीं रहे थे, इसीलिए चला।', 'Love and romance', 'शुरुआत', 'कोमल', ['मिले', 'ढूँढ']),
  h('मुझे ऐसी शादी चाहिए जहाँ कोई हिसाब न रखे।', 'Love and romance', 'साझेदारी', 'गंभीर', ['शादी', 'हिसाब']),
  h('तुम पहले इंसान हो जिसे मैं चालीस साल चिढ़ाना चाहता हूँ।', 'Love and romance', 'खेल', 'कोमल', ['चालीस', 'चिढ़ाना']),
  g('Hum tab mile jab dono kuch dhoondh nahi rahe the, isliye chala.', 'Love and romance', 'Beginnings', 'Warm', ['mile', 'dhoondh']),
  g('Mujhe aisi shaadi chahiye jahan koi hisaab na rakhe.', 'Love and romance', 'Partnership', 'Wise', ['shaadi', 'hisaab']),
  g('Tum pehle insaan ho jise main chalees saal chidhaana chahta hoon.', 'Love and romance', 'Playful', 'Sweet', ['chalees', 'chidhaana']),

  /* ------------------------------------------------------- Sad depth */
  e('The first salary felt large and the rent felt larger.', 'Sad and heartbreak', 'Growing up', 'Wry', ['sad', 'salary']),
  e('My brother and I share a childhood but not the same memories of it.', 'Sad and heartbreak', 'Siblings', 'Honest', ['sad', 'siblings']),
  e('Being new in a city is a loneliness with good lighting.', 'Sad and heartbreak', 'Loneliness', 'Sharp', ['sad', 'newcity']),
  e('I lost a friend over something small and we both stayed quiet.', 'Sad and heartbreak', 'Friendship', 'Heavy', ['sad', 'friendship']),
  h('पहली तनख़्वाह बड़ी लगी, किराया और बड़ा निकला।', 'Sad and heartbreak', 'बड़ी उम्र', 'सहज', ['तनख़्वाह', 'किराया']),
  h('भाई और मैंने एक बचपन बाँटा है, यादें नहीं।', 'Sad and heartbreak', 'भाई-बहन', 'स्पष्ट', ['बचपन', 'यादें']),
  h('नए शहर में अकेलापन भी अच्छी रोशनी में होता है।', 'Sad and heartbreak', 'अकेलापन', 'तीखा', ['शहर', 'अकेलापन']),
  h('एक छोटी बात पर दोस्ती गई, और दोनों चुप रहे।', 'Sad and heartbreak', 'दोस्ती', 'भारी', ['दोस्ती', 'चुप']),
  g('Pehli tankhwah badi lagi, kiraaya aur bada nikla.', 'Sad and heartbreak', 'Growing up', 'Wry', ['tankhwah', 'kiraaya']),
  g('Bhai aur maine ek bachpan baanta hai, yaadein nahi.', 'Sad and heartbreak', 'Siblings', 'Honest', ['bachpan', 'yaadein']),
  g('Naye shehar mein akelapan bhi achhi roshni mein hota hai.', 'Sad and heartbreak', 'Loneliness', 'Sharp', ['shehar', 'akelapan']),

  /* --------------------------------------------------------- Shayari */
  h('नए शहर में\nपहली रात\nसबसे लंबी होती है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शहर', 'रात']),
  h('मैंने तुझे\nपहली बार\nभीड़ में पहचाना।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['भीड़', 'पहचाना']),
  g('Naye shehar mein pehli raat sabse lambi hoti hai.', 'Shayari', 'Two line', 'Aching', ['shehar', 'raat']),
  g('Maine tujhe pehli baar bheed mein pehchana.', 'Shayari', 'Two line', 'Romantic', ['bheed', 'pehchana']),

  /* -------------------------------------------------- Quotes and ideas */
  e('The first month of any job is mostly learning names.', 'Quotes and thoughts', 'Work', 'Wry', ['quotes', 'work']),
  e('An interview is a conversation with a scoreboard, not a trial.', 'Quotes and thoughts', 'Work', 'Wise', ['quotes', 'interview']),
  e('Repair a friendship before you need it.', 'Quotes and thoughts', 'Friendship', 'Wise', ['quotes', 'repair']),
  h('किसी भी नौकरी का पहला महीना नाम याद करने में जाता है।', 'Quotes and thoughts', 'काम', 'सहज', ['नौकरी', 'नाम']),
  h('तनख़्वाह का एक हिस्सा वो हो जिसे छूना ही नहीं।', 'Quotes and thoughts', 'पैसा', 'व्यावहारिक', ['तनख़्वाह', 'हिस्सा']),
  h('इंटरव्यू स्कोरबोर्ड वाली बातचीत है, मुक़दमा नहीं।', 'Quotes and thoughts', 'काम', 'गंभीर', ['इंटरव्यू', 'बातचीत']),
  h('दोस्ती उसकी ज़रूरत पड़ने से पहले ठीक करो।', 'Quotes and thoughts', 'दोस्ती', 'गंभीर', ['दोस्ती', 'ठीक']),
  g('Kisi bhi naukri ka pehla mahina naam yaad karne mein jaata hai.', 'Quotes and thoughts', 'Work', 'Wry', ['naukri', 'naam']),
  g('Tankhwah ka ek hissa woh ho jise chhoona hi nahi.', 'Quotes and thoughts', 'Money', 'Practical', ['tankhwah', 'hissa']),
  g('Interview scoreboard wali baatcheet hai, muqadma nahi.', 'Quotes and thoughts', 'Work', 'Wise', ['interview', 'baatcheet']),

  /* ------------------------------------------------- Life and reality */
  e('Shifting cities is mostly cardboard and sudden opinions.', 'Life and reality', 'Moving', 'Wry', ['life', 'moving']),
  e('Nobody teaches you how to read a payslip.', 'Life and reality', 'Adulting', 'Direct', ['life', 'payslip']),
  e('Your first flat will be bad and you will love it.', 'Life and reality', 'Firsts', 'Warm', ['life', 'flat']),
  e('Greet the guard and the shopkeeper. That is how a city becomes yours.', 'Life and reality', 'Belonging', 'Warm', ['life', 'neighbours']),
  h('शहर बदलना ज़्यादातर गत्ते और अचानक बनी राय है।', 'Life and reality', 'घर बदलना', 'सहज', ['गत्ते', 'राय']),
  h('पे-स्लिप पढ़ना कोई नहीं सिखाता।', 'Life and reality', 'बड़ी उम्र', 'स्पष्ट', ['पे-स्लिप', 'सिखाता']),
  h('तुम्हारा पहला फ्लैट खराब होगा और तुम उसे प्यार करोगे।', 'Life and reality', 'पहली बार', 'कोमल', ['फ्लैट', 'प्यार']),
  h('गार्ड और दुकानदार को नमस्ते करो, तभी शहर अपना लगता है।', 'Life and reality', 'अपनापन', 'कोमल', ['शहर', 'नमस्ते']),
  g('Shehar badalna zyadatar gatte aur achanak bani raay hai.', 'Life and reality', 'Moving', 'Wry', ['shehar', 'raay']),
  g('Pay-slip padhna koi nahi sikhaata.', 'Life and reality', 'Adulting', 'Direct', ['pay', 'sikhaata']),
  g('Guard aur dukandaar ko namaste karo, tabhi shehar apna lagta hai.', 'Life and reality', 'Belonging', 'Warm', ['shehar', 'namaste']),

  /* ------------------------------------------------------ Motivational */
  e('Apply before you feel qualified. Nobody feels qualified.', 'Motivational', 'Courage', 'Direct', ['motivation', 'apply']),
  e('Learn the names and you will learn the job twice as fast.', 'Motivational', 'Learning', 'Practical', ['motivation', 'names']),
  e('You are allowed to be bad at your first job.', 'Motivational', 'Permission', 'Warm', ['motivation', 'firstjob']),
  h('इससे पहले अप्लाई करो कि तुम खुद को लायक़ समझो।', 'Motivational', 'साहस', 'स्पष्ट', ['अप्लाई', 'लायक़']),
  h('किसी भी जगह का पहला महीना असहज होने के लिए बना है।', 'Motivational', 'सब्र', 'गंभीर', ['महीना', 'असहज']),
  h('नाम याद कर लो, काम दोगुनी तेज़ी से आएगा।', 'Motivational', 'सीखना', 'व्यावहारिक', ['नाम', 'काम']),
  g('Isse pehle apply karo ki tum khud ko laayak samjho.', 'Motivational', 'Courage', 'Direct', ['apply', 'laayak']),
  g('Kisi bhi jagah ka pehla mahina asahaj hone ke liye bana hai.', 'Motivational', 'Patience', 'Wise', ['mahina', 'asahaj']),
  g('Naam yaad kar lo, kaam doguni tezi se aayega.', 'Motivational', 'Learning', 'Practical', ['naam', 'kaam']),

  /* -------------------------------------------------------- Aesthetic */
  e('A rented flat becomes yours the day you hang something crooked.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'rented']),
  e('Boxes become shelves if you stop apologising for them.', 'Aesthetic', 'Furniture', 'Wry', ['aesthetic', 'boxes']),
  h('किराए का फ्लैट उस दिन अपना होता है जब कुछ तिरछा टाँग दो।', 'Aesthetic', 'घर', 'कोमल', ['फ्लैट', 'तिरछा']),
  h('सही जगह पर एक बल्ब पूरा पहला फ्लैट ठीक कर देता है।', 'Aesthetic', 'रोशनी', 'व्यावहारिक', ['बल्ब', 'फ्लैट']),
  g('Kiraaye ka flat us din apna hota hai jab kuch tirchha taang do.', 'Aesthetic', 'Home', 'Warm', ['flat', 'tirchha']),
  g('Sahi jagah par ek bulb poora pehla flat theek kar deta hai.', 'Aesthetic', 'Light', 'Practical', ['bulb', 'flat']),

  /* ---------------------------------------------- Wider category band */
  e('Walk twenty minutes after dinner and sleep will come earlier.', 'Yoga and wellness', 'Habit', 'Practical', ['yoga', 'walk']),
  e('In a meeting, whoever writes the notes runs the room.', 'Professional and business', 'Meetings', 'Wise', ['professional', 'notes']),
  e('A new ball does more than a new bat.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'practise']),
  e('Check the spare tyre before the trip, not during it.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'spare']),
  e('A blazer that fits is worth four that are on sale.', 'Fashion and beauty', 'Fit', 'Practical', ['fashion', 'blazer']),
  e('Commit your working state before you refactor.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'refactor']),
  e('Write down the result before you know what it means.', 'Science and curiosity', 'Method', 'Wise', ['science', 'method']),
  e('Your first hire sets the temperature for everything after.', 'Startup and hustle', 'Hiring', 'Direct', ['startup', 'hiring']),
  e('Fix the leak before you paint the ceiling.', 'Home and interiors', 'Repair', 'Practical', ['home', 'repair']),
  e('A funny story told badly is still a good evening.', 'Funny and comedy', 'Storytelling', 'Warm', ['funny', 'storytelling']),
  e('Say the necessary thing once and let it stand.', 'Savage and bold', 'Directness', 'Firm', ['savage', 'directness']),
  e('The first friend you make in a new city is usually the one who fed you.', 'Friendship', 'New places', 'Warm', ['friendship', 'newcity']),
  e('Siblings remember the same kitchen differently and both are right.', 'Family', 'Siblings', 'Wise', ['family', 'siblings']),
  e('Eating alone in a new city is the first adult skill.', 'Alone and loneliness', 'Solitude', 'Warm', ['alone', 'newcity']),
  e('Light a lamp before you ask for anything.', 'Spirituality and peace', 'Practice', 'Warm', ['spirituality', 'lamp']),
  e('Photograph your first flat before it stops being a mess.', 'Photography', 'Home', 'Warm', ['photography', 'firstflat']),
  e('Late night trains smell of other peoples lives, and that is the point.', 'Travel and adventure', 'Trains', 'Warm', ['travel', 'trains']),
  e('A profile with one honest photograph is enough.', 'Instagram profiles', 'Approach', 'Wise', ['instagram', 'honest']),
  e('I am the person who reads the manual, and I am at peace with that.', 'Personality and identity', 'Identity', 'Wry', ['personality', 'manual']),
  e('My first salary bought my mother a phone and myself a lesson.', 'Self-respect', 'Growing up', 'Warm', ['selfrespect', 'salary']),
  e('Monsoon is when a new city finally tells you its name.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'newcity']),
  h('नए शहर में अकेले खाना खाना पहला बड़ा हुनर है।', 'Alone and loneliness', 'अकेलापन', 'कोमल', ['शहर', 'खाना']),
  h('कुछ माँगने से पहले एक दीया जला दो।', 'Spirituality and peace', 'अभ्यास', 'कोमल', ['दीया', 'माँगने']),
  h('भाई-बहन एक ही रसोई को अलग-अलग याद करते हैं, और दोनों सही हैं।', 'Family', 'भाई-बहन', 'गंभीर', ['रसोई', 'सही']),
  h('देर रात की ट्रेन में दूसरों की ज़िंदगी की महक होती है।', 'Travel and adventure', 'ट्रेन', 'कोमल', ['ट्रेन', 'महक']),
  h('पहली तनख़्वाह से माँ को फ़ोन लिया और खुद को सबक़।', 'Self-respect', 'बड़ी उम्र', 'कोमल', ['तनख़्वाह', 'सबक़']),
  g('Naye shehar mein akele khaana khaana pehla bada hunar hai.', 'Alone and loneliness', 'Solitude', 'Warm', ['shehar', 'khaana']),
  g('Kuch maangne se pehle ek diya jala do.', 'Spirituality and peace', 'Practice', 'Warm', ['diya', 'maangne']),
  g('Bhai-behen ek hi rasoi ko alag-alag yaad karte hain, aur dono sahi hain.', 'Family', 'Siblings', 'Wise', ['rasoi', 'sahi']),
  g('Der raat ki train mein doosron ki zindagi ki mehak hoti hai.', 'Travel and adventure', 'Trains', 'Warm', ['train', 'mehak']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('बल्ब सही जगह लगाओ, पहला फ्लैट अपना लगने लगेगा।', 'Aesthetic', 'रोशनी', 'व्यावहारिक', ['बल्ब', 'फ्लैट']),
  h('एक कमीज़ की कॉलर सीधी हो, बाकी सब माफ़ है।', 'Stylish', 'अंदाज़', 'व्यावहारिक', ['कमीज़', 'कॉलर']),
  h('बिल्कुल नए शहर में पहला काम है एक चाय की दुकान ढूँढना।', 'Life and reality', 'नया शहर', 'सहज', ['शहर', 'चाय']),
  h('इंटरव्यू में सच बोलो, नौकरी झूठ से ज़्यादा टिकती है।', 'Professional and business', 'ईमानदारी', 'स्पष्ट', ['इंटरव्यू', 'सच']),
  h('पहला वेतन छोटा लगता है, सबक़ बड़ा मिलता है।', 'Self-respect', 'बड़ी उम्र', 'कोमल', ['वेतन', 'सबक़']),
  h('भाई-बहन से माफ़ी माँगना सबसे आसान और सबसे कठिन है।', 'Family', 'भाई-बहन', 'कोमल', ['माफ़ी', 'कठिन']),
  g('Bulb sahi jagah lagao, pehla flat apna lagne lagega.', 'Aesthetic', 'Light', 'Practical', ['bulb', 'flat']),
  g('Ek kameez ki collar seedhi ho, baaki sab maaf hai.', 'Stylish', 'Details', 'Practical', ['kameez', 'collar']),
  g('Bilkul naye shehar mein pehla kaam hai ek chai ki dukaan dhoondhna.', 'Life and reality', 'New places', 'Warm', ['shehar', 'chai']),
  g('Interview mein sach bolo, naukri jhooth se zyada tikti hai.', 'Professional and business', 'Honesty', 'Direct', ['interview', 'sach']),
  g('Pehla vetan chhota lagta hai, sabak bada milta hai.', 'Self-respect', 'Growing up', 'Warm', ['vetan', 'sabak']),
  g('Bhai-behen se maafi maangna sabse aasaan aur sabse mushkil hai.', 'Family', 'Siblings', 'Warm', ['maafi', 'mushkil']),
];
