/**
 * BioCraft original bios — batch 024.
 * Proportional 40/30/30: leaders + mid-field.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_024 = [
  /* -------------------------------------------------------------- Attitude */
  e('I keep my word, which is why I give it rarely.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'integrity']),
  e('You cannot rush me into a decision I will have to live with.', 'Attitude', 'Patience', 'Composed', ['attitude', 'patience']),
  e('Unbothered is a skill I practice daily.', 'Attitude', 'Composure', 'Cool', ['attitude', 'composure']),
  e('I will explain once. After that we are just repeating ourselves.', 'Attitude', 'Directness', 'Dry', ['attitude', 'direct']),
  e('I do not compete with people I do not respect.', 'Attitude', 'Standards', 'Sharp', ['attitude', 'standards']),
  e('The door is open. The mat is not that big.', 'Attitude', 'Boundaries', 'Witty', ['attitude', 'boundaries']),
  e('Take my kindness as a choice, not a default setting.', 'Attitude', 'Boundaries', 'Cool', ['attitude', 'kindness']),
  h('मैं वादा कम करता हूँ, इसीलिए निभा पाता हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['वादा', 'निभाना']),
  h('जो फ़ैसला मुझे जीना है, उसमें जल्दबाज़ी नहीं चलेगी।', 'Attitude', 'सब्र', 'शांत', ['फ़ैसला', 'जल्दबाज़ी']),
  h('मैं एक बार समझाता हूँ, उसके बाद दोहराना बेकार है।', 'Attitude', 'स्पष्टता', 'स्पष्ट', ['समझाना', 'दोहराना']),
  h('मेरी मेहरबानी चुनाव है, आदत नहीं।', 'Attitude', 'सीमाएं', 'शांत', ['मेहरबानी', 'चुनाव']),
  g('Main wada kam karta hoon, isliye nibha paata hoon.', 'Attitude', 'Integrity', 'Firm', ['wada', 'nibha']),
  g('Jo faisla mujhe jeena hai, usme jaldbaazi nahi chalegi.', 'Attitude', 'Patience', 'Composed', ['faisla', 'jaldbaazi']),
  g('Main ek baar samjhata hoon, uske baad dohrana bekaar hai.', 'Attitude', 'Directness', 'Dry', ['samjhata', 'dohrana']),

  /* ------------------------------------------------------ Love and romance */
  e('You are the reason I stopped dreading Mondays.', 'Love and romance', 'Everyday', 'Sweet', ['love', 'mondays']),
  e('I do not want a perfect love. I want an honest one.', 'Love and romance', 'Honesty', 'Honest', ['love', 'honesty']),
  e('Your name is the shortest poem I know.', 'Love and romance', 'Romance', 'Romantic', ['love', 'poetry']),
  e('We are good at the unglamorous parts. That counts for something.', 'Love and romance', 'Real love', 'Wise', ['love', 'everyday']),
  e('I would move the furniture for you. That is my love language.', 'Love and romance', 'Care', 'Witty', ['love', 'care']),
  e('You make ordinary evenings feel worth remembering.', 'Love and romance', 'Everyday', 'Tender', ['love', 'evenings']),
  h('तुम्हारी वजह से सोमवार डरावना नहीं लगता।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['सोमवार', 'वजह']),
  h('मुझे परफ़ेक्ट प्यार नहीं, ईमानदार प्यार चाहिए।', 'Love and romance', 'ईमानदारी', 'गंभीर', ['प्यार', 'ईमानदार']),
  h('तुम्हारा नाम सबसे छोटी कविता है जो मुझे आती है।', 'Love and romance', 'रोमांस', 'रोमांटिक', ['नाम', 'कविता']),
  h('हम बोरिंग हिस्सों में अच्छे हैं, यह भी कुछ कहता है।', 'Love and romance', 'रोज़मर्रा', 'सहज', ['हिस्से', 'अच्छे']),
  g('Tumhari wajah se somvaar darawna nahi lagta.', 'Love and romance', 'Everyday', 'Sweet', ['somvaar', 'wajah']),
  g('Mujhe perfect pyaar nahi, imaandaar pyaar chahiye.', 'Love and romance', 'Honesty', 'Honest', ['perfect', 'imaandaar']),
  g('Tumhara naam sabse chhoti kavita hai jo mujhe aati hai.', 'Love and romance', 'Romance', 'Romantic', ['naam', 'kavita']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I have a folder of things I never sent you.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'longing']),
  e('The hardest goodbye was the polite one.', 'Sad and heartbreak', 'Ending', 'Heavy', ['sad', 'goodbye']),
  e('I learned your favourite songs and now they hurt.', 'Sad and heartbreak', 'Memory', 'Raw', ['sad', 'music']),
  e('Some days the absence is louder than the person was.', 'Sad and heartbreak', 'Absence', 'Aching', ['sad', 'absence']),
  h('मेरे पास वो सब है जो मैंने तुम्हें कभी भेजा नहीं।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['भेजा', 'पास']),
  h('सबसे मुश्किल विदाई वो औपचारिक थी।', 'Sad and heartbreak', 'अंत', 'गंभीर', ['विदाई', 'औपचारिक']),
  h('तुम्हारे पसंदीदा गाने सीखे, अब वो चुभते हैं।', 'Sad and heartbreak', 'याद', 'भावुक', ['गाने', 'चुभते']),
  g('Mere paas woh sab hai jo maine tumhein kabhi bheja nahi.', 'Sad and heartbreak', 'Longing', 'Aching', ['bheja', 'paas']),
  g('Sabse mushkil vidaai woh aurparik thi.', 'Sad and heartbreak', 'Ending', 'Heavy', ['vidaai', 'aurparik']),
  g('Tumhare pasandeeda gaane seekhe, ab woh chubhte hain.', 'Sad and heartbreak', 'Memory', 'Raw', ['gaane', 'chubhte']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरे साथ बिताया वक़्त\nसबसे अच्छा निवेश था,\nजो डूब गया।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['वक़्त', 'निवेश']),
  h('मैं खुद से वादा करके\nतोड़ता रहा,\nऔर खुद से माफ़ी भी मांगता रहा।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['वादा', 'माफ़ी']),
  h('तेरी गली से गुज़रते हुए\nमैंने सिर्फ़ रास्ता देखा,\nतुम्हारा दरवाज़ा नहीं।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['गली', 'रास्ता']),
  h('कुछ लोग कहानी होते हैं,\nकुछ सिर्फ़ अध्याय,\nऔर कुछ बस शीर्षक।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['कहानी', 'अध्याय']),
  g('Tere saath bitaya waqt sabse accha nivesh tha, jo doob gaya.', 'Shayari', 'Two line', 'Aching', ['waqt', 'nivesh']),
  g('Main khud se wada karke todta raha, aur khud se maafi bhi maangta raha.', 'Shayari', 'Two line', 'Deep', ['wada', 'maafi']),
  g('Teri gali se guzarte hue maine sirf raasta dekha, tumhara darwaaza nahi.', 'Shayari', 'Two line', 'Aching', ['gali', 'raasta']),
  g('Kuch log kahani hote hain, kuch sirf adhyaay, aur kuch bas sheershak.', 'Shayari', 'Two line', 'Deep', ['kahani', 'adhyaay']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('You cannot borrow discipline. It does not transfer.', 'Quotes and thoughts', 'Discipline', 'Direct', ['quotes', 'discipline']),
  e('A good rule of thumb is to be the calmest person in the room.', 'Quotes and thoughts', 'Composure', 'Wise', ['quotes', 'calm']),
  e('Most advice is a person describing their own scars.', 'Quotes and thoughts', 'People', 'Wise', ['quotes', 'advice']),
  e('Being right privately is not worth being unkind publicly.', 'Quotes and thoughts', 'Kindness', 'Wise', ['quotes', 'kindness']),
  h('अनुशासन उधार नहीं मिलता, वो हस्तांतरित नहीं होता।', 'Quotes and thoughts', 'अनुशासन', 'स्पष्ट', ['अनुशासन', 'उधार']),
  h('सबसे शांत आदमी बनो, बाकी बातें खुद बन जाएंगी।', 'Quotes and thoughts', 'संयम', 'गंभीर', ['शांत', 'बातें']),
  h('ज़्यादातर सलाह अपने ही ज़ख़्मों का बयान होती है।', 'Quotes and thoughts', 'लोग', 'गंभीर', ['सलाह', 'ज़ख़्म']),
  g('Anushasan udhaar nahi milta, woh hastantarit nahi hota.', 'Quotes and thoughts', 'Discipline', 'Direct', ['anushasan', 'udhaar']),
  g('Sabse shaant aadmi bano, baaki baatein khud ban jayengi.', 'Quotes and thoughts', 'Composure', 'Wise', ['shaant', 'baatein']),
  g('Zyadatar salaah apne hi zakhmon ka bayaan hoti hai.', 'Quotes and thoughts', 'People', 'Wise', ['salaah', 'zakhmon']),

  /* ------------------------------------------------------ Life and reality */
  e('You are not lazy. You are unexcited, and that is fixable.', 'Life and reality', 'Motivation', 'Warm', ['life', 'motivation']),
  e('Friendships need maintenance, not just history.', 'Life and reality', 'People', 'Wise', ['life', 'friendship']),
  e('The fastest way to feel better is to do one small thing.', 'Life and reality', 'Action', 'Practical', ['life', 'action']),
  e('Nobody owes you a version of the past that is kinder.', 'Life and reality', 'Acceptance', 'Direct', ['life', 'acceptance']),
  h('तुम आलसी नहीं हो, तुम ऊबे हुए हो, और वो ठीक हो सकता है।', 'Life and reality', 'प्रेरणा', 'कोमल', ['आलसी', 'ऊबे']),
  h('दोस्ती को सिर्फ़ इतिहास नहीं, देखभाल भी चाहिए।', 'Life and reality', 'लोग', 'गंभीर', ['दोस्ती', 'देखभाल']),
  h('कोई तुम्हें अतीत का नरम संस्करण देने का बाध्य नहीं है।', 'Life and reality', 'स्वीकृति', 'स्पष्ट', ['अतीत', 'संस्करण']),
  g('Tum aalsi nahi ho, tum oobe hue ho, aur woh theek ho sakta hai.', 'Life and reality', 'Motivation', 'Warm', ['aalsi', 'oobe']),
  g('Dosti ko sirf itihaas nahi, dekhbhaal bhi chahiye.', 'Life and reality', 'People', 'Wise', ['dosti', 'dekhbhaal']),

  /* --------------------------------------------------- Motivational depth */
  e('Start before the idea is good. Good arrives during the work.', 'Motivational', 'Starting', 'Wise', ['motivation', 'starting']),
  e('You are one boring commitment away from a better year.', 'Motivational', 'Habit', 'Encouraging', ['motivation', 'habit']),
  h('सोच अच्छी होने से पहले शुरू करो, अच्छाई काम के दौरान आती है।', 'Motivational', 'शुरुआत', 'गंभीर', ['शुरुआत', 'काम']),
  h('एक बोरिंग आदत तुम्हारा साल बदल सकती है।', 'Motivational', 'आदत', 'प्रेरक', ['आदत', 'साल']),
  g('Soch acchi hone se pehle shuru karo, acchai kaam ke dauraan aati hai.', 'Motivational', 'Starting', 'Wise', ['soch', 'shuru']),
  g('Ek boring aadat tumhara saal badal sakti hai.', 'Motivational', 'Habit', 'Encouraging', ['boring', 'saal']),

  /* --------------------------------------- Aesthetic / royal / professional */
  e('Old furniture, new ideas. That is the house.', 'Aesthetic', 'Interiors', 'Warm', ['aesthetic', 'furniture']),
  e('I like places that are slightly worn and fully loved.', 'Aesthetic', 'Texture', 'Warm', ['aesthetic', 'worn']),
  e('Dignity is what you keep when everything else is negotiated.', 'Royal and VIP', 'Bearing', 'Regal', ['royal', 'dignity']),
  e('Deals are easy. Relationships are the asset.', 'Professional and business', 'Trust', 'Wise', ['business', 'relationships']),
  e('Write it down and half the argument disappears.', 'Professional and business', 'Management', 'Practical', ['business', 'clarity']),
  h('पुराना फ़र्नीचर, नए विचार, यही घर है।', 'Aesthetic', 'घर', 'कोमल', ['फ़र्नीचर', 'घर']),
  h('जो जगहें थोड़ी घिसी और पूरी प्यारी हों, वो पसंद हैं।', 'Aesthetic', 'बनावट', 'सहज', ['जगहें', 'प्यारी']),
  g('Puraana furniture, naye vichaar, yahi ghar hai.', 'Aesthetic', 'Interiors', 'Warm', ['furniture', 'vichaar']),
  g('Jo jagah thodi ghisi aur poori pyaari ho, woh pasand hai.', 'Aesthetic', 'Texture', 'Warm', ['jagah', 'pyaari']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('I take the stairs to avoid small talk. Everyone wins.', 'Fitness', 'Everyday', 'Funny', ['fitness', 'stairs']),
  e('Running cleared my head before therapy did.', 'Fitness', 'Running', 'Honest', ['fitness', 'running']),
  e('Two dishes, one pan, no complaints.', 'Food and cooking', 'Cooking', 'Practical', ['food', 'simple']),
  e('I measure spices with my heart and regret it occasionally.', 'Food and cooking', 'Cooking', 'Funny', ['food', 'spices']),
  e('Every film I love is about someone being brave by accident.', 'Cinema and OTT', 'Film lover', 'Wise', ['cinema', 'bravery']),
  e('I watch the same comfort film when I am out of words.', 'Cinema and OTT', 'Comfort', 'Warm', ['cinema', 'comfort']),
  h('सीढ़ियाँ चढ़ता हूँ ताकि छोटी बातचीत से बचूँ।', 'Fitness', 'आदत', 'मज़ाकिया', ['सीढ़ियाँ', 'बातचीत']),
  h('दौड़ने ने दिमाग़ साफ़ किया, इलाज़ से पहले।', 'Fitness', 'दौड़', 'स्पष्ट', ['दौड़', 'दिमाग़']),
  h('दो व्यंजन, एक पैन, कोई शिकायत नहीं।', 'Food and cooking', 'रसोई', 'व्यावहारिक', ['व्यंजन', 'पैन']),
  h('वही आराम वाली फ़िल्म देखता हूँ जब शब्द खत्म हो जाते हैं।', 'Cinema and OTT', 'सिनेमा प्रेम', 'कोमल', ['फ़िल्म', 'शब्द']),
  g('Seedhiyan chadhta hoon taaki chhoti baatcheet se bachoon.', 'Fitness', 'Everyday', 'Funny', ['seedhiyan', 'baatcheet']),
  g('Do vyanjan, ek pan, koi shikayat nahi.', 'Food and cooking', 'Cooking', 'Practical', ['vyanjan', 'shikayat']),
  g('Wahi aaraam wali film dekhta hoon jab shabd khatam ho jaate hain.', 'Cinema and OTT', 'Comfort', 'Warm', ['film', 'shabd']),
];
