/**
 * BioCraft original bios — batch 057.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 34 HI / 31 HG.
 * New subject matter: a wedding hall bill split, the milkman, night bus home,
 * a friend's divorce, learning to say no to relatives.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_057 = [
  /* ------------------------------------------------------------ Attitude */
  e('I split the bill in the group chat the same night.', 'Attitude', 'Fairness', 'Direct', ['attitude', 'bill']),
  e('I say no to relatives with a straight face and a warm voice.', 'Attitude', 'Boundaries', 'Firm', ['attitude', 'boundaries']),
  e('I pay the milkman on the first, not when I remember.', 'Attitude', 'Integrity', 'Practical', ['attitude', 'milkman']),
  h('बिल उसी रात ग्रुप में बाँट देता हूँ।', 'Attitude', 'न्याय', 'स्पष्ट', ['बिल', 'रात']),
  h('रिश्तेदारों को सीधे मुँह ना कहता हूँ, और नरम आवाज़ में कहता हूँ।', 'Attitude', 'सीमाएँ', 'दृढ़', ['रिश्तेदारों', 'आवाज़']),
  h('जहाँ वेटर पर चिल्लाया जाता है, वहाँ मैं नहीं बैठता।', 'Attitude', 'मूल्य', 'तीखा', ['वेटर', 'बैठता']),
  g('Bill usi raat group mein baant deta hoon.', 'Attitude', 'Fairness', 'Direct', ['bill', 'raat']),
  g('Rishtedaaron ko seedhe munh na kehta hoon, aur naram awaaz mein kehta hoon.', 'Attitude', 'Boundaries', 'Firm', ['rishtedaaron', 'awaaz']),
  g('Jahan waiter par chillaaya jaata hai, wahan main nahi baithta.', 'Attitude', 'Values', 'Sharp', ['waiter', 'baithta']),

  /* ------------------------------------------------------------- Love */
  e('You held my hand through the worst phone call of my life.', 'Love and romance', 'Support', 'Tender', ['love', 'support']),
  e('I want a marriage where nobody keeps score.', 'Love and romance', 'Real love', 'Wise', ['love', 'score']),
  e('Your laugh in a crowded room is the only thing I listen for.', 'Love and romance', 'Yearning', 'Tender', ['love', 'laugh']),
  h('तुमने ज़िंदगी के सबसे बुरे फ़ोन कॉल में मेरा हाथ थामे रखा।', 'Love and romance', 'साथ', 'कोमल', ['फ़ोन', 'हाथ']),
  h('हम एक-दूसरे को बोरिंग बातें बताते हैं, और वो बोरिंग नहीं लगतीं।', 'Love and romance', 'अपनापन', 'कोमल', ['बातें', 'बोरिंग']),
  h('घर में कोई दिन-रात का लेखा नहीं रखता, और यही सुकून है।', 'Love and romance', 'सच्चा प्यार', 'गंभीर', ['घर', 'लेखा']),
  g('Tumne zindagi ke sabse bure phone call mein mera haath thaame rakha.', 'Love and romance', 'Support', 'Tender', ['phone', 'haath']),
  g('Hum ek-doosre ko boring baatein batate hain, aur woh boring nahi lagti.', 'Love and romance', 'Closeness', 'Warm', ['baatein', 'boring']),
  g('Ghar mein koi din-raat ka lekha nahi rakhta, aur yahi sukoon hai.', 'Love and romance', 'Real love', 'Wise', ['ghar', 'lekha']),

  /* ------------------------------------------------------- Sad depth */
  e('My friend divorce made me look at my own marriage carefully.', 'Sad and heartbreak', 'Friends', 'Honest', ['sad', 'divorce']),
  e('The night bus home is where the city stops pretending.', 'Sad and heartbreak', 'Cities', 'Heavy', ['sad', 'bus']),
  e('I learned to say no to family at thirty-one, and it cost a year.', 'Sad and heartbreak', 'Family', 'Heavy', ['sad', 'boundaries']),
  h('दोस्त के तलाक़ ने मुझे अपनी शादी ध्यान से देखने पर मजबूर किया।', 'Sad and heartbreak', 'दोस्त', 'स्पष्ट', ['तलाक़', 'शादी']),
  h('रात की बस में शहर दिखावा छोड़ देता है।', 'Sad and heartbreak', 'शहर', 'भारी', ['बस', 'शहर']),
  h('शादी होने के बाद शादी का हॉल बिल आया।', 'Sad and heartbreak', 'पैसा', 'सहज', ['शादी', 'बिल']),
  g('Dost ke talaaq ne mujhe apni shaadi dhyan se dekhne par majboor kiya.', 'Sad and heartbreak', 'Friends', 'Honest', ['talaaq', 'shaadi']),
  g('Raat ki bus mein shehar dikhawa chhod deta hai.', 'Sad and heartbreak', 'Cities', 'Heavy', ['bus', 'shehar']),
  g('Shaadi hone ke baad shaadi ka hall bill aaya.', 'Sad and heartbreak', 'Money', 'Wry', ['shaadi', 'bill']),

  /* --------------------------------------------------------- Shayari */
  h('रात की बस\nमें कोई\nनक़ाब नहीं पहनता।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['बस', 'नक़ाब']),
  h('हिसाब\nरिश्ते नहीं,\nबिलों के होते हैं।', 'Shayari', 'तीन पंक्ति', 'तीखा', ['हिसाब', 'बिलों']),
  g('Raat ki bus mein koi naqaab nahi pehnta.', 'Shayari', 'Two line', 'Deep', ['bus', 'naqaab']),
  g('Hisaab rishte nahi, billon ke hote hain.', 'Shayari', 'Two line', 'Sharp', ['hisaab', 'billon']),

  /* -------------------------------------------------- Quotes and ideas */
  e('Money is easy to split. Resentment is not.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'money']),
  e('A wedding hall is a rental of somebody else dream.', 'Quotes and thoughts', 'Weddings', 'Wry', ['quotes', 'wedding']),
  e('Saying no once can save a relationship for years.', 'Quotes and thoughts', 'Boundaries', 'Wise', ['quotes', 'boundaries']),
  e('The milkman keeps better hours than most offices.', 'Quotes and thoughts', 'Work', 'Warm', ['quotes', 'milkman']),
  h('पैसा बाँटना आसान है, कड़वाहट नहीं।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['पैसा', 'कड़वाहट']),
  h('शादी का हॉल किसी और के सपने का किराया है।', 'Quotes and thoughts', 'शादी', 'सहज', ['हॉल', 'किराया']),
  h('एक बार ना कहने से रिश्ता सालों बच जाता है।', 'Quotes and thoughts', 'सीमाएँ', 'गंभीर', ['रिश्ता', 'सालों']),
  g('Paisa baantna aasaan hai, kadwahat nahi.', 'Quotes and thoughts', 'Money', 'Sharp', ['paisa', 'kadwahat']),
  g('Shaadi ka hall kisi aur ke sapne ka kiraaya hai.', 'Quotes and thoughts', 'Weddings', 'Wry', ['hall', 'kiraaya']),
  g('Ek baar na kehne se rishta saalon bach jaata hai.', 'Quotes and thoughts', 'Boundaries', 'Wise', ['rishta', 'saalon']),

  /* ------------------------------------------------- Life and reality */
  e('Split the hall cost before you book the hall.', 'Life and reality', 'Weddings', 'Practical', ['life', 'wedding']),
  e('A relative who only calls for money is a bill, not a bond.', 'Life and reality', 'Family', 'Sharp', ['life', 'relatives']),
  e('Take the night bus once and you will stop worrying about traffic.', 'Life and reality', 'Cities', 'Wry', ['life', 'bus']),
  e('Ask a friend how the divorce is going. Nobody else will.', 'Life and reality', 'Friends', 'Warm', ['life', 'friends']),
  h('हॉल बुक करने से पहले हॉल का हिसाब बाँट लो।', 'Life and reality', 'शादी', 'व्यावहारिक', ['हॉल', 'हिसाब']),
  h('जो रिश्तेदार सिर्फ़ पैसे के लिए फ़ोन करे, वो रिश्ता नहीं बिल है।', 'Life and reality', 'परिवार', 'तीखा', ['रिश्तेदार', 'बिल']),
  h('पैसे कम हों तो छोटे दुकानदार को पहले दो।', 'Life and reality', 'पैसा', 'गंभीर', ['दुकानदार', 'पैसे']),
  g('Hall book karne se pehle hall ka hisaab baant lo.', 'Life and reality', 'Weddings', 'Practical', ['hall', 'hisaab']),
  g('Jo rishtedaar sirf paise ke liye phone kare, woh rishta nahi bill hai.', 'Life and reality', 'Family', 'Sharp', ['rishtedaar', 'bill']),
  g('Paise kam hon toh chhote dukaandaar ko pehle do.', 'Life and reality', 'Money', 'Wise', ['dukaandaar', 'paise']),

  /* ------------------------------------------------------ Motivational */
  e('You can be generous and still keep the accounts.', 'Motivational', 'Balance', 'Warm', ['motivation', 'accounts']),
  e('A no said kindly is kinder than a yes said badly.', 'Motivational', 'Honesty', 'Wise', ['motivation', 'honesty']),
  e('Ask about the divorce. That is the whole skill.', 'Motivational', 'Friendship', 'Direct', ['motivation', 'friendship']),
  h('उदार रहो, और हिसाब भी रखो।', 'Motivational', 'संतुलन', 'कोमल', ['उदार', 'हिसाब']),
  h('नरमी से कहा गया ना, बुरी तरह कहे हाँ से बेहतर है।', 'Motivational', 'ईमानदारी', 'गंभीर', ['नरमी', 'हाँ']),
  g('Udaar raho, aur hisaab bhi rakho.', 'Motivational', 'Balance', 'Warm', ['udaar', 'hisaab']),
  g('Narmi se kaha gaya na, buri tarah kahe haan se behtar hai.', 'Motivational', 'Honesty', 'Wise', ['narmi', 'haan']),

  /* -------------------------------------------------------- Aesthetic */
  e('A wedding hall with fewer flowers and better light wins.', 'Aesthetic', 'Weddings', 'Composed', ['aesthetic', 'wedding']),
  e('The best wedding photo is the one nobody posed for.', 'Aesthetic', 'Memory', 'Warm', ['aesthetic', 'photo']),
  h('कम फूल और अच्छी रोशनी वाला हॉल जीत जाता है।', 'Aesthetic', 'शादी', 'शांत', ['फूल', 'रोशनी']),
  h('गरम रोशनी और ठंडा पानी, पूरी शादी की सजावट।', 'Aesthetic', 'शादी', 'व्यावहारिक', ['रोशनी', 'पानी']),
  g('Kam phool aur acchi roshni wala hall jeet jaata hai.', 'Aesthetic', 'Weddings', 'Composed', ['phool', 'roshni']),
  g('Garam roshni aur thanda paani, poori shaadi ki sajawat.', 'Aesthetic', 'Weddings', 'Practical', ['roshni', 'paani']),

  /* ---------------------------------------------- Wider category band */
  e('The night bus is cheaper than a bad decision made at midnight.', 'Yoga and wellness', 'Restraint', 'Wry', ['yoga', 'bus']),
  e('Ask for the exam paper pattern before you study for it.', 'Student life', 'Exams', 'Practical', ['student', 'pattern']),
  e('Put the split in the invoice. It ends the argument early.', 'Professional and business', 'Money', 'Practical', ['professional', 'invoice']),
  e('Fielding in the dark hour is where matches are lost.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'fielding']),
  e('Pay for the service on time and the mechanic tells you the truth.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'mechanic']),
  e('A well-made plain kurta at a wedding beats any rented sherwani.', 'Fashion and beauty', 'Weddings', 'Practical', ['fashion', 'kurta']),
  e('A payment reminder email is the least glamorous useful code.', 'Technology and coding', 'Craft', 'Wry', ['tech', 'billing']),
  e('Measure twice, publish once, apologise never.', 'Science and curiosity', 'Method', 'Wise', ['science', 'method']),
  e('Split equity in writing on the day you start.', 'Startup and hustle', 'Founders', 'Direct', ['startup', 'equity']),
  e('A hall booked for two hundred needs a house that can host fifty.', 'Home and interiors', 'Budget', 'Practical', ['home', 'budget']),
  e('Fewer guests, better food, no debt.', 'Minimal', 'Celebration', 'Practical', ['minimal', 'celebration']),
  e('Get the sherwani altered once and nobody notices the rental.', 'Stylish', 'Weddings', 'Practical', ['stylish', 'sherwani']),
  e('The funniest person at a wedding is the one counting the plates.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'wedding']),
  e('I will tell you the hall cost before you fall in love with the hall.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who asks about your divorce is worth ten who do not.', 'Friendship', 'Support', 'Warm', ['friendship', 'support']),
  e('My mother taught me to pay the milkman before the landlord.', 'Family', 'Parents', 'Warm', ['family', 'parents']),
  e('Give the day a small fixed hour and the rest will follow.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the hall before the guests arrive and the flowers wilt.', 'Photography', 'Weddings', 'Practical', ['photography', 'wedding']),
  e('The cheapest city trip is the night bus to your own district.', 'Travel and adventure', 'Cities', 'Wry', ['travel', 'bus']),
  e('A wedding account with real numbers beats an aesthetic feed.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who sends the split within an hour.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'bill']),
  e('I will not pay for a hall to impress a relative I avoid.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'wedding']),
  e('Rent a hall in monsoon only if you have seen the roof.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'hall']),
  h('कमरे के महीने की तरह रोज़ का एक छोटा वक़्त तय करो।', 'Spirituality and peace', 'अभ्यास', 'गंभीर', ['वक़्त', 'अभ्यास']),
  h('मेरी माँ ने सिखाया, मकान मालिक से पहले दूध वाले को पैसे दो।', 'Family', 'माँ-बाप', 'कोमल', ['माँ', 'दूध']),
  h('घर में बिल एक जगह रखो, बहस वहीं खत्म होती है।', 'Home and interiors', 'बजट', 'व्यावहारिक', ['बिल', 'घर']),
  g('Kamre ke mahine ki tarah roz ka ek chhota waqt tay karo.', 'Spirituality and peace', 'Practice', 'Wise', ['waqt', 'abhyaas']),
  g('Meri maa ne sikhaya, makaan malik se pehle doodh wale ko paise do.', 'Family', 'Parents', 'Warm', ['maa', 'doodh']),
  g('Ghar mein bill ek jagah rakho, bahas wahin khatam hoti hai.', 'Home and interiors', 'Budget', 'Practical', ['bill', 'ghar']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('जहाँ वेटर पर चिल्लाते हैं, वहाँ मैं पानी भी नहीं पीता।', 'Attitude', 'मूल्य', 'तीखा', ['वेटर', 'पानी']),
  h('हम एक-दूसरे को बोरिंग बातें सुनाते हैं, और वो अच्छी लगती हैं।', 'Love and romance', 'अपनापन', 'कोमल', ['बातें', 'अच्छी']),
  h('हॉल का बिल शादी के बाद आया, और घर चुप हो गया।', 'Sad and heartbreak', 'पैसा', 'भारी', ['हॉल', 'बिल']),
  h('पैसे कम हों तो छोटे वाले को पहले चुकाओ, वही बचाएगा।', 'Life and reality', 'पैसा', 'गंभीर', ['पैसे', 'चुकाओ']),
  h('गरम रोशनी और ठंडा पानी, बाकी सब दिखावा है।', 'Aesthetic', 'शादी', 'व्यावहारिक', ['रोशनी', 'दिखावा']),
  h('रात की बस में अजनबियों के बीच भी अकेलापन रहता है।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['बस', 'अकेलापन']),
  g('Jahan waiter par chillaate hain, wahan main paani bhi nahi peeta.', 'Attitude', 'Values', 'Sharp', ['waiter', 'paani']),
  g('Hum ek-doosre ko boring baatein sunate hain, aur woh acchi lagti hain.', 'Love and romance', 'Closeness', 'Warm', ['baatein', 'acchi']),
  g('Hall ka bill shaadi ke baad aaya, aur ghar chup ho gaya.', 'Sad and heartbreak', 'Money', 'Heavy', ['hall', 'bill']),
  g('Paise kam hon toh chhote wale ko pehle chukao, wahi bachaayega.', 'Life and reality', 'Money', 'Wise', ['paise', 'chukao']),
  g('Garam roshni aur thanda paani, baaki sab dikhawa hai.', 'Aesthetic', 'Weddings', 'Practical', ['roshni', 'dikhawa']),
  g('Raat ki bus mein ajnabiyon ke beech bhi akelapan rehta hai.', 'Alone and loneliness', 'Solitude', 'Honest', ['bus', 'akelapan']),

  /* ---------------- final HI/HG top-up to reach balance.mjs allocation */
  h('दूध वाले को पहली तारीख़ पर पैसे देता हूँ, याद आने पर नहीं।', 'Attitude', 'ईमानदारी', 'व्यावहारिक', ['दूध', 'तारीख़']),
  h('तलाक़ के बारे में दोस्त से पूछो, और कोई नहीं पूछेगा।', 'Life and reality', 'दोस्त', 'कोमल', ['तलाक़', 'दोस्त']),
  h('रात की बस में शहर अपना असली चेहरा दिखाता है।', 'Life and reality', 'शहर', 'सहज', ['बस', 'चेहरा']),
  h('शादी में कम फूल और अच्छी रोशनी, यही सब है।', 'Aesthetic', 'शादी', 'शांत', ['फूल', 'रोशनी']),
  g('Doodh wale ko pehli taarikh par paise deta hoon, yaad aane par nahi.', 'Attitude', 'Integrity', 'Practical', ['doodh', 'taarikh']),
  g('Talaaq ke baare mein dost se poocho, aur koi nahi poochega.', 'Life and reality', 'Friends', 'Warm', ['talaaq', 'dost']),
  g('Raat ki bus mein shehar apna asli chehra dikhaata hai.', 'Life and reality', 'Cities', 'Wry', ['bus', 'chehra']),
  g('Shaadi mein kam phool aur acchi roshni, yahi sab hai.', 'Aesthetic', 'Weddings', 'Composed', ['phool', 'roshni']),
];
