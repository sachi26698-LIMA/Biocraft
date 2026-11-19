/**
 * BioCraft original bios — batch 013.
 * The 16-18 band: cinema, savage, instagram, nature, photography, pets,
 * startup, cricket, cars, wedding, monsoon, funny.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_013 = [
  /* ------------------------------------------------------- Cinema and OTT */
  e('Will defend a flawed film longer than most people defend their jobs.', 'Cinema and OTT', 'Film lover', 'Warm', ['cinema', 'opinion']),
  e('Pauses to read the background signage.', 'Cinema and OTT', 'Detail', 'Observant', ['cinema', 'detail']),
  e('Series unfinished. Opinions formed. This is normal.', 'Cinema and OTT', 'Series', 'Wry', ['cinema', 'series']),
  e('The theatre seat is the only place I sit still.', 'Cinema and OTT', 'Theatres', 'Warm', ['cinema', 'theatre']),
  h('फ़िल्म थिएटर की कुर्सी ही जगह है जहाँ मैं शांत बैठता हूँ।', 'Cinema and OTT', 'सिनेमा प्रेम', 'सहज', ['कुर्सी', 'फ़िल्म']),
  h('बैकग्राउंड के साइनबोर्ड पढ़ने के लिए फ़िल्म रोक देता हूँ।', 'Cinema and OTT', 'सिनेमा प्रेम', 'मज़ाकिया', ['साइनबोर्ड', 'फ़िल्म']),
  g('Background ke signboard padhne ke liye film roka deta hoon.', 'Cinema and OTT', 'Detail', 'Funny', ['signboard', 'film']),
  g('Theatre ki kursi hi jagah hai jahan main shaant baithta hoon.', 'Cinema and OTT', 'Theatres', 'Warm', ['kursi', 'shaant']),

  /* -------------------------------------------------------- Savage and bold */
  e('I do not lose arguments. I just stop attending them.', 'Savage and bold', 'Savage', 'Sharp', ['savage', 'exit']),
  e('Your tone decided the outcome before your point arrived.', 'Savage and bold', 'Savage', 'Blunt', ['savage', 'tone']),
  e('Not everyone deserves the unfiltered version.', 'Savage and bold', 'Restraint', 'Cool', ['savage', 'restraint']),
  e('I apologise once. Rehearsing it is your hobby.', 'Savage and bold', 'Boundaries', 'Sharp', ['savage', 'apology']),
  h('बहस हारता नहीं, बस छोड़ देता हूँ।', 'Savage and bold', 'स्पष्टता', 'तीखा', ['बहस', 'छोड़ना']),
  h('लहजा ही नतीजा तय कर देता है, बात से पहले।', 'Savage and bold', 'स्पष्टता', 'तीखा', ['लहजा', 'नतीजा']),
  g('Bahas haarta nahi, bas chhod deta hoon.', 'Savage and bold', 'Savage', 'Sharp', ['bahas', 'chhod']),
  g('Lehja hi nateeja tay kar deta hai, baat se pehle.', 'Savage and bold', 'Savage', 'Blunt', ['lehja', 'nateeja']),

  /* ----------------------------------------------------- Instagram profiles */
  e('Feed is a mood. Story is the mess.', 'Instagram profiles', 'Feed', 'Wry', ['instagram', 'stories']),
  e('Posting less, living more. No announcement needed.', 'Instagram profiles', 'Feed', 'Calm', ['instagram', 'digital']),
  e('Places, not poses.', 'Instagram profiles', 'Feed', 'Terse', ['instagram', 'travel']),
  h('प्रोफ़ाइल मिज़ाज है, स्टोरी असली हाल।', 'Instagram profiles', 'प्रोफ़ाइल', 'सहज', ['प्रोफ़ाइल', 'स्टोरी']),
  h('जगहें दिखाता हूँ, पोज़ नहीं।', 'Instagram profiles', 'प्रोफ़ाइल', 'संक्षिप्त', ['जगहें', 'पोज़']),
  g('Profile mizaaj hai, story asli haal.', 'Instagram profiles', 'Feed', 'Wry', ['profile', 'story']),
  g('Jagahein dikhata hoon, pose nahi.', 'Instagram profiles', 'Feed', 'Terse', ['jagahein', 'pose']),

  /* ---------------------------------------------------------------- Nature */
  e('Goes to the hills to stop explaining myself to anyone.', 'Nature', 'Mountains', 'Free', ['nature', 'mountains']),
  e('Birdwatching taught me patience I did not have.', 'Nature', 'Birds', 'Calm', ['nature', 'birds']),
  e('Every plant on my balcony is a small stubborn argument.', 'Nature', 'Plants', 'Wry', ['nature', 'plants']),
  h('पहाड़ पर जाकर किसी को कुछ समझाना नहीं पड़ता।', 'Nature', 'पहाड़', 'आज़ाद', ['पहाड़', 'शांत']),
  h('पक्षी देखकर सब्र आया, जो पहले नहीं था।', 'Nature', 'पक्षी', 'शांत', ['पक्षी', 'सब्र']),
  g('Pahaad par jaake kisi ko kuch samjhana nahi padta.', 'Nature', 'Mountains', 'Free', ['pahaad', 'samjhana']),
  g('Pakshi dekh kar sabr aaya, jo pehle nahi tha.', 'Nature', 'Birds', 'Calm', ['pakshi', 'sabr']),

  /* ------------------------------------------------------------ Photography */
  e('Shoots the thing nobody noticed and makes it the subject.', 'Photography', 'Street', 'Observant', ['photography', 'street']),
  e('Golden hour is just a deadline with better lighting.', 'Photography', 'Light', 'Wry', ['photography', 'light']),
  e('Fifty frames, one keeper, that is a good day.', 'Photography', 'Process', 'Honest', ['photography', 'process']),
  h('जिसे किसी ने नहीं देखा, उसकी तस्वीर खींचता हूँ।', 'Photography', 'स्ट्रीट', 'सहज', ['तस्वीर', 'स्ट्रीट']),
  h('पचास तस्वीरें, एक सही — बढ़िया दिन।', 'Photography', 'प्रक्रिया', 'सहज', ['तस्वीरें', 'दिन']),
  g('Pachaas tasveerein, ek sahi — badhiya din.', 'Photography', 'Process', 'Honest', ['tasveerein', 'badhiya']),

  /* --------------------------------------------------------- Pets and animals */
  e('My dog has opinions about my schedule and he is right.', 'Pets and animals', 'Dogs', 'Funny', ['pets', 'dogs']),
  e('Feeds the neighbourhood cats. Owns none of them.', 'Pets and animals', 'Cats', 'Warm', ['pets', 'cats']),
  e('The aquarium is for me, not the fish.', 'Pets and animals', 'Home', 'Wry', ['pets', 'aquarium']),
  h('मेरा कुत्ता मेरे शेड्यूल पर राय रखता है, और सही है।', 'Pets and animals', 'कुत्ते', 'मज़ाकिया', ['कुत्ता', 'शेड्यूल']),
  h('गली की बिल्लियों को खाना देता हूँ, कोई अपनी नहीं है।', 'Pets and animals', 'बिल्ली', 'कोमल', ['बिल्लियाँ', 'खाना']),
  g('Mera kutta mere schedule par raay rakhta hai, aur sahi hai.', 'Pets and animals', 'Dogs', 'Funny', ['kutta', 'raay']),
  g('Gully ki billiyon ko khaana deta hoon, koi apni nahi hai.', 'Pets and animals', 'Cats', 'Warm', ['gully', 'khaana']),

  /* ----------------------------------------------------- Startup and hustle */
  e('Builder, not talker. With receipts.', 'Startup and hustle', 'Builder', 'Direct', ['startup', 'builder']),
  e('The product is a hypothesis with a login page.', 'Startup and hustle', 'Reality', 'Wry', ['startup', 'product']),
  e('Small team, short meetings, long patience.', 'Startup and hustle', 'Operator', 'Practical', ['startup', 'team']),
  h('बनाता हूँ, बोलता कम हूँ।', 'Startup and hustle', 'शुरुआत', 'स्पष्ट', ['बनाना', 'बोलना']),
  h('छोटी टीम, छोटी मीटिंग, लंबा सब्र।', 'Startup and hustle', 'तरीका', 'व्यावहारिक', ['टीम', 'सब्र']),
  g('Banata hoon, bolta kam hoon. Bas itna.', 'Startup and hustle', 'Builder', 'Direct', ['banata', 'bolta']),
  g('Chhoti team, chhoti meeting, lamba sabr.', 'Startup and hustle', 'Operator', 'Practical', ['team', 'sabr']),

  /* -------------------------------------------------------- Cricket and sports */
  e('Morning walks, evening cricket, no excuses in between.', 'Cricket and sports', 'Cricket', 'Steady', ['cricket', 'routine']),
  e('Bowls slowly and accurately, like a bad idea arriving on time.', 'Cricket and sports', 'Cricket', 'Wry', ['cricket', 'bowling']),
  e('Lost every match in 2014. Still talk about it.', 'Cricket and sports', 'Sports', 'Warm', ['cricket', 'memory']),
  h('सुबह टहलना, शाम क्रिकेट, बीच में बहाना नहीं।', 'Cricket and sports', 'क्रिकेट', 'दृढ़', ['क्रिकेट', 'सुबह']),
  h('2014 में सब मैच हारे, आज भी याद हैं।', 'Cricket and sports', 'खेल भावना', 'सहज', ['मैच', 'याद']),
  g('Subah chalna, shaam cricket, beech mein bahaana nahi.', 'Cricket and sports', 'Cricket', 'Steady', ['subah', 'cricket']),
  g('2014 mein sab match haare, aaj bhi yaad hain.', 'Cricket and sports', 'Sportsmanship', 'Warm', ['match', 'yaad']),

  /* ---------------------------------------------------------- Cars and bikes */
  e('Washes the bike more often than the dishes.', 'Cars and bikes', 'Riding', 'Funny', ['bike', 'humour']),
  e('Prefer the long route when it has fewer traffic lights.', 'Cars and bikes', 'Roads', 'Wry', ['roads', 'commute']),
  e('Learned to ride slow before learning to ride fast.', 'Cars and bikes', 'Riding', 'Wise', ['bike', 'patience']),
  h('बाइक बर्तनों से ज़्यादा धोता हूँ।', 'Cars and bikes', 'सफ़र', 'मज़ाकिया', ['बाइक', 'बर्तन']),
  h('तेज़ चलाने से पहले धीरे चलना सीखा।', 'Cars and bikes', 'सफ़र', 'गंभीर', ['धीरे', 'बाइक']),
  g('Bike bartanon se zyada dhotaa hoon.', 'Cars and bikes', 'Riding', 'Funny', ['bike', 'bartan']),
  g('Tez chalane se pehle dheere chalna seekha.', 'Cars and bikes', 'Riding', 'Wise', ['dheere', 'seekha']),

  /* ------------------------------------------------ Wedding and celebration */
  e('Dresses for the photos, stays for the dessert.', 'Wedding and celebration', 'Guest life', 'Playful', ['wedding', 'dessert']),
  e('Will dance despite having no measurable rhythm.', 'Wedding and celebration', 'Dance', 'Funny', ['wedding', 'dance']),
  h('तस्वीरों के लिए तैयार होता हूँ, मिठाई के लिए रुकता हूँ।', 'Wedding and celebration', 'मेहमान', 'मज़ाकिया', ['तस्वीरें', 'मिठाई']),
  h('सुर में नहीं, फिर भी नाचता हूँ।', 'Wedding and celebration', 'नाच', 'मज़ाकिया', ['नाच', 'सुर']),
  g('Tasveeron ke liye taiyaar hota hoon, mithai ke liye rukta hoon.', 'Wedding and celebration', 'Guest life', 'Funny', ['tasveerein', 'mithai']),
  g('Sur mein nahi, phir bhi naachta hoon.', 'Wedding and celebration', 'Dance', 'Playful', ['sur', 'naachta']),

  /* ---------------------------------------------- Monsoon and seasons */
  e('Keeps one umbrella and loses it annually.', 'Monsoon and seasons', 'Monsoon', 'Wry', ['monsoon', 'umbrella']),
  e('Summer is a test I keep failing with style.', 'Monsoon and seasons', 'Summer', 'Funny', ['summer', 'seasons']),
  h('एक ही छाता रखता हूँ, हर साल खो देता हूँ।', 'Monsoon and seasons', 'बारिश', 'मज़ाकिया', ['छाता', 'साल']),
  h('गर्मी मेरी परीक्षा है, और मैं फेल होता हूँ।', 'Monsoon and seasons', 'गर्मी', 'मज़ाकिया', ['गर्मी', 'परीक्षा']),
  g('Ek hi chhata rakhta hoon, har saal kho deta hoon.', 'Monsoon and seasons', 'Monsoon', 'Funny', ['chhata', 'saal']),
  g('Garmi meri pareeksha hai, aur main fail hota hoon.', 'Monsoon and seasons', 'Summer', 'Funny', ['garmi', 'pareeksha']),

  /* ----------------------------------------------------- Funny and comedy */
  e('My whole personality is caffeine and unfinished projects.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['funny', 'projects']),
  e('Very confident for someone with this much unfinished work.', 'Funny and comedy', 'Self-deprecating', 'Wry', ['funny', 'honest']),
  e('Functioning on optimism and leftovers.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['funny', 'everyday']),
  h('मेरा पूरा व्यक्तित्व चाय और अधूरे कामों से बना है।', 'Funny and comedy', 'मज़ाक', 'मज़ाकिया', ['चाय', 'काम']),
  h('इतना अधूरा काम होने पर भी आत्मविश्वास पूरा है।', 'Funny and comedy', 'मज़ाक', 'मज़ाकिया', ['काम', 'आत्मविश्वास']),
  g('Mera pura vyaktitva chai aur adhoore kaamon se bana hai.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['chai', 'kaam']),
  g('Itna adhoora kaam hone par bhi atmavishwas poora hai.', 'Funny and comedy', 'Self-deprecating', 'Wry', ['adhoora', 'atmavishwas']),

  /* ------------------------------------------------- Depth on the leaders */
  e('Confidence is a habit I built one uncomfortable day at a time.', 'Attitude', 'Growth', 'Steady', ['attitude', 'growth']),
  e('Some people are lessons. Very few are home.', 'Love and romance', 'Clarity', 'Wise', ['love', 'clarity']),
  e('Grief does not shrink. You just get bigger around it.', 'Sad and heartbreak', 'Grief', 'Heavy', ['sad', 'grief']),
  h('आत्मविश्वास रोज़ थोड़ा-थोड़ा बनाया, एक बार में नहीं।', 'Attitude', 'विकास', 'दृढ़', ['आत्मविश्वास', 'विकास']),
  h('कुछ लोग सबक होते हैं, घर बहुत कम।', 'Love and romance', 'स्पष्टता', 'गंभीर', ['लोग', 'घर']),
  g('Atmavishwas roz thoda thoda banaya, ek baar mein nahi.', 'Attitude', 'Growth', 'Steady', ['atmavishwas', 'banaya']),
  g('Kuch log sabak hote hain, ghar bahut kam.', 'Love and romance', 'Clarity', 'Wise', ['log', 'ghar']),

  /* ------------------------------------------ Quotes / life / aesthetic */
  e('A good routine is a quiet form of ambition.', 'Quotes and thoughts', 'Habit', 'Wise', ['quotes', 'routine']),
  e('Choose the harder conversation over the longer resentment.', 'Life and reality', 'Honesty', 'Direct', ['life', 'honesty']),
  e('Beauty is mostly attention, paid properly.', 'Aesthetic', 'Understanding', 'Wise', ['aesthetic', 'attention']),
  h('अच्छी दिनचर्या महत्वाकांक्षा का शांत रूप है।', 'Quotes and thoughts', 'आदत', 'गंभीर', ['दिनचर्या', 'आदत']),
  h('लंबी नाराज़गी से अच्छी है छोटी सी सच्ची बात।', 'Life and reality', 'ईमानदारी', 'स्पष्ट', ['नाराज़गी', 'सच्ची']),
  g('Acchi dincharya mahatvakanksha ka shaant roop hai.', 'Quotes and thoughts', 'Habit', 'Wise', ['dincharya', 'shaant']),
  g('Lambi naraazgi se acchi hai chhoti si sacchi baat.', 'Life and reality', 'Honesty', 'Direct', ['naraazgi', 'sacchi']),
];
