/**
 * BioCraft original bios — batch 075.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: a bangle seller on the train, a father's first bank
 * account at sixty, the photocopy shop outside school, a stolen pair of shoes,
 * a mother who irons her own blouse twice, and a shuttered cinema hall.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_075 = [
  /* ------------------------------------------------------------ Attitude */
  e('I buy one bangle from the seller so she can end her round.', 'Attitude', 'Kindness', 'Warm', ['attitude', 'bangle']),
  e('I walk my father into the bank and let him sign the first page.', 'Attitude', 'Dignity', 'Tender', ['attitude', 'bank']),
  e('I do not steal photocopies from the shop outside school.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'photocopy']),
  e('I report a stolen pair of shoes and wear the spare set without complaint.', 'Attitude', 'Composure', 'Composed', ['attitude', 'shoes']),
  h('बहन से एक चूड़ी ख़रीद लेता हूँ, ताकि उसका फेरा पूरा हो जाए।', 'Attitude', 'मेहरबानी', 'कोमल', ['चूड़ी', 'फेरा']),
  h('पापा को बैंक के अंदर ले जाता हूँ और पहला पन्ना उन्हीं से साइन करवाता हूँ।', 'Attitude', 'इज़्ज़त', 'कोमल', ['बैंक', 'पन्ना']),
  h('स्कूल के बाहर की दुकान से फ़ोटोकॉपी नहीं चुराता।', 'Attitude', 'ईमानदारी', 'दृढ़', ['फ़ोटोकॉपी', 'दुकान']),
  h('जूते चोरी होने पर रिपोर्ट करता हूँ और दूसरा जोड़ा बिना शिकायत पहन लेता हूँ।', 'Attitude', 'संयम', 'शांत', ['जूते', 'रिपोर्ट']),
  g('Behen se ek choodi kharid leta hoon, taaki uska phera poora ho jaaye.', 'Attitude', 'Kindness', 'Warm', ['choodi', 'phera']),
  g('Papa ko bank ke andar le jaata hoon aur pehla panna unhi se sign karwata hoon.', 'Attitude', 'Dignity', 'Tender', ['bank', 'panna']),
  g('School ke bahar ki dukaan se photocopy nahi churata.', 'Attitude', 'Integrity', 'Firm', ['photocopy', 'dukaan']),
  g('Joote chori hone par report karta hoon aur doosra joda bina shikayat pehen leta hoon.', 'Attitude', 'Composure', 'Composed', ['joote', 'report']),

  /* ------------------------------------------------------------- Love */
  e('You wore the glass bangles I bought from her and they survived a month.', 'Love and romance', 'Small things', 'Warm', ['love', 'bangle']),
  e('You taught my father the bank app twice and never mentioned it again.', 'Love and romance', 'Patience', 'Tender', ['love', 'bank']),
  e('We met at the photocopy shop queuing for the same exam form.', 'Love and romance', 'Beginning', 'Warm', ['love', 'photocopy']),
  e('You gave me your spare shoes when mine were taken and said nothing.', 'Love and romance', 'Care', 'Tender', ['love', 'shoes']),
  h('तुमने वो काँच की चूड़ियाँ पहनीं जो मैंने बहन से ख़रीदी थीं, और वो महीना भर चलीं।', 'Love and romance', 'छोटी बातें', 'कोमल', ['चूड़ियाँ', 'महीना']),
  h('तुमने पापा को बैंक ऐप दो बार सिखाया और फिर कभी ज़िक्र नहीं किया।', 'Love and romance', 'सब्र', 'कोमल', ['ऐप', 'ज़िक्र']),
  h('हम फ़ोटोकॉपी की दुकान पर एक ही फ़ॉर्म की क़तार में मिले।', 'Love and romance', 'शुरुआत', 'कोमल', ['दुकान', 'क़तार']),
  g('Tumne woh kaanch ki choodiyan pehni jo maine behen se khareedi thi, aur woh mahina bhar chalti rahi.', 'Love and romance', 'Small things', 'Warm', ['choodiyan', 'mahina']),
  g('Tumne papa ko bank app do baar sikhaya aur phir kabhi zikr nahi kiya.', 'Love and romance', 'Patience', 'Tender', ['app', 'zikr']),
  g('Hum photocopy ki dukaan par ek hi form ki kataar mein mile.', 'Love and romance', 'Beginning', 'Warm', ['dukaan', 'kataar']),

  /* ------------------------------------------------------- Sad depth */
  e('My father opened his first bank account at sixty and called it a small thing.', 'Sad and heartbreak', 'Parents', 'Aching', ['sad', 'bank']),
  e('The photocopy shop gave credit to students and died with the ledger.', 'Sad and heartbreak', 'School', 'Heavy', ['sad', 'photocopy']),
  e('My shoes were taken from outside the temple and I walked home barefoot.', 'Sad and heartbreak', 'Money', 'Honest', ['sad', 'shoes']),
  e('The cinema hall shut and its board stayed up for four years.', 'Sad and heartbreak', 'Cities', 'Quiet', ['sad', 'cinema']),
  h('पापा ने साठ पर पहला बैंक खाता खोला और उसे छोटी बात कहा।', 'Sad and heartbreak', 'माँ-बाप', 'भावुक', ['खाता', 'साठ']),
  h('फ़ोटोकॉपी की दुकान छात्रों को उधार देती थी और बही के साथ खत्म हो गई।', 'Sad and heartbreak', 'स्कूल', 'भारी', ['उधार', 'बही']),
  h('मंदिर के बाहर से मेरे जूते चोरी हो गए और मैं पैदल घर लौटा।', 'Sad and heartbreak', 'पैसा', 'स्पष्ट', ['जूते', 'पैदल']),
  g('Papa ne saath par pehla bank khaata khola aur use chhoti baat kaha.', 'Sad and heartbreak', 'Parents', 'Aching', ['khaata', 'saath']),
  g('Photocopy ki dukaan chhatron ko udhaar deti thi aur bahi ke saath khatam ho gayi.', 'Sad and heartbreak', 'School', 'Heavy', ['udhaar', 'bahi']),
  g('Mandir ke bahar se mere joote chori ho gaye aur main paidal ghar lauta.', 'Sad and heartbreak', 'Money', 'Honest', ['joote', 'paidal']),

  /* --------------------------------------------------------- Shayari */
  h('चूड़ी बजी,\nगाड़ी चली,\nबहन मुस्कुराई।', 'Shayari', 'तीन पंक्ति', 'कोमल', ['चूड़ी', 'बहन']),
  h('जूते नहीं,\nरास्ता\nपैदल नापा।', 'Shayari', 'तीन पंक्ति', 'शांत', ['जूते', 'रास्ता']),
  g('Bori kholi, choodi baji, behen ki muskaan bhi saath thi.', 'Shayari', 'Two line', 'Warm', ['choodi', 'behen']),
  g('Subah ke joote, shaam tak chori, raasta wahi tha.', 'Shayari', 'Two line', 'Quiet', ['joote', 'raasta']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A first bank account at sixty is not late, it is unclaimed.', 'Quotes and thoughts', 'Money', 'Warm', ['quotes', 'bank']),
  e('A photocopy shop outside a school is the cheapest education in town.', 'Quotes and thoughts', 'School', 'Wise', ['quotes', 'photocopy']),
  e('Walking home barefoot is not the worst thing. Explaining it is.', 'Quotes and thoughts', 'Loss', 'Sharp', ['quotes', 'shoes']),
  h('गाड़ी में चूड़ी बेचने वाली अपनी दुकान है, माल भी और शटर भी।', 'Quotes and thoughts', 'काम', 'कोमल', ['चूड़ी', 'दुकान']),
  h('साठ पर पहला बैंक खाता देर नहीं है, वो बेमाँगा हक़ है।', 'Quotes and thoughts', 'पैसा', 'कोमल', ['खाता', 'हक़']),
  h('स्कूल के बाहर की फ़ोटोकॉपी दुकान शहर की सबसे सस्ती पढ़ाई है।', 'Quotes and thoughts', 'स्कूल', 'गंभीर', ['फ़ोटोकॉपी', 'पढ़ाई']),
  g('Gaadi mein choodi bechne wali apni dukaan hai, maal bhi aur shutter bhi.', 'Quotes and thoughts', 'Work', 'Warm', ['choodi', 'dukaan']),
  g('Saath par pehla bank khaata der nahi hai, woh bemaanga haq hai.', 'Quotes and thoughts', 'Money', 'Warm', ['khaata', 'haq']),
  g('School ke bahar ki photocopy dukaan shehar ki sabse sasti padhai hai.', 'Quotes and thoughts', 'School', 'Wise', ['photocopy', 'padhai']),

  /* ------------------------------------------------- Life and reality */
  e('Buy something small from a hawker and let them end the round.', 'Life and reality', 'Money', 'Warm', ['life', 'hawker']),
  e('Take a parent to open their first account. The stamp matters more than the app.', 'Life and reality', 'Family', 'Warm', ['life', 'bank']),
  e('Photocopy two sets of every form. The shop will not have change anyway.', 'Life and reality', 'Exams', 'Practical', ['life', 'photocopy']),
  e('Keep a spare pair of shoes at home, not at the temple.', 'Life and reality', 'Money', 'Practical', ['life', 'shoes']),
  e('Take a photograph of a hall before it becomes a shop.', 'Life and reality', 'Cities', 'Warm', ['life', 'cinema']),
  h('फेरी वाले से कुछ छोटा ख़रीदो, उसका फेरा पूरा हो जाएगा।', 'Life and reality', 'पैसा', 'कोमल', ['फेरी', 'फेरा']),
  h('माँ-बाप को पहला खाता खुलवाने ले जाओ, मोहर ऐप से ज़्यादा मायने रखती है।', 'Life and reality', 'परिवार', 'कोमल', ['खाता', 'मोहर']),
  h('हर फ़ॉर्म की दो कॉपी कराओ, दुकान के पास खुल्ले पैसे नहीं होंगे।', 'Life and reality', 'परीक्षा', 'व्यावहारिक', ['फ़ॉर्म', 'कॉपी']),
  h('घर में जूतों का एक जोड़ा अतिरिक्त रखो, मंदिर में नहीं।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['जूतों', 'घर']),
  h('दुकान बंद थी, फिर भी मैंने मोहर उतरने से पहले पर्ची पढ़ ली।', 'Life and reality', 'तरीक़ा', 'व्यावहारिक', ['मोहर', 'पर्ची']),
  h('ट्रेन की सीट पर चूड़ियाँ खड़कती रहीं, किसी ने सिर नहीं उठाया।', 'Life and reality', 'सफ़र', 'शांत', ['चूड़ियाँ', 'सीट']),
  h('साठ साल का आदमी फ़ॉर्म भरते हुए चश्मा उतारता है।', 'Life and reality', 'माँ-बाप', 'कोमल', ['फ़ॉर्म', 'चश्मा']),
  g('Dukaan band thi, phir bhi maine mohar utarne se pehle parchi padh li.', 'Life and reality', 'Method', 'Practical', ['mohar', 'parchi']),
  g('Train ki seat par choodiyan khadakti rahin, kisi ne sir nahi uthaya.', 'Life and reality', 'Journey', 'Quiet', ['choodiyan', 'seat']),
  g('Saath saal ka aadmi form bharte waqt chashma utaarta hai.', 'Life and reality', 'Parents', 'Tender', ['form', 'chashma']),
  g('Pheri wale se kuch chhota kharido, uska phera poora ho jaayega.', 'Life and reality', 'Money', 'Warm', ['pheri', 'phera']),
  g('Maa-baap ko pehla khaata khulwane le jao, mohar app se zyada maayne rakhti hai.', 'Life and reality', 'Family', 'Warm', ['khaata', 'mohar']),
  g('Har form ki do copy karao, dukaan ke paas khulle paise nahi honge.', 'Life and reality', 'Exams', 'Practical', ['form', 'copy']),
  g('Ghar mein jooton ka ek joda atirikt rakho, mandir mein nahi.', 'Life and reality', 'Money', 'Practical', ['jooton', 'ghar']),

  /* ------------------------------------------------------ Motivational */
  e('Nobody is too old to open an account. Only too proud to ask the form.', 'Motivational', 'Courage', 'Wise', ['motivation', 'courage']),
  e('Pay the photocopy shop. It is the cheapest way to stay honest.', 'Motivational', 'Integrity', 'Direct', ['motivation', 'integrity']),
  h('खाता खोलने के लिए कोई बूढ़ा नहीं होता, सिर्फ़ फ़ॉर्म माँगने से शर्माता है।', 'Motivational', 'साहस', 'गंभीर', ['खाता', 'फ़ॉर्म']),
  h('फ़ोटोकॉपी की दुकान का पैसा दो, ईमानदार रहने का सबसे सस्ता तरीक़ा है।', 'Motivational', 'ईमान', 'स्पष्ट', ['पैसा', 'ईमानदार']),
  h('बंद हॉल याद दिलाता है कि शहर तुम्हारा इंतज़ार नहीं करता।', 'Motivational', 'सब्र', 'तीखा', ['हॉल', 'शहर']),
  g('Khaata kholne ke liye koi boodha nahi hota, sirf form maangne se sharmata hai.', 'Motivational', 'Courage', 'Wise', ['khaata', 'form']),
  g('Photocopy ki dukaan ka paisa do, imaandaar rehne ka sabse sasta tareeka hai.', 'Motivational', 'Integrity', 'Direct', ['paisa', 'imaandaar']),
  g('Band hall yaad dilaata hai ki shehar tumhara intezaar nahi karta.', 'Motivational', 'Resilience', 'Sharp', ['hall', 'shehar']),

  /* -------------------------------------------------------- Aesthetic */
  e('Glass bangles on a train seat catch light better than any shop display.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'bangle']),
  e('A shuttered cinema with peeling posters is the best photograph in town.', 'Aesthetic', 'Cities', 'Wry', ['aesthetic', 'cinema']),
  e('A passbook in a cloth cover, stamped once, looks like a certificate.', 'Aesthetic', 'Paperwork', 'Warm', ['aesthetic', 'passbook']),
  h('गाड़ी की सीट पर रखी काँच की चूड़ियाँ किसी भी दुकान से बेहतर रोशनी पकड़ती हैं।', 'Aesthetic', 'चीज़ें', 'कोमल', ['चूड़ियाँ', 'रोशनी']),
  h('उखड़े पोस्टर वाला बंद सिनेमा हॉल शहर की सबसे अच्छी तस्वीर है।', 'Aesthetic', 'शहर', 'सहज', ['पोस्टर', 'हॉल']),
  g('Gaadi ki seat par rakhi kaanch ki choodiyan kisi bhi dukaan se behtar roshni pakadti hain.', 'Aesthetic', 'Objects', 'Warm', ['choodiyan', 'roshni']),
  g('Ukhde poster wala band cinema hall shehar ki sabse acchi tasveer hai.', 'Aesthetic', 'Cities', 'Wry', ['poster', 'hall']),

  /* ---------------------------------------------- Wider category band */
  e('A hawker standing for eight hours in a moving train has a knee story.', 'Yoga and wellness', 'Body', 'Practical', ['yoga', 'hawker']),
  e('Write the exam form deadline on the wall, not in a reminder app.', 'Student life', 'Admin', 'Practical', ['student', 'form']),
  e('A photocopy shop with a student ledger is the honest version of credit.', 'Professional and business', 'Money', 'Wise', ['professional', 'credit']),
  e('A fielder who slips on wet grass loses a run he had already saved.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'fielding']),
  e('Glass bangles for a wedding cost less than the box they come in.', 'Fashion and beauty', 'Weddings', 'Practical', ['fashion', 'bangles']),
  e('Photograph every acknowledgment slip. Paper is the only receipt that survives.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'paperwork']),
  e('A hall converted into a shop is a city admitting it changed.', 'Home and interiors', 'Neighbourhood', 'Wry', ['home', 'neighbourhood']),
  e('One pair of shoes for weddings and one for rain. That is enough.', 'Minimal', 'Wardrobe', 'Practical', ['minimal', 'shoes']),
  e('Glass bangles, a plain kurta and clean hair is a complete wedding look.', 'Stylish', 'Weddings', 'Practical', ['stylish', 'bangles']),
  e('I will say that the shoes were stolen, and walk home without inventing a story.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who lends you shoes and asks nothing has done the whole thing.', 'Friendship', 'Care', 'Warm', ['friendship', 'shoes']),
  e('My father kept his passbook in a plastic cover and checked it every Sunday.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Walking home barefoot at night is a specific and quiet shame.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'barefoot']),
  e('Stamping a passbook is a small ritual with a signature in it.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the bangles on her arm, not the box on the shelf.', 'Photography', 'People', 'Warm', ['photography', 'bangles']),
  e('Buy a bangle on a journey and you will remember the platform, not the price.', 'Travel and adventure', 'Trains', 'Warm', ['travel', 'bangles']),
  e('I am the person who walks into the bank with their father, not for him.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'dignity']),
  e('I will not take a photocopy without paying, even when nobody is looking.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'integrity']),
  e('A train hawker in monsoon covers her stock and loses half a day.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'hawker']),
  h('आठ घंटे चलती गाड़ी में खड़े फेरी वाले की कमर और घुटने याद रखती है।', 'Yoga and wellness', 'शरीर', 'व्यावहारिक', ['गाड़ी', 'घुटने']),
  h('परीक्षा फ़ॉर्म की आख़िरी तारीख़ दीवार पर लिखो, ऐप में नहीं।', 'Student life', 'दफ़्तरी काम', 'व्यावहारिक', ['तारीख़', 'दीवार']),
  h('छात्रों की बही रखने वाली फ़ोटोकॉपी दुकान ईमानदार उधार है।', 'Professional and business', 'पैसा', 'गंभीर', ['बही', 'उधार']),
  h('बारिश में एक जोड़ी जूते, शादी में दूसरा। इतना काफ़ी है।', 'Minimal', 'अलमारी', 'व्यावहारिक', ['जूते', 'शादी']),
  h('पापा पासबुक प्लास्टिक के कवर में रखते थे और हर रविवार देखते थे।', 'Family', 'माँ-बाप', 'कोमल', ['पासबुक', 'रविवार']),
  h('रात में पैदल घर लौटना एक ख़ास और चुप शर्म है।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['पैदल', 'शर्म']),
  g('Aath ghante chalti gaadi mein khade pheri wale ki kamar aur ghutne yaad rakhti hai.', 'Yoga and wellness', 'Body', 'Practical', ['gaadi', 'ghutne']),
  g('Pariksha form ki aakhri taarikh deewar par likho, app mein nahi.', 'Student life', 'Admin', 'Practical', ['taarikh', 'deewar']),
  g('Chhatron ki bahi rakhne wali photocopy dukaan imaandaar udhaar hai.', 'Professional and business', 'Money', 'Wise', ['bahi', 'udhaar']),
  g('Baarish mein ek jodi joote, shaadi mein doosra. Itna kaafi hai.', 'Minimal', 'Wardrobe', 'Practical', ['joote', 'shaadi']),
  g('Papa passbook plastic ke cover mein rakhte the aur har Ravivaar dekhte the.', 'Family', 'Parents', 'Tender', ['passbook', 'Ravivaar']),
  g('Raat mein paidal ghar lautna ek khaas aur chup sharam hai.', 'Alone and loneliness', 'Solitude', 'Honest', ['paidal', 'sharam']),
];
