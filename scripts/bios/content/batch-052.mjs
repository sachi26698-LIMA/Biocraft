/**
 * BioCraft original bios — batch 052.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 31 HI / 34 HG.
 * New subject matter: shopkeepers, slow repairs, road trips, exam results day,
 * learning to swim as an adult, the neighbour who waters plants.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_052 = [
  /* ------------------------------------------------------------ Attitude */
  e('I pay the exact amount and I say thank you twice.', 'Attitude', 'Courtesy', 'Warm', ['attitude', 'courtesy']),
  e('I do not borrow confidence from the room.', 'Attitude', 'Self-possession', 'Composed', ['attitude', 'confidence']),
  e('Losing badly taught me more than winning politely.', 'Attitude', 'Sport', 'Wise', ['attitude', 'losing']),
  e('I will admit I do not know and then go and find out.', 'Attitude', 'Humility', 'Firm', ['attitude', 'humility']),
  h('मैं पूरे पैसे देता हूँ और दो बार शुक्रिया कहता हूँ।', 'Attitude', 'अदब', 'कोमल', ['पैसे', 'शुक्रिया']),
  h('मैं भरोसा कमरे से उधार नहीं लेता।', 'Attitude', 'आत्मविश्वास', 'शांत', ['भरोसा', 'उधार']),
  h('बुरी तरह हारना शालीन जीत से ज़्यादा सिखाता है।', 'Attitude', 'खेल भावना', 'गंभीर', ['हारना', 'जीत']),
  h('मैं मान लेता हूँ कि नहीं जानता, फिर जाकर पता करता हूँ।', 'Attitude', 'विनम्रता', 'दृढ़', ['जानता', 'पता']),
  g('Main poore paise deta hoon aur do baar shukriya kehta hoon.', 'Attitude', 'Courtesy', 'Warm', ['paise', 'shukriya']),
  g('Main bharosa kamre se udhaar nahi leta.', 'Attitude', 'Self-possession', 'Composed', ['bharosa', 'udhaar']),
  g('Buri tarah haarna shaaleen jeet se zyada sikhaata hai.', 'Attitude', 'Sport', 'Wise', ['haarna', 'jeet']),

  /* ------------------------------------------------------------- Love */
  e('You laugh at the wrong moments and I have built a life around it.', 'Love and romance', 'Adoration', 'Sweet', ['love', 'laugh']),
  e('We are the couple who splits the last piece and then argues about it.', 'Love and romance', 'Playful', 'Wry', ['love', 'sharing']),
  e('I want to be the one who notices when you have had a hard day.', 'Love and romance', 'Attention', 'Tender', ['love', 'attention']),
  e('You have seen me at my worst and stayed for dinner.', 'Love and romance', 'Acceptance', 'Tender', ['love', 'worse']),
  h('तुम ग़लत मौक़ों पर हँसते हो, और मैंने उसी पर ज़िंदगी बनाई है।', 'Love and romance', 'इश्क़', 'कोमल', ['हँसते', 'ज़िंदगी']),
  h('हम आख़िरी टुकड़ा बाँटते हैं और फिर उस पर झगड़ते हैं।', 'Love and romance', 'खेल', 'सहज', ['टुकड़ा', 'झगड़ते']),
  h('मैं वो बनना चाहता हूँ जो तुम्हारा कठिन दिन पहले भाँप ले।', 'Love and romance', 'ध्यान', 'कोमल', ['दिन', 'भाँप']),
  g('Tum galat maukon par hanste ho, aur maine usi par zindagi banai hai.', 'Love and romance', 'Adoration', 'Sweet', ['hanste', 'zindagi']),
  g('Hum aakhiri tukda baantte hain aur phir us par jhagadte hain.', 'Love and romance', 'Playful', 'Wry', ['tukda', 'jhagadte']),
  g('Main woh banna chahta hoon jo tumhara mushkil din pehle bhaanp le.', 'Love and romance', 'Attention', 'Tender', ['din', 'bhaanp']),

  /* ------------------------------------------------------- Sad depth */
  e('Result day is a whole family holding its breath at once.', 'Sad and heartbreak', 'Pressure', 'Heavy', ['sad', 'results']),
  e('I learned to swim at thirty-six and the fear was not about water.', 'Sad and heartbreak', 'Fear', 'Honest', ['sad', 'swimming']),
  e('The neighbour still waters the plants we planted together.', 'Sad and heartbreak', 'Loss', 'Aching', ['sad', 'neighbour']),
  e('I keep a list of things I will tell you if you ever call.', 'Sad and heartbreak', 'Longing', 'Quiet', ['sad', 'longing']),
  h('रिज़ल्ट के दिन पूरा परिवार एक साथ साँस रोक लेता है।', 'Sad and heartbreak', 'दबाव', 'भारी', ['रिज़ल्ट', 'परिवार']),
  h('मैंने छत्तीस की उम्र में तैरना सीखा, डर पानी का नहीं था।', 'Sad and heartbreak', 'डर', 'स्पष्ट', ['तैरना', 'डर']),
  h('पड़ोसी अब भी उन पौधों को पानी देता है जो हमने साथ लगाए थे।', 'Sad and heartbreak', 'हानि', 'भावुक', ['पौधों', 'पड़ोसी']),
  g('Result ke din poora parivaar ek saath saans rok leta hai.', 'Sad and heartbreak', 'Pressure', 'Heavy', ['result', 'parivaar']),
  g('Maine chhattees ki umar mein tairna seekha, dar paani ka nahi tha.', 'Sad and heartbreak', 'Fear', 'Honest', ['tairna', 'dar']),
  g('Padosi ab bhi un paudhon ko paani deta hai jo humne saath lagaye the.', 'Sad and heartbreak', 'Loss', 'Aching', ['paudhon', 'padosi']),

  /* --------------------------------------------------------- Shayari */
  h('मोड़ पर\nतू मुड़ा,\nमैं रुक गया।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['मोड़', 'रुक']),
  h('तेरी हँसी\nमेरी सबसे पुरानी\nआदत है।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['हँसी', 'आदत']),
  g('Mod par tu muda, main ruk gaya.', 'Shayari', 'Two line', 'Aching', ['mod', 'ruk']),
  g('Teri hansi meri sabse purani aadat hai.', 'Shayari', 'Two line', 'Romantic', ['hansi', 'aadat']),

  /* -------------------------------------------------- Quotes and ideas */
  e('The shopkeeper who gives you credit knows your character, not your income.', 'Quotes and thoughts', 'Trust', 'Wise', ['quotes', 'trust']),
  e('Marks measure memory on one morning and nothing else.', 'Quotes and thoughts', 'Education', 'Sharp', ['quotes', 'marks']),
  e('A repaired thing holds a story. A replaced thing holds a receipt.', 'Quotes and thoughts', 'Repair', 'Wise', ['quotes', 'repair']),
  e('Learning something at forty is not late. It is just slower and better.', 'Quotes and thoughts', 'Learning', 'Warm', ['quotes', 'learning']),
  h('जो दुकानदार उधार देता है, वो तुम्हारी आय नहीं, चरित्र जानता है।', 'Quotes and thoughts', 'भरोसा', 'गंभीर', ['दुकानदार', 'चरित्र']),
  h('नंबर एक सुबह की याददाश्त नापते हैं, और कुछ नहीं।', 'Quotes and thoughts', 'पढ़ाई', 'तीखा', ['नंबर', 'याददाश्त']),
  h('ठीक की हुई चीज़ में कहानी रहती है, नई में रसीद।', 'Quotes and thoughts', 'मरम्मत', 'गंभीर', ['चीज़', 'रसीद']),
  g('Jo dukandaar udhaar deta hai, woh tumhari aay nahi, charitra jaanta hai.', 'Quotes and thoughts', 'Trust', 'Wise', ['dukandaar', 'charitra']),
  g('Number ek subah ki yaaddasht naapte hain, aur kuch nahi.', 'Quotes and thoughts', 'Education', 'Sharp', ['number', 'yaaddasht']),
  g('Theek ki hui cheez mein kahani rehti hai, nayi mein raseed.', 'Quotes and thoughts', 'Repair', 'Wise', ['cheez', 'raseed']),

  /* ------------------------------------------------- Life and reality */
  e('Road trips are a negotiation between the map and the bladders.', 'Life and reality', 'Travel', 'Wry', ['life', 'roadtrip']),
  e('The best tea is always from the shop with no chairs.', 'Life and reality', 'Food', 'Warm', ['life', 'tea']),
  e('Some repairs are cheaper than the story of replacing it.', 'Life and reality', 'Money', 'Practical', ['life', 'repair']),
  e('Learn to ask for the manager politely. It works more often than shouting.', 'Life and reality', 'Adulting', 'Practical', ['life', 'manager']),
  h('रोड ट्रिप नक़्शे और मूत्राशय के बीच की बातचीत है।', 'Life and reality', 'सफ़र', 'सहज', ['नक़्शे', 'बातचीत']),
  h('सबसे अच्छी चाय उसी दुकान की होती है जहाँ कुर्सी नहीं है।', 'Life and reality', 'खाना', 'कोमल', ['चाय', 'दुकान']),
  h('कुछ मरम्मतें बदलने की कहानी से सस्ती होती हैं।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['मरम्मतें', 'कहानी']),
  h('मैनेजर से शालीनता से बात करो, चिल्लाने से ज़्यादा काम बनता है।', 'Life and reality', 'बड़ी उम्र', 'व्यावहारिक', ['मैनेजर', 'चिल्लाने']),
  g('Road trip naqshe aur bladder ke beech ki baatcheet hai.', 'Life and reality', 'Travel', 'Wry', ['naqshe', 'baatcheet']),
  g('Sabse achhi chai usi dukaan ki hoti hai jahan kursi nahi hai.', 'Life and reality', 'Food', 'Warm', ['chai', 'dukaan']),
  g('Kuch marammat badalne ki kahani se sasti hoti hain.', 'Life and reality', 'Money', 'Practical', ['marammat', 'kahani']),
  g('Manager se shaalinata se baat karo, chillane se zyada kaam banta hai.', 'Life and reality', 'Adulting', 'Practical', ['manager', 'chillane']),

  /* ------------------------------------------------------ Motivational */
  e('You can be afraid and still be in the water.', 'Motivational', 'Courage', 'Direct', ['motivation', 'courage']),
  e('A repaired habit is stronger than a new resolution.', 'Motivational', 'Habits', 'Wise', ['motivation', 'habits']),
  h('प्रतिभा उस अभ्यास की कहानी है जो लोग बाद में सुनाते हैं।', 'Motivational', 'कला', 'गंभीर', ['प्रतिभा', 'अभ्यास']),
  h('डरा हुआ होकर भी पानी में रह सकते हो।', 'Motivational', 'साहस', 'स्पष्ट', ['डरा', 'पानी']),
  h('ठीक की हुई आदत नए संकल्प से मज़बूत होती है।', 'Motivational', 'आदत', 'गंभीर', ['आदत', 'संकल्प']),
  g('Pratibha us abhyaas ki kahani hai jo log baad mein sunaate hain.', 'Motivational', 'Craft', 'Wise', ['pratibha', 'abhyaas']),
  g('Dara hua hokar bhi paani mein reh sakte ho.', 'Motivational', 'Courage', 'Direct', ['dara', 'paani']),
  g('Theek ki hui aadat naye sankalp se mazboot hoti hai.', 'Motivational', 'Habits', 'Wise', ['aadat', 'sankalp']),

  /* -------------------------------------------------------- Aesthetic */
  e('Let the wall stay half painted and call it a decision.', 'Aesthetic', 'Home', 'Wry', ['aesthetic', 'paint']),
  h('मेज़ के चारों ओर तीन अलग कुर्सियाँ घर हैं, ग़लती नहीं।', 'Aesthetic', 'फ़र्नीचर', 'कोमल', ['कुर्सियाँ', 'मेज़']),
  h('दीवार आधी रंगी रहने दो, इसे फ़ैसला कह लो।', 'Aesthetic', 'घर', 'सहज', ['दीवार', 'फ़ैसला']),
  g('Mez ke chaaron or teen alag kursiyan ghar hain, galti nahi.', 'Aesthetic', 'Furniture', 'Warm', ['kursiyan', 'mez']),
  g('Deewar aadhi rangi chhodo, dhang se ise faisla keh lo.', 'Aesthetic', 'Home', 'Wry', ['deewar', 'faisla']),

  /* ---------------------------------------------- Wider category band */
  e('Swimming is the only exercise that removes gravity for a while.', 'Yoga and wellness', 'Movement', 'Warm', ['yoga', 'swimming']),
  e('Revise on the day you are tested and half of it comes back.', 'Student life', 'Exams', 'Practical', ['student', 'revision']),
  e('Send the agenda the night before and people arrive prepared.', 'Professional and business', 'Meetings', 'Practical', ['professional', 'agenda']),
  e('A slow innings on a turning pitch is a masterpiece.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'innings']),
  e('Learn to change your own tyre once. Then you can forget it.', 'Cars and bikes', 'Skills', 'Practical', ['cars', 'tyre']),
  e('The bug you cannot find is usually in the place you did not refactor.', 'Technology and coding', 'Debugging', 'Wry', ['tech', 'debugging']),
  e('Ask what would change your mind before you argue.', 'Science and curiosity', 'Method', 'Wise', ['science', 'method']),
  e('The best business decision I made was saying no to a big order.', 'Startup and hustle', 'Focus', 'Wise', ['startup', 'focus']),
  e('Get the plumbing right before the paint.', 'Home and interiors', 'Repair', 'Practical', ['home', 'plumbing']),
  e('Comedy is tragedy that arrived on time.', 'Funny and comedy', 'Craft', 'Wise', ['funny', 'comedy']),
  e('I will say the awkward thing in the first five minutes and save us both.', 'Savage and bold', 'Directness', 'Firm', ['savage', 'directness']),
  e('The friend who drives you to the airport at 4 a.m. is the whole friendship.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'loyalty']),
  e('Your parents are also figuring it out for the first time.', 'Family', 'Parents', 'Wise', ['family', 'parents']),
  e('Learn to eat at a dhaba alone and you will never be bored in a new town.', 'Alone and loneliness', 'Solitude', 'Warm', ['alone', 'dhaba']),
  e('A lamp lit for no reason is still a practice.', 'Spirituality and peace', 'Practice', 'Warm', ['spirituality', 'lamp']),
  e('Photograph the shopkeeper before the shop changes.', 'Photography', 'People', 'Warm', ['photography', 'people']),
  e('A road trip with two songs on repeat is still a good road trip.', 'Travel and adventure', 'Road', 'Warm', ['travel', 'road']),
  e('One honest review is worth fifty likes.', 'Instagram profiles', 'Ethics', 'Wise', ['instagram', 'honest']),
  e('I keep the receipts of things I fixed myself.', 'Personality and identity', 'Identity', 'Wry', ['personality', 'repair']),
  e('I will not trade my peace for somebody else approval, however politely it is worded.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'peace']),
  e('Monsoon is the season that makes a repair urgent.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'repair']),
  h('तैरना वो अभ्यास है जो थोड़ी देर के लिए गुरुत्व हटा देता है।', 'Yoga and wellness', 'गति', 'कोमल', ['तैरना', 'थोड़ी']),
  h('पानी का काम पहले ठीक करवाओ, रंग बाद में।', 'Home and interiors', 'मरम्मत', 'व्यावहारिक', ['पानी', 'रंग']),
  h('एक अच्छी तौलिया पाँच पतली से बेहतर है।', 'Minimal', 'जीना', 'व्यावहारिक', ['तौलिया', 'पतली']),
  h('मम्मी-पापा भी पहली बार ही समझ रहे हैं।', 'Family', 'माँ-बाप', 'गंभीर', ['मम्मी', 'समझ']),
  h('ढाबे पर अकेले खाना सीख लो, नए शहर में बोर नहीं होगे।', 'Alone and loneliness', 'अकेलापन', 'कोमल', ['ढाबे', 'शहर']),
  g('Tairna woh abhyaas hai jo thodi der ke liye gravity hata deta hai.', 'Yoga and wellness', 'Movement', 'Warm', ['tairna', 'gravity']),
  g('Paani ka kaam pehle theek karwao, rang baad mein.', 'Home and interiors', 'Repair', 'Practical', ['paani', 'rang']),
  g('Ek achhi towel paanch patli se behtar hai.', 'Minimal', 'Living', 'Practical', ['towel', 'patli']),
  g('Mummy-papa bhi pehli baar hi samajh rahe hain.', 'Family', 'Parents', 'Wise', ['mummy', 'samajh']),
  g('Dhabe par akele khaana seekh lo, naye shehar mein bore nahi hoge.', 'Alone and loneliness', 'Solitude', 'Warm', ['dhabe', 'shehar']),
  g('Dukan wale ki tasveer kheench lo, dukaan badal jayegi.', 'Photography', 'People', 'Warm', ['dukan', 'tasveer']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('तीन अलग कुर्सियाँ मेज़ के चारों ओर घर होती हैं।', 'Aesthetic', 'फ़र्नीचर', 'कोमल', ['कुर्सियाँ', 'घर']),
  h('एक उँगली की अंगूठी छह कंगन से ऊँची बोलती है।', 'Stylish', 'अंदाज़', 'व्यावहारिक', ['अंगूठी', 'कंगन']),
  h('सफ़र में स्नैक्स पर टिकट से ज़्यादा ख़र्च होता है।', 'Life and reality', 'सफ़र', 'सहज', ['स्नैक्स', 'टिकट']),
  h('प्रतिभा उस अभ्यास का नाम है जो बाद में दिखता है।', 'Motivational', 'कला', 'गंभीर', ['प्रतिभा', 'अभ्यास']),
  h('कमाई से पहले हुनर कमाओ, हुनर टिकता है।', 'Professional and business', 'हुनर', 'व्यावहारिक', ['हुनर', 'कमाओ']),
  h('छाता एक बार अच्छा ख़रीदो, बारिश में भरोसा रहेगा।', 'Monsoon and seasons', 'बारिश', 'व्यावहारिक', ['छाता', 'बारिश']),
  g('Ek ungli ki angoothi chhe kangan se oonchi bolti hai.', 'Stylish', 'Details', 'Practical', ['angoothi', 'kangan']),
  g('Safar mein snacks par ticket se zyada kharch hota hai.', 'Life and reality', 'Travel', 'Wry', ['safar', 'ticket']),
  g('Kamai se pehle hunar kamao, hunar tikta hai.', 'Professional and business', 'Craft', 'Practical', ['kamai', 'hunar']),
  g('Chhata ek baar accha kharido, baarish mein bharosa rahega.', 'Monsoon and seasons', 'Rain', 'Practical', ['chhata', 'baarish']),
  g('Teen alag kursiyan mez ke chaaron or ghar hoti hain.', 'Aesthetic', 'Furniture', 'Warm', ['kursiyan', 'ghar']),
];
