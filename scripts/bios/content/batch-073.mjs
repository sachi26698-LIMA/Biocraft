/**
 * BioCraft original bios — batch 073.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the book binder who rebinds a school register, a father
 * cycle shop that closed, a lost admit card on exam morning, the last bus,
 * a landlord who returns the deposit late, and a lamp that has been lit for years.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_073 = [
  /* ------------------------------------------------------------ Attitude */
  e('I rebind the register instead of buying a new one.', 'Attitude', 'Thrift', 'Practical', ['attitude', 'binder']),
  e('I go back for the admit card myself instead of blaming the rickshaw.', 'Attitude', 'Accountability', 'Firm', ['attitude', 'card']),
  e('I ask for the deposit politely and then in writing.', 'Attitude', 'Patience', 'Composed', ['attitude', 'deposit']),
  h('रजिस्टर नया लेने के बजाय दोबारा बँधवा लेता हूँ।', 'Attitude', 'किफ़ायत', 'व्यावहारिक', ['रजिस्टर', 'बँधवा']),
  h('एडमिट कार्ड के लिए ख़ुद लौटता हूँ, रिक्शे को इलज़ाम नहीं देता।', 'Attitude', 'ज़िम्मेदारी', 'दृढ़', ['कार्ड', 'रिक्शे']),
  h('डिपॉज़िट पहले नरमी से माँगता हूँ, फिर लिखकर।', 'Attitude', 'सब्र', 'शांत', ['डिपॉज़िट', 'लिखकर']),
  h('जिस महीने कोई नहीं आता, उस महीने भी लौ जलती रहती है।', 'Attitude', 'वफ़ा', 'कोमल', ['लौ', 'महीने']),
  g('Register naya lene ke bajay dobara bandhwa leta hoon.', 'Attitude', 'Thrift', 'Practical', ['register', 'bandhwa']),
  g('Admit card ke liye khud lautta hoon, rickshe ko ilzaam nahi deta.', 'Attitude', 'Accountability', 'Firm', ['card', 'rickshe']),
  g('Deposit pehle narmi se maangta hoon, phir likhkar.', 'Attitude', 'Patience', 'Composed', ['deposit', 'likhkar']),
  g('Jis mahine koi nahi aata, us mahine bhi lau jalti rehti hai.', 'Attitude', 'Faithfulness', 'Warm', ['lau', 'mahine']),

  /* ------------------------------------------------------------- Love */
  e('You found my admit card in the rickshaw before I finished panicking.', 'Love and romance', 'Support', 'Warm', ['love', 'card']),
  e('We got the deposit back and spent it on the binder bill.', 'Love and romance', 'Starting out', 'Wry', ['love', 'deposit']),
  e('Your father cycle shop closed and you still fix my chain at home.', 'Love and romance', 'Family', 'Aching', ['love', 'cycle']),
  h('तुमने मेरा एडमिट कार्ड रिक्शे में मिला दिया, मेरी घबराहट खत्म होने से पहले।', 'Love and romance', 'साथ', 'कोमल', ['कार्ड', 'घबराहट']),
  h('डिपॉज़िट लौटा और हमने वो बँधाई की दुकान के बिल पर लगा दिया।', 'Love and romance', 'शुरुआत', 'सहज', ['डिपॉज़िट', 'बिल']),
  h('तुम मेरे लिए लौ जलाए रखते हो, जब मैं कहता हूँ देर होगी।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['लौ', 'देर']),
  g('Tumne mera admit card rickshe mein mila diya, meri ghabrahat khatam hone se pehle.', 'Love and romance', 'Support', 'Warm', ['card', 'ghabrahat']),
  g('Deposit lauta aur humne woh bandhai ki dukaan ke bill par laga diya.', 'Love and romance', 'Starting out', 'Wry', ['deposit', 'bill']),
  g('Tum mere liye lau jalaaye rakhte ho, jab main kehta hoon der hogi.', 'Love and romance', 'Ordinary days', 'Tender', ['lau', 'der']),

  /* ------------------------------------------------------- Sad depth */
  e('My father cycle shop closed the year the road was widened.', 'Sad and heartbreak', 'Work', 'Heavy', ['sad', 'cycle']),
  e('I lost my admit card on exam morning and found it in a rickshaw at noon.', 'Sad and heartbreak', 'School', 'Honest', ['sad', 'card']),
  e('The deposit came back eight months late and worth less.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'deposit']),
  e('The last bus of the night is where the day finally admits it was long.', 'Sad and heartbreak', 'Cities', 'Aching', ['sad', 'bus']),
  h('जिस साल सड़क चौड़ी हुई, उसी साल पिताजी की साइकिल की दुकान बंद हो गई।', 'Sad and heartbreak', 'काम', 'भारी', ['सड़क', 'दुकान']),
  h('परीक्षा की सुबह एडमिट कार्ड खो गया और दोपहर में रिक्शे से मिला।', 'Sad and heartbreak', 'स्कूल', 'स्पष्ट', ['कार्ड', 'दोपहर']),
  h('डिपॉज़िट आठ महीने देर से लौटा, और कम क़ीमत का।', 'Sad and heartbreak', 'पैसा', 'भारी', ['डिपॉज़िट', 'महीने']),
  g('Jis saal sadak chaudi hui, usi saal pitaji ki cycle ki dukaan band ho gayi.', 'Sad and heartbreak', 'Work', 'Heavy', ['sadak', 'dukaan']),
  g('Pariksha ki subah admit card kho gaya aur dopahar mein rickshe se mila.', 'Sad and heartbreak', 'School', 'Honest', ['card', 'dopahar']),
  g('Deposit aath mahine der se lauta, aur kam keemat ka.', 'Sad and heartbreak', 'Money', 'Heavy', ['deposit', 'mahine']),

  /* --------------------------------------------------------- Shayari */
  h('रजिस्टर बँधा,\nपन्ने\nपुराने रहे।', 'Shayari', 'तीन पंक्ति', 'सहज', ['रजिस्टर', 'पन्ने']),
  h('आख़िरी बस,\nऔर पूरा शहर\nसो गया।', 'Shayari', 'तीन पंक्ति', 'शांत', ['बस', 'शहर']),
  g('Register bandha, par panne purane rahe.', 'Shayari', 'Two line', 'Warm', ['register', 'panne']),
  g('Aakhri bus, aur poora shehar so gaya.', 'Shayari', 'Two line', 'Quiet', ['bus', 'shehar']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A rebound register holds the same names as before.', 'Quotes and thoughts', 'Memory', 'Warm', ['quotes', 'register']),
  e('An admit card is a small paper with a whole year behind it.', 'Quotes and thoughts', 'Exams', 'Sharp', ['quotes', 'card']),
  e('A late deposit is a loan the landlord took without asking.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'deposit']),
  e('The last bus carries the people who did not choose their hours.', 'Quotes and thoughts', 'Work', 'Wise', ['quotes', 'bus']),
  h('दोबारा बँधा रजिस्टर वही नाम रखता है जो पहले थे।', 'Quotes and thoughts', 'याद', 'कोमल', ['रजिस्टर', 'नाम']),
  h('एडमिट कार्ड छोटा काग़ज़ है, जिसके पीछे पूरा साल है।', 'Quotes and thoughts', 'परीक्षा', 'तीखा', ['कार्ड', 'साल']),
  h('देर से लौटा डिपॉज़िट वो क़र्ज़ है जो मकान मालिक ने बिना पूछे लिया।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['डिपॉज़िट', 'क़र्ज़']),
  g('Dobara bandha register wahi naam rakhta hai jo pehle the.', 'Quotes and thoughts', 'Memory', 'Warm', ['register', 'naam']),
  g('Admit card chhota kaagaz hai, jiske peeche poora saal hai.', 'Quotes and thoughts', 'Exams', 'Sharp', ['card', 'saal']),
  g('Der se lauta deposit woh karz hai jo makaan malik ne bina poochhe liya.', 'Quotes and thoughts', 'Money', 'Sharp', ['deposit', 'karz']),

  /* ------------------------------------------------- Life and reality */
  e('Keep the admit card in the bag the night before. Morning is not for searching.', 'Life and reality', 'Exams', 'Practical', ['life', 'card']),
  e('Photograph the flat before you move out. It settles deposit arguments.', 'Life and reality', 'Home', 'Practical', ['life', 'deposit']),
  e('Take the last bus once. You will learn who keeps the city running.', 'Life and reality', 'Cities', 'Warm', ['life', 'bus']),
  e('Get the register rebound for a fifth of a new one.', 'Life and reality', 'Money', 'Practical', ['life', 'binder']),
  h('एडमिट कार्ड रात में बैग में रखो, सुबह ढूँढ़ने के लिए नहीं होती।', 'Life and reality', 'परीक्षा', 'व्यावहारिक', ['कार्ड', 'रात']),
  h('घर छोड़ने से पहले फ़्लैट की तस्वीरें लो, डिपॉज़िट का झगड़ा वहीं खत्म होता है।', 'Life and reality', 'घर', 'व्यावहारिक', ['तस्वीरें', 'झगड़ा']),
  h('एक बार आख़िरी बस पकड़ो, पता चलेगा शहर किससे चलता है।', 'Life and reality', 'शहर', 'कोमल', ['बस', 'शहर']),
  h('रजिस्टर नए के पाँचवें हिस्से में दोबारा बँध जाता है।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['रजिस्टर', 'नए']),
  g('Admit card raat mein bag mein rakho, subah dhoondhne ke liye nahi hoti.', 'Life and reality', 'Exams', 'Practical', ['card', 'raat']),
  g('Ghar chhodne se pehle flat ki tasveerein lo, deposit ka jhagda wahin khatam hota hai.', 'Life and reality', 'Home', 'Practical', ['tasveerein', 'jhagda']),
  g('Ek baar aakhri bus pakdo, pata chalega shehar kisse chalta hai.', 'Life and reality', 'Cities', 'Warm', ['bus', 'shehar']),
  g('Register naye ke paanchve hisse mein dobara bandh jaata hai.', 'Life and reality', 'Money', 'Practical', ['register', 'naye']),

  /* ------------------------------------------------------ Motivational */
  e('Rebinding is cheaper than replacing and it keeps the handwriting.', 'Motivational', 'Thrift', 'Wise', ['motivation', 'thrift']),
  e('Go back for the paper. Panic has never found anything.', 'Motivational', 'Composure', 'Direct', ['motivation', 'composure']),
  e('A shop that closes is not a man who failed.', 'Motivational', 'Resilience', 'Warm', ['motivation', 'resilience']),
  h('दोबारा बँधवाना नया लेने से सस्ता है और हाथ की लिखाई बची रहती है।', 'Motivational', 'किफ़ायत', 'गंभीर', ['लिखाई', 'सस्ता']),
  h('काग़ज़ के लिए लौट जाओ, घबराहट ने आज तक कुछ नहीं ढूँढ़ा।', 'Motivational', 'शांति', 'स्पष्ट', ['घबराहट', 'लौट']),
  h('दुकान बंद होना हारा हुआ आदमी नहीं होता।', 'Motivational', 'सब्र', 'कोमल', ['दुकान', 'आदमी']),
  g('Dobara bandhwana naya lene se sasta hai aur haath ki likhai bachi rehti hai.', 'Motivational', 'Thrift', 'Wise', ['likhai', 'sasta']),
  g('Kaagaz ke liye laut jao, ghabrahat ne aaj tak kuch nahi dhoondha.', 'Motivational', 'Composure', 'Direct', ['ghabrahat', 'laut']),
  g('Dukaan band hona haara hua aadmi nahi hota.', 'Motivational', 'Resilience', 'Warm', ['dukaan', 'aadmi']),

  /* -------------------------------------------------------- Aesthetic */
  e('A cloth-bound register with gold lettering is furniture, not stationery.', 'Aesthetic', 'Paperwork', 'Warm', ['aesthetic', 'register']),
  h('कपड़े से बँधा सुनहरे अक्षरों वाला रजिस्टर स्टेशनरी नहीं, फ़र्नीचर है।', 'Aesthetic', 'काग़ज़', 'कोमल', ['रजिस्टर', 'अक्षरों']),
  h('अंधेरी खिड़की में एक दीया पूरी गली बदल देता है।', 'Aesthetic', 'शहर', 'कोमल', ['दीया', 'गली']),
  g('Kapde se bandha sunhare aksharon wala register stationery nahi, furniture hai.', 'Aesthetic', 'Paperwork', 'Warm', ['register', 'aksharon']),
  g('Andheri khidki mein ek diya poori gali badal deta hai.', 'Aesthetic', 'Cities', 'Warm', ['diya', 'gali']),

  /* ---------------------------------------------- Wider category band */
  e('Waiting for the last bus after a double shift is a health decision.', 'Yoga and wellness', 'Rest', 'Practical', ['yoga', 'bus']),
  e('Keep the admit card and the exam centre address in one envelope.', 'Student life', 'Exams', 'Practical', ['student', 'envelope']),
  e('A binder who can rebind a register has a customer for thirty years.', 'Professional and business', 'Craft', 'Wise', ['professional', 'craft']),
  e('A last-over finish and a last bus are the same kind of hope.', 'Cricket and sports', 'Cricket', 'Wry', ['cricket', 'bus']),
  e('A puncture at eleven at night is why the spare tube matters.', 'Cars and bikes', 'Repairs', 'Practical', ['cars', 'puncture']),
  e('A collared shirt at midnight looks like somebody still means it.', 'Fashion and beauty', 'Style', 'Wry', ['fashion', 'style']),
  e('Scan the admit card, mail it to yourself, and it can never be lost.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'backup']),
  e('Read the deposit clause before signing, not after moving out.', 'Science and curiosity', 'Rigor', 'Practical', ['science', 'rigor']),
  e('Deposit returns are a customer-service test disguised as paperwork.', 'Startup and hustle', 'Trust', 'Sharp', ['startup', 'trust']),
  e('One good bag, one envelope for papers, one place for keys.', 'Minimal', 'Possessions', 'Practical', ['minimal', 'possessions']),
  e('A shirt that survives a night bus is worth three that do not.', 'Stylish', 'Style', 'Practical', ['stylish', 'shirt']),
  e('The funniest thing on a last bus is the argument about the fare.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'bus']),
  e('I will say in writing that the deposit is late and the amount is short.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who goes back to the rickshaw stand with you is not a small friend.', 'Friendship', 'Support', 'Warm', ['friendship', 'support']),
  e('My father closed the shop and taught me how to fix a chain anyway.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('The last bus at midnight is full and completely alone at once.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'bus']),
  e('Photograph the closed shutter of a shop you loved. It is a record.', 'Photography', 'Cities', 'Aching', ['photography', 'shutter']),
  e('Arrive in a city by the last bus and you will see it undressed.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'bus']),
  e('A post about a lost admit card gets more replies than a rank list.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who keeps one envelope for every paper that matters.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'envelope']),
  e('I will not shout at a landlord for a deposit I asked for in writing.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'deposit']),
  e('A last bus in monsoon arrives wet and leaves later.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'bus']),
  h('डबल शिफ़्ट के बाद आख़िरी बस का इंतज़ार सेहत का फ़ैसला है।', 'Yoga and wellness', 'आराम', 'व्यावहारिक', ['शिफ़्ट', 'बस']),
  h('एडमिट कार्ड और परीक्षा केंद्र का पता एक ही लिफ़ाफ़े में रखो।', 'Student life', 'परीक्षा', 'व्यावहारिक', ['कार्ड', 'लिफ़ाफ़े']),
  h('जो रजिस्टर दोबारा बाँध सके, उसका ग्राहक तीस साल रहता है।', 'Professional and business', 'हुनर', 'गंभीर', ['रजिस्टर', 'ग्राहक']),
  h('रात ग्यारह बजे पंचर ही वजह है कि अतिरिक्त ट्यूब रखनी चाहिए।', 'Cars and bikes', 'मरम्मत', 'व्यावहारिक', ['पंचर', 'ट्यूब']),
  h('दरवाज़े पर रखा दीया घर की सबसे सस्ती अच्छी चीज़ है।', 'Home and interiors', 'घर', 'कोमल', ['दीया', 'घर']),
  h('आधी रात की आख़िरी बस भरी भी होती है और अकेली भी।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['बस', 'अकेली']),
  g('Double shift ke baad aakhri bus ka intezaar sehat ka faisla hai.', 'Yoga and wellness', 'Rest', 'Practical', ['shift', 'bus']),
  g('Admit card aur pariksha kendra ka pata ek hi lifafe mein rakho.', 'Student life', 'Exams', 'Practical', ['card', 'lifafe']),
  g('Jo register dobara baandh sake, uska grahak tees saal rehta hai.', 'Professional and business', 'Craft', 'Wise', ['register', 'grahak']),
  g('Raat gyarah baje puncture hi wajah hai ki atirikt tube rakhni chahiye.', 'Cars and bikes', 'Repairs', 'Practical', ['puncture', 'tube']),
  g('Darwaze par rakha diya ghar ki sabse sasti acchi cheez hai.', 'Home and interiors', 'Home', 'Warm', ['diya', 'ghar']),
  g('Aadhi raat ki aakhri bus bhari bhi hoti hai aur akeli bhi.', 'Alone and loneliness', 'Solitude', 'Honest', ['bus', 'akeli']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('बत्ती ख़त्म हो जाए तो नई लगा देना, दीया बुझने मत देना।', 'Attitude', 'वफ़ा', 'कोमल', ['बत्ती', 'दीया']),
  h('साइकिल की दुकान, टँगे टायर फल जैसे, सबसे अच्छी दुकान है।', 'Aesthetic', 'शहर', 'कोमल', ['टायर', 'दुकान']),
  g('Jis mahine koi nahi aata, us mahine bhi diya jalta rehta hai.', 'Attitude', 'Faithfulness', 'Warm', ['diya', 'mahine']),
  g('Cycle ki dukaan, tange tyre phal jaise, sabse acchi dukaan hai.', 'Aesthetic', 'Cities', 'Warm', ['tyre', 'dukaan']),
  g('Batti khatam ho jaaye toh nayi laga dena, diya bujhne mat dena.', 'Attitude', 'Faithfulness', 'Warm', ['batti', 'diya']),
  h('जलती लौ के पास बैठना भी एक तरह का इंतज़ार है।', 'Spirituality and peace', 'अभ्यास', 'गंभीर', ['लौ', 'इंतज़ार']),
];
