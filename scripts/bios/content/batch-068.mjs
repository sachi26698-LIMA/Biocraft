/**
 * BioCraft original bios — batch 068.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the ration shop shutter, a father's hearing aid,
 * the school gate at 7:40, a wedding band hired by the night, the water bill,
 * and a scooter that is older than the marriage.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_068 = [
  /* ------------------------------------------------------------ Attitude */
  e('I speak slowly and face my father when he has his hearing aid off.', 'Attitude', 'Patience', 'Tender', ['attitude', 'patience']),
  e('I do not push at the school gate. There are children inside.', 'Attitude', 'Restraint', 'Firm', ['attitude', 'gate']),
  e('I return the hired drum kit with every piece in the bag.', 'Attitude', 'Integrity', 'Practical', ['attitude', 'band']),
  h('लाठी वाले को पहले जाने देता हूँ, और ऐलान नहीं करता।', 'Attitude', 'अदब', 'कोमल', ['लाठी', 'ऐलान']),
  h('पापा का हियरिंग एड निकाला हो तो धीरे बोलता हूँ और उनके सामने बैठता हूँ।', 'Attitude', 'सब्र', 'कोमल', ['हियरिंग', 'धीरे']),
  h('स्कूल के गेट पर धक्का नहीं देता, अंदर बच्चे हैं।', 'Attitude', 'संयम', 'दृढ़', ['गेट', 'बच्चे']),
  g('Laathi wale ko pehle jaane deta hoon, aur ailaan nahi karta.', 'Attitude', 'Courtesy', 'Warm', ['laathi', 'ailaan']),
  g('Papa ka hearing aid nikaala ho toh dheere bolta hoon aur unke saamne baithta hoon.', 'Attitude', 'Patience', 'Tender', ['hearing', 'dheere']),
  g('School ke gate par dhakka nahi deta, andar bachche hain.', 'Attitude', 'Restraint', 'Firm', ['gate', 'bachche']),

  /* ------------------------------------------------------------- Love */
  e('You learned to stand on my father left side without being told.', 'Love and romance', 'Attention', 'Tender', ['love', 'attention']),
  e('Our scooter is older than our marriage and neither of us will say it first.', 'Love and romance', 'Familiarity', 'Wry', ['love', 'scooter']),
  e('You wait at the school gate at 7:40 and pretend it is on your way.', 'Love and romance', 'Ordinary days', 'Warm', ['love', 'gate']),
  h('तुमने बिना बताए पापा के बाएँ तरफ़ खड़ा होना सीख लिया।', 'Love and romance', 'ध्यान', 'कोमल', ['बाएँ', 'सीख']),
  h('हमारा स्कूटर हमारी शादी से पुराना है, और कोई पहले नहीं कहेगा।', 'Love and romance', 'आदत', 'सहज', ['स्कूटर', 'शादी']),
  h('तुम सात बजकर चालीस पर गेट पर खड़े रहते हो, जैसे रास्ते में पड़ता हो।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['गेट', 'रास्ते']),
  g('Tumne bina bataye papa ke baayein taraf khada hona seekh liya.', 'Love and romance', 'Attention', 'Tender', ['baayein', 'seekh']),
  g('Humara scooter humari shaadi se purana hai, aur koi pehle nahi kahega.', 'Love and romance', 'Familiarity', 'Wry', ['scooter', 'shaadi']),
  g('Tum saat baje chalees par gate par khade rehte ho, jaise raaste mein padta ho.', 'Love and romance', 'Ordinary days', 'Warm', ['gate', 'raaste']),

  /* ------------------------------------------------------- Sad depth */
  e('The ration shop shutter came down at eleven and opened at four, every day.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'ration']),
  e('My father stopped hearing the birds before he told anyone.', 'Sad and heartbreak', 'Parents', 'Aching', ['sad', 'hearing']),
  e('At 7:40 the school gate is the busiest and loneliest place in the town.', 'Sad and heartbreak', 'School', 'Honest', ['sad', 'gate']),
  h('राशन की दुकान ग्यारह बजे बंद होती थी और चार बजे खुलती थी, रोज़।', 'Sad and heartbreak', 'पैसा', 'भारी', ['राशन', 'दुकान']),
  h('पापा ने चिड़ियों की आवाज़ सुननी बंद कर दी, और किसी को बताया भी नहीं।', 'Sad and heartbreak', 'माँ-बाप', 'भावुक', ['चिड़ियों', 'आवाज़']),
  h('सात बजकर चालीस पर स्कूल का गेट कस्बे की सबसे भीड़ भरी और सबसे तन्हा जगह है।', 'Sad and heartbreak', 'स्कूल', 'स्पष्ट', ['गेट', 'तन्हा']),
  g('Ration ki dukaan gyarah baje band hoti thi aur chaar baje khulti thi, roz.', 'Sad and heartbreak', 'Money', 'Heavy', ['ration', 'dukaan']),
  g('Papa ne chidiyon ki awaaz sunni band kar di, aur kisi ko bataya bhi nahi.', 'Sad and heartbreak', 'Parents', 'Aching', ['chidiyon', 'awaaz']),
  g('Saat baje chalees par school ka gate kasbe ki sabse bheed bhari aur sabse tanha jagah hai.', 'Sad and heartbreak', 'School', 'Honest', ['gate', 'tanha']),

  /* --------------------------------------------------------- Shayari */
  h('गेट खुला है,\nबच्चे अंदर,\nहम बाहर।', 'Shayari', 'तीन पंक्ति', 'शांत', ['गेट', 'बच्चे']),
  h('चिड़िया चुप है,\nऔर पापा\nमुस्कुरा रहे हैं।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['चिड़िया', 'पापा']),
  g('Gate khula hai, bachche andar, hum bahar.', 'Shayari', 'Two line', 'Quiet', ['gate', 'bachche']),
  g('Chidiya chup hai, aur papa muskura rahe hain.', 'Shayari', 'Two line', 'Aching', ['chidiya', 'papa']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A ration shop teaches you the timetable of hunger.', 'Quotes and thoughts', 'Money', 'Sharp', ['quotes', 'ration']),
  e('A hearing aid is not a weakness. It is a tool somebody hid for years.', 'Quotes and thoughts', 'Age', 'Wise', ['quotes', 'hearing']),
  e('A hired band plays for four hours and is remembered for one song.', 'Quotes and thoughts', 'Weddings', 'Wry', ['quotes', 'band']),
  e('The school gate at 7:40 is where a town admits it has children.', 'Quotes and thoughts', 'School', 'Warm', ['quotes', 'gate']),
  h('राशन की दुकान भूख का टाइम टेबल सिखाती है।', 'Quotes and thoughts', 'पैसा', 'तीखा', ['राशन', 'टाइम']),
  h('हियरिंग एड कमज़ोरी नहीं, वो औज़ार है जिसे सालों छुपाया गया।', 'Quotes and thoughts', 'उम्र', 'गंभीर', ['औज़ार', 'सालों']),
  h('किराए का बैंड चार घंटे बजता है और एक गीत के लिए याद रहता है।', 'Quotes and thoughts', 'शादी', 'सहज', ['बैंड', 'गीत']),
  g('Ration ki dukaan bhookh ka time table sikhaati hai.', 'Quotes and thoughts', 'Money', 'Sharp', ['ration', 'time']),
  g('Hearing aid kamzori nahi, woh auzar hai jise saalon chhupaya gaya.', 'Quotes and thoughts', 'Age', 'Wise', ['auzar', 'saalon']),
  g('Kiraaye ka band chaar ghante bajta hai aur ek geet ke liye yaad rehta hai.', 'Quotes and thoughts', 'Weddings', 'Wry', ['band', 'geet']),

  /* ------------------------------------------------- Life and reality */
  e('Ask for the bill at the ration shop. It is a right, not a favour.', 'Life and reality', 'Money', 'Firm', ['life', 'ration']),
  e('Get the hearing tested before the argument about the television volume.', 'Life and reality', 'Health', 'Practical', ['life', 'hearing']),
  e('Drop your child at the gate and leave. Standing there embarrasses them.', 'Life and reality', 'School', 'Warm', ['life', 'gate']),
  e('Book the band by the hour and write the end time down.', 'Life and reality', 'Weddings', 'Practical', ['life', 'band']),
  e('Service the scooter before the wedding season, not during it.', 'Life and reality', 'Vehicles', 'Practical', ['life', 'scooter']),
  h('राशन की दुकान पर बिल माँगो, यह हक़ है, एहसान नहीं।', 'Life and reality', 'पैसा', 'दृढ़', ['राशन', 'बिल']),
  h('टीवी की आवाज़ पर बहस से पहले कान जाँच लो।', 'Life and reality', 'सेहत', 'व्यावहारिक', ['कान', 'बहस']),
  h('बच्चे को गेट पर छोड़कर आ जाओ, वहाँ खड़े रहने से उसे शर्म आती है।', 'Life and reality', 'स्कूल', 'कोमल', ['गेट', 'शर्म']),
  h('बैंड घंटे के हिसाब से बुक करो और खत्म होने का वक़्त लिख लो।', 'Life and reality', 'शादी', 'व्यावहारिक', ['बैंड', 'वक़्त']),
  g('Ration ki dukaan par bill maango, yeh haq hai, ehsaan nahi.', 'Life and reality', 'Money', 'Firm', ['ration', 'bill']),
  g('TV ki awaaz par bahas se pehle kaan jaanch lo.', 'Life and reality', 'Health', 'Practical', ['kaan', 'bahas']),
  g('Bachche ko gate par chhodkar aa jao, wahan khade rehne se use sharam aati hai.', 'Life and reality', 'School', 'Warm', ['gate', 'sharam']),
  g('Band ghante ke hisaab se book karo aur khatam hone ka waqt likh lo.', 'Life and reality', 'Weddings', 'Practical', ['band', 'waqt']),

  /* ------------------------------------------------------ Motivational */
  e('A tool used openly is a tool that stops being a secret.', 'Motivational', 'Honesty', 'Wise', ['motivation', 'honesty']),
  e('Stand on the correct side and the conversation gets easier for everyone.', 'Motivational', 'Attention', 'Warm', ['motivation', 'attention']),
  e('An old scooter that starts is better than a new one you are paying for.', 'Motivational', 'Restraint', 'Direct', ['motivation', 'restraint']),
  h('जो औज़ार खुलकर इस्तेमाल हो, वो राज़ रहना बंद कर देता है।', 'Motivational', 'ईमानदारी', 'गंभीर', ['औज़ार', 'राज़']),
  h('सही तरफ़ खड़े हो जाओ, बातचीत सबके लिए आसान हो जाती है।', 'Motivational', 'ध्यान', 'कोमल', ['तरफ़', 'बातचीत']),
  h('पुराना स्कूटर जो स्टार्ट हो जाए, उस नए से बेहतर है जिसकी क़िस्त चल रही है।', 'Motivational', 'संयम', 'स्पष्ट', ['स्कूटर', 'क़िस्त']),
  g('Jo auzar khulkar istemaal ho, woh raaz rehna band kar deta hai.', 'Motivational', 'Honesty', 'Wise', ['auzar', 'raaz']),
  g('Sahi taraf khade ho jao, baatcheet sabke liye aasaan ho jaati hai.', 'Motivational', 'Attention', 'Warm', ['taraf', 'baatcheet']),
  g('Purana scooter jo start ho jaaye, us naye se behtar hai jiski qist chal rahi hai.', 'Motivational', 'Restraint', 'Direct', ['scooter', 'qist']),

  /* -------------------------------------------------------- Aesthetic */
  e('A shutter half open in the afternoon light is the shape of a small town.', 'Aesthetic', 'Cities', 'Warm', ['aesthetic', 'shutter']),
  e('A wedding band in matching shirts is the whole decoration.', 'Aesthetic', 'Weddings', 'Wry', ['aesthetic', 'band']),
  e('Keep the old scooter clean and it reads as a choice, not a shortage.', 'Aesthetic', 'Objects', 'Practical', ['aesthetic', 'scooter']),
  h('दोपहर की रोशनी में आधा खुला शटर छोटे कस्बे का आकार है।', 'Aesthetic', 'शहर', 'कोमल', ['शटर', 'रोशनी']),
  h('एक जैसी कमीज़ों वाला बैंड, पूरी सजावट है।', 'Aesthetic', 'शादी', 'सहज', ['कमीज़ों', 'बैंड']),
  g('Dopahar ki roshni mein aadha khula shutter chhote kasbe ka aakaar hai.', 'Aesthetic', 'Cities', 'Warm', ['shutter', 'roshni']),
  g('Ek jaisi kamizon wala band, poori sajawat hai.', 'Aesthetic', 'Weddings', 'Wry', ['kamizon', 'band']),

  /* ---------------------------------------------- Wider category band */
  e('Untreated hearing loss makes people tired in a way sleep does not fix.', 'Yoga and wellness', 'Health', 'Practical', ['yoga', 'hearing']),
  e('Write the school timings on the fridge and the morning gets calmer.', 'Student life', 'School', 'Practical', ['student', 'school']),
  e('A shop with a fixed shutter time has better cash flow than one that guesses.', 'Professional and business', 'Systems', 'Wise', ['professional', 'systems']),
  e('A fielder who stands on the wrong side of the sun loses the catch.', 'Cricket and sports', 'Cricket', 'Practical', ['cricket', 'fielding']),
  e('A scooter older than a marriage needs a mechanic more than a service centre.', 'Cars and bikes', 'Maintenance', 'Wry', ['cars', 'mechanic']),
  e('A shutter timing written into code saves an argument with every customer.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'systems']),
  e('Test the hearing aid batteries on the same day each month.', 'Science and curiosity', 'Routine', 'Practical', ['science', 'routine']),
  e('Charge by the hour and the customer stops asking for the whole night.', 'Startup and hustle', 'Pricing', 'Sharp', ['startup', 'pricing']),
  e('A gate that opens on time is the best thing a school can build.', 'Home and interiors', 'Neighbourhood', 'Warm', ['home', 'gate']),
  e('The funniest person at a wedding is the band leader watching the clock.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'band']),
  e('I will say out loud that the ration shop opens late on purpose.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who waits with you outside a ration shop has done the work.', 'Friendship', 'Support', 'Warm', ['friendship', 'ration']),
  e('My father hid his hearing aid in a drawer for two years and we let him.', 'Family', 'Parents', 'Aching', ['family', 'parents']),
  e('Listening properly is the closest thing to a practice I do daily.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'listening']),
  e('Photograph the shutter, not the shop. The shutter is the honest part.', 'Photography', 'Cities', 'Sharp', ['photography', 'shutter']),
  e('Leave the town at 7:40 and you will see everything it really is.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'morning']),
  e('A post about a hearing aid gets more replies than a post about a concert.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who faces you when you cannot hear me.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'listening']),
  e('I will not shout at my father to make my own point heard.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'family']),
  e('A shutter that stays down in monsoon is a family with no income that day.', 'Monsoon and seasons', 'Rain', 'Heavy', ['monsoon', 'shutter']),
  h('जो कान की कमी ठीक न हो, वो नींद से न मिटने वाली थकान देती है।', 'Yoga and wellness', 'सेहत', 'व्यावहारिक', ['कान', 'थकान']),
  h('स्कूल का वक़्त फ़्रिज पर लिखो, सुबह शांत हो जाती है।', 'Student life', 'स्कूल', 'व्यावहारिक', ['वक़्त', 'सुबह']),
  h('जिस दुकान का शटर तय वक़्त पर गिरता है, उसका हिसाब साफ़ रहता है।', 'Professional and business', 'व्यवस्था', 'गंभीर', ['शटर', 'हिसाब']),
  h('समय पर खुलने वाला गेट स्कूल की सबसे अच्छी चीज़ है।', 'Home and interiors', 'मोहल्ला', 'कोमल', ['गेट', 'स्कूल']),
  h('पापा ने दो साल हियरिंग एड दराज़ में छुपाकर रखा, और हम चुप रहे।', 'Family', 'माँ-बाप', 'भावुक', ['दराज़', 'साल']),
  h('ध्यान से सुनना रोज़ के अभ्यास में सबसे क़रीब है।', 'Spirituality and peace', 'अभ्यास', 'गंभीर', ['सुनना', 'अभ्यास']),
  g('Jo kaan ki kami theek na ho, woh neend se na mitne wali thakan deti hai.', 'Yoga and wellness', 'Health', 'Practical', ['kaan', 'thakan']),
  g('School ka waqt fridge par likho, subah shaant ho jaati hai.', 'Student life', 'School', 'Practical', ['waqt', 'subah']),
  g('Jis dukaan ka shutter tay waqt par girta hai, uska hisaab saaf rehta hai.', 'Professional and business', 'Systems', 'Wise', ['shutter', 'hisaab']),
  g('Samay par khulne wala gate school ki sabse acchi cheez hai.', 'Home and interiors', 'Neighbourhood', 'Warm', ['gate', 'school']),
  g('Papa ne do saal hearing aid daraz mein chhupakar rakha, aur hum chup rahe.', 'Family', 'Parents', 'Aching', ['daraz', 'saal']),
  g('Dhyan se sunna roz ke abhyaas mein sabse kareeb hai.', 'Spirituality and peace', 'Practice', 'Wise', ['sunna', 'abhyaas']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('लाठी वाले को पहले जाने देना, बिना किसी को बताए।', 'Attitude', 'अदब', 'कोमल', ['लाठी', 'बताए']),
  h('पुराना स्कूटर साफ़ रखो, वो मजबूरी नहीं, चुनाव लगता है।', 'Aesthetic', 'चीज़ें', 'व्यावहारिक', ['स्कूटर', 'चुनाव']),
  h('एक स्कूटर, एक हेलमेट, एक सर्विस कार्ड, बस इतना।', 'Minimal', 'सवारी', 'व्यावहारिक', ['हेलमेट', 'कार्ड']),
  g('Laathi wale ko pehle jaane dena, bina kisi ko bataye.', 'Attitude', 'Courtesy', 'Warm', ['laathi', 'bataye']),
  g('Purana scooter saaf rakho, woh majboori nahi, chunav lagta hai.', 'Aesthetic', 'Objects', 'Practical', ['scooter', 'chunav']),
  g('Ek scooter, ek helmet, ek service card, bas itna.', 'Minimal', 'Vehicles', 'Practical', ['helmet', 'card']),
  h('आख़िरी बच्चे के अंदर जाने के बाद गेट सबसे अकेली जगह होती है।', 'Alone and loneliness', 'अकेलापन', 'स्पष्ट', ['गेट', 'अकेली']),
  g('Aakhri bachche ke andar jaane ke baad gate sabse akeli jagah hoti hai.', 'Alone and loneliness', 'Solitude', 'Honest', ['gate', 'akeli']),
];
