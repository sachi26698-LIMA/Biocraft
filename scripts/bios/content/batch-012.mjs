/**
 * BioCraft original bios — batch 012.
 * Thinnest categories at a proportional 40/30/30 language mix.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_012 = [
  /* -------------------------------------------------------------- Minimal */
  e('Enough is a decision, not a number.', 'Minimal', 'Simplicity', 'Wise', ['minimal', 'enough']),
  e('Kept the habit. Dropped the equipment.', 'Minimal', 'Tools', 'Terse', ['minimal', 'habit']),
  e('Clean desk, unfinished thoughts. Honest arrangement.', 'Minimal', 'Workspace', 'Wry', ['minimal', 'desk']),
  e('Unsubscribed from everything that made me anxious.', 'Minimal', 'Digital', 'Honest', ['minimal', 'digital']),
  h('जितना चाहिए उतना ही, बाकी सब बोझ।', 'Minimal', 'सादगी', 'संक्षिप्त', ['सादगी', 'बोझ']),
  h('खाली मेज़, भरे विचार।', 'Minimal', 'सादगी', 'संक्षिप्त', ['मेज़', 'विचार']),
  h('जो चीज़ें डर देती थीं, उनसे दूरी बना ली।', 'Minimal', 'सादगी', 'सहज', ['चीज़ें', 'दूरी']),
  g('Jitna chahiye utna hi, baaki sab bojh hai.', 'Minimal', 'Simplicity', 'Terse', ['chahiye', 'bojh']),
  g('Khaali mez, bhare vichaar. Kaafi hai.', 'Minimal', 'Workspace', 'Wry', ['khaali', 'vichaar']),
  g('Aadat rakhi, saamaan chhod diya.', 'Minimal', 'Tools', 'Minimal', ['aadat', 'saamaan']),

  /* ------------------------------------------------------- Gaming profiles */
  e('Plays support. Carries quietly.', 'Gaming profiles', 'Team play', 'Confident', ['gaming', 'support']),
  e('Every open world, one unfinished save file.', 'Gaming profiles', 'Single player', 'Wry', ['gaming', 'saves']),
  e('Rage quits politely and returns in ten minutes.', 'Gaming profiles', 'Sessions', 'Funny', ['gaming', 'funny']),
  e('Prefers the tutorial. It is the part I understand.', 'Gaming profiles', 'Single player', 'Funny', ['gaming', 'humour']),
  h('सपोर्ट खेलता हूँ, चुपचाप जिताता हूँ।', 'Gaming profiles', 'टीम', 'आत्मविश्वासी', ['सपोर्ट', 'खेल']),
  h('हर दुनिया में एक अधूरी सेव फ़ाइल।', 'Gaming profiles', 'सिंगल प्लेयर', 'सहज', ['सेव', 'दुनिया']),
  h('दस मिनट में वापस आ जाता हूँ, गुस्सा भूलकर।', 'Gaming profiles', 'खेल', 'मज़ाकिया', ['गुस्सा', 'वापस']),
  g('Support khelta hoon, chupchaap jitaata hoon.', 'Gaming profiles', 'Team play', 'Confident', ['support', 'jitaata']),
  g('Har duniya mein ek adhoori save file.', 'Gaming profiles', 'Single player', 'Wry', ['duniya', 'save']),
  g('Das minute mein wapas aa jaata hoon, gussa bhoolkar.', 'Gaming profiles', 'Sessions', 'Funny', ['wapas', 'gussa']),

  /* ---------------------------------------------------------------- Fitness */
  e('Consistency over intensity, every time.', 'Fitness', 'Training', 'Steady', ['fitness', 'consistency']),
  e('Trains badly on bad days. Trains anyway.', 'Fitness', 'Training', 'Honest', ['fitness', 'habit']),
  e('Protein, sleep, patience. The unglamorous trio.', 'Fitness', 'Diet', 'Practical', ['fitness', 'diet']),
  h('तीव्रता से ज़्यादा निरंतरता मायने रखती है।', 'Fitness', 'प्रशिक्षण', 'दृढ़', ['निरंतरता', 'प्रशिक्षण']),
  h('बुरे दिन भी जिम जाता हूँ, बस धीरे।', 'Fitness', 'आदत', 'सहज', ['बुरे', 'जिम']),
  g('Tez se zyada zaroori hai roz aana.', 'Fitness', 'Training', 'Steady', ['roz', 'aana']),
  g('Bure din bhi jaata hoon, bas dheere.', 'Fitness', 'Habit', 'Honest', ['bure', 'dheere']),

  /* ----------------------------------------------------------- Music and art */
  e('Practice is the only part that is actually mine.', 'Music and art', 'Music', 'Honest', ['music', 'practice']),
  e('Paints badly, frames it anyway.', 'Music and art', 'Art', 'Funny', ['art', 'humour']),
  e('A good song is a room you can live in.', 'Music and art', 'Listening', 'Wise', ['music', 'listening']),
  h('रियाज़ ही एकमात्र चीज़ है जो अपनी है।', 'Music and art', 'संगीत', 'गंभीर', ['रियाज़', 'संगीत']),
  h('अच्छा गाना एक कमरा होता है जिसमें रहा जा सके।', 'Music and art', 'सुनना', 'सहज', ['गाना', 'कमरा']),
  g('Riyaz hi ekmatra cheez hai jo apni hai.', 'Music and art', 'Music', 'Honest', ['riyaz', 'apni']),
  g('Accha gaana ek kamra hota hai jisme reh sakte ho.', 'Music and art', 'Listening', 'Wise', ['gaana', 'kamra']),

  /* ------------------------------------------------------- Fashion and beauty */
  e('Bought fewer things. Wore them more.', 'Fashion and beauty', 'Style rules', 'Minimal', ['fashion', 'minimal']),
  e('Fits well beats costs more. Every time.', 'Fashion and beauty', 'Fit', 'Practical', ['fashion', 'fit']),
  h('कम खरीदा, ज़्यादा पहना।', 'Fashion and beauty', 'सलीका', 'संक्षिप्त', ['खरीदा', 'पहना']),
  h('ढंग से फिट होना क़ीमत से बड़ी बात है।', 'Fashion and beauty', 'सलीका', 'व्यावहारिक', ['फिट', 'क़ीमत']),
  g('Kam kharida, zyada pehna. Itna hi kaafi hai.', 'Fashion and beauty', 'Style rules', 'Minimal', ['kharida', 'pehna']),
  g('Dhang se fit hona keemat se badi baat hai.', 'Fashion and beauty', 'Fit', 'Practical', ['fit', 'keemat']),

  /* -------------------------------------------------------- Attitude depth */
  e('I am not cold. I am just not performing warmth.', 'Attitude', 'Honesty', 'Direct', ['attitude', 'honesty']),
  e('Speak once. I heard you the first time.', 'Attitude', 'Restraint', 'Terse', ['attitude', 'silence']),
  e('Respect is earned in behaviour, not vocabulary.', 'Attitude', 'Standards', 'Wise', ['attitude', 'respect']),
  h('मैं ठंडा नहीं हूँ, बस नाटक नहीं करता।', 'Attitude', 'स्पष्टता', 'स्पष्ट', ['ठंडा', 'नाटक']),
  h('एक बार बोलो, मैं पहली बार में सुन लेता हूँ।', 'Attitude', 'संयम', 'स्पष्ट', ['बोलो', 'संयम']),
  g('Main thanda nahi hoon, bas naatak nahi karta.', 'Attitude', 'Honesty', 'Direct', ['thanda', 'naatak']),
  g('Ek baar bolo, main pehli baar mein sun leta hoon.', 'Attitude', 'Restraint', 'Terse', ['bolo', 'sunta']),

  /* ----------------------------------------------------- Love depth */
  e('The unglamorous part of love is remembering the small things.', 'Love and romance', 'Everyday', 'Warm', ['love', 'attention']),
  e('I want the ordinary with you, not the highlight reel.', 'Love and romance', 'Real love', 'Tender', ['love', 'ordinary']),
  e('You are the reason I stopped rehearsing goodbyes.', 'Love and romance', 'Devoted', 'Romantic', ['love', 'trust']),
  h('प्यार का असली हिस्सा छोटी-छोटी बातें याद रखना है।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['प्यार', 'बातें']),
  h('तुम्हारे साथ साधारण दिन भी खास लगता है।', 'Love and romance', 'अपनापन', 'कोमल', ['साधारण', 'दिन']),
  g('Pyaar ka asli hissa chhoti baatein yaad rakhna hai.', 'Love and romance', 'Everyday', 'Warm', ['pyaar', 'baatein']),
  g('Tumhare saath saadharan din bhi khaas lagta hai.', 'Love and romance', 'Real love', 'Tender', ['saadharan', 'khaas']),

  /* ----------------------------------------------------- Sad depth */
  e('I keep the last text as a small terrible museum.', 'Sad and heartbreak', 'Loss', 'Aching', ['sad', 'memory']),
  e('Healing is not linear and nobody warns you.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'healing']),
  h('आखिरी संदेश आज भी सहेज रखा है।', 'Sad and heartbreak', 'याद', 'भावुक', ['संदेश', 'याद']),
  g('Aakhri message aaj bhi sambhaal ke rakha hai.', 'Sad and heartbreak', 'Loss', 'Aching', ['message', 'rakha']),

  /* ------------------------------------------- Quotes and thoughts depth */
  e('You can be right and still be unkind.', 'Quotes and thoughts', 'Kindness', 'Wise', ['quotes', 'kindness']),
  e('Every shortcut is a later lesson.', 'Quotes and thoughts', 'Craft', 'Terse', ['quotes', 'craft']),
  e('Boredom is where a lot of good ideas live.', 'Quotes and thoughts', 'Creativity', 'Wise', ['quotes', 'ideas']),
  h('सही होना दयालु होने से बड़ी बात नहीं है।', 'Quotes and thoughts', 'दया', 'गंभीर', ['सही', 'दया']),
  h('हर शॉर्टकट एक छोटा सबक छोड़ जाता है।', 'Quotes and thoughts', 'काम', 'स्पष्ट', ['शॉर्टकट', 'सबक']),
  g('Sahi hona dayalu hone se badi baat nahi hai.', 'Quotes and thoughts', 'Kindness', 'Wise', ['sahi', 'dayalu']),

  /* ------------------------------------------------------- Life depth */
  e('Your future is mostly decided by your calendar.', 'Life and reality', 'Priorities', 'Direct', ['life', 'priorities']),
  e('Nobody remembers the week you skipped your rest.', 'Life and reality', 'Rest', 'Wise', ['life', 'rest']),
  h('आपका कल ज़्यादातर आपके कैलेंडर से तय होता है।', 'Life and reality', 'प्राथमिकता', 'स्पष्ट', ['कैलेंडर', 'कल']),
  h('कोई उस हफ़्ते को याद नहीं रखता जब आराम छोड़ा था।', 'Life and reality', 'आराम', 'गंभीर', ['आराम', 'हफ़्ता']),
  g('Aapka kal zyadatar aapke calendar se tay hota hai.', 'Life and reality', 'Priorities', 'Direct', ['calendar', 'tay']),

  /* ------------------------------------------ Aesthetic / poetry depth */
  e('Likes things in grayscale and people in technicolour.', 'Aesthetic', 'Palette', 'Wry', ['aesthetic', 'people']),
  e('The line breaks matter more than the words do.', 'Poetry', 'Craft', 'Wise', ['poetry', 'craft']),
  h('चीज़ें सादी, लोग रंगीन — बस इतना ही।', 'Aesthetic', 'रंग', 'सहज', ['चीज़ें', 'लोग']),
  h('लय शब्दों से ज़्यादा बोलती है।', 'Poetry', 'रचना', 'गंभीर', ['लय', 'शब्द']),
  g('Cheezein saadi, log rangeen. Bas itna hi.', 'Aesthetic', 'Palette', 'Wry', ['cheezein', 'rangeen']),
  g('Lay shabdon se zyada bolti hai.', 'Poetry', 'Craft', 'Wise', ['lay', 'shabdon']),
];
