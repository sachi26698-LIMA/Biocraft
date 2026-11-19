/**
 * BioCraft original bios — batch 080.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: a school gate that closes at 7:45, a father's pension
 * file with three spellings of his name, a cycle bell taken on the first day,
 * a wedding card addressed to the whole lane, a tiffin box swapped by mistake,
 * and a landlord who raises the rent after the paint dries.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_080 = [
  /* ------------------------------------------------------------ Attitude */
  e('I get to the gate at 7:40 and never ask them to open it again.', 'Attitude', 'Punctuality', 'Firm', ['attitude', 'gate']),
  e('I take the third spelling of my father\'s name to the pension office myself.', 'Attitude', 'Duty', 'Tender', ['attitude', 'pension']),
  e('I return the cycle bell I took, even eleven years later.', 'Attitude', 'Honesty', 'Firm', ['attitude', 'bell']),
  e('I return a tiffin box that is not mine without opening it.', 'Attitude', 'Integrity', 'Warm', ['attitude', 'tiffin']),
  h('सात बजकर चालीस मिनट पर गेट पहुँचता हूँ, दोबारा खुलवाने की ज़रूरत नहीं पड़ती।', 'Attitude', 'समय', 'दृढ़', ['गेट', 'समय']),
  h('पापा के नाम की तीसरी स्पेलिंग ख़ुद पेंशन दफ़्तर ले जाता हूँ।', 'Attitude', 'फ़र्ज़', 'कोमल', ['पेंशन', 'स्पेलिंग']),
  h('ग्यारह साल बाद भी साइकिल की घंटी जिसकी थी उसे लौटा देता हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['घंटी', 'साइकिल']),
  h('जो टिफ़िन मेरा नहीं है उसे बिना खोले लौटा देता हूँ।', 'Attitude', 'ईमानदारी', 'कोमल', ['टिफ़िन', 'लौटाना']),
  g('Saat bajkar chalees minute par gate pahunchta hoon, dobara khulwane ki zaroorat nahi padti.', 'Attitude', 'Punctuality', 'Firm', ['gate', 'samay']),
  g('Papa ke naam ki teesri spelling khud pension daftar le jaata hoon.', 'Attitude', 'Duty', 'Tender', ['pension', 'spelling']),
  g('Gyarah saal baad bhi cycle ki ghanti jiski thi use lauta deta hoon.', 'Attitude', 'Honesty', 'Firm', ['ghanti', 'cycle']),
  g('Jo tiffin mera nahi hai use bina kholay lauta deta hoon.', 'Attitude', 'Integrity', 'Warm', ['tiffin', 'lautana']),

  /* ------------------------------------------------------------- Love */
  e('You held the gate open with your foot for me every morning.', 'Love and romance', 'School', 'Warm', ['love', 'gate']),
  e('You learned the three spellings of my father\'s name before I did.', 'Love and romance', 'Family', 'Tender', ['love', 'pension']),
  e('We swapped tiffin boxes for a year and never once got it right.', 'Love and romance', 'Small things', 'Warm', ['love', 'tiffin']),
  h('तुम रोज़ सुबह अपने पैर से गेट रोककर मेरा इंतज़ार करते थे।', 'Love and romance', 'स्कूल', 'कोमल', ['गेट', 'सुबह']),
  h('तुमने पापा के नाम की तीनों स्पेलिंग मुझसे पहले याद कर लीं।', 'Love and romance', 'परिवार', 'कोमल', ['नाम', 'स्पेलिंग']),
  h('हम एक साल टिफ़िन बदलते रहे और एक बार भी सही नहीं बदला।', 'Love and romance', 'छोटी बातें', 'कोमल', ['टिफ़िन', 'साल']),
  g('Tum roz subah apne pair se gate rokkar mera intezaar karte the.', 'Love and romance', 'School', 'Warm', ['gate', 'subah']),
  g('Tumne Papa ke naam ki teeno spelling mujhse pehle yaad kar lin.', 'Love and romance', 'Family', 'Tender', ['naam', 'spelling']),
  g('Hum ek saal tiffin badalte rahe aur ek baar bhi sahi nahi badla.', 'Love and romance', 'Small things', 'Warm', ['tiffin', 'saal']),

  /* ------------------------------------------------------- Sad depth */
  e('My father\'s pension file has three spellings of his name and one of them is wrong.', 'Sad and heartbreak', 'Parents', 'Heavy', ['sad', 'pension']),
  e('The cycle bell was taken on my first day and I never told anyone.', 'Sad and heartbreak', 'School', 'Quiet', ['sad', 'bell']),
  e('The gate closed at 7:45 and I watched the assembly from outside it.', 'Sad and heartbreak', 'School', 'Heavy', ['sad', 'gate']),
  e('The landlord painted the flat and raised the rent in the same week.', 'Sad and heartbreak', 'Home', 'Heavy', ['sad', 'rent']),
  h('पापा की पेंशन फ़ाइल में उनके नाम की तीन स्पेलिंग हैं और एक ग़लत है।', 'Sad and heartbreak', 'माँ-बाप', 'भारी', ['फ़ाइल', 'स्पेलिंग']),
  h('पहले दिन साइकिल की घंटी चोरी हुई और मैंने किसी को नहीं बताया।', 'Sad and heartbreak', 'स्कूल', 'शांत', ['घंटी', 'पहला']),
  h('गेट सात बजकर पैंतालीस पर बंद होता और मैं बाहर से प्रार्थना देखता।', 'Sad and heartbreak', 'स्कूल', 'भारी', ['गेट', 'प्रार्थना']),
  h('मकान मालिक ने उसी हफ़्ते पुताई कराई और किराया बढ़ा दिया।', 'Sad and heartbreak', 'घर', 'भारी', ['पुताई', 'किराया']),
  g('Papa ki pension file mein unke naam ki teen spelling hain aur ek galat hai.', 'Sad and heartbreak', 'Parents', 'Heavy', ['file', 'spelling']),
  g('Pehle din cycle ki ghanti chori hui aur maine kisi ko nahi bataya.', 'Sad and heartbreak', 'School', 'Quiet', ['ghanti', 'pehla']),
  g('Gate saat bajkar paintalis par band hota tha aur main bahar se prarthana dekhta tha.', 'Sad and heartbreak', 'School', 'Heavy', ['gate', 'prarthana']),
  g('Makan malik ne usi hafte putai karai aur kiraya badha diya.', 'Sad and heartbreak', 'Home', 'Heavy', ['putai', 'kiraya']),

  /* --------------------------------------------------------- Shayari */
  h('गेट बंद,\nप्रार्थना चली,\nमैं बाहर।', 'Shayari', 'तीन पंक्ति', 'शांत', ['गेट', 'प्रार्थना']),
  h('घंटी गई,\nसाइकिल चली,\nशोर बाक़ी।', 'Shayari', 'तीन पंक्ति', 'सहज', ['घंटी', 'साइकिल']),
  g('Gate band tha, prarthana chali thi, main bahar tha.', 'Shayari', 'Two line', 'Quiet', ['gate', 'bahar']),
  g('Ghanti gayi thi, cycle chali thi, shor baaki tha.', 'Shayari', 'Two line', 'Warm', ['ghanti', 'cycle']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A gate that closes on time is the fairest thing in a school.', 'Quotes and thoughts', 'School', 'Wise', ['quotes', 'gate']),
  e('Three spellings of one name is a pension file explaining itself.', 'Quotes and thoughts', 'Paperwork', 'Sharp', ['quotes', 'pension']),
  e('A swiped cycle bell is a theft that lasts your whole childhood.', 'Quotes and thoughts', 'School', 'Heavy', ['quotes', 'bell']),
  e('A landlord raises the rent after the paint dries, never before.', 'Quotes and thoughts', 'Home', 'Wry', ['quotes', 'rent']),
  h('समय पर बंद होने वाला गेट स्कूल की सबसे इंसाफ़ वाली चीज़ है।', 'Quotes and thoughts', 'स्कूल', 'गंभीर', ['गेट', 'स्कूल']),
  h('एक नाम की तीन स्पेलिंग वो फ़ाइल है जो ख़ुद को समझा रही है।', 'Quotes and thoughts', 'काग़ज़ी काम', 'तीखा', ['स्पेलिंग', 'फ़ाइल']),
  h('चुराई घंटी वो चोरी है जो पूरा बचपन साथ चलती है।', 'Quotes and thoughts', 'स्कूल', 'भारी', ['घंटी', 'बचपन']),
  g('Samay par band hone wala gate school ki sabse insaaf wali cheez hai.', 'Quotes and thoughts', 'School', 'Wise', ['gate', 'school']),
  g('Ek naam ki teen spelling woh file hai jo khud ko samjha rahi hai.', 'Quotes and thoughts', 'Paperwork', 'Sharp', ['spelling', 'file']),
  g('Churai ghanti woh chori hai jo poora bachpan saath chalti hai.', 'Quotes and thoughts', 'School', 'Heavy', ['ghanti', 'bachpan']),

  /* ------------------------------------------------- Life and reality */
  e('Leave for school at 7:20. The gate does not negotiate.', 'Life and reality', 'School', 'Practical', ['life', 'gate']),
  e('Check every spelling in a pension file before you sign it.', 'Life and reality', 'Paperwork', 'Practical', ['life', 'pension']),
  e('Give back the tiffin box at the end of the break, not the end of the year.', 'Life and reality', 'School', 'Practical', ['life', 'tiffin']),
  e('Read the rent agreement before the paint, not after it.', 'Life and reality', 'Home', 'Practical', ['life', 'rent']),
  h('स्कूल के लिए सात बजकर बीस पर निकलो, गेट से मोल-भाव नहीं होता।', 'Life and reality', 'स्कूल', 'व्यावहारिक', ['गेट', 'स्कूल']),
  h('पेंशन फ़ाइल पर दस्तख़त करने से पहले हर स्पेलिंग जाँचो।', 'Life and reality', 'काग़ज़ी काम', 'व्यावहारिक', ['फ़ाइल', 'दस्तख़त']),
  h('टिफ़िन वाले दिन की छुट्टी पर ही लौटाओ, साल के आख़िर में नहीं।', 'Life and reality', 'स्कूल', 'व्यावहारिक', ['टिफ़िन', 'छुट्टी']),
  h('किराया समझौता पुताई से पहले पढ़ो, बाद में नहीं।', 'Life and reality', 'घर', 'व्यावहारिक', ['किराया', 'पुताई']),
  h('साइकिल की घंटी पर नाम लिखने से चोरी नहीं रुकती, ताले में रखो।', 'Life and reality', 'स्कूल', 'व्यावहारिक', ['घंटी', 'naam']),
  h('गेट पर खड़े होकर लिखी गई तारीख़ आज भी याद है।', 'Life and reality', 'स्कूल', 'कोमल', ['गेट', 'तारीख़']),
  g('Cycle ki ghanti par naam likhne se chori nahi rukti, taale mein rakho.', 'Life and reality', 'School', 'Practical', ['ghanti', 'taala']),
  g('Gate par khade hokar likhi gai taarikh aaj bhi yaad hai.', 'Life and reality', 'School', 'Warm', ['gate', 'taarikh']),
  g('School ke liye saat bajkar bees par niklo, gate se mol-bhaav nahi hota.', 'Life and reality', 'School', 'Practical', ['gate', 'school']),
  g('Pension file par dastakhat karne se pehle har spelling jaancho.', 'Life and reality', 'Paperwork', 'Practical', ['file', 'dastakhat']),
  g('Tiffin wale din ki chhutti par hi lautao, saal ke aakhir mein nahi.', 'Life and reality', 'School', 'Practical', ['tiffin', 'chhutti']),
  g('Kiraya samjhauta putai se pehle padho, baad mein nahi.', 'Life and reality', 'Home', 'Practical', ['kiraya', 'putai']),

  /* ------------------------------------------------------ Motivational */
  e('The gate rewards the person who left early, not the one who ran fast.', 'Motivational', 'Discipline', 'Sharp', ['motivation', 'discipline']),
  e('Fix the spelling yourself. No clerk will do it for your father.', 'Motivational', 'Duty', 'Direct', ['motivation', 'duty']),
  e('Return the bell and the noise in your head finally stops.', 'Motivational', 'Integrity', 'Tender', ['motivation', 'integrity']),
  h('गेट उसे इनाम देता है जो जल्दी निकला, उसे नहीं जो तेज़ भागा।', 'Motivational', 'अनुशासन', 'तीखा', ['गेट', 'निकला']),
  h('स्पेलिंग ख़ुद ठीक करो, कोई क्लर्क तुम्हारे पापा के लिए नहीं करेगा।', 'Motivational', 'फ़र्ज़', 'स्पष्ट', ['स्पेलिंग', 'क्लर्क']),
  h('घंटी लौटा दो, सिर का शोर ख़ुद बंद हो जाता है।', 'Motivational', 'ईमानदारी', 'कोमल', ['घंटी', 'शोर']),
  g('Gate use inaam deta hai jo jaldi nikla, use nahi jo tez bhaaga.', 'Motivational', 'Discipline', 'Sharp', ['gate', 'nikla']),
  g('Spelling khud theek karo, koi clerk tumhare Papa ke liye nahi karega.', 'Motivational', 'Duty', 'Direct', ['spelling', 'clerk']),
  g('Ghanti lauta do, sir ka shor khud band ho jaata hai.', 'Motivational', 'Integrity', 'Tender', ['ghanti', 'shor']),

  /* -------------------------------------------------------- Aesthetic */
  e('A painted flat smells of lime for a week and of money for a month.', 'Aesthetic', 'Home', 'Wry', ['aesthetic', 'paint']),
  e('A brass cycle bell has a sound that a plastic one cannot fake.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'bell']),
  e('A school gate at 7:44 is the quietest crowd in the city.', 'Aesthetic', 'School', 'Warm', ['aesthetic', 'gate']),
  h('पुती हुई कोठी में एक हफ़्ता चूने की और महीना भर पैसों की गंध रहती है।', 'Aesthetic', 'घर', 'सहज', ['चूना', 'गंध']),
  h('पीतल की साइकिल घंटी की आवाज़ प्लास्टिक की नक़ल नहीं कर सकती।', 'Aesthetic', 'चीज़ें', 'कोमल', ['घंटी', 'पीतल']),
  g('Puti hui kothi mein ek hafta choone ki aur mahina bhar paison ki gandh rehti hai.', 'Aesthetic', 'Home', 'Wry', ['choona', 'gandh']),
  g('Peetal ki cycle ghanti ki awaaz plastic ki nakal nahi kar sakti.', 'Aesthetic', 'Objects', 'Warm', ['ghanti', 'peetal']),

  /* ---------------------------------------------- Wider category band */
  e('A school that closes its gate at 7:45 teaches its first lesson for free.', 'Professional and business', 'Discipline', 'Wise', ['professional', 'discipline']),
  e('A friend who saves your seat through a closed gate is a real one.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'gate']),
  e('Keep a folder of your parents\' papers. Nobody else will do it.', 'Student life', 'Admin', 'Practical', ['student', 'admin']),
  e('Scan the pension file once. Three spellings become one problem.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'scan']),
  e('A brass bell outlasts three plastic ones and costs the same.', 'Cars and bikes', 'Parts', 'Practical', ['cars', 'bell']),
  e('A freshly painted flat is a warning about the rent, not a kindness.', 'Home and interiors', 'Rent', 'Wry', ['home', 'rent']),
  e('One folder, one photocopy, one afternoon. That is all paperwork asks.', 'Minimal', 'Paperwork', 'Practical', ['minimal', 'paperwork']),
  e('A pressed uniform at 7:30 in the morning is a whole argument won.', 'Stylish', 'Uniform', 'Sharp', ['stylish', 'uniform']),
  e('The funniest thing at a gate is four boys inventing the same excuse.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'gate']),
  e('I will say I arrived at 7:50 and missed assembly. No traffic story.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('My father spelled his own name two ways his whole working life.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Standing outside a closed gate at seven in the morning is a cold feeling.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'gate']),
  e('The first bell and the last bell are the two ends of a school day.', 'Spirituality and peace', 'Sound', 'Wise', ['spirituality', 'bell']),
  e('Photograph the gate, not the building. The gate is where the story starts.', 'Photography', 'School', 'Warm', ['photography', 'gate']),
  e('A hill school in winter starts its assembly at 7:30 in the dark.', 'Travel and adventure', 'Schools', 'Warm', ['travel', 'school']),
  e('A profile about returning a bell eleven years later is hard to scroll past.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who goes to the pension office and waits at window four.', 'Personality and identity', 'Identity', 'Firm', ['personality', 'duty']),
  e('I will sign my own paperwork and answer for the spelling in it.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'dignity']),
  e('Monsoon mornings turn a school gate into a shallow stream of shoes.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'rain']),
  h('सात बजकर पैंतालीस पर गेट बंद करने वाला स्कूल पहला सबक़ मुफ़्त में सिखाता है।', 'Professional and business', 'अनुशासन', 'गंभीर', ['गेट', 'सबक़']),
  h('बंद गेट के उस पार सीट बचाने वाला दोस्त असली दोस्त है।', 'Friendship', 'वफ़ा', 'कोमल', ['गेट', 'सीट']),
  h('माँ-बाप के काग़ज़ों की फ़ाइल रखो, कोई और नहीं रखेगा।', 'Student life', 'दफ़्तरी काम', 'व्यावहारिक', ['फ़ाइल', 'काग़ज़']),
  h('पेंशन फ़ाइल एक बार स्कैन करो, तीन स्पेलिंग एक ही दिक़्क़त बन जाती हैं।', 'Technology and coding', 'हुनर', 'व्यावहारिक', ['फ़ाइल', 'स्कैन']),
  h('पीतल की घंटी तीन प्लास्टिक से ज़्यादा चलती है और क़ीमत एक ही है।', 'Cars and bikes', 'पुर्ज़े', 'व्यावहारिक', ['घंटी', 'पीतल']),
  h('ताज़ा पुता फ़्लैट किराए की चेतावनी है, मेहरबानी नहीं।', 'Home and interiors', 'किराया', 'सहज', ['फ़्लैट', 'किराया']),
  g('Saat bajkar paintalis par gate band karne wala school pehla sabak muft mein sikhata hai.', 'Professional and business', 'Discipline', 'Wise', ['gate', 'sabak']),
  g('Band gate ke us paar seat bachane wala dost asli dost hai.', 'Friendship', 'Loyalty', 'Warm', ['gate', 'seat']),
  g('Maa-baap ke kaghazon ki file rakho, koi aur nahi rakhega.', 'Student life', 'Admin', 'Practical', ['file', 'kaghaz']),
  g('Pension file ek baar scan karo, teen spelling ek hi dikkat ban jaati hain.', 'Technology and coding', 'Craft', 'Practical', ['file', 'scan']),
  g('Peetal ki ghanti teen plastic se zyada chalti hai aur keemat ek hi hai.', 'Cars and bikes', 'Parts', 'Practical', ['ghanti', 'peetal']),
  g('Taaza puta flat kiraye ki chetavni hai, meherbani nahi.', 'Home and interiors', 'Rent', 'Wry', ['flat', 'kiraya']),
];
