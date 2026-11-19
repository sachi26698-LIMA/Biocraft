/**
 * BioCraft original bios — batch 053.
 * Allocation from scripts/bios/balance.mjs: 46 EN / 30 HI / 34 HG.
 * New subject matter: night shifts, the tailor, hospital bills, house hunting,
 * learning to say sorry to a child, the gym in January.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_053 = [
  /* ------------------------------------------------------------ Attitude */
  e('I would rather be trusted than admired.', 'Attitude', 'Character', 'Composed', ['attitude', 'trust']),
  e('I negotiate in daylight and never in anger.', 'Attitude', 'Composure', 'Firm', ['attitude', 'negotiate']),
  e('The tailor knows my measurements and I know his name.', 'Attitude', 'Respect', 'Warm', ['attitude', 'respect']),
  h('मुझे सराहा जाने से ज़्यादा भरोसे पर रखा जाना चाहिए।', 'Attitude', 'चरित्र', 'शांत', ['भरोसा', 'सराहा']),
  h('मैं दिन की रोशनी में बात करता हूँ, ग़ुस्से में कभी नहीं।', 'Attitude', 'संयम', 'दृढ़', ['रोशनी', 'ग़ुस्से']),
  h('दर्ज़ी मेरा नाप जानता है और मैं उसका नाम।', 'Attitude', 'सम्मान', 'कोमल', ['दर्ज़ी', 'नाम']),
  h('अपनी कहानी में मुझे सबसे ज़रूरी इंसान होने की ज़रूरत नहीं।', 'Attitude', 'परिपक्वता', 'गंभीर', ['कहानी', 'ज़रूरत']),
  g('Mujhe saraha jaane se zyada bharose par rakha jaana chahiye.', 'Attitude', 'Character', 'Composed', ['bharosa', 'saraha']),
  g('Main din ki roshni mein baat karta hoon, gusse mein kabhi nahi.', 'Attitude', 'Composure', 'Firm', ['roshni', 'gusse']),
  g('Darzi mera naap jaanta hai aur main uska naam.', 'Attitude', 'Respect', 'Warm', ['darzi', 'naam']),

  /* ------------------------------------------------------------- Love */
  e('You met me during a bad year and stayed for the good ones.', 'Love and romance', 'Loyalty', 'Tender', ['love', 'loyalty']),
  e('We have a shorthand for everything and it took a decade.', 'Love and romance', 'History', 'Warm', ['love', 'history']),
  e('I do not want a perfect partner. I want a steady one.', 'Love and romance', 'Real love', 'Wise', ['love', 'steady']),
  e('You are the reason my night shifts became survivable.', 'Love and romance', 'Support', 'Tender', ['love', 'nightshift']),
  h('तुम मुझे बुरे साल में मिले और अच्छे सालों में रुके।', 'Love and romance', 'निष्ठा', 'कोमल', ['साल', 'रुके']),
  h('हमारे पास हर बात का छोटा सा कोड है, बनाने में दस साल लगे।', 'Love and romance', 'इतिहास', 'कोमल', ['बात', 'साल']),
  h('मुझे परफ़ेक्ट साथी नहीं, टिकाऊ साथी चाहिए।', 'Love and romance', 'सच्चा प्यार', 'गंभीर', ['साथी', 'टिकाऊ']),
  g('Tum mujhe bure saal mein mile aur achhe saalon mein ruke.', 'Love and romance', 'Loyalty', 'Tender', ['saal', 'ruke']),
  g('Humein har baat ka chhota code hai, banane mein das saal lage.', 'Love and romance', 'History', 'Warm', ['baat', 'saal']),
  g('Mujhe perfect saathi nahi, dhang ka saathi chahiye.', 'Love and romance', 'Real love', 'Wise', ['saathi', 'dhang']),

  /* ------------------------------------------------------- Sad depth */
  e('The hospital bill arrives with more honesty than the diagnosis.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'bills']),
  e('House hunting shows you exactly what your life costs.', 'Sad and heartbreak', 'Money', 'Sharp', ['sad', 'rent']),
  e('Night shifts taught me what silence sounds like at four.', 'Sad and heartbreak', 'Loneliness', 'Quiet', ['sad', 'nightshift']),
  e('I shouted at my nephew once and it took a week to undo.', 'Sad and heartbreak', 'Regret', 'Honest', ['sad', 'regret']),
  h('अस्पताल का बिल निदान से ज़्यादा ईमानदारी से आता है।', 'Sad and heartbreak', 'पैसा', 'भारी', ['बिल', 'निदान']),
  h('घर ढूँढना सिखा देता है कि तुम्हारी ज़िंदगी की क़ीमत क्या है।', 'Sad and heartbreak', 'पैसा', 'तीखा', ['घर', 'क़ीमत']),
  h('नाइट शिफ़्ट ने सिखाया कि चार बजे की खामोशी कैसी होती है।', 'Sad and heartbreak', 'अकेलापन', 'शांत', ['खामोशी', 'शिफ़्ट']),
  h('मैंने भतीजे पर एक बार चिल्लाया, ठीक करने में हफ़्ता लगा।', 'Sad and heartbreak', 'पछतावा', 'स्पष्ट', ['चिल्लाया', 'हफ़्ता']),
  g('Hospital ka bill nidaan se zyada imaandaari se aata hai.', 'Sad and heartbreak', 'Money', 'Heavy', ['bill', 'nidaan']),
  g('Ghar dhoondhna sikha deta hai ki tumhari zindagi ki keemat kya hai.', 'Sad and heartbreak', 'Money', 'Sharp', ['ghar', 'keemat']),
  g('Night shift ne sikhaya ki chaar baje ki khaamoshi kaisi hoti hai.', 'Sad and heartbreak', 'Loneliness', 'Quiet', ['khaamoshi', 'shift']),

  /* --------------------------------------------------------- Shayari */
  h('चार बजे का शहर\nमुझसे\nकुछ नहीं छिपाता।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['शहर', 'चार']),
  h('तेरी आदत\nअब मेरी\nदिनचर्या है।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['आदत', 'दिनचर्या']),
  g('Chaar baje ka shehar mujhse kuch nahi chhipaata.', 'Shayari', 'Two line', 'Deep', ['shehar', 'chhipaata']),
  g('Teri aadat ab meri dincharya hai.', 'Shayari', 'Two line', 'Romantic', ['aadat', 'dincharya']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A bill is a sentence your body writes to your bank.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'money']),
  e('Every January gym is full of people who bought hope rather than time.', 'Quotes and thoughts', 'Habits', 'Wry', ['quotes', 'gym']),
  e('Saying sorry to a child teaches them that power can apologise.', 'Quotes and thoughts', 'Parenting', 'Wise', ['quotes', 'parenting']),
  e('A tailor with a tape measure is more honest than a mirror.', 'Quotes and thoughts', 'Fit', 'Wry', ['quotes', 'tailor']),
  h('बिल वो वाक्य है जो शरीर बैंक को लिखता है।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['बिल', 'बैंक']),
  h('जनवरी का जिम उन लोगों से भरा होता है जिन्होंने वक़्त नहीं, उम्मीद ख़रीदी थी।', 'Quotes and thoughts', 'आदत', 'सहज', ['जिम', 'उम्मीद']),
  h('बच्चे से माफ़ी माँगना सिखाता है कि ताक़त भी माफ़ी माँग सकती है।', 'Quotes and thoughts', 'परवरिश', 'गंभीर', ['माफ़ी', 'ताक़त']),
  g('Bill woh vakya hai jo shareer bank ko likhta hai.', 'Quotes and thoughts', 'Money', 'Sharp', ['bill', 'bank']),
  g('January ka gym un logon se bhara hota hai jinhone waqt nahi, umeed kharidi thi.', 'Quotes and thoughts', 'Habits', 'Wry', ['gym', 'umeed']),
  g('Bachche se maafi maangna sikhaata hai ki taqat bhi maafi maang sakti hai.', 'Quotes and thoughts', 'Parenting', 'Wise', ['maafi', 'taqat']),

  /* ------------------------------------------------- Life and reality */
  e('A rented room with a window is worth two without.', 'Life and reality', 'Rent', 'Practical', ['life', 'rent']),
  e('The broker will lie about the sunlight. Visit at noon.', 'Life and reality', 'Rent', 'Wry', ['life', 'broker']),
  e('Learn the bus routes and the city shrinks to a village.', 'Life and reality', 'Cities', 'Practical', ['life', 'bus']),
  e('Nobody warns you that the deposit is the easy part.', 'Life and reality', 'Adulting', 'Wry', ['life', 'deposit']),
  h('खिड़की वाला किराए का कमरा दो बिना खिड़की वाले से बेहतर है।', 'Life and reality', 'किराया', 'व्यावहारिक', ['खिड़की', 'कमरा']),
  h('ब्रोकर धूप के बारे में झूठ बोलेगा। दोपहर में जाकर देखो।', 'Life and reality', 'किराया', 'सहज', ['ब्रोकर', 'दोपहर']),
  h('बस के रास्ते सीखो, शहर गाँव जितना छोटा लगने लगेगा।', 'Life and reality', 'शहर', 'व्यावहारिक', ['बस', 'शहर']),
  h('कोई नहीं बताता कि डिपॉज़िट आसान हिस्सा है।', 'Life and reality', 'बड़ी उम्र', 'सहज', ['डिपॉज़िट', 'हिस्सा']),
  g('Khidki wala kiraaye ka kamra do bina khidki wale se behtar hai.', 'Life and reality', 'Rent', 'Practical', ['khidki', 'kamra']),
  g('Broker dhoop ke baare mein jhooth bolega. Dopahar mein jaakar dekho.', 'Life and reality', 'Rent', 'Wry', ['broker', 'dopahar']),
  g('Bus ke raaste seekho, shehar gaon jitna chhota lagne lagega.', 'Life and reality', 'Cities', 'Practical', ['bus', 'shehar']),
  g('Koi nahi batata ki deposit aasaan hissa hai.', 'Life and reality', 'Adulting', 'Wry', ['deposit', 'hissa']),

  /* ------------------------------------------------------ Motivational */
  e('Buy the shoes and go for the walk the same day.', 'Motivational', 'Action', 'Direct', ['motivation', 'action']),
  e('Motivation visits in January and moves out in March.', 'Motivational', 'Discipline', 'Wry', ['motivation', 'discipline']),
  e('Start badly and adjust. That is the entire method.', 'Motivational', 'Starting', 'Direct', ['motivation', 'starting']),
  h('जूते उसी दिन ख़रीदो और उसी दिन चलो।', 'Motivational', 'कर्म', 'स्पष्ट', ['जूते', 'चलो']),
  h('प्रेरणा जनवरी में आती है और मार्च में चली जाती है।', 'Motivational', 'अनुशासन', 'सहज', ['प्रेरणा', 'मार्च']),
  h('बुरी तरह शुरू करो और सुधारते जाओ, पूरा तरीक़ा यही है।', 'Motivational', 'शुरुआत', 'स्पष्ट', ['शुरू', 'तरीक़ा']),
  g('Joote usi din kharido aur usi din chalo.', 'Motivational', 'Action', 'Direct', ['joote', 'chalo']),
  g('Prerna January mein aati hai aur March mein chali jaati hai.', 'Motivational', 'Discipline', 'Wry', ['prerna', 'March']),
  g('Buri tarah shuru karo aur sudhaarte jao, poora tareeqa yahi hai.', 'Motivational', 'Starting', 'Direct', ['shuru', 'tareeqa']),

  /* -------------------------------------------------------- Aesthetic */
  e('A curtain that reaches the floor makes a rented room look settled.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'curtain']),
  e('Warm white bulbs, not blue ones. That is the whole rule.', 'Aesthetic', 'Light', 'Practical', ['aesthetic', 'bulbs']),
  h('फ़र्श तक आने वाला पर्दा किराए के कमरे को बसा हुआ दिखाता है।', 'Aesthetic', 'घर', 'कोमल', ['पर्दा', 'कमरा']),
  h('नीले नहीं, गर्म सफ़ेद बल्ब। पूरा नियम यही है।', 'Aesthetic', 'रोशनी', 'व्यावहारिक', ['बल्ब', 'नियम']),
  g('Farsh tak aane wala parda kiraaye ke kamre ko basa hua dikhata hai.', 'Aesthetic', 'Home', 'Warm', ['parda', 'kamra']),
  g('Neeli nahi, garam safed bulb. Poora niyam yahi hai.', 'Aesthetic', 'Light', 'Practical', ['bulb', 'niyam']),

  /* ---------------------------------------------- Wider category band */
  e('Night shift survival is sunlight, water, and refusing extra shifts.', 'Yoga and wellness', 'Sleep', 'Practical', ['yoga', 'nightshift']),
  e('Write the answer, then check the marking scheme.', 'Student life', 'Exams', 'Practical', ['student', 'scheme']),
  e('Circulate the bad numbers early and you keep the room.', 'Professional and business', 'Honesty', 'Direct', ['professional', 'numbers']),
  e('A night match is won by whoever sleeps better in the afternoon.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'sleep']),
  e('Book the service before the warning light makes the decision.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'service']),
  e('Get one thing tailored and you will stop buying four.', 'Fashion and beauty', 'Tailoring', 'Practical', ['fashion', 'tailoring']),
  e('Copy the error message into the search bar before the panic.', 'Technology and coding', 'Debugging', 'Practical', ['tech', 'errors']),
  e('Repeat the experiment before you believe the result.', 'Science and curiosity', 'Method', 'Wise', ['science', 'repeat']),
  e('Do not raise money to delay a decision you are avoiding.', 'Startup and hustle', 'Judgement', 'Sharp', ['startup', 'funding']),
  e('Two chairs and a table is a living room. Stop waiting.', 'Home and interiors', 'Design', 'Practical', ['home', 'design']),
  e('Buy shoes in the evening when your feet are honest.', 'Stylish', 'Fit', 'Practical', ['stylish', 'shoes']),
  e('I will tell you the cost plainly and let you decide.', 'Savage and bold', 'Honesty', 'Firm', ['savage', 'honesty']),
  e('The friend who tells you the flat is overpriced saves you a year.', 'Friendship', 'Honesty', 'Warm', ['friendship', 'honesty']),
  e('Apologise to the child properly and they will trust you at fifteen.', 'Family', 'Parenting', 'Wise', ['family', 'parenting']),
  e('A night shift alone is easier with a neighbour who knows your schedule.', 'Alone and loneliness', 'Solitude', 'Warm', ['alone', 'nightshift']),
  e('Light a lamp even when you are too tired to pray well.', 'Spirituality and peace', 'Practice', 'Warm', ['spirituality', 'lamp']),
  e('Photograph the room before you decorate it, so you remember why.', 'Photography', 'Home', 'Practical', ['photography', 'before']),
  e('House hunting is a walking tour of your own priorities.', 'Travel and adventure', 'Cities', 'Wry', ['travel', 'househunting']),
  e('A profile with the mess left in frame will outlast a tidy one.', 'Instagram profiles', 'Approach', 'Wise', ['instagram', 'honest']),
  e('I am the person who reads the tenancy agreement twice.', 'Personality and identity', 'Identity', 'Wry', ['personality', 'agreement']),
  e('I will not sign anything to keep a room that makes me smaller.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'worth']),
  e('The first monsoon in a new flat tells you everything about the roof.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'roof']),
  h('नाइट शिफ़्ट में धूप, पानी और ज़्यादा शिफ़्ट से मना करना, बस इतना।', 'Yoga and wellness', 'नींद', 'व्यावहारिक', ['शिफ़्ट', 'धूप']),
  h('पहले जवाब लिखो, फिर मार्किंग स्कीम देखो।', 'Student life', 'परीक्षा', 'व्यावहारिक', ['जवाब', 'स्कीम']),
  h('खराब आँकड़े जल्दी बताओ, कमरा तुम्हारे पास रहेगा।', 'Professional and business', 'ईमानदारी', 'स्पष्ट', ['आँकड़े', 'कमरा']),
  h('शाम को जूते ख़रीदो, तब पैर सच बोलते हैं।', 'Stylish', 'फ़िट', 'व्यावहारिक', ['जूते', 'पैर']),
  h('बच्चे से ढंग से माफ़ी माँगो, पंद्रह साल की उम्र में भरोसा मिलेगा।', 'Family', 'परवरिश', 'गंभीर', ['माफ़ी', 'भरोसा']),
  g('Night shift mein dhoop, paani aur zyada shift se mana karna, bas itna.', 'Yoga and wellness', 'Sleep', 'Practical', ['shift', 'dhoop']),
  g('Pehle jawaab likho, phir marking scheme dekho.', 'Student life', 'Exams', 'Practical', ['jawaab', 'scheme']),
  g('Kharab aankde jaldi batao, dhang se kamra tumhare paas rahega.', 'Professional and business', 'Honesty', 'Direct', ['aankde', 'kamra']),
  g('Shaam ko joote kharido, tab pair sach bolte hain.', 'Stylish', 'Fit', 'Practical', ['joote', 'pair']),
  g('Bachche se dhang se maafi maango, pandrah saal ki umar mein bharosa milega.', 'Family', 'Parenting', 'Wise', ['maafi', 'bharosa']),
  g('Naye flat ki pehli baarish chhat ke baare mein sab bata deti hai.', 'Monsoon and seasons', 'Rain', 'Practical', ['baarish', 'chhat']),

  /* --------------------------------------- Hinglish top-up (was 5 short) */
  g('Chhata monsoon se pehle kharido, baarish mein mehnga milega.', 'Life and reality', 'Monsoon', 'Practical', ['chhata', 'monsoon']),
  g('Aadat hi guru hai, gym sirf kamra hai.', 'Motivational', 'Habits', 'Wise', ['aadat', 'gym']),
  g('Aaine ko wahan lagao jahan subah ki roshni aati hai.', 'Aesthetic', 'Light', 'Practical', ['aaine', 'roshni']),
  g('Har cheez ki jagah banao, warna Friday tak ghar bikhra hoga.', 'Minimal', 'Living', 'Practical', ['cheez', 'jagah']),
  g('Dheemi kahani bhi dhang se sunao toh hansi aati hai.', 'Funny and comedy', 'Storytelling', 'Wry', ['kahani', 'hansi']),
  g('Makaan dekhne jao toh apni priority ki list saath rakho.', 'Home and interiors', 'Design', 'Practical', ['makaan', 'list']),
];
