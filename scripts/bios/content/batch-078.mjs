/**
 * BioCraft original bios — batch 078.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the milkman's cycle bell before dawn, a father teaching
 * left-hand driving in an empty lot, a lost ration card, the notebook that
 * holds a wedding guest list, a shopkeeper's calculator with one dead key, and
 * a railway porter's numbers shouted back and forth.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_078 = [
  /* ------------------------------------------------------------ Attitude */
  e('I answer the milkman\'s bell at five without making him wait.', 'Attitude', 'Courtesy', 'Warm', ['attitude', 'milkman']),
  e('I let my father teach me to drive and I do not correct him.', 'Attitude', 'Humility', 'Tender', ['attitude', 'driving']),
  e('I queue again for a new ration card instead of blaming the office.', 'Attitude', 'Patience', 'Composed', ['attitude', 'ration']),
  e('I carry the porter\'s bag the last few steps so he can rest.', 'Attitude', 'Grace', 'Warm', ['attitude', 'porter']),
  h('सुबह पाँच बजे दूध वाले की घंटी सुनकर ख़ुद दरवाज़ा खोलता हूँ, उसे इंतज़ार नहीं करवाता।', 'Attitude', 'शिष्टाचार', 'कोमल', ['दूध', 'घंटी']),
  h('पापा से गाड़ी चलाना सीखता हूँ और बीच में उन्हें सुधारता नहीं।', 'Attitude', 'नम्रता', 'कोमल', ['गाड़ी', 'पापा']),
  h('राशन कार्ड खोने पर दफ़्तर को कोसने के बजाय फिर लाइन में लगता हूँ।', 'Attitude', 'सब्र', 'शांत', ['राशन', 'लाइन']),
  h('कुली के आख़िरी कुछ क़दम थैला ख़ुद उठाकर चलता हूँ, ताकि वो साँस ले सके।', 'Attitude', 'सहजता', 'कोमल', ['कुली', 'थैला']),
  g('Subah paanch baje doodh wale ki ghanti sunkar khud darwaaza kholta hoon, use intezaar nahi karwata.', 'Attitude', 'Courtesy', 'Warm', ['doodh', 'ghanti']),
  g('Papa se gaadi chalana seekhta hoon aur beech mein unhe sudhaarta nahi.', 'Attitude', 'Humility', 'Tender', ['gaadi', 'Papa']),
  g('Ration card khone par daftar ko kosne ke bajaye phir line mein lagta hoon.', 'Attitude', 'Patience', 'Composed', ['ration', 'line']),
  g('Coolie ke aakhri kuch kadam thaila khud uthakar chalta hoon, taaki woh saans le sake.', 'Attitude', 'Grace', 'Warm', ['coolie', 'thaila']),

  /* ------------------------------------------------------------- Love */
  e('You learned my father\'s route so you could drive his car home.', 'Love and romance', 'Family', 'Tender', ['love', 'driving']),
  e('You set your alarm for the milkman so I could sleep one Thursday.', 'Love and romance', 'Small things', 'Warm', ['love', 'milkman']),
  e('Our names sat next to each other on a wedding card we did not send.', 'Love and romance', 'Marriage', 'Warm', ['love', 'card']),
  h('तुमने पापा का रास्ता याद कर लिया, ताकि उनकी गाड़ी घर ला सको।', 'Love and romance', 'परिवार', 'कोमल', ['गाड़ी', 'रास्ता']),
  h('तुमने अपना अलार्म दूध वाले के लिए सेट किया, ताकि मैं एक गुरुवार सो सकूँ।', 'Love and romance', 'छोटी बातें', 'कोमल', ['अलार्म', 'गुरुवार']),
  h('हमारे नाम उस शादी के कार्ड पर साथ थे जो हमने कभी भेजा ही नहीं।', 'Love and romance', 'शादी', 'कोमल', ['कार्ड', 'नाम']),
  g('Tumne papa ka raasta yaad kar liya, taaki unki gaadi ghar la sako.', 'Love and romance', 'Family', 'Tender', ['gaadi', 'raasta']),
  g('Tumne apna alarm doodh wale ke liye set kiya, taaki main ek Guruvaar so sakoon.', 'Love and romance', 'Small things', 'Warm', ['alarm', 'Guruvaar']),
  g('Hamare naam us shaadi ke card par saath the jo humne kabhi bheja hi nahi.', 'Love and romance', 'Marriage', 'Warm', ['card', 'naam']),

  /* ------------------------------------------------------- Sad depth */
  e('The milkman stopped coming to our lane the month my mother died.', 'Sad and heartbreak', 'Parents', 'Heavy', ['sad', 'milkman']),
  e('My father cannot drive anymore and still explains the route in detail.', 'Sad and heartbreak', 'Parents', 'Aching', ['sad', 'driving']),
  e('The ration card was lost in a flood and the replacement took nine months.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'ration']),
  e('The porter who carried our bags for a decade died with no address on file.', 'Sad and heartbreak', 'Work', 'Heavy', ['sad', 'porter']),
  h('जिस महीने माँ गईं, उस महीने दूध वाले ने हमारी गली आना बंद कर दिया।', 'Sad and heartbreak', 'माँ-बाप', 'भारी', ['दूध', 'गली']),
  h('पापा अब गाड़ी नहीं चला सकते, फिर भी रास्ता पूरे तफ़सील से समझाते हैं।', 'Sad and heartbreak', 'माँ-बाप', 'भावुक', ['गाड़ी', 'रास्ता']),
  h('बाढ़ में राशन कार्ड बह गया और नया बनने में नौ महीने लगे।', 'Sad and heartbreak', 'पैसा', 'भारी', ['राशन', 'बाढ़']),
  h('दस साल हमारे थैले ढोने वाला कुली बिना किसी पते के गुज़र गया।', 'Sad and heartbreak', 'काम', 'भारी', ['कुली', 'पता']),
  g('Jis mahine Maa gayin, us mahine doodh wale ne hamari gali aana band kar diya.', 'Sad and heartbreak', 'Parents', 'Heavy', ['doodh', 'gali']),
  g('Papa ab gaadi nahi chala sakte, phir bhi raasta poore tafseel se samjhate hain.', 'Sad and heartbreak', 'Parents', 'Aching', ['gaadi', 'raasta']),
  g('Baadh mein ration card bah gaya aur naya banne mein nau mahine lage.', 'Sad and heartbreak', 'Money', 'Heavy', ['ration', 'baadh']),
  g('Das saal hamare thailay dhone wala coolie bina kisi pate ke guzar gaya.', 'Sad and heartbreak', 'Work', 'Heavy', ['coolie', 'pata']),

  /* --------------------------------------------------------- Shayari */
  h('घंटी बजी,\nदूध रखा,\nदिन शुरू।', 'Shayari', 'तीन पंक्ति', 'सहज', ['घंटी', 'दिन']),
  h('काग़ज़ खोया,\nनाम बाक़ी,\nलाइन लंबी।', 'Shayari', 'तीन पंक्ति', 'तीखा', ['काग़ज़', 'लाइन']),
  g('Ghanti baji thi, doodh rakha tha, din shuru ho gaya.', 'Shayari', 'Two line', 'Warm', ['ghanti', 'din']),
  g('Kaghaz khoya tha, naam baaki tha, line lambi thi.', 'Shayari', 'Two line', 'Sharp', ['kaghaz', 'line']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A milkman at five in the morning is the only proof the lane is awake.', 'Quotes and thoughts', 'Cities', 'Warm', ['quotes', 'milkman']),
  e('A parent teaching you to drive is handing over more than a car.', 'Quotes and thoughts', 'Family', 'Tender', ['quotes', 'driving']),
  e('A lost ration card teaches you what a queue actually costs.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'ration']),
  e('A porter remembers your bag by its strap, not by your face.', 'Quotes and thoughts', 'Work', 'Wry', ['quotes', 'porter']),
  h('सुबह पाँच बजे का दूध वाला ही सबूत है कि गली जाग चुकी है।', 'Quotes and thoughts', 'शहर', 'कोमल', ['दूध', 'गली']),
  h('गाड़ी सिखाने वाला माँ-बाप सिर्फ़ गाड़ी नहीं सौंपता।', 'Quotes and thoughts', 'परिवार', 'कोमल', ['गाड़ी', 'माँ-बाप']),
  h('खोया राशन कार्ड सिखाता है कि एक लाइन की असली क़ीमत क्या है।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['राशन', 'लाइन']),
  g('Subah paanch baje ka doodh wala hi saboot hai ki gali jaag chuki hai.', 'Quotes and thoughts', 'Cities', 'Warm', ['doodh', 'gali']),
  g('Gaadi sikhane wala maa-baap sirf gaadi nahi saupta.', 'Quotes and thoughts', 'Family', 'Tender', ['gaadi', 'maa-baap']),
  g('Khoya ration card sikhata hai ki ek line ki asli keemat kya hai.', 'Quotes and thoughts', 'Money', 'Sharp', ['ration', 'line']),

  /* ------------------------------------------------- Life and reality */
  e('Answer the door at five. The milkman has forty more houses before six.', 'Life and reality', 'Cities', 'Warm', ['life', 'milkman']),
  e('Learn to drive from a parent in an empty lot on a Sunday.', 'Life and reality', 'Family', 'Practical', ['life', 'driving']),
  e('Keep a photocopy of the ration card in the same bag as your documents.', 'Life and reality', 'Money', 'Practical', ['life', 'ration']),
  e('Count your bags before the porter does. Then tip him properly.', 'Life and reality', 'Travel', 'Practical', ['life', 'porter']),
  e('Write the wedding guest list in a notebook, not in a phone that dies.', 'Life and reality', 'Family', 'Practical', ['life', 'card']),
  h('पाँच बजे दरवाज़ा खोलो, दूध वाले को छह से पहले चालीस घर और करने हैं।', 'Life and reality', 'शहर', 'कोमल', ['दरवाज़ा', 'घर']),
  h('रविवार को ख़ाली मैदान में माँ-बाप से गाड़ी सीखो।', 'Life and reality', 'परिवार', 'व्यावहारिक', ['मैदान', 'गाड़ी']),
  h('राशन कार्ड की फ़ोटोकॉपी उसी थैले में रखो जिसमें बाक़ी काग़ज़ हैं।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['कार्ड', 'काग़ज़']),
  h('कुली से पहले अपने थैले गिनो, फिर ठीक से पैसे दो।', 'Life and reality', 'सफ़र', 'व्यावहारिक', ['थैले', 'पैसे']),
  h('राशन दफ़्तर की लाइन में बैठकर पता चलता है कि काग़ज़ कितना भारी होता है।', 'Life and reality', 'काग़ज़ी काम', 'व्यावहारिक', ['लाइन', 'काग़ज़']),
  h('कुली की कमर पर बँधी रस्सी उसकी पहचान है, वर्दी नहीं।', 'Travel and adventure', 'रेल', 'कोमल', ['कुली', 'रस्सी']),
  g('Ration daftar ki line mein baithkar pata chalta hai ki kaghaz kitna bhaari hota hai.', 'Life and reality', 'Paperwork', 'Practical', ['line', 'kaghaz']),
  g('Coolie ki kamar par bandhi rassi uski pehchaan hai, vardi nahi.', 'Travel and adventure', 'Trains', 'Warm', ['coolie', 'rassi']),
  g('Paanch baje darwaaza kholo, doodh wale ko chhe se pehle chaalis ghar aur karne hain.', 'Life and reality', 'Cities', 'Warm', ['darwaaza', 'ghar']),
  g('Ravivaar ko khaali maidan mein maa-baap se gaadi seekho.', 'Life and reality', 'Family', 'Practical', ['maidan', 'gaadi']),
  g('Ration card ki photocopy usi thailay mein rakho jismein baaki kaghaz hain.', 'Life and reality', 'Money', 'Practical', ['card', 'kaghaz']),
  g('Coolie se pehle apne thailay gino, phir theek se paise do.', 'Life and reality', 'Travel', 'Practical', ['thailay', 'paise']),

  /* ------------------------------------------------------ Motivational */
  e('A queue is not a delay, it is the price of the paper you lost.', 'Motivational', 'Resilience', 'Direct', ['motivation', 'queue']),
  e('Let your father teach you badly. He has wanted to for years.', 'Motivational', 'Family', 'Tender', ['motivation', 'family']),
  e('Carry the bag for the last few steps and the whole journey changes hands.', 'Motivational', 'Character', 'Warm', ['motivation', 'character']),
  h('लाइन देरी नहीं है, वो उस काग़ज़ की क़ीमत है जो तुमने खोया।', 'Motivational', 'सब्र', 'स्पष्ट', ['लाइन', 'काग़ज़']),
  h('पापा को ग़लत तरीक़े से सिखाने दो, वो सालों से यही चाहते थे।', 'Motivational', 'परिवार', 'कोमल', ['पापा', 'सालों']),
  h('आख़िरी कुछ क़दम थैला उठा लो, पूरा सफ़र हाथ बदल लेता है।', 'Motivational', 'चरित्र', 'कोमल', ['थैला', 'सफ़र']),
  g('Line deri nahi hai, woh us kaghaz ki keemat hai jo tumne khoya.', 'Motivational', 'Resilience', 'Direct', ['line', 'kaghaz']),
  g('Papa ko galat tareeke se sikhane do, woh saalon se yahi chahte the.', 'Motivational', 'Family', 'Tender', ['Papa', 'saalon']),
  g('Aakhri kuch kadam thaila utha lo, poora safar haath badal leta hai.', 'Motivational', 'Character', 'Warm', ['thaila', 'safar']),

  /* -------------------------------------------------------- Aesthetic */
  e('A milkman\'s steel cans make the only sound on a winter lane.', 'Aesthetic', 'Cities', 'Warm', ['aesthetic', 'milkman']),
  e('A wedding list written in ballpoint has better handwriting than a printed card.', 'Aesthetic', 'Paperwork', 'Warm', ['aesthetic', 'notebook']),
  e('A shopkeeper\'s calculator with one dead key still adds everything up.', 'Aesthetic', 'Objects', 'Wry', ['aesthetic', 'calculator']),
  h('सर्दियों की गली में सिर्फ़ दूध के स्टील के डिब्बों की आवाज़ होती है।', 'Aesthetic', 'शहर', 'कोमल', ['डिब्बे', 'गली']),
  h('बॉल पेन से लिखी शादी की सूची की लिखाई छपे कार्ड से बेहतर होती है।', 'Aesthetic', 'काग़ज़ी काम', 'कोमल', ['सूची', 'लिखाई']),
  g('Sardiyon ki gali mein sirf doodh ke steel ke dibbon ki awaaz hoti hai.', 'Aesthetic', 'Cities', 'Warm', ['dibbe', 'gali']),
  g('Ball pen se likhi shaadi ki soochi ki likhai chhape card se behtar hoti hai.', 'Aesthetic', 'Paperwork', 'Warm', ['soochi', 'likhai']),

  /* ---------------------------------------------- Wider category band */
  e('A milk round is a business built on arriving before everyone wakes.', 'Professional and business', 'Timing', 'Wise', ['professional', 'timing']),
  e('A friend who drives you to the ration office has done the whole favour.', 'Friendship', 'Care', 'Warm', ['friendship', 'ration']),
  e('Back up the wedding list in two places. Families argue over seating for years.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'backup']),
  e('A car taught in an empty lot in first gear does not stall on the main road.', 'Cars and bikes', 'Driving', 'Practical', ['cars', 'driving']),
  e('A railway platform smells of tea, iron and somebody\'s lunch box.', 'Travel and adventure', 'Trains', 'Warm', ['travel', 'platform']),
  e('Tip the porter with your right hand and count the bags with your eyes.', 'Home and interiors', 'Etiquette', 'Practical', ['home', 'etiquette']),
  e('One notebook for lists, one pen that works. That is a whole system.', 'Minimal', 'Tools', 'Practical', ['minimal', 'tools']),
  e('The funniest thing on a platform is two porters shouting the same number.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'porter']),
  e('I will say I lost the card myself. No story about an office clerk.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('My mother wrote every wedding list in one notebook for thirty years.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Sitting in a car with the engine off after a fight is its own silence.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'solitude']),
  e('Five in the morning is the quietest prayer a city allows.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'morning']),
  e('Photograph the notebook page, not the printed card. The page has the names.', 'Photography', 'Objects', 'Warm', ['photography', 'notebook']),
  e('An overnight train and one porter who remembers your stop is enough.', 'Travel and adventure', 'Trains', 'Warm', ['travel', 'porter']),
  e('A profile that says I answer the door at five reads as a whole person.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who learns slowly from people who love me.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'humility']),
  e('I will queue twice for my own mistake and say so out loud.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'honesty']),
  e('Monsoon floods take paper first and memories second.', 'Monsoon and seasons', 'Rain', 'Heavy', ['monsoon', 'flood']),
  h('दूध का फेरा वो कारोबार है जो सबके जागने से पहले पहुँचने पर टिका है।', 'Professional and business', 'समय', 'गंभीर', ['दूध', 'कारोबार']),
  h('जो दोस्त राशन दफ़्तर तक गाड़ी छोड़ दे, उसने पूरा एहसान कर दिया।', 'Friendship', 'ख़याल', 'कोमल', ['दोस्त', 'गाड़ी']),
  h('अपने हर काग़ज़ की फ़ोटोकॉपी रखो, बाढ़ फ़ोटोकॉपी नहीं ले जाती।', 'Student life', 'दफ़्तरी काम', 'व्यावहारिक', ['काग़ज़', 'बाढ़']),
  h('ख़ाली मैदान में पहले गियर में सीखी गाड़ी मेन रोड पर बंद नहीं होती।', 'Cars and bikes', 'ड्राइविंग', 'व्यावहारिक', ['गाड़ी', 'मैदान']),
  h('एक कॉपी सूचियों के लिए, एक क़लम जो चलती है। पूरा सिस्टम इतना ही।', 'Minimal', 'औज़ार', 'व्यावहारिक', ['कॉपी', 'क़लम']),
  h('रेलवे प्लेटफ़ॉर्म से चाय, लोहे और किसी के टिफ़िन की गंध आती है।', 'Travel and adventure', 'रेल', 'कोमल', ['प्लेटफ़ॉर्म', 'चाय']),
  g('Doodh ka phera woh karobar hai jo sabke jaagne se pehle pahunchne par tika hai.', 'Professional and business', 'Timing', 'Wise', ['doodh', 'karobar']),
  g('Jo dost ration daftar tak gaadi chhod de, usne poora ehsaan kar diya.', 'Friendship', 'Care', 'Warm', ['dost', 'gaadi']),
  g('Apne har kaghaz ki photocopy rakho, baadh photocopy nahi le jaati.', 'Student life', 'Admin', 'Practical', ['kaghaz', 'baadh']),
  g('Khaali maidan mein pehle gear mein seekhi gaadi main road par band nahi hoti.', 'Cars and bikes', 'Driving', 'Practical', ['gaadi', 'maidan']),
  g('Ek copy soochiyon ke liye, ek kalam jo chalti hai. Poora system itna hi.', 'Minimal', 'Tools', 'Practical', ['copy', 'kalam']),
  g('Railway platform se chai, lohe aur kisi ke tiffin ki gandh aati hai.', 'Travel and adventure', 'Trains', 'Warm', ['platform', 'chai']),
];
