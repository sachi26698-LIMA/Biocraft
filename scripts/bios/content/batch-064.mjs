/**
 * BioCraft original bios — batch 064.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 32 HI / 34 HG.
 * New subject matter: the istri man who irons on the pavement, a stolen cycle,
 * the exam hall clock, a balcony that faces a wall, a chit fund that ended a
 * friendship, and learning that a scooter can be repaired but a trust cannot.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_064 = [
  /* ------------------------------------------------------------ Attitude */
  e('I keep the exact change for the man who irons on the pavement.', 'Attitude', 'Fairness', 'Practical', ['attitude', 'istri']),
  e('I report a stolen cycle and I do not accuse the boy who cleans it.', 'Attitude', 'Justice', 'Sharp', ['attitude', 'cycle']),
  e('I hand my paper in when the clock says so, finished or not.', 'Attitude', 'Discipline', 'Firm', ['attitude', 'exam']),
  h('पथरीले फुटपाथ पर इस्त्री करने वाले के लिए खुल्ले पैसे रखता हूँ।', 'Attitude', 'न्याय', 'व्यावहारिक', ['इस्त्री', 'पैसे']),
  h('जो पैसा मैं ख़ुद नहीं उधार देता, वो किसी दोस्त से नहीं माँगता।', 'Attitude', 'ईमानदारी', 'दृढ़', ['पैसा', 'दोस्त']),
  h('साइकिल चोरी की रिपोर्ट करता हूँ, और सफ़ाई करने वाले बच्चे पर इलज़ाम नहीं।', 'Attitude', 'न्याय', 'तीखा', ['साइकिल', 'इलज़ाम']),
  h('घड़ी का इशारा होते ही पर्चा दे देता हूँ, पूरा हो या न हो।', 'Attitude', 'अनुशासन', 'दृढ़', ['घड़ी', 'पर्चा']),
  g('Pathrile footpath par istri karne wale ke liye khulle paise rakhta hoon.', 'Attitude', 'Fairness', 'Practical', ['istri', 'paise']),
  g('Jo paisa main khud nahi udhaar deta, woh kisi dost se nahi maangta.', 'Attitude', 'Honesty', 'Firm', ['paisa', 'dost']),
  g('Cycle chori ki report karta hoon, aur safaai karne wale bachche par ilzaam nahi.', 'Attitude', 'Justice', 'Sharp', ['cycle', 'ilzaam']),
  g('Ghadi ka ishaara hote hi parcha de deta hoon, poora ho ya na ho.', 'Attitude', 'Discipline', 'Firm', ['ghadi', 'parcha']),

  /* ------------------------------------------------------------- Love */
  e('You iron my shirt better than the pavement man and charge me nothing.', 'Love and romance', 'Care', 'Warm', ['love', 'istri']),
  e('We paid into the same chit fund and it outlasted two of our fights.', 'Love and romance', 'Shared money', 'Warm', ['love', 'chit']),
  e('You sit with me in the exam hall corridor and read the same page twice.', 'Love and romance', 'Support', 'Tender', ['love', 'exam']),
  h('तुम मेरी कमीज़ फुटपाथ वाले से बेहतर इस्त्री करते हो और कुछ लेते नहीं।', 'Love and romance', 'परवाह', 'कोमल', ['कमीज़', 'इस्त्री']),
  h('हम दोनों ने एक ही चिट फंड में पैसा डाला, वो हमारे दो झगड़ों से ज़्यादा चला।', 'Love and romance', 'साझा पैसा', 'कोमल', ['फंड', 'पैसा']),
  h('तुम मेरे साथ परीक्षा भवन के बाहर बैठते हो और वही पन्ना दो बार पढ़ते हो।', 'Love and romance', 'साथ', 'कोमल', ['पन्ना', 'परीक्षा']),
  g('Tum meri kamiz footpath wale se behtar istri karte ho aur kuch lete nahi.', 'Love and romance', 'Care', 'Warm', ['kamiz', 'istri']),
  g('Hum dono ne ek hi chit fund mein paisa daala, woh humare do jhagdon se zyada chala.', 'Love and romance', 'Shared money', 'Warm', ['fund', 'paisa']),
  g('Tum mere saath pariksha bhavan ke bahar baithte ho aur wahi panna do baar padhte ho.', 'Love and romance', 'Support', 'Tender', ['panna', 'pariksha']),

  /* ------------------------------------------------------- Sad depth */
  e('My cycle was stolen the week I paid the last instalment on it.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'cycle']),
  e('The chit fund ended a friendship of eleven years over four thousand rupees.', 'Sad and heartbreak', 'Friends', 'Heavy', ['sad', 'chit']),
  e('My father ironed shirts on a pavement for six years and never once complained.', 'Sad and heartbreak', 'Parents', 'Aching', ['sad', 'istri']),
  e('The exam hall clock was four minutes fast and it cost me a page.', 'Sad and heartbreak', 'School', 'Honest', ['sad', 'exam']),
  h('मेरी साइकिल उसी हफ़्ते चोरी हुई जिस हफ़्ते आख़िरी क़िस्त दी थी।', 'Sad and heartbreak', 'पैसा', 'भारी', ['साइकिल', 'क़िस्त']),
  h('चार हज़ार रुपये पर ग्यारह साल की दोस्ती खत्म हो गई।', 'Sad and heartbreak', 'दोस्त', 'भारी', ['रुपये', 'दोस्ती']),
  h('पिताजी छह साल फुटपाथ पर कमीज़ें इस्त्री करते रहे, एक बार भी शिकायत नहीं की।', 'Sad and heartbreak', 'माँ-बाप', 'भावुक', ['इस्त्री', 'शिकायत']),
  g('Meri cycle usi hafte chori hui jis hafte aakhri qist di thi.', 'Sad and heartbreak', 'Money', 'Heavy', ['cycle', 'qist']),
  g('Chaar hazaar rupaye par gyarah saal ki dosti khatam ho gayi.', 'Sad and heartbreak', 'Friends', 'Heavy', ['rupaye', 'dosti']),
  g('Pitaji chhe saal footpath par kamizein istri karte rahe, ek baar bhi shikayat nahi ki.', 'Sad and heartbreak', 'Parents', 'Aching', ['istri', 'shikayat']),

  /* --------------------------------------------------------- Shayari */
  h('इस्त्री की भाप,\nसुबह छह बजे,\nपिता की आवाज़।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['भाप', 'पिता']),
  h('बालकनी है,\nदीवार है,\nआसमान भी है।', 'Shayari', 'तीन पंक्ति', 'सहज', ['बालकनी', 'आसमान']),
  g('Istri ki bhaap, subah chhe baje, pita ki awaaz.', 'Shayari', 'Two line', 'Aching', ['istri', 'awaaz']),
  g('Balcony hai, deewar hai, aasman bhi hai.', 'Shayari', 'Two line', 'Warm', ['balcony', 'aasman']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A chit fund is friendship with a ledger attached.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'chit']),
  e('Steam from an iron is the smell of somebody else getting ready.', 'Quotes and thoughts', 'Work', 'Warm', ['quotes', 'istri']),
  e('A balcony facing a wall teaches you to look up.', 'Quotes and thoughts', 'Home', 'Wise', ['quotes', 'balcony']),
  e('A stolen cycle costs money. A false accusation costs more.', 'Quotes and thoughts', 'Justice', 'Sharp', ['quotes', 'justice']),
  h('चिट फंड दोस्ती है, जिसके साथ एक बही खाता जुड़ा है।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['चिट', 'दोस्ती']),
  h('इस्त्री की भाप किसी और के तैयार होने की महक है।', 'Quotes and thoughts', 'काम', 'कोमल', ['भाप', 'महक']),
  h('दीवार के सामने वाली बालकनी ऊपर देखना सिखाती है।', 'Quotes and thoughts', 'घर', 'गंभीर', ['बालकनी', 'दीवार']),
  g('Chit fund dosti hai, jiske saath ek bahi khaata juda hai.', 'Quotes and thoughts', 'Money', 'Sharp', ['chit', 'dosti']),
  g('Istri ki bhaap kisi aur ke taiyaar hone ki mehak hai.', 'Quotes and thoughts', 'Work', 'Warm', ['bhaap', 'mehak']),
  g('Deewar ke saamne wali balcony oopar dekhna sikhaati hai.', 'Quotes and thoughts', 'Home', 'Wise', ['balcony', 'deewar']),

  /* ------------------------------------------------- Life and reality */
  e('Count the money in front of the man, not after he has gone.', 'Life and reality', 'Money', 'Practical', ['life', 'money']),
  e('Never join a chit fund with a friend you cannot afford to lose.', 'Life and reality', 'Money', 'Sharp', ['life', 'chit']),
  e('Keep the cycle receipt. It is the only proof you own it.', 'Life and reality', 'Money', 'Practical', ['life', 'cycle']),
  e('Sit with the clock in front of you during a three hour paper.', 'Life and reality', 'Exams', 'Practical', ['life', 'exam']),
  e('Grow something on a balcony that faces a wall. It will find the light.', 'Life and reality', 'Home', 'Warm', ['life', 'balcony']),
  h('पैसे उसी के सामने गिनो, जाने के बाद नहीं।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['पैसे', 'सामने']),
  h('ऐसे दोस्त के साथ चिट फंड में मत बैठो जिसे तुम खो नहीं सकते।', 'Life and reality', 'पैसा', 'तीखा', ['दोस्त', 'चिट']),
  h('साइकिल की रसीद रखो, वही तुम्हारा सबूत है।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['साइकिल', 'रसीद']),
  h('तीन घंटे के पर्चे में घड़ी सामने रखकर बैठो।', 'Life and reality', 'परीक्षा', 'व्यावहारिक', ['घड़ी', 'पर्चे']),
  g('Paise usi ke saamne gino, jaane ke baad nahi.', 'Life and reality', 'Money', 'Practical', ['paise', 'saamne']),
  g('Aise dost ke saath chit fund mein mat baitho jise tum kho nahi sakte.', 'Life and reality', 'Money', 'Sharp', ['dost', 'chit']),
  g('Cycle ki raseed rakho, wahi tumhara saboot hai.', 'Life and reality', 'Money', 'Practical', ['cycle', 'raseed']),
  g('Teen ghante ke parche mein ghadi saamne rakhkar baitho.', 'Life and reality', 'Exams', 'Practical', ['ghadi', 'parche']),

  /* ------------------------------------------------------ Motivational */
  e('Iron your own shirt once and you will tip the man properly.', 'Motivational', 'Empathy', 'Warm', ['motivation', 'empathy']),
  e('Losing your last instalment is not the same as losing the skill.', 'Motivational', 'Resilience', 'Direct', ['motivation', 'resilience']),
  e('A wall in front of you is still a wall with light on it at five.', 'Motivational', 'Hope', 'Warm', ['motivation', 'hope']),
  h('एक बार अपनी कमीज़ ख़ुद इस्त्री करो, फिर ठीक पैसे दोगे।', 'Motivational', 'समझ', 'कोमल', ['कमीज़', 'पैसे']),
  h('आख़िरी क़िस्त जाना और हुनर जाना, दोनों एक नहीं हैं।', 'Motivational', 'सब्र', 'स्पष्ट', ['क़िस्त', 'हुनर']),
  h('सामने दीवार हो तो भी पाँच बजे उस पर रोशनी होती है।', 'Motivational', 'उम्मीद', 'कोमल', ['दीवार', 'रोशनी']),
  g('Ek baar apni kamiz khud istri karo, phir theek paise doge.', 'Motivational', 'Empathy', 'Warm', ['kamiz', 'paise']),
  g('Aakhri qist jaana aur hunar jaana, dono ek nahi hain.', 'Motivational', 'Resilience', 'Direct', ['qist', 'hunar']),
  g('Saamne deewar ho toh bhi paanch baje us par roshni hoti hai.', 'Motivational', 'Hope', 'Warm', ['deewar', 'roshni']),

  /* -------------------------------------------------------- Aesthetic */
  e('A pressed shirt is the cheapest luxury in any wardrobe.', 'Aesthetic', 'Style', 'Practical', ['aesthetic', 'shirt']),
  h('इस्त्री की हुई कमीज़ अलमारी की सबसे सस्ती शान है।', 'Aesthetic', 'अंदाज़', 'व्यावहारिक', ['कमीज़', 'अलमारी']),
  h('दीवार के सामने वाली बालकनी में दो पौधे बगीचा बना देते हैं।', 'Aesthetic', 'घर', 'कोमल', ['बालकनी', 'पौधे']),
  g('Istri ki hui kamiz almari ki sabse sasti shaan hai.', 'Aesthetic', 'Style', 'Practical', ['kamiz', 'almari']),
  g('Deewar ke saamne wali balcony mein do paudhe bagicha bana dete hain.', 'Aesthetic', 'Home', 'Warm', ['balcony', 'paudhe']),

  /* ---------------------------------------------- Wider category band */
  e('Carrying an iron for six hours a day is a shoulder injury happening slowly.', 'Yoga and wellness', 'Body', 'Heavy', ['yoga', 'istri']),
  e('Solve the paper backwards if the last question is the easiest.', 'Student life', 'Exams', 'Practical', ['student', 'exams']),
  e('Every rupee of a chit fund needs a written name against it.', 'Professional and business', 'Money', 'Sharp', ['professional', 'money']),
  e('A fielder who watches the clock loses the run he was guarding.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'focus']),
  e('Keep the cycle lock better than the cycle. The lock is cheaper.', 'Cars and bikes', 'Security', 'Practical', ['cars', 'lock']),
  e('A shirt that is pressed looks new. Nobody checks the receipt.', 'Fashion and beauty', 'Style', 'Practical', ['fashion', 'shirt']),
  e('Write the exam schedule into the calendar with alarms, not into your head.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'reminders']),
  e('Write the instalment date on the receipt and the dispute disappears.', 'Science and curiosity', 'Rigor', 'Practical', ['science', 'rigor']),
  e('Never take a rupee from a customer you have not invoiced.', 'Startup and hustle', 'Ethics', 'Sharp', ['startup', 'ethics']),
  e('Two good shirts, pressed, and you need no third.', 'Minimal', 'Wardrobe', 'Practical', ['minimal', 'shirts']),
  e('A pressed shirt and an unpressed face is the whole job interview.', 'Stylish', 'Style', 'Wry', ['stylish', 'shirt']),
  e('The funniest queue is the one at the ironing man on a Monday morning.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'istri']),
  e('I will say the amount out loud, because silence is where friendships die.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who returns borrowed money without being asked is rare.', 'Friendship', 'Trust', 'Warm', ['friendship', 'trust']),
  e('My father never let me iron my own shirt until I was sixteen.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Standing at a wall-facing window is its own small prayer.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the ironing man hands before the light changes.', 'Photography', 'Work', 'Warm', ['photography', 'hands']),
  e('Walk a new city at six in the morning and you will see who feeds it.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'morning']),
  e('A post about a stolen cycle gets more replies than a post about a new one.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who keeps the receipt for everything over a thousand.', 'Personality and identity', 'Identity', 'Practical', ['personality', 'receipt']),
  e('I will not accuse the cleaner to save myself a hundred rupees.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'justice']),
  h('रोज़ छह घंटे इस्त्री उठाना कंधे की चोट है, धीरे-धीरे होती हुई।', 'Yoga and wellness', 'शरीर', 'भारी', ['इस्त्री', 'कंधे']),
  h('चिट फंड के हर रुपये के सामने एक नाम लिखा होना चाहिए।', 'Professional and business', 'पैसा', 'तीखा', ['रुपये', 'नाम']),
  h('ताला साइकिल से महंगा न हो तो भी बेहतर होना चाहिए।', 'Cars and bikes', 'सुरक्षा', 'व्यावहारिक', ['ताला', 'साइकिल']),
  h('दीवार के सामने वाला कमरा सस्ता भी है और रहने लायक भी।', 'Home and interiors', 'किराया', 'व्यावहारिक', ['कमरा', 'दीवार']),
  h('पिताजी ने सोलह साल तक मुझे अपनी कमीज़ ख़ुद इस्त्री नहीं करने दी।', 'Family', 'माँ-बाप', 'कोमल', ['पिताजी', 'कमीज़']),
  h('सुबह छह बजे नया शहर पैदल देखो, पता चलेगा इसे कौन खिलाता है।', 'Travel and adventure', 'शहर', 'कोमल', ['शहर', 'सुबह']),
  g('Roz chhe ghante istri uthana kandhe ki chot hai, dheere-dheere hoti hui.', 'Yoga and wellness', 'Body', 'Heavy', ['istri', 'kandhe']),
  g('Chit fund ke har rupaye ke saamne ek naam likha hona chahiye.', 'Professional and business', 'Money', 'Sharp', ['rupaye', 'naam']),
  g('Tala cycle se mehnga na ho toh bhi behtar hona chahiye.', 'Cars and bikes', 'Security', 'Practical', ['tala', 'cycle']),
  g('Deewar ke saamne wala kamra sasta bhi hai aur rehne laayak bhi.', 'Home and interiors', 'Rent', 'Practical', ['kamra', 'deewar']),
  g('Pitaji ne solah saal tak mujhe apni kamiz khud istri nahi karne di.', 'Family', 'Parents', 'Tender', ['pitaji', 'kamiz']),
  g('Subah chhe baje naya shehar paidal dekho, pata chalega ise kaun khilaata hai.', 'Travel and adventure', 'Cities', 'Warm', ['shehar', 'subah']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('जो पैसा मैं ख़ुद उधार नहीं देता, वो किसी से माँगना ठीक नहीं।', 'Attitude', 'ईमानदारी', 'दृढ़', ['पैसा', 'माँगना']),
  h('बारिश शुरू होते ही फुटपाथ की इस्त्री रुक जाती है, और कमाई भी।', 'Monsoon and seasons', 'बारिश', 'भारी', ['बारिश', 'कमाई']),
  g('Jo paisa main khud udhaar nahi deta, woh kisi se maangna theek nahi.', 'Attitude', 'Honesty', 'Firm', ['paisa', 'maangna']),
  g('Deewar ke saamne wali balcony se hum usi par sooraj doobta dekhte hain.', 'Love and romance', 'Ordinary days', 'Warm', ['balcony', 'sooraj']),
  g('Deewar wali balcony mein do gamle daalo, bagicha ban jaati hai.', 'Aesthetic', 'Home', 'Warm', ['gamle', 'bagicha']),
  g('Baarish shuru hote hi footpath ki istri ruk jaati hai, aur kamai bhi.', 'Monsoon and seasons', 'Rain', 'Heavy', ['baarish', 'kamai']),
];
