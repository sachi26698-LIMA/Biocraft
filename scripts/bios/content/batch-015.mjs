/**
 * BioCraft original bios — batch 015.
 * Depth phase continued: leaders first, thin categories topped up.
 */
const S = 'biocraft-original';
const e = (text, category, subcategory, tone, tags) => ({ text, lang: 'en', category, subcategory, tone, tags, sourceId: S });
const h = (text, category, subcategory, tone, tags) => ({ text, lang: 'hi', category, subcategory, tone, tags, sourceId: S });
const g = (text, category, subcategory, tone, tags) => ({ text, lang: 'hg', category, subcategory, tone, tags, sourceId: S });

export const BATCH_015 = [
  /* -------------------------------------------------------------- Attitude */
  e('Some fights are won by not showing up.', 'Attitude', 'Restraint', 'Cool', ['attitude', 'restraint']),
  e('I am interested in the truth, not the verdict.', 'Attitude', 'Honesty', 'Direct', ['attitude', 'truth']),
  e('You do not get access just because you stayed long enough.', 'Attitude', 'Boundaries', 'Sharp', ['attitude', 'boundaries']),
  e('Polite does not mean available.', 'Attitude', 'Boundaries', 'Terse', ['attitude', 'polite']),
  e('I keep my promises and my distance, both deliberately.', 'Attitude', 'Integrity', 'Composed', ['attitude', 'integrity']),
  e('Argue with my work. Leave my character out of it.', 'Attitude', 'Standards', 'Firm', ['attitude', 'work']),
  e('I outgrew the need to be liked by everyone. Quietly.', 'Attitude', 'Growth', 'Honest', ['attitude', 'growth']),
  e('Never confuse my calm for consent.', 'Attitude', 'Restraint', 'Sharp', ['attitude', 'calm']),
  h('कुछ लड़ाइयाँ न लड़कर ही जीत जाते हैं।', 'Attitude', 'संयम', 'शांत', ['लड़ाई', 'संयम']),
  h('मुझे फ़ैसला नहीं, सच चाहिए।', 'Attitude', 'स्पष्टता', 'स्पष्ट', ['फ़ैसला', 'सच']),
  h('ज़्यादा दिन साथ रहना अधिकार नहीं देता।', 'Attitude', 'सीमाएं', 'तीखा', ['साथ', 'अधिकार']),
  h('शांत होना मंज़ूरी देना नहीं है।', 'Attitude', 'संयम', 'तीखा', ['शांत', 'मंज़ूरी']),
  h('मेरे काम से बहस करो, किरदार से नहीं।', 'Attitude', 'मानक', 'दृढ़', ['काम', 'किरदार']),
  g('Kuch ladaaiyan na ladkar hi jeet jaate hain.', 'Attitude', 'Restraint', 'Cool', ['ladaaiyan', 'jeet']),
  g('Mujhe faisla nahi, sach chahiye.', 'Attitude', 'Honesty', 'Direct', ['faisla', 'sach']),
  g('Zyada din saath rehna adhikaar nahi deta.', 'Attitude', 'Boundaries', 'Sharp', ['saath', 'adhikaar']),
  g('Shaant hona manzoori dena nahi hai.', 'Attitude', 'Restraint', 'Sharp', ['shaant', 'manzoori']),
  g('Mere kaam se bahas karo, kirdaar se nahi.', 'Attitude', 'Standards', 'Firm', ['kaam', 'kirdaar']),

  /* ------------------------------------------------------ Love and romance */
  e('I want to grow old arguing about the thermostat with you.', 'Love and romance', 'Everyday', 'Warm', ['love', 'future']),
  e('You are the only person I do not mind repeating myself to.', 'Love and romance', 'Patience', 'Tender', ['love', 'patience']),
  e('Love is mostly the choice to keep paying attention.', 'Love and romance', 'Devotion', 'Wise', ['love', 'attention']),
  e('I am better at loving you than at saying it.', 'Love and romance', 'Honesty', 'Sweet', ['love', 'actions']),
  e('Our silence is comfortable. That is how I knew.', 'Love and romance', 'Closeness', 'Tender', ['love', 'silence']),
  e('You are my favourite person to do nothing with.', 'Love and romance', 'Everyday', 'Warm', ['love', 'nothing']),
  h('तुम्हारे साथ बुढ़ापे में भी झगड़ना है, बस तुमसे।', 'Love and romance', 'भविष्य', 'कोमल', ['बुढ़ापा', 'साथ']),
  h('प्यार ज़्यादातर ध्यान देने का फ़ैसला है।', 'Love and romance', 'निभाना', 'गंभीर', ['प्यार', 'ध्यान']),
  h('तेरे साथ चुप्पी भी आराम देती है।', 'Love and romance', 'नज़दीकी', 'कोमल', ['चुप्पी', 'आराम']),
  g('Tumhare saath budhape mein bhi ladhna hai, bas tumse.', 'Love and romance', 'Everyday', 'Warm', ['budhape', 'ladhna']),
  g('Pyaar zyadatar dhyan dene ka faisla hai.', 'Love and romance', 'Devotion', 'Wise', ['pyaar', 'dhyan']),
  g('Tere saath chuppi bhi aaraam deti hai.', 'Love and romance', 'Closeness', 'Tender', ['chuppi', 'aaraam']),

  /* --------------------------------------------------- Sad and heartbreak */
  e('I am not over it. I am just better at carrying it.', 'Sad and heartbreak', 'Recovery', 'Honest', ['sad', 'carrying']),
  e('Some songs are a whole year in three minutes.', 'Sad and heartbreak', 'Memory', 'Aching', ['sad', 'music']),
  e('You were the plan. The plan changed. I did not.', 'Sad and heartbreak', 'Loss', 'Raw', ['sad', 'loss']),
  e('I still set two cups out of habit. Then I put one back.', 'Sad and heartbreak', 'Absence', 'Aching', ['sad', 'habit']),
  h('मैं भूला नहीं हूँ, बस उठाना सीख गया हूँ।', 'Sad and heartbreak', 'उबरना', 'गंभीर', ['भूला', 'उठाना']),
  h('कुछ गाने तीन मिनट में पूरा एक साल बता देते हैं।', 'Sad and heartbreak', 'याद', 'भावुक', ['गाने', 'साल']),
  h('दो कप निकालता हूँ, फिर एक वापस रख देता हूँ।', 'Sad and heartbreak', 'गैरहाज़िरी', 'भावुक', ['कप', 'आदत']),
  g('Main bhoola nahi hoon, bas uthana seekh gaya hoon.', 'Sad and heartbreak', 'Recovery', 'Honest', ['bhoola', 'uthana']),
  g('Do cup nikaalta hoon, phir ek wapas rakh deta hoon.', 'Sad and heartbreak', 'Absence', 'Aching', ['cup', 'wapas']),

  /* ------------------------------------------------------ Shayari depth */
  h('मैं तेरे बिना भी मुस्कुरा लेता हूँ,\nपर हँसी कहीं और रह जाती है।', 'Shayari', 'दो पंक्ति', 'भावुक', ['मुस्कुराना', 'हँसी']),
  h('दोस्ती की एक खासियत है,\nवो लड़कर भी साथ खड़ी रहती है।', 'Shayari', 'दो पंक्ति', 'सहज', ['दोस्ती', 'साथ']),
  h('मैं शिकायत नहीं करता,\nपर मुझे याद है किसने निभाया और किसने नहीं।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['शिकायत', 'निभाया']),
  h('अगर आना हो, बता देना,\nमैं दरवाज़ा खुला रखता हूँ।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['दरवाज़ा', 'आना']),
  h('बारिश में भीगने का बहाना चाहिए था,\nऔर तुम्हारा साथ भी।', 'Shayari', 'दो पंक्ति', 'रोमांटिक', ['बारिश', 'साथ']),
  h('ज़िंदगी ने वक़्त दिया,\nमैंने उसे काम में लगा दिया, कभी खुद पर नहीं।', 'Shayari', 'दो पंक्ति', 'गंभीर', ['ज़िंदगी', 'वक़्त']),
  g('Main tere bina bhi muskura leta hoon, par hansi kahin aur reh jaati hai.', 'Shayari', 'Two line', 'Aching', ['muskura', 'hansi']),
  g('Dosti ki ek khaasiyat hai, woh ladkar bhi saath khadi rehti hai.', 'Shayari', 'Two line', 'Warm', ['dosti', 'saath']),
  g('Agar aana ho, bata dena, main darwaaza khula rakhta hoon.', 'Shayari', 'Two line', 'Romantic', ['darwaaza', 'aana']),
  g('Baarish mein bhigone ka bahaana chahiye tha, aur tumhara saath bhi.', 'Shayari', 'Two line', 'Romantic', ['baarish', 'saath']),

  /* ------------------------------------------------------ Life and reality */
  e('Choose the life you can sustain, then make it good.', 'Life and reality', 'Sustain', 'Wise', ['life', 'sustainability']),
  e('Nobody is thinking about your mistake as much as you are.', 'Life and reality', 'Perspective', 'Honest', ['life', 'perspective']),
  e('You will not find the answer in the comments.', 'Life and reality', 'Agency', 'Direct', ['life', 'agency']),
  h('वो ज़िंदगी चुनो जो चल सके, फिर उसे अच्छा बनाओ।', 'Life and reality', 'ज़िम्मेदारी', 'गंभीर', ['ज़िंदगी', 'चुनो']),
  h('तुम्हारी गलती किसी को इतनी याद नहीं जितनी तुम्हें।', 'Life and reality', 'तसल्ली', 'सहज', ['गलती', 'याद']),
  g('Woh zindagi chuno jo chal sake, phir use accha banao.', 'Life and reality', 'Sustain', 'Wise', ['zindagi', 'chuno']),
  g('Tumhari galti kisi ko itni yaad nahi jitni tumhein.', 'Life and reality', 'Perspective', 'Honest', ['galti', 'yaad']),

  /* ------------------------------------------------- Quotes and thoughts */
  e('Being understood is nice. Being consistent is better.', 'Quotes and thoughts', 'Consistency', 'Wise', ['quotes', 'consistency']),
  e('If your plan needs perfect weather, it is not a plan.', 'Quotes and thoughts', 'Realism', 'Sharp', ['quotes', 'realism']),
  e('Good questions age better than good answers.', 'Quotes and thoughts', 'Curiosity', 'Wise', ['quotes', 'questions']),
  h('समझा जाना अच्छा है, पर पुराने लगना बेहतर है।', 'Quotes and thoughts', 'निरंतरता', 'गंभीर', ['समझना', 'निरंतरता']),
  h('अच्छे सवाल जवाब से ज़्यादा टिकते हैं।', 'Quotes and thoughts', 'जिज्ञासा', 'गंभीर', ['सवाल', 'जवाब']),
  g('Achhe sawaal jawab se zyada tikte hain.', 'Quotes and thoughts', 'Curiosity', 'Wise', ['sawaal', 'tikte']),
  g('Samjha jaana accha hai, par purane lagne se behtar hai.', 'Quotes and thoughts', 'Consistency', 'Wise', ['samjha', 'purane']),

  /* ------------------------------------------------------------- Aesthetic */
  e('Coffee, a window and nothing scheduled.', 'Aesthetic', 'Slow living', 'Calm', ['aesthetic', 'coffee']),
  e('I like the sound of a room where nobody is performing.', 'Aesthetic', 'Interiors', 'Calm', ['aesthetic', 'quiet']),
  e('Worn wood is better evidence than a straight edge.', 'Aesthetic', 'Texture', 'Wise', ['aesthetic', 'wood']),
  h('कॉफ़ी, खिड़की और कोई कार्यक्रम नहीं।', 'Aesthetic', 'सुबह', 'शांत', ['कॉफ़ी', 'खिड़की']),
  h('पुरानी लकड़ी नई से ज़्यादा बताती है।', 'Aesthetic', 'बनावट', 'सहज', ['लकड़ी', 'बनावट']),
  g('Coffee, khidki aur koi karyakram nahi. Bas.', 'Aesthetic', 'Slow living', 'Calm', ['coffee', 'khidki']),
  g('Puraani lakdi nai se zyada batati hai.', 'Aesthetic', 'Texture', 'Wise', ['lakdi', 'batati']),

  /* --------------------------------------------------------- Thin top-ups */
  e('Morning light and one good sentence. That is a full morning.', 'Poetry', 'Process', 'Calm', ['poetry', 'morning']),
  e('Kept the notebook. Lost the pen. Wrote anyway.', 'Poetry', 'Process', 'Wry', ['poetry', 'notebook']),
  e('Every market is a story about someone being brave.', 'Startup and hustle', 'Builder', 'Wise', ['startup', 'bravery']),
  e('Small wins compound harder than big plans.', 'Professional and business', 'Execution', 'Practical', ['business', 'wins']),
  e('A film you love is a friend you can replay.', 'Cinema and OTT', 'Film lover', 'Warm', ['cinema', 'comfort']),
  e('The best days are unphotographed and well remembered.', 'Nature', 'Observation', 'Wise', ['nature', 'memory']),
  h('सुबह की रोशनी और एक अच्छा वाक्य, बस इतनी सुबह।', 'Poetry', 'रचना', 'शांत', ['सुबह', 'वाक्य']),
  h('छोटी जीत बड़े इरादों से ज़्यादा असर करती है।', 'Professional and business', 'काम', 'व्यावहारिक', ['जीत', 'इरादे']),
  h('सबसे अच्छे दिन तस्वीरों से बाहर रह जाते हैं।', 'Nature', 'सीख', 'सहज', ['दिन', 'तस्वीरें']),
  g('Subah ki roshni aur ek accha vakya, bas itni subah.', 'Poetry', 'Process', 'Calm', ['roshni', 'vakya']),
  g('Chhoti jeet bade iraadon se zyada asar karti hai.', 'Professional and business', 'Execution', 'Practical', ['jeet', 'iraadon']),
  g('Sabse achhe din tasveeron se bahar reh jaate hain.', 'Nature', 'Observation', 'Wise', ['tasveeron', 'din']),
  g('Har film jo pasand hai, woh ek yaar jaisi hoti hai.', 'Cinema and OTT', 'Film lover', 'Warm', ['film', 'yaar']),
];
