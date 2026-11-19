/**
 * BioCraft original bios — batch 022.
 * Proportional 40/30/30: leaders + mid-field top-ups.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_022 = [
  /* -------------------------------------------------------------- Attitude */
  e('I am not stubborn. I am simply finished explaining.', 'Attitude', 'Restraint', 'Dry', ['attitude', 'restraint']),
  e('My energy is not a public utility.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'energy']),
  e('You can be disappointed in me and still be wrong.', 'Attitude', 'Confidence', 'Witty', ['attitude', 'confidence']),
  e('I earn my quiet. Nobody hands it to me.', 'Attitude', 'Composure', 'Steady', ['attitude', 'quiet']),
  e('I would rather be alone than be managed.', 'Attitude', 'Independence', 'Firm', ['attitude', 'independence']),
  e('Some respect is only visible in what people stop asking you for.', 'Attitude', 'Standards', 'Wise', ['attitude', 'respect']),
  h('मैं ज़िद्दी नहीं, बस समझाना ख़त्म कर चुका हूँ।', 'Attitude', 'संयम', 'शांत', ['ज़िद्दी', 'समझाना']),
  h('मेरी ऊर्जा किसी की सार्वजनिक सेवा नहीं है।', 'Attitude', 'सीमाएं', 'तीखा', ['ऊर्जा', 'सेवा']),
  h('मैं अकेला रहना पसंद करूँगा, मैनेज होना नहीं।', 'Attitude', 'आज़ादी', 'दृढ़', ['अकेला', 'मैनेज']),
  h('कुछ इज़्ज़त वो होती है जो इंसान से मांगना बंद हो जाता है।', 'Attitude', 'मानक', 'गंभीर', ['इज़्ज़त', 'मांगना']),
  g('Main ziddi nahi, bas samjhana khatam kar chuka hoon.', 'Attitude', 'Restraint', 'Dry', ['ziddi', 'samjhana']),
  g('Meri energy kisi ki sarvajanik seva nahi hai.', 'Attitude', 'Boundaries', 'Sharp', ['energy', 'sarvajanik']),
  g('Main akela rehna pasand karunga, manage hona nahi.', 'Attitude', 'Independence', 'Firm', ['akela', 'manage']),

  /* ------------------------------------------------------ Love and romance */
  e('You are my favourite person to sit in traffic with.', 'Love and romance', 'Closeness', 'Sweet', ['love', 'traffic']),
  e('I want to be old with you and still argue about films.', 'Love and romance', 'Future', 'Warm', ['love', 'future']),
  e('Love is the small kindness nobody asked for.', 'Love and romance', 'Real love', 'Wise', ['love', 'kindness']),
  e('I like who I am when I am with you. That is the whole review.', 'Love and romance', 'Admiration', 'Honest', ['love', 'identity']),
  e('You are the part of my day I do not schedule.', 'Love and romance', 'Closeness', 'Tender', ['love', 'time']),
  h('तुम मेरे पसंदीदा इंसान हो जिसके साथ ट्रैफ़िक में भी बैठा जाए।', 'Love and romance', 'नज़दीकी', 'कोमल', ['ट्रैफ़िक', 'साथ']),
  h('मुझे तुम्हारे साथ बूढ़ा होना है और फ़िल्मों पर झगड़ते रहना है।', 'Love and romance', 'भविष्य', 'कोमल', ['बूढ़ा', 'फ़िल्में']),
  h('प्यार वो छोटी मेहरबानी है जो किसी ने मांगी नहीं।', 'Love and romance', 'निभाना', 'गंभीर', ['प्यार', 'मेहरबानी']),
  h('तुम मेरे दिन का वो हिस्सा हो जिसकी योजना नहीं बनती।', 'Love and romance', 'नज़दीकी', 'कोमल', ['दिन', 'योजना']),
  g('Tum mere pasandeeda insaan ho jiske saath traffic mein bhi baitha jaye.', 'Love and romance', 'Closeness', 'Sweet', ['traffic', 'saath']),
  g('Mujhe tumhare saath budha hona hai aur filmon par ladhna hai.', 'Love and romance', 'Future', 'Warm', ['budha', 'filmon']),
  g('Pyaar woh chhoti meherbani hai jo kisi ne maangi nahi.', 'Love and romance', 'Real love', 'Wise', ['pyaar', 'meherbani']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I am doing well by every measure except the ones you used.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'recovery']),
  e('Some goodbyes are delivered by silence.', 'Sad and heartbreak', 'Ending', 'Heavy', ['sad', 'silence']),
  e('I stopped mourning the ending and started mourning the effort.', 'Sad and heartbreak', 'Grief', 'Raw', ['sad', 'grief']),
  e('You are the only habit I could not replace.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'habit']),
  h('तुम्हारे पैमाने छोड़कर बाकी हर पैमाने से मैं ठीक हूँ।', 'Sad and heartbreak', 'उबरना', 'स्पष्ट', ['पैमाने', 'ठीक']),
  h('कुछ विदाई चुप्पी से दी जाती है।', 'Sad and heartbreak', 'अंत', 'गंभीर', ['विदाई', 'चुप्पी']),
  h('अंत का गम छोड़ा, कोशिश का गम सबसे मुश्किल था।', 'Sad and heartbreak', 'गम', 'भावुक', ['कोशिश', 'गम']),
  h('तुम अकेली आदत हो जिसे बदल नहीं सका।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['आदत', 'बदल']),
  g('Tumhare paimane chhodkar baaki har paimane se main theek hoon.', 'Sad and heartbreak', 'Recovery', 'Honest', ['paimane', 'theek']),
  g('Kuch vidaai chuppi se di jaati hai.', 'Sad and heartbreak', 'Ending', 'Heavy', ['vidaai', 'chuppi']),
  g('Tum akele aadat ho jise badal nahi saka.', 'Sad and heartbreak', 'Longing', 'Aching', ['aadat', 'badal']),

  /* ------------------------------------------------------ Shayari depth */
  h('मैंने तुझे खोया,\nपर ज़िंदगी नहीं।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['खोया', 'ज़िंदगी']),
  h('हर चीज़ का वक़्त होता है,\nहमारा वक़्त शायद कम था।', 'Shayari', 'दो पंक्ति', 'भावुक', ['वक़्त', 'चीज़']),
  h('मैं चलता चला गया,\nऔर मंज़िल ने खुद इंतज़ार छोड़ दिया।', 'Shayari', 'दो पंक्ति', 'प्रेरक', ['चलना', 'मंज़िल']),
  h('तेरे बिना भी\nदरवाज़ा खटखटाता है, हवा के लिए।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['दरवाज़ा', 'हवा']),
  h('जो सच बोल देता हूँ,\nउसी से दूर चला जाता हूँ।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['सच', 'दूर']),
  g('Maine tujhe khoya, par zindagi nahi.', 'Shayari', 'Two line', 'Deep', ['khoya', 'zindagi']),
  g('Har cheez ka waqt hota hai, hamara waqt shayad kam tha.', 'Shayari', 'Two line', 'Aching', ['waqt', 'shayad']),
  g('Main chalta chala gaya, aur manzil ne khud intezaar chhod diya.', 'Shayari', 'Two line', 'Motivational', ['chalta', 'manzil']),
  g('Tere bina bhi darwaaza khatkhataata hai, hawa ke liye.', 'Shayari', 'Two line', 'Romantic', ['darwaaza', 'hawa']),
  g('Jo sach bol deta hoon, usi se door chala jaata hoon.', 'Shayari', 'Two line', 'Deep', ['sach', 'door']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('A rebuttal is not an argument, and volume is not evidence.', 'Quotes and thoughts', 'Discernment', 'Sharp', ['quotes', 'argument']),
  e('You cannot be a beginner and a critic at the same time.', 'Quotes and thoughts', 'Craft', 'Wise', ['quotes', 'beginner']),
  e('The quietest person in the room is often the most decisive.', 'Quotes and thoughts', 'Composure', 'Wise', ['quotes', 'quiet']),
  h('पलटवार बहस नहीं होता, और ऊंची आवाज़ सबूत नहीं।', 'Quotes and thoughts', 'समझ', 'तीखा', ['आवाज़', 'सबूत']),
  h('कोई एक ही समय में शुरुआती और आलोचक नहीं हो सकता।', 'Quotes and thoughts', 'काम', 'गंभीर', ['शुरुआती', 'आलोचक']),
  g('Palatwar bahas nahi hota, aur oonchi awaaz saboot nahi.', 'Quotes and thoughts', 'Discernment', 'Sharp', ['palatwar', 'awaaz']),
  g('Koi ek hi samay mein shuruaati aur aalochak nahi ho sakta.', 'Quotes and thoughts', 'Craft', 'Wise', ['shuruaati', 'aalochak']),

  /* ------------------------------------------------------ Life and reality */
  e('You cannot heal in the same room that hurt you.', 'Life and reality', 'Environment', 'Wise', ['life', 'environment']),
  e('The boring habit is the one that will still be there in March.', 'Life and reality', 'Habit', 'Practical', ['life', 'habit']),
  e('Say the thing now and save everyone a month of guessing.', 'Life and reality', 'Honesty', 'Direct', ['life', 'honesty']),
  h('जिस कमरे ने दुख दिया, वहीं रहकर ठीक नहीं हो सकते।', 'Life and reality', 'माहौल', 'गंभीर', ['कमरा', 'दुख']),
  h('जो बात अभी कह दो, एक महीने का अंदाज़ा बच जाएगा।', 'Life and reality', 'ईमानदारी', 'स्पष्ट', ['बात', 'अंदाज़ा']),
  g('Jis kamre ne dukh diya, wahin rehkar theek nahi ho sakte.', 'Life and reality', 'Environment', 'Wise', ['kamre', 'theek']),
  g('Jo baat abhi keh do, ek mahine ka andaaza bach jayega.', 'Life and reality', 'Honesty', 'Direct', ['baat', 'andaaza']),

  /* --------------------------------------------------- Motivational depth */
  e('You do not need permission to begin. You need eight minutes.', 'Motivational', 'Starting', 'Encouraging', ['motivation', 'starting']),
  e('Momentum forgives a lot of early mistakes.', 'Motivational', 'Momentum', 'Wise', ['motivation', 'momentum']),
  h('शुरू करने की इजाज़त नहीं चाहिए, आठ मिनट चाहिए।', 'Motivational', 'शुरुआत', 'प्रेरक', ['शुरुआत', 'मिनट']),
  h('गति शुरुआती गलतियों का बहुत कुछ छोड़ देती है।', 'Motivational', 'गति', 'गंभीर', ['गति', 'गलतियाँ']),
  g('Shuru karne ki ijazat nahi chahiye, aath minute chahiye.', 'Motivational', 'Starting', 'Encouraging', ['shuru', 'minute']),
  g('Gati shuruaati galtiyon ka bahut kuch chhod deti hai.', 'Motivational', 'Momentum', 'Wise', ['gati', 'galtiyon']),

  /* ---------------------------------- Aesthetic / royal / professional */
  e('A calm palette and one messy shelf.', 'Aesthetic', 'Palette', 'Wry', ['aesthetic', 'palette']),
  e('I dress like the meeting might matter. It usually does.', 'Professional and business', 'Presentation', 'Practical', ['business', 'presentation']),
  e('Good manners are just good strategy that outlived fashion.', 'Royal and VIP', 'Bearing', 'Wise', ['royal', 'manners']),
  e('The people I trust keep their word on small things.', 'Professional and business', 'Trust', 'Wise', ['business', 'trust']),
  h('शांत रंग और एक बिखरी अलमारी, बस इतना ही।', 'Aesthetic', 'रंग', 'सहज', ['रंग', 'अलमारी']),
  h('मैं ऐसे समझता हूँ जैसे बात अहम हो सकती है, और होती भी है।', 'Professional and business', 'तैयारी', 'व्यावहारिक', ['बात', 'तैयारी']),
  g('Shaant rang aur ek bikharo almari, bas itna hi.', 'Aesthetic', 'Palette', 'Wry', ['rang', 'almari']),
  g('Main aise taiyaar hota hoon jaise baat ahem ho sakti hai.', 'Professional and business', 'Presentation', 'Practical', ['taiyaar', 'baat']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('Three chords, one honest song, no autotune.', 'Music and art', 'Music', 'Honest', ['music', 'honest']),
  e('I sing badly and loudly. It is a package deal.', 'Music and art', 'Music', 'Funny', ['music', 'funny']),
  e('My yoga mat is mostly a place to think.', 'Yoga and wellness', 'Practice', 'Wry', ['yoga', 'thinking']),
  e('Breathing exercises fixed more than any app did.', 'Yoga and wellness', 'Practice', 'Practical', ['yoga', 'breath']),
  e('I own two shirts and both are excellent.', 'Minimal', 'Wardrobe', 'Minimal', ['minimal', 'wardrobe']),
  e('Never bought a gadget I could not justify twice.', 'Technology and coding', 'Tools', 'Practical', ['tech', 'tools']),
  h('तीन सुर, एक सच्चा गाना, कोई ऑटोट्यून नहीं।', 'Music and art', 'संगीत', 'सहज', ['सुर', 'गाना']),
  h('मेरी योगा मैट ज़्यादातर सोचने की जगह है।', 'Yoga and wellness', 'अभ्यास', 'मज़ाकिया', ['योगा', 'सोचना']),
  h('सांस के अभ्यास ने ऐप से ज़्यादा काम किया।', 'Yoga and wellness', 'अभ्यास', 'व्यावहारिक', ['सांस', 'काम']),
  h('मेरे पास दो शर्ट हैं और दोनों बेहतरीन हैं।', 'Minimal', 'सादगी', 'संक्षिप्त', ['शर्ट', 'बेहतरीन']),
  g('Teen sur, ek sach wala gaana, koi autotune nahi.', 'Music and art', 'Music', 'Honest', ['sur', 'gaana']),
  g('Meri yoga mat zyadatar sochne ki jagah hai.', 'Yoga and wellness', 'Practice', 'Wry', ['yoga', 'sochne']),
  g('Saans ke abhyaas ne app se zyada kaam kiya.', 'Yoga and wellness', 'Practice', 'Practical', ['saans', 'kaam']),
  g('Mere paas do shirt hain aur dono behtareen hain.', 'Minimal', 'Wardrobe', 'Minimal', ['shirt', 'behtareen']),
];
