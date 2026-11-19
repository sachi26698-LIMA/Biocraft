/**
 * BioCraft original bios — batch 036.
 * Strict 40/30/30 proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_036 = [
  /* ------------------------------------------------------------ Attitude */
  e('I have a short list of people I explain myself to.', 'Attitude', 'Boundaries', 'Composed', ['attitude', 'boundaries']),
  e('Kindness is a choice. Being a doormat is a habit.', 'Attitude', 'Self-respect', 'Sharp', ['attitude', 'kindness']),
  e('I leave rooms where I have to perform to be believed.', 'Attitude', 'Dignity', 'Firm', ['attitude', 'dignity']),
  e('My silence is not agreement. It is retirement from the argument.', 'Attitude', 'Composure', 'Dry', ['attitude', 'silence']),
  h('मेरे पास गिने-चुने लोग हैं जिन्हें मैं खुद समझाता हूँ।', 'Attitude', 'सीमाएं', 'शांत', ['लोग', 'समझाता']),
  h('अच्छाई चुनाव है, कमज़ोरी आदत।', 'Attitude', 'स्वाभिमान', 'तीखा', ['अच्छाई', 'आदत']),
  h('जहाँ यक़ीन दिलाने के लिए नाटक करना पड़े, वहाँ नहीं रुकता।', 'Attitude', 'गरिमा', 'दृढ़', ['नाटक', 'रुकता']),
  g('Mere paas gine-chune log hain jinhe main khud samjhata hoon.', 'Attitude', 'Boundaries', 'Composed', ['log', 'samjhata']),
  g('Achhai chunav hai, kamzori aadat.', 'Attitude', 'Self-respect', 'Sharp', ['achhai', 'aadat']),
  g('Jahan yaqeen dilane ke liye naatak karna pade, wahan nahi rukta.', 'Attitude', 'Dignity', 'Firm', ['naatak', 'ruka']),

  /* ------------------------------------------------------------- Love */
  e('You are the plan, not the break between plans.', 'Love and romance', 'Priority', 'Tender', ['love', 'priority']),
  e('I want to be chosen on a Tuesday, not just on a holiday.', 'Love and romance', 'Everyday', 'Warm', ['love', 'tuesday']),
  e('We keep no score, only receipts for the good nights.', 'Love and romance', 'Playful', 'Wry', ['love', 'playful']),
  e('Your laugh fixes things I did not know were broken.', 'Love and romance', 'Closeness', 'Sweet', ['love', 'laugh']),
  h('तुम योजना हो, योजनाओं के बीच का ब्रेक नहीं।', 'Love and romance', 'प्राथमिकता', 'कोमल', ['योजना', 'ब्रेक']),
  h('मैं किसी आम मंगलवार को चुना जाना चाहता हूँ।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['मंगलवार', 'चुना']),
  h('हम हिसाब नहीं रखते, बस अच्छी रातों के क़िस्से।', 'Love and romance', 'खेल', 'सहज', ['हिसाब', 'क़िस्से']),
  g('Tum yojana ho, yojanaon ke beech ka break nahi.', 'Love and romance', 'Priority', 'Tender', ['yojana', 'break']),
  g('Main kisi aam mangalwar ko chuna jaana chahta hoon.', 'Love and romance', 'Everyday', 'Warm', ['mangalwar', 'chuna']),
  g('Hum hisaab nahi rakhte, bas achhi raaton ke qisse.', 'Love and romance', 'Playful', 'Wry', ['hisaab', 'qisse']),

  /* ------------------------------------------------------ Sad depth */
  e('I have made a routine out of missing you.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'routine']),
  e('It ended politely, which somehow made it worse.', 'Sad and heartbreak', 'Endings', 'Wry', ['sad', 'polite']),
  e('Some nights I am a guest in my own house.', 'Sad and heartbreak', 'Loneliness', 'Quiet', ['sad', 'lonely']),
  e('I did not lose you. I misplaced a whole future.', 'Sad and heartbreak', 'Loss', 'Heavy', ['sad', 'future']),
  h('तुम्हारी कमी को मैंने आदत बना लिया है।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['कमी', 'आदत']),
  h('शालीनता से खत्म हुआ, और उसी से और बुरा लगा।', 'Sad and heartbreak', 'अंत', 'सहज', ['शालीनता', 'खत्म']),
  h('कुछ रातें अपने ही घर में मेहमान जैसी होती हैं।', 'Sad and heartbreak', 'अकेलापन', 'शांत', ['रातें', 'मेहमान']),
  g('Tumhari kami ko maine aadat bana liya hai.', 'Sad and heartbreak', 'Longing', 'Aching', ['kami', 'aadat']),
  g('Shaalinata se khatam hua, aur usi se aur bura laga.', 'Sad and heartbreak', 'Endings', 'Wry', ['shaalinata', 'khatam']),
  g('Kuch raatein apne hi ghar mein mehmaan jaisi hoti hain.', 'Sad and heartbreak', 'Loneliness', 'Quiet', ['raatein', 'mehmaan']),

  /* --------------------------------------------------------- Shayari */
  h('तेरे बाद\nशाम ढली\nऔर मैं सो गया।', 'Shayari', 'तीन पंक्ति', 'भावुक', ['शाम', 'बाद']),
  h('मैंने तुझसे\nकुछ नहीं माँगा,\nबस वक़्त माँगा था।', 'Shayari', 'तीन पंक्ति', 'गंभीर', ['माँगा', 'वक़्त']),
  h('फूल तोड़े,\nऔर बाग़\nआज भी खिला है।', 'Shayari', 'तीन पंक्ति', 'सहज', ['फूल', 'बाग़']),
  g('Tere baad shaam dheli, aur main so gaya.', 'Shayari', 'Two line', 'Aching', ['shaam', 'so']),
  g('Maine tujhse kuch nahi maanga, bas waqt maanga tha.', 'Shayari', 'Two line', 'Deep', ['maanga', 'waqt']),
  g('Phool tode, aur baagh aaj bhi khila hai.', 'Shayari', 'Two line', 'Gentle', ['phool', 'baagh']),

  /* -------------------------------------------------- Quotes and ideas */
  e('Never make a permanent decision on a tired brain.', 'Quotes and thoughts', 'Judgement', 'Direct', ['quotes', 'decisions']),
  e('A reputation is built in years and spent in minutes.', 'Quotes and thoughts', 'Character', 'Wise', ['quotes', 'reputation']),
  e('Everybody is interesting if you ask the second question.', 'Quotes and thoughts', 'Listening', 'Warm', ['quotes', 'listening']),
  e('Your habits are your biography, written daily.', 'Quotes and thoughts', 'Habits', 'Wise', ['quotes', 'habits']),
  h('थके दिमाग़ पर पक्का फ़ैसला मत लो।', 'Quotes and thoughts', 'फ़ैसला', 'स्पष्ट', ['दिमाग़', 'फ़ैसला']),
  h('नाम सालों में बनता है, मिनटों में बिक जाता है।', 'Quotes and thoughts', 'चरित्र', 'गंभीर', ['नाम', 'सालों']),
  h('दूसरा सवाल पूछो, हर इंसान दिलचस्प है।', 'Quotes and thoughts', 'सुनना', 'कोमल', ['सवाल', 'इंसान']),
  g('Thake dimaag par pakka faisla mat lo.', 'Quotes and thoughts', 'Judgement', 'Direct', ['dimaag', 'faisla']),
  g('Naam saalon mein banta hai, minaton mein bik jaata hai.', 'Quotes and thoughts', 'Character', 'Wise', ['naam', 'minaton']),
  g('Doosra sawaal poocho, har insaan dilchasp hai.', 'Quotes and thoughts', 'Listening', 'Warm', ['sawaal', 'insaan']),

  /* -------------------------------------------------- Life and reality */
  e('Ambition and contentment can share one small kitchen.', 'Life and reality', 'Ambition', 'Honest', ['life', 'ambition']),
  e('Friendship is mostly remembering what someone told you once.', 'Life and reality', 'Friendship', 'Warm', ['life', 'friendship']),
  e('Some years are for building and some for surviving.', 'Life and reality', 'Seasons', 'Wise', ['life', 'seasons']),
  e('Most awkwardness is a story only you are rehearsing.', 'Life and reality', 'Confidence', 'Wry', ['life', 'awkward']),
  h('शुक्रगुज़ार हो सकते हो और और भी चाह सकते हो।', 'Life and reality', 'महत्वाकांक्षा', 'स्पष्ट', ['शुक्रगुज़ार', 'चाह']),
  h('दोस्ती ज़्यादातर याद रखने में है कि किसी ने क्या कहा था।', 'Life and reality', 'दोस्ती', 'कोमल', ['दोस्ती', 'याद']),
  h('कुछ साल बनाने के हैं, कुछ बच निकलने के।', 'Life and reality', 'समय', 'गंभीर', ['साल', 'बच']),
  g('Shukraguzaar ho sakte ho aur aur bhi chaah sakte ho.', 'Life and reality', 'Ambition', 'Honest', ['shukraguzaar', 'chaah']),
  g('Dosti zyadatar yaad rakhne mein hai ki kisi ne kya kaha tha.', 'Life and reality', 'Friendship', 'Warm', ['dosti', 'yaad']),
  g('Kuch saal banane ke hain, kuch bach nikalne ke.', 'Life and reality', 'Seasons', 'Wise', ['saal', 'bach']),

  /* ------------------------------------------------------- Motivational */
  e('The person you want to be already has your calendar.', 'Motivational', 'Identity', 'Direct', ['motivation', 'identity']),
  e('Boring repetition is where skill is actually made.', 'Motivational', 'Craft', 'Wise', ['motivation', 'repetition']),
  e('Start with ten minutes and forgive the rest.', 'Motivational', 'Starting', 'Warm', ['motivation', 'ten']),
  h('जो इंसान बनना है, उसका कैलेंडर तुम्हारे पास ही है।', 'Motivational', 'पहचान', 'स्पष्ट', ['इंसान', 'कैलेंडर']),
  h('हुनर उबाऊ दोहराव में ही बनता है।', 'Motivational', 'कला', 'गंभीर', ['हुनर', 'दोहराव']),
  g('Jo insaan banna hai, uska calendar tumhare paas hi hai.', 'Motivational', 'Identity', 'Direct', ['insaan', 'calendar']),
  g('Hunar ubaau dohraav mein hi banta hai.', 'Motivational', 'Craft', 'Wise', ['hunar', 'dohraav']),

  /* --------------------------------------------------------- Aesthetic */
  e('One shelf of real books beats a wall of frames.', 'Aesthetic', 'Interiors', 'Practical', ['aesthetic', 'books']),
  e('Cotton and clay are always in season.', 'Aesthetic', 'Materials', 'Warm', ['aesthetic', 'materials']),
  e('Leave the corner empty. Not everything needs filling.', 'Aesthetic', 'Minimal', 'Composed', ['aesthetic', 'space']),
  h('असली किताबों की एक अलमारी, फ़्रेमों की दीवार से बेहतर है।', 'Aesthetic', 'घर', 'व्यावहारिक', ['किताबें', 'अलमारी']),
  h('कॉटन और मिट्टी हर मौसम में सही हैं।', 'Aesthetic', 'सामग्री', 'कोमल', ['कॉटन', 'मिट्टी']),
  g('Asli kitaabon ki ek almari, fraemon ki deewar se behtar hai.', 'Aesthetic', 'Interiors', 'Practical', ['kitaabon', 'almari']),
  g('Cotton aur mitti har mausam mein sahi hain.', 'Aesthetic', 'Materials', 'Warm', ['cotton', 'mitti']),

  /* ------------------------------------------------ Royal and creator */
  e('Elegance is subtraction, done confidently.', 'Royal and VIP', 'Style', 'Poised', ['royal', 'elegance']),
  e('Courtesy costs nothing and opens every heavy door.', 'Royal and VIP', 'Courtesy', 'Poised', ['royal', 'courtesy']),
  e('If you cannot explain it simply, you have not decided yet.', 'Creator and influencer', 'Clarity', 'Direct', ['creator', 'clarity']),
  e('Build in public, but keep your self-worth private.', 'Creator and influencer', 'Balance', 'Wise', ['creator', 'balance']),
  h('सादगी घटाव है, यक़ीन के साथ।', 'Royal and VIP', 'अंदाज़', 'शांत', ['सादगी', 'यक़ीन']),
  h('अदब मुफ़्त है और हर भारी दरवाज़ा खोल देता है।', 'Royal and VIP', 'अदब', 'शांत', ['अदब', 'दरवाज़ा']),
  g('Saadgi ghataav hai, yaqeen ke saath.', 'Royal and VIP', 'Style', 'Poised', ['saadgi', 'yaqeen']),
  g('Adab muft hai aur har bhaari darwaza khol deta hai.', 'Royal and VIP', 'Courtesy', 'Poised', ['adab', 'darwaza']),
  g('Jo tum dhang se samjha nahi sakte, woh abhi tay nahi hua.', 'Creator and influencer', 'Clarity', 'Direct', ['dhang', 'samjha']),

  /* ---------------------------------------------------- Mid-field top-up */
  e('A poem should sound like a person, not a document.', 'Poetry', 'Craft', 'Wise', ['poetry', 'voice']),
  e('Reread the books you loved at sixteen and argue with them.', 'Books and reading', 'Reader life', 'Wry', ['books', 'rereading']),
  e('Learn three recipes properly and you will never be stuck.', 'Food and cooking', 'Basics', 'Practical', ['food', 'recipes']),
  e('Ten minutes of walking beats an hour of scrolling guilt.', 'Fitness', 'Mindset', 'Direct', ['fitness', 'walking']),
  e('Photograph the light, not the landmark.', 'Photography', 'Craft', 'Wise', ['photography', 'light']),
  e('Play for the room, not for the recording.', 'Music and art', 'Live', 'Warm', ['music', 'live']),
  e('Name your plants and water them on time.', 'Nature', 'Plants', 'Warm', ['nature', 'plants']),
  e('The best movie snacks are shared, not portioned.', 'Cinema and OTT', 'Watching', 'Warm', ['cinema', 'snacks']),
  e('Rain makes every balcony look like a home.', 'Monsoon and seasons', 'Rain', 'Warm', ['monsoon', 'balcony']),
  e('Take the morning train and you will see the real country.', 'Travel and adventure', 'Trains', 'Warm', ['travel', 'train']),
  h('कविता इंसान जैसी लगनी चाहिए, दस्तावेज़ जैसी नहीं।', 'Poetry', 'रचना', 'गंभीर', ['कविता', 'इंसान']),
  h('तीन व्यंजन ढंग से सीख लो, कभी अटकोगे नहीं।', 'Food and cooking', 'मूल बातें', 'व्यावहारिक', ['व्यंजन', 'सीख']),
  h('दस मिनट टहलना, घंटे भर के स्क्रॉलिंग से बेहतर है।', 'Fitness', 'आदत', 'स्पष्ट', ['टहलना', 'स्क्रॉलिंग']),
  h('बारिश हर बालकनी को घर जैसा बना देती है।', 'Monsoon and seasons', 'बारिश', 'कोमल', ['बारिश', 'बालकनी']),
  g('Kavita insaan jaisi lagni chahiye, dastavez jaisi nahi.', 'Poetry', 'Craft', 'Wise', ['kavita', 'insaan']),
  g('Teen vyanjan dhang se seekh lo, kabhi atkoge nahi.', 'Food and cooking', 'Basics', 'Practical', ['vyanjan', 'seekh']),
  g('Das minute tehalna, ghante bhar ki scrolling se behtar hai.', 'Fitness', 'Mindset', 'Direct', ['tehalna', 'scrolling']),
  g('Baarish har balcony ko ghar jaisa bana deti hai.', 'Monsoon and seasons', 'Rain', 'Warm', ['baarish', 'balcony']),
];
