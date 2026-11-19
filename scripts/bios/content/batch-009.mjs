/**
 * BioCraft original bios — batch 009.
 * Lifting the whole 9-14 band rather than chasing a single category.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_009 = [
  /* -------------------------------------------------- Food and cooking */
  e('Cooks for six, lives with two, blames the pot.', 'Food and cooking', 'Home kitchen', 'Funny', ['cooking', 'portions']),
  e('Every family recipe is a negotiation, not a document.', 'Food and cooking', 'Recipes', 'Wise', ['recipes', 'family']),
  h('हर घर के नुस्खे में एक लड़ाई छिपी होती है।', 'Food and cooking', 'नुस्खे', 'सहज', ['नुस्खे', 'घर']),
  g('Har ghar ke nuskhe mein ek ladai chhipi hoti hai.', 'Food and cooking', 'Recipes', 'Wise', ['nuskhe', 'ghar']),
  g('Chhe logon ka khana banata hoon, do ke saath rehta hoon.', 'Food and cooking', 'Home kitchen', 'Funny', ['khana', 'logon']),

  /* ---------------------------------------------- Technology and coding */
  e('Naming things badly since 2016.', 'Technology and coding', 'Developer', 'Dry', ['dev', 'humour']),
  e('Reads the error message. All of it.', 'Technology and coding', 'Developer', 'Terse', ['dev', 'debugging']),
  h('एरर मैसेज पूरा पढ़ता हूँ, हर बार।', 'Technology and coding', 'डेवलपर', 'स्पष्ट', ['एरर', 'कोड']),
  g('Error message poora padhta hoon, har baar. Kaam bachta hai.', 'Technology and coding', 'Developer', 'Direct', ['error', 'kaam']),

  /* ------------------------------------------------- Fashion and beauty */
  e('One good jacket, worn until it becomes a personality.', 'Fashion and beauty', 'Style rules', 'Wry', ['fashion', 'jacket']),
  e('Skincare is patience with better packaging.', 'Fashion and beauty', 'Routine', 'Wise', ['skincare', 'patience']),
  h('एक अच्छा कोट, बार-बार पहनो, अपना बन जाता है।', 'Fashion and beauty', 'सलीका', 'सहज', ['कोट', 'सलीका']),
  g('Ek accha coat, baar baar pehno, apna ban jaata hai.', 'Fashion and beauty', 'Style rules', 'Wry', ['coat', 'pehno']),

  /* -------------------------------------------------- Yoga and wellness */
  e('Breathing properly is unfairly underrated.', 'Yoga and wellness', 'Practice', 'Calm', ['breath', 'yoga']),
  e('Ten minutes daily beats two hours never.', 'Yoga and wellness', 'Habit', 'Direct', ['habit', 'yoga']),
  h('सांस ठीक लेना सबसे सस्ता इलाज़ है।', 'Yoga and wellness', 'अभ्यास', 'शांत', ['सांस', 'इलाज़']),
  g('Saans theek lena sabse sasta ilaaj hai.', 'Yoga and wellness', 'Practice', 'Calm', ['saans', 'ilaaj']),

  /* -------------------------------------------------- Pets and animals */
  e('The dog decides the schedule. I just drive.', 'Pets and animals', 'Dogs', 'Funny', ['dog', 'routine']),
  e('Talks to street cats. They answer.', 'Pets and animals', 'Cats', 'Playful', ['cats', 'street']),
  h('कुत्ता समय तय करता है, मैं सिर्फ़ गाड़ी चलाता हूँ।', 'Pets and animals', 'कुत्ते', 'मज़ाकिया', ['कुत्ता', 'समय']),
  g('Kutta samay tay karta hai, main sirf gaadi chalata hoon.', 'Pets and animals', 'Dogs', 'Funny', ['kutta', 'samay']),

  /* ------------------------------------------------ Startup and hustle */
  e('Pre-revenue, post-excuses.', 'Startup and hustle', 'Builder', 'Dry', ['startup', 'honest']),
  e('Talked to twelve customers before writing a line.', 'Startup and hustle', 'Method', 'Grounded', ['startup', 'customers']),
  h('लाइन लिखने से पहले बारह ग्राहकों से बात की।', 'Startup and hustle', 'तरीका', 'गंभीर', ['ग्राहक', 'बात']),
  g('Line likhne se pehle barah grahakon se baat ki.', 'Startup and hustle', 'Method', 'Grounded', ['grahak', 'baat']),

  /* --------------------------------------------- Science and curiosity */
  e('Reads the appendix of the appendix.', 'Science and curiosity', 'Curiosity', 'Wry', ['science', 'reading']),
  e('Every good answer is a smaller question in disguise.', 'Science and curiosity', 'Method', 'Wise', ['science', 'questions']),
  h('हर अच्छा जवाब अंदर से एक छोटा सवाल होता है।', 'Science and curiosity', 'तरीका', 'गंभीर', ['जवाब', 'सवाल']),
  g('Har accha jawab andar se ek chhota sawaal hota hai.', 'Science and curiosity', 'Method', 'Wise', ['jawab', 'sawaal']),

  /* ------------------------------------------------- Cinema and OTT */
  e('Watches the making-of before the film.', 'Cinema and OTT', 'Film lover', 'Wry', ['cinema', 'craft']),
  e('Subtitles on. Always. Even in my language.', 'Cinema and OTT', 'Film lover', 'Direct', ['cinema', 'subtitles']),
  h('फ़िल्म से पहले उसकी बनने की कहानी देखता हूँ।', 'Cinema and OTT', 'सिनेमा प्रेम', 'सहज', ['फ़िल्म', 'कहानी']),
  g('Film se pehle uski banne ki kahani dekhta hoon.', 'Cinema and OTT', 'Film lover', 'Wry', ['film', 'kahani']),

  /* --------------------------------------------- Cricket and sports */
  e('Last picked, first to field.', 'Cricket and sports', 'Cricket', 'Wry', ['cricket', 'team']),
  e('Will discuss the 2011 final with anyone, anywhere.', 'Cricket and sports', 'Cricket', 'Warm', ['cricket', 'nostalgia']),
  h('आखिर में चुना जाता था, पहले फ़ील्डिंग के लिए तैयार।', 'Cricket and sports', 'क्रिकेट', 'मज़ाकिया', ['क्रिकेट', 'फ़ील्डिंग']),
  g('Aakhir mein chuna jaata tha, pehle fielding ke liye taiyaar.', 'Cricket and sports', 'Cricket', 'Funny', ['khel', 'fielding']),

  /* -------------------------------------------------- Cars and bikes */
  e('Services the bike on time. Skips the dentist.', 'Cars and bikes', 'Riding', 'Funny', ['bike', 'service']),
  e('Knows every pothole on the morning route by name.', 'Cars and bikes', 'Roads', 'Wry', ['roads', 'commute']),
  h('बाइक का सर्विसिंग टाइम पर, दाँत का नहीं।', 'Cars and bikes', 'सफ़र', 'मज़ाकिया', ['बाइक', 'सर्विसिंग']),
  g('Bike ki servicing time par, daant ki nahi.', 'Cars and bikes', 'Riding', 'Funny', ['bike', 'servicing']),

  /* ------------------------------------------------ Home and interiors */
  e('Three plants, all surviving. This is progress.', 'Home and interiors', 'Plants', 'Wry', ['home', 'plants']),
  e('Owns more mugs than cups of tea in a day.', 'Home and interiors', 'Home', 'Funny', ['home', 'mugs']),
  h('तीन पौधे ज़िंदा हैं, यही उपलब्धि है।', 'Home and interiors', 'पौधे', 'मज़ाकिया', ['पौधे', 'घर']),
  g('Teen paudhe zinda hain, yahi uplabdhi hai.', 'Home and interiors', 'Plants', 'Funny', ['paudhe', 'zinda']),

  /* ------------------------------------------------------- Parenting */
  e('Sleep is now a rumour.', 'Parenting', 'Parent life', 'Dry', ['parenting', 'sleep']),
  e('Learning to say no to a person who negotiates for a living.', 'Parenting', 'Parent life', 'Wry', ['parenting', 'toddler']),
  h('नींद अब अफ़वाह बन गई है।', 'Parenting', 'माता-पिता', 'मज़ाकिया', ['नींद', 'अफ़वाह']),
  g('Neend ab afwaah ban gayi hai, yaar.', 'Parenting', 'Parent life', 'Funny', ['neend', 'afwaah']),

  /* ------------------------------------------------ Deep and emotional */
  e('I still take the long route past your street.', 'Deep and emotional', 'Longing', 'Aching', ['longing', 'streets']),
  e('Grief has no schedule and no manners.', 'Deep and emotional', 'Grief', 'Heavy', ['grief', 'honest']),
  h('आज भी तुम्हारी गली से होकर लंबा रास्ता लेता हूँ।', 'Deep and emotional', 'लालसा', 'भावुक', ['गली', 'रास्ता']),
  g('Aaj bhi tumhari gali se hokar lamba raasta leta hoon.', 'Deep and emotional', 'Longing', 'Aching', ['gali', 'raasta']),

  /* ---------------------------------------------------- Savage and bold */
  e('Silence is a full sentence. Learn to read it.', 'Savage and bold', 'Savage', 'Sharp', ['savage', 'silence']),
  e('I am not difficult. I am specific.', 'Savage and bold', 'Boundaries', 'Firm', ['savage', 'specific']),
  h('चुप्पी भी पूरा जवाब होती है, पढ़ना सीखो।', 'Savage and bold', 'स्पष्टता', 'तीखा', ['चुप्पी', 'जवाब']),
  g('Chuppi bhi poora jawab hoti hai, padhna seekho.', 'Savage and bold', 'Savage', 'Sharp', ['chuppi', 'jawab']),

  /* ------------------------------------------------ Instagram profiles */
  e('Curation over confession.', 'Instagram profiles', 'Feed', 'Terse', ['instagram', 'curation']),
  e('Posts the sunrise. Skips the alarm.', 'Instagram profiles', 'Feed', 'Playful', ['instagram', 'morning']),
  h('तस्वीरें चुनकर डालता हूँ, सब कुछ नहीं।', 'Instagram profiles', 'प्रोफ़ाइल', 'संक्षिप्त', ['तस्वीरें', 'प्रोफ़ाइल']),
  g('Tasveerein chunkar daalta hoon, sab kuch nahi.', 'Instagram profiles', 'Feed', 'Minimal', ['tasveerein', 'daalta']),

  /* ------------------------------------------------------------ Nature */
  e('Collects leaves, discards opinions.', 'Nature', 'Outdoors', 'Playful', ['nature', 'walks']),
  e('The ocean does not need my commentary.', 'Nature', 'Observation', 'Wise', ['nature', 'ocean']),
  h('समुद्र को मेरी राय की ज़रूरत नहीं।', 'Nature', 'सीख', 'शांत', ['समुद्र', 'राय']),
  g('Samundar ko meri raay ki zaroorat nahi hai.', 'Nature', 'Observation', 'Wise', ['samundar', 'raay']),

  /* ------------------------------------------------------------ Poetry */
  e('Keeps the bad drafts. They are the honest ones.', 'Poetry', 'Process', 'Honest', ['poetry', 'drafts']),
  e('Writes short because long is a hiding place.', 'Poetry', 'Craft', 'Wise', ['poetry', 'craft']),
  h('खराब ड्राफ़्ट रखता हूँ, वही सच्चे होते हैं।', 'Poetry', 'रचना', 'गंभीर', ['ड्राफ़्ट', 'सच']),
  g('Kharab draft rakhta hoon, wahi sachche hote hain.', 'Poetry', 'Process', 'Honest', ['draft', 'sachche']),

  /* -------------------------------------------------- Funny and comedy */
  e('Quietly competitive about irrelevant things.', 'Funny and comedy', 'Self-deprecating', 'Wry', ['funny', 'competitive']),
  e('I peak at 11 p.m. and it is a problem.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['funny', 'nights']),
  h('जो बात मायने नहीं रखती, उसमें मैं सबसे आगे हूँ।', 'Funny and comedy', 'मज़ाक', 'मज़ाकिया', ['बात', 'मज़ाक']),
  g('Jo baat maayne nahi rakhti, usme main sabse aage hoon.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['baat', 'maayne']),

  /* ------------------------------------ Attitude / love / sad deepeners */
  e('Charming until someone wastes my time.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'time']),
  e('I keep my circle small and my calendar honest.', 'Attitude', 'Standards', 'Direct', ['attitude', 'honesty']),
  e('Love me loudly or leave quietly.', 'Love and romance', 'Devotion', 'Bold', ['love', 'honesty']),
  e('We are not perfect. We are consistent.', 'Love and romance', 'Real love', 'Warm', ['love', 'consistency']),
  e('Some nights I miss you. Some nights I miss who I was.', 'Sad and heartbreak', 'Grief', 'Aching', ['sad', 'identity']),
  e('I got good at goodbyes and I hate that.', 'Sad and heartbreak', 'Loss', 'Honest', ['sad', 'loss']),
  h('समय बर्बाद करने वालों को मैं पसंद नहीं आता।', 'Attitude', 'सीमाएं', 'तीखा', ['समय', 'सीमा']),
  h('मेरा दायरा छोटा है, पर साफ़ है।', 'Attitude', 'मानक', 'स्पष्ट', ['दायरा', 'साफ़']),
  h('कुछ रातें तुम्हारी कमी, कुछ अपनी याद में जाती हैं।', 'Sad and heartbreak', 'याद', 'भावुक', ['रात', 'याद']),
  h('प्यार शोर में नहीं, निभाने में दिखता है।', 'Love and romance', 'निभाना', 'गंभीर', ['प्यार', 'निभाना']),
  g('Samay barbaad karne walon ko main pasand nahi aata.', 'Attitude', 'Boundaries', 'Sharp', ['samay', 'barbaad']),
  g('Mera daayra chhota hai, par saaf hai.', 'Attitude', 'Standards', 'Direct', ['daayra', 'saaf']),
  g('Kuch raatein tumhari kami mein jaati hain, kuch apni yaad mein.', 'Sad and heartbreak', 'Grief', 'Aching', ['raatein', 'yaad']),
  g('Pyaar shor mein nahi, nibhane mein dikhta hai.', 'Love and romance', 'Devotion', 'Warm', ['pyaar', 'nibhane']),

  /* ------------------------------------------------- Shayari deepening */
  h('मैंने तुझसे कुछ माँगा नहीं,\nबस तेरे होने की आदत थी,\nवो भी चली गई।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['आदत', 'माँगा']),
  h('शाम ढली, चाय बनी,\nऔर बिना कहे वो बात छिड़ गई\nजो सालों से दबी थी।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['शाम', 'बात']),
  g('Maine tujhse kuch maanga nahi, bas teri aadat thi.', 'Shayari', 'Two line', 'Aching', ['maanga', 'aadat']),
  g('Shaam dhali, chai bani, aur bina kahe woh baat chhid gayi.', 'Shayari', 'Two line', 'Deep', ['shaam', 'baat']),
  g('Tere bina bhi subah hoti hai, bas usme maza nahi aata.', 'Shayari', 'Two line', 'Aching', ['subah', 'maza']),

  /* ------------------------------------------------- Quotes deepening */
  e('A reputation takes years. A rumour takes a minute.', 'Quotes and thoughts', 'Reputation', 'Sharp', ['reputation', 'rumour']),
  e('Advice is autobiography wearing a uniform.', 'Quotes and thoughts', 'People', 'Wise', ['advice', 'people']),
  e('Most confidence is just evidence.', 'Quotes and thoughts', 'Confidence', 'Terse', ['confidence', 'evidence']),
  h('साख सालों में बनती है, अफ़वाह मिनटों में।', 'Quotes and thoughts', 'साख', 'गंभीर', ['साख', 'अफ़वाह']),
  h('सलाह दरअसल अपनी ही कहानी होती है।', 'Quotes and thoughts', 'लोग', 'गंभीर', ['सलाह', 'कहानी']),
  g('Saakh saalon mein banti hai, afwaah minute mein.', 'Quotes and thoughts', 'Reputation', 'Sharp', ['saakh', 'afwaah']),
  g('Salaah darasal apni hi kahani hoti hai.', 'Quotes and thoughts', 'People', 'Wise', ['salaah', 'kahani']),

  /* -------------------------------------------------- Aesthetic deepening */
  e('Prefers paper to pixels, politely.', 'Aesthetic', 'Texture', 'Wry', ['aesthetic', 'paper']),
  e('Muted colours and loud music.', 'Aesthetic', 'Palette', 'Cool', ['aesthetic', 'music']),
  h('कागज़ कागज़ ही रहता है।', 'Aesthetic', 'बनावट', 'संक्षिप्त', ['कागज़', 'बनावट']),
  g('Kaagaz kaagaz hi rehta hai, screen chaahe kuch bhi ho.', 'Aesthetic', 'Texture', 'Wry', ['kaagaz', 'screen']),

  /* ----------------------------------------------------- Life deepening */
  e('Momentum is easier to keep than to find.', 'Life and reality', 'Momentum', 'Wise', ['momentum', 'life']),
  e('Say the thing. The silence is more expensive.', 'Life and reality', 'Honesty', 'Direct', ['honesty', 'life']),
  h('गति मिल जाए तो निभाना आसान है, ढूंढना मुश्किल।', 'Life and reality', 'गति', 'गंभीर', ['गति', 'मुश्किल']),
  g('Gati mil jaaye toh nibhana aasaan hai, dhoondhna mushkil.', 'Life and reality', 'Momentum', 'Wise', ['gati', 'mushkil']),
];
