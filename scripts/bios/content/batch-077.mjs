/**
 * BioCraft original bios — batch 077.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the barber's queue told in heads not minutes, a father's
 * cycle repair shop, exam-hall seating lists, a borrowed umbrella, a temple
 * bell that is always rung twice, and a bus conductor's hole punch.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_077 = [
  /* ------------------------------------------------------------ Attitude */
  e('I wait my turn at the barber without asking how many heads are left.', 'Attitude', 'Patience', 'Composed', ['attitude', 'barber']),
  e('I return the umbrella I borrowed, before the season changes.', 'Attitude', 'Honesty', 'Firm', ['attitude', 'umbrella']),
  e('I find my exam seat myself and do not crowd the notice board.', 'Attitude', 'Self-reliance', 'Practical', ['attitude', 'exam']),
  e('I let the conductor punch my ticket twice rather than argue.', 'Attitude', 'Grace', 'Warm', ['attitude', 'conductor']),
  h('नाई के यहाँ अपनी बारी का इंतज़ार करता हूँ, बिना पूछे कि कितने सिर बाक़ी हैं।', 'Attitude', 'सब्र', 'शांत', ['नाई', 'बारी']),
  h('उधार ली छतरी मौसम बदलने से पहले लौटा देता हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['छतरी', 'मौसम']),
  h('अपनी परीक्षा की सीट ख़ुद ढूँढता हूँ, नोटिस बोर्ड पर भीड़ नहीं करता।', 'Attitude', 'आत्मनिर्भरता', 'व्यावहारिक', ['सीट', 'बोर्ड']),
  h('कंडक्टर टिकट दो बार पंच कर दे तो झगड़ा नहीं करता।', 'Attitude', 'सहजता', 'कोमल', ['टिकट', 'कंडक्टर']),
  g('Nai ke yahan apni baari ka intezaar karta hoon, bina poochhe ki kitne sir baaki hain.', 'Attitude', 'Patience', 'Composed', ['nai', 'baari']),
  g('Udhaar li chhatri mausam badalne se pehle lauta deta hoon.', 'Attitude', 'Honesty', 'Firm', ['chhatri', 'mausam']),
  g('Apni pariksha ki seat khud dhoondta hoon, notice board par bheed nahi karta.', 'Attitude', 'Self-reliance', 'Practical', ['seat', 'board']),
  g('Conductor ticket do baar punch kar de toh jhagda nahi karta.', 'Attitude', 'Grace', 'Warm', ['ticket', 'conductor']),

  /* ------------------------------------------------------------- Love */
  e('You kept my place in the barber queue while I ran for change.', 'Love and romance', 'Small things', 'Warm', ['love', 'barber']),
  e('You still have my umbrella and I have never once asked for it.', 'Love and romance', 'Objects', 'Tender', ['love', 'umbrella']),
  e('You wrote my exam seat number on your wrist so I would not forget.', 'Love and romance', 'Care', 'Tender', ['love', 'exam']),
  e('We met sharing a seat on a bus with a conductor who knew us both.', 'Love and romance', 'Beginning', 'Warm', ['love', 'conductor']),
  h('तुमने नाई की क़तार में मेरी जगह सँभाली, जब मैं खुल्ले पैसों के लिए भागा था।', 'Love and romance', 'छोटी बातें', 'कोमल', ['क़तार', 'पैसे']),
  h('मेरी छतरी आज भी तुम्हारे पास है और मैंने एक बार भी नहीं माँगी।', 'Love and romance', 'चीज़ें', 'कोमल', ['छतरी', 'तुम्हारे']),
  h('तुमने मेरी परीक्षा सीट की तादाद अपनी कलाई पर लिख ली, ताकि मैं भूलूँ नहीं।', 'Love and romance', 'ख़याल', 'कोमल', ['कलाई', 'सीट']),
  g('Tumne nai ki kataar mein meri jagah sambhali, jab main khulle paison ke liye bhaaga tha.', 'Love and romance', 'Small things', 'Warm', ['kataar', 'paise']),
  g('Meri chhatri aaj bhi tumhare paas hai aur maine ek baar bhi nahi maangi.', 'Love and romance', 'Objects', 'Tender', ['chhatri', 'tumhare']),
  g('Tumne meri pariksha seat ki taadad apni kalai par likh li, taaki main bhoolun nahi.', 'Love and romance', 'Care', 'Tender', ['kalai', 'seat']),

  /* ------------------------------------------------------- Sad depth */
  e('My father closed his cycle repair shop the year the road was widened.', 'Sad and heartbreak', 'Parents', 'Heavy', ['sad', 'cycle']),
  e('The last umbrella of the season was borrowed and never came back.', 'Sad and heartbreak', 'Friendship', 'Quiet', ['sad', 'umbrella']),
  e('My exam seat was in the room where my brother had failed twice.', 'Sad and heartbreak', 'Exams', 'Heavy', ['sad', 'exam']),
  e('The conductor who punched our tickets for years died on his route.', 'Sad and heartbreak', 'Work', 'Heavy', ['sad', 'conductor']),
  h('जिस साल सड़क चौड़ी हुई, उसी साल पापा ने साइकिल की दुकान बंद कर दी।', 'Sad and heartbreak', 'माँ-बाप', 'भारी', ['साइकिल', 'सड़क']),
  h('मौसम की आख़िरी छतरी उधार गई थी और कभी नहीं लौटी।', 'Sad and heartbreak', 'दोस्ती', 'शांत', ['छतरी', 'मौसम']),
  h('मेरी परीक्षा सीट उसी कमरे में थी जहाँ भाई दो बार फेल हुआ था।', 'Sad and heartbreak', 'परीक्षा', 'भारी', ['कमरा', 'परीक्षा']),
  h('सालों हमारे टिकट पंच करने वाला कंडक्टर अपने ही रूट पर गुज़र गया।', 'Sad and heartbreak', 'काम', 'भारी', ['कंडक्टर', 'रूट']),
  g('Jis saal sadak chaudi hui, usi saal papa ne cycle ki dukaan band kar di.', 'Sad and heartbreak', 'Parents', 'Heavy', ['cycle', 'sadak']),
  g('Mausam ki aakhri chhatri udhaar gayi thi aur kabhi nahi laut i.', 'Sad and heartbreak', 'Friendship', 'Quiet', ['chhatri', 'mausam']),
  g('Meri pariksha seat usi kamre mein thi jahan bhai do baar fail hua tha.', 'Sad and heartbreak', 'Exams', 'Heavy', ['kamra', 'pariksha']),
  g('Saalon hamare ticket punch karne wala conductor apne hi route par guzar gaya.', 'Sad and heartbreak', 'Work', 'Heavy', ['conductor', 'route']),

  /* --------------------------------------------------------- Shayari */
  h('क़तार छोटी थी,\nसब्र लंबा,\nआईना साफ़।', 'Shayari', 'तीन पंक्ति', 'शांत', ['क़तार', 'आईना']),
  h('छतरी लौटी,\nबारिश नहीं,\nदोस्ती बाक़ी।', 'Shayari', 'तीन पंक्ति', 'कोमल', ['छतरी', 'दोस्ती']),
  g('Kataar chhoti thi, sabr lamba, aaina saaf.', 'Shayari', 'Two line', 'Quiet', ['kataar', 'aaina']),
  g('Chhatri laut i, baarish nahi, dosti baaki.', 'Shayari', 'Two line', 'Warm', ['chhatri', 'dosti']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A barber measures his queue in heads, not minutes, and he is right.', 'Quotes and thoughts', 'Work', 'Wry', ['quotes', 'barber']),
  e('A returned umbrella is a small proof that the season was real.', 'Quotes and thoughts', 'Friendship', 'Warm', ['quotes', 'umbrella']),
  e('A notice board is a queue for people who cannot read it quickly.', 'Quotes and thoughts', 'Exams', 'Sharp', ['quotes', 'exam']),
  h('नाई अपनी क़तार सिरों में नापता है, मिनटों में नहीं, और वो सही है।', 'Quotes and thoughts', 'काम', 'सहज', ['नाई', 'क़तार']),
  h('लौटाई छतरी छोटा सबूत है कि मौसम सच में था।', 'Quotes and thoughts', 'दोस्ती', 'कोमल', ['छतरी', 'मौसम']),
  h('नोटिस बोर्ड उनके लिए क़तार है जो उसे जल्दी नहीं पढ़ सकते।', 'Quotes and thoughts', 'परीक्षा', 'तीखा', ['बोर्ड', 'क़तार']),
  g('Nai apni kataar siron mein naapta hai, minute mein nahi, aur woh sahi hai.', 'Quotes and thoughts', 'Work', 'Wry', ['nai', 'kataar']),
  g('Lautai chhatri chhota saboot hai ki mausam sach mein tha.', 'Quotes and thoughts', 'Friendship', 'Warm', ['chhatri', 'mausam']),
  g('Notice board unke liye kataar hai jo use jaldi nahi padh sakte.', 'Quotes and thoughts', 'Exams', 'Sharp', ['board', 'kataar']),

  /* ------------------------------------------------- Life and reality */
  e('Ask a barber for the count in heads. He will answer honestly.', 'Life and reality', 'Work', 'Practical', ['life', 'barber']),
  e('Write your exam seat number on your hand. Boards get crowded at the gate.', 'Life and reality', 'Exams', 'Practical', ['life', 'exam']),
  e('Return what you borrow in the same season, even if it is inconvenient.', 'Life and reality', 'Money', 'Warm', ['life', 'umbrella']),
  e('Keep small change ready on a bus. The conductor has seen every excuse.', 'Life and reality', 'Cities', 'Practical', ['life', 'conductor']),
  h('नाई से सिर गिनकर पूछो, वो सच ही बताएगा।', 'Life and reality', 'काम', 'व्यावहारिक', ['नाई', 'सिर']),
  h('परीक्षा सीट की तादाद हाथ पर लिख लो, गेट पर बोर्ड भीड़ा हो जाता है।', 'Life and reality', 'परीक्षा', 'व्यावहारिक', ['तादाद', 'बोर्ड']),
  h('जो उधार लिया है उसी मौसम में लौटाओ, चाहे असुविधा हो।', 'Life and reality', 'पैसा', 'कोमल', ['उधार', 'मौसम']),
  h('बस में छुट्टे पैसे तैयार रखो, कंडक्टर हर बहाना सुन चुका है।', 'Life and reality', 'शहर', 'व्यावहारिक', ['पैसे', 'कंडक्टर']),
  h('कंडक्टर ने पंच मारा और पर्ची फाड़कर हाथ में दी।', 'Life and reality', 'सफ़र', 'व्यावहारिक', ['पंच', 'पर्ची']),
  h('नाई की दुकान के बाहर बेंच पर बैठना भी एक क़िस्म का इंतज़ार है।', 'Life and reality', 'काम', 'शांत', ['बेंच', 'इंतज़ार']),
  g('Conductor ne punch maara aur parchi phaad kar haath mein di.', 'Life and reality', 'Journey', 'Practical', ['punch', 'parchi']),
  g('Nai ki dukaan ke bahar bench par baithna bhi ek kism ka intezaar hai.', 'Life and reality', 'Work', 'Quiet', ['bench', 'intezaar']),
  g('Nai se sir ginkar poochho, woh sach hi batayega.', 'Life and reality', 'Work', 'Practical', ['nai', 'sir']),
  g('Pariksha seat ki taadad haath par likh lo, gate par board bhida hota hai.', 'Life and reality', 'Exams', 'Practical', ['taadad', 'board']),
  g('Jo udhaar liya hai usi mausam mein lautao, chahe asuvidha ho.', 'Life and reality', 'Money', 'Warm', ['udhaar', 'mausam']),
  g('Bus mein chhutte paise taiyaar rakho, conductor har bahana sun chuka hai.', 'Life and reality', 'Cities', 'Practical', ['paise', 'conductor']),

  /* ------------------------------------------------------ Motivational */
  e('Waiting your turn well is a skill that shows up in every other queue.', 'Motivational', 'Character', 'Wise', ['motivation', 'patience']),
  e('A seat number will not save you. Knowing where to look will.', 'Motivational', 'Exams', 'Sharp', ['motivation', 'exams']),
  e('Return the umbrella before it becomes a reason to avoid someone.', 'Motivational', 'Integrity', 'Direct', ['motivation', 'integrity']),
  h('अपनी बारी अच्छे से इंतज़ार करना हर क़तार में काम आता है।', 'Motivational', 'चरित्र', 'गंभीर', ['बारी', 'क़तार']),
  h('सीट की तादाद बचाएगी नहीं, ये जानना बचाएगा कि कहाँ देखना है।', 'Motivational', 'परीक्षा', 'तीखा', ['सीट', 'तादाद']),
  h('छतरी उस वजह से पहले लौटाओ कि एक दिन उससे मिलना भारी लगे।', 'Motivational', 'ईमान', 'स्पष्ट', ['छतरी', 'मिलना']),
  g('Apni baari acche se intezaar karna har kataar mein kaam aata hai.', 'Motivational', 'Character', 'Wise', ['baari', 'kataar']),
  g('Seat ki taadad bachaayegi nahi, ye jaan na bachaayega ki kahan dekhna hai.', 'Motivational', 'Exams', 'Sharp', ['seat', 'taadad']),
  g('Chhatri us wajah se pehle lautao ki ek din usse milna bhaari lage.', 'Motivational', 'Integrity', 'Direct', ['chhatri', 'milna']),

  /* -------------------------------------------------------- Aesthetic */
  e('A barber\'s mirror makes the whole lane look wider than it is.', 'Aesthetic', 'Objects', 'Wry', ['aesthetic', 'barber']),
  e('A conductor\'s punch leaves a pattern nobody designed.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'conductor']),
  e('Cycle chains hang like jewellery in a repair shop.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'cycle']),
  h('नाई का आईना पूरी गली को असली से चौड़ी दिखाता है।', 'Aesthetic', 'चीज़ें', 'सहज', ['आईना', 'गली']),
  h('कंडक्टर का पंच ऐसा नक़्शा छोड़ता है जो किसी ने बनाया ही नहीं।', 'Aesthetic', 'चीज़ें', 'कोमल', ['पंच', 'नक़्शा']),
  g('Nai ka aaina poori gali ko asli se chaudi dikhata hai.', 'Aesthetic', 'Objects', 'Wry', ['aaina', 'gali']),
  g('Conductor ka punch aisa naksha chhodta hai jo kisi ne banaya hi nahi.', 'Aesthetic', 'Objects', 'Warm', ['punch', 'naksha']),

  /* ---------------------------------------------- Wider category band */
  e('Open the repair shop early. Cycles arrive before the office does.', 'Professional and business', 'Timing', 'Practical', ['professional', 'timing']),
  e('A friend who lends an umbrella in June has already done the hard part.', 'Friendship', 'Care', 'Warm', ['friendship', 'umbrella']),
  e('Read the seating list twice. The room number is not the seat number.', 'Student life', 'Exams', 'Practical', ['student', 'exams']),
  e('Back up the seat list as a screenshot, not a memory.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'screenshot']),
  e('A cycle that is serviced in May survives the monsoon in September.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'cycle']),
  e('The lane barber knows every household\'s news within a week.', 'Home and interiors', 'Neighbourhood', 'Wry', ['home', 'neighbourhood']),
  e('One umbrella, one bag, one bus pass. That is the whole monsoon kit.', 'Minimal', 'Essentials', 'Practical', ['minimal', 'essentials']),
  e('A clean shave and a pressed collar is the cheapest upgrade there is.', 'Stylish', 'Grooming', 'Sharp', ['stylish', 'grooming']),
  e('The funniest queue in India is one man holding four places at once.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'queue']),
  e('I will say I was late and missed the seat. No invented traffic.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('My father repaired cycles for twenty years and never owned a good one.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Waiting alone under a barber\'s awning in rain is its own company.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'rain']),
  e('Ring the bell twice, the way he did, and stand still.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'bell']),
  e('Photograph the queue, not the haircut. The queue tells the year.', 'Photography', 'People', 'Warm', ['photography', 'queue']),
  e('A night bus with a conductor who knows your stop is a good journey.', 'Travel and adventure', 'Buses', 'Warm', ['travel', 'bus']),
  e('A profile line about returning borrowed umbrellas reads as strange and true.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who writes the seat number on the back of the hand.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'practical']),
  e('I will not hold a place for four people in a queue. That is the whole rule.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'manners']),
  e('June rain finds every gap in a cycle chain.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'rain']),
  h('साइकिल की दुकान जल्दी खोलो, साइकिलें दफ़्तर से पहले आती हैं।', 'Professional and business', 'समय', 'व्यावहारिक', ['साइकिल', 'दुकान']),
  h('जून में छतरी उधार देने वाले दोस्त ने सबसे मुश्किल हिस्सा कर दिया।', 'Friendship', 'ख़याल', 'कोमल', ['छतरी', 'दोस्त']),
  h('सीटिंग लिस्ट दो बार पढ़ो, कमरे का नंबर सीट का नंबर नहीं होता।', 'Student life', 'परीक्षा', 'व्यावहारिक', ['लिस्ट', 'नंबर']),
  h('मई में सर्विस हुई साइकिल सितंबर की बारिश निकाल जाती है।', 'Cars and bikes', 'रखरखाव', 'व्यावहारिक', ['साइकिल', 'बारिश']),
  h('एक छतरी, एक थैला, एक बस पास। पूरा बरसाती सामान इतना ही।', 'Minimal', 'ज़रूरी चीज़ें', 'व्यावहारिक', ['छतरी', 'थैला']),
  h('साफ़ शेव और इस्तरी किया कॉलर सबसे सस्ता सुधार है।', 'Stylish', 'सँवरना', 'तीखा', ['शेव', 'कॉलर']),
  g('Cycle ki dukaan jaldi kholo, cycles daftar se pehle aati hain.', 'Professional and business', 'Timing', 'Practical', ['cycle', 'dukaan']),
  g('June mein chhatri udhaar dene wale dost ne sabse mushkil hissa kar diya.', 'Friendship', 'Care', 'Warm', ['chhatri', 'dost']),
  g('Seating list do baar padho, kamre ka number seat ka number nahi hota.', 'Student life', 'Exams', 'Practical', ['list', 'number']),
  g('May mein service hui cycle September ki baarish nikal jaati hai.', 'Cars and bikes', 'Maintenance', 'Practical', ['cycle', 'baarish']),
  g('Ek chhatri, ek thaila, ek bus pass. Bas itna hi saaman chahiye.', 'Minimal', 'Essentials', 'Practical', ['chhatri', 'thaila']),
  g('Saaf shave aur istri kiya collar sabse sasta sudhaar hai.', 'Stylish', 'Grooming', 'Sharp', ['shave', 'collar']),
];
