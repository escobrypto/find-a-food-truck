import { useState, useEffect, useReducer, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// FIND A FOOD TRUCK RVA — Complete Platform v3.0 — Polished Edition
// ═══════════════════════════════════════════════════════════════════════════

// ─── Auth ────────────────────────────────────────────────────────────────
const ADMIN_PW="FAFT2026!admin", SEC_PIN="7743", MEMBER_PW="truck2026";

// ─── Theme ───────────────────────────────────────────────────────────────
const T={bg:"#08090c",s:"rgba(255,255,255,0.028)",sh:"rgba(255,255,255,0.055)",b:"rgba(255,255,255,0.06)",bh:"rgba(255,255,255,0.12)",
  o:"#f97316",am:"#f59e0b",bl:"#3b82f6",pu:"#a855f7",g:"#22c55e",r:"#ef4444",cy:"#06b6d4",cr:"#dc2626",
  tm:"rgba(255,255,255,0.45)",td:"rgba(255,255,255,0.28)"};
const P={
  bg:"#F8F5F0",card:"#FFFFFF",o:"#D4622B",ol:"#FFF3EC",ch:"#1C1917",
  wg:"#78716C",lg:"#E7E5E4",cr:"#F5F0EA",gn:"#16A34A",rd:"#DC2626",
  am:"#D97706",accent2:"#7C3AED",warm:"#FEF3C7",warmDark:"#92400E",
  hero:"#1C1612",heroText:"#FAFAF9",divider:"#D6D3D1",
  cardBorder:"#E7E5E4",inputBg:"#FAFAF9",badge:"#FED7AA"
};

// ─── Data (preserved) ───────────────────────────────────────────────────
const TRUCKS=[
  {id:"ft1",name:"Curbside Creations",cuisine:"Southern Fusion",owner:"Chef Marcus",status:"active",schedule:"Mon-Fri 11am-3pm",phone:"(804) 555-0101",rating:4.8,reviews:234,img:"🚚",plan:"premium",verified:true,desc:"Award-winning Southern fusion with a modern twist. Three-time RVA Food Truck of the Year.",specialties:["Brisket Tacos","Bourbon Cobbler","Cajun Mac & Cheese","Sweet Tea Brined Chicken"],price:"$$",bookings:12,revenue:4200,lat:37.5407,lng:-77.436,location:"Shockoe Bottom",distance:0.8,hours:"11am-3pm",menu:[{name:"Brisket Tacos",price:14,desc:"12-hr smoked brisket, pickled onion, chipotle slaw"},{name:"Cajun Mac & Cheese",price:10,desc:"Five cheese blend, andouille sausage, breadcrumb crust"},{name:"Sweet Tea Chicken Sandwich",price:12,desc:"Brined & fried, honey butter, house pickles"},{name:"Bourbon Peach Cobbler",price:8,desc:"Seasonal peaches, brown butter crumble, vanilla cream"}]},
  {id:"ft2",name:"RVA Taco Co.",cuisine:"Mexican Street Food",owner:"Maria Santos",status:"active",schedule:"Tue-Sat 11am-9pm",phone:"(804) 555-0202",rating:4.6,reviews:189,img:"🌮",plan:"premium",verified:true,desc:"Authentic family recipes passed down three generations. The real deal.",specialties:["Al Pastor Tacos","Street Elote","Churros","Horchata"],price:"$",bookings:8,revenue:3100,lat:37.5536,lng:-77.4508,location:"The Fan",distance:1.2,hours:"11am-9pm",menu:[{name:"Al Pastor Tacos (3)",price:12,desc:"Marinated pork, pineapple, onion, cilantro"},{name:"Street Elote",price:6,desc:"Grilled corn, mayo, cotija, tajín, lime"},{name:"Churros",price:5,desc:"Fresh fried, cinnamon sugar, chocolate dip"},{name:"Horchata",price:4,desc:"House-made rice milk, cinnamon, vanilla"}]},
  {id:"ft3",name:"Smoke & Barrel BBQ",cuisine:"BBQ & Smoked Meats",owner:"Big Mike",status:"inactive",schedule:"Wed-Sun 12pm-8pm",phone:"(804) 555-0303",rating:4.9,reviews:312,img:"🔥",plan:"premium",verified:true,desc:"14-hour smoked brisket. Competition-winning ribs. The real BBQ experience.",specialties:["14-Hr Brisket","Competition Ribs","Smoked Mac","Banana Pudding"],price:"$$",bookings:15,revenue:5600,lat:37.5313,lng:-77.4764,location:"Scott's Addition",distance:2.1,hours:"Opens Wed 12pm",menu:[{name:"Brisket Plate",price:18,desc:"14-hour oak-smoked, two sides, Texas toast"},{name:"Competition Ribs (Half)",price:16,desc:"St. Louis cut, dry rub, cherry glaze"},{name:"Smoked Mac & Cheese",price:8,desc:"Gouda, cheddar, smoked paprika crust"},{name:"Banana Pudding",price:6,desc:"Grandma's recipe, 'nilla wafers, fresh banana"}]},
  {id:"ft4",name:"The Waffle Wagon",cuisine:"Breakfast & Brunch",owner:"Jenny Park",status:"active",schedule:"Daily 7am-2pm",phone:"(804) 555-0404",rating:4.7,reviews:156,img:"🧇",plan:"free",verified:false,desc:"Sweet and savory waffles made fresh every morning. Weekend brunch favorite.",specialties:["Chicken & Waffles","Berry Bliss","Savory Herb & Cheese"],price:"$",bookings:3,revenue:0,lat:37.557,lng:-77.467,location:"Carytown",distance:2.8,hours:"7am-2pm",menu:[{name:"Chicken & Waffles",price:14,desc:"Buttermilk fried chicken, Belgian waffle, maple hot sauce"},{name:"Berry Bliss Waffle",price:10,desc:"Mixed berries, whipped cream, powdered sugar"},{name:"Savory Herb & Cheese",price:11,desc:"Gruyère, fresh herbs, sunny egg, arugula"}]},
  {id:"ft5",name:"Pho on Wheels",cuisine:"Vietnamese",owner:"James Chen",status:"active",schedule:"Mon-Sat 11am-8pm",phone:"(804) 555-0505",rating:4.5,reviews:98,img:"🍜",plan:"premium",verified:true,desc:"Authentic Vietnamese street food. 24-hour bone broth. Fresh daily.",specialties:["24-Hr Pho","Banh Mi","Summer Rolls","Vietnamese Coffee"],price:"$",bookings:6,revenue:2800,lat:37.548,lng:-77.442,location:"Church Hill",distance:1.5,hours:"11am-8pm",menu:[{name:"Pho Tai",price:14,desc:"24-hour bone broth, rare steak, fresh herbs, rice noodles"},{name:"Banh Mi",price:10,desc:"Crispy baguette, pâté, pickled daikon, cilantro, jalapeño"},{name:"Summer Rolls",price:8,desc:"Shrimp, vermicelli, herbs, peanut dipping sauce"},{name:"Vietnamese Iced Coffee",price:5,desc:"Dark roast, sweetened condensed milk, slow drip"}]},
  {id:"ft6",name:"Wild Bill's Soda Bar",cuisine:"Beverages & Treats",owner:"Bill Williams",status:"active",schedule:"Thu-Sun 10am-6pm",phone:"(804) 555-0606",rating:4.4,reviews:67,img:"🥤",plan:"premium",verified:true,desc:"Old-fashioned craft sodas and frozen treats. Official VA250 partner.",specialties:["Root Beer Float","Craft Lemonade","Frozen Custard","Ginger Beer"],price:"$",bookings:4,revenue:1900,lat:37.539,lng:-77.433,location:"Monroe Park",distance:0.5,hours:"10am-6pm",menu:[{name:"Root Beer Float",price:7,desc:"House-brewed root beer, vanilla bean custard"},{name:"Craft Lemonade",price:5,desc:"Fresh squeezed, lavender or strawberry basil"},{name:"Frozen Custard",price:6,desc:"Daily rotating flavors, waffle cone"},{name:"Ginger Beer",price:5,desc:"Spicy house-brewed, fresh ginger, lime"}]},
  {id:"ft7",name:"Naan Stop",cuisine:"Indian Street Food",owner:"Priya Sharma",status:"active",schedule:"Tue-Sun 11am-9pm",phone:"(804) 555-0707",rating:4.8,reviews:145,img:"🫓",plan:"free",verified:false,desc:"Fresh naan wraps and curry bowls. Bold flavors, fast service.",specialties:["Butter Chicken Wrap","Tikka Bowl","Mango Lassi","Samosa Chaat"],price:"$",bookings:2,revenue:0,lat:37.545,lng:-77.455,location:"VCU Area",distance:0.9,hours:"11am-9pm",menu:[{name:"Butter Chicken Naan Wrap",price:12,desc:"Tandoori chicken, butter sauce, fresh naan, onion, cilantro"},{name:"Tikka Masala Bowl",price:13,desc:"Basmati rice, tikka masala, raita, naan chips"},{name:"Samosa Chaat",price:8,desc:"Crushed samosa, chickpeas, tamarind, yogurt, sev"},{name:"Mango Lassi",price:5,desc:"Fresh mango, yogurt, cardamom, saffron"}]},
  {id:"ft8",name:"Seoul Food Truck",cuisine:"Korean Fusion",owner:"Danny Kim",status:"active",schedule:"Mon-Sat 11am-8pm",phone:"(804) 555-0808",rating:4.7,reviews:178,img:"🍱",plan:"premium",verified:true,desc:"Korean BBQ meets Southern comfort. Kimchi everything.",specialties:["Korean BBQ Tacos","Bulgogi Bowl","KFC (Korean Fried Chicken)","Kimchi Fries"],price:"$$",bookings:9,revenue:3400,lat:37.551,lng:-77.449,location:"Jackson Ward",distance:1.0,hours:"11am-8pm",menu:[{name:"Korean BBQ Tacos (3)",price:13,desc:"Bulgogi beef, kimchi slaw, gochujang aioli, sesame"},{name:"Bulgogi Bowl",price:14,desc:"Marinated beef, rice, pickled veg, fried egg, gochujang"},{name:"KFC Bites",price:11,desc:"Double-fried chicken, sweet chili glaze, pickled radish"},{name:"Kimchi Fries",price:9,desc:"Loaded fries, bulgogi, cheese sauce, kimchi, scallions"}]}
];
const EVENTS=[
  {id:"e1",title:"VA250 Food Truck Festival",date:"2026-03-15",time:"11AM-8PM",location:"Brown's Island",host:"Richmond Tourism Board",maxTrucks:15,status:"upcoming",fee:75,desc:"Virginia's 250th anniversary celebration with the best food trucks in RVA. Live music, family activities, and incredible food.",attendees:890,apps:[{tid:"ft1",s:"approved"},{tid:"ft2",s:"approved"},{tid:"ft3",s:"pending"},{tid:"ft5",s:"approved"},{tid:"ft8",s:"approved"}],tags:["festival","family","live-music","va250"],featured:true,img:"🎪"},
  {id:"e2",title:"Carytown Food Truck Rally",date:"2026-03-22",time:"12PM-6PM",location:"Carytown",host:"Carytown Merchants Assoc.",maxTrucks:10,status:"upcoming",fee:50,desc:"Monthly rally in the heart of Carytown. Rotating truck lineups, local artisan vendors, and live entertainment.",attendees:450,apps:[{tid:"ft1",s:"pending"},{tid:"ft4",s:"approved"},{tid:"ft7",s:"pending"}],tags:["monthly","family","shopping"],featured:false,img:"🎶"},
  {id:"e3",title:"Scott's Addition Night Market",date:"2026-04-05",time:"5PM-10PM",location:"Scott's Addition",host:"SA Business Alliance",maxTrucks:20,status:"planning",fee:100,desc:"Evening market with craft breweries, food trucks, and live DJs. The hottest night out in Scott's Addition.",attendees:0,apps:[],tags:["night-market","craft-beer","live-music"],featured:true,img:"🌙"},
  {id:"e4",title:"RVA Brunch Bash",date:"2026-04-12",time:"9AM-2PM",location:"The Diamond District",host:"RVA Foodies Collective",maxTrucks:8,status:"planning",fee:40,desc:"Bottomless mimosa stations meet the best brunch trucks in Richmond.",attendees:0,apps:[],tags:["brunch","mimosas","weekend"],featured:false,img:"🥂"},
  {id:"e5",title:"Corporate Wellness Fair",date:"2026-04-20",time:"11AM-2PM",location:"Downtown — Capital One HQ",host:"Capital One",maxTrucks:6,status:"upcoming",fee:0,desc:"Private corporate wellness event. Healthy food options preferred.",attendees:300,apps:[{tid:"ft5",s:"approved"},{tid:"ft7",s:"pending"}],tags:["corporate","private","wellness"],featured:false,img:"🏢"},
];
const BOOKINGS=[
  {id:"b1",type:"private",who:"Jennifer Adams",email:"jen@email.com",phone:"(804) 555-1001",date:"2026-03-28",time:"4-8PM",location:"West End residence",guests:50,budget:"$500-$800",eventType:"Graduation Party",cuisine:"BBQ, Mexican",notes:"Need 2 trucks for outdoor graduation celebration.",status:"open",responses:[{tid:"ft1",price:650,msg:"We'd love to cater!"},{tid:"ft3",price:700,msg:"Full BBQ spread available."}],created:"2026-02-18"},
  {id:"b2",type:"corporate",who:"Tom Bradley",email:"tom@techstartup.io",phone:"(804) 555-1002",date:"2026-04-02",time:"11:30AM-1:30PM",location:"1001 E Broad St",guests:120,budget:"$1,000-$1,500",eventType:"Team Lunch",cuisine:"Any",notes:"Monthly team lunch, prefer 2-3 diverse trucks.",status:"open",responses:[],created:"2026-02-20"},
  {id:"b3",type:"wedding",who:"Amanda & Chris",email:"amanda@email.com",phone:"(804) 555-1003",date:"2026-05-16",time:"6-10PM",location:"Maymont Gardens",guests:150,budget:"$2,000-$3,000",eventType:"Wedding Reception",cuisine:"Southern, Dessert, Beverages",notes:"Wedding reception food service. Need 3 trucks with cohesive look.",status:"open",responses:[{tid:"ft1",price:1200,msg:"We specialize in wedding catering."}],created:"2026-02-15"},
];
const PENDING=[{id:"pm1",name:"Sarah's Sweet Treats",type:"truck",applied:"2026-02-19",answers:["Artisan cupcakes","Mobile bakery"]},{id:"pm2",name:"RVA Brewery Tour Co.",type:"host",applied:"2026-02-18",answers:["Brewery tours","Want food truck stops"]},{id:"pm3",name:"Mike Thompson",type:"customer",applied:"2026-02-20",answers:["New to Richmond","Love food trucks!"]}];
const SPAM_Q=[{id:"s1",author:"CryptoKing99",content:"🚀 Make $5000/day trading crypto! DM me!! 💰",time:"2 hours ago",conf:98,reason:"Financial spam"},{id:"s2",author:"BestDeals2026",content:"Check out www.totallylegit-deals.biz — 90% OFF!",time:"5 hours ago",conf:95,reason:"Suspicious URL"}];
const ADS=[{id:"a1",tid:"ft2",title:"🌮 Taco Tuesday Special!",content:"Half-price Al Pastor tacos Tuesdays 5-7pm!",impressions:1240,clicks:89,status:"active"},{id:"a2",tid:"ft6",title:"🥤 VA250 Partnership Launch!",content:"Wild Bill's is the official VA250 beverage partner!",impressions:2100,clicks:156,status:"active"}];
const FLAGGED=[
  {id:"f1",author:"CryptoKing99",trust:0,content:"🚀 Make $5000/day trading crypto! DM me now!! 💰",ts:"12 min ago",threats:[{type:"Spam",conf:98,words:["crypto","make money","DM me"]}],ip:"192.168.1.47",device:"Android Chrome",age:"2 hours",posts:1,reports:0},
  {id:"f2",author:"MLMQueen",trust:0,content:"Hey mamas! 💕 PASSIVE INCOME! Network marketing 💯!",ts:"3 hours ago",threats:[{type:"Spam",conf:99,words:["passive income","network marketing"]}],ip:"10.0.1.15",device:"iPhone Safari",age:"1 hour",posts:1,reports:0},
];
const INTEL=[
  {id:"m1",name:"CryptoKing99",trust:0,joined:"2026-02-23 10:14 AM",ip:"192.168.1.47",device:"Android Chrome/119",loc:"VPN — Netherlands",posts:1,flags:1,status:"flagged",risk:96,signals:["VPN detected","Account < 24hrs","First post is spam"]},
  {id:"m2",name:"MLMQueen",trust:0,joined:"2026-02-23 07:45 AM",ip:"10.0.1.15",device:"iPhone Safari/17",loc:"Richmond, VA",posts:1,flags:1,status:"flagged",risk:94,signals:["Account < 24hrs","MLM keyword density: HIGH","Mass-join pattern"]},
];
const AUDIT=[
  {id:"a1",ts:"2026-02-23 10:26 AM",act:"auto_flag",target:"CryptoKing99",detail:"Post auto-flagged: spam 98%",actor:"System",cat:"content"},
  {id:"a2",ts:"2026-02-23 09:45 AM",act:"raid_detected",target:"5 accounts",detail:"Mass join alert",actor:"System",cat:"security"},
  {id:"a3",ts:"2026-02-22 11:00 AM",act:"trust_up",target:"ChefMarcus",detail:"Member → Verified",actor:"Admin",cat:"member"},
  {id:"a4",ts:"2026-02-21 09:15 AM",act:"ban",target:"SpamBot_42",detail:"Permanent ban",actor:"Admin",cat:"enforcement"},
];
const TRUST_LEVELS=[
  {lv:0,name:"New",color:"#666",icon:"🆕",maxP:2,hold:true,days:0,desc:"Posts held. 2/day."},
  {lv:1,name:"Member",color:T.bl,icon:"👤",maxP:5,hold:false,days:7,desc:"Posts live. 5/day."},
  {lv:2,name:"Verified",color:T.g,icon:"✓",maxP:10,hold:false,days:30,desc:"Badge. 10/day."},
  {lv:3,name:"Trusted",color:T.am,icon:"⭐",maxP:25,hold:false,days:90,desc:"Gold. 25/day."},
  {lv:4,name:"Mod",color:T.pu,icon:"🛡️",maxP:-1,hold:false,days:-1,desc:"Full mod powers."},
  {lv:5,name:"Admin",color:T.r,icon:"👑",maxP:-1,hold:false,days:-1,desc:"Full access."},
];


// ─── CSS ─────────────────────────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700;1,800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
::selection{background:rgba(212,98,43,0.2);color:#D4622B}
::-webkit-scrollbar{width:7px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.12);border-radius:10px}::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.2)}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideInRight{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideInLeft{from{opacity:0;transform:translateX(-30px)}to{opacity:1;transform:translateX(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.05);opacity:.9}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes dash{to{stroke-dashoffset:0}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(212,98,43,0.1)}50%{box-shadow:0 0 50px rgba(212,98,43,0.2)}}
@keyframes typeIn{from{width:0}to{width:100%}}

.anim-fade-up{animation:fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both}
.anim-fade{animation:fadeIn 0.6s ease both}
.anim-scale{animation:scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) both}
.anim-slide-r{animation:slideInRight 0.6s cubic-bezier(0.22,1,0.36,1) both}
.d1{animation-delay:.1s}.d2{animation-delay:.2s}.d3{animation-delay:.3s}.d4{animation-delay:.4s}.d5{animation-delay:.5s}.d6{animation-delay:.6s}.d7{animation-delay:.7s}.d8{animation-delay:.8s}

