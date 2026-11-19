/**
 * BioCraft original bios — batch 006.
 * Thin-category pass: the 25 categories still at 4–6 records each.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_006 = [
  /* ----------------------------------------------------------- Stylish */
  e('Well-pressed shirt, unbothered mind.', 'Stylish', 'Effortless', 'Cool', ['style', 'calm']),
  e('Style is the part of me that does not fidget.', 'Stylish', 'Poise', 'Confident', ['style', 'poise']),
  h('सलीका सिखाया नहीं जाता, आ जाता है।', 'Stylish', 'सलीका', 'आत्मविश्वासी', ['सलीका', 'शैली']),
  h('कपड़े सादे, बातें पक्की।', 'Stylish', 'सादगी', 'संक्षिप्त', ['सादगी', 'शैली']),
  g('Kapde saade, baatein pakki. Bas itna hi.', 'Stylish', 'Simplicity', 'Cool', ['kapde', 'baatein']),
  g('Style matlab shor nahi, shaanti.', 'Stylish', 'Poise', 'Calm', ['style', 'shaanti']),

  /* ------------------------------------------ Wedding and celebration */
  e('Here for the food, the dancing, and the aunties.', 'Wedding and celebration', 'Guest life', 'Playful', ['wedding', 'fun']),
  e('Poses for exactly one photo. Then eats.', 'Wedding and celebration', 'Guest life', 'Funny', ['wedding', 'photo']),
  h('शादी में खाना ज़रूरी है, बाकी सब बाद में।', 'Wedding and celebration', 'मेहमान', 'मज़ाकिया', ['शादी', 'खाना']),
  h('ढोल बजे तो पैर अपने आप हिलते हैं।', 'Wedding and celebration', 'नाच', 'खुश', ['ढोल', 'नाच']),
  g('Shaadi mein khaana zaroori hai, baaki sab baad mein.', 'Wedding and celebration', 'Guest life', 'Funny', ['shaadi', 'khaana']),
  g('Dhol baje toh pair apne aap hilte hain, kya karein.', 'Wedding and celebration', 'Dance', 'Happy', ['dhol', 'pair']),

  /* ----------------------------------------------- Monsoon and seasons */
  e('Waiting for the first rain like it owes me money.', 'Monsoon and seasons', 'Monsoon', 'Witty', ['monsoon', 'rain']),
  e('Chai tastes wrong in any weather except this one.', 'Monsoon and seasons', 'Monsoon', 'Cozy', ['chai', 'monsoon']),
  h('पहली बारिश में छाता भूल जाना भी एक रस्म है।', 'Monsoon and seasons', 'बारिश', 'सहज', ['बारिश', 'छाता']),
  h('बारिश की खुशबू में पुराना बचपन बसता है।', 'Monsoon and seasons', 'बारिश', 'भावुक', ['बारिश', 'बचपन']),
  g('Pehli baarish mein chhata bhool jaana bhi ek rasam hai.', 'Monsoon and seasons', 'Monsoon', 'Playful', ['baarish', 'chhata']),
  g('Baarish ki khushbu mein puraana bachpan basta hai.', 'Monsoon and seasons', 'Monsoon', 'Nostalgic', ['baarish', 'bachpan']),

  /* -------------------------------------------- Spirituality and peace */
  e('Faith, patience and one honest hour a day.', 'Spirituality and peace', 'Practice', 'Serene', ['faith', 'practice']),
  e('I stopped arguing with the universe and slept better.', 'Spirituality and peace', 'Acceptance', 'Wise', ['acceptance', 'peace']),
  h('शांति मंदिर में नहीं, सांस में मिलती है।', 'Spirituality and peace', 'साधना', 'शांत', ['शांति', 'सांस']),
  h('जो मिला उसमें शुक्र, जो नहीं मिला उसमें सब्र।', 'Spirituality and peace', 'संतोष', 'गंभीर', ['शुक्र', 'सब्र']),
  g('Shaanti mandir mein nahi, saans mein milti hai.', 'Spirituality and peace', 'Practice', 'Serene', ['shaanti', 'saans']),
  g('Jo mila usme shukr, jo nahi mila usme sabr.', 'Spirituality and peace', 'Contentment', 'Wise', ['shukr', 'sabr']),

  /* -------------------------------------------------------- Self-respect */
  e('Explain me to yourself however you like. I am not attending.', 'Self-respect', 'Boundaries', 'Firm', ['respect', 'boundaries']),
  e('Apology accepted. Access is not.', 'Self-respect', 'Boundaries', 'Sharp', ['apology', 'access']),
  h('माफ़ी मिल गई, पर दरवाज़ा बंद है।', 'Self-respect', 'सीमाएं', 'दृढ़', ['माफ़ी', 'दरवाज़ा']),
  h('मुझे प्यार चाहिए, तरस नहीं।', 'Self-respect', 'स्वाभिमान', 'स्पष्ट', ['प्यार', 'स्वाभिमान']),
  g('Maafi mil gayi, par darwaaza band hai.', 'Self-respect', 'Boundaries', 'Firm', ['maafi', 'darwaaza']),
  g('Mujhe pyaar chahiye, taras nahi.', 'Self-respect', 'Self-worth', 'Direct', ['pyaar', 'taras']),

  /* ------------------------------------------ Personality and identity */
  e('Quiet in groups, unreasonably talkative at 1 a.m.', 'Personality and identity', 'Introvert', 'Honest', ['introvert', 'nights']),
  e('I contain contradictions and I have stopped apologising.', 'Personality and identity', 'Selfhood', 'Confident', ['identity', 'self']),
  h('भीड़ में चुप, अकेले में पूरा शोर।', 'Personality and identity', 'स्वभाव', 'सहज', ['भीड़', 'स्वभाव']),
  h('मैं आसान नहीं हूँ, पर सच्चा हूँ।', 'Personality and identity', 'स्वभाव', 'स्पष्ट', ['सच्चा', 'स्वभाव']),
  g('Bheed mein chup, akele mein pura shor.', 'Personality and identity', 'Introvert', 'Honest', ['bheed', 'chor']),
  g('Main aasaan nahi hoon, par sachcha hoon.', 'Personality and identity', 'Selfhood', 'Direct', ['aasaan', 'sachcha']),

  /* --------------------------------------------------- Books and reading */
  e('Two shelves read twice, six bought in hope.', 'Books and reading', 'Reader life', 'Wry', ['books', 'reading']),
  e('I dog-ear pages. Judge me quietly.', 'Books and reading', 'Reader life', 'Playful', ['books', 'habit']),
  h('किताबें खरीदता हूँ, पढ़ने का इरादा भी रखता हूँ।', 'Books and reading', 'पढ़ने की आदत', 'मज़ाकिया', ['किताबें', 'इरादा']),
  h('जो किताब पढ़ते वक़्त रुलाए, वही याद रहती है।', 'Books and reading', 'पढ़ने का असर', 'भावुक', ['किताब', 'याद']),
  g('Kitaabein kharidta hoon, padhne ka iraada bhi rakhta hoon.', 'Books and reading', 'Reader life', 'Funny', ['kitaabein', 'iraada']),
  g('Jo kitaab padhte waqt rulaaye, wahi yaad rehti hai.', 'Books and reading', 'Reading', 'Emotional', ['kitaab', 'yaad']),

  /* ------------------------------------------------------ Food and cooking */
  e('Cooks badly, eats enthusiastically, hosts generously.', 'Food and cooking', 'Home kitchen', 'Warm', ['cooking', 'hosting']),
  e('My masala box is my personality.', 'Food and cooking', 'Home kitchen', 'Playful', ['masala', 'cooking']),
  h('मेरी रसोई में हलचल है, मेन्यू में भरोसा।', 'Food and cooking', 'रसोई', 'सहज', ['रसोई', 'मेन्यू']),
  h('मसालों की खुशबू ही असली घर है।', 'Food and cooking', 'घर', 'कोमल', ['मसाले', 'घर']),
  g('Meri rasoi mein halchal hai, menu mein bharosa.', 'Food and cooking', 'Home kitchen', 'Warm', ['rasoi', 'bharosa']),
  g('Masalon ki khushbu hi asli ghar hai.', 'Food and cooking', 'Home kitchen', 'Cozy', ['masale', 'ghar']),

  /* ----------------------------------------------- Technology and coding */
  e('Writes tests before feelings.', 'Technology and coding', 'Developer', 'Dry', ['testing', 'dev']),
  e('It worked on my machine. It is my machine.', 'Technology and coding', 'Developer', 'Funny', ['bugs', 'dev']),
  h('कोड चले तो मेरा, न चले तो सर्वर की गलती।', 'Technology and coding', 'डेवलपर', 'मज़ाकिया', ['कोड', 'सर्वर']),
  h('मैं बग ढूंढता हूँ, बहाने नहीं।', 'Technology and coding', 'डेवलपर', 'गंभीर', ['बग', 'बहाने']),
  g('Code chale toh mera, na chale toh server ki galti.', 'Technology and coding', 'Developer', 'Funny', ['code', 'server']),
  g('Main bug dhoondhta hoon, bahaane nahi.', 'Technology and coding', 'Developer', 'Direct', ['bug', 'bahaane']),

  /* ---------------------------------------------------- Fashion and beauty */
  e('Sunscreen and a good tailor. That is the routine.', 'Fashion and beauty', 'Routine', 'Practical', ['skincare', 'style']),
  e('Comfort first, drama second, trends maybe.', 'Fashion and beauty', 'Style rules', 'Confident', ['comfort', 'trends']),
  h('तैयार होने में वक़्त, पर सलीका पक्का।', 'Fashion and beauty', 'सलीका', 'आत्मविश्वासी', ['सलीका', 'वक़्त']),
  h('सादगी सबसे अच्छा श्रृंगार है।', 'Fashion and beauty', 'सादगी', 'गंभीर', ['सादगी', 'श्रृंगार']),
  g('Taiyaar hone mein waqt, par saleeka pakka.', 'Fashion and beauty', 'Style rules', 'Cool', ['waqt', 'saleeka']),
  g('Saadgi sabse achha shringaar hai, yaar.', 'Fashion and beauty', 'Simplicity', 'Warm', ['saadgi', 'yaar']),

  /* ----------------------------------------------------- Yoga and wellness */
  e('Stretch first. Decide second. This is a rule.', 'Yoga and wellness', 'Practice', 'Calm', ['yoga', 'routine']),
  e('Better back, quieter head, same person.', 'Yoga and wellness', 'Benefits', 'Honest', ['yoga', 'health']),
  h('शरीर ठीक हो तो मन भी साथ देता है।', 'Yoga and wellness', 'अभ्यास', 'शांत', ['शरीर', 'मन']),
  h('रोज़ दस मिनट, पर रोज़।', 'Yoga and wellness', 'नियम', 'संक्षिप्त', ['अभ्यास', 'नियम']),
  g('Shareer theek ho toh mann bhi saath deta hai.', 'Yoga and wellness', 'Practice', 'Calm', ['shareer', 'mann']),
  g('Roz das minute, par roz. Bas itna.', 'Yoga and wellness', 'Habit', 'Terse', ['roz', 'minute']),

  /* ------------------------------------------------------- Pets and animals */
  e('Owned by a cat who files complaints.', 'Pets and animals', 'Cats', 'Funny', ['cat', 'pets']),
  e('Four legs, zero opinions about my deadlines.', 'Pets and animals', 'Dogs', 'Warm', ['dog', 'pets']),
  h('बिल्ली का नौकर हूँ, खुशी से।', 'Pets and animals', 'बिल्ली', 'मज़ाकिया', ['बिल्ली', 'खुशी']),
  h('कुत्ते की पूँछ, इंसान की बात — दोनों सच कहती हैं।', 'Pets and animals', 'कुत्ते', 'सहज', ['कुत्ते', 'सच']),
  g('Billi ka naukar hoon, khushi se.', 'Pets and animals', 'Cats', 'Funny', ['billi', 'khushi']),
  g('Kutte ki poonch jhooth nahi bolti, yaar.', 'Pets and animals', 'Dogs', 'Warm', ['kutte', 'yaar']),

  /* ---------------------------------------------------- Startup and hustle */
  e('Building something small, carefully, on purpose.', 'Startup and hustle', 'Builder', 'Grounded', ['startup', 'building']),
  e('Revenue is the only feedback that does not flatter.', 'Startup and hustle', 'Reality', 'Direct', ['revenue', 'startup']),
  h('छोटा शुरू किया, पर सोच से नहीं।', 'Startup and hustle', 'शुरुआत', 'गंभीर', ['शुरुआत', 'सोच']),
  h('मेहनत का हिसाब बाज़ार खुद रखता है।', 'Startup and hustle', 'हकीकत', 'स्पष्ट', ['मेहनत', 'बाज़ार']),
  g('Chhota shuru kiya, par soch se nahi.', 'Startup and hustle', 'Builder', 'Grounded', ['chhota', 'soch']),
  g('Mehnat ka hisaab bazaar khud rakhta hai.', 'Startup and hustle', 'Reality', 'Direct', ['mehnat', 'hisaab']),

  /* ---------------------------------------------------- Science and curiosity */
  e('Ask why twice, then go and measure.', 'Science and curiosity', 'Method', 'Curious', ['science', 'method']),
  e('Fascinated by everything, expert in none. Working on it.', 'Science and curiosity', 'Curiosity', 'Honest', ['curiosity', 'learning']),
  h('दो बार क्यों पूछो, फिर खुद जाकर देखो।', 'Science and curiosity', 'तरीका', 'जिज्ञासु', ['क्यों', 'देखो']),
  h('सवाल छोटा हो या बड़ा, पूछना ज़रूरी है।', 'Science and curiosity', 'जिज्ञासा', 'सहज', ['सवाल', 'जिज्ञासा']),
  g('Do baar kyun poocho, phir khud jaake dekho.', 'Science and curiosity', 'Method', 'Curious', ['kyun', 'dekho']),
  g('Sawaal chhota ho ya bada, poochna zaroori hai.', 'Science and curiosity', 'Curiosity', 'Open', ['sawaal', 'zaroori']),

  /* ------------------------------------------------------- Cinema and OTT */
  e('Rewatches the same three films and defends them.', 'Cinema and OTT', 'Film lover', 'Playful', ['cinema', 'rewatch']),
  e('Credits stay. Always.', 'Cinema and OTT', 'Film lover', 'Terse', ['cinema', 'credits']),
  h('तीन फ़िल्में, सौ बार, फिर भी मज़ा।', 'Cinema and OTT', 'सिनेमा प्रेम', 'खुश', ['फ़िल्में', 'मज़ा']),
  h('क्रेडिट्स खत्म होने तक बैठता हूँ।', 'Cinema and OTT', 'सिनेमा प्रेम', 'स्पष्ट', ['क्रेडिट्स', 'फ़िल्म']),
  g('Teen filmein, sau baar, phir bhi maza.', 'Cinema and OTT', 'Film lover', 'Happy', ['filmein', 'maza']),
  g('Credits khatam hone tak baithta hoon, hamesha.', 'Cinema and OTT', 'Film lover', 'Direct', ['credits', 'hamesha']),

  /* ---------------------------------------------------- Cricket and sports */
  e('Gully cricket rules are the only rules I trust.', 'Cricket and sports', 'Cricket', 'Playful', ['cricket', 'gully']),
  e('Played badly for years. Loved every match.', 'Cricket and sports', 'Sports', 'Honest', ['sports', 'love']),
  h('गली क्रिकेट के नियम सबसे ईमानदार हैं।', 'Cricket and sports', 'क्रिकेट', 'मज़ाकिया', ['क्रिकेट', 'गली']),
  h('हार गए तो क्या, खेल तो अपना था।', 'Cricket and sports', 'खेल भावना', 'सहज', ['हार', 'खेल']),
  g('Gully cricket ke niyam sabse imaandaar hain.', 'Cricket and sports', 'Cricket', 'Funny', ['gully', 'niyam']),
  g('Haar gaye toh kya, khel toh apna tha.', 'Cricket and sports', 'Sportsmanship', 'Warm', ['haar', 'khel']),

  /* -------------------------------------------------------- Cars and bikes */
  e('Old bike, new roads, no schedule.', 'Cars and bikes', 'Riding', 'Free', ['bike', 'roads']),
  e('I know the engine sound before the problem.', 'Cars and bikes', 'Machines', 'Confident', ['engine', 'cars']),
  h('पुरानी बाइक, नए रास्ते, कोई जल्दी नहीं।', 'Cars and bikes', 'सफ़र', 'आज़ाद', ['बाइक', 'रास्ते']),
  h('गाड़ी की आवाज़ सुनकर पता चल जाता है क्या खराब है।', 'Cars and bikes', 'मरम्मत', 'आत्मविश्वासी', ['गाड़ी', 'आवाज़']),
  g('Bike puraani hai, raaste naye hain, aur koi jaldi nahi.', 'Cars and bikes', 'Riding', 'Free', ['bike', 'raaste']),
  g('Gaadi ki awaaz sunke pata chal jaata hai kya kharab hai.', 'Cars and bikes', 'Machines', 'Confident', ['gaadi', 'awaaz']),

  /* ---------------------------------------------------- Home and interiors */
  e('Plants, lamps and one chair nobody may sit on.', 'Home and interiors', 'Home', 'Wry', ['home', 'decor']),
  e('A home should smell like someone lives in it.', 'Home and interiors', 'Home', 'Warm', ['home', 'lived-in']),
  h('घर वो नहीं जो सजा हो, घर वो जो बसा हो।', 'Home and interiors', 'घर', 'गंभीर', ['घर', 'बसा']),
  h('मेरे घर में पौधे ज़्यादा, बर्तन कम।', 'Home and interiors', 'सजावट', 'सहज', ['पौधे', 'घर']),
  g('Ghar woh nahi jo saja ho, ghar woh jo basa ho.', 'Home and interiors', 'Home', 'Warm', ['ghar', 'basa']),
  g('Mere ghar mein paudhe zyada, bartan kam.', 'Home and interiors', 'Home', 'Witty', ['paudhe', 'bartan']),

  /* ------------------------------------------------------------ Parenting */
  e('Learning patience from a person who has none.', 'Parenting', 'Parent life', 'Wry', ['parenting', 'patience']),
  e('My child is the best thing I have ever been late for.', 'Parenting', 'Parent life', 'Tender', ['parenting', 'love']),
  h('बच्चे ने सिखाया कि सब्र क्या होता है।', 'Parenting', 'माता-पिता', 'कोमल', ['बच्चे', 'सब्र']),
  h('मेरी नींद चली गई, मेरी हँसी बढ़ गई।', 'Parenting', 'माता-पिता', 'सहज', ['नींद', 'हँसी']),
  g('Bachche ne sikhaya ki sabr kya hota hai.', 'Parenting', 'Parent life', 'Tender', ['bachche', 'sabr']),
  g('Meri neend chali gayi, meri hansi badh gayi.', 'Parenting', 'Parent life', 'Warm', ['neend', 'hansi']),

  /* ----------------------------------------------------- Deep and emotional */
  e('Some people are homes you cannot move back into.', 'Deep and emotional', 'Longing', 'Heavy', ['longing', 'home']),
  e('I kept the version of me you liked. She got tired.', 'Deep and emotional', 'Identity', 'Raw', ['identity', 'loss']),
  h('कुछ लोग घर होते हैं, जहाँ लौटा नहीं जाता।', 'Deep and emotional', 'लालसा', 'गंभीर', ['घर', 'लौटना']),
  h('जिस्म पास था, दिल कहीं और।', 'Deep and emotional', 'अधूरापन', 'भावुक', ['दिल', 'अधूरा']),
  g('Kuch log ghar hote hain, jahan lautaa nahi jaata.', 'Deep and emotional', 'Longing', 'Heavy', ['ghar', 'lautna']),
  g('Jism paas tha, dil kahin aur.', 'Deep and emotional', 'Distance', 'Emotional', ['jism', 'dil']),

  /* --------------------------------------------------------- Savage and bold */
  e('Your opinion was not on the agenda. Next item.', 'Savage and bold', 'Savage', 'Sharp', ['savage', 'attitude']),
  e('I am the plot twist you did not budget for.', 'Savage and bold', 'Savage', 'Bold', ['savage', 'twist']),
  h('आपकी राय का एजेंडा में नाम नहीं था।', 'Savage and bold', 'स्पष्टता', 'तीखा', ['राय', 'एजेंडा']),
  h('मुझे दोबारा मत बुलाना, बात पहली बार में नहीं सुनी।', 'Savage and bold', 'सीमाएं', 'तीखा', ['बात', 'सीमा']),
  g('Aapki raay ka agenda mein naam nahi tha.', 'Savage and bold', 'Savage', 'Sharp', ['raay', 'agenda']),
  g('Mujhe dobara mat bulana, baat pehli baar mein nahi suni.', 'Savage and bold', 'Boundaries', 'Blunt', ['baat', 'bulana']),

  /* ------------------------------------------------------- Instagram profiles */
  e('Mostly sky, occasionally me, never filters.', 'Instagram profiles', 'Feed', 'Simple', ['instagram', 'feed']),
  e('Archiving more than posting. Growth.', 'Instagram profiles', 'Feed', 'Wry', ['instagram', 'growth']),
  h('आसमान बहुत, चेहरा कभी-कभी।', 'Instagram profiles', 'प्रोफ़ाइल', 'सहज', ['आसमान', 'प्रोफ़ाइल']),
  h('तस्वीरें कम, यादें ज़्यादा।', 'Instagram profiles', 'प्रोफ़ाइल', 'संक्षिप्त', ['तस्वीरें', 'यादें']),
  g('Aasman bahut, chehra kabhi kabhi.', 'Instagram profiles', 'Feed', 'Simple', ['aasman', 'chehra']),
  g('Tasveerein kam, yaadein zyada.', 'Instagram profiles', 'Feed', 'Minimal', ['tasveerein', 'yaadein']),

  /* --------------------------------------------------------------- Nature */
  e('Goes outside to think. Comes back with rocks.', 'Nature', 'Outdoors', 'Playful', ['nature', 'walking']),
  e('Trees do not hurry and nothing falls behind.', 'Nature', 'Observation', 'Wise', ['trees', 'patience']),
  h('पेड़ से सीखा कि जल्दी करने से कुछ नहीं होता।', 'Nature', 'सीख', 'शांत', ['पेड़', 'सीख']),
  h('पहाड़ पर जाना हर किसी को शांत नहीं करता, मुझे करता है।', 'Nature', 'पहाड़', 'सहज', ['पहाड़', 'शांत']),
  g('Ped se seekha ki jaldi karne se kuch nahi hota.', 'Nature', 'Observation', 'Calm', ['ped', 'seekha']),
  g('Pahaad pe jaana har kisi ko shaant nahi karta, mujhe karta hai.', 'Nature', 'Mountains', 'Open', ['pahaad', 'shaant']),

  /* --------------------------------------------------------------- Poetry */
  e('Writes at midnight, deletes at dawn.', 'Poetry', 'Process', 'Honest', ['poetry', 'process']),
  e('Every poem is a sentence I could not say out loud.', 'Poetry', 'Process', 'Deep', ['poetry', 'truth']),
  h('रात में लिखता हूँ, सुबह मिटा देता हूँ।', 'Poetry', 'रचना', 'सहज', ['रात', 'रचना']),
  h('कविता वही बोलती है जो ज़ुबान नहीं बोल पाती।', 'Poetry', 'रचना', 'गंभीर', ['कविता', 'ज़ुबान']),
  g('Raat mein likhta hoon, subah mita deta hoon.', 'Poetry', 'Process', 'Honest', ['raat', 'subah']),
  g('Kavita wahi bolti hai jo zubaan nahi bol paati.', 'Poetry', 'Craft', 'Deep', ['kavita', 'zubaan']),

  /* ------------------------------------------------------ Funny and comedy */
  e('I have a plan and eight backup plans, all bad.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['funny', 'plans']),
  e('I am not lazy. I am energy-efficient.', 'Funny and comedy', 'Self-deprecating', 'Witty', ['funny', 'lazy']),
  h('मैं आलसी नहीं हूँ, ऊर्जा बचाता हूँ।', 'Funny and comedy', 'मज़ाक', 'मज़ाकिया', ['आलसी', 'ऊर्जा']),
  h('ज़िंदगी से शिकायत है, पर मज़ाक में।', 'Funny and comedy', 'मज़ाक', 'हँसमुख', ['ज़िंदगी', 'शिकायत']),
  g('Main aalsi nahi hoon, energy bachata hoon.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['aalsi', 'energy']),
  g('Zindagi se shikayat hai, par mazaak mein.', 'Funny and comedy', 'Humour', 'Warm', ['zindagi', 'shikayat']),
];
