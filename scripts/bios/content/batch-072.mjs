/**
 * BioCraft original bios — batch 072.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: a plumber's apprentice who holds the torch, a water
 * connection that arrives by bribe, a father's first smartphone, a wobbling
 * school desk, the tailor shop radio, and a bank passbook with one entry.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_072 = [
  /* ------------------------------------------------------------ Attitude */
  e('I hold the torch properly instead of watching the work.', 'Attitude', 'Attention', 'Practical', ['attitude', 'torch']),
  e('I do not pay for a water connection I am legally entitled to.', 'Attitude', 'Principle', 'Firm', ['attitude', 'water']),
  e('I teach my father the phone once a day and never twice in a row.', 'Attitude', 'Patience', 'Tender', ['attitude', 'phone']),
  h('टॉर्च ठीक से पकड़ता हूँ, काम देखने में नहीं लगता।', 'Attitude', 'ध्यान', 'व्यावहारिक', ['टॉर्च', 'काम']),
  h('जो कनेक्शन मेरा हक़ है, उसके लिए रिश्वत नहीं देता।', 'Attitude', 'सिद्धांत', 'दृढ़', ['कनेक्शन', 'रिश्वत']),
  h('पापा को दिन में एक बार फ़ोन सिखाता हूँ, दो बार नहीं।', 'Attitude', 'सब्र', 'कोमल', ['फ़ोन', 'एक']),
  h('हिलती मेज़ के नीचे काग़ज़ रख देता हूँ, शिकायत नहीं करता।', 'Attitude', 'व्यवहारिकता', 'व्यावहारिक', ['मेज़', 'काग़ज़']),
  g('Torch theek se pakadta hoon, kaam dekhne mein nahi lagta.', 'Attitude', 'Attention', 'Practical', ['torch', 'kaam']),
  g('Jo connection mera haq hai, uske liye rishwat nahi deta.', 'Attitude', 'Principle', 'Firm', ['connection', 'rishwat']),
  g('Papa ko din mein ek baar phone sikhaata hoon, do baar nahi.', 'Attitude', 'Patience', 'Tender', ['phone', 'ek']),
  g('Hilti mez ke neeche kaagaz rakh deta hoon, shikayat nahi karta.', 'Attitude', 'Pragmatism', 'Practical', ['mez', 'kaagaz']),

  /* ------------------------------------------------------------- Love */
  e('You learned the torch trick before you learned my mother recipe.', 'Love and romance', 'Effort', 'Warm', ['love', 'torch']),
  e('You taught my father to video call and he called you first.', 'Love and romance', 'Family', 'Tender', ['love', 'phone']),
  e('Your passbook has one entry in it and both our names on the form.', 'Love and romance', 'Starting out', 'Warm', ['love', 'passbook']),
  h('तुमने टॉर्च वाला तरीक़ा मेरी माँ की रेसिपी से पहले सीख लिया।', 'Love and romance', 'कोशिश', 'कोमल', ['टॉर्च', 'रेसिपी']),
  h('तुमने पापा को वीडियो कॉल सिखाया और उन्होंने सबसे पहले तुम्हें किया।', 'Love and romance', 'परिवार', 'कोमल', ['कॉल', 'पहले']),
  h('हमने मेज़ साथ ठीक की और अब तक नहीं हिली।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['मेज़', 'साथ']),
  g('Tumne torch wala tareeka meri maa ki recipe se pehle seekh liya.', 'Love and romance', 'Effort', 'Warm', ['torch', 'recipe']),
  g('Tumne papa ko video call sikhaya aur unhone sabse pehle tumhe kiya.', 'Love and romance', 'Family', 'Tender', ['call', 'pehle']),
  g('Humne mez saath theek ki aur ab tak nahi hili.', 'Love and romance', 'Ordinary days', 'Warm', ['mez', 'saath']),

  /* ------------------------------------------------------- Sad depth */
  e('The water connection came the week after the paper was folded into a file.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['sad', 'water']),
  e('My father asked me to set up his phone and then hid it in a drawer.', 'Sad and heartbreak', 'Parents', 'Aching', ['sad', 'phone']),
  e('The apprentice held the torch for two years before he touched a pipe.', 'Sad and heartbreak', 'Work', 'Quiet', ['sad', 'torch']),
  e('The wobbling desk was the only thing in that school I could fix.', 'Sad and heartbreak', 'School', 'Honest', ['sad', 'desk']),
  h('जिस हफ़्ते काग़ज़ फ़ाइल में मुड़ा, उसके बाद वो पानी का कनेक्शन आया।', 'Sad and heartbreak', 'दफ़्तर', 'भारी', ['काग़ज़', 'कनेक्शन']),
  h('पापा ने मुझसे फ़ोन सेट कराया और फिर दराज़ में छुपा दिया।', 'Sad and heartbreak', 'माँ-बाप', 'भावुक', ['फ़ोन', 'दराज़']),
  h('मददगार ने दो साल टॉर्च पकड़ी, तब जाकर पाइप छुई।', 'Sad and heartbreak', 'काम', 'शांत', ['टॉर्च', 'पाइप']),
  g('Jis hafte kaagaz file mein muda, uske baad woh paani ka connection aaya.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['kaagaz', 'connection']),
  g('Papa ne mujhse phone set karaya aur phir daraz mein chhupa diya.', 'Sad and heartbreak', 'Parents', 'Aching', ['phone', 'daraz']),
  g('Madadgaar do saal torch pakadta raha, phir pipe chhui.', 'Sad and heartbreak', 'Work', 'Quiet', ['torch', 'pipe']),

  /* --------------------------------------------------------- Shayari */
  h('टॉर्च पकड़ी,\nदो साल,\nफिर पाइप छुई।', 'Shayari', 'तीन पंक्ति', 'शांत', ['टॉर्च', 'पाइप']),
  h('पासबुक खुली,\nएक पंक्ति,\nपूरा साल।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['पासबुक', 'साल']),
  g('Torch pakdi thi, do saal, phir pipe chhui.', 'Shayari', 'Two line', 'Quiet', ['torch', 'pipe']),
  g('Passbook khuli, ek hi pankti, aur poora saal.', 'Shayari', 'Two line', 'Deep', ['passbook', 'saal']),

  /* -------------------------------------------------- Quotes and ideas */
  e('The apprentice holds the light and learns the whole trade.', 'Quotes and thoughts', 'Craft', 'Warm', ['quotes', 'apprentice']),
  e('A water connection is a document problem wearing a plumber disguise.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['quotes', 'water']),
  e('A passbook with one entry is still a beginning.', 'Quotes and thoughts', 'Money', 'Warm', ['quotes', 'passbook']),
  h('मददगार टॉर्च पकड़ता है और पूरा हुनर सीख जाता है।', 'Quotes and thoughts', 'हुनर', 'कोमल', ['मददगार', 'हुनर']),
  h('पानी का कनेक्शन काग़ज़ी समस्या है, जिसने प्लंबर का भेस पहना है।', 'Quotes and thoughts', 'दफ़्तर', 'तीखा', ['कनेक्शन', 'भेस']),
  h('हिलती मेज़ स्कूल यह मान रहा है कि वो क्या नहीं ख़रीद सकता।', 'Quotes and thoughts', 'स्कूल', 'तीखा', ['मेज़', 'स्कूल']),
  g('Madadgaar torch pakadta hai aur poora hunar seekh jaata hai.', 'Quotes and thoughts', 'Craft', 'Warm', ['madadgaar', 'hunar']),
  g('Paani ka connection kaagazi samasya hai, jisne plumber ka bhes pehna hai.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['connection', 'bhes']),
  g('Hilti mez school yeh maan raha hai ki woh kya nahi khareed sakta.', 'Quotes and thoughts', 'School', 'Sharp', ['mez', 'school']),

  /* ------------------------------------------------- Life and reality */
  e('Learn to hold the torch before you ask to hold the spanner.', 'Life and reality', 'Work', 'Practical', ['life', 'torch']),
  e('Apply for the water connection online and keep the acknowledgement number.', 'Life and reality', 'Bureaucracy', 'Practical', ['life', 'water']),
  e('Write the phone instructions on paper and stick them to the wall.', 'Life and reality', 'Family', 'Warm', ['life', 'phone']),
  e('Keep the first passbook. It is the only honest record of a start.', 'Life and reality', 'Money', 'Warm', ['life', 'passbook']),
  h('पानी का कनेक्शन ऑनलाइन माँगो और पावती नंबर सँभालो।', 'Life and reality', 'दफ़्तर', 'व्यावहारिक', ['कनेक्शन', 'पावती']),
  h('फ़ोन के निर्देश काग़ज़ पर लिखकर दीवार पर चिपका दो।', 'Life and reality', 'परिवार', 'कोमल', ['निर्देश', 'दीवार']),
  h('मेज़ के पाये के नीचे मुड़ा काग़ज़ तीन शिकायतों से ज़्यादा चलता है।', 'Life and reality', 'स्कूल', 'सहज', ['मेज़', 'शिकायतों']),
  h('पहली पासबुक रखो, शुरुआत का सबसे ईमानदार हिसाब वही है।', 'Life and reality', 'पैसा', 'कोमल', ['पासबुक', 'हिसाब']),
  g('Paani ka connection online maango aur paavti number sambhalo.', 'Life and reality', 'Bureaucracy', 'Practical', ['connection', 'paavti']),
  g('Phone ke nirdesh kaagaz par likhkar deewar par chipka do.', 'Life and reality', 'Family', 'Warm', ['nirdesh', 'deewar']),
  g('Mez ke paaye ke neeche muda kaagaz teen shikayaton se zyada chalta hai.', 'Life and reality', 'School', 'Wry', ['mez', 'shikayaton']),
  g('Pehli passbook rakho, shuruaat ka sabse imaandaar hisaab wahi hai.', 'Life and reality', 'Money', 'Warm', ['passbook', 'hisaab']),

  /* ------------------------------------------------------ Motivational */
  e('Hold the light for somebody and the trade comes to you.', 'Motivational', 'Humility', 'Wise', ['motivation', 'humility']),
  e('A father who hides a phone is asking for help without asking.', 'Motivational', 'Patience', 'Tender', ['motivation', 'patience']),
  e('One entry in a passbook is one more than zero.', 'Motivational', 'Starting', 'Direct', ['motivation', 'starting']),
  h('किसी के लिए रोशनी पकड़ो, हुनर ख़ुद तुम्हारे पास आएगा।', 'Motivational', 'विनम्रता', 'गंभीर', ['रोशनी', 'हुनर']),
  h('जो पिता फ़ोन छुपा देता है, वो मदद माँग रहा है, शब्दों में नहीं।', 'Motivational', 'सब्र', 'कोमल', ['पिता', 'मदद']),
  h('पासबुक में एक पंक्ति, शून्य से एक ज़्यादा है।', 'Motivational', 'शुरुआत', 'स्पष्ट', ['पासबुक', 'शून्य']),
  g('Kisi ke liye roshni pakdo, hunar khud tumhare paas aayega.', 'Motivational', 'Humility', 'Wise', ['roshni', 'hunar']),
  g('Jo pita phone chhupa deta hai, woh madad maang raha hai, shabdon mein nahi.', 'Motivational', 'Patience', 'Tender', ['pita', 'madad']),
  g('Passbook mein ek pankti, shunya se ek zyada hai.', 'Motivational', 'Starting', 'Direct', ['passbook', 'shunya']),

  /* -------------------------------------------------------- Aesthetic */
  e('A pipe fixed cleanly behind a wall is the honest kind of craft.', 'Aesthetic', 'Craft', 'Wise', ['aesthetic', 'pipe']),
  e('A passbook in a cloth cover is a document with dignity.', 'Aesthetic', 'Paperwork', 'Practical', ['aesthetic', 'passbook']),
  h('दीवार के पीछे साफ़ बैठाया पाइप ईमानदार हुनर है।', 'Aesthetic', 'हुनर', 'गंभीर', ['दीवार', 'पाइप']),
  h('नाम खुदे स्कूल की मेज़ एक छोटा पुरालेख है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['मेज़', 'पुरालेख']),
  g('Deewar ke peeche saaf baithaya pipe imaandaar hunar hai.', 'Aesthetic', 'Craft', 'Wise', ['deewar', 'pipe']),
  g('Naam khude school ki mez ek chhota puraalekh hai.', 'Aesthetic', 'Objects', 'Warm', ['mez', 'puraalekh']),

  /* ---------------------------------------------- Wider category band */
  e('Holding a torch at arm length for an hour is a shoulder workout.', 'Yoga and wellness', 'Body', 'Wry', ['yoga', 'torch']),
  e('An apprentice who is taught properly becomes a competitor worth having.', 'Professional and business', 'Craft', 'Wise', ['professional', 'craft']),
  e('A fielder who backs up the throw saves the run nobody counted.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'fielding']),
  e('Check the pipe joints after the first week, not after the first leak.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'maintenance']),
  e('A shirt with the sleeves rolled properly is a working man uniform.', 'Fashion and beauty', 'Style', 'Practical', ['fashion', 'style']),
  e('An acknowledgement number is the only receipt a government portal gives.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'paperwork']),
  e('Water pressure tells you more about a building than any survey.', 'Science and curiosity', 'Observation', 'Wry', ['science', 'water']),
  e('Charge for the first hour of diagnosis, not only the repair.', 'Startup and hustle', 'Pricing', 'Sharp', ['startup', 'pricing']),
  e('A house with good plumbing is a house with no arguments at seven.', 'Home and interiors', 'Repairs', 'Practical', ['home', 'plumbing']),
  e('One torch, one spanner, one cloth. A plumber needs nothing else.', 'Minimal', 'Tools', 'Practical', ['minimal', 'tools']),
  e('Clean hands after a repair job say something about the work.', 'Stylish', 'Style', 'Wry', ['stylish', 'craft']),
  e('The funniest thing about plumbing is how confident everyone is before the wall opens.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'plumbing']),
  e('I will say in the office that the connection was delayed, not lost.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The apprentice who becomes a friend is the best reference a trade can have.', 'Friendship', 'Respect', 'Warm', ['friendship', 'apprentice']),
  e('My father kept the phone in the drawer and used it only to call me.', 'Family', 'Parents', 'Aching', ['family', 'parents']),
  e('Holding a torch in silence for two years is a particular loneliness.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'torch']),
  e('Fixing a small thing properly is the most available form of peace.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'repair']),
  e('Photograph the joint before the wall goes back up.', 'Photography', 'Craft', 'Practical', ['photography', 'craft']),
  e('Ask a plumber in a new city which lane has the oldest pipes.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'plumbing']),
  e('A post about a father and a drawer gets more replies than a new phone.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who writes the instructions down rather than repeating them.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'patience']),
  e('I will not fold a file into a bribe to save myself a week.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'bribe']),
  h('घंटे भर हाथ फैलाकर टॉर्च पकड़ना कंधे की कसरत है।', 'Yoga and wellness', 'शरीर', 'सहज', ['टॉर्च', 'कंधे']),
  h('स्कूल से ठीक मेज़ लिखित में माँगो, तब तक अपनी ठीक कर लो।', 'Student life', 'स्कूल', 'व्यावहारिक', ['मेज़', 'स्कूल']),
  h('जिसे ठीक से सिखाया जाए, वो मददगार मुक़ाबले में काम का होता है।', 'Professional and business', 'हुनर', 'गंभीर', ['मददगार', 'काम']),
  h('पहले हफ़्ते के बाद जोड़ जाँचो, पहले रिसाव के बाद नहीं।', 'Cars and bikes', 'रखरखाव', 'व्यावहारिक', ['जोड़', 'रिसाव']),
  h('पहले घंटे की जाँच का पैसा लो, सिर्फ़ मरम्मत का नहीं।', 'Startup and hustle', 'क़ीमत', 'तीखा', ['जाँच', 'पैसा']),
  h('पापा ने फ़ोन दराज़ में रखा और सिर्फ़ मुझे कॉल करने के लिए इस्तेमाल किया।', 'Family', 'माँ-बाप', 'भावुक', ['दराज़', 'कॉल']),
  g('Ghante bhar haath phailakar torch pakadna kandhe ki kasrat hai.', 'Yoga and wellness', 'Body', 'Wry', ['torch', 'kandhe']),
  g('School se theek mez likhit mein maango, tab tak apni theek kar lo.', 'Student life', 'School', 'Practical', ['mez', 'school']),
  g('Jise theek se sikhaya jaaye, woh madadgaar muqable mein kaam ka hota hai.', 'Professional and business', 'Craft', 'Wise', ['madadgaar', 'kaam']),
  g('Pehle hafte ke baad jod jaancho, pehle risaav ke baad nahi.', 'Cars and bikes', 'Maintenance', 'Practical', ['jod', 'risaav']),
  g('Pehle ghante ki jaanch ka paisa lo, sirf marammat ka nahi.', 'Startup and hustle', 'Pricing', 'Sharp', ['jaanch', 'paisa']),
  g('Papa ne phone daraz mein rakha aur sirf mujhe call karne ke liye istemaal kiya.', 'Family', 'Parents', 'Aching', ['daraz', 'call']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('अधूरा काम छोड़ना आदत बन जाए तो हुनर भी अधूरा रह जाता है।', 'Attitude', 'अनुशासन', 'दृढ़', ['काम', 'हुनर']),
  h('पानी का नल पूरा बंद करो, बूँदें भी हिसाब रखती हैं।', 'Attitude', 'सावधानी', 'व्यावहारिक', ['नल', 'बूँदें']),
  h('काम के बाद औज़ार पोंछकर रखना भी हुनर का हिस्सा है।', 'Attitude', 'मर्यादा', 'व्यावहारिक', ['औज़ार', 'हुनर']),
  g('Adhoora kaam chhodna aadat ban jaaye toh hunar bhi adhoora reh jaata hai.', 'Attitude', 'Discipline', 'Firm', ['kaam', 'hunar']),
  g('Paani ka nal poora band karo, boondein bhi hisaab rakhti hain.', 'Attitude', 'Care', 'Practical', ['nal', 'boondein']),
  g('Kaam ke baad auzar ponchhkar rakhna bhi hunar ka hissa hai.', 'Attitude', 'Craft', 'Practical', ['auzar', 'hunar']),
];
