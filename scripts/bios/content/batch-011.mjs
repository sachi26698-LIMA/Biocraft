/**
 * BioCraft original bios — batch 011.
 * Hinglish-weighted to close the 2.00% vs 2.31% split gap.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_011 = [
  /* ---------------------------------------------------------- Hinglish core */
  g('Kaam se pehchaan banti hai, bolne se nahi.', 'Professional and business', 'Craft', 'Direct', ['kaam', 'pehchaan']),
  g('Jo apne se jhooth bolta hai, woh sabse bada dhokebaaz hai.', 'Quotes and thoughts', 'Truth', 'Sharp', ['jhooth', 'dhokebaaz']),
  g('Rona aata hai toh aane do, daba ke rakhne se bura hota hai.', 'Deep and emotional', 'Honesty', 'Tender', ['rona', 'bura']),
  g('Dil ki baat sirf dil wale samajhte hain, baaki log sirf sunte hain.', 'Deep and emotional', 'Closeness', 'Aching', ['dil', 'sunte']),
  g('Achha dost woh jo bina bole samajh jaaye.', 'Friendship', 'Loyalty', 'Warm', ['dost', 'samajh']),
  g('Bura waqt sabka aata hai, farq sirf sambhalne mein hai.', 'Life and reality', 'Resilience', 'Wise', ['waqt', 'sambhalne']),
  g('Mehnat karo, nateeja apne waqt par milega.', 'Motivational', 'Patience', 'Steady', ['mehnat', 'nateeja']),
  g('Kisi ki raay se apni keemat mat tay karo.', 'Self-respect', 'Self-worth', 'Firm', ['raay', 'keemat']),
  g('Maa ke haath ka khana kisi restaurant mein nahi milta.', 'Food and cooking', 'Home kitchen', 'Warm', ['maa', 'khana']),
  g('Chai ke saath nikli baatein zindagi bhar yaad rehti hain.', 'Family', 'Home', 'Tender', ['chai', 'baatein']),
  g('Pahaad chadhne se pehle apne mann ko chadhana padta hai.', 'Travel and adventure', 'Mountains', 'Wise', ['pahaad', 'mann']),
  g('Har subah ek naya mauka hai, purani galtiyan saath nahi aati.', 'Life and reality', 'Morning', 'Encouraging', ['subah', 'mauka']),
  g('Jo kitaab padh ke band ho jaati hai, woh andar chal rahi hoti hai.', 'Books and reading', 'Reading', 'Reflective', ['kitaab', 'andar']),
  g('Gaadi purani ho sakti hai, iraada nahi.', 'Cars and bikes', 'Riding', 'Free', ['gaadi', 'iraada']),
  g('Gully mein khela cricket ne sabse zyada sikhaya.', 'Cricket and sports', 'Cricket', 'Warm', ['gully', 'cricket']),
  g('Mera kamra chhota hai, meri soch nahi.', 'Home and interiors', 'Home', 'Grounded', ['kamra', 'soch']),
  g('Bachche jhoot nahi bolte, hum unhe sikhate hain.', 'Parenting', 'Parent life', 'Honest', ['bachche', 'sikhate']),
  g('Photography matlab roshni ko samajhna, camera ko nahi.', 'Photography', 'Craft', 'Observant', ['roshni', 'camera']),
  g('Har gaana ek waqt se bandha hota hai.', 'Music and art', 'Music', 'Nostalgic', ['gaana', 'waqt']),
  g('Billiyan ghar nahi chunti, ghar inhe chunte hain.', 'Pets and animals', 'Cats', 'Funny', ['billiyan', 'log']),
  g('Startup matlab naukri se zyada seekhna, kam paisa.', 'Startup and hustle', 'Reality', 'Honest', ['startup', 'seekhna']),
  g('Code likhna aasaan hai, samajhna mushkil.', 'Technology and coding', 'Developer', 'Dry', ['code', 'samajhna']),
  g('Sawaal pucho, jawab apne aap mil jaayega.', 'Science and curiosity', 'Curiosity', 'Open', ['sawaal', 'jawab']),
  g('Ek acchi shaam shabd se zyada bolti hai.', 'Aesthetic', 'Slow living', 'Calm', ['shaam', 'shabd']),
  g('Bhasha se zyada zaroori hai baat ka mann.', 'Poetry', 'Craft', 'Wise', ['bhasha', 'baat']),
  g('Hansi sabse sasta ilaaj hai, aur sabse asar wala.', 'Funny and comedy', 'Humour', 'Warm', ['hansi', 'ilaaj']),
  g('Dosto ke saath bore hona bhi maza deta hai.', 'Friendship', 'Group chat', 'Warm', ['dosto', 'maza']),
  g('Neend poori karo, duniya kal bhi rahegi.', 'Yoga and wellness', 'Rest', 'Grounded', ['neend', 'duniya']),
  g('Shakal se zyada saleeka dekhna chahiye.', 'Stylish', 'Poise', 'Cool', ['saleeka', 'shakal']),
  g('Rishton mein sabse zaroori cheez hai bharosa.', 'Love and romance', 'Trust', 'Tender', ['rishton', 'bharosa']),
  g('Dukh baantne se halka hota hai, sukh baantne se bada.', 'Sad and heartbreak', 'Support', 'Wise', ['dukh', 'sukh']),
  g('Kaam ke baad ki chai ka apna hi jaadu hai.', 'Food and cooking', 'Everyday', 'Warm', ['chai', 'jaadu']),
  g('Waqt sabka aata hai, par tayyari wale kaam aata hai.', 'Professional and business', 'Preparation', 'Direct', ['waqt', 'tayyari']),
  g('Number kam aaye, seekh zyada mili.', 'Student life', 'Campus', 'Honest', ['number', 'seekh']),
  g('Akele chalna seekh liya, ab bheed se dar nahi lagta.', 'Alone and loneliness', 'Growth', 'Firm', ['akele', 'bheed']),
  g('Zindagi mein sabse zaroori hai apni baat par tikna.', 'Attitude', 'Integrity', 'Firm', ['baat', 'tikna']),
  g('Jo cheez dil se karo, woh kabhi bojh nahi lagti.', 'Creator and influencer', 'Process', 'Warm', ['dil', 'bojh']),
  g('Har safar ghar se thoda door le jaata hai, apne se thoda paas.', 'Travel and adventure', 'Travel style', 'Wise', ['safar', 'apne']),
  g('Soch ko waqt do, jawab khud aayega.', 'Quotes and thoughts', 'Patience', 'Calm', ['soch', 'waqt']),

  /* -------------------------------------------------------- Hindi counterweight */
  h('जो काम दिल से किया जाए, वो कभी बोझ नहीं लगता।', 'Creator and influencer', 'रचना', 'सहज', ['काम', 'दिल']),
  h('हर सफ़र घर से दूर, अपने से पास ले जाता है।', 'Travel and adventure', 'सफ़र', 'गंभीर', ['सफ़र', 'घर']),
  h('सोच को वक़्त दो, जवाब खुद आ जाएगा।', 'Quotes and thoughts', 'सब्र', 'शांत', ['सोच', 'जवाब']),
  h('मेहनत का कोई विकल्प नहीं होता।', 'Motivational', 'मेहनत', 'दृढ़', ['मेहनत', 'विकल्प']),
  h('जो चला गया उसे दोबारा बुलाना अपनी बेइज़्ज़ती है।', 'Self-respect', 'सीमाएं', 'स्पष्ट', ['चला', 'बेइज़्ज़ती']),
  h('अपनों के साथ बोर होना भी सुकून देता है।', 'Friendship', 'साथ', 'कोमल', ['अपने', 'सुकून']),
  h('नींद पूरी करो, दुनिया कल भी रहेगी।', 'Yoga and wellness', 'आराम', 'सहज', ['नींद', 'दुनिया']),
  h('चेहरे से ज़्यादा सलीका देखना चाहिए।', 'Stylish', 'सलीका', 'सहज', ['सलीका', 'चेहरा']),
  h('रिश्तों में सबसे ज़रूरी है भरोसा।', 'Love and romance', 'भरोसा', 'कोमल', ['रिश्ते', 'भरोसा']),
  h('दुख बाँटने से हल्का होता है, सुख बाँटने से बड़ा।', 'Sad and heartbreak', 'सहारा', 'गंभीर', ['दुख', 'सुख']),

  /* --------------------------------------------------------- English counterweight */
  e('Reputation is built in quiet weeks nobody applauds.', 'Professional and business', 'Reputation', 'Wise', ['business', 'reputation']),
  e('Read widely enough and you stop being impressed by noise.', 'Quotes and thoughts', 'Reading', 'Wise', ['reading', 'noise']),
  e('Ask better questions and you need fewer opinions.', 'Science and curiosity', 'Method', 'Wise', ['questions', 'method']),
  e('Recovery is training that happens while you sleep.', 'Yoga and wellness', 'Rest', 'Grounded', ['rest', 'recovery']),
  e('The recipe improves when you stop rushing the onions.', 'Food and cooking', 'Cooking', 'Wise', ['cooking', 'patience']),
  e('Every good photograph is a decision about what to leave out.', 'Photography', 'Craft', 'Observant', ['photography', 'craft']),
  e('A well-kept room is a quiet argument for self-respect.', 'Home and interiors', 'Home', 'Wise', ['home', 'self-respect']),
  e('Teach a child patience and you have taught them everything.', 'Parenting', 'Parent life', 'Wise', ['parenting', 'patience']),
  e('Code is read far more often than it is written. Write for the reader.', 'Technology and coding', 'Developer', 'Direct', ['code', 'readability']),
  e('The best travel plan has a blank afternoon built in.', 'Travel and adventure', 'Travel style', 'Free', ['travel', 'slowness']),
];
