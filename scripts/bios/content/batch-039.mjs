/**
 * BioCraft original bios — batch 039.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_039 = [
  /* ------------------------------------------------------------ Attitude */
  e('I would rather be quiet than be someone else.', 'Attitude', 'Identity', 'Firm', ['attitude', 'identity']),
  e('I have stopped waiting to be understood by the unwilling.', 'Attitude', 'Distance', 'Composed', ['attitude', 'understood']),
  e('My peace is not a phase. It is a policy.', 'Attitude', 'Peace', 'Dry', ['attitude', 'peace']),
  e('You cannot borrow my confidence for your own argument.', 'Attitude', 'Self-possession', 'Sharp', ['attitude', 'confidence']),
  h('किसी और जैसा बनने से बेहतर है चुप रहूँ।', 'Attitude', 'पहचान', 'दृढ़', ['चुप', 'बनने']),
  h('जो समझना नहीं चाहते, उनसे समझे जाने का इंतज़ार छोड़ दिया।', 'Attitude', 'दूरी', 'शांत', ['इंतज़ार', 'समझना']),
  h('मेरा सुकून मौसम नहीं, नीति है।', 'Attitude', 'सुकून', 'शांत', ['सुकून', 'नीति']),
  g('Kisi aur jaisa banne se behtar hai chup rahoon.', 'Attitude', 'Identity', 'Firm', ['chup', 'banne']),
  g('Jo samajhna nahi chahte, unse samjhe jaane ka intezaar chhod diya.', 'Attitude', 'Distance', 'Composed', ['intezaar', 'samajhna']),
  g('Mera sukoon mausam nahi, neeti hai.', 'Attitude', 'Peace', 'Dry', ['sukoon', 'neeti']),

  /* ------------------------------------------------------------- Love */
  e('I like us best in a kitchen, with nothing to prove.', 'Love and romance', 'Closeness', 'Warm', ['love', 'kitchen']),
  e('You are the person I would choose in a slower century.', 'Love and romance', 'Devotion', 'Tender', ['love', 'century']),
  e('Small repairs keep a relationship alive more than grand gestures.', 'Love and romance', 'Real love', 'Wise', ['love', 'repairs']),
  e('I want to hear about your day even when it was boring.', 'Love and romance', 'Attention', 'Warm', ['love', 'day']),
  h('रसोई में हम दोनों सबसे अच्छे लगते हैं, बिना कुछ साबित किए।', 'Love and romance', 'अपनापन', 'कोमल', ['रसोई', 'साबित']),
  h('तुम वो हो जिसे मैं धीमी सदी में भी चुनता।', 'Love and romance', 'समर्पण', 'कोमल', ['सदी', 'चुनता']),
  h('छोटी-छोटी मरम्मतें रिश्ता बड़े तोहफ़ों से ज़्यादा बचाती हैं।', 'Love and romance', 'सच्चा प्यार', 'गंभीर', ['मरम्मत', 'तोहफ़े']),
  g('Rasoi mein hum dono sabse achhe lagte hain, bina kuch saabit kiye.', 'Love and romance', 'Closeness', 'Warm', ['rasoi', 'saabit']),
  g('Tum woh ho jise main dheemi sadi mein bhi chunta.', 'Love and romance', 'Devotion', 'Tender', ['sadi', 'chunta']),
  g('Chhoti-chhoti marammat rishta bade tohfon se zyada bachati hain.', 'Love and romance', 'Real love', 'Wise', ['marammat', 'tohfon']),

  /* ------------------------------------------------------- Sad depth */
  e('I have a drawer of things I cannot throw away and will not open.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'drawer']),
  e('We were a good idea that needed better timing.', 'Sad and heartbreak', 'Endings', 'Honest', ['sad', 'timing']),
  e('Loneliness taught me the difference between alone and abandoned.', 'Sad and heartbreak', 'Loneliness', 'Wise', ['sad', 'loneliness']),
  e('I stopped explaining the sadness and started sleeping better.', 'Sad and heartbreak', 'Recovery', 'Quiet', ['sad', 'recovery']),
  h('मेरे पास एक दराज़ है — न फेंक सकता हूँ, न खोलता हूँ।', 'Sad and heartbreak', 'याद', 'भावुक', ['दराज़', 'फेंक']),
  h('हम एक अच्छा विचार थे, बस वक़्त ग़लत था।', 'Sad and heartbreak', 'अंत', 'स्पष्ट', ['विचार', 'वक़्त']),
  h('अकेलेपन ने अकेले और छोड़े जाने का फ़र्क़ सिखा दिया।', 'Sad and heartbreak', 'अकेलापन', 'गंभीर', ['अकेलेपन', 'फ़र्क़']),
  g('Mere paas ek daraz hai — na phenk sakta hoon, na kholta hoon.', 'Sad and heartbreak', 'Memory', 'Aching', ['daraz', 'phenk']),
  g('Hum ek accha vichaar the, bas waqt galat tha.', 'Sad and heartbreak', 'Endings', 'Honest', ['vichaar', 'waqt']),
  g('Akelepan ne akele aur chhode jaane ka farq sikha diya.', 'Sad and heartbreak', 'Loneliness', 'Wise', ['akelepan', 'farq']),

  /* --------------------------------------------------------- Shayari */
  h('तेरे शहर\nका पता\nमुझे अब भी याद है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शहर', 'पता']),
  h('मैंने खुद को\nतेरे नाम से\nबाँध तो नहीं रखा।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['खुद', 'नाम']),
  h('मौसम बदला,\nतेरी आदत\nनहीं बदली।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['मौसम', 'आदत']),
  g('Tere shehar ka pata mujhe ab bhi yaad hai.', 'Shayari', 'Two line', 'Aching', ['shehar', 'pata']),
  g('Maine khud ko tere naam se baandh toh nahi rakha.', 'Shayari', 'Two line', 'Deep', ['khud', 'naam']),
  g('Mausam badla, teri aadat nahi badli.', 'Shayari', 'Two line', 'Romantic', ['mausam', 'aadat']),

  /* -------------------------------------------------- Quotes and ideas */
  e('You can be right and still be the reason the room went quiet.', 'Quotes and thoughts', 'Conduct', 'Wise', ['quotes', 'conduct']),
  e('Attention is the currency nobody audits.', 'Quotes and thoughts', 'Attention', 'Sharp', ['quotes', 'attention']),
  e('A good question is worth ten confident answers.', 'Quotes and thoughts', 'Learning', 'Wise', ['quotes', 'questions']),
  e('If it needs a caption to be kind, it was not kindness.', 'Quotes and thoughts', 'Kindness', 'Sharp', ['quotes', 'kindness']),
  h('सही होकर भी कमरे को चुप कराने की वजह हो सकते हो।', 'Quotes and thoughts', 'आचरण', 'गंभीर', ['सही', 'कमरे']),
  h('ध्यान वो करेंसी है जिसका हिसाब कोई नहीं रखता।', 'Quotes and thoughts', 'ध्यान', 'तीखा', ['ध्यान', 'करेंसी']),
  h('एक अच्छा सवाल दस पक्के जवाबों से बेहतर है।', 'Quotes and thoughts', 'सीखना', 'गंभीर', ['सवाल', 'जवाब']),
  g('Sahi hokar bhi kamre ko chup karaane ki wajah ho sakte ho.', 'Quotes and thoughts', 'Conduct', 'Wise', ['sahi', 'kamre']),
  g('Dhyan woh currency hai jiska hisaab koi nahi rakhta.', 'Quotes and thoughts', 'Attention', 'Sharp', ['dhyan', 'hisaab']),
  g('Ek accha sawaal das pakke jawaabon se behtar hai.', 'Quotes and thoughts', 'Learning', 'Wise', ['sawaal', 'jawaab']),

  /* ------------------------------------------------- Life and reality */
  e('You will be somebody past self and that is allowed.', 'Life and reality', 'Change', 'Wise', ['life', 'change']),
  e('Nobody healthy is impressed by how little you slept.', 'Life and reality', 'Health', 'Direct', ['life', 'sleep']),
  e('A friendship maintained by memes is still a friendship.', 'Life and reality', 'Friendship', 'Wry', ['life', 'friendship']),
  e('Ask for what you want before you resent the guessing.', 'Life and reality', 'Honesty', 'Direct', ['life', 'asking']),
  h('तुम अपने पुराने रूप से अलग हो सकते हो, इजाज़त है।', 'Life and reality', 'बदलाव', 'गंभीर', ['रूप', 'इजाज़त']),
  h('कम सोने पर कोई समझदार इंसान प्रभावित नहीं होता।', 'Life and reality', 'सेहत', 'स्पष्ट', ['सोने', 'समझदार']),
  h('मीम्स से चलती दोस्ती भी दोस्ती ही है।', 'Life and reality', 'दोस्ती', 'सहज', ['दोस्ती', 'मीम्स']),
  g('Kam sone par koi samajhdaar insaan prabhavit nahi hota.', 'Life and reality', 'Health', 'Direct', ['sone', 'samajhdaar']),
  g('Meme se chalti dosti bhi dosti hi hai.', 'Life and reality', 'Friendship', 'Wry', ['dosti', 'meme']),
  g('Jo chahiye, maang lo, phir guess karne ka gussa mat paalo.', 'Life and reality', 'Honesty', 'Direct', ['maang', 'gussa']),

  /* ------------------------------------------------------ Motivational */
  e('You cannot edit a page that does not exist yet.', 'Motivational', 'Starting', 'Direct', ['motivation', 'starting']),
  e('The first version should be embarrassing on purpose.', 'Motivational', 'Courage', 'Wry', ['motivation', 'draft']),
  e('Your pace is not a moral failing.', 'Motivational', 'Compassion', 'Warm', ['motivation', 'pace']),
  h('जो सफ़ा लिखा ही नहीं, उसे सुधार नहीं सकते।', 'Motivational', 'शुरुआत', 'स्पष्ट', ['सफ़ा', 'सुधार']),
  h('पहला रूप जानबूझकर शर्मिंदा करने वाला होना चाहिए।', 'Motivational', 'साहस', 'सहज', ['रूप', 'साहस']),
  g('Jo safa likha hi nahi, use sudhaar nahi sakte.', 'Motivational', 'Starting', 'Direct', ['safa', 'sudhaar']),
  g('Pehla roop jaanbujhkar sharminda karne wala hona chahiye.', 'Motivational', 'Courage', 'Wry', ['roop', 'sharminda']),

  /* -------------------------------------------------------- Aesthetic */
  e('Hang one thing you love instead of five you tolerate.', 'Aesthetic', 'Interiors', 'Practical', ['aesthetic', 'walls']),
  e('Wooden spoons and steel glasses are a whole aesthetic.', 'Aesthetic', 'Kitchen', 'Warm', ['aesthetic', 'kitchen']),
  e('Fresh air is the cheapest renovation available.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'air']),
  h('पाँच सहने वाली चीज़ों की जगह एक पसंदीदा चीज़ टाँगो।', 'Aesthetic', 'घर', 'व्यावहारिक', ['चीज़', 'टाँगो']),
  h('लकड़ी के चम्मच और स्टील के गिलास खुद एक अंदाज़ हैं।', 'Aesthetic', 'रसोई', 'कोमल', ['चम्मच', 'गिलास']),
  g('Paanch sehne wali cheezon ki jagah ek pasandida cheez taango.', 'Aesthetic', 'Interiors', 'Practical', ['cheez', 'taango']),
  g('Lakdi ke chamach aur steel ke glass khud ek andaaz hain.', 'Aesthetic', 'Kitchen', 'Warm', ['chamach', 'andas']),

  /* ----------------------------------------------- Royal and creator */
  e('Arrive on time and people will trust you with more.', 'Royal and VIP', 'Reliability', 'Poised', ['royal', 'time']),
  e('Do not explain your wealth. Let your calm do it.', 'Royal and VIP', 'Poise', 'Poised', ['royal', 'calm']),
  e('Make content you would be proud to be asked about in person.', 'Creator and influencer', 'Integrity', 'Firm', ['creator', 'integrity']),
  e('Reply to the small accounts. They remember longest.', 'Creator and influencer', 'Community', 'Warm', ['creator', 'community']),
  h('समय पर पहुँचो, लोग तुम्हें ज़्यादा सौंपेंगे।', 'Royal and VIP', 'भरोसा', 'शांत', ['समय', 'भरोसा']),
  h('दौलत समझाओ मत, ठहराव बोलने दो।', 'Royal and VIP', 'गरिमा', 'शांत', ['दौलत', 'ठहराव']),
  g('Samay par pahuncho, log tumhein zyada saunpenge.', 'Royal and VIP', 'Reliability', 'Poised', ['samay', 'bharosa']),
  g('Apni daulat mat samjhao, apna thehraav bolne do.', 'Royal and VIP', 'Poise', 'Poised', ['daulat', 'thehraav']),
  g('Chhote accounts ko jawaab do, woh sabse lambe yaad rakhte hain.', 'Creator and influencer', 'Community', 'Warm', ['accounts', 'jawaab']),

  /* --------------------------------------------------- Mid-field top-up */
  e('Poems do not need permission, only a pen.', 'Poetry', 'Process', 'Warm', ['poetry', 'pen']),
  e('Keep a notebook of lines you overhear.', 'Books and reading', 'Writing life', 'Practical', ['books', 'notebook']),
  e('A pressure cooker is the most honest kitchen teacher.', 'Food and cooking', 'Equipment', 'Wry', ['food', 'cooker']),
  e('Do the boring stretch and skip the heroics.', 'Fitness', 'Mobility', 'Practical', ['fitness', 'stretch']),
  e('Light is the only equipment that really matters.', 'Photography', 'Equipment', 'Wise', ['photography', 'light']),
  e('A song you can play slowly is a song you know.', 'Music and art', 'Practice', 'Practical', ['music', 'practice']),
  e('A balcony with two plants is a garden with ambitions.', 'Nature', 'Plants', 'Warm', ['nature', 'balcony']),
  e('A scene with no dialogue can still be the loudest part.', 'Cinema and OTT', 'Craft', 'Wise', ['cinema', 'silence']),
  e('The smell of the first rain fixes almost nothing and helps anyway.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'smell']),
  e('Take the bus sometimes. You will meet your own city.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'bus']),
  h('कविता को इजाज़त नहीं, कलम चाहिए।', 'Poetry', 'रचना', 'कोमल', ['कविता', 'कलम']),
  h('बस में बैठो कभी, अपना शहर मिलेगा।', 'Travel and adventure', 'शहर', 'कोमल', ['बस', 'शहर']),
  h('बालकनी में दो पौधे एक महत्वाकांक्षी बाग़ हैं।', 'Nature', 'पौधे', 'कोमल', ['बालकनी', 'पौधे']),
  h('बिना संवाद का दृश्य भी सबसे ऊँचा हो सकता है।', 'Cinema and OTT', 'कला', 'गंभीर', ['संवाद', 'दृश्य']),
  g('Kavita ko ijazat nahi, kalam chahiye.', 'Poetry', 'Process', 'Warm', ['kavita', 'kalam']),
  g('Bus mein baitho kabhi, apna shehar milega.', 'Travel and adventure', 'Cities', 'Warm', ['bus', 'shehar']),
  g('Balcony mein do paudhe ek mahatvakaanshi baagh hain.', 'Nature', 'Plants', 'Warm', ['balcony', 'paudhe']),
  g('Bina samvaad ka drishya bhi sabse ooncha ho sakta hai.', 'Cinema and OTT', 'Craft', 'Wise', ['samvaad', 'drishya']),
];
