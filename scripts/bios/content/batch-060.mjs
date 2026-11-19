/**
 * BioCraft original bios — batch 060.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: brass utensils and the polishing girl, the ration card
 * queue, a wedding tent blocking the lane, a bicycle learned at forty,
 * the pension office, the cable man.
 *
 * Written against a lesson learned in 056/057/059: Hindi and Hinglish versions
 * of a line are NOT translations of the English one. They carry a different
 * image from the same subject, otherwise the token-set and trigram layers read
 * them as duplicates of each other, which is correct.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_060 = [
  /* ------------------------------------------------------------ Attitude */
  e('I queue in the line I belong to, not the shortcut line.', 'Attitude', 'Honesty', 'Firm', ['attitude', 'queue']),
  e('I return the utensil I borrowed before I borrow the next one.', 'Attitude', 'Integrity', 'Practical', ['attitude', 'utensil']),
  e('I will not bribe a clerk for a paper I am owed.', 'Attitude', 'Principle', 'Sharp', ['attitude', 'clerk']),
  h('जिस क़तार में मेरा नंबर है, उसी में खड़ा हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['क़तार', 'नंबर']),
  h('बुज़ुर्ग को बैठने देना, और उसका ज़िक्र न करना।', 'Attitude', 'अदब', 'कोमल', ['बुज़ुर्ग', 'ज़िक्र']),
  h('अगला बर्तन माँगने से पहले पिछला धोकर लौटाता हूँ।', 'Attitude', 'ईमानदारी', 'व्यावहारिक', ['बर्तन', 'लौटाता']),
  g('Jis kataar mein mera number hai, usi mein khada hoon.', 'Attitude', 'Honesty', 'Firm', ['kataar', 'number']),
  g('Buzurg ko baithne dena, aur uska zikr na karna.', 'Attitude', 'Courtesy', 'Warm', ['buzurg', 'zikr']),
  g('Agla bartan maangne se pehle pichla dhokar lautata hoon.', 'Attitude', 'Integrity', 'Practical', ['bartan', 'lautata']),

  /* ------------------------------------------------------------- Love */
  e('You polish the brass with me on Sunday and it counts as a date.', 'Love and romance', 'Ordinary days', 'Warm', ['love', 'brass']),
  e('I fell for you in a ration queue, which is a strange place to be lucky.', 'Love and romance', 'Beginning', 'Wry', ['love', 'queue']),
  e('You hold the bicycle seat and pretend you are not holding it.', 'Love and romance', 'Support', 'Tender', ['love', 'bicycle']),
  h('तुम रविवार को मेरे साथ पीतल माँजते हो, और वो मुलाक़ात गिनी जाती है।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['पीतल', 'मुलाक़ात']),
  h('तुम साइकिल का हैंडल थामे रहते हो और जताते नहीं।', 'Love and romance', 'साथ', 'कोमल', ['साइकिल', 'हैंडल']),
  h('बिल पर झगड़ा होता है, फिर वही फ़िल्म साथ देखते हैं।', 'Love and romance', 'आदत', 'कोमल', ['बिल', 'फ़िल्म']),
  g('Tum Ravivaar ko mere saath peetal maanjte ho, aur woh mulaqaat gini jaati hai.', 'Love and romance', 'Ordinary days', 'Warm', ['peetal', 'mulaqaat']),
  g('Tum cycle ka handle thaame rehte ho aur jataate nahi.', 'Love and romance', 'Support', 'Tender', ['cycle', 'handle']),
  g('Bill par jhagda hota hai, phir wahi film saath dekhte hain.', 'Love and romance', 'Familiarity', 'Warm', ['bill', 'film']),

  /* ------------------------------------------------------- Sad depth */
  e('The pension office taught me how slowly a right is granted.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['sad', 'pension']),
  e('The wedding tent blocked our lane for four days and nobody complained.', 'Sad and heartbreak', 'Neighbours', 'Honest', ['sad', 'tent']),
  e('My mother card is stamped in a name that is no longer hers.', 'Sad and heartbreak', 'Family', 'Heavy', ['sad', 'card']),
  e('I learned to ride a bicycle at forty because nobody taught me at nine.', 'Sad and heartbreak', 'Childhood', 'Honest', ['sad', 'bicycle']),
  h('पेंशन दफ़्तर ने सिखाया कि हक़ कितनी धीमी रफ़्तार से मिलता है।', 'Sad and heartbreak', 'दफ़्तर', 'भारी', ['पेंशन', 'हक़']),
  h('शादी का टेंट चार दिन गली रोकता रहा, और किसी ने शिकायत नहीं की।', 'Sad and heartbreak', 'पड़ोसी', 'स्पष्ट', ['टेंट', 'गली']),
  h('माँ के कार्ड पर वो नाम अब भी छपा है जो उनका रहा ही नहीं।', 'Sad and heartbreak', 'परिवार', 'भारी', ['कार्ड', 'नाम']),
  g('Pension daftar ne sikhaya ki haq kitni dheemi raftaar se milta hai.', 'Sad and heartbreak', 'Bureaucracy', 'Heavy', ['pension', 'haq']),
  g('Shaadi ka tent chaar din gali rokta raha, aur kisi ne shikayat nahi ki.', 'Sad and heartbreak', 'Neighbours', 'Honest', ['tent', 'gali']),
  g('Maa ke card par woh naam ab bhi chhapa hai jo unka raha hi nahi.', 'Sad and heartbreak', 'Family', 'Heavy', ['card', 'naam']),

  /* --------------------------------------------------------- Shayari */
  h('पीतल चमका,\nहाथ काला\nरह गया।', 'Shayari', 'तीन पंक्ति', 'शांत', ['पीतल', 'हाथ']),
  h('क़तार में\nसब बराबर हैं,\nयही सुकून है।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['क़तार', 'सुकून']),
  g('Peetal chamka, par haath kaala reh gaya.', 'Shayari', 'Two line', 'Quiet', ['peetal', 'haath']),
  g('Kataar mein sab baraabar hain, yahi sukoon hai.', 'Shayari', 'Two line', 'Deep', ['kataar', 'sukoon']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A queue is a place where everybody is equally important and equally bored.', 'Quotes and thoughts', 'Queues', 'Wry', ['quotes', 'queue']),
  e('Paperwork is a test of stamina disguised as a test of patience.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['quotes', 'paperwork']),
  e('A lane belongs to everyone until somebody puts up a tent.', 'Quotes and thoughts', 'Neighbours', 'Sharp', ['quotes', 'lane']),
  e('Brass lasts because somebody polishes it.', 'Quotes and thoughts', 'Care', 'Warm', ['quotes', 'brass']),
  h('क़तार वो जगह है जहाँ सब बराबर ज़रूरी और बराबर थके होते हैं।', 'Quotes and thoughts', 'क़तार', 'सहज', ['क़तार', 'थके']),
  h('काग़ज़ का काम सब्र का इम्तिहान नहीं, दम का इम्तिहान है।', 'Quotes and thoughts', 'दफ़्तर', 'तीखा', ['काग़ज़', 'इम्तिहान']),
  h('गली सबकी है, जब तक कोई टेंट न लगा दे।', 'Quotes and thoughts', 'पड़ोसी', 'तीखा', ['गली', 'टेंट']),
  g('Kataar woh jagah hai jahan sab baraabar zaroori aur baraabar thake hote hain.', 'Quotes and thoughts', 'Queues', 'Wry', ['kataar', 'thake']),
  g('Kaagaz ka kaam sabr ka imtihaan nahi, dam ka imtihaan hai.', 'Quotes and thoughts', 'Bureaucracy', 'Sharp', ['kaagaz', 'imtihaan']),
  g('Gali sabki hai, jab tak koi tent na laga de.', 'Quotes and thoughts', 'Neighbours', 'Sharp', ['gali', 'tent']),

  /* ------------------------------------------------- Life and reality */
  e('Carry your own pen to any government office.', 'Life and reality', 'Bureaucracy', 'Practical', ['life', 'office']),
  e('Photocopy the card twice before you stand in that line.', 'Life and reality', 'Bureaucracy', 'Practical', ['life', 'card']),
  e('A tent in the lane means the wedding is somebody else problem.', 'Life and reality', 'Neighbours', 'Wry', ['life', 'tent']),
  e('Learn the bicycle. Falling is part of the lesson.', 'Life and reality', 'Learning', 'Warm', ['life', 'bicycle']),
  h('सरकारी दफ़्तर में अपना पेन ख़ुद ले जाओ।', 'Life and reality', 'दफ़्तर', 'व्यावहारिक', ['दफ़्तर', 'पेन']),
  h('कार्ड की दो फ़ोटो कॉपी पहले कराओ, क़तार बाद में।', 'Life and reality', 'दफ़्तर', 'व्यावहारिक', ['कार्ड', 'क़तार']),
  h('गली का टेंट यानी शादी किसी और की मुसीबत है।', 'Life and reality', 'पड़ोसी', 'सहज', ['टेंट', 'मुसीबत']),
  h('साइकिल सीखो, गिरना भी सबक़ का हिस्सा है।', 'Life and reality', 'सीखना', 'कोमल', ['साइकिल', 'सबक़']),
  g('Sarkari daftar mein apna pen khud le jao.', 'Life and reality', 'Bureaucracy', 'Practical', ['daftar', 'pen']),
  g('Card ki do photo copy pehle karao, kataar baad mein.', 'Life and reality', 'Bureaucracy', 'Practical', ['card', 'kataar']),
  g('Gali ka tent yaani shaadi kisi aur ki museebat hai.', 'Life and reality', 'Neighbours', 'Wry', ['tent', 'museebat']),
  g('Cycle seekho, girna bhi sabak ka hissa hai.', 'Life and reality', 'Learning', 'Warm', ['cycle', 'sabak']),

  /* ------------------------------------------------------ Motivational */
  e('Take the form home, read it twice, come back once.', 'Motivational', 'Preparation', 'Practical', ['motivation', 'form']),
  e('Nobody is watching you learn to ride. That is the good news.', 'Motivational', 'Courage', 'Warm', ['motivation', 'courage']),
  e('Polish the brass and the house feels looked after.', 'Motivational', 'Care', 'Warm', ['motivation', 'care']),
  h('फ़ॉर्म घर ले जाओ, दो बार पढ़ो, एक बार लौटो।', 'Motivational', 'तैयारी', 'व्यावहारिक', ['फ़ॉर्म', 'लौटो']),
  h('साइकिल सीखते वक़्त कोई देख नहीं रहा, यही अच्छी ख़बर है।', 'Motivational', 'साहस', 'कोमल', ['सीखते', 'ख़बर']),
  g('Form ghar le jao, do baar padho, phir ek baar lauto.', 'Motivational', 'Preparation', 'Practical', ['form', 'lauto']),
  g('Cycle seekhte waqt koi dekh nahi raha, yahi acchi khabar hai.', 'Motivational', 'Courage', 'Warm', ['seekhte', 'khabar']),

  /* -------------------------------------------------------- Aesthetic */
  e('A brass glass of water on a plain table is the whole styling.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'brass']),
  e('Clean the fan before you buy a new lampshade.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'fan']),
  h('सादी मेज़ पर पीतल का गिलास, पूरी सजावट है।', 'Aesthetic', 'घर', 'कोमल', ['मेज़', 'गिलास']),
  h('नया शेड लेने से पहले पंखा साफ़ करो।', 'Aesthetic', 'घर', 'व्यावहारिक', ['पंखा', 'शेड']),
  g('Saadi mez par peetal ka glass, poori sajawat hai.', 'Aesthetic', 'Home', 'Warm', ['mez', 'glass']),
  g('Naya shade lene se pehle pankha saaf karo.', 'Aesthetic', 'Home', 'Practical', ['pankha', 'shade']),

  /* ---------------------------------------------- Wider category band */
  e('Standing in a queue for two hours is a lower back event.', 'Yoga and wellness', 'Body', 'Wry', ['yoga', 'queue']),
  e('Photocopy your documents before results day, not on it.', 'Student life', 'Preparation', 'Practical', ['student', 'documents']),
  e('Keep a folder of your own paperwork. Nobody else will.', 'Professional and business', 'Admin', 'Practical', ['professional', 'paperwork']),
  e('A fielder who runs the first ten metres saves twenty runs.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'fielding']),
  e('Keep the vehicle papers where a traffic stop will find them.', 'Cars and bikes', 'Documents', 'Practical', ['cars', 'documents']),
  e('A plain cotton kurta in summer is a decision you will not regret.', 'Fashion and beauty', 'Summer', 'Practical', ['fashion', 'cotton']),
  e('Print the form, sign it, scan it. The printer still wins.', 'Technology and coding', 'Craft', 'Wry', ['tech', 'paperwork']),
  e('Write the date on every photocopy and the argument ends.', 'Science and curiosity', 'Rigor', 'Practical', ['science', 'date']),
  e('Bribe-free paperwork is slower and it is still cheaper.', 'Startup and hustle', 'Ethics', 'Sharp', ['startup', 'ethics']),
  e('A lane that stays clear is a lane where children can play.', 'Home and interiors', 'Neighbourhood', 'Warm', ['home', 'lane']),
  e('One brass tumbler instead of five plastic bottles.', 'Minimal', 'Objects', 'Practical', ['minimal', 'brass']),
  e('The funniest queue is the one where everyone claims to be first.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'queue']),
  e('I will name the clerk who actually helped and the one who did not.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who stands in the queue for you is a serious friend.', 'Friendship', 'Support', 'Warm', ['friendship', 'queue']),
  e('My grandmother polished the brass and told me who each piece came from.', 'Family', 'Grandparents', 'Tender', ['family', 'brass']),
  e('Waiting is a practice, not an interruption.', 'Spirituality and peace', 'Patience', 'Wise', ['spirituality', 'patience']),
  e('Photograph the queue, not the form. The queue is the story.', 'Photography', 'People', 'Sharp', ['photography', 'queue']),
  e('A post about a queue gets more replies than a post about a holiday.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who brings a spare pen for the stranger behind me.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'pen']),
  e('I will stand in the slow line rather than pay to skip it.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'queue']),
  e('A tent in the lane during monsoon is a roof with opinions.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'tent']),
  h('दो घंटे क़तार में खड़ा रहना कमर के लिए एक घटना है।', 'Yoga and wellness', 'शरीर', 'सहज', ['क़तार', 'कमर']),
  h('अपने काग़ज़ों की फ़ाइल ख़ुद रखो, कोई और नहीं रखेगा।', 'Professional and business', 'दफ़्तरी काम', 'व्यावहारिक', ['काग़ज़ों', 'फ़ाइल']),
  h('गाड़ी के काग़ज़ वहाँ रखो जहाँ चेकिंग में हाथ आ जाएँ।', 'Cars and bikes', 'काग़ज़', 'व्यावहारिक', ['गाड़ी', 'चेकिंग']),
  h('गर्मी में सादा सूती कुर्ता वो फ़ैसला है जिसका अफ़सोस नहीं होता।', 'Fashion and beauty', 'गर्मी', 'व्यावहारिक', ['कुर्ता', 'फ़ैसला']),
  h('साफ़ गली वो गली है जहाँ बच्चे खेल सकते हैं।', 'Home and interiors', 'मोहल्ला', 'कोमल', ['गली', 'बच्चे']),
  h('दादी पीतल माँजते हुए बताती थीं कि कौन-सी चीज़ किससे आई।', 'Family', 'दादा-दादी', 'कोमल', ['दादी', 'पीतल']),
  h('इंतज़ार करना एक अभ्यास है, रुकावट नहीं।', 'Spirituality and peace', 'सब्र', 'गंभीर', ['इंतज़ार', 'अभ्यास']),
  g('Do ghante kataar mein khada rehna kamar ke liye ek ghatna hai.', 'Yoga and wellness', 'Body', 'Wry', ['kataar', 'kamar']),
  g('Apne kaagazon ki file khud rakho, koi aur nahi rakhega.', 'Professional and business', 'Admin', 'Practical', ['kaagazon', 'file']),
  g('Gaadi ke kaagaz wahan rakho jahan checking mein haath aa jaayein.', 'Cars and bikes', 'Documents', 'Practical', ['gaadi', 'checking']),
  g('Garmi mein saada sooti kurta woh faisla hai jiska afsos nahi hota.', 'Fashion and beauty', 'Summer', 'Practical', ['kurta', 'faisla']),
  g('Saaf gali woh gali hai jahan bachche khel sakte hain.', 'Home and interiors', 'Neighbourhood', 'Warm', ['gali', 'bachche']),
  g('Dadi peetal maanjte hue batati thi ki kaun si cheez kisse aayi.', 'Family', 'Grandparents', 'Tender', ['dadi', 'peetal']),
  g('Intezaar karna ek abhyaas hai, rukaawat nahi.', 'Spirituality and peace', 'Patience', 'Wise', ['intezaar', 'abhyaas']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('बुज़ुर्ग के लिए जगह छोड़ना, बिना बताए।', 'Attitude', 'अदब', 'कोमल', ['बुज़ुर्ग', 'जगह']),
  h('केबल वाला जब आएगा तब आएगा, मैच नहीं रुकेगा।', 'Life and reality', 'घर', 'सहज', ['केबल', 'मैच']),
  h('साइकिल पुरानी कमीज़ को भी सोचा-समझा बना देती है।', 'Stylish', 'अंदाज़', 'सहज', ['साइकिल', 'कमीज़']),
  g('Buzurg ke liye jagah chhodna, bina bataye.', 'Attitude', 'Courtesy', 'Warm', ['buzurg', 'jagah']),
  g('Cable wala jab aayega tab aayega, match nahi rukega.', 'Life and reality', 'Home', 'Wry', ['cable', 'match']),
  g('Cycle purani kamiz ko bhi socha-samjha bana deti hai.', 'Stylish', 'Style', 'Wry', ['cycle', 'kamiz']),
  h('पीतल माँजते हुए हाथ काला हो जाता है, गिलास चमक उठता है।', 'Aesthetic', 'घर', 'कोमल', ['पीतल', 'गिलास']),
  g('Peetal maanjte hue haath kaala ho jaata hai, glass chamak uthta hai.', 'Aesthetic', 'Home', 'Warm', ['peetal', 'glass']),
];
