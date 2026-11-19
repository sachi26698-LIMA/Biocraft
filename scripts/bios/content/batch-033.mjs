/**
 * BioCraft original bios — batch 033.
 * Hinglish-leaning (Hinglish was lowest of the three after 032).
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_033 = [
  /* ------------------------------------------------------------ Attitude */
  e('I do not argue with people who need me to lose.', 'Attitude', 'Self-respect', 'Composed', ['attitude', 'respect']),
  e('Loud is not the same as certain.', 'Attitude', 'Composure', 'Sharp', ['attitude', 'composure']),
  e('I keep my promises small and my word large.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'integrity']),
  e('You may misunderstand me at your convenience.', 'Attitude', 'Distance', 'Dry', ['attitude', 'distance']),
  h('जिन्हें मेरा हारना चाहिए, उनसे बहस नहीं करता।', 'Attitude', 'स्वाभिमान', 'शांत', ['बहस', 'हारना']),
  h('ऊँची आवाज़ और यक़ीन एक चीज़ नहीं हैं।', 'Attitude', 'संयम', 'तीखा', ['आवाज़', 'यक़ीन']),
  h('वादे छोटे रखता हूँ, शब्द बड़ा।', 'Attitude', 'ईमानदारी', 'दृढ़', ['वादे', 'शब्द']),
  g('Main unse bahas nahi karta jinhe mera haarna chahiye.', 'Attitude', 'Self-respect', 'Composed', ['bahas', 'haarna']),
  g('Oonchi awaaz aur yaqeen ek cheez nahi hain.', 'Attitude', 'Composure', 'Sharp', ['awaaz', 'yaqeen']),
  g('Vaade chhote rakhta hoon, shabd bada.', 'Attitude', 'Integrity', 'Firm', ['vaade', 'shabd']),
  g('Tum mujhe apni suvidha ke hisaab se galat samajh sakte ho.', 'Attitude', 'Distance', 'Dry', ['suvidha', 'galat']),

  /* ---------------------------------------------------------- Love depth */
  e('Home is a person, and sometimes that person is you.', 'Love and romance', 'Belonging', 'Tender', ['love', 'home']),
  e('You are the first person I want to tell small news to.', 'Love and romance', 'Closeness', 'Warm', ['love', 'news']),
  e('We argue like people who plan to stay.', 'Love and romance', 'Commitment', 'Wry', ['love', 'argue']),
  h('घर एक इंसान होता है, और कभी-कभी वो इंसान तुम हो।', 'Love and romance', 'अपनापन', 'कोमल', ['घर', 'इंसान']),
  h('झगड़ते हुए भी हम ऐसे हैं जैसे रुकने का इरादा है।', 'Love and romance', 'निभाना', 'सहज', ['झगड़ना', 'इरादा']),
  g('Ghar ek insaan hota hai, aur kabhi-kabhi woh insaan tum ho.', 'Love and romance', 'Belonging', 'Tender', ['ghar', 'insaan']),
  g('Jhagadte hue bhi hum aise hain jaise rukne ka iraada hai.', 'Love and romance', 'Commitment', 'Wry', ['jhagadna', 'iraada']),

  /* ------------------------------------------------------ Sad and loss */
  e('Grief is love with nowhere to go, so I walk with it.', 'Sad and heartbreak', 'Grief', 'Heavy', ['sad', 'grief']),
  e('Some evenings I let the sadness sit with me. It knows the way out.', 'Sad and heartbreak', 'Recovery', 'Quiet', ['sad', 'evening']),
  e('Nobody warns you that missing someone has a schedule.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'missing']),
  e('The house is the same size. It only feels emptier.', 'Sad and heartbreak', 'Absence', 'Quiet', ['sad', 'empty']),
  h('ग़म उस प्यार का नाम है जिसे जगह नहीं मिली, इसलिए मैं इसे साथ लेकर चलता हूँ।', 'Sad and heartbreak', 'शोक', 'भारी', ['ग़म', 'प्यार']),
  h('मैं भूला नहीं हूँ, बस सँभालना सीख लिया है।', 'Sad and heartbreak', 'उबरना', 'स्पष्ट', ['भूला', 'सँभालना']),
  h('कोई नहीं बताता कि किसी की कमी का भी एक टाइम-टेबल होता है।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['कमी', 'टाइम-टेबल']),
  g('Gham us pyaar ka naam hai jise jagah nahi mili, isliye main ise saath leke chalta hoon.', 'Sad and heartbreak', 'Grief', 'Heavy', ['gham', 'pyaar']),
  g('Main bhoola nahi hoon, bas sambhalna seekh liya hai.', 'Sad and heartbreak', 'Recovery', 'Honest', ['bhoola', 'sambhalna']),
  g('Koi nahi batata ki kisi ki kami ka bhi ek time-table hota hai.', 'Sad and heartbreak', 'Longing', 'Aching', ['kami', 'time-table']),

  /* --------------------------------------------------------- Shayari */
  h('तेरा नाम\nमेरी डायरी में नहीं,\nमेरी आदत में है।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['नाम', 'आदत']),
  h('शहर बदला,\nचेहरे बदले,\nकमी वही रही।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शहर', 'कमी']),
  h('मैंने हार\nनहीं मानी,\nबस साँस ले ली।', 'Shayari', 'तीन पंक्ति', 'दृढ़', ['हार', 'साँस']),
  g('Tera naam meri diary mein nahi, meri aadat mein hai.', 'Shayari', 'Two line', 'Romantic', ['naam', 'aadat']),
  g('Shehar badla, chehre badle, kami wahi rahi.', 'Shayari', 'Two line', 'Aching', ['shehar', 'kami']),
  g('Maine haar nahi maani, bas saans le li.', 'Shayari', 'Two line', 'Firm', ['haar', 'saans']),

  /* ---------------------------------------------------- Quotes and ideas */
  e('Advice is cheap. Examples are expensive.', 'Quotes and thoughts', 'Wisdom', 'Sharp', ['quotes', 'advice']),
  e('You become reliable by being boring about important things.', 'Quotes and thoughts', 'Discipline', 'Wise', ['quotes', 'reliability']),
  e('If it can be fixed with sleep, it is not a crisis.', 'Quotes and thoughts', 'Perspective', 'Wry', ['quotes', 'perspective']),
  h('सलाह सस्ती है, मिसाल महँगी।', 'Quotes and thoughts', 'समझ', 'तीखा', ['सलाह', 'मिसाल']),
  h('ज़रूरी चीज़ों में उबाऊ बने रहने से भरोसा बनता है।', 'Quotes and thoughts', 'अनुशासन', 'गंभीर', ['भरोसा', 'उबाऊ']),
  h('जो नींद से ठीक हो जाए, वो संकट नहीं है।', 'Quotes and thoughts', 'नज़रिया', 'सहज', ['नींद', 'संकट']),
  g('Salah sasti hai, misaal mehngi.', 'Quotes and thoughts', 'Wisdom', 'Sharp', ['salah', 'misaal']),
  g('Zaroori cheezon mein ubaau bane rehne se bharosa banta hai.', 'Quotes and thoughts', 'Discipline', 'Wise', ['bharosa', 'ubaau']),
  g('Jo neend se theek ho jaye, woh sankat nahi hai.', 'Quotes and thoughts', 'Perspective', 'Wry', ['neend', 'sankat']),

  /* --------------------------------------------------- Life and reality */
  e('Nobody is coming to organise your life for you.', 'Life and reality', 'Reality', 'Direct', ['life', 'reality']),
  e('Most adult problems are sleep, money, or a conversation you avoided.', 'Life and reality', 'Reality', 'Wry', ['life', 'adulting']),
  e('You do not have to like everyone you respect.', 'Life and reality', 'People', 'Wise', ['life', 'respect']),
  h('तुम्हारी ज़िंदगी सँभालने कोई नहीं आ रहा।', 'Life and reality', 'हकीकत', 'स्पष्ट', ['ज़िंदगी', 'कोई']),
  h('बड़ी उम्र की ज़्यादातर दिक्कतें नींद, पैसा, या एक बात जो तुमने टाली थी।', 'Life and reality', 'हकीकत', 'सहज', ['नींद', 'पैसा']),
  h('जिन्हें इज़्ज़त देते हो, उन सबसे प्यार ज़रूरी नहीं।', 'Life and reality', 'लोग', 'गंभीर', ['इज़्ज़त', 'प्यार']),
  g('Tumhari zindagi sambhalne koi nahi aa raha.', 'Life and reality', 'Reality', 'Direct', ['zindagi', 'koi']),
  g('Badi umar ki zyadatar dikkatein neend, paisa, ya ek baat jo tumne taali thi.', 'Life and reality', 'Reality', 'Wry', ['neend', 'paisa']),
  g('Jinhe izzat dete ho, un sabse pyaar zaroori nahi.', 'Life and reality', 'People', 'Wise', ['izzat', 'pyaar']),

  /* ------------------------------------------------------- Motivational */
  e('Start before the plan looks respectable.', 'Motivational', 'Action', 'Direct', ['motivation', 'start']),
  e('Your standards are the only thing you fully control.', 'Motivational', 'Discipline', 'Firm', ['motivation', 'standards']),
  e('Show up badly rather than not at all.', 'Motivational', 'Consistency', 'Direct', ['motivation', 'consistency']),
  h('योजना इज़्ज़तदार दिखने से पहले शुरू करो।', 'Motivational', 'शुरुआत', 'स्पष्ट', ['योजना', 'शुरू']),
  h('बुरी तरह आना बेहतर है, न आने से।', 'Motivational', 'निरंतरता', 'स्पष्ट', ['आना', 'बेहतर']),
  g('Yojana izzatdaar dikhne se pehle shuru karo.', 'Motivational', 'Action', 'Direct', ['yojana', 'shuru']),
  g('Buri tarah aana behtar hai, na aane se.', 'Motivational', 'Consistency', 'Direct', ['aana', 'behtar']),

  /* ------------------------------------------------ Aesthetic and style */
  e('Paint every wall white and let the light do the decorating.', 'Aesthetic', 'Interiors', 'Warm', ['aesthetic', 'light']),
  e('Fewer things, better things, kept well.', 'Aesthetic', 'Simplicity', 'Composed', ['aesthetic', 'simplicity']),
  e('A single hand-painted pot can rescue a dull corner.', 'Aesthetic', 'Craft', 'Warm', ['aesthetic', 'craft']),
  g('Har deewar safed rakho, roshni khud sajai kar degi.', 'Aesthetic', 'Interiors', 'Warm', ['deewar', 'roshni']),
  g('Kam cheezein, achhi cheezein, dhang se rakhi hui.', 'Aesthetic', 'Simplicity', 'Composed', ['cheezein', 'dhang']),
  g('Kamre mein ek purana matka rakha, poore kamre ka mahaul badal gaya.', 'Aesthetic', 'Craft', 'Warm', ['kamre', 'mahaul']),

  /* ----------------------------------------------- Royal and VIP polish */
  e('Restraint is the most expensive thing you can wear.', 'Royal and VIP', 'Poise', 'Poised', ['royal', 'restraint']),
  e('A calm voice ends most fights in this city.', 'Royal and VIP', 'Composure', 'Poised', ['royal', 'calm']),
  g('Sanyam sabse mehnga kapda hai jo pehna ja sakta hai.', 'Royal and VIP', 'Poise', 'Composed', ['sanyam', 'kapda']),
  g('Shaant awaaz is shehar mein zyadatar jhagde khatam kar deti hai.', 'Royal and VIP', 'Composure', 'Poised', ['shaant', 'jhagde']),

  /* -------------------------------------------- Creator and influencer */
  e('Post less, build more, and let the work travel.', 'Creator and influencer', 'Strategy', 'Direct', ['creator', 'strategy']),
  e('An audience is a promise, not a trophy.', 'Creator and influencer', 'Ethics', 'Wise', ['creator', 'ethics']),
  e('I would rather be useful for ten years than viral for ten days.', 'Creator and influencer', 'Long game', 'Firm', ['creator', 'longgame']),
  g('Kam post karo, zyada banao, kaam khud safar karega.', 'Creator and influencer', 'Strategy', 'Direct', ['post', 'banao']),
  g('Audience ek waada hai, trophy nahi.', 'Creator and influencer', 'Ethics', 'Wise', ['audience', 'waada']),
  g('Das din viral hone se behtar hai das saal kaam ka aana.', 'Creator and influencer', 'Long game', 'Firm', ['kaam', 'saal']),

  /* ------------------------------------------------ Mid-field top-ups */
  e('Poems arrive at inconvenient times and leave quickly.', 'Poetry', 'Process', 'Wry', ['poetry', 'process']),
  e('The best book is the one somebody handed you personally.', 'Books and reading', 'Readers', 'Warm', ['books', 'gifts']),
  e('A simple dal, finished properly, tells you everything about a cook.', 'Food and cooking', 'Cooking', 'Wise', ['food', 'dal']),
  e('Rest is part of the programme, not a reward for it.', 'Fitness', 'Recovery', 'Practical', ['fitness', 'rest']),
  e('Bad light has ruined more photographs than bad cameras.', 'Photography', 'Craft', 'Practical', ['photography', 'light']),
  e('Old songs do what no new song can: they return your youth.', 'Music and art', 'Memory', 'Aching', ['music', 'memory']),
  e('Dogs teach you that ordinary evenings are the good part.', 'Pets and animals', 'Dogs', 'Warm', ['pets', 'dogs']),
  e('A comedy that respects its characters is a drama with better timing.', 'Cinema and OTT', 'Craft', 'Wise', ['cinema', 'comedy']),
  e('Monsoon is the only season that admits to being dramatic.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['monsoon', 'seasons']),
  h('कविता बेमौके आती है और जल्दी चली जाती है।', 'Poetry', 'रचना', 'सहज', ['कविता', 'बेमौके']),
  h('सादी दाल ढंग से बनी हो तो रसोइए की सारी कहानी बता देती है।', 'Food and cooking', 'रसोई', 'गंभीर', ['दाल', 'रसोई']),
  h('आराम कार्यक्रम का हिस्सा है, इनाम नहीं।', 'Fitness', 'आराम', 'व्यावहारिक', ['आराम', 'इनाम']),
  h('पुराने गाने वो देते हैं जो नए नहीं दे सकते: जवानी लौटा देते हैं।', 'Music and art', 'याद', 'भावुक', ['गाने', 'जवानी']),
  h('मानसून ही एक मौसम है जो नाटकीय होने की सच में स्वीकार करता है।', 'Monsoon and seasons', 'मानसून', 'सहज', ['मानसून', 'मौसम']),
  g('Kavita bemautke aati hai aur jaldi chali jaati hai.', 'Poetry', 'Process', 'Wry', ['kavita', 'jaldi']),
  g('Saadi daal dhang se bani ho toh raso ra ka saara kissa bata deti hai.', 'Food and cooking', 'Cooking', 'Wise', ['daal', 'kissa']),
  g('Aaram kaaryakram ka hissa hai, inaam nahi.', 'Fitness', 'Recovery', 'Practical', ['aaram', 'inaam']),
  g('Purane gaane woh dete hain jo naye nahi de sakte: jawaani lautate hain.', 'Music and art', 'Memory', 'Aching', ['gaane', 'jawaani']),
  g('Mausam sirf ek hi hai jo dramatic hone ko sach mein maanta hai.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['mausam', 'dramatic']),
];
