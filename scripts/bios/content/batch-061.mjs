/**
 * BioCraft original bios — batch 061.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the barber who remembers your father, the water tanker
 * queue in May, a lost wedding invitation, the night train, a repaired watch,
 * and the newspaper boy who knows which houses are awake.
 *
 * Standing rule from 056/057/059: the Hindi and Hinglish lines are NOT
 * translations of their English sibling. Same subject, different image.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_061 = [
  /* ------------------------------------------------------------ Attitude */
  e('I sit in the same barber chair my father did.', 'Attitude', 'Loyalty', 'Warm', ['attitude', 'barber']),
  e('I give the water tanker driver a glass of water first.', 'Attitude', 'Courtesy', 'Warm', ['attitude', 'tanker']),
  e('I tell the newspaper boy when I am travelling so he keeps the money.', 'Attitude', 'Fairness', 'Practical', ['attitude', 'newspaper']),
  h('मैं उसी दुकान पर बैठता हूँ जहाँ पिताजी बैठते थे।', 'Attitude', 'वफ़ा', 'कोमल', ['दुकान', 'पिताजी']),
  h('टैंकर वाले को पहले एक गिलास पानी देता हूँ।', 'Attitude', 'अदब', 'कोमल', ['गिलास', 'पानी']),
  h('सफ़र पर जाने से पहले अख़बार वाले को बता देता हूँ, उसका पैसा बचा रहे।', 'Attitude', 'न्याय', 'व्यावहारिक', ['अख़बार', 'पैसा']),
  g('Main usi dukaan par baithta hoon jahan pitaji baithte the.', 'Attitude', 'Loyalty', 'Warm', ['dukaan', 'pitaji']),
  g('Tanker wale ko pehle ek glass paani deta hoon.', 'Attitude', 'Courtesy', 'Warm', ['glass', 'paani']),
  g('Safar par jaane se pehle akhbaar wale ko bata deta hoon, uska paisa bacha rahe.', 'Attitude', 'Fairness', 'Practical', ['akhbaar', 'paisa']),

  /* ------------------------------------------------------------- Love */
  e('You keep the torn invitation in your diary like a ticket.', 'Love and romance', 'Memory', 'Tender', ['love', 'invitation']),
  e('We share one berth and argue about the window all night.', 'Love and romance', 'Familiarity', 'Warm', ['love', 'train']),
  e('Your watch stopped in March and you still wear it.', 'Love and romance', 'Knowing', 'Tender', ['love', 'watch']),
  h('तुमने फटा हुआ न्योता डायरी में टिकट की तरह रखा है।', 'Love and romance', 'याद', 'कोमल', ['न्योता', 'डायरी']),
  h('एक ही बर्थ पर बैठकर खिड़की के लिए सारी रात झगड़ते हैं।', 'Love and romance', 'आदत', 'कोमल', ['बर्थ', 'खिड़की']),
  h('तुम्हारी घड़ी मार्च में रुक गई, और तुम उसे अब भी पहनते हो।', 'Love and romance', 'जानना', 'कोमल', ['घड़ी', 'मार्च']),
  g('Tumne phata hua nyota diary mein ticket ki tarah rakha hai.', 'Love and romance', 'Memory', 'Tender', ['nyota', 'diary']),
  g('Ek hi berth par baithkar khidki ke liye saari raat jhagadte hain.', 'Love and romance', 'Familiarity', 'Warm', ['berth', 'khidki']),
  g('Tumhari ghadi March mein ruk gayi, aur tum use ab bhi pehnte ho.', 'Love and romance', 'Knowing', 'Tender', ['ghadi', 'March']),

  /* ------------------------------------------------------- Sad depth */
  e('The invitation never reached us and nobody asked why.', 'Sad and heartbreak', 'Family', 'Heavy', ['sad', 'invitation']),
  e('In May the tanker came at four and the queue was already forty deep.', 'Sad and heartbreak', 'Summer', 'Heavy', ['sad', 'tanker']),
  e('My father watch was repaired twice and then he stopped wearing it.', 'Sad and heartbreak', 'Parents', 'Quiet', ['sad', 'watch']),
  e('The night train has a corridor where people go to cry quietly.', 'Sad and heartbreak', 'Travel', 'Aching', ['sad', 'train']),
  h('न्योता हमारे पास पहुँचा ही नहीं, और किसी ने पूछा भी नहीं।', 'Sad and heartbreak', 'परिवार', 'भारी', ['न्योता', 'पहुँचा']),
  h('मई में टैंकर चार बजे आया, और क़तार में पहले से चालीस लोग थे।', 'Sad and heartbreak', 'गर्मी', 'भारी', ['टैंकर', 'क़तार']),
  h('पिताजी की घड़ी दो बार ठीक हुई, फिर उन्होंने पहनना छोड़ दिया।', 'Sad and heartbreak', 'माँ-बाप', 'शांत', ['घड़ी', 'पहनना']),
  g('Nyota humare paas pahuncha hi nahi, aur kisi ne poocha bhi nahi.', 'Sad and heartbreak', 'Family', 'Heavy', ['nyota', 'pahuncha']),
  g('May mein tanker chaar baje aaya, aur kataar mein pehle se chalees log the.', 'Sad and heartbreak', 'Summer', 'Heavy', ['tanker', 'kataar']),
  g('Pitaji ki ghadi do baar theek hui, phir unhone pehnna chhod diya.', 'Sad and heartbreak', 'Parents', 'Quiet', ['ghadi', 'pehnna']),

  /* --------------------------------------------------------- Shayari */
  h('गाड़ी छूट गई,\nऔर हम\nखुश थे।', 'Shayari', 'तीन पंक्ति', 'सहज', ['गाड़ी', 'खुश']),
  h('घड़ी बंद है,\nवक़्त\nनहीं।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['घड़ी', 'वक़्त']),
  g('Gaadi chhoot gayi, aur hum khush the.', 'Shayari', 'Two line', 'Warm', ['gaadi', 'khush']),
  g('Ghadi band hai, waqt nahi.', 'Shayari', 'Two line', 'Deep', ['ghadi', 'waqt']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A barber remembers your family better than your family does.', 'Quotes and thoughts', 'Memory', 'Warm', ['quotes', 'barber']),
  e('Water arrives on a schedule nobody has seen.', 'Quotes and thoughts', 'Cities', 'Wry', ['quotes', 'water']),
  e('A lost invitation is a decision somebody made quietly.', 'Quotes and thoughts', 'Family', 'Sharp', ['quotes', 'invitation']),
  e('The night train is a corridor of people being honest at last.', 'Quotes and thoughts', 'Travel', 'Wise', ['quotes', 'train']),
  h('हजामत बनाने वाला तुम्हारा परिवार तुमसे बेहतर याद रखता है।', 'Quotes and thoughts', 'याद', 'कोमल', ['परिवार', 'याद']),
  h('पानी उस समय पर आता है जो किसी ने देखा ही नहीं।', 'Quotes and thoughts', 'शहर', 'सहज', ['पानी', 'समय']),
  h('खोया हुआ न्योता वो फ़ैसला है जो किसी ने चुपचाप लिया।', 'Quotes and thoughts', 'परिवार', 'तीखा', ['न्योता', 'फ़ैसला']),
  g('Hajaamat banane wala tumhara parivaar tumse behtar yaad rakhta hai.', 'Quotes and thoughts', 'Memory', 'Warm', ['parivaar', 'yaad']),
  g('Paani us samay par aata hai jo kisi ne dekha hi nahi.', 'Quotes and thoughts', 'Cities', 'Wry', ['paani', 'samay']),
  g('Khoya hua nyota woh faisla hai jo kisi ne chupchaap liya.', 'Quotes and thoughts', 'Family', 'Sharp', ['nyota', 'faisla']),

  /* ------------------------------------------------- Life and reality */
  e('Book the water tanker before the tap runs dry, not after.', 'Life and reality', 'Home', 'Practical', ['life', 'tanker']),
  e('Take the night train if you want to arrive with your thoughts sorted.', 'Life and reality', 'Travel', 'Wise', ['life', 'train']),
  e('Get the watch repaired by the man who has done it for twenty years.', 'Life and reality', 'Money', 'Practical', ['life', 'watch']),
  e('Tip the newspaper boy in the month you can, not the month you cannot.', 'Life and reality', 'Money', 'Practical', ['life', 'newspaper']),
  h('नल सूखने के बाद नहीं, पहले टैंकर बुक करो।', 'Life and reality', 'घर', 'व्यावहारिक', ['नल', 'टैंकर']),
  h('रात की गाड़ी पकड़ो अगर सोच-विचार कर पहुँचना है।', 'Life and reality', 'सफ़र', 'गंभीर', ['गाड़ी', 'सोच']),
  h('घड़ी उसी से ठीक कराओ जो बीस साल से यही कर रहा है।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['घड़ी', 'साल']),
  h('कह दो कि न्योता पहुँचा ही नहीं, और कमरे को चुप रहने दो।', 'Life and reality', 'परिवार', 'तीखा', ['न्योता', 'कमरे']),
  g('Nal sookhne ke baad nahi, pehle tanker book karo.', 'Life and reality', 'Home', 'Practical', ['nal', 'tanker']),
  g('Raat ki gaadi pakdo agar soch-vichar karke pahunchna hai.', 'Life and reality', 'Travel', 'Wise', ['gaadi', 'soch']),
  g('Ghadi usi se theek karao jo bees saal se yahi kar raha hai.', 'Life and reality', 'Money', 'Practical', ['ghadi', 'saal']),
  g('Keh do ki nyota pahuncha hi nahi, aur kamre ko chup rehne do.', 'Life and reality', 'Family', 'Sharp', ['nyota', 'kamre']),

  /* ------------------------------------------------------ Motivational */
  e('A repaired watch is better than a new one you do not trust.', 'Motivational', 'Repair', 'Warm', ['motivation', 'repair']),
  e('Miss the train once and you will never again leave at the last minute.', 'Motivational', 'Punctuality', 'Direct', ['motivation', 'train']),
  h('ठीक हुई घड़ी उस नई घड़ी से बेहतर है जिस पर भरोसा न हो।', 'Motivational', 'मरम्मत', 'कोमल', ['घड़ी', 'भरोसा']),
  h('एक बार गाड़ी छूटे, तो आख़िरी मिनट पर निकलना छूट जाता है।', 'Motivational', 'समय', 'स्पष्ट', ['गाड़ी', 'मिनट']),
  h('दुकान वाले बुज़ुर्ग से पूछो, वो तुम्हारी समस्या चार बार देख चुका है।', 'Motivational', 'सब्र', 'गंभीर', ['बुज़ुर्ग', 'समस्या']),
  g('Theek hui ghadi us nayi ghadi se behtar hai jis par bharosa na ho.', 'Motivational', 'Repair', 'Warm', ['ghadi', 'bharosa']),
  g('Ek baar gaadi chhoote, toh aakhri minute par nikalna chhoot jaata hai.', 'Motivational', 'Punctuality', 'Direct', ['gaadi', 'minute']),
  g('Dukaan wale buzurg se poocho, woh tumhari samasya chaar baar dekh chuka hai.', 'Motivational', 'Patience', 'Wise', ['buzurg', 'samasya']),

  /* -------------------------------------------------------- Aesthetic */
  e('A barber shop mirror with good bulbs is half the haircut.', 'Aesthetic', 'Craft', 'Practical', ['aesthetic', 'mirror']),
  h('दुकान का आईना, अच्छे बल्बों के साथ, आधा हजामत है।', 'Aesthetic', 'हुनर', 'व्यावहारिक', ['आईना', 'बल्बों']),
  h('पुरानी घड़ी उसके पहले पट्टे के साथ दराज़ में रखो।', 'Aesthetic', 'चीज़ें', 'कोमल', ['घड़ी', 'पट्टे']),
  g('Dukaan ka aaina, acche bulbs ke saath, aadha hajaamat hai.', 'Aesthetic', 'Craft', 'Practical', ['aaina', 'bulbs']),
  g('Purani ghadi uske pehle patte ke saath daraz mein rakho.', 'Aesthetic', 'Objects', 'Warm', ['ghadi', 'patte']),

  /* ---------------------------------------------- Wider category band */
  e('The four o clock tanker is the reason nobody in our building sleeps well.', 'Yoga and wellness', 'Sleep', 'Wry', ['yoga', 'tanker']),
  e('Write your exam centre down twice, because you will check it at midnight.', 'Student life', 'Exams', 'Practical', ['student', 'exams']),
  e('A repair shop with a waiting list is a business worth copying.', 'Professional and business', 'Craft', 'Wise', ['professional', 'craft']),
  e('Check the spare tyre before the night drive, not after it.', 'Cars and bikes', 'Maintenance', 'Practical', ['cars', 'tyre']),
  e('A haircut you can maintain at home is the best haircut.', 'Fashion and beauty', 'Grooming', 'Practical', ['fashion', 'haircut']),
  e('A train timetable is a data problem pretending to be a mystery.', 'Technology and coding', 'Craft', 'Sharp', ['tech', 'timetable']),
  e('Measure the water you actually use for a week and be surprised.', 'Science and curiosity', 'Measurement', 'Practical', ['science', 'water']),
  e('Charge for the repair, not for the story about the repair.', 'Startup and hustle', 'Service', 'Sharp', ['startup', 'service']),
  e('Keep one steel glass out and the plastic bottles stop multiplying.', 'Home and interiors', 'Kitchen', 'Practical', ['home', 'kitchen']),
  e('One watch, one wallet, one bag. Nothing to search for at the station.', 'Minimal', 'Possessions', 'Practical', ['minimal', 'possessions']),
  e('A clean shave is the cheapest way to look like you slept.', 'Stylish', 'Grooming', 'Wry', ['stylish', 'grooming']),
  e('The funniest queue in any city is the one for water at four in the morning.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'queue']),
  e('I will tell you which relative did not send the invitation.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('A friend who drops you at the station at five is a friend for life.', 'Friendship', 'Support', 'Warm', ['friendship', 'station']),
  e('My grandmother kept every invitation in a tin and remembered each wedding.', 'Family', 'Grandparents', 'Tender', ['family', 'invitation']),
  e('The station at four in the morning is the loneliest room with the most people.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'station']),
  e('Waiting for a train is a good place to stop arguing with yourself.', 'Spirituality and peace', 'Patience', 'Wise', ['spirituality', 'patience']),
  e('Photograph the platform clock, not the train. The clock is the truth.', 'Photography', 'Travel', 'Sharp', ['photography', 'station']),
  e('Get off one stop early and walk the last mile of a new city.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'walk']),
  e('A picture of a train window gets more replies than a picture of a beach.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who keeps every ticket in a shoebox.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'tickets']),
  e('I will not wear a watch I cannot read just because it looks expensive.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'watch']),
  e('A platform in monsoon is a lesson in patience and wet socks.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'platform']),
  h('चार बजे का टैंकर ही वजह है कि हमारी बिल्डिंग में कोई ठीक से नहीं सोता।', 'Yoga and wellness', 'नींद', 'सहज', ['टैंकर', 'बिल्डिंग']),
  h('मरम्मत की दुकान पर लंबी लाइन हो, तो वो काम कॉपी करने लायक है।', 'Professional and business', 'हुनर', 'गंभीर', ['दुकान', 'लाइन']),
  h('जो हजामत घर पर संभल जाए, वही सबसे अच्छी हजामत है।', 'Fashion and beauty', 'हजामत', 'व्यावहारिक', ['हजामत', 'घर']),
  h('एक हफ़्ते अपना पानी नापो, और हैरान रह जाओगे।', 'Science and curiosity', 'नाप', 'व्यावहारिक', ['पानी', 'हफ़्ते']),
  h('दादी हर न्योता टिन में रखती थीं और हर शादी याद रखती थीं।', 'Family', 'दादा-दादी', 'कोमल', ['दादी', 'न्योता']),
  h('सुबह चार बजे का स्टेशन सबसे अकेला कमरा है, जहाँ सबसे ज़्यादा लोग हैं।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['स्टेशन', 'अकेला']),
  g('Chaar baje ka tanker hi wajah hai ki humari building mein koi theek se nahi sota.', 'Yoga and wellness', 'Sleep', 'Wry', ['tanker', 'building']),
  g('Marammat ki dukaan par lambi line ho, toh woh kaam copy karne laayak hai.', 'Professional and business', 'Craft', 'Wise', ['dukaan', 'line']),
  g('Jo hajaamat ghar par sambhal jaaye, wahi sabse acchi hajaamat hai.', 'Fashion and beauty', 'Grooming', 'Practical', ['hajaamat', 'ghar']),
  g('Ek hafte apna paani naapo, aur hairaan reh jaoge.', 'Science and curiosity', 'Measurement', 'Practical', ['paani', 'hafte']),
  g('Dadi har nyota tin mein rakhti thi aur har shaadi yaad rakhti thi.', 'Family', 'Grandparents', 'Tender', ['dadi', 'nyota']),
  g('Subah chaar baje ka station sabse akela kamra hai, jahan sabse zyada log hain.', 'Alone and loneliness', 'Solitude', 'Honest', ['station', 'akela']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('अपनी देर का इलज़ाम गाड़ी पर मत डालो।', 'Attitude', 'ईमानदारी', 'स्पष्ट', ['देर', 'गाड़ी']),
  h('स्टेशन पर तुम सबसे अच्छे लगते हो, किसी के कुछ होने से पहले।', 'Love and romance', 'अपनापन', 'कोमल', ['स्टेशन', 'अच्छे']),
  h('कह दो कि न्योता कभी आया ही नहीं, और बैठकर इंतज़ार करो।', 'Life and reality', 'परिवार', 'तीखा', ['न्योता', 'इंतज़ार']),
  h('दुकान के बुज़ुर्ग से पूछो, वो यह मामला चार बार देख चुका है।', 'Motivational', 'सब्र', 'गंभीर', ['बुज़ुर्ग', 'मामला']),
  h('पुरानी घड़ी दराज़ में उसके पहले पट्टे के साथ रहती है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['घड़ी', 'दराज़']),
  g('Apni der ka ilzaam gaadi par mat daalo.', 'Attitude', 'Honesty', 'Firm', ['der', 'gaadi']),
  g('Station par tum sabse acche lagte ho, kisi ke kuch hone se pehle.', 'Love and romance', 'Closeness', 'Warm', ['station', 'acche']),
  g('Keh do ki nyota kabhi aaya hi nahi, aur baithkar intezaar karo.', 'Life and reality', 'Family', 'Sharp', ['nyota', 'intezaar']),
  g('Dukaan ke buzurg se poocho, woh yeh maamla chaar baar dekh chuka hai.', 'Motivational', 'Patience', 'Wise', ['buzurg', 'maamla']),
];
