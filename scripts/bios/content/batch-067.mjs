/**
 * BioCraft original bios — batch 067.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 32 HI / 33 HG.
 * New subject matter: the cobbler under a tree, a stolen exam answer sheet,
 * the ceiling that leaks, a brother who left for the Gulf,
 * a neighbour's wedding band, and the bus stop that has no roof.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_067 = [
  /* ------------------------------------------------------------ Attitude */
  e('I get the shoes mended instead of replacing them and calling it taste.', 'Attitude', 'Restraint', 'Firm', ['attitude', 'cobbler']),
  e('I pay the cobbler the price he asks and not the one I invented.', 'Attitude', 'Fairness', 'Direct', ['attitude', 'price']),
  e('I tell the landlord about the leak the same day I see it.', 'Attitude', 'Honesty', 'Practical', ['attitude', 'leak']),
  h('जूते नए लेने के बजाय सिलवा लेता हूँ, और उसे अंदाज़ नहीं कहता।', 'Attitude', 'संयम', 'दृढ़', ['जूते', 'सिलवा']),
  h('मोची जो दाम बोले, वही देता हूँ, अपना बनाया दाम नहीं।', 'Attitude', 'न्याय', 'स्पष्ट', ['मोची', 'दाम']),
  h('छत का रिसाव देखते ही उसी दिन मकान मालिक को बताता हूँ।', 'Attitude', 'ईमानदारी', 'व्यावहारिक', ['छत', 'मकान']),
  h('अपने लिए कुछ लेने से पहले घर पैसे भेजता हूँ।', 'Attitude', 'फ़र्ज़', 'दृढ़', ['पैसे', 'घर']),
  g('Joote naye lene ke bajay silwa leta hoon, aur use andaaz nahi kehta.', 'Attitude', 'Restraint', 'Firm', ['joote', 'silwa']),
  g('Mochi jo daam bole, wahi deta hoon, apna banaya daam nahi.', 'Attitude', 'Fairness', 'Direct', ['mochi', 'daam']),
  g('Chhat ka risaav dekhte hi usi din makaan malik ko batata hoon.', 'Attitude', 'Honesty', 'Practical', ['chhat', 'makaan']),
  g('Apne liye kuch lene se pehle ghar paise bhejta hoon.', 'Attitude', 'Duty', 'Firm', ['paise', 'ghar']),

  /* ------------------------------------------------------------- Love */
  e('You send me the bus fare when I pretend I have it.', 'Love and romance', 'Knowing', 'Tender', ['love', 'fare']),
  e('We stood under one umbrella at a stop with no roof for forty minutes.', 'Love and romance', 'Weather', 'Warm', ['love', 'stop']),
  e('Your brother calls you from the Gulf and you always hand me the phone.', 'Love and romance', 'Family', 'Warm', ['love', 'brother']),
  e('You stitch the torn shoe yourself and tell me the cobbler did it.', 'Love and romance', 'Care', 'Tender', ['love', 'cobbler']),
  h('जब मैं किराया है ही नहीं कहता, तुम चुपचाप भेज देते हो।', 'Love and romance', 'जानना', 'कोमल', ['किराया', 'चुपचाप']),
  h('बिना छत वाले बस स्टॉप पर चालीस मिनट एक ही छाते में खड़े रहे।', 'Love and romance', 'मौसम', 'कोमल', ['छाते', 'मिनट']),
  h('फटे जूते तुम ख़ुद सी देते हो और कहते हो मोची ने सिले।', 'Love and romance', 'परवाह', 'कोमल', ['जूते', 'मोची']),
  g('Jab main kiraya hai hi nahi kehta, tum chupchaap bhej dete ho.', 'Love and romance', 'Knowing', 'Tender', ['kiraya', 'chupchaap']),
  g('Bina chhat wale bus stop par chalees minute ek hi chhaate mein khade rahe.', 'Love and romance', 'Weather', 'Warm', ['chhaate', 'minute']),
  g('Phate joote tum khud see dete ho aur kehte ho mochi ne sile.', 'Love and romance', 'Care', 'Tender', ['joote', 'mochi']),

  /* ------------------------------------------------------- Sad depth */
  e('My brother left for the Gulf when I was nine and came back a stranger.', 'Sad and heartbreak', 'Family', 'Heavy', ['sad', 'brother']),
  e('Answer sheets were stolen from the exam centre and we sat the paper again.', 'Sad and heartbreak', 'School', 'Honest', ['sad', 'exam']),
  e('The ceiling leaked every July and we kept the bed in the same place.', 'Sad and heartbreak', 'Home', 'Heavy', ['sad', 'leak']),
  e('I learned to mend shoes because nobody would mend mine for free.', 'Sad and heartbreak', 'Money', 'Quiet', ['sad', 'cobbler']),
  h('भाई नौ साल की उम्र में खाड़ी गया और अजनबी बनकर लौटा।', 'Sad and heartbreak', 'परिवार', 'भारी', ['भाई', 'खाड़ी']),
  h('परीक्षा केंद्र से पर्चे चोरी हो गए और हमें दोबारा बैठना पड़ा।', 'Sad and heartbreak', 'स्कूल', 'स्पष्ट', ['पर्चे', 'चोरी']),
  h('हर जुलाई छत चूती थी, और हम बिस्तर वहीं रखते रहे।', 'Sad and heartbreak', 'घर', 'भारी', ['छत', 'बिस्तर']),
  g('Bhai nau saal ki umar mein Khaadi gaya aur ajnabi bankar lauta.', 'Sad and heartbreak', 'Family', 'Heavy', ['bhai', 'Khaadi']),
  g('Pariksha kendra se parche chori ho gaye aur humein dobara baithna pada.', 'Sad and heartbreak', 'School', 'Honest', ['parche', 'chori']),
  g('Har July chhat chooti thi, aur hum bistar wahin rakhte rahe.', 'Sad and heartbreak', 'Home', 'Heavy', ['chhat', 'bistar']),

  /* --------------------------------------------------------- Shayari */
  h('छत चूती है,\nऔर हम\nगिनते रहते हैं।', 'Shayari', 'तीन पंक्ति', 'शांत', ['छत', 'गिनते']),
  h('भाई लौटा,\nनाम\nवही था।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['भाई', 'नाम']),
  g('Chhat chooti hai, aur hum ginte rehte hain.', 'Shayari', 'Two line', 'Quiet', ['chhat', 'ginte']),
  g('Bhai lauta, naam wahi tha.', 'Shayari', 'Two line', 'Aching', ['bhai', 'naam']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A man who mends shoes for twenty years has repaired half a town.', 'Quotes and thoughts', 'Work', 'Warm', ['quotes', 'cobbler']),
  e('A leak is not a problem until it reaches the bed. Then it is a season.', 'Quotes and thoughts', 'Home', 'Sharp', ['quotes', 'leak']),
  e('Money sent home is love translated into a currency.', 'Quotes and thoughts', 'Family', 'Warm', ['quotes', 'money']),
  h('बीस साल जूते सिलने वाले आदमी ने आधा शहर ठीक किया है।', 'Quotes and thoughts', 'काम', 'कोमल', ['जूते', 'शहर']),
  h('रिसाव तब तक बात नहीं, जब तक बिस्तर तक न पहुँचे। फिर वो मौसम है।', 'Quotes and thoughts', 'घर', 'तीखा', ['रिसाव', 'मौसम']),
  h('घर भेजा पैसा प्यार है, जिसे करंसी में बदला गया है।', 'Quotes and thoughts', 'परिवार', 'कोमल', ['पैसा', 'प्यार']),
  g('Bees saal joote silne wale aadmi ne aadha shehar theek kiya hai.', 'Quotes and thoughts', 'Work', 'Warm', ['joote', 'shehar']),
  g('Risaav tab tak baat nahi, jab tak bistar tak na pahunche. Phir woh mausam hai.', 'Quotes and thoughts', 'Home', 'Sharp', ['risaav', 'mausam']),
  g('Ghar bheja paisa pyaar hai, jise currency mein badla gaya hai.', 'Quotes and thoughts', 'Family', 'Warm', ['paisa', 'pyaar']),

  /* ------------------------------------------------- Life and reality */
  e('Mend the sole before the upper tears. It is cheaper twice.', 'Life and reality', 'Money', 'Practical', ['life', 'cobbler']),
  e('Put a bucket under the leak and photograph it. The landlord believes pictures.', 'Life and reality', 'Home', 'Practical', ['life', 'leak']),
  e('Agree the money you will send home before the salary arrives.', 'Life and reality', 'Family', 'Practical', ['life', 'money']),
  e('Carry a folded umbrella in June. The stop has no roof.', 'Life and reality', 'Weather', 'Practical', ['life', 'stop']),
  h('तला फटने से पहले सिलवा लो, दोनों बार सस्ता पड़ता है।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['तला', 'सिलवा']),
  h('रिसाव के नीचे बाल्टी रखो और तस्वीर खींचो, मकान मालिक तस्वीर मानता है।', 'Life and reality', 'घर', 'व्यावहारिक', ['बाल्टी', 'तस्वीर']),
  h('तनख़्वाह आने से पहले तय करो घर कितना भेजना है।', 'Life and reality', 'परिवार', 'व्यावहारिक', ['तनख़्वाह', 'घर']),
  h('जून में मोड़कर रखा छाता लेकर निकलो, स्टॉप पर छत नहीं है।', 'Life and reality', 'मौसम', 'व्यावहारिक', ['छाता', 'स्टॉप']),
  g('Tala phatne se pehle silwa lo, dono baar sasta padta hai.', 'Life and reality', 'Money', 'Practical', ['tala', 'silwa']),
  g('Risaav ke neeche baalti rakho aur tasveer kheencho, makaan malik tasveer maanta hai.', 'Life and reality', 'Home', 'Practical', ['baalti', 'tasveer']),
  g('Tankhwah aane se pehle tay karo ghar kitna bhejna hai.', 'Life and reality', 'Family', 'Practical', ['tankhwah', 'ghar']),
  g('June mein modkar rakha chhaata lekar niklo, stop par chhat nahi hai.', 'Life and reality', 'Weather', 'Practical', ['chhaata', 'stop']),

  /* ------------------------------------------------------ Motivational */
  e('A repaired thing teaches you what you actually own.', 'Motivational', 'Restraint', 'Warm', ['motivation', 'repair']),
  e('Send the money first. The shoes can wait a month.', 'Motivational', 'Duty', 'Direct', ['motivation', 'duty']),
  e('Sitting the paper again is not failure. It is a second appointment.', 'Motivational', 'Resilience', 'Wise', ['motivation', 'resilience']),
  h('ठीक की हुई चीज़ सिखाती है कि तुम्हारे पास असल में क्या है।', 'Motivational', 'संयम', 'कोमल', ['चीज़', 'असल']),
  h('पैसे पहले भेजो, जूते एक महीना रुक सकते हैं।', 'Motivational', 'फ़र्ज़', 'स्पष्ट', ['पैसे', 'जूते']),
  h('दोबारा पर्चा देना नाकामी नहीं, दूसरी तारीख़ है।', 'Motivational', 'सब्र', 'गंभीर', ['पर्चा', 'तारीख़']),
  g('Theek ki hui cheez sikhaati hai ki tumhare paas asal mein kya hai.', 'Motivational', 'Restraint', 'Warm', ['cheez', 'asal']),
  g('Paise pehle bhejo, joote ek mahina ruk sakte hain.', 'Motivational', 'Duty', 'Direct', ['paise', 'joote']),
  g('Dobara parcha dena nakaami nahi, doosri taarikh hai.', 'Motivational', 'Resilience', 'Wise', ['parcha', 'taarikh']),

  /* -------------------------------------------------------- Aesthetic */
  e('A stitched sole with good thread looks better than a cheap new pair.', 'Aesthetic', 'Objects', 'Practical', ['aesthetic', 'sole']),
  e('Polish the mended shoes and nobody sees the repair.', 'Aesthetic', 'Style', 'Practical', ['aesthetic', 'shoes']),
  h('अच्छे धागे से सिला तला सस्ते नए जोड़े से बेहतर दिखता है।', 'Aesthetic', 'चीज़ें', 'व्यावहारिक', ['धागे', 'तला']),
  h('रिसाव के नीचे रखी बाल्टी, अच्छी रोशनी में, अपनी ही तस्वीर है।', 'Aesthetic', 'घर', 'सहज', ['बाल्टी', 'रोशनी']),
  g('Acche dhaage se sila tala saste naye jode se behtar dikhta hai.', 'Aesthetic', 'Objects', 'Practical', ['dhaage', 'tala']),
  g('Risaav ke neeche rakhi baalti, acchi roshni mein, apni hi tasveer hai.', 'Aesthetic', 'Home', 'Wry', ['baalti', 'roshni']),

  /* ---------------------------------------------- Wider category band */
  e('Wet feet all monsoon is how a small infection becomes a big one.', 'Yoga and wellness', 'Health', 'Practical', ['yoga', 'monsoon']),
  e('Keep your answer sheet and your admit card in the same plastic sleeve.', 'Student life', 'Exams', 'Practical', ['student', 'exams']),
  e('A man who repairs shoes has better margins than most apps.', 'Professional and business', 'Craft', 'Wry', ['professional', 'craft']),
  e('A wet outfield teaches you more about patience than any team talk.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'rain']),
  e('Keep the shoes dry and they will last three monsoons longer.', 'Cars and bikes', 'Care', 'Practical', ['cars', 'shoes']),
  e('A plain leather shoe, polished, is the whole formal outfit.', 'Fashion and beauty', 'Shoes', 'Practical', ['fashion', 'shoes']),
  e('A leak under a bucket is a logging problem. Note the date and the rate.', 'Technology and coding', 'Craft', 'Wry', ['tech', 'logging']),
  e('Measure the drip for ten minutes and you can predict the month.', 'Science and curiosity', 'Measurement', 'Practical', ['science', 'measurement']),
  e('Tell the landlord the cost before the work, not after.', 'Startup and hustle', 'Money', 'Sharp', ['startup', 'money']),
  e('A ceiling that holds through July is worth more than a new sofa.', 'Home and interiors', 'Repairs', 'Practical', ['home', 'ceiling']),
  e('Well-kept shoes say more about a person than the shirt does.', 'Stylish', 'Shoes', 'Wise', ['stylish', 'shoes']),
  e('The funniest thing at a cobbler is the shoe that was clearly not worth saving.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'cobbler']),
  e('I will tell you which landlord fixes the roof and which one sends a bucket.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who lends you an umbrella at a bus stop has settled the debt forever.', 'Friendship', 'Small things', 'Warm', ['friendship', 'umbrella']),
  e('My mother sewed the torn school shoe at night so I would not be sent home.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Rain on a tin roof is the oldest music and the cheapest.', 'Spirituality and peace', 'Rain', 'Wise', ['spirituality', 'rain']),
  e('Photograph the mended sole. It is a document of care.', 'Photography', 'Objects', 'Warm', ['photography', 'sole']),
  e('Get off at a stop with no roof and you will meet the real neighbourhood.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'stop']),
  e('A post about a leaking ceiling gets more replies than a post about rent.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who knows which corner has the good cobbler.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'cobbler']),
  e('I will not leave a shoe to rot when the man who mends it is two streets away.', 'Self-respect', 'Restraint', 'Firm', ['selfrespect', 'restraint']),
  e('A leak in July is a budget line, not a surprise.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'leak']),
  h('पूरी बारिश गीले पैरों में रहना छोटी बीमारी को बड़ी बना देता है।', 'Yoga and wellness', 'सेहत', 'व्यावहारिक', ['पैरों', 'बीमारी']),
  h('पर्चा और प्रवेश पत्र एक ही प्लास्टिक के लिफ़ाफ़े में रखो।', 'Student life', 'परीक्षा', 'व्यावहारिक', ['पर्चा', 'लिफ़ाफ़े']),
  h('जूते सूखे रखो, तीन बरसात ज़्यादा चलेंगे।', 'Cars and bikes', 'देखभाल', 'व्यावहारिक', ['जूते', 'बरसात']),
  h('जुलाई बीत जाने वाली छत नई सोफ़े से ज़्यादा क़ीमती है।', 'Home and interiors', 'मरम्मत', 'व्यावहारिक', ['छत', 'सोफ़े']),
  h('माँ ने रात में स्कूल का फटा जूता सी दिया ताकि मुझे घर न भेजा जाए।', 'Family', 'माँ-बाप', 'कोमल', ['माँ', 'जूता']),
  h('टिन की छत पर बारिश सबसे पुराना और सबसे सस्ता संगीत है।', 'Spirituality and peace', 'बारिश', 'गंभीर', ['छत', 'संगीत']),
  g('Poori baarish geele pairon mein rehna chhoti bimari ko badi bana deta hai.', 'Yoga and wellness', 'Health', 'Practical', ['pairon', 'bimari']),
  g('Parcha aur pravesh patra ek hi plastic ke lifafe mein rakho.', 'Student life', 'Exams', 'Practical', ['parcha', 'lifafe']),
  g('Joote sookhe rakho, teen barsaat zyada chalenge.', 'Cars and bikes', 'Care', 'Practical', ['joote', 'barsaat']),
  g('July beet jaane wali chhat naye sofe se zyada keemti hai.', 'Home and interiors', 'Repairs', 'Practical', ['chhat', 'sofe']),
  g('Maa ne raat mein school ka phata joota see diya taaki mujhe ghar na bheja jaaye.', 'Family', 'Parents', 'Tender', ['maa', 'joota']),
  g('Tin ki chhat par baarish sabse purana aur sabse sasta sangeet hai.', 'Spirituality and peace', 'Rain', 'Wise', ['chhat', 'sangeet']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('अपने लिए कुछ लेने से पहले घर पैसा भेजना मेरी आदत है।', 'Attitude', 'फ़र्ज़', 'दृढ़', ['घर', 'पैसा']),
  h('बिना छत के बस स्टॉप किसी के फ़ैसले की निशानी है।', 'Quotes and thoughts', 'शहर', 'तीखा', ['स्टॉप', 'फ़ैसले']),
  g('Apne liye kuch lene se pehle ghar paisa bhejna meri aadat hai.', 'Attitude', 'Duty', 'Firm', ['ghar', 'paisa']),
  g('Bina chhat ke bus stop kisi ke faisle ki nishani hai.', 'Quotes and thoughts', 'Cities', 'Sharp', ['stop', 'faisle']),
  g('Do kamizein, ek jodi joote, ek chhaata. Barsaat ka hisaab poora.', 'Minimal', 'Wardrobe', 'Practical', ['kamizein', 'chhaata']),
];
