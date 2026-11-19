/**
 * BioCraft original bios — batch 079.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: kite string cut over a terrace, a mother's stitching money
 * kept in a tin, the hospital token window at six, a ceiling that leaks in one
 * spot, a scooter that starts on the fourth kick, and a shop shutter that is
 * half a foot short.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_079 = [
  /* ------------------------------------------------------------ Attitude */
  e('I hand the kite back when the string is cut over my terrace.', 'Attitude', 'Fairness', 'Warm', ['attitude', 'kite']),
  e('I never ask my mother where her stitching money goes.', 'Attitude', 'Respect', 'Tender', ['attitude', 'stitching']),
  e('I hold the hospital token queue for the man behind me too.', 'Attitude', 'Courtesy', 'Warm', ['attitude', 'hospital']),
  e('I put a bucket under the leak and go back to work.', 'Attitude', 'Composure', 'Composed', ['attitude', 'leak']),
  h('छत पर कटी पतंग का धागा मिले तो पतंग लौटा देता हूँ।', 'Attitude', 'इंसाफ़', 'कोमल', ['पतंग', 'धागा']),
  h('माँ से कभी नहीं पूछता कि उनके सिलाई के पैसे कहाँ जाते हैं।', 'Attitude', 'लिहाज़', 'कोमल', ['सिलाई', 'पैसे']),
  h('अस्पताल की टोकन क़तार में पीछे वाले आदमी की जगह भी सँभालता हूँ।', 'Attitude', 'शिष्टाचार', 'कोमल', ['टोकन', 'क़तार']),
  h('छत से टपकते पानी के नीचे बाल्टी रखकर काम पर लौट जाता हूँ।', 'Attitude', 'संयम', 'शांत', ['बाल्टी', 'छत']),
  g('Chhat par kati patang ka dhaaga mile toh patang lauta deta hoon.', 'Attitude', 'Fairness', 'Warm', ['patang', 'dhaaga']),
  g('Maa se kabhi nahi poochhta ki unke silai ke paise kahan jaate hain.', 'Attitude', 'Respect', 'Tender', ['silai', 'paise']),
  g('Hospital ki token kataar mein peeche wale aadmi ki jagah bhi sambhalta hoon.', 'Attitude', 'Courtesy', 'Warm', ['token', 'kataar']),
  g('Chhat se tapakte paani ke neeche baalti rakh kar kaam par laut jaata hoon.', 'Attitude', 'Composure', 'Composed', ['baalti', 'chhat']),

  /* ------------------------------------------------------------- Love */
  e('You held the token while I ran for my mother\'s report.', 'Love and romance', 'Care', 'Tender', ['love', 'hospital']),
  e('You climbed the terrace at six for a kite that was already gone.', 'Love and romance', 'Small things', 'Warm', ['love', 'kite']),
  e('You kept the tin of stitching money on the shelf and never opened it.', 'Love and romance', 'Trust', 'Tender', ['love', 'stitching']),
  h('तुमने टोकन थामे रखा जब मैं माँ की रिपोर्ट लेने भागा था।', 'Love and romance', 'ख़याल', 'कोमल', ['टोकन', 'रिपोर्ट']),
  h('तुम छह बजे छत पर चढ़े उस पतंग के लिए जो जा चुकी थी।', 'Love and romance', 'छोटी बातें', 'कोमल', ['पतंग', 'छत']),
  h('सिलाई के पैसों का डिब्बा तुमने आलमारी पर रखा और कभी नहीं खोला।', 'Love and romance', 'भरोसा', 'कोमल', ['डिब्बा', 'आलमारी']),
  g('Tumne token thaame rakha jab main maa ki report lene bhaaga tha.', 'Love and romance', 'Care', 'Tender', ['token', 'report']),
  g('Tum chhe baje chhat par chadhe us patang ke liye jo ja chuki thi.', 'Love and romance', 'Small things', 'Warm', ['patang', 'chhat']),
  g('Silai ke paison ka dibba tumne almaari par rakha aur kabhi nahi khola.', 'Love and romance', 'Trust', 'Tender', ['dibba', 'almaari']),

  /* ------------------------------------------------------- Sad depth */
  e('My mother stitched for eleven houses and we ate at nine every night.', 'Sad and heartbreak', 'Parents', 'Heavy', ['sad', 'stitching']),
  e('The hospital token window opened at six and closed before my father reached it.', 'Sad and heartbreak', 'Illness', 'Heavy', ['sad', 'hospital']),
  e('The ceiling leaked in one spot for four years and we called it a place.', 'Sad and heartbreak', 'Home', 'Quiet', ['sad', 'leak']),
  e('My scooter needed four kicks long after I had saved for a new one.', 'Sad and heartbreak', 'Money', 'Aching', ['sad', 'scooter']),
  h('माँ ग्यारह घरों के कपड़े सिलती थीं और हम रोज़ नौ बजे खाना खाते थे।', 'Sad and heartbreak', 'माँ-बाप', 'भारी', ['सिलाई', 'खाना']),
  h('अस्पताल का टोकन खिड़की छह बजे खुला था और पापा के पहुँचने से पहले बंद हो गया।', 'Sad and heartbreak', 'बीमारी', 'भारी', ['टोकन', 'खिड़की']),
  h('छत चार साल एक ही जगह से टपकती रही और हमने उसे जगह कहना सीख लिया।', 'Sad and heartbreak', 'घर', 'शांत', ['छत', 'जगह']),
  h('नई गाड़ी के पैसे जमा होने के बाद भी स्कूटर चार किक से चलता था।', 'Sad and heartbreak', 'पैसा', 'भावुक', ['स्कूटर', 'किक']),
  g('Maa gyarah gharon ke kapde silti thi aur hum roz nau baje khaana khaate the.', 'Sad and heartbreak', 'Parents', 'Heavy', ['silai', 'khaana']),
  g('Hospital ka token khidki chhe baje khula tha aur Papa ke pahunchne se pehle band ho gaya.', 'Sad and heartbreak', 'Illness', 'Heavy', ['token', 'khidki']),
  g('Chhat chaar saal ek hi jagah se tapti rahi aur humne use jagah kahna seekh liya.', 'Sad and heartbreak', 'Home', 'Quiet', ['chhat', 'jagah']),
  g('Nayi gaadi ke paise jama hone ke baad bhi scooter chaar kick se chalta tha.', 'Sad and heartbreak', 'Money', 'Aching', ['scooter', 'kick']),

  /* --------------------------------------------------------- Shayari */
  h('धागा कटा,\nपतंग गई,\nछत ख़ाली।', 'Shayari', 'तीन पंक्ति', 'शांत', ['धागा', 'छत']),
  h('डिब्बा खुला,\nसिक्के गिने,\nहिसाब बाक़ी।', 'Shayari', 'तीन पंक्ति', 'तीखा', ['डिब्बा', 'सिक्के']),
  g('Dhaaga kata tha, patang gayi thi, chhat khaali thi.', 'Shayari', 'Two line', 'Quiet', ['dhaaga', 'chhat']),
  g('Dibba khula tha, sikke gine the, hisaab baaki tha.', 'Shayari', 'Two line', 'Sharp', ['dibba', 'sikke']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A cut kite belongs to the terrace it lands on, and to nobody else.', 'Quotes and thoughts', 'Fairness', 'Wise', ['quotes', 'kite']),
  e('A tin of stitching money is a bank with no passbook.', 'Quotes and thoughts', 'Money', 'Warm', ['quotes', 'stitching']),
  e('A token window is where a family learns how much a day costs.', 'Quotes and thoughts', 'Illness', 'Heavy', ['quotes', 'hospital']),
  e('A leak you have named is a leak you have accepted.', 'Quotes and thoughts', 'Home', 'Sharp', ['quotes', 'leak']),
  h('कटी पतंग उसी छत की है जिस पर गिरी, किसी और की नहीं।', 'Quotes and thoughts', 'इंसाफ़', 'गंभीर', ['पतंग', 'छत']),
  h('सिलाई के पैसों का डिब्बा बिना पासबुक वाला बैंक है।', 'Quotes and thoughts', 'पैसा', 'कोमल', ['डिब्बा', 'बैंक']),
  h('टोकन की खिड़की वहाँ है जहाँ परिवार को एक दिन की क़ीमत पता चलती है।', 'Quotes and thoughts', 'बीमारी', 'भारी', ['खिड़की', 'क़ीमत']),
  g('Kati patang usi chhat ki hai jis par giri, kisi aur ki nahi.', 'Quotes and thoughts', 'Fairness', 'Wise', ['patang', 'chhat']),
  g('Silai ke paison ka dibba bina passbook wala bank hai.', 'Quotes and thoughts', 'Money', 'Warm', ['dibba', 'bank']),
  g('Token ki khidki wahan hai jahan parivar ko ek din ki keemat pata chalti hai.', 'Quotes and thoughts', 'Illness', 'Heavy', ['khidki', 'keemat']),

  /* ------------------------------------------------- Life and reality */
  e('Return a kite that lands on your terrace. Somebody paid for it.', 'Life and reality', 'Cities', 'Warm', ['life', 'kite']),
  e('Ask your mother what she is saving for, once, gently.', 'Life and reality', 'Family', 'Tender', ['life', 'stitching']),
  e('Reach the hospital token window before six. It closes without announcing.', 'Life and reality', 'Illness', 'Practical', ['life', 'hospital']),
  e('Fix the leak before the monsoon, not in the third week of it.', 'Life and reality', 'Home', 'Practical', ['life', 'leak']),
  e('Service the scooter in April so it starts in July.', 'Life and reality', 'Cars', 'Practical', ['life', 'scooter']),
  h('छत पर गिरी पतंग लौटाओ, किसी ने उसके पैसे दिए हैं।', 'Life and reality', 'शहर', 'कोमल', ['पतंग', 'छत']),
  h('माँ से एक बार, धीरे से पूछो कि वो किस चीज़ के लिए बचा रही हैं।', 'Life and reality', 'परिवार', 'कोमल', ['माँ', 'बचत']),
  h('अस्पताल की टोकन खिड़की छह से पहले पहुँचो, बिना बताए बंद हो जाती है।', 'Life and reality', 'बीमारी', 'व्यावहारिक', ['खिड़की', 'अस्पताल']),
  h('छत का रिसाव बारिश से पहले ठीक कराओ, बारिश के तीसरे हफ़्ते में नहीं।', 'Life and reality', 'घर', 'व्यावहारिक', ['रिसाव', 'बारिश']),
  h('सिलाई करते हुए माँ चश्मा पहनती थीं, सुई में धागा डालते वक़्त।', 'Life and reality', 'परिवार', 'कोमल', ['सुई', 'चश्मा']),
  h('स्कूटर मच्छरदानी की तरह चौथी किक पर ही चलता है।', 'Life and reality', 'गाड़ियाँ', 'सहज', ['स्कूटर', 'किक']),
  g('Silai karte waqt Maa chashma pehnti thi, sui mein dhaaga daalte waqt.', 'Life and reality', 'Family', 'Tender', ['sui', 'chashma']),
  g('Scooter machhardaani ki tarah chauti kick par hi chalta hai.', 'Life and reality', 'Cars', 'Wry', ['scooter', 'kick']),
  g('Chhat par giri patang lautao, kisi ne uske paise diye hain.', 'Life and reality', 'Cities', 'Warm', ['patang', 'chhat']),
  g('Maa se ek baar, dheere se poochho ki woh kis cheez ke liye bacha rahi hain.', 'Life and reality', 'Family', 'Tender', ['Maa', 'bachat']),
  g('Hospital ki token khidki chhe se pehle pahuncho, bina bataye band ho jaati hai.', 'Life and reality', 'Illness', 'Practical', ['khidki', 'hospital']),
  g('Chhat ka risaav baarish se pehle theek karao, baarish ke teesre hafte mein nahi.', 'Life and reality', 'Home', 'Practical', ['risaav', 'baarish']),

  /* ------------------------------------------------------ Motivational */
  e('A mother who stitches for eleven houses is not a small business.', 'Motivational', 'Work', 'Warm', ['motivation', 'work']),
  e('Reach early for the thing that cannot wait. Paperwork never waits.', 'Motivational', 'Discipline', 'Direct', ['motivation', 'discipline']),
  e('Name the leak, then fix it. Naming alone will cost you four years.', 'Motivational', 'Resilience', 'Sharp', ['motivation', 'resilience']),
  h('ग्यारह घरों के लिए सिलने वाली माँ छोटा कारोबार नहीं है।', 'Motivational', 'काम', 'कोमल', ['माँ', 'कारोबार']),
  h('जो चीज़ रुक नहीं सकती उसके लिए जल्दी पहुँचो, काग़ज़ी काम इंतज़ार नहीं करता।', 'Motivational', 'अनुशासन', 'स्पष्ट', ['काग़ज़ी', 'इंतज़ार']),
  h('रिसाव को नाम दो, फिर ठीक करो। सिर्फ़ नाम देने में चार साल लगे।', 'Motivational', 'सब्र', 'तीखा', ['रिसाव', 'साल']),
  g('Gyarah gharon ke liye silne wali Maa chhota karobar nahi hai.', 'Motivational', 'Work', 'Warm', ['Maa', 'karobar']),
  g('Jo cheez ruk nahi sakti uske liye jaldi pahuncho, kaghzi kaam intezaar nahi karta.', 'Motivational', 'Discipline', 'Direct', ['kaghzi', 'intezaar']),
  g('Risaav ko naam do, phir theek karo. Sirf naam dene mein chaar saal lage.', 'Motivational', 'Resilience', 'Sharp', ['risaav', 'saal']),

  /* -------------------------------------------------------- Aesthetic */
  e('A kite string across a terrace at dusk is a thin black signature.', 'Aesthetic', 'Cities', 'Quiet', ['aesthetic', 'kite']),
  e('Stitching thread on a sewing machine spool looks like a small rainbow.', 'Aesthetic', 'Objects', 'Warm', ['aesthetic', 'stitching']),
  e('Rain in a bucket under a ceiling leak makes a sound you can sleep to.', 'Aesthetic', 'Home', 'Warm', ['aesthetic', 'leak']),
  h('शाम को छत के ऊपर से गुज़रता पतंग का धागा एक पतली काली लकीर है।', 'Aesthetic', 'शहर', 'शांत', ['धागा', 'छत']),
  h('सिलाई मशीन के रील पर लिपटा धागा छोटी सतरंगी झलक जैसा लगता है।', 'Aesthetic', 'चीज़ें', 'कोमल', ['रील', 'धागा']),
  g('Shaam ko chhat ke upar se guzarta patang ka dhaaga ek patli kaali lakeer hai.', 'Aesthetic', 'Cities', 'Quiet', ['dhaaga', 'chhat']),
  g('Silai machine ke reel par lipta dhaaga chhoti satrangi jhalak jaisa lagta hai.', 'Aesthetic', 'Objects', 'Warm', ['reel', 'dhaaga']),

  /* ---------------------------------------------- Wider category band */
  e('A mother stitching at home runs a business with no shop and no rent.', 'Professional and business', 'Craft', 'Wise', ['professional', 'stitching']),
  e('A friend who stands in the token queue for you has already helped.', 'Friendship', 'Care', 'Warm', ['friendship', 'hospital']),
  e('Keep the hospital folder ready before the emergency, not during it.', 'Student life', 'Admin', 'Practical', ['student', 'admin']),
  e('Photograph the meter reading when you rent. Landlords forget numbers.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'proof']),
  e('A ceiling leak marks the room it owns with a pale ring.', 'Home and interiors', 'Repairs', 'Wry', ['home', 'repairs']),
  e('One bucket, one mug, one line of stitching at a time. That is how it is done.', 'Minimal', 'Rhythm', 'Warm', ['minimal', 'rhythm']),
  e('A mother\'s cotton saree, ironed once, is the most composed thing in a room.', 'Stylish', 'Simplicity', 'Warm', ['stylish', 'simplicity']),
  e('The funniest thing at a token window is everybody arriving at once at six.', 'Funny and comedy', 'Observation', 'Wry', ['funny', 'queue']),
  e('I will say the leak is my landlord\'s and my bucket is mine. That is all.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('My mother sewed my school uniforms until the year I outgrew her patience.', 'Family', 'Parents', 'Tender', ['family', 'parents']),
  e('A terrace at dusk with a cut string on it is a specific loneliness.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'terrace']),
  e('Sweeping the terrace before the pigeons come is a small daily rite.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the leak\'s ring, not the bucket. The ring keeps growing.', 'Photography', 'Home', 'Wry', ['photography', 'home']),
  e('A hill town in monsoon has a leak in every room and a bucket in every one.', 'Travel and adventure', 'Monsoon', 'Warm', ['travel', 'monsoon']),
  e('A profile that says my mother stitches for eleven houses says everything.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who returns a kite and keeps a bucket ready.', 'Personality and identity', 'Identity', 'Warm', ['personality', 'identity']),
  e('I will queue at six for my own paperwork and not send anyone else.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'dignity']),
  e('The first monsoon rain on a hot terrace smells like iron and dust.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'rain']),
  h('घर से सिलने वाली माँ बिना दुकान और बिना किराये का कारोबार चलाती है।', 'Professional and business', 'हुनर', 'गंभीर', ['सिलाई', 'कारोबार']),
  h('जो दोस्त तुम्हारे लिए टोकन की क़तार में खड़ा हो, उसने मदद कर दी।', 'Friendship', 'ख़याल', 'कोमल', ['दोस्त', 'टोकन']),
  h('अस्पताल का फ़ोल्डर इमरजेंसी से पहले तैयार रखो, इमरजेंसी में नहीं।', 'Student life', 'दफ़्तरी काम', 'व्यावहारिक', ['फ़ोल्डर', 'इमरजेंसी']),
  h('स्कूटर जो चार किक माँगता है उसे सर्विस चाहिए, दुआ नहीं।', 'Cars and bikes', 'रखरखाव', 'व्यावहारिक', ['स्कूटर', 'सर्विस']),
  h('एक बाल्टी, एक मग, एक बार में एक सिलाई। काम ऐसे ही होता है।', 'Minimal', 'लय', 'कोमल', ['बाल्टी', 'सिलाई']),
  h('माँ की इस्तरी की हुई सूती साड़ी कमरे की सबसे संयत चीज़ होती है।', 'Stylish', 'सादगी', 'कोमल', ['साड़ी', 'सादगी']),
  g('Ghar se silne wali Maa bina dukaan aur bina kiraye ka karobar chalati hai.', 'Professional and business', 'Craft', 'Wise', ['silai', 'karobar']),
  g('Jo dost tumhare liye token ki kataar mein khada ho, usne madad kar di.', 'Friendship', 'Care', 'Warm', ['dost', 'token']),
  g('Hospital ka folder emergency se pehle taiyaar rakho, emergency mein nahi.', 'Student life', 'Admin', 'Practical', ['folder', 'emergency']),
  g('Scooter jo chaar kick maangta hai use service chahiye, dua nahi.', 'Cars and bikes', 'Maintenance', 'Practical', ['scooter', 'service']),
  g('Ek baalti, ek mug, ek baar mein ek silai. Kaam aise hi hota hai.', 'Minimal', 'Rhythm', 'Warm', ['baalti', 'silai']),
  g('Maa ki istri ki hui sooti saadi kamre ki sabse sanyat cheez hoti hai.', 'Stylish', 'Simplicity', 'Warm', ['saadi', 'simplicity']),
];
