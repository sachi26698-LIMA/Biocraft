/**
 * BioCraft original bios — batch 003.
 * New territory: life, friendship, motivational, aesthetic, professional,
 * creator, student, fitness, travel, gaming, photography, music.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_003 = [
  /* Life and reality */
  e('Nobody warns you that peace is mostly admin.', 'Life and reality', 'Adulting', 'Dry', ['adulting', 'peace']),
  e('I grew up the day I stopped waiting to be chosen.', 'Life and reality', 'Independence', 'Steady', ['growth', 'independence']),
  e('You can lose an argument and keep the relationship.', 'Life and reality', 'Perspective', 'Wise', ['marriage', 'growth']),
  e('Everything urgent is rarely everything important.', 'Life and reality', 'Priorities', 'Reflective', ['priorities', 'focus']),
  e('Some doors open only after you stop knocking.', 'Life and reality', 'Patience', 'Wise', ['patience', 'timing']),
  h('बड़े होने का मतलब यह नहीं कि सब कुछ आसान हो गया।', 'Life and reality', 'ज़िंदगी', 'सहज', ['ज़िंदगी', 'बड़ा']),
  h('जो बात अंदर से तय हो, वो बाहर से नहीं बदलती।', 'Life and reality', 'निश्चय', 'दृढ़', ['निश्चय', 'आत्मविश्वास']),
  h('हर हार एक ऐसी तारीख है जो इंसान को समझदार बनाती है।', 'Life and reality', 'अनुभव', 'गंभीर', ['हार', 'सीख']),
  h('जो पास है उसे देखना सीखो, जो नहीं है वो अपने आप आ जाएगा।', 'Life and reality', 'संतोष', 'शांत', ['संतोष', 'शुक्र']),
  g('Bade log wo nahi jo sab kehte hain, jo cheezein chhod kar manzil tak pahunchte hain.', 'Life and reality', 'Priorities', 'Wise', ['manzil', 'choices']),
  g('Jo cheez urgent hai, zaroori nahi. Yeh samajhne mein kuch saal gaye.', 'Life and reality', 'Priorities', 'Reflective', ['urgent', 'zaroori']),
  g('Har bada insaan ek din chhota tha, bas usne us din ko chhoda nahi.', 'Life and reality', 'Independence', 'Steady', ['insaan', 'mehnat']),

  /* Friendship */
  e('We met in a bad class and stayed for a good reason.', 'Friendship', 'Origin story', 'Nostalgic', ['school', 'friends']),
  e('Some friendships survive on inside jokes and no contact for weeks.', 'Friendship', 'Low maintenance', 'Funny', ['friends', 'humour']),
  e('You are the person I do not have to explain myself to.', 'Friendship', 'Closeness', 'Warm', ['understanding', 'trust']),
  e('Loyalty is showing up when it is inconvenient.', 'Friendship', 'Loyalty', 'Sincere', ['loyalty', 'presence']),
  h('दोस्ती की सबसे अच्छी निशानी — बिना बताए भी समझ जाना।', 'Friendship', 'अपनापन', 'सहज', ['दोस्ती', 'समझ']),
  h('मिलते कम हैं, पर जब मिलते हैं तो वक़्त रुक जाता है।', 'Friendship', 'मिलना', 'स्नेही', ['मिलना', 'वक़्त']),
  h('अच्छे दोस्त सहारा नहीं, आईना होते हैं।', 'Friendship', 'सच्चाई', 'सच्चा', ['दोस्त', 'आईना']),
  h('जो दोस्त गलती पर टोके, वही केमिस्ट्री में तेरा तेरे साथ है।', 'Friendship', 'ईमानदारी', 'मज़ाकिया', ['दोस्त', 'गलती']),
  g('Dost wahi jo kambal wali raat mein bhi chai le aaye.', 'Friendship', 'Loyalty', 'Warm', ['dost', 'chai']),
  g('Milte kam hain, par jab milte hain to time ruk jaata hai.', 'Friendship', 'Low maintenance', 'Nostalgic', ['milna', 'time']),
  g('Sirf ek dost chahiye jo beech mein bole — baaki duniya bakwas karti rahe.', 'Friendship', 'Closeness', 'Sharp', ['dost', 'sach']),
  g('Class bunk karke dost banaye, ab job chhod ke same dost zaati hain.', 'Friendship', 'Origin story', 'Funny', ['dost', 'school']),

  /* Motivational */
  e('Start badly. Correct it later. Do not start never.', 'Motivational', 'Beginnings', 'Practical', ['starting', 'permission']),
  e('Your competition is the version of you who coasted.', 'Motivational', 'Self-competition', 'Direct', ['growth', 'effort']),
  e('The plan can be simple. It just has to be repeated.', 'Motivational', 'Consistency', 'Practical', ['plan', 'habit']),
  e('Energy follows action, not the other way round.', 'Motivational', 'Action', 'Practical', ['action', 'energy']),
  e('Rest is part of the work, not a break from it.', 'Motivational', 'Sustainability', 'Kind', ['rest', 'balance']),
  h('सबसे ज़्यादा पढ़ा-लिखा वही नहीं जिसने सब पढ़ा, वही जिसने जो पढ़ा उसे समझा।', 'Motivational', 'समझ', 'प्रेरक', ['पढ़ाई', 'समझ']),
  h('रोज़ थोड़ा, धीरे-धीरे, पर रुकना नहीं।', 'Motivational', 'निरंतरता', 'सहज', ['रोज़', 'निरंतरता']),
  h('जोखिम लेना बहादुरी नहीं, सोचकर जोखिम लेना बहादुरी है।', 'Motivational', 'सोच', 'गंभीर', ['जोखिम', 'सोच']),
  h('ंबल से उठो, हारना बुरा नहीं, हार मानना बुरा है।', 'Motivational', 'जारी रखना', 'प्रेरक', ['उठना', 'हार']),
  g('Roz thoda, dhire dhire, par rukna nahi.', 'Motivational', 'Consistency', 'Practical', ['roz', 'consistency']),
  g('Start kharab ho gaya? Theek hai. Rukna mana hai.', 'Motivational', 'Beginnings', 'Encouraging', ['start', 'rukna']),
  g('Sochna mat, chhota start karo. Baaki raaste mein samajh aa jayega.', 'Motivational', 'Action', 'Practical', ['sochna', 'start']),

  /* Aesthetic */
  e('Old bookstores and cold coffee.', 'Aesthetic', 'Slow living', 'Nostalgic', ['books', 'coffee']),
  e('Curates small things well.', 'Aesthetic', 'Taste', 'Refined', ['curation', 'taste']),
  e('Morning light is the most honest filter.', 'Aesthetic', 'Light', 'Soft', ['light', 'morning']),
  e('Neutral rooms, loud ideas.', 'Aesthetic', 'Interiors', 'Composed', ['interiors', 'ideas']),
  h('मिट्टी की खुशबू, बारिश की आवाज़, किताब की तह।', 'Aesthetic', 'सादगी', 'शांत', ['बारिश', 'किताब']),
  h('कुछ सुंदर चीज़ें बिना कीमत के होती हैं।', 'Aesthetic', 'सौंदर्य', 'सौम्य', ['सौंदर्य', 'सादगी']),
  h('सुबह की रोशनी सबसे ईमानदार फोटो होती है।', 'Aesthetic', 'रोशनी', 'कोमल', ['सुबह', 'रोशनी']),
  g('Purani kitaabein, thandi coffee aur dheemi subah.', 'Aesthetic', 'Slow living', 'Nostalgic', ['kitaab', 'coffee']),
  g('Kam cheezein, par badhiya cheezein.', 'Aesthetic', 'Taste', 'Refined', ['cheezein', 'taste']),
  g('Barsaat ki khushbu aur ek adhuri kvita.', 'Aesthetic', 'Slow living', 'Soft', ['barsaat', 'kavita']),

  /* Professional and business */
  e('Operations lead. I make busy teams calm.', 'Professional and business', 'Operations', 'Professional', ['operations', 'leadership']),
  e('Building simple systems for complicated days.', 'Professional and business', 'Systems', 'Professional', ['systems', 'process']),
  e('Product manager. I ask the question after the demo.', 'Professional and business', 'Product', 'Witty', ['product', 'questions']),
  e('Data that people actually act on.', 'Professional and business', 'Analytics', 'Professional', ['data', 'insight']),
  e('Consultant. My job is to make myself unnecessary.', 'Professional and business', 'Consulting', 'Witty', ['consulting', 'outcomes']),
  e('Hiring is the highest-leverage thing a founder does.', 'Professional and business', 'Hiring', 'Direct', ['hiring', 'founders']),
  h('काम बोलता है, पद नहीं।', 'Professional and business', 'काम', 'गंभीर', ['काम', 'पद']),
  h('टीम को दिशा चाहिए, बोझ नहीं।', 'Professional and business', 'नेतृत्व', 'गंभीर', ['टीम', 'दिशा']),
  h('योजना सरल हो, क्रियान्वयन लगातार।', 'Professional and business', 'प्रक्रिया', 'स्पष्ट', ['योजना', 'काम']),
  g('Kaam bolta hai, designation nahi.', 'Professional and business', 'Work', 'Professional', ['kaam', 'designation']),
  g('Team ko Himmat chahiye, sirf target nahi.', 'Professional and business', 'Leadership', 'Direct', ['team', 'target']),
  g('Process simple rakho, complaints kam ho jaati hain.', 'Professional and business', 'Systems', 'Professional', ['process', 'simple']),

  /* Creator and influencer */
  e('Making videos nobody asked for, that people apparently needed.', 'Creator and influencer', 'Video', 'Playful', ['video', 'creator']),
  e('I document the process, not the highlight reel.', 'Creator and influencer', 'Behind the scenes', 'Honest', ['process', 'honesty']),
  e('Writer first. Everything else is distribution.', 'Creator and influencer', 'Writing', 'Direct', ['writing', 'distribution']),
  e('Small channel, specific audience, real people.', 'Creator and influencer', 'Niche', 'Grounded', ['niche', 'audience']),
  h('स्टोरी बनाता हूँ, दिखावा नहीं।', 'Creator and influencer', 'सामग्री', 'सच्चा', ['कहानी', 'सामग्री']),
  h('कंटेंट वही जो लोगों के काम आए।', 'Creator and influencer', 'मूल्य', 'स्पष्ट', ['कंटेंट', 'काम']),
  h('काम दिखाओ, बातें बाद में।', 'Creator and influencer', 'ईमानदारी', 'सच्चा', ['काम', 'सच']),
  g('Video banata hoon, views ki bheekh nahi maangta.', 'Creator and influencer', 'Video', 'Bold', ['video', 'views']),
  g('Process dikhata hoon, highlight reel nahi.', 'Creator and influencer', 'Behind the scenes', 'Honest', ['process', 'honest']),
  g('Chhota channel, sahi log. Bas itna chahiye.', 'Creator and influencer', 'Niche', 'Grounded', ['channel', 'log']),

  /* Student life */
  e('Exam tomorrow. Personality permanent.', 'Student life', 'Relatable', 'Funny', ['exams', 'humour']),
  e('Learning in public, failing privately.', 'Student life', 'Learning', 'Honest', ['learning', 'growth']),
  e('Notes good. Attendance bad.', 'Student life', 'Relatable', 'Funny', ['notes', 'attendance']),
  e('Student by day, reader by night.', 'Student life', 'Reading', 'Quiet', ['student', 'reading']),
  h('पढ़ाई भी प्यारी, नींद भी प्यारी — पर सुबह सिर्फ़ एक।', 'Student life', 'पढ़ाई', 'मज़ाकिया', ['पढ़ाई', 'नींद']),
  h('कल परीक्षा है, आज समझ नहीं आ रहा कहाँ से शुरू करूँ।', 'Student life', 'परीक्षा', 'मज़ाकिया', ['परीक्षा', 'समय']),
  h('किताबें खरीदी हैं, पढ़ने का विचार अभी आना है।', 'Student life', 'किताबें', 'मज़ाकिया', ['किताबें', 'विचार']),
  g('Kal paper hai, aaj syllabus dekh ke lagta hai sapna tha.', 'Student life', 'Relatable', 'Funny', ['paper', 'syllabus']),
  g('Notes kaam ke hain, attendance ka chakkar alag hai.', 'Student life', 'Relatable', 'Funny', ['notes', 'attendance']),
  g('Padhta hoon dheere, samajhta hoon gehre.', 'Student life', 'Learning', 'Quiet', ['padhai', 'samajh']),

  /* Fitness */
  e('Lifting heavy, sleeping heavier.', 'Fitness', 'Strength', 'Playful', ['lifting', 'sleep']),
  e('Trained for the days I feel lazy, not the ones I feel great.', 'Fitness', 'Discipline', 'Practical', ['discipline', 'routine']),
  e('Progress is measured in months, not mirrors.', 'Fitness', 'Patience', 'Grounded', ['progress', 'patience']),
  h('थका हुआ हूँ, फिर भी जिम जाऊंगा।', 'Fitness', 'अनुशासन', 'दृढ़', ['जिम', 'अनुशासन']),
  h('स्वास्थ्य पहली पूंजी है, बाकी सब रोज़ कमाया जा सकता है।', 'Fitness', 'स्वास्थ्य', 'गंभीर', ['स्वास्थ्य', 'पूंजी']),
  g('Thak gaya hoon, par gym jaunga. Baad mein sochunga.', 'Fitness', 'Discipline', 'Practical', ['gym', 'thak']),
  g('Progress mirror mein nahi, mahine mein dikhta hai.', 'Fitness', 'Patience', 'Grounded', ['progress', 'mirror']),

  /* Travel and adventure */
  e('Collecting stamps, not likes.', 'Travel and adventure', 'Travel', 'Reflective', ['travel', 'stamps']),
  e('Solo trips taught me how little I actually need.', 'Travel and adventure', 'Solo', 'Reflective', ['solo', 'minimal']),
  e('Somewhere between the map and the wrong turn.', 'Travel and adventure', 'Wandering', 'Playful', ['wander', 'map']),
  h('घूमना सिखाता है कि ज़रूरत कम है।', 'Travel and adventure', 'घूमना', 'शांत', ['घूमना', 'सादगी']),
  h('रास्ते लंबे हों, तो गाने अच्छे रखना।', 'Travel and adventure', 'सफ़र', 'सहज', ['सफ़र', 'गाने']),
  g('Ghoomne se pata chalta hai, zaroorat kam hai.', 'Travel and adventure', 'Travel', 'Reflective', ['ghoomna', 'zaroorat']),
  g('Raaste lambe hain, toh gaane sahi rakho.', 'Travel and adventure', 'Wandering', 'Playful', ['raaste', 'gaane']),

  /* Gaming */
  e('Plays support. Carries anyway.', 'Gaming profiles', 'Team play', 'Witty', ['gaming', 'support']),
  e('Good aim, better excuses.', 'Gaming profiles', 'Humour', 'Playful', ['aim', 'humour']),
  e('One more match since 2019.', 'Gaming profiles', 'Relatable', 'Funny', ['matches', 'gaming']),
  h('खेल में हार जाता हूँ, दोस्ती में नहीं।', 'Gaming profiles', 'टीम', 'सहज', ['खेल', 'दोस्ती']),
  h('एक और मैच, यही सबसे बड़ी झूठ है।', 'Gaming profiles', 'मज़ाकिया', 'मज़ाकिया', ['मैच', 'मज़ाक']),
  g('Ek aur match — sabse purani jhoot meri zindagi ki.', 'Gaming profiles', 'Relatable', 'Funny', ['match', 'jhoot']),
  g('Aim average hai, par bakwaas top class.', 'Gaming profiles', 'Humour', 'Playful', ['aim', 'bakwaas']),

  /* Photography */
  e('Chasing light, missing meetings.', 'Photography', 'Light', 'Witty', ['light', 'photography']),
  e('Shot on a phone that survived three falls.', 'Photography', 'Candid', 'Honest', ['phone', 'candid']),
  e('Frames first, captions later.', 'Photography', 'Process', 'Terse', ['frames', 'process']),
  h('रोशनी को पकड़ता हूँ, लोगों को नहीं।', 'Photography', 'तस्वीर', 'कोमल', ['रोशनी', 'तस्वीर']),
  h('हर तस्वीर एक वक़्त है जो लौटकर नहीं आएगा।', 'Photography', 'याद', 'भावुक', ['तस्वीर', 'वक़्त']),
  g('Roshni pakadta hoon, baaki apne aap aa jaati hai.', 'Photography', 'Light', 'Soft', ['roshni', 'photo']),
  g('Har photo ek waqt hai jo wapas nahi aayega.', 'Photography', 'Memory', 'Nostalgic', ['photo', 'waqt']),

  /* Music and art */
  e('Album on repeat, world on mute.', 'Music and art', 'Listening', 'Calm', ['music', 'quiet']),
  e('Draws badly. Means it well.', 'Music and art', 'Art', 'Self-deprecating', ['art', 'honest']),
  e('Lyrics I misheard are my favourite songs.', 'Music and art', 'Listening', 'Funny', ['lyrics', 'misheard']),
  h('एक अच्छा गाना पूरा दिन बना देता है।', 'Music and art', 'संगीत', 'सहज', ['गाना', 'दिन']),
  h('कला वही जो बिना बोले बात कर जाए।', 'Music and art', 'कला', 'गंभीर', ['कला', 'बात']),
  g('Ek accha gaana pura din bana deta hai, sach mein.', 'Music and art', 'Listening', 'Warm', ['gaana', 'din']),
  g('Art woh jo bina bole baat kar jaye.', 'Music and art', 'Art', 'Reflective', ['art', 'baat']),
];
