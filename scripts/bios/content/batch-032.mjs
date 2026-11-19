/**
 * BioCraft original bios — batch 032.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_032 = [
  /* -------------------------------------------------------------- Attitude */
  e('I am not sorry for the space I take up.', 'Attitude', 'Self-possession', 'Firm', ['attitude', 'self']),
  e('I would rather be direct than charming and unclear.', 'Attitude', 'Directness', 'Wise', ['attitude', 'direct']),
  e('You can call me distant. I call it well-maintained.', 'Attitude', 'Boundaries', 'Witty', ['attitude', 'boundaries']),
  e('I am not in a hurry to impress anyone worth knowing.', 'Attitude', 'Confidence', 'Composed', ['attitude', 'confidence']),
  e('My patience runs out before my standards do.', 'Attitude', 'Standards', 'Sharp', ['attitude', 'standards']),
  e('No hard feelings. Just no further access.', 'Attitude', 'Boundaries', 'Dry', ['attitude', 'boundaries']),
  h('मैं अपनी जगह लेने के लिए माफ़ी नहीं मांगता।', 'Attitude', 'स्वाभिमान', 'दृढ़', ['जगह', 'माफ़ी']),
  h('मैं मिलनसार और अस्पष्ट होने से बेहतर सीधा हूँ।', 'Attitude', 'स्पष्टता', 'गंभीर', ['सीधा', 'अस्पष्ट']),
  h('मेरी शर्तें सब्र से पहले खत्म नहीं होतीं।', 'Attitude', 'मानक', 'तीखा', ['शर्तें', 'सब्र']),
  h('कोई गिला नहीं, बस आगे की इजाज़त नहीं।', 'Attitude', 'सीमाएं', 'शांत', ['गिला', 'इजाज़त']),
  g('Main apni jagah lene ke liye maafi nahi maangta.', 'Attitude', 'Self-possession', 'Firm', ['jagah', 'maafi']),
  g('Main milansaar aur aspasht hone se behtar seedha hoon.', 'Attitude', 'Directness', 'Wise', ['milansaar', 'seedha']),
  g('Meri shartein sabr se pehle khatam nahi hotin.', 'Attitude', 'Standards', 'Sharp', ['shartein', 'sabr']),

  /* ------------------------------------------------------ Love and romance */
  e('You are my favourite argument for staying in.', 'Love and romance', 'Closeness', 'Sweet', ['love', 'home']),
  e('I want a life with fewer highlights and more good days.', 'Love and romance', 'Real love', 'Wise', ['love', 'everyday']),
  e('You are the person I tell the truth to first.', 'Love and romance', 'Honesty', 'Tender', ['love', 'honesty']),
  e('We are not in a rush because we are not going anywhere.', 'Love and romance', 'Commitment', 'Warm', ['love', 'commitment']),
  e('I love you in the details nobody else notices.', 'Love and romance', 'Attention', 'Tender', ['love', 'attention']),
  e('Your quiet company is the best part of my day.', 'Love and romance', 'Closeness', 'Warm', ['love', 'quiet']),
  h('मेरे घर रुकने की सबसे अच्छी वजह तुम हो।', 'Love and romance', 'अपनापन', 'कोमल', ['घर', 'वजह']),
  h('मुझे कम रोशनी और ज़्यादा अच्छे दिन चाहिए।', 'Love and romance', 'रोज़मर्रा', 'गंभीर', ['दिन', 'रोशनी']),
  h('तुम वो हो जिसे मैं सच सबसे पहले बताता हूँ।', 'Love and romance', 'ईमानदारी', 'कोमल', ['सच', 'पहले']),
  h('हम जल्दी में नहीं हैं क्योंकि हम कहीं जा नहीं रहे।', 'Love and romance', 'निभाना', 'कोमल', ['जल्दी', 'कहीं']),
  g('Mere ghar rukne ki sabse acchi wajah tum ho.', 'Love and romance', 'Closeness', 'Sweet', ['ghar', 'wajah']),
  g('Tum woh ho jise main sach sabse pehle batata hoon.', 'Love and romance', 'Honesty', 'Tender', ['sach', 'pehle']),
  g('Hum jaldi mein nahi hain kyunki hum kahin ja nahi rahe.', 'Love and romance', 'Commitment', 'Warm', ['jaldi', 'kahin']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I still hear your laugh in rooms you have never been to.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'memory']),
  e('You are the reason I know what silence costs.', 'Sad and heartbreak', 'Loss', 'Heavy', ['sad', 'silence']),
  e('I have stopped hoping and started sleeping. That is progress.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'recovery']),
  e('Some people you love quietly and never tell.', 'Sad and heartbreak', 'Longing', 'Tender', ['sad', 'longing']),
  e('I made my peace with it. It did not make peace with me.', 'Sad and heartbreak', 'Grief', 'Wry', ['sad', 'grief']),
  h('तुम्हारी हँसी अब भी उन कमरों में सुनाई देती है जहाँ तुम कभी नहीं गए।', 'Sad and heartbreak', 'याद', 'भावुक', ['हँसी', 'कमरे']),
  h('तुम्हारी वजह से पता चला कि चुप्पी की क़ीमत क्या होती है।', 'Sad and heartbreak', 'हानि', 'गंभीर', ['चुप्पी', 'क़ीमत']),
  h('उम्मीद छोड़ी और सोना शुरू किया, यह भी तरक्की है।', 'Sad and heartbreak', 'उबरना', 'स्पष्ट', ['उम्मीद', 'तरक्की']),
  h('कुछ लोगों से चुपचाप प्यार करते हैं, कभी बताते नहीं।', 'Sad and heartbreak', 'लालसा', 'कोमल', ['प्यार', 'चुपचाप']),
  g('Tumhari hansi ab bhi un kamron mein sunai deti hai jahan tum kabhi nahi gaye.', 'Sad and heartbreak', 'Memory', 'Aching', ['hansi', 'kamron']),
  g('Tumhari wajah se pata chala ki chuppi ki keemat kya hoti hai.', 'Sad and heartbreak', 'Loss', 'Heavy', ['chuppi', 'keemat']),
  g('Umeed chhodi aur sona shuru kiya, yeh bhi taraqqi hai.', 'Sad and heartbreak', 'Recovery', 'Honest', ['umeed', 'taraqqi']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरे बिना\nसुबह होती है,\nपर सुबह जैसी नहीं लगती।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['सुबह', 'बिना']),
  h('मैंने तुझे\nकिताबों में ढूंढा,\nऔर खुद को मिल गया।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['किताबें', 'खुद']),
  h('जो प्यार\nचुपचाप रहता है,\nवही सबसे ज़्यादा बोलता है।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['प्यार', 'चुपचाप']),
  h('थक गया हूँ,\nपर हार नहीं मानी,\nयही फ़र्क़ है।', 'Shayari', 'तीन पंक्ति', 'दृढ़', ['थक', 'हार']),
  g('Tere bina subah hoti hai, par subah jaisi nahi lagti.', 'Shayari', 'Two line', 'Aching', ['subah', 'jaisi']),
  g('Maine tujhe kitaabon mein dhoondha, aur khud ko mil gaya.', 'Shayari', 'Two line', 'Deep', ['kitaabon', 'khud']),
  g('Jo pyaar chupchaap rehta hai, wahi sabse zyada bolta hai.', 'Shayari', 'Two line', 'Romantic', ['pyaar', 'chupchaap']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('You cannot be generous with your time and careless with it too.', 'Quotes and thoughts', 'Time', 'Wise', ['quotes', 'time']),
  e('A good apology names the behaviour, not the emotion.', 'Quotes and thoughts', 'Honesty', 'Practical', ['quotes', 'apology']),
  e('People show you who they are at the end of a long day.', 'Quotes and thoughts', 'People', 'Wise', ['quotes', 'people']),
  e('Slow is smooth and smooth is fast, in almost everything.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'craft']),
  e('You can be a kind person and a difficult person. Both are true.', 'Quotes and thoughts', 'Nuance', 'Wise', ['quotes', 'nuance']),
  h('समय के साथ उदार और लापरवाह एक साथ नहीं हो सकते।', 'Quotes and thoughts', 'समय', 'गंभीर', ['समय', 'उदार']),
  h('अच्छी माफ़ी भावना का नाम लेती है, व्यवहार का।', 'Quotes and thoughts', 'ईमानदारी', 'व्यावहारिक', ['माफ़ी', 'व्यवहार']),
  h('लोग लंबे दिन के अंत में अपना असली रूप दिखाते हैं।', 'Quotes and thoughts', 'लोग', 'गंभीर', ['लोग', 'दिन']),
  h('हर चीज़ में धीमा ही सही होता है।', 'Quotes and thoughts', 'काम', 'गंभीर', ['धीमा', 'सही']),
  g('Samay ke saath udaar aur laaparwah ek saath nahi ho sakte.', 'Quotes and thoughts', 'Time', 'Wise', ['samay', 'udaar']),
  g('Achhi maafi bhaavna ka naam leti hai, vyavhaar ka.', 'Quotes and thoughts', 'Honesty', 'Practical', ['maafi', 'vyavhaar']),
  g('Log lambe din ke ant mein apna asli roop dikhate hain.', 'Quotes and thoughts', 'People', 'Wise', ['log', 'asli']),

  /* ------------------------------------------------------ Life and reality */
  e('You will not find your purpose in a productivity app.', 'Life and reality', 'Reality', 'Wry', ['life', 'purpose']),
  e('The best thing you can do for your family is sleep properly.', 'Life and reality', 'Health', 'Warm', ['life', 'health']),
  e('Every hard season ends and takes something with it.', 'Life and reality', 'Seasons', 'Wise', ['life', 'seasons']),
  e('You can be lonely in a full house and busy in an empty one.', 'Life and reality', 'People', 'Honest', ['life', 'loneliness']),
  h('मक़सद किसी ऐप में नहीं मिलता।', 'Life and reality', 'हकीकत', 'सहज', ['मक़सद', 'ऐप']),
  h('परिवार के लिए सबसे अच्छा काम है ढंग से सोना।', 'Life and reality', 'सेहत', 'कोमल', ['परिवार', 'सोना']),
  h('हर मुश्किल मौसम खत्म होता है और कुछ ले जाता है।', 'Life and reality', 'समय', 'गंभीर', ['मौसम', 'खत्म']),
  g('Maqsad kisi app mein nahi milta.', 'Life and reality', 'Reality', 'Wry', ['maqsad', 'app']),
  g('Parivaar ke liye sabse accha kaam hai dhang se sona.', 'Life and reality', 'Health', 'Warm', ['parivaar', 'sona']),
  g('Har mushkil mausam khatam hota hai aur kuch le jaata hai.', 'Life and reality', 'Seasons', 'Wise', ['mausam', 'khatam']),

  /* --------------------------------------------------- Motivational depth */
  e('The work you avoid is usually the work that matters.', 'Motivational', 'Courage', 'Direct', ['motivation', 'courage']),
  e('You will not feel motivated at 6 a.m. Do it anyway.', 'Motivational', 'Discipline', 'Direct', ['motivation', 'discipline']),
  e('One honest hour beats a whole anxious day.', 'Motivational', 'Focus', 'Wise', ['motivation', 'focus']),
  h('जो काम टालते हो, अक्सर वही मायने रखता है।', 'Motivational', 'साहस', 'स्पष्ट', ['काम', 'मायने']),
  h('सुबह छह बजे प्रेरणा नहीं मिलेगी, फिर भी करो।', 'Motivational', 'अनुशासन', 'स्पष्ट', ['प्रेरणा', 'करो']),
  g('Jo kaam taalte ho, aksar wahi maayne rakhta hai.', 'Motivational', 'Courage', 'Direct', ['kaam', 'maayne']),
  g('Subah chhe baje prerna nahi milegi, phir bhi karo.', 'Motivational', 'Discipline', 'Direct', ['prerna', 'karo']),

  /* ---------------------------------------- Aesthetic / royal / creator */
  e('A good lamp is cheaper than a good renovation.', 'Aesthetic', 'Light', 'Practical', ['aesthetic', 'lamp']),
  e('Real luxury is an empty calendar.', 'Aesthetic', 'Time', 'Wise', ['aesthetic', 'time']),
  e('Bearing is what you do with your hands when you are not talking.', 'Royal and VIP', 'Bearing', 'Poised', ['royal', 'bearing']),
  e('Build the thing you wish existed. That is the whole strategy.', 'Creator and influencer', 'Process', 'Direct', ['creator', 'strategy']),
  h('अच्छा लैंप अच्छे नवीनीकरण से सस्ता है।', 'Aesthetic', 'रोशनी', 'व्यावहारिक', ['लैंप', 'सस्ता']),
  h('असली लक्ज़री खाली कैलेंडर है।', 'Aesthetic', 'समय', 'गंभीर', ['लक्ज़री', 'कैलेंडर']),
  g('Accha lamp acchhe renovation se sasta hai.', 'Aesthetic', 'Light', 'Practical', ['lamp', 'sasta']),
  g('Asli luxury khaali calendar hai.', 'Aesthetic', 'Time', 'Wise', ['luxury', 'calendar']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('A writing habit is a thinking habit with better furniture.', 'Poetry', 'Process', 'Witty', ['poetry', 'habit']),
  e('Re-read a book in a different decade and it becomes a new book.', 'Books and reading', 'Reader life', 'Wise', ['books', 'rereading']),
  e('Two dishes, made properly, is a restaurant.', 'Food and cooking', 'Cooking', 'Wry', ['food', 'cooking']),
  e('Walking is the most underrated training session.', 'Fitness', 'Everyday', 'Practical', ['fitness', 'walking']),
  e('Street photography is ninety percent patience and ten percent shoes.', 'Photography', 'Street', 'Wry', ['photography', 'patience']),
  e('I sing along badly and it is a form of gratitude.', 'Music and art', 'Listening', 'Warm', ['music', 'gratitude']),
  e('My cat has better boundaries than most people I know.', 'Pets and animals', 'Cats', 'Wry', ['pets', 'boundaries']),
  e('A film watched twice is a conversation, not a rerun.', 'Cinema and OTT', 'Film lover', 'Wise', ['cinema', 'rewatch']),
  e('The longest walks make the best conversations.', 'Nature', 'Outdoors', 'Warm', ['nature', 'walking']),
  h('लेखन की आदत सोचने की आदत है, बेहतर फ़र्नीचर के साथ।', 'Poetry', 'रचना', 'सहज', ['लेखन', 'आदत']),
  h('दो व्यंजन ढंग से बने हों तो घर रेस्टोरेंट है।', 'Food and cooking', 'रसोई', 'सहज', ['व्यंजन', 'रेस्टोरेंट']),
  h('टहलना सबसे कम आँका गया अभ्यास है।', 'Fitness', 'आदत', 'व्यावहारिक', ['टहलना', 'अभ्यास']),
  h('दो बार देखी फ़िल्म बातचीत है, दोहराव नहीं।', 'Cinema and OTT', 'सिनेमा प्रेम', 'गंभीर', ['फ़िल्म', 'बातचीत']),
  g('Lekhan ki aadat sochne ki aadat hai, behtar furniture ke saath.', 'Poetry', 'Process', 'Witty', ['lekhan', 'aadat']),
  g('Do vyanjan dhang se bane hon toh ghar restaurant hai.', 'Food and cooking', 'Cooking', 'Wry', ['vyanjan', 'restaurant']),
  g('Tehalna sabse kam aanka gaya abhyaas hai.', 'Fitness', 'Everyday', 'Practical', ['tehalna', 'abhyaas']),
  g('Do baar dekhi film baatcheet hai, dohraav nahi.', 'Cinema and OTT', 'Film lover', 'Wise', ['film', 'baatcheet']),
];
