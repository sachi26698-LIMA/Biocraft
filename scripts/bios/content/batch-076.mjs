/**
 * BioCraft original bios — batch 076.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the tailor's trial date, the last metre of a bus ride
 * where you stand, a wedding album nobody opens, a night-shift security guard's
 * register, a grandmother who names the pigeons, and a landlord's letter.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_076 = [
  /* ------------------------------------------------------------ Attitude */
  e('I stand the last ten minutes of the bus so someone older can sit.', 'Attitude', 'Courtesy', 'Warm', ['attitude', 'bus']),
  e('I open the wedding album once a year, on her birthday, with her.', 'Attitude', 'Reverence', 'Tender', ['attitude', 'album']),
  e('I sign the watchman\'s register on time and never leave it blank.', 'Attitude', 'Duty', 'Firm', ['attitude', 'register']),
  h('बस में आख़िरी दस मिनट खड़ा रह जाता हूँ, ताकि किसी बुज़ुर्ग को सीट मिले।', 'Attitude', 'शिष्टाचार', 'कोमल', ['बस', 'सीट']),
  h('दर्ज़ी की तारीख़ टालने के बजाय उसी दिन नाप देने चला जाता हूँ।', 'Attitude', 'सब्र', 'शांत', ['दर्ज़ी', 'तारीख़']),
  h('शादी का एल्बम साल में एक बार खोलता हूँ, उसके जन्मदिन पर, उसके साथ।', 'Attitude', 'लगाव', 'कोमल', ['एल्बम', 'जन्मदिन']),
  h('चौकीदार की रजिस्टर पर समय से दस्तख़त करता हूँ, ख़ाली नहीं छोड़ता।', 'Attitude', 'फ़र्ज़', 'दृढ़', ['रजिस्टर', 'दस्तख़त']),
  g('Bus mein aakhri das minute khada reh jaata hoon, taaki kisi buzurg ko seat mile.', 'Attitude', 'Courtesy', 'Warm', ['bus', 'seat']),
  g('Darzi ki taarikh taalne ke bajaye usi din naap dene chala jaata hoon.', 'Attitude', 'Patience', 'Composed', ['darzi', 'taarikh']),
  g('Shaadi ka album saal mein ek baar kholta hoon, uske janamdin par, uske saath.', 'Attitude', 'Reverence', 'Tender', ['album', 'janamdin']),
  g('Chowkidar ki register par samay se dastakhat karta hoon, khaali nahi chhodta.', 'Attitude', 'Duty', 'Firm', ['register', 'dastakhat']),

  /* ------------------------------------------------------------- Love */
  e('You came to the tailor with me and argued about the sleeve for me.', 'Love and romance', 'Defence', 'Warm', ['love', 'tailor']),
  e('You gave up the window seat and stood the last metre with me.', 'Love and romance', 'Quiet care', 'Tender', ['love', 'bus']),
  e('Our wedding album has one photograph where neither of us is looking.', 'Love and romance', 'Marriage', 'Warm', ['love', 'album']),
  h('तुम मेरे साथ दर्ज़ी तक आए और मेरी बाजू के लिए झगड़े।', 'Love and romance', 'पैरवी', 'कोमल', ['दर्ज़ी', 'बाजू']),
  h('तुमने खिड़की वाली सीट छोड़ी और आख़िरी डेढ़ मीटर मेरे साथ खड़े रहे।', 'Love and romance', 'चुप्पी', 'कोमल', ['सीट', 'खिड़की']),
  h('हमारी शादी के एल्बम में एक तस्वीर ऐसी है जिसमें हम दोनों कहीं और देख रहे हैं।', 'Love and romance', 'शादी', 'कोमल', ['तस्वीर', 'एल्बम']),
  g('Tum mere saath darzi tak aaye aur meri baaju ke liye jhagde.', 'Love and romance', 'Defence', 'Warm', ['darzi', 'baaju']),
  g('Tumne khidki wali seat chhodi aur aakhri dedh meter mere saath khade rahe.', 'Love and romance', 'Quiet care', 'Tender', ['seat', 'khidki']),
  g('Hamari shaadi ke album mein ek tasveer aisi hai jismein hum dono kahin aur dekh rahe hain.', 'Love and romance', 'Marriage', 'Warm', ['tasveer', 'album']),

  /* ------------------------------------------------------- Sad depth */
  e('The tailor finished my father\'s shirt a week after the funeral.', 'Sad and heartbreak', 'Parents', 'Heavy', ['sad', 'tailor']),
  e('The wedding album sits on the top shelf because nobody wants to turn pages.', 'Sad and heartbreak', 'Marriage', 'Quiet', ['sad', 'album']),
  e('The night guard writes the same twelve words in the register every hour.', 'Sad and heartbreak', 'Work', 'Heavy', ['sad', 'register']),
  e('My grandmother stopped naming the pigeons the week the terrace was locked.', 'Sad and heartbreak', 'Home', 'Quiet', ['sad', 'pigeons']),
  h('पापा का कुर्ता दर्ज़ी ने तेरहवीं के एक हफ़्ते बाद सिलकर दिया।', 'Sad and heartbreak', 'माँ-बाप', 'भारी', ['कुर्ता', 'तेरहवीं']),
  h('शादी का एल्बम ऊपर की आलमारी में रखा है, कोई पन्ने नहीं पलटता।', 'Sad and heartbreak', 'शादी', 'शांत', ['एल्बम', 'आलमारी']),
  h('रात का चौकीदार रजिस्टर में हर घंटे वही बारह शब्द लिखता है।', 'Sad and heartbreak', 'काम', 'भारी', ['चौकीदार', 'रजिस्टर']),
  h('छत बंद होने वाले हफ़्ते नानी ने कबूतरों के नाम रखना छोड़ दिया।', 'Sad and heartbreak', 'घर', 'शांत', ['कबूतर', 'छत']),
  g('Papa ka kurta darzi ne terahvin ke ek hafte baad sil kar diya.', 'Sad and heartbreak', 'Parents', 'Heavy', ['kurta', 'terahvin']),
  g('Shaadi ka album upar ki almaari mein rakha hai, koi panne nahi palat ta.', 'Sad and heartbreak', 'Marriage', 'Quiet', ['album', 'almaari']),
  g('Raat ka chowkidar register mein har ghante wahi baarah shabd likhta hai.', 'Sad and heartbreak', 'Work', 'Heavy', ['chowkidar', 'register']),
  g('Chhat band hone wale hafte nani ne kabootron ke naam rakhna chhod diya.', 'Sad and heartbreak', 'Home', 'Quiet', ['kabootar', 'chhat']),

  /* --------------------------------------------------------- Shayari */
  h('माप लिया,\nसिल दिया,\nतारीख़ बाक़ी रही।', 'Shayari', 'तीन पंक्ति', 'तीखा', ['माप', 'तारीख़']),
  h('बस रुकी,\nदरवाज़ा खुला,\nआख़िरी डेढ़ मीटर मेरा।', 'Shayari', 'तीन पंक्ति', 'शांत', ['बस', 'दरवाज़ा']),
  g('Naap liya, sil diya, taarikh baaki rahi.', 'Shayari', 'Two line', 'Sharp', ['naap', 'taarikh']),
  g('Bus ruki thi, darwaaza khula tha, aakhri dedh meter bas mera tha.', 'Shayari', 'Two line', 'Quiet', ['bus', 'darwaaza']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A trial date is the only thing a tailor gives you for free.', 'Quotes and thoughts', 'Work', 'Wry', ['quotes', 'tailor']),
  e('The last metre of a bus is where the standing learn patience.', 'Quotes and thoughts', 'Cities', 'Wise', ['quotes', 'bus']),
  e('An unopened wedding album is a marriage that stopped explaining itself.', 'Quotes and thoughts', 'Marriage', 'Sharp', ['quotes', 'album']),
  e('A register signed on time is the cheapest form of honesty at work.', 'Quotes and thoughts', 'Work', 'Firm', ['quotes', 'register']),
  h('दर्ज़ी मुफ़्त में सिर्फ़ एक तारीख़ देता है।', 'Quotes and thoughts', 'काम', 'सहज', ['दर्ज़ी', 'तारीख़']),
  h('बस का आख़िरी मीटर वहाँ है जहाँ खड़े लोग सब्र सीखते हैं।', 'Quotes and thoughts', 'शहर', 'गंभीर', ['बस', 'सब्र']),
  h('बंद एल्बम वो शादी है जिसने ख़ुद को समझाना बंद कर दिया।', 'Quotes and thoughts', 'शादी', 'तीखा', ['एल्बम', 'शादी']),
  g('Darzi muft mein sirf ek taarikh deta hai.', 'Quotes and thoughts', 'Work', 'Wry', ['darzi', 'taarikh']),
  g('Bus ka aakhri meter wahan hai jahan khade log sabr seekhte hain.', 'Quotes and thoughts', 'Cities', 'Wise', ['bus', 'sabr']),
  g('Band album woh shaadi hai jisne khud ko samjhana band kar diya.', 'Quotes and thoughts', 'Marriage', 'Sharp', ['album', 'shaadi']),

  /* ------------------------------------------------- Life and reality */
  e('Take the trial date seriously. That is the day the shirt is actually decided.', 'Life and reality', 'Work', 'Practical', ['life', 'tailor']),
  e('Stand for the last minutes of a crowded bus. Somebody behind you is older.', 'Life and reality', 'Cities', 'Warm', ['life', 'bus']),
  e('Open the album once a year while the people in it can still be asked.', 'Life and reality', 'Family', 'Warm', ['life', 'album']),
  e('Write your name in a register the way you would sign a cheque.', 'Life and reality', 'Work', 'Practical', ['life', 'register']),
  e('Feed the pigeons on the terrace before the terrace is locked.', 'Life and reality', 'Home', 'Warm', ['life', 'pigeons']),
  h('नाप वाले दिन को हल्के में मत लो, कुर्ता उसी दिन तय होता है।', 'Life and reality', 'काम', 'व्यावहारिक', ['नाप', 'कुर्ता']),
  h('भरी बस में आख़िरी दो स्टॉप खड़े रहो, पीछे कोई बुज़ुर्ग है।', 'Life and reality', 'शहर', 'कोमल', ['बस', 'स्टॉप']),
  h('एल्बम साल में एक बार खोलो, जब तक उसमें वाले लोग जवाब दे सकते हैं।', 'Life and reality', 'परिवार', 'कोमल', ['एल्बम', 'जवाब']),
  h('रजिस्टर में नाम ऐसे लिखो जैसे चेक पर दस्तख़त करते हो।', 'Life and reality', 'काम', 'व्यावहारिक', ['रजिस्टर', 'चेक']),
  h('एल्बम में एक पन्ना ख़ाली है, जिसे किसी ने चिपकाया ही नहीं।', 'Life and reality', 'याद', 'शांत', ['पन्ना', 'एल्बम']),
  h('बस के दरवाज़े पर खड़े होकर शहर देखना अलग ही आदत है।', 'Life and reality', 'शहर', 'सहज', ['दरवाज़ा', 'शहर']),
  g('Album mein ek panna khaali hai, jise kisi ne chipkaaya hi nahi.', 'Life and reality', 'Memory', 'Quiet', ['panna', 'album']),
  g('Bus ke darwaaze par khade hokar shehar dekhna alag hi aadat hai.', 'Life and reality', 'Cities', 'Warm', ['darwaaza', 'shehar']),
  g('Naap wale din ko halke mein mat lo, kurta usi din tay hota hai.', 'Life and reality', 'Work', 'Practical', ['naap', 'kurta']),
  g('Bhari bus mein aakhri do stop khade raho, peeche koi buzurg hai.', 'Life and reality', 'Cities', 'Warm', ['bus', 'stop']),
  g('Album saal mein ek baar kholo, jab tak usme wale log jawab de sakte hain.', 'Life and reality', 'Family', 'Warm', ['album', 'jawab']),
  g('Register mein naam aise likho jaise cheque par dastakhat karte ho.', 'Life and reality', 'Work', 'Practical', ['register', 'cheque']),

  /* ------------------------------------------------------ Motivational */
  e('A shirt that fits was measured once, on a day you almost skipped.', 'Motivational', 'Discipline', 'Wise', ['motivation', 'discipline']),
  e('Stand for ten minutes. It is the smallest rent you pay for a city.', 'Motivational', 'Character', 'Warm', ['motivation', 'character']),
  e('Nobody remembers the page they turned. They remember who opened it.', 'Motivational', 'Family', 'Tender', ['motivation', 'family']),
  h('ढीला हुआ कुर्ता भी नाप के दिन की ग़लती बताता है।', 'Motivational', 'अनुशासन', 'गंभीर', ['कुर्ता', 'ग़लती']),
  h('दस मिनट खड़े रहो, शहर का सबसे छोटा किराया इतना है।', 'Motivational', 'चरित्र', 'कोमल', ['मिनट', 'किराया']),
  h('पन्ने किसने पलटे ये याद नहीं रहता, एल्बम किसने खोला ये याद रहता है।', 'Motivational', 'परिवार', 'कोमल', ['एल्बम', 'पन्ने']),
  g('Dheela hua kurta bhi naap ke din ki galti batata hai.', 'Motivational', 'Discipline', 'Wise', ['kurta', 'galti']),
  g('Das minute khade raho, shehar ka sabse chhota kiraya itna hai.', 'Motivational', 'Character', 'Warm', ['minute', 'kiraya']),
  g('Panne kisne palte ye yaad nahi rehta, album kisne khola ye yaad rehta hai.', 'Motivational', 'Family', 'Tender', ['album', 'panne']),

  /* -------------------------------------------------------- Aesthetic */
  e('Tailors\' shops smell of chalk, steam and old paper patterns.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'tailor']),
  e('A wedding album has a plastic cover that has yellowed beautifully.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'album']),
  e('A bus door opening at dusk throws a rectangle of orange on the road.', 'Aesthetic', 'Cities', 'Quiet', ['aesthetic', 'bus']),
  h('दर्ज़ी की दुकान से खड़िया, भाप और पुराने काग़ज़ी नक़्शों की गंध आती है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['दुकान', 'खड़िया']),
  h('शादी के एल्बम के प्लास्टिक कवर का पीलापन भी ख़ूबसूरत लगता है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['कवर', 'पीलापन']),
  g('Darzi ki dukaan se khadiya, bhaap aur purane kaghzi nakshon ki gandh aati hai.', 'Aesthetic', 'Objects', 'Warm', ['dukaan', 'khadiya']),
  g('Shaadi ke album ka plastic cover jo peela pad gaya hai, woh bhi khoobsurat lagta hai.', 'Aesthetic', 'Objects', 'Warm', ['cover', 'peela']),

  /* ---------------------------------------------- Wider category band */
  e('A tailor who measures twice has a customer who returns once.', 'Professional and business', 'Craft', 'Wise', ['professional', 'tailor']),
  e('Stand up in the bus before the conductor asks. It costs nothing.', 'Friendship', 'Manners', 'Warm', ['friendship', 'manners']),
  e('Write the trial date in the diary, not on the paper bag.', 'Student life', 'Admin', 'Practical', ['student', 'admin']),
  e('Scan the wedding album at 600 dpi. Plastic covers do not survive forever.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'scan']),
  e('A neighbour who feeds pigeons at six is the only alarm the lane trusts.', 'Home and interiors', 'Neighbourhood', 'Warm', ['home', 'neighbourhood']),
  e('Two kurta measurements, one shirt, no arguments. That is the whole deal.', 'Minimal', 'Wardrobe', 'Practical', ['minimal', 'wardrobe']),
  e('A plain kurta that fits beats a designer one that hangs.', 'Stylish', 'Fit', 'Sharp', ['stylish', 'fit']),
  e('The funniest thing at a tailor\'s is the mirror that lies politely.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'tailor']),
  e('I will say the bus was full and I stood. That is the whole story.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who holds your bag while you stand in the bus is enough.', 'Friendship', 'Small things', 'Warm', ['friendship', 'bus']),
  e('My mother kept every wedding album in one cotton bag.', 'Family', 'Parents', 'Tender', ['family', 'album']),
  e('Standing at a bus door at night is a particular kind of company.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'bus']),
  e('Feeding pigeons at dawn is a ritual with no scripture and no fee.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'pigeons']),
  e('Photograph the tailor\'s chalk marks before they are cut away.', 'Photography', 'Craft', 'Warm', ['photography', 'tailor']),
  e('An overnight bus has its own etiquette and its own smell.', 'Travel and adventure', 'Buses', 'Warm', ['travel', 'bus']),
  e('A profile that says I stand for the last ten minutes says a lot.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who opens the album and names everybody in it.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'family']),
  e('I will stand the whole way rather than take a seat meant for someone older.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'manners']),
  e('Monsoon buses have fogged windows and a driver who brakes late.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'bus']),
  h('दो बार नाप लेने वाले दर्ज़ी का ग्राहक एक ही बार लौटता है।', 'Professional and business', 'हुनर', 'गंभीर', ['दर्ज़ी', 'ग्राहक']),
  h('ट्रायल की तारीख़ डायरी में लिखो, काग़ज़ के थैले पर नहीं।', 'Student life', 'दफ़्तरी काम', 'व्यावहारिक', ['तारीख़', 'डायरी']),
  h('शादी का एल्बम छह सौ डीपीआई पर स्कैन करो, प्लास्टिक कवर हमेशा नहीं टिकता।', 'Technology and coding', 'हुनर', 'व्यावहारिक', ['एल्बम', 'स्कैन']),
  h('सुबह छह बजे कबूतरों को दाना डालने वाली पड़ोसन गली का सबसे भरोसेमंद अलार्म है।', 'Home and interiors', 'मोहल्ला', 'कोमल', ['कबूतर', 'गली']),
  h('ढीला कुर्ता पहनने से अच्छा है कि नाप दोबारा ली जाए।', 'Minimal', 'अलमारी', 'व्यावहारिक', ['कुर्ता', 'नाप']),
  h('बारिश में बस की खिड़कियाँ धुँधली और ड्राइवर जल्दी ब्रेक मारने वाला।', 'Monsoon and seasons', 'बारिश', 'सहज', ['बस', 'बारिश']),
  g('Do baar naap lene wale darzi ka grahak ek hi baar lautta hai.', 'Professional and business', 'Craft', 'Wise', ['darzi', 'grahak']),
  g('Trial ki taarikh diary mein likho, kaghaz ke thailay par nahi.', 'Student life', 'Admin', 'Practical', ['taarikh', 'diary']),
  g('Shaadi ka album chhe sau dpi par scan karo, plastic cover hamesha nahi tikta.', 'Technology and coding', 'Craft', 'Practical', ['album', 'scan']),
  g('Subah chhe baje kabootron ko dana daalne wali padosan gali ka sabse bharosemand alarm hai.', 'Home and interiors', 'Neighbourhood', 'Warm', ['kabootar', 'gali']),
  g('Dheela kurta pehenne se accha hai ki naap dobara li jaaye.', 'Minimal', 'Wardrobe', 'Practical', ['kurta', 'naap']),
  g('Baarish mein bus ki khidkiyan dhundhli aur driver jaldi brake maarne wala.', 'Monsoon and seasons', 'Rain', 'Wry', ['bus', 'baarish']),
];
