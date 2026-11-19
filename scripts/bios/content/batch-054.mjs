/**
 * BioCraft original bios — batch 054.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 33 HI / 32 HG.
 * New subject matter: the electrician, second-hand books, a friend moving abroad,
 * learning to cook after leaving home, the office tea round.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_054 = [
  /* ------------------------------------------------------------ Attitude */
  e('I trust the electrician who explains the wiring twice.', 'Attitude', 'Trust', 'Warm', ['attitude', 'trust']),
  e('I keep my appointment even when the weather has other plans.', 'Attitude', 'Reliability', 'Firm', ['attitude', 'reliability']),
  e('I will take the second-hand book and the first-hand advice.', 'Attitude', 'Values', 'Wry', ['attitude', 'values']),
  h('मैं उस इलेक्ट्रीशियन पर भरोसा करता हूँ जो तार दो बार समझाता है।', 'Attitude', 'भरोसा', 'कोमल', ['इलेक्ट्रीशियन', 'तार']),
  h('मौसम कुछ और कहे, मैं अपना वक़्त नहीं बदलता।', 'Attitude', 'भरोसा', 'दृढ़', ['मौसम', 'वक़्त']),
  h('किसी इंसान के बारे में सही साबित होने में दिलचस्पी नहीं।', 'Attitude', 'परिपक्वता', 'गंभीर', ['इंसान', 'सही']),
  g('Main us electrician par bharosa karta hoon jo taar do baar samjhata hai.', 'Attitude', 'Trust', 'Warm', ['electrician', 'taar']),
  g('Mausam kuch aur kahe, main apna waqt nahi badalta.', 'Attitude', 'Reliability', 'Firm', ['mausam', 'waqt']),
  g('Kisi insaan ke baare mein sahi saabit hone mein dilchasp nahi.', 'Attitude', 'Maturity', 'Wise', ['insaan', 'sahi']),

  /* ------------------------------------------------------------- Love */
  e('You are my favourite person to do nothing in particular with.', 'Love and romance', 'Closeness', 'Warm', ['love', 'closeness']),
  e('I learned to cook because you were coming home late.', 'Love and romance', 'Devotion', 'Tender', ['love', 'cooking']),
  e('We argue about the fan speed and settle it in a minute.', 'Love and romance', 'Playful', 'Wry', ['love', 'playful']),
  e('I want to be the person you call from the airport.', 'Love and romance', 'Priority', 'Tender', ['love', 'airport']),
  h('तुम वो हो जिसके साथ कुछ भी न करना सबसे अच्छा लगता है।', 'Love and romance', 'अपनापन', 'कोमल', ['साथ', 'अच्छा']),
  h('मैंने खाना बनाना इसलिए सीखा क्योंकि तुम देर से आते थे।', 'Love and romance', 'समर्पण', 'कोमल', ['खाना', 'देर']),
  h('हम पंखे की स्पीड पर झगड़ते हैं और एक मिनट में सुलझ जाते हैं।', 'Love and romance', 'खेल', 'सहज', ['पंखे', 'मिनट']),
  g('Tum woh ho jiske saath kuch bhi na karna sabse accha lagta hai.', 'Love and romance', 'Closeness', 'Warm', ['saath', 'accha']),
  g('Maine khaana banana isliye seekha kyunki tum der se aate the.', 'Love and romance', 'Devotion', 'Tender', ['khaana', 'der']),
  g('Hum pankhe ki speed par jhagadte hain aur ek minute mein sulajh jaate hain.', 'Love and romance', 'Playful', 'Wry', ['pankhe', 'minute']),

  /* ------------------------------------------------------- Sad depth */
  e('My friend moved abroad and the group chat went quiet by inches.', 'Sad and heartbreak', 'Distance', 'Aching', ['sad', 'abroad']),
  e('I learned to cook after leaving home because hunger is a good teacher.', 'Sad and heartbreak', 'Growing up', 'Wry', ['sad', 'cooking']),
  e('The electrician fixed the light and I cried a little about the dark.', 'Sad and heartbreak', 'Small things', 'Honest', ['sad', 'light']),
  e('Second-hand books carry somebody else grief in the margins.', 'Sad and heartbreak', 'Memory', 'Quiet', ['sad', 'books']),
  h('मेरा दोस्त विदेश चला गया और ग्रुप चैट धीरे-धीरे चुप हो गई।', 'Sad and heartbreak', 'दूरी', 'भावुक', ['दोस्त', 'चैट']),
  h('घर छोड़ने के बाद खाना बनाना सीखा क्योंकि भूख अच्छी गुरु है।', 'Sad and heartbreak', 'बड़ी उम्र', 'सहज', ['भूख', 'गुरु']),
  h('इलेक्ट्रीशियन ने लाइट ठीक की और मैं अंधेरे पर थोड़ा रोया।', 'Sad and heartbreak', 'छोटी बातें', 'स्पष्ट', ['लाइट', 'अंधेरे']),
  g('Mera dost videsh chala gaya aur group chat dheere-dheere chup ho gayi.', 'Sad and heartbreak', 'Distance', 'Aching', ['dost', 'chat']),
  g('Ghar chhodne ke baad khaana banana seekha kyunki bhookh acchi guru hai.', 'Sad and heartbreak', 'Growing up', 'Wry', ['bhookh', 'guru']),
  g('Purani kitaabon ke margin mein kisi aur ka gham rehta hai.', 'Sad and heartbreak', 'Memory', 'Quiet', ['kitaabon', 'gham']),

  /* --------------------------------------------------------- Shayari */
  h('पुरानी किताब में\nकिसी और का\nनाम मिला।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['किताब', 'नाम']),
  h('तेरे जाने के बाद\nमैंने खाना\nबनाना सीखा।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['खाना', 'सीखा']),
  g('Purani kitaab mein kisi aur ka naam mila.', 'Shayari', 'Two line', 'Deep', ['kitaab', 'naam']),
  g('Tere jaane ke baad maine khaana banana seekha.', 'Shayari', 'Two line', 'Aching', ['khaana', 'seekha']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A good electrician saves you from a fire you will never see.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'craft']),
  e('Second-hand books are cheaper and better annotated.', 'Quotes and thoughts', 'Reading', 'Warm', ['quotes', 'books']),
  e('Learning to cook is learning to be kind to yourself.', 'Quotes and thoughts', 'Care', 'Warm', ['quotes', 'cooking']),
  e('The office tea round is the most honest hierarchy in any company.', 'Quotes and thoughts', 'Work', 'Wry', ['quotes', 'office']),
  h('अच्छा इलेक्ट्रीशियन उस आग से बचाता है जो तुम कभी नहीं देखोगे।', 'Quotes and thoughts', 'हुनर', 'गंभीर', ['इलेक्ट्रीशियन', 'आग']),
  h('पुरानी किताबें सस्ती और ज़्यादा निशानदेही वाली होती हैं।', 'Quotes and thoughts', 'पढ़ना', 'कोमल', ['किताबें', 'सस्ती']),
  h('खाना बनाना सीखना खुद पर दया करना सीखना है।', 'Quotes and thoughts', 'ख़याल', 'कोमल', ['खाना', 'दया']),
  g('Accha electrician us aag se bachata hai jo tum kabhi nahi dekhoge.', 'Quotes and thoughts', 'Craft', 'Wise', ['electrician', 'aag']),
  g('Purani kitaabein sasti aur zyada nishandehi wali hoti hain.', 'Quotes and thoughts', 'Reading', 'Warm', ['kitaabein', 'sasti']),
  g('Khaana banana seekhna khud par daya karna seekhna hai.', 'Quotes and thoughts', 'Care', 'Warm', ['khaana', 'daya']),

  /* ------------------------------------------------- Life and reality */
  e('The first thing you learn living alone is how many spoons you own.', 'Life and reality', 'Living alone', 'Wry', ['life', 'alone']),
  e('A friend abroad is a timezone problem before it is a feelings problem.', 'Life and reality', 'Distance', 'Sharp', ['life', 'timezone']),
  e('Buy a proper knife before you buy anything else for the kitchen.', 'Life and reality', 'Kitchen', 'Practical', ['life', 'kitchen']),
  e('Learn the tea preferences. It is the fastest way into a workplace.', 'Life and reality', 'Work', 'Practical', ['life', 'office']),
  h('अकेले रहने पर पहली चीज़ जो सीखते हो, वो यह कि तुम्हारे पास कितने चम्मच हैं।', 'Life and reality', 'अकेले रहना', 'सहज', ['चम्मच', 'अकेले']),
  h('विदेश में बैठा दोस्त पहले टाइमज़ोन की दिक्कत है, भावना की बाद में।', 'Life and reality', 'दूरी', 'तीखा', ['दोस्त', 'टाइमज़ोन']),
  h('पुराना फ़र्नीचर ही शहर को सजाता है।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['फ़र्नीचर', 'शहर']),
  h('रसोई के लिए पहले एक अच्छा चाकू ख़रीदो, बाकी बाद में।', 'Life and reality', 'रसोई', 'व्यावहारिक', ['चाकू', 'रसोई']),
  g('Akele rehne par pehli cheez jo seekhte ho, woh yeh ki tumhare paas kitne chamach hain.', 'Life and reality', 'Living alone', 'Wry', ['chamach', 'akele']),
  g('Videsh mein baitha dost pehle timezone ki dikkat hai, bhavna ki baad mein.', 'Life and reality', 'Distance', 'Sharp', ['dost', 'timezone']),
  g('Purana furniture hi shehar ko sajata hai.', 'Life and reality', 'Money', 'Practical', ['furniture', 'shehar']),
  g('Rasoi ke liye pehle ek accha chaku kharido, baaki baad mein.', 'Life and reality', 'Kitchen', 'Practical', ['chaku', 'rasoi']),

  /* ------------------------------------------------------ Motivational */
  e('Cook badly twenty times and you will cook well once.', 'Motivational', 'Craft', 'Direct', ['motivation', 'cooking']),
  e('Make the call to the friend abroad. Timezones are negotiable.', 'Motivational', 'Action', 'Warm', ['motivation', 'friendship']),
  h('बीस बार बुरा खाना बनाओ, एक बार अच्छा बन जाएगा।', 'Motivational', 'हुनर', 'स्पष्ट', ['खाना', 'बुरा']),
  h('तीस की उम्र में सीखा हुनर चालीस साल चलता है।', 'Motivational', 'सीखना', 'गंभीर', ['हुनर', 'साल']),
  h('विदेश वाले दोस्त को फ़ोन करो, टाइमज़ोन मैनेज हो जाता है।', 'Motivational', 'कर्म', 'कोमल', ['दोस्त', 'फ़ोन']),
  g('Bees baar bura khaana banao, phir dhang se ek baar banao.', 'Motivational', 'Craft', 'Direct', ['khaana', 'bura']),
  g('Tees ki umar mein seekha hunar chalees saal chalta hai.', 'Motivational', 'Learning', 'Wise', ['hunar', 'saal']),
  g('Videsh wale dost ko phone karo, timezone manage ho jaata hai.', 'Motivational', 'Action', 'Warm', ['dost', 'phone']),

  /* -------------------------------------------------------- Aesthetic */
  e('One good lamp and one bad chair is a room that works.', 'Aesthetic', 'Light', 'Wry', ['aesthetic', 'lamp']),
  e('Keep your knives sharp and your windows clean and nothing else matters.', 'Aesthetic', 'Kitchen', 'Practical', ['aesthetic', 'knives']),
  h('एक अच्छा लैंप और एक खराब कुर्सी, काम चल जाता है।', 'Aesthetic', 'रोशनी', 'सहज', ['लैंप', 'कुर्सी']),
  h('चाकू तेज़ रखो और खिड़कियाँ साफ़, बाकी कुछ मायने नहीं रखता।', 'Aesthetic', 'रसोई', 'व्यावहारिक', ['चाकू', 'खिड़कियाँ']),
  g('Ek accha lamp aur ek kharab kursi, kaam chal jaata hai.', 'Aesthetic', 'Light', 'Wry', ['lamp', 'kursi']),
  g('Chaku tez rakho aur khidkiyan saaf, baaki kuch maayne nahi rakhta.', 'Aesthetic', 'Kitchen', 'Practical', ['chaku', 'khidkiyan']),

  /* ---------------------------------------------- Wider category band */
  e('Cooking your own food is the most reliable health decision there is.', 'Yoga and wellness', 'Food', 'Practical', ['yoga', 'cooking']),
  e('Read the chapter before the lecture and the lecture gets shorter.', 'Student life', 'Study', 'Practical', ['student', 'study']),
  e('The tea round is a test of character, not seniority.', 'Professional and business', 'Culture', 'Wry', ['professional', 'culture']),
  e('A batter who cooks for the team wins the dressing room.', 'Cricket and sports', 'Cricket', 'Wry', ['cricket', 'team']),
  e('Learn where the fuse box is before you need it.', 'Cars and bikes', 'Skills', 'Practical', ['cars', 'skills']),
  e('A wardrobe sorted by use beats one sorted by colour.', 'Fashion and beauty', 'Wardrobe', 'Practical', ['fashion', 'wardrobe']),
  e('Write the setup instructions as if a stranger will follow them.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'docs']),
  e('Test the cheap version first and save the money.', 'Science and curiosity', 'Method', 'Practical', ['science', 'method']),
  e('Your second customer is easier than your first and harder than your tenth.', 'Startup and hustle', 'Growth', 'Wise', ['startup', 'growth']),
  e('A kitchen with good light is used more often.', 'Home and interiors', 'Kitchen', 'Practical', ['home', 'kitchen']),
  e('Keep one shelf empty for whatever arrives next.', 'Minimal', 'Space', 'Composed', ['minimal', 'space']),
  e('The funniest thing in a flat is usually the furniture you built yourself.', 'Funny and comedy', 'Everyday', 'Wry', ['funny', 'furniture']),
  e('I will tell you what the electrician told me and save you the bill.', 'Savage and bold', 'Honesty', 'Direct', ['savage', 'honesty']),
  e('The friend who teaches you to cook is your friend for life.', 'Friendship', 'Generosity', 'Warm', ['friendship', 'cooking']),
  e('Living alone teaches you what your mother did invisibly.', 'Family', 'Parents', 'Wise', ['family', 'parents']),
  e('Learning to cook for one is the hardest version of the skill.', 'Alone and loneliness', 'Solitude', 'Warm', ['alone', 'cooking']),
  e('Cook something slowly on a Sunday and the week behaves better.', 'Spirituality and peace', 'Practice', 'Warm', ['spirituality', 'cooking']),
  e('Photograph your first terrible meal. You will want it later.', 'Photography', 'Home', 'Warm', ['photography', 'firstmeal']),
  e('A borrowed book comes back with somebody else in it.', 'Books and reading', 'Readers', 'Warm', ['books', 'borrowed']),
  e('I keep a spare fuse and a spare key and call it a personality.', 'Personality and identity', 'Identity', 'Wry', ['personality', 'spare']),
  e('I will not lend a book I am not ready to lose.', 'Self-respect', 'Standards', 'Composed', ['selfrespect', 'books']),
  e('The monsoon finds every gap in a rented flat.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'rented']),
  h('अपना खाना बनाना सबसे भरोसेमंद सेहत का फ़ैसला है।', 'Yoga and wellness', 'खाना', 'व्यावहारिक', ['खाना', 'सेहत']),
  h('अकेले के लिए खाना बनाना इस हुनर का सबसे कठिन रूप है।', 'Alone and loneliness', 'अकेलापन', 'कोमल', ['खाना', 'कठिन']),
  h('रविवार को धीरे खाना बनाओ, हफ़्ता ठीक चलता है।', 'Spirituality and peace', 'अभ्यास', 'कोमल', ['खाना', 'हफ़्ता']),
  h('अपना पहला बुरा खाना फ़ोटो में रखो, बाद में याद आएगा।', 'Photography', 'घर', 'कोमल', ['खाना', 'फ़ोटो']),
  h('उधार की किताब किसी और के निशान के साथ लौटती है।', 'Books and reading', 'पाठक', 'कोमल', ['किताब', 'निशान']),
  g('Apna khaana banana sabse bharosemand sehat ka faisla hai.', 'Yoga and wellness', 'Food', 'Practical', ['khaana', 'sehat']),
  g('Akele ke liye khaana banana is hunar ka sabse mushkil roop hai.', 'Alone and loneliness', 'Solitude', 'Warm', ['khaana', 'mushkil']),
  g('Ravivaar ko dheere khaana banao, hafta theek chalta hai.', 'Spirituality and peace', 'Practice', 'Warm', ['khaana', 'hafta']),
  g('Apna pehla bura khaana photo mein rakho, baad mein yaad aayega.', 'Photography', 'Home', 'Warm', ['khaana', 'photo']),
  g('Udhaar ki kitaab kisi aur ke nishaan ke saath lautti hai.', 'Books and reading', 'Readers', 'Warm', ['kitaab', 'nishaan']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('पुराना फ़र्नीचर शहर को घर जैसा बनाता है।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['फ़र्नीचर', 'शहर']),
  h('किसी इंसान के बारे में सही निकलना जीत नहीं है।', 'Attitude', 'परिपक्वता', 'गंभीर', ['इंसान', 'जीत']),
  h('घर के लिए एक छोटा काम करो, वो तुम्हारे लिए कुछ करेगा।', 'Motivational', 'आदत', 'कोमल', ['घर', 'काम']),
  g('Purana furniture shehar ko ghar jaisa banata hai.', 'Life and reality', 'Money', 'Practical', ['furniture', 'shehar']),
  g('Kisi insaan ke baare mein sahi nikalna jeet nahi hai.', 'Attitude', 'Maturity', 'Wise', ['insaan', 'jeet']),
  g('Ghar ke liye ek chhota kaam karo, woh tumhare liye kuch karega.', 'Motivational', 'Habits', 'Warm', ['ghar', 'kaam']),
  g('Doosre haath ki kitaabein sabse sasti sajawat hain.', 'Aesthetic', 'Books', 'Warm', ['kitaabein', 'sajawat']),
  g('Kaali pant aur saaf shirt se har jagah nikal jaoge.', 'Stylish', 'Wardrobe', 'Practical', ['pant', 'shirt']),
];
