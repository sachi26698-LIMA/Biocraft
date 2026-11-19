/**
 * BioCraft original bios — batch 049.
 * Allocation from scripts/bios/balance.mjs: 33 EN / 38 HI / 39 HG.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_049 = [
  /* ------------------------------------------------------------ Attitude */
  e('I am not required to be convenient for anyone.', 'Attitude', 'Boundaries', 'Firm', ['attitude', 'boundaries']),
  e('I keep my standards high and my voice low.', 'Attitude', 'Composure', 'Composed', ['attitude', 'standards']),
  h('मुझे किसी के लिए सुविधाजनक होना ज़रूरी नहीं है।', 'Attitude', 'सीमाएं', 'दृढ़', ['सुविधाजनक', 'ज़रूरी']),
  h('मानक ऊँचे रखता हूँ, आवाज़ नीची।', 'Attitude', 'संयम', 'शांत', ['मानक', 'आवाज़']),
  h('जिसे हर बहस जीतनी हो, वो कमरा पहले ही हार चुका है।', 'Attitude', 'समझ', 'तीखा', ['बहस', 'कमरा']),
  g('Mujhe kisi ke liye suvidhajanak hona zaroori nahi hai.', 'Attitude', 'Boundaries', 'Firm', ['suvidhajanak', 'zaroori']),
  g('Manak oonche rakhta hoon, awaaz dheemi.', 'Attitude', 'Composure', 'Composed', ['manak', 'dheemi']),
  g('Jise har bahas jeetni ho, woh kamra pehle hi haar chuka hai.', 'Attitude', 'Wisdom', 'Sharp', ['bahas', 'kamra']),

  /* ------------------------------------------------------------- Love */
  e('You are the person I want to do absolutely nothing with.', 'Love and romance', 'Comfort', 'Warm', ['love', 'comfort']),
  e('I love you in the way I defend you when you are not there.', 'Love and romance', 'Loyalty', 'Tender', ['love', 'loyalty']),
  e('We are not a story. We are a household.', 'Love and romance', 'Real love', 'Wise', ['love', 'household']),
  h('तुम वो हो जिसके साथ मुझे कुछ भी नहीं करना है।', 'Love and romance', 'आराम', 'कोमल', ['कुछ', 'साथ']),
  h('तुमसे प्यार वो है जो मैं तुम्हारी ग़ैरमौजूदगी में बचाकर रखता हूँ।', 'Love and romance', 'निष्ठा', 'कोमल', ['प्यार', 'ग़ैरमौजूदगी']),
  h('हम कहानी नहीं, घर हैं।', 'Love and romance', 'सच्चा प्यार', 'गंभीर', ['कहानी', 'घर']),
  h('तुम्हारे साथ रोज़ की छोटी बातें भी यादगार लगती हैं।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['बातें', 'यादगार']),
  g('Tum woh ho jiske saath mujhe kuch bhi nahi karna hai.', 'Love and romance', 'Comfort', 'Warm', ['kuch', 'saath']),
  g('Tumse pyaar woh hai jo main tumhari gairmaujoodgi mein bachakar rakhta hoon.', 'Love and romance', 'Loyalty', 'Tender', ['pyaar', 'gairmaujoodgi']),
  g('Hum kahani nahi, ghar hain.', 'Love and romance', 'Real love', 'Wise', ['kahani', 'ghar']),

  /* ------------------------------------------------------- Sad depth */
  e('Some days the memory arrives before the morning does.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'memory']),
  e('I have made peace, which is not the same as being fine.', 'Sad and heartbreak', 'Acceptance', 'Wise', ['sad', 'acceptance']),
  h('मैं तुम्हारा इंतज़ार नहीं कर रहा, बस बदलने की जल्दी नहीं है।', 'Sad and heartbreak', 'लालसा', 'स्पष्ट', ['इंतज़ार', 'जल्दी']),
  h('कुछ दिनों में याद सुबह से पहले आ जाती है।', 'Sad and heartbreak', 'याद', 'भावुक', ['याद', 'सुबह']),
  h('मैंने सुलह कर ली है, पर इसका मतलब ठीक होना नहीं है।', 'Sad and heartbreak', 'स्वीकृति', 'गंभीर', ['सुलह', 'ठीक']),
  g('Main tumhara intezaar nahi kar raha, bas badalne ki jaldi nahi hai.', 'Sad and heartbreak', 'Longing', 'Honest', ['intezaar', 'jaldi']),
  g('Kuch dinon mein yaad subah se pehle aa jaati hai.', 'Sad and heartbreak', 'Memory', 'Aching', ['yaad', 'subah']),
  g('Maine sulah kar li hai, par iska matlab theek hona nahi hai.', 'Sad and heartbreak', 'Acceptance', 'Wise', ['sulah', 'theek']),

  /* --------------------------------------------------------- Shayari */
  h('तेरे बिना\nशहर वही है,\nबस मैं नहीं हूँ।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शहर', 'बिना']),
  h('तेरी आवाज़\nअब भी\nमेरी नींद में है।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['आवाज़', 'नींद']),
  g('Tere bina shehar wahi hai, bas main nahi hoon.', 'Shayari', 'Two line', 'Aching', ['shehar', 'bina']),
  g('Teri awaaz ab bhi meri neend mein hai.', 'Shayari', 'Two line', 'Romantic', ['awaaz', 'neend']),

  /* -------------------------------------------------- Quotes and ideas */
  e('Never take advice from someone who has never been wrong in public.', 'Quotes and thoughts', 'Humility', 'Sharp', ['quotes', 'humility']),
  e('A calm person in a crisis is doing three things you cannot see.', 'Quotes and thoughts', 'Composure', 'Wise', ['quotes', 'calm']),
  h('जिसने कभी सबके सामने ग़लती नहीं की, उससे सलाह मत लो।', 'Quotes and thoughts', 'विनम्रता', 'तीखा', ['सलाह', 'ग़लती']),
  h('संकट में शांत इंसान तीन काम कर रहा होता है जो दिखते नहीं।', 'Quotes and thoughts', 'संयम', 'गंभीर', ['संकट', 'काम']),
  h('भरा कैलेंडर भरी ज़िंदगी नहीं होता।', 'Quotes and thoughts', 'प्राथमिकता', 'तीखा', ['कैलेंडर', 'ज़िंदगी']),
  g('Jisne kabhi sabke saamne galti nahi ki, usse salah mat lo.', 'Quotes and thoughts', 'Humility', 'Sharp', ['salah', 'galti']),
  g('Sankat mein shaant insaan teen kaam kar raha hota hai jo dikhte nahi.', 'Quotes and thoughts', 'Composure', 'Wise', ['sankat', 'kaam']),
  g('Bhara calendar bhari zindagi nahi hota.', 'Quotes and thoughts', 'Priorities', 'Sharp', ['calendar', 'zindagi']),

  /* ------------------------------------------------- Life and reality */
  e('A boring routine is what lets the interesting days happen.', 'Life and reality', 'Habits', 'Wise', ['life', 'routine']),
  e('Learn to cook three things well enough to feed a friend.', 'Life and reality', 'Skills', 'Practical', ['life', 'cooking']),
  h('उबाऊ दिनचर्या ही राज़दार दिनों को जगह देती है।', 'Life and reality', 'आदतें', 'गंभीर', ['दिनचर्या', 'दिनों']),
  h('तीन चीज़ें ढंग से बनाना सीखो, दोस्त को खिला सको।', 'Life and reality', 'हुनर', 'व्यावहारिक', ['चीज़ें', 'दोस्त']),
  g('Ubaau dincharya hi raazdaar dinon ko jagah deti hai.', 'Life and reality', 'Habits', 'Wise', ['dincharya', 'jagah']),
  g('Teen cheezein dhang se banana seekho, dost ko khila sako.', 'Life and reality', 'Skills', 'Practical', ['cheezein', 'seekho']),

  /* ------------------------------------------------------ Motivational */
  e('Progress is quiet and boredom is its signature sound.', 'Motivational', 'Patience', 'Wise', ['motivation', 'patience']),
  e('Do the work and skip the announcement.', 'Motivational', 'Discipline', 'Direct', ['motivation', 'discipline']),
  e('Your first hundred attempts are the tuition fee.', 'Motivational', 'Craft', 'Wry', ['motivation', 'craft']),
  h('तरक्की शांत होती है, उसकी आवाज़ बोरियत है।', 'Motivational', 'सब्र', 'गंभीर', ['तरक्की', 'आवाज़']),
  h('काम करो, और ऐलान छोड़ दो।', 'Motivational', 'अनुशासन', 'स्पष्ट', ['काम', 'ऐलान']),
  g('Taraqqi shaant hoti hai, uski awaaz boriyat hai.', 'Motivational', 'Patience', 'Wise', ['taraqqi', 'awaaz']),
  g('Kaam karo, aur ailaan chhod do.', 'Motivational', 'Discipline', 'Direct', ['kaam', 'ailaan']),

  /* -------------------------------------------------------- Aesthetic */
  e('A plant that is slightly too big makes a room look lived in.', 'Aesthetic', 'Plants', 'Warm', ['aesthetic', 'plants']),
  e('Keep one thing out that has no purpose except that it is lovely.', 'Aesthetic', 'Objects', 'Composed', ['aesthetic', 'objects']),
  h('थोड़ा बड़ा पौधा कमरे को जीता-जागता दिखाता है।', 'Aesthetic', 'पौधे', 'कोमल', ['पौधा', 'कमरे']),
  h('सादी दीवार पर छपा कपड़ा ही कला है।', 'Aesthetic', 'घर', 'कोमल', ['दीवार', 'कपड़ा']),
  h('एक चीज़ ऐसी रखो जिसका कोई मतलब न हो, बस सुंदर हो।', 'Aesthetic', 'चीज़ें', 'शांत', ['चीज़', 'सुंदर']),
  g('Thoda bada paudha kamre ko jeeta-jaagta dikhata hai.', 'Aesthetic', 'Plants', 'Warm', ['paudha', 'kamre']),
  g('Saadi deewar par chhapa kapda hi kala hai.', 'Aesthetic', 'Home', 'Warm', ['deewar', 'kapda']),
  g('Ek cheez aisi rakho jiska koi matlab na ho, bas sundar ho.', 'Aesthetic', 'Objects', 'Composed', ['cheez', 'sundar']),

  /* ---------------------------------------------- Wider category band */
  e('Breathing slower is the cheapest medicine available.', 'Yoga and wellness', 'Breath', 'Practical', ['yoga', 'breath']),
  e('A five minute stretch at noon saves your afternoon.', 'Yoga and wellness', 'Movement', 'Practical', ['yoga', 'movement']),
  e('Read the syllabus once and the panic drops by half.', 'Student life', 'Exams', 'Practical', ['student', 'syllabus']),
  e('One honest status email beats five vague ones.', 'Professional and business', 'Communication', 'Direct', ['professional', 'status']),
  e('A clean windscreen is a safety feature.', 'Cars and bikes', 'Safety', 'Practical', ['cars', 'safety']),
  e('Write the log line before you write the code.', 'Technology and coding', 'Debugging', 'Practical', ['tech', 'debugging']),
  e('Curiosity plus patience is a decent method under any budget.', 'Science and curiosity', 'Method', 'Wise', ['science', 'method']),
  e('Talk to fewer customers deeply rather than many politely.', 'Startup and hustle', 'Customers', 'Direct', ['startup', 'customers']),
  e('Fix the hinge and the door stops annoying you.', 'Home and interiors', 'Maintenance', 'Practical', ['home', 'maintenance']),
  e('I will tell you what you need to hear, gently and once.', 'Savage and bold', 'Directness', 'Sharp', ['savage', 'directness']),
  e('The person who can sit with grief is the person worth keeping.', 'Deep and emotional', 'Depth', 'Warm', ['deep', 'grief']),
  e('Post the boring attempt and people will trust you more.', 'Instagram profiles', 'Process', 'Warm', ['instagram', 'process']),
  e('I keep my promises quiet and my opinions loud.', 'Personality and identity', 'Identity', 'Wry', ['personality', 'identity']),
  e('I choose my people slowly and keep them a long time.', 'Self-respect', 'Standards', 'Composed', ['selfrespect', 'standards']),
  e('Family is who you call when the news is bad.', 'Family', 'Support', 'Warm', ['family', 'support']),
  e('A friend who checks on you after a funeral is a keeper.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'loyalty']),
  e('Being alone is not a punishment handed out to the unloved.', 'Alone and loneliness', 'Solitude', 'Wise', ['alone', 'solitude']),
  e('Silence is the beginning of every practice worth having.', 'Spirituality and peace', 'Stillness', 'Wise', ['spirituality', 'stillness']),
  e('A city is best explored on a Sunday morning when it sleeps.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'cities']),
  h('दोपहर में पाँच मिनट का खिंचाव पूरी शाम बचा लेता है।', 'Yoga and wellness', 'गति', 'व्यावहारिक', ['खिंचाव', 'शाम']),
  h('सिलेबस एक बार पढ़ लो, आधी घबराहट चली जाएगी।', 'Student life', 'परीक्षा', 'व्यावहारिक', ['सिलेबस', 'घबराहट']),
  h('एक साफ़ स्टेटस मेल पाँचे ऊपरी मेल से बेहतर है।', 'Professional and business', 'संचार', 'स्पष्ट', ['स्टेटस', 'मेल']),
  h('जो गेंद मिली है वो खेलो, जिसकी सोच थी वो नहीं।', 'Cricket and sports', 'क्रिकेट', 'गंभीर', ['गेंद', 'खेलो']),
  h('साफ़ विंडस्क्रीन भी एक सुरक्षा इंतज़ाम है।', 'Cars and bikes', 'सुरक्षा', 'व्यावहारिक', ['विंडस्क्रीन', 'सुरक्षा']),
  h('कोड से पहले लॉग लिखो, बाद में भागते फिरोगे नहीं।', 'Technology and coding', 'डिबगिंग', 'व्यावहारिक', ['कोड', 'लॉग']),
  h('कम ग्राहकों से गहरी बात करो, ज़्यादा से सिर्फ़ औपचारिक नहीं।', 'Startup and hustle', 'ग्राहक', 'स्पष्ट', ['ग्राहक', 'बात']),
  h('दरवाज़े का कब्ज़ा ठीक करो, दरवाज़ा परेशान करना बंद करेगा।', 'Home and interiors', 'रखरखाव', 'व्यावहारिक', ['कब्ज़ा', 'दरवाज़ा']),
  g('Dopahar mein paanch minute ka khinchaav poori shaam bacha leta hai.', 'Yoga and wellness', 'Movement', 'Practical', ['khinchaav', 'shaam']),
  g('Syllabus dhang se ek baar padh lo, aadhi ghabrahat chali jayegi.', 'Student life', 'Exams', 'Practical', ['syllabus', 'ghabrahat']),
  g('Ek saaf status mail paanche oopri mail se behtar hai.', 'Professional and business', 'Communication', 'Direct', ['status', 'mail']),
  g('Jo gend mili hai woh khelo, jiski soch thi woh nahi.', 'Cricket and sports', 'Cricket', 'Wise', ['gend', 'khelo']),
  g('Saaf windscreen bhi ek suraksha intezaam hai.', 'Cars and bikes', 'Safety', 'Practical', ['windscreen', 'suraksha']),
  g('Code se pehle log likho, baad mein bhaagte phiroge nahi.', 'Technology and coding', 'Debugging', 'Practical', ['code', 'log']),
  g('Kam grahakon se gehri baat karo, zyada se sirf aupcharik nahi.', 'Startup and hustle', 'Customers', 'Direct', ['grahak', 'baat']),
  g('Darwaze ka kabza theek karo, darwaza pareshaan karna band karega.', 'Home and interiors', 'Maintenance', 'Practical', ['kabza', 'darwaza']),

  /* --------------------------------------- Rebalance + replacement lines */
  h('साँस जितनी धीमी, दिन उतना लंबा लगता है।', 'Yoga and wellness', 'साँस', 'कोमल', ['साँस', 'दिन']),
  h('जो दिनचर्या तुम्हें थका दे, वो तुम्हारी नहीं।', 'Life and reality', 'आदतें', 'स्पष्ट', ['दिनचर्या', 'थका']),
  h('पुराने जूते और नई सोच, यही सबसे अच्छा मेल है।', 'Stylish', 'अंदाज़', 'सहज', ['जूते', 'सोच']),
  h('छत पर जाकर आसमान देखो, मीटिंग का ग़ुस्सा उतर जाएगा।', 'Home and interiors', 'घर', 'व्यावहारिक', ['छत', 'आसमान']),
  h('जो काम दो मिनट में हो जाए, उसे टालो मत।', 'Motivational', 'आदत', 'स्पष्ट', ['काम', 'टालो']),
  h('बातचीत में सबसे क़ीमती चीज़ है रुक कर सुनना।', 'Deep and emotional', 'गहराई', 'कोमल', ['बातचीत', 'सुनना']),
  h('दोस्ती का पैमाना मदद नहीं, मौजूदगी है।', 'Friendship', 'निष्ठा', 'कोमल', ['दोस्ती', 'मौजूदगी']),
  g('Saans jitni dheemi, din utna lamba lagta hai.', 'Yoga and wellness', 'Breath', 'Warm', ['saans', 'din']),
  g('Jo dincharya tumhein thaka de, woh tumhari nahi.', 'Life and reality', 'Habits', 'Direct', ['dincharya', 'thaka']),
  g('Purane joote aur nayi soch, yahi sabse accha mel hai.', 'Stylish', 'Details', 'Wry', ['joote', 'soch']),
  g('Chhat par jaakar aasman dekho, meeting ka gussa utar jayega.', 'Home and interiors', 'Home', 'Practical', ['chhat', 'aasman']),
  g('Jo kaam do minute mein ho jaye, use taalo mat.', 'Motivational', 'Habits', 'Direct', ['kaam', 'taalo']),
  g('Baatcheet mein sabse keemti cheez hai ruk kar sunna.', 'Deep and emotional', 'Depth', 'Warm', ['baatcheet', 'sunna']),
  g('Dosti ka paimana madad nahi, maujoodgi hai.', 'Friendship', 'Loyalty', 'Warm', ['dosti', 'maujoodgi']),
  g('Purane kapde aur nayi niyat, dono dhang ke hon toh kaafi hai.', 'Personality and identity', 'Identity', 'Composed', ['kapde', 'niyat']),
];
