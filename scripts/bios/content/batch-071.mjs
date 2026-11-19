/**
 * BioCraft original bios — batch 071.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the umbrella repair man before the rain, a father's
 * pension file, a phone stolen on a crowded bus, the tailor's daughter sitting
 * her board exam, the water cooler at an office, a rented wedding sherwani.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_071 = [
  /* ------------------------------------------------------------ Attitude */
  e('I get the umbrella mended the week before the rain, not during it.', 'Attitude', 'Foresight', 'Practical', ['attitude', 'umbrella']),
  e('I read my father pension file aloud and let him correct me.', 'Attitude', 'Dignity', 'Tender', ['attitude', 'pension']),
  e('I do not accuse the boy who was standing nearest my phone.', 'Attitude', 'Justice', 'Sharp', ['attitude', 'phone']),
  h('छाता बारिश से पहले सिलवा लेता हूँ, बारिश में नहीं।', 'Attitude', 'सूझबूझ', 'व्यावहारिक', ['छाता', 'बारिश']),
  h('पापा की पेंशन फ़ाइल ज़ोर से पढ़ता हूँ और उन्हें सुधारने देता हूँ।', 'Attitude', 'इज़्ज़त', 'कोमल', ['पेंशन', 'सुधारने']),
  h('जो लड़का फ़ोन के सबसे क़रीब खड़ा था, उस पर इलज़ाम नहीं लगाता।', 'Attitude', 'न्याय', 'तीखा', ['लड़का', 'इलज़ाम']),
  h('किराए का शेरवानी तह करके लौटाता हूँ, गठरी बनाकर नहीं।', 'Attitude', 'लिहाज़', 'शांत', ['शेरवानी', 'गठरी']),
  g('Chhaata baarish se pehle silwa leta hoon, baarish mein nahi.', 'Attitude', 'Foresight', 'Practical', ['chhaata', 'baarish']),
  g('Papa ki pension file zor se padhta hoon aur unhe sudhaarne deta hoon.', 'Attitude', 'Dignity', 'Tender', ['pension', 'sudhaarne']),
  g('Jo ladka phone ke sabse kareeb khada tha, us par ilzaam nahi lagata.', 'Attitude', 'Justice', 'Sharp', ['ladka', 'ilzaam']),
  g('Kiraaye ka sherwani tah karke lautata hoon, gathri banakar nahi.', 'Attitude', 'Respect', 'Composed', ['sherwani', 'gathri']),

  /* ------------------------------------------------------------- Love */
  e('You sat outside the exam hall with the tailor for three hours.', 'Love and romance', 'Support', 'Tender', ['love', 'exam']),
  e('We shared one umbrella mended twice and it held for a whole year.', 'Love and romance', 'Ordinary days', 'Warm', ['love', 'umbrella']),
  e('You knew my phone was gone before I did and started calling it.', 'Love and romance', 'Knowing', 'Tender', ['love', 'phone']),
  h('तुम दर्ज़ी के साथ परीक्षा भवन के बाहर तीन घंटे बैठे रहे।', 'Love and romance', 'साथ', 'कोमल', ['दर्ज़ी', 'घंटे']),
  h('एक ही छाता, दो बार सिला हुआ, पूरे साल चला।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['छाता', 'सिला']),
  h('तुमने मुझसे पहले जान लिया कि फ़ोन गया है और कॉल करने लगे।', 'Love and romance', 'जानना', 'कोमल', ['फ़ोन', 'कॉल']),
  g('Tum darzi ke saath pariksha bhavan ke bahar teen ghante baithe rahe.', 'Love and romance', 'Support', 'Tender', ['darzi', 'ghante']),
  g('Ek hi chhaata, do baar sila hua, phir bhi poore saal chala.', 'Love and romance', 'Ordinary days', 'Warm', ['chhaata', 'sila']),
  g('Tumne mujhse pehle jaan liya ki phone gaya hai aur call karne lage.', 'Love and romance', 'Knowing', 'Tender', ['phone', 'call']),

  /* ------------------------------------------------------- Sad depth */
  e('My father pension file is four folders and one missing signature.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['sad', 'pension']),
  e('My phone was taken on a crowded bus and I cried about the photographs.', 'Sad and heartbreak', 'Loss', 'Honest', ['sad', 'phone']),
  e('The tailor daughter sat her board exam in the shop, at the counter.', 'Sad and heartbreak', 'School', 'Aching', ['sad', 'exam']),
  e('The repair man closed his umbrella stall the year plastic ones got cheap.', 'Sad and heartbreak', 'Work', 'Quiet', ['sad', 'umbrella']),
  h('पापा की पेंशन फ़ाइल चार फ़ोल्डर है और एक दस्तख़त ग़ायब।', 'Sad and heartbreak', 'दफ़्तर', 'भारी', ['पेंशन', 'दस्तख़त']),
  h('भरी बस में फ़ोन चोरी हुआ और मैं तस्वीरों के लिए रोया।', 'Sad and heartbreak', 'खोना', 'स्पष्ट', ['बस', 'तस्वीरों']),
  h('दर्ज़ी की बेटी ने बोर्ड का पेपर दुकान के काउंटर पर ही दिया।', 'Sad and heartbreak', 'स्कूल', 'भावुक', ['बेटी', 'काउंटर']),
  g('Papa ki pension file chaar folder hai aur ek dastakhat gaayab.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['pension', 'dastakhat']),
  g('Bhari bus mein phone chori hua aur main tasveeron ke liye roya.', 'Sad and heartbreak', 'Loss', 'Honest', ['bus', 'tasveeron']),
  g('Darzi ki beti ne board ka paper dukaan ke counter par hi diya.', 'Sad and heartbreak', 'School', 'Aching', ['beti', 'counter']),

  /* --------------------------------------------------------- Shayari */
  h('छाता सिल गया,\nबारिश\nदेर से आई।', 'Shayari', 'तीन पंक्ति', 'सहज', ['छाता', 'बारिश']),
  h('फ़ाइल पूरी है,\nदस्तख़त\nअधूरा है।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['फ़ाइल', 'दस्तख़त']),
  g('Chhaata sil gaya, baarish der se aayi.', 'Shayari', 'Two line', 'Warm', ['chhaata', 'baarish']),
  g('File poori hai, dastakhat adhoora hai.', 'Shayari', 'Two line', 'Deep', ['file', 'dastakhat']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A mended umbrella is a bet against the sky that usually pays.', 'Quotes and thoughts', 'Rain', 'Warm', ['quotes', 'umbrella']),
  e('A pension file is a life translated into a signature.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['quotes', 'pension']),
  e('A stolen phone costs photographs, not a device.', 'Quotes and thoughts', 'Loss', 'Aching', ['quotes', 'phone']),
  e('A shop counter is a bad desk and the only one some children get.', 'Quotes and thoughts', 'School', 'Heavy', ['quotes', 'counter']),
  h('सिला हुआ छाता आसमान से एक शर्त है, जो अक्सर जीत जाती है।', 'Quotes and thoughts', 'बारिश', 'कोमल', ['छाता', 'शर्त']),
  h('पेंशन फ़ाइल एक ज़िंदगी है, जिसे दस्तख़त में बदल दिया गया।', 'Quotes and thoughts', 'दफ़्तर', 'तीखा', ['फ़ाइल', 'ज़िंदगी']),
  h('चोरी हुआ फ़ोन तस्वीरों का नुक़सान है, यंत्र का नहीं।', 'Quotes and thoughts', 'खोना', 'भावुक', ['फ़ोन', 'तस्वीरों']),
  g('Sila hua chhaata aasman se ek shart hai, jo aksar jeet jaati hai.', 'Quotes and thoughts', 'Rain', 'Warm', ['chhaata', 'shart']),
  g('Pension file ek zindagi hai, jise dastakhat mein badal diya gaya.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['file', 'zindagi']),
  g('Chori hua phone tasveeron ka nuksaan hai, yantra ka nahi.', 'Quotes and thoughts', 'Loss', 'Aching', ['phone', 'tasveeron']),

  /* ------------------------------------------------- Life and reality */
  e('Get the umbrella stitched in May. Every repair shop is empty then.', 'Life and reality', 'Rain', 'Practical', ['life', 'umbrella']),
  e('Keep one photograph off the phone. The phone is not an archive.', 'Life and reality', 'Technology', 'Wise', ['life', 'phone']),
  e('Take a parent with you to their own pension office. It changes the queue.', 'Life and reality', 'Bureaucracy', 'Warm', ['life', 'pension']),
  e('Give a child a table, even a small one. A counter is not a desk.', 'Life and reality', 'School', 'Warm', ['life', 'counter']),
  h('छाता मई में सिलवाओ, तब हर मरम्मत की दुकान खाली रहती है।', 'Life and reality', 'बारिश', 'व्यावहारिक', ['छाता', 'मई']),
  h('एक तस्वीर फ़ोन से बाहर रखो, फ़ोन पुरालेख नहीं है।', 'Life and reality', 'तकनीक', 'गंभीर', ['तस्वीर', 'पुरालेख']),
  h('माँ-बाप को उनके ही पेंशन दफ़्तर ले जाओ, क़तार बदल जाती है।', 'Life and reality', 'दफ़्तर', 'कोमल', ['पेंशन', 'क़तार']),
  g('Chhaata May mein silwao, tab har marammat ki dukaan khaali rehti hai.', 'Life and reality', 'Rain', 'Practical', ['chhaata', 'May']),
  g('Ek tasveer phone se bahar rakho, phone puraalekh nahi hai.', 'Life and reality', 'Technology', 'Wise', ['tasveer', 'puraalekh']),
  g('Maa-baap ko unke hi pension daftar le jao, kataar badal jaati hai.', 'Life and reality', 'Bureaucracy', 'Warm', ['pension', 'kataar']),

  /* ------------------------------------------------------ Motivational */
  e('Repair the thing before the season that needs it.', 'Motivational', 'Foresight', 'Direct', ['motivation', 'foresight']),
  e('A missing signature is one afternoon, not a lost pension.', 'Motivational', 'Patience', 'Warm', ['motivation', 'patience']),
  e('Back up the photographs. That is the whole lesson.', 'Motivational', 'Discipline', 'Sharp', ['motivation', 'backup']),
  h('जिस मौसम में चीज़ चाहिए, उससे पहले उसे ठीक करा लो।', 'Motivational', 'सूझबूझ', 'स्पष्ट', ['मौसम', 'ठीक']),
  h('एक ग़ायब दस्तख़त एक दोपहर है, पूरी पेंशन नहीं।', 'Motivational', 'सब्र', 'कोमल', ['दस्तख़त', 'पेंशन']),
  h('तस्वीरों का बैकअप रखो, बात इतनी ही है।', 'Motivational', 'अनुशासन', 'तीखा', ['तस्वीरों', 'बैकअप']),
  g('Jis mausam mein cheez chahiye, usse pehle use theek kara lo.', 'Motivational', 'Foresight', 'Direct', ['mausam', 'theek']),
  g('Ek gaayab dastakhat ek dopahar hai, poori pension nahi.', 'Motivational', 'Patience', 'Warm', ['dastakhat', 'pension']),
  g('Tasveeron ka backup rakho, baat itni hi hai.', 'Motivational', 'Discipline', 'Sharp', ['tasveeron', 'backup']),

  /* -------------------------------------------------------- Aesthetic */
  e('A black umbrella, mended once, is a better object than a bright new one.', 'Aesthetic', 'Objects', 'Practical', ['aesthetic', 'umbrella']),
  e('A shop counter lit by one tube light is a school after six.', 'Aesthetic', 'Cities', 'Warm', ['aesthetic', 'counter']),
  h('काला छाता, एक बार सिला हुआ, चमकीले नए से बेहतर चीज़ है।', 'Aesthetic', 'चीज़ें', 'व्यावहारिक', ['छाता', 'चमकीले']),
  h('किराए के रैक से फ़िट आया शेरवानी क़िस्मत है, अंदाज़ नहीं।', 'Aesthetic', 'शादी', 'सहज', ['शेरवानी', 'क़िस्मत']),
  g('Kaala chhaata, ek baar sila hua, chamkile naye se behtar cheez hai.', 'Aesthetic', 'Objects', 'Practical', ['chhaata', 'chamkile']),
  g('Kiraaye ke rack se fit aaya sherwani qismat hai, andaaz nahi.', 'Aesthetic', 'Weddings', 'Wry', ['sherwani', 'qismat']),

  /* ---------------------------------------------- Wider category band */
  e('Walking in wet shoes all day is a knee problem by Thursday.', 'Yoga and wellness', 'Body', 'Practical', ['yoga', 'shoes']),
  e('Sit the exam where the light is good, even if it is the counter.', 'Student life', 'Exams', 'Practical', ['student', 'exams']),
  e('A repair shop that stocks spare ribs survives the plastic era.', 'Professional and business', 'Craft', 'Wise', ['professional', 'craft']),
  e('A wet ball does more for a bowler than any team meeting.', 'Cricket and sports', 'Cricket', 'Wry', ['cricket', 'rain']),
  e('Keep a spare umbrella in the vehicle. It costs less than a ruined shirt.', 'Cars and bikes', 'Kit', 'Practical', ['cars', 'umbrella']),
  e('Phone backups are boring until the phone is gone.', 'Technology and coding', 'Craft', 'Sharp', ['tech', 'backup']),
  e('Write the folder numbers on the outside. The inside is for lawyers.', 'Science and curiosity', 'Rigor', 'Practical', ['science', 'rigor']),
  e('Keep the original receipt of a rental and photograph the hem.', 'Startup and hustle', 'Trust', 'Practical', ['startup', 'trust']),
  e('A house with one umbrella stand is a house that expects weather.', 'Home and interiors', 'Home', 'Warm', ['home', 'umbrella']),
  e('One umbrella, one bag, one pair of shoes that dries.', 'Minimal', 'Possessions', 'Practical', ['minimal', 'umbrella']),
  e('I will say plainly that the phone was taken and nobody was at fault.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who calls your stolen number for an hour is a real friend.', 'Friendship', 'Support', 'Warm', ['friendship', 'phone']),
  e('My father filled his pension forms three times and never complained once.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Losing a phone on a crowded bus is a loneliness with witnesses.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'bus']),
  e('Listening to rain on a mended umbrella is a small, earned comfort.', 'Spirituality and peace', 'Gratitude', 'Wise', ['spirituality', 'rain']),
  e('Photograph the mended ribs of an umbrella. Somebody did that by hand.', 'Photography', 'Objects', 'Warm', ['photography', 'umbrella']),
  e('Carry your own umbrella in a new city and you will walk further.', 'Travel and adventure', 'Cities', 'Practical', ['travel', 'umbrella']),
  e('The photograph of an empty pocket is not a post anybody saves.', 'Instagram profiles', 'Approach', 'Wry', ['instagram', 'honest']),
  e('I am the person who reads the file aloud instead of signing for it.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'file']),
  e('I will not suspect a stranger to feel better about my own carelessness.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'justice']),
  e('An umbrella repaired in May is the only monsoon preparation that works.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'umbrella']),
  h('पूरे दिन गीले जूतों में चलना गुरुवार तक घुटने की समस्या बन जाता है।', 'Yoga and wellness', 'शरीर', 'व्यावहारिक', ['जूतों', 'घुटने']),
  h('जहाँ रोशनी अच्छी हो वहीं पेपर दो, काउंटर पर ही सही।', 'Student life', 'परीक्षा', 'व्यावहारिक', ['रोशनी', 'काउंटर']),
  h('जो मरम्मत की दुकान पुर्ज़े रखती है, वो प्लास्टिक के दौर में भी चलती है।', 'Professional and business', 'हुनर', 'गंभीर', ['दुकान', 'पुर्ज़े']),
  h('गाड़ी में एक अतिरिक्त छाता रखो, बिगड़ी कमीज़ से सस्ता है।', 'Cars and bikes', 'सामान', 'व्यावहारिक', ['गाड़ी', 'छाता']),
  h('घर में छाता रखने की जगह हो, तो घर मौसम की उम्मीद करता है।', 'Home and interiors', 'घर', 'कोमल', ['घर', 'मौसम']),
  h('पापा ने पेंशन के फ़ॉर्म तीन बार भरे और एक बार भी शिकायत नहीं की।', 'Family', 'माँ-बाप', 'कोमल', ['फ़ॉर्म', 'शिकायत']),
  g('Poore din geele jooton mein chalna guruvaar tak ghutne ki samasya ban jaata hai.', 'Yoga and wellness', 'Body', 'Practical', ['jooton', 'ghutne']),
  g('Jahan roshni acchi ho wahin paper do, counter par ho toh bhi.', 'Student life', 'Exams', 'Practical', ['roshni', 'counter']),
  g('Jo marammat ki dukaan purze rakhti hai, woh plastic ke daur mein bhi chalti hai.', 'Professional and business', 'Craft', 'Wise', ['dukaan', 'purze']),
  g('Gaadi mein ek atirikt chhaata rakho, bigdi kamiz se sasta hai.', 'Cars and bikes', 'Kit', 'Practical', ['gaadi', 'chhaata']),
  g('Ghar mein chhaata rakhne ki jagah ho, toh ghar mausam ki umeed karta hai.', 'Home and interiors', 'Home', 'Warm', ['ghar', 'mausam']),
  g('Papa ne pension ke form teen baar bhare aur ek baar bhi shikayat nahi ki.', 'Family', 'Parents', 'Tender', ['form', 'shikayat']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('उधार की चीज़ लौटाते वक़्त उससे बेहतर हालत में लौटाओ।', 'Attitude', 'लिहाज़', 'शांत', ['उधार', 'हालत']),
  h('तुमने किराए का शेरवानी पहना और फिर भी कमरे के अकेले आदमी लगे।', 'Love and romance', 'शुरुआत', 'कोमल', ['शेरवानी', 'कमरे']),
  h('रैक से फ़िट आया शेरवानी क़िस्मत है, अंदाज़ नहीं।', 'Aesthetic', 'शादी', 'सहज', ['रैक', 'क़िस्मत']),
  h('किराए की शेरवानी दुकान छोड़ने से पहले काउंटर पर जाँच लो।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['शेरवानी', 'काउंटर']),
  g('Udhaar ki cheez lautate waqt usse behtar haalat mein lautao.', 'Attitude', 'Respect', 'Composed', ['udhaar', 'haalat']),
  g('Tumne kiraaye ka sherwani pehna aur phir bhi kamre ke akele aadmi lage.', 'Love and romance', 'Beginning', 'Warm', ['sherwani', 'kamre']),
  g('Rack se fit aaya sherwani qismat hai, andaaz nahi.', 'Aesthetic', 'Weddings', 'Wry', ['rack', 'qismat']),
  g('Kiraaye ki sherwani dukaan chhodne se pehle counter par jaanch lo.', 'Life and reality', 'Money', 'Practical', ['sherwani', 'counter']),
];
