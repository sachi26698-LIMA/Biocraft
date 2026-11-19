/**
 * BioCraft original bios — batch 016.
 * Depth: leaders at a 40/30/30 language proportion.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_016 = [
  /* -------------------------------------------------------------- Attitude */
  e('I can be replaced at work. Not in my own life.', 'Attitude', 'Priorities', 'Wise', ['attitude', 'priorities']),
  e('Unimpressed is a complete sentence.', 'Attitude', 'Composure', 'Cool', ['attitude', 'composure']),
  e('No hard feelings. Just no more access.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'boundaries']),
  e('I stopped explaining and the arguments got shorter.', 'Attitude', 'Restraint', 'Wry', ['attitude', 'restraint']),
  e('My peace is not a negotiation.', 'Attitude', 'Boundaries', 'Firm', ['attitude', 'peace']),
  e('Be useful or be quiet. Both are respectable.', 'Attitude', 'Standards', 'Blunt', ['attitude', 'useful']),
  e('I do not chase. I decide.', 'Attitude', 'Self-possession', 'Terse', ['attitude', 'agency']),
  h('काम में मैं बदले जा सकता हूँ, अपनी ज़िंदगी में नहीं।', 'Attitude', 'प्राथमिकता', 'गंभीर', ['काम', 'ज़िंदगी']),
  h('माफ़ी हो सकती है, मंज़ूरी नहीं।', 'Attitude', 'सीमाएं', 'दृढ़', ['माफ़ी', 'मंज़ूरी']),
  h('काम आओ, बातें बाद में।', 'Attitude', 'मानक', 'स्पष्ट', ['काम', 'बातें']),
  h('मैं पीछे नहीं भागता, मैं फ़ैसला करता हूँ।', 'Attitude', 'स्वाभिमान', 'दृढ़', ['फ़ैसला', 'पीछे']),
  g('Main peeche nahi bhaagta, main faisla karta hoon.', 'Attitude', 'Self-possession', 'Terse', ['peeche', 'faisla']),
  g('Maafi ho sakti hai, manzoori nahi.', 'Attitude', 'Boundaries', 'Firm', ['maafi', 'manzoori']),
  g('Kaam mein main badle ja sakta hoon, apni zindagi mein nahi.', 'Attitude', 'Priorities', 'Wise', ['kaam', 'zindagi']),

  /* ------------------------------------------------------ Love and romance */
  e('We are not romantic. We are reliable. I prefer it.', 'Love and romance', 'Real love', 'Honest', ['love', 'reliable']),
  e('You know all my worst stories and stayed.', 'Love and romance', 'Acceptance', 'Tender', ['love', 'acceptance']),
  e('I am at my best when you are in the room.', 'Love and romance', 'Admiration', 'Sweet', ['love', 'presence']),
  e('Love is remembering what they take in their tea.', 'Love and romance', 'Everyday', 'Warm', ['love', 'details']),
  e('The future is easier to picture with you in it.', 'Love and romance', 'Devoted', 'Romantic', ['love', 'future']),
  e('I chose you on an ordinary day and I keep choosing.', 'Love and romance', 'Devotion', 'Tender', ['love', 'choice']),
  h('हम रोमांटिक नहीं, भरोसेमंद हैं। यही बेहतर है।', 'Love and romance', 'रोज़मर्रा', 'सहज', ['रोमांटिक', 'भरोसेमंद']),
  h('तुमने मेरी सबसे बुरी बातें जानकर भी साथ रखा।', 'Love and romance', 'अपनापन', 'कोमल', ['बातें', 'साथ']),
  h('प्यार वो है जो चाय में चीनी जितना याद है।', 'Love and romance', 'रोज़मर्रा', 'कोमल', ['चाय', 'प्यार']),
  g('Hum romantic nahi, bharosemand hain. Yahi behtar hai.', 'Love and romance', 'Real love', 'Honest', ['romantic', 'bharosemand']),
  g('Tumne meri sabse buri baatein jaankar bhi saath rakha.', 'Love and romance', 'Acceptance', 'Tender', ['baatein', 'saath']),
  g('Pyaar woh hai jo chai mein cheeni jitna yaad hai.', 'Love and romance', 'Everyday', 'Warm', ['chai', 'pyaar']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('The hardest part was not the ending. It was the politeness.', 'Sad and heartbreak', 'Ending', 'Heavy', ['sad', 'ending']),
  e('I gave my best and it was not the thing you wanted.', 'Sad and heartbreak', 'Rejection', 'Honest', ['sad', 'rejection']),
  e('I am the one who kept the photographs.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'photos']),
  e('Some people leave and take the weather with them.', 'Sad and heartbreak', 'Absence', 'Raw', ['sad', 'absence']),
  h('सबसे मुश्किल अंत नहीं था, वो औपचारिकता थी।', 'Sad and heartbreak', 'अंत', 'गंभीर', ['अंत', 'औपचारिकता']),
  h('मैंने अपना सब दिया, तुम्हें वो नहीं चाहिए था।', 'Sad and heartbreak', 'अस्वीकार', 'भावुक', ['सब', 'चाहिए']),
  h('तस्वीरें मैंने ही सहेज कर रखीं।', 'Sad and heartbreak', 'याद', 'भावुक', ['तस्वीरें', 'याद']),
  g('Sabse mushkil ant nahi tha, woh aurparikta thi.', 'Sad and heartbreak', 'Ending', 'Heavy', ['mushkil', 'ant']),
  g('Tasveerein maine hi rakhi hain, aaj tak ghar mein.', 'Sad and heartbreak', 'Memory', 'Aching', ['tasveerein', 'ghar']),

  /* ------------------------------------------------------ Shayari depth */
  h('मुझे तेरी आदत है,\nऔर आदतें यादों से ज़्यादा टिकती हैं।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['आदत', 'यादें']),
  h('हम ऐसे बिछड़े कि मिलने का बहाना भी नहीं बना,\nऔर बहाने बनाना हमें आता था।', 'Shayari', 'दो पंक्ति', 'भावुक', ['बिछड़े', 'बहाना']),
  h('मेरी थकान की कहानी मत लिखो,\nमेरी मेहनत की लिखो, वो लंबी है।', 'Shayari', 'दो पंक्ति', 'दृढ़', ['थकान', 'मेहनत']),
  h('वो मिला तो लगा रास्ता पूरा हुआ,\nवो गया तो लगा रास्ता ही मंज़िल था।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['रास्ता', 'मंज़िल']),
  h('चाय ठंडी हो गई,\nबातें अब भी गर्म हैं।', 'Shayari', 'दो पंक्ति', 'सहज', ['चाय', 'बातें']),
  g('Mujhe teri aadat hai, aur aadatein yaadon se zyada tikti hain.', 'Shayari', 'Two line', 'Romantic', ['aadat', 'yaadon']),
  g('Hum aise bichhde ki milne ka bahaana bhi nahi bana.', 'Shayari', 'Two line', 'Aching', ['bichhde', 'bahaana']),
  g('Meri thakaan ki kahani mat likho, meri mehnat ki likho.', 'Shayari', 'Two line', 'Firm', ['thakaan', 'mehnat']),
  g('Chai thandi ho gayi, baatein ab bhi garam hain.', 'Shayari', 'Two line', 'Warm', ['chai', 'baatein']),

  /* ------------------------------------------------------ Life and reality */
  e('You are allowed to want a small and quiet life.', 'Life and reality', 'Permission', 'Warm', ['life', 'small']),
  e('The people who matter do not need the full explanation.', 'Life and reality', 'People', 'Wise', ['life', 'people']),
  e('Every year I keep fewer plans and get more done.', 'Life and reality', 'Focus', 'Honest', ['life', 'focus']),
  h('छोटी और शांत ज़िंदगी चाहना भी जायज़ है।', 'Life and reality', 'स्वीकृति', 'कोमल', ['ज़िंदगी', 'शांत']),
  h('जो अपने हैं, उन्हें पूरी कहानी सुनाने की ज़रूरत नहीं।', 'Life and reality', 'अपने', 'गंभीर', ['अपने', 'कहानी']),
  g('Chhoti aur shaant zindagi chaahna bhi jaayaz hai.', 'Life and reality', 'Permission', 'Warm', ['zindagi', 'shaant']),
  g('Jo apne hain, unhe poori kahani sunane ki zaroorat nahi.', 'Life and reality', 'People', 'Wise', ['apne', 'kahani']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('A calm person is not an unserious person.', 'Quotes and thoughts', 'Composure', 'Wise', ['quotes', 'calm']),
  e('You can tell a lot about someone by what they find funny.', 'Quotes and thoughts', 'People', 'Observant', ['quotes', 'humour']),
  e('Do not mistake movement for progress.', 'Quotes and thoughts', 'Focus', 'Direct', ['quotes', 'progress']),
  h('शांत आदमी गैर-गंभीर नहीं होता।', 'Quotes and thoughts', 'संयम', 'गंभीर', ['शांत', 'गंभीर']),
  h('हिलने-डुलने को तरक्की मत समझो।', 'Quotes and thoughts', 'ध्यान', 'स्पष्ट', ['तरक्की', 'हिलना']),
  g('Shaant aadmi gair-serious nahi hota.', 'Quotes and thoughts', 'Composure', 'Wise', ['shaant', 'serious']),
  g('Hilne-dulne ko taraqqi mat samjho.', 'Quotes and thoughts', 'Focus', 'Direct', ['taraqqi', 'samjho']),

  /* --------------------------------------------------- Motivational depth */
  e('You do not need a new life. You need a new Tuesday.', 'Motivational', 'Starting', 'Encouraging', ['motivation', 'starting']),
  e('Finish something small before starting something shiny.', 'Motivational', 'Focus', 'Direct', ['motivation', 'finish']),
  e('Practice in private until the public part is easy.', 'Motivational', 'Craft', 'Wise', ['motivation', 'practice']),
  h('नई ज़िंदगी नहीं, नया मंगलवार चाहिए।', 'Motivational', 'शुरुआत', 'प्रेरक', ['मंगलवार', 'शुरुआत']),
  h('नया शुरू करने से पहले पुराना पूरा करो।', 'Motivational', 'ध्यान', 'स्पष्ट', ['पूरा', 'शुरू']),
  g('Nai zindagi nahi, naya mangalvaar chahiye.', 'Motivational', 'Starting', 'Encouraging', ['mangalvaar', 'chahiye']),
  g('Naya shuru karne se pehle puraana poora karo.', 'Motivational', 'Focus', 'Direct', ['puraana', 'poora']),

  /* ----------------------------------------- Aesthetic / style / poetry */
  e('Curated colours, uncurated thoughts.', 'Aesthetic', 'Palette', 'Wry', ['aesthetic', 'thoughts']),
  e('One candle and no agenda.', 'Aesthetic', 'Slow living', 'Calm', ['aesthetic', 'evening']),
  e('The last line is the one that took all week.', 'Poetry', 'Craft', 'Honest', ['poetry', 'craft']),
  e('Clothes that survive the laundry are the real favourites.', 'Stylish', 'Style rules', 'Practical', ['style', 'favourites']),
  h('रंग चुने हुए, विचार बिना छन्नी के।', 'Aesthetic', 'रंग', 'सहज', ['रंग', 'विचार']),
  h('आखिरी पंक्ति में ही पूरा हफ़्ता लग जाता है।', 'Poetry', 'रचना', 'गंभीर', ['पंक्ति', 'हफ़्ता']),
  g('Rang chune hue, vichaar bina chhanni ke.', 'Aesthetic', 'Palette', 'Wry', ['rang', 'vichaar']),
  g('Aakhri pankti mein hi pura hafta lag jaata hai.', 'Poetry', 'Craft', 'Honest', ['pankti', 'hafta']),
  g('Kapde jo dhulne ke baad bhi bache, wahi asli pasand hain.', 'Stylish', 'Style rules', 'Practical', ['kapde', 'pasand']),
];
