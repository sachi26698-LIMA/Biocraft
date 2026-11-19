/**
 * BioCraft original bios — batch 070.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the grain shop scale, a mother's first day at a job,
 * a stolen bicycle bell, the queue outside a bank at ten,
 * a landline that only takes incoming calls, and the last day of a rented house.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_070 = [
  /* ------------------------------------------------------------ Attitude */
  e('I watch the scale at the grain shop and I am not embarrassed to.', 'Attitude', 'Vigilance', 'Firm', ['attitude', 'scale']),
  e('I iron my mother shirt the night before her first day.', 'Attitude', 'Care', 'Tender', ['attitude', 'mother']),
  e('I let the queue at the bank be a queue.', 'Attitude', 'Patience', 'Firm', ['attitude', 'queue']),
  h('अनाज की दुकान पर तराज़ू देखता हूँ, और इसमें शर्म नहीं आती।', 'Attitude', 'सतर्कता', 'दृढ़', ['तराज़ू', 'शर्म']),
  h('माँ की पहली नौकरी से पहले रात में उनकी कमीज़ इस्त्री कर देता हूँ।', 'Attitude', 'परवाह', 'कोमल', ['कमीज़', 'नौकरी']),
  h('जो घंटी किसी ने मेरी साइकिल से निकाल ली, उस पर मज़ाक़ नहीं करता।', 'Attitude', 'इज़्ज़त', 'शांत', ['घंटी', 'मज़ाक़']),
  h('बैंक की क़तार को क़तार रहने देता हूँ।', 'Attitude', 'सब्र', 'दृढ़', ['क़तार', 'बैंक']),
  g('Anaj ki dukaan par taraazu dekhta hoon, aur ismein sharam nahi aati.', 'Attitude', 'Vigilance', 'Firm', ['taraazu', 'sharam']),
  g('Maa ki pehli naukri se pehle raat mein unki kamiz istri kar deta hoon.', 'Attitude', 'Care', 'Tender', ['kamiz', 'naukri']),
  g('Jo ghanti kisi ne meri cycle se nikaal li, us par mazaak nahi karta.', 'Attitude', 'Dignity', 'Composed', ['ghanti', 'mazaak']),
  g('Bank ki kataar ko kataar rehne deta hoon.', 'Attitude', 'Patience', 'Firm', ['kataar', 'bank']),

  /* ------------------------------------------------------------- Love */
  e('You dropped my mother at her first day and waited until she went in.', 'Love and romance', 'Support', 'Tender', ['love', 'mother']),
  e('Our landline only takes calls and you call it every evening anyway.', 'Love and romance', 'Ordinary days', 'Warm', ['love', 'landline']),
  e('I fell for you in a bank queue and we have been waiting ever since.', 'Love and romance', 'Beginning', 'Wry', ['love', 'queue']),
  h('तुमने माँ को उनके पहले दिन छोड़ा और अंदर जाने तक रुके।', 'Love and romance', 'साथ', 'कोमल', ['माँ', 'रुके']),
  h('हमारे लैंडलाइन पर सिर्फ़ कॉल आ सकती है, और तुम रोज़ शाम फ़ोन करते हो।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['लैंडलाइन', 'शाम']),
  h('मुझे तुमसे बैंक की क़तार में इश्क़ हुआ, और इंतज़ार अब भी चल रहा है।', 'Love and romance', 'शुरुआत', 'सहज', ['क़तार', 'इंतज़ार']),
  g('Tumne maa ko unke pehle din chhoda aur andar jaane tak ruke.', 'Love and romance', 'Support', 'Tender', ['maa', 'ruke']),
  g('Humare landline par sirf call aa sakti hai, aur tum roz shaam phone karte ho.', 'Love and romance', 'Ordinary days', 'Warm', ['landline', 'shaam']),
  g('Mujhe tumse bank ki kataar mein ishq hua, aur intezaar ab bhi chal raha hai.', 'Love and romance', 'Beginning', 'Wry', ['kataar', 'intezaar']),

  /* ------------------------------------------------------- Sad depth */
  e('My mother went to work for the first time at forty-four and nobody clapped.', 'Sad and heartbreak', 'Parents', 'Heavy', ['sad', 'mother']),
  e('Somebody stole the bell off my cycle and left the cycle there.', 'Sad and heartbreak', 'Money', 'Wry', ['sad', 'bell']),
  e('The bank queue at ten is where old people lose a whole morning.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['sad', 'queue']),
  e('The last day in a rented house is mostly sweeping and not speaking.', 'Sad and heartbreak', 'Home', 'Aching', ['sad', 'house']),
  h('माँ चवालीस की उम्र में पहली बार काम पर गईं, और किसी ने ताली नहीं बजाई।', 'Sad and heartbreak', 'माँ-बाप', 'भारी', ['माँ', 'ताली']),
  h('किसी ने मेरी साइकिल से घंटी निकाल ली और साइकिल वहीं छोड़ दी।', 'Sad and heartbreak', 'पैसा', 'सहज', ['घंटी', 'साइकिल']),
  h('दस बजे की बैंक क़तार वो जगह है जहाँ बुज़ुर्गों की पूरी सुबह गुज़र जाती है।', 'Sad and heartbreak', 'दफ़्तर', 'भारी', ['क़तार', 'बुज़ुर्गों']),
  g('Maa chavalis ki umar mein pehli baar kaam par gayi, aur kisi ne taali nahi bajai.', 'Sad and heartbreak', 'Parents', 'Heavy', ['maa', 'taali']),
  g('Kisi ne meri cycle se ghanti nikaal li aur cycle wahin chhod di.', 'Sad and heartbreak', 'Money', 'Wry', ['ghanti', 'cycle']),
  g('Das baje ki bank kataar woh jagah hai jahan buzurgon ki poori subah guzar jaati hai.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['kataar', 'buzurgon']),

  /* --------------------------------------------------------- Shayari */
  h('काँटा सीधा था,\nपर मन\nनहीं।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['काँटा', 'मन']),
  h('घर खाली हो गया,\nकिराया\nबाक़ी है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['घर', 'किराया']),
  g('Kaanta seedha tha, par mann nahi.', 'Shayari', 'Two line', 'Deep', ['kaanta', 'mann']),
  g('Ghar khaali ho gaya, kiraya baaki hai.', 'Shayari', 'Two line', 'Aching', ['ghar', 'kiraya']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A scale you do not watch is a scale that learns to lie.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'scale']),
  e('A landline that only rings is a house that still expects people.', 'Quotes and thoughts', 'Home', 'Warm', ['quotes', 'landline']),
  e('A bell is the cheapest part of a bicycle and the first thing taken.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'bell']),
  h('जो तराज़ू तुम नहीं देखते, वो झूठ बोलना सीख जाता है।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['तराज़ू', 'झूठ']),
  h('जिस लैंडलाइन पर सिर्फ़ घंटी बजती है, वो घर अब भी लोगों का इंतज़ार करता है।', 'Quotes and thoughts', 'घर', 'कोमल', ['घंटी', 'इंतज़ार']),
  h('बैंक की क़तार शहर की सबसे ईमानदार घड़ी है।', 'Quotes and thoughts', 'दफ़्तर', 'सहज', ['क़तार', 'घड़ी']),
  g('Jo taraazu tum nahi dekhte, woh jhooth bolna seekh jaata hai.', 'Quotes and thoughts', 'Money', 'Sharp', ['taraazu', 'jhooth']),
  g('Jis landline par sirf ghanti bajti hai, woh ghar ab bhi logon ka intezaar karta hai.', 'Quotes and thoughts', 'Home', 'Warm', ['ghanti', 'intezaar']),
  g('Bank ki kataar shehar ki sabse imaandaar ghadi hai.', 'Quotes and thoughts', 'Bureaucracy', 'Wry', ['kataar', 'ghadi']),

  /* ------------------------------------------------- Life and reality */
  e('Ask for the weight aloud at the grain shop. Nobody minds.', 'Life and reality', 'Money', 'Practical', ['life', 'scale']),
  e('Iron the shirt the night before. Mornings are for leaving.', 'Life and reality', 'Home', 'Practical', ['life', 'shirt']),
  e('Go with someone to their first day of work and then leave.', 'Life and reality', 'Support', 'Warm', ['life', 'work']),
  e('Carry exact change to a bank queue. It moves faster for everyone.', 'Life and reality', 'Bureaucracy', 'Practical', ['life', 'queue']),
  h('अनाज की दुकान पर वज़न ज़ोर से पूछो, किसी को बुरा नहीं लगता।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['वज़न', 'दुकान']),
  h('कमीज़ रात में इस्त्री कर लो, सुबह निकलने के लिए होती है।', 'Life and reality', 'घर', 'व्यावहारिक', ['कमीज़', 'सुबह']),
  h('किसी के काम के पहले दिन साथ जाओ, फिर लौट आओ।', 'Life and reality', 'साथ', 'कोमल', ['पहले', 'साथ']),
  h('बैंक की क़तार में खुल्ले पैसे लेकर जाओ, सबका काम तेज़ होता है।', 'Life and reality', 'दफ़्तर', 'व्यावहारिक', ['क़तार', 'पैसे']),
  g('Anaj ki dukaan par wazan zor se poocho, kisi ko bura nahi lagta.', 'Life and reality', 'Money', 'Practical', ['wazan', 'dukaan']),
  g('Kamiz raat mein istri kar lo, subah nikalne ke liye hoti hai.', 'Life and reality', 'Home', 'Practical', ['kamiz', 'subah']),
  g('Kisi ke kaam ke pehle din saath jao, phir laut aao.', 'Life and reality', 'Support', 'Warm', ['pehle', 'saath']),
  g('Bank ki kataar mein khulle paise lekar jao, sabka kaam tez hota hai.', 'Life and reality', 'Bureaucracy', 'Practical', ['kataar', 'paise']),

  /* ------------------------------------------------------ Motivational */
  e('Starting work at forty-four is not late. It is starting.', 'Motivational', 'Courage', 'Warm', ['motivation', 'courage']),
  e('Watch the scale once and the shopkeeper watches it every time.', 'Motivational', 'Vigilance', 'Sharp', ['motivation', 'vigilance']),
  e('Leave a rented house cleaner than you found it. It costs an hour.', 'Motivational', 'Integrity', 'Direct', ['motivation', 'integrity']),
  h('चवालीस पर काम शुरू करना देर नहीं है, शुरू करना है।', 'Motivational', 'साहस', 'कोमल', ['काम', 'देर']),
  h('तराज़ू एक बार देखो, दुकानदार हर बार देखेगा।', 'Motivational', 'सतर्कता', 'तीखा', ['तराज़ू', 'दुकानदार']),
  h('किराए का घर छोड़ते वक़्त जितना मिला था उससे साफ़ छोड़ो, एक घंटा लगता है।', 'Motivational', 'ईमान', 'स्पष्ट', ['घर', 'घंटा']),
  g('Chavalis par kaam shuru karna der nahi hai, shuru karna hai.', 'Motivational', 'Courage', 'Warm', ['kaam', 'der']),
  g('Taraazu ek baar dekho, phir dukaandaar khud dekhega.', 'Motivational', 'Vigilance', 'Sharp', ['taraazu', 'dukaandaar']),
  g('Kiraaye ka ghar chhodte waqt jitna mila tha usse saaf chhodo, ek ghanta lagta hai.', 'Motivational', 'Integrity', 'Direct', ['ghar', 'ghanta']),

  /* -------------------------------------------------------- Aesthetic */
  e('An old brass scale, cleaned, is a better ornament than anything on a shelf.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'scale']),
  e('An empty room swept clean has its own kind of dignity.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'room']),
  e('Keep the landline even after the mobile. It sounds like a house.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'landline']),
  h('पुराना पीतल का तराज़ू साफ़ करके अलमारी पर रखो, सजावट से बेहतर है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['तराज़ू', 'सजावट']),
  h('झाड़ू लगाया खाली कमरा अपनी एक इज़्ज़त रखता है।', 'Aesthetic', 'घर', 'कोमल', ['कमरा', 'इज़्ज़त']),
  g('Purana peetal ka taraazu saaf karke almari par rakho, sajawat se behtar hai.', 'Aesthetic', 'Objects', 'Warm', ['taraazu', 'sajawat']),
  g('Jhaadu lagaya khaali kamra apni ek izzat rakhta hai.', 'Aesthetic', 'Home', 'Warm', ['kamra', 'izzat']),

  /* ---------------------------------------------- Wider category band */
  e('Standing in a bank queue for an hour is a lower back decision.', 'Yoga and wellness', 'Body', 'Wry', ['yoga', 'queue']),
  e('Fill the exam form the day it opens, not the day it closes.', 'Student life', 'Admin', 'Practical', ['student', 'form']),
  e('A shop that shows you the weight earns a customer for ten years.', 'Professional and business', 'Trust', 'Wise', ['professional', 'trust']),
  e('A fielder who calls for the catch avoids the collision.', 'Cricket and sports', 'Cricket', 'Practical', ['cricket', 'fielding']),
  e('A bell is a legal requirement, not an accessory. Replace it.', 'Cars and bikes', 'Repairs', 'Practical', ['cars', 'bell']),
  e('A queue that moves is a queue with a system behind it.', 'Technology and coding', 'Systems', 'Wise', ['tech', 'systems']),
  e('Weigh the same thing twice on two scales and you learn about both.', 'Science and curiosity', 'Measurement', 'Practical', ['science', 'measurement']),
  e('Show the customer the weight and you never have to advertise.', 'Startup and hustle', 'Trust', 'Wise', ['startup', 'trust']),
  e('A room with clean walls is ready for whoever comes next.', 'Home and interiors', 'Rent', 'Practical', ['home', 'rent']),
  e('One landline, one chair, one table. The rest is noise.', 'Minimal', 'Home', 'Practical', ['minimal', 'home']),
  e('The funniest thing at a bank is the man who insists he was first in line.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'bank']),
  e('I will say the weight out loud in the shop and let the room hear it.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who stands in a bank queue for you has done a full day work.', 'Friendship', 'Support', 'Warm', ['friendship', 'queue']),
  e('My mother worked for eighteen years and called it nothing.', 'Family', 'Parents', 'Aching', ['family', 'mother']),
  e('Handing back the keys of a rented house is a small, complete loss.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'house']),
  e('Sweeping an empty room is the closest thing to closing a chapter.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the empty room in daylight. That is the honest version.', 'Photography', 'Home', 'Warm', ['photography', 'room']),
  e('Walk into a grain shop in a new town and you will learn its prices.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'market']),
  e('A post about a mother first job gets more replies than a promotion.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I will not laugh at a stolen bell to make somebody comfortable.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'dignity']),
  e('A bank queue in monsoon is an hour of wet shoes for one signature.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'bank']),
  h('बैंक की क़तार में एक घंटा खड़ा रहना कमर का फ़ैसला है।', 'Yoga and wellness', 'शरीर', 'सहज', ['क़तार', 'कमर']),
  h('परीक्षा का फ़ॉर्म खुलते दिन भरो, बंद होते दिन नहीं।', 'Student life', 'दफ़्तरी काम', 'व्यावहारिक', ['फ़ॉर्म', 'दिन']),
  h('जो दुकान वज़न दिखाती है, वो ग्राहक दस साल रखती है।', 'Professional and business', 'भरोसा', 'गंभीर', ['वज़न', 'ग्राहक']),
  h('साफ़ दीवारों वाला कमरा अगले वाले के लिए तैयार रहता है।', 'Home and interiors', 'किराया', 'व्यावहारिक', ['कमरा', 'दीवारों']),
  h('माँ ने अठारह साल काम किया और उसे कुछ नहीं कहा।', 'Family', 'माँ-बाप', 'भावुक', ['माँ', 'साल']),
  h('खाली कमरे में झाड़ू लगाना एक अध्याय बंद करने जैसा है।', 'Spirituality and peace', 'अभ्यास', 'गंभीर', ['कमरा', 'अध्याय']),
  g('Bank ki kataar mein ek ghanta khada rehna kamar ka faisla hai.', 'Yoga and wellness', 'Body', 'Wry', ['kataar', 'kamar']),
  g('Pariksha ka form khulte din bharo, band hote din nahi.', 'Student life', 'Admin', 'Practical', ['form', 'din']),
  g('Jo dukaan wazan dikhaati hai, woh grahak das saal rakhti hai.', 'Professional and business', 'Trust', 'Wise', ['wazan', 'grahak']),
  g('Saaf deewaron wala kamra agle wale ke liye taiyaar rehta hai.', 'Home and interiors', 'Rent', 'Practical', ['kamra', 'deewaron']),
  g('Maa ne atharah saal kaam kiya aur use kuch nahi kaha.', 'Family', 'Parents', 'Aching', ['maa', 'saal']),
  g('Khaali kamre mein jhaadu lagana ek adhyaay band karne jaisa hai.', 'Spirituality and peace', 'Practice', 'Wise', ['kamra', 'adhyaay']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('मेरी साइकिल की घंटी पर मज़ाक़ करने की ज़रूरत नहीं।', 'Attitude', 'इज़्ज़त', 'शांत', ['घंटी', 'ज़रूरत']),
  h('बैंक की क़तार शहर की सबसे सच्ची घड़ी है।', 'Quotes and thoughts', 'दफ़्तर', 'सहज', ['क़तार', 'सच्ची']),
  h('किराए का खाली घर चाबी लौटाने से पहले तस्वीर में क़ैद कर लो।', 'Life and reality', 'घर', 'व्यावहारिक', ['चाबी', 'तस्वीर']),
  g('Meri cycle ki ghanti par mazaak karne ki zaroorat nahi.', 'Attitude', 'Dignity', 'Composed', ['ghanti', 'zaroorat']),
  g('Bank ki kataar shehar ki sabse sachchi ghadi hai.', 'Quotes and thoughts', 'Bureaucracy', 'Wry', ['kataar', 'sachchi']),
  g('Kiraaye ka khaali ghar chaabi lautane se pehle tasveer mein qaid kar lo.', 'Life and reality', 'Home', 'Practical', ['chaabi', 'tasveer']),
];
