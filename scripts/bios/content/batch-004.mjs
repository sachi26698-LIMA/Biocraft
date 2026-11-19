/**
 * BioCraft original bios — batch 004.
 * Completes coverage of the declared category set.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_004 = [
  /* Spirituality and peace */
  e('Quiet mind, steady hands.', 'Spirituality and peace', 'Stillness', 'Serene', ['stillness', 'peace']),
  e('Faith is what I do when nobody is watching.', 'Spirituality and peace', 'Practice', 'Sincere', ['faith', 'practice']),
  e('Peace was never outside me. I was just loud.', 'Spirituality and peace', 'Insight', 'Reflective', ['peace', 'silence']),
  h('मन शांत हो, तो रास्ते खुद दिखने लगते हैं।', 'Spirituality and peace', 'शांति', 'शांत', ['शांति', 'मन']),
  h('जप कम करो, ध्यान ज़्यादा।', 'Spirituality and peace', 'साधना', 'गंभीर', ['साधना', 'ध्यान']),
  g('Man shant ho, toh raaste khud dikh jaate hain.', 'Spirituality and peace', 'Stillness', 'Serene', ['man', 'shanti']),

  /* Self-respect */
  e('I do not audition for people who already decided.', 'Self-respect', 'Boundaries', 'Firm', ['boundaries', 'respect']),
  e('Apology accepted. Access does not return automatically.', 'Self-respect', 'Limits', 'Final', ['limits', 'respect']),
  e('Walking away is also a form of respect.', 'Self-respect', 'Closure', 'Calm', ['closure', 'dignity']),
  h('इज़्ज़त वही जो खुद अपनी दे।', 'Self-respect', 'स्वाभिमान', 'दृढ़', ['इज़्ज़त', 'आत्मसम्मान']),
  h('जहाँ जवाब नहीं मिलता, वहाँ दोबारा सवाल नहीं।', 'Self-respect', 'सीमाएं', 'शांत', ['सीमाएं', 'स्वाभिमान']),
  g('Jahan jawab nahi milta, wahan dobara sawaal nahi.', 'Self-respect', 'Limits', 'Calm', ['jawab', 'izzat']),

  /* Personality and identity */
  e('A little bookish, a little reckless, mostly curious.', 'Personality and identity', 'Self-description', 'Warm', ['curious', 'identity']),
  e('I contain contradictions and refuse to pick one.', 'Personality and identity', 'Identity', 'Bold', ['identity', 'nuance']),
  e('Loud laugh, low drama.', 'Personality and identity', 'Self-description', 'Playful', ['humour', 'calm']),
  h('थोड़ा बैचेन, थोड़ा शांत। दोनों मैं ही हूँ।', 'Personality and identity', 'पहचान', 'सहज', ['पहचान', 'विरोधाभास']),
  h('मैं बस मैं हूँ, और यही सबसे बड़ी पहचान है।', 'Personality and identity', 'आत्मज्ञान', 'सहज', ['पहचान', 'स्वीकार']),
  g('Thoda pagal hoon, thoda shant. Dono main hi hoon.', 'Personality and identity', 'Identity', 'Playful', ['pagal', 'shant']),

  /* Books and reading */
  e('Reading my way out of bad weeks.', 'Books and reading', 'Comfort', 'Quiet', ['books', 'comfort']),
  e('Too many unread books, exactly the right amount of ambition.', 'Books and reading', 'Bookish', 'Witty', ['books', 'ambition']),
  e('Annotates everything, remembers nothing.', 'Books and reading', 'Relatable', 'Funny', ['annotation', 'reading']),
  h('किताबें मेरी सबसे शांत दोस्त हैं।', 'Books and reading', 'किताबें', 'शांत', ['किताबें', 'दोस्त']),
  h('पढ़ना सीखना नहीं है, पढ़ना खुद से बात करना है।', 'Books and reading', 'पढ़ना', 'गंभीर', ['पढ़ना', 'बात']),
  g('Kitaabein meri sabse shant dost hain.', 'Books and reading', 'Bookish', 'Quiet', ['kitaab', 'dost']),

  /* Food and cooking */
  e('Cooks for one, portions for four.', 'Food and cooking', 'Home cooking', 'Witty', ['cooking', 'portions']),
  e('Food is how I say everything I cannot.', 'Food and cooking', 'Care', 'Warm', ['food', 'love']),
  e('Recipe follower, spice improviser.', 'Food and cooking', 'Cooking', 'Playful', ['recipe', 'spice']),
  h('खाना बनाना मेरा ध्यान है।', 'Food and cooking', 'रसोई', 'शांत', ['खाना', 'ध्यान']),
  h('मां के हाथ का खाना, कोई ब्रांड उसके बराबर नहीं।', 'Food and cooking', 'घर का खाना', 'स्नेही', ['खाना', 'मां']),
  g('Khana banana mera dhyan hai, sach mein.', 'Food and cooking', 'Home cooking', 'Warm', ['khana', 'dhyan']),

  /* Technology and coding */
  e('Deleting more code than I write.', 'Technology and coding', 'Engineering', 'Dry', ['code', 'refactor']),
  e('Software engineer. I read the error messages.', 'Technology and coding', 'Engineering', 'Practical', ['code', 'debugging']),
  e('Automating my own job, slowly and carefully.', 'Technology and coding', 'Automation', 'Witty', ['automation', 'code']),
  h('कोड लिखता हूँ, बग अपने आप घुस जाते हैं।', 'Technology and coding', 'कोडिंग', 'मज़ाकिया', ['कोड', 'बग']),
  h('सफलता वही जब कोड चले और मन भी।', 'Technology and coding', 'इंजीनियरिंग', 'सहज', ['कोड', 'मन']),
  g('Code likhta hoon, bugs apne aap ghus jaate hain.', 'Technology and coding', 'Engineering', 'Funny', ['code', 'bugs']),

  /* Fashion and beauty */
  e('Wears what she likes. Twice.', 'Fashion and beauty', 'Personal style', 'Confident', ['style', 'confidence']),
  e('Fashion is effort. Comfort is strategy.', 'Fashion and beauty', 'Style', 'Witty', ['fashion', 'comfort']),
  e('One good coat, endless bad weather.', 'Fashion and beauty', 'Wardrobe', 'Dry', ['coat', 'weather']),
  h('कपड़े सादे, सोच बड़ी।', 'Fashion and beauty', 'सलीका', 'सहज', ['कपड़े', 'सोच']),
  h('सौंदर्य वही जो अंदर से बाहर आए।', 'Fashion and beauty', 'सौंदर्य', 'सौम्य', ['सौंदर्य', 'अंदर']),
  g('Kapde saade hain, soch badi.', 'Fashion and beauty', 'Style', 'Confident', ['kapde', 'soch']),

  /* Yoga and wellness */
  e('Slower on purpose.', 'Yoga and wellness', 'Pace', 'Calm', ['yoga', 'slow']),
  e('Stretching is my kind of ambition.', 'Yoga and wellness', 'Practice', 'Playful', ['stretching', 'calm']),
  e('Sleep is the most underrated supplement.', 'Yoga and wellness', 'Recovery', 'Practical', ['sleep', 'health']),
  h('शरीर को भी आराम चाहिए, मन को भी।', 'Yoga and wellness', 'स्वास्थ्य', 'शांत', ['शरीर', 'आराम']),
  h('साँस पर ध्यान दो, बाकी अपने आप सही हो जाएगा।', 'Yoga and wellness', 'साँस', 'शांत', ['साँस', 'ध्यान']),
  g('Saans par dhyan do, baaki apne aap theek ho jayega.', 'Yoga and wellness', 'Breath', 'Calm', ['saans', 'dhyan']),

  /* Pets and animals */
  e('Owned by a dog and happily employed by him.', 'Pets and animals', 'Dog person', 'Warm', ['dog', 'humour']),
  e('Cat parent. Staff, technically.', 'Pets and animals', 'Cat person', 'Funny', ['cat', 'humour']),
  e('Feed a stray, change a morning.', 'Pets and animals', 'Strays', 'Kind', ['strays', 'kindness']),
  h('बिल्ली का नौकर हूँ, और खुश हूँ।', 'Pets and animals', 'पालतू', 'मज़ाकिया', ['बिल्ली', 'पालतू']),
  h('पशु बोलते नहीं, समझते ज़्यादा हैं।', 'Pets and animals', 'पशु', 'स्नेही', ['पशु', 'समझ']),
  g('Billi ka naukar hoon, aur khush hoon.', 'Pets and animals', 'Cat person', 'Funny', ['billi', 'khush']),

  /* Startup and hustle */
  e('Shipping imperfect things on purpose.', 'Startup and hustle', 'Product', 'Practical', ['shipping', 'startup']),
  e('First-time founder. Second-time listener.', 'Startup and hustle', 'Founder', 'Witty', ['founder', 'learning']),
  e('Revenue solves arguments better than meetings.', 'Startup and hustle', 'Business', 'Direct', ['revenue', 'business']),
  h('मेहनत करो, बहाने बाद में बनाएंगे।', 'Startup and hustle', 'मेहनत', 'दृढ़', ['मेहनत', 'बहाने']),
  h('सपना छोटा न हो, कदम भी बड़े हों।', 'Startup and hustle', 'सपना', 'प्रेरक', ['सपना', 'कदम']),
  g('Mehnat karo, bahane baad mein banayenge.', 'Startup and hustle', 'Hustle', 'Direct', ['mehnat', 'bahane']),

  /* Science and curiosity */
  e('Asking why until someone shows me the data.', 'Science and curiosity', 'Curiosity', 'Curious', ['science', 'data']),
  e('Explains things badly until the diagram comes out.', 'Science and curiosity', 'Teaching', 'Playful', ['science', 'diagrams']),
  e('Stars make my problems feel correctly sized.', 'Science and curiosity', 'Astronomy', 'Reflective', ['stars', 'perspective']),
  h('सवाल पूछना सबसे बड़ी सीख है।', 'Science and curiosity', 'जिज्ञासा', 'सहज', ['सवाल', 'सीख']),
  h('विज्ञान वही जो समझ आए, न कि रटा जाए।', 'Science and curiosity', 'विज्ञान', 'गंभीर', ['विज्ञान', 'समझ']),
  g('Sawaal poochhna sabse badi seekh hai.', 'Science and curiosity', 'Curiosity', 'Curious', ['sawaal', 'seekh']),

  /* Cinema and OTT */
  e('Watch credits. Judge nobody.', 'Cinema and OTT', 'Film buff', 'Quiet', ['cinema', 'respect']),
  e('Re-watching comfort shows instead of therapy.', 'Cinema and OTT', 'Comfort', 'Funny', ['shows', 'comfort']),
  e('Subtitles on, always.', 'Cinema and OTT', 'Film buff', 'Terse', ['subtitles', 'cinema']),
  h('फिल्में देखकर सीखता हूँ, जीना अलग बात है।', 'Cinema and OTT', 'सिनेमा', 'सहज', ['सिनेमा', 'सीख']),
  h('सबटाइटल वाले सीन सबसे समझ में आते हैं।', 'Cinema and OTT', 'फिल्में', 'मज़ाकिया', ['सबटाइटल', 'फिल्म']),
  g('Comfort show chal raha hai, therapy baad mein.', 'Cinema and OTT', 'Comfort', 'Funny', ['show', 'therapy']),

  /* Cricket and sports */
  e('Played gully cricket like it was a World Cup.', 'Cricket and sports', 'Nostalgia', 'Warm', ['cricket', 'childhood']),
  e('Left-handed, wrong-footed, fully committed.', 'Cricket and sports', 'Sport', 'Playful', ['sport', 'leftie']),
  e('Training for a match nobody scheduled.', 'Cricket and sports', 'Practice', 'Witty', ['training', 'sport']),
  h('गली क्रिकेट में सचिन, मैदान में आम इंसान।', 'Cricket and sports', 'खेल', 'मज़ाकिया', ['क्रिकेट', 'गली']),
  h('हार से सीखा, जीत से नहीं।', 'Cricket and sports', 'खेल भावना', 'गंभीर', ['हार', 'सीख']),
  g('Gully cricket ka Sachin tha, ground pe aam insaan hoon.', 'Cricket and sports', 'Nostalgia', 'Funny', ['cricket', 'gully']),

  /* Cars and bikes */
  e('Four wheels for work, two for the soul.', 'Cars and bikes', 'Riding', 'Warm', ['bike', 'work']),
  e('Rides slow. Thinks fast.', 'Cars and bikes', 'Riding', 'Composed', ['riding', 'thought']),
  e('Cleans the bike more than the house.', 'Cars and bikes', 'Ownership', 'Funny', ['bike', 'humour']),
  h('बाइक साफ़, दिल साफ़, बाकी सब ठीक।', 'Cars and bikes', 'बाइक', 'सहज', ['बाइक', 'दिल']),
  h('सफ़र लंबा हो तो इंजन अच्छा रखो।', 'Cars and bikes', 'सफ़र', 'सहज', ['सफ़र', 'इंजन']),
  g('Bike saaf, dil saaf, baaki sab theek.', 'Cars and bikes', 'Riding', 'Witty', ['bike', 'dil']),

  /* Home and interiors */
  e('Small flat, excellent light.', 'Home and interiors', 'Interiors', 'Warm', ['home', 'light']),
  e('Plants thriving. Me, mostly.', 'Home and interiors', 'Home life', 'Funny', ['plants', 'home']),
  e('Books stacked where the tv should be.', 'Home and interiors', 'Interiors', 'Quiet', ['books', 'home']),
  h('घर छोटा है, पर दिल बड़ा।', 'Home and interiors', 'घर', 'स्नेही', ['घर', 'दिल']),
  h('पौधे बढ़ रहे हैं, यही सबसे बड़ी खुशी।', 'Home and interiors', 'घर', 'शांत', ['पौधे', 'खुशी']),
  g('Ghar chhota hai, par dil bada.', 'Home and interiors', 'Home', 'Warm', ['ghar', 'dil']),

  /* Parenting */
  e('Raising a small human and my own patience.', 'Parenting', 'Parenting', 'Honest', ['parenting', 'patience']),
  e('Sleep schedule: negotiated hourly.', 'Parenting', 'Relatable', 'Funny', ['sleep', 'parenting']),
  e('Learning from someone who cannot yet talk.', 'Parenting', 'Insight', 'Tender', ['parenting', 'learning']),
  h('बच्चे बड़े होते हैं, मां-बाप बड़े होते हैं — दोनों साथ।', 'Parenting', 'पालन-पोषण', 'स्नेही', ['बच्चे', 'मां']),
  h('छोटे हाथ, बड़ी खुशी।', 'Parenting', 'परिवार', 'स्नेही', ['बच्चे', 'खुशी']),
  g('Chhote haath, badi khushi. Bas itna hi.', 'Parenting', 'Parenting', 'Tender', ['haath', 'khushi']),

  /* Wedding and celebration */
  e('Planner by temperament, guest by choice.', 'Wedding and celebration', 'Celebration', 'Witty', ['wedding', 'planning']),
  e('Weddings taught me the value of comfortable shoes.', 'Wedding and celebration', 'Relatable', 'Funny', ['wedding', 'shoes']),
  h('शादी में खाना, ढोल और फोटो — तीनों ज़रूरी।', 'Wedding and celebration', 'शादी', 'सहज', ['शादी', 'खाना']),
  h('खुशियां बांटो, बहाने नहीं।', 'Wedding and celebration', 'उत्सव', 'स्नेही', ['खुशियां', 'उत्सव']),
  g('Shaadi mein khana, dhol aur photos — teeno zaroori.', 'Wedding and celebration', 'Celebration', 'Playful', ['shaadi', 'khana']),

  /* Monsoon and seasons */
  e('Monsoon person. Sunscreen is a suggestion.', 'Monsoon and seasons', 'Weather', 'Playful', ['monsoon', 'weather']),
  e('Rain is a valid reason to cancel everything.', 'Monsoon and seasons', 'Relatable', 'Funny', ['rain', 'plans']),
  h('बारिश में चाय और पकौड़े — यही पूरा प्लान है।', 'Monsoon and seasons', 'बारिश', 'सहज', ['बारिश', 'चाय']),
  h('सर्दियों की धूप सबसे अच्छी दोस्त है।', 'Monsoon and seasons', 'मौसम', 'स्नेही', ['सर्दी', 'धूप']),
  g('Barsaat mein chai aur pakode — pura plan yahi hai.', 'Monsoon and seasons', 'Weather', 'Warm', ['barsaat', 'chai']),

  /* Deep and emotional */
  e('I feel things three days late and one size too large.', 'Deep and emotional', 'Sensitivity', 'Honest', ['feelings', 'honesty']),
  e('Some people are houses. You only notice when they are empty.', 'Deep and emotional', 'Loss', 'Heavy', ['loss', 'people']),
  e('I keep the heavy things quietly.', 'Deep and emotional', 'Restraint', 'Quiet', ['emotion', 'silence']),
  h('कुछ लोग घर जैसे होते हैं — खाली होकर पता चलता है।', 'Deep and emotional', 'भावना', 'भावुक', ['भावना', 'घर']),
  h('अंदर की बातें अपने आप सुलझ जाती हैं, कभी-कभी।', 'Deep and emotional', 'अंतर्मन', 'शांत', ['अंदर', 'शांत']),
  g('Kuch log ghar jaise hote hain — khaali hokar pata chalta hai.', 'Deep and emotional', 'Loss', 'Heavy', ['ghar', 'log']),

  /* Savage and bold */
  e('I am polite, not forgetful.', 'Savage and bold', 'Warning', 'Sharp', ['polite', 'warning']),
  e('Your opinion was not on the ballot.', 'Savage and bold', 'Boundaries', 'Savage', ['opinion', 'boundaries']),
  e('I outgrew that. You should try it.', 'Savage and bold', 'Growth', 'Savage', ['growth', 'savage']),
  h('मैं शरीफ हूँ, बेवकूफ नहीं।', 'Savage and bold', 'चेतावनी', 'तीखा', ['शरीफ', 'चेतावनी']),
  h('तुम्हारी राय का मैंने कभी इंतज़ार नहीं किया।', 'Savage and bold', 'सीमाएं', 'तीखा', ['राय', 'सीमा']),
  g('Main shareef hoon, bewakoof nahi.', 'Savage and bold', 'Warning', 'Sharp', ['shareef', 'warning']),

  /* Instagram profiles */
  e('Photos, thoughts and occasional bad decisions.', 'Instagram profiles', 'Personal', 'Playful', ['photos', 'life']),
  e('Curating a life I will explain later.', 'Instagram profiles', 'Personal', 'Witty', ['curation', 'life']),
  e('Post rarely, mean it every time.', 'Instagram profiles', 'Personal', 'Terse', ['posting', 'honest']),
  h('कभी फोटो, कभी सोच, बस अपनी दुनिया।', 'Instagram profiles', 'निजी', 'सहज', ['फोटो', 'दुनिया']),
  h('कम पोस्ट, पर दिल से।', 'Instagram profiles', 'निजी', 'सहज', ['पोस्ट', 'दिल']),
  g('Kam post karta hoon, par dil se.', 'Instagram profiles', 'Personal', 'Honest', ['post', 'dil']),

  /* Nature */
  e('Happiest near trees and far from notifications.', 'Nature', 'Nature', 'Calm', ['trees', 'quiet']),
  e('Mountains fix what cities break.', 'Nature', 'Mountains', 'Reflective', ['mountains', 'restore']),
  e('Walks outside, worries smaller.', 'Nature', 'Walks', 'Calm', ['walks', 'perspective']),
  h('पेड़ों के पास, नोटिफिकेशन से दूर।', 'Nature', 'प्रकृति', 'शांत', ['पेड़', 'शांति']),
  h('पहाड़ जो टूटा, उसे जोड़ देते हैं।', 'Nature', 'पहाड़', 'भावुक', ['पहाड़', 'सुकून']),
  g('Pedon ke paas, notification se door. Bas.', 'Nature', 'Nature', 'Calm', ['ped', 'shanti']),

  /* Poetry */
  e('Wrote a poem. Deleted it. Wrote it again.', 'Poetry', 'Process', 'Honest', ['poetry', 'process']),
  e('Rhyme is just honesty with better timing.', 'Poetry', 'Craft', 'Wise', ['poetry', 'craft']),
  e('My notes app is 90% half poems.', 'Poetry', 'Process', 'Funny', ['poetry', 'notes']),
  h('कविता वही जो चुप्पी को आवाज़ दे।', 'Poetry', 'काव्य', 'गंभीर', ['कविता', 'आवाज़']),
  h('अधूरी कविताएं भी पूरी बात कह जाती हैं।', 'Poetry', 'काव्य', 'भावुक', ['कविता', 'बात']),
  g('Adhuri kavitayein bhi poori baat keh jaati hain.', 'Poetry', 'Craft', 'Reflective', ['kavita', 'baat']),

  /* Funny and comedy */
  e('Professional overthinker. Amateur everything else.', 'Funny and comedy', 'Self-deprecating', 'Funny', ['humour', 'honest']),
  e('My hobbies include starting hobbies.', 'Funny and comedy', 'Relatable', 'Funny', ['hobbies', 'humour']),
  e('Sleep is my cardio.', 'Funny and comedy', 'Relatable', 'Funny', ['sleep', 'fitness']),
  h('सुबह की अलार्म और मेरी दोस्ती नहीं है।', 'Funny and comedy', 'मज़ाक', 'मज़ाकिया', ['अलार्म', 'सुबह']),
  h('मैं कोशिश करता हूँ, बस नींद नहीं मानती।', 'Funny and comedy', 'मज़ाक', 'मज़ाकिया', ['कोशिश', 'नींद']),
  g('Subah ki alarm aur meri dosti nahi hai.', 'Funny and comedy', 'Relatable', 'Funny', ['alarm', 'subah']),
];
