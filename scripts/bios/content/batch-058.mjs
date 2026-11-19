/**
 * BioCraft original bios — batch 058.
 * Allocation from scripts/bios/balance.mjs: 46 EN / 34 HI / 30 HG.
 * New subject matter: a plumber who quotes first, the school reunion,
 * a borrowed scooter, the wheat harvest, learning a language at thirty.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_058 = [
  /* ------------------------------------------------------------ Attitude */
  e('I ask the plumber for the full price before the first cut.', 'Attitude', 'Practicality', 'Direct', ['attitude', 'plumber']),
  e('I return a borrowed scooter with a full tank.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'scooter']),
  e('I do not perform success at a school reunion.', 'Attitude', 'Honesty', 'Composed', ['attitude', 'reunion']),
  h('प्लंबर से पहली काट से पहले पूरा दाम पूछता हूँ।', 'Attitude', 'व्यवहार', 'स्पष्ट', ['प्लंबर', 'दाम']),
  h('उधार का स्कूटर भरा टैंक करके लौटाता हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['स्कूटर', 'टैंक']),
  h('स्कूल रीयूनियन में कामयाबी का दिखावा नहीं करता।', 'Attitude', 'सच्चाई', 'शांत', ['रीयूनियन', 'दिखावा']),
  g('Plumber se pehli cut se pehle poora daam poochta hoon.', 'Attitude', 'Practicality', 'Direct', ['plumber', 'daam']),
  g('Udhaar ka scooter bhara tank karke lautata hoon.', 'Attitude', 'Integrity', 'Firm', ['scooter', 'tank']),
  g('School reunion mein kamyabi ka dikhawa nahi karta.', 'Attitude', 'Honesty', 'Composed', ['reunion', 'dikhawa']),

  /* ------------------------------------------------------------- Love */
  e('You learn my language badly and I love you for every mistake.', 'Love and romance', 'Effort', 'Tender', ['love', 'language']),
  e('We met at a reunion and left early together.', 'Love and romance', 'Beginning', 'Warm', ['love', 'reunion']),
  e('A slow Sunday with you is the argument for staying put.', 'Love and romance', 'Contentment', 'Tender', ['love', 'sunday']),
  h('तुम मेरी भाषा अधूरी सीखते हो, और हर ग़लती पर और प्यार आता है।', 'Love and romance', 'कोशिश', 'कोमल', ['भाषा', 'ग़लती']),
  h('हम रीयूनियन में मिले और साथ जल्दी निकल गए।', 'Love and romance', 'शुरुआत', 'कोमल', ['रीयूनियन', 'साथ']),
  h('मुझे तुम्हारी चाय और तुम्हारा सबसे बुरा महीना याद है।', 'Love and romance', 'जानना', 'कोमल', ['चाय', 'महीना']),
  g('Tum meri bhaasha adhoori seekhte ho, aur har galti par aur pyaar aata hai.', 'Love and romance', 'Effort', 'Tender', ['bhaasha', 'galti']),
  g('Hum reunion mein mile aur saath jaldi nikal gaye.', 'Love and romance', 'Beginning', 'Warm', ['reunion', 'saath']),
  g('Mujhe tumhari chai aur tumhara sabse bura mahina yaad hai.', 'Love and romance', 'Knowing', 'Warm', ['chai', 'mahina']),

  /* ------------------------------------------------------- Sad depth */
  e('The reunion taught me that everyone was guessing too.', 'Sad and heartbreak', 'Memory', 'Honest', ['sad', 'reunion']),
  e('The harvest came late and the loan did not.', 'Sad and heartbreak', 'Village', 'Heavy', ['sad', 'harvest']),
  e('At thirty I started a language from the alphabet, and I cried once.', 'Sad and heartbreak', 'Learning', 'Honest', ['sad', 'learning']),
  h('रीयूनियन ने सिखाया कि सब अंदाज़ा ही लगा रहे थे।', 'Sad and heartbreak', 'याद', 'स्पष्ट', ['रीयूनियन', 'अंदाज़ा']),
  h('फ़सल देर से आई, क़र्ज़ समय पर आ गया।', 'Sad and heartbreak', 'गाँव', 'भारी', ['फ़सल', 'क़र्ज़']),
  h('मैंने स्कूटर उधार लिया ताकि कमाया हुआ दिखूँ, और किसी को फ़र्क़ नहीं पड़ा।', 'Sad and heartbreak', 'पैसा', 'सहज', ['स्कूटर', 'पैसा']),
  g('Reunion ne sikhaya ki sab andaaza hi laga rahe the.', 'Sad and heartbreak', 'Memory', 'Honest', ['reunion', 'andaaza']),
  g('Fasal der se aayi, karz samay par aa gaya.', 'Sad and heartbreak', 'Village', 'Heavy', ['fasal', 'karz']),
  g('Maine scooter udhaar liya taaki kamaya hua dikhun, aur kisi ko farq nahi pada.', 'Sad and heartbreak', 'Money', 'Wry', ['scooter', 'paisa']),

  /* --------------------------------------------------------- Shayari */
  h('फ़सल रुकी,\nमौसम नहीं।\nक़र्ज़ नहीं रुका।', 'Shayari', 'तीन पंक्ति', 'भारी', ['फ़सल', 'क़र्ज़']),
  h('स्कूल का गेट\nवही है,\nहम नहीं।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['गेट', 'स्कूल']),
  g('Fasal ruki, mausam nahi. Karz nahi ruka.', 'Shayari', 'Two line', 'Heavy', ['fasal', 'karz']),
  g('School ka gate wahi hai, hum nahi.', 'Shayari', 'Two line', 'Aching', ['gate', 'school']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A quote in writing is the difference between help and a bill.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'quote']),
  e('Everybody at a reunion is editing their own story.', 'Quotes and thoughts', 'Memory', 'Wise', ['quotes', 'reunion']),
  e('Rent a scooter. Own your mornings.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'scooter']),
  e('Learning the alphabet at thirty is a form of courage.', 'Quotes and thoughts', 'Courage', 'Warm', ['quotes', 'courage']),
  h('लिख में दिया दाम, मदद और बिल के बीच का फ़र्क़ है।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['दाम', 'बिल']),
  h('रीयूनियन में हर कोई अपनी कहानी सँवार रहा होता है।', 'Quotes and thoughts', 'याद', 'गंभीर', ['कहानी', 'रीयूनियन']),
  h('तीस पर वर्णमाला सीखना भी एक हिम्मत है।', 'Quotes and thoughts', 'हिम्मत', 'कोमल', ['वर्णमाला', 'हिम्मत']),
  g('Likh mein diya daam, madad aur bill ke beech ka farq hai.', 'Quotes and thoughts', 'Money', 'Sharp', ['daam', 'bill']),
  g('Reunion mein har koi apni kahani sanwaar raha hota hai.', 'Quotes and thoughts', 'Memory', 'Wise', ['kahani', 'reunion']),
  g('Tees par varnamala seekhna bhi ek himmat hai.', 'Quotes and thoughts', 'Courage', 'Warm', ['varnamala', 'himmat']),

  /* ------------------------------------------------- Life and reality */
  e('Nobody at a reunion needs the truth about your salary.', 'Life and reality', 'Honesty', 'Sharp', ['life', 'reunion']),
  e('Get the plumber quote over text so it stays a quote.', 'Life and reality', 'Money', 'Practical', ['life', 'plumber']),
  e('Learn ten words a day and in a year you have a language.', 'Life and reality', 'Learning', 'Wise', ['life', 'learning']),
  e('Farm debt is a calendar, not a character flaw.', 'Life and reality', 'Village', 'Warm', ['life', 'farm']),
  h('रीयूनियन में किसी को तुम्हारी तनख़्वाह की सच्चाई नहीं चाहिए।', 'Life and reality', 'सच्चाई', 'तीखा', ['तनख़्वाह', 'सच्चाई']),
  h('प्लंबर से लिखित में दाम लो, ताकि बात दाम रहे।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['प्लंबर', 'दाम']),
  h('उधार का वाहन छोड़ते वक़्त से ज़्यादा साफ़ लौटाओ।', 'Life and reality', 'व्यवहार', 'व्यावहारिक', ['वाहन', 'साफ़']),
  g('Reunion mein kisi ko tumhari tankhwah ki sachchai nahi chahiye.', 'Life and reality', 'Honesty', 'Sharp', ['tankhwah', 'sachchai']),
  g('Plumber se likhit mein daam lo, taaki baat daam rahe.', 'Life and reality', 'Money', 'Practical', ['plumber', 'daam']),
  g('Udhaar ka vaahan chhodte waqt se zyada saaf lauto.', 'Life and reality', 'Manners', 'Practical', ['vaahan', 'saaf']),

  /* ------------------------------------------------------ Motivational */
  e('Ask the embarrassing question early and save a month.', 'Motivational', 'Candour', 'Direct', ['motivation', 'candour']),
  e('Being behind at thirty is still being on the road.', 'Motivational', 'Patience', 'Warm', ['motivation', 'patience']),
  e('A written quote is self-respect with a date on it.', 'Motivational', 'Worth', 'Firm', ['motivation', 'worth']),
  h('शर्म वाला सवाल जल्दी पूछो और एक महीना बचाओ।', 'Motivational', 'स्पष्टता', 'स्पष्ट', ['सवाल', 'महीना']),
  h('तीस पर पीछे होना भी रास्ते पर होना है।', 'Motivational', 'सब्र', 'कोमल', ['तीस', 'रास्ते']),
  h('लिखित दाम तारीख़ वाला स्वाभिमान है।', 'Motivational', 'क़ीमत', 'दृढ़', ['दाम', 'स्वाभिमान']),
  g('Sharm wala sawaal jaldi poocho aur ek mahina bachao.', 'Motivational', 'Candour', 'Direct', ['sawaal', 'mahina']),
  g('Tees par peeche hona bhi raaste par hona hai.', 'Motivational', 'Patience', 'Warm', ['tees', 'raaste']),
  g('Likhit daam taarikh wala swabhiman hai.', 'Motivational', 'Worth', 'Firm', ['daam', 'swabhiman']),

  /* -------------------------------------------------------- Aesthetic */
  e('A clean bathroom is the most underrated renovation.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'bathroom']),
  e('Exposed pipe, painted properly, is a design choice.', 'Aesthetic', 'Home', 'Wry', ['aesthetic', 'pipes']),
  h('साफ़ बाथरूम सबसे कम सराही जाने वाली मरम्मत है।', 'Aesthetic', 'घर', 'व्यावहारिक', ['बाथरूम', 'मरम्मत']),
  h('दिखती पाइप, ढंग से रँगी हो तो डिज़ाइन है।', 'Aesthetic', 'घर', 'सहज', ['पाइप', 'डिज़ाइन']),
  g('Saaf bathroom sabse kam saraahi jaane wali marammat hai.', 'Aesthetic', 'Home', 'Practical', ['bathroom', 'marammat']),
  g('Dikhti pipe, dhang se rangi ho toh design hai.', 'Aesthetic', 'Home', 'Wry', ['pipe', 'design']),

  /* ---------------------------------------------- Wider category band */
  e('A slow Sunday morning is a medical intervention.', 'Yoga and wellness', 'Rest', 'Warm', ['yoga', 'rest']),
  e('Write the exam date on the wall and the panic gets smaller.', 'Student life', 'Exams', 'Practical', ['student', 'exams']),
  e('A written quotation protects both sides of a repair.', 'Professional and business', 'Contracts', 'Practical', ['professional', 'quote']),
  e('A slow bowler who holds a line is worth his overs.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'bowling']),
  e('Ask what the part costs before you agree to the labour.', 'Cars and bikes', 'Repairs', 'Practical', ['cars', 'repairs']),
  e('A reunion outfit should be something you already own.', 'Fashion and beauty', 'Style', 'Practical', ['fashion', 'reunion']),
  e('A quote calculator is ten lines of code and saves friendships.', 'Technology and coding', 'Craft', 'Wry', ['tech', 'pricing']),
  e('Take the measurement twice, then trust the number.', 'Science and curiosity', 'Method', 'Practical', ['science', 'measurement']),
  e('Price the repair honestly and the customer returns twice.', 'Startup and hustle', 'Service', 'Wise', ['startup', 'service']),
  e('Fix the leaking tap before you buy the new sofa.', 'Home and interiors', 'Repairs', 'Practical', ['home', 'repairs']),
  e('One good jacket, one good shirt, one good pair of shoes.', 'Minimal', 'Wardrobe', 'Practical', ['minimal', 'wardrobe']),
  e('Clean shoes make an old shirt look deliberate.', 'Stylish', 'Style', 'Practical', ['stylish', 'shoes']),
  e('The reunion is just a room of people comparing haircuts.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'reunion']),
  e('I will tell you what the reunion is really about in one line.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who lends you a scooter is trusting your whole week.', 'Friendship', 'Trust', 'Warm', ['friendship', 'trust']),
  e('My uncle taught me to pay the plumber before the guest.', 'Family', 'Relatives', 'Warm', ['family', 'relatives']),
  e('Learning a language alone at thirty is study and loneliness together.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'learning']),
  e('Do one small thing at the same hour every day.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the worn tools, not the finished wall.', 'Photography', 'Work', 'Warm', ['photography', 'tools']),
  e('Take the slow train and you will meet the district properly.', 'Travel and adventure', 'Villages', 'Warm', ['travel', 'train']),
  e('A repair account with before and after is the best content.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who asks for the quote in writing.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'quote']),
  e('I will not borrow a vehicle to impress a room.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'borrow']),
  e('A late harvest is a monsoon lesson, not a failure.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'harvest']),
  h('मरम्मत का ईमानदार दाम लो, ग्राहक दो बार लौटता है।', 'Startup and hustle', 'सेवा', 'गंभीर', ['मरम्मत', 'दाम']),
  h('टपकता नल पहले ठीक करो, नया सोफ़ा बाद में।', 'Home and interiors', 'मरम्मत', 'व्यावहारिक', ['नल', 'सोफ़ा']),
  h('तीस पर अकेले भाषा सीखना पढ़ाई भी है और तन्हाई भी।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['भाषा', 'तन्हाई']),
  h('घिसे औज़ार की तस्वीर खींचो, बनी दीवार की नहीं।', 'Photography', 'काम', 'कोमल', ['औज़ार', 'तस्वीर']),
  g('Marammat ka imaandaar daam lo, grahak do baar lautata hai.', 'Startup and hustle', 'Service', 'Wise', ['marammat', 'daam']),
  g('Tapakta nal pehle theek karo, naya sofa baad mein.', 'Home and interiors', 'Repairs', 'Practical', ['nal', 'sofa']),
  g('Tees par akele bhaasha seekhna padhai bhi hai aur tanhai bhi.', 'Alone and loneliness', 'Solitude', 'Honest', ['bhaasha', 'tanhai']),
  g('Ghise auzar ki tasveer kheencho, bani deewar ki nahi.', 'Photography', 'Work', 'Warm', ['auzar', 'tasveer']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('मीटिंग में यह मान लेना कि समझ नहीं आया, कमज़ोरी नहीं है।', 'Attitude', 'स्पष्टता', 'दृढ़', ['मीटिंग', 'समझ']),
  h('तुम्हारी चाय का हिसाब और तुम्हारा सबसे कठिन महीना, दोनों याद हैं।', 'Love and romance', 'जानना', 'कोमल', ['चाय', 'महीना']),
  h('स्कूटर उधार लेकर अमीर दिखना किसी पर काम नहीं करता।', 'Sad and heartbreak', 'पैसा', 'सहज', ['स्कूटर', 'अमीर']),
  h('उधार की गाड़ी छोड़ने से ज़्यादा चमकाकर लौटाओ।', 'Life and reality', 'व्यवहार', 'व्यावहारिक', ['गाड़ी', 'चमकाकर']),
  h('रीयूनियन के लिए वही पहनो जो पहले से अलमारी में है।', 'Fashion and beauty', 'अंदाज़', 'व्यावहारिक', ['रीयूनियन', 'अलमारी']),
  h('एक अच्छा जूता पुरानी कमीज़ को सोचा-समझा बना देता है।', 'Stylish', 'अंदाज़', 'व्यावहारिक', ['जूता', 'कमीज़']),
  g('Meeting mein yeh maan lena ki samajh nahi aaya, kamzori nahi hai.', 'Attitude', 'Candour', 'Firm', ['meeting', 'samajh']),
  g('Tumhari chai ka hisaab aur tumhara sabse mushkil mahina, dono yaad hain.', 'Love and romance', 'Knowing', 'Warm', ['chai', 'mahina']),
  g('Scooter udhaar lekar ameer dikhna kisi par kaam nahi karta.', 'Sad and heartbreak', 'Money', 'Wry', ['scooter', 'ameer']),
  g('Udhaar ki gaadi chhodne se zyada chamkaakar lauto.', 'Life and reality', 'Manners', 'Practical', ['gaadi', 'chamkaakar']),
  g('Reunion ke liye wahi pehno jo pehle se almari mein hai.', 'Fashion and beauty', 'Style', 'Practical', ['reunion', 'almari']),
  g('Ek accha joota purani kamiz ko socha-samjha bana deta hai.', 'Stylish', 'Style', 'Practical', ['joota', 'kamiz']),

  /* ------------------------- Hindi top-up to reach the HI allocation */
  h('बार-बार अपना टैप ठीक कराओ, एक बार में पूरा बदलवाओ।', 'Home and interiors', 'मरम्मत', 'व्यावहारिक', ['टैप', 'मरम्मत']),
  h('पुरानी साइकिल की मरम्मत सीखना बचत से बड़ा हुनर है।', 'Minimal', 'सादगी', 'व्यावहारिक', ['साइकिल', 'हुनर']),
];
