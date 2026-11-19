/**
 * BioCraft original bios — batch 066.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 32 HI / 33 HG.
 * New subject matter: the fruit cart at the corner, a father who signs with a
 * thumb, the fan that grinds all night, a lost school certificate,
 * a cousin's engagement, the man who reads the electricity meter.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_066 = [
  /* ------------------------------------------------------------ Attitude */
  e('I buy the last two oranges so the cart can close.', 'Attitude', 'Consideration', 'Warm', ['attitude', 'fruit']),
  e('I read the form out to my father instead of handing it over.', 'Attitude', 'Dignity', 'Tender', ['attitude', 'form']),
  e('I do not correct the meter reader in front of the whole lane.', 'Attitude', 'Discretion', 'Composed', ['attitude', 'meter']),
  h('आख़िरी दो संतरे ख़रीद लेता हूँ, ताकि ठेले वाला घर जा सके।', 'Attitude', 'लिहाज़', 'कोमल', ['संतरे', 'ठेले']),
  h('पापा को फ़ॉर्म देने के बजाय पढ़कर सुनाता हूँ।', 'Attitude', 'इज़्ज़त', 'कोमल', ['फ़ॉर्म', 'सुनाता']),
  h('मीटर वाले को पूरी गली के सामने सुधारता नहीं।', 'Attitude', 'समझदारी', 'शांत', ['मीटर', 'गली']),
  h('पंखा टूटने तक इंतज़ार करने के बजाय ठीक करा लेता हूँ।', 'Attitude', 'ज़िम्मेदारी', 'व्यावहारिक', ['पंखा', 'इंतज़ार']),
  g('Aakhri do santare kharid leta hoon, taaki thele wala ghar ja sake.', 'Attitude', 'Consideration', 'Warm', ['santare', 'thele']),
  g('Papa ko form dene ke bajay padhkar sunata hoon.', 'Attitude', 'Dignity', 'Tender', ['form', 'sunata']),
  g('Meter wale ko poori gali ke saamne sudhaarta nahi.', 'Attitude', 'Discretion', 'Composed', ['meter', 'gali']),
  g('Pankha tootne tak intezaar karne ke bajay theek kara leta hoon.', 'Attitude', 'Responsibility', 'Practical', ['pankha', 'intezaar']),

  /* ------------------------------------------------------------- Love */
  e('You peel the oranges on the cart itself and the vendors forgive you.', 'Love and romance', 'Ordinary days', 'Warm', ['love', 'fruit']),
  e('You learned my father thumbprint signature before you learned my friends names.', 'Love and romance', 'Knowing', 'Tender', ['love', 'signature']),
  e('You keep my old school certificate in your file for no reason at all.', 'Love and romance', 'Memory', 'Warm', ['love', 'certificate']),
  h('तुम ठेले पर ही संतरे छीलते हो और ठेले वाला माफ़ कर देता है।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['ठेले', 'छीलते']),
  h('तुमने मेरे दोस्तों के नाम से पहले पापा के अँगूठे का निशान पहचाना।', 'Love and romance', 'जानना', 'कोमल', ['अँगूठे', 'निशान']),
  h('एक महीने पंखे पर झगड़ा हुआ, और उसी गर्मी में साथ सोए।', 'Love and romance', 'आदत', 'सहज', ['पंखे', 'गर्मी']),
  g('Tum thele par hi santare cheelte ho aur thele wala maaf kar deta hai.', 'Love and romance', 'Ordinary days', 'Warm', ['thele', 'cheelte']),
  g('Tumne mere doston ke naam se pehle papa ke anghuthe ka nishaan pehchana.', 'Love and romance', 'Knowing', 'Tender', ['anghuthe', 'nishaan']),
  g('Ek mahina pankhe par jhagda hua, aur usi garmi mein saath soye.', 'Love and romance', 'Familiarity', 'Wry', ['pankhe', 'garmi']),

  /* ------------------------------------------------------- Sad depth */
  e('My father signs with a thumb and has run a shop for thirty years.', 'Sad and heartbreak', 'Parents', 'Heavy', ['sad', 'signature']),
  e('The school certificate was lost in a move and took two years to replace.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['sad', 'certificate']),
  e('At my cousin engagement I was seated at the table of people nobody knew.', 'Sad and heartbreak', 'Family', 'Honest', ['sad', 'engagement']),
  h('पिताजी अँगूठे से दस्तख़त करते हैं और तीस साल से दुकान चला रहे हैं।', 'Sad and heartbreak', 'माँ-बाप', 'भारी', ['अँगूठे', 'दुकान']),
  h('स्कूल का सर्टिफ़िकेट एक बदली में खो गया, और दो साल लगे उसे फिर लेने में।', 'Sad and heartbreak', 'दफ़्तर', 'भारी', ['सर्टिफ़िकेट', 'बदली']),
  h('उस साल हमारे फ़्लैट पर सिर्फ़ मीटर वाला आया।', 'Sad and heartbreak', 'घर', 'शांत', ['फ़्लैट', 'मीटर']),
  g('Pitaji anghuthe se dastakhat karte hain aur tees saal se dukaan chala rahe hain.', 'Sad and heartbreak', 'Parents', 'Heavy', ['anghuthe', 'dukaan']),
  g('School ka certificate ek badli mein kho gaya, aur do saal lage use phir lene mein.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['certificate', 'badli']),
  g('Us saal humare flat par sirf meter wala aaya.', 'Sad and heartbreak', 'Home', 'Quiet', ['flat', 'meter']),

  /* --------------------------------------------------------- Shayari */
  h('अँगूठे का निशान,\nतीस साल,\nएक दुकान।', 'Shayari', 'तीन पंक्ति', 'शांत', ['निशान', 'दुकान']),
  h('पंखा घूमता है,\nरात\nनहीं।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['पंखा', 'रात']),
  g('Anghuthe ka nishaan, tees saal, aur ek chhoti si dukaan.', 'Shayari', 'Two line', 'Quiet', ['nishaan', 'dukaan']),
  g('Pankha ghoomta hai, raat nahi.', 'Shayari', 'Two line', 'Deep', ['pankha', 'raat']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A thumbprint is a signature that cannot pretend.', 'Quotes and thoughts', 'Dignity', 'Warm', ['quotes', 'signature']),
  e('A fruit cart closes when the last orange is sold, not before.', 'Quotes and thoughts', 'Work', 'Warm', ['quotes', 'fruit']),
  e('A certificate is a piece of paper that decides a decade.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['quotes', 'certificate']),
  e('The meter reader is the only official who still knocks.', 'Quotes and thoughts', 'Home', 'Wry', ['quotes', 'meter']),
  h('अँगूठे का निशान वो दस्तख़त है जो नाटक नहीं कर सकता।', 'Quotes and thoughts', 'इज़्ज़त', 'कोमल', ['निशान', 'नाटक']),
  h('ठेला तब बंद होता है जब आख़िरी संतरा बिक जाए, पहले नहीं।', 'Quotes and thoughts', 'काम', 'कोमल', ['ठेला', 'संतरा']),
  h('सर्टिफ़िकेट काग़ज़ का टुकड़ा है जो दस साल तय करता है।', 'Quotes and thoughts', 'दफ़्तर', 'तीखा', ['सर्टिफ़िकेट', 'साल']),
  g('Anghuthe ka nishaan woh dastakhat hai jo naatak nahi kar sakta.', 'Quotes and thoughts', 'Dignity', 'Warm', ['nishaan', 'naatak']),
  g('Thela tab band hota hai jab aakhri santara bik jaaye, pehle nahi.', 'Quotes and thoughts', 'Work', 'Warm', ['thela', 'santara']),
  g('Certificate kaagaz ka tukda hai jo das saal tay karta hai.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['certificate', 'saal']),

  /* ------------------------------------------------- Life and reality */
  e('Keep three photocopies of every certificate and one scan.', 'Life and reality', 'Bureaucracy', 'Practical', ['life', 'certificate']),
  e('Read the form aloud to the person it belongs to.', 'Life and reality', 'Family', 'Tender', ['life', 'form']),
  e('Buy from the cart that is about to close, not the one that never moves.', 'Life and reality', 'Money', 'Practical', ['life', 'fruit']),
  e('Get the fan serviced in April, before the first forty degree night.', 'Life and reality', 'Home', 'Practical', ['life', 'fan']),
  e('Check the meter reading yourself once a month. It is a two minute habit.', 'Life and reality', 'Home', 'Practical', ['life', 'meter']),
  h('हर सर्टिफ़िकेट की तीन फ़ोटो कॉपी और एक स्कैन रखो।', 'Life and reality', 'दफ़्तर', 'व्यावहारिक', ['सर्टिफ़िकेट', 'स्कैन']),
  h('फ़ॉर्म उसी को पढ़कर सुनाओ जिसका फ़ॉर्म है।', 'Life and reality', 'परिवार', 'कोमल', ['फ़ॉर्म', 'सुनाओ']),
  h('उस ठेले से ख़रीदो जो बंद होने वाला है।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['ठेले', 'ख़रीदो']),
  h('अप्रैल में पंखे की सर्विस करा लो, पहली गर्म रात से पहले।', 'Life and reality', 'घर', 'व्यावहारिक', ['पंखे', 'सर्विस']),
  g('Har certificate ki teen photo copy aur ek scan rakho.', 'Life and reality', 'Bureaucracy', 'Practical', ['certificate', 'scan']),
  g('Form usi ko padhkar sunao jiska form hai.', 'Life and reality', 'Family', 'Tender', ['form', 'sunao']),
  g('Us thele se kharido jo band hone wala hai.', 'Life and reality', 'Money', 'Practical', ['thele', 'kharido']),
  g('April mein pankhe ki service kara lo, pehli garam raat se pehle.', 'Life and reality', 'Home', 'Practical', ['pankhe', 'service']),

  /* ------------------------------------------------------ Motivational */
  e('Learning to read a form is a skill that outlives school.', 'Motivational', 'Skills', 'Wise', ['motivation', 'reading']),
  e('A lost certificate is a delay, not a verdict.', 'Motivational', 'Resilience', 'Direct', ['motivation', 'resilience']),
  h('फ़ॉर्म पढ़ना वो हुनर है जो स्कूल से ज़्यादा चलता है।', 'Motivational', 'हुनर', 'गंभीर', ['फ़ॉर्म', 'हुनर']),
  h('खोया सर्टिफ़िकेट देरी है, फ़ैसला नहीं।', 'Motivational', 'सब्र', 'स्पष्ट', ['सर्टिफ़िकेट', 'देरी']),
  h('आख़िरी संतरा भी ईमान से बेचो, कल दुकान फिर खुलेगी।', 'Motivational', 'ईमान', 'कोमल', ['संतरा', 'दुकान']),
  g('Form padhna woh hunar hai jo school se zyada chalta hai.', 'Motivational', 'Skills', 'Wise', ['form', 'hunar']),
  g('Khoya certificate deri hai, faisla nahi.', 'Motivational', 'Resilience', 'Direct', ['certificate', 'deri']),
  g('Aakhri santara bhi imaan se becho, kal dukaan phir khulegi.', 'Motivational', 'Integrity', 'Warm', ['santara', 'dukaan']),

  /* -------------------------------------------------------- Aesthetic */
  e('A cart lit by one bulb looks like a small stage.', 'Aesthetic', 'Cities', 'Warm', ['aesthetic', 'cart']),
  e('Keep the fan blades clean and the room stays cooler.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'fan']),
  h('एक बल्ब से जगमगाता ठेला छोटा सा मंच लगता है।', 'Aesthetic', 'शहर', 'कोमल', ['ठेला', 'बल्ब']),
  h('काले पेन से भरा फ़ॉर्म गंभीर फ़ॉर्म लगता है।', 'Aesthetic', 'काग़ज़', 'व्यावहारिक', ['पेन', 'फ़ॉर्म']),
  g('Ek bulb se jagmagata thela chhota sa manch lagta hai.', 'Aesthetic', 'Cities', 'Warm', ['thela', 'bulb']),
  g('Kaale pen se bhara form gambhir form lagta hai.', 'Aesthetic', 'Paperwork', 'Practical', ['pen', 'form']),

  /* ---------------------------------------------- Wider category band */
  e('Fan blades that have not been cleaned in a year are a summer illness.', 'Yoga and wellness', 'Home', 'Practical', ['yoga', 'fan']),
  e('Keep your mark sheets scanned before the year you need them.', 'Student life', 'Admin', 'Practical', ['student', 'marksheets']),
  e('Every business needs one low-cost habit that builds trust.', 'Professional and business', 'Trust', 'Wise', ['professional', 'trust']),
  e('A good fielder anticipates the edge before the batsman plays it.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'fielding']),
  e('Service the fan and the cooler in the same week every year.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'service']),
  e('Buy fruit from the cart, not the supermarket, and eat it the same day.', 'Fashion and beauty', 'Health', 'Practical', ['fashion', 'fruit']),
  e('Scan the certificate, name the file with the date, put it in two places.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'backup']),
  e('Read the meter your own way once and compare it with the bill.', 'Science and curiosity', 'Method', 'Practical', ['science', 'meter']),
  e('A cart that closes on time builds credit faster than one that undercuts.', 'Startup and hustle', 'Trust', 'Wise', ['startup', 'trust']),
  e('One cart, one bulb, one honest price. That is a whole business.', 'Minimal', 'Work', 'Practical', ['minimal', 'work']),
  e('A shirt with a clean collar and a pen in the pocket is the whole look.', 'Stylish', 'Style', 'Practical', ['stylish', 'shirt']),
  e('The funniest argument in any lane is about whose meter is faster.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'meter']),
  e('I will say plainly that a thumbprint is a signature, not a shame.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The fruit seller who saves you the good mangoes is doing friendship.', 'Friendship', 'Warmth', 'Warm', ['friendship', 'fruit']),
  e('My father never asked me to fill a form for him and that told me everything.', 'Family', 'Parents', 'Aching', ['family', 'parents']),
  e('Being seated with the strangers at a family function is its own education.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'family']),
  e('A fan turning on a hot night is a small mercy worth noticing.', 'Spirituality and peace', 'Gratitude', 'Wise', ['spirituality', 'gratitude']),
  e('Photograph the cart at closing time, not at its busiest.', 'Photography', 'Cities', 'Warm', ['photography', 'cart']),
  e('Buy fruit at the last cart of the night and ask where it came from.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'fruit']),
  e('A post about a thumbprint signature gets more replies than a graduation photo.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who reads the form out rather than signing for someone.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'form']),
  e('I will not let anyone talk down to my father at a counter.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'family']),
  e('A fruit cart in monsoon covers the fruit and loses half the day.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'cart']),
  h('साल भर बिना साफ़ किए पंखे की पत्तियाँ गर्मी की बीमारी हैं।', 'Yoga and wellness', 'घर', 'व्यावहारिक', ['पंखे', 'बीमारी']),
  h('जिस साल अंकतालिका चाहिए, उससे पहले स्कैन करा लो।', 'Student life', 'काग़ज़', 'व्यावहारिक', ['अंकतालिका', 'स्कैन']),
  h('पंखा और कूलर एक ही हफ़्ते सर्विस कराओ, हर साल।', 'Cars and bikes', 'रखरखाव', 'व्यावहारिक', ['कूलर', 'सर्विस']),
  h('अपनी कमीज़ में पेन और साफ़ कॉलर, पूरा अंदाज़ है।', 'Stylish', 'अंदाज़', 'व्यावहारिक', ['कमीज़', 'कॉलर']),
  h('पिताजी ने मुझसे कभी फ़ॉर्म नहीं भरवाया, उसी से सब समझ आ गया।', 'Family', 'माँ-बाप', 'भावुक', ['पिताजी', 'फ़ॉर्म']),
  h('रिश्तेदारी में अजनबियों के साथ बैठना अपने आप में एक पढ़ाई है।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['अजनबियों', 'पढ़ाई']),
  g('Saal bhar bina saaf kiye pankhe ki pattiyan garmi ki bimari hain.', 'Yoga and wellness', 'Home', 'Practical', ['pankhe', 'bimari']),
  g('Jis saal anktalika chahiye, us saal se pehle scan kara lo.', 'Student life', 'Admin', 'Practical', ['anktalika', 'scan']),
  g('Pankha aur cooler ek hi hafte service kara lo, har saal ki tarah.', 'Cars and bikes', 'Maintenance', 'Practical', ['cooler', 'service']),
  g('Apni kamiz mein pen aur saaf collar, poora andaaz hai.', 'Stylish', 'Style', 'Practical', ['kamiz', 'collar']),
  g('Pitaji ne mujhse kabhi form nahi bharwaya, usi se sab samajh aa gaya.', 'Family', 'Parents', 'Aching', ['pitaji', 'form']),
  g('Rishtedaari mein ajnabiyon ke saath baithna apne aap mein ek padhai hai.', 'Alone and loneliness', 'Solitude', 'Honest', ['ajnabiyon', 'padhai']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('पंखा ठीक करा लेता हूँ, टूटने का इंतज़ार नहीं करता।', 'Attitude', 'ज़िम्मेदारी', 'व्यावहारिक', ['पंखा', 'इंतज़ार']),
  h('चलता पंखा और एक पर्दा, बस इतने में सोचा जा सकता है।', 'Home and interiors', 'घर', 'व्यावहारिक', ['पंखा', 'पर्दा']),
  g('Pankha theek kara leta hoon, tootne ka intezaar nahi karta.', 'Attitude', 'Responsibility', 'Practical', ['pankha', 'intezaar']),
  g('Chalta pankha aur ek parda, bas itne mein socha ja sakta hai.', 'Home and interiors', 'Home', 'Practical', ['pankha', 'parda']),
  h('ठेले वाले से फल लेते वक़्त उसका नाम भी पूछ लेता हूँ।', 'Attitude', 'अदब', 'कोमल', ['फल', 'नाम']),
  g('Thele wale se phal lete waqt uska naam bhi pooch leta hoon.', 'Attitude', 'Courtesy', 'Warm', ['phal', 'naam']),
];
