/**
 * BioCraft original bios — batch 074.
 * Allocation from scripts/bios/balance.mjs: 44 EN / 33 HI / 33 HG.
 * New subject matter: the knife sharpener who cycles through the lane, a school
 * bag bought on credit, a father who reads slowly and hides it, the rooftop
 * water drum, a wedding invitation written by hand, a broken spectacles frame.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_074 = [
  /* ------------------------------------------------------------ Attitude */
  e('I take every knife in the house down when the sharpener cycles past.', 'Attitude', 'Preparedness', 'Practical', ['attitude', 'sharpener']),
  e('I pay the school bag instalment before the shoes.', 'Attitude', 'Priority', 'Firm', ['attitude', 'bag']),
  e('I never let my father catch me watching him read slowly.', 'Attitude', 'Dignity', 'Tender', ['attitude', 'reading']),
  h('साध वाला गली से गुज़रे तो घर के सारे चाकू नीचे ले आता हूँ।', 'Attitude', 'तैयारी', 'व्यावहारिक', ['चाकू', 'गली']),
  h('स्कूल बैग की क़िस्त जूतों से पहले चुकाता हूँ।', 'Attitude', 'प्राथमिकता', 'दृढ़', ['बैग', 'क़िस्त']),
  h('पापा को कभी महसूस नहीं होने देता कि मैं उन्हें धीरे पढ़ते देख रहा हूँ।', 'Attitude', 'इज़्ज़त', 'कोमल', ['पढ़ते', 'महसूस']),
  h('चश्मे का कब्ज़ा ठीक करा लेता हूँ, नया नहीं माँगता।', 'Attitude', 'किफ़ायत', 'व्यावहारिक', ['चश्मे', 'कब्ज़ा']),
  g('Saadh wala gali se guzre toh ghar ke saare chaaku neeche le aata hoon.', 'Attitude', 'Preparedness', 'Practical', ['chaaku', 'gali']),
  g('School bag ki qist jooton se pehle chukata hoon.', 'Attitude', 'Priority', 'Firm', ['bag', 'qist']),
  g('Papa ko kabhi mehsoos nahi hone deta ki main unhe dheere padhte dekh raha hoon.', 'Attitude', 'Dignity', 'Tender', ['padhte', 'mehsoos']),
  g('Chashme ka kabza theek kara leta hoon, naya nahi maangta.', 'Attitude', 'Thrift', 'Practical', ['chashme', 'kabza']),

  /* ------------------------------------------------------------- Love */
  e('You held the bag up and said it made me look like a student again.', 'Love and romance', 'Warmth', 'Warm', ['love', 'bag']),
  e('You read the invitation aloud so my father would not have to.', 'Love and romance', 'Tender care', 'Tender', ['love', 'invitation']),
  e('We filled the rooftop drum together and sat on the lid till midnight.', 'Love and romance', 'Ordinary days', 'Warm', ['love', 'drum']),
  h('तुमने बैग ऊपर उठाया और कहा कि मैं फिर से छात्र लगने लगा हूँ।', 'Love and romance', 'अपनापन', 'कोमल', ['बैग', 'छात्र']),
  h('तुमने न्योता ज़ोर से पढ़ा, ताकि पापा को न पढ़ना पड़े।', 'Love and romance', 'परवाह', 'कोमल', ['न्योता', 'पढ़ना']),
  h('तुमने चाकू की नोक से चश्मे का पेंच कसा और वो टिक गया।', 'Love and romance', 'छोटी बातें', 'कोमल', ['चश्मे', 'पेंच']),
  g('Tumne bag oopar uthaya aur kaha ki main phir se chhatra lagne laga hoon.', 'Love and romance', 'Warmth', 'Warm', ['bag', 'chhatra']),
  g('Tumne nyota zor se padha, taaki papa ko na padhna pade.', 'Love and romance', 'Tender care', 'Tender', ['nyota', 'padhna']),
  g('Tumne chaaku ki nok se chashme ka pench kasa aur woh tik gaya.', 'Love and romance', 'Small things', 'Warm', ['chashme', 'pench']),

  /* ------------------------------------------------------- Sad depth */
  e('My father reads slowly and has hidden it for thirty years.', 'Sad and heartbreak', 'Parents', 'Aching', ['sad', 'reading']),
  e('The school bag came on credit and I hid the shop name from my friends.', 'Sad and heartbreak', 'Money', 'Heavy', ['sad', 'bag']),
  e('The rooftop drum was empty for eleven days that summer.', 'Sad and heartbreak', 'Home', 'Heavy', ['sad', 'drum']),
  h('पापा धीरे पढ़ते हैं और तीस साल से यह बात छुपाए हुए हैं।', 'Sad and heartbreak', 'माँ-बाप', 'भावुक', ['पढ़ते', 'साल']),
  h('स्कूल बैग उधार पर आया और मैंने दुकान का नाम दोस्तों से छुपाया।', 'Sad and heartbreak', 'पैसा', 'भारी', ['बैग', 'दुकान']),
  h('उस गर्मी में छत का ड्रम ग्यारह दिन खाली रहा।', 'Sad and heartbreak', 'घर', 'भारी', ['ड्रम', 'गर्मी']),
  g('Papa dheere padhte hain aur tees saal se yeh baat chhupaye hue hain.', 'Sad and heartbreak', 'Parents', 'Aching', ['padhte', 'saal']),
  g('School bag udhaar par aaya aur maine dukaan ka naam doston se chhupaya.', 'Sad and heartbreak', 'Money', 'Heavy', ['bag', 'dukaan']),
  g('Us garmi mein chhat ka drum gyarah din khaali raha.', 'Sad and heartbreak', 'Home', 'Heavy', ['drum', 'garmi']),

  /* --------------------------------------------------------- Shayari */
  h('चाकू तेज़ हुआ,\nहाथ\nवही रहा।', 'Shayari', 'तीन पंक्ति', 'शांत', ['चाकू', 'हाथ']),
  h('ड्रम खाली,\nछत पर\nगर्मी।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['ड्रम', 'गर्मी']),
  g('Chaaku tez hua, haath wahi raha.', 'Shayari', 'Two line', 'Quiet', ['chaaku', 'haath']),
  g('Drum khaali, chhat par garmi.', 'Shayari', 'Two line', 'Deep', ['drum', 'garmi']),

  /* -------------------------------------------------- Quotes and ideas */
  e('A man who sharpens knives for a living knows every kitchen on the lane.', 'Quotes and thoughts', 'Cities', 'Warm', ['quotes', 'sharpener']),
  e('Reading slowly is not the same as not reading.', 'Quotes and thoughts', 'Dignity', 'Wise', ['quotes', 'reading']),
  e('A rooftop drum is a household weather report.', 'Quotes and thoughts', 'Home', 'Wry', ['quotes', 'drum']),
  e('A hand-written invitation carries the handwriting of a whole family.', 'Quotes and thoughts', 'Family', 'Warm', ['quotes', 'invitation']),
  h('जो आदमी चाकू तेज़ करके गुज़ारा करता है, वो गली की हर रसोई जानता है।', 'Quotes and thoughts', 'शहर', 'कोमल', ['चाकू', 'रसोई']),
  h('धीरे पढ़ना, न पढ़ने जैसा नहीं होता।', 'Quotes and thoughts', 'इज़्ज़त', 'गंभीर', ['धीरे', 'पढ़ना']),
  h('छत का ड्रम घर का मौसम बताता है।', 'Quotes and thoughts', 'घर', 'सहज', ['ड्रम', 'मौसम']),
  g('Jo aadmi chaaku tez karke guzaara karta hai, woh gali ki har rasoi jaanta hai.', 'Quotes and thoughts', 'Cities', 'Warm', ['chaaku', 'rasoi']),
  g('Dheere padhna, na padhne jaisa nahi hota.', 'Quotes and thoughts', 'Dignity', 'Wise', ['dheere', 'padhna']),
  g('Chhat ka drum ghar ka mausam bataata hai.', 'Quotes and thoughts', 'Home', 'Wry', ['drum', 'mausam']),

  /* ------------------------------------------------- Life and reality */
  e('Let the sharpener do the knives. A blunt knife cuts people.', 'Life and reality', 'Home', 'Practical', ['life', 'sharpener']),
  e('Buy the school bag in June, not in July when the shop knows you are late.', 'Life and reality', 'Money', 'Practical', ['life', 'bag']),
  e('Fill the drum before seven. After that the pressure dies.', 'Life and reality', 'Home', 'Practical', ['life', 'drum']),
  e('Hand-write one invitation in a family that sends printed cards.', 'Life and reality', 'Family', 'Warm', ['life', 'invitation']),
  h('चाकू साध वाले को दो, कुंद चाकू लोगों को काटता है।', 'Life and reality', 'घर', 'व्यावहारिक', ['चाकू', 'कुंद']),
  h('स्कूल बैग जून में लो, जुलाई में नहीं जब दुकान को पता हो तुम देर से आए हो।', 'Life and reality', 'पैसा', 'व्यावहारिक', ['बैग', 'जून']),
  h('ड्रम सात बजे से पहले भरो, उसके बाद प्रेशर मर जाता है।', 'Life and reality', 'घर', 'व्यावहारिक', ['ड्रम', 'प्रेशर']),
  h('जिस परिवार में छपे कार्ड जाते हैं, वहाँ एक न्योता हाथ से लिखो।', 'Life and reality', 'परिवार', 'कोमल', ['कार्ड', 'न्योता']),
  g('Chaaku saadh wale ko do, kund chaaku logon ko kaatta hai.', 'Life and reality', 'Home', 'Practical', ['chaaku', 'kund']),
  g('School bag June mein lo, July mein nahi jab dukaan ko pata ho tum der se aaye ho.', 'Life and reality', 'Money', 'Practical', ['bag', 'June']),
  g('Drum saat baje se pehle bharo, uske baad pressure mar jaata hai.', 'Life and reality', 'Home', 'Practical', ['drum', 'pressure']),
  g('Jis parivaar mein chhape card jaate hain, wahan ek nyota haath se likho.', 'Life and reality', 'Family', 'Warm', ['card', 'nyota']),

  /* ------------------------------------------------------ Motivational */
  e('Reading slowly and finishing is still finishing.', 'Motivational', 'Courage', 'Warm', ['motivation', 'reading']),
  e('A sharp knife costs five rupees and saves a finger.', 'Motivational', 'Foresight', 'Direct', ['motivation', 'foresight']),
  e('An instalment paid on time is a reputation bought cheaply.', 'Motivational', 'Integrity', 'Wise', ['motivation', 'integrity']),
  h('धीरे पढ़कर पूरा करना भी पूरा करना ही है।', 'Motivational', 'साहस', 'कोमल', ['धीरे', 'पूरा']),
  h('तेज़ चाकू पाँच रुपये का है और उँगली बचा लेता है।', 'Motivational', 'सूझबूझ', 'स्पष्ट', ['चाकू', 'उँगली']),
  h('समय पर चुकाई क़िस्त सस्ते में ख़रीदी इज़्ज़त है।', 'Motivational', 'ईमान', 'गंभीर', ['क़िस्त', 'इज़्ज़त']),
  g('Dheere padhkar poora karna bhi poora karna hi hai.', 'Motivational', 'Courage', 'Warm', ['dheere', 'poora']),
  g('Tez chaaku paanch rupaye ka hai aur ungli bacha leta hai.', 'Motivational', 'Foresight', 'Direct', ['chaaku', 'ungli']),
  g('Samay par chukai qist saste mein khareedi izzat hai.', 'Motivational', 'Integrity', 'Wise', ['qist', 'izzat']),

  /* -------------------------------------------------------- Aesthetic */
  e('A knife sharpened on a stone sounds like a whole lane waking up.', 'Aesthetic', 'Cities', 'Warm', ['aesthetic', 'sharpener']),
  e('A hand-written invitation in ink beats a printed card at any wedding.', 'Aesthetic', 'Weddings', 'Practical', ['aesthetic', 'invitation']),
  e('A rooftop drum in good light is a strange and honest still life.', 'Aesthetic', 'Home', 'Wry', ['aesthetic', 'drum']),
  h('पत्थर पर तेज़ किया चाकू पूरी गली के जागने जैसी आवाज़ करता है।', 'Aesthetic', 'शहर', 'कोमल', ['चाकू', 'आवाज़']),
  h('स्याही में हाथ से लिखा न्योता किसी भी शादी में छपे कार्ड से बेहतर है।', 'Aesthetic', 'शादी', 'व्यावहारिक', ['स्याही', 'कार्ड']),
  g('Patthar par tez kiya chaaku poori gali ke jaagne jaisi awaaz karta hai.', 'Aesthetic', 'Cities', 'Warm', ['chaaku', 'awaaz']),
  g('Syahi mein haath se likha nyota kisi bhi shaadi mein chhape card se behtar hai.', 'Aesthetic', 'Weddings', 'Practical', ['syahi', 'card']),

  /* ---------------------------------------------- Wider category band */
  e('Carrying a full drum up four floors is a back you will pay for.', 'Yoga and wellness', 'Body', 'Wry', ['yoga', 'drum']),
  e('Buy the bag before the session starts and you get the cheaper one.', 'Student life', 'Preparation', 'Practical', ['student', 'bag']),
  e('A shop that gives credit needs the name written, not remembered.', 'Professional and business', 'Money', 'Sharp', ['professional', 'money']),
  e('A fielder who cannot see the ball in the sun needs a cap, not excuses.', 'Cricket and sports', 'Cricket', 'Practical', ['cricket', 'fielding']),
  e('Get the spare key and the spare screw in the same trip.', 'Cars and bikes', 'Repairs', 'Practical', ['cars', 'repairs']),
  e('Photograph the receipt of an instalment. The shop will lose its copy.', 'Technology and coding', 'Craft', 'Practical', ['tech', 'receipts']),
  e('Sharpen at the correct angle and the edge lasts four times as long.', 'Science and curiosity', 'Method', 'Wise', ['science', 'method']),
  e('Offer the instalment plan before the customer asks for a discount.', 'Startup and hustle', 'Pricing', 'Sharp', ['startup', 'pricing']),
  e('A drum with a lid is the difference between water and a mosquito farm.', 'Home and interiors', 'Home', 'Practical', ['home', 'drum']),
  e('One good knife, properly kept, replaces four cheap ones.', 'Minimal', 'Kitchen', 'Practical', ['minimal', 'kitchen']),
  e('Clean spectacles make a face look awake. That is the whole grooming tip.', 'Stylish', 'Grooming', 'Practical', ['stylish', 'grooming']),
  e('I will say the bag was bought on credit and that it was worth it.', 'Savage and bold', 'Honesty', 'Sharp', ['savage', 'honesty']),
  e('The friend who reads the invitation aloud is protecting somebody dignity.', 'Friendship', 'Care', 'Warm', ['friendship', 'care']),
  e('My father reads the newspaper with his finger under each line.', 'Family', 'Parents', 'Aching', ['family', 'parents']),
  e('Reading slowly in a room full of fast readers is its own solitude.', 'Alone and loneliness', 'Solitude', 'Honest', ['alone', 'reading']),
  e('A drum filled at dawn is a small ritual with a measurable result.', 'Spirituality and peace', 'Practice', 'Wise', ['spirituality', 'practice']),
  e('Photograph the stone the sharpener carries. It is worn like a hand.', 'Photography', 'Work', 'Warm', ['photography', 'stone']),
  e('Walk a lane at six and you will hear the sharpener before you see him.', 'Travel and adventure', 'Cities', 'Warm', ['travel', 'lane']),
  e('A post about a father reading slowly gets more replies than a rank list.', 'Instagram profiles', 'Approach', 'Sharp', ['instagram', 'honest']),
  e('I am the person who reads the form aloud without being asked.', 'Personality and identity', 'Identity', 'Tender', ['personality', 'dignity']),
  e('I will not let a shop humiliate my father over a late instalment.', 'Self-respect', 'Worth', 'Firm', ['selfrespect', 'family']),
  h('चार मंज़िल ऊपर भरा ड्रम ले जाना कमर का क़र्ज़ है।', 'Yoga and wellness', 'शरीर', 'सहज', ['ड्रम', 'कमर']),
  h('सत्र शुरू होने से पहले बैग लो, सस्ता मिल जाएगा।', 'Student life', 'तैयारी', 'व्यावहारिक', ['बैग', 'सस्ता']),
  h('उधार देने वाली दुकान को नाम लिखना चाहिए, याद रखना नहीं।', 'Professional and business', 'पैसा', 'तीखा', ['उधार', 'नाम']),
  h('ढक्कन वाला ड्रम पानी और मच्छर के फ़र्क़ का फ़ैसला है।', 'Home and interiors', 'घर', 'व्यावहारिक', ['ड्रम', 'ढक्कन']),
  h('पापा अख़बार पढ़ते हैं, हर पंक्ति के नीचे उँगली रखकर।', 'Family', 'माँ-बाप', 'भावुक', ['अख़बार', 'उँगली']),
  h('सुबह भरा ड्रम एक छोटी रस्म है, जिसका नतीजा नापा जा सकता है।', 'Spirituality and peace', 'अभ्यास', 'गंभीर', ['ड्रम', 'नतीजा']),
  g('Chaar manzil oopar bhara drum le jaana kamar ka karz hai.', 'Yoga and wellness', 'Body', 'Wry', ['drum', 'kamar']),
  g('Satra shuru hone se pehle bag lo, sasta mil jayega.', 'Student life', 'Preparation', 'Practical', ['bag', 'sasta']),
  g('Udhaar dene wali dukaan ko naam likhna chahiye, yaad rakhna nahi.', 'Professional and business', 'Money', 'Sharp', ['udhaar', 'naam']),
  g('Dhakkan wala drum paani aur machhar ke farq ka faisla hai.', 'Home and interiors', 'Home', 'Practical', ['drum', 'dhakkan']),
  g('Papa akhbaar padhte hain, har pankti ke neeche ungli rakhkar.', 'Family', 'Parents', 'Aching', ['akhbaar', 'ungli']),
  g('Subah bhara drum ek chhoti rasm hai, jiska nateeja naapa ja sakta hai.', 'Spirituality and peace', 'Practice', 'Wise', ['drum', 'nateeja']),

  /* ------------------------- Hindi / Hinglish top-up to balance.mjs figure */
  h('चश्मे का पेंच ठीक करा लो, नया चश्मा महीने भर बाद।', 'Attitude', 'किफ़ायत', 'व्यावहारिक', ['चश्मे', 'पेंच']),
  h('तुमने नोक से चश्मे का पेंच कसा और पूरी फ़्रेम टिक गई।', 'Love and romance', 'छोटी बातें', 'कोमल', ['फ़्रेम', 'नोक']),
  h('साध वाला उस साल आना बंद हो गया जिस साल गली में बड़ी दुकान खुली।', 'Sad and heartbreak', 'काम', 'शांत', ['साध', 'दुकान']),
  g('Chashme ka pench theek kara lo, naya chashma mahine bhar baad.', 'Attitude', 'Thrift', 'Practical', ['chashme', 'pench']),
  g('Tumne nok se chashme ka pench kasa aur poori frame tik gayi.', 'Love and romance', 'Small things', 'Warm', ['frame', 'nok']),
  g('Saadh wala us saal aana band ho gaya jis saal gali mein badi dukaan khuli.', 'Sad and heartbreak', 'Work', 'Quiet', ['saadh', 'dukaan']),
];
