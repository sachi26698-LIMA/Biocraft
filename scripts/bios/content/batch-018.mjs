/**
 * BioCraft original bios — batch 018.
 * Depth on the leaders plus mid-field top-ups, 40/30/30.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_018 = [
  /* -------------------------------------------------------------- Attitude */
  e('I am polite because I was raised well, not because I agree.', 'Attitude', 'Bearing', 'Composed', ['attitude', 'polite']),
  e('Never mistake my silence for a lack of notes.', 'Attitude', 'Restraint', 'Sharp', ['attitude', 'silence']),
  e('I have a short list of people I would move cities for.', 'Attitude', 'Loyalty', 'Warm', ['attitude', 'loyalty']),
  e('You can be in my life or in my way. Choose.', 'Attitude', 'Boundaries', 'Blunt', ['attitude', 'boundaries']),
  e('I am not looking for validation. I am looking for evidence.', 'Attitude', 'Standards', 'Direct', ['attitude', 'evidence']),
  e('Confidence is just remembering what you survived.', 'Attitude', 'Growth', 'Wise', ['attitude', 'growth']),
  e('Do not test me and then call it a surprise.', 'Attitude', 'Boundaries', 'Witty', ['attitude', 'limits']),
  h('मैं विनम्र हूँ क्योंकि परवरिश अच्छी हुई, सहमति नहीं दी।', 'Attitude', 'सलीका', 'शांत', ['विनम्र', 'परवरिश']),
  h('चुप्पी को कम नोट्स मत समझना।', 'Attitude', 'संयम', 'तीखा', ['चुप्पी', 'नोट्स']),
  h('मेरी सूची छोटी है, पर उसमें कोई फ़ालतू नहीं।', 'Attitude', 'निष्ठा', 'कोमल', ['सूची', 'फ़ालतू']),
  h('आत्मविश्वास यह याद रखना है कि क्या-क्या झेल लिया।', 'Attitude', 'विकास', 'गंभीर', ['आत्मविश्वास', 'झेला']),
  g('Main vinamr hoon kyunki parvarish acchi hui, sehmati nahi di.', 'Attitude', 'Bearing', 'Composed', ['vinamr', 'parvarish']),
  g('Chuppi ko kam notes mat samajhna.', 'Attitude', 'Restraint', 'Sharp', ['chuppi', 'notes']),
  g('Meri list chhoti hai, par usme koi faltu nahi.', 'Attitude', 'Loyalty', 'Warm', ['list', 'faltu']),
  g('Atmavishwas yeh yaad rakhna hai ki kya kya jhela.', 'Attitude', 'Growth', 'Wise', ['atmavishwas', 'jhela']),

  /* ------------------------------------------------------ Love and romance */
  e('You are my favourite reason to leave the party early.', 'Love and romance', 'Closeness', 'Sweet', ['love', 'closeness']),
  e('I would choose your company over almost any plan.', 'Love and romance', 'Devotion', 'Warm', ['love', 'choice']),
  e('Two cups of tea and a conversation that goes nowhere. Perfect.', 'Love and romance', 'Everyday', 'Warm', ['love', 'tea']),
  e('You met me mid-plot and stayed for the rest.', 'Love and romance', 'Acceptance', 'Tender', ['love', 'acceptance']),
  e('I want to be the person who makes your worst day shorter.', 'Love and romance', 'Devotion', 'Tender', ['love', 'care']),
  e('Love is not a grand gesture. It is showing up in the rain.', 'Love and romance', 'Real love', 'Wise', ['love', 'actions']),
  h('तुम पार्टी से जल्दी निकलने की मेरी पसंदीदा वजह हो।', 'Love and romance', 'नज़दीकी', 'कोमल', ['पार्टी', 'वजह']),
  h('दो कप चाय और बिना मतलब की बातें, बस इतना काफ़ी है।', 'Love and romance', 'रोज़मर्रा', 'सहज', ['चाय', 'बातें']),
  h('प्यार बड़ी चीज़ नहीं, बारिश में पहुँचना है।', 'Love and romance', 'निभाना', 'गंभीर', ['प्यार', 'बारिश']),
  h('मैं वो बनना चाहता हूँ जो तुम्हारा सबसे बुरा दिन छोटा कर दे।', 'Love and romance', 'साथ', 'कोमल', ['बुरा दिन', 'साथ']),
  g('Tum party se jaldi nikalne ki meri pasandeeda wajah ho.', 'Love and romance', 'Closeness', 'Sweet', ['party', 'wajah']),
  g('Do cup chai aur bina matlab ki baatein, bas itna kaafi hai.', 'Love and romance', 'Everyday', 'Warm', ['chai', 'baatein']),
  g('Pyaar badi cheez nahi, baarish mein pahunchna hai.', 'Love and romance', 'Real love', 'Wise', ['pyaar', 'baarish']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I gave the best version of me to someone who was leaving.', 'Sad and heartbreak', 'Loss', 'Raw', ['sad', 'loss']),
  e('There is a specific silence that only follows a last message.', 'Sad and heartbreak', 'Ending', 'Heavy', ['sad', 'ending']),
  e('You are a place I cannot visit and cannot forget.', 'Sad and heartbreak', 'Longing', 'Aching', ['sad', 'longing']),
  e('Healing took longer than the relationship and nobody warned me.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'healing']),
  e('I have stopped waiting, but I have not stopped looking.', 'Sad and heartbreak', 'Grief', 'Raw', ['sad', 'grief']),
  h('मैंने अपना सबसे अच्छा वो दिया जो जाने की तैयारी में था।', 'Sad and heartbreak', 'हानि', 'भावुक', ['सबसे', 'जाने']),
  h('आखिरी संदेश के बाद एक ख़ास सन्नाटा आता है।', 'Sad and heartbreak', 'अंत', 'गंभीर', ['संदेश', 'सन्नाटा']),
  h('तुम वो जगह हो जहाँ जा नहीं सकता, भूल नहीं सकता।', 'Sad and heartbreak', 'लालसा', 'भावुक', ['जगह', 'भूल']),
  h('उबरने में रिश्ते से ज़्यादा वक़्त लगा, किसी ने नहीं बताया।', 'Sad and heartbreak', 'उबरना', 'स्पष्ट', ['उबरना', 'वक़्त']),
  g('Maine apna sabse accha woh diya jo jaane ki taiyaari mein tha.', 'Sad and heartbreak', 'Loss', 'Raw', ['sabse', 'jaane']),
  g('Aakhri message ke baad ek khaas sannata aata hai.', 'Sad and heartbreak', 'Ending', 'Heavy', ['message', 'sannata']),
  g('Tum woh jagah ho jahan ja nahi sakta, bhool nahi sakta.', 'Sad and heartbreak', 'Longing', 'Aching', ['jagah', 'bhool']),

  /* ------------------------------------------------------ Shayari depth */
  h('मैं तेरे दरवाज़े तक आया था,\nफिर सोचा, तू तो कब का जा चुका है।', 'Shayari', 'दो पंक्ति', 'भावुक', ['दरवाज़ा', 'सोचा']),
  h('ज़िंदगी से शिकायत नहीं,\nबस हिसाब बराबर नहीं।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['ज़िंदगी', 'हिसाब']),
  h('जो मुझे समझते हैं वो कम हैं,\nपर उनके लिए मैं पूरा हूँ।', 'Shayari', 'दो पंक्ति', 'कोमल', ['समझते', 'पूरा']),
  h('तेरी यादों की तरह तेरा शहर भी\nधीरे-धीरे अजनबी हो गया।', 'Shayari', 'दो पंक्ति', 'भावुक', ['यादें', 'शहर']),
  h('मैं बस इतना चाहता था\nकि कोई मुझे बिना कहे समझ ले।', 'Shayari', 'दो पंक्ति', 'कोमल', ['चाहता', 'समझ']),
  h('लड़खड़ाकर चलना भी चलना है,\nरुक जाना बस बहाना है।', 'Shayari', 'दो पंक्ति', 'प्रेरक', ['चलना', 'रुकना']),
  g('Main tere darwaaze tak aaya tha, phir socha tu toh kab ka ja chuka hai.', 'Shayari', 'Two line', 'Aching', ['darwaaze', 'socha']),
  g('Zindagi se shikayat nahi, bas hisaab baraabar nahi.', 'Shayari', 'Two line', 'Deep', ['zindagi', 'hisaab']),
  g('Jo mujhe samajhte hain woh kam hain, par unke liye main poora hoon.', 'Shayari', 'Two line', 'Warm', ['samajhte', 'poora']),
  g('Teri yaadon ki tarah tera shehar bhi ajnabi ho gaya.', 'Shayari', 'Two line', 'Aching', ['yaadon', 'shehar']),
  g('Ladkhadakar chalna bhi chalna hai, ruk jaana bas bahaana hai.', 'Shayari', 'Two line', 'Motivational', ['chalna', 'bahaana']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('Peace is not the absence of problems. It is the presence of perspective.', 'Quotes and thoughts', 'Peace', 'Wise', ['quotes', 'peace']),
  e('Do not ask for feedback from people who have never built anything.', 'Quotes and thoughts', 'Discernment', 'Direct', ['quotes', 'feedback']),
  e('Effort is the only thing you fully control.', 'Quotes and thoughts', 'Agency', 'Direct', ['quotes', 'effort']),
  e('Being kind is not the same as being available.', 'Quotes and thoughts', 'Boundaries', 'Sharp', ['quotes', 'kindness']),
  e('A good day is a decision made before noon.', 'Quotes and thoughts', 'Habit', 'Practical', ['quotes', 'days']),
  h('शांति समस्याओं की कमी नहीं, नज़रिया की मौजूदगी है।', 'Quotes and thoughts', 'शांति', 'गंभीर', ['शांति', 'नज़रिया']),
  h('जिसने कुछ बनाया नहीं, उससे राय मत मांगो।', 'Quotes and thoughts', 'समझ', 'स्पष्ट', ['राय', 'बनाया']),
  h('मेहनत ही एक चीज़ है जो पूरी तुम्हारे हाथ में है।', 'Quotes and thoughts', 'कर्म', 'स्पष्ट', ['मेहनत', 'हाथ']),
  h('दयालु होना उपलब्ध होना नहीं है।', 'Quotes and thoughts', 'सीमाएं', 'तीखा', ['दयालु', 'उपलब्ध']),
  g('Shaanti samasyaon ki kami nahi, nazariya ki maujoodgi hai.', 'Quotes and thoughts', 'Peace', 'Wise', ['shaanti', 'nazariya']),
  g('Jisne kuch banaya nahi, usse raay mat maango.', 'Quotes and thoughts', 'Discernment', 'Direct', ['raay', 'banaya']),
  g('Mehnat hi ek cheez hai jo poori tumhare haath mein hai.', 'Quotes and thoughts', 'Agency', 'Direct', ['mehnat', 'haath']),
  g('Dayalu hona uplabdh hona nahi hai.', 'Quotes and thoughts', 'Boundaries', 'Sharp', ['dayalu', 'uplabdh']),

  /* ------------------------------------------------------ Life and reality */
  e('You are not behind. You are on a different map.', 'Life and reality', 'Perspective', 'Warm', ['life', 'perspective']),
  e('The version of you that survives is the version that adapts.', 'Life and reality', 'Growth', 'Wise', ['life', 'growth']),
  e('Say no early and everyone saves an evening.', 'Life and reality', 'Boundaries', 'Practical', ['life', 'boundaries']),
  e('Nobody owes you the benefit of the doubt forever.', 'Life and reality', 'Reputation', 'Direct', ['life', 'reputation']),
  h('तुम पीछे नहीं हो, तुम्हारा नक्शा अलग है।', 'Life and reality', 'समझ', 'कोमल', ['नक्शा', 'पीछे']),
  h('जल्दी ना कहो, सबका एक-एक शाम बच जाएगा।', 'Life and reality', 'सीमाएं', 'व्यावहारिक', ['ना', 'शाम']),
  h('कोई हमेशा के लिए भरोसा देने को बाध्य नहीं है।', 'Life and reality', 'साख', 'स्पष्ट', ['भरोसा', 'साख']),
  g('Tum peeche nahi ho, tumhara naksha alag hai.', 'Life and reality', 'Perspective', 'Warm', ['naksha', 'peeche']),
  g('Jaldi na kaho, sabka ek ek shaam bach jayega.', 'Life and reality', 'Boundaries', 'Practical', ['jaldi', 'shaam']),

  /* --------------------------------------------------- Motivational depth */
  e('The first draft is supposed to be bad. That is its job.', 'Motivational', 'Starting', 'Encouraging', ['motivation', 'drafts']),
  e('You will not feel ready. Start at 70 percent.', 'Motivational', 'Starting', 'Direct', ['motivation', 'starting']),
  e('Small daily evidence beats a large annual promise.', 'Motivational', 'Consistency', 'Wise', ['motivation', 'consistency']),
  h('पहला ड्राफ़्ट खराब ही होता है, वही उसका काम है।', 'Motivational', 'शुरुआत', 'प्रेरक', ['ड्राफ़्ट', 'काम']),
  h('तैयार महसूस नहीं होगा, सत्तर प्रतिशत पर शुरू करो।', 'Motivational', 'शुरुआत', 'स्पष्ट', ['तैयार', 'शुरू']),
  g('Pehla draft kharab hi hota hai, wahi uska kaam hai.', 'Motivational', 'Starting', 'Encouraging', ['draft', 'kaam']),
  g('Taiyaar mehsoos nahi hoga, sattar percent par shuru karo.', 'Motivational', 'Starting', 'Direct', ['taiyaar', 'shuru']),

  /* ------------------------------------------- Aesthetic / poetry depth */
  e('A good notebook smells like a decision.', 'Aesthetic', 'Tools', 'Warm', ['aesthetic', 'notebook']),
  e('I keep the ugly lamp. It has better stories.', 'Aesthetic', 'Interiors', 'Wry', ['aesthetic', 'objects']),
  e('Short poems are honest because there is nowhere to hide.', 'Poetry', 'Craft', 'Wise', ['poetry', 'craft']),
  h('अच्छी डायरी में फ़ैसले की खुशबू होती है।', 'Aesthetic', 'सादगी', 'सहज', ['डायरी', 'खुशबू']),
  h('छोटी कविता सच्ची होती है, छिपने की जगह नहीं होती।', 'Poetry', 'रचना', 'गंभीर', ['कविता', 'सच्ची']),
  g('Acchi diary mein faisle ki khushbu hoti hai.', 'Aesthetic', 'Tools', 'Warm', ['diary', 'khushbu']),
  g('Chhoti kavita sacchi hoti hai, chhipne ki jagah nahi hoti.', 'Poetry', 'Craft', 'Wise', ['kavita', 'jagah']),

  /* ---------------------------------------------- Mid-field top-ups */
  e('Studied engineering, learned patience from a broken laptop.', 'Technology and coding', 'Developer', 'Wry', ['tech', 'developer']),
  e('I read the docs before asking. It is a personality flaw.', 'Technology and coding', 'Developer', 'Dry', ['tech', 'docs']),
  e('Two dishes, done well. Nothing else on the menu.', 'Food and cooking', 'Cooking', 'Practical', ['food', 'menu']),
  e('Grew up in a kitchen and it never left me.', 'Food and cooking', 'Home kitchen', 'Warm', ['food', 'home']),
  e('Photographs my friends more than the scenery.', 'Photography', 'People', 'Warm', ['photography', 'people']),
  e('My camera roll is 90 percent dogs.', 'Photography', 'People', 'Funny', ['photography', 'dogs']),
  h('इंजीनियरिंग पढ़ी, सब्र टूटे लैपटॉप से सीखा।', 'Technology and coding', 'डेवलपर', 'मज़ाकिया', ['इंजीनियरिंग', 'सब्र']),
  h('दो व्यंजन, अच्छे से बने। बाकी मेन्यू में कुछ नहीं।', 'Food and cooking', 'रसोई', 'व्यावहारिक', ['व्यंजन', 'मेन्यू']),
  h('रसोई में बड़ा हुआ, वो कभी नहीं छूटी।', 'Food and cooking', 'घर', 'कोमल', ['रसोई', 'घर']),
  h('दोस्तों की तस्वीरें ज़्यादा, नज़ारों की कम।', 'Photography', 'लोग', 'कोमल', ['तस्वीरें', 'दोस्त']),
  g('Do vyanjan, achhe se bane. Baaki menu mein kuch nahi.', 'Food and cooking', 'Cooking', 'Practical', ['vyanjan', 'menu']),
  g('Rasoi mein bada hua, woh kabhi nahi chhuti.', 'Food and cooking', 'Home kitchen', 'Warm', ['rasoi', 'chhuti']),
  g('Doston ki tasveerein zyada, nazaron ki kam.', 'Photography', 'People', 'Warm', ['doston', 'tasveerein']),
  g('Docs pehle padhta hoon, phir poochta hoon.', 'Technology and coding', 'Developer', 'Dry', ['docs', 'poochta']),
];
