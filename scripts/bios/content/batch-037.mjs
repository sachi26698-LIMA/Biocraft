/**
 * BioCraft original bios — batch 037.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_037 = [
  /* ------------------------------------------------------------ Attitude */
  e('There is no race worth running against somebody I would not take advice from.', 'Attitude', 'Standards', 'Firm', ['attitude', 'race']),
  e('Ask me twice and the answer becomes no.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'boundaries']),
  e('I am not cold. I am simply unavailable to drama.', 'Attitude', 'Composure', 'Dry', ['attitude', 'drama']),
  h('जिनकी इज़्ज़त नहीं करता, उनसे मुक़ाबला नहीं करता।', 'Attitude', 'मानक', 'दृढ़', ['इज़्ज़त', 'मुक़ाबला']),
  h('दो बार पूछोगे तो जवाब ना हो जाएगा।', 'Attitude', 'सीमाएं', 'तीखा', ['पूछोगे', 'जवाब']),
  h('मैं ठंडा नहीं हूँ, बस नाटक के लिए खाली नहीं हूँ।', 'Attitude', 'संयम', 'शांत', ['ठंडा', 'नाटक']),
  g('Jinki izzat nahi karta, unse muqabla nahi karta.', 'Attitude', 'Standards', 'Firm', ['izzat', 'muqabla']),
  g('Do baar poochoge toh jawaab na ho jayega.', 'Attitude', 'Boundaries', 'Sharp', ['poochoge', 'jawaab']),
  g('Main thanda nahi hoon, bas naatak ke liye khaali nahi hoon.', 'Attitude', 'Composure', 'Dry', ['thanda', 'naatak']),

  /* ------------------------------------------------------------- Love */
  e('You are my favourite interruption.', 'Love and romance', 'Playful', 'Sweet', ['love', 'playful']),
  e('We do not need a big life together. Only an honest one.', 'Love and romance', 'Real love', 'Tender', ['love', 'honest']),
  e('I fell for the way you treat people who cannot help you.', 'Love and romance', 'Character', 'Warm', ['love', 'character']),
  e('Hold my hand in traffic and I will believe in the city again.', 'Love and romance', 'Small things', 'Warm', ['love', 'city']),
  h('तुम मेरी सबसे पसंदीदा रुकावट हो।', 'Love and romance', 'खेल', 'कोमल', ['रुकावट', 'पसंदीदा']),
  h('हमें बड़ी ज़िंदगी नहीं चाहिए, ईमानदार ज़िंदगी चाहिए।', 'Love and romance', 'सच्चा प्यार', 'कोमल', ['ज़िंदगी', 'ईमानदार']),
  h('उनसे प्यार हुआ जो उनसे भी अच्छा बर्ताव करते हैं जो कुछ नहीं कर सकते।', 'Love and romance', 'चरित्र', 'कोमल', ['बर्ताव', 'प्यार']),
  g('Tum meri sabse pasandida rukaavat ho.', 'Love and romance', 'Playful', 'Sweet', ['rukaavat', 'pasandida']),
  g('Humein badi zindagi nahi chahiye, imaandaar zindagi chahiye.', 'Love and romance', 'Real love', 'Tender', ['zindagi', 'imaandaar']),
  g('Unse pyaar hua jo unse bhi accha bartaav karte hain jo kuch nahi kar sakte.', 'Love and romance', 'Character', 'Warm', ['bartaav', 'pyaar']),

  /* ------------------------------------------------------- Sad depth */
  e('There is a room in me where you still keep your things.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'memory']),
  e('Time did not heal it. It just taught me to carry it.', 'Sad and heartbreak', 'Healing', 'Honest', ['sad', 'healing']),
  e('I learned your habits, then had to unlearn coming home to them.', 'Sad and heartbreak', 'Aftermath', 'Heavy', ['sad', 'aftermath']),
  h('मेरे भीतर एक कमरा है जहाँ तुम्हारी चीज़ें अब भी रखी हैं।', 'Sad and heartbreak', 'याद', 'भावुक', ['कमरा', 'चीज़ें']),
  h('वक़्त ने भरा नहीं, बस उठाना सिखा दिया।', 'Sad and heartbreak', 'उबरना', 'स्पष्ट', ['वक़्त', 'सिखा']),
  h('तुम्हारी आदतें सीखीं, फिर घर लौटना भूलना पड़ा।', 'Sad and heartbreak', 'अंजाम', 'भारी', ['आदतें', 'भूलना']),
  g('Mere bheetar ek kamra hai jahan tumhari cheezein ab bhi rakhi hain.', 'Sad and heartbreak', 'Memory', 'Aching', ['kamra', 'cheezein']),
  g('Waqt ne bhara nahi, bas uthaana sikha diya.', 'Sad and heartbreak', 'Healing', 'Honest', ['waqt', 'sikha']),
  g('Tumhari aadatein seekhin, phir ghar lautna bhoolna pada.', 'Sad and heartbreak', 'Aftermath', 'Heavy', ['aadatein', 'bhoolna']),

  /* ---------------------------------------------------------- Shayari */
  h('धूप ढलते ही\nघर लौटना\nआदत थी तेरी।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['धूप', 'घर']),
  h('मैंने चाँद\nकभी माँगा नहीं,\nबस तेरा हाथ माँगा था।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['चाँद', 'हाथ']),
  h('चल पड़े\nजब दोनों अपनी राह,\nरास्ता वही रहा।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['राह', 'रास्ता']),
  g('Dhoop dhalte hi ghar lautna aadat thi teri.', 'Shayari', 'Two line', 'Aching', ['dhoop', 'ghar']),
  g('Maine chaand kabhi maanga nahi, bas tera haath maanga tha.', 'Shayari', 'Two line', 'Romantic', ['chaand', 'haath']),
  g('Chal pade jab dono apni raah, raasta wahi raha.', 'Shayari', 'Two line', 'Deep', ['raah', 'raasta']),

  /* -------------------------------------------------- Quotes and ideas */
  e('You cannot reason someone out of a feeling they enjoy.', 'Quotes and thoughts', 'People', 'Wise', ['quotes', 'feelings']),
  e('The obstacle is usually an unmade decision.', 'Quotes and thoughts', 'Action', 'Direct', ['quotes', 'decision']),
  e('Politeness is not weakness. It is cheaper conflict.', 'Quotes and thoughts', 'Conflict', 'Wise', ['quotes', 'politeness']),
  h('जो भावना अच्छी लगती है, उससे तर्क से कोई बाहर नहीं आता।', 'Quotes and thoughts', 'लोग', 'गंभीर', ['भावना', 'तर्क']),
  h('रुकावट अक्सर वो फ़ैसला है जो नहीं लिया।', 'Quotes and thoughts', 'कर्म', 'स्पष्ट', ['रुकावट', 'फ़ैसला']),
  h('अदब कमज़ोरी नहीं है, यह सस्ता पंगा है।', 'Quotes and thoughts', 'पंगा', 'तीखा', ['अदब', 'पंगा']),
  g('Jo bhaavna achhi lagti hai, usse tark se koi bahar nahi aata.', 'Quotes and thoughts', 'People', 'Wise', ['bhaavna', 'tark']),
  g('Rukaavat aksar woh faisla hai jo nahi liya.', 'Quotes and thoughts', 'Action', 'Direct', ['rukaavat', 'faisla']),
  g('Adab kamzori nahi hai, yeh sasta panga hai.', 'Quotes and thoughts', 'Conflict', 'Sharp', ['adab', 'panga']),

  /* ------------------------------------------------- Life and reality */
  e('Your embarrassment has a shorter half-life than you think.', 'Life and reality', 'Perspective', 'Warm', ['life', 'embarrassment']),
  e('Health is the only deadline that will not wait.', 'Life and reality', 'Health', 'Direct', ['life', 'health']),
  e('Learn to leave the party without saying sorry five times.', 'Life and reality', 'Boundaries', 'Wry', ['life', 'leaving']),
  e('A good chair and a warm meal can fix a bad week.', 'Life and reality', 'Comfort', 'Warm', ['life', 'comfort']),
  h('तुम्हारी ग़लती का ख़याल तुमसे ज़्यादा किसी को नहीं है।', 'Life and reality', 'नज़रिया', 'कोमल', ['ग़लती', 'ख़याल']),
  h('सेहत ही वो आख़िरी तारीख़ है जो रुकती नहीं।', 'Life and reality', 'सेहत', 'स्पष्ट', ['सेहत', 'तारीख़']),
  h('पार्टी से पाँच बार माफ़ी माँगे बिना निकलना सीखो।', 'Life and reality', 'सीमाएं', 'सहज', ['पार्टी', 'माफ़ी']),
  g('Tumhari galti ka khayal tumse zyada kisi ko nahi hai.', 'Life and reality', 'Perspective', 'Warm', ['galti', 'khayal']),
  g('Sehat hi woh aakhiri taarikh hai jo rukti nahi.', 'Life and reality', 'Health', 'Direct', ['sehat', 'taarikh']),
  g('Party se paanch baar maafi maange bina nikalna seekho.', 'Life and reality', 'Boundaries', 'Wry', ['party', 'maafi']),

  e('A good week is three ordinary habits done without drama.', 'Life and reality', 'Habits', 'Practical', ['life', 'habits']),
  e('Learn to say no before you learn to say sorry.', 'Life and reality', 'Boundaries', 'Direct', ['life', 'no']),

  /* ------------------------------------------------------ Motivational */
  e('Momentum is built in five-minute units.', 'Motivational', 'Momentum', 'Direct', ['motivation', 'momentum']),
  e('Your first draft is not a failure. It is a map.', 'Motivational', 'Creative work', 'Warm', ['motivation', 'draft']),
  e('Be the person who does the small thing nobody asked for.', 'Motivational', 'Character', 'Wise', ['motivation', 'character']),
  h('रफ़्तार पाँच-पाँच मिनट में बनती है।', 'Motivational', 'गति', 'स्पष्ट', ['रफ़्तार', 'मिनट']),
  h('पहला ड्राफ़्ट नाकामी नहीं है, नक़्शा है।', 'Motivational', 'काम', 'कोमल', ['ड्राफ़्ट', 'नक़्शा']),
  g('Raftaar paanch-paanch minute mein banti hai.', 'Motivational', 'Momentum', 'Direct', ['raftaar', 'minute']),
  g('Pehla draft nakaami nahi hai, naqsha hai.', 'Motivational', 'Creative work', 'Warm', ['draft', 'naqsha']),

  /* -------------------------------------------------------- Aesthetic */
  e('Space is the most generous gift you can give a room.', 'Aesthetic', 'Design', 'Composed', ['aesthetic', 'design']),
  e('Buy fewer, keep longer, repair often.', 'Aesthetic', 'Objects', 'Practical', ['aesthetic', 'objects']),
  e('Good white paint and clean grout do most of the work.', 'Aesthetic', 'Home', 'Practical', ['aesthetic', 'paint']),
  h('कमरा जिसे सबसे उदार तोहफ़ा देना चाहो, वो जगह है।', 'Aesthetic', 'डिज़ाइन', 'शांत', ['कमरा', 'जगह']),
  h('कम ख़रीदो, लंबे वक़्त रखो, अक्सर ठीक करवाओ।', 'Aesthetic', 'चीज़ें', 'व्यावहारिक', ['ख़रीदो', 'ठीक']),
  g('Kam kharido, lambe waqt rakho, aksar theek karwao.', 'Aesthetic', 'Objects', 'Practical', ['kharido', 'theek']),
  g('Achhi safed paint aur saaf grout aadha kaam kar dete hain.', 'Aesthetic', 'Home', 'Practical', ['paint', 'grout']),

  /* ----------------------------------------------- Royal and creator */
  e('The well-dressed person is the one you remember, not the loudest.', 'Royal and VIP', 'Presence', 'Poised', ['royal', 'presence']),
  e('Good manners are a form of quiet power.', 'Royal and VIP', 'Manners', 'Poised', ['royal', 'manners']),
  e('Anybody can go viral. Few can be trusted.', 'Creator and influencer', 'Trust', 'Firm', ['creator', 'trust']),
  e('Share the process. Keep the private life private.', 'Creator and influencer', 'Boundaries', 'Wise', ['creator', 'boundaries']),
  h('याद वो रहता है जो ढंग से तैयार हो, वो नहीं जो सबसे ऊँचा बोले।', 'Royal and VIP', 'मौजूदगी', 'शांत', ['तैयार', 'याद']),
  h('अच्छे तौर-तरीक़े भी शक्ति हैं, बस शांत।', 'Royal and VIP', 'तौर-तरीक़े', 'शांत', ['तौर-तरीक़े', 'शक्ति']),
  g('Yaad woh rehta hai jo dhang se taiyaar ho, woh nahi jo sabse ooncha bole.', 'Royal and VIP', 'Presence', 'Poised', ['dhang', 'yaad']),
  g('Achhe taur-tareeqe bhi shakti hain, bas shaant.', 'Royal and VIP', 'Manners', 'Poised', ['taur', 'shakti']),
  g('Koi bhi viral ho sakta hai, bharosa kam log kamate hain.', 'Creator and influencer', 'Trust', 'Firm', ['viral', 'bharosa']),

  /* --------------------------------------------------- Mid-field top-up */
  e('Read the poem out loud and the weak line will tell on itself.', 'Poetry', 'Craft', 'Practical', ['poetry', 'revision']),
  e('Keep a shelf for the books that changed your mind.', 'Books and reading', 'Reader life', 'Warm', ['books', 'shelf']),
  e('Salt at the end of cooking is worth more than salt at the start.', 'Food and cooking', 'Technique', 'Wise', ['food', 'salt']),
  e('Stretch like you mean it and your knees will thank you at forty.', 'Fitness', 'Mobility', 'Practical', ['fitness', 'stretch']),
  e('A portrait is a conversation with permission.', 'Photography', 'Portraits', 'Wise', ['photography', 'portraits']),
  e('Every musician is a student who never stopped practising.', 'Music and art', 'Practice', 'Warm', ['music', 'student']),
  e('Feed the street dogs on the same corner and they will remember you.', 'Pets and animals', 'Animals', 'Warm', ['pets', 'dogs']),
  e('Watch one film three times and learn how it was built.', 'Cinema and OTT', 'Study', 'Practical', ['cinema', 'study']),
  e('Keep a spare umbrella and become everyone favourite colleague.', 'Monsoon and seasons', 'Rain', 'Wry', ['monsoon', 'umbrella']),
  e('Travel with one bag and you will meet more people.', 'Travel and adventure', 'Light travel', 'Warm', ['travel', 'bag']),
  h('कविता ज़ोर से पढ़ो, कमज़ोर पंक्ति खुद बता देगी।', 'Poetry', 'रचना', 'व्यावहारिक', ['कविता', 'पंक्ति']),
  h('आख़िर में डाला नमक शुरू के नमक से बेहतर होता है।', 'Food and cooking', 'तरीक़ा', 'गंभीर', ['नमक', 'तरीक़ा']),
  h('छाता साथ रखो और सबका पसंदीदा साथी बन जाओ।', 'Monsoon and seasons', 'बारिश', 'सहज', ['छाता', 'साथी']),
  h('एक बैग से सफ़र करो, ज़्यादा लोग मिलेंगे।', 'Travel and adventure', 'हल्का सफ़र', 'कोमल', ['बैग', 'सफ़र']),
  g('Kavita zor se padho, kamzor pankti khud bata degi.', 'Poetry', 'Craft', 'Practical', ['kavita', 'pankti']),
  g('Aakhir mein daala namak shuru ke namak se behtar hota hai.', 'Food and cooking', 'Technique', 'Wise', ['namak', 'behtar']),
  g('Chhata saath rakho aur sabka pasandida saathi ban jao.', 'Monsoon and seasons', 'Rain', 'Wry', ['chhata', 'saathi']),
  g('Ek bag se safar karo, zyada log milenge.', 'Travel and adventure', 'Light travel', 'Warm', ['bag', 'safar']),
];
