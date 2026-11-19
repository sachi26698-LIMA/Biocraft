/**
 * BioCraft original bios — batch 038.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_038 = [
  /* ------------------------------------------------------------ Attitude */
  e('My no is complete. It does not need a paragraph.', 'Attitude', 'Boundaries', 'Firm', ['attitude', 'no']),
  e('I am not interested in being liked at my own expense.', 'Attitude', 'Self-respect', 'Sharp', ['attitude', 'respect']),
  e('Wrong about me is not the same as right about you.', 'Attitude', 'Composure', 'Wry', ['attitude', 'composure']),
  e('I keep my distance from people who enjoy chaos.', 'Attitude', 'Boundaries', 'Composed', ['attitude', 'chaos']),
  e('Low drama is a lifestyle choice I make daily.', 'Attitude', 'Peace', 'Dry', ['attitude', 'peace']),
  h('मेरा ना पूरा है, उसे पैराग्राफ़ नहीं चाहिए।', 'Attitude', 'सीमाएं', 'दृढ़', ['ना', 'पूरा']),
  h('अपने नुक़सान पर पसंद किया जाना नहीं चाहता।', 'Attitude', 'स्वाभिमान', 'तीखा', ['नुक़सान', 'पसंद']),
  h('मेरे बारे में ग़लत होना तुम्हारे बारे में सही होना नहीं है।', 'Attitude', 'संयम', 'सहज', ['ग़लत', 'सही']),
  h('जिन्हें बवाल पसंद है, उनसे दूरी रखता हूँ।', 'Attitude', 'सीमाएं', 'शांत', ['बवाल', 'दूरी']),
  g('Mera na poora hai, use paragraph nahi chahiye.', 'Attitude', 'Boundaries', 'Firm', ['na', 'paragraph']),
  g('Apne nuksaan par pasand kiya jaana nahi chahta.', 'Attitude', 'Self-respect', 'Sharp', ['nuksaan', 'pasand']),
  g('Jinhe bawal pasand hai, unse doori rakhta hoon.', 'Attitude', 'Boundaries', 'Composed', ['bawal', 'doori']),

  /* ------------------------------------------------------------- Love */
  e('I want a love that feels like Sunday and works like Monday.', 'Love and romance', 'Real love', 'Wry', ['love', 'sunday']),
  e('You are the reason my phone has fewer notifications.', 'Love and romance', 'Priority', 'Warm', ['love', 'phone']),
  e('We are not perfect. We are honest, which is rarer.', 'Love and romance', 'Honesty', 'Tender', ['love', 'honest']),
  e('Tea twice a day is a whole relationship if you do it right.', 'Love and romance', 'Rituals', 'Warm', ['love', 'tea']),
  h('मुझे ऐसा प्यार चाहिए जो रविवार लगे और सोमवार जैसा काम करे।', 'Love and romance', 'सच्चा प्यार', 'सहज', ['प्यार', 'रविवार']),
  h('तुम्हारी वजह से फ़ोन कम बजता है।', 'Love and romance', 'प्राथमिकता', 'कोमल', ['फ़ोन', 'वजह']),
  h('हम पूरे नहीं हैं, ईमानदार हैं, और वो कम मिलता है।', 'Love and romance', 'ईमानदारी', 'कोमल', ['ईमानदार', 'पूरे']),
  g('Mujhe aisa pyaar chahiye jo ravivaar lage aur somvaar jaisa kaam kare.', 'Love and romance', 'Real love', 'Wry', ['pyaar', 'ravivaar']),
  g('Tumhari wajah se phone kam bajta hai.', 'Love and romance', 'Priority', 'Warm', ['phone', 'wajah']),
  g('Hum poore nahi hain, imaandaar hain, aur woh kam milta hai.', 'Love and romance', 'Honesty', 'Tender', ['imaandaar', 'poore']),

  /* ------------------------------------------------------- Sad depth */
  e('I packed your things twice before I could let them go.', 'Sad and heartbreak', 'Letting go', 'Heavy', ['sad', 'lettinggo']),
  e('The city did not change. My reason for liking it did.', 'Sad and heartbreak', 'Places', 'Quiet', ['sad', 'place']),
  e('I still order for two and then remember.', 'Sad and heartbreak', 'Habit', 'Aching', ['sad', 'habit']),
  e('Some goodbyes arrive months before the goodbye.', 'Sad and heartbreak', 'Endings', 'Wise', ['sad', 'goodbye']),
  h('तुम्हारी चीज़ें दो बार समेटीं, तब जाकर छोड़ पाया।', 'Sad and heartbreak', 'छोड़ना', 'भारी', ['चीज़ें', 'छोड़']),
  h('शहर नहीं बदला, पसंद करने की वजह बदल गई।', 'Sad and heartbreak', 'जगह', 'शांत', ['शहर', 'वजह']),
  h('अब भी दो के लिए ऑर्डर करता हूँ, फिर याद आता है।', 'Sad and heartbreak', 'आदत', 'भावुक', ['ऑर्डर', 'याद']),
  g('Tumhari cheezein do baar sametin, tab jaakar chhod paya.', 'Sad and heartbreak', 'Letting go', 'Heavy', ['cheezein', 'chhod']),
  g('Shehar nahi badla, pasand karne ki wajah badal gayi.', 'Sad and heartbreak', 'Places', 'Quiet', ['shehar', 'wajah']),
  g('Ab bhi do ke liye order karta hoon, phir yaad aata hai.', 'Sad and heartbreak', 'Habit', 'Aching', ['order', 'yaad']),

  /* --------------------------------------------------------- Shayari */
  h('तेरी याद\nबारिश की तरह\nबिन बुलाए आती है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['याद', 'बारिश']),
  h('मैं चुप था,\nतूने सुना नहीं,\nअब सुनता कौन है।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['चुप', 'सुना']),
  h('दो कदम\nतेरी ओर,\nऔर सारा शहर पीछे।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['कदम', 'शहर']),
  g('Teri yaad baarish ki tarah bin bulaye aati hai.', 'Shayari', 'Two line', 'Aching', ['yaad', 'baarish']),
  g('Main chup tha, tune suna nahi, ab sunta kaun hai.', 'Shayari', 'Two line', 'Deep', ['chup', 'suna']),
  g('Do kadam teri ore, aur saara shehar peeche.', 'Shayari', 'Two line', 'Romantic', ['kadam', 'shehar']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A quiet person in a loud room is usually the one listening.', 'Quotes and thoughts', 'People', 'Wise', ['quotes', 'listening']),
  e('You cannot buy taste, but you can slow down and develop it.', 'Quotes and thoughts', 'Taste', 'Wise', ['quotes', 'taste']),
  e('Most anger is disappointment with better lighting.', 'Quotes and thoughts', 'Emotion', 'Sharp', ['quotes', 'anger']),
  e('The best relationships are maintained, not performed.', 'Quotes and thoughts', 'Relationships', 'Warm', ['quotes', 'relationships']),
  h('शोर भरे कमरे में चुप इंसान अक्सर सुन रहा होता है।', 'Quotes and thoughts', 'लोग', 'गंभीर', ['कमरे', 'सुन']),
  h('पसंद ख़रीदी नहीं जाती, धीमे होकर बनाई जाती है।', 'Quotes and thoughts', 'पसंद', 'गंभीर', ['पसंद', 'धीमे']),
  h('ग़ुस्सा अक्सर निराशा ही है, बेहतर रोशनी में।', 'Quotes and thoughts', 'भावना', 'तीखा', ['ग़ुस्सा', 'निराशा']),
  g('Shor bhare kamre mein chup insaan aksar sun raha hota hai.', 'Quotes and thoughts', 'People', 'Wise', ['kamre', 'sun']),
  g('Pasand kharidi nahi jaati, dheeme hokar banai jaati hai.', 'Quotes and thoughts', 'Taste', 'Wise', ['pasand', 'dheeme']),
  g('Gussa aksar niraasha hi hai, behtar roshni mein.', 'Quotes and thoughts', 'Emotion', 'Sharp', ['gussa', 'niraasha']),

  /* ------------------------------------------------- Life and reality */
  e('You will never feel ready, and the calendar will not wait.', 'Life and reality', 'Reality', 'Direct', ['life', 'readiness']),
  e('A house becomes a home after somebody spills something in it.', 'Life and reality', 'Home', 'Warm', ['life', 'home']),
  e('Not every silence needs to be filled by you.', 'Life and reality', 'Boundaries', 'Wise', ['life', 'silence']),
  e('People remember how you made them feel at a wedding.', 'Life and reality', 'People', 'Wry', ['life', 'wedding']),
  h('कभी तैयार महसूस नहीं होगा, और कैलेंडर रुकेगा नहीं।', 'Life and reality', 'हकीकत', 'स्पष्ट', ['कैलेंडर', 'तैयार']),
  h('कुछ गिर जाने के बाद ही घर, घर लगता है।', 'Life and reality', 'घर', 'कोमल', ['घर', 'गिर']),
  h('हर खामोशी तुम्हें नहीं भरनी है।', 'Life and reality', 'सीमाएं', 'गंभीर', ['खामोशी', 'भरनी']),
  g('Kabhi taiyaar mehsoos nahi hoga, aur calendar rukega nahi.', 'Life and reality', 'Reality', 'Direct', ['calendar', 'taiyaar']),
  g('Kuch gir jaane ke baad hi ghar, ghar lagta hai.', 'Life and reality', 'Home', 'Warm', ['ghar', 'gir']),
  g('Har khaamoshi tumhein nahi bharni hai.', 'Life and reality', 'Boundaries', 'Wise', ['khaamoshi', 'bharni']),

  /* ------------------------------------------------------ Motivational */
  e('Fall in love with being a beginner for a while.', 'Motivational', 'Learning', 'Warm', ['motivation', 'beginner']),
  e('Discipline is remembering what you said you wanted.', 'Motivational', 'Discipline', 'Direct', ['motivation', 'discipline']),
  e('Small work done today protects big dreams later.', 'Motivational', 'Patience', 'Wise', ['motivation', 'patience']),
  h('कुछ समय के लिए शुरुआती होने से प्यार करो।', 'Motivational', 'सीखना', 'कोमल', ['समय', 'शुरुआती']),
  h('अनुशासन याद रखना है कि तुमने क्या चाहा था।', 'Motivational', 'अनुशासन', 'स्पष्ट', ['अनुशासन', 'चाहा']),
  g('Kuch waqt ke liye shuruaati hone se pyaar karo.', 'Motivational', 'Learning', 'Warm', ['waqt', 'pyaar']),
  g('Anushasan yaad rakhna hai ki tumne kya chaaha tha.', 'Motivational', 'Discipline', 'Direct', ['anushasan', 'chaaha']),

  /* -------------------------------------------------------- Aesthetic */
  e('Paint a room the colour of the light you want.', 'Aesthetic', 'Colour', 'Warm', ['aesthetic', 'colour']),
  e('Buy one thing you will still like in ten years.', 'Aesthetic', 'Objects', 'Practical', ['aesthetic', 'objects']),
  e('Tidy the doorway and the whole house feels considered.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'doorway']),
  h('कमरे को उस रोशनी का रंग दो जिसके साथ रहना चाहते हो।', 'Aesthetic', 'रंग', 'कोमल', ['कमरे', 'रंग']),
  h('एक चीज़ ऐसी ख़रीदो जो दस साल बाद भी पसंद रहे।', 'Aesthetic', 'चीज़ें', 'व्यावहारिक', ['चीज़', 'दस']),
  g('Kamre ko us roshni ka rang do jiske saath rehna chahte ho.', 'Aesthetic', 'Colour', 'Warm', ['roshni', 'rang']),
  g('Ek cheez aisi kharido jo das saal baad bhi pasand rahe.', 'Aesthetic', 'Objects', 'Practical', ['cheez', 'pasand']),

  /* ----------------------------------------------- Royal and creator */
  e('Speak softly and remember names.', 'Royal and VIP', 'Presence', 'Poised', ['royal', 'names']),
  e('Order is a courtesy. Chaos is a cost passed to everyone else.', 'Royal and VIP', 'Conduct', 'Poised', ['royal', 'order']),
  e('Never sell a promise you have not built once.', 'Creator and influencer', 'Integrity', 'Firm', ['creator', 'promise']),
  e('Your niche is the problem you cannot stop thinking about.', 'Creator and influencer', 'Positioning', 'Wise', ['creator', 'niche']),
  h('धीमे बोलो और नाम याद रखो।', 'Royal and VIP', 'मौजूदगी', 'शांत', ['धीमे', 'नाम']),
  h('व्यवस्था अदब है, अव्यवस्था की क़ीमत सब भरते हैं।', 'Royal and VIP', 'आचरण', 'शांत', ['व्यवस्था', 'क़ीमत']),
  g('Dheeme bolo aur naam yaad rakho.', 'Royal and VIP', 'Presence', 'Poised', ['dheeme', 'naam']),
  g('Vyavastha adab hai, avyavastha ki keemat sab bharte hain.', 'Royal and VIP', 'Conduct', 'Poised', ['vyavastha', 'keemat']),
  g('Jise tum khud kabhi bana nahi sake, uska waada mat becho.', 'Creator and influencer', 'Integrity', 'Firm', ['waada', 'becho']),

  /* --------------------------------------------------- Mid-field top-up */
  e('The third draft is where the poem finally speaks.', 'Poetry', 'Revision', 'Wise', ['poetry', 'revision']),
  e('Read a little above your level and slowly.', 'Books and reading', 'Craft', 'Practical', ['books', 'reading']),
  e('A meal made for someone else tastes better.', 'Food and cooking', 'Sharing', 'Warm', ['food', 'sharing']),
  e('Walk after meals and your afternoon improves.', 'Fitness', 'Habit', 'Practical', ['fitness', 'walk']),
  e('Shoot the ordinary street before the famous square.', 'Photography', 'Practice', 'Practical', ['photography', 'practice']),
  e('Sing in the kitchen and the chore becomes a song.', 'Music and art', 'Home', 'Warm', ['music', 'kitchen']),
  e('A garden is patience with visible results.', 'Nature', 'Gardens', 'Wise', ['nature', 'garden']),
  e('The interval is where the best conversations happen.', 'Cinema and OTT', 'Watching', 'Wry', ['cinema', 'interval']),
  e('Monsoon teaches you that plans are a suggestion.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['monsoon', 'plans']),
  e('One overnight train will teach you more than ten videos.', 'Travel and adventure', 'Trains', 'Wise', ['travel', 'trains']),
  h('तीसरे ड्राफ़्ट में कविता बोलती है।', 'Poetry', 'संशोधन', 'गंभीर', ['ड्राफ़्ट', 'कविता']),
  h('किसी और के लिए बना खाना ज़्यादा स्वाद देता है।', 'Food and cooking', 'बाँटना', 'कोमल', ['खाना', 'स्वाद']),
  h('रसोई में गाओ, काम गाना बन जाएगा।', 'Music and art', 'घर', 'कोमल', ['रसोई', 'गाना']),
  h('मानसून सिखाता है कि योजना सिर्फ़ सुझाव है।', 'Monsoon and seasons', 'मानसून', 'सहज', ['मानसून', 'योजना']),
  g('Teesre draft mein kavita bolti hai.', 'Poetry', 'Revision', 'Wise', ['draft', 'kavita']),
  g('Kisi aur ke liye bana khaana zyada swaad deta hai.', 'Food and cooking', 'Sharing', 'Warm', ['khaana', 'swaad']),
  g('Rasoi mein gao, kaam gaana ban jayega.', 'Music and art', 'Home', 'Warm', ['rasoi', 'gaana']),
  g('Mausam sikhaata hai ki yojana sirf sujhaav hai.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['mausam', 'yojana']),
];
