/**
 * BioCraft original bios — batch 028.
 * Slightly English-heavy to level 5.17 / 5.31 / 5.33.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_028 = [
  /* -------------------------------------------------------------- Attitude */
  e('I do not need closure from people who never gave me clarity.', 'Attitude', 'Boundaries', 'Steady', ['attitude', 'closure']),
  e('My reputation travels faster than my excuses ever did.', 'Attitude', 'Integrity', 'Wise', ['attitude', 'reputation']),
  e('Say what you mean. I am not fluent in hints.', 'Attitude', 'Directness', 'Blunt', ['attitude', 'direct']),
  e('I am not responsible for the version of me you invented.', 'Attitude', 'Identity', 'Firm', ['attitude', 'identity']),
  e('I would rather be disliked honestly than liked dishonestly.', 'Attitude', 'Integrity', 'Firm', ['attitude', 'honesty']),
  e('A boundary is not a punishment. It is a map.', 'Attitude', 'Boundaries', 'Wise', ['attitude', 'boundaries']),
  e('You cannot command respect you have not earned.', 'Attitude', 'Standards', 'Direct', ['attitude', 'respect']),
  e('I stopped waiting for an apology and started getting on with it.', 'Attitude', 'Growth', 'Honest', ['attitude', 'growth']),
  e('Nobody appointed you the narrator of my life.', 'Attitude', 'Identity', 'Sharp', ['attitude', 'identity']),
  e('I forgive quickly and trust slowly. Both on purpose.', 'Attitude', 'Discernment', 'Wise', ['attitude', 'trust']),
  h('जिन्होंने साफ़ कभी बोला ही नहीं, उनसे जवाब की उम्मीद नहीं।', 'Attitude', 'सीमाएं', 'दृढ़', ['साफ़', 'जवाब']),
  h('मैं वो संस्करण नहीं हूँ जो तुमने मन में बनाया।', 'Attitude', 'पहचान', 'दृढ़', ['संस्करण', 'पहचान']),
  h('सीमा सज़ा नहीं, नक्शा होती है।', 'Attitude', 'सीमाएं', 'गंभीर', ['सीमा', 'नक्शा']),
  h('मैं जल्दी माफ़ करता हूँ, धीरे भरोसा करता हूँ।', 'Attitude', 'समझ', 'गंभीर', ['माफ़', 'भरोसा']),
  g('Jinhone saaf kabhi bola hi nahi, unse jawab ki umeed nahi.', 'Attitude', 'Boundaries', 'Firm', ['saaf', 'jawab']),
  g('Main woh sanskaran nahi hoon jo tumne mann mein banaya.', 'Attitude', 'Identity', 'Firm', ['sanskaran', 'mann']),
  g('Seema saza nahi, naksha hoti hai.', 'Attitude', 'Boundaries', 'Wise', ['seema', 'naksha']),

  /* ------------------------------------------------------ Love and romance */
  e('You are my favourite habit and my easiest decision.', 'Love and romance', 'Devotion', 'Sweet', ['love', 'habit']),
  e('I want to build something with you that outlives the excitement.', 'Love and romance', 'Commitment', 'Wise', ['love', 'commitment']),
  e('Our worst days are still better than most people\u2019s good ones.', 'Love and romance', 'Real love', 'Warm', ['love', 'honesty']),
  e('I like how you argue. It makes me trust you more.', 'Love and romance', 'Respect', 'Wise', ['love', 'respect']),
  e('You are the plan I keep making without noticing.', 'Love and romance', 'Devotion', 'Tender', ['love', 'plans']),
  e('I would rather have your honest answer than your good mood.', 'Love and romance', 'Honesty', 'Direct', ['love', 'honesty']),
  e('Love is a hundred small choices nobody witnesses.', 'Love and romance', 'Real love', 'Wise', ['love', 'choice']),
  h('तुम मेरी पसंदीदा आदत और सबसे आसान फ़ैसला हो।', 'Love and romance', 'अपनापन', 'कोमल', ['आदत', 'फ़ैसला']),
  h('मुझे तुम्हारे साथ कुछ ऐसा बनाना है जो उत्साह से ज़्यादा टिके।', 'Love and romance', 'निभाना', 'गंभीर', ['उत्साह', 'बनाना']),
  h('तुम्हारा बहस करने का तरीका मुझे और भरोसेमंद लगता है।', 'Love and romance', 'आदर', 'गंभीर', ['बहस', 'भरोसा']),
  h('मुझे तुम्हारा अच्छा मूड नहीं, ईमानदार जवाब चाहिए।', 'Love and romance', 'ईमानदारी', 'स्पष्ट', ['मूड', 'जवाब']),
  g('Tum meri pasandeeda aadat aur sabse aasaan faisla ho.', 'Love and romance', 'Devotion', 'Sweet', ['aadat', 'faisla']),
  g('Tumhara bahas karne ka tareeka mujhe aur bharosemand lagta hai.', 'Love and romance', 'Respect', 'Wise', ['bahas', 'bharosemand']),
  g('Mujhe tumhara khush rehna nahi, tumhara sach chahiye.', 'Love and romance', 'Honesty', 'Direct', ['sach', 'chahiye']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I remember the ending better than I remember the good part.', 'Sad and heartbreak', 'Grief', 'Honest', ['sad', 'memory']),
  e('You were the weather for a whole year.', 'Sad and heartbreak', 'Loss', 'Aching', ['sad', 'loss']),
  e('I stopped writing drafts of messages I will never send.', 'Sad and heartbreak', 'Recovery', 'Steady', ['sad', 'recovery']),
  e('Something in me keeps looking up when the door opens.', 'Sad and heartbreak', 'Longing', 'Raw', ['sad', 'longing']),
  e('I am better now, and I still miss it sometimes.', 'Sad and heartbreak', 'Honesty', 'Honest', ['sad', 'honesty']),
  h('अंत मुझे अच्छे हिस्से से ज़्यादा याद है।', 'Sad and heartbreak', 'गम', 'स्पष्ट', ['अंत', 'याद']),
  h('तुम पूरे साल का मौसम थे।', 'Sad and heartbreak', 'हानि', 'भावुक', ['मौसम', 'साल']),
  h('दरवाज़ा खुलते ही मेरे भीतर कुछ उठकर देखता है।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['दरवाज़ा', 'भीतर']),
  h('मैं अब ठीक हूँ, और कभी-कभी उसकी कमी भी लगती है।', 'Sad and heartbreak', 'ईमानदारी', 'स्पष्ट', ['ठीक', 'कमी']),
  g('Ant mujhe achhe hisse se zyada yaad hai.', 'Sad and heartbreak', 'Grief', 'Honest', ['ant', 'yaad']),
  g('Tum poore saal ka mausam the.', 'Sad and heartbreak', 'Loss', 'Aching', ['saal', 'mausam']),
  g('Darwaaza khulte hi mere bheetar kuch uthkar dekhta hai.', 'Sad and heartbreak', 'Longing', 'Raw', ['darwaaza', 'bheetar']),

  /* ------------------------------------------------------ Shayari depth */
  h('तेरी याद में जो रात कटी,\nवो रात नहीं थी,\nसिर्फ़ तेरा इंतज़ार था।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['रात', 'इंतज़ार']),
  h('मैं तुझसे मिलने नहीं आया,\nबस तेरे शहर की हवा\nएक बार लेनी थी।', 'Shayari', 'तीन पंक्ति', 'रोमांटिक', ['शहर', 'हवा']),
  h('जो बात कह नहीं सका,\nवो कविता बन गई,\nऔर सबने पढ़ ली।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['बात', 'कविता']),
  h('मैं अपने हिस्से का दर्द\nअपने पास रखता हूँ,\nबाँटने से कम नहीं होता।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['दर्द', 'हिस्सा']),
  g('Teri yaad mein jo raat kati, woh raat nahi thi, sirf tera intezaar tha.', 'Shayari', 'Two line', 'Aching', ['raat', 'intezaar']),
  g('Jo baat keh nahi saka, woh kavita ban gayi, aur sabne padh li.', 'Shayari', 'Two line', 'Deep', ['baat', 'kavita']),
  g('Main apne hisse ka dard apne paas rakhta hoon, baantne se kam nahi hota.', 'Shayari', 'Two line', 'Deep', ['dard', 'hisse']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('Consistency is the only creative advice that survives contact with reality.', 'Quotes and thoughts', 'Consistency', 'Wise', ['quotes', 'consistency']),
  e('Your worst day is not the verdict on your whole character.', 'Quotes and thoughts', 'Perspective', 'Reassuring', ['quotes', 'perspective']),
  e('Learn to sit with a hard question before you search for a soft answer.', 'Quotes and thoughts', 'Thinking', 'Wise', ['quotes', 'thinking']),
  e('The cheapest luxury is an unhurried morning.', 'Quotes and thoughts', 'Time', 'Warm', ['quotes', 'mornings']),
  e('Say less in meetings and more in writing.', 'Quotes and thoughts', 'Work', 'Practical', ['quotes', 'work']),
  e('If it only works when you are impressive, it does not work.', 'Quotes and thoughts', 'Realism', 'Direct', ['quotes', 'realism']),
  h('दोहराव ही एकमात्र रचनात्मक सलाह है जो हकीकत में टिकती है।', 'Quotes and thoughts', 'निरंतरता', 'गंभीर', ['दोहराव', 'सलाह']),
  h('कोई तुम्हारी गलती को इतना नहीं सोचता जितना तुम सोचते हो।', 'Quotes and thoughts', 'नज़रिया', 'सहज', ['गलती', 'नज़रिया']),
  h('मीटिंग में कम बोलो, लिखने में ज़्यादा।', 'Quotes and thoughts', 'काम', 'व्यावहारिक', ['मीटिंग', 'लिखना']),
  g('Dohraav hi ekmatra rachnatmak salaah hai jo haqeeqat mein tikti hai.', 'Quotes and thoughts', 'Consistency', 'Wise', ['dohraav', 'salaah']),
  g('Koi tumhari galti ko itna nahi sochta jitna tum sochte ho.', 'Quotes and thoughts', 'Perspective', 'Reassuring', ['galti', 'sochte']),
  g('Meeting mein kam bolo, likhne mein zyada.', 'Quotes and thoughts', 'Work', 'Practical', ['meeting', 'likhne']),

  /* ------------------------------------------------------ Life and reality */
  e('The life you want is on the other side of a boring year.', 'Life and reality', 'Patience', 'Wise', ['life', 'patience']),
  e('You can be grateful and still ask for more. Both are honest.', 'Life and reality', 'Nuance', 'Wise', ['life', 'gratitude']),
  e('Most conflict is two people defending the same fear.', 'Life and reality', 'People', 'Wise', ['life', 'conflict']),
  e('Nothing improves your mood faster than finishing something.', 'Life and reality', 'Action', 'Practical', ['life', 'action']),
  e('You are not behind. You are on a slower, safer route.', 'Life and reality', 'Perspective', 'Warm', ['life', 'perspective']),
  h('जो ज़िंदगी चाहिए वो एक बोरिंग साल के उस पार है।', 'Life and reality', 'सब्र', 'गंभीर', ['ज़िंदगी', 'साल']),
  h('शुक्रगुज़ार रहो और मांगते भी रहो, दोनों ईमानदार हैं।', 'Life and reality', 'संतोष', 'गंभीर', ['शुक्र', 'मांगना']),
  h('ज़्यादातर झगड़े दो लोगों का एक ही डर बचाना होते हैं।', 'Life and reality', 'लोग', 'गंभीर', ['झगड़े', 'डर']),
  h('कुछ पूरा करने से जल्दी मूड नहीं बदलता।', 'Life and reality', 'कर्म', 'व्यावहारिक', ['पूरा', 'मूड']),
  g('Jo zindagi chahiye woh ek boring saal ke us paar hai.', 'Life and reality', 'Patience', 'Wise', ['zindagi', 'saal']),
  g('Zyadatar jhagde do logon ka ek hi dar bachaana hote hain.', 'Life and reality', 'People', 'Wise', ['jhagde', 'dar']),
  g('Kuch poora karne se jaldi mood nahi badalta.', 'Life and reality', 'Action', 'Practical', ['poora', 'mood']),

  /* --------------------------------------------------- Motivational depth */
  e('You do not need a breakthrough. You need a Tuesday you keep.', 'Motivational', 'Consistency', 'Encouraging', ['motivation', 'consistency']),
  e('Talent gets you noticed. Reliability gets you kept.', 'Motivational', 'Craft', 'Wise', ['motivation', 'reliability']),
  e('Start with the version that takes eight minutes.', 'Motivational', 'Starting', 'Practical', ['motivation', 'starting']),
  e('You cannot fail at something you have not started. That is the trick.', 'Motivational', 'Courage', 'Sharp', ['motivation', 'courage']),
  h('तुम्हें बड़ी सफलता नहीं, एक निभाया हुआ मंगलवार चाहिए।', 'Motivational', 'निरंतरता', 'प्रेरक', ['मंगलवार', 'निरंतरता']),
  h('प्रतिभा दिखाती है, भरोसेमंदी टिकाती है।', 'Motivational', 'काम', 'गंभीर', ['प्रतिभा', 'भरोसा']),
  h('जिस संस्करण में आठ मिनट लगें, उसी से शुरू करो।', 'Motivational', 'शुरुआत', 'व्यावहारिक', ['आठ', 'शुरुआत']),
  g('Tumhe badi safalta nahi, ek nibhaya hua mangalvaar chahiye.', 'Motivational', 'Consistency', 'Encouraging', ['safalta', 'mangalvaar']),
  g('Pratibha dikhati hai, bharosemandi tikati hai.', 'Motivational', 'Craft', 'Wise', ['pratibha', 'bharosemandi']),
  g('Jis sanskaran mein aath minute lagein, usi se shuru karo.', 'Motivational', 'Starting', 'Practical', ['sanskrit', 'shuru']),

  /* ------------------------------------------ Aesthetic / creator / royal */
  e('A single lamp is enough to make a room honest.', 'Aesthetic', 'Light', 'Calm', ['aesthetic', 'light']),
  e('I keep things that have survived my taste changing.', 'Aesthetic', 'Objects', 'Wise', ['aesthetic', 'objects']),
  e('Publish the rough version. The polished one never arrives.', 'Creator and influencer', 'Process', 'Direct', ['creator', 'process']),
  e('Your audience is not a judge. They are people with the same problem.', 'Creator and influencer', 'Perspective', 'Warm', ['creator', 'audience']),
  e('A title should make you more careful, not more comfortable.', 'Royal and VIP', 'Duty', 'Regal', ['royal', 'duty']),
  h('एक लैंप ही कमरे को ईमानदार बनाने के लिए काफ़ी है।', 'Aesthetic', 'रोशनी', 'शांत', ['लैंप', 'कमरा']),
  h('जो चीज़ें मेरे बदलते स्वाद से बच गईं, वो रखता हूँ।', 'Aesthetic', 'सादगी', 'गंभीर', ['चीज़ें', 'स्वाद']),
  h('कच्चा संस्करण छापो, पक्का कभी नहीं आता।', 'Creator and influencer', 'रचना', 'स्पष्ट', ['संस्करण', 'रचना']),
  g('Ek lamp hi kamre ko imaandaar banane ke liye kaafi hai.', 'Aesthetic', 'Light', 'Calm', ['lamp', 'kamre']),
  g('Jo cheezein mere badalte swaad se bach gayin, woh rakhta hoon.', 'Aesthetic', 'Objects', 'Wise', ['cheezein', 'swaad']),

  /* ------------------------------------------------- Mid-field top-ups */
  e('Two papers a morning and I am a different person by Friday.', 'Books and reading', 'Reader life', 'Warm', ['books', 'habit']),
  e('I learned to cook because I got tired of apologising to delivery apps.', 'Food and cooking', 'Cooking', 'Funny', ['food', 'cooking']),
  e('The gym is where I go to stop negotiating with myself.', 'Fitness', 'Gym', 'Direct', ['fitness', 'discipline']),
  e('Squat form over squat weight. Always.', 'Fitness', 'Training', 'Practical', ['fitness', 'form']),
  e('My camera roll is a diary I never wrote.', 'Photography', 'Craft', 'Warm', ['photography', 'diary']),
  e('I photograph doors. Every city has better doors than mine.', 'Photography', 'Street', 'Playful', ['photography', 'doors']),
  e('Every good playlist is an argument about your own taste.', 'Music and art', 'Listening', 'Wise', ['music', 'taste']),
  h('सुबह के दो पन्ने और शुक्रवार तक मैं दूसरा आदमी हूँ।', 'Books and reading', 'पढ़ना', 'कोमल', ['पन्ने', 'शुक्रवार']),
  h('खाना बनाना इसलिए सीखा कि डिलीवरी ऐप से माफ़ी मांगते थक गया।', 'Food and cooking', 'रसोई', 'मज़ाकिया', ['खाना', 'माफ़ी']),
  h('जिम वो जगह है जहाँ मैं खुद से बहस करना बंद करता हूँ।', 'Fitness', 'जिम', 'स्पष्ट', ['जिम', 'बहस']),
  h('मेरा कैमरा रोल वो डायरी है जो मैंने कभी लिखी नहीं।', 'Photography', 'प्रक्रिया', 'कोमल', ['कैमरा', 'डायरी']),
  g('Subah ke do panne aur shukravaar tak main doosra aadmi hoon.', 'Books and reading', 'Reader life', 'Warm', ['panne', 'shukravaar']),
  g('Khana banana isliye seekha ki delivery app se maafi maangte thak gaya.', 'Food and cooking', 'Cooking', 'Funny', ['khana', 'maafi']),
  g('Gym woh jagah hai jahan main khud se bahas karna band karta hoon.', 'Fitness', 'Gym', 'Direct', ['gym', 'bahas']),
  g('Mera camera roll woh diary hai jo maine kabhi likhi nahi.', 'Photography', 'Craft', 'Warm', ['camera', 'diary']),
];
