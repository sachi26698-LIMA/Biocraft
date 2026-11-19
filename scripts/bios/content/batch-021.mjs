/**
 * BioCraft original bios — batch 021.
 * Proportional 40/30/30: leaders + mid-field.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_021 = [
  /* -------------------------------------------------------------- Attitude */
  e('I have no interest in winning an argument I did not start.', 'Attitude', 'Restraint', 'Cool', ['attitude', 'restraint']),
  e('My attention is the most expensive thing I own.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'attention']),
  e('I am direct because I respect your time.', 'Attitude', 'Directness', 'Firm', ['attitude', 'direct']),
  e('You cannot insult your way into my good opinion.', 'Attitude', 'Composure', 'Witty', ['attitude', 'composure']),
  e('I do not keep score. I keep distance.', 'Attitude', 'Boundaries', 'Dry', ['attitude', 'distance']),
  e('Standards are just boundaries with better follow-through.', 'Attitude', 'Standards', 'Wise', ['attitude', 'standards']),
  e('I have nothing to prove to someone I would not ask for advice.', 'Attitude', 'Composure', 'Cool', ['attitude', 'composure']),
  h('जो बहस मैंने शुरू नहीं की, उसे जीतने में दिलचस्पी नहीं।', 'Attitude', 'संयम', 'शांत', ['बहस', 'संयम']),
  h('मेरा ध्यान सबसे महंगी चीज़ है जो मेरे पास है।', 'Attitude', 'सीमाएं', 'तीखा', ['ध्यान', 'महंगी']),
  h('मैं सीधा बोलता हूँ क्योंकि तुम्हारे वक़्त की कद्र करता हूँ।', 'Attitude', 'स्पष्टता', 'दृढ़', ['सीधा', 'वक़्त']),
  h('मैं हिसाब नहीं रखता, दूरी रखता हूँ।', 'Attitude', 'सीमाएं', 'शांत', ['हिसाब', 'दूरी']),
  g('Jo bahas maine shuru nahi ki, use jeetne mein dilchaspi nahi.', 'Attitude', 'Restraint', 'Cool', ['bahas', 'jeetne']),
  g('Main seedha bolta hoon kyunki tumhare waqt ki kadar karta hoon.', 'Attitude', 'Directness', 'Firm', ['seedha', 'waqt']),
  g('Main hisaab nahi rakhta, doori rakhta hoon.', 'Attitude', 'Boundaries', 'Dry', ['hisaab', 'doori']),

  /* ------------------------------------------------------ Love and romance */
  e('You are the only person I never get bored of explaining things to.', 'Love and romance', 'Patience', 'Tender', ['love', 'patience']),
  e('I like our quiet weekends more than any plan.', 'Love and romance', 'Everyday', 'Warm', ['love', 'weekends']),
  e('Love is choosing the same person on the days it is a choice.', 'Love and romance', 'Commitment', 'Wise', ['love', 'choice']),
  e('You make me want to be predictable.', 'Love and romance', 'Devotion', 'Sweet', ['love', 'commitment']),
  e('I do not need grand gestures. I need you to show up.', 'Love and romance', 'Real love', 'Honest', ['love', 'actions']),
  h('तुम अकेले हो जिन्हें मैं कुछ समझाते हुए कभी नहीं थकता।', 'Love and romance', 'सब्र', 'कोमल', ['समझाना', 'थकना']),
  h('मुझे कोई योजना नहीं, तुम्हारे साथ की शांत छुट्टियाँ चाहिए।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['योजना', 'छुट्टियाँ']),
  h('प्यार बड़े काम नहीं, रोज़ पहुँचना है।', 'Love and romance', 'निभाना', 'गंभीर', ['प्यार', 'पहुँचना']),
  h('तुम्हारे साथ मैं भविष्य के बारे में सोचना शुरू करता हूँ।', 'Love and romance', 'भविष्य', 'कोमल', ['भविष्य', 'सोचना']),
  g('Tum akele ho jinhe main kuch samjhate hue kabhi nahi thakta.', 'Love and romance', 'Patience', 'Tender', ['samjhate', 'thakta']),
  g('Mujhe koi yojana nahi, tumhare saath ki shaant chhuttiyan chahiye.', 'Love and romance', 'Everyday', 'Warm', ['yojana', 'chhuttiyan']),
  g('Pyaar bade kaam nahi, roz pahunchna hai.', 'Love and romance', 'Real love', 'Honest', ['pyaar', 'pahunchna']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('The version of us in my head is doing very well.', 'Sad and heartbreak', 'Longing', 'Wry', ['sad', 'longing']),
  e('I cried once and then I got on with it. That is not healing.', 'Sad and heartbreak', 'Honesty', 'Raw', ['sad', 'healing']),
  e('I keep the good parts and I am honest about the rest.', 'Sad and heartbreak', 'Recovery', 'Wise', ['sad', 'recovery']),
  e('You left and the city became a list of places I avoid.', 'Sad and heartbreak', 'Absence', 'Aching', ['sad', 'city']),
  h('मेरे सिर में हमारा जो संस्करण है, वो बहुत अच्छा चल रहा है।', 'Sad and heartbreak', 'लालसा', 'सहज', ['संस्करण', 'अच्छा']),
  h('मैं अच्छे हिस्से रखता हूँ और बाकी पर सच बोलता हूँ।', 'Sad and heartbreak', 'उबरना', 'गंभीर', ['हिस्से', 'सच']),
  h('तुम गए और शहर उन जगहों की सूची बन गया जहाँ मैं नहीं जाता।', 'Sad and heartbreak', 'गैरहाज़िरी', 'भावुक', ['शहर', 'सूची']),
  g('Mere sir mein hamara jo sanskaran hai, woh bahut accha chal raha hai.', 'Sad and heartbreak', 'Longing', 'Wry', ['sanskaran', 'accha']),
  g('Main achhe hisse rakhta hoon aur baaki par sach bolta hoon.', 'Sad and heartbreak', 'Recovery', 'Wise', ['hisse', 'sach']),
  g('Tum gaye aur shehar un jagaon ki soochi ban gaya jahan main nahi jaata.', 'Sad and heartbreak', 'Absence', 'Aching', ['shehar', 'soochi']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरा नाम अब भी\nमेरे फ़ोन में है, बस नंबर नहीं।', 'Shayari', 'दो पंक्ति', 'भावुक', ['नाम', 'नंबर']),
  h('मैं रोज़ थोड़ा-थोड़ा\nतुझसे दूर होता जा रहा हूँ।', 'Shayari', 'दो पंक्ति', 'भावुक', ['रोज़', 'दूर']),
  h('वो कह गया सब ठीक है,\nऔर मैं मान गया।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['ठीक', 'मान']),
  h('खिड़की खुली है,\nहवा तेरी तरफ़ से आती है।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['खिड़की', 'हवा']),
  h('मेरी सबसे अच्छी बात यही है\nकि मैं हारकर भी कोशिश करता हूँ।', 'Shayari', 'दो पंक्ति', 'प्रेरक', ['बात', 'कोशिश']),
  h('जो बीत गया, वो अध्याय है,\nपूरी किताब नहीं।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['अध्याय', 'किताब']),
  g('Tera naam ab bhi mere phone mein hai, bas number nahi.', 'Shayari', 'Two line', 'Aching', ['naam', 'number']),
  g('Main roz thoda thoda tujhse door hota ja raha hoon.', 'Shayari', 'Two line', 'Aching', ['roz', 'door']),
  g('Woh keh gaya sab theek hai, aur main maan gaya.', 'Shayari', 'Two line', 'Deep', ['theek', 'maan']),
  g('Khidki khuli hai, hawa teri taraf se aati hai.', 'Shayari', 'Two line', 'Romantic', ['khidki', 'hawa']),
  g('Jo beet gaya, woh adhyaay hai, poori kitaab nahi.', 'Shayari', 'Two line', 'Deep', ['adhyaay', 'kitaab']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('You are not busy. You are prioritising something else.', 'Quotes and thoughts', 'Priorities', 'Sharp', ['quotes', 'time']),
  e('Great work is boring to make and thrilling to receive.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'craft']),
  e('Silence answers more questions than arguments do.', 'Quotes and thoughts', 'Restraint', 'Wise', ['quotes', 'silence']),
  e('Invest in people who tell you when you are wrong.', 'Quotes and thoughts', 'People', 'Wise', ['quotes', 'people']),
  h('तुम व्यस्त नहीं हो, तुम किसी और चीज़ को प्राथमिकता दे रहे हो।', 'Quotes and thoughts', 'प्राथमिकता', 'स्पष्ट', ['व्यस्त', 'प्राथमिकता']),
  h('अच्छा काम बनाने में बोरिंग लगता है, मिलने में शानदार।', 'Quotes and thoughts', 'काम', 'गंभीर', ['काम', 'बोरिंग']),
  h('चुप्पी बहस से ज़्यादा सवालों के जवाब देती है।', 'Quotes and thoughts', 'संयम', 'गंभीर', ['चुप्पी', 'जवाब']),
  g('Tum vyast nahi ho, tum kisi aur cheez ko priority de rahe ho.', 'Quotes and thoughts', 'Priorities', 'Sharp', ['vyast', 'priority']),
  g('Achha kaam banane mein boring lagta hai, milne mein shaandar.', 'Quotes and thoughts', 'Craft', 'Wise', ['kaam', 'shaandar']),
  g('Chuppi bahas se zyada sawaalon ke jawab deti hai.', 'Quotes and thoughts', 'Restraint', 'Wise', ['chuppi', 'sawaalon']),

  /* ------------------------------------------------------ Life and reality */
  e('You will not remember the week you skipped rest. Take it.', 'Life and reality', 'Rest', 'Warm', ['life', 'rest']),
  e('The best investment I made was leaving a bad room.', 'Life and reality', 'Environment', 'Wise', ['life', 'environment']),
  e('Being early is a form of respect, not a personality.', 'Life and reality', 'Respect', 'Practical', ['life', 'punctuality']),
  e('You are allowed to change your mind and say so.', 'Life and reality', 'Honesty', 'Warm', ['life', 'honesty']),
  h('आराम छोड़े हुए हफ़्ते को कोई याद नहीं रखता। आराम करो।', 'Life and reality', 'आराम', 'कोमल', ['आराम', 'हफ़्ता']),
  h('जल्दी पहुँचना सम्मान है, व्यक्तित्व नहीं।', 'Life and reality', 'सम्मान', 'व्यावहारिक', ['जल्दी', 'सम्मान']),
  h('अपनी राय बदलना और बता देना, दोनों जायज़ हैं।', 'Life and reality', 'ईमानदारी', 'सहज', ['राय', 'बदलना']),
  g('Aaraam chhode hue hafte ko koi yaad nahi rakhta. Aaraam karo.', 'Life and reality', 'Rest', 'Warm', ['aaraam', 'yaad']),
  g('Apni raay badalna aur bata dena, dono jaayaz hain.', 'Life and reality', 'Honesty', 'Warm', ['raay', 'badalna']),

  /* --------------------------------------------------- Motivational depth */
  e('You cannot think your way into a habit. Do it badly first.', 'Motivational', 'Habit', 'Direct', ['motivation', 'habit']),
  e('The person who keeps going is the person who finishes.', 'Motivational', 'Persistence', 'Wise', ['motivation', 'persistence']),
  h('आदत सोच से नहीं बनती, पहले बुरी तरह करनी पड़ती है।', 'Motivational', 'आदत', 'स्पष्ट', ['आदत', 'सोच']),
  h('जो चलता रहता है, वही पूरा करता है।', 'Motivational', 'निरंतरता', 'गंभीर', ['चलना', 'पूरा']),
  g('Aadat soch se nahi banti, pehle buri tarah karni padti hai.', 'Motivational', 'Habit', 'Direct', ['aadat', 'buri']),
  g('Jo chalta rehta hai, wahi poora karta hai.', 'Motivational', 'Persistence', 'Wise', ['chalta', 'poora']),

  /* -------------------------------------------- Aesthetic / poetry / depth */
  e('A room with good light and no clutter. That is my whole aspiration.', 'Aesthetic', 'Interiors', 'Calm', ['aesthetic', 'light']),
  e('I write short because I edit honestly.', 'Poetry', 'Craft', 'Wise', ['poetry', 'craft']),
  e('Every good line arrived after three bad ones.', 'Poetry', 'Process', 'Honest', ['poetry', 'process']),
  h('अच्छी रोशनी और खाली जगह, बस इतनी ही चाहत है।', 'Aesthetic', 'घर', 'शांत', ['रोशनी', 'जगह']),
  h('हर अच्छी पंक्ति तीन खराब पंक्तियों के बाद आई।', 'Poetry', 'रचना', 'सहज', ['पंक्ति', 'रचना']),
  g('Acchi roshni aur khaali jagah, bas itni hi chaahat hai.', 'Aesthetic', 'Interiors', 'Calm', ['roshni', 'jagah']),
  g('Har acchi pankti teen kharab panktiyon ke baad aayi.', 'Poetry', 'Process', 'Honest', ['pankti', 'kharab']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('I read textbooks for fun and it shows at parties.', 'Student life', 'Campus', 'Funny', ['student', 'study']),
  e('Hostel food taught me gratitude at scale.', 'Student life', 'Hostel', 'Wry', ['student', 'hostel']),
  e('Weekly matches, no trophies, excellent friends.', 'Cricket and sports', 'Cricket', 'Warm', ['cricket', 'friends']),
  e('Bad at both bat and ball, first to volunteer.', 'Cricket and sports', 'Cricket', 'Funny', ['cricket', 'team']),
  e('One plant at a time. Currently at eleven.', 'Nature', 'Plants', 'Warm', ['nature', 'plants']),
  e('I know the name of every tree on my street.', 'Nature', 'Observation', 'Observant', ['nature', 'trees']),
  h('मैं मज़े के लिए किताबें पढ़ता हूँ, और पार्टी में पता चल जाता है।', 'Student life', 'छात्र', 'मज़ाकिया', ['किताबें', 'पार्टी']),
  h('हॉस्टल के खाने ने शुक्र सिखाया।', 'Student life', 'हॉस्टल', 'सहज', ['हॉस्टल', 'शुक्र']),
  h('मेरी गली के हर पेड़ का नाम पता है।', 'Nature', 'सीख', 'सहज', ['पेड़', 'गली']),
  g('Ek paudha ek waqt, abhi gyarah ho gaye.', 'Nature', 'Plants', 'Warm', ['paudha', 'gyarah']),
  g('Hostel ke khaane ne shukr sikhaya, sach mein.', 'Student life', 'Hostel', 'Wry', ['hostel', 'shukr']),
  g('Bat aur ball dono mein bura, par volunteer pehla.', 'Cricket and sports', 'Cricket', 'Funny', ['bat', 'pehla']),
];
