/**
 * BioCraft original bios — batch 062.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 32 HI / 33 HG.
 * New subject matter: the cycle puncture shop, a father's transfer order,
 * the neighbourhood temple loudspeaker, first day at a new school,
 * a grandmother's recipe nobody wrote down.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_062 = [
  /* ------------------------------------------------------------ Attitude */
  e('I pay the puncture boy before he asks twice.', 'Attitude', 'Integrity', 'Practical', ['attitude', 'puncture']),
  e('I turn the speaker down at eleven without being asked.', 'Attitude', 'Consideration', 'Composed', ['attitude', 'speaker']),
  e('I introduce myself on the first day instead of waiting to be found.', 'Attitude', 'Courage', 'Direct', ['attitude', 'school']),
  h('पंचर वाले को दोबारा माँगने से पहले पैसे दे देता हूँ।', 'Attitude', 'ईमानदारी', 'व्यावहारिक', ['पंचर', 'पैसे']),
  h('पिताजी का तबादला का आदेश उस फ़ाइल में है जो उन्होंने कभी नहीं खोली।', 'Attitude', 'याद', 'शांत', ['तबादला', 'फ़ाइल']),
  h('ग्यारह बजे स्पीकर धीमा कर देता हूँ, बिना कहे।', 'Attitude', 'लिहाज़', 'शांत', ['स्पीकर', 'ग्यारह']),
  h('पहले दिन ख़ुद पहल करके मिलता हूँ, मिलने का इंतज़ार नहीं करता।', 'Attitude', 'साहस', 'स्पष्ट', ['पहले', 'मिलता']),
  g('Puncture wale ko dobara maangne se pehle paise de deta hoon.', 'Attitude', 'Integrity', 'Practical', ['puncture', 'paise']),
  g('Pitaji ka tabadla ka aadesh us file mein hai jo unhone kabhi nahi kholi.', 'Attitude', 'Memory', 'Quiet', ['tabadla', 'file']),
  g('Gyarah baje speaker dheema kar deta hoon, bina kahe.', 'Attitude', 'Consideration', 'Composed', ['speaker', 'gyarah']),
  g('Pehle din khud pahal karke milta hoon, milne ka intezaar nahi karta.', 'Attitude', 'Courage', 'Direct', ['pehle', 'milta']),

  /* ------------------------------------------------------------- Love */
  e('You learned my grandmother recipe from a video call and got it wrong twice.', 'Love and romance', 'Effort', 'Warm', ['love', 'recipe']),
  e('We met because our fathers were posted to the same town.', 'Love and romance', 'Chance', 'Warm', ['love', 'transfer']),
  e('You hum the temple song badly and I have grown to like it.', 'Love and romance', 'Familiarity', 'Warm', ['love', 'temple']),
  h('तुमने वीडियो कॉल पर दादी की रेसिपी सीखी और दो बार बिगाड़ी।', 'Love and romance', 'कोशिश', 'कोमल', ['रेसिपी', 'बिगाड़ी']),
  h('हम इसलिए मिले कि हमारे पिता एक ही शहर में तैनात थे।', 'Love and romance', 'संयोग', 'कोमल', ['शहर', 'तैनात']),
  h('तुम मेरे साथ पंचर की दुकान तक चलकर आते हो और शादी जैसा इंतज़ार करते हो।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['पंचर', 'इंतज़ार']),
  g('Tumne video call par dadi ki recipe seekhi aur do baar bigaadi.', 'Love and romance', 'Effort', 'Warm', ['recipe', 'bigaadi']),
  g('Hum isliye mile ki humare pitaji ek hi shehar mein tainaat the.', 'Love and romance', 'Chance', 'Warm', ['shehar', 'tainaat']),
  g('Tum mere saath puncture ki dukaan tak chalkar aate ho aur shaadi jaisa intezaar karte ho.', 'Love and romance', 'Ordinary days', 'Tender', ['puncture', 'intezaar']),

  /* ------------------------------------------------------- Sad depth */
  e('We moved four times before I finished school, and I stopped unpacking the books.', 'Sad and heartbreak', 'Childhood', 'Heavy', ['sad', 'moving']),
  e('The recipe died with her because nobody wrote it down.', 'Sad and heartbreak', 'Loss', 'Aching', ['sad', 'recipe']),
  e('The loudspeaker was louder than my father voice on his last call.', 'Sad and heartbreak', 'Home', 'Heavy', ['sad', 'speaker']),
  e('On my first day at the new school I ate lunch in the toilet.', 'Sad and heartbreak', 'School', 'Honest', ['sad', 'school']),
  h('स्कूल खत्म होने से पहले हम चार बार शहर बदल चुके थे, और मैंने किताबें खोलना बंद कर दिया।', 'Sad and heartbreak', 'बचपन', 'भारी', ['किताबें', 'शहर']),
  h('रेसिपी उनके साथ चली गई, क्योंकि किसी ने लिखी ही नहीं।', 'Sad and heartbreak', 'खोना', 'भावुक', ['रेसिपी', 'लिखी']),
  h('स्पीकर उस आख़िरी कॉल पर पिताजी की आवाज़ से तेज़ था।', 'Sad and heartbreak', 'घर', 'भारी', ['स्पीकर', 'आवाज़']),
  g('School khatam hone se pehle hum chaar baar shehar badal chuke the, aur maine kitaabein kholna band kar diya.', 'Sad and heartbreak', 'Childhood', 'Heavy', ['kitaabein', 'shehar']),
  g('Recipe unke saath chali gayi, kyunki kisi ne likhi hi nahi.', 'Sad and heartbreak', 'Loss', 'Aching', ['recipe', 'likhi']),
  g('Speaker us aakhri call par pitaji ki awaaz se tez tha.', 'Sad and heartbreak', 'Home', 'Heavy', ['speaker', 'awaaz']),

  /* --------------------------------------------------------- Shayari */
  h('नई क्लास,\nवही\nख़ामोशी।', 'Shayari', 'तीन पंक्ति', 'शांत', ['क्लास', 'ख़ामोशी']),
  h('उसकी रेसिपी\nअब मेरे हाथ में\nफीकी है।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['रेसिपी', 'हाथ']),
  g('Nayi class, wahi khamoshi.', 'Shayari', 'Two line', 'Quiet', ['class', 'khamoshi']),
  g('Uski recipe ab mere haath mein pheeki hai.', 'Shayari', 'Two line', 'Aching', ['recipe', 'haath']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A transfer order is a decision children do not get a vote on.', 'Quotes and thoughts', 'Childhood', 'Sharp', ['quotes', 'transfer']),
  e('Write the recipe down. Love does not survive on memory alone.', 'Quotes and thoughts', 'Family', 'Wise', ['quotes', 'recipe']),
  e('A loudspeaker tells you what a street believes it owes itself.', 'Quotes and thoughts', 'Cities', 'Sharp', ['quotes', 'speaker']),
  h('तबादले का आदेश वो फ़ैसला है जिसमें बच्चों की राय नहीं ली जाती।', 'Quotes and thoughts', 'बचपन', 'तीखा', ['तबादले', 'राय']),
  h('रेसिपी लिख लो, प्यार सिर्फ़ याद पर नहीं टिकता।', 'Quotes and thoughts', 'परिवार', 'गंभीर', ['रेसिपी', 'प्यार']),
  h('स्पीकर बताता है कि गली ख़ुद को क्या देना चाहती है।', 'Quotes and thoughts', 'शहर', 'तीखा', ['स्पीकर', 'गली']),
  g('Tabadle ka aadesh woh faisla hai jismein bachchon ki raay nahi li jaati.', 'Quotes and thoughts', 'Childhood', 'Sharp', ['tabadle', 'raay']),
  g('Recipe likh lo, pyaar sirf yaad par nahi tikta.', 'Quotes and thoughts', 'Family', 'Wise', ['recipe', 'pyaar']),
  g('Speaker bataata hai ki gali khud ko kya dena chahti hai.', 'Quotes and thoughts', 'Cities', 'Sharp', ['speaker', 'gali']),

  /* ------------------------------------------------- Life and reality */
  e('Find the puncture shop first. Everything else follows.', 'Life and reality', 'New city', 'Practical', ['life', 'puncture']),
  e('Learn one local recipe in every town you live in.', 'Life and reality', 'Home', 'Warm', ['life', 'recipe']),
  e('Say hello on day one, even if your voice shakes.', 'Life and reality', 'School', 'Direct', ['life', 'school']),
  e('Ask the neighbours about the speaker before you complain to anyone.', 'Life and reality', 'Neighbours', 'Practical', ['life', 'speaker']),
  h('पहले पंचर की दुकान खोजो, बाकी सब ख़ुद मिल जाएगा।', 'Life and reality', 'नया शहर', 'व्यावहारिक', ['पंचर', 'दुकान']),
  h('जिस शहर में रहो, वहाँ की एक रेसिपी ज़रूर सीखो।', 'Life and reality', 'घर', 'कोमल', ['शहर', 'रेसिपी']),
  h('पहले दिन सलाम करो, आवाज़ काँपे तो भी।', 'Life and reality', 'स्कूल', 'स्पष्ट', ['सलाम', 'आवाज़']),
  h('तबादले के काग़ज़ रखो, बच्चे जानना चाहेंगे कि कहाँ पैदा हुए।', 'Life and reality', 'परिवार', 'गंभीर', ['काग़ज़', 'बच्चे']),
  g('Pehle puncture ki dukaan khojo, baaki sab khud mil jayega.', 'Life and reality', 'New city', 'Practical', ['puncture', 'dukaan']),
  g('Jis shehar mein raho, wahan ki ek recipe zaroor seekho.', 'Life and reality', 'Home', 'Warm', ['shehar', 'recipe']),
  g('Pehle din salaam karo, awaaz kaanpe toh bhi.', 'Life and reality', 'School', 'Direct', ['salaam', 'awaaz']),

  /* ------------------------------------------------------ Motivational */
  e('Being the new kid four times taught me to speak first.', 'Motivational', 'Courage', 'Warm', ['motivation', 'courage']),
  e('A recipe you cannot recreate is a debt you can never repay.', 'Motivational', 'Family', 'Wise', ['motivation', 'recipe']),
  e('Nobody remembers your first day. That is a freedom.', 'Motivational', 'Confidence', 'Direct', ['motivation', 'school']),
  h('चार बार नया बच्चा होने ने मुझे पहले बोलना सिखाया।', 'Motivational', 'साहस', 'कोमल', ['बच्चा', 'बोलना']),
  h('जो रेसिपी तुम दोबारा नहीं बना सकते, वो क़र्ज़ है जो कभी नहीं चुकेगा।', 'Motivational', 'परिवार', 'गंभीर', ['रेसिपी', 'क़र्ज़']),
  h('पहला दिन किसी को याद नहीं रहता, यही आज़ादी है।', 'Motivational', 'आत्मविश्वास', 'स्पष्ट', ['दिन', 'आज़ादी']),
  g('Chaar baar naya bachcha hone ne mujhe pehle bolna sikhaya.', 'Motivational', 'Courage', 'Warm', ['bachcha', 'bolna']),
  g('Jo recipe tum dobara nahi bana sakte, woh karz hai jo kabhi nahi chukega.', 'Motivational', 'Family', 'Wise', ['recipe', 'karz']),
  g('Pehla din kisi ko yaad nahi rehta, yahi aazaadi hai.', 'Motivational', 'Confidence', 'Direct', ['din', 'aazaadi']),

  /* -------------------------------------------------------- Aesthetic */
  e('A hand-written recipe card is worth more than any framed print.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'recipe']),
  e('One clean steel box for the papers and the house feels organised.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'box']),
  h('हाथ से लिखा रेसिपी कार्ड किसी भी फ़्रेम से क़ीमती है।', 'Aesthetic', 'घर', 'कोमल', ['रेसिपी', 'कार्ड']),
  h('पंचर की दुकान पर टँगे पुराने टायर शहर का पुरालेख हैं।', 'Aesthetic', 'शहर', 'सहज', ['टायर', 'पुरालेख']),
  g('Haath se likha recipe card kisi bhi frame se keemti hai.', 'Aesthetic', 'Home', 'Warm', ['recipe', 'frame']),
  g('Puncture ki dukaan par tange purane tyre shehar ka puraalekh hain.', 'Aesthetic', 'Cities', 'Wry', ['tyre', 'puraalekh']),

  /* ---------------------------------------------- Wider category band */
  e('A loudspeaker at five a.m. is a public health question.', 'Yoga and wellness', 'Sleep', 'Sharp', ['yoga', 'speaker']),
  e('On a new school day, sit in the second row and you will be fine.', 'Student life', 'School', 'Practical', ['student', 'school']),
  e('Every shop needs one system that survives the owner taking a day off.', 'Professional and business', 'Systems', 'Wise', ['professional', 'systems']),
  e('A spare tube in the bag has saved more mornings than any app.', 'Cars and bikes', 'Repairs', 'Practical', ['cars', 'tube']),
  e('Keep one outfit that survives a first day anywhere.', 'Fashion and beauty', 'Style', 'Practical', ['fashion', 'style']),
  e('Write the recipe into a notes file and back it up. Recipes get lost.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'backup']),
  e('Taste, adjust, taste again. That is the whole method.', 'Science and curiosity', 'Method', 'Practical', ['science', 'method']),
  e('A service business lives or dies on whether it answers the phone.', 'Startup and hustle', 'Service', 'Sharp', ['startup', 'service']),
  e('One steel box on the shelf fixes the paperwork problem.', 'Home and interiors', 'Organising', 'Practical', ['home', 'organising']),
  e('Keep four plates, four glasses, four spoons. Guests bring the rest.', 'Minimal', 'Kitchen', 'Wry', ['minimal', 'kitchen']),
  e('Clean shoes and a clean collar are the entire interview outfit.', 'Stylish', 'Style', 'Practical', ['stylish', 'shoes']),
  e('The funniest thing on a first day is how seriously you take the seating chart.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'school']),
  e('I will name the town that treated us like locals and the ones that did not.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who shares their lunch on your first day is a debt of honour.', 'Friendship', 'Support', 'Warm', ['friendship', 'lunch']),
  e('My grandmother cooked by feel and never once measured.', 'Family', 'Grandparents', 'Tender', ['family', 'cooking']),
  e('The first lunch alone in a new school is a specific kind of loneliness.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'school']),
  e('A shrine you can hear and not see is still a practice.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the recipe card in her handwriting.', 'Photography', 'Family', 'Tender', ['photography', 'recipe']),
  e('Get a puncture in a new town and you will meet three people.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'puncture']),
  e('A post about a first day gets more replies than a post about a promotion.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who asks for the recipe instead of the review.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'recipe']),
  e('I will not pretend the four moves were an adventure.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'honesty']),
  e('A new school in monsoon means wet socks and a wet register.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'school']),
  h('सुबह पाँच बजे का स्पीकर सेहत का सवाल है, श्रद्धा का नहीं।', 'Yoga and wellness', 'नींद', 'तीखा', ['स्पीकर', 'सेहत']),
  h('नए स्कूल के दिन दूसरी क़तार में बैठो, सब ठीक रहेगा।', 'Student life', 'स्कूल', 'व्यावहारिक', ['स्कूल', 'क़तार']),
  h('जो दुकान मालिक के एक दिन न आने पर भी चले, वही असली कारोबार है।', 'Professional and business', 'व्यवस्था', 'गंभीर', ['दुकान', 'कारोबार']),
  h('एक साफ़ स्टील डिब्बा रखो, काग़ज़ों की समस्या खत्म।', 'Home and interiors', 'व्यवस्था', 'व्यावहारिक', ['डिब्बा', 'काग़ज़ों']),
  h('दादी अंदाज़े से पकाती थीं, एक बार भी नाप नहीं लिया।', 'Family', 'दादा-दादी', 'कोमल', ['दादी', 'नाप']),
  h('नए स्कूल में अकेले खाया पहला दोपहर एक अलग तरह की तन्हाई है।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['दोपहर', 'तन्हाई']),
  g('Subah paanch baje ka speaker sehat ka sawaal hai, shraddha ka nahi.', 'Yoga and wellness', 'Sleep', 'Sharp', ['speaker', 'sehat']),
  g('Naye school ke din doosri kataar mein baitho, sab theek rahega.', 'Student life', 'School', 'Practical', ['school', 'kataar']),
  g('Jo dukaan malik ke ek din na aane par bhi chale, wahi asli karobar hai.', 'Professional and business', 'Systems', 'Wise', ['dukaan', 'karobar']),
  g('Ek saaf steel dibba rakho, kaagazon ki dikkat khatam ho jaati hai.', 'Home and interiors', 'Organising', 'Practical', ['dibba', 'kaagazon']),
  g('Dadi andaaze se pakaati thi, ek baar bhi naap nahi liya.', 'Family', 'Grandparents', 'Tender', ['dadi', 'naap']),
  g('Naye school mein akele khaaya pehla dopahar ek alag tarah ki tanhai hai.', 'Alone and loneliness', 'Solitude', 'Honest', ['dopahar', 'tanhai']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('तबादले का आदेश उस फ़ाइल में है जो कभी खुली ही नहीं।', 'Attitude', 'याद', 'शांत', ['तबादले', 'फ़ाइल']),
  h('तुम पंचर की दुकान तक साथ चलते हो, जैसे कोई रस्म हो।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['पंचर', 'रस्म']),
  h('पंचर की दुकान पर पूरी गली अपनी ख़बरें छोड़ जाती है।', 'Quotes and thoughts', 'मोहल्ला', 'कोमल', ['गली', 'ख़बरें']),
  h('तबादले के काग़ज़ संभालकर रखो, बच्चे कभी पूछेंगे।', 'Life and reality', 'परिवार', 'गंभीर', ['काग़ज़', 'पूछेंगे']),
  g('Tabadle ka aadesh us file mein hai jo kabhi khuli hi nahi.', 'Attitude', 'Memory', 'Quiet', ['tabadle', 'file']),
  g('Tum puncture ki dukaan tak saath chalte ho, jaise koi rasm ho.', 'Love and romance', 'Ordinary days', 'Tender', ['puncture', 'rasm']),
  g('Puncture ki dukaan par poori gali apni khabrein chhod jaati hai.', 'Quotes and thoughts', 'Community', 'Warm', ['gali', 'khabrein']),
  g('Tabadle ke kaagaz sambhalkar rakho, bachche kabhi poochenge.', 'Life and reality', 'Family', 'Wise', ['kaagaz', 'poochenge']),
  h('दुकान के बाहर टँगा पुराना टायर शहर की सबसे ईमानदार घड़ी है।', 'Aesthetic', 'शहर', 'सहज', ['टायर', 'घड़ी']),
];
