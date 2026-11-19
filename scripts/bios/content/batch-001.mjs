/**
 * BioCraft original bios — batch 001.
 *
 * Written for this library. Each entry carries the subcategory, tone and tags
 * that describe it, because a bio without those cannot be filtered usefully and
 * cannot prove it belongs to its category.
 *
 * Bilingual pairs are written independently in each language, not translated
 * line-by-line: the Hindi and Hinglish versions carry a different image, not a
 * word-swapped copy of the English one. The deduplicator rejects cross-language
 * copies by fingerprint, so a translated pair would be caught anyway — but the
 * editorial rule is that each version should stand on its own.
 */

/** @typedef {{ text: string, lang: 'en'|'hi'|'hg', category: string, subcategory: string, tone: string, tags: string[] }} BioSeed */

export const CATEGORIES = [
  'Attitude', 'Royal and VIP', 'Love and romance', 'Sad and heartbreak',
  'Alone and loneliness', 'Life and reality', 'Motivational', 'Friendship',
  'Family', 'Aesthetic', 'Minimal', 'Stylish', 'Shayari', 'Poetry',
  'Quotes and thoughts', 'Funny and comedy', 'Savage and bold',
  'Deep and emotional', 'Spirituality and peace', 'Student life',
  'Professional and business', 'Creator and influencer', 'Instagram profiles',
  'Gaming profiles', 'Travel and adventure', 'Nature', 'Fitness',
  'Photography', 'Music and art', 'Self-respect', 'Personality and identity',
  'Books and reading', 'Food and cooking', 'Technology and coding',
  'Fashion and beauty', 'Yoga and wellness', 'Pets and animals',
  'Startup and hustle', 'Science and curiosity', 'Cinema and OTT',
  'Cricket and sports', 'Cars and bikes', 'Home and interiors',
  'Parenting', 'Wedding and celebration', 'Monsoon and seasons',
];

const S = 'biocraft-original';

const e = (text, category, subcategory, tone, tags) => ({
  text, lang: 'en', category, subcategory, tone, tags, sourceId: S,
});
const h = (text, category, subcategory, tone, tags) => ({
  text, lang: 'hi', category, subcategory, tone, tags, sourceId: S,
});
const g = (text, category, subcategory, tone, tags) => ({
  text, lang: 'hg', category, subcategory, tone, tags, sourceId: S,
});

