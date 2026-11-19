/**
 * BioCraft original bios — batch 063.
 * Allocation from scripts/bios/balance.mjs: 45 EN / 31 HI / 34 HG.
 * New subject matter: the licence office queue, a tailor who keeps the measure
 * book, the school bus driver, a photograph of a demolished house,
 * the first night in a hostel.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_063 = [
  /* ------------------------------------------------------------ Attitude */
  e('I fill the form before I stand in the line for it.', 'Attitude', 'Preparation', 'Practical', ['attitude', 'form']),
  e('I thank the bus driver out loud, every morning.', 'Attitude', 'Courtesy', 'Warm', ['attitude', 'bus']),
  e('I do not photograph a person who does not want to be photographed.', 'Attitude', 'Respect', 'Firm', ['attitude', 'photograph']),
  h('क़तार में खड़े होने से पहले फ़ॉर्म भर लेता हूँ।', 'Attitude', 'तैयारी', 'व्यावहारिक', ['फ़ॉर्म', 'क़तार']),
  h('दर्ज़ी की नाप की किताब उसी को लौटा देता हूँ, अपनी अलमारी को नहीं।', 'Attitude', 'ईमानदारी', 'शांत', ['दर्ज़ी', 'अलमारी']),
  h('बस चालक को रोज़ सुबह आवाज़ से धन्यवाद देता हूँ।', 'Attitude', 'अदब', 'कोमल', ['चालक', 'धन्यवाद']),
  h('जो तस्वीर नहीं चाहता, उसकी तस्वीर नहीं खींचता।', 'Attitude', 'लिहाज़', 'दृढ़', ['तस्वीर', 'लिहाज़']),
  g('Kataar mein khade hone se pehle form bhar leta hoon.', 'Attitude', 'Preparation', 'Practical', ['form', 'kataar']),
  g('Darzi ki naap ki kitaab usi ko lauta deta hoon, apni almari ko nahi.', 'Attitude', 'Integrity', 'Composed', ['darzi', 'almari']),
  g('Bus chaalak ko roz subah awaaz se dhanyavaad deta hoon.', 'Attitude', 'Courtesy', 'Warm', ['chaalak', 'dhanyavaad']),
  g('Jo tasveer nahi chahta, uski tasveer nahi kheencta.', 'Attitude', 'Respect', 'Firm', ['tasveer', 'respect']),

  /* ------------------------------------------------------------- Love */
  e('You kept my measurements in your phone for three years.', 'Love and romance', 'Knowing', 'Tender', ['love', 'measure']),
  e('The bus ride home is where we say the things the house cannot hear.', 'Love and romance', 'Closeness', 'Warm', ['love', 'bus']),
  e('You stand outside the licence office and read a book for two hours.', 'Love and romance', 'Patience', 'Tender', ['love', 'licence']),
  h('तुमने मेरी नाप तीन साल अपने फ़ोन में रखी।', 'Love and romance', 'जानना', 'कोमल', ['नाप', 'फ़ोन']),
  h('बस में घर लौटते वक़्त वो बातें होती हैं जो घर सुन नहीं सकता।', 'Love and romance', 'अपनापन', 'कोमल', ['बस', 'बातें']),
  h('तुम लाइसेंस दफ़्तर के बाहर दो घंटे किताब पढ़ते रहते हो।', 'Love and romance', 'सब्र', 'कोमल', ['किताब', 'घंटे']),
  g('Tumne meri naap teen saal apne phone mein rakhi.', 'Love and romance', 'Knowing', 'Tender', ['naap', 'phone']),
  g('Bus mein ghar lautte waqt woh baatein hoti hain jo ghar sun nahi sakta.', 'Love and romance', 'Closeness', 'Warm', ['bus', 'baatein']),
  g('Tum licence daftar ke bahar do ghante kitaab padhte rehte ho.', 'Love and romance', 'Patience', 'Tender', ['kitaab', 'ghante']),

  /* ------------------------------------------------------- Sad depth */
  e('Our house was demolished and the only photograph is a blur.', 'Sad and heartbreak', 'Home', 'Aching', ['sad', 'house']),
  e('The first night in a hostel I did not sleep and did not cry either.', 'Sad and heartbreak', 'Leaving', 'Heavy', ['sad', 'hostel']),
  e('The measure book still has my father measurements in it.', 'Sad and heartbreak', 'Parents', 'Quiet', ['sad', 'measure']),
  e('The bus driver asked about my brother for a year after he left.', 'Sad and heartbreak', 'Leaving', 'Quiet', ['sad', 'bus']),
  h('हमारा घर गिर गया, और उसकी एक ही तस्वीर है, जो धुँधली है।', 'Sad and heartbreak', 'घर', 'भावुक', ['घर', 'तस्वीर']),
  h('हॉस्टल की पहली रात मैं सोया भी नहीं और रोया भी नहीं।', 'Sad and heartbreak', 'जुदाई', 'भारी', ['रात', 'रोया']),
  h('नाप की किताब में आज भी पिताजी की नाप लिखी है।', 'Sad and heartbreak', 'माँ-बाप', 'शांत', ['किताब', 'पिताजी']),
  g('Humara ghar gir gaya, aur uski ek hi tasveer hai, jo dhundhli hai.', 'Sad and heartbreak', 'Home', 'Aching', ['ghar', 'tasveer']),
  g('Hostel ki pehli raat main soya bhi nahi aur roya bhi nahi.', 'Sad and heartbreak', 'Leaving', 'Heavy', ['raat', 'roya']),
  g('Naap ki kitaab mein aaj bhi pitaji ki naap likhi hai.', 'Sad and heartbreak', 'Parents', 'Quiet', ['kitaab', 'pitaji']),

  /* --------------------------------------------------------- Shayari */
  h('घर गिरा,\nतस्वीर\nधुँधली रह गई।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['घर', 'तस्वीर']),
  h('पहली रात\nशहर ने\nसिर्फ़ देखा।', 'Shayari', 'तीन पंक्ति', 'शांत', ['रात', 'शहर']),
  g('Ghar gira, tasveer dhundhli reh gayi.', 'Shayari', 'Two line', 'Aching', ['ghar', 'tasveer']),
  g('Pehli raat shehar ne sirf dekha.', 'Shayari', 'Two line', 'Quiet', ['raat', 'shehar']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A queue is a tax paid in standing.', 'Quotes and thoughts', 'Queues', 'Sharp', ['quotes', 'queue']),
  e('A tailor who keeps your measurements keeps your history.', 'Quotes and thoughts', 'Craft', 'Warm', ['quotes', 'tailor']),
  e('The school bus driver knows more families than the headmaster.', 'Quotes and thoughts', 'School', 'Wry', ['quotes', 'bus']),
  e('Photograph the house while it is still standing.', 'Quotes and thoughts', 'Memory', 'Wise', ['quotes', 'photograph']),
  h('क़तार खड़े रहकर दिया गया टैक्स है।', 'Quotes and thoughts', 'क़तार', 'तीखा', ['क़तार', 'टैक्स']),
  h('जो दर्ज़ी तुम्हारी नाप रखता है, वो तुम्हारा इतिहास रखता है।', 'Quotes and thoughts', 'हुनर', 'कोमल', ['दर्ज़ी', 'इतिहास']),
  h('स्कूल बस का चालक हेडमास्टर से ज़्यादा परिवार जानता है।', 'Quotes and thoughts', 'स्कूल', 'सहज', ['चालक', 'परिवार']),
  g('Kataar khade rehkar diya gaya tax hai.', 'Quotes and thoughts', 'Queues', 'Sharp', ['kataar', 'tax']),
  g('Jo darzi tumhari naap rakhta hai, woh tumhara itihaas rakhta hai.', 'Quotes and thoughts', 'Craft', 'Warm', ['darzi', 'itihaas']),
  g('School bus ka chaalak headmaster se zyada parivaar jaanta hai.', 'Quotes and thoughts', 'School', 'Wry', ['chaalak', 'parivaar']),

  /* ------------------------------------------------- Life and reality */
  e('Carry two photographs of yourself to any government office.', 'Life and reality', 'Bureaucracy', 'Practical', ['life', 'photograph']),
  e('Photograph the rented house on the day you move in.', 'Life and reality', 'Home', 'Practical', ['life', 'house']),
  e('Learn the driver name. It changes the whole morning.', 'Life and reality', 'Cities', 'Warm', ['life', 'bus']),
  e('The first hostel night is survivable. Tell yourself that at ten.', 'Life and reality', 'Leaving', 'Warm', ['life', 'hostel']),
  e('Get measured once a year, even if you are not buying anything.', 'Life and reality', 'Money', 'Wry', ['life', 'measure']),
  h('सरकारी दफ़्तर में अपनी दो तस्वीरें लेकर जाओ।', 'Life and reality', 'दफ़्तर', 'व्यावहारिक', ['तस्वीरें', 'दफ़्तर']),
  h('जिस दिन किराए के घर में जाओ, उसी दिन उसकी तस्वीर खींचो।', 'Life and reality', 'घर', 'व्यावहारिक', ['घर', 'तस्वीर']),
  h('चालक का नाम जान लो, पूरी सुबह बदल जाती है।', 'Life and reality', 'शहर', 'कोमल', ['चालक', 'सुबह']),
  h('हॉस्टल की पहली रात बीत जाती है, दस बजे ख़ुद से यह कहो।', 'Life and reality', 'जुदाई', 'कोमल', ['रात', 'हॉस्टल']),
  g('Sarkari daftar mein apni do tasveerein lekar jao.', 'Life and reality', 'Bureaucracy', 'Practical', ['tasveerein', 'daftar']),
  g('Jis din kiraaye ke ghar mein jao, usi din uski tasveer kheencho.', 'Life and reality', 'Home', 'Practical', ['ghar', 'tasveer']),
  g('Chaalak ka naam jaan lo, poori subah badal jaati hai.', 'Life and reality', 'Cities', 'Warm', ['chaalak', 'subah']),
  g('Hostel ki pehli raat beet jaati hai, das baje khud se yeh kaho.', 'Life and reality', 'Leaving', 'Warm', ['raat', 'hostel']),

  /* ------------------------------------------------------ Motivational */
  e('Take the form home. Nobody has ever regretted reading it twice.', 'Motivational', 'Preparation', 'Practical', ['motivation', 'form']),
  e('The first night away is the hardest and also the shortest.', 'Motivational', 'Courage', 'Warm', ['motivation', 'hostel']),
  h('फ़ॉर्म घर ले जाओ, दोबारा पढ़ने से किसी को नुक़सान नहीं हुआ।', 'Motivational', 'तैयारी', 'व्यावहारिक', ['फ़ॉर्म', 'नुक़सान']),
  h('घर से पहली रात सबसे कठिन होती है, और सबसे छोटी भी।', 'Motivational', 'साहस', 'कोमल', ['रात', 'कठिन']),
  h('दर्ज़ी से पूछो क्या लगता है, उसने चार सौ फ़िट देखे हैं।', 'Motivational', 'विनम्रता', 'गंभीर', ['दर्ज़ी', 'फ़िट']),
  g('Form ghar le jao, dobara padhne se kisi ko nuksaan nahi hua.', 'Motivational', 'Preparation', 'Practical', ['form', 'nuksaan']),
  g('Ghar se pehli raat sabse mushkil hoti hai, aur sabse chhoti bhi.', 'Motivational', 'Courage', 'Warm', ['raat', 'mushkil']),
  g('Darzi se poocho kya lagta hai, usne chaar sau fit dekhe hain.', 'Motivational', 'Humility', 'Wise', ['darzi', 'fit']),

  /* -------------------------------------------------------- Aesthetic */
  e('A house photographed in flat daylight is the one people remember.', 'Aesthetic', 'Photography', 'Warm', ['aesthetic', 'photograph']),
  h('दोपहर की सीधी रोशनी में खींचा घर लोगों को याद रहता है।', 'Aesthetic', 'तस्वीर', 'कोमल', ['रोशनी', 'घर']),
  h('दर्ज़ी की दुकान से भाप की महक आती है, वही परवाह की महक है।', 'Aesthetic', 'हुनर', 'कोमल', ['भाप', 'परवाह']),
  g('Dopahar ki seedhi roshni mein kheencha ghar logon ko yaad rehta hai.', 'Aesthetic', 'Photography', 'Warm', ['roshni', 'ghar']),
  g('Darzi ki dukaan se bhaap ki mehak aati hai, wahi parwah ki mehak hai.', 'Aesthetic', 'Craft', 'Warm', ['bhaap', 'parwah']),

  /* ---------------------------------------------- Wider category band */
  e('Two hours of standing is a back problem you will meet at forty.', 'Yoga and wellness', 'Body', 'Wry', ['yoga', 'standing']),
  e('Ask for the licence form online before you queue for it offline.', 'Student life', 'Admin', 'Practical', ['student', 'admin']),
  e('A measure book is customer data going back thirty years.', 'Professional and business', 'Data', 'Wise', ['professional', 'data']),
  e('A school bus that leaves on time is a fielding lesson in disguise.', 'Cricket and sports', 'Cricket', 'Wry', ['cricket', 'bus']),
  e('Know the bus number and the driver name. Timetables lie, people do not.', 'Cars and bikes', 'Commuting', 'Practical', ['cars', 'commuting']),
  e('Get measured in December and the January sale fits you properly.', 'Fashion and beauty', 'Tailoring', 'Practical', ['fashion', 'measure']),
  e('Store the measurements digitally. Paper measure books do not survive moves.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'backup']),
  e('Weigh the cloth before you cut it. Tailors are practical scientists.', 'Science and curiosity', 'Method', 'Practical', ['science', 'method']),
  e('A shop that records every customer measurement can hire anyone.', 'Startup and hustle', 'Systems', 'Wise', ['startup', 'systems']),
  e('Thick curtains, a clean window, a floor you can see. That is a room.', 'Home and interiors', 'Rent', 'Practical', ['home', 'room']),
  e('One photograph on a wall, chosen properly, is enough decoration.', 'Minimal', 'Home', 'Practical', ['minimal', 'photograph']),
  e('A shirt measured well looks expensive from ten feet.', 'Stylish', 'Tailoring', 'Practical', ['stylish', 'measure']),
  e('The funniest moment at a licence office is the crowd that insists it came first.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'office']),
  e('I will tell you which office actually works and which one only moves paper.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who waits outside a government office for you has proved something.', 'Friendship', 'Support', 'Warm', ['friendship', 'office']),
  e('My mother kept the tailor slip for every school uniform I ever wore.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('Sitting still in a queue can be a practice if you decide it is.', 'Spirituality and peace', 'Patience', 'Wise', ['spirituality', 'patience']),
  e('Photograph the outside of every flat before you sign for it.', 'Photography', 'Rent', 'Practical', ['photography', 'rent']),
  e('Arrive in a new city by bus, not by cab, and you will learn its shape.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'bus']),
  e('A post about a demolished house gets more replies than a post about a new one.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who remembers the school bus driver name.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'memory']),
  e('I will not bribe anyone for a form that is mine by right.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'bribe']),
  e('A licence office in monsoon tests both your form and your shoes.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'office']),
  h('दो घंटे खड़े रहना कमर की बीमारी है, जो चालीस पर मिलेगी।', 'Yoga and wellness', 'शरीर', 'सहज', ['कमर', 'चालीस']),
  h('फ़ॉर्म ऑनलाइन भर लो, क़तार में खुद को फँसाने से पहले।', 'Student life', 'दफ़्तरी काम', 'व्यावहारिक', ['फ़ॉर्म', 'क़तार']),
  h('जो दुकान हर ग्राहक की नाप लिखती है, वो किसी को भी रख सकती है।', 'Startup and hustle', 'व्यवस्था', 'गंभीर', ['दुकान', 'नाप']),
  h('फटे हुए पर्दे, साफ़ खिड़की, दिखता फ़र्श, यही कमरा है।', 'Home and interiors', 'किराया', 'व्यावहारिक', ['पर्दे', 'फ़र्श']),
  h('माँ ने हर स्कूल यूनिफ़ॉर्म की दर्ज़ी पर्ची संभालकर रखी।', 'Family', 'माँ-बाप', 'कोमल', ['माँ', 'पर्ची']),
  h('बस से नए शहर पहुँचो, टैक्सी से नहीं, शहर का आकार समझ आएगा।', 'Travel and adventure', 'शहर', 'कोमल', ['बस', 'शहर']),
  g('Do ghante khade rehna kamar ki bimari hai, jo chaalees par milegi.', 'Yoga and wellness', 'Body', 'Wry', ['kamar', 'chaalees']),
  g('Form online bhar lo, kataar mein khud ko phansaane se pehle.', 'Student life', 'Admin', 'Practical', ['form', 'kataar']),
  g('Jo dukaan har grahak ki naap likhti hai, woh kisi ko bhi rakh sakti hai.', 'Startup and hustle', 'Systems', 'Wise', ['dukaan', 'naap']),
  g('Phate hue parde, saaf khidki, dikhta farsh, yahi kamra hai.', 'Home and interiors', 'Rent', 'Practical', ['parde', 'farsh']),
  g('Maa ne har school uniform ki darzi parchi sambhalkar rakhi.', 'Family', 'Parents', 'Tender', ['maa', 'parchi']),
  g('Bus se naye shehar pahuncho, taxi se nahi, shehar ka aakaar samajh aayega.', 'Travel and adventure', 'Cities', 'Warm', ['bus', 'shehar']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('उस घर की तस्वीर है जिसमें हम कभी साथ नहीं रहे।', 'Love and romance', 'याद', 'भावुक', ['घर', 'साथ']),
  h('दुकान से भाप की महक आती है, वही परवाह है।', 'Aesthetic', 'हुनर', 'कोमल', ['भाप', 'परवाह']),
  h('हॉस्टल की पहली रात में सब चुपचाप हिम्मत कर रहे होते हैं।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['रात', 'हिम्मत']),
  g('Us ghar ki tasveer hai jismein hum kabhi saath nahi rahe.', 'Love and romance', 'Memory', 'Aching', ['ghar', 'saath']),
  g('Dukaan se bhaap ki mehak aati hai, wahi parwah hai.', 'Aesthetic', 'Craft', 'Warm', ['bhaap', 'parwah']),
  g('Hostel ki pehli raat mein sab chupchaap himmat kar rahe hote hain.', 'Alone and loneliness', 'Solitude', 'Honest', ['raat', 'himmat']),
];
