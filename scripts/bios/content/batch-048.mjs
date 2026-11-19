/**
 * BioCraft original bios — batch 048.
 * Allocation from scripts/bios/balance.mjs: 34 EN / 38 HI / 38 HG.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_048 = [
  /* ------------------------------------------------------------ Attitude */
  e('I do not chase explanations from people who enjoy confusing me.', 'Attitude', 'Boundaries', 'Composed', ['attitude', 'boundaries']),
  e('I am allowed to change my mind without a committee.', 'Attitude', 'Independence', 'Firm', ['attitude', 'independence']),
  e('I would rather be a person of few words than of many excuses.', 'Attitude', 'Integrity', 'Sharp', ['attitude', 'integrity']),
  h('जो मुझे उलझाने में मज़ा लेते हैं, उनसे सफ़ाई नहीं माँगता।', 'Attitude', 'सीमाएं', 'शांत', ['सफ़ाई', 'मज़ा']),
  h('अपनी राय बदलने के लिए किसी कमेटी की इजाज़त नहीं चाहिए।', 'Attitude', 'आत्मनिर्भरता', 'दृढ़', ['राय', 'कमेटी']),
  h('कम शब्द और कम बहाने, यही मेरा तरीक़ा है।', 'Attitude', 'ईमानदारी', 'तीखा', ['शब्द', 'बहाने']),
  g('Jo mujhe uljhaane mein maza lete hain, unse safai nahi maangta.', 'Attitude', 'Boundaries', 'Composed', ['safai', 'maza']),
  g('Apni raay badalne ke liye kisi committee ki ijazat nahi chahiye.', 'Attitude', 'Independence', 'Firm', ['raay', 'committee']),
  g('Kam shabd aur kam bahaane, yahi mera tareeqa hai.', 'Attitude', 'Integrity', 'Sharp', ['shabd', 'bahaane']),

  /* ------------------------------------------------------------- Love */
  e('You are the person I want to grow slower with.', 'Love and romance', 'Commitment', 'Tender', ['love', 'grow']),
  e('I love that we can be unimpressive together.', 'Love and romance', 'Comfort', 'Warm', ['love', 'comfort']),
  e('Your patience with me is the kindest thing I own.', 'Love and romance', 'Gratitude', 'Tender', ['love', 'patience']),
  h('तुम वो हो जिसके साथ मैं धीरे-धीरे बढ़ना चाहता हूँ।', 'Love and romance', 'निभाना', 'कोमल', ['धीरे', 'बढ़ना']),
  h('अच्छा लगता है कि हम साथ में बेरौनक़ हो सकते हैं।', 'Love and romance', 'आराम', 'कोमल', ['साथ', 'बेरौनक़']),
  h('तुम्हारा सब्र मेरी सबसे क़ीमती चीज़ है।', 'Love and romance', 'कृतज्ञता', 'कोमल', ['सब्र', 'क़ीमती']),
  h('मुझे तुम्हारी आदत नहीं, तुम्हारी मौजूदगी चाहिए।', 'Love and romance', 'प्राथमिकता', 'कोमल', ['मौजूदगी', 'आदत']),
  g('Tum woh ho jiske saath main dheere-dheere badhna chahta hoon.', 'Love and romance', 'Commitment', 'Tender', ['dheere', 'badhna']),
  g('Achha lagta hai ki hum saath mein beraunaq ho sakte hain.', 'Love and romance', 'Comfort', 'Warm', ['saath', 'beraunaq']),
  g('Tumhara sabr meri sabse keemti cheez hai.', 'Love and romance', 'Gratitude', 'Tender', ['sabr', 'keemti']),

  /* ------------------------------------------------------- Sad depth */
  e('I have a drawer that I maintain but never open.', 'Sad and heartbreak', 'Memory', 'Quiet', ['sad', 'drawer']),
  e('The silence is not empty. It is full of things I did not say.', 'Sad and heartbreak', 'Regret', 'Heavy', ['sad', 'regret']),
  e('I am fine on most days, and that is enough for now.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'fine']),
  h('मेरे पास एक दराज़ है जो सँभालता हूँ, खोलता नहीं।', 'Sad and heartbreak', 'याद', 'शांत', ['दराज़', 'सँभालता']),
  h('खामोशी खाली नहीं है, उसमें वो सब है जो मैंने नहीं कहा।', 'Sad and heartbreak', 'पछतावा', 'भारी', ['खामोशी', 'कहा']),
  h('ज़्यादातर दिन ठीक हूँ, और अभी उतना काफ़ी है।', 'Sad and heartbreak', 'उबरना', 'स्पष्ट', ['दिन', 'काफ़ी']),
  g('Mere paas ek daraz hai jo sambhalta hoon, kholta nahi.', 'Sad and heartbreak', 'Memory', 'Quiet', ['daraz', 'sambhalta']),
  g('Khaamoshi khaali nahi hai, usmein woh sab hai jo maine nahi kaha.', 'Sad and heartbreak', 'Regret', 'Heavy', ['khaamoshi', 'kaha']),
  g('Zyadatar din theek hoon, aur abhi utna kaafi hai.', 'Sad and heartbreak', 'Recovery', 'Honest', ['din', 'kaafi']),

  /* --------------------------------------------------------- Shayari */
  h('तेरे हाथों की\nचाय में\nमेरा पूरा दिन था।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['चाय', 'दिन']),
  h('मैं चुप रहा,\nक्योंकि सच\nज़्यादा मँहगा था।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['सच', 'चुप']),
  g('Tere haathon ki chai mein mera poora din tha.', 'Shayari', 'Two line', 'Romantic', ['chai', 'din']),
  g('Main chup raha, kyunki sach zyada mehnga tha.', 'Shayari', 'Two line', 'Deep', ['sach', 'chup']),

  /* -------------------------------------------------- Quotes and ideas */
  e('Announcements are not achievements, whatever the bio says.', 'Quotes and thoughts', 'Action', 'Sharp', ['quotes', 'announcement']),
  e('Respect is what you give before you know if they deserve it.', 'Quotes and thoughts', 'Conduct', 'Wise', ['quotes', 'respect']),
  e('Being right is not a substitute for being kind.', 'Quotes and thoughts', 'Conduct', 'Warm', ['quotes', 'kindness']),
  h('जो करने जा रहे हो, उस पर नाम कभी नहीं बनता।', 'Quotes and thoughts', 'कर्म', 'तीखा', ['नाम', 'करने']),
  h('इज़्ज़त पहले दो, हक़दारी बाद में देखो।', 'Quotes and thoughts', 'आचरण', 'गंभीर', ['इज़्ज़त', 'हक़दारी']),
  h('सही होना दयालु होने का बदल नहीं है।', 'Quotes and thoughts', 'आचरण', 'कोमल', ['सही', 'दयालु']),
  g('Jo karne ja rahe ho, us par naam kabhi nahi banta.', 'Quotes and thoughts', 'Action', 'Sharp', ['naam', 'karne']),
  g('Izzat pehle do, haqdaari baad mein dekho.', 'Quotes and thoughts', 'Conduct', 'Wise', ['izzat', 'haqdaari']),
  g('Sahi hona dayalu hone ka badal nahi hai.', 'Quotes and thoughts', 'Conduct', 'Warm', ['sahi', 'dayalu']),

  /* ------------------------------------------------- Life and reality */
  e('You will not fix your sleep with a better to-do app.', 'Life and reality', 'Health', 'Sharp', ['life', 'sleep']),
  e('Take the day off before your body takes it for you.', 'Life and reality', 'Health', 'Practical', ['life', 'rest']),
  e('Some of your best years will look boring on Instagram.', 'Life and reality', 'Reality', 'Wise', ['life', 'quiet']),
  e('Ask people how they are and wait for the second answer.', 'Life and reality', 'People', 'Warm', ['life', 'listening']),
  h('अच्छे ऐप से नींद ठीक नहीं होती।', 'Life and reality', 'सेहत', 'तीखा', ['ऐप', 'नींद']),
  h('शरीर छुट्टी लेने से पहले तुम छुट्टी ले लो।', 'Life and reality', 'सेहत', 'व्यावहारिक', ['शरीर', 'छुट्टी']),
  h('तुम्हारे कुछ सबसे अच्छे साल इंस्टाग्राम पर उबाऊ दिखेंगे।', 'Life and reality', 'हकीकत', 'गंभीर', ['साल', 'उबाऊ']),
  h('लोगों से पूछो कैसे हैं, और दूसरा जवाब सुनो।', 'Life and reality', 'सुनना', 'कोमल', ['जवाब', 'सुनो']),
  g('Achhe app se neend theek nahi hoti.', 'Life and reality', 'Health', 'Sharp', ['app', 'neend']),
  g('Shareer chhutti lene se pehle tum chhutti le lo.', 'Life and reality', 'Health', 'Practical', ['shareer', 'chhutti']),
  g('Tumhare kuch sabse achhe saal Instagram par ubaau dikhenge.', 'Life and reality', 'Reality', 'Wise', ['saal', 'ubaau']),
  g('Logon se poocho kaise hain, aur doosra jawaab suno.', 'Life and reality', 'Listening', 'Warm', ['jawaab', 'suno']),

  /* ------------------------------------------------------ Motivational */
  e('Show up before you feel ready. Readiness is a rumour.', 'Motivational', 'Courage', 'Direct', ['motivation', 'courage']),
  e('You cannot think your way into a habit.', 'Motivational', 'Discipline', 'Sharp', ['motivation', 'habits']),
  e('Boring work done well is the whole career.', 'Motivational', 'Craft', 'Wise', ['motivation', 'craft']),
  h('तैयार लगने से पहले पहुँच जाओ, तैयारी एक अफ़वाह है।', 'Motivational', 'साहस', 'स्पष्ट', ['तैयारी', 'पहुँच']),
  h('सोचकर आदत नहीं बनती।', 'Motivational', 'अनुशासन', 'तीखा', ['सोचकर', 'आदत']),
  h('उबाऊ काम ढंग से करना ही पूरा करियर है।', 'Motivational', 'कला', 'गंभीर', ['काम', 'करियर']),
  g('Taiyaar lagne se pehle pahunch jao, taiyari ek afwah hai.', 'Motivational', 'Courage', 'Direct', ['taiyari', 'pahunch']),
  g('Sochkar aadat nahi banti.', 'Motivational', 'Discipline', 'Sharp', ['sochkar', 'aadat']),
  g('Ubaau kaam dhang se karna hi poora career hai.', 'Motivational', 'Craft', 'Wise', ['kaam', 'career']),

  /* -------------------------------------------------------- Aesthetic */
  e('A small lamp in the corner is the cheapest warmth you can buy.', 'Aesthetic', 'Light', 'Warm', ['aesthetic', 'lamp']),
  e('Let the table stay half empty so the food can arrive.', 'Aesthetic', 'Table', 'Composed', ['aesthetic', 'table']),
  e('Old calendars on the wall look like art if you frame them.', 'Aesthetic', 'Home', 'Wry', ['aesthetic', 'frames']),
  h('कोने में छोटा लैंप सबसे सस्ती गर्माहट है।', 'Aesthetic', 'रोशनी', 'कोमल', ['लैंप', 'गर्माहट']),
  h('मेज़ आधी खाली रहने दो, खाना आएगा।', 'Aesthetic', 'मेज़', 'शांत', ['मेज़', 'खाना']),
  h('पुराने कैलेंडर फ़्रेम कर लो तो कला लगते हैं।', 'Aesthetic', 'घर', 'सहज', ['कैलेंडर', 'कला']),
  g('Kone mein chhota lamp sabse sasti garmahat hai.', 'Aesthetic', 'Light', 'Warm', ['lamp', 'garmahat']),
  g('Mez aadhi khaali chhodo, tab khaana rakho.', 'Aesthetic', 'Table', 'Composed', ['mez', 'khaana']),
  g('Purane calendar frame kar lo toh kala lagte hain.', 'Aesthetic', 'Home', 'Wry', ['calendar', 'kala']),

  /* ---------------------------------------------- Wider category band */
  e('One minute of standing still is a version of rest.', 'Yoga and wellness', 'Rest', 'Practical', ['yoga', 'rest']),
  e('Breathe into the part of your back that is complaining.', 'Yoga and wellness', 'Body', 'Practical', ['yoga', 'back']),
  e('Make notes in your own words or they are somebody else notes.', 'Student life', 'Revision', 'Direct', ['student', 'notes']),
  e('Block two hours for deep work and say no to the rest.', 'Professional and business', 'Focus', 'Direct', ['professional', 'focus']),
  e('A good captain fields at the boundary in a tight match.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'captain']),
  e('The brakes matter more than the engine.', 'Cars and bikes', 'Safety', 'Wise', ['cars', 'brakes']),
  e('A single good pair of shoes outranks five cheap ones.', 'Fashion and beauty', 'Shoes', 'Practical', ['fashion', 'shoes']),
  e('Name the variable clearly and you will not need the comment.', 'Technology and coding', 'Craft', 'Direct', ['tech', 'naming']),
  e('Write down what surprised you. That is the data.', 'Science and curiosity', 'Method', 'Practical', ['science', 'data']),
  e('Do one thing well for one customer before scaling.', 'Startup and hustle', 'Focus', 'Direct', ['startup', 'focus']),
  e('A door that shuts quietly is worth maintaining.', 'Home and interiors', 'Maintenance', 'Practical', ['home', 'maintenance']),
  e('Empty space is the only decoration that never dates.', 'Minimal', 'Space', 'Composed', ['minimal', 'space']),
  e('Tuck the shirt in and the whole outfit starts working.', 'Stylish', 'Details', 'Practical', ['stylish', 'shirt']),
  e('Say the serious thing and let the room laugh after.', 'Funny and comedy', 'Timing', 'Wry', ['funny', 'timing']),
  e('I will say the useful thing even if it costs me the room.', 'Savage and bold', 'Directness', 'Firm', ['savage', 'directness']),
  e('The letter you write and do not send is still a letter.', 'Deep and emotional', 'Writing', 'Tender', ['deep', 'letter']),
  e('A feed without a grid is still a feed.', 'Instagram profiles', 'Approach', 'Wry', ['instagram', 'grid']),
  e('I am more interested in being useful than being noticed.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'useful']),
  e('My worth is not a bidding war.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'worth']),
  e('The family group chat is a form of love with bad grammar.', 'Family', 'Everyday', 'Wry', ['family', 'chat']),
  e('Friendship survives fewer messages and more memory.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'memory']),
  e('An evening alone is a room you get to arrange.', 'Alone and loneliness', 'Solitude', 'Warm', ['alone', 'solitude']),
  e('One honest prayer is worth a hundred borrowed phrases.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'prayer']),
  e('Rain on a tin roof is the oldest music there is.', 'Nature', 'Rain', 'Warm', ['nature', 'rain']),
  e('The city at five in the morning belongs to the walkers.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'morning']),
  h('दो घंटे गहरे काम के लिए रखो, बाकी से मना करो।', 'Professional and business', 'एकाग्रता', 'स्पष्ट', ['काम', 'मना']),
  h('कैप्टन अच्छा वो है जो तंग मैच में बाउंड्री पर खड़ा हो।', 'Cricket and sports', 'क्रिकेट', 'गंभीर', ['कैप्टन', 'मैच']),
  h('ब्रैक इंजन से ज़्यादा ज़रूरी हैं।', 'Cars and bikes', 'सुरक्षा', 'गंभीर', ['ब्रैक', 'इंजन']),
  h('अपने शब्दों में नोट्स बनाओ, वरना वो किसी और के नोट्स हैं।', 'Student life', 'दोहराव', 'स्पष्ट', ['नोट्स', 'शब्दों']),
  h('सोने के लिए समय तय करो, वैसे ही जैसे मीटिंग का करते हो।', 'Yoga and wellness', 'नींद', 'व्यावहारिक', ['समय', 'मीटिंग']),
  h('जो चौंकाए उसे लिख लो, वही तुम्हारा डेटा है।', 'Science and curiosity', 'तरीक़ा', 'व्यावहारिक', ['डेटा', 'लिख']),
  h('एक बंदा साफ़ नाम रखो, कमेंट की ज़रूरत नहीं पड़ेगी।', 'Technology and coding', 'कला', 'स्पष्ट', ['नाम', 'कमेंट']),
  h('खाली जगह ही वो सजावट है जो कभी पुरानी नहीं होती।', 'Minimal', 'जगह', 'शांत', ['जगह', 'सजावट']),
  g('Do ghante gehre kaam ke liye rakho, baaki se mana karo.', 'Professional and business', 'Focus', 'Direct', ['kaam', 'mana']),
  g('Captain accha woh hai jo tang match mein boundary par khada ho.', 'Cricket and sports', 'Cricket', 'Wise', ['captain', 'match']),
  g('Brake engine se zyada zaroori hain.', 'Cars and bikes', 'Safety', 'Wise', ['brake', 'engine']),
  g('Apne shabdon mein notes banao, warna woh kisi aur ke notes hain.', 'Student life', 'Revision', 'Direct', ['notes', 'shabdon']),
  g('Sone ke liye samay tay karo, waise hi jaise meeting ka karte ho.', 'Yoga and wellness', 'Sleep', 'Practical', ['samay', 'meeting']),
  g('Jo chaunkaye use likh lo, wahi tumhara data hai.', 'Science and curiosity', 'Method', 'Practical', ['data', 'likh']),
  g('Ek banda saaf naam rakho, comment ki zaroorat nahi padegi.', 'Technology and coding', 'Craft', 'Direct', ['naam', 'comment']),
  g('Khaali jagah hi woh sajawat hai jo kabhi purani nahi hoti.', 'Minimal', 'Space', 'Composed', ['jagah', 'sajawat']),
];
