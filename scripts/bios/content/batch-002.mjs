/**
 * BioCraft original bios — batch 002.
 * Priority categories: attitude, royal, love, sad, alone, shayari, quotes.
 * Each line is written to stand alone; Hindi and Hinglish carry their own
 * images rather than translating the English.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_002 = [
  /* Attitude */
  e('Speak once, mean it twice.', 'Attitude', 'Economy of words', 'Blunt', ['words', 'confidence']),
  e('Not available for arguments I did not start.', 'Attitude', 'Boundaries', 'Dry', ['boundaries', 'peace']),
  e('I keep my promises quiet and my work loud.', 'Attitude', 'Integrity', 'Steady', ['integrity', 'work']),
  e('Respect is rented. It renews monthly.', 'Attitude', 'Standards', 'Witty', ['respect', 'standards']),
  e('I would rather be underestimated than explained.', 'Attitude', 'Restraint', 'Cool', ['restraint', 'mystery']),
  e('The version of me you met was the polite one.', 'Attitude', 'Warning', 'Sharp', ['sharp', 'warning']),
  e('No hard feelings. Just no second chances.', 'Attitude', 'Closure', 'Final', ['closure', 'limits']),
  e('Confidence is quiet because it has nothing to prove.', 'Attitude', 'Quiet confidence', 'Composed', ['confidence', 'calm']),
  h('एक बार बोलता हूँ, दो बार सोचता नहीं।', 'Attitude', 'स्पष्टता', 'दृढ़', ['स्पष्टता', 'दृढ़ता']),
  h('जो बात दिल से हो, उसमें दो राय नहीं।', 'Attitude', 'स्पष्टता', 'गंभीर', ['दिल', 'सच']),
  h('मेरी चुप्पी को कमज़ोरी मत समझना।', 'Attitude', 'चुप्पी', 'गंभीर', ['चुप्पी', 'ताकत']),
  h('इज़्ज़त मांगी नहीं जाती, कमाई जाती है।', 'Attitude', 'स्वाभिमान', 'दृढ़', ['इज़्ज़त', 'मेहनत']),
  h('लोग क्या सोचेंगे — यह सोचते-सोचते बहुत कुछ छूट जाता है।', 'Attitude', 'आज़ादी', 'सहज', ['आज़ादी', 'सोच']),
  h('मेरे फैसले मेरे हैं, नतीजे भी मेरे।', 'Attitude', 'ज़िम्मेदारी', 'दृढ़', ['फैसले', 'ज़िम्मेदारी']),
  g('Ek baar bolta hoon, phir samjhane ka time nahi hota.', 'Attitude', 'Direct', 'Blunt', ['bolna', 'time']),
  g('Jo log mujhe halka samajhte hain, unhe asli baat abhi pata nahi.', 'Attitude', 'Restraint', 'Sharp', ['log', 'asli']),
  g('Mera style simple hai, lekin standard high.', 'Attitude', 'Standards', 'Confident', ['style', 'standard']),
  g('Galti maan lena bhi ek attitude hai. Try karo kabhi.', 'Attitude', 'Humility', 'Witty', ['galti', 'attitude']),
  g('Waise to main shant hoon, bas galat baat pe aag lag jaati hai.', 'Attitude', 'Warning', 'Sharp', ['shant', 'aag']),
  g('Dosti mein dil deta hoon, dhoka mila to hisaab bhi leta hoon.', 'Attitude', 'Boundaries', 'Firm', ['dosti', 'hisaab']),

  /* Royal and VIP */
  e('Carries a family name and earns it daily.', 'Royal and VIP', 'Lineage', 'Regal', ['legacy', 'duty']),
  e('Elegance is a habit, not an outfit.', 'Royal and VIP', 'Etiquette', 'Refined', ['elegance', 'habit']),
  e('Old money manners, new money energy.', 'Royal and VIP', 'Modern royal', 'Witty', ['classic', 'hustle']),
  e('Never rushed. Never rude.', 'Royal and VIP', 'Composure', 'Poised', ['calm', 'manners']),
  e('A guest in grand rooms, at home in my own.', 'Royal and VIP', 'Grounded', 'Humble', ['home', 'poise']),
  h('खून में सलीका, सोच में ठहराव।', 'Royal and VIP', 'सलीका', 'सौम्य', ['सलीका', 'ठहराव']),
  h('शाही बातें कम, शालीन काम ज़्यादा।', 'Royal and VIP', 'शालीनता', 'सौम्य', ['शालीनता', 'काम']),
  h('बड़े लोगों की सबसे बड़ी पहचान — उनकी सादगी।', 'Royal and VIP', 'सादगी', 'गंभीर', ['सादगी', 'पहचान']),
  h('हम बोलते कम हैं, क्योंकि सुने जाने की आदत है।', 'Royal and VIP', 'रौब', 'गंभीर', ['रौब', 'सुनना']),
  g('Tameez aur taste, dono inherited hain.', 'Royal and VIP', 'Old money', 'Refined', ['tameez', 'taste']),
  g('Royalty dikhavi mein nahi, riwaz mein hoti hai.', 'Royal and VIP', 'Riwaz', 'Composed', ['royalty', 'riwaz']),
  g('Kursi bada nahi karti, kirdaar bada karta hai.', 'Royal and VIP', 'Character', 'Grounded', ['kirdaar', 'kursi']),
  g('Mehenga perfume nahi, saaf soch pehchaan hai.', 'Royal and VIP', 'Class over brands', 'Direct', ['soch', 'pehchaan']),

  /* Love and romance */
  e('You are the plot twist I did not see coming.', 'Love and romance', 'Playful', 'Charming', ['love', 'surprise']),
  e('Every ordinary Tuesday is better with your name on it.', 'Love and romance', 'Everyday love', 'Warm', ['everyday', 'love']),
  e('I like you most in your unedited voice.', 'Love and romance', 'Authentic', 'Tender', ['authentic', 'voice']),
  e('Met you in traffic, stayed for the conversation.', 'Love and romance', 'Meet-cute', 'Playful', ['story', 'love']),
  e('I do not need forever. I need you on the bad days.', 'Love and romance', 'Devoted', 'Honest', ['loyalty', 'honesty']),
  e('You talk in stories and I keep listening.', 'Love and romance', 'Admiration', 'Soft', ['listening', 'love']),
  e('Handwritten notes beat every typing indicator.', 'Love and romance', 'Romantic gesture', 'Nostalgic', ['letters', 'romance']),
  e('My favourite place is still your shoulder.', 'Love and romance', 'Comfort', 'Tender', ['comfort', 'home']),
  h('तुमसे मिलकर लगा, वक़्त का कोई जल्दी नहीं।', 'Love and romance', 'ठहराव', 'कोमल', ['वक़्त', 'मोहब्बत']),
  h('तुम्हारे नाम में ही कुछ अपनापन है।', 'Love and romance', 'अपनापन', 'कोमल', ['नाम', 'अपनापन']),
  h('मोहब्बत का हिसाब नहीं होता, बस निभाई जाती है।', 'Love and romance', 'निभाना', 'भावुक', ['मोहब्बत', 'निभाना']),
  h('तुम्हारी बातें आधी रह जाएं, यह नहीं चाहता।', 'Love and romance', 'बातें', 'भावुक', ['बातें', 'दिल']),
  h('चाय ठंडी हो जाए, बातें नहीं।', 'Love and romance', 'रोज़मर्रा', 'सहज', ['चाय', 'बातें']),
  h('दूर होकर भी तुम्हारी आवाज़ में घर लगता है।', 'Love and romance', 'दूरी', 'कोमल', ['आवाज़', 'घर']),
  g('Tumhara naam lete hi din ban jaata hai, ajeeb baat hai.', 'Love and romance', 'Everyday love', 'Sweet', ['naam', 'din']),
  g('Traffic se start hua tha, dil pe pahunch gaya.', 'Love and romance', 'Meet-cute', 'Playful', ['traffic', 'dil']),
  g('Tum unedited awaz mein best lagte ho, sach mein.', 'Love and romance', 'Authentic', 'Tender', ['awaz', 'sach']),
  g('Chai thandi ho sakti hai, tumhari baatein nahi.', 'Love and romance', 'Everyday love', 'Warm', ['chai', 'baatein']),
  g('Dil ka hisaab nahi rakhta, bas nibhata hoon.', 'Love and romance', 'Devoted', 'Honest', ['dil', 'nibhana']),
  g('Door hoke bhi tumhari awaz mein ghar lagta hai.', 'Love and romance', 'Long distance', 'Tender', ['door', 'ghar']),

  /* Sad and heartbreak */
  e('I stopped explaining myself and the room got quieter.', 'Sad and heartbreak', 'Resignation', 'Numb', ['silence', 'exhaustion']),
  e('We were good until ordinary things started hurting.', 'Sad and heartbreak', 'Breakdown', 'Hollow', ['breakup', 'loss']),
  e('Some goodbyes arrive without anyone leaving.', 'Sad and heartbreak', 'Drift', 'Melancholic', ['distance', 'farewell']),
  e('I still save things you would have found funny.', 'Sad and heartbreak', 'Memory', 'Aching', ['memory', 'habit']),
  e('Healing is mostly pretending until it is true.', 'Sad and heartbreak', 'Recovery', 'Weary', ['healing', 'effort']),
  e('The worst part was how politely it ended.', 'Sad and heartbreak', 'Closure', 'Bitter', ['ending', 'polite']),
  h('कुछ अलविदा बिना किसी के जाए ही हो जाते हैं।', 'Sad and heartbreak', 'जुदाई', 'उदास', ['जुदाई', 'अलविदा']),
  h('अब वो बातें भी चुभती हैं, जो कभी हँसी थीं।', 'Sad and heartbreak', 'याद', 'भावुक', ['याद', 'बातें']),
  h('तुम्हारी याद अब आदत बन गई है, दर्द नहीं।', 'Sad and heartbreak', 'आदत', 'शांत', ['याद', 'आदत']),
  h('शिकायत नहीं है, बस थोड़ा अफ़सोस है।', 'Sad and heartbreak', 'अफ़सोस', 'शांत', ['अफ़सोस', 'स्वीकार']),
  h('जो टूटा, वो जुड़ गया — पर निशान रह गए।', 'Sad and heartbreak', 'निशान', 'गंभीर', ['निशान', 'सीख']),
  g('Tumhare jaane ke baad ghar thoda aur khaali lagta hai.', 'Sad and heartbreak', 'Loss', 'Melancholic', ['ghar', 'khaali']),
  g('Sach mein, aadat ho gayi thi tumhari awaaz ki.', 'Sad and heartbreak', 'Habit', 'Aching', ['aadat', 'awaz']),
  g('Mohabbat thi, par tootne se pehle hi thak gaye.', 'Sad and heartbreak', 'Breakdown', 'Weary', ['mohabbat', 'thak']),
  g('Log kehte hain bhool jao, koi tareeka batao bhi.', 'Sad and heartbreak', 'Recovery', 'Honest', ['bhoolna', 'log']),
  g('Meri burai mat karo, bas reply kar do.', 'Sad and heartbreak', 'Longing', 'Vulnerable', ['reply', 'burayi']),

  /* Alone and loneliness */
  e('I answer slowly and think deeply.', 'Alone and loneliness', 'Introvert', 'Quiet', ['introvert', 'thought']),
  e('Fully booked, mostly with myself.', 'Alone and loneliness', 'Solitude', 'Dry', ['solitude', 'time']),
  e('Silence is not emptiness. It is maintenance.', 'Alone and loneliness', 'Reflection', 'Calm', ['silence', 'rest']),
  e('Lonely in an honest way, not a tragic one.', 'Alone and loneliness', 'Clarity', 'Plain', ['loneliness', 'clarity']),
  e('Small circle, deep roots.', 'Alone and loneliness', 'Selective', 'Warm', ['circle', 'loyalty']),
  h('खुद के साथ जो वक़्त बिताता हूँ, वो व्यर्थ नहीं जाता।', 'Alone and loneliness', 'एकांत', 'शांत', ['एकांत', 'वक़्त']),
  h('चुप्पी भी एक जवाब होती है, बस देर से समझ आती है।', 'Alone and loneliness', 'चुप्पी', 'गंभीर', ['चुप्पी', 'जवाब']),
  h('किताबें, चाय और थोड़ी शांति — इतना ही चाहिए।', 'Alone and loneliness', 'साहचर्य', 'शांत', ['किताबें', 'चाय']),
  h('कम लोग, पर पक्के लोग।', 'Alone and loneliness', 'दायरा', 'सहज', ['दोस्त', 'दायरा']),
  g('Akela hoon kyunki bheed thaka deti hai.', 'Alone and loneliness', 'Solitude', 'Honest', ['bheed', 'akela']),
  g('Apne saath waqt bitana bhi ek skill hai.', 'Alone and loneliness', 'Reflection', 'Calm', ['waqt', 'skill']),
  g('Chai, kitaab aur thoda sa sukoon. Bas.', 'Alone and loneliness', 'Solitude', 'Quiet', ['chai', 'kitaab']),
  g('Circle chhota hai, par kaam ka hai.', 'Alone and loneliness', 'Selective', 'Warm', ['circle', 'kaam']),

  /* Shayari — two line */
  h('दिल की बातें कहते नहीं, सिर्फ़ आँखों में रखते हैं,\nतुमने एक बार देखा, और हम सब कह गए।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['दिल', 'नज़र']),
  h('मेरे पास दौलत नहीं, सिर्फ़ एक दिल है,\nपर वो दिल तुम्हारे नाम का है।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['दिल', 'इज़हार']),
  h('तेरे बिना रात भी सो नहीं पाती,\nऔर तुझसे मिलकर सुबह भी देर करती है।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['रात', 'सुबह']),
  h('ज़िंदगी ने जो सिखाया, वो किताबों में नहीं,\nहर सबक एक आँसू के बराबर रहा।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['ज़िंदगी', 'सबक']),
  h('मैं अपनी राह खुद बनाता हूँ,\nमंज़िल मिले न मिले, रास्ता अपना है।', 'Shayari', 'दो पंक्ति', 'दृढ़', ['मंज़िल', 'राह']),
  h('लोग मंज़िल देखते हैं, मैं धूल देखता हूँ,\nजो उड़ी मेरे कदमों के नीचे से।', 'Shayari', 'दो पंक्ति', 'गर्व', ['मंज़िल', 'मेहनत']),
  h('जिनके पास हौसला है, वही बोझ उठाते हैं,\nबाकी तो बस सहारा खोजते हैं।', 'Shayari', 'दो पंक्ति', 'प्रेरक', ['हौसला', 'ज़िम्मेदारी']),
  h('दोस्ती का भी एक रिवाज़ होता है,\nबिन बताए पहुँच जाना, बिन पूछे टिक जाना।', 'Shayari', 'दो पंक्ति', 'स्नेही', ['दोस्ती', 'अपनापन']),

  /* Shayari — four line */
  h('कुछ बातें कहने से बेहतर होती हैं,\nकुछ लोग समझने से अच्छे लगते हैं,\nऔर कुछ मुलाक़ातें,\nबिन वजह याद रह जाती हैं।', 'Shayari', 'चार पंक्ति', 'भावुक', ['मुलाक़ात', 'याद']),
  h('रास्ते लंबे थे, पर मन नहीं डिगा,\nरात काली थी, पर सुबह का भरोसा था,\nहारती तो ज़िंदगी हर मोड़ पर थी,\nपर जीत को भी कुछ तो कहना था।', 'Shayari', 'चार पंक्ति', 'प्रेरक', ['भरोसा', 'जीत']),
  h('मैं शहर में रहता हूँ, दिल गाँव में,\nसपने बड़े हैं, जड़ें छोटी,\nमाँ का डांटना याद आता है कभी,\nऔर काम का दबाव रोज़।', 'Shayari', 'चार पंक्ति', 'शांत', ['शहर', 'गाँव']),
  g('Baatein kuch adhuri si hain,\nmain hoon, tu hai, bas doori si hai.\nPal bhar ko paas aa ja,\nduniya phir shor karke chali jaayegi.', 'Shayari', 'Four line', 'Romantic', ['doori', 'pyaar']),
  g('Kaam bada hai par hausla kam nahi,\nraat lambi thi par subah ka bharosa tha.\nLog mujhe halka samajhte hain,\nunhe asli waqt dikhana baaki hai.', 'Shayari', 'Four line', 'Bold', ['hausla', 'subah']),
  g('Maine sikha tha chup rehna,\nkyunki shor bura lagne laga.\nPhir kuch log mile jo samajh gaye,\nchup ke andar ki baat.', 'Shayari', 'Four line', 'Reflective', ['chup', 'log']),

  /* Quotes and thoughts */
  e('You do not need a bigger life. You need a closer look.', 'Quotes and thoughts', 'Perspective', 'Reflective', ['perspective', 'contentment']),
  e('Most answers arrive after you stop asking urgently.', 'Quotes and thoughts', 'Patience', 'Calm', ['patience', 'answers']),
  e('Discipline is kindness to your future self.', 'Quotes and thoughts', 'Discipline', 'Wise', ['discipline', 'future']),
  e('A quiet life is not a small one.', 'Quotes and thoughts', 'Contentment', 'Gentle', ['contentment', 'peace']),
  e('Do not confuse a slow start with a wrong direction.', 'Quotes and thoughts', 'Encouragement', 'Kind', ['direction', 'patience']),
  e('The best revenge is an unhurried life.', 'Quotes and thoughts', 'Composure', 'Cool', ['composure', 'detachment']),
  h('जवाब जल्दी माँगने से देर से आते हैं।', 'Quotes and thoughts', 'धैर्य', 'शांत', ['धैर्य', 'जवाब']),
  h('शांत ज़िंदगी भी छोटी नहीं होती।', 'Quotes and thoughts', 'संतोष', 'सौम्य', ['संतोष', 'शांति']),
  h('जो अपने आप से जीतता है, वो बाहर से नहीं हारता।', 'Quotes and thoughts', 'आत्म-संयम', 'गंभीर', ['जीत', 'संयम']),
  h('हर देरी दरवाज़ा नहीं होती, कभी बस सीख होती है।', 'Quotes and thoughts', 'सीख', 'सहज', ['देरी', 'सीख']),
  g('Jaldi mein liye gaye faisle, dhire se kaam poore karte hain.', 'Quotes and thoughts', 'Patience', 'Reflective', ['faisle', 'patience']),
  g('Chhoti zindagi nahi hai, bas doosron se compare karne ki aadat hai.', 'Quotes and thoughts', 'Contentment', 'Honest', ['zindagi', 'compare']),
  g('Sabse acha revenge: chain ki zindagi aur halat.', 'Quotes and thoughts', 'Composure', 'Cool', ['chain', 'attitude']),
];
