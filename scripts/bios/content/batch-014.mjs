/**
 * BioCraft original bios — batch 014.
 * Depth phase: the seven highest-demand categories.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_014 = [
  /* -------------------------------------------------------------- Attitude */
  e('I negotiate with reality. Not with people who waste my time.', 'Attitude', 'Standards', 'Direct', ['attitude', 'standards']),
  e('No revenge. Just a permanent change of address in my head.', 'Attitude', 'Distance', 'Cool', ['attitude', 'distance']),
  e('Opinions arrive free. Mine cost attention.', 'Attitude', 'Restraint', 'Witty', ['attitude', 'attention']),
  e('I have a limit and it has a name.', 'Attitude', 'Boundaries', 'Terse', ['attitude', 'limits']),
  e('The version of me that people-pleased has retired.', 'Attitude', 'Growth', 'Honest', ['attitude', 'growth']),
  e('You cannot embarrass someone who has already made peace with himself.', 'Attitude', 'Composure', 'Calm', ['attitude', 'peace']),
  e('Warm by choice. Distant by policy.', 'Attitude', 'Boundaries', 'Cool', ['attitude', 'warmth']),
  e('I do not need the last word. I need the last laugh.', 'Attitude', 'Humour', 'Witty', ['attitude', 'humour']),
  h('मैं हद तक जाता हूँ, हद के बाद नहीं।', 'Attitude', 'सीमाएं', 'स्पष्ट', ['हद', 'सीमा']),
  h('जो लोग समय बर्बाद करते हैं, उनके लिए मेरे पास वक़्त नहीं।', 'Attitude', 'सीमाएं', 'स्पष्ट', ['समय', 'वक़्त']),
  h('मैंने लोगों को खुश करना छोड़ दिया, खुद को नहीं।', 'Attitude', 'विकास', 'दृढ़', ['खुश', 'विकास']),
  h('मेरी शांति किसी की मर्ज़ी पर नहीं है।', 'Attitude', 'शांति', 'शांत', ['शांति', 'मर्ज़ी']),
  h('बोलने से बड़ा काम है चुप रहकर सही रहना।', 'Attitude', 'संयम', 'गंभीर', ['चुप', 'सही']),
  g('Main hadd tak jaata hoon, hadd ke baad nahi.', 'Attitude', 'Boundaries', 'Direct', ['hadd', 'baad']),
  g('Logon ko khush karna chhod diya, khud ko nahi.', 'Attitude', 'Growth', 'Firm', ['khush', 'khud']),
  g('Meri shaanti kisi ki marzi par nahi hai.', 'Attitude', 'Composure', 'Calm', ['shaanti', 'marzi']),
  g('Bolne se bada kaam hai chup rehkar sahi rehna.', 'Attitude', 'Restraint', 'Wise', ['chup', 'sahi']),

  /* ------------------------------------------------------ Love and romance */
  e('I want a love that survives a boring Tuesday.', 'Love and romance', 'Real love', 'Warm', ['love', 'everyday']),
  e('You are the plan I did not make and would not change.', 'Love and romance', 'Devoted', 'Romantic', ['love', 'plans']),
  e('Two people choosing each other on the unremarkable days.', 'Love and romance', 'Real love', 'Tender', ['love', 'choice']),
  e('I love you in verbs, not adjectives.', 'Love and romance', 'Devotion', 'Wise', ['love', 'actions']),
  e('Whatever we become, let us stay kind about it.', 'Love and romance', 'Respect', 'Honest', ['love', 'kindness']),
  e('You make the ordinary feel like a decision I got right.', 'Love and romance', 'Admiration', 'Sweet', ['love', 'ordinary']),
  e('My favourite habit is knowing where you are.', 'Love and romance', 'Closeness', 'Tender', ['love', 'habit']),
  h('मुझे वो प्यार चाहिए जो साधारण मंगलवार भी निभा सके।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['प्यार', 'साधारण']),
  h('तुम वो योजना हो जो मैंने बनाई नहीं, बदलूँगा भी नहीं।', 'Love and romance', 'साथ', 'कोमल', ['योजना', 'साथ']),
  h('मैं क्रिया से प्यार करता हूँ, बातों से नहीं।', 'Love and romance', 'निभाना', 'गंभीर', ['प्यार', 'क्रिया']),
  h('जो भी हो जाए, हम एक-दूसरे के लिए नरम रहें।', 'Love and romance', 'आदर', 'कोमल', ['नरम', 'आदर']),
  g('Mujhe woh pyaar chahiye jo saadharan mangalvaar bhi nibha sake.', 'Love and romance', 'Real love', 'Warm', ['pyaar', 'saadharan']),
  g('Tum woh yojana ho jo maine banai nahi, badlunga bhi nahi.', 'Love and romance', 'Devoted', 'Romantic', ['yojana', 'badlunga']),
  g('Main kriya se pyaar karta hoon, baaton se nahi.', 'Love and romance', 'Devotion', 'Wise', ['kriya', 'baaton']),
  g('Jo bhi ho jaye, hum ek doosre ke liye naram rahein.', 'Love and romance', 'Respect', 'Tender', ['naram', 'rahein']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I am the person who remembers anniversaries nobody celebrates anymore.', 'Sad and heartbreak', 'Loss', 'Aching', ['sad', 'memory']),
  e('Some goodbyes are quiet and take years to finish.', 'Sad and heartbreak', 'Grief', 'Heavy', ['sad', 'goodbye']),
  e('I have healed enough to be honest about what broke.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'healing']),
  e('The empty side of the bed is very good at arithmetic.', 'Sad and heartbreak', 'Absence', 'Raw', ['sad', 'absence']),
  e('I stopped writing to you. I did not stop writing.', 'Sad and heartbreak', 'Grief', 'Aching', ['sad', 'writing']),
  h('कुछ विदाई चुपचाप होती है और सालों लगती है।', 'Sad and heartbreak', 'जुदाई', 'गंभीर', ['विदाई', 'साल']),
  h('मैं उतना ठीक हो गया हूँ कि सच बोल सकूँ।', 'Sad and heartbreak', 'उबरना', 'स्पष्ट', ['ठीक', 'सच']),
  h('तुम्हें लिखना छोड़ दिया, लिखना नहीं।', 'Sad and heartbreak', 'याद', 'भावुक', ['लिखना', 'याद']),
  h('याद वो नहीं जो याद आए, वो जो कभी जाए ही नहीं।', 'Sad and heartbreak', 'लापता', 'गंभीर', ['याद', 'लापता']),
  g('Kuch vidaai chupchaap hoti hai aur saalon lagti hain.', 'Sad and heartbreak', 'Grief', 'Heavy', ['vidaai', 'saalon']),
  g('Main utna theek ho gaya hoon ki sach bol sakoon.', 'Sad and heartbreak', 'Recovery', 'Honest', ['theek', 'sach']),
  g('Tumhe likhna chhod diya, likhna nahi.', 'Sad and heartbreak', 'Loss', 'Aching', ['likhna', 'chhod']),
  g('Yaad woh nahi jo yaad aaye, woh jo kabhi jaaye hi nahi.', 'Sad and heartbreak', 'Longing', 'Deep', ['yaad', 'jaaye']),

  /* --------------------------------------------------------- Shayari depth */
  h('मैं तुझे खोकर कुछ और नहीं बना,\nबस खुद से थोड़ा और साफ़ हो गया।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['खोकर', 'साफ़']),
  h('रात भर जागे, कुछ सोचा, कुछ लिखा,\nसुबह सब हटा दिया, दिल हल्का रहा।', 'Shayari', 'दो पंक्ति', 'सहज', ['रात', 'सुबह']),
  h('तेरे नाम की चाय अब ठंडी हो जाती है,\nक्योंकि पीने वाला बदल गया।', 'Shayari', 'दो पंक्ति', 'भावुक', ['चाय', 'बदल']),
  h('जिसे देखकर आँखें भर आएं,\nउसी से नज़रें क्यों नहीं मिलतीं।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['आँखें', 'नज़रें']),
  h('मैं अपने ज़ख़्म दिखाता नहीं,\nपर उनका हिसाब रखता हूँ।', 'Shayari', 'दो पंक्ति', 'दृढ़', ['ज़ख़्म', 'हिसाब']),
  h('सब कुछ मिल जाता है एक दिन,\nबस वो एक दिन बहुत दूर होता है।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['मिलना', 'दिन']),
  h('तू मेरी आदत नहीं, मेरी भाषा है,\nजिसे बोलना छोड़ दूँ तो अधूरा रह जाऊँ।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['आदत', 'भाषा']),
  g('Maine tujhe khokar kuch aur nahi bana, bas khud se saaf ho gaya.', 'Shayari', 'Two line', 'Deep', ['khokar', 'saaf']),
  g('Raat bhar jaage, kuch socha, kuch likha, subah sab hata diya.', 'Shayari', 'Two line', 'Calm', ['raat', 'subah']),
  g('Tere naam ki chai ab thandi ho jaati hai.', 'Shayari', 'Two line', 'Aching', ['chai', 'thandi']),
  g('Jise dekhkar aankhein bhar aayein, usi se nazrein kyun nahi milti.', 'Shayari', 'Two line', 'Romantic', ['aankhein', 'nazrein']),
  g('Main apne zakhm dikhata nahi, par unka hisaab rakhta hoon.', 'Shayari', 'Two line', 'Firm', ['zakhm', 'hisaab']),
  g('Sab kuch mil jaata hai ek din, bas woh din bahut door hota hai.', 'Shayari', 'Two line', 'Deep', ['mil', 'door']),
  g('Tu meri aadat nahi, meri bhasha hai.', 'Shayari', 'Two line', 'Romantic', ['aadat', 'bhasha']),

  /* ------------------------------------------------------ Life and reality */
  e('You cannot borrow someone else and call it a plan.', 'Life and reality', 'Agency', 'Direct', ['life', 'agency']),
  e('Some years are for building. Some are for recovering. Both count.', 'Life and reality', 'Seasons of life', 'Wise', ['life', 'seasons']),
  e('The best thing I did was stop explaining my choices to sceptics.', 'Life and reality', 'Confidence', 'Honest', ['life', 'confidence']),
  e('Your standards are what you accept when you are tired.', 'Life and reality', 'Standards', 'Sharp', ['life', 'standards']),
  h('दूसरों से उधार लेकर अपनी ज़िंदगी नहीं बनती।', 'Life and reality', 'ज़िम्मेदारी', 'स्पष्ट', ['ज़िंदगी', 'उधार']),
  h('कुछ साल बनाने के होते हैं, कुछ सँभलने के। दोनों ज़रूरी हैं।', 'Life and reality', 'समय', 'गंभीर', ['साल', 'सँभलना']),
  h('थके हुए दिन जो मंज़ूर करते हो, वही तुम्हारे मानक हैं।', 'Life and reality', 'मानक', 'गंभीर', ['थके', 'मानक']),
  g('Doosron se udhaar lekar apni zindagi nahi banti.', 'Life and reality', 'Agency', 'Direct', ['udhaar', 'zindagi']),
  g('Kuch saal banane ke hote hain, kuch sambhalne ke.', 'Life and reality', 'Seasons of life', 'Wise', ['saal', 'sambhalne']),
  g('Thake hue din jo manzoor karte ho, wahi tumhare maanak hain.', 'Life and reality', 'Standards', 'Sharp', ['thake', 'maanak']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('Be the calm in the meeting, not the loudest slide.', 'Quotes and thoughts', 'Composure', 'Wise', ['quotes', 'calm']),
  e('Kindness scales better than cleverness.', 'Quotes and thoughts', 'Kindness', 'Wise', ['quotes', 'kindness']),
  e('If nobody would notice its absence, you probably do not need it.', 'Quotes and thoughts', 'Minimalism', 'Practical', ['quotes', 'minimal']),
  e('Reading is the cheapest way to argue with someone smart.', 'Quotes and thoughts', 'Reading', 'Witty', ['quotes', 'reading']),
  h('मीटिंग में सबसे शांत आदमी बनो, सबसे तेज़ स्लाइड नहीं।', 'Quotes and thoughts', 'संयम', 'गंभीर', ['मीटिंग', 'शांत']),
  h('दया चतुराई से ज़्यादा टिकती है।', 'Quotes and thoughts', 'दया', 'गंभीर', ['दया', 'चतुराई']),
  h('पढ़ना सबसे सस्ता तरीका है किसी समझदार से बहस करने का।', 'Quotes and thoughts', 'पढ़ना', 'सहज', ['पढ़ना', 'बहस']),
  g('Meeting mein sabse shaant aadmi bano, sabse tez slide nahi.', 'Quotes and thoughts', 'Composure', 'Wise', ['meeting', 'shaant']),
  g('Daya chaturai se zyada tikti hai.', 'Quotes and thoughts', 'Kindness', 'Wise', ['daya', 'chaturai']),
  g('Padhna sabse sasta tareeka hai kisi samajhdaar se bahas karne ka.', 'Quotes and thoughts', 'Reading', 'Witty', ['padhna', 'bahas']),

  /* ------------------------------------------------------------- Aesthetic */
  e('Textures over trends, always.', 'Aesthetic', 'Texture', 'Terse', ['aesthetic', 'texture']),
  e('A room should sound as good as it looks.', 'Aesthetic', 'Interiors', 'Calm', ['aesthetic', 'sound']),
  e('Sunsets are free and still underrated.', 'Aesthetic', 'Nature', 'Warm', ['aesthetic', 'sunsets']),
  h('बनावट फ़ैशन से ज़्यादा टिकती है।', 'Aesthetic', 'बनावट', 'संक्षिप्त', ['बनावट', 'फ़ैशन']),
  h('कमरा देखने में जितना अच्छा लगे, सुनने में भी लगे।', 'Aesthetic', 'घर', 'शांत', ['कमरा', 'सुनना']),
  g('Banawat fashion se zyada tikti hai.', 'Aesthetic', 'Texture', 'Terse', ['banawat', 'fashion']),
  g('Kamra dekhne mein jitna accha lage, sunne mein bhi lage.', 'Aesthetic', 'Interiors', 'Calm', ['kamra', 'sunne']),

  /* --------------------------------------------------- Motivational depth */
  e('Motivation is a visitor. Discipline lives here.', 'Motivational', 'Discipline', 'Direct', ['motivation', 'discipline']),
  e('Build the habit small enough to be boring.', 'Motivational', 'Habit', 'Practical', ['motivation', 'habit']),
  e('Progress is quiet and it looks a lot like routine.', 'Motivational', 'Progress', 'Wise', ['motivation', 'progress']),
  h('प्रेरणा मेहमान है, अनुशासन घर में रहता है।', 'Motivational', 'अनुशासन', 'स्पष्ट', ['प्रेरणा', 'अनुशासन']),
  h('आदत इतनी छोटी रखो कि बोरिंग लगे।', 'Motivational', 'आदत', 'व्यावहारिक', ['आदत', 'छोटी']),
  g('Prerna mehmaan hai, anushasan ghar mein rehta hai.', 'Motivational', 'Discipline', 'Direct', ['prerna', 'anushasan']),
  g('Aadat itni chhoti rakho ki boring lage.', 'Motivational', 'Habit', 'Practical', ['aadat', 'boring']),
];
