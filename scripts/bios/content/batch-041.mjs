/**
 * BioCraft original bios — batch 041.
 * Wide category spread, strict 40/30/30.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_041 = [
  /* ------------------------------------------------------------ Attitude */
  e('I do not negotiate with my own boundaries.', 'Attitude', 'Boundaries', 'Firm', ['attitude', 'boundaries']),
  e('Politeness is a door. Not a welcome mat.', 'Attitude', 'Distance', 'Sharp', ['attitude', 'polite']),
  e('I am not hard to read. I am just not for everyone.', 'Attitude', 'Identity', 'Composed', ['attitude', 'identity']),
  e('Some rooms are better left exactly as they found me.', 'Attitude', 'Dignity', 'Dry', ['attitude', 'dignity']),
  h('अपनी सीमाओं से मोल-भाव नहीं करता।', 'Attitude', 'सीमाएं', 'दृढ़', ['सीमाओं', 'मोल']),
  h('अदब दरवाज़ा है, पायदान नहीं।', 'Attitude', 'दूरी', 'तीखा', ['अदब', 'दरवाज़ा']),
  h('मेरा मिज़ाज साफ़ है; उसे समझने के लिए शब्दकोश नहीं चाहिए।', 'Attitude', 'पहचान', 'शांत', ['मिज़ाज', 'शब्दकोश']),
  g('Apni seemaon se mol-bhaav nahi karta.', 'Attitude', 'Boundaries', 'Firm', ['seemaon', 'mol']),
  g('Adab darwaza hai, paydaan nahi.', 'Attitude', 'Distance', 'Sharp', ['adab', 'darwaza']),
  g('Mera mizaaj saaf hai; use samajhne ke liye shabdkosh nahi chahiye.', 'Attitude', 'Identity', 'Composed', ['mizaaj', 'shabdkosh']),

  /* ------------------------------------------------------------- Love */
  e('You are my favourite habit and the only one I defend.', 'Love and romance', 'Devotion', 'Tender', ['love', 'habit']),
  e('We make a boring Saturday feel like a small festival.', 'Love and romance', 'Everyday', 'Warm', ['love', 'saturday']),
  e('I want to know what you think about at traffic signals.', 'Love and romance', 'Curiosity', 'Warm', ['love', 'curiosity']),
  h('तुम मेरी पसंदीदा आदत हो, और वही एक जिसे मैं बचाता हूँ।', 'Love and romance', 'समर्पण', 'कोमल', ['आदत', 'बचाता']),
  h('तुम्हारे साथ सादा शनिवार भी छोटा त्योहार लगता है।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['शनिवार', 'त्योहार']),
  g('Tum meri pasandida aadat ho, aur wahi ek jise main bachata hoon.', 'Love and romance', 'Devotion', 'Tender', ['aadat', 'bachata']),
  g('Tumhare saath saada shanivaar bhi chhota tyohaar lagta hai.', 'Love and romance', 'Everyday', 'Warm', ['shanivaar', 'tyohaar']),

  /* ------------------------------------------------------- Sad depth */
  e('I keep my grief on a schedule so it does not interrupt work.', 'Sad and heartbreak', 'Grief', 'Heavy', ['sad', 'grief']),
  e('You left and the furniture stayed exactly where it was.', 'Sad and heartbreak', 'Absence', 'Quiet', ['sad', 'absence']),
  e('I do not miss you. I miss being easy to love.', 'Sad and heartbreak', 'Self-worth', 'Honest', ['sad', 'worth']),
  h('ग़म का एक टाइम-टेबल बना रखा है, ताकि काम न रुके।', 'Sad and heartbreak', 'शोक', 'भारी', ['ग़म', 'टाइम-टेबल']),
  h('तुम गए, और फ़र्नीचर वहीं खड़ा रहा।', 'Sad and heartbreak', 'ग़ैरमौजूदगी', 'शांत', ['फ़र्नीचर', 'खड़ा']),
  g('Gham ka ek time-table bana rakha hai, taaki kaam na ruke.', 'Sad and heartbreak', 'Grief', 'Heavy', ['gham', 'kaam']),
  g('Tum gaye, aur furniture wahin khada raha.', 'Sad and heartbreak', 'Absence', 'Quiet', ['gaye', 'khada']),

  /* --------------------------------------------------------- Shayari */
  h('तेरी आँखों में\nशहर बसा था,\nमैं रास्ता भूल गया।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['आँखों', 'रास्ता']),
  h('कुछ लोग\nकिताब की तरह होते हैं,\nदोबारा पढ़ने पर बदल जाते हैं।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['किताब', 'दोबारा']),
  h('मैं थका हूँ,\nपर मेरा हौसला\nअभी जवान है।', 'Shayari', 'तीन पंक्ति', 'दृढ़', ['थका', 'हौसला']),
  g('Teri aankhon mein shehar basa tha, main raasta bhool gaya.', 'Shayari', 'Two line', 'Romantic', ['aankhon', 'raasta']),
  g('Kuch log kitaab ki tarah hote hain, dobara padhne par badal jaate hain.', 'Shayari', 'Two line', 'Deep', ['kitaab', 'dobara']),
  g('Main thaka hoon, par mera hausla abhi jawaan hai.', 'Shayari', 'Two line', 'Firm', ['thaka', 'hausla']),

  /* -------------------------------------------------- Quotes and ideas */
  e('You cannot learn taste from a trend.', 'Quotes and thoughts', 'Taste', 'Sharp', ['quotes', 'taste']),
  e('Every apology has a price and the brave ones pay it.', 'Quotes and thoughts', 'Honesty', 'Wise', ['quotes', 'apology']),
  e('If your plan needs luck twice, it is not a plan.', 'Quotes and thoughts', 'Planning', 'Direct', ['quotes', 'plan']),
  e('A person who reads is never fully alone.', 'Quotes and thoughts', 'Reading', 'Warm', ['quotes', 'reading']),
  h('पसंद किसी ट्रेंड से नहीं सीखी जाती।', 'Quotes and thoughts', 'पसंद', 'तीखा', ['ट्रेंड', 'सीखी']),
  h('हर माफ़ी की क़ीमत होती है, बहादुर भर देते हैं।', 'Quotes and thoughts', 'ईमानदारी', 'गंभीर', ['माफ़ी', 'क़ीमत']),
  h('जिस योजना को दो बार किस्मत चाहिए, वो योजना नहीं।', 'Quotes and thoughts', 'योजना', 'स्पष्ट', ['योजना', 'किस्मत']),
  g('Pasand kisi trend se nahi seekhi jaati.', 'Quotes and thoughts', 'Taste', 'Sharp', ['pasand', 'trend']),
  g('Har maafi ki keemat hoti hai, bahadur bhar dete hain.', 'Quotes and thoughts', 'Honesty', 'Wise', ['maafi', 'keemat']),
  g('Jis yojana ko do baar kismat chahiye, woh yojana nahi.', 'Quotes and thoughts', 'Planning', 'Direct', ['yojana', 'kismat']),

  /* ------------------------------------------------- Life and reality */
  e('You will change your mind about your own life. That is growth.', 'Life and reality', 'Change', 'Warm', ['life', 'growth']),
  e('Some problems are solved by a walk and a glass of water.', 'Life and reality', 'Reality', 'Practical', ['life', 'walk']),
  e('Being kind to your parents late is still being kind.', 'Life and reality', 'Family', 'Warm', ['life', 'family']),
  e('Nobody becomes interesting without losing an argument once.', 'Life and reality', 'People', 'Wise', ['life', 'argument']),
  h('अपनी ही ज़िंदगी के बारे में मन बदलना तरक्की है।', 'Life and reality', 'बदलाव', 'कोमल', ['ज़िंदगी', 'तरक्की']),
  h('कुछ दिक्कतें टहलने और पानी से हल हो जाती हैं।', 'Life and reality', 'हकीकत', 'व्यावहारिक', ['दिक्कतें', 'टहलने']),
  h('देर से सही बर्ताव भी सही बर्ताव ही है।', 'Life and reality', 'परिवार', 'कोमल', ['बर्ताव', 'सही']),
  g('Apni hi zindagi ke baare mein man badalna taraqqi hai.', 'Life and reality', 'Change', 'Warm', ['zindagi', 'taraqqi']),
  g('Kuch dikkatein tehalne aur paani se hal ho jaati hain.', 'Life and reality', 'Reality', 'Practical', ['dikkatein', 'tehalne']),
  g('Der se sahi bartaav bhi sahi bartaav hi hai.', 'Life and reality', 'Family', 'Warm', ['bartaav', 'sahi']),

  /* ------------------------------------------------------ Motivational */
  e('Nobody starts well. They start and then get well.', 'Motivational', 'Starting', 'Direct', ['motivation', 'starting']),
  e('Do the thing that makes tomorrow lighter.', 'Motivational', 'Discipline', 'Warm', ['motivation', 'tomorrow']),
  e('Skill is just repetition that survived boredom.', 'Motivational', 'Craft', 'Wise', ['motivation', 'skill']),
  h('कोई अच्छा नहीं शुरू करता, शुरू करके अच्छा होता है।', 'Motivational', 'शुरुआत', 'स्पष्ट', ['शुरू', 'अच्छा']),
  h('वो काम करो जो कल को हल्का कर दे।', 'Motivational', 'अनुशासन', 'कोमल', ['काम', 'हल्का']),
  g('Koi accha nahi shuru karta, shuru karke accha hota hai.', 'Motivational', 'Starting', 'Direct', ['shuru', 'accha']),
  g('Woh kaam karo jo kal ko halka kar de.', 'Motivational', 'Discipline', 'Warm', ['kaam', 'halka']),

  /* -------------------------------------------------------- Aesthetic */
  e('Let one wall stay empty and the room will breathe.', 'Aesthetic', 'Space', 'Composed', ['aesthetic', 'space']),
  e('A good tumbler makes water feel like a choice.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'objects']),
  h('एक दीवार खाली रहने दो, कमरा साँस लेगा।', 'Aesthetic', 'जगह', 'शांत', ['दीवार', 'कमरा']),
  h('अच्छा गिलास पानी को भी चुनाव जैसा बना देता है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['गिलास', 'चुनाव']),
  g('Ek deewar khaali chhodo, poora kamra saans lega.', 'Aesthetic', 'Space', 'Composed', ['deewar', 'saans']),
  g('Accha glass paani ko bhi chunav jaisa bana deta hai.', 'Aesthetic', 'Objects', 'Warm', ['glass', 'chunav']),

  /* ------------------------------------------------ Wider category band */
  e('The body keeps a record even when the mind forgets.', 'Yoga and wellness', 'Awareness', 'Wise', ['yoga', 'body']),
  e('Breathe out longer than you breathe in and the panic loosens.', 'Yoga and wellness', 'Breath', 'Practical', ['yoga', 'breath']),
  e('A syllabus is not a personality. Do the work anyway.', 'Student life', 'Exams', 'Wry', ['student', 'exams']),
  e('Sleep is a study technique, not a reward.', 'Student life', 'Habits', 'Practical', ['student', 'sleep']),
  e('Reply to the email before you finish the paragraph.', 'Professional and business', 'Habits', 'Direct', ['professional', 'email']),
  e('A good manager makes themselves unnecessary by Friday.', 'Professional and business', 'Leadership', 'Wise', ['professional', 'leadership']),
  e('I play for the ending, not the kill count.', 'Gaming profiles', 'Story', 'Wry', ['gaming', 'story']),
  e('A late wicket is worth more than a loud fifty.', 'Cricket and sports', 'Cricket', 'Wise', ['cricket', 'patience']),
  e('A clean engine is better than a loud exhaust.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'maintenance']),
  e('Comfort first and confidence follows.', 'Fashion and beauty', 'Style', 'Practical', ['fashion', 'comfort']),
  e('Say sorry to your child properly. They are learning from you.', 'Parenting', 'Respect', 'Warm', ['parenting', 'respect']),
  e('Feed people before the photographs. Always.', 'Wedding and celebration', 'Hosting', 'Warm', ['wedding', 'hosting']),
  e('Learn to say the simple thing simply.', 'Technology and coding', 'Craft', 'Wise', ['tech', 'simplicity']),
  e('Ask why twice and the answer gets honest.', 'Science and curiosity', 'Method', 'Wise', ['science', 'curiosity']),
  e('Ship something small and ugly this week.', 'Startup and hustle', 'Shipping', 'Direct', ['startup', 'shipping']),
  e('A home is a set of sounds you can recognise blindfolded.', 'Home and interiors', 'Home', 'Warm', ['home', 'sounds']),
  e('Two good objects are enough for a shelf.', 'Minimal', 'Simplicity', 'Composed', ['minimal', 'shelf']),
  e('One good jacket solves most of your wardrobe.', 'Stylish', 'Wardrobe', 'Practical', ['stylish', 'jacket']),
  e('I laugh at myself first and take the pressure off the room.', 'Funny and comedy', 'Self-deprecation', 'Wry', ['funny', 'laugh']),
  e('I would rather be clear than be liked.', 'Savage and bold', 'Directness', 'Sharp', ['savage', 'clear']),
  e('Some feelings are better written than spoken.', 'Deep and emotional', 'Depth', 'Tender', ['deep', 'writing']),
  e('My feed is a notebook, not a billboard.', 'Instagram profiles', 'Approach', 'Wry', ['instagram', 'notebook']),
  e('I am quiet until I am sure, and then I am loud.', 'Personality and identity', 'Identity', 'Wry', ['personality', 'identity']),
  e('I stopped proving I was enough and started deciding it.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'worth']),
  e('Home is the one place where I do not rehearse myself.', 'Family', 'Belonging', 'Warm', ['family', 'home']),
  e('A friend who reads your message twice is a rare thing.', 'Friendship', 'Loyalty', 'Warm', ['friendship', 'loyalty']),
  e('Alone and lonely are two different rooms. I know both.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'solitude']),
  e('Fear has a voice. Training has a louder one.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('A tree does nothing useful all day and still changes the street.', 'Nature', 'Trees', 'Wry', ['nature', 'trees']),
  h('मन भूल जाए तब भी शरीर याद रखता है।', 'Yoga and wellness', 'जागरूकता', 'गंभीर', ['शरीर', 'याद']),
  h('साँस छोड़ो लंबी, घबराहट ढीली पड़ जाएगी।', 'Yoga and wellness', 'साँस', 'व्यावहारिक', ['साँस', 'घबराहट']),
  h('सिलेबस पहचान नहीं होता, फिर भी काम करो।', 'Student life', 'परीक्षा', 'सहज', ['सिलेबस', 'काम']),
  h('मैं अंत के लिए खेलता हूँ, किल की गिनती के लिए नहीं।', 'Gaming profiles', 'कहानी', 'सहज', ['खेलता', 'गिनती']),
  h('हरा इंजन तेज़ साइलेंसर से बेहतर है।', 'Cars and bikes', 'रखरखाव', 'व्यावहारिक', ['इंजन', 'साइलेंसर']),
  h('बच्चे से ढंग से माफ़ी माँगो, वो तुमसे सीख रहे हैं।', 'Parenting', 'सम्मान', 'कोमल', ['बच्चे', 'माफ़ी']),
  h('बड़ी बात सीधे बोलना सीखो।', 'Technology and coding', 'कला', 'गंभीर', ['बात', 'सीखो']),
  h('दो बार क्यों पूछो, जवाब ईमानदार हो जाएगा।', 'Science and curiosity', 'तरीक़ा', 'गंभीर', ['क्यों', 'जवाब']),
  h('घर वो आवाज़ें हैं जिन्हें आँख बंद करके पहचानो।', 'Home and interiors', 'घर', 'कोमल', ['घर', 'आवाज़ें']),
  h('अकेला और बेसहारा दो अलग कमरे हैं, दोनों जानता हूँ।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['अकेला', 'कमरे']),
  g('Man bhool jaye tab bhi shareer yaad rakhta hai.', 'Yoga and wellness', 'Awareness', 'Wise', ['shareer', 'yaad']),
  g('Saans chhodo lambi, ghabrahat dheeli pad jayegi.', 'Yoga and wellness', 'Breath', 'Practical', ['saans', 'ghabrahat']),
  g('Syllabus pehchan nahi hota, phir bhi kaam karo.', 'Student life', 'Exams', 'Wry', ['syllabus', 'kaam']),
  g('Email ka jawaab paragraph poora karne se pehle do.', 'Professional and business', 'Habits', 'Direct', ['email', 'jawaab']),
  g('Main ant ke liye khelta hoon, kill count ke liye nahi.', 'Gaming profiles', 'Story', 'Wry', ['khelta', 'count']),
  g('Saaf engine tez silencer se behtar hai.', 'Cars and bikes', 'Maintenance', 'Practical', ['engine', 'silencer']),
  g('Bachche se dhang se maafi maango, woh tumse seekh rahe hain.', 'Parenting', 'Respect', 'Warm', ['bachche', 'maafi']),
  g('Badi baat seedhe bolna seekho.', 'Technology and coding', 'Craft', 'Wise', ['baat', 'seekho']),
  g('Ghar woh awaazein hain jinhe aankh band karke pehchano.', 'Home and interiors', 'Home', 'Warm', ['ghar', 'awaazein']),
  g('Akela aur besahaara do alag kamre hain, dono jaanta hoon.', 'Alone and loneliness', 'Solitude', 'Honest', ['akela', 'kamre']),
];
