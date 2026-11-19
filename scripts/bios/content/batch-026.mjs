/**
 * BioCraft original bios — batch 026.
 * Proportional 40/30/30: leaders + mid-field.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_026 = [
  /* -------------------------------------------------------------- Attitude */
  e('My no is a full stop, not a comma.', 'Attitude', 'Boundaries', 'Terse', ['attitude', 'no']),
  e('I am not interested in being the plot in your story.', 'Attitude', 'Independence', 'Cool', ['attitude', 'independence']),
  e('Do not confuse my composure with agreement.', 'Attitude', 'Composure', 'Sharp', ['attitude', 'composure']),
  e('I would rather be quiet than be quoted wrongly.', 'Attitude', 'Restraint', 'Wise', ['attitude', 'silence']),
  e('I do not need to win. I need to be done.', 'Attitude', 'Directness', 'Dry', ['attitude', 'closure']),
  e('Standards are not arrogance. They are just a list.', 'Attitude', 'Standards', 'Practical', ['attitude', 'standards']),
  e('My peace took work. Do not treat it as your right.', 'Attitude', 'Peace', 'Firm', ['attitude', 'peace']),
  e('Unimpressed and unbothered are different things. I am both.', 'Attitude', 'Composure', 'Witty', ['attitude', 'composure']),
  e('I choose silence because it is the cheapest truth.', 'Attitude', 'Restraint', 'Wise', ['attitude', 'truth']),
  h('मेरा "ना" पूर्ण विराम है, अल्पविराम नहीं।', 'Attitude', 'सीमाएं', 'स्पष्ट', ['ना', 'विराम']),
  h('मैं तुम्हारी कहानी का पात्र बनने के लिए नहीं हूँ।', 'Attitude', 'आज़ादी', 'शांत', ['कहानी', 'पात्र']),
  h('मेरे शांत रहने को सहमति मत समझो।', 'Attitude', 'संयम', 'तीखा', ['शांत', 'सहमति']),
  h('मुझे जीतना नहीं, खत्म करना है।', 'Attitude', 'स्पष्टता', 'स्पष्ट', ['जीतना', 'खत्म']),
  h('मेरी शांति मेहनत से बनी है, वो तुम्हारा हक़ नहीं।', 'Attitude', 'शांति', 'दृढ़', ['शांति', 'हक़']),
  g('Mera na poorna viraam hai, alpviraam nahi.', 'Attitude', 'Boundaries', 'Terse', ['na', 'viraam']),
  g('Mujhe jeetna nahi, khatam karna hai.', 'Attitude', 'Directness', 'Dry', ['jeetna', 'khatam']),
  g('Meri shaanti mehnat se bani hai, woh tumhara haq nahi.', 'Attitude', 'Peace', 'Firm', ['shaanti', 'haq']),

  /* ------------------------------------------------------ Love and romance */
  e('I want the version of love that survives a grocery list.', 'Love and romance', 'Real love', 'Warm', ['love', 'everyday']),
  e('You are the person I bring good news to first.', 'Love and romance', 'Closeness', 'Sweet', ['love', 'news']),
  e('I do not love you quietly. I just do it carefully.', 'Love and romance', 'Devotion', 'Tender', ['love', 'care']),
  e('We are better together and honest about the rest.', 'Love and romance', 'Real love', 'Honest', ['love', 'honesty']),
  e('Your laugh is the sound my week is built around.', 'Love and romance', 'Admiration', 'Sweet', ['love', 'laughter']),
  e('I want to be someone you can be tired around.', 'Love and romance', 'Comfort', 'Tender', ['love', 'comfort']),
  h('मुझे वो प्यार चाहिए जो किराने की सूची भी झेल ले।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['प्यार', 'सूची']),
  h('तुम वो हो जिसे मैं अच्छी ख़बर सबसे पहले बताता हूँ।', 'Love and romance', 'नज़दीकी', 'कोमल', ['ख़बर', 'पहले']),
  h('मैं चुपचाप प्यार नहीं करता, सँभालकर करता हूँ।', 'Love and romance', 'निभाना', 'सहज', ['चुपचाप', 'सँभाल']),
  h('मैं वो बनना चाहता हूँ जिसके सामने थका जा सके।', 'Love and romance', 'सुकून', 'कोमल', ['थका', 'सुकून']),
  g('Mujhe woh pyaar chahiye jo kiraane ki soochi bhi jhel le.', 'Love and romance', 'Real love', 'Warm', ['pyaar', 'soochi']),
  g('Main chupchaap pyaar nahi karta, sambhaalkar karta hoon.', 'Love and romance', 'Devotion', 'Tender', ['chupchaap', 'sambhaalkar']),
  g('Main woh banna chahta hoon jiske saamne thaka ja sake.', 'Love and romance', 'Comfort', 'Tender', ['thaka', 'saamne']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I am not sad about you. I am sad about the version we planned.', 'Sad and heartbreak', 'Loss', 'Honest', ['sad', 'loss']),
  e('The anniversary came and I did not send anything.', 'Sad and heartbreak', 'Restraint', 'Quiet', ['sad', 'anniversary']),
  e('You taught me how to leave properly. That was useful.', 'Sad and heartbreak', 'Growth', 'Wry', ['sad', 'growth']),
  e('I miss the version of me that trusted easily.', 'Sad and heartbreak', 'Identity', 'Raw', ['sad', 'identity']),
  h('मैं तुम्हारे लिए नहीं, हमारी बनी हुई योजना के लिए उदास हूँ।', 'Sad and heartbreak', 'हानि', 'स्पष्ट', ['योजना', 'उदास']),
  h('सालगिरह आई और मैंने कुछ नहीं भेजा।', 'Sad and heartbreak', 'संयम', 'शांत', ['सालगिरह', 'भेजा']),
  h('तुमने मुझे ढंग से जाना सिखाया, वो काम आया।', 'Sad and heartbreak', 'विकास', 'सहज', ['सीखा', 'काम']),
  h('मुझे उस पुराने "मैं" की याद आती है जो आसानी से भरोसा करता था।', 'Sad and heartbreak', 'पहचान', 'भावुक', ['भरोसा', 'याद']),
  g('Main tumhare liye nahi, hamari bani hui yojana ke liye udaas hoon.', 'Sad and heartbreak', 'Loss', 'Honest', ['yojana', 'udaas']),
  g('Saalgirah aayi aur maine kuch nahi bheja.', 'Sad and heartbreak', 'Restraint', 'Quiet', ['saalgirah', 'bheja']),
  g('Mujhe us purane main ki yaad aati hai jo aasani se bharosa karta tha.', 'Sad and heartbreak', 'Identity', 'Raw', ['bharosa', 'yaad']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरे नाम की आदत\nइतनी गहरी है\nकि भूलने में भी तेरा नाम आता है।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['आदत', 'नाम']),
  h('मैं तेरे पास होकर भी\nतेरी कमी में जीता रहा,\nयह मेरी सबसे बड़ी हार थी।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['कमी', 'हार']),
  h('सुबह की पहली चाय,\nतेरी याद,\nऔर मेरा चुप रहना।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['चाय', 'याद']),
  h('जो रास्ता तुझ तक जाता था,\nवही अब\nमुझे मेरे घर पहुँचाता है।', 'Shayari', 'तीन पंक्ति', 'सहज', ['रास्ता', 'घर']),
  g('Tere naam ki aadat itni gehri hai ki bhoolne mein bhi tera naam aata hai.', 'Shayari', 'Two line', 'Romantic', ['aadat', 'naam']),
  g('Main tere paas hokar bhi teri kami mein jeeta raha, yeh meri sabse badi haar thi.', 'Shayari', 'Two line', 'Deep', ['kami', 'haar']),
  g('Subah ki pehli chai, teri yaad, aur mera chup rehna.', 'Shayari', 'Two line', 'Aching', ['chai', 'yaad']),
  g('Jo raasta tujh tak jaata tha, wahi ab mujhe mere ghar pahunchaata hai.', 'Shayari', 'Two line', 'Calm', ['raasta', 'ghar']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('The person who says less often knows more.', 'Quotes and thoughts', 'Restraint', 'Wise', ['quotes', 'silence']),
  e('A clean desk is not a personality. But it helps.', 'Quotes and thoughts', 'Focus', 'Wry', ['quotes', 'focus']),
  e('You cannot optimise your way out of a bad decision.', 'Quotes and thoughts', 'Judgement', 'Sharp', ['quotes', 'decisions']),
  e('Anyone who is impressed by titles has not held one.', 'Quotes and thoughts', 'Status', 'Sharp', ['quotes', 'status']),
  e('Respect the person who disagrees with you politely.', 'Quotes and thoughts', 'Discernment', 'Wise', ['quotes', 'respect']),
  h('जो कम बोलता है, अक्सर ज़्यादा जानता है।', 'Quotes and thoughts', 'संयम', 'गंभीर', ['बोलता', 'जानता']),
  h('साफ़ मेज़ व्यक्तित्व नहीं, पर मदद करती है।', 'Quotes and thoughts', 'ध्यान', 'सहज', ['मेज़', 'मदद']),
  h('तमग़े से प्रभावित होने वाले ने कभी तमग़ा नहीं संभाला।', 'Quotes and thoughts', 'प्रतिष्ठा', 'तीखा', ['तमग़ा', 'प्रभावित']),
  g('Jo kam bolta hai, aksar zyada jaanta hai.', 'Quotes and thoughts', 'Restraint', 'Wise', ['bolta', 'jaanta']),
  g('Saaf mez vyaktitva nahi, par madad karti hai.', 'Quotes and thoughts', 'Focus', 'Wry', ['mez', 'madad']),
  g('Tamghe se prabhavit hone wale ne kabhi tamgha nahi sambhala.', 'Quotes and thoughts', 'Status', 'Sharp', ['tamghe', 'sambhala']),

  /* ------------------------------------------------------ Life and reality */
  e('You will meet your best self in a boring routine.', 'Life and reality', 'Habit', 'Warm', ['life', 'routine']),
  e('The right people do not require a sales pitch.', 'Life and reality', 'People', 'Wisdom', ['life', 'people']),
  e('You are allowed to outgrow a version you liked.', 'Life and reality', 'Growth', 'Warm', ['life', 'growth']),
  e('Time is the only currency you cannot borrow back.', 'Life and reality', 'Time', 'Direct', ['life', 'time']),
  h('तुम अपने सबसे अच्छे रूप से बोरिंग दिनचर्या में मिलोगे।', 'Life and reality', 'आदत', 'कोमल', ['दिनचर्या', 'रूप']),
  h('सही लोगों को किसी प्रचार की ज़रूरत नहीं होती।', 'Life and reality', 'लोग', 'गंभीर', ['लोग', 'प्रचार']),
  h('तुम्हें उस पुराने रूप से आगे बढ़ने का हक़ है जो तुम्हें पसंद था।', 'Life and reality', 'विकास', 'कोमल', ['रूप', 'हक़']),
  g('Sahi logon ko kisi prachaar ki zaroorat nahi hoti.', 'Life and reality', 'People', 'Wise', ['logon', 'prachaar']),
  g('Tumhe us purane roop se aage badhne ka haq hai jo tumhe pasand tha.', 'Life and reality', 'Growth', 'Warm', ['roop', 'haq']),

  /* --------------------------------------------------- Motivational depth */
  e('You do not need more time. You need fewer obligations.', 'Motivational', 'Priorities', 'Sharp', ['motivation', 'time']),
  e('Repetition is the only teacher that never tires.', 'Motivational', 'Practice', 'Wise', ['motivation', 'practice']),
  e('Make it easy to start and hard to skip.', 'Motivational', 'Habit', 'Practical', ['motivation', 'habit']),
  h('तुम्हें ज़्यादा वक़्त नहीं, कम ज़िम्मेदारियाँ चाहिए।', 'Motivational', 'प्राथमिकता', 'स्पष्ट', ['वक़्त', 'ज़िम्मेदारियाँ']),
  h('दोहराव ही वो शिक्षक है जो कभी नहीं थकता।', 'Motivational', 'अभ्यास', 'गंभीर', ['दोहराव', 'शिक्षक']),
  g('Tumhe zyada waqt nahi, kam zimmedaariyan chahiye.', 'Motivational', 'Priorities', 'Sharp', ['waqt', 'zimmedaariyan']),
  g('Dohraav hi woh shikshak hai jo kabhi nahi thakta.', 'Motivational', 'Practice', 'Wise', ['dohraav', 'shikshak']),

  /* ------------------------------------------ Aesthetic / poetry / creator */
  e('A window, a chair and a deadline. That is a studio.', 'Aesthetic', 'Workspace', 'Wry', ['aesthetic', 'studio']),
  e('I edit until the sentence stops apologising.', 'Poetry', 'Craft', 'Honest', ['poetry', 'editing']),
  e('Making things in public is terrifying and faster.', 'Creator and influencer', 'Process', 'Honest', ['creator', 'process']),
  e('I would rather be useful to ten than impressive to a thousand.', 'Creator and influencer', 'Perspective', 'Grounded', ['creator', 'useful']),
  h('खिड़की, कुर्सी और एक समय-सीमा, यही स्टूडियो है।', 'Aesthetic', 'सादगी', 'सहज', ['खिड़की', 'कुर्सी']),
  h('मैं तब तक संपादित करता हूँ जब तक वाक्य माफ़ी मांगना बंद न कर दे।', 'Poetry', 'रचना', 'स्पष्ट', ['वाक्य', 'संपादन']),
  g('Khidki, kursi aur ek deadline, yahi studio hai.', 'Aesthetic', 'Workspace', 'Wry', ['khidki', 'kursi']),
  g('Sab ke saamne banane se darr lagta hai, par kaam tez hota hai.', 'Creator and influencer', 'Process', 'Honest', ['saamne', 'tez']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('Two books about the same war taught me to read everything twice.', 'Books and reading', 'Reader life', 'Wise', ['books', 'perspective']),
  e('I read the ending first and I am not ashamed.', 'Books and reading', 'Reader life', 'Funny', ['books', 'habit']),
  e('My wallet is a museum of forgotten receipts.', 'Minimal', 'Simplicity', 'Funny', ['minimal', 'humour']),
  e('I keep one candle for the days the internet goes down.', 'Home and interiors', 'Home', 'Warm', ['home', 'evening']),
  e('The best purchase I made was a good chair for my back.', 'Home and interiors', 'Home', 'Practical', ['home', 'chair']),
  e('Learn to lose at something small. It makes the big ones easier.', 'Alone and loneliness', 'Growth', 'Wise', ['alone', 'growth']),
  h('एक ही युद्ध की दो किताबें पढ़कर सब कुछ दो बार पढ़ना सीखा।', 'Books and reading', 'पढ़ना', 'गंभीर', ['किताबें', 'पढ़ना']),
  h('मैं अंत पहले पढ़ता हूँ, शर्म नहीं आती।', 'Books and reading', 'पढ़ने की आदत', 'मज़ाकिया', ['अंत', 'पढ़ता']),
  h('मेरा बटुआ भूली हुई रसीदों का संग्रहालय है।', 'Minimal', 'सादगी', 'मज़ाकिया', ['बटुआ', 'रसीदें']),
  h('जिस कुर्सी से पीठ ठीक रहे, वही सबसे अच्छी खरीद थी।', 'Home and interiors', 'घर', 'व्यावहारिक', ['कुर्सी', 'पीठ']),
  g('Ek hi yuddh ki do kitaabein padhkar sab kuch do baar padhna seekha.', 'Books and reading', 'Reader life', 'Wise', ['kitaabein', 'padhna']),
  g('Mera batuwa bhoole hue raseedon ka sangrahaalay hai.', 'Minimal', 'Simplicity', 'Funny', ['batuwa', 'raseedon']),
  g('Jis kursi se peeth theek rahe, wahi sabse acchi khareed thi.', 'Home and interiors', 'Home', 'Practical', ['kursi', 'peeth']),
];
