/**
 * BioCraft original bios — batch 030.
 * Strict 40/30/30 proportion; leaders + mid-field top-ups.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_030 = [
  /* -------------------------------------------------------------- Attitude */
  e('I am not difficult. I am finished with the polite version.', 'Attitude', 'Directness', 'Blunt', ['attitude', 'direct']),
  e('You cannot negotiate with someone who has already left.', 'Attitude', 'Boundaries', 'Cool', ['attitude', 'boundaries']),
  e('I have a soft voice and a hard line.', 'Attitude', 'Bearing', 'Composed', ['attitude', 'bearing']),
  e('My standards are not a phase. They are the whole point.', 'Attitude', 'Standards', 'Firm', ['attitude', 'standards']),
  e('I would rather be inconvenient than dishonest.', 'Attitude', 'Integrity', 'Steady', ['attitude', 'integrity']),
  e('Stop explaining yourself to people who enjoy the confusion.', 'Attitude', 'Restraint', 'Sharp', ['attitude', 'restraint']),
  e('I am not here to be liked. I am here to be accurate.', 'Attitude', 'Directness', 'Dry', ['attitude', 'accuracy']),
  h('मैं मुश्किल नहीं, बस शिष्ट संस्करण से थक चुका हूँ।', 'Attitude', 'स्पष्टता', 'स्पष्ट', ['मुश्किल', 'संस्करण']),
  h('मेरी आवाज़ नरम है, हद पक्की है।', 'Attitude', 'सलीका', 'शांत', ['आवाज़', 'हद']),
  h('मैं सुविधाजनक होने से बेहतर ईमानदार हूँ।', 'Attitude', 'ईमानदारी', 'दृढ़', ['सुविधा', 'ईमानदार']),
  g('Main mushkil nahi, bas shisht sanskaran se thak chuka hoon.', 'Attitude', 'Directness', 'Blunt', ['mushkil', 'sanskaran']),
  g('Meri awaaz naram hai, hadd pakki hai.', 'Attitude', 'Bearing', 'Composed', ['awaaz', 'hadd']),
  g('Main suvidhajanak hone se behtar imaandaar hoon.', 'Attitude', 'Integrity', 'Steady', ['suvidha', 'imaandaar']),

  /* ------------------------------------------------------ Love and romance */
  e('You are the person I want to grow predictable with.', 'Love and romance', 'Commitment', 'Sweet', ['love', 'commitment']),
  e('I love you most on the days you are not trying.', 'Love and romance', 'Closeness', 'Tender', ['love', 'honesty']),
  e('We are not perfect and we are not pretending.', 'Love and romance', 'Real love', 'Honest', ['love', 'honesty']),
  e('Your calm makes my chaos survivable.', 'Love and romance', 'Comfort', 'Warm', ['love', 'calm']),
  e('I want the version of us that still laughs at the same bad joke.', 'Love and romance', 'Everyday', 'Warm', ['love', 'laughter']),
  e('Two people choosing each other without an audience.', 'Love and romance', 'Commitment', 'Tender', ['love', 'choice']),
  h('तुम वो हो जिसके साथ मैं भविष्य में भी साधारण रहना चाहता हूँ।', 'Love and romance', 'निभाना', 'कोमल', ['साधारण', 'भविष्य']),
  h('मैं तुमसे उस दिन सबसे ज़्यादा प्यार करता हूँ जब तुम कोशिश नहीं करते।', 'Love and romance', 'नज़दीकी', 'कोमल', ['प्यार', 'कोशिश']),
  h('हम परफ़ेक्ट नहीं हैं और दिखावा भी नहीं करते।', 'Love and romance', 'रोज़मर्रा', 'सहज', ['परफ़ेक्ट', 'दिखावा']),
  h('दो लोग बिना दर्शक के एक-दूसरे को चुनते हैं।', 'Love and romance', 'निभाना', 'गंभीर', ['दर्शक', 'चुनना']),
  g('Tum woh ho jiske saath main bhavishya mein bhi saadharan rehna chahta hoon.', 'Love and romance', 'Commitment', 'Sweet', ['bhavishya', 'saadharan']),
  g('Main tumse us din sabse zyada pyaar karta hoon jab tum koshish nahi karte.', 'Love and romance', 'Closeness', 'Tender', ['pyaar', 'koshish']),
  g('Hum perfect nahi hain aur dikhawa bhi nahi karte.', 'Love and romance', 'Real love', 'Honest', ['perfect', 'dikhawa']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I am not over you. I am over the version of me who waited.', 'Sad and heartbreak', 'Recovery', 'Raw', ['sad', 'recovery']),
  e('Some nights I still write to you and delete it.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'longing']),
  e('You left and the ordinary became difficult.', 'Sad and heartbreak', 'Absence', 'Heavy', ['sad', 'absence']),
  e('I learned to be fine and I hate how good I got at it.', 'Sad and heartbreak', 'Numbness', 'Honest', ['sad', 'numbness']),
  e('The love did not end. The effort did.', 'Sad and heartbreak', 'Ending', 'Wise', ['sad', 'ending']),
  h('मैं तुम पर नहीं, उस पुराने मुझ पर से उबरा हूँ जो इंतज़ार करता था।', 'Sad and heartbreak', 'उबरना', 'भावुक', ['इंतज़ार', 'उबरना']),
  h('कुछ रातों में आज भी तुम्हें लिखता हूँ और मिटा देता हूँ।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['लिखना', 'मिटाना']),
  h('तुम गए और साधारण चीज़ें मुश्किल हो गईं।', 'Sad and heartbreak', 'गैरहाज़िरी', 'गंभीर', ['साधारण', 'मुश्किल']),
  h('प्यार खत्म नहीं हुआ, कोशिश खत्म हुई।', 'Sad and heartbreak', 'अंत', 'गंभीर', ['प्यार', 'कोशिश']),
  g('Main tum par nahi, us purane mujh par se ubra hoon jo intezaar karta tha.', 'Sad and heartbreak', 'Recovery', 'Raw', ['intezaar', 'ubra']),
  g('Kuch raaton mein aaj bhi tumhein likhta hoon aur mita deta hoon.', 'Sad and heartbreak', 'Longing', 'Aching', ['likhta', 'mita']),
  g('Pyaar khatam nahi hua, koshish khatam hui.', 'Sad and heartbreak', 'Ending', 'Wise', ['pyaar', 'koshish']),

  /* ------------------------------------------------------ Shayari depth */
  h('मैं तेरे बाद भी\nवही आदमी हूँ,\nबस थोड़ा और चुप।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['आदमी', 'चुप']),
  h('तेरी याद आई,\nचाय बनाई,\nऔर दोनों ठंडी हो गईं।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['चाय', 'ठंडी']),
  h('जिस रास्ते से तू गया,\nवहाँ से आज भी\nकोई नहीं गुज़रता।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['रास्ता', 'गुज़रता']),
  h('मैंने खुद से कहा था\nकि अब नहीं,\nऔर खुद ने भी सुना नहीं।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['खुद', 'सुना']),
  g('Main tere baad bhi wahi aadmi hoon, bas thoda aur chup.', 'Shayari', 'Two line', 'Deep', ['aadmi', 'chup']),
  g('Teri yaad aayi, chai banai, aur dono thandi ho gayin.', 'Shayari', 'Two line', 'Aching', ['chai', 'thandi']),
  g('Jis raaste se tu gaya, wahan se aaj bhi koi nahi guzarta.', 'Shayari', 'Two line', 'Deep', ['raaste', 'guzarta']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('You cannot hurry wisdom and you cannot fake it for long.', 'Quotes and thoughts', 'Wisdom', 'Wise', ['quotes', 'wisdom']),
  e('The most useful thing you can say is often "I do not know".', 'Quotes and thoughts', 'Honesty', 'Wise', ['quotes', 'honesty']),
  e('A habit is a vote for the person you are becoming.', 'Quotes and thoughts', 'Habit', 'Wise', ['quotes', 'habit']),
  e('Anything worth doing is worth doing at an average level first.', 'Quotes and thoughts', 'Practice', 'Encouraging', ['quotes', 'practice']),
  e('Attention is love, in the only currency that cannot be faked.', 'Quotes and thoughts', 'Attention', 'Warm', ['quotes', 'love']),
  h('समझदारी जल्दी नहीं आती और नकली ज़्यादा देर नहीं टिकती।', 'Quotes and thoughts', 'समझ', 'गंभीर', ['समझदारी', 'नकली']),
  h('सबसे उपयोगी बात अक्सर होती है — "मुझे नहीं पता"।', 'Quotes and thoughts', 'ईमानदारी', 'गंभीर', ['बात', 'पता']),
  h('आदत उस इंसान के लिए वोट है जो तुम बन रहे हो।', 'Quotes and thoughts', 'आदत', 'गंभीर', ['आदत', 'वोट']),
  h('ध्यान ही प्यार है, सबसे ईमानदार मुद्रा में।', 'Quotes and thoughts', 'ध्यान', 'कोमल', ['ध्यान', 'प्यार']),
  g('Samajhdari jaldi nahi aati aur naqli zyada der nahi tikti.', 'Quotes and thoughts', 'Wisdom', 'Wise', ['samajhdari', 'naqli']),
  g('Sabse upyogi baat aksar hoti hai — mujhe nahi pata.', 'Quotes and thoughts', 'Honesty', 'Wise', ['upyogi', 'pata']),
  g('Aadat us insaan ke liye vote hai jo tum ban rahe ho.', 'Quotes and thoughts', 'Habit', 'Wise', ['aadat', 'vote']),

  /* ------------------------------------------------------ Life and reality */
  e('You will regret the years you spent waiting to feel ready.', 'Life and reality', 'Courage', 'Direct', ['life', 'courage']),
  e('Nobody tells you that adulthood is mostly scheduling.', 'Life and reality', 'Reality', 'Wry', ['life', 'adulthood']),
  e('The right people will not require you to shrink.', 'Life and reality', 'People', 'Warm', ['life', 'people']),
  e('You cannot heal by rehearsing the argument again.', 'Life and reality', 'Healing', 'Wise', ['life', 'healing']),
  h('जिन सालों में "तैयार" होने का इंतज़ार किया, उनका अफ़सोस रहेगा।', 'Life and reality', 'साहस', 'स्पष्ट', ['साल', 'इंतज़ार']),
  h('कोई नहीं बताता कि बड़ा होना ज़्यादातर समय-सारणी है।', 'Life and reality', 'हकीकत', 'सहज', ['बड़ा', 'समय']),
  h('सही लोग तुम्हें छोटा होने को नहीं कहेंगे।', 'Life and reality', 'लोग', 'कोमल', ['लोग', 'छोटा']),
  g('Jin saalon mein taiyaar hone ka intezaar kiya, unka afsos rahega.', 'Life and reality', 'Courage', 'Direct', ['saalon', 'intezaar']),
  g('Sahi log tumhein chhota hone ko nahi kahenge.', 'Life and reality', 'People', 'Warm', ['sahi', 'chhota']),

  /* --------------------------------------------------- Motivational depth */
  e('Show up on the days the work is boring. That is the whole secret.', 'Motivational', 'Discipline', 'Direct', ['motivation', 'discipline']),
  e('You are allowed to be a beginner at forty.', 'Motivational', 'Courage', 'Encouraging', ['motivation', 'beginner']),
  e('Small finishes beat big starts.', 'Motivational', 'Focus', 'Terse', ['motivation', 'finishing']),
  h('जिस दिन काम बोरिंग हो, उस दिन भी आओ। यही पूरा राज़ है।', 'Motivational', 'अनुशासन', 'स्पष्ट', ['काम', 'राज़']),
  h('चालीस की उम्र में भी शुरुआती होना जायज़ है।', 'Motivational', 'साहस', 'प्रेरक', ['उम्र', 'शुरुआती']),
  g('Jis din kaam boring ho, us din bhi aao. Yahi poora raaz hai.', 'Motivational', 'Discipline', 'Direct', ['kaam', 'raaz']),
  g('Chalees ki umar mein bhi shuruaati hona jaayaz hai.', 'Motivational', 'Courage', 'Encouraging', ['umar', 'shuruaati']),

  /* ---------------------------------------- Aesthetic / style / creator */
  e('A good chair changes how long you can think.', 'Aesthetic', 'Interiors', 'Practical', ['aesthetic', 'chair']),
  e('I buy fewer clothes and better ones.', 'Stylish', 'Craft', 'Minimal', ['style', 'craft']),
  e('Make things for the person you were two years ago.', 'Creator and influencer', 'Perspective', 'Wise', ['creator', 'audience']),
  h('अच्छी कुर्सी बदल देती है कि तुम कितनी देर सोच सकते हो।', 'Aesthetic', 'घर', 'व्यावहारिक', ['कुर्सी', 'सोच']),
  h('मैं कम कपड़े खरीदता हूँ, बेहतर खरीदता हूँ।', 'Stylish', 'सलीका', 'संक्षिप्त', ['कपड़े', 'बेहतर']),
  g('Acchi kursi badal deti hai ki tum kitni der soch sakte ho.', 'Aesthetic', 'Interiors', 'Practical', ['kursi', 'soch']),
  g('Main kam kapde kharidta hoon, behtar kharidta hoon.', 'Stylish', 'Craft', 'Minimal', ['kapde', 'behtar']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('The best meeting is the one you replaced with a paragraph.', 'Professional and business', 'Work', 'Sharp', ['business', 'meetings']),
  e('Hire for judgement. Train for everything else.', 'Professional and business', 'Leadership', 'Wise', ['business', 'hiring']),
  e('Your first customer is a favour. Your second is a business.', 'Startup and hustle', 'Reality', 'Wry', ['startup', 'customers']),
  e('Read the required reading before you argue about the syllabus.', 'Student life', 'Campus', 'Direct', ['student', 'reading']),
  e('I learned more from losing finals than winning leagues.', 'Cricket and sports', 'Sports', 'Wise', ['sports', 'loss']),
  e('Naps are a training tool, not a weakness.', 'Fitness', 'Recovery', 'Grounded', ['fitness', 'recovery']),
  e('Teach a child to cook and you have taught them everything.', 'Family', 'Home', 'Warm', ['family', 'cooking']),
  h('सबसे अच्छी मीटिंग वो है जिसे तुमने एक पैराग्राफ़ से बदल दिया।', 'Professional and business', 'काम', 'तीखा', ['मीटिंग', 'पैराग्राफ़']),
  h('समझ के लिए भर्ती करो, बाकी सब सिखा दो।', 'Professional and business', 'नेतृत्व', 'गंभीर', ['समझ', 'भर्ती']),
  h('पहला ग्राहक एहसान है, दूसरा कारोबार।', 'Startup and hustle', 'हकीकत', 'सहज', ['ग्राहक', 'कारोबार']),
  h('हारने से ज़्यादा सीखा, जीतने से कम।', 'Cricket and sports', 'खेल भावना', 'गंभीर', ['हार', 'सीखा']),
  g('Sabse acchi meeting woh hai jise tumne ek paragraph se badal diya.', 'Professional and business', 'Work', 'Sharp', ['meeting', 'paragraph']),
  g('Samajh ke liye bharti karo, baaki sab sikha do.', 'Professional and business', 'Leadership', 'Wise', ['samajh', 'bharti']),
  g('Pehla grahak ehsaan hai, doosra kaarobar.', 'Startup and hustle', 'Reality', 'Wry', ['grahak', 'kaarobar']),
  g('Haarne se zyada seekha, jeetne se kam.', 'Cricket and sports', 'Sports', 'Wise', ['haarne', 'seekha']),
];
