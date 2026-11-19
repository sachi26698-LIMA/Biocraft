/**
 * BioCraft original bios — batch 019.
 * Slightly Hinglish-weighted to close the 3.71% (HI) vs 3.47% (HG) gap.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_019 = [
  /* ------------------------------------------------ Hinglish depth (heavy) */
  g('Log samajhte hain chup rehna kamzori hai, asal mein woh sabse bada jawab hai.', 'Attitude', 'Restraint', 'Sharp', ['chup', 'jawab']),
  g('Mujhe kisi ki manzoori nahi chahiye, sirf apni.', 'Attitude', 'Self-respect', 'Firm', ['manzoori', 'apni']),
  g('Jo baat dil se nahi aayi, woh sirf shor hai.', 'Quotes and thoughts', 'Honesty', 'Wise', ['baat', 'shor']),
  g('Rishte nibhane padte hain, sirf bolne se nahi bante.', 'Love and romance', 'Devotion', 'Wise', ['rishte', 'bolne']),
  g('Tumhari yaad se zyada tumhari aadat bhaari hai.', 'Sad and heartbreak', 'Longing', 'Aching', ['yaad', 'aadat']),
  g('Kisi ko khone se pehle khud ko na khona.', 'Self-respect', 'Self-worth', 'Firm', ['khone', 'khud']),
  g('Zindagi mein sabse zaroori hunar hai sambhalna.', 'Life and reality', 'Resilience', 'Wise', ['hunar', 'sambhalna']),
  g('Kaam bolta hai, aur kuch nahi.', 'Professional and business', 'Craft', 'Direct', ['kaam', 'bolta']),
  g('Har dosti ka ek hisaab hota hai, par gehraai mein.', 'Friendship', 'Loyalty', 'Wise', ['dosti', 'hisaab']),
  g('Ghar chhota ho, dil bada rakhna.', 'Home and interiors', 'Home', 'Warm', ['ghar', 'dil']),
  g('Maa ki fikar aur dhoop, dono se bachna mushkil hai.', 'Family', 'Parents', 'Warm', ['maa', 'fikar']),
  g('Soch ko jagah do, gussa apne aap kam ho jaata hai.', 'Yoga and wellness', 'Calm', 'Calm', ['soch', 'gussa']),
  g('Ek achhi neend duniya ki aadhi problem hala kar deti hai.', 'Yoga and wellness', 'Rest', 'Grounded', ['neend', 'problem']),
  g('Kitaab chhoti ho ya badi, padhne ka mann hona chahiye.', 'Books and reading', 'Reading', 'Warm', ['kitaab', 'mann']),
  g('Gaana woh hota hai jo bina bole baat kar jaaye.', 'Music and art', 'Listening', 'Wise', ['gaana', 'baat']),
  g('Safar ki asli keemat wapas aakar samajh aati hai.', 'Travel and adventure', 'Travel style', 'Reflective', ['safar', 'keemat']),
  g('Chai ke bina subah adhoori lagti hai.', 'Food and cooking', 'Everyday', 'Warm', ['chai', 'subah']),
  g('Bachche jaldi bade nahi hote, hum jaldi thak jaate hain.', 'Parenting', 'Parent life', 'Honest', ['bachche', 'thak']),
  g('Cricket ne sabse zyada sabr sikhaya, haar ke baad bhi.', 'Cricket and sports', 'Cricket', 'Warm', ['cricket', 'sabr']),
  g('Bike ki awaaz se pata chal jaata hai mausam kaisa hai.', 'Cars and bikes', 'Riding', 'Wry', ['bike', 'mausam']),
  g('Billiyan ghar nahi chhodti, hum unhe chhod nahi paate.', 'Pets and animals', 'Cats', 'Warm', ['billiyan', 'ghar']),
  g('Gully ki baarish aur chai, yeh combination kabhi fail nahi hota.', 'Monsoon and seasons', 'Monsoon', 'Cozy', ['baarish', 'chai']),
  g('Camera se zyada zaroori hai dekhne ka sabr.', 'Photography', 'Craft', 'Observant', ['camera', 'sabr']),
  g('Har shaadi mein ek aisa rishtedaar hota hai jo sabko yaad rehta hai.', 'Wedding and celebration', 'Family', 'Funny', ['shaadi', 'rishtedaar']),
  g('Hanste hue kaam karna aasaan hota hai, sach mein.', 'Funny and comedy', 'Humour', 'Warm', ['hanste', 'kaam']),
  g('Code likhne se pehle sochna padta hai, warna dobara likhna padta hai.', 'Technology and coding', 'Developer', 'Dry', ['code', 'sochna']),
  g('Ek acchi tasveer hazar shabdon se zyada bolti hai.', 'Instagram profiles', 'Feed', 'Minimal', ['tasveer', 'shabdon']),
  g('Pahaad chadhne ke baad sab kuch chhota lagta hai.', 'Nature', 'Mountains', 'Wise', ['pahaad', 'chhota']),
  g('Kavita wo likhta hai jo bol nahi paata.', 'Poetry', 'Craft', 'Deep', ['kavita', 'bol']),
  g('Sadaa ki cheezein kabhi purani nahi lagti.', 'Minimal', 'Simplicity', 'Minimal', ['sadaa', 'purani']),
  g('Mehnat ka koi shortcut nahi hota, bas dikhawa hota hai.', 'Motivational', 'Discipline', 'Direct', ['mehnat', 'shortcut']),
  g('Akele waqt mein hi pata chalta hai ki tum kaun ho.', 'Alone and loneliness', 'Solitude', 'Wise', ['akele', 'pata']),
  g('Izzat kamai jaati hai, maangi nahi jaati.', 'Royal and VIP', 'Bearing', 'Regal', ['izzat', 'kamai']),
  g('Har subah ek naya faisla hai, purana bojh nahi.', 'Life and reality', 'Morning', 'Encouraging', ['subah', 'faisla']),

  /* -------------------------------------------------- Hindi depth */
  h('जो चुप रहकर सब सुन लेता है, वही सबसे ज़्यादा जानता है।', 'Quotes and thoughts', 'संयम', 'गंभीर', ['चुप', 'सुनना']),
  h('रिश्ते बोलने से नहीं, निभाने से बनते हैं।', 'Love and romance', 'निभाना', 'गंभीर', ['रिश्ते', 'निभाना']),
  h('मैं तुम्हें खोकर अपने आप को नहीं खोऊँगा।', 'Self-respect', 'स्वाभिमान', 'दृढ़', ['खोकर', 'आप']),
  h('सबसे बड़ा हुनर है खुद को संभालना।', 'Life and reality', 'संयम', 'गंभीर', ['हुनर', 'संभालना']),
  h('हर आदमी के पास एक कहानी है जो उसने किसी को नहीं सुनाई।', 'Deep and emotional', 'अकथनीय', 'गंभीर', ['कहानी', 'सुनाई']),
  h('आधी नींद पूरी कर लो, दुनिया कल भी वहीं मिलेगी।', 'Yoga and wellness', 'आराम', 'सहज', ['नींद', 'दुनिया']),
  h('जो किताब आपको रुलाती है, वही आपको बदलती है।', 'Books and reading', 'पढ़ना', 'भावुक', ['किताब', 'रुलाती']),
  h('गाना सुनते ही वह साल याद आ जाता है।', 'Music and art', 'सुनना', 'भावुक', ['गाना', 'साल']),
  h('सफ़र के बाद ही समझ आता है कि कहाँ जाना था।', 'Travel and adventure', 'सफ़र', 'गंभीर', ['सफ़र', 'समझ']),
  h('माँ की फ़िक्र से बचना उतना ही मुश्किल है जितना धूप से।', 'Family', 'माँ', 'कोमल', ['माँ', 'फ़िक्र']),
  h('दोस्ती का हिसाब गहराई में होता है, बातों में नहीं।', 'Friendship', 'साथ', 'गंभीर', ['दोस्ती', 'हिसाब']),
  h('क्रिकेट ने हार के बाद उठना सिखाया।', 'Cricket and sports', 'क्रिकेट', 'सहज', ['क्रिकेट', 'हार']),
  h('कभी-कभी रुक जाना भी आगे बढ़ना होता है।', 'Motivational', 'निरंतरता', 'गंभीर', ['रुकना', 'बढ़ना']),
  h('जो अपनी गलती मान लेता है, वो सबसे मज़बूत होता है।', 'Attitude', 'स्पष्टता', 'दृढ़', ['गलती', 'मज़बूत']),

  /* -------------------------------------------------- English depth */
  e('The most expensive thing you own is your attention.', 'Quotes and thoughts', 'Attention', 'Wise', ['quotes', 'attention']),
  e('I have learned to be suspicious of easy agreement.', 'Quotes and thoughts', 'Discernment', 'Sharp', ['quotes', 'agreement']),
  e('A person who can sit in silence is rarely manipulated.', 'Attitude', 'Composure', 'Wise', ['attitude', 'silence']),
  e('You will be judged by your consistency, not your intentions.', 'Professional and business', 'Reputation', 'Direct', ['business', 'consistency']),
  e('Good company is the cheapest therapy available.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'company']),
  e('I want a life with fewer screens and better light.', 'Aesthetic', 'Slow living', 'Calm', ['aesthetic', 'life']),
  e('Some people are a season. Stop asking them to be a climate.', 'Love and romance', 'Clarity', 'Wise', ['love', 'clarity']),
  e('Grief is just love looking for somewhere to go.', 'Sad and heartbreak', 'Grief', 'Heavy', ['sad', 'grief']),
  e('The book you avoid is usually the one you needed.', 'Books and reading', 'Reader life', 'Wise', ['books', 'avoidance']),
  e('Cooking for someone is a sentence with no words in it.', 'Food and cooking', 'Home kitchen', 'Warm', ['food', 'care']),
  e('Healing is mostly admin you do not want to do.', 'Life and reality', 'Healing', 'Dry', ['life', 'healing']),
  e('I keep a small circle and a long memory.', 'Attitude', 'Loyalty', 'Cool', ['attitude', 'loyalty']),
  e('Ride slower than you can. The road is not a race.', 'Cars and bikes', 'Riding', 'Wise', ['bikes', 'patience']),
  e('A photograph is a promise that this mattered.', 'Photography', 'Craft', 'Wise', ['photography', 'memory']),
  e('Show up early. It is the cheapest advantage there is.', 'Motivational', 'Preparation', 'Practical', ['motivation', 'punctuality']),
];
