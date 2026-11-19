/**
 * BioCraft original bios — batch 040.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_040 = [
  /* ------------------------------------------------------------ Attitude */
  e('I do not lower my voice to make other people comfortable with theirs.', 'Attitude', 'Self-possession', 'Firm', ['attitude', 'voice']),
  e('Being unbothered is a skill, not a personality.', 'Attitude', 'Composure', 'Wise', ['attitude', 'composure']),
  e('I will take the slow road if it means I keep my word.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'word']),
  e('I have outgrown the need to be the most interesting person present.', 'Attitude', 'Maturity', 'Composed', ['attitude', 'maturity']),
  h('दूसरों को आराम देने के लिए अपनी आवाज़ नहीं दबाता।', 'Attitude', 'स्वाभिमान', 'दृढ़', ['आवाज़', 'आराम']),
  h('बेफ़िक्र रहना हुनर है, स्वभाव नहीं।', 'Attitude', 'संयम', 'गंभीर', ['बेफ़िक्र', 'हुनर']),
  h('धीमा रास्ता लूँगा, पर अपनी बात निभाऊँगा।', 'Attitude', 'ईमानदारी', 'दृढ़', ['रास्ता', 'निभाऊँगा']),
  g('Doosron ko aaram dene ke liye apni awaaz nahi dabata.', 'Attitude', 'Self-possession', 'Firm', ['awaaz', 'aaram']),
  g('Befikr rehna hunar hai, swabhav nahi.', 'Attitude', 'Composure', 'Wise', ['befikr', 'hunar']),
  g('Dheema raasta loonga, par apni baat nibhaunga.', 'Attitude', 'Integrity', 'Firm', ['raasta', 'nibhaunga']),

  /* ------------------------------------------------------------- Love */
  e('You are the person I want to be tired next to.', 'Love and romance', 'Closeness', 'Tender', ['love', 'tired']),
  e('We are each other quiet place in a loud city.', 'Love and romance', 'Refuge', 'Warm', ['love', 'quiet']),
  e('I love the way you talk to street dogs and strangers.', 'Love and romance', 'Character', 'Warm', ['love', 'kindness']),
  e('Marry the person who makes running errands feel reasonable.', 'Love and romance', 'Real love', 'Wry', ['love', 'errands']),
  h('तुम वो हो जिसके पास थके हुए भी रहना अच्छा लगता है।', 'Love and romance', 'अपनापन', 'कोमल', ['थके', 'पास']),
  h('शोर भरे शहर में हम एक-दूसरे की खामोशी हैं।', 'Love and romance', 'पनाह', 'कोमल', ['शोर', 'खामोशी']),
  h('तुम कुत्तों और अजनबियों से जैसे बात करते हो, वो पसंद है।', 'Love and romance', 'चरित्र', 'कोमल', ['बात', 'पसंद']),
  g('Tum woh ho jiske paas thake hue bhi rehna accha lagta hai.', 'Love and romance', 'Closeness', 'Tender', ['thake', 'paas']),
  g('Shor bhare shehar mein hum ek-doosre ki khaamoshi hain.', 'Love and romance', 'Refuge', 'Warm', ['shor', 'khaamoshi']),
  g('Kaam se thake ghar lauto toh tumhari awaaz pehle sunai deti hai.', 'Love and romance', 'Character', 'Warm', ['kaam', 'awaaz']),

  /* ------------------------------------------------------- Sad depth */
  e('I have learned to sit with a bad evening without calling it a life.', 'Sad and heartbreak', 'Perspective', 'Wise', ['sad', 'evening']),
  e('The last conversation keeps rewriting itself in my head.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'conversation']),
  e('I gave the best version of me to someone who kept score.', 'Sad and heartbreak', 'Betrayal', 'Heavy', ['sad', 'betrayal']),
  e('Not every ending has a lesson. Some are just endings.', 'Sad and heartbreak', 'Grief', 'Honest', ['sad', 'ending']),
  h('एक बुरी शाम को ज़िंदगी कहे बिना बैठना सीख लिया है।', 'Sad and heartbreak', 'नज़रिया', 'गंभीर', ['शाम', 'ज़िंदगी']),
  h('आख़िरी बातचीत दिमाग़ में खुद को फिर से लिखती रहती है।', 'Sad and heartbreak', 'याद', 'भावुक', ['बातचीत', 'दिमाग़']),
  h('मैंने अपना सबसे अच्छा रूप उसे दिया जो हिसाब रखता था।', 'Sad and heartbreak', 'धोखा', 'भारी', ['रूप', 'हिसाब']),
  g('Ek buri shaam ko zindagi kahe bina baithna seekh liya hai.', 'Sad and heartbreak', 'Perspective', 'Wise', ['shaam', 'zindagi']),
  g('Aakhiri baatcheet dimaag mein khud ko phir se likhti rehti hai.', 'Sad and heartbreak', 'Memory', 'Aching', ['baatcheet', 'dimaag']),
  g('Maine apna sabse accha roop use diya jo hisaab rakhta tha.', 'Sad and heartbreak', 'Betrayal', 'Heavy', ['roop', 'hisaab']),

  /* --------------------------------------------------------- Shayari */
  h('तेरे बिना\nचाय ठंडी हो गई,\nऔर मैं देखता रहा।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['चाय', 'बिना']),
  h('मैंने दुआ\nनहीं माँगी,\nबस नाम लिया।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['दुआ', 'नाम']),
  h('तेरे हाथों\nकी गर्मी\nअब भी याद है।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['हाथ', 'गर्मी']),
  g('Tere bina chai thandi ho gayi, aur main dekhta raha.', 'Shayari', 'Two line', 'Aching', ['chai', 'thandi']),
  g('Maine dua nahi maangi, bas naam liya.', 'Shayari', 'Two line', 'Deep', ['dua', 'naam']),
  g('Tere haathon ki garmi ab bhi yaad hai.', 'Shayari', 'Two line', 'Romantic', ['haathon', 'garmi']),

  /* -------------------------------------------------- Quotes and ideas */
  e('Consistency is a kindness you do for the person you will become.', 'Quotes and thoughts', 'Discipline', 'Wise', ['quotes', 'consistency']),
  e('Nobody owes you their attention. Earn the second minute.', 'Quotes and thoughts', 'Craft', 'Direct', ['quotes', 'attention']),
  e('If you would not say it to their face, do not type it.', 'Quotes and thoughts', 'Speech', 'Sharp', ['quotes', 'speech']),
  e('The best compliment is remembering a small detail.', 'Quotes and thoughts', 'Kindness', 'Warm', ['quotes', 'detail']),
  h('निरंतरता उस इंसान के लिए दया है जो तुम बन रहे हो।', 'Quotes and thoughts', 'अनुशासन', 'गंभीर', ['निरंतरता', 'दया']),
  h('सामने बोलने की हिम्मत न हो तो लिखो मत।', 'Quotes and thoughts', 'बोली', 'तीखा', ['हिम्मत', 'लिखो']),
  h('सबसे अच्छी तारीफ़ छोटी सी बात याद रखना है।', 'Quotes and thoughts', 'दया', 'कोमल', ['तारीफ़', 'याद']),
  g('Nirantarta us insaan ke liye daya hai jo tum ban rahe ho.', 'Quotes and thoughts', 'Discipline', 'Wise', ['nirantarta', 'daya']),
  g('Saamne bolne ki himmat na ho toh likho mat.', 'Quotes and thoughts', 'Speech', 'Sharp', ['himmat', 'likho']),
  g('Sabse achhi taarif chhoti si baat yaad rakhna hai.', 'Quotes and thoughts', 'Kindness', 'Warm', ['taarif', 'yaad']),

  /* ------------------------------------------------- Life and reality */
  e('You cannot fix your life in one weekend, but you can start.', 'Life and reality', 'Reality', 'Direct', ['life', 'start']),
  e('Being busy is not a personality and not a defence.', 'Life and reality', 'Busyness', 'Sharp', ['life', 'busy']),
  e('Get the boring paperwork done. It is the kindest thing for future you.', 'Life and reality', 'Adulting', 'Practical', ['life', 'paperwork']),
  e('A good listener is better company than a good talker.', 'Life and reality', 'People', 'Warm', ['life', 'listening']),
  h('ज़िंदगी एक वीकेंड में ठीक नहीं होती, पर शुरू हो सकती है।', 'Life and reality', 'हकीकत', 'स्पष्ट', ['ज़िंदगी', 'वीकेंड']),
  h('व्यस्त रहना न पहचान है, न बचाव।', 'Life and reality', 'व्यस्तता', 'तीखा', ['व्यस्त', 'बचाव']),
  h('उबाऊ काग़ज़ी काम निपटा दो, यही सबसे बड़ी दया है।', 'Life and reality', 'बड़ी उम्र', 'व्यावहारिक', ['काग़ज़ी', 'दया']),
  g('Zindagi ek weekend mein theek nahi hoti, par shuru ho sakti hai.', 'Life and reality', 'Reality', 'Direct', ['zindagi', 'theek']),
  g('Vyast rehna na pehchan hai, na bachav.', 'Life and reality', 'Busyness', 'Sharp', ['vyast', 'pehchan']),
  g('Ubaau kaagzi kaam nipata do, yahi sabse badi daya hai.', 'Life and reality', 'Adulting', 'Practical', ['kaagzi', 'daya']),

  /* ------------------------------------------------------ Motivational */
  e('Your future self is watching what you do with this hour.', 'Motivational', 'Purpose', 'Direct', ['motivation', 'hour']),
  e('Make it smaller, then make it again.', 'Motivational', 'Craft', 'Wise', ['motivation', 'craft']),
  e('You are allowed to start again without explaining the last attempt.', 'Motivational', 'Restart', 'Warm', ['motivation', 'restart']),
  h('तुम्हारा भविष्य इस घंटे को देख रहा है।', 'Motivational', 'मक़सद', 'स्पष्ट', ['भविष्य', 'घंटे']),
  h('पहले छोटा करो, फिर दोबारा करो।', 'Motivational', 'कला', 'गंभीर', ['छोटा', 'दोबारा']),
  g('Tumhara bhavishya is ghante ko dekh raha hai.', 'Motivational', 'Purpose', 'Direct', ['bhavishya', 'ghante']),
  g('Pehle chhota karo, phir dobara karo.', 'Motivational', 'Craft', 'Wise', ['chhota', 'dobara']),

  /* -------------------------------------------------------- Aesthetic */
  e('A tilted frame on the wall is better than an empty nail.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'frames']),
  e('Cloth napkins make ordinary food feel considered.', 'Aesthetic', 'Table', 'Warm', ['aesthetic', 'table']),
  e('Clear the counter and the day feels shorter.', 'Aesthetic', 'Kitchen', 'Practical', ['aesthetic', 'kitchen']),
  h('दीवार पर तिरछा फ़्रेम खाली कील से बेहतर है।', 'Aesthetic', 'घर', 'कोमल', ['फ़्रेम', 'दीवार']),
  h('कपड़े के नैपकिन साधारण खाने को ख़ास बना देते हैं।', 'Aesthetic', 'मेज़', 'कोमल', ['नैपकिन', 'खाने']),
  g('Deewar par tirchha frame khaali keel se behtar hai.', 'Aesthetic', 'Home', 'Warm', ['frame', 'deewar']),
  g('Kapde ke napkin saadharan khaane ko khaas bana dete hain.', 'Aesthetic', 'Table', 'Warm', ['napkin', 'khaane']),

  /* ----------------------------------------------- Royal and creator */
  e('Good posture is free and does most of the work.', 'Royal and VIP', 'Bearing', 'Poised', ['royal', 'posture']),
  e('Do not rush a room. Let it come to you.', 'Royal and VIP', 'Presence', 'Poised', ['royal', 'presence']),
  e('Be the account people trust before the numbers grow.', 'Creator and influencer', 'Trust', 'Firm', ['creator', 'trust']),
  e('Post what you would still defend in six months.', 'Creator and influencer', 'Integrity', 'Firm', ['creator', 'integrity']),
  h('सीधी कमर मुफ़्त है और आधा काम खुद कर देती है।', 'Royal and VIP', 'गरिमा', 'शांत', ['कमर', 'काम']),
  h('किसी कमरे में हड़बड़ी मत करो, उसे खुद आने दो।', 'Royal and VIP', 'मौजूदगी', 'शांत', ['कमरे', 'हड़बड़ी']),
  g('Seedhi kamar muft hai aur aadha kaam khud kar deti hai.', 'Royal and VIP', 'Bearing', 'Poised', ['kamar', 'kaam']),
  g('Kisi kamre mein hadbadi mat karo, use khud aane do.', 'Royal and VIP', 'Presence', 'Poised', ['kamre', 'hadbadi']),
  g('Woh account bano jispar log bharosa karein, numbers badhne se pehle.', 'Creator and influencer', 'Trust', 'Firm', ['account', 'bharosa']),

  /* --------------------------------------------------- Mid-field top-up */
  e('Write one line a day and the year has a spine.', 'Poetry', 'Habit', 'Warm', ['poetry', 'habit']),
  e('Reread a favourite paragraph instead of starting a new book.', 'Books and reading', 'Rereading', 'Wise', ['books', 'paragraph']),
  e('Taste as you cook and you will need no recipe twice.', 'Food and cooking', 'Technique', 'Practical', ['food', 'taste']),
  e('Take the stairs and count it as a workout.', 'Fitness', 'Everyday', 'Practical', ['fitness', 'stairs']),
  e('A photograph of your own kitchen is a photograph of your life.', 'Photography', 'Home', 'Warm', ['photography', 'home']),
  e('Learn the harmonium scale and every song becomes friendly.', 'Music and art', 'Learning', 'Practical', ['music', 'learning']),
  e('Talk to the plants. Nobody is judging and they like the air anyway.', 'Nature', 'Plants', 'Wry', ['nature', 'plants']),
  e('A film you can quote is a film you have lived with.', 'Cinema and OTT', 'Fandom', 'Warm', ['cinema', 'quotes']),
  e('Keep a dry bag for your phone and monsoon stops being a threat.', 'Monsoon and seasons', 'Rain', 'Practical', ['monsoon', 'rain']),
  e('Carry a book for the delay and the journey becomes a bonus.', 'Travel and adventure', 'Journeys', 'Warm', ['travel', 'book']),
  h('रोज़ एक पंक्ति लिखो, साल को रीढ़ मिल जाएगी।', 'Poetry', 'आदत', 'कोमल', ['पंक्ति', 'साल']),
  h('सीढ़ियाँ चढ़ो और उसे कसरत मान लो।', 'Fitness', 'आदत', 'व्यावहारिक', ['सीढ़ियाँ', 'कसरत']),
  h('पौधों से बात करो, कोई जज नहीं कर रहा।', 'Nature', 'पौधे', 'सहज', ['पौधों', 'बात']),
  h('देरी के लिए किताब रखो, सफ़र बोनस बन जाएगा।', 'Travel and adventure', 'सफ़र', 'कोमल', ['किताब', 'सफ़र']),
  g('Roz ek pankti likho, saal ko reedh mil jayegi.', 'Poetry', 'Habit', 'Warm', ['pankti', 'saal']),
  g('Dhang se seedhiyan chadho, kasrat ho jayegi.', 'Fitness', 'Everyday', 'Practical', ['seedhiyan', 'kasrat']),
  g('Paudhon se baat karo, koi judge nahi kar raha.', 'Nature', 'Plants', 'Wry', ['paudhon', 'baat']),
  g('Deri ke liye kitaab rakho, safar bonus ban jayega.', 'Travel and adventure', 'Journeys', 'Warm', ['kitaab', 'safar']),
];
