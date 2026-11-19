/**
 * BioCraft original bios — batch 017.
 * Depth continues: attitude, love, shayari, sad, quotes, life at 40/30/30.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_017 = [
  /* -------------------------------------------------------------- Attitude */
  e('I am not hard to read. I am just not subtitled.', 'Attitude', 'Composure', 'Witty', ['attitude', 'direct']),
  e('My standards are not a phase you can wait out.', 'Attitude', 'Standards', 'Firm', ['attitude', 'standards']),
  e('I have removed people from my life with less drama than a haircut.', 'Attitude', 'Boundaries', 'Dry', ['attitude', 'boundaries']),
  e('Talk is cheap. I have stopped shopping.', 'Attitude', 'Results', 'Sharp', ['attitude', 'results']),
  e('You can disagree with me and still be wrong.', 'Attitude', 'Confidence', 'Witty', ['attitude', 'confidence']),
  e('I do not need an audience to keep a promise.', 'Attitude', 'Integrity', 'Steady', ['attitude', 'integrity']),
  e('Being underestimated has been excellent for my focus.', 'Attitude', 'Composure', 'Cool', ['attitude', 'focus']),
  e('I am not antisocial. I am selectively available.', 'Attitude', 'Boundaries', 'Wry', ['attitude', 'selective']),
  e('Respect the no the first time and we stay friends.', 'Attitude', 'Boundaries', 'Firm', ['attitude', 'no']),
  h('मैं पढ़ने में मुश्किल नहीं, बस सबके लिए नहीं हूँ।', 'Attitude', 'स्पष्टता', 'स्पष्ट', ['पढ़ना', 'सबके']),
  h('मेरे मानक मौसम नहीं हैं जो बदल जाएं।', 'Attitude', 'मानक', 'दृढ़', ['मानक', 'मौसम']),
  h('बातें सस्ती हैं, इसलिए मैंने खरीदना छोड़ दिया।', 'Attitude', 'काम', 'तीखा', ['बातें', 'काम']),
  h('मुझसे सहमत न होना तुम्हारा अधिकार है, सही होना नहीं।', 'Attitude', 'आत्मविश्वास', 'तीखा', ['सहमत', 'सही']),
  h('ना को पहली बार में समझो, दोस्ती बनी रहेगी।', 'Attitude', 'सीमाएं', 'दृढ़', ['ना', 'दोस्ती']),
  g('Main padhne mein mushkil nahi, bas sabke liye nahi hoon.', 'Attitude', 'Honesty', 'Direct', ['padhne', 'sabke']),
  g('Mere maanak mausam nahi hain jo badal jayein.', 'Attitude', 'Standards', 'Firm', ['maanak', 'mausam']),
  g('Baatein sasti hain, isliye maine kharidna chhod diya.', 'Attitude', 'Results', 'Sharp', ['baatein', 'kharidna']),
  g('Mujhse sehmat na hona tumhara adhikaar hai, sahi hona nahi.', 'Attitude', 'Confidence', 'Witty', ['sehmat', 'sahi']),
  g('Na ko pehli baar mein samjho, dosti bani rahegi.', 'Attitude', 'Boundaries', 'Firm', ['na', 'dosti']),

  /* ------------------------------------------------------ Love and romance */
  e('I would rather be honest with you than impressive.', 'Love and romance', 'Honesty', 'Tender', ['love', 'honesty']),
  e('You are the person I tell the boring news to first.', 'Love and romance', 'Closeness', 'Warm', ['love', 'first']),
  e('Loving you is the easiest habit I have ever kept.', 'Love and romance', 'Devotion', 'Sweet', ['love', 'habit']),
  e('We do not need a big life. We need a good one.', 'Love and romance', 'Real love', 'Grounded', ['love', 'life']),
  e('I remember the small things because they are the whole thing.', 'Love and romance', 'Attention', 'Wise', ['love', 'attention']),
  e('Your calm is the reason my chaos has somewhere to land.', 'Love and romance', 'Comfort', 'Tender', ['love', 'calm']),
  e('I am not afraid of forever. I am afraid of wasting it.', 'Love and romance', 'Serious', 'Honest', ['love', 'forever']),
  e('You laugh at the wrong time and it fixes my day.', 'Love and romance', 'Everyday', 'Warm', ['love', 'laughter']),
  h('मैं तुम्हारे सामने प्रभावशाली नहीं, ईमानदार बनना चाहता हूँ।', 'Love and romance', 'ईमानदारी', 'कोमल', ['ईमानदारी', 'प्रभाव']),
  h('तुम वो हो जिसे मैं बोरिंग ख़बर सबसे पहले बताता हूँ।', 'Love and romance', 'नज़दीकी', 'सहज', ['ख़बर', 'पहले']),
  h('हमें बड़ी ज़िंदगी नहीं, अच्छी ज़िंदगी चाहिए।', 'Love and romance', 'रोज़मर्रा', 'गंभीर', ['ज़िंदगी', 'अच्छी']),
  h('तुम्हारा ठहराव ही मेरी जल्दबाज़ी का घर है।', 'Love and romance', 'सुकून', 'कोमल', ['ठहराव', 'घर']),
  h('छोटी बातें याद रखता हूँ, क्योंकि वही सब कुछ हैं।', 'Love and romance', 'ध्यान', 'कोमल', ['बातें', 'याद']),
  g('Main tumhare saamne prabhavshali nahi, imaandaar banna chahta hoon.', 'Love and romance', 'Honesty', 'Tender', ['imaandaar', 'chahta']),
  g('Tum woh ho jise main boring khabar sabse pehle batata hoon.', 'Love and romance', 'Closeness', 'Warm', ['khabar', 'pehle']),
  g('Humein badi zindagi nahi, acchi zindagi chahiye.', 'Love and romance', 'Real love', 'Grounded', ['zindagi', 'acchi']),
  g('Chhoti baatein yaad rakhta hoon, kyunki wahi sab kuch hain.', 'Love and romance', 'Attention', 'Wise', ['baatein', 'yaad']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I have a whole shelf in my head for things I cannot say.', 'Sad and heartbreak', 'Restraint', 'Heavy', ['sad', 'silence']),
  e('The day you left I learned how quiet a room can be.', 'Sad and heartbreak', 'Absence', 'Aching', ['sad', 'absence']),
  e('I keep forgiving you in my head and it never sends.', 'Sad and heartbreak', 'Grief', 'Raw', ['sad', 'forgiveness']),
  e('Not every love ends with a fight. Some just lose schedule.', 'Sad and heartbreak', 'Drift', 'Wise', ['sad', 'drift']),
  e('I am doing fine, which is the problem with fine.', 'Sad and heartbreak', 'Numbness', 'Honest', ['sad', 'fine']),
  e('Your number is still in my phone under a name I deleted.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'memory']),
  h('मेरे भीतर बहुत कुछ है जो कहा नहीं गया।', 'Sad and heartbreak', 'अकथनीय', 'गंभीर', ['भीतर', 'कहा']),
  h('तुम गए तो पता चला कमरा कितना चुप हो सकता है।', 'Sad and heartbreak', 'गैरहाज़िरी', 'भावुक', ['कमरा', 'चुप']),
  h('हर प्यार की आखिरी लड़ाई नहीं होती, कुछ बस टाइम छोड़ देते हैं।', 'Sad and heartbreak', 'जुदाई', 'गंभीर', ['प्यार', 'टाइम']),
  h('मैं ठीक हूँ, और ठीक होने में ही दिक्कत है।', 'Sad and heartbreak', 'उदासी', 'भावुक', ['ठीक', 'दिक्कत']),
  g('Mere bheetar bahut kuch hai jo kaha nahi gaya.', 'Sad and heartbreak', 'Restraint', 'Heavy', ['bheetar', 'kaha']),
  g('Tum gaye toh pata chala kamra kitna chup ho sakta hai.', 'Sad and heartbreak', 'Absence', 'Aching', ['kamra', 'chup']),
  g('Main theek hoon, aur theek hone mein hi dikkat hai.', 'Sad and heartbreak', 'Numbness', 'Honest', ['theek', 'dikkat']),

  /* ------------------------------------------------------ Shayari depth */
  h('मैं तेरे बाद भी पूरा हूँ,\nपर पहले जैसा नहीं।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['पूरा', 'पहले']),
  h('कुछ बातें सोच के कही जाती हैं,\nकुछ रातों में अपने आप निकल जाती हैं।', 'Shayari', 'दो पंक्ति', 'सहज', ['बातें', 'रातें']),
  h('मेरी कमी तू नहीं था,\nमेरी आदत तू था।', 'Shayari', 'दो पंक्ति', 'भावुक', ['कमी', 'आदत']),
  h('जो कह गया सब कुछ, वो कम कह गया,\nजो चुप रह गया, वही बहुत था।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['चुप', 'कहा']),
  h('तेरे शहर में अब भी वही दुकान है,\nबस हम वहाँ नहीं जाते।', 'Shayari', 'दो पंक्ति', 'भावुक', ['शहर', 'दुकान']),
  h('मैं जीतने नहीं आया था,\nमैं बस अपने साथ खड़ा था।', 'Shayari', 'दो पंक्ति', 'दृढ़', ['जीतना', 'साथ']),
  h('इक्कीस दिन में आदत बनती है,\nऔर कई सालों में भी नहीं छूटती।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['आदत', 'साल']),
  g('Main tere baad bhi poora hoon, par pehle jaisa nahi.', 'Shayari', 'Two line', 'Deep', ['poora', 'pehle']),
  g('Kuch baatein soch ke kahi jaati hain, kuch raaton mein nikal jaati hain.', 'Shayari', 'Two line', 'Calm', ['baatein', 'raaton']),
  g('Meri kami tu nahi tha, meri aadat tu tha.', 'Shayari', 'Two line', 'Aching', ['kami', 'aadat']),
  g('Tere shehar mein ab bhi wahi dukaan hai, bas hum wahan nahi jaate.', 'Shayari', 'Two line', 'Aching', ['shehar', 'dukaan']),
  g('Ikkis din mein aadat banti hai, aur saalon mein bhi nahi chhut-ti.', 'Shayari', 'Two line', 'Deep', ['aadat', 'saalon']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('Competence is a very quiet kind of confidence.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'competence']),
  e('You cannot build a reputation on what you are going to do.', 'Quotes and thoughts', 'Action', 'Direct', ['quotes', 'action']),
  e('The kindest thing is often the clearest thing.', 'Quotes and thoughts', 'Kindness', 'Wise', ['quotes', 'clarity']),
  e('A hard truth ages better than a soft lie.', 'Quotes and thoughts', 'Honesty', 'Sharp', ['quotes', 'honesty']),
  e('Do not take criticism from someone you would not take advice from.', 'Quotes and thoughts', 'Discernment', 'Wise', ['quotes', 'criticism']),
  h('काबिलियत सबसे शांत आत्मविश्वास होती है।', 'Quotes and thoughts', 'काम', 'गंभीर', ['काबिलियत', 'शांत']),
  h('जो करने जा रहे हो, उससे साख नहीं बनती।', 'Quotes and thoughts', 'कर्म', 'स्पष्ट', ['साख', 'कर्म']),
  h('कड़वा सच नरम झूठ से ज़्यादा टिकता है।', 'Quotes and thoughts', 'सच', 'गंभीर', ['सच', 'झूठ']),
  h('जिसकी सलाह न लो, उसकी आलोचना भी मत लो।', 'Quotes and thoughts', 'समझ', 'स्पष्ट', ['सलाह', 'आलोचना']),
  g('Kaabiliyat sabse shaant atmavishwas hoti hai.', 'Quotes and thoughts', 'Craft', 'Wise', ['kaabiliyat', 'shaant']),
  g('Jo karne ja rahe ho, usse saakh nahi banti.', 'Quotes and thoughts', 'Action', 'Direct', ['saakh', 'karne']),
  g('Kadwa sach naram jhooth se zyada tikta hai.', 'Quotes and thoughts', 'Honesty', 'Sharp', ['kadwa', 'jhooth']),
  g('Jiski salaah na lo, uski aalochana bhi mat lo.', 'Quotes and thoughts', 'Discernment', 'Wise', ['salaah', 'aalochana']),

  /* ------------------------------------------------------ Life and reality */
  e('Most of adulthood is deciding what not to reply to.', 'Life and reality', 'Boundaries', 'Wry', ['life', 'boundaries']),
  e('You get one body and a limited number of good mornings.', 'Life and reality', 'Perspective', 'Wise', ['life', 'perspective']),
  e('Choose friends who are honest when it is inconvenient.', 'Life and reality', 'People', 'Wise', ['life', 'friendship']),
  e('Every deadline is a decision about what matters.', 'Life and reality', 'Priorities', 'Practical', ['life', 'priorities']),
  e('I stopped keeping score and started keeping promises.', 'Life and reality', 'Growth', 'Honest', ['life', 'growth']),
  h('बड़ा होने का ज़्यादातर हिस्सा है तय करना कि किसे जवाब नहीं देना।', 'Life and reality', 'सीमाएं', 'सहज', ['जवाब', 'तय']),
  h('एक शरीर मिला है और कुछ गिनी हुई अच्छी सुबहें।', 'Life and reality', 'समझ', 'गंभीर', ['शरीर', 'सुबह']),
  h('मैंने हिसाब रखना छोड़ा, वादे निभाना शुरू किया।', 'Life and reality', 'विकास', 'स्पष्ट', ['हिसाब', 'वादे']),
  g('Bada hone ka zyadatar hissa hai tay karna kise jawab nahi dena.', 'Life and reality', 'Boundaries', 'Wry', ['jawab', 'tay']),
  g('Maine hisaab rakhna chhoda, wade nibhana shuru kiya.', 'Life and reality', 'Growth', 'Honest', ['hisaab', 'wade']),

  /* --------------------------------------------------- Motivational depth */
  e('The work does not care how you feel. That is its gift.', 'Motivational', 'Discipline', 'Direct', ['motivation', 'discipline']),
  e('Ten years of average effort beats one year of obsession.', 'Motivational', 'Consistency', 'Wise', ['motivation', 'consistency']),
  e('You do not find time. You take it from something.', 'Motivational', 'Priorities', 'Sharp', ['motivation', 'time']),
  e('Boredom is the price of mastery and nobody warns you.', 'Motivational', 'Craft', 'Wise', ['motivation', 'mastery']),
  h('काम को फ़र्क़ नहीं पड़ता तुम कैसा महसूस करते हो। यही उसका तोहफ़ा है।', 'Motivational', 'अनुशासन', 'स्पष्ट', ['काम', 'तोहफ़ा']),
  h('दस साल की औसत मेहनत एक साल की जुनूनी मेहनत से बेहतर है।', 'Motivational', 'निरंतरता', 'गंभीर', ['मेहनत', 'साल']),
  h('समय मिलता नहीं, किसी चीज़ से लिया जाता है।', 'Motivational', 'प्राथमिकता', 'स्पष्ट', ['समय', 'प्राथमिकता']),
  g('Kaam ko farq nahi padta tum kaisa mehsoos karte ho.', 'Motivational', 'Discipline', 'Direct', ['kaam', 'mehsoos']),
  g('Das saal ki ausat mehnat ek saal ke junoon se behtar hai.', 'Motivational', 'Consistency', 'Wise', ['mehnat', 'junoon']),

  /* ------------------------------------------------------------ Aesthetic */
  e('A warm lamp and a cold evening. Perfect combination.', 'Aesthetic', 'Slow living', 'Calm', ['aesthetic', 'evening']),
  e('I like spaces that look like someone lives in them.', 'Aesthetic', 'Interiors', 'Warm', ['aesthetic', 'home']),
  e('Old buildings have better manners than new ones.', 'Aesthetic', 'Architecture', 'Wry', ['aesthetic', 'architecture']),
  h('गर्म लैंप और ठंडी शाम, बस यही चाहिए।', 'Aesthetic', 'सुबह', 'शांत', ['लैंप', 'शाम']),
  h('पुरानी इमारतों में नई से ज़्यादा सलीका है।', 'Aesthetic', 'बनावट', 'सहज', ['इमारत', 'सलीका']),
  g('Garam lamp aur thandi shaam, bas yahi chahiye.', 'Aesthetic', 'Slow living', 'Calm', ['lamp', 'shaam']),
  g('Puraani imaaraton mein nai se zyada saleeka hai.', 'Aesthetic', 'Architecture', 'Wry', ['imaaraton', 'saleeka']),

  /* --------------------------------------------------- Friendship depth */
  e('The friend who tells you the truth before the party.', 'Friendship', 'Honesty', 'Warm', ['friendship', 'honesty']),
  e('We have been through four cities and one bad haircut.', 'Friendship', 'Time', 'Funny', ['friendship', 'years']),
  h('वो दोस्त जो पार्टी से पहले सच बता दे।', 'Friendship', 'सच', 'कोमल', ['दोस्त', 'सच']),
  g('Woh dost jo party se pehle sach bata de, wahi asli hai.', 'Friendship', 'Honesty', 'Warm', ['dost', 'sach']),
  g('Char shehar aur ek bura haircut, sab saath jhela.', 'Friendship', 'Time', 'Funny', ['shehar', 'saath']),

  /* -------------------------------------------------- Royal and VIP depth */
  e('Grace under pressure is the only inheritance that matters.', 'Royal and VIP', 'Bearing', 'Wise', ['royal', 'grace']),
  e('A title is a responsibility with better tailoring.', 'Royal and VIP', 'Duty', 'Poised', ['royal', 'duty']),
  h('दबाव में भी शालीनता रहना ही असली विरासत है।', 'Royal and VIP', 'किरदार', 'गंभीर', ['शालीनता', 'विरासत']),
  g('Dabaav mein bhi shaalinta rehna hi asli virasat hai.', 'Royal and VIP', 'Bearing', 'Regal', ['shaalinta', 'virasat']),
];
