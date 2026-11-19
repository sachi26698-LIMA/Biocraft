/**
 * BioCraft original bios — batch 020.
 * Proportional 40/30/30, depth in the leaders.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_020 = [
  /* -------------------------------------------------------------- Attitude */
  e('I have a long fuse and a permanent record.', 'Attitude', 'Restraint', 'Sharp', ['attitude', 'patience']),
  e('My yes means yes. That is why my no is final.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'no']),
  e('I do not argue with people who read to reply.', 'Attitude', 'Standards', 'Witty', ['attitude', 'listening']),
  e('Being kind is a choice. Being available is a subscription.', 'Attitude', 'Boundaries', 'Witty', ['attitude', 'kindness']),
  e('You will always be criticised by someone doing less.', 'Attitude', 'Composure', 'Wise', ['attitude', 'criticism']),
  e('I built this calm out of things that did not work.', 'Attitude', 'Growth', 'Honest', ['attitude', 'calm']),
  e('Respect is a two-way street and I have a driving licence.', 'Attitude', 'Standards', 'Witty', ['attitude', 'respect']),
  h('मेरा धैर्य लंबा है, याददाश्त भी।', 'Attitude', 'संयम', 'तीखा', ['धैर्य', 'याददाश्त']),
  h('मेरा "हाँ" पक्का है, इसीलिए मेरा "ना" आखिरी है।', 'Attitude', 'ईमानदारी', 'दृढ़', ['हाँ', 'ना']),
  h('जो आलोचना कम करने वालों से आती है, उसे संभालना आसान है।', 'Attitude', 'शांति', 'गंभीर', ['आलोचना', 'शांति']),
  h('यह शांति उन चीज़ों से बनी है जो काम नहीं आईं।', 'Attitude', 'विकास', 'स्पष्ट', ['शांति', 'विकास']),
  g('Mera dhairya lamba hai, yaaddasht bhi.', 'Attitude', 'Restraint', 'Sharp', ['dhairya', 'yaaddasht']),
  g('Mera haan pakka hai, isliye mera na aakhri hai.', 'Attitude', 'Integrity', 'Firm', ['haan', 'aakhri']),
  g('Yeh shaanti un cheezon se bani hai jo kaam nahi aayin.', 'Attitude', 'Growth', 'Honest', ['shaanti', 'cheezon']),

  /* ------------------------------------------------------ Love and romance */
  e('I love you on the days you are hard to love too.', 'Love and romance', 'Devotion', 'Tender', ['love', 'loyalty']),
  e('Our best dates involve no reservatons and no plans.', 'Love and romance', 'Everyday', 'Warm', ['love', 'dates']),
  e('You are the person I want to be quiet with.', 'Love and romance', 'Closeness', 'Tender', ['love', 'silence']),
  e('I want to be your rest, not your project.', 'Love and romance', 'Comfort', 'Wise', ['love', 'rest']),
  e('Two imperfect people doing the work daily. That is us.', 'Love and romance', 'Real love', 'Honest', ['love', 'work']),
  e('Your happiness is not my job, but it is my favourite hobby.', 'Love and romance', 'Care', 'Sweet', ['love', 'care']),
  h('जिस दिन तुम्हें प्यार करना मुश्किल लगे, उस दिन भी करूँगा।', 'Love and romance', 'निभाना', 'कोमल', ['प्यार', 'मुश्किल']),
  h('तुम वो हो जिसके साथ चुप रहना भी अच्छा लगता है।', 'Love and romance', 'नज़दीकी', 'कोमल', ['चुप', 'साथ']),
  h('मैं तुम्हारा आराम बनना चाहता हूँ, कोई प्रोजेक्ट नहीं।', 'Love and romance', 'सुकून', 'गंभीर', ['आराम', 'प्रोजेक्ट']),
  h('दो अपूर्ण लोग रोज़ कोशिश करते हैं, बस इतना ही।', 'Love and romance', 'निभाना', 'सहज', ['अपूर्ण', 'कोशिश']),
  g('Jis din tumhe pyaar karna mushkil lage, us din bhi karunga.', 'Love and romance', 'Devotion', 'Tender', ['pyaar', 'mushkil']),
  g('Tum woh ho jiske saath chup rehna bhi accha lagta hai.', 'Love and romance', 'Closeness', 'Tender', ['chup', 'accha']),
  g('Do apooran log roz koshish karte hain, bas itna hi.', 'Love and romance', 'Real love', 'Honest', ['apooran', 'koshish']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I made peace with the ending. The middle still argues.', 'Sad and heartbreak', 'Grief', 'Honest', ['sad', 'grief']),
  e('Some memories arrive uninvited and stay for dinner.', 'Sad and heartbreak', 'Memory', 'Wry', ['sad', 'memory']),
  e('I stopped asking why and started asking what now.', 'Sad and heartbreak', 'Recovery', 'Steady', ['sad', 'recovery']),
  e('You were the chapter I reread until it made sense.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'longing']),
  e('Losing you made me a better listener. I hate that trade.', 'Sad and heartbreak', 'Loss', 'Raw', ['sad', 'loss']),
  h('अंत से समझौता कर लिया, बीच वाला हिस्सा अब भी बहस करता है।', 'Sad and heartbreak', 'गम', 'स्पष्ट', ['अंत', 'हिस्सा']),
  h('कुछ यादें बिना बुलाए आती हैं और बैठ जाती हैं।', 'Sad and heartbreak', 'याद', 'सहज', ['यादें', 'बुलाए']),
  h('"क्यों" पूछना छोड़ा, "अब क्या" पूछना शुरू किया।', 'Sad and heartbreak', 'उबरना', 'दृढ़', ['क्यों', 'अब']),
  h('तुम वो अध्याय थे जिसे मैं बार-बार पढ़ता रहा।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['अध्याय', 'पढ़ता']),
  g('Ant se samjhauta kar liya, beech wala hissa ab bhi bahas karta hai.', 'Sad and heartbreak', 'Grief', 'Honest', ['ant', 'hisssa']),
  g('Kuch yaadein bina bulaaye aati hain aur baith jaati hain.', 'Sad and heartbreak', 'Memory', 'Wry', ['yaadein', 'baith']),
  g('Tum woh adhyaay the jise main baar baar padhta raha.', 'Sad and heartbreak', 'Longing', 'Aching', ['adhyaay', 'padhta']),

  /* ------------------------------------------------------ Shayari depth */
  h('मैं तुझे भूलने की कोशिश में\nखुद को याद कर बैठा।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['भूलना', 'याद']),
  h('कुछ लोग रिश्ते नहीं,\nआदतें छोड़ जाते हैं।', 'Shayari', 'दो पंक्ति', 'भावुक', ['आदतें', 'लोग']),
  h('तेरे बिना सुबह भी होती है,\nबस सुबह जैसी नहीं लगती।', 'Shayari', 'दो पंक्ति', 'भावुक', ['सुबह', 'बिना']),
  h('मैं बारिश में भीगा नहीं,\nमैं तेरी याद में भीगा था।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['बारिश', 'याद']),
  h('जो बात कहने में डर लगे,\nवही बात ज़िंदगी बदल देती है।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['बात', 'डर']),
  h('मेरे पास बहुत कुछ नहीं,\nबस थोड़ा सा सच है।', 'Shayari', 'दो पंक्ति', 'सहज', ['सच', 'पास']),
  g('Main tujhe bhoolne ki koshish mein khud ko yaad kar baitha.', 'Shayari', 'Two line', 'Deep', ['bhoolne', 'yaad']),
  g('Kuch log rishte nahi, aadatein chhod jaate hain.', 'Shayari', 'Two line', 'Aching', ['rishte', 'aadatein']),
  g('Tere bina subah bhi hoti hai, bas subah jaisi nahi lagti.', 'Shayari', 'Two line', 'Aching', ['subah', 'jaisi']),
  g('Jo baat kehne mein dar lage, wahi baat zindagi badal deti hai.', 'Shayari', 'Two line', 'Deep', ['baat', 'dar']),
  g('Mere paas bahut kuch nahi, bas thoda sa sach hai.', 'Shayari', 'Two line', 'Calm', ['bahut', 'sach']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('A decision without a deadline is a daydream.', 'Quotes and thoughts', 'Action', 'Direct', ['quotes', 'deadline']),
  e('The best revenge is an unremarkable, happy Tuesday.', 'Quotes and thoughts', 'Peace', 'Wise', ['quotes', 'peace']),
  e('You cannot rush trust and you cannot fake it for long.', 'Quotes and thoughts', 'Trust', 'Wise', ['quotes', 'trust']),
  e('Read the room before you read the slides.', 'Quotes and thoughts', 'Awareness', 'Practical', ['quotes', 'awareness']),
  h('बिना समय-सीमा का फ़ैसला सिर्फ़ सपना है।', 'Quotes and thoughts', 'कर्म', 'स्पष्ट', ['फ़ैसला', 'सपना']),
  h('सबसे अच्छा बदला है एक शांत, खुश मंगलवार।', 'Quotes and thoughts', 'शांति', 'गंभीर', ['बदला', 'मंगलवार']),
  h('भरोसा जल्दी नहीं बनता और नकली ज़्यादा देर नहीं टिकता।', 'Quotes and thoughts', 'भरोसा', 'गंभीर', ['भरोसा', 'नकली']),
  g('Bina time limit ka faisla sirf sapna hai.', 'Quotes and thoughts', 'Action', 'Direct', ['faisla', 'sapna']),
  g('Sabse accha jawab hai ek shaant, khush mangalvaar jee lena.', 'Quotes and thoughts', 'Peace', 'Wise', ['jawab', 'mangalvaar']),
  g('Bharosa jaldi nahi banta aur naqli zyada der nahi tikta.', 'Quotes and thoughts', 'Trust', 'Wise', ['bharosa', 'naqli']),

  /* ------------------------------------------------------ Life and reality */
  e('Most of your problems are solved by a boring routine.', 'Life and reality', 'Habit', 'Wise', ['life', 'routine']),
  e('You become the conversations you keep having.', 'Life and reality', 'People', 'Wise', ['life', 'people']),
  e('Health is the only asset that cannot be outsourced.', 'Life and reality', 'Health', 'Direct', ['life', 'health']),
  e('I would rather be thought dull than be actually dishonest.', 'Life and reality', 'Integrity', 'Steady', ['life', 'integrity']),
  h('तुम्हारी ज़्यादातर समस्याएँ एक बोरिंग दिनचर्या से हल हो जाती हैं।', 'Life and reality', 'आदत', 'गंभीर', ['समस्याएँ', 'दिनचर्या']),
  h('जिन बातचीत में तुम रहते हो, वही तुम बन जाते हो।', 'Life and reality', 'लोग', 'गंभीर', ['बातचीत', 'लोग']),
  h('सेहत वही संपत्ति है जो किसी और को नहीं दी जा सकती।', 'Life and reality', 'सेहत', 'स्पष्ट', ['सेहत', 'संपत्ति']),
  g('Tumhari zyadatar samasyayen ek boring dincharya se hal ho jaati hain.', 'Life and reality', 'Habit', 'Wise', ['samasyayen', 'dincharya']),
  g('Jin baatcheet mein tum rehte ho, wahi tum ban jaate ho.', 'Life and reality', 'People', 'Wise', ['baatcheet', 'ban']),

  /* --------------------------------------------------- Motivational depth */
  e('You do not have to be talented. You have to be repeatable.', 'Motivational', 'Consistency', 'Direct', ['motivation', 'consistency']),
  e('Finish the small thing before the big thing intimidates you.', 'Motivational', 'Focus', 'Practical', ['motivation', 'focus']),
  e('Discomfort is the tuition fee for growth.', 'Motivational', 'Growth', 'Wise', ['motivation', 'comfort']),
  h('प्रतिभा ज़रूरी नहीं, दोहराव ज़रूरी है।', 'Motivational', 'निरंतरता', 'स्पष्ट', ['प्रतिभा', 'दोहराव']),
  h('असहज होना विकास की फ़ीस है।', 'Motivational', 'विकास', 'गंभीर', ['असहज', 'फ़ीस']),
  g('Pratibha zaroori nahi, dohrav zaroori hai.', 'Motivational', 'Consistency', 'Direct', ['pratibha', 'dohrav']),
  g('Asahaj hona vikas ki fees hai.', 'Motivational', 'Growth', 'Wise', ['asahaj', 'fees']),

  /* ------------------------------------------- Aesthetic / style / royal */
  e('Warm wood, low light, a good chair. That is the whole design.', 'Aesthetic', 'Interiors', 'Calm', ['aesthetic', 'design']),
  e('I like clothes that look better in year three.', 'Stylish', 'Craft', 'Wise', ['style', 'timeless']),
  e('Carry yourself well and the room adjusts.', 'Royal and VIP', 'Presence', 'Regal', ['royal', 'presence']),
  e('A quiet voice in a loud room is still heard by everyone worth hearing it.', 'Royal and VIP', 'Bearing', 'Poised', ['royal', 'quiet']),
  h('गर्म लकड़ी, धीमी रोशनी, एक अच्छी कुर्सी। बस।', 'Aesthetic', 'घर', 'शांत', ['लकड़ी', 'कुर्सी']),
  h('जो कपड़े तीसरे साल बेहतर लगें, वही चुनता हूँ।', 'Stylish', 'सलीका', 'सहज', ['कपड़े', 'साल']),
  g('Garam lakdi, dheemi roshni, ek acchi kursi. Bas.', 'Aesthetic', 'Interiors', 'Calm', ['lakdi', 'kursi']),
  g('Jo kapde teesre saal behtar lagein, wahi chunta hoon.', 'Stylish', 'Craft', 'Wise', ['kapde', 'teesre']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('Started running because I was bored of my own excuses.', 'Fitness', 'Running', 'Honest', ['fitness', 'running']),
  e('Two kilometres is a decision, not a distance.', 'Fitness', 'Running', 'Direct', ['fitness', 'distance']),
  e('I play badly and show up every week. That is the commitment.', 'Gaming profiles', 'Team play', 'Honest', ['gaming', 'commitment']),
  e('Every campaign ends with me building a bigger base instead.', 'Gaming profiles', 'Single player', 'Wry', ['gaming', 'building']),
  e('Cooking taught me patience better than any book.', 'Food and cooking', 'Cooking', 'Wise', ['food', 'patience']),
  e('I make one thing well and repeat it until I am asked to stop.', 'Food and cooking', 'Cooking', 'Wry', ['food', 'practice']),
  h('दो किलोमीटर एक फ़ैसला है, दूरी नहीं।', 'Fitness', 'दौड़', 'स्पष्ट', ['दौड़', 'फ़ैसला']),
  h('खाना बनाने ने सब्र सिखाया, किताबों से ज़्यादा।', 'Food and cooking', 'रसोई', 'गंभीर', ['खाना', 'सब्र']),
  g('Do kilometre ek faisla hai, doori nahi.', 'Fitness', 'Running', 'Direct', ['kilometre', 'faisla']),
  g('Ek cheez acchi banata hoon aur repeat karta hoon.', 'Food and cooking', 'Cooking', 'Wry', ['cheez', 'repeat']),
  g('Har game mein main base banane lagta hoon.', 'Gaming profiles', 'Single player', 'Wry', ['game', 'base']),
];
