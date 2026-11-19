/**
 * BioCraft original bios — batch 035.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_035 = [
  /* ------------------------------------------------------------ Attitude */
  e('I answer to my own standards and they are not for hire.', 'Attitude', 'Independence', 'Firm', ['attitude', 'standards']),
  e('You can dislike me and still be wrong about me.', 'Attitude', 'Composure', 'Sharp', ['attitude', 'wrong']),
  e('I stopped explaining myself and my life got quieter.', 'Attitude', 'Boundaries', 'Composed', ['attitude', 'quiet']),
  e('Respect is not a mood. It is a baseline.', 'Attitude', 'Respect', 'Firm', ['attitude', 'respect']),
  h('मेरे मानक मेरे हैं, किराए पर नहीं मिलते।', 'Attitude', 'आत्मनिर्भरता', 'दृढ़', ['मानक', 'किराए']),
  h('तुम मुझे नापसंद कर सकते हो, और मेरे बारे में ग़लत भी हो सकते हो।', 'Attitude', 'संयम', 'तीखा', ['नापसंद', 'ग़लत']),
  h('खुद को समझाना बंद किया, ज़िंदगी शांत हो गई।', 'Attitude', 'सीमाएं', 'शांत', ['समझाना', 'शांत']),
  g('Mere manak mere hain, kiraaye par nahi milte.', 'Attitude', 'Independence', 'Firm', ['manak', 'kiraaye']),
  g('Tum mujhe napasand kar sakte ho, aur mere baare mein galat bhi ho sakte ho.', 'Attitude', 'Composure', 'Sharp', ['napasand', 'galat']),
  g('Khud ko samjhaana band kiya, zindagi shaant ho gayi.', 'Attitude', 'Boundaries', 'Composed', ['samjhaana', 'shaant']),

  /* ------------------------------------------------------------- Love */
  e('We built a home out of ordinary evenings.', 'Love and romance', 'Everyday', 'Warm', ['love', 'home']),
  e('I did not come here to be completed. I came to share the kitchen.', 'Love and romance', 'Respect', 'Wry', ['love', 'partnership']),
  e('Loving you is the easiest decision I make daily.', 'Love and romance', 'Devotion', 'Tender', ['love', 'daily']),
  e('I want to grow old enough to be bored with you happily.', 'Love and romance', 'Long love', 'Wry', ['love', 'old']),
  h('सादी शामों से हमने घर बनाया।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['शाम', 'घर']),
  h('तुम मेरा आधा नहीं हो, तुम पूरे हो और मैंने चुना।', 'Love and romance', 'सम्मान', 'गंभीर', ['आधा', 'चुना']),
  h('तुमसे प्यार करना मेरा सबसे आसान रोज़ का फ़ैसला है।', 'Love and romance', 'समर्पण', 'कोमल', ['प्यार', 'फ़ैसला']),
  g('Saadi shaamon se humne ghar banaya.', 'Love and romance', 'Everyday', 'Warm', ['shaam', 'ghar']),
  g('Tum mera aadha nahi ho, tum poore ho aur maine chuna.', 'Love and romance', 'Respect', 'Wise', ['aadha', 'chuna']),
  g('Tumse pyaar karna mera sabse aasaan roz ka faisla hai.', 'Love and romance', 'Devotion', 'Tender', ['pyaar', 'faisla']),

  /* --------------------------------------------------- Sad and endings */
  e('I was the one who stayed, and nobody writes about that.', 'Sad and heartbreak', 'Unseen', 'Heavy', ['sad', 'stayed']),
  e('The message I never sent is the longest thing I have written.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'message']),
  e('We did not fail. We simply ran out of the same dream.', 'Sad and heartbreak', 'Endings', 'Honest', ['sad', 'endings']),
  e('I miss the version of me that had not been disappointed yet.', 'Sad and heartbreak', 'Change', 'Quiet', ['sad', 'change']),
  h('मैं वो था जो रुका रहा, और उस पर कोई नहीं लिखता।', 'Sad and heartbreak', 'अनदेखा', 'भारी', ['रुका', 'लिखता']),
  h('जो संदेश कभी नहीं भेजा, वही मेरी सबसे लंबी रचना है।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['संदेश', 'रचना']),
  h('हम फेल नहीं हुए, बस एक ही सपना खत्म हो गया।', 'Sad and heartbreak', 'अंत', 'स्पष्ट', ['सपना', 'खत्म']),
  g('Main woh tha jo ruka raha, aur us par koi nahi likhta.', 'Sad and heartbreak', 'Unseen', 'Heavy', ['ruka', 'likhta']),
  g('Jo sandesh kabhi nahi bheja, wahi meri sabse lambi rachna hai.', 'Sad and heartbreak', 'Longing', 'Aching', ['sandesh', 'rachna']),
  g('Hum fail nahi hue, bas ek hi sapna khatam ho gaya.', 'Sad and heartbreak', 'Endings', 'Honest', ['sapna', 'khatam']),

  /* --------------------------------------------------------- Shayari */
  h('तुझसे मिलकर\nशब्द मिले,\nऔर शब्दों से तू।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['शब्द', 'मिलकर']),
  h('देर लगी\nसमझने में,\nकि देर हो गई।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['देर', 'समझने']),
  h('मैं आसमान\nनहीं हूँ,\nपर छत ज़रूर हूँ।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['आसमान', 'छत']),
  g('Tujhse milkar shabd mile, aur shabdon se tu.', 'Shayari', 'Two line', 'Romantic', ['shabd', 'milk']),
  g('Der lagi samajhne mein, ki der ho gayi.', 'Shayari', 'Two line', 'Aching', ['der', 'samajhne']),
  g('Main aasman nahi hoon, par chhat zaroor hoon.', 'Shayari', 'Two line', 'Deep', ['aasman', 'chhat']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A promise kept in silence is worth ten announced ones.', 'Quotes and thoughts', 'Integrity', 'Wise', ['quotes', 'promise']),
  e('Boredom is often just an idea waiting for a second chance.', 'Quotes and thoughts', 'Creativity', 'Wise', ['quotes', 'boredom']),
  e('The best revenge is a routine you actually enjoy.', 'Quotes and thoughts', 'Living well', 'Wry', ['quotes', 'revenge']),
  e('The pause before replying is the most useful word you own.', 'Quotes and thoughts', 'Speech', 'Wise', ['quotes', 'pause']),
  h('चुपचाप निभाया वादा दस ऐलान से भारी है।', 'Quotes and thoughts', 'ईमानदारी', 'गंभीर', ['वादा', 'ऐलान']),
  h('बोरियत अक्सर एक विचार है जो दूसरा मौक़ा माँग रहा है।', 'Quotes and thoughts', 'रचनात्मकता', 'गंभीर', ['बोरियत', 'विचार']),
  h('सबसे अच्छा बदला अपनी पसंद की दिनचर्या है।', 'Quotes and thoughts', 'जीना', 'सहज', ['बदला', 'दिनचर्या']),
  g('Chupchaap nibhaya waada das ailaan se bhaari hai.', 'Quotes and thoughts', 'Integrity', 'Wise', ['waada', 'ailaan']),
  g('Boriyat aksar ek vichaar hai jo doosra mauka maang raha hai.', 'Quotes and thoughts', 'Creativity', 'Wise', ['boriyat', 'vichaar']),
  g('Sabse accha badla apni pasand ki dincharya hai.', 'Quotes and thoughts', 'Living well', 'Wry', ['badla', 'dincharya']),

  /* ------------------------------------------------- Life and reality */
  e('Everyone is tired. Kindness costs less than you think.', 'Life and reality', 'Kindness', 'Warm', ['life', 'kindness']),
  e('You will be judged for resting and judged for burning out.', 'Life and reality', 'Pressure', 'Honest', ['life', 'rest']),
  e('A stable life is built out of unremarkable weeks.', 'Life and reality', 'Stability', 'Wise', ['life', 'stability']),
  e('Some people are lessons and not destinations.', 'Life and reality', 'People', 'Wise', ['life', 'lessons']),
  h('सब थके हुए हैं, दया सोच से सस्ती है।', 'Life and reality', 'दया', 'कोमल', ['थके', 'दया']),
  h('आराम करने पर भी ताने मिलेंगे, थक जाने पर भी।', 'Life and reality', 'दबाव', 'स्पष्ट', ['आराम', 'ताने']),
  h('स्थिर ज़िंदगी सादे हफ़्तों से बनती है।', 'Life and reality', 'स्थिरता', 'गंभीर', ['ज़िंदगी', 'हफ़्ते']),
  g('Sab thake hue hain, daya soch se sasti hai.', 'Life and reality', 'Kindness', 'Warm', ['thake', 'daya']),
  g('Aaram karne par bhi taane milenge, thak jaane par bhi.', 'Life and reality', 'Pressure', 'Honest', ['aaram', 'taane']),
  g('Sthir zindagi saade hafton se banti hai.', 'Life and reality', 'Stability', 'Wise', ['sthira', 'hafton']),

  /* ------------------------------------------------------- Motivational */
  e('You do not need a new plan. You need one honest week.', 'Motivational', 'Action', 'Direct', ['motivation', 'week']),
  e('Finish one thing before you announce the next five.', 'Motivational', 'Focus', 'Direct', ['motivation', 'finish']),
  e('Effort compounds quietly, which is why people quit early.', 'Motivational', 'Patience', 'Wise', ['motivation', 'patience']),
  h('नई योजना नहीं चाहिए, एक ईमानदार हफ़्ता चाहिए।', 'Motivational', 'कर्म', 'स्पष्ट', ['योजना', 'हफ़्ता']),
  h('अगले पाँच का ऐलान करने से पहले एक पूरा करो।', 'Motivational', 'एकाग्रता', 'स्पष्ट', ['ऐलान', 'पूरा']),
  g('Nayi yojana nahi chahiye, ek imaandaar hafta chahiye.', 'Motivational', 'Action', 'Direct', ['yojana', 'hafta']),
  g('Agle paanch ka ailaan karne se pehle ek poora karo.', 'Motivational', 'Focus', 'Direct', ['ailaan', 'poora']),

  /* --------------------------------------------------------- Aesthetic */
  e('Keep one beautiful object where you can see it while you work.', 'Aesthetic', 'Workspace', 'Warm', ['aesthetic', 'workspace']),
  e('Warm light makes a rented room feel owned.', 'Aesthetic', 'Light', 'Warm', ['aesthetic', 'light']),
  e('A well-made bed is a small daily victory.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'bed']),
  h('काम करते वक़्त आँखों के सामने एक खूबसूरत चीज़ रखो।', 'Aesthetic', 'कार्यस्थल', 'कोमल', ['काम', 'चीज़']),
  h('गर्म रोशनी किराए के कमरे को अपना बना देती है।', 'Aesthetic', 'रोशनी', 'कोमल', ['रोशनी', 'कमरे']),
  g('Kaam karte waqt aankhon ke saamne ek khoobsurat cheez rakho.', 'Aesthetic', 'Workspace', 'Warm', ['kaam', 'cheez']),
  g('Garam roshni kiraaye ke kamre ko apna bana deti hai.', 'Aesthetic', 'Light', 'Warm', ['roshni', 'kamre']),

  /* ------------------------------------------------- Royal and creator */
  e('Speak last and you will speak best.', 'Royal and VIP', 'Poise', 'Poised', ['royal', 'speak']),
  e('Grace is doing the difficult thing without an audience.', 'Royal and VIP', 'Grace', 'Poised', ['royal', 'grace']),
  e('Teach one thing well and the followers become students.', 'Creator and influencer', 'Teaching', 'Wise', ['creator', 'teaching']),
  e('Make peace with being misunderstood by strangers.', 'Creator and influencer', 'Resilience', 'Firm', ['creator', 'resilience']),
  h('सबसे आख़िर में बोलो, सबसे अच्छा बोलोगे।', 'Royal and VIP', 'गरिमा', 'शांत', ['आख़िर', 'बोलो']),
  h('शालीनता वो है जो बिना दर्शक किया जाए।', 'Royal and VIP', 'शालीनता', 'शांत', ['शालीनता', 'दर्शक']),
  g('Jab sab bol chukein, tab tum dhang se bolo.', 'Royal and VIP', 'Poise', 'Poised', ['dhang', 'bolo']),
  g('Shaalinata woh hai jo bina darshak kiya jaye.', 'Royal and VIP', 'Grace', 'Poised', ['shaalinata', 'darshak']),
  g('Ek cheez dhang se sikhao, followers students ban jaate hain.', 'Creator and influencer', 'Teaching', 'Wise', ['cheez', 'sikhao']),

  /* --------------------------------------------------- Mid-field top-up */
  e('Write badly on purpose. The page forgives quickly.', 'Poetry', 'Process', 'Wry', ['poetry', 'draft']),
  e('A library card is the cheapest ticket anywhere.', 'Books and reading', 'Access', 'Warm', ['books', 'library']),
  e('Rice, salt, and patience will feed you for a lifetime.', 'Food and cooking', 'Basics', 'Wise', ['food', 'basics']),
  e('Sore muscles are a receipt, not a penalty.', 'Fitness', 'Training', 'Practical', ['fitness', 'training']),
  e('Ask permission before photographing people. It changes the picture.', 'Photography', 'Ethics', 'Wise', ['photography', 'ethics']),
  e('Learn the song fully before you change it.', 'Music and art', 'Craft', 'Practical', ['music', 'craft']),
  e('A cat on your laptop is a reminder that nothing is urgent.', 'Pets and animals', 'Cats', 'Wry', ['pets', 'cats']),
  e('A sequel that respects the first film is a gift.', 'Cinema and OTT', 'Fandom', 'Warm', ['cinema', 'sequel']),
  e('Carry cash in the rain and be kind to the auto driver.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'kindness']),
  e('The best travel story is the one where nothing went right.', 'Travel and adventure', 'Stories', 'Wry', ['travel', 'stories']),
  h('जानबूझकर बुरा लिखो, सफ़ा जल्दी माफ़ कर देता है।', 'Poetry', 'रचना', 'सहज', ['लिखो', 'सफ़ा']),
  h('पुस्तकालय का कार्ड सबसे सस्ता टिकट है।', 'Books and reading', 'पहुँच', 'कोमल', ['कार्ड', 'टिकट']),
  h('चावल, नमक और सब्र ज़िंदगी भर खिला देंगे।', 'Food and cooking', 'मूल बातें', 'गंभीर', ['चावल', 'सब्र']),
  h('बारिश में नक़द रखो और ऑटो वाले से अच्छा बर्ताव करो।', 'Monsoon and seasons', 'बारिश', 'कोमल', ['बारिश', 'नक़द']),
  g('Jaanbujhkar bura likho, safa jaldi maaf kar deta hai.', 'Poetry', 'Process', 'Wry', ['bura', 'safa']),
  g('Pustakalay ka card sabse sasta ticket hai.', 'Books and reading', 'Access', 'Warm', ['pustakalay', 'ticket']),
  g('Chaawal, namak aur sabr zindagi bhar khila denge.', 'Food and cooking', 'Basics', 'Wise', ['chaawal', 'sabr']),
  g('Baarish mein nakad rakho aur auto wale se accha bartaav karo.', 'Monsoon and seasons', 'Rain', 'Warm', ['baarish', 'nakad']),
  g('Sabse accha safar woh hai jismein kuch bhi theek nahi chala.', 'Travel and adventure', 'Stories', 'Wry', ['safar', 'theek']),
];
