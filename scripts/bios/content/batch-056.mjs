/**
 * BioCraft original bios — batch 056.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 35 HI / 31 HG.
 * New subject matter: a wedding tailors bill, the bus conductor, a rented shop,
 * the neighbour with a loud TV, learning to negotiate a salary.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_056 = [
  /* ------------------------------------------------------------ Attitude */
  e('I pay the tailor before the deadline, not after the reminder.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'tailor']),
  e('I say the salary number first and hold it.', 'Attitude', 'Negotiation', 'Firm', ['attitude', 'salary']),
  e('I do not raise my voice at a shop that is closing.', 'Attitude', 'Restraint', 'Composed', ['attitude', 'restraint']),
  h('दर्ज़ी को याद दिलाने से पहले पैसे दे देता हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['दर्ज़ी', 'पैसे']),
  h('मैं वेतन का आँकड़ा पहले बोलता हूँ और टिका रहता हूँ।', 'Attitude', 'मोल-भाव', 'दृढ़', ['वेतन', 'आँकड़ा']),
  h('कंडक्टर से अदब से बोलता हूँ, उसका दिन मेरे से लंबा है।', 'Attitude', 'अदब', 'कोमल', ['कंडक्टर', 'दिन']),
  g('Darzi ko yaad dilane se pehle paise de deta hoon.', 'Attitude', 'Integrity', 'Firm', ['darzi', 'paise']),
  g('Main vetan ka aankda pehle bolta hoon aur tika rehta hoon.', 'Attitude', 'Negotiation', 'Firm', ['vetan', 'aankda']),
  g('Conductor se adab se bolta hoon, uska din mere se lamba hai.', 'Attitude', 'Courtesy', 'Warm', ['conductor', 'din']),

  /* ------------------------------------------------------------- Love */
  e('You defend me in rooms I am not standing in.', 'Love and romance', 'Loyalty', 'Tender', ['love', 'loyalty']),
  e('We are saving for a sofa and it feels like a whole future.', 'Love and romance', 'Building', 'Warm', ['love', 'saving']),
  e('You never make me perform my best self on a bad day.', 'Love and romance', 'Acceptance', 'Tender', ['love', 'acceptance']),
  h('तुम मेरी बचाव उन कमरों में करते हो जहाँ मैं नहीं होता।', 'Love and romance', 'निष्ठा', 'कोमल', ['बचाव', 'कमरों']),
  h('हम सोफ़े के लिए बचा रहे हैं और यह पूरा भविष्य लगता है।', 'Love and romance', 'बनाना', 'कोमल', ['सोफ़े', 'भविष्य']),
  h('मुझे हमारी बहसें पसंद हैं क्योंकि वो फ़ैसले पर खत्म होती हैं।', 'Love and romance', 'परिपक्वता', 'गंभीर', ['बहसें', 'फ़ैसले']),
  g('Tum meri bachaav un kamron mein karte ho jahan main nahi hota.', 'Love and romance', 'Loyalty', 'Tender', ['bachaav', 'kamron']),
  g('Hum sofa ke liye bacha rahe hain aur yeh poora bhavishya lagta hai.', 'Love and romance', 'Building', 'Warm', ['sofa', 'bhavishya']),
  g('Mujhe humari bahasein pasand hain kyunki woh faisle par khatam hoti hain.', 'Love and romance', 'Maturity', 'Wise', ['bahasein', 'faisle']),

  /* ------------------------------------------------------- Sad depth */
  e('The neighbour TV became the sound of a year I would like back.', 'Sad and heartbreak', 'Home', 'Wry', ['sad', 'neighbour']),
  e('A rented shop closes faster than it opened.', 'Sad and heartbreak', 'Business', 'Heavy', ['sad', 'shop']),
  e('I negotiated my salary badly and learned more than I earned.', 'Sad and heartbreak', 'Work', 'Honest', ['sad', 'salary']),
  e('My father apologised to the tailor for being late, and I watched.', 'Sad and heartbreak', 'Parents', 'Quiet', ['sad', 'parents']),
  h('पड़ोसी का टीवी उस साल की आवाज़ बन गया जो मुझे वापस चाहिए।', 'Sad and heartbreak', 'घर', 'सहज', ['पड़ोसी', 'साल']),
  h('किराए की दुकान खुलने से ज़्यादा तेज़ बंद होती है।', 'Sad and heartbreak', 'काम', 'भारी', ['दुकान', 'किराए']),
  h('मैंने वेतन पर बुरी बात की और कमाई से ज़्यादा सीखा।', 'Sad and heartbreak', 'काम', 'स्पष्ट', ['वेतन', 'सीखा']),
  g('Padosi ka TV us saal ki awaaz ban gaya jo mujhe wapas chahiye.', 'Sad and heartbreak', 'Home', 'Wry', ['padosi', 'saal']),
  g('Kiraaye ki dukaan khulne se zyada tez band hoti hai.', 'Sad and heartbreak', 'Business', 'Heavy', ['dukaan', 'kiraaye']),
  g('Maine vetan par buri baat ki aur kamai se zyada seekha.', 'Sad and heartbreak', 'Work', 'Honest', ['vetan', 'seekha']),

  /* --------------------------------------------------------- Shayari */
  h('बस की खिड़की\nसे देखा\nशहर बदल रहा था।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['बस', 'शहर']),
  h('तेरे नाम का\nबिल\nअब भी अनचुका है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['बिल', 'नाम']),
  g('Bus ki khidki se dekha shehar badal raha tha.', 'Shayari', 'Two line', 'Deep', ['bus', 'shehar']),
  g('Tere naam ka bill ab bhi anchuka hai.', 'Shayari', 'Two line', 'Aching', ['bill', 'naam']),

  /* -------------------------------------------------- Quotes and ideas */
  e('The first number you say decides the room you sit in.', 'Quotes and thoughts', 'Negotiation', 'Sharp', ['quotes', 'negotiation']),
  e('A bus conductor has a better map of the city than any app.', 'Quotes and thoughts', 'Cities', 'Warm', ['quotes', 'city']),
  e('A tailor with a deadline is more reliable than a promise.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'tailor']),
  e('Neighbours are the only people who can hear your bad days.', 'Quotes and thoughts', 'Community', 'Wise', ['quotes', 'neighbours']),
  h('जो पहला आँकड़ा तुम बोलते हो, वही तुम्हारी जगह तय करता है।', 'Quotes and thoughts', 'मोल-भाव', 'तीखा', ['आँकड़ा', 'जगह']),
  h('बस कंडक्टर के पास किसी ऐप से बेहतर नक़्शा होता है।', 'Quotes and thoughts', 'शहर', 'कोमल', ['कंडक्टर', 'नक़्शा']),
  h('तारीख़ वाला दर्ज़ी वादे से ज़्यादा भरोसेमंद है।', 'Quotes and thoughts', 'हुनर', 'गंभीर', ['दर्ज़ी', 'वादे']),
  g('Jo pehla aankda tum bolte ho, wahi tumhari jagah tay karta hai.', 'Quotes and thoughts', 'Negotiation', 'Sharp', ['aankda', 'jagah']),
  g('Bus conductor ke paas kisi app se behtar naqsha hota hai.', 'Quotes and thoughts', 'Cities', 'Warm', ['conductor', 'naqsha']),
  g('Taarikh wala darzi waade se zyada bharosemand hai.', 'Quotes and thoughts', 'Craft', 'Wise', ['darzi', 'waade']),

  /* ------------------------------------------------- Life and reality */
  e('Never rent a shop because the street looked busy on a Sunday.', 'Life and reality', 'Business', 'Sharp', ['life', 'shop']),
  e('The loud TV next door is a negotiation, not a war.', 'Life and reality', 'Neighbours', 'Practical', ['life', 'neighbours']),
  e('Learn what your work is worth before you learn to ask for it.', 'Life and reality', 'Money', 'Wise', ['life', 'money']),
  h('रविवार को भीड़ दिखी थी, इसलिए दुकान किराए पर मत लो।', 'Life and reality', 'काम', 'तीखा', ['दुकान', 'भीड़']),
  h('पड़ोसी का तेज़ टीवी बातचीत है, जंग नहीं।', 'Life and reality', 'पड़ोसी', 'व्यावहारिक', ['टीवी', 'बातचीत']),
  h('माँगने से पहले सीखो कि तुम्हारे काम की क़ीमत क्या है।', 'Life and reality', 'पैसा', 'गंभीर', ['काम', 'क़ीमत']),
  g('Ravivaar ko bheed dikhi thi, isliye dukaan kiraaye par mat lo.', 'Life and reality', 'Business', 'Sharp', ['dukaan', 'bheed']),
  g('Padosi ka tez TV baatcheet hai, jung nahi.', 'Life and reality', 'Neighbours', 'Practical', ['TV', 'baatcheet']),
  g('Maangne se pehle seekho ki tumhare kaam ki keemat kya hai.', 'Life and reality', 'Money', 'Wise', ['kaam', 'keemat']),

  /* ------------------------------------------------------ Motivational */
  e('Rehearse the number out loud before the interview.', 'Motivational', 'Preparation', 'Practical', ['motivation', 'interview']),
  e('You will hear no more often if you ask properly.', 'Motivational', 'Courage', 'Direct', ['motivation', 'asking']),
  h('इंटरव्यू से पहले आँकड़ा ज़ोर से बोलकर प्रैक्टिस करो।', 'Motivational', 'तैयारी', 'व्यावहारिक', ['आँकड़ा', 'प्रैक्टिस']),
  h('ठीक से माँगोगे तो ज़्यादा बार ना सुनोगे।', 'Motivational', 'साहस', 'स्पष्ट', ['माँगोगे', 'सुनोगे']),
  h('बंद दुकान किराए का सबक़ है, तुम पर फ़ैसला नहीं।', 'Motivational', 'सब्र', 'कोमल', ['दुकान', 'सबक़']),
  g('Interview se pehle aankda zor se bolkar practice karo.', 'Motivational', 'Preparation', 'Practical', ['aankda', 'practice']),
  g('Theek se maangoge toh zyada baar na sunoge.', 'Motivational', 'Courage', 'Direct', ['maangoge', 'sunoge']),
  g('Band dukaan kiraaye ka sabak hai, tum par faisla nahi.', 'Motivational', 'Resilience', 'Warm', ['dukaan', 'sabak']),

  /* -------------------------------------------------------- Aesthetic */
  e('A well-fitted plain kurta is a whole wedding wardrobe.', 'Aesthetic', 'Tailoring', 'Practical', ['aesthetic', 'kurta']),
  e('A shop sign painted by hand outlives three printed ones.', 'Aesthetic', 'Craft', 'Warm', ['aesthetic', 'sign']),
  h('ढंग से सिला सादा कुर्ता पूरी शादी की अलमारी है।', 'Aesthetic', 'सिलाई', 'व्यावहारिक', ['कुर्ता', 'अलमारी']),
  h('गली की रोशनी रोकने वाले पर्दे नींद बदल देते हैं।', 'Aesthetic', 'घर', 'व्यावहारिक', ['पर्दे', 'नींद']),
  g('Dhang se sila saada kurta poori shaadi ki almari hai.', 'Aesthetic', 'Tailoring', 'Practical', ['kurta', 'almari']),
  g('Gali ki roshni rokne wale parde neend badal dete hain.', 'Aesthetic', 'Home', 'Practical', ['parde', 'neend']),

  /* ---------------------------------------------- Wider category band */
  e('Learn the marking scheme and the exam becomes a conversation.', 'Student life', 'Exams', 'Practical', ['student', 'scheme']),
  e('Negotiate the salary once, properly, and never again in the corridor.', 'Professional and business', 'Negotiation', 'Direct', ['professional', 'salary']),
  e('A bowler who bowls to a plan is worth two who bowl fast.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'bowling']),
  e('Learn what the warning light means before it becomes expensive.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'warning']),
  e('Buy the fabric, then pay the tailor. The order matters.', 'Fashion and beauty', 'Tailoring', 'Practical', ['fashion', 'tailoring']),
  e('Never deploy on a Friday evening. Nothing good lives there.', 'Technology and coding', 'Craft', 'Wry', ['tech', 'deploy']),
  e('Write the assumption down before you test it, or you will move it.', 'Science and curiosity', 'Method', 'Wise', ['science', 'method']),
  e('Your rent decides your runway more than your ambition does.', 'Startup and hustle', 'Money', 'Sharp', ['startup', 'money']),
  e('One good kurta and one good shirt is a wardrobe.', 'Minimal', 'Wardrobe', 'Practical', ['minimal', 'kurta']),
  e('Have the tailor shorten the sleeve and the shirt becomes yours.', 'Stylish', 'Tailoring', 'Practical', ['stylish', 'tailoring']),
  e('The funniest arguments happen over a bill that is only slightly wrong.', 'Funny and comedy', 'Everyday', 'Wry', ['funny', 'bill']),
  e('I will tell you what the market pays instead of what you hope.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A neighbour who turns the TV down is a friend you have not met.', 'Friendship', 'Neighbours', 'Warm', ['friendship', 'neighbours']),
  e('My father taught me to apologise to people who serve us.', 'Family', 'Parents', 'Warm', ['family', 'parents']),
  e('Eating alone on a bus is a skill and a small freedom.', 'Alone and loneliness', 'Solitude', 'Warm', ['alone', 'bus']),
  e('A quiet room is a practice, not a luxury.', 'Spirituality and peace', 'Stillness', 'Wise', ['spirituality', 'stillness']),
  e('Photograph the shop sign before the shop changes hands.', 'Photography', 'Cities', 'Warm', ['photography', 'shop']),
  e('Take the ordinary bus once and you will see your own city.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'bus']),
  e('A shop with a handwritten board gets my money first.', 'Instagram profiles', 'Approach', 'Warm', ['instagram', 'honest']),
  e('I keep every bill in a folder and sleep better for it.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'bills']),
  e('I will not discount my work to make a room comfortable.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'worth']),
  e('A street that floods in monsoon is a street with cheap rent for a reason.', 'Monsoon and seasons', 'Rain', 'Sharp', ['monsoon', 'rent']),
  h('बस की खिड़की मुफ़्त ध्यान है, अगर ऐसे देखो।', 'Yoga and wellness', 'ठहराव', 'कोमल', ['खिड़की', 'ध्यान']),
  h('पहले कपड़ा ख़रीदो, फिर दर्ज़ी को पैसे दो, क्रम मायने रखता है।', 'Fashion and beauty', 'सिलाई', 'व्यावहारिक', ['कपड़ा', 'दर्ज़ी']),
  h('किराया तुम्हारी उड़ान तय करता है, महत्वाकांक्षा नहीं।', 'Startup and hustle', 'पैसा', 'तीखा', ['किराया', 'महत्वाकांक्षा']),
  h('मेरे पिता ने सिखाया कि जो हमारी सेवा करते हैं, उनसे माफ़ी माँगो।', 'Family', 'माँ-बाप', 'कोमल', ['पिता', 'माफ़ी']),
  h('शांत कमरा एक अभ्यास है, विलासिता नहीं।', 'Spirituality and peace', 'ठहराव', 'गंभीर', ['कमरा', 'अभ्यास']),
  g('Bus ki khidki muft dhyan hai, agar aise dekho.', 'Yoga and wellness', 'Stillness', 'Warm', ['khidki', 'dhyan']),
  g('Pehle kapda kharido, phir darzi ko paise do, kram maayne rakhta hai.', 'Fashion and beauty', 'Tailoring', 'Practical', ['kapda', 'darzi']),
  g('Kiraaya tumhari udaan tay karta hai, mahatvakaansha nahi.', 'Startup and hustle', 'Money', 'Sharp', ['kiraaya', 'udaan']),
  g('Mere pitaji ne sikhaya ki jo humari seva karte hain, unse maafi maango.', 'Family', 'Parents', 'Warm', ['pitaji', 'maafi']),
  g('Shaant kamra ek abhyaas hai, vilasita nahi.', 'Spirituality and peace', 'Stillness', 'Wise', ['kamra', 'abhyaas']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('कंडक्टर को नमस्ते कहो, वो रोज़ सैकड़ों चेहरे देखता है।', 'Attitude', 'अदब', 'कोमल', ['कंडक्टर', 'नमस्ते']),
  h('हमारी बहसें फ़ैसले पर खत्म होती हैं, इसलिए पसंद हैं।', 'Love and romance', 'परिपक्वता', 'गंभीर', ['बहसें', 'फ़ैसले']),
  h('दर्ज़ी का बिल और तारीख़, दोनों संभालकर रखो।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['बिल', 'तारीख़']),
  h('बंद दुकान किराए का सबक़ है, तुम्हारे बारे में फ़ैसला नहीं।', 'Motivational', 'सब्र', 'कोमल', ['दुकान', 'सबक़']),
  h('मोटे पर्दे वाला किराए का कमरा सोने लायक होता है।', 'Home and interiors', 'घर', 'व्यावहारिक', ['पर्दे', 'कमरा']),
  h('रोज़ बस पकड़ो, अपना शहर नए सिरे से दिखेगा।', 'Travel and adventure', 'शहर', 'कोमल', ['बस', 'शहर']),
  g('Conductor ko namaste kaho, woh roz sau chehre dekhta hai.', 'Attitude', 'Courtesy', 'Warm', ['conductor', 'namaste']),
  g('Humari bahasein faisle par khatam hoti hain, isliye pasand hain.', 'Love and romance', 'Maturity', 'Wise', ['bahasein', 'faisle']),
  g('Darzi ka bill aur taarikh, dono sambhalkar rakho.', 'Life and reality', 'Money', 'Practical', ['bill', 'taarikh']),
  g('Band dukaan kiraaye ka sabak hai, tumhare baare mein faisla nahi.', 'Motivational', 'Resilience', 'Warm', ['dukaan', 'sabak']),
  g('Mote parde wala kiraaye ka kamra sone laayak hota hai.', 'Home and interiors', 'Rent', 'Practical', ['parde', 'kamra']),
  g('Roz bus pakdo, apna shehar naye sire se dikhega.', 'Travel and adventure', 'Cities', 'Warm', ['bus', 'shehar']),
];
