/**
 * BioCraft original bios — batch 059.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 34 HI / 32 HG.
 * New subject matter: gold pledged at a bank, the night watchman,
 * a wedding gift that came back twice, learning to drive at forty.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_059 = [
  /* ------------------------------------------------------------ Attitude */
  e('I return a gift that came from me, and I say so.', 'Attitude', 'Honesty', 'Composed', ['attitude', 'gift']),
  e('I greet the watchman by name every night.', 'Attitude', 'Courtesy', 'Warm', ['attitude', 'watchman']),
  e('I do not pretend the gold was never pledged.', 'Attitude', 'Candour', 'Firm', ['attitude', 'gold']),
  h('जो तोहफ़ा मेरा ही था, वो लौटाकर साफ़ कह देता हूँ।', 'Attitude', 'ईमानदारी', 'शांत', ['तोहफ़ा', 'लौटाकर']),
  h('रात में चौकीदार को नाम से सलाम करता हूँ।', 'Attitude', 'अदब', 'कोमल', ['चौकीदार', 'नाम']),
  h('सोना गिरवी रखा था, इस बात को छुपाता नहीं।', 'Attitude', 'सच्चाई', 'दृढ़', ['सोना', 'गिरवी']),
  g('Jo tohfa mera hi tha, woh lautakar saaf keh deta hoon.', 'Attitude', 'Honesty', 'Composed', ['tohfa', 'lautakar']),
  g('Raat mein chowkidaar ko naam se salaam karta hoon.', 'Attitude', 'Courtesy', 'Warm', ['chowkidaar', 'naam']),
  g('Sona girvi rakha tha, is baat ko chhupata nahi.', 'Attitude', 'Candour', 'Firm', ['sona', 'girvi']),

  /* ------------------------------------------------------------- Love */
  e('You learned to drive so I could stop being the only driver.', 'Love and romance', 'Effort', 'Tender', ['love', 'driving']),
  e('You hand me the keys without asking where I am going.', 'Love and romance', 'Trust', 'Warm', ['love', 'trust']),
  e('On the long drive you read the map badly and I do not mind.', 'Love and romance', 'Companionship', 'Warm', ['love', 'drive']),
  h('तुमने गाड़ी चलाना सीखा ताकि मैं अकेला ड्राइवर न रहूँ।', 'Love and romance', 'कोशिश', 'कोमल', ['गाड़ी', 'ड्राइवर']),
  h('तुम चाबी बिना पूछे दे देते हो कि मैं कहाँ जा रहा हूँ।', 'Love and romance', 'भरोसा', 'कोमल', ['चाबी', 'भरोसा']),
  h('लंबे सफ़र में तुम नक़्शा ग़लत पढ़ते हो, और मुझे फ़र्क़ नहीं पड़ता।', 'Love and romance', 'साथ', 'कोमल', ['सफ़र', 'नक़्शा']),
  g('Tumne gaadi chalana seekha, isliye ab main aaram se baithta hoon.', 'Love and romance', 'Effort', 'Tender', ['gaadi', 'seekha']),
  g('Tum chaabi bina poochhe de dete ho ki main kahan ja raha hoon.', 'Love and romance', 'Trust', 'Warm', ['chaabi', 'bharosa']),
  g('Lamba safar mein tum naqsha galat padhte ho, aur mujhe farq nahi padta.', 'Love and romance', 'Companionship', 'Warm', ['safar', 'naqsha']),

  /* ------------------------------------------------------- Sad depth */
  e('The wedding gift came back to us at another wedding.', 'Sad and heartbreak', 'Family', 'Wry', ['sad', 'gift']),
  e('The gold went to the bank the year my father got sick.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'gold']),
  e('The watchman knew my hours better than my family did.', 'Sad and heartbreak', 'Work', 'Quiet', ['sad', 'watchman']),
  h('हमारा शादी का तोहफ़ा किसी और शादी में हमारे पास लौट आया।', 'Sad and heartbreak', 'परिवार', 'सहज', ['तोहफ़ा', 'शादी']),
  h('जिस साल पिताजी बीमार पड़े, उस साल सोना बैंक गया।', 'Sad and heartbreak', 'पैसा', 'भारी', ['सोना', 'बैंक']),
  h('चौकीदार मेरे घंटे परिवार से ज़्यादा जानता था।', 'Sad and heartbreak', 'काम', 'शांत', ['चौकीदार', 'घंटे']),
  g('Humara shaadi ka tohfa kisi aur shaadi mein humare paas laut aaya.', 'Sad and heartbreak', 'Family', 'Wry', ['tohfa', 'shaadi']),
  g('Jis saal pitaji bimaar pade, usi saal sona bank chala gaya tha.', 'Sad and heartbreak', 'Money', 'Heavy', ['sona', 'bank']),
  g('Chowkidaar mere ghante parivaar se zyada jaanta tha.', 'Sad and heartbreak', 'Work', 'Quiet', ['chowkidaar', 'ghante']),

  /* --------------------------------------------------------- Shayari */
  h('सोना बैंक में,\nनींद घर में\nनहीं।', 'Shayari', 'तीन पंक्ति', 'भारी', ['सोना', 'नींद']),
  h('चौकीदार\nमेरा नाम\nजानता है।', 'Shayari', 'तीन पंक्ति', 'शांत', ['चौकीदार', 'नाम']),
  g('Sona bank mein, neend ghar mein nahi.', 'Shayari', 'Two line', 'Heavy', ['sona', 'neend']),
  g('Chowkidaar mera naam jaanta hai.', 'Shayari', 'Two line', 'Quiet', ['chowkidaar', 'naam']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A gift that returns is a lesson in what people need.', 'Quotes and thoughts', 'Giving', 'Wise', ['quotes', 'gift']),
  e('Gold in a bank is quieter than gold in a cupboard.', 'Quotes and thoughts', 'Money', 'Wry', ['quotes', 'gold']),
  e('The night shift sees the city that the day denies.', 'Quotes and thoughts', 'Work', 'Sharp', ['quotes', 'night']),
  e('Forty is a fine age to learn a skill you will use for thirty years.', 'Quotes and thoughts', 'Learning', 'Warm', ['quotes', 'learning']),
  h('लौटा हुआ तोहफ़ा सिखाता है कि लोगों को क्या चाहिए।', 'Quotes and thoughts', 'देना', 'गंभीर', ['तोहफ़ा', 'चाहिए']),
  h('बैंक का सोना अलमारी के सोने से शांत होता है।', 'Quotes and thoughts', 'पैसा', 'सहज', ['सोना', 'शांत']),
  h('रात की ड्यूटी वो शहर देखती है जिसे दिन नकारता है।', 'Quotes and thoughts', 'काम', 'तीखा', ['ड्यूटी', 'शहर']),
  g('Lauta hua tohfa sikhaata hai ki logon ko kya chahiye.', 'Quotes and thoughts', 'Giving', 'Wise', ['tohfa', 'chahiye']),
  g('Bank ka sona almari ke sone se shaant hota hai.', 'Quotes and thoughts', 'Money', 'Wry', ['sona', 'shaant']),
  g('Raat ki duty woh shehar dekhti hai jise din nakaarta hai.', 'Quotes and thoughts', 'Work', 'Sharp', ['duty', 'shehar']),

  /* ------------------------------------------------- Life and reality */
  e('Ask before you pledge, not after the interest starts.', 'Life and reality', 'Money', 'Practical', ['life', 'pledge']),
  e('Give a gift with a receipt if you want it to be useful.', 'Life and reality', 'Giving', 'Practical', ['life', 'gift']),
  e('The watchman knows which flats are happy. Ask him.', 'Life and reality', 'Home', 'Wry', ['life', 'watchman']),
  h('गिरवी रखने से पहले पूछो, ब्याज शुरू होने के बाद नहीं।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['गिरवी', 'ब्याज']),
  h('तोहफ़े के साथ बिल रखो, तभी काम आएगा।', 'Life and reality', 'देना', 'व्यावहारिक', ['तोहफ़े', 'बिल']),
  h('चौकीदार जानता है कि कौन-सा फ़्लैट खुश है, उससे पूछो।', 'Life and reality', 'घर', 'सहज', ['चौकीदार', 'फ़्लैट']),
  g('Girvi rakhne se pehle poocho, byaaj shuru hone ke baad nahi.', 'Life and reality', 'Money', 'Practical', ['girvi', 'byaaj']),
  g('Tohfe ke saath bill rakho, tabhi kaam aayega.', 'Life and reality', 'Giving', 'Practical', ['tohfe', 'bill']),
  g('Chowkidaar jaanta hai kaun sa flat khush hai, usse poocho.', 'Life and reality', 'Home', 'Wry', ['chowkidaar', 'flat']),

  /* ------------------------------------------------------ Motivational */
  e('Take the lesson. The instructor has seen worse.', 'Motivational', 'Courage', 'Direct', ['motivation', 'courage']),
  e('A pledge is a tool, not a shame.', 'Motivational', 'Money', 'Warm', ['motivation', 'money']),
  e('Learn the skill at the age you are, not the age you wish.', 'Motivational', 'Learning', 'Wise', ['motivation', 'learning']),
  h('सबक़ ले लो, इंस्ट्रक्टर ने इससे बुरे भी देखे हैं।', 'Motivational', 'साहस', 'स्पष्ट', ['सबक़', 'इंस्ट्रक्टर']),
  h('गिरवी रखना औज़ार है, शर्म नहीं।', 'Motivational', 'पैसा', 'कोमल', ['गिरवी', 'शर्म']),
  h('हुनर उस उम्र में सीखो जो है, जो चाहिए वो नहीं।', 'Motivational', 'सीखना', 'गंभीर', ['हुनर', 'उम्र']),
  g('Sabak le lo, instructor ne isse bure bhi dekhe hain.', 'Motivational', 'Courage', 'Direct', ['sabak', 'instructor']),
  g('Girvi rakhna auzar hai, sharam nahi.', 'Motivational', 'Money', 'Warm', ['girvi', 'sharam']),
  g('Hunar us umar mein seekho jo hai, jo chahiye woh nahi.', 'Motivational', 'Learning', 'Wise', ['hunar', 'umar']),

  /* -------------------------------------------------------- Aesthetic */
  e('A plain box beats a decorated bag at any wedding.', 'Aesthetic', 'Giving', 'Practical', ['aesthetic', 'gift']),
  e('A clean car with a clean dashboard is the whole interior.', 'Aesthetic', 'Cars', 'Practical', ['aesthetic', 'car']),
  h('सजे बैग से सादा डिब्बा बेहतर है, किसी भी शादी में।', 'Aesthetic', 'देना', 'व्यावहारिक', ['डिब्बा', 'बैग']),
  h('सोना कपड़े की थैली में रखो, प्लास्टिक में नहीं।', 'Aesthetic', 'घर', 'व्यावहारिक', ['सोना', 'थैली']),
  g('Saje bag se saada dibba behtar hai, kisi bhi shaadi mein.', 'Aesthetic', 'Giving', 'Practical', ['dibba', 'bag']),
  g('Sona kapde ki thaili mein rakho, plastic mein nahi.', 'Aesthetic', 'Home', 'Practical', ['sona', 'thaili']),

  /* ---------------------------------------------- Wider category band */
  e('A night shift ends with a walk, not a screen.', 'Yoga and wellness', 'Sleep', 'Practical', ['yoga', 'sleep']),
  e('Learn to drive before the exam pressure starts, not during.', 'Student life', 'Skills', 'Practical', ['student', 'skills']),
  e('Pledge against a plan, never against a hope.', 'Professional and business', 'Money', 'Sharp', ['professional', 'money']),
  e('A night match under lights rewards the patient fielder.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'fielding']),
  e('Check the tyre pressure before the long drive, every time.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'tyres']),
  e('Write the pledge repayment reminder into the calendar, not your head.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'reminders']),
  e('Write the interest rate down before you sign anything.', 'Science and curiosity', 'Rigor', 'Practical', ['science', 'rigor']),
  e('Know your burn before you pledge the family gold.', 'Startup and hustle', 'Money', 'Sharp', ['startup', 'money']),
  e('A cupboard that locks properly is worth more than one that shines.', 'Home and interiors', 'Safety', 'Practical', ['home', 'safety']),
  e('One bag, one box, one good lock.', 'Minimal', 'Possessions', 'Practical', ['minimal', 'possessions']),
  e('A well-ironed shirt makes a driving lesson look like a plan.', 'Stylish', 'Style', 'Wry', ['stylish', 'shirt']),
  e('The funniest thing about a driving test is the confidence of the mirror.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'driving']),
  e('I will tell you what the pledge really costs per month.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who sits with you at the bank is a rare thing.', 'Friendship', 'Support', 'Warm', ['friendship', 'bank']),
  e('My grandmother pledged her bangles and never mentioned it once.', 'Family', 'Grandparents', 'Tender', ['family', 'grandmother']),
  e('The watchman and I were the only two people awake at three.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'night']),
  e('A night walk without a phone is a small act of faith.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'walk']),
  e('Photograph the hands that gave you the gift.', 'Photography', 'People', 'Warm', ['photography', 'hands']),
  e('Drive out of the city at night and the map gets honest.', 'Travel and adventure', 'Roads', 'Warm', ['travel', 'drive']),
  e('A pledge story told plainly gets more replies than a holiday.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who greets the night staff by name.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'night']),
  e('I will not sell the gold to look successful at a wedding.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'gold']),
  e('A monsoon drive needs new wipers more than a new playlist.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'wipers']),
  h('रात की शिफ़्ट खत्म हो तो टहलो, स्क्रीन मत देखो।', 'Yoga and wellness', 'नींद', 'व्यावहारिक', ['शिफ़्ट', 'टहलो']),
  h('क़र्ज़ योजना के ख़िलाफ़ लो, उम्मीद के ख़िलाफ़ नहीं।', 'Professional and business', 'पैसा', 'तीखा', ['क़र्ज़', 'योजना']),
  h('लंबे सफ़र से पहले टायर की हवा देखो, हर बार।', 'Cars and bikes', 'रखरखाव', 'व्यावहारिक', ['टायर', 'सफ़र']),
  h('जो तोहफ़ा तुम ख़ुद काम लेते, वही सुरक्षित तोहफ़ा है।', 'Fashion and beauty', 'तोहफ़ा', 'व्यावहारिक', ['तोहफ़ा', 'सुरक्षित']),
  h('दादी ने अपने कंगन गिरवी रखे और एक बार भी ज़िक्र नहीं किया।', 'Family', 'दादा-दादी', 'कोमल', ['दादी', 'कंगन']),
  h('रात की सैर, बिना फ़ोन, एक छोटा भरोसा है।', 'Spirituality and peace', 'अभ्यास', 'गंभीर', ['सैर', 'भरोसा']),
  g('Raat ki shift khatam ho toh tahlo, screen mat dekho.', 'Yoga and wellness', 'Sleep', 'Practical', ['shift', 'tahlo']),
  g('Karz yojana ke khilaaf lo, umeed ke khilaaf nahi.', 'Professional and business', 'Money', 'Sharp', ['karz', 'yojana']),
  g('Lambe safar se pehle tyre ki hawa dekho, har baar.', 'Cars and bikes', 'Maintenance', 'Practical', ['tyre', 'safar']),
  g('Jo tohfa tum khud kaam lete, wahi surakshit tohfa hai.', 'Fashion and beauty', 'Gifting', 'Practical', ['tohfa', 'surakshit']),
  g('Dadi ne apne kangan girvi rakhe aur ek baar bhi zikr nahi kiya.', 'Family', 'Grandparents', 'Tender', ['dadi', 'kangan']),
  g('Raat ki sair, bina phone, ek chhota bharosa hai.', 'Spirituality and peace', 'Practice', 'Wise', ['sair', 'bharosa']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('चालीस पर भी ड्राइविंग का सबक़ लेता हूँ, शर्म नहीं आती।', 'Attitude', 'साहस', 'स्पष्ट', ['सबक़', 'ड्राइविंग']),
  h('हमारी शादी की लिस्ट में तीन चीज़ें थीं, और एक भी नहीं रखी।', 'Love and romance', 'शुरुआत', 'सहज', ['लिस्ट', 'शादी']),
  h('मैं दो बार ड्राइविंग टेस्ट में फेल हुआ और किसी को नहीं बताया।', 'Sad and heartbreak', 'नाकामी', 'स्पष्ट', ['टेस्ट', 'किसी']),
  h('रात में गाड़ी चलाना सीखो तो सड़कें खाली मिलेंगी।', 'Life and reality', 'सीखना', 'व्यावहारिक', ['गाड़ी', 'सड़कें']),
  g('Chaalees par bhi driving ka sabak leta hoon, sharam nahi aati.', 'Attitude', 'Courage', 'Direct', ['sabak', 'driving']),
  g('Humari shaadi ki list mein teen cheezein thi, aur ek bhi nahi rakhi.', 'Love and romance', 'Beginning', 'Wry', ['list', 'shaadi']),
  g('Main do baar driving test mein fail hua aur kisi ko nahi bataya.', 'Sad and heartbreak', 'Failure', 'Honest', ['test', 'kisi']),
  g('Raat mein gaadi chalana seekho toh sadkein khaali milengi.', 'Life and reality', 'Learning', 'Practical', ['gaadi', 'sadkein']),
  h('अलमारी का ताला ठीक हो, चमक से ज़्यादा काम की चीज़ है।', 'Home and interiors', 'सुरक्षा', 'व्यावहारिक', ['ताला', 'अलमारी']),
  h('तोहफ़े के साथ बिल रखने से वो दोबारा घूमता नहीं।', 'Fashion and beauty', 'तोहफ़ा', 'व्यावहारिक', ['बिल', 'तोहफ़े']),
];
