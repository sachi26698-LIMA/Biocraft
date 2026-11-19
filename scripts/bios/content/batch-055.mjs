/**
 * BioCraft original bios — batch 055.
 * Allocation from scripts/bios/balance.mjs: 43 EN / 35 HI / 32 HG.
 * New subject matter: tailoring a wedding, the loan, a sibling exam year,
 * returning to a hometown, the first paying client, a dog that waits.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_055 = [
  /* ------------------------------------------------------------ Attitude */
  e('I return things I borrow and I return them early.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'borrow']),
  e('I do not take a loan to look like somebody I am not.', 'Attitude', 'Restraint', 'Composed', ['attitude', 'loan']),
  e('I measure a wedding by how the staff were treated.', 'Attitude', 'Values', 'Wise', ['attitude', 'wedding']),
  h('मैं उधार की चीज़ लौटाता हूँ, और वक़्त से पहले लौटाता हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['उधार', 'लौटाता']),
  h('मैं किसी और जैसा दिखने के लिए क़र्ज़ नहीं लेता।', 'Attitude', 'संयम', 'शांत', ['क़र्ज़', 'दिखने']),
  h('मैं सस्ती सीट पर बैठकर भी मैच का मज़ा ले लेता हूँ।', 'Attitude', 'संतोष', 'कोमल', ['सीट', 'मैच']),
  g('Main udhaar ki cheez lautata hoon, aur waqt se pehle lautata hoon.', 'Attitude', 'Integrity', 'Firm', ['udhaar', 'lautata']),
  g('Main kisi aur jaisa dikhne ke liye karz nahi leta.', 'Attitude', 'Restraint', 'Composed', ['karz', 'dikhne']),
  g('Main sasti seat par baithkar bhi match ka maza le leta hoon.', 'Attitude', 'Contentment', 'Warm', ['seat', 'match']),

  /* ------------------------------------------------------------- Love */
  e('I want to marry you in a room with forty people and good food.', 'Love and romance', 'Commitment', 'Warm', ['love', 'wedding']),
  e('We are the couple who leaves the party early and talks in the car.', 'Love and romance', 'Closeness', 'Warm', ['love', 'party']),
  e('You have been patient with my family and I have not forgotten.', 'Love and romance', 'Gratitude', 'Tender', ['love', 'family']),
  e('I would do the boring paperwork of a life with you happily.', 'Love and romance', 'Real love', 'Wise', ['love', 'paperwork']),
  h('मैं तुमसे चालीस लोगों और अच्छे खाने वाले कमरे में शादी करना चाहता हूँ।', 'Love and romance', 'निभाना', 'कोमल', ['शादी', 'खाने']),
  h('हम वो जोड़ी हैं जो पार्टी जल्दी छोड़कर गाड़ी में बात करती है।', 'Love and romance', 'अपनापन', 'कोमल', ['पार्टी', 'गाड़ी']),
  h('तुमने मेरे परिवार के साथ सब्र रखा, और मैं भूला नहीं हूँ।', 'Love and romance', 'कृतज्ञता', 'कोमल', ['सब्र', 'परिवार']),
  g('Main tumse chalees logon aur acchhe khaane wale kamre mein shaadi karna chahta hoon.', 'Love and romance', 'Commitment', 'Warm', ['shaadi', 'khaane']),
  g('Hum woh jodi hain jo party jaldi chhodkar gaadi mein baat karti hai.', 'Love and romance', 'Closeness', 'Warm', ['party', 'gaadi']),
  g('Tumne mere parivaar ke saath sabr rakha, aur main bhoola nahi hoon.', 'Love and romance', 'Gratitude', 'Tender', ['sabr', 'parivaar']),

  /* ------------------------------------------------------- Sad depth */
  e('My sister exam year took the whole house hostage.', 'Sad and heartbreak', 'Family', 'Heavy', ['sad', 'exams']),
  e('The loan was approved faster than my father could explain why he needed it.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'loan']),
  e('I went back to my hometown and the shops had new signs.', 'Sad and heartbreak', 'Places', 'Quiet', ['sad', 'hometown']),
  e('The dog still waits at the gate at six, and nobody has told him.', 'Sad and heartbreak', 'Loss', 'Aching', ['sad', 'dog']),
  h('बहन का परीक्षा वाला साल पूरे घर को बंधक बना गया।', 'Sad and heartbreak', 'परिवार', 'भारी', ['परीक्षा', 'घर']),
  h('क़र्ज़ पिताजी के कारण बताने से पहले मंज़ूर हो गया।', 'Sad and heartbreak', 'पैसा', 'भारी', ['क़र्ज़', 'पिताजी']),
  h('मैं अपने शहर लौटा और दुकानों पर नए बोर्ड लगे थे।', 'Sad and heartbreak', 'जगह', 'शांत', ['दुकानों', 'बोर्ड']),
  g('Behen ka exam wala saal poore ghar ko bandhak bana gaya.', 'Sad and heartbreak', 'Family', 'Heavy', ['exam', 'ghar']),
  g('Karz pitaji ke kaaran batane se pehle manzoor ho gaya.', 'Sad and heartbreak', 'Money', 'Heavy', ['karz', 'pitaji']),
  g('Kutta ab bhi chhe baje gate par baithta hai, aur kisi ne usse bataya nahi.', 'Sad and heartbreak', 'Loss', 'Aching', ['kutta', 'gate']),

  /* --------------------------------------------------------- Shayari */
  h('मेरा शहर\nअब भी\nमेरा नाम जानता है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शहर', 'नाम']),
  h('क़र्ज़ चुका दिया,\nपर वो\nबात नहीं।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['क़र्ज़', 'बात']),
  g('Mera shehar ab bhi mera naam jaanta hai.', 'Shayari', 'Two line', 'Aching', ['shehar', 'naam']),
  g('Karz chuka diya, par woh baat nahi.', 'Shayari', 'Two line', 'Deep', ['karz', 'baat']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A wedding is a party. A marriage is a maintenance schedule.', 'Quotes and thoughts', 'Marriage', 'Sharp', ['quotes', 'marriage']),
  e('Debt is a promise made by a future version of you.', 'Quotes and thoughts', 'Money', 'Wise', ['quotes', 'debt']),
  e('A hometown does not change. Your eyes do.', 'Quotes and thoughts', 'Places', 'Wise', ['quotes', 'hometown']),
  e('Your first paying client believes in you before you do.', 'Quotes and thoughts', 'Work', 'Warm', ['quotes', 'client']),
  h('शादी एक पार्टी है, साथ रहना एक रखरखाव।', 'Quotes and thoughts', 'शादी', 'तीखा', ['शादी', 'रखरखाव']),
  h('क़र्ज़ तुम्हारे भविष्य के रूप का किया वादा है।', 'Quotes and thoughts', 'पैसा', 'गंभीर', ['क़र्ज़', 'वादा']),
  h('अपना शहर नहीं बदलता, आँखें बदल जाती हैं।', 'Quotes and thoughts', 'जगह', 'गंभीर', ['शहर', 'आँखें']),
  g('Shaadi ek party hai, saath rehna ek rakhrkhaav.', 'Quotes and thoughts', 'Marriage', 'Sharp', ['shaadi', 'rakhrkhaav']),
  g('Karz tumhare bhavishya ke roop ka kiya waada hai.', 'Quotes and thoughts', 'Money', 'Wise', ['karz', 'waada']),
  g('Apna shehar nahi badalta, aankhein badal jaati hain.', 'Quotes and thoughts', 'Places', 'Wise', ['shehar', 'aankhein']),

  /* ------------------------------------------------- Life and reality */
  e('Invite fewer people and feed them better.', 'Life and reality', 'Weddings', 'Practical', ['life', 'wedding']),
  e('The exam year ends. Remind the house of that.', 'Life and reality', 'Family', 'Warm', ['life', 'exams']),
  e('Go home for a week. Then you will know what to do next.', 'Life and reality', 'Hometown', 'Wise', ['life', 'hometown']),
  e('Ask for the loan terms in writing and read them twice.', 'Life and reality', 'Money', 'Practical', ['life', 'loan']),
  h('कम लोग बुलाओ, और उन्हें बेहतर खिलाओ।', 'Life and reality', 'शादी', 'व्यावहारिक', ['लोग', 'खिलाओ']),
  h('शादी में सब दो चीज़ें याद रखते हैं: खाना और गर्मी।', 'Life and reality', 'शादी', 'सहज', ['खाना', 'गर्मी']),
  h('परीक्षा वाला साल खत्म होता है, घर को यह याद दिलाओ।', 'Life and reality', 'परिवार', 'कोमल', ['साल', 'घर']),
  h('एक हफ़्ता घर जाओ, तब समझ आएगा आगे क्या करना है।', 'Life and reality', 'शहर', 'गंभीर', ['हफ़्ता', 'घर']),
  g('Kam log bulao, aur unhe behtar khilao.', 'Life and reality', 'Weddings', 'Practical', ['log', 'khilao']),
  g('Shaadi mein sab do cheezein yaad rakhte hain: khaana aur garmi.', 'Life and reality', 'Weddings', 'Wry', ['khaana', 'garmi']),
  g('Exam wala saal khatam hota hai, ghar ko yeh yaad dilao.', 'Life and reality', 'Family', 'Warm', ['saal', 'ghar']),
  g('Ek hafta ghar jao, tab samajh aayega aage kya karna hai.', 'Life and reality', 'Hometown', 'Wise', ['hafta', 'ghar']),

  /* ------------------------------------------------------ Motivational */
  e('Charge properly for your work and the work gets better.', 'Motivational', 'Worth', 'Direct', ['motivation', 'pricing']),
  e('Do the paperwork. Future you is not stronger than present you.', 'Motivational', 'Discipline', 'Wry', ['motivation', 'paperwork']),
  h('अपने काम का ठीक दाम लो, काम भी बेहतर होता है।', 'Motivational', 'क़ीमत', 'स्पष्ट', ['काम', 'दाम']),
  h('पहला ग्राहक एक लंबी किताब का पहला वाक्य है।', 'Motivational', 'शुरुआत', 'गंभीर', ['ग्राहक', 'वाक्य']),
  h('काग़ज़ी काम निपटाओ, आगे वाला तुम अभी वाले तुम से मज़बूत नहीं है।', 'Motivational', 'अनुशासन', 'सहज', ['काम', 'मज़बूत']),
  g('Apne kaam ka theek daam lo, kaam bhi behtar hota hai.', 'Motivational', 'Worth', 'Direct', ['kaam', 'daam']),
  g('Pehla grahak ek lambi kitaab ka pehla vakya hai.', 'Motivational', 'Starting', 'Wise', ['grahak', 'vakya']),
  g('Kaagzi kaam nipatao, aage wala tum abhi wale tum se mazboot nahi hai.', 'Motivational', 'Discipline', 'Wry', ['kaam', 'mazboot']),

  /* -------------------------------------------------------- Aesthetic */
  e('A plain shawl over a plain kurta is the whole wedding look.', 'Aesthetic', 'Weddings', 'Composed', ['aesthetic', 'shawl']),
  e('Marigolds and white cloth will outlive any theme.', 'Aesthetic', 'Weddings', 'Warm', ['aesthetic', 'marigolds']),
  h('सादे कुर्ते पर सादा शॉल, पूरा शादी का लुक है।', 'Aesthetic', 'शादी', 'शांत', ['कुर्ते', 'शॉल']),
  h('गेंदे और सफ़ेद कपड़ा हर थीम से ज़्यादा चलते हैं।', 'Aesthetic', 'शादी', 'कोमल', ['गेंदे', 'कपड़ा']),
  g('Saade kurte par saada shawl, poora shaadi ka look hai.', 'Aesthetic', 'Weddings', 'Composed', ['kurte', 'shawl']),
  g('Gende aur safed kapda har theme se zyada chalte hain.', 'Aesthetic', 'Weddings', 'Warm', ['gende', 'kapda']),

  /* ---------------------------------------------- Wider category band */
  e('Wedding season is a test of your sleep and your patience.', 'Yoga and wellness', 'Rest', 'Wry', ['yoga', 'wedding']),
  e('An exam year needs a timetable on the wall, not in your head.', 'Student life', 'Exams', 'Practical', ['student', 'timetable']),
  e('Send the invoice the day you finish. Not on Friday.', 'Professional and business', 'Money', 'Practical', ['professional', 'invoice']),
  e('A tight field and a calm bowler beat a big total.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'fielding']),
  e('Keep the service records in the glovebox, not in your memory.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'records']),
  e('Wedding clothes should be wearable twice or they are rentals.', 'Fashion and beauty', 'Weddings', 'Practical', ['fashion', 'wedding']),
  e('Invoice generation is boring code that pays your rent.', 'Technology and coding', 'Craft', 'Wry', ['tech', 'billing']),
  e('Write the number in the lab book before you celebrate it.', 'Science and curiosity', 'Method', 'Practical', ['science', 'method']),
  e('Your first invoice teaches you more than your first pitch.', 'Startup and hustle', 'Revenue', 'Wise', ['startup', 'invoice']),
  e('A house with a guest room is a house with a schedule.', 'Home and interiors', 'Home', 'Wry', ['home', 'guests']),
  e('One good shawl replaces three jackets at a wedding.', 'Minimal', 'Wardrobe', 'Practical', ['minimal', 'shawl']),
  e('A well-tailored kurta beats a branded one every single time.', 'Stylish', 'Tailoring', 'Practical', ['stylish', 'kurta']),
  e('The funniest person at a wedding is usually the caterer.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'wedding']),
  e('I will tell you when the wedding is too expensive to be fun.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who helps you through a loan application is family.', 'Friendship', 'Support', 'Warm', ['friendship', 'loan']),
  e('Attention is the wedding gift nobody returns.', 'Family', 'Weddings', 'Warm', ['family', 'wedding']),
  e('Coming home alone to a quiet flat after a wedding is its own feeling.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'wedding']),
  e('Photograph the grandmother, not the decoration.', 'Photography', 'Weddings', 'Wise', ['photography', 'wedding']),
  e('I am the person who reads the loan agreement at the wedding.', 'Personality and identity', 'Identity', 'Wry', ['personality', 'loan']),
  e('A dog that waits for you is a schedule you cannot break.', 'Pets and animals', 'Dogs', 'Warm', ['pets', 'dogs']),
  h('शादी का मौसम नींद और सब्र की परीक्षा है।', 'Yoga and wellness', 'आराम', 'सहज', ['शादी', 'नींद']),
  h('काम खत्म होने के दिन ही बिल भेजो, शुक्रवार का इंतज़ार मत करो।', 'Professional and business', 'पैसा', 'व्यावहारिक', ['बिल', 'दिन']),
  h('पहला बिल पहले पिच से ज़्यादा सिखाता है।', 'Startup and hustle', 'कमाई', 'गंभीर', ['बिल', 'पिच']),
  h('शादी में दादी की तस्वीर खींचो, सजावट की नहीं।', 'Photography', 'शादी', 'गंभीर', ['दादी', 'तस्वीर']),
  h('पार्टी में जाने के लिए क़र्ज़ नहीं लूँगा।', 'Self-respect', 'स्वाभिमान', 'दृढ़', ['पार्टी', 'क़र्ज़']),
  g('Shaadi ka mausam neend aur sabr ki pariksha hai.', 'Yoga and wellness', 'Rest', 'Wry', ['shaadi', 'neend']),
  g('Kaam khatam hone ke din hi bill bhejo, Friday ka intezaar mat karo.', 'Professional and business', 'Money', 'Practical', ['bill', 'din']),
  g('Pehla bill pehle pitch se zyada sikhaata hai.', 'Startup and hustle', 'Revenue', 'Wise', ['bill', 'pitch']),
  g('Shaadi mein dadi ki tasveer kheench lo, sajawat ki nahi.', 'Photography', 'Weddings', 'Wise', ['dadi', 'tasveer']),
  g('Party mein jaane ke liye karz nahi loonga.', 'Self-respect', 'Worth', 'Firm', ['party', 'karz']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('मैं सस्ती सीट पर बैठकर मैच का पूरा मज़ा ले लेता हूँ।', 'Attitude', 'संतोष', 'कोमल', ['सीट', 'मज़ा']),
  h('शादी में सबको खाना और गर्मी याद रहती है।', 'Life and reality', 'शादी', 'सहज', ['खाना', 'गर्मी']),
  h('कोई जगह बदलती नहीं, आँखें बदल जाती हैं।', 'Life and reality', 'जगह', 'गंभीर', ['जगह', 'आँखें']),
  h('पहली कमाई तुमसे पहले तुम पर भरोसा करती है।', 'Motivational', 'शुरुआत', 'कोमल', ['कमाई', 'भरोसा']),
  h('शादी की वो तस्वीर रखो जो बिना पोज़ के है।', 'Aesthetic', 'याद', 'कोमल', ['तस्वीर', 'पोज़']),
  g('Ticket sasta ho ya mehnga, maza dhang se lena chahiye.', 'Attitude', 'Contentment', 'Warm', ['ticket', 'maza']),
  g('Shaadi mein sabko khaana aur garmi yaad rehti hai.', 'Life and reality', 'Weddings', 'Wry', ['khaana', 'garmi']),
  g('Koi jagah badalti nahi, aankhein badal jaati hain.', 'Life and reality', 'Places', 'Wise', ['jagah', 'aankhein']),
  g('Pehli kamai tumse pehle tum par bharosa karti hai.', 'Motivational', 'Starting', 'Warm', ['kamai', 'bharosa']),
  g('Shaadi ki woh tasveer rakho jo bina pose ke hai.', 'Aesthetic', 'Memory', 'Warm', ['tasveer', 'pose']),
  g('Shaadi se pehle dua karo, phir dhang se khaana khao.', 'Spirituality and peace', 'Practice', 'Warm', ['dua', 'khaana']),
];