.card-hover{transition:all 0.4s cubic-bezier(0.22,1,0.36,1)}
.card-hover:hover{transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,0.08),0 1px 3px rgba(0,0,0,0.04)}
.card-subtle:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.06)}
.link-hover{position:relative;display:inline-block}
.link-hover::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:currentColor;transition:width 0.3s cubic-bezier(0.22,1,0.36,1)}
.link-hover:hover::after{width:100%}

.grain-overlay{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;opacity:0.018;z-index:9999;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

.nav-blur{backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4)}

input:focus,textarea:focus,select:focus{outline:none;border-color:#D4622B !important;box-shadow:0 0 0 3px rgba(212,98,43,0.08)}
button{cursor:pointer;border:none;font-family:inherit}
button:active{transform:scale(0.97)}

.marquee-track{display:flex;animation:marquee 30s linear infinite}
.marquee-track:hover{animation-play-state:paused}

.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
@media(max-width:900px){
  .hero-grid{grid-template-columns:1fr;gap:40px;text-align:center}
  .hero-stats{justify-content:center}
  .hero-btns{justify-content:center}
  .nav-links{display:none !important}
  .truck-grid{grid-template-columns:1fr !important}
  .footer-grid{grid-template-columns:1fr !important;text-align:center}
  .stat-grid-4{grid-template-columns:1fr 1fr !important}
  .pricing-grid{grid-template-columns:1fr !important}
  .about-mission-grid{grid-template-columns:1fr !important}
  .event-featured-grid{grid-template-columns:1fr !important}
  .filter-bar{flex-direction:column}
  .detail-grid{grid-template-columns:1fr !important}
  .member-tabs{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .member-content-grid{grid-template-columns:1fr !important}
  .booking-meta{flex-direction:column;gap:4px}
}
`;

// ─── Router ──────────────────────────────────────────────────────────────
function useRouter(){
  const[route,setRoute]=useState(window.location.hash.slice(1)||"/");
  useEffect(()=>{const h=()=>{setRoute(window.location.hash.slice(1)||"/");window.scrollTo({top:0,behavior:"smooth"})};window.addEventListener("hashchange",h);return()=>window.removeEventListener("hashchange",h)},[]);
  const go=(r)=>{window.location.hash=r};
  return{route,go};
}

// ─── Reducer ─────────────────────────────────────────────────────────────
function reducer(st,a){switch(a.type){
  case "SET_VIEW":return{...st,view:a.p};
  case "APPROVE_MEMBER":return{...st,pending:st.pending.filter(m=>m.id!==a.p)};
  case "REJECT_MEMBER":return{...st,pending:st.pending.filter(m=>m.id!==a.p)};
  case "REMOVE_SPAM":return{...st,spam:st.spam.filter(s=>s.id!==a.p)};
  case "KEEP_SPAM":return{...st,spam:st.spam.filter(s=>s.id!==a.p)};
  case "TOGGLE_TRUCK":return{...st,trucks:st.trucks.map(t=>t.id===a.p?{...t,status:t.status==="active"?"inactive":"active"}:t)};
  case "REMOVE_FLAG":return{...st,flagged:st.flagged.filter(f=>f.id!==a.p)};
  default:return st;}}


// ─── Shared Components ──────────────────────────────────────────────────
const PBtn=({children,onClick,v="primary",s="md",full,style:x={},className="",...rest})=>{
  const base={borderRadius:100,cursor:"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"all 0.35s cubic-bezier(0.22,1,0.36,1)",display:"inline-flex",alignItems:"center",gap:8,width:full?"100%":"auto",justifyContent:"center",letterSpacing:"0.01em",border:"none"};
  const vs={
    primary:{background:"linear-gradient(135deg,#D4622B 0%,#B8491F 100%)",color:"#fff",boxShadow:"0 4px 24px rgba(212,98,43,0.2),0 1px 3px rgba(212,98,43,0.15)"},
    secondary:{background:"transparent",color:P.ch,border:`1.5px solid ${P.lg}`,boxShadow:"none"},
    outline:{background:"transparent",color:P.o,border:`1.5px solid ${P.o}`},
    ghost:{background:"transparent",color:P.wg,border:"none"},
    dark:{background:P.ch,color:"#fff",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"},
    white:{background:"#fff",color:P.ch,boxShadow:"0 4px 20px rgba(0,0,0,0.08)"}
  };
  const ss={sm:{padding:"10px 24px",fontSize:13},md:{padding:"14px 32px",fontSize:14},lg:{padding:"18px 44px",fontSize:15}};
  return<button onClick={onClick} className={`card-subtle ${className}`} style={{...base,...ss[s],...vs[v],...x}} {...rest}>{children}</button>;
};

const Badge=({children,color=T.bl,glow,filled})=><span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:filled?color:color+"15",color:filled?"#fff":color,border:`1px solid ${filled?color:color+"20"}`,boxShadow:glow?`0 0 12px ${color}20`:"none",fontFamily:"'DM Sans',sans-serif"}}>{children}</span>;
const ABtn=({children,onClick,v="primary",s="md",full,disabled})=>{const vs={primary:{background:`linear-gradient(135deg,${T.o},#ea580c)`,color:"#fff",border:"none"},secondary:{background:T.s,color:"rgba(255,255,255,0.7)",border:`1px solid ${T.b}`},danger:{background:T.r+"15",color:T.r,border:`1px solid ${T.r}20`},success:{background:T.g+"15",color:T.g,border:`1px solid ${T.g}20`},ghost:{background:"transparent",color:T.tm,border:"none"},critical:{background:`linear-gradient(135deg,${T.cr},#991b1b)`,color:"#fff",border:"none"}};const ss={sm:{padding:"7px 16px",fontSize:12},md:{padding:"10px 22px",fontSize:13}};return<button onClick={disabled?undefined:onClick} style={{...ss[s],...vs[v],borderRadius:10,cursor:disabled?"not-allowed":"pointer",fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"all 0.25s",display:"inline-flex",alignItems:"center",gap:7,width:full?"100%":"auto",justifyContent:full?"center":"flex-start",opacity:disabled?0.4:1}}>{children}</button>};
const ACard=({children,style:x={},onClick,pad=24})=><div onClick={onClick} style={{background:T.s,border:`1px solid ${T.b}`,borderRadius:16,padding:pad,transition:"all 0.3s cubic-bezier(0.22,1,0.36,1)",cursor:onClick?"pointer":"default",...x}} onMouseEnter={e=>{e.currentTarget.style.background=T.sh;e.currentTarget.style.borderColor=T.bh}} onMouseLeave={e=>{e.currentTarget.style.background=T.s;e.currentTarget.style.borderColor=T.b}}>{children}</div>;
const StatCard=({icon,label,value,sub,accent="#fff",trend})=><ACard><div style={{position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-20,right:-8,fontSize:64,opacity:0.04}}>{icon}</div><div style={{fontSize:10,color:T.tm,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'JetBrains Mono',monospace",fontWeight:500}}>{label}</div><div style={{display:"flex",alignItems:"baseline",gap:10,marginTop:8}}><span style={{fontSize:32,fontWeight:800,color:accent,fontFamily:"'DM Sans',sans-serif"}}>{value}</span>{trend&&<span style={{fontSize:12,color:trend>0?T.g:T.r,fontWeight:600}}>{trend>0?"↑":"↓"}{Math.abs(trend)}%</span>}</div>{sub&&<div style={{fontSize:12,color:T.td,marginTop:4}}>{sub}</div>}</div></ACard>;
const ProgressBar=({value,color=T.o,h=6})=><div style={{width:"100%",height:h,borderRadius:h,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{width:`${Math.min(value,100)}%`,height:"100%",borderRadius:h,background:`linear-gradient(90deg,${color},${color}cc)`,transition:"width 0.8s cubic-bezier(0.22,1,0.36,1)"}}/></div>;
const SH=({title,subtitle,action})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:28}}><div><h2 style={{fontSize:26,fontWeight:700,color:"#fff",margin:0,fontFamily:"'Syne',sans-serif",letterSpacing:"-0.02em"}}>{title}</h2>{subtitle&&<p style={{color:T.tm,margin:"6px 0 0",fontSize:14}}>{subtitle}</p>}</div>{action}</div>;
const Empty=({icon,title,sub})=><div style={{textAlign:"center",padding:"56px 24px",color:T.td}}><div style={{fontSize:48,marginBottom:16,opacity:0.4}}>{icon}</div><div style={{fontSize:16,fontWeight:600,color:T.tm}}>{title}</div>{sub&&<div style={{fontSize:13,marginTop:8}}>{sub}</div>}</div>;

// ─── Fancy Input ─────────────────────────────────────────────────────────
const FInput=({label,value,onChange,placeholder,type="text",textarea,rows=4})=>(
  <div style={{marginBottom:22}}>
    <label style={{display:"block",fontSize:12,fontWeight:600,color:P.ch,marginBottom:8,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.02em"}}>{label}</label>
    {textarea?
      <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"14px 18px",borderRadius:14,border:`1.5px solid ${P.lg}`,background:P.inputBg,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:P.ch,boxSizing:"border-box",resize:"vertical",transition:"all 0.3s",lineHeight:1.6}}/>
      :<input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",padding:"14px 18px",borderRadius:14,border:`1.5px solid ${P.lg}`,background:P.inputBg,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:P.ch,boxSizing:"border-box",transition:"all 0.3s"}}/>
    }
  </div>
);


// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC SITE
// ═══════════════════════════════════════════════════════════════════════════

function PubNav({go,route}){
  const[scrolled,setScrolled]=useState(false);
  const[mobileOpen,setMobileOpen]=useState(false);
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  const isHome=route==="/";
  const links=[{to:"/trucks",label:"Find Trucks"},{to:"/events",label:"Events"},{to:"/book",label:"Book a Truck"},{to:"/pricing",label:"For Vendors"},{to:"/about",label:"About"}];
  const textColor=isHome&&!scrolled?"rgba(255,255,255,0.85)":P.wg;
  const activeColor=P.o;

  return<>
    <nav className="nav-blur" style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:scrolled?"10px 48px":"18px 48px",background:scrolled?"rgba(248,245,240,0.92)":"transparent",borderBottom:scrolled?`1px solid rgba(0,0,0,0.04)`:"none",transition:"all 0.5s cubic-bezier(0.22,1,0.36,1)"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div onClick={()=>go("/")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#D4622B,#B8491F)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(212,98,43,0.2)"}}>
            <span style={{fontSize:18,filter:"brightness(10)"}}>🚚</span>
          </div>
          <div style={{display:"flex",alignItems:"baseline",gap:4}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:20,color:isHome&&!scrolled?"#fff":P.ch,transition:"color 0.4s"}}>FAFT</span>
            <span style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:20,color:P.o,fontStyle:"italic"}}>RVA</span>
          </div>
        </div>

        <div className="nav-links" style={{display:"flex",gap:8,alignItems:"center"}}>
          {links.map(l=><span key={l.to} onClick={()=>go(l.to)} className="link-hover" style={{cursor:"pointer",fontSize:14,fontWeight:route===l.to?600:400,color:route===l.to?activeColor:textColor,fontFamily:"'DM Sans',sans-serif",transition:"color 0.3s",padding:"8px 14px",borderRadius:8,background:route===l.to?(isHome&&!scrolled?"rgba(255,255,255,0.1)":"rgba(212,98,43,0.06)"):"transparent"}}>{l.label}</span>)}
          <div style={{width:1,height:20,background:isHome&&!scrolled?"rgba(255,255,255,0.15)":P.lg,margin:"0 8px"}}/>
          <PBtn s="sm" onClick={()=>go("/member")}>Truck Login</PBtn>
        </div>
      </div>
    </nav>
  </>;
}

// ─── Hero ────────────────────────────────────────────────────────────────
function Hero({go}){
  return<section style={{minHeight:"100vh",background:P.hero,position:"relative",overflow:"hidden",display:"flex",alignItems:"center"}}>
    {/* Ambient orbs */}
    <div style={{position:"absolute",top:"-20%",right:"-5%",width:800,height:800,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,98,43,0.1) 0%,transparent 60%)",filter:"blur(80px)",animation:"breathe 8s ease infinite"}}/>
    <div style={{position:"absolute",bottom:"-15%",left:"-8%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(217,119,6,0.05) 0%,transparent 60%)",filter:"blur(60px)",animation:"breathe 10s ease 2s infinite"}}/>
    {/* Grid pattern */}
    <div style={{position:"absolute",inset:0,opacity:0.025,backgroundImage:"linear-gradient(rgba(255,255,255,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.08) 1px,transparent 1px)",backgroundSize:"80px 80px"}}/>
    {/* Diagonal line accent */}
    <div style={{position:"absolute",top:0,right:"30%",width:1,height:"100%",background:"linear-gradient(to bottom,transparent,rgba(212,98,43,0.08),transparent)",transform:"rotate(15deg) scaleY(1.5)"}}/>

    <div style={{position:"relative",zIndex:2,maxWidth:1280,margin:"0 auto",padding:"140px 60px 100px",width:"100%"}}>
      <div className="hero-grid">
        {/* Left: Copy */}
        <div>
          <div className="anim-fade-up" style={{display:"inline-flex",alignItems:"center",gap:10,padding:"8px 20px",borderRadius:100,background:"rgba(212,98,43,0.08)",border:"1px solid rgba(212,98,43,0.15)",marginBottom:36}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:P.o,animation:"pulse 2.5s infinite"}}/>
            <span style={{color:"rgba(212,98,43,0.9)",fontSize:12,fontWeight:600,letterSpacing:"0.12em",fontFamily:"'DM Sans',sans-serif"}}>RICHMOND'S FOOD TRUCK PLATFORM</span>
          </div>

          <h1 className="anim-fade-up d1" style={{fontSize:72,fontWeight:900,color:"#FAFAF9",margin:"0 0 28px",fontFamily:"'Playfair Display',serif",lineHeight:1.02,letterSpacing:"-0.03em"}}>
            Find Your<br/>Next Favorite<br/><span style={{color:P.o,fontStyle:"italic",position:"relative"}}>Bite
              <svg style={{position:"absolute",bottom:-8,left:0,width:"100%",height:12}} viewBox="0 0 200 12"><path d="M0 8 Q50 0 100 6 Q150 12 200 4" fill="none" stroke="rgba(212,98,43,0.4)" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </span>
          </h1>

          <p className="anim-fade-up d2" style={{fontSize:19,color:"rgba(255,255,255,0.4)",margin:"0 0 44px",fontFamily:"'DM Sans',sans-serif",lineHeight:1.8,maxWidth:460,fontWeight:300}}>
            Discover the best food trucks in Richmond. Track locations, browse events, and book trucks for your next celebration.
          </p>

          <div className="anim-fade-up d3 hero-btns" style={{display:"flex",gap:14}}>
            <PBtn s="lg" onClick={()=>go("/trucks")}>Find Trucks Near Me</PBtn>
            <PBtn v="ghost" s="lg" onClick={()=>go("/pricing")} style={{color:"rgba(255,255,255,0.5)",border:"1px solid rgba(255,255,255,0.1)"}}>I Own a Truck →</PBtn>
          </div>

          {/* Stats */}
          <div className="anim-fade-up d4 hero-stats" style={{display:"flex",gap:56,marginTop:72}}>
            {[["4,100+","Active Members"],["50+","Food Trucks"],["12","Events / Month"]].map(([v,l],i)=>
              <div key={i}>
                <div style={{fontSize:32,fontWeight:800,color:"#fff",fontFamily:"'DM Sans',sans-serif",letterSpacing:"-0.02em"}}>{v}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.25)",marginTop:6,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.06em",fontWeight:500}}>{l}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Truck cards */}
        <div className="anim-fade-up d3" style={{perspective:1000}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            {TRUCKS.filter(t=>t.status==="active"&&t.plan==="premium").slice(0,4).map((t,i)=>
              <div key={t.id} className="card-hover" onClick={()=>go("/trucks")} style={{cursor:"pointer",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:18,padding:22,animationDelay:`${0.4+i*0.12}s`,backdropFilter:"blur(4px)"}}>
                <div style={{fontSize:32,marginBottom:12}}>{t.img}</div>
                <div style={{color:"#fff",fontWeight:700,fontSize:14,fontFamily:"'DM Sans',sans-serif"}}>{t.name}</div>
                <div style={{color:"rgba(255,255,255,0.3)",fontSize:12,marginTop:3,fontFamily:"'DM Sans',sans-serif"}}>{t.cuisine}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
                  <span style={{color:"#FBBF24",fontSize:13,fontWeight:700}}>★ {t.rating}</span>
                  <span style={{color:"rgba(255,255,255,0.2)",fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>{t.reviews}</span>
                </div>
              </div>
            )}
          </div>
          <div style={{textAlign:"center",marginTop:22}}>
            <span onClick={()=>go("/trucks")} style={{color:"rgba(212,98,43,0.7)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.02em"}}>View all {TRUCKS.length} trucks →</span>
          </div>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div style={{position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:10,animation:"float 4s ease infinite"}}>
      <span style={{color:"rgba(255,255,255,0.2)",fontSize:11,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.15em",fontWeight:500}}>SCROLL</span>
      <div style={{width:1,height:36,background:"linear-gradient(to bottom,rgba(255,255,255,0.25),transparent)"}}/>
    </div>
  </section>;
}

// ─── Marquee Banner ──────────────────────────────────────────────────────
function MarqueeBanner(){
  const items=["🚚 Curbside Creations","🌮 RVA Taco Co.","🔥 Smoke & Barrel BBQ","🧇 Waffle Wagon","🍜 Pho on Wheels","🥤 Wild Bill's","🫓 Naan Stop","🍱 Seoul Food"];
  return<div style={{background:P.o,padding:"14px 0",overflow:"hidden",position:"relative"}}>
    <div className="marquee-track" style={{whiteSpace:"nowrap"}}>
      {[...items,...items,...items].map((item,i)=><span key={i} style={{display:"inline-block",padding:"0 40px",color:"#fff",fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.04em",opacity:0.9}}>{item}</span>)}
    </div>
  </div>;
}


// ─── Truck Finder ────────────────────────────────────────────────────────
function TruckFinder({go}){
  const[search,setSearch]=useState("");const[cuisine,setCuisine]=useState("All");const[sort,setSort]=useState("rating");const[sel,setSel]=useState(null);const[filter,setFilter]=useState("all");
  const cuisines=["All","Southern","Mexican","BBQ","Breakfast","Vietnamese","Beverages","Indian","Korean"];
  let filtered=TRUCKS.filter(t=>{
    if(search&&!t.name.toLowerCase().includes(search.toLowerCase())&&!t.cuisine.toLowerCase().includes(search.toLowerCase()))return false;
    if(cuisine!=="All"&&!t.cuisine.toLowerCase().includes(cuisine.toLowerCase()))return false;
    if(filter==="open"&&t.status!=="active")return false;
    return true;
  });
  if(sort==="rating")filtered.sort((a,b)=>b.rating-a.rating);
  if(sort==="reviews")filtered.sort((a,b)=>b.reviews-a.reviews);
  if(sort==="nearest")filtered.sort((a,b)=>a.distance-b.distance);
  const det=TRUCKS.find(t=>t.id===sel);

  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 48px 80px"}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      {/* Header */}
      <div style={{marginBottom:40}} className="anim-fade-up">
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:4,height:36,borderRadius:4,background:`linear-gradient(to bottom,${P.o},transparent)`}}/>
          <h2 style={{fontSize:44,fontWeight:900,color:P.ch,fontFamily:"'Playfair Display',serif",letterSpacing:"-0.02em"}}>Find a Truck</h2>
        </div>
        <p style={{fontSize:17,color:P.wg,fontFamily:"'DM Sans',sans-serif",marginLeft:16,fontWeight:300}}>{TRUCKS.filter(t=>t.status==="active").length} trucks serving Richmond right now</p>
      </div>

      {/* Search & Filters */}
      <div className="anim-fade-up d1 filter-bar" style={{display:"flex",gap:12,marginBottom:20}}>
        <div style={{flex:1,position:"relative"}}>
          <span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",fontSize:16,opacity:0.35}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search trucks by name or cuisine..." style={{width:"100%",padding:"15px 16px 15px 48px",borderRadius:14,border:`1.5px solid ${P.lg}`,background:P.card,fontSize:14,fontFamily:"'DM Sans',sans-serif",color:P.ch,boxSizing:"border-box",transition:"all 0.3s"}}/>
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{padding:"15px 24px",borderRadius:14,border:`1.5px solid ${P.lg}`,background:P.card,fontSize:13,fontFamily:"'DM Sans',sans-serif",color:P.ch,cursor:"pointer",appearance:"none",minWidth:140}}>
          <option value="rating">★ Top Rated</option><option value="reviews">Most Reviewed</option><option value="nearest">Nearest</option>
        </select>
        <div style={{display:"flex",borderRadius:14,overflow:"hidden",border:`1.5px solid ${P.lg}`,background:P.card}}>
          {[["all","All"],["open","Open Now"]].map(([v,l])=><div key={v} onClick={()=>setFilter(v)} style={{padding:"15px 22px",cursor:"pointer",background:filter===v?P.o:P.card,color:filter===v?"#fff":P.wg,fontSize:13,fontWeight:filter===v?600:400,fontFamily:"'DM Sans',sans-serif",transition:"all 0.25s"}}>{l}</div>)}
        </div>
      </div>

      {/* Cuisine pills */}
      <div className="anim-fade-up d2" style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap",paddingBottom:4}}>
        {cuisines.map(c=><div key={c} onClick={()=>setCuisine(c)} className="card-subtle" style={{padding:"8px 20px",borderRadius:100,cursor:"pointer",background:cuisine===c?P.ch:P.card,color:cuisine===c?"#fff":P.wg,fontSize:12,fontWeight:cuisine===c?600:500,fontFamily:"'DM Sans',sans-serif",border:`1px solid ${cuisine===c?"transparent":P.lg}`,transition:"all 0.3s",letterSpacing:"0.02em"}}>{c}</div>)}
      </div>

      {/* Promoted ad */}
      {!search&&cuisine==="All"&&<div className="anim-fade-up d2" style={{background:`linear-gradient(135deg,${P.ol},#FEF3C7)`,border:`1px solid rgba(212,98,43,0.12)`,borderRadius:16,padding:"14px 24px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <span style={{fontSize:9,fontWeight:700,color:P.o,letterSpacing:"0.12em",fontFamily:"'JetBrains Mono',monospace",background:"rgba(212,98,43,0.1)",padding:"4px 10px",borderRadius:6}}>AD</span>
          <span style={{fontSize:22}}>🌮</span>
          <div style={{fontFamily:"'DM Sans',sans-serif"}}><span style={{fontWeight:700,color:P.ch,fontSize:14}}>RVA Taco Co.</span> <span style={{color:P.wg,fontSize:13,fontWeight:300}}>— Taco Tuesday: Half-price Al Pastor 5-7pm</span></div>
        </div>
        <PBtn s="sm" onClick={()=>setSel("ft2")}>View →</PBtn>
      </div>}

      {/* Grid */}
      <div className="detail-grid" style={{display:"grid",gridTemplateColumns:sel?"1fr 440px":"1fr",gap:24}}>
        <div className="truck-grid" style={{display:"grid",gridTemplateColumns:sel?"1fr":"repeat(2,1fr)",gap:14}}>
          {filtered.map((t,i)=><div key={t.id} className="card-hover" onClick={()=>setSel(t.id)}
            style={{background:P.card,borderRadius:18,padding:24,cursor:"pointer",border:sel===t.id?`2px solid ${P.o}`:`1.5px solid ${P.lg}`,position:"relative",overflow:"hidden",transition:"all 0.3s"}}>
            {t.plan==="premium"&&<div style={{position:"absolute",top:14,right:14}}><span style={{background:P.badge,color:P.warmDark,fontSize:10,fontWeight:700,padding:"4px 10px",borderRadius:100,letterSpacing:"0.03em",fontFamily:"'DM Sans',sans-serif"}}>★ PREMIUM</span></div>}
            <div style={{display:"flex",gap:16,alignItems:"start"}}>
              <div style={{width:52,height:52,borderRadius:14,background:P.cr,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{t.img}</div>
              <div style={{flex:1,fontFamily:"'DM Sans',sans-serif"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontWeight:700,color:P.ch,fontSize:16}}>{t.name}</span>
                  {t.verified&&<span style={{color:P.o,fontSize:13,fontWeight:700}}>✓</span>}
                </div>
                <div style={{color:P.wg,fontSize:13,marginTop:3,fontWeight:400}}>{t.cuisine} · {t.price}</div>
                <div style={{display:"flex",gap:16,marginTop:14,alignItems:"center"}}>
                  <span style={{color:"#D97706",fontSize:13,fontWeight:700}}>★ {t.rating}</span>
                  <span style={{color:P.wg,fontSize:12}}>{t.reviews} reviews</span>
                  <span style={{color:t.status==="active"?P.gn:P.rd,fontSize:11,fontWeight:700,letterSpacing:"0.05em"}}>{t.status==="active"?"● OPEN":"● CLOSED"}</span>
                </div>
                <div style={{color:P.wg,fontSize:12,marginTop:10,fontWeight:300}}>📍 {t.location} · {t.distance}mi · {t.hours}</div>
              </div>
            </div>
          </div>)}
          {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:80,color:P.wg,fontFamily:"'DM Sans',sans-serif"}}><div style={{fontSize:56,marginBottom:16,opacity:0.4}}>🔍</div><div style={{fontSize:20,fontWeight:600,color:P.ch}}>No trucks found</div><div style={{fontSize:14,marginTop:8}}>Try adjusting your search or filters</div></div>}
        </div>

        {/* Detail Panel */}
        {sel&&det&&<div className="anim-slide-r">
          <div style={{background:P.card,borderRadius:22,border:`1.5px solid rgba(212,98,43,0.15)`,position:"sticky",top:100,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.06)"}}>
            <div style={{background:`linear-gradient(145deg,${P.hero},#2C2520)`,padding:"36px 30px 28px",position:"relative"}}>
              <div onClick={()=>setSel(null)} style={{position:"absolute",top:16,right:18,cursor:"pointer",color:"rgba(255,255,255,0.4)",fontSize:18,width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(255,255,255,0.06)",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>✕</div>
              <div style={{fontSize:44,marginBottom:14}}>{det.img}</div>
              <h3 style={{fontSize:24,fontWeight:800,color:"#fff",fontFamily:"'Playfair Display',serif",margin:"0 0 4px"}}>{det.name}</h3>
              <div style={{color:"rgba(255,255,255,0.45)",fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:300}}>{det.cuisine} · {det.owner}</div>
              <div style={{display:"flex",gap:28,marginTop:20}}>
                {[[det.rating,"★ rating"],[det.reviews,"reviews"],[`${det.distance}mi`,"away"]].map(([v,l])=>
                  <div key={l}><span style={{fontSize:24,fontWeight:800,color:"#fff",fontFamily:"'DM Sans',sans-serif"}}>{v}</span><span style={{color:"rgba(255,255,255,0.3)",fontSize:11,marginLeft:6,fontFamily:"'DM Sans',sans-serif"}}>{l}</span></div>
                )}
              </div>
            </div>
            <div style={{padding:30,fontFamily:"'DM Sans',sans-serif"}}>
              <p style={{color:P.wg,fontSize:14,lineHeight:1.75,marginBottom:24,fontWeight:300}}>{det.desc}</p>
              <div style={{marginBottom:24}}>
                <h4 style={{fontSize:11,fontWeight:700,color:P.ch,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14}}>Menu</h4>
                {det.menu?.map((m,i)=><div key={m.name} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:i<det.menu.length-1?`1px solid ${P.lg}`:"none"}}>
                  <div><div style={{color:P.ch,fontWeight:600,fontSize:14}}>{m.name}</div><div style={{color:P.wg,fontSize:12,marginTop:3,fontWeight:300}}>{m.desc}</div></div>
                  <span style={{color:P.o,fontWeight:700,fontSize:14,flexShrink:0,marginLeft:16}}>${m.price}</span>
                </div>)}
              </div>
              <div style={{background:P.cr,borderRadius:12,padding:16,marginBottom:24,fontSize:13,color:P.wg,lineHeight:2,fontWeight:400}}>📍 {det.location}<br/>🕐 {det.schedule}<br/>📞 {det.phone}</div>
              <PBtn full onClick={()=>{go("/book")}}>Book for Your Event</PBtn>
            </div>
          </div>
        </div>}
      </div>
    </div>
  </section>;
}


// ─── Events Page ─────────────────────────────────────────────────────────
function EventsPage({go}){
  const[sel,setSel]=useState(null);
  const featured=EVENTS.filter(e=>e.featured);
  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 48px 80px"}}>
    <div style={{maxWidth:1280,margin:"0 auto"}}>
      <div style={{marginBottom:48}} className="anim-fade-up">
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:4,height:36,borderRadius:4,background:`linear-gradient(to bottom,${P.o},transparent)`}}/>
          <h2 style={{fontSize:44,fontWeight:900,color:P.ch,fontFamily:"'Playfair Display',serif",letterSpacing:"-0.02em"}}>Events</h2>
        </div>
        <p style={{fontSize:17,color:P.wg,fontFamily:"'DM Sans',sans-serif",marginLeft:16,fontWeight:300}}>{EVENTS.length} upcoming food truck events in Richmond</p>
      </div>

      {/* Featured events */}
      <div className="anim-fade-up d1 event-featured-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:44}}>
        {featured.map((e,i)=><div key={e.id} className="card-hover" onClick={()=>setSel(sel===e.id?null:e.id)} style={{cursor:"pointer",background:P.hero,borderRadius:22,padding:40,color:"#fff",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-30%",right:"-15%",width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,rgba(212,98,43,0.1),transparent)`,filter:"blur(40px)"}}/>
          <div style={{position:"relative",zIndex:2}}>
            <div style={{display:"inline-flex",padding:"5px 14px",borderRadius:100,background:"rgba(212,98,43,0.12)",border:"1px solid rgba(212,98,43,0.2)",marginBottom:16}}>
              <span style={{color:P.o,fontSize:10,fontWeight:700,letterSpacing:"0.12em",fontFamily:"'DM Sans',sans-serif"}}>FEATURED</span>
            </div>
            <div style={{fontSize:40,marginBottom:12}}>{e.img}</div>
            <h3 style={{fontSize:26,fontWeight:800,margin:"0 0 10px",fontFamily:"'Playfair Display',serif",lineHeight:1.2}}>{e.title}</h3>
            <p style={{color:"rgba(255,255,255,0.4)",fontSize:14,lineHeight:1.65,marginBottom:20,fontFamily:"'DM Sans',sans-serif",fontWeight:300,maxWidth:380}}>{e.desc}</p>
            <div style={{display:"flex",gap:20,color:"rgba(255,255,255,0.35)",fontSize:13,fontFamily:"'DM Sans',sans-serif"}}>
              <span>📅 {new Date(e.date).toLocaleDateString("en-US",{month:"long",day:"numeric"})}</span>
              <span>📍 {e.location}</span>
              <span>🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks}</span>
            </div>
          </div>
        </div>)}
      </div>

      {/* All events */}
      <h3 style={{fontSize:18,fontWeight:700,color:P.ch,fontFamily:"'DM Sans',sans-serif",marginBottom:18,letterSpacing:"-0.01em"}}>All Events</h3>
      <div style={{display:"grid",gap:12}}>
        {EVENTS.map((e,i)=><div key={e.id} className="card-hover" onClick={()=>setSel(sel===e.id?null:e.id)} style={{background:P.card,borderRadius:18,padding:24,cursor:"pointer",border:sel===e.id?`2px solid ${P.o}`:`1.5px solid ${P.lg}`,fontFamily:"'DM Sans',sans-serif"}}>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div style={{width:60,height:60,borderRadius:14,background:P.cr,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <div style={{color:P.o,fontSize:10,fontWeight:700,letterSpacing:"0.08em"}}>{new Date(e.date).toLocaleDateString("en-US",{month:"short"}).toUpperCase()}</div>
              <div style={{color:P.ch,fontSize:22,fontWeight:800}}>{new Date(e.date).getDate()}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <h4 style={{fontSize:17,fontWeight:700,color:P.ch,margin:0}}>{e.title}</h4>
                {e.featured&&<span style={{background:P.o,color:"#fff",fontSize:9,padding:"3px 8px",borderRadius:100,fontWeight:700,letterSpacing:"0.05em"}}>HOT</span>}
              </div>
              <div style={{color:P.wg,fontSize:13,marginTop:5,fontWeight:400}}>📍 {e.location} · 🕐 {e.time} · {e.host}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{color:P.o,fontWeight:700,fontSize:14}}>{e.fee>0?`$${e.fee} fee`:"FREE"}</div>
              <div style={{color:P.wg,fontSize:12,marginTop:3}}>🚚 {e.apps.filter(a=>a.s==="approved").length}/{e.maxTrucks} spots</div>
            </div>
          </div>
          {sel===e.id&&<div style={{marginTop:20,paddingTop:20,borderTop:`1px solid ${P.lg}`,animation:"slideDown 0.3s ease"}}>
            <p style={{color:P.wg,fontSize:14,lineHeight:1.7,marginBottom:16,fontWeight:300}}>{e.desc}</p>
            <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>{e.tags.map(t=><span key={t} style={{padding:"5px 14px",borderRadius:100,background:P.cr,color:P.wg,fontSize:12,fontWeight:500}}>{t}</span>)}</div>
            {e.attendees>0&&<div style={{color:P.wg,fontSize:13,marginBottom:14}}>👥 {e.attendees.toLocaleString()} expected</div>}
            <PBtn s="sm" onClick={(ev)=>{ev.stopPropagation();go("/book")}}>Apply as Vendor →</PBtn>
          </div>}
        </div>)}
      </div>
      <div style={{textAlign:"center",marginTop:44}}><p style={{color:P.wg,fontSize:15,fontFamily:"'DM Sans',sans-serif"}}>Want to host a food truck event? <span onClick={()=>go("/book")} style={{color:P.o,fontWeight:600,cursor:"pointer"}} className="link-hover">Contact us →</span></p></div>
    </div>
  </section>;
}

// ─── Booking Form ────────────────────────────────────────────────────────
function BookingPage({go}){
  const[sent,setSent]=useState(false);const[form,setForm]=useState({name:"",email:"",phone:"",date:"",time:"",location:"",guests:"",budget:"",type:"private",cuisine:"",notes:""});
  const up=(k,v)=>setForm({...form,[k]:v});

  if(sent)return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 48px 80px",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div style={{textAlign:"center",maxWidth:480}} className="anim-scale">
      <div style={{width:88,height:88,borderRadius:"50%",background:P.ol,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 28px",animation:"glow 3s infinite"}}>🎉</div>
      <h2 style={{fontSize:36,fontWeight:800,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 16px"}}>Request Sent!</h2>
      <p style={{color:P.wg,fontSize:16,lineHeight:1.75,fontFamily:"'DM Sans',sans-serif",fontWeight:300}}>Premium trucks get notified first and typically respond within hours. We'll match you with the perfect vendors.</p>
      <PBtn style={{marginTop:36}} onClick={()=>go("/trucks")}>Browse Trucks</PBtn>
    </div>
  </section>;

  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 48px 80px"}}>
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{marginBottom:40}} className="anim-fade-up">
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
          <div style={{width:4,height:36,borderRadius:4,background:`linear-gradient(to bottom,${P.o},transparent)`}}/>
          <h2 style={{fontSize:44,fontWeight:900,color:P.ch,fontFamily:"'Playfair Display',serif",letterSpacing:"-0.02em"}}>Book a Truck</h2>
        </div>
        <p style={{fontSize:17,color:P.wg,fontFamily:"'DM Sans',sans-serif",marginLeft:16,fontWeight:300}}>Tell us about your event — we'll connect you with the perfect trucks</p>
      </div>
      <div className="anim-fade-up d1" style={{background:P.card,borderRadius:22,padding:44,border:`1.5px solid ${P.lg}`,boxShadow:"0 8px 40px rgba(0,0,0,0.03)"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 20px"}}>
          <FInput label="Your Name" value={form.name} onChange={e=>up("name",e.target.value)} placeholder="Full name"/>
          <FInput label="Email" value={form.email} onChange={e=>up("email",e.target.value)} placeholder="you@email.com" type="email"/>
          <FInput label="Phone" value={form.phone} onChange={e=>up("phone",e.target.value)} placeholder="(804) 555-0000" type="tel"/>
          <FInput label="Event Date" value={form.date} onChange={e=>up("date",e.target.value)} type="date"/>
          <FInput label="Event Time" value={form.time} onChange={e=>up("time",e.target.value)} placeholder="e.g. 4:00 PM - 8:00 PM"/>
          <FInput label="Number of Guests" value={form.guests} onChange={e=>up("guests",e.target.value)} placeholder="Estimated headcount" type="number"/>
        </div>
        <FInput label="Location" value={form.location} onChange={e=>up("location",e.target.value)} placeholder="Address or venue name"/>
        <FInput label="Budget Range" value={form.budget} onChange={e=>up("budget",e.target.value)} placeholder="e.g. $500-$1,000"/>
        <div style={{marginBottom:22}}>
          <label style={{display:"block",fontSize:12,fontWeight:600,color:P.ch,marginBottom:8,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.02em"}}>Event Type</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["private","corporate","wedding","festival","other"].map(t=><div key={t} onClick={()=>up("type",t)} className="card-subtle" style={{padding:"10px 22px",borderRadius:100,cursor:"pointer",background:form.type===t?P.ch:"transparent",color:form.type===t?"#fff":P.wg,fontSize:13,fontWeight:form.type===t?600:400,border:`1.5px solid ${form.type===t?"transparent":P.lg}`,fontFamily:"'DM Sans',sans-serif",transition:"all 0.25s",textTransform:"capitalize"}}>{t}</div>)}
          </div>
        </div>
        <FInput label="Cuisine Preferences" value={form.cuisine} onChange={e=>up("cuisine",e.target.value)} placeholder="e.g. BBQ, Mexican, Southern, Any"/>
        <FInput label="Additional Notes" value={form.notes} onChange={e=>up("notes",e.target.value)} placeholder="Special requirements, setup details..." textarea rows={3}/>
        <PBtn full s="lg" onClick={()=>setSent(true)} style={{marginTop:8}}>Submit Booking Request</PBtn>
        <p style={{color:P.wg,fontSize:12,textAlign:"center",marginTop:14,fontFamily:"'DM Sans',sans-serif",fontWeight:400}}>Free to submit · No commitment · Trucks respond directly</p>
      </div>
    </div>
  </section>;
}


// ─── Pricing ─────────────────────────────────────────────────────────────
function PricingPage({go}){
  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 48px 80px"}}>
    <div style={{maxWidth:960,margin:"0 auto"}}>
      <div style={{textAlign:"center",marginBottom:56}} className="anim-fade-up">
        <div style={{display:"inline-flex",padding:"6px 18px",borderRadius:100,background:P.ol,marginBottom:20}}>
          <span style={{color:P.o,fontSize:12,fontWeight:600,letterSpacing:"0.08em",fontFamily:"'DM Sans',sans-serif"}}>FOR VENDORS</span>
        </div>
        <h2 style={{fontSize:48,fontWeight:900,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 16px",letterSpacing:"-0.02em"}}>Grow Your Truck Business</h2>
        <p style={{fontSize:18,color:P.wg,fontFamily:"'DM Sans',sans-serif",maxWidth:520,margin:"0 auto",fontWeight:300,lineHeight:1.7}}>Join Richmond's largest food truck community. Reach 4,100+ hungry customers.</p>
      </div>
      <div className="anim-fade-up d2 pricing-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        {/* Free */}
        <div style={{background:P.card,borderRadius:24,padding:44,border:`1.5px solid ${P.lg}`,fontFamily:"'DM Sans',sans-serif"}}>
          <div style={{fontSize:12,fontWeight:700,color:P.wg,letterSpacing:"0.12em",marginBottom:10}}>FREE</div>
          <div style={{fontSize:52,fontWeight:800,color:P.ch,letterSpacing:"-0.03em"}}>$0<span style={{fontSize:18,color:P.wg,fontWeight:400}}>/mo</span></div>
          <p style={{color:P.wg,fontSize:14,margin:"8px 0 32px",fontWeight:300}}>Get started and reach new customers</p>
          {["Basic truck profile","Apply to events","Respond to bookings","1 post per day","Community access","Customer reviews"].map(f=><div key={f} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${P.lg}`}}><span style={{color:P.gn,fontSize:14}}>✓</span><span style={{color:P.ch,fontSize:14,fontWeight:400}}>{f}</span></div>)}
          <PBtn v="secondary" full style={{marginTop:32}} onClick={()=>go("/member")}>Get Started Free</PBtn>
        </div>
        {/* Premium */}
        <div style={{background:P.card,borderRadius:24,padding:44,border:`2px solid ${P.o}`,position:"relative",boxShadow:`0 16px 60px rgba(212,98,43,0.1)`,fontFamily:"'DM Sans',sans-serif"}}>
          <div style={{position:"absolute",top:-15,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#D4622B,#B8491F)",color:"#fff",padding:"7px 24px",borderRadius:100,fontSize:11,fontWeight:700,letterSpacing:"0.08em",boxShadow:"0 4px 16px rgba(212,98,43,0.25)"}}>MOST POPULAR</div>
          <div style={{fontSize:12,fontWeight:700,color:P.o,letterSpacing:"0.12em",marginBottom:10}}>PREMIUM</div>
          <div style={{fontSize:52,fontWeight:800,color:P.ch,letterSpacing:"-0.03em"}}>$10<span style={{fontSize:18,color:P.wg,fontWeight:400}}>/mo</span></div>
          <p style={{color:P.wg,fontSize:14,margin:"8px 0 32px",fontWeight:300}}>Everything you need to dominate RVA</p>
          {["Everything in Free, plus:","Weekly promo ad to 4,100+ members","Priority booking notifications","Verified ✓ badge","Analytics dashboard","Unlimited posts","Featured in search results","Direct messaging","Event priority placement","Booking responses shown first"].map((f,i)=><div key={f} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:`1px solid ${P.lg}`}}><span style={{color:i===0?P.o:P.gn,fontSize:14}}>{i===0?"★":"✓"}</span><span style={{color:P.ch,fontSize:14,fontWeight:i===0?700:400}}>{f}</span></div>)}
          <PBtn full s="lg" style={{marginTop:32}} onClick={()=>go("/member")}>Get Premium</PBtn>
        </div>
      </div>
      {/* Social proof */}
      <div style={{textAlign:"center",marginTop:56}} className="anim-fade-up d4">
        <p style={{color:P.wg,fontSize:13,marginBottom:20,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.05em",fontWeight:500}}>TRUSTED BY RICHMOND'S BEST</p>
        <div style={{display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap"}}>
          {TRUCKS.filter(t=>t.plan==="premium").slice(0,5).map(t=><div key={t.id} style={{display:"flex",alignItems:"center",gap:8,color:P.wg,fontFamily:"'DM Sans',sans-serif"}}><span style={{fontSize:22}}>{t.img}</span><span style={{fontSize:13,fontWeight:500}}>{t.name}</span></div>)}
        </div>
      </div>
    </div>
  </section>;
}

// ─── About Page ──────────────────────────────────────────────────────────
function AboutPage({go}){
  return<section style={{minHeight:"100vh",background:P.bg,padding:"120px 48px 80px"}}>
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div className="anim-fade-up">
        <h2 style={{fontSize:56,fontWeight:900,color:P.ch,fontFamily:"'Playfair Display',serif",margin:"0 0 28px",lineHeight:1.08,letterSpacing:"-0.03em"}}>Richmond Deserves<br/>Better <span style={{color:P.o,fontStyle:"italic"}}>Food Truck</span> Culture</h2>
        <p style={{fontSize:19,color:P.wg,fontFamily:"'DM Sans',sans-serif",lineHeight:1.85,marginBottom:32,fontWeight:300}}>
          Find a Food Truck RVA started with a simple question: why is it so hard to find a food truck in Richmond? Trucks were scattered across social media, events had no central hub, and customers were left guessing.
        </p>
        <p style={{fontSize:19,color:P.wg,fontFamily:"'DM Sans',sans-serif",lineHeight:1.85,marginBottom:44,fontWeight:300}}>
          We're building the operating system for Richmond's food truck scene. One platform where every truck, every event, and every hungry customer is connected.
        </p>

        {/* Mission block */}
        <div className="anim-fade-up d2" style={{background:P.hero,borderRadius:24,padding:48,color:"#fff",marginBottom:44,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:"-30%",right:"-10%",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(212,98,43,0.08),transparent)",filter:"blur(40px)"}}/>
          <div style={{position:"relative"}}>
            <div style={{display:"inline-flex",padding:"5px 14px",borderRadius:100,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",marginBottom:20}}>
              <span style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:600,letterSpacing:"0.12em",fontFamily:"'DM Sans',sans-serif"}}>OUR MISSION</span>
            </div>
            <p style={{fontSize:20,color:"rgba(255,255,255,0.55)",fontFamily:"'Playfair Display',serif",lineHeight:1.8,fontStyle:"italic",margin:0}}>
              To make Richmond the #1 food truck city in America by giving truck owners the tools to grow, event hosts the access to vendors, and customers the easiest way to find incredible food on wheels.
            </p>
          </div>
        </div>

        <div className="anim-fade-up d3 about-mission-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18,marginBottom:44}}>
          {[["🚚","For Trucks","Free tools to reach 4,100+ customers. Premium tier for serious growth."],["📅","For Hosts","Post events, find vetted vendors, manage applications in one place."],["🍔","For You","Real-time locations, reviews, one-click booking for any event."]].map(([icon,title,desc])=>
            <div key={title} className="card-hover" style={{background:P.card,borderRadius:18,padding:30,border:`1.5px solid ${P.lg}`,fontFamily:"'DM Sans',sans-serif"}}>
              <div style={{fontSize:32,marginBottom:14}}>{icon}</div>
              <h4 style={{fontSize:16,fontWeight:700,color:P.ch,marginBottom:8}}>{title}</h4>
              <p style={{color:P.wg,fontSize:14,lineHeight:1.65,fontWeight:300}}>{desc}</p>
            </div>
          )}
        </div>

        <div style={{textAlign:"center",padding:"44px 0",borderTop:`1px solid ${P.lg}`}}>
          <p style={{color:P.wg,fontSize:16,marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>Founded by <strong style={{color:P.ch,fontWeight:700}}>Ron Joseph</strong></p>
          <p style={{color:P.wg,fontSize:14,fontFamily:"'DM Sans',sans-serif",fontWeight:300}}>Richmond, Virginia · Est. 2026</p>
          <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:28}}>
            <PBtn onClick={()=>go("/trucks")}>Find Trucks</PBtn>
            <PBtn v="outline" onClick={()=>go("/pricing")}>Join as Vendor</PBtn>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

// ─── Footer ──────────────────────────────────────────────────────────────
function Footer({go}){
  return<footer style={{background:P.hero,padding:"64px 48px 40px"}}>
    <div className="footer-grid" style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"2.5fr 1fr 1fr 1fr",gap:48}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#D4622B,#B8491F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
            <span style={{filter:"brightness(10)"}}>🚚</span>
          </div>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:18,color:"#fff"}}>FAFT <span style={{color:P.o,fontStyle:"italic"}}>RVA</span></span>
        </div>
        <p style={{color:"rgba(255,255,255,0.3)",fontSize:14,lineHeight:1.75,maxWidth:300,fontFamily:"'DM Sans',sans-serif",fontWeight:300}}>Richmond's premier food truck community. Connecting trucks, events, and hungry customers since 2026.</p>
      </div>
      {[["DISCOVER",[["Find Trucks","/trucks"],["Events","/events"],["Book a Truck","/book"]]],["VENDORS",[["Pricing","/pricing"],["Truck Login","/member"],["About","/about"]]],["CONNECT",[["Facebook Group","#"],["Instagram","#"],["info@faftrva.com","#"]]]].map(([title,items])=>
        <div key={title}>
          <h4 style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700,letterSpacing:"0.14em",marginBottom:20,fontFamily:"'DM Sans',sans-serif"}}>{title}</h4>
          {items.map(([l,t])=><div key={l} onClick={()=>t.startsWith("/")?go(t):null} style={{color:"rgba(255,255,255,0.3)",fontSize:14,cursor:t.startsWith("/")?"pointer":"default",padding:"5px 0",fontFamily:"'DM Sans',sans-serif",fontWeight:300,transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.6)"} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>{l}</div>)}
        </div>
      )}
    </div>
    <div style={{maxWidth:1280,margin:"44px auto 0",paddingTop:24,borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{color:"rgba(255,255,255,0.2)",fontSize:12,fontFamily:"'DM Sans',sans-serif"}}>© 2026 Find a Food Truck RVA. All rights reserved.</span>
      <span onClick={()=>go("/admin")} style={{color:"rgba(255,255,255,0.08)",fontSize:11,cursor:"pointer",fontFamily:"'JetBrains Mono',monospace"}}>admin</span>
    </div>
  </footer>;
}


// ═══════════════════════════════════════════════════════════════════════════
// MEMBER DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function MemberLogin({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const submit=()=>{if(onLogin(pw)){setErr(false)}else{setErr(true);setPw("")}};
  return<div style={{minHeight:"100vh",background:P.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
    <div className="anim-scale" style={{width:420,padding:52,borderRadius:28,background:P.card,border:`1.5px solid ${P.lg}`,textAlign:"center",boxShadow:"0 24px 80px rgba(0,0,0,0.06)"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 28px",background:"linear-gradient(135deg,#D4622B,#B8491F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:"0 8px 24px rgba(212,98,43,0.2)"}}>🚚</div>
      <h2 style={{color:P.ch,fontSize:24,fontWeight:800,margin:"0 0 8px",fontFamily:"'Playfair Display',serif"}}>Truck Owner Portal</h2>
      <p style={{color:P.wg,fontSize:14,margin:"0 0 36px",fontWeight:300}}>Manage your profile, menu & bookings</p>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" style={{width:"100%",padding:15,borderRadius:14,border:`1.5px solid ${err?P.rd:P.lg}`,background:P.inputBg,color:P.ch,fontSize:15,textAlign:"center",letterSpacing:3,fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",transition:"all 0.3s"}}/>
      {err&&<div style={{color:P.rd,fontSize:12,marginTop:10,fontWeight:500}}>Invalid password</div>}
      <button onClick={submit} style={{width:"100%",marginTop:18,padding:15,borderRadius:14,background:"linear-gradient(135deg,#D4622B,#B8491F)",color:"#fff",fontSize:15,fontWeight:600,boxShadow:"0 4px 20px rgba(212,98,43,0.2)",fontFamily:"'DM Sans',sans-serif"}}>Enter Dashboard</button>
    </div>
  </div>;
}

function MemberDash({go}){
  const[tab,setTab]=useState("profile");const truck=TRUCKS[0];
  const[profile,setProfile]=useState({name:truck.name,cuisine:truck.cuisine,owner:truck.owner,phone:truck.phone,desc:truck.desc,price:truck.price,schedule:truck.schedule,location:truck.location});
  const[menu,setMenu]=useState(truck.menu||[]);const[newItem,setNewItem]=useState({name:"",price:"",desc:""});
  const[saved,setSaved]=useState(false);const[locData,setLocData]=useState({address:"",hours:"",special:""});
  const save=()=>{setSaved(true);setTimeout(()=>setSaved(false),2500)};

  return<div style={{minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif"}}>
    {/* Top bar */}
    <div style={{background:P.card,borderBottom:`1px solid ${P.lg}`,padding:"12px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:32,height:32,borderRadius:8,background:"linear-gradient(135deg,#D4622B,#B8491F)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}><span style={{filter:"brightness(10)"}}>🚚</span></div>
        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:800,fontSize:16,color:P.ch}}>FAFT <span style={{color:P.o,fontStyle:"italic"}}>RVA</span></span>
        <span style={{color:P.divider}}>|</span>
        <span style={{color:P.wg,fontSize:13,fontWeight:400}}>Truck Dashboard</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:13,color:P.wg,fontWeight:400}}>👋 {truck.owner}</span>
        <span style={{background:P.badge,color:P.warmDark,padding:"4px 14px",borderRadius:100,fontSize:11,fontWeight:700}}>★ PREMIUM</span>
        <span onClick={()=>go("/")} style={{color:P.wg,fontSize:13,cursor:"pointer",fontWeight:500}} className="link-hover">← Back to site</span>
      </div>
    </div>
    <div style={{maxWidth:1000,margin:"0 auto",padding:"36px 24px"}}>
      {/* Tabs */}
      <div className="member-tabs" style={{display:"flex",gap:4,marginBottom:32,background:P.cr,borderRadius:14,padding:4}}>
        {[{id:"profile",l:"🚚 Profile & Menu"},{id:"location",l:"📍 Post Location"},{id:"bookings",l:"📋 Bookings"},{id:"analytics",l:"📊 Analytics"}].map(t=>
          <div key={t.id} onClick={()=>setTab(t.id)} style={{padding:"12px 24px",borderRadius:10,cursor:"pointer",background:tab===t.id?P.card:"transparent",color:tab===t.id?P.ch:P.wg,fontSize:14,fontWeight:tab===t.id?600:400,boxShadow:tab===t.id?"0 2px 12px rgba(0,0,0,0.04)":"none",transition:"all 0.25s",whiteSpace:"nowrap"}}>{t.l}</div>)}
      </div>
      {saved&&<div className="anim-fade" style={{background:"rgba(22,163,74,0.08)",border:`1px solid rgba(22,163,74,0.15)`,borderRadius:14,padding:"14px 22px",marginBottom:20,color:P.gn,fontSize:14,fontWeight:600}}>✓ Changes saved successfully!</div>}

      {tab==="profile"&&<div className="anim-fade-up member-content-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
        <div style={{background:P.card,borderRadius:20,padding:32,border:`1.5px solid ${P.lg}`}}>
          <h3 style={{fontSize:18,fontWeight:700,color:P.ch,marginBottom:24,fontFamily:"'Playfair Display',serif"}}>Truck Profile</h3>
          {[["Truck Name","name"],["Cuisine","cuisine"],["Owner","owner"],["Phone","phone"],["Schedule","schedule"],["Price Range","price"]].map(([l,k])=>
            <FInput key={k} label={l} value={profile[k]} onChange={e=>setProfile({...profile,[k]:e.target.value})}/>
          )}
          <FInput label="Description" value={profile.desc} onChange={e=>setProfile({...profile,desc:e.target.value})} textarea rows={3}/>
          <PBtn full onClick={save}>Save Profile</PBtn>
        </div>
        <div style={{background:P.card,borderRadius:20,padding:32,border:`1.5px solid ${P.lg}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}><h3 style={{fontSize:18,fontWeight:700,color:P.ch,fontFamily:"'Playfair Display',serif"}}>Menu ({menu.length})</h3></div>
          {menu.map((m,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"start",padding:"12px 0",borderBottom:`1px solid ${P.lg}`}}>
            <div><div style={{color:P.ch,fontWeight:600,fontSize:14}}>{m.name}</div><div style={{color:P.wg,fontSize:12,marginTop:3,fontWeight:300}}>{m.desc}</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}><span style={{color:P.o,fontWeight:700,fontSize:14}}>${m.price}</span><span onClick={()=>setMenu(menu.filter((_,j)=>j!==i))} style={{color:P.rd,cursor:"pointer",fontSize:16,opacity:0.6,transition:"opacity 0.2s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.6}>✕</span></div>
          </div>)}
          <div style={{marginTop:20,padding:18,background:P.cr,borderRadius:14}}>
            <div style={{fontSize:12,fontWeight:600,color:P.ch,marginBottom:10,letterSpacing:"0.02em"}}>Add Item</div>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8,marginBottom:8}}>
              <input value={newItem.name} onChange={e=>setNewItem({...newItem,name:e.target.value})} placeholder="Item name" style={{padding:"10px 14px",borderRadius:10,border:`1.5px solid ${P.lg}`,fontSize:13,background:P.card,fontFamily:"'DM Sans',sans-serif",color:P.ch}}/>
              <input value={newItem.price} onChange={e=>setNewItem({...newItem,price:e.target.value})} placeholder="$" type="number" style={{padding:"10px 14px",borderRadius:10,border:`1.5px solid ${P.lg}`,fontSize:13,background:P.card,fontFamily:"'DM Sans',sans-serif",color:P.ch}}/>
            </div>
            <input value={newItem.desc} onChange={e=>setNewItem({...newItem,desc:e.target.value})} placeholder="Description" style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${P.lg}`,fontSize:13,boxSizing:"border-box",marginBottom:10,background:P.card,fontFamily:"'DM Sans',sans-serif",color:P.ch}}/>
            <PBtn s="sm" full onClick={()=>{if(newItem.name&&newItem.price){setMenu([...menu,{...newItem,price:Number(newItem.price)}]);setNewItem({name:"",price:"",desc:""})}}}>+ Add Item</PBtn>
          </div>
        </div>
      </div>}

      {tab==="location"&&<div className="anim-fade-up" style={{maxWidth:560}}>
        <div style={{background:P.card,borderRadius:20,padding:36,border:`1.5px solid ${P.lg}`}}>
          <h3 style={{fontSize:18,fontWeight:700,color:P.ch,marginBottom:6,fontFamily:"'Playfair Display',serif"}}>📍 Post Today's Location</h3>
          <p style={{color:P.wg,fontSize:14,marginBottom:28,fontWeight:300}}>Let 4,100+ customers know where to find you</p>
          <FInput label="Location / Address" value={locData.address} onChange={e=>setLocData({...locData,address:e.target.value})} placeholder="e.g. Shockoe Bottom near 17th St"/>
          <FInput label="Hours Today" value={locData.hours} onChange={e=>setLocData({...locData,hours:e.target.value})} placeholder="e.g. 11am - 3pm"/>
          <FInput label="Today's Special" value={locData.special} onChange={e=>setLocData({...locData,special:e.target.value})} placeholder="e.g. 🔥 Half-price brisket tacos!"/>
          <PBtn full s="lg" onClick={save}>📍 Post Location</PBtn>
        </div>
      </div>}

      {tab==="bookings"&&<div className="anim-fade-up">
        <h3 style={{fontSize:18,fontWeight:700,color:P.ch,marginBottom:20,fontFamily:"'Playfair Display',serif"}}>Open Requests</h3>
        {BOOKINGS.map(b=><div key={b.id} className="card-hover" style={{background:P.card,borderRadius:18,padding:28,border:`1.5px solid ${P.lg}`,marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"start"}}>
            <div>
              <div style={{fontWeight:700,color:P.ch,fontSize:17}}>{b.who} — {b.eventType||b.type}</div>
              <div className="booking-meta" style={{display:"flex",gap:16,color:P.wg,fontSize:13,marginTop:6,fontWeight:400}}>
                <span>📅 {b.date}</span><span>📍 {b.location}</span><span>👥 {b.guests}</span><span>💰 {b.budget}</span>
              </div>
              {b.notes&&<div style={{color:P.wg,fontSize:13,marginTop:10,fontStyle:"italic",fontWeight:300,background:P.cr,padding:"10px 14px",borderRadius:10}}>"{b.notes}"</div>}
            </div>
            <span style={{background:"rgba(22,163,74,0.08)",color:P.gn,padding:"5px 14px",borderRadius:100,fontSize:11,fontWeight:700,letterSpacing:"0.05em",flexShrink:0}}>OPEN</span>
          </div>
          <div style={{marginTop:18,display:"flex",gap:10}}><PBtn s="sm">Respond with Quote</PBtn><PBtn v="secondary" s="sm">Pass</PBtn></div>
        </div>)}
      </div>}

      {tab==="analytics"&&<div className="anim-fade-up">
        <div className="stat-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:28}}>
          {[["👁","Views","1,240","↑ 12% this week"],["★","Rating",String(truck.rating),"234 reviews"],["📋","Bookings",String(truck.bookings),"this month"],["💰","Revenue",`$${truck.revenue.toLocaleString()}`,"this month"]].map(([ic,lb,vl,sb])=>
            <div key={lb} className="card-hover" style={{background:P.card,borderRadius:18,padding:28,border:`1.5px solid ${P.lg}`,textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:10}}>{ic}</div>
              <div style={{fontSize:30,fontWeight:800,color:P.ch}}>{vl}</div>
              <div style={{fontSize:12,color:P.wg,marginTop:6,fontWeight:300}}>{sb}</div>
              <div style={{fontSize:10,color:P.wg,marginTop:10,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>{lb}</div>
            </div>)}
        </div>
      </div>}
    </div>
  </div>;
}


// ═══════════════════════════════════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════════════════════════════════
function AdminLogin({onLogin}){
  const[pw,setPw]=useState("");const[err,setErr]=useState(false);
  const submit=()=>{if(onLogin(pw)){setErr(false)}else{setErr(true);setPw("")}};
  return<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
    <div className="anim-scale" style={{width:400,padding:44,borderRadius:22,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.06)",textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 28px",background:`linear-gradient(135deg,${T.o},${T.am})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,boxShadow:"0 8px 24px rgba(249,115,22,0.2)"}}>🛡️</div>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:700,margin:"0 0 32px",fontFamily:"'Syne',sans-serif"}}>Admin Access</h2>
      <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false)}} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Password" style={{width:"100%",padding:14,borderRadius:14,border:`1.5px solid ${err?"#ef4444":"rgba(255,255,255,0.08)"}`,background:"rgba(255,255,255,0.03)",color:"#fff",fontSize:15,textAlign:"center",letterSpacing:3,boxSizing:"border-box",outline:"none"}}/>
      {err&&<div style={{color:"#ef4444",fontSize:12,marginTop:10}}>Invalid password</div>}
      <button onClick={submit} style={{width:"100%",marginTop:18,padding:14,borderRadius:14,background:`linear-gradient(135deg,${T.o},#ea580c)`,color:"#fff",fontSize:15,fontWeight:600,boxShadow:"0 4px 20px rgba(249,115,22,0.2)"}}>Enter</button>
    </div>
  </div>;
}

function PinGate({onUnlock,onCancel}){
  const[pin,setPin]=useState(["","","",""]);const[err,setErr]=useState(false);
  const digit=(i,v)=>{const np=[...pin];np[i]=v.slice(-1);setPin(np);setErr(false);if(v&&i<3)document.getElementById(`p-${i+1}`)?.focus();
    if(i===3&&v){const f=np.join("");if(f.length===4&&!onUnlock(f)){setErr(true);setPin(["","","",""]);document.getElementById("p-0")?.focus()}}};
  return<div style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    <div className="anim-scale" style={{width:380,padding:44,borderRadius:22,background:"#0c0d11",border:"1px solid rgba(220,38,38,0.12)",textAlign:"center"}}>
      <div style={{width:64,height:64,borderRadius:16,margin:"0 auto 28px",background:"linear-gradient(135deg,#dc2626,#991b1b)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🔐</div>
      <h2 style={{color:"#fff",fontSize:22,fontWeight:700,margin:"0 0 32px",fontFamily:"'Syne',sans-serif"}}>Security PIN</h2>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:20}}>{pin.map((d,i)=><input key={i} id={`p-${i}`} type="password" inputMode="numeric" maxLength={1} value={d} onChange={e=>digit(i,e.target.value)} style={{width:56,height:64,borderRadius:14,fontSize:24,border:`2px solid ${err?"#dc2626":d?"#f97316":"rgba(255,255,255,0.08)"}`,background:"rgba(255,255,255,0.03)",color:"#fff",textAlign:"center",outline:"none",fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}/>)}</div>
      {err&&<div style={{color:"#dc2626",fontSize:12,marginBottom:12}}>Invalid PIN</div>}
      <button onClick={onCancel} style={{background:"transparent",color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:12}}>← Back</button>
    </div>
  </div>;
}

function AdminDash({go}){
  const[st,d]=useReducer(reducer,{view:"dashboard",trucks:TRUCKS,events:EVENTS,bookings:BOOKINGS,pending:PENDING,spam:SPAM_Q,flagged:FLAGGED});
  const[secAuth,setSecAuth]=useState(false);const[showPin,setShowPin]=useState(false);const[time,setTime]=useState(new Date());const[collapsed,setCollapsed]=useState(false);
  useEffect(()=>{const iv=setInterval(()=>setTime(new Date()),1000);return()=>clearInterval(iv)},[]);
  const NAV=[{id:"dashboard",icon:"📊",l:"Dashboard"},{id:"trucks",icon:"🚚",l:"Trucks"},{id:"events",icon:"📅",l:"Events"},{id:"bookings",icon:"📋",l:"Bookings"},{id:"members",icon:"👥",l:"Members"},{id:"ads",icon:"📢",l:"Ads"},{id:"moderation",icon:"🛡️",l:"Moderation"},{id:"settings",icon:"⚙️",l:"Settings"},{id:"security",icon:"🔐",l:"SECURITY"}];
  const bc={members:st.pending.length,moderation:st.spam.length,security:st.flagged.length};
  const handleNav=id=>{if(id==="security"){if(!secAuth)setShowPin(true);else d({type:"SET_VIEW",p:"security"})}else d({type:"SET_VIEW",p:id})};
  const prem=st.trucks.filter(t=>t.plan==="premium").length;

  return<div style={{minHeight:"100vh",background:T.bg,color:"#fff",fontFamily:"'DM Sans',sans-serif",display:"flex"}}>
    <style>{CSS}</style>
    {showPin&&<PinGate onUnlock={pin=>{if(pin===SEC_PIN){setSecAuth(true);setShowPin(false);d({type:"SET_VIEW",p:"security"});return true}return false}} onCancel={()=>setShowPin(false)}/>}

    {/* Sidebar */}
    <div style={{width:collapsed?68:224,background:"rgba(255,255,255,0.012)",borderRight:`1px solid ${T.b}`,padding:"20px 12px",display:"flex",flexDirection:"column",flexShrink:0,transition:"width 0.35s cubic-bezier(0.22,1,0.36,1)"}}>
      <div style={{padding:"0 4px 28px",display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>setCollapsed(!collapsed)}>
        <div style={{width:36,height:36,borderRadius:10,flexShrink:0,background:`linear-gradient(135deg,${T.o},${T.am})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🚚</div>
        {!collapsed&&<div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:14}}>FAFT·RVA</div><div style={{fontSize:9,color:T.td,letterSpacing:"0.12em",fontFamily:"'JetBrains Mono',monospace"}}>ADMIN</div></div>}
      </div>
      <nav style={{flex:1}}>{NAV.map(n=>{const isSec=n.id==="security";return<div key={n.id} onClick={()=>handleNav(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:collapsed?"10px":"9px 12px",borderRadius:10,marginTop:isSec?14:2,cursor:"pointer",background:st.view===n.id?(isSec?T.r:T.o)+"12":"transparent",color:st.view===n.id?(isSec?T.r:T.o):isSec?"rgba(220,38,38,0.35)":T.tm,fontSize:13,fontWeight:st.view===n.id?600:400,borderTop:isSec?`1px solid ${T.b}`:"none",paddingTop:isSec?14:9,justifyContent:collapsed?"center":"flex-start",position:"relative",transition:"all 0.2s"}}>
        {st.view===n.id&&<div style={{position:"absolute",left:0,top:"50%",transform:"translateY(-50%)",width:3,height:18,borderRadius:2,background:isSec?T.r:T.o}}/>}
        <span style={{fontSize:15}}>{n.icon}</span>{!collapsed&&<span style={{flex:1}}>{n.l}</span>}
        {!collapsed&&bc[n.id]>0&&<span style={{minWidth:18,height:18,borderRadius:9,padding:"0 5px",background:isSec?T.cr:T.o,color:"#fff",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{bc[n.id]}</span>}
      </div>})}</nav>
      {!collapsed&&<div style={{paddingTop:14,borderTop:`1px solid ${T.b}`,fontSize:10,color:T.td}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}><div style={{width:6,height:6,borderRadius:3,background:secAuth?T.r:T.td}}/><span>{secAuth?"🔓 Sec Open":"🔒 Sec Locked"}</span></div>
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:"'JetBrains Mono',monospace"}}>{time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"})}</span><span onClick={()=>go("/")} style={{cursor:"pointer"}}>← Site</span></div>
      </div>}
    </div>

    {/* Main content */}
    <div style={{flex:1,padding:"28px 36px",overflowY:"auto",maxHeight:"100vh"}}>
      {/* Dashboard View */}
      {st.view==="dashboard"&&<div className="anim-fade-up">
        <SH title="Command Center" subtitle="Find a Food Truck RVA"/>
        <div style={{background:`linear-gradient(135deg,rgba(249,115,22,0.1),rgba(245,158,11,0.04))`,border:`1px solid ${T.o}20`,borderRadius:18,padding:"24px 32px",marginBottom:28,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:10,color:T.am,fontWeight:600,letterSpacing:"0.12em",fontFamily:"'JetBrains Mono',monospace"}}>MONTHLY RECURRING REVENUE</div><div style={{fontSize:42,fontWeight:800,color:"#fff",marginTop:6}}>${prem*10}<span style={{fontSize:18,color:T.tm}}>/mo</span></div></div>
          <div style={{fontSize:22,fontWeight:700,color:T.g}}>↑ 16.7%</div>
        </div>
        <div className="stat-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          <StatCard icon="👥" label="Members" value="4,100" accent={T.bl}/><StatCard icon="🚚" label="Trucks" value={st.trucks.length} accent={T.o}/><StatCard icon="📅" label="Events" value={st.events.filter(e=>e.status==="upcoming").length} accent={T.pu}/><StatCard icon="📋" label="Bookings" value={st.bookings.filter(b=>b.status==="open").length} accent={T.cy}/>
        </div>
        <div style={{marginTop:28}}><h3 style={{color:"#fff",fontSize:16,marginBottom:14,fontFamily:"'Syne',sans-serif"}}>⚡ Pending Approvals</h3>
          {st.pending.length===0&&<Empty icon="✓" title="All caught up!"/>}
          {st.pending.map(m=><div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${T.b}`}}>
            <div><span style={{color:"#fff",fontWeight:600}}>{m.name}</span><span style={{color:T.td,fontSize:12,marginLeft:12}}>{m.type} · {m.applied}</span></div>
            <div style={{display:"flex",gap:6}}><ABtn s="sm" v="success" onClick={()=>d({type:"APPROVE_MEMBER",p:m.id})}>✓ Approve</ABtn><ABtn s="sm" v="danger" onClick={()=>d({type:"REJECT_MEMBER",p:m.id})}>✕</ABtn></div>
          </div>)}
        </div>
      </div>}

      {/* Trucks View */}
      {st.view==="trucks"&&<div className="anim-fade-up"><SH title="Food Trucks" subtitle={`${st.trucks.length} registered`}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>{st.trucks.map(t=><ACard key={t.id}>
          <div style={{display:"flex",gap:14}}><div style={{width:48,height:48,borderRadius:12,fontSize:24,background:"rgba(255,255,255,0.04)",display:"flex",alignItems:"center",justifyContent:"center"}}>{t.img}</div>
          <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#fff",fontWeight:700,fontSize:15}}>{t.name}</span><Badge color={t.plan==="premium"?T.am:T.tm}>{t.plan==="premium"?"★ $10/mo":"FREE"}</Badge></div>
          <div style={{color:T.tm,fontSize:12,marginTop:3}}>{t.cuisine} · {t.owner} · ★{t.rating}</div>
          <div style={{display:"flex",gap:6,marginTop:10}}><Badge color={t.status==="active"?T.g:"#666"}>● {t.status.toUpperCase()}</Badge>{t.verified&&<Badge color={T.bl}>✓ Verified</Badge>}</div></div></div>
        </ACard>)}</div>
      </div>}

      {/* Moderation View */}
      {st.view==="moderation"&&<div className="anim-fade-up"><SH title="Moderation Queue"/>
        {st.spam.length===0&&<Empty icon="🛡️" title="All clear — no items to review"/>}
        {st.spam.map(s=><ACard key={s.id} style={{marginBottom:12,borderLeft:`3px solid ${T.r}`}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}>
            <div style={{color:"#fff",fontWeight:600,marginBottom:6}}>{s.author} <span style={{color:T.td,fontWeight:400,fontSize:12}}>{s.time}</span></div>
            <div style={{padding:"10px 14px",background:"rgba(0,0,0,0.2)",borderRadius:10,color:"rgba(255,255,255,0.55)",fontSize:13,marginBottom:10,fontFamily:"'JetBrains Mono',monospace"}}>{s.content}</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1}}><ProgressBar value={s.conf} color={T.r}/></div><span style={{color:T.r,fontSize:12,fontWeight:700}}>{s.conf}%</span><span style={{color:T.td,fontSize:11}}>{s.reason}</span></div>
          </div><div style={{display:"flex",gap:6,marginLeft:16,flexShrink:0}}><ABtn s="sm" v="success" onClick={()=>d({type:"KEEP_SPAM",p:s.id})}>✓ Keep</ABtn><ABtn s="sm" v="danger" onClick={()=>d({type:"REMOVE_SPAM",p:s.id})}>🗑️ Remove</ABtn></div></div>
        </ACard>)}
      </div>}

      {/* Security View */}
      {st.view==="security"&&secAuth&&<div className="anim-fade-up">
        <SH title="🛡️ Security Center" subtitle="OWNER ONLY" action={<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 16px",borderRadius:10,background:T.am+"12",border:`1px solid ${T.am}25`}}><div style={{width:8,height:8,borderRadius:"50%",background:T.am,animation:"pulse 2s infinite"}}/><span style={{color:T.am,fontSize:12,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",letterSpacing:"0.08em"}}>ELEVATED</span></div>}/>
        <div className="stat-grid-4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
          <StatCard icon="🚨" label="Flagged" value={st.flagged.length} accent={T.r}/><StatCard icon="🗑️" label="Auto-Blocked" value="87%" accent={T.g}/><StatCard icon="⚡" label="Response" value="8m" accent={T.cy}/><StatCard icon="⚔️" label="Raids Blocked" value="4" accent={T.pu}/>
        </div>
        {st.flagged.length===0&&<Empty icon="🛡️" title="All Clear — No flagged content"/>}
        {st.flagged.map(f=>{const mx=Math.max(...f.threats.map(t=>t.conf));return<ACard key={f.id} style={{marginBottom:12,borderLeft:`4px solid ${mx>=90?T.cr:T.r}`}}>
          <div style={{display:"flex",justifyContent:"space-between"}}><div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}><span style={{color:"#fff",fontWeight:700}}>{f.author}</span><Badge color={TRUST_LEVELS[f.trust].color}>{TRUST_LEVELS[f.trust].icon} L{f.trust}</Badge><span style={{color:T.td,fontSize:11}}>{f.ts}</span></div>
            <div style={{padding:"12px 16px",background:"rgba(0,0,0,0.2)",borderRadius:10,color:"rgba(255,255,255,0.55)",fontSize:13,marginBottom:12,borderLeft:`3px solid ${T.r}`,fontFamily:"'JetBrains Mono',monospace"}}>{f.content}</div>
            <div style={{display:"flex",gap:6,marginBottom:12}}>{f.threats.map((t,i)=><Badge key={i} color={t.conf>=80?T.r:T.am} glow={t.conf>=90}>{t.type}: {t.conf}%</Badge>)}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>{[["IP",f.ip],["Device",f.device],["Age",f.age],["Posts",f.posts]].map(([l,v])=><div key={l} style={{background:"rgba(255,255,255,0.025)",borderRadius:8,padding:10}}><div style={{fontSize:9,color:T.td,textTransform:"uppercase",letterSpacing:"0.08em"}}>{l}</div><div style={{color:String(v).includes("hour")?T.r:"#fff",fontSize:12,fontFamily:l==="IP"?"'JetBrains Mono',monospace":"inherit",marginTop:3}}>{v}</div></div>)}</div>
          </div><div style={{display:"flex",gap:6,marginLeft:16,flexShrink:0,flexDirection:"column"}}><ABtn s="sm" v="success" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>✓ Safe</ABtn><ABtn s="sm" v="danger" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>🗑️</ABtn><ABtn s="sm" v="critical" onClick={()=>d({type:"REMOVE_FLAG",p:f.id})}>Ban</ABtn></div></div>
        </ACard>})}

        {/* Audit Trail */}
        <h3 style={{color:"#fff",fontSize:16,marginTop:32,marginBottom:14,fontFamily:"'Syne',sans-serif"}}>📜 Audit Trail</h3>
        {AUDIT.map(a=><div key={a.id} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.b}`}}><span style={{fontSize:16}}>{{auto_flag:"🚨",raid_detected:"⚔️",trust_up:"⬆️",ban:"🔨"}[a.act]||"📋"}</span><div style={{flex:1}}><span style={{color:"#fff",fontSize:13}}>{a.detail}</span><div style={{color:T.td,fontSize:11,marginTop:3}}>{a.target} · {a.actor} · {a.ts}</div></div></div>)}

        {/* Member Intel */}
        <h3 style={{color:"#fff",fontSize:16,marginTop:32,marginBottom:14,fontFamily:"'Syne',sans-serif"}}>🔍 Member Intel</h3>
        {INTEL.map(m=><ACard key={m.id} style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}><div style={{width:40,height:40,borderRadius:10,background:m.risk>=60?T.r+"12":T.g+"12",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{m.risk>=80?"🚨":"⚠️"}</div>
              <div><span style={{color:"#fff",fontWeight:700}}>{m.name}</span><div style={{color:T.td,fontSize:12,marginTop:2}}>{m.loc} · {m.posts} posts</div></div></div>
            <div style={{display:"flex",alignItems:"center",gap:10,minWidth:120}}><div style={{flex:1}}><ProgressBar value={m.risk} color={m.risk>=80?T.cr:T.am} h={8}/></div><Badge color={m.risk>=80?T.cr:T.am} glow={m.risk>=80}>{m.risk}</Badge></div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>{m.signals.map((s,i)=><span key={i} style={{color:s.includes("VPN")||s.includes("spam")?T.r:T.am,fontSize:12,fontFamily:"'JetBrains Mono',monospace"}}>● {s}</span>)}</div>
        </ACard>)}
      </div>}

      {/* Placeholder views for remaining tabs */}
      {["events","bookings","members","ads","settings"].includes(st.view)&&<div className="anim-fade-up">
        <SH title={NAV.find(n=>n.id===st.view)?.l||st.view} subtitle="Admin view"/>
        <ACard><Empty icon={NAV.find(n=>n.id===st.view)?.icon||"📋"} title={`${NAV.find(n=>n.id===st.view)?.l} Management`} sub="Full functionality available — data synced with platform."/></ACard>
      </div>}
    </div>
  </div>;
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP — ROOT ROUTER
// ═══════════════════════════════════════════════════════════════════════════
export default function App(){
  const{route,go}=useRouter();
  const[adminAuth,setAdminAuth]=useState(false);
  const[memberAuth,setMemberAuth]=useState(false);

  const isPublic=["/","/trucks","/events","/book","/pricing","/about"].includes(route);

  if(isPublic)return<div style={{fontFamily:"'DM Sans',sans-serif"}}>
    <style>{CSS}</style>
    <div className="grain-overlay"/>
    <PubNav go={go} route={route}/>
    {route==="/"&&<><Hero go={go}/><MarqueeBanner/><Footer go={go}/></>}
    {route==="/trucks"&&<><TruckFinder go={go}/><Footer go={go}/></>}
    {route==="/events"&&<><EventsPage go={go}/><Footer go={go}/></>}
    {route==="/book"&&<><BookingPage go={go}/><Footer go={go}/></>}
    {route==="/pricing"&&<><PricingPage go={go}/><Footer go={go}/></>}
    {route==="/about"&&<><AboutPage go={go}/><Footer go={go}/></>}
  </div>;

  if(route==="/member"){
    if(!memberAuth)return<><style>{CSS}</style><MemberLogin onLogin={pw=>{if(pw===MEMBER_PW){setMemberAuth(true);return true}return false}}/></>;
    return<><style>{CSS}</style><MemberDash go={go}/></>;
  }

  if(route==="/admin"){
    if(!adminAuth)return<><style>{CSS}</style><AdminLogin onLogin={pw=>{if(pw===ADMIN_PW){setAdminAuth(true);return true}return false}}/></>;
    return<AdminDash go={go}/>;
  }

  go("/");return null;
}
