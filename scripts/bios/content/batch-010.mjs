/**
 * BioCraft original bios — batch 010.
 * English-weighted to correct the 20/15/15 split drift noted in the ledger.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_010 = [
  /* --------------------------------------------------------------- Attitude */
  e('Underestimate me quietly. It saves us both time.', 'Attitude', 'Composure', 'Cool', ['attitude', 'composure']),
  e('My patience is a courtesy, not a capacity.', 'Attitude', 'Boundaries', 'Sharp', ['patience', 'limits']),
  e('Loud people rarely need to be answered.', 'Attitude', 'Restraint', 'Wise', ['attitude', 'silence']),
  e('I do not do drama. I do distance.', 'Attitude', 'Boundaries', 'Blunt', ['attitude', 'distance']),
  e('Learned to leave before I learned to argue.', 'Attitude', 'Growth', 'Honest', ['attitude', 'growth']),
  e('You may have an opinion. You may also keep it.', 'Attitude', 'Savage', 'Witty', ['attitude', 'opinion']),

  /* ------------------------------------------------------- Love and romance */
  e('Love is the small thing done again tomorrow.', 'Love and romance', 'Real love', 'Warm', ['love', 'consistency']),
  e('You laugh at my worst joke. That is the whole reason.', 'Love and romance', 'Everyday', 'Sweet', ['love', 'laughter']),
  e('I would choose the boring version of us again.', 'Love and romance', 'Devotion', 'Tender', ['love', 'choice']),
  e('You are not my other half. You are a whole person I like.', 'Love and romance', 'Respect', 'Wise', ['love', 'respect']),
  e('Every version of the future has your name in the margin.', 'Love and romance', 'Devoted', 'Romantic', ['future', 'love']),
  e('I like you better than I like most ideas.', 'Love and romance', 'Admiration', 'Witty', ['love', 'liking']),

  /* ---------------------------------------------------------------- Sad */
  e('I rehearse conversations you will never have with me.', 'Sad and heartbreak', 'Longing', 'Raw', ['sad', 'longing']),
  e('The worst part was how normal the last day felt.', 'Sad and heartbreak', 'Loss', 'Heavy', ['sad', 'loss']),
  e('I have stopped counting. That is not the same as healed.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'healing']),
  e('You left a version of me that I still run into.', 'Sad and heartbreak', 'Identity', 'Aching', ['sad', 'identity']),

  /* ------------------------------------------------------- Life and reality */
  e('Nobody is coming to rescue your Tuesday.', 'Life and reality', 'Agency', 'Direct', ['life', 'agency']),
  e('You become the average of what you repeat.', 'Life and reality', 'Habit', 'Wise', ['life', 'habit']),
  e('Sleep is the cheapest performance enhancer ever invented.', 'Life and reality', 'Rest', 'Practical', ['life', 'sleep']),
  e('The best apology is a changed behaviour.', 'Life and reality', 'Honesty', 'Direct', ['life', 'apology']),
  e('Money buys options, not happiness. Options help.', 'Life and reality', 'Money', 'Honest', ['life', 'money']),

  /* ------------------------------------------------------------- Motivational */
  e('Do the version of it you can do today.', 'Motivational', 'Consistency', 'Steady', ['motivation', 'consistency']),
  e('Competence is quiet and it lasts.', 'Motivational', 'Craft', 'Wise', ['motivation', 'craft']),
  e('Start ugly. Improve in public. This is allowed.', 'Motivational', 'Starting', 'Encouraging', ['motivation', 'starting']),
  e('Discipline is choosing what you want most, once a day.', 'Motivational', 'Discipline', 'Wise', ['motivation', 'discipline']),

  /* --------------------------------------------------------- Friendship */
  e('Friendship is remembering the small thing they mentioned once.', 'Friendship', 'Attention', 'Warm', ['friendship', 'attention']),
  e('We met at fourteen and never formally introduced ourselves.', 'Friendship', 'Time', 'Warm', ['friendship', 'years']),
  e('Good friends argue without keeping score.', 'Friendship', 'Honesty', 'Wise', ['friendship', 'honesty']),

  /* -------------------------------------------------- Aesthetic */
  e('A quiet room beats a loud compliment.', 'Aesthetic', 'Interiors', 'Calm', ['aesthetic', 'quiet']),
  e('I like things that look used and cared for.', 'Aesthetic', 'Texture', 'Warm', ['aesthetic', 'objects']),

  /* ------------------------------------------------- Quotes */
  e('You cannot shortcut taste. You can only develop it.', 'Quotes and thoughts', 'Craft', 'Wise', ['taste', 'craft']),
  e('Being early is a personality trait. I do not have it.', 'Quotes and thoughts', 'Self-knowledge', 'Wry', ['punctuality', 'humour']),

  /* -------------------------------------------------- Royal and VIP */
  e('Bearing is what remains when the title is removed.', 'Royal and VIP', 'Bearing', 'Regal', ['royal', 'bearing']),
  e('Stand straight. Let the work speak in a lower register.', 'Royal and VIP', 'Presence', 'Regal', ['royal', 'presence']),

  /* -------------------------------------------------- Professional */
  e('I would rather ship a decision than defend a slide.', 'Professional and business', 'Execution', 'Direct', ['business', 'execution']),
  e('Meetings should end with an owner and a date.', 'Professional and business', 'Management', 'Practical', ['business', 'meetings']),

  /* -------------------------------------------------------- Creator */
  e('The audience is a consequence, not a goal.', 'Creator and influencer', 'Perspective', 'Wise', ['creator', 'audience']),
  e('I would rather be useful to two hundred people than famous to a million.', 'Creator and influencer', 'Perspective', 'Grounded', ['creator', 'useful']),

  /* ---------------------------------------------------------- Student */
  e('Studied hard, learned more from the corridor.', 'Student life', 'Campus', 'Wry', ['student', 'campus']),
  e('Every semester begins with a system and ends with survival.', 'Student life', 'Student', 'Funny', ['student', 'semester']),

  /* --------------------------------------------------------- Alone */
  e('Solitude is a skill, not a punishment.', 'Alone and loneliness', 'Solitude', 'Wise', ['alone', 'solitude']),
  e('I learned my own company and stopped panicking at silence.', 'Alone and loneliness', 'Growth', 'Honest', ['alone', 'growth']),

  /* ------------------------------------------------ Style and aesthetic */
  e('Well-made things age better than trends do.', 'Stylish', 'Craft', 'Wise', ['style', 'craft']),
  e('Sunscreen, sleep and a decent haircut. Nothing mystical.', 'Stylish', 'Routine', 'Practical', ['style', 'routine']),

  /* --------------------------------------------- Fitness and wellness */
  e('Strong enough to carry groceries and my own problems.', 'Fitness', 'Gym', 'Wry', ['fitness', 'strength']),
  e('Motion first. Motivation arrives late and takes credit.', 'Fitness', 'Motivation', 'Wise', ['fitness', 'motion']),

  /* --------------------------------------------- Food */
  e('I cook to think, and then I eat the evidence.', 'Food and cooking', 'Cooking', 'Wry', ['food', 'cooking']),
  e('A well-stocked fridge is a form of self-respect.', 'Food and cooking', 'Home kitchen', 'Practical', ['food', 'kitchen']),

  /* ------------------------------------------- Travel */
  e('Travelling is the only purchase that gets heavier with use.', 'Travel and adventure', 'Travel style', 'Wise', ['travel', 'memory']),
  e('I take the slow train because the destination is not the point.', 'Travel and adventure', 'Trains', 'Calm', ['travel', 'trains']),

  /* --------------------------------------- Photography / music */
  e('Photographs the ordinary until it looks intentional.', 'Photography', 'Craft', 'Observant', ['photography', 'craft']),
  e('Learned music by copying badly and then fixing it.', 'Music and art', 'Music', 'Honest', ['music', 'learning']),

  /* ------------------------------------------------ Hindi additions */
  h('इज्ज़त मांगने से नहीं, कमाने से मिलती है।', 'Attitude', 'स्वाभिमान', 'दृढ़', ['इज्ज़त', 'कमाना']),
  h('जो मुझे छोड़ गया, वह मेरी कमी नहीं थी।', 'Sad and heartbreak', 'आत्मसम्मान', 'गंभीर', ['कमी', 'छोड़ना']),
  h('रिश्ते निभाए जाते हैं, जताए नहीं जाते।', 'Love and romance', 'निभाना', 'गंभीर', ['रिश्ते', 'निभाना']),
  h('धीरे-धीरे मंज़िल तक पहुँचना भी पहुँचना है।', 'Motivational', 'मंज़िल', 'प्रेरक', ['मंज़िल', 'धीरे']),
  h('सच कड़वा हो तो भी पीना पड़ता है।', 'Quotes and thoughts', 'सच', 'गंभीर', ['सच', 'कड़वा']),
  h('अपना हुनर किसी के मनाने से नहीं बढ़ता।', 'Professional and business', 'हुनर', 'गंभीर', ['हुनर', 'अपना']),
  h('दोस्ती में समय नहीं, साथ होना ज़रूरी है।', 'Friendship', 'साथ', 'कोमल', ['दोस्ती', 'समय']),
  h('पानी जैसा रहो, रास्ता खुद बन जाता है।', 'Life and reality', 'रास्ता', 'गंभीर', ['पानी', 'रास्ता']),
  h('थकान बता रही है कि तुम कुछ कर रहे हो।', 'Motivational', 'मेहनत', 'प्रेरक', ['थकान', 'मेहनत']),
  h('जो पसंद है उसे आकार दो, बहाना नहीं।', 'Creator and influencer', 'रचना', 'स्पष्ट', ['पसंद', 'बहाना']),
  h('घर लौटते वक़्त दिल हल्का हो, वही घर है।', 'Home and interiors', 'घर', 'कोमल', ['घर', 'दिल']),
  h('बच्चे बड़े होते हैं, आदतें नहीं।', 'Parenting', 'आदतें', 'सहज', ['बच्चे', 'आदतें']),

  /* ---------------------------------------------- Hinglish additions */
  g('Izzat maangne se nahi, kamaane se milti hai.', 'Attitude', 'Self-respect', 'Firm', ['izzat', 'kamaane']),
  g('Jo mujhe chhod gaya, woh meri kami nahi thi.', 'Sad and heartbreak', 'Self-worth', 'Honest', ['kami', 'chhod']),
  g('Rishte nibhaaye jaate hain, jataaye nahi jaate.', 'Love and romance', 'Devotion', 'Wise', ['rishte', 'nibhaaye']),
  g('Dheere dheere manzil tak pahunchna bhi pahunchna hai.', 'Motivational', 'Consistency', 'Steady', ['manzil', 'dheere']),
  g('Sach kadwa ho toh bhi peena padta hai.', 'Quotes and thoughts', 'Truth', 'Sharp', ['sach', 'kadwa']),
  g('Dosti mein time nahi, saath hona zaroori hai.', 'Friendship', 'Loyalty', 'Warm', ['dosti', 'saath']),
  g('Paani jaisa raho, raasta khud ban jaata hai.', 'Life and reality', 'Flow', 'Wise', ['paani', 'raasta']),
  g('Thakaan bata rahi hai ki tum kuch kar rahe ho.', 'Motivational', 'Work', 'Encouraging', ['thakaan', 'kar']),
  g('Ghar lautte waqt dil halka ho, wahi ghar hai.', 'Home and interiors', 'Home', 'Tender', ['ghar', 'dil']),
  g('Bachche bade ho jaate hain, aadatein nahi.', 'Parenting', 'Parent life', 'Wry', ['bachche', 'aadatein']),
  g('Apna hunar kisi ke manaane se nahi badhta.', 'Professional and business', 'Craft', 'Direct', ['hunar', 'apna']),
];
