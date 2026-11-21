/* Website helper. It answers from the information on this page (no outside service needed).
   EDIT HERE: change the answers in KB below if your details change. */
(function(){
var $=function(i){return document.getElementById(i)};
var box=$("cb"),msgs=$("cbmsgs"),inp=$("cbin"),launch=$("cbl"),started=false,last="";
$("cbav").src=document.querySelector(".brand img").src;
function pick(o,lg){return (lg||L)=="hi"?o[1]:o[0]}
var UI={ll:["Chat with us","हमसे बात करें"],t:["Sugatta Care Helper","सुगत्ता केयर सहायक"],s:["Ask about giving, camps or volunteering","दान, शिविर या स्वयंसेवा के बारे में पूछें"],ph:["Type your question…","अपना सवाल लिखें…"],send:["Send","भेजें"],x:["Close chat","चैट बंद करें"]};
window.cbUI=function(){$("cbll").textContent=pick(UI.ll);$("cbt").textContent=pick(UI.t);$("cbs").textContent=pick(UI.s);inp.placeholder=pick(UI.ph);$("cbsend").textContent=pick(UI.send);$("cbx").setAttribute("aria-label",pick(UI.x));box.setAttribute("aria-label",pick(UI.t))};
function sm(){return matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"}
function openBox(o){box.classList.toggle("open",o);launch.setAttribute("aria-expanded",o);
if(o){if(!started){started=true;menu(L,true)}if(!matchMedia("(pointer:coarse)").matches)setTimeout(function(){inp.focus()},60)}}
launch.onclick=function(){openBox(!box.classList.contains("open"))};
$("cbx").onclick=function(){openBox(false);launch.focus()};
box.onkeydown=function(e){if(e.key=="Escape"){openBox(false);launch.focus()}};
function add(t,c){var d=document.createElement("div");d.className="m "+c;d.textContent=t;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
function clearChips(){[].forEach.call(msgs.querySelectorAll(".chips"),function(c){c.remove()})}
function chips(list,lg){clearChips();var w=document.createElement("div");w.className="chips";
list.forEach(function(c){var b=document.createElement("button");b.className="chip";b.type="button";b.textContent=pick(c.l,lg);b.onclick=function(){c.f(lg||L)};w.appendChild(b)});
msgs.appendChild(w);msgs.scrollTop=msgs.scrollHeight}
function say(t,list,lg){clearChips();var d=add("…","b typing");
setTimeout(function(){d.className="m b";d.textContent=t;if(list)chips(list,lg);msgs.scrollTop=msgs.scrollHeight},350)}
/* actions */
function go(id){return function(){openBox(false);var e=$(id);if(e)e.scrollIntoView({behavior:sm()})}}
function ask(role,en,hi){return function(lg){openBox(false);toContact(role,en,hi,lg)}}
function wa(context){openBox(false);var text="Hello Sugatta Care, I would like to speak with your team.";if(context||last)text+="\n\nI was using the website helper."+(context?"\nTopic: "+context:"")+ (last?"\nMy question: "+last:"");window.open("https://wa.me/"+WHATSAPP+"?text="+encodeURIComponent(text),"_blank","noopener")}
function R(k){return ROLEMSG[k]}
var CP={l:["WhatsApp","व्हाट्सऐप"],f:function(){wa("Website support")}};
var KB=[
{id:"greet",re:/^\s*(hi+|hello+|hey+|namaste|namaskar|नमस्ते|नमस्कार|हेलो|हैलो)[\s!.,।]*$/,
 a:["Namaste! I am the Sugatta Care helper. I can answer questions about giving, tax receipts, volunteering and health camps. What would you like to know?","नमस्ते! मैं सुगत्ता केयर का सहायक हूँ। मैं दान, टैक्स रसीद, स्वयंसेवा और स्वास्थ्य शिविर के बारे में आपके सवालों के जवाब दे सकता हूँ। आप क्या जानना चाहेंगे?"],c:[]},
{id:"thanks",re:/thank|thanks|shukriya|dhanyavaad|धन्यवाद|शुक्रिया/,
 a:["You are most welcome. If you have any other question, I am here to help.","आपका स्वागत है। कोई और सवाल हो तो मैं यहाँ हूँ।"],c:[]},
{id:"monthly",re:/monthly|every month|per month|a month|recurring|हर महीने|महीने|मासिक/,
 a:["A small gift each month helps us plan better and reach more families. You can pick ₹300, ₹500 or ₹1,000 a month, or any amount you like.","हर महीने का छोटा-सा दान हमें बेहतर योजना बनाने और ज़्यादा परिवारों तक पहुँचने में मदद करता है। आप हर महीने ₹300, ₹500 या ₹1,000 चुन सकते हैं, या अपनी मर्ज़ी की कोई भी राशि।"],
 c:[{l:["Choose a monthly amount","हर महीने की राशि चुनें"],f:go("monthly")}]},
{id:"tax",re:/tax|80g|12ab|receipt|deduct|\bpan\b|रसीद|टैक्स|कर छूट/,
 a:["Yes. We are registered under Section 12AB and have 80G approval, so eligible donors can get an official tax receipt. After you give, write to us with your name, PAN and proof of payment.","हाँ। हम धारा 12AB के तहत पंजीकृत हैं और हमारे पास 80G की मंज़ूरी है, इसलिए पात्र दानदाताओं को आधिकारिक टैक्स रसीद मिल सकती है। दान के बाद अपना नाम, PAN और भुगतान का सबूत हमें लिखें।"],
 c:[{l:["Ask for my receipt","मेरी रसीद माँगें"],f:ask("Donate","I have donated and would like an 80G receipt. Name: \nPAN: \nPayment proof (date and reference): ","मैंने दान दिया है और मुझे 80G रसीद चाहिए। नाम: \nPAN: \nभुगतान का सबूत (तारीख़ और संदर्भ): ")}]},
{id:"money",re:/where.*(money|fund|donation)|(money|fund|donation).*(go|use|spent)|rupee|profit|paisa kahan|पैसा कहाँ|पैसा कहां|कहाँ जाता|कहां जाता|मुनाफ़|मुनाफा/,
 a:["All of it goes to our charity work: health camps, care for elders, learning for children and village projects. We are a Section 8 company, so no one can take profit.","सारा पैसा हमारे सेवा कार्यों में जाता है: स्वास्थ्य शिविर, बुज़ुर्गों की देखभाल, बच्चों की पढ़ाई और गाँव के काम। हम धारा 8 की कंपनी हैं, इसलिए कोई मुनाफ़ा नहीं ले सकता।"],c:[]},
{id:"safe",re:/fraud|scam|fake|genuine|otp|safe|सुरक्षित|धोखा|नकली|असली/,
 a:["To protect you from fraud, please confirm our bank or UPI details with us by email before you send money. We never ask for your bank password or OTP.","धोखाधड़ी से बचने के लिए पैसा भेजने से पहले हमारे बैंक या UPI विवरण हमसे ईमेल पर पक्का कर लें। हम आपका बैंक पासवर्ड या OTP कभी नहीं माँगते।"],
 c:[{l:["Ask for official details","आधिकारिक विवरण माँगें"],f:ask("Donate",R("Donate")[0],R("Donate")[1])}]},
{id:"proof",re:/certificate|proof|audit|document|pdf|प्रमाण|सबूत|दस्तावेज़|दस्तावेज/,
 a:["You can ask for copies of our Section 8, 12AB and 80G certificates and our audited accounts. Just write to us.","आप हमारे धारा 8, 12AB और 80G प्रमाणपत्रों और जाँचे हुए खातों की कॉपी माँग सकते हैं। बस हमें लिखें।"],
 c:[{l:["Ask for documents","दस्तावेज़ माँगें"],f:ask("Ask a question","Please send me a copy of: ","कृपया मुझे इसकी कॉपी भेजें: ")}]},
{id:"volunteer",re:/volunteer|volunteering|seva|स्वयंसेवक|वालंटियर|सेवा/,
 a:["Yes, please! Doctors, nurses, teachers and anyone with a kind heart are welcome. You do not need to be an expert.","जी हाँ! डॉक्टर, नर्स, शिक्षक और हर नेक दिल इंसान का स्वागत है। आपको विशेषज्ञ होने की ज़रूरत नहीं।"],
 c:[{l:["I want to volunteer","मैं स्वयंसेवक बनना चाहता/चाहती हूँ"],f:ask("Volunteer",R("Volunteer")[0],R("Volunteer")[1])}]},
{id:"role",re:/advisor|adviser|member|membership|सलाहकार|सदस्य/,
 a:["You can join as an advisor (teachers, doctors, social workers and legal experts who guide our camps) or as a member (regular updates, event invitations and chances to volunteer).","आप सलाहकार (शिक्षक, डॉक्टर, समाजसेवी और क़ानूनी विशेषज्ञ जो हमारे शिविरों में मार्गदर्शन करते हैं) या सदस्य (नियमित जानकारी, कार्यक्रमों के निमंत्रण और स्वयंसेवा के मौके) के रूप में जुड़ सकते हैं।"],
 c:[{l:["Apply as advisor","सलाहकार बनें"],f:ask("Advisor",R("Advisor")[0],R("Advisor")[1])},{l:["Become a member","सदस्य बनें"],f:ask("Member",R("Member")[0],R("Member")[1])}]},
{id:"camp",re:/camp|checkup|check-up|health check|शिविर|कैंप|जाँच|जांच/,
 a:["New camp dates are coming soon. If you would like a free health camp in your village, tell us the place and we will try to come.","नए शिविर की तारीख़ें जल्द आएँगी। अगर आप अपने गाँव में मुफ़्त स्वास्थ्य शिविर चाहते हैं, तो जगह बताइए, हम आने की कोशिश करेंगे।"],
 c:[{l:["Request a camp","शिविर का अनुरोध करें"],f:ask("Ask a question","I would like to request a free health camp in my village. Place: ","मैं अपने गाँव में मुफ़्त स्वास्थ्य शिविर का अनुरोध करना चाहता/चाहती हूँ। जगह: ")}]},
{id:"things",re:/clothes|medicine|medicines|\bkits?\b|blanket|books|सामान|कपड़े|किताब|दवा|दवाई|कंबल/,
 a:["Clothes, books and health kits are welcome. Please talk to us before sending medicines. We only give medicines under a qualified doctor.","कपड़े, किताबें और हेल्थ किट का स्वागत है। दवाएँ भेजने से पहले हमसे बात करें। हम दवाएँ सिर्फ़ योग्य डॉक्टर की देखरेख में देते हैं।"],
 c:[{l:["Ask about giving things","सामान देने के बारे में पूछें"],f:ask("Donate","I would like to give these things: ","मैं ये चीज़ें देना चाहता/चाहती हूँ: ")}]},
{id:"privacy",re:/privacy|photo|picture|personal|\bdata\b|गोपनीय|तस्वीर|फोटो|जानकारी/,
 a:["We use your name and phone or email only to reply to you. We do not sell or share them. We share a photo only with the person’s permission. To remove a photo or your details, write to us.","हम आपका नाम और फ़ोन या ईमेल सिर्फ़ आपको जवाब देने के लिए इस्तेमाल करते हैं। हम इन्हें बेचते या बाँटते नहीं। हम किसी की तस्वीर उसकी अनुमति से ही लगाते हैं। तस्वीर या अपनी जानकारी हटवाने के लिए हमें लिखें।"],c:[]},
{id:"donate",re:/donat|give|giving|contribut|\bpay|upi|bank|account|transfer|\bqr\b|दान|दे(ना|ने)|यूपीआई|बैंक|खाता|daan/,
 a:["Thank you for wanting to give. You can donate by bank transfer or UPI, or give things like clothes, books and health kits. For your safety, we share our official bank and UPI details when you ask. Please confirm the details with us before you send any money.","दान देने की इच्छा के लिए धन्यवाद। आप बैंक ट्रांसफ़र या UPI से दान कर सकते हैं, या कपड़े, किताबें और हेल्थ किट जैसी चीज़ें दे सकते हैं। आपकी सुरक्षा के लिए हम अपनी आधिकारिक बैंक और UPI जानकारी आपके माँगने पर भेजते हैं। पैसा भेजने से पहले विवरण हमसे पक्का कर लें।"],
 c:[{l:["Ask for bank / UPI details","बैंक / UPI विवरण माँगें"],f:ask("Donate",R("Donate")[0],R("Donate")[1])},{l:["Give every month","हर महीने दान करें"],f:go("monthly")}]},
{id:"about",re:/about|who are you|who we|what do you do|what you do|registered|section 8|\bcin\b|legal|\bngo\b|mission|vision|हमारे बारे|कौन|क्या करते|पंजीकृत|उद्देश्य/,
 a:["Sugatta Care Foundation is a registered Section 8 non-profit company in Jind, Haryana (CIN U86909HR2025NPL134592). By law, we cannot pay profits to anyone. We bring health, comfort and learning to children, elders, women and rural families.","सुगत्ता केयर फ़ाउंडेशन जींद, हरियाणा में पंजीकृत धारा 8 की गैर-लाभकारी कंपनी है (CIN U86909HR2025NPL134592)। क़ानून के अनुसार हम किसी को मुनाफ़ा नहीं दे सकते। हम बच्चों, बुज़ुर्गों, महिलाओं और ग्रामीण परिवारों तक सेहत, सुकून और शिक्षा पहुँचाते हैं।"],
 c:[{l:["See who we are","हमारे बारे में देखें"],f:go("about")}]},
{id:"contact",re:/contact|email|mail|phone|call|number|whatsapp|address|office|location|jind|haryana|reach|संपर्क|ईमेल|फ़ोन|फोन|नंबर|पता|जींद|हरियाणा|व्हाट्सऐप/,
 a:["You can write to us at sugattacarefoundation@gmail.com or message us on WhatsApp at 8750804069. We read every message.","आप हमें sugattacarefoundation@gmail.com पर लिख सकते हैं या व्हाट्सऐप पर 8750804069 पर संदेश भेज सकते हैं। हम हर संदेश पढ़ते हैं।"],
 c:[CP,{l:["Open the contact form","संपर्क फ़ॉर्म खोलें"],f:go("contact")}]}
];
var TOP=[["donate","Donate","दान करें"],["monthly","Give monthly","हर महीने दान"],["tax","Tax receipt (80G)","टैक्स रसीद (80G)"],["volunteer","Volunteer","स्वयंसेवक बनें"],["camp","Health camp","स्वास्थ्य शिविर"],["contact","Contact us","संपर्क करें"]];
var NAV=[["work","See what we do","हमारा काम देखें"],["donate","See donation options","दान के विकल्प देखें"],["photos","View our photos","तस्वीरें देखें"],["about","Learn about us","हमारे बारे में जानें"],["trust","See our trust information","हमारी पारदर्शिता देखें"],["join","Join our family","हमसे जुड़ें"],["contact","Open contact form","संपर्क फ़ॉर्म खोलें"]];
function topicChips(){return TOP.map(function(t){return{l:[t[1],t[2]],f:function(lg){add(pick([t[1],t[2]],lg),"u");answer(t[0],lg)}}})}
function navChips(){return NAV.map(function(t){return{l:[t[1],t[2]],f:go(t[0])}})}
var MORE={l:["More topics","और विषय"],f:function(lg){menu(lg)}};
function menu(lg,first){say(first?pick(KB[0].a,lg):pick(["What would you like to know about? You can also jump to any part of the website.","आप किस बारे में जानना चाहेंगे? आप वेबसाइट के किसी भी भाग पर जा सकते हैं।"],lg),topicChips().concat(navChips()),lg)}
function find(id){for(var i=0;i<KB.length;i++)if(KB[i].id==id)return KB[i]}
function answer(id,lg){var k=find(id);if(id=="greet"||id=="thanks"){say(pick(k.a,lg),topicChips(),lg);return}say(pick(k.a,lg),k.c.concat([MORE]),lg)}
function fallback(lg){say(pick(["I do not have a clear answer for that yet. You can send the question to our team by email, or continue the conversation on WhatsApp.","इस सवाल का मेरे पास अभी स्पष्ट जवाब नहीं है। आप सवाल हमारी टीम को ईमेल कर सकते हैं या व्हाट्सऐप पर बातचीत जारी रख सकते हैं।"],lg),
[{l:["Send by email","ईमेल से भेजें"],f:function(l){openBox(false);toContact("Ask a question",last,last,l)}},CP,MORE],lg)}
function submit(){var v=inp.value.trim();if(!v)return;inp.value="";last=v;var lg=/[\u0900-\u097F]/.test(v)?"hi":L;add(v,"u");
var s=v.toLowerCase(),hit=null;for(var i=0;i<KB.length;i++){if(KB[i].re.test(s)){hit=KB[i];break}}
if(hit)answer(hit.id,lg);else fallback(lg)}
$("cbsend").onclick=submit;inp.onkeydown=function(e){if(e.key=="Enter"){e.preventDefault();submit()}};
cbUI();
})();