export const BATCH_001 = [
  /* ------------------------------------------------------------- Attitude */
  e('Not the loudest in the room, just the last one standing.', 'Attitude', 'Quiet confidence', 'Composed', ['confidence', 'calm', 'presence']),
  e('I do not chase, I build. Whatever follows is welcome.', 'Attitude', 'Self-directed', 'Firm', ['focus', 'boundaries', 'hustle']),
  e('Soft spoken. Hard to move.', 'Attitude', 'Quiet confidence', 'Understated', ['calm', 'strength']),
  e('Opinions are mine. Receipts available on request.', 'Attitude', 'Direct', 'Blunt', ['opinionated', 'honest']),
  e('You can disagree with me and still be right about something else.', 'Attitude', 'Open-minded', 'Fair', ['respect', 'debate']),
  h('शोर में नहीं, काम में बोलता हूँ।', 'Attitude', 'शांत आत्मविश्वास', 'गंभीर', ['आत्मविश्वास', 'काम']),
  h('रास्ता मेरा है, रफ़्तार अपनी।', 'Attitude', 'आत्मनिर्भर', 'दृढ़', ['रास्ता', 'मेहनत']),
  h('मुझे साबित करने की ज़रूरत नहीं, मैं खुद को जानता हूँ।', 'Attitude', 'आत्म-सम्मान', 'स्थिर', ['आत्मज्ञान', 'शांति']),
  g('Shor kam, kaam zyada. Baaki sab apne aap samajh jaoge.', 'Attitude', 'Quiet confidence', 'Chill', ['kaam', 'attitude']),
  g('Meri nazar mein attitude nahi, mehnat bolti hai.', 'Attitude', 'Hustle mindset', 'Direct', ['mehnat', 'focus']),
  g('Log kya kahenge, yeh sochne mein hi zindagi nikal gayi. Main kar raha hoon.', 'Attitude', 'Self-directed', 'Bold', ['log', 'zindagi']),

  /* -------------------------------------------------------- Royal and VIP */
  e('Some things are inherited. Composure is one of them.', 'Royal and VIP', 'Old money', 'Poised', ['classy', 'elegant']),
  e('Manners cost nothing and separate everything.', 'Royal and VIP', 'Etiquette', 'Refined', ['manners', 'class']),
  e('Quiet wealth, louder standards.', 'Royal and VIP', 'Old money', 'Discreet', ['luxury', 'standards']),
  e('I would rather be respected in a plain room than ignored in a grand one.', 'Royal and VIP', 'Values', 'Grounded', ['respect', 'values']),
  h('शालीनता में ही असली रौब है।', 'Royal and VIP', 'शालीनता', 'गंभीर', ['शालीनता', 'रौब']),
  h('खानदानी बात नहीं, सलीका बोलता है।', 'Royal and VIP', 'सलीका', 'सौम्य', ['सलीका', 'परिवार']),
  h('सादगी में भी शाही अंदाज़ आता है।', 'Royal and VIP', 'सादगी', 'सौम्य', ['सादगी', 'शाही']),
  g('Log brand dekhte hain, hum tameez dekhte hain.', 'Royal and VIP', 'Class over brands', 'Composed', ['tameez', 'royal']),
  g('Raja woh nahi jo takht pe baitha ho, raja woh hai jo zameen pe khada rehkar bhi izzat kamaye.', 'Royal and VIP', 'Character', 'Grounded', ['izzat', 'character']),

  /* ---------------------------------------------------- Love and romance */
  e('Fell for the way you laugh at your own jokes.', 'Love and romance', 'New love', 'Warm', ['love', 'laughter']),
  e('You are my favourite reason to leave the phone face down.', 'Love and romance', 'Devoted', 'Tender', ['love', 'presence']),
  e('Same person, different day, still choosing you.', 'Love and romance', 'Long-term', 'Steady', ['love', 'commitment']),
  e('Distance taught me that timing is a love language too.', 'Love and romance', 'Long distance', 'Wistful', ['distance', 'patience']),
  h('आपकी हँसी मेरी सबसे पसंदीदा आवाज़ है।', 'Love and romance', 'नई मोहब्बत', 'कोमल', ['मोहब्बत', 'हँसी']),
  h('मोहब्बत नाप-तौल में नहीं होती, बस हो जाती है।', 'Love and romance', 'मोहब्बत', 'भावुक', ['मोहब्बत', 'एहसास']),
  h('तुमसे बात करके लगता है दिन ठीक बीत गया।', 'Love and romance', 'रोज़मर्रा', 'सहज', ['बातें', 'अपनापन']),
  g('Tumhari hansi meri favourite ringtone hai.', 'Love and romance', 'Devoted', 'Sweet', ['hansi', 'pyaar']),
  g('Pyaar wahi jo bina wajah bhi nibhaya jaaye.', 'Love and romance', 'Unconditional', 'Tender', ['pyaar', 'nibhana']),
  g('Door hoke bhi dil ke sabse kareeb ho.', 'Love and romance', 'Long distance', 'Wistful', ['doori', 'dil']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('Grief is just love with nowhere to go.', 'Sad and heartbreak', 'Loss', 'Heavy', ['grief', 'loss']),
  e('Some people leave and the room stays cold.', 'Sad and heartbreak', 'Heartbreak', 'Melancholic', ['heartbreak', 'absence']),
  e('I have learned to be okay on days you would have liked.', 'Sad and heartbreak', 'Moving on', 'Bittersweet', ['moving on', 'memory']),
  h('कुछ लोग जाते हैं और कमरा ठंडा रह जाता है।', 'Sad and heartbreak', 'जुदाई', 'उदास', ['जुदाई', 'याद']),
  h('टूटा हुआ दिल भी अपनी सुनने की आदत नहीं छोड़ता।', 'Sad and heartbreak', 'दुख', 'भावुक', ['दिल', 'दुख']),
  g('Tumhare jaane ke baad ghar thoda aur chhota lagta hai.', 'Sad and heartbreak', 'Heartbreak', 'Melancholic', ['jaana', 'yaadein']),
  g('Kuch log yaad nahi aate, ghar se saaf hi nahi hote.', 'Sad and heartbreak', 'Moving on', 'Bittersweet', ['yaadein', 'dil']),

  /* ------------------------------------------------- Alone and loneliness */
  e('Comfortable alone, not afraid of company.', 'Alone and loneliness', 'Self-sufficient', 'Calm', ['solitude', 'peace']),
  e('Loneliness is loudest in a room full of people.', 'Alone and loneliness', 'Introspective', 'Reflective', ['loneliness', 'thoughts']),
  e('I keep my own company well.', 'Alone and loneliness', 'Solitude', 'Quiet', ['solitude', 'independent']),
  h('अकेलापन बुरा नहीं, बेकार संगत से अच्छा है।', 'Alone and loneliness', 'आत्मनिर्भरता', 'शांत', ['अकेलापन', 'संगत']),
  h('खुद के साथ वक़्त बिताना भी एक हुनर है।', 'Alone and loneliness', 'एकांत', 'शांत', ['एकांत', 'शांति']),
  g('Akela hoon, tanha nahi. Farq samajhne walon ke liye.', 'Alone and loneliness', 'Solitude', 'Calm', ['akela', 'tanha']),
  g('Bheed mein bhi khud ke saath rehna seekh liya.', 'Alone and loneliness', 'Introspective', 'Reflective', ['bheed', 'khud']),

  /* ----------------------------------------------------- Life and reality */
  e('Plans change. Standards should not.', 'Life and reality', 'Principles', 'Steady', ['principles', 'growth']),
  e('Life is mostly admin with a few good sunsets.', 'Life and reality', 'Adulting', 'Dry humour', ['adulting', 'reality']),
  e('Every lesson arrived disguised as a bad week.', 'Life and reality', 'Growth', 'Reflective', ['lessons', 'growth']),
  h('ज़िंदगी सवाल नहीं पूछती, सिर्फ़ वक़्त देती है।', 'Life and reality', 'ज़िंदगी', 'गंभीर', ['ज़िंदगी', 'वक़्त']),
  h('पढ़ाई अलग बात, समझदारी अलग बात।', 'Life and reality', 'अनुभव', 'सहज', ['समझदारी', 'सीख']),
  g('Zindagi ne sabse bada sabak tab diya jab phone band tha aur sochna pada.', 'Life and reality', 'Growth', 'Reflective', ['zindagi', 'sabak']),
  g('Sabse zyada tohfe wajah hi nahi dun. Bas ho jaata hai.', 'Life and reality', 'Impermanence', 'Gentle', ['zindagi', 'tohfe']),

  /* -------------------------------------------------------- Motivational */
  e('Small hands, big work, every single day.', 'Motivational', 'Consistency', 'Earnest', ['consistency', 'work']),
  e('Do the boring part first and the day behaves.', 'Motivational', 'Discipline', 'Practical', ['discipline', 'routine']),
  e('You are allowed to start badly and continue well.', 'Motivational', 'Beginnings', 'Encouraging', ['starting', 'permission']),
  h('बोलने से ज़्यादा असर करने में है।', 'Motivational', 'कर्म', 'प्रेरक', ['कर्म', 'मेहनत']),
  h('कम करो, पर पूरा दिल से करो।', 'Motivational', 'नीयत', 'सहज', ['नीयत', 'दिल']),
  g('Boring kaam pehle karo, din apne aap theek ho jaata hai.', 'Motivational', 'Discipline', 'Practical', ['discipline', 'routine']),
  g('Galti se seekha, tameez se jiya.', 'Motivational', 'Growth', 'Reflective', ['galti', 'seekh']),

  /* ---------------------------------------------------------- Friendship */
  e('A handful of people I would call at 2 a.m.', 'Friendship', 'Close circle', 'Loyal', ['friends', 'loyalty']),
  e('Good friends make bad days survivable.', 'Friendship', 'Support', 'Warm', ['support', 'friends']),
  e('We are not a group, we are a habit.', 'Friendship', 'Group', 'Playful', ['group', 'fun']),
  h('दोस्त वो ही जो कमी को बताने से हिचकें नहीं।', 'Friendship', 'सच्चे दोस्त', 'सच्चा', ['दोस्त', 'सच']),
  h('अपने लोग बहुत कम हैं, इसीलिए अपने हैं।', 'Friendship', 'अपना दायरा', 'सहज', ['दोस्त', 'दायरा']),
  g('2 baje raat ko phone kar sakte hain, wahi log apne hain.', 'Friendship', 'Close circle', 'Loyal', ['raat', 'dost']),
  g('Dost kaun hai? Jo tere se pehle teri galti maan le.', 'Friendship', 'Support', 'Playful', ['dost', 'galti']),

  /* -------------------------------------------------------------- Family */
  e('Everything I have came from one tiny kitchen and a lot of patience.', 'Family', 'Parents', 'Grateful', ['parents', 'home']),
  e('I am my mother’s patience and my father’s stubborn streak.', 'Family', 'Parents', 'Warm', ['mother', 'father']),
  e('Family chat is the only app I check without needing to.', 'Family', 'Home', 'Playful', ['family', 'home']),
  h('मां की उंगलियों की महक से बना हूँ।', 'Family', 'मां', 'भावुक', ['मां', 'घर']),
  h('घर का खाना, बापू की सलाह, मां की डांट — बस इतना ही पूंजी है।', 'Family', 'परिवार', 'सहज', ['घर', 'परिवार']),
  g('Maa ki daant aur papa ki salaah, yehi meri poblicity hai.', 'Family', 'Parents', 'Playful', ['maa', 'papa']),
  g('Ghar ka khana is the only brand I trust blindly.', 'Family', 'Home', 'Playful', ['khana', 'ghar']),

  /* ------------------------------------------------------------ Aesthetic */
  e('Soft colours, sharp thoughts.', 'Aesthetic', 'Soft minimal', 'Gentle', ['soft', 'minimal']),
  e('Collects quiet moments. Shares a few.', 'Aesthetic', 'Quiet', 'Calm', ['quiet', 'moments']),
  e('Film grain and long evenings.', 'Aesthetic', 'Vintage', 'Nostalgic', ['vintage', 'film']),
  h('धीमी सुबह, ठंडी चाय, अधूरी किताब।', 'Aesthetic', 'सुबह', 'शांत', ['सुबह', 'चाय']),
  h('कम सामान, ज़्यादा जगह।', 'Aesthetic', 'सादगी', 'शांत', ['सादगी', 'सुकून']),
  g('Dheemi subah, thandi chai, adhuri kavita.', 'Aesthetic', 'Soft minimal', 'Gentle', ['subah', 'chai']),
  g('Kam shabd, zyada sukoon.', 'Aesthetic', 'Quiet', 'Calm', ['sukoon', 'shabd']),

  /* -------------------------------------------------------------- Minimal */
  e('Less, but better.', 'Minimal', 'Reduction', 'Terse', ['minimal', 'focus']),
  e('Building in silence.', 'Minimal', 'Focus', 'Terse', ['focus', 'quiet']),
  e('Reading. Running. Repeating.', 'Minimal', 'Routine', 'Neutral', ['routine', 'simple']),
  h('कम में ही ज़्यादा है।', 'Minimal', 'संक्षिप्त', 'सहज', ['संक्षिप्त', 'सादगी']),
  h('इंसान होना ही सबसे बड़ी पहचान है।', 'Minimal', 'संक्षिप्त', 'सहज', ['पहचान', 'सादगी']),
  g('Kam bolta hoon, kaam karta hoon.', 'Minimal', 'Reduction', 'Terse', ['kaam', 'minimal']),
  g('Bas, itna hi.', 'Minimal', 'Terse', 'Neutral', ['minimal', 'simple']),

  /* -------------------------------------------------------------- Stylish */
  e('Wears plain clothes, keeps loud standards.', 'Stylish', 'Personal style', 'Confident', ['style', 'standards']),
  e('Comfort is the new luxury.', 'Stylish', 'Fashion', 'Relaxed', ['comfort', 'style']),
  h('सलीका पहनते हैं, दिखावा नहीं।', 'Stylish', 'सलीका', 'आत्मविश्वास', ['सलीका', 'दिखावा']),
  g('Style naam se nahi, safaai se dikhta hai.', 'Stylish', 'Personal style', 'Confident', ['style', 'safai']),
];
