/**
 * BioCraft original bios — batch 025.
 * Slightly English-heavy to level 4.59 / 4.75 / 4.69.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_025 = [
  /* -------------------------------------------------------------- Attitude */
  e('I am not out of reach. I am out of patience.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'patience']),
  e('A calm answer ends more arguments than a clever one.', 'Attitude', 'Restraint', 'Wise', ['attitude', 'calm']),
  e('I stopped auditioning for roles nobody offered.', 'Attitude', 'Self-possession', 'Honest', ['attitude', 'self']),
  e('You can have my time or my opinion. Rarely both.', 'Attitude', 'Boundaries', 'Witty', ['attitude', 'time']),
  e('I am not revengeful. I am just very good at remembering.', 'Attitude', 'Composure', 'Dry', ['attitude', 'memory']),
  e('My silence is expensive. Do not spend it.', 'Attitude', 'Restraint', 'Cool', ['attitude', 'silence']),
  e('I would rather be respected at a distance than liked closely.', 'Attitude', 'Standards', 'Direct', ['attitude', 'respect']),
  e('Nobody gets to define me in a sentence they did not earn.', 'Attitude', 'Identity', 'Firm', ['attitude', 'identity']),
  e('I do not need a seat at a table I would not build.', 'Attitude', 'Independence', 'Composed', ['attitude', 'independence']),
  e('Kindness without boundaries is just volunteering.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'kindness']),
  h('मैं पहुँच से बाहर नहीं, सब्र से बाहर हूँ।', 'Attitude', 'सीमाएं', 'तीखा', ['सब्र', 'बाहर']),
  h('शांत जवाब चतुर जवाब से ज़्यादा बहसें खत्म करता है।', 'Attitude', 'संयम', 'गंभीर', ['जवाब', 'बहस']),
  h('मैं वो भूमिकाएं मांगना छोड़ चुका हूँ जो किसी ने दी नहीं।', 'Attitude', 'स्वाभिमान', 'स्पष्ट', ['भूमिका', 'मांगना']),
  h('मेरी चुप्पी महंगी है, उसे खर्च मत करो।', 'Attitude', 'संयम', 'शांत', ['चुप्पी', 'महंगी']),
  g('Main pahunch se bahar nahi, sabr se bahar hoon.', 'Attitude', 'Boundaries', 'Sharp', ['sabr', 'bahar']),
  g('Shaant jawab chatur jawab se zyada bahasein khatam karta hai.', 'Attitude', 'Restraint', 'Wise', ['jawab', 'bahasein']),
  g('Meri chuppi mehngi hai, use kharch mat karo.', 'Attitude', 'Restraint', 'Cool', ['chuppi', 'kharch']),

  /* ------------------------------------------------------ Love and romance */
  e('You are the conversation I never want to end.', 'Love and romance', 'Closeness', 'Tender', ['love', 'conversation']),
  e('I fell for how you handle a bad day.', 'Love and romance', 'Admiration', 'Honest', ['love', 'character']),
  e('We are not a fairytale. We are a good partnership.', 'Love and romance', 'Real love', 'Wise', ['love', 'partnership']),
  e('I like your mind first and your company second, or maybe reversed.', 'Love and romance', 'Admiration', 'Witty', ['love', 'mind']),
  e('You make me want to be a more reliable person.', 'Love and romance', 'Growth', 'Tender', ['love', 'growth']),
  e('The best part of my week is a boring evening with you.', 'Love and romance', 'Everyday', 'Warm', ['love', 'evenings']),
  e('I would pick you in a room full of easier options.', 'Love and romance', 'Devotion', 'Romantic', ['love', 'choice']),
  h('तुम वो बातचीत हो जो कभी खत्म नहीं होनी चाहिए।', 'Love and romance', 'नज़दीकी', 'कोमल', ['बातचीत', 'खत्म']),
  h('मुझे तुम्हारा बुरा दिन संभालना पसंद आया।', 'Love and romance', 'प्रशंसा', 'स्पष्ट', ['बुरा', 'संभालना']),
  h('हम परीकथा नहीं, अच्छी साझेदारी हैं।', 'Love and romance', 'रोज़मर्रा', 'गंभीर', ['साझेदारी', 'परीकथा']),
  h('तुम मुझे और भरोसेमंद इंसान बनाना चाहते हो।', 'Love and romance', 'विकास', 'कोमल', ['भरोसेमंद', 'विकास']),
  g('Tum woh baatcheet ho jo kabhi khatam nahi honi chahiye.', 'Love and romance', 'Closeness', 'Tender', ['baatcheet', 'khatam']),
  g('Mujhe tumhara bura din sambhalna pasand aaya.', 'Love and romance', 'Admiration', 'Honest', ['bura', 'sambhalna']),
  g('Hum parikatha nahi, acchi saajhedaari hain.', 'Love and romance', 'Real love', 'Wise', ['saajhedaari', 'parikatha']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I am not waiting. I am just not in a hurry to replace you.', 'Sad and heartbreak', 'Longing', 'Honest', ['sad', 'longing']),
  e('Some nights the memory is louder than the radio.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'memory']),
  e('You were a whole season and I dressed for it.', 'Sad and heartbreak', 'Loss', 'Raw', ['sad', 'loss']),
  e('I have forgiven you and I still do not want to see you.', 'Sad and heartbreak', 'Boundaries', 'Steady', ['sad', 'forgiveness']),
  e('The wound closed. The weather still hurts it.', 'Sad and heartbreak', 'Recovery', 'Aching', ['sad', 'recovery']),
  h('मैं इंतज़ार नहीं कर रहा, बस जल्दी में नहीं हूँ।', 'Sad and heartbreak', 'लालसा', 'स्पष्ट', ['इंतज़ार', 'जल्दी']),
  h('कुछ रातों में याद रेडियो से तेज़ होती है।', 'Sad and heartbreak', 'याद', 'भावुक', ['याद', 'रातों']),
  h('तुम पूरा मौसम थे और मैंने उसी के कपड़े पहने।', 'Sad and heartbreak', 'लापता', 'भावुक', ['मौसम', 'कपड़े']),
  h('माफ़ कर दिया, पर देखना अभी नहीं चाहता।', 'Sad and heartbreak', 'सीमाएं', 'दृढ़', ['माफ़', 'देखना']),
  g('Main intezaar nahi kar raha, bas jaldi mein nahi hoon.', 'Sad and heartbreak', 'Longing', 'Honest', ['intezaar', 'jaldi']),
  g('Kuch raaton mein yaad radio se tez hoti hai.', 'Sad and heartbreak', 'Memory', 'Aching', ['yaad', 'raaton']),
  g('Maaaf kar diya, par dekhna abhi nahi chahta.', 'Sad and heartbreak', 'Boundaries', 'Steady', ['maaaf', 'dekhna']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरे साथ का हिसाब\nमैंने कभी नहीं लगाया,\nइसीलिए इतना भारी पड़ा।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['हिसाब', 'भारी']),
  h('मुझे तेरी आदत थी,\nतेरी ज़रूरत नहीं,\nयह फ़र्क़ बहुत बाद में समझ आया।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['आदत', 'फ़र्क़']),
  h('रोज़ सुबह उठता हूँ,\nतेरा नाम भूलने की कोशिश में,\nऔर रोज़ हार जाता हूँ।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['सुबह', 'नाम']),
  h('मैं तुझे ग़लत साबित नहीं करना चाहता,\nबस खुद को सही साबित करना छोड़ देना चाहता हूँ।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['साबित', 'खुद']),
  g('Tere saath ka hisaab maine kabhi nahi lagaya, isliye itna bhaari pada.', 'Shayari', 'Two line', 'Aching', ['hisaab', 'bhaari']),
  g('Mujhe teri aadat thi, teri zaroorat nahi — yeh farq baad mein samajh aaya.', 'Shayari', 'Two line', 'Deep', ['aadat', 'farq']),
  g('Roz subah uthta hoon, tera naam bhoolne ki koshish mein, aur roz haar jaata hoon.', 'Shayari', 'Two line', 'Aching', ['subah', 'naam']),
  g('Main tujhe galat sabit nahi karna chahta, bas khud ko sahi sabit karna chhodna chahta hoon.', 'Shayari', 'Two line', 'Deep', ['galat', 'khud']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('You are the average of the five rooms you sit in.', 'Quotes and thoughts', 'Environment', 'Wise', ['quotes', 'environment']),
  e('Being busy is the most socially acceptable way to avoid thinking.', 'Quotes and thoughts', 'Focus', 'Sharp', ['quotes', 'busy']),
  e('The best teachers ask questions they do not know the answer to.', 'Quotes and thoughts', 'Learning', 'Wise', ['quotes', 'teaching']),
  e('Criticism is data. Insults are noise. Learn to sort them.', 'Quotes and thoughts', 'Discernment', 'Direct', ['quotes', 'criticism']),
  e('A promise kept quietly is worth ten announced loudly.', 'Quotes and thoughts', 'Integrity', 'Wise', ['quotes', 'promises']),
  h('तुम उन पाँच कमरों का औसत हो जिनमें बैठते हो।', 'Quotes and thoughts', 'माहौल', 'गंभीर', ['कमरे', 'औसत']),
  h('व्यस्त रहना सोचने से बचने का सबसे स्वीकार्य तरीका है।', 'Quotes and thoughts', 'ध्यान', 'तीखा', ['व्यस्त', 'सोचना']),
  h('आलोचना जानकारी है, अपमान शोर है। फ़र्क़ सीखो।', 'Quotes and thoughts', 'समझ', 'स्पष्ट', ['आलोचना', 'अपमान']),
  g('Tum un paanch kamron ka ausat ho jinme baithte ho.', 'Quotes and thoughts', 'Environment', 'Wise', ['kamron', 'ausat']),
  g('Vyast rehna sochne se bachne ka sabse sweekaarya tareeka hai.', 'Quotes and thoughts', 'Focus', 'Sharp', ['vyast', 'sochne']),
  g('Aalochana jaankari hai, apmaan shor hai. Farq seekho.', 'Quotes and thoughts', 'Discernment', 'Direct', ['aalochana', 'farq']),

  /* ------------------------------------------------------ Life and reality */
  e('The right environment does more than the right intention.', 'Life and reality', 'Environment', 'Wise', ['life', 'environment']),
  e('You do not need to win the argument to keep the relationship.', 'Life and reality', 'People', 'Wise', ['life', 'relationships']),
  e('Most regrets are about things not said in time.', 'Life and reality', 'Honesty', 'Honest', ['life', 'regret']),
  e('The version of you that rests is not the lesser version.', 'Life and reality', 'Rest', 'Warm', ['life', 'rest']),
  h('सही माहौल सही इरादे से ज़्यादा काम करता है।', 'Life and reality', 'माहौल', 'गंभीर', ['माहौल', 'इरादा']),
  h('रिश्ता बचाने के लिए हर बहस जीतना ज़रूरी नहीं।', 'Life and reality', 'लोग', 'गंभीर', ['बहस', 'रिश्ता']),
  h('ज़्यादातर अफ़सोस उन बातों का होता है जो वक़्त पर नहीं कहीं।', 'Life and reality', 'ईमानदारी', 'स्पष्ट', ['अफ़सोस', 'बातें']),
  g('Sahi mahaul sahi iraade se zyada kaam karta hai.', 'Life and reality', 'Environment', 'Wise', ['mahaul', 'iraade']),
  g('Rishta bachane ke liye har bahas jeetna zaroori nahi.', 'Life and reality', 'People', 'Wise', ['bahas', 'rishta']),

  /* --------------------------------------------------- Motivational depth */
  e('You cannot think yourself into confidence. You practise into it.', 'Motivational', 'Practice', 'Direct', ['motivation', 'practice']),
  e('Make the decision you would make if you were not afraid.', 'Motivational', 'Courage', 'Encouraging', ['motivation', 'courage']),
  e('Boring consistency is the most underrated talent.', 'Motivational', 'Consistency', 'Wise', ['motivation', 'consistency']),
  h('आत्मविश्वास सोच से नहीं, अभ्यास से आता है।', 'Motivational', 'अभ्यास', 'स्पष्ट', ['आत्मविश्वास', 'अभ्यास']),
  h('जो फ़ैसला डर के बिना लेते, वही फ़ैसला लो।', 'Motivational', 'साहस', 'प्रेरक', ['फ़ैसला', 'साहस']),
  g('Atmavishwas soch se nahi, abhyaas se aata hai.', 'Motivational', 'Practice', 'Direct', ['atmavishwas', 'abhyaas']),
  g('Jo faisla dar ke bina lete, wahi faisla lo.', 'Motivational', 'Courage', 'Encouraging', ['faisla', 'dar']),

  /* ------------------------------------------ Aesthetic / minimal / royal */
  e('Fewer things, better things, and a place for each.', 'Minimal', 'Simplicity', 'Minimal', ['minimal', 'simplicity']),
  e('I do not collect objects. I collect good light.', 'Aesthetic', 'Light', 'Warm', ['aesthetic', 'light']),
  e('A tidy shelf is a small daily kindness to yourself.', 'Minimal', 'Home', 'Practical', ['minimal', 'home']),
  e('Old money is mostly old manners and good tailoring.', 'Royal and VIP', 'Bearing', 'Wry', ['royal', 'manners']),
  e('Presence is not loud. It is simply undivided.', 'Royal and VIP', 'Presence', 'Regal', ['royal', 'presence']),
  h('कम चीज़ें, बेहतर चीज़ें, और हर चीज़ की जगह।', 'Minimal', 'सादगी', 'संक्षिप्त', ['चीज़ें', 'जगह']),
  h('मैं चीज़ें नहीं, अच्छी रोशनी इकट्ठी करता हूँ।', 'Aesthetic', 'रोशनी', 'सहज', ['रोशनी', 'चीज़ें']),
  g('Kam cheezein, behtar cheezein, aur har cheez ki jagah.', 'Minimal', 'Simplicity', 'Minimal', ['cheezein', 'jagah']),
  g('Main cheezein nahi, acchi roshni ikatthi karta hoon.', 'Aesthetic', 'Light', 'Warm', ['roshni', 'ikatthi']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('A good watch and a good phone are both just tools. Cheap ones are fine.', 'Stylish', 'Craft', 'Practical', ['style', 'tools']),
  e('One jacket, five years, no regrets.', 'Stylish', 'Craft', 'Terse', ['style', 'jacket']),
  e('Weddings are for the family. The food is for me.', 'Wedding and celebration', 'Guest life', 'Funny', ['wedding', 'food']),
  e('I am the person who fixes the speaker at the function.', 'Wedding and celebration', 'Guest life', 'Wry', ['wedding', 'helpful']),
  e('Monsoon is the only season that smells like a memory.', 'Monsoon and seasons', 'Monsoon', 'Nostalgic', ['monsoon', 'memory']),
  e('Winter mornings make even cheap tea taste expensive.', 'Monsoon and seasons', 'Winter', 'Cozy', ['winter', 'tea']),
  h('अच्छा समय और अच्छा फ़ोन — दोनों बस औज़ार हैं।', 'Stylish', 'सलीका', 'व्यावहारिक', ['समय', 'औज़ार']),
  h('एक जैकेट, पाँच साल, कोई अफ़सोस नहीं।', 'Stylish', 'सलीका', 'संक्षिप्त', ['जैकेट', 'साल']),
  h('शादी परिवार के लिए, खाना मेरे लिए।', 'Wedding and celebration', 'मेहमान', 'मज़ाकिया', ['शादी', 'खाना']),
  h('सर्दी की सुबह में सस्ती चाय भी महंगी लगती है।', 'Monsoon and seasons', 'सर्दी', 'सहज', ['सर्दी', 'चाय']),
  g('Ek jacket, paanch saal, koi afsos nahi.', 'Stylish', 'Craft', 'Terse', ['jacket', 'afsos']),
  g('Shaadi parivaar ke liye, khaana mere liye.', 'Wedding and celebration', 'Guest life', 'Funny', ['shaadi', 'khaana']),
  g('Sardi ki subah mein sasti chai bhi mehngi lagti hai.', 'Monsoon and seasons', 'Winter', 'Cozy', ['sardi', 'chai']),
];
