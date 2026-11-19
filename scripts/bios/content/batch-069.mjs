/**
 * BioCraft original bios — batch 069.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the carpenter who measures twice, a father's first flight,
 * a wedding held under a leaking tent, the duplicate key that did not fit,
 * a grandmother's trunk, and the tea stall that opens at five.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_069 = [
  /* ------------------------------------------------------------ Attitude */
  e('I measure twice and I let the carpenter watch me do it.', 'Attitude', 'Care', 'Practical', ['attitude', 'measure']),
  e('I hold my father hand through his first flight.', 'Attitude', 'Duty', 'Tender', ['attitude', 'flight']),
  e('I tell the tent man the roof leaks before the guests arrive.', 'Attitude', 'Honesty', 'Firm', ['attitude', 'tent']),
  h('दो बार नापता हूँ और बढ़ई को देखने देता हूँ।', 'Attitude', 'सावधानी', 'व्यावहारिक', ['नापता', 'बढ़ई']),
  h('पापा की पहली फ़्लाइट में उनका हाथ थामे रहता हूँ।', 'Attitude', 'फ़र्ज़', 'कोमल', ['फ़्लाइट', 'हाथ']),
  h('मेहमान आने से पहले टेंट वाले को बता देता हूँ कि छत चूती है।', 'Attitude', 'ईमानदारी', 'दृढ़', ['टेंट', 'छत']),
  h('चाबी वाले को अपनी ग़लत नाप का इलज़ाम नहीं देता।', 'Attitude', 'ज़िम्मेदारी', 'शांत', ['चाबी', 'इलज़ाम']),
  g('Do baar naapta hoon aur badhai ko dekhne deta hoon.', 'Attitude', 'Care', 'Practical', ['naapta', 'badhai']),
  g('Papa ki pehli flight mein unka haath thaame rehta hoon.', 'Attitude', 'Duty', 'Tender', ['flight', 'haath']),
  g('Mehmaan aane se pehle tent wale ko bata deta hoon ki chhat chooti hai.', 'Attitude', 'Honesty', 'Firm', ['tent', 'chhat']),
  g('Chaabi wale ko apni galat naap ka ilzaam nahi deta.', 'Attitude', 'Accountability', 'Composed', ['chaabi', 'ilzaam']),

  /* ------------------------------------------------------------- Love */
  e('You packed my father a tiffin for a two hour flight.', 'Love and romance', 'Care', 'Tender', ['love', 'flight']),
  e('We got married under a tent that leaked and nobody minded.', 'Love and romance', 'Beginning', 'Warm', ['love', 'tent']),
  e('Your grandmother trunk had my letters in it before I ever met her.', 'Love and romance', 'Family', 'Aching', ['love', 'trunk']),
  h('तुमने पापा के लिए दो घंटे की फ़्लाइट का टिफ़िन बाँधा।', 'Love and romance', 'परवाह', 'कोमल', ['टिफ़िन', 'फ़्लाइट']),
  h('हम ऐसे टेंट में शादी कर बैठे जो चूता था, और किसी को फ़र्क़ नहीं पड़ा।', 'Love and romance', 'शुरुआत', 'कोमल', ['टेंट', 'शादी']),
  h('दादी के संदूक में मेरे ख़त पहले से थे, मुझसे मिलने से पहले।', 'Love and romance', 'परिवार', 'भावुक', ['संदूक', 'ख़त']),
  g('Tumne papa ke liye do ghante ki flight ka tiffin baandha.', 'Love and romance', 'Care', 'Tender', ['tiffin', 'flight']),
  g('Hum aise tent mein shaadi kar baithe jo choota tha, aur kisi ko farq nahi pada.', 'Love and romance', 'Beginning', 'Warm', ['tent', 'shaadi']),
  g('Dadi ke sandook mein mere khat pehle se the, mujhse milne se pehle.', 'Love and romance', 'Family', 'Aching', ['sandook', 'khat']),

  /* ------------------------------------------------------- Sad depth */
  e('The duplicate key did not fit and I stood outside my own flat for an hour.', 'Sad and heartbreak', 'Home', 'Heavy', ['sad', 'key']),
  e('My father had never flown and he held the armrest for four hours.', 'Sad and heartbreak', 'Parents', 'Aching', ['sad', 'flight']),
  e('It rained through the wedding tent and we moved the food twice.', 'Sad and heartbreak', 'Weddings', 'Heavy', ['sad', 'tent']),
  e('The trunk was opened after she died and half of it was other people things.', 'Sad and heartbreak', 'Loss', 'Aching', ['sad', 'trunk']),
  h('नक़ली चाबी फ़िट नहीं हुई और मैं अपने ही फ़्लैट के बाहर एक घंटा खड़ा रहा।', 'Sad and heartbreak', 'घर', 'भारी', ['चाबी', 'फ़्लैट']),
  h('पापा ने पहले कभी फ़्लाइट नहीं ली थी और चार घंटे आर्मरेस्ट पकड़े रहे।', 'Sad and heartbreak', 'माँ-बाप', 'भावुक', ['फ़्लाइट', 'घंटे']),
  h('शादी के टेंट से बारिश चूती रही और खाना दो बार हटाना पड़ा।', 'Sad and heartbreak', 'शादी', 'भारी', ['टेंट', 'खाना']),
  g('Nakli chaabi fit nahi hui aur main apne hi flat ke bahar ek ghanta khada raha.', 'Sad and heartbreak', 'Home', 'Heavy', ['chaabi', 'flat']),
  g('Papa ne pehle kabhi flight nahi li thi aur chaar ghante armrest pakde rahe.', 'Sad and heartbreak', 'Parents', 'Aching', ['flight', 'ghante']),
  g('Shaadi ke tent se baarish chooti rahi aur khaana do baar hatana pada.', 'Sad and heartbreak', 'Weddings', 'Heavy', ['tent', 'khaana']),

  /* --------------------------------------------------------- Shayari */
  h('चाबी फ़िट नहीं हुई,\nऔर घर\nबाहर से दिखा।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['चाबी', 'घर']),
  h('संदूक खुला,\nबारिश\nबंद नहीं हुई।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['संदूक', 'बारिश']),
  g('Chaabi fit nahi hui, aur ghar bahar se dikha.', 'Shayari', 'Two line', 'Deep', ['chaabi', 'ghar']),
  g('Sandook khula, par baarish band nahi hui.', 'Shayari', 'Two line', 'Aching', ['sandook', 'baarish']),

  /* -------------------------------------------------- Quotes and ideas */
  e('Measure twice and you only pay the carpenter once.', 'Quotes and thoughts', 'Craft', 'Practical', ['quotes', 'measure']),
  e('A first flight is a first flight at any age.', 'Quotes and thoughts', 'Age', 'Warm', ['quotes', 'flight']),
  e('A tent that leaks teaches a wedding what it is actually about.', 'Quotes and thoughts', 'Weddings', 'Wise', ['quotes', 'tent']),
  h('दो बार नापो, बढ़ई को एक बार ही पैसा देना पड़ेगा।', 'Quotes and thoughts', 'हुनर', 'व्यावहारिक', ['नापो', 'पैसा']),
  h('पहली फ़्लाइट किसी भी उम्र में पहली फ़्लाइट होती है।', 'Quotes and thoughts', 'उम्र', 'कोमल', ['फ़्लाइट', 'उम्र']),
  h('जो टेंट चूता है, वो शादी को सिखा देता है कि वो किस बारे में है।', 'Quotes and thoughts', 'शादी', 'गंभीर', ['टेंट', 'शादी']),
  g('Do baar naapo, badhai ko ek baar hi paisa dena padega.', 'Quotes and thoughts', 'Craft', 'Practical', ['naapo', 'paisa']),
  g('Pehli flight kisi bhi umar mein pehli flight hoti hai.', 'Quotes and thoughts', 'Age', 'Warm', ['flight', 'umar']),
  g('Jo tent choota hai, woh shaadi ko sikha deta hai ki woh kis baare mein hai.', 'Quotes and thoughts', 'Weddings', 'Wise', ['tent', 'shaadi']),

  /* ------------------------------------------------- Life and reality */
  e('Test both keys in the lock before you pay the man.', 'Life and reality', 'Home', 'Practical', ['life', 'key']),
  e('Book the aisle seat for a first flight and tell them when to look out.', 'Life and reality', 'Travel', 'Warm', ['life', 'flight']),
  e('Keep a plastic sheet for the tent. It costs less than the food.', 'Life and reality', 'Weddings', 'Practical', ['life', 'tent']),
  e('Open the trunk together, not alone.', 'Life and reality', 'Family', 'Wise', ['life', 'trunk']),
  e('The tea stall opens at five. Be there once and you will understand the town.', 'Life and reality', 'Cities', 'Warm', ['life', 'tea']),
  h('दाम देने से पहले दोनों चाबियाँ ताले में आज़माओ।', 'Life and reality', 'घर', 'व्यावहारिक', ['चाबियाँ', 'ताले']),
  h('पहली फ़्लाइट में खिड़की वाली सीट बुक करो और बताओ कब बाहर देखना है।', 'Life and reality', 'सफ़र', 'कोमल', ['सीट', 'बाहर']),
  h('टेंट के लिए प्लास्टिक की चादर रखो, खाने से सस्ती पड़ती है।', 'Life and reality', 'शादी', 'व्यावहारिक', ['चादर', 'खाने']),
  h('संदूक अकेले मत खोलो, साथ खोलो।', 'Life and reality', 'परिवार', 'गंभीर', ['संदूक', 'साथ']),
  g('Daam dene se pehle dono chaabiyan taale mein aazmao.', 'Life and reality', 'Home', 'Practical', ['chaabiyan', 'taale']),
  g('Pehli flight mein khidki wali seat book karo aur batao kab bahar dekhna hai.', 'Life and reality', 'Travel', 'Warm', ['seat', 'bahar']),
  g('Tent ke liye plastic ki chaadar rakho, khaane se sasti padti hai.', 'Life and reality', 'Weddings', 'Practical', ['chaadar', 'khaane']),
  g('Sandook akele mat kholo, saath kholo.', 'Life and reality', 'Family', 'Wise', ['sandook', 'saath']),

  /* ------------------------------------------------------ Motivational */
  e('A skill measured properly is a skill that lasts.', 'Motivational', 'Craft', 'Wise', ['motivation', 'craft']),
  e('Take your father to the airport once. It rearranges both of you.', 'Motivational', 'Duty', 'Warm', ['motivation', 'duty']),
  e('A key that does not fit is data, not humiliation.', 'Motivational', 'Resilience', 'Direct', ['motivation', 'resilience']),
  h('जो हुनर ठीक से नापा जाए, वो हुनर चलता है।', 'Motivational', 'हुनर', 'गंभीर', ['हुनर', 'नापा']),
  h('पापा को एक बार एयरपोर्ट ले जाओ, दोनों की सोच बदल जाती है।', 'Motivational', 'फ़र्ज़', 'कोमल', ['एयरपोर्ट', 'सोच']),
  h('जो चाबी फ़िट न हो, वो जानकारी है, बेइज़्ज़ती नहीं।', 'Motivational', 'सब्र', 'स्पष्ट', ['चाबी', 'बेइज़्ज़ती']),
  g('Jo hunar theek se naapa jaaye, woh hunar chalta hai.', 'Motivational', 'Craft', 'Wise', ['hunar', 'naapa']),
  g('Papa ko ek baar airport le jao, dono ki soch badal jaati hai.', 'Motivational', 'Duty', 'Warm', ['airport', 'soch']),
  g('Jo chaabi fit na ho, woh jaankari hai, beizzati nahi.', 'Motivational', 'Resilience', 'Direct', ['chaabi', 'beizzati']),

  /* -------------------------------------------------------- Aesthetic */
  e('Good carpentry shows in the joints, not in the polish.', 'Aesthetic', 'Craft', 'Wise', ['aesthetic', 'carpentry']),
  e('A tea stall at five with one bulb is the whole town setting.', 'Aesthetic', 'Cities', 'Warm', ['aesthetic', 'tea']),
  h('अच्छी बढ़ईगीरी जोड़ों में दिखती है, पॉलिश में नहीं।', 'Aesthetic', 'हुनर', 'गंभीर', ['जोड़ों', 'पॉलिश']),
  h('घिसे कोनों वाला पीतल का संदूक नई फ़र्नीचर से बेहतर है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['संदूक', 'फ़र्नीचर']),
  g('Acchi badhaigiri jodon mein dikhti hai, polish mein nahi.', 'Aesthetic', 'Craft', 'Wise', ['jodon', 'polish']),
  g('Ghise konon wala peetal ka sandook naye furniture se behtar hai.', 'Aesthetic', 'Objects', 'Warm', ['sandook', 'furniture']),

  /* ---------------------------------------------- Wider category band */
  e('Holding your breath through landing is not a breathing technique.', 'Yoga and wellness', 'Body', 'Wry', ['yoga', 'flight']),
  e('Keep the admit card in the bag the night before, not the morning of.', 'Student life', 'Exams', 'Practical', ['student', 'exams']),
  e('A carpenter who quotes by the joint is quoting honestly.', 'Professional and business', 'Craft', 'Wise', ['professional', 'craft']),
  e('A wet ball and a wet outfield make a long afternoon of patience.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'rain']),
  e('Get a second key cut by a machine, not by eye.', 'Cars and bikes', 'Keys', 'Practical', ['cars', 'keys']),
  e('A wedding outfit that survives rain is the outfit you actually needed.', 'Fashion and beauty', 'Weddings', 'Practical', ['fashion', 'wedding']),
  e('Measure the door, then measure the door again with the frame.', 'Science and curiosity', 'Method', 'Practical', ['science', 'method']),
  e('Take the deposit in writing and the trunk will be returned.', 'Startup and hustle', 'Trust', 'Sharp', ['startup', 'trust']),
  e('A door that closes properly is the whole definition of a home.', 'Home and interiors', 'Home', 'Wise', ['home', 'door']),
  e('One trunk, one suitcase, one bag. That is a whole move.', 'Minimal', 'Possessions', 'Practical', ['minimal', 'possessions']),
  e('The funniest thing at a wedding is the tent man explaining water.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'wedding']),
  e('I will tell you which carpenter finishes on time and which one vanishes.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who holds the ladder for you is earning nothing and staying.', 'Friendship', 'Support', 'Warm', ['friendship', 'ladder']),
  e('My father flew for the first time at sixty-two and gave the window seat away.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Being locked out of your own flat is a specific, quiet humiliation.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'locked']),
  e('Tea at five, before anyone needs anything from you, is a practice.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'tea']),
  e('Ask the tea stall man what time the town actually wakes up.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'tea']),
  e('A post about a first flight at sixty-two gets more replies than a boarding pass.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who tests the key in the lock before paying.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'key']),
  e('I will not let a carpenter take the blame for my measurement.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'accountability']),
  e('A tent in monsoon needs a second layer or it needs a different month.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'tent']),
  h('लैंडिंग पर साँस रोकना कोई ब्रीदिंग तकनीक नहीं है।', 'Yoga and wellness', 'शरीर', 'सहज', ['साँस', 'लैंडिंग']),
  h('प्रवेश पत्र रात में बैग में रखो, सुबह नहीं।', 'Student life', 'परीक्षा', 'व्यावहारिक', ['प्रवेश', 'सुबह']),
  h('जो बढ़ई जोड़ के हिसाब से दाम बताए, वो ईमान से बता रहा है।', 'Professional and business', 'हुनर', 'गंभीर', ['बढ़ई', 'दाम']),
  h('ठीक से बंद होता दरवाज़ा घर की पूरी परिभाषा है।', 'Home and interiors', 'घर', 'गंभीर', ['दरवाज़ा', 'परिभाषा']),
  h('पापा ने बासठ पर पहली बार फ़्लाइट ली और खिड़की वाली सीट किसी को दे दी।', 'Family', 'माँ-बाप', 'कोमल', ['सीट', 'फ़्लाइट']),
  h('पाँच बजे की चाय, किसी के कुछ माँगने से पहले, एक अभ्यास है।', 'Spirituality and peace', 'अभ्यास', 'गंभीर', ['चाय', 'अभ्यास']),
  g('Landing par saans rokna koi breathing technique nahi hai.', 'Yoga and wellness', 'Body', 'Wry', ['saans', 'landing']),
  g('Pravesh patra raat mein bag mein rakho, subah nahi.', 'Student life', 'Exams', 'Practical', ['pravesh', 'subah']),
  g('Jo badhai jod ke hisaab se daam bataaye, woh imaan se bata raha hai.', 'Professional and business', 'Craft', 'Wise', ['badhai', 'daam']),
  g('Theek se band hota darwaza ghar ki poori paribhasha hai.', 'Home and interiors', 'Home', 'Wise', ['darwaza', 'paribhasha']),
  g('Papa ne baasath par pehli baar flight li aur khidki wali seat kisi ko de di.', 'Family', 'Parents', 'Tender', ['seat', 'flight']),
  g('Paanch baje ki chai, kisi ke kuch maangne se pehle, ek abhyaas hai.', 'Spirituality and peace', 'Practice', 'Wise', ['chai', 'abhyaas']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('ग़लत नाप मेरी थी, चाबी वाले की नहीं।', 'Attitude', 'ज़िम्मेदारी', 'शांत', ['नाप', 'चाबी']),
  h('तुम पाँच बजे चाय लाते हो क्योंकि ठेला रास्ते में पड़ता है।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['चाय', 'ठेला']),
  h('संदूक वो रखता है जो लोग फेंक नहीं पाए।', 'Quotes and thoughts', 'याद', 'भावुक', ['संदूक', 'फेंक']),
  g('Galat naap meri thi, chaabi wale ki nahi.', 'Attitude', 'Accountability', 'Composed', ['naap', 'chaabi']),
  g('Tum paanch baje chai laate ho kyunki thela raaste mein padta hai.', 'Love and romance', 'Ordinary days', 'Warm', ['chai', 'thela']),
  g('Sandook woh rakhta hai jo log phenk nahi paaye.', 'Quotes and thoughts', 'Memory', 'Aching', ['sandook', 'phenk']),
];
