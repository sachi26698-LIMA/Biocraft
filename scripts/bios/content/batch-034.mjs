/**
 * BioCraft original bios — batch 034.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_034 = [
  /* ------------------------------------------------------------ Attitude */
  e('I am polite until politeness stops being useful.', 'Attitude', 'Boundaries', 'Dry', ['attitude', 'polite']),
  e('I am not applying for the role of somebody you approve of.', 'Attitude', 'Self-respect', 'Firm', ['attitude', 'approval']),
  e('My calm is not an invitation to negotiate.', 'Attitude', 'Composure', 'Sharp', ['attitude', 'calm']),
  e('I would rather leave quietly than win loudly.', 'Attitude', 'Dignity', 'Composed', ['attitude', 'dignity']),
  e('Being underestimated is a good place to work from.', 'Attitude', 'Underdog', 'Witty', ['attitude', 'underdog']),
  h('अदब तक ठीक हूँ, उसके बाद हिसाब।', 'Attitude', 'सीमाएं', 'तीखा', ['अदब', 'हिसाब']),
  h('जिन्होंने मन बना लिया, उनके सामने परीक्षा नहीं देता।', 'Attitude', 'स्वाभिमान', 'दृढ़', ['मन', 'परीक्षा']),
  h('मेरा ठहराव सौदेबाज़ी का न्योता नहीं है।', 'Attitude', 'संयम', 'शांत', ['ठहराव', 'सौदेबाज़ी']),
  h('शोर से जीतने से बेहतर है चुपचाप निकल जाना।', 'Attitude', 'गरिमा', 'शांत', ['शोर', 'चुपचाप']),
  g('Adab tak theek hoon, uske baad hisaab.', 'Attitude', 'Boundaries', 'Sharp', ['adab', 'hisaab']),
  g('Jinhone man bana liya, unke saamne pariksha nahi deta.', 'Attitude', 'Self-respect', 'Firm', ['man', 'pariksha']),
  g('Mera thehraav saudebaazi ka nyota nahi hai.', 'Attitude', 'Composure', 'Composed', ['thehraav', 'saudebaazi']),

  /* ------------------------------------------------------------- Love */
  e('I want the version of us that survives a boring Tuesday.', 'Love and romance', 'Real love', 'Wry', ['love', 'ordinary']),
  e('You never asked me to shrink, and that is why I grew.', 'Love and romance', 'Support', 'Tender', ['love', 'growth']),
  e('Let us be the couple that keeps their phones in another room.', 'Love and romance', 'Presence', 'Warm', ['love', 'presence']),
  e('I remember the small things because they are the actual things.', 'Love and romance', 'Attention', 'Warm', ['love', 'attention']),
  h('हफ़्ते का सबसे उबाऊ दिन भी तुम्हारे साथ आसान है।', 'Love and romance', 'रोज़मर्रा', 'सहज', ['दिन', 'आसान']),
  h('तुमने मुझे छोटा होने को नहीं कहा, इसलिए बढ़ पाया।', 'Love and romance', 'साथ', 'कोमल', ['छोटा', 'बढ़']),
  h('फ़ोन दूसरे कमरे में रखो, शाम हमारी है।', 'Love and romance', 'मौजूदगी', 'कोमल', ['फ़ोन', 'शाम']),
  g('Hafte ka sabse ubaau din bhi tumhare saath aasaan hai.', 'Love and romance', 'Real love', 'Warm', ['hafte', 'aasaan']),
  g('Tumne mujhe chhota hone ko nahi kaha, isliye badh paya.', 'Love and romance', 'Support', 'Tender', ['chhota', 'badh']),
  g('Phone doosre kamre mein rakho, shaam hamari hai.', 'Love and romance', 'Presence', 'Warm', ['phone', 'shaam']),

  /* -------------------------------------------------------- Sad depth */
  e('I have learned to be gentle with the version of me that stayed.', 'Sad and heartbreak', 'Self-compassion', 'Tender', ['sad', 'gentle']),
  e('The loneliness is not loud. It is just constant.', 'Sad and heartbreak', 'Loneliness', 'Heavy', ['sad', 'lonely']),
  e('We were good at the beginning and tired at the end.', 'Sad and heartbreak', 'Endings', 'Honest', ['sad', 'endings']),
  e('I keep your handwriting in a drawer I do not open.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'handwriting']),
  h('जो मैं रुक गया, उस पर भी तरस खाना सीख लिया है।', 'Sad and heartbreak', 'खुद पर दया', 'कोमल', ['रुका', 'तरस']),
  h('अकेलापन शोर नहीं करता, बस हर वक़्त रहता है।', 'Sad and heartbreak', 'अकेलापन', 'भारी', ['अकेलापन', 'वक़्त']),
  h('शुरू में हम अच्छे थे, अंत में थके हुए।', 'Sad and heartbreak', 'अंत', 'स्पष्ट', ['शुरू', 'थके']),
  g('Jo main ruk gaya, us par bhi taras khaana seekh liya hai.', 'Sad and heartbreak', 'Self-compassion', 'Tender', ['ruka', 'taras']),
  g('Akelapan shor nahi karta, bas har waqt rehta hai.', 'Sad and heartbreak', 'Loneliness', 'Heavy', ['akelapan', 'waqt']),
  g('Shuru mein hum achhe the, ant mein thake hue.', 'Sad and heartbreak', 'Endings', 'Honest', ['shuru', 'thake']),

  /* --------------------------------------------------------- Shayari */
  h('तू आया\nऔर मौसम बदला,\nबारिश का कसूर नहीं।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['मौसम', 'बारिश']),
  h('मैं चुप हूँ,\nक्योंकि शब्द\nतेरे नाम से शुरू होते हैं।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शब्द', 'नाम']),
  h('रोज़ थोड़ा\nटूटता हूँ,\nऔर रोज़ जुड़ जाता हूँ।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['टूटना', 'जुड़ना']),
  g('Tu aaya aur mausam badla, baarish ka kasoor nahi.', 'Shayari', 'Two line', 'Romantic', ['mausam', 'baarish']),
  g('Main chup hoon, kyunki shabd tere naam se shuru hote hain.', 'Shayari', 'Two line', 'Aching', ['shabd', 'naam']),
  g('Roz thoda tootta hoon, aur roz jud jaata hoon.', 'Shayari', 'Two line', 'Deep', ['roz', 'jud']),

  /* -------------------------------------------------- Quotes and ideas */
  e('You can tell a lot about a person by how they treat waiters.', 'Quotes and thoughts', 'Character', 'Wise', ['quotes', 'character']),
  e('Every shortcut is a loan with a strange interest rate.', 'Quotes and thoughts', 'Work', 'Sharp', ['quotes', 'shortcuts']),
  e('Comparison is a tax you pay for somebody else success.', 'Quotes and thoughts', 'Peace', 'Wise', ['quotes', 'comparison']),
  e('Say less. Mean all of it.', 'Quotes and thoughts', 'Speech', 'Sharp', ['quotes', 'speech']),
  h('आदमी को खाने परोसने वालों से कैसे बात करता है, इससे पहचानो।', 'Quotes and thoughts', 'चरित्र', 'गंभीर', ['आदमी', 'बात']),
  h('हर शॉर्टकट एक क़र्ज़ है, ब्याज अजीब होता है।', 'Quotes and thoughts', 'काम', 'तीखा', ['शॉर्टकट', 'क़र्ज़']),
  h('दूसरों से तुलना अपनी शांति पर लगा टैक्स है।', 'Quotes and thoughts', 'शांति', 'गंभीर', ['तुलना', 'शांति']),
  g('Aadmi ko khaana parosne walon se kaise baat karta hai, isse pehchano.', 'Quotes and thoughts', 'Character', 'Wise', ['aadmi', 'baat']),
  g('Har shortcut ek karz hai, byaaj ajeeb hota hai.', 'Quotes and thoughts', 'Work', 'Sharp', ['shortcut', 'karz']),
  g('Doosron se tulna apni shaanti par laga tax hai.', 'Quotes and thoughts', 'Peace', 'Wise', ['tulna', 'shaanti']),

  /* ------------------------------------------------- Life and reality */
  e('You cannot outrun a bad routine with a good weekend.', 'Life and reality', 'Habits', 'Direct', ['life', 'habits']),
  e('Most people are doing their best with what they were given.', 'Life and reality', 'People', 'Wise', ['life', 'people']),
  e('Money buys quiet, and quiet is underrated.', 'Life and reality', 'Money', 'Wry', ['life', 'money']),
  e('Some friendships end without a fight and that is allowed.', 'Life and reality', 'Friendship', 'Honest', ['life', 'friendship']),
  h('खराब दिनचर्या को अच्छे वीकेंड से नहीं हराया जा सकता।', 'Life and reality', 'आदतें', 'स्पष्ट', ['दिनचर्या', 'वीकेंड']),
  h('ज़्यादातर लोग जो मिला उससे अपनी पूरी कोशिश कर रहे हैं।', 'Life and reality', 'लोग', 'गंभीर', ['लोग', 'कोशिश']),
  h('पैसा सुकून खरीदता है, और सुकून कम आँका जाता है।', 'Life and reality', 'पैसा', 'सहज', ['पैसा', 'सुकून']),
  g('Kharab dincharya ko achhe weekend se nahi haraya ja sakta.', 'Life and reality', 'Habits', 'Direct', ['dincharya', 'weekend']),
  g('Zyadatar log jo mila usse apni poori koshish kar rahe hain.', 'Life and reality', 'People', 'Wise', ['log', 'koshish']),
  g('Paisa sukoon kharidta hai, aur sukoon kam aanka jaata hai.', 'Life and reality', 'Money', 'Wry', ['paisa', 'sukoon']),

  /* ------------------------------------------------------- Motivational */
  e('Do the smallest version today instead of the perfect one never.', 'Motivational', 'Consistency', 'Direct', ['motivation', 'small']),
  e('Discipline is just kindness to your future self, repeated.', 'Motivational', 'Discipline', 'Wise', ['motivation', 'discipline']),
  e('You are allowed to be a beginner in public.', 'Motivational', 'Courage', 'Warm', ['motivation', 'beginner']),
  h('आज सबसे छोटा रूप करो, बेहतरीन रूप कभी नहीं।', 'Motivational', 'निरंतरता', 'स्पष्ट', ['छोटा', 'आज']),
  h('अनुशासन अपने कल के लिए दया है, बार-बार।', 'Motivational', 'अनुशासन', 'गंभीर', ['अनुशासन', 'दया']),
  g('Aaj sabse chhota roop karo, behtareen roop kabhi nahi.', 'Motivational', 'Consistency', 'Direct', ['chhota', 'aaj']),
  g('Anushasan apne kal ke liye daya hai, baar-baar.', 'Motivational', 'Discipline', 'Wise', ['anushasan', 'daya']),

  /* --------------------------------------------------------- Aesthetic */
  e('One good chair beats four bad ones, always.', 'Aesthetic', 'Interiors', 'Practical', ['aesthetic', 'furniture']),
  e('Clean windows are free interior design.', 'Aesthetic', 'Home', 'Wry', ['aesthetic', 'windows']),
  e('Let the plants be slightly wild. Perfection looks plastic.', 'Aesthetic', 'Plants', 'Warm', ['aesthetic', 'plants']),
  h('एक अच्छी कुर्सी चार खराब से हमेशा बेहतर है।', 'Aesthetic', 'घर', 'व्यावहारिक', ['कुर्सी', 'बेहतर']),
  h('साफ़ खिड़कियाँ मुफ़्त का इंटीरियर डिज़ाइन हैं।', 'Aesthetic', 'घर', 'सहज', ['खिड़कियाँ', 'डिज़ाइन']),
  g('Ek achhi kursi chaar kharab se hamesha behtar hai.', 'Aesthetic', 'Interiors', 'Practical', ['kursi', 'behtar']),
  g('Saaf khidkiyan muft ka interior design hain.', 'Aesthetic', 'Home', 'Wry', ['khidkiyan', 'design']),

  /* ----------------------------------------- Royal, VIP, creator edge */
  e('Never explain your standards. Just keep them.', 'Royal and VIP', 'Poise', 'Firm', ['royal', 'standards']),
  e('Dignity is what you keep when the room stops clapping.', 'Royal and VIP', 'Dignity', 'Poised', ['royal', 'dignity']),
  e('Make the thing you would have needed at twenty.', 'Creator and influencer', 'Purpose', 'Warm', ['creator', 'purpose']),
  e('Consistency is the only algorithm that has ever worked.', 'Creator and influencer', 'Strategy', 'Direct', ['creator', 'consistency']),
  h('अपनी शर्तें समझाओ मत, बस निभाओ।', 'Royal and VIP', 'गरिमा', 'दृढ़', ['शर्तें', 'निभाओ']),
  h('गरिमा वो है जो तालियाँ बंद होने पर बचती है।', 'Royal and VIP', 'गरिमा', 'शांत', ['गरिमा', 'तालियाँ']),
  g('Apni shartein samjhao mat, bas nibhao.', 'Royal and VIP', 'Poise', 'Firm', ['shartein', 'nibhao']),
  g('Garima woh hai jo taaliyan band hone par bachti hai.', 'Royal and VIP', 'Dignity', 'Poised', ['garima', 'taaliyan']),
  g('Bees saal ki umar mein jo chahiye hota, wahi banao.', 'Creator and influencer', 'Purpose', 'Warm', ['umar', 'banao']),

  /* --------------------------------------------------- Mid-field top-up */
  e('A poem is a place where a feeling is allowed to be exact.', 'Poetry', 'Craft', 'Wise', ['poetry', 'craft']),
  e('Keep the books you did not finish. They are a to-do list for your mind.', 'Books and reading', 'Reader life', 'Wry', ['books', 'reading']),
  e('Feed people before you argue with them.', 'Food and cooking', 'Hosting', 'Warm', ['food', 'hosting']),
  e('The gym is not a punishment. It is a repair shop.', 'Fitness', 'Mindset', 'Direct', ['fitness', 'mindset']),
  e('Photograph your own street first. It is the hardest and the truest.', 'Photography', 'Home', 'Wise', ['photography', 'street']),
  e('Practise the difficult barre, not the one that already sounds good.', 'Music and art', 'Practice', 'Practical', ['music', 'practice']),
  e('A pet does not care about your deadlines and that is the medicine.', 'Pets and animals', 'Comfort', 'Warm', ['pets', 'comfort']),
  e('Some films are better remembered than rewatched.', 'Cinema and OTT', 'Fandom', 'Wise', ['cinema', 'memory']),
  e('The first rain is a public holiday nobody declared.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['monsoon', 'rain']),
  e('Travelling slowly is a different country altogether.', 'Travel and adventure', 'Slow travel', 'Warm', ['travel', 'slow']),
  h('कविता वो जगह है जहाँ भावना सटीक हो सकती है।', 'Poetry', 'रचना', 'गंभीर', ['कविता', 'भावना']),
  h('जो किताबें पूरी नहीं हुईं, रखो — वो दिमाग़ की सूची हैं।', 'Books and reading', 'पढ़ना', 'सहज', ['किताबें', 'सूची']),
  h('बहस से पहले लोगों को खाना खिलाओ।', 'Food and cooking', 'मेज़बानी', 'कोमल', ['खाना', 'बहस']),
  h('पहली बारिश वो छुट्टी है जो किसी ने घोषित नहीं की।', 'Monsoon and seasons', 'मानसून', 'सहज', ['बारिश', 'छुट्टी']),
  g('Kavita woh jagah hai jahan bhaavna sateek ho sakti hai.', 'Poetry', 'Craft', 'Wise', ['kavita', 'bhaavna']),
  g('Jo kitaabein poori nahi hui, rakho — woh dimaag ki list hain.', 'Books and reading', 'Reader life', 'Wry', ['kitaabein', 'dimaag']),
  g('Bahas se pehle logon ko khaana khilao.', 'Food and cooking', 'Hosting', 'Warm', ['khaana', 'bahas']),
  g('Pehli baarish woh chhutti hai jo kisi ne ghoshit nahi ki.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['baarish', 'chhutti']),
];
