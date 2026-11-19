/**
 * BioCraft original bios — batch 029.
 * Strict 40/30/30 proportion; leaders + mid-field.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_029 = [
  /* -------------------------------------------------------------- Attitude */
  e('I do not perform certainty. I build it.', 'Attitude', 'Confidence', 'Steady', ['attitude', 'confidence']),
  e('Drama is expensive and I am on a budget.', 'Attitude', 'Composure', 'Witty', ['attitude', 'drama']),
  e('Ask me once and believe the answer.', 'Attitude', 'Directness', 'Terse', ['attitude', 'direct']),
  e('I am not cold. I am just not warming up on demand.', 'Attitude', 'Boundaries', 'Dry', ['attitude', 'boundaries']),
  e('Silence has never once made me regret a sentence.', 'Attitude', 'Restraint', 'Wise', ['attitude', 'silence']),
  e('I am not competing. I am building at my own pace.', 'Attitude', 'Independence', 'Composed', ['attitude', 'independence']),
  h('मैं दिखावटी भरोसा नहीं करता, बनाता हूँ।', 'Attitude', 'आत्मविश्वास', 'दृढ़', ['भरोसा', 'बनाना']),
  h('नाटक महंगा है और मेरा बजट सीमित है।', 'Attitude', 'संयम', 'मज़ाकिया', ['नाटक', 'बजट']),
  h('एक बार पूछो और जवाब मान लो।', 'Attitude', 'स्पष्टता', 'संक्षिप्त', ['पूछो', 'जवाब']),
  h('चुप्पी से मुझे कभी अपनी बात पर पछतावा नहीं हुआ।', 'Attitude', 'संयम', 'गंभीर', ['चुप्पी', 'पछतावा']),
  g('Main dikhawti bharosa nahi karta, banata hoon.', 'Attitude', 'Confidence', 'Steady', ['bharosa', 'banata']),
  g('Natak mehnga hai aur mera budget seemit hai.', 'Attitude', 'Composure', 'Witty', ['natak', 'budget']),
  g('Ek baar poocho aur jawab maan lo.', 'Attitude', 'Directness', 'Terse', ['poocho', 'jawab']),

  /* ------------------------------------------------------ Love and romance */
  e('You are the person I apologise to properly.', 'Love and romance', 'Respect', 'Tender', ['love', 'respect']),
  e('I want a love that improves my handwriting and my temper.', 'Love and romance', 'Growth', 'Witty', ['love', 'growth']),
  e('We do not need to be interesting. We need to be steady.', 'Love and romance', 'Real love', 'Wise', ['love', 'steady']),
  e('You are my favourite reason to put the phone down.', 'Love and romance', 'Closeness', 'Sweet', ['love', 'presence']),
  e('I remember what you said in passing. That is how I love.', 'Love and romance', 'Attention', 'Tender', ['love', 'attention']),
  e('You make me less afraid of being ordinary.', 'Love and romance', 'Comfort', 'Warm', ['love', 'comfort']),
  h('तुम वो हो जिससे मैं ढंग से माफ़ी मांगता हूँ।', 'Love and romance', 'आदर', 'कोमल', ['माफ़ी', 'आदर']),
  h('मुझे वो प्यार चाहिए जो मेरा स्वभाव सुधार दे।', 'Love and romance', 'विकास', 'सहज', ['प्यार', 'स्वभाव']),
  h('हमें दिलचस्प नहीं, स्थिर होना है।', 'Love and romance', 'रोज़मर्रा', 'गंभीर', ['स्थिर', 'दिलचस्प']),
  h('तुम वो हो जिसके सामने फ़ोन रख देता हूँ।', 'Love and romance', 'नज़दीकी', 'कोमल', ['फ़ोन', 'सामने']),
  g('Tum woh ho jisse main dhang se maafi maangta hoon.', 'Love and romance', 'Respect', 'Tender', ['maafi', 'dhang']),
  g('Mujhe woh pyaar chahiye jo mera swabhav sudhaar de.', 'Love and romance', 'Growth', 'Warm', ['pyaar', 'swabhav']),
  g('Humein dilchasp nahi, sthir hona hai.', 'Love and romance', 'Real love', 'Wise', ['sthir', 'dilchasp']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('There is a whole year I cannot talk about without pausing.', 'Sad and heartbreak', 'Grief', 'Heavy', ['sad', 'grief']),
  e('I gave you the unedited version and you left anyway.', 'Sad and heartbreak', 'Rejection', 'Raw', ['sad', 'rejection']),
  e('Some people are a lesson delivered very slowly.', 'Sad and heartbreak', 'Growth', 'Wise', ['sad', 'growth']),
  e('I have stopped flinching at your name. That took work.', 'Sad and heartbreak', 'Recovery', 'Steady', ['sad', 'recovery']),
  h('एक पूरा साल है जिसके बारे में बोलने से पहले रुकना पड़ता है।', 'Sad and heartbreak', 'गम', 'गंभीर', ['साल', 'रुकना']),
  h('मैंने तुम्हें बिना संपादन वाला रूप दिया, फिर भी तुम गए।', 'Sad and heartbreak', 'अस्वीकार', 'भावुक', ['रूप', 'गए']),
  h('कुछ लोग धीरे-धीरे दिया गया सबक होते हैं।', 'Sad and heartbreak', 'विकास', 'गंभीर', ['सबक', 'धीरे']),
  h('तुम्हारे नाम से अब नहीं चौंकता, उसमें मेहनत लगी।', 'Sad and heartbreak', 'उबरना', 'दृढ़', ['नाम', 'मेहनत']),
  g('Ek poora saal hai jiske baare mein bolne se pehle rukna padta hai.', 'Sad and heartbreak', 'Grief', 'Heavy', ['saal', 'rukna']),
  g('Maine tumhein bina sampaadan wala roop diya, phir bhi tum gaye.', 'Sad and heartbreak', 'Rejection', 'Raw', ['roop', 'gaye']),
  g('Tumhare naam se ab nahi chaunkta, usme mehnat lagi.', 'Sad and heartbreak', 'Recovery', 'Steady', ['naam', 'mehnat']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरी आदत ने\nमेरी सबसे अच्छी आदत\nबिगाड़ दी।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['आदत', 'बिगाड़']),
  h('मैं तुझे ढूंढने निकला था,\nरास्ते में\nखुद से मिल गया।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['ढूंढना', 'खुद']),
  h('शहर बदल लिया,\nकमरा बदल लिया,\nपर तेरी याद का पता वही रहा।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शहर', 'पता']),
  h('कुछ बातें अधूरी रह जाती हैं,\nऔर वही\nसबसे ज़्यादा सुनाई देती हैं।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['बातें', 'अधूरी']),
  g('Teri aadat ne meri sabse acchi aadat bigaad di.', 'Shayari', 'Two line', 'Aching', ['aadat', 'bigaad']),
  g('Main tujhe dhoondhne nikla tha, raaste mein khud se mil gaya.', 'Shayari', 'Two line', 'Deep', ['dhoondhne', 'khud']),
  g('Shehar badal liya, kamra badal liya, par teri yaad ka pata wahi raha.', 'Shayari', 'Two line', 'Aching', ['shehar', 'pata']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('You cannot be curious and certain at the same time.', 'Quotes and thoughts', 'Curiosity', 'Wise', ['quotes', 'curiosity']),
  e('The best compliment is being taken seriously.', 'Quotes and thoughts', 'Respect', 'Warm', ['quotes', 'respect']),
  e('Speed is a feature. Correctness is a requirement.', 'Quotes and thoughts', 'Craft', 'Direct', ['quotes', 'craft']),
  e('Every rule you break should be one you understood first.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'rules']),
  e('A good day is mostly a good night\u2019s sleep in disguise.', 'Quotes and thoughts', 'Rest', 'Wry', ['quotes', 'sleep']),
  h('जिज्ञासु और पक्का एक साथ नहीं हो सकते।', 'Quotes and thoughts', 'जिज्ञासा', 'गंभीर', ['जिज्ञासा', 'पक्का']),
  h('सबसे अच्छी तारीफ़ है गंभीरता से सुना जाना।', 'Quotes and thoughts', 'सम्मान', 'कोमल', ['तारीफ़', 'सुनना']),
  h('हर नियम तोड़ने से पहले उसे समझना चाहिए।', 'Quotes and thoughts', 'काम', 'गंभीर', ['नियम', 'समझना']),
  g('Jigyasu aur pakka ek saath nahi ho sakte.', 'Quotes and thoughts', 'Curiosity', 'Wise', ['jigyasu', 'pakka']),
  g('Sabse acchi taareef hai gambhirta se suna jaana.', 'Quotes and thoughts', 'Respect', 'Warm', ['taareef', 'suna']),
  g('Har niyam todne se pehle use samajhna chahiye.', 'Quotes and thoughts', 'Craft', 'Wise', ['niyam', 'samajhna']),

  /* ------------------------------------------------------ Life and reality */
  e('You cannot build a good life on a schedule you resent.', 'Life and reality', 'Environment', 'Wise', ['life', 'schedule']),
  e('Being honest early saves everyone a difficult year.', 'Life and reality', 'Honesty', 'Practical', ['life', 'honesty']),
  e('Most people are not against you. They are just busy.', 'Life and reality', 'Perspective', 'Reassuring', ['life', 'perspective']),
  e('The version of you that rests is the one that lasts.', 'Life and reality', 'Rest', 'Warm', ['life', 'rest']),
  h('जिस दिनचर्या से चिढ़ है, उस पर अच्छी ज़िंदगी नहीं बनती।', 'Life and reality', 'माहौल', 'गंभीर', ['दिनचर्या', 'ज़िंदगी']),
  h('जल्दी ईमानदार हो जाओ, सबका एक मुश्किल साल बच जाएगा।', 'Life and reality', 'ईमानदारी', 'व्यावहारिक', ['ईमानदार', 'साल']),
  h('ज़्यादातर लोग तुम्हारे खिलाफ़ नहीं, बस व्यस्त हैं।', 'Life and reality', 'नज़रिया', 'सहज', ['लोग', 'व्यस्त']),
  g('Jis dincharya se chidh hai, us par acchi zindagi nahi banti.', 'Life and reality', 'Environment', 'Wise', ['dincharya', 'zindagi']),
  g('Jaldi imaandaar ho jao, sabka ek mushkil saal bach jayega.', 'Life and reality', 'Honesty', 'Practical', ['imaandaar', 'saal']),

  /* --------------------------------------------------- Motivational depth */
  e('Do the thing badly until the thing gets good.', 'Motivational', 'Practice', 'Direct', ['motivation', 'practice']),
  e('Your first hundred attempts are tuition, not failure.', 'Motivational', 'Practice', 'Encouraging', ['motivation', 'practice']),
  e('Pick one hard thing and keep it for a year.', 'Motivational', 'Focus', 'Wise', ['motivation', 'focus']),
  h('जब तक काम अच्छा न हो जाए, बुरी तरह करते रहो।', 'Motivational', 'अभ्यास', 'स्पष्ट', ['काम', 'अभ्यास']),
  h('पहले सौ प्रयास फ़ीस हैं, नाकामी नहीं।', 'Motivational', 'अभ्यास', 'प्रेरक', ['प्रयास', 'फ़ीस']),
  g('Jab tak kaam accha na ho jaye, buri tarah karte raho.', 'Motivational', 'Practice', 'Direct', ['kaam', 'buri']),
  g('Pehle sau prayaas fees hain, naakaami nahi.', 'Motivational', 'Practice', 'Encouraging', ['prayaas', 'fees']),

  /* ---------------------------------------- Aesthetic / poetry / minimal */
  e('Good light forgives a lot of furniture.', 'Aesthetic', 'Light', 'Wry', ['aesthetic', 'light']),
  e('I like rooms that look lived in, not staged.', 'Aesthetic', 'Interiors', 'Warm', ['aesthetic', 'home']),
  e('A poem should end a half-second after you expect it to.', 'Poetry', 'Craft', 'Wise', ['poetry', 'craft']),
  e('Own one good pen and use it until it runs out.', 'Minimal', 'Tools', 'Practical', ['minimal', 'tools']),
  h('अच्छी रोशनी बहुत सारा फ़र्नीचर माफ़ कर देती है।', 'Aesthetic', 'रोशनी', 'सहज', ['रोशनी', 'फ़र्नीचर']),
  h('मुझे वो कमरे पसंद हैं जो जिए हुए लगते हैं, सजे हुए नहीं।', 'Aesthetic', 'घर', 'कोमल', ['कमरे', 'सजे']),
  h('एक अच्छा पेन रखो और खत्म होने तक इस्तेमाल करो।', 'Minimal', 'सादगी', 'व्यावहारिक', ['पेन', 'इस्तेमाल']),
  g('Acchi roshni bahut saara furniture maaf kar deti hai.', 'Aesthetic', 'Light', 'Wry', ['roshni', 'furniture']),
  g('Mujhe woh kamre pasand hain jo jiye hue lagte hain, saje hue nahi.', 'Aesthetic', 'Interiors', 'Warm', ['kamre', 'saje']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('A good manager removes obstacles and takes the blame.', 'Professional and business', 'Leadership', 'Wise', ['business', 'leadership']),
  e('Write the one-page plan before you build the five-year one.', 'Startup and hustle', 'Method', 'Practical', ['startup', 'planning']),
  e('The best student is the one who asks the obvious question.', 'Student life', 'Campus', 'Wise', ['student', 'questions']),
  e('Fielding badly for years made me a better captain.', 'Cricket and sports', 'Cricket', 'Wry', ['cricket', 'captain']),
  e('Two litres of water and a walk fix more than you think.', 'Yoga and wellness', 'Habit', 'Practical', ['wellness', 'habit']),
  e('Sleep is the cheapest medicine and the first thing we skip.', 'Yoga and wellness', 'Rest', 'Wise', ['wellness', 'sleep']),
  e('A dog is a daily argument for going outside.', 'Pets and animals', 'Dogs', 'Warm', ['pets', 'dogs']),
  e('Fashion fades in a year. Fit never does.', 'Fashion and beauty', 'Fit', 'Wise', ['fashion', 'fit']),
  h('अच्छा मैनेजर रुकावटें हटाता है और गलती अपने नाम लेता है।', 'Professional and business', 'नेतृत्व', 'गंभीर', ['मैनेजर', 'गलती']),
  h('पाँच साल की योजना से पहले एक पन्ने की योजना लिखो।', 'Startup and hustle', 'तरीका', 'व्यावहारिक', ['योजना', 'पन्ना']),
  h('सबसे अच्छा छात्र वही जो सीधा सवाल पूछे।', 'Student life', 'छात्र', 'गंभीर', ['छात्र', 'सवाल']),
  h('पानी और टहलना उतना फ़ायदा करते हैं जितना कोई नहीं मानता।', 'Yoga and wellness', 'आदत', 'व्यावहारिक', ['पानी', 'टहलना']),
  g('Accha manager rukawatein hatata hai aur galti apne naam leta hai.', 'Professional and business', 'Leadership', 'Wise', ['manager', 'galti']),
  g('Paanch saal ki yojana se pehle ek panne ki yojana likho.', 'Startup and hustle', 'Method', 'Practical', ['yojana', 'panne']),
  g('Sabse accha student wahi jo seedha sawaal poochhe.', 'Student life', 'Campus', 'Wise', ['student', 'sawaal']),
  g('Paani aur tehalna utna fayda karte hain jitna koi nahi maanta.', 'Yoga and wellness', 'Habit', 'Practical', ['paani', 'tehalna']),
];
