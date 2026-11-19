/**
 * BioCraft original bios — batch 065.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the key maker under the stairs, a father who cannot
 * swim, the scooter that will not start in winter, a school farewell,
 * the chemist who gives credit, a rented fridge.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_065 = [
  /* ------------------------------------------------------------ Attitude */
  e('I get three copies made and give two away.', 'Attitude', 'Generosity', 'Practical', ['attitude', 'keys']),
  e('I pay the chemist before the month ends, even if it is tight.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'chemist']),
  e('I return the rented fridge clean and on the agreed day.', 'Attitude', 'Honesty', 'Practical', ['attitude', 'fridge']),
  h('तीन चाबियाँ बनवाता हूँ और दो लोगों को दे देता हूँ।', 'Attitude', 'उदारता', 'व्यावहारिक', ['चाबियाँ', 'लोगों']),
  h('महीने के आख़िर से पहले दवा वाले को पैसे दे देता हूँ, तंगी में भी।', 'Attitude', 'ईमानदारी', 'दृढ़', ['दवा', 'तंगी']),
  h('जो तैरना नहीं जानता, उस पर मैं नहीं हँसता।', 'Attitude', 'लिहाज़', 'तीखा', ['तैरना', 'हँसता']),
  h('किराए का फ़्रिज साफ़ करके तय दिन पर लौटाता हूँ।', 'Attitude', 'ईमानदारी', 'व्यावहारिक', ['फ़्रिज', 'लौटाता']),
  g('Teen chaabiyan banwata hoon aur do logon ko de deta hoon.', 'Attitude', 'Generosity', 'Practical', ['chaabiyan', 'logon']),
  g('Mahine ke aakhir se pehle dawa wale ko paise de deta hoon, tangi mein bhi.', 'Attitude', 'Integrity', 'Firm', ['dawa', 'tangi']),
  g('Jo tairna nahi jaanta, us par main nahi hansata.', 'Attitude', 'Respect', 'Sharp', ['tairna', 'hansata']),
  g('Kiraaye ka fridge saaf karke tay din par lautata hoon.', 'Attitude', 'Honesty', 'Practical', ['fridge', 'lautata']),

  /* ------------------------------------------------------------- Love */
  e('You learned to swim at thirty so you could take the children to the pool.', 'Love and romance', 'Effort', 'Tender', ['love', 'swim']),
  e('The spare key to your flat has been on my ring for four years.', 'Love and romance', 'Trust', 'Warm', ['love', 'keys']),
  e('We bought a fridge on instalments and called it a wedding gift to ourselves.', 'Love and romance', 'Starting out', 'Wry', ['love', 'fridge']),
  h('तुमने तीस पर तैरना सीखा, ताकि बच्चों को पूल ले जा सको।', 'Love and romance', 'कोशिश', 'कोमल', ['तैरना', 'पूल']),
  h('तुम्हारे घर की स्पेयर चाबी चार साल से मेरे छल्ले में है।', 'Love and romance', 'भरोसा', 'कोमल', ['चाबी', 'छल्ले']),
  h('हमने फ़्रिज क़िस्त पर लिया और उसे अपना तोहफ़ा कहा।', 'Love and romance', 'शुरुआत', 'सहज', ['फ़्रिज', 'तोहफ़ा']),
  g('Tumne tees par tairna seekha, taaki bachchon ko pool le ja sako.', 'Love and romance', 'Effort', 'Tender', ['tairna', 'pool']),
  g('Tumhare ghar ki spare chaabi chaar saal se mere challe mein hai.', 'Love and romance', 'Trust', 'Warm', ['chaabi', 'challe']),
  g('Humne fridge qist par liya aur use apna tohfa kaha.', 'Love and romance', 'Starting out', 'Wry', ['fridge', 'tohfa']),

  /* ------------------------------------------------------- Sad depth */
  e('My father could not swim and he never came to the river with us.', 'Sad and heartbreak', 'Parents', 'Quiet', ['sad', 'swim']),
  e('The farewell ended with everyone promising to stay in touch, and nobody did.', 'Sad and heartbreak', 'School', 'Honest', ['sad', 'farewell']),
  e('The chemist credit book had our name in it for eleven months.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'chemist']),
  e('The rented fridge went back and the flat felt emptier than before it came.', 'Sad and heartbreak', 'Home', 'Aching', ['sad', 'fridge']),
  h('पिताजी तैरना नहीं जानते थे, और हमारे साथ नदी कभी नहीं आए।', 'Sad and heartbreak', 'माँ-बाप', 'शांत', ['नदी', 'तैरना']),
  h('विदाई उस वादे पर खत्म हुई कि सब मिलते रहेंगे, और कोई नहीं मिला।', 'Sad and heartbreak', 'स्कूल', 'स्पष्ट', ['विदाई', 'वादे']),
  h('दवा वाले की बही में हमारा नाम ग्यारह महीने चढ़ा रहा।', 'Sad and heartbreak', 'पैसा', 'भारी', ['बही', 'महीने']),
  g('Pitaji tairna nahi jaante the, aur humare saath nadi kabhi nahi aaye.', 'Sad and heartbreak', 'Parents', 'Quiet', ['nadi', 'tairna']),
  g('Vidaai us waade par khatam hui ki sab milte rahenge, aur koi nahi mila.', 'Sad and heartbreak', 'School', 'Honest', ['vidaai', 'waade']),
  g('Dawa wale ki bahi mein humara naam gyarah mahine chadha raha.', 'Sad and heartbreak', 'Money', 'Heavy', ['bahi', 'mahine']),

  /* --------------------------------------------------------- Shayari */
  h('चाबी बन गई,\nदरवाज़ा\nबदल गया।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['चाबी', 'दरवाज़ा']),
  h('विदाई के बाद\nनाम\nअधूरे रह गए।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['विदाई', 'नाम']),
  g('Chaabi ban gayi, darwaza badal gaya.', 'Shayari', 'Two line', 'Deep', ['chaabi', 'darwaza']),
  g('Vidaai ke baad naam adhoore reh gaye.', 'Shayari', 'Two line', 'Aching', ['vidaai', 'naam']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A key maker knows every house on the street and none of its secrets.', 'Quotes and thoughts', 'Cities', 'Wry', ['quotes', 'keys']),
  e('Credit at the chemist is the kindest ledger in any neighbourhood.', 'Quotes and thoughts', 'Money', 'Warm', ['quotes', 'chemist']),
  e('A farewell is a rehearsal for the people you will not call.', 'Quotes and thoughts', 'School', 'Sharp', ['quotes', 'farewell']),
  h('चाबी बनाने वाला गली का हर घर जानता है, किसी का राज़ नहीं।', 'Quotes and thoughts', 'शहर', 'सहज', ['चाबी', 'राज़']),
  h('दवा वाले का उधार मोहल्ले की सबसे नरम बही है।', 'Quotes and thoughts', 'पैसा', 'कोमल', ['उधार', 'बही']),
  h('जो तैर नहीं सकता, वो भी पूरी दोपहर किनारे पर खड़ा रहता है।', 'Quotes and thoughts', 'पिता', 'भावुक', ['किनारे', 'दोपहर']),
  g('Chaabi banane wala gali ka har ghar jaanta hai, kisi ka raaz nahi.', 'Quotes and thoughts', 'Cities', 'Wry', ['chaabi', 'raaz']),
  g('Dawa wale ka udhaar mohalle ki sabse naram bahi hai.', 'Quotes and thoughts', 'Money', 'Warm', ['udhaar', 'bahi']),
  g('Jo tair nahi sakta, woh bhi poori dopahar kinaare par khada rehta hai.', 'Quotes and thoughts', 'Fathers', 'Aching', ['kinaare', 'dopahar']),

  /* ------------------------------------------------- Life and reality */
  e('Give a spare key to exactly one person and tell nobody else.', 'Life and reality', 'Home', 'Practical', ['life', 'keys']),
  e('Settle the chemist bill monthly or it becomes a relationship.', 'Life and reality', 'Money', 'Sharp', ['life', 'chemist']),
  e('Learn to swim before your children ask you to come in.', 'Life and reality', 'Learning', 'Warm', ['life', 'swim']),
  e('A scooter that starts in winter is a scooter with a new battery.', 'Life and reality', 'Vehicles', 'Practical', ['life', 'scooter']),
  h('स्पेयर चाबी सिर्फ़ एक आदमी को दो, किसी और को मत बताओ।', 'Life and reality', 'घर', 'व्यावहारिक', ['चाबी', 'आदमी']),
  h('दवा का बिल हर महीने चुकाओ, वरना वो रिश्ता बन जाता है।', 'Life and reality', 'पैसा', 'तीखा', ['बिल', 'रिश्ता']),
  h('बच्चे कहें उससे पहले तैरना सीख लो।', 'Life and reality', 'सीखना', 'कोमल', ['बच्चे', 'तैरना']),
  h('विदाई पर तस्वीरें खींचो, याद एक बुरा फ़ोटोग्राफ़र है।', 'Life and reality', 'स्कूल', 'कोमल', ['तस्वीरें', 'याद']),
  g('Spare chaabi sirf ek aadmi ko do, kisi aur ko mat batao.', 'Life and reality', 'Home', 'Practical', ['chaabi', 'aadmi']),
  g('Dawa ka bill har mahine chukao, warna woh rishta ban jaata hai.', 'Life and reality', 'Money', 'Sharp', ['bill', 'rishta']),
  g('Bachche kahein usse pehle tairna seekh lo.', 'Life and reality', 'Learning', 'Warm', ['bachche', 'tairna']),
  g('Vidaai par tasveerein kheencho, yaad ek bura photographer hai.', 'Life and reality', 'School', 'Warm', ['tasveerein', 'yaad']),

  /* ------------------------------------------------------ Motivational */
  e('Learning to swim at thirty is not late. Drowning is late.', 'Motivational', 'Courage', 'Sharp', ['motivation', 'swim']),
  e('Call two people from the farewell this month. Just two.', 'Motivational', 'Friendship', 'Direct', ['motivation', 'farewell']),
  e('Pay the small bill and you keep the small dignity.', 'Motivational', 'Worth', 'Firm', ['motivation', 'dignity']),
  h('तीस पर तैरना सीखना देर नहीं है, डूबना देर है।', 'Motivational', 'साहस', 'तीखा', ['तैरना', 'डूबना']),
  h('इस महीने विदाई के दो लोगों को फ़ोन करो, बस दो।', 'Motivational', 'दोस्ती', 'स्पष्ट', ['लोगों', 'फ़ोन']),
  h('छोटा बिल चुका दो, छोटी इज़्ज़त बची रहेगी।', 'Motivational', 'क़ीमत', 'दृढ़', ['बिल', 'इज़्ज़त']),
  g('Tees par tairna seekhna der nahi hai, doobna der hai.', 'Motivational', 'Courage', 'Sharp', ['tairna', 'doobna']),
  g('Is mahine vidaai ke do logon ko phone karo, bas do.', 'Motivational', 'Friendship', 'Direct', ['logon', 'phone']),
  g('Chhota bill chuka do, chhoti izzat bachi rahegi.', 'Motivational', 'Worth', 'Firm', ['bill', 'izzat']),

  /* -------------------------------------------------------- Aesthetic */
  e('A brass key ring wears down beautifully. Steel never does.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'keys']),
  e('An old fridge with a magnet from every trip is a family album.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'fridge']),
  h('पीतल का चाबी का छल्ला सुंदर घिसता है, स्टील नहीं घिसता।', 'Aesthetic', 'चीज़ें', 'कोमल', ['छल्ला', 'स्टील']),
  h('हर सफ़र के मैग्नेट वाला पुराना फ़्रिज परिवार की एल्बम है।', 'Aesthetic', 'घर', 'कोमल', ['मैग्नेट', 'एल्बम']),
  g('Peetal ka chaabi ka chhalla sundar ghista hai, steel nahi ghista.', 'Aesthetic', 'Objects', 'Warm', ['chhalla', 'steel']),
  g('Har safar ke magnet wala purana fridge parivaar ki album hai.', 'Aesthetic', 'Home', 'Warm', ['magnet', 'album']),

  /* ---------------------------------------------- Wider category band */
  e('A cold water swim is the cheapest reset available to a body.', 'Yoga and wellness', 'Body', 'Practical', ['yoga', 'swim']),
  e('Keep the farewell group alive with one photograph, not forty messages.', 'Student life', 'School', 'Practical', ['student', 'farewell']),
  e('A shop that gives credit needs a book, not a memory.', 'Professional and business', 'Money', 'Sharp', ['professional', 'credit']),
  e('A fielder who dives without warming up is a fielder with a bad shoulder.', 'Cricket and sports', 'Cricket', 'Practical', ['cricket', 'fielding']),
  e('A new battery in November saves three winter mornings.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'battery']),
  e('Get the spare key cut at a counter, not from a man with a file on the road.', 'Fashion and beauty', 'Accessories', 'Wry', ['fashion', 'keys']),
  e('A key is a three dimensional password. Treat it like one.', 'Technology and coding', 'Security', 'Sharp', ['tech', 'security']),
  e('Test the duplicate key before you walk away from the counter.', 'Science and curiosity', 'Method', 'Practical', ['science', 'method']),
  e('Collect the instalment before delivering the machine. Always.', 'Startup and hustle', 'Money', 'Sharp', ['startup', 'money']),
  e('One key ring, four keys, nothing else on it.', 'Minimal', 'Possessions', 'Practical', ['minimal', 'keys']),
  e('A clean key ring looks like a person with a system.', 'Stylish', 'Style', 'Wry', ['stylish', 'keys']),
  e('The funniest thing at a key counter is the man who has forgotten which door.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'keys']),
  e('I will tell you which shop gives credit and which one pretends to.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who teaches you to swim will never let you forget it.', 'Friendship', 'Support', 'Warm', ['friendship', 'swim']),
  e('My father stood at the edge of every pool we ever visited.', 'Family', 'Parents', 'Aching', ['family', 'parents']),
  e('Learning to swim alone as an adult is a specific and quiet courage.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'swim']),
  e('Floating on your back is the closest thing to a prayer with no words.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'water']),
  e('Photograph the key ring of a house you are about to leave.', 'Photography', 'Home', 'Aching', ['photography', 'keys']),
  e('Carry a spare key on a trip and keep it somewhere other than your bag.', 'Travel and adventure', 'Packing', 'Practical', ['travel', 'keys']),
  e('I am the person who keeps a spare key for exactly one neighbour.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'keys']),
  e('I will not take credit I cannot repay by the fifteenth.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'credit']),
  e('A scooter that will not start in monsoon needs the wiring, not the battery.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'scooter']),
  h('ठंडे पानी में नहाना शरीर की सबसे सस्ती मरम्मत है।', 'Yoga and wellness', 'शरीर', 'व्यावहारिक', ['पानी', 'मरम्मत']),
  h('उधार देने वाली दुकान को बही चाहिए, याददाश्त नहीं।', 'Professional and business', 'पैसा', 'तीखा', ['दुकान', 'बही']),
  h('नवंबर में नई बैटरी सर्दी की तीन सुबहें बचा लेती है।', 'Cars and bikes', 'रखरखाव', 'व्यावहारिक', ['बैटरी', 'सुबहें']),
  h('काउंटर छोड़ने से पहले नक़ली चाबी आज़मा लो।', 'Science and curiosity', 'तरीक़ा', 'व्यावहारिक', ['चाबी', 'काउंटर']),
  h('जो फ़्रिज रसोई में फ़िट हो, वो बजट में फ़िट होने से बेहतर है।', 'Home and interiors', 'रसोई', 'व्यावहारिक', ['फ़्रिज', 'रसोई']),
  h('पिताजी हर पूल के किनारे खड़े रहते थे, पानी में कभी नहीं।', 'Family', 'माँ-बाप', 'भावुक', ['पूल', 'पानी']),
  g('Thande paani mein nahana shareer ki sabse sasti marammat hai.', 'Yoga and wellness', 'Body', 'Practical', ['paani', 'marammat']),
  g('Udhaar dene wali dukaan ko bahi chahiye, yaaddasht nahi.', 'Professional and business', 'Money', 'Sharp', ['dukaan', 'bahi']),
  g('November mein nayi battery sardi ki teen subahein bacha leti hai.', 'Cars and bikes', 'Maintenance', 'Practical', ['battery', 'subahein']),
  g('Counter chhodne se pehle nakli chaabi aazma lo.', 'Science and curiosity', 'Method', 'Practical', ['chaabi', 'counter']),
  g('Jo fridge rasoi mein fit ho, woh budget mein fit hone se behtar hai.', 'Home and interiors', 'Kitchen', 'Practical', ['fridge', 'rasoi']),
  g('Pitaji har pool ke kinaare khade rehte the, paani mein kabhi nahi.', 'Family', 'Parents', 'Aching', ['pool', 'paani']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('तुम हर सर्दी की सुबह स्कूटर धक्का देते हो, मदद माँगे बिना।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['स्कूटर', 'सुबह']),
  h('किनारे पर खड़े पिता की चुप्पी, पानी से गहरी होती है।', 'Quotes and thoughts', 'पिता', 'भावुक', ['चुप्पी', 'पानी']),
  h('विदाई पर तस्वीरें ज़रूर खींचो, याद भरोसेमंद नहीं होती।', 'Life and reality', 'स्कूल', 'कोमल', ['तस्वीरें', 'भरोसेमंद']),
  h('फ़्रिज का दरवाज़ा साफ़ करो, पूरी रसोई सँभली दिखती है।', 'Aesthetic', 'घर', 'व्यावहारिक', ['फ़्रिज', 'रसोई']),
  g('Tum har sardi ki subah scooter dhakka dete ho, madad maange bina.', 'Love and romance', 'Ordinary days', 'Tender', ['scooter', 'subah']),
  g('Kinaare par khade pita ki chuppi, paani se gehri hoti hai.', 'Quotes and thoughts', 'Fathers', 'Aching', ['chuppi', 'paani']),
  g('Vidaai par tasveerein zaroor kheencho, yaad bharosemand nahi hoti.', 'Life and reality', 'School', 'Warm', ['tasveerein', 'bharosemand']),
  g('Fridge ka darwaza saaf karo, poori rasoi sambhli dikhti hai.', 'Aesthetic', 'Home', 'Practical', ['fridge', 'rasoi']),
];
