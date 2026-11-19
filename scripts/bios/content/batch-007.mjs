/**
 * BioCraft original bios — batch 007.
 * Next-thinnest band: royal, motivational, alone, friendship, professional,
 * creator, student, plus a broad middle sweep.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_007 = [
  /* ------------------------------------------------------- Royal and VIP */
  e('Carries the family name like it was earned, not issued.', 'Royal and VIP', 'Heritage', 'Regal', ['royal', 'heritage']),
  e('Old money manners with new money curiosity.', 'Royal and VIP', 'Bearing', 'Poised', ['royal', 'manners']),
  e('A throne is a chair with responsibilities.', 'Royal and VIP', 'Duty', 'Wise', ['royal', 'duty']),
  e('Quiet authority. No announcements required.', 'Royal and VIP', 'Presence', 'Composed', ['authority', 'quiet']),
  h('ताज़ सिर पर नहीं, किरदार में होता है।', 'Royal and VIP', 'किरदार', 'गंभीर', ['ताज़', 'किरदार']),
  h('खानदान बोलता नहीं, बर्ताव करता है।', 'Royal and VIP', 'खानदान', 'शांत', ['खानदान', 'बर्ताव']),
  h('अधिकार वो नहीं जो दिया जाए, वो जो निभाया जाए।', 'Royal and VIP', 'अधिकार', 'गंभीर', ['अधिकार', 'निभाना']),
  g('Taaj sar pe nahi, kirdaar mein hota hai, janaab.', 'Royal and VIP', 'Bearing', 'Regal', ['taaj', 'kirdaar']),
  g('Khaandaan bolta nahi, bartav karta hai.', 'Royal and VIP', 'Heritage', 'Poised', ['khaandaan', 'bartav']),
  g('Adhikaar woh nahi jo diya jaye, woh jo nibhaya jaye.', 'Royal and VIP', 'Duty', 'Wise', ['adhikaar', 'nibhaya']),

  /* --------------------------------------------------------- Motivational */
  e('Show up on the days nobody claps.', 'Motivational', 'Discipline', 'Steady', ['discipline', 'consistency']),
  e('You are allowed to restart at any point in the story.', 'Motivational', 'Restart', 'Encouraging', ['restart', 'hope']),
  e('Small work, done daily, outruns big talk.', 'Motivational', 'Consistency', 'Direct', ['work', 'consistency']),
  e('Confidence is the receipt of practice.', 'Motivational', 'Practice', 'Wise', ['confidence', 'practice']),
  e('Be so prepared that luck has no choice.', 'Motivational', 'Preparation', 'Bold', ['preparation', 'luck']),
  h('जिस दिन तालियाँ नहीं बजें, उस दिन भी आना है।', 'Motivational', 'अनुशासन', 'दृढ़', ['तालियाँ', 'अनुशासन']),
  h('काम छोटा हो, पर रोज़ हो।', 'Motivational', 'निरंतरता', 'स्पष्ट', ['काम', 'रोज़']),
  h('आत्मविश्वास अभ्यास की रसीद है।', 'Motivational', 'अभ्यास', 'गंभीर', ['आत्मविश्वास', 'अभ्यास']),
  h('कहानी कहीं से भी दोबारा शुरू हो सकती है।', 'Motivational', 'नई शुरुआत', 'प्रेरक', ['कहानी', 'शुरुआत']),
  g('Jis din taaliyan nahi bajengi, us din bhi aana hai.', 'Motivational', 'Discipline', 'Firm', ['taaliyan', 'aana']),
  g('Kaam chhota ho, par roz ho. Yahi asli baat hai.', 'Motivational', 'Consistency', 'Direct', ['kaam', 'roz']),
  g('Atmavishwas abhyaas ki jaan hai, koi tohfa nahi.', 'Motivational', 'Practice', 'Wise', ['abhyaas', 'jaan']),
  g('Kahani kahin se bhi dobara shuru ho sakti hai, yaar.', 'Motivational', 'Restart', 'Encouraging', ['kahani', 'shuru']),

  /* -------------------------------------------------- Alone and loneliness */
  e('Learn to be good company and you are never alone.', 'Alone and loneliness', 'Solitude', 'Wise', ['solitude', 'company']),
  e('Lonely taught me which friendships were attendance.', 'Alone and loneliness', 'Clarity', 'Honest', ['lonely', 'friendship']),
  e('I talk to myself because I give good advice.', 'Alone and loneliness', 'Humour', 'Wry', ['alone', 'humour']),
  e('Some evenings are just mine. I have stopped apologising for that.', 'Alone and loneliness', 'Solitude', 'Comfortable', ['evenings', 'alone']),
  h('अकेलेपन ने सिखाया कि कौन अपना था।', 'Alone and loneliness', 'स्पष्टता', 'गंभीर', ['अकेलापन', 'अपना']),
  h('खुद से अच्छी बातें हो जाती हैं, मज़ा आता है।', 'Alone and loneliness', 'सुकून', 'सहज', ['खुद', 'मज़ा']),
  h('कुछ शामें मेरी हैं, किसी से इजाज़त नहीं चाहिए।', 'Alone and loneliness', 'अपना वक़्त', 'शांत', ['शाम', 'इजाज़त']),
  g('Akelepan ne sikhaya ki kaun apna tha aur kaun sirf aata tha.', 'Alone and loneliness', 'Clarity', 'Honest', ['akelepan', 'apna']),
  g('Khud se acchi baatein ho jaati hain, maza aata hai.', 'Alone and loneliness', 'Solitude', 'Warm', ['khud', 'baatein']),
  g('Kuch shaamein meri hain, kisi se ijazat nahi chahiye.', 'Alone and loneliness', 'Solitude', 'Calm', ['shaamein', 'ijazat']),

  /* ------------------------------------------------------------ Friendship */
  e('The friend who notices you went quiet.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'loyalty']),
  e('We have no plan. We have a standing excuse.', 'Friendship', 'Group chat', 'Funny', ['friendship', 'funny']),
  e('Twelve years of friendship, zero formal conversations.', 'Friendship', 'Time', 'Warm', ['friendship', 'years']),
  h('वो दोस्त जो चुप्पी भी सुन लेता है।', 'Friendship', 'दोस्ती', 'कोमल', ['दोस्त', 'चुप्पी']),
  h('यारी में हिसाब नहीं, हिसाब में यारी नहीं।', 'Friendship', 'दोस्ती', 'गंभीर', ['यारी', 'हिसाब']),
  h('बारह साल से दोस्त, आज तक एक भी गंभीर बातचीत नहीं।', 'Friendship', 'पुरानी दोस्ती', 'मज़ाकिया', ['दोस्ती', 'साल']),
  g('Woh dost jo chuppi bhi sun leta hai, wahi asli hai.', 'Friendship', 'Loyalty', 'Warm', ['dost', 'chuppi']),
  g('Yaari mein hisaab nahi, hisaab mein yaari nahi.', 'Friendship', 'Loyalty', 'Wise', ['yaari', 'hisaab']),
  g('Barah saal se dost, aaj tak ek bhi serious baatcheet nahi.', 'Friendship', 'Time', 'Funny', ['dost', 'saal']),

  /* ------------------------------------------------- Professional and business */
  e('Shipping, hiring, repeating. In that order.', 'Professional and business', 'Operator', 'Direct', ['startup', 'shipping']),
  e('I build teams that do not need me in the room.', 'Professional and business', 'Leadership', 'Confident', ['leadership', 'teams']),
  e('Strategy is what survives the Monday morning.', 'Professional and business', 'Strategy', 'Wise', ['strategy', 'execution']),
  e('Sells outcomes, avoids decks.', 'Professional and business', 'Consulting', 'Dry', ['business', 'outcomes']),
  e('Boring businesses pay quietly.', 'Professional and business', 'Entrepreneur', 'Practical', ['business', 'pragmatic']),
  h('काम बोलता है, फ़ाइलें नहीं।', 'Professional and business', 'काम', 'स्पष्ट', ['काम', 'फ़ाइलें']),
  h('टीम वो बनाओ जो तुम्हारे बिना भी चले।', 'Professional and business', 'नेतृत्व', 'गंभीर', ['टीम', 'नेतृत्व']),
  h('बोरिंग धंधे चुपचाप मुनाफ़ा देते हैं।', 'Professional and business', 'कारोबार', 'व्यावहारिक', ['धंधा', 'मुनाफ़ा']),
  g('Kaam bolta hai, files nahi.', 'Professional and business', 'Operator', 'Direct', ['kaam', 'files']),
  g('Team aisi banao jo tumhare bina bhi chale.', 'Professional and business', 'Leadership', 'Wise', ['team', 'chale']),
  g('Boring dhandhe chupchaap munafa dete hain, sach mein.', 'Professional and business', 'Business', 'Practical', ['dhandhe', 'munafa']),

  /* -------------------------------------------------- Creator and influencer */
  e('Making things, mostly badly, until they get good.', 'Creator and influencer', 'Process', 'Honest', ['creator', 'practice']),
  e('Views are weather. Craft is climate.', 'Creator and influencer', 'Perspective', 'Wise', ['views', 'craft']),
  e('I post the boring parts too.', 'Creator and influencer', 'Transparency', 'Direct', ['creator', 'honest']),
  h('बनाता हूँ, बिगड़ता है, फिर सुधरता है।', 'Creator and influencer', 'रचना', 'सहज', ['बनाना', 'रचना']),
  h('व्यूज़ मौसम हैं, काम बारिश है।', 'Creator and influencer', 'नज़रिया', 'गंभीर', ['व्यूज़', 'काम']),
  g('Banata hoon, bigadta hai, phir sudhrta hai. Aisa hi chalta hai.', 'Creator and influencer', 'Process', 'Honest', ['banata', 'sudhrta']),
  g('Views mausam hain, kaam barish hai.', 'Creator and influencer', 'Perspective', 'Wise', ['views', 'barish']),

  /* ------------------------------------------------------------ Student life */
  e('Studying, surviving, occasionally thriving.', 'Student life', 'Student', 'Honest', ['student', 'study']),
  e('Notes thorough, attendance artistic.', 'Student life', 'Student', 'Funny', ['student', 'attendance']),
  e('Learning the syllabus and the city both.', 'Student life', 'Hostel', 'Warm', ['student', 'hostel']),
  h('पढ़ाई पूरी, नींद अधूरी।', 'Student life', 'छात्र', 'मज़ाकिया', ['पढ़ाई', 'नींद']),
  h('हॉस्टल ने ज़िंदगी सिखाई, किताबों ने बाद में।', 'Student life', 'हॉस्टल', 'सहज', ['हॉस्टल', 'ज़िंदगी']),
  g('Padhai poori, neend adhoori. Student life hai.', 'Student life', 'Student', 'Funny', ['padhai', 'neend']),
  g('Hostel ne zindagi sikhayi, kitaabon ne baad mein.', 'Student life', 'Hostel', 'Warm', ['hostel', 'zindagi']),

  /* ----------------------------------------------- Attitude (deepening) */
  e('Pleasant until the third warning.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'limits']),
  e('I bring receipts, not arguments.', 'Attitude', 'Composure', 'Confident', ['attitude', 'proof']),
  e('Nobody can insult you into being smaller.', 'Attitude', 'Self-possession', 'Firm', ['attitude', 'self']),
  h('तीन बार समझाया, चौथी बार जवाब है।', 'Attitude', 'सीमाएं', 'तीखा', ['सीमा', 'जवाब']),
  h('कोई मुझे छोटा नहीं कर सकता, बस कोशिश कर सकता है।', 'Attitude', 'स्वाभिमान', 'दृढ़', ['छोटा', 'स्वाभिमान']),
  g('Teen baar samjhaya, chauthi baar jawab hai.', 'Attitude', 'Boundaries', 'Sharp', ['samjhaya', 'jawab']),
  g('Koi mujhe chhota nahi kar sakta, sirf koshish kar sakta hai.', 'Attitude', 'Self-possession', 'Firm', ['chhota', 'koshish']),

  /* -------------------------------------------------- Love (deepening) */
  e('Love is mostly logistics done tenderly.', 'Love and romance', 'Real love', 'Warm', ['love', 'everyday']),
  e('You are the person I want to be boring with.', 'Love and romance', 'Everyday', 'Sweet', ['love', 'boring']),
  e('We argue better than most people talk.', 'Love and romance', 'Respect', 'Playful', ['love', 'argue']),
  h('प्यार में ज़्यादातर छोटी-छोटी बातें निभानी पड़ती हैं।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['प्यार', 'बातें']),
  h('तुम्हारे साथ बोर होना भी अच्छा लगता है।', 'Love and romance', 'अपनापन', 'कोमल', ['बोर', 'साथ']),
  g('Pyaar mein zyadatar chhoti chhoti baatein nibhani padti hain.', 'Love and romance', 'Real love', 'Warm', ['pyaar', 'baatein']),
  g('Tumhare saath bore hona bhi accha lagta hai.', 'Love and romance', 'Everyday', 'Sweet', ['bore', 'saath']),

  /* ------------------------------------------------------------ Sad (deepening) */
  e('Grief arrives on time and stays past closing.', 'Sad and heartbreak', 'Grief', 'Heavy', ['grief', 'time']),
  e('I am fine. I have simply stopped saying it hopefully.', 'Sad and heartbreak', 'Numbness', 'Honest', ['sad', 'honest']),
  e('The house is louder without you in it.', 'Sad and heartbreak', 'Absence', 'Aching', ['absence', 'home']),
  h('गम वक़्त पर आता है, जाने का नाम नहीं लेता।', 'Sad and heartbreak', 'गम', 'गंभीर', ['गम', 'वक़्त']),
  h('तुम बिना घर ज़्यादा शोर करता है।', 'Sad and heartbreak', 'गैरहाज़िरी', 'भावुक', ['घर', 'शोर']),
  g('Gham waqt par aata hai, jaane ka naam nahi leta.', 'Sad and heartbreak', 'Grief', 'Heavy', ['gham', 'waqt']),
  g('Tumhare bina ghar zyada shor karta hai.', 'Sad and heartbreak', 'Absence', 'Aching', ['ghar', 'shor']),

  /* ---------------------------------------------- Quotes (deepening) */
  e('Never trust a plan that needs you to be perfect.', 'Quotes and thoughts', 'Realism', 'Wise', ['plan', 'realism']),
  e('Learn the rules well enough to break them on purpose.', 'Quotes and thoughts', 'Craft', 'Wise', ['craft', 'rules']),
  e('Boredom is the tax on not choosing.', 'Quotes and thoughts', 'Choice', 'Sharp', ['boredom', 'choice']),
  h('जिस योजना के लिए तुम्हें बेकसूर होना पड़े, वो योजना छोड़ दो।', 'Quotes and thoughts', 'यथार्थ', 'गंभीर', ['योजना', 'यथार्थ']),
  h('बोरियत उस वक़्त का ब्याज है जो तुमने नहीं चुना।', 'Quotes and thoughts', 'चुनाव', 'गंभीर', ['बोरियत', 'चुनाव']),
  g('Jis plan ke liye beghairat hona pade, woh plan chhod do.', 'Quotes and thoughts', 'Realism', 'Wise', ['plan', 'chhod']),
  g('Boreyat usi waqt ka byaaj hai jo tumne khud chuna.', 'Quotes and thoughts', 'Choice', 'Sharp', ['boreyat', 'byaaj']),

  /* --------------------------------------------- Shayari (deepening) */
  h('दिल में जगह थी, पर बस्ती नहीं बसाई,\nतू आया तो सब कुछ अपना लगा।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['दिल', 'जगह']),
  h('मैं अपनी ही कहानी में किरदार बदलता रहा,\nअब जाकर कहीं खुद से मिला हूँ।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['कहानी', 'खुद']),
  h('तेरे जाने के बाद भी तेरी आदत नहीं गई,\nचाय में चीनी डालना छूट गया, तेरे हिसाब से।', 'Shayari', 'दो पंक्ति', 'भावुक', ['चाय', 'आदत']),
  g('Dil mein jagah thi, par basti nahi basai.', 'Shayari', 'Two line', 'Romantic', ['dil', 'jagah']),
  g('Main apni hi kahani mein kirdaar badalta raha.', 'Shayari', 'Two line', 'Deep', ['kahani', 'kirdaar']),
  g('Tere jaane ke baad bhi teri aadat nahi gayi.', 'Shayari', 'Two line', 'Aching', ['aadat', 'jaane']),

  /* ----------------------------------------- Life (deepening) */
  e('Rest is not a reward. It is a requirement.', 'Life and reality', 'Rest', 'Grounded', ['rest', 'life']),
  e('You can be grateful and still want more.', 'Life and reality', 'Nuance', 'Wise', ['gratitude', 'ambition']),
  e('Most problems are solved by one honest conversation.', 'Life and reality', 'Relationships', 'Direct', ['honesty', 'life']),
  h('आराम इनाम नहीं, ज़रूरत है।', 'Life and reality', 'आराम', 'सहज', ['आराम', 'ज़रूरत']),
  h('शुक्रगुज़ार रहो, पर मांगना मत छोड़ो।', 'Life and reality', 'संतोष', 'गंभीर', ['शुक्र', 'मांगना']),
  g('Aaraam inaam nahi, zaroorat hai.', 'Life and reality', 'Rest', 'Grounded', ['aaraam', 'zaroorat']),
  g('Shukraguzaar raho, par maangna mat chhodo.', 'Life and reality', 'Nuance', 'Wise', ['shukr', 'maangna']),

  /* ------------------------------------------ Aesthetic (deepening) */
  e('One good object beats ten loud ones.', 'Aesthetic', 'Minimal', 'Minimal', ['aesthetic', 'objects']),
  e('Sunlight is the only filter I trust.', 'Aesthetic', 'Light', 'Warm', ['aesthetic', 'light']),
  h('एक अच्छी चीज़ दस शोरगुल वाली चीज़ों से बेहतर है।', 'Aesthetic', 'न्यूनतम', 'संक्षिप्त', ['चीज़', 'सादगी']),
  h('धूप से अच्छा कोई फ़िल्टर नहीं।', 'Aesthetic', 'रोशनी', 'सहज', ['धूप', 'रोशनी']),
  g('Ek acchi cheez das shor wali cheezon se behtar hai.', 'Aesthetic', 'Minimal', 'Minimal', ['cheez', 'behtar']),
  g('Dhoop se accha koi filter nahi hota.', 'Aesthetic', 'Light', 'Warm', ['dhoop', 'filter']),
];
